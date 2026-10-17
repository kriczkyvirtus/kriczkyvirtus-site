import PageTexture from "./PageTexture.jsx";
import { C, T, glow, CARD, KICKER, CREAM_CSS, FONTS, Logo, ContactFooter } from "./CreamKit.jsx";

// ═══════════════════════════════════════════════════════════════════
// FREE WORKING SESSION - Booking Page
// URL: /free-session
//
// Purpose: Landing page for the "Book Your Free Working Session" CTA
// from the Resources hub "See The Gap" section. For owners who have
// explored the diagnostic tools and want clarity on their Profit Gap
// and Value Gap personalized to their business.
//
// Cream (16 Oct 2026): the engraved ground, porcelain pills and discs,
// report glow cards, as on /reinvest-harvest. Copy unchanged.
// ═══════════════════════════════════════════════════════════════════

/* Metallic roadmap icons (the Owner's Virtus Roadmap stations), each in a porcelain tile:
   Profit Gap and Value Gap → 02 Know Your Numbers, constraint → 03 Find The Constraint,
   what to do next → 01. */
const SESSION_ITEMS = [
  {
    t: T.gold, ic: "c2",
    title: "Your Profit Gap - quantified",
    desc: "See the dollar amount your business is leaving on the table each year relative to what it could be earning. Not a guess - a number you can act on.",
  },
  {
    t: T.gold, ic: "c2",
    title: "Your Value Gap - mapped",
    desc: "The difference between what your business is worth today and what an above-average peer in your industry is worth - and why that gap exists.",
  },
  {
    t: T.gold, ic: "c3",
    title: "Your #1 constraint identified",
    desc: "Whether you've taken our diagnostic tools or not, we'll pinpoint the single biggest thing suppressing your valuation and cash flow right now.",
  },
  {
    t: T.gold, ic: "c1",
    title: "Clarity on what to do next",
    desc: "You leave with a clear picture of where the opportunities are in your business. No commitment required - just actionable insight you can use immediately.",
  },
];

const H = { fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, color: C.ink1, letterSpacing: "-.01em" };
const EM = { fontStyle: "italic", fontWeight: 500, color: T.gold.ink };
const S = { padding: "clamp(26px,4vw,44px) 22px", position: "relative" };

export default function FreeWorkingSession() {
  return (
    <div style={{ background: C.page, minHeight: "100vh", fontFamily: "'DM Sans',sans-serif", color: C.ink1, position: "relative", isolation: "isolate", overflowX: "hidden" }}>
      <link href={FONTS} rel="stylesheet" />
      <style>{CREAM_CSS + `
        .fws-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .fws-cap { display: flex; flex-wrap: wrap; align-items: center; gap: 10px 16px; padding: 18px 0 0 34px; }
        .fws-pills { display: flex; gap: 8px; flex-wrap: nowrap; }
        .fws-pill { height: 34px; padding: 0 14px 0 11px; font-size: 13px; }
        @media (max-width: 520px) {
          .fws-cap { padding-left: 0; }
          .fws-pills { gap: 6px; }
          .fws-pill { height: 31px; padding: 0 10px 0 9px; gap: 6px; font-size: 11.5px; }
          .fws-pill .gem { width: 7px; height: 7px; }
        }
        .fws-split { display: flex; align-items: center; gap: clamp(28px,5vw,56px); }
        @media (max-width: 760px) {
          .fws-grid { grid-template-columns: 1fr; }
          .fws-split { flex-direction: column; align-items: stretch; }
          .fws-photo { align-self: center; }
        }
      `}</style>
      <PageTexture />
      <div aria-hidden="true" style={{ position: "absolute", top: -80, left: "50%", transform: "translateX(-50%)", width: "min(1100px,150vw)", height: 560,
        background: `radial-gradient(ellipse at center, ${T.gold.fill}1c 0%, transparent 66%)`, pointerEvents: "none", zIndex: -1 }} />

      <div style={{ maxWidth: 940, margin: "0 auto", position: "relative" }}>
        <Logo style={{ padding: "25px 22px 0" }} />

        {/* ─── HERO ─── */}
        <section style={{ ...S, paddingTop: 34, textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", padding: "9px clamp(13px,3.6vw,20px)", borderRadius: 999, marginBottom: 22,
            background: "linear-gradient(180deg,#FFFEFB 0%,#F5EFE3 100%)", border: `1px solid ${T.gold.fill}66`,
            boxShadow: `inset 0 1px 0 rgba(255,255,255,.95), 0 1px 2px rgba(10,14,20,.06), 0 6px 16px rgba(10,14,20,.08), 0 0 20px ${T.gold.fill}2a` }}>
            <span style={{ fontSize: "clamp(11px,3vw,12.5px)", fontWeight: 600, color: T.gold.ink, letterSpacing: ".01em", whiteSpace: "nowrap" }}>100% Free · No Commitment · No Strings Attached</span>
          </div>
          <h1 style={{ ...H, fontSize: "clamp(31px, 5.6vw, 54px)", lineHeight: 1.1, maxWidth: 820, margin: "0 auto 20px", textWrap: "balance" }}>
            Find Out What Your <span style={EM}>Profit Gap</span> and <span style={EM}>Value Gap</span> Actually Look Like
          </h1>
          <p style={{ fontSize: "clamp(15px, 3.6vw, 19px)", lineHeight: 1.6, color: C.ink2, maxWidth: 740, margin: "0 auto", textWrap: "pretty" }}>
            Book a free working session and walk away knowing exactly how much money your business is leaving on the table - your Profit Gap - and the difference between your current valuation and what it could be - your Value Gap. This is yours to keep whether we ever work together or not.
          </p>
        </section>

        {/* ─── SCHEDULER ─── */}
        <section style={{ ...S, paddingTop: 0 }}>
          <div style={{ ...glow(T.gold), padding: "clamp(12px,2.4vw,24px)", overflow: "hidden" }}>
            <iframe
              src="https://app.iclosed.io/e/kriczkyvirtus/free-working-session"
              title="Free Working Session"
              style={{ width: "100%", height: 900, border: "none", borderRadius: 12, background: "transparent", display: "block" }}
              allow="payment"
              scrolling="no"
            />
          </div>
        </section>

        {/* ─── TESTIMONIAL ─── */}
        <section style={S}>
          <figure style={{ ...CARD, margin: 0, padding: "clamp(24px,4vw,34px) clamp(22px,4vw,40px)", position: "relative" }}>
            <div aria-hidden="true" style={{ position: "absolute", top: 10, left: 18, fontFamily: "'Cormorant Garamond',serif", fontSize: 72, color: T.gold.fill, opacity: 0.45, lineHeight: 1, userSelect: "none" }}>&ldquo;</div>
            <blockquote style={{ margin: 0, padding: "0 0 0 34px", fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(19px,3.4vw,23px)", lineHeight: 1.45, color: C.ink2, fontStyle: "italic" }}>
              Within 9 months of working with Edward we have implemented two core improvements in our business and both our{" "}
              <span style={{ color: C.ink1, fontWeight: 600, textDecoration: "underline", textDecorationColor: T.gold.fill, textUnderlineOffset: "4px" }}>revenue and profit are on track now to be up ~50% compared to last year.</span>{" "}
              He also helped us see that we still have a{" "}
              <span style={{ color: C.ink1, fontWeight: 700 }}>Profit Gap of $300K per year we are leaving on the table</span>{" "}
              that we are actively working to close so we can attract and retain better talent.
            </blockquote>
            <figcaption className="fws-cap">
              <span style={{ fontSize: 13, color: C.ink3, fontWeight: 600 }}>Phil C. · $3.0M Revenue · Home Services</span>
              <span className="fws-pills">
                {[{ t: T.gold, l: "Profit Gap: $300K/yr" }, { t: T.cyan, l: "Value Gap: $779K" }].map(p => (
                  <span key={p.l} className="ppill fws-pill" style={{ color: p.t.ink, borderColor: `${p.t.fill}88`,
                    boxShadow: `inset 0 1px 0 rgba(255,255,255,.95), 0 1px 2px rgba(10,14,20,.06), 0 6px 16px rgba(10,14,20,.08), 0 0 18px ${p.t.fill}26` }}>
                    <span className="gem" style={{ background: `radial-gradient(circle at 35% 30%, #fff 0%, ${p.t.fill} 45%, ${p.t.ink} 100%)`, boxShadow: `0 0 8px ${p.t.fill}aa` }} />
                    {p.l}</span>
                ))}
              </span>
            </figcaption>
          </figure>
        </section>

        {/* ─── WHAT YOU'LL WALK AWAY WITH ─── */}
        <section style={S}>
          <div style={{ textAlign: "center", marginBottom: 22 }}>
            <div style={KICKER}>What you'll walk away with</div>
          </div>
          <div className="fws-grid">
            {SESSION_ITEMS.map(item => (
              <div key={item.title} className="lift" style={{ ...glow(item.t, false), display: "flex", gap: 16, alignItems: "flex-start", padding: "22px 22px" }}>
                <span className="tile" style={{ width: 58, height: 58, borderRadius: 15 }}>
                  <img src={`/icons/reinvest-harvest/${item.ic}.png`} alt="" width="38" height="38" draggable="false" style={{ display: "block" }} /></span>
                <div style={{ flex: 1 }}>
                  <div style={{ ...H, fontSize: 21, lineHeight: 1.2, marginBottom: 6 }}>{item.title}</div>
                  <p style={{ fontSize: 14.5, lineHeight: 1.6, color: C.ink2, margin: 0 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── EDWARD: photo left, words right ─── */}
        <section style={S}>
          <div className="fws-split" style={{ maxWidth: 860, margin: "0 auto" }}>
            <div className="fws-photo" style={{ flex: "0 0 auto" }}>
              <span style={{ display: "block", padding: 7, borderRadius: 26, background: "linear-gradient(180deg,#FFFEFB 0%,#F3ECDF 100%)", border: `1px solid ${T.gold.fill}66`,
                boxShadow: `inset 0 1px 0 rgba(255,255,255,.95), 0 18px 40px rgba(10,14,20,.18), 0 0 30px ${T.gold.fill}2e` }}>
                <img src="/img/edward.jpg" alt="Edward Kriczky" width="230" height="230"
                  style={{ width: "min(230px, 60vw)", height: "auto", aspectRatio: "1 / 1", borderRadius: 20, objectFit: "cover", objectPosition: "center 20%", display: "block" }} />
              </span>
            </div>
            <div style={{ flex: "1 1 0", minWidth: 0 }}>
              <div style={{ ...glow(T.gold), padding: "26px 28px 24px" }}>
                <div style={{ ...H, fontSize: 26 }}>
                  Edward Kriczky, <span style={{ color: T.gold.ink }}>CEPA<sup style={{ fontSize: 12, fontWeight: 600, marginLeft: 1 }}>&#174;</sup></span>
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase", color: T.gold.ink, margin: "2px 0 14px" }}>Founder, Kriczky Virtus</div>
                <p style={{ fontSize: 15.5, lineHeight: 1.65, color: C.ink2, margin: 0 }}>
                  I help business owners in the $1M-$10M range turn their businesses into assets that generate wealth - whether they're building to sell, building to keep, or building to hand down. As a Certified Exit Planning Advisor, I bring a structured methodology to the question every owner eventually asks: <span style={{ fontStyle: "italic", color: C.ink1 }}>"What is my business actually worth, and what would it take to make it worth more?"</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── CONSENT + FOOTER ─── */}
        <footer style={{ padding: "26px 22px 50px" }}>
          <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${C.rule}, transparent)`, marginBottom: 26 }} />
          <p style={{ fontSize: 11, lineHeight: 1.6, color: C.ink4, textAlign: "center", maxWidth: 620, margin: "0 auto 28px" }}>
            By providing your information you consent to Kriczky Virtus, LLC contacting you by phone, text, or email using automated telephone dialing systems and AI to the information provided, even if the phone number is present on a state or national Do Not Call List. We do not sell your personal information. By providing this information you agree to our Privacy Policy and Terms of Service.
          </p>
          <ContactFooter />
        </footer>
      </div>
    </div>
  );
}
