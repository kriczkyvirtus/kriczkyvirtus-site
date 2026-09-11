import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════════════
   REINVEST OR HARVEST — 20-STEP FLOW
   Route: /reinvest-harvest/start
   Mobile-first. One question per screen.
   ═══════════════════════════════════════════════════════════════ */

/* Selecting an option advances automatically after a short beat.
   Set false for explicit Next buttons (fewer mis-taps, ~2x the taps). */
const AUTO_ADVANCE = true;
const ADVANCE_MS = 340;

const C = {
  bgDeep: "#0A0E14", bgCard: "#111720", bgElev: "#1A2130",
  gold: "#C8A24E", goldLight: "#D4B665",
  green: "#34D399", cyan: "#22D3EE", red: "#F87171", amber: "#FBBF24",
  text1: "#E8ECF1", text2: "#8B95A5", text3: "#5A6474", text4: "#3D4654",
};

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const PILLAR_MAX = 30;
const THRESHOLD = 18;

/* ── QUADRANTS ── */
const QUADRANTS = {
  reinvest:  { key: "reinvest",  label: "Reinvest-Weighted",          color: C.green },
  split:     { key: "split",     label: "Concentrated Inside",        color: C.gold },
  harvest:   { key: "harvest",   label: "Harvest-Weighted",           color: C.cyan },
  stabilize: { key: "stabilize", label: "Stabilize First",            color: C.red },
};
const getQuadrant = (b, p) =>
  b >= THRESHOLD ? (p >= THRESHOLD ? QUADRANTS.reinvest : QUADRANTS.split)
                 : (p >= THRESHOLD ? QUADRANTS.harvest  : QUADRANTS.stabilize);

/* ── REVENUE BANDS — strings must match ActiveCampaign `Revenue Range` exactly ── */
const REVENUE_BANDS = [
  { value: "Under $500K", label: "Under $500K",   qualified: false },
  { value: "$500K - $1M", label: "$500K – $1M",   qualified: false },
  { value: "$1M - $3M",   label: "$1M – $3M",     qualified: true  },
  { value: "$3M - $10M",  label: "$3M – $10M",    qualified: true  },
  { value: "$10M+",       label: "$10M+",         qualified: true  },
];

/* ── THE 20 STEPS ── */
const STEPS = [
  { type: "contact" },

  { type: "choice", key: "guess",
    q: "Right now, which way are you leaning? What do you think you should do with your profits?",
    sub: "No wrong answer. We'll compare it to what your answers actually say.",
    options: [
      { t: "Reinvest — put it back into the business", v: "reinvest" },
      { t: "Take profit — pull more out for myself",   v: "harvest" },
      { t: "Split it — some of each",                  v: "split" },
      { t: "Honestly, I don't know",                   v: null },
    ] },

  { type: "interstitial", kicker: "How this works",
    title: "Two sides, scored separately.",
    body: [
      { label: "Business Capacity", color: C.gold,  text: "Can the next dollar earn its return inside the company?" },
      { label: "Personal Foundation", color: C.green, text: "Is the base outside it built?" },
    ],
    foot: "Most diagnostics only look at one. The answer depends on both." },

  { type: "score", key: "b1", pillar: "biz",
    q: "Do you know what your last big investment in the business actually returned?",
    sub: "The equipment, the hire, the software, the buildout — any major spend in the last two years.",
    options: [
      { t: "We set an ROI target beforehand, then measured actual ROI afterwards", s: 6 },
      { t: "Measured ROI only after the fact, didn't set a target", s: 5 },
      { t: "I could work it out from our numbers", s: 4 },
      { t: "Only for our largest purchases", s: 3 },
      { t: "I'd be guessing", s: 2 },
      { t: "Never looked at it that way", s: 1 },
    ] },

  { type: "score", key: "b2", pillar: "biz",
    q: "How does your net margin compare to others in your industry?",
    sub: "Your industry, your revenue size — not a national average across all business.",
    options: [
      { t: "Top quartile, and I know why", s: 6 },
      { t: "Above the median", s: 5 },
      { t: "About average", s: 4 },
      { t: "Slightly below average", s: 3 },
      { t: "Well below average", s: 2 },
      { t: "I don't know my net margin", s: 1 },
    ] },

  { type: "score", key: "b3", pillar: "biz",
    q: "Do you know the one thing holding your growth back?",
    sub: "Not a list — the single thing that, if it improved, would let everything else move.",
    options: [
      { t: "Yes — and I have data proving it", s: 6 },
      { t: "Yes — confident, but no hard data", s: 5 },
      { t: "I have a strong hunch", s: 4 },
      { t: "I've narrowed it to two", s: 3 },
      { t: "Three or four candidates", s: 2 },
      { t: "Honestly, everything needs work", s: 1 },
    ] },

  { type: "score", key: "b4", pillar: "biz",
    q: "If your qualified leads doubled tomorrow, what would happen?",
    sub: "Not more revenue — more work. What gives first?",
    options: [
      { t: "We'd absorb it comfortably", s: 6 },
      { t: "A stretch, but we'd manage", s: 5 },
      { t: "I'd be working a lot more", s: 4 },
      { t: "Something would start to slip", s: 3 },
      { t: "Quality would drop noticeably", s: 2 },
      { t: "It would break us", s: 1 },
    ] },

  { type: "score", key: "b5", pillar: "biz",
    q: "Are you turning work away right now?",
    sub: "Real work you'd want, that you can't take on.",
    options: [
      { t: "Regularly, and I track the cost", s: 6 },
      { t: "Often, capacity is the issue", s: 5 },
      { t: "Occasionally, when we're slammed", s: 4 },
      { t: "Rarely", s: 3 },
      { t: "No, we take what comes", s: 2 },
      { t: "We're chasing every lead", s: 1 },
    ] },

  { type: "interstitial", kicker: "One number worth sitting with",
    stat: "80%",
    title: "of the average owner's net worth sits inside their own company.",
    cite: "Exit Planning Institute, State of Owner Readiness",
    foot: "Nobody chooses that number — it accumulates one reasonable decision at a time. The next five questions are about the other side." },

  { type: "score", key: "p1", pillar: "pers",
    q: "How intentional are you about paying yourself and building assets outside the business?",
    sub: "Salary and distributions together — how much you take, and where it goes after it leaves.",
    options: [
      { t: "Set amount, automatically invested outside", s: 6 },
      { t: "Deliberate, and mostly invested", s: 5 },
      { t: "Consistent pay, no plan after that", s: 4 },
      { t: "I save whatever is left over", s: 3 },
      { t: "Varies with what we can spare", s: 2 },
      { t: "I mostly leave it in the business", s: 1 },
    ] },

  { type: "score", key: "p2", pillar: "pers",
    q: "How long could you cover fixed costs with no new revenue?",
    sub: "Business and personal expenses. Answer for whichever is weaker.",
    options: [
      { t: "Six months or more, both sides", s: 6 },
      { t: "Three to six months", s: 5 },
      { t: "Two to three months", s: 4 },
      { t: "About one month", s: 3 },
      { t: "Less than a month", s: 2 },
      { t: "Trouble immediately", s: 1 },
    ] },

  { type: "score", key: "p3", pillar: "pers",
    q: "How much of your net worth sits outside the business?",
    sub: "Count real estate the company occupies as inside.",
    options: [
      { t: "More than half", s: 6 },
      { t: "Roughly a third", s: 5 },
      { t: "Maybe a quarter", s: 4 },
      { t: "Some, but not much", s: 3 },
      { t: "Very little", s: 2 },
      { t: "Essentially all the business", s: 1 },
    ] },

  { type: "score", key: "p4", pillar: "pers",
    q: "When do you talk to your CPA about the year ahead?",
    sub: "Planning conversations — not filing appointments.",
    options: [
      { t: "Quarterly planning, advisors coordinate amongst themselves", s: 6 },
      { t: "A planning meeting before year-end", s: 5 },
      { t: "Only when something big comes up", s: 4 },
      { t: "Once a year, briefly", s: 3 },
      { t: "At filing time", s: 2 },
      { t: "I find out in April", s: 1 },
    ] },

  { type: "score", key: "p5", pillar: "pers",
    q: "Where do you want this business to take you?",
    sub: "Doesn't have to be a sale. But it has to be specific.",
    options: [
      { t: "I know the lifestyle I want and the monthly passive cash flow it needs", s: 6 },
      { t: "I know the lifestyle, but not the passive cash flow it would need", s: 5 },
      { t: "A general idea of the direction, but that's it", s: 4 },
      { t: "Some idea, but it shifts", s: 3 },
      { t: "Thought about it, nothing concrete", s: 2 },
      { t: "Haven't decided", s: 1 },
    ] },

  { type: "choice", key: "industry",
    q: "What kind of business do you run?",
    options: [
      { t: "Finance", v: "Finance" },
      { t: "Healthcare", v: "Healthcare" },
      { t: "Manufacturing", v: "Manufacturing" },
      { t: "Professional Services", v: "Professional Services" },
      { t: "Home/Local Services", v: "Home/Local Services" },
      { t: "Retail", v: "Retail" },
      { t: "Education", v: "Education" },
      { t: "Other", v: "Other" },
    ] },

  { type: "choice", key: "ownership",
    q: "Are you the owner, or do you have partners?",
    options: [
      { t: "I'm a 100% owner", v: "100% owner", tier: "Owner" },
      { t: "Majority owner (>51%)", v: "Majority owner", tier: "Owner" },
      { t: "50/50 partner", v: "50/50 partner", tier: "Owner" },
      { t: "Minority owner (<50%)", v: "Minority owner", tier: "Owner" },
      { t: "On the leadership team, not an owner", v: "Leadership, not owner", tier: "Leadership" },
      { t: "I'm an employee", v: "Employee", tier: "Employee" },
    ] },

  { type: "choice", key: "timing",
    q: "When you find something worth fixing, how fast do you move?",
    options: [
      { t: "I move on it right away", v: "Immediately" },
      { t: "Within a month or two", v: "1-2 months" },
      { t: "Sometime this year", v: "This year" },
      { t: "I usually sit on things", v: "Slow" },
    ] },

  { type: "interstitial", kicker: "Almost there",
    title: "What you're about to get.",
    list: [
      "Your position on the reinvest-or-harvest matrix",
      "Separate scores for business capacity and personal foundation",
      "The two dimensions holding your position back",
      "Three moves calibrated to how you actually scored",
    ] },

  { type: "choice", key: "revenue",
    q: "How much did your business make in the last 12 months?",
    sub: "Last question.",
    options: REVENUE_BANDS.map(b => ({ t: b.label, v: b.value })) },

  { type: "final" },
];

/* Formats to 555-123-4567 as the user types. Digits only, capped at 10. */
const fmtPhone = (v) => {
  let d = v.replace(/\D/g, "");
  /* Drop a leading US country code — otherwise "+1 415…" shifts every digit
     one place and produces 141-555-5013. */
  if (d.length > 10 && d[0] === "1") d = d.slice(1);
  d = d.slice(0, 10);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
};

const TOTAL = STEPS.length;
const BIZ_KEYS = ["b1", "b2", "b3", "b4", "b5"];
const PERS_KEYS = ["p1", "p2", "p3", "p4", "p5"];

/* ═══════════════════════════════════════════════════════════════ */

export default function ReinvestHarvestFlow() {
  const [step, setStep] = useState(0);
  const [contact, setContact] = useState({ first: "", last: "", company: "", email: "", phone: "" });
  const [answers, setAnswers] = useState({});
  const [scores, setScores] = useState({});
  const [err, setErr] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [captureFailed, setCaptureFailed] = useState(false);
  const topRef = useRef(null);
  const partialSent = useRef(false);

  useEffect(() => { topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); }, [step]);

  const S = STEPS[step];
  const bizScore = BIZ_KEYS.reduce((a, k) => a + (scores[k] || 0), 0);
  const persScore = PERS_KEYS.reduce((a, k) => a + (scores[k] || 0), 0);
  const quadrant = getQuadrant(bizScore, persScore);
  const band = REVENUE_BANDS.find(b => b.value === answers.revenue);
  const ownerTier = STEPS.find(x => x.key === "ownership")?.options
    .find(o => o.v === answers.ownership)?.tier || null;

  const next = () => setStep(s => Math.min(s + 1, TOTAL - 1));
  const back = () => { setErr(""); setStep(s => Math.max(s - 1, 0)); };

  const pick = (val) => {
    setErr("");
    if (S.type === "score") setScores(p => ({ ...p, [S.key]: val }));
    else setAnswers(p => ({ ...p, [S.key]: val }));
    if (AUTO_ADVANCE) setTimeout(next, ADVANCE_MS);
  };

  const contactValid = () => {
    if (!contact.first.trim() || !contact.last.trim()) return "Please enter your first and last name.";
    if (!contact.company.trim()) return "Please enter your company name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) return "Please enter a valid email address.";
    if (contact.phone.replace(/\D/g, "").length < 10) return "Please enter a valid phone number.";
    return "";
  };

  /* Capture valid contact details once without delaying progress into the flow. */
  const sendPartial = () => {
    if (partialSent.current) return;
    partialSent.current = true;
    const params = new URLSearchParams(window.location.search);
    const body = {
      tool: "reinvest-harvest",
      partial: true,
      first: contact.first.trim(),
      last: contact.last.trim(),
      name: `${contact.first} ${contact.last}`.trim(),
      company: contact.company.trim(),
      email: contact.email.trim(),
      phone: contact.phone.trim(),
      utmSource: params.get("utm_source") || null,
      utmCampaign: params.get("utm_campaign") || null,
      timestamp: new Date().toISOString(),
    };
    console.log("[reinvest-harvest] partial capture:", body.email);
    fetch("/api/lead-capture", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
    }).catch(e => console.warn("[reinvest-harvest] partial capture failed", e));
  };

  const submit = async () => {
    setSending(true);
    setCaptureFailed(false);
    const payload = {
      tool: "reinvest-harvest", toolName: "Reinvest or Harvest Scorecard",
      ...contact,
      name: `${contact.first} ${contact.last}`.trim(),
      company: contact.company.trim(),
      guess: answers.guess ?? null,
      industry: answers.industry, ownership: answers.ownership, ownerTier,
      timing: answers.timing, revenueBand: answers.revenue,
      scores,
      summary: {
        bizScore, persScore, pillarMax: PILLAR_MAX,
        totalScore: bizScore + persScore, maxScore: 60,
        quadrant: quadrant.label, quadrantKey: quadrant.key,
        guessAgreed: answers.guess ? answers.guess === quadrant.key : null,
        trackIntent: ["harvest", "split"].includes(quadrant.key) ? "Wealth" : "Business",
      },
      timestamp: new Date().toISOString(),
    };
    console.log("[reinvest-harvest] submitting payload:");
    console.log(JSON.stringify(payload, null, 2));
    let token = null;
    try {
      const response = await fetch("/api/lead-capture", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(`Capture failed (${response.status})`);
      ({ token } = await response.json());
      if (!token) throw new Error("Capture response did not include a token");
    } catch (e) {
      setCaptureFailed(true);
      console.warn("[reinvest-harvest] lead-capture failed — payload logged above", e);
    }
    await new Promise(r => setTimeout(r, 600));
    setSending(false); setDone(true);
    if (token) {
      setTimeout(() => {
        window.location.assign(`/reinvest-harvest/next?t=${encodeURIComponent(token)}`);
      }, 2600);
    }
  };

  /* ── shared styles ── */
  const shell = { background: C.bgDeep, minHeight: "100vh", fontFamily: "'DM Sans',sans-serif", color: C.text1 };
  const wrap = { maxWidth: 620, margin: "0 auto", padding: "0 20px 60px" };
  const qStyle = { fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: "clamp(27px,6.6vw,38px)", lineHeight: 1.16, margin: "0 0 10px", color: C.text1 };
  const subStyle = { fontSize: 14.5, lineHeight: 1.55, color: C.text3, margin: "0 0 20px" };

  const optionCard = (label, selected, onClick, letter, compact = false) => (
    <div key={label} onClick={onClick} className="opt"
      style={{
        display: "flex", alignItems: "center", gap: 14, padding: compact ? "14px 16px" : "17px 16px", marginBottom: compact ? 8 : 10,
        borderRadius: 12, cursor: "pointer", userSelect: "none", transition: "all .18s ease",
        background: selected ? `${C.gold}18` : "rgba(255,255,255,.025)",
        border: `1.5px solid ${selected ? C.gold : "rgba(255,255,255,.09)"}`,
        boxShadow: selected ? `0 0 20px ${C.gold}22` : "none",
      }}>
      <span style={{
        flexShrink: 0, width: 30, height: 30, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 12, fontWeight: 700, transition: "all .18s ease",
        background: selected ? C.gold : "transparent",
        border: `1.5px solid ${selected ? C.gold : "rgba(255,255,255,.16)"}`,
        color: selected ? C.bgDeep : C.text3,
      }}>{letter}</span>
      <span style={{ fontSize: 15.5, lineHeight: 1.35, color: selected ? C.text1 : C.text2 }}>{label}</span>
    </div>
  );

  const ALPHA = "ABCDEFGH";

  const PrevButton = () => step === 0 ? null : (
    <button onClick={back} className="prev"
      style={{ display: "inline-block", marginTop: 16, padding: "9px 24px", borderRadius: 10,
        background: "rgba(255,255,255,.03)", border: "1.5px solid rgba(255,255,255,.14)",
        cursor: "pointer", color: C.text2, fontSize: 20, fontWeight: 700,
        fontFamily: "'DM Sans',sans-serif", lineHeight: 1.1, transition: "all .2s ease" }}>
      Previous
    </button>
  );


  /* ═══ TEASER ═══ */
  if (done) {
    const agreed = answers.guess ? answers.guess === quadrant.key : null;
    const guessLabel = { reinvest: "Reinvest", harvest: "Take profit", split: "Split" }[answers.guess];
    return (
      <div style={shell}>
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet" />
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", opacity: .05, mixBlendMode: "overlay", backgroundImage: GRAIN, backgroundSize: "128px 128px" }} />
        <div style={{ ...wrap, paddingTop: 80, textAlign: "center" }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".2em", textTransform: "uppercase", color: quadrant.color, marginBottom: 14 }}>Your position</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: "clamp(34px,8.4vw,52px)", lineHeight: 1.1, textTransform: "uppercase", letterSpacing: ".01em", color: quadrant.color, margin: "0 0 22px" }}>
            {quadrant.label}
          </h1>

          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontStyle: "italic", lineHeight: 1.5, color: C.text1, margin: "0 0 34px" }}>
            {agreed === null && <>Your answers point to {quadrant.label}.</>}
            {agreed === true && <>You guessed {guessLabel} — and your answers agree. That's a confident read.</>}
            {agreed === false && <>You were leaning <b style={{ fontStyle: "normal" }}>{guessLabel}</b>. Your answers point to <b style={{ fontStyle: "normal", color: quadrant.color }}>{quadrant.label}</b>.</>}
          </p>

          <div style={{ display: "flex", gap: 12, marginBottom: 36 }}>
            {[{ l: "Business Capacity", v: bizScore, c: C.gold }, { l: "Personal Foundation", v: persScore, c: C.green }].map(p => (
              <div key={p.l} style={{ flex: 1, padding: "18px 12px", borderRadius: 12, background: `${p.c}0d`, border: `1px solid ${p.c}33` }}>
                <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: p.c, marginBottom: 6 }}>{p.l}</div>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 34, fontWeight: 700, color: p.c, lineHeight: 1 }}>
                  {p.v}<span style={{ fontSize: 15, color: C.text3 }}>/{PILLAR_MAX}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ padding: "18px 20px", borderRadius: 12, background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.08)" }}>
            <div style={{ fontSize: 15, color: C.text1, marginBottom: 4 }}>Your full scorecard is on its way.</div>
            <div style={{ fontSize: 13.5, color: C.text3 }}>Sent to <b style={{ color: C.text2 }}>{contact.email}</b></div>
          </div>

          <p style={{ fontSize: 12.5, color: C.text4, marginTop: 26 }}>
            Taking you to a short video next — watch it before you check your email.
          </p>
          {captureFailed && (
            <a href="/reinvest-harvest/next" style={{ display: "inline-block", marginTop: 14, color: C.gold, fontSize: 15, fontWeight: 700, textDecoration: "none" }}>
              Continue to your next step →
            </a>
          )}
        </div>
      </div>
    );
  }

  /* ═══ FLOW ═══ */
  return (
    <div style={shell} ref={topRef}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet" />
      <style>{`
        *{box-sizing:border-box}
        input,select{font-family:'DM Sans',sans-serif}
        .opt:hover{background:rgba(255,255,255,.05)!important;border-color:rgba(255,255,255,.18)!important}
        .prev:hover{color:#E8ECF1!important;border-color:rgba(255,255,255,.28)!important;background:rgba(255,255,255,.06)!important}
        .btn:hover{box-shadow:0 0 34px ${C.gold}33!important;border-color:${C.gold}!important}
         @media (max-width:430px) and (max-height:860px){
           .flow-wrap{padding-top:18px!important}
           .opt{padding:12px 14px!important;margin-bottom:7px!important}
           .prev{margin-top:10px!important}
         }
      `}</style>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", opacity: .05, mixBlendMode: "overlay", backgroundImage: GRAIN, backgroundSize: "128px 128px", zIndex: 0 }} />

      {/* progress */}
      <div style={{ position: "sticky", top: 0, zIndex: 10, background: `${C.bgDeep}f2`, backdropFilter: "blur(8px)" }}>
        <div style={{ height: 3, background: "rgba(255,255,255,.06)" }}>
          <div style={{ height: "100%", width: `${((step + 1) / TOTAL) * 100}%`, background: `linear-gradient(90deg,${C.gold},${C.goldLight})`, transition: "width .35s ease", boxShadow: `0 0 10px ${C.gold}66` }} />
        </div>
        <div style={{ maxWidth: 620, margin: "0 auto", padding: "14px 20px", textAlign: "right" }}>
          <span style={{ fontSize: 13, color: C.text3 }}>{step + 1} <span style={{ color: C.text4 }}>of</span> {TOTAL}</span>
        </div>
      </div>

      <div className="flow-wrap" style={{ ...wrap, paddingTop: 26, position: "relative", zIndex: 1 }}>

        {/* ── CONTACT ── */}
        {S.type === "contact" && (
          <>
            <h1 style={qStyle}>Before we start — where should we send your results?</h1>
            <p style={subStyle}>Your scorecard lands in your inbox the moment you finish.</p>
            {[
              { k: "first", ph: "First name", type: "text" },
              { k: "last", ph: "Last name", type: "text" },
              { k: "company", ph: "Company name", type: "text" },
              { k: "email", ph: "Email address", type: "email" },
              { k: "phone", ph: "Phone number", type: "tel" },
            ].map(f => (
              <input key={f.k} type={f.type} placeholder={f.ph} value={contact[f.k]}
                onChange={e => { const v = f.k === "phone" ? fmtPhone(e.target.value) : e.target.value; setContact(c => ({ ...c, [f.k]: v })); setErr(""); }}
                inputMode={f.k === "phone" ? "tel" : undefined} maxLength={f.k === "phone" ? 12 : undefined}
                style={{ width: "100%", padding: "16px 16px", marginBottom: 10, borderRadius: 11, background: "#0F141C", border: "1px solid rgba(255,255,255,.1)", color: C.text1, fontSize: 15.5, outline: "none" }}
                onFocus={e => e.target.style.borderColor = `${C.gold}88`}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,.1)"} />
            ))}
            {err && <p style={{ color: C.red, fontSize: 13.5, margin: "4px 0 12px" }}>{err}</p>}
            <button className="btn" onClick={() => {
              const e = contactValid();
              if (e) { setErr(e); return; }
              sendPartial();
              next();
            }}
              style={{ width: "100%", padding: "18px 0", marginTop: 8, borderRadius: 12, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 16, color: C.gold, background: `linear-gradient(135deg,${C.gold}22,${C.gold}0d)`, border: `1.5px solid ${C.gold}66`, transition: "all .25s ease" }}>
              Continue →
            </button>
            {/* Matches the consent wording on /free-session. Privacy Policy and Terms are
                named but not linked — neither page exists as a route yet. */}
            <p style={{ fontSize: 10.5, lineHeight: 1.55, color: C.text4, textAlign: "center", marginTop: 14 }}>
              By providing your information you consent to Kriczky Virtus, LLC contacting you by phone, text, or email using automated telephone dialing systems and AI to the information provided, even if the phone number is present on a state or national Do Not Call List. We do not sell your personal information. By providing this information you agree to our Privacy Policy and Terms of Service.
            </p>
          </>
        )}

        {/* ── SCORE / CHOICE ── */}
        {(S.type === "score" || S.type === "choice") && (
          <>
            {S.pillar && (
              <div style={{ display: "inline-block", padding: "4px 11px", borderRadius: 5, marginBottom: 14, background: `${S.pillar === "biz" ? C.gold : C.green}14`, border: `1px solid ${S.pillar === "biz" ? C.gold : C.green}40` }}>
                <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: S.pillar === "biz" ? C.gold : C.green }}>
                  {S.pillar === "biz" ? "Business Capacity" : "Personal Foundation"}
                </span>
              </div>
            )}
            <h1 style={qStyle}>{S.q}</h1>
            {S.sub && <p style={subStyle}>{S.sub}</p>}
            {!S.sub && <div style={{ height: 14 }} />}
            {S.options.map((o, i) => {
              const val = S.type === "score" ? o.s : o.v;
              const cur = S.type === "score" ? scores[S.key] : answers[S.key];
              const sel = S.type === "score" ? cur === o.s : (S.key in answers && cur === o.v);
              return optionCard(o.t, sel, () => pick(val), ALPHA[i], S.options.length > 6);
            })}
            {!AUTO_ADVANCE && (
              <button className="btn" onClick={next}
                style={{ width: "100%", padding: "17px 0", marginTop: 14, borderRadius: 12, cursor: "pointer", fontWeight: 700, fontSize: 16, color: C.gold, background: `linear-gradient(135deg,${C.gold}22,${C.gold}0d)`, border: `1.5px solid ${C.gold}66` }}>
                Next →
              </button>
            )}
            <PrevButton />
          </>
        )}

        {/* ── INTERSTITIAL ── */}
        {S.type === "interstitial" && (
          <>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".2em", textTransform: "uppercase", color: C.gold, marginBottom: 16 }}>{S.kicker}</div>
            {S.stat && (
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 66, fontWeight: 700, color: C.gold, lineHeight: 1, textShadow: `0 0 40px ${C.gold}44`, marginBottom: 10 }}>{S.stat}</div>
            )}
            <h1 style={{ ...qStyle, fontSize: S.stat ? "clamp(20px,4.8vw,26px)" : "clamp(27px,6.6vw,38px)", fontWeight: S.stat ? 500 : 700 }}>{S.title}</h1>
            {S.cite && <p style={{ fontSize: 12, fontStyle: "italic", color: C.text4, margin: "0 0 22px" }}>{S.cite}</p>}

            {S.body && (
              <div style={{ margin: "22px 0" }}>
                {S.body.map(b => (
                  <div key={b.label} style={{ padding: "16px 18px", marginBottom: 12, borderRadius: 12, background: `${b.color}0a`, border: `1px solid ${b.color}2e` }}>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: b.color, marginBottom: 6 }}>{b.label}</div>
                    <div style={{ fontSize: 15, lineHeight: 1.5, color: C.text2 }}>{b.text}</div>
                  </div>
                ))}
              </div>
            )}

            {S.list && (
              <div style={{ margin: "22px 0" }}>
                {S.list.map(item => (
                  <div key={item} style={{ display: "flex", gap: 11, alignItems: "flex-start", marginBottom: 13 }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 3 }}>
                      <polyline points="4 12 10 18 20 6" stroke={C.gold} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span style={{ fontSize: 15, lineHeight: 1.5, color: C.text2 }}>{item}</span>
                  </div>
                ))}
              </div>
            )}

            {S.foot && <p style={{ fontSize: 15, lineHeight: 1.6, color: C.text2, margin: "0 0 8px" }}>{S.foot}</p>}

            <button className="btn" onClick={next}
              style={{ width: "100%", padding: "18px 0", marginTop: 26, borderRadius: 12, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 16, color: C.gold, background: `linear-gradient(135deg,${C.gold}22,${C.gold}0d)`, border: `1.5px solid ${C.gold}66`, transition: "all .25s ease" }}>
              Continue →
            </button>
            <PrevButton />
          </>
        )}

        {/* ── FINAL ── */}
        {S.type === "final" && (
          <>
            <h1 style={qStyle}>That's everything.</h1>
            <p style={subStyle}>
              Your position and your full scorecard are ready. We'll show you where you landed, then email the complete report to <b style={{ color: C.text2 }}>{contact.email}</b>.
            </p>
            <button className="btn" onClick={submit} disabled={sending}
              style={{ width: "100%", padding: "20px 0", borderRadius: 12, cursor: sending ? "wait" : "pointer", fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 17, color: C.gold, background: `linear-gradient(135deg,${C.gold}26,${C.gold}0f)`, border: `1.5px solid ${C.gold}88`, boxShadow: `0 0 26px ${C.gold}1f`, opacity: sending ? .7 : 1, transition: "all .25s ease" }}>
              {sending ? "Scoring your answers…" : "SHOW ME MY POSITION →"}
            </button>
            <p style={{ fontSize: 11.5, lineHeight: 1.55, color: C.text4, textAlign: "center", marginTop: 16 }}>
              Educational self-assessment only. Not individualized financial, tax, or legal advice.
            </p>
            <PrevButton />
          </>
        )}
      </div>
    </div>
  );
}
