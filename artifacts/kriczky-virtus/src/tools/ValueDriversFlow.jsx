import PageTexture from "../PageTexture.jsx";
import { useState, useEffect, useRef, useMemo } from "react";
import { LIGHT, ThemeProvider, useT } from "./kvTheme.js";
import {
  GRAIN, PILLARS, PILLAR_MAX, DRIVER_KEYS, DRIVER_NAMES, ATTRACT_KEYS,
  zoneByKey, score, buildSteps, NEXT_PATH, scoreColor,
} from "./valueDriversData.js";

/* ═══════════════════════════════════════════════════════════════
   VALUE DRIVERS - QUESTION FLOW
   Two doors, one component:
     door="site"     → /tools/wmbw                 → /tools/wmbw/next (book a call)
     door="workshop" → /workshop-rh/value-drivers  → /workshop-rh/value-drivers/next (VSL)
   Mobile-first. One question per screen. Mirrors ReinvestHarvestFlow.

   Workshop link from ActiveCampaign carries the contact, so the contact
   step is skipped:  /workshop-rh/value-drivers?e=%EMAIL%&n=%FIRSTNAME%
   ═══════════════════════════════════════════════════════════════ */

/* Selecting an option advances automatically after a short beat. */
const AUTO_ADVANCE = true;
const ADVANCE_MS = 340;
/* A rating screen waits a little longer, so the chosen number visibly lights
   up in its colour before the next driver slides in. */
const RATE_ADVANCE_MS = 520;
const TOOL = "value-drivers";

/* Formats to 555-123-4567 as the user types. Digits only, capped at 10. */
const fmtPhone = (v) => {
  let d = v.replace(/\D/g, "");
  if (d.length > 10 && d[0] === "1") d = d.slice(1);
  d = d.slice(0, 10);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
};
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* Progress is saved on the device as they go, so closing the tab (or the phone
   killing it) doesn't lose their answers: reopening the same link picks up
   where they left off. Kept for 30 days, cleared once results are submitted.
   Browser storage can be missing or blocked, so every access is guarded and
   the flow works the same without it. */
const SAVE_DAYS = 30;
const saveKey = (door) => `kv-value-drivers-progress-${door}`;
const loadProgress = (door, stepsLen, linkedEmail) => {
  try {
    const raw = window.localStorage.getItem(saveKey(door));
    if (!raw) return null;
    const p = JSON.parse(raw);
    if (!p || p.v !== 1 || p.stepsLen !== stepsLen) return null;
    if (Date.now() - (p.savedAt || 0) > SAVE_DAYS * 864e5) return null;
    /* A different person's link on a shared device starts fresh. */
    if (linkedEmail && (p.contact?.email || "").toLowerCase() !== linkedEmail.toLowerCase()) return null;
    if (!Number.isInteger(p.step) || p.step < 1 || p.step >= stepsLen) return null;
    return p;
  } catch (e) { return null; }
};
const writeProgress = (door, data) => {
  try { window.localStorage.setItem(saveKey(door), JSON.stringify({ v: 1, savedAt: Date.now(), ...data })); } catch (e) { /* storage unavailable */ }
};
const clearProgress = (door) => {
  try { window.localStorage.removeItem(saveKey(door)); } catch (e) { /* storage unavailable */ }
};
const ALPHA = "ABCDEFGH";

/* Module scope, never inside the page function - a component defined inside
   remounts on every state change (the SliderBlock bug). */
const OptionCard = ({ label, selected, onClick, letter, compact }) => { const C = useT(); return (
  <div onClick={onClick} className="opt"
    style={{
      display: "flex", alignItems: "center", gap: 14, padding: compact ? "14px 16px" : "17px 16px", marginBottom: compact ? 8 : 10,
      borderRadius: 12, cursor: "pointer", userSelect: "none", transition: "all .18s ease",
      background: selected ? `${C.gold}18` : C.surface,
      border: `1.5px solid ${selected ? C.gold : C.line}`,
      boxShadow: selected ? `0 0 20px ${C.gold}22` : C.shadowCard,
    }}>
    <span style={{
      flexShrink: 0, width: 30, height: 30, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 12, fontWeight: 700, transition: "all .18s ease",
      background: selected ? C.gold : "transparent",
      border: `1.5px solid ${selected ? C.gold : C.lineHi}`,
      color: selected ? C.onAccent : C.text3,
    }}>{letter}</span>
    <span style={{ fontSize: 15.5, lineHeight: 1.35, color: selected ? C.text1 : C.text2 }}>{label}</span>
  </div>
); };

/* Example characteristics (the WMBW checklist). Doesn't score; it's there
   to make the 1–6 rating an honest one. Carried into the full report. */
const CheckRow = ({ text, sub, checked, onToggle }) => { const C = useT(); return (
  <div onClick={onToggle} className="chk"
    style={{ display: "flex", gap: 13, padding: "12px 0", cursor: "pointer", userSelect: "none", alignItems: "flex-start", borderBottom: `1px solid ${C.lineSoft}` }}>
    <svg width="20" height="20" viewBox="0 0 14 14" style={{ flexShrink: 0, marginTop: 1 }}>
      <rect x="0.75" y="0.75" width="12.5" height="12.5" rx="3"
        fill={checked ? `${C.cyan}26` : "transparent"} stroke={checked ? C.cyan : `${C.cyan}55`} strokeWidth="1.3" />
      {checked && <path d="M3.5 7L5.75 9.25L10.5 4.5" stroke={C.cyan} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />}
    </svg>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 15, lineHeight: 1.45, color: checked ? C.text1 : C.text2, transition: "color .2s" }}>{text}</div>
      {sub && <div style={{ fontSize: 13, lineHeight: 1.5, color: C.text3, marginTop: 4 }}>{sub}</div>}
    </div>
  </div>
); };

/* Example characteristics, collapsed to one full row plus a faded preview of
   the next. Opening and closing animate the height, and closing glides the box
   back into view so the reader isn't left stranded lower down the page.
   Keyed by driver in the parent, so each driver starts collapsed. */
function Characteristics({ items, checked, onToggle }) {
  const C = useT();
  const [open, setOpen] = useState(false);
  const [full, setFull] = useState(0);
  const boxRef = useRef(null);
  const restRef = useRef(null);
  const PREVIEW_H = 50;
  useEffect(() => {
    const measure = () => { if (restRef.current) setFull(restRef.current.scrollHeight); };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [items, checked]);
  const toggle = () => {
    const next = !open;
    setOpen(next);
    const el = boxRef.current;
    if (!el) return;
    if (next) {
      /* Once it has opened, glide down just far enough to show the whole list. */
      setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "nearest" }), 460);
    } else if (el.getBoundingClientRect().top < 70) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  const count = checked.filter(Boolean).length;
  const [first, ...rest] = items;
  return (
    <div ref={boxRef} style={{ scrollMarginTop: 64, padding: "14px 16px 6px", borderRadius: 14, background: C.light ? `linear-gradient(135deg, #FFFFFF 55%, ${C.cyan}0d)` : `linear-gradient(135deg, ${C.cyan}0a, ${C.cyan}03)`, border: `1px solid ${C.cyan}${C.light ? "33" : "24"}`, boxShadow: C.shadowCard }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
        <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: C.cyan, lineHeight: 1.45 }}>Example characteristics of a dominant business</span>
        {count > 0 && <span style={{ flexShrink: 0, fontSize: 12, color: C.text3 }}>{count} of {items.length}</span>}
      </div>
      {first && <CheckRow text={first.text} sub={first.sub} checked={Boolean(checked[0])} onToggle={() => onToggle(0)} />}
      {rest.length > 0 && (
        <>
          <div onClick={open ? undefined : toggle}
            style={{ position: "relative", overflow: "hidden", cursor: open ? "default" : "pointer",
              maxHeight: open ? (full || 1000) : PREVIEW_H, transition: "max-height .45s cubic-bezier(.4,0,.2,1)" }}>
            <div ref={restRef} style={{ pointerEvents: open ? "auto" : "none" }} aria-hidden={!open}>
              {rest.map((c, j) => (
                <CheckRow key={c.text} text={c.text} sub={c.sub} checked={Boolean(checked[j + 1])} onToggle={() => onToggle(j + 1)} />
              ))}
            </div>
            <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: open ? 0 : 1, transition: "opacity .3s ease",
              background: `linear-gradient(180deg, rgba(${C.fadeRgb},.15) 0%, rgba(${C.fadeRgb},.8) 45%, ${C.fadeSolid} 90%)` }} />
          </div>
          <button onClick={toggle} className="more"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, width: "100%", margin: "8px 0 6px", padding: "11px 0", borderRadius: 10, cursor: "pointer",
              background: `${C.cyan}0d`, border: `1px solid ${C.cyan}33`, color: C.cyan, fontFamily: "'DM Sans',sans-serif", fontSize: 13.5, fontWeight: 700, letterSpacing: ".02em" }}>
            {open ? "Show fewer" : `See all ${items.length} characteristics`}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .3s" }}>
              <polyline points="6 9 12 15 18 9" stroke={C.cyan} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}

/* Driver description. On a phone it opens at three lines with "Read more";
   on desktop the clamp and the button are switched off by CSS (.desc-clamp /
   .desc-more in the flow's style block). Keyed by driver in the parent. */
function Description({ text }) {
  const C = useT();
  const [open, setOpen] = useState(false);
  return (
    <div style={{ margin: "0 0 20px" }}>
      <p className={open ? "" : "desc-clamp"} style={{ fontSize: 15, lineHeight: 1.65, color: C.text2, margin: 0 }}>{text}</p>
      <button className="desc-more" onClick={() => setOpen(o => !o)}
        style={{ alignItems: "center", gap: 6, marginTop: 8, padding: 0, background: "none", border: "none", cursor: "pointer",
          color: C.gold, fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 700 }}>
        {open ? "Read less" : "Read more"}
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .3s" }}>
          <polyline points="6 9 12 15 18 9" stroke={C.gold} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}

/* Rate Yourself, 1–6 - the WMBW selector, sized for a thumb. */
const RateYourself = ({ value, onChange, lowLabel, highLabel }) => {
  const C = useT();
  const ac = value ? C.t(scoreColor(value)) : C.gold;
  return (
    <div style={{ padding: "18px 16px 16px", borderRadius: 14, marginTop: 18,
      background: value ? (C.light ? `linear-gradient(145deg, #FFFFFF 50%, ${ac}12)` : `linear-gradient(145deg, ${ac}10, ${ac}04)`) : C.surface,
      border: `1.5px solid ${value ? `${ac}66` : `${C.gold}55`}`,
      boxShadow: value ? `0 0 24px ${ac}1f` : C.shadowCard, transition: "all .3s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".14em", color: value ? ac : C.gold }}>Rate yourself</span>
        <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700, color: ac, minHeight: 26 }}>
          {value ? <>{value}<span style={{ fontSize: 13, color: C.text3, fontWeight: 400 }}>/6</span></> : null}
        </span>
      </div>
      <div style={{ display: "flex", gap: 7, marginBottom: 10 }}>
        {[1, 2, 3, 4, 5, 6].map(n => {
          const sc = C.t(scoreColor(n));
          const sel = value === n;
          return (
            <button key={n} onClick={() => onChange(n)} className="rate" aria-label={`Rate ${n} of 6`}
              style={{ flex: 1, height: 54, borderRadius: 10, cursor: "pointer", transition: "all .18s ease",
                border: `1.5px solid ${sel ? sc : `${sc}38`}`, background: sel ? `${sc}2b` : `${sc}0a`,
                color: sel ? sc : `${sc}99`, boxShadow: sel ? `0 0 16px ${sc}40` : "none",
                fontFamily: "'Playfair Display',serif", fontSize: 21, fontWeight: 700 }}>{n}</button>
          );
        })}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 10.5, lineHeight: 1.35, textTransform: "uppercase", letterSpacing: ".06em", color: C.text3 }}>
        <span style={{ maxWidth: "44%" }}>{lowLabel}</span><span style={{ maxWidth: "44%", textAlign: "right" }}>{highLabel}</span>
      </div>
    </div>
  );
};

const GoldButton = ({ onClick, children, disabled, big }) => { const C = useT(); return (
  <button className="btn" onClick={onClick} disabled={disabled}
    style={{ width: "100%", padding: big ? "20px 0" : "18px 0", marginTop: 8, borderRadius: 12, cursor: disabled ? "wait" : "pointer",
      fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: big ? 17 : 16, color: C.btnText,
      background: C.btnBg, border: `1.5px solid ${C.btnLine}`,
      opacity: disabled ? .7 : 1, transition: "all .25s ease" }}>
    {children}
  </button>
); };

/* The ten scores laid out in workbook page 7 order, so a workshop attendee
   can copy them straight onto the page. */
const WorkbookCard = ({ scores, attract, ready, zone }) => { const C = useT(); return (
  <div style={{ textAlign: "left", padding: "18px 18px 14px", borderRadius: 12, marginBottom: 22, background: C.surfaceCard, border: `1px solid ${C.gold}33`, boxShadow: C.shadowCard }}>
    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase", color: C.gold, marginBottom: 4 }}>For your workbook · page 7</div>
    <div style={{ fontSize: 13.5, color: C.text3, marginBottom: 12 }}>Copy these onto Station 02 before the workshop.</div>
    {DRIVER_KEYS.map((k, i) => (
      <div key={k}>
        {i === 0 && <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: C.t(PILLARS.attract.color), margin: "2px 0 6px" }}>Attractiveness</div>}
        {i === ATTRACT_KEYS.length && <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: C.t(PILLARS.ready.color), margin: "12px 0 6px" }}>Readiness</div>}
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, padding: "6px 0", borderBottom: `1px solid ${C.lineSoft}` }}>
          <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 13, color: C.gold, width: 22 }}>{String(i + 1).padStart(2, "0")}</span>
          <span style={{ flex: 1, fontSize: 14.5, color: C.text2 }}>{DRIVER_NAMES[k]}</span>
          <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: C.text1 }}>{scores[k]}</span>
        </div>
      </div>
    ))}
    <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginTop: 12, fontSize: 13.5, color: C.text2 }}>
      <span>Attractiveness <b style={{ color: C.t(PILLARS.attract.color) }}>{attract}/30</b></span>
      <span>Readiness <b style={{ color: C.t(PILLARS.ready.color) }}>{ready}/30</b></span>
      <span>Total <b style={{ color: C.t(zone.color) }}>{attract + ready}/60</b></span>
    </div>
  </div>
); };

export default function ValueDriversFlow({ door = "site" }) {
  /* Both doors are cream, like the reports and the workbooks. DARK is kept in
     kvTheme.js for any page that still needs it. */
  const C = LIGHT;
  return <ThemeProvider value={C}><FlowBody door={door} C={C} /></ThemeProvider>;
}

function FlowBody({ door, C }) {
  /* Contact handed over by the workshop email link, if present. */
  const linked = useMemo(() => {
    if (typeof window === "undefined") return null;
    const p = new URLSearchParams(window.location.search);
    const e = (p.get("e") || "").trim();
    const n = (p.get("n") || "").trim();
    /* Both are needed to skip the contact step: the email to match their
       registration, the first name to greet them in the results email. */
    if (door !== "workshop" || !EMAIL_RE.test(e) || !n) return null;
    return { email: e, first: n };
  }, [door]);

  const STEPS = useMemo(() => buildSteps(door, Boolean(linked)), [door, linked]);
  const TOTAL = STEPS.length;

  /* Read once, on first render. */
  const [saved] = useState(() => (typeof window === "undefined" ? null : loadProgress(door, STEPS.length, linked?.email)));
  const [step, setStep] = useState(saved?.step || 0);
  const [contact, setContact] = useState(saved?.contact || {
    first: linked?.first || "", last: "", company: "", email: linked?.email || "", phone: "",
  });
  const [answers, setAnswers] = useState(saved?.answers || {});
  const [scores, setScores] = useState(saved?.scores || {});
  const [checks, setChecks] = useState(saved?.checks || {});
  const [resumed, setResumed] = useState(Boolean(saved));
  const [err, setErr] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [token, setToken] = useState(null);
  const [captureFailed, setCaptureFailed] = useState(false);
  const topRef = useRef(null);
  const partialSent = useRef(false);

  useEffect(() => { topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); }, [step, done]);

  /* Save after every answer once they're past the contact screen. */
  useEffect(() => {
    if (done || step < 1) return;
    writeProgress(door, { step, stepsLen: STEPS.length, contact, answers, scores, checks });
  }, [door, step, contact, answers, scores, checks, done, STEPS.length]);

  const startOver = () => {
    clearProgress(door);
    setStep(0); setAnswers({}); setScores({}); setChecks({}); setResumed(false); setErr("");
    if (!linked) setContact({ first: "", last: "", company: "", email: "", phone: "" });
  };


  const S = STEPS[step];
  const { attract, ready, total, zone } = score(scores);
  const ownerTier = STEPS.find(x => x.key === "ownership")?.options
    .find(o => o.v === answers.ownership)?.tier || null;
  const nextPath = NEXT_PATH[door] || NEXT_PATH.site;

  const goNext = (t) => window.location.assign(`${nextPath}?t=${encodeURIComponent(t)}`);
  const next = () => { setResumed(false); setStep(s => Math.min(s + 1, TOTAL - 1)); };
  const back = () => { setErr(""); setResumed(false); setStep(s => Math.max(s - 1, 0)); };

  const pick = (val) => {
    setErr("");
    if (S.type === "score") setScores(p => ({ ...p, [S.key]: val }));
    else setAnswers(p => ({ ...p, [S.key]: val }));
    if (AUTO_ADVANCE) setTimeout(next, ADVANCE_MS);
  };

  const rate = (n) => {
    setErr("");
    setScores(p => ({ ...p, [S.key]: n }));
    if (AUTO_ADVANCE) setTimeout(next, RATE_ADVANCE_MS);
  };
  const toggleCheck = (key, i) => setChecks(p => {
    const arr = [...(p[key] || [])];
    arr[i] = !arr[i];
    return { ...p, [key]: arr };
  });

  /* The website door needs everything the call booking prefills; a workshop
     attendee who lost the link only needs enough to match their record. */
  const contactValid = () => {
    if (!contact.first.trim() || !contact.last.trim()) return "Please enter your first and last name.";
    if (door === "site" && !contact.company.trim()) return "Please enter your company name.";
    if (!EMAIL_RE.test(contact.email)) return "Please enter a valid email address.";
    if (door === "site" && contact.phone.replace(/\D/g, "").length < 10) return "Please enter a valid phone number.";
    return "";
  };

  const utms = () => {
    const p = new URLSearchParams(window.location.search);
    return { utmSource: p.get("utm_source") || null, utmCampaign: p.get("utm_campaign") || null };
  };
  const fullName = () => `${contact.first} ${contact.last}`.trim() || contact.first.trim() || contact.email;

  /* Capture valid contact details once, without delaying progress. Website door
     only - a workshop attendee is already on file from registration. */
  const sendPartial = () => {
    if (partialSent.current || door !== "site") return;
    partialSent.current = true;
    const body = {
      tool: TOOL, door, partial: true,
      first: contact.first.trim(), last: contact.last.trim(), name: fullName(),
      company: contact.company.trim(), email: contact.email.trim(), phone: contact.phone.trim(),
      ...utms(), timestamp: new Date().toISOString(),
    };
    fetch("/api/lead-capture", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
    }).catch(e => console.warn("[value-drivers] partial capture failed", e));
  };

  const submit = async () => {
    setSending(true);
    setCaptureFailed(false);
    const payload = {
      tool: TOOL, door, toolName: "Value Drivers",
      first: contact.first.trim(), last: contact.last.trim(), name: fullName(),
      company: contact.company.trim(), email: contact.email.trim(), phone: contact.phone.trim(),
      guess: answers.guess ?? null,
      industry: answers.industry, ownership: answers.ownership, ownerTier,
      timing: answers.timing || null, revenueBand: answers.revenue || null,
      scores,
      checks: Object.fromEntries(DRIVER_KEYS.map(k => [k, [0, 1, 2, 3].map(i => Boolean(checks[k]?.[i]))])),
      summary: {
        attractScore: attract, readyScore: ready, pillarMax: PILLAR_MAX,
        totalScore: total, maxScore: 60, pct: Math.round((total / 60) * 100),
        zone: zone.label, zoneKey: zone.key,
        guessAgreed: answers.guess ? answers.guess === zone.key : null,
      },
      ...utms(), timestamp: new Date().toISOString(),
    };
    let t = null;
    try {
      const response = await fetch("/api/lead-capture", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(`Capture failed (${response.status})`);
      ({ token: t } = await response.json());
      if (!t) throw new Error("Capture response did not include a token");
    } catch (e) {
      setCaptureFailed(true);
      console.warn("[value-drivers] lead-capture failed", e, JSON.stringify(payload));
    }
    await new Promise(r => setTimeout(r, 600));
    /* Workshop door goes straight to the workshop video page - it already shows
       the zone and the ten scores for the workbook, so no result screen here.
       The website door shows the result for a beat, then moves on, like the
       scorecard. If capture failed there's no token, so both doors fall back
       to the result screen and its manual link. */
    if (t) clearProgress(door);
    if (t && door === "workshop") { goNext(t); return; }
    setToken(t);
    setSending(false); setDone(true);
    if (t && door === "site") setTimeout(() => goNext(t), 2600);
  };

  /* ── shared styles ── */
  const shell = { background: C.bgDeep, minHeight: "100vh", fontFamily: "'DM Sans',sans-serif", color: C.text1, position: "relative", isolation: "isolate" };
  const wrap = { maxWidth: 620, margin: "0 auto", padding: "0 20px 60px" };
  const qStyle = { fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: "clamp(27px,6.6vw,38px)", lineHeight: 1.16, margin: "0 0 10px", color: C.text1 };
  const subStyle = { fontSize: 14.5, lineHeight: 1.55, color: C.text3, margin: "0 0 20px" };
  const fonts = <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet" />;
  const css = (
    <style>{`
      *{box-sizing:border-box}
      input,select{font-family:'DM Sans',sans-serif}
      body{background:${C.bgDeep}}
      .opt:hover{background:${C.surfaceHi}!important;border-color:${C.lineHover}!important}
      .prev:hover{color:${C.text1}!important;border-color:${C.lineHover}!important;background:${C.surfaceHi}!important}
      .chk:hover > div > div:first-child{color:${C.text1}!important}
      .rate:hover{transform:translateY(-1px)}
      .desc-more{display:none}
      @media (max-width:600px){
        .desc-clamp{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
        .desc-more{display:inline-flex}
      }
      .more:hover{background:${C.cyan}24!important;border-color:${C.cyan}80!important}
      .btn:hover{box-shadow:0 0 34px ${C.btnGlow}!important;border-color:${C.btnLineHover}!important}
      @media (max-width:430px) and (max-height:860px){
        .flow-wrap{padding-top:18px!important}
        .opt{padding:12px 14px!important;margin-bottom:7px!important}
        .prev{margin-top:10px!important}
      }
    `}</style>
  );
  const grain = C.grain ? <div style={{ position: "fixed", inset: 0, pointerEvents: "none", opacity: C.grain, mixBlendMode: "overlay", backgroundImage: GRAIN, backgroundSize: "128px 128px", zIndex: 0 }} /> : null;

  const PrevButton = step === 0 ? null : (
    <button onClick={back} className="prev"
      style={{ display: "inline-block", marginTop: 16, padding: "9px 24px", borderRadius: 10,
        background: C.surfaceCard, border: `1.5px solid ${C.lineHi}`,
        cursor: "pointer", color: C.text2, fontSize: 20, fontWeight: 700,
        fontFamily: "'DM Sans',sans-serif", lineHeight: 1.1, transition: "all .2s ease" }}>
      Previous
    </button>
  );

  /* ═══ RESULT ═══ */
  if (done) {
    const guessZone = answers.guess ? zoneByKey(answers.guess) : null;
    const agreed = guessZone ? guessZone.key === zone.key : null;
    const gap = attract - ready;
    const carrying = gap >= 6 ? PILLARS.attract : gap <= -6 ? PILLARS.ready : null;
    const zc = C.t(zone.color);
    const to = token ? `${nextPath}?t=${encodeURIComponent(token)}` : nextPath;
    return (
      <div style={shell} ref={topRef}>
        <PageTexture />
        {fonts}{css}{grain}
        <div style={{ ...wrap, paddingTop: 70, textAlign: "center", position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".2em", textTransform: "uppercase", color: zc, marginBottom: 14 }}>Your zone</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: "clamp(34px,8.4vw,52px)", lineHeight: 1.1, textTransform: "uppercase", letterSpacing: ".01em", color: zc, margin: "0 0 18px" }}>
            {zone.label}
          </h1>
          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontStyle: "italic", lineHeight: 1.5, color: C.text1, margin: "0 0 30px" }}>
            {agreed === null && <>{zone.line}</>}
            {agreed === true && <>You guessed {guessZone.label} - and your answers agree. That's a clear-eyed read.</>}
            {agreed === false && <>You guessed <b style={{ fontStyle: "normal" }}>{guessZone.label}</b>. Your answers put you in <b style={{ fontStyle: "normal", color: zc }}>{zone.label}</b>.</>}
          </p>

          <div style={{ display: "flex", gap: 12, marginBottom: carrying ? 14 : 30 }}>
            {[{ p: PILLARS.attract, v: attract }, { p: PILLARS.ready, v: ready }].map(({ p, v }) => { const pc = C.t(p.color); return (
              <div key={p.label} style={{ flex: 1, padding: "18px 12px", borderRadius: 12, background: C.light ? `linear-gradient(135deg,#FFFFFF 55%,${pc}12)` : `${pc}0d`, border: `1px solid ${pc}33`, boxShadow: C.shadowCard }}>
                <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: pc, marginBottom: 6 }}>{p.label}</div>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 34, fontWeight: 700, color: pc, lineHeight: 1 }}>
                  {v}<span style={{ fontSize: 15, color: C.text3 }}>/{PILLAR_MAX}</span>
                </div>
              </div>
            ); })}
          </div>
          {carrying && (
            <p style={{ fontSize: 14, lineHeight: 1.55, color: C.text2, margin: "0 0 30px" }}>
              <b style={{ color: C.t(carrying.color) }}>{carrying.label}</b> is carrying your score - {Math.abs(gap)} points ahead of the other side.
            </p>
          )}

          {door === "workshop" && <WorkbookCard scores={scores} attract={attract} ready={ready} zone={zone} />}

          <div style={{ padding: "18px 20px", borderRadius: 12, background: C.surfaceCard, border: `1px solid ${C.line}`, boxShadow: C.shadowCard }}>
            <div style={{ fontSize: 15, color: C.text1, marginBottom: 4 }}>Your full results are on their way.</div>
            <div style={{ fontSize: 13.5, color: C.text3 }}>Sent to <b style={{ color: C.text2 }}>{contact.email}</b></div>
          </div>

          {door === "site" && (
            <p style={{ fontSize: 12.5, color: C.text4, marginTop: 26 }}>Taking you to your next step…</p>
          )}
          {door === "workshop" && (
            <div style={{ marginTop: 24 }}>
              <a href={to} className="btn" style={{ display: "block", padding: "18px 0", borderRadius: 12, textDecoration: "none", fontWeight: 700, fontSize: 16, color: C.btnText, background: C.btnBg, border: `1.5px solid ${C.btnLine}` }}>
                Continue to your workshop video →
              </a>
            </div>
          )}
          {captureFailed && door === "site" && (
            <a href={nextPath} style={{ display: "inline-block", marginTop: 14, color: C.gold, fontSize: 15, fontWeight: 700, textDecoration: "none" }}>
              Continue to your next step →
            </a>
          )}
        </div>
      </div>
    );
  }

  /* ═══ FLOW ═══ */
  return (
    <div style={shell} ref={topRef}>
        <PageTexture />
      {fonts}{css}{grain}

      {/* progress */}
      <div style={{ position: "sticky", top: 0, zIndex: 10, background: `${C.bgDeep}f2`, backdropFilter: "blur(8px)" }}>
        <div style={{ height: 3, background: C.lineSoft }}>
          <div style={{ height: "100%", width: `${((step + 1) / TOTAL) * 100}%`, background: C.light ? `linear-gradient(90deg,${C.goldLight},${C.gold})` : `linear-gradient(90deg,${C.gold},${C.goldLight})`, transition: "width .35s ease", boxShadow: `0 0 10px ${C.gold}66` }} />
        </div>
        <div style={{ maxWidth: 620, margin: "0 auto", padding: "14px 20px", display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: C.text4 }}>
            {door === "workshop" ? "Workshop pre-work · Value Drivers" : "Value Drivers"}
          </span>
          <span style={{ fontSize: 13, color: C.text3 }}>{step + 1} <span style={{ color: C.text4 }}>of</span> {TOTAL}</span>
        </div>
      </div>

      <div className="flow-wrap" style={{ ...wrap, paddingTop: 26, position: "relative", zIndex: 1 }}>
        {resumed && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "11px 14px", marginBottom: 18, borderRadius: 10,
            background: `${C.green}10`, border: `1px solid ${C.green}33`, fontSize: 13.5, color: C.text1 }}>
            <span>Welcome back{contact.first ? `, ${contact.first}` : ""} - we saved your answers. Picking up where you left off.</span>
            <span style={{ display: "flex", gap: 12, flexShrink: 0 }}>
              <button onClick={startOver} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: C.text3, fontSize: 12.5, textDecoration: "underline", fontFamily: "'DM Sans',sans-serif" }}>Start over</button>
              <button onClick={() => setResumed(false)} aria-label="Dismiss" style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: C.text3, fontSize: 16, lineHeight: 1 }}>×</button>
            </span>
          </div>
        )}

        {/* ── CONTACT ── */}
        {S.type === "contact" && (
          <>
            <h1 style={qStyle}>
              {door === "workshop" ? "Before we start - confirm it's you." : "Before we start - where should we send your results?"}
            </h1>
            <p style={subStyle}>
              {door === "workshop" ? "Use the email you registered for the workshop with, so your results land on your seat." : "Your results land in your inbox the moment you finish."}
            </p>
            {[
              { k: "first", ph: "First name", type: "text" },
              { k: "last", ph: "Last name", type: "text" },
              ...(door === "site" ? [{ k: "company", ph: "Company name", type: "text" }] : []),
              { k: "email", ph: "Email address", type: "email" },
              ...(door === "site" ? [{ k: "phone", ph: "Phone number", type: "tel" }] : []),
            ].map(f => (
              <input key={f.k} type={f.type} placeholder={f.ph} value={contact[f.k]}
                onChange={e => { const v = f.k === "phone" ? fmtPhone(e.target.value) : e.target.value; setContact(c => ({ ...c, [f.k]: v })); setErr(""); }}
                inputMode={f.k === "phone" ? "tel" : undefined} maxLength={f.k === "phone" ? 12 : undefined}
                style={{ width: "100%", padding: "16px 16px", marginBottom: 10, borderRadius: 11, background: C.input, border: `1px solid ${C.inputLine}`, color: C.text1, fontSize: 15.5, outline: "none" }}
                onFocus={e => e.target.style.borderColor = `${C.gold}88`}
                onBlur={e => e.target.style.borderColor = C.inputLine} />
            ))}
            {err && <p style={{ color: C.red, fontSize: 13.5, margin: "4px 0 12px" }}>{err}</p>}
            <GoldButton onClick={() => {
              const e = contactValid();
              if (e) { setErr(e); return; }
              sendPartial();
              next();
            }}>Continue →</GoldButton>
            {/* Matches the consent wording on /free-session and the scorecard. */}
            <p style={{ fontSize: 10.5, lineHeight: 1.55, color: C.text4, textAlign: "center", marginTop: 14 }}>
              By providing your information you consent to Kriczky Virtus, LLC contacting you by phone, text, or email using automated telephone dialing systems and AI to the information provided, even if the phone number is present on a state or national Do Not Call List. We do not sell your personal information. By providing this information you agree to our Privacy Policy and Terms of Service.
            </p>
          </>
        )}

        {/* ── SCORE / CHOICE ── */}
        {(S.type === "score" || S.type === "choice") && (
          <>
            {S.pillar && (
              <div style={{ display: "inline-flex", alignItems: "center", height: 26, padding: "0 11px", borderRadius: 5, marginBottom: 14, background: `${C.t(PILLARS[S.pillar].color)}14`, border: `1px solid ${C.t(PILLARS[S.pillar].color)}40` }}>
                <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: ".12em", lineHeight: 1, textTransform: "uppercase", color: C.t(PILLARS[S.pillar].color) }}>
                  {PILLARS[S.pillar].long}
                </span>
              </div>
            )}
            <h1 style={qStyle}>{S.q}</h1>
            {S.sub ? <p style={subStyle}>{S.sub}</p> : <div style={{ height: 14 }} />}
            {S.options.map((o, i) => {
              const val = S.type === "score" ? o.s : o.v;
              const sel = S.type === "score" ? scores[S.key] === o.s : (S.key in answers && answers[S.key] === o.v);
              return <OptionCard key={o.t} label={o.t} selected={sel} onClick={() => pick(val)} letter={ALPHA[i]} compact={S.options.length > 6} />;
            })}
            {!AUTO_ADVANCE && <GoldButton onClick={next}>Next →</GoldButton>}
            {PrevButton}
          </>
        )}

        {/* ── DRIVER: check what's true, then rate 1–6 ── */}
        {S.type === "rate" && (() => {
          const p = { ...PILLARS[S.pillar], color: C.t(PILLARS[S.pillar].color) };
          const n = DRIVER_KEYS.indexOf(S.key) + 1;
          return (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
                <div style={{ display: "inline-flex", alignItems: "center", height: 26, padding: "0 11px", borderRadius: 5, background: `${p.color}14`, border: `1px solid ${p.color}40` }}>
                  <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: ".12em", lineHeight: 1, textTransform: "uppercase", color: p.color }}>{p.long}</span>
                </div>
                <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: C.text3 }}>
                  Driver {String(n).padStart(2, "0")} of 10
                </span>
              </div>
              <h1 style={qStyle}>{S.title}</h1>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: p.color, margin: "0 0 14px", lineHeight: 1.45 }}>{S.subtitle}</div>
              <Description key={`d-${S.key}`} text={S.description} />
              <Characteristics key={`c-${S.key}`} items={S.checklist} checked={checks[S.key] || []} onToggle={(i) => toggleCheck(S.key, i)} />

              <RateYourself value={scores[S.key]} onChange={rate} lowLabel={S.lowLabel} highLabel={S.highShort || S.highLabel} />
              {PrevButton}
            </>
          );
        })()}

        {/* ── INTERSTITIAL ── */}
        {S.type === "interstitial" && (
          <>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".2em", textTransform: "uppercase", color: C.gold, marginBottom: 16 }}>{S.kicker}</div>
            {S.stat && (
              <div style={{ display: "inline-block", padding: "14px 24px 16px", marginBottom: 16, borderRadius: 14, background: C.statBg, border: `1px solid ${C.goldLight}66`, boxShadow: C.statShadow }}>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(40px,11vw,58px)", fontWeight: 700, color: C.statText, lineHeight: 1, whiteSpace: "nowrap" }}>
                  {S.statPre ? `${S.statPre} ${S.stat}` : S.stat}
                </div>
              </div>
            )}
            <h1 style={{ ...qStyle, fontSize: S.stat ? "clamp(20px,4.8vw,26px)" : "clamp(27px,6.6vw,38px)", fontWeight: S.stat ? 500 : 700 }}>{S.title}</h1>
            {S.cite && <p style={{ fontSize: 12, fontStyle: "italic", color: C.text4, margin: "0 0 22px" }}>{S.cite}</p>}
            {S.body && (
              <div style={{ margin: "22px 0" }}>
                {S.body.map(b => { const bc = C.t(b.color); return (
                  <div key={b.label} style={{ padding: "16px 18px", marginBottom: 12, borderRadius: 12, background: C.light ? `linear-gradient(135deg,#FFFFFF 55%,${bc}10)` : `${bc}0a`, border: `1px solid ${bc}2e`, boxShadow: C.shadowCard }}>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: bc, marginBottom: 6 }}>{b.label}</div>
                    <div style={{ fontSize: 15, lineHeight: 1.5, color: C.text2 }}>{b.text}</div>
                  </div>
                ); })}
              </div>
            )}
            {S.list && (
              <div style={{ margin: "22px 0" }}>
                {S.list.map(item => (
                  <div key={item} style={{ display: "flex", gap: 11, alignItems: "flex-start", marginBottom: 13 }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 3 }}>
                      <polyline points="4 12 10 18 20 6" stroke={C.gold} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span style={{ fontSize: 15, lineHeight: 1.5, color: C.text2 }}>{item}</span>
                  </div>
                ))}
              </div>
            )}
            {S.foot && <p style={{ fontSize: 15, lineHeight: 1.6, color: C.text2, margin: "0 0 8px" }}>{S.foot}</p>}
            {S.divider && <div aria-hidden="true" style={{ borderTop: `2px dashed ${C.lineHi}`, margin: "6px 0 4px" }} />}
            {S.note && (
              <div style={{ marginTop: 18, padding: "14px 16px", borderRadius: 12, background: C.light ? `linear-gradient(135deg,#FFFFFF 55%,${C.cyan}0d)` : `${C.cyan}08`, border: `1px solid ${C.cyan}26`, boxShadow: C.shadowCard }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: C.cyan, marginBottom: 6 }}>{S.note.label}</div>
                <div style={{ fontSize: 14, lineHeight: 1.55, color: C.text2 }}>{S.note.text}</div>
              </div>
            )}
            <div style={{ marginTop: 18 }}><GoldButton onClick={next}>Continue →</GoldButton></div>
            {PrevButton}
          </>
        )}

        {/* ── FINAL ── */}
        {S.type === "final" && (
          <>
            <h1 style={qStyle}>That's everything.</h1>
            <p style={subStyle}>
              Your zone and your full results are ready. We'll show you where you landed, then email the complete report to <b style={{ color: C.text2 }}>{contact.email}</b>.
            </p>
            <GoldButton onClick={submit} disabled={sending} big>
              {sending ? "Scoring your answers…" : "SHOW ME MY ZONE →"}
            </GoldButton>
            <p style={{ fontSize: 11.5, lineHeight: 1.55, color: C.text4, textAlign: "center", marginTop: 16 }}>
              Educational self-assessment only - a valuation estimate, not a valuation. Not individualized financial, tax, or legal advice.
            </p>
            {PrevButton}
          </>
        )}
      </div>
    </div>
  );
}
