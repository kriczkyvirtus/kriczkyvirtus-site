import React, { useState, useEffect, useRef } from "react";
import PageTexture from "./PageTexture.jsx";
import { C, T, glow, CARD, KICKER, CREAM_CSS, FONTS, Logo, Num, HaloButton, PageCarousel, ContactFooter } from "./CreamKit.jsx";

// ═══════════════════════════════════════════════════════════════════
// VALUATION ESTIMATE - Baseline Questionnaire
// URL: /valuation-estimate                (door="site": ends on the Snapshot Review calendar)
//      /workshop-rh/snapshot?e=&n=        (door="workshop": pre-work for workshop attendees -
//                                          ends on a "we're building your Snapshot" message,
//                                          no call to book; e/n prefill email and first name)
//
// Cream (16 Oct 2026): still the compact, embedded single column, now on the
// engraved ground with porcelain answers, the dark halo button and report
// glow cards. A strip of sample Spotlight pages sits under the form and under
// the calendar, so owners see what the Snapshot Review walks them through.
// Questions and answers are unchanged.
// ═══════════════════════════════════════════════════════════════════

/* Seven pages of a sample Spotlight (the v2 template's sample company), with the
   company and owner names blurred. Rendered from the live template. */
const SPOTLIGHT_PAGES = [
  { n: "01", t: "Your Spotlight report",          src: "/img/spotlight/page-01.jpg" },
  { n: "04", t: "Executive summary",              src: "/img/spotlight/page-04.jpg" },
  { n: "08", t: "The value picture",              src: "/img/spotlight/page-08.jpg" },
  { n: "09", t: "Profitability vs. your sector",  src: "/img/spotlight/page-09.jpg" },
  { n: "10", t: "When margin and multiple compound", src: "/img/spotlight/page-10.jpg" },
  { n: "11", t: "Potential value gap issues",     src: "/img/spotlight/page-11.jpg" },
  { n: "12", t: "Recommendations & next steps",   src: "/img/spotlight/page-12.jpg" },
];

const useBp = () => {
  const [bp, setBp] = useState("desktop");
  useEffect(() => {
    const check = () => { const w = window.innerWidth; setBp(w < 768 ? "mobile" : w < 1024 ? "tablet" : "desktop"); };
    check(); window.addEventListener("resize", check); return () => window.removeEventListener("resize", check);
  }, []);
  return { mob: bp === "mobile", tab: bp === "tablet" };
};

/* Workshop door: optional video on the thank-you message. Renders only once set. */
const WORKSHOP_VSL_SRC = null;      // e.g. "/video/workshop-snapshot.mp4"
const WORKSHOP_VSL_POSTER = null;

/* Breaks out of the 680 column so the page strip has room either side. */
const SpotlightPreview = ({ mob }) => (
  <section style={{ width: "min(1000px, 100vw)", marginLeft: "calc(50% - min(500px, 50vw))", padding: mob ? "44px 0 8px" : "56px 0 8px" }}>
    <div style={{ textAlign: "center", padding: "0 22px", maxWidth: 640, margin: "0 auto" }}>
      <div style={KICKER}>Your Spotlight report</div>
      <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: mob ? 30 : 40, lineHeight: 1.1, color: C.ink1, margin: "0 0 12px" }}>
        A look <span style={{ fontStyle: "italic", fontWeight: 500, color: T.gold.ink }}>inside</span>
      </h2>
      <p style={{ fontSize: mob ? 14.5 : 16, lineHeight: 1.6, color: C.ink2, margin: 0 }}>
        Sample pages from a Spotlight report. Yours is built from your numbers and recent deals in your industry, and we walk through it together, live.
      </p>
    </div>
    <div style={{ marginTop: 10 }}><PageCarousel pages={SPOTLIGHT_PAGES} alt="Sample Spotlight page" /></div>
    <p style={{ fontSize: 11, color: C.ink4, textAlign: "center", fontStyle: "italic", margin: "6px 22px 0" }}>Sample company. Names blurred and figures illustrative.</p>
  </section>
);

// ─── Currency Formatting ─────────────────────────────────────
function formatCurrency(value) {
  const digits = String(value).replace(/[^0-9]/g, "");
  if (!digits) return "";
  const num = parseInt(digits, 10);
  return "$" + num.toLocaleString("en-US");
}
function parseCurrencyToRaw(value) {
  return value.replace(/[^0-9]/g, "");
}

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
      { id: "q1", text: "What is your annual revenue?", type: "currency", placeholder: "e.g. $2,500,000" },
      { id: "q2", text: "What is your annual EBITDA?", type: "currency", placeholder: "e.g. $400,000" },
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

export default function ValuationEstimate({ door = "site" }) {
  const { mob } = useBp();
  const workshop = door === "workshop";
  const topRef = useRef(null);
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Hover states for buttons
  const [continueHover, setContinueHover] = useState(false);
  const [backHover, setBackHover] = useState(false);
  const [submitHover, setSubmitHover] = useState(false);

  // Contact info
  /* Workshop links carry ?e=<email>&n=<first name> so attendees don't retype them. */
  const linked = typeof window === "undefined" ? null : new URLSearchParams(window.location.search);
  const [firstName, setFirstName] = useState(() => (workshop && linked?.get("n")) || "");
  const [lastName, setLastName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState(() => (workshop && linked?.get("e")) || "");

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

  const section = SECTIONS[step];

  // Validation
  const canAdvance = () => {
    if (step === 0) {
      return firstName.trim() && lastName.trim() && businessName.trim() && email.trim() && email.includes("@");
    }
    const qs = section.questions || [];
    return qs.every(q => answers[q.id] && answers[q.id].trim());
  };

  const scrollToTop = () => {
    setTimeout(() => {
      topRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  const handleContinue = () => {
    if (!canAdvance()) return;

    // Early capture: when leaving contact info step, send data immediately
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
          door,
        }),
      }).catch(err => console.error("[Questionnaire] Early capture failed:", err));
    }

    setStep(s => s + 1);
    scrollToTop();
  };

  const handleBack = () => {
    setStep(s => s - 1);
    scrollToTop();
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
      door,
      answers: {},
      utmSource: utmSource || null,
      utmCampaign: utmCampaign || null,
      timestamp: new Date().toISOString(),
    };

    // Build answers with question text — format currency fields
    SECTIONS.forEach(sec => {
      if (sec.questions) {
        sec.questions.forEach(q => {
          let answer = answers[q.id] || "";
          if (q.type === "currency" && answer) {
            answer = formatCurrency(answer);
          }
          payload.answers[q.id] = {
            question: q.text,
            answer,
          };
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
    scrollToTop();
  };

  const inputStyle = {
    width: "100%", padding: "13px 16px", borderRadius: 11,
    border: `1px solid ${C.rule}`, background: "#FFFFFF",
    color: C.ink1, fontSize: 15, fontFamily: "'DM Sans', sans-serif",
    outline: "none", boxSizing: "border-box",
    boxShadow: "inset 0 1px 2px rgba(10,14,20,.05)",
  };
  const labelStyle = { fontSize: 11, color: C.ink3, marginBottom: 5, display: "block", fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase" };

  const S = SECTIONS[step];

  return (
    <div style={{ background: C.page, minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", color: C.ink1, position: "relative", isolation: "isolate", overflowX: "hidden" }}>
      <link href={FONTS} rel="stylesheet" />
      <style>{CREAM_CSS + `
        @keyframes drawCircle { 0% { stroke-dashoffset: 176; } 100% { stroke-dashoffset: 0; } }
        @keyframes drawCheck { 0% { stroke-dashoffset: 50; opacity: 1; } 100% { stroke-dashoffset: 0; opacity: 1; } }
        .ve-in:focus { border-color: ${T.gold.fill} !important; box-shadow: 0 0 0 3px ${T.gold.fill}33, inset 0 1px 2px rgba(10,14,20,.05) !important; }
        /* porcelain answers: a gold edge and soft glow when picked */
        .ve-opt { display: flex; gap: 12px; align-items: flex-start; width: 100%; text-align: left; margin-bottom: 9px; cursor: pointer;
          border-radius: 12px; border: 1px solid #E6DFD1; background: linear-gradient(180deg,#FFFEFB 0%,#F7F2E8 100%); color: ${C.ink2};
          font-family: 'DM Sans', sans-serif; line-height: 1.5;
          box-shadow: inset 0 1px 0 rgba(255,255,255,.95), 0 1px 2px rgba(10,14,20,.05), 0 4px 10px rgba(10,14,20,.05);
          transition: transform .3s ease, box-shadow .3s ease, border-color .3s ease, color .3s ease, background .3s ease; }
        .ve-opt .dot { flex: 0 0 auto; width: 18px; height: 18px; margin-top: 1px; border-radius: 50%; border: 1.5px solid #CFC6B5; background: #fff;
          transition: all .3s ease; }
        @media (hover: hover) and (pointer: fine) { .ve-opt:hover { transform: translateY(-1px); border-color: ${T.gold.fill}88; color: ${C.ink1}; } }
        .ve-opt.on { border-color: ${T.gold.fill}; color: ${C.ink1}; background: linear-gradient(135deg, #FFFFFF 50%, ${T.gold.tint});
          box-shadow: 0 0 0 1px ${T.gold.fill}88, 0 0 20px ${T.gold.fill}40, 0 6px 14px rgba(10,14,20,.07); }
        .ve-opt.on .dot { border-color: ${T.gold.fill}; background: radial-gradient(circle, ${T.gold.fill} 0 42%, #fff 46%); box-shadow: 0 0 8px ${T.gold.fill}88; }
      `}</style>
      <PageTexture />
      <div aria-hidden="true" style={{ position: "absolute", top: -80, left: "50%", transform: "translateX(-50%)", width: "min(1100px,150vw)", height: 560,
        background: `radial-gradient(ellipse at center, ${T.gold.fill}1c 0%, transparent 66%)`, pointerEvents: "none", zIndex: -1 }} />

      <div style={{ position: "relative", maxWidth: 680, margin: "0 auto", padding: mob ? "25px 18px 50px" : "25px 40px 70px" }}>
        <div ref={topRef} />

        {/* Not a link: one way forward */}
        <Logo style={{ marginBottom: mob ? 30 : 38 }} />

        {/* Title - hidden on thank-you page */}
        {!submitted && (
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            {workshop && <div style={{ ...KICKER, marginBottom: 14 }}>Reinvest or Harvest Workshop &middot; Pre-work</div>}
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: mob ? 31 : 44, lineHeight: 1.08, color: C.ink1, margin: 0, letterSpacing: "-.01em" }}>
              Get Your Personalized<br /><span style={{ color: T.gold.ink, fontStyle: "italic", fontWeight: 500 }}>Profit & Valuation Gaps</span> Snapshot
            </h1>
          </div>
        )}

        {/* Progress - a porcelain track with a gold fill */}
        {!submitted && (
          <div style={{ marginBottom: 26 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 9 }}>
              <span style={{ fontSize: 11, color: C.ink3, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em" }}>
                Step {step + 1} of {TOTAL_STEPS}
              </span>
              <span style={{ fontSize: 12, color: T.gold.ink, fontWeight: 700 }}>
                {Math.round((step / TOTAL_STEPS) * 100)}%
              </span>
            </div>
            <div style={{ height: 8, borderRadius: 999, padding: 1, background: "linear-gradient(180deg,#FFFEFB 0%,#F3ECDF 100%)", border: "1px solid #E6DFD1",
              boxShadow: "inset 0 1px 2px rgba(10,14,20,.06)" }}>
              <div style={{ height: "100%", borderRadius: 999, background: `linear-gradient(90deg, ${T.gold.ink}, ${T.gold.fill})`,
                width: `${Math.max(3, (step / TOTAL_STEPS) * 100)}%`, transition: "width 0.4s ease", boxShadow: `0 0 10px ${T.gold.fill}66` }} />
            </div>
          </div>
        )}

        {/* ─── SUBMITTED - WORKSHOP: no call to book, the Snapshot comes to the workshop ─── */}
        {submitted && workshop && (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
              <span style={{ width: 62, height: 62, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                background: "linear-gradient(180deg,#FFFEFB 0%,#F3ECDF 100%)", border: `1px solid ${T.green.fill}88`,
                boxShadow: `inset 0 1px 0 rgba(255,255,255,.95), 0 8px 18px rgba(10,14,20,.1), 0 0 22px ${T.green.fill}40` }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M4.5 12.5L9.7 17.7L19.5 7" stroke={T.green.ink} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: mob ? 30 : 42, fontWeight: 700, color: C.ink1, margin: "0 0 14px", lineHeight: 1.1, textAlign: "center", textWrap: "balance" }}>
              You're all set - we're building <span style={{ color: T.gold.ink, fontStyle: "italic", fontWeight: 500 }}>your Snapshot</span>
            </h2>
            <div style={{ marginBottom: mob ? 22 : 28, textAlign: "center", maxWidth: 640, marginLeft: "auto", marginRight: "auto" }}>
              {/* "pretty" wrapping plus a no-break space keeps the last word from sitting alone on a line */}
              <p style={{ fontSize: mob ? 15 : 16.5, lineHeight: 1.6, color: C.ink2, margin: 0, textWrap: "pretty" }}>
                Thanks{firstName.trim() ? `, ${firstName.trim()}` : ""}. We'll build your personalized Profit &amp; Valuation Gaps Snapshot from your answers, benchmarked against recent deals in your industry. It'll be ready for you at the workshop, where we walk through it&nbsp;together.
              </p>
            </div>

            {WORKSHOP_VSL_SRC && (
              <div style={{ ...glow(T.gold), padding: 8, marginBottom: mob ? 26 : 32, overflow: "hidden" }}>
                <video src={WORKSHOP_VSL_SRC} poster={WORKSHOP_VSL_POSTER || undefined} controls playsInline preload="metadata"
                  style={{ width: "100%", display: "block", borderRadius: 12, aspectRatio: "16/9", background: "#0A0E14" }} />
              </div>
            )}

            <div style={{ ...CARD, padding: mob ? "24px 20px" : "28px 30px" }}>
              <p style={{ fontSize: 15.5, lineHeight: 1.5, color: C.ink1, margin: "0 0 14px", fontWeight: 700 }}>Between now and the workshop:</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  "We build your Snapshot from your answers.",
                  "You get the workshop reminders and any other pre-work by email.",
                  "At the workshop, we walk through your Snapshot together and turn it into your next moves.",
                ].map((text, i) => (
                  <div key={text} style={{ display: "flex", gap: 13, alignItems: "center" }}>
                    <Num n={String(i + 1)} size={30} />
                    <span style={{ fontSize: 14.5, lineHeight: 1.5, color: C.ink2 }}>{text}</span>
                  </div>
                ))}
              </div>
            </div>

            <SpotlightPreview mob={mob} />
          </div>
        )}

        {/* ─── SUBMITTED STATE ─── */}
        {submitted && !workshop && (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: mob ? 28 : 38, fontWeight: 700, color: C.ink1, margin: "0 0 14px", lineHeight: 1.12, textAlign: "center", textWrap: "balance" }}>
              You're Almost Done - Book Your <span style={{ color: T.gold.ink, fontStyle: "italic", fontWeight: 500 }}>Snapshot Review</span>
            </h2>

            <div style={{ marginBottom: mob ? 20 : 26, textAlign: "center", maxWidth: 580, marginLeft: "auto", marginRight: "auto" }}>
              <p style={{ fontSize: mob ? 14 : 15, lineHeight: 1.6, color: C.ink2, margin: "0 0 8px" }}>
                Next step: Pick a 30-minute video call time below so we can pull your live industry deal comps and walk you through your Profit Gap & Valuation Gap.
              </p>
              <p style={{ fontSize: mob ? 14 : 15, lineHeight: 1.6, color: C.ink3, margin: 0, fontStyle: "italic" }}>
                We don't send raw numbers by email because numbers without context are dangerous. We only deliver Snapshots live so you leave with clear decisions, not more confusion.
              </p>
            </div>

            {/* iClosed Calendar - the hero */}
            <div style={{ ...glow(T.gold), padding: mob ? "12px 8px" : "20px 22px", marginBottom: mob ? 26 : 32, overflow: "hidden" }}>
              <iframe
                src="https://app.iclosed.io/e/kriczkyvirtus/profit-valuation-snapshot"
                title="Profit & Valuation Snapshot"
                style={{ width: "100%", height: 820, border: "none", borderRadius: 12, background: "transparent", display: "block" }}
                allow="payment"
                scrolling="no"
              />
            </div>

            {/* Below calendar - what we'll cover */}
            <div style={{ ...CARD, padding: mob ? "24px 20px" : "28px 30px" }}>
              <p style={{ fontSize: 15.5, lineHeight: 1.5, color: C.ink1, margin: "0 0 12px", fontWeight: 700 }}>
                On your Snapshot Review we will:
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
                {[
                  "Benchmark your margins and valuation against real deals in your industry",
                  "Quantify how much profit and valuation you're likely leaving on the table",
                  "Highlight 2-3 levers to focus on over the next 12-24 months",
                ].map(x => (
                  <div key={x} style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
                    <span style={{ flex: "0 0 auto", width: 7, height: 7, borderRadius: "50%", background: T.gold.fill, marginTop: 9, boxShadow: `0 0 8px ${T.gold.fill}88` }} />
                    <span style={{ fontSize: 14.5, lineHeight: 1.6, color: C.ink2 }}>{x}</span>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: `1px solid ${C.ruleLight}`, paddingTop: 20, display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { num: "1", text: "Book a time above." },
                  { num: "2", text: "Confirm the invite link for your calendar." },
                  { num: "3", text: "Join from a computer so you can see your numbers on screen." },
                ].map(s => (
                  <div key={s.num} style={{ display: "flex", gap: 13, alignItems: "center" }}>
                    <Num n={s.num} size={30} />
                    <span style={{ fontSize: 14.5, lineHeight: 1.5, color: C.ink2 }}>{s.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <SpotlightPreview mob={mob} />
          </div>
        )}

        {/* ─── FORM SECTIONS ─── */}
        {!submitted && (
          <div style={{ ...glow(T.gold), padding: mob ? "26px 18px" : "34px 32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
              <Num n={String(step + 1).padStart(2, "0")} size={42} />
              <div>
                <div style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: T.gold.ink, fontWeight: 700, marginBottom: 4 }}>
                  {S.title}
                </div>
                <p style={{ fontSize: 14, color: C.ink3, margin: 0 }}>{S.subtitle}</p>
              </div>
            </div>

            {step === 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ display: "flex", gap: 12, flexDirection: mob ? "column" : "row" }}>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>First Name *</label>
                    <input className="ve-in" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First name" style={inputStyle} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Last Name *</label>
                    <input className="ve-in" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last name" style={inputStyle} />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Business Name *</label>
                  <input className="ve-in" value={businessName} onChange={e => setBusinessName(e.target.value)} placeholder="Your business name" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Email *</label>
                  <input className="ve-in" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@yourbusiness.com" style={inputStyle} />
                </div>
              </div>
            )}

            {step > 0 && S.questions && (
              <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
                {S.questions.map((q) => (
                  <div key={q.id}>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: mob ? 20 : 22, fontWeight: 700, color: C.ink1, marginBottom: 12, lineHeight: 1.25 }}>
                      {q.text}
                    </div>
                    {q.type === "currency" ? (
                      <input className="ve-in"
                        value={answers[q.id] ? formatCurrency(answers[q.id]) : ""}
                        onChange={e => setAnswer(q.id, parseCurrencyToRaw(e.target.value))}
                        inputMode="numeric"
                        placeholder={q.placeholder}
                        style={inputStyle}
                      />
                    ) : q.options ? (
                      <div role="radiogroup">
                        {q.options.map((opt, oi) => {
                          const on = answers[q.id] === opt;
                          return (
                            <button key={oi} role="radio" aria-checked={on} onClick={() => setAnswer(q.id, opt)}
                              className={`ve-opt${on ? " on" : ""}`}
                              style={{ padding: mob ? "12px 14px" : "14px 18px", fontSize: mob ? 13.5 : 14.5 }}>
                              <span className="dot" /><span>{opt}</span>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <input className="ve-in" value={answers[q.id] || ""} onChange={e => setAnswer(q.id, e.target.value)} placeholder={q.placeholder} style={inputStyle} />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Navigation */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginTop: 30, paddingTop: 22, borderTop: `1px solid ${C.ruleLight}` }}>
              {step > 0 ? (
                <button className="pbtn" onClick={handleBack}
                  style={{ padding: "12px 22px", borderRadius: 999, fontSize: 14, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>
                  Back
                </button>
              ) : <div />}

              {step < TOTAL_STEPS - 1 ? (
                <HaloButton onClick={handleContinue} disabled={!canAdvance()} size={15} style={{ padding: "14px 30px" }}>Continue</HaloButton>
              ) : (
                <HaloButton onClick={handleSubmit} disabled={!canAdvance() || submitting} size={15.5} style={{ padding: "15px 34px" }}>
                  {submitting ? "Submitting..." : "Submit"}
                </HaloButton>
              )}
            </div>
          </div>
        )}

        {!submitted && <SpotlightPreview mob={mob} />}

        {/* Disclaimers - only on first and last step */}
        {!submitted && (step === 0 || step === TOTAL_STEPS - 1) && (
          <div style={{ marginTop: 36, marginBottom: 24 }}>
            <p style={{ fontSize: 10.5, lineHeight: 1.6, color: C.ink4, textAlign: "center", maxWidth: 560, margin: "0 auto 16px" }}>
              This report serves as an indication of value based on current market trends and benchmarks. It is not intended as an income-based or certified valuation. For exit planning, financing, or transactional purposes, a credentialed Valuation Expert should be engaged to produce a certified valuation report.
            </p>
            <p style={{ fontSize: 10.5, lineHeight: 1.6, color: C.ink4, textAlign: "center", maxWidth: 560, margin: "0 auto" }}>
              By providing your information you consent to Kriczky Virtus, LLC contacting you by phone, text, or email using automated telephone dialing systems and AI to the information provided, even if the phone number is present on a state or national Do Not Call List. We do not sell your personal information. By providing this information you agree to our Privacy Policy and Terms of Service.
            </p>
          </div>
        )}

        <ContactFooter style={{ marginTop: 36 }} />
      </div>
    </div>
  );
}
