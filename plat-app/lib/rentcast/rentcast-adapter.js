const BASE = "https://api.rentcast.io/v1";
const API_KEY = process.env.RENTCAST_API_KEY;

if (!API_KEY) console.warn("[rentcast] RENTCAST_API_KEY is not set — requests will 401.");

const DEFAULT_TTL_MS = 1000 * 60 * 60 * 24 * 30;

let cache = (() => {
  const m = new Map();
  return {
    async get(k) { const h = m.get(k); if (!h) return null; if (Date.now() > h.exp) { m.delete(k); return null; } return h.v; },
    async set(k, v, ttl = DEFAULT_TTL_MS) { m.set(k, { v, exp: Date.now() + ttl }); },
  };
})();
export function setCache(c) { cache = c; }

async function rc(path, query = {}, { retries = 2 } = {}) {
  const params = Object.fromEntries(
    Object.entries(query).filter(([, v]) => v !== undefined && v !== null && v !== "")
  );
  const qs = "?" + new URLSearchParams(params).toString();

  for (let attempt = 0; attempt <= retries; attempt++) {
    const res = await fetch(`${BASE}${path}${qs}`, {
      headers: { "X-Api-Key": API_KEY, Accept: "application/json" },
    });

    if (res.status === 429 && attempt < retries) {
      await new Promise((r) => setTimeout(r, 2 ** attempt * 500));
      continue;
    }
    if (res.status === 401) throw new Error("RentCast 401: API key missing or invalid.");
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`RentCast ${path} → ${res.status}: ${body}`);
    }
    return res.json();
  }
}

export async function getRentEstimate(opts = {}) {
  const { address, latitude, longitude, propertyType, bedrooms, bathrooms,
          squareFootage, maxRadius, compCount = 10 } = opts;

  const key = `rc:rent:${address || `${latitude},${longitude}`}:${propertyType || ""}:${bedrooms ?? ""}:${squareFootage ?? ""}:${compCount}`;
  const hit = await cache.get(key);
  if (hit) return hit;

  const data = await rc("/avm/rent/long-term", {
    address, latitude, longitude, propertyType, bedrooms, bathrooms,
    squareFootage, maxRadius, compCount,
  });
  await cache.set(key, data);
  return data;
}

export async function getValueEstimate(opts = {}) {
  const { address, latitude, longitude, propertyType, bedrooms, bathrooms,
          squareFootage, maxRadius, compCount = 10 } = opts;

  const key = `rc:value:${address || `${latitude},${longitude}`}:${propertyType || ""}:${squareFootage ?? ""}:${compCount}`;
  const hit = await cache.get(key);
  if (hit) return hit;

  const data = await rc("/avm/value", {
    address, latitude, longitude, propertyType, bedrooms, bathrooms,
    squareFootage, maxRadius, compCount,
  });
  await cache.set(key, data);
  return data;
}

function normalizeComp(c) {
  return {
    id: c.id,
    name: c.formattedAddress || c.addressLine1 || "Comparable unit",
    rent: c.price ?? null,
    sqft: c.squareFootage ?? null,
    yearBuilt: c.yearBuilt ?? null,
    beds: c.bedrooms ?? null,
    baths: c.bathrooms ?? null,
    units: null,
    tier: null,
    sim: c.correlation != null ? Math.round(c.correlation * 100) : null,
    distance: c.distance ?? null,
    daysOnMarket: c.daysOnMarket ?? null,
    status: c.status ?? null,
  };
}

function absorptionSignal(comps) {
  const active = comps.filter((c) => c.status === "Active" && typeof c.daysOnMarket === "number");
  if (!active.length) return { activeComps: comps.filter(c => c.status === "Active").length, avgDaysOnMarket: null };
  const avg = Math.round(active.reduce((a, c) => a + c.daysOnMarket, 0) / active.length);
  return { activeComps: active.length, avgDaysOnMarket: avg };
}

export async function buildMarketInputs(opts = {}) {
  const { withValue = false, ...avmOpts } = opts;

  const rentData = await getRentEstimate(avmOpts);
  const comps = (rentData.comparables || []).map(normalizeComp);

  const result = {
    subject: {
      address: rentData.subjectProperty?.formattedAddress ?? avmOpts.address ?? null,
      lat: rentData.subjectProperty?.latitude ?? avmOpts.latitude ?? null,
      lng: rentData.subjectProperty?.longitude ?? avmOpts.longitude ?? null,
      sqft: rentData.subjectProperty?.squareFootage ?? avmOpts.squareFootage ?? null,
      yearBuilt: rentData.subjectProperty?.yearBuilt ?? null,
      propertyType: rentData.subjectProperty?.propertyType ?? avmOpts.propertyType ?? null,
    },
    marketRentPerUnit: rentData.rent ?? null,
    rentRange: { low: rentData.rentRangeLow ?? null, high: rentData.rentRangeHigh ?? null },
    comps,
    absorption: absorptionSignal(comps),
  };

  if (withValue) {
    const valueData = await getValueEstimate(avmOpts);
    result.buildingValue = {
      estimate: valueData.price ?? null,
      low: valueData.priceRangeLow ?? null,
      high: valueData.priceRangeHigh ?? null,
    };
  }

  return result;
}

export function communityGPR(unitTypes) {
  const monthly = unitTypes.reduce((sum, u) => sum + (u.rentPerUnit || 0) * (u.count || 0), 0);
  return { monthly, annual: monthly * 12 };
}