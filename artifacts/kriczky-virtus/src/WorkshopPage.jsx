import { useState, useEffect } from "react";
/* Icons are the Virtus metallic set — three-pass SVGs from the icon recipe,
   served as files. They carry their own gradients, filters and glow, so they
   are referenced as <img> rather than inlined: inlining several would collide
   their gradient IDs. No icon library is needed. */
const ICON = (slug) => `/img/icons/${slug}-metallic.svg`;

/* Reinvest or Harvest Workshop — /workshop-rh
   Cold-traffic build: problem → framework → what you leave with → authority →
   client stories → proof → fit → FAQ → deposit → form.
   Sections alternate left / centre / right rather than stacking centred.

   Flow: form → /api/lead-capture (tag 90) → Stripe deposit → Stripe Zap applies
   tag 91 and writes Workshop Date (field 14), which starts the emails. */

const EVENT = {
  date: null,                         // e.g. "Thursday, March 12, 2027"
  time: "Noon – 5:00 PM",
  venueLine1: "430 Hannum Ave",
  venueLine2: "West Chester, PA 19380",
  mapUrl: "https://www.google.com/maps/dir/?api=1&destination=430%20Hannum%20Ave%2C%20West%20Chester%2C%20PA%2019380%2C%20USA",
  seats: 20,
  fullPrice: "$2,000",
};
const DEPOSIT_URL = "https://book.stripe.com/5kQ3cvg3l8Pv9QH2bIcEw08";

/* ⚠️ PLACEHOLDER TESTIMONIALS — replace with real ones. Structure only.
   `connection` is required on every entry: attendees receive a workshop priced
   at $2,000 and a $6,000 Wealth Roadmap for nothing, which is a material
   connection a reader should know about. Business side only — nothing touching
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
const APPETITE = ["Strong", "Depends on the plan", "None — I'll run it myself"];

const C = {
  bgDeep: "#0A0E14", gold: "#C8A24E", goldMuted: "#A68A42",
  green: "#34D399", cyan: "#22D3EE", red: "#F87171",
  text1: "#E8ECF1", text2: "#8B95A5", text3: "#5A6474", text4: "#3D4654",
  border1: "rgba(255,255,255,0.06)", border2: "rgba(255,255,255,0.10)",
};
const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

/* Each stage carries what sits underneath it — shown on the back of the card. */
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
  ["Stations 01 to 03, done", "Reinvest or Harvest, Know Your Numbers, and Find The Constraint — worked on your numbers, not in theory."],
  ["Your 90-day sprint", "Three moves, the weekly signal that tells you each one is working, and what you do before Friday."],
  ["Your workbook and Sprint Ledger", "A workbook printed with your name on the cover, and the Ledger you bring back every quarter."],
  ["Your Personalized Wealth Roadmap", "A personal wealth tactical playbook through Kriczky Wealth Management LLC. Owners normally pay $6,000. Included for everyone who attends."],
];

const SLIDES = [
  ["/img/workshop/roadmap.png", "Stations 01 to 03, done"],
  ["/img/workshop/sprint.jpg", "Your 90-day sprint"],
  ["/img/workshop/books.png", "Your workbook and Sprint Ledger"],
  ["/img/workshop/wealth.jpg", "Your Personalized Wealth Roadmap"],
];

const AGENDA = [
  ["12:00", "Lunch — provided"],
  ["1:00", "Where your next dollar of profit actually goes"],
  ["1:30", "Your two scores, and the direction they’re heading"],
  ["2:10", "Your three gaps and your value drivers"],
  ["2:55", "The one stage capping everything else"],
  ["3:35", "Your vision, and the “One Thing” that decides next year"],
  ["4:05", "Your 90-day plan, and the first move this week"],
  ["5:00", "Happy hour — food and drinks provided"],
];

/* One mark per niche. */
const INDUSTRIES = [
  ["Landscaping", "landscaping"], ["Residential remodeling", "remodeling"],
  ["Manufacturing", "manufacturing"], ["Auto repair", "auto-repair"],
  ["Physical therapy", "physical-therapy"], ["SaaS", "saas"],
  ["Accounting", "accounting"], ["Marketing agency", "marketing"],
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
    diagnosis: "But after we dug into the details in their business, the actual constraint was Stage 1 — Qualified Leads, and more specifically that they didn’t have an acquisition channel that they could control how many qualified leads came to them. You could see it in that they were entirely dependent on organic marketing.",
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
    industry: "Residential remodeling",
    thought: "Stage 3 · Capacity to Fulfill",
    actual: "2",
    open: "A residential remodeling company (kitchen, bathroom, basement, and more) was convinced the problem was Stage 3, and was about to take on a lot of debt to bring in new technicians, trucks, and inventory.",
    diagnosis: "Instead, when we looked at their situation, the actual problem was Stage 2 — Capacity to Sell. We identified which of their services was the most profitable, which also was the service they were best at selling, fastest at delivering, and extremely profitable at acquiring through paid ads.",
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
  ["Is this a pitch?", "No. You spend the afternoon on your own business. At the end I’ll show you two ways to keep working together if you want them — nothing before that."],
  ["Do I need to bring my numbers?", "After you reserve your seat we send you two links, each a brief series of tailored questions. They let us build custom analysis reports for your business, benchmarked against your own industry's data — so the afternoon is about you rather than about averages. If you don't get to them beforehand, bring rough numbers instead: last year's revenue, your net margin, what you took out in the last 90 days, and roughly what you hold in personal investments. Ranges are fine, and nobody audits anything. For the most personalized experience, just click the two links and answer the questions."],
  ["It’s really free? What’s the catch?", `This workshop is built to be a ${EVENT.fullPrice} ticket. The first rooms are free because they’re the first — I’d rather fill the room and learn from it than charge for version one. Nothing is asked in return.`],
  ["Who else is in the room?", "About twenty owners at a similar scale, roughly half of them people I already work with. You’re seated by where you landed on the scorecard, not by revenue."],
  ["What if I can’t stay the whole afternoon?", "Come to the next one instead. Each block builds on the one before it, and leaving at three means leaving without the plan."],
  ["Is this right for my industry and revenue tier?", `We've worked with owners across ${SECTORS.map(x => x[0]).join(", ")} — and across every revenue tier from ${TIERS[0].toLowerCase()} to ${TIERS[TIERS.length - 1]}. What changes between tiers is what actually drives the reinvest-or-harvest decision, and how much to put back in. We've helped owners at each of these stages work out what matters most where they are, and align it with the long-term outcome they want — personally and inside the business.`],
  ["What happens afterwards?", "You leave with a 90-day plan, your workbook and your Sprint Ledger. Everyone is offered a free Execution Debrief — sixty minutes, one to one, to decide what gets executed first. It’s also how your Wealth Roadmap starts."],
];

/* Brand SVGs, inlined — same assets as the workbook and Ledger. */
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

const Shield = ({ size = 30 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none"
    style={{ filter: "drop-shadow(0 0 12px rgba(200,162,78,0.38)) drop-shadow(0 0 4px rgba(200,162,78,0.56))" }}>
    <path d="M32 8L14 16V30C14 42 22 52 32 56C42 52 50 42 50 30V16L32 8Z" fill="none" stroke={C.gold} strokeWidth="2.5" strokeLinejoin="round" />
    <path d="M32 12L18 18.5V30C18 39.5 24 47.5 32 51C40 47.5 46 39.5 46 30V18.5L32 12Z" fill="none" stroke={C.gold} strokeWidth="1" opacity="0.4" strokeLinejoin="round" />
  </svg>
);

/* One place decides how every icon on the page is stroked and lit. */
const Mark = ({ of: slug, size = 40 }) => (
  <img src={ICON(slug)} alt="" width={size} height={size}
    style={{ flexShrink: 0, display: "block", width: size, height: size }} />
);

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
const card = { padding: "clamp(22px,3.4vw,30px)", borderRadius: 18, background: "linear-gradient(145deg, rgba(255,255,255,.045), rgba(255,255,255,.015))",
  border: `1px solid ${C.border2}`, borderTop: "1px solid rgba(255,255,255,.12)", boxShadow: "0 10px 40px rgba(0,0,0,.42)" };
const input = { width: "100%", boxSizing: "border-box", padding: "14px 16px", borderRadius: 10, fontSize: 16, fontFamily: "'DM Sans',sans-serif",
  background: "rgba(255,255,255,.04)", border: `1px solid ${C.border2}`, color: C.text1, outline: "none", colorScheme: "dark" };
const label = { display: "block", fontSize: 12.5, fontWeight: 600, color: C.text2, margin: "0 0 7px" };
const errStyle = { color: C.red, fontSize: 12.5, lineHeight: 1.4, margin: "6px 0 0" };
const Err = ({ msg }) => (msg ? <p style={errStyle}>{msg}</p> : null);
const Sec = ({ children, style, id }) => <section id={id} style={{ padding: "clamp(34px,5.5vw,62px) 0", ...style }}>{children}</section>;

/* Lives at module scope so it isn't a new component on every render — a new
   identity remounts the subtree and kills focus in whatever input is being typed in. */
const toForm = (e) => {
  e.preventDefault();
  document.getElementById("register")?.scrollIntoView({ behavior: "smooth", block: "start" });
};

const CTA = ({ note = true, align = "center" }) => (
  <div style={{ textAlign: align }}>
    <a href="#register" onClick={toForm} className="cta" style={{ display: "inline-block", padding: "24px 60px", borderRadius: 999, textDecoration: "none",
      background: `linear-gradient(135deg, ${C.gold}2e, ${C.gold}12)`, border: `1.5px solid ${C.gold}88`, boxShadow: `0 0 40px ${C.gold}1f` }}>
      <span style={{ fontWeight: 700, fontSize: "clamp(17.5px,2.5vw,21.5px)", color: C.gold }}>Reserve Your Seat &#8594;</span>
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
  <div style={{ padding: "14px 16px", borderRadius: 12, border: `1px solid ${C.border2}`, background: "rgba(255,255,255,.025)" }}>
    <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase", color: C.text3, marginBottom: 5 }}>{k}</div>
    {href ? <a href={href} target="_blank" rel="noopener" style={{ color: C.text1, fontSize: 15, fontWeight: 600, textDecoration: "none", lineHeight: 1.35, display: "block" }}>{v}</a>
          : <div style={{ color: C.text1, fontSize: 15, fontWeight: 600, lineHeight: 1.35 }}>{v}</div>}
    {note && <div style={{ color: C.text3, fontSize: 12.5, lineHeight: 1.4, marginTop: 6 }}>{note}</div>}
  </div>
);

const Tick = ({ children, no }) => (
  <li style={{ display: "flex", gap: 11, alignItems: "flex-start", marginBottom: 12, fontSize: "clamp(15px,2vw,16.5px)", lineHeight: 1.6, color: no ? "#C98B8B" : C.text2 }}>
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 3 }}>
      {no ? <path d="M6 6L18 18M18 6L6 18" stroke={C.red} strokeWidth="2.2" strokeLinecap="round" />
          : <path d="M4 12.5L9.5 18L20 6.5" stroke={C.green} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />}
    </svg><span>{children}</span></li>
);

const StageChip = ({ n, small }) => {
  const s = STAGES.find(x => x.n === n);
  return <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", height: small ? 28 : 34, padding: small ? "0 12px" : "0 15px", borderRadius: 999,
    border: `1px solid ${s.c}55`, background: `${s.c}12`, fontSize: small ? 12.5 : 14, fontWeight: 600, color: s.c, whiteSpace: "nowrap", boxSizing: "border-box" }}>
    Stage {s.n} &middot; {s.name}</span>;
};

export default function WorkshopPage() {
  const [f, setF] = useState({ firstName: "", lastName: "", email: "", phone: "", business: "",
                               revenue: "", outcome: "", appetite: "" });
  const [state, setState] = useState("idle");
  const [openQ, setOpenQ] = useState(null);   /* all closed until clicked */
  const [flipped, setFlipped] = useState([]);  /* tap-to-flip, for touch screens */
  const [slide, setSlide] = useState(0);
  const [slideHeld, setSlideHeld] = useState(false);
  const [openStory, setOpenStory] = useState(null);   /* all closed until clicked */

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
    outcome:   f.outcome  ? "" : "Please choose one",
    appetite:  f.appetite ? "" : "Please choose one",
  };
  const valid = !Object.values(errors).some(Boolean);

  const fieldStyle = (k) => ({ ...input, borderColor: touched && errors[k] ? `${C.red}99` : C.border2 });

  const submit = async () => {
    if (state === "sending") return;
    if (!valid) { setTouched(true); return; }   /* show what's missing rather than doing nothing */
    setState("sending");
    /* Opened before the await: a tab opened after an async gap gets blocked as a popup. */
    const tab = window.open("", "_blank");
    try {
      const r = await fetch("/api/lead-capture", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tool: "workshop-registration",
          firstName: f.firstName.trim(), lastName: f.lastName.trim(),
          email: f.email.trim(), phone: f.phone.trim(), company: f.business.trim(),
          printName: `${f.firstName.trim()} ${f.lastName.trim()}`,
          revenue: f.revenue, outcome: f.outcome, appetite: f.appetite,
        }),
      });
      if (!r.ok) throw new Error(String(r.status));
      const q = new URLSearchParams({ prefilled_email: f.email.trim(), client_reference_id: "workshop" });
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
      <div style={{ position: "fixed", inset: 0, backgroundImage: GRAIN, backgroundSize: "128px 128px", opacity: .05, mixBlendMode: "overlay", pointerEvents: "none", zIndex: 1 }} />
      <div style={{ position: "fixed", top: "-14%", left: "50%", transform: "translateX(-50%)", width: "min(1100px,150vw)", height: 560,
        background: `radial-gradient(ellipse at center, ${C.gold}14 0%, transparent 66%)`, pointerEvents: "none", zIndex: 0 }} />

      <div style={{ position: "relative", zIndex: 2 }}>
        <div style={{ ...wrap, paddingTop: 30, display: "flex", justifyContent: "center", alignItems: "center", gap: 12 }}>
          <Shield />
          <span style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 21, letterSpacing: ".14em", color: C.text1 }}>
            KRICZKY <span style={{ color: C.goldMuted }}>VIRTUS</span></span>
        </div>

        {/* ── HERO — centred ── */}
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
              <Meta k="Time" v={EVENT.time} note="Happy Hour afterwards — food and drinks covered" />
              <Meta k="Where" v={`${EVENT.venueLine1} ${EVENT.venueLine2}`} href={EVENT.mapUrl} />
              <Meta k="Cost" v="Free" />
            </div>
          </div>
        </Sec>

        {/* ── INDUSTRIES BANNER — scrolls continuously, right to left ── */}
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
                      <Mark of={d} size={44} />
                      <span style={{ fontSize: 16, fontWeight: 500, color: C.text1 }}>{name}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── THE PROBLEM — text left, barbell right ── */}
        <Sec>
          <div style={{ ...wrap, display: "flex", gap: "clamp(24px,4vw,56px)", alignItems: "center" }} className="split">
            <div style={{ flex: "1 1 0" }}>
              <Head kicker="The problem">Every dollar of profit goes one of <span style={EM}>two places</span></Head>
              <p style={P}>Back into the business, or out to you. Most owners load one end for years and never notice the other is empty — because every single decision to reinvest was the right one at the time.</p>
              <p style={{ ...P, marginTop: 14 }}>Ten years of good decisions later, the business is worth something and the owner isn’t. That’s the trade almost nobody sits down and makes on purpose. This afternoon is where you make it deliberately.</p>
            </div>
            <div style={{ flex: "0 0 auto", width: "min(46%, 420px)" }} className="splitvis">
              <Icon name="Barbell" size="100%" />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontSize: 11, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase" }}>
                <span style={{ color: C.gold }}>Into the company</span><span style={{ color: C.green }}>Out to you</span>
              </div>
            </div>
          </div>
        </Sec>

        {/* ── THE FRAMEWORK — centred, full-width cards that flip ── */}
        <Sec>
          <div style={wrap}>
            <Head kicker="The framework" align="center"
              sub="Three stages carry every business. The first one that breaks as demand rises is the only thing worth working on — everything else is effort spent on a problem you don’t have yet.">
              The 3-Stage Constraint <span style={EM}>Framework</span>
            </Head>
            <div className="stagerow" style={{ display: "flex", alignItems: "stretch", gap: 10, marginTop: 34 }}>
              {STAGES.map((s, i) => (
                <div key={s.n} style={{ display: "contents" }}>
                  <div className="flip" style={{ flex: "1 1 0", minWidth: 0 }}
                    onClick={() => setFlipped(p => p.includes(s.n) ? p.filter(x => x !== s.n) : [...p, s.n])}>
                    <div className={`flip-inner${flipped.includes(s.n) ? " flipped" : ""}`} style={{ minHeight: 340 }}>
                      <div className="face" style={{ ...card, borderColor: `${s.c}44`, display: "flex", flexDirection: "column" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 38, color: s.c, lineHeight: 1 }}>{s.n}</div>
                          <Mark of={s.icon} size={64} />
                        </div>
                        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: "clamp(22px,2.6vw,27px)", color: C.text1, margin: "12px 0 10px", lineHeight: 1.1 }}>{s.name}</div>
                        <p style={{ fontSize: 15, lineHeight: 1.6, color: C.text2, margin: 0 }}>{s.what}</p>
                        <p style={{ fontSize: 13.5, lineHeight: 1.55, color: C.text3, fontStyle: "italic", margin: "auto 0 0", paddingTop: 12 }}>The tell: {s.tell}</p>
                        <div style={{ fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase", color: C.text4, marginTop: 12 }}>
                          <span className="cue-hover">Hover</span><span className="cue-tap">Tap</span> to see what’s underneath</div>
                      </div>
                      <div className="face back" style={{ ...card, borderColor: `${s.c}44`, overflow: "hidden" }}>
                        <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase", color: s.c, marginBottom: 8 }}>Sub-bottlenecks</div>
                        {s.sub.map(t => <div key={t} style={{ fontSize: 13.5, lineHeight: 1.45, color: C.text2, padding: "4px 0", borderBottom: `1px solid ${C.border1}` }}>{t}</div>)}
                        <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase", color: C.red, margin: "14px 0 8px" }}>Landmines</div>
                        {s.mines.map(t => <div key={t} style={{ fontSize: 13.5, lineHeight: 1.45, color: "#C98B8B", padding: "4px 0", borderBottom: `1px solid ${C.border1}` }}>{t}</div>)}
                        <p style={{ fontSize: 11.5, lineHeight: 1.45, color: C.text4, margin: "12px 0 0" }}>Examples only — there are more than these underneath each stage.</p>
                      </div>
                    </div>
                  </div>
                  {i < 2 && <div className="stagearrow" style={{ display: "flex", alignItems: "center" }}><Arrow c={s.c} /></div>}
                </div>
              ))}
            </div>
            <p style={{ ...P, textAlign: "center", maxWidth: 680, margin: "26px auto 0" }}>
              Underneath whichever stage binds you sit the sub-bottlenecks causing it — and the landmines that make growth cost more than it returns. You’ll work through both.
            </p>
            <div style={{ marginTop: 34 }}><CTA note={false} /></div>
          </div>
        </Sec>

        {/* ── WHAT YOU LEAVE WITH — pages left, text right ── */}
        <Sec>
          <div style={{ ...wrap, display: "flex", gap: "clamp(24px,4vw,56px)", alignItems: "center" }} className="split">
            <div style={{ flex: "0 0 auto", width: "min(50%, 520px)" }} className="splitvis">
              <div style={{ position: "relative", height: "clamp(300px,36vw,420px)", borderRadius: 14, overflow: "hidden",
                border: `1px solid ${C.border2}`, background: "rgba(255,255,255,.02)" }}>
                {SLIDES.map(([src, cap], i) => (
                  <img key={src} src={src} alt={cap} style={{ position: "absolute", inset: 0, width: "100%", height: "100%",
                    objectFit: "contain", padding: 16, boxSizing: "border-box",
                    opacity: slide === i ? 1 : 0, transition: "opacity .7s ease" }} />
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 14 }}>
                {SLIDES.map(([, cap], i) => (
                  <button key={cap} aria-label={cap} onClick={() => { setSlide(i); setSlideHeld(true); }}
                    style={{ width: slide === i ? 26 : 9, height: 9, borderRadius: 999, border: "none", cursor: "pointer",
                      background: slide === i ? C.gold : "rgba(255,255,255,.18)", transition: "all .3s ease", padding: 0 }} />
                ))}
              </div>
            </div>
            <div style={{ flex: "1 1 0" }}>
              <Head kicker="What you leave with">Not notes. <span style={EM}>A plan.</span></Head>
              {LEAVE_WITH.map(([t, d], i) => (
                <div key={t} onMouseEnter={() => setSlide(i)}
                  style={{ padding: "13px 16px", margin: "0 -16px", borderRadius: 10, cursor: "default",
                    borderBottom: i < 3 ? `1px solid ${C.border1}` : "none",
                    background: slide === i ? "rgba(255,255,255,.04)" : "transparent", transition: "background .3s ease" }}>
                  <div style={{ fontSize: 17.5, fontWeight: 700, color: i === 3 ? C.green : C.text1, marginBottom: 4 }}>{t}</div>
                  <p style={{ fontSize: 14.5, lineHeight: 1.6, color: C.text2, margin: 0 }}>{d}</p>
                </div>
              ))}
            </div>
          </div>
        </Sec>

        {/* ── THE AFTERNOON — text right, roadmap left ── */}
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
                <strong style={{ color: C.text1, fontWeight: 600 }}>Lunch and happy hour are on us.</strong> You won’t spend a dollar on the day &mdash; and the $250 deposit is back in your pocket when you walk in.
              </p>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: C.text3, margin: "10px 0 0" }}>
                Optional pre-work goes out when you register. Do it and the afternoon is built around your numbers; skip it and you’ll catch up in the break.
              </p>
            </div>
            <div style={{ flex: "0 0 auto", width: "min(44%, 420px)" }} className="splitvis">
              <img src="/img/workshop/roadmap.png" alt="The Owner’s Virtus Roadmap" style={{ width: "100%", display: "block" }} />
              <p style={{ fontSize: 12.5, color: C.text3, textAlign: "center", margin: "12px 0 0" }}>The Owner’s Virtus Roadmap. The workshop covers the first three stations.</p>
            </div>
          </div>
        </Sec>

        {/* ── WHO'S RUNNING IT — headshot left, text right, equal height ── */}
        <Sec>
          <div style={{ ...wrap, display: "flex", gap: "clamp(24px,4vw,52px)", alignItems: "center" }} className="split">
            <div style={{ flex: "0 0 auto", width: "min(38%, 400px)" }} className="splitvis">
              {/* ⚠️ REPLIT: /img/edward.jpg — the headshot from the Virtus Collective slide.
                  Square by design: aspectRatio 1 with object-fit cover, so any source crops
                  to a square rather than stretching into a tall strip. */}
              <img src="/img/edward.jpg" alt="Edward Kriczky"
                style={{ width: "100%", aspectRatio: "1 / 1", objectFit: "cover", objectPosition: "center top",
                  borderRadius: 18, border: `1px solid ${C.border2}`, boxShadow: "0 18px 50px rgba(0,0,0,.55)", display: "block" }} />
            </div>
            <div style={{ flex: "1 1 0", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <Head kicker="Who’s running it">A quarterback for every domain of <span style={EM}>your wealth</span></Head>
              <p style={P}>I started out as an aerospace engineer, designing weapons integration systems for US special forces. I went from entry level to co-leading a team of 25 — hiring, scaling the team, and building the comp plans that kept them.</p>
              <p style={{ ...P, marginTop: 13 }}>Then I left to start my own firm. Three years of eighty-hour weeks, married, three kids and a fourth on the way.</p>
              <p style={{ ...P, marginTop: 13 }}>Before any of that, my wife and I finished college with over $100,000 of student debt and went from two incomes to one. For years every dollar went to that debt. We couldn’t buy a home. I ate less than I needed to because I was frightened of the bills, and lost fifteen pounds doing it. I felt like a loser in front of my wife.</p>
              <p style={{ ...P, marginTop: 13 }}>I climbed out of that with almost no help. I don’t want another family in it, and I especially don’t want it for owners, who carry more risk than anyone I know.</p>
              <p style={{ ...P, marginTop: 13, color: C.text1 }}>Here’s what managing money for them taught me: <strong style={{ color: C.gold, fontWeight: 600 }}>roughly 80% of an owner’s net worth sits inside the business.</strong> You can compound the other 20% perfectly and it still won’t decide anything. Almost nobody helps with the 80% — and almost nobody gets the two sides working together instead of rowing in opposite directions.</p>
              <p style={{ ...P, marginTop: 13 }}>Most owners end up with five or ten advisors — an accountant, an attorney, an insurance broker, a banker, someone managing investments — none of whom speak to each other. Each one is paid separately, each sees one slice, and the advice comes back contradicting itself. You end up being the one coordinating all of it, on top of running the company.</p>
              <p style={{ ...P, marginTop: 13, color: C.text1 }}>My job is to be the quarterback across every domain of your financial life, the business included: keeping your existing advisors rowing in the same direction rather than opposite ones. That’s why I built both sides. That’s the barbell.</p>
              <p style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 22, color: C.text1, margin: "20px 0 0" }}>
                Edward Kriczky, <span style={{ color: C.gold }}>CEPA&reg;</span></p>
            </div>
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
              <div key={s.kicker} className="storycard"
                style={{ ...card, marginTop: i ? 16 : 30, padding: 0, overflow: "hidden",
                  borderColor: openStory === i ? `${C.gold}3d` : C.border2 }}>
                <button onClick={() => setOpenStory(openStory === i ? null : i)} className="storybtn"
                  style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 18,
                    padding: "clamp(20px,2.8vw,28px) clamp(22px,3.2vw,32px)", background: "transparent", border: "none",
                    cursor: "pointer", textAlign: "left", fontFamily: "'DM Sans',sans-serif" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 18, minWidth: 0 }}>
                    <Mark of={INDUSTRY_ICON[s.industry]} size={52} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: "clamp(21px,3vw,29px)", lineHeight: 1.14, color: C.text1 }}>{s.kicker}</div>
                      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: C.text3, marginTop: 5 }}>{s.industry} Business</div>
                    </div>
                  </div>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, transform: openStory === i ? "rotate(180deg)" : "none", transition: "transform .3s ease" }}>
                    <path d="M6 9.5L12 15.5L18 9.5" stroke={openStory === i ? C.gold : C.text3} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
                <div style={{ maxHeight: openStory === i ? 2600 : 0, opacity: openStory === i ? 1 : 0, overflow: "hidden",
                  transition: "max-height .6s cubic-bezier(.4,0,.2,1), opacity .4s ease" }}>
                 <div style={{ padding: "0 clamp(22px,3.2vw,32px) clamp(24px,3.4vw,34px)" }}>

                {/* thought vs actual, shown rather than described */}
                <div className="pillrow" style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap", padding: "14px 16px", borderRadius: 12, background: "rgba(255,255,255,.03)", border: `1px solid ${C.border1}`, marginBottom: 18 }}>
                  <div><div style={{ fontSize: 10.5, letterSpacing: ".14em", textTransform: "uppercase", color: C.text4, marginBottom: 6 }}>They thought</div>
                    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", height: 34, padding: "0 15px", borderRadius: 999,
                      border: `1px solid ${C.border2}`, background: "rgba(255,255,255,.03)", fontSize: 14, fontWeight: 600, color: C.text3,
                      textDecoration: "line-through", whiteSpace: "nowrap", boxSizing: "border-box" }}>{s.thought}</span></div>
                  <div className="pillarrow"><Arrow c={C.text4} w={30} /></div>
                  <div><div style={{ fontSize: 10.5, letterSpacing: ".14em", textTransform: "uppercase", color: C.text4, marginBottom: 6 }}>Actually binding</div>
                    <StageChip n={s.actual} /></div>
                </div>

                <p style={{ ...P, fontSize: 15.5 }}>{s.open}</p>
                <p style={{ ...P, fontSize: 15.5, marginTop: 13, color: C.text1 }}>{s.diagnosis}</p>

                <p style={{ ...P, fontSize: 15.5, marginTop: 16 }}>{s.seqLead}</p>
                <ol className="num" style={{ margin: "10px 0 0", padding: 0, listStyle: "none" }}>
                  {s.seq.map((x, n) => (
                    <li key={n} style={{ display: "flex", gap: 13, alignItems: "flex-start", marginBottom: 9 }}>
                      <span style={{ flex: "0 0 auto", width: 26, height: 26, borderRadius: 999, border: `1px solid ${C.gold}66`, background: `${C.gold}12`,
                        display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display',serif", fontSize: 13, color: C.gold }}>{n + 1}</span>
                      <span style={{ fontSize: 15, lineHeight: 1.6, color: C.text2 }}>{x}</span>
                    </li>
                  ))}
                </ol>

                {/* the order of stages, as a path */}
                <div className="pillrow orderrow" style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", margin: "18px 0 0", padding: "14px 16px", borderRadius: 12, background: "rgba(255,255,255,.03)", border: `1px solid ${C.border1}` }}>
                  <span style={{ fontSize: 10.5, letterSpacing: ".14em", textTransform: "uppercase", color: C.text4, marginRight: 4 }}>The order we worked it</span>
                  {s.order.map((n, idx) => (
                    <div key={idx} className="orderitem" style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <StageChip n={n} small />
                      {idx < s.order.length - 1 && <div className="pillarrow"><Arrow c={C.text4} w={22} /></div>}
                    </div>
                  ))}
                </div>

                <p style={{ ...P, fontSize: 15.5, marginTop: 18 }}>{s.outLead}</p>
                <ol className="num" style={{ margin: "10px 0 0", padding: 0, listStyle: "none" }}>
                  {s.out.map((x, n) => (
                    <li key={n} style={{ display: "flex", gap: 13, alignItems: "flex-start", marginBottom: 9 }}>
                      <span style={{ flex: "0 0 auto", width: 26, height: 26, borderRadius: 999, border: `1px solid ${C.green}66`, background: `${C.green}12`,
                        display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display',serif", fontSize: 13, color: C.green }}>{n + 1}</span>
                      <span style={{ fontSize: 15, lineHeight: 1.6, color: C.text2 }}>{x}</span>
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

        {/* ── PROOF — hidden while TESTIMONIALS is empty ── */}
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

        {/* ── FIT — text right, industries left ── */}
        <Sec>
          <div style={wrap}>
            <Head kicker="Is This Right For You?">Who the room is <span style={EM}>for</span></Head>
            <div style={{ display: "flex", gap: "clamp(24px,4vw,56px)", alignItems: "stretch", marginTop: 6 }} className="split rev">
             <div style={{ flex: "1 1 0" }}>
              <div className="grid2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div style={card}><div style={{ ...KICKER, color: C.green, marginBottom: 12 }}>This is for you if</div>
                  <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>{FIT.map(t => <Tick key={t}>{t}</Tick>)}</ul></div>
                <div style={card}><div style={{ ...KICKER, color: C.red, marginBottom: 12 }}>It isn’t if</div>
                  <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>{NOT_FIT.map(t => <Tick key={t} no>{t}</Tick>)}</ul></div>
              </div>
            </div>
            <div style={{ flex: "0 0 auto", width: "min(38%, 350px)", display: "flex", flexDirection: "column" }} className="splitvis nichecol">
              <p style={{ fontSize: 13.5, letterSpacing: ".06em", color: C.text3, margin: "0 0 18px" }}>Example niches of owners we have helped</p>
              <div className="nichegrid" style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignContent: "space-between" }}>
                {INDUSTRIES.map(([name, d]) => (
                  <div key={name} style={{ display: "flex", alignItems: "center", gap: 13 }}>
                    <Mark of={d} size={48} />
                    <span style={{ fontSize: 15, fontWeight: 500, color: C.text1, lineHeight: 1.25 }}>{name}</span>
                  </div>
                ))}
              </div>
             </div>
            </div>
          </div>
        </Sec>

        {/* ── FAQ — accordion ── */}
        <Sec>
          <div style={col}>
            <Head kicker="" align="center">Frequently Asked <span style={EM}>Questions</span></Head>
            <div style={{ marginTop: 26 }}>
              {FAQ.map(([q, a], i) => (
                <div key={q} style={{ borderRadius: 12, border: `1px solid ${openQ === i ? C.gold + "44" : C.border2}`, background: openQ === i ? "rgba(255,255,255,.035)" : "transparent", marginBottom: 10, overflow: "hidden" }}>
                  <button onClick={() => setOpenQ(openQ === i ? -1 : i)} className="faqbtn"
                    style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14, padding: "18px 20px",
                      background: "transparent", border: "none", cursor: "pointer", textAlign: "left", fontFamily: "'DM Sans',sans-serif" }}>
                    <span style={{ fontSize: "clamp(15.5px,2.1vw,17.5px)", fontWeight: 600, color: C.text1 }}>{q}</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, transform: openQ === i ? "rotate(45deg)" : "none", transition: "transform .22s ease" }}>
                      <path d="M12 5v14M5 12h14" stroke={openQ === i ? C.gold : C.text3} strokeWidth="2" strokeLinecap="round" /></svg>
                  </button>
                  {openQ === i && <p style={{ ...P, fontSize: 15.5, padding: "0 20px 20px" }}>{a}</p>}
                </div>
              ))}
            </div>
          </div>
        </Sec>

        {/* ── REGISTER ── */}
        <Sec id="register" style={{ scrollMarginTop: 16, paddingBottom: "clamp(40px,5vw,62px)" }}>
          <div style={{ ...wrap, display: "flex", gap: "clamp(24px,3.4vw,48px)", alignItems: "flex-start" }} className="split">
           <div style={{ flex: "1 1 0", minWidth: 0 }}>
            <Head kicker="Reserve your seat">Free &mdash; <span style={EM}>with a deposit you get back</span></Head>

            <div style={{ ...card, margin: "10px 0 16px", borderColor: `${C.gold}3d` }}>
              <div style={KICKER}>Why there’s a deposit</div>
              <p style={{ ...P, fontSize: 15.5 }}>Before the day, your seat is bought and paid for: lunch is catered by headcount, and a workbook is printed with your name on the cover alongside your Sprint Ledger. None of that can be given to someone else afterwards.</p>
              <p style={{ ...P, fontSize: 15.5, marginTop: 12 }}>The room matters more than any of it. Twenty owners spend an afternoon working on the business instead of in it, and what makes that afternoon worth your time is that everyone else in the room made the same call.</p>
              <p style={{ ...P, fontSize: 15.5, marginTop: 12, color: C.text1 }}>So the deposit is a commitment, not a booking fee. <strong style={{ color: C.green, fontWeight: 600 }}>You get it back in full when you arrive.</strong> <strong style={{ color: C.text1, fontWeight: 600 }}>If you don’t attend, it isn’t refunded.</strong></p>
            </div>

            <div style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "16px 18px", borderRadius: 12, border: `1px solid ${C.border2}` }}>
              <Icon name="NorthStarGold" size={44} style={{ flexShrink: 0, marginTop: -2 }} />
              <div><div style={{ color: C.text1, fontWeight: 600, fontSize: 15 }}>{EVENT.venueLine1}, {EVENT.venueLine2}</div>
                <div style={{ color: C.text3, fontSize: 13.5, marginTop: 4 }}>Happy hour afterward is a short walk into town.</div></div>
            </div>
           </div>

           <div style={{ flex: "1 1 0", minWidth: 0 }}>
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
                  <option value="" style={{ background: C.bgDeep, color: C.text3 }}>Select…</option>
                  {REVENUE.map(r => <option key={r} value={r} style={{ background: C.bgDeep, color: C.text1 }}>{r}</option>)}</select><Err msg={touched && errors.revenue} /></div>
              <div style={{ marginTop: 14 }}><label style={label}>What’s the single biggest money outcome you want in the next 12 months?</label>
                <select style={fieldStyle("outcome")} value={f.outcome} onChange={set("outcome")}>
                  <option value="" style={{ background: C.bgDeep, color: C.text3 }}>Select…</option>
                  {OUTCOMES.map(r => <option key={r} value={r} style={{ background: C.bgDeep, color: C.text1 }}>{r}</option>)}</select><Err msg={touched && errors.outcome} /></div>
              <div style={{ marginTop: 14 }}><label style={label}>If you leave with a 90-day plan you believe in, what’s your appetite for getting help executing it?</label>
                <select style={fieldStyle("appetite")} value={f.appetite} onChange={set("appetite")}>
                  <option value="" style={{ background: C.bgDeep, color: C.text3 }}>Select…</option>
                  {APPETITE.map(r => <option key={r} value={r} style={{ background: C.bgDeep, color: C.text1 }}>{r}</option>)}</select><Err msg={touched && errors.appetite} /></div>

              <button onClick={submit} disabled={state === "sending"} className="cta"
                style={{ width: "100%", marginTop: 24, padding: "22px 18px", borderRadius: 999, cursor: "pointer",
                  background: valid ? `linear-gradient(135deg, ${C.gold}2e, ${C.gold}12)` : "rgba(255,255,255,.04)",
                  border: `1.5px solid ${valid ? C.gold + "88" : C.border2}`, opacity: state === "sending" ? .7 : 1 }}>
                <span style={{ fontWeight: 700, fontSize: "clamp(14.5px,3.6vw,18.5px)", color: valid ? C.gold : C.text2, whiteSpace: "nowrap" }}>
                  {state === "sending" ? "Holding your seat…" : "Continue to the $250 deposit →"}</span>
              </button>
              {touched && !valid && state !== "error" &&
                <p style={{ ...errStyle, textAlign: "center", marginTop: 12 }}>Please fix the fields marked above.</p>}
              {state === "error" && <p style={{ color: C.red, fontSize: 14, textAlign: "center", margin: "12px 0 0" }}>Something went wrong. Please try again, or email growth@kriczkyvirtus.com.</p>}
              {state === "sent" && <p style={{ color: C.green, fontSize: 14, textAlign: "center", margin: "12px 0 0" }}>Your deposit page opened in a new tab. This page stays here.</p>}

              <p style={{ fontSize: 11.5, lineHeight: 1.6, color: C.text3, margin: "16px 0 0" }}>
                By providing your information you consent to Kriczky Virtus, LLC contacting you by phone, text, or email using automated telephone dialing systems and AI to the information provided, even if the phone number is present on a state or national Do Not Call List. We do not sell your personal information. By providing this information you agree to our Privacy Policy and Terms of Service.
              </p>
            </div>

           </div>
          </div>
        </Sec>

        <div style={{ ...wrap, paddingBottom: 60 }}>
          <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${C.border1}, transparent)`, marginBottom: 24 }} />
          <p style={{ fontSize: 11.5, lineHeight: 1.65, color: C.text4, textAlign: "center", maxWidth: 820, margin: "0 auto" }}>
            The workshop is provided by Kriczky Virtus, LLC. The Personalized Wealth Roadmap is an investment advisory service provided by Kriczky Wealth Management LLC, an Investment Advisor in the state of Pennsylvania and Virginia, and requires an advisory agreement; Form ADV is provided before any agreement is signed. Professionals are registered with Kriczky Wealth Management LLC. Edward Kriczky owns both firms, which is a conflict of interest disclosed in Form ADV. You are never required to engage either firm, and you may use any business consultant or investment advisor you choose. Client examples describe individual engagements; individual results vary and are not representative of all clients. No outcome is projected or guaranteed. Nothing on this page is individualized financial, tax, legal, or accounting advice.
          </p>
        </div>
      </div>

      <style>{`
        .marqwrap { overflow: hidden; -webkit-mask-image: linear-gradient(90deg, transparent, #000 9%, #000 91%, transparent);
                    mask-image: linear-gradient(90deg, transparent, #000 9%, #000 91%, transparent); }
        .marq { display: flex; width: max-content; animation: marq 46s linear infinite; }
        @keyframes marq { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @media (prefers-reduced-motion: reduce) { .marq { animation: none; } }

        .cta { transition: all .25s ease; }
        .cta:hover:not(:disabled) { box-shadow: 0 0 48px ${C.gold}33 !important; transform: translateY(-1px); }
        input:focus, select:focus { border-color: ${C.gold}88 !important; }
        select option { background: ${C.bgDeep}; color: ${C.text1}; }
        .faqbtn:hover span { color: ${C.gold}; }
        .storycard { transition: box-shadow .3s ease, border-color .3s ease; }
        .storycard:hover { border-color: rgba(200,162,78,.55) !important; box-shadow: 0 0 34px rgba(200,162,78,.22), 0 10px 40px rgba(0,0,0,.42) !important; }
        .storybtn:hover { background: rgba(255,255,255,.02); }

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
          /* stacked pills need the arrow pointing at the next one, not off to the side */
          .pillrow { flex-direction: column !important; align-items: flex-start !important; gap: 10px !important; }
          .orderitem { flex-direction: column !important; align-items: flex-start !important; }
          .pillarrow { transform: rotate(90deg); margin: 2px 0 2px 14px; }
          /* the niche list reads better centred once it's no longer beside the cards */
          .nichecol { text-align: center; }
          .nichegrid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; gap: 20px 14px !important; }
          .nichegrid > div { justify-content: center; }
        }
        @media (max-width: 640px) { .grid2 { grid-template-columns: 1fr !important; } }
        @media (hover: none) { .cue-hover { display: none; } .cue-tap { display: inline; } }
      `}</style>
    </div>
  );
}
