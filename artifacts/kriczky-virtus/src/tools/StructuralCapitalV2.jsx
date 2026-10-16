import { useEffect, useRef, useState } from "react";
import { texBg } from "./reportTexture";

/* ═══════════════════════════════════════════════════════════════
   STRUCTURAL CAPITAL DEEP-DIVE - v2 (house style)     /tools/structural-capital/v2
   The diagnostic-tools v2 sample: the same content, scoring, gate and CTA as
   StructuralCapital.jsx, in the Kriczky Virtus house style - cream letter
   pages scaled to fit, engraved texture and shield, porcelain tiles, a dark
   cover, no em dashes, and a real PDF download once the results unlock.
   Content is copied verbatim from v1 (em dashes swapped for " - ").
   ═══════════════════════════════════════════════════════════════ */

/* Dark-theme fills, kept so the content blocks below read exactly as in v1. */
const C = {
  gold: "#C8A24E", green: "#34D399", red: "#F87171", amber: "#FBBF24", amberDark: "#D4A017",
  blue: "#60A5FA", cyan: "#22D3EE", purple: "#A78BFA",
};

/* ── DIMENSIONS (10) ── */
const DIMS = [
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


/* ═══════════════════════════════════════════════════════════════
   THE DIAGNOSTIC FRAME (v2): fixed US Letter pages, scaled to fit
   ═══════════════════════════════════════════════════════════════
   Laid out once at 816 × 1056 px (8.5 × 11 in at 96 dpi) and scaled to the
   screen, like the Reinvest or Harvest and Value Drivers reports: the same
   layout on every device, and a real PDF download. No viewport-meta hack.
   Cream pages, engraved texture, porcelain tiles, a dark cover. */

const PAGE_W = 816, PAGE_H = 1056;
const L = {
  page: "#F2EEE6", desk: "#DDD6C8", card: "#FFFFFF",
  ink: "#0A0E14", ink2: "#3E4652", ink3: "#6B6459", ink4: "#8C8476", rule: "#C9C2B4", ruleLight: "#E2DBCD",
};
/* Every colour as ink (text on cream), fill (bars, glows) and tint (washes). */
const TONE = {
  red:   { ink: "#B4403F", fill: "#F87171", tint: "#F6E3DF" },
  amber: { ink: "#9A6A00", fill: "#FBBF24", tint: "#F5EAD0" },
  gold:  { ink: "#7A5C1E", fill: "#C8A24E", tint: "#F1E7D0" },
  green: { ink: "#1B7A57", fill: "#34D399", tint: "#E3EEE6" },
  cyan:  { ink: "#0E7490", fill: "#22D3EE", tint: "#E1ECEE" },
  blue:  { ink: "#1F5F99", fill: "#60A5FA", tint: "#E2E9F2" },
};
/* This tool's accent. Structural Capital has always been blue. */
const A = TONE.blue;
const TOOL = "Structural Capital";
const scoreTone = (n) => (!n ? null : TONE[n <= 2 ? "red" : n === 3 ? "amber" : n === 4 ? "gold" : n === 5 ? "cyan" : "green"]);
/* BANDS carry the dark-theme fill; map it back to a tone. */
const bandTone = (b) => Object.values(TONE).find(t => t.fill === b.color) || A;
const pad2 = (n) => String(n).padStart(2, "0");
const ICONS = "/icons/roadmap-system";
const TOTAL_PAGES_BASE = 14;
const TOTAL_PAGES_WITH_MOVES = 15;

const CSS = `
  .kvd *{box-sizing:border-box}
  .kvd{background:${L.desk};color:${L.ink};font-family:'DM Sans',sans-serif;-webkit-font-smoothing:antialiased;min-height:100vh;
    -webkit-text-size-adjust:100%;text-size-adjust:100%;padding-bottom:24px}
  .kvd .pw{margin:0 auto;position:relative}
  .kvd .page{position:absolute;top:0;left:0;width:${PAGE_W}px;height:${PAGE_H}px;transform-origin:top left;overflow:hidden;
    background:${L.page};box-shadow:0 1px 3px rgba(10,14,20,.10),0 14px 40px rgba(10,14,20,.16);padding:58px 64px 0}
  .kvd .runhead{display:flex;justify-content:space-between;align-items:baseline;font-size:11px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:${L.ink3};margin-bottom:34px}
  .kvd .runhead b{font-family:'Cormorant Garamond',serif;font-size:15px;letter-spacing:.14em;color:${L.ink2};font-weight:600}
  .kvd .folio{position:absolute;left:64px;right:64px;bottom:34px;display:flex;justify-content:space-between;align-items:baseline;
    border-top:1px solid ${L.ruleLight};padding-top:12px;font-size:12px;color:${L.ink3}}
  .kvd .folio b{font-family:'Cormorant Garamond',serif;font-size:14px;letter-spacing:.12em;text-transform:uppercase;font-weight:600}
  .kvd .kicker{font-size:12px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;margin-bottom:10px}
  .kvd h2{font-family:'Cormorant Garamond',serif;font-weight:600;font-size:46px;line-height:1.06;margin:0 0 16px;letter-spacing:-.005em}
  .kvd h2 em{font-weight:500;color:${TONE.gold.ink}}
  .kvd p{margin:0}
  .kvd .body{font-size:16px;line-height:1.6;color:${L.ink2}}
  .kvd .card{background:${L.card};border-radius:14px;border:1px solid ${L.ruleLight};
    box-shadow:0 1px 2px rgba(10,14,20,.06),0 10px 26px rgba(10,14,20,.08)}
  .kvd .tile{display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;
    background:linear-gradient(180deg,#FFFEFB 0%,#F7F2E8 100%);border:1px solid #E6DFD1;
    box-shadow:inset 0 1px 0 rgba(255,255,255,.9),0 1px 2px rgba(10,14,20,.06),0 10px 22px rgba(10,14,20,.13)}
  .kvd .tile img{display:block}
  .kvd .num{font-family:'Playfair Display',serif;font-weight:700;line-height:1}
  .kvd .tap{cursor:pointer;user-select:none;-webkit-tap-highlight-color:transparent}
  .kvd .sbtn{transition:box-shadow .2s ease,transform .2s ease,border-color .2s ease,background .2s ease}
  .kvd .cta{transition:box-shadow .3s ease,transform .3s ease}
  @media (hover:hover) and (pointer:fine){
    .kvd .sbtn:hover{transform:translateY(-1px);box-shadow:0 0 0 1px var(--edge),0 0 22px var(--glow),0 8px 18px rgba(10,14,20,.08)!important}
    .kvd .chk:hover{background:#FBF8F2}
    .kvd .cta:hover{box-shadow:0 0 44px rgba(200,162,78,.55),0 10px 26px rgba(10,14,20,.25)!important;transform:translateY(-1px)}
  }
  .kvd .bar{position:sticky;top:0;z-index:5;display:flex;justify-content:center;gap:10px;padding:10px 12px;background:rgba(221,214,200,.92);backdrop-filter:blur(6px)}
  .kvd .bar button{font-family:'DM Sans',sans-serif;font-size:14px;font-weight:700;letter-spacing:.04em;padding:9px 18px;border-radius:9px;cursor:pointer;
    color:#F2EEE6;background:#0A0E14;border:1px solid #0A0E14}
  .kvd .bar button:disabled{opacity:.7;cursor:progress}
  .kvd .bar button.ghost{color:${L.ink};background:transparent;border-color:${L.rule}}
  .kvd .gate input{width:100%;padding:14px 16px;border-radius:10px;background:#fff;border:1px solid ${L.rule};color:${L.ink};
    font:16px 'DM Sans',sans-serif;outline:none;margin-bottom:10px}
  .kvd .gate input:focus{border-color:${TONE.gold.fill};box-shadow:0 0 0 3px ${TONE.gold.fill}33}
  @page{size:letter;margin:0}
  @media print{
    html,body{background:#fff!important}
    .kvd{background:#fff;min-height:0;padding:0}
    .kvd .bar,.kvd .glow,.kvd .gate{display:none!important}
    .kvd .pw{width:8.5in!important;height:11in!important;margin:0!important;page-break-after:always;break-after:page}
    .kvd .page{transform:none!important;box-shadow:none;-webkit-print-color-adjust:exact;print-color-adjust:exact}
  }
`;

/* Fit pages to the width available - the same layout on every screen. */
function usePageScale() {
  const ref = useRef(null);
  const [s, setS] = useState(1);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const fit = () => {
      const w = el.clientWidth;
      const gutter = w < 600 ? 10 : 32;
      setS(Math.min(1, (w - gutter * 2) / PAGE_W));
    };
    fit();
    if (typeof ResizeObserver === "undefined") { window.addEventListener("resize", fit); return () => window.removeEventListener("resize", fit); }
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, s];
}

/* ── shared pieces (module scope, so nothing remounts on render) ── */

const Page = ({ s, n, total, right, dark, tex = "mark", children }) => (
  <div className="pw" style={{ width: PAGE_W * s, height: PAGE_H * s, marginBottom: 18 * s + 6 }}>
    <div className="page" style={{ transform: `scale(${s})`, ...(dark ? { ...texBg("cover", "linear-gradient(160deg,#141B26 0%,#0A0E14 72%)"), color: "#E8ECF1" } : texBg(tex, L.page)) }}>
      {!dark && <div className="runhead"><b>Kriczky Virtus</b><span>{right}</span></div>}
      {children}
      {!dark && <div className="folio"><b>{TOOL} Deep-Dive</b><span>{n} / {total}</span></div>}
    </div>
  </div>
);

const Tile = ({ size = 64, children }) => (
  <span className="tile" style={{ width: size, height: size, borderRadius: Math.round(size * 0.27) }}>{children}</span>
);
const IconTile = ({ src, size = 56 }) => (
  <Tile size={size}><img src={src} alt="" width={Math.round(size * 0.66)} height={Math.round(size * 0.66)} /></Tile>
);

const CheckItem = ({ text, sub, checked, onToggle }) => (
  <div className="tap chk" role="checkbox" aria-checked={checked} tabIndex={0} onClick={onToggle}
    onKeyDown={e => (e.key === " " || e.key === "Enter") && (e.preventDefault(), onToggle())}
    style={{ display: "flex", gap: 14, padding: "9px 18px", alignItems: "flex-start", borderTop: `1px solid ${L.ruleLight}` }}>
    <svg width="20" height="20" viewBox="0 0 20 20" style={{ flexShrink: 0, marginTop: 1 }} aria-hidden="true">
      <rect x="1" y="1" width="18" height="18" rx="5" fill={checked ? A.tint : "#fff"} stroke={checked ? A.fill : L.rule} strokeWidth="1.5" />
      {checked && <path d="M5.5 10.2L8.6 13.2L14.6 6.9" stroke={A.ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />}
    </svg>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.38, color: L.ink }}>{text}</div>
      {sub && <div style={{ fontSize: 12.5, lineHeight: 1.4, color: L.ink3, marginTop: 2 }}>{sub}</div>}
    </div>
  </div>
);

const ScoreSelector = ({ value, onChange, lowLabel, highLabel }) => {
  const t = scoreTone(value);
  return (
    <div className="card" style={{ padding: "14px 20px 12px", marginTop: 12, ...(t ? { borderColor: `${t.fill}88`, boxShadow: `0 0 26px ${t.fill}30, 0 10px 26px rgba(10,14,20,.08)` } : {}) }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
        <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase", color: t ? t.ink : TONE.gold.ink }}>Rate yourself</span>
        <span className="num" style={{ fontSize: 26, color: t ? t.ink : L.ink4 }}>{value || "-"}<span style={{ fontSize: 15, color: L.ink3 }}>/6</span></span>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 9 }}>
        {[1, 2, 3, 4, 5, 6].map(n => {
          const c = scoreTone(n); const sel = value === n;
          return (
            <div key={n} className="tap sbtn" role="radio" aria-checked={sel} tabIndex={0} aria-label={`Score ${n}`}
              onClick={() => onChange(n)} onKeyDown={e => (e.key === " " || e.key === "Enter") && (e.preventDefault(), onChange(n))}
              style={{ flex: 1, height: 46, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", "--edge": `${c.fill}aa`, "--glow": `${c.fill}55`,
                background: sel ? `linear-gradient(135deg, #FFFFFF 30%, ${c.tint})` : "#FFFFFF",
                border: `1.5px solid ${sel ? c.fill : L.ruleLight}`,
                boxShadow: sel ? `0 0 20px ${c.fill}55, 0 4px 10px rgba(10,14,20,.06)` : "0 1px 2px rgba(10,14,20,.05)" }}>
              <span className="num" style={{ fontSize: 21, color: sel ? c.ink : `${c.ink}99` }}>{n}</span>
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: L.ink3 }}>
        <span>{lowLabel}</span><span>{highLabel}</span>
      </div>
    </div>
  );
};

/* The black button with gold text and glow - the house primary CTA. */
const CtaBtn = ({ href, children }) => (
  <a className="cta" href={href} target="_blank" rel="noopener noreferrer"
    style={{ display: "inline-block", padding: "16px 34px", borderRadius: 12, textDecoration: "none", fontSize: 15, fontWeight: 700, letterSpacing: ".06em",
      color: "#C8A24E", background: "linear-gradient(160deg,#141B26 0%,#0A0E14 72%)", border: "1px solid #2A2213",
      boxShadow: "0 0 30px rgba(200,162,78,.35), 0 8px 20px rgba(10,14,20,.22)" }}>{children}</a>
);

/* The page is a picture in the PDF: render each one with html2canvas and lay a
   real link over every <a>, so the CTA still works in the file. */
async function buildPdf(root, filename) {
  if (document.fonts && document.fonts.ready) await document.fonts.ready;
  const [h2c, jspdf] = await Promise.all([import("html2canvas"), import("jspdf")]);
  const html2canvas = h2c.default || h2c;
  const JsPDF = jspdf.jsPDF || jspdf.default;
  const pages = Array.from(root.querySelectorAll(".page"));
  const pdf = new JsPDF({ unit: "pt", format: "letter", compress: true });
  for (let i = 0; i < pages.length; i++) {
    const canvas = await html2canvas(pages[i], {
      scale: 2, useCORS: true, logging: false, backgroundColor: "#ffffff",
      width: PAGE_W, height: PAGE_H, windowWidth: PAGE_W + 200,
      onclone: (doc, el) => {
        el.style.transform = "none"; el.style.boxShadow = "none";
        el.querySelectorAll(".glow").forEach(g => { g.style.display = "none"; });
        const win = doc.defaultView;
        el.querySelectorAll("*").forEach(n => {
          const bs = win.getComputedStyle(n).boxShadow;
          if (!bs || bs.indexOf("inset") < 0) return;
          const outer = bs.split(/,(?![^(]*\))/).filter(x => x.indexOf("inset") < 0).join(",");
          n.style.boxShadow = outer || "none";
        });
      },
    });
    if (i) pdf.addPage("letter", "portrait");
    pdf.addImage(canvas.toDataURL("image/jpeg", 0.85), "JPEG", 0, 0, 612, 792, undefined, "FAST");
    canvas.width = 0; canvas.height = 0;
    const box = pages[i].getBoundingClientRect();
    const k = 612 / box.width;
    pages[i].querySelectorAll("a[href]").forEach(a => {
      const r = a.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const url = new URL(a.getAttribute("href"), window.location.origin).href;
      pdf.link((r.left - box.left) * k, (r.top - box.top) * k, r.width * k, r.height * k, { url });
    });
  }
  pdf.save(filename);
}

/* =================== EMAIL GATE =================== */
/* Sits between the pages, outside the scaled frame, so the form is full size
   on a phone (16px inputs: iOS doesn't zoom). Same payload as v1. */
const EmailGate = ({ toolName, toolSlug, storeSlug, scores, summary, onUnlock, onStored }) => {
  const [gName, setGName] = useState("");
  const [gEmail, setGEmail] = useState("");
  const [gError, setGError] = useState("");
  const [utm, setUtm] = useState({ s: null, c: null });
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    setUtm({ s: p.get("utm_source"), c: p.get("utm_campaign") });
  }, []);
  const submit = () => {
    if (!gName.trim()) { setGError("Please enter your name so we can personalize your results."); return; }
    if (!gEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(gEmail)) { setGError("Please enter a valid email address."); return; }
    setGError("");
    const name = gName.trim(), email = gEmail.trim();
    const payload = { name, email, tool: toolSlug, toolName, scores, summary, timestamp: new Date().toISOString(), utmSource: utm.s || null, utmCampaign: utm.c || null };
    fetch("/api/lead-capture", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      .catch(err => console.error("[Lead] Fetch failed:", err));
    onUnlock(name);
    /* The saved copy's link (the one in the email) is what Share hands out. */
    const stored = new Promise(resolve => setTimeout(async () => {
      try {
        const res = await fetch("/api/store-results", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, tool: storeSlug, html: document.documentElement.outerHTML }) });
        if (!res.ok) { console.error("[Tool] Failed to store results:", res.status); resolve(null); return; }
        const j = await res.json().catch(() => ({}));
        resolve(j.url || null);
      } catch (err) { console.error("[Tool] Store results failed:", err); resolve(null); }
    }, 2000));
    if (onStored) onStored(stored);
  };
  const g = TONE.gold;
  return (
    <div className="gate" style={{ maxWidth: 520, margin: "10px auto 34px", padding: "0 16px" }}>
      <div className="card" style={{ ...texBg("light", "#FFFFFF"), padding: "34px 28px 26px", textAlign: "center", borderColor: `${g.fill}66`, boxShadow: `0 0 34px ${g.fill}30, 0 14px 34px rgba(10,14,20,.12)` }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}><IconTile src={`${ICONS}/shield.png`} size={60} /></div>
        <h2 style={{ fontSize: 36, margin: "0 0 10px" }}>Your answers are <em>locked in.</em></h2>
        <p className="body" style={{ fontSize: 15.5, marginBottom: 20 }}>Enter your name and email to see your personalized results, scores, and recommended next steps.</p>
        <input type="text" placeholder="Full name" autoComplete="name" value={gName} onChange={e => { setGName(e.target.value); setGError(""); }} />
        <input type="email" placeholder="Email address" autoComplete="email" value={gEmail} onChange={e => { setGEmail(e.target.value); setGError(""); }} onKeyDown={e => e.key === "Enter" && submit()} />
        {gError && <p style={{ fontSize: 13, color: TONE.red.ink, margin: "0 0 10px", textAlign: "left" }}>{gError}</p>}
        <button className="cta" onClick={submit} style={{ width: "100%", padding: "15px 20px", borderRadius: 12, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 700, letterSpacing: ".04em",
          color: "#C8A24E", background: "linear-gradient(160deg,#141B26 0%,#0A0E14 72%)", border: "1px solid #2A2213", boxShadow: "0 0 30px rgba(200,162,78,.35), 0 8px 20px rgba(10,14,20,.22)" }}>
          See My Personalized Results
        </button>
        <p style={{ fontSize: 12, color: L.ink3, marginTop: 12 }}>Your data stays with you. We will send you a copy of your results.</p>
        <div style={{ textAlign: "left", marginTop: 20, paddingTop: 16, borderTop: `1px solid ${L.ruleLight}` }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase", color: g.ink, marginBottom: 10 }}>What you will get</div>
          {["Your personalized scores across every dimension", "Specific areas where your business is strongest and weakest", "Prioritized recommendations to improve your score", "A clear picture of where you stand vs. best-in-class peers"].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 7 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }} aria-hidden="true"><polyline points="4 12 10 18 20 6" stroke={g.ink} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <span style={{ fontSize: 14, color: L.ink2 }}>{item}</span>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 10.5, color: L.ink4, lineHeight: 1.5, marginTop: 12, textAlign: "left" }}>
          By providing your information you consent to Kriczky Virtus, LLC contacting you by phone, text, or email using automated telephone dialing systems and AI to the information provided, even if the phone number is present on a state or national Do Not Call List. We do not sell your personal information. By providing this information you agree to our Privacy Policy and Terms of Service.
        </p>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function StructuralCapitalV2() {
  const [scores, setScores] = useState({});
  const [checks, setChecks] = useState({});
  const [gateUnlocked, setGateUnlocked] = useState(false);
  const [who, setWho] = useState("");
  const [busy, setBusy] = useState(false);
  const [shareLabel, setShareLabel] = useState("Share");
  const savedLink = useRef(null);
  const [ref, s] = usePageScale();

  const setScore = (key, val) => setScores(p => ({ ...p, [key]: val }));
  const toggleCheck = (dimKey, idx) => setChecks(p => { const k = `${dimKey}-${idx}`; return { ...p, [k]: !p[k] }; });

  const allScored = DIMS.every(d => scores[d.key]);
  const totalScore = DIMS.reduce((t, d) => t + (scores[d.key] || 0), 0);
  const maxScore = DIMS.length * 6;
  const activeBand = allScored ? BANDS.find(b => totalScore >= b.min && totalScore <= b.max) : null;
  const sorted = [...DIMS].filter(d => scores[d.key]).sort((a, b) => scores[a.key] - scores[b.key]);
  const lowestTwo = sorted.slice(0, 2);
  const lowestThree = sorted.slice(0, 3);
  const unlocked = allScored && gateUnlocked;
  const total = unlocked ? TOTAL_PAGES_WITH_MOVES : TOTAL_PAGES_BASE;
  const scoredCount = DIMS.filter(d => scores[d.key]).length;
  let n = 1;   /* the cover is page 1 and carries no folio */

  const download = async () => {
    setBusy(true);
    try { await buildPdf(ref.current, `Structural-Capital-Deep-Dive${who ? "-" + who.replace(/[^A-Za-z0-9]+/g, "-") : ""}.pdf`); }
    catch (e) { window.print(); }
    finally { setBusy(false); }
  };

  /* Share copies the link to the saved results (the same one emailed); until
     that's ready, it waits for it. Falls back to this page's address. */
  const share = async () => {
    setShareLabel("Preparing link...");
    const url = (savedLink.current && await savedLink.current) || window.location.href;
    try {
      if (navigator.share && window.matchMedia("(pointer: coarse)").matches) {
        await navigator.share({ title: `${TOOL} Deep-Dive`, url });
        setShareLabel("Share");
        return;
      }
      await navigator.clipboard.writeText(url);
    } catch (e) {
      if (e && e.name === "AbortError") { setShareLabel("Share"); return; }
      const ta = document.createElement("textarea");
      ta.value = url; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); } catch (e2) { /* nothing more to try */ }
      ta.remove();
    }
    setShareLabel("Link copied");
    setTimeout(() => setShareLabel("Share"), 1800);
  };

  return (
    <div className="kvd" ref={ref}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600&family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet" />
      <style>{CSS}</style>
      <div className="bar">
        {unlocked
          ? <>
              <button disabled={busy} onClick={download}>{busy ? "Preparing your PDF..." : "Download PDF"}</button>
              <button className="ghost" onClick={share}>{shareLabel}</button>
            </>
          : <span style={{ fontSize: 13, fontWeight: 600, color: L.ink2, padding: "9px 0" }}>{scoredCount} of {DIMS.length} scored</span>}
      </div>
      <div className="pages" style={{ padding: "14px 0 10px" }}>

        {/* ═══ PAGE 1: COVER ═══ */}
        <Page s={s} dark>
          <div className="glow" style={{ position: "absolute", top: "-10%", left: "8%", width: "84%", height: "58%", background: "radial-gradient(ellipse at center, rgba(200,162,78,.16) 0%, transparent 62%)", pointerEvents: "none" }} />
          <div style={{ position: "relative", height: "100%", display: "flex", flexDirection: "column", paddingBottom: 56 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", fontSize: 11, fontWeight: 700, letterSpacing: ".18em", textTransform: "uppercase", color: "#8A94A3" }}>
              <b style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 15, letterSpacing: ".14em", color: "#C8A24E", fontWeight: 600 }}>Kriczky Virtus</b>
              <span>Deep-Dive Assessment</span>
            </div>
            <div style={{ marginTop: 74, textAlign: "center" }}>
              <img src="/icons/roadmap-system/shield.png" alt="" aria-hidden="true" width={80} height={80} style={{ display: "inline-block", marginBottom: 16, filter: "drop-shadow(0 6px 14px rgba(0,0,0,.45))" }} />
              <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 600, fontSize: 74, lineHeight: 1, margin: "0 0 12px", letterSpacing: "-.01em" }}>
                Structural <em style={{ fontWeight: 500, color: "#C8A24E" }}>Capital</em>
              </h1>
              <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: ".3em", textTransform: "uppercase", color: "#E8ECF1", marginBottom: 12 }}>Deep-Dive</div>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontStyle: "italic", color: "#A9B2BF" }}>Systems, Processes & Scalability</div>
            </div>

            <div style={{ marginTop: 34, padding: "18px 22px", borderRadius: 14, background: "rgba(255,255,255,.04)", border: "1px solid rgba(200,162,78,.28)" }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".18em", textTransform: "uppercase", color: "#C8A24E", marginBottom: 8 }}>The Core Principle</div>
              <div style={{ fontSize: 14, lineHeight: 1.6, color: "#C3CAD4" }}>
                Structural Capital is the "secret sauce" of your business - the systems, processes, technology, and intellectual property that make your company run. It's what converts the knowledge in people's heads into <span style={{ color: A.fill, fontWeight: 600 }}>company property</span> that can be documented, scaled, and transferred. A business with strong Structural Capital can survive the departure of any individual, scale without proportional cost increases, and be handed to a new operator who can run it from day one. Without it, your business is a collection of habits held together by memory.
              </div>
              <div style={{ fontSize: 14, lineHeight: 1.6, color: "#C3CAD4", marginTop: 10, paddingTop: 10, borderTop: "1px solid rgba(255,255,255,.08)" }}>
                <span style={{ color: A.fill, fontWeight: 700 }}>Structural Capital has two purposes</span> - first, it takes what exists inside your brain and gets it into a transferable form. Second, it connects people and knowledge so it can be shared to enable your business to scale. Making knowledge company property ensures that when talent walks out the door at night, the knowledge doesn't walk out with them.
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8, marginTop: 20 }}>
              {DIMS.map(d => {
                const t = scoreTone(scores[d.key]);
                return (
                  <div key={d.key} style={{ padding: "8px 12px", borderRadius: 999, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    background: t ? `${t.fill}1f` : "rgba(255,255,255,.035)", border: `1px solid ${t ? `${t.fill}88` : "rgba(255,255,255,.10)"}` }}>
                    <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: ".05em", textTransform: "uppercase", color: t ? t.fill : "#8A94A3", textAlign: "center" }}>{d.title}</span>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: "auto", textAlign: "center", fontSize: 13, color: "#8A94A3", fontStyle: "italic" }}>Score yourself 1–6 on each of the 10 dimensions. Your results update automatically on the summary page.</div>
          </div>
        </Page>

        {/* ═══ PAGE 2: HOW TO USE ═══ */}
        <Page s={s} n={++n} total={total} right="How to use this diagnostic" tex="light">
          <div className="kicker" style={{ color: TONE.green.ink }}>How to use this diagnostic</div>
          <h2 style={{ fontSize: 38, marginBottom: 12 }}>Your systems are your business. <em>Everything else is temporary.</em></h2>
          <p className="body" style={{ fontSize: 14.5, marginBottom: 10 }}>
            This isn't an IT audit. It's a honest assessment of whether your business runs on systems or on people's memories. A $5M services firm with documented processes, scalable technology, and clean financials is in a fundamentally different position than one with the same revenue built on tribal knowledge, spreadsheet workarounds, and a bookkeeper who's always behind. Both might be profitable - but only one has Structural Capital that enables sustainable growth and commands premium value.
          </p>
          <p className="body" style={{ fontSize: 14.5, marginBottom: 16 }}>
            For each dimension, read the description, review the checklist honestly, and score yourself based on where you truly are - not where you plan to be. The gap between your current score and a 5 or 6 is your blueprint for building a business that runs independently, scales efficiently, and holds its value regardless of who's in the building.
          </p>
          <div className="card" style={{ padding: "13px 18px", marginBottom: 12, borderColor: `${TONE.cyan.fill}66` }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: TONE.cyan.ink, marginBottom: 6 }}>Why 1–6 instead of 1–5?</div>
            <div style={{ fontSize: 13.5, lineHeight: 1.5, color: L.ink2 }}>
              A 1–5 scale lets you hide at "3" - safe, average, non-committal. Our 1–6 scale has <b style={{ color: L.ink }}>no middle</b>. You're either below the midpoint (1–3) or above it (4–6). This forces honest self-assessment, which is the only kind that leads to real improvement.
            </div>
          </div>
          <div className="card" style={{ padding: "13px 18px", marginBottom: 12, borderColor: `${TONE.gold.fill}66` }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: TONE.gold.ink, marginBottom: 10 }}>What the top scores mean</div>
            <div style={{ display: "flex", gap: 12 }}>
              {[[5, "Best In Class", TONE.cyan, "Genuine competitive advantage. Your systems outperform your industry peers - you deliver more consistently, scale more efficiently, and operate more independently than competitors at your size. This area is a strategic asset."],
                [6, "Perfect", TONE.green, "Nothing meaningful left to improve. Most honest operators rarely give themselves this score. If you do, be certain you'd bet your house on it - because it will be tested, whether by rapid growth, a key departure, or a buyer's due diligence team."]].map(([num, label, t, text]) => (
                <div key={num} style={{ flex: 1, padding: "12px 14px", borderRadius: 10, background: `linear-gradient(135deg, #FFFFFF 40%, ${t.tint})`, border: `1px solid ${t.fill}55` }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 5 }}>
                    <span className="num" style={{ fontSize: 26, color: t.ink }}>{num}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: t.ink }}>{label}</span>
                  </div>
                  <div style={{ fontSize: 12.5, lineHeight: 1.45, color: L.ink2 }}>{text}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="card" style={{ padding: "13px 18px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: TONE.gold.ink, marginBottom: 6 }}>For each dimension</div>
            <div style={{ fontSize: 13.5, lineHeight: 1.5, color: L.ink2 }}>
              Read the description and checklist honestly. Use the checklist as a gut-check - not a scorecard. Then use the <b style={{ color: L.ink }}>Rate Yourself</b> panel at the bottom to assign your score. All 10 dimensions contribute to your overall Structural Capital score. Your results aggregate automatically.
            </div>
          </div>
        </Page>

        {/* ═══ PAGES 3–12: ONE DIMENSION PER PAGE ═══ */}
        {DIMS.map(dim => (
          <Page key={dim.key} s={s} n={++n} total={total} right={`Dimension ${pad2(dim.num)} of ${dim.of}`}>
            <div style={{ display: "flex", gap: 20, alignItems: "center", marginBottom: 12 }}>
              <Tile size={70}><span className="num" style={{ fontSize: 30, color: A.ink }}>{pad2(dim.num)}</span></Tile>
              <div style={{ flex: 1 }}>
                <div className="kicker" style={{ color: A.ink, marginBottom: 6 }}>Dimension {pad2(dim.num)} of {dim.of}</div>
                <h2 style={{ fontSize: 35, margin: 0, lineHeight: 1.04 }}>{dim.title}</h2>
              </div>
            </div>
            <div style={{ fontSize: 19.5, fontWeight: 600, fontStyle: "italic", fontFamily: "'Cormorant Garamond',serif", color: A.ink, marginBottom: 10, lineHeight: 1.25 }}>{dim.subtitle}</div>
            <p className="body" style={{ fontSize: 15, lineHeight: 1.56, marginBottom: 14 }}>{dim.description}</p>
            <div className="card" style={{ overflow: "hidden", borderColor: `${A.fill}55` }}>
              <div style={{ padding: "8px 18px 7px", fontSize: 11, fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase", color: L.ink3, background: `linear-gradient(90deg, ${A.tint}, #FFFFFF)` }}>Check what's true today</div>
              {dim.checks.map((c, ci) => (
                <CheckItem key={ci} text={c.text} sub={c.sub} checked={!!checks[`${dim.key}-${ci}`]} onToggle={() => toggleCheck(dim.key, ci)} />
              ))}
            </div>
            <ScoreSelector value={scores[dim.key]} onChange={v => setScore(dim.key, v)} lowLabel={dim.lowLabel} highLabel={dim.highLabel} />
          </Page>
        ))}

        {/* ═══ SCORING SUMMARY ═══ */}
        <Page s={s} n={++n} total={total} right="Your score" tex="light">
          <div className="kicker" style={{ color: A.ink }}>Your Structural Capital score</div>
          <h2 style={{ fontSize: 42 }}>How strong are the <em>systems</em> that run your business?</h2>
          <div className="card" style={{ padding: "16px 20px 10px", marginTop: 6 }}>
            {DIMS.map(d => {
              const sc = scores[d.key]; const t = scoreTone(sc);
              return (
                <div key={d.key} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 9 }}>
                  <span style={{ fontSize: 13.5, color: L.ink2, width: 300, flexShrink: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{d.title}</span>
                  <div style={{ flex: 1, height: 10, borderRadius: 6, background: L.ruleLight, overflow: "hidden" }}>
                    {sc && <div style={{ width: `${(sc / 6) * 100}%`, height: "100%", borderRadius: 6, background: t.fill }} />}
                  </div>
                  <span className="num" style={{ fontSize: 17, color: t ? t.ink : L.ink4, width: 22, textAlign: "right" }}>{sc || "-"}</span>
                </div>
              );
            })}
          </div>
          {(() => {
            const bt = unlocked && activeBand ? bandTone(activeBand) : null;
            return (
              <div className="card" style={{ padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14, ...(bt ? { borderColor: `${bt.fill}88`, background: `linear-gradient(135deg, #FFFFFF 55%, ${bt.tint})`, boxShadow: `0 0 24px ${bt.fill}33, 0 10px 26px rgba(10,14,20,.08)` } : {}) }}>
                <span style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: A.ink }}>Total Structural Capital score</span>
                <span className="num" style={{ fontSize: 30, color: bt ? bt.ink : L.ink4 }}>
                  {totalScore}<span style={{ fontSize: 16, color: L.ink3 }}>/{maxScore}</span>
                  {unlocked && <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 600, color: L.ink2, marginLeft: 8 }}>({Math.round((totalScore / maxScore) * 100)}%)</span>}
                </span>
              </div>
            );
          })()}
          {unlocked && activeBand && (() => {
            const bt = bandTone(activeBand);
            return (
              <>
                <div style={{ marginTop: 16, padding: "4px 0 0 18px", borderLeft: `3px solid ${bt.fill}` }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 4 }}>
                    <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 600, color: bt.ink }}>{activeBand.label}</span>
                    <span style={{ fontSize: 12, color: L.ink3 }}>Score range: {activeBand.range} of 60</span>
                  </div>
                  <div style={{ fontSize: 13.5, lineHeight: 1.55, color: L.ink2, marginBottom: 8 }}>{activeBand.desc}</div>
                  {lowestTwo.length >= 2 && (
                    <div style={{ fontSize: 13.5, color: L.ink, marginBottom: 8 }}>
                      <b>Your biggest opportunities:</b>{" "}
                      <span style={{ color: scoreTone(scores[lowestTwo[0].key]).ink, fontWeight: 600 }}>{lowestTwo[0].title}</span> and{" "}
                      <span style={{ color: scoreTone(scores[lowestTwo[1].key]).ink, fontWeight: 600 }}>{lowestTwo[1].title}</span>.
                    </div>
                  )}
                  <div style={{ fontSize: 13, lineHeight: 1.55, color: L.ink2, fontStyle: "italic", marginBottom: 6 }}>
                    Every dimension you just scored represents a systems lever - a specific place where improving your Structural Capital can increase both your operational efficiency and your enterprise value. The gaps aren't failures. They're the untapped infrastructure hiding in your business.
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.5, color: L.ink }}>
                    The businesses that command premium growth and premium valuations don't just have good people and happy customers - they have systems that make excellence repeatable, scalable, and transferable.
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginTop: 16 }}>
                  {BANDS.map(b => {
                    const t = bandTone(b); const on = activeBand.label === b.label;
                    return (
                      <div key={b.label} style={{ padding: "9px 12px", borderRadius: 10, background: on ? `linear-gradient(135deg, #FFFFFF 40%, ${t.tint})` : "#FFFFFF",
                        border: `1px solid ${on ? t.fill : L.ruleLight}`, boxShadow: on ? `0 0 18px ${t.fill}44` : "none", opacity: on ? 1 : 0.5 }}>
                        <div style={{ fontSize: 12.5, fontWeight: 700, color: t.ink }}>{b.label}</div>
                        <div style={{ fontSize: 11.5, color: L.ink3 }}>{b.range} points</div>
                      </div>
                    );
                  })}
                </div>
              </>
            );
          })()}
          {!unlocked && (
            <div style={{ marginTop: 22, textAlign: "center", fontSize: 14.5, color: L.ink3, fontStyle: "italic" }}>
              {allScored ? "All 10 scored. Unlock your diagnosis and first three moves below." : `Score all 10 dimensions to see your diagnosis. ${DIMS.length - scoredCount} to go.`}
            </div>
          )}
        </Page>

        {/* EMAIL GATE */}
        {allScored && !gateUnlocked && (
          <EmailGate toolName="Structural Capital Deep-Dive" toolSlug="structural-capital" storeSlug="structural-capital-deep-dive" scores={scores}
            summary={{ totalScore, maxScore, pct: Math.round((totalScore / maxScore) * 100), band: activeBand?.label }}
            onUnlock={(name) => { setWho(name); setGateUnlocked(true); }} onStored={(p) => { savedLink.current = p; }} />
        )}

        {/* ═══ YOUR FIRST 3 MOVES (gated) ═══ */}
        {unlocked && (
          <Page s={s} n={++n} total={total} right="Your next steps" tex="light">
            <div className="kicker" style={{ color: TONE.green.ink }}>Your personalized next steps</div>
            <h2>Your first <em>three moves.</em></h2>
            <p className="body" style={{ marginBottom: 22 }}>
              These are your highest-leverage actions - specific to your lowest-scoring dimensions, calibrated to your current level, and executable this week. Not theory. Not someday. This week.
            </p>
            {lowestThree.map((d, i) => {
              const sc = scores[d.key]; const t = scoreTone(sc);
              const tactic = d.quickWins[sc <= 2 ? "low" : sc <= 4 ? "mid" : "high"][0];
              return (
                <div key={d.key} className="card" style={{ display: "flex", gap: 18, padding: "18px 20px", marginBottom: 14 }}>
                  <Tile size={60}><span className="num" style={{ fontSize: 24, color: TONE.gold.ink }}>{pad2(i + 1)}</span></Tile>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: A.ink, marginBottom: 4 }}>
                      {d.title} <span style={{ color: t.ink }}>({sc}/6)</span>
                    </div>
                    <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 23, fontWeight: 600, lineHeight: 1.2, color: L.ink, marginBottom: 6 }}>{tactic.title}</div>
                    <div style={{ fontSize: 14, lineHeight: 1.55, color: L.ink2 }}>{tactic.context}</div>
                  </div>
                </div>
              );
            })}
            <div style={{ marginTop: 10, padding: "4px 0 4px 18px", borderLeft: `3px solid ${A.fill}` }}>
              <div style={{ fontSize: 15, lineHeight: 1.6, color: L.ink2 }}>
                You can implement these yourself - or our team can see if you qualify for us to help you build systems and processes that turn your business into a <span style={{ color: A.ink, fontWeight: 700 }}>Masterpiece Business</span> that future buyers fight one another to acquire.
              </div>
            </div>
          </Page>
        )}

        {/* ═══ WHAT HAPPENS NEXT (CTA) ═══ */}
        <Page s={s} n={total} total={total} right="What happens next" tex="light">
          <div className="kicker" style={{ color: TONE.gold.ink }}>What happens next</div>
          <h2 style={{ fontSize: 42 }}>Knowing your <em>Structural Capital</em> score is the beginning, not the end.</h2>
          <div style={{ display: "flex", gap: 22, alignItems: "center", margin: "6px 0 18px" }}>
            <img src="/images/edward-kriczky-headshot-240.jpg" alt="Edward Kriczky" width="104" height="104" style={{ borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: "3px solid #fff", boxShadow: `0 0 0 1.5px ${TONE.gold.fill}, 0 10px 24px rgba(10,14,20,.16)` }} />
            <div>
              <div style={{ fontSize: 17, fontWeight: 700, color: L.ink }}>Edward Kriczky, CEPA®</div>
              <div style={{ fontSize: 13.5, color: TONE.gold.ink, fontWeight: 600, marginBottom: 6 }}>Founder, Kriczky Virtus</div>
              <div style={{ fontSize: 14, lineHeight: 1.55, color: L.ink2 }}>
                Most owners build systems reactively - when something breaks, they fix it. The businesses that command premium growth and premium valuations build systems proactively - documenting, automating, and scaling before they need to. That's the gap this assessment reveals. The distance between where you scored and best-in-class isn't a problem - it's a blueprint for building infrastructure that makes your business a Masterpiece. Let's build it together.
              </div>
            </div>
          </div>
          <div className="card" style={{ padding: "16px 22px 18px", marginBottom: 20 }}>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, fontWeight: 600, marginBottom: 16 }}>What happens next.</div>
            <div style={{ display: "flex", alignItems: "flex-start" }}>
              {[
                { label: "Week 1", title: "Valuation Driver Intensive", desc: "We define your Profit Gap, Value Gap, and build your prioritized action plan.", t: TONE.gold, icon: "get-gold.png" },
                { label: "Months 1–3", title: "Sprint 1 Execution", desc: "Monthly working sessions. I'm in the room for every decision, delegation, and process build.", t: TONE.gold, icon: "why.png" },
                { label: "Day 90", title: "Re-Score & Adapt", desc: "Fresh diagnostic with updated numbers. See what moved. The roadmap adapts. We keep going.", t: TONE.green, icon: "get-green.png" },
              ].map((st, si, arr) => (
                <div key={si} style={{ display: "flex", alignItems: "flex-start", flex: si < arr.length - 1 ? 1 : undefined }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 170 }}>
                    <IconTile src={`${ICONS}/${st.icon}`} size={56} />
                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: st.t.ink, marginTop: 10 }}>{st.label}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: L.ink, marginTop: 4, textAlign: "center" }}>{st.title}</span>
                    <span style={{ fontSize: 12.5, color: L.ink2, lineHeight: 1.45, textAlign: "center", marginTop: 4 }}>{st.desc}</span>
                  </div>
                  {si < arr.length - 1 && <div style={{ flex: 1, height: 2, marginTop: 27, background: `linear-gradient(90deg, ${TONE.gold.fill}88, ${TONE.gold.fill}44)` }} />}
                </div>
              ))}
            </div>
          </div>
          <div style={{ textAlign: "center", marginBottom: 22 }}>
            <CtaBtn href="https://www.kriczkyvirtus.com/free-session">BOOK YOUR FREE WORKING SESSION</CtaBtn>
          </div>
          <div style={{ padding: "4px 0 4px 20px", borderLeft: `3px solid ${TONE.gold.fill}`, marginBottom: 18 }}>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontStyle: "italic", lineHeight: 1.45, color: L.ink }}>
              People leave. Markets shift. Technology evolves. But the systems you build today - the documented processes, the scalable architecture, the protected intellectual property - those become the permanent infrastructure of enterprise value. They are what transforms a business from a job that depends on you into an asset that <span style={{ color: TONE.gold.ink, fontWeight: 700, fontStyle: "normal" }}>works for you.</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 22, fontSize: 13, color: L.ink3 }}>
            <span>ekriczky@kriczkyvirtus.com</span><span>kriczkyvirtus.com</span>
          </div>
        </Page>

      </div>
    </div>
  );
}
