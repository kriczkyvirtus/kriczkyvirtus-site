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

// ═══ PASTE HEADSHOT BASE64 HERE ═══
// Extract with:
// grep -o 'data:image/jpeg;base64,[A-Za-z0-9+/=]*' legacy-roadmap-full-v2.html | head -1
const HEADSHOT = "HEADSHOT_PLACEHOLDER";

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

const Shield = ({ size = 28, glow = false }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none"
    style={glow ? { filter: `drop-shadow(0 0 12px ${C.gold}60) drop-shadow(0 0 4px ${C.gold}90)` } : {}}>
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
  <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: size || (mob ? 26 : 34), color: C.text1, textTransform: "uppercase", letterSpacing: "0.02em", lineHeight: 1.12, margin: "0 0 14px" }}>
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

const Ico = ({ name, size = 21 }) => {
  const paths = {
    people: <><circle cx="9" cy="9" r="3.2" /><circle cx="17" cy="10" r="2.4" /><path d="M3.5 20c0-3.2 2.5-5.2 5.5-5.2s5.5 2 5.5 5.2" /><path d="M16 15.2c2.4 0 4.5 1.6 4.5 4.3" /></>,
    calendar: <><rect x="3.5" y="5.5" width="17" height="15" rx="2.5" /><path d="M8 3.5v4M16 3.5v4M3.5 10.5h17" /><path d="M8.5 14.5h3M8.5 17.5h7" /></>,
    bars: <><path d="M4 20V4" /><path d="M4 20h16" /><path d="M8.5 20v-5M13 20v-9M17.5 20v-13" /></>,
    call: <><path d="M20.5 12.5c0 3.9-3.8 7-8.5 7a10 10 0 0 1-2.6-.33L4 20.5l1.4-3.6A6.6 6.6 0 0 1 3.5 12.5c0-3.9 3.8-7 8.5-7s8.5 3.1 8.5 7Z" /><path d="M9 12h.01M12 12h.01M15 12h.01" /></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={C.gold}
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none" }}>
      {paths[name]}
    </svg>
  );
};

const Mark = ({ kind }) => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none"
    stroke={kind === "yes" ? C.green : C.red} strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0, marginTop: 3 }}>
    {kind === "yes"
      ? <path d="M3 8.5L6.3 11.8L13 5" />
      : <><path d="M4 4l8 8" /><path d="M12 4l-8 8" /></>}
  </svg>
);

const INCLUDED = [
  { icon: "people", title: "Biweekly working sessions", desc: "Ten owners in the same revenue tier — the weekly community call is open to every member, this is the small room. We work through your actual constraints with accountability from Kriczky Virtus and from nine people who understand the problem because they're living it." },
  { icon: "calendar", title: "Quarterly Tax and Business Reinvestment Workshops", desc: "The levers most owners at your level have never had walked through, and how they connect to what the business is doing. Educational, and coordinated with your CPA — not tax advice." },
];

const VIP_INCLUDED = [
  { icon: "bars", title: "Your own business metrics dashboard", desc: "KPIs and what-if scenarios built on your numbers. What happens to margin and cash if you hire two more, open the second location, or lose your largest account — before you commit to any of it." },
  { icon: "call", title: "One 90-minute business 1-on-1 per month", desc: "Time with the Kriczky Virtus team on your business operations and decision-making. Use it when you need it within the month; it does not roll over." },
];

const NOT_FOR = [
  "You want someone to hand you a plan and leave.",
  "You aren't willing to share real numbers with the room.",
  "You are content with your business staying where it is today.",
];

const FOR = [
  "You're profitable but you can't explain why the profit isn't higher.",
  "You're the bottleneck and you know it.",
  "Your advisors each do one thing well but nobody is connecting them, so you know growth and money are leaking out the bottom.",
  "You want a room of owners at your scale, not a mastermind full of people selling courses.",
];

const REVENUE_OPTIONS = [
  "Under $500K",
  "$500K - $1M",
  "$1M - $3M",
  "$3M - $10M",
  "$10M+",
];

const OWNERSHIP_OPTIONS = [
  "I'm the sole owner",
  "I own at least 51%",
  "I own 20%-50%",
  "I own less than 20%",
  "I'm not an owner but I'm on the leadership team",
  "I'm not a business owner",
];

const TIER_OPTIONS = [
  "Premium - $797/mo",
  "VIP - $1,997/mo",
  "Either - help me choose",
  "Not sure yet",
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
  width: "100%", padding: "13px 15px", borderRadius: 10, background: "#0F141C",
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

const CHEVRON = "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%235A6474' stroke-width='1.6' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E";

const Select = ({ options, value, onChange, placeholder = "Select one" }) => (
  <select value={value} onChange={e => onChange(e.target.value)}
    style={{
      ...inputStyle,
      appearance: "none", WebkitAppearance: "none", MozAppearance: "none",
      paddingRight: 40, cursor: "pointer",
      color: value ? C.text1 : C.text3,
      backgroundImage: `url("${CHEVRON}")`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right 15px center",
    }}>
    <option value="" disabled style={{ background: "#0F141C", color: C.text3 }}>{placeholder}</option>
    {options.map(opt => (
      <option key={opt} value={opt} style={{ background: "#0F141C", color: C.text1 }}>{opt}</option>
    ))}
  </select>
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
            background: active ? `${C.gold}14` : "#0F141C",
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
  const [ownership, setOwnership] = useState("");
  const [tier, setTier] = useState("");
  const [timeline, setTimeline] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async () => {
    if (!name.trim()) return setError("Please enter your name.");
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("Please enter a valid email address.");
    if (!revenue) return setError("Please select your annual revenue.");
    if (!ownership) return setError("Please tell me how ownership is structured.");
    if (!constraint.trim()) return setError("Tell me what's getting in your way — this is the most useful thing on the form.");
    if (!tier) return setError("Please select which tier you're interested in.");
    if (!timeline) return setError("Please select a timeline.");

    setError(""); setSending(true);

    const payload = {
      name: name.trim(),
      email: email.trim(),
      tool: "cohort-waitlist",
      toolName: "Cohort Application",
      revenueRange: revenue,
      ownership,
      tierInterest: tier,
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
      <div style={{ ...CARD, padding: mob ? "36px 22px" : "48px 40px", textAlign: "center" }}>
        <div style={{ margin: "0 auto 18px", width: 54, height: 54 }}><Shield size={54} glow /></div>
        <H mob={mob} size={mob ? 24 : 28}>Application received</H>
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
        <Select options={REVENUE_OPTIONS} value={revenue}
          onChange={v => { setRevenue(v); setError(""); }} />
        {revenue === "$10M+" && (
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, lineHeight: 1.6, color: C.text3, margin: "9px 0 0" }}>
            Cohorts run up to $10M. Above that is a different conversation &mdash; apply anyway and I&rsquo;ll point you to the right one.
          </p>
        )}
      </Field>

      <Field label="Are you the owner, or do you have partners?">
        <Select options={OWNERSHIP_OPTIONS} value={ownership}
          onChange={v => { setOwnership(v); setError(""); }} />
        {(ownership === "I own less than 20%" || ownership === "I'm not an owner but I'm on the leadership team" || ownership === "I'm not a business owner") && (
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, lineHeight: 1.6, color: C.text3, margin: "9px 0 0" }}>
            Cohorts are built for owners who can act on the decisions we work through. Apply anyway &mdash; if there is a fit, I&rsquo;ll tell you, and if there isn&rsquo;t I&rsquo;ll point you somewhere more useful.
          </p>
        )}
      </Field>

      <Field label="What's the main thing getting in your way right now?">
        <TextArea placeholder="Be specific. This is what I use to build the cohorts."
          value={constraint} onChange={e => { setConstraint(e.target.value); setError(""); }} />
      </Field>

      <Field label="Which tier are you interested in?">
        <Select options={TIER_OPTIONS} value={tier}
          onChange={v => { setTier(v); setError(""); }} />
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, lineHeight: 1.6, color: C.text3, margin: "9px 0 0" }}>
          This is an application, not a checkout. Nothing is charged here, no card is collected, and you can change tiers before you join.
        </p>
      </Field>

      <Field label="When are you looking to start?">
        <Select options={TIMELINE_OPTIONS} value={timeline}
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
        style={{
          width: "100%", padding: "16px 20px", borderRadius: 11, border: "none",
          cursor: sending ? "default" : "pointer",
          background: sending ? `${C.gold}40` : `linear-gradient(135deg, ${C.gold}, ${C.goldMuted})`,
          color: "#0A0E14", fontFamily: "'DM Sans', sans-serif", fontSize: 14.5, fontWeight: 700,
          letterSpacing: "0.03em", boxShadow: `0 4px 20px ${C.gold}25`, transition: "all 0.2s ease",
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

  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "viewport";
    meta.content = "width=device-width, initial-scale=1, viewport-fit=cover";
    document.head.appendChild(meta);
    return () => { if (meta.parentNode) meta.parentNode.removeChild(meta); };
  }, []);

  const SectionGap = mob ? 44 : 68;

  return (
    <div style={{ minHeight: "100vh", background: C.bgDeep, fontFamily: "'DM Sans', sans-serif", color: C.text1, position: "relative", overflowX: "hidden" }}>
      <Grain />

      <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "min(900px, 100%)", height: 480, background: `radial-gradient(ellipse 60% 100% at 50% 0%, ${C.gold}0E, transparent 70%)`, pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 2, maxWidth: 780, margin: "0 auto", padding: mob ? "40px 20px 56px" : "68px 32px 80px" }}>

        {/* ─── HEADER ─────────────────────────────── */}
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: mob ? 34 : 48 }}>
          <Shield size={22} />
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 13, letterSpacing: "0.14em", textTransform: "uppercase", color: C.text2 }}>
            Kriczky Virtus
          </span>
        </div>

        {/* ─── HERO ───────────────────────────────── */}
        <div style={{ marginBottom: SectionGap }}>
          <Eyebrow>The Virtus Collective — Cohorts</Eyebrow>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: mob ? "clamp(24px, 9.2vw, 34px)" : 52, color: C.text1, textTransform: "uppercase", letterSpacing: "0.01em", lineHeight: 1.05, margin: "0 0 20px" }}>
            Nine other owners at your{mob ? <br /> : " "}
            <span style={{ whiteSpace: mob ? "nowrap" : "normal" }}>stage{mob ? " " : <br />}<span style={{ color: C.gold }}>who get it.</span></span>
          </h1>
          <P mob={mob} style={{ fontSize: mob ? 15 : 17, color: C.text2, maxWidth: 620 }}>
            You're making six-figure decisions with nobody looking at the whole picture. Your CPA sees last year. Your advisor sees a portfolio that's a fraction of your net worth. Your friends with W-2 jobs can't help, and your competitors aren't opening their books.
          </P>
          <P mob={mob} style={{ fontSize: mob ? 15 : 17, color: C.text1, maxWidth: 620, marginBottom: 0 }}>
            This is a room for that conversation.
          </P>
        </div>

        {/* ─── WHAT IT IS ─────────────────────────── */}
        <div style={{ marginBottom: SectionGap }}>
          <Eyebrow>What it is</Eyebrow>
          <H mob={mob}>Ten owners at your scale, in the same room</H>
          <P mob={mob}>
            Ten owners. All in the same revenue tier, so the problems are comparable and the advice actually transfers. We meet biweekly and work through what's constraining your business — with accountability from Kriczky Virtus and from nine people who understand it because they're living the same thing.
          </P>
          <P mob={mob} style={{ marginBottom: 0 }}>
            It costs less than a part-time bookkeeper.
          </P>
        </div>

        {/* ─── WHAT'S INCLUDED ────────────────────── */}
        <div style={{ marginBottom: SectionGap }}>
          <Eyebrow>What's included</Eyebrow>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 18 }}>
            {INCLUDED.map((item, i) => (
              <div key={i} style={{ ...CARD, padding: mob ? "18px 20px" : "22px 26px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <Ico name={item.icon} size={mob ? 19 : 21} />
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: mob ? 17 : 19, fontWeight: 600, color: C.text1, lineHeight: 1.25 }}>
                    {item.title}
                  </div>
                </div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: mob ? 12.5 : 13.5, lineHeight: 1.65, color: C.text2, margin: 0 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ─── FIT ────────────────────────────────── */}
        <div style={{ marginBottom: SectionGap, display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: 14 }}>
          <div style={{ ...CARD, padding: mob ? "20px 20px" : "26px 26px" }}>
            <div style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: C.green, fontWeight: 600, marginBottom: 14 }}>
              This is for you if
            </div>
            {FOR.map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: i === FOR.length - 1 ? 0 : 11 }}>
                <Mark kind="yes" />
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, lineHeight: 1.6, color: C.text2, margin: 0 }}>{t}</p>
              </div>
            ))}
          </div>

          <div style={{ ...CARD, padding: mob ? "20px 20px" : "26px 26px", boxShadow: "0 2px 4px rgba(0,0,0,0.2), 0 8px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.06)" }}>
            <div style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: C.red, fontWeight: 600, marginBottom: 14 }}>
              It isn't if
            </div>
            {NOT_FOR.map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: i === NOT_FOR.length - 1 ? 0 : 11 }}>
                <Mark kind="no" />
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, lineHeight: 1.6, color: C.text3, margin: 0 }}>{t}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ─── PRICING ────────────────────────────── */}
        <div style={{ marginBottom: SectionGap }}>
          <div style={{ display: "flex", flexDirection: mob ? "column" : "row", gap: 14, alignItems: "stretch" }}>

            {/* Premium */}
            <div style={{ ...CARD, flex: 1, padding: mob ? "26px 20px" : "32px 28px", textAlign: "center", border: `1px solid ${C.gold}30`, background: `linear-gradient(135deg, ${C.gold}0A, ${C.gold}04)` }}>
              <Eyebrow>Premium &mdash; founding</Eyebrow>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 7, marginBottom: 10 }}>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: mob ? 42 : 54, fontWeight: 700, color: C.gold, lineHeight: 1 }}>$797</span>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: C.text2 }}>/month</span>
              </div>
              <P mob={mob} style={{ fontSize: 13, marginBottom: 16 }}>
                The cohort room, the quarterly workshops, and everything in the free tier.
              </P>
              <div style={{ borderTop: `1px solid ${C.border1}`, paddingTop: 14, display: "flex", justifyContent: "center", gap: mob ? 12 : 6, flexWrap: "wrap" }}>
                {[["$797", "First 20"], ["$897", "Next 20"], ["$997", "After 40"]].map(([price, label], i) => (
                  <div key={i} style={{ minWidth: 74 }}>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 21, fontWeight: 700, color: i === 0 ? C.gold : C.text2, lineHeight: 1.2 }}>{price}</div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9.5, letterSpacing: "0.14em", textTransform: "uppercase", color: C.text3, marginTop: 4 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* VIP */}
            <div style={{ ...CARD, flex: 1, padding: mob ? "26px 20px" : "32px 28px", textAlign: "center" }}>
              <Eyebrow>VIP &mdash; founding</Eyebrow>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 7, marginBottom: 10 }}>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: mob ? 42 : 54, fontWeight: 700, color: C.text1, lineHeight: 1 }}>$1,997</span>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: C.text2 }}>/month</span>
              </div>
              <P mob={mob} style={{ fontSize: 13, marginBottom: 16 }}>
                Everything in Premium, plus the two things that stop progress resting entirely on you.
              </P>
              <div style={{ borderTop: `1px solid ${C.border1}`, paddingTop: 14, textAlign: "left" }}>
                {VIP_INCLUDED.map((item, i) => (
                  <div key={i} style={{ marginBottom: i === VIP_INCLUDED.length - 1 ? 0 : 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                      <Ico name={item.icon} size={17} />
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, fontWeight: 600, color: C.text1 }}>{item.title}</div>
                    </div>
                    <P mob={mob} style={{ fontSize: 12, marginBottom: 0 }}>{item.desc}</P>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* terms */}
          <div style={{ ...CARD, padding: mob ? "20px 20px" : "26px 30px", marginTop: 14 }}>
            <div style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: C.text3, fontWeight: 600, marginBottom: 12 }}>
              What it is and isn&rsquo;t
            </div>
            <P mob={mob} style={{ fontSize: 12.5, marginBottom: 12 }}>
              Founding pricing on both tiers is locked for as long as your membership stays continuously active. Later members will pay more. Steps are counted by paying members across both tiers and all revenue bands.
            </P>
            <P mob={mob} style={{ fontSize: 12.5, marginBottom: 12 }}>
              Membership is ongoing and monthly. &ldquo;Cohort&rdquo; describes how you come in &mdash; ten owners at a time across both paid tiers, grouped by revenue band &mdash; not a program with an end date.
            </P>
            <P mob={mob} style={{ fontSize: 12.5, marginBottom: 12 }}>
              Sessions are group sessions. The VIP tier adds one 90-minute one-on-one call per month, covering business operations and decision-making. No tier includes personal financial planning or investment recommendations. If you want personal financial advice from Edward Kriczky, that requires a formal client relationship with Kriczky Wealth Management LLC &mdash; a separate engagement under its own agreement.
            </P>
            <P mob={mob} style={{ fontSize: 12.5, marginBottom: 12 }}>
              Billed monthly through Skool and renews automatically. Cancel any time. You keep access through the end of the billing period you have already paid for, and there are no refunds for partial billing periods. Cancelling is not the same as leaving the group &mdash; leaving ends access immediately, so cancel from your Skool subscription settings at least 24 hours before the renewal date. If you cancel and rejoin later, you rejoin at whatever the price is then &mdash; founding pricing does not carry over.
            </P>
            <P mob={mob} style={{ fontSize: 12, color: C.text3, marginBottom: 0 }}>
              Educational content only. Nothing here is individualized investment, tax, or legal advice.
            </P>
          </div>
        </div>

        {/* ─── APPLICATION ────────────────────────── */}
        <div id="apply" style={{ marginBottom: SectionGap }}>
          <Eyebrow>Apply</Eyebrow>
          <H mob={mob}>Tell me where you are</H>
          <P mob={mob} style={{ maxWidth: 600, marginBottom: 24 }}>
            I use these answers to build cohorts that actually fit together — same scale, comparable problems. It takes about two minutes.
          </P>
          <ApplicationForm mob={mob} />
        </div>

        {/* ─── EDWARD ─────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: SectionGap }}>
          <img src={HEADSHOT} alt="Edward Kriczky"
            style={{ width: 110, height: 110, borderRadius: "50%", objectFit: "cover", border: `3px solid ${C.gold}50`, marginBottom: -26, boxShadow: `0 0 24px ${C.gold}20, 0 4px 16px rgba(0,0,0,0.4)`, position: "relative", zIndex: 2 }} />
          <div style={{ width: "100%", padding: mob ? "40px 20px 22px" : "42px 30px 26px", background: `linear-gradient(135deg, ${C.gold}08, ${C.gold}03)`, border: `1px solid ${C.gold}25`, borderRadius: 14, textAlign: "center" }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.text1 }}>Edward Kriczky, CEPA</div>
            <div style={{ fontSize: 11, color: C.gold, marginBottom: 12 }}>Founder, Kriczky Virtus</div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, lineHeight: 1.68, color: C.text2, margin: 0, maxWidth: 560, marginLeft: "auto", marginRight: "auto" }}>
              I work with owners in the $1M–$10M range on the thing nobody else owns: making sure the business plan, the tax plan, and the personal plan are actually one plan. As a Certified Exit Planning Advisor, I bring a structured methodology to the question every owner eventually asks — <span style={{ fontStyle: "italic", color: C.text1 }}>"why isn't this making me more money, and what would it take to change that?"</span>
            </p>
          </div>
        </div>

        {/* ─── CONSENT ────────────────────────────── */}
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, lineHeight: 1.6, color: C.text3, textAlign: "center", maxWidth: 600, margin: "0 auto", marginBottom: mob ? 30 : 40 }}>
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
