import PageTexture from "../PageTexture.jsx";
import { useState, useEffect, useRef } from "react";
import FlowFrame, { useBp, scrollToFlow, CardHead, Option, NavRow } from "./FlowFrame.jsx";
import { T as KT, Logo, HaloButton } from "../CreamKit.jsx";
/* Cream, like the report and the printed workbooks. Accents are the deeper
   "ink" versions (see kvTheme.js) so they stay readable on cream. */
import { LIGHT as C } from "./kvTheme.js";

/* ═══════════════════════════════════════════════════════════════
   REINVEST OR HARVEST - 20-STEP FLOW
   Route: /reinvest-harvest/start
   Mobile-first. One question per screen.
   (22 Nov 2026) Dressed in the /workshop-rh/snapshot frame (FlowFrame.jsx): title,
   progress bar, the question in a glow card, sample scorecard pages underneath.
   Questions, scoring and the submit are unchanged.
   ═══════════════════════════════════════════════════════════════ */

/* Selecting an option advances automatically after a short beat.
   Set false for explicit Next buttons (fewer mis-taps, ~2x the taps). */
const AUTO_ADVANCE = true;
const ADVANCE_MS = 340;

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

/* ── REVENUE BANDS - strings must match ActiveCampaign `Revenue Range` exactly ── */
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
      { t: "Reinvest - put it back into the business", v: "reinvest" },
      { t: "Take profit - pull more out for myself",   v: "harvest" },
      { t: "Split it - some of each",                  v: "split" },
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
    sub: "The equipment, the hire, the software, the buildout - any major spend in the last two years.",
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
    sub: "Your industry, your revenue size - not a national average across all business.",
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
    sub: "Not a list - the single thing that, if it improved, would let everything else move.",
    options: [
      { t: "Yes - and I have data proving it", s: 6 },
      { t: "Yes - confident, but no hard data", s: 5 },
      { t: "I have a strong hunch", s: 4 },
      { t: "I've narrowed it to two", s: 3 },
      { t: "Three or four candidates", s: 2 },
      { t: "Honestly, everything needs work", s: 1 },
    ] },

  { type: "score", key: "b4", pillar: "biz",
    q: "If your qualified leads doubled tomorrow, what would happen?",
    sub: "Not more revenue - more work. What gives first?",
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
    foot: "Nobody chooses that number - it accumulates one reasonable decision at a time. The next five questions are about the other side." },

  { type: "score", key: "p1", pillar: "pers",
    q: "How intentional are you about paying yourself and building assets outside the business?",
    sub: "Salary and distributions together - how much you take, and where it goes after it leaves.",
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
    sub: "Planning conversations - not filing appointments.",
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
  /* Drop a leading US country code - otherwise "+1 415…" shifts every digit
     one place and produces 141-555-5013. */
  if (d.length > 10 && d[0] === "1") d = d.slice(1);
  d = d.slice(0, 10);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
};

const TOTAL = STEPS.length;

/* Sample scorecard pages, from a fictional owner's answers ("Sample Owner", "Sample Company"). */
const RH_SAMPLES = [
  { n: "01", t: "Your scorecard", src: "/img/rh-sample/page-01.jpg" },
  { n: "02", t: "Your position", src: "/img/rh-sample/page-02.jpg" },
  { n: "04", t: "Business capacity, scored", src: "/img/rh-sample/page-04.jpg" },
  { n: "05", t: "Personal foundation, scored", src: "/img/rh-sample/page-05.jpg" },
  { n: "06", t: "Your first three moves", src: "/img/rh-sample/page-06.jpg" },
];
const BIZ_KEYS = ["b1", "b2", "b3", "b4", "b5"];
const PERS_KEYS = ["p1", "p2", "p3", "p4", "p5"];

/* ═══════════════════════════════════════════════════════════════ */

/* door="workshop" (/workshop-rh/scorecard): the same scorecard as workshop pre-work.
   It ends on /workshop-rh/scorecard/next instead of the working-session page, and the
   contact gets no website-lead tags, so attendees stay out of the sales emails. */
export default function ReinvestHarvestFlow({ door = "site" }) {
  const workshop = door === "workshop";
  const nextPath = workshop ? "/workshop-rh/scorecard/next" : "/reinvest-harvest/next";
  const [step, setStep] = useState(0);
  const [contact, setContact] = useState({ first: "", last: "", company: "", email: "", phone: "" });
  const [answers, setAnswers] = useState({});
  const [scores, setScores] = useState({});
  const [err, setErr] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [captureFailed, setCaptureFailed] = useState(false);
  const topRef = useRef(null);
  const barRef = useRef(null);
  const partialSent = useRef(false);
  const mob = useBp();
  const first = useRef(null);   /* the step last scrolled to; the first paint stays at the top */

  useEffect(() => {
    if (first.current === null || first.current === step + (done ? 1000 : 0)) { first.current = step + (done ? 1000 : 0); return; }
    first.current = step + (done ? 1000 : 0);
    scrollToFlow(topRef.current, barRef.current);
  }, [step]);

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
      door,
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
      tool: "reinvest-harvest", toolName: "Reinvest or Harvest Scorecard", door,
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
      console.warn("[reinvest-harvest] lead-capture failed - payload logged above", e);
    }
    await new Promise(r => setTimeout(r, 600));
    setSending(false); setDone(true);
    if (token) {
      setTimeout(() => {
        window.location.assign(`${nextPath}?t=${encodeURIComponent(token)}`);
      }, 2600);
    }
  };

  /* ── shared styles (the teaser) ── */
  const shell = { background: C.bgDeep, minHeight: "100vh", fontFamily: "'DM Sans',sans-serif", color: C.text1, position: "relative", isolation: "isolate" };
  const wrap = { maxWidth: 620, margin: "0 auto", padding: "0 20px 60px" };
  const ALPHA = "ABCDEFGH";
  const btn = (label, onClick, extra = {}) => <HaloButton onClick={onClick} size={15} style={{ padding: "14px 28px", ...extra }}>{label}</HaloButton>;
  const answered = S.type === "score" ? scores[S.key] != null : (S.type === "choice" && S.key in answers);

  /* ═══ TEASER ═══ */
  if (done) {
    const agreed = answers.guess ? answers.guess === quadrant.key : null;
    const guessLabel = { reinvest: "Reinvest", harvest: "Take profit", split: "Split" }[answers.guess];
    return (
      <div style={shell}>
        <PageTexture />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet" />
        <div style={{ ...wrap, paddingTop: 26, textAlign: "center" }}>
          <Logo style={{ marginBottom: 50 }} />
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".2em", textTransform: "uppercase", color: quadrant.color, marginBottom: 14 }}>Your position</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: "clamp(34px,8.4vw,52px)", lineHeight: 1.1, textTransform: "uppercase", letterSpacing: ".01em", color: quadrant.color, margin: "0 0 22px" }}>
            {quadrant.label}
          </h1>

          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontStyle: "italic", lineHeight: 1.5, color: C.text1, margin: "0 0 34px" }}>
            {agreed === null && <>Your answers point to {quadrant.label}.</>}
            {agreed === true && <>You guessed {guessLabel} - and your answers agree. That's a confident read.</>}
            {agreed === false && <>You were leaning <b style={{ fontStyle: "normal" }}>{guessLabel}</b>. Your answers point to <b style={{ fontStyle: "normal", color: quadrant.color }}>{quadrant.label}</b>.</>}
          </p>

          <div style={{ display: "flex", gap: 12, marginBottom: 36 }}>
            {[{ l: "Business Capacity", v: bizScore, c: C.gold }, { l: "Personal Foundation", v: persScore, c: C.green }].map(p => (
              <div key={p.l} style={{ flex: 1, padding: "18px 12px", borderRadius: 12, background: `linear-gradient(135deg,#FFFFFF 55%,${p.c}12)`, border: `1px solid ${p.c}33`, boxShadow: C.shadowCard }}>
                <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: p.c, marginBottom: 6 }}>{p.l}</div>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 34, fontWeight: 700, color: p.c, lineHeight: 1 }}>
                  {p.v}<span style={{ fontSize: 15, color: C.text3 }}>/{PILLAR_MAX}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ padding: "18px 20px", borderRadius: 12, background: C.surfaceCard, border: `1px solid ${C.line}`, boxShadow: C.shadowCard }}>
            <div style={{ fontSize: 15, color: C.text1, marginBottom: 4 }}>Your full scorecard is on its way.</div>
            <div style={{ fontSize: 13.5, color: C.text3 }}>Sent to <b style={{ color: C.text2 }}>{contact.email}</b></div>
          </div>

          <p style={{ fontSize: 12.5, color: C.text4, marginTop: 26 }}>
            {workshop ? "Taking you to your workshop pre-work next." : "Taking you to a short video next - watch it before you check your email."}
          </p>
          {captureFailed && (
            <a href={nextPath} style={{ display: "inline-block", marginTop: 14, color: C.gold, fontSize: 15, fontWeight: 700, textDecoration: "none" }}>
              Continue to your next step →
            </a>
          )}
        </div>
      </div>
    );
  }

  /* ═══ FLOW ═══ */
  const label = S.type === "contact" ? "Your information"
    : S.type === "score" ? (S.pillar === "biz" ? "Business Capacity" : "Personal Foundation")
    : S.type === "choice" ? "About you"
    : S.type === "interstitial" ? S.kicker : "Last step";
  const tone = S.type === "score" ? (S.pillar === "biz" ? KT.gold : KT.green) : KT.gold;
  return (
    <FlowFrame A={KT.gold} topRef={topRef} barRef={barRef}
      kicker={workshop ? "Reinvest or Harvest Workshop · Pre-work" : "The Reinvest or Harvest Scorecard"}
      title={<>Where should your next dollar of profit go - <span style={{ color: KT.gold.ink, fontStyle: "italic", fontWeight: 500 }}>back into the business</span>, or <span style={{ color: KT.green.ink, fontStyle: "italic", fontWeight: 500 }}>out to you</span>?</>}
      progress={{ label: `Step ${step + 1} of ${TOTAL}`, pct: Math.round((step / TOTAL) * 100) }}
      samples={{ kicker: "Your Reinvest or Harvest scorecard", pages: RH_SAMPLES,
        text: "Sample pages from a finished scorecard. Yours is built from your answers: your position, both scores, and your first three moves." }}>
      <div className="ff-step" key={step}>
        <CardHead n={step + 1} label={label} labelTone={tone} mob={mob} A={KT.gold}
          q={S.type === "contact" ? "Before we start - where should we send your results?" : S.type === "final" ? "That's everything." : S.type === "interstitial" ? S.title : S.q}
          sub={S.type === "contact" ? "Your scorecard lands in your inbox the moment you finish." : S.type === "final" ? null : S.sub} />

        {/* ── CONTACT ── */}
        {S.type === "contact" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: 10 }}>
              {[
                { k: "first", ph: "First name", type: "text", ac: "given-name" },
                { k: "last", ph: "Last name", type: "text", ac: "family-name" },
                { k: "company", ph: "Company name", type: "text", ac: "organization", wide: true },
                { k: "email", ph: "Email address", type: "email", ac: "email", wide: true },
                { k: "phone", ph: "Phone number", type: "tel", ac: "tel", wide: true },
              ].map(f => (
                <input key={f.k} className="ff-in" type={f.type} placeholder={f.ph} value={contact[f.k]} autoComplete={f.ac}
                  onChange={e => { const v = f.k === "phone" ? fmtPhone(e.target.value) : e.target.value; setContact(c => ({ ...c, [f.k]: v })); setErr(""); }}
                  inputMode={f.k === "phone" ? "tel" : undefined} maxLength={f.k === "phone" ? 12 : undefined}
                  style={f.wide && !mob ? { gridColumn: "1 / -1" } : undefined} />
              ))}
            </div>
            {err && <p style={{ color: KT.red.ink, fontSize: 13.5, margin: "10px 0 0" }}>{err}</p>}
            <NavRow mob={mob} right={btn("Continue", () => {
              const e = contactValid();
              if (e) { setErr(e); return; }
              sendPartial();
              next();
            })} />
            {/* Matches the consent wording on /free-session. */}
            <p style={{ fontSize: 10.5, lineHeight: 1.55, color: C.text4, textAlign: "center", margin: "14px 0 0" }}>
              By providing your information you consent to Kriczky Virtus, LLC contacting you by phone, text, or email using automated telephone dialing systems and AI to the information provided, even if the phone number is present on a state or national Do Not Call List. We do not sell your personal information. By providing this information you agree to our Privacy Policy and Terms of Service.
            </p>
          </>
        )}

        {/* ── SCORE / CHOICE ── */}
        {(S.type === "score" || S.type === "choice") && (
          <>
            <div role="radiogroup">
              {S.options.map((o, i) => {
                const val = S.type === "score" ? o.s : o.v;
                const cur = S.type === "score" ? scores[S.key] : answers[S.key];
                const sel = S.type === "score" ? cur === o.s : (S.key in answers && cur === o.v);
                return <Option key={o.t} letter={ALPHA[i]} label={o.t} on={sel} onClick={() => pick(val)} />;
              })}
            </div>
            <NavRow mob={mob} onBack={back} right={(!AUTO_ADVANCE || answered) ? btn("Next", next) : null} />
          </>
        )}

        {/* ── INTERSTITIAL ── */}
        {S.type === "interstitial" && (
          <>
            {S.body && (
              <div style={{ margin: "6px 0 10px" }}>
                {S.body.map(b => (
                  <div key={b.label} style={{ padding: "14px 16px", marginBottom: 10, borderRadius: 12, background: `linear-gradient(135deg,#FFFFFF 55%,${b.color}10)`, border: `1px solid ${b.color}2e`, boxShadow: C.shadowCard }}>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: b.color, marginBottom: 5 }}>{b.label}</div>
                    <div style={{ fontSize: 15, lineHeight: 1.5, color: C.text2 }}>{b.text}</div>
                  </div>
                ))}
              </div>
            )}
            {S.list && (
              <div style={{ margin: "6px 0 10px" }}>
                {S.list.map(item => (
                  <div key={item} style={{ display: "flex", gap: 11, alignItems: "flex-start", marginBottom: 11 }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 3 }}>
                      <polyline points="4 12 10 18 20 6" stroke={KT.gold.ink} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span style={{ fontSize: 15, lineHeight: 1.5, color: C.text2 }}>{item}</span>
                  </div>
                ))}
              </div>
            )}
            {S.foot && <p style={{ fontSize: 15, lineHeight: 1.6, color: C.text2, margin: "0 0 4px" }}>{S.foot}</p>}
            <NavRow mob={mob} onBack={back} right={btn("Continue", next)} />
          </>
        )}

        {/* ── FINAL ── */}
        {S.type === "final" && (
          <>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: C.text2, margin: "0 0 4px" }}>
              Your position and your full scorecard are ready. We'll show you where you landed, then email the complete report to <b style={{ color: C.text1 }}>{contact.email}</b>.
            </p>
            <NavRow mob={mob} onBack={back} right={<HaloButton onClick={submit} disabled={sending} size={15.5} style={{ padding: "15px 28px" }}>{sending ? "Scoring your answers…" : "Show me my position"}</HaloButton>} />
            <p style={{ fontSize: 11.5, lineHeight: 1.55, color: C.text4, textAlign: "center", margin: "14px 0 0" }}>
              Educational self-assessment only. Not individualized financial, tax, or legal advice.
            </p>
          </>
        )}
      </div>
    </FlowFrame>
  );
}
