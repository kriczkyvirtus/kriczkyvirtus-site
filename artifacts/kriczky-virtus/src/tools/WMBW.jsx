import { useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const C = {
  gold: "#C8A24E", goldMuted: "#A68A42", goldLight: "#D4B665",
  green: "#34D399", red: "#F87171", amber: "#FBBF24",
  amberDark: "#D4A017",
  blue: "#60A5FA", cyan: "#22D3EE", purple: "#A78BFA",
  bgDeep: "#0A0E14", bgCard: "#111720", bgElev: "#1A2130",
  text1: "#E8ECF1", text2: "#8B95A5", text3: "#5A6474", text4: "#3D4654",
  border1: "rgba(255,255,255,0.06)", border2: "rgba(255,255,255,0.10)",
  accent: "#22D3EE",
};

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const HEADSHOT = "data:image/jpeg;base64,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";

const NUM_DIMS = 10;
const MAX_SCORE = 60;
const NUM_ATTRACT = 5;
const NUM_READY = 5;
const MAX_PILLAR = 30;

const scoreColor = (n) => {
  if (!n || n <= 0) return C.text4;
  if (n <= 2) return C.red;
  if (n === 3) return C.amber;
  if (n === 4) return C.amberDark;
  if (n === 5) return C.cyan;
  return C.green;
};

const Shield = ({ size = 28, glow = false }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none"
    style={glow ? { filter: `drop-shadow(0 0 12px #C8A24E60) drop-shadow(0 0 4px #C8A24E90)` } : {}}>
    <path d="M32 8L14 16V30C14 42 22 52 32 56C42 52 50 42 50 30V16L32 8Z"
      fill="none" stroke="#C8A24E" strokeWidth="2.5" strokeLinejoin="round"/>
    <path d="M32 12L18 18.5V30C18 40.5 24.5 49 32 52C39.5 49 46 40.5 46 30V18.5L32 12Z"
      fill="rgba(200,162,78,0.06)"/>
    <path d="M25 32L29.5 36.5L40 26"
      stroke="#C8A24E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/* =================== ATTRACTIVENESS DIMENSIONS =================== */

const ATTRACT_DIMS = [
  {
    key: "marketPosition", num: 1, title: "Market Position & Competitive Advantage",
    subtitle: "ARE YOU DOMINANT IN A DEFINED MARKET, OR REPLACEABLE?",
    description: "A regional HVAC company that owns 35% of commercial contracts in its metro area commands a fundamentally different multiple than one competing on price against 40 other contractors. A cybersecurity firm with three patents and a proprietary threat-detection algorithm isn't just another vendor — it's a strategic acquisition target. Buyers don't pay premiums for market participants. They pay premiums for market leaders who have built defensible positions through specialization, intellectual property, brand recognition, or geographic dominance that would take a competitor years to replicate.",
    checklist: [
      { text: "I can clearly articulate my competitive moat — and it's more than 'great service'", sub: "Think: patents, proprietary processes, exclusive contracts, brand equity, regulatory advantages, or a network effect." },
      { text: "My market share is measurable and I know what percentage of my addressable market I own", sub: "If you can't quantify your position, neither can a buyer. 'We're well-known' is not evidence." },
      { text: "A competitor couldn't replicate my core advantage in less than 3 years", sub: "Time-to-replicate is the truest test of a moat. If someone could rebuild your advantage in 6 months, it's not a moat." },
      { text: "I operate in a market with identifiable growth tailwinds, not just survival dynamics", sub: "Buyers want to acquire growth trajectories, not turnaround projects. Is your industry expanding or contracting?" },
    ],
    lowLabel: "No defensible position", highLabel: "Dominant, protected moat",
    quickWins: {
      low: [
        { title: "Define your niche and own it publicly", context: "Pick the narrowest market segment where you have the strongest position and reposition all marketing around that specialty — generalists get average multiples." },
        { title: "Audit your competitive landscape in writing", context: "Map your top 10 competitors, their pricing, their positioning, and identify the one thing you do that none of them can claim." },
        { title: "Document one proprietary process or methodology", context: "Turn your tribal knowledge into a named, documented system — buyers pay for intellectual property, not institutional memory." },
      ],
      mid: [
        { title: "Commission a market sizing study for your niche", context: "Know exactly how big your addressable market is and what percentage you own — this is the foundation of every growth story you'll tell a buyer." },
        { title: "File for trademark protection on your proprietary methods", context: "A named, trademarked methodology signals IP value to buyers even if the underlying process isn't patentable." },
        { title: "Pursue one exclusive partnership or certification", context: "An exclusive distributor agreement, OEM partnership, or industry certification creates barriers that competitors can't cross overnight." },
      ],
      high: [
        { title: "Quantify your customer acquisition cost advantage", context: "If your brand and position let you acquire customers for 40% less than competitors, prove it with data — that's a margin story buyers will pay for." },
        { title: "Build a case study of your moat's durability over 3+ years", context: "Document how your competitive advantage has held or grown through market changes — longevity validates the premium." },
      ],
    },
  },
  {
    key: "revenueQuality", num: 2, title: "Revenue Quality & Growth Trajectory",
    subtitle: "IS YOUR REVENUE RECURRING, DIVERSIFIED, AND GROWING?",
    description: "A managed IT services company billing $200K/month in recurring contracts lives in a different universe than a project-based integrator with the same annual revenue. The recurring model is predictable, bankable, and might be valued at 2–3x the project-based model's multiple. Buyers aren't just buying your current revenue — they're buying the probability that it continues. Revenue that recurs automatically, grows year-over-year, and isn't dependent on heroic sales efforts is the single most powerful driver of premium multiples.",
    checklist: [
      { text: "At least 50% of my revenue is recurring or contractually committed", sub: "Monthly retainers, subscriptions, maintenance contracts, managed services — anything with auto-renewal or multi-year commitment." },
      { text: "My revenue has grown at least 10% year-over-year for the past 3 years (without margins shrinking)", sub: "Flat or declining revenue gets a discount. Growth gets a premium. Consistent growth gets the best multiple." },
      { text: "I can demonstrate pricing power — I've raised prices in the last 12 months without losing customers", sub: "If you can't raise prices, you're competing on cost. If customers stay after increases, you have real value." },
      { text: "My sales pipeline is documented and predictable — I know within 15% what next quarter looks like", sub: "If revenue is a surprise every month, buyers see risk. Predictability is worth more than the revenue itself." },
    ],
    lowLabel: "Project-based, volatile", highLabel: "Recurring, growing, predictable",
    quickWins: {
      low: [
        { title: "Convert one project client to a retainer this month", context: "Pick your best client and propose a monthly retainer that covers ongoing needs — one conversion proves the model works." },
        { title: "Calculate your actual recurring revenue percentage", context: "Pull 12 months of revenue and separate recurring/contracted from one-time/project — you can't fix what you can't see." },
        { title: "Build a 12-month revenue trend chart", context: "Visualize your growth trajectory month by month. If it's flat or down, you now have urgency. If it's up, you have a story to tell." },
      ],
      mid: [
        { title: "Introduce annual contracts with a 5–10% discount vs. monthly", context: "Annual commitments lock in revenue, reduce churn, and create the contracted backlog buyers weight most heavily." },
        { title: "Implement a formal pricing review every 6 months", context: "Systematic price increases of 3–5% annually compound into significant margin improvement and prove pricing power." },
        { title: "Document your sales pipeline with win rates by stage", context: "A CRM with stage-gated probabilities turns your revenue forecast from guesswork into bankable projections." },
      ],
      high: [
        { title: "Build a cohort analysis showing net revenue retention", context: "Net revenue retention above 100% (expansion exceeding churn) is the single most impressive metric you can show a buyer." },
        { title: "Model organic vs. new-customer revenue growth separately", context: "Buyers pay highest premiums for businesses where existing customers generate expanding revenue without proportional sales cost." },
      ],
    },
  },
  {
    key: "financialPerformance", num: 3, title: "Financial Performance & Margins",
    subtitle: "ARE YOUR EARNINGS STRONG RELATIVE TO YOUR INDUSTRY?",
    description: "Two businesses in the same industry, both at $4M revenue. One produces $400K in recasted EBITDA (10%). The other produces $800K (20%). At the same multiple, the second business is worth double — and it will likely command a higher multiple too, because strong margins signal operational excellence, pricing power, and scalability. The private capital market assigns multiples partly based on margin performance relative to industry benchmarks. Below-average margins get below-average multiples. Best-in-class margins — especially when they're trending up — justify premium valuations.",
    checklist: [
      { text: "I know my recasted EBITDA (adjusted for owner comp, one-time expenses, and personal perks)", sub: "Raw P&L numbers mean nothing to a buyer. Recasted financials are the starting point of every valuation conversation." },
      { text: "My EBITDA margin is at or above the average for my industry", sub: "Do you know what 'average' is? Industry benchmarking data is available — if you haven't looked, that's a red flag." },
      { text: "My margins have been stable or improving for the past 3 years", sub: "Declining margins, even with growing revenue, tell a buyer the business is becoming less efficient." },
      { text: "I can explain every major line item's trend and trajectory to a financial buyer", sub: "If you can't narrate your financials like a story, a buyer will assume you don't understand your own business." },
    ],
    lowLabel: "Below industry benchmarks", highLabel: "Best-in-class margins",
    quickWins: {
      low: [
        { title: "Get your financials recasted by a qualified CPA this quarter", context: "Add back owner salary above market rate, one-time expenses, personal expenses — this is the number buyers actually use." },
        { title: "Benchmark your EBITDA margin against industry data", context: "Use BizMiner, RMA, or industry association data to find median and top-quartile margins for your SIC/NAICS code." },
        { title: "Identify your three largest discretionary expenses and cut one", context: "Most $1M–$10M businesses have 5–10% of revenue in expenses that don't drive growth — one cut moves your margin meaningfully." },
      ],
      mid: [
        { title: "Build a 3-year financial trend summary with margin analysis", context: "Revenue, COGS, gross margin, EBITDA — plotted quarterly. This is the first thing a buyer's analyst will build. Beat them to it." },
        { title: "Implement monthly financial review meetings", context: "Margin improvement is an operational discipline, not a one-time exercise. Monthly reviews catch drift before it becomes a problem." },
        { title: "Price a fractional CFO engagement for financial modeling", context: "A fractional CFO can identify margin levers you're not seeing and build the financial narrative that commands premium multiples." },
      ],
      high: [
        { title: "Model the impact of a 2-point margin improvement on valuation", context: "At a 5x multiple, every point of margin on $5M revenue adds $250K in enterprise value. Make the math visceral." },
        { title: "Build a quality-of-earnings preview before a buyer does", context: "A pre-emptive QofE analysis identifies adjustments a buyer would discover in due diligence — and eliminates surprises that kill deals." },
      ],
    },
  },
  {
    key: "customerConcentration", num: 4, title: "Customer Concentration & Relationships",
    subtitle: "IS YOUR REVENUE DANGEROUSLY CONCENTRATED?",
    description: "If one client accounts for 30% or more of your revenue, many buyers will walk away or demand a steep discount. Customer concentration is risk — pure and simple. A buyer is calculating the probability that those relationships survive the transition. A manufacturing firm where three OEM contracts represent 60% of revenue is one phone call away from catastrophe. Contrast that with a services firm where no client exceeds 8% and the top 20 clients collectively represent 45%. The diversified firm has built something transferable. The concentrated firm has built something fragile.",
    checklist: [
      { text: "No single client represents more than 15% of my total revenue", sub: "Anything above 15% is a yellow flag. Above 25% is a red flag. Above 40% can make your business unsellable at fair value." },
      { text: "My top 10 clients collectively represent less than 50% of revenue", sub: "Even if no single client is dominant, cluster concentration matters." },
      { text: "Client relationships are with my company (contracts, systems, team) not with me personally", sub: "If clients would leave when you leave, you're selling a relationship — not a business." },
      { text: "I have a formal client retention strategy that doesn't depend on the owner", sub: "Account reviews, success metrics, proactive outreach — systematized, not heroic. Run by the team, not by you." },
    ],
    lowLabel: "Dangerously concentrated", highLabel: "Broadly diversified",
    quickWins: {
      low: [
        { title: "Calculate your exact concentration ratios today", context: "Top 1 client as % of revenue, top 5, top 10 — and compare year over year. If concentration is increasing, the clock is ticking." },
        { title: "Assign every major client relationship to a team member", context: "Introduce a client success manager or account lead. Start the transition from your network to your company's network." },
        { title: "Launch a new-client acquisition push targeting smaller accounts", context: "The fastest way to reduce concentration isn't losing big clients — it's adding smaller ones. Shift marketing spend toward volume." },
      ],
      mid: [
        { title: "Restructure your largest contracts with multi-year terms", context: "Convert annual renewals to 2–3 year agreements with termination notice requirements — this reduces transition risk for buyers." },
        { title: "Build a client health scorecard tracked monthly by your team", context: "NPS, contract utilization, expansion revenue, engagement scores — when a client starts slipping, you should know before they do." },
        { title: "Set a cap on new-client size as a percentage of total revenue", context: "Discipline yourself to decline or phase in clients that would exceed 15% concentration." },
      ],
      high: [
        { title: "Document your client relationship transfer process", context: "Write the playbook: how introductions happen, how institutional knowledge transfers, how your team maintains the relationship post-transition." },
        { title: "Build a client longevity analysis showing tenure and retention", context: "A 95%+ annual retention rate with 5+ year average tenure tells buyers the revenue base is sticky and will survive ownership change." },
      ],
    },
  },
  {
    key: "managementTeam", num: 5, title: "Management Team & Operational Independence",
    subtitle: "CAN THE BUSINESS PERFORM WITHOUT YOU IN THE ROOM?",
    description: "This is the dimension that kills more deals than any other. An owner who is the top salesperson, the final decision-maker, the key client relationship holder, and the cultural linchpin isn't running a business — they're running a job. When they leave, the value leaves with them. Buyers know this. A business with a competent management team that can operate for 90 days without the owner — maintaining (and growing) revenue, serving clients, making decisions — is worth a fundamental premium over one where the owner's absence creates chaos.",
    checklist: [
      { text: "My business has operated profitably for at least 2 weeks without my direct involvement", sub: "Not a vacation where you checked email hourly. Real absence. Could it happen today without revenue dropping?" },
      { text: "I have a second-in-command or leadership team that makes daily decisions without me", sub: "Decision-making authority must be delegated, not just discussed. Are they empowered to act, or do they wait for you?" },
      { text: "Key client relationships are managed by team members, not exclusively by me", sub: "If your top 5 clients have never spoken to anyone but you, you haven't built a transferable asset." },
      { text: "My management team has formal roles, documented responsibilities, and performance metrics", sub: "Org chart, job descriptions, KPIs, regular reviews — the infrastructure of a real management layer, not just titles." },
    ],
    lowLabel: "Owner is the business", highLabel: "Runs without owner",
    quickWins: {
      low: [
        { title: "Take a 5-day 'dark week' — no calls, no email, no decisions", context: "Tell your team you're unreachable for one week. What breaks reveals exactly where owner dependency lives." },
        { title: "Appoint an interim decision-maker and delegate three authorities", context: "Pick your most capable leader and formally delegate pricing, scheduling, and client escalation authority — in writing." },
        { title: "Transfer one key client relationship to a team member this month", context: "Introduce them, co-lead two meetings, then step back. The client needs to see your team as the relationship." },
      ],
      mid: [
        { title: "Build a management operating rhythm without you in the room", context: "Weekly leadership meetings, monthly scorecards, quarterly planning — all led by your team. Attend as an observer, not the chair." },
        { title: "Create an org chart with named backups for every leadership role", context: "If your VP of Sales is hit by a bus, who steps in? If the answer is 'me,' you haven't built organizational resilience." },
        { title: "Formalize authority boundaries in a decision matrix", context: "What can they approve? Up to what dollar amount? Which decisions require owner input? Clear boundaries prevent both paralysis and chaos." },
      ],
      high: [
        { title: "Run a 30-day owner-absence test and measure financial performance", context: "Compare revenue, margin, and client satisfaction during a month you're absent versus present — the data validates independence or reveals gaps." },
        { title: "Build retention packages for your top 2–3 leaders", context: "Stay bonuses, equity participation, or deferred compensation that keeps your best people through an ownership transition." },
      ],
    },
  },
];

/* =================== BUSINESS READINESS DIMENSIONS =================== */

const READY_DIMS = [
  {
    key: "documentation", num: 6, title: "Documentation & Transferability",
    subtitle: "CAN THE MODEL BE REPLICATED WITHOUT YOU?",
    description: "You can't scale what isn't documented, and you can't transfer what lives in your head. Due diligence — whether from a buyer, a lender, or a potential growth partner — will request 200–400 documents: financial statements, contracts, employee records, process documentation, compliance records, IP assignments, and more. Businesses that can produce these in 48 hours signal maturity. Businesses that scramble for weeks signal risk. But documentation isn't just about a future transaction — it's about operational leverage today. Every process that lives in one person's head is a bottleneck you can't scale past, a single point of failure you can't afford, and institutional knowledge that walks out the door when that person leaves.",
    checklist: [
      { text: "My operational processes are documented in SOPs that employees actually follow", sub: "Not a binder from 2018 sitting on a shelf. Living documents that are referenced, updated, and used for training new hires." },
      { text: "Institutional knowledge is captured in systems, not trapped in people's heads", sub: "If a key employee resigned tomorrow, would the knowledge and processes for running their function disappear with them?" },
      { text: "All contracts, vendor agreements, and leases are current, organized, and accessible", sub: "Could you produce every material contract within 48 hours? Could a new operations leader find and understand every obligation?" },
      { text: "A new senior hire or partner could understand how this business operates within 30 days", sub: "Not by shadowing you — by reading your documentation. That's the test of whether the model is truly replicable." },
    ],
    lowLabel: "Nothing documented", highLabel: "Turnkey, fully replicable",
    quickWins: {
      low: [
        { title: "Document your three most critical processes this week", context: "Pick the three workflows that would cause the most damage if the person who runs them disappeared — write them down, step by step. This is your highest-leverage 2 hours." },
        { title: "Organize all active contracts into a single digital repository", context: "Client contracts, vendor agreements, leases, insurance policies, employment agreements — one folder, indexed, current. Chaos here means chaos everywhere." },
        { title: "Create a 'what does this person know?' map for every key role", context: "For each critical employee, list the knowledge, relationships, and processes that exist only in their head. That's your risk inventory." },
      ],
      mid: [
        { title: "Assign SOP owners and set a 90-day documentation sprint", context: "Each department head writes or updates their core processes. 90 days, weekly check-ins, deliverable: a complete operational playbook anyone could follow." },
        { title: "Build a new-hire onboarding playbook for every department", context: "If you can onboard someone in 2 weeks instead of 3 months, you can scale faster, recover from turnover faster, and prove the model is transferable." },
        { title: "Build an employee knowledge map identifying single points of failure", context: "For every critical function, name who owns it and who the backup is. Gaps reveal your institutional knowledge risk." },
      ],
      high: [
        { title: "Conduct a mock due diligence document request with your advisory team", context: "Have your CPA or attorney run a simulated request list. Time how long it takes and grade your completeness — before a real buyer or lender does." },
        { title: "Create a 'business in a box' operations manual", context: "Day 1 orientation, key contacts, system access, decision frameworks, cultural norms — everything a new leader, partner, or owner needs to operate from day one." },
      ],
    },
  },
  {
    key: "contingency", num: 7, title: "Contingency & Risk Protection",
    subtitle: "CAN THE MODEL SURVIVE WITHOUT YOU?",
    description: "The 5 Ds — Death, Disability, Divorce, Disagreement, and Distress — force exits that owners never planned for. Research shows 50% of business exits are forced by one of these events, not planned. A partner dispute without a buy-sell agreement can destroy a business. An owner's sudden disability without key-person insurance can leave a family with a business they can't run and can't sell. But contingency planning isn't just about catastrophic events — it's about building a business resilient enough to weather any disruption. An owner who has covered the downside can take bigger, bolder growth risks because they know the foundation won't crack. Protecting value is the first step in building value.",
    checklist: [
      { text: "I have a written, funded buy-sell agreement updated in the last 3 years", sub: "Funded means life insurance or a sinking fund actually backs the buyout price. Unfunded agreements are just unenforceable promises on paper." },
      { text: "I have key-person life and disability insurance on myself and critical team members", sub: "If you or your top revenue-generator were suddenly unable to work for 90 days, does the business have the cash to survive the transition?" },
      { text: "I have a formal contingency plan addressing all 5 Ds", sub: "Not just a will. A plan for who runs the business, who makes decisions, and how value is preserved under each scenario — all legally enforceable." },
      { text: "My family and at least one trusted team member know how to access all critical documents and credentials", sub: "In a crisis, the people who need to act shouldn't have to guess how to reach bank accounts, insurance policies, or critical systems." },
    ],
    lowLabel: "No plan for the unexpected", highLabel: "All 5 Ds covered, funded",
    quickWins: {
      low: [
        { title: "Get key-person life insurance quotes this week", context: "A $1M key-person policy on a healthy 45-year-old costs $50–$100/month. The cost of not having it is measured in destroyed value and devastated families." },
        { title: "Draft a one-page emergency operations plan", context: "If you're unreachable for 30 days: who runs the business, who signs checks, who talks to clients, who makes hiring/firing decisions? Write it down and share it." },
        { title: "Create a 'break glass' document vault for your spouse and attorney", context: "Bank accounts, insurance policies, passwords, key contacts, operating agreement — everything needed in a crisis, in one secure place." },
      ],
      mid: [
        { title: "Engage your attorney to draft or update a buy-sell agreement", context: "Include valuation methodology, funding mechanism, trigger events (all 5 Ds), and payment terms. Then fund it with insurance — an agreement without funding is a fiction." },
        { title: "Add disability insurance for yourself and top revenue-generators", context: "Long-term disability is statistically more likely than death for working-age owners. A 90-day disability without coverage can cripple a small business." },
        { title: "Walk your spouse through the contingency plan in detail", context: "Not just 'it's in the safe.' Sit down, walk through every scenario, introduce them to your attorney and CPA. Make sure they can act, not just access." },
      ],
      high: [
        { title: "Stress-test your contingency plan with a tabletop exercise", context: "Pick a scenario — your sudden disability — and walk through exactly what happens. Day 1, Week 1, Month 1. Where does it fail? Fix the failure points." },
        { title: "Review and update your buy-sell valuation formula", context: "If your business has doubled in value since the buy-sell was written, the formula may produce a catastrophically wrong result. Review annually." },
      ],
    },
  },
  {
    key: "financialInfra", num: 8, title: "Financial Infrastructure & Reporting Maturity",
    subtitle: "CAN THE MODEL BE MEASURED AND TRUSTED WITHOUT YOU?",
    description: "You can't manage what you can't measure — and you can't scale, raise capital, bring on a partner, or command a premium multiple if your financial reporting is unreliable, delayed, or incomprehensible to anyone but you. A buyer's first diligence request is the financials. A lender's first question is your debt service coverage. A potential partner's first ask is margin by service line. If your books can't answer these questions within 48 hours — cleanly, accurately, and without you personally pulling the numbers — your financial infrastructure is a constraint on everything you're trying to build.",
    checklist: [
      { text: "My financial statements are professionally prepared and current within 30 days", sub: "Compiled or reviewed by a CPA, with clean categorization, proper accrual accounting, and no material adjustments needed." },
      { text: "I receive monthly financial reports I can use to make decisions — without preparing them myself", sub: "P&L, balance sheet, cash flow, AR/AP aging, and margin by service line — delivered to you, not assembled by you." },
      { text: "My financials could survive third-party scrutiny from a buyer, lender, or partner", sub: "Quality of earnings analysis, recasted financials removing owner perks, clean add-backs — could your books withstand professional examination?" },
      { text: "I can produce unit economics and profitability by client, service line, or product", sub: "Revenue by category isn't enough. Knowing which clients, services, or products actually make money — and which destroy margin — is how you scale profitably." },
    ],
    lowLabel: "Flying blind", highLabel: "Investor-grade reporting",
    quickWins: {
      low: [
        { title: "Engage a bookkeeper or fractional CFO to close your books monthly within 15 days", context: "If you're doing your own books, or they're 60+ days behind, that's the first fix. You can't make good decisions on stale or inaccurate data." },
        { title: "Create a one-page financial dashboard you review weekly", context: "Cash balance, AR aging, trailing 4-week revenue, and burn rate. Four numbers. One page. If you can't produce this today, your infrastructure needs work." },
        { title: "Get your last two years of financials recasted by a CPA", context: "Remove owner perks, one-time expenses, and below-market salaries. The recasted number is what the business actually earns — and what a buyer or lender would underwrite." },
      ],
      mid: [
        { title: "Implement monthly financial reviews with your leadership team", context: "Not just you reading the P&L — your managers reviewing their department numbers, explaining variances, and making commitments. This builds financial literacy across the org." },
        { title: "Build a 13-week cash flow forecast and update it weekly", context: "A rolling cash forecast is the single most powerful tool for preventing surprises. It's also the first thing a sophisticated buyer or lender asks for." },
        { title: "Map your unit economics by client or service line", context: "You may find that 30% of your revenue generates 80% of your profit — and another 20% actually loses money. That insight changes everything." },
      ],
      high: [
        { title: "Conduct a quality-of-earnings analysis with your CPA", context: "This is the analysis a buyer will run. Running it yourself first means no surprises, and it gives you a roadmap for what to clean up before any scrutiny." },
        { title: "Build a financial model that projects 3 years forward with scenario analysis", context: "Base case, upside, downside. A financial model that can answer 'what if' questions is what separates a business that reacts from one that plans." },
      ],
    },
  },
  {
    key: "revPredictability", num: 9, title: "Revenue Predictability & Contractual Strength",
    subtitle: "CAN THE MODEL SUSTAIN ITSELF WITHOUT YOU?",
    description: "How much of your revenue is secured, contracted, or predictably recurring — and how much depends on you personally closing the next deal? A business where next quarter's revenue is 80%+ visible is fundamentally different from one that starts every month at zero. Predictable revenue lets you hire ahead of demand, invest in infrastructure, take on growth debt confidently, and weather downturns without panic. Unpredictable revenue means every strategic decision is a gamble. Whether you're scaling to $20M or preparing for a future transition, revenue predictability is the foundation that makes everything else possible.",
    checklist: [
      { text: "If I stopped working in the business, leads would still come in and sales would keep closing at the same rates", sub: "If your pipeline depends on your personal network, your reputation, or you being in the room to close — the revenue engine stalls the moment you step away." },
      { text: "My sales pipeline exists in a system, not just in my head or my top salesperson's head", sub: "A CRM with stages, probabilities, and expected close dates. If your pipeline disappears when one person leaves, it's not a pipeline — it's a person." },
      { text: "Client contracts include protective terms like auto-renewal and termination for cause", sub: "Month-to-month with 30 days notice means 100% of your revenue is at risk every 30 days. Contract structure is a strategic decision, not a legal formality." },
      { text: "I could confidently forecast next quarter's revenue within 10% accuracy", sub: "If you can't, neither can a lender evaluating a growth loan or a buyer underwriting an offer. Forecast accuracy is a proxy for business maturity." },
    ],
    lowLabel: "Start at zero every month", highLabel: "80%+ revenue visible forward",
    quickWins: {
      low: [
        { title: "Audit your revenue: what percentage is contracted vs. at-risk?", context: "Pull every client and categorize: contracted recurring, handshake recurring, project-based, or one-time. The ratio tells you your real vulnerability." },
        { title: "Convert your top 3 at-risk clients to annual contracts this month", context: "Start with the clients who already behave like recurring — they buy every month but haven't signed anything. A simple MSA formalizes the relationship and protects both sides." },
        { title: "Get your pipeline out of your head and into a CRM this week", context: "Even a spreadsheet is better than memory. List every prospect, stage, probability, and expected close date. Now you have a forecast instead of a feeling." },
      ],
      mid: [
        { title: "Redesign your pricing model to incentivize longer commitments", context: "Annual contracts at a 10% discount, retainer packages with guaranteed hours — structure your pricing to reward predictability over transactional relationships." },
        { title: "Build a revenue waterfall that shows contracted vs. pipeline vs. new-to-win each quarter", context: "This visual makes it impossible to ignore how much of your forecast depends on deals that haven't closed yet." },
        { title: "Implement contract renewal tracking 90 days before expiration", context: "If you only learn a client is leaving when they stop paying, you've lost 90 days of potential intervention. Proactive renewal management is revenue protection." },
      ],
      high: [
        { title: "Build a net revenue retention analysis", context: "Track what percentage of last year's revenue base is still active and growing. Best-in-class businesses are above 100% — existing clients spend more each year, not less." },
        { title: "Stress-test your revenue concentration", context: "If your top client left tomorrow, what happens? If the answer is 'catastrophe,' you need a documented diversification strategy with a specific timeline." },
      ],
    },
  },
  {
    key: "succession", num: 10, title: "Management Succession & Key-Person Resilience",
    subtitle: "CAN THE MODEL BE LED WITHOUT YOU?",
    description: "Dimension 5 asked whether your current team can perform without you today. This dimension asks a different question: are you intentionally developing the next generation of leaders who can take this business somewhere you can't take it alone? Succession isn't a one-time event — it's an ongoing investment in leadership depth. Every hour you spend making decisions someone else could make is an hour you're not spending on the work only you can do. The owner who hasn't built a leadership pipeline can't pursue acquisitions, launch new markets, develop strategic partnerships, or simply step back to think strategically. Succession isn't about leaving — it's about building an organization mature enough to grow beyond one person's capacity.",
    checklist: [
      { text: "I have named successor candidates for every key leadership role, and they know it", sub: "Not assumptions — explicit conversations. Development plans with timelines and milestones. If you haven't told them, you don't have a succession plan." },
      { text: "My successors have been given real authority and accountability to develop", sub: "Stretch assignments, P&L ownership, hiring decisions, client-facing responsibility. You build leaders by letting them lead, not by letting them watch." },
      { text: "Every critical business function has a trained backup who could step in within 30 days", sub: "Not just leadership — critical individual contributors too. If your best technician, your head of accounting, or your top producer left, who's next?" },
      { text: "I have a retention strategy specifically designed to keep my highest-potential people", sub: "Stay bonuses, equity participation, career progression, meaningful authority. If your pipeline depends on people who could leave for a 15% raise, it's not a pipeline." },
    ],
    lowLabel: "No pipeline, no backups", highLabel: "Deep bench, leaders developing",
    quickWins: {
      low: [
        { title: "Identify your top two future leaders and have the succession conversation", context: "Name them out loud. Tell them they're being developed for leadership. Give them a stretch project with real authority and real consequences this month." },
        { title: "Build a cross-training map for every critical function", context: "For each key role, name the primary person, the backup person, and the gap if no backup exists. That gap is your succession risk in one picture." },
        { title: "Delegate one decision you currently make to someone else — permanently", context: "Not 'handle this while I'm away.' Permanently transfer the authority. Start small (a $5K spending authority) and grow from there." },
      ],
      mid: [
        { title: "Give your top successor P&L responsibility for a project or business unit", context: "True leadership readiness is proven by managing a budget and delivering results, not just managing people. This is the development accelerator." },
        { title: "Have each manager present their department's quarterly plan to leadership", context: "The presentation forces strategic thinking. Their comfort level tells you exactly who's ready for more and who needs coaching." },
        { title: "Build retention packages for your top 2–3 highest-potential people", context: "Stay bonuses, profit-sharing, equity participation, or deferred compensation. Protect the pipeline you're investing in." },
      ],
      high: [
        { title: "Transition from directing to auditing — review outcomes monthly, not tasks daily", context: "The shift from operator to governor is the signal that succession is real. You become the board, not the manager." },
        { title: "Run a formal talent review assessing depth at every leadership position", context: "Red/yellow/green each role: green = successor ready now, yellow = successor in development, red = single point of failure. Address the reds first." },
      ],
    },
  },
];

const DIMENSIONS = [...ATTRACT_DIMS, ...READY_DIMS];

/* =================== BANDING =================== */

const BANDS = [
  { label: "Liquidation Zone", range: [10, 26], color: C.red,
    desc: "Not attractive or ready. The business can't scale or transfer in this state. A forced exit here means liquidation pricing at best." },
  { label: "Discount Zone", range: [27, 34], color: C.amber,
    desc: "Below average. Growth is constrained by foundational gaps. A transition would come with discounted multiples and unfavorable terms." },
  { label: "Market Zone", range: [35, 40], color: C.amberDark,
    desc: "Average. The model works but isn't nailed yet. Scaling from here amplifies both strengths and dysfunctions. Significant value is left on the table." },
  { label: "Green Zone", range: [40, 43], color: C.cyan,
    desc: "Attractive and ready. The model is nailed — ready to scale aggressively or command a premium multiple in a transition." },
  { label: "Best-In-Class", range: [43, 60], color: C.green,
    desc: "The model is a machine. Scalable, resilient, and transferable. Multiple buyers would compete. You have maximum optionality." },
];

const getBand = (total) => {
  for (let i = BANDS.length - 1; i >= 0; i--) {
    if (total >= BANDS[i].range[0]) return BANDS[i];
  }
  return BANDS[0];
};

/* =================== COMPONENTS =================== */

const Page = ({ children, pageNum, totalPages }) => (
  <div style={{
    width: "8.5in", minHeight: "11in", position: "relative", overflow: "hidden",
    background: "linear-gradient(180deg, #0A0E14 0%, #0D1119 30%, #0E131C 50%, #0D1119 70%, #0A0E14 100%)",
    fontFamily: "'DM Sans', sans-serif", color: C.text1, boxSizing: "border-box",
    pageBreakAfter: "always", breakAfter: "page",
  }}>
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1, opacity: 0.05,
      mixBlendMode: "overlay", backgroundImage: GRAIN, backgroundSize: "128px 128px" }}/>
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, zIndex: 5,
      background: "linear-gradient(90deg, transparent 3%, #C8A24E30 15%, #C8A24E 35%, #D4B665 50%, #C8A24E 65%, #C8A24E30 85%, transparent 97%)" }}/>
    <div style={{ position: "absolute", top: "0.88in", bottom: "0.68in", left: "0.44in", width: 0.5,
      background: "linear-gradient(180deg, transparent, #C8A24E20, #C8A24E20, transparent)", zIndex: 2 }}/>
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, padding: "0.4in 0.6in 0.18in",
      display: "flex", justifyContent: "space-between", alignItems: "baseline",
      fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", color: C.text3, fontWeight: 500, zIndex: 5 }}>
      <span>Kriczky Virtus</span>
      <span><b style={{ color: C.cyan, fontWeight: 600 }}>What's My Business Worth?</b> — Value Range Estimator</span>
    </div>
    <div style={{ position: "absolute", top: "0.68in", left: "0.65in", right: "0.65in", height: 0.5,
      background: "linear-gradient(90deg, transparent, #C8A24E40, transparent)", zIndex: 5 }}/>
    <div style={{ padding: "0.85in 0.6in 0.75in", position: "relative", zIndex: 3 }}>
      {children}
    </div>
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 0.6in 0.4in",
      display: "flex", justifyContent: "space-between", alignItems: "baseline", color: C.text3, zIndex: 5 }}>
      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase" }}>
        <b style={{ color: C.gold, fontWeight: 600 }}>Kriczky</b> Virtus
      </span>
      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 13, color: C.text2 }}>
        {pageNum} <span style={{ color: C.text4 }}>/</span> {totalPages}
      </span>
    </div>
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1,
      background: "linear-gradient(90deg, transparent, #C8A24E20, #C8A24E40, #C8A24E20, transparent)" }}/>
  </div>
);

const CheckItem = ({ text, sub, checked, onToggle }) => (
  <div style={{ display: "flex", gap: 12, padding: "8px 0", cursor: "pointer", userSelect: "none", alignItems: "center" }}
    onClick={onToggle}>
    <svg width="14" height="14" viewBox="0 0 14 14" style={{ flexShrink: 0 }}>
      <rect x="0.5" y="0.5" width="13" height="13" rx="2.5"
        fill={checked ? `${C.cyan}20` : `${C.cyan}04`}
        stroke={checked ? C.cyan : `${C.cyan}40`} strokeWidth="1.5"/>
      {checked && <path d="M3.5 7L5.75 9.25L10.5 4.5" stroke={C.cyan} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>}
    </svg>
    <div style={{ flex: 1 }}>
      <span style={{ fontSize: 12, color: checked ? C.text1 : C.text2, lineHeight: 1.5, transition: "color 0.2s" }}>{text}</span>
      {sub && <span style={{ display: "block", fontSize: 10.5, color: C.text3, lineHeight: 1.5, marginTop: 3 }}>{sub}</span>}
    </div>
  </div>
);

const ScoreSelector = ({ value, onChange, lowLabel, highLabel }) => {
  const ac = value ? scoreColor(value) : C.cyan;
  return (
    <div style={{
      padding: "20px 24px", borderRadius: 12, marginTop: 16,
      background: value
        ? `linear-gradient(145deg, ${ac}08, ${ac}03)`
        : `linear-gradient(145deg, ${C.cyan}06, ${C.cyan}02)`,
      border: `1.5px solid ${value ? `${ac}50` : `${C.cyan}30`}`,
      boxShadow: value ? `0 0 20px ${ac}15, inset 0 1px 0 ${ac}15` : "none",
      transition: "all 0.3s ease",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <span style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: value ? ac : C.cyan }}>Rate Yourself</span>
        {value && (
          <span style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Playfair Display', serif", color: ac }}>
            {value}<span style={{ fontSize: 13, color: C.text3, fontWeight: 400 }}>/6</span>
          </span>
        )}
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        {[1,2,3,4,5,6].map(n => {
          const sc = scoreColor(n);
          const sel = value === n;
          return (
            <button key={n} onClick={() => onChange(n)} style={{
              flex: 1, height: 40, borderRadius: 8, border: `1.5px solid ${sel ? sc : `${sc}30`}`,
              background: sel ? `${sc}25` : `${sc}08`, color: sel ? sc : `${sc}80`,
              fontSize: 16, fontWeight: 700, fontFamily: "'Playfair Display', serif",
              cursor: "pointer", transition: "all 0.2s",
              boxShadow: sel ? `0 0 12px ${sc}30` : "none",
            }}>{n}</button>
          );
        })}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9.5, textTransform: "uppercase", letterSpacing: "0.06em", color: C.text3 }}>
        <span>{lowLabel}</span><span>{highLabel}</span>
      </div>
      {!value && (
        <div style={{ textAlign: "center", marginTop: 10, fontSize: 10, color: C.text4, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          ↑ Tap a number above ↑
        </div>
      )}
    </div>
  );
};

const GlassBtn = ({ href, color, children }) => (
  <a href={href} target="_blank" rel="noopener noreferrer"
    onMouseEnter={e => { const s=e.currentTarget.style; s.background=`linear-gradient(135deg,${color}22,${color}14)`; s.borderColor=`${color}60`; s.boxShadow=`0 0 32px ${color}20,0 4px 16px rgba(0,0,0,0.25)`; const a=e.currentTarget.querySelector('[data-arrow]'); if(a){a.style.opacity='1';a.style.transform='translateX(3px)';} }}
    onMouseLeave={e => { const s=e.currentTarget.style; s.background=`linear-gradient(135deg,${color}15,${color}08)`; s.borderColor=`${color}35`; s.boxShadow=`0 0 24px ${color}12,0 4px 12px rgba(0,0,0,0.2)`; const a=e.currentTarget.querySelector('[data-arrow]'); if(a){a.style.opacity='0';a.style.transform='translateX(0)';} }}
    style={{ position:"relative", display:"block", textAlign:"center", padding:"11px 28px", borderRadius:10, background:`linear-gradient(135deg,${color}15,${color}08)`, border:`1px solid ${color}35`, color, fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:700, letterSpacing:"0.03em", textDecoration:"none", cursor:"pointer", boxShadow:`0 0 24px ${color}12,0 4px 12px rgba(0,0,0,0.2)`, transition:"all 0.25s ease" }}>
    {children}
    <svg data-arrow="" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ position:"absolute", right:16, top:"50%", marginTop:-6.5, transition:"transform 0.25s ease, opacity 0.25s ease", opacity:0 }}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
  </a>
);

/* =================== EMAIL GATE =================== */
const EmailGate = ({ toolName, toolSlug, accentColor, scores, summary, onUnlock, onGeneratePdf }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = () => {
    if (!name.trim()) { setError("Please enter your name so we can personalize your results."); return; }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Please enter a valid email address."); return; }
    setError(""); setSending(true);
    const payload = { name: name.trim(), email: email.trim(), tool: toolSlug, toolName, scores, summary, timestamp: new Date().toISOString() };
    fetch("/api/lead-capture", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      .catch(err => console.error("[Lead] Fetch failed:", err));
    onUnlock();
    setSending(false);
    const _name = name.trim(), _email = email.trim();
    setTimeout(async () => {
      try {
        const res = await fetch("/api/store-results", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: _name, email: _email, tool: "value-range-estimator", html: document.documentElement.outerHTML }) });
        if (res.ok) console.log("[Tool] Results stored");
        else console.error("[Tool] Failed to store results:", res.status);
      } catch (err) { console.error("[Tool] Store results failed:", err); }
    }, 2000);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "60px 20px", textAlign: "center", position: "relative", pageBreakBefore: "always" }}>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: `radial-gradient(ellipse 60% 50% at 50% 40%, ${accentColor}10, transparent 70%)` }}/>
      <div style={{ position: "relative", zIndex: 1, maxWidth: 480, width: "100%" }}>
        {/* Checkmark */}
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: `${accentColor}10`, border: `2px solid ${accentColor}30`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", boxShadow: `0 0 20px ${accentColor}15` }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><polyline points="4 12 10 18 20 6" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 32, color: C.text1, textTransform: "uppercase", margin: "0 0 10px", lineHeight: 1.1 }}>
          Your answers are<br/><span style={{ color: accentColor }}>locked in.</span>
        </h2>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: C.text2, lineHeight: 1.6, margin: "0 0 8px" }}>Enter your name and email to see your personalized results, scores, and recommended next steps.</p>
        {/* Form card */}
        <div style={{ padding: "28px 24px", borderRadius: 18, background: "linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.04))", border: `1px solid ${accentColor}20`, borderTop: "1px solid rgba(255,255,255,0.12)", boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 60px ${accentColor}08`, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: 18, pointerEvents: "none", background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 30%, transparent 50%, transparent 70%, rgba(255,255,255,0.03) 100%)" }}/>
          <div style={{ position: "relative", zIndex: 1 }}>
            <input type="text" placeholder="Full name" value={name} onChange={e => { setName(e.target.value); setError(""); }}
              style={{ width: "100%", padding: "14px 16px", borderRadius: 10, background: "#0F141C", border: "1px solid rgba(255,255,255,0.10)", color: C.text1, fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none", marginBottom: 10, boxSizing: "border-box", transition: "border-color 0.2s" }}
              onFocus={e => e.target.style.borderColor = `${accentColor}50`} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.10)"} />
            <input type="email" placeholder="Email address" value={email} onChange={e => { setEmail(e.target.value); setError(""); }} onKeyDown={e => e.key === "Enter" && handleSubmit()}
              style={{ width: "100%", padding: "14px 16px", borderRadius: 10, background: "#0F141C", border: "1px solid rgba(255,255,255,0.10)", color: C.text1, fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none", marginBottom: error ? 8 : 16, boxSizing: "border-box", transition: "border-color 0.2s" }}
              onFocus={e => e.target.style.borderColor = `${accentColor}50`} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.10)"} />
            {error && <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: C.red, margin: "0 0 12px", textAlign: "left" }}>{error}</p>}
            <button onClick={handleSubmit} disabled={sending}
              onMouseEnter={e => { if (!sending) { e.currentTarget.style.boxShadow = `0 0 48px ${accentColor}40, 0 4px 20px rgba(0,0,0,0.35)`; e.currentTarget.style.borderColor = `${accentColor}80`; e.currentTarget.style.background = `linear-gradient(135deg, ${accentColor}25, ${accentColor}15)`; const a = e.currentTarget.querySelector('[data-gate-arrow]'); if(a){ a.style.opacity='1'; a.style.transform='translateX(3px)'; } } }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = `0 0 20px ${accentColor}20, 0 4px 12px rgba(0,0,0,0.3)`; e.currentTarget.style.borderColor = `${accentColor}50`; e.currentTarget.style.background = `linear-gradient(135deg, ${accentColor}18, ${accentColor}0a)`; const a = e.currentTarget.querySelector('[data-gate-arrow]'); if(a){ a.style.opacity='0'; a.style.transform='translateX(0)'; } }}
              style={{ width: "100%", padding: "16px 0", borderRadius: 12, border: `1.5px solid ${accentColor}50`, cursor: sending ? "wait" : "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 15, color: accentColor, background: `linear-gradient(135deg, ${accentColor}18, ${accentColor}0a)`, boxShadow: `0 0 20px ${accentColor}20, 0 4px 12px rgba(0,0,0,0.3)`, position: "relative", overflow: "hidden", transition: "all 0.3s ease", opacity: sending ? 0.7 : 1 }}>
              {/* Shimmer sweep */}
              <span style={{ position: "absolute", top: "-50%", left: "-50%", right: "-50%", bottom: "-50%", pointerEvents: "none", background: `linear-gradient(120deg, transparent 0%, transparent 40%, ${accentColor}12 48%, ${accentColor}20 50%, ${accentColor}12 52%, transparent 60%, transparent 100%)`, backgroundSize: "200% 200%", animation: "btnShimmer 6s ease-in-out infinite" }}/>
              <span style={{ position: "relative", zIndex: 1, display: "inline-flex", alignItems: "center", gap: 8 }}>
                {sending ? "Unlocking your results..." : "See My Personalized Results"}
                {!sending && <svg data-gate-arrow="" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0, transition: "all 0.25s ease" }}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>}
              </span>
            </button>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: C.text3, textAlign: "center", marginTop: 12 }}>Your data stays with you. We will send you a copy of your results.</p>
          </div>
        </div>

        {/* What they'll see */}
        <div style={{ marginTop: 24, padding: "16px 20px", borderRadius: 12, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", textAlign: "left" }}>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, fontWeight: 700, color: accentColor, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>What You'll Get</div>
          {["Your personalized scores across every dimension", "Specific areas where your business is strongest — and weakest", "Prioritized recommendations to improve your score", "A clear picture of where you stand vs. best-in-class peers"].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}><polyline points="4 12 10 18 20 6" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: C.text2 }}>{item}</span>
            </div>
          ))}
        </div>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, color: "#3D4654", lineHeight: 1.5, marginTop: 12, textAlign: "left" }}>
          By providing your information you consent to Kriczky Virtus, LLC contacting you by phone, text, or email using automated telephone dialing systems and AI to the information provided, even if the phone number is present on a state or national Do Not Call List. We do not sell your personal information. By providing this information you agree to our Privacy Policy and Terms of Service.
        </p>
      </div>
    </div>
  );
};

/* =================== MAIN APP =================== */

export default function BusinessWorthDiagnostic() {
  const [scores, setScores] = useState({});
  const [checks, setChecks] = useState({});
  const [gateUnlocked, setGateUnlocked] = useState(false);
  const toolRef = useRef(null);

  const setScore = (key, val) => setScores(p => ({ ...p, [key]: val }));
  const toggleCheck = (key, idx) => setChecks(p => {
    const arr = [...(p[key] || [])];
    arr[idx] = !arr[idx];
    return { ...p, [key]: arr };
  });

  const scoredCount = DIMENSIONS.filter(d => scores[d.key]).length;
  const total = DIMENSIONS.reduce((s, d) => s + (scores[d.key] || 0), 0);
  const allScored = scoredCount === NUM_DIMS;
  const band = getBand(total);

  const attractTotal = ATTRACT_DIMS.reduce((s, d) => s + (scores[d.key] || 0), 0);
  const readyTotal = READY_DIMS.reduce((s, d) => s + (scores[d.key] || 0), 0);
  const attractPct = Math.round((attractTotal / MAX_PILLAR) * 100);
  const readyPct = Math.round((readyTotal / MAX_PILLAR) * 100);
  const overallPct = Math.round((total / MAX_SCORE) * 100);

  const sorted = [...DIMENSIONS].sort((a, b) => (scores[a.key] || 0) - (scores[b.key] || 0));
  const lowestTwo = sorted.slice(0, 2);
  const lowestThree = sorted.slice(0, 3);

  // Deal-killers: any dimension scoring 1-2
  const dealKillers = DIMENSIONS.filter(d => scores[d.key] && scores[d.key] <= 2);
  // Improvement candidates: scoring 3 (below midpoint but not deal-killer)
  const belowMid = DIMENSIONS.filter(d => scores[d.key] === 3);
  // Solid but not premium: scoring 4
  const solidNotPremium = DIMENSIONS.filter(d => scores[d.key] === 4);

  // Dynamic page count: 16 base (cover, how-to, pillar1-intro, 5 attract dims, pillar2-intro, 5 ready dims, summary, CTA)
  // + value impact + roadmap + first 3 moves + ICA preview when scored = 20 total when scored
  const totalPages = allScored ? 20 : 16;

  return (
    <div ref={toolRef} style={{ background: C.bgDeep, minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet"/>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes btnShimmer { 0%{background-position:200% 0}50%{background-position:-200% 0}100%{background-position:-200% 0} }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        button { font-family: inherit; }
        @media print { .page-gap { display: none; } }
      `}</style>

      <div style={{ maxWidth: "8.5in", margin: "0 auto" }}>

        {/* ====== PAGE 1: COVER ====== */}
        <Page pageNum={1} totalPages={totalPages}>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
            textAlign: "center", minHeight: "calc(11in - 1.6in)" }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 180, lineHeight: 1,
              color: "rgba(34,211,238,0.035)", position: "absolute", top: "1.2in", right: "0.2in", pointerEvents: "none", zIndex: 2 }}>10</div>

            <div style={{ marginBottom: 28 }}><Shield size={48} glow/></div>

            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 38, lineHeight: 1.1,
              color: C.text1, margin: "0 0 6px", textShadow: "0 2px 20px rgba(0,0,0,0.5)",
              textTransform: "uppercase", letterSpacing: "0.02em" }}>
              What's My Business<br/>
              <span style={{ color: C.cyan, textShadow: `0 0 30px ${C.cyan}30` }}>Worth?</span>
            </h1>

            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 400, fontStyle: "italic",
              color: C.text2, margin: "0 0 24px", maxWidth: 520, lineHeight: 1.35 }}>
              Value Range Estimator — A strategic self-assessment<br/>of your Business Attractiveness and Business Readiness<br/>to scale, protect, and unlock your full market value.
            </p>

            <div style={{ width: 40, height: 1.5, background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`, marginBottom: 22 }}/>

            {/* Key stat callout */}
            <div style={{ padding: "16px 22px", borderRadius: 10, textAlign: "left", marginBottom: 18, maxWidth: 520,
              background: `linear-gradient(135deg, ${C.cyan}08, ${C.cyan}02)`, border: `1px solid ${C.cyan}25` }}>
              <p style={{ fontSize: 12, lineHeight: 1.65, color: C.text2, margin: 0 }}>
                The same business at <b style={{ color: C.text1 }}>$26M revenue</b> can be worth <b style={{ color: C.red }}>$11M</b> (4× multiple, low A&R) or <b style={{ color: C.green }}>$41M</b> (8× multiple, best-in-class A&R). That's a <b style={{ color: C.cyan }}>$30M premium</b> — at the same level of sales. The difference is entirely driven by how attractive and ready your business is — whether you're scaling or positioning for a future transition.
              </p>
            </div>

            {/* Core Principle */}
            <div style={{ padding: "16px 22px", borderRadius: 10, textAlign: "left", marginBottom: 22, maxWidth: 520,
              background: "linear-gradient(135deg, rgba(200,162,78,0.06), rgba(200,162,78,0.015))",
              border: "1px solid rgba(200,162,78,0.2)" }}>
              <div style={{ fontSize: 9.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: C.gold, marginBottom: 8 }}>The Core Principle</div>
              <p style={{ fontSize: 12, lineHeight: 1.65, color: C.text2, margin: 0 }}>
                You can't control the range of multiples assigned to your industry — that's determined by the private capital market. But you <b style={{ color: C.text1 }}>can control where you land in that range</b>. Your placement is determined by two things: how attractive your business looks from the outside, and how ready it is to scale or transfer from the inside. This tool measures both.
              </p>
            </div>

            <p style={{ fontSize: 11, color: C.text3, lineHeight: 1.6, maxWidth: 440 }}>
              Score yourself <span style={{ color: C.cyan, fontWeight: 600 }}>1–6</span> on each of 10 dimensions across<br/>Attractiveness and Readiness. Your scores update automatically.
            </p>
          </div>
        </Page>

        <div className="page-gap" style={{ height: 24 }}/>

        {/* ====== PAGE 2: HOW TO USE (with pill grid moved here) ====== */}
        <Page pageNum={2} totalPages={totalPages}>
          <div style={{ fontSize: 9.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: C.cyan, marginBottom: 10 }}>
            How To Use This Diagnostic
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 400, lineHeight: 1.15, letterSpacing: "-0.01em", marginBottom: 14 }}>
            <span style={{ color: C.gold }}>See your business through a buyer's eyes,</span> <span style={{ color: C.text1 }}>not your own.</span>
          </h2>
          <p style={{ fontSize: 12, color: C.text2, lineHeight: 1.65, marginBottom: 12 }}>
            95% of M&A advisors say the #1 reason they can't sell a business is the gap between an owner's perception of value and its real market value. This is the "Ugly Baby Syndrome" — even if their baby is ugly, it's still their ugly baby. This tool is designed to bypass that bias. For each dimension, score yourself as a buyer would score you — not as you see yourself.
          </p>
          <p style={{ fontSize: 12, color: C.text2, lineHeight: 1.65, marginBottom: 14 }}>
            The first five dimensions measure <b style={{ color: C.text1 }}>Business Attractiveness</b> — how your business looks from the outside in. The last five measure <b style={{ color: C.text1 }}>Business Readiness</b> — whether the business model is nailed well enough to scale or transfer without breaking. You need both. An attractive business that isn't ready will stumble under growth pressure or disappoint during due diligence.
          </p>

          {/* Pill Grid — side by side, centered, uniform width */}
          <div style={{ display: "flex", gap: 16, marginTop: 100, marginBottom: 100 }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: C.cyan, marginBottom: 8, textAlign: "center" }}>Business Attractiveness</div>
              {ATTRACT_DIMS.map(d => (
                <div key={d.key} style={{ width: "100%", maxWidth: 280, padding: "5px 14px", borderRadius: 6, marginBottom: 4, textAlign: "center",
                  background: scores[d.key] ? `${scoreColor(scores[d.key])}10` : `${C.cyan}06`,
                  border: `1px solid ${scores[d.key] ? `${scoreColor(scores[d.key])}30` : `${C.cyan}15`}` }}>
                  <span style={{ fontSize: 7.5, color: scores[d.key] ? scoreColor(scores[d.key]) : C.text3, fontWeight: 600, lineHeight: 1.3, textTransform: "uppercase", letterSpacing: "0.02em" }}>{d.title}</span>
                </div>
              ))}
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: C.gold, marginBottom: 8, textAlign: "center" }}>Business Readiness</div>
              {READY_DIMS.map(d => (
                <div key={d.key} style={{ width: "100%", maxWidth: 280, padding: "5px 14px", borderRadius: 6, marginBottom: 4, textAlign: "center",
                  background: scores[d.key] ? `${scoreColor(scores[d.key])}10` : `${C.cyan}06`,
                  border: `1px solid ${scores[d.key] ? `${scoreColor(scores[d.key])}30` : `${C.cyan}15`}` }}>
                  <span style={{ fontSize: 7.5, color: scores[d.key] ? scoreColor(scores[d.key]) : C.text3, fontWeight: 600, lineHeight: 1.3, textTransform: "uppercase", letterSpacing: "0.02em" }}>{d.title}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
            <div style={{ flex: 1, padding: "14px 16px", borderRadius: 10,
              background: `linear-gradient(135deg, ${C.cyan}08, ${C.cyan}02)`, border: `1px solid ${C.cyan}20` }}>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: C.cyan, marginBottom: 8 }}>Why 1–6 Instead of 1–5?</div>
              <p style={{ fontSize: 11.5, color: C.text2, lineHeight: 1.6 }}>
                Most people default to "3" on a 1–5 scale — it feels safe. A 1–6 scale has <b style={{ color: C.text1 }}>no middle</b>. You have to decide: am I below the midpoint or above it?
              </p>
            </div>
            <div style={{ flex: 1, padding: "14px 16px", borderRadius: 10,
              background: `linear-gradient(135deg, ${C.gold}06, ${C.gold}02)`, border: `1px solid ${C.gold}20` }}>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: C.gold, marginBottom: 8 }}>For Each Section</div>
              <p style={{ fontSize: 11.5, color: C.text2, lineHeight: 1.6 }}>
                Read the description, check the statements that are true today, then use the <b style={{ color: C.text1 }}>Rate Yourself</b> panel to score 1–6.
              </p>
            </div>
          </div>

          <div style={{ padding: "12px 16px", borderRadius: 8, background: `${C.text4}10`, border: `1px solid ${C.text4}20` }}>
            <p style={{ fontSize: 10, color: C.text3, lineHeight: 1.6, margin: 0 }}>
              <b style={{ color: C.text2 }}>Important Disclaimer:</b> This tool is NOT a formal business valuation. It's a strategic self-assessment that helps you understand where you'd likely fall in your industry's Range of Value based on your Attractiveness and Readiness scores. A formal valuation requires professional analysis, financial due diligence, and market data specific to your business. This tool gives you the awareness — the necessary first step.
            </p>
          </div>
        </Page>

        {/* ====== PAGES 3+: DIMENSIONS (with Pillar intro pages) ====== */}
        {DIMENSIONS.map((dim, idx) => {
          const chk = checks[dim.key] || [];
          const isAttract = idx < NUM_ATTRACT;
          const pillarLabel = isAttract ? "Business Attractiveness" : "Business Readiness";
          // Page offset: cover(1) + howto(2) + pillar1intro(3) + attract dims(4-8) + pillar2intro(9) + ready dims(10-14) = 14 unscored base + summary(15) + CTA(16) = 16 unscored, +3 when scored = 19
          const pageOffset = idx < NUM_ATTRACT ? idx + 4 : idx + 5;
          return (
            <div key={dim.key}>
              {/* Pillar 1 Intro Page — appears before first attractiveness dimension */}
              {idx === 0 && (
                <>
                  <div className="page-gap" style={{ height: 24 }}/>
                  <Page pageNum={3} totalPages={totalPages}>
                    <div>
                      <div style={{ fontSize: 9.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: C.cyan, marginBottom: 10 }}>
                        Pillar 1 — Business Attractiveness
                      </div>
                      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 500, lineHeight: 1.15, letterSpacing: "-0.01em", marginBottom: 8 }}>
                        <span style={{ color: C.cyan }}>How does your business look</span> <span style={{ color: C.text1 }}>from the outside in?</span>
                      </h2>
                      <p style={{ fontSize: 12, color: C.text2, lineHeight: 1.65, marginBottom: 18 }}>
                        Attractiveness is the external lens — what a buyer, lender, investor, or strategic partner sees when they evaluate your company. These five dimensions determine whether your business commands a premium multiple or gets discounted. They measure the quality of what you've built: your competitive position, revenue engine, financial performance, customer relationships, and management depth. Score yourself as an outsider would score you — not as you see yourself.
                      </p>
                      <div style={{ maxWidth: 520, margin: "0 auto", padding: "24px 28px", borderRadius: 12,
                        background: `linear-gradient(135deg, ${C.cyan}08, ${C.cyan}02)`, border: `1.5px solid ${C.cyan}30`,
                        boxShadow: `0 0 20px ${C.cyan}08` }}>
                        <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: C.cyan, marginBottom: 16, textAlign: "center" }}>
                          Five dimensions. The outside-in view.
                        </div>
                        {[
                          { title: "Market Position & Competitive Advantage", q: "Do you own a defensible niche?" },
                          { title: "Revenue Quality & Growth Trajectory", q: "Is the revenue engine predictable and growing?" },
                          { title: "Financial Performance & Margins", q: "Are you operating at or near best-in-class profitability?" },
                          { title: "Customer Concentration & Relationships", q: "Is your revenue diversified and your client base sticky?" },
                          { title: "Management Team & Operational Independence", q: "Can the business perform without you in the room?" },
                        ].map((item, i) => (
                          <div key={i} style={{ display: "flex", gap: 14, alignItems: "baseline", marginBottom: i < 4 ? 14 : 0 }}>
                            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: C.cyan, flexShrink: 0, width: 24, textAlign: "center" }}>{i + 1}</span>
                            <div>
                              <span style={{ fontSize: 13, fontWeight: 700, color: C.text1, display: "block", marginBottom: 2 }}>{item.title}</span>
                              <span style={{ fontSize: 12.5, color: C.text2, fontStyle: "italic" }}>{item.q}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <p style={{ fontSize: 12, color: C.text2, lineHeight: 1.65, margin: "18px 0 0", textAlign: "center" }}>
                        These are the dimensions that determine whether your business excites the market — or gets overlooked.
                      </p>
                    </div>
                  </Page>
                </>
              )}
              {/* Pillar 2 Intro Page — appears before first readiness dimension */}
              {idx === NUM_ATTRACT && (
                <>
                  <div className="page-gap" style={{ height: 24 }}/>
                  <Page pageNum={idx + 4} totalPages={totalPages}>
                    <div>
                      <div style={{ fontSize: 9.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: C.gold, marginBottom: 10 }}>
                        Pillar 2 — Business Readiness
                      </div>
                      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 500, lineHeight: 1.15, letterSpacing: "-0.01em", marginBottom: 8 }}>
                        <span style={{ color: C.gold }}>Is the business model nailed</span> <span style={{ color: C.text1 }}>well enough to scale — or to sell — without breaking?</span>
                      </h2>
                      <p style={{ fontSize: 12, color: C.text2, lineHeight: 1.65, marginBottom: 18 }}>
                        You don't want to scale an underperforming, struggling business model. You need the model nailed so it's ready to be scaled. The owner who wants to build for the next 10 years needs Business Readiness just as much as the owner preparing for a transition in 18 months — because the same gaps that suppress a sale price also suppress your ability to scale, take on a partner, raise capital, step back operationally, or weather a crisis. Business Readiness isn't about being ready to leave — it's about the business being ready to thrive independent of any single person or circumstance.
                      </p>
                      <div style={{ maxWidth: 520, margin: "0 auto", padding: "24px 28px", borderRadius: 12,
                        background: `linear-gradient(135deg, ${C.gold}08, ${C.gold}02)`, border: `1.5px solid ${C.gold}30`,
                        boxShadow: `0 0 20px ${C.gold}08` }}>
                        <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: C.gold, marginBottom: 16, textAlign: "center" }}>
                          Five dimensions. One master question each.
                        </div>
                        {[
                          { title: "Documentation & Transferability", q: "Can the model be replicated without you?" },
                          { title: "Contingency & Risk Protection", q: "Can the model survive without you?" },
                          { title: "Financial Infrastructure & Reporting", q: "Can the model be measured and trusted without you?" },
                          { title: "Revenue Predictability & Contracts", q: "Can the model sustain itself without you?" },
                          { title: "Management Succession & Resilience", q: "Can the model be led without you?" },
                        ].map((item, i) => (
                          <div key={i} style={{ display: "flex", gap: 14, alignItems: "baseline", marginBottom: i < 4 ? 14 : 0 }}>
                            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: C.gold, flexShrink: 0, width: 24, textAlign: "center" }}>{i + 1}</span>
                            <div>
                              <span style={{ fontSize: 13, fontWeight: 700, color: C.text1, display: "block", marginBottom: 2 }}>{item.title}</span>
                              <span style={{ fontSize: 12.5, color: C.text2, fontStyle: "italic" }}>{item.q}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <p style={{ fontSize: 12, color: C.text2, lineHeight: 1.65, margin: "18px 0 0", textAlign: "center" }}>
                        Together, these five dimensions paint a complete picture of <b style={{ color: C.text1 }}>business independence</b> — which is exactly what a growth-stage owner or a pre-exit owner needs. If you answer "no" to any of them, you've found a constraint worth fixing.
                      </p>
                    </div>
                  </Page>
                </>
              )}
              <div className="page-gap" style={{ height: 24 }}/>
              <Page pageNum={pageOffset} totalPages={totalPages}>
                <div style={{ position: "absolute", top: "0.6in", right: "0.5in", fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 140, fontWeight: 700, color: "rgba(34,211,238,0.035)", lineHeight: 1, zIndex: 0, pointerEvents: "none" }}>
                  {String(dim.num).padStart(2, "0")}
                </div>

                <div style={{ fontSize: 8, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: C.gold, marginBottom: 4 }}>{pillarLabel}</div>
                <div style={{ fontSize: 9.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: C.cyan, marginBottom: 8 }}>
                  Dimension {String(dim.num).padStart(2, "0")} of {NUM_DIMS}
                </div>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 600, color: C.text1, lineHeight: 1.15, marginBottom: 4, letterSpacing: "0.02em", textTransform: "uppercase" }}>{dim.title}</h2>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: C.cyan, marginBottom: 14 }}>{dim.subtitle}</div>
                <p style={{ fontSize: 12, lineHeight: 1.65, color: C.text2, marginBottom: 16 }}>{dim.description}</p>

                <div style={{ padding: "12px 18px", borderRadius: 10, marginBottom: 4,
                  background: `linear-gradient(135deg, ${C.cyan}08, ${C.cyan}02)`, border: `1px solid ${C.cyan}20` }}>
                  {dim.checklist.map((item, i) => (
                    <CheckItem key={i} text={item.text} sub={item.sub}
                      checked={!!chk[i]} onToggle={() => toggleCheck(dim.key, i)} />
                  ))}
                </div>

                <ScoreSelector value={scores[dim.key]} onChange={(v) => setScore(dim.key, v)}
                  lowLabel={dim.lowLabel} highLabel={dim.highLabel} />
              </Page>
            </div>
          );
        })}

        <div className="page-gap" style={{ height: 24 }}/>

        {/* ====== PAGE 15: SCORING SUMMARY ====== */}
        <Page pageNum={15} totalPages={totalPages}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.02em", color: C.text1, marginBottom: 4 }}>
            Your Value Range Assessment
          </h2>
          <p style={{ fontSize: 11, color: C.text3, marginBottom: 14 }}>{scoredCount} of {NUM_DIMS} dimensions scored</p>

          {/* Dual Pillar Scores */}
          <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
            <div style={{ flex: 1, padding: "14px 16px", borderRadius: 10, background: `linear-gradient(135deg, ${C.cyan}08, ${C.cyan}02)`, border: `1.5px solid ${C.cyan}25` }}>
              <div style={{ fontSize: 8.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: C.cyan, marginBottom: 8 }}>Attractiveness Index · Outside-In</div>
              {ATTRACT_DIMS.map(d => {
                const s = scores[d.key]; const sc = scoreColor(s);
                return (
                  <div key={d.key} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                    <div style={{ width: 90, fontSize: 8.5, color: s ? sc : C.text4, fontWeight: 500, textAlign: "right", flexShrink: 0 }}>
                      {d.title.length > 22 ? d.title.split(" & ")[0].split(" ").slice(0,3).join(" ") : d.title.split(" & ")[0]}
                    </div>
                    <div style={{ flex: 1, height: 10, borderRadius: 5, background: `${C.text4}30`, overflow: "hidden" }}>
                      {s && <div style={{ width: `${(s / 6) * 100}%`, height: "100%", borderRadius: 5, background: `linear-gradient(180deg, ${sc}30, ${sc}15)`, border: `0.5px solid ${sc}`, boxShadow: `0 0 8px ${sc}25, inset 0 1px 0 ${sc}20`, transition: "width 0.5s ease" }}/>}
                    </div>
                    <span style={{ width: 18, fontSize: 12, fontWeight: 700, fontFamily: "'Playfair Display', serif", color: s ? sc : C.text4, textAlign: "right" }}>{s || "—"}</span>
                  </div>
                );
              })}
              <div style={{ textAlign: "center", marginTop: 10, paddingTop: 8, borderTop: `1px solid ${C.cyan}15` }}>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: C.text2 }}>{attractTotal}</span>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, color: C.text4 }}>/{MAX_PILLAR}</span>
                {allScored && gateUnlocked && <div style={{ fontSize: 9, color: C.text3, marginTop: 2 }}>{attractPct}%</div>}
              </div>
            </div>

            <div style={{ flex: 1, padding: "14px 16px", borderRadius: 10, background: `linear-gradient(135deg, ${C.gold}06, ${C.gold}02)`, border: `1.5px solid ${C.gold}25` }}>
              <div style={{ fontSize: 8.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: C.gold, marginBottom: 8 }}>Readiness Index · Inside-Out</div>
              {READY_DIMS.map(d => {
                const s = scores[d.key]; const sc = scoreColor(s);
                return (
                  <div key={d.key} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                    <div style={{ width: 90, fontSize: 8.5, color: s ? sc : C.text4, fontWeight: 500, textAlign: "right", flexShrink: 0 }}>
                      {d.title.length > 22 ? d.title.split(" & ")[0].split(" ").slice(0,3).join(" ") : d.title.split(" & ")[0]}
                    </div>
                    <div style={{ flex: 1, height: 10, borderRadius: 5, background: `${C.text4}30`, overflow: "hidden" }}>
                      {s && <div style={{ width: `${(s / 6) * 100}%`, height: "100%", borderRadius: 5, background: `linear-gradient(180deg, ${sc}30, ${sc}15)`, border: `0.5px solid ${sc}`, boxShadow: `0 0 8px ${sc}25, inset 0 1px 0 ${sc}20`, transition: "width 0.5s ease" }}/>}
                    </div>
                    <span style={{ width: 18, fontSize: 12, fontWeight: 700, fontFamily: "'Playfair Display', serif", color: s ? sc : C.text4, textAlign: "right" }}>{s || "—"}</span>
                  </div>
                );
              })}
              <div style={{ textAlign: "center", marginTop: 10, paddingTop: 8, borderTop: `1px solid ${C.gold}15` }}>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: C.text2 }}>{readyTotal}</span>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, color: C.text4 }}>/{MAX_PILLAR}</span>
                {allScored && gateUnlocked && <div style={{ fontSize: 9, color: C.text3, marginTop: 2 }}>{readyPct}%</div>}
              </div>
            </div>
          </div>

          {/* Combined Total */}
          <div style={{ textAlign: "center", margin: "0 0 12px", padding: "14px", borderRadius: 10,
            background: `linear-gradient(135deg, ${allScored && gateUnlocked ? band.color : C.cyan}08, ${allScored && gateUnlocked ? band.color : C.cyan}02)`,
            border: `1.5px solid ${allScored && gateUnlocked ? band.color : C.cyan}30` }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: allScored && gateUnlocked ? band.color : C.cyan, marginBottom: 4 }}>Combined Score</div>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 40, fontWeight: 700, color: allScored && gateUnlocked ? band.color : C.text2 }}>{total}</span>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: C.text4 }}>/{MAX_SCORE}</span>
            {allScored && gateUnlocked && <div style={{ fontSize: 11, color: C.text3, marginTop: 2 }}>{overallPct}%</div>}
          </div>

          {/* EMAIL GATE — appears after all questions answered, before results */}
          {allScored && !gateUnlocked && (
            <EmailGate
              toolName="What's My Business Worth?"
              toolSlug="wmbw"
              accentColor={C.cyan}
              scores={scores}
              summary={{ totalScore: total, band: band.label, pct: overallPct, attractTotal, readyTotal }}
              onUnlock={() => setGateUnlocked(true)}
            />
          )}

          {/* Diagnosis — only visible after gate */}
          {allScored && gateUnlocked && (
            <div style={{ padding: "16px 20px", borderRadius: 12, background: `linear-gradient(135deg, ${band.color}08, ${band.color}02)`,
              border: `1.5px solid ${band.color}30`, animation: "fadeIn 0.5s ease", marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: band.color, marginBottom: 4 }}>
                {band.label}  ·  {band.range[0]}–{band.range[1]} Points
              </div>
              <p style={{ fontSize: 12, color: C.text2, lineHeight: 1.65, marginBottom: 12 }}>{band.desc}</p>
              <div style={{ fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: C.gold, marginBottom: 8 }}>Your biggest opportunities</div>
              {lowestTwo.map(d => (
                <div key={d.key} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: scoreColor(scores[d.key]) }}>{scores[d.key]}</span>
                  <span style={{ fontSize: 11, color: C.text2 }}>{d.title}</span>
                </div>
              ))}
              <p style={{ fontSize: 11.5, color: C.text3, lineHeight: 1.6, fontStyle: "italic", margin: "12px 0 10px" }}>
                Attractiveness without Readiness means a business that looks good from the outside but can't operate and grow without you inside it — and scaling an unready business just amplifies the dysfunction. Readiness without Attractiveness means the engine is sound but doesn't excite the market enough to command a premium.
              </p>
              <p style={{ fontSize: 12, fontWeight: 700, color: C.text1, lineHeight: 1.5 }}>
                The question isn't what your business is worth today — it's what specific actions would move you from a {overallPct}% placement toward the Green Zone where the model is nailed and ready to scale. And do you have the bandwidth and accountability to execute on your own?
              </p>
            </div>
          )}

          {/* 5 Banding Cards — only visible after gate */}
          {allScored && gateUnlocked && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
            {BANDS.map((b, i) => {
              const isActive = allScored && band.label === b.label;
              const isDimmed = allScored && band.label !== b.label;
              return (
                <div key={b.label} style={{ padding: "8px 12px", borderRadius: 8,
                  background: isActive ? `${b.color}12` : `${b.color}06`,
                  border: `1.5px solid ${isActive ? `${b.color}50` : isDimmed ? `${b.color}08` : `${b.color}20`}`,
                  opacity: isDimmed ? 0.7 : 1, transition: "all 0.5s ease",
                  boxShadow: isActive ? `0 0 20px ${b.color}15` : "none",
                  ...(i === BANDS.length - 1 ? { gridColumn: "1 / -1" } : {}),
                }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: b.color, textTransform: "uppercase", letterSpacing: "0.06em" }}>{b.label} · {b.range[0]}–{b.range[1]}</div>
                  <div style={{ fontSize: 9, color: isDimmed ? C.text4 : C.text3, lineHeight: 1.45, marginTop: 2 }}>{b.desc}</div>
                </div>
              );
            })}
          </div>
          )}
        </Page>

        <div className="page-gap" style={{ height: 24 }}/>

        {/* ====== PAGE 16: VALUE IMPACT — Profit Gap & Value Gap ====== */}
        {allScored && gateUnlocked && (
          <Page pageNum={16} totalPages={totalPages}>
            <div style={{ fontSize: 9.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: C.cyan, marginBottom: 8 }}>
              Understanding Your Value Impact
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 500, color: C.text1, lineHeight: 1.15, marginBottom: 6, letterSpacing: "-0.01em" }}>
              What closing these gaps could mean.
            </h2>

            <div style={{ padding: "10px 16px", borderRadius: 8, background: `${C.text4}10`, border: `1px solid ${C.text4}20`, marginBottom: 18 }}>
              <p style={{ fontSize: 10, color: C.text3, lineHeight: 1.55, margin: 0 }}>
                <b style={{ color: C.text2 }}>For educational purposes only.</b> The numbers below use a hypothetical $4M-revenue business with $600K in EBITDA to illustrate how Attractiveness and Readiness scores translate into real dollar impact. These numbers can grow or shrink if you need to move the decimal — the point is understanding the concept and <i>feeling</i> the gap between where you are and where you could be. Your industry's specific range of multiples and valuation would require working with a qualified professional.
              </p>
            </div>

            {/* Range of Value Gauge */}
            <div style={{ padding: "20px 22px", borderRadius: 12, marginBottom: 18,
              background: `linear-gradient(135deg, ${band.color}06, ${band.color}02)`, border: `1.5px solid ${band.color}30`,
              boxShadow: `0 0 20px ${band.color}08` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: band.color }}>Your Estimated Placement</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: band.color }}>{overallPct}%</div>
              </div>
              <div style={{ fontSize: 12, color: C.text2, lineHeight: 1.6, marginBottom: 14 }}>
                Based on your combined Attractiveness & Readiness score, here's where you'd likely fall within a standard industry range of multiples (illustrated here as 3–8×).
              </div>
              {/* Gauge bar */}
              <div style={{ position: "relative", height: 22, borderRadius: 11, overflow: "hidden", marginBottom: 8,
                background: `linear-gradient(90deg, ${C.red} 0%, ${C.amber} 35%, ${C.amberDark} 55%, ${C.cyan} 72%, ${C.green} 100%)`, opacity: 0.85 }}>
                <div style={{ position: "absolute", top: -2, bottom: -2, width: 3, borderRadius: 2, background: C.text1,
                  boxShadow: `0 0 8px rgba(255,255,255,0.8)`,
                  left: `${Math.max(2, Math.min(98, ((overallPct - 17) / (100 - 17)) * 100))}%`,
                  transition: "left 0.5s ease" }}/>
              </div>
              {/* Zone labels under gauge */}
              <div style={{ display: "flex", fontSize: 8.5, textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 600, marginBottom: 12 }}>
                <div style={{ width: "28%", color: C.red, textAlign: "center" }}>Not Sellable<br/><span style={{ fontWeight: 400, fontSize: 8 }}>{"< 45%"}</span></div>
                <div style={{ width: "13%", color: C.amber, textAlign: "center" }}>Discount<br/><span style={{ fontWeight: 400, fontSize: 8 }}>45–57%</span></div>
                <div style={{ width: "14%", color: C.amberDark, textAlign: "center" }}>Market<br/><span style={{ fontWeight: 400, fontSize: 8 }}>58–67%</span></div>
                <div style={{ width: "17%", color: C.cyan, textAlign: "center" }}>Green Zone<br/><span style={{ fontWeight: 400, fontSize: 8 }}>67–71%</span></div>
                <div style={{ width: "28%", color: C.green, textAlign: "center" }}>Best-In-Class<br/><span style={{ fontWeight: 400, fontSize: 8 }}>72%+</span></div>
              </div>
              {/* Multiple range mapping — 2x2 + 1 spanning */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 12 }}>
                {[
                  { label: "Not Sellable", mult: "0×", color: C.red, active: overallPct < 45, desc: "The private capital market places little to no transferable value on the business." },
                  { label: "Discount", mult: "3–4×", color: C.amber, active: overallPct >= 45 && overallPct <= 57, desc: "Below-average placement. Discounted multiple with unfavorable deal terms." },
                  { label: "Market", mult: "~5×", color: C.amberDark, active: overallPct >= 58 && overallPct <= 67, desc: "Average multiple for your industry — sellable but leaving significant value on the table." },
                  { label: "Green Zone", mult: "5–6×", color: C.cyan, active: overallPct >= 67 && overallPct <= 71, desc: "Above average. Attractive and ready — premium multiple with favorable terms." },
                  { label: "Best-In-Class", mult: "7–8×", color: C.green, active: overallPct >= 72, desc: "Highest multiples, best terms, multiple buyers competing for your business." },
                ].map((z, zi, arr) => (
                  <div key={z.label} style={{ padding: "8px 10px", borderRadius: 8, textAlign: "center",
                    background: z.active ? `${z.color}15` : `${z.color}04`,
                    border: `1.5px solid ${z.active ? `${z.color}50` : `${z.color}12`}`,
                    boxShadow: z.active ? `0 0 12px ${z.color}20` : "none",
                    opacity: z.active ? 1 : 0.7, transition: "all 0.3s",
                    ...(zi === arr.length - 1 ? { gridColumn: "1 / -1" } : {}),
                  }}>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: z.color }}>{z.mult}</div>
                    <div style={{ fontSize: 8.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: z.color, marginBottom: 2 }}>{z.label}</div>
                    <div style={{ fontSize: 9.5, color: z.active ? C.text2 : C.text3, lineHeight: 1.45 }}>{z.desc}</div>
                  </div>
                ))}
              </div>
              {/* Disclosure */}
              <div style={{ padding: "10px 14px", borderRadius: 8, background: `${C.text4}08`, border: `1px solid ${C.text4}15` }}>
                <p style={{ fontSize: 10.5, color: C.text3, lineHeight: 1.55, margin: 0 }}>
                  <b style={{ color: C.text2 }}>Important:</b> The multiples shown above are illustrative only. The actual range of multiples for your specific industry, and where you'd place within that range, can only be determined through a deeper assessment and an official business valuation. Kriczky Virtus would help you receive that valuation through our third-party valuation partners as part of a personalized engagement.
                </p>
              </div>
            </div>

            {/* Enhanced Profit Gap visual */}
            <div style={{ padding: "18px 20px", borderRadius: 12, marginBottom: 14,
              background: `linear-gradient(135deg, ${C.cyan}08, ${C.cyan}02)`, border: `1.5px solid ${C.cyan}25` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: C.cyan }}>The Profit Gap</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 300, color: C.cyan }}>$360K<span style={{ fontSize: 14, color: C.text3 }}>/yr</span></div>
              </div>
              <p style={{ fontSize: 11.5, color: C.text2, lineHeight: 1.6, marginBottom: 10 }}>
                A $4M business operating at <b style={{ color: C.text1 }}>15% EBITDA margin</b> ($600K) when best-in-class peers achieve <b style={{ color: C.text1 }}>24%</b> ($960K) has a Profit Gap of <b style={{ color: C.cyan }}>$360K/year</b> — money left on the table annually due to operational inefficiencies, pricing gaps, or cost structure.
              </p>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <div style={{ flex: 1, height: 8, borderRadius: 4, background: `${C.cyan}15`, overflow: "hidden" }}>
                  <div style={{ width: "62.5%", height: "100%", borderRadius: 4, background: `linear-gradient(90deg, ${C.cyan}60, ${C.cyan})` }}/>
                </div>
                <span style={{ fontSize: 8, color: C.text3 }}>15%</span>
                <div style={{ width: 1, height: 12, background: C.text4 }}/>
                <span style={{ fontSize: 8, color: C.cyan, fontWeight: 600 }}>24% BIC</span>
              </div>
              <div style={{ fontSize: 9.5, color: C.text3, fontStyle: "italic", marginTop: 8 }}>Every year this gap remains open, that's $360K in earnings you're not capturing — and not compounding.</div>
            </div>

            {/* Enhanced Value Gap visual */}
            <div style={{ padding: "18px 20px", borderRadius: 12, marginBottom: 14,
              background: `linear-gradient(135deg, ${C.gold}06, ${C.gold}02)`, border: `1.5px solid ${C.gold}25` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: C.gold }}>The Value Gap</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 300, color: C.gold }}>$5.3M</div>
              </div>
              <p style={{ fontSize: 11.5, color: C.text2, lineHeight: 1.6, marginBottom: 10 }}>
                That same business at a <b style={{ color: C.red }}>4× multiple</b> (below-average A&R) is worth <b style={{ color: C.red }}>$2.4M</b>. At best-in-class earnings and an <b style={{ color: C.green }}>8× multiple</b>, it could be worth <b style={{ color: C.green }}>$7.7M</b>. The Value Gap: <b style={{ color: C.gold }}>$5.3M</b> in enterprise value you could be building toward.
              </p>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: C.red }}>$2.4M</div>
                  <div style={{ fontSize: 7, color: C.text3, textTransform: "uppercase" }}>4× multiple</div>
                </div>
                <div style={{ flex: 1, height: 2, background: `linear-gradient(90deg, ${C.red}, ${C.gold}, ${C.green})`, borderRadius: 1 }}/>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: C.green }}>$7.7M</div>
                  <div style={{ fontSize: 7, color: C.text3, textTransform: "uppercase" }}>8× multiple</div>
                </div>
              </div>
              <div style={{ fontSize: 9.5, color: C.text3, fontStyle: "italic", marginTop: 8 }}>The Value Gap compounds: higher earnings × higher multiples = exponential value creation.</div>
            </div>

            <div style={{ padding: "18px 22px", borderRadius: 12, marginTop: 24,
              background: `linear-gradient(135deg, ${C.gold}10, ${C.gold}04)`, border: `1.5px solid ${C.gold}35`,
              boxShadow: `0 0 24px ${C.gold}12, inset 0 1px 0 ${C.gold}15` }}>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: C.gold, marginBottom: 6 }}>The Real Question</div>
              <p style={{ fontSize: 13, color: C.text1, lineHeight: 1.65, margin: 0, fontWeight: 500 }}>
                <b style={{ color: C.gold }}>Your scores tell a story.</b> How much of the Profit Gap and Value Gap applies to <i>your</i> business? That answer requires a fully personalized engagement — but the mechanics above show you what potentially could be at stake.
              </p>
            </div>
          </Page>
        )}

        <div className="page-gap" style={{ height: 24 }}/>

        {/* ====== PAGE 17: PRIORITIZED VALUE ENHANCEMENT ROADMAP ====== */}
        {allScored && gateUnlocked && (
          <Page pageNum={17} totalPages={totalPages}>
            <div style={{ fontSize: 9.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: C.cyan, marginBottom: 8 }}>
              Your Prioritized Value Enhancement Roadmap
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 500, color: C.text1, lineHeight: 1.15, marginBottom: 6, letterSpacing: "-0.01em" }}>
              What needs to happen — <span style={{ color: C.gold }}>in priority order.</span>
            </h2>
            <p style={{ fontSize: 11.5, color: C.text2, lineHeight: 1.6, marginBottom: 14 }}>
              Based on your scores, here's <b style={{ color: C.text1 }}>what</b> would need to happen to systematically move up the Range of Value. The <b style={{ color: C.text1 }}>how</b> — the specific strategies, the team you'd need, the 90-day execution sprints — is what the fully personalized Valuation Driver Intensive engagement delivers.
            </p>

            {/* Deal-killers */}
            {dealKillers.length > 0 && (
              <div style={{ padding: "12px 16px", borderRadius: 10, marginBottom: 10, background: `linear-gradient(135deg, ${C.red}08, ${C.red}02)`, border: `1px solid ${C.red}20` }}>
                <div style={{ fontSize: 9.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: C.red, marginBottom: 8 }}>
                  Phase 1 — Potential Deal-Killers · These Could Make Your Business Unsellable
                </div>
                <p style={{ fontSize: 10.5, color: C.text3, lineHeight: 1.5, marginBottom: 8 }}>
                  Scoring 1–2 on any dimension could be a deal-killer. A buyer may walk away — or demand such extreme discounts and unfavorable terms that selling wouldn't be worth it. Before anything else, you'd need to address these foundational gaps and move each to at least 4/6. That requires installing the right people, systems, or structures — not just awareness, but execution.
                </p>
                {dealKillers.map(d => (
                  <div key={d.key} style={{ marginBottom: 8, padding: "8px 12px", borderRadius: 6, background: `${C.red}06` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, fontWeight: 700, color: C.red, width: 20, textAlign: "center", flexShrink: 0 }}>{scores[d.key]}</span>
                      <span style={{ fontSize: 10.5, color: C.text2, fontWeight: 600, flex: 1 }}>{d.title}</span>
                      <span style={{ display: "flex", alignItems: "center", gap: 3, flexShrink: 0 }}>
                        <svg width="10" height="10" viewBox="0 0 16 16" style={{ filter: `drop-shadow(0 0 3px ${C.red}80)` }}><circle cx="8" cy="8" r="6" fill="none" stroke={C.red} strokeWidth="1.5"/><path d="M5.5 8L7 9.5L10.5 6" stroke={C.red} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
                        <span style={{ fontSize: 9, color: C.red, fontWeight: 600 }}>Target: 4+</span>
                      </span>
                    </div>
                    <p style={{ fontSize: 9.5, color: C.text3, lineHeight: 1.45, margin: "4px 0 0 28px" }}>
                      {d.key === "managementTeam" && "You'd need to install department heads (Sales, Operations, Finance) who can run core functions whether you're in the office or on vacation — and prove the business doesn't collapse without you."}
                      {d.key === "customerConcentration" && "You'd need to actively diversify your revenue base, assign client relationships to team members, and build contractual protections that survive any leadership change."}
                      {d.key === "revenueQuality" && "You'd need to convert project-based revenue to recurring contracts, build a documented sales pipeline, and demonstrate consistent year-over-year growth."}
                      {d.key === "marketPosition" && "You'd need to define and defend a niche, document your competitive moat, and build intellectual property or exclusive advantages that a competitor can't replicate."}
                      {d.key === "financialPerformance" && "You'd need to get your financials recasted, benchmark margins against industry data, and systematically close the gap between your EBITDA margin and best-in-class peers."}
                      {d.key === "documentation" && "You'd need to build a document-ready operation: SOPs, organized contracts, auditable financials, and systems that capture institutional knowledge before it walks out the door."}
                      {d.key === "contingency" && "You'd need a funded buy-sell agreement, key-person insurance, and a written contingency plan for all 5 Ds — because an unplanned disruption without these protections could destroy everything you've built."}
                      {d.key === "financialInfra" && "You'd need to get your books to investor-grade: professionally prepared financials, monthly reporting cadence, unit economics visibility, and a quality of earnings readiness that could withstand any scrutiny."}
                      {d.key === "revPredictability" && "You'd need to convert at-risk revenue to contracts, build a pipeline system that doesn't live in anyone's head, and create the forecast accuracy that lets you hire, invest, and plan with confidence."}
                      {d.key === "succession" && "You'd need named successors with development plans, cross-training for every critical function, and proof that the business performs during your absence — because you can't scale what depends entirely on you."}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Below midpoint */}
            {belowMid.length > 0 && (
              <div style={{ padding: "12px 16px", borderRadius: 10, marginBottom: 10, background: `linear-gradient(135deg, ${C.amber}06, ${C.amber}02)`, border: `1px solid ${C.amber}18` }}>
                <div style={{ fontSize: 9.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: C.amber, marginBottom: 8 }}>
                  Phase 2 — Below the Midpoint · Suppressing Your Multiple
                </div>
                <p style={{ fontSize: 10.5, color: C.text3, lineHeight: 1.5, marginBottom: 8 }}>
                  Scoring 3 means you're below the midpoint — not a deal-killer, but these dimensions are actively suppressing your multiple and could cause a buyer to discount their offer or add unfavorable terms. Moving to 4+ is what shifts you from discount territory toward market-rate valuations.
                </p>
                {belowMid.map(d => (
                  <div key={d.key} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, fontWeight: 700, color: C.amber, width: 20, textAlign: "center", flexShrink: 0 }}>{scores[d.key]}</span>
                    <span style={{ fontSize: 10.5, color: C.text2, flex: 1 }}>{d.title}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 3, flexShrink: 0 }}>
                      <svg width="10" height="10" viewBox="0 0 16 16" style={{ filter: `drop-shadow(0 0 3px ${C.amber}80)` }}><circle cx="8" cy="8" r="6" fill="none" stroke={C.amber} strokeWidth="1.5"/><path d="M5.5 8L7 9.5L10.5 6" stroke={C.amber} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
                      <span style={{ fontSize: 9, color: C.amber, fontWeight: 600 }}>Target: 4–5</span>
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Solid but not premium */}
            {solidNotPremium.length > 0 && (
              <div style={{ padding: "12px 16px", borderRadius: 10, marginBottom: 10, background: `linear-gradient(135deg, ${C.cyan}06, ${C.cyan}02)`, border: `1px solid ${C.cyan}18` }}>
                <div style={{ fontSize: 9.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: C.cyan, marginBottom: 8 }}>
                  Phase 3 — Capture Premium Value · Move from Market to Green Zone
                </div>
                <p style={{ fontSize: 10.5, color: C.text3, lineHeight: 1.5, marginBottom: 8 }}>
                  Scoring 4 is solid — you're above the midpoint. But the difference between a 4 and a 5 is where premium multiples live. This is where systematic value acceleration creates the most dollar impact per unit of effort.
                </p>
                {solidNotPremium.map(d => (
                  <div key={d.key} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, fontWeight: 700, color: C.cyan, width: 20, textAlign: "center", flexShrink: 0 }}>{scores[d.key]}</span>
                    <span style={{ fontSize: 10.5, color: C.text2, flex: 1 }}>{d.title}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 3, flexShrink: 0 }}>
                      <svg width="10" height="10" viewBox="0 0 16 16" style={{ filter: `drop-shadow(0 0 3px ${C.cyan}80)` }}><circle cx="8" cy="8" r="6" fill="none" stroke={C.cyan} strokeWidth="1.5"/><path d="M5.5 8L7 9.5L10.5 6" stroke={C.cyan} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
                      <span style={{ fontSize: 9, color: C.cyan, fontWeight: 600 }}>Target: 5+</span>
                    </span>
                  </div>
                ))}
              </div>
            )}

            {dealKillers.length === 0 && belowMid.length === 0 && solidNotPremium.length === 0 && (
              <div style={{ padding: "14px 18px", borderRadius: 10, marginBottom: 10, background: `linear-gradient(135deg, ${C.green}08, ${C.green}02)`, border: `1px solid ${C.green}25` }}>
                <p style={{ fontSize: 12, color: C.text1, lineHeight: 1.6, fontWeight: 600 }}>
                  Every dimension is scoring 5 or higher — you're operating at or near best-in-class. The focus now shifts to sustaining these scores, closing your remaining Profit Gap through operational optimization, and timing your transition to maximize market conditions.
                </p>
              </div>
            )}

            <div style={{ padding: "14px 18px", borderRadius: 12, marginTop: 4,
              background: `linear-gradient(135deg, ${C.gold}08, ${C.gold}03)`, border: `1.5px solid ${C.gold}30`,
              boxShadow: `0 0 20px ${C.gold}08` }}>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: C.gold, marginBottom: 8 }}>
                This Diagnostic Is a Starting Point — Not the Plan
              </div>
              <p style={{ fontSize: 11.5, color: C.text2, lineHeight: 1.6, marginBottom: 8 }}>
                A 10–15 minute self-assessment can reveal <i>where</i> the gaps are. But systematically closing your Profit Gap and Value Gap requires turning this into a <b style={{ color: C.text1 }}>fully personalized Valuation Driver Intensive</b> built around your specific business, your industry's range of multiples, your business goals, and your timeline. That's a process — not a quick scoring exercise.
              </p>
              <p style={{ fontSize: 11.5, color: C.text2, lineHeight: 1.6, margin: 0 }}>
                <b style={{ color: C.gold }}>Working with Kriczky Virtus</b> means we help build the advisory team with who is needed when they are needed, and hold you accountable to ruthlessly execute (and help you do so) to systematically close your Profit Gap and Value Gap. The Valuation Driver Intensive engagement makes it real, with specific dollar targets, named action owners, and 90-day execution sprints specifically personalized to your business and its constraints.
              </p>
            </div>
          </Page>
        )}

        <div className="page-gap" style={{ height: 24 }}/>

        {/* ====== PAGE 18: FIRST 3 MOVES ====== */}
        {allScored && gateUnlocked && (
          <Page pageNum={18} totalPages={totalPages}>
            <div style={{ fontSize: 9.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: C.cyan, marginBottom: 8 }}>
              Your Personalized Next Steps
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 500, color: C.text1, lineHeight: 1.15, marginBottom: 6, letterSpacing: "-0.01em" }}>
              Your first three moves.
            </h2>
            <p style={{ fontSize: 12, color: C.text2, lineHeight: 1.65, marginBottom: 16 }}>
              These are your highest-leverage actions — specific to your lowest-scoring dimensions, calibrated to your current level, and executable this week. Not theory. Not someday. This week.
            </p>

            {lowestThree.map((dim, mi) => {
              const s = scores[dim.key] || 0;
              const sc = scoreColor(s);
              const tier = s <= 2 ? "low" : s <= 4 ? "mid" : "high";
              const topWin = dim.quickWins[tier][0];
              const isAttract = ATTRACT_DIMS.some(a => a.key === dim.key);
              const pillarLabel = isAttract ? "Business Attractiveness" : "Business Readiness";
              return (
                <div key={dim.key} style={{ padding: "14px 18px", borderRadius: 10, background: `${sc}06`, border: `1px solid ${sc}20`, marginBottom: 12 }}>
                  <div style={{ display: "table", padding: "3px 10px", borderRadius: 5, background: `${C.gold}15`, border: `1px solid ${C.gold}30`, marginBottom: 8 }}>
                    <span style={{ display: "table-cell", verticalAlign: "middle", fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: C.gold }}>MOVE {String(mi + 1).padStart(2, "0")}</span>
                  </div>
                  <div style={{ fontSize: 10, color: sc, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>
                    {dim.title} — scored {s}/6
                  </div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontWeight: 600, color: C.text1, marginBottom: 4 }}>{topWin.title}</div>
                  <div style={{ fontSize: 10.5, lineHeight: 1.55, color: C.text3 }}>{topWin.context}</div>
                </div>
              );
            })}

            {/* Qualifier */}
            <div style={{ padding: "14px 18px", borderRadius: 10, background: `linear-gradient(135deg, ${C.cyan}06, ${C.cyan}02)`, border: `1.5px solid ${C.cyan}25`, marginTop: 16 }}>
              <div style={{ fontSize: 12, lineHeight: 1.65, color: C.text2 }}>
                You can implement these yourself — or our team can help you close your Value Gap and systematically build a{" "}
                <span style={{ color: C.cyan, fontWeight: 700 }}>Masterpiece Business</span> — one that's nailed, scalable, and ready for whatever comes next.
              </div>
            </div>
          </Page>
        )}

        <div className="page-gap" style={{ height: 24 }}/>

        {/* ====== PAGE 19: BUSINESS INDEPENDENCE BLUEPRINT PREVIEW ====== */}
        {allScored && gateUnlocked && (
          <Page pageNum={19} totalPages={totalPages}>
            <div style={{ fontSize: 9.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: C.cyan, marginBottom: 8 }}>
              Your Natural Next Step
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 600, color: C.text1, lineHeight: 1.15, marginBottom: 4, letterSpacing: "0.01em" }}>
              Go Deeper: The <span style={{ color: C.cyan }}>Business Independence</span> Blueprint
            </h2>
            <p style={{ fontSize: 12, color: C.text2, lineHeight: 1.65, marginBottom: 16 }}>
              This tool showed you <i>what</i> your business could be worth and <i>where</i> the gaps are. The Business Independence Blueprint shows you <i>why</i> — by examining the four categories of intangible assets that account for up to 80% of your business's value but never show up on a balance sheet.
            </p>

            {/* 4 Capitals visual grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              {[
                {
                  name: "Human Capital", color: "#A78BFA", icon: <><path d="M19 21v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2" stroke="#A78BFA" strokeWidth="1.5" fill="none"/><circle cx="12" cy="7" r="4" stroke="#A78BFA" strokeWidth="1.5" fill="none"/></>,
                  dims: ["Talent Depth & Retention", "Leadership Pipeline", "Execution Independence"],
                  q: "Could your team thrive without any single person?"
                },
                {
                  name: "Customer Capital", color: C.cyan, icon: <><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="none" stroke={C.cyan} strokeWidth="1.5"/></>,
                  dims: ["Relationship Transferability", "Revenue Quality & Concentration", "Customer Loyalty & Retention"],
                  q: "Are your client relationships owned by the company — or by you?"
                },
                {
                  name: "Structural Capital", color: "#60A5FA", icon: <><rect x="3" y="3" width="18" height="18" rx="2" stroke="#60A5FA" strokeWidth="1.5" fill="none"/><line x1="3" y1="9" x2="21" y2="9" stroke="#60A5FA" strokeWidth="1.5"/><line x1="9" y1="9" x2="9" y2="21" stroke="#60A5FA" strokeWidth="1.5"/></>,
                  dims: ["Documented Systems & Processes", "Technology & Infrastructure", "IP & Competitive Moat"],
                  q: "Could someone else operate your business by reading your systems?"
                },
                {
                  name: "Social Capital", color: C.green, icon: <><circle cx="12" cy="8" r="3" stroke={C.green} strokeWidth="1.5" fill="none"/><path d="M16 21v-1a4 4 0 00-8 0v1" stroke={C.green} strokeWidth="1.5" fill="none"/><circle cx="5" cy="10" r="2.5" stroke={C.green} strokeWidth="1.2" fill="none" opacity="0.6"/><path d="M8.5 21v-.5a3.5 3.5 0 00-7 0v.5" stroke={C.green} strokeWidth="1.2" fill="none" opacity="0.6"/><circle cx="19" cy="10" r="2.5" stroke={C.green} strokeWidth="1.2" fill="none" opacity="0.6"/><path d="M22.5 21v-.5a3.5 3.5 0 00-7 0v.5" stroke={C.green} strokeWidth="1.2" fill="none" opacity="0.6"/></>,
                  dims: ["Culture & Brand Identity", "Internal Alignment", "Reputation & Market Position"],
                  q: "Does your brand mean something without your name attached?"
                },
              ].map((cap, ci) => (
                <div key={ci} style={{
                  padding: "16px 16px 14px", borderRadius: 10, position: "relative", overflow: "hidden",
                  background: `linear-gradient(135deg, ${cap.color}06, ${cap.color}02)`,
                  border: `1px solid ${cap.color}20`,
                }}>
                  {/* Large icon — top right corner */}
                  <div style={{ position: "absolute", top: 10, right: 10, width: 40, height: 40, borderRadius: 9,
                    background: `${cap.color}08`, border: `1px solid ${cap.color}15`,
                    display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">{cap.icon}</svg>
                  </div>
                  {/* Title */}
                  <span style={{ fontSize: 11, fontWeight: 700, color: cap.color, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 10, paddingRight: 48 }}>{cap.name}</span>
                  {/* Dimensions */}
                  {cap.dims.map((dim, di) => (
                    <div key={di} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                      <div style={{ width: 4, height: 4, borderRadius: "50%", background: `${cap.color}50`, flexShrink: 0 }}/>
                      <span style={{ fontSize: 9.5, color: C.text2 }}>{dim}</span>
                    </div>
                  ))}
                  <div style={{ fontSize: 10, color: cap.color, fontStyle: "italic", marginTop: 8, lineHeight: 1.45 }}>{cap.q}</div>
                </div>
              ))}
            </div>

            {/* Bridge copy */}
            <div style={{ padding: "14px 18px", borderRadius: 10, marginBottom: 14,
              background: `linear-gradient(135deg, ${C.cyan}06, ${C.cyan}02)`, border: `1px solid ${C.cyan}20` }}>
              <p style={{ fontSize: 11.5, color: C.text2, lineHeight: 1.6, margin: 0 }}>
                <b style={{ color: C.cyan }}>How it connects:</b> This assessment scored your business at the 30,000-foot level. The Business Independence Blueprint goes one level deeper — examining the 12 dimensions across these four capitals that explain <i>why</i> your scores are what they are. It takes about 10 minutes, and the results naturally point you toward the specific deep-dive diagnostic that matches your weakest capital.
              </p>
            </div>

            {/* CTA */}
            <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
              <div style={{ display: "inline-block" }}>
                <GlassBtn href="https://www.kriczkyvirtus.com/tools/bib" color={C.cyan}>TAKE THE BUSINESS INDEPENDENCE BLUEPRINT</GlassBtn>
              </div>
            </div>
          </Page>
        )}

        <div className="page-gap" style={{ height: 24 }}/>

        {/* ====== LAST PAGE: CTA ====== */}
        <Page pageNum={(allScored && gateUnlocked) ? 20 : 16} totalPages={totalPages}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: C.gold, marginBottom: 10 }}>Your Advisor</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 500, lineHeight: 1.2, marginBottom: 18 }}>
            Your business is your <span style={{ color: C.gold }}>legacy.</span>
          </div>

          {/* Edward headshot + bio */}
          <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 20 }}>
            <div style={{ width: 88, height: 88, borderRadius: "50%", flexShrink: 0, overflow: "hidden", outline: `2px solid ${C.gold}40`, outlineOffset: 2, background: C.bgElev }}>
              <img src={HEADSHOT} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}/>
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.text1 }}>Edward Kriczky, <span style={{ color: C.text1 }}>CEPA®</span></div>
              <div style={{ fontSize: 11, color: C.gold, marginBottom: 6 }}>Founder, Kriczky Virtus</div>
              <div style={{ fontSize: 11, lineHeight: 1.6, color: C.text2 }}>
                I help business owners in the $1M–$10M range turn their businesses into assets that generate wealth — whether they're building to sell, building to keep, or building to hand down. As a Certified Exit Planning Advisor, I bring a structured methodology to the question every owner eventually asks: <i>"What is my business actually worth, and what would it take to make it worth more?"</i>
              </div>
            </div>
          </div>

          {/* What happens next — Valuation Driver Intensive timeline */}
          <div style={{ padding: "18px 22px", borderRadius: 12, marginBottom: 18,
            background: `linear-gradient(135deg, ${C.gold}06, ${C.gold}02)`, border: `1.5px solid ${C.gold}25` }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 500, color: C.text1, marginBottom: 16 }}>
              What happens next.
            </div>
            {/* Icon timeline */}
            <div style={{ display: "flex", alignItems: "flex-start", marginBottom: 16 }}>
              {[
                { label: "Week 1", title: "Valuation Driver Intensive", desc: "We define your Profit Gap, Value Gap, and build your prioritized action plan.", color: C.gold, icon: <><rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke={C.gold} strokeWidth="1.3" fill="none"/><line x1="3" y1="10" x2="21" y2="10" stroke={C.gold} strokeWidth="1.3"/><line x1="8" y1="2" x2="8" y2="6" stroke={C.gold} strokeWidth="1.3"/><line x1="16" y1="2" x2="16" y2="6" stroke={C.gold} strokeWidth="1.3"/></> },
                { label: "Months 1–3", title: "Sprint 1 Execution", desc: "Monthly working sessions. I'm in the room for every decision, delegation, and process build.", color: C.gold, icon: <><path d="M17 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2" stroke={C.gold} strokeWidth="1.3" fill="none"/><circle cx="10" cy="7" r="4" stroke={C.gold} strokeWidth="1.3" fill="none"/><path d="M23 21v-2a4 4 0 00-3-3.87" stroke={C.gold} strokeWidth="1.3" fill="none"/><path d="M16 3.13a4 4 0 010 7.75" stroke={C.gold} strokeWidth="1.3" fill="none"/></> },
                { label: "Day 90", title: "Re-Score & Adapt", desc: "Fresh diagnostic with updated numbers. See what moved. The roadmap adapts. We keep going.", color: C.green, icon: <><circle cx="12" cy="12" r="9" stroke={C.green} strokeWidth="1.3" fill="none"/><circle cx="12" cy="12" r="5" stroke={C.green} strokeWidth="1.3" fill="none"/><circle cx="12" cy="12" r="1.5" fill={C.green}/></> },
              ].map((step, si, arr) => (
                <div key={si} style={{ display: "flex", alignItems: "flex-start", flex: si < arr.length - 1 ? 1 : undefined }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ width: 38, height: 38, borderRadius: "50%", border: `2px solid ${step.color}55`, background: `${step.color}06`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 10px ${step.color}20, 0 0 3px ${step.color}25` }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">{step.icon}</svg>
                    </div>
                    <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: step.color, marginTop: 5 }}>{step.label}</span>
                    <span style={{ fontSize: 10, fontWeight: 600, color: C.text1, marginTop: 3 }}>{step.title}</span>
                    <span style={{ fontSize: 9, color: C.text2, lineHeight: 1.45, textAlign: "center", marginTop: 3, maxWidth: 140 }}>{step.desc}</span>
                  </div>
                  {si < arr.length - 1 && <div style={{ flex: 1, height: 2, marginTop: 19, background: `${C.gold}45`, boxShadow: `0 0 4px ${C.gold}15` }}/>}
                </div>
              ))}
            </div>
          </div>

          {/* Primary CTA */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
            <div style={{ display: "inline-block" }}>
              <GlassBtn href="https://www.kriczkyvirtus.com/free-session" color={C.gold}>BOOK YOUR FREE WORKING SESSION</GlassBtn>
            </div>
          </div>

          {/* Closing quote */}
          <div style={{ padding: "14px 0 14px 18px", borderLeft: `3px solid ${C.gold}60`, marginBottom: 14 }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontStyle: "italic", lineHeight: 1.55, color: C.text1 }}>
              The value of your business isn't determined by what you've built — it's the willingness to see what a buyer sees, ruthlessly execute in 90-day sprints to close the gaps they would find (and stay accountable to do so), and build something that could thrive and grow without you — whether you want to sell or hold forever.
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${C.text4}60, transparent)`, marginBottom: 14 }}/>

          {/* Contact footer */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.text3} strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/></svg>
                <span style={{ fontSize: 10, color: C.text3 }}>ekriczky@kriczkyvirtus.com</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.text3} strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span style={{ fontSize: 10, color: C.text3 }}>kriczkyvirtus.com</span>
              </div>
            </div>
            <Shield size={32} glow />
          </div>
        </Page>

      </div>
    </div>
  );
}
