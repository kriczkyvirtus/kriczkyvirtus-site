import { useState, useEffect, useRef } from "react";
import BarbellMark from "../BarbellMark.jsx";
import RoadmapSystem from "../RoadmapSystem.jsx";

/* ═══════════════════════════════════════════════════════════════
   REINVEST OR HARVEST - LANDING PAGE, CREAM (preview, 16 Oct 2026)
   Route: /reinvest-harvest/cream (noindex) until approved; then it
   replaces ReinvestHarvestLanding.jsx at /reinvest-harvest.
   Same copy, order, CTAs and video as the live dark page - only the
   design changes, to the house style of the cream /workshop-rh page:
   cream ground with the engraved texture (scrolls with the page, gold
   lamp on desktop), porcelain tiles and pills, report-style glow cards,
   dark buttons with a gold halo and shine, one dark "splash" card.
   Mobile-first: traffic is ManyChat DMs off Reels + paid IG.
   ═══════════════════════════════════════════════════════════════ */

const VSL_SRC = "/video/reinvest-harvest-landing.mp4";
const VSL_POSTER = "/video/reinvest-harvest-landing-poster.jpg";

const C = {
  page: "#F2EEE6",
  ink1: "#0A0E14", ink2: "#3E4652", ink3: "#6B6459", ink4: "#8C8476",
  rule: "#DCD4C5", ruleLight: "#E6DFD2",
};
/* Every tone as ink (text on cream), fill (bars, glows, edges) and tint (washes). */
const T = {
  gold:  { ink: "#7A5C1E", fill: "#C8A24E", tint: "#F1E7D0" },
  green: { ink: "#1B7A57", fill: "#34D399", tint: "#E3EEE6" },
  cyan:  { ink: "#0E7490", fill: "#22D3EE", tint: "#E1ECEE" },
  red:   { ink: "#B4403F", fill: "#F87171", tint: "#F6E3DF" },
};
const DARK = "linear-gradient(160deg,#141B26 0%,#0A0E14 72%)";

/* The engine-turned lattice, as on /workshop-rh. */
const guilloche = (stroke, op, w) => {
  const ring = (cx, cy) => [28, 19, 10].map(r => `<circle cx='${cx}' cy='${cy}' r='${r}'/>`).join("");
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='56' height='56' viewBox='0 0 56 56'><g fill='none' stroke='${stroke}' stroke-opacity='${op}' stroke-width='${w}'>${ring(0,0)}${ring(56,0)}${ring(0,56)}${ring(56,56)}${ring(28,28)}</g></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
};
const TEX_FAINT = guilloche("#8C7650", 0.065, 0.7);
const TEX_GOLD = guilloche("#B08A3A", 0.5, 0.9);
const TEX_DARK = guilloche("#C8A24E", 0.13, 0.7);

/* Report glow card: an edge and a soft glow all round in the tone. */
const glow = (t, on = true) => ({
  borderRadius: 16, border: `1px solid ${t.fill}${on ? "66" : "33"}`,
  background: `linear-gradient(135deg, #FFFFFF 55%, ${t.tint})`,
  boxShadow: on ? `0 0 26px ${t.fill}36, 0 8px 22px rgba(10,14,20,.07)` : "0 1px 2px rgba(10,14,20,.05), 0 6px 16px rgba(10,14,20,.05)",
});
const CARD = { borderRadius: 18, background: "#FFFFFF", border: `1px solid ${C.rule}`,
  boxShadow: "0 1px 2px rgba(10,14,20,.05), 0 10px 28px rgba(10,14,20,.07)" };

/* A numeral on a small porcelain disc, in the tone's ink. */
const Num = ({ n, t = T.gold, size = 34 }) => (
  <span className="pnum" style={{ width: size, height: size, fontSize: size * 0.44, color: t.ink, borderColor: `${t.fill}77`,
    boxShadow: `inset 0 1px 0 rgba(255,255,255,.95), 0 1px 2px rgba(10,14,20,.08), 0 5px 12px rgba(10,14,20,.08), 0 0 14px ${t.fill}30` }}>{n}</span>
);

/* ── Cycling sample result card ──────────────────────────────
   Bar colours are FIXED across all four states: Business Capacity is
   always gold, Personal Foundation always green. Only the quadrant
   NAME changes colour per state. Module scope so the interval doesn't
   remount it. */
const SAMPLE_STATES = [
  { name: "Concentrated Inside", t: T.gold,  bc: 24, pf: 12 },
  { name: "Reinvest-Weighted",   t: T.green, bc: 24, pf: 21 },
  { name: "Harvest-Weighted",    t: T.cyan,  bc: 13, pf: 23 },
  { name: "Stabilize First",     t: T.red,   bc: 11, pf: 10 },
];
const CYCLE_MS = 3800;

const SampleResultCard = () => {
  const [i, setI] = useState(0);
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  useEffect(() => {
    if (reduced) { setI(0); return; }
    const t = setInterval(() => setI(n => (n + 1) % SAMPLE_STATES.length), CYCLE_MS);
    return () => clearInterval(t);
  }, [reduced]);

  const s = SAMPLE_STATES[i];
  const anim = reduced ? "none" : "sampleFade .5s ease";
  const barTransition = reduced ? "none" : "width .6s cubic-bezier(.4,0,.2,1)";
  const pillars = [
    { label: "Business Capacity", val: s.bc, t: T.gold },
    { label: "Personal Foundation", val: s.pf, t: T.green },
  ];

  return (
    <div className="lift" style={{ ...glow(s.t), padding: "30px 26px 24px", transition: "border-color .6s ease, box-shadow .6s ease, background .6s ease" }}>
      {/* Fixed height: reserves two lines so the card never jumps when a long name wraps. */}
      <div style={{ minHeight: 74, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div key={i} style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 34, fontWeight: 600, letterSpacing: "-0.01em", color: s.t.ink, textAlign: "center", lineHeight: 1.14, animation: anim }}>
          {s.name}
        </div>
      </div>
      <p style={{ fontSize: 13, color: C.ink4, textAlign: "center", margin: "6px 0 24px", fontStyle: "italic" }}>sample result</p>

      {pillars.map(p => (
        <div key={p.label} style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 7 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: p.t.ink }}>{p.label}</span>
            <span key={`${p.label}-${i}`} style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, color: p.t.ink, animation: anim }}>
              {p.val}<span style={{ fontSize: 12, color: C.ink4 }}>/30</span>
            </span>
          </div>
          <div style={{ height: 10, borderRadius: 6, background: "#EDE7DB", boxShadow: "inset 0 1px 2px rgba(10,14,20,.08)", overflow: "hidden" }}>
            <div style={{ width: `${(p.val / 30) * 100}%`, height: "100%", borderRadius: 6, background: `linear-gradient(90deg, ${p.t.fill}cc, ${p.t.fill})`, boxShadow: `0 0 10px ${p.t.fill}66`, transition: barTransition }} />
          </div>
        </div>
      ))}

      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 18 }}>
        {SAMPLE_STATES.map((st, n) => (
          <div key={st.name} style={{ width: n === i ? 18 : 6, height: 6, borderRadius: 3,
            background: n === i ? s.t.fill : "#D9D1C2", transition: reduced ? "none" : "all .4s ease" }} />
        ))}
      </div>
    </div>
  );
};

/* The house primary button: dark, gold label, gold halo, shine on hover. */
const CTA = ({ compact = false }) => (
  <div style={{ textAlign: "center" }}>
    <a href="/reinvest-harvest/start" className="cta shine"
      style={{ display: "inline-block", padding: "24px 67px", borderRadius: 999, textDecoration: "none", background: DARK, border: "1.5px solid #0A0E14" }}>
      {/* The arrow sits past the label's right edge, so it adds no width and the
          label stays centred in the pill. */}
      <span className="ctaLabel"
        style={{ position: "relative", display: "inline-block", fontFamily: "'DM Sans',sans-serif", fontWeight: 700,
          fontSize: "clamp(24px, 3.2vw, 35px)", letterSpacing: ".02em", color: T.gold.fill, whiteSpace: "nowrap", lineHeight: 1.1 }}>
        GET MY SCORECARD
        <svg className="ctaArrow" width="22" height="22" viewBox="0 0 24 24" fill="none"
          stroke={T.gold.fill} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
          style={{ position: "absolute", left: "100%", top: "50%", marginLeft: 12 }}>
          <line x1="4" y1="12" x2="19" y2="12" /><polyline points="13 6 19 12 13 18" />
        </svg>
      </span>
    </a>
    {!compact && (
      <>
        <p style={{ fontSize: "clamp(15px, 2.9vw, 20px)", lineHeight: 1.4, color: C.ink2, margin: "20px 0 0" }}>
          20 questions · about 7 minutes · free
        </p>
        <p style={{ fontSize: "clamp(14px, 2.7vw, 19px)", lineHeight: 1.4, color: C.ink3, margin: "8px 0 0" }}>
          Your scorecard is emailed the moment you finish.
        </p>
      </>
    )}
  </div>
);

export default function ReinvestHarvestLandingCream() {
  const [playing, setPlaying] = useState(false);
  const vidRef = useRef(null);
  const texRef = useRef(null);
  const lampRef = useRef(null);
  const sheenRef = useRef(null);

  /* Unmute restarts from zero - the opening seconds are the hook. Drops the loop
     and hands over native controls. */
  const unmuteVideo = () => {
    const v = vidRef.current;
    if (v) { v.muted = false; v.currentTime = 0; v.loop = false; const p = v.play(); if (p && p.catch) p.catch(() => {}); }
    setPlaying(true);
  };

  /* The engraving travels with the page: fixed layers, pattern shifted by the scroll. */
  useEffect(() => {
    let frame = 0, queued = false;
    const apply = () => {
      queued = false;
      const pos = `0px ${-Math.round(window.scrollY)}px`;
      if (texRef.current) texRef.current.style.backgroundPosition = pos;
      if (sheenRef.current) sheenRef.current.style.backgroundPosition = pos;
    };
    const onScroll = () => { if (!queued) { queued = true; frame = requestAnimationFrame(apply); } };
    window.addEventListener("scroll", onScroll, { passive: true });
    apply();
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(frame); };
  }, []);

  /* The gold lamp that trails the cursor (desktop, fine pointer, motion allowed). */
  useEffect(() => {
    const lamp = lampRef.current, sheen = sheenRef.current;
    if (!lamp || !sheen) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || still) return;
    lamp.style.display = "block"; sheen.style.display = "block";
    let tx = innerWidth / 2, ty = innerHeight * 0.3, x = tx, y = ty, frame = 0;
    const onMove = (e) => { tx = e.clientX; ty = e.clientY; };
    const tick = () => {
      x += (tx - x) * 0.09; y += (ty - y) * 0.09;
      lamp.style.transform = `translate3d(${x - 340}px, ${y - 340}px, 0)`;
      sheen.style.setProperty("--lx", `${x.toFixed(1)}px`);
      sheen.style.setProperty("--ly", `${y.toFixed(1)}px`);
      frame = requestAnimationFrame(tick);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    frame = requestAnimationFrame(tick);
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(frame); };
  }, []);

  const S = { padding: "56px 22px", position: "relative", zIndex: 2 };
  const H1 = { fontFamily: "'Cormorant Garamond',serif", fontWeight: 600, lineHeight: 1.1, letterSpacing: "-0.015em", color: C.ink1, margin: 0 };
  const BODY = { fontFamily: "'DM Sans',sans-serif", fontSize: 16.5, lineHeight: 1.65, color: C.ink2, margin: "0 0 18px" };
  const KICKER = { fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: ".18em", textTransform: "uppercase", margin: "0 0 12px" };

  return (
    <div style={{ background: C.page, minHeight: "100vh", fontFamily: "'DM Sans',sans-serif", position: "relative", overflowX: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; }
        @keyframes sampleFade { from { opacity: 0; } to { opacity: 1; } }
        .wrap { max-width: 940px; margin: 0 auto; position: relative; }
        .col { max-width: 680px; margin: 0 auto; }

        .sheen { --lx: 50vw; --ly: 30vh;
          -webkit-mask-image: radial-gradient(circle 250px at var(--lx) var(--ly), #000 0%, rgba(0,0,0,.55) 40%, transparent 100%);
                  mask-image: radial-gradient(circle 250px at var(--lx) var(--ly), #000 0%, rgba(0,0,0,.55) 40%, transparent 100%); }

        .tile { display: inline-flex; align-items: center; justify-content: center; flex: 0 0 auto;
          background: linear-gradient(180deg,#FFFEFB 0%,#F7F2E8 100%); border: 1px solid #E6DFD1;
          box-shadow: inset 0 1px 0 rgba(255,255,255,.9), 0 1px 2px rgba(10,14,20,.06), 0 10px 22px rgba(10,14,20,.12); }
        .pnum { flex: 0 0 auto; border-radius: 50%; display: flex; align-items: center; justify-content: center;
          font-family: 'Playfair Display',serif; font-weight: 700; line-height: 1; font-variant-numeric: lining-nums; font-feature-settings: 'lnum' 1;
          background: linear-gradient(180deg,#FFFEFB 0%,#F3ECDF 100%); border: 1px solid #E6DFD1; }

        /* the dark button: gold halo, lift and a quick shine */
        .cta { position: relative; overflow: hidden; isolation: isolate; transition: box-shadow .3s ease, transform .3s ease;
          box-shadow: 0 0 0 1px rgba(200,162,78,.55), 0 0 20px rgba(200,162,78,.55), 0 0 52px rgba(200,162,78,.34), 0 10px 24px rgba(10,14,20,.18); }
        .cta::after { content: ""; position: absolute; top: -10%; bottom: -10%; left: -75%; width: 55%; pointer-events: none; opacity: 0;
          background: linear-gradient(100deg, transparent 0%, rgba(250,240,205,0) 22%, rgba(250,240,205,.55) 50%, rgba(250,240,205,0) 78%, transparent 100%);
          transform: skewX(-18deg); }
        @media (hover: hover) {
          .cta:hover { transform: translateY(-2px); box-shadow: 0 0 0 1px rgba(200,162,78,.7), 0 0 24px rgba(200,162,78,.6), 0 0 64px rgba(200,162,78,.38), 0 12px 26px rgba(10,14,20,.2); }
          .cta:hover::after { animation: shine .8s cubic-bezier(.4,0,.2,1); }
        }
        @keyframes shine { 0% { left: -75%; opacity: 1; } 100% { left: 130%; opacity: 1; } }
        .ctaArrow { transform: translateY(-50%); transition: transform .3s cubic-bezier(.4,0,.2,1); }
        .cta:hover .ctaArrow { transform: translateY(-50%) translateX(5px); }
        @media (max-width: 520px) {
          .ctaArrow { width: 14px !important; height: 14px !important; margin-left: 7px !important; }
          .cta { padding: 19px 34px !important; }
          .ctaLabel { font-size: 24px !important; }
        }
        @media (max-width: 380px) {
          .ctaArrow { width: 13px !important; height: 13px !important; margin-left: 6px !important; }
          .cta { padding: 17px 32px !important; }
          .ctaLabel { font-size: 20px !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .cta:hover { transform: none; } .cta:hover::after { animation: none; }
          .ctaArrow, .cta:hover .ctaArrow { transition: none; transform: translateY(-50%); }
        }

        /* cards that lift and glow on hover, smoothly */
        .lift { transition: transform .3s ease, box-shadow .3s ease, border-color .3s ease; }
        @media (hover: hover) and (pointer: fine) { .lift:hover { transform: translateY(-2px); } }

        .vsl-panel { animation: vslPulse 2.4s ease-in-out infinite; }
        .vsl-unmute:hover .vsl-panel { transform: scale(1.04); }
        @keyframes vslPulse { 0%,100% { transform: scale(1); box-shadow: 0 10px 40px rgba(10,14,20,.35); }
          50% { transform: scale(1.035); box-shadow: 0 10px 52px rgba(10,14,20,.4), 0 0 34px rgba(200,162,78,.5); } }
        @media (prefers-reduced-motion: reduce) { .vsl-panel { animation: none; } }

        .wide { max-width: 1180px; margin: 0 auto; }
        /* sections alternate: list left / card right, then grid left / words right */
        .split { display: flex; align-items: center; gap: clamp(28px, 5vw, 64px); }
        .alignR { text-align: right; }
        @media (max-width: 900px) {
          .split { flex-direction: column; align-items: stretch; }
          .split.rev { flex-direction: column-reverse; }
          .splitvis { width: 100% !important; max-width: 520px; margin: 0 auto; }
          .alignR { text-align: center; }
          .biophoto { align-self: center; }
        }
        .quad { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .barbellRow { display: flex; flex-direction: column; align-items: center; gap: 22px; }
        .bbmark { width: min(78vw, 340px); padding: 6px 0; }
        .bbside { text-align: center; }
        .bbside .bbq { font-size: 15.5px; color: #B9C1CC; margin: 0 0 11px; line-height: 1.5; }
        @media (min-width: 860px) {
          .barbellRow { flex-direction: row; justify-content: center; align-items: center; gap: 34px; }
          .bbmark { width: 360px; flex: 0 0 auto; }
          .bbside { text-align: right; } .bbside.right { text-align: left; }
        }
        .steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        @media (max-width: 860px) { .steps { grid-template-columns: 1fr; } }
      `}</style>

      {/* the engraved ground, a soft glow at the top, and the cursor lamp */}
      <div style={{ position: "absolute", top: -80, left: "50%", transform: "translateX(-50%)", width: "min(1100px,150vw)", height: 560,
        background: `radial-gradient(ellipse at center, ${T.gold.fill}1c 0%, transparent 66%)`, pointerEvents: "none", zIndex: 0 }} />
      <div ref={texRef} aria-hidden="true" style={{ position: "fixed", inset: 0, backgroundImage: TEX_FAINT, pointerEvents: "none", zIndex: 0, willChange: "background-position" }} />
      <div ref={lampRef} aria-hidden="true" style={{ position: "fixed", top: 0, left: 0, width: 680, height: 680, borderRadius: "50%",
        background: `radial-gradient(circle, ${T.gold.fill}38 0%, ${T.gold.fill}16 30%, transparent 64%)`, pointerEvents: "none", zIndex: 1, willChange: "transform", display: "none" }} />
      <div ref={sheenRef} aria-hidden="true" className="sheen" style={{ position: "fixed", inset: 0, backgroundImage: TEX_GOLD, pointerEvents: "none", zIndex: 1, display: "none" }} />

      <div className="wrap" style={{ zIndex: 10 }}>

        {/* 0 - NAV HEADER: the metallic shield */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "25px 22px 0", position: "relative", zIndex: 2 }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 11, textDecoration: "none" }}>
            <span className="tile" style={{ width: 40, height: 40, borderRadius: 11 }}>
              <img src="/icons/roadmap-system/shield.png" alt="" width="28" height="28" draggable="false" style={{ display: "block" }} /></span>
            <span style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 18, color: C.ink1, letterSpacing: ".14em" }}>
              KRICZKY <span style={{ color: "#9A7A34" }}>VIRTUS</span>
            </span>
          </a>
        </div>

        {/* 1 - HERO */}
        <section style={{ padding: "30px 22px 30px", position: "relative", zIndex: 2, textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "9px 20px", borderRadius: 999, maxWidth: 540,
            background: "linear-gradient(180deg,#FFFEFB 0%,#F5EFE3 100%)", border: `1px solid ${T.gold.fill}66`, marginBottom: 7,
            boxShadow: `inset 0 1px 0 rgba(255,255,255,.95), 0 1px 2px rgba(10,14,20,.06), 0 6px 16px rgba(10,14,20,.08), 0 0 20px ${T.gold.fill}2a` }}>
            <span style={{ fontSize: 12.5, fontWeight: 500, color: C.ink2, lineHeight: 1.45 }}>
              <b style={{ color: T.gold.ink, fontWeight: 700 }}>80%</b> of the average owner's net worth sits <b style={{ color: T.gold.ink, fontWeight: 700 }}>stuck</b> inside their own company
            </span>
          </div>
          <p style={{ fontSize: 10.5, color: C.ink4, margin: "0 0 22px", fontStyle: "italic" }}>
            Exit Planning Institute, State of Owner Readiness
          </p>

          <h1 style={{ ...H1, fontSize: "clamp(31px, 5.6vw, 58px)", maxWidth: 880, margin: "0 auto", textWrap: "balance" }}>
            Where should your next dollar of profit go - {" "}
            <span style={{ color: T.gold.ink, fontStyle: "italic", fontWeight: 500 }}>back into the business</span>, or{" "}
            <span style={{ color: T.green.ink, fontStyle: "italic", fontWeight: 500 }}>out to you</span>?
          </h1>
          <p style={{ ...BODY, margin: "20px auto 0", maxWidth: 700, fontSize: "clamp(14px, 3.8vw, 22px)", lineHeight: 1.5, color: C.ink1, textWrap: "balance" }}>
            Get it right and your business and financial freedom compound. Get it wrong and you just get busier.
          </p>
          <p style={{ fontSize: "clamp(13px, 3.2vw, 16px)", lineHeight: 1.6, color: C.ink3, maxWidth: 720, margin: "18px auto 0", textWrap: "balance" }}>
            Built for owners targeting or already doing $1M&ndash;$10M a year who want a clear answer to &ldquo;how much stays in the business vs comes out to me&rdquo; in the next 12 months.
          </p>
        </section>

        {/* 2 - PRIMARY CTA, ahead of the video */}
        <section className="col" style={{ padding: "26px 22px 56px", position: "relative", zIndex: 2 }}>
          <CTA />
        </section>

        {/* 3 - VIDEO */}
        <div style={{ padding: "0 22px 30px", position: "relative", zIndex: 2, textAlign: "center" }}>
          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: "clamp(22px, 5.2vw, 52px)", lineHeight: 1.18, color: C.ink1, margin: 0 }}>
            <span style={{ display: "block" }}>Prefer to see why this matters first?</span>
            <span style={{ display: "block", color: T.gold.ink, fontStyle: "italic", fontWeight: 500 }}>It takes just over a minute.</span>
          </p>
        </div>

        <section style={{ marginLeft: "calc(50% - 50vw)", marginRight: "calc(50% - 50vw)", width: "100vw", maxWidth: "100vw", padding: "0 20px 26px", position: "relative", zIndex: 2 }}>
          <div style={{ maxWidth: 1040, margin: "0 auto" }}>
            {/* the video sits in a dark frame with a gold edge, like a screen in a porcelain bezel */}
            <div style={{ padding: 8, borderRadius: 20, background: "linear-gradient(180deg,#FFFEFB 0%,#F3ECDF 100%)", border: "1px solid #E6DFD1",
              boxShadow: `inset 0 1px 0 rgba(255,255,255,.95), 0 2px 4px rgba(10,14,20,.06), 0 22px 48px rgba(10,14,20,.16), 0 0 40px ${T.gold.fill}22` }}>
              <div style={{ position: "relative", aspectRatio: "16/9", borderRadius: 14, overflow: "hidden", background: "#0B1017", border: `1px solid ${T.gold.fill}55` }}>
                <video ref={vidRef} src={VSL_SRC} poster={VSL_POSTER}
                  autoPlay muted loop={!playing} playsInline preload="auto" controls={playing}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                {!playing && (
                  <button onClick={unmuteVideo} aria-label="Unmute video" className="vsl-unmute"
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", border: "none", cursor: "pointer", padding: 0 }}>
                    <span className="vsl-panel" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                      width: "58%", maxWidth: 520, padding: "6% 4%", borderRadius: 20, background: `${T.gold.fill}c4`, border: `1px solid ${T.gold.fill}` }}>
                      <svg width="13%" viewBox="0 0 24 24" fill="#0A0E14" style={{ minWidth: 34, maxWidth: 66, marginBottom: "5%" }}>
                        <path d="M3 9v6h4l5 5V4L7 9H3z" />
                        <path d="M16.5 12c0-1.8-1-3.3-2.5-4v8c1.5-.7 2.5-2.2 2.5-4z" />
                        <path d="M14 3.2v2.1c2.9.9 5 3.5 5 6.7s-2.1 5.8-5 6.7v2.1c4-1 7-4.5 7-8.8s-3-7.8-7-8.8z" />
                      </svg>
                      <span style={{ fontWeight: 700, color: "#0A0E14", lineHeight: 1.25, textAlign: "center", fontSize: "clamp(15px,2.6vw,26px)" }}>
                        Your video is playing<br />Click to unmute
                      </span>
                      <span style={{ fontWeight: 600, color: "#0A0E14", opacity: .72, letterSpacing: ".05em", marginTop: "3%", fontSize: "clamp(11px,1.5vw,15px)" }}>
                        JUST OVER A MINUTE
                      </span>
                    </span>
                  </button>
                )}
              </div>
            </div>
            <div style={{ maxWidth: 1040, margin: "40px auto 0", textAlign: "center" }}>
              <CTA compact />
            </div>
          </div>
        </section>

        {/* 4 - WHAT YOU GET: the list left, the cycling sample card right */}
        <section className="wide" style={S}>
          <div className="split">
            <div style={{ flex: "1 1 0", minWidth: 0 }}>
              <div style={{ ...KICKER, color: T.gold.ink }}>Here's a taste of what you get</div>
              <h2 style={{ ...H1, fontSize: "clamp(32px, 6vw, 48px)", margin: "0 0 18px" }}>Your scorecard <span style={{ fontStyle: "italic", color: T.gold.ink, fontWeight: 500 }}>shows</span></h2>
              {[
                "A score for your business capacity",
                "A score for your personal foundation",
                "Which of the four positions you're in",
                "Three next moves based on how you actually answered",
              ].map((x, n) => (
                <div key={x} style={{ display: "flex", gap: 14, alignItems: "center", padding: "12px 0", borderBottom: n < 3 ? `1px solid ${C.ruleLight}` : "none" }}>
                  <Num n={`0${n + 1}`} />
                  <span style={{ fontSize: "clamp(16px,4.2vw,19px)", lineHeight: 1.45, color: C.ink2 }}>{x}</span>
                </div>
              ))}
            </div>
            <div style={{ flex: "0 0 auto", width: "min(46%, 440px)" }} className="splitvis">
              <SampleResultCard />
            </div>
          </div>
        </section>

        {/* 5 - THE PAIN - centred: a reading column */}
        <section className="col" style={S}>
          <div style={{ ...CARD, padding: "30px 26px" }}>
            <p style={BODY}>You had a good year. The money came in.</p>
            <p style={BODY}>Some went back into the business - a truck, a hire, new equipment, more space. The rest went somewhere.</p>
            <p style={BODY}><strong style={{ color: C.ink1, fontWeight: 700 }}>Ask most owners what that spending actually returned and they can't tell you.</strong> Ask what they'd have today if they'd kept it instead, and they can't tell you that either.</p>
            <p style={BODY}>Meanwhile the business gets bigger. Your life doesn't change much. You're earning more than you ever have and you don't feel any richer.</p>
            <div style={{ ...glow(T.gold), padding: "22px 24px", borderRadius: 14, margin: "26px 0" }}>
              <p style={{ ...BODY, margin: 0, color: C.ink1, fontSize: 17.5, fontWeight: 500 }}>
                The goal is intentional growth that creates financial freedom and actual wealth - not a larger business that is even more fragile and dependent on its owner. <span style={{ color: T.gold.ink, fontWeight: 700 }}>You.</span>
              </p>
            </div>
            <p style={{ ...BODY, margin: 0 }}>
              There's no answer that works for everybody. It comes down to two things. Can your business actually turn more money into more profit? And do you have anything built outside it if the answer is no?
            </p>
          </div>
        </section>

        {/* 6 - THE BARBELL: the page's one dark "splash" card, with the workbook's metallic barbell */}
        <section className="wide" style={S}>
          <div style={{ position: "relative", padding: "clamp(30px,4.4vw,48px) clamp(20px,4vw,48px)", borderRadius: 24, overflow: "hidden", border: "1px solid #2A2213",
            background: `radial-gradient(ellipse 70% 60% at 50% 48%, rgba(200,162,78,.15), transparent 70%), ${TEX_DARK}, ${DARK}`,
            boxShadow: "0 0 0 1px rgba(200,162,78,.08) inset, 0 24px 50px rgba(10,14,20,.28), 0 0 40px rgba(200,162,78,.12)" }}>
            <div style={{ textAlign: "center", marginBottom: 26 }}>
              <div style={{ ...KICKER, color: T.gold.fill }}>The Barbell</div>
              <h2 style={{ ...H1, color: "#E8ECF1", fontSize: "clamp(30px, 6.4vw, 46px)" }}>
                Both sides have to be <span style={{ fontStyle: "italic", color: T.gold.fill, fontWeight: 500 }}>built</span>
              </h2>
            </div>
            <div className="barbellRow">
              <div style={{ flex: 1, minWidth: 0 }} className="bbside">
                <div style={{ ...KICKER, color: T.gold.fill }}>Into the company</div>
                {["Where do I reinvest for growth?", "How do I grow profit margins?", "What one thing is holding growth back?"].map(q => (
                  <p key={q} className="bbq">{q}</p>
                ))}
              </div>
              <div className="bbmark"><BarbellMark /></div>
              <div style={{ flex: 1, minWidth: 0 }} className="bbside right">
                <div style={{ ...KICKER, color: T.green.fill }}>Out to you</div>
                {["Am I investing for financial freedom?", "How much should I hold in reserve?", "Is my tax plan actually planned?"].map(q => (
                  <p key={q} className="bbq">{q}</p>
                ))}
              </div>
            </div>
            <p style={{ ...BODY, textAlign: "center", margin: "28px auto 0", paddingTop: 22, borderTop: "1px solid rgba(200,162,78,.18)", maxWidth: 620, color: "#E8ECF1" }}>
              Load one end and leave the other empty, and the whole thing tips. Most owners have spent ten years loading the left side. <span style={{ color: T.green.fill }}>And they don't even know where to start on the right.</span>
            </p>
          </div>
        </section>

        {/* 7 - THE 2×2: the four positions left, the explanation right */}
        <section className="wide" style={S}>
          <div className="split rev">
            <div style={{ flex: "0 0 auto", width: "min(50%, 520px)" }} className="splitvis">
              <div className="quad">
                {[
                  { n: "Harvest-Weighted", t: T.cyan, on: false },
                  { n: "Reinvest-Weighted", t: T.green, on: false },
                  { n: "Stabilize First", t: T.red, on: false },
                  { n: "Concentrated Inside", t: T.gold, on: true },
                ].map(q => (
                  <div key={q.n} className="lift" style={{ ...glow(q.t, q.on), padding: "22px 15px", minHeight: 118,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 9, textAlign: "center", opacity: q.on ? 1 : .72 }}>
                    <span style={{ width: 9, height: 9, borderRadius: "50%", flex: "0 0 auto",
                      background: `radial-gradient(circle at 35% 30%, #fff 0%, ${q.t.fill} 45%, ${q.t.ink} 100%)`, boxShadow: `0 0 8px ${q.t.fill}aa` }} />
                    <span style={{ fontSize: 15, fontWeight: 700, color: q.t.ink, lineHeight: 1.35 }}>{q.n}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ flex: "1 1 0", minWidth: 0 }} className="alignR">
              <h2 style={{ ...H1, fontSize: "clamp(30px, 5.8vw, 46px)", marginBottom: 12 }}>
                You'll land in one of <span style={{ fontStyle: "italic", color: T.gold.ink, fontWeight: 500 }}>four positions</span>.
              </h2>
              <p style={{ ...BODY, fontSize: 17, color: C.ink1 }}>Your two scores decide it - not the total.</p>
              <p style={{ ...BODY, margin: 0 }}>
                Same total, different split, different answer. An owner at 24 and 12 needs something very different than one at 18 and 18.
              </p>
            </div>
          </div>
        </section>

        {/* 8 - WHERE THIS FITS: the live roadmap, the scorecard marked as station 01 */}
        <section className="wide" style={S}>
          <div style={{ textAlign: "center", maxWidth: 760, margin: "0 auto" }}>
            <div style={{ ...KICKER, color: T.gold.ink }}>The Owner’s Virtus Roadmap</div>
            <h2 style={{ ...H1, fontSize: "clamp(32px, 6vw, 50px)", margin: "0 0 14px" }}>Six stations, <span style={{ fontStyle: "italic", color: T.gold.ink, fontWeight: 500 }}>one system</span></h2>
            <p style={{ ...BODY, margin: 0 }}>Your scorecard is station 01: the first answer the rest of the roadmap builds on.</p>
          </div>
          <div style={{ marginTop: "clamp(18px,3vw,34px)" }}><RoadmapSystem here={[0]} workshop={false} /></div>
        </section>

        {/* 9 - WHO BUILT THIS: photo left, words right */}
        <section className="wide" style={S}>
          <div className="split" style={{ maxWidth: 900, margin: "0 auto" }}>
            <div style={{ flex: "0 0 auto" }} className="biophoto">
              <span style={{ display: "block", padding: 7, borderRadius: 26, background: "linear-gradient(180deg,#FFFEFB 0%,#F3ECDF 100%)", border: `1px solid ${T.gold.fill}66`,
                boxShadow: `inset 0 1px 0 rgba(255,255,255,.95), 0 18px 40px rgba(10,14,20,.18), 0 0 30px ${T.gold.fill}2e` }}>
                <img src="/img/edward.jpg" alt="Edward Kriczky" width="260" height="260"
                  style={{ width: "min(260px, 64vw)", height: "auto", aspectRatio: "1 / 1", borderRadius: 20, objectFit: "cover", objectPosition: "center 20%", display: "block" }} />
              </span>
            </div>
            <div style={{ flex: "1 1 0", minWidth: 0 }}>
              <div style={{ ...glow(T.gold), padding: "28px 28px 26px" }}>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 700, color: C.ink1 }}>
                  Edward Kriczky, <span style={{ color: T.gold.ink }}>CEPA<sup style={{ fontSize: 12, fontWeight: 600, marginLeft: 1 }}>&#174;</sup></span>
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase", color: T.gold.ink, margin: "2px 0 14px" }}>Founder, Kriczky Virtus</div>
                <p style={{ fontSize: 16, lineHeight: 1.65, color: C.ink2, margin: 0 }}>
                  We've all heard the phrase "reinvest back into your business" - but nobody shows you how, specifically customized to your company's unique situation. I help business owners figure out where their best opportunities for ROI are when reinvesting back into their business, aligned with where they want their business to go long-term.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 10 - HOW IT WORKS: three steps across */}
        <section className="wide" style={S}>
          <div className="steps">
            {[
              { t: "Answer 20 questions", d: "One at a time. About 7 minutes." },
              { t: "Get your position", d: "Both scores, and which side is carrying you." },
              { t: "Know where the next dollar goes", d: "Three moves based on how you actually scored." },
            ].map((s, i) => (
              <div key={s.t} className="lift step" style={{ ...CARD, padding: "26px 22px", textAlign: "center" }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}><Num n={`0${i + 1}`} size={48} /></div>
                <div style={{ fontSize: 17, fontWeight: 700, color: C.ink1, marginBottom: 5 }}>{s.t}</div>
                <div style={{ fontSize: 14.5, color: C.ink2, lineHeight: 1.55 }}>{s.d}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 11 - FINAL CTA */}
        <section className="col" style={{ ...S, paddingTop: 16 }}>
          <CTA />
        </section>

        {/* 12 - DISCLOSURE + FOOTER */}
        <footer style={{ padding: "34px 22px 50px", position: "relative", zIndex: 2 }}>
          <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${C.rule}, transparent)`, marginBottom: 28 }} />
          <p style={{ fontSize: 11, lineHeight: 1.6, color: C.ink4, textAlign: "center", margin: "0 auto 28px", maxWidth: 620 }}>
            This scorecard is an educational self-assessment tool from Kriczky Virtus. It is general in nature, is based entirely on your own self-reported answers, and does not constitute individualized financial, tax, legal, or accounting advice, nor a recommendation to pursue any particular course of action. No outcome is projected or guaranteed. Your situation is specific to you - coordinate any decision with your CPA, attorney, and other advisors before acting.
          </p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", paddingTop: 24, borderTop: `1px solid ${C.ruleLight}` }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.ink3} strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 7l-10 7L2 7" /></svg>
                <span style={{ fontSize: 11.5, color: C.ink3 }}>ekriczky@kriczkyvirtus.com</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.ink3} strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" /></svg>
                <span style={{ fontSize: 11.5, color: C.ink3 }}>kriczkyvirtus.com</span>
              </div>
            </div>
            <img src="/icons/roadmap-system/shield.png" alt="" width="34" height="34" draggable="false" />
          </div>
        </footer>
      </div>
    </div>
  );
}
