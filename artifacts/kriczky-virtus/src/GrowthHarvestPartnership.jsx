import { useState, useEffect } from "react";

/* Growth & Harvest Partnership — offer page.
   Single source of truth for pricing lives in PRICE / AUM_TIERS below. */

const C = {
  bgDeep: "#0A0E14", bgCard: "#111720", bgElev: "#1A2130",
  gold: "#C8A24E", goldLight: "#D4B665", goldDark: "#8A6C2A", goldMuted: "#A68A42",
  green: "#34D399", greenLight: "#6FE2BB", greenDark: "#1B8A63",
  cyan: "#22D3EE", red: "#F87171",
  text1: "#E8ECF1", text2: "#8B95A5", text3: "#5A6474", text4: "#3D4654",
  border1: "rgba(255,255,255,0.06)", border2: "rgba(255,255,255,0.10)",
};

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const PRICE = "$3,000";
const ROADMAP_FEE = "$6,000";
/* Standard schedule is tiered — each rate applies to that slice, not the whole
   balance. Must match the ADV fee schedule exactly. */
const AUM_TIERS = [
  { band: "First $1,000,000",   fee: "1.00%" },
  { band: "Next $4,000,000",    fee: "0.90%" },
  { band: "Next $5,000,000",    fee: "0.85%" },
  { band: "Next $10,000,000",   fee: "0.80%" },
  { band: "Above $20,000,000",  fee: "0.75%" },
];
const PARTNER_RATE = "0.80%";
const PARTNER_RATE_ABOVE = "0.70%";

/* Metallic course icons and barbell, inlined from the brand SVGs.
   Gradient and filter ids are already namespaced per icon, so no collisions. */
const IcStartHere = ({ size = 54 }) => (
  <svg width={size} height={size} viewBox="-210 -210 420 420" style={{ overflow: "visible", display: "block" }}>
<defs>
  <linearGradient id="metalxcompass" gradientUnits="userSpaceOnUse" x1="0" y1="-150" x2="0" y2="150"><stop offset="0%" stopColor="#F8ECC4"/><stop offset="14%" stopColor="#DFC177"/><stop offset="28%" stopColor="#C8A24E"/><stop offset="42%" stopColor="#5A4419"/><stop offset="50%" stopColor="#F8ECC4"/><stop offset="64%" stopColor="#C8A24E"/><stop offset="80%" stopColor="#8A6C2A"/><stop offset="100%" stopColor="#5A4419"/></linearGradient>
  <filter id="softxcompass" x="-60%" y="-60%" width="220%" height="220%">
    <feGaussianBlur stdDeviation="2.50"/>
  </filter>
  <filter id="liftxcompass" x="-70%" y="-70%" width="240%" height="240%">
    <feDropShadow dx="0" dy="6.0" stdDeviation="9.0" floodColor="#000" floodOpacity="0.55"/>
    <feDropShadow dx="0" dy="0" stdDeviation="16.0" floodColor="#C8A24E" floodOpacity="0.38"/>
  </filter>
  <radialGradient id="ambxcompass">
    <stop offset="0%" stopColor="#C8A24E" stopOpacity="0.16"/>
    <stop offset="100%" stopColor="#C8A24E" stopOpacity="0"/>
  </radialGradient>
</defs>
<circle cx="0" cy="0" r="215" fill="url(#ambxcompass)"/>
<g fill="none" stroke="#000" strokeOpacity="0.55" strokeWidth="28.00"
   strokeLinecap="round" strokeLinejoin="round"
   transform="translate(0,7.0)" filter="url(#softxcompass)"><circle cx="0" cy="0" r="118"/><path d="M0 -150 L34 -34 L150 0 L34 34 L0 150 L-34 34 L-150 0 L-34 -34 Z"/></g>
<g fill="none" stroke="url(#metalxcompass)" strokeWidth="22.00"
   strokeLinecap="round" strokeLinejoin="round" filter="url(#liftxcompass)"><circle cx="0" cy="0" r="118"/><path d="M0 -150 L34 -34 L150 0 L34 34 L0 150 L-34 34 L-150 0 L-34 -34 Z"/></g>
<g fill="none" stroke="#FFFDF5" strokeOpacity="0.55" strokeWidth="5.00"
   strokeLinecap="round" strokeLinejoin="round"
   transform="translate(0,-5.0)"><circle cx="0" cy="0" r="118"/><path d="M0 -150 L34 -34 L150 0 L34 34 L0 150 L-34 34 L-150 0 L-34 -34 Z"/></g>
  </svg>
);

const IcKnowNumbers = ({ size = 54 }) => (
  <svg width={size} height={size} viewBox="-210 -210 420 420" style={{ overflow: "visible", display: "block" }}>
<defs>
  <linearGradient id="metalxbars" gradientUnits="userSpaceOnUse" x1="0" y1="-130" x2="0" y2="130"><stop offset="0%" stopColor="#F8ECC4"/><stop offset="14%" stopColor="#DFC177"/><stop offset="28%" stopColor="#C8A24E"/><stop offset="42%" stopColor="#5A4419"/><stop offset="50%" stopColor="#F8ECC4"/><stop offset="64%" stopColor="#C8A24E"/><stop offset="80%" stopColor="#8A6C2A"/><stop offset="100%" stopColor="#5A4419"/></linearGradient>
  <filter id="softxbars" x="-60%" y="-60%" width="220%" height="220%">
    <feGaussianBlur stdDeviation="2.50"/>
  </filter>
  <filter id="liftxbars" x="-70%" y="-70%" width="240%" height="240%">
    <feDropShadow dx="0" dy="6.0" stdDeviation="9.0" floodColor="#000" floodOpacity="0.55"/>
    <feDropShadow dx="0" dy="0" stdDeviation="16.0" floodColor="#C8A24E" floodOpacity="0.38"/>
  </filter>
  <radialGradient id="ambxbars">
    <stop offset="0%" stopColor="#C8A24E" stopOpacity="0.16"/>
    <stop offset="100%" stopColor="#C8A24E" stopOpacity="0"/>
  </radialGradient>
</defs>
<circle cx="0" cy="0" r="215" fill="url(#ambxbars)"/>
<g fill="none" stroke="#000" strokeOpacity="0.55" strokeWidth="28.00"
   strokeLinecap="round" strokeLinejoin="round"
   transform="translate(0,7.0)" filter="url(#softxbars)"><path d="M-150 -130 L-150 130 L150 130"/><path d="M-72 60 L-72 -10"/><path d="M4 60 L4 -60"/><path d="M80 60 L80 -112"/></g>
<g fill="none" stroke="url(#metalxbars)" strokeWidth="22.00"
   strokeLinecap="round" strokeLinejoin="round" filter="url(#liftxbars)"><path d="M-150 -130 L-150 130 L150 130"/><path d="M-72 60 L-72 -10"/><path d="M4 60 L4 -60"/><path d="M80 60 L80 -112"/></g>
<g fill="none" stroke="#FFFDF5" strokeOpacity="0.55" strokeWidth="5.00"
   strokeLinecap="round" strokeLinejoin="round"
   transform="translate(0,-5.0)"><path d="M-150 -130 L-150 130 L150 130"/><path d="M-72 60 L-72 -10"/><path d="M4 60 L4 -60"/><path d="M80 60 L80 -112"/></g>
  </svg>
);

const IcConstraint = ({ size = 54 }) => (
  <svg width={size} height={size} viewBox="-210 -210 420 420" style={{ overflow: "visible", display: "block" }}>
<defs>
  <linearGradient id="metalxfunnel" gradientUnits="userSpaceOnUse" x1="0" y1="-140" x2="0" y2="150"><stop offset="0%" stopColor="#F8ECC4"/><stop offset="14%" stopColor="#DFC177"/><stop offset="28%" stopColor="#C8A24E"/><stop offset="42%" stopColor="#5A4419"/><stop offset="50%" stopColor="#F8ECC4"/><stop offset="64%" stopColor="#C8A24E"/><stop offset="80%" stopColor="#8A6C2A"/><stop offset="100%" stopColor="#5A4419"/></linearGradient>
  <filter id="softxfunnel" x="-60%" y="-60%" width="220%" height="220%">
    <feGaussianBlur stdDeviation="2.50"/>
  </filter>
  <filter id="liftxfunnel" x="-70%" y="-70%" width="240%" height="240%">
    <feDropShadow dx="0" dy="6.0" stdDeviation="9.0" floodColor="#000" floodOpacity="0.55"/>
    <feDropShadow dx="0" dy="0" stdDeviation="16.0" floodColor="#C8A24E" floodOpacity="0.38"/>
  </filter>
  <radialGradient id="ambxfunnel">
    <stop offset="0%" stopColor="#C8A24E" stopOpacity="0.16"/>
    <stop offset="100%" stopColor="#C8A24E" stopOpacity="0"/>
  </radialGradient>
</defs>
<circle cx="0" cy="0" r="215" fill="url(#ambxfunnel)"/>
<g fill="none" stroke="#000" strokeOpacity="0.55" strokeWidth="28.00"
   strokeLinecap="round" strokeLinejoin="round"
   transform="translate(0,7.0)" filter="url(#softxfunnel)"><path d="M-160 -140 L160 -140 L34 -6 L34 96 L-34 150 L-34 -6 Z"/></g>
<g fill="none" stroke="url(#metalxfunnel)" strokeWidth="22.00"
   strokeLinecap="round" strokeLinejoin="round" filter="url(#liftxfunnel)"><path d="M-160 -140 L160 -140 L34 -6 L34 96 L-34 150 L-34 -6 Z"/></g>
<g fill="none" stroke="#FFFDF5" strokeOpacity="0.55" strokeWidth="5.00"
   strokeLinecap="round" strokeLinejoin="round"
   transform="translate(0,-5.0)"><path d="M-160 -140 L160 -140 L34 -6 L34 96 L-34 150 L-34 -6 Z"/></g>
  </svg>
);

const IcProfitSplit = ({ size = 54 }) => (
  <svg width={size} height={size} viewBox="-210 -210 420 420" style={{ overflow: "visible", display: "block" }}>
<defs>
  <linearGradient id="metalxdiverge" gradientUnits="userSpaceOnUse" x1="0" y1="-140" x2="0" y2="150"><stop offset="0%" stopColor="#D8FCEE"/><stop offset="14%" stopColor="#7CE7BF"/><stop offset="28%" stopColor="#34D399"/><stop offset="42%" stopColor="#0F5C42"/><stop offset="50%" stopColor="#EAFFF7"/><stop offset="64%" stopColor="#34D399"/><stop offset="80%" stopColor="#1B8A63"/><stop offset="100%" stopColor="#0F5C42"/></linearGradient>
  <filter id="softxdiverge" x="-60%" y="-60%" width="220%" height="220%">
    <feGaussianBlur stdDeviation="2.50"/>
  </filter>
  <filter id="liftxdiverge" x="-70%" y="-70%" width="240%" height="240%">
    <feDropShadow dx="0" dy="6.0" stdDeviation="9.0" floodColor="#000" floodOpacity="0.55"/>
    <feDropShadow dx="0" dy="0" stdDeviation="16.0" floodColor="#34D399" floodOpacity="0.38"/>
  </filter>
  <radialGradient id="ambxdiverge">
    <stop offset="0%" stopColor="#34D399" stopOpacity="0.16"/>
    <stop offset="100%" stopColor="#34D399" stopOpacity="0"/>
  </radialGradient>
</defs>
<circle cx="0" cy="0" r="215" fill="url(#ambxdiverge)"/>
<g fill="none" stroke="#000" strokeOpacity="0.55" strokeWidth="28.00"
   strokeLinecap="round" strokeLinejoin="round"
   transform="translate(0,7.0)" filter="url(#softxdiverge)"><path d="M0 150 L0 20"/><path d="M0 20 L-120 -100"/><path d="M0 20 L120 -100"/><path d="M-120 -100 L-120 -20 M-120 -100 L-40 -100"/><path d="M120 -100 L120 -20 M120 -100 L40 -100"/></g>
<g fill="none" stroke="url(#metalxdiverge)" strokeWidth="22.00"
   strokeLinecap="round" strokeLinejoin="round" filter="url(#liftxdiverge)"><path d="M0 150 L0 20"/><path d="M0 20 L-120 -100"/><path d="M0 20 L120 -100"/><path d="M-120 -100 L-120 -20 M-120 -100 L-40 -100"/><path d="M120 -100 L120 -20 M120 -100 L40 -100"/></g>
<g fill="none" stroke="#FFFDF5" strokeOpacity="0.55" strokeWidth="5.00"
   strokeLinecap="round" strokeLinejoin="round"
   transform="translate(0,-5.0)"><path d="M0 150 L0 20"/><path d="M0 20 L-120 -100"/><path d="M0 20 L120 -100"/><path d="M-120 -100 L-120 -20 M-120 -100 L-40 -100"/><path d="M120 -100 L120 -20 M120 -100 L40 -100"/></g>
  </svg>
);

const IcBuildOutside = ({ size = 54 }) => (
  <svg width={size} height={size} viewBox="-210 -210 420 420" style={{ overflow: "visible", display: "block" }}>
<defs>
  <linearGradient id="metalxoutward" gradientUnits="userSpaceOnUse" x1="0" y1="-150" x2="0" y2="150"><stop offset="0%" stopColor="#D8FCEE"/><stop offset="14%" stopColor="#7CE7BF"/><stop offset="28%" stopColor="#34D399"/><stop offset="42%" stopColor="#0F5C42"/><stop offset="50%" stopColor="#EAFFF7"/><stop offset="64%" stopColor="#34D399"/><stop offset="80%" stopColor="#1B8A63"/><stop offset="100%" stopColor="#0F5C42"/></linearGradient>
  <filter id="softxoutward" x="-60%" y="-60%" width="220%" height="220%">
    <feGaussianBlur stdDeviation="2.50"/>
  </filter>
  <filter id="liftxoutward" x="-70%" y="-70%" width="240%" height="240%">
    <feDropShadow dx="0" dy="6.0" stdDeviation="9.0" floodColor="#000" floodOpacity="0.55"/>
    <feDropShadow dx="0" dy="0" stdDeviation="16.0" floodColor="#34D399" floodOpacity="0.38"/>
  </filter>
  <radialGradient id="ambxoutward">
    <stop offset="0%" stopColor="#34D399" stopOpacity="0.16"/>
    <stop offset="100%" stopColor="#34D399" stopOpacity="0"/>
  </radialGradient>
</defs>
<circle cx="0" cy="0" r="215" fill="url(#ambxoutward)"/>
<g fill="none" stroke="#000" strokeOpacity="0.55" strokeWidth="28.00"
   strokeLinecap="round" strokeLinejoin="round"
   transform="translate(0,7.0)" filter="url(#softxoutward)"><circle cx="0" cy="0" r="46"/><path d="M-150 0 A150 150 0 0 1 -34 -146"/><path d="M-96 132 A150 150 0 0 1 -128 96"/><path d="M96 132 A150 150 0 0 0 150 34"/><path d="M40 -40 L142 -142"/><path d="M142 -142 L64 -142 M142 -142 L142 -64"/></g>
<g fill="none" stroke="url(#metalxoutward)" strokeWidth="22.00"
   strokeLinecap="round" strokeLinejoin="round" filter="url(#liftxoutward)"><circle cx="0" cy="0" r="46"/><path d="M-150 0 A150 150 0 0 1 -34 -146"/><path d="M-96 132 A150 150 0 0 1 -128 96"/><path d="M96 132 A150 150 0 0 0 150 34"/><path d="M40 -40 L142 -142"/><path d="M142 -142 L64 -142 M142 -142 L142 -64"/></g>
<g fill="none" stroke="#FFFDF5" strokeOpacity="0.55" strokeWidth="5.00"
   strokeLinecap="round" strokeLinejoin="round"
   transform="translate(0,-5.0)"><circle cx="0" cy="0" r="46"/><path d="M-150 0 A150 150 0 0 1 -34 -146"/><path d="M-96 132 A150 150 0 0 1 -128 96"/><path d="M96 132 A150 150 0 0 0 150 34"/><path d="M40 -40 L142 -142"/><path d="M142 -142 L64 -142 M142 -142 L142 -64"/></g>
  </svg>
);

const IcNorthStar = ({ size = 54 }) => (
  <svg width={size} height={size} viewBox="-210 -210 420 420" style={{ overflow: "visible", display: "block" }}>
<defs>
  <linearGradient id="metalxhorizon" gradientUnits="userSpaceOnUse" x1="0" y1="-170" x2="0" y2="155"><stop offset="0%" stopColor="#D6F8FE"/><stop offset="14%" stopColor="#7EE9F7"/><stop offset="28%" stopColor="#22D3EE"/><stop offset="42%" stopColor="#0B5A68"/><stop offset="50%" stopColor="#EAFEFF"/><stop offset="64%" stopColor="#22D3EE"/><stop offset="80%" stopColor="#128FA6"/><stop offset="100%" stopColor="#0B5A68"/></linearGradient>
  <filter id="softxhorizon" x="-60%" y="-60%" width="220%" height="220%">
    <feGaussianBlur stdDeviation="2.50"/>
  </filter>
  <filter id="liftxhorizon" x="-70%" y="-70%" width="240%" height="240%">
    <feDropShadow dx="0" dy="6.0" stdDeviation="9.0" floodColor="#000" floodOpacity="0.55"/>
    <feDropShadow dx="0" dy="0" stdDeviation="16.0" floodColor="#22D3EE" floodOpacity="0.38"/>
  </filter>
  <radialGradient id="ambxhorizon">
    <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.16"/>
    <stop offset="100%" stopColor="#22D3EE" stopOpacity="0"/>
  </radialGradient>
</defs>
<circle cx="0" cy="0" r="215" fill="url(#ambxhorizon)"/>
<g fill="none" stroke="#000" strokeOpacity="0.55" strokeWidth="28.00"
   strokeLinecap="round" strokeLinejoin="round"
   transform="translate(0,7.0)" filter="url(#softxhorizon)"><path d="M0 155 C0 155 116 26 116 -54 A116 116 0 1 0 -116 -54 C-116 26 0 155 0 155 Z"/><circle cx="0" cy="-54" r="44"/></g>
<g fill="none" stroke="url(#metalxhorizon)" strokeWidth="22.00"
   strokeLinecap="round" strokeLinejoin="round" filter="url(#liftxhorizon)"><path d="M0 155 C0 155 116 26 116 -54 A116 116 0 1 0 -116 -54 C-116 26 0 155 0 155 Z"/><circle cx="0" cy="-54" r="44"/></g>
<g fill="none" stroke="#FFFDF5" strokeOpacity="0.55" strokeWidth="5.00"
   strokeLinecap="round" strokeLinejoin="round"
   transform="translate(0,-5.0)"><path d="M0 155 C0 155 116 26 116 -54 A116 116 0 1 0 -116 -54 C-116 26 0 155 0 155 Z"/><circle cx="0" cy="-54" r="44"/></g>
  </svg>
);

const IcBarbell = ({ width = 300 }) => (
  <svg width={width} viewBox="-210 -105 420 210" style={{ overflow: "visible", display: "block", height: "auto" }}>
<defs>
    <clipPath id="clipLxbb"><rect x="-210" y="-210" width="210" height="420"/></clipPath>
    <clipPath id="clipRxbb"><rect x="0" y="-210" width="210" height="420"/></clipPath>
  </defs>
  <g clipPath="url(#clipLxbb)">
<defs>
  <linearGradient id="metalxbbL" gradientUnits="userSpaceOnUse" x1="0" y1="-68" x2="0" y2="68"><stop offset="0%" stopColor="#F8ECC4"/><stop offset="14%" stopColor="#DFC177"/><stop offset="28%" stopColor="#C8A24E"/><stop offset="42%" stopColor="#5A4419"/><stop offset="50%" stopColor="#F8ECC4"/><stop offset="64%" stopColor="#C8A24E"/><stop offset="80%" stopColor="#8A6C2A"/><stop offset="100%" stopColor="#5A4419"/></linearGradient>
  <filter id="softxbbL" x="-60%" y="-60%" width="220%" height="220%">
    <feGaussianBlur stdDeviation="2.50"/>
  </filter>
  <filter id="liftxbbL" x="-70%" y="-70%" width="240%" height="240%">
    <feDropShadow dx="0" dy="6.0" stdDeviation="9.0" floodColor="#000" floodOpacity="0.55"/>
    <feDropShadow dx="0" dy="0" stdDeviation="16.0" floodColor="#C8A24E" floodOpacity="0.38"/>
  </filter>
  <radialGradient id="ambxbbL">
    <stop offset="0%" stopColor="#C8A24E" stopOpacity="0.16"/>
    <stop offset="100%" stopColor="#C8A24E" stopOpacity="0"/>
  </radialGradient>
</defs>
<g fill="none" stroke="#000" strokeOpacity="0.55" strokeWidth="28.00"
   strokeLinecap="round" strokeLinejoin="round"
   transform="translate(0,7.0)" filter="url(#softxbbL)"><path d="M-118 0 L118 0"/><path d="M-102 -68 L-102 68"/><path d="M-150 -46 L-150 46"/><path d="M102 -68 L102 68"/><path d="M150 -46 L150 46"/></g>
<g fill="none" stroke="url(#metalxbbL)" strokeWidth="22.00"
   strokeLinecap="round" strokeLinejoin="round" filter="url(#liftxbbL)"><path d="M-118 0 L118 0"/><path d="M-102 -68 L-102 68"/><path d="M-150 -46 L-150 46"/><path d="M102 -68 L102 68"/><path d="M150 -46 L150 46"/></g>
<g fill="none" stroke="#FFFDF5" strokeOpacity="0.55" strokeWidth="5.00"
   strokeLinecap="round" strokeLinejoin="round"
   transform="translate(0,-5.0)"><path d="M-118 0 L118 0"/><path d="M-102 -68 L-102 68"/><path d="M-150 -46 L-150 46"/><path d="M102 -68 L102 68"/><path d="M150 -46 L150 46"/></g>
</g>
  <g clipPath="url(#clipRxbb)">
<defs>
  <linearGradient id="metalxbbR" gradientUnits="userSpaceOnUse" x1="0" y1="-68" x2="0" y2="68"><stop offset="0%" stopColor="#D8FCEE"/><stop offset="14%" stopColor="#7CE7BF"/><stop offset="28%" stopColor="#34D399"/><stop offset="42%" stopColor="#0F5C42"/><stop offset="50%" stopColor="#EAFFF7"/><stop offset="64%" stopColor="#34D399"/><stop offset="80%" stopColor="#1B8A63"/><stop offset="100%" stopColor="#0F5C42"/></linearGradient>
  <filter id="softxbbR" x="-60%" y="-60%" width="220%" height="220%">
    <feGaussianBlur stdDeviation="2.50"/>
  </filter>
  <filter id="liftxbbR" x="-70%" y="-70%" width="240%" height="240%">
    <feDropShadow dx="0" dy="6.0" stdDeviation="9.0" floodColor="#000" floodOpacity="0.55"/>
    <feDropShadow dx="0" dy="0" stdDeviation="16.0" floodColor="#34D399" floodOpacity="0.38"/>
  </filter>
  <radialGradient id="ambxbbR">
    <stop offset="0%" stopColor="#34D399" stopOpacity="0.16"/>
    <stop offset="100%" stopColor="#34D399" stopOpacity="0"/>
  </radialGradient>
</defs>
<g fill="none" stroke="#000" strokeOpacity="0.55" strokeWidth="28.00"
   strokeLinecap="round" strokeLinejoin="round"
   transform="translate(0,7.0)" filter="url(#softxbbR)"><path d="M-118 0 L118 0"/><path d="M-102 -68 L-102 68"/><path d="M-150 -46 L-150 46"/><path d="M102 -68 L102 68"/><path d="M150 -46 L150 46"/></g>
<g fill="none" stroke="url(#metalxbbR)" strokeWidth="22.00"
   strokeLinecap="round" strokeLinejoin="round" filter="url(#liftxbbR)"><path d="M-118 0 L118 0"/><path d="M-102 -68 L-102 68"/><path d="M-150 -46 L-150 46"/><path d="M102 -68 L102 68"/><path d="M150 -46 L150 46"/></g>
<g fill="none" stroke="#FFFDF5" strokeOpacity="0.55" strokeWidth="5.00"
   strokeLinecap="round" strokeLinejoin="round"
   transform="translate(0,-5.0)"><path d="M-118 0 L118 0"/><path d="M-102 -68 L-102 68"/><path d="M-150 -46 L-150 46"/><path d="M102 -68 L102 68"/><path d="M150 -46 L150 46"/></g>
</g>
  </svg>
);



/* ── VARIANTS ─────────────────────────────────────────────────────────────
   One component, three readers. Every string that differs between them lives
   here and nowhere else — two separate files would drift, and on a page
   carrying a fee schedule and a refund term that matters.

     workshop   — handed out at a paid Reinvest or Harvest Workshop
     session    — sent after a free working session, $1M+ owner
     collective — sent after a free working session, sub-$1M owner
   ──────────────────────────────────────────────────────────────────────── */
const VARIANTS = {
  workshop: {
    ctaLabel: "Book Your Execution Debrief",
    ctaHref: "/reinvest-harvest/next",
    stickyLabel: "Book Your Execution Debrief",
    stickyLine: "The debrief is free.",
    ctaSub: (C) => (
      <>60 minutes, free. What your real options are for executing the plan, how you&rsquo;ll know it&rsquo;s working week by week rather than at day 90, and where this first sprint sits in the next 24 months.<br />
      <span style={{ color: C.green }}>This is how you start the Wealth Roadmap that came with your ticket.</span></>
    ),
    roadmapPrice: "Included",
    roadmapLine: (C) => (
      <>The business-owner engagement fee is $6,000. <strong style={{ color: C.green, fontWeight: 600 }}>Yours already &mdash; it came with your workshop ticket. Booking your Execution Debrief is how you start it.</strong></>
    ),
    legendFirst: "At the workshop",
    legendSecond: "Your Execution Debrief",
    step2: "A half-day workshop where we walk your two scores against your real numbers and build the 90-day plan.",
    showPartnershipPrice: true,
  },

  session: {
    ctaLabel: "Start Your First Sprint",
    /* ⚠️ PLACEHOLDER — this should be the onboarding step, not the
       working-session scheduler. They have just had that conversation. */
    ctaHref: "/partnership/start",
    stickyLabel: "Start Your First Sprint",
    stickyLine: "Month one is refundable.",
    ctaSub: (C) => (
      <>You&rsquo;ve got the plan. This starts the work &mdash; first sprint, first working session, first measurable move.<br />
      <span style={{ color: C.green }}>Your Personalized Wealth Roadmap is included with the first 90-day sprint.</span></>
    ),
    roadmapPrice: "Included",
    roadmapLine: (C) => (
      <>The business-owner engagement fee is $6,000. <strong style={{ color: C.green, fontWeight: 600 }}>Included with your first 90-day sprint &mdash; not a separate engagement, and not a separate invoice.</strong></>
    ),
    legendFirst: "Your working session",
    legendSecond: "Your first sprint",
    step2: "A working session one to one, where we walk your two scores against your real numbers and build the 90-day plan.",
    showPartnershipPrice: true,
  },

  collective: {
    ctaLabel: "Join Your Cohort",
    ctaHref: "https://www.skool.com/virtus-collective",
    ctaExternal: true,
    stickyLabel: "Join Your Cohort",
    stickyLine: "Free to join. Start where you are.",
    ctaSub: (C) => (
      <>The Collective runs the same six stations as a group, at your own pace, with other owners working the same decisions.<br />
      <span style={{ color: C.text3 }}>The Partnership below is what one-to-one looks like when you&rsquo;re ready for it.</span></>
    ),
    roadmapPrice: "$6,000",
    roadmapLine: (C) => (
      <>The business-owner engagement fee is $6,000, and it&rsquo;s included with a first 90-day sprint in the Partnership. <strong style={{ color: C.text2, fontWeight: 600 }}>Available separately at any time.</strong></>
    ),
    legendFirst: "Your working session",
    legendSecond: "Inside the Collective",
    step2: "A working session one to one, or the six courses inside the Collective at your own pace.",
    showPartnershipPrice: true,
  },
};

const ROADMAP_SHOTS = [
  { src: "/img/roadmap/roadmap-01-probability.jpg",          alt: "Retirement analysis comparing probability of success between a proposed plan and a current plan" },
  { src: "/img/roadmap/roadmap-02-scenario-comparison.jpg",  alt: "Scenario analysis charting invested assets for a proposed plan against a current plan over time" },
  { src: "/img/roadmap/roadmap-03-tax-estimate.jpg",         alt: "Effective tax rate projected by year, broken into federal, state, FICA and local" },
  { src: "/img/roadmap/roadmap-04-tax-strategy-summary.jpg", alt: "Tax strategy summary comparing tax-adjusted ending assets and federal taxes paid" },
  { src: "/img/roadmap/roadmap-05-tax-free-comparison.jpg",  alt: "Share of ending wealth that is tax free under a proposed strategy versus a reference strategy" },
  { src: "/img/roadmap/roadmap-06-asset-location.jpg",       alt: "Asset location across taxable, tax-deferred and tax-free accounts" },
];

const ROADMAP_DISCLOSURE = "For educational and informational purposes only. It is not intended to provide any tax or legal advice or provide the basis for any financial decisions. Nor is it intended to be a projection of current or future performance or indication of future results. The information provided is not based on actual current or past clients. All situations are unique, and results will differ depending on individual situation. All investing involves risk and you may lose money. Advisory services offered through Kriczky Wealth Management LLC, an Investment Advisor in the state of Pennsylvania and Virginia. Professionals are registered with Kriczky Wealth Management LLC.";


const Shield = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none"
    style={{ filter: "drop-shadow(0 0 12px rgba(200,162,78,0.38)) drop-shadow(0 0 4px rgba(200,162,78,0.56))" }}>
    <path d="M32 8L14 16V30C14 42 22 52 32 56C42 52 50 42 50 30V16L32 8Z"
      fill="none" stroke={C.gold} strokeWidth="2.5" strokeLinejoin="round" />
    <path d="M32 12L18 18.5V30C18 39.5 24 47.5 32 51C40 47.5 46 39.5 46 30V18.5L32 12Z"
      fill="none" stroke={C.gold} strokeWidth="1" opacity="0.4" strokeLinejoin="round" />
  </svg>
);

export default function GrowthHarvestPartnership({ variant = "workshop" }) {
  const V = VARIANTS[variant] || VARIANTS.workshop;
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 520);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const BODY = { fontFamily: "'DM Sans',sans-serif", fontSize: "clamp(15px,2.1vw,17px)", lineHeight: 1.7, color: C.text2, margin: "0 0 18px" };
  const H1 = { fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.015em", color: C.text1, margin: 0 };
  const H2 = { fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, lineHeight: 1.14, color: C.text1, margin: "0 0 18px", fontSize: "clamp(28px,5vw,42px)" };
  const KICKER = { fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: ".18em", textTransform: "uppercase", margin: "0 0 14px" };
  const wrap = { maxWidth: 940, margin: "0 auto", padding: "0 22px" };
  const col = { maxWidth: 720, margin: "0 auto", padding: "0 22px" };
  const card = {
    padding: "clamp(24px,4vw,38px)", borderRadius: 18,
    background: "linear-gradient(145deg, rgba(255,255,255,.045), rgba(255,255,255,.015))",
    border: `1px solid ${C.border2}`, borderTop: "1px solid rgba(255,255,255,.12)",
    boxShadow: "0 10px 40px rgba(0,0,0,.42)",
  };

  const Section = ({ children, style }) => (
    <section style={{ padding: "clamp(46px,7vw,74px) 0", position: "relative", zIndex: 2, ...style }}>{children}</section>
  );

  /* Numbered item used by the sprint and how-it-starts blocks, so the two
     read as the same system rather than two different list styles. */
  const Numbered = ({ n, title, children, last }) => (
    <div style={{ display: "flex", gap: 18, alignItems: "flex-start", padding: "16px 0", borderBottom: last ? "none" : `1px solid ${C.border1}` }}>
      <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 700, color: `${C.gold}66`, lineHeight: 1.1, minWidth: 40 }}>
        {String(n).padStart(2, "0")}
      </span>
      <div>
        <div style={{ fontSize: "clamp(16px,2.2vw,18px)", fontWeight: 700, color: C.text1, marginBottom: 5 }}>{title}</div>
        <div style={{ fontSize: "clamp(14px,2vw,15.5px)", lineHeight: 1.6, color: C.text2 }}>{children}</div>
      </div>
    </div>
  );


  /* Six stations on a path. Positions are percentages so the path SVG and the
     icons stay locked together at any width — the path uses a 0-100 viewBox with
     preserveAspectRatio="none" and a non-scaling stroke so it doesn't distort. */
  const STATIONS = [
    { x: 6,  y: 70, c: C.gold,  Icon: IcStartHere,    label: "Reinvest Or Harvest?",  up: false },
    { x: 23, y: 42, c: C.gold,  Icon: IcKnowNumbers,  label: "Know Your Numbers",     up: true  },
    { x: 40, y: 62, c: C.gold,  Icon: IcConstraint,   label: "Find The Constraint",   up: false },
    { x: 57, y: 34, c: C.green, Icon: IcProfitSplit,  label: "The Profit Split",      up: true  },
    { x: 74, y: 56, c: C.green, Icon: IcBuildOutside, label: "Build The Outside",     up: false },
    { x: 92, y: 24, c: C.cyan,  Icon: IcNorthStar,    label: "Your Wealth North Star", up: true },
  ];

  const RoadmapViz = () => (
    <div>
      <div className="pathbox" style={{ position: "relative", height: "clamp(320px,38vw,440px)", width: "100%" }}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}>
          <defs>
            <linearGradient id="rhPathGrad" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="100" y2="0">
              <stop offset="0" stopColor={C.gold} stopOpacity="0.25" />
              <stop offset="0.4" stopColor={C.gold} stopOpacity="0.8" />
              <stop offset="0.72" stopColor={C.green} stopOpacity="0.8" />
              <stop offset="1" stopColor={C.cyan} stopOpacity="0.9" />
            </linearGradient>
          </defs>
          <path d="M6,70 C13,70 16,42 23,42 C30,42 33,62 40,62 C47,62 50,34 57,34 C64,34 67,56 74,56 C81,56 85,24 92,24"
            fill="none" stroke="url(#rhPathGrad)" strokeWidth="2" strokeLinecap="round"
            strokeDasharray="1 7" vectorEffect="non-scaling-stroke" />
        </svg>

        {STATIONS.map((st, i) => (
          <div key={st.label} className="station" style={{
            position: "absolute", left: `${st.x}%`, top: `${st.y}%`, transform: "translate(-50%,-50%)",
            display: "flex", flexDirection: st.up ? "column-reverse" : "column",
            alignItems: "center", gap: 40, width: "clamp(96px,14vw,146px)",
            paddingTop: st.up ? 0 : 0, paddingBottom: st.up ? 0 : 0,
          }}>
            <st.Icon size={78} />
            <div className="stationtext" style={{ textAlign: "center", minHeight: 78 }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 36, lineHeight: 1, fontWeight: 700, color: `${st.c}99`, marginBottom: 6 }}>
                {String(i + 1).padStart(2, "0")}
              </div>
              <div style={{ fontSize: "clamp(11.5px,1.6vw,13.5px)", fontWeight: 600, lineHeight: 1.3, color: C.text2 }}>
                {st.label}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Orients the reader on the path rather than just describing it. */}
      <div className="stationmap" style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "clamp(14px,3vw,34px)", margin: "14px 0 0" }}>
        {[
          { when: V.legendFirst, what: "01 &ndash; 03", c: C.gold },
          { when: V.legendSecond, what: "04 &ndash; 05", c: C.green },
          { when: "The next 24 months", what: "All six, eight times", c: C.cyan },
        ].map(r => (
          <div key={r.when} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: C.text4, marginBottom: 5 }}>{r.when}</div>
            <div style={{ fontSize: "clamp(12.5px,1.8vw,14.5px)", fontWeight: 600, color: r.c }} dangerouslySetInnerHTML={{ __html: r.what }} />
          </div>
        ))}
      </div>
    </div>
  );

  /* Barbell with a label either side — same arrangement as the Collective slide,
     so the two properties read as one system. */
  const BarbellViz = () => (
    <div>
      <div style={{ ...KICKER, color: C.gold, textAlign: "center", marginBottom: 22 }}>The Owner&rsquo;s Wealth Barbell</div>
      {/* Both labels get flex:1 0 0 so the bar lands on the card's centre line
          rather than being pushed off by the longer label. */}
      <div className="barbellrow" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "clamp(12px,2.5vw,26px)" }}>
        <span style={{ flex: "1 0 0", fontSize: "clamp(12px,1.9vw,16px)", letterSpacing: ".13em", textTransform: "uppercase", fontWeight: 700, color: C.gold, textAlign: "right" }}>
          Into the company
        </span>
        <div style={{ flex: "0 0 auto", width: "clamp(130px,24vw,250px)", display: "flex", alignItems: "center" }}>
          <IcBarbell width="100%" />
        </div>
        <span style={{ flex: "1 0 0", fontSize: "clamp(12px,1.9vw,16px)", letterSpacing: ".13em", textTransform: "uppercase", fontWeight: 700, color: C.green, textAlign: "left" }}>
          Out to you
        </span>
      </div>
    </div>
  );


  /* Screenshot carousel. Cycles on its own until the reader takes over, then
     stops for good — someone stepping through deliberately shouldn't have the
     slide change under them. All frames are pre-padded to 16:9 so nothing is
     ever cropped or letterboxed. */
  const [shot, setShot] = useState(0);
  const [autoShots, setAutoShots] = useState(true);

  useEffect(() => {
    if (!autoShots) return;
    const t = setInterval(() => setShot(i => (i + 1) % ROADMAP_SHOTS.length), 5200);
    return () => clearInterval(t);
  }, [autoShots]);

  const stepShot = (dir) => {
    setAutoShots(false);
    setShot(i => (i + dir + ROADMAP_SHOTS.length) % ROADMAP_SHOTS.length);
  };

  const ShotArrow = ({ dir }) => (
    <button onClick={() => stepShot(dir)} aria-label={dir < 0 ? "Previous screen" : "Next screen"}
      className="shotarrow"
      style={{
        position: "absolute", top: "50%", transform: "translateY(-50%)",
        [dir < 0 ? "left" : "right"]: "clamp(6px,1.4vw,14px)",
        width: "clamp(34px,4.4vw,46px)", height: "clamp(34px,4.4vw,46px)", borderRadius: "50%",
        display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
        background: "rgba(10,14,20,.72)", border: `1px solid ${C.gold}66`, backdropFilter: "blur(6px)", padding: 0, zIndex: 3,
      }}>
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
        <path d={dir < 0 ? "M15 5L8 12L15 19" : "M9 5L16 12L9 19"} stroke={C.gold} strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );

  const RoadmapCarousel = () => (
    <div>
      <div style={{ position: "relative", borderRadius: 14, overflow: "hidden", border: `1px solid ${C.border2}`, background: "#fff", aspectRatio: "16/9" }}>
        {ROADMAP_SHOTS.map((s2, i) => (
          <img key={s2.src} src={s2.src} alt={s2.alt} loading={i === 0 ? "eager" : "lazy"}
            style={{
              position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain",
              opacity: i === shot ? 1 : 0, transition: "opacity .55s ease", display: "block",
            }} />
        ))}
        <ShotArrow dir={-1} />
        <ShotArrow dir={1} />
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 7, marginTop: 14 }}>
        {ROADMAP_SHOTS.map((s2, i) => (
          <button key={s2.src} onClick={() => { setAutoShots(false); setShot(i); }} aria-label={`Screen ${i + 1}`}
            style={{ width: i === shot ? 22 : 7, height: 7, borderRadius: 4, cursor: "pointer", padding: 0,
              border: "none", background: i === shot ? C.gold : C.text4, transition: "all .3s ease" }} />
        ))}
      </div>

      <p style={{ fontSize: "clamp(10px,1.4vw,11.5px)", lineHeight: 1.6, color: C.text4, margin: "18px 0 0", textAlign: "left" }}>
        {ROADMAP_DISCLOSURE}
      </p>
    </div>
  );

  const Check = ({ children }) => (
    <li style={{ display: "flex", gap: 13, alignItems: "flex-start", marginBottom: 13, fontSize: "clamp(14.5px,2vw,16px)", lineHeight: 1.6, color: C.text2 }}>
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 3 }}>
        <path d="M5 12.5L10 17.5L19 7" stroke={C.green} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>{children}</span>
    </li>
  );

  const Cross = ({ children }) => (
    <li style={{ display: "flex", gap: 13, alignItems: "flex-start", marginBottom: 13, fontSize: "clamp(14.5px,2vw,16px)", lineHeight: 1.6, color: C.red }}>
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 3 }}>
        <path d="M6 6L18 18M18 6L6 18" stroke={C.red} strokeWidth="2.2" strokeLinecap="round" />
      </svg>
      <span>{children}</span>
    </li>
  );

  const CTA = ({ label = V.ctaLabel, sub }) => (
    <div style={{ textAlign: "center" }}>
      <a href={V.ctaHref} className="cta" {...(V.ctaExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        style={{ display: "inline-block", padding: "20px 52px", borderRadius: 999, textDecoration: "none",
          background: `linear-gradient(135deg, ${C.gold}2e, ${C.gold}12)`, border: `1.5px solid ${C.gold}88`,
          boxShadow: `0 0 34px ${C.gold}26`, transition: "all .25s ease" }}>
        <span style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: "clamp(17px,2.6vw,24px)", letterSpacing: ".02em", color: C.gold, whiteSpace: "nowrap" }}>
          {label} <span style={{ marginLeft: 6 }}>&#8594;</span>
        </span>
      </a>
      {sub && <p style={{ fontSize: "clamp(13px,1.9vw,15px)", color: C.text3, margin: "16px 0 0", lineHeight: 1.5 }}>{sub}</p>}
    </div>
  );

  return (
    <div style={{ background: C.bgDeep, minHeight: "100vh", fontFamily: "'DM Sans',sans-serif", position: "relative", overflowX: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet" />

      <div style={{ position: "fixed", inset: 0, backgroundImage: GRAIN, backgroundSize: "128px 128px", opacity: .05, mixBlendMode: "overlay", pointerEvents: "none", zIndex: 1 }} />
      <div style={{ position: "fixed", top: "-14%", left: "50%", transform: "translateX(-50%)", width: "min(1100px,150vw)", height: 620,
        background: `radial-gradient(ellipse at center, ${C.gold}14 0%, transparent 66%)`, pointerEvents: "none", zIndex: 0 }} />

      {/* Sticky bar — appears once the offer is on screen, so the ask is never
          more than a thumb away on a long page. */}
      <div className="stickybar" style={{
        position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 60,
        transform: scrolled ? "translateY(0)" : "translateY(110%)",
        transition: "transform .32s cubic-bezier(.4,0,.2,1)",
        background: "rgba(10,14,20,.94)", backdropFilter: "blur(14px)",
        borderTop: `1px solid ${C.gold}33`, padding: "13px 20px",
      }}>
        <div style={{ maxWidth: 940, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          {/* Was "$3,000/month · no contract · first month refundable", which read
              as though clicking started a $3,000 subscription. It starts a free
              scorecard, and nothing is charged at any point on this path. */}
          <span className="stickytext" style={{ fontSize: "clamp(12.5px,1.9vw,15px)", color: C.text2, lineHeight: 1.4 }}>
            {V.stickyLine}<br className="stickybreak" />
            <span style={{ color: C.text3 }}> Nothing to pay, nothing to sign.</span>
          </span>
          <a href={V.ctaHref} className="cta" {...(V.ctaExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            style={{ flexShrink: 0, padding: "18px 34px", borderRadius: 999, textDecoration: "none",
              background: `linear-gradient(135deg, ${C.gold}2e, ${C.gold}12)`, border: `1.5px solid ${C.gold}88` }}>
            <span style={{ fontWeight: 700, fontSize: "clamp(13px,1.9vw,19px)", letterSpacing: ".02em", color: C.gold, whiteSpace: "nowrap" }}>{V.stickyLabel} &#8594;</span>
          </a>
        </div>
      </div>

      <div style={{ position: "relative", zIndex: 2 }}>

        {/* ── NAV ── */}
        <div style={{ ...wrap, paddingTop: 30, paddingBottom: 6, display: "flex", justifyContent: "center", alignItems: "center", gap: 12 }}>
          <Shield size={30} />
          <span style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 21, letterSpacing: ".14em", color: C.text1 }}>
            KRICZKY <span style={{ color: C.goldMuted }}>VIRTUS</span>
          </span>
        </div>

        {/* ── HERO ── */}
        <Section style={{ paddingTop: "clamp(30px,5vw,50px)", paddingBottom: "clamp(30px,4vw,44px)", textAlign: "center" }}>
          <div style={wrap}>
            <div style={{ ...KICKER, color: C.gold }}>The Partnership</div>
            <h1 style={{ ...H1, fontSize: "clamp(34px,7vw,64px)", maxWidth: 860, margin: "0 auto", textWrap: "balance" }}>
              Growth &amp; Harvest <span style={{ color: C.gold, fontStyle: "italic", fontWeight: 400 }}>Partnership</span>
            </h1>
            <p style={{ fontSize: "clamp(16px,2.8vw,23px)", lineHeight: 1.5, color: C.text2, maxWidth: 740, margin: "24px auto 0", textWrap: "balance" }}>
              Eight 90-day sprints over 24 months, working both sides of the same decision &mdash; what the business needs, and what you need.
            </p>
            <p style={{ fontSize: "clamp(13.5px,2vw,16px)", lineHeight: 1.6, color: C.text3, maxWidth: 640, margin: "18px auto 0", textWrap: "balance" }}>
              For owners doing $1M&ndash;$10M a year who want a clear answer to &ldquo;how much stays in the business vs comes out to me&rdquo; and hands-on help executing it as the constraint moves.
            </p>
          </div>
        </Section>

        {/* ── VISUALS ── */}
        <Section style={{ paddingTop: 0, paddingBottom: "clamp(30px,4vw,44px)" }}>
          <div style={wrap}>
            <div style={{ ...card, marginBottom: 18 }}>
              <div style={{ ...KICKER, color: C.gold, textAlign: "center", marginBottom: 6 }}>The Owner&rsquo;s Virtus Roadmap</div>
              <p style={{ fontSize: "clamp(14px,2.1vw,17px)", lineHeight: 1.6, color: C.text2, textAlign: "center", maxWidth: 620, margin: "0 auto 18px", textWrap: "balance" }}>
                Six stations. Each one impacts and affects the others.
              </p>
              <RoadmapViz />
            </div>
            {/* ⚠️ SWAP TARGET — Edward's rendered barbell image replaces this card's
                contents 1:1. Keep the card wrapper; drop the image inside at 16:9. */}
            <div style={{ ...card, display: "flex", alignItems: "center" }}>
              <div style={{ width: "100%" }}><BarbellViz /></div>
            </div>
          </div>
        </Section>

        {/* ── FIT ── */}
        <Section style={{ paddingTop: 0 }}>
          <div style={wrap}>
            <div className="fitgrid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
              <div style={card}>
                <div style={{ ...KICKER, color: C.green }}>This is for you if</div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  <Check>You&rsquo;re profitable but you can&rsquo;t say what last year&rsquo;s reinvestment actually returned.</Check>
                  <Check>Your advisors each do one thing well and nobody is connecting them.</Check>
                  <Check>You want the business decision and the wealth decision made by the same person, working from the same numbers.</Check>
                  <Check>You&rsquo;re willing to work in 90-day increments instead of waiting for a perfect annual plan.</Check>
                </ul>
              </div>
              <div style={{ ...card, background: "linear-gradient(145deg, rgba(255,255,255,.025), rgba(255,255,255,.008))" }}>
                <div style={{ ...KICKER, color: C.red }}>It isn&rsquo;t if</div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  <Cross>You want someone to hand you a plan and leave.</Cross>
                  <Cross>You aren&rsquo;t willing to share real numbers.</Cross>
                  <Cross>You&rsquo;re content with the business and your personal position staying roughly where they are.</Cross>
                </ul>
              </div>
            </div>
          </div>
        </Section>

        {/* ── WHAT IT IS ── */}
        <Section style={{ paddingTop: 0 }}>
          <div style={col}>
            <div style={{ ...KICKER, color: C.gold, textAlign: "center" }}>What it is</div>
            <h2 style={{ ...H2, textAlign: "center" }}>Improvements don&rsquo;t happen on a switch.</h2>
            <p style={{ ...BODY, textAlign: "center", maxWidth: 620, margin: "0 auto 14px" }}>
              So the work is structured as a 24-month roadmap, delivered in eight 90-day sprints. Each sprint takes one lever inside the business and one outside it, works it, and measures it before moving on.
            </p>
            <p style={{ ...BODY, textAlign: "center", maxWidth: 620, margin: "0 auto", color: C.text1, fontWeight: 600 }}>
              Billed month to month. No contract.
            </p>
          </div>
        </Section>

        {/* ── WHAT WE WORK ON ── */}
        <Section style={{ paddingTop: 0 }}>
          <div style={wrap}>
            <div className="workgrid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>
              <div style={card}>
                <div style={{ ...KICKER, color: C.gold }}>Inside the business</div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  <Check>Where a reinvested dollar earns most in your specific business.</Check>
                  <Check>The one constraint capping what your current growth produces.</Check>
                  <Check>Margin and cash position measured against where they should be.</Check>
                  <Check>A 90-day plan each sprint with one primary focus, not ten.</Check>
                </ul>
              </div>
              <div style={card}>
                <div style={{ ...KICKER, color: C.green }}>Outside the business</div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  <Check>What you take out, on what schedule, and where it goes after it leaves.</Check>
                  <Check>Reserves and liquidity held outside the company.</Check>
                  <Check>Tax coordination with your CPA &mdash; we don&rsquo;t replace them, we make sure the plan and the return agree.</Check>
                  <Check>A written destination, specific enough to make decisions against.</Check>
                </ul>
              </div>
            </div>
            <div style={{ ...card, textAlign: "center" }}>
              <div style={{ ...KICKER, color: C.cyan, marginBottom: 16 }}>How it runs</div>
              <p style={{ ...BODY, margin: 0, maxWidth: 620, marginLeft: "auto", marginRight: "auto" }}>
                Monthly working sessions. Support between them on decisions that can&rsquo;t wait. Coordination with your CPA and attorney so everyone is working from the same plan.
              </p>
            </div>
          </div>
        </Section>

        {/* ── PRICE + GUARANTEE ── */}
        <Section style={{ paddingTop: 0 }}>
          <div style={col}>
            <div style={{ ...card, textAlign: "center", border: `1px solid ${C.gold}3d`, boxShadow: `0 10px 44px rgba(0,0,0,.45), 0 0 50px ${C.gold}0f` }}>
              <div style={{ ...KICKER, color: C.gold }}>Clarity Partner &middot; what it costs</div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: "clamp(46px,9vw,76px)", color: C.text1, lineHeight: 1 }}>
                {PRICE}<span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "clamp(16px,2.4vw,21px)", fontWeight: 500, color: C.text3 }}> / month</span>
              </div>
              <p style={{ fontSize: "clamp(14.5px,2.1vw,17px)", color: C.text2, margin: "18px 0 0", lineHeight: 1.6 }}>
                No contract. No minimum term. No cancellation fee.<br />
                If it stops being worth it, you stop.
              </p>

              <div style={{ margin: "30px auto 0", maxWidth: 540, padding: "24px 22px", borderRadius: 14, background: `${C.green}0d`, border: `1px solid ${C.green}3d` }}>
                <div style={{ ...KICKER, color: C.green, marginBottom: 12 }}>30 days, no risk</div>
                <p style={{ fontSize: "clamp(14.5px,2.1vw,16.5px)", lineHeight: 1.65, color: C.text1, margin: 0 }}>
                  Work with me for the first month. If you don&rsquo;t believe this is going to pay for itself, tell me and I&rsquo;ll refund the month in full. <strong style={{ color: C.green, fontWeight: 700 }}>You keep everything we&rsquo;ve built together.</strong>
                </p>
                <p style={{ fontSize: "clamp(12.5px,1.8vw,14px)", lineHeight: 1.6, color: C.text3, margin: "14px 0 0" }}>
                  To be eligible: attend the sessions we schedule, and give us the financial information we ask for. We can&rsquo;t tell whether this works for you if we haven&rsquo;t done the work.
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* ── WEALTH SIDE — deliberately separated. Different entity, optional,
             and a business owner reading about their growth constraint shouldn't
             hit an AUM fee table mid-thought. ── */}
        <Section style={{ paddingTop: 0 }}>
          <div style={col}>
            <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${C.border2}, transparent)`, marginBottom: "clamp(34px,5vw,52px)" }} />
            <div style={{ ...KICKER, color: C.green, textAlign: "center" }}>Optional &middot; separate firm</div>
            <h2 style={{ ...H2, textAlign: "center", fontSize: "clamp(25px,4.4vw,36px)" }}>The wealth side</h2>
            {/* balance stops "it." landing alone on a fourth line */}
            <p style={{ ...BODY, textAlign: "center", maxWidth: 680, margin: "0 auto 26px", textWrap: "balance" }}>
              Most owners eventually want the personal side executed, not just planned. That runs through <strong style={{ color: C.text1, fontWeight: 600 }}>Kriczky Wealth Management LLC</strong>, a separate registered investment advisor. It is entirely optional &mdash; the Partnership doesn&rsquo;t depend on it.
            </p>

            <div style={{ ...card, marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 14, flexWrap: "wrap", marginBottom: 10 }}>
                <span style={{ fontSize: "clamp(16px,2.3vw,19px)", fontWeight: 700, color: C.text1 }}>Personalized Wealth Roadmap</span>
                <span style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                  {V.roadmapPrice === "Included" && (
                    <span style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(18px,2.6vw,23px)", fontWeight: 700, color: C.gold, opacity: .62, textDecoration: "line-through", textDecorationThickness: "2px" }}>{ROADMAP_FEE}</span>
                  )}
                  <span style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(19px,2.8vw,24px)", fontWeight: 700, color: V.roadmapPrice === "Included" ? C.green : C.gold }}>{V.roadmapPrice}</span>
                </span>
              </div>
              <p style={{ fontSize: "clamp(14px,2vw,15.5px)", lineHeight: 1.65, color: C.text2, margin: 0 }}>
                Not a document you file. It&rsquo;s a scenario-modelling system &mdash; pressure-test a decision, compare two paths side by side, and see what each one does to long-term growth, tax efficiency, and how soon the money outside the business could carry you.
              </p>
              <p style={{ fontSize: "clamp(14px,2vw,15.5px)", lineHeight: 1.65, color: C.text2, margin: "12px 0 0" }}>
                {V.roadmapLine(C)}
              </p>
              <div style={{ marginTop: 22 }}><RoadmapCarousel /></div>
            </div>

            <div style={card}>
              <div style={{ fontSize: "clamp(16px,2.3vw,19px)", fontWeight: 700, color: C.text1, marginBottom: 6 }}>Investment Management</div>
              <p style={{ fontSize: "clamp(14px,2vw,15.5px)", lineHeight: 1.65, color: C.text2, margin: "0 0 18px" }}>
                If you&rsquo;d like them to manage assets, their standard schedule is tiered &mdash; each rate applies to that portion of the balance:
              </p>
              {AUM_TIERS.map((t, i) => (
                <div key={t.band} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "11px 0", borderBottom: i < AUM_TIERS.length - 1 ? `1px solid ${C.border1}` : "none" }}>
                  <span style={{ fontSize: "clamp(13.5px,1.9vw,15.5px)", color: C.text2 }}>{t.band}</span>
                  <span style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(16px,2.2vw,20px)", fontWeight: 700, color: C.text1 }}>{t.fee}</span>
                </div>
              ))}

              {/* The Partnership rate. Permanent once earned — it doesn't revert
                  if the Partnership ends, which keeps it a reward for becoming a
                  client rather than a penalty for leaving. */}
              <div style={{ marginTop: 22, padding: "22px 20px", borderRadius: 13, background: `${C.green}0d`, border: `1px solid ${C.green}3d` }}>
                <div style={{ ...KICKER, color: C.green, marginBottom: 10 }}>Clarity Partner clients</div>
                <p style={{ fontSize: "clamp(14.5px,2.1vw,16.5px)", lineHeight: 1.6, color: C.text1, margin: 0 }}>
                  A flat <strong style={{ color: C.green, fontWeight: 700 }}>{PARTNER_RATE}</strong> on the first $20,000,000, and <strong style={{ color: C.green, fontWeight: 700 }}>{PARTNER_RATE_ABOVE}</strong> above that.
                </p>
                <p style={{ fontSize: "clamp(13px,1.9vw,14.5px)", lineHeight: 1.6, color: C.text2, margin: "12px 0 0" }}>
                  Earned once and kept &mdash; the rate stays yours whether or not the Partnership continues.
                </p>

                {/* The minimum does real work. Most owners at this stage don't have
                    $1M liquid yet, so there's nothing to pay and nothing to decide —
                    it reads as a benefit waiting rather than a second bill. */}
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${C.green}26` }}>
                  <p style={{ fontSize: "clamp(13.5px,1.9vw,15px)", lineHeight: 1.6, color: C.text2, margin: 0 }}>
                    They begin managing assets at <strong style={{ color: C.text1, fontWeight: 600 }}>$1,000,000</strong>. Below that there&rsquo;s nothing to pay and nothing to decide &mdash; the rate is simply waiting for you when you get there.
                  </p>
                </div>
              </div>

              <p style={{ fontSize: "clamp(13px,1.9vw,14.5px)", lineHeight: 1.6, color: C.text3, margin: "18px 0 0" }}>
                Fees are negotiable, and larger or more complex relationships may qualify for lower percentage fees. This rate is available to Clarity Partner clients today; they may limit it to higher service tiers in future.
              </p>
            </div>
          </div>
        </Section>

        {/* ── HOW IT STARTS ── */}
        <Section style={{ paddingTop: 0 }}>
          <div style={col}>
            <div style={{ ...KICKER, color: C.gold, textAlign: "center" }}>How it starts</div>
            <h2 style={{ ...H2, textAlign: "center", fontSize: "clamp(25px,4.4vw,36px)" }}>Three steps. The first two are free.</h2>
            <div style={card}>
              <Numbered n={1} title="Reinvest or Harvest Scorecard">
                Twenty questions, about seven minutes. Two scores, your position, and three moves based on how you actually answered. If you&rsquo;re reading this, you&rsquo;ve most likely done it already.
              </Numbered>
              <Numbered n={2} title="Workshop or working session">
                {V.step2}
              </Numbered>
              <Numbered n={3} title="If it makes sense, we start" last>
                The first sprint begins, and the first month is refundable. If it doesn&rsquo;t make sense, you keep the plan.
              </Numbered>
            </div>
          </div>
        </Section>

        {/* ── CTA ── */}
        <Section style={{ paddingTop: 0 }}>
          <div style={col}>
            <CTA sub={V.ctaSub(C)} />
          </div>
        </Section>

        {/* ── DISCLOSURE ── */}
        {/* 150px so the disclosure is fully readable above the floating bar,
              which is ~92px tall with its padding. */}
        <div style={{ ...wrap, paddingTop: 10, paddingBottom: 150 }}>
          <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${C.border1}, transparent)`, marginBottom: 26 }} />
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 9, marginBottom: 16 }}>
            <Shield size={17} />
            <span style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 14, letterSpacing: ".14em", color: C.text3 }}>
              KRICZKY <span style={{ color: C.text4 }}>VIRTUS</span>
            </span>
          </div>
          <p style={{ fontSize: 11.5, lineHeight: 1.65, color: C.text4, textAlign: "center", maxWidth: 780, margin: "0 auto" }}>
            Business advisory services are provided by Kriczky Virtus, LLC. Investment advisory services are provided by Kriczky Wealth Management LLC, a registered investment advisor. Edward Kriczky owns both firms, which is a conflict of interest disclosed in Form ADV. You are never required to engage either firm to work with the other, and you may use any business consultant or investment advisor you choose. Form ADV is provided before any investment advisory agreement is signed. Nothing on this page is individualized financial, tax, legal, or accounting advice, or a recommendation to pursue any particular course of action. No outcome is projected or guaranteed. Coordinate any decision with your CPA, attorney, and other advisors before acting.
          </p>
        </div>
      </div>

      <style>{`
        .cta:hover { box-shadow: 0 0 48px ${C.gold}33, 0 8px 22px rgba(0,0,0,.45) !important; border-color: ${C.gold}99 !important; transform: translateY(-1px); }
        .cta { transition: all .25s ease; }
        .shotarrow { transition: all .2s ease; }
        .shotarrow:hover { background: rgba(10,14,20,.9) !important; border-color: ${C.gold} !important; transform: translateY(-50%) scale(1.07); }
        @media (max-width: 880px) {
          .fitgrid, .workgrid, .vizgrid { grid-template-columns: 1fr !important; }
          .barbellrow { flex-direction: column !important; gap: 14px !important; }
          .barbellrow span { text-align: center !important; }
        }
        /* Six stations need ~550px to sit side by side. Below that the labels
           collide, so the path becomes a vertical list instead. */
        @media (max-width: 700px) {
          .pathbox { height: auto !important; display: flex; flex-direction: column; gap: 4px; padding-left: 4px; }
          .pathbox > svg { display: none; }
          .station { position: static !important; transform: none !important;
            flex-direction: row !important; width: 100% !important; align-items: center !important;
            gap: 16px !important; padding: 10px 0 10px 16px !important;
            border-left: 1px solid rgba(255,255,255,.07); }
          .station .stationtext { min-height: 0 !important; }
          .station:first-of-type { border-left-color: transparent; }
          .stationtext { text-align: left !important; }
          .stationtext > div:first-child { display: inline-block; margin-right: 8px; }
          .stationtext > div:last-child { display: inline; }
        }
        @media (max-width: 520px) {
          .stickytext { font-size: 12.5px !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .cta:hover { transform: none; }
          .stickybar { transition: none !important; }
        }
      `}</style>
    </div>
  );
}
