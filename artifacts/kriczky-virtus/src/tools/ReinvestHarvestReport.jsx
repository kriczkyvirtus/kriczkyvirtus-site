import { useEffect, useRef, useState } from "react";
import {
  PILLAR_MAX, THRESHOLD, BIZ_KEYS, PERS_KEYS, PILLAR_TONE, scoreToneKey,
  QUADRANTS, getQuadrant, BANDS, ROADMAP, routeTo, DIMS,
} from "./reinvestHarvestReportData.js";
import { VISUALS } from "./reinvestHarvestVisuals.jsx";

/* ═══════════════════════════════════════════════════════════════
   REINVEST OR HARVEST - THE REPORT   /r/:token
   Built the same way as the Value Drivers report: fixed US-letter portrait
   pages (816 × 1056 px = 8.5 × 11 in at 96 dpi), laid out once and scaled to
   fit the screen, so a phone shows the same document a desktop does. Cream
   theme like the light workbooks, dark cover, a real PDF download.
   ═══════════════════════════════════════════════════════════════ */

const PAGE_W = 816, PAGE_H = 1056;

/* Light-theme tokens - from the print pipeline's theme_light.py. */
const L = {
  page: "#F2EEE6", desk: "#DDD6C8", card: "#FFFFFF",
  ink: "#0A0E14", ink2: "#3E4652", ink3: "#6B6459", rule: "#C9C2B4", ruleLight: "#E2DBCD",
  gold: "#7A5C1E", goldFill: "#C8A24E",
};
/* Each colour as ink (text on cream), fill (bars, glows), tint (washes) and dark (pills). */
const TONE = {
  red:   { ink: "#B4403F", fill: "#F87171", tint: "#F6E3DF", dark: "#3A1717" },
  amber: { ink: "#9A6A00", fill: "#FBBF24", tint: "#F5EAD0", dark: "#3A2C08" },
  gold:  { ink: "#7A5C1E", fill: "#C8A24E", tint: "#F1E7D0", dark: "#2A2213" },
  green: { ink: "#1B7A57", fill: "#34D399", tint: "#E3EEE6", dark: "#0E2A20" },
  cyan:  { ink: "#0E7490", fill: "#22D3EE", tint: "#E1ECEE", dark: "#0A2A31" },
  muted: { ink: "#6B6459", fill: "#C9C2B4", tint: "#EEE8DC", dark: "#2A2A2A" },
};
const scoreTone = (n) => TONE[scoreToneKey(n)];
const PILLAR = {
  biz:  { label: "Business Capacity",   tone: TONE[PILLAR_TONE.biz],  keys: BIZ_KEYS,
          sub: "Whether money you put into the company comes back as profit, and whether it can take more work." },
  pers: { label: "Personal Foundation", tone: TONE[PILLAR_TONE.pers], keys: PERS_KEYS,
          sub: "Whether what comes out of the business becomes something outside it that carries you." },
};
const DIM = Object.fromEntries(DIMS.map(d => [d.key, d]));
/* House style for the reports: no em dashes. */
const dash = (t) => (typeof t === "string" ? t.replace(/\s* - \s*/g, " - ") : t);
const glowCard = (tone, extra = {}) => ({
  border: `1px solid ${tone.fill}55`, background: `linear-gradient(135deg, #FFFFFF 55%, ${tone.tint})`,
  boxShadow: `0 0 22px ${tone.fill}2e, 0 8px 22px rgba(10,14,20,.07)`, "--edge": `${tone.fill}aa`, "--glowHi": `${tone.fill}66`, ...extra,
});

const CSS = `
  .rhr *{box-sizing:border-box}
  .rhr{background:${L.desk};color:${L.ink};font-family:'DM Sans',sans-serif;-webkit-font-smoothing:antialiased;min-height:100vh;
    -webkit-text-size-adjust:100%;text-size-adjust:100%}
  .rhr .page *{-webkit-text-size-adjust:100%;text-size-adjust:100%}
  .rhr .pw{margin:0 auto;position:relative}
  .rhr .page{position:absolute;top:0;left:0;width:${PAGE_W}px;height:${PAGE_H}px;transform-origin:top left;overflow:hidden;
    background:${L.page};box-shadow:0 1px 3px rgba(10,14,20,.10),0 14px 40px rgba(10,14,20,.16);padding:58px 64px 0}
  .rhr .runhead{display:flex;justify-content:space-between;align-items:baseline;font-size:11px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:${L.ink3};margin-bottom:40px}
  .rhr .runhead b{font-family:'Cormorant Garamond',serif;font-size:15px;letter-spacing:.14em;color:${L.ink2};font-weight:600}
  .rhr .folio{position:absolute;left:64px;right:64px;bottom:34px;display:flex;justify-content:space-between;align-items:baseline;
    border-top:1px solid ${L.ruleLight};padding-top:12px;font-size:12px;color:${L.ink3}}
  .rhr .folio b{font-family:'Cormorant Garamond',serif;font-size:14px;letter-spacing:.12em;text-transform:uppercase;font-weight:600}
  .rhr .kicker{font-size:13px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:${L.gold};margin-bottom:10px}
  .rhr h2{font-family:'Cormorant Garamond',serif;font-weight:600;font-size:54px;line-height:1.04;margin:0 0 16px;letter-spacing:-.005em}
  .rhr h2 em{font-weight:500;color:${L.gold}}
  .rhr .lede{font-size:20px;line-height:1.55;color:${L.ink2};margin:0 0 30px;max-width:640px}
  .rhr .card{background:${L.card};border-radius:16px;border:1px solid ${L.ruleLight};
    box-shadow:0 1px 2px rgba(10,14,20,.06),0 10px 26px rgba(10,14,20,.08)}
  .rhr .tile{display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;
    background:linear-gradient(180deg,#FFFEFB 0%,#F7F2E8 100%);border:1px solid #E6DFD1;
    box-shadow:inset 0 1px 0 rgba(255,255,255,.9),0 1px 2px rgba(10,14,20,.06),0 10px 22px rgba(10,14,20,.13)}
  .rhr .num{font-family:'Playfair Display',serif;font-weight:700;line-height:1}
  .rhr .drow{transition:box-shadow .3s ease,border-color .3s ease,transform .3s ease}
  .rhr .cta{transition:box-shadow .3s ease,transform .3s ease}
  /* Hover glows only with a real pointer - on phones a tap would trigger them. */
  @media (hover:hover) and (pointer:fine){
    .rhr .drow:hover{box-shadow:0 0 0 1px var(--edge),0 0 34px var(--glowHi),0 14px 34px rgba(10,14,20,.10)!important;border-color:var(--edge)!important;transform:translateY(-1px)}
    .rhr .cta:hover{box-shadow:0 0 44px rgba(200,162,78,.55),0 10px 26px rgba(10,14,20,.25)!important;transform:translateY(-1px)}
  }
  .rhr .bar{position:sticky;top:0;z-index:5;display:flex;justify-content:center;gap:10px;padding:10px 12px;background:rgba(221,214,200,.92);backdrop-filter:blur(6px)}
  .rhr .bar button{font-family:'DM Sans',sans-serif;font-size:14px;font-weight:700;letter-spacing:.04em;padding:9px 18px;border-radius:9px;cursor:pointer;
    color:#F2EEE6;background:#0A0E14;border:1px solid #0A0E14}
  .rhr .bar button.ghost{color:${L.ink};background:transparent;border-color:${L.rule}}
  .rhr .bar button:disabled{opacity:.7;cursor:progress}
  @page{size:letter;margin:0}
  @media print{
    html,body{background:#fff!important}
    .rhr{background:#fff;min-height:0}
    .rhr .bar,.rhr .glow{display:none!important}
    .rhr .pages{padding:0!important}
    .rhr .pw{width:8.5in!important;height:11in!important;margin:0!important;page-break-after:always;break-after:page}
    .rhr .page{transform:none!important;box-shadow:none;-webkit-print-color-adjust:exact;print-color-adjust:exact}
  }
`;

/* Fit pages to the width available - the same layout on every screen. */
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
      {!dark && <div className="folio"><b>Reinvest or Harvest</b><span>{n} / {total}</span></div>}
    </div>
  </div>
);

/* A porcelain tile carrying the dimension's icon (gold for Business Capacity,
   green for Personal Foundation). PNG, not SVG: SVG filters drop out of the
   iPhone PDF. */
const IconTile = ({ k, size = 64 }) => (
  <span className="tile" style={{ width: size, height: size, borderRadius: Math.round(size * 0.26) }}>
    <img src={`/icons/reinvest-harvest/dims/${k}.png`} alt="" width={Math.round(size * 0.68)} height={Math.round(size * 0.68)} style={{ display: "block" }} />
  </span>
);

const Pips = ({ value, tone }) => (
  <span style={{ display: "inline-flex", gap: 5 }} aria-hidden="true">
    {[1, 2, 3, 4, 5, 6].map(n => (
      <span key={n} style={{ width: 22, height: 7, borderRadius: 4, background: n <= value ? tone.fill : L.ruleLight }} />
    ))}
  </span>
);

const Legend = () => (
  <div style={{ display: "flex", gap: 20, fontSize: 15, color: L.ink3, marginBottom: 18 }}>
    <span>Scored 1 to 6:</span>
    {[["1–2", TONE.red], ["3", TONE.amber], ["4", TONE.gold], ["5", TONE.cyan], ["6", TONE.green]].map(([l, tt]) => (
      <span key={l} style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
        <span style={{ width: 13, height: 13, borderRadius: 3, background: tt.fill }} />{l}
      </span>
    ))}
  </div>
);

const dateText = (iso) => {
  try { return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }); }
  catch (e) { return ""; }
};

const Steps = ({ steps }) => steps.map((st, i) => (
  <div key={st.t} style={{ display: "flex", gap: 18, alignItems: "flex-start", padding: "8px 0", borderBottom: i < steps.length - 1 ? `1px solid ${L.ruleLight}` : "none" }}>
    <span className="num" style={{ fontSize: 28, color: `${L.goldFill}aa`, minWidth: 40 }}>0{i + 1}</span>
    <div>
      <div style={{ fontSize: 19, fontWeight: 700, marginBottom: 2 }}>{st.t}</div>
      <div style={{ fontSize: 16, lineHeight: 1.45, color: L.ink2 }}>{st.d}</div>
    </div>
  </div>
));

/* ── PAGE 1 · COVER ── */
function CoverPage({ s, report, quad }) {
  const tone = TONE[quad.tone];
  const who = [report.firstName, report.lastName].filter(Boolean).join(" ");
  const label = { fontSize: 12, fontWeight: 700, letterSpacing: ".18em", textTransform: "uppercase", color: "#8A94A3", marginBottom: 8 };
  return (
    <Page s={s} dark>
      <div className="glow" style={{ position: "absolute", top: "-12%", left: "8%", width: "84%", height: "62%", background: "radial-gradient(ellipse at center, rgba(200,162,78,.17) 0%, transparent 62%)", pointerEvents: "none" }} />
      <div style={{ position: "relative", height: "100%", display: "flex", flexDirection: "column", paddingBottom: 64 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", fontSize: 11, fontWeight: 700, letterSpacing: ".18em", textTransform: "uppercase", color: "#8A94A3" }}>
          <b style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 15, letterSpacing: ".14em", color: "#C8A24E", fontWeight: 600 }}>Kriczky Virtus</b>
          <span>Your Scorecard</span>
        </div>
        <div style={{ marginTop: 210 }}>
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" style={{ marginBottom: 34 }} aria-hidden="true">
            <path d="M32 8L14 16V30C14 42 22 52 32 56C42 52 50 42 50 30V16L32 8Z" stroke="#C8A24E" strokeWidth="2.2" strokeLinejoin="round" />
          </svg>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 600, fontSize: 80, lineHeight: 1, margin: "0 0 26px", letterSpacing: "-.01em", whiteSpace: "nowrap" }}>
            Reinvest <em style={{ color: "#C8A24E", fontWeight: 500 }}>or</em> Harvest
          </h1>
          <p style={{ fontSize: 23, lineHeight: 1.5, color: "#A6AFBC", margin: 0, maxWidth: 660 }}>
            Where your next dollar of profit should go: back into the business, or out to you, and how ready each side is to put it to work.
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
          <span style={{ marginLeft: "auto", display: "inline-block", padding: "12px 22px", borderRadius: 10, background: tone.dark, color: tone.fill,
            border: `1px solid ${tone.fill}88`, fontSize: 13, fontWeight: 700, letterSpacing: ".1em", whiteSpace: "nowrap", flexShrink: 0, textTransform: "uppercase", boxShadow: `0 0 24px ${tone.fill}33` }}>
            {quad.label}
          </span>
        </div>
      </div>
    </Page>
  );
}

/* ── PAGE 2 · YOUR POSITION ── */
const GUESS_LABEL = { reinvest: "Reinvest", harvest: "Take profit", split: "Split" };

function PositionPage({ s, n, total, report, quad, biz, pers }) {
  const tone = TONE[quad.tone];
  const agreed = report.guess ? report.guess === quad.key : null;
  const guessLabel = GUESS_LABEL[report.guess];
  /* The matrix: Personal Foundation strong on top, Business Capacity strong on the right. */
  const cells = [QUADRANTS.harvest, QUADRANTS.reinvest, QUADRANTS.stabilize, QUADRANTS.split];
  const axis = { fontSize: 12.5, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: L.ink3 };
  return (
    <Page s={s} n={n} total={total} right="01 · Your position">
      <div className="kicker" style={{ color: tone.ink }}>Your position</div>
      <h2>You're <em style={{ color: tone.ink }}>{quad.label}.</em></h2>
      <p className="lede" style={{ marginBottom: 22 }}>{dash(quad.line)}</p>

      <div className="card" style={{ padding: "18px 22px 16px", marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 14 }}>
          {/* Drawn as SVG: the PDF renderer ignores vertical writing-mode and flips the text. */}
          <svg width="18" viewBox="0 0 18 200" preserveAspectRatio="xMidYMid meet" style={{ flexShrink: 0, alignSelf: "stretch" }} aria-label="Personal Foundation">
            <text x="9" y="100" transform="rotate(-90 9 100)" textAnchor="middle" dominantBaseline="central"
              style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12.5, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }} fill={TONE.green.ink}>PERSONAL FOUNDATION →</text>
          </svg>
          <div style={{ flex: 1 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {cells.map(q => {
                const t = TONE[q.tone]; const on = q.key === quad.key;
                return (
                  <div key={q.key} style={{ padding: "16px 12px", borderRadius: 12, minHeight: 92, textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center",
                    background: on ? `linear-gradient(160deg, #141B26 0%, ${t.dark} 100%)` : t.tint,
                    border: `1.5px solid ${on ? t.fill : `${t.fill}99`}`, boxShadow: on ? `0 0 26px ${t.fill}55, 0 10px 24px rgba(10,14,20,.18)` : "none" }}>
                    <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 25, fontWeight: 700, color: on ? t.fill : t.ink, lineHeight: 1.05 }}>{q.label}</div>
                    {on && <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "#A6AFBC", marginTop: 8 }}>You are here</div>}
                  </div>
                );
              })}
            </div>
            <div style={{ ...axis, textAlign: "center", marginTop: 10, color: TONE.gold.ink }}>Business Capacity →</div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        {[{ p: PILLAR.biz, v: biz }, { p: PILLAR.pers, v: pers }].map(({ p, v }) => (
          <div key={p.label} className="card drow" style={glowCard(p.tone, { padding: "16px 22px" })}>
            <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase", color: p.tone.ink }}>{p.label}</div>
            <div style={{ marginTop: 10 }}><span className="num" style={{ fontSize: 50, color: p.tone.ink }}>{v}</span><span className="num" style={{ fontSize: 20, color: L.ink3 }}> / {PILLAR_MAX}</span></div>
            <div style={{ position: "relative", height: 9, borderRadius: 5, background: L.ruleLight, marginTop: 14, overflow: "hidden" }}>
              <div style={{ width: `${(v / PILLAR_MAX) * 100}%`, height: "100%", background: `linear-gradient(90deg, ${p.tone.dark}, ${p.tone.ink})`, borderRadius: 5 }} />
              <span style={{ position: "absolute", top: 0, bottom: 0, left: `${(THRESHOLD / PILLAR_MAX) * 100}%`, width: 2, background: L.ink }} />
            </div>
            <div style={{ fontSize: 13, color: L.ink3, marginTop: 6 }}>The line at {THRESHOLD} decides which side of the matrix you sit on.</div>
          </div>
        ))}
      </div>

      {agreed !== null && (
        <div className="card drow" style={glowCard(agreed ? TONE.green : TONE.amber, { padding: "14px 22px" })}>
          <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase", color: (agreed ? TONE.green : TONE.amber).ink, marginBottom: 6 }}>
            {agreed ? "Your read was right" : "Your read and your answers disagree"}
          </div>
          <p style={{ fontSize: 17, lineHeight: 1.5, color: L.ink2, margin: 0 }}>
            {agreed
              ? <>You went in leaning <b style={{ color: L.ink }}>{guessLabel}</b>, and the ten answers agree. That's a confident read - act on it.</>
              : <>You went in leaning <b style={{ color: L.ink }}>{guessLabel}</b>. Your answers point to <b style={{ color: tone.ink }}>{quad.label}</b>. That gap is worth sitting with; it usually means one side is being judged on how it feels rather than what it measures.</>}
          </p>
        </div>
      )}
    </Page>
  );
}

/* ── PAGE 3 · WHAT THIS MEANS ── */
function MeaningPage({ s, n, total, quad, biz, pers }) {
  const tone = TONE[quad.tone];
  const total60 = biz + pers;
  const band = BANDS.find(b => total60 >= b.min && total60 <= b.max) || BANDS[0];
  const bandTone = TONE[band.tone];
  const gap = Math.abs(biz - pers);
  return (
    <Page s={s} n={n} total={total} right="02 · What this means">
      <div className="kicker" style={{ color: tone.ink }}>What this means</div>
      <h2>Reading <em style={{ color: tone.ink }}>{quad.label}.</em></h2>
      <p style={{ fontSize: 16.5, lineHeight: 1.55, color: L.ink2, margin: "0 0 14px" }}>{dash(quad.body)}</p>

      <div className="card drow" style={glowCard(TONE.amber, { padding: "14px 22px", marginBottom: 12 })}>
        <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase", color: TONE.amber.ink, marginBottom: 6 }}>The trap in this position</div>
        <p style={{ fontSize: 16, lineHeight: 1.5, color: L.ink2, margin: 0 }}>{dash(quad.watch)}</p>
      </div>

      {gap >= 6 && (
        <div className="card drow" style={glowCard(TONE[biz > pers ? PILLAR_TONE.biz : PILLAR_TONE.pers], { padding: "14px 22px", marginBottom: 12 })}>
          <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase", color: L.ink3, marginBottom: 6 }}>Read the split, not the total</div>
          <p style={{ fontSize: 16, lineHeight: 1.5, color: L.ink2, margin: 0 }}>
            Your two sides are <b style={{ color: L.ink }}>{gap} points apart</b>. <b style={{ color: (biz > pers ? PILLAR.biz : PILLAR.pers).tone.ink }}>{biz > pers ? "Business Capacity" : "Personal Foundation"}</b> is carrying this score. A respectable total built almost entirely on one side calls for a different decision than the same total spread evenly. Your position is based on the two sides separately.
          </p>
        </div>
      )}

      <div className="card drow" style={glowCard(bandTone, { padding: "14px 22px" })}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
          <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase", color: bandTone.ink }}>Your total · {band.label}</span>
          <span><span className="num" style={{ fontSize: 40, color: bandTone.ink }}>{total60}</span><span className="num" style={{ fontSize: 18, color: L.ink3 }}> / 60</span></span>
        </div>
        <p style={{ fontSize: 16, lineHeight: 1.5, color: L.ink2, margin: 0 }}>{dash(band.desc)}</p>
      </div>
    </Page>
  );
}

/* ── PAGES 4–5 · THE TEN SCORES, one side per page ── */
function DimRow({ d, score }) {
  const t = scoreTone(score);
  const pt = TONE[PILLAR_TONE[d.pillar]];
  return (
    <div className="card drow" style={glowCard(t, { display: "flex", alignItems: "center", gap: 22, padding: "10px 24px", marginBottom: 9 })}>
      <IconTile k={d.key} size={66} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 27, fontWeight: 700, lineHeight: 1.1 }}>
          <span className="num" style={{ fontSize: 16, color: pt.ink, marginRight: 10, verticalAlign: "3px" }}>{String(d.num).padStart(2, "0")}</span>{d.title}
        </div>
        <div style={{ fontSize: 16, color: L.ink3, lineHeight: 1.35, margin: "3px 0 8px" }}>{dash(d.subtitle)}</div>
        <Pips value={score} tone={t} />
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <span className="num" style={{ fontSize: 56, color: t.ink }}>{score}</span>
        <span className="num" style={{ fontSize: 20, color: L.ink3 }}>/6</span>
      </div>
    </div>
  );
}

function SidePage({ s, n, total, scores, side }) {
  const p = PILLAR[side];
  const sub = p.keys.reduce((sum, k) => sum + (scores[k] || 0), 0);
  const words = p.label.split(" ");
  return (
    <Page s={s} n={n} total={total} right={side === "biz" ? "03 · Your ten scores" : "03 · Your ten scores, continued"}>
      <div className="kicker" style={{ color: p.tone.ink }}>{side === "biz" ? "Dimensions 01–05" : "Dimensions 06–10"}</div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 20, marginBottom: 8 }}>
        <h2 style={{ margin: 0 }}>{words[0]} <em style={{ color: p.tone.ink }}>{words.slice(1).join(" ")}</em></h2>
        <span style={{ whiteSpace: "nowrap", paddingBottom: 8 }}><span className="num" style={{ fontSize: 44, color: p.tone.ink }}>{sub}</span><span className="num" style={{ fontSize: 20, color: L.ink3 }}> / 30</span></span>
      </div>
      <p className="lede" style={{ marginBottom: 14 }}>{p.sub}</p>
      <Legend />
      {p.keys.map(k => <DimRow key={k} d={DIM[k]} score={scores[k] || 0} />)}
    </Page>
  );
}

/* Dimensions ranked weakest first; ties keep scorecard order. */
const ranked = (scores) => DIMS.map((d, i) => ({ d, i, v: scores?.[d.key] || 0 }))
  .sort((a, b) => a.v - b.v || a.i - b.i);
const tierFor = (v) => (v <= 2 ? "low" : v <= 4 ? "mid" : "high");

/* ── PAGE 6 · YOUR FIRST THREE MOVES ── */
function MovesPage({ s, n, total, scores, oneToOne }) {
  const three = ranked(scores).slice(0, 3);
  return (
    <Page s={s} n={n} total={total} right="04 · Your first three moves">
      <div className="kicker">Start here</div>
      <h2>Your first three <em>moves.</em></h2>
      <p className="lede" style={{ marginBottom: 16 }}>One move for each of your three lowest dimensions, matched to how you scored. Each one is doable inside thirty days.</p>
      {three.map(({ d, v }, i) => {
        const win = d.quickWins?.[tierFor(v)]?.[0];
        const t = scoreTone(v);
        return (
          <div key={d.key} className="card drow" style={glowCard(t, { padding: "14px 22px", marginBottom: 11 })}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
              <span style={{ padding: "6px 12px", borderRadius: 7, background: TONE.gold.dark, color: L.goldFill, border: `1px solid ${L.goldFill}66`, fontSize: 12, fontWeight: 700, letterSpacing: ".14em" }}>MOVE 0{i + 1}</span>
              <IconTile k={d.key} size={42} />
              <span style={{ fontSize: 16, fontWeight: 700, color: L.ink2 }}>{d.title} · <span style={{ color: t.ink }}>scored {v}/6</span></span>
            </div>
            {win && <>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, fontWeight: 700, lineHeight: 1.15, marginBottom: 4 }}>{dash(win.title)}</div>
              <div style={{ fontSize: 15.5, lineHeight: 1.45, color: L.ink2 }}>{dash(win.context)}</div>
            </>}
          </div>
        );
      })}
      <p style={{ fontSize: 16, lineHeight: 1.5, color: L.ink3, margin: "2px 0 0" }}>
        {oneToOne ? "Whether your real numbers back the direction you're leaning is what the working session on the last page is for. " : ""}Each dimension has its own page next, weakest first.
      </p>
    </Page>
  );
}

/* ── PAGES 7–16 · DIMENSION BY DIMENSION, weakest first ── */
function DimPage({ s, n, total, d, score }) {
  const t = scoreTone(score);
  const pt = TONE[PILLAR_TONE[d.pillar]];
  const Vz = VISUALS[d.key];
  return (
    <Page s={s} n={n} total={total} right="05 · Dimension by dimension">
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 12 }}>
        <IconTile k={d.key} size={72} />
        <div style={{ flex: 1 }}>
          <div className="kicker" style={{ color: pt.ink, marginBottom: 6 }}>Dimension {String(d.num).padStart(2, "0")} · {d.pillar === "biz" ? "Business Capacity" : "Personal Foundation"}</div>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 36, fontWeight: 600, lineHeight: 1.05 }}>{d.title}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <span className="num" style={{ fontSize: 56, color: t.ink }}>{score}</span><span className="num" style={{ fontSize: 20, color: L.ink3 }}>/6</span>
          <div style={{ marginTop: 6 }}><Pips value={score} tone={t} /></div>
        </div>
      </div>
      <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: pt.ink, marginBottom: 8 }}>{dash(d.subtitle)}</div>
      <p style={{ fontSize: 15, lineHeight: 1.55, color: L.ink2, margin: "0 0 12px" }}>{dash(d.description)}</p>

      <div className="card" style={{ padding: "12px 20px 6px", marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase", color: L.ink3, marginBottom: 2 }}>What a strong answer looks like</div>
        {d.checks.map(c => (
          <div key={c.text} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "4px 0" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 3 }} aria-hidden="true">
              <polyline points="4 12 10 18 20 6" stroke={pt.ink} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div>
              <div style={{ fontSize: 15, lineHeight: 1.35, color: L.ink }}>{dash(c.text)}</div>
              {c.sub && <div style={{ fontSize: 13, lineHeight: 1.4, color: L.ink3, marginTop: 1 }}>{dash(c.sub)}</div>}
            </div>
          </div>
        ))}
      </div>

      <div className="card drow" style={glowCard(t, { padding: "10px 18px 6px" })}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: L.ink3, marginBottom: 2 }}>
          <span>1 · {d.lowLabel}</span><span>6 · {d.highLabel}</span>
        </div>
        {Vz && <Vz score={score} />}
      </div>
    </Page>
  );
}

/* ── PAGE 17 · WHERE THIS LEADS ── */
function RoadmapPage({ s, n, total }) {
  return (
    <Page s={s} n={n} total={total} right="06 · Where this leads">
      <div className="kicker">Where this leads</div>
      <h2>The scorecard is <em>step one.</em></h2>
      <p className="lede" style={{ marginBottom: 18 }}>It answers the reinvest-or-harvest question for where you are today. This is the system for how you keep answering it as the business changes.</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {ROADMAP.map(r => {
          const t = TONE[r.tone];
          return (
            <div key={r.n} className="card drow" style={glowCard(t, { padding: "14px 18px 15px", textAlign: "center" })}>
              {/* PNG, not the SVG: its glow filters drop out of the iPhone PDF. */}
              <img src={`/icons/reinvest-harvest/${r.ic}.png`} alt="" width="58" height="58" style={{ display: "block", margin: "0 auto 4px" }} />
              <div className="num" style={{ fontSize: 15, color: t.ink, letterSpacing: ".06em", marginBottom: 4 }}>{r.n}</div>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, fontWeight: 700, lineHeight: 1.15, marginBottom: 4 }}>{r.t}</div>
              <div style={{ fontSize: 15, lineHeight: 1.4, color: L.ink2 }}>{dash(r.d)}</div>
            </div>
          );
        })}
      </div>
    </Page>
  );
}

/* ── PAGE 18 · YOUR NEXT STEP + ADVISOR ── */
const CTA_QUALIFIED = (token) => `/reinvest-harvest/next${token ? `?t=${encodeURIComponent(token)}` : ""}#rh-scheduler`;
const SKOOL_COLLECTIVE = "https://www.skool.com/virtus-collective";
const NEXT = {
  oneToOne: {
    title: <>Map your next 90 days from <em>your results.</em></>,
    body: "A free working session. We walk your two scores against your actual numbers and figure out where a reinvested dollar earns most in your specific business. No pitch, no deck.",
    steps: [
      { t: "We read your scorecard together", d: "Both sides, and which one is carrying your score." },
      { t: "We pressure-test it against real numbers", d: "Self-reported answers get you a direction. Financials get you an answer." },
      { t: "You leave with your three moves, ranked", d: "Whether or not we work together after that." },
    ],
    cta: "Book your free working session",
  },
  collective: {
    title: <>Start with the owners already <em>working on this.</em></>,
    body: "The Virtus Collective is where owners at your stage work through exactly these decisions - with the playbooks, and with other owners running them at the same time. It's free.",
    steps: [
      { t: "Six courses, mapped to your two scores", d: "The same two sides you were just scored on, in the order they should be worked." },
      { t: "Start with your lowest dimension", d: "Your three moves are already on page 6." },
      { t: "Re-score as the business changes", d: "Come back through the scorecard. The right answer moves with you." },
    ],
    cta: "Join the Virtus Collective - free",
  },
};

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

function NextPage({ s, n, total, offerKey, token }) {
  const x = NEXT[offerKey] || NEXT.oneToOne;
  const href = offerKey === "oneToOne" ? CTA_QUALIFIED(token) : SKOOL_COLLECTIVE;
  return (
    <Page s={s} n={n} total={total} right="07 · Your next step">
      <div className="kicker">Your next step</div>
      <h2 style={{ fontSize: 42, marginBottom: 12 }}>{x.title}</h2>
      <p style={{ fontSize: 17, lineHeight: 1.5, color: L.ink2, margin: "0 0 4px" }}>{x.body}</p>
      <Steps steps={x.steps} />
      <a href={href} className="cta" target="_blank" rel="noopener noreferrer"
        style={{ display: "block", textAlign: "center", textDecoration: "none", margin: "12px 0 12px", padding: "16px 20px", borderRadius: 12,
          background: "linear-gradient(160deg,#141B26 0%,#0A0E14 72%)", color: L.goldFill, border: `1px solid ${L.goldFill}66`,
          fontSize: 17, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", boxShadow: `0 0 30px ${L.goldFill}33, 0 10px 24px rgba(10,14,20,.22)` }}>
        {x.cta} →
      </a>
      <BioCard />
      <p style={{ fontSize: 12, lineHeight: 1.5, color: L.ink3, margin: 0 }}>
        This scorecard is an educational self-assessment tool from Kriczky Virtus. It is general in nature, is based entirely on your own self-reported answers, and does not constitute individualized financial, tax, legal, or accounting advice, nor a recommendation to pursue any particular course of action. No outcome is projected or guaranteed. Coordinate any decision with your CPA, attorney, and other advisors before acting.
      </p>
    </Page>
  );
}

/* The PDF is built from the pages themselves: each letter page drawn at 2x
   and placed full-bleed on a letter sheet, so every device gets the same
   file. (Browser printing can't: iPhone Safari adds its own margins.) */
const fileName = (r) => ("Reinvest or Harvest Scorecard" + (r.company ? " - " + r.company : "")).replace(/[\\/:*?"<>|]+/g, "") + ".pdf";

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
        /* html2canvas draws inset shadows as a pale inner box, so keep only the outer shadows */
        const win = doc.defaultView;
        el.querySelectorAll("*").forEach(nd => {
          const bs = win.getComputedStyle(nd).boxShadow;
          if (!bs || bs.indexOf("inset") < 0) return;
          const outer = bs.split(/,(?![^(]*\))/).filter(x => x.indexOf("inset") < 0).join(",");
          nd.style.boxShadow = outer || "none";
        });
      },
    });
    if (i) pdf.addPage("letter", "portrait");
    pdf.addImage(canvas.toDataURL("image/jpeg", 0.85), "JPEG", 0, 0, 612, 792, undefined, "FAST");
    canvas.width = 0; canvas.height = 0;
    /* The page is a picture, so lay a real link over each button on it - 
       the CTA stays clickable in the downloaded file. */
    const box = pages[i].getBoundingClientRect();
    const k = 612 / box.width;
    pages[i].querySelectorAll("a[href]").forEach(a => {
      const r = a.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const url = new URL(a.getAttribute("href"), window.location.origin).href;
      pdf.link((r.left - box.left) * k, (r.top - box.top) * k, r.width * k, r.height * k, { url });
    });
  }
  pdf.save(filename);
}

/* ── the report ── */
export default function ReinvestHarvestReport({ report, token = null, shareUrl = null }) {
  const scores = report.scores || {};
  const biz = BIZ_KEYS.reduce((a, k) => a + (scores[k] || 0), 0);
  const pers = PERS_KEYS.reduce((a, k) => a + (scores[k] || 0), 0);
  const quad = getQuadrant(biz, pers);
  const offerKey = routeTo(report.revenueBand, report.ownerTier);
  const [ref, s] = usePageScale();
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const order = ranked(scores);
  const TOTAL = 6 + order.length + 2;

  const share = async () => {
    const url = shareUrl || (typeof window !== "undefined" ? window.location.href : "");
    try { await navigator.clipboard.writeText(url); }
    catch (e) {
      const ta = document.createElement("textarea");
      ta.value = url; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); } catch (e2) { /* nothing more to try */ }
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="rhr" ref={ref}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600&family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet" />
      <style>{CSS}</style>
      <div className="bar">
        <button disabled={busy} onClick={async () => {
          setBusy(true);
          try { await buildPdf(ref.current, fileName(report)); }
          catch (e) { window.print(); }
          finally { setBusy(false); }
        }}>{busy ? "Preparing your PDF..." : "Download PDF"}</button>
        <button className="ghost" onClick={share}>{copied ? "Link copied" : "Share"}</button>
      </div>
      <div className="pages" style={{ padding: "14px 0 30px" }}>
        <CoverPage s={s} report={report} quad={quad} />
        <PositionPage s={s} n={2} total={TOTAL} report={report} quad={quad} biz={biz} pers={pers} />
        <MeaningPage s={s} n={3} total={TOTAL} quad={quad} biz={biz} pers={pers} />
        <SidePage s={s} n={4} total={TOTAL} scores={scores} side="biz" />
        <SidePage s={s} n={5} total={TOTAL} scores={scores} side="pers" />
        <MovesPage s={s} n={6} total={TOTAL} scores={scores} oneToOne={offerKey === "oneToOne"} />
        {order.map(({ d, v }, i) => <DimPage key={d.key} s={s} n={7 + i} total={TOTAL} d={d} score={v} />)}
        <RoadmapPage s={s} n={TOTAL - 1} total={TOTAL} />
        <NextPage s={s} n={TOTAL} total={TOTAL} offerKey={offerKey} token={token} />
      </div>
    </div>
  );
}
