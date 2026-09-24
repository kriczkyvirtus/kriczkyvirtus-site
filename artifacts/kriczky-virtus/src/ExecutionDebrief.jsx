
/* Execution Debrief booking page.

   Reader: attended a paid Reinvest or Harvest Workshop, holding the Partnership
   one-pager or scanning the QR from its last page. They have already spent half
   a day with Edward, so this page is short — a calendar with just enough framing
   to say what the conversation is.

   ⚠️ No prefill is possible here. The one-pager is a static handout with no token
   identifying the reader, so the iClosed form starts empty. That is different
   from /reinvest-harvest/next, which has the report token. */

const C = {
  bgDeep: "#0A0E14", bgCard: "#111720", bgElev: "#1A2130",
  gold: "#C8A24E", goldLight: "#D4B665", goldDark: "#8A6C2A", goldMuted: "#A68A42",
  green: "#34D399", greenDark: "#1B8A63",
  cyan: "#22D3EE",
  text1: "#E8ECF1", text2: "#8B95A5", text3: "#5A6474", text4: "#3D4654",
  border1: "rgba(255,255,255,0.06)", border2: "rgba(255,255,255,0.10)",
};

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

/* Confirmed by Edward — the Execution Debrief event, not the working session.
   ⛔ Do not swap this for the working-session URL: that event's Zap applies
   tag 5, which exits people from the RH nurture and miscounts the conversion.
   This one's Zap applies tag 86. */
const ICLOSED_DEBRIEF = "https://app.iclosed.io/e/kriczkyvirtus/execution-debrief";

const Shield = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none"
    style={{ filter: "drop-shadow(0 0 12px rgba(200,162,78,0.38)) drop-shadow(0 0 4px rgba(200,162,78,0.56))" }}>
    <path d="M32 8L14 16V30C14 42 22 52 32 56C42 52 50 42 50 30V16L32 8Z"
      fill="none" stroke={C.gold} strokeWidth="2.5" strokeLinejoin="round" />
    <path d="M32 12L18 18.5V30C18 39.5 24 47.5 32 51C40 47.5 46 39.5 46 30V18.5L32 12Z"
      fill="none" stroke={C.gold} strokeWidth="1" opacity="0.4" strokeLinejoin="round" />
  </svg>
);

export default function ExecutionDebrief() {
  const wrap = { maxWidth: 940, margin: "0 auto", padding: "0 22px" };
  const col = { maxWidth: 720, margin: "0 auto", padding: "0 22px" };
  const KICKER = { fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: ".18em", textTransform: "uppercase", margin: "0 0 14px" };
  const card = {
    padding: "clamp(24px,4vw,36px)", borderRadius: 18,
    background: "linear-gradient(145deg, rgba(255,255,255,.045), rgba(255,255,255,.015))",
    border: `1px solid ${C.border2}`, borderTop: "1px solid rgba(255,255,255,.12)",
    boxShadow: "0 10px 40px rgba(0,0,0,.42)",
  };

  const COVERS = [
    "What your real options are for executing the plan you built.",
    "How you\u2019ll know it\u2019s working week by week, rather than at day 90.",
    "Where this first 90-day sprint fits into the next 24 months of building both the business and your personal wealth.",
  ];

  return (
    <div style={{ background: C.bgDeep, minHeight: "100vh", fontFamily: "'DM Sans',sans-serif", position: "relative", overflowX: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet" />

      <div style={{ position: "fixed", inset: 0, backgroundImage: GRAIN, backgroundSize: "128px 128px", opacity: .05, mixBlendMode: "overlay", pointerEvents: "none", zIndex: 1 }} />
      <div style={{ position: "fixed", top: "-14%", left: "50%", transform: "translateX(-50%)", width: "min(1100px,150vw)", height: 560,
        background: `radial-gradient(ellipse at center, ${C.gold}14 0%, transparent 66%)`, pointerEvents: "none", zIndex: 0 }} />

      <div style={{ position: "relative", zIndex: 2 }}>

        {/* ── NAV ── */}
        <div style={{ ...wrap, paddingTop: 30, paddingBottom: 6, display: "flex", justifyContent: "center", alignItems: "center", gap: 12 }}>
          <Shield size={30} />
          <span style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 21, letterSpacing: ".14em", color: C.text1 }}>
            KRICZKY <span style={{ color: C.goldMuted }}>VIRTUS</span>
          </span>
        </div>

        {/* ── HERO ── */}
        <section style={{ padding: "clamp(22px,4vw,38px) 0 clamp(20px,3vw,30px)", textAlign: "center" }}>
          <div style={wrap}>
            <div style={{ ...KICKER, color: C.gold }}>After the workshop</div>
            <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.015em", color: C.text1, margin: 0,
              fontSize: "clamp(34px,7vw,62px)", maxWidth: 820, marginLeft: "auto", marginRight: "auto", textWrap: "balance" }}>
              Your Execution <span style={{ color: C.gold, fontStyle: "italic", fontWeight: 400 }}>Debrief</span>
            </h1>
            <p style={{ fontSize: "clamp(16px,2.7vw,22px)", lineHeight: 1.5, color: C.text2, maxWidth: 680, margin: "18px auto 0", textWrap: "balance" }}>
              You have your 90-day plan now. This is the hour where we tactically decide what actually gets executed first, and how.
            </p>
          </div>
        </section>

        {/* ── WHAT IT COVERS ── */}
        <section style={{ padding: "0 0 clamp(22px,3.4vw,30px)" }}>
          <div style={col}>
            <div style={card}>
              <div style={{ ...KICKER, color: C.gold, textAlign: "center" }}>Sixty minutes, one to one</div>
              {COVERS.map((t, i) => (
                <div key={t} style={{ display: "flex", gap: 18, alignItems: "flex-start", padding: "15px 0",
                  borderBottom: i < COVERS.length - 1 ? `1px solid ${C.border1}` : "none" }}>
                  <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 700, color: `${C.gold}66`, lineHeight: 1.1, minWidth: 38 }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span style={{ fontSize: "clamp(15px,2.1vw,17px)", lineHeight: 1.6, color: C.text2 }}>{t}</span>
                </div>
              ))}

              {/* The Roadmap is already theirs — this is redemption, not an offer. */}
              <div style={{ marginTop: 24, padding: "20px 20px", borderRadius: 13, background: `${C.green}0d`, border: `1px solid ${C.green}3d` }}>
                <p style={{ fontSize: "clamp(14.5px,2.1vw,16.5px)", lineHeight: 1.6, color: C.text1, margin: 0 }}>
                  Booking this is also how you start the <span style={{ color: C.text3, textDecoration: "line-through" }}>$6,000</span> <strong style={{ color: C.green, fontWeight: 700 }}>Personalized Wealth Roadmap</strong> that came with your ticket.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── CALENDAR ── */}
        <section id="debrief-scheduler" style={{ padding: "0 0 clamp(30px,5vw,46px)", scrollMarginTop: 24 }}>
          <div style={col}>
            <div style={{ ...KICKER, color: C.gold, textAlign: "center" }}>Pick a time</div>
            <p style={{ fontSize: "clamp(14px,2vw,16px)", lineHeight: 1.6, color: C.text3, textAlign: "center", maxWidth: 560, margin: "0 auto 20px" }}>
              Nothing to prepare. Bring the 90-day plan from the workshop.
            </p>
            <div id="debrief-calendar" style={{ borderRadius: 14, overflow: "hidden", border: `1px solid ${C.border2}`, background: C.bgCard, minHeight: 620 }}>
              {/* Direct iframe. ⛔ Do NOT use iClosed widget.js — it races the React render. */}
              <iframe src={ICLOSED_DEBRIEF} title="Book your Execution Debrief" width="100%" height="620"
                style={{ border: "none", display: "block" }} loading="lazy" />
            </div>
          </div>
        </section>

        {/* ── DISCLOSURE ── */}
        <div style={{ ...wrap, paddingTop: 6, paddingBottom: 70 }}>
          <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${C.border1}, transparent)`, marginBottom: 26 }} />
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 9, marginBottom: 16 }}>
            <Shield size={17} />
            <span style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 14, letterSpacing: ".14em", color: C.text3 }}>
              KRICZKY <span style={{ color: C.text4 }}>VIRTUS</span>
            </span>
          </div>
          <p style={{ fontSize: 11.5, lineHeight: 1.65, color: C.text4, textAlign: "center", maxWidth: 780, margin: "0 auto" }}>
            Business advisory services are provided by Kriczky Virtus, LLC. Investment advisory services are provided by Kriczky Wealth Management LLC, an Investment Advisor in the state of Pennsylvania and Virginia. Professionals are registered with Kriczky Wealth Management LLC. Edward Kriczky owns both firms, which is a conflict of interest disclosed in Form ADV. You are never required to engage either firm to work with the other, and you may use any business consultant or investment advisor you choose. Form ADV is provided before any investment advisory agreement is signed. Nothing on this page is individualized financial, tax, legal, or accounting advice, or a recommendation to pursue any particular course of action. No outcome is projected or guaranteed. Coordinate any decision with your CPA, attorney, and other advisors before acting.
          </p>
        </div>
      </div>

      <style>{`
        .cta { transition: all .25s ease; }
        .cta:hover { box-shadow: 0 0 48px ${C.gold}33, 0 8px 22px rgba(0,0,0,.45) !important; border-color: ${C.gold}99 !important; transform: translateY(-1px); }
        @media (prefers-reduced-motion: reduce) {
          .cta:hover { transform: none; }
        }
      `}</style>
    </div>
  );
}
