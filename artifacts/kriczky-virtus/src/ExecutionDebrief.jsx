import { useEffect, useRef } from "react";
import PageTexture from "./PageTexture.jsx";
import { C, T, glow, CARD, KICKER, CREAM_CSS, FONTS, Logo, Num } from "./CreamKit.jsx";

/* Execution Debrief booking page - /execution-debrief

   Reader: attended a paid Reinvest or Harvest Workshop, holding the Partnership
   one-pager or scanning the QR from its last page. They have already spent half
   a day with Edward, so this page is short - a calendar with just enough framing
   to say what the conversation is.

   Cream (27 Nov 2026): matches /workshop-rh - the engraved ground, the cursor
   lamp and gold sheen on desktop, porcelain tiles and discs, report glow cards.
   Copy unchanged.

   ⚠️ No prefill is possible here. The one-pager is a static handout with no token
   identifying the reader, so the iClosed form starts empty. That is different
   from /reinvest-harvest/next, which has the report token. */

/* Confirmed by Edward - the Execution Debrief event, not the working session.
   ⛔ Do not swap this for the working-session URL: that event's Zap applies
   tag 5, which exits people from the RH nurture and miscounts the conversion.
   This one's Zap applies tag 86. */
const ICLOSED_DEBRIEF = "https://app.iclosed.io/e/kriczkyvirtus/execution-debrief";

/* The gold lattice the cursor lamp polishes up - same cut as /workshop-rh. */
const guilloche = (stroke, op, w) => {
  const ring = (cx, cy) => [28, 19, 10].map(r => `<circle cx='${cx}' cy='${cy}' r='${r}'/>`).join("");
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='56' height='56' viewBox='0 0 56 56'><g fill='none' stroke='${stroke}' stroke-opacity='${op}' stroke-width='${w}'>${ring(0,0)}${ring(56,0)}${ring(0,56)}${ring(56,56)}${ring(28,28)}</g></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
};
const TEX_GOLD = guilloche("#B08A3A", 0.5, 0.9);

const H = { fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, color: C.ink1, letterSpacing: "-.015em" };
const EM = { fontStyle: "italic", fontWeight: 400, color: T.gold.ink };
const col = { maxWidth: 760, margin: "0 auto", padding: "0 22px" };

const COVERS = [
  "What your real options are for executing the plan you built.",
  "How you’ll know it’s working week by week, rather than at day 90.",
  "Where this first 90-day sprint fits into the next 24 months of building both the business and your personal wealth.",
];

export default function ExecutionDebrief() {
  /* The travelling light, as on /workshop-rh: a warm glow, and the engraving
     polished to gold where it falls. Fine pointers only, never with reduced
     motion. Written to the DOM in a rAF loop - never setState per pixel. */
  const lampRef = useRef(null);
  const sheenRef = useRef(null);
  useEffect(() => {
    const lamp = lampRef.current, sheen = sheenRef.current;
    if (!lamp || !sheen) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || still) return;
    lamp.style.display = "block"; sheen.style.display = "block";

    let tx = innerWidth / 2, ty = innerHeight * 0.3, x = tx, y = ty, frame = 0, queued = false, sframe = 0;
    const onMove = (e) => { tx = e.clientX; ty = e.clientY; };
    /* the gold lattice travels with the page, in step with PageTexture's */
    const onScroll = () => { if (!queued) { queued = true; sframe = requestAnimationFrame(() => {
      queued = false; sheen.style.backgroundPosition = `0px ${-Math.round(window.scrollY)}px`; }); } };
    const tick = () => {
      x += (tx - x) * 0.09;
      y += (ty - y) * 0.09;
      lamp.style.transform = `translate3d(${x - 340}px, ${y - 340}px, 0)`;
      sheen.style.setProperty("--lx", `${x.toFixed(1)}px`);
      sheen.style.setProperty("--ly", `${y.toFixed(1)}px`);
      frame = requestAnimationFrame(tick);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    frame = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame); cancelAnimationFrame(sframe);
    };
  }, []);

  return (
    <div style={{ background: C.page, minHeight: "100vh", fontFamily: "'DM Sans',sans-serif", color: C.ink1, position: "relative", isolation: "isolate", overflowX: "hidden" }}>
      <link href={FONTS} rel="stylesheet" />
      <style>{CREAM_CSS + `
        .ed-sheen { --lx: 50vw; --ly: 30vh;
          -webkit-mask-image: radial-gradient(circle 250px at var(--lx) var(--ly), #000 0%, rgba(0,0,0,.55) 40%, transparent 100%);
                  mask-image: radial-gradient(circle 250px at var(--lx) var(--ly), #000 0%, rgba(0,0,0,.55) 40%, transparent 100%); }
        .ed-row { display: flex; gap: 18px; align-items: flex-start; padding: 16px 0; }
        .ed-row + .ed-row { border-top: 1px solid ${C.ruleLight}; }
        .ed-card { transition: box-shadow .3s ease, border-color .3s ease; }
        @media (hover: hover) and (pointer: fine) {
          .ed-card:hover { border-color: ${T.gold.fill}88 !important; box-shadow: 0 0 34px ${T.gold.fill}40, 0 10px 28px rgba(10,14,20,.08) !important; }
        }
      `}</style>
      <PageTexture />
      <div aria-hidden="true" style={{ position: "absolute", top: -80, left: "50%", transform: "translateX(-50%)", width: "min(1100px,150vw)", height: 560,
        background: `radial-gradient(ellipse at center, ${T.gold.fill}1c 0%, transparent 66%)`, pointerEvents: "none", zIndex: -1 }} />
      <div ref={lampRef} aria-hidden="true" style={{ position: "fixed", top: 0, left: 0, width: 680, height: 680, borderRadius: "50%",
        background: `radial-gradient(circle, ${T.gold.fill}38 0%, ${T.gold.fill}16 30%, transparent 64%)`,
        pointerEvents: "none", zIndex: -1, willChange: "transform", display: "none" }} />
      <div ref={sheenRef} aria-hidden="true" className="ed-sheen" style={{ position: "fixed", inset: 0, backgroundImage: TEX_GOLD,
        pointerEvents: "none", zIndex: -1, display: "none" }} />

      {/* ── NAV - the shield in a porcelain tile; not a link, this page has one way forward ── */}
      <Logo style={{ padding: "30px 22px 6px" }} />

      {/* ── HERO ── */}
      <section style={{ padding: "clamp(26px,4.4vw,44px) 0 clamp(22px,3.4vw,32px)", textAlign: "center" }}>
        <div style={{ maxWidth: 940, margin: "0 auto", padding: "0 22px" }}>
          <div style={{ ...KICKER, marginBottom: 14 }}>After the workshop</div>
          <h1 style={{ ...H, lineHeight: 1.04, letterSpacing: "-.02em", margin: 0, fontSize: "clamp(40px,8vw,78px)", textWrap: "balance" }}>
            Your Execution <span style={EM}>Debrief</span>
          </h1>
          <p style={{ fontSize: "clamp(16.5px,2.7vw,22px)", lineHeight: 1.5, color: C.ink2, maxWidth: 680, margin: "20px auto 0", textWrap: "balance" }}>
            You have your 90-day plan now. This is the hour where we tactically decide what actually gets executed first, and how.
          </p>
        </div>
      </section>

      {/* ── WHAT IT COVERS ── */}
      <section style={{ padding: "0 0 clamp(26px,4vw,38px)" }}>
        <div style={col}>
          <div className="ed-card" style={{ ...CARD, padding: "clamp(24px,4vw,36px)" }}>
            <div style={{ ...KICKER, textAlign: "center", marginBottom: 8 }}>Sixty minutes, one to one</div>
            {COVERS.map((t, i) => (
              <div key={t} className="ed-row">
                <Num n={i + 1} t={T.gold} size={36} />
                <span style={{ fontSize: "clamp(15.5px,2.1vw,17px)", lineHeight: 1.6, color: C.ink2, paddingTop: 5 }}>{t}</span>
              </div>
            ))}

            {/* The Roadmap is already theirs - this is redemption, not an offer. */}
            <div style={{ ...glow(T.green), marginTop: 22, padding: "18px 20px", display: "flex", gap: 14, alignItems: "center" }}>
              <span className="tile" style={{ width: 48, height: 48, borderRadius: 13, borderColor: `${T.green.fill}66` }}>
                <img src="/icons/roadmap-system/get-green.png" alt="" width="32" height="32" draggable="false" style={{ display: "block" }} /></span>
              <p style={{ fontSize: "clamp(14.5px,2.1vw,16.5px)", lineHeight: 1.6, color: C.ink1, margin: 0 }}>
                Booking this is also how you start the <span style={{ color: C.ink4, textDecoration: "line-through" }}>$6,000</span> <strong style={{ color: T.green.ink, fontWeight: 700 }}>Personalized Wealth Roadmap</strong> that came with your ticket.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CALENDAR ── */}
      <section id="debrief-scheduler" style={{ padding: "0 0 clamp(34px,5vw,52px)", scrollMarginTop: 24 }}>
        <div style={col}>
          <div style={{ ...KICKER, textAlign: "center" }}>Pick a time</div>
          <p style={{ fontSize: "clamp(14px,2vw,16px)", lineHeight: 1.6, color: C.ink3, textAlign: "center", maxWidth: 560, margin: "0 auto 20px" }}>
            Nothing to prepare. Bring the 90-day plan from the workshop.
          </p>
          <div id="debrief-calendar" style={{ ...glow(T.gold), padding: "clamp(10px,2vw,18px)", overflow: "hidden" }}>
            {/* Direct iframe. ⛔ Do NOT use iClosed widget.js - it races the React render. */}
            <iframe src={ICLOSED_DEBRIEF} title="Book your Execution Debrief" width="100%" height="620"
              style={{ border: "none", display: "block", borderRadius: 12, background: "#FFFFFF" }} loading="lazy" />
          </div>
        </div>
      </section>

      {/* ── DISCLOSURE ── */}
      <footer style={{ maxWidth: 940, margin: "0 auto", padding: "6px 22px 64px" }}>
        <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${C.rule}, transparent)`, marginBottom: 26 }} />
        <Logo style={{ marginBottom: 18, transform: "scale(.82)" }} />
        <p style={{ fontSize: 11.5, lineHeight: 1.65, color: C.ink4, textAlign: "center", maxWidth: 780, margin: "0 auto" }}>
          Business advisory services are provided by Kriczky Virtus, LLC. Investment advisory services are provided by Kriczky Wealth Management LLC, an Investment Advisor in the state of Pennsylvania and Virginia. Professionals are registered with Kriczky Wealth Management LLC. Edward Kriczky owns both firms, which is a conflict of interest disclosed in Form ADV. You are never required to engage either firm to work with the other, and you may use any business consultant or investment advisor you choose. Form ADV is provided before any investment advisory agreement is signed. Nothing on this page is individualized financial, tax, legal, or accounting advice, or a recommendation to pursue any particular course of action. No outcome is projected or guaranteed. Coordinate any decision with your CPA, attorney, and other advisors before acting.
        </p>
      </footer>
    </div>
  );
}
