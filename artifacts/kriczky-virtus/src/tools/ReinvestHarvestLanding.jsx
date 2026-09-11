import { useState, useEffect } from "react";

/* ═══════════════════════════════════════════════════════════════
   REINVEST OR HARVEST — LANDING PAGE
   Route: /reinvest-harvest
   Mobile-first. Traffic is ManyChat DMs off Reels + paid IG.
   ═══════════════════════════════════════════════════════════════ */

const HEADSHOT = "data:image/jpeg;base64,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";

const C = {
  bgDeep: "#0A0E14", bgCard: "#111720", bgElev: "#1A2130",
  gold: "#C8A24E", goldLight: "#D4B665", goldDark: "#8A6C2A", goldMuted: "#A68A42",
  green: "#34D399", greenLight: "#6FE2BB", greenDark: "#1B8A63",
  cyan: "#22D3EE", red: "#F87171",
  text1: "#E8ECF1", text2: "#8B95A5", text3: "#5A6474", text4: "#3D4654",
  border1: "rgba(255,255,255,0.06)", border2: "rgba(255,255,255,0.10)",
};

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

/* ── Two-tone barbell: gold plates left, green plates right ── */
const Barbell = ({ w = 200 }) => (
  <svg width={w} height={w * 0.42} viewBox="0 0 400 168" fill="none" style={{ display: "block" }}>
    <defs>
      {/* userSpaceOnUse is REQUIRED: these are axis-aligned lines, so an
          objectBoundingBox gradient has zero width/height and the SVG spec
          says the element is not painted at all. */}
      <linearGradient id="bbBar" gradientUnits="userSpaceOnUse" x1="140" y1="84" x2="260" y2="84">
        <stop offset="0%" stopColor={C.gold} /><stop offset="100%" stopColor={C.green} />
      </linearGradient>
      <linearGradient id="bbGold" gradientUnits="userSpaceOnUse" x1="92" y1="28" x2="152" y2="140">
        <stop offset="0%" stopColor="#F8ECC4" /><stop offset="35%" stopColor={C.gold} />
        <stop offset="55%" stopColor="#5A4419" /><stop offset="70%" stopColor={C.goldLight} />
        <stop offset="100%" stopColor={C.goldDark} />
      </linearGradient>
      <linearGradient id="bbGreen" gradientUnits="userSpaceOnUse" x1="248" y1="28" x2="308" y2="140">
        <stop offset="0%" stopColor="#D8FCEE" /><stop offset="35%" stopColor={C.green} />
        <stop offset="55%" stopColor="#0F5C42" /><stop offset="70%" stopColor={C.greenLight} />
        <stop offset="100%" stopColor={C.greenDark} />
      </linearGradient>
      <filter id="bbGlowG" x="-60%" y="-60%" width="220%" height="220%">
        <feDropShadow dx="0" dy="0" stdDeviation="9" floodColor={C.gold} floodOpacity="0.55" />
      </filter>
      <filter id="bbGlowE" x="-60%" y="-60%" width="220%" height="220%">
        <feDropShadow dx="0" dy="0" stdDeviation="9" floodColor={C.green} floodOpacity="0.55" />
      </filter>
    </defs>
    <line x1="140" y1="84" x2="260" y2="84" stroke="url(#bbBar)" strokeWidth="11" strokeLinecap="round" />
    <g stroke="url(#bbGold)" strokeWidth="17" strokeLinecap="round" filter="url(#bbGlowG)">
      <line x1="140" y1="40" x2="140" y2="128" />
      <line x1="104" y1="56" x2="104" y2="112" />
    </g>
    <g stroke="url(#bbGreen)" strokeWidth="17" strokeLinecap="round" filter="url(#bbGlowE)">
      <line x1="260" y1="40" x2="260" y2="128" />
      <line x1="296" y1="56" x2="296" y2="112" />
    </g>
  </svg>
);

const KVShield = ({ size = 22, glow = false }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none"
    style={glow ? { filter: `drop-shadow(0 0 12px ${C.gold}60) drop-shadow(0 0 4px ${C.gold}90)` } : {}}>
    <path d="M32 8L14 16V30C14 42 22 52 32 56C42 52 50 42 50 30V16L32 8Z"
      fill="none" stroke={C.gold} strokeWidth="2.5" strokeLinejoin="round" />
    <path d="M32 12L18 18.5V30C18 40.5 24.5 49 32 52C39.5 49 46 40.5 46 30V18.5L32 12Z"
      fill="rgba(200,162,78,0.06)" />
  </svg>
);

const Shield = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none"
    style={{ filter: "drop-shadow(0 0 12px rgba(200,162,78,0.38)) drop-shadow(0 0 4px rgba(200,162,78,0.56))" }}>
    <path d="M32 8L14 16V30C14 42 22 52 32 56C42 52 50 42 50 30V16L32 8Z"
      fill="none" stroke={C.gold} strokeWidth="2.5" strokeLinejoin="round" />
    <path d="M32 12L18 18.5V30C18 40.5 24.5 49 32 52C39.5 49 46 40.5 46 30V18.5L32 12Z"
      fill="rgba(200,162,78,0.06)" />
  </svg>
);

const Rule = () => (
  <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${C.gold}33, transparent)`, margin: "0 auto" }} />
);

/* ── Cycling sample result card ──────────────────────────────
   Bar colors are FIXED across all four states: Business Capacity
   is always gold, Personal Foundation is always green. Those two
   colors identify the two pillars across the whole brand system,
   so only the quadrant NAME changes color per state.
   Defined at module scope so the interval doesn't remount it. */
const SAMPLE_STATES = [
  { name: "Concentrated Inside", color: C.gold,  bc: 24, pf: 12 },
  { name: "Reinvest-Weighted",          color: C.green, bc: 24, pf: 21 },
  { name: "Harvest-Weighted",           color: C.cyan,  bc: 13, pf: 23 },
  { name: "Stabilize First",            color: C.red,   bc: 11, pf: 10 },
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
    { label: "Business Capacity",   val: s.bc, color: C.gold },
    { label: "Personal Foundation", val: s.pf, color: C.green },
  ];

  return (
    <div style={{ padding: "24px 22px", borderRadius: 16, background: "linear-gradient(145deg, rgba(255,255,255,.05), rgba(255,255,255,.02) 50%, rgba(255,255,255,.03))", backdropFilter: "blur(16px)", border: `1px solid ${C.gold}2e`, borderTop: "1px solid rgba(255,255,255,.12)", boxShadow: `0 2px 4px rgba(0,0,0,.2), 0 10px 36px rgba(0,0,0,.45), inset 0 1px 0 rgba(255,255,255,.06), 0 0 40px ${C.gold}08` }}>
      <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: ".18em", textTransform: "uppercase", color: C.gold, textAlign: "center", margin: "0 0 12px" }}>
        Here's a taste of what you get
      </div>

      {/* Fixed height: reserves two lines so the card never jumps
          when a long name wraps on mobile. */}
      <div style={{ minHeight: 74, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div key={i} style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, fontWeight: 400, letterSpacing: "-0.01em", color: s.color, textAlign: "center", lineHeight: 1.14, animation: anim }}>
          {s.name}
        </div>
      </div>

      <p style={{ fontSize: 13, color: C.text3, textAlign: "center", margin: "6px 0 22px", fontStyle: "italic" }}>sample result</p>

      {pillars.map(p => (
        <div key={p.label} style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 7 }}>
            <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: p.color }}>{p.label}</span>
            <span key={`${p.label}-${i}`} style={{ fontFamily: "'Playfair Display',serif", fontSize: 19, fontWeight: 700, color: p.color, animation: anim }}>
              {p.val}<span style={{ fontSize: 12, color: C.text3 }}>/30</span>
            </span>
          </div>
          <div style={{ height: 9, borderRadius: 5, background: "rgba(255,255,255,.06)", overflow: "hidden" }}>
            <div style={{ width: `${(p.val / 30) * 100}%`, height: "100%", borderRadius: 5, background: p.color, boxShadow: `0 0 10px ${p.color}66`, transition: barTransition }} />
          </div>
        </div>
      ))}

      {/* What they actually get — static, so it sits below the cycling scores
          rather than inside them. Gold numerals match the thank-you page's
          "Your next step" block, so the two read as one system. */}
      <div style={{ marginTop: 22, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,.07)" }}>
        <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: C.gold, textAlign: "center", marginBottom: 18 }}>
          Your scorecard shows
        </div>
        {[
          "A score for your business capacity",
          "A score for your personal foundation",
          "Which of the four positions you're in",
          "Three next moves based on how you actually answered",
        ].map((t, n) => (
          <div key={t} style={{ display: "flex", gap: 14, alignItems: "baseline", padding: "10px 0", borderBottom: n < 3 ? "1px solid rgba(255,255,255,.05)" : "none" }}>
            <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 25, fontWeight: 700, color: `${C.gold}66`, lineHeight: 1, minWidth: 36 }}>0{n + 1}</span>
            <span style={{ fontSize: 20, lineHeight: 1.5, color: C.text2 }}>{t}</span>
          </div>
        ))}
      </div>

      {/* Cycle indicator */}
      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 18 }}>
        {SAMPLE_STATES.map((st, n) => (
          <div key={st.name} style={{
            width: n === i ? 16 : 5, height: 5, borderRadius: 3,
            background: n === i ? s.color : "rgba(255,255,255,.14)",
            transition: reduced ? "none" : "all .4s ease",
          }} />
        ))}
      </div>
    </div>
  );
};

const CTA = () => (
  <div style={{ textAlign: "center" }}>
    <a href="/reinvest-harvest/start" className="cta"
      style={{
        display: "inline-block", padding: "24px 67px", borderRadius: 999, textDecoration: "none",
        background: `linear-gradient(135deg, ${C.gold}22, ${C.gold}0d)`,
        border: `1.5px solid ${C.gold}66`,
        boxShadow: `0 0 34px ${C.gold}1f, 0 6px 18px rgba(0,0,0,.35)`,
        transition: "all 0.3s ease",
      }}>
      {/* The arrow is absolutely positioned off the right edge of this span,
          so it adds no width and the label stays centered in the pill on
          its own rather than being pushed left by the arrow. */}
      <span className="ctaLabel"
        style={{
          position: "relative", display: "inline-block",
          fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: "clamp(24px, 3.2vw, 35px)",
          letterSpacing: ".02em", color: C.gold, whiteSpace: "nowrap", lineHeight: 1.1,
        }}>
        GET MY SCORECARD
        <svg className="ctaArrow" width="22" height="22" viewBox="0 0 24 24" fill="none"
          stroke={C.gold} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
          style={{ position: "absolute", left: "100%", top: "50%", marginLeft: 12 }}>
          <line x1="4" y1="12" x2="19" y2="12" /><polyline points="13 6 19 12 13 18" />
        </svg>
      </span>
    </a>
    {/* Up from 12.5/12, then back 20%. Clamped rather than flat so both lines
        still fit a narrow phone. */}
    <p style={{ fontSize: "clamp(15px, 2.9vw, 20px)", lineHeight: 1.4, color: C.text2, margin: "18px 0 0" }}>
      20 questions · about 7 minutes · free
    </p>
    <p style={{ fontSize: "clamp(14px, 2.7vw, 19px)", lineHeight: 1.4, color: C.text3, margin: "8px 0 0" }}>
      Your scorecard is emailed the moment you finish.
    </p>
  </div>
);

export default function ReinvestHarvestLanding() {
  const [playing, setPlaying] = useState(false);

  const S = { padding: "56px 22px", position: "relative", zIndex: 2 };
  const H1 = { fontFamily: "'Cormorant Garamond',serif", fontWeight: 400, lineHeight: 1.12, letterSpacing: "-0.015em", color: C.text1, margin: 0 };
  const BODY = { fontFamily: "'DM Sans',sans-serif", fontSize: 16, lineHeight: 1.65, color: C.text2, margin: "0 0 18px" };
  const KICKER = { fontFamily: "'DM Sans',sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: ".18em", textTransform: "uppercase", margin: "0 0 12px" };

  return (
    <div style={{ background: C.bgDeep, minHeight: "100vh", fontFamily: "'DM Sans',sans-serif", position: "relative", overflow: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500&family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; }
        @keyframes sampleFade { from { opacity: 0; } to { opacity: 1; } }
        .wrap { max-width: 940px; margin: 0 auto; position: relative; }
        /* Wrapper is 940 so the hero headline gets real measure at 56px.
           Everything below the hero re-narrows to a 680px reading column —
           body copy at 940 is uncomfortably wide. */
        .col { max-width: 680px; margin: 0 auto; }
        .cta:hover { box-shadow: 0 0 48px ${C.gold}33, 0 8px 22px rgba(0,0,0,.45) !important; border-color: ${C.gold}99 !important; transform: translateY(-1px); }
        .ctaArrow { transform: translateY(-50%); transition: transform .3s cubic-bezier(.4,0,.2,1); }
        .cta:hover .ctaArrow { transform: translateY(-50%) translateX(5px); }
        /* Scaled with the button, but sized so the pill stays inside the
           viewport — at 30px the label alone overran a 390px screen. */
        @media (max-width: 520px) {
          .cta { padding: 19px 32px !important; }
          .ctaLabel { font-size: 24px !important; }
        }
        @media (max-width: 380px) {
          .cta { padding: 17px 22px !important; }
          .ctaLabel { font-size: 20px !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .cta:hover { transform: none; }
          .ctaArrow, .cta:hover .ctaArrow { transition: none; transform: translateY(-50%); }
        }
        .twoCol { display: grid; grid-template-columns: 1fr; gap: 14px; }
        .quad { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .barbellRow { display: flex; flex-direction: column; align-items: center; gap: 22px; }
        @media (min-width: 720px) {
          .twoCol { grid-template-columns: 1fr 1fr; gap: 18px; }
          .barbellRow { flex-direction: row; justify-content: center; align-items: center; gap: 28px; }
        }
      `}</style>

      {/* Background atmosphere */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, background: `radial-gradient(ellipse 80% 60% at 25% 85%, #221a08 0%, transparent 55%), radial-gradient(ellipse 60% 50% at 75% 15%, #0d2320 0%, transparent 55%), radial-gradient(ellipse 70% 50% at 50% 50%, rgba(200,162,78,0.04) 0%, transparent 60%), linear-gradient(155deg, #070a10 0%, #0c1018 25%, #151208 50%, #0b1a17 75%, #090d14 100%)` }} />
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1, opacity: .06, mixBlendMode: "overlay", backgroundImage: GRAIN, backgroundSize: "128px 128px" }} />

      {/* Caustic light streaks — gold left, green right (mirrors the barbell) */}
      <div style={{ position: "fixed", top: "16%", left: "4%", width: 500, height: 6, background: `linear-gradient(90deg, transparent, ${C.gold} 50%, transparent)`, filter: "blur(20px)", opacity: 0.08, transform: "rotate(-10deg)", pointerEvents: "none", zIndex: 1 }} />
      <div style={{ position: "fixed", top: "58%", right: "0%", width: 420, height: 6, background: `linear-gradient(90deg, transparent, ${C.green} 50%, transparent)`, filter: "blur(18px)", opacity: 0.06, transform: "rotate(8deg)", pointerEvents: "none", zIndex: 1 }} />

      <div className="wrap" style={{ zIndex: 10 }}>

        {/* 0 — NAV HEADER */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "25px 22px 0", position: "relative", zIndex: 2 }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: "rgba(200,162,78,0.06)", border: "1px solid rgba(200,162,78,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <KVShield size={19} glow />
            </div>
            <span style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 17, color: C.text1, letterSpacing: 1.2, textTransform: "uppercase" }}>
              KRICZKY VIRTUS
            </span>
          </a>
        </div>

        {/* 1 — HERO */}
        <section style={{ padding: "34px 22px 30px", position: "relative", zIndex: 2, textAlign: "center" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            padding: "8px 20px", borderRadius: 100, maxWidth: 520,
            background: `linear-gradient(135deg, ${C.gold}14, ${C.gold}08)`,
            border: `1px solid ${C.gold}33`, marginBottom: 6,
          }}>
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 500, color: C.text2, lineHeight: 1.45 }}>
              <b style={{ color: C.gold, fontWeight: 700 }}>80%</b> of the average owner's net worth sits inside their own company
            </span>
          </div>
          <p style={{ fontSize: 10, color: C.text4, margin: "0 0 22px", fontStyle: "italic" }}>
            Exit Planning Institute, State of Owner Readiness
          </p>

          <h1 style={{ ...H1, fontSize: "clamp(29px, 5.4vw, 56px)", maxWidth: 880, margin: "0 auto", textWrap: "balance" }}>
            Where should your next dollar of profit go —{" "}
            <span style={{ color: C.gold, fontStyle: "italic" }}>back into the business</span>, or{" "}
            <span style={{ color: C.green, fontStyle: "italic" }}>out to you</span>?
          </h1>
          {/* One flowing paragraph rather than two blocks, so both sentences share
              lines and the whole thing fits two. At 390px, 15px is the ceiling for
              two lines with this text, and 375px (iPhone SE) needs ~14. Floor is 14,
              desktop scales to 22. */}
          <p style={{ ...BODY, margin: "20px auto 0", maxWidth: 700, fontSize: "clamp(14px, 3.8vw, 22px)", lineHeight: 1.5, textWrap: "balance" }}>
            Get it right and your business and financial freedom compound. Get it wrong and you just get busier.
          </p>
          {/* Qualifier — mirrors the thank-you page, widened to "targeting or
              already doing" so aspiring owners aren't screened out at the door. */}
          <p style={{ fontSize: "clamp(13px, 3.2vw, 16px)", lineHeight: 1.6, color: C.text3, maxWidth: 720, margin: "18px auto 0", textWrap: "balance" }}>
            Built for owners targeting or already doing $1M&ndash;$10M a year who want a clear answer to &ldquo;how much stays in the business vs comes out to me&rdquo; in the next 12 months.
          </p>
        </section>

        {/* 2 — PRIMARY CTA — ahead of the video: the ready ones shouldn't have to
             sit through 90 seconds to find the button. */}
        <section className="col" style={{ padding: "26px 22px 54px", position: "relative", zIndex: 2 }}>
          <CTA />
        </section>

        {/* 3 — VIDEO — now optional rather than the gate before the button */}
        {/* Heading sits outside .col so it gets the 940px wrapper instead of the
            680px reading column — at 52px the first sentence needs 789px and
            would wrap inside col. Two explicit blocks, so the break is where it
            should be rather than wherever the text happens to run out. */}
        <div style={{ padding: "0 22px 34px", position: "relative", zIndex: 2, textAlign: "center" }}>
          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: "clamp(20px, 5.2vw, 52px)", lineHeight: 1.22, color: C.text1, margin: 0 }}>
            <span style={{ display: "block" }}>Prefer to see why this matters first?</span>
            <span style={{ display: "block" }}>Watch 90 seconds below.</span>
          </p>
        </div>

        {/* Matches the thank-you page player exactly: 1080px container, so the
            16:9 frame renders 1040x585 on desktop. Breaks out of .col, which caps
            at 680 — the page wrapper is 940, so this uses a viewport-bounded
            breakout rather than a plain maxWidth. */}
        <section style={{ marginLeft: "calc(50% - 50vw)", marginRight: "calc(50% - 50vw)", width: "100vw", maxWidth: "100vw", padding: "0 20px 26px", boxSizing: "border-box", position: "relative", zIndex: 2 }}>
          <div style={{ maxWidth: 1040, margin: "0 auto" }}>
          <div onClick={() => setPlaying(true)}
            style={{ position: "relative", aspectRatio: "16/9", borderRadius: 14, overflow: "hidden", cursor: "pointer", background: "linear-gradient(145deg,#141B26,#0C1119)", border: `1px solid ${C.gold}2e`, boxShadow: "0 8px 28px rgba(0,0,0,.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 96, height: 96, borderRadius: "50%", border: `2px solid ${C.gold}88`, background: `${C.gold}14`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", boxShadow: `0 0 26px ${C.gold}33` }}>
                <svg width="33" height="37" viewBox="0 0 22 24" fill={C.gold}><path d="M21 12L0 24V0z" /></svg>
              </div>
              <div style={{ fontSize: 16, color: C.text2, letterSpacing: ".04em" }}>
                {playing ? "VSL embed goes here" : "Watch: 90 seconds on why this matters"}
              </div>
            </div>
          </div>
          </div>
        </section>

        {/* 4 — SAMPLE RESULT CARD (cycles through all four quadrants) */}
        {/* 50px top: the video section already contributes 26px below itself, so
            26 + 50 = 76px — matching the 76px gap below this card (its own 20px
            plus the pain section's 56px top). */}
        <section className="col" style={{ padding: "50px 22px 20px", position: "relative", zIndex: 2 }}>
          <SampleResultCard />
        </section>

        {/* 5 — THE PAIN */}
        <section className="col" style={S}>
          <div style={{ padding: "28px 24px", borderRadius: 16, background: "linear-gradient(145deg, rgba(255,255,255,.04), rgba(255,255,255,.015) 50%, rgba(255,255,255,.025))", backdropFilter: "blur(16px)", border: `1px solid ${C.border2}`, borderTop: "1px solid rgba(255,255,255,.10)", boxShadow: "0 2px 4px rgba(0,0,0,.2), 0 8px 24px rgba(0,0,0,.25), inset 0 1px 0 rgba(255,255,255,.05)" }}>
            <p style={BODY}>You had a good year. The money came in.</p>
            <p style={BODY}>Some went back into the business — a truck, a hire, new equipment, more space. The rest went somewhere.</p>
            <p style={BODY}><strong style={{ color: C.text1, fontWeight: 700 }}>Ask most owners what that spending actually returned and they can't tell you.</strong> Ask what they'd have today if they'd kept it instead, and they can't tell you that either.</p>
            <p style={BODY}>Meanwhile the business gets bigger. Your life doesn't change much. You're earning more than you ever have and you don't feel any richer.</p>
            <div style={{ padding: "22px 24px", borderRadius: 14, background: `linear-gradient(135deg, ${C.gold}08, ${C.gold}03)`, border: `1px solid ${C.gold}25`, margin: "26px 0" }}>
              <p style={{ ...BODY, margin: 0, color: C.text1, fontSize: 17, fontWeight: 500 }}>
                The goal is intentional growth that creates financial freedom and actual wealth — not a larger business that is even more fragile and dependent on its owner. <span style={{ color: C.gold, fontWeight: 700 }}>You.</span>
              </p>
            </div>
            <p style={{ ...BODY, margin: 0 }}>
              There's no answer that works for everybody. It comes down to two things. Can your business actually turn more money into more profit? And do you have anything built outside it if the answer is no?
            </p>
          </div>
        </section>

        {/* 6 — THE BARBELL */}
        <section className="col" style={S}>
         <div style={{ padding: "32px 24px", borderRadius: 14, background: `linear-gradient(135deg, ${C.gold}08, ${C.gold}03)`, border: `1px solid ${C.gold}25` }}>
          <div style={{ textAlign: "center", marginBottom: 30 }}>
            <div style={{ ...KICKER, color: C.gold }}>The Barbell</div>
            <h2 style={{ ...H1, fontSize: "clamp(27px, 6.4vw, 38px)" }}>
              Both sides have to be <span style={{ fontStyle: "italic", color: C.gold }}>built</span>
            </h2>
          </div>

          <div className="barbellRow">
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ ...KICKER, color: C.gold, textAlign: "center" }}>Into the company</div>
              {["Where do I reinvest for growth?", "How do I grow profit margins?", "What one thing is holding growth back?"].map(q => (
                <p key={q} style={{ fontSize: 14.5, color: C.text2, textAlign: "center", margin: "0 0 11px", lineHeight: 1.5 }}>{q}</p>
              ))}
            </div>
            <Barbell w={190} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ ...KICKER, color: C.green, textAlign: "center" }}>Out to you</div>
              {["Am I investing for financial freedom?", "How much should I hold in reserve?", "Is my tax plan actually planned?"].map(q => (
                <p key={q} style={{ fontSize: 14.5, color: C.text2, textAlign: "center", margin: "0 0 11px", lineHeight: 1.5 }}>{q}</p>
              ))}
            </div>
          </div>

          <p style={{ ...BODY, textAlign: "center", margin: "30px auto 0", maxWidth: 560, color: C.text1 }}>
            Load one end and leave the other empty, and the whole thing tips. Most owners have spent ten years loading the left side. <span style={{ color: C.green }}>And they don't even know where to start on the right.</span>
          </p>
         </div>
        </section>

        {/* 7 — THE 2×2 */}
        <section className="col" style={S}>
          <h2 style={{ ...H1, fontSize: "clamp(24px, 5.6vw, 32px)", textAlign: "center", marginBottom: 8 }}>
            You'll land in one of <span style={{ fontStyle: "italic", color: C.gold }}>four positions</span>.
          </h2>
          <p style={{ ...BODY, textAlign: "center", fontSize: 14, marginBottom: 24 }}>
            Your two scores decide it — not the total.
          </p>
          <div className="quad">
            {[
              { n: "Harvest-Weighted", c: C.cyan, on: false },
              { n: "Reinvest-Weighted", c: C.green, on: false },
              { n: "Stabilize First", c: C.red, on: false },
              { n: "Concentrated Inside", c: C.gold, on: true },
            ].map(q => (
              <div key={q.n} style={{
                padding: "20px 15px", borderRadius: 12, minHeight: 92, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center",
                background: `linear-gradient(135deg, ${q.c}${q.on ? "1c" : "09"}, ${q.c}04)`,
                border: `1.5px solid ${q.c}${q.on ? "66" : "22"}`,
                boxShadow: q.on ? `0 0 22px ${q.c}2e` : "none", opacity: q.on ? 1 : .48,
              }}>
                <span style={{ fontSize: 13.5, fontWeight: 700, color: q.c, lineHeight: 1.35 }}>{q.n}</span>
              </div>
            ))}
          </div>
          <p style={{ ...BODY, textAlign: "center", fontSize: 14, margin: "22px auto 0", maxWidth: 520 }}>
            Same total, different split, different answer. An owner at 24 and 12 needs something very different than one at 18 and 18.
          </p>
        </section>

        {/* 8 — WHO BUILT THIS */}
        <section className="col" style={S}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <img src={HEADSHOT} alt="Edward Kriczky"
              style={{ width: 120, height: 120, borderRadius: "50%", objectFit: "cover", border: `3px solid ${C.gold}50`, marginBottom: -28, boxShadow: `0 0 24px ${C.gold}20, 0 4px 16px rgba(0,0,0,0.4)`, position: "relative", zIndex: 2 }} />
            <div style={{ width: "100%", padding: "44px 24px 24px", background: `linear-gradient(135deg, ${C.gold}08, ${C.gold}03)`, border: `1px solid ${C.gold}25`, borderRadius: 14, textAlign: "center" }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: C.text1 }}>
                Edward Kriczky, CEPA<sup style={{ fontSize: 10, fontWeight: 600, marginLeft: 1 }}>&#174;</sup>
              </div>
              <div style={{ fontSize: 11, color: C.gold, marginBottom: 10 }}>Founder, Kriczky Virtus</div>
              <p style={{ fontSize: 13, lineHeight: 1.65, color: C.text2, margin: 0, maxWidth: 560, marginLeft: "auto", marginRight: "auto" }}>
                We've all heard the phrase "reinvest back into your business" — but nobody shows you how, specifically customized to your company's unique situation. I help business owners figure out where their best opportunities for ROI are when reinvesting back into their business, aligned with where they want their business to go long-term.
              </p>
            </div>
          </div>
        </section>

        {/* 9 — HOW IT WORKS */}
        <section className="col" style={S}>
          <div className="twoCol" style={{ gridTemplateColumns: "1fr" }}>
            {[
              { t: "Answer 20 questions", d: "One at a time. About 7 minutes." },
              { t: "Get your position", d: "Both scores, and which side is carrying you." },
              { t: "Know where the next dollar goes", d: "Three moves based on how you actually scored." },
            ].map((s, i) => (
              <div key={s.t} style={{ display: "flex", gap: 16, alignItems: "flex-start", padding: "16px 0", borderBottom: i < 2 ? `1px solid ${C.border1}` : "none" }}>
                <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 700, color: `${C.gold}66`, lineHeight: 1, minWidth: 34 }}>0{i + 1}</span>
                <div>
                  <div style={{ fontSize: 15.5, fontWeight: 700, color: C.text1, marginBottom: 3 }}>{s.t}</div>
                  <div style={{ fontSize: 14, color: C.text2, lineHeight: 1.55 }}>{s.d}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 10 — FINAL CTA */}
        <section className="col" style={{ ...S, paddingTop: 12 }}>
          <CTA />
        </section>

        {/* 11 — DISCLOSURE + FOOTER */}
        <footer style={{ padding: "34px 22px 50px", borderTop: `1px solid ${C.border1}`, position: "relative", zIndex: 2 }}>
          <p style={{ fontSize: 10.5, lineHeight: 1.6, color: C.text3, textAlign: "center", margin: "0 0 28px", maxWidth: 620, marginLeft: "auto", marginRight: "auto" }}>
            This scorecard is an educational self-assessment tool from Kriczky Virtus. It is general in nature, is based entirely on your own self-reported answers, and does not constitute individualized financial, tax, legal, or accounting advice, nor a recommendation to pursue any particular course of action. No outcome is projected or guaranteed. Your situation is specific to you — coordinate any decision with your CPA, attorney, and other advisors before acting.
          </p>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", paddingTop: 24, borderTop: `1px solid ${C.border1}` }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.text3} strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 7l-10 7L2 7" /></svg>
                <span style={{ fontSize: 11, color: C.text3 }}>ekriczky@kriczkyvirtus.com</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.text3} strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" /></svg>
                <span style={{ fontSize: 11, color: C.text3 }}>kriczkyvirtus.com</span>
              </div>
            </div>
            <Shield size={28} />
          </div>
        </footer>
      </div>
    </div>
  );
}
