import { useState } from "react";

/* ═══════════════════════════════════════════════════════════════
   REINVEST OR HARVEST — THANK-YOU PAGE
   Route: /reinvest-harvest/next
   Reached immediately after the teaser. Report is emailed in parallel.
   ═══════════════════════════════════════════════════════════════ */

/* Set false before deploy — strips the variant toolbar. */
const PREVIEW = true;

/* TODO: replace with the real iClosed event URLs. Direct iframe only —
   widget.js does not work in React SPAs. */
const ICLOSED_QUALIFIED = "https://app.iclosed.io/e/kriczkyvirtus/free-reinvest-or-harvest-working-session";
const SKOOL_COLLECTIVE = "https://www.skool.com/virtus-collective";

const C = {
  bgDeep: "#0A0E14", bgCard: "#111720",
  gold: "#C8A24E", goldLight: "#D4B665",
  green: "#34D399", cyan: "#22D3EE", red: "#F87171",
  text1: "#E8ECF1", text2: "#8B95A5", text3: "#5A6474", text4: "#3D4654",
};

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const QUADRANTS = {
  reinvest: {
    label: "Reinvest-Weighted", color: C.green,
    line: "You've earned the right to be aggressive if you want to. Real opportunities inside, and enough outside that a bad year is a setback, not a reset. Few owners have both.",
  },
  split: {
    label: "Split — Pay Yourself First", color: C.gold,
    line: "The business keeps looking like the best place for every dollar, and it usually is. That's exactly why owners in this spot end up with everything they own in one place.",
  },
  harvest: {
    label: "Harvest-Weighted", color: C.cyan,
    line: "You've built the outside, which most owners never do. Your highest-return reinvestment right now isn't growth — it's fixing the one thing capping what growth produces.",
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
    cta: "BOOK YOUR FIT CALL",
    url: ICLOSED_QUALIFIED,
    bridge: "The video shows you what to do. This is where you find out whether you're a fit to have me work on it with you — intentionally pursuing reinvestment opportunities inside your business, and building financial freedom outside of it.",
    calHead: "Ready to stop guessing where the next dollar of profit goes?",
    calSub: "Book a free working session — we read your scorecard against your real numbers and map your next 90 days.",
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
    body: "The Virtus Collective is where owners at your stage work through exactly these decisions — with the playbooks, and with other owners running them at the same time. It is free, and you can be inside it in about a minute.",
    cta: "JOIN THE VIRTUS COLLECTIVE",
    url: SKOOL_COLLECTIVE,
    bridge: "The video shows you what to do. The Collective is where owners actually do it — intentionally pursuing reinvestment opportunities inside their business, and building financial freedom outside of it.",
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

const ICON_C1 = `<svg width="512" height="512" viewBox="-210 -210 420 420" xmlns="http://www.w3.org/2000/svg" style="overflow:visible">
<defs>
  <linearGradient id="metalxcompass" gradientUnits="userSpaceOnUse" x1="0" y1="-150" x2="0" y2="150"><stop offset="0%" stop-color="#F8ECC4"/><stop offset="14%" stop-color="#DFC177"/><stop offset="28%" stop-color="#C8A24E"/><stop offset="42%" stop-color="#5A4419"/><stop offset="50%" stop-color="#F8ECC4"/><stop offset="64%" stop-color="#C8A24E"/><stop offset="80%" stop-color="#8A6C2A"/><stop offset="100%" stop-color="#5A4419"/></linearGradient>
  <filter id="softxcompass" x="-60%" y="-60%" width="220%" height="220%">
    <feGaussianBlur stdDeviation="2.50"/>
  </filter>
  <filter id="liftxcompass" x="-70%" y="-70%" width="240%" height="240%">
    <feDropShadow dx="0" dy="6.0" stdDeviation="9.0" flood-color="#000" flood-opacity="0.55"/>
    <feDropShadow dx="0" dy="0" stdDeviation="16.0" flood-color="#C8A24E" flood-opacity="0.38"/>
  </filter>
  <radialGradient id="ambxcompass">
    <stop offset="0%" stop-color="#C8A24E" stop-opacity="0.16"/>
    <stop offset="100%" stop-color="#C8A24E" stop-opacity="0"/>
  </radialGradient>
</defs>
<circle cx="0" cy="0" r="215" fill="url(#ambxcompass)"/>
<g fill="none" stroke="#000" stroke-opacity="0.55" stroke-width="28.00"
   stroke-linecap="round" stroke-linejoin="round"
   transform="translate(0,7.0)" filter="url(#softxcompass)"><circle cx="0" cy="0" r="118"/><path d="M0 -150 L34 -34 L150 0 L34 34 L0 150 L-34 34 L-150 0 L-34 -34 Z"/></g>
<g fill="none" stroke="url(#metalxcompass)" stroke-width="22.00"
   stroke-linecap="round" stroke-linejoin="round" filter="url(#liftxcompass)"><circle cx="0" cy="0" r="118"/><path d="M0 -150 L34 -34 L150 0 L34 34 L0 150 L-34 34 L-150 0 L-34 -34 Z"/></g>
<g fill="none" stroke="#FFFDF5" stroke-opacity="0.55" stroke-width="5.00"
   stroke-linecap="round" stroke-linejoin="round"
   transform="translate(0,-5.0)"><circle cx="0" cy="0" r="118"/><path d="M0 -150 L34 -34 L150 0 L34 34 L0 150 L-34 34 L-150 0 L-34 -34 Z"/></g>
</svg>`;
const ICON_C2 = `<svg width="512" height="512" viewBox="-210 -210 420 420" xmlns="http://www.w3.org/2000/svg" style="overflow:visible">
<defs>
  <linearGradient id="metalxbars" gradientUnits="userSpaceOnUse" x1="0" y1="-130" x2="0" y2="130"><stop offset="0%" stop-color="#F8ECC4"/><stop offset="14%" stop-color="#DFC177"/><stop offset="28%" stop-color="#C8A24E"/><stop offset="42%" stop-color="#5A4419"/><stop offset="50%" stop-color="#F8ECC4"/><stop offset="64%" stop-color="#C8A24E"/><stop offset="80%" stop-color="#8A6C2A"/><stop offset="100%" stop-color="#5A4419"/></linearGradient>
  <filter id="softxbars" x="-60%" y="-60%" width="220%" height="220%">
    <feGaussianBlur stdDeviation="2.50"/>
  </filter>
  <filter id="liftxbars" x="-70%" y="-70%" width="240%" height="240%">
    <feDropShadow dx="0" dy="6.0" stdDeviation="9.0" flood-color="#000" flood-opacity="0.55"/>
    <feDropShadow dx="0" dy="0" stdDeviation="16.0" flood-color="#C8A24E" flood-opacity="0.38"/>
  </filter>
  <radialGradient id="ambxbars">
    <stop offset="0%" stop-color="#C8A24E" stop-opacity="0.16"/>
    <stop offset="100%" stop-color="#C8A24E" stop-opacity="0"/>
  </radialGradient>
</defs>
<circle cx="0" cy="0" r="215" fill="url(#ambxbars)"/>
<g fill="none" stroke="#000" stroke-opacity="0.55" stroke-width="28.00"
   stroke-linecap="round" stroke-linejoin="round"
   transform="translate(0,7.0)" filter="url(#softxbars)"><path d="M-150 -130 L-150 130 L150 130"/><path d="M-72 60 L-72 -10"/><path d="M4 60 L4 -60"/><path d="M80 60 L80 -112"/></g>
<g fill="none" stroke="url(#metalxbars)" stroke-width="22.00"
   stroke-linecap="round" stroke-linejoin="round" filter="url(#liftxbars)"><path d="M-150 -130 L-150 130 L150 130"/><path d="M-72 60 L-72 -10"/><path d="M4 60 L4 -60"/><path d="M80 60 L80 -112"/></g>
<g fill="none" stroke="#FFFDF5" stroke-opacity="0.55" stroke-width="5.00"
   stroke-linecap="round" stroke-linejoin="round"
   transform="translate(0,-5.0)"><path d="M-150 -130 L-150 130 L150 130"/><path d="M-72 60 L-72 -10"/><path d="M4 60 L4 -60"/><path d="M80 60 L80 -112"/></g>
</svg>`;
const ICON_C3 = `<svg width="512" height="512" viewBox="-210 -210 420 420" xmlns="http://www.w3.org/2000/svg" style="overflow:visible">
<defs>
  <linearGradient id="metalxfunnel" gradientUnits="userSpaceOnUse" x1="0" y1="-140" x2="0" y2="150"><stop offset="0%" stop-color="#F8ECC4"/><stop offset="14%" stop-color="#DFC177"/><stop offset="28%" stop-color="#C8A24E"/><stop offset="42%" stop-color="#5A4419"/><stop offset="50%" stop-color="#F8ECC4"/><stop offset="64%" stop-color="#C8A24E"/><stop offset="80%" stop-color="#8A6C2A"/><stop offset="100%" stop-color="#5A4419"/></linearGradient>
  <filter id="softxfunnel" x="-60%" y="-60%" width="220%" height="220%">
    <feGaussianBlur stdDeviation="2.50"/>
  </filter>
  <filter id="liftxfunnel" x="-70%" y="-70%" width="240%" height="240%">
    <feDropShadow dx="0" dy="6.0" stdDeviation="9.0" flood-color="#000" flood-opacity="0.55"/>
    <feDropShadow dx="0" dy="0" stdDeviation="16.0" flood-color="#C8A24E" flood-opacity="0.38"/>
  </filter>
  <radialGradient id="ambxfunnel">
    <stop offset="0%" stop-color="#C8A24E" stop-opacity="0.16"/>
    <stop offset="100%" stop-color="#C8A24E" stop-opacity="0"/>
  </radialGradient>
</defs>
<circle cx="0" cy="0" r="215" fill="url(#ambxfunnel)"/>
<g fill="none" stroke="#000" stroke-opacity="0.55" stroke-width="28.00"
   stroke-linecap="round" stroke-linejoin="round"
   transform="translate(0,7.0)" filter="url(#softxfunnel)"><path d="M-160 -140 L160 -140 L34 -6 L34 96 L-34 150 L-34 -6 Z"/></g>
<g fill="none" stroke="url(#metalxfunnel)" stroke-width="22.00"
   stroke-linecap="round" stroke-linejoin="round" filter="url(#liftxfunnel)"><path d="M-160 -140 L160 -140 L34 -6 L34 96 L-34 150 L-34 -6 Z"/></g>
<g fill="none" stroke="#FFFDF5" stroke-opacity="0.55" stroke-width="5.00"
   stroke-linecap="round" stroke-linejoin="round"
   transform="translate(0,-5.0)"><path d="M-160 -140 L160 -140 L34 -6 L34 96 L-34 150 L-34 -6 Z"/></g>
</svg>`;
const ICON_C4 = `<svg width="512" height="512" viewBox="-210 -210 420 420" xmlns="http://www.w3.org/2000/svg" style="overflow:visible">
<defs>
  <linearGradient id="metalxdiverge" gradientUnits="userSpaceOnUse" x1="0" y1="-140" x2="0" y2="150"><stop offset="0%" stop-color="#D8FCEE"/><stop offset="14%" stop-color="#7CE7BF"/><stop offset="28%" stop-color="#34D399"/><stop offset="42%" stop-color="#0F5C42"/><stop offset="50%" stop-color="#EAFFF7"/><stop offset="64%" stop-color="#34D399"/><stop offset="80%" stop-color="#1B8A63"/><stop offset="100%" stop-color="#0F5C42"/></linearGradient>
  <filter id="softxdiverge" x="-60%" y="-60%" width="220%" height="220%">
    <feGaussianBlur stdDeviation="2.50"/>
  </filter>
  <filter id="liftxdiverge" x="-70%" y="-70%" width="240%" height="240%">
    <feDropShadow dx="0" dy="6.0" stdDeviation="9.0" flood-color="#000" flood-opacity="0.55"/>
    <feDropShadow dx="0" dy="0" stdDeviation="16.0" flood-color="#34D399" flood-opacity="0.38"/>
  </filter>
  <radialGradient id="ambxdiverge">
    <stop offset="0%" stop-color="#34D399" stop-opacity="0.16"/>
    <stop offset="100%" stop-color="#34D399" stop-opacity="0"/>
  </radialGradient>
</defs>
<circle cx="0" cy="0" r="215" fill="url(#ambxdiverge)"/>
<g fill="none" stroke="#000" stroke-opacity="0.55" stroke-width="28.00"
   stroke-linecap="round" stroke-linejoin="round"
   transform="translate(0,7.0)" filter="url(#softxdiverge)"><path d="M0 150 L0 20"/><path d="M0 20 L-120 -100"/><path d="M0 20 L120 -100"/><path d="M-120 -100 L-120 -20 M-120 -100 L-40 -100"/><path d="M120 -100 L120 -20 M120 -100 L40 -100"/></g>
<g fill="none" stroke="url(#metalxdiverge)" stroke-width="22.00"
   stroke-linecap="round" stroke-linejoin="round" filter="url(#liftxdiverge)"><path d="M0 150 L0 20"/><path d="M0 20 L-120 -100"/><path d="M0 20 L120 -100"/><path d="M-120 -100 L-120 -20 M-120 -100 L-40 -100"/><path d="M120 -100 L120 -20 M120 -100 L40 -100"/></g>
<g fill="none" stroke="#FFFDF5" stroke-opacity="0.55" stroke-width="5.00"
   stroke-linecap="round" stroke-linejoin="round"
   transform="translate(0,-5.0)"><path d="M0 150 L0 20"/><path d="M0 20 L-120 -100"/><path d="M0 20 L120 -100"/><path d="M-120 -100 L-120 -20 M-120 -100 L-40 -100"/><path d="M120 -100 L120 -20 M120 -100 L40 -100"/></g>
</svg>`;
const ICON_C5 = `<svg width="512" height="512" viewBox="-210 -210 420 420" xmlns="http://www.w3.org/2000/svg" style="overflow:visible">
<defs>
  <linearGradient id="metalxoutward" gradientUnits="userSpaceOnUse" x1="0" y1="-150" x2="0" y2="150"><stop offset="0%" stop-color="#D8FCEE"/><stop offset="14%" stop-color="#7CE7BF"/><stop offset="28%" stop-color="#34D399"/><stop offset="42%" stop-color="#0F5C42"/><stop offset="50%" stop-color="#EAFFF7"/><stop offset="64%" stop-color="#34D399"/><stop offset="80%" stop-color="#1B8A63"/><stop offset="100%" stop-color="#0F5C42"/></linearGradient>
  <filter id="softxoutward" x="-60%" y="-60%" width="220%" height="220%">
    <feGaussianBlur stdDeviation="2.50"/>
  </filter>
  <filter id="liftxoutward" x="-70%" y="-70%" width="240%" height="240%">
    <feDropShadow dx="0" dy="6.0" stdDeviation="9.0" flood-color="#000" flood-opacity="0.55"/>
    <feDropShadow dx="0" dy="0" stdDeviation="16.0" flood-color="#34D399" flood-opacity="0.38"/>
  </filter>
  <radialGradient id="ambxoutward">
    <stop offset="0%" stop-color="#34D399" stop-opacity="0.16"/>
    <stop offset="100%" stop-color="#34D399" stop-opacity="0"/>
  </radialGradient>
</defs>
<circle cx="0" cy="0" r="215" fill="url(#ambxoutward)"/>
<g fill="none" stroke="#000" stroke-opacity="0.55" stroke-width="28.00"
   stroke-linecap="round" stroke-linejoin="round"
   transform="translate(0,7.0)" filter="url(#softxoutward)"><circle cx="0" cy="0" r="46"/><path d="M-150 0 A150 150 0 0 1 -34 -146"/><path d="M-96 132 A150 150 0 0 1 -128 96"/><path d="M96 132 A150 150 0 0 0 150 34"/><path d="M40 -40 L142 -142"/><path d="M142 -142 L64 -142 M142 -142 L142 -64"/></g>
<g fill="none" stroke="url(#metalxoutward)" stroke-width="22.00"
   stroke-linecap="round" stroke-linejoin="round" filter="url(#liftxoutward)"><circle cx="0" cy="0" r="46"/><path d="M-150 0 A150 150 0 0 1 -34 -146"/><path d="M-96 132 A150 150 0 0 1 -128 96"/><path d="M96 132 A150 150 0 0 0 150 34"/><path d="M40 -40 L142 -142"/><path d="M142 -142 L64 -142 M142 -142 L142 -64"/></g>
<g fill="none" stroke="#FFFDF5" stroke-opacity="0.55" stroke-width="5.00"
   stroke-linecap="round" stroke-linejoin="round"
   transform="translate(0,-5.0)"><circle cx="0" cy="0" r="46"/><path d="M-150 0 A150 150 0 0 1 -34 -146"/><path d="M-96 132 A150 150 0 0 1 -128 96"/><path d="M96 132 A150 150 0 0 0 150 34"/><path d="M40 -40 L142 -142"/><path d="M142 -142 L64 -142 M142 -142 L142 -64"/></g>
</svg>`;
const ICON_C6 = `<svg width="512" height="512" viewBox="-210 -210 420 420" xmlns="http://www.w3.org/2000/svg" style="overflow:visible">
<defs>
  <linearGradient id="metalxhorizon" gradientUnits="userSpaceOnUse" x1="0" y1="-170" x2="0" y2="155"><stop offset="0%" stop-color="#D6F8FE"/><stop offset="14%" stop-color="#7EE9F7"/><stop offset="28%" stop-color="#22D3EE"/><stop offset="42%" stop-color="#0B5A68"/><stop offset="50%" stop-color="#EAFEFF"/><stop offset="64%" stop-color="#22D3EE"/><stop offset="80%" stop-color="#128FA6"/><stop offset="100%" stop-color="#0B5A68"/></linearGradient>
  <filter id="softxhorizon" x="-60%" y="-60%" width="220%" height="220%">
    <feGaussianBlur stdDeviation="2.50"/>
  </filter>
  <filter id="liftxhorizon" x="-70%" y="-70%" width="240%" height="240%">
    <feDropShadow dx="0" dy="6.0" stdDeviation="9.0" flood-color="#000" flood-opacity="0.55"/>
    <feDropShadow dx="0" dy="0" stdDeviation="16.0" flood-color="#22D3EE" flood-opacity="0.38"/>
  </filter>
  <radialGradient id="ambxhorizon">
    <stop offset="0%" stop-color="#22D3EE" stop-opacity="0.16"/>
    <stop offset="100%" stop-color="#22D3EE" stop-opacity="0"/>
  </radialGradient>
</defs>
<circle cx="0" cy="0" r="215" fill="url(#ambxhorizon)"/>
<g fill="none" stroke="#000" stroke-opacity="0.55" stroke-width="28.00"
   stroke-linecap="round" stroke-linejoin="round"
   transform="translate(0,7.0)" filter="url(#softxhorizon)"><path d="M0 155 C0 155 116 26 116 -54 A116 116 0 1 0 -116 -54 C-116 26 0 155 0 155 Z"/><circle cx="0" cy="-54" r="44"/></g>
<g fill="none" stroke="url(#metalxhorizon)" stroke-width="22.00"
   stroke-linecap="round" stroke-linejoin="round" filter="url(#liftxhorizon)"><path d="M0 155 C0 155 116 26 116 -54 A116 116 0 1 0 -116 -54 C-116 26 0 155 0 155 Z"/><circle cx="0" cy="-54" r="44"/></g>
<g fill="none" stroke="#FFFDF5" stroke-opacity="0.55" stroke-width="5.00"
   stroke-linecap="round" stroke-linejoin="round"
   transform="translate(0,-5.0)"><path d="M0 155 C0 155 116 26 116 -54 A116 116 0 1 0 -116 -54 C-116 26 0 155 0 155 Z"/><circle cx="0" cy="-54" r="44"/></g>
</svg>`;

/* Course 06 spans both pillars, so it takes the gold→green blend rather than
   cyan — cyan is Customer Capital elsewhere in the system. */
const ROADMAP = [
  { n: "01", icon: ICON_C1, title: "Start Here",            desc: "The one decision everything else hangs on.",                    tint: C.gold },
  { n: "02", icon: ICON_C2, title: "Know Your Numbers",     desc: "What your last reinvestment returned, and how your margin compares.", tint: C.gold },
  { n: "03", icon: ICON_C3, title: "Find The Constraint",   desc: "The one thing capping sustainable growth.",                     tint: C.gold },
  { n: "04", icon: ICON_C4, title: "The Profit Split System", desc: "What goes back in, what holds in reserve, what comes out to you.", tint: C.green },
  { n: "05", icon: ICON_C5, title: "Build The Outside",     desc: "Assets that aren't the company, and a tax plan that isn't paperwork.", tint: C.green },
  { n: "06", icon: ICON_C6, title: "Where This Is Going",   desc: "The destination that makes every future decision answerable.",  tint: C.cyan },
];

/* Reached two ways:
     1. straight after the flow, with state passed in as props
     2. later from the report or the results email, as
        /reinvest-harvest/next?t=<token>#rh-scheduler
   In case 2 the server resolves the token and passes the same props back.
   If the token is missing or unrecognised — forwarded link, mangled by an
   email client — `resolved` comes back false and the page drops to a
   generic booking view rather than rendering a broken result. */
export default function ReinvestHarvestThankYou({
  email = "you@yourcompany.com",
  quadrantKey = "split",
  revenueBand = "$3M - $10M",
  ownerTier = "Owner",
  resolved = true,
}) {
  const [q, setQ] = useState(quadrantKey);
  const [rev, setRev] = useState(revenueBand);
  const [tier, setTier] = useState(ownerTier);
  const [playing, setPlaying] = useState(false);


  const quad = QUADRANTS[q];
  const offerKey = routeTo(rev, tier);
  const offer = OFFERS[offerKey];

  /* Booking lives on this page, so the fit-call CTAs scroll rather than navigate.
     href is the in-page anchor, not the iClosed URL — that way a middle-click or
     cmd-click can't open the scheduler in a tab either, and with JS disabled the
     browser still jumps to the embed instead of leaving the page.
     Collective has no embed, so that branch keeps its external Skool link. */
  const scrollToScheduler = (e) => {
    e.preventDefault();
    const el = document.getElementById("rh-scheduler");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const ctaHref = offerKey === "oneToOne" ? "#rh-scheduler" : offer.url;
  const ctaProps = offerKey === "oneToOne"
    ? { onClick: scrollToScheduler }
    : { target: "_blank", rel: "noopener noreferrer" };

  const wrap = { maxWidth: 720, margin: "0 auto", padding: "0 20px" };
  /* Breaks out past the 720 column so long copy lands on two lines at desktop. */
  const wide = { maxWidth: 1120, margin: "0 auto", padding: "0 20px" };
  const kicker = { fontSize: 10, fontWeight: 700, letterSpacing: ".2em", textTransform: "uppercase" };

  return (
    <div style={{ background: C.bgDeep, minHeight: "100vh", fontFamily: "'DM Sans',sans-serif", color: C.text1, paddingBottom: PREVIEW ? 90 : 40 }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet" />
      <style>{`
        *{box-sizing:border-box}
        .cta:hover{box-shadow:0 0 44px ${C.gold}3d,0 6px 22px rgba(0,0,0,.45)!important;border-color:${C.gold}!important}
        .vsl:hover .play{transform:scale(1.07)}
        .roadmap{display:grid;grid-template-columns:1fr 1fr;gap:12px}
        .rcard{transition:box-shadow .3s ease,border-color .3s ease,background .3s ease}
        .rcard:hover{
          border-color:var(--glowEdge)!important;
          background:linear-gradient(160deg,var(--glowSoft),rgba(255,255,255,.02))!important;
          box-shadow:0 0 30px var(--glowSoft),0 0 60px var(--glowSoft),inset 0 0 22px rgba(255,255,255,.02);
        }
        @media(min-width:700px){.roadmap{grid-template-columns:repeat(3,1fr);gap:16px}}
      `}</style>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", opacity: .05, mixBlendMode: "overlay", backgroundImage: GRAIN, backgroundSize: "128px 128px", zIndex: 0 }} />

      {/* ── CONFIRMATION BAR ── */}
      {resolved && <div style={{ background: `linear-gradient(90deg, ${C.green}16, ${C.green}09)`, borderBottom: `1px solid ${C.green}33`, padding: "14px 20px", position: "relative", zIndex: 2 }}>
        <div style={{ ...wrap, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, textAlign: "center" }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
            <polyline points="4 12 10 18 20 6" stroke={C.green} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ fontSize: 14, color: C.text1 }}>
            Your scorecard is on its way to <b style={{ color: C.green }}>{email}</b>
          </span>
        </div>
      </div>}

      <div style={{ ...wide, position: "relative", zIndex: 1 }}>

        {/* ── QUADRANT HERO ── */}
        {resolved ? (
          <section style={{ padding: "52px 0 34px", textAlign: "center" }}>
            <div style={{ ...kicker, color: quad.color, marginBottom: 14 }}>You landed in</div>
            <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: "clamp(40px,9.6vw,64px)", textTransform: "uppercase", letterSpacing: ".01em", color: quad.color, lineHeight: 1.06, margin: "0 0 22px" }}>
              {quad.label}
            </h1>
            <p style={{ fontSize: "clamp(16px,3.9vw,20px)", lineHeight: 1.5, color: C.text1, maxWidth: 820, margin: "0 auto", fontWeight: 400 }}>
              {quad.line}
            </p>
          </section>
        ) : (
          /* Same copy as the resolved page's bridge section. Deliberate: it is
             fully generic, whereas the earlier hero referenced "your two scores"
             — which a visitor arriving on a bad token may not have. */
          <section style={{ padding: "52px 0 34px", textAlign: "center" }}>
            <div style={{ ...kicker, color: C.gold, marginBottom: 14 }}>Reinvest or Harvest</div>
            <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: "clamp(30px,7vw,46px)", lineHeight: 1.12, color: C.text1, margin: "0 0 18px" }}>
              Want help proactively reinvesting in your business?
            </h1>
            <p style={{ fontSize: "clamp(13.5px,3.1vw,15px)", lineHeight: 1.6, color: C.text2, maxWidth: 1060, margin: "0 auto" }}>
              The video shows you what to do. This is where you find out whether you're a fit to have me work on it with you — intentionally pursuing reinvestment opportunities inside your business, and building financial freedom outside of it.
            </p>
          </section>
        )}

        {/* ── VSL ── */}
        <section style={{ ...wrap, paddingBottom: 40 }}>
          <div className="vsl" onClick={() => setPlaying(true)}
            style={{ position: "relative", aspectRatio: "16/9", borderRadius: 16, overflow: "hidden", cursor: "pointer", background: "linear-gradient(145deg,#141B26,#0B1017)", border: `1px solid ${C.gold}33`, boxShadow: `0 14px 46px rgba(0,0,0,.5), 0 0 60px ${C.gold}0d`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ textAlign: "center", padding: 20 }}>
              <div className="play" style={{ width: 74, height: 74, borderRadius: "50%", border: `2px solid ${C.gold}99`, background: `${C.gold}16`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", boxShadow: `0 0 34px ${C.gold}33`, transition: "transform .25s ease" }}>
                <svg width="25" height="28" viewBox="0 0 22 24" fill={C.gold}><path d="M21 12L0 24V0z" /></svg>
              </div>
              <div style={{ fontSize: 13.5, color: C.text2, letterSpacing: ".03em" }}>
                {playing ? "VSL embed goes here — wide 16:9" : "Watch before your call"}
              </div>
            </div>
          </div>
        </section>

        {resolved && (<>
        {/* ── BRIDGE + CTA — sits directly under the video, ahead of the roadmap ── */}
        <section style={{ paddingBottom: 46, textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: "clamp(30px,7vw,46px)", lineHeight: 1.12, color: C.text1, margin: "0 0 18px" }}>
            Want help proactively reinvesting in your business?
          </h2>
          <p style={{ fontSize: "clamp(13.5px,3.1vw,15px)", lineHeight: 1.6, color: C.text2, maxWidth: 1060, margin: "0 auto 26px" }}>
            {offer.bridge}
          </p>
          <a href={ctaHref} className="cta" {...ctaProps}
            style={{ display: "block", maxWidth: 460, margin: "0 auto", padding: "21px 24px", borderRadius: 13, textAlign: "center", textDecoration: "none", background: `linear-gradient(135deg,${C.gold}2e,${C.gold}12)`, border: `1.5px solid ${C.gold}88`, boxShadow: `0 0 34px ${C.gold}26`, transition: "all .25s ease" }}>
            <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: ".02em", color: C.gold }}>{offer.cta} →</span>
          </a>
        </section>

        </>)}

        {!resolved && (
          <section style={{ ...wrap, paddingBottom: 46, textAlign: "center" }}>
            <a href="#rh-scheduler" className="cta" onClick={scrollToScheduler}
              style={{ display: "block", maxWidth: 460, margin: "0 auto", padding: "21px 24px", borderRadius: 13, textAlign: "center", textDecoration: "none",
                background: `linear-gradient(135deg,${C.gold}2e,${C.gold}12)`, border: `1.5px solid ${C.gold}88`, boxShadow: `0 0 34px ${C.gold}26`, transition: "all .25s ease" }}>
              <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: ".02em", color: C.gold }}>BOOK YOUR FIT CALL →</span>
            </a>
            <p style={{ fontSize: 13.5, color: C.text3, margin: "16px 0 0" }}>
              <a href="/reinvest-harvest" style={{ color: C.text3 }}>Haven't taken the scorecard yet?</a>
            </p>
          </section>
        )}

        {/* ── ROADMAP — before the CTA, so it argues for it ── */}
        <section style={{ maxWidth: 940, margin: "0 auto", padding: "10px 0 44px" }}>
          <div style={{ textAlign: "center", marginBottom: 34 }}>
            <div style={{ ...kicker, color: C.gold, marginBottom: 12 }}>Where this leads</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: "clamp(28px,6.6vw,40px)", lineHeight: 1.14, color: C.text1, margin: "0 0 14px" }}>
              The scorecard is <span style={{ color: C.gold, fontStyle: "italic", fontWeight: 400 }}>step one</span>
            </h2>
            <p style={{ fontSize: 15.5, lineHeight: 1.6, color: C.text2, maxWidth: 540, margin: "0 auto" }}>
              It answers the reinvest-or-harvest question for where you are today. This is the system for how you keep answering it as the business changes.
            </p>
          </div>

          <div className="roadmap">
            {ROADMAP.map(r0 => {
              /* "You Are Here" only makes sense if they just took it. Someone
                 arriving on a bad token hasn't scored, so 01 reverts. */
              const r = (resolved && r0.n === "01")
                ? { ...r0, title: "You Are Here", desc: "The one decision everything else hangs on — the one you just scored." }
                : r0;
              return (
              <div key={r.n} className="rcard" style={{ padding: "20px 16px 22px", borderRadius: 14, textAlign: "center",
                background: `linear-gradient(160deg, ${r.tint}0a, rgba(255,255,255,.015))`,
                border: `1px solid ${r.tint}22`,
                /* per-card glow, driven off the icon's own colour */
                "--glow": r.tint, "--glowSoft": `${r.tint}2e`, "--glowEdge": `${r.tint}70` }}>
                <div style={{ height: 62, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}
                  dangerouslySetInnerHTML={{ __html: r.icon.replace('width="512" height="512"', 'width="58" height="58"') }} />
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 13, fontWeight: 700, color: `${r.tint}88`, letterSpacing: ".06em", marginBottom: 5 }}>{r.n}</div>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 19, fontWeight: 700, color: C.text1, lineHeight: 1.2, marginBottom: 7 }}>{r.title}</div>
                <div style={{ fontSize: 12.5, lineHeight: 1.5, color: C.text3 }}>{r.desc}</div>
              </div>
              );
            })}
          </div>
        </section>

        {resolved && (<>
        {/* ── OFFER ── */}
        <section style={{ ...wrap, padding: "0 0 34px" }}>
          <div style={{ padding: "32px 24px", borderRadius: 18, background: "linear-gradient(145deg, rgba(255,255,255,.05), rgba(255,255,255,.02))", border: `1px solid ${C.gold}2e`, borderTop: "1px solid rgba(255,255,255,.12)", boxShadow: "0 10px 40px rgba(0,0,0,.45)" }}>
            <div style={{ ...kicker, color: C.gold, marginBottom: 12, textAlign: "center" }}>{offer.kicker}</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: "clamp(24px,5.6vw,32px)", lineHeight: 1.18, color: C.text1, textAlign: "center", margin: "0 0 14px" }}>
              {offer.title}
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.65, color: C.text2, textAlign: "center", maxWidth: 520, margin: "0 auto 28px" }}>
              {offer.body}
            </p>

            {offer.steps.map((s, i) => (
              <div key={s.t} style={{ display: "flex", gap: 15, alignItems: "flex-start", padding: "15px 0", borderBottom: i < 2 ? "1px solid rgba(255,255,255,.06)" : "none" }}>
                <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 23, fontWeight: 700, color: `${C.gold}66`, lineHeight: 1, minWidth: 30 }}>0{i + 1}</span>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: C.text1, marginBottom: 3 }}>{s.t}</div>
                  <div style={{ fontSize: 14, lineHeight: 1.55, color: C.text2 }}>{s.d}</div>
                </div>
              </div>
            ))}

            {offer.note && (
              <div style={{ marginTop: 20, padding: "11px 16px", borderRadius: 9, background: `${C.gold}0d`, border: `1px solid ${C.gold}2e`, textAlign: "center" }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.gold }}>{offer.note}</span>
              </div>
            )}

            <a href={ctaHref} className="cta" {...ctaProps}
              style={{ display: "block", marginTop: 26, padding: "20px 24px", borderRadius: 13, textAlign: "center", textDecoration: "none", background: `linear-gradient(135deg,${C.gold}26,${C.gold}0f)`, border: `1.5px solid ${C.gold}77`, boxShadow: `0 0 30px ${C.gold}1f`, transition: "all .25s ease" }}>
              <span style={{ fontSize: 16.5, fontWeight: 700, letterSpacing: ".02em", color: C.gold }}>{offer.cta} →</span>
            </a>
          </div>
        </section>

        </>)}

        {/* ── BOOK (1-on-1) or JOIN (Collective) ── */}
        <section id="rh-scheduler" style={{ ...wrap, paddingBottom: 44, scrollMarginTop: 24 }}>
          <div style={{ textAlign: "center", marginBottom: 26 }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: "clamp(26px,6vw,38px)", lineHeight: 1.14, color: C.text1, margin: "0 0 12px" }}>
              {offer.calHead}
            </h2>
            <p style={{ fontSize: 15.5, lineHeight: 1.6, color: C.text2, maxWidth: 560, margin: "0 auto" }}>
              {offer.calSub}
            </p>
          </div>
          {offerKey === "oneToOne" ? (
            <div style={{ borderRadius: 16, overflow: "hidden", border: "1px solid rgba(255,255,255,.09)", background: C.bgCard, minHeight: 620 }}>
              {/* Direct iframe. Do NOT use iClosed widget.js — it races the React render. */}
              <iframe src={offer.url} title="Book your working session" width="100%" height="620"
                style={{ border: "none", display: "block" }} loading="lazy" />
            </div>
          ) : (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <a href={offer.url} className="cta" target="_blank" rel="noopener noreferrer"
                style={{ display: "block", maxWidth: 460, width: "100%", padding: "21px 24px", borderRadius: 13, textAlign: "center", textDecoration: "none",
                  background: `linear-gradient(135deg,${C.gold}2e,${C.gold}12)`, border: `1.5px solid ${C.gold}88`, boxShadow: `0 0 34px ${C.gold}26`, transition: "all .25s ease" }}>
                <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: ".02em", color: C.gold }}>{offer.cta} →</span>
              </a>
            </div>
          )}
        </section>

        {/* ── DISCLOSURE ── */}
        <footer style={{ ...wrap, paddingTop: 26, borderTop: "1px solid rgba(255,255,255,.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", marginBottom: 14 }}>
            <svg width="19" height="19" viewBox="0 0 64 64" fill="none">
              <path d="M32 8L14 16V30C14 42 22 52 32 56C42 52 50 42 50 30V16L32 8Z" fill="none" stroke={C.gold} strokeWidth="2.5" strokeLinejoin="round" />
            </svg>
            <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 15, letterSpacing: ".08em", textTransform: "uppercase", color: C.text2 }}>
              <b style={{ color: C.gold, fontWeight: 600 }}>Kriczky</b> Virtus
            </span>
          </div>
          <p style={{ fontSize: 10.5, lineHeight: 1.6, color: C.text3, textAlign: "center", margin: 0 }}>
            This scorecard is an educational self-assessment tool from Kriczky Virtus. It is general in nature, is based entirely on your own self-reported answers, and does not constitute individualized financial, tax, legal, or accounting advice, nor a recommendation to pursue any particular course of action. No outcome is projected or guaranteed. Your situation is specific to you — coordinate any decision with your CPA, attorney, and other advisors before acting.
          </p>
        </footer>
      </div>

      {/* ── PREVIEW TOOLBAR — not present in production ── */}
      {PREVIEW && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 99, background: "rgba(10,14,20,.95)", backdropFilter: "blur(10px)", borderTop: `1px solid ${C.gold}44`, padding: "10px 14px", display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}>
          <span style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: C.gold, padding: "3px 8px", borderRadius: 4, border: `1px solid ${C.gold}55`, background: `${C.gold}12` }}>Preview</span>
          {Object.keys(QUADRANTS).map(k => (
            <button key={k} onClick={() => setQ(k)}
              style={{ padding: "5px 10px", borderRadius: 7, cursor: "pointer", fontSize: 10.5, fontWeight: 600, fontFamily: "'DM Sans',sans-serif", color: QUADRANTS[k].color, background: q === k ? `${QUADRANTS[k].color}26` : `${QUADRANTS[k].color}0d`, border: `1px solid ${QUADRANTS[k].color}${q === k ? "88" : "33"}` }}>
              {QUADRANTS[k].label.split(" —")[0]}
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
