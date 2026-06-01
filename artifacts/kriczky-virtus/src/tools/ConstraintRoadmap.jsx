import { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// ═══════════════════════════════════════════════════════════════════
// CONSTRAINT ROADMAP ASSESSMENT — Kriczky Virtus
//
// 7-question business health diagnostic that identifies the owner's
// #1 constraint and produces a preliminary health score across 6
// categories: Profitability, Cash Flow, Revenue Quality, Owner
// Dependency, Operational Efficiency, and Scalability.
//
// Flow: Intro → 7 Questions → Calculating → Score Reveal + Email Gate
//       → Category Breakdown + CTA (What Happens Next)
//
// Lead capture: POST /api/lead-capture with name, email, scores,
// summary, and PDF. Mailto fallback if API fails.
// ═══════════════════════════════════════════════════════════════════

const C = {
  gold: "#C8A24E", goldMuted: "#A68A42", goldLight: "#D4B665",
  green: "#34D399", red: "#F87171", amber: "#FBBF24",
  blue: "#60A5FA", cyan: "#22D3EE",
  bgDeep: "#0A0E14", bgCard: "#111720", bgElev: "#1A2130",
  text1: "#E8ECF1", text2: "#8B95A5", text3: "#5A6474", text4: "#3D4654",
  border1: "rgba(255,255,255,0.06)", border2: "rgba(255,255,255,0.10)",
};

// Per-category color coding:
//   profitability         → gold
//   cash_flow             → green
//   owner_dependency      → amber
//   revenue_quality       → gold
//   operational_efficiency→ amber
//   scalability           → cyan
const CATEGORY_COLOR = {
  profitability: C.gold,
  cash_flow: C.green,
  owner_dependency: C.amber,
  revenue_quality: C.gold,
  operational_efficiency: C.amber,
  scalability: C.cyan,
};

// Display order for categories
const CATEGORY_ORDER = [
  { id: "profitability",          label: "Profitability" },
  { id: "cash_flow",              label: "Cash Flow" },
  { id: "revenue_quality",        label: "Revenue Quality" },
  { id: "owner_dependency",       label: "Owner Dependency" },
  { id: "operational_efficiency", label: "Operational Efficiency" },
  { id: "scalability",            label: "Scalability" },
];

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const useBp = () => {
  const [bp, setBp] = useState("desktop");
  useEffect(() => {
    const check = () => { const w = window.innerWidth; setBp(w < 768 ? "mobile" : w < 1024 ? "tablet" : "desktop"); };
    check(); window.addEventListener("resize", check); return () => window.removeEventListener("resize", check);
  }, []);
  return { mob: bp === "mobile", tab: bp === "tablet" };
};

const Grain = () => <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1, opacity: 0.07, mixBlendMode: "overlay", backgroundImage: GRAIN, backgroundSize: "128px 128px" }} />;

const Glass = ({ children, style, glow }) => (
  <div style={{
    background: "linear-gradient(145deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03) 50%,rgba(255,255,255,0.05))",
    backdropFilter: "blur(16px) saturate(1.2)",
    WebkitBackdropFilter: "blur(16px) saturate(1.2)",
    border: `1px solid ${C.border2}`,
    borderTop: "1px solid rgba(255,255,255,0.16)",
    borderRadius: 18,
    boxShadow: glow
      ? `0 2px 4px rgba(0,0,0,0.2),0 8px 24px rgba(0,0,0,0.3),0 20px 48px rgba(0,0,0,0.2),inset 0 1px 0 rgba(255,255,255,0.09),0 0 60px ${glow}1f,0 0 140px ${glow}0d`
      : `0 2px 4px rgba(0,0,0,0.2),0 8px 24px rgba(0,0,0,0.3),0 20px 48px rgba(0,0,0,0.2),inset 0 1px 0 rgba(255,255,255,0.09)`,
    position: "relative",
    ...style,
  }}>{children}</div>
);

// ─── useAnim — animated number transitions ────────
const useAnim = (target, dur = 800) => {
  const [val, setVal] = useState(target);
  const animRef = useRef(target);
  useEffect(() => {
    const s = animRef.current, e = target, t0 = performance.now();
    const tick = (now) => {
      const p = Math.min((now - t0) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      const v = s + (e - s) * ease;
      setVal(v);
      if (p < 1) requestAnimationFrame(tick); else animRef.current = e;
    };
    requestAnimationFrame(tick);
  }, [target, dur]);
  return val;
};
const GD_SCORE_SCENARIOS = [
  { label: "Not Sellable", scores: [2,3,2,3,3,2,3,2,3,3], bandIdx: 0, bandColor: C.red, pct: 43 },
  { label: "Discount", scores: [3,4,2,3,3,3,2,3,4,3], bandIdx: 1, bandColor: C.amber, pct: 50 },
  { label: "Market", scores: [4,4,3,4,4,4,3,4,4,3], bandIdx: 2, bandColor: C.gold, pct: 62 },
  { label: "Green Zone", scores: [4,5,4,5,4,3,4,5,3,4], bandIdx: 3, bandColor: C.cyan, pct: 68 },
  { label: "Best-In-Class", scores: [5,5,5,5,5,5,4,5,5,4], bandIdx: 4, bandColor: C.green, pct: 80 },
];
const GD_DIMS_A = ["Market Position","Revenue Quality","Financial Performance","Customer Concentration","Management Team"];
const GD_DIMS_R = ["Documentation","Contingency","Financial Infrastructure","Revenue Predictability","Mgmt Succession"];
const GD_BANDS = [
  { label: "Not Sellable", mult: "0\u00d7", color: C.red },
  { label: "Discount", mult: "3\u20134\u00d7", color: C.amber },
  { label: "Market", mult: "~5\u00d7", color: C.gold },
  { label: "Green Zone", mult: "5\u20136\u00d7", color: C.cyan },
  { label: "Best-In-Class", mult: "7\u20138\u00d7", color: C.green },
];
const GD_GAP_SCENARIOS = [
  { rev:2000,mg:12,bic:22,lm:1.5,hm:5 },
  { rev:4000,mg:15,bic:24,lm:3,hm:6 },
  { rev:7500,mg:10,bic:20,lm:2,hm:5 },
  { rev:3000,mg:8,bic:18,lm:1.5,hm:5.5 },
  { rev:6000,mg:22,bic:30,lm:4,hm:8 },
];
const gdScCol = (n) => n<=2?C.red:n<=3?C.amber:n<=4?C.cyan:C.green;
const gdFmt = (n) => { const a=Math.abs(n); return a>=1000?`$${(n/1000).toFixed(1)}M`:`$${Math.round(n)}K`; };

// ─── ScoreRing — ported verbatim from valor-results-page-v5 ────────
// Same component, same defaults (size=200, stroke=14). Number renders
// INSIDE the ring at size*0.36 with the "out of 100" caption below.
// Animates strokeDashoffset on color change.
const ScoreRing = ({ score, color, size = 200, stroke = 14 }) => {
  const r = (size - stroke) / 2, circ = 2 * Math.PI * r, off = circ - (score / 100) * circ;
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={off} style={{ filter: `drop-shadow(0 0 12px ${color}aa)`, transition: "stroke-dashoffset 1.4s ease-out" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 300, fontSize: size * 0.36, lineHeight: 1, color, letterSpacing: "-0.02em" }}>{score}</div>
        <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: C.text3, marginTop: 6 }}>out of 100</div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
// QUESTION BANK
// Each scored question maps to ONE V5 category id. The "biggest_worry"
// question is a separate constraint signal, not a category score.
// ═══════════════════════════════════════════════════════════════════
const QUESTIONS = [
  {
    id: "revenue",
    category: "context",
    question: "What's your approximate annual revenue?",
    subtitle: "We calibrate the diagnostic to businesses your size",
    // Revenue buckets map 1:1 to the four content tiers in constraints-final.js:
    //   under_500k → survival | 500k_1m → stabilize | 1m_3m → growth | 3m_10m → optimize
    options: [
      { label: "Under $500K",          value: "under_500k", score: null },
      { label: "$500K \u2013 $1M",     value: "500k_1m",    score: null },
      { label: "$1M \u2013 $3M",       value: "1m_3m",      score: null },
      { label: "$3M \u2013 $10M",      value: "3m_10m",     score: null },
    ],
  },
  {
    id: "profit_clarity",
    category: "profitability",
    question: "Do you know your gross margin off the top of your head?",
    subtitle: "Not the calculated answer \u2014 the one you'd say right now",
    options: [
      { label: "Yes, I know it to the percentage point",   score: 90 },
      { label: "Roughly, within 5 points",                  score: 70 },
      { label: "I have a ballpark but I'm not confident",   score: 45 },
      { label: "Honestly, no",                              score: 20 },
    ],
  },
  {
    id: "cash_stress",
    category: "cash_flow",
    question: "How often do you worry about making payroll or covering bills?",
    subtitle: "Be honest \u2014 this is the most revealing question",
    options: [
      { label: "Never \u2014 we have 6+ months of runway",       score: 95 },
      { label: "Rarely \u2014 we have 3\u20136 months of cushion", score: 75 },
      { label: "Sometimes \u2014 it's tight but manageable",     score: 50 },
      { label: "Often \u2014 I check the bank account daily",    score: 20 },
    ],
  },
  {
    id: "owner_dependency",
    category: "owner_dependency",
    question: "If you took a 2-week vacation with zero contact, what happens?",
    subtitle: "The ultimate test of whether you own the business or it owns you",
    options: [
      { label: "Business runs smoothly \u2014 team handles everything",   score: 95 },
      { label: "Mostly fine with a few check-ins needed",                   score: 70 },
      { label: "Some problems would pile up, but we'd recover",             score: 45 },
      { label: "It would be a disaster",                                    score: 15 },
    ],
  },
  {
    id: "revenue_quality",
    category: "revenue_quality",
    question: "What percentage of revenue comes from your top customer?",
    subtitle: "Concentration risk is often invisible until it's a crisis",
    options: [
      { label: "Under 10% \u2014 well diversified",         score: 90 },
      { label: "10\u201320%",                               score: 70 },
      { label: "20\u201340%",                               score: 45 },
      { label: "Over 40% \u2014 one customer dominates",    score: 20 },
    ],
  },
  {
    id: "decision_data",
    category: "operational_efficiency",
    question: "When you make a major business decision, what do you base it on?",
    subtitle: "Hiring, pricing, expansion \u2014 the big moves",
    options: [
      { label: "Financial model with scenarios mapped out",   score: 95 },
      { label: "Spreadsheet with basic numbers",              score: 65 },
      { label: "Advice from my accountant or advisor",        score: 50 },
      { label: "Mostly gut feel and experience",              score: 25 },
    ],
  },
  {
    id: "biggest_worry",
    category: "constraint_signal",
    question: "What's the biggest thing keeping you up at night about your business?",
    subtitle: "One choice \u2014 pick the one that hits hardest",
    // Each option maps to a V5 constraint id. This is one of two inputs
    // to constraint determination; the other is the lowest category score.
    options: [
      { label: "I'm profitable but cash is always tight",                            value: "cash_flow",              score: null },
      { label: "I can't step away without everything falling apart",                  value: "owner_dependency",       score: null },
      { label: "I feel like money is leaking somewhere I can't see",                  value: "profitability",          score: null },
      { label: "Too much of my revenue depends on too few customers",                 value: "revenue_quality",        score: null },
      { label: "We're busy but operationally messy \u2014 things slip through",       value: "operational_efficiency", score: null },
      { label: "I want to grow but the business can't scale without breaking",      value: "scalability",             score: null },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════
// SCORING
// ═══════════════════════════════════════════════════════════════════

// Get the score from a single answered question (or null if non-scored).
const getQuestionScore = (questionId, answerValue) => {
  const q = QUESTIONS.find(x => x.id === questionId);
  if (!q) return null;
  const opt = q.options.find(o => (o.value !== undefined ? o.value : o.label) === answerValue);
  return opt && opt.score != null ? opt.score : null;
};

// Build the six-category breakdown.
// Five categories have a direct question signal. Scalability has no
// dedicated question; we derive a defensible preliminary value from
// the owner_dependency and operational_efficiency signals, since
// businesses that are owner-dependent and operationally messy
// are inherently hard to scale.
const buildCategoryScores = (answers) => {
  const sigByCat = {};
  for (const q of QUESTIONS) {
    if (q.category === "context" || q.category === "constraint_signal") continue;
    const s = getQuestionScore(q.id, answers[q.id]);
    if (s != null) sigByCat[q.category] = s;
  }

  // Inferred scalability proxy
  const od = sigByCat.owner_dependency;
  const oe = sigByCat.operational_efficiency;
  if (od != null && oe != null) {
    sigByCat.scalability = Math.max(0, Math.round((od + oe) / 2) - 5);
  } else if (od != null) {
    sigByCat.scalability = Math.max(0, od - 5);
  } else if (oe != null) {
    sigByCat.scalability = Math.max(0, oe - 5);
  } else {
    sigByCat.scalability = 55;
  }

  return CATEGORY_ORDER.map(({ id, label }) => ({
    id,
    name: label,
    score: sigByCat[id] != null ? sigByCat[id] : 60,
    color: CATEGORY_COLOR[id],
  }));
};

// Composite score = average of the six category scores.
const computeComposite = (categories) => {
  if (!categories.length) return 50;
  const sum = categories.reduce((a, c) => a + c.score, 0);
  return Math.round(sum / categories.length);
};

// Decide the #1 constraint by combining the user's stated worry with
// the actual lowest-scoring category. If the lowest score is severe
// (under 30) and disagrees with worry, the data wins. Otherwise the
// worry signal wins, because the user knows what's hurting them.
const determineConstraintId = (answers, categories) => {
  const worryId = answers.biggest_worry;
  const lowest = [...categories].sort((a, b) => a.score - b.score)[0];
  if (worryId && lowest && lowest.id !== worryId && lowest.score < 30) {
    return lowest.id;
  }
  if (worryId) return worryId;
  return lowest ? lowest.id : "cash_flow";
};

// Build the full V5 data object.
const buildResultData = (answers) => {
  const categories = buildCategoryScores(answers);
  const score = computeComposite(categories);
  const constraintId = determineConstraintId(answers, categories);
  // Strip the internal `id` field — V5 only needs name/score/color.
  const cleanCategories = categories.map(({ name, score, color }) => ({ name, score, color }));
  return {
    score,
    constraintId,
    revenue: answers.revenue || "1m_3m",
    categories: cleanCategories,
  };
};

// ═══════════════════════════════════════════════════════════════════
// CONSTRAINT PREVIEW METADATA
// Short, results-page-aligned blurbs for the score reveal screen. The
// full locked copy lives in constraints.js and is rendered by V5 — this
// is just the teaser shown before the email gate.
// ═══════════════════════════════════════════════════════════════════
const CONSTRAINT_PREVIEW = {
  profitability: {
    name: "Profitability & Margins",
    teaser: "You're working hard and the bottom line isn't reflecting it. Margins are leaking somewhere you can't see, and the gap compounds every month it goes unfixed.",
  },
  cash_flow: {
    name: "Cash Flow Fragility",
    teaser: "You may be profitable on paper, but cash isn't where it needs to be when you need it. This is almost always a timing problem, not a profit problem \u2014 and it caps growth before it breaks the business.",
  },
  owner_dependency: {
    name: "Owner Dependency",
    teaser: "The business runs through you. That feels like dedication; it's actually the ceiling. A business that can't function without its owner is worth a fraction of one that can \u2014 and the gap shows up the day you try to step back.",
  },
  revenue_quality: {
    name: "Revenue Quality",
    teaser: "Too much of your revenue sits in too few places. The shape of your revenue is making you cautious in ways that cost you the moves you should be making.",
  },
  operational_efficiency: {
    name: "Operational Efficiency",
    teaser: "Overhead has grown faster than revenue and nobody on the team owns the cost structure. Margin is leaking across line items nobody's watching.",
  },
  scalability: {
    name: "Scalability",
    teaser: "Your business is producing results at its current size — but the systems, people, and processes that got you here won't get you to the next level. Growth will either break something or burn you out unless you build the infrastructure to scale without your direct involvement in every decision.",
  },
};

const HEADSHOT = "data:image/jpeg;base64,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";

// ═══════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════
export default function ConstraintRoadmap() {
  const { mob, tab } = useBp();
  const toolRef = useRef(null);
  const [step, setStep] = useState("intro"); // intro | questions | calculating | result
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [roadmapUrl, setRoadmapUrl] = useState(null);
  const [displayScore, setDisplayScore] = useState(0);
  const [resultData, setResultData] = useState(null);

  // GoDeeper auto-cycling
  const [gdSi, setGdSi] = useState(2);
  const [gdGi, setGdGi] = useState(1);
  useEffect(() => { if (!emailSubmitted) return; const t = setInterval(() => setGdSi(p => (p+1) % GD_SCORE_SCENARIOS.length), 4500); return () => clearInterval(t); }, [emailSubmitted]);
  useEffect(() => { if (!emailSubmitted) return; const t = setInterval(() => setGdGi(p => (p+1) % GD_GAP_SCENARIOS.length), 5200); return () => clearInterval(t); }, [emailSubmitted]);

  const gdSc = GD_SCORE_SCENARIOS[gdSi];
  const gdGs = GD_GAP_SCENARIOS[gdGi];
  const gdEbitda = gdGs.rev*(gdGs.mg/100); const gdBicE = gdGs.rev*(gdGs.bic/100);
  const gdCurV = gdEbitda*gdGs.lm; const gdPotV = gdBicE*gdGs.hm;
  const gdAEbitda = useAnim(gdEbitda); const gdABicE = useAnim(gdBicE);
  const gdACurV = useAnim(gdCurV); const gdAPotV = useAnim(gdPotV);
  const gdAVGap = useAnim(gdPotV-gdCurV); const gdAPGap = useAnim(gdBicE-gdEbitda);
  const gdMaxBar = Math.max(gdPotV, gdCurV) * 1.15;
  const gdAPct = useAnim(gdSc.pct);
  const gdAT = gdSc.scores.reduce((a,b) => a+b, 0);

  const handleAnswer = (questionId, value) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);
    setTimeout(() => {
      if (currentQ < QUESTIONS.length - 1) {
        setCurrentQ(currentQ + 1);
      } else {
        setStep("calculating");
        setTimeout(() => {
          const data = buildResultData(newAnswers);
          setResultData(data);
          setStep("result");
        }, 1800);
      }
    }, 280);
  };

  // Animate composite score on result reveal
  useEffect(() => {
    if (step !== "result" || !resultData) return;
    let s = 0;
    const target = resultData.score;
    const tick = () => {
      s += 1.2;
      setDisplayScore(Math.min(Math.round(s), target));
      if (s < target) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [step, resultData]);

  const constraint = resultData ? CONSTRAINT_PREVIEW[resultData.constraintId] : null;
  const constraintColor = resultData ? CATEGORY_COLOR[resultData.constraintId] : C.gold;

  const scoreColor = displayScore >= 80 ? C.green : displayScore >= 60 ? C.gold : displayScore >= 40 ? C.amber : C.red;
  const scoreLabel = displayScore >= 80 ? "Strong" : displayScore >= 60 ? "Healthy" : displayScore >= 40 ? "At Risk" : "Critical";
  const progress = step === "questions" ? ((currentQ + 1) / QUESTIONS.length) * 100 : step === "intro" ? 0 : 100;

  const handleRestart = () => {
    setStep("intro"); setCurrentQ(0); setAnswers({}); setDisplayScore(0); setResultData(null); setName(""); setEmail(""); setEmailSubmitted(false); setSubmitting(false); setSubmitError("");
  };

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // ─── Email gate: captures name + email, sends to lead-capture API ───
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const generatePdf = async () => {
    setEmailSubmitted(true);
    await new Promise(r => setTimeout(r, 800));
    try {
      const h2c = html2canvas;
      const jp = jsPDF;
      if (!h2c || !jp) return null;
      const el = toolRef.current;
      if (!el) return null;
      const canvas = await h2c(el, { scale: 2, useCORS: true, backgroundColor: "#0A0E14", logging: false, windowWidth: 800 });
      const imgData = canvas.toDataURL("image/jpeg", 0.85);
      const imgW = 210;
      const imgH = (canvas.height * imgW) / canvas.width;
      const pdf = new jp("p", "mm", "a4");
      let pos = 0;
      while (pos < imgH) {
        if (pos > 0) pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, -pos, imgW, imgH);
        pos += 297;
      }
      return pdf.output("datauristring").split(",")[1];
    } catch (err) { console.error("[PDF] Generation failed:", err); return null; }
  };

  const handleEmailSubmit = async () => {
    setSubmitError("");
    if (!name.trim()) {
      setSubmitError("Please enter your name.");
      return;
    }
    if (!email || !EMAIL_REGEX.test(email)) {
      setSubmitError("Please enter a valid email address.");
      return;
    }
    if (!resultData) {
      setSubmitError("Something went wrong. Please refresh and try again.");
      return;
    }

    setSubmitting(true);

    let pdfBase64 = null;
    try { pdfBase64 = await generatePdf(); } catch (err) { console.error("[PDF]", err); }

    const payload = {
      name: name.trim(),
      email: email.trim(),
      tool: "constraint-roadmap",
      toolName: "Constraint Roadmap",
      scores: answers,
      summary: {
        totalScore: resultData.score,
        pct: resultData.score,
        band: scoreLabel,
        constraint: constraint?.name,
        constraintId: resultData.constraintId,
        revenue: resultData.revenue,
        categories: resultData.categories,
      },
      timestamp: new Date().toISOString(),
      pdfBase64,
    };

    try {
      const res = await fetch("/api/lead-capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const responseData = await res.json();
        console.log("[Assessment] API response:", responseData);
        if (responseData.roadmapUrl) {
          setRoadmapUrl(responseData.roadmapUrl);
        }
        setEmailSubmitted(true);
        return;
      }
      console.error("[Assessment] API error:", res.status, await res.text());
      throw new Error("API unavailable");
    } catch (err) {
      console.error("[Virtus] API failed, queuing silent retry:", err.message || err);
      const retryPayload = {...payload, pdfBase64: null};
      const retryFn = async (attempt) => {
        if (attempt > 5) { console.error("[Virtus] All retries exhausted."); return; }
        try {
          const r = await fetch("/api/lead-capture", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(retryPayload) });
          if (r.ok) { console.log("[Virtus] Retry " + attempt + " succeeded"); return; }
          throw new Error("Retry failed");
        } catch (e) { console.error("[Virtus] Retry " + attempt + " failed, next in " + (30 * attempt) + "s"); setTimeout(() => retryFn(attempt + 1), 30000 * attempt); }
      };
      setTimeout(() => retryFn(1), 30000);
      setEmailSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div ref={toolRef} style={{
      background: C.bgDeep, minHeight: "100vh",
      fontFamily: "'DM Sans',sans-serif", color: C.text1,
      position: "relative", overflow: "hidden",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      <div style={{
        position: "fixed", inset: 0, zIndex: 0,
        background: `radial-gradient(ellipse 80% 60% at 25% 85%,#221a08 0%,transparent 55%),
          radial-gradient(ellipse 60% 50% at 75% 15%,#151a30 0%,transparent 55%),
          radial-gradient(ellipse 70% 50% at 50% 50%, rgba(200,162,78,0.04) 0%, transparent 60%),
          linear-gradient(155deg,#070a10 0%,#0c1018 25%,#151208 50%,#0e1220 75%,#090d14 100%)`,
      }} />
      <Grain />

      <div style={{ position: "fixed", top: "20%", left: "5%", width: 500, height: 6, background: `linear-gradient(90deg, transparent, ${C.gold} 50%, transparent)`, filter: "blur(20px)", opacity: 0.1, transform: "rotate(-12deg)", pointerEvents: "none", zIndex: 1 }} />
      <div style={{ position: "fixed", top: "60%", right: "0%", width: 400, height: 6, background: `linear-gradient(90deg, transparent, ${C.gold} 50%, transparent)`, filter: "blur(16px)", opacity: 0.08, transform: "rotate(8deg)", pointerEvents: "none", zIndex: 1 }} />

      {step !== "intro" && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, height: 3, background: "rgba(255,255,255,0.04)" }}>
          <div style={{
            height: "100%", width: `${progress}%`,
            background: `linear-gradient(90deg, ${C.gold}, ${C.goldLight})`,
            boxShadow: `0 0 8px ${C.gold}60`,
            transition: "width 0.5s cubic-bezier(0.4,0,0.2,1)",
          }} />
        </div>
      )}

      <div style={{
        position: "relative", zIndex: 10,
        maxWidth: 620, margin: "0 auto", padding: mob ? "60px 20px 40px" : "80px 40px 60px",
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {/* ═══ INTRO ═══ */}
        {step === "intro" && (
          <div style={{ textAlign: "center", width: "100%" }}>
            <div style={{ marginBottom: 20, display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 100, border: `1px solid ${C.gold}25`, background: `${C.gold}08` }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.gold, boxShadow: `0 0 6px ${C.gold}60` }} />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: C.gold, textTransform: "uppercase" }}>Free Constraint Roadmap</span>
            </div>
            <h1 style={{
              fontFamily: "'Cormorant Garamond',serif", fontSize: mob ? 38 : tab ? 48 : 58,
              fontWeight: 700, color: C.text1, lineHeight: 1.05, margin: "0 0 18px",
              textTransform: "uppercase",
              textShadow: "0 2px 20px rgba(0,0,0,0.5)",
            }}>
              Find your <span style={{ color: C.gold, textShadow: `0 0 30px ${C.gold}30` }}>#1 constraint</span><br/>in 90 seconds.
            </h1>
            <p style={{ fontSize: mob ? 15 : 17, color: C.text2, lineHeight: 1.6, margin: "0 auto 36px", maxWidth: 520 }}>
              7 quick questions. Get your health score and the single biggest thing holding your business back. No email required to start.
            </p>
            <button onClick={() => setStep("questions")}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 0 48px ${C.gold}40, 0 4px 20px rgba(0,0,0,0.35)`; e.currentTarget.style.borderColor = `${C.gold}80`; e.currentTarget.style.background = `linear-gradient(135deg, ${C.gold}25, ${C.gold}15)`; const a = e.currentTarget.querySelector("[data-intro-arrow]"); if(a) a.style.opacity="1"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = `0 0 24px ${C.gold}20, 0 4px 12px rgba(0,0,0,0.3)`; e.currentTarget.style.borderColor = `${C.gold}50`; e.currentTarget.style.background = `linear-gradient(135deg, ${C.gold}18, ${C.gold}0a)`; const a = e.currentTarget.querySelector("[data-intro-arrow]"); if(a) a.style.opacity="0"; }}
              style={{
                background: `linear-gradient(135deg, ${C.gold}18, ${C.gold}0a)`,
                color: C.gold, fontFamily: "'DM Sans',sans-serif", fontWeight: 700,
                fontSize: 16, letterSpacing: "0.02em",
                padding: "16px 48px", borderRadius: 12,
                border: `1.5px solid ${C.gold}50`, cursor: "pointer",
                boxShadow: `0 0 24px ${C.gold}20, 0 4px 12px rgba(0,0,0,0.3)`,
                transition: "all 0.3s ease", position: "relative", overflow: "hidden",
              }}>
              <span style={{ position: "absolute", top: "-50%", left: "-50%", right: "-50%", bottom: "-50%", pointerEvents: "none", background: `linear-gradient(120deg, transparent 0%, transparent 40%, ${C.gold}12 48%, ${C.gold}20 50%, ${C.gold}12 52%, transparent 60%, transparent 100%)`, backgroundSize: "200% 200%", animation: "btnShimmer 6s ease-in-out infinite" }}/>
              <span style={{ position: "relative", zIndex: 1 }}>Start Assessment</span>
              <svg data-intro-arrow="" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ position: "absolute", right: 20, top: "50%", marginTop: -8, opacity: 0, transition: "all 0.25s ease" }}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
            <div style={{ marginTop: 24, display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
              {["90 seconds", "7 questions", "Confidential"].map((t, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                    <polyline points="4 12 10 18 20 6" stroke={C.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span style={{ fontSize: 12, color: C.text3 }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ QUESTIONS ═══ */}
        {step === "questions" && QUESTIONS[currentQ] && (
          <div style={{ width: "100%" }}>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: C.gold, textTransform: "uppercase" }}>
                Question {currentQ + 1} of {QUESTIONS.length}
              </span>
            </div>

            <Glass glow={C.gold} style={{ padding: mob ? "28px 22px" : "36px 36px" }}>
              <div style={{ position: "absolute", top: 0, left: "10%", width: "80%", height: 3, background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`, opacity: 0.5 }} />

              <h2 style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontSize: mob ? 22 : 28,
                fontWeight: 700, color: C.text1, lineHeight: 1.2,
                margin: "0 0 8px",
              }}>
                {QUESTIONS[currentQ].question}
              </h2>
              {QUESTIONS[currentQ].subtitle && (
                <p style={{ fontSize: 13, color: C.text3, margin: "0 0 22px", lineHeight: 1.5, fontStyle: "italic" }}>
                  {QUESTIONS[currentQ].subtitle}
                </p>
              )}

              <div style={{ display: "grid", gap: 10 }}>
                {QUESTIONS[currentQ].options.map((opt, i) => {
                  const optValue = opt.value !== undefined ? opt.value : opt.label;
                  const isSelected = answers[QUESTIONS[currentQ].id] === optValue;
                  return (
                    <button
                      key={i}
                      onClick={() => handleAnswer(QUESTIONS[currentQ].id, optValue)}
                      style={{
                        display: "flex", alignItems: "center", gap: 12,
                        padding: mob ? "14px 14px" : "16px 18px",
                        borderRadius: 12,
                        background: isSelected ? `${C.gold}12` : "rgba(255,255,255,0.02)",
                        border: `1px solid ${isSelected ? `${C.gold}40` : C.border1}`,
                        cursor: "pointer",
                        transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)",
                        textAlign: "left",
                        fontFamily: "'DM Sans',sans-serif",
                      }}
                      onMouseEnter={e => {
                        if (!isSelected) {
                          e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                          e.currentTarget.style.border = `1px solid ${C.gold}25`;
                          e.currentTarget.style.transform = "translateX(4px)";
                        }
                      }}
                      onMouseLeave={e => {
                        if (!isSelected) {
                          e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                          e.currentTarget.style.border = `1px solid ${C.border1}`;
                          e.currentTarget.style.transform = "none";
                        }
                      }}
                    >
                      <div style={{
                        width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                        border: `1.5px solid ${isSelected ? C.gold : C.text3}`,
                        background: isSelected ? C.gold : "transparent",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "all 0.2s",
                      }}>
                        {isSelected && (
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M2 5L4 7L8 3" stroke="#0A0E14" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <span style={{ fontSize: 14, color: isSelected ? C.text1 : C.text2, fontWeight: isSelected ? 600 : 400, flex: 1 }}>
                        {opt.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {currentQ > 0 && (
                <button onClick={() => setCurrentQ(currentQ - 1)} style={{
                  marginTop: 18, fontSize: 12, color: C.text3, background: "none", border: "none",
                  cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontFamily: "inherit",
                }}>
                  ← Previous question
                </button>
              )}
            </Glass>
          </div>
        )}

        {/* ═══ CALCULATING ═══ */}
        {step === "calculating" && (
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 60, height: 60, borderRadius: "50%", border: `3px solid ${C.gold}20`, borderTopColor: C.gold, margin: "0 auto 20px", animation: "spin 1s linear infinite" }} />
            <p style={{ fontSize: 15, color: C.text2, margin: 0 }}>Analyzing your business...</p>
            <p style={{ fontSize: 12, color: C.text4, margin: "6px 0 0" }}>Calculating across 6 categories</p>
          </div>
        )}

        {/* ═══ RESULT ═══ */}
        {step === "result" && resultData && constraint && (
          <div style={{ width: "100%" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 24 }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: C.gold, textTransform: "uppercase", marginBottom: 14 }}>Your Preliminary Health Score</span>
              <ScoreRing score={displayScore} color={scoreColor} size={mob ? 160 : 190} stroke={mob ? 11 : 13} />
              <div style={{ marginTop: 12, padding: "4px 14px", borderRadius: 6, background: `${scoreColor}12`, border: `1px solid ${scoreColor}25` }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: scoreColor, letterSpacing: 1, textTransform: "uppercase" }}>{scoreLabel}</span>
              </div>
            </div>

            {/* Constraint card */}
            <Glass glow={constraintColor} style={{ padding: mob ? "22px 20px" : "26px 26px", marginBottom: 16 }}>
              <div style={{ position: "absolute", top: 0, left: "10%", width: "80%", height: 3, background: `linear-gradient(90deg, transparent, ${constraintColor}, transparent)` }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: constraintColor, textTransform: "uppercase" }}>Your #1 Constraint</span>
              <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: mob ? 24 : 30, fontWeight: 700, color: C.text1, margin: "4px 0 10px", textShadow: `0 0 20px ${constraintColor}20` }}>
                {constraint.name}
              </h3>
              <p style={{ fontSize: 14, color: C.text2, lineHeight: 1.6, margin: "0 0 12px" }}>
                {constraint.teaser}
              </p>
              <div style={{ padding: "10px 14px", borderRadius: 8, background: `${constraintColor}08`, border: `1px solid ${constraintColor}15` }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: constraintColor, textTransform: "uppercase", letterSpacing: 0.8 }}>The full Constraint Roadmap: </span>
                <span style={{ fontSize: 12.5, color: C.text2 }}>tier-specific root causes, three actions to take this week, and your benchmark position — unlocked after entering your name and email below.</span>
              </div>
            </Glass>

            {/* Email gate */}
            {!emailSubmitted ? (
              <Glass glow={C.gold} style={{ padding: mob ? "22px 20px" : "26px 26px" }}>
                <div style={{ position: "absolute", top: 0, left: "10%", width: "80%", height: 3, background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)` }} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: C.gold, textTransform: "uppercase" }}>Your Results Are Ready</span>
                <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: mob ? 20 : 24, fontWeight: 700, color: C.text1, margin: "6px 0 10px", lineHeight: 1.2 }}>
                  Get your full Constraint Roadmap.
                </h3>
                <p style={{ fontSize: 13, color: C.text2, margin: "0 0 16px", lineHeight: 1.55 }}>
                  Enter your name and email to unlock your personalized roadmap — including your category breakdown, constraint analysis, and recommended next steps. We'll also email you a PDF copy.
                </p>

                {/* Selective blur preview of Constraint Roadmap sections */}
                <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", marginBottom: 18, border: `1px solid ${C.border1}`, background: "rgba(255,255,255,0.015)" }}>
                  <div style={{ padding: "16px 18px" }}>
                    {/* Preview: Category Breakdown — headings + bars visible, category NAMES blurred */}
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.5, color: C.gold, textTransform: "uppercase", marginBottom: 8 }}>Category Breakdown</div>
                      {["Profitability", "Cash Flow", "Revenue Quality", "Owner Dependency", "Operational Efficiency", "Scalability"].map((cat, i) => {
                        const colors = [C.gold, C.green, C.gold, C.amber, C.amber, C.cyan];
                        const widths = [72, 58, 65, 41, 53, 47];
                        return (
                          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                            <div style={{ width: 80, flexShrink: 0, fontSize: 8, color: C.text3, filter: "blur(4px)", WebkitFilter: "blur(4px)", userSelect: "none" }}>{cat}</div>
                            <div style={{ flex: 1, height: 6, borderRadius: 3, background: "rgba(255,255,255,0.04)", overflow: "hidden", position: "relative" }}>
                              <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: `${widths[i]}%`, borderRadius: 3, background: `linear-gradient(180deg, ${colors[i]}30, ${colors[i]}15)`, border: `0.5px solid ${colors[i]}`, boxShadow: `0 0 6px ${colors[i]}20, inset 0 1px 0 ${colors[i]}15` }}/>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {/* Preview: Constraint Analysis — heading visible, name + content blurred */}
                    <div style={{ padding: "10px 12px", borderRadius: 8, background: `${C.amber}06`, border: `1px solid ${C.amber}12`, marginBottom: 10 }}>
                      <div style={{ fontSize: 8, fontWeight: 700, color: C.amber, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Your #1 Constraint</div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: C.text2, filter: "blur(4px)", WebkitFilter: "blur(4px)", userSelect: "none" }}>Owner Dependency</div>
                      <div style={{ fontSize: 8, color: C.text3, marginTop: 2, lineHeight: 1.4, filter: "blur(4px)", WebkitFilter: "blur(4px)", userSelect: "none" }}>Root cause analysis and recommended actions for your specific constraint...</div>
                    </div>
                    {/* Preview: Action Steps — heading visible, bullet points blurred */}
                    <div>
                      <div style={{ fontSize: 8, fontWeight: 700, color: C.gold, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>Recommended Next Steps</div>
                      {["Identify the 3 decisions only you can make", "Document your top 5 recurring processes", "Delegate one client relationship this week"].map((s, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                          <div style={{ width: 4, height: 4, borderRadius: "50%", background: C.gold, flexShrink: 0 }}/>
                          <div style={{ fontSize: 8, color: C.text3, filter: "blur(4px)", WebkitFilter: "blur(4px)", userSelect: "none" }}>{s}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Pulsing lock overlay — no full blur, just centered pill */}
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 16px", borderRadius: 8, background: `${C.gold}20`, border: `1px solid ${C.gold}40`, boxShadow: `0 0 20px ${C.gold}20`, animation: "lockPulse 2.5s ease-in-out infinite" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                      <span style={{ fontSize: 10, fontWeight: 700, color: C.gold, letterSpacing: 0.5 }}>Unlock your full results below</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: "grid", gap: 6, marginBottom: 18 }}>
                  {[
                    "Your health score across 6 business categories",
                    "Your #1 constraint with specific root cause analysis",
                    "Recommended next steps personalized to your business",
                    "A PDF copy of your results emailed to you",
                  ].map((t, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, filter: `drop-shadow(0 0 3px ${C.gold}50)` }}>
                        <path d="M3 7L6 10L11 4" stroke={C.gold} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span style={{ fontSize: 13, color: C.text2 }}>{t}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 8, flexDirection: "column" }}>
                  <input
                    type="text"
                    placeholder="Full name"
                    value={name}
                    onChange={e => { setName(e.target.value); if (submitError) setSubmitError(""); }}
                    disabled={submitting}
                    style={{
                      padding: "14px 16px", borderRadius: 10,
                      background: C.bgDeep, border: `1px solid ${C.border2}`,
                      color: C.text1, fontSize: 14, fontFamily: "inherit",
                      outline: "none", transition: "all 0.2s",
                      opacity: submitting ? 0.6 : 1,
                    }}
                    onFocus={e => e.target.style.borderColor = `${C.gold}40`}
                    onBlur={e => e.target.style.borderColor = C.border2}
                  />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={e => { setEmail(e.target.value); if (submitError) setSubmitError(""); }}
                    onKeyDown={e => e.key === "Enter" && !submitting && handleEmailSubmit()}
                    disabled={submitting}
                    style={{
                      padding: "14px 16px", borderRadius: 10,
                      background: C.bgDeep, border: `1px solid ${submitError ? C.red + "60" : C.border2}`,
                      color: C.text1, fontSize: 14, fontFamily: "inherit",
                      outline: "none", transition: "all 0.2s",
                      opacity: submitting ? 0.6 : 1,
                    }}
                    onFocus={e => { if (!submitError) e.target.style.borderColor = `${C.gold}40`; }}
                    onBlur={e => { if (!submitError) e.target.style.borderColor = C.border2; }}
                  />
                  <button
                    onClick={handleEmailSubmit}
                    disabled={submitting}
                    onMouseEnter={e => { if (!submitting) { e.currentTarget.style.boxShadow = `0 0 48px ${C.gold}40, 0 4px 20px rgba(0,0,0,0.35)`; e.currentTarget.style.borderColor = `${C.gold}80`; e.currentTarget.style.background = `linear-gradient(135deg, ${C.gold}25, ${C.gold}15)`; const a = e.currentTarget.querySelector("[data-gate-arrow]"); if(a){ a.style.opacity="1"; a.style.transform="translateX(3px)"; } } }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = `0 0 20px ${C.gold}20, 0 4px 12px rgba(0,0,0,0.3)`; e.currentTarget.style.borderColor = `${C.gold}50`; e.currentTarget.style.background = `linear-gradient(135deg, ${C.gold}18, ${C.gold}0a)`; const a = e.currentTarget.querySelector("[data-gate-arrow]"); if(a){ a.style.opacity="0"; a.style.transform="translateX(0)"; } }}
                    style={{
                      padding: "16px 24px", borderRadius: 12,
                      border: `1.5px solid ${C.gold}50`,
                      cursor: submitting ? "not-allowed" : "pointer",
                      fontWeight: 700, fontSize: 15, letterSpacing: "0.02em",
                      color: C.gold,
                      background: `linear-gradient(135deg, ${C.gold}18, ${C.gold}0a)`,
                      boxShadow: `0 0 20px ${C.gold}20, 0 4px 12px rgba(0,0,0,0.3)`,
                      fontFamily: "inherit", position: "relative", overflow: "hidden",
                      transition: "all 0.3s ease",
                      opacity: submitting ? 0.7 : 1,
                      display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
                    }}
                  >
                    <span style={{ position: "absolute", top: "-50%", left: "-50%", right: "-50%", bottom: "-50%", pointerEvents: "none", background: `linear-gradient(120deg, transparent 0%, transparent 40%, ${C.gold}12 48%, ${C.gold}20 50%, ${C.gold}12 52%, transparent 60%, transparent 100%)`, backgroundSize: "200% 200%", animation: "btnShimmer 6s ease-in-out infinite" }}/>
                    <span style={{ position: "relative", zIndex: 1, display: "inline-flex", alignItems: "center", gap: 8 }}>
                      {submitting ? "Generating your report..." : "See My Results"}
                      {!submitting && <svg data-gate-arrow="" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0, transition: "all 0.25s ease" }}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>}
                    </span>
                  </button>
                </div>
                {submitError && (
                  <p style={{ fontSize: 12, color: C.red, margin: "10px 0 0", textAlign: "center", fontWeight: 500 }}>
                    {submitError}
                  </p>
                )}
                <p style={{ fontSize: 11, color: C.text4, margin: "10px 0 0", textAlign: "center" }}>
                  We won't sell your data — we want to send you your personalized results so you have a permanent copy.
                </p>
              </Glass>
            ) : (
              <>
                {/* Category Breakdown — visible after email submission */}
                <Glass style={{ padding: mob ? "20px 18px" : "24px 24px", marginBottom: 16 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: C.gold, textTransform: "uppercase" }}>Category Breakdown</span>
                  <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
                    {resultData.categories.map((cat, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 90, flexShrink: 0, fontSize: 11, fontWeight: 600, color: C.text2 }}>{cat.name}</div>
                        <div style={{ flex: 1, height: 8, borderRadius: 4, background: "rgba(255,255,255,0.04)", overflow: "hidden", position: "relative" }}>
                          <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: `${cat.score}%`, borderRadius: 4, background: `linear-gradient(180deg, ${cat.color}30, ${cat.color}15)`, border: `0.5px solid ${cat.color}`, boxShadow: `0 0 6px ${cat.color}20, inset 0 1px 0 ${cat.color}15`, transition: "width 1s ease-out" }}/>
                        </div>
                        <div style={{ width: 32, textAlign: "right", fontSize: 12, fontWeight: 700, color: cat.color }}>{cat.score}</div>
                      </div>
                    ))}
                  </div>
                </Glass>

                {/* Confirmation */}
                <Glass glow={C.green} style={{ padding: mob ? "18px 18px" : "22px 22px", textAlign: "center", marginBottom: 16 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: `${C.green}12`, border: `1.5px solid ${C.green}30`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>
                    <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
                      <path d="M5 11L9 15L17 7" stroke={C.green} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <p style={{ fontSize: 13, color: C.text2, margin: 0, lineHeight: 1.5 }}>
                    Your results have been sent to <span style={{ color: C.text1, fontWeight: 600 }}>{email}</span>
                  </p>
                </Glass>

                {roadmapUrl && (
                  <div style={{ textAlign: "center", marginBottom: 16 }}>
                    <a href={roadmapUrl} target="_blank" rel="noopener noreferrer"
                      style={{
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                        gap: 10, padding: "16px 40px", borderRadius: 14, textDecoration: "none",
                        border: `1.5px solid rgba(200,162,78,0.5)`, color: C.gold, fontWeight: 700,
                        fontSize: 15, letterSpacing: "0.02em",
                        background: "linear-gradient(135deg, rgba(200,162,78,0.15), rgba(200,162,78,0.05))",
                        boxShadow: "0 0 24px rgba(200,162,78,0.2), 0 4px 16px rgba(0,0,0,0.3)",
                        fontFamily: "'DM Sans', sans-serif", position: "relative", overflow: "hidden",
                        transition: "all 0.3s ease",
                      }}>
                      <span style={{
                        position: "absolute", top: "-50%", left: "-50%", right: "-50%", bottom: "-50%",
                        pointerEvents: "none",
                        background: "linear-gradient(120deg, transparent 0%, transparent 40%, rgba(200,162,78,0.08) 48%, rgba(200,162,78,0.15) 50%, rgba(200,162,78,0.08) 52%, transparent 60%, transparent 100%)",
                        backgroundSize: "200% 200%", animation: "btnShimmer 6s ease-in-out infinite",
                      }} />
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: "relative", zIndex: 1, flexShrink: 0 }}>
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10 9 9 9 8 9" />
                      </svg>
                      <span style={{ position: "relative", zIndex: 1 }}>View Your Personalized Roadmap</span>
                    </a>
                  </div>
                )}

                {/* Go Deeper — dynamic tool previews (breaks out of narrow container) */}
                <div style={{ marginBottom: 16, marginTop: 8, position: "relative", left: "50%", transform: "translateX(-50%)", width: "min(1200px, 92vw)", padding: mob ? "0 16px" : "0 40px", boxSizing: "border-box" }}>
                  <div style={{ textAlign: "center", marginBottom: 20 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: C.gold, textTransform: "uppercase" }}>Free Diagnostic Tools</span>
                    <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: mob ? 24 : 32, fontWeight: 700, color: C.text1, margin: "6px 0 10px", textTransform: "uppercase" }}>
                      Go deeper. <span style={{ color: C.gold }}>For free.</span>
                    </h3>
                    <p style={{ fontSize: 13, color: C.text2, maxWidth: 480, margin: "0 auto", lineHeight: 1.55 }}>
                      See how the scoring works, explore your Profit and Value Gaps, and discover the specific drivers that determine what your business is actually worth.
                    </p>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: mob ? 18 : 24, marginBottom: 20 }}>
                    {/* SCORING PREVIEW — auto-cycling */}
                    <div style={{ padding: mob ? 20 : 28, borderRadius: 18, background: "linear-gradient(160deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 100%)", border: `1.5px solid ${C.cyan}20`, boxShadow: `0 6px 30px rgba(0,0,0,0.25), 0 0 40px ${C.cyan}05`, position: "relative", overflow: "hidden" }}>
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 30%, transparent 50%, transparent 70%, rgba(255,255,255,0.03) 100%)", pointerEvents: "none" }}/>
                      <div style={{ position: "absolute", top: 0, left: "10%", width: "80%", height: 1.5, background: `linear-gradient(90deg, transparent, ${C.cyan}40, transparent)` }}/>
                      <div style={{ position: "relative", zIndex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                          <div>
                            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: mob ? 9 : 10, color: C.cyan, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: 3 }}>Opportunities for Improvement in Your Business</div>
                            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: mob ? 16 : 20, fontWeight: 700, color: C.text1 }}>Business Attractiveness & Readiness</div>
                          </div>
                          <div style={{ padding: "5px 18px", borderRadius: 8, background: `${C.green}12`, border: `1px solid ${C.green}35` }}>
                            <span style={{ fontSize: 11, fontWeight: 700, color: C.green, letterSpacing: "0.08em" }}>FREE</span>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 4, marginBottom: 14 }}>
                          {GD_SCORE_SCENARIOS.map((s,i) => (
                            <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: gdSi===i ? s.bandColor : "rgba(255,255,255,0.06)", transition: "background 0.4s ease" }}/>
                          ))}
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                          <div>
                            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: C.cyan, marginBottom: 6 }}>Business Attractiveness</div>
                            {GD_DIMS_A.map((d,j) => { const s=gdSc.scores[j]; const col=gdScCol(s); return (
                              <div key={d} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                                <span style={{ fontSize: 10, color: C.text3, width: 95, textAlign: "right", flexShrink: 0 }}>{d}</span>
                                <div style={{ flex: 1, height: 10, borderRadius: 5, background: "rgba(255,255,255,0.04)", overflow: "hidden", position: "relative" }}>
                                  <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: `${(s/6)*100}%`, borderRadius: 5, background: `linear-gradient(180deg, ${col}30, ${col}15)`, border: `0.5px solid ${col}`, boxShadow: `0 0 6px ${col}20, inset 0 1px 0 ${col}15`, transition: "all 1s cubic-bezier(0.4,0,0.2,1)" }}/>
                                </div>
                                <span style={{ fontSize: 11, fontWeight: 700, color: col, width: 14, textAlign: "center", transition: "color 1s" }}>{s}</span>
                              </div>
                            );})}
                          </div>
                          <div>
                            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: C.gold, marginBottom: 6 }}>Business Readiness</div>
                            {GD_DIMS_R.map((d,j) => { const s=gdSc.scores[j+5]; const col=gdScCol(s); return (
                              <div key={d} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                                <span style={{ fontSize: 10, color: C.text3, width: 95, textAlign: "right", flexShrink: 0 }}>{d}</span>
                                <div style={{ flex: 1, height: 10, borderRadius: 5, background: "rgba(255,255,255,0.04)", overflow: "hidden", position: "relative" }}>
                                  <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: `${(s/6)*100}%`, borderRadius: 5, background: `linear-gradient(180deg, ${col}30, ${col}15)`, border: `0.5px solid ${col}`, boxShadow: `0 0 6px ${col}20, inset 0 1px 0 ${col}15`, transition: "all 1s cubic-bezier(0.4,0,0.2,1)" }}/>
                                </div>
                                <span style={{ fontSize: 11, fontWeight: 700, color: col, width: 14, textAlign: "center", transition: "color 1s" }}>{s}</span>
                              </div>
                            );})}
                          </div>
                        </div>
                        <div style={{ padding: "10px 0 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                            <div>
                              <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: C.text4 }}>Combined </span>
                              <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 700, color: C.text1 }}>{gdAT}</span>
                              <span style={{ fontSize: 11, color: C.text4 }}>/60</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <span style={{ fontSize: 11, fontWeight: 700, color: gdSc.bandColor, transition: "color 0.6s" }}>{gdSc.label}</span>
                              <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, fontWeight: 700, color: gdSc.bandColor, transition: "color 0.6s" }}>{Math.round(gdAPct)}%</span>
                            </div>
                          </div>
                          <div style={{ position: "relative", height: 8, borderRadius: 4, background: "linear-gradient(90deg, #F87171, #FBBF24, #D4A63E, #22D3EE, #34D399)", overflow: "visible", marginBottom: 10 }}>
                            <div style={{ position: "absolute", top: -4, width: 16, height: 16, borderRadius: "50%", background: gdSc.bandColor, border: "2.5px solid white", boxShadow: `0 0 10px ${gdSc.bandColor}80`, left: `${gdSc.pct}%`, transform: "translateX(-50%)", transition: "left 0.8s cubic-bezier(0.4,0,0.2,1), background 0.6s" }}/>
                          </div>
                          <div style={{ display: "flex", gap: 4 }}>
                            {GD_BANDS.map((b,i) => (
                              <div key={i} style={{ flex: 1, textAlign: "center", padding: "6px 3px", borderRadius: 5, background: gdSi===i ? `${b.color}12` : "rgba(255,255,255,0.02)", border: `1px solid ${gdSi===i ? b.color+"30" : "rgba(255,255,255,0.04)"}`, transition: "all 0.6s" }}>
                                <div style={{ fontSize: 9, fontWeight: 600, color: gdSi===i ? b.color : C.text4, transition: "color 0.6s" }}>{b.label}</div>
                                <div style={{ fontSize: 10, fontWeight: 700, color: gdSi===i ? b.color : C.text4, transition: "color 0.6s" }}>{b.mult}</div>
                              </div>
                            ))}
                          </div>
                          <p style={{ fontSize: 10, color: C.text4, fontStyle: "italic", margin: 0, paddingTop: 10, lineHeight: 1.4, textAlign: "center" }}>Multiple ranges vary by industry, revenue, growth rate, and risk profile. For educational and illustrative purposes only.</p>
                        </div>
                      </div>
                    </div>

                    {/* VALUE GAP PREVIEW — auto-cycling */}
                    <div style={{ padding: mob ? 20 : 28, borderRadius: 18, background: "linear-gradient(160deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 100%)", border: `1.5px solid ${C.gold}20`, boxShadow: `0 6px 30px rgba(0,0,0,0.25), 0 0 40px ${C.gold}05`, position: "relative", overflow: "hidden" }}>
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 30%, transparent 50%, transparent 70%, rgba(255,255,255,0.03) 100%)", pointerEvents: "none" }}/>
                      <div style={{ position: "absolute", top: 0, left: "10%", width: "80%", height: 1.5, background: `linear-gradient(90deg, transparent, ${C.gold}40, transparent)` }}/>
                      <div style={{ position: "relative", zIndex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                          <div>
                            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: mob ? 9 : 10, color: C.gold, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: 3 }}>See The Gaps</div>
                            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: mob ? 16 : 20, fontWeight: 700, color: C.text1 }}>Profit & Value Gaps</div>
                          </div>
                          <div style={{ padding: "5px 18px", borderRadius: 8, background: `${C.green}12`, border: `1px solid ${C.green}35` }}>
                            <span style={{ fontSize: 11, fontWeight: 700, color: C.green, letterSpacing: "0.08em" }}>FREE</span>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 4, marginBottom: 14 }}>
                          {GD_GAP_SCENARIOS.map((_,i) => (
                            <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: gdGi===i ? C.gold : "rgba(255,255,255,0.06)", transition: "background 0.4s" }}/>
                          ))}
                        </div>
                        <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
                          <div style={{ flex: 1, textAlign: "center", padding: "10px 8px", borderRadius: 10, background: `${C.amber}06`, border: `1px solid ${C.amber}12` }}>
                            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: C.amber, marginBottom: 3 }}>Your EBITDA</div>
                            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, fontWeight: 700, color: C.text1 }}>{gdFmt(Math.round(gdAEbitda))}</div>
                          </div>
                          <div style={{ display: "flex", alignItems: "center" }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                          </div>
                          <div style={{ flex: 1, textAlign: "center", padding: "10px 8px", borderRadius: 10, background: `${C.green}06`, border: `1px solid ${C.green}12` }}>
                            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: C.green, marginBottom: 3 }}>Best-In-Class</div>
                            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, fontWeight: 700, color: C.text1 }}>{gdFmt(Math.round(gdABicE))}</div>
                          </div>
                        </div>
                        <div style={{ padding: "12px 14px", borderRadius: 10, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", marginBottom: 14 }}>
                          {[{ label: "Current Value", val: gdACurV, color: C.red }, { label: "Potential Value", val: gdAPotV, color: C.green }].map((r,i) => (
                            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: i===0 ? 8 : 0 }}>
                              <span style={{ fontSize: 10, color: C.text2, width: 80, textAlign: "right", flexShrink: 0 }}>{r.label}</span>
                              <div style={{ flex: 1, height: 14, borderRadius: 7, background: "rgba(255,255,255,0.04)", overflow: "hidden" }}>
                                <div style={{ height: "100%", width: `${Math.max((r.val/gdMaxBar)*100, 1)}%`, borderRadius: 7, background: `linear-gradient(180deg, ${r.color}30, ${r.color}15)`, border: `0.5px solid ${r.color}`, boxShadow: `0 0 8px ${r.color}20, inset 0 1px 0 ${r.color}15`, transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)" }}/>
                              </div>
                              <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 16, fontWeight: 700, color: r.color, width: 55, textAlign: "right" }}>{gdFmt(Math.round(r.val))}</span>
                            </div>
                          ))}
                        </div>
                        <div style={{ display: "flex", gap: 10 }}>
                          <div style={{ flex: 1, textAlign: "center", padding: "10px 10px", borderRadius: 10, background: `${C.gold}06`, border: `1px solid ${C.gold}12` }}>
                            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: C.gold, marginBottom: 3 }}>Value Gap</div>
                            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, fontWeight: 700, color: C.gold, marginBottom: 4 }}>{gdFmt(Math.round(gdAVGap))}</div>
                            <p style={{ fontSize: 8, color: C.text3, lineHeight: 1.35, margin: 0 }}>The difference between what your business is worth today vs what it could be worth</p>
                          </div>
                          <div style={{ flex: 1, textAlign: "center", padding: "10px 10px", borderRadius: 10, background: `${C.cyan}06`, border: `1px solid ${C.cyan}12` }}>
                            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: C.cyan, marginBottom: 3 }}>Profit Gap</div>
                            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, fontWeight: 700, color: C.cyan, marginBottom: 4 }}>{gdFmt(Math.round(gdAPGap))}<span style={{ fontSize: 12 }}>/yr</span></div>
                            <p style={{ fontSize: 8, color: C.text3, lineHeight: 1.35, margin: 0 }}>How much profit you are leaving on the table each year</p>
                          </div>
                        </div>
                        <p style={{ fontSize: 10, color: C.text4, fontStyle: "italic", margin: 0, paddingTop: 10, lineHeight: 1.4, textAlign: "center" }}>Illustrative examples for educational purposes only. Actual gaps depend on your business, industry, and execution.</p>
                      </div>
                    </div>
                  </div>

                  {/* CTA buttons */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                    <a href="/tools"
                      onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 0 48px ${C.gold}40, 0 4px 20px rgba(0,0,0,0.35)`; e.currentTarget.style.borderColor = `${C.gold}80`; e.currentTarget.style.background = `linear-gradient(135deg, ${C.gold}25, ${C.gold}15)`; const a = e.currentTarget.querySelector("[data-cta-arrow-gold]"); if(a) a.style.opacity="1"; }}
                      onMouseLeave={e => { e.currentTarget.style.boxShadow = `0 0 24px ${C.gold}20, 0 4px 12px rgba(0,0,0,0.3)`; e.currentTarget.style.borderColor = `${C.gold}50`; e.currentTarget.style.background = `linear-gradient(135deg, ${C.gold}18, ${C.gold}0a)`; const a = e.currentTarget.querySelector("[data-cta-arrow-gold]"); if(a) a.style.opacity="0"; }}
                      style={{
                        display: "inline-flex", alignItems: "center", padding: "14px 48px", borderRadius: 12, textDecoration: "none",
                        border: `1.5px solid ${C.gold}50`, color: C.gold, fontWeight: 700, fontSize: 15,
                        background: `linear-gradient(135deg, ${C.gold}18, ${C.gold}0a)`,
                        boxShadow: `0 0 24px ${C.gold}20, 0 4px 12px rgba(0,0,0,0.3)`,
                        fontFamily: "'DM Sans',sans-serif", transition: "all 0.3s ease", position: "relative", overflow: "hidden",
                      }}>
                      <span style={{ position: "absolute", top: "-50%", left: "-50%", right: "-50%", bottom: "-50%", pointerEvents: "none", background: `linear-gradient(120deg, transparent 0%, transparent 40%, ${C.gold}12 48%, ${C.gold}20 50%, ${C.gold}12 52%, transparent 60%, transparent 100%)`, backgroundSize: "200% 200%", animation: "btnShimmer 6s ease-in-out infinite" }}/>
                      <span style={{ position: "relative", zIndex: 1 }}>Explore Free Tools</span>
                      <svg data-cta-arrow-gold="" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ position: "absolute", right: 18, top: "50%", marginTop: -8, opacity: 0, transition: "all 0.25s ease" }}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                    </a>
                    <a href="https://www.kriczkyvirtus.com/free-session" target="_blank" rel="noopener noreferrer"
                      onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 0 40px ${C.cyan}30`; e.currentTarget.style.borderColor = `${C.cyan}80`; e.currentTarget.style.background = `linear-gradient(135deg, ${C.cyan}18, ${C.cyan}08)`; const a = e.currentTarget.querySelector("[data-cta-arrow-cyan]"); if(a) a.style.opacity="1"; }}
                      onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = `${C.cyan}40`; e.currentTarget.style.background = "transparent"; const a = e.currentTarget.querySelector("[data-cta-arrow-cyan]"); if(a) a.style.opacity="0"; }}
                      style={{
                        display: "inline-flex", alignItems: "center", padding: "10px 40px", borderRadius: 10, textDecoration: "none",
                        border: `1px solid ${C.cyan}40`, color: C.cyan, fontWeight: 600, fontSize: 12,
                        background: "transparent",
                        fontFamily: "'DM Sans',sans-serif", transition: "all 0.3s ease", position: "relative",
                      }}>
                      <span style={{ position: "relative", zIndex: 1 }}>Ready for hands-on help? Book a free working session</span>
                      <svg data-cta-arrow-cyan="" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.cyan} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ position: "absolute", right: 12, top: "50%", marginTop: -7, opacity: 0, transition: "all 0.25s ease" }}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                    </a>
                  </div>
                </div>

                {/* Closing quote */}
                <div style={{ textAlign: "center", padding: "16px 0" }}>
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: mob ? 16 : 20, fontStyle: "italic", color: C.text2, lineHeight: 1.5 }}>
                    "Building a business that is <span style={{ color: C.gold, fontStyle: "normal", fontWeight: 600 }}>an asset that runs without you</span> starts with knowing exactly where it stands today."
                  </div>
                </div>
              </>
            )}

            <div style={{ textAlign: "center", marginTop: 20 }}>
              <button onClick={handleRestart} style={{
                fontSize: 12, color: C.text4, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit",
              }}>
                Take the assessment again
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes btnShimmer { 0%{background-position:200% 0}50%{background-position:-200% 0}100%{background-position:-200% 0} }
        @keyframes lockPulse { 0%,100%{box-shadow:0 0 20px rgba(200,162,78,0.2);opacity:0.9} 50%{box-shadow:0 0 35px rgba(200,162,78,0.4);opacity:1} }
        input::placeholder { color: ${C.text4}; }
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════
export { buildResultData, QUESTIONS, CATEGORY_ORDER, CATEGORY_COLOR };
