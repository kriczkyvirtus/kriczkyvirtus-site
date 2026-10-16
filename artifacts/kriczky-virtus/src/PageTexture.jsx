import { useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════════════
   The engraved ground for cream pages that aren't full landing pages
   (the question flows). Same lattice as /workshop-rh and the landing page,
   travelling with the page as it scrolls. Desktop also gets two large faint
   logo shields in the side margins (hidden under 1100px, where there are no
   margins). No cursor lamp: these pages are for answering, not browsing.

   Usage: put <PageTexture /> first inside a container that has
   position: relative and isolation: isolate - the layers sit at z-index -1,
   above the container's own background and beneath everything in it.
   ═══════════════════════════════════════════════════════════════ */

const guilloche = (stroke, op, w) => {
  const ring = (cx, cy) => [28, 19, 10].map(r => `<circle cx='${cx}' cy='${cy}' r='${r}'/>`).join("");
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='56' height='56' viewBox='0 0 56 56'><g fill='none' stroke='${stroke}' stroke-opacity='${op}' stroke-width='${w}'>${ring(0,0)}${ring(56,0)}${ring(0,56)}${ring(56,56)}${ring(28,28)}</g></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
};
const TEX_FAINT = guilloche("#8C7650", 0.065, 0.7);

const Shield = ({ side, top }) => (
  <svg aria-hidden="true" className="kvtex-shield" viewBox="0 0 64 64" fill="none" width="520" height="520"
    style={{ position: "absolute", top, [side]: "calc(50% - 260px - min(46vw, 620px))", pointerEvents: "none" }}>
    <path d="M32 8L14 16V30C14 42 22 52 32 56C42 52 50 42 50 30V16L32 8Z" stroke="#B08A3A" strokeOpacity=".16" strokeWidth=".55" strokeLinejoin="round" />
    <path d="M32 12L18 18.5V30C18 39.5 24 47.5 32 51C40 47.5 46 39.5 46 30V18.5L32 12Z" stroke="#B08A3A" strokeOpacity=".1" strokeWidth=".3" strokeLinejoin="round" />
  </svg>
);

export default function PageTexture() {
  const tex = useRef(null);
  useEffect(() => {
    let frame = 0, queued = false;
    const apply = () => { queued = false; if (tex.current) tex.current.style.backgroundPosition = `0px ${-Math.round(window.scrollY)}px`; };
    const onScroll = () => { if (!queued) { queued = true; frame = requestAnimationFrame(apply); } };
    window.addEventListener("scroll", onScroll, { passive: true });
    apply();
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(frame); };
  }, []);
  return (
    <>
      <style>{`.kvtex-shields{display:block} @media (max-width:1100px){.kvtex-shields{display:none}}`}</style>
      <div ref={tex} aria-hidden="true" style={{ position: "fixed", inset: 0, backgroundImage: TEX_FAINT, pointerEvents: "none", zIndex: -1, willChange: "background-position" }} />
      <div aria-hidden="true" className="kvtex-shields" style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: -1 }}>
        <Shield side="left" top={140} />
        <Shield side="right" top={620} />
      </div>
    </>
  );
}
