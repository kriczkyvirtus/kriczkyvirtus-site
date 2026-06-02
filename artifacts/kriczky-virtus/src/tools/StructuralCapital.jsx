import { useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/* ═══════════════════════════════════════════════════════════════
   STRUCTURAL CAPITAL DEEP-DIVE
   Systems, Processes & Scalability
   Accent: #60A5FA (blue)
   Step 3 diagnostic — follows BIB identification of weakest capital
   ═══════════════════════════════════════════════════════════════ */

const HEADSHOT = "data:image/jpeg;base64,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";

const C = {
  gold: "#C8A24E", goldMuted: "#A68A42", goldLight: "#D4B665",
  green: "#34D399", red: "#F87171", amber: "#FBBF24",
  amberDark: "#D4A017",
  blue: "#60A5FA", cyan: "#22D3EE", purple: "#A78BFA",
  bgDeep: "#0A0E14", bgCard: "#111720", bgElev: "#1A2130",
  text1: "#E8ECF1", text2: "#8B95A5", text3: "#5A6474", text4: "#3D4654",
  border1: "rgba(255,255,255,0.06)", border2: "rgba(255,255,255,0.10)",
};

const ACCENT = C.blue;

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const scoreColor = (n) => {
  if (!n || n <= 0) return C.text4;
  if (n <= 2) return C.red;
  if (n === 3) return C.amber;
  if (n === 4) return C.amberDark;
  if (n === 5) return C.cyan;
  return C.green;
};

/* ── DIMENSIONS (10) ── */
const DIMS = [
  {
    key: "d1", num: 1, of: 10,
    title: "SOP Coverage & Documentation",
    subtitle: "Are your core processes written down, or trapped in people's heads?",
    description: "A $5M home services company ran like clockwork — until the operations manager who 'knew everything' got recruited by a competitor. Within two weeks, scheduling fell apart, quality complaints tripled, and the owner was back to working 70-hour weeks. The problem wasn't losing one person. The problem was that the company's entire operating system lived in that person's head. Compare that to a $3M logistics company where every core process has a written SOP, updated quarterly, accessible to anyone on the team. When their ops lead left, the replacement was fully productive in 10 days. Documentation isn't bureaucracy. It's the difference between a business that runs on memory and one that runs on systems.",
    checks: [
      { text: "Our top 10 revenue-generating processes are documented in written SOPs.", sub: "Not 'we sort of have some docs.' Written, accessible, step-by-step procedures that someone new could follow tomorrow." },
      { text: "SOPs have been reviewed or updated within the last 12 months.", sub: "Outdated documentation is worse than none — it creates false confidence. When's the last time anyone actually reviewed yours?" },
      { text: "New hires can follow SOPs to perform core tasks without extensive shadowing.", sub: "The test of good documentation: can someone execute from the document alone, or do they need a translator?" },
      { text: "There is a designated owner for maintaining each SOP.", sub: "Documentation without ownership decays. Every SOP needs a name next to it — someone accountable for keeping it current." },
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
        { title: "Create a centralized SOP library accessible to the entire team", context: "Google Drive, Notion, Confluence — the tool matters less than the habit. If people can't find the SOP in 30 seconds, it doesn't exist." },
        { title: "Run a 'process audit' — have a non-expert try to execute from documentation alone", context: "The fastest way to find gaps: hand the SOP to someone who's never done the task. Where they get stuck reveals what's missing." },
      ],
      high: [
        { title: "Build version control into your SOP system with change logs", context: "Track what changed, when, and why. Version history creates institutional memory and prevents regression." },
        { title: "Document the meta-process: how to create and maintain SOPs in your organization", context: "A documented documentation process ensures consistency as you scale. It's the SOP for SOPs — and it's worth its weight in gold." },
      ],
    },
  },
  {
    key: "d2", num: 2, of: 10,
    title: "Process Consistency & Quality Control",
    subtitle: "Does the output quality stay the same regardless of who's doing the work?",
    description: "A $4M digital marketing agency had a reputation problem it couldn't see: the quality of their work depended entirely on which team member was assigned to the project. Their best people delivered exceptional results. Their average people delivered mediocre ones. Same processes, same tools, same pricing — wildly different outcomes. They didn't have a quality problem. They had a consistency problem. The fix wasn't hiring better people. It was building quality checkpoints into every workflow so that the process — not the person — guaranteed the standard. Process consistency is what allows you to scale without degrading quality, and what gives anyone evaluating your business confidence that the results are reproducible.",
    checks: [
      { text: "We have defined quality standards for every client-facing deliverable.", sub: "Not 'we know good when we see it.' Written criteria that any team member can check against before delivery." },
      { text: "Quality checkpoints are built into our workflows — not reliant on individual judgment.", sub: "If quality depends on someone 'catching' errors, it's not a system. Systems prevent errors; people catch what systems miss." },
      { text: "Customer complaints about quality inconsistency are rare (fewer than 5% of engagements).", sub: "If quality varies by who's on the project, you have a consistency gap that erodes trust and limits growth." },
      { text: "We measure quality metrics and review them at least monthly.", sub: "Error rates, rework percentages, customer satisfaction scores — what gets measured gets managed." },
    ],
    lowLabel: "Person-dependent quality",
    highLabel: "System-guaranteed consistency",
    quickWins: {
      low: [
        { title: "Identify your top 3 client-facing deliverables and write a quality checklist for each", context: "A simple pre-delivery checklist: 10 items that must be true before anything goes to a client. Checklists eliminate 80% of quality variance." },
        { title: "Review your last 10 client complaints — what pattern emerges?", context: "Most quality issues cluster around 2–3 root causes. Fix those causes and you fix 70% of the problem." },
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
    description: "A $6M professional services firm was running their entire operation on a patchwork of spreadsheets, email threads, and a 15-year-old custom Access database that one person knew how to maintain. When that person left, the database broke — and with it, their ability to invoice, track projects, and report to clients. They spent $180K and six months rebuilding what should have been a $30K/year SaaS implementation. Your technology stack isn't just an operational tool. It's the nervous system of your business. Modern, integrated, well-maintained technology enables scale, reduces manual effort, and signals operational maturity to anyone evaluating your business — whether that's a lender, a partner, or an eventual buyer.",
    checks: [
      { text: "Our core systems (CRM, ERP, project management, accounting) are cloud-based and integrated.", sub: "On-premise, disconnected systems create data silos, manual workarounds, and single points of failure." },
      { text: "We have automated at least 3 repetitive manual processes in the last 12 months.", sub: "If your team is still doing the same manual tasks they did two years ago, you're paying for time that technology could reclaim." },
      { text: "Our technology stack could support 2x current revenue without major overhaul.", sub: "If doubling revenue would break your systems, your tech is a growth bottleneck — not an enabler." },
      { text: "We have a technology roadmap that aligns with our business growth plan.", sub: "Reactive tech spending (fixing what breaks) costs 3–5x more than proactive investment (building what scales)." },
    ],
    lowLabel: "Duct tape and spreadsheets",
    highLabel: "Scalable, integrated stack",
    quickWins: {
      low: [
        { title: "Inventory every tool your team uses — subscriptions, spreadsheets, manual processes", context: "A complete tech audit. You'll find duplicate tools, forgotten subscriptions, and critical processes running on someone's personal spreadsheet." },
        { title: "Identify your #1 most time-consuming manual process and research automation options", context: "Interview your team: 'What task do you waste the most time on?' That's your first automation target. Most can be solved with existing tools." },
        { title: "Migrate your most critical data off local machines onto cloud-based systems", context: "If any business-critical data lives on one person's laptop, you're one hardware failure away from catastrophe." },
      ],
      mid: [
        { title: "Integrate your CRM, project management, and accounting systems", context: "Data should flow between systems automatically. Every manual data transfer is an error opportunity and a time drain." },
        { title: "Implement a simple automation for your most frequent client communication", context: "Onboarding emails, status updates, invoice reminders — automating these frees hours weekly and improves consistency." },
        { title: "Create a 12-month technology roadmap aligned with business goals", context: "Not a wish list. A prioritized plan: Q1 we fix X, Q2 we automate Y, Q3 we integrate Z. Budget it, calendar it, execute it." },
      ],
      high: [
        { title: "Conduct a scalability stress test: model what breaks at 2x revenue", context: "Walk through every system and process assuming double the volume. Where do bottlenecks appear? Fix them before they become crises." },
        { title: "Evaluate AI and machine learning opportunities in your core workflows", context: "From automated data entry to predictive analytics — AI tools are becoming accessible to $1M–$10M businesses. Early adopters gain significant competitive advantage." },
      ],
    },
  },
  {
    key: "d4", num: 4, of: 10,
    title: "Data Ownership & Accessibility",
    subtitle: "Do you own your data? Can your team access and use it to make decisions?",
    description: "A $3M e-commerce brand discovered during due diligence that they didn't actually own their customer data. It was locked inside a third-party platform with export restrictions in the Terms of Service. Their entire customer list — email addresses, purchase history, lifetime value data — was technically the platform's property. The deal didn't fall through, but the valuation discount was painful. Data ownership is Structural Capital you can't see until it matters. The questions are simple: do you own it, can you access it, is it clean, and does your team actually use it to make decisions? If the answer to any of those is 'no,' your data is a liability, not an asset.",
    checks: [
      { text: "We own all our customer, financial, and operational data outright — no third-party restrictions.", sub: "Check your vendor agreements. If you can't export your own data without restrictions, you don't really own it." },
      { text: "Key business data is accessible to authorized team members in real-time.", sub: "If getting a report requires asking IT or waiting for month-end, your data isn't accessible — it's archived." },
      { text: "We have a single source of truth for core metrics — no conflicting spreadsheets.", sub: "When different people cite different numbers for the same metric, you have a data integrity problem that erodes trust and decision quality." },
      { text: "Business decisions are regularly informed by data analysis, not just intuition.", sub: "Data-driven doesn't mean data-obsessed. It means the numbers are part of every significant decision, not an afterthought." },
    ],
    lowLabel: "Data trapped or unowned",
    highLabel: "Clean, owned, decision-ready",
    quickWins: {
      low: [
        { title: "Audit your vendor agreements for data ownership and export clauses this week", context: "Read the fine print on your top 5 platforms. Can you export your data? In what format? Any restrictions? Know before it matters." },
        { title: "Identify your top 5 business decisions and ask: what data informed each one?", context: "If the answer is 'gut feel' more than 'data,' your team isn't using data to drive decisions — even if you have it." },
        { title: "Export a full backup of your customer and financial data this week", context: "Prove you can do it. If it takes more than an hour or the data comes out messy, you have an accessibility and quality problem." },
      ],
      mid: [
        { title: "Build a simple executive dashboard with your 5 most important KPIs", context: "Revenue, pipeline, cash flow, retention, utilization — whatever matters most. One page, updated weekly, accessible to leadership." },
        { title: "Eliminate competing data sources — establish one system of record per metric", context: "When the CRM says revenue is X and the spreadsheet says Y, nobody trusts either. Pick one source of truth and retire the rest." },
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
    description: "A $4M IT managed services firm grew from $2M to $4M in three years. The problem: headcount grew from 15 to 34, and margins shrank from 28% to 19%. They added revenue but didn't scale — they just got bigger. A competing firm at the same revenue had 22 people and 31% margins because they'd invested in automation, self-service portals, and tiered service delivery. Scalability isn't about growing revenue. It's about growing revenue faster than costs. The architecture of your business — your delivery model, your pricing structure, your operational leverage — determines whether adding $1M in revenue makes you stronger or just busier.",
    checks: [
      { text: "We can describe exactly how we'd handle 2x volume with less than 2x resources.", sub: "If the answer is 'hire more people,' you don't have a scale architecture — you have a linear cost model." },
      { text: "Our gross margins have stayed flat or improved as revenue has grown.", sub: "Declining margins with growing revenue is the classic sign of a business that scales linearly, not leveraged." },
      { text: "We have at least one revenue stream that doesn't require proportional labor input.", sub: "Productized services, subscription models, licensing — something where revenue can grow without equivalent effort." },
      { text: "We've identified and eliminated at least 2 bottlenecks in the last 12 months.", sub: "Bottlenecks are scale killers. If you don't actively find and remove them, they'll find you when you try to grow." },
    ],
    lowLabel: "Linear cost model",
    highLabel: "Leveraged, scalable architecture",
    quickWins: {
      low: [
        { title: "Map your cost structure: what percentage is fixed vs. variable?", context: "A business with 80% variable costs scales linearly. One with 60% fixed costs has natural operating leverage. Know your ratio and work to shift it." },
        { title: "Identify your biggest bottleneck — the constraint that limits throughput right now", context: "Interview your team: 'What's the one thing that slows us down the most?' That bottleneck is where your scale investment should start." },
        { title: "Calculate your revenue-per-employee and compare it to 2 years ago", context: "If revenue-per-employee is flat or declining, you're adding cost as fast as revenue. This metric tells you whether you're scaling or just growing." },
      ],
      mid: [
        { title: "Design a productized version of your most popular custom service", context: "Take your most-requested custom engagement and package it: fixed scope, fixed price, repeatable delivery. Productized services scale; custom engagements don't." },
        { title: "Implement tiered service delivery — not every client needs the senior team on every task", context: "A junior/mid/senior delivery model lets you serve more clients at higher margins without sacrificing quality on high-value work." },
        { title: "Build a capacity model: how many clients/projects can you handle before you need to hire?", context: "Knowing your capacity ceiling prevents reactive hiring. It also reveals where automation or process improvement extends capacity without headcount." },
      ],
      high: [
        { title: "Model the unit economics of your next $1M in revenue — what does it cost to deliver?", context: "If the marginal cost of the next million is lower than the last, your scale architecture is working. If it's higher, you have a structural problem." },
        { title: "Evaluate platform or technology investments that create non-linear revenue potential", context: "A proprietary tool, a self-service portal, a training platform — assets that serve clients with minimal marginal cost create genuine scalability." },
      ],
    },
  },
  {
    key: "d6", num: 6, of: 10,
    title: "Intellectual Property & Proprietary Assets",
    subtitle: "Do you own anything protectable — frameworks, tools, methods, patents?",
    description: "Two consulting firms. Same revenue, same margins, same client quality. One has a proprietary methodology with a trademarked name, a diagnostic tool that generates leads, and a training curriculum licensed to partners. The other delivers excellent work but has no named frameworks, no proprietary tools, and no protectable IP. The first firm could command a 6–8x EBITDA multiple. The second might get 3–4x — because without IP, you're selling labor and relationships, not assets. Intellectual property is Structural Capital that creates competitive moats, enables licensing revenue, and gives your business an identity that exists independent of any individual.",
    checks: [
      { text: "We have at least one proprietary methodology, framework, or process with a distinctive name.", sub: "Named frameworks signal maturity and create differentiation. 'Our 7-Step Growth Accelerator' is an asset. 'How we do things' is not." },
      { text: "Our key IP (trademarks, trade secrets, proprietary tools) is legally protected.", sub: "Unprotected IP is just good ideas. Trademark your frameworks, NDA your trade secrets, and patent what qualifies." },
      { text: "We have proprietary tools, templates, or technology that clients or partners would pay to access.", sub: "Licensable IP creates non-labor revenue streams. Does any of your internal tooling have external value?" },
      { text: "Our IP is documented in a way that makes it transferable and teachable.", sub: "If your methodology lives in the founder's head, it's not IP — it's institutional knowledge. Documentation makes it an asset." },
    ],
    lowLabel: "No protectable IP",
    highLabel: "Proprietary, protected, licensable",
    quickWins: {
      low: [
        { title: "Name your core methodology — give it a distinctive, trademarkable identity this week", context: "Every business has a 'way we do things.' Name it, structure it into steps or phases, and brand it. This alone transforms generic service delivery into proprietary IP." },
        { title: "List everything unique about how you deliver value — then assess what's protectable", context: "Proprietary tools, custom templates, training materials, diagnostic frameworks — you likely have more IP than you realize. It just hasn't been formalized." },
        { title: "Ensure all employees and contractors have signed IP assignment agreements", context: "Without these, work product created by your team may not legally belong to the company. A $500 legal review prevents a catastrophic ownership dispute." },
      ],
      mid: [
        { title: "File a trademark application for your core methodology name", context: "A trademark costs $250–$350 to file and creates permanent brand protection. It also signals professionalism and maturity to clients and partners." },
        { title: "Build a simple internal tool or template that automates part of your proprietary process", context: "A spreadsheet calculator, a diagnostic quiz, an assessment template — turning methodology into tooling creates tangible, transferable IP." },
        { title: "Document your proprietary methodology in a 10-page playbook that a new hire could study", context: "The playbook becomes a training asset, a sales tool, and a transferable IP document. It also forces you to formalize what you do and why." },
      ],
      high: [
        { title: "Explore licensing your methodology or tools to non-competing firms", context: "If your framework works in your market, it likely works in adjacent ones. Licensing creates recurring revenue from IP you've already built." },
        { title: "Conduct a formal IP audit with an attorney — identify, categorize, and value all proprietary assets", context: "An IP audit creates a defensible inventory of your intangible assets. It's essential for growth planning and invaluable in due diligence." },
      ],
    },
  },
  {
    key: "d7", num: 7, of: 10,
    title: "Financial Systems & Reporting",
    subtitle: "Can you produce accurate, timely financials that a lender or buyer would trust?",
    description: "A $7M manufacturing firm wanted to secure a growth line of credit. The bank asked for monthly financials for the last 24 months, a 13-week cash flow forecast, and departmental P&Ls. The owner had none of it — their bookkeeper ran QuickBooks, produced quarterly reports with a 6-week lag, and had never created a forecast. The loan was delayed 4 months while they rebuilt their financial reporting infrastructure. Accurate, timely financial systems aren't a nice-to-have. They're how you make decisions, secure capital, attract partners, and prove to anyone evaluating your business that the numbers are real. If your financials take more than 5 business days to close each month, your financial systems need work.",
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
        { title: "Create a simple 13-week cash flow forecast — even a spreadsheet works", context: "List known inflows and outflows for the next 13 weeks. Update it every Monday. This one practice prevents more cash crises than any other." },
        { title: "Ask your accountant: 'Would our financials survive due diligence scrutiny?'", context: "An honest answer from a qualified accountant reveals whether your numbers tell the real story — or need significant cleanup." },
      ],
      mid: [
        { title: "Implement departmental or service-line P&Ls", context: "Break your P&L into business units: by service, by client type, by team. Unit-level profitability reveals which parts of your business actually make money." },
        { title: "Build a monthly financial review meeting into your leadership rhythm", context: "30 minutes, same time each month: review financials, compare to budget, identify variances, decide actions. Financial literacy across leadership compounds." },
        { title: "Create a financial dashboard with 5 KPIs visible to leadership in real-time", context: "Revenue, gross margin, cash balance, AR aging, pipeline — whatever matters most. When leaders see the numbers daily, decisions improve dramatically." },
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
    description: "A $4M specialty food distributor had built their business around an exclusive relationship with a single overseas supplier. When that supplier was acquired by a competitor, the distributor lost access to 60% of their product line overnight. They had no backup supplier, no written agreement protecting their supply terms, and no transition plan. It took 18 months and a 35% revenue decline to rebuild. Vendor and supply chain management is Structural Capital that most owners ignore until a crisis forces their hand. Documented agreements, diversified suppliers, and transferable relationships protect your business from disruption — and signal operational maturity to anyone evaluating your resilience.",
    checks: [
      { text: "All key vendor relationships are covered by written agreements with defined terms.", sub: "Handshake deals with vendors create the same risk as handshake deals with clients. Written terms protect both parties." },
      { text: "No single vendor accounts for more than 30% of our cost of goods or critical inputs.", sub: "Vendor concentration creates the same existential risk as customer concentration. Diversify your supply base." },
      { text: "We have identified backup suppliers for our top 5 most critical inputs.", sub: "If your #1 supplier disappeared tomorrow, how long until you're operational again? The answer should be 'days,' not 'months.'" },
      { text: "Vendor relationships are with the company, not with specific individuals.", sub: "If one person leaving means losing vendor access or favorable terms, the relationship isn't institutional — it's personal." },
    ],
    lowLabel: "Concentrated, undocumented vendors",
    highLabel: "Diversified, transferable supply chain",
    quickWins: {
      low: [
        { title: "List your top 10 vendors by annual spend and check: written agreement yes/no?", context: "Every vendor without a written agreement is a risk. Prioritize formalizing agreements with your largest and most critical suppliers." },
        { title: "Calculate your vendor concentration — what percentage of costs goes to your top 3 suppliers?", context: "Above 50% in your top 3 is concentrated. Above 70% is dangerous. Know the number and start diversifying." },
        { title: "Identify one backup supplier for your #1 most critical vendor this week", context: "Don't wait for a crisis. Research, contact, and qualify at least one alternative. Even an untested backup is better than no backup." },
      ],
      mid: [
        { title: "Negotiate written agreements with your top 5 vendors that include termination notice periods", context: "A 90-day notice requirement gives you time to find alternatives. Without it, vendors can change terms or walk with no warning." },
        { title: "Introduce multiple team members to key vendor contacts", context: "Multi-threading vendor relationships — like client relationships — makes them institutional rather than personal." },
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
    description: "A $5M healthcare staffing agency was weeks from closing an acquisition when the buyer's attorneys discovered three issues: an expired state license in a key market, an insurance policy with a gap in professional liability coverage, and two contractor agreements that lacked non-compete clauses. None of these were catastrophic on their own. But together, they signaled operational sloppiness and created legal exposure that the buyer used to negotiate a 15% valuation reduction. Compliance and legal systems aren't exciting. They're the foundation that everything else rests on. When they're solid, nobody notices. When they're not, everyone does — and it costs real money.",
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
        { title: "Pull every license, permit, and certification — check expiration dates today", context: "A 30-minute audit that could prevent a six-figure problem. Any expired? Renew immediately. Any expiring in 90 days? Calendar the renewal." },
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
    description: "A $3M accounting firm had a saying: 'If it ain't broke, don't fix it.' They didn't invest in process improvement until clients complained. They didn't adopt new technology until competitors forced them. They didn't update their service offerings until revenue declined. By the time they reacted, they were always 18 months behind. Compare that to a $3M firm that holds monthly improvement meetings, allocates 5% of revenue to innovation, and asks every team member quarterly: 'What one thing should we change?' The second firm doesn't just survive change — they drive it. Continuous improvement isn't about perfection. It's about building the organizational habit of getting better on purpose, instead of waiting for problems to force change.",
    checks: [
      { text: "We have a formal process for capturing improvement ideas from the team.", sub: "A suggestion box, a monthly meeting, a digital channel — something that makes it easy for anyone to flag 'this could be better.'" },
      { text: "We allocate time or budget specifically for process improvement or innovation.", sub: "If improvement competes with billable work for resources, billable work always wins. Dedicated time/budget makes improvement real." },
      { text: "At least 3 meaningful process improvements have been implemented in the last 12 months.", sub: "Not 'we talked about improvements.' Actually implemented, measured, and sustained. What's your track record?" },
      { text: "We regularly benchmark our operations against industry best practices or competitors.", sub: "Without external benchmarks, 'good enough' becomes the standard. Benchmarking reveals gaps you can't see from inside." },
    ],
    lowLabel: "Reactive, only when forced",
    highLabel: "Systematic, continuous innovation",
    quickWins: {
      low: [
        { title: "Ask every team member this week: 'What one process should we improve first?'", context: "Your team knows where the friction lives. A simple survey or team meeting surfaces the 3–5 improvements that would have the biggest impact." },
        { title: "Schedule a monthly 30-minute 'improvement meeting' on the calendar — starting next week", context: "One agenda item: what can we do better? Document the ideas, pick one to implement, assign it an owner. Repeat monthly." },
        { title: "Implement one process improvement this week — even a small one", context: "The goal isn't perfection. It's momentum. Fix something small, celebrate it, and build the habit of intentional improvement." },
      ],
      mid: [
        { title: "Allocate 5% of team time (2 hours/week) to process improvement projects", context: "Protected time for improvement means it actually happens. Without it, urgent always crowds out important." },
        { title: "Create an improvement backlog: a prioritized list of process changes ranked by impact and effort", context: "A backlog turns scattered ideas into a managed pipeline. High-impact, low-effort items get done first." },
        { title: "Benchmark 3 key metrics against industry peers or published standards", context: "Revenue per employee, gross margin, client retention — compare yourself to the market. The gaps reveal where you're underperforming relative to what's possible." },
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
    desc: "Your Structural Capital is critically weak. Core processes live in people's heads, technology is a patchwork, and compliance gaps create legal exposure. Your business depends on individuals rather than systems — which limits growth, creates fragility, and suppresses your enterprise value. Immediate, focused investment in documentation, technology, and process formalization is needed." },
  { label: "Systems Fragile", min: 21, max: 35, range: "21–35", color: C.amber,
    desc: "You have some systems in place, but they're inconsistent, incomplete, or outdated. Key processes may be documented but not maintained. Technology works but doesn't scale. Financial reporting exists but isn't investor-ready. The foundation is there — but the gaps create risk and limit your ability to grow efficiently or transfer the business." },
  { label: "Systems Established", min: 36, max: 48, range: "36–48", color: C.cyan,
    desc: "Your systems are a genuine operational strength. Core processes are documented and maintained, technology enables scale, and financial reporting is reliable. The remaining gaps are specific and addressable — closing them moves you from operationally sound to structurally exceptional. This is where the highest-ROI improvements live." },
  { label: "Systems Powerhouse", min: 49, max: 60, range: "49–60", color: C.green,
    desc: "Your Structural Capital is a competitive weapon. Documented systems, scalable technology, protected IP, and investor-ready financials. Your business can operate independently of any individual and scale without proportional cost increases. Whether you're growing aggressively or positioning for an eventual exit, your systems are one of your most valuable assets." },
];

const TOTAL_PAGES_BASE = 14;
const TOTAL_PAGES_WITH_MOVES = 15;

/* ── COMPONENTS ── */

const Page = ({ children, pageNum, allScored }) => {
  const tp = allScored ? TOTAL_PAGES_WITH_MOVES : TOTAL_PAGES_BASE;
  return (
    <div style={{
      width: "8.5in", minHeight: "11in", position: "relative", overflow: "hidden",
      background: "linear-gradient(180deg, #0A0E14 0%, #0D1119 30%, #0E131C 50%, #0D1119 70%, #0A0E14 100%)",
      fontFamily: "'DM Sans', sans-serif", color: C.text1, boxSizing: "border-box",
      pageBreakAfter: "always", breakAfter: "page",
    }}>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1, opacity: 0.05, mixBlendMode: "overlay", backgroundImage: GRAIN, backgroundSize: "128px 128px" }}/>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, zIndex: 5, background: "linear-gradient(90deg, transparent 3%, #C8A24E30 15%, #C8A24E 35%, #D4B665 50%, #C8A24E 65%, #C8A24E30 85%, transparent 97%)" }}/>
      <div style={{ position: "absolute", top: "0.88in", bottom: "0.68in", left: "0.44in", width: 0.5, background: "linear-gradient(180deg, transparent, #C8A24E20, #C8A24E20, transparent)", zIndex: 2 }}/>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, padding: "0.4in 0.6in 0.18in", display: "flex", justifyContent: "space-between", alignItems: "baseline", fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", color: C.text3, fontWeight: 500, zIndex: 5 }}>
        <span>Kriczky Virtus</span>
        <span><b style={{ color: ACCENT, fontWeight: 600 }}>Structural Capital</b> — Deep-Dive Assessment</span>
      </div>
      <div style={{ position: "absolute", top: "0.68in", left: "0.65in", right: "0.65in", height: 0.5, background: "linear-gradient(90deg, transparent, #C8A24E40, transparent)", zIndex: 5 }}/>
      <div style={{ padding: "0.85in 0.6in 0.75in", position: "relative", zIndex: 3 }}>
        {children}
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 0.6in 0.4in", display: "flex", justifyContent: "space-between", alignItems: "baseline", color: C.text3, zIndex: 5 }}>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          <b style={{ color: C.gold, fontWeight: 600 }}>Kriczky</b> Virtus
        </span>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 13, color: C.text2 }}>
          {pageNum} <span style={{ color: C.text4 }}>/</span> {tp}
        </span>
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, #C8A24E20, #C8A24E40, #C8A24E20, transparent)" }}/>
    </div>
  );
};

const Shield = ({ size = 28, glow = false }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none"
    style={glow ? { filter: `drop-shadow(0 0 12px #C8A24E60) drop-shadow(0 0 4px #C8A24E90)` } : {}}>
    <path d="M32 8L14 16V30C14 42 22 52 32 56C42 52 50 42 50 30V16L32 8Z" fill="none" stroke="#C8A24E" strokeWidth="2.5" strokeLinejoin="round"/>
    <path d="M32 12L18 18.5V30C18 40.5 24.5 49 32 52C39.5 49 46 40.5 46 30V18.5L32 12Z" fill="rgba(200,162,78,0.06)"/>
    <path d="M25 32L29.5 36.5L40 26" stroke="#C8A24E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CheckItem = ({ text, sub, checked, onToggle }) => (
  <div style={{ display: "flex", gap: 12, padding: "8px 0", cursor: "pointer", userSelect: "none", alignItems: "center" }} onClick={onToggle}>
    <svg width="14" height="14" viewBox="0 0 14 14" style={{ flexShrink: 0 }}>
      <rect x="0.5" y="0.5" width="13" height="13" rx="2.5"
        fill={checked ? `${C.gold}20` : "rgba(200,162,78,0.04)"}
        stroke={checked ? C.gold : `${C.gold}40`} strokeWidth="1.5"/>
      {checked && <path d="M3.5 7L5.75 9.25L10.5 4.5" stroke={C.gold} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>}
    </svg>
    <div style={{ flex: 1 }}>
      <span style={{ fontSize: 12, color: checked ? C.text1 : C.text2, lineHeight: 1.5, transition: "color 0.2s" }}>{text}</span>
      {sub && <span style={{ display: "block", fontSize: 10.5, color: C.text3, lineHeight: 1.5, marginTop: 3 }}>{sub}</span>}
    </div>
  </div>
);

const ScoreSelector = ({ value, onChange, lowLabel, highLabel }) => {
  const activeColor = value ? scoreColor(value) : C.gold;
  return (
    <div style={{
      padding: "20px 24px", borderRadius: 12, marginTop: 16,
      background: value ? `linear-gradient(145deg, ${activeColor}08, ${activeColor}03)` : "linear-gradient(145deg, rgba(200,162,78,0.06), rgba(200,162,78,0.02))",
      border: `1.5px solid ${value ? `${activeColor}50` : `${C.gold}30`}`,
      boxShadow: value ? `0 0 20px ${activeColor}15, inset 0 1px 0 ${activeColor}15` : "none",
      transition: "all 0.3s ease",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: value ? activeColor : C.gold }}>Rate Yourself</span>
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: value ? activeColor : C.text4 }}>
          {value || "–"}<span style={{ fontSize: 12, color: C.text3 }}>/6</span>
        </span>
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
        {[1,2,3,4,5,6].map(n => {
          const c = scoreColor(n); const sel = value === n;
          return (
            <div key={n} onClick={() => onChange(n)} style={{
              flex: 1, height: 40, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", transition: "all 0.2s ease", userSelect: "none",
              background: sel ? `${c}20` : `${c}06`, border: `1.5px solid ${sel ? c : `${c}25`}`,
              boxShadow: sel ? `0 0 12px ${c}30` : "none",
            }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: sel ? c : `${c}60` }}>{n}</span>
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: 9, color: C.text3 }}>{lowLabel}</span>
        <span style={{ fontSize: 9, color: C.text3 }}>{highLabel}</span>
      </div>
      {!value && <div style={{ textAlign: "center", marginTop: 8, fontSize: 9, color: C.text4, letterSpacing: "0.08em", textTransform: "uppercase" }}>Tap a number to score</div>}
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

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */

/* =================== EMAIL GATE =================== */
const EmailGate = ({ toolName, toolSlug, accentColor, scores, summary, onUnlock, onGeneratePdf }) => {
  const [gName, setGName] = useState("");
  const [gEmail, setGEmail] = useState("");
  const [gError, setGError] = useState("");
  const [gSending, setGSending] = useState(false);
  const handleGateSubmit = () => {
    if (!gName.trim()) { setGError("Please enter your name so we can personalize your results."); return; }
    if (!gEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(gEmail)) { setGError("Please enter a valid email address."); return; }
    setGError(""); setGSending(true);
    const payload = { name: gName.trim(), email: gEmail.trim(), tool: toolSlug, toolName, scores, summary, timestamp: new Date().toISOString() };
    fetch("/api/lead-capture", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      .catch(err => console.error("[Lead] Fetch failed:", err));
    onUnlock();
    setGSending(false);
    const _name = gName.trim(), _email = gEmail.trim();
    setTimeout(async () => {
      try {
        const res = await fetch("/api/store-results", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: _name, email: _email, tool: "structural-capital-deep-dive", html: document.documentElement.outerHTML }) });
        if (res.ok) console.log("[Tool] Results stored");
        else console.error("[Tool] Failed to store results:", res.status);
      } catch (err) { console.error("[Tool] Store results failed:", err); }
    }, 2000);
  };
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "60px 20px", textAlign: "center", position: "relative", pageBreakBefore: "always" }}>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 60% 50% at 50% 40%, " + accentColor + "10, transparent 70%)" }}/>
      <div style={{ position: "relative", zIndex: 1, maxWidth: 480, width: "100%" }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: accentColor + "10", border: "2px solid " + accentColor + "30", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", boxShadow: "0 0 20px " + accentColor + "15" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><polyline points="4 12 10 18 20 6" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 32, color: "#E8ECF1", textTransform: "uppercase", margin: "0 0 10px", lineHeight: 1.1 }}>Your answers are<br/><span style={{ color: accentColor }}>locked in.</span></h2>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#8B95A5", lineHeight: 1.6, margin: "0 0 8px" }}>Enter your name and email to see your personalized results, scores, and recommended next steps.</p>
        <div style={{ padding: "28px 24px", borderRadius: 18, background: "linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.04))", border: "1px solid " + accentColor + "20", borderTop: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 60px " + accentColor + "08", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: 18, pointerEvents: "none", background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 30%, transparent 50%, transparent 70%, rgba(255,255,255,0.03) 100%)" }}/>
          <div style={{ position: "relative", zIndex: 1 }}>
            <input type="text" placeholder="Full name" value={gName} onChange={e => { setGName(e.target.value); setGError(""); }} style={{ width: "100%", padding: "14px 16px", borderRadius: 10, background: "#0F141C", border: "1px solid rgba(255,255,255,0.10)", color: "#E8ECF1", fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none", marginBottom: 10, boxSizing: "border-box" }} onFocus={e => e.target.style.borderColor = accentColor + "50"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.10)"} />
            <input type="email" placeholder="Email address" value={gEmail} onChange={e => { setGEmail(e.target.value); setGError(""); }} onKeyDown={e => e.key === "Enter" && handleGateSubmit()} style={{ width: "100%", padding: "14px 16px", borderRadius: 10, background: "#0F141C", border: "1px solid rgba(255,255,255,0.10)", color: "#E8ECF1", fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none", marginBottom: gError ? 8 : 16, boxSizing: "border-box" }} onFocus={e => e.target.style.borderColor = accentColor + "50"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.10)"} />
            {gError && <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#F87171", margin: "0 0 12px", textAlign: "left" }}>{gError}</p>}
            <button onClick={handleGateSubmit} disabled={gSending} onMouseEnter={e => { if (!gSending) { e.currentTarget.style.boxShadow = "0 0 48px " + accentColor + "40, 0 4px 20px rgba(0,0,0,0.35)"; e.currentTarget.style.borderColor = accentColor + "80"; e.currentTarget.style.background = "linear-gradient(135deg, " + accentColor + "25, " + accentColor + "15)"; var a = e.currentTarget.querySelector("[data-gate-arrow]"); if(a){ a.style.opacity="1"; a.style.transform="translateX(3px)"; } } }} onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 0 20px " + accentColor + "20, 0 4px 12px rgba(0,0,0,0.3)"; e.currentTarget.style.borderColor = accentColor + "50"; e.currentTarget.style.background = "linear-gradient(135deg, " + accentColor + "18, " + accentColor + "0a)"; var a = e.currentTarget.querySelector("[data-gate-arrow]"); if(a){ a.style.opacity="0"; a.style.transform="translateX(0)"; } }} style={{ width: "100%", padding: "16px 0", borderRadius: 12, border: "1.5px solid " + accentColor + "50", cursor: gSending ? "wait" : "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 15, color: accentColor, background: "linear-gradient(135deg, " + accentColor + "18, " + accentColor + "0a)", boxShadow: "0 0 20px " + accentColor + "20, 0 4px 12px rgba(0,0,0,0.3)", position: "relative", overflow: "hidden", transition: "all 0.3s ease", opacity: gSending ? 0.7 : 1 }}>
              <span style={{ position: "absolute", top: "-50%", left: "-50%", right: "-50%", bottom: "-50%", pointerEvents: "none", background: "linear-gradient(120deg, transparent 0%, transparent 40%, " + accentColor + "12 48%, " + accentColor + "20 50%, " + accentColor + "12 52%, transparent 60%, transparent 100%)", backgroundSize: "200% 200%", animation: "btnShimmer 6s ease-in-out infinite" }}/>
              <span style={{ position: "relative", zIndex: 1, display: "inline-flex", alignItems: "center", gap: 8 }}>{gSending ? "Unlocking your results..." : "See My Personalized Results"}{!gSending && <svg data-gate-arrow="" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0, transition: "all 0.25s ease" }}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>}</span>
            </button>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#5A6474", textAlign: "center", marginTop: 12 }}>Your data stays with you. We will send you a copy of your results.</p>
          </div>
        </div>
        <div style={{ marginTop: 24, padding: "16px 20px", borderRadius: 12, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", textAlign: "left" }}>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, fontWeight: 700, color: accentColor, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>What You Will Get</div>
          {["Your personalized scores across every dimension", "Specific areas where your business is strongest and weakest", "Prioritized recommendations to improve your score", "A clear picture of where you stand vs. best-in-class peers"].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}><polyline points="4 12 10 18 20 6" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#8B95A5" }}>{item}</span>
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


export default function StructuralCapitalDeepDive() {
  const [scores, setScores] = useState({});
  const [gateUnlocked, setGateUnlocked] = useState(false);
  const toolRef = useRef(null);
  const [checks, setChecks] = useState({});
  const [zoomLevel, setZoomLevel] = useState(1);
  useEffect(() => {
    const calc = () => { const w = window.innerWidth; if (w && w < 816) { setZoomLevel((w - 32) / 816); } else { setZoomLevel(1); } };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  const setScore = (key, val) => setScores(p => ({ ...p, [key]: val }));
  const toggleCheck = (dimKey, idx) => setChecks(p => { const k = `${dimKey}-${idx}`; return { ...p, [k]: !p[k] }; });

  const allScored = DIMS.every(d => scores[d.key]);
  const totalScore = DIMS.reduce((s, d) => s + (scores[d.key] || 0), 0);
  const maxScore = DIMS.length * 6;

  const activeBand = allScored ? BANDS.find(b => totalScore >= b.min && totalScore <= b.max) : null;

  const sorted = [...DIMS].filter(d => scores[d.key]).sort((a, b) => scores[a.key] - scores[b.key]);
  const lowestTwo = sorted.slice(0, 2);
  const lowestThree = sorted.slice(0, 3);

  let pageNum = 0;

  return (
    <div ref={toolRef} style={{ background: C.bgDeep, minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500&family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet"/>
      <style>{`@media print { .page-gap { display: none !important; } } @keyframes btnShimmer { 0%{background-position:200% 0}50%{background-position:-200% 0}100%{background-position:-200% 0} }`}</style>
      <div style={{ maxWidth: "8.5in", margin: "0 auto", zoom: zoomLevel }}>

        {/* ═══ PAGE 1: COVER ═══ */}
        <Page pageNum={++pageNum} allScored={allScored}>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", minHeight: "calc(11in - 1.6in)", position: "relative" }}>
            <div style={{ position: "absolute", top: -10, right: -10, fontFamily: "'Cormorant Garamond', serif", fontSize: 180, fontWeight: 700, color: ACCENT, opacity: 0.03, lineHeight: 1, userSelect: "none" }}>10</div>

            <div style={{ textAlign: "center", marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}><Shield size={48} glow /></div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 34, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", lineHeight: 1.15 }}>
                <span style={{ color: ACCENT }}>Structural Capital</span><br/>Deep-Dive
              </div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontStyle: "italic", color: C.text2, marginTop: 8 }}>Systems, Processes & Scalability</div>
            </div>

            <div style={{ width: 40, height: 1.5, margin: "0 auto 24px", background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)` }}/>

            <div style={{ padding: "16px 20px", borderRadius: 10, background: "linear-gradient(135deg, rgba(200,162,78,0.06), rgba(200,162,78,0.015))", border: "1px solid rgba(200,162,78,0.2)", marginBottom: 24 }}>
              <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.gold, marginBottom: 6 }}>The Core Principle</div>
              <div style={{ fontSize: 11.5, lineHeight: 1.65, color: C.text2 }}>
                Structural Capital is the "secret sauce" of your business — the systems, processes, technology, and intellectual property that make your company run. It's what converts the knowledge in people's heads into <span style={{ color: ACCENT, fontWeight: 600 }}>company property</span> that can be documented, scaled, and transferred. A business with strong Structural Capital can survive the departure of any individual, scale without proportional cost increases, and be handed to a new operator who can run it from day one. Without it, your business is a collection of habits held together by memory.
              </div>
            </div>

            <div style={{ padding: "12px 18px", borderRadius: 10, background: `${ACCENT}06`, border: `1px solid ${ACCENT}20`, marginBottom: 24 }}>
              <div style={{ fontSize: 11, lineHeight: 1.6, color: C.text2 }}>
                <span style={{ color: ACCENT, fontWeight: 700 }}>Structural Capital has two purposes</span> — first, it takes what exists inside your brain and gets it into a transferable form. Second, it connects people and knowledge so it can be shared to enable your business to scale. Making knowledge company property ensures that when talent walks out the door at night, the knowledge doesn't walk out with them.
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8, marginBottom: 24 }}>
              {DIMS.map(d => {
                const scored = !!scores[d.key]; const sc = scored ? scoreColor(scores[d.key]) : C.text4;
                return (
                  <div key={d.key} style={{ padding: "7px 10px", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", background: scored ? `${sc}12` : `${C.text4}08`, border: `1px solid ${scored ? `${sc}40` : `${C.text4}20`}`, transition: "all 0.3s ease" }}>
                    <span style={{ fontSize: 8, fontWeight: 600, letterSpacing: "0.03em", textTransform: "uppercase", color: scored ? sc : C.text3, textAlign: "center" }}>{d.title}</span>
                  </div>
                );
              })}
            </div>

            <div style={{ textAlign: "center", fontSize: 10, color: C.text3, fontStyle: "italic" }}>Score yourself 1–6 on each of the 10 dimensions. Your results update automatically on the summary page.</div>
          </div>
        </Page>
        <div className="page-gap" style={{ height: 24 }}/>

        {/* ═══ PAGE 2: HOW TO USE ═══ */}
        <Page pageNum={++pageNum} allScored={allScored}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: C.green, marginBottom: 10 }}>HOW TO USE THIS DIAGNOSTIC</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 400, lineHeight: 1.2, marginBottom: 18 }}>
            <span style={{ color: C.gold }}>Your systems are your business.</span> <span style={{ color: C.text1 }}>Everything else is temporary.</span>
          </div>
          <p style={{ fontSize: 12, lineHeight: 1.65, color: C.text2, marginBottom: 10 }}>
            This isn't an IT audit. It's a honest assessment of whether your business runs on systems or on people's memories. A $5M services firm with documented processes, scalable technology, and clean financials is in a fundamentally different position than one with the same revenue built on tribal knowledge, spreadsheet workarounds, and a bookkeeper who's always behind. Both might be profitable — but only one has Structural Capital that enables sustainable growth and commands premium value.
          </p>
          <p style={{ fontSize: 12, lineHeight: 1.65, color: C.text2, marginBottom: 20 }}>
            For each dimension, read the description, review the checklist honestly, and score yourself based on where you truly are — not where you plan to be. The gap between your current score and a 5 or 6 is your blueprint for building a business that runs independently, scales efficiently, and holds its value regardless of who's in the building.
          </p>

          <div style={{ padding: "14px 18px", borderRadius: 10, background: `${C.cyan}08`, border: `1.5px solid ${C.cyan}30`, marginBottom: 16 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: C.cyan, marginBottom: 6 }}>Why 1–6 Instead of 1–5?</div>
            <div style={{ fontSize: 11, lineHeight: 1.6, color: C.text2 }}>
              A 1–5 scale lets you hide at "3" — safe, average, non-committal. Our 1–6 scale has <b style={{ color: C.text1 }}>no middle</b>. You're either below the midpoint (1–3) or above it (4–6). This forces honest self-assessment, which is the only kind that leads to real improvement.
            </div>
          </div>

          <div style={{ padding: "14px 18px", borderRadius: 10, background: `${C.gold}06`, border: `1.5px solid ${C.gold}25`, marginBottom: 16 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: C.gold, marginBottom: 10 }}>What The Top Scores Mean</div>
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ flex: 1, padding: "10px 14px", borderRadius: 8, background: `${C.cyan}08`, border: `1px solid ${C.cyan}20` }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 4 }}>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: C.cyan }}>5</span>
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: C.cyan }}>Best In Class</span>
                </div>
                <div style={{ fontSize: 11, lineHeight: 1.5, color: C.text2 }}>Genuine competitive advantage. Your systems outperform your industry peers — you deliver more consistently, scale more efficiently, and operate more independently than competitors at your size. This area is a strategic asset.</div>
              </div>
              <div style={{ flex: 1, padding: "10px 14px", borderRadius: 8, background: `${C.green}08`, border: `1px solid ${C.green}20` }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 4 }}>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: C.green }}>6</span>
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: C.green }}>Perfect</span>
                </div>
                <div style={{ fontSize: 11, lineHeight: 1.5, color: C.text2 }}>Nothing meaningful left to improve. Most honest operators rarely give themselves this score. If you do, be certain you'd bet your house on it — because it will be tested, whether by rapid growth, a key departure, or a buyer's due diligence team.</div>
              </div>
            </div>
          </div>

          <div style={{ padding: "14px 18px", borderRadius: 10, background: `${C.gold}06`, border: `1px solid ${C.gold}20` }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: C.gold, marginBottom: 6 }}>For Each Dimension</div>
            <div style={{ fontSize: 11, lineHeight: 1.6, color: C.text2 }}>
              Read the description and checklist honestly. Use the checklist as a gut-check — not a scorecard. Then use the <b style={{ color: C.text1 }}>Rate Yourself</b> panel at the bottom to assign your score. All 10 dimensions contribute to your overall Structural Capital score. Your results aggregate automatically.
            </div>
          </div>
        </Page>
        <div className="page-gap" style={{ height: 24 }}/>

        {/* ═══ PAGES 3–12: DIMENSION PAGES ═══ */}
        {DIMS.map((dim) => { pageNum++; return (
          <div key={dim.key}>
            <Page pageNum={pageNum} allScored={allScored}>
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", top: -10, right: -10, fontFamily: "'Cormorant Garamond', serif", fontSize: 140, fontWeight: 700, color: ACCENT, opacity: 0.035, lineHeight: 1, userSelect: "none" }}>{String(dim.num).padStart(2, "0")}</div>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: ACCENT, marginBottom: 4 }}>Dimension {String(dim.num).padStart(2, "0")} of {dim.of}</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.02em", lineHeight: 1.15, marginBottom: 4 }}>{dim.title}</div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: ACCENT, marginBottom: 16 }}>{dim.subtitle}</div>
                <p style={{ fontSize: 12, lineHeight: 1.65, color: C.text2, marginBottom: 18 }}>{dim.description}</p>
                <div style={{ padding: "12px 18px", borderRadius: 10, background: `linear-gradient(135deg, ${ACCENT}08, ${ACCENT}02)`, border: `1px solid ${ACCENT}20`, marginBottom: 8 }}>
                  {dim.checks.map((c, ci) => (
                    <CheckItem key={ci} text={c.text} sub={c.sub} checked={!!checks[`${dim.key}-${ci}`]} onToggle={() => toggleCheck(dim.key, ci)}/>
                  ))}
                </div>
                <ScoreSelector value={scores[dim.key]} onChange={v => setScore(dim.key, v)} lowLabel={dim.lowLabel} highLabel={dim.highLabel}/>
              </div>
            </Page>
            <div className="page-gap" style={{ height: 24 }}/>
          </div>
        ); })}

        {/* ═══ SCORING SUMMARY ═══ */}
        <Page pageNum={++pageNum} allScored={allScored}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: ACCENT, marginBottom: 6 }}>Your Structural Capital Score</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 500, lineHeight: 1.2, marginBottom: 16 }}>
            How strong are the <span style={{ color: ACCENT }}>systems</span> that run your business?
          </div>

          {DIMS.map(d => {
            const sc = scores[d.key]; const barColor = sc ? scoreColor(sc) : C.text4; const pct = sc ? (sc / 6) * 100 : 0;
            return (
              <div key={d.key} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
                <span style={{ fontSize: 9.5, color: C.text2, width: 195, flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.title}</span>
                <div style={{ flex: 1, height: 8, borderRadius: 4, background: `${C.text4}20`, overflow: "hidden" }}>
                  <div style={{ width: `${pct}%`, height: "100%", borderRadius: 4, background: `linear-gradient(180deg, ${barColor}30, ${barColor}15)`, border: `0.5px solid ${barColor}`, boxShadow: sc ? `0 0 8px ${barColor}25, inset 0 1px 0 ${barColor}20` : "none", transition: "all 0.4s ease" }}/>
                </div>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 13, fontWeight: 700, color: sc ? barColor : C.text4, width: 22, textAlign: "right" }}>{sc || "–"}</span>
              </div>
            );
          })}

          <div style={{ padding: "12px 16px", borderRadius: 10, background: `${ACCENT}08`, border: `1.5px solid ${ACCENT}30`, display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, marginBottom: 16 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: ACCENT }}>Total Structural Capital Score</span>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: allScored && gateUnlocked ? (activeBand?.color || ACCENT) : C.text4 }}>
              {totalScore}<span style={{ fontSize: 13, color: C.text3 }}>/{maxScore}</span>
              {allScored && gateUnlocked && <span style={{ fontSize: 13, fontWeight: 600, color: C.text2, marginLeft: 8 }}>({Math.round((totalScore / maxScore) * 100)}%)</span>}
            </span>
          </div>

          {allScored && gateUnlocked && activeBand && (
            <div style={{ padding: "14px 18px", borderRadius: 10, background: `${activeBand.color}08`, border: `1.5px solid ${activeBand.color}30`, marginBottom: 14 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: activeBand.color, marginBottom: 2 }}>{activeBand.label}</div>
              <div style={{ fontSize: 9, color: C.text3, marginBottom: 8 }}>Score Range: {activeBand.range} of 60</div>
              <div style={{ fontSize: 11.5, lineHeight: 1.6, color: C.text2, marginBottom: 10 }}>{activeBand.desc}</div>
              {lowestTwo.length >= 2 && (
                <div style={{ fontSize: 11, color: C.text1, marginBottom: 8 }}>
                  <b>Your biggest opportunities:</b>{" "}
                  <span style={{ color: scoreColor(scores[lowestTwo[0].key]) }}>{lowestTwo[0].title}</span> and{" "}
                  <span style={{ color: scoreColor(scores[lowestTwo[1].key]) }}>{lowestTwo[1].title}</span>.
                </div>
              )}
              <div style={{ fontSize: 11, lineHeight: 1.6, color: C.text2, fontStyle: "italic", marginBottom: 6 }}>
                Every dimension you just scored represents a systems lever — a specific place where improving your Structural Capital can increase both your operational efficiency and your enterprise value. The gaps aren't failures. They're the untapped infrastructure hiding in your business.
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.text1 }}>
                The businesses that command premium growth and premium valuations don't just have good people and happy customers — they have systems that make excellence repeatable, scalable, and transferable.
              </div>
            </div>
          )}

          {allScored && gateUnlocked && <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {BANDS.map(b => {
              const isActive = activeBand?.label === b.label;
              return (
                <div key={b.label} style={{
                  padding: "10px 14px", borderRadius: 10,
                  background: `linear-gradient(135deg, ${b.color}${isActive ? "12" : "06"}, ${b.color}02)`,
                  border: `1px solid ${b.color}${isActive ? "50" : "15"}`,
                  boxShadow: isActive ? `0 0 16px ${b.color}20` : "none",
                  opacity: isActive ? 1 : 0.35,
                  transition: "all 0.5s ease",
                }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: b.color, marginBottom: 2 }}>{b.label}</div>
                  <div style={{ fontSize: 9, color: C.text3 }}>{b.range} points</div>
                </div>
              );
            })}
          </div>}
        </Page>
        <div className="page-gap" style={{ height: 24 }}/>

        {/* EMAIL GATE */}
        {allScored && !gateUnlocked && (
          <EmailGate
            toolName="Structural Capital Deep-Dive"
            toolSlug="structural-capital"
            accentColor={ACCENT}
            scores={scores}
            summary={{ totalScore, maxScore, pct: Math.round((totalScore / maxScore) * 100), band: activeBand?.label }}
            onUnlock={() => setGateUnlocked(true)}
            onGeneratePdf={async () => {
              setGateUnlocked(true);
              await new Promise(r => setTimeout(r, 800));
              const el = toolRef.current;
              if (!el) return null;
              try {
                const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: "#0A0E14", logging: false, windowWidth: 800 });
                const imgData = canvas.toDataURL("image/jpeg", 0.85);
                const imgW = 210;
                const imgH = (canvas.height * imgW) / canvas.width;
                const pdf = new jsPDF("p", "mm", "a4");
                let pos = 0;
                while (pos < imgH) {
                  if (pos > 0) pdf.addPage();
                  pdf.addImage(imgData, "JPEG", 0, -pos, imgW, imgH);
                  pos += 297;
                }
                return pdf.output("datauristring").split(",")[1];
              } catch (err) { console.error("[PDF] Generation failed:", err); return null; }
            }}
          />
        )}

        {/* ═══ YOUR FIRST 3 MOVES (gated) ═══ */}
        {allScored && gateUnlocked && (
          <>
            <Page pageNum={++pageNum} allScored={allScored}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: C.green, marginBottom: 10 }}>Your Personalized Next Steps</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 500, lineHeight: 1.2, marginBottom: 14 }}>Your first three moves.</div>
              <p style={{ fontSize: 12, lineHeight: 1.65, color: C.text2, marginBottom: 20 }}>
                These are your highest-leverage actions — specific to your lowest-scoring dimensions, calibrated to your current level, and executable this week. Not theory. Not someday. This week.
              </p>

              {lowestThree.map((d, i) => {
                const sc = scores[d.key]; const tier = sc <= 2 ? "low" : sc <= 4 ? "mid" : "high"; const tactic = d.quickWins[tier][0];
                return (
                  <div key={d.key} style={{ padding: "14px 18px", borderRadius: 10, background: `${ACCENT}06`, border: `1px solid ${ACCENT}20`, marginBottom: 12 }}>
                    <div style={{ display: "table", padding: "3px 10px", borderRadius: 5, background: `${C.gold}15`, border: `1px solid ${C.gold}30`, marginBottom: 8 }}>
                      <span style={{ display: "table-cell", verticalAlign: "middle", fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: C.gold }}>MOVE {String(i + 1).padStart(2, "0")}</span>
                    </div>
                    <div style={{ fontSize: 10, color: ACCENT, fontWeight: 600, marginBottom: 2 }}>{d.title} <span style={{ color: scoreColor(sc) }}>({sc}/6)</span></div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontWeight: 600, color: C.text1, marginBottom: 4 }}>{tactic.title}</div>
                    <div style={{ fontSize: 10.5, lineHeight: 1.55, color: C.text2 }}>{tactic.context}</div>
                  </div>
                );
              })}

              <div style={{ padding: "14px 18px", borderRadius: 10, background: `${ACCENT}06`, border: `1.5px solid ${ACCENT}25`, marginTop: 16, marginBottom: 16 }}>
                <div style={{ fontSize: 11.5, lineHeight: 1.65, color: C.text2 }}>
                  You can implement these yourself — or our team can see if you qualify for us to help you build systems and processes that turn your business into a <span style={{ color: ACCENT, fontWeight: 700 }}>Masterpiece Business</span> that future buyers fight one another to acquire.
                </div>
              </div>

            </Page>
            <div className="page-gap" style={{ height: 24 }}/>
          </>
        )}

        {/* ═══ CTA PAGE ═══ */}
        <Page pageNum={allScored ? TOTAL_PAGES_WITH_MOVES : TOTAL_PAGES_BASE} allScored={allScored}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: C.gold, marginBottom: 10 }}>What Happens Next</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 500, lineHeight: 1.2, marginBottom: 20 }}>
            Knowing your <span style={{ color: ACCENT }}>Structural Capital</span> score is the beginning, not the end.
          </div>

          <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 18 }}>
            <div style={{ width: 88, height: 88, borderRadius: "50%", flexShrink: 0, overflow: "hidden", outline: `2px solid ${C.gold}40`, outlineOffset: 2, background: C.bgElev }}>
              <img src={HEADSHOT} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}/>
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.text1 }}>Edward Kriczky, <span style={{ color: C.text1 }}>CEPA®</span></div>
              <div style={{ fontSize: 11, color: C.gold, marginBottom: 6 }}>Founder, Kriczky Virtus</div>
              <div style={{ fontSize: 11, lineHeight: 1.6, color: C.text2 }}>
                Most owners build systems reactively — when something breaks, they fix it. The businesses that command premium growth and premium valuations build systems proactively — documenting, automating, and scaling before they need to. That's the gap this assessment reveals. The distance between where you scored and best-in-class isn't a problem — it's a blueprint for building infrastructure that makes your business a Masterpiece. Let's build it together.
              </div>
            </div>
          </div>

          {/* What happens next — timeline */}
          <div style={{ padding: "18px 22px", borderRadius: 12, marginBottom: 18,
            background: `linear-gradient(135deg, ${C.gold}06, ${C.gold}02)`, border: `1.5px solid ${C.gold}25` }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 500, color: C.text1, marginBottom: 16 }}>
              What happens next.
            </div>
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

          <div style={{ padding: "14px 0 14px 18px", borderLeft: `3px solid ${C.gold}60`, marginBottom: 14 }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontStyle: "italic", lineHeight: 1.5, color: C.text1 }}>
              People leave. Markets shift. Technology evolves. But the systems you build today — the documented processes, the scalable architecture, the protected intellectual property — those become the permanent infrastructure of enterprise value. They are what transforms a business from a job that depends on you into an asset that <span style={{ color: C.gold, fontWeight: 700, fontStyle: "normal" }}>works for you.</span>
            </div>
          </div>

          <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${C.text4}60, transparent)`, marginBottom: 14 }}/>

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
