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
   Descriptions and the 6-end scale labels were rewritten growth-first (13 Oct) and
   now differ from WMBW.jsx on purpose; this file is the source of truth. */
export const DRIVER_STEPS = [
  { type: "rate", key: "marketPosition", pillar: "attract",
    title: "Market Position & Competitive Advantage",
    subtitle: "ARE YOU DOMINANT IN A DEFINED MARKET, OR REPLACEABLE?",
    description: "A regional HVAC company that owns 35% of commercial contracts in its metro area grows on very different terms than one competing on price against 40 other contractors. It wins work without discounting, chooses its customers, and has room to raise prices. A cybersecurity firm with three patents and a proprietary threat-detection algorithm isn't just another vendor; customers seek it out. Market leaders build defensible positions through specialization, intellectual property, brand recognition, or geographic dominance that would take a competitor years to replicate, and that position is what lets growth compound instead of being competed away.",
    checklist: [
      { text: "I can clearly articulate my competitive moat — and it's more than 'great service'", sub: "Think: patents, proprietary processes, exclusive contracts, brand equity, regulatory advantages, or a network effect." },
      { text: "My market share is measurable and I know what percentage of my addressable market I own", sub: "If you can't quantify your position, you can't see how much room is left to grow. 'We're well-known' is not evidence." },
      { text: "A competitor couldn't replicate my core advantage in less than 3 years", sub: "Time-to-replicate is the truest test of a moat. If someone could rebuild your advantage in 6 months, your growth can be competed away." },
      { text: "I operate in a market with identifiable growth tailwinds, not just survival dynamics", sub: "Growth is easier with the wind at your back. Is your industry expanding or contracting?" },
    ],
    lowLabel: "No defensible position", highLabel: "Dominant, protected moat" },
  { type: "rate", key: "revenueQuality", pillar: "attract",
    title: "Revenue Quality & Growth Trajectory",
    subtitle: "IS YOUR REVENUE RECURRING, DIVERSIFIED, AND GROWING?",
    description: "A managed IT services company billing $200K/month in recurring contracts lives in a different universe than a project-based integrator with the same annual revenue. The recurring business starts every month with most of its revenue already in place, so it can hire, invest, and plan ahead with confidence. The project-based business has to win its revenue all over again. Revenue that recurs automatically, grows year over year, and doesn't depend on heroic sales efforts is the most powerful engine for sustainable growth, because every new customer adds to the base instead of replacing one who walked out the door.",
    checklist: [
      { text: "At least 50% of my revenue is recurring or contractually committed", sub: "Monthly retainers, subscriptions, maintenance contracts, managed services: anything with auto-renewal or multi-year commitment." },
      { text: "My revenue has grown at least 10% year-over-year for the past 3 years (without margins shrinking)", sub: "Flat or declining revenue strains everything. Consistent growth with healthy margins is what compounds." },
      { text: "I can demonstrate pricing power — I've raised prices in the last 12 months without losing customers", sub: "If you can't raise prices, you're competing on cost. If customers stay after increases, you have real value to build on." },
      { text: "My sales pipeline is documented and predictable — I know within 15% what next quarter looks like", sub: "If revenue is a surprise every month, every hire and investment is a gamble. Predictability lets you grow on purpose." },
    ],
    lowLabel: "Project-based, volatile", highLabel: "Recurring/reoccurring, growing, predictable" },
  { type: "rate", key: "financialPerformance", pillar: "attract",
    title: "Financial Performance & Margins",
    subtitle: "ARE YOUR EARNINGS STRONG RELATIVE TO YOUR INDUSTRY?",
    description: "Two businesses in the same industry, both at $4M revenue. One produces $400K in recasted EBITDA (10%). The other produces $800K (20%). The second has twice the profit to reinvest, twice the cushion for a bad quarter, and twice the fuel for growth, from the same amount of work. Strong margins signal operational excellence, pricing power, and a model that can scale. Below-average margins mean every dollar of growth costs more than it should. Best-in-class margins, especially when they're trending up, let the business fund its own growth from profits instead of debt.",
    checklist: [
      { text: "I know my recasted EBITDA (adjusted for owner comp, one-time expenses, and personal perks)", sub: "Raw P&L numbers hide what the business really earns. Recasted numbers are the starting point for every good growth decision." },
      { text: "My EBITDA margin is at or above the average for my industry", sub: "Do you know what 'average' is? Industry benchmarking data is available, and it shows how much profit you may be leaving on the table." },
      { text: "My margins have been stable or improving for the past 3 years", sub: "Declining margins, even with growing revenue, mean the business is becoming less efficient as it grows." },
      { text: "I can explain every major line item's trend and trajectory to my team, lender, or partner", sub: "If you can't narrate your financials like a story, it's hard to know which levers to pull next." },
    ],
    lowLabel: "Below industry benchmarks", highLabel: "Net margins are at least 75th percentile for your industry" },
  { type: "rate", key: "customerConcentration", pillar: "attract",
    title: "Customer Concentration & Relationships",
    subtitle: "IS YOUR REVENUE DANGEROUSLY CONCENTRATED?",
    description: "If one client accounts for 30% or more of your revenue, one decision you don't control can undo years of growth. A manufacturing firm where three OEM contracts represent 60% of revenue is one phone call away from catastrophe, and it can't say no to those clients on price, terms, or scope. Contrast that with a services firm where no client exceeds 8% and the top 20 clients together represent 45%. The diversified firm can grow on its own terms. The concentrated firm has built something fragile, where every new hire and investment rests on a few relationships holding.",
    checklist: [
      { text: "No single client represents more than 15% of my total revenue", sub: "Anything above 15% is a yellow flag. Above 25% is a red flag. Above 40% means one client's decision can reset your growth." },
      { text: "My top 10 clients collectively represent less than 50% of revenue", sub: "Even if no single client is dominant, a handful of clients together can still hold your growth hostage." },
      { text: "Client relationships are with my company (contracts, systems, team) not with me personally", sub: "If clients would leave when you leave, the business can only grow as far as your personal relationships reach." },
      { text: "I have a formal client retention strategy that doesn't depend on the owner", sub: "Account reviews, success metrics, proactive outreach: systematized, not heroic. Run by the team, not by you." },
    ],
    lowLabel: "Dangerously concentrated", highLabel: "Broadly diversified" },
  { type: "rate", key: "managementTeam", pillar: "attract",
    title: "Management Team & Operational Independence",
    subtitle: "CAN THE BUSINESS PERFORM WITHOUT YOU IN THE ROOM?",
    description: "This is the driver that holds back more owners than any other. An owner who is the top salesperson, the final decision-maker, the key client relationship holder, and the cultural linchpin isn't running a business; they're running a job. The business can only grow as far as their hours stretch, and it stops when they do. A business with a competent management team that can operate for 90 days without the owner, maintaining and growing revenue, serving clients, and making decisions, keeps growing while the owner works on the business instead of in it.",
    checklist: [
      { text: "My business has operated profitably for at least 2 weeks without my direct involvement", sub: "Not a vacation where you checked email hourly. Real absence. Could it happen today without revenue dropping?" },
      { text: "I have a second-in-command or leadership team that makes daily decisions without me", sub: "Decision-making authority must be delegated, not just discussed. Are they empowered to act, or do they wait for you?" },
      { text: "Key client relationships are managed by team members, not exclusively by me", sub: "If your top 5 clients have never spoken to anyone but you, your growth is capped by your calendar." },
      { text: "My management team has formal roles, documented responsibilities, and performance metrics", sub: "Org chart, job descriptions, KPIs, regular reviews: the infrastructure of a real management layer, not just titles." },
    ],
    lowLabel: "Owner is the business", highLabel: "The business runs and grows without owner" },
  { type: "rate", key: "documentation", pillar: "ready",
    title: "Documentation & Transferability",
    subtitle: "CAN THE MODEL BE REPLICATED WITHOUT YOU?",
    description: "You can't scale what isn't documented, and you can't delegate what lives in your head. A lender, a growth partner, or a new key hire will ask for financial statements, contracts, employee records, and process documentation. Businesses that can produce these in 48 hours signal maturity; businesses that scramble for weeks signal risk. But documentation is really about operational leverage today. Every process that lives in one person's head is a bottleneck you can't grow past, a single point of failure, and institutional knowledge that walks out the door when that person leaves.",
    checklist: [
      { text: "My operational processes are documented in SOPs that employees actually follow", sub: "Not a binder from 2018 sitting on a shelf. Living documents that are referenced, updated, and used for training new hires." },
      { text: "Institutional knowledge is captured in systems, not trapped in people's heads", sub: "If a key employee resigned tomorrow, would the knowledge and processes for running their function disappear with them?" },
      { text: "All contracts, vendor agreements, and leases are current, organized, and accessible", sub: "Could you produce every material contract within 48 hours? Could a new operations leader find and understand every obligation?" },
      { text: "A new senior hire or partner could understand how this business operates within 30 days", sub: "Not by shadowing you, but by reading your documentation. That's the test of whether the model can scale without you." },
    ],
    lowLabel: "Nothing documented", highLabel: "Turnkey, fully replicable" },
  { type: "rate", key: "contingency", pillar: "ready",
    title: "Contingency & Risk Protection",
    subtitle: "CAN THE MODEL SURVIVE WITHOUT YOU?",
    description: "The 5 Ds (Death, Disability, Divorce, Disagreement, and Distress) can stop a growing business overnight. A partner dispute without a buy-sell agreement can tear apart what took years to build. An owner's sudden disability without key-person insurance can leave a family with a business nobody can run. But contingency planning isn't just about catastrophic events; it's about building a business resilient enough to weather any disruption. An owner who has covered the downside can take bigger, bolder growth risks, because one bad event won't undo everything.",
    checklist: [
      { text: "I have a written, funded buy-sell agreement updated in the last 3 years", sub: "Funded means life insurance or a sinking fund actually backs the agreement. Unfunded agreements are just promises on paper." },
      { text: "I have key-person life and disability insurance on myself and critical team members", sub: "If you or your top revenue-generator were suddenly unable to work for 90 days, does the business have the cash to keep going?" },
      { text: "I have a formal contingency plan addressing all 5 Ds", sub: "Not just a will. A plan for who runs the business, who makes decisions, and how it keeps operating under each scenario, all legally enforceable." },
      { text: "My family and at least one trusted team member know how to access all critical documents and credentials", sub: "In a crisis, the people who need to act shouldn't have to guess how to reach bank accounts, insurance policies, or critical systems." },
    ],
    lowLabel: "No plan for the unexpected", highLabel: "All 5 Ds covered, funded" },
  { type: "rate", key: "financialInfra", pillar: "ready",
    title: "Financial Infrastructure & Reporting Maturity",
    subtitle: "CAN THE MODEL BE MEASURED AND TRUSTED WITHOUT YOU?",
    description: "You can't manage what you can't measure, and you can't scale, raise capital, or bring on a partner if your financial reporting is unreliable, delayed, or understandable only to you. A lender's first question is your debt service coverage. A potential partner's first ask is margin by service line. Your own best growth decisions depend on knowing which customers, services, and products actually make money. If your books can't answer these questions within 48 hours, cleanly, accurately, and without you personally pulling the numbers, your financial infrastructure is a constraint on everything you're trying to build.",
    checklist: [
      { text: "My financial statements are professionally prepared and current within 30 days", sub: "Compiled or reviewed by a CPA, with clean categorization, proper accrual accounting, and no material adjustments needed." },
      { text: "I receive monthly financial reports I can use to make decisions — without preparing them myself", sub: "P&L, balance sheet, cash flow, AR/AP aging, and margin by service line: delivered to you, not assembled by you." },
      { text: "My financials could hold up to outside scrutiny from a lender, partner, or investor", sub: "Recasted financials removing owner perks, clean add-backs, numbers that hold up: the kind a lender or partner can rely on." },
      { text: "I can produce unit economics and profitability by client, service line, or product", sub: "Revenue by category isn't enough. Knowing which clients, services, or products actually make money, and which drain margin, is how you scale profitably." },
    ],
    lowLabel: "Flying blind", highLabel: "Investor-grade reporting ready for an independent 3rd-party audit" },
  { type: "rate", key: "revPredictability", pillar: "ready",
    title: "Revenue Predictability & Contractual Strength",
    subtitle: "CAN THE MODEL SUSTAIN ITSELF WITHOUT YOU?",
    description: "How much of your revenue is secured, contracted, or predictably recurring, and how much depends on you personally closing the next deal? A business where next quarter's revenue is 80%+ visible is fundamentally different from one that starts every month at zero. Predictable revenue lets you hire ahead of demand, invest in infrastructure, take on growth debt confidently, and weather downturns without panic. Unpredictable revenue makes every strategic decision a gamble. Whether you're scaling to $20M or building to keep for decades, revenue predictability is the foundation every growth plan stands on.",
    checklist: [
      { text: "If I stopped working in the business, leads would still come in and sales would keep closing at the same rates", sub: "If your pipeline depends on your personal network, your reputation, or you being in the room to close, the revenue engine stalls the moment you step away." },
      { text: "My sales pipeline exists in a system, not just in my head or my top salesperson's head", sub: "A CRM with stages, probabilities, and expected close dates. If your pipeline disappears when one person leaves, it's not a pipeline; it's a person." },
      { text: "Client contracts include protective terms like auto-renewal and termination for cause", sub: "Month-to-month with 30 days notice means 100% of your revenue is at risk every 30 days. Contract structure is a growth decision, not a legal formality." },
      { text: "I could confidently forecast next quarter's revenue within 10% accuracy", sub: "If you can't, you can't plan hiring, inventory, or a growth loan with confidence. Forecast accuracy is a sign of a business that's ready to scale." },
    ],
    lowLabel: "Start at zero every month", highLabel: "80%+ revenue visible forward" },
  { type: "rate", key: "succession", pillar: "ready",
    title: "Management Succession & Key-Person Resilience",
    subtitle: "CAN THE MODEL BE LED WITHOUT YOU?",
    description: "Driver 5 asked whether your current team can perform without you today. This driver asks a different question: are you intentionally developing the next generation of leaders who can take this business somewhere you can't take it alone? Leadership depth isn't a one-time event; it's an ongoing investment. Every hour you spend making decisions someone else could make is an hour you're not spending on the work only you can do. The owner without a leadership pipeline can't open new markets, launch new services, or pursue acquisitions, because every new initiative needs a leader, and right now that leader is always you.",
    checklist: [
      { text: "I have named successor candidates for every key leadership role, and they know it", sub: "Not assumptions: explicit conversations, with development plans, timelines, and milestones. If you haven't told them, you don't have a plan." },
      { text: "My successors have been given real authority and accountability to develop", sub: "Stretch assignments, P&L ownership, hiring decisions, client-facing responsibility. You build leaders by letting them lead, not by letting them watch." },
      { text: "Every critical business function has a trained backup who could step in within 30 days", sub: "Not just leadership: critical individual contributors too. If your best technician, your head of accounting, or your top producer left, who's next?" },
      { text: "I have a retention strategy specifically designed to keep my highest-potential people", sub: "Stay bonuses, equity participation, career progression, meaningful authority. If your bench could leave for a 15% raise, it's not a bench." },
    ],
    lowLabel: "No pipeline, no backups", highLabel: "Deep bench, leaders exist and develop other leaders" },
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
