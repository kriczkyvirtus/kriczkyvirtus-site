import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════
   THE OWNER'S VIRTUS ROADMAP - an interactive system map.
   Six porcelain station tiles orbit the roadmap itself; light travels
   along the spokes and around the ring to show each station feeding the
   next. A side panel says what the highlighted station fixes.

   It walks the stations on its own while it's on screen. Hovering or
   tapping a station takes over; it picks the walk back up after a pause.
   Tiles lean gently toward the visitor's pointer.
   ═══════════════════════════════════════════════════════════════ */

const TONE = {
  gold:  { ink: "#7A5C1E", fill: "#C8A24E" },
  green: { ink: "#1B7A57", fill: "#34D399" },
  cyan:  { ink: "#0E7490", fill: "#22D3EE" },
};

const STATIONS = [
  { n: "01", t: "Reinvest or Harvest?", tone: "gold", ic: "c1", workshop: true,
    pain: "Profit lands and you decide on gut feel what goes back into the business and what comes out to you.",
    shift: "A clear answer for where you are today, scored across ten dimensions of the business and your personal wealth.",
    why: "Every dollar you move has a reason behind it, so growing the business and creating personal financial freedom stop competing." },
  { n: "02", t: "Know Your Numbers", tone: "gold", ic: "c2", workshop: true,
    pain: "You can't say what the ROI was for your last big hire, truck, buildout, or software spend.",
    shift: "Every reinvestment gets an expected return and a date where you check it against what actually happened.",
    why: "You repeat what works and stop funding what doesn't, instead of guessing again next year." },
  { n: "03", t: "Find The Constraint", tone: "gold", ic: "c3", workshop: true,
    pain: "You keep spending to fix the problem you can see, not the one that's actually preventing growth.",
    shift: "You find the single stage limiting growth right now and aim your next dollar there first.",
    why: "More money in stops meaning you just get busier. It starts meaning the business can grow sustainably." },
  { n: "04", t: "The Profit Split System", tone: "green", ic: "c4",
    pain: "What is reinvested, held in reserves, and comes out to you is made by guessing every month.",
    shift: "A standing split, so profit is allocated on purpose every time it lands, not when there's time to think.",
    why: "The business keeps the fuel it needs to grow, and you keep building wealth while it does." },
  { n: "05", t: "Build The Outside", tone: "green", ic: "c5",
    pain: "Nearly everything you own is tied up in one company, and tax is something that happens to you each April.",
    shift: "A Wealth Roadmap to build assets that aren't the company, and a tax plan that looks years ahead instead of 1 year back.",
    why: "Your personal wealth and financial freedom stops riding solely on how your business performs each quarter." },
  { n: "06", t: "Your Wealth North Star", tone: "cyan", ic: "c6",
    pain: "You're growing, but toward what? No number and no date tells you what enough looks like.",
    shift: "A specific destination: the number, the date, and the life it's meant to pay for.",
    why: "Every reinvest-or-harvest decision becomes a question with an answer." },
];

const CYCLE_MS = 5200;     /* time on each station while it walks on its own */
const RESUME_MS = 9000;    /* quiet time after an interaction before it walks again */

/* Stations sit clockwise from upper-left, so 01 to 03 share the top arc. */
const ANGLES = [-150, -90, -30, 30, 90, 150].map(a => (a * Math.PI) / 180);

const Shield = ({ size = 46 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true"
    style={{ filter: "drop-shadow(0 0 10px rgba(200,162,78,.45)) drop-shadow(0 0 3px rgba(200,162,78,.6))" }}>
    <path d="M32 8L14 16V30C14 42 22 52 32 56C42 52 50 42 50 30V16L32 8Z" fill="none" stroke="#7A5C1E" strokeWidth="2.6" strokeLinejoin="round" />
    <path d="M32 12L18 18.5V30C18 39.5 24 47.5 32 51C40 47.5 46 39.5 46 30V18.5L32 12Z" fill="none" stroke="#7A5C1E" strokeWidth="1" opacity=".42" strokeLinejoin="round" />
  </svg>
);

export default function RoadmapSystem({ onCta }) {
  const boxRef = useRef(null);
  const stageRef = useRef(null);
  const [S, setS] = useState(560);            /* the orbit's side length in px */
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);   /* someone just picked a station */
  const [picks, setPicks] = useState(0);         /* restarts the resume timer on every pick */
  const [hovering, setHovering] = useState(false); /* pointer resting on a station */
  const [inView, setInView] = useState(false);
  const [reduced, setReduced] = useState(false);

  /* Size the orbit to its column. */
  useEffect(() => {
    const el = boxRef.current; if (!el) return;
    const ro = new ResizeObserver(([e]) => setS(Math.max(300, Math.min(600, Math.round(e.contentRect.width)))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* "Tap" or "Hover over", by the device rather than the screen width. */
  const [touch, setTouch] = useState(false);
  useEffect(() => { setTouch(!window.matchMedia("(hover: hover) and (pointer: fine)").matches); }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches); on();
    mq.addEventListener?.("change", on);
    return () => mq.removeEventListener?.("change", on);
  }, []);

  /* Only walk the stations while someone can see them. */
  useEffect(() => {
    const el = stageRef.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* While it's walking, each station gets CYCLE_MS - the same time its
     progress bar takes to fill - then hands over to the next. */
  const running = inView && !paused && !hovering;
  useEffect(() => {
    if (!running) return;
    const to = setTimeout(() => setActive(a => (a + 1) % STATIONS.length), CYCLE_MS);
    return () => clearTimeout(to);
  }, [running, active]);

  /* A pick holds the station; after a quiet spell the walk picks back up from there. */
  useEffect(() => {
    if (!paused || hovering) return;
    const to = setTimeout(() => setPaused(false), RESUME_MS);
    return () => clearTimeout(to);
  }, [paused, picks, hovering]);

  const pick = useCallback((i) => { setActive(i); setPaused(true); setPicks(n => n + 1); }, []);

  /* Pointer lean: tiles drift toward the cursor, nearer layers drift more.
     Written straight to the DOM each frame so React doesn't re-render. */
  useEffect(() => {
    const stage = stageRef.current; if (!stage || reduced) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine) return;
    let tx = 0, ty = 0, x = 0, y = 0, frame;
    const onMove = (e) => {
      const r = stage.getBoundingClientRect();
      tx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width / 2)));
      ty = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (r.height / 2)));
    };
    const onLeave = () => { tx = 0; ty = 0; };
    const tick = () => {
      x += (tx - x) * 0.08; y += (ty - y) * 0.08;
      stage.style.setProperty("--px", x.toFixed(4));
      stage.style.setProperty("--py", y.toFixed(4));
      frame = requestAnimationFrame(tick);
    };
    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerleave", onLeave);
    frame = requestAnimationFrame(tick);
    return () => { stage.removeEventListener("pointermove", onMove); stage.removeEventListener("pointerleave", onLeave); cancelAnimationFrame(frame); };
  }, [reduced]);

  /* ── geometry ── */
  const H = Math.round(S * 1.04);
  const cx = S / 2, cy = H * 0.515;
  const R = S * 0.355;                         /* station ring */
  const R2 = R + S * 0.085;                    /* outer ring, carries the workshop arc */
  const T = Math.round(Math.max(52, Math.min(84, S * 0.14)));   /* station tile */
  const narrow = S < 470;
  const CT = Math.round(narrow ? S * 0.19 : Math.max(84, Math.min(128, S * 0.21))); /* centre tile */
  const pos = ANGLES.map(a => ({ x: cx + R * Math.cos(a), y: cy + R * Math.sin(a) }));
  const arc = (r, a0, a1) => {
    const p0 = [cx + r * Math.cos(a0), cy + r * Math.sin(a0)], p1 = [cx + r * Math.cos(a1), cy + r * Math.sin(a1)];
    return `M${p0[0].toFixed(1)} ${p0[1].toFixed(1)} A${r} ${r} 0 0 1 ${p1[0].toFixed(1)} ${p1[1].toFixed(1)}`;
  };
  const wsPad = 0.3;   /* how far the workshop arc runs past 01 and 03 */
  const st = STATIONS[active];
  const tone = TONE[st.tone];

  return (
    <div className="vrs" style={{ display: "flex", gap: "clamp(20px,3.6vw,52px)", alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}>
      {/* ── the orbit ── */}
      <div ref={boxRef} style={{ flex: "1 1 460px", maxWidth: 600, minWidth: 0 }}>
        <div ref={stageRef} className="vrs-stage" style={{ position: "relative", width: S, height: H, margin: "0 auto", "--px": 0, "--py": 0 }}>
          {/* soft wash behind everything */}
          <div aria-hidden="true" style={{ position: "absolute", left: cx - S * 0.5, top: cy - S * 0.5, width: S, height: S, borderRadius: "50%",
            background: `radial-gradient(circle, ${tone.fill}24 0%, ${tone.fill}0c 34%, transparent 66%)`, transition: "background .9s ease", pointerEvents: "none" }} />

          <svg width={S} height={H} viewBox={`0 0 ${S} ${H}`} aria-hidden="true" className="vrs-lines"
            style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            <defs>
              <pattern id="vrs-dots" width="18" height="18" patternUnits="userSpaceOnUse">
                <circle cx="1.2" cy="1.2" r="1.1" fill="#B9AE9A" opacity=".35" />
              </pattern>
              <radialGradient id="vrs-fade"><stop offset="55%" stopColor="#fff" /><stop offset="100%" stopColor="#fff" stopOpacity="0" /></radialGradient>
              <mask id="vrs-mask"><circle cx={cx} cy={cy} r={R2 + 6} fill="url(#vrs-fade)" /></mask>
              {pos.map((p, i) => <path key={i} id={`vrs-spoke-${i}`} d={`M${cx} ${cy} L${p.x.toFixed(1)} ${p.y.toFixed(1)}`} />)}
              {pos.map((_, i) => <path key={i} id={`vrs-ring-${i}`} d={arc(R, ANGLES[i], ANGLES[(i + 1) % 6] + (i === 5 ? 2 * Math.PI : 0))} />)}
              <path id="vrs-ws" d={arc(R2 + 12, ANGLES[0] - wsPad, ANGLES[2] + wsPad)} />
            </defs>

            <rect x="0" y="0" width={S} height={H} fill="url(#vrs-dots)" mask="url(#vrs-mask)" />
            <circle cx={cx} cy={cy} r={R2} fill="none" stroke="#D8CFBF" strokeWidth="1" />
            <circle cx={cx} cy={cy} r={R} fill="none" stroke="#D8CFBF" strokeWidth="1" />
            <circle cx={cx} cy={cy} r={R * 0.52} fill="none" stroke="#E2DACB" strokeWidth="1" strokeDasharray="2 5" />

            {/* the workshop's share of the journey */}
            <path d={arc(R2, ANGLES[0] - wsPad, ANGLES[2] + wsPad)} fill="none" stroke={TONE.gold.fill} strokeWidth="2.5" strokeLinecap="round" opacity=".85" />
            <text fontSize={narrow ? 9.5 : 11} fontWeight="700" letterSpacing=".2em" fill={TONE.gold.ink} style={{ fontFamily: "'DM Sans',sans-serif" }}>
              <textPath href="#vrs-ws" startOffset="50%" textAnchor="middle">THE WORKSHOP COVERS 01 TO 03</textPath>
            </text>

            {/* the ring, lit from 01 up to the active station */}
            {pos.map((_, i) => {
              const lit = i < active;
              const tt = TONE[STATIONS[i].tone];
              return <use key={i} href={`#vrs-ring-${i}`} fill="none" stroke={lit ? tt.fill : "transparent"} strokeWidth="2" opacity=".75" style={{ transition: "stroke .6s ease" }} />;
            })}

            {/* spokes */}
            {pos.map((p, i) => {
              const on = i === active;
              const tt = TONE[STATIONS[i].tone];
              return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke={on ? tt.fill : "#D3C9B7"} strokeWidth={on ? 2.2 : 1}
                strokeDasharray={on ? "none" : "3 4"} style={{ transition: "stroke .5s ease, stroke-width .5s ease" }} />;
            })}

            {/* light travelling the system */}
            {!reduced && <>
              {pos.map((_, i) => {
                const on = i === active;
                const tt = TONE[STATIONS[i].tone];
                return (
                  <circle key={`s${i}`} r={on ? 4 : 2.6} fill={on ? tt.fill : "#C8A24E"} opacity={on ? 1 : 0.55}
                    style={{ filter: on ? `drop-shadow(0 0 5px ${tt.fill})` : "none" }}>
                    <animateMotion dur={on ? "1.6s" : "4.2s"} begin={`${-i * 0.7}s`} repeatCount="indefinite"
                      keyPoints={i % 2 ? "0;1" : "1;0"} keyTimes="0;1" calcMode="linear">
                      <mpath href={`#vrs-spoke-${i}`} />
                    </animateMotion>
                  </circle>
                );
              })}
              {pos.map((_, i) => (
                <circle key={`r${i}`} r="3" fill={TONE[STATIONS[i].tone].fill} opacity=".8">
                  <animateMotion dur="3.4s" begin={`${-i * 0.57}s`} repeatCount="indefinite"><mpath href={`#vrs-ring-${i}`} /></animateMotion>
                </circle>
              ))}
            </>}
          </svg>

          {/* centre: the roadmap itself */}
          <div className="vrs-centre" style={{ position: "absolute", left: cx, top: cy, transform: "translate(-50%,-50%) translate(calc(var(--px) * 4px), calc(var(--py) * 4px))",
            display: "flex", flexDirection: "column", alignItems: "center", zIndex: 2 }}>
            <div className="vrs-pulse" aria-hidden="true" style={{ position: "absolute", top: CT / 2, left: "50%", width: CT * 1.5, height: CT * 1.5,
              transform: "translate(-50%,-50%)", borderRadius: "50%", background: `radial-gradient(circle, ${TONE.gold.fill}55 0%, transparent 68%)` }} />
            <div className="vrs-tile vrs-core" style={{ width: CT, height: CT, borderRadius: Math.round(CT * 0.27), position: "relative" }}>
              <Shield size={Math.round(CT * 0.52)} />
            </div>
            <div className="vrs-pill" style={{ marginTop: narrow ? 7 : 10, fontSize: narrow ? 11 : 13.5, fontWeight: 700, lineHeight: 1.2, textAlign: "center",
              padding: narrow ? "5px 11px" : "7px 15px", borderRadius: narrow ? 12 : 999, whiteSpace: "nowrap", position: "relative" }}>
              {narrow ? <>Owner’s Virtus<br />Roadmap</> : "Owner’s Virtus Roadmap"}
            </div>
          </div>

          {/* stations */}
          {STATIONS.map((s, i) => {
            const on = i === active;
            const tt = TONE[s.tone];
            const depth = 9 + (i % 3) * 3;
            return (
              <button key={s.n} type="button" className={`vrs-st${on ? " on" : ""}`} aria-pressed={on}
                aria-label={`Station ${s.n}: ${s.t}`}
                onMouseEnter={() => { pick(i); setHovering(true); }} onMouseLeave={() => { setHovering(false); setPicks(n => n + 1); }} onFocus={() => pick(i)} onClick={() => pick(i)}
                style={{ position: "absolute", left: pos[i].x, top: pos[i].y, zIndex: on ? 4 : 3,
                  transform: `translate(-50%, ${-T / 2}px) translate(calc(var(--px) * ${depth}px), calc(var(--py) * ${depth}px))`,
                  "--tone": tt.ink, "--fill": tt.fill }}>
                <span className="vrs-tile vrs-sttile" style={{ width: T, height: T, borderRadius: Math.round(T * 0.27) }}>
                  <img src={`/icons/reinvest-harvest/${s.ic}.png`} alt="" width={Math.round(T * 0.66)} height={Math.round(T * 0.66)} draggable="false" />
                  {s.workshop && <span className="vrs-ws" aria-hidden="true" title="Covered in the workshop">
                    <svg width="10" height="10" viewBox="0 0 12 12"><path d="M2.5 6.4l2.3 2.3 4.7-5" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </span>}
                </span>
                <span className="vrs-pill vrs-stpill" style={narrow ? { fontSize: 11, padding: "3px 9px", marginTop: -19, position: "relative" } : { fontSize: 13 }}>
                  <span style={{ fontFamily: "'Playfair Display',serif", color: tt.ink, marginRight: narrow ? 0 : 6 }}>{s.n}</span>
                  {!narrow && s.t}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── what the highlighted station fixes ── */}
      <div style={{ flex: "1 1 340px", maxWidth: 440, minWidth: 0, width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 11.5, fontWeight: 700, letterSpacing: ".18em", textTransform: "uppercase", color: "#6B6459", marginBottom: 12 }}>
          <span className="vrs-live" style={{ "--fill": tone.fill }} aria-hidden="true" />
          <span style={{ whiteSpace: "nowrap" }}>Station {st.n} of 06</span>
          {st.workshop
            ? <span className="vrs-tag" style={{ background: `${TONE.gold.fill}22`, color: TONE.gold.ink, borderColor: `${TONE.gold.fill}66` }}>Covered in the workshop</span>
            : <span className="vrs-tag" style={{ background: "#FFFFFF", color: "#6B6459", borderColor: "#DCD4C5" }}>After the workshop</span>}
        </div>
        <div style={{ display: "grid" }}>
        {STATIONS.map((sx, si) => si === active ? (
        <div aria-live="polite" key={`on${active}`} style={{ gridArea: "1 / 1" }}>
          <h3 className="vrs-in" style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: "clamp(28px,3.6vw,36px)", lineHeight: 1.08, color: "#0A0E14", margin: "0 0 16px" }}>
            {st.t}
          </h3>
          {[
            ["pain", "The Problem This Removes", st.pain, "#B4403F", "pain"],
            ["shift", "What You Get", st.shift, tone.ink, `get-${st.tone}`],
            ["why", "Why It Matters", st.why, "#1B7A57", "why"],
          ].map(([k, label, text, c, icon], j) => (
            <div key={k} className={`vrs-card vrs-in${j === 1 ? " hi" : ""}`} style={{ animationDelay: `${0.08 + j * 0.12}s`, "--edge": `${tone.fill}88` }}>
              <span className="vrs-tile" style={{ width: 56, height: 56, borderRadius: 15, flexShrink: 0 }}>
                <img src={`/icons/roadmap-system/${icon}.png`} alt="" width="42" height="42" draggable="false" /></span>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: c, marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 15.5, lineHeight: 1.5, color: "#3E4652" }}>{text}</div>
              </div>
            </div>
          ))}
        </div>
        ) : (
        <div key={sx.n} aria-hidden="true" style={{ gridArea: "1 / 1", visibility: "hidden" }}>
          <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: "clamp(28px,3.6vw,36px)", lineHeight: 1.08, margin: "0 0 16px" }}>{sx.t}</h3>
          {[sx.pain, sx.shift, sx.why].map((text, j) => (
            <div key={j} className="vrs-card"><span style={{ width: 56, height: 56, flexShrink: 0 }} />
              <div><div style={{ fontSize: 11, marginBottom: 4, letterSpacing: ".14em" }}>&nbsp;</div><div style={{ fontSize: 15.5, lineHeight: 1.5 }}>{text}</div></div></div>
          ))}
        </div>
        ))}
        </div>

        {/* progress, doubles as navigation */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 16 }}>
          {STATIONS.map((s, i) => {
            const f = TONE[s.tone].fill;
            /* done: full. current: fills over the time left on this station
               (held full while paused). upcoming: empty. */
            return (
              <button key={s.n} type="button" aria-label={`Show station ${s.n}`} onClick={() => pick(i)} className="vrs-seg"
                style={{ background: i === active ? `${f}33` : (i < active ? f : "#E2DACB") }}>
                {i === active && <span key={`${active}-${running}`} className={running ? "vrs-fill run" : "vrs-fill"}
                  style={{ background: f, animationDuration: `${CYCLE_MS}ms` }} />}
              </button>
            );
          })}
        </div>
        <div style={{ textAlign: "center", marginTop: 12, lineHeight: 1.6 }}>
          <div style={{ fontSize: 13, color: "#8C8476" }}>{touch ? "Tap" : "Hover over"} a station to explore.</div>
          {onCta && <a href="#register" onClick={onCta} style={{ display: "inline-block", fontSize: 13.5, color: "#7A5C1E", fontWeight: 600, textDecoration: "none" }}>
            Walk 01 to 03 with your numbers &#8594;</a>}
        </div>
      </div>

      <style>{`
        .vrs-tile{display:inline-flex;align-items:center;justify-content:center;position:relative;
          background:linear-gradient(180deg,#FFFEFB 0%,#F7F2E8 100%);border:1px solid #E6DFD1;
          box-shadow:inset 0 1px 0 rgba(255,255,255,.9),0 1px 2px rgba(10,14,20,.06),0 10px 22px rgba(10,14,20,.12)}
        .vrs-tile img{display:block;user-select:none;pointer-events:none}
        .vrs-core{box-shadow:inset 0 1px 0 rgba(255,255,255,.95),0 0 0 1px rgba(200,162,78,.35),0 0 34px rgba(200,162,78,.38),0 14px 30px rgba(10,14,20,.16)}
        .vrs-pill{display:inline-flex;align-items:center;background:#FFFFFF;border:1px solid #E6DFD1;border-radius:999px;color:#0A0E14;
          box-shadow:0 1px 2px rgba(10,14,20,.05),0 6px 16px rgba(10,14,20,.07);font-family:'DM Sans',sans-serif}
        .vrs-st{all:unset;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:9px;-webkit-tap-highlight-color:transparent}
        .vrs-st:focus-visible .vrs-sttile{outline:2px solid var(--tone);outline-offset:3px}
        .vrs-sttile{transition:transform .45s cubic-bezier(.2,.8,.2,1),box-shadow .45s ease,border-color .45s ease}
        .vrs-stpill{padding:6px 12px;font-weight:600;white-space:nowrap;transition:border-color .45s ease,box-shadow .45s ease}
        .vrs-st.on .vrs-sttile{transform:translateY(-3px) scale(1.09);border-color:var(--fill);
          box-shadow:inset 0 1px 0 rgba(255,255,255,.9),0 0 0 1px var(--fill),0 0 26px color-mix(in srgb,var(--fill) 55%,transparent),0 0 56px color-mix(in srgb,var(--fill) 28%,transparent),0 16px 30px rgba(10,14,20,.16)}
        .vrs-st.on .vrs-stpill{border-color:var(--fill);box-shadow:0 0 0 1px color-mix(in srgb,var(--fill) 40%,transparent),0 6px 16px rgba(10,14,20,.08)}
        .vrs-ws{position:absolute;top:-6px;right:-6px;width:18px;height:18px;border-radius:50%;background:#7A5C1E;display:flex;align-items:center;justify-content:center;
          box-shadow:0 0 0 2px #FFFEFB,0 2px 6px rgba(10,14,20,.2)}
        .vrs-card{display:flex;gap:15px;align-items:flex-start;padding:14px 16px;margin-bottom:10px;border-radius:14px;background:#FFFFFF;border:1px solid #E6DFD1;
          box-shadow:0 1px 2px rgba(10,14,20,.05),0 8px 20px rgba(10,14,20,.06)}
        .vrs-card.hi{border-color:var(--edge);box-shadow:0 0 0 1px var(--edge),0 10px 26px rgba(10,14,20,.08)}
        .vrs-tag{margin-left:auto;padding:4px 10px;border-radius:999px;border:1px solid;font-size:10.5px;letter-spacing:.12em;white-space:nowrap}
        @media (max-width:480px){.vrs-tag{font-size:9.5px;letter-spacing:.08em;padding:4px 8px}}
        .vrs-live{width:8px;height:8px;border-radius:50%;background:var(--fill);box-shadow:0 0 0 0 var(--fill);animation:vrsPing 1.8s ease-out infinite}
        .vrs-seg{all:unset;cursor:pointer;flex:1;height:5px;border-radius:3px;position:relative;overflow:hidden;transition:background .5s ease}
        .vrs-fill{position:absolute;inset:0;border-radius:3px;transform-origin:left center}
        .vrs-fill.run{animation:vrsFill linear forwards}
        @keyframes vrsFill{from{transform:scaleX(0)}to{transform:scaleX(1)}}
        .vrs-seg:focus-visible{outline:2px solid #7A5C1E;outline-offset:3px}
        .vrs-in{opacity:0;animation:vrsIn .55s cubic-bezier(.2,.8,.2,1) forwards}
        .vrs-pulse{animation:vrsPulse 3.6s ease-in-out infinite}
        @keyframes vrsIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
        @keyframes vrsPulse{0%,100%{opacity:.55;transform:translate(-50%,-50%) scale(.92)}50%{opacity:1;transform:translate(-50%,-50%) scale(1.08)}}
        @keyframes vrsPing{0%{box-shadow:0 0 0 0 color-mix(in srgb,var(--fill) 70%,transparent)}100%{box-shadow:0 0 0 9px transparent}}
        @media (hover:hover) and (pointer:fine){
          .vrs-st:not(.on):hover .vrs-sttile{transform:translateY(-2px)}
        }
        @media (prefers-reduced-motion: reduce){
          .vrs-in,.vrs-pulse,.vrs-live{animation:none;opacity:1}
          .vrs-sttile{transition:none}
        }
      `}</style>
    </div>
  );
}
