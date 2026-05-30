import React, { useState, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════════
// BOOK INTENSIVE — Booking Page
// URL: /book-intensive
//
// Purpose: Landing page for the "Book Your Intensive" CTA from the
// Pricing section. Embeds the iClosed scheduler inline.
// ═══════════════════════════════════════════════════════════════════

const C = {
  gold: "#C8A24E", goldMuted: "#A68A42", goldLight: "#D4B665",
  green: "#34D399", red: "#F87171", amber: "#FBBF24",
  blue: "#60A5FA", cyan: "#22D3EE",
  bgDeep: "#0A0E14", bgCard: "#111720", bgElev: "#1A2130",
  text1: "#E8ECF1", text2: "#8B95A5", text3: "#5A6474", text4: "#3D4654",
  border1: "rgba(255,255,255,0.06)", border2: "rgba(255,255,255,0.10)",
};

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const HEADSHOT = "data:image/jpeg;base64,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";

const useBp = () => {
  const [bp, setBp] = useState("desktop");
  useEffect(() => {
    const check = () => { const w = window.innerWidth; setBp(w < 768 ? "mobile" : w < 1024 ? "tablet" : "desktop"); };
    check(); window.addEventListener("resize", check); return () => window.removeEventListener("resize", check);
  }, []);
  return { mob: bp === "mobile", tab: bp === "tablet" };
};

const Grain = () => (
  <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1, opacity: 0.07, mixBlendMode: "overlay", backgroundImage: GRAIN, backgroundSize: "128px 128px" }} />
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
    <path d="M25 32L29.5 36.5L40 26" stroke={C.gold} strokeWidth="3"
      strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function BookIntensive() {
  const { mob } = useBp();

  useEffect(() => {
    const s = document.createElement("style");
    s.id = "hide-sb-bi";
    s.textContent = "::-webkit-scrollbar{display:none!important}html,body{scrollbar-width:none!important;-ms-overflow-style:none!important;}";
    document.head.appendChild(s);
    return () => { const el = document.getElementById("hide-sb-bi"); if (el) el.remove(); };
  }, []);

  const INTENSIVE_ITEMS = [
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
        </svg>
      ),
      title: "Business Valuation Estimate",
      desc: "Your current value baseline through the eyes of a third-party buyer, based on the premier data provider for M&A transactions in the US — even if you never plan to sell.",
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3v18h18" /><path d="M7 14l4-4 4 4 5-7" /><circle cx="20" cy="7" r="1.3" fill={C.green} stroke="none" />
        </svg>
      ),
      title: "5 Key Value Drivers scored and benchmarked",
      desc: "Scored against industry peers to show exactly where risks and opportunities live in your business.",
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><path d="M8 12h8M12 8v8" />
        </svg>
      ),
      title: "Profit Gap + Value Gap analysis",
      desc: "The dollar amount you're leaving on the table each year and the difference between your business's value vs an above-average peer in your industry, with a clear path to close it.",
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="18" r="3" /><circle cx="18" cy="6" r="3" /><circle cx="6" cy="12" r="3" /><path d="M8.59 13.51l6.83 3.98M15.41 7.49l-6.82 3.02" />
        </svg>
      ),
      title: "Scenario modeling",
      desc: "What happens to your valuation if you close the Profit Gap and Value Gap simultaneously — that is your cash flow and net-worth opportunity.",
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill={C.green} fillOpacity="0.15" />
        </svg>
      ),
      title: "Dollar-ranked value acceleration plan + 90-day action plan",
      desc: "Specific actions prioritized by impact with three moves you can start executing immediately, plus a 30-day follow-up check-in to revisit progress and adjust.",
    },
  ];

  return (
    <div style={{ background: C.bgDeep, minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", color: C.text1, position: "relative", overflow: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`::-webkit-scrollbar { display: none; } html, body { scrollbar-width: none; -ms-overflow-style: none; }`}</style>

      {/* Background atmosphere */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, background: `radial-gradient(ellipse 80% 60% at 25% 85%, #221a08 0%, transparent 55%), radial-gradient(ellipse 60% 50% at 75% 15%, #151a30 0%, transparent 55%), radial-gradient(ellipse 70% 50% at 50% 50%, rgba(200,162,78,0.04) 0%, transparent 60%), linear-gradient(155deg, #070a10 0%, #0c1018 25%, #151208 50%, #0e1220 75%, #090d14 100%)` }} />
      <Grain />

      {/* Caustic light streaks */}
      <div style={{ position: "fixed", top: "15%", left: "5%", width: 500, height: 6, background: `linear-gradient(90deg, transparent, ${C.gold} 50%, transparent)`, filter: "blur(20px)", opacity: 0.08, transform: "rotate(-10deg)", pointerEvents: "none", zIndex: 1 }} />
      <div style={{ position: "fixed", top: "55%", right: "0%", width: 400, height: 6, background: `linear-gradient(90deg, transparent, ${C.gold} 50%, transparent)`, filter: "blur(16px)", opacity: 0.06, transform: "rotate(8deg)", pointerEvents: "none", zIndex: 1 }} />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 10, maxWidth: 900, margin: "0 auto", padding: mob ? "25px 20px 60px" : "25px 40px 80px" }}>

        {/* ─── NAV HEADER ──────────────────────────────── */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: mob ? 48 : 64 }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: mob ? 8 : 12, textDecoration: "none" }}>
            <div style={{ width: mob ? 34 : 40, height: mob ? 34 : 40, borderRadius: mob ? 8 : 10, background: "rgba(200,162,78,0.06)", border: "1px solid rgba(200,162,78,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <KVShield size={mob ? 18 : 22} glow />
            </div>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: mob ? 15 : 19, color: C.text1, letterSpacing: 1.2, textTransform: "uppercase" }}>
              KRICZKY VIRTUS
            </span>
          </a>
        </div>

        {/* ─── HERO ─────────────────────────────────────── */}
        <div style={{ textAlign: "center", marginBottom: mob ? 40 : 56 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 100, background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.20)", marginBottom: 20 }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: mob ? 11 : 12, fontWeight: 600, color: C.green, letterSpacing: 0.3 }}>Free Fit Call · See If the Intensive Makes Sense for Your Business</span>
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: mob ? 32 : 46, lineHeight: 1.1, letterSpacing: "-0.02em", color: C.text1, margin: "0 0 18px" }}>
            How Much Money Are You<br /><span style={{ color: C.green, fontStyle: "italic" }}>Leaving on the Table</span>?
          </h1>
          <p style={{ fontSize: mob ? 14 : 16, lineHeight: 1.65, color: C.text2, maxWidth: 720, margin: "0 auto 24px", fontWeight: 400 }}>
            Worst case: we show that your business is as efficient as it could be right now and we give you a full refund. Best case: we identify <span style={{ color: C.gold, fontWeight: 600 }}>over $100K in actionable opportunities</span> you can start working on immediately, prioritized by ROI potential.
          </p>
          {/* Guarantee callout */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 12, background: `${C.green}08`, border: `1px solid ${C.green}25` }}>
            <Shield size={20} />
            <span style={{ fontSize: 12, fontWeight: 600, color: C.green, letterSpacing: 0.2 }}>Valuation Opportunity Guarantee — if we don't find $100K+, you pay nothing.</span>
          </div>
        </div>

        {/* ─── SCHEDULER SECTION ───────────────────────── */}
        <div style={{ marginBottom: mob ? 40 : 56 }}>
          <div style={{ minHeight: 500, padding: mob ? "20px 16px" : "28px 32px", background: "linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015) 50%, rgba(255,255,255,0.025))", border: `1px solid ${C.border2}`, borderTop: "1px solid rgba(255,255,255,0.10)", borderRadius: 18, boxShadow: `0 4px 12px rgba(0,0,0,0.3), 0 16px 48px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.06), 0 0 60px ${C.green}0a` }}>
            <iframe
              src="https://app.iclosed.io/e/kriczkyvirtus/valuation-driver-intensive-fit-call"
              title="Valuation Driver Intensive - Fit Call"
              style={{ width: "100%", height: 620, border: "none", borderRadius: 12, background: "transparent" }}
              allow="payment"
            />
          </div>
        </div>

        {/* ─── WHAT'S INCLUDED ─────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: mob ? 40 : 56 }}>
          <div style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: C.text3, fontWeight: 600, textAlign: "center", marginBottom: 4 }}>
            What's included in the Intensive
          </div>
          {INTENSIVE_ITEMS.map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start", padding: mob ? "16px 18px" : "18px 24px", background: "linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.03))", backdropFilter: "blur(16px)", border: `1px solid ${C.border2}`, borderTop: "1px solid rgba(255,255,255,0.12)", borderRadius: 14, boxShadow: `0 2px 4px rgba(0,0,0,0.2), 0 8px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.06), 0 0 40px ${C.green}08` }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", flexShrink: 0, background: `${C.green}08`, border: `1.5px solid ${C.green}30`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 12px ${C.green}15` }}>
                {item.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: mob ? 16 : 18, fontWeight: 500, color: C.text1, marginBottom: 4, lineHeight: 1.25 }}>{item.title}</div>
                <p style={{ fontSize: mob ? 12 : 13, lineHeight: 1.6, color: C.text2, margin: 0 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ─── EDWARD SECTION ──────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: mob ? 40 : 56 }}>
          <img src={HEADSHOT} alt="Edward Kriczky"
            style={{ width: 120, height: 120, borderRadius: "50%", objectFit: "cover", border: `3px solid ${C.gold}50`, marginBottom: -28, boxShadow: `0 0 24px ${C.gold}20, 0 4px 16px rgba(0,0,0,0.4)`, position: "relative", zIndex: 2 }}
          />
          <div style={{ width: "100%", padding: mob ? "44px 20px 22px" : "44px 28px 24px", background: `linear-gradient(135deg, ${C.gold}08, ${C.gold}03)`, border: `1px solid ${C.gold}25`, borderRadius: 14, textAlign: "center" }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.text1 }}>Edward Kriczky, CEPA</div>
            <div style={{ fontSize: 11, color: C.gold, marginBottom: 10 }}>Founder, Kriczky Virtus</div>
            <p style={{ fontSize: 13, lineHeight: 1.65, color: C.text2, margin: 0, maxWidth: 560, marginLeft: "auto", marginRight: "auto" }}>
              I help business owners in the $1M–$10M range turn their businesses into assets that generate wealth — whether they're building to sell, building to keep, or building to hand down. As a Certified Exit Planning Advisor, I bring a structured methodology to the question every owner eventually asks: <span style={{ fontStyle: "italic", color: C.text1 }}>"What is my business actually worth, and what would it take to make it worth more?"</span>
            </p>
          </div>
        </div>

        {/* ─── CONSENT TEXT ─────────────────────────────── */}
        <p style={{ fontSize: 11, lineHeight: 1.6, color: C.text2, textAlign: "center", maxWidth: 600, margin: "0 auto", marginBottom: mob ? 32 : 40 }}>
          By providing your information you consent to Kriczky Virtus, LLC contacting you by phone, text, or email using automated telephone dialing systems and AI to the information provided, even if the phone number is present on a state or national Do Not Call List. We do not sell your personal information. By providing this information you agree to our Privacy Policy and Terms of Service.
        </p>

        {/* ─── FOOTER ──────────────────────────────────── */}
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
      </div>
    </div>
  );
}
