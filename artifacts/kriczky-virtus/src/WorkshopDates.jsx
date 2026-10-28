import { useEffect, useState } from "react";
import { WORKSHOPS, SEAT_CAP, statusOf } from "./workshopEvents.js";

/* ═══════════════════════════════════════════════════════════════
   The "Upcoming workshops" cards on /workshop-rh.
   Three porcelain glow cards: the dated workshop (Open, with a bright red
   "N seats left" pill on the button once 10 or fewer remain → Full, with a
   red "SOLD OUT" pill on the "Join the waitlist" button) and the next two quarters (Date TBA - priority
   access). Every number comes from /api/workshop-seats (live ActiveCampaign
   tag counts). Picking a card sets what the form below does.
   ═══════════════════════════════════════════════════════════════ */

const T = {
  gold:  { ink: "#7A5C1E", fill: "#C8A24E", tint: "#F1E7D0" },
  green: { ink: "#1B7A57", fill: "#34D399", tint: "#E3EEE6" },
  cyan:  { ink: "#0E7490", fill: "#22D3EE", tint: "#E1ECEE" },
  red:   { ink: "#B4403F", fill: "#F87171", tint: "#F6E3DF" },
};
const DARK_BTN = "linear-gradient(160deg,#141B26 0%,#0A0E14 72%)";

export function useWorkshopCounts() {
  const [counts, setCounts] = useState(null);
  useEffect(() => {
    let live = true;
    fetch("/api/workshop-seats")
      .then(r => (r.ok ? r.json() : null))
      .then(d => { if (live && d?.counts) setCounts(d.counts); })
      .catch(() => {});
    return () => { live = false; };
  }, []);
  return counts;
}

const toneOf = (s) => s.kind === "priority" ? T.cyan : s.kind === "waitlist" ? T.red : T.green;

export default function WorkshopDates({ counts, picked, onPick, client = false }) {
  return (
    <div className="wdates">
      {WORKSHOPS.map(w => {
        const s = statusOf(w, counts);
        const t = toneOf(s);
        const on = picked === w.id;
        const action = s.kind === "priority" ? "Get priority access"
          : s.kind === "waitlist" ? "Join the waitlist"
          : client ? "Reserve my client seat" : "Reserve your seat";
        const kind = s.kind === "seat" && client ? "client" : s.kind;
        return (
          <div key={w.id} className={`wdate${on ? " on" : ""}`}
            style={{ "--edge": `${t.fill}66`, "--edgeHi": `${t.fill}cc`, "--glow": `${t.fill}30`, "--glowHi": `${t.fill}66`, "--tint": t.tint }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
              <span className="wq">{w.quarter}</span>
              <span className="wchip" style={{ color: t.ink, borderColor: `${t.fill}88`, boxShadow: `inset 0 1px 0 rgba(255,255,255,.95), 0 2px 6px rgba(10,14,20,.06), 0 0 12px ${t.fill}33` }}>
                <span className="wgem" style={{ background: `radial-gradient(circle at 35% 30%, #fff 0%, ${t.fill} 45%, ${t.ink} 100%)`, boxShadow: `0 0 7px ${t.fill}aa` }} />
                {s.kind === "seat" ? "Open" : s.label}</span>
            </div>
            <div className="wday">{w.date ? w.short : "Date TBA"}</div>
            <div className="wsub">{w.date ? `${w.time} · West Chester, PA` : `${SEAT_CAP} owners · one workshop a quarter`}</div>
            <div className="wnote">
              {s.kind === "priority"
                ? (s.priority
                    ? <span className="wcount"><span className="wnum">{s.priority}</span>
                        <span className="wlbl">{s.priority > SEAT_CAP ? <>owners for <b>{SEAT_CAP} seats</b></> : "owners on the priority list"}</span></span>
                    : "Reserve now. You hear first when the date is set.")
                : s.kind === "waitlist" ? "If a seat opens, the waitlist hears first."
                : client ? "Client seat · no deposit" : "Free · $250 refundable deposit"}
            </div>
            <div className="wact">
            {s.kind === "seat" && s.label !== "Open" && (
              <span className="wleft">{s.label}</span>
            )}
            {s.kind === "waitlist" && <span className="wleft">SOLD OUT</span>}
            <a href="#register" className="cta shine wbtn" onClick={(e) => { e.preventDefault(); onPick(w.id, kind); }}
              style={{ background: DARK_BTN }}>
              <span>{action}</span>
              <svg className="ctaArrow" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={T.gold.fill} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="12" x2="19" y2="12" /><polyline points="13 6 19 12 13 18" /></svg>
            </a>
            </div>
          </div>
        );
      })}
      <style>{`
        .wdates { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
        @media (max-width: 900px) { .wdates { grid-template-columns: 1fr; max-width: 460px; margin: 0 auto; } }
        .wdate { display: flex; flex-direction: column; gap: 10px; padding: 22px 22px 22px; border-radius: 20px; text-align: left;
          background: linear-gradient(135deg, #FFFFFF 55%, var(--tint)); border: 1px solid var(--edge);
          box-shadow: 0 0 22px var(--glow), 0 8px 22px rgba(10,14,20,.07); transition: transform .3s ease, box-shadow .3s ease, border-color .3s ease; }
        .wdate.on { border-color: var(--edgeHi); box-shadow: 0 0 0 1px var(--edgeHi), 0 0 30px var(--glowHi), 0 12px 26px rgba(10,14,20,.1); }
        @media (hover: hover) and (pointer: fine) { .wdate:hover { transform: translateY(-2px); border-color: var(--edgeHi); } }
        .wq { display: inline-flex; align-items: center; height: 28px; padding: 0 12px; border-radius: 999px; font-size: 12px; font-weight: 700; letter-spacing: .12em; color: #7A5C1E;
          background: linear-gradient(180deg,#FFFEFB 0%,#F5EFE3 100%); border: 1px solid #E6DFD1; box-shadow: inset 0 1px 0 rgba(255,255,255,.95), 0 2px 6px rgba(10,14,20,.06); }
        .wchip { display: inline-flex; align-items: center; gap: 7px; height: 30px; padding: 0 13px 0 10px; border-radius: 999px; font-size: 13px; font-weight: 700; white-space: nowrap;
          background: linear-gradient(180deg,#FFFEFB 0%,#F5EFE3 100%); border: 1px solid; }
        .wgem { width: 9px; height: 9px; border-radius: 50%; flex: 0 0 auto; }
        .wday { font-family: 'Cormorant Garamond',serif; font-weight: 700; font-size: clamp(34px, 4.4vw, 42px); line-height: 1; color: #0A0E14; margin-top: 8px; }
        .wsub { font-size: 14.5px; color: #3E4652; }
        .wnote { font-size: 13.5px; color: #6B6459; line-height: 1.45; min-height: 20px; }
        .wnote b { color: #0E7490; }
        /* priority count (from SHOW_PRIORITY_FROM): a big number, "owners for 20 seats" once the list passes the cap */
        .wcount { display: flex; align-items: baseline; gap: 12px; padding: 10px 16px 10px 14px; border-radius: 14px;
          background: linear-gradient(135deg, rgba(34,211,238,.10), rgba(34,211,238,.03)); border: 1px solid rgba(34,211,238,.38);
          box-shadow: inset 0 1px 0 rgba(255,255,255,.9); }
        .wnum { font-family: 'Playfair Display',serif; font-weight: 700; font-size: 40px; line-height: 1; color: #0E7490;
          text-shadow: 0 0 14px rgba(34,211,238,.35); }
        .wlbl { font-size: 15px; font-weight: 600; color: #0A0E14; line-height: 1.3; }
        .wlbl b { color: #0E7490; }
        .wact { margin-top: auto; position: relative; display: flex; flex-direction: column; align-items: center; }
        /* seats-left alert: bright red, sitting on the button's top edge */
        .wleft { position: relative; z-index: 2; margin-bottom: -11px; display: inline-flex; align-items: center; height: 26px; padding: 0 14px;
          border-radius: 999px; font-size: 12.5px; font-weight: 800; letter-spacing: .02em; color: #fff; white-space: nowrap;
          background: linear-gradient(180deg,#F23A3A 0%,#D41F1F 100%); border: 1px solid #B91515;
          box-shadow: inset 0 1px 0 rgba(255,255,255,.35), 0 3px 10px rgba(220,38,38,.35), 0 0 14px rgba(239,68,68,.35); }
        .wbtn { width: 100%; box-sizing: border-box; display: flex; align-items: center; justify-content: center; gap: 9px; padding: 15px 18px; border-radius: 999px; text-decoration: none;
          border: 1.5px solid #0A0E14; font-weight: 700; font-size: 15.5px; color: #C8A24E; }
      `}</style>
    </div>
  );
}
