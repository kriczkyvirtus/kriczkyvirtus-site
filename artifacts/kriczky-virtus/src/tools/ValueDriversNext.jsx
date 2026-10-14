import { useEffect, useRef, useState } from "react";
import { LIGHT, ThemeProvider, useT, fillOf } from "./kvTheme.js";
import {
  GRAIN, PILLARS, PILLAR_MAX, DRIVER_KEYS, DRIVER_NAMES,
  zoneByKey, routeTo, scoreColor,
} from "./valueDriversData.js";

/* ═══════════════════════════════════════════════════════════════
   VALUE DRIVERS — NEXT PAGES
     door="site"     /tools/wmbw/next                 book a call (or the Collective)
     door="workshop" /workshop-rh/value-drivers/next  workshop VSL + workbook scores
   Reached from the flow's result screen and from the results email (?t=token).
   Built on the same shell as /reinvest-harvest/next (ReinvestHarvestThankYou):
   confirmation bar, "You landed in" hero, glass next-step card with the
   calendar inside it, VSL with the unmute panel, glowing card grid, footer.
   ═══════════════════════════════════════════════════════════════ */

/* Direct iframe — iClosed widget.js races the React render. Same event as /free-session. */
const ICLOSED_SESSION = "https://app.iclosed.io/e/kriczkyvirtus/free-working-session";
const SKOOL_COLLECTIVE = "https://www.skool.com/virtus-collective";

/* Website-door VSL (optional). The section only renders once SITE_VSL_SRC is set. */
const SITE_VSL_SRC = null;          // e.g. "/video/value-drivers-next.mp4"
const SITE_VSL_POSTER = null;
const SITE_VSL_LENGTH = "";         // e.g. "1 MIN 40 SEC"

/* ⚠️ Workshop VSL — set once the video is recorded. While null, the page shows a
   clearly marked placeholder instead of an empty player. */
const WORKSHOP_VSL_SRC = null;      // e.g. "/video/workshop-value-drivers.mp4"
const WORKSHOP_VSL_POSTER = null;   // e.g. "/video/workshop-value-drivers-poster.jpg"
const WORKSHOP_VSL_LENGTH = "";     // e.g. "2 MIN 10 SEC"

/* Hero copy per zone — the fuller version of the one-liners in valueDriversData,
   written to the same length and voice as the Reinvest or Harvest quadrant lines. */
const ZONE_HERO = {
  foundation: "Right now the business runs on you. That's normal at this stage, but it's also why a bad month would hit hard. The good news: this is where small, unsexy fixes might improve your business the most.",
  constrained: "You've built real momentum, and a few gaps are starting to hold it back. Left alone, the business gets busier without improving sustainable growth potential. Close the two weakest drivers and the growth starts compounding instead of leaking.",
  midpoint: "The model works. It just isn't nailed down yet, so scaling now would amplify the gaps along with the strengths. This is the zone where a focused 90 days can do the most to set up your next stage of growth.",
  green: "Attractive from the outside and ready on the inside. Few owners get here. The job now is protecting what you've built while you push into Best-in-Class, and making sure the growth keeps paying you, not just the business.",
  bestInClass: "Scalable, resilient, and it runs without you. That's rare. The question now isn't how to fix the business — it's what you want the business to do for you, and how to keep it here while you decide.",
};

const OFFERS = {
  oneToOne: {
    kicker: "Your next step",
    title: "Get free hands-on tactical help inside your business to move the needle.",
    body: "A free working session. We read your ten scores against your actual numbers and see how changes to low hanging fruit might impact your annual profit and sustainable growth opportunities. No pitch, no deck.",
    cta: "BOOK YOUR FREE WORKING SESSION",
    steps: [
      { t: "We read your results together", d: "Both lenses, and which one is carrying your score." },
      { t: "We pressure-test them against real numbers", d: "Self-reported answers get you a direction. Financials get you an answer." },
      { t: "You leave with your next three moves, ranked", d: "Whether or not we work together after that." },
    ],
  },
  collective: {
    kicker: "Your next step",
    title: "Start with the owners already working on this.",
    body: "The Virtus Collective is where owners at your stage work through exactly these drivers — with the playbooks, and with other owners running them at the same time. It's free, and you can be inside it in about a minute.",
    cta: "JOIN THE VIRTUS COLLECTIVE",
    steps: [
      { t: "Courses mapped to the ten drivers", d: "Worked in the order they should be fixed." },
      { t: "Start with your two lowest scores", d: "Your three moves are already in your report." },
      { t: "Re-score as the business changes", d: "Come back through Value Drivers. Your zone moves with you." },
    ],
  },
};

const WHAT_TO_BRING = [
  { t: "Rough numbers, not a finance pack", d: "Last year's revenue, your net margin, what you took out in the last 90 days, and roughly what you hold in personal investments. Ranges are fine." },
  { t: "These ten scores", d: "We will dive deeper into your two lowest scores at the workshop." },
  { t: "A pen you like writing with", d: "Your workbook and Sprint Ledger will be waiting for you at the workshop." },
];

const kicker = { fontSize: 10, fontWeight: 700, letterSpacing: ".2em", textTransform: "uppercase" };
const wrap = { maxWidth: 720, margin: "0 auto", padding: "0 20px" };
const wide = { maxWidth: 1120, margin: "0 auto", padding: "0 20px" };
const serif = "'Cormorant Garamond',serif";
/* Theme-dependent styles are built from the active theme (see kvTheme.js). */
const glassCardOf = (C) => C.light
  ? { padding: "32px 24px", borderRadius: 18, background: "#FFFFFF", border: `1px solid ${C.goldLight}55`, boxShadow: `0 0 26px ${C.goldLight}1f, 0 10px 30px rgba(10,14,20,.08)` }
  : { padding: "32px 24px", borderRadius: 18, background: "linear-gradient(145deg, rgba(255,255,255,.05), rgba(255,255,255,.02))", border: `1px solid ${C.gold}2e`, borderTop: "1px solid rgba(255,255,255,.12)", boxShadow: "0 10px 40px rgba(0,0,0,.45)" };
const ctaStyleOf = (C) => ({ display: "block", maxWidth: 460, margin: "0 auto", padding: "21px 24px", borderRadius: 13, textAlign: "center", textDecoration: "none",
  background: C.light ? C.btnBg : `linear-gradient(135deg,${C.gold}2e,${C.gold}12)`, border: `1.5px solid ${C.light ? C.btnLine : `${C.gold}88`}`,
  boxShadow: C.light ? `0 0 30px ${C.goldLight}33, 0 10px 24px rgba(10,14,20,.18)` : `0 0 34px ${C.gold}26`, transition: "all .25s ease" });

const cssOf = (C) => `
  *{box-sizing:border-box}
  body{background:${C.bgDeep}}
  .cta:hover{box-shadow:0 0 44px ${C.goldLight}55,0 6px 22px rgba(0,0,0,.35)!important;border-color:${C.goldLight}!important}
  .vsl-panel{animation:vslPulse 2.4s ease-in-out infinite}
  .vsl-unmute:hover .vsl-panel{transform:scale(1.04)}
  @keyframes vslPulse{0%,100%{transform:scale(1);box-shadow:0 10px 40px rgba(0,0,0,.45)}50%{transform:scale(1.035);box-shadow:0 10px 52px rgba(0,0,0,.5),0 0 34px rgba(200,162,78,.45)}}
  @media(prefers-reduced-motion:reduce){.vsl-panel{animation:none}}
  .drivers{display:grid;grid-template-columns:1fr 1fr;gap:12px}
  .rcard{transition:box-shadow .3s ease,border-color .3s ease,background .3s ease,transform .3s ease}
  ${C.light
    /* Cream: the same hover as the report cards — a slight lift, an edge in the
       card's colour, and a soft glow all the way round. Pointer devices only. */
    ? "@media (hover:hover) and (pointer:fine){.rcard:hover{transform:translateY(-2px);border-color:var(--glowEdge)!important;box-shadow:0 0 0 1px var(--glowEdge),0 0 22px var(--glowHi),0 0 52px var(--glowHi),0 14px 30px rgba(10,14,20,.10)!important}}"
    : ".rcard:hover{border-color:var(--glowEdge)!important;background:linear-gradient(160deg,var(--glowSoft),rgba(255,255,255,.02))!important;box-shadow:0 0 30px var(--glowSoft),0 0 60px var(--glowSoft)}"}
  @media(min-width:700px){.drivers{grid-template-columns:repeat(5,1fr);gap:14px}}
`;

/* ── Module-scope pieces (see the remount note in ValueDriversFlow) ── */

const Shell = ({ children }) => { const C = useT(); return (
  <div style={{ background: C.bgDeep, minHeight: "100vh", fontFamily: "'DM Sans',sans-serif", color: C.text1, paddingBottom: 40 }}>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet" />
    <style>{cssOf(C)}</style>
    {C.grain ? <div style={{ position: "fixed", inset: 0, pointerEvents: "none", opacity: C.grain, mixBlendMode: "overlay", backgroundImage: GRAIN, backgroundSize: "128px 128px", zIndex: 0 }} /> : null}
    {children}
  </div>
); };

const ConfirmBar = ({ email }) => { const C = useT(); return (
  <div style={{ background: `linear-gradient(90deg, ${C.green}16, ${C.green}09)`, borderBottom: `1px solid ${C.green}33`, padding: "14px 20px", position: "relative", zIndex: 2 }}>
    <div style={{ ...wrap, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, textAlign: "center" }}>
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
        <polyline points="4 12 10 18 20 6" stroke={C.green} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span style={{ fontSize: 14, color: C.text1 }}>
        Your full results are on their way{email ? <> to <b style={{ color: C.green }}>{email}</b></> : "."}
      </span>
    </div>
  </div>
); };

const PillarCards = ({ attract, ready }) => { const C = useT(); return (
  <div style={{ display: "flex", gap: 12, margin: "26px auto 0", maxWidth: 440 }}>
    {[{ p: PILLARS.attract, v: attract }, { p: PILLARS.ready, v: ready }].map(({ p, v }) => { const pc = C.t(p.color); return (
      <div key={p.label} style={{ flex: 1, padding: "14px 10px", borderRadius: 12, background: C.light ? `linear-gradient(135deg,#FFFFFF 55%,${pc}12)` : `${pc}0d`, border: `1px solid ${pc}33`, boxShadow: C.shadowCard }}>
        <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: pc, marginBottom: 6 }}>{p.label}</div>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 30, fontWeight: 700, color: pc, lineHeight: 1 }}>
          {v}<span style={{ fontSize: 14, color: C.text3 }}>/{PILLAR_MAX}</span>
        </div>
      </div>
    ); })}
  </div>
); };

const ZoneHero = ({ report, zone, reportUrl, qualifier }) => { const C = useT(); const zc = C.t(zone.color); return (
  <section style={{ padding: "38px 0 26px", textAlign: "center" }}>
    <div style={{ ...kicker, color: zc, marginBottom: 14 }}>You landed in</div>
    <h1 style={{ fontFamily: serif, fontWeight: 700, fontSize: "clamp(40px,9.6vw,64px)", textTransform: "uppercase", letterSpacing: ".01em", color: zc, lineHeight: 1.06, margin: "0 0 22px" }}>
      {zone.label}
    </h1>
    <p style={{ fontSize: "clamp(16px,3.9vw,20px)", lineHeight: 1.5, color: C.text1, maxWidth: 820, margin: "0 auto" }}>
      {ZONE_HERO[zone.key] || zone.line}
    </p>
    <PillarCards attract={report.attractScore} ready={report.readyScore} />
    {qualifier && (
      <p style={{ fontSize: "clamp(13.5px,3.1vw,15.5px)", lineHeight: 1.6, color: C.text3, maxWidth: 680, margin: "22px auto 0" }}>{qualifier}</p>
    )}
    {reportUrl && (
      <a href={reportUrl} style={{ display: "inline-block", marginTop: 18, color: C.gold, fontSize: 14.5, fontWeight: 700, textDecoration: "none", letterSpacing: ".02em" }}>
        Read your full report →
      </a>
    )}
  </section>
); };

const NumberedSteps = ({ steps }) => { const C = useT(); return steps.map((s, i) => (
  <div key={s.t} style={{ display: "flex", gap: 15, alignItems: "flex-start", padding: "14px 0", borderBottom: i < steps.length - 1 ? `1px solid ${C.lineSoft}` : "none" }}>
    <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 23, fontWeight: 700, color: C.light ? C.goldLight : `${C.gold}66`, lineHeight: 1, minWidth: 30 }}>0{i + 1}</span>
    <div>
      <div style={{ fontSize: 15, fontWeight: 700, color: C.text1, marginBottom: 3 }}>{s.t}</div>
      <div style={{ fontSize: 14, lineHeight: 1.55, color: C.text2 }}>{s.d}</div>
    </div>
  </div>
)); };

const CardHead = ({ k, title, body }) => { const C = useT(); return (
  <>
    <div style={{ ...kicker, color: C.gold, marginBottom: 12, textAlign: "center" }}>{k}</div>
    <h2 style={{ fontFamily: serif, fontWeight: 700, fontSize: "clamp(24px,5.6vw,32px)", lineHeight: 1.18, color: C.text1, textAlign: "center", margin: "0 0 14px" }}>{title}</h2>
    {body && <p style={{ fontSize: 15, lineHeight: 1.65, color: C.text2, textAlign: "center", maxWidth: 520, margin: "0 auto 24px" }}>{body}</p>}
  </>
); };

function Vsl({ src, poster, length, placeholder }) {
  const C = useT();
  const [playing, setPlaying] = useState(false);
  const vidRef = useRef(null);
  /* Unmute restarts from zero — same behaviour as the Reinvest or Harvest page. */
  const unmute = () => {
    const v = vidRef.current;
    if (v) { v.muted = false; v.currentTime = 0; v.loop = false; const p = v.play(); if (p && p.catch) p.catch(() => {}); }
    setPlaying(true);
  };
  return (
    <section style={{ maxWidth: 1080, margin: "0 auto", padding: "0 20px 40px" }}>
      <div style={{ position: "relative", aspectRatio: "16/9", borderRadius: 16, overflow: "hidden", background: C.light ? "#E9E3D7" : "#0B1017", border: `1px solid ${C.gold}33`, boxShadow: C.light ? `0 12px 32px rgba(10,14,20,.14), 0 0 40px ${C.goldLight}1a` : `0 14px 46px rgba(0,0,0,.5), 0 0 60px ${C.gold}0d` }}>
        {src ? (
          <>
            <video ref={vidRef} src={src} poster={poster || undefined} autoPlay muted loop={!playing} playsInline preload="auto" controls={playing}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            {!playing && (
              <button onClick={unmute} aria-label="Unmute video" className="vsl-unmute"
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", border: "none", cursor: "pointer", padding: 0 }}>
                <span className="vsl-panel" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "58%", maxWidth: 520, padding: "6% 4%", borderRadius: 20, background: `${C.goldLight}b3`, border: `1px solid ${C.goldLight}`, boxShadow: "0 10px 40px rgba(0,0,0,.45)" }}>
                  <svg width="13%" viewBox="0 0 24 24" fill="#0A0E14" style={{ minWidth: 34, maxWidth: 66, marginBottom: "5%" }}>
                    <path d="M3 9v6h4l5 5V4L7 9H3z" />
                    <path d="M16.5 12c0-1.8-1-3.3-2.5-4v8c1.5-.7 2.5-2.2 2.5-4z" />
                    <path d="M14 3.2v2.1c2.9.9 5 3.5 5 6.7s-2.1 5.8-5 6.7v2.1c4-1 7-4.5 7-8.8s-3-7.8-7-8.8z" />
                  </svg>
                  <span style={{ fontWeight: 700, color: "#0A0E14", lineHeight: 1.25, textAlign: "center", fontSize: "clamp(15px,2.6vw,26px)" }}>Your video is playing<br />Click to unmute</span>
                  {length && <span style={{ fontWeight: 600, color: "#0A0E14", opacity: .72, letterSpacing: ".05em", marginTop: "3%", fontSize: "clamp(11px,1.5vw,15px)" }}>{length}</span>}
                </span>
              </button>
            )}
          </>
        ) : placeholder ? (
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: `2px dashed ${C.red}`, borderRadius: 16, textAlign: "center", padding: 20 }}>
            <div style={{ ...kicker, color: C.red, letterSpacing: ".16em" }}>Placeholder · workshop video to come</div>
            <div style={{ fontSize: 13.5, color: C.text3, marginTop: 8 }}>Set WORKSHOP_VSL_SRC in ValueDriversNext.jsx</div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

/* The ten drivers as a glowing card grid — the Value Drivers counterpart of the
   six-course roadmap on the Reinvest or Harvest page. Each card is coloured by
   its own score (red 1–2, gold 3–4, green 5, cyan 6). The two lowest are flagged. */
function DriverGrid({ scores }) {
  const C = useT();
  const ranked = DRIVER_KEYS.filter(k => Number.isInteger(scores?.[k]))
    .sort((a, b) => scores[a] - scores[b] || DRIVER_KEYS.indexOf(a) - DRIVER_KEYS.indexOf(b));
  const lowest = new Set(ranked.slice(0, 2));
  return (
    <div className="drivers">
      {DRIVER_KEYS.map((k, i) => {
        const v = scores?.[k];
        const tint = C.t(scoreColor(v));
        const flag = lowest.has(k);
        return (
          <div key={k} className="rcard" style={{ position: "relative", padding: "18px 12px 18px", borderRadius: 14, textAlign: "center",
            background: C.light ? `linear-gradient(160deg, #FFFFFF 45%, ${tint}${flag ? "1c" : "10"})` : `linear-gradient(160deg, ${tint}${flag ? "14" : "0a"}, rgba(255,255,255,.015))`,
            border: `1px solid ${flag ? `${tint}77` : `${tint}${C.light ? "40" : "2e"}`}`, boxShadow: C.light ? `0 0 18px ${tint}1c, 0 6px 16px rgba(10,14,20,.06)` : "none",
            "--glowSoft": `${tint}2e`, "--glowEdge": C.light ? `${fillOf(tint)}cc` : `${tint}70`, "--glowHi": `${fillOf(tint)}8c` }}>
            {flag && <div style={{ position: "absolute", top: -9, left: "50%", transform: "translateX(-50%)", whiteSpace: "nowrap", fontSize: 8.5, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: C.goldLight, background: "#2A2213", border: `1px solid ${C.goldLight}66`, padding: "3px 9px", borderRadius: 5, boxShadow: C.light ? "0 2px 8px rgba(10,14,20,.25)" : "0 2px 10px rgba(0,0,0,.45)" }}>Start here</div>}
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 13, fontWeight: 700, color: `${tint}88`, letterSpacing: ".06em", marginBottom: 6 }}>{String(i + 1).padStart(2, "0")}</div>
            <div style={{ fontFamily: serif, fontSize: 18, fontWeight: 700, color: C.text1, lineHeight: 1.15, minHeight: 42, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>{DRIVER_NAMES[k]}</div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 700, color: tint, lineHeight: 1 }}>
              {v ?? "–"}<span style={{ fontSize: 13, color: C.text3 }}>/6</span>
            </div>
            <div style={{ display: "flex", gap: 3, justifyContent: "center", marginTop: 10 }}>
              {[1, 2, 3, 4, 5, 6].map(n => (
                <span key={n} style={{ width: 10, height: 4, borderRadius: 2, background: v && n <= v ? tint : C.light ? C.line : "rgba(255,255,255,.1)", boxShadow: v && n <= v ? `0 0 6px ${tint}66` : "none" }} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

const SectionHead = ({ k, title, accent, body }) => { const C = useT(); return (
  <div style={{ textAlign: "center", marginBottom: 34 }}>
    <div style={{ ...kicker, fontSize: 15, color: C.gold, marginBottom: 14 }}>{k}</div>
    <h2 style={{ fontFamily: serif, fontWeight: 700, fontSize: "clamp(32px,7.9vw,60px)", lineHeight: 1.1, color: C.text1, margin: "0 0 16px" }}>
      {title}{accent && <> <span style={{ color: C.gold, fontStyle: "italic", fontWeight: 400 }}>{accent}</span></>}
    </h2>
    {body && <p style={{ fontSize: "clamp(17px,4vw,23px)", lineHeight: 1.55, color: C.text2, maxWidth: 800, margin: "0 auto" }}>{body}</p>}
  </div>
); };

const Footer = () => { const C = useT(); return (
  <footer style={{ ...wrap, paddingTop: 26, borderTop: `1px solid ${C.lineSoft}` }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", marginBottom: 14 }}>
      <svg width="19" height="19" viewBox="0 0 64 64" fill="none">
        <path d="M32 8L14 16V30C14 42 22 52 32 56C42 52 50 42 50 30V16L32 8Z" fill="none" stroke={C.gold} strokeWidth="2.5" strokeLinejoin="round" />
      </svg>
      <span style={{ fontFamily: serif, fontSize: 15, letterSpacing: ".08em", textTransform: "uppercase", color: C.text2 }}>
        <b style={{ color: C.gold, fontWeight: 600 }}>Kriczky</b> Virtus
      </span>
    </div>
    <p style={{ fontSize: 10.5, lineHeight: 1.6, color: C.text3, textAlign: "center", margin: 0 }}>
      Value Drivers is an educational self-assessment tool from Kriczky Virtus. It is general in nature, is based entirely on your own self-reported answers, and produces an estimate, not a valuation. It does not constitute individualized financial, tax, legal, or accounting advice, nor a recommendation to pursue any particular course of action. No outcome is projected or guaranteed. Coordinate any decision with your CPA, attorney, and other advisors before acting.
    </p>
  </footer>
); };

/* Gentle nudge to the calendar — same rules as the Reinvest or Harvest page:
   only when a calendar exists, not on a #hash arrival, not once they've started
   scrolling, respects reduced motion, fires once. */
function useCalendarNudge(active) {
  useEffect(() => {
    if (!active || typeof window === "undefined") return undefined;
    if (window.location.hash === "#vd-scheduler") return undefined;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    let cancelled = false;
    const cancel = () => { cancelled = true; };
    window.addEventListener("wheel", cancel, { passive: true });
    window.addEventListener("touchmove", cancel, { passive: true });
    window.addEventListener("keydown", cancel);
    const t = setTimeout(() => {
      if (cancelled) return;
      const frame = document.getElementById("vd-calendar");
      if (!frame) return;
      window.scrollTo({ top: Math.max(0, frame.getBoundingClientRect().top + window.scrollY - 110), behavior: "smooth" });
    }, 2500);
    return () => {
      clearTimeout(t);
      window.removeEventListener("wheel", cancel);
      window.removeEventListener("touchmove", cancel);
      window.removeEventListener("keydown", cancel);
    };
  }, [active]);
}

export default function ValueDriversNext(props) {
  /* Both doors are cream, like the reports and the workbooks. */
  const C = LIGHT;
  return <ThemeProvider value={C}><NextBody {...props} C={C} /></ThemeProvider>;
}

function NextBody({ door = "site", report = null, token = null, C }) {
  const glassCard = glassCardOf(C);
  const ctaStyle = ctaStyleOf(C);
  const zone = report ? zoneByKey(report.zoneKey) : null;
  const resolved = Boolean(report && zone);
  const reportUrl = resolved && token ? `/tools/wmbw/r/${encodeURIComponent(token)}` : null;

  const offerKey = door === "site" && resolved ? routeTo(report.revenueBand, report.ownerTier) : "oneToOne";
  useCalendarNudge(door === "site" && resolved && offerKey === "oneToOne");

  /* ═══ WORKSHOP DOOR ═══ */
  if (door === "workshop") {
    const first = resolved && report.firstName ? `${report.firstName}, h` : "H";
    return (
      <Shell>
        {resolved && <ConfirmBar email={report.email} />}
        <div style={{ ...wide, position: "relative", zIndex: 1 }}>
          {resolved ? <ZoneHero report={report} zone={zone} reportUrl={null} /> : (
            <section style={{ padding: "52px 0 26px", textAlign: "center" }}>
              <div style={{ ...kicker, color: C.gold, marginBottom: 14 }}>Reinvest or Harvest Workshop</div>
              <h1 style={{ fontFamily: serif, fontWeight: 700, fontSize: "clamp(34px,8.4vw,64px)", lineHeight: 1.08, color: C.text1, margin: 0 }}>Before you arrive</h1>
            </section>
          )}

          <section style={{ textAlign: "center", padding: "18px 0 22px" }}>
            <h2 style={{ fontFamily: serif, fontWeight: 700, fontSize: "clamp(28px,4.4vw,60px)", lineHeight: 1.1, color: C.text1, margin: "0 auto 20px", maxWidth: 1000, textWrap: "balance" }}>
              {first}ere's how we'll use these scores on the day of the workshop.
            </h2>
            <p style={{ fontSize: "clamp(17px,4vw,22px)", lineHeight: 1.55, color: C.text2, maxWidth: 900, margin: "0 auto" }}>
              Watch this before you arrive. It takes a couple of minutes.
            </p>
          </section>
          <Vsl src={WORKSHOP_VSL_SRC} poster={WORKSHOP_VSL_POSTER} length={WORKSHOP_VSL_LENGTH} placeholder />

          {resolved && (
            <section style={{ maxWidth: 1040, margin: "0 auto", padding: "10px 0 44px" }}>
              <SectionHead k="For your workbook · page 7" title="Your ten" accent="drivers"
                body="Copy these onto Station 02, or bring this page up on your phone." />
              <DriverGrid scores={report.scores} />
            </section>
          )}

          <section style={{ ...wrap, padding: "4px 20px 46px" }}>
            <div style={glassCard}>
              <CardHead k="What to bring" title="Three things, and that's it." />
              <NumberedSteps steps={WHAT_TO_BRING} />
            </div>
          </section>

          <Footer />
        </div>
      </Shell>
    );
  }

  /* ═══ WEBSITE DOOR ═══ */
  const offer = OFFERS[offerKey];
  const schedulerUrl = (() => {
    if (!resolved) return ICLOSED_SESSION;
    const p = new URLSearchParams();
    const full = `${report.firstName || ""} ${report.lastName || ""}`.trim();
    if (full) p.set("iclosedName", full);
    if (report.email) p.set("iclosedEmail", report.email);
    /* iClosed's phone field can't parse dashes — digits only. */
    const digits = String(report.phone || "").replace(/\D/g, "");
    if (digits) p.set("iclosedPhone", digits);
    const q = p.toString();
    return q ? `${ICLOSED_SESSION}?${q}` : ICLOSED_SESSION;
  })();
  const scrollToScheduler = (e) => {
    e.preventDefault();
    const el = document.getElementById("vd-scheduler");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <Shell>
      {resolved && <ConfirmBar email={report.email} />}
      <div style={{ ...wide, position: "relative", zIndex: 1 }}>

        {resolved ? (
          <ZoneHero report={report} zone={zone} reportUrl={reportUrl}
            qualifier={offerKey === "oneToOne" ? "For owners doing $1M–$10M who want to know which drivers are holding their growth back, and hands-on help fixing them in the right order." : null} />
        ) : (
          <section style={{ padding: "52px 0 34px", textAlign: "center" }}>
            <div style={{ ...kicker, color: C.gold, marginBottom: 14 }}>Value Drivers</div>
            <h1 style={{ fontFamily: serif, fontWeight: 700, fontSize: "clamp(34px,8.4vw,64px)", lineHeight: 1.08, color: C.text1, margin: "0 0 22px" }}>
              Want help growing your business into an asset that runs without you?
            </h1>
            <p style={{ fontSize: "clamp(16px,4vw,22px)", lineHeight: 1.55, color: C.text2, maxWidth: 900, margin: "0 auto", textWrap: "balance" }}>
              This is where you find out whether you're a fit to have me work on it with you — building sustainable growth inside the business, and financial freedom outside of it.
            </p>
          </section>
        )}

        {/* Ask and calendar as one block, exactly like the Reinvest or Harvest page. */}
        <section id="vd-scheduler" style={{ ...wrap, padding: "4px 0 40px", scrollMarginTop: 24 }}>
          <div style={glassCard}>
            <CardHead k={offer.kicker} title={offer.title} body={offer.body} />
            <NumberedSteps steps={offer.steps} />
            {offerKey === "oneToOne" ? (
              <div id="vd-calendar" style={{ marginTop: 26, borderRadius: 14, overflow: "hidden", border: `1px solid ${C.line}`, background: C.bgCard, minHeight: 620 }}>
                {/* Direct iframe. Do NOT use iClosed widget.js — it races the React render. */}
                <iframe src={schedulerUrl} title="Book your free working session" width="100%" height="620"
                  style={{ border: "none", display: "block" }} loading="lazy" />
              </div>
            ) : (
              <a href={SKOOL_COLLECTIVE} className="cta" target="_blank" rel="noopener noreferrer"
                style={{ ...ctaStyle, maxWidth: "none", marginTop: 26, padding: "20px 24px" }}>
                <span style={{ fontSize: 16.5, fontWeight: 700, letterSpacing: ".02em", color: C.btnText }}>{offer.cta} →</span>
              </a>
            )}
          </div>
        </section>

        {offerKey === "oneToOne" && SITE_VSL_SRC && (
          <>
            <section style={{ textAlign: "center", padding: "0 0 22px" }}>
              <h2 style={{ fontFamily: serif, fontWeight: 700, fontSize: "clamp(28px,4.4vw,60px)", lineHeight: 1.1, color: C.text1, margin: "0 auto 20px", maxWidth: 1000, textWrap: "balance" }}>
                Want to see what we'll do in your working session?
              </h2>
            </section>
            <Vsl src={SITE_VSL_SRC} poster={SITE_VSL_POSTER} length={SITE_VSL_LENGTH} />
          </>
        )}

        {offerKey === "oneToOne" && (
          <section style={{ ...wrap, paddingBottom: 46, textAlign: "center" }}>
            <a href="#vd-scheduler" className="cta" onClick={scrollToScheduler} style={ctaStyle}>
              <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: ".02em", color: C.btnText }}>{offer.cta} →</span>
            </a>
            {!resolved && (
              <p style={{ fontSize: 13.5, color: C.text3, margin: "16px 0 0" }}>
                <a href="/tools/wmbw" style={{ color: C.text3 }}>Haven't taken Value Drivers yet?</a>
              </p>
            )}
          </section>
        )}

        {resolved && (
          <section style={{ maxWidth: 1040, margin: "0 auto", padding: "10px 0 44px" }}>
            <SectionHead k="Where this leads" title="Your zone is" accent="step one"
              body="It tells you where the business lands today. These ten drivers are how you move it — starting with the two marked below." />
            <DriverGrid scores={report.scores} />
          </section>
        )}

        <Footer />
      </div>
    </Shell>
  );
}
