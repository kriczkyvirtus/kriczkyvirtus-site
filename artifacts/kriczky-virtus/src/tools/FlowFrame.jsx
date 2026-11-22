import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import PageTexture from "../PageTexture.jsx";
import { C, T, KICKER, CREAM_CSS, FONTS, Logo, Num, PageCarousel, ContactFooter } from "../CreamKit.jsx";

/* ═══════════════════════════════════════════════════════════════
   FLOW FRAME (22 Nov 2026) - the /workshop-rh/snapshot landing-page feel for the
   one-question-per-screen flows (Reinvest or Harvest Scorecard, Value Drivers, both doors):
   logo, title, a progress bar, the question in a glow card, sample report pages under it,
   then the fine print and the contact footer. The flows keep their own questions, scoring
   and submit; this only dresses them.
   ═══════════════════════════════════════════════════════════════ */

export const useBp = () => {
  const [mob, setMob] = useState(false);
  useEffect(() => {
    const check = () => setMob(window.innerWidth < 768);
    check(); window.addEventListener("resize", check); return () => window.removeEventListener("resize", check);
  }, []);
  return mob;
};

/* On a phone the next question opens at the progress bar, so its answers sit on screen. */
export const scrollToFlow = (topEl, barEl) => setTimeout(() => {
  const el = window.innerWidth < 768 ? barEl : topEl;
  if (!el) return;
  window.scrollTo({ top: Math.max(0, el.getBoundingClientRect().top + window.scrollY - 10), behavior: "smooth" });
}, 40);

export const FLOW_CSS = (A) => `
  /* clip, not hidden: a hidden overflow is still a scroll box, and a tap could nudge the whole page sideways */
  .ff-root { overflow-x: hidden; overflow-x: clip; }
  .ff-opt { display: flex; gap: 13px; align-items: center; width: 100%; text-align: left; cursor: pointer; padding: 13px 16px; margin-bottom: 8px;
    border-radius: 12px; border: 1px solid #E6DFD1; background: linear-gradient(180deg,#FFFEFB 0%,#F7F2E8 100%); font: 15px/1.38 'DM Sans',sans-serif; color: ${C.ink2};
    box-shadow: inset 0 1px 0 rgba(255,255,255,.95), 0 1px 2px rgba(10,14,20,.05); transition: border-color .22s ease, box-shadow .22s ease, background .22s ease, transform .22s ease; }
  .ff-opt .ltr { flex: 0 0 auto; width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center;
    font: 700 12px 'DM Sans',sans-serif; color: ${C.ink3}; background: #fff; border: 1px solid #DCD4C5; transition: all .22s ease; }
  .ff-opt.on { border-color: ${A.fill}; color: ${C.ink1}; background: linear-gradient(135deg, #FFFFFF 50%, ${A.tint}); box-shadow: 0 0 0 1px ${A.fill}66, 0 0 18px ${A.fill}33; }
  .ff-opt.on .ltr { background: ${A.fill}; border-color: ${A.fill}; color: #fff; }
  @media (hover: hover) and (pointer: fine) { .ff-opt:hover { transform: translateY(-1px); border-color: ${A.fill}88; color: ${C.ink1}; } }
  .ff-in { width: 100%; padding: 13px 15px; border-radius: 11px; border: 1px solid ${C.rule}; background: #FFFFFF; color: ${C.ink1}; font: 16px 'DM Sans',sans-serif;
    outline: none; box-shadow: inset 0 1px 2px rgba(10,14,20,.05); }
  .ff-in:focus { border-color: ${A.fill}; box-shadow: 0 0 0 3px ${A.fill}33; }
  .ff-story { display: inline-flex; align-items: center; background: none; border: none; padding: 6px 0 0; cursor: pointer; font: 600 13.5px 'DM Sans',sans-serif; }
  @keyframes ff-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
  .ff-step { animation: ff-in .35s ease both; }
  @media (max-width: 767px) {
    .ff-opt { padding: 11px 13px; margin-bottom: 7px; font-size: 14.5px; gap: 11px; }
    .ff-opt .ltr { width: 26px; height: 26px; }
  }
`;

/* The example: two lines that fade out, then the rest glides down on a tap. */
export const Story = ({ text, mob, A, more = "Read the rest of the example" }) => {
  const [open, setOpen] = useState(false);
  const [h, setH] = useState(null);              // null = natural height once open
  const ref = useRef(null);
  const SHUT = mob ? 46 : 52;                    // about two lines
  useLayoutEffect(() => { setOpen(false); setH(SHUT); }, [text, SHUT]);
  const toggle = () => {
    const el = ref.current; if (!el) return;
    if (!open) { setH(el.scrollHeight); setOpen(true); }
    else { setH(el.scrollHeight); requestAnimationFrame(() => requestAnimationFrame(() => setH(SHUT))); setOpen(false); }
  };
  return (
    <div style={{ marginTop: 2 }}>
      <div ref={ref} onTransitionEnd={() => open && setH(null)}
        style={{ position: "relative", overflow: "hidden", maxHeight: h == null ? "none" : h, transition: "max-height .55s cubic-bezier(.2,.7,.2,1)",
          WebkitMaskImage: open ? "none" : "linear-gradient(180deg,#000 30%,transparent 100%)", maskImage: open ? "none" : "linear-gradient(180deg,#000 30%,transparent 100%)" }}>
        <p style={{ fontSize: mob ? 13.5 : 14.5, lineHeight: mob ? 1.6 : 1.65, color: C.ink2, margin: 0 }}>{text}</p>
      </div>
      <button type="button" className="sc-story ff-story" onClick={toggle} aria-expanded={open} style={{ color: A.ink }}>
        {open ? "Show less" : more}
        <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden="true" style={{ marginLeft: 6, transform: open ? "rotate(180deg)" : "none", transition: "transform .3s ease" }}>
          <path d="M2 4.5L6 8.5L10 4.5" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
};

/* The card's header: a numbered porcelain disc, a small label, the question. */
export const CardHead = ({ n, label, labelTone, q, sub, mob, A }) => (
  <>
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: mob ? 10 : 14 }}>
      <Num n={String(n).padStart(2, "0")} t={labelTone || A} size={mob ? 36 : 42} />
      <div style={{ fontSize: 10.5, letterSpacing: "0.16em", textTransform: "uppercase", color: (labelTone || A).ink, fontWeight: 700 }}>{label}</div>
    </div>
    {q && <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: mob ? 23 : 29, fontWeight: 700, lineHeight: 1.14, color: C.ink1, margin: "0 0 8px" }}>{q}</h2>}
    {sub && <p style={{ fontSize: mob ? 13.5 : 14.5, lineHeight: 1.5, color: C.ink3, margin: "0 0 14px" }}>{sub}</p>}
    {q && !sub && <div style={{ height: mob ? 6 : 10 }} />}
  </>
);

export const Option = ({ letter, label, on, onClick }) => (
  <button type="button" role="radio" aria-checked={on} onClick={onClick} className={`ff-opt${on ? " on" : ""}`}>
    <span className="ltr" aria-hidden="true">{letter}</span><span>{label}</span>
  </button>
);

/* Back sits left like the Snapshot; the right side is whatever the step needs (Continue, Next, or nothing). */
export const NavRow = ({ onBack, right, mob }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginTop: mob ? 16 : 22, paddingTop: mob ? 14 : 18, borderTop: `1px solid ${C.ruleLight}` }}>
    {onBack ? <button className="pbtn" onClick={onBack} style={{ padding: "12px 22px", borderRadius: 999, fontSize: 14, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>Back</button> : <span />}
    {right || <span />}
  </div>
);

export default function FlowFrame({ A = T.gold, kicker, title, progress, topRef, barRef, samples, fine, children }) {
  const mob = useBp();
  return (
    <div className="ff-root" style={{ background: C.page, minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", color: C.ink1, position: "relative", isolation: "isolate" }}>
      <link href={FONTS} rel="stylesheet" />
      <style>{CREAM_CSS + FLOW_CSS(A)}</style>
      <PageTexture />
      <div aria-hidden="true" style={{ position: "absolute", top: -80, left: "50%", transform: "translateX(-50%)", width: "min(1100px,150vw)", height: 560,
        background: `radial-gradient(ellipse at center, ${A.fill}1c 0%, transparent 66%)`, pointerEvents: "none", zIndex: -1 }} />

      <div style={{ position: "relative", maxWidth: 720, margin: "0 auto", padding: mob ? "22px 16px 50px" : "25px 40px 70px" }}>
        <div ref={topRef} />
        <Logo style={{ marginBottom: mob ? 14 : 38 }} />
        <div style={{ textAlign: "center", marginBottom: mob ? 14 : 26 }}>
          {!mob && <div style={{ ...KICKER, color: A.ink, marginBottom: 14 }}>{kicker}</div>}
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: mob ? 24 : 36, lineHeight: 1.12, color: C.ink1, margin: "0 auto", maxWidth: 640, letterSpacing: "-.01em", textWrap: "balance" }}>{title}</h1>
        </div>

        <div ref={barRef} style={{ marginBottom: mob ? 12 : 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 11, color: C.ink3, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em" }}>{progress.label}</span>
            <span style={{ fontSize: 12, color: A.ink, fontWeight: 700 }}>{progress.pct}%</span>
          </div>
          <div style={{ height: 8, borderRadius: 999, padding: 1, background: "linear-gradient(180deg,#FFFEFB 0%,#F3ECDF 100%)", border: "1px solid #E6DFD1", boxShadow: "inset 0 1px 2px rgba(10,14,20,.06)" }}>
            <div style={{ height: "100%", borderRadius: 999, background: `linear-gradient(90deg, ${A.ink}, ${A.fill})`, width: `${Math.max(3, progress.pct)}%`, transition: "width 0.4s ease", boxShadow: `0 0 10px ${A.fill}66` }} />
          </div>
        </div>

        <div style={{ borderRadius: 20, background: `linear-gradient(135deg, #FFFFFF 55%, ${A.tint})`, border: `1px solid ${A.fill}66`,
          boxShadow: `0 0 34px ${A.fill}2e, 0 14px 34px rgba(10,14,20,.10)`, padding: mob ? "16px 14px 16px" : "30px 32px 24px" }}>
          {children}
        </div>

        {samples && (
          <section style={{ width: "min(1000px, 100vw)", marginLeft: "calc(50% - min(500px, 50vw))", padding: mob ? "44px 0 8px" : "56px 0 8px" }}>
            <div style={{ textAlign: "center", padding: "0 22px", maxWidth: 640, margin: "0 auto" }}>
              <div style={{ ...KICKER, color: A.ink }}>{samples.kicker}</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: mob ? 30 : 40, lineHeight: 1.1, color: C.ink1, margin: "0 0 12px" }}>
                A look <span style={{ fontStyle: "italic", fontWeight: 500, color: A.ink }}>inside</span>
              </h2>
              <p style={{ fontSize: mob ? 14.5 : 16, lineHeight: 1.6, color: C.ink2, margin: 0 }}>{samples.text}</p>
            </div>
            <div style={{ marginTop: 10 }}><PageCarousel pages={samples.pages} alt="Sample report page" /></div>
            <p style={{ fontSize: 11, color: C.ink4, textAlign: "center", fontStyle: "italic", margin: "6px 22px 0" }}>{samples.caption || "Sample business. Scores are illustrative."}</p>
          </section>
        )}

        {fine && fine.map((f, i) => (
          <p key={i} style={{ fontSize: 10.5, lineHeight: 1.6, color: C.ink4, textAlign: "center", maxWidth: 560, margin: i ? "12px auto 0" : "36px auto 0" }}>{f}</p>
        ))}
        <ContactFooter style={{ marginTop: 36 }} />
      </div>
    </div>
  );
}
