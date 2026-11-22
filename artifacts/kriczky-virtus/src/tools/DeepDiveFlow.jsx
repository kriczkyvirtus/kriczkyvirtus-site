import React, { useEffect, useRef, useState } from "react";
import PageTexture from "../PageTexture.jsx";
import { C, T, KICKER, CREAM_CSS, FONTS, Logo, Num, HaloButton, PageCarousel, ContactFooter } from "../CreamKit.jsx";
import DeepDiveReport, { scoreTone } from "./DeepDiveReport.jsx";
import { Story } from "./FlowFrame.jsx";

/* ═══════════════════════════════════════════════════════════════
   CAPITAL DEEP-DIVE QUESTION FLOW        /tools/structural-capital, /customer-capital, /human-capital
   The landing-page feel of /workshop-rh/snapshot: a title, a progress bar, one
   dimension per glow card, and sample report pages under the card. Ten dimensions,
   then name and email, then the finished cream report (PDF download, Share) - the
   same scoring, lead payload and saved copy as the report's own gate.
   (22 Nov 2026) The real-world example opens as two faded lines and glides open on
   a tap, and choosing a score moves straight on to the next dimension, so a phone
   sees the score buttons without scrolling past the story. Back steps return.
   ═══════════════════════════════════════════════════════════════ */

const useBp = () => {
  const [mob, setMob] = useState(false);
  useEffect(() => {
    const check = () => setMob(window.innerWidth < 768);
    check(); window.addEventListener("resize", check); return () => window.removeEventListener("resize", check);
  }, []);
  return mob;
};

/* Breaks out of the 720 column so the page strip has room either side. */
const SamplePages = ({ mob, flow, A }) => (
  <section style={{ width: "min(1000px, 100vw)", marginLeft: "calc(50% - min(500px, 50vw))", padding: mob ? "44px 0 8px" : "56px 0 8px" }}>
    <div style={{ textAlign: "center", padding: "0 22px", maxWidth: 640, margin: "0 auto" }}>
      <div style={{ ...KICKER, color: A.ink }}>Your {flow.tool} report</div>
      <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: mob ? 30 : 40, lineHeight: 1.1, color: C.ink1, margin: "0 0 12px" }}>
        A look <span style={{ fontStyle: "italic", fontWeight: 500, color: A.ink }}>inside</span>
      </h2>
      <p style={{ fontSize: mob ? 14.5 : 16, lineHeight: 1.6, color: C.ink2, margin: 0 }}>
        Sample pages from a finished report. Yours is built from your scores, with your diagnosis and your first three moves, ready to download as a PDF.
      </p>
    </div>
    <div style={{ marginTop: 10 }}><PageCarousel pages={flow.samples} alt="Sample report page" /></div>
    <p style={{ fontSize: 11, color: C.ink4, textAlign: "center", fontStyle: "italic", margin: "6px 22px 0" }}>Sample business. Scores are illustrative.</p>
  </section>
);

/* module scope: a component defined inside the page would remount on every keystroke */
const CheckRow = ({ text, sub, on, onToggle, A }) => (
  <button type="button" role="checkbox" aria-checked={on} onClick={onToggle} className={`sc-chk${on ? " on" : ""}`}>
    <span className="box" aria-hidden="true">
      {on && <svg width="12" height="12" viewBox="0 0 20 20"><path d="M4.5 10.5L8.3 14.2L15.5 6.5" stroke={A.ink} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>}
    </span>
    <span><span style={{ display: "block", fontWeight: 600, color: C.ink1 }}>{text}</span>
      {sub && <span className="sub">{sub}</span>}</span>
  </button>
);

const Rate = ({ value, onChange, low, high, mob }) => {
  const t = scoreTone(value);
  return (
    <div style={{ marginTop: mob ? 12 : 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: mob ? 6 : 9 }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase", color: t ? t.ink : T.gold.ink }}>Rate yourself</span>
        <span style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 22, color: t ? t.ink : C.ink4 }}>{value || "-"}<span style={{ fontSize: 13, color: C.ink3 }}>/6</span></span>
      </div>
      <div role="radiogroup" aria-label="Your score" style={{ display: "flex", gap: mob ? 6 : 8 }}>
        {[1, 2, 3, 4, 5, 6].map(n => {
          const c = scoreTone(n), on = value === n;
          return (
            <button key={n} type="button" role="radio" aria-checked={on} aria-label={`Score ${n}`} onClick={() => onChange(n)} className="sc-score"
              style={{ "--edge": `${c.fill}aa`, "--glow": `${c.fill}55`, background: on ? `linear-gradient(135deg, #FFFFFF 30%, ${c.tint})` : undefined,
                borderColor: on ? c.fill : undefined, boxShadow: on ? `0 0 20px ${c.fill}55, 0 4px 10px rgba(10,14,20,.06)` : undefined }}>
              <span style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: mob ? 19 : 21, color: on ? c.ink : `${c.ink}99` }}>{n}</span>
            </button>
          );
        })}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 12, color: C.ink3, marginTop: 7 }}>
        <span>1 · {low}</span><span style={{ textAlign: "right" }}>6 · {high}</span>
      </div>
    </div>
  );
};

/* flow: { cfg (the report content), tool, kicker, title (JSX), intro, samples } */
export default function DeepDiveFlow({ flow }) {
  const { cfg } = flow;
  const DIMS = cfg.dims, BANDS = cfg.bands, A = cfg.accent;
  const STEPS = DIMS.length + 1;                 // the dimensions, then your details
  const mob = useBp();
  const topRef = useRef(null);
  const barRef = useRef(null);
  const timer = useRef(null);
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState({});
  const [checks, setChecks] = useState({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");
  const [done, setDone] = useState(null);       // { who, savedLink } once unlocked
  const [utm, setUtm] = useState({ s: null, c: null });
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    setUtm({ s: p.get("utm_source"), c: p.get("utm_campaign") });
    return () => clearTimeout(timer.current);
  }, []);

  const dim = DIMS[step];
  const total = DIMS.reduce((t, d) => t + (scores[d.key] || 0), 0);
  const max = DIMS.length * 6;
  const pct = Math.round((step / STEPS) * 100);
  /* On a phone the next dimension opens at the progress bar, so its score buttons sit on screen. */
  const top = () => setTimeout(() => {
    const el = window.innerWidth < 768 ? barRef.current : topRef.current;
    if (!el) return;
    window.scrollTo({ top: Math.max(0, el.getBoundingClientRect().top + window.scrollY - 10), behavior: "smooth" });
  }, 50);
  const go = (to) => { clearTimeout(timer.current); setStep(to); top(); };
  /* A score moves on by itself, after a beat so the owner sees it land. */
  const pick = (v) => {
    setScores(p => ({ ...p, [dim.key]: v }));
    clearTimeout(timer.current);
    const at = step;
    timer.current = setTimeout(() => { setStep(s => (s === at ? s + 1 : s)); top(); }, 420);
  };

  const submit = () => {
    if (!name.trim()) { setErr("Please enter your name so we can personalize your results."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setErr("Please enter a valid email address."); return; }
    setErr("");
    const band = (BANDS.find(b => total >= b.min && total <= b.max) || {}).label;
    const payload = { name: name.trim(), email: email.trim(), tool: cfg.toolSlug, toolName: `${cfg.tool} Deep-Dive`, scores,
      summary: { totalScore: total, maxScore: max, pct: Math.round((total / max) * 100), band }, timestamp: new Date().toISOString(),
      utmSource: utm.s || null, utmCampaign: utm.c || null };
    fetch("/api/lead-capture", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      .catch(e => console.error("[Lead] Fetch failed:", e));
    /* the saved copy (the link in the email, and what Share hands out) is the finished report page */
    const savedLink = new Promise(resolve => setTimeout(async () => {
      try {
        const res = await fetch("/api/store-results", { method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: name.trim(), email: email.trim(), tool: cfg.storeSlug, html: document.documentElement.outerHTML }) });
        if (!res.ok) { resolve(null); return; }
        const j = await res.json().catch(() => ({})); resolve(j.url || null);
      } catch (e) { resolve(null); }
    }, 2000));
    setDone({ who: name.trim(), savedLink });
    window.scrollTo({ top: 0 });
  };

  if (done) return <DeepDiveReport cfg={cfg} prefill={{ scores, checks, who: done.who, savedLink: done.savedLink }} />;

  const input = { width: "100%", padding: "13px 16px", borderRadius: 11, border: `1px solid ${C.rule}`, background: "#FFFFFF", color: C.ink1,
    fontSize: 16, fontFamily: "'DM Sans', sans-serif", outline: "none", boxShadow: "inset 0 1px 2px rgba(10,14,20,.05)" };
  const card = { borderRadius: 20, background: `linear-gradient(135deg, #FFFFFF 55%, ${A.tint})`, border: `1px solid ${A.fill}66`,
    boxShadow: `0 0 34px ${A.fill}2e, 0 14px 34px rgba(10,14,20,.10)` };

  return (
    <div className="ff-root" style={{ background: C.page, minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", color: C.ink1, position: "relative", isolation: "isolate" }}>
      <link href={FONTS} rel="stylesheet" />
      <style>{CREAM_CSS + `
        .ff-root { overflow-x: hidden; overflow-x: clip; }
        .sc-in:focus { border-color: ${A.fill} !important; box-shadow: 0 0 0 3px ${A.fill}33 !important; }
        .sc-chk { display: flex; gap: 12px; align-items: flex-start; width: 100%; text-align: left; cursor: pointer; padding: 11px 14px; margin-bottom: 7px;
          border-radius: 12px; border: 1px solid #E6DFD1; background: linear-gradient(180deg,#FFFEFB 0%,#F7F2E8 100%); font: 14px/1.42 'DM Sans',sans-serif; color: ${C.ink2};
          box-shadow: inset 0 1px 0 rgba(255,255,255,.95), 0 1px 2px rgba(10,14,20,.05); transition: border-color .25s ease, box-shadow .25s ease, background .25s ease; }
        .sc-chk .sub { display: block; font-size: 12.5px; color: ${C.ink3}; margin-top: 2px; line-height: 1.45; }
        .sc-chk .box { flex: 0 0 auto; width: 20px; height: 20px; margin-top: 1px; border-radius: 6px; border: 1.5px solid #CFC6B5; background: #fff;
          display: flex; align-items: center; justify-content: center; }
        .sc-chk.on { border-color: ${A.fill}; background: linear-gradient(135deg, #FFFFFF 50%, ${A.tint}); box-shadow: 0 0 0 1px ${A.fill}66, 0 0 16px ${A.fill}33; }
        .sc-chk.on .box { border-color: ${A.fill}; }
        .sc-score { flex: 1; height: 50px; border-radius: 11px; display: flex; align-items: center; justify-content: center; cursor: pointer;
          background: #FFFFFF; border: 1.5px solid ${C.ruleLight}; box-shadow: 0 1px 2px rgba(10,14,20,.05); transition: transform .2s ease, box-shadow .2s ease; }
        @media (hover: hover) and (pointer: fine) {
          .sc-chk:hover { border-color: ${A.fill}88; }
          .sc-score:hover { transform: translateY(-1px); box-shadow: 0 0 0 1px var(--edge), 0 0 18px var(--glow) !important; }
        }
        .sc-story { display: inline-flex; align-items: center; background: none; border: none; padding: 6px 0 0; cursor: pointer; font: 600 13.5px 'DM Sans',sans-serif; }
        @keyframes sc-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        .sc-step { animation: sc-in .35s ease both; }
        @media (max-width: 767px) { .sc-chk { padding: 8px 11px; margin-bottom: 6px; font-size: 13.5px; line-height: 1.35; gap: 10px; } .sc-chk .box { width: 18px; height: 18px; } .sc-chk .sub { display: none; } .sc-score { height: 46px; } }
      `}</style>
      <PageTexture />
      <div aria-hidden="true" style={{ position: "absolute", top: -80, left: "50%", transform: "translateX(-50%)", width: "min(1100px,150vw)", height: 560,
        background: `radial-gradient(ellipse at center, ${A.fill}1c 0%, transparent 66%)`, pointerEvents: "none", zIndex: -1 }} />

      <div style={{ position: "relative", maxWidth: 720, margin: "0 auto", padding: mob ? "22px 16px 50px" : "25px 40px 70px" }}>
        <div ref={topRef} />
        <Logo style={{ marginBottom: mob ? 14 : 38 }} />

        <div style={{ textAlign: "center", marginBottom: mob ? 14 : 26 }}>
          {!mob && <div style={{ ...KICKER, color: A.ink, marginBottom: 14 }}>{flow.kicker}</div>}
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: mob ? 26 : 44, lineHeight: 1.08, color: C.ink1, margin: 0, letterSpacing: "-.01em" }}>
            {flow.title(A)}
          </h1>
          {step === 0 && !mob && (
            <p style={{ fontSize: mob ? 13.5 : 16, lineHeight: mob ? 1.5 : 1.6, color: C.ink2, margin: mob ? "10px auto 0" : "14px auto 0", maxWidth: 560 }}>{flow.intro}</p>
          )}
        </div>

        <div ref={barRef} style={{ marginBottom: mob ? 12 : 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 11, color: C.ink3, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em" }}>
              {dim ? `Dimension ${step + 1} of ${DIMS.length}` : "Last step"}
            </span>
            <span style={{ fontSize: 12, color: A.ink, fontWeight: 700 }}>{pct}%</span>
          </div>
          <div style={{ height: 8, borderRadius: 999, padding: 1, background: "linear-gradient(180deg,#FFFEFB 0%,#F3ECDF 100%)", border: "1px solid #E6DFD1", boxShadow: "inset 0 1px 2px rgba(10,14,20,.06)" }}>
            <div style={{ height: "100%", borderRadius: 999, background: `linear-gradient(90deg, ${A.ink}, ${A.fill})`, width: `${Math.max(3, pct)}%`, transition: "width 0.4s ease", boxShadow: `0 0 10px ${A.fill}66` }} />
          </div>
        </div>

        <div style={{ ...card, padding: mob ? "16px 14px 16px" : "32px 32px 26px" }}>
          {dim ? (
            <div className="sc-step" key={dim.key}>
              <div style={{ display: "flex", alignItems: "center", gap: mob ? 12 : 14, marginBottom: mob ? 8 : 14 }}>
                <Num n={String(dim.num).padStart(2, "0")} t={A} size={mob ? 36 : 46} />
                <div>
                  <div style={{ fontSize: 10.5, letterSpacing: "0.16em", textTransform: "uppercase", color: A.ink, fontWeight: 700, marginBottom: 3 }}>Dimension {String(dim.num).padStart(2, "0")} of 10</div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: mob ? 21 : 28, fontWeight: 700, lineHeight: 1.1, color: C.ink1 }}>{dim.title}</div>
                </div>
              </div>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontWeight: 600, fontSize: mob ? 16.5 : 20, lineHeight: 1.25, color: A.ink, margin: mob ? "0 0 6px" : "0 0 8px" }}>{dim.subtitle}</p>
              <Story text={dim.description} mob={mob} A={A} />

              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase", color: C.ink3, margin: mob ? "12px 0 6px" : "20px 0 10px" }}>Check what's true today</div>
              {dim.checks.map((c, ci) => {
                const k = `${dim.key}-${ci}`;
                return <CheckRow key={k} text={c.text} sub={c.sub} A={A} on={!!checks[k]} onToggle={() => setChecks(p => ({ ...p, [k]: !p[k] }))} />;
              })}

              <Rate value={scores[dim.key]} onChange={pick} low={dim.lowLabel} high={dim.highLabel} mob={mob} />
            </div>
          ) : (
            <div className="sc-step">
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
                <Num n={String(DIMS.length + 1)} t={A} size={46} />
                <div>
                  <div style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: A.ink, fontWeight: 700, marginBottom: 4 }}>All ten scored</div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: mob ? 24 : 28, fontWeight: 700, lineHeight: 1.1, color: C.ink1 }}>Your answers are <span style={{ fontStyle: "italic", color: A.ink, fontWeight: 600 }}>locked in.</span></div>
                </div>
              </div>
              <p style={{ fontSize: 15, lineHeight: 1.6, color: C.ink2, margin: "0 0 18px" }}>Where should we send your report? You'll see it right away, and we'll email you a copy.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <input className="sc-in" style={input} placeholder="Full name" autoComplete="name" value={name} onChange={e => { setName(e.target.value); setErr(""); }} />
                <input className="sc-in" style={input} type="email" placeholder="Email address" autoComplete="email" value={email} onChange={e => { setEmail(e.target.value); setErr(""); }} onKeyDown={e => e.key === "Enter" && submit()} />
              </div>
              {err && <p style={{ fontSize: 13, color: T.red.ink, margin: "10px 0 0" }}>{err}</p>}
              <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: "6px 16px" }}>
                {["Your score across all ten dimensions", "Where you're strongest, and weakest", "Your first three moves, for this week", "A PDF to keep, and a link to share"].map(x => (
                  <div key={x} style={{ display: "flex", gap: 9, alignItems: "center", fontSize: 14, color: C.ink2 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><polyline points="4 12 10 18 20 6" stroke={A.ink} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>{x}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Back, as on the Snapshot. A score moves on by itself; Next shows only when you've come back to one already scored. */}
          {(step > 0 || !dim) && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginTop: mob ? 18 : 24, paddingTop: mob ? 16 : 20, borderTop: `1px solid ${C.ruleLight}` }}>
              <button className="pbtn" onClick={() => go(step - 1)} style={{ padding: "12px 22px", borderRadius: 999, fontSize: 14, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>Back</button>
              {dim
                ? (scores[dim.key] ? <HaloButton onClick={() => go(step + 1)} size={15} style={{ padding: "13px 28px" }}>Next</HaloButton> : <span />)
                : <HaloButton onClick={submit} size={15.5} style={{ padding: "15px 30px" }}>See my results</HaloButton>}
            </div>
          )}
        </div>

        <SamplePages mob={mob} flow={flow} A={A} />

        {!dim && (
          <p style={{ fontSize: 10.5, lineHeight: 1.6, color: C.ink4, textAlign: "center", maxWidth: 560, margin: "36px auto 0" }}>
            By providing your information you consent to Kriczky Virtus, LLC contacting you by phone, text, or email using automated telephone dialing systems and AI to the information provided, even if the phone number is present on a state or national Do Not Call List. We do not sell your personal information. By providing this information you agree to our Privacy Policy and Terms of Service.
          </p>
        )}
        <ContactFooter style={{ marginTop: 36 }} />
      </div>
    </div>
  );
}
