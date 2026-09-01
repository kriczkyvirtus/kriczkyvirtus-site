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

/* ═══════════════════ CONTENT ═══════════════════ */

/* ═══════════════════ CONTENT ═══════════════════ */

const EFFECTIVE = "September 1, 2026";

const SECTIONS = [
  {
    id: "educational",
    title: "This is educational content",
    body: [
      "Kriczky Virtus, LLC (\u201CKriczky Virtus\u201D) provides business advisory services and education. Nothing published by Kriczky Virtus \u2014 on this site, in the Virtus Collective community, in a cohort session, on a call, in a diagnostic tool, or in any written or verbal communication \u2014 is individualized investment, tax, or legal advice.",
      "None of it accounts for your specific circumstances, and none of it should be acted on as though it does. Coordinate tax matters with your CPA and legal matters with your attorney.",
    ],
  },
  {
    id: "firms",
    title: "Two firms, and how they relate",
    body: [
      "Kriczky Virtus and Kriczky Wealth Management LLC (\u201CKWM\u201D) are separate legal entities under common ownership and control. Edward Kriczky is the founder of Kriczky Virtus and an investment adviser representative of KWM.",
      "Kriczky Virtus is not an investment adviser. It does not provide investment advisory services and is not registered as an investment adviser in any jurisdiction.",
      "Content published by Kriczky Virtus \u2014 including the Virtus Collective, its cohorts, diagnostic tools, courses, emails, and social media \u2014 reflects the views of Kriczky Virtus and of Edward Kriczky in his capacity as its founder. It does not reflect the views of KWM, is not a description of KWM\u2019s advisory services, and is not investment advice from KWM.",
    ],
  },
  {
    id: "licensure",
    title: "Where advisory services are offered",
    body: [
      "KWM is an investment adviser registered in the states of Pennsylvania and Virginia. Registration does not imply any particular level of skill or training.",
      "KWM offers advisory services only to clients and prospective clients in jurisdictions where it and its representatives are properly registered or exempt from registration. No advisory services are rendered by KWM unless a written client agreement is in place.",
      "KWM\u2019s Form ADV is available at adviserinfo.sec.gov. It is referenced here rather than in this site\u2019s footer because this is the website of Kriczky Virtus, which is not an investment adviser.",
    ],
  },
  {
    id: "kwm-standard",
    title: "Kriczky Wealth Management disclosures",
    intro: "The following is the standard disclosure used by KWM. It applies to any KWM-related content appearing on this site.",
    quoted: true,
    link: { label: "kriczkywealth.com/disclosures", href: "https://www.kriczkywealth.com/disclosures" },
    linkIntro: "KWM\u2019s full disclosures are published at",
    body: [
      "For educational and informational purposes only. It is not intended to provide any tax or legal advice or provide the basis for any financial decisions. Nor is it intended to be a projection of current or future performance or indication of future results. The information provided is not based on actual current or past clients. All situations are unique, and results will differ depending on individual situation. All investing involves risk and you may lose money. Advisory services offered through Kriczky Wealth Management LLC, an Investment Advisor in the state of Pennsylvania and Virginia. Professionals are registered with Kriczky Wealth Management LLC.",
    ],
  },
  {
    id: "collective",
    title: "The Virtus Collective and its cohorts",
    body: [
      "The Virtus Collective is an educational community operated by Kriczky Virtus. Semi-private cohorts are educational group programs about business decision-making.",
      "Most sessions are group sessions led by Kriczky Virtus. The VIP tier includes one 90-minute one-on-one call per month; that time covers business operations and decision-making. It is not personal financial planning or investment advice.",
      "Where a member\u2019s numbers are reviewed \u2014 in a group session or one-on-one \u2014 it is limited to business operating metrics. We describe how we reason about those decisions and how we would decide if we owned the business; we do not tell any member what to do.",
      "No tier includes individualized financial planning or investment advisory services.",
    ],
  },
  {
    id: "relationship",
    title: "What membership is not",
    body: [
      "Membership in the Virtus Collective does not create an advisory relationship with Kriczky Virtus or with KWM. Neither does attending a call, posting a question, or receiving an answer.",
      "If you want personal financial advice from Edward Kriczky, that requires a formal client relationship with KWM \u2014 a separate engagement, under a separate written agreement, with its own fee disclosure.",
    ],
  },
  {
    id: "conflict",
    title: "Conflict of interest",
    body: [
      "Members of the Virtus Collective and its cohorts are natural candidates to become advisory clients of KWM. Edward Kriczky therefore has a financial incentive to introduce members to those services.",
      "Membership is never conditioned on becoming a client, and nothing in the community requires it. Any advisory relationship would be entered into separately, under a written agreement with its own fee disclosure.",
    ],
  },
  {
    id: "community",
    title: "Member and third-party content",
    body: [
      "Posts, comments, and discussion by members of the Virtus Collective, or on any Kriczky Virtus social media account, reflect the views of the individuals who wrote them. They are not reviewed or endorsed by Kriczky Virtus or KWM, and should not be taken as the views of either firm.",
      "Likes, follows, shares, and comments are not endorsements of Kriczky Virtus, KWM, or Edward Kriczky, and no compensation is provided for them.",
      "Testimonials from clients or prospective clients about their experience with KWM are not permitted. Members are asked not to post them, and community rules prohibit income claims and results posts.",
    ],
  },
  {
    id: "claims",
    title: "Claims and diagnostic tools",
    body: [
      "No performance figures or income claims are published by Kriczky Virtus, and none should be inferred from any material on this site.",
      "Diagnostic tools published by Kriczky Virtus are self-scored and educational. A valuation estimate produced by any tool on this site is an illustration based on the inputs provided. It is not an appraisal, not a formal valuation, and should not be relied on for any transaction.",
    ],
  },
  {
    id: "forward",
    title: "Forward-looking statements",
    body: [
      "Any discussion of what could happen in a business \u2014 growth, margin, capacity, or the return on a reinvestment \u2014 is conditional and illustrative. Results depend on factors outside anyone\u2019s control. Nothing here is a guarantee, a projection, or a promise of a particular outcome.",
    ],
  },
  {
    id: "links",
    title: "Links to other websites",
    body: [
      "Links to third-party websites are provided for convenience. Following one takes you away from this site. Neither Kriczky Virtus nor KWM is responsible for the content or accuracy of material on third-party sites, and neither necessarily endorses it. Your use of those sites is at your own risk and subject to their terms.",
    ],
  },
];

/* ═══════════════════ PAGE ═══════════════════ */

export default function Disclosures() {
  const { mob } = useBp();
  const SectionGap = mob ? 30 : 38;

  return (
    <div style={{ minHeight: "100vh", background: C.bgDeep, fontFamily: "'DM Sans', sans-serif", color: C.text1, position: "relative", overflow: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Background atmosphere */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, background: `radial-gradient(ellipse 80% 60% at 25% 85%, #221a08 0%, transparent 55%), radial-gradient(ellipse 60% 50% at 75% 15%, #151a30 0%, transparent 55%), radial-gradient(ellipse 70% 50% at 50% 50%, rgba(200,162,78,0.04) 0%, transparent 60%), linear-gradient(155deg, #070a10 0%, #0c1018 25%, #151208 50%, #0e1220 75%, #090d14 100%)` }} />
      <Grain />

      <div style={{ position: "relative", zIndex: 2, maxWidth: 780, margin: "0 auto", padding: mob ? "40px 20px 56px" : "64px 32px 80px" }}>

        {/* ─── HEADER ─────────────────────────────── */}
        <div style={{ textAlign: "center", marginBottom: mob ? 34 : 46 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
            <Shield size={40} />
          </div>
          <Eyebrow>Kriczky Virtus</Eyebrow>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: mob ? 34 : 48, color: C.text1, letterSpacing: "-0.02em", lineHeight: 1.08, margin: "0 0 14px" }}>
            Disclosures
          </h1>
          <P mob={mob} style={{ maxWidth: 560, margin: "0 auto 6px" }}>
            What this is, what it isn&rsquo;t, and where the line sits.
          </P>
          <div style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: C.text3, marginTop: 14 }}>
            Effective {EFFECTIVE}
          </div>
        </div>

        {/* ─── SECTIONS ───────────────────────────── */}
        {SECTIONS.map((s, i) => (
          <div key={s.id} style={{ ...CARD, padding: mob ? "22px 20px" : "28px 30px", marginBottom: i === SECTIONS.length - 1 ? SectionGap : 12 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 12 }}>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: mob ? 15 : 17, fontWeight: 600, color: C.gold, lineHeight: 1, flexShrink: 0 }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: mob ? 21 : 25, color: C.text1, letterSpacing: "-0.01em", lineHeight: 1.2, margin: 0 }}>
                {s.title}
              </h2>
            </div>
            {s.intro && (
              <P mob={mob} style={{ marginBottom: 12 }}>{s.intro}</P>
            )}
            {s.body.map((para, j) => (
              <P key={j} mob={mob}
                style={s.quoted
                  ? { marginBottom: j === s.body.length - 1 ? 0 : 12, paddingLeft: mob ? 14 : 18, borderLeft: `2px solid ${C.gold}40`, color: C.text2 }
                  : { marginBottom: j === s.body.length - 1 ? 0 : 12 }}>
                {para}
              </P>
            ))}
            {s.link && (
              <P mob={mob} style={{ marginTop: 14, marginBottom: 0 }}>
                {s.linkIntro}{" "}
                <a href={s.link.href} target="_blank" rel="noopener noreferrer"
                  style={{ color: C.gold, textDecoration: "none", borderBottom: `1px solid ${C.gold}40` }}>
                  {s.link.label}
                </a>.
              </P>
            )}
          </div>
        ))}

        {/* ─── QUESTIONS ──────────────────────────── */}
        <div style={{ ...CARD, padding: mob ? "22px 20px" : "28px 30px", marginBottom: SectionGap, textAlign: "center", border: `1px solid ${C.gold}25`, background: `linear-gradient(135deg, ${C.gold}08, ${C.gold}03)` }}>
          <Eyebrow>Questions</Eyebrow>
          <P mob={mob} style={{ marginBottom: 0, maxWidth: 520, marginLeft: "auto", marginRight: "auto" }}>
            If anything here is unclear, ask before you act on it. Email{" "}
            <span style={{ color: C.gold }}>ekriczky@kriczkyvirtus.com</span>.
          </P>
        </div>

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
