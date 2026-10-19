import PageTexture from "../PageTexture.jsx";
import RoadmapSystem from "../RoadmapSystem.jsx";
import { C, T, glow, CARD, KICKER, CREAM_CSS, FONTS, Logo, Num } from "../CreamKit.jsx";
import { QUADRANTS } from "./ReinvestHarvestThankYou.jsx";

/* ═══════════════════════════════════════════════════════════════
   WORKSHOP SCORECARD - NEXT PAGE
   Route: /workshop-rh/scorecard/next?t=<token>
   Where the workshop door of the Reinvest or Harvest scorecard ends
   (/workshop-rh/scorecard). Attendees have already reserved a seat, so this
   page sells nothing: their position, what happens with it at the workshop,
   the other two pieces of pre-work, and the roadmap with station 01 marked.
   A bad or missing token drops to the pre-work checklist on its own.
   ═══════════════════════════════════════════════════════════════ */

/* Optional video. The section renders only once this is set. */
const WORKSHOP_VSL_SRC = null;      // e.g. "/video/workshop-scorecard.mp4"
const WORKSHOP_VSL_POSTER = null;

const H = { fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, color: C.ink1, letterSpacing: "-.01em" };
const EM = { fontStyle: "italic", fontWeight: 500, color: T.gold.ink };

/* Fill colour for each position (the ink lives in QUADRANTS). */
const FILL = { reinvest: T.green, split: T.gold, harvest: T.cyan, stabilize: T.red };

export default function WorkshopScorecardNext({ report = null }) {
  const resolved = Boolean(report && QUADRANTS[report.quadrantKey]);
  const q = resolved ? QUADRANTS[report.quadrantKey] : null;
  const tone = resolved ? FILL[report.quadrantKey] || T.gold : T.gold;
  const email = report?.email || "";
  const first = report?.firstName || "";

  const vdLink = `/workshop-rh/value-drivers${email ? `?e=${encodeURIComponent(email)}${first ? `&n=${encodeURIComponent(first)}` : ""}` : ""}`;
  const STEPS = [
    { t: "The Reinvest or Harvest scorecard", d: resolved ? "Done. Your full scorecard is in your inbox." : "If you've already taken it, you're set.", done: resolved, href: resolved ? null : "/workshop-rh/scorecard" },
    { t: "Value Drivers", d: "Ten questions on what makes your business valuable. About ten minutes.", href: vdLink },
    { t: "Your Profit & Valuation Gaps Snapshot", d: "Fourteen questions. We build your Snapshot from it and bring it to the workshop.", href: "/workshop-rh/snapshot" },
  ];

  return (
    <div style={{ background: C.page, minHeight: "100vh", fontFamily: "'DM Sans',sans-serif", color: C.ink1, position: "relative", isolation: "isolate", overflowX: "hidden" }}>
      <link href={FONTS} rel="stylesheet" />
      <style>{CREAM_CSS + `
        .wsn-step { display: flex; gap: 14px; align-items: center; padding: 16px 0; border-bottom: 1px solid ${C.ruleLight}; }
        .wsn-step:last-child { border-bottom: none; }
        .wsn-go { flex: 0 0 auto; padding: 10px 18px; border-radius: 999px; text-decoration: none; font-weight: 700; font-size: 14px; color: ${T.gold.fill};
          background: linear-gradient(160deg,#141B26 0%,#0A0E14 72%); border: 1.5px solid #0A0E14; white-space: nowrap; }
        @media (max-width: 520px) { .wsn-step { flex-wrap: wrap; row-gap: 10px; } .wsn-txt { flex-basis: calc(100% - 56px) !important; } .wsn-go { margin-left: 52px; } }
      `}</style>
      <PageTexture />
      <div aria-hidden="true" style={{ position: "absolute", top: -80, left: "50%", transform: "translateX(-50%)", width: "min(1100px,150vw)", height: 560,
        background: `radial-gradient(ellipse at center, ${T.gold.fill}1c 0%, transparent 66%)`, pointerEvents: "none", zIndex: -1 }} />

      <Logo style={{ padding: "25px 22px 0" }} />

      {resolved && email && (
        <div style={{ display: "flex", justifyContent: "center", padding: "22px 20px 0" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "10px 20px", borderRadius: 999, maxWidth: "100%",
            background: "linear-gradient(180deg,#FFFEFB 0%,#F5EFE3 100%)", border: `1px solid ${T.green.fill}88`,
            boxShadow: `inset 0 1px 0 rgba(255,255,255,.95), 0 1px 2px rgba(10,14,20,.06), 0 6px 16px rgba(10,14,20,.08), 0 0 20px ${T.green.fill}33` }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
              <polyline points="4 12 10 18 20 6" stroke={T.green.ink} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ fontSize: 14, color: C.ink1, overflowWrap: "anywhere" }}>
              Your scorecard is on its way to <b style={{ color: T.green.ink }}>{email}</b>
            </span>
          </div>
        </div>
      )}

      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 20px" }}>
        {/* ── HERO ── */}
        <section style={{ padding: "34px 0 26px", textAlign: "center" }}>
          <div style={{ ...KICKER, marginBottom: 14 }}>Reinvest or Harvest Workshop &middot; Pre-work</div>
          {resolved ? (
            <>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".2em", textTransform: "uppercase", color: tone.ink, marginBottom: 10 }}>You landed in</div>
              <h1 style={{ ...H, fontSize: "clamp(40px,9.6vw,64px)", textTransform: "uppercase", letterSpacing: ".01em", color: tone.ink, lineHeight: 1.06, margin: "0 0 20px" }}>{q.label}</h1>
              <p style={{ fontSize: "clamp(16px,3.9vw,20px)", lineHeight: 1.5, color: C.ink1, maxWidth: 820, margin: "0 auto", textWrap: "pretty" }}>{q.line}</p>
              <div style={{ display: "flex", gap: 12, margin: "26px auto 0", maxWidth: 440 }}>
                {[{ l: "Business Capacity", v: report.bizScore, t: T.gold }, { l: "Personal Foundation", v: report.persScore, t: T.green }].map(p => (
                  <div key={p.l} style={{ ...glow(p.t, false), flex: 1, padding: "14px 10px", borderRadius: 14 }}>
                    <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: p.t.ink, marginBottom: 6 }}>{p.l}</div>
                    <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 30, fontWeight: 700, color: p.t.ink, lineHeight: 1 }}>
                      {p.v}<span style={{ fontSize: 14, color: C.ink3 }}>/30</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <h1 style={{ ...H, fontSize: "clamp(34px,8.4vw,60px)", lineHeight: 1.08, margin: 0 }}>
              Your workshop <span style={EM}>pre-work</span>
            </h1>
          )}
        </section>

        {/* ── WHAT HAPPENS WITH IT ── */}
        {resolved && (
          <section style={{ maxWidth: 820, margin: "0 auto", padding: "10px 0 30px", textAlign: "center" }}>
            <h2 style={{ ...H, fontSize: "clamp(30px,6vw,46px)", lineHeight: 1.1, margin: "0 0 14px" }}>
              We start the workshop <span style={EM}>from here</span>
            </h2>
            <p style={{ fontSize: "clamp(16px,3.8vw,19px)", lineHeight: 1.6, color: C.ink2, margin: 0, textWrap: "pretty" }}>
              Your scorecard is the first page of your workbook. At the workshop we test where you landed against your real numbers, and turn it into your next 90 days.
            </p>
          </section>
        )}

        {WORKSHOP_VSL_SRC && (
          <section style={{ maxWidth: 1000, margin: "0 auto", padding: "0 0 34px" }}>
            <div style={{ ...glow(T.gold), padding: 8, overflow: "hidden" }}>
              <video src={WORKSHOP_VSL_SRC} poster={WORKSHOP_VSL_POSTER || undefined} controls playsInline preload="metadata"
                style={{ width: "100%", display: "block", borderRadius: 12, aspectRatio: "16/9", background: "#0A0E14" }} />
            </div>
          </section>
        )}

        {/* ── THE THREE PIECES OF PRE-WORK ── */}
        <section style={{ maxWidth: 720, margin: "0 auto", padding: "0 0 46px" }}>
          <div style={{ ...glow(T.gold), padding: "28px 26px" }}>
            <div style={{ ...KICKER, textAlign: "center" }}>Before the workshop</div>
            <h2 style={{ ...H, fontSize: "clamp(24px,5.6vw,32px)", lineHeight: 1.18, textAlign: "center", margin: "0 0 10px" }}>
              {resolved ? "One down, two to go" : "Three pieces of pre-work"}
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: C.ink2, textAlign: "center", maxWidth: 520, margin: "0 auto 14px" }}>
              They're what we use to build your reports before you arrive, so the afternoon runs on your numbers rather than averages.
            </p>
            {STEPS.map((s, i) => (
              <div key={s.t} className="wsn-step">
                <Num n={s.done ? "✓" : `0${i + 1}`} t={s.done ? T.green : T.gold} size={38} />
                <div className="wsn-txt" style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15.5, fontWeight: 700, color: C.ink1, marginBottom: 3 }}>{s.t}</div>
                  <div style={{ fontSize: 14, lineHeight: 1.5, color: C.ink2 }}>{s.d}</div>
                </div>
                {s.href && <a href={s.href} className="cta wsn-go">Start →</a>}
              </div>
            ))}
          </div>
        </section>

        {/* ── THE ROADMAP - station 01 marked ── */}
        <section style={{ padding: "10px 0 44px" }}>
          <div style={{ textAlign: "center", maxWidth: 820, margin: "0 auto clamp(18px,3vw,34px)" }}>
            <div style={{ ...KICKER, fontSize: 13 }}>The Owner&rsquo;s Virtus Roadmap</div>
            <h2 style={{ ...H, fontSize: "clamp(32px,6.6vw,52px)", lineHeight: 1.1, margin: 0 }}>
              Your scorecard is <span style={EM}>station 01</span>
            </h2>
          </div>
          <RoadmapSystem here={resolved ? [0] : []} />
        </section>

        <footer style={{ maxWidth: 720, margin: "0 auto", padding: "26px 0 50px", borderTop: `1px solid ${C.ruleLight}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", marginBottom: 14 }}>
            <img src="/icons/roadmap-system/shield.png" alt="" width="22" height="22" draggable="false" />
            <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 15, letterSpacing: ".08em", textTransform: "uppercase", color: C.ink2 }}>
              <b style={{ color: T.gold.ink, fontWeight: 600 }}>Kriczky</b> Virtus
            </span>
          </div>
          <p style={{ fontSize: 10.5, lineHeight: 1.6, color: C.ink3, textAlign: "center", margin: 0 }}>
            This scorecard is an educational self-assessment tool from Kriczky Virtus. It is general in nature, is based entirely on your own self-reported answers, and does not constitute individualized financial, tax, legal, or accounting advice, nor a recommendation to pursue any particular course of action. No outcome is projected or guaranteed. Your situation is specific to you - coordinate any decision with your CPA, attorney, and other advisors before acting.
          </p>
        </footer>
      </div>
    </div>
  );
}
