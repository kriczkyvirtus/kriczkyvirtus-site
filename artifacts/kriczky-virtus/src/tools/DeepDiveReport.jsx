import { useEffect, useRef, useState } from "react";
import { texBg } from "./reportTexture";

/* ═══════════════════════════════════════════════════════════════
   DEEP-DIVE REPORT - the shared cream letter-page report for the capital deep dives
   (Structural, Customer, Human). Built from StructuralCapitalV2 (Oct 2026); each tool
   passes its own content in `cfg` (see StructuralCapitalV2.jsx for the shape).
   prefill: the question flow hands over scores, ticks and name once unlocked, and this
   renders as the finished report - no gate.
   ═══════════════════════════════════════════════════════════════ */
/* ═══════════════════════════════════════════════════════════════
   THE DIAGNOSTIC FRAME (v2): fixed US Letter pages, scaled to fit
   ═══════════════════════════════════════════════════════════════
   Laid out once at 816 × 1056 px (8.5 × 11 in at 96 dpi) and scaled to the
   screen, like the Reinvest or Harvest and Value Drivers reports: the same
   layout on every device, and a real PDF download. No viewport-meta hack.
   Cream pages, engraved texture, porcelain tiles, a dark cover. */

const PAGE_W = 816, PAGE_H = 1056;
const L = {
  page: "#F2EEE6", desk: "#DDD6C8", card: "#FFFFFF",
  ink: "#0A0E14", ink2: "#3E4652", ink3: "#6B6459", ink4: "#8C8476", rule: "#C9C2B4", ruleLight: "#E2DBCD",
};
/* Every colour as ink (text on cream), fill (bars, glows) and tint (washes). */
export const TONE = {
  red:   { ink: "#B4403F", fill: "#F87171", tint: "#F6E3DF" },
  amber: { ink: "#9A6A00", fill: "#FBBF24", tint: "#F5EAD0" },
  gold:  { ink: "#7A5C1E", fill: "#C8A24E", tint: "#F1E7D0" },
  green: { ink: "#1B7A57", fill: "#34D399", tint: "#E3EEE6" },
  cyan:  { ink: "#0E7490", fill: "#22D3EE", tint: "#E1ECEE" },
  blue:  { ink: "#1F5F99", fill: "#60A5FA", tint: "#E2E9F2" },
  purple:{ ink: "#5B45A8", fill: "#A78BFA", tint: "#EAE5F4" },
};
export const scoreTone = (n) => (!n ? null : TONE[n <= 2 ? "red" : n === 3 ? "amber" : n === 4 ? "gold" : n === 5 ? "cyan" : "green"]);
/* BANDS carry the dark-theme fill; map it back to a tone. */
const bandTone = (b, A) => Object.values(TONE).find(t => t.fill === b.color) || A;
const pad2 = (n) => String(n).padStart(2, "0");
const ICONS = "/icons/roadmap-system";
const TOTAL_PAGES_BASE = 14;
const TOTAL_PAGES_WITH_MOVES = 15;

const CSS = `
  .kvd *{box-sizing:border-box}
  .kvd{background:${L.desk};color:${L.ink};font-family:'DM Sans',sans-serif;-webkit-font-smoothing:antialiased;min-height:100vh;
    -webkit-text-size-adjust:100%;text-size-adjust:100%;padding-bottom:24px}
  .kvd .pw{margin:0 auto;position:relative}
  .kvd .page{position:absolute;top:0;left:0;width:${PAGE_W}px;height:${PAGE_H}px;transform-origin:top left;overflow:hidden;
    background:${L.page};box-shadow:0 1px 3px rgba(10,14,20,.10),0 14px 40px rgba(10,14,20,.16);padding:58px 64px 0}
  .kvd .runhead{display:flex;justify-content:space-between;align-items:baseline;font-size:11px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:${L.ink3};margin-bottom:34px}
  .kvd .runhead b{font-family:'Cormorant Garamond',serif;font-size:15px;letter-spacing:.14em;color:${L.ink2};font-weight:600}
  .kvd .folio{position:absolute;left:64px;right:64px;bottom:34px;display:flex;justify-content:space-between;align-items:baseline;
    border-top:1px solid ${L.ruleLight};padding-top:12px;font-size:12px;color:${L.ink3}}
  .kvd .folio b{font-family:'Cormorant Garamond',serif;font-size:14px;letter-spacing:.12em;text-transform:uppercase;font-weight:600}
  .kvd .kicker{font-size:12px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;margin-bottom:10px}
  .kvd h2{font-family:'Cormorant Garamond',serif;font-weight:600;font-size:46px;line-height:1.06;margin:0 0 16px;letter-spacing:-.005em}
  .kvd h2 em{font-weight:500;color:${TONE.gold.ink}}
  .kvd p{margin:0}
  .kvd .body{font-size:16px;line-height:1.6;color:${L.ink2}}
  .kvd .card{background:${L.card};border-radius:14px;border:1px solid ${L.ruleLight};
    box-shadow:0 1px 2px rgba(10,14,20,.06),0 10px 26px rgba(10,14,20,.08)}
  .kvd .tile{display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;
    background:linear-gradient(180deg,#FFFEFB 0%,#F7F2E8 100%);border:1px solid #E6DFD1;
    box-shadow:inset 0 1px 0 rgba(255,255,255,.9),0 1px 2px rgba(10,14,20,.06),0 10px 22px rgba(10,14,20,.13)}
  .kvd .tile img{display:block}
  .kvd .num{font-family:'Playfair Display',serif;font-weight:700;line-height:1}
  .kvd .tap{cursor:pointer;user-select:none;-webkit-tap-highlight-color:transparent}
  .kvd .sbtn{transition:box-shadow .2s ease,transform .2s ease,border-color .2s ease,background .2s ease}
  .kvd .cta{transition:box-shadow .3s ease,transform .3s ease}
  @media (hover:hover) and (pointer:fine){
    .kvd .sbtn:hover{transform:translateY(-1px);box-shadow:0 0 0 1px var(--edge),0 0 22px var(--glow),0 8px 18px rgba(10,14,20,.08)!important}
    .kvd .chk:hover{background:#FBF8F2}
    .kvd .cta:hover{box-shadow:0 0 44px rgba(200,162,78,.55),0 10px 26px rgba(10,14,20,.25)!important;transform:translateY(-1px)}
  }
  .kvd .bar{position:sticky;top:0;z-index:5;display:flex;justify-content:center;gap:10px;padding:10px 12px;background:rgba(221,214,200,.92);backdrop-filter:blur(6px)}
  .kvd .bar button{font-family:'DM Sans',sans-serif;font-size:14px;font-weight:700;letter-spacing:.04em;padding:9px 18px;border-radius:9px;cursor:pointer;
    color:#F2EEE6;background:#0A0E14;border:1px solid #0A0E14}
  .kvd .bar button:disabled{opacity:.7;cursor:progress}
  .kvd .bar button.ghost{color:${L.ink};background:transparent;border-color:${L.rule}}
  .kvd .gate input{width:100%;padding:14px 16px;border-radius:10px;background:#fff;border:1px solid ${L.rule};color:${L.ink};
    font:16px 'DM Sans',sans-serif;outline:none;margin-bottom:10px}
  .kvd .gate input:focus{border-color:${TONE.gold.fill};box-shadow:0 0 0 3px ${TONE.gold.fill}33}
  @page{size:letter;margin:0}
  @media print{
    html,body{background:#fff!important}
    .kvd{background:#fff;min-height:0;padding:0}
    .kvd .bar,.kvd .glow,.kvd .gate{display:none!important}
    .kvd .pw{width:8.5in!important;height:11in!important;margin:0!important;page-break-after:always;break-after:page}
    .kvd .page{transform:none!important;box-shadow:none;-webkit-print-color-adjust:exact;print-color-adjust:exact}
  }
`;

/* Fit pages to the width available - the same layout on every screen. */
function usePageScale() {
  const ref = useRef(null);
  const [s, setS] = useState(1);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const fit = () => {
      const w = el.clientWidth;
      const gutter = w < 600 ? 10 : 32;
      setS(Math.min(1, (w - gutter * 2) / PAGE_W));
    };
    fit();
    if (typeof ResizeObserver === "undefined") { window.addEventListener("resize", fit); return () => window.removeEventListener("resize", fit); }
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, s];
}

/* ── shared pieces (module scope, so nothing remounts on render) ── */

const Page = ({ s, n, total, right, dark, tex = "mark", tool, children }) => (
  <div className="pw" style={{ width: PAGE_W * s, height: PAGE_H * s, marginBottom: 18 * s + 6 }}>
    <div className="page" style={{ transform: `scale(${s})`, ...(dark ? { ...texBg("cover", "linear-gradient(160deg,#141B26 0%,#0A0E14 72%)"), color: "#E8ECF1" } : texBg(tex, L.page)) }}>
      {!dark && <div className="runhead"><b>Kriczky Virtus</b><span>{right}</span></div>}
      {children}
      {!dark && <div className="folio"><b>{tool} Deep-Dive</b><span>{n} / {total}</span></div>}
    </div>
  </div>
);

const Tile = ({ size = 64, children }) => (
  <span className="tile" style={{ width: size, height: size, borderRadius: Math.round(size * 0.27) }}>{children}</span>
);
const IconTile = ({ src, size = 56 }) => (
  <Tile size={size}><img src={src} alt="" width={Math.round(size * 0.66)} height={Math.round(size * 0.66)} /></Tile>
);

const CheckItem = ({ text, sub, checked, onToggle, A }) => (
  <div className="tap chk" role="checkbox" aria-checked={checked} tabIndex={0} onClick={onToggle}
    onKeyDown={e => (e.key === " " || e.key === "Enter") && (e.preventDefault(), onToggle())}
    style={{ display: "flex", gap: 14, padding: "9px 18px", alignItems: "flex-start", borderTop: `1px solid ${L.ruleLight}` }}>
    <svg width="20" height="20" viewBox="0 0 20 20" style={{ flexShrink: 0, marginTop: 1 }} aria-hidden="true">
      <rect x="1" y="1" width="18" height="18" rx="5" fill={checked ? A.tint : "#fff"} stroke={checked ? A.fill : L.rule} strokeWidth="1.5" />
      {checked && <path d="M5.5 10.2L8.6 13.2L14.6 6.9" stroke={A.ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />}
    </svg>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.38, color: L.ink }}>{text}</div>
      {sub && <div style={{ fontSize: 12.5, lineHeight: 1.4, color: L.ink3, marginTop: 2 }}>{sub}</div>}
    </div>
  </div>
);

const ScoreSelector = ({ value, onChange, lowLabel, highLabel }) => {
  const t = scoreTone(value);
  return (
    <div className="card" style={{ padding: "14px 20px 12px", marginTop: 12, ...(t ? { borderColor: `${t.fill}88`, boxShadow: `0 0 26px ${t.fill}30, 0 10px 26px rgba(10,14,20,.08)` } : {}) }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
        <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase", color: t ? t.ink : TONE.gold.ink }}>Rate yourself</span>
        <span className="num" style={{ fontSize: 26, color: t ? t.ink : L.ink4 }}>{value || "-"}<span style={{ fontSize: 15, color: L.ink3 }}>/6</span></span>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 9 }}>
        {[1, 2, 3, 4, 5, 6].map(n => {
          const c = scoreTone(n); const sel = value === n;
          return (
            <div key={n} className="tap sbtn" role="radio" aria-checked={sel} tabIndex={0} aria-label={`Score ${n}`}
              onClick={() => onChange(n)} onKeyDown={e => (e.key === " " || e.key === "Enter") && (e.preventDefault(), onChange(n))}
              style={{ flex: 1, height: 46, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", "--edge": `${c.fill}aa`, "--glow": `${c.fill}55`,
                background: sel ? `linear-gradient(135deg, #FFFFFF 30%, ${c.tint})` : "#FFFFFF",
                border: `1.5px solid ${sel ? c.fill : L.ruleLight}`,
                boxShadow: sel ? `0 0 20px ${c.fill}55, 0 4px 10px rgba(10,14,20,.06)` : "0 1px 2px rgba(10,14,20,.05)" }}>
              <span className="num" style={{ fontSize: 21, color: sel ? c.ink : `${c.ink}99` }}>{n}</span>
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: L.ink3 }}>
        <span>{lowLabel}</span><span>{highLabel}</span>
      </div>
    </div>
  );
};

/* The black button with gold text and glow - the house primary CTA. */
const CtaBtn = ({ href, children }) => (
  <a className="cta" href={href} target="_blank" rel="noopener noreferrer"
    style={{ display: "inline-block", padding: "16px 34px", borderRadius: 12, textDecoration: "none", fontSize: 15, fontWeight: 700, letterSpacing: ".06em",
      color: "#C8A24E", background: "linear-gradient(160deg,#141B26 0%,#0A0E14 72%)", border: "1px solid #2A2213",
      boxShadow: "0 0 30px rgba(200,162,78,.35), 0 8px 20px rgba(10,14,20,.22)" }}>{children}</a>
);

/* The page is a picture in the PDF: render each one with html2canvas and lay a
   real link over every <a>, so the CTA still works in the file. */
async function buildPdf(root, filename) {
  if (document.fonts && document.fonts.ready) await document.fonts.ready;
  const [h2c, jspdf] = await Promise.all([import("html2canvas"), import("jspdf")]);
  const html2canvas = h2c.default || h2c;
  const JsPDF = jspdf.jsPDF || jspdf.default;
  const pages = Array.from(root.querySelectorAll(".page"));
  const pdf = new JsPDF({ unit: "pt", format: "letter", compress: true });
  for (let i = 0; i < pages.length; i++) {
    const canvas = await html2canvas(pages[i], {
      scale: 2, useCORS: true, logging: false, backgroundColor: "#ffffff",
      width: PAGE_W, height: PAGE_H, windowWidth: PAGE_W + 200,
      onclone: (doc, el) => {
        el.style.transform = "none"; el.style.boxShadow = "none";
        el.querySelectorAll(".glow").forEach(g => { g.style.display = "none"; });
        const win = doc.defaultView;
        el.querySelectorAll("*").forEach(n => {
          const bs = win.getComputedStyle(n).boxShadow;
          if (!bs || bs.indexOf("inset") < 0) return;
          const outer = bs.split(/,(?![^(]*\))/).filter(x => x.indexOf("inset") < 0).join(",");
          n.style.boxShadow = outer || "none";
        });
      },
    });
    if (i) pdf.addPage("letter", "portrait");
    pdf.addImage(canvas.toDataURL("image/jpeg", 0.85), "JPEG", 0, 0, 612, 792, undefined, "FAST");
    canvas.width = 0; canvas.height = 0;
    const box = pages[i].getBoundingClientRect();
    const k = 612 / box.width;
    pages[i].querySelectorAll("a[href]").forEach(a => {
      const r = a.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const url = new URL(a.getAttribute("href"), window.location.origin).href;
      pdf.link((r.left - box.left) * k, (r.top - box.top) * k, r.width * k, r.height * k, { url });
    });
  }
  pdf.save(filename);
}

/* =================== EMAIL GATE =================== */
/* Sits between the pages, outside the scaled frame, so the form is full size
   on a phone (16px inputs: iOS doesn't zoom). Same payload as v1. */
const EmailGate = ({ toolName, toolSlug, storeSlug, scores, summary, onUnlock, onStored }) => {
  const [gName, setGName] = useState("");
  const [gEmail, setGEmail] = useState("");
  const [gError, setGError] = useState("");
  const [utm, setUtm] = useState({ s: null, c: null });
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    setUtm({ s: p.get("utm_source"), c: p.get("utm_campaign") });
  }, []);
  const submit = () => {
    if (!gName.trim()) { setGError("Please enter your name so we can personalize your results."); return; }
    if (!gEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(gEmail)) { setGError("Please enter a valid email address."); return; }
    setGError("");
    const name = gName.trim(), email = gEmail.trim();
    const payload = { name, email, tool: toolSlug, toolName, scores, summary, timestamp: new Date().toISOString(), utmSource: utm.s || null, utmCampaign: utm.c || null };
    fetch("/api/lead-capture", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      .catch(err => console.error("[Lead] Fetch failed:", err));
    onUnlock(name);
    /* The saved copy's link (the one in the email) is what Share hands out. */
    const stored = new Promise(resolve => setTimeout(async () => {
      try {
        const res = await fetch("/api/store-results", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, tool: storeSlug, html: document.documentElement.outerHTML }) });
        if (!res.ok) { console.error("[Tool] Failed to store results:", res.status); resolve(null); return; }
        const j = await res.json().catch(() => ({}));
        resolve(j.url || null);
      } catch (err) { console.error("[Tool] Store results failed:", err); resolve(null); }
    }, 2000));
    if (onStored) onStored(stored);
  };
  const g = TONE.gold;
  return (
    <div className="gate" style={{ maxWidth: 520, margin: "10px auto 34px", padding: "0 16px" }}>
      <div className="card" style={{ ...texBg("light", "#FFFFFF"), padding: "34px 28px 26px", textAlign: "center", borderColor: `${g.fill}66`, boxShadow: `0 0 34px ${g.fill}30, 0 14px 34px rgba(10,14,20,.12)` }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}><IconTile src={`${ICONS}/shield.png`} size={60} /></div>
        <h2 style={{ fontSize: 36, margin: "0 0 10px" }}>Your answers are <em>locked in.</em></h2>
        <p className="body" style={{ fontSize: 15.5, marginBottom: 20 }}>Enter your name and email to see your personalized results, scores, and recommended next steps.</p>
        <input type="text" placeholder="Full name" autoComplete="name" value={gName} onChange={e => { setGName(e.target.value); setGError(""); }} />
        <input type="email" placeholder="Email address" autoComplete="email" value={gEmail} onChange={e => { setGEmail(e.target.value); setGError(""); }} onKeyDown={e => e.key === "Enter" && submit()} />
        {gError && <p style={{ fontSize: 13, color: TONE.red.ink, margin: "0 0 10px", textAlign: "left" }}>{gError}</p>}
        <button className="cta" onClick={submit} style={{ width: "100%", padding: "15px 20px", borderRadius: 12, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 700, letterSpacing: ".04em",
          color: "#C8A24E", background: "linear-gradient(160deg,#141B26 0%,#0A0E14 72%)", border: "1px solid #2A2213", boxShadow: "0 0 30px rgba(200,162,78,.35), 0 8px 20px rgba(10,14,20,.22)" }}>
          See My Personalized Results
        </button>
        <p style={{ fontSize: 12, color: L.ink3, marginTop: 12 }}>Your data stays with you. We will send you a copy of your results.</p>
        <div style={{ textAlign: "left", marginTop: 20, paddingTop: 16, borderTop: `1px solid ${L.ruleLight}` }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase", color: g.ink, marginBottom: 10 }}>What you will get</div>
          {["Your personalized scores across every dimension", "Specific areas where your business is strongest and weakest", "Prioritized recommendations to improve your score", "A clear picture of where you stand vs. best-in-class peers"].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 7 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }} aria-hidden="true"><polyline points="4 12 10 18 20 6" stroke={g.ink} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <span style={{ fontSize: 14, color: L.ink2 }}>{item}</span>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 10.5, color: L.ink4, lineHeight: 1.5, marginTop: 12, textAlign: "left" }}>
          By providing your information you consent to Kriczky Virtus, LLC contacting you by phone, text, or email using automated telephone dialing systems and AI to the information provided, even if the phone number is present on a state or national Do Not Call List. We do not sell your personal information. By providing this information you agree to our Privacy Policy and Terms of Service.
        </p>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */
/* prefill: the question flow (/tools/structural-capital) hands over the owner's scores, ticks and
   name once they've unlocked, and this renders as their finished report - no gate. */
export default function DeepDiveReport({ cfg, prefill = null }) {
  const { tool: TOOL, accent: A, dims: DIMS, bands: BANDS } = cfg;
  const P = (props) => <Page tool={TOOL} {...props} />;
  const [scores, setScores] = useState(() => prefill?.scores || {});
  const [checks, setChecks] = useState(() => prefill?.checks || {});
  const [gateUnlocked, setGateUnlocked] = useState(() => !!prefill);
  const [who, setWho] = useState(() => prefill?.who || "");
  const [busy, setBusy] = useState(false);
  const [shareLabel, setShareLabel] = useState("Share");
  const savedLink = useRef(prefill?.savedLink || null);
  const [ref, s] = usePageScale();

  const setScore = (key, val) => setScores(p => ({ ...p, [key]: val }));
  const toggleCheck = (dimKey, idx) => setChecks(p => { const k = `${dimKey}-${idx}`; return { ...p, [k]: !p[k] }; });

  const allScored = DIMS.every(d => scores[d.key]);
  const totalScore = DIMS.reduce((t, d) => t + (scores[d.key] || 0), 0);
  const maxScore = DIMS.length * 6;
  const activeBand = allScored ? BANDS.find(b => totalScore >= b.min && totalScore <= b.max) : null;
  const sorted = [...DIMS].filter(d => scores[d.key]).sort((a, b) => scores[a.key] - scores[b.key]);
  const lowestTwo = sorted.slice(0, 2);
  const lowestThree = sorted.slice(0, 3);
  const unlocked = allScored && gateUnlocked;
  const total = unlocked ? TOTAL_PAGES_WITH_MOVES : TOTAL_PAGES_BASE;
  const scoredCount = DIMS.filter(d => scores[d.key]).length;
  let n = 1;   /* the cover is page 1 and carries no folio */

  const download = async () => {
    setBusy(true);
    try { await buildPdf(ref.current, `${TOOL.replace(/ /g, "-")}-Deep-Dive${who ? "-" + who.replace(/[^A-Za-z0-9]+/g, "-") : ""}.pdf`); }
    catch (e) { window.print(); }
    finally { setBusy(false); }
  };

  /* Share copies the link to the saved results (the same one emailed); until
     that's ready, it waits for it. Falls back to this page's address. */
  const share = async () => {
    setShareLabel("Preparing link...");
    const url = (savedLink.current && await savedLink.current) || window.location.href;
    try {
      if (navigator.share && window.matchMedia("(pointer: coarse)").matches) {
        await navigator.share({ title: `${TOOL} Deep-Dive`, url });
        setShareLabel("Share");
        return;
      }
      await navigator.clipboard.writeText(url);
    } catch (e) {
      if (e && e.name === "AbortError") { setShareLabel("Share"); return; }
      const ta = document.createElement("textarea");
      ta.value = url; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); } catch (e2) { /* nothing more to try */ }
      ta.remove();
    }
    setShareLabel("Link copied");
    setTimeout(() => setShareLabel("Share"), 1800);
  };

  return (
    <div className="kvd" ref={ref}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600&family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet" />
      <style>{CSS}</style>
      <div className="bar">
        {unlocked
          ? <>
              <button disabled={busy} onClick={download}>{busy ? "Preparing your PDF..." : "Download PDF"}</button>
              <button className="ghost" onClick={share}>{shareLabel}</button>
            </>
          : <span style={{ fontSize: 13, fontWeight: 600, color: L.ink2, padding: "9px 0" }}>{scoredCount} of {DIMS.length} scored</span>}
      </div>
      <div className="pages" style={{ padding: "14px 0 10px" }}>

        {/* ═══ PAGE 1: COVER ═══ */}
        <P s={s} dark>
          <div className="glow" style={{ position: "absolute", top: "-10%", left: "8%", width: "84%", height: "58%", background: "radial-gradient(ellipse at center, rgba(200,162,78,.16) 0%, transparent 62%)", pointerEvents: "none" }} />
          <div style={{ position: "relative", height: "100%", display: "flex", flexDirection: "column", paddingBottom: 56 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", fontSize: 11, fontWeight: 700, letterSpacing: ".18em", textTransform: "uppercase", color: "#8A94A3" }}>
              <b style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 15, letterSpacing: ".14em", color: "#C8A24E", fontWeight: 600 }}>Kriczky Virtus</b>
              <span>Deep-Dive Assessment</span>
            </div>
            <div style={{ marginTop: 74, textAlign: "center" }}>
              <img src="/icons/roadmap-system/shield.png" alt="" aria-hidden="true" width={80} height={80} style={{ display: "inline-block", marginBottom: 16, filter: "drop-shadow(0 6px 14px rgba(0,0,0,.45))" }} />
              <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 600, fontSize: 74, lineHeight: 1, margin: "0 0 12px", letterSpacing: "-.01em" }}>
                {TOOL.replace(" Capital", "")} <em style={{ fontWeight: 500, color: "#C8A24E" }}>Capital</em>
              </h1>
              <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: ".3em", textTransform: "uppercase", color: "#E8ECF1", marginBottom: 12 }}>Deep-Dive</div>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontStyle: "italic", color: "#A9B2BF" }}>{cfg.coverSub}</div>
            </div>

            <div style={{ marginTop: 34, padding: "18px 22px", borderRadius: 14, background: "rgba(255,255,255,.04)", border: "1px solid rgba(200,162,78,.28)" }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".18em", textTransform: "uppercase", color: "#C8A24E", marginBottom: 8 }}>The Core Principle</div>
              {cfg.principle(A).map((para, i) => (
                <div key={i} style={{ fontSize: 14, lineHeight: 1.6, color: "#C3CAD4", ...(i ? { marginTop: 10, paddingTop: 10, borderTop: "1px solid rgba(255,255,255,.08)" } : {}) }}>{para}</div>
              ))}
            </div>
            {cfg.stat && (
              <div style={{ marginTop: 12, padding: "11px 18px", borderRadius: 12, background: `${A.fill}12`, border: `1px solid ${A.fill}40`, fontSize: 13.5, lineHeight: 1.55, color: "#C3CAD4" }}>{cfg.stat(A)}</div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8, marginTop: 20 }}>
              {DIMS.map(d => {
                const t = scoreTone(scores[d.key]);
                return (
                  <div key={d.key} style={{ padding: "8px 12px", borderRadius: 999, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    background: t ? `${t.fill}1f` : "rgba(255,255,255,.035)", border: `1px solid ${t ? `${t.fill}88` : "rgba(255,255,255,.10)"}` }}>
                    <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: ".05em", textTransform: "uppercase", color: t ? t.fill : "#8A94A3", textAlign: "center" }}>{d.title}</span>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: "auto", textAlign: "center", fontSize: 13, color: "#8A94A3", fontStyle: "italic" }}>Score yourself 1–6 on each of the 10 dimensions. Your results update automatically on the summary page.</div>
          </div>
        </P>

        {/* ═══ PAGE 2: HOW TO USE ═══ */}
        <P s={s} n={++n} total={total} right="How to use this diagnostic" tex="light">
          <div className="kicker" style={{ color: TONE.green.ink }}>How to use this diagnostic</div>
          <h2 style={{ fontSize: 38, marginBottom: 12 }}>{cfg.howHead}</h2>
          <p className="body" style={{ fontSize: 14.5, marginBottom: 10 }}>{cfg.howP1}</p>
          <p className="body" style={{ fontSize: 14.5, marginBottom: 16 }}>{cfg.howP2}</p>
          <div className="card" style={{ padding: "13px 18px", marginBottom: 12, borderColor: `${TONE.cyan.fill}66` }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: TONE.cyan.ink, marginBottom: 6 }}>Why 1–6 instead of 1–5?</div>
            <div style={{ fontSize: 13.5, lineHeight: 1.5, color: L.ink2 }}>
              A 1–5 scale lets you hide at "3" - safe, average, non-committal. Our 1–6 scale has <b style={{ color: L.ink }}>no middle</b>. You're either below the midpoint (1–3) or above it (4–6). This forces honest self-assessment, which is the only kind that leads to real improvement.
            </div>
          </div>
          <div className="card" style={{ padding: "13px 18px", marginBottom: 12, borderColor: `${TONE.gold.fill}66` }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: TONE.gold.ink, marginBottom: 10 }}>What the top scores mean</div>
            <div style={{ display: "flex", gap: 12 }}>
              {[[5, "Best In Class", TONE.cyan, cfg.best5],
                [6, "Perfect", TONE.green, cfg.perfect6]].map(([num, label, t, text]) => (
                <div key={num} style={{ flex: 1, padding: "12px 14px", borderRadius: 10, background: `linear-gradient(135deg, #FFFFFF 40%, ${t.tint})`, border: `1px solid ${t.fill}55` }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 5 }}>
                    <span className="num" style={{ fontSize: 26, color: t.ink }}>{num}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: t.ink }}>{label}</span>
                  </div>
                  <div style={{ fontSize: 12.5, lineHeight: 1.45, color: L.ink2 }}>{text}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="card" style={{ padding: "13px 18px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: TONE.gold.ink, marginBottom: 6 }}>For each dimension</div>
            <div style={{ fontSize: 13.5, lineHeight: 1.5, color: L.ink2 }}>
              Read the description and checklist honestly. Use the checklist as a gut-check - not a scorecard. Then use the <b style={{ color: L.ink }}>Rate Yourself</b> panel at the bottom to assign your score. All 10 dimensions contribute to your overall {TOOL} score. Your results aggregate automatically.
            </div>
          </div>
        </P>

        {/* ═══ PAGES 3–12: ONE DIMENSION PER PAGE ═══ */}
        {DIMS.map(dim => (
          <P key={dim.key} s={s} n={++n} total={total} right={`Dimension ${pad2(dim.num)} of ${dim.of}`}>
            <div style={{ display: "flex", gap: 20, alignItems: "center", marginBottom: 12 }}>
              <Tile size={70}><span className="num" style={{ fontSize: 30, color: A.ink }}>{pad2(dim.num)}</span></Tile>
              <div style={{ flex: 1 }}>
                <div className="kicker" style={{ color: A.ink, marginBottom: 6 }}>Dimension {pad2(dim.num)} of {dim.of}</div>
                <h2 style={{ fontSize: 35, margin: 0, lineHeight: 1.04 }}>{dim.title}</h2>
              </div>
            </div>
            <div style={{ fontSize: 19.5, fontWeight: 600, fontStyle: "italic", fontFamily: "'Cormorant Garamond',serif", color: A.ink, marginBottom: 10, lineHeight: 1.25 }}>{dim.subtitle}</div>
            <p className="body" style={{ fontSize: 15, lineHeight: 1.56, marginBottom: 14 }}>{dim.description}</p>
            <div className="card" style={{ overflow: "hidden", borderColor: `${A.fill}55` }}>
              <div style={{ padding: "8px 18px 7px", fontSize: 11, fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase", color: L.ink3, background: `linear-gradient(90deg, ${A.tint}, #FFFFFF)` }}>Check what's true today</div>
              {dim.checks.map((c, ci) => (
                <CheckItem A={A} key={ci} text={c.text} sub={c.sub} checked={!!checks[`${dim.key}-${ci}`]} onToggle={() => toggleCheck(dim.key, ci)} />
              ))}
            </div>
            <ScoreSelector value={scores[dim.key]} onChange={v => setScore(dim.key, v)} lowLabel={dim.lowLabel} highLabel={dim.highLabel} />
          </P>
        ))}

        {/* ═══ SCORING SUMMARY ═══ */}
        <P s={s} n={++n} total={total} right="Your score" tex="light">
          <div className="kicker" style={{ color: A.ink }}>Your {TOOL} score</div>
          <h2 style={{ fontSize: 42 }}>{cfg.summaryHead}</h2>
          <div className="card" style={{ padding: "16px 20px 10px", marginTop: 6 }}>
            {DIMS.map(d => {
              const sc = scores[d.key]; const t = scoreTone(sc);
              return (
                <div key={d.key} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 9 }}>
                  <span style={{ fontSize: 13.5, color: L.ink2, width: 300, flexShrink: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{d.title}</span>
                  <div style={{ flex: 1, height: 10, borderRadius: 6, background: L.ruleLight, overflow: "hidden" }}>
                    {sc && <div style={{ width: `${(sc / 6) * 100}%`, height: "100%", borderRadius: 6, background: t.fill }} />}
                  </div>
                  <span className="num" style={{ fontSize: 17, color: t ? t.ink : L.ink4, width: 22, textAlign: "right" }}>{sc || "-"}</span>
                </div>
              );
            })}
          </div>
          {(() => {
            const bt = unlocked && activeBand ? bandTone(activeBand, A) : null;
            return (
              <div className="card" style={{ padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14, ...(bt ? { borderColor: `${bt.fill}88`, background: `linear-gradient(135deg, #FFFFFF 55%, ${bt.tint})`, boxShadow: `0 0 24px ${bt.fill}33, 0 10px 26px rgba(10,14,20,.08)` } : {}) }}>
                <span style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: A.ink }}>Total {TOOL} score</span>
                <span className="num" style={{ fontSize: 30, color: bt ? bt.ink : L.ink4 }}>
                  {totalScore}<span style={{ fontSize: 16, color: L.ink3 }}>/{maxScore}</span>
                  {unlocked && <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 600, color: L.ink2, marginLeft: 8 }}>({Math.round((totalScore / maxScore) * 100)}%)</span>}
                </span>
              </div>
            );
          })()}
          {unlocked && activeBand && (() => {
            const bt = bandTone(activeBand, A);
            return (
              <>
                <div style={{ marginTop: 16, padding: "4px 0 0 18px", borderLeft: `3px solid ${bt.fill}` }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 4 }}>
                    <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 600, color: bt.ink }}>{activeBand.label}</span>
                    <span style={{ fontSize: 12, color: L.ink3 }}>Score range: {activeBand.range} of 60</span>
                  </div>
                  <div style={{ fontSize: 13.5, lineHeight: 1.55, color: L.ink2, marginBottom: 8 }}>{activeBand.desc}</div>
                  {lowestTwo.length >= 2 && (
                    <div style={{ fontSize: 13.5, color: L.ink, marginBottom: 8 }}>
                      <b>Your biggest opportunities:</b>{" "}
                      <span style={{ color: scoreTone(scores[lowestTwo[0].key]).ink, fontWeight: 600 }}>{lowestTwo[0].title}</span> and{" "}
                      <span style={{ color: scoreTone(scores[lowestTwo[1].key]).ink, fontWeight: 600 }}>{lowestTwo[1].title}</span>.
                    </div>
                  )}
                  <div style={{ fontSize: 13, lineHeight: 1.55, color: L.ink2, fontStyle: "italic", marginBottom: 6 }}>
                    {cfg.lever}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.5, color: L.ink }}>
                    {cfg.premium}
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginTop: 16 }}>
                  {BANDS.map(b => {
                    const t = bandTone(b, A); const on = activeBand.label === b.label;
                    return (
                      <div key={b.label} style={{ padding: "9px 12px", borderRadius: 10, background: on ? `linear-gradient(135deg, #FFFFFF 40%, ${t.tint})` : "#FFFFFF",
                        border: `1px solid ${on ? t.fill : L.ruleLight}`, boxShadow: on ? `0 0 18px ${t.fill}44` : "none", opacity: on ? 1 : 0.5 }}>
                        <div style={{ fontSize: 12.5, fontWeight: 700, color: t.ink }}>{b.label}</div>
                        <div style={{ fontSize: 11.5, color: L.ink3 }}>{b.range} points</div>
                      </div>
                    );
                  })}
                </div>
              </>
            );
          })()}
          {!unlocked && (
            <div style={{ marginTop: 22, textAlign: "center", fontSize: 14.5, color: L.ink3, fontStyle: "italic" }}>
              {allScored ? "All 10 scored. Unlock your diagnosis and first three moves below." : `Score all 10 dimensions to see your diagnosis. ${DIMS.length - scoredCount} to go.`}
            </div>
          )}
        </P>

        {/* EMAIL GATE */}
        {allScored && !gateUnlocked && (
          <EmailGate toolName={`${TOOL} Deep-Dive`} toolSlug={cfg.toolSlug} storeSlug={cfg.storeSlug} scores={scores}
            summary={{ totalScore, maxScore, pct: Math.round((totalScore / maxScore) * 100), band: activeBand?.label }}
            onUnlock={(name) => { setWho(name); setGateUnlocked(true); }} onStored={(p) => { savedLink.current = p; }} />
        )}

        {/* ═══ YOUR FIRST 3 MOVES (gated) ═══ */}
        {unlocked && (
          <P s={s} n={++n} total={total} right="Your next steps" tex="light">
            <div className="kicker" style={{ color: TONE.green.ink }}>Your personalized next steps</div>
            <h2>Your first <em>three moves.</em></h2>
            <p className="body" style={{ marginBottom: 22 }}>
              These are your highest-leverage actions - specific to your lowest-scoring dimensions, calibrated to your current level, and executable this week. Not theory. Not someday. This week.
            </p>
            {lowestThree.map((d, i) => {
              const sc = scores[d.key]; const t = scoreTone(sc);
              const tactic = d.quickWins[sc <= 2 ? "low" : sc <= 4 ? "mid" : "high"][0];
              return (
                <div key={d.key} className="card" style={{ display: "flex", gap: 18, padding: "18px 20px", marginBottom: 14 }}>
                  <Tile size={60}><span className="num" style={{ fontSize: 24, color: TONE.gold.ink }}>{pad2(i + 1)}</span></Tile>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: A.ink, marginBottom: 4 }}>
                      {d.title} <span style={{ color: t.ink }}>({sc}/6)</span>
                    </div>
                    <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 23, fontWeight: 600, lineHeight: 1.2, color: L.ink, marginBottom: 6 }}>{tactic.title}</div>
                    <div style={{ fontSize: 14, lineHeight: 1.55, color: L.ink2 }}>{tactic.context}</div>
                  </div>
                </div>
              );
            })}
            <div style={{ marginTop: 10, padding: "4px 0 4px 18px", borderLeft: `3px solid ${A.fill}` }}>
              <div style={{ fontSize: 15, lineHeight: 1.6, color: L.ink2 }}>
                {cfg.qualifier(A)}
              </div>
            </div>
          </P>
        )}

        {/* ═══ WHAT HAPPENS NEXT (CTA) ═══ */}
        <P s={s} n={total} total={total} right="What happens next" tex="light">
          <div className="kicker" style={{ color: TONE.gold.ink }}>What happens next</div>
          <h2 style={{ fontSize: 42 }}>Knowing your <em>{TOOL}</em> score is the beginning, not the end.</h2>
          <div style={{ display: "flex", gap: 22, alignItems: "center", margin: "6px 0 18px" }}>
            <img src="/images/edward-kriczky-headshot-240.jpg" alt="Edward Kriczky" width="104" height="104" style={{ borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: "3px solid #fff", boxShadow: `0 0 0 1.5px ${TONE.gold.fill}, 0 10px 24px rgba(10,14,20,.16)` }} />
            <div>
              <div style={{ fontSize: 17, fontWeight: 700, color: L.ink }}>Edward Kriczky, CEPA®</div>
              <div style={{ fontSize: 13.5, color: TONE.gold.ink, fontWeight: 600, marginBottom: 6 }}>Founder, Kriczky Virtus</div>
              <div style={{ fontSize: 14, lineHeight: 1.55, color: L.ink2 }}>
                {cfg.bio}
              </div>
            </div>
          </div>
          <div className="card" style={{ padding: "16px 22px 18px", marginBottom: 20 }}>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, fontWeight: 600, marginBottom: 16 }}>What happens next.</div>
            <div style={{ display: "flex", alignItems: "flex-start" }}>
              {[
                { label: "Week 1", title: "Valuation Driver Intensive", desc: "We define your Profit Gap, Value Gap, and build your prioritized action plan.", t: TONE.gold, icon: "get-gold.png" },
                { label: "Months 1–3", title: "Sprint 1 Execution", desc: "Monthly working sessions. I'm in the room for every decision, delegation, and process build.", t: TONE.gold, icon: "why.png" },
                { label: "Day 90", title: "Re-Score & Adapt", desc: "Fresh diagnostic with updated numbers. See what moved. The roadmap adapts. We keep going.", t: TONE.green, icon: "get-green.png" },
              ].map((st, si, arr) => (
                <div key={si} style={{ display: "flex", alignItems: "flex-start", flex: si < arr.length - 1 ? 1 : undefined }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 170 }}>
                    <IconTile src={`${ICONS}/${st.icon}`} size={56} />
                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: st.t.ink, marginTop: 10 }}>{st.label}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: L.ink, marginTop: 4, textAlign: "center" }}>{st.title}</span>
                    <span style={{ fontSize: 12.5, color: L.ink2, lineHeight: 1.45, textAlign: "center", marginTop: 4 }}>{st.desc}</span>
                  </div>
                  {si < arr.length - 1 && <div style={{ flex: 1, height: 2, marginTop: 27, background: `linear-gradient(90deg, ${TONE.gold.fill}88, ${TONE.gold.fill}44)` }} />}
                </div>
              ))}
            </div>
          </div>
          <div style={{ textAlign: "center", marginBottom: 22 }}>
            <CtaBtn href="https://www.kriczkyvirtus.com/free-session">BOOK YOUR FREE WORKING SESSION</CtaBtn>
          </div>
          <div style={{ padding: "4px 0 4px 20px", borderLeft: `3px solid ${TONE.gold.fill}`, marginBottom: 18 }}>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontStyle: "italic", lineHeight: 1.45, color: L.ink }}>
              {cfg.quote}
            </div>
          </div>
          <div style={{ display: "flex", gap: 22, fontSize: 13, color: L.ink3 }}>
            <span>ekriczky@kriczkyvirtus.com</span><span>kriczkyvirtus.com</span>
          </div>
        </P>

      </div>
    </div>
  );
}
