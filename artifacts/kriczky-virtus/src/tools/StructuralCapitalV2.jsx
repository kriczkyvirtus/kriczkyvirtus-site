import DeepDiveReport, { TONE, scoreTone } from "./DeepDiveReport.jsx";
export { TONE, scoreTone };

/* ═══════════════════════════════════════════════════════════════
   STRUCTURAL CAPITAL DEEP-DIVE - v2 (house style)     /tools/structural-capital/v2
   The diagnostic-tools v2 sample: the same content, scoring, gate and CTA as
   StructuralCapital.jsx, in the Kriczky Virtus house style - cream letter
   pages scaled to fit, engraved texture and shield, porcelain tiles, a dark
   cover, no em dashes, and a real PDF download once the results unlock.
   Content is copied verbatim from v1 (em dashes swapped for " - ").
   (22 Nov 2026) The page frame now lives in DeepDiveReport.jsx, shared with
   Customer and Human Capital; this file holds Structural Capital's content.
   ═══════════════════════════════════════════════════════════════ */

/* Dark-theme fills, kept so the content blocks below read exactly as in v1. */
const C = {
  gold: "#C8A24E", green: "#34D399", red: "#F87171", amber: "#FBBF24", amberDark: "#D4A017",
  blue: "#60A5FA", cyan: "#22D3EE", purple: "#A78BFA",
};

/* ── DIMENSIONS (10) ── */
export const DIMS = [
  {
    key: "d1", num: 1, of: 10,
    title: "SOP Coverage & Documentation",
    subtitle: "Are your core processes written down, or trapped in people's heads?",
    description: "A $5M home services company ran like clockwork - until the operations manager who 'knew everything' got recruited by a competitor. Within two weeks, scheduling fell apart, quality complaints tripled, and the owner was back to working 70-hour weeks. The problem wasn't losing one person. The problem was that the company's entire operating system lived in that person's head. Compare that to a $3M logistics company where every core process has a written SOP, updated quarterly, accessible to anyone on the team. When their ops lead left, the replacement was fully productive in 10 days. Documentation isn't bureaucracy. It's the difference between a business that runs on memory and one that runs on systems.",
    checks: [
      { text: "Our top 10 revenue-generating processes are documented in written SOPs.", sub: "Not 'we sort of have some docs.' Written, accessible, step-by-step procedures that someone new could follow tomorrow." },
      { text: "SOPs have been reviewed or updated within the last 12 months.", sub: "Outdated documentation is worse than none - it creates false confidence. When's the last time anyone actually reviewed yours?" },
      { text: "New hires can follow SOPs to perform core tasks without extensive shadowing.", sub: "The test of good documentation: can someone execute from the document alone, or do they need a translator?" },
      { text: "There is a designated owner for maintaining each SOP.", sub: "Documentation without ownership decays. Every SOP needs a name next to it - someone accountable for keeping it current." },
    ],
    lowLabel: "Tribal knowledge only",
    highLabel: "Fully documented systems",
    quickWins: {
      low: [
        { title: "List your top 10 processes and rate each: documented, partially documented, or undocumented", context: "A 30-minute exercise that shows you exactly how much of your business lives in people's heads. Most owners are shocked by the result." },
        { title: "Record a screen-share or walkthrough video of your #1 undocumented process this week", context: "Don't write a perfect SOP. Hit record, walk through the process, and have someone transcribe it. A rough draft beats no draft infinitely." },
        { title: "Assign SOP ownership: one name per process, accountable for keeping it current", context: "The person who does the work owns the doc. No ownership = no accountability = guaranteed decay." },
      ],
      mid: [
        { title: "Implement a quarterly SOP review cycle with calendar reminders", context: "Every SOP gets reviewed once per quarter by its owner. A 15-minute check: is this still accurate? What's changed? Update and date-stamp." },
        { title: "Create a centralized SOP library accessible to the entire team", context: "Google Drive, Notion, Confluence - the tool matters less than the habit. If people can't find the SOP in 30 seconds, it doesn't exist." },
        { title: "Run a 'process audit' - have a non-expert try to execute from documentation alone", context: "The fastest way to find gaps: hand the SOP to someone who's never done the task. Where they get stuck reveals what's missing." },
      ],
      high: [
        { title: "Build version control into your SOP system with change logs", context: "Track what changed, when, and why. Version history creates institutional memory and prevents regression." },
        { title: "Document the meta-process: how to create and maintain SOPs in your organization", context: "A documented documentation process ensures consistency as you scale. It's the SOP for SOPs - and it's worth its weight in gold." },
      ],
    },
  },
  {
    key: "d2", num: 2, of: 10,
    title: "Process Consistency & Quality Control",
    subtitle: "Does the output quality stay the same regardless of who's doing the work?",
    description: "A $4M digital marketing agency had a reputation problem it couldn't see: the quality of their work depended entirely on which team member was assigned to the project. Their best people delivered exceptional results. Their average people delivered mediocre ones. Same processes, same tools, same pricing - wildly different outcomes. They didn't have a quality problem. They had a consistency problem. The fix wasn't hiring better people. It was building quality checkpoints into every workflow so that the process - not the person - guaranteed the standard. Process consistency is what allows you to scale without degrading quality, and what gives anyone evaluating your business confidence that the results are reproducible.",
    checks: [
      { text: "We have defined quality standards for every client-facing deliverable.", sub: "Not 'we know good when we see it.' Written criteria that any team member can check against before delivery." },
      { text: "Quality checkpoints are built into our workflows - not reliant on individual judgment.", sub: "If quality depends on someone 'catching' errors, it's not a system. Systems prevent errors; people catch what systems miss." },
      { text: "Customer complaints about quality inconsistency are rare (fewer than 5% of engagements).", sub: "If quality varies by who's on the project, you have a consistency gap that erodes trust and limits growth." },
      { text: "We measure quality metrics and review them at least monthly.", sub: "Error rates, rework percentages, customer satisfaction scores - what gets measured gets managed." },
    ],
    lowLabel: "Person-dependent quality",
    highLabel: "System-guaranteed consistency",
    quickWins: {
      low: [
        { title: "Identify your top 3 client-facing deliverables and write a quality checklist for each", context: "A simple pre-delivery checklist: 10 items that must be true before anything goes to a client. Checklists eliminate 80% of quality variance." },
        { title: "Review your last 10 client complaints - what pattern emerges?", context: "Most quality issues cluster around 2–3 root causes. Fix those causes and you fix 70% of the problem." },
        { title: "Implement a peer review step before any major deliverable ships", context: "A second pair of eyes catches what the creator misses. It adds 15 minutes and prevents costly rework and reputation damage." },
      ],
      mid: [
        { title: "Build a quality scorecard and track it monthly across all teams/projects", context: "Score each deliverable: met standard, exceeded standard, below standard. The data reveals which processes, teams, and clients need attention." },
        { title: "Create templates and frameworks for your most common deliverables", context: "Templates enforce consistency. When every proposal starts from the same framework, the floor rises even if the ceiling varies." },
        { title: "Run a monthly quality review meeting with team leads", context: "15 minutes: what went wrong, what went right, what process change would prevent the biggest quality miss from recurring? Cumulative improvement." },
      ],
      high: [
        { title: "Implement a formal quality management system (QMS) with documented standards", context: "A QMS doesn't have to be ISO-certified to be valuable. Documented standards + measurement + improvement cycles = institutional quality." },
        { title: "Survey clients quarterly on quality consistency and use the data to drive process changes", context: "Client perception of consistency matters as much as internal metrics. Their feedback reveals blind spots your internal measures miss." },
      ],
    },
  },
  {
    key: "d3", num: 3, of: 10,
    title: "Technology Stack & Automation",
    subtitle: "Does your tech enable scale, or is it held together with duct tape?",
    description: "A $6M professional services firm was running their entire operation on a patchwork of spreadsheets, email threads, and a 15-year-old custom Access database that one person knew how to maintain. When that person left, the database broke - and with it, their ability to invoice, track projects, and report to clients. They spent $180K and six months rebuilding what should have been a $30K/year SaaS implementation. Your technology stack isn't just an operational tool. It's the nervous system of your business. Modern, integrated, well-maintained technology enables scale, reduces manual effort, and signals operational maturity to anyone evaluating your business - whether that's a lender, a partner, or an eventual buyer.",
    checks: [
      { text: "Our core systems (CRM, ERP, project management, accounting) are cloud-based and integrated.", sub: "On-premise, disconnected systems create data silos, manual workarounds, and single points of failure." },
      { text: "We have automated at least 3 repetitive manual processes in the last 12 months.", sub: "If your team is still doing the same manual tasks they did two years ago, you're paying for time that technology could reclaim." },
      { text: "Our technology stack could support 2x current revenue without major overhaul.", sub: "If doubling revenue would break your systems, your tech is a growth bottleneck - not an enabler." },
      { text: "We have a technology roadmap that aligns with our business growth plan.", sub: "Reactive tech spending (fixing what breaks) costs 3–5x more than proactive investment (building what scales)." },
    ],
    lowLabel: "Duct tape and spreadsheets",
    highLabel: "Scalable, integrated stack",
    quickWins: {
      low: [
        { title: "Inventory every tool your team uses - subscriptions, spreadsheets, manual processes", context: "A complete tech audit. You'll find duplicate tools, forgotten subscriptions, and critical processes running on someone's personal spreadsheet." },
        { title: "Identify your #1 most time-consuming manual process and research automation options", context: "Interview your team: 'What task do you waste the most time on?' That's your first automation target. Most can be solved with existing tools." },
        { title: "Migrate your most critical data off local machines onto cloud-based systems", context: "If any business-critical data lives on one person's laptop, you're one hardware failure away from catastrophe." },
      ],
      mid: [
        { title: "Integrate your CRM, project management, and accounting systems", context: "Data should flow between systems automatically. Every manual data transfer is an error opportunity and a time drain." },
        { title: "Implement a simple automation for your most frequent client communication", context: "Onboarding emails, status updates, invoice reminders - automating these frees hours weekly and improves consistency." },
        { title: "Create a 12-month technology roadmap aligned with business goals", context: "Not a wish list. A prioritized plan: Q1 we fix X, Q2 we automate Y, Q3 we integrate Z. Budget it, calendar it, execute it." },
      ],
      high: [
        { title: "Conduct a scalability stress test: model what breaks at 2x revenue", context: "Walk through every system and process assuming double the volume. Where do bottlenecks appear? Fix them before they become crises." },
        { title: "Evaluate AI and machine learning opportunities in your core workflows", context: "From automated data entry to predictive analytics - AI tools are becoming accessible to $1M–$10M businesses. Early adopters gain significant competitive advantage." },
      ],
    },
  },
  {
    key: "d4", num: 4, of: 10,
    title: "Data Ownership & Accessibility",
    subtitle: "Do you own your data? Can your team access and use it to make decisions?",
    description: "A $3M e-commerce brand discovered during due diligence that they didn't actually own their customer data. It was locked inside a third-party platform with export restrictions in the Terms of Service. Their entire customer list - email addresses, purchase history, lifetime value data - was technically the platform's property. The deal didn't fall through, but the valuation discount was painful. Data ownership is Structural Capital you can't see until it matters. The questions are simple: do you own it, can you access it, is it clean, and does your team actually use it to make decisions? If the answer to any of those is 'no,' your data is a liability, not an asset.",
    checks: [
      { text: "We own all our customer, financial, and operational data outright - no third-party restrictions.", sub: "Check your vendor agreements. If you can't export your own data without restrictions, you don't really own it." },
      { text: "Key business data is accessible to authorized team members in real-time.", sub: "If getting a report requires asking IT or waiting for month-end, your data isn't accessible - it's archived." },
      { text: "We have a single source of truth for core metrics - no conflicting spreadsheets.", sub: "When different people cite different numbers for the same metric, you have a data integrity problem that erodes trust and decision quality." },
      { text: "Business decisions are regularly informed by data analysis, not just intuition.", sub: "Data-driven doesn't mean data-obsessed. It means the numbers are part of every significant decision, not an afterthought." },
    ],
    lowLabel: "Data trapped or unowned",
    highLabel: "Clean, owned, decision-ready",
    quickWins: {
      low: [
        { title: "Audit your vendor agreements for data ownership and export clauses this week", context: "Read the fine print on your top 5 platforms. Can you export your data? In what format? Any restrictions? Know before it matters." },
        { title: "Identify your top 5 business decisions and ask: what data informed each one?", context: "If the answer is 'gut feel' more than 'data,' your team isn't using data to drive decisions - even if you have it." },
        { title: "Export a full backup of your customer and financial data this week", context: "Prove you can do it. If it takes more than an hour or the data comes out messy, you have an accessibility and quality problem." },
      ],
      mid: [
        { title: "Build a simple executive dashboard with your 5 most important KPIs", context: "Revenue, pipeline, cash flow, retention, utilization - whatever matters most. One page, updated weekly, accessible to leadership." },
        { title: "Eliminate competing data sources - establish one system of record per metric", context: "When the CRM says revenue is X and the spreadsheet says Y, nobody trusts either. Pick one source of truth and retire the rest." },
        { title: "Implement a monthly data quality review: check for gaps, duplicates, and errors", context: "Clean data is an ongoing discipline, not a one-time project. A monthly hygiene review prevents small issues from becoming big problems." },
      ],
      high: [
        { title: "Create a data governance policy: who can access what, how it's maintained, and who's accountable", context: "As you scale, data governance becomes critical. Define access levels, update responsibilities, and retention policies now." },
        { title: "Evaluate predictive analytics opportunities using your existing data", context: "You're sitting on patterns that could predict churn, forecast demand, and optimize pricing. Even simple analysis of historical data reveals high-value insights." },
      ],
    },
  },
  {
    key: "d5", num: 5, of: 10,
    title: "Scalability Architecture",
    subtitle: "Can you 2x revenue without 2x-ing headcount or costs?",
    description: "A $4M IT managed services firm grew from $2M to $4M in three years. The problem: headcount grew from 15 to 34, and margins shrank from 28% to 19%. They added revenue but didn't scale - they just got bigger. A competing firm at the same revenue had 22 people and 31% margins because they'd invested in automation, self-service portals, and tiered service delivery. Scalability isn't about growing revenue. It's about growing revenue faster than costs. The architecture of your business - your delivery model, your pricing structure, your operational leverage - determines whether adding $1M in revenue makes you stronger or just busier.",
    checks: [
      { text: "We can describe exactly how we'd handle 2x volume with less than 2x resources.", sub: "If the answer is 'hire more people,' you don't have a scale architecture - you have a linear cost model." },
      { text: "Our gross margins have stayed flat or improved as revenue has grown.", sub: "Declining margins with growing revenue is the classic sign of a business that scales linearly, not leveraged." },
      { text: "We have at least one revenue stream that doesn't require proportional labor input.", sub: "Productized services, subscription models, licensing - something where revenue can grow without equivalent effort." },
      { text: "We've identified and eliminated at least 2 bottlenecks in the last 12 months.", sub: "Bottlenecks are scale killers. If you don't actively find and remove them, they'll find you when you try to grow." },
    ],
    lowLabel: "Linear cost model",
    highLabel: "Leveraged, scalable architecture",
    quickWins: {
      low: [
        { title: "Map your cost structure: what percentage is fixed vs. variable?", context: "A business with 80% variable costs scales linearly. One with 60% fixed costs has natural operating leverage. Know your ratio and work to shift it." },
        { title: "Identify your biggest bottleneck - the constraint that limits throughput right now", context: "Interview your team: 'What's the one thing that slows us down the most?' That bottleneck is where your scale investment should start." },
        { title: "Calculate your revenue-per-employee and compare it to 2 years ago", context: "If revenue-per-employee is flat or declining, you're adding cost as fast as revenue. This metric tells you whether you're scaling or just growing." },
      ],
      mid: [
        { title: "Design a productized version of your most popular custom service", context: "Take your most-requested custom engagement and package it: fixed scope, fixed price, repeatable delivery. Productized services scale; custom engagements don't." },
        { title: "Implement tiered service delivery - not every client needs the senior team on every task", context: "A junior/mid/senior delivery model lets you serve more clients at higher margins without sacrificing quality on high-value work." },
        { title: "Build a capacity model: how many clients/projects can you handle before you need to hire?", context: "Knowing your capacity ceiling prevents reactive hiring. It also reveals where automation or process improvement extends capacity without headcount." },
      ],
      high: [
        { title: "Model the unit economics of your next $1M in revenue - what does it cost to deliver?", context: "If the marginal cost of the next million is lower than the last, your scale architecture is working. If it's higher, you have a structural problem." },
        { title: "Evaluate platform or technology investments that create non-linear revenue potential", context: "A proprietary tool, a self-service portal, a training platform - assets that serve clients with minimal marginal cost create genuine scalability." },
      ],
    },
  },
  {
    key: "d6", num: 6, of: 10,
    title: "Intellectual Property & Proprietary Assets",
    subtitle: "Do you own anything protectable - frameworks, tools, methods, patents?",
    description: "Two consulting firms. Same revenue, same margins, same client quality. One has a proprietary methodology with a trademarked name, a diagnostic tool that generates leads, and a training curriculum licensed to partners. The other delivers excellent work but has no named frameworks, no proprietary tools, and no protectable IP. The first firm could command a 6–8x EBITDA multiple. The second might get 3–4x - because without IP, you're selling labor and relationships, not assets. Intellectual property is Structural Capital that creates competitive moats, enables licensing revenue, and gives your business an identity that exists independent of any individual.",
    checks: [
      { text: "We have at least one proprietary methodology, framework, or process with a distinctive name.", sub: "Named frameworks signal maturity and create differentiation. 'Our 7-Step Growth Accelerator' is an asset. 'How we do things' is not." },
      { text: "Our key IP (trademarks, trade secrets, proprietary tools) is legally protected.", sub: "Unprotected IP is just good ideas. Trademark your frameworks, NDA your trade secrets, and patent what qualifies." },
      { text: "We have proprietary tools, templates, or technology that clients or partners would pay to access.", sub: "Licensable IP creates non-labor revenue streams. Does any of your internal tooling have external value?" },
      { text: "Our IP is documented in a way that makes it transferable and teachable.", sub: "If your methodology lives in the founder's head, it's not IP - it's institutional knowledge. Documentation makes it an asset." },
    ],
    lowLabel: "No protectable IP",
    highLabel: "Proprietary, protected, licensable",
    quickWins: {
      low: [
        { title: "Name your core methodology - give it a distinctive, trademarkable identity this week", context: "Every business has a 'way we do things.' Name it, structure it into steps or phases, and brand it. This alone transforms generic service delivery into proprietary IP." },
        { title: "List everything unique about how you deliver value - then assess what's protectable", context: "Proprietary tools, custom templates, training materials, diagnostic frameworks - you likely have more IP than you realize. It just hasn't been formalized." },
        { title: "Ensure all employees and contractors have signed IP assignment agreements", context: "Without these, work product created by your team may not legally belong to the company. A $500 legal review prevents a catastrophic ownership dispute." },
      ],
      mid: [
        { title: "File a trademark application for your core methodology name", context: "A trademark costs $250–$350 to file and creates permanent brand protection. It also signals professionalism and maturity to clients and partners." },
        { title: "Build a simple internal tool or template that automates part of your proprietary process", context: "A spreadsheet calculator, a diagnostic quiz, an assessment template - turning methodology into tooling creates tangible, transferable IP." },
        { title: "Document your proprietary methodology in a 10-page playbook that a new hire could study", context: "The playbook becomes a training asset, a sales tool, and a transferable IP document. It also forces you to formalize what you do and why." },
      ],
      high: [
        { title: "Explore licensing your methodology or tools to non-competing firms", context: "If your framework works in your market, it likely works in adjacent ones. Licensing creates recurring revenue from IP you've already built." },
        { title: "Conduct a formal IP audit with an attorney - identify, categorize, and value all proprietary assets", context: "An IP audit creates a defensible inventory of your intangible assets. It's essential for growth planning and invaluable in due diligence." },
      ],
    },
  },
  {
    key: "d7", num: 7, of: 10,
    title: "Financial Systems & Reporting",
    subtitle: "Can you produce accurate, timely financials that a lender or buyer would trust?",
    description: "A $7M manufacturing firm wanted to secure a growth line of credit. The bank asked for monthly financials for the last 24 months, a 13-week cash flow forecast, and departmental P&Ls. The owner had none of it - their bookkeeper ran QuickBooks, produced quarterly reports with a 6-week lag, and had never created a forecast. The loan was delayed 4 months while they rebuilt their financial reporting infrastructure. Accurate, timely financial systems aren't a nice-to-have. They're how you make decisions, secure capital, attract partners, and prove to anyone evaluating your business that the numbers are real. If your financials take more than 5 business days to close each month, your financial systems need work.",
    checks: [
      { text: "Monthly financials are closed and reviewed within 10 business days of month-end.", sub: "30-day financial lag means you're making decisions with 60-day-old data. Speed in financial close is a proxy for operational maturity." },
      { text: "We maintain a rolling 13-week cash flow forecast updated weekly.", sub: "Cash flow forecasting is the #1 financial discipline that separates growing businesses from struggling ones." },
      { text: "Our financial statements would pass scrutiny from a bank, investor, or buyer without material adjustments.", sub: "If your financials need 'normalizing' to tell the real story, they're not investor-ready. Clean financials are a competitive advantage." },
      { text: "We have departmental or service-line P&Ls that show profitability at the unit level.", sub: "Company-level P&Ls hide unprofitable segments. Unit-level visibility reveals where you're making money and where you're subsidizing losses." },
    ],
    lowLabel: "Delayed, unreliable financials",
    highLabel: "Timely, audit-ready reporting",
    quickWins: {
      low: [
        { title: "Close last month's books this week and set a recurring 10-day close deadline", context: "If your books aren't closed for last month, close them now. Then commit to the discipline: financials ready by the 10th of every month, no exceptions." },
        { title: "Create a simple 13-week cash flow forecast - even a spreadsheet works", context: "List known inflows and outflows for the next 13 weeks. Update it every Monday. This one practice prevents more cash crises than any other." },
        { title: "Ask your accountant: 'Would our financials survive due diligence scrutiny?'", context: "An honest answer from a qualified accountant reveals whether your numbers tell the real story - or need significant cleanup." },
      ],
      mid: [
        { title: "Implement departmental or service-line P&Ls", context: "Break your P&L into business units: by service, by client type, by team. Unit-level profitability reveals which parts of your business actually make money." },
        { title: "Build a monthly financial review meeting into your leadership rhythm", context: "30 minutes, same time each month: review financials, compare to budget, identify variances, decide actions. Financial literacy across leadership compounds." },
        { title: "Create a financial dashboard with 5 KPIs visible to leadership in real-time", context: "Revenue, gross margin, cash balance, AR aging, pipeline - whatever matters most. When leaders see the numbers daily, decisions improve dramatically." },
      ],
      high: [
        { title: "Engage a fractional CFO or financial advisor to stress-test your reporting", context: "A CFO-level review identifies gaps between your current reporting and what sophisticated stakeholders expect. Fix the gaps before they're exposed." },
        { title: "Build a 3-year financial model with scenario planning (base, upside, downside)", context: "A credible financial model demonstrates strategic thinking and planning discipline. It's expected in any capital raise or exit conversation." },
      ],
    },
  },
  {
    key: "d8", num: 8, of: 10,
    title: "Vendor & Supply Chain Management",
    subtitle: "Are your key vendor relationships documented, diversified, and transferable?",
    description: "A $4M specialty food distributor had built their business around an exclusive relationship with a single overseas supplier. When that supplier was acquired by a competitor, the distributor lost access to 60% of their product line overnight. They had no backup supplier, no written agreement protecting their supply terms, and no transition plan. It took 18 months and a 35% revenue decline to rebuild. Vendor and supply chain management is Structural Capital that most owners ignore until a crisis forces their hand. Documented agreements, diversified suppliers, and transferable relationships protect your business from disruption - and signal operational maturity to anyone evaluating your resilience.",
    checks: [
      { text: "All key vendor relationships are covered by written agreements with defined terms.", sub: "Handshake deals with vendors create the same risk as handshake deals with clients. Written terms protect both parties." },
      { text: "No single vendor accounts for more than 30% of our cost of goods or critical inputs.", sub: "Vendor concentration creates the same existential risk as customer concentration. Diversify your supply base." },
      { text: "We have identified backup suppliers for our top 5 most critical inputs.", sub: "If your #1 supplier disappeared tomorrow, how long until you're operational again? The answer should be 'days,' not 'months.'" },
      { text: "Vendor relationships are with the company, not with specific individuals.", sub: "If one person leaving means losing vendor access or favorable terms, the relationship isn't institutional - it's personal." },
    ],
    lowLabel: "Concentrated, undocumented vendors",
    highLabel: "Diversified, transferable supply chain",
    quickWins: {
      low: [
        { title: "List your top 10 vendors by annual spend and check: written agreement yes/no?", context: "Every vendor without a written agreement is a risk. Prioritize formalizing agreements with your largest and most critical suppliers." },
        { title: "Calculate your vendor concentration - what percentage of costs goes to your top 3 suppliers?", context: "Above 50% in your top 3 is concentrated. Above 70% is dangerous. Know the number and start diversifying." },
        { title: "Identify one backup supplier for your #1 most critical vendor this week", context: "Don't wait for a crisis. Research, contact, and qualify at least one alternative. Even an untested backup is better than no backup." },
      ],
      mid: [
        { title: "Negotiate written agreements with your top 5 vendors that include termination notice periods", context: "A 90-day notice requirement gives you time to find alternatives. Without it, vendors can change terms or walk with no warning." },
        { title: "Introduce multiple team members to key vendor contacts", context: "Multi-threading vendor relationships - like client relationships - makes them institutional rather than personal." },
        { title: "Create a vendor risk matrix: concentration, contract status, backup availability, relationship health", context: "A quarterly vendor review using this matrix turns reactive supply chain management into proactive risk mitigation." },
      ],
      high: [
        { title: "Develop strategic partnerships with 2–3 vendors that include volume commitments and preferred pricing", context: "Strategic vendor partnerships create mutual dependency and loyalty. You get better terms; they get predictable volume." },
        { title: "Stress-test your supply chain: what happens if your #1 and #2 vendors are both unavailable simultaneously?", context: "Extreme scenario planning reveals hidden fragilities. The businesses that survive disruptions are the ones that planned for them." },
      ],
    },
  },
  {
    key: "d9", num: 9, of: 10,
    title: "Compliance, Legal & Risk Systems",
    subtitle: "Are contracts, insurance, licenses, and regulatory requirements current and organized?",
    description: "A $5M healthcare staffing agency was weeks from closing an acquisition when the buyer's attorneys discovered three issues: an expired state license in a key market, an insurance policy with a gap in professional liability coverage, and two contractor agreements that lacked non-compete clauses. None of these were catastrophic on their own. But together, they signaled operational sloppiness and created legal exposure that the buyer used to negotiate a 15% valuation reduction. Compliance and legal systems aren't exciting. They're the foundation that everything else rests on. When they're solid, nobody notices. When they're not, everyone does - and it costs real money.",
    checks: [
      { text: "All business licenses, permits, and certifications are current and tracked in a central system.", sub: "One expired license can halt operations, void insurance, or kill a deal. Do you have a renewal calendar?" },
      { text: "Our insurance coverage (GL, E&O, cyber, D&O, key person) is reviewed annually with a broker.", sub: "Insurance gaps are invisible until you need coverage. An annual review with a qualified broker is cheap protection against catastrophic exposure." },
      { text: "All client and vendor contracts are stored centrally with expiration tracking.", sub: "If contracts live in email inboxes and desk drawers, you can't manage what you can't find. Central storage with alerts is non-negotiable." },
      { text: "We have an employee handbook, contractor agreements, and NDAs in place and current.", sub: "Employment documentation protects the business from disputes and establishes expectations. 'We'll get to it' is how lawsuits happen." },
    ],
    lowLabel: "Scattered, expired, exposed",
    highLabel: "Organized, current, protected",
    quickWins: {
      low: [
        { title: "Pull every license, permit, and certification - check expiration dates today", context: "A 30-minute audit that could prevent a six-figure problem. Any expired? Renew immediately. Any expiring in 90 days? Calendar the renewal." },
        { title: "Schedule an annual insurance review with your broker this month", context: "Ask specifically about professional liability, cyber liability, and key person coverage. These are the gaps that cause real damage." },
        { title: "Consolidate all contracts into a single digital repository this week", context: "Create a folder structure: clients, vendors, employees, leases. If you can't find a contract in 60 seconds, your system is broken." },
      ],
      mid: [
        { title: "Create a compliance calendar: every renewal, filing, and regulatory deadline on one calendar", context: "A compliance calendar with 90-day advance alerts turns panic-driven renewals into routine administrative tasks." },
        { title: "Have an employment attorney review your employee handbook and contractor agreements", context: "A $2,000–$5,000 legal review protects you from misclassification claims, wrongful termination suits, and IP disputes." },
        { title: "Implement a quarterly legal and compliance review meeting", context: "15 minutes per quarter: any contracts expiring? Insurance current? Regulatory changes in our industry? Pending disputes? Small investment, large protection." },
      ],
      high: [
        { title: "Conduct a comprehensive legal risk assessment with outside counsel", context: "Identify every legal exposure: employment, IP, regulatory, contractual, environmental. Prioritize remediation by impact and likelihood." },
        { title: "Build a due diligence readiness file: all legal, compliance, and corporate documents organized and current", context: "Whether you're raising capital or planning an exit, having a clean due diligence file saves months and preserves valuation." },
      ],
    },
  },
  {
    key: "d10", num: 10, of: 10,
    title: "Continuous Improvement & Innovation",
    subtitle: "Is there a system for getting better, or does improvement only happen when something breaks?",
    description: "A $3M accounting firm had a saying: 'If it ain't broke, don't fix it.' They didn't invest in process improvement until clients complained. They didn't adopt new technology until competitors forced them. They didn't update their service offerings until revenue declined. By the time they reacted, they were always 18 months behind. Compare that to a $3M firm that holds monthly improvement meetings, allocates 5% of revenue to innovation, and asks every team member quarterly: 'What one thing should we change?' The second firm doesn't just survive change - they drive it. Continuous improvement isn't about perfection. It's about building the organizational habit of getting better on purpose, instead of waiting for problems to force change.",
    checks: [
      { text: "We have a formal process for capturing improvement ideas from the team.", sub: "A suggestion box, a monthly meeting, a digital channel - something that makes it easy for anyone to flag 'this could be better.'" },
      { text: "We allocate time or budget specifically for process improvement or innovation.", sub: "If improvement competes with billable work for resources, billable work always wins. Dedicated time/budget makes improvement real." },
      { text: "At least 3 meaningful process improvements have been implemented in the last 12 months.", sub: "Not 'we talked about improvements.' Actually implemented, measured, and sustained. What's your track record?" },
      { text: "We regularly benchmark our operations against industry best practices or competitors.", sub: "Without external benchmarks, 'good enough' becomes the standard. Benchmarking reveals gaps you can't see from inside." },
    ],
    lowLabel: "Reactive, only when forced",
    highLabel: "Systematic, continuous innovation",
    quickWins: {
      low: [
        { title: "Ask every team member this week: 'What one process should we improve first?'", context: "Your team knows where the friction lives. A simple survey or team meeting surfaces the 3–5 improvements that would have the biggest impact." },
        { title: "Schedule a monthly 30-minute 'improvement meeting' on the calendar - starting next week", context: "One agenda item: what can we do better? Document the ideas, pick one to implement, assign it an owner. Repeat monthly." },
        { title: "Implement one process improvement this week - even a small one", context: "The goal isn't perfection. It's momentum. Fix something small, celebrate it, and build the habit of intentional improvement." },
      ],
      mid: [
        { title: "Allocate 5% of team time (2 hours/week) to process improvement projects", context: "Protected time for improvement means it actually happens. Without it, urgent always crowds out important." },
        { title: "Create an improvement backlog: a prioritized list of process changes ranked by impact and effort", context: "A backlog turns scattered ideas into a managed pipeline. High-impact, low-effort items get done first." },
        { title: "Benchmark 3 key metrics against industry peers or published standards", context: "Revenue per employee, gross margin, client retention - compare yourself to the market. The gaps reveal where you're underperforming relative to what's possible." },
      ],
      high: [
        { title: "Build a formal innovation pipeline: idea → evaluation → pilot → implement → measure", context: "A structured pipeline ensures that good ideas don't die in meetings. It also prevents premature scaling of unvalidated changes." },
        { title: "Establish an annual 'State of Operations' review that benchmarks all systems against best-in-class", context: "A comprehensive annual review creates accountability for improvement and documentation of progress. It's also a powerful asset in any strategic conversation." },
      ],
    },
  },
];

/* ── BANDING ── */
const BANDS = [
  { label: "Systems Crisis", min: 10, max: 20, range: "10–20", color: C.red,
    desc: "Your Structural Capital is critically weak. Core processes live in people's heads, technology is a patchwork, and compliance gaps create legal exposure. Your business depends on individuals rather than systems - which limits growth, creates fragility, and suppresses your enterprise value. Immediate, focused investment in documentation, technology, and process formalization is needed." },
  { label: "Systems Fragile", min: 21, max: 35, range: "21–35", color: C.amber,
    desc: "You have some systems in place, but they're inconsistent, incomplete, or outdated. Key processes may be documented but not maintained. Technology works but doesn't scale. Financial reporting exists but isn't investor-ready. The foundation is there - but the gaps create risk and limit your ability to grow efficiently or transfer the business." },
  { label: "Systems Established", min: 36, max: 48, range: "36–48", color: C.cyan,
    desc: "Your systems are a genuine operational strength. Core processes are documented and maintained, technology enables scale, and financial reporting is reliable. The remaining gaps are specific and addressable - closing them moves you from operationally sound to structurally exceptional. This is where the highest-ROI improvements live." },
  { label: "Systems Powerhouse", min: 49, max: 60, range: "49–60", color: C.green,
    desc: "Your Structural Capital is a competitive weapon. Documented systems, scalable technology, protected IP, and investor-ready financials. Your business can operate independently of any individual and scale without proportional cost increases. Whether you're growing aggressively or positioning for an eventual exit, your systems are one of your most valuable assets." },
];

/* ── This tool's content for the shared report frame ── */
export const STRUCTURAL = {
  tool: "Structural Capital", accent: TONE.blue, dims: DIMS, bands: BANDS,
  toolSlug: "structural-capital", storeSlug: "structural-capital-deep-dive",
  coverSub: "Systems, Processes & Scalability",
  principle: (A) => [
    <>Structural Capital is the "secret sauce" of your business - the systems, processes, technology, and intellectual property that make your company run. It's what converts the knowledge in people's heads into <span style={{ color: A.fill, fontWeight: 600 }}>company property</span> that can be documented, scaled, and transferred. A business with strong Structural Capital can survive the departure of any individual, scale without proportional cost increases, and be handed to a new operator who can run it from day one. Without it, your business is a collection of habits held together by memory.</>,
    <><span style={{ color: A.fill, fontWeight: 700 }}>Structural Capital has two purposes</span> - first, it takes what exists inside your brain and gets it into a transferable form. Second, it connects people and knowledge so it can be shared to enable your business to scale. Making knowledge company property ensures that when talent walks out the door at night, the knowledge doesn't walk out with them.</>,
  ],
  howHead: <>Your systems are your business. <em>Everything else is temporary.</em></>,
  howP1: "This isn't an IT audit. It's a honest assessment of whether your business runs on systems or on people's memories. A $5M services firm with documented processes, scalable technology, and clean financials is in a fundamentally different position than one with the same revenue built on tribal knowledge, spreadsheet workarounds, and a bookkeeper who's always behind. Both might be profitable - but only one has Structural Capital that enables sustainable growth and commands premium value.",
  howP2: "For each dimension, read the description, review the checklist honestly, and score yourself based on where you truly are - not where you plan to be. The gap between your current score and a 5 or 6 is your blueprint for building a business that runs independently, scales efficiently, and holds its value regardless of who's in the building.",
  best5: "Genuine competitive advantage. Your systems outperform your industry peers - you deliver more consistently, scale more efficiently, and operate more independently than competitors at your size. This area is a strategic asset.",
  perfect6: "Nothing meaningful left to improve. Most honest operators rarely give themselves this score. If you do, be certain you'd bet your house on it - because it will be tested, whether by rapid growth, a key departure, or a buyer's due diligence team.",
  summaryHead: <>How strong are the <em>systems</em> that run your business?</>,
  lever: "Every dimension you just scored represents a systems lever - a specific place where improving your Structural Capital can increase both your operational efficiency and your enterprise value. The gaps aren't failures. They're the untapped infrastructure hiding in your business.",
  premium: "The businesses that command premium growth and premium valuations don't just have good people and happy customers - they have systems that make excellence repeatable, scalable, and transferable.",
  qualifier: (A) => <>You can implement these yourself - or our team can see if you qualify for us to help you build systems and processes that turn your business into a <span style={{ color: A.ink, fontWeight: 700 }}>Masterpiece Business</span> that future buyers fight one another to acquire.</>,
  bio: "Most owners build systems reactively - when something breaks, they fix it. The businesses that command premium growth and premium valuations build systems proactively - documenting, automating, and scaling before they need to. That's the gap this assessment reveals. The distance between where you scored and best-in-class isn't a problem - it's a blueprint for building infrastructure that makes your business a Masterpiece. Let's build it together.",
  quote: <>People leave. Markets shift. Technology evolves. But the systems you build today - the documented processes, the scalable architecture, the protected intellectual property - those become the permanent infrastructure of enterprise value. They are what transforms a business from a job that depends on you into an asset that <span style={{ color: TONE.gold.ink, fontWeight: 700, fontStyle: "normal" }}>works for you.</span></>,
};

export default function StructuralCapitalV2({ prefill = null }) {
  return <DeepDiveReport cfg={STRUCTURAL} prefill={prefill} />;
}
