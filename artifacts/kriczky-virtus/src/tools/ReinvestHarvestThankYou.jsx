import { useState, useEffect, useRef } from "react";
/* Cream, like the report and the printed workbooks (see kvTheme.js). */
import { LIGHT as C } from "./kvTheme.js";
import PageTexture from "../PageTexture.jsx";
import RoadmapSystem from "../RoadmapSystem.jsx";
import { CREAM_CSS, Logo, Num, HaloButton, glow, T } from "../CreamKit.jsx";

/* ═══════════════════════════════════════════════════════════════
   REINVEST OR HARVEST - THANK-YOU PAGE
   Route: /reinvest-harvest/next
   Reached immediately after the teaser. Report is emailed in parallel.
   ═══════════════════════════════════════════════════════════════ */

/* Set false before deploy - strips the variant toolbar. */
const PREVIEW = false;

/* TODO: replace with the real iClosed event URLs. Direct iframe only - 
   widget.js does not work in React SPAs. */
const ICLOSED_QUALIFIED = "https://app.iclosed.io/e/kriczkyvirtus/free-reinvest-or-harvest-working-session";
const SKOOL_COLLECTIVE = "https://www.skool.com/virtus-collective";

/* VSL. Raw MP4 rather than an embed so the unmute overlay can control the
   element directly - with YouTube or Vimeo this would mean loading their
   player API and talking to an iframe. Poster fills the 16:9 box while the
   video decodes, otherwise it's a black rectangle for a beat. */
const VSL_SRC = "/video/reinvest-harvest-next.mp4";
const VSL_POSTER = "/video/reinvest-harvest-next-poster.jpg";

export const QUADRANTS = {
  reinvest: {
    label: "Reinvest-Weighted", color: C.green,
    line: "You've earned the right to be aggressive if you want to. Real opportunities inside, and enough outside that a bad year is a setback, not a reset. Few owners have both.",
  },
  split: {
    label: "Concentrated Inside", color: C.gold,
    line: "Almost every extra dollar has gone back into the business, and that's how you built this engine. It's also how owners in this spot end up with everything riding on one asset. Now the job is to start deliberately paying yourself first without stalling growth.",
  },
  harvest: {
    label: "Harvest-Weighted", color: C.cyan,
    line: "You've built the outside, which most owners never do. Your highest-return reinvestment now isn't more growth, it's fixing the one thing choking what your current growth produces.",
  },
  stabilize: {
    label: "Stabilize First", color: C.red,
    line: "Your highest-return move right now is the foundation itself. Build it first and every dollar you reinvest afterward works harder. Skip it and you just get busier.",
  },
};

const REVENUE_BANDS = [
  { value: "Under $500K", qualified: false },
  { value: "$500K - $1M", qualified: false },
  { value: "$1M - $3M",   qualified: true },
  { value: "$3M - $10M",  qualified: true },
  { value: "$10M+",       qualified: true },
];

/* Authority overrides revenue. A GM at a $6M practice can't commission
   1-on-1 advisory, but belongs in the Collective. */
const routeTo = (revenueBand, ownerTier) => {
  if (ownerTier === "Leadership" || ownerTier === "Employee") return "collective";
  const b = REVENUE_BANDS.find(x => x.value === revenueBand);
  return b && b.qualified ? "oneToOne" : "collective";
};

const OFFERS = {
  oneToOne: {
    kicker: "Your next step",
    title: "Map your next 90 days from your results.",
    body: "A free working session. We walk your two scores against your actual numbers and figure out where a reinvested dollar earns most in your specific business. No pitch, no deck.",
    cta: "BOOK YOUR FREE WORKING SESSION",
    url: ICLOSED_QUALIFIED,
    bridge: "The video shows you what to do. This is where you find out whether you're a fit to have me work on it with you - intentionally pursuing reinvestment opportunities inside your business, and building financial freedom outside of it.",
    calHead: "Ready to stop guessing where the next dollar of profit goes?",
    calSub: "Book a free working session - we read your scorecard against your real numbers and map your next 90 days.",
    steps: [
      { t: "We read your scorecard together", d: "Both pillars, and which one is carrying your score." },
      { t: "We pressure-test it against real numbers", d: "Self-reported answers get you a direction. Financials get you an answer." },
      { t: "You leave with your three moves, ranked", d: "Whether or not we work together after that." },
    ],
    note: null,
  },
  collective: {
    kicker: "Your next step",
    title: "Start with the owners already working on this.",
    body: "The Virtus Collective is where owners at your stage work through exactly these decisions - with the playbooks, and with other owners running them at the same time. It is free, and you can be inside it in about a minute.",
    cta: "JOIN THE VIRTUS COLLECTIVE",
    url: SKOOL_COLLECTIVE,
    bridge: "The video shows you what to do. The Collective is where owners actually do it - intentionally pursuing reinvestment opportunities inside their business, and building financial freedom outside of it.",
    calHead: "Ready to work through this alongside other owners?",
    calSub: "The Virtus Collective is free. Six courses mapped to the two sides you were just scored on, plus the owners already running them.",
    steps: [
      { t: "Six courses, mapped to your two scores", d: "The same pillars you were just scored on, in the order they should be worked." },
      { t: "Start with your lowest dimension", d: "Your three moves are already written. The Collective is where you run them." },
      { t: "Re-score as the business changes", d: "Come back through the scorecard. The right answer moves with you." },
    ],
    note: null,
  },
};

/* Reached two ways:
     1. straight after the flow, with state passed in as props
     2. later from the report or the results email, as
        /reinvest-harvest/next?t=<token>#rh-scheduler
   In case 2 the server resolves the token and passes the same props back.
   If the token is missing or unrecognised - forwarded link, mangled by an
   email client - `resolved` comes back false and the page drops to a
   generic booking view rather than rendering a broken result. */
export default function ReinvestHarvestThankYou({
  email = "you@yourcompany.com",
  firstName = "",
  lastName = "",
  phone = "",
  quadrantKey = "split",
  revenueBand = "$3M - $10M",
  ownerTier = "Owner",
  resolved = true,
}) {
  const [q, setQ] = useState(quadrantKey);
  const [rev, setRev] = useState(revenueBand);
  const [tier, setTier] = useState(ownerTier);
  const [playing, setPlaying] = useState(false);
  const vidRef = useRef(null);

  /* Unmute restarts from zero. The first ten seconds are the hook and they're
     written to be heard - someone who watched forty seconds silently hasn't
     really started. Also drops the loop and hands over native controls. */
  const unmuteVideo = () => {
    const v = vidRef.current;
    if (v) {
      v.muted = false;
      v.currentTime = 0;
      v.loop = false;
      const p = v.play();
      if (p && p.catch) p.catch(() => {});
    }
    setPlaying(true);
  };




  const quad = QUADRANTS[q];
  const offerKey = routeTo(rev, tier);
  const offer = OFFERS[offerKey];

  /* Gentle nudge to the calendar.
     Deliberate, not accidental: there was no auto-scroll before - arriving from
     the report's #rh-scheduler link let the browser jump once the lazy iframe
     settled, which looked like a timed scroll but only happened on that one path.
     This does it consistently, and only when it's wanted:
       · a calendar actually exists (resolved 1-on-1)
       · they didn't arrive with the hash - the browser already handled that
       · they haven't started scrolling themselves; their intent wins
       · prefers-reduced-motion is respected
       · fires once
     Targets the iframe minus 110px so the last step stays visible above it - 
     they land on "calendar, with context" rather than mid-page with no anchor. */
  useEffect(() => {
    if (!resolved || offerKey !== "oneToOne") return;
    if (typeof window === "undefined") return;
    if (window.location.hash === "#rh-scheduler") return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    const cancel = () => { cancelled = true; };
    const opts = { passive: true };
    window.addEventListener("wheel", cancel, opts);
    window.addEventListener("touchmove", cancel, opts);
    window.addEventListener("keydown", cancel);

    /* Native smooth scroll. A requestAnimationFrame glide was tried to slow it
       down and read as janky - the eagerly-loaded iClosed iframe does layout work
       on the same frames, so every repaint fought the animation. Native scrolling
       is handled off the main thread and stays smooth regardless. */
    const t = setTimeout(() => {
      if (cancelled) return;
      const frame = document.getElementById("rh-calendar");
      if (!frame) return;
      const top = frame.getBoundingClientRect().top + window.scrollY - 110;
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    }, 2500);

    return () => {
      clearTimeout(t);
      window.removeEventListener("wheel", cancel);
      window.removeEventListener("touchmove", cancel);
      window.removeEventListener("keydown", cancel);
    };
  }, [resolved, offerKey]);


  /* Booking lives on this page, so the fit-call CTAs scroll rather than navigate.
     href is the in-page anchor, not the iClosed URL - that way a middle-click or
     cmd-click can't open the scheduler in a tab either, and with JS disabled the
     browser still jumps to the embed instead of leaving the page.
     Collective has no embed, so that branch keeps its external Skool link. */
  const scrollToScheduler = (e) => {
    e.preventDefault();
    const el = document.getElementById("rh-scheduler");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  /* Prefill the iClosed form from what they already gave us at step 1, so they
     don't retype it. Params must go on the IFRAME src, not the page URL - a
     cross-origin iframe can't read the parent's query string. Because the src is
     built at render time with the values already in hand, there's no load race.
     Blank when unresolved, which is correct: the form then asks as normal. */
  const schedulerUrl = (() => {
    if (offerKey !== "oneToOne") return offer.url;
    const full = `${firstName} ${lastName}`.trim();
    const p = new URLSearchParams();
    if (full) p.set("iclosedName", full);
    if (email && email !== "you@yourcompany.com") p.set("iclosedEmail", email);
    /* Digits only. We store 555-123-4567 for Sheets and AC, but iClosed's phone
       field can't parse the dashes - their docs show iclosedPhone=1234567890.
       Sheets and AC keep the formatted value; only iClosed gets the stripped one. */
    const phoneDigits = String(phone || "").replace(/\D/g, "");
    if (phoneDigits) p.set("iclosedPhone", phoneDigits);
    const q = p.toString();
    return q ? `${offer.url}?${q}` : offer.url;
  })();

  const ctaHref = offerKey === "oneToOne" ? "#rh-scheduler" : offer.url;
  const ctaProps = offerKey === "oneToOne"
    ? { onClick: scrollToScheduler }
    : { target: "_blank", rel: "noopener noreferrer" };

  const wrap = { maxWidth: 720, margin: "0 auto", padding: "0 20px" };
  /* Breaks out past the 720 column so long copy lands on two lines at desktop. */
  const wide = { maxWidth: 1120, margin: "0 auto", padding: "0 20px" };
  const kicker = { fontSize: 10, fontWeight: 700, letterSpacing: ".2em", textTransform: "uppercase" };

  return (
    <div style={{ background: C.bgDeep, minHeight: "100vh", fontFamily: "'DM Sans',sans-serif", color: C.text1, paddingBottom: PREVIEW ? 90 : 40, position: "relative", isolation: "isolate", overflowX: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet" />
      <style>{CREAM_CSS + `
        body{background:${C.bgDeep}}
        .vsl-panel{animation:vslPulse 2.4s ease-in-out infinite}
        .vsl-unmute:hover .vsl-panel{transform:scale(1.04)}
        @keyframes vslPulse{0%,100%{transform:scale(1);box-shadow:0 10px 40px rgba(0,0,0,.45)}50%{transform:scale(1.035);box-shadow:0 10px 52px rgba(0,0,0,.5),0 0 34px rgba(200,162,78,.45)}}
        @media(prefers-reduced-motion:reduce){.vsl-panel{animation:none}}
      `}</style>
      {/* the engraved ground, and a soft glow at the top (as on the landing page) */}
      <PageTexture />
      <div aria-hidden="true" style={{ position: "absolute", top: -80, left: "50%", transform: "translateX(-50%)", width: "min(1100px,150vw)", height: 560,
        background: `radial-gradient(ellipse at center, ${T.gold.fill}1c 0%, transparent 66%)`, pointerEvents: "none", zIndex: -1 }} />

      <Logo style={{ padding: "25px 22px 0" }} />

      {/* ── CONFIRMATION - a porcelain pill with a green edge ── */}
      {resolved && <div style={{ display: "flex", justifyContent: "center", padding: "22px 20px 0" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "10px 20px", borderRadius: 999, maxWidth: "100%",
          background: "linear-gradient(180deg,#FFFEFB 0%,#F5EFE3 100%)", border: `1px solid ${T.green.fill}88`,
          boxShadow: `inset 0 1px 0 rgba(255,255,255,.95), 0 1px 2px rgba(10,14,20,.06), 0 6px 16px rgba(10,14,20,.08), 0 0 20px ${T.green.fill}33` }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
            <polyline points="4 12 10 18 20 6" stroke={C.green} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ fontSize: 14, color: C.text1, overflowWrap: "anywhere" }}>
            Your scorecard is on its way to <b style={{ color: C.green }}>{email}</b>
          </span>
        </div>
      </div>}

      <div style={{ ...wide, position: "relative", zIndex: 1 }}>

        {/* ── QUADRANT HERO ── */}
        {resolved ? (
          <section style={{ padding: "38px 0 26px", textAlign: "center" }}>
            <div style={{ ...kicker, color: quad.color, marginBottom: 14 }}>You landed in</div>
            <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: "clamp(40px,9.6vw,64px)", textTransform: "uppercase", letterSpacing: ".01em", color: quad.color, lineHeight: 1.06, margin: "0 0 22px" }}>
              {quad.label}
            </h1>
            <p style={{ fontSize: "clamp(16px,3.9vw,20px)", lineHeight: 1.5, color: C.text1, maxWidth: 820, margin: "0 auto", fontWeight: 400 }}>
              {quad.line}
            </p>
            {/* Qualifier - 1-on-1 branch only. On the Collective branch it would
                describe an offer that isn't being made. */}
            {offerKey === "oneToOne" && (
              <p style={{ fontSize: "clamp(13.5px,3.1vw,15.5px)", lineHeight: 1.6, color: C.text3, maxWidth: 680, margin: "18px auto 0" }}>
                For owners doing $1M&ndash;$10M who want a clear answer to &ldquo;how much stays in the business vs comes out to me&rdquo; and hands-on help executing it as the constraint moves.
              </p>
            )}
          </section>
        ) : (
          /* Same copy as the resolved page's bridge section. Deliberate: it is
             fully generic, whereas the earlier hero referenced "your two scores"
 - which a visitor arriving on a bad token may not have. */
          <section style={{ padding: "52px 0 34px", textAlign: "center" }}>
            <div style={{ ...kicker, color: C.gold, marginBottom: 14 }}>Reinvest or Harvest</div>
            {/* Sized to the resolved page's hero rather than the bridge section.
                The bridge sits mid-page under a result; here this is the hero and
                was reading far too small. Capped at 64px so the fallback never
                shouts louder than a real result page. */}
            <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: "clamp(34px,8.4vw,64px)", lineHeight: 1.08, color: C.text1, margin: "0 0 22px" }}>
              Want help proactively reinvesting in your business?
            </h1>
            {/* balance + a wider measure: at 760 the last line was just "of it." */}
            <p style={{ fontSize: "clamp(16px,4vw,22px)", lineHeight: 1.55, color: C.text2, maxWidth: 900, margin: "0 auto", textWrap: "balance" }}>
              This is where you find out whether you're a fit to have me work on it with you - intentionally pursuing reinvestment opportunities inside your business, and building financial freedom outside of it.
            </p>
          </section>
        )}

        {/* ── NEXT 90 DAYS - the ask and the calendar as one block ──
             They read what happens in the session, then see times immediately
             underneath. The calendar on its own, above any reason to book, was
             asking before explaining. */}
        <section id="rh-scheduler" style={{ ...wrap, padding: "4px 0 40px", scrollMarginTop: 24 }}>
          <div style={{ ...glow(T.gold), padding: "32px 24px" }}>

            {/* Same block in both states. Someone on a bad token has almost always
                taken the scorecard - a forwarded or mangled link - so the steps and
                the ask read correctly for them too. */}
            <div style={{ ...kicker, color: C.gold, marginBottom: 12, textAlign: "center" }}>{offer.kicker}</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: "clamp(24px,5.6vw,32px)", lineHeight: 1.18, color: C.text1, textAlign: "center", margin: "0 0 14px" }}>
              {offer.title}
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.65, color: C.text2, textAlign: "center", maxWidth: 520, margin: "0 auto 24px" }}>
              {offer.body}
            </p>

            {offer.steps.map((s, i) => (
              <div key={s.t} style={{ display: "flex", gap: 15, alignItems: "flex-start", padding: "14px 0", borderBottom: i < 2 ? `1px solid ${C.lineSoft}` : "none" }}>
                <Num n={`0${i + 1}`} size={38} />
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: C.text1, marginBottom: 3 }}>{s.t}</div>
                  <div style={{ fontSize: 14, lineHeight: 1.55, color: C.text2 }}>{s.d}</div>
                </div>
              </div>
            ))}

            {offer.note && (
              <div style={{ marginTop: 18, padding: "11px 16px", borderRadius: 9, background: `${C.gold}0d`, border: `1px solid ${C.gold}2e`, textAlign: "center" }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.gold }}>{offer.note}</span>
              </div>
            )}

            {/* The calendar sits directly under the reasons to use it. */}
            {offerKey === "oneToOne" ? (
              <div id="rh-calendar" style={{ marginTop: 26, borderRadius: 14, overflow: "hidden", border: `1px solid ${C.line}`, background: C.bgCard, minHeight: 620 }}>
                {/* Direct iframe. Do NOT use iClosed widget.js - it races the React render. */}
                <iframe src={schedulerUrl} title="Book your working session" width="100%" height="620"
                  style={{ border: "none", display: "block" }} loading="lazy" />
              </div>
            ) : (
              <div style={{ marginTop: 26 }}>
                <HaloButton href={offer.url} target="_blank" rel="noopener noreferrer" block size={16.5}>{offer.cta}</HaloButton>
              </div>
            )}
          </div>
        </section>



        {/* ── VIDEO HEADING - 1-on-1 only: it names a working session the
             Collective branch does not offer. ── */}
        {offerKey === "oneToOne" && (
        /* Breaks out of the 1120px page shell - the 60px line needs ~1301px.
           Negative margins are the only way out of a maxWidth parent; the width
           calc keeps it inside the viewport so nothing overflows. */
        <section style={{ textAlign: "center", marginLeft: "calc(50% - 50vw)", marginRight: "calc(50% - 50vw)", width: "100vw", maxWidth: "100vw", padding: "0 20px 22px", boxSizing: "border-box" }}>
          {/* Back to 60px. The line measures ~21.7x the font size, so at 60px it
              needs 1301px - wider than the 1080 column. The heading gets its own
              1400px container and the 4.4vw term keeps it on one line all the way
              down to 1024px, where it lands at 45px. */}
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: "clamp(28px,4.4vw,60px)", lineHeight: 1.1, color: C.text1, margin: "0 auto 20px", maxWidth: 1400, textWrap: "balance" }}>
            Want to see what we'll do in your working session?
          </h2>
          <p style={{ fontSize: "clamp(17px,4vw,22px)", lineHeight: 1.55, color: C.text2, maxWidth: 900, margin: "0 auto" }}>
            1 minute 40 seconds on how we use your two scores and real numbers to map your next 90 days.
          </p>
        </section>
        )}

        {/* ── VSL - 1-on-1 only ──
            The video sells the working session. On the Collective branch that's
            an offer they can't take, so it would build appetite for the wrong
            thing and push the Skool button further down the page.
            Breaks out of the 720px reading column to 1080; it's 16:9 so the
            height follows, capped at 1080 to stay inside the 1120px shell. ── */}
        {offerKey === "oneToOne" && (<>
        <section style={{ maxWidth: 1080, margin: "0 auto", padding: "0 20px 40px" }}>
          <div className="vsl"
            style={{ position: "relative", aspectRatio: "16/9", borderRadius: 16, overflow: "hidden", background: "#E9E3D7", border: `1px solid ${C.gold}33`, boxShadow: `0 12px 32px rgba(10,14,20,.14), 0 0 40px ${C.goldLight}1a` }}>

            <video
              ref={vidRef}
              src={VSL_SRC}
              poster={VSL_POSTER}
              autoPlay
              muted
              loop={!playing}
              playsInline
              preload="auto"
              controls={playing}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />

            {/* Overlay sits on top until the first tap. The video is visible
                through it, so there's motion drawing the eye before anyone clicks. */}
            {!playing && (
              <button
                onClick={unmuteVideo}
                aria-label="Unmute video"
                className="vsl-unmute"
                style={{
                  position: "absolute", inset: 0, width: "100%", height: "100%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "transparent", border: "none", cursor: "pointer", padding: 0,
                }}>
                <span className="vsl-panel" style={{
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  width: "58%", maxWidth: 520, padding: "6% 4%", borderRadius: 20,
                  background: `${C.goldLight}b3`, border: `1px solid ${C.goldLight}`,
                  boxShadow: `0 10px 40px rgba(0,0,0,.45)`,
                }}>
                  <svg width="13%" viewBox="0 0 24 24" fill="#0A0E14" style={{ minWidth: 34, maxWidth: 66, marginBottom: "5%" }}>
                    <path d="M3 9v6h4l5 5V4L7 9H3z" />
                    <path d="M16.5 12c0-1.8-1-3.3-2.5-4v8c1.5-.7 2.5-2.2 2.5-4z" />
                    <path d="M14 3.2v2.1c2.9.9 5 3.5 5 6.7s-2.1 5.8-5 6.7v2.1c4-1 7-4.5 7-8.8s-3-7.8-7-8.8z" />
                  </svg>
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, color: "#0A0E14", lineHeight: 1.25, textAlign: "center", fontSize: "clamp(15px,2.6vw,26px)" }}>
                    Your video is playing<br />Click to unmute
                  </span>
                  {/* Quiet third line - the panel's job is one instruction, so the
                      runtime sits under it rather than competing with it. */}
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 600, color: "#0A0E14", opacity: .72, letterSpacing: ".05em", marginTop: "3%", fontSize: "clamp(11px,1.5vw,15px)" }}>
                    1 MIN 40 SEC
                  </span>
                </span>
              </button>
            )}
          </div>
        </section>
        </>)}



        {/* ── CTA - belongs to the video above it, so it goes with the video.
             Without this gate the Collective branch shows two identical JOIN
             buttons 134px apart, since the card already carries one. ── */}
        {resolved && offerKey === "oneToOne" && (
        <section style={{ ...wrap, paddingBottom: 46, textAlign: "center" }}>
          <HaloButton href={ctaHref} {...ctaProps}>{offer.cta}</HaloButton>
        </section>
        )}

        {!resolved && (
          <section style={{ ...wrap, paddingBottom: 46, textAlign: "center" }}>
            <HaloButton href="#rh-scheduler" onClick={scrollToScheduler}>BOOK YOUR FREE WORKING SESSION</HaloButton>
            <p style={{ fontSize: 13.5, color: C.text3, margin: "16px 0 0" }}>
              <a href="/reinvest-harvest" style={{ color: C.text3 }}>Haven't taken the scorecard yet?</a>
            </p>
          </section>
        )}


        {/* ── ROADMAP - supporting material, below the video ── */}
        <section style={{ maxWidth: 1180, margin: "0 auto", padding: "10px 0 44px" }}>
          <div style={{ textAlign: "center", marginBottom: "clamp(18px,3vw,34px)", maxWidth: 940, marginLeft: "auto", marginRight: "auto" }}>
            {/* Scaled to match the video section above - this and the VSL block are
                the two supporting sections and were reading much smaller than it. */}
            <div style={{ ...kicker, fontSize: 15, color: C.gold, marginBottom: 14 }}>Where this leads</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: "clamp(32px,7.9vw,60px)", lineHeight: 1.1, color: C.text1, margin: "0 0 16px" }}>
              The scorecard is <span style={{ color: C.gold, fontStyle: "italic", fontWeight: 400 }}>step one</span>
            </h2>
            <p style={{ fontSize: "clamp(17px,4vw,23px)", lineHeight: 1.55, color: C.text2, maxWidth: 800, margin: "0 auto" }}>
              It answers the reinvest-or-harvest question for where you are today. This is the system for how you keep answering it as the business changes.
            </p>
          </div>

          {/* The Owner's Virtus Roadmap, live. They just took the scorecard, so
              station 01 is marked "You are here". Someone arriving on a bad token
              hasn't scored, so nothing is marked. */}
          <RoadmapSystem here={resolved ? [0] : []} workshop={false} />
        </section>



        {/* ── DISCLOSURE ── */}
        <footer style={{ ...wrap, paddingTop: 26, borderTop: `1px solid ${C.lineSoft}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", marginBottom: 14 }}>
            {C.light ? <img src="/icons/roadmap-system/shield.png" alt="" width="22" height="22" draggable="false" /> : <svg width="19" height="19" viewBox="0 0 64 64" fill="none"><path d="M32 8L14 16V30C14 42 22 52 32 56C42 52 50 42 50 30V16L32 8Z" fill="none" stroke={C.gold} strokeWidth="2.5" strokeLinejoin="round" /></svg>}
            <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 15, letterSpacing: ".08em", textTransform: "uppercase", color: C.text2 }}>
              <b style={{ color: C.gold, fontWeight: 600 }}>Kriczky</b> Virtus
            </span>
          </div>
          <p style={{ fontSize: 10.5, lineHeight: 1.6, color: C.text3, textAlign: "center", margin: 0 }}>
            This scorecard is an educational self-assessment tool from Kriczky Virtus. It is general in nature, is based entirely on your own self-reported answers, and does not constitute individualized financial, tax, legal, or accounting advice, nor a recommendation to pursue any particular course of action. No outcome is projected or guaranteed. Your situation is specific to you - coordinate any decision with your CPA, attorney, and other advisors before acting.
          </p>
        </footer>
      </div>

      {/* ── PREVIEW TOOLBAR - not present in production ── */}
      {PREVIEW && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 99, background: "rgba(10,14,20,.95)", backdropFilter: "blur(10px)", borderTop: `1px solid ${C.gold}44`, padding: "10px 14px", display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}>
          <span style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: C.gold, padding: "3px 8px", borderRadius: 4, border: `1px solid ${C.gold}55`, background: `${C.gold}12` }}>Preview</span>
          {Object.keys(QUADRANTS).map(k => (
            <button key={k} onClick={() => setQ(k)}
              style={{ padding: "5px 10px", borderRadius: 7, cursor: "pointer", fontSize: 10.5, fontWeight: 600, fontFamily: "'DM Sans',sans-serif", color: QUADRANTS[k].color, background: q === k ? `${QUADRANTS[k].color}26` : `${QUADRANTS[k].color}0d`, border: `1px solid ${QUADRANTS[k].color}${q === k ? "88" : "33"}` }}>
              {QUADRANTS[k].label.split(" - ")[0]}
            </button>
          ))}
          <div style={{ width: 1, height: 18, background: "rgba(255,255,255,.14)" }} />
          <select value={rev} onChange={e => setRev(e.target.value)}
            style={{ padding: "5px 8px", borderRadius: 7, fontSize: 10.5, fontFamily: "'DM Sans',sans-serif", color: C.text1, background: "#0F141C", border: "1px solid rgba(255,255,255,.16)" }}>
            {REVENUE_BANDS.map(b => <option key={b.value} value={b.value}>{b.value}</option>)}
          </select>
          <select value={tier} onChange={e => setTier(e.target.value)}
            style={{ padding: "5px 8px", borderRadius: 7, fontSize: 10.5, fontFamily: "'DM Sans',sans-serif", color: C.text1, background: "#0F141C", border: "1px solid rgba(255,255,255,.16)" }}>
            {["Owner", "Leadership", "Employee"].map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <span style={{ fontSize: 10.5, color: C.text2 }}>
            → <b style={{ color: routeTo(rev, tier) === "oneToOne" ? C.gold : C.green }}>
              {routeTo(rev, tier) === "oneToOne" ? "1-on-1" : "Collective"}
            </b>
          </span>
        </div>
      )}
    </div>
  );
}
