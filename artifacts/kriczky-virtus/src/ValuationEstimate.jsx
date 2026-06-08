import React, { useState, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════════
// VALUATION ESTIMATE — Baseline Questionnaire
// URL: /valuation-estimate
// ═══════════════════════════════════════════════════════════════════

const C = {
  gold: "#C8A24E", cyan: "#22D3EE", green: "#34D399",
  bgDeep: "#0A0E14", bgCard: "#111720", bgElev: "#1A2130",
  text1: "#E8ECF1", text2: "#8B95A5", text3: "#5A6474", text4: "#3D4654",
  border1: "rgba(255,255,255,0.06)", border2: "rgba(255,255,255,0.10)",
};

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const useBp = () => {
  const [bp, setBp] = useState("desktop");
  useEffect(() => {
    const check = () => { const w = window.innerWidth; setBp(w < 768 ? "mobile" : w < 1024 ? "tablet" : "desktop"); };
    check(); window.addEventListener("resize", check); return () => window.removeEventListener("resize", check);
  }, []);
  return { mob: bp === "mobile", tab: bp === "tablet" };
};

const KVShield = ({ size = 22, glow = false }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none"
    style={glow ? { filter: `drop-shadow(0 0 12px ${C.gold}60) drop-shadow(0 0 4px ${C.gold}90)` } : {}}>
    <path d="M32 8L14 16V30C14 42 22 52 32 56C42 52 50 42 50 30V16L32 8Z"
      fill="none" stroke={C.gold} strokeWidth="2.5" strokeLinejoin="round" />
    <path d="M32 12L18 18.5V30C18 40.5 24.5 49 32 52C39.5 49 46 40.5 46 30V18.5L32 12Z"
      fill="rgba(200,162,78,0.06)" />
  </svg>
);

// ─── QUESTIONS DATA ──────────────────────────────────────────
const SECTIONS = [
  {
    title: "Your Information",
    subtitle: "So we know who to prepare the report for",
    type: "contact",
  },
  {
    title: "Financial Overview",
    subtitle: "Help us understand your current financials",
    questions: [
      { id: "q1", text: "What is your annual revenue?", type: "text", placeholder: "e.g. $2,500,000" },
      { id: "q2", text: "What is your annual EBITDA?", type: "text", placeholder: "e.g. $400,000" },
    ],
  },
  {
    title: "Customers & Revenue Quality",
    subtitle: "How resilient is your revenue base?",
    questions: [
      {
        id: "q3", text: "How diverse is your customer base?",
        options: [
          "We are heavily dependent on a couple of customers. If one left, we would be in trouble.",
          "We are reliant on a few key accounts. If one left, we would be at risk.",
          "Our customer base is diverse but small. Every time a customer leaves, we feel it.",
          "We have a diverse customer base and are ok with losing a few customers.",
          "We have a large amount of customers and don't worry if we lose customers.",
        ],
      },
      {
        id: "q4", text: "Can your business rely on repeat business either contractually or through the build up of goodwill with your customers?",
        options: [
          "The majority of our revenue each year is driven through new client acquisitions. Next year's revenue can be difficult to predict.",
          "Each year revenue is driven through both new client acquisition and repeat clients. We have a good sense of next year's revenue.",
          "While we don't have contracts in place, we benefit from strong repeat customer sales that provide us confidence in next year's revenue.",
          "We have some contracts in place that give us strong assurances of next year's revenue.",
          "More than 50% of next year's revenue is due to contractually based pre-sold work.",
        ],
      },
    ],
  },
  {
    title: "Operations & Financial Management",
    subtitle: "How well-run is the business day to day?",
    questions: [
      {
        id: "q5", text: "Are the most important processes of your business documented and running smoothly?",
        options: [
          "Our business is simple and we haven't seen a need.",
          "We don't have our processes documented, which has occasionally caused issues.",
          "We are working toward getting the majority of our processes documented, but haven't finished yet.",
          "Most of our processes are documented, but could use an update.",
          "Yes, all of our key processes are documented and followed by everyone.",
        ],
      },
      {
        id: "q6", text: "Are the company's finances organized and does the business follow best practices?",
        options: [
          "We manage our monthly cash balance and spending but lack long term financial management.",
          "We could do a better job with our financial management and record keeping.",
          "We do a pretty good job with our financial management and record keeping. Generally, we prepare an annual financial plan.",
          "Yes, we do a good job with our financial management and record keeping. We have controls in place and are disciplined when making financial decisions.",
          "Yes, we are very confident in our financial management and record keeping. We could easily endure an audit.",
        ],
      },
    ],
  },
  {
    title: "Market Position",
    subtitle: "How defensible and scalable is your market?",
    questions: [
      {
        id: "q7", text: "Are there significant barriers that prevent new competitors from entering your market?",
        options: [
          "Barriers are very low – anyone can set up a business.",
          "There are a few barriers – most anyone can set up a business.",
          "There are some notable barriers but with time one can set up a business.",
          "It's tough but with time, knowledge, and resources one can set up a business.",
          "It's almost impossible but with significant time, knowledge, and resources one can set up a business.",
        ],
      },
      {
        id: "q8", text: "Does the size of your market support significant revenue generation?",
        options: [
          "Our market is pretty small. We have the potential to generate revenue of under $10 million.",
          "Our market is on the smaller side. We have the potential to generate revenue between $10 million and $50 million.",
          "Our market is pretty big. We have the potential to generate revenue of $50 million to $100 million.",
          "Our market is very large. We have the potential to generate revenue of over $100 million.",
          "Our market is enormous. We have the potential to generate revenue of over $1 billion.",
        ],
      },
    ],
  },
  {
    title: "Owner Dependency & Planning",
    subtitle: "How well does the business run without you?",
    questions: [
      {
        id: "q9", text: "How well does your business operate without you?",
        options: [
          "The business is heavily reliant on my day to day activity and involvement. It is very difficult for me to take a break.",
          "The day to day operations of the business can continue while I am out of the office. However, I feel compelled to check in daily with a team member and monitor email/phone calls daily.",
          "I have key team members in place that allow me to be out of the office periodically. The business can operate fine while I am out over short periods.",
          "I have a handful of key team members in place that allow me to be out of the office. I've taken an extended vacation over the last year.",
          "I have a management team in place so that I can be gone for long periods of time. I've taken at least one extended vacation over the last 6 months.",
        ],
      },
      {
        id: "q10", text: "Do you have a contingency plan in place so that your business will continue to operate if you are incapacitated?",
        options: [
          "A contingency plan is irrelevant, because the business can't run without me.",
          "I don't have a plan, but my family will know what to do.",
          "I have thought about this but have not yet put one in place.",
          "I made a contingency plan but don't review it as frequently as I should. It probably needs an update.",
          "Yes, I have a contingency plan in place and update it regularly.",
        ],
      },
      {
        id: "q11", text: "Do you have all of your corporate documents and shareholder agreements in order?",
        options: [
          "Why is this important?",
          "Other than formation documents, we don't have any other corporate documents or shareholder agreements in place.",
          "We're doing ok. We have some but not all of our corporate documents and shareholder agreements in place.",
          "We've been pretty good in this regard. We have corporate documents and shareholder agreements in place, but they may need to be updated.",
          "Yes, we are on top of this. All of our corporate documents and shareholder agreements are in place and are current.",
        ],
      },
    ],
  },
  {
    title: "Value Awareness",
    subtitle: "How well do you understand your business's value?",
    questions: [
      {
        id: "q12", text: "How well do you understand the value of your business?",
        options: [
          "I have no idea what my business is worth.",
          "I don't need to know right now since I don't plan on selling my business in the near future. As long as revenue is increasing, I'm good.",
          "I have an idea of what my business is worth based on other companies that have been bought and sold in my industry.",
          "I have discussed the value of my business with trusted financial advisors but have never had a formal valuation performed.",
          "I have had a formal valuation performed on the business.",
        ],
      },
      {
        id: "q13", text: "How well do you understand the options and process for selling/transitioning your business?",
        options: [
          "I am just starting and figured I would tackle this issue when I got closer to that time.",
          "I know who I will ultimately sell/transition my business to, so I'm good.",
          "My brother/sister/friend is a banker and have given me some information on what I need to do and what to expect.",
          "I have an understanding and have spent time and resources in preparing.",
          "This is not my first rodeo. I have bought and sold businesses before in the past.",
        ],
      },
      {
        id: "q14", text: "How well do you understand how to maximize the value of your business?",
        options: [
          "My business is worth what someone is willing to pay me for it. It's out of my hands.",
          "I keep my head down and focus on increasing revenue and profitability.",
          "I know that my business has intangible value but that's about it.",
          "I have spent some time working with an advisor but don't have a current plan in place.",
          "I am working with an advisor who is guiding me through a value building process.",
        ],
      },
    ],
  },
];

const TOTAL_STEPS = SECTIONS.length;

export default function ValuationEstimate() {
  const { mob } = useBp();
  const topRef = React.useRef(null);
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [continueHover, setContinueHover] = useState(false);
  const [backHover, setBackHover] = useState(false);
  const [submitHover, setSubmitHover] = useState(false);

  // Contact info
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");

  // Answers (keyed by question id)
  const [answers, setAnswers] = useState({});

  // UTM
  const [utmSource, setUtmSource] = useState(null);
  const [utmCampaign, setUtmCampaign] = useState(null);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const source = params.get("utm_source");
    const campaign = params.get("utm_campaign");
    if (source) setUtmSource(source);
    if (campaign) setUtmCampaign(campaign);
  }, []);

  const setAnswer = (id, value) => setAnswers(prev => ({ ...prev, [id]: value }));

  function formatCurrency(value) {
    const digits = value.replace(/[^0-9]/g, "");
    if (!digits) return "";
    const num = parseInt(digits, 10);
    return "$" + num.toLocaleString("en-US");
  }

  function parseCurrencyToRaw(value) {
    return value.replace(/[^0-9]/g, "");
  }

  const section = SECTIONS[step];

  // Validation
  const canAdvance = () => {
    if (step === 0) {
      return firstName.trim() && lastName.trim() && businessName.trim() && email.trim() && email.includes("@");
    }
    const qs = section.questions || [];
    return qs.every(q => answers[q.id] && answers[q.id].trim());
  };

  const handleSubmit = async () => {
    if (!canAdvance()) return;
    setSubmitting(true);

    const fullName = `${firstName.trim()} ${lastName.trim()}`;
    const payload = {
      name: fullName,
      email: email.trim(),
      businessName: businessName.trim(),
      tool: "valuation-questionnaire",
      answers: {},
      utmSource: utmSource || null,
      utmCampaign: utmCampaign || null,
      timestamp: new Date().toISOString(),
    };

    // Build answers with question text for clarity
    SECTIONS.forEach(sec => {
      if (sec.questions) {
        sec.questions.forEach(q => {
          let answer = answers[q.id] || "";
          if ((q.id === "q1" || q.id === "q2") && answer) {
            answer = formatCurrency(answer);
          }
          payload.answers[q.id] = { question: q.text, answer };
        });
      }
    });

    try {
      await fetch("/api/lead-capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.error("[Questionnaire] Submission failed:", err);
    }

    setSubmitting(false);
    setSubmitted(true);
  };

  const inputStyle = {
    width: "100%", padding: "12px 16px", borderRadius: 10,
    border: `1px solid ${C.border2}`, background: C.bgElev,
    color: C.text1, fontSize: 14, fontFamily: "'DM Sans', sans-serif",
    outline: "none", boxSizing: "border-box",
  };

  const optionStyle = (selected) => ({
    display: "block", width: "100%", textAlign: "left",
    padding: mob ? "12px 14px" : "14px 18px", borderRadius: 10,
    border: selected ? `1.5px solid ${C.gold}` : `1px solid ${C.border2}`,
    background: selected ? `${C.gold}10` : C.bgElev,
    color: selected ? C.text1 : C.text2,
    fontSize: mob ? 12 : 13, lineHeight: 1.5,
    fontFamily: "'DM Sans', sans-serif",
    cursor: "pointer", transition: "all 0.2s ease",
    marginBottom: 8,
  });

  return (
    <div style={{ background: C.bgDeep, minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", color: C.text1, position: "relative", overflow: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Background */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, background: `radial-gradient(ellipse 80% 60% at 25% 85%, #221a08 0%, transparent 55%), radial-gradient(ellipse 60% 50% at 75% 15%, #151a30 0%, transparent 55%), linear-gradient(155deg, #070a10 0%, #0c1018 25%, #151208 50%, #0e1220 75%, #090d14 100%)` }} />
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1, opacity: 0.07, mixBlendMode: "overlay", backgroundImage: GRAIN, backgroundSize: "128px 128px" }} />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 10, maxWidth: 680, margin: "0 auto", padding: mob ? "25px 20px 60px" : "40px 40px 80px" }}>
        <div ref={topRef} />

        {/* Logo */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: 40 }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: mob ? 8 : 12, textDecoration: "none" }}>
            <div style={{ width: mob ? 34 : 40, height: mob ? 34 : 40, borderRadius: mob ? 8 : 10, background: "rgba(200,162,78,0.06)", border: "1px solid rgba(200,162,78,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <KVShield size={mob ? 18 : 22} glow />
            </div>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: mob ? 15 : 19, color: C.text1, letterSpacing: 1.2, textTransform: "uppercase" }}>KRICZKY VIRTUS</span>
          </a>
        </div>

        {/* Title */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 100, background: "rgba(200,162,78,0.08)", border: "1px solid rgba(200,162,78,0.20)", marginBottom: 16 }}>
            <span style={{ fontSize: mob ? 10 : 12, fontWeight: 600, color: C.gold, letterSpacing: 0.3 }}>Baseline Business Valuation Questionnaire</span>
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: mob ? 26 : 36, lineHeight: 1.1, color: C.text1, margin: 0 }}>
            Get Your Personalized<br /><span style={{ color: C.gold, fontStyle: "italic" }}>Profit Gap</span> and <span style={{ color: C.gold, fontStyle: "italic" }}>Value Gap</span> Report
          </h1>
        </div>

        {/* Progress Bar */}
        {!submitted && (
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 11, color: C.text3, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Step {step + 1} of {TOTAL_STEPS}
              </span>
              <span style={{ fontSize: 11, color: C.text3 }}>
                {Math.round((step / TOTAL_STEPS) * 100)}%
              </span>
            </div>
            <div style={{ height: 4, borderRadius: 2, background: "rgba(255,255,255,0.06)" }}>
              <div style={{
                height: "100%", borderRadius: 2,
                background: `linear-gradient(90deg, ${C.gold}, ${C.gold}cc)`,
                width: `${(step / TOTAL_STEPS) * 100}%`,
                transition: "width 0.4s ease",
              }} />
            </div>
          </div>
        )}

        {/* ─── SUBMITTED STATE ──────────────────────────── */}
        {submitted && (
          <div style={{
            padding: mob ? "40px 24px" : "56px 40px", textAlign: "center",
            background: "linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015) 50%, rgba(255,255,255,0.025))",
            border: `1px solid ${C.border2}`, borderRadius: 18,
          }}>
            <style>{`
              @keyframes drawCircle {
                0% { stroke-dashoffset: 176; }
                100% { stroke-dashoffset: 0; }
              }
              @keyframes drawCheck {
                0% { stroke-dashoffset: 50; opacity: 1; }
                100% { stroke-dashoffset: 0; opacity: 1; }
              }
            `}</style>
            <div style={{ marginBottom: 20, display: "flex", justifyContent: "center" }}>
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <circle cx="32" cy="32" r="28"
                  stroke="#34D399" strokeWidth="3" fill="none"
                  strokeLinecap="round"
                  strokeDasharray="176"
                  strokeDashoffset="176"
                  style={{ animation: "drawCircle 0.8s ease-out forwards" }}
                />
                <path d="M20 33 L28 41 L44 25"
                  stroke="#34D399" strokeWidth="3" fill="none"
                  strokeLinecap="round" strokeLinejoin="round"
                  strokeDasharray="50"
                  strokeDashoffset="50"
                  style={{ animation: "drawCheck 0.4s ease-out 0.8s forwards" }}
                />
              </svg>
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: mob ? 24 : 30, fontWeight: 400, color: C.text1, margin: "0 0 16px" }}>
              Thank You for Completing the Questionnaire
            </h2>
            <p style={{ fontSize: 14, lineHeight: 1.65, color: C.text2, maxWidth: 480, margin: "0 auto 24px" }}>
              A member of the Kriczky Virtus team will reach out to you shortly to set a time to review your results after compiling your personalized report for the Profit Gap and Value Gap tailored specifically to your industry and business size.
            </p>
            <a href="/" style={{
              display: "inline-flex", padding: "12px 28px", borderRadius: 10,
              border: `1px solid ${C.border2}`, color: C.text2, fontSize: 13,
              textDecoration: "none", fontFamily: "'DM Sans', sans-serif",
            }}>
              Back to Kriczky Virtus
            </a>
          </div>
        )}

        {/* ─── FORM SECTIONS ───────────────────────────── */}
        {!submitted && (
          <div style={{
            padding: mob ? "28px 20px" : "36px 32px",
            background: "linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015) 50%, rgba(255,255,255,0.025))",
            border: `1px solid ${C.border2}`, borderTop: "1px solid rgba(255,255,255,0.10)",
            borderRadius: 18, boxShadow: `0 4px 12px rgba(0,0,0,0.3), 0 16px 48px rgba(0,0,0,0.25)`,
          }}>
            {/* Section header */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: C.gold, fontWeight: 600, marginBottom: 6 }}>
                {section.title}
              </div>
              <p style={{ fontSize: 13, color: C.text3, margin: 0 }}>{section.subtitle}</p>
            </div>

            {/* Contact info section */}
            {step === 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ display: "flex", gap: 12, flexDirection: mob ? "column" : "row" }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 11, color: C.text3, marginBottom: 4, display: "block", fontWeight: 600 }}>First Name *</label>
                    <input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First name" style={inputStyle} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 11, color: C.text3, marginBottom: 4, display: "block", fontWeight: 600 }}>Last Name *</label>
                    <input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last name" style={inputStyle} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 11, color: C.text3, marginBottom: 4, display: "block", fontWeight: 600 }}>Business Name *</label>
                  <input value={businessName} onChange={e => setBusinessName(e.target.value)} placeholder="Your business name" style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: C.text3, marginBottom: 4, display: "block", fontWeight: 600 }}>Email *</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@yourbusiness.com" style={inputStyle} />
                </div>
              </div>
            )}

            {/* Question sections */}
            {step > 0 && section.questions && (
              <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                {section.questions.map((q, qi) => (
                  <div key={q.id}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: C.text1, marginBottom: 12, lineHeight: 1.4 }}>
                      {q.text}
                    </div>
                    {q.type === "text" ? (
                      (q.id === "q1" || q.id === "q2") ? (
                        <input
                          value={answers[q.id] ? formatCurrency(answers[q.id]) : ""}
                          onChange={e => setAnswer(q.id, parseCurrencyToRaw(e.target.value))}
                          inputMode="numeric"
                          placeholder={q.placeholder}
                          style={inputStyle}
                        />
                      ) : (
                      <input
                        value={answers[q.id] || ""}
                        onChange={e => setAnswer(q.id, e.target.value)}
                        placeholder={q.placeholder}
                        style={inputStyle}
                      />
                      )
                    ) : (
                      <div>
                        {q.options.map((opt, oi) => (
                          <button
                            key={oi}
                            onClick={() => setAnswer(q.id, opt)}
                            style={optionStyle(answers[q.id] === opt)}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Navigation */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 28, paddingTop: 20, borderTop: `1px solid ${C.border1}` }}>
              {step > 0 ? (
                <button
                  onMouseEnter={() => setBackHover(true)}
                  onMouseLeave={() => setBackHover(false)}
                  onClick={() => { setStep(s => s - 1); setTimeout(() => { topRef.current?.scrollIntoView({ behavior: "smooth" }); }, 50); }}
                  style={{
                    padding: "10px 20px", borderRadius: 8,
                    border: `1px solid ${backHover ? C.border2 : C.border1}`,
                    background: backHover ? "rgba(255,255,255,0.03)" : "transparent",
                    color: backHover ? C.text1 : C.text2,
                    fontSize: 13, cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                    transition: "all 0.3s ease",
                  }}
                >
                  Back
                </button>
              ) : <div />}

              {step < TOTAL_STEPS - 1 ? (
                <button
                  onMouseEnter={() => setContinueHover(true)}
                  onMouseLeave={() => setContinueHover(false)}
                  onClick={() => {
                    if (canAdvance()) {
                      if (step === 0) {
                        fetch("/api/lead-capture", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            name: `${firstName.trim()} ${lastName.trim()}`,
                            email: email.trim(),
                            businessName: businessName.trim(),
                            tool: "valuation-questionnaire",
                            answers: {},
                            summary: {},
                            utmSource: utmSource || null,
                            utmCampaign: utmCampaign || null,
                            timestamp: new Date().toISOString(),
                            partial: true,
                          }),
                        }).catch(err => console.error("[Questionnaire] Early capture failed:", err));
                      }
                      setStep(s => s + 1);
                      setTimeout(() => { topRef.current?.scrollIntoView({ behavior: "smooth" }); }, 50);
                    }
                  }}
                  disabled={!canAdvance()}
                  style={{
                    padding: "10px 24px", borderRadius: 8,
                    border: `1.5px solid ${canAdvance() ? (continueHover ? C.gold : C.gold + "80") : C.border2}`,
                    background: canAdvance()
                      ? (continueHover ? `linear-gradient(135deg, ${C.gold}22, ${C.gold}12)` : `linear-gradient(135deg, ${C.gold}15, ${C.gold}08)`)
                      : "transparent",
                    color: canAdvance() ? C.gold : C.text4,
                    fontSize: 13, fontWeight: 600, cursor: canAdvance() ? "pointer" : "not-allowed",
                    fontFamily: "'DM Sans', sans-serif",
                    transition: "all 0.3s ease",
                    boxShadow: canAdvance() && continueHover ? `0 0 20px ${C.gold}25` : "none",
                    transform: continueHover && canAdvance() ? "translateY(-1px)" : "none",
                  }}
                >
                  Continue
                </button>
              ) : (
                <button
                  onMouseEnter={() => setSubmitHover(true)}
                  onMouseLeave={() => setSubmitHover(false)}
                  onClick={handleSubmit}
                  disabled={!canAdvance() || submitting}
                  style={{
                    padding: "12px 32px", borderRadius: 10,
                    border: `1.5px solid ${canAdvance() ? (submitHover ? C.gold : C.gold + "80") : C.border2}`,
                    background: canAdvance()
                      ? (submitHover ? `linear-gradient(135deg, ${C.gold}22, ${C.gold}12)` : `linear-gradient(135deg, ${C.gold}20, ${C.gold}08)`)
                      : "transparent",
                    color: canAdvance() ? C.gold : C.text4,
                    fontSize: 14, fontWeight: 700, cursor: canAdvance() ? "pointer" : "not-allowed",
                    fontFamily: "'DM Sans', sans-serif", transition: "all 0.3s ease",
                    boxShadow: canAdvance() && submitHover ? `0 0 20px ${C.gold}25` : (canAdvance() ? `0 0 20px ${C.gold}15` : "none"),
                    transform: submitHover && canAdvance() ? "translateY(-1px)" : "none",
                  }}
                >
                  {submitting ? "Submitting..." : "Submit"}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Disclaimers — only on first and last step */}
        {!submitted && (step === 0 || step === TOTAL_STEPS - 1) && (
          <div style={{ marginTop: 40, marginBottom: 24 }}>
            <p style={{ fontSize: 10, lineHeight: 1.55, color: "#5A6474", textAlign: "center", maxWidth: 560, margin: "0 auto 16px" }}>
              This report serves as an indication of value based on current market trends and benchmarks. It is not intended as an income-based or certified valuation. For exit planning, financing, or transactional purposes, a credentialed Valuation Expert should be engaged to produce a certified valuation report.
            </p>
            <p style={{ fontSize: 10, lineHeight: 1.55, color: "#5A6474", textAlign: "center", maxWidth: 560, margin: "0 auto" }}>
              By providing your information you consent to Kriczky Virtus, LLC contacting you by phone, text, or email using automated telephone dialing systems and AI to the information provided, even if the phone number is present on a state or national Do Not Call List. We do not sell your personal information. By providing this information you agree to our Privacy Policy and Terms of Service.
            </p>
          </div>
        )}

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", paddingTop: 32, marginTop: 0, borderTop: `1px solid ${C.border1}` }}>
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
        </div>
      </div>
    </div>
  );
}
