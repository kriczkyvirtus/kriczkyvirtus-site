import { useEffect, useRef, useState } from "react";
import {
  ATTRACT_KEYS, READY_KEYS, DRIVER_KEYS, DRIVER_NAMES, DRIVER_STEPS, ZONES,
  zoneByKey, PILLAR_MAX, routeTo,
} from "./valueDriversData.js";
import { QUICK_WINS, tierFor } from "./valueDriversReportData.js";

/* ═══════════════════════════════════════════════════════════════
   VALUE DRIVERS — THE REPORT   /tools/wmbw/r/:token
   Replaces the old WMBW document. A real document: fixed US-letter portrait
   pages (816 × 1056 px = 8.5 × 11 in at 96 dpi), laid out once and scaled to
   fit the screen — on a phone it reads like a PDF, and printing gives one
   page per sheet. Light (cream) theme, the same system as the light
   workbooks: ink-on-cream type, Cormorant headings with an italic gold
   accent, porcelain icon tiles, white lifted cards. The cover stays dark,
   like the printed workbook covers.
   ═══════════════════════════════════════════════════════════════ */

const PAGE_W = 816, PAGE_H = 1056;

/* Light-theme tokens — from the print pipeline's theme_light.py, so the
   report and the printed workbook match. */
const L = {
  page: "#F2EEE6", desk: "#DDD6C8", card: "#FFFFFF",
  ink: "#0A0E14", ink2: "#3E4652", ink3: "#6B6459", rule: "#C9C2B4", ruleLight: "#E2DBCD",
  gold: "#7A5C1E", goldFill: "#C8A24E",
};
/* Each colour as ink (text on cream), fill (bars, glows) and tint (washes). */
const TONE = {
  red:   { ink: "#B4403F", fill: "#F87171", tint: "#F6E3DF", dark: "#3A1717" },
  amber: { ink: "#9A6A00", fill: "#FBBF24", tint: "#F5EAD0", dark: "#3A2C08" },
  gold:  { ink: "#7A5C1E", fill: "#C8A24E", tint: "#F1E7D0", dark: "#2A2213" },
  green: { ink: "#1B7A57", fill: "#34D399", tint: "#E3EEE6", dark: "#0E2A20" },
  cyan:  { ink: "#0E7490", fill: "#22D3EE", tint: "#E1ECEE", dark: "#0A2A31" },
};
const ZONE_TONE = { foundation: "red", constrained: "amber", midpoint: "gold", green: "green", bestInClass: "cyan" };
/* Driver scores — the same rule as the booking page: red 1–2, gold 3–4, green 5, cyan 6. */
const scoreTone = (n) => TONE[n <= 2 ? "red" : n <= 4 ? "gold" : n === 5 ? "green" : "cyan"];

const ICON = (key) => `/icons/value-drivers/${key}-light.svg`;
const STEP = Object.fromEntries(DRIVER_STEPS.map(s => [s.key, s]));
const sentence = (s) => (s ? s.charAt(0) + s.slice(1).toLowerCase() : "");
/* House style for this document: no em dashes. Text shared with the question
   flow keeps its own punctuation; the report swaps it as it renders. */
const dash = (t) => (typeof t === "string" ? t.replace(/\s*\u2014\s*/g, " - ") : t);
const zoneName = (z) => (z.key === "green" ? "Green Zone" : z.label.replace(" Zone", ""));
/* Score-tinted card: white into the score's tint, a soft glow in its colour,
   brighter on hover. Used for every card that carries a colour. */
const glowCard = (tone, extra = {}) => ({
  border: `1px solid ${tone.fill}55`, background: `linear-gradient(135deg, #FFFFFF 55%, ${tone.tint})`,
  boxShadow: `0 0 22px ${tone.fill}2e, 0 8px 22px rgba(10,14,20,.07)`, "--edge": `${tone.fill}aa`, "--glowHi": `${tone.fill}66`, ...extra,
});

const CSS = `
  .vdr *{box-sizing:border-box}
  .vdr{background:${L.desk};color:${L.ink};font-family:'DM Sans',sans-serif;-webkit-font-smoothing:antialiased;min-height:100vh;
    -webkit-text-size-adjust:100%;text-size-adjust:100%}
  .vdr .page *{-webkit-text-size-adjust:100%;text-size-adjust:100%}
  .vdr .pw{margin:0 auto;position:relative}
  .vdr .page{position:absolute;top:0;left:0;width:${PAGE_W}px;height:${PAGE_H}px;transform-origin:top left;overflow:hidden;
    background:${L.page};box-shadow:0 1px 3px rgba(10,14,20,.10),0 14px 40px rgba(10,14,20,.16);padding:58px 64px 0}
  .vdr .runhead{display:flex;justify-content:space-between;align-items:baseline;font-size:11px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:${L.ink3};margin-bottom:40px}
  .vdr .runhead b{font-family:'Cormorant Garamond',serif;font-size:15px;letter-spacing:.14em;color:${L.ink2};font-weight:600}
  .vdr .folio{position:absolute;left:64px;right:64px;bottom:34px;display:flex;justify-content:space-between;align-items:baseline;
    border-top:1px solid ${L.ruleLight};padding-top:12px;font-size:12px;color:${L.ink3}}
  .vdr .folio b{font-family:'Cormorant Garamond',serif;font-size:14px;letter-spacing:.12em;text-transform:uppercase;font-weight:600}
  .vdr .kicker{font-size:13px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:${L.gold};margin-bottom:10px}
  .vdr h2{font-family:'Cormorant Garamond',serif;font-weight:600;font-size:54px;line-height:1.04;margin:0 0 16px;letter-spacing:-.005em}
  .vdr h2 em{font-weight:500;color:${L.gold}}
  .vdr .lede{font-size:20px;line-height:1.55;color:${L.ink2};margin:0 0 30px;max-width:640px}
  .vdr .card{background:${L.card};border-radius:16px;border:1px solid ${L.ruleLight};
    box-shadow:0 1px 2px rgba(10,14,20,.06),0 10px 26px rgba(10,14,20,.08)}
  .vdr .tile{display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;
    background:linear-gradient(180deg,#FFFEFB 0%,#F7F2E8 100%);border:1px solid #E6DFD1;
    box-shadow:inset 0 1px 0 rgba(255,255,255,.9),0 1px 2px rgba(10,14,20,.06),0 10px 22px rgba(10,14,20,.13)}
  .vdr .tile img{display:block}
  .vdr .num{font-family:'Playfair Display',serif;font-weight:700;line-height:1}
  .vdr .drow{transition:box-shadow .3s ease,border-color .3s ease,transform .3s ease}
  .vdr .cta{transition:box-shadow .3s ease,transform .3s ease}
  /* Hover glows only on devices with a real pointer. On phones a tap would
     trigger them, and the relayout let the browser re-inflate the text. */
  @media (hover:hover) and (pointer:fine){
    .vdr .drow:hover{box-shadow:0 0 0 1px var(--edge),0 0 34px var(--glowHi),0 14px 34px rgba(10,14,20,.10)!important;border-color:var(--edge)!important;transform:translateY(-1px)}
    .vdr .cta:hover{box-shadow:0 0 44px rgba(200,162,78,.55),0 10px 26px rgba(10,14,20,.25)!important;transform:translateY(-1px)}
  }
  .vdr .bar{position:sticky;top:0;z-index:5;display:flex;justify-content:center;gap:10px;padding:10px 12px;background:rgba(221,214,200,.92);backdrop-filter:blur(6px)}
  .vdr .bar button:disabled{opacity:.7;cursor:progress}
  .vdr .bar button{font-family:'DM Sans',sans-serif;font-size:14px;font-weight:700;letter-spacing:.04em;padding:9px 18px;border-radius:9px;cursor:pointer;
    color:#F2EEE6;background:#0A0E14;border:1px solid #0A0E14}
  @page{size:letter;margin:0}
  @media print{
    html,body{background:#fff!important}
    .vdr{background:#fff;min-height:0}
    .vdr .bar,.vdr .glow{display:none!important}
    .vdr .pages{padding:0!important}
    .vdr .pw{width:8.5in!important;height:11in!important;margin:0!important;page-break-after:always;break-after:page}
    .vdr .page{transform:none!important;box-shadow:none;-webkit-print-color-adjust:exact;print-color-adjust:exact}
  }
`;

/* Fit pages to the width available — the same layout on every screen. */
function usePageScale() {
  const ref = useRef(null);
  const [s, setS] = useState(1);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const fit = () => {
      const w = el.clientWidth;
      const gutter = w < 600 ? 10 : 32;
      setS(Math.min(1, (w - gutter * 2) / PAGE_W));
    };
    fit();
    if (typeof ResizeObserver === "undefined") { window.addEventListener("resize", fit); return () => window.removeEventListener("resize", fit); }
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, s];
}

/* ── shared pieces (module scope, so nothing remounts on render) ── */

const Page = ({ s, n, total, right, dark, children }) => (
  <div className="pw" style={{ width: PAGE_W * s, height: PAGE_H * s, marginBottom: 18 * s + 6 }}>
    <div className="page" style={{ transform: `scale(${s})`, ...(dark ? { background: "linear-gradient(160deg,#141B26 0%,#0A0E14 72%)", color: "#E8ECF1" } : {}) }}>
      {!dark && <div className="runhead"><b>Kriczky Virtus</b><span>{right}</span></div>}
      {children}
      {!dark && <div className="folio"><b>Value Drivers Report</b><span>{n} / {total}</span></div>}
    </div>
  </div>
);

const Tile = ({ src, size = 64 }) => (
  <span className="tile" style={{ width: size, height: size, borderRadius: Math.round(size * 0.26) }}>
    <img src={src} alt="" width={Math.round(size * 0.66)} height={Math.round(size * 0.66)} />
  </span>
);

const Pips = ({ value, tone }) => (
  <span style={{ display: "inline-flex", gap: 5 }} aria-hidden="true">
    {[1, 2, 3, 4, 5, 6].map(n => (
      <span key={n} style={{ width: 22, height: 7, borderRadius: 4, background: n <= value ? tone.fill : L.ruleLight }} />
    ))}
  </span>
);

const dateText = (iso) => {
  try { return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }); }
  catch (e) { return ""; }
};

/* ── PAGE 1 · COVER — dark, like the printed workbook covers ── */
function CoverPage({ s, report, zone }) {
  const tone = TONE[ZONE_TONE[zone.key]];
  const who = [report.firstName, report.lastName].filter(Boolean).join(" ");
  const label = { fontSize: 12, fontWeight: 700, letterSpacing: ".18em", textTransform: "uppercase", color: "#8A94A3", marginBottom: 8 };
  return (
    <Page s={s} dark>
      <div className="glow" style={{ position: "absolute", top: "-12%", left: "8%", width: "84%", height: "62%", background: "radial-gradient(ellipse at center, rgba(200,162,78,.17) 0%, transparent 62%)", pointerEvents: "none" }} />
      <div style={{ position: "relative", height: "100%", display: "flex", flexDirection: "column", paddingBottom: 64 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", fontSize: 11, fontWeight: 700, letterSpacing: ".18em", textTransform: "uppercase", color: "#8A94A3" }}>
          <b style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 15, letterSpacing: ".14em", color: "#C8A24E", fontWeight: 600 }}>Kriczky Virtus</b>
          <span>Value Drivers Report</span>
        </div>

        <div style={{ marginTop: 210 }}>
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" style={{ marginBottom: 34 }} aria-hidden="true">
            <path d="M32 8L14 16V30C14 42 22 52 32 56C42 52 50 42 50 30V16L32 8Z" stroke="#C8A24E" strokeWidth="2.2" strokeLinejoin="round" />
          </svg>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 600, fontSize: 80, lineHeight: 1, margin: "0 0 26px", letterSpacing: "-.01em", whiteSpace: "nowrap" }}>
            Your Value <em style={{ color: "#C8A24E", fontWeight: 500 }}>Drivers</em>
          </h1>
          <p style={{ fontSize: 23, lineHeight: 1.5, color: "#A6AFBC", margin: 0, maxWidth: 660 }}>
            The ten things that decide how far, and how sustainably, your business can grow, and where yours stands on each of them today.
          </p>
        </div>

        <div style={{ marginTop: "auto", borderTop: "1px solid rgba(255,255,255,.14)", paddingTop: 30, display: "flex", alignItems: "flex-end", gap: 44 }}>
          <div>
            <div style={label}>Prepared for</div>
            <div style={{ fontSize: 24, fontWeight: 600 }}>{who || "Business owner"}</div>
            {report.company && <div style={{ fontSize: 19, color: "#A6AFBC", marginTop: 2 }}>{report.company}</div>}
          </div>
          {report.createdAt && (
            <div>
              <div style={label}>Scored</div>
              <div style={{ fontSize: 19, color: "#A6AFBC" }}>{dateText(report.createdAt)}</div>
            </div>
          )}
          {/* The pill is a dark version of the zone's colour, like the "Start here" badges. */}
          <span style={{ marginLeft: "auto", display: "inline-block", padding: "12px 22px", borderRadius: 10, background: tone.dark, color: tone.fill,
            border: `1px solid ${tone.fill}88`, fontSize: 15, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", boxShadow: `0 0 24px ${tone.fill}33` }}>
            {zone.label}
          </span>
        </div>
      </div>
    </Page>
  );
}

/* ── PAGE 2 · YOUR ZONE ── */
const SCALE_MIN = 10, SCALE_MAX = 60;
const pct = (v) => ((Math.min(Math.max(v, SCALE_MIN), SCALE_MAX) - SCALE_MIN) / (SCALE_MAX - SCALE_MIN)) * 100;
/* One smooth gradient: each zone's colour sits at the middle of its range and
   blends into the next, rather than hard steps. */
const ZONE_GRADIENT = `linear-gradient(90deg, ${ZONES.map(z => `${TONE[ZONE_TONE[z.key]].ink} ${pct((z.min + z.max) / 2).toFixed(1)}%`).join(", ")})`;

function ZonePage({ s, n, total, report, zone }) {
  const tone = TONE[ZONE_TONE[zone.key]];
  const a = report.attractScore, r = report.readyScore, sum = a + r;
  const gap = a - r;
  const carrying = gap >= 6 ? "Attractiveness" : gap <= -6 ? "Readiness" : null;
  return (
    <Page s={s} n={n} total={total} right="01 · Where you land">
      <div className="kicker">Your zone</div>
      <h2>You're in the <em style={{ color: tone.ink }}>{zone.label}.</em></h2>
      <p className="lede">{dash(zone.line)}</p>

      <div className="card" style={{ padding: "26px 30px 22px", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 22 }}>
          <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase", color: L.ink3 }}>Your total</div>
          <div><span className="num" style={{ fontSize: 64, color: tone.ink }}>{sum}</span><span className="num" style={{ fontSize: 24, color: L.ink3 }}> / 60</span></div>
        </div>
        <div style={{ position: "relative", height: 16, borderRadius: 8, background: ZONE_GRADIENT, boxShadow: "inset 0 1px 2px rgba(10,14,20,.10)" }}>
          <span style={{ position: "absolute", top: -6, left: `${pct(sum)}%`, transform: "translateX(-50%)", width: 28, height: 28, borderRadius: "50%",
            background: "#fff", border: `4px solid ${tone.ink}`, boxShadow: "0 2px 8px rgba(10,14,20,.25)" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: L.ink3, marginTop: 12 }}><span>10</span><span>60</span></div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 10, marginBottom: 20 }}>
        {ZONES.map(z => {
          const t = TONE[ZONE_TONE[z.key]];
          const on = z.key === zone.key;
          return (
            <div key={z.key} style={{ padding: "13px 10px 12px", borderRadius: 12, minHeight: 96,
              background: on ? `linear-gradient(160deg, #141B26 0%, ${t.dark} 100%)` : t.tint,
              border: `1.5px solid ${on ? t.fill : `${t.fill}99`}`,
              boxShadow: on ? `0 0 26px ${t.fill}55, 0 10px 24px rgba(10,14,20,.18)` : "none" }}>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 19, fontWeight: 700, color: on ? t.fill : t.ink, lineHeight: 1.05, whiteSpace: "nowrap", letterSpacing: "-.01em" }}>{zoneName(z)}</div>
              <div className="num" style={{ fontSize: 17, color: on ? "#E8ECF1" : t.ink, marginTop: 6 }}>{z.min}–{z.max}</div>
              {on && <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "#A6AFBC", marginTop: 8 }}>You are here</div>}
            </div>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        {[{ k: "Attractiveness", sub: "How your business looks from the outside", v: a, t: TONE.cyan }, { k: "Readiness", sub: "Whether it's built to scale without breaking", v: r, t: TONE.gold }].map(p => (
          <div key={p.k} className="card" style={{ padding: "18px 24px 18px" }}>
            <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: p.t.ink }}>{p.k}</div>
            <div style={{ fontSize: 16, color: L.ink3, lineHeight: 1.4, margin: "5px 0 16px" }}>{p.sub}</div>
            <div><span className="num" style={{ fontSize: 52, color: p.t.ink }}>{p.v}</span><span className="num" style={{ fontSize: 20, color: L.ink3 }}> / {PILLAR_MAX}</span></div>
            <div style={{ height: 9, borderRadius: 5, background: L.ruleLight, marginTop: 16, overflow: "hidden" }}>
              <div style={{ width: `${(p.v / PILLAR_MAX) * 100}%`, height: "100%", background: `linear-gradient(90deg, ${p.t.dark}, ${p.t.ink})`, borderRadius: 5 }} />
            </div>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 19, lineHeight: 1.55, color: L.ink2, margin: 0 }}>
        {carrying
          ? <><b style={{ color: L.ink }}>{carrying}</b> is carrying your score - {Math.abs(gap)} points ahead of the other lens. The fastest gains usually sit on the weaker side.</>
          : <>Your two lenses are within {Math.abs(gap)} {Math.abs(gap) === 1 ? "point" : "points"} of each other, so gains on either side move your zone.</>}
      </p>
    </Page>
  );
}

/* ── PAGES 3–4 · THE TEN DRIVERS, one lens per page ── */
function DriverRow({ k, n, score }) {
  const t = scoreTone(score);
  const step = STEP[k];
  return (
    <div className="card drow" style={glowCard(t, { display: "flex", alignItems: "center", gap: 22, padding: "13px 24px", marginBottom: 11 })}>
      <Tile src={ICON(k)} size={68} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 27, fontWeight: 700, lineHeight: 1.1 }}>
          <span className="num" style={{ fontSize: 16, color: L.ink3, marginRight: 10, verticalAlign: "3px" }}>{String(n).padStart(2, "0")}</span>{DRIVER_NAMES[k]}
        </div>
        <div style={{ fontSize: 17, color: L.ink3, lineHeight: 1.4, margin: "4px 0 10px" }}>{dash(sentence(step?.subtitle))}</div>
        <Pips value={score} tone={t} />
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <span className="num" style={{ fontSize: 56, color: t.ink }}>{score}</span>
        <span className="num" style={{ fontSize: 20, color: L.ink3 }}>/6</span>
      </div>
    </div>
  );
}

function LensPage({ s, n, total, report, lens }) {
  const scores = report.scores || {};
  const attract = lens === "attract";
  const keys = attract ? ATTRACT_KEYS : READY_KEYS;
  const t = attract ? TONE.cyan : TONE.gold;
  const sub = keys.reduce((sum, k) => sum + (scores[k] || 0), 0);
  return (
    <Page s={s} n={n} total={total} right={attract ? "02 · Your ten drivers" : "02 · Your ten drivers, continued"}>
      <div className="kicker" style={{ color: t.ink }}>{attract ? "Drivers 01–05" : "Drivers 06–10"}</div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 20, marginBottom: 8 }}>
        <h2 style={{ margin: 0 }}>Business <em style={{ color: t.ink }}>{attract ? "Attractiveness" : "Readiness"}</em></h2>
        <span style={{ whiteSpace: "nowrap", paddingBottom: 8 }}><span className="num" style={{ fontSize: 44, color: t.ink }}>{sub}</span><span className="num" style={{ fontSize: 20, color: L.ink3 }}> / 30</span></span>
      </div>
      <p className="lede" style={{ marginBottom: 14 }}>
        {attract
          ? "How your business looks from the outside - its position, revenue, margins, customers, and whether it performs without you."
          : "Whether it's built to scale without breaking - documented, protected, measured, predictable, and led by more than one person."}
        {report.door === "workshop" && attract && " Same order as page 7 of your workbook."}
      </p>
      <div style={{ display: "flex", gap: 22, fontSize: 15, color: L.ink3, marginBottom: 18 }}>
        <span>Scored 1 to 6:</span>
        {[["1–2", TONE.red], ["3–4", TONE.gold], ["5", TONE.green], ["6", TONE.cyan]].map(([l, tt]) => (
          <span key={l} style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
            <span style={{ width: 13, height: 13, borderRadius: 3, background: tt.fill }} />{l}
          </span>
        ))}
      </div>
      {keys.map((k, i) => <DriverRow key={k} k={k} n={(attract ? 0 : 5) + i + 1} score={scores[k] || 0} />)}
    </Page>
  );
}

/* Drivers ranked weakest first; ties keep workbook order. */
const ranked = (scores) => DRIVER_KEYS.map((k, i) => ({ k, i, v: scores?.[k] || 0 }))
  .sort((a, b) => a.v - b.v || a.i - b.i);

const Check = ({ on, tone = TONE.gold }) => (
  <span style={{ flexShrink: 0, width: 22, height: 22, borderRadius: 6, marginTop: 2, display: "inline-flex", alignItems: "center", justifyContent: "center",
    background: on ? tone.fill : "transparent", border: `1.5px solid ${on ? tone.fill : L.rule}` }} aria-hidden="true">
    {on && <svg width="13" height="13" viewBox="0 0 14 14"><path d="M3 7.2L5.8 10L11 4.4" stroke="#0A0E14" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>}
  </span>
);

const Steps = ({ steps }) => steps.map((st, i) => (
  <div key={st.t} style={{ display: "flex", gap: 18, alignItems: "flex-start", padding: "8px 0", borderBottom: i < steps.length - 1 ? `1px solid ${L.ruleLight}` : "none" }}>
    <span className="num" style={{ fontSize: 28, color: `${L.goldFill}aa`, minWidth: 40 }}>0{i + 1}</span>
    <div>
      <div style={{ fontSize: 19, fontWeight: 700, marginBottom: 2 }}>{st.t}</div>
      <div style={{ fontSize: 16, lineHeight: 1.45, color: L.ink2 }}>{st.d}</div>
    </div>
  </div>
));

/* ── PAGE 5 · WHAT THE GAP IS WORTH ──
   ⚠️ CCO: the multiples per zone and the $4M example are illustrative and
   still need compliance sign-off. */
const ZONE_MULTIPLE = { foundation: "Under 3×", constrained: "3–4×", midpoint: "~5×", green: "5–6×", bestInClass: "7–8×" };

function GapPage({ s, n, total, report, zone }) {
  const workshop = report.door === "workshop";
  const gapCard = (label, value, unit, tone, body, bar) => (
    <div className="card drow" style={glowCard(tone, { padding: "16px 24px", marginBottom: 12 })}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
        <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase", color: tone.ink }}>{label}</span>
        <span><span className="num" style={{ fontSize: 44, color: tone.ink }}>{value}</span>{unit && <span style={{ fontSize: 18, color: L.ink3 }}>{unit}</span>}</span>
      </div>
      <p style={{ fontSize: 17, lineHeight: 1.5, color: L.ink2, margin: bar ? "0 0 12px" : 0 }}>{body}</p>
      {bar}
    </div>
  );
  return (
    <Page s={s} n={n} total={total} right="03 · What the gap is worth">
      <div className="kicker">The gap</div>
      <h2>What closing the gap is <em>worth.</em></h2>
      <p className="lede" style={{ fontSize: 18.5, marginBottom: 16 }}>
        An illustration, not a valuation. Two businesses with the same revenue can earn, and be worth, very different amounts depending on how they score on these ten drivers.
        {workshop && " Same gaps as page 8 of your workbook."}
      </p>

      <div className="card" style={{ padding: "16px 22px 14px", marginBottom: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase", color: L.ink3, marginBottom: 10 }}>Where each zone might land</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8 }}>
          {ZONES.map(z => {
            const t = TONE[ZONE_TONE[z.key]]; const on = z.key === zone.key;
            return (
              <div key={z.key} style={{ textAlign: "center", padding: "12px 6px", borderRadius: 10, border: `1.5px solid ${on ? t.fill : `${t.fill}88`}`,
                background: on ? `linear-gradient(160deg, #141B26 0%, ${t.dark} 100%)` : t.tint, boxShadow: on ? `0 0 22px ${t.fill}55` : "none" }}>
                <div className="num" style={{ fontSize: 24, color: on ? t.fill : t.ink }}>{ZONE_MULTIPLE[z.key]}</div>
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", color: on ? "#E8ECF1" : t.ink, marginTop: 6, whiteSpace: "nowrap" }}>{zoneName(z)}</div>
              </div>
            );
          })}
        </div>
        <div style={{ fontSize: 14.5, color: L.ink3, marginTop: 12 }}>Multiples of earnings, on a potential 3–8× range. Your industry's range will differ.</div>
      </div>

      {gapCard("The Profit Gap", "$360K", " / year", TONE.cyan,
        <>A $4M business earning a <b style={{ color: L.ink }}>15% margin</b> ($600K) when the best in its industry might earn <b style={{ color: L.ink }}>24%</b> ($960K). Every year the gap stays open, that's $360K not earned, and not reinvested.</>,
        <div>
          <div style={{ height: 12, borderRadius: 6, background: L.ruleLight, overflow: "hidden" }}>
            <div style={{ width: "62.5%", height: "100%", borderRadius: 6, background: `linear-gradient(90deg, ${TONE.cyan.dark}, ${TONE.cyan.ink})` }} />
          </div>
          <div style={{ position: "relative", height: 18, marginTop: 6, fontSize: 13, color: L.ink3 }}>
            <span style={{ position: "absolute", left: "62.5%", transform: "translateX(-50%)" }}>15% yours</span>
            <span style={{ position: "absolute", right: 0 }}>24% best in class</span>
          </div>
        </div>)}
      {gapCard("The Value Gap", "$5.3M", null, TONE.gold,
        <>That same business at <b style={{ color: L.ink }}>4×</b> its earnings is worth <b style={{ color: TONE.red.ink }}>$2.4M</b>. At best-in-class earnings and <b style={{ color: L.ink }}>8×</b>, it could be worth <b style={{ color: TONE.green.ink }}>$7.7M</b>. Higher earnings and a higher multiple compound each other.</>,
        null)}
      <p style={{ fontSize: 14, lineHeight: 1.55, color: L.ink3, margin: "4px 0 0" }}>
        Illustrative numbers only, using an example $4M business - not a guarantee. Your industry's range of multiples, and where you'd sit in it, can only be set by a formal valuation.
      </p>
    </Page>
  );
}

/* ── PAGE 6 · YOUR PRIORITIES ── */
const PHASES = [
  { key: "p1", test: v => v <= 2, label: "Phase 1 · Foundation gaps", range: "Scored 1–2", target: "Target: 4+", tone: TONE.red,
    d: "These hold everything else back. Until each reaches at least a 4, growth tends to create fragility instead of sustainable compounding potential." },
  { key: "p2", test: v => v === 3, label: "Phase 2 · Below the midpoint", range: "Scored 3", target: "Target: 4–5", tone: TONE.amber,
    d: "Not urgent, but each one quietly limits how far the business can scale. Moving to a 4 is where growth starts to compound sustainably." },
  { key: "p3", test: v => v === 4, label: "Phase 3 · Strengths to sharpen", range: "Scored 4", target: "Target: 5+", tone: TONE.gold,
    d: "Already solid. The step from 4 to 5 is where good businesses become great ones." },
  { key: "p4", test: v => v >= 5, label: "Keep strong", range: "Scored 5–6", target: "Protect", tone: TONE.green,
    d: "Your advantages. Keep them here as the business grows." },
];

function PrioritiesPage({ s, n, total, report }) {
  const r = ranked(report.scores);
  return (
    <Page s={s} n={n} total={total} right="04 · Your opportunities">
      <div className="kicker">Your opportunities for sustainable growth</div>
      <h2>What to work on, <em>in order.</em></h2>
      <p className="lede" style={{ marginBottom: 16 }}>Your drivers sorted by where they stand today. Work top to bottom - a later phase rarely sticks while an earlier one is still open.</p>
      {PHASES.map(ph => {
        const list = r.filter(x => ph.test(x.v));
        if (!list.length) return null;
        return (
          <div key={ph.key} className="card drow" style={glowCard(ph.tone, { padding: "13px 20px 12px", marginBottom: 11 })}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
              <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: ph.tone.ink }}>{ph.label}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: L.ink3 }}>{ph.range} · <span style={{ color: ph.tone.ink }}>{ph.target}</span></span>
            </div>
            <p style={{ fontSize: 15.5, lineHeight: 1.45, color: L.ink2, margin: "4px 0 10px" }}>{ph.d}</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 16px" }}>
              {list.map(x => (
                <div key={x.k} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Tile src={ICON(x.k)} size={36} />
                  <span style={{ flex: 1, fontSize: 16.5, fontWeight: 600, lineHeight: 1.25 }}>{DRIVER_NAMES[x.k]}</span>
                  <span className="num" style={{ fontSize: 22, color: scoreTone(x.v).ink }}>{x.v}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </Page>
  );
}

/* ── PAGE 7 · YOUR FIRST THREE MOVES ── */
function MovesPage({ s, n, total, report }) {
  const three = ranked(report.scores).slice(0, 3);
  return (
    <Page s={s} n={n} total={total} right="05 · Your first three moves">
      <div className="kicker">Start here</div>
      <h2>Your first three <em>moves.</em></h2>
      <p className="lede" style={{ marginBottom: 16 }}>One move for each of your three lowest drivers, matched to how you scored. Small enough to start this week.</p>
      {three.map((x, i) => {
        const win = QUICK_WINS[x.k]?.[tierFor(x.v)]?.[0];
        const t = scoreTone(x.v);
        return (
          <div key={x.k} className="card drow" style={glowCard(t, { padding: "16px 22px", marginBottom: 12 })}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
              <span style={{ padding: "6px 12px", borderRadius: 7, background: TONE.gold.dark, color: L.goldFill, border: `1px solid ${L.goldFill}66`, fontSize: 12, fontWeight: 700, letterSpacing: ".14em" }}>MOVE 0{i + 1}</span>
              <Tile src={ICON(x.k)} size={44} />
              <span style={{ fontSize: 16, fontWeight: 700, color: L.ink2 }}>{DRIVER_NAMES[x.k]} · <span style={{ color: t.ink }}>scored {x.v}/6</span></span>
            </div>
            {win && <>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 25, fontWeight: 700, lineHeight: 1.15, marginBottom: 4 }}>{dash(win.title)}</div>
              <div style={{ fontSize: 16, lineHeight: 1.5, color: L.ink2 }}>{dash(win.context)}</div>
            </>}
          </div>
        );
      })}
      <p style={{ fontSize: 16, lineHeight: 1.5, color: L.ink3, margin: "2px 0 0" }}>
        Each driver has its own page next, weakest first.
      </p>
    </Page>
  );
}

/* ── PAGES 8–17 · DRIVER BY DRIVER, weakest first ── */
function DriverPage({ s, n, total, k, score, checks }) {
  const st = STEP[k];
  const t = scoreTone(score);
  const wins = QUICK_WINS[k]?.[tierFor(score)] || [];
  const idx = DRIVER_KEYS.indexOf(k);
  const lens = ATTRACT_KEYS.includes(k) ? { label: "Business Attractiveness", tone: TONE.cyan } : { label: "Business Readiness", tone: TONE.gold };
  return (
    <Page s={s} n={n} total={total} right="06 · Driver by driver">
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 14 }}>
        <Tile src={ICON(k)} size={76} />
        <div style={{ flex: 1 }}>
          <div className="kicker" style={{ color: lens.tone.ink, marginBottom: 6 }}>Driver {String(idx + 1).padStart(2, "0")} · {lens.label}</div>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 36, fontWeight: 600, lineHeight: 1.05 }}>{dash(st?.title || DRIVER_NAMES[k])}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <span className="num" style={{ fontSize: 56, color: t.ink }}>{score}</span><span className="num" style={{ fontSize: 20, color: L.ink3 }}>/6</span>
          <div style={{ marginTop: 6 }}><Pips value={score} tone={t} /></div>
        </div>
      </div>
      <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: lens.tone.ink, marginBottom: 8 }}>{dash(st?.subtitle)}</div>
      <p style={{ fontSize: 16, lineHeight: 1.55, color: L.ink2, margin: "0 0 14px" }}>{dash(st?.description)}</p>

      <div className="card" style={{ padding: "14px 20px 8px", marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase", color: L.ink3, marginBottom: 4 }}>Example characteristics of a dominant business</div>
        {(st?.checklist || []).map((c, i) => (
          <div key={c.text} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "5px 0" }}>
            <Check on={Boolean(checks?.[i])} tone={t} />
            <span style={{ fontSize: 16, lineHeight: 1.4, color: checks?.[i] ? L.ink : L.ink2 }}>{dash(c.text)}</span>
          </div>
        ))}
      </div>

      <div className="card drow" style={glowCard(t, { padding: "14px 20px 6px" })}>
        <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase", color: L.ink3, marginBottom: 4 }}>Moves for a {score}</div>
        {wins.slice(0, 2).map(w => (
          <div key={w.title} style={{ padding: "5px 0 8px" }}>
            <div style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.3 }}>{dash(w.title)}</div>
            <div style={{ fontSize: 15, lineHeight: 1.45, color: L.ink2 }}>{dash(w.context)}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 15, color: L.ink3, marginTop: 10 }}>What a 6 looks like: <b style={{ color: L.ink2 }}>{st?.highLabel}</b></div>
    </Page>
  );
}

/* ── LAST PAGE · YOUR NEXT STEP + ADVISOR ── */
const ICLOSED_NEXT = (token) => `/tools/wmbw/next${token ? `?t=${encodeURIComponent(token)}` : ""}#vd-scheduler`;
const SKOOL_COLLECTIVE = "https://www.skool.com/virtus-collective";
const NEXT = {
  oneToOne: {
    title: <>Get free hands-on tactical help inside your business to <em>move the needle.</em></>,
    body: "A free working session. We read your ten scores against your actual numbers and see how changes to low hanging fruit might impact your annual profit and sustainable growth opportunities. No pitch, no deck.",
    steps: [
      { t: "We read your results together", d: "Both lenses, and which one is carrying your score." },
      { t: "We pressure-test them against real numbers", d: "Self-reported answers get you a direction. Financials get you an answer." },
      { t: "You leave with your next three moves, ranked", d: "Whether or not we work together after that." },
    ],
    cta: "Book your free working session",
  },
  collective: {
    title: <>Start with the owners already <em>working on this.</em></>,
    body: "The Virtus Collective is where owners at your stage work through exactly these drivers - with the playbooks, and with other owners running them at the same time. It's free.",
    steps: [
      { t: "Courses mapped to the ten drivers", d: "Worked in the order they should be fixed." },
      { t: "Start with your two lowest scores", d: "Your first three moves are already on page 7." },
      { t: "Re-score as the business changes", d: "Come back through Value Drivers. Your zone moves with you." },
    ],
    cta: "Join the Virtus Collective - free",
  },
  workshop: {
    title: <>Bring this to the <em>workshop.</em></>,
    body: "Your scores are the starting point for Station 02. Here's how we'll use them on the day.",
    steps: [
      { t: "Copy your ten scores onto page 7 when you get to the workshop", d: "Station 02 of your workbook - or bring this report up on your phone." },
      { t: "We dive deeper into your two lowest scores", d: "What's behind them, and what moving each one is worth to you." },
      { t: "You leave with your 90-day sprint", d: "Your first moves, written into your Sprint Ledger before you go." },
    ],
  },
};

/* The bio card: dark glass on the cream page, like the workbook's offer cards. */
const BioCard = () => (
  <div className="bio" style={{ position: "relative", overflow: "hidden", display: "flex", gap: 18, alignItems: "flex-start", padding: "18px 22px", borderRadius: 16, marginBottom: 12,
    background: "linear-gradient(160deg,#141B26 0%,#0A0E14 72%)", color: "#E8ECF1", border: `1px solid ${L.goldFill}55`,
    boxShadow: `inset 0 1px 0 rgba(255,255,255,.07), 0 0 30px ${L.goldFill}26, 0 18px 40px rgba(10,14,20,.30)` }}>
    <div className="glow" style={{ position: "absolute", top: "-50%", left: "10%", width: "80%", height: "120%", background: "radial-gradient(ellipse at center, rgba(200,162,78,.16) 0%, transparent 62%)", pointerEvents: "none" }} />
    <img src="/images/edward-kriczky-headshot-240.jpg" alt="Edward Kriczky" width="92" height="92"
      style={{ position: "relative", width: 92, height: 92, borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: `2px solid ${L.goldFill}88` }} />
    <div style={{ position: "relative" }}>
      <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 700, lineHeight: 1.1 }}>Edward Kriczky, CEPA®</div>
      <div style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: L.goldFill, margin: "3px 0 8px" }}>Founder, Kriczky Virtus</div>
      <div style={{ fontSize: 15, lineHeight: 1.5, color: "#C3CAD4" }}>
        We help business owners in the $1M-$10M+ range turn their businesses into <b style={{ color: "#E8ECF1" }}>assets that can generate wealth and give them a life of financial freedom</b> - whether they're building to sell, building to keep, or building to hand down. Building a business that is an asset that runs without you <b style={{ color: "#E8ECF1" }}>shouldn't require doing it alone</b>, let alone guessing where you should reinvest profits to work towards getting there. We have all heard <i>"reinvest back into your business"</i> but nobody shows you how, specifically, for your company. <b style={{ color: L.goldFill }}>We help change that.</b>
      </div>
    </div>
  </div>
);

function NextPage({ s, n, total, report, token }) {
  const key = report.door === "workshop" ? "workshop" : routeTo(report.revenueBand, report.ownerTier);
  const o = NEXT[key];
  const href = key === "collective" ? SKOOL_COLLECTIVE : ICLOSED_NEXT(token);
  return (
    <Page s={s} n={n} total={total} right="07 · Your next step">
      <div className="kicker">Your next step</div>
      <h2 style={{ fontSize: 40, marginBottom: 12 }}>{o.title}</h2>
      <p className="lede" style={{ fontSize: 17.5, lineHeight: 1.5, marginBottom: 2 }}>{o.body}</p>
      <div style={{ marginBottom: o.cta ? 14 : 18 }}><Steps steps={o.steps} /></div>
      {o.cta && (
        <a href={href} className="cta" target={key === "collective" ? "_blank" : undefined} rel="noopener noreferrer"
          style={{ display: "block", textAlign: "center", padding: "15px 20px", borderRadius: 12, textDecoration: "none", marginBottom: 18,
            background: "linear-gradient(160deg,#141B26 0%,#0A0E14 72%)", border: `1.5px solid ${L.goldFill}`, color: L.goldFill,
            fontSize: 18, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", boxShadow: `0 0 22px ${L.goldFill}33` }}>
          {o.cta} →
        </a>
      )}
      <BioCard />
      <p style={{ fontSize: 12, lineHeight: 1.5, color: L.ink3, margin: 0 }}>
        Value Drivers is an educational self-assessment from Kriczky Virtus, based entirely on your own answers. It is general in nature, produces an estimate rather than a valuation, and is not individualized financial, tax, legal, or accounting advice. No outcome is projected or guaranteed.
      </p>
    </Page>
  );
}

/* The PDF is built from the pages themselves: each letter page is drawn at
   2x and placed full-bleed on a letter sheet. That gives the same file on
   every device. Browser printing can't: iPhone Safari adds its own margins
   and header lines, and drops the soft glows on the cover and bio card. */
const fileName = (r) => ("Value Drivers Report" + (r.company ? " - " + r.company : "")).replace(/[\\/:*?"<>|]+/g, "") + ".pdf";

async function buildPdf(root, filename) {
  if (document.fonts && document.fonts.ready) await document.fonts.ready;
  const [h2c, jspdf] = await Promise.all([import("html2canvas"), import("jspdf")]);
  const html2canvas = h2c.default || h2c;
  const JsPDF = jspdf.jsPDF || jspdf.default;
  const pages = Array.from(root.querySelectorAll(".page"));
  const pdf = new JsPDF({ unit: "pt", format: "letter", compress: true });
  for (let i = 0; i < pages.length; i++) {
    const canvas = await html2canvas(pages[i], {
      scale: 2, useCORS: true, logging: false, backgroundColor: "#ffffff",
      width: PAGE_W, height: PAGE_H, windowWidth: PAGE_W + 200,
      onclone: (doc, el) => {
        el.style.transform = "none"; el.style.boxShadow = "none";
        /* the soft radial glows draw as flat boxes in the image, so leave them out */
        el.querySelectorAll(".glow").forEach(g => { g.style.display = "none"; });
        /* an inset highlight draws as a pale inner box, so keep only the outer glow */
        el.querySelectorAll(".bio").forEach(b => { b.style.boxShadow = "0 0 30px rgba(200,162,78,.15), 0 18px 40px rgba(10,14,20,.30)"; });
      },
    });
    if (i) pdf.addPage("letter", "portrait");
    pdf.addImage(canvas.toDataURL("image/jpeg", 0.85), "JPEG", 0, 0, 612, 792, undefined, "FAST");
    canvas.width = 0; canvas.height = 0;
  }
  pdf.save(filename);
}

/* ── the report ── */
export default function ValueDriversReport({ report, token = null }) {
  const zone = zoneByKey(report.zoneKey) || ZONES[0];
  const [ref, s] = usePageScale();
  const [busy, setBusy] = useState(false);
  const order = ranked(report.scores);
  const TOTAL = 7 + order.length + 1;
  return (
    <div className="vdr" ref={ref}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600&family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet" />
      <style>{CSS}</style>
      <div className="bar">
        <button disabled={busy} onClick={async () => {
          setBusy(true);
          try { await buildPdf(ref.current, fileName(report)); }
          catch (e) { window.print(); }
          finally { setBusy(false); }
        }}>{busy ? "Preparing your PDF..." : "Download PDF"}</button>
      </div>
      <div className="pages" style={{ padding: "14px 0 30px" }}>
        <CoverPage s={s} report={report} zone={zone} />
        <ZonePage s={s} n={2} total={TOTAL} report={report} zone={zone} />
        <LensPage s={s} n={3} total={TOTAL} report={report} lens="attract" />
        <LensPage s={s} n={4} total={TOTAL} report={report} lens="ready" />
        <GapPage s={s} n={5} total={TOTAL} report={report} zone={zone} />
        <PrioritiesPage s={s} n={6} total={TOTAL} report={report} />
        <MovesPage s={s} n={7} total={TOTAL} report={report} />
        {order.map((x, i) => (
          <DriverPage key={x.k} s={s} n={8 + i} total={TOTAL} k={x.k} score={x.v} checks={report.checks?.[x.k]} />
        ))}
        <NextPage s={s} n={TOTAL} total={TOTAL} report={report} token={token} />
      </div>
    </div>
  );
}
