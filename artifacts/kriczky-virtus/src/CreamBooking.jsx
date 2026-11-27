import PageTexture from "./PageTexture.jsx";
import { C, T, glow, CARD, KICKER, CREAM_CSS, FONTS, Logo, ContactFooter } from "./CreamKit.jsx";

/* ═══════════════════════════════════════════════════════════════
   CREAM BOOKING PAGE - the shared layout of the iClosed booking pages
   (/roadmap-session, /book-intensive, /partner-qualify), built to match
   /free-session and /workshop-rh: the engraved ground, porcelain pills and
   tiles, report glow cards, the testimonial and the Edward card.

   Each page passes its own words; this file only decides how they look.
     tone      T.gold | T.green - the page's accent
     pill      the small line above the headline
     title     the headline (JSX, <em> for the italic accent)
     lede      the paragraph under it
     badge     optional - a second, glowing line under the lede
     note      optional - a line above the calendar
     iclosed   { src, title }  direct iframe (never widget.js)
     listLabel the kicker over the cards
     items     [{ title, desc, icon }]  icon is a PNG path
   ═══════════════════════════════════════════════════════════════ */

const H = { fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, color: C.ink1, letterSpacing: "-.01em" };
const S = { padding: "clamp(24px,4vw,40px) 22px", position: "relative" };

/* The same client quote on every booking page. */
const Testimonial = () => (
  <figure style={{ ...CARD, margin: 0, padding: "clamp(24px,4vw,34px) clamp(22px,4vw,40px)", position: "relative" }}>
    <div aria-hidden="true" style={{ position: "absolute", top: 10, left: 18, fontFamily: "'Cormorant Garamond',serif", fontSize: 72, color: T.gold.fill, opacity: 0.45, lineHeight: 1, userSelect: "none" }}>&ldquo;</div>
    <blockquote style={{ margin: 0, padding: "0 0 0 34px", fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(19px,3.4vw,23px)", lineHeight: 1.45, color: C.ink2, fontStyle: "italic" }}>
      Within 9 months of working with Edward we have implemented two core improvements in our business and both our{" "}
      <span style={{ color: C.ink1, fontWeight: 600, textDecoration: "underline", textDecorationColor: T.gold.fill, textUnderlineOffset: "4px" }}>revenue and profit are on track now to be up ~50% compared to last year.</span>{" "}
      He also helped us see that we still have a{" "}
      <span style={{ color: C.ink1, fontWeight: 700 }}>Profit Gap of $300K per year we are leaving on the table</span>{" "}
      that we are actively working to close so we can attract and retain better talent.
    </blockquote>
    <figcaption className="cb-cap">
      <span style={{ fontSize: 13, color: C.ink3, fontWeight: 600 }}>Phil C. · $3.0M Revenue · Home Services</span>
      <span className="cb-pills">
        {[{ t: T.gold, l: "Profit Gap: $300K/yr" }, { t: T.cyan, l: "Value Gap: $779K" }].map(p => (
          <span key={p.l} className="ppill cb-pill" style={{ color: p.t.ink, borderColor: `${p.t.fill}88`,
            boxShadow: `inset 0 1px 0 rgba(255,255,255,.95), 0 1px 2px rgba(10,14,20,.06), 0 6px 16px rgba(10,14,20,.08), 0 0 18px ${p.t.fill}26` }}>
            <span className="gem" style={{ background: `radial-gradient(circle at 35% 30%, #fff 0%, ${p.t.fill} 45%, ${p.t.ink} 100%)`, boxShadow: `0 0 8px ${p.t.fill}aa` }} />
            {p.l}</span>
        ))}
      </span>
    </figcaption>
  </figure>
);

/* Edward: photo left, words right. `children` is the bio paragraph. */
export const EdwardCard = ({ children }) => (
  <div className="cb-split" style={{ maxWidth: 860, margin: "0 auto" }}>
    <div className="cb-photo" style={{ flex: "0 0 auto" }}>
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
        <p style={{ fontSize: 15.5, lineHeight: 1.65, color: C.ink2, margin: 0 }}>{children}</p>
      </div>
    </div>
  </div>
);

export const CONSENT = "By providing your information you consent to Kriczky Virtus, LLC contacting you by phone, text, or email using automated telephone dialing systems and AI to the information provided, even if the phone number is present on a state or national Do Not Call List. We do not sell your personal information. By providing this information you agree to our Privacy Policy and Terms of Service.";

export const BOOKING_CSS = `
  .cb-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .cb-grid > :last-child:nth-child(odd) { grid-column: 1 / -1; }
  .cb-cap { display: flex; flex-wrap: wrap; align-items: center; gap: 10px 16px; padding: 18px 0 0 34px; }
  .cb-pills { display: flex; gap: 8px; flex-wrap: nowrap; }
  .cb-pill { height: 34px; padding: 0 14px 0 11px; font-size: 13px; }
  @media (max-width: 520px) {
    .cb-cap { padding-left: 0; }
    .cb-pills { gap: 6px; }
    .cb-pill { height: 31px; padding: 0 10px 0 9px; gap: 6px; font-size: 11.5px; }
    .cb-pill .gem { width: 7px; height: 7px; }
  }
  .cb-split { display: flex; align-items: center; gap: clamp(28px,5vw,56px); }
  @media (max-width: 760px) {
    .cb-grid { grid-template-columns: 1fr; }
    .cb-split { flex-direction: column; align-items: stretch; }
    .cb-photo { align-self: center; }
  }
`;

/* The page's ground: cream, the engraving, a soft glow behind the header. */
export const CreamPage = ({ children, tone = T.gold, width = 940, css = "" }) => (
  <div style={{ background: C.page, minHeight: "100vh", fontFamily: "'DM Sans',sans-serif", color: C.ink1, position: "relative", isolation: "isolate", overflowX: "hidden" }}>
    <link href={FONTS} rel="stylesheet" />
    <style>{CREAM_CSS + BOOKING_CSS + css}</style>
    <PageTexture />
    <div aria-hidden="true" style={{ position: "absolute", top: -80, left: "50%", transform: "translateX(-50%)", width: "min(1100px,150vw)", height: 560,
      background: `radial-gradient(ellipse at center, ${tone.fill}1c 0%, transparent 66%)`, pointerEvents: "none", zIndex: -1 }} />
    <div style={{ maxWidth: width, margin: "0 auto", position: "relative" }}>
      {/* landing page: the logo is not a way off it */}
      <Logo style={{ padding: "25px 22px 0" }} />
      {children}
    </div>
  </div>
);

/* The porcelain pill over a headline. */
export const TopPill = ({ tone = T.gold, children }) => (
  <div style={{ display: "inline-flex", alignItems: "center", maxWidth: "100%", padding: "9px clamp(13px,3.6vw,20px)", borderRadius: 999, marginBottom: 22,
    background: "linear-gradient(180deg,#FFFEFB 0%,#F5EFE3 100%)", border: `1px solid ${tone.fill}66`,
    boxShadow: `inset 0 1px 0 rgba(255,255,255,.95), 0 1px 2px rgba(10,14,20,.06), 0 6px 16px rgba(10,14,20,.08), 0 0 20px ${tone.fill}2a` }}>
    <span style={{ fontSize: "clamp(11px,3vw,12.5px)", fontWeight: 600, color: tone.ink, letterSpacing: ".01em", lineHeight: 1.35 }}>{children}</span>
  </div>
);

export default function CreamBooking({ tone = T.gold, pill, title, lede, badge, note, iclosed, listLabel, items, bio }) {
  const EM_STYLE = `.cb-h1 em { font-style: italic; font-weight: 500; color: ${tone.ink}; }`;
  return (
    <CreamPage tone={tone} css={EM_STYLE}>
      {/* ─── HERO ─── */}
      <section style={{ ...S, paddingTop: 34, textAlign: "center" }}>
        <TopPill tone={tone}>{pill}</TopPill>
        <h1 className="cb-h1" style={{ ...H, fontSize: "clamp(31px, 5.6vw, 54px)", lineHeight: 1.1, maxWidth: 820, margin: "0 auto 20px", textWrap: "balance" }}>{title}</h1>
        <p style={{ fontSize: "clamp(15px, 3.6vw, 19px)", lineHeight: 1.6, color: C.ink2, maxWidth: 740, margin: "0 auto", textWrap: "pretty" }}>{lede}</p>
        {badge && (
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginTop: 24, padding: "10px 18px 10px 10px", borderRadius: 999,
            background: `linear-gradient(135deg, #FFFFFF 40%, ${tone.tint})`, border: `1px solid ${tone.fill}77`,
            boxShadow: `0 0 22px ${tone.fill}33, 0 6px 16px rgba(10,14,20,.07)` }}>
            <span className="tile" style={{ width: 32, height: 32, borderRadius: 9 }}>
              <img src="/icons/roadmap-system/shield.png" alt="" width="22" height="22" draggable="false" style={{ display: "block" }} /></span>
            <span style={{ fontSize: 13, fontWeight: 600, color: tone.ink, lineHeight: 1.4, textAlign: "left" }}>{badge}</span>
          </div>
        )}
      </section>

      {/* ─── SCHEDULER ─── */}
      <section style={{ ...S, paddingTop: 0 }}>
        {note && <p style={{ fontSize: 13.5, color: C.ink3, textAlign: "center", margin: "0 auto 16px", maxWidth: 640 }}>{note}</p>}
        <div style={{ ...glow(tone), padding: "clamp(12px,2.4vw,24px)", overflow: "hidden" }}>
          {/* Direct iframe. Do NOT use iClosed widget.js - it races the React render. */}
          <iframe src={iclosed.src} title={iclosed.title}
            style={{ width: "100%", height: 900, border: "none", borderRadius: 12, background: "transparent", display: "block" }}
            allow="payment" scrolling="no" />
        </div>
      </section>

      {/* ─── TESTIMONIAL ─── */}
      <section style={S}><Testimonial /></section>

      {/* ─── WHAT'S IN IT ─── */}
      <section style={S}>
        <div style={{ textAlign: "center", marginBottom: 22 }}><div style={KICKER}>{listLabel}</div></div>
        <div className="cb-grid">
          {items.map(item => (
            <div key={item.title} className="lift" style={{ ...glow(tone, false), display: "flex", gap: 16, alignItems: "flex-start", padding: "22px 22px" }}>
              <span className="tile" style={{ width: 58, height: 58, borderRadius: 15 }}>
                <img src={item.icon} alt="" width="38" height="38" draggable="false" style={{ display: "block" }} /></span>
              <div style={{ flex: 1 }}>
                <div style={{ ...H, fontSize: 21, lineHeight: 1.2, marginBottom: 6 }}>{item.title}</div>
                <p style={{ fontSize: 14.5, lineHeight: 1.6, color: C.ink2, margin: 0 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── EDWARD ─── */}
      <section style={S}><EdwardCard>{bio}</EdwardCard></section>

      {/* ─── CONSENT + FOOTER ─── */}
      <footer style={{ padding: "26px 22px 50px" }}>
        <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${C.rule}, transparent)`, marginBottom: 26 }} />
        <p style={{ fontSize: 11, lineHeight: 1.6, color: C.ink4, textAlign: "center", maxWidth: 620, margin: "0 auto 28px" }}>{CONSENT}</p>
        <ContactFooter />
      </footer>
    </CreamPage>
  );
}
