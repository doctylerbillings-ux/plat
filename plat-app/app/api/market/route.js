export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { buildMarketInputs } from "@/lib/rentcast/rentcast-adapter.js";

export async function POST(req) {
  const body = await req.json();
  try {
    const data = await buildMarketInputs(body);
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 502 });
  }
}