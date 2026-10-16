/* The Owner's Wealth Barbell, metallic (dark-ground recipe) - the same mark as
   the workshop page and the workbook cover. Gold plates left (Reinvest), green
   plates right (Harvest). Gradient/filter ids carry an "rh" suffix so this can sit
   on a page beside the workshop's copy without the ids colliding. */
const BarbellMark = ({ width = "100%", style }) => (
  <svg viewBox="-210 -105 420 210" style={{ width, height: "auto", overflow: "visible", display: "block", ...style }} aria-hidden="true"><><defs>
    <clipPath id="clipLxrhbb"><rect x="-210" y="-210" width="210" height="420"/></clipPath>
    <clipPath id="clipRxrhbb"><rect x="0" y="-210" width="210" height="420"/></clipPath>
  </defs>
  <g clipPath="url(#clipLxrhbb)">
<defs>
  <linearGradient id="metalxrhbbL" gradientUnits="userSpaceOnUse" x1="0" y1="-68" x2="0" y2="68"><stop offset="0%" stopColor="#F8ECC4"/><stop offset="14%" stopColor="#DFC177"/><stop offset="28%" stopColor="#C8A24E"/><stop offset="42%" stopColor="#5A4419"/><stop offset="50%" stopColor="#F8ECC4"/><stop offset="64%" stopColor="#C8A24E"/><stop offset="80%" stopColor="#8A6C2A"/><stop offset="100%" stopColor="#5A4419"/></linearGradient>
  <filter id="softxrhbbL" x="-60%" y="-60%" width="220%" height="220%">
    <feGaussianBlur stdDeviation="2.50"/>
  </filter>
  <filter id="liftxrhbbL" x="-70%" y="-70%" width="240%" height="240%">
    <feDropShadow dx="0" dy="6.0" stdDeviation="9.0" floodColor="#000" floodOpacity="0.55"/>
    <feDropShadow dx="0" dy="0" stdDeviation="16.0" floodColor="#C8A24E" floodOpacity="0.38"/>
  </filter>
  <radialGradient id="ambxrhbbL">
    <stop offset="0%" stopColor="#C8A24E" stopOpacity="0.16"/>
    <stop offset="100%" stopColor="#C8A24E" stopOpacity="0"/>
  </radialGradient>
</defs>


<g fill="none" stroke="#000" strokeOpacity="0.55" strokeWidth="28.00"
   strokeLinecap="round" strokeLinejoin="round"
   transform="translate(0,7.0)" filter="url(#softxrhbbL)"><path d="M-118 0 L118 0"/><path d="M-102 -68 L-102 68"/><path d="M-150 -46 L-150 46"/><path d="M102 -68 L102 68"/><path d="M150 -46 L150 46"/></g>

<g fill="none" stroke="url(#metalxrhbbL)" strokeWidth="22.00"
   strokeLinecap="round" strokeLinejoin="round" filter="url(#liftxrhbbL)"><path d="M-118 0 L118 0"/><path d="M-102 -68 L-102 68"/><path d="M-150 -46 L-150 46"/><path d="M102 -68 L102 68"/><path d="M150 -46 L150 46"/></g>

<g fill="none" stroke="#FFFDF5" strokeOpacity="0.55" strokeWidth="5.00"
   strokeLinecap="round" strokeLinejoin="round"
   transform="translate(0,-5.0)"><path d="M-118 0 L118 0"/><path d="M-102 -68 L-102 68"/><path d="M-150 -46 L-150 46"/><path d="M102 -68 L102 68"/><path d="M150 -46 L150 46"/></g>
</g>
  <g clipPath="url(#clipRxrhbb)">
<defs>
  <linearGradient id="metalxrhbbR" gradientUnits="userSpaceOnUse" x1="0" y1="-68" x2="0" y2="68"><stop offset="0%" stopColor="#D8FCEE"/><stop offset="14%" stopColor="#7CE7BF"/><stop offset="28%" stopColor="#34D399"/><stop offset="42%" stopColor="#0F5C42"/><stop offset="50%" stopColor="#EAFFF7"/><stop offset="64%" stopColor="#34D399"/><stop offset="80%" stopColor="#1B8A63"/><stop offset="100%" stopColor="#0F5C42"/></linearGradient>
  <filter id="softxrhbbR" x="-60%" y="-60%" width="220%" height="220%">
    <feGaussianBlur stdDeviation="2.50"/>
  </filter>
  <filter id="liftxrhbbR" x="-70%" y="-70%" width="240%" height="240%">
    <feDropShadow dx="0" dy="6.0" stdDeviation="9.0" floodColor="#000" floodOpacity="0.55"/>
    <feDropShadow dx="0" dy="0" stdDeviation="16.0" floodColor="#34D399" floodOpacity="0.38"/>
  </filter>
  <radialGradient id="ambxrhbbR">
    <stop offset="0%" stopColor="#34D399" stopOpacity="0.16"/>
    <stop offset="100%" stopColor="#34D399" stopOpacity="0"/>
  </radialGradient>
</defs>


<g fill="none" stroke="#000" strokeOpacity="0.55" strokeWidth="28.00"
   strokeLinecap="round" strokeLinejoin="round"
   transform="translate(0,7.0)" filter="url(#softxrhbbR)"><path d="M-118 0 L118 0"/><path d="M-102 -68 L-102 68"/><path d="M-150 -46 L-150 46"/><path d="M102 -68 L102 68"/><path d="M150 -46 L150 46"/></g>

<g fill="none" stroke="url(#metalxrhbbR)" strokeWidth="22.00"
   strokeLinecap="round" strokeLinejoin="round" filter="url(#liftxrhbbR)"><path d="M-118 0 L118 0"/><path d="M-102 -68 L-102 68"/><path d="M-150 -46 L-150 46"/><path d="M102 -68 L102 68"/><path d="M150 -46 L150 46"/></g>

<g fill="none" stroke="#FFFDF5" strokeOpacity="0.55" strokeWidth="5.00"
   strokeLinecap="round" strokeLinejoin="round"
   transform="translate(0,-5.0)"><path d="M-118 0 L118 0"/><path d="M-102 -68 L-102 68"/><path d="M-150 -46 L-150 46"/><path d="M102 -68 L102 68"/><path d="M150 -46 L150 46"/></g>
</g></></svg>
);

export default BarbellMark;
