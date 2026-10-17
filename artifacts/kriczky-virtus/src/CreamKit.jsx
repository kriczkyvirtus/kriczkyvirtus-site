import { useEffect, useRef, useState } from "react";

/* ═══════════════════════════════════════════════════════════════
   CREAM KIT - the house pieces from /reinvest-harvest and /workshop-rh,
   shared by the smaller cream pages (/free-session, /valuation-estimate,
   the two thank-you pages). The approved landing pages keep their own copies.

     C, T, DARK          page inks and the four tones (ink / fill / tint)
     glow(t), CARD       report glow card, plain white card
     CREAM_CSS           porcelain tile + disc, dark halo button with shine,
                         hover lift, the page-strip carousel
     Logo, Num, HaloButton, PageCarousel, ContactFooter, FONTS
   Pair with <PageTexture /> for the engraved ground.
   ═══════════════════════════════════════════════════════════════ */

export const FONTS = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap";

export const C = {
  page: "#F2EEE6",
  ink1: "#0A0E14", ink2: "#3E4652", ink3: "#6B6459", ink4: "#8C8476",
  rule: "#DCD4C5", ruleLight: "#E6DFD2",
};
export const T = {
  gold:  { ink: "#7A5C1E", fill: "#C8A24E", tint: "#F1E7D0" },
  green: { ink: "#1B7A57", fill: "#34D399", tint: "#E3EEE6" },
  cyan:  { ink: "#0E7490", fill: "#22D3EE", tint: "#E1ECEE" },
  red:   { ink: "#B4403F", fill: "#F87171", tint: "#F6E3DF" },
};
export const DARK = "linear-gradient(160deg,#141B26 0%,#0A0E14 72%)";

/* Report glow card: an edge and a soft glow all round in the tone. */
export const glow = (t = T.gold, on = true) => ({
  borderRadius: 18, border: `1px solid ${t.fill}${on ? "66" : "33"}`,
  background: `linear-gradient(135deg, #FFFFFF 55%, ${t.tint})`,
  boxShadow: on ? `0 0 26px ${t.fill}36, 0 8px 22px rgba(10,14,20,.07)` : "0 1px 2px rgba(10,14,20,.05), 0 6px 16px rgba(10,14,20,.05)",
});
export const CARD = { borderRadius: 18, background: "#FFFFFF", border: `1px solid ${C.rule}`,
  boxShadow: "0 1px 2px rgba(10,14,20,.05), 0 10px 28px rgba(10,14,20,.07)" };
export const PORCELAIN = "linear-gradient(180deg,#FFFEFB 0%,#F5EFE3 100%)";
export const KICKER = { fontSize: 11, fontWeight: 700, letterSpacing: ".2em", textTransform: "uppercase", color: T.gold.ink, marginBottom: 12 };

export const CREAM_CSS = `
  * { box-sizing: border-box; }
  .tile { display: inline-flex; align-items: center; justify-content: center; flex: 0 0 auto;
    background: linear-gradient(180deg,#FFFEFB 0%,#F7F2E8 100%); border: 1px solid #E6DFD1;
    box-shadow: inset 0 1px 0 rgba(255,255,255,.9), 0 1px 2px rgba(10,14,20,.06), 0 10px 22px rgba(10,14,20,.12); }
  .pnum { flex: 0 0 auto; border-radius: 50%; display: flex; align-items: center; justify-content: center;
    font-family: 'Playfair Display',serif; font-weight: 700; line-height: 1; font-variant-numeric: lining-nums; font-feature-settings: 'lnum' 1;
    background: linear-gradient(180deg,#FFFEFB 0%,#F3ECDF 100%); border: 1px solid #E6DFD1; }

  /* the dark button: gold halo, lift and a quick shine */
  .cta { position: relative; overflow: hidden; isolation: isolate; transition: box-shadow .3s ease, transform .3s ease;
    box-shadow: 0 0 0 1px rgba(200,162,78,.55), 0 0 20px rgba(200,162,78,.55), 0 0 52px rgba(200,162,78,.34), 0 10px 24px rgba(10,14,20,.18); }
  .cta::after { content: ""; position: absolute; top: -10%; bottom: -10%; left: -75%; width: 55%; pointer-events: none; opacity: 0;
    background: linear-gradient(100deg, transparent 0%, rgba(250,240,205,0) 22%, rgba(250,240,205,.55) 50%, rgba(250,240,205,0) 78%, transparent 100%);
    transform: skewX(-18deg); }
  @media (hover: hover) {
    .cta:hover { transform: translateY(-2px); box-shadow: 0 0 0 1px rgba(200,162,78,.7), 0 0 24px rgba(200,162,78,.6), 0 0 64px rgba(200,162,78,.38), 0 12px 26px rgba(10,14,20,.2); }
    .cta:hover::after { animation: kvshine .8s cubic-bezier(.4,0,.2,1); }
  }
  @keyframes kvshine { 0% { left: -75%; opacity: 1; } 100% { left: 130%; opacity: 1; } }
  .cta .ctaArrow { transition: transform .3s cubic-bezier(.4,0,.2,1); }
  .cta:hover .ctaArrow { transform: translateX(5px); }
  @media (max-width: 420px) { .cta { padding-left: 24px !important; padding-right: 24px !important; font-size: 15px !important; } }
  .cta[disabled], .cta.off { box-shadow: none; opacity: .38; cursor: not-allowed; transform: none !important; }
  .cta[disabled]::after, .cta.off::after { display: none; }

  /* porcelain secondary button */
  .pbtn { background: linear-gradient(180deg,#FFFEFB 0%,#F5EFE3 100%); border: 1px solid #E6DFD1; color: ${C.ink2}; cursor: pointer;
    box-shadow: inset 0 1px 0 rgba(255,255,255,.95), 0 1px 2px rgba(10,14,20,.06), 0 6px 14px rgba(10,14,20,.08);
    transition: transform .3s ease, box-shadow .3s ease, color .3s ease; }
  @media (hover: hover) and (pointer: fine) { .pbtn:hover { transform: translateY(-1px); color: ${C.ink1};
    box-shadow: inset 0 1px 0 rgba(255,255,255,.95), 0 0 18px rgba(200,162,78,.3), 0 8px 18px rgba(10,14,20,.1); } }

  @media (prefers-reduced-motion: reduce) {
    .cta:hover, .pbtn:hover { transform: none; } .cta:hover::after { animation: none; }
    .cta:hover .ctaArrow { transform: none; }
  }

  /* cards that lift on hover, smoothly */
  .lift { transition: transform .3s ease, box-shadow .3s ease, border-color .3s ease; }
  @media (hover: hover) and (pointer: fine) { .lift:hover { transform: translateY(-2px); } }

  /* the page strip */
  .pagetrack { display: flex; gap: 22px; overflow-x: auto; scroll-snap-type: x mandatory; padding: 18px calc(50% - 150px) 22px;
    scrollbar-width: none; -webkit-overflow-scrolling: touch; overscroll-behavior-x: contain;
    -webkit-mask-image: linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent); mask-image: linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent); }
  .pagetrack::-webkit-scrollbar { display: none; }
  .pageslide { flex: 0 0 300px; scroll-snap-align: center; transition: transform .45s ease, opacity .45s ease; transform: scale(.92); opacity: .62; }
  .pageslide.on { transform: none; opacity: 1; }
  .pageslide img { width: 100%; height: auto; display: block; border-radius: 6px; user-select: none;
    box-shadow: 0 1px 2px rgba(10,14,20,.08), 0 16px 34px rgba(10,14,20,.18); }
  .pageslide.on img { box-shadow: 0 1px 2px rgba(10,14,20,.08), 0 18px 40px rgba(10,14,20,.22), 0 0 30px rgba(200,162,78,.28); }
  .pageslide figcaption { text-align: center; margin-top: 12px; font-size: 13px; font-weight: 600; color: ${C.ink2}; letter-spacing: .02em; }
  .pageslide figcaption .pn { font-family: 'Playfair Display',serif; color: ${T.gold.ink}; margin-right: 4px; }
  .pagearrow { position: absolute; top: calc(50% - 40px); width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: ${T.gold.ink}; background: linear-gradient(180deg,#FFFEFB 0%,#F5EFE3 100%); border: 1px solid #E6DFD1;
    box-shadow: inset 0 1px 0 rgba(255,255,255,.95), 0 1px 2px rgba(10,14,20,.06), 0 8px 18px rgba(10,14,20,.12); transition: transform .3s ease, box-shadow .3s ease; }
  .pagearrow.left { left: 4px; } .pagearrow.right { right: 4px; }
  @media (hover: hover) and (pointer: fine) { .pagearrow:hover { transform: translateY(-2px); box-shadow: inset 0 1px 0 rgba(255,255,255,.95), 0 0 20px rgba(200,162,78,.35), 0 10px 20px rgba(10,14,20,.14); } }
  @media (max-width: 700px) {
    .pagearrow { display: none; }
    .pageslide { flex-basis: 64vw; }
    .pagetrack { padding: 14px 18vw 18px; gap: 12px; -webkit-mask-image: none; mask-image: none; }
  }
`;

/* The header lockup. Not a link: these pages have one way forward. */
export const Logo = ({ style }) => (
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 11, ...style }}>
    <span className="tile" style={{ width: 40, height: 40, borderRadius: 11 }}>
      <img src="/icons/roadmap-system/shield.png" alt="" width="28" height="28" draggable="false" style={{ display: "block" }} /></span>
    <span style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 18, color: C.ink1, letterSpacing: ".14em" }}>
      KRICZKY <span style={{ color: "#9A7A34" }}>VIRTUS</span>
    </span>
  </div>
);

/* A numeral (or an icon) on a small porcelain disc, in the tone's ink. */
export const Num = ({ n, t = T.gold, size = 34, children }) => (
  <span className="pnum" style={{ width: size, height: size, fontSize: size * 0.44, color: t.ink, borderColor: `${t.fill}77`,
    boxShadow: `inset 0 1px 0 rgba(255,255,255,.95), 0 1px 2px rgba(10,14,20,.08), 0 5px 12px rgba(10,14,20,.08), 0 0 14px ${t.fill}30` }}>{children || n}</span>
);

const Arrow = ({ size = 18 }) => (
  <svg className="ctaArrow" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={T.gold.fill} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
    style={{ marginLeft: 10, flex: "0 0 auto" }}><line x1="4" y1="12" x2="19" y2="12" /><polyline points="13 6 19 12 13 18" /></svg>
);

/* The house primary button: dark pill, gold label, gold halo, shine on hover.
   Renders an <a> with href, or a <button> without one. */
export const HaloButton = ({ href, children, size = 17, block = false, arrow = true, style, ...rest }) => {
  const Tag = href ? "a" : "button";
  return (
    <Tag href={href} className={`cta${rest.disabled ? " off" : ""}`} {...rest}
      style={{ display: block ? "flex" : "inline-flex", width: block ? "100%" : undefined, alignItems: "center", justifyContent: "center",
        padding: "19px 40px", borderRadius: 999, textDecoration: "none", background: DARK, border: "1.5px solid #0A0E14", cursor: "pointer",
        fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: size, letterSpacing: ".02em", color: T.gold.fill, lineHeight: 1.2, textAlign: "center", ...style }}>
      <span>{children}</span>{arrow && <Arrow size={Math.round(size * 1.05)} />}
    </Tag>
  );
};

/* A swipeable strip of report pages (scroll-snap) that walks itself while it's
   on screen. Any touch, drag, wheel or arrow click hands control to the reader. */
export const PageCarousel = ({ pages, alt = "Sample page" }) => {
  const track = useRef(null);
  const [at, setAt] = useState(0);
  const [held, setHeld] = useState(false);
  const [seen, setSeen] = useState(false);
  const go = (i) => {
    const el = track.current; if (!el) return;
    const n = (i + pages.length) % pages.length;
    const slide = el.children[n]; if (!slide) return;
    el.scrollTo({ left: slide.offsetLeft - el.offsetLeft - (el.clientWidth - slide.clientWidth) / 2, behavior: "smooth" });
  };
  useEffect(() => {
    const el = track.current; if (!el) return;
    let frame = 0;
    const onScroll = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(() => {
      const mid = el.scrollLeft + el.clientWidth / 2; let best = 0, gap = Infinity;
      [...el.children].forEach((c, i) => { const g = Math.abs(c.offsetLeft - el.offsetLeft + c.clientWidth / 2 - mid); if (g < gap) { gap = g; best = i; } });
      setAt(best);
    }); };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => { el.removeEventListener("scroll", onScroll); cancelAnimationFrame(frame); };
  }, []);
  useEffect(() => {
    const el = track.current; if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), { threshold: 0.4 });
    io.observe(el); return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (held || !seen || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => go(at + 1), 3600);
    return () => clearInterval(id);
  }, [at, held, seen]);
  const hold = () => setHeld(true);
  return (
    <div style={{ position: "relative" }}>
      <div ref={track} className="pagetrack" onPointerDown={hold} onWheel={hold} onTouchStart={hold}>
        {pages.map((p, i) => (
          <figure key={p.src} className={`pageslide${i === at ? " on" : ""}`} style={{ margin: 0 }}>
            <img src={p.src} alt={`${alt} ${p.n}: ${p.t}`} width="680" height="880" loading="lazy" draggable="false" />
            <figcaption><span className="pn">{p.n}</span> {p.t}</figcaption>
          </figure>
        ))}
      </div>
      <button className="pagearrow left" aria-label="Previous page" onClick={() => { hold(); go(at - 1); }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
      <button className="pagearrow right" aria-label="Next page" onClick={() => { hold(); go(at + 1); }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
      <div style={{ display: "flex", justifyContent: "center", gap: 2, marginTop: 10 }}>
        {pages.map((p, i) => (
          <button key={p.src} onClick={() => { hold(); go(i); }} aria-label={`Show page ${p.n}`}
            style={{ padding: 6, border: "none", background: "transparent", cursor: "pointer", lineHeight: 0 }}>
            <span style={{ display: "block", width: i === at ? 18 : 7, height: 7, borderRadius: 4, background: i === at ? T.gold.fill : "#D9D1C2", transition: "all .3s ease" }} />
          </button>
        ))}
      </div>
    </div>
  );
};

export const ContactFooter = ({ style }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", paddingTop: 24, borderTop: `1px solid ${C.ruleLight}`, ...style }}>
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.ink3} strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 7l-10 7L2 7" /></svg>
        <span style={{ fontSize: 11.5, color: C.ink3 }}>ekriczky@kriczkyvirtus.com</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.ink3} strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" /></svg>
        <span style={{ fontSize: 11.5, color: C.ink3 }}>kriczkyvirtus.com</span>
      </div>
    </div>
    <img src="/icons/roadmap-system/shield.png" alt="" width="34" height="34" draggable="false" />
  </div>
);
