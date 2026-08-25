import React, { useState, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════════
// COHORT — Application Page
// URL: /cohort
//
// Sells the semi-private cohort program and captures applications.
// POSTs to /api/lead-capture with tool: "cohort-waitlist".
//
// Server must apply: Cohort: Waitlist (46), Source: Website (8),
// Entry: Lead Magnet (42), tier tag, and write Revenue Range +
// Business Constraint fields. Do NOT apply Website Lead.
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
  </svg>
);

const CARD = {
  background: "linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.03))",
  backdropFilter: "blur(16px)",
  border: `1px solid ${C.border2}`,
  borderTop: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 14,
  boxShadow: `0 2px 4px rgba(0,0,0,0.2), 0 8px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.06), 0 0 40px ${C.gold}08`,
};

const H = ({ children, mob, size }) => (
  <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: size || (mob ? 27 : 36), color: C.text1, letterSpacing: "-0.01em", lineHeight: 1.15, margin: "0 0 14px" }}>
    {children}
  </h2>
);

const Eyebrow = ({ children }) => (
  <div style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: C.text3, fontWeight: 600, marginBottom: 10 }}>
    {children}
  </div>
);

const P = ({ children, mob, style }) => (
  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: mob ? 13 : 14, lineHeight: 1.68, color: C.text2, margin: "0 0 14px", ...style }}>
    {children}
  </p>
);

/* ═══════════════════ CONTENT ═══════════════════ */

const INCLUDED = [
  {
    title: "Biweekly working sessions",
    desc: "Ten owners in the same revenue tier. We work through your actual constraints with accountability from me and from nine people who understand the problem because they're living it.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
  {
    title: "A monthly financials-only session",
    desc: "One session every month is entirely your numbers. Margins, cash flow, revenue quality, where the money is actually going.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
      </svg>
    ),
  },
  {
    title: "Your own metrics dashboard",
    desc: "A personalized business and financial dashboard benchmarked against your industry — not a generic average.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" /><path d="M7 14l4-4 4 4 5-7" /><circle cx="20" cy="7" r="1.3" fill={C.gold} stroke="none" />
      </svg>
    ),
  },
  {
    title: "Tax and wealth workshops",
    desc: "The levers most owners at your level have never had walked through, and how they connect to what the business is doing.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L3 7v6c0 5 3.8 9.4 9 10 5.2-.6 9-5 9-10V7l-9-5z" /><path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
];

const NOT_FOR = [
  "You want someone to hand you a plan and leave.",
  "You aren't willing to share real numbers with the room.",
  "You're looking for tactics rather than a different way of running the business.",
];

const FOR = [
  "You're profitable but you can't explain why the profit isn't higher.",
  "You're the bottleneck and you know it.",
  "Your advisors each do one thing well and nobody is connecting them.",
  "You want a room of owners at your scale, not a mastermind full of people selling courses.",
];

const REVENUE_OPTIONS = [
  "Under $500K",
  "$500K - $1M",
  "$1M - $3M",
  "$3M - $10M",
  "$10M+",
];

const TIMELINE_OPTIONS = [
  "Ready now",
  "Next 90 days",
  "Just exploring",
];

/* ═══════════════════ FORM PRIMITIVES ═══════════════════ */

const Label = ({ children }) => (
  <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: C.text3, fontWeight: 600, marginBottom: 7 }}>
    {children}
  </div>
);

const inputStyle = {
  width: "100%", padding: "13px 15px", borderRadius: 10, background: C.bgElev,
  border: "1px solid rgba(255,255,255,0.10)", color: C.text1, fontSize: 14,
  fontFamily: "'DM Sans', sans-serif", outline: "none", boxSizing: "border-box",
  transition: "border-color 0.2s",
};

const Field = ({ label, children }) => (
  <div style={{ marginBottom: 18 }}>
    <Label>{label}</Label>
    {children}
  </div>
);

const TextInput = (props) => (
  <input {...props} style={inputStyle}
    onFocus={e => e.target.style.borderColor = `${C.gold}50`}
    onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.10)"} />
);

const TextArea = (props) => (
  <textarea {...props} rows={3} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.55 }}
    onFocus={e => e.target.style.borderColor = `${C.gold}50`}
    onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.10)"} />
);

const Choice = ({ options, value, onChange }) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
    {options.map(opt => {
      const active = value === opt;
      return (
        <button key={opt} type="button" onClick={() => onChange(opt)}
          style={{
            padding: "10px 15px", borderRadius: 9, cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif", fontSize: 13,
            background: active ? `${C.gold}14` : C.bgElev,
            border: `1px solid ${active ? `${C.gold}55` : "rgba(255,255,255,0.10)"}`,
            color: active ? C.goldLight : C.text2,
            transition: "all 0.18s ease",
          }}>
          {opt}
        </button>
      );
    })}
  </div>
);

/* ═══════════════════ APPLICATION FORM ═══════════════════ */

const ApplicationForm = ({ mob }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [revenue, setRevenue] = useState("");
  const [constraint, setConstraint] = useState("");
  const [timeline, setTimeline] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [btnHover, setBtnHover] = useState(false);

  const submit = async () => {
    if (!name.trim()) return setError("Please enter your name.");
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("Please enter a valid email address.");
    if (!revenue) return setError("Please select your annual revenue.");
    if (!constraint.trim()) return setError("Tell me what's getting in your way — this is the most useful thing on the form.");
    if (!timeline) return setError("Please select a timeline.");

    setError(""); setSending(true);

    const payload = {
      name: name.trim(),
      email: email.trim(),
      tool: "cohort-waitlist",
      toolName: "Cohort Application",
      revenueRange: revenue,
      businessConstraint: constraint.trim(),
      timeline,
      reason: reason.trim(),
      timestamp: new Date().toISOString(),
    };

    try {
      const res = await fetch("/api/lead-capture", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });
      if (res.ok) { setDone(true); return; }
      throw new Error("API unavailable");
    } catch (err) {
      console.log("[Virtus] Cohort API failed, queuing retry:", err.message || err);
      const retryFn = async (attempt) => {
        if (attempt > 5) { console.log("[Virtus] All retries exhausted."); return; }
        try {
          const r = await fetch("/api/lead-capture", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
          if (r.ok) { console.log("[Virtus] Retry " + attempt + " succeeded"); return; }
          throw new Error("Retry failed");
        } catch (e) { setTimeout(() => retryFn(attempt + 1), 30000 * attempt); }
      };
      setTimeout(() => retryFn(1), 30000);
      setDone(true);
    } finally { setSending(false); }
  };

  if (done) {
    return (
      <div style={{ ...CARD, padding: mob ? "40px 22px" : "52px 40px", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <Shield size={54} />
        </div>
        <H mob={mob} size={mob ? 24 : 29}>Application received</H>
        <P mob={mob} style={{ maxWidth: 440, margin: "0 auto" }}>
          I read every one of these personally. If there's a fit, I'll reach out when the next cohort opens with details on timing and seats. If there isn't, I'll tell you that too — and point you somewhere more useful.
        </P>
      </div>
    );
  }

  return (
    <div style={{ ...CARD, padding: mob ? "28px 20px" : "40px 36px" }}>
      <Field label="Your name">
        <TextInput type="text" placeholder="Full name" value={name}
          onChange={e => { setName(e.target.value); setError(""); }} />
      </Field>

      <Field label="Email">
        <TextInput type="email" placeholder="you@company.com" value={email}
          onChange={e => { setEmail(e.target.value); setError(""); }} />
      </Field>

      <Field label="Annual revenue">
        <Choice options={REVENUE_OPTIONS} value={revenue}
          onChange={v => { setRevenue(v); setError(""); }} />
      </Field>

      <Field label="What's the main thing getting in your way right now?">
        <TextArea placeholder="Be specific. This is what I use to build the cohorts."
          value={constraint} onChange={e => { setConstraint(e.target.value); setError(""); }} />
      </Field>

      <Field label="When are you looking to start?">
        <Choice options={TIMELINE_OPTIONS} value={timeline}
          onChange={v => { setTimeline(v); setError(""); }} />
      </Field>

      <Field label="What made you interested? (optional)">
        <TextArea placeholder="An email, a video, something a friend said — whatever brought you here."
          value={reason} onChange={e => setReason(e.target.value)} />
      </Field>

      {error && (
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, color: C.red, margin: "0 0 14px" }}>{error}</p>
      )}

      <button type="button" onClick={submit} disabled={sending}
        onMouseEnter={() => setBtnHover(true)} onMouseLeave={() => setBtnHover(false)}
        style={{
          width: "100%", padding: "15px 20px", borderRadius: 12,
          cursor: sending ? "default" : "pointer",
          border: `1.5px solid ${sending ? C.border2 : (btnHover ? C.gold : `${C.gold}80`)}`,
          background: sending
            ? "transparent"
            : (btnHover ? `linear-gradient(135deg, ${C.gold}26, ${C.gold}12)` : `linear-gradient(135deg, ${C.gold}18, ${C.gold}08)`),
          color: sending ? C.text4 : C.gold,
          fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700,
          letterSpacing: "0.02em",
          boxShadow: !sending && btnHover ? `0 0 24px ${C.gold}28` : "none",
          transform: !sending && btnHover ? "translateY(-1px)" : "none",
          transition: "all 0.3s ease",
        }}>
        {sending ? "Sending…" : "Apply for a seat"}
      </button>

      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11.5, color: C.text3, textAlign: "center", margin: "14px 0 0" }}>
        Applying doesn't commit you to anything.
      </p>
    </div>
  );
};

/* ═══════════════════ PAGE ═══════════════════ */

export default function Cohort() {
  const { mob } = useBp();
  const SectionGap = mob ? 48 : 72;

  return (
    <div style={{ minHeight: "100vh", background: C.bgDeep, fontFamily: "'DM Sans', sans-serif", color: C.text1, position: "relative", overflow: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Background atmosphere */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, background: `radial-gradient(ellipse 80% 60% at 25% 85%, #221a08 0%, transparent 55%), radial-gradient(ellipse 60% 50% at 75% 15%, #151a30 0%, transparent 55%), radial-gradient(ellipse 70% 50% at 50% 50%, rgba(200,162,78,0.04) 0%, transparent 60%), linear-gradient(155deg, #070a10 0%, #0c1018 25%, #151208 50%, #0e1220 75%, #090d14 100%)` }} />
      <Grain />

      {/* Caustic light streaks */}
      <div style={{ position: "fixed", top: "15%", left: "5%", width: 500, height: 6, background: `linear-gradient(90deg, transparent, ${C.gold} 50%, transparent)`, filter: "blur(20px)", opacity: 0.08, transform: "rotate(-10deg)", pointerEvents: "none", zIndex: 1 }} />
      <div style={{ position: "fixed", top: "55%", right: "0%", width: 400, height: 6, background: `linear-gradient(90deg, transparent, ${C.gold} 50%, transparent)`, filter: "blur(16px)", opacity: 0.06, transform: "rotate(8deg)", pointerEvents: "none", zIndex: 1 }} />

      <div style={{ position: "relative", zIndex: 10, maxWidth: 800, margin: "0 auto", padding: mob ? "25px 20px 60px" : "25px 40px 80px" }}>

        {/* ─── NAV HEADER ─────────────────────────── */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: mob ? 44 : 60 }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: mob ? 8 : 12, textDecoration: "none" }}>
            <div style={{ width: mob ? 34 : 40, height: mob ? 34 : 40, borderRadius: mob ? 8 : 10, background: "rgba(200,162,78,0.06)", border: "1px solid rgba(200,162,78,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <KVShield size={mob ? 18 : 22} glow />
            </div>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: mob ? 15 : 19, color: C.text1, letterSpacing: 1.2, textTransform: "uppercase" }}>
              KRICZKY VIRTUS
            </span>
          </a>
        </div>

        {/* ─── HERO ───────────────────────────────── */}
        <div style={{ textAlign: "center", marginBottom: SectionGap }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 100, background: "rgba(200,162,78,0.08)", border: "1px solid rgba(200,162,78,0.20)", marginBottom: 20 }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: mob ? 10 : 12, fontWeight: 600, color: C.gold, letterSpacing: 0.3 }}>The Virtus Collective — Cohort Program</span>
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: mob ? 34 : 52, color: C.text1, letterSpacing: "-0.02em", lineHeight: 1.08, margin: "0 0 20px" }}>
            Nine other owners<br /><span style={{ color: C.gold, fontStyle: "italic" }}>who get it.</span>
          </h1>
          <P mob={mob} style={{ fontSize: mob ? 14 : 16, maxWidth: 620, margin: "0 auto 14px" }}>
            You're making six-figure decisions with nobody looking at the whole picture. Your CPA sees last year. Your advisor sees a portfolio that's a fraction of your net worth. Your friends with W-2 jobs can't help, and your competitors aren't opening their books.
          </P>
          <P mob={mob} style={{ fontSize: mob ? 14 : 16, color: C.text1, maxWidth: 620, margin: "0 auto" }}>
            This is a room for that conversation.
          </P>
        </div>

        {/* ─── WHAT IT IS ─────────────────────────── */}
        <div style={{ marginBottom: SectionGap }}>
          <Eyebrow>What it is</Eyebrow>
          <H mob={mob}>An outsourced finance team, <span style={{ color: C.gold, fontStyle: "italic" }}>in a room</span></H>
          <P mob={mob}>
            Ten owners. All in the same revenue tier, so the problems are comparable and the advice actually transfers. We meet biweekly and work through what's constraining your business — with accountability from me and from nine people who understand it because they're living the same thing.
          </P>
          <P mob={mob} style={{ marginBottom: 0, color: C.text1 }}>
            It costs less than a part-time bookkeeper.
          </P>
        </div>

        {/* ─── WHAT'S INCLUDED ────────────────────── */}
        <div style={{ marginBottom: SectionGap }}>
          <Eyebrow>What's included</Eyebrow>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 18 }}>
            {INCLUDED.map((item, i) => (
              <div key={i} style={{ ...CARD, padding: mob ? "18px 20px" : "22px 26px", display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", flexShrink: 0, background: `${C.gold}08`, border: `1.5px solid ${C.gold}30`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 12px ${C.gold}15` }}>
                  {item.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: mob ? 17 : 19, fontWeight: 500, color: C.text1, marginBottom: 5, lineHeight: 1.25 }}>
                    {item.title}
                  </div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: mob ? 12 : 13, lineHeight: 1.6, color: C.text2, margin: 0 }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── FIT ────────────────────────────────── */}
        <div style={{ marginBottom: SectionGap, display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: 14 }}>
          <div style={{ ...CARD, padding: mob ? "22px 20px" : "26px 26px" }}>
            <div style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: C.gold, fontWeight: 600, marginBottom: 14 }}>
              This is for you if
            </div>
            {FOR.map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: i === FOR.length - 1 ? 0 : 11 }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.gold, marginTop: 7, flexShrink: 0 }} />
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, lineHeight: 1.6, color: C.text2, margin: 0 }}>{t}</p>
              </div>
            ))}
          </div>

          <div style={{ ...CARD, padding: mob ? "22px 20px" : "26px 26px", boxShadow: "0 2px 4px rgba(0,0,0,0.2), 0 8px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.06)" }}>
            <div style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: C.text3, fontWeight: 600, marginBottom: 14 }}>
              It isn't if
            </div>
            {NOT_FOR.map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: i === NOT_FOR.length - 1 ? 0 : 11 }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.text4, marginTop: 7, flexShrink: 0 }} />
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, lineHeight: 1.6, color: C.text3, margin: 0 }}>{t}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ─── PRICING ────────────────────────────── */}
        <div style={{ marginBottom: SectionGap }}>
          <div style={{ ...CARD, padding: mob ? "30px 22px" : "40px 34px", textAlign: "center", border: `1px solid ${C.gold}30`, background: `linear-gradient(135deg, ${C.gold}0A, ${C.gold}04)`, boxShadow: `0 2px 4px rgba(0,0,0,0.2), 0 8px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.06), 0 0 60px ${C.gold}10` }}>
            <Eyebrow>Founding members</Eyebrow>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 8, marginBottom: 12 }}>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: mob ? 46 : 60, fontWeight: 600, color: C.gold, lineHeight: 1 }}>$797</span>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: C.text2 }}>/month</span>
            </div>
            <P mob={mob} style={{ maxWidth: 480, margin: "0 auto 6px", color: C.text1 }}>
              Locked for as long as you stay.
            </P>
            <P mob={mob} style={{ maxWidth: 480, margin: "0 auto", fontSize: 13 }}>
              That price holds for the first twenty paying members, then it goes up. Cohorts open in waves and each one caps at ten.
            </P>
          </div>
        </div>

        {/* ─── APPLICATION ────────────────────────── */}
        <div id="apply" style={{ marginBottom: SectionGap }}>
          <Eyebrow>Apply</Eyebrow>
          <H mob={mob}>Tell me <span style={{ color: C.gold, fontStyle: "italic" }}>where you are</span></H>
          <P mob={mob} style={{ maxWidth: 600, marginBottom: 24 }}>
            I use these answers to build cohorts that actually fit together — same scale, comparable problems. It takes about two minutes.
          </P>
          <ApplicationForm mob={mob} />
        </div>

        {/* ─── EDWARD ─────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: SectionGap }}>
          <img src={HEADSHOT} alt="Edward Kriczky"
            style={{ width: 120, height: 120, borderRadius: "50%", objectFit: "cover", border: `3px solid ${C.gold}50`, marginBottom: -28, boxShadow: `0 0 24px ${C.gold}20, 0 4px 16px rgba(0,0,0,0.4)`, position: "relative", zIndex: 2 }} />
          <div style={{ width: "100%", padding: mob ? "44px 20px 22px" : "44px 28px 24px", background: `linear-gradient(135deg, ${C.gold}08, ${C.gold}03)`, border: `1px solid ${C.gold}25`, borderRadius: 14, textAlign: "center" }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.text1 }}>Edward Kriczky, CEPA®</div>
            <div style={{ fontSize: 11, color: C.gold, marginBottom: 10 }}>Founder, Kriczky Virtus</div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, lineHeight: 1.65, color: C.text2, margin: 0, maxWidth: 560, marginLeft: "auto", marginRight: "auto" }}>
              I work with owners in the $1M–$10M range on the thing nobody else owns: making sure the business plan, the tax plan, and the personal plan are actually one plan. As a Certified Exit Planning Advisor, I bring a structured methodology to the question every owner eventually asks — <span style={{ fontStyle: "italic", color: C.text1 }}>"why isn't this making me more money, and what would it take to change that?"</span>
            </p>
          </div>
        </div>

        {/* ─── CONSENT ────────────────────────────── */}
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, lineHeight: 1.6, color: C.text2, textAlign: "center", maxWidth: 600, margin: "0 auto", marginBottom: mob ? 32 : 40 }}>
          By providing your information you consent to Kriczky Virtus, LLC contacting you by phone, text, or email using automated telephone dialing systems and AI to the information provided, even if the phone number is present on a state or national Do Not Call List. We do not sell your personal information. By providing this information you agree to our Privacy Policy and Terms of Service.
        </p>

        {/* ─── FOOTER ─────────────────────────────── */}
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
