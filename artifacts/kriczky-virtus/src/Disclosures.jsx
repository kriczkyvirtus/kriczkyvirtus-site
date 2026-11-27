import PageTexture from "./PageTexture.jsx";
import { C, T, glow, CARD, KICKER, CREAM_CSS, FONTS, Logo, Num, ContactFooter } from "./CreamKit.jsx";

// ═══════════════════════════════════════════════════════════════════
// DISCLOSURES - /disclosures
//
// Cream (27 Nov 2026): the engraved ground, porcelain number discs, white
// cards, as on /workshop-rh. Wording unchanged; em dashes set as " - ".
// ═══════════════════════════════════════════════════════════════════

const EFFECTIVE = "September 1, 2026";

const SECTIONS = [
  {
    id: "educational",
    title: "This is educational content",
    body: [
      "Kriczky Virtus, LLC (\u201CKriczky Virtus\u201D) provides business advisory services and education. Nothing published by Kriczky Virtus - on this site, in the Virtus Collective community, in a cohort session, on a call, in a diagnostic tool, or in any written or verbal communication - is individualized investment, tax, or legal advice.",
      "None of it accounts for your specific circumstances, and none of it should be acted on as though it does. Coordinate tax matters with your CPA and legal matters with your attorney.",
    ],
  },
  {
    id: "firms",
    title: "Two firms, and how they relate",
    body: [
      "Kriczky Virtus and Kriczky Wealth Management LLC (\u201CKWM\u201D) are separate legal entities under common ownership and control. Edward Kriczky is the founder of Kriczky Virtus and an investment adviser representative of KWM.",
      "Kriczky Virtus is not an investment adviser. It does not provide investment advisory services and is not registered as an investment adviser in any jurisdiction.",
      "Content published by Kriczky Virtus - including the Virtus Collective, its cohorts, diagnostic tools, courses, emails, and social media - reflects the views of Kriczky Virtus and of Edward Kriczky in his capacity as its founder. It does not reflect the views of KWM, is not a description of KWM\u2019s advisory services, and is not investment advice from KWM.",
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
      "Where a member\u2019s numbers are reviewed - in a group session or one-on-one - it is limited to business operating metrics. We describe how we reason about those decisions and how we would decide if we owned the business; we do not tell any member what to do.",
      "No tier includes individualized financial planning or investment advisory services.",
    ],
  },
  {
    id: "relationship",
    title: "What membership is not",
    body: [
      "Membership in the Virtus Collective does not create an advisory relationship with Kriczky Virtus or with KWM. Neither does attending a call, posting a question, or receiving an answer.",
      "If you want personal financial advice from Edward Kriczky, that requires a formal client relationship with KWM - a separate engagement, under a separate written agreement, with its own fee disclosure.",
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
      "Any discussion of what could happen in a business - growth, margin, capacity, or the return on a reinvestment - is conditional and illustrative. Results depend on factors outside anyone\u2019s control. Nothing here is a guarantee, a projection, or a promise of a particular outcome.",
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

const H = { fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, color: C.ink1, letterSpacing: "-.01em" };
const P = { fontSize: "clamp(14px,1.9vw,15.5px)", lineHeight: 1.7, color: C.ink2, margin: 0 };

export default function Disclosures() {
  return (
    <div style={{ background: C.page, minHeight: "100vh", fontFamily: "'DM Sans',sans-serif", color: C.ink1, position: "relative", isolation: "isolate", overflowX: "hidden" }}>
      <link href={FONTS} rel="stylesheet" />
      <style>{CREAM_CSS + `
        .dz-head { display: flex; align-items: center; gap: 14px; margin-bottom: 14px; }
        .dz-card + .dz-card { margin-top: 12px; }
      `}</style>
      <PageTexture />
      <div aria-hidden="true" style={{ position: "absolute", top: -80, left: "50%", transform: "translateX(-50%)", width: "min(1100px,150vw)", height: 560,
        background: `radial-gradient(ellipse at center, ${T.gold.fill}1c 0%, transparent 66%)`, pointerEvents: "none", zIndex: -1 }} />

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 20px" }}>
        <Logo style={{ padding: "30px 0 0" }} />

        {/* ─── HEADER ─── */}
        <header style={{ textAlign: "center", padding: "clamp(30px,5vw,50px) 0 clamp(26px,4vw,38px)" }}>
          <div style={KICKER}>Kriczky Virtus</div>
          <h1 style={{ ...H, fontSize: "clamp(42px,8vw,72px)", lineHeight: 1.04, letterSpacing: "-.02em", margin: "0 0 16px" }}>Disclosures</h1>
          <p style={{ ...P, fontSize: "clamp(16px,2.4vw,19px)", maxWidth: 560, margin: "0 auto" }}>
            What this is, what it isn&rsquo;t, and where the line sits.
          </p>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase", color: C.ink3, marginTop: 18 }}>
            Effective {EFFECTIVE}
          </div>
        </header>

        {/* ─── SECTIONS ─── */}
        {SECTIONS.map((s, i) => (
          <section key={s.id} id={s.id} className="dz-card" style={{ ...CARD, padding: "clamp(22px,3.6vw,30px) clamp(20px,3.6vw,32px)" }}>
            <div className="dz-head">
              <Num n={String(i + 1).padStart(2, "0")} t={T.gold} size={36} />
              <h2 style={{ ...H, fontSize: "clamp(22px,3vw,27px)", lineHeight: 1.2, margin: 0 }}>{s.title}</h2>
            </div>
            {s.intro && <p style={{ ...P, marginBottom: 12 }}>{s.intro}</p>}
            {s.quoted ? (
              /* the KWM standard disclosure, set apart on a tinted panel */
              <div style={{ padding: "16px 18px", borderRadius: 12, background: `linear-gradient(135deg, #FFFFFF 40%, ${T.gold.tint})`, border: `1px solid ${C.ruleLight}`,
                boxShadow: "inset 0 1px 0 rgba(255,255,255,.9)" }}>
                {s.body.map((para, j) => <p key={j} style={{ ...P, marginTop: j ? 12 : 0 }}>{para}</p>)}
              </div>
            ) : s.body.map((para, j) => <p key={j} style={{ ...P, marginTop: j ? 12 : 0 }}>{para}</p>)}
            {s.link && (
              <p style={{ ...P, marginTop: 14 }}>
                {s.linkIntro}{" "}
                <a href={s.link.href} target="_blank" rel="noopener noreferrer"
                  style={{ color: T.gold.ink, fontWeight: 600, textDecoration: "underline", textDecorationColor: `${T.gold.fill}88`, textUnderlineOffset: 3 }}>
                  {s.link.label}
                </a>.
              </p>
            )}
          </section>
        ))}

        {/* ─── QUESTIONS ─── */}
        <div style={{ ...glow(T.gold), padding: "clamp(22px,3.6vw,30px)", margin: "28px 0 clamp(30px,5vw,44px)", textAlign: "center" }}>
          <div style={KICKER}>Questions</div>
          <p style={{ ...P, maxWidth: 520, margin: "0 auto" }}>
            If anything here is unclear, ask before you act on it. Email{" "}
            <a href="mailto:ekriczky@kriczkyvirtus.com" style={{ color: T.gold.ink, fontWeight: 600, textDecoration: "none" }}>ekriczky@kriczkyvirtus.com</a>.
          </p>
        </div>

        <ContactFooter style={{ marginBottom: 56 }} />
      </div>
    </div>
  );
}
