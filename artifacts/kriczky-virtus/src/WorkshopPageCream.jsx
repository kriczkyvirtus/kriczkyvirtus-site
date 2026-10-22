import { useState, useEffect, useRef } from "react";
import RoadmapSystem from "./RoadmapSystem";
import WorkshopDates, { useWorkshopCounts } from "./WorkshopDates.jsx";
import { WORKSHOPS } from "./workshopEvents.js";
/* Icons are the Virtus metallic set - three-pass SVGs from the icon recipe,
   served as files. They carry their own gradients, filters and glow, so they
   are referenced as <img> rather than inlined: inlining several would collide
   their gradient IDs. No icon library is needed. */
const ICON = (slug) => `/img/icons/${slug}-light.svg`;

/* The live workshop page (cream since 14 Oct 2026). WorkshopPage.jsx is the
   retired dark version, kept at /workshop-rh/dark for rollback only.

   Reinvest or Harvest Workshop - /workshop-rh
   Cold-traffic build: problem → framework → what you leave with → authority →
   client stories → proof → fit → FAQ → deposit → form.
   Sections alternate left / centre / right rather than stacking centred.

   Flow: dates cards → form → /api/lead-capture (tag 90, field 17 Workshop ID)
   → Stripe deposit (client_reference_id "workshop-<id>") → Stripe Zap applies
   tag 91 + workshop-<id>-seat and writes Workshop Date (field 14), which starts
   the emails.
   Other paths from the same form (no Stripe):
     ?seat=<code>  existing clients - no deposit; the server checks the code
                   (WORKSHOP_CLIENT_CODE) and applies 90, 91, 101 + the seat tag
     priority      a quarter with no date yet - workshop-<id>-priority
     waitlist      a full date - workshop-<id>-waitlist
   Dates and counts: workshopEvents.js, WorkshopDates.jsx, /api/workshop-seats. */

const EVENT = {
  date: WORKSHOPS[0].long,            /* the next dated workshop - see workshopEvents.js */
  time: "Noon – 5:00 PM",
  /* Set venueConfirmed once the venue is booked; until then the page shows the town. */
  venueConfirmed: false,
  area: "West Chester, PA",
  venueLine1: "430 Hannum Ave",
  venueLine2: "West Chester, PA 19380",
  mapUrl: "https://www.google.com/maps/dir/?api=1&destination=430%20Hannum%20Ave%2C%20West%20Chester%2C%20PA%2019380%2C%20USA",
  seats: 20,
  fullPrice: "$2,000",
};
const DEPOSIT_URL = "https://book.stripe.com/5kQ3cvg3l8Pv9QH2bIcEw08";

/* ⚠️ PLACEHOLDER TESTIMONIALS - replace with real ones. Structure only.
   `connection` is required on every entry: attendees receive a workshop priced
   at $2,000 and a $6,000 Wealth Roadmap for nothing, which is a material
   connection a reader should know about. Business side only - nothing touching
   investments, wealth or returns. Set to [] to hide the section entirely. */
const TESTIMONIALS = [];
/* When real ones arrive, each entry is:
   { quote: "…", name: "…", company: "…", industry: "…",
     connection: "Attended at no charge." }              ← required on every entry
   The section renders itself as soon as this array has anything in it. */

const REVENUE = ["Under $500K", "$500K – $1M", "$1M – $3M", "$3M – $10M", "$10M+"];
const OUTCOMES = ["Add two to five points of profit",
                  "Build three to six months of cash runway",
                  "Take more out personally without stalling growth",
                  "Get clean numbers and a simple finance system",
                  "Reinvest tactically back into the business to make sustainable growth more likely"];
/* Values must match the ActiveCampaign field options exactly (em dash included);
   the dropdown shows them with a plain hyphen. */
const APPETITE = ["Strong", "Depends on the plan", "None — I'll run it myself"];

/* Cream tokens - the reports' and workbooks' light theme (theme_light.py).
   Accents are the deeper "ink" versions so text stays readable on cream;
   goldFill is the bright gold, for glows and the dark buttons. */
const C = {
  bgDeep: "#F2EEE6", gold: "#7A5C1E", goldMuted: "#9A7A34", goldFill: "#C8A24E",
  green: "#1B7A57", cyan: "#0E7490", red: "#B4403F",
  text1: "#0A0E14", text2: "#3E4652", text3: "#6B6459", text4: "#8C8476",
  border1: "#E6DFD2", border2: "#DCD4C5",
};
const DARK_BTN = "linear-gradient(160deg,#141B26 0%,#0A0E14 72%)";

/* Engine-turned (guilloché) lattice - the engraving on banknotes and watch
   dials. Rings centred on every corner and the middle of a 56px tile interlock
   into a seamless rosette field. One cut faint for the page, one in gold that
   the cursor lamp brings up. */
const guilloche = (stroke, op, w) => {
  const ring = (cx, cy) => [28, 19, 10].map(r => `<circle cx='${cx}' cy='${cy}' r='${r}'/>`).join("");
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='56' height='56' viewBox='0 0 56 56'><g fill='none' stroke='${stroke}' stroke-opacity='${op}' stroke-width='${w}'>${ring(0,0)}${ring(56,0)}${ring(0,56)}${ring(56,56)}${ring(28,28)}</g></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
};
const TEX_FAINT = guilloche("#8C7650", 0.065, 0.7);
const TEX_GOLD = guilloche("#B08A3A", 0.5, 0.9);
/* The dark "splash" cards (the barbell, the afternoon's roadmap) carry the
   workbook covers' engraving: gold lattice, faint, on the dark gradient. */
const TEX_DARK = guilloche("#C8A24E", 0.13, 0.7);
const DARK_CARD = { position: "relative", borderRadius: 22, overflow: "hidden", border: "1px solid #2A2213",
  background: `radial-gradient(ellipse 70% 60% at 50% 40%, rgba(200,162,78,.14), transparent 70%), ${TEX_DARK}, linear-gradient(160deg,#141B26 0%,#0A0E14 72%)`,
  boxShadow: "0 0 0 1px rgba(200,162,78,.08) inset, 0 24px 50px rgba(10,14,20,.28), 0 0 40px rgba(200,162,78,.12)" };

/* The logo shield, drawn large and faint behind a section. */
const ShieldMark = ({ side = "right", size = 560, top = "50%" }) => (
  <svg aria-hidden="true" className="shieldmark" viewBox="0 0 64 64" fill="none" width={size} height={size}
    style={{ position: "absolute", top, [side]: `calc(50% - ${size / 2}px - min(46vw, 640px))`, transform: "translateY(-50%)", pointerEvents: "none", zIndex: 0 }}>
    <path d="M32 8L14 16V30C14 42 22 52 32 56C42 52 50 42 50 30V16L32 8Z" stroke="#B08A3A" strokeOpacity=".16" strokeWidth=".55" strokeLinejoin="round" />
    <path d="M32 12L18 18.5V30C18 39.5 24 47.5 32 51C40 47.5 46 39.5 46 30V18.5L32 12Z" stroke="#B08A3A" strokeOpacity=".1" strokeWidth=".3" strokeLinejoin="round" />
  </svg>
);
const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

/* Each stage carries what sits underneath it - shown on the back of the card. */
const STAGES = [
  { n: "1", name: "Qualified Leads", c: C.gold, icon: "stage-leads",
    what: "Not enough of the right customers.",
    tell: "Capacity sits idle, or you take work you shouldn’t.",
    sub: ["Improving your offer", "Spending more on ads", "Fixing ad targeting"],
    mines: ["Acquisition channel dependency", "Client concentration", "Growing into customers you don’t want"] },
  { n: "2", name: "Capacity to Sell", c: C.green, icon: "stage-sell",
    what: "Leads arrive faster than you can convert them.",
    tell: "Good leads go cold waiting for a reply or a proposal.",
    sub: ["Hiring the right sales role", "Talent compensation structure", "A sales motion that’s easy to buy from"],
    mines: ["Revenue that grows only through you", "Sales comp crushing margins", "No recurring revenue offer"] },
  { n: "3", name: "Capacity to Fulfill", c: C.cyan, icon: "stage-fulfill",
    what: "You can’t fulfill more without breaking.",
    tell: "Quality slips or lead times grow as volume rises.",
    sub: ["Equipping your team with better tools", "Workflow automation", "Margin structure"],
    mines: ["Revenue up, margins suppressed", "Cutting costs until top people leave", "Vendor dependency"] },
];

const LEAVE_WITH = [
  ["Stations 01 to 03, done", "Reinvest or Harvest, Know Your Numbers, and Find The Constraint - worked on your numbers, not in theory."],
  ["Your 90-day sprint", "Three moves, the weekly signal that tells you each one is working, and what you do before Friday."],
  ["Your workbook and Sprint Ledger", "A workbook printed with your name on the cover, and the Ledger you bring back every quarter."],
  ["Your Personalized Wealth Roadmap", "A personal wealth tactical playbook through Kriczky Wealth Management LLC. Owners normally pay $6,000. Included for everyone who attends."],
];

/* What each slide shows, matched to the cream workbooks: page 2's roadmap orbit,
   the sprint page, the two books, and the six Wealth Roadmap screens. */
const SLIDES = [
  { kind: "page",  src: "/img/workshop/page-roadmap.jpg", cap: "Stations 01 to 03, done" },
  { kind: "page",  src: "/img/workshop/page-sprint.jpg",  cap: "Your 90-day sprint" },
  { kind: "image", src: "/img/workshop/books-cream.webp", cap: "Your workbook and Sprint Ledger" },
  { kind: "grid",  src: [1, 2, 3, 4, 5, 6].map(n => `/img/workshop/wealth-0${n}.jpg`), cap: "Your Personalized Wealth Roadmap" },
];

const AGENDA = [
  ["12:00", "Lunch - provided"],
  ["1:00", "Where your next dollar of profit actually goes"],
  ["1:30", "Your two scores, and the direction they’re heading"],
  ["2:10", "Your three gaps and your value drivers"],
  ["2:55", "The one stage capping everything else"],
  ["3:35", "Your vision, and the “One Thing” that decides next year"],
  ["4:05", "Your 90-day plan, and the first move this week"],
  ["5:00", "Happy hour - food and drinks provided"],
];

/* One mark per niche. */
const INDUSTRIES = [
  ["Landscaping", "landscaping"], ["Residential Remodeling", "remodeling"],
  ["Manufacturing", "manufacturing"], ["Auto Repair", "auto-repair"],
  ["Physical Therapy", "physical-therapy"], ["B2B SaaS", "saas"],
  ["Accounting", "accounting"], ["Marketing Agency", "marketing"],
];
const INDUSTRY_ICON = Object.fromEntries(INDUSTRIES);

/* Broader categories, for the scrolling banner and the fit FAQ. */
const SECTORS = [
  ["Home Services", "home-services"], ["Manufacturing", "manufacturing"],
  ["In-Person Medical Practices", "medical"], ["Ecommerce", "ecommerce"],
  ["Local Services", "local-services"], ["Professional Services", "professional-services"],
  ["B2B SaaS", "saas"], ["Financial Services", "financial-services"],
  ["Marketing Agencies", "marketing"], ["Education", "education"],
];
const TIERS = ["Under $500K", "$500K–$1M", "$1M–$3M", "$3M–$10M", "$10M–$50M"];

const STORIES = [
  {
    kicker: "They thought Sales was their constraint",
    industry: "Landscaping",
    thought: "Stage 2 · Capacity to Sell",
    actual: "1",
    open: "A landscaping company came to me and the two owners were convinced that the problem in the business was that they needed to hire in 1 or 2 people that could run sales so that the 2 owners could grow the revenue for the business.",
    diagnosis: "But after we dug into the details in their business, the actual constraint was Stage 1 - Qualified Leads, and more specifically that they didn’t have an acquisition channel that they could control how many qualified leads came to them. You could see it in that they were entirely dependent on organic marketing.",
    seqLead: "Rather than prioritize hiring 1 or 2 salesmen, the sequence we laid out was:",
    seq: ["Reinvest into Stage 1 to increase Qualified Leads",
          "Hire a specific role to increase their Capacity to Fulfill what they sell (Stage 3)",
          "Hire a sales setter to increase Capacity to Sell (Stage 2)"],
    order: ["1", "3", "2"],
    outLead: "Instead of hiring 1 or 2 people that would simply cut their profit without solving the actual problem, this sequence caused them to wake up 9 months later:",
    out: ["Being able to choose which jobs to take, and stop serving low-paying, low-quality customers",
          "Being able to raise prices to receive higher margins without seeing their close rate drop",
          "Needing to hire even more skilled project managers to handle the demand coming in"],
  },
  {
    kicker: "They thought they needed to Brute Force growth",
    industry: "Residential Remodeling",
    thought: "Stage 3 · Capacity to Fulfill",
    actual: "2",
    open: "A residential remodeling company (kitchen, bathroom, basement, and more) was convinced the problem was Stage 3, and was about to take on a lot of debt to bring in new technicians, trucks, and inventory.",
    diagnosis: "Instead, when we looked at their situation, the actual problem was Stage 2 - Capacity to Sell. We identified which of their services was the most profitable, which also was the service they were best at selling, fastest at delivering, and extremely profitable at acquiring through paid ads.",
    seqLead: "So the sequence we laid out was:",
    seq: ["Prioritize selling their most profitable service",
          "Reinvest their profit into the marketing that was already working, solely focused on this service, until their sales team’s capacity was filled with these leads",
          "Hire specialized technicians for this specific service who can do better work at a faster speed"],
    order: ["2", "1", "3"],
    outLead: "Instead of taking on a lot of debt:",
    out: ["The cash flow problem resolved on its own",
          "Growth became sustainable long-term, rather than getting stuck with more risk and then needing to go backwards to have a shot at still growing further"],
  },
];

const FIT = ["You’re doing $1M–$10M a year and you’re profitable",
             "You can’t say what last year’s reinvestment actually returned",
             "You’ll bring real numbers, even rough ones",
             "You want a written plan, not more ideas"];
const NOT_FIT = ["You’re under $1M a year",
                 "You’d rather not share real numbers in a room",
                 "You’re looking for tax tips or tactics",
                 "You want someone to hand you a plan and leave"];

const FAQ = [
  ["Is this a pitch?", "No. You spend the afternoon working on your own business. At the end I’ll show you two ways to keep working together if you want them so you can focus on running your business without getting stuck along the way."],
  ["Do I need to bring my numbers?", "After you reserve your seat we send you two links, each a brief series of tailored questions. They let us build custom analysis reports for your business, benchmarked against your own industry's data - so the afternoon is about you rather than about averages. If you don't get to them beforehand, bring rough numbers instead: last year's revenue, your net margin, what you took out in the last 90 days, and roughly what you hold in personal investments. Ranges are fine, and nobody audits anything. For the most personalized experience, just click the two links and answer the questions."],
  ["It’s really free? What’s the catch?", `This workshop is built to be a ${EVENT.fullPrice} ticket. The first rooms are free because they’re the first.`],
  ["Who else is in the room?", "About twenty owners at a similar scale, roughly half of them people I already work with. You’re seated by where you landed on the scorecard, not by revenue."],
  ["What if I can’t stay the whole afternoon?", "Come to the next one instead. Each block builds on the one before it, and leaving at 3:00pm means leaving without your customized roadmap."],
  ["Is this right for my industry and revenue tier?", `We've worked with owners across ${SECTORS.map(x => x[0]).join(", ")} - and across every revenue tier from ${TIERS[0].toLowerCase()} to ${TIERS[TIERS.length - 1]}. What changes between tiers is what actually drives the reinvest-or-harvest decision, and how much to put back in. We've helped owners at each of these stages work out what matters most where they are, and align it with the long-term outcome they want - personally and inside the business.`],
  ["What happens afterwards?", "You leave with a 90-day plan, your workbook and your Sprint Ledger. Everyone is offered a free Execution Debrief - 60 minutes, one to one, to decide what gets executed first. It’s also how your free Wealth Roadmap starts."],
];

/* Brand SVGs, inlined - same assets as the workbook and Ledger. */
const ICONS = {
  StartHere: { vb: "-210 -210 420 420", inner: <><defs>
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
   transform="translate(0,-5.0)"><circle cx="0" cy="0" r="118"/><path d="M0 -150 L34 -34 L150 0 L34 34 L0 150 L-34 34 L-150 0 L-34 -34 Z"/></g></> },
  KnowNumbers: { vb: "-210 -210 420 420", inner: <><defs>
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
   transform="translate(0,-5.0)"><path d="M-150 -130 L-150 130 L150 130"/><path d="M-72 60 L-72 -10"/><path d="M4 60 L4 -60"/><path d="M80 60 L80 -112"/></g></> },
  Constraint: { vb: "-210 -210 420 420", inner: <><defs>
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
   transform="translate(0,-5.0)"><path d="M-160 -140 L160 -140 L34 -6 L34 96 L-34 150 L-34 -6 Z"/></g></> },
  ProfitSplit: { vb: "-210 -210 420 420", inner: <><defs>
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
   transform="translate(0,-5.0)"><path d="M0 150 L0 20"/><path d="M0 20 L-120 -100"/><path d="M0 20 L120 -100"/><path d="M-120 -100 L-120 -20 M-120 -100 L-40 -100"/><path d="M120 -100 L120 -20 M120 -100 L40 -100"/></g></> },
  BuildOutside: { vb: "-210 -210 420 420", inner: <><defs>
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
   transform="translate(0,-5.0)"><circle cx="0" cy="0" r="46"/><path d="M-150 0 A150 150 0 0 1 -34 -146"/><path d="M-96 132 A150 150 0 0 1 -128 96"/><path d="M96 132 A150 150 0 0 0 150 34"/><path d="M40 -40 L142 -142"/><path d="M142 -142 L64 -142 M142 -142 L142 -64"/></g></> },
  NorthStar: { vb: "-210 -210 420 420", inner: <><defs>
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
   transform="translate(0,-5.0)"><path d="M0 155 C0 155 116 26 116 -54 A116 116 0 1 0 -116 -54 C-116 26 0 155 0 155 Z"/><circle cx="0" cy="-54" r="44"/></g></> },
  NorthStarGold: { vb: "-210 -210 420 420", inner: <><defs>
  <linearGradient id="metalxhorizongold" gradientUnits="userSpaceOnUse" x1="0" y1="-170" x2="0" y2="155"><stop offset="0%" stopColor="#FFFDF5"/><stop offset="14%" stopColor="#F8ECC4"/><stop offset="28%" stopColor="#C8A24E"/><stop offset="42%" stopColor="#5A4419"/><stop offset="50%" stopColor="#FFFDF5"/><stop offset="64%" stopColor="#C8A24E"/><stop offset="80%" stopColor="#8A6C2A"/><stop offset="100%" stopColor="#5A4419"/></linearGradient>
  <filter id="softxhorizongold" x="-60%" y="-60%" width="220%" height="220%">
    <feGaussianBlur stdDeviation="2.50"/>
  </filter>
  <filter id="liftxhorizongold" x="-70%" y="-70%" width="240%" height="240%">
    <feDropShadow dx="0" dy="6.0" stdDeviation="9.0" floodColor="#000" floodOpacity="0.55"/>
    <feDropShadow dx="0" dy="0" stdDeviation="16.0" floodColor="#C8A24E" floodOpacity="0.38"/>
  </filter>
  <radialGradient id="ambxhorizongold">
    <stop offset="0%" stopColor="#C8A24E" stopOpacity="0.16"/>
    <stop offset="100%" stopColor="#C8A24E" stopOpacity="0"/>
  </radialGradient>
</defs>
<circle cx="0" cy="0" r="215" fill="url(#ambxhorizongold)"/>

<g fill="none" stroke="#000" strokeOpacity="0.55" strokeWidth="28.00"
   strokeLinecap="round" strokeLinejoin="round"
   transform="translate(0,7.0)" filter="url(#softxhorizongold)"><path d="M0 155 C0 155 116 26 116 -54 A116 116 0 1 0 -116 -54 C-116 26 0 155 0 155 Z"/><circle cx="0" cy="-54" r="44"/></g>

<g fill="none" stroke="url(#metalxhorizongold)" strokeWidth="22.00"
   strokeLinecap="round" strokeLinejoin="round" filter="url(#liftxhorizongold)"><path d="M0 155 C0 155 116 26 116 -54 A116 116 0 1 0 -116 -54 C-116 26 0 155 0 155 Z"/><circle cx="0" cy="-54" r="44"/></g>

<g fill="none" stroke="#FFFDF5" strokeOpacity="0.55" strokeWidth="5.00"
   strokeLinecap="round" strokeLinejoin="round"
   transform="translate(0,-5.0)"><path d="M0 155 C0 155 116 26 116 -54 A116 116 0 1 0 -116 -54 C-116 26 0 155 0 155 Z"/><circle cx="0" cy="-54" r="44"/></g></> },
  Barbell: { vb: "-210 -105 420 210", inner: <><defs>
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
</g></> },
};

const Icon = ({ name, size = 54, style }) => (
  <svg viewBox={ICONS[name].vb} style={{ width: size, height: "auto", overflow: "visible", display: "block", ...style }}>{ICONS[name].inner}</svg>
);

/* One place decides how every icon on the page is stroked and lit: the cream
   ("-light") cut of each metallic icon, seated in a porcelain tile like the
   reports and the roadmap. `size` is the tile; the icon takes ~70% of it. */
const Mark = ({ of: slug, size = 40 }) => {
  const icon = Math.round(size * 0.7);
  return (
    <span className="ptile" style={{ width: size, height: size, borderRadius: Math.round(size * 0.27) }}>
      <img src={ICON(slug)} alt="" width={icon} height={icon} draggable="false" />
    </span>
  );
};

const Arrow = ({ c, w = 44 }) => (
  <svg viewBox="0 0 26 16" style={{ width: w, height: "auto", flexShrink: 0 }}>
    <path d="M1 8H23M16 1.5L23 8L16 14.5" fill="none" stroke={c} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const wrap = { maxWidth: 1260, margin: "0 auto", padding: "0 24px" };
const col = { maxWidth: 820, margin: "0 auto", padding: "0 24px" };
const KICKER = { fontSize: 11.5, fontWeight: 700, letterSpacing: ".2em", textTransform: "uppercase", margin: "0 0 14px", color: C.gold };
const H2 = { fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: "clamp(36px,6.2vw,62px)", lineHeight: 1.03, letterSpacing: "-.015em", color: C.text1, margin: "0 0 16px", textWrap: "balance" };
const EM = { color: C.gold, fontStyle: "italic", fontWeight: 400 };
const P = { fontSize: "clamp(15.5px,2.1vw,17.5px)", lineHeight: 1.7, color: C.text2, margin: 0 };
const card = { padding: "clamp(22px,3.4vw,30px)", borderRadius: 18, background: "#FFFFFF",
  border: `1px solid ${C.border2}`, boxShadow: "0 1px 2px rgba(10,14,20,.05), 0 10px 28px rgba(10,14,20,.07)" };
const input = { width: "100%", boxSizing: "border-box", padding: "14px 16px", borderRadius: 10, fontSize: 16, fontFamily: "'DM Sans',sans-serif",
  background: "#FFFFFF", border: `1px solid ${C.border2}`, color: C.text1, outline: "none", colorScheme: "light" };
const label = { display: "block", fontSize: 12.5, fontWeight: 600, color: C.text2, margin: "0 0 7px" };
const errStyle = { color: C.red, fontSize: 12.5, lineHeight: 1.4, margin: "6px 0 0" };
const Err = ({ msg }) => (msg ? <p style={errStyle}>{msg}</p> : null);
const Sec = ({ children, style, id }) => <section id={id} style={{ padding: "clamp(34px,5.5vw,62px) 0", ...style }}>{children}</section>;

/* Lives at module scope so it isn't a new component on every render - a new
   identity remounts the subtree and kills focus in whatever input is being typed in. */
/* Every "Reserve" button lands on the dates cards: pick a workshop, then the form. */
const toForm = (e) => {
  e.preventDefault();
  document.getElementById("dates")?.scrollIntoView({ behavior: "smooth", block: "start" });
};
/* After a card is picked. On desktop the form sits beside the heading, so the
   section top is right. On a phone it sits below the explainer card - aim at the
   "Reserving for" pill instead: a line of context, then the fields. */
const toFields = () => {
  const coarse = window.matchMedia("(hover: none), (pointer: coarse)").matches;
  const target = (coarse && document.getElementById("pick-pill")) || document.getElementById("register");
  target?.scrollIntoView({ behavior: "smooth", block: "start" });
};

const CTA = ({ note = true, align = "center" }) => (
  <div style={{ textAlign: align }}>
    <a href="#register" onClick={toForm} className="cta shine" style={{ display: "inline-block", padding: "24px 60px", borderRadius: 999, textDecoration: "none",
      background: DARK_BTN, border: "1.5px solid #0A0E14" }}>
      <span style={{ fontWeight: 700, fontSize: "clamp(17.5px,2.5vw,21.5px)", color: C.goldFill }}>Reserve Your Seat &#8594;</span>
    </a>
    {note && <p style={{ fontSize: 13.5, color: C.text3, margin: "13px 0 0" }}>
      Free. Limited to {EVENT.seats} owners. A $250 deposit holds your seat, and you get it back when you walk in.</p>}
  </div>
);

const Head = ({ kicker, children, align = "left", sub, subWide }) => (
  <div style={{ textAlign: align, maxWidth: align === "center" ? 780 : "none", margin: align === "center" ? "0 auto" : 0 }}>
    {kicker ? <div style={KICKER}>{kicker}</div> : null}
    <h2 style={H2}>{children}</h2>
    {sub && <p style={{ ...P, maxWidth: subWide ? 1000 : 620, margin: align === "center" ? "0 auto" : (align === "right" ? "0 0 0 auto" : 0) }}>{sub}</p>}
  </div>
);

const Meta = ({ k, v, href, note }) => (
  <div style={{ padding: "14px 16px", borderRadius: 12, border: `1px solid ${C.border2}`, background: "#FFFFFF", boxShadow: "0 1px 2px rgba(10,14,20,.04)" }}>
    <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase", color: C.text3, marginBottom: 5 }}>{k}</div>
    {href ? <a href={href} target="_blank" rel="noopener" style={{ color: C.text1, fontSize: 15, fontWeight: 600, textDecoration: "none", lineHeight: 1.35, display: "block" }}>{v}</a>
          : <div style={{ color: C.text1, fontSize: 15, fontWeight: 600, lineHeight: 1.35 }}>{v}</div>}
    {note && <div style={{ color: C.text3, fontSize: 12.5, lineHeight: 1.4, marginTop: 6 }}>{note}</div>}
  </div>
);

const TickMark = ({ no, size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    {no ? <path d="M6.5 6.5L17.5 17.5M17.5 6.5L6.5 17.5" stroke={C.red} strokeWidth="2.6" strokeLinecap="round" />
        : <path d="M4.5 12.5L9.7 17.7L19.5 7" stroke={C.green} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />}
  </svg>
);
/* Each line of the fit cards: a small porcelain disc carrying the tick or cross. */
const Tick = ({ children, no }) => (
  <li className="fitrow">
    <span className="fitdot"><TickMark no={no} size={12} /></span><span>{children}</span></li>
);

/* Stage pills are porcelain, like the tiles: a glazed white body, an edge in the
   stage's colour, and a small lit gem in front of the name. */
const FILL = { [C.gold]: C.goldFill, [C.green]: "#34D399", [C.cyan]: "#22D3EE" };
const StageChip = ({ n, small }) => {
  const s = STAGES.find(x => x.n === n);
  const glow = FILL[s.c] || s.c;
  return <span className="ppill" style={{ height: small ? 32 : 38, padding: small ? "0 14px 0 11px" : "0 17px 0 13px", fontSize: small ? 13 : 14.5, color: s.c,
    borderColor: `${glow}88`, boxShadow: `inset 0 1px 0 rgba(255,255,255,.95), 0 1px 2px rgba(10,14,20,.06), 0 6px 16px rgba(10,14,20,.08), 0 0 18px ${glow}26` }}>
    <span className="gem" style={{ background: `radial-gradient(circle at 35% 30%, #fff 0%, ${glow} 45%, ${s.c} 100%)`, boxShadow: `0 0 8px ${glow}aa` }} />
    Stage {s.n} &middot; {s.name}</span>;
};
/* The "they thought" pill: the same porcelain, greyed and struck through. */
const WrongChip = ({ children }) => (
  <span className="ppill" style={{ height: 38, padding: "0 17px 0 13px", fontSize: 14.5, color: C.text3, borderColor: C.border2 }}>
    <span className="gem" style={{ background: "radial-gradient(circle at 35% 30%, #fff 0%, #C9C2B4 50%, #8C8476 100%)" }} />
    <span style={{ textDecoration: "line-through", textDecorationColor: `${C.red}aa`, textDecorationThickness: "1.5px" }}>{children}</span></span>
);
/* Numbered steps: a small porcelain disc with the numeral in the tone's ink. */
const Num = ({ n, c }) => (
  <span className="pnum" style={{ color: c, borderColor: `${FILL[c] || c}77`, boxShadow: `inset 0 1px 0 rgba(255,255,255,.95), 0 1px 2px rgba(10,14,20,.08), 0 5px 12px rgba(10,14,20,.08), 0 0 14px ${FILL[c] || c}30` }}>{n}</span>
);

export default function WorkshopPageCream() {
  const [f, setF] = useState({ firstName: "", lastName: "", email: "", phone: "", business: "",
                               revenue: "", outcome: "", appetite: "" });
  const [state, setState] = useState("idle");
  /* ?seat=<code> is the private client link: no deposit. The server checks the code. */
  const [clientCode] = useState(() => (typeof window === "undefined" ? null : new URLSearchParams(window.location.search).get("seat")));
  const counts = useWorkshopCounts();
  const [pick, setPick] = useState({ id: WORKSHOPS[0].id, kind: null });
  const event = WORKSHOPS.find(w => w.id === pick.id) || WORKSHOPS[0];
  /* Until a card is picked, the form is for the first dated workshop. */
  const kind = pick.kind || (clientCode ? "client" : "seat");
  const short = kind === "priority" || kind === "waitlist";
  const choose = (id, k) => { setPick({ id, kind: k }); setState("idle"); setTimeout(toFields, 30); };
  const [openQ, setOpenQ] = useState(null);   /* all closed until clicked */
  const [flipped, setFlipped] = useState([]);  /* tap-to-flip, for touch screens */
  const [slide, setSlide] = useState(0);
  const [slideHeld, setSlideHeld] = useState(false);
  const [openStory, setOpenStory] = useState(null);   /* all closed until clicked */
  const [bioOpen, setBioOpen] = useState(false);      /* mobile only - desktop shows it all */
  const bioRef = useRef(null);

  /* On a phone there's no cursor, so scroll position decides what's lit: the card
     nearest the middle of the screen picks up the same gold edge the story cards
     take on hover, and hands it to the next one as you scroll past. It marks where
     you are on a long page, which is the thing a phone reader otherwise loses. */
  useEffect(() => {
    const coarse = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    if (!coarse) return;                     // the cursor light already covers fine pointers
    const cards = [...document.querySelectorAll("[data-lit]")];
    if (!cards.length) return;

    let frame = 0, queued = false;
    const settle = () => {
      queued = false;
      const mid = innerHeight / 2;
      let best = null, bestGap = Infinity;
      for (const el of cards) {
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight) continue;
        const gap = Math.abs(r.top + r.height / 2 - mid);
        if (gap < bestGap) { bestGap = gap; best = el; }
      }
      /* Only when it's genuinely near the middle - otherwise something stays lit
         while the reader is looking at a different part of the page. */
      if (best && bestGap > innerHeight * 0.42) best = null;
      for (const el of cards) el.classList.toggle("lit", el === best);
    };
    const onScroll = () => { if (!queued) { queued = true; frame = requestAnimationFrame(settle); } };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    settle();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
      for (const el of cards) el.classList.remove("lit");
    };
  }, []);

  /* A soft light that trails the cursor. The whole page is metal lit from a
     fixed point; letting the reader move that point is the thematic version of
     a hover effect. Written straight to the DOM through a ref and an rAF loop - 
     a mousemove that calls setState re-renders the page on every pixel. */
  const lampRef = useRef(null);
  const sheenRef = useRef(null);
  const texRef = useRef(null);

  /* The engraving moves with the page. The layers stay fixed (cheap to paint, and
     the lamp's mask is in screen coordinates), but their pattern is shifted by the
     scroll, so the lattice travels up with the content like the shields do instead
     of standing still behind it. */
  useEffect(() => {
    let frame = 0, queued = false;
    const apply = () => {
      queued = false;
      const pos = `0px ${-Math.round(window.scrollY)}px`;
      if (texRef.current) texRef.current.style.backgroundPosition = pos;
      if (sheenRef.current) sheenRef.current.style.backgroundPosition = pos;
    };
    const onScroll = () => { if (!queued) { queued = true; frame = requestAnimationFrame(apply); } };
    window.addEventListener("scroll", onScroll, { passive: true });
    apply();
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(frame); };
  }, []);
  useEffect(() => {
    const lamp = lampRef.current, sheen = sheenRef.current;
    if (!lamp || !sheen) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || still) return;            // no cursor, or the reader asked for calm
    lamp.style.display = "block"; sheen.style.display = "block";

    let tx = innerWidth / 2, ty = innerHeight * 0.3, x = tx, y = ty, frame = 0;
    const onMove = (e) => { tx = e.clientX; ty = e.clientY; };
    const tick = () => {
      x += (tx - x) * 0.09;                // trails rather than sticks to the pointer
      y += (ty - y) * 0.09;
      lamp.style.transform = `translate3d(${x - 340}px, ${y - 340}px, 0)`;
      sheen.style.setProperty("--lx", `${x.toFixed(1)}px`);
      sheen.style.setProperty("--ly", `${y.toFixed(1)}px`);
      frame = requestAnimationFrame(tick);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    frame = requestAnimationFrame(tick);
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(frame); };
  }, []);

  /* Carousel autoplay. Stops for good the moment someone takes control. */
  useEffect(() => {
    if (slideHeld) return;
    const t = setInterval(() => setSlide(i => (i + 1) % SLIDES.length), 4200);
    return () => clearInterval(t);
  }, [slideHeld]);
  const [touched, setTouched] = useState(false);   /* errors appear only after a submit attempt */
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  /* Dashes appear as they type; we keep only digits and cap at a US number. */
  const setPhone = (e) => {
    const d = e.target.value.replace(/\D/g, "").slice(0, 10);
    const out = d.length > 6 ? `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`
              : d.length > 3 ? `${d.slice(0, 3)}-${d.slice(3)}`
              : d;
    setF({ ...f, phone: out });
  };

  const errors = {
    firstName: f.firstName.trim() ? "" : "Please add your first name",
    lastName:  f.lastName.trim()  ? "" : "Please add your last name",
    email:     /^\S+@\S+\.\S{2,}$/.test(f.email.trim()) ? "" : "Please enter a valid email address",
    phone:     f.phone.replace(/\D/g, "").length === 10 ? "" : "Please enter a 10-digit phone number",
    business:  f.business.trim()  ? "" : "Please add your business name",
    revenue:   f.revenue  ? "" : "Please choose one",
    outcome:   short || f.outcome  ? "" : "Please choose one",
    appetite:  short || f.appetite ? "" : "Please choose one",
  };
  const valid = !Object.values(errors).some(Boolean);

  const fieldStyle = (k) => ({ ...input, borderColor: touched && errors[k] ? `${C.red}99` : C.border2 });

  const submit = async () => {
    if (state === "sending") return;
    if (!valid) { setTouched(true); return; }   /* show what's missing rather than doing nothing */
    setState("sending");
    /* Opened before the await: a tab opened after an async gap gets blocked as a popup.
       Only the deposit path needs it. */
    const tab = kind === "seat" ? window.open("", "_blank") : null;
    try {
      const r = await fetch("/api/lead-capture", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tool: "workshop-registration",
          firstName: f.firstName.trim(), lastName: f.lastName.trim(),
          email: f.email.trim(), phone: f.phone.trim(), company: f.business.trim(),
          printName: `${f.firstName.trim()} ${f.lastName.trim()}`,
          revenue: f.revenue, outcome: short ? "" : f.outcome, appetite: short ? "" : f.appetite,
          kind, workshopId: event.id, ...(kind === "client" ? { clientCode } : {}),
        }),
      });
      if (r.status === 403) { if (tab) tab.close(); setState("badcode"); return; }
      if (!r.ok) throw new Error(String(r.status));
      /* Client seats, priority and waitlist end here - no deposit. */
      if (kind !== "seat") { if (tab) tab.close(); setState("done"); return; }
      const q = new URLSearchParams({ prefilled_email: f.email.trim(), client_reference_id: `workshop-${event.id}` });
      const url = `${DEPOSIT_URL}?${q}`;
      if (tab) { tab.location = url; tab.focus(); } else { window.location.href = url; }
      setState("sent");
    } catch {
      if (tab) tab.close();
      setState("error");
    }
  };

  return (
    <div style={{ background: C.bgDeep, minHeight: "100vh", fontFamily: "'DM Sans',sans-serif", position: "relative", overflowX: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet" />
      {/* no grain on cream */}
      <div style={{ position: "absolute", top: -80, left: "50%", transform: "translateX(-50%)", width: "min(1100px,150vw)", height: 560,
        background: `radial-gradient(ellipse at center, ${C.goldFill}1c 0%, transparent 66%)`, pointerEvents: "none", zIndex: 0 }} />
      {/* the engraved ground */}
      <div ref={texRef} aria-hidden="true" style={{ position: "fixed", inset: 0, backgroundImage: TEX_FAINT, pointerEvents: "none", zIndex: 0, willChange: "background-position" }} />
      {/* the travelling light: a warm glow, and the engraving polished to gold where it falls */}
      <div ref={lampRef} aria-hidden="true" data-lamp style={{ position: "fixed", top: 0, left: 0, width: 680, height: 680, borderRadius: "50%",
        background: `radial-gradient(circle, ${C.goldFill}38 0%, ${C.goldFill}16 30%, transparent 64%)`,
        pointerEvents: "none", zIndex: 1, willChange: "transform", display: "none" }} />
      <div ref={sheenRef} aria-hidden="true" className="sheen" style={{ position: "fixed", inset: 0, backgroundImage: TEX_GOLD,
        pointerEvents: "none", zIndex: 1, display: "none" }} />

      <div style={{ position: "relative", zIndex: 2 }}>
        <div style={{ ...wrap, paddingTop: 30, display: "flex", justifyContent: "center", alignItems: "center", gap: 12 }}>
          {/* the metallic shield in a porcelain tile - the brand mark on every cream page */}
          <span className="ptile" style={{ width: 44, height: 44, borderRadius: 12 }}>
            <img src="/icons/roadmap-system/shield.png" alt="" width="31" height="31" draggable="false" style={{ display: "block" }} /></span>
          <span style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 21, letterSpacing: ".14em", color: C.text1 }}>
            KRICZKY <span style={{ color: C.goldMuted }}>VIRTUS</span></span>
        </div>

        {/* ── HERO - centred ── */}
        <Sec style={{ paddingTop: "clamp(30px,5vw,54px)", textAlign: "center" }}>
          <div style={wrap}>
            <div style={KICKER}>In person &middot; West Chester, PA &middot; {EVENT.date || "next date announced soon"}</div>
            <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, lineHeight: 1.02, letterSpacing: "-.02em", color: C.text1, margin: 0,
              fontSize: "clamp(46px,9.5vw,96px)", textWrap: "balance" }}>
              Reinvest <span style={EM}>or</span> Harvest Workshop
            </h1>
            <p style={{ fontSize: "clamp(18px,2.9vw,24px)", lineHeight: 1.45, color: C.text1, maxWidth: 780, margin: "24px auto 0", textWrap: "balance" }}>
              Get it right and your business and financial freedom compound. Get it wrong and you just get busier.
            </p>
            <p style={{ fontSize: "clamp(15.5px,2.2vw,19px)", lineHeight: 1.55, color: C.text2, maxWidth: 730, margin: "16px auto 0", textWrap: "balance" }}>
              Built for owners targeting or already doing $1M&ndash;$10M a year who want a clear answer to &ldquo;how much stays in the business vs comes out to me&rdquo; in the next 12 months.
            </p>
            <div style={{ margin: "32px 0 0" }}><CTA /></div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(165px, 1fr))", gap: 10, maxWidth: 860, margin: "32px auto 0", textAlign: "left" }}>
              <Meta k="Date" v={EVENT.date || "Announced soon"} />
              <Meta k="Time" v={EVENT.time} note="Happy Hour afterwards - food and drinks covered" />
              {EVENT.venueConfirmed
                ? <Meta k="Where" v={`${EVENT.venueLine1} ${EVENT.venueLine2}`} href={EVENT.mapUrl} />
                : <Meta k="Where" v={EVENT.area} note="Exact venue announced soon" />}
              <Meta k="Cost" v="Free" />
            </div>
          </div>
        </Sec>

        {/* ── THE ROADMAP - the whole system, interactive ── */}
        <Sec style={{ paddingTop: "clamp(10px,2vw,24px)" }}>
          <div style={wrap}>
            <Head kicker="The Owner’s Virtus Roadmap" align="center"
              sub="Six stations that work as one system. Each one feeds the next, and the workshop walks the first three on your own numbers.">
              Six stations, <span style={EM}>one system</span>
            </Head>
            <div style={{ marginTop: "clamp(18px,3vw,34px)" }}><RoadmapSystem onCta={toForm} /></div>
          </div>
        </Sec>

        {/* ── DATES - the next three workshops, live seat and priority counts ── */}
        <Sec id="dates" style={{ scrollMarginTop: 16, paddingBottom: "clamp(10px,2vw,20px)" }}>
          <div style={wrap}>
            <Head kicker="Upcoming workshops" align="center"
              sub={clientCode
                ? "Client reservation: pick the workshop you want. No deposit for clients."
                : "Reserve a seat at the next workshop, or get priority access to the two after it before their dates go public."}>
              One room a quarter, <span style={EM}>twenty owners</span>
            </Head>
            <div style={{ marginTop: "clamp(22px,3vw,34px)" }}>
              <WorkshopDates counts={counts} picked={pick.kind ? pick.id : null} onPick={choose} client={Boolean(clientCode)} />
            </div>
          </div>
        </Sec>

        {/* ── REGISTER - the form does what the picked card asked for ── */}
        <Sec id="register" style={{ scrollMarginTop: 16, paddingBottom: "clamp(40px,5vw,62px)" }}>
          <div style={{ ...wrap, display: "flex", gap: "clamp(24px,3.4vw,48px)", alignItems: "flex-start" }} className="split">
           <div style={{ flex: "1 1 0", minWidth: 0 }}>
            {kind === "seat" && <>
            <Head kicker="Reserve your seat">Free - <span style={EM}>with a deposit you get back</span></Head>

            <div style={{ ...card, margin: "10px 0 16px", borderColor: `${C.gold}3d` }}>
              <div style={KICKER}>Why there’s a deposit</div>
              <p style={{ ...P, fontSize: 15.5 }}>Before the day, your seat is bought and paid for: lunch is catered by headcount, and a workbook is printed with your name on the cover alongside your Sprint Ledger. None of that can be given to someone else afterwards.</p>
              <p style={{ ...P, fontSize: 15.5, marginTop: 12 }}>The room matters more than any of it. Twenty owners spend an afternoon working on the business instead of in it, and what makes that afternoon worth your time is that everyone else in the room made the same call.</p>
              <p style={{ ...P, fontSize: 15.5, marginTop: 12, color: C.text1 }}>So the deposit is a commitment, not a booking fee. <strong style={{ color: C.green, fontWeight: 600 }}>You get it back in full when you arrive.</strong> <strong style={{ color: C.text1, fontWeight: 600 }}>If you don’t attend, it isn’t refunded.</strong></p>
            </div>
            </>}

            {kind === "client" && <>
            <Head kicker="Client reservation">Your seat, <span style={EM}>no deposit</span></Head>
            <div style={{ ...card, margin: "10px 0 16px", borderColor: `${C.gold}3d` }}>
              <p style={{ ...P, fontSize: 15.5 }}>As a client, you skip the deposit. Your seat counts toward the twenty, so your workbook and Sprint Ledger are printed with your name on them, and you get the same pre-work and reminders as everyone else.</p>
              <p style={{ ...P, fontSize: 15.5, marginTop: 12, color: C.text1 }}>If your plans change, let us know as early as you can so the seat can go to someone on the waitlist.</p>
            </div>
            </>}

            {kind === "priority" && <>
            <Head kicker={`${event.quarter} · Date TBA`}>Priority <span style={EM}>access</span></Head>
            <div style={{ ...card, margin: "10px 0 16px", borderColor: `${C.cyan}3d` }}>
              <p style={{ ...P, fontSize: 15.5 }}>No deposit now. When the {event.quarter} date is set, everyone on the priority list hears first and gets seven days to claim a seat before the date goes public.</p>
              <p style={{ ...P, fontSize: 15.5, marginTop: 12, color: C.text1 }}>Seats are still capped at twenty, and still held by the $250 refundable deposit once you claim one.</p>
            </div>
            </>}

            {kind === "waitlist" && <>
            <Head kicker={`${event.quarter} · ${event.short || ""}`}>Join the <span style={EM}>waitlist</span></Head>
            <div style={{ ...card, margin: "10px 0 16px", borderColor: `${C.red}3d` }}>
              <p style={{ ...P, fontSize: 15.5 }}>This workshop is full. If a seat opens, the waitlist hears first, in the order people joined, and has a short window to take it with the $250 refundable deposit.</p>
            </div>
            </>}

            {!short && (
            <div id="venue-block" style={{ display: "flex", gap: 14, alignItems: "center", padding: "14px 18px", borderRadius: 12, border: `1px solid ${C.border2}`, background: "rgba(255,255,255,.72)", scrollMarginTop: 14 }}>
              <Mark of="venue-pin" size={52} />
              {EVENT.venueConfirmed
                ? <div><div style={{ color: C.text1, fontWeight: 600, fontSize: 15 }}>{EVENT.venueLine1}, {EVENT.venueLine2}</div>
                    <div style={{ color: C.text3, fontSize: 13.5, marginTop: 4 }}>Happy hour afterward is a short walk into town.</div></div>
                : <div><div style={{ color: C.text1, fontWeight: 600, fontSize: 15 }}>{event.long || EVENT.date} &middot; {EVENT.area}</div>
                    <div style={{ color: C.text3, fontSize: 13.5, marginTop: 4 }}>Exact venue announced soon. Happy hour afterward is in town.</div></div>}
            </div>
            )}
           </div>

           <div style={{ flex: "1 1 0", minWidth: 0 }}>
            <div id="pick-pill" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap", margin: "0 0 12px", scrollMarginTop: 14 }}>
              <span className="ppill" style={{ height: 34, padding: "0 15px 0 12px", fontSize: 13.5, color: C.text1, borderColor: `${C.goldFill}88`,
                boxShadow: `inset 0 1px 0 rgba(255,255,255,.95), 0 1px 2px rgba(10,14,20,.06), 0 6px 16px rgba(10,14,20,.08), 0 0 16px ${C.goldFill}26` }}>
                <span className="gem" style={{ background: `radial-gradient(circle at 35% 30%, #fff 0%, ${C.goldFill} 45%, ${C.gold} 100%)` }} />
                {kind === "priority" ? "Priority access" : kind === "waitlist" ? "Waitlist" : "Reserving"} &middot; {event.quarter}{event.short ? ` · ${event.short}` : ""}</span>
              <a href="#dates" onClick={toForm} style={{ fontSize: 13.5, color: C.text3 }}>Change</a>
            </div>
            {state === "done" ? (
            <div style={{ ...card, textAlign: "center", borderColor: `${C.green}55` }}>
              <div style={{ width: 54, height: 54, margin: "0 auto 14px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                background: "linear-gradient(180deg,#FFFEFB 0%,#F3ECDF 100%)", border: "1px solid #34D39988", boxShadow: "inset 0 1px 0 rgba(255,255,255,.95), 0 6px 14px rgba(10,14,20,.08), 0 0 16px #34D39940" }}>
                <TickMark size={22} /></div>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 30, color: C.text1, lineHeight: 1.1 }}>
                {kind === "client" ? "Your seat is reserved." : kind === "priority" ? "You're on the priority list." : "You're on the waitlist."}</div>
              <p style={{ ...P, fontSize: 15.5, margin: "12px auto 0", maxWidth: 420 }}>
                {kind === "client" ? `See you on ${event.long}. Your confirmation and pre-work are on their way to ${f.email.trim()}.`
                  : kind === "priority" ? `You'll hear first when the ${event.quarter} date is set, with seven days to claim a seat before it goes public.`
                  : "If a seat opens, you'll hear first. We'll email you either way before the day."}</p>
            </div>
            ) : (
            <div style={card}>
              <div className="grid2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div><label style={label}>First name</label><input style={fieldStyle("firstName")} value={f.firstName} onChange={set("firstName")} autoComplete="given-name" /><Err msg={touched && errors.firstName} /></div>
                <div><label style={label}>Last name</label><input style={fieldStyle("lastName")} value={f.lastName} onChange={set("lastName")} autoComplete="family-name" /><Err msg={touched && errors.lastName} /></div>
                <div><label style={label}>Email</label><input style={fieldStyle("email")} type="email" value={f.email} onChange={set("email")} autoComplete="email" /><Err msg={touched && errors.email} /></div>
                <div><label style={label}>Phone</label><input style={fieldStyle("phone")} type="tel" inputMode="numeric" placeholder="610-555-0100" value={f.phone} onChange={setPhone} autoComplete="tel" /><Err msg={touched && errors.phone} /></div>
              </div>
              <div style={{ marginTop: 14 }}><label style={label}>Business name</label>
                <input style={fieldStyle("business")} value={f.business} onChange={set("business")} autoComplete="organization" /><Err msg={touched && errors.business} /></div>
              <div style={{ marginTop: 14 }}><label style={label}>Where is your business revenue today?</label>
                <select style={fieldStyle("revenue")} value={f.revenue} onChange={set("revenue")}>
                  <option value="" style={{ background: "#FFFFFF", color: C.text3 }}>Select…</option>
                  {REVENUE.map(r => <option key={r} value={r} style={{ background: "#FFFFFF", color: C.text1 }}>{r}</option>)}</select><Err msg={touched && errors.revenue} /></div>
              {!short && <>
              <div style={{ marginTop: 14 }}><label style={label}>What’s the single biggest money outcome you want in the next 12 months?</label>
                <select style={fieldStyle("outcome")} value={f.outcome} onChange={set("outcome")}>
                  <option value="" style={{ background: "#FFFFFF", color: C.text3 }}>Select…</option>
                  {OUTCOMES.map(r => <option key={r} value={r} style={{ background: "#FFFFFF", color: C.text1 }}>{r}</option>)}</select><Err msg={touched && errors.outcome} /></div>
              <div style={{ marginTop: 14 }}><label style={label}>If you leave with a 90-day plan you believe in, what’s your appetite for getting help executing it?</label>
                <select style={fieldStyle("appetite")} value={f.appetite} onChange={set("appetite")}>
                  <option value="" style={{ background: "#FFFFFF", color: C.text3 }}>Select…</option>
                  {APPETITE.map(r => <option key={r} value={r} style={{ background: "#FFFFFF", color: C.text1 }}>{r.replace("\u2014", "-")}</option>)}</select><Err msg={touched && errors.appetite} /></div>
              </>}

              <button onClick={submit} disabled={state === "sending"} className={valid ? "cta shine" : "cta"}
                style={{ width: "100%", marginTop: 24, padding: "22px 18px", borderRadius: 999, cursor: "pointer",
                  background: valid ? DARK_BTN : "#E9E3D7",
                  border: `1.5px solid ${valid ? "#0A0E14" : C.border2}`, opacity: state === "sending" ? .7 : 1 }}>
                <span style={{ fontWeight: 700, fontSize: "clamp(14.5px,3.6vw,18.5px)", color: valid ? C.goldFill : C.text3, whiteSpace: "nowrap" }}>
                  {state === "sending" ? (short ? "Saving…" : "Holding your seat…")
                    : kind === "client" ? "Reserve my seat →"
                    : kind === "priority" ? "Get priority access →"
                    : kind === "waitlist" ? "Join the waitlist →"
                    : "Continue to the $250 deposit →"}</span>
              </button>
              {touched && !valid && state !== "error" &&
                <p style={{ ...errStyle, textAlign: "center", marginTop: 12 }}>Please fix the fields marked above.</p>}
              {state === "error" && <p style={{ color: C.red, fontSize: 14, textAlign: "center", margin: "12px 0 0" }}>Something went wrong. Please try again, or email growth@kriczkyvirtus.com.</p>}
              {state === "sent" && <p style={{ color: C.green, fontSize: 14, textAlign: "center", margin: "12px 0 0" }}>Your deposit page opened in a new tab. This page stays here.</p>}
              {state === "badcode" && <p style={{ color: C.red, fontSize: 14, textAlign: "center", margin: "12px 0 0" }}>This client link isn't valid. Please contact Edward for a new one.</p>}

              <p style={{ fontSize: 11.5, lineHeight: 1.6, color: C.text3, margin: "16px 0 0" }}>
                By providing your information you consent to Kriczky Virtus, LLC contacting you by phone, text, or email using automated telephone dialing systems and AI to the information provided, even if the phone number is present on a state or national Do Not Call List. We do not sell your personal information. By providing this information you agree to our Privacy Policy and Terms of Service.
              </p>
            </div>
            )}

           </div>
          </div>
        </Sec>

        {/* ── INDUSTRIES BANNER - scrolls continuously, right to left ── */}
        <div style={{ padding: "clamp(6px,1.4vw,18px) 0 clamp(18px,2.6vw,30px)" }}>
          <p style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: ".2em", textTransform: "uppercase", color: C.text3, textAlign: "center", margin: "0 0 20px" }}>
            Industries of owners we have helped
          </p>
          <div className="marqwrap">
            <div className="marq">
              {[0, 1].map(pass => (
                <div key={pass} style={{ display: "flex", flexShrink: 0 }} aria-hidden={pass === 1}>
                  {SECTORS.map(([name, d]) => (
                    <div key={name} style={{ display: "flex", alignItems: "center", gap: 12, padding: "0 30px", whiteSpace: "nowrap" }}>
                      <Mark of={d} size={50} />
                      <span style={{ fontSize: 16, fontWeight: 500, color: C.text1 }}>{name}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── THE PROBLEM - text left, barbell right ── */}
        <Sec>
          <div style={{ ...wrap, display: "flex", gap: "clamp(24px,4vw,56px)", alignItems: "center" }} className="split">
            <div style={{ flex: "1 1 0" }}>
              <Head kicker="The problem">Every dollar of profit goes one of <span style={EM}>two places</span></Head>
              <p style={P}>Back into the business, or out to you. Most owners load one end for years without noticing the other is empty, because every reinvestment felt right at the time.</p>
              <p style={{ ...P, marginTop: 14 }}>Ten years of reasonable calls later, the business has grown and the owner’s personal wealth hasn’t grown with it. That’s the trade almost nobody makes on purpose. This afternoon is where you make it deliberately.</p>
              {/* ties the problem back to where the roadmap starts */}
              <div style={{ display: "flex", gap: 14, alignItems: "center", marginTop: 22, padding: "14px 18px", borderRadius: 14,
                background: "#FFFFFF", border: `1px solid ${C.border2}`, boxShadow: "0 1px 2px rgba(10,14,20,.05), 0 8px 20px rgba(10,14,20,.06)" }}>
                <span className="ptile" style={{ width: 52, height: 52, borderRadius: 14 }}>
                  <img src="/icons/reinvest-harvest/c1.png" alt="" width="38" height="38" draggable="false" /></span>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase", color: C.gold, marginBottom: 3 }}>Station 01 · Where the afternoon starts</div>
                  <div style={{ fontSize: 15, lineHeight: 1.5, color: C.text2 }}>You leave with a clear answer to reinvest or harvest, scored on your own numbers.</div>
                </div>
              </div>
            </div>
            <div style={{ flex: "0 0 auto", width: "min(46%, 460px)" }} className="splitvis">
              {/* one of the page's two dark "splash" cards, like the workbook cover */}
              <div style={{ ...DARK_CARD, padding: "clamp(28px,4vw,40px) clamp(22px,3.4vw,34px) clamp(22px,3vw,28px)" }}>
                <Icon name="Barbell" size="100%" />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, fontSize: 11, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase" }}>
                  <span style={{ color: C.goldFill }}>Reinvest<span style={{ display: "block", fontWeight: 500, letterSpacing: ".1em", marginTop: 3, opacity: .8 }}>Into the company</span></span>
                  <span style={{ color: "#34D399", textAlign: "right" }}>Harvest<span style={{ display: "block", fontWeight: 500, letterSpacing: ".1em", marginTop: 3, opacity: .8 }}>Out to you</span></span>
                </div>
                <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 17, fontWeight: 600, letterSpacing: ".04em", color: "#E8ECF1", textAlign: "center", margin: "18px 0 0", paddingTop: 14, borderTop: "1px solid rgba(200,162,78,.18)" }}>
                  The Owner’s Wealth <span style={{ color: C.goldFill, fontStyle: "italic", fontWeight: 500 }}>Barbell</span></p>
              </div>
            </div>
          </div>
        </Sec>

        {/* ── THE FRAMEWORK - centred, full-width cards that flip ── */}
        <Sec>
          <div style={wrap}>
            <Head kicker="The framework" align="center"
              sub="Three stages carry every business. The first one that breaks as demand rises is the only thing worth working on - everything else is effort spent on a problem you don’t have yet.">
              The 3-Stage Constraint <span style={EM}>Framework</span>
            </Head>
            <div className="stagerow" style={{ display: "flex", alignItems: "stretch", gap: 10, marginTop: 34 }}>
              {STAGES.map((s, i) => (
                <div key={s.n} style={{ display: "contents" }}>
                  <div className="flip" data-lit style={{ flex: "1 1 0", minWidth: 0 }}
                    onClick={() => setFlipped(p => p.includes(s.n) ? p.filter(x => x !== s.n) : [...p, s.n])}>
                    <div className={`flip-inner${flipped.includes(s.n) ? " flipped" : ""}`} style={{ minHeight: 392 }}>
                      <div className="face" style={{ ...card, borderColor: `${s.c}44`, display: "flex", flexDirection: "column" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 38, color: s.c, lineHeight: 1 }}>{s.n}</div>
                          <Mark of={s.icon} size={70} />
                        </div>
                        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: "clamp(22px,2.6vw,27px)", color: C.text1, margin: "12px 0 10px", lineHeight: 1.1 }}>{s.name}</div>
                        <p style={{ fontSize: 15, lineHeight: 1.6, color: C.text2, margin: 0 }}>{s.what}</p>
                        <p style={{ fontSize: 13.5, lineHeight: 1.55, color: C.text3, fontStyle: "italic", margin: "auto 0 0", paddingTop: 12 }}>The tell: {s.tell}</p>
                        <div style={{ fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase", color: C.text4, marginTop: 12 }}>
                          <span className="cue-hover">Hover</span><span className="cue-tap">Tap</span> to see what’s underneath</div>
                      </div>
                      <div className="face back" style={{ ...card, borderColor: `${s.c}44`, overflow: "hidden" }}>
                        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 2 }}>
                          <Mark of={s.icon} size={70} />
                        </div>
                        <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase", color: s.c, margin: "0 0 8px" }}>Sub-bottlenecks</div>
                        {s.sub.map(t => <div key={t} style={{ fontSize: 13.5, lineHeight: 1.45, color: C.text2, padding: "4px 0", borderBottom: `1px solid ${C.border1}` }}>{t}</div>)}
                        <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase", color: C.red, margin: "14px 0 8px" }}>Landmines</div>
                        {s.mines.map(t => <div key={t} style={{ fontSize: 13.5, lineHeight: 1.45, color: "#9E4F4F", padding: "4px 0", borderBottom: `1px solid ${C.border1}` }}>{t}</div>)}
                        <p style={{ fontSize: 11.5, lineHeight: 1.45, color: C.text4, margin: "12px 0 0" }}>Examples only - there are more than these underneath each stage.</p>
                      </div>
                    </div>
                  </div>
                  {i < 2 && <div className="stagearrow" style={{ display: "flex", alignItems: "center" }}><Arrow c={s.c} /></div>}
                </div>
              ))}
            </div>
            <p style={{ ...P, textAlign: "center", maxWidth: 680, margin: "26px auto 0" }}>
              Underneath whichever stage binds you sit the sub-bottlenecks causing it - and the landmines that make growth cost more than it returns. You’ll work through both.
            </p>
            <div style={{ marginTop: 34 }}><CTA note={false} /></div>
          </div>
        </Sec>

        {/* ── WHAT YOU LEAVE WITH - pages left, text right ── */}
        <Sec>
          <div style={{ ...wrap, display: "flex", gap: "clamp(24px,4vw,56px)", alignItems: "center" }} className="split">
            <div style={{ flex: "0 0 auto", width: "min(50%, 520px)" }} className="splitvis">
              <div style={{ position: "relative", height: "clamp(320px,38vw,450px)", borderRadius: 16, overflow: "hidden",
                border: `1px solid ${C.border2}`, background: "linear-gradient(180deg,#FBF8F2 0%,#F1EBDF 100%)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,.9), 0 10px 28px rgba(10,14,20,.08)" }}>
                {SLIDES.map((sl, i) => (
                  <div key={sl.cap} className="slide" aria-hidden={slide !== i}
                    style={{ opacity: slide === i ? 1 : 0, transform: slide === i ? "none" : "scale(.985)" }}>
                    {sl.kind === "page" && <img src={sl.src} alt={sl.cap} className="slidepage" />}
                    {sl.kind === "image" && <img src={sl.src} alt={sl.cap} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", display: "block" }} />}
                    {sl.kind === "grid" && (
                      <div className="shotgrid" role="img" aria-label={sl.cap}>
                        {sl.src.map(s => <div key={s} className="shot"><img src={s} alt="" /></div>)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 14 }}>
                {SLIDES.map(({ cap }, i) => (
                  <button key={cap} aria-label={cap} onClick={() => { setSlide(i); setSlideHeld(true); }}
                    style={{ width: slide === i ? 26 : 9, height: 9, borderRadius: 999, border: "none", cursor: "pointer",
                      background: slide === i ? C.goldFill : "#D9D1C2", transition: "all .3s ease", padding: 0 }} />
                ))}
              </div>
            </div>
            <div style={{ flex: "1 1 0" }}>
              <Head kicker="What you leave with">Not notes. <span style={EM}>A plan.</span></Head>
              {LEAVE_WITH.map(([t, d], i) => (
                <div key={t} onMouseEnter={() => setSlide(i)}
                  style={{ padding: "13px 16px", margin: "0 -16px", borderRadius: 10, cursor: "default",
                    borderBottom: i < 3 ? `1px solid ${C.border1}` : "none",
                    background: slide === i ? "#FFFFFF" : "transparent", transition: "background .3s ease" }}>
                  <div style={{ fontSize: 17.5, fontWeight: 700, color: i === 3 ? C.green : C.text1, marginBottom: 4 }}>{t}</div>
                  <p style={{ fontSize: 14.5, lineHeight: 1.6, color: C.text2, margin: 0 }}>{d}</p>
                </div>
              ))}
            </div>
          </div>
        </Sec>

        {/* ── THE AFTERNOON - text right, roadmap left ── */}
        <Sec>
          <div style={{ ...wrap, display: "flex", gap: "clamp(24px,4vw,56px)", alignItems: "center" }} className="split rev">
            <div style={{ flex: "1 1 0" }}>
              <Head kicker="The afternoon">Three stations, <span style={EM}>one plan</span></Head>
              <div style={{ ...card, marginTop: 4 }}>
                {AGENDA.map(([t, d], i) => (
                  <div key={t} style={{ display: "flex", gap: 16, padding: "10px 0", borderBottom: i < AGENDA.length - 1 ? `1px solid ${C.border1}` : "none" }}>
                    <span style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 15, color: C.gold, minWidth: 54 }}>{t}</span>
                    <span style={{ fontSize: 15.5, color: C.text2 }}>{d}</span>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 14.5, lineHeight: 1.6, color: C.text2, margin: "16px 0 0" }}>
                <strong style={{ color: C.text1, fontWeight: 600 }}>Lunch and happy hour are on us.</strong> You won’t spend a dollar on the day - and the $250 deposit is back in your pocket when you walk in.
              </p>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: C.text3, margin: "10px 0 0" }}>
                Optional pre-work goes out when you register. Do it and the afternoon is built around your numbers; skip it and you’ll catch up in the break.
              </p>
            </div>
            <div style={{ flex: "0 0 auto", width: "min(46%, 500px)" }} className="splitvis">
              {/* the second dark "splash" card: the roadmap as it's drawn on the Ledger cover */}
              <div style={{ ...DARK_CARD, padding: "clamp(26px,3.6vw,36px) clamp(18px,2.6vw,26px) clamp(18px,2.6vw,24px)" }}>
                <img src="/img/workshop/roadmap-dark.webp" alt="The Owner’s Virtus Roadmap" style={{ width: "100%", display: "block" }} />
                <p style={{ fontSize: 12.5, lineHeight: 1.5, color: "#A9B2BF", textAlign: "center", margin: "16px 0 0", paddingTop: 14, borderTop: "1px solid rgba(200,162,78,.18)" }}>
                  <span style={{ display: "block", fontFamily: "'Cormorant Garamond',serif", fontSize: 17, fontWeight: 600, color: "#E8ECF1" }}>The Owner’s Virtus <span style={{ color: C.goldFill, fontStyle: "italic", fontWeight: 500 }}>Roadmap</span></span>
                  The workshop covers the first three stations.</p>
              </div>
            </div>
          </div>
        </Sec>

        {/* ── WHO'S RUNNING IT - headshot floated, so the text wraps beside and
               under it and the whole section fits one desktop screen ── */}
        <Sec style={{ padding: "clamp(24px,3.4vw,42px) 0", position: "relative" }}>
          <ShieldMark side="right" />
          <div style={{ ...col, position: "relative", zIndex: 1 }}>
            <img src="/img/edward.jpg" alt="Edward Kriczky" className="biopic"
              style={{ float: "left", width: "min(38%, 290px)", aspectRatio: "1 / 1", objectFit: "cover", objectPosition: "center top",
                borderRadius: 18, border: `1px solid ${C.border2}`, boxShadow: "0 16px 40px rgba(10,14,20,.18)",
                margin: "6px 26px 18px 0", shapeOutside: "inset(0 round 18px)" }} />
            <div style={KICKER}>Who’s running it</div>
            <h2 style={{ ...H2, fontSize: "clamp(28px,4.1vw,42px)", margin: "0 0 12px" }}>A quarterback for every domain of <span style={EM}>your wealth</span></h2>
            {/* Approved 16 Oct 2026 (Edward's edit of the recommended version). */}
            <p style={{ ...P, fontSize: "clamp(14.8px,1.8vw,16px)", lineHeight: 1.58 }}>I started as an aerospace engineer, co-leading a team of 25: hiring, scaling the team, and building the comp plans to help keep them. Then I left to build my own business.</p>
            <p style={{ ...P, fontSize: "clamp(14.8px,1.8vw,16px)", lineHeight: 1.58, marginTop: 10, color: C.text1 }}>Working with business owners taught me one thing above everything else: <strong style={{ color: C.gold, fontWeight: 600 }}>roughly 80% of an owner’s net worth sits inside the business.</strong> Almost nobody helps with that 80%, let alone gets it rowing in the same direction as the other 20%.</p>

            <div ref={bioRef} className={`biomore${bioOpen ? " open" : ""}`}>
              <p style={{ ...P, fontSize: "clamp(14.8px,1.8vw,16px)", lineHeight: 1.58, marginTop: 10 }}>Through painful first-hand experience, I know what it costs when your wealth is working against you, rather than for you. My wife and I finished college with over $100,000 of student debt, then went from two incomes to one. For years every dollar went to that debt. We couldn’t buy a home. I ate less than I needed to because I was concerned I wouldn’t be able to pay all our bills, and I lost 15 lbs because of the stress. I had to climb out of that with almost no help.</p>
              <p style={{ ...P, fontSize: "clamp(14.8px,1.8vw,16px)", lineHeight: 1.58, marginTop: 10, color: C.text1 }}>So here’s my goal in business: help make financial freedom and sustainable wealth as “inevitable” as possible for business owners (obviously no guarantees in life or wealth). That means wealth that doesn’t depend on any one quarter, and you having freedom over your time instead of being a slave to your own business. That’s why I built both sides. That’s the Owner’s Wealth Barbell. The Virtus Roadmap is how we help business owners work towards getting there.</p>
              <p style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 22, color: C.text1, margin: "18px 0 0" }}>
                Edward Kriczky, <span style={{ color: C.gold }}>CEPA&reg;</span></p>
            </div>

            <button onClick={() => {
                /* open to the text's real height, so the glide takes the whole .7s */
                if (bioRef.current) bioRef.current.style.setProperty("--bioh", bioRef.current.scrollHeight + "px");
                setBioOpen(!bioOpen);
              }} className="biotoggle" aria-expanded={bioOpen}
              style={{ display: "none", width: "100%", marginTop: 14, padding: "13px 18px", borderRadius: 999, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14.5, fontWeight: 600, color: C.gold }}>
                {bioOpen ? "Show less" : "Read the rest"}
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" style={{ transform: bioOpen ? "rotate(180deg)" : "none", transition: "transform .3s ease" }}>
                  <path d="M6 9.5L12 15.5L18 9.5" stroke={C.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
            </button>
            <div style={{ clear: "both" }} />
          </div>
        </Sec>

        {/* ── THE TWO STORIES ── */}
        <Sec>
          <div style={wrap}>
            <Head kicker="Two owners, two wrong diagnoses" align="center"
              subWide sub="Both were about to spend real money fixing a stage that wasn’t binding them.">
              What this looks like <span style={EM}>in practice</span>
            </Head>
            {STORIES.map((s, i) => (
              <div key={s.kicker} className="storycard" data-lit
                style={{ ...card, marginTop: i ? 16 : 30, padding: 0, overflow: "hidden",
                  borderColor: openStory === i ? `${C.gold}3d` : C.border2 }}>
                <button onClick={() => setOpenStory(openStory === i ? null : i)} className="storybtn"
                  style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 18,
                    padding: "clamp(20px,2.8vw,28px) clamp(22px,3.2vw,32px)", background: "transparent", border: "none",
                    cursor: "pointer", textAlign: "left", fontFamily: "'DM Sans',sans-serif" }}>
                  <div className="storyhead" style={{ display: "flex", alignItems: "center", gap: 18, minWidth: 0 }}>
                    <Mark of={INDUSTRY_ICON[s.industry]} size={56} />
                    <div style={{ minWidth: 0 }}>
                      <div className="storytitle" style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: "clamp(21px,3vw,29px)", lineHeight: 1.14, color: C.text1 }}>{s.kicker}</div>
                      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: C.text3, marginTop: 5 }}>{s.industry} Business</div>
                    </div>
                  </div>
                  <span className={`chev${openStory === i ? " on" : ""}`}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ transform: openStory === i ? "rotate(180deg)" : "none", transition: "transform .35s ease" }}>
                      <path d="M6 9.5L12 15.5L18 9.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                </button>
                <div style={{ maxHeight: openStory === i ? 2600 : 0, opacity: openStory === i ? 1 : 0, overflow: "hidden",
                  transition: "max-height .6s cubic-bezier(.4,0,.2,1), opacity .4s ease" }}>
                 <div style={{ padding: "0 clamp(22px,3.2vw,32px) clamp(24px,3.4vw,34px)" }}>

                {/* thought vs actual, shown rather than described */}
                <div className="pillrow well" style={{ marginBottom: 20 }}>
                  <div className="pillcell"><div className="welllbl">They thought</div>
                    <WrongChip>{s.thought}</WrongChip></div>
                  <div className="pillarrow"><Arrow c={C.goldMuted} w={30} /></div>
                  <div className="pillcell"><div className="welllbl" style={{ color: C.gold }}>Actually binding</div>
                    <StageChip n={s.actual} /></div>
                </div>

                <p style={{ ...P, fontSize: 15.5 }}>{s.open}</p>
                <p style={{ ...P, fontSize: 15.5, marginTop: 13, color: C.text1 }}>{s.diagnosis}</p>

                <p style={{ ...P, fontSize: 15.5, marginTop: 16 }}>{s.seqLead}</p>
                <ol className="num" style={{ margin: "10px 0 0", padding: 0, listStyle: "none" }}>
                  {s.seq.map((x, n) => (
                    <li key={n} style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 11 }}>
                      <Num n={n + 1} c={C.gold} />
                      <span style={{ fontSize: 15, lineHeight: 1.6, color: C.text2, paddingTop: 3 }}>{x}</span>
                    </li>
                  ))}
                </ol>

                {/* the order of stages, as a path */}
                <div className="pillrow orderrow well" style={{ margin: "20px 0 0" }}>
                  <span className="welllbl orderlbl">The order we worked it</span>
                  {s.order.map((n, idx) => (
                    <div key={idx} className="orderitem">
                      <StageChip n={n} small />
                      {idx < s.order.length - 1 && <div className="pillarrow"><Arrow c={C.goldMuted} w={22} /></div>}
                    </div>
                  ))}
                </div>

                <p style={{ ...P, fontSize: 15.5, marginTop: 18 }}>{s.outLead}</p>
                <ol className="num" style={{ margin: "10px 0 0", padding: 0, listStyle: "none" }}>
                  {s.out.map((x, n) => (
                    <li key={n} style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 11 }}>
                      <Num n={n + 1} c={C.green} />
                      <span style={{ fontSize: 15, lineHeight: 1.6, color: C.text2, paddingTop: 3 }}>{x}</span>
                    </li>
                  ))}
                </ol>
                 </div>
                </div>
              </div>
            ))}
            <div style={{ marginTop: 34 }}><CTA note={false} /></div>
          </div>
        </Sec>

        {/* ── PROOF - hidden while TESTIMONIALS is empty ── */}
        {TESTIMONIALS.length > 0 && (
          <Sec>
            <div style={wrap}>
              <Head kicker="What owners say" align="center">In their <span style={EM}>own words</span></Head>
              <div className="grid3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginTop: 26 }}>
                {TESTIMONIALS.map((t, i) => (
                  <div key={i} style={{ ...card, padding: "24px 26px" }}>
                    <p style={{ fontSize: 15.5, lineHeight: 1.65, color: C.text1, margin: 0 }}>&ldquo;{t.quote}&rdquo;</p>
                    <div style={{ marginTop: 16, paddingTop: 13, borderTop: `1px solid ${C.border1}` }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: C.text1 }}>{t.name}</div>
                      <div style={{ fontSize: 13, color: C.text3 }}>{t.company}{t.industry ? ` · ${t.industry}` : ""}</div>
                      <div style={{ fontSize: 11.5, color: C.text4, marginTop: 6 }}>{t.connection}</div>
                    </div>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 11.5, lineHeight: 1.6, color: C.text4, textAlign: "center", maxWidth: 720, margin: "22px auto 0" }}>
                Individual experiences vary and are not representative of all clients or attendees. No outcome is projected or guaranteed. Nothing here is individualized financial, tax, legal, or accounting advice.
              </p>
            </div>
          </Sec>
        )}

        {/* ── FIT - text right, industries left ── */}
        <Sec>
          <div style={wrap}>
            <Head kicker="Is This Right For You?">Who the room is <span style={EM}>for</span></Head>
            <div style={{ display: "flex", gap: "clamp(24px,4vw,56px)", alignItems: "stretch", marginTop: 6 }} className="split rev">
             <div style={{ flex: "1 1 0" }}>
              <div className="grid2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div className="fitcard" data-lit style={{ "--tone": C.green, "--fill": "#34D399", "--tint": "#E3EEE6", "--edge": "#34D39955", "--edgeHi": "#34D399aa", "--glow": "#34D3992e", "--glowHi": "#34D39966" }}>
                  <div className="fithead"><span className="fitbadge"><TickMark /></span><span style={{ color: C.green }}>This is for you if</span></div>
                  <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>{FIT.map(t => <Tick key={t}>{t}</Tick>)}</ul></div>
                <div className="fitcard" data-lit style={{ "--tone": C.red, "--fill": "#F87171", "--tint": "#F6E3DF", "--edge": "#F8717155", "--edgeHi": "#F87171aa", "--glow": "#F871712e", "--glowHi": "#F8717166" }}>
                  <div className="fithead"><span className="fitbadge"><TickMark no /></span><span style={{ color: C.red }}>It isn’t if</span></div>
                  <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>{NOT_FIT.map(t => <Tick key={t} no>{t}</Tick>)}</ul></div>
              </div>
            </div>
            <div style={{ flex: "0 0 auto", width: "min(38%, 350px)", display: "flex", flexDirection: "column" }} className="splitvis nichecol">
              <p style={{ fontSize: 13.5, letterSpacing: ".06em", color: C.text3, margin: "0 0 18px" }}>Example niches of owners we have helped</p>
              <div className="nichegrid" style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignContent: "space-between" }}>
                {INDUSTRIES.map(([name, d]) => (
                  <div key={name} style={{ display: "flex", alignItems: "center", gap: 13 }}>
                    <Mark of={d} size={54} />
                    <span style={{ fontSize: 15, fontWeight: 500, color: C.text1, lineHeight: 1.25 }}>{name}</span>
                  </div>
                ))}
              </div>
             </div>
            </div>
          </div>
        </Sec>

        {/* ── FAQ - accordion ── */}
        <Sec style={{ position: "relative" }}>
          <ShieldMark side="left" size={480} />
          <div style={{ ...col, position: "relative", zIndex: 1 }}>
            <Head kicker="" align="center">Frequently Asked <span style={EM}>Questions</span></Head>
            <div style={{ marginTop: 26 }}>
              {FAQ.map(([q, a], i) => (
                <div key={q} className={`faq${openQ === i ? " open" : ""}`}>
                  <button onClick={() => setOpenQ(openQ === i ? -1 : i)} className="faqbtn" aria-expanded={openQ === i}
                    style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14, padding: "19px 20px 19px 22px",
                      background: "transparent", border: "none", cursor: "pointer", textAlign: "left", fontFamily: "'DM Sans',sans-serif" }}>
                    <span className="faqq" style={{ fontSize: "clamp(15.5px,2.1vw,17.5px)", fontWeight: 600 }}>{q}</span>
                    <span className="chev plus">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ transform: openQ === i ? "rotate(45deg)" : "none", transition: "transform .35s ease" }}>
                        <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg></span>
                  </button>
                  {/* glides: the row's height animates from 0fr to 1fr */}
                  <div className="faqa"><div><p style={{ ...P, fontSize: 15.5, padding: "0 22px 22px" }}>{a}</p></div></div>
                </div>
              ))}
            </div>
          </div>
        </Sec>


        {/* ── LAST CALL - back up to the dates ── */}
        <Sec style={{ paddingTop: 0 }}>
          <div style={wrap}><CTA /></div>
        </Sec>

        {/* ── CLOSING STATEMENT - the homepage's closing quote, in a dark band ── */}
        <div className="closer">
          <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: TEX_DARK, opacity: .5, pointerEvents: "none",
            WebkitMaskImage: "radial-gradient(ellipse 70% 80% at 50% 40%, #000 0%, transparent 80%)", maskImage: "radial-gradient(ellipse 70% 80% at 50% 40%, #000 0%, transparent 80%)" }} />
          <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 50% 60% at 50% 40%, rgba(200,162,78,0.10) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 1, padding: "clamp(72px,10vw,120px) 20px 0", textAlign: "center" }}>
            <div className="closerule" style={{ margin: "0 auto 32px" }} />
            <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(25px,3.6vw,38px)", fontWeight: 400, fontStyle: "italic", color: "#E8ECF1",
              maxWidth: 720, margin: "0 auto", lineHeight: 1.45, textShadow: "0 0 40px rgba(200,162,78,0.15)", textWrap: "balance" }}>
              Building <span style={{ fontStyle: "normal", fontWeight: 700, color: C.goldFill }}>Businesses Worth Owning</span> shouldn&rsquo;t require doing it alone.
            </p>
            <div className="closerule" style={{ margin: "32px auto 0" }} />
          </div>
          {/* VIRTUS, engraved in outline and fading out */}
          <div aria-hidden="true" className="closerword">VIRTUS</div>
        </div>

        <div style={{ ...wrap, paddingTop: 34, paddingBottom: 60 }}>
          <p style={{ fontSize: 11.5, lineHeight: 1.65, color: C.text4, textAlign: "center", maxWidth: 820, margin: "0 auto" }}>
            The workshop is provided by Kriczky Virtus, LLC. The Personalized Wealth Roadmap is an investment advisory service provided by Kriczky Wealth Management LLC, an Investment Advisor in the state of Pennsylvania and Virginia, and requires an advisory agreement; Form ADV is provided before any agreement is signed. Professionals are registered with Kriczky Wealth Management LLC. Edward Kriczky owns both firms, which is a conflict of interest disclosed in Form ADV. You are never required to engage either firm, and you may use any business consultant or investment advisor you choose. Client examples describe individual engagements; individual results vary and are not representative of all clients. No outcome is projected or guaranteed. Nothing on this page is individualized financial, tax, legal, or accounting advice.
          </p>
        </div>
      </div>

      <style>{`
        /* closing statement: a full-width dark band, like the homepage's last screen */
        .closer { position: relative; overflow: hidden; background: linear-gradient(180deg,#141B26 0%,#0A0E14 70%); border-top: 1px solid rgba(200,162,78,.35); }
        .closerule { width: 60px; height: 2px; background: linear-gradient(90deg, transparent, ${C.goldFill}, transparent); }
        .closerword { font-family: 'Cormorant Garamond',serif; font-weight: 700; text-transform: uppercase; letter-spacing: .2em; white-space: nowrap; text-align: center;
          font-size: clamp(50px,14.5vw,240px); line-height: .85; color: transparent; -webkit-text-stroke: 1.5px rgba(200,162,78,0.24);
          margin: clamp(36px,5vw,56px) 0 0; padding-left: .2em; height: clamp(46px,11vw,170px); overflow: hidden; user-select: none; pointer-events: none;
          -webkit-mask-image: linear-gradient(180deg, rgba(0,0,0,.75) 0%, rgba(0,0,0,0) 100%); mask-image: linear-gradient(180deg, rgba(0,0,0,.75) 0%, rgba(0,0,0,0) 100%); }
        .marqwrap { overflow: hidden; padding: 6px 0 24px; margin-bottom: -18px; -webkit-mask-image: linear-gradient(90deg, transparent, #000 9%, #000 91%, transparent);
                    mask-image: linear-gradient(90deg, transparent, #000 9%, #000 91%, transparent); }
        .marq { display: flex; width: max-content; animation: marq 46s linear infinite; }
        @keyframes marq { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @media (prefers-reduced-motion: reduce) { .marq { animation: none; } }

        .sheen { --lx: 50vw; --ly: 30vh;
          -webkit-mask-image: radial-gradient(circle 250px at var(--lx) var(--ly), #000 0%, rgba(0,0,0,.55) 40%, transparent 100%);
                  mask-image: radial-gradient(circle 250px at var(--lx) var(--ly), #000 0%, rgba(0,0,0,.55) 40%, transparent 100%); }
        @media (max-width: 1100px) { .shieldmark { display: none; } }

        .ptile { display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0;
          background: linear-gradient(180deg,#FFFEFB 0%,#F7F2E8 100%); border: 1px solid #E6DFD1;
          box-shadow: inset 0 1px 0 rgba(255,255,255,.9), 0 1px 2px rgba(10,14,20,.06), 0 10px 22px rgba(10,14,20,.12); }
        .ptile img { display: block; user-select: none; pointer-events: none; }

        .cta { transition: all .25s ease; }
        /* the dark buttons wear a gold halo: a fine gold ring, a close glow and a wide soft one */
        .cta.shine { box-shadow: 0 0 0 1px rgba(200,162,78,.55), 0 0 20px rgba(200,162,78,.55), 0 0 52px rgba(200,162,78,.34), 0 10px 24px rgba(10,14,20,.18); }
        .cta:hover:not(:disabled) { box-shadow: 0 0 0 1px rgba(200,162,78,.7), 0 0 24px rgba(200,162,78,.6), 0 0 64px rgba(200,162,78,.38), 0 12px 26px rgba(10,14,20,.2) !important; transform: translateY(-2px); }
        /* a quick shine across the dark buttons on hover, so they read as buttons */
        .shine { position: relative; overflow: hidden; isolation: isolate; }
        .shine::after { content: ""; position: absolute; top: -10%; bottom: -10%; left: -75%; width: 55%; pointer-events: none; opacity: 0;
          background: linear-gradient(100deg, transparent 0%, rgba(248,236,196,0) 22%, rgba(250,240,205,.55) 50%, rgba(248,236,196,0) 78%, transparent 100%);
          transform: skewX(-18deg); }
        @media (hover: hover) { .shine:hover::after { animation: shine .8s cubic-bezier(.4,0,.2,1); } }
        @keyframes shine { 0% { left: -75%; opacity: 1; } 100% { left: 130%; opacity: 1; } }
        @media (prefers-reduced-motion: reduce) { .shine:hover::after { animation: none; } }

        /* carousel */
        .slide { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; padding: 18px; box-sizing: border-box;
          transition: opacity .7s ease, transform .7s ease; }
        .slidepage { height: 100%; width: auto; max-width: 100%; object-fit: contain; display: block; border-radius: 4px;
          box-shadow: 0 1px 2px rgba(10,14,20,.08), 0 14px 30px rgba(10,14,20,.18); }
        .shotgrid { display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: repeat(3, 1fr); gap: 10px; width: 100%; height: 100%; }
        .shot { min-height: 0; display: flex; align-items: center; justify-content: center; }
        .shot img { max-width: 100%; max-height: 100%; aspect-ratio: 16 / 9; object-fit: cover; display: block; border-radius: 7px; background: #fff;
          border: 1px solid #E6DFD1; box-shadow: 0 1px 2px rgba(10,14,20,.08), 0 8px 18px rgba(10,14,20,.14); }

        /* porcelain pills, discs and wells (the story cards) */
        .ppill { display: inline-flex; align-items: center; justify-content: center; gap: 9px; border-radius: 999px; font-weight: 600; white-space: nowrap; box-sizing: border-box;
          background: linear-gradient(180deg,#FFFEFB 0%,#F5EFE3 100%); border: 1px solid #E6DFD1; letter-spacing: .005em;
          box-shadow: inset 0 1px 0 rgba(255,255,255,.95), 0 1px 2px rgba(10,14,20,.06), 0 6px 16px rgba(10,14,20,.08); }
        .gem { width: 9px; height: 9px; border-radius: 50%; flex: 0 0 auto; }
        .pnum { flex: 0 0 auto; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
          font-family: 'Playfair Display',serif; font-weight: 700; font-size: 14px; line-height: 1; box-sizing: border-box; font-variant-numeric: lining-nums; font-feature-settings: 'lnum' 1;
          background: linear-gradient(180deg,#FFFEFB 0%,#F3ECDF 100%); border: 1px solid #E6DFD1; }
        .well { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 14px 18px; padding: 18px 20px; border-radius: 14px;
          background: linear-gradient(180deg,#F8F4EC 0%,#F3EDE2 100%); border: 1px solid ${C.border1};
          box-shadow: inset 0 1px 3px rgba(10,14,20,.06), inset 0 0 0 1px rgba(255,255,255,.5); }
        .pillcell { display: flex; flex-direction: column; align-items: center; }
        .welllbl { font-size: 10.5px; font-weight: 700; letter-spacing: .16em; text-transform: uppercase; color: ${C.text4}; margin-bottom: 8px; text-align: center; }
        .orderlbl { width: 100%; margin-bottom: 0; }
        .orderitem { display: flex; align-items: center; gap: 12px; }

        /* story accordion: a card that clearly lifts and lights on hover */
        .chev { flex-shrink: 0; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: ${C.text3};
          background: linear-gradient(180deg,#FFFEFB 0%,#F5EFE3 100%); border: 1px solid #E6DFD1;
          box-shadow: inset 0 1px 0 rgba(255,255,255,.95), 0 1px 2px rgba(10,14,20,.06), 0 6px 14px rgba(10,14,20,.08);
          transition: color .3s ease, border-color .3s ease, box-shadow .3s ease, background .3s ease; }
        .chev.on { color: ${C.gold}; border-color: ${C.goldFill}88; }
        .chev.plus { width: 34px; height: 34px; }

        /* fit cards */
        /* fit cards: the reports' glow card - an edge and a soft glow all round in the tone */
        .fitcard { position: relative; padding: clamp(22px,3.2vw,28px); border-radius: 18px;
          border: 1px solid var(--edge); background: linear-gradient(135deg, #FFFFFF 55%, var(--tint));
          box-shadow: 0 0 22px var(--glow), 0 8px 22px rgba(10,14,20,.07); transition: box-shadow .3s ease, border-color .3s ease, transform .3s ease; }
        @media (hover: hover) and (pointer: fine) {
          .fitcard:hover { transform: translateY(-2px); border-color: var(--edgeHi); box-shadow: 0 0 34px var(--glowHi), 0 12px 26px rgba(10,14,20,.09); }
        }
        .fitcard[data-lit].lit { border-color: var(--edgeHi) !important; box-shadow: 0 0 34px var(--glowHi), 0 12px 26px rgba(10,14,20,.09) !important; }
        .fithead { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; font-size: 11.5px; font-weight: 700; letter-spacing: .2em; text-transform: uppercase; }
        .fitbadge { width: 38px; height: 38px; border-radius: 11px; display: flex; align-items: center; justify-content: center; flex: 0 0 auto;
          background: linear-gradient(180deg,#FFFEFB 0%,#F7F2E8 100%); border: 1px solid #E6DFD1;
          box-shadow: inset 0 1px 0 rgba(255,255,255,.9), 0 1px 2px rgba(10,14,20,.06), 0 8px 18px rgba(10,14,20,.10), 0 0 16px var(--glowHi); }
        .fitrow { display: flex; gap: 12px; align-items: flex-start; padding: 11px 0; border-top: 1px solid ${C.border1};
          font-size: clamp(15px,2vw,16.5px); line-height: 1.55; color: ${C.text2}; }
        .fitrow:first-child { border-top: none; padding-top: 4px; }
        .fitdot { width: 24px; height: 24px; border-radius: 50%; flex: 0 0 auto; margin-top: 1px; display: flex; align-items: center; justify-content: center;
          background: linear-gradient(180deg,#FFFEFB 0%,#F3ECDF 100%); border: 1px solid #E6DFD1;
          box-shadow: inset 0 1px 0 rgba(255,255,255,.95), 0 1px 2px rgba(10,14,20,.08), 0 4px 10px rgba(10,14,20,.08); }

        /* FAQ: porcelain tiles that glide open */
        .faq { margin-bottom: 12px; border-radius: 16px; background: linear-gradient(180deg,#FFFEFB 0%,#F7F2E8 100%); border: 1px solid #E6DFD1;
          box-shadow: inset 0 1px 0 rgba(255,255,255,.9), 0 1px 2px rgba(10,14,20,.06), 0 10px 22px rgba(10,14,20,.08);
          transition: border-color .3s ease, box-shadow .3s ease, transform .3s ease; }
        .faq .faqq { color: ${C.text1}; transition: color .25s ease; }
        .faqa { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .45s cubic-bezier(.4,0,.2,1), opacity .35s ease; opacity: 0; }
        .faqa > div { overflow: hidden; min-height: 0; }
        .faq.open { border-color: ${C.goldFill}88; box-shadow: inset 0 1px 0 rgba(255,255,255,.9), 0 0 26px ${C.goldFill}2e, 0 12px 26px rgba(10,14,20,.09); }
        .faq.open .faqa { grid-template-rows: 1fr; opacity: 1; }
        .faq.open .faqq { color: ${C.gold}; }
        .faq.open .chev { color: ${C.gold}; border-color: ${C.goldFill}88; }
        @media (hover: hover) and (pointer: fine) {
          .faq:hover { transform: translateY(-2px); border-color: ${C.goldFill}88; box-shadow: inset 0 1px 0 rgba(255,255,255,.9), 0 0 26px ${C.goldFill}2e, 0 14px 28px rgba(10,14,20,.10); }
          .faq:hover .faqq { color: ${C.gold}; }
          .faq:hover .chev { color: ${C.gold}; border-color: ${C.goldFill}88; }
        }
        input:focus, select:focus { border-color: ${C.goldFill} !important; }
        select option { background: #FFFFFF; color: ${C.text1}; }
        .storycard { transition: box-shadow .3s ease, border-color .3s ease, transform .3s ease; }
        @media (hover: hover) and (pointer: fine) {
          .storycard:hover { transform: translateY(-3px); border-color: ${C.goldFill} !important;
            box-shadow: 0 0 0 1px ${C.goldFill}66, 0 0 44px rgba(200,162,78,.38), 0 18px 36px rgba(10,14,20,.12) !important; }
          .storycard:hover .chev { color: ${C.gold}; border-color: ${C.goldFill}; box-shadow: inset 0 1px 0 rgba(255,255,255,.95), 0 0 16px ${C.goldFill}55, 0 6px 14px rgba(10,14,20,.08); }
        }
        /* the same edge, given by scroll position rather than by a cursor */
        /* one smooth hover for every card that lifts, the same as the FAQ tiles */
        [data-lit]:not(.flip) { transition: border-color .3s ease, box-shadow .3s ease, transform .3s ease, background .3s ease; }
        .flip .face { transition: border-color .35s ease, box-shadow .35s ease; }
        [data-lit]:not(.flip).lit { border-color: rgba(200,162,78,.6) !important; box-shadow: 0 0 30px rgba(200,162,78,.22), 0 10px 28px rgba(10,14,20,.08) !important; }
        /* Keep the highlight on the rotating faces, not the stationary flip wrapper behind them. */
        .flip.lit .face { border-color: rgba(200,162,78,.6) !important; box-shadow: 0 0 30px rgba(200,162,78,.22) !important; }
        @media (hover: hover) and (pointer: fine) { .storybtn:hover { background: linear-gradient(90deg, #FBF3DF 0%, #FFFFFF 70%); } }

        .flip { perspective: 1400px; }
        .flip-inner { position: relative; transform-style: preserve-3d; transition: transform .6s cubic-bezier(.4,0,.2,1); height: 100%; }
        .flip:hover .flip-inner, .flip-inner.flipped { transform: rotateY(180deg); }
        .cue-tap { display: none; }
        .face { position: absolute; inset: 0; backface-visibility: hidden; -webkit-backface-visibility: hidden; }
        .face.back { transform: rotateY(180deg); }

        @media (max-width: 980px) {
          .split { flex-direction: column !important; }
          .split.rev { flex-direction: column-reverse !important; }
          .splitvis { width: 100% !important; max-width: 460px; margin: 0 auto; }
          .stagerow { flex-direction: column !important; }
          .stagearrow { transform: rotate(90deg); align-self: center; padding: 4px 0; }
          .grid3 { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 980px) {
          /* stacked pills, centred, with the arrow pointing down at the next one */
          .pillrow { flex-direction: column !important; align-items: center !important; gap: 10px !important; }
          .orderitem { flex-direction: column !important; align-items: center !important; gap: 10px !important; }
          .pillarrow { transform: rotate(90deg); margin: 0; }
          /* the niche list reads better centred once it's no longer beside the cards */
          .nichecol { text-align: center; }
          /* the niche list lines up with the cards above it rather than floating centred */
          .nichecol { max-width: none !important; margin: 0 !important; text-align: left; }
          .nichegrid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; gap: 20px 14px !important; }
          .nichegrid > div { justify-content: flex-start; }
          .capline2 { display: block; }
          .roadcap { white-space: normal !important; }
        }
        @media (max-width: 640px) { .grid2 { grid-template-columns: 1fr !important; } }
        /* phones: a smaller tile, chevron and gaps give the story titles the width to fit two lines */
        @media (max-width: 520px) {
          .storybtn { padding: 18px 16px 18px 16px !important; gap: 10px !important; }
          .storyhead { gap: 12px !important; }
          .storyhead .ptile { width: 44px !important; height: 44px !important; border-radius: 12px !important; }
          .storyhead .ptile img { width: 31px !important; height: 31px !important; }
          .storybtn .chev { width: 34px; height: 34px; }
          .storytitle { font-size: 20px !important; letter-spacing: -.005em; }
        }

        /* The bio runs long. On a phone show the opening and let the reader choose
           the rest, rather than handing them a wall of text mid-page. */
        @media (max-width: 760px) {
          .biopic { float: none !important; width: 100% !important; max-width: 280px; margin: 0 auto 18px !important; display: block; }
          /* opens smoothly, the same way the story cards do */
          .biomore { position: relative; max-height: 210px; overflow: hidden; transition: max-height .7s cubic-bezier(.4,0,.2,1); }
          .biomore::after { content: ""; position: absolute; left: 0; right: 0; bottom: 0; height: 130px; transition: opacity .45s ease;
            background: linear-gradient(to bottom, rgba(242,238,230,0), rgba(242,238,230,.88) 60%, #F2EEE6); pointer-events: none; }
          .biomore.open { max-height: var(--bioh, 2600px); }
          .biomore.open::after { opacity: 0; }
          /* a porcelain button, like the tiles */
          .biotoggle { display: block !important; background: linear-gradient(180deg,#FFFEFB 0%,#F5EFE3 100%) !important; border: 1px solid #E6DFD1 !important;
            box-shadow: inset 0 1px 0 rgba(255,255,255,.95), 0 1px 2px rgba(10,14,20,.06), 0 8px 18px rgba(10,14,20,.10), 0 0 18px rgba(200,162,78,.16); }
          .biotoggle:active { transform: translateY(1px); box-shadow: inset 0 1px 0 rgba(255,255,255,.95), 0 1px 2px rgba(10,14,20,.08), 0 0 22px rgba(200,162,78,.3); }
        }
        @media (hover: none) { .cue-hover { display: none; } .cue-tap { display: inline; } }
      `}</style>
    </div>
  );
}
