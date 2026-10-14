/* ═══════════════════════════════════════════════════════════════
   REINVEST OR HARVEST - CONCEPT VISUALS, cream theme
   One small diagram per dimension, drawn for the cream report pages:
   ink colours for lines and labels, the metallic gold and green fills for
   the bars.
   ═══════════════════════════════════════════════════════════════ */

const C = {
  gold: "#7A5C1E", goldLight: "#C8A24E",
  green: "#1B7A57", cyan: "#0E7490", red: "#B4403F", amber: "#9A6A00",
  text2: "#3E4652", text3: "#6B6459", text4: "#A39A8A", track: "#EEE8DC",
};
const scoreColor = (n) => !n ? C.text4 : n <= 2 ? C.red : n === 3 ? C.amber : n === 4 ? C.gold : n === 5 ? C.cyan : C.green;

/* ═══ CONCEPT VISUALS ═══
   Diagrammatic, not illustrative. Each shows the mechanic the dimension
   measures. Several read off the owner's own answer.
   ⚠️ Every gradient uses userSpaceOnUse - axis-aligned lines get no paint
   under objectBoundingBox and vanish silently. */

const V = { w: 600, h: 150 };
const vt = { fontFamily: "'DM Sans',sans-serif" };
const LBL = { fontSize: 10, letterSpacing: 1.4, fontWeight: 700, ...vt };
const CAP = { fontSize: 10, ...vt };

/* 01 · Business ROI Opportunities - money in, and whether you can see it come back */
const VisualROI = ({ score }) => {
  const known = score >= 4;
  const c = known ? C.gold : C.text4;
  return (
    <svg viewBox="0 0 600 150" width="100%" style={{ display: "block" }}>
      <defs>
        <linearGradient id="vrIn" gradientUnits="userSpaceOnUse" x1="0" y1="55" x2="0" y2="105">
          <stop offset="0%" stopColor="#DFC177"/><stop offset="100%" stopColor="#8A6C2A"/>
        </linearGradient>
        <linearGradient id="vrOut" gradientUnits="userSpaceOnUse" x1="0" y1="40" x2="0" y2="105">
          <stop offset="0%" stopColor="#7CE7BF"/><stop offset="100%" stopColor="#1B8A63"/>
        </linearGradient>
      </defs>
      <text x="46" y="42" style={{ ...LBL }} fill={C.gold}>WHAT YOU PUT IN</text>
      <rect x="46" y="55" width="130" height="50" rx="5" fill="url(#vrIn)"/>
      <path d="M196 80 L268 80" stroke={c} strokeWidth="2" strokeLinecap="round" strokeDasharray={known ? "0" : "5 5"}/>
      <polyline points="256,71 268,80 256,89" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <text x="232" y="66" textAnchor="middle" style={{ ...CAP }} fill={C.text3}>{known ? "measured" : "unmeasured"}</text>
      {known ? (
        <>
          <text x="288" y="34" style={{ ...LBL }} fill={C.green}>WHAT CAME BACK</text>
          <rect x="288" y="45" width="266" height="60" rx="5" fill="url(#vrOut)"/>
          <text x="300" y="122" style={{ ...CAP, fontSize: 10.5 }} fill={C.text2}>you can point to the return</text>
        </>
      ) : (
        <>
          <text x="288" y="34" style={{ ...LBL }} fill={C.text3}>WHAT CAME BACK</text>
          <rect x="288" y="45" width="266" height="60" rx="5" fill="none" stroke={C.text4} strokeWidth="1.6" strokeDasharray="6 6"/>
          <text x="421" y="85" textAnchor="middle" fontFamily="'Playfair Display',serif" fontSize="30" fontWeight="700" fill={C.text4}>?</text>
          <text x="300" y="122" style={{ ...CAP, fontSize: 10.5 }} fill={C.text3}>no way to tell a good outcome from a lucky one</text>
        </>
      )}
    </svg>
  );
};

/* 02 · Margin Position - where you sit against the field */
const VisualMargin = ({ score }) => {
  const x = 60 + ((score - 1) / 5) * 480;
  const c = scoreColor(score);
  return (
    <svg viewBox="0 0 600 150" width="100%" style={{ display: "block" }}>
      <defs>
        <linearGradient id="vmTrack" gradientUnits="userSpaceOnUse" x1="60" y1="0" x2="540" y2="0">
          <stop offset="0%" stopColor={C.red} stopOpacity=".55"/>
          <stop offset="50%" stopColor={C.amber} stopOpacity=".55"/>
          <stop offset="100%" stopColor={C.green} stopOpacity=".55"/>
        </linearGradient>
      </defs>
      <rect x="60" y="76" width="480" height="9" rx="4.5" fill="url(#vmTrack)"/>
      <line x1="300" y1="62" x2="300" y2="99" stroke={C.text2} strokeWidth="1.4" strokeDasharray="4 4"/>
      <text x="300" y="55" textAnchor="middle" style={{ ...LBL, fontSize: 8.5 }} fill={C.text2}>INDUSTRY MEDIAN</text>
      <circle cx={x} cy="80.5" r="12" fill={c} opacity=".2"/>
      <circle cx={x} cy="80.5" r="6.5" fill={c}/>
      <text x={x} y="118" textAnchor="middle" style={{ ...LBL, fontSize: 9.5 }} fill={c}>YOU</text>
      <text x="60" y="140" style={{ ...CAP }} fill={C.text3}>below the field</text>
      <text x="540" y="140" textAnchor="end" style={{ ...CAP }} fill={C.text3}>top quartile</text>
      <text x="300" y="140" textAnchor="middle" style={{ ...CAP, fontSize: 9.5 }} fill={C.text3}>
        every point of margin is profit that needs no extra revenue
      </text>
    </svg>
  );
};

/* 04 · Growing Without Breaking - headroom before something gives */
const VisualHeadroom = ({ score }) => {
  const cap = 90 + (score - 1) * 78;        // capacity grows with the score
  const demand = 430;                        // demand is fixed: a 2x surge
  const over = demand > cap;
  return (
    <svg viewBox="0 0 600 150" width="100%" style={{ display: "block" }}>
      <defs>
        <linearGradient id="vhCap" gradientUnits="userSpaceOnUse" x1="0" y1="52" x2="0" y2="92">
          <stop offset="0%" stopColor="#DFC177"/><stop offset="100%" stopColor="#8A6C2A"/>
        </linearGradient>
      </defs>
      <text x="60" y="42" style={{ ...LBL }} fill={C.gold}>WHAT YOU CAN CARRY TODAY</text>
      <rect x="60" y="52" width={cap} height="40" rx="5" fill="url(#vhCap)"/>
      <rect x="60" y="104" width={demand} height="26" rx="4" fill="none" stroke={over ? C.red : C.green} strokeWidth="1.6" strokeDasharray="6 5"/>
      <text x="66" y="122" style={{ ...LBL, fontSize: 8.5 }} fill={over ? C.red : C.green}>DEMAND DOUBLES</text>
      {over && (
        <>
          <rect x={60 + cap} y="52" width={demand - cap} height="40" rx="5" fill={C.red} opacity=".18"/>
          <line x1={60 + cap} y1="44" x2={60 + cap} y2="138" stroke={C.red} strokeWidth="1.4" strokeDasharray="4 4"/>
          <text x={60 + cap > 360 ? 60 + cap - 10 : 60 + cap + 10} textAnchor={60 + cap > 360 ? "end" : "start"}
            y="32" style={{ ...LBL, fontSize: 9 }} fill={C.red}>THIS IS WHERE IT BREAKS</text>
        </>
      )}
      {!over && (() => {
        const mid = 60 + (demand + cap) / 2;                 // centre of the unused span
        const x = Math.max(70, Math.min(mid, 552));
        return (
          <g>
            {/* label sits above the bar on the dark ground - green on gold is unreadable */}
            <text x={x} textAnchor="middle" y="40" style={{ ...LBL, fontSize: 9 }} fill={C.green}>HEADROOM</text>
            <line x1={60 + demand} y1="46" x2={60 + cap} y2="46" stroke={C.green} strokeWidth="1.4" opacity=".7"/>
            <line x1={60 + demand} y1="43" x2={60 + demand} y2="49" stroke={C.green} strokeWidth="1.4" opacity=".7"/>
            <line x1={60 + cap} y1="43" x2={60 + cap} y2="49" stroke={C.green} strokeWidth="1.4" opacity=".7"/>
          </g>
        );
      })()}
    </svg>
  );
};

/* 05 · Proven Demand Runway - work waiting versus work you can take */
const VisualRunway = ({ score }) => {
  const waiting = Math.max(0, score - 1);
  return (
    <svg viewBox="0 0 600 150" width="100%" style={{ display: "block" }}>
      <text x="60" y="40" style={{ ...LBL }} fill={C.gold}>WORK YOU'RE ALREADY TAKING</text>
      {[0,1,2,3].map(i => <rect key={i} x={60 + i*54} y="52" width="46" height="40" rx="5" fill={C.gold} opacity={.85 - i*.08}/>)}
      <line x1="292" y1="42" x2="292" y2="118" stroke={C.text3} strokeWidth="1.3" strokeDasharray="4 4"/>
      <text x="302" y="40" style={{ ...LBL }} fill={waiting ? C.green : C.text3}>
        {waiting ? "WORK WAITING ON CAPACITY" : "NOTHING WAITING"}
      </text>
      {waiting > 0
        ? [...Array(waiting)].map((_, i) => (
            <rect key={i} x={302 + i*48} y="52" width="40" height="40" rx="5" fill="none" stroke={C.green} strokeWidth="1.7" strokeDasharray="5 4"/>
          ))
        : <text x="302" y="78" style={{ ...CAP, fontSize: 11 }} fill={C.text3}>money buys experiments, not revenue</text>}
      <text x="60" y="128" style={{ ...CAP, fontSize: 9.5 }} fill={C.text3}>
        {waiting >= 3
          ? "Demand is proven. Adding capacity converts almost mechanically."
          : waiting > 0
            ? "Some proven demand. Test with a small addition before a large one."
            : "Without proven demand you can't serve, growth spending is a bet, not a purchase."}
      </text>
    </svg>
  );
};

/* 06 · What You Take Out - five years of distributions, and what's left to show */
const VisualSplit = ({ score }) => {
  const keep = [0, .12, .3, .5, .72, .95][score - 1];   // share that becomes an asset
  const H = 52, TOP = 46, YRS = 5, colW = 62, gap = 22, x0 = 62;
  let running = 0;
  const c = keep >= .5 ? C.green : keep >= .25 ? C.amber : C.red;
  return (
    <svg viewBox="0 0 600 150" width="100%" style={{ display: "block" }}>
      <defs>
        <linearGradient id="vspKeep" gradientUnits="userSpaceOnUse" x1="0" y1={TOP} x2="0" y2={TOP + H}>
          <stop offset="0%" stopColor="#7CE7BF"/><stop offset="100%" stopColor="#1B8A63"/>
        </linearGradient>
      </defs>
      <text x={x0} y="34" style={{ ...LBL }} fill={C.gold}>FIVE YEARS OF PROFIT TAKEN OUT</text>
      {[...Array(YRS)].map((_, i) => {
        const x = x0 + i * (colW + gap);
        const kh = H * keep;
        running += keep;
        return (
          <g key={i}>
            {/* what came out */}
            <rect x={x} y={TOP} width={colW} height={H} rx="4" fill="none" stroke={C.gold} strokeWidth="1.3" strokeDasharray="4 4" opacity=".6"/>
            {/* what survived */}
            {kh > 1 && <rect x={x} y={TOP + H - kh} width={colW} height={kh} rx="4" fill="url(#vspKeep)"/>}
            {kh <= 1 && <text x={x + colW/2} y={TOP + H/2 + 5} textAnchor="middle" style={{ ...CAP, fontSize: 13 }} fill={C.text4}>·</text>}
            <text x={x + colW/2} y={TOP + H + 15} textAnchor="middle" style={{ ...CAP, fontSize: 9 }} fill={C.text3}>YR {i+1}</text>
          </g>
        );
      })}
      <text x="500" y="34" textAnchor="end" style={{ ...LBL }} fill={c}>STILL YOURS</text>
      <rect x="512" y={TOP} width="46" height={H} rx="4" fill="none" stroke={c} strokeWidth="1.4" opacity=".5"/>
      {running > .05 && <rect x="512" y={TOP + H - H * Math.min(running / YRS, 1)} width="46" height={H * Math.min(running / YRS, 1)} rx="4" fill={c} opacity=".8"/>}
      <text x="535" y={TOP + H + 15} textAnchor="middle" style={{ ...CAP, fontSize: 9, fontWeight: 700 }} fill={c}>{Math.round(keep * 100)}%</text>
      <text x={x0} y="142" style={{ ...CAP, fontSize: 10 }} fill={c}>
        {keep < .2 ? "Five years of profit left the business. Almost none of it became anything you still own."
         : keep < .6 ? "Some of it survived. Most of it went to living, and there's nothing left to point at."
         : "Most of what left the business is still yours. That's the whole difference."}
      </text>
    </svg>
  );
};

/* 07 · Liquid Reserve - months of cover against a six-month target */
const VisualReserve = ({ score }) => {
  const months = [0.5, 1, 2.5, 4, 5, 7][score - 1];
  const w = Math.min(months / 8, 1) * 480;
  const c = scoreColor(score);
  const targetX = 60 + (6 / 8) * 480;
  return (
    <svg viewBox="0 0 600 150" width="100%" style={{ display: "block" }}>
      <defs>
        <linearGradient id="vsFill" gradientUnits="userSpaceOnUse" x1="0" y1="58" x2="0" y2="94">
          <stop offset="0%" stopColor={c} stopOpacity=".95"/><stop offset="100%" stopColor={c} stopOpacity=".45"/>
        </linearGradient>
      </defs>
      <rect x="60" y="58" width="480" height="36" rx="5" fill={C.track}/>
      <rect x="60" y="58" width={w} height="36" rx="5" fill="url(#vsFill)"/>
      {[0,2,4,6,8].map(m => (
        <g key={m}>
          <line x1={60 + (m/8)*480} y1="94" x2={60 + (m/8)*480} y2="102" stroke={C.text4} strokeWidth="1"/>
          <text x={60 + (m/8)*480} y="116" textAnchor="middle" style={{ ...CAP }} fill={C.text3}>{m}m</text>
        </g>
      ))}
      <line x1={targetX} y1="44" x2={targetX} y2="100" stroke={C.green} strokeWidth="1.6" strokeDasharray="4 4"/>
      <text x={targetX} y="38" textAnchor="middle" style={{ ...LBL, fontSize: 8.5 }} fill={C.green}>SIX-MONTH TARGET</text>
      <text x="60" y="140" style={{ ...CAP, fontSize: 9.5 }} fill={C.text3}>
        Reserve is what buys you the ability to say no - and the option to be patient.
      </text>
    </svg>
  );
};

/* 09 · Proactive Tax Coordination - options shrink to nothing as the year closes */
const VisualTaxYear = ({ score }) => {
  /* where the owner actually engages, in month index */
  const TOUCH = [[15.5], [15.5], [11.5], [9], [8.5, 11.5], [2, 5, 8, 11]][score - 1];
  const x = (m) => 62 + (m / 12) * 400;
  const wedgeTop = (m) => 96 - Math.max(0, (1 - m / 12)) * 46;
  const live = TOUCH.filter(m => m < 12).length;
  const c = live >= 3 ? C.green : live >= 1 ? C.amber : C.red;
  return (
    <svg viewBox="0 0 600 150" width="100%" style={{ display: "block" }}>
      <defs>
        <linearGradient id="vtyW" gradientUnits="userSpaceOnUse" x1="62" y1="0" x2="462" y2="0">
          <stop offset="0%" stopColor={C.green} stopOpacity=".34"/>
          <stop offset="100%" stopColor={C.green} stopOpacity=".05"/>
        </linearGradient>
      </defs>
      <text x="62" y="34" style={{ ...LBL, fontSize: 8.5 }} fill={C.green}>DECISIONS YOU CAN STILL CHANGE</text>
      <path d={`M62 50 L462 96 L62 96 Z`} fill="url(#vtyW)"/>
      <line x1="62" y1="96" x2="558" y2="96" stroke={C.text4} strokeWidth="1"/>
      {["J","F","M","A","M","J","J","A","S","O","N","D"].map((m,i) => (
        <text key={i} x={x(i + .5)} y="110" textAnchor="middle" style={{ ...CAP, fontSize: 8.5 }} fill={C.text4}>{m}</text>
      ))}
      <line x1="462" y1="44" x2="462" y2="104" stroke={C.text3} strokeWidth="1.2" strokeDasharray="3 4"/>
      <text x="468" y="112" style={{ ...CAP, fontSize: 8.5 }} fill={C.text3}>year closes</text>
      {TOUCH.map((m,i) => {
        const past = m >= 12;
        return (
          <g key={i}>
            <line x1={x(m)} y1={past ? 96 : wedgeTop(m)} x2={x(m)} y2="96" stroke={past ? C.red : C.green} strokeWidth="1.6"/>
            <circle cx={x(m)} cy={past ? 96 : wedgeTop(m)} r="5.5" fill={past ? C.red : C.green}/>
          </g>
        );
      })}
      {TOUCH.some(m => m >= 12) && (
        <text x={x(15.5)} y="42" textAnchor="middle" style={{ ...LBL, fontSize: 8.5 }} fill={C.red}>APRIL</text>
      )}
      <text x="62" y="140" style={{ ...CAP, fontSize: 10 }} fill={c}>
        {live === 0 ? "By the time you talk, the year is closed. There is nothing left to decide - only a bill to pay."
         : live === 1 ? "One conversation, late. Most of the levers had already closed by the time you had it."
         : live === 2 ? "You're in the window, but only at the end of it. The earlier options were never on the table."
         : "Four touchpoints across the year. Every lever is live when you're actually deciding."}
      </text>
    </svg>
  );
};

/* 10 · Your Long-Term Destination - drift, or a distance you can close */
const VisualGap = ({ score }) => {
  const tier = score <= 2 ? "drift" : score <= 4 ? "vague" : "clear";
  const ends = [[38,-30],[52,-14],[60,4],[48,22],[34,36]];   // fan angles for drift
  return (
    <svg viewBox="0 0 600 150" width="100%" style={{ display: "block" }}>
      <circle cx="92" cy="80" r="9" fill={C.gold}/>
      <circle cx="92" cy="80" r="16" fill="none" stroke={C.gold} strokeWidth="1" opacity=".35"/>
      <text x="92" y="50" textAnchor="middle" style={{ ...LBL, fontSize: 9 }} fill={C.gold}>TODAY</text>

      {tier === "drift" && <>
        {ends.map(([len,dy],i) => (
          <path key={i} d={`M108 80 L${108 + len*5.4} ${80 + dy*1.5}`} stroke={C.text4} strokeWidth="1.7"
            strokeDasharray="6 7" strokeLinecap="round" opacity={.8 - i*.07}/>
        ))}
        <text x="452" y="86" style={{ fontFamily:"'Playfair Display',serif", fontSize:34, fontWeight:700 }} fill={C.text4}>?</text>
        <text x="92" y="140" style={{ ...CAP, fontSize: 10 }} fill={C.red}>
          Every year of reinvesting moves you somewhere. Without a destination there's no way to tell if it's forward.
        </text>
      </>}

      {tier === "vague" && <>
        <path d="M108 80 L392 80" stroke={C.amber} strokeWidth="2" strokeDasharray="7 6" strokeLinecap="round" opacity=".85"/>
        <ellipse cx="452" cy="80" rx="46" ry="27" fill={C.amber} opacity=".1"/>
        <ellipse cx="452" cy="80" rx="46" ry="27" fill="none" stroke={C.amber} strokeWidth="1.5" strokeDasharray="5 6"/>
        <text x="452" y="46" textAnchor="middle" style={{ ...LBL, fontSize: 8.5 }} fill={C.amber}>ROUGHLY THAT WAY</text>
        <text x="92" y="140" style={{ ...CAP, fontSize: 10 }} fill={C.amber}>
          You know the direction. Without a number you can't tell whether this year got you closer or just busier.
        </text>
      </>}

      {tier === "clear" && <>
        <line x1="108" y1="80" x2="484" y2="80" stroke={C.cyan} strokeWidth="2.4" strokeLinecap="round"/>
        {[1,2,3].map(i => <line key={i} x1={108 + i*94} y1="72" x2={108 + i*94} y2="88" stroke={C.cyan} strokeWidth="1.2" opacity=".45"/>)}
        <circle cx="500" cy="80" r="11" fill="none" stroke={C.cyan} strokeWidth="2.6"/>
        <circle cx="500" cy="80" r="4" fill={C.cyan}/>
        <text x="500" y="50" textAnchor="middle" style={{ ...LBL, fontSize: 9 }} fill={C.cyan}>THE DESTINATION</text>
        <text x="300" y="106" textAnchor="middle" style={{ ...CAP, fontSize: 9.5 }} fill={C.cyan}>a distance you can measure</text>
        <text x="92" y="140" style={{ ...CAP, fontSize: 10 }} fill={C.green}>
          Every decision now has something to answer to. That is what makes reinvesting a strategy instead of a habit.
        </text>
      </>}
    </svg>
  );
};


/* ── 03 · The Binding Constraint (from the document sample) ── */
const VisualConstraint = () => (
  <svg viewBox="0 0 600 150" width="100%" style={{ display: "block" }}>
    <defs>
      <linearGradient id="vcFlow" gradientUnits="userSpaceOnUse" x1="40" y1="0" x2="560" y2="0">
        <stop offset="0%" stopColor={C.gold} stopOpacity=".85"/>
        <stop offset="46%" stopColor={C.gold} stopOpacity=".85"/>
        <stop offset="52%" stopColor={C.red}/>
        <stop offset="60%" stopColor={C.gold} stopOpacity=".3"/>
        <stop offset="100%" stopColor={C.gold} stopOpacity=".3"/>
      </linearGradient>
    </defs>
    {[0,1,2,3,4,5,6].map(i => {
      const y = 30 + i*15, amp = (y-75)/45;
      return <path key={i} d={`M40 ${y} C200 ${y} 260 ${75+amp*7} 300 ${75+amp*7} C340 ${75+amp*7} 400 ${y} 560 ${y}`}
        fill="none" stroke="url(#vcFlow)" strokeWidth="2.2" strokeLinecap="round"/>;
    })}
    <line x1="300" y1="14" x2="300" y2="136" stroke={C.red} strokeWidth="1.5" strokeDasharray="4 5" opacity=".75"/>
    <text x="300" y="10" textAnchor="middle" fill={C.red} fontSize="9.5" fontWeight="700" letterSpacing="1.6" fontFamily="'DM Sans',sans-serif">THE CONSTRAINT</text>
    <text x="44" y="148" fill={C.text3} fontSize="9" fontFamily="'DM Sans',sans-serif">everything upstream</text>
    <text x="556" y="148" textAnchor="end" fill={C.text3} fontSize="9" fontFamily="'DM Sans',sans-serif">…is capped by one point</text>
  </svg>
);

/* ── 08 · Assets Outside The Business (from the document sample) ── */
const VisualConcentration = ({ score }) => {
  const pct = [4, 12, 20, 26, 34, 55][score - 1];
  const inside = 100 - pct;
  return (
    <svg viewBox="0 0 600 150" width="100%" style={{ display: "block" }}>
      <defs>
        <linearGradient id="vkIn" gradientUnits="userSpaceOnUse" x1="40" y1="52" x2="40" y2="98">
          <stop offset="0%" stopColor={C.goldLight}/><stop offset="100%" stopColor="#8A6C2A"/>
        </linearGradient>
        <linearGradient id="vkOut" gradientUnits="userSpaceOnUse" x1="40" y1="52" x2="40" y2="98">
          <stop offset="0%" stopColor="#7CE7BF"/><stop offset="100%" stopColor="#1B8A63"/>
        </linearGradient>
      </defs>
      <rect x="40" y="52" width={520*inside/100} height="46" rx="5" fill="url(#vkIn)"/>
      <rect x={40+520*inside/100+5} y="52" width={Math.max(520*pct/100-5, 4)} height="46" rx="5" fill="url(#vkOut)"/>
      <text x="46" y="42" fill={C.gold} fontSize="9.5" fontWeight="700" letterSpacing="1.5" fontFamily="'DM Sans',sans-serif">INSIDE THE BUSINESS</text>
      <text x="556" y="42" textAnchor="end" fill={C.green} fontSize="9.5" fontWeight="700" letterSpacing="1.5" fontFamily="'DM Sans',sans-serif">OUTSIDE</text>
      <text x="46" y="120" fill={C.text2} fontSize="10.5" fontFamily="'DM Sans',sans-serif">{inside}% of what you own</text>
      <text x="556" y="120" textAnchor="end" fill={C.text2} fontSize="10.5" fontFamily="'DM Sans',sans-serif">{pct}%</text>
      <line x1="40" y1="132" x2="560" y2="132" stroke={C.text4} strokeWidth=".8" opacity=".5"/>
      <text x="300" y="146" textAnchor="middle" fill={C.text3} fontSize="9" fontFamily="'DM Sans',sans-serif">one bad stretch reaches everything on the left</text>
    </svg>
  );
};

/* visual lookup, keyed to dimension */
export const VISUALS = { b1: VisualROI, b2: VisualMargin, b3: VisualConstraint, b4: VisualHeadroom, b5: VisualRunway,
                         p1: VisualSplit, p2: VisualReserve, p3: VisualConcentration, p4: VisualTaxYear, p5: VisualGap };
