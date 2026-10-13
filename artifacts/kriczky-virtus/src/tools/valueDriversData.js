/* ═══════════════════════════════════════════════════════════════
   VALUE DRIVERS — shared data
   One source for the flow, both next pages and the report.
   The ten drivers, zones and thresholds match workbook page 7
   (Walking to Destiny's 45 / 58 / 67 / 72%, growth-framed names).
   Keys match WMBW.jsx so a stored report pre-fills that document.
   ═══════════════════════════════════════════════════════════════ */

export const C = {
  bgDeep: "#0A0E14", bgCard: "#111720", bgElev: "#1A2130",
  gold: "#C8A24E", goldLight: "#D4B665",
  green: "#34D399", cyan: "#22D3EE", red: "#F87171", amber: "#FBBF24",
  text1: "#E8ECF1", text2: "#8B95A5", text3: "#5A6474", text4: "#3D4654",
};

export const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

/* Pillar accents follow WMBW: Attractiveness cyan, Readiness gold. */
export const PILLARS = {
  attract: { label: "Attractiveness", long: "Business Attractiveness", color: C.cyan },
  ready:   { label: "Readiness",      long: "Business Readiness",      color: C.gold },
};
export const PILLAR_MAX = 30;

export const ATTRACT_KEYS = ["marketPosition", "revenueQuality", "financialPerformance", "customerConcentration", "managementTeam"];
export const READY_KEYS = ["documentation", "contingency", "financialInfra", "revPredictability", "succession"];
export const DRIVER_KEYS = [...ATTRACT_KEYS, ...READY_KEYS];

/* Short names as printed on workbook page 7, in the same order. */
export const DRIVER_NAMES = {
  marketPosition: "Market Position",
  revenueQuality: "Revenue Quality & Growth",
  financialPerformance: "Financial Performance & Margins",
  customerConcentration: "Customer Concentration",
  managementTeam: "Operational Independence",
  documentation: "Documentation",
  contingency: "Contingency & Risk",
  financialInfra: "Financial Reporting",
  revPredictability: "Revenue Predictability",
  succession: "Leadership Depth",
};

/* Zones by total /60. Same cut points as workbook page 7. */
export const ZONES = [
  { key: "foundation",  label: "Foundation Zone",  min: 10, max: 26, color: C.red,
    line: "The business can't grow unless you carry it. Build the base first — it's where small changes move the needle the most." },
  { key: "constrained", label: "Constrained Zone", min: 27, max: 34, color: C.amber,
    line: "It's growing, but gaps in the foundation constrain how far and how fast. The gaps are specific, which means they're fixable." },
  { key: "midpoint",    label: "Midpoint Zone",    min: 35, max: 39, color: C.gold,
    line: "The model works but isn't nailed yet. Scaling from here amplifies the gaps along with the strengths." },
  { key: "green",       label: "Green Zone",       min: 40, max: 42, color: C.green,
    line: "Attractive and ready. The model is nailed and built to scale — the work now is protecting that and pushing the two lowest drivers up so that continued growth is sustainable." },
  { key: "bestInClass", label: "Best-in-Class",    min: 43, max: 60, color: C.cyan,
    line: "Scalable, resilient, and it runs without you. Few owners get here. The job now is keeping it there as the business grows." },
];
export const zoneFor = (total) => ZONES.find(z => total >= z.min && total <= z.max) || ZONES[0];
export const zoneByKey = (k) => ZONES.find(z => z.key === k) || null;

export const score = (scores = {}) => {
  const attract = ATTRACT_KEYS.reduce((a, k) => a + (scores[k] || 0), 0);
  const ready = READY_KEYS.reduce((a, k) => a + (scores[k] || 0), 0);
  const total = attract + ready;
  return { attract, ready, total, zone: zoneFor(total) };
};

/* REVENUE BANDS — strings must match ActiveCampaign `Revenue Range` exactly. */
export const REVENUE_BANDS = [
  { value: "Under $500K", label: "Under $500K",   qualified: false },
  { value: "$500K - $1M", label: "$500K – $1M",   qualified: false },
  { value: "$1M - $3M",   label: "$1M – $3M",     qualified: true  },
  { value: "$3M - $10M",  label: "$3M – $10M",    qualified: true  },
  { value: "$10M+",       label: "$10M+",         qualified: true  },
];

/* Authority overrides revenue, same as the Reinvest or Harvest routing. */
export const routeTo = (revenueBand, ownerTier) => {
  if (ownerTier === "Leadership" || ownerTier === "Employee") return "collective";
  const b = REVENUE_BANDS.find(x => x.value === revenueBand);
  return b && b.qualified ? "oneToOne" : "collective";
};

/* Score colours, used by the rating buttons and the next-page driver cards.
   Same families as the zones: red 1–2, gold 3–4, green 5, cyan 6. */
export const scoreColor = (n) => {
  if (!n) return C.text4;
  if (n <= 2) return C.red;
  if (n <= 4) return C.gold;
  if (n === 5) return C.green;
  return C.cyan;
};

/* The ten drivers, one per screen, rated 1–6 — the same content as the
   /tools/wmbw document (WMBW.jsx ATTRACT_DIMS / READY_DIMS): description,
   "check what's true today" statements, then Rate Yourself. Self-rating on a
   1–6 scale with no middle, rather than picking a pre-written answer.
   ⚠️ If the copy changes in WMBW.jsx, change it here too. */
export const DRIVER_STEPS = [
  { type: "rate", key: "marketPosition", pillar: "attract",
    title: "Market Position & Competitive Advantage",
    subtitle: "ARE YOU DOMINANT IN A DEFINED MARKET, OR REPLACEABLE?",
    description: "A regional HVAC company that owns 35% of commercial contracts in its metro area commands a fundamentally different multiple than one competing on price against 40 other contractors. A cybersecurity firm with three patents and a proprietary threat-detection algorithm isn't just another vendor — it's a strategic acquisition target. Buyers don't pay premiums for market participants. They pay premiums for market leaders who have built defensible positions through specialization, intellectual property, brand recognition, or geographic dominance that would take a competitor years to replicate.",
    checklist: [
      { text: "I can clearly articulate my competitive moat — and it's more than 'great service'", sub: "Think: patents, proprietary processes, exclusive contracts, brand equity, regulatory advantages, or a network effect." },
      { text: "My market share is measurable and I know what percentage of my addressable market I own", sub: "If you can't quantify your position, neither can a buyer. 'We're well-known' is not evidence." },
      { text: "A competitor couldn't replicate my core advantage in less than 3 years", sub: "Time-to-replicate is the truest test of a moat. If someone could rebuild your advantage in 6 months, it's not a moat." },
      { text: "I operate in a market with identifiable growth tailwinds, not just survival dynamics", sub: "Buyers want to acquire growth trajectories, not turnaround projects. Is your industry expanding or contracting?" },
    ],
    lowLabel: "No defensible position", highLabel: "Dominant, protected moat" },
  { type: "rate", key: "revenueQuality", pillar: "attract",
    title: "Revenue Quality & Growth Trajectory",
    subtitle: "IS YOUR REVENUE RECURRING, DIVERSIFIED, AND GROWING?",
    description: "A managed IT services company billing $200K/month in recurring contracts lives in a different universe than a project-based integrator with the same annual revenue. The recurring model is predictable, bankable, and might be valued at 2–3x the project-based model's multiple. Buyers aren't just buying your current revenue — they're buying the probability that it continues. Revenue that recurs automatically, grows year-over-year, and isn't dependent on heroic sales efforts is the single most powerful driver of premium multiples.",
    checklist: [
      { text: "At least 50% of my revenue is recurring or contractually committed", sub: "Monthly retainers, subscriptions, maintenance contracts, managed services — anything with auto-renewal or multi-year commitment." },
      { text: "My revenue has grown at least 10% year-over-year for the past 3 years (without margins shrinking)", sub: "Flat or declining revenue gets a discount. Growth gets a premium. Consistent growth gets the best multiple." },
      { text: "I can demonstrate pricing power — I've raised prices in the last 12 months without losing customers", sub: "If you can't raise prices, you're competing on cost. If customers stay after increases, you have real value." },
      { text: "My sales pipeline is documented and predictable — I know within 15% what next quarter looks like", sub: "If revenue is a surprise every month, buyers see risk. Predictability is worth more than the revenue itself." },
    ],
    lowLabel: "Project-based, volatile", highLabel: "Recurring, growing, predictable" },
  { type: "rate", key: "financialPerformance", pillar: "attract",
    title: "Financial Performance & Margins",
    subtitle: "ARE YOUR EARNINGS STRONG RELATIVE TO YOUR INDUSTRY?",
    description: "Two businesses in the same industry, both at $4M revenue. One produces $400K in recasted EBITDA (10%). The other produces $800K (20%). At the same multiple, the second business is worth double — and it will likely command a higher multiple too, because strong margins signal operational excellence, pricing power, and scalability. The private capital market assigns multiples partly based on margin performance relative to industry benchmarks. Below-average margins get below-average multiples. Best-in-class margins — especially when they're trending up — justify premium valuations.",
    checklist: [
      { text: "I know my recasted EBITDA (adjusted for owner comp, one-time expenses, and personal perks)", sub: "Raw P&L numbers mean nothing to a buyer. Recasted financials are the starting point of every valuation conversation." },
      { text: "My EBITDA margin is at or above the average for my industry", sub: "Do you know what 'average' is? Industry benchmarking data is available — if you haven't looked, that's a red flag." },
      { text: "My margins have been stable or improving for the past 3 years", sub: "Declining margins, even with growing revenue, tell a buyer the business is becoming less efficient." },
      { text: "I can explain every major line item's trend and trajectory to a financial buyer", sub: "If you can't narrate your financials like a story, a buyer will assume you don't understand your own business." },
    ],
    lowLabel: "Below industry benchmarks", highLabel: "Best-in-class margins" },
  { type: "rate", key: "customerConcentration", pillar: "attract",
    title: "Customer Concentration & Relationships",
    subtitle: "IS YOUR REVENUE DANGEROUSLY CONCENTRATED?",
    description: "If one client accounts for 30% or more of your revenue, many buyers will walk away or demand a steep discount. Customer concentration is risk — pure and simple. A buyer is calculating the probability that those relationships survive the transition. A manufacturing firm where three OEM contracts represent 60% of revenue is one phone call away from catastrophe. Contrast that with a services firm where no client exceeds 8% and the top 20 clients collectively represent 45%. The diversified firm has built something transferable. The concentrated firm has built something fragile.",
    checklist: [
      { text: "No single client represents more than 15% of my total revenue", sub: "Anything above 15% is a yellow flag. Above 25% is a red flag. Above 40% can make your business unsellable at fair value." },
      { text: "My top 10 clients collectively represent less than 50% of revenue", sub: "Even if no single client is dominant, cluster concentration matters." },
      { text: "Client relationships are with my company (contracts, systems, team) not with me personally", sub: "If clients would leave when you leave, you're selling a relationship — not a business." },
      { text: "I have a formal client retention strategy that doesn't depend on the owner", sub: "Account reviews, success metrics, proactive outreach — systematized, not heroic. Run by the team, not by you." },
    ],
    lowLabel: "Dangerously concentrated", highLabel: "Broadly diversified" },
  { type: "rate", key: "managementTeam", pillar: "attract",
    title: "Management Team & Operational Independence",
    subtitle: "CAN THE BUSINESS PERFORM WITHOUT YOU IN THE ROOM?",
    description: "This is the dimension that kills more deals than any other. An owner who is the top salesperson, the final decision-maker, the key client relationship holder, and the cultural linchpin isn't running a business — they're running a job. When they leave, the value leaves with them. Buyers know this. A business with a competent management team that can operate for 90 days without the owner — maintaining (and growing) revenue, serving clients, making decisions — is worth a fundamental premium over one where the owner's absence creates chaos.",
    checklist: [
      { text: "My business has operated profitably for at least 2 weeks without my direct involvement", sub: "Not a vacation where you checked email hourly. Real absence. Could it happen today without revenue dropping?" },
      { text: "I have a second-in-command or leadership team that makes daily decisions without me", sub: "Decision-making authority must be delegated, not just discussed. Are they empowered to act, or do they wait for you?" },
      { text: "Key client relationships are managed by team members, not exclusively by me", sub: "If your top 5 clients have never spoken to anyone but you, you haven't built a transferable asset." },
      { text: "My management team has formal roles, documented responsibilities, and performance metrics", sub: "Org chart, job descriptions, KPIs, regular reviews — the infrastructure of a real management layer, not just titles." },
    ],
    lowLabel: "Owner is the business", highLabel: "Runs without owner" },
  { type: "rate", key: "documentation", pillar: "ready",
    title: "Documentation & Transferability",
    subtitle: "CAN THE MODEL BE REPLICATED WITHOUT YOU?",
    description: "You can't scale what isn't documented, and you can't transfer what lives in your head. Due diligence — whether from a buyer, a lender, or a potential growth partner — will request 200–400 documents: financial statements, contracts, employee records, process documentation, compliance records, IP assignments, and more. Businesses that can produce these in 48 hours signal maturity. Businesses that scramble for weeks signal risk. But documentation isn't just about a future transaction — it's about operational leverage today. Every process that lives in one person's head is a bottleneck you can't scale past, a single point of failure you can't afford, and institutional knowledge that walks out the door when that person leaves.",
    checklist: [
      { text: "My operational processes are documented in SOPs that employees actually follow", sub: "Not a binder from 2018 sitting on a shelf. Living documents that are referenced, updated, and used for training new hires." },
      { text: "Institutional knowledge is captured in systems, not trapped in people's heads", sub: "If a key employee resigned tomorrow, would the knowledge and processes for running their function disappear with them?" },
      { text: "All contracts, vendor agreements, and leases are current, organized, and accessible", sub: "Could you produce every material contract within 48 hours? Could a new operations leader find and understand every obligation?" },
      { text: "A new senior hire or partner could understand how this business operates within 30 days", sub: "Not by shadowing you — by reading your documentation. That's the test of whether the model is truly replicable." },
    ],
    lowLabel: "Nothing documented", highLabel: "Turnkey, fully replicable" },
  { type: "rate", key: "contingency", pillar: "ready",
    title: "Contingency & Risk Protection",
    subtitle: "CAN THE MODEL SURVIVE WITHOUT YOU?",
    description: "The 5 Ds — Death, Disability, Divorce, Disagreement, and Distress — force exits that owners never planned for. Research shows 50% of business exits are forced by one of these events, not planned. A partner dispute without a buy-sell agreement can destroy a business. An owner's sudden disability without key-person insurance can leave a family with a business they can't run and can't sell. But contingency planning isn't just about catastrophic events — it's about building a business resilient enough to weather any disruption. An owner who has covered the downside can take bigger, bolder growth risks because they know the foundation won't crack. Protecting value is the first step in building value.",
    checklist: [
      { text: "I have a written, funded buy-sell agreement updated in the last 3 years", sub: "Funded means life insurance or a sinking fund actually backs the buyout price. Unfunded agreements are just unenforceable promises on paper." },
      { text: "I have key-person life and disability insurance on myself and critical team members", sub: "If you or your top revenue-generator were suddenly unable to work for 90 days, does the business have the cash to survive the transition?" },
      { text: "I have a formal contingency plan addressing all 5 Ds", sub: "Not just a will. A plan for who runs the business, who makes decisions, and how value is preserved under each scenario — all legally enforceable." },
      { text: "My family and at least one trusted team member know how to access all critical documents and credentials", sub: "In a crisis, the people who need to act shouldn't have to guess how to reach bank accounts, insurance policies, or critical systems." },
    ],
    lowLabel: "No plan for the unexpected", highLabel: "All 5 Ds covered, funded" },
  { type: "rate", key: "financialInfra", pillar: "ready",
    title: "Financial Infrastructure & Reporting Maturity",
    subtitle: "CAN THE MODEL BE MEASURED AND TRUSTED WITHOUT YOU?",
    description: "You can't manage what you can't measure — and you can't scale, raise capital, bring on a partner, or command a premium multiple if your financial reporting is unreliable, delayed, or incomprehensible to anyone but you. A buyer's first diligence request is the financials. A lender's first question is your debt service coverage. A potential partner's first ask is margin by service line. If your books can't answer these questions within 48 hours — cleanly, accurately, and without you personally pulling the numbers — your financial infrastructure is a constraint on everything you're trying to build.",
    checklist: [
      { text: "My financial statements are professionally prepared and current within 30 days", sub: "Compiled or reviewed by a CPA, with clean categorization, proper accrual accounting, and no material adjustments needed." },
      { text: "I receive monthly financial reports I can use to make decisions — without preparing them myself", sub: "P&L, balance sheet, cash flow, AR/AP aging, and margin by service line — delivered to you, not assembled by you." },
      { text: "My financials could survive third-party scrutiny from a buyer, lender, or partner", sub: "Quality of earnings analysis, recasted financials removing owner perks, clean add-backs — could your books withstand professional examination?" },
      { text: "I can produce unit economics and profitability by client, service line, or product", sub: "Revenue by category isn't enough. Knowing which clients, services, or products actually make money — and which destroy margin — is how you scale profitably." },
    ],
    lowLabel: "Flying blind", highLabel: "Investor-grade reporting" },
  { type: "rate", key: "revPredictability", pillar: "ready",
    title: "Revenue Predictability & Contractual Strength",
    subtitle: "CAN THE MODEL SUSTAIN ITSELF WITHOUT YOU?",
    description: "How much of your revenue is secured, contracted, or predictably recurring — and how much depends on you personally closing the next deal? A business where next quarter's revenue is 80%+ visible is fundamentally different from one that starts every month at zero. Predictable revenue lets you hire ahead of demand, invest in infrastructure, take on growth debt confidently, and weather downturns without panic. Unpredictable revenue means every strategic decision is a gamble. Whether you're scaling to $20M or preparing for a future transition, revenue predictability is the foundation that makes everything else possible.",
    checklist: [
      { text: "If I stopped working in the business, leads would still come in and sales would keep closing at the same rates", sub: "If your pipeline depends on your personal network, your reputation, or you being in the room to close — the revenue engine stalls the moment you step away." },
      { text: "My sales pipeline exists in a system, not just in my head or my top salesperson's head", sub: "A CRM with stages, probabilities, and expected close dates. If your pipeline disappears when one person leaves, it's not a pipeline — it's a person." },
      { text: "Client contracts include protective terms like auto-renewal and termination for cause", sub: "Month-to-month with 30 days notice means 100% of your revenue is at risk every 30 days. Contract structure is a strategic decision, not a legal formality." },
      { text: "I could confidently forecast next quarter's revenue within 10% accuracy", sub: "If you can't, neither can a lender evaluating a growth loan or a buyer underwriting an offer. Forecast accuracy is a proxy for business maturity." },
    ],
    lowLabel: "Start at zero every month", highLabel: "80%+ revenue visible forward" },
  { type: "rate", key: "succession", pillar: "ready",
    title: "Management Succession & Key-Person Resilience",
    subtitle: "CAN THE MODEL BE LED WITHOUT YOU?",
    description: "Dimension 5 asked whether your current team can perform without you today. This dimension asks a different question: are you intentionally developing the next generation of leaders who can take this business somewhere you can't take it alone? Succession isn't a one-time event — it's an ongoing investment in leadership depth. Every hour you spend making decisions someone else could make is an hour you're not spending on the work only you can do. The owner who hasn't built a leadership pipeline can't pursue acquisitions, launch new markets, develop strategic partnerships, or simply step back to think strategically. Succession isn't about leaving — it's about building an organization mature enough to grow beyond one person's capacity.",
    checklist: [
      { text: "I have named successor candidates for every key leadership role, and they know it", sub: "Not assumptions — explicit conversations. Development plans with timelines and milestones. If you haven't told them, you don't have a succession plan." },
      { text: "My successors have been given real authority and accountability to develop", sub: "Stretch assignments, P&L ownership, hiring decisions, client-facing responsibility. You build leaders by letting them lead, not by letting them watch." },
      { text: "Every critical business function has a trained backup who could step in within 30 days", sub: "Not just leadership — critical individual contributors too. If your best technician, your head of accounting, or your top producer left, who's next?" },
      { text: "I have a retention strategy specifically designed to keep my highest-potential people", sub: "Stay bonuses, equity participation, career progression, meaningful authority. If your pipeline depends on people who could leave for a 15% raise, it's not a pipeline." },
    ],
    lowLabel: "No pipeline, no backups", highLabel: "Deep bench, leaders developing" },
];

export const INDUSTRY_STEP = {
  type: "choice", key: "industry",
  q: "What kind of business do you run?",
  options: ["Finance", "Healthcare", "Manufacturing", "Professional Services", "Home/Local Services", "Retail", "Education", "Other"]
    .map(t => ({ t, v: t })) };

export const OWNERSHIP_STEP = {
  type: "choice", key: "ownership",
  q: "Are you the owner, or do you have partners?",
  options: [
    { t: "I'm a 100% owner", v: "100% owner", tier: "Owner" },
    { t: "Majority owner (>51%)", v: "Majority owner", tier: "Owner" },
    { t: "50/50 partner", v: "50/50 partner", tier: "Owner" },
    { t: "Minority owner (<50%)", v: "Minority owner", tier: "Owner" },
    { t: "On the leadership team, not an owner", v: "Leadership, not owner", tier: "Leadership" },
    { t: "I'm an employee", v: "Employee", tier: "Employee" },
  ] };

export const TIMING_STEP = {
  type: "choice", key: "timing",
  q: "When you find something worth fixing, how fast do you move?",
  options: [
    { t: "I move on it right away", v: "Immediately" },
    { t: "Within a month or two", v: "1-2 months" },
    { t: "Sometime this year", v: "This year" },
    { t: "I usually sit on things", v: "Slow" },
  ] };

export const REVENUE_STEP = {
  type: "choice", key: "revenue",
  q: "How much did your business make in the last 12 months?",
  sub: "Last question.",
  options: REVENUE_BANDS.map(b => ({ t: b.label, v: b.value })) };

const HOW = { type: "interstitial", kicker: "How this works",
  title: "Two lenses, scored separately.",
  body: [
    { label: "Attractiveness", color: C.cyan, text: "How your business looks from the outside — position, revenue, margins, customers, and whether it performs without you." },
    { label: "Readiness", color: C.gold, text: "Whether it's built to scale without breaking — documented, protected, measured, predictable, and led by more than one person." },
  ],
  foot: "You can't control the range your industry is valued in. You can control where you land in it.",
  note: { label: "Why 1–6 instead of 1–5?", text: "Most people default to 3 on a 1–5 scale — it feels safe. A 1–6 scale has no middle. For each driver, check which characteristics describe your business today, then decide: am I below the midpoint or above it?" } };

/* Halfway marker, between the Attractiveness and Readiness drivers.
   ⚠️ CCO: stat and attribution to confirm before launch. */
const MID = { type: "interstitial", kicker: "One number worth sitting with",
  statPre: "Only",
  stat: "20–30%",
  title: "of businesses that go to market actually sell.",
  cite: "Source: Exit Planning Institute.",
  foot: "The problem is typically that the businesses aren't ready to scale or sell, not that they're unattractive businesses. The next five drivers ask whether your business is built to scale, or transfer, without you." };

const PROMISE = { type: "interstitial", kicker: "Almost there",
  title: "What you're about to get.",
  list: [
    "Your zone — where your business lands today",
    "Separate Attractiveness and Readiness scores",
    "The two drivers holding your value back",
    "Three moves calibrated to how you actually scored",
  ] };

/* Website door: contact first, full profile, revenue last.
   Workshop door: contact skipped when the email link carries it, and no
   revenue or timing — registration already captured both. */
export const buildSteps = (door, haveContact) => {
  const contact = haveContact ? [] : [{ type: "contact" }];
  const drivers = [...DRIVER_STEPS.slice(0, 5), MID, ...DRIVER_STEPS.slice(5)];
  if (door === "workshop") {
    return [...contact, HOW, ...drivers, INDUSTRY_STEP, OWNERSHIP_STEP, { type: "final" }];
  }
  return [...contact, HOW, ...drivers, INDUSTRY_STEP, OWNERSHIP_STEP, TIMING_STEP, PROMISE, REVENUE_STEP, { type: "final" }];
};

export const NEXT_PATH = {
  site: "/tools/wmbw/next",
  workshop: "/workshop-rh/value-drivers/next",
};
