"use client";

import React, { useState, useMemo } from "react";

/* ── Design tokens ──────────────────────────────────────────────────────── */
const C = {
  paper: "#EDF0F4", card: "#FBFCFD", ink: "#0F1B2D", inkSoft: "#41506A",
  line: "#D2D9E3", subject: "#C56B2F", subjectSoft: "#F3E2D2",
  comp: "#2C6FB0", good: "#2E7D5B", bad: "#B4453A", caution: "#C2902B",
};

/* ── Sample data ────────────────────────────────────────────────────────── */
const MARKETS = [
  { metro: "Charlotte, NC", pop: 2.2, jobs: 2.6, mig: 31, supply: 4.1, fc: 3.9, score: 89 },
  { metro: "Raleigh, NC", pop: 2.3, jobs: 2.9, mig: 22, supply: 4.8, fc: 3.6, score: 86 },
  { metro: "Nashville, TN", pop: 2.0, jobs: 2.8, mig: 28, supply: 5.4, fc: 3.4, score: 84 },
  { metro: "Tampa, FL", pop: 1.9, jobs: 2.4, mig: 30, supply: 4.6, fc: 3.1, score: 81 },
  { metro: "Dallas, TX", pop: 1.7, jobs: 2.7, mig: 40, supply: 5.1, fc: 2.9, score: 80 },
  { metro: "Atlanta, GA", pop: 1.6, jobs: 2.3, mig: 33, supply: 4.3, fc: 3.0, score: 79 },
  { metro: "Austin, TX", pop: 1.8, jobs: 3.1, mig: 34, supply: 6.2, fc: 2.8, score: 78 },
  { metro: "Columbus, OH", pop: 1.1, jobs: 1.9, mig: 14, supply: 3.6, fc: 2.6, score: 74 },
  { metro: "Phoenix, AZ", pop: 1.5, jobs: 2.2, mig: 26, supply: 5.9, fc: 2.1, score: 72 },
  { metro: "Indianapolis, IN", pop: 1.0, jobs: 1.7, mig: 12, supply: 3.1, fc: 2.4, score: 70 },
];

const SUBMARKETS = [
  { name: "Ballantyne", rent: 1840, yoy: 3.8, uc: 620, demand: "Strong" },
  { name: "NoDa", rent: 1760, yoy: 4.2, uc: 540, demand: "Strong" },
  { name: "Plaza Midwood", rent: 1690, yoy: 3.5, uc: 310, demand: "Strong" },
  { name: "Steele Creek", rent: 1560, yoy: 3.1, uc: 720, demand: "Moderate" },
  { name: "University City", rent: 1420, yoy: 2.9, uc: 980, demand: "Moderate" },
  { name: "Uptown", rent: 2180, yoy: 1.6, uc: 1440, demand: "Soft" },
];

const SUBJECT = { name: "The Asher at Ballantyne", units: 288, yearBuilt: 2009, sqft: 985, rent: 1820, tier: "B+" };
const COMPS = [
  { name: "Providence Trace", units: 340, yearBuilt: 2015, sqft: 1040, rent: 2080, tier: "A", sim: 91 },
  { name: "Ballantyne Reserve", units: 312, yearBuilt: 2012, sqft: 1010, rent: 1945, tier: "A-", sim: 88 },
  { name: "Blakeney Crossing", units: 304, yearBuilt: 2013, sqft: 995, rent: 1910, tier: "A-", sim: 86 },
  { name: "Rea Farms Flats", units: 296, yearBuilt: 2019, sqft: 1020, rent: 2150, tier: "A", sim: 79 },
  { name: "Toringdon Park", units: 264, yearBuilt: 2006, sqft: 950, rent: 1760, tier: "B", sim: 77 },
  { name: "Stonecrest Commons", units: 220, yearBuilt: 2001, sqft: 905, rent: 1640, tier: "B-", sim: 64 },
];

const rpsf = (p) => p.rent / p.sqft;
const med = (xs) => { const s = [...xs].sort((a, b) => a - b), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
const money = (n) => "$" + Math.round(n).toLocaleString();

const STAGES = [
  { n: "01", key: "markets", label: "Markets" },
  { n: "02", key: "submarkets", label: "Submarkets" },
  { n: "03", key: "community", label: "Community" },
];

export default function Plat() {
  const [stage, setStage] = useState("markets");
  const [metro, setMetro] = useState("Charlotte, NC");
  const [submarket, setSubmarket] = useState("Ballantyne");

  return (
    <div style={{ background: C.paper, minHeight: "100vh", color: C.ink, fontFamily: "'IBM Plex Sans', system-ui, sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap');
        *{box-sizing:border-box;}
        .mono{font-family:'IBM Plex Mono',monospace;font-variant-numeric:tabular-nums;}
        .row:hover{background:#F1F5F9;}
        .tab{cursor:pointer;transition:color .15s;}
        .scrollx{overflow-x:auto;}
        ::-webkit-scrollbar{height:8px;width:8px;} ::-webkit-scrollbar-thumb{background:#C5CEDA;border-radius:4px;}
        @media (prefers-reduced-motion: reduce){*{transition:none!important;}}
      `}</style>

      <div style={{ background: C.ink, color: "#fff", padding: "0 18px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 52, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
          <span style={{ fontWeight: 700, fontSize: 18, letterSpacing: 0.5 }}>Plat</span>
          <span className="mono" style={{ fontSize: 10, color: "#8FA0B8", letterSpacing: 1, textTransform: "uppercase" }}>Acquisition intel</span>
        </div>
        <div className="mono" style={{ fontSize: 10, color: "#8FA0B8", letterSpacing: 0.5 }}>Census · BLS · HelloData</div>
      </div>

      <div className="scrollx" style={{ background: C.card, borderBottom: `1px solid ${C.line}`, display: "flex", gap: 2, padding: "0 10px" }}>
        {STAGES.map((s) => {
          const on = stage === s.key;
          return (
            <div key={s.key} className="tab" onClick={() => setStage(s.key)}
              style={{ padding: "13px 16px", display: "flex", alignItems: "baseline", gap: 7, borderBottom: `2px solid ${on ? C.subject : "transparent"}`, whiteSpace: "nowrap" }}>
              <span className="mono" style={{ fontSize: 10, color: on ? C.subject : "#9AA6B6" }}>{s.n}</span>
              <span style={{ fontSize: 13, fontWeight: on ? 600 : 500, color: on ? C.ink : C.inkSoft }}>{s.label}</span>
            </div>
          );
        })}
      </div>

      <div className="mono" style={{ maxWidth: 1040, margin: "0 auto", padding: "12px 20px 0", fontSize: 11, color: C.inkSoft }}>
        {stage === "markets" && "All target metros"}
        {stage === "submarkets" && <>{metro}</>}
        {stage === "community" && <>{metro} <span style={{ color: "#9AA6B6" }}>›</span> {submarket} <span style={{ color: "#9AA6B6" }}>›</span> <span style={{ color: C.subject }}>{SUBJECT.name}</span></>}
      </div>

      <div style={{ maxWidth: 1040, margin: "0 auto", padding: "16px 20px 64px" }}>
        {stage === "markets" && <Markets metro={metro} onPick={(m) => { setMetro(m); setStage("submarkets"); }} />}
        {stage === "submarkets" && <Submarkets metro={metro} submarket={submarket} onPick={(s) => { setSubmarket(s); setStage("community"); }} />}
        {stage === "community" && <Community />}
      </div>
    </div>
  );
}

function Markets({ metro, onPick }) {
  const maxScore = Math.max(...MARKETS.map((m) => m.score));
  return (
    <>
      <Head title="Market screen" sub="Ranked by demand fundamentals — population, jobs, migration, and supply pressure. Sourced from free public data." />
      <Card pad={false}>
        <div className="scrollx">
          <div style={{ minWidth: 720 }}>
            <Tr head cols="22px 1.5fr 1fr 0.7fr 0.7fr 0.7fr 0.8fr 0.8fr">
              <span></span><span>Metro</span><span>Score</span><span style={{ textAlign: "right" }}>Pop %</span>
              <span style={{ textAlign: "right" }}>Jobs %</span><span style={{ textAlign: "right" }}>Net mig</span>
              <span style={{ textAlign: "right" }}>Supply</span><span style={{ textAlign: "right" }}>5yr fc</span>
            </Tr>
            {MARKETS.map((m, i) => {
              const sel = m.metro === metro;
              return (
                <div key={m.metro} className="row" onClick={() => onPick(m.metro)}
                  style={{ cursor: "pointer", borderLeft: `3px solid ${sel ? C.subject : "transparent"}` }}>
                  <Tr cols="22px 1.5fr 1fr 0.7fr 0.7fr 0.7fr 0.8fr 0.8fr">
                    <span className="mono" style={{ color: "#9AA6B6", fontSize: 11 }}>{i + 1}</span>
                    <span style={{ fontWeight: 600 }}>{m.metro}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <span style={{ flex: 1, height: 6, background: C.paper, borderRadius: 3, overflow: "hidden" }}>
                        <span style={{ display: "block", height: "100%", width: `${(m.score / maxScore) * 100}%`, background: sel ? C.subject : C.comp }} />
                      </span>
                      <span className="mono" style={{ fontSize: 12, width: 20 }}>{m.score}</span>
                    </span>
                    <Num v={`+${m.pop}`} />
                    <Num v={`+${m.jobs}`} />
                    <Num v={`+${m.mig}k`} />
                    <Num v={`${m.supply}%`} color={m.supply >= 5.5 ? C.caution : C.inkSoft} />
                    <Num v={`+${m.fc}%`} color={C.good} />
                  </Tr>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
      <Note>Supply shown in amber where the construction pipeline is large enough to pressure rent growth. Select a metro to drill into its submarkets.</Note>
    </>
  );
}

function Submarkets({ metro, submarket, onPick }) {
  return (
    <>
      <Head title={`${metro} · submarkets`} sub="Rent levels, momentum, and supply at the submarket scale. Demand reflects renter in-migration and absorption." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(248px, 1fr))", gap: 12 }}>
        {SUBMARKETS.map((s) => {
          const sel = s.name === submarket;
          const dc = s.demand === "Strong" ? C.good : s.demand === "Soft" ? C.bad : C.caution;
          return (
            <div key={s.name} className="row" onClick={() => onPick(s.name)}
              style={{ cursor: "pointer", background: C.card, border: `1px solid ${sel ? C.subject : C.line}`, borderRadius: 6, padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontWeight: 600, fontSize: 15 }}>{s.name}</span>
                <span className="mono" style={{ fontSize: 10, color: dc, border: `1px solid ${dc}`, borderRadius: 3, padding: "1px 6px" }}>{s.demand}</span>
              </div>
              <div className="mono" style={{ fontSize: 26, fontWeight: 600, marginTop: 10 }}>{money(s.rent)}<span style={{ fontSize: 12, color: C.inkSoft, fontWeight: 400 }}> /unit</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontSize: 12, color: C.inkSoft }}>
                <span>Rent YoY <strong className="mono" style={{ color: C.good }}>+{s.yoy}%</strong></span>
                <span>UC <strong className="mono" style={{ color: s.uc > 1000 ? C.caution : C.ink }}>{s.uc.toLocaleString()}</strong></span>
              </div>
            </div>
          );
        })}
      </div>
      <Note>“UC” = units under construction. Tap a submarket to underwrite a community within it.</Note>
    </>
  );
}

function Community() {
  const benchPsf = med(COMPS.map(rpsf));
  const subjPsf = rpsf(SUBJECT);
  const impliedRent = benchPsf * SUBJECT.sqft;
  const gapUnit = impliedRent - SUBJECT.rent;
  const gapPct = (benchPsf - subjPsf) / subjPsf * 100;

  const askPerUnit = 212500, ask = askPerUnit * SUBJECT.units;
  const opexInPlace = 7400, opexBench = 6850;
  const gpr = SUBJECT.rent * 12 * SUBJECT.units;
  const noiInPlace = gpr * 0.94 - opexInPlace * SUBJECT.units;
  const capInPlace = noiInPlace / ask * 100;
  const gprStab = impliedRent * 12 * SUBJECT.units;
  const noiStab = gprStab * 0.95 - opexBench * SUBJECT.units;
  const capStab = noiStab / ask * 100;

  const vals = [SUBJECT, ...COMPS].map(rpsf);
  const lo = Math.min(...vals) * 0.97, hi = Math.max(...vals) * 1.03;
  const pos = (v) => ((v - lo) / (hi - lo)) * 100;

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 6, borderBottom: `2px solid ${C.ink}`, paddingBottom: 12 }}>
        <div>
          <div className="mono" style={{ fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: C.inkSoft }}>Subject community</div>
          <h1 style={{ margin: "3px 0 0", fontSize: 23, fontWeight: 700 }}>{SUBJECT.name}</h1>
        </div>
        <div className="mono" style={{ fontSize: 11, color: C.inkSoft, textAlign: "right" }}>{SUBJECT.units} units · {SUBJECT.yearBuilt} · tier {SUBJECT.tier}<br />asking {money(ask)} · {money(askPerUnit)}/unit</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
        <Verdict label="Rent vs. comp median" big={`${gapPct > 0 ? "+" : ""}${gapPct.toFixed(1)}%`} color={gapPct > 0 ? C.good : C.bad}
          body={<>Subject at <B>${subjPsf.toFixed(2)}/sf</B> vs comp median <B>${benchPsf.toFixed(2)}/sf</B> — about <B style={{ color: C.good }}>{money(gapUnit)}/unit/mo</B> of upside if brought to market.</>} />
        <Verdict label="Cap rate · in-place → stabilized" big={`${capInPlace.toFixed(1)}→${capStab.toFixed(1)}%`} color={C.comp}
          body={<>OpEx runs <B>{money(opexInPlace)}/unit</B> vs a market benchmark of <B>{money(opexBench)}/unit</B> — expense-to-benchmark plus rent-to-market drives the spread.</>} />
      </div>

      <SectionLabel n="01" text="Rent positioning · $/sf" />
      <Card>
        <div style={{ position: "relative", padding: "34px 6px 8px" }}>
          <div style={{ position: "absolute", left: `${pos(benchPsf)}%`, top: 8, bottom: 26, width: 1, borderLeft: `1px dashed ${C.comp}` }} />
          <div className="mono" style={{ position: "absolute", left: `${pos(benchPsf)}%`, top: 0, transform: "translateX(-50%)", fontSize: 10, color: C.comp }}>median ${benchPsf.toFixed(2)}</div>
          <div style={{ position: "relative", height: 50 }}>
            {[SUBJECT, ...COMPS].map((p, i) => {
              const s = p === SUBJECT;
              return (
                <div key={i} title={`${p.name} · $${rpsf(p).toFixed(2)}/sf`} style={{ position: "absolute", left: `${pos(rpsf(p))}%`, top: s ? 0 : 24, transform: "translateX(-50%)", textAlign: "center" }}>
                  <div style={{ width: s ? 15 : 10, height: s ? 15 : 10, borderRadius: "50%", margin: "0 auto", background: s ? C.subject : C.comp, border: `2px solid ${C.card}`, boxShadow: `0 0 0 1px ${s ? C.subject : C.comp}` }} />
                  {s && <div className="mono" style={{ fontSize: 9, marginTop: 3, color: C.subject, fontWeight: 600, whiteSpace: "nowrap" }}>SUBJECT ${subjPsf.toFixed(2)}</div>}
                </div>
              );
            })}
          </div>
          <div className="mono" style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: C.inkSoft }}>
            <span>${lo.toFixed(2)}</span><span>${hi.toFixed(2)}</span>
          </div>
        </div>
      </Card>

      <SectionLabel n="02" text="Comparable communities" />
      <Card pad={false}>
        <div className="scrollx">
          <div style={{ minWidth: 560 }}>
            <Tr head cols="1.6fr 0.7fr 0.6fr 0.7fr 0.8fr 0.7fr">
              <span>Community</span><span style={{ textAlign: "right" }}>Sim</span><span style={{ textAlign: "right" }}>Units</span>
              <span style={{ textAlign: "right" }}>Built</span><span style={{ textAlign: "right" }}>Rent</span><span style={{ textAlign: "right" }}>$/sf</span>
            </Tr>
            {COMPS.map((c) => (
              <Tr key={c.name} cols="1.6fr 0.7fr 0.6fr 0.7fr 0.8fr 0.7fr">
                <span style={{ fontWeight: 500 }}>{c.name} <span className="mono" style={{ color: C.inkSoft, fontSize: 11 }}>· {c.tier}</span></span>
                <span className="mono" style={{ textAlign: "right" }}>
                  <span style={{ padding: "1px 6px", borderRadius: 3, background: c.sim > 80 ? "#E4EFE8" : c.sim > 70 ? "#FBF1E2" : C.paper, color: c.sim > 80 ? C.good : C.ink }}>{c.sim}</span>
                </span>
                <Num v={c.units} /><Num v={c.yearBuilt} /><Num v={money(c.rent)} /><Num v={`$${rpsf(c).toFixed(2)}`} />
              </Tr>
            ))}
          </div>
        </div>
      </Card>

      <SectionLabel n="03" text="Value-add bridge" />
      <Card>
        <Bridge label="In-place NOI" v={money(noiInPlace)} sub={`${capInPlace.toFixed(1)}% cap on ask`} />
        <Bridge label="Rent to market" v={`+${money((impliedRent - SUBJECT.rent) * 12 * SUBJECT.units)}`} sub={`${COMPS.length} comps · median $/sf`} color={C.good} />
        <Bridge label="OpEx to benchmark" v={`+${money((opexInPlace - opexBench) * SUBJECT.units)}`} sub="HelloData expense benchmark" color={C.good} />
        <Bridge label="Stabilized NOI" v={money(noiStab)} sub={`${capStab.toFixed(1)}% cap on ask`} bold last />
      </Card>
      <Note>Sample figures for layout review. Rents and similarity from HelloData comps; OpEx from its expense benchmarks; growth context from the market and submarket screens.</Note>
    </>
  );
}

function Head({ title, sub }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: -0.3 }}>{title}</h1>
      <p style={{ margin: "5px 0 0", fontSize: 13.5, color: C.inkSoft, maxWidth: 620, lineHeight: 1.5 }}>{sub}</p>
    </div>
  );
}
function Card({ children, pad = true }) {
  return <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 6, padding: pad ? 16 : 0, marginTop: 10, overflow: "hidden" }}>{children}</div>;
}
function Tr({ children, cols, head }) {
  return (
    <div className={head ? "mono" : ""} style={{ display: "grid", gridTemplateColumns: cols, gap: 8, padding: head ? "10px 16px" : "11px 16px", alignItems: "center",
      fontSize: head ? 10 : 13, letterSpacing: head ? 0.5 : 0, textTransform: head ? "uppercase" : "none", color: head ? C.inkSoft : C.ink,
      borderBottom: `1px solid ${head ? C.line : C.paper}` }}>{children}</div>
  );
}
function Num({ v, color = C.ink }) {
  return <span className="mono" style={{ textAlign: "right", color, fontSize: 12.5 }}>{v}</span>;
}
function SectionLabel({ n, text }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 9, marginTop: 24 }}>
      <span className="mono" style={{ fontSize: 11, color: "#9AA6B6" }}>{n}</span>
      <span style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: 0.3, textTransform: "uppercase" }}>{text}</span>
    </div>
  );
}
function Verdict({ label, big, body, color }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.line}`, borderLeft: `4px solid ${color}`, borderRadius: 5, padding: "14px 16px" }}>
      <div className="mono" style={{ fontSize: 10, letterSpacing: 0.8, textTransform: "uppercase", color: C.inkSoft }}>{label}</div>
      <div className="mono" style={{ fontSize: 26, fontWeight: 600, color, margin: "2px 0 6px" }}>{big}</div>
      <div style={{ fontSize: 12.5, lineHeight: 1.5, color: C.inkSoft }}>{body}</div>
    </div>
  );
}
function Bridge({ label, v, sub, color = C.ink, bold, last }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "10px 0", borderBottom: last ? "none" : `1px solid #EEF1F5` }}>
      <div><div style={{ fontSize: 13.5, fontWeight: bold ? 700 : 500 }}>{label}</div><div className="mono" style={{ fontSize: 10, color: C.inkSoft }}>{sub}</div></div>
      <div className="mono" style={{ fontSize: bold ? 19 : 16, fontWeight: 600, color }}>{v}</div>
    </div>
  );
}
function B({ children, style }) { return <strong className="mono" style={{ color: C.ink, ...style }}>{children}</strong>; }
function Note({ children }) { return <p className="mono" style={{ fontSize: 11, color: C.inkSoft, marginTop: 10, lineHeight: 1.5 }}>{children}</p>; }
