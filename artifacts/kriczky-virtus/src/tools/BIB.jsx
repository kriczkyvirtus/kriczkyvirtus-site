import { useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/* ═══════════════════════════════════════════════════════════════
   BUSINESS INDEPENDENCE BLUEPRINT
   The 4 Capitals That Drive Your Business Value
   Accent: #A78BFA (purple)
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

const ACCENT = C.purple;

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const scoreColor = (n) => {
  if (!n || n <= 0) return C.text4;
  if (n <= 2) return C.red;
  if (n === 3) return C.amber;
  if (n === 4) return C.amberDark;
  if (n === 5) return C.cyan;
  return C.green;
};

const capitalScoreColor = (sub, max) => {
  if (!sub || sub <= 0) return C.text4;
  const pct = (sub / max) * 100;
  if (pct < 34) return C.red;
  if (pct < 50) return C.amber;
  if (pct < 67) return C.amberDark;
  if (pct < 84) return C.cyan;
  return C.green;
};

const CAPITALS = [
  { key: "human", label: "Human Capital", color: C.purple },
  { key: "customer", label: "Customer Capital", color: C.cyan },
  { key: "structural", label: "Structural Capital", color: C.blue },
  { key: "social", label: "Social Capital", color: C.green },
];

const DIMS = [
  // ── HUMAN CAPITAL ──
  {
    key: "h1", capitalIdx: 0, num: 1, of: 12,
    title: "Talent Depth & Retention",
    subtitle: "Do you have A-players, and can you keep them?",
    description: "First who, then what. A buyer isn't acquiring your desks and laptops — they're acquiring the people sitting behind them. Businesses with deep benches of capable, motivated talent command premium multiples because the acquirer knows the engine won't stall on day one. The question isn't just whether you have good people — it's whether you can keep them when competitors come calling, and whether they'd stay if you weren't there.",
    checks: [
      { text: "We have documented roles, responsibilities, and performance expectations for every position.", sub: "Can a new hire know exactly what success looks like within their first week?" },
      { text: "Key positions have at least one capable backup or cross-trained team member.", sub: "If your top performer left tomorrow, how long until the wheels come off?" },
      { text: "We have a structured compensation and retention strategy that goes beyond salary.", sub: "Benefits, upside incentives, career development and growth paths defined, culture — what keeps A-players from taking recruiters' calls?" },
      { text: "Turnover in critical roles is below 15% annually.", sub: "High turnover in key seats destroys institutional knowledge and client confidence." },
    ],
    lowLabel: "High turnover, thin bench",
    highLabel: "Deep, loyal talent",
    quickWins: {
      low: [
        { title: "Run a flight-risk audit on your top 5 people this week", context: "List your five most critical employees. For each, answer: do they have a reason to stay beyond a paycheck? If not, you're one LinkedIn message from crisis." },
        { title: "Create a one-page role charter for every key position", context: "Document the core responsibilities, decision authority, and success metrics. This alone makes the role transferable and the person replaceable." },
        { title: "Schedule stay interviews with your top performers", context: "Don't wait for the exit interview to learn why they're leaving. Ask now: what keeps you here, and what might pull you away?" },
      ],
      mid: [
        { title: "Build a formal cross-training matrix", context: "Map every critical function to a primary and secondary person. Eliminate single points of failure systematically." },
        { title: "Implement a 90-day onboarding playbook", context: "Structured onboarding reduces early turnover by 50% and gets new hires productive three times faster." },
        { title: "Create a total rewards statement for each employee", context: "Most employees underestimate their total compensation by 30%. Show them the full picture — it's your cheapest retention tool." },
      ],
      high: [
        { title: "Introduce equity or profit-sharing for key players", context: "Nothing aligns interests like ownership. Even phantom equity creates the psychology of a co-builder, not an employee." },
        { title: "Benchmark your compensation against top-quartile market data", context: "You're competing for talent against companies paying top dollar. Know where you stand and close any gaps proactively." },
      ],
    },
  },
  {
    key: "h2", capitalIdx: 0, num: 2, of: 12,
    title: "Leadership Pipeline",
    subtitle: "Is there a next generation of leaders ready, or is it just you?",
    description: "The most valuable companies aren't run by one genius at the top — they're run by a team that operates with leadership distributed at every level. A buyer looks at a company with one leader and sees a liability. They look at a company with five leaders and see a scalable platform. The leadership pipeline isn't just about succession — it's about operational leverage. Every decision that requires you is a bottleneck that suppresses your multiple.",
    checks: [
      { text: "At least two people besides the owner can make significant operational decisions.", sub: "Can your company approve a $10K expense, hire a contractor, or resolve a client issue without you?" },
      { text: "There is a formal or informal leadership development program in place.", sub: "This doesn't need to be fancy to start — even quarterly mentoring sessions and stretch assignments count." },
      { text: "We have identified succession candidates for all C-suite or director-level roles.", sub: "Named candidates with development plans, not vague hopes that 'someone will step up.'" },
    ],
    lowLabel: "Solo leader, no pipeline",
    highLabel: "Leadership at every level",
    quickWins: {
      low: [
        { title: "Delegate three recurring decisions to your strongest manager this month", context: "Start with decisions you make on autopilot. Your team can't develop leadership muscles you won't let them use." },
        { title: "Identify your top two future leaders and tell them", context: "Name them out loud. Give them a stretch project. People rise to the expectations you set — but only if you set them." },
        { title: "Create a decision-rights matrix for your leadership team", context: "Document who can decide what, up to what dollar threshold. Remove yourself from decisions below $5K." },
      ],
      mid: [
        { title: "Implement a quarterly leadership development cadence", context: "Book recommendations, case study discussions, cross-functional project leads — build the muscle systematically, not accidentally." },
        { title: "Have each manager present their department's quarterly plan", context: "The presentation forces strategic thinking. Their comfort level tells you exactly where the pipeline gaps are." },
        { title: "Shadow-test your succession plan by taking a two-week vacation", context: "Don't check email. Let the team run. The breakdowns reveal exactly where the pipeline is weakest." },
      ],
      high: [
        { title: "Give your top leader P&L responsibility for a business unit", context: "True leadership readiness is proven by managing a budget, not just people. This is the final exam before succession." },
        { title: "Bring your successor into board or advisory conversations", context: "Exposure to strategic-level discussions accelerates development faster than any training program." },
      ],
    },
  },
  {
    key: "h3", capitalIdx: 0, num: 3, of: 12,
    title: "Execution Independence",
    subtitle: "Can your team deliver results without you directing every step?",
    description: "There's a difference between a team that performs well while you're watching and a team that performs well while you're on a beach. Execution independence means your people don't just follow instructions — they own outcomes. They troubleshoot without escalating, they prioritize without guidance, and they deliver without reminders. This is the ultimate test of human capital: does the machine run without the machinist?",
    checks: [
      { text: "Major projects have been completed successfully without the owner's direct involvement.", sub: "Not just maintenance work — real initiatives with deadlines, deliverables, and decisions." },
      { text: "Team members proactively solve problems rather than escalating everything to the owner.", sub: "Do people come to you with solutions, or just problems?" },
      { text: "The business has maintained or improved performance during the owner's extended absence.", sub: "A vacation is the cheapest due diligence test a buyer could ask for." },
      { text: "Clear KPIs and accountability structures exist at every level of the organization.", sub: "People can't own outcomes they can't measure. Scoreboards create ownership." },
    ],
    lowLabel: "Owner directs everything",
    highLabel: "Self-managing teams",
    quickWins: {
      low: [
        { title: "Track every interruption for one week and categorize them", context: "You'll find 80% of interruptions are decisions your team could have made with clearer guidelines. That's your roadmap." },
        { title: "Create an 'If-Then' decision guide for your top 10 recurring decisions", context: "If the client asks for X, then do Y. If a vendor misses a deadline, then take Z action. Codify your instincts." },
        { title: "Assign one project entirely to a team lead with zero owner involvement", context: "Pick something low-risk. Let them succeed or stumble. Both outcomes build capability." },
      ],
      mid: [
        { title: "Implement weekly team scorecards with three lead indicators", context: "Lead indicators predict outcomes before they happen. When the team tracks them, they self-correct without you." },
        { title: "Establish a formal escalation policy with clear thresholds", context: "Define what requires your input and what doesn't. Most owners are surprised how few decisions actually need them." },
        { title: "Run a quarterly 'owner absence' drill — one full week, no contact", context: "Treat it like a fire drill. Document what broke, fix the systems, and do it again next quarter." },
      ],
      high: [
        { title: "Transition from managing execution to reviewing outcomes monthly", context: "The shift from directing to auditing is the final step. You become the board, not the CEO." },
        { title: "Have your team present monthly results to an advisory board or peer group", context: "External accountability raises the bar and proves to future buyers that the team can stand on its own." },
      ],
    },
  },
  // ── CUSTOMER CAPITAL ──
  {
    key: "c1", capitalIdx: 1, num: 4, of: 12,
    title: "Relationship Depth & Transferability",
    subtitle: "Are client relationships institutional or personal?",
    description: "Every business owner says their client relationships are their greatest asset. Buyers see it differently: if every relationship lives in your head, your Rolodex, and your personal rapport — it's not an asset, it's a liability. Transferable relationships are ones where the client trusts the company, not just the founder. They interact with multiple team members, they have contractual commitments, and they'd stay even if you walked away tomorrow.",
    checks: [
      { text: "Key client relationships involve at least two team members beyond the owner.", sub: "If your biggest client's primary contact is you, a buyer sees concentration risk, not an asset." },
      { text: "Client history, preferences, and communication records are in a CRM, not someone's head.", sub: "Institutional memory must be institutional — not walking out the door at 5pm." },
      { text: "Clients have been successfully transitioned between account managers without attrition.", sub: "The proof is in the handoff. If you've never tested it, you don't know if it works." },
    ],
    lowLabel: "All relationships personal",
    highLabel: "Fully transferable",
    quickWins: {
      low: [
        { title: "Introduce a second point of contact to your top 10 clients this month", context: "Frame it as 'expanding our team's support for you.' Start the transition before a buyer forces it under pressure." },
        { title: "Migrate all client notes and history into a shared CRM within 30 days", context: "It doesn't matter which CRM. What matters is that client intelligence becomes company property, not personal knowledge." },
        { title: "Create a client relationship map showing every touchpoint by person", context: "Visualize who knows whom. The gaps will terrify you — and that's the point. Fix them while you have time." },
      ],
      mid: [
        { title: "Assign relationship 'co-owners' to every top-20 client", context: "Each client should have a primary and secondary contact. The secondary attends every other meeting." },
        { title: "Build a quarterly business review template and have your team deliver it", context: "Structured reviews shift the relationship from personal to professional. The client starts trusting the process, not the person." },
        { title: "Test a relationship handoff by transitioning one mid-tier client entirely", context: "Pick a client where the stakes are manageable. Learn what breaks in the handoff so you can fix it before it matters." },
      ],
      high: [
        { title: "Survey your top 20 clients on their satisfaction with your team (not you)", context: "The answers tell you exactly how transferable the relationship really is. If they only praise you, there's more work to do." },
        { title: "Have your team lead all client renewals and upsell conversations", context: "Revenue conversations are the last thing owners let go of. When your team closes renewals, transferability is proven." },
      ],
    },
  },
  {
    key: "c2", capitalIdx: 1, num: 5, of: 12,
    title: "Revenue Quality & Concentration",
    subtitle: "Is your revenue recurring, diversified, and contractual?",
    description: "Not all revenue is created equal. A dollar of recurring, contracted revenue from a diversified client base could be worth 3–5x more than a dollar of project-based, concentrated revenue. Buyers pay premiums for predictability. If one client accounts for more than 25% of your revenue, it's often a deal killer — or at minimum, a massive discount to your multiple. The quality of your revenue stream is the single most scrutinized element in any acquisition.",
    checks: [
      { text: "No single client accounts for more than 15% of total revenue.", sub: "Customer concentration above 25% can kill a deal outright. Even 15–25% triggers material discount." },
      { text: "At least 50% of revenue is recurring or contractual (not project-based).", sub: "Monthly retainers, annual contracts, subscription models — predictable revenue commands premium multiples." },
      { text: "Revenue has grown consistently for the past three years without depending on a single large win.", sub: "Organic, diversified growth signals a healthy customer acquisition engine, not lucky timing." },
      { text: "Client contracts include terms that survive ownership change (no 'key-man' cancellation clauses).", sub: "If contracts let clients walk when the owner leaves, you're selling a relationship, not a business." },
    ],
    lowLabel: "Concentrated, project-based",
    highLabel: "Diversified, recurring",
    quickWins: {
      low: [
        { title: "Calculate your exact client concentration ratio today", context: "List every client's percentage of total revenue. If any single name exceeds 15%, that's your highest-priority business development problem." },
        { title: "Convert your largest project-based client to a retainer this quarter", context: "Even a partial retainer — a monthly minimum with project fees on top — transforms revenue quality overnight." },
        { title: "Audit every client contract for key-man or change-of-control clauses", context: "If clients can cancel when ownership changes, your contracts are worth less than the paper they're printed on." },
      ],
      mid: [
        { title: "Set a target of 60% recurring revenue within 12 months", context: "Build a migration plan: which clients can shift to retainers, subscriptions, or annual contracts? Prioritize by size." },
        { title: "Implement a 'new logo' acquisition goal separate from expansion revenue", context: "Diversification requires net-new clients. Track new logo acquisition as its own KPI with dedicated resources." },
        { title: "Renegotiate contracts to remove key-person cancellation rights", context: "Offer a small concession in exchange for removing the clause. It's the cheapest multiple-enhancing move you can make." },
      ],
      high: [
        { title: "Model your revenue at 70%+ recurring and stress-test the economics", context: "What happens if you lose your top three clients simultaneously? Recurring revenue should make that survivable." },
        { title: "Introduce multi-year contracts with built-in escalators", context: "Longer terms with price increases create a revenue floor that buyers value enormously in their financial models." },
      ],
    },
  },
  {
    key: "c3", capitalIdx: 1, num: 6, of: 12,
    title: "Customer Loyalty & Retention",
    subtitle: "Do customers stay because they want to, or because they haven't left yet?",
    description: "Retention and loyalty aren't the same thing. Retention means they haven't cancelled. Loyalty means they wouldn't consider it. Loyal customers expand their spend, refer new business, and defend you against competitors. They're indifferent to price pressure because you've become integral to their operations. This is the moat that acquirers dream about — a customer base so embedded that switching costs make competition irrelevant.",
    checks: [
      { text: "Annual customer retention rate exceeds 85%.", sub: "Below 85% means you're constantly backfilling. Above 90% means you're building on a solid foundation." },
      { text: "We regularly receive unprompted referrals from existing clients.", sub: "Referrals are the highest-quality signal of loyalty — they're putting their reputation behind your brand." },
      { text: "Net revenue retention (including expansions) exceeds 100%.", sub: "Your existing clients spend more each year than the year before, even accounting for churn." },
    ],
    lowLabel: "High churn, price-sensitive",
    highLabel: "Deep loyalty, expanding",
    quickWins: {
      low: [
        { title: "Call every client who left in the past 12 months and ask why", context: "Most churned clients will tell you exactly what went wrong. The patterns will reveal systemic issues you can fix." },
        { title: "Implement a 'save' protocol triggered at the first sign of disengagement", context: "Declining usage, missed meetings, late payments — these are early warning signals. Catch them before the cancellation email." },
        { title: "Create a formal referral program with meaningful incentives", context: "Loyal clients want to refer you. Make it easy, make it rewarding, and make it visible." },
      ],
      mid: [
        { title: "Build a customer health score that flags at-risk accounts monthly", context: "Combine engagement metrics, NPS, support tickets, and payment history into a single dashboard. Act on red flags weekly." },
        { title: "Launch a quarterly 'value delivered' report for your top 20 clients", context: "Remind clients what you've done for them. It's harder to cancel when the ROI is staring them in the face." },
        { title: "Develop an upsell playbook based on common client expansion paths", context: "Map the journey from entry product to full suite. Train your team to recognize expansion signals and act on them." },
      ],
      high: [
        { title: "Formalize your client advisory board with quarterly strategic input sessions", context: "Your best clients become co-creators. This deepens loyalty beyond service delivery into strategic partnership." },
        { title: "Track and publish your net revenue retention rate as a company KPI", context: "Above 110% NRR puts you in elite company. It tells acquirers your existing base is a growth engine, not just maintenance." },
      ],
    },
  },
  // ── STRUCTURAL CAPITAL ──
  {
    key: "s1", capitalIdx: 2, num: 7, of: 12,
    title: "Documented Systems & Processes",
    subtitle: "Is the \"secret sauce\" written down or trapped in people's heads?",
    description: "Structural capital takes what exists inside your brain and gets it into a transferable form. It converts best practices into company property that can be sold. The most common reason buyers discount a business is undocumented tribal knowledge — the critical processes that exist only in the heads of two or three people. If your 'secret sauce' isn't written down, it's not company property — it's a vulnerability. Documentation transforms institutional knowledge into an acquirable asset.",
    checks: [
      { text: "Core operational processes are documented in SOPs that any competent new hire could follow.", sub: "Not 'we have a general idea' — real, step-by-step documentation that survives personnel changes." },
      { text: "Onboarding a new employee to a core function takes weeks, not months.", sub: "Speed of onboarding is a direct measure of how well-documented your systems are." },
      { text: "Process documentation is updated at least annually and version-controlled.", sub: "Outdated SOPs are worse than none — they create false confidence." },
      { text: "Quality control checkpoints are built into key workflows, not dependent on individual judgment.", sub: "When quality is systematic, it's scalable. When it's personal, it's fragile." },
    ],
    lowLabel: "Tribal knowledge only",
    highLabel: "Fully documented, scalable",
    quickWins: {
      low: [
        { title: "Record a screen-share video of your top 3 critical processes this week", context: "Video is the fastest path to documentation. Have the person who does it best narrate while they work. Edit later." },
        { title: "Assign 'process ownership' to one person per critical function", context: "If nobody owns the documentation, nobody updates it. Ownership creates accountability." },
        { title: "List your top 10 processes and rank them by 'bus factor' risk", context: "Bus factor = how many people need to get hit by a bus for this process to break. Anything at 1 is a documentation emergency." },
      ],
      mid: [
        { title: "Implement a quarterly SOP review cycle with version control", context: "Assign each SOP an owner and a review date. Track changes in a shared system. Dead documentation is worse than none." },
        { title: "Build a new-hire onboarding checklist that references all core SOPs", context: "The onboarding experience is your documentation test. If a new hire can get productive in two weeks, your systems work." },
        { title: "Create quality checklists for your top 5 revenue-generating activities", context: "Built-in checkpoints catch errors before they reach clients. Systematic quality is scalable quality." },
      ],
      high: [
        { title: "Have an outside consultant audit your documentation for acquisition-readiness", context: "Fresh eyes will find the gaps your team has learned to work around. This is exactly what a buyer's due diligence team will do." },
        { title: "Benchmark your onboarding speed against industry best practices", context: "If industry standard is 4 weeks and yours is 2, that's a competitive advantage worth featuring in a CIM." },
      ],
    },
  },
  {
    key: "s2", capitalIdx: 2, num: 8, of: 12,
    title: "Technology & Infrastructure",
    subtitle: "Does your tech stack enable scale or create bottlenecks?",
    description: "Technology should be a force multiplier, not a fragile dependency. Buyers evaluate whether your systems can handle 2–3x volume without breaking, whether your data is clean and accessible, and whether your tech stack is modern enough to integrate with theirs. Legacy systems, manual workarounds, and spreadsheet-driven operations signal that scaling will require significant reinvestment — and that suppresses the valuation of your business because it adds risk for the buyer.",
    checks: [
      { text: "Core business data lives in integrated systems, not spreadsheets or personal files.", sub: "If your P&L depends on a spreadsheet that one person maintains, a buyer sees a liability, not an asset." },
      { text: "Systems could handle 2–3x current volume without significant additional investment.", sub: "Scalability is the difference between a platform and a project." },
      { text: "Business-critical systems have documented backup, disaster recovery, and security protocols.", sub: "A ransomware attack shouldn't be an existential event." },
    ],
    lowLabel: "Manual, fragile systems",
    highLabel: "Scalable, integrated tech",
    quickWins: {
      low: [
        { title: "Map every spreadsheet that drives a business decision and flag migration priorities", context: "Spreadsheets are where data goes to die. Identify which ones are actually running your business and plan their replacement." },
        { title: "Implement automated backups for all business-critical data within 14 days", context: "This is table stakes. If you can't recover from data loss, nothing else matters. Cloud backup costs less than dinner." },
        { title: "Audit your tech stack for single points of failure", context: "If one system goes down, which processes stop? That's your vulnerability map." },
      ],
      mid: [
        { title: "Consolidate your core operations into an integrated platform", context: "ERP, CRM, and financial systems should talk to each other. Manual data transfer between systems is friction that compounds at scale." },
        { title: "Document your technology architecture in a single-page diagram", context: "Buyers want to see how your systems connect. If you can't draw it, you can't explain it — and they'll assume the worst." },
        { title: "Implement role-based access controls across all systems", context: "Security hygiene signals operational maturity. It also prevents the 'disgruntled employee with admin access' nightmare scenario." },
      ],
      high: [
        { title: "Conduct a scalability stress test for your top 3 systems", context: "Simulate 3x volume and document what breaks. Fix it before a buyer's technical due diligence team finds it." },
        { title: "Build a technology roadmap showing planned investments over 24 months", context: "Proactive tech planning signals to buyers that the infrastructure has runway, not just current capacity." },
      ],
    },
  },
  {
    key: "s3", capitalIdx: 2, num: 9, of: 12,
    title: "Intellectual Property & Competitive Moat",
    subtitle: "Do you own anything proprietary that a buyer would pay a premium for?",
    description: "Intellectual property isn't just patents and trademarks — it's any proprietary advantage that can't be easily replicated. Proprietary methodologies, proprietary data sets, exclusive supplier relationships, trade secrets, specialized training curricula, unique service delivery models — anything that makes your company genuinely difficult to compete with. The stronger the moat, the more defensible the earnings, and the higher the multiple a buyer will assign.",
    checks: [
      { text: "We have at least one proprietary methodology, product, or process that competitors cannot easily replicate.", sub: "Not just 'we do it better' — genuinely differentiated in a way that creates switching costs." },
      { text: "Intellectual property is formally documented and legally protected where applicable.", sub: "Trade secrets should be documented with restricted access. Trademarks should be registered. Methods should be named." },
      { text: "Our competitive advantage would survive the departure of any single individual.", sub: "If the moat lives in one person's expertise, it's not a moat — it's a dependency." },
    ],
    lowLabel: "Commodity, easily replicated",
    highLabel: "Strong moat, proprietary",
    quickWins: {
      low: [
        { title: "Identify and name your proprietary methodology this week", context: "Every business has a 'way they do things.' Name it. Document it. A named method feels proprietary even before you formalize it." },
        { title: "Audit what you know that competitors don't — and write it down", context: "Proprietary data, client insights, industry benchmarks, supplier relationships — these are IP assets hiding in plain sight." },
        { title: "File a trademark application for your company name and core offering names", context: "Basic trademark protection costs a few hundred dollars and immediately signals ownership to buyers." },
      ],
      mid: [
        { title: "Package your methodology into a licensable or teachable framework", context: "A named, structured methodology (with a certification, training module, or toolkit) transforms tacit knowledge into a sellable asset." },
        { title: "Implement non-disclosure and IP assignment agreements for all employees", context: "Without NDA and IP assignment clauses, your employees' innovations belong to them, not you. Fix this immediately." },
        { title: "Build a competitive moat analysis showing why clients can't switch easily", context: "Integration depth, proprietary data formats, workflow embedding — document the switching costs that keep clients loyal." },
      ],
      high: [
        { title: "Engage an IP attorney to conduct a formal intellectual property audit", context: "Identify everything protectable and prioritize filings. Buyers' attorneys will do this anyway — be ready with a clean IP portfolio." },
        { title: "Quantify the revenue protected by your IP moat", context: "What percentage of revenue depends on proprietary advantages? This number belongs in your CIM and directly influences your multiple." },
      ],
    },
  },
  // ── SOCIAL CAPITAL ──
  {
    key: "o1", capitalIdx: 3, num: 10, of: 12,
    title: "Culture & Brand Identity",
    subtitle: "Do people feel something when they interact with your company?",
    description: "Social capital is the 'vibe' — and it's the greatest predictor of sustainable success. Great companies like Apple, Google, and every local legend in your market have something in common: you feel it as soon as you walk on the property. Culture isn't ping-pong tables and free lunch. It's the core values, the shared purpose, the way your team shows up when things get hard. Brand identity is the external expression of that internal reality. Together, they create a premium that shows up directly in your multiple.",
    checks: [
      { text: "Employees can clearly articulate the company's mission and values without reading a wall poster.", sub: "If your team can't say why you exist in their own words, the culture is performative, not lived." },
      { text: "Your brand has a distinct visual identity, voice, and market position that clients recognize.", sub: "Commodity brands get commodity multiples. Distinct brands command premiums." },
      { text: "New hires consistently comment on the positive culture during their first 90 days.", sub: "The onboarding experience is where culture is most visible — and most fragile." },
    ],
    lowLabel: "No clear identity",
    highLabel: "Magnetic culture & brand",
    quickWins: {
      low: [
        { title: "Ask five team members to describe the company culture in three words — compare answers", context: "If you get five different answers, you don't have a culture — you have a collection of individual experiences. Alignment starts with awareness." },
        { title: "Write a one-page 'brand manifesto' that defines who you are and who you're for", context: "Not a mission statement for the wall. A real document that guides hiring, marketing, and client selection decisions." },
        { title: "Audit your visual brand for consistency across all touchpoints", context: "Website, proposals, email signatures, social media — inconsistency signals a company that doesn't take its own identity seriously." },
      ],
      mid: [
        { title: "Run an anonymous culture survey and actually publish the results to the team", context: "Transparency about where culture is strong and weak creates trust. Hiding the results destroys it." },
        { title: "Create a 'culture onboarding' module separate from role-specific training", context: "Teach new hires how you operate, communicate, and make decisions. Culture is a system, not osmosis." },
        { title: "Document your brand guidelines and ensure every client-facing material follows them", context: "Visual consistency is the easiest win. It signals professionalism to clients and operational maturity to buyers." },
      ],
      high: [
        { title: "Invest in professional brand storytelling across your marketing channels", context: "The companies that command premium multiples tell stories, not just sell services. Your culture is your most compelling narrative." },
        { title: "Measure culture with an annual engagement score and track it as a company KPI", context: "What gets measured gets managed. Engagement scores above 80% correlate directly with higher retention and performance." },
      ],
    },
  },
  {
    key: "o2", capitalIdx: 3, num: 11, of: 12,
    title: "Internal Alignment & Communication",
    subtitle: "Does the team operate in rhythm or in silos?",
    description: "Alignment is the social operating system of your business — the way the organization coordinates effort, resolves conflict, and moves in a common direction. When alignment is strong, your team executes with the precision of a crew team: everyone pulling at the same cadence, toward the same destination. When it's weak, departments become competing tribes, communication becomes political, and the owner becomes the referee for every cross-functional dispute.",
    checks: [
      { text: "Regular cross-functional meetings or huddles keep all departments synchronized.", sub: "Weekly stand-ups, department syncs, 90-day execution sprints — rhythm creates coordination." },
      { text: "Strategic goals cascade clearly from company level to department level to individual level.", sub: "Every person should be able to connect their daily work to the company's top three priorities." },
      { text: "Conflict between departments is resolved through process, not escalation to the owner.", sub: "If every disagreement lands on your desk, alignment is a fiction." },
      { text: "Information flows freely — no department hoards knowledge or operates in isolation.", sub: "Silos are the enemy of enterprise value. Buyers see silos and price in integration risk." },
    ],
    lowLabel: "Siloed, chaotic",
    highLabel: "Aligned, synchronized",
    quickWins: {
      low: [
        { title: "Implement a 15-minute daily huddle with all department leads", context: "One question each: what's your top priority today, and what's blocking you? Alignment starts with visibility." },
        { title: "Create a one-page strategic plan visible to every employee", context: "Three priorities. Three metrics. One page. If people can't see the target, they can't aim at it." },
        { title: "Map your current communication flows and identify where information gets stuck", context: "Draw the org chart, then draw the actual information flow. The gaps between them are your alignment failures." },
      ],
      mid: [
        { title: "Implement a quarterly planning cadence with cross-functional input", context: "Each quarter: review results, set priorities, assign owners. The cadence itself creates alignment even before the content does." },
        { title: "Create a shared dashboard showing company-wide KPIs visible to all teams", context: "When everyone sees the same numbers, conversations shift from 'I think' to 'the data says.' Shared visibility drives shared accountability." },
        { title: "Establish a cross-functional escalation process that doesn't involve the owner", context: "Define the decision framework, designate a tie-breaker, and remove yourself from the loop. Alignment means self-resolution." },
      ],
      high: [
        { title: "Run a quarterly 'alignment audit' where each department presents their priorities to all others", context: "Misalignment hides in assumptions. When departments present to each other, contradictions surface immediately." },
        { title: "Implement a formal operating rhythm document that governs meetings, reporting, and decision cadence", context: "The best companies run on rhythm, not heroics. Codify yours into a document a buyer could hand to a new GM." },
      ],
    },
  },
  {
    key: "o3", capitalIdx: 3, num: 12, of: 12,
    title: "Reputation & Market Position",
    subtitle: "Are you known as the best at what you do in your market?",
    description: "Market position isn't just about revenue — it's about perception. Are you the company that clients seek out, or the one they find by accident? Are you the premium option, or the budget alternative? Reputation compounds over decades and can be destroyed in a day. A strong market position with a reputation for excellence creates a gravitational pull: talent wants to work there, clients want to buy from there, and acquirers want to own it. That gravity is worth a multiple premium.",
    checks: [
      { text: "We are recognized as a top-tier provider in our market or niche.", sub: "Not self-proclaimed — recognized by clients, industry peers, or objective rankings." },
      { text: "Inbound leads represent a significant portion of new business (vs. 100% outbound hustle).", sub: "Inbound demand is the market telling you your reputation is working. Outbound-only signals a brand awareness gap." },
      { text: "We have meaningful industry recognition: awards, media coverage, and client testimonials.", sub: "Third-party validation is exponentially more powerful than self-promotion." },
    ],
    lowLabel: "Unknown, undifferentiated",
    highLabel: "Market leader, sought-after",
    quickWins: {
      low: [
        { title: "Claim and optimize all business directory profiles within 48 hours", context: "Google Business, industry directories, review platforms — these are where buyers and clients form first impressions." },
        { title: "Publish one case study from your best client outcome this month", context: "Specific results for a specific client. Names, numbers, outcomes. One great case study outweighs a hundred testimonials." },
        { title: "Identify the top 3 industry events or publications and submit a speaking or writing proposal", context: "Visibility creates reputation. You don't need to be famous — you need to be visible to the right 500 people." },
      ],
      mid: [
        { title: "Build a systematic online review generation program", context: "Ask every satisfied client to leave a review at the point of maximum delight. Volume of recent reviews drives visibility and credibility." },
        { title: "Create a quarterly thought leadership calendar with content across owned channels", context: "Blog, LinkedIn, podcast, newsletter — consistent publishing builds authority. Sporadic posting builds nothing." },
        { title: "Apply for three industry awards relevant to your market this quarter", context: "Award submissions force you to articulate your results. Wins provide third-party validation that buyers respect." },
      ],
      high: [
        { title: "Commission an independent market perception study in your primary market", context: "How do prospects, clients, and competitors actually perceive you? The gap between your self-image and market image is your brand opportunity." },
        { title: "Track share of voice in your market and set a goal to increase it by 25%", context: "Share of voice predicts share of market. Measure it, set targets, and invest in closing the gap." },
      ],
    },
  },
];

const BANDS = [
  { label: "Capital Deficit", range: "12–24", min: 12, max: 24, desc: "Your intangible assets are severely underdeveloped. Buyers would see significant risk, heavy owner-dependency, and limited transferable value. The gap between your current enterprise value and your potential is likely enormous — but so is the opportunity.", color: C.red },
  { label: "Capital Emerging", range: "25–42", min: 25, max: 42, desc: "You've built some intangible capital, but it's inconsistent across the four areas. Certain capitals are dragging the others down. Focused improvement in your weakest capital will create disproportionate value gains.", color: C.amber },
  { label: "Capital Established", range: "43–58", min: 43, max: 58, desc: "Your intangible capital base is solid. You've built real value in most areas, and a buyer would see a business with genuine transferable assets. The work now is optimizing — turning established capital into best-in-class capital.", color: C.cyan },
  { label: "Capital Masterpiece", range: "59–72", min: 59, max: 72, desc: "This is rare. Your business has best-in-class intangible capital across all four dimensions. You've built a company that operates independently, retains clients and talent, owns proprietary advantages, and runs on a culture buyers dream about. This is the $41M premium zone.", color: C.green },
];

const TOTAL_PAGES_BASE = 16; // cover + howto + 12 dims + summary + CTA
const TOTAL_PAGES_WITH_MOVES = 17;

// ── COMPONENTS ──

const Page = ({ children, pageNum, allScored }) => {
  const tp = allScored ? TOTAL_PAGES_WITH_MOVES : TOTAL_PAGES_BASE;
  return (
    <div style={{
      width: "8.5in", minHeight: "11in", position: "relative", overflow: "hidden",
      background: "linear-gradient(180deg, #0A0E14 0%, #0D1119 30%, #0E131C 50%, #0D1119 70%, #0A0E14 100%)",
      fontFamily: "'DM Sans', sans-serif", color: C.text1, boxSizing: "border-box",
      pageBreakAfter: "always", breakAfter: "page",
    }}>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1, opacity: 0.05,
        mixBlendMode: "overlay", backgroundImage: GRAIN, backgroundSize: "128px 128px" }}/>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, zIndex: 5,
        background: "linear-gradient(90deg, transparent 3%, #A78BFA30 15%, #A78BFA 35%, #D4B665 50%, #A78BFA 65%, #A78BFA30 85%, transparent 97%)" }}/>
      <div style={{ position: "absolute", top: "0.88in", bottom: "0.68in", left: "0.44in", width: 0.5,
        background: "linear-gradient(180deg, transparent, #C8A24E20, #C8A24E20, transparent)", zIndex: 2 }}/>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, padding: "0.4in 0.6in 0.18in",
        display: "flex", justifyContent: "space-between", alignItems: "baseline",
        fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", color: C.text3, fontWeight: 500, zIndex: 5 }}>
        <span>Kriczky Virtus</span>
        <span><b style={{ color: ACCENT, fontWeight: 600 }}>Business Independence Blueprint</b> — What Drives Business Valuation?</span>
      </div>
      <div style={{ position: "absolute", top: "0.68in", left: "0.65in", right: "0.65in", height: 0.5,
        background: "linear-gradient(90deg, transparent, #A78BFA40, transparent)", zIndex: 5 }}/>
      <div style={{ padding: "0.85in 0.6in 0.75in", position: "relative", zIndex: 3 }}>
        {children}
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 0.6in 0.4in",
        display: "flex", justifyContent: "space-between", alignItems: "baseline", color: C.text3, zIndex: 5 }}>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          <b style={{ color: C.gold, fontWeight: 600 }}>Kriczky</b> Virtus
        </span>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 13, color: C.text2 }}>
          {pageNum} <span style={{ color: C.text4 }}>/</span> {tp}
        </span>
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1,
        background: "linear-gradient(90deg, transparent, #C8A24E20, #C8A24E40, #C8A24E20, transparent)" }}/>
    </div>
  );
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

const CheckItem = ({ text, sub, checked, onToggle }) => (
  <div style={{ display: "flex", gap: 12, padding: "8px 0", cursor: "pointer", userSelect: "none", alignItems: "center" }}
    onClick={onToggle}>
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
      background: value
        ? `linear-gradient(145deg, ${activeColor}08, ${activeColor}03)`
        : "linear-gradient(145deg, rgba(200,162,78,0.06), rgba(200,162,78,0.02))",
      border: `1.5px solid ${value ? `${activeColor}50` : `${C.gold}30`}`,
      boxShadow: value ? `0 0 20px ${activeColor}15, inset 0 1px 0 ${activeColor}15` : "none",
      transition: "all 0.3s ease",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: value ? activeColor : C.gold }}>Rate Yourself</span>
        {value ? (
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: activeColor }}>
            {value}<span style={{ fontSize: 12, color: C.text3 }}>/6</span>
          </span>
        ) : (
          <span style={{ fontSize: 10, color: C.text3, fontStyle: "italic" }}>TAP A NUMBER</span>
        )}
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        {[1,2,3,4,5,6].map(n => {
          const sc = scoreColor(n);
          const active = value === n;
          return (
            <div key={n} onClick={() => onChange(n)} style={{
              flex: 1, height: 40, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", transition: "all 0.2s ease",
              background: active ? `${sc}22` : `${sc}08`,
              border: `1.5px solid ${active ? sc : `${sc}30`}`,
              boxShadow: active ? `0 0 12px ${sc}30` : "none",
            }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700,
                color: active ? sc : `${sc}80` }}>{n}</span>
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
        <span style={{ fontSize: 9, color: C.text3, textTransform: "uppercase", letterSpacing: "0.04em" }}>{lowLabel}</span>
        <span style={{ fontSize: 9, color: C.text3, textTransform: "uppercase", letterSpacing: "0.04em" }}>{highLabel}</span>
      </div>
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

// ── MAIN APP ──


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
        const res = await fetch("/api/store-results", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: _name, email: _email, tool: "business-independence-blueprint", html: document.documentElement.outerHTML }) });
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

export default function BusinessIndependenceBlueprint() {
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
  const toggleCheck = (dimKey, idx) => setChecks(p => {
    const k = `${dimKey}-${idx}`;
    return { ...p, [k]: !p[k] };
  });

  const allScored = DIMS.every(d => scores[d.key]);
  const totalScore = DIMS.reduce((s, d) => s + (scores[d.key] || 0), 0);
  const maxScore = DIMS.length * 6;

  const capitalScores = CAPITALS.map((cap, ci) => {
    const capDims = DIMS.filter(d => d.capitalIdx === ci);
    const sub = capDims.reduce((s, d) => s + (scores[d.key] || 0), 0);
    return { ...cap, sub, max: capDims.length * 6, dims: capDims };
  });

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
            {/* Watermark */}
            <div style={{ position: "absolute", top: -10, right: -10, fontFamily: "'Cormorant Garamond', serif", fontSize: 180, fontWeight: 300, color: ACCENT, opacity: 0.03, lineHeight: 1, userSelect: "none" }}>4C</div>

            <div style={{ textAlign: "center", marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
                <Shield size={48} glow />
              </div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 34, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", lineHeight: 1.15 }}>
                <span style={{ color: ACCENT }}>Business Independence</span>
                <br/>Blueprint
              </div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontStyle: "italic", color: C.text2, marginTop: 8 }}>
                The 4 Capitals That Drive Your Business Value
              </div>
            </div>

            <div style={{ width: 40, height: 1.5, margin: "0 auto 24px", background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)` }}/>

            {/* Core Principle */}
            <div style={{ padding: "16px 20px", borderRadius: 10, background: "linear-gradient(135deg, rgba(200,162,78,0.06), rgba(200,162,78,0.015))", border: "1px solid rgba(200,162,78,0.2)", marginBottom: 24 }}>
              <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.gold, marginBottom: 6 }}>The $30 Million Math</div>
              <div style={{ fontSize: 11.5, lineHeight: 1.65, color: C.text2 }}>
                A company producing $2.7M EBITDA at a <span style={{ color: C.red, fontWeight: 600 }}>4x multiple</span> is worth ~$11M.
                Best-in-class companies at the same revenue level might produce $5.1M EBITDA at an <span style={{ color: C.green, fontWeight: 600 }}>8x multiple</span> — worth <span style={{ color: C.green, fontWeight: 600 }}>$41M</span>.
                That's a <span style={{ color: C.gold, fontWeight: 700 }}>$30 million premium</span> driven entirely by stronger intangible capital. Improving the 4C's increases earnings <em>and</em> the multiple simultaneously — exponential value growth, not linear.
              </div>
            </div>

            {/* Pill Grid — 4 columns (one per capital) */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 24 }}>
              {CAPITALS.map((cap, ci) => {
                const capDims = DIMS.filter(d => d.capitalIdx === ci);
                return (
                  <div key={cap.key} style={{ display: "flex", flexDirection: "column" }}>
                    <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: cap.color, marginBottom: 6, textAlign: "center" }}>{cap.label.replace(" Capital","")}</div>
                    <div style={{ display: "grid", gridTemplateRows: "1fr 1fr 1fr", gap: 5, flex: 1 }}>
                      {capDims.map(d => {
                        const scored = !!scores[d.key];
                        const sc = scored ? scoreColor(scores[d.key]) : C.text4;
                        return (
                          <div key={d.key} style={{
                            padding: "5px 6px", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center",
                            background: scored ? `${sc}12` : `${C.text4}08`,
                            border: `1px solid ${scored ? `${sc}40` : `${C.text4}20`}`,
                            transition: "all 0.3s ease",
                          }}>
                            <span style={{ fontSize: 7.5, fontWeight: 600, letterSpacing: "0.03em", textTransform: "uppercase", color: scored ? sc : C.text3, textAlign: "center" }}>{d.title}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ textAlign: "center", fontSize: 10, color: C.text3, fontStyle: "italic" }}>
              Score yourself 1–6 on each of the 12 dimensions. Your results update automatically on the summary page.
            </div>
          </div>
        </Page>
        <div className="page-gap" style={{ height: 24 }}/>

        {/* ═══ PAGE 2: HOW TO USE ═══ */}
        <Page pageNum={++pageNum} allScored={allScored}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: C.green, marginBottom: 10 }}>HOW TO USE THIS ASSESSMENT</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 400, lineHeight: 1.2, marginBottom: 18 }}>
            <span style={{ color: C.gold }}>Your invisible assets</span> <span style={{ color: C.text1 }}>determine your sale price.</span>
          </div>
          <p style={{ fontSize: 12, lineHeight: 1.65, color: C.text2, marginBottom: 10 }}>
            Your accountant reports on tangible assets — equipment, inventory, real estate. But 80% of a premium business's value comes from intangible capital that never shows up on a balance sheet: the strength of your people, the depth of your client relationships, the maturity of your systems, and the power of your culture.
          </p>
          <p style={{ fontSize: 12, lineHeight: 1.65, color: C.text2, marginBottom: 20 }}>
            This assessment measures the four intangible capitals that buyers actually pay premiums for. A landscaping company with documented processes and a trained crew might command 2x the multiple of one where the owner runs every job. A marketing agency with 80% recurring revenue and diversified clients sells for 3x one dependent on three whale accounts. The difference isn't revenue — it's intangible capital.
          </p>

          {/* Why 1-6 */}
          <div style={{ padding: "14px 18px", borderRadius: 10, background: `${C.cyan}08`, border: `1.5px solid ${C.cyan}30`, marginBottom: 16 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: C.cyan, marginBottom: 6 }}>Why 1–6 Instead of 1–5?</div>
            <div style={{ fontSize: 11, lineHeight: 1.6, color: C.text2 }}>
              A 1–5 scale lets you hide at "3" — safe, average, non-committal. Our 1–6 scale has <b style={{ color: C.text1 }}>no middle</b>. You're either below the midpoint (1–3) or above it (4–6). This forces honest self-assessment, which is the only kind that leads to real improvement.
            </div>
          </div>

          {/* Top Scores */}
          <div style={{ padding: "14px 18px", borderRadius: 10, background: `${C.gold}06`, border: `1.5px solid ${C.gold}25`, marginBottom: 16 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: C.gold, marginBottom: 10 }}>What The Top Scores Mean</div>
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ flex: 1, padding: "10px 14px", borderRadius: 8, background: `${C.cyan}08`, border: `1px solid ${C.cyan}20` }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 4 }}>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: C.cyan }}>5</span>
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: C.cyan }}>Best In Class</span>
                </div>
                <div style={{ fontSize: 11, lineHeight: 1.5, color: C.text2 }}>Genuine competitive advantage. You're outperforming your industry peers and building real enterprise value. A buyer would view this area as a strategic asset worth paying a premium to acquire.</div>
              </div>
              <div style={{ flex: 1, padding: "10px 14px", borderRadius: 8, background: `${C.green}08`, border: `1px solid ${C.green}20` }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 4 }}>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: C.green }}>6</span>
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: C.green }}>Perfect</span>
                </div>
                <div style={{ fontSize: 11, lineHeight: 1.5, color: C.text2 }}>Nothing meaningful left to improve. Most honest operators rarely give themselves this score. If you do, be certain you'd bet your house on it — because a buyer's due diligence team will test it.</div>
              </div>
            </div>
          </div>

          {/* For Each Section */}
          <div style={{ padding: "14px 18px", borderRadius: 10, background: `${C.gold}06`, border: `1px solid ${C.gold}20` }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: C.gold, marginBottom: 6 }}>For Each Dimension</div>
            <div style={{ fontSize: 11, lineHeight: 1.6, color: C.text2 }}>
              Read the description and checklist honestly. Use the checklist as a gut-check — not a scorecard. Then use the <b style={{ color: C.text1 }}>Rate Yourself</b> panel at the bottom to assign your score. The 12 dimensions are grouped under four capitals: Human, Customer, Structural, and Social. Your results aggregate automatically.
            </div>
          </div>
        </Page>
        <div className="page-gap" style={{ height: 24 }}/>

        {/* ═══ PAGES 3–14: DIMENSION PAGES ═══ */}
        {DIMS.map((dim, di) => {
          const cap = CAPITALS[dim.capitalIdx];
          const dimColor = cap.color;
          pageNum++;
          return (
            <div key={dim.key}>
              <Page pageNum={pageNum} allScored={allScored}>
                <div style={{ position: "relative" }}>
                  {/* Section Watermark */}
                  <div style={{ position: "absolute", top: -10, right: -10, fontFamily: "'Cormorant Garamond', serif", fontSize: 140, fontWeight: 300, color: dimColor, opacity: 0.035, lineHeight: 1, userSelect: "none" }}>
                    {String(dim.num).padStart(2, "0")}
                  </div>

                  {/* Kicker */}
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: dimColor, marginBottom: 4 }}>
                    Dimension {String(dim.num).padStart(2, "0")} of {dim.of} · {cap.label}
                  </div>

                  {/* Title */}
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.02em", lineHeight: 1.15, marginBottom: 4 }}>
                    {dim.title}
                  </div>

                  {/* Subtitle */}
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: dimColor, marginBottom: 16 }}>
                    {dim.subtitle}
                  </div>

                  {/* Description */}
                  <p style={{ fontSize: 12, lineHeight: 1.65, color: C.text2, marginBottom: 18 }}>
                    {dim.description}
                  </p>

                  {/* Checklist */}
                  <div style={{ padding: "12px 18px", borderRadius: 10, background: `linear-gradient(135deg, ${dimColor}08, ${dimColor}02)`, border: `1px solid ${dimColor}20`, marginBottom: 8 }}>
                    {dim.checks.map((c, ci) => (
                      <CheckItem key={ci} text={c.text} sub={c.sub}
                        checked={!!checks[`${dim.key}-${ci}`]}
                        onToggle={() => toggleCheck(dim.key, ci)}/>
                    ))}
                  </div>

                  {/* Score Selector */}
                  <ScoreSelector value={scores[dim.key]} onChange={v => setScore(dim.key, v)}
                    lowLabel={dim.lowLabel} highLabel={dim.highLabel}/>
                </div>
              </Page>
              <div className="page-gap" style={{ height: 24 }}/>
            </div>
          );
        })}

        {/* ═══ SCORING SUMMARY PAGE ═══ */}
        <Page pageNum={++pageNum} allScored={allScored}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: ACCENT, marginBottom: 6 }}>Your Business Independence Score</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 500, lineHeight: 1.2, marginBottom: 16 }}>
            How strong is the <span style={{ color: ACCENT }}>invisible engine</span> behind your business?
          </div>

          {/* Capital-grouped score bars */}
          {capitalScores.map((cap, ci) => (
            <div key={cap.key} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: cap.sub > 0 ? capitalScoreColor(cap.sub, cap.max) : cap.color }}>{cap.label}</span>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, fontWeight: 700, color: cap.sub > 0 ? capitalScoreColor(cap.sub, cap.max) : C.text4 }}>
                  {cap.sub}<span style={{ fontSize: 10, color: C.text3 }}>/{cap.max}</span>
                </span>
              </div>
              {cap.dims.map(d => {
                const sc = scores[d.key];
                const barColor = sc ? scoreColor(sc) : C.text4;
                const pct = sc ? (sc / 6) * 100 : 0;
                return (
                  <div key={d.key} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5, paddingLeft: 8 }}>
                    <span style={{ fontSize: 9.5, color: C.text2, width: 175, flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.title}</span>
                    <div style={{ flex: 1, height: 8, borderRadius: 4, background: `${C.text4}20`, overflow: "hidden" }}>
                      <div style={{ width: `${pct}%`, height: "100%", borderRadius: 4, background: `linear-gradient(180deg, ${barColor}30, ${barColor}15)`, border: `0.5px solid ${barColor}`, boxShadow: sc ? `0 0 8px ${barColor}25, inset 0 1px 0 ${barColor}20` : "none", transition: "all 0.4s ease" }}/>
                    </div>
                    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 13, fontWeight: 700, color: sc ? barColor : C.text4, width: 22, textAlign: "right" }}>
                      {sc || "–"}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}

          {/* Grand Total */}
          <div style={{ padding: "12px 16px", borderRadius: 10, background: `${ACCENT}08`, border: `1.5px solid ${ACCENT}30`, display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: ACCENT }}>Total Business Independence Score</span>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: allScored && gateUnlocked ? (activeBand?.color || ACCENT) : C.text4 }}>
              {totalScore}<span style={{ fontSize: 13, color: C.text3 }}>/{maxScore}</span>
              {allScored && gateUnlocked && <span style={{ fontSize: 13, fontWeight: 600, color: C.text2, marginLeft: 8 }}>({Math.round((totalScore / maxScore) * 100)}%)</span>}
            </span>
          </div>

          {/* Diagnosis (gated) */}
          {allScored && gateUnlocked && activeBand && (
            <div style={{ padding: "14px 18px", borderRadius: 10, background: `${activeBand.color}08`, border: `1.5px solid ${activeBand.color}30`, marginBottom: 14 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: activeBand.color, marginBottom: 2 }}>{activeBand.label}</div>
              <div style={{ fontSize: 9, color: C.text3, marginBottom: 8 }}>Score Range: {activeBand.range} of 72</div>
              <div style={{ fontSize: 11.5, lineHeight: 1.6, color: C.text2, marginBottom: 10 }}>{activeBand.desc}</div>
              {lowestTwo.length >= 2 && (
                <div style={{ fontSize: 11, color: C.text1, marginBottom: 8 }}>
                  <b>Your biggest opportunities:</b>{" "}
                  <span style={{ color: scoreColor(scores[lowestTwo[0].key]) }}>{lowestTwo[0].title}</span> and{" "}
                  <span style={{ color: scoreColor(scores[lowestTwo[1].key]) }}>{lowestTwo[1].title}</span>.
                </div>
              )}
              <div style={{ fontSize: 11, lineHeight: 1.6, color: C.text2, fontStyle: "italic", marginBottom: 6 }}>
                Every dimension you just scored represents a value lever — a specific place where improving your intangible capital can increase both your EBITDA and your multiple. The gaps aren't failures. They're the $30M opportunity hiding in your business.
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.text1 }}>
                The businesses that command premium multiples aren't lucky — they're intentional about building intangible capital.
              </div>
            </div>
          )}

          {/* Banding Cards 2x2 (gated) */}
          {allScored && gateUnlocked && <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {BANDS.map(b => {
              const isActive = activeBand?.label === b.label;
              return (
                <div key={b.label} style={{
                  padding: "10px 14px", borderRadius: 10,
                  background: `linear-gradient(135deg, ${b.color}${isActive ? "12" : "06"}, ${b.color}02)`,
                  border: `1px solid ${b.color}${isActive ? "50" : "15"}`,
                  boxShadow: isActive ? `0 0 16px ${b.color}20` : "none",
                  opacity: allScored ? (isActive ? 1 : 0.35) : 1,
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
            toolName="Business Independence Blueprint"
            toolSlug="bib"
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
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 500, lineHeight: 1.2, marginBottom: 14 }}>
                Your first three moves.
              </div>
              <p style={{ fontSize: 12, lineHeight: 1.65, color: C.text2, marginBottom: 20 }}>
                These are your highest-leverage actions — specific to your lowest-scoring dimensions, calibrated to your current level, and executable this week. Not theory. Not someday. This week.
              </p>

              {lowestThree.map((d, i) => {
                const sc = scores[d.key];
                const tier = sc <= 2 ? "low" : sc <= 4 ? "mid" : "high";
                const tactic = d.quickWins[tier][0];
                const cap = CAPITALS[d.capitalIdx];
                return (
                  <div key={d.key} style={{ padding: "14px 18px", borderRadius: 10, background: `${cap.color}06`, border: `1px solid ${cap.color}20`, marginBottom: 12 }}>
                    <div style={{ display: "table", padding: "3px 10px", borderRadius: 5, background: `${C.gold}15`, border: `1px solid ${C.gold}30`, marginBottom: 8 }}>
                      <span style={{ display: "table-cell", verticalAlign: "middle", fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: C.gold }}>MOVE {String(i + 1).padStart(2, "0")}</span>
                    </div>
                    <div style={{ fontSize: 10, color: cap.color, fontWeight: 600, marginBottom: 2 }}>
                      {cap.label} → {d.title} <span style={{ color: scoreColor(sc) }}>({sc}/6)</span>
                    </div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontWeight: 600, color: C.text1, marginBottom: 4 }}>{tactic.title}</div>
                    <div style={{ fontSize: 10.5, lineHeight: 1.55, color: C.text2 }}>{tactic.context}</div>
                  </div>
                );
              })}

              {/* Qualifier */}
              <div style={{ padding: "14px 18px", borderRadius: 10, background: `${ACCENT}06`, border: `1.5px solid ${ACCENT}25`, marginTop: 16, marginBottom: 16 }}>
                <div style={{ fontSize: 11.5, lineHeight: 1.65, color: C.text2 }}>
                  You can implement these yourself — or our team can help you strengthen your intangible capital and systematically build a <span style={{ color: ACCENT, fontWeight: 700 }}>Masterpiece Business</span> — one that's nailed, scalable, and ready for whatever comes next.
                </div>
              </div>

            </Page>
            <div className="page-gap" style={{ height: 24 }}/>
          </>
        )}

        {/* ═══ CTA PAGE ═══ */}
        <Page pageNum={allScored ? (TOTAL_PAGES_WITH_MOVES) : (TOTAL_PAGES_BASE)} allScored={allScored}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: C.gold, marginBottom: 10 }}>What Happens Next</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 500, lineHeight: 1.2, marginBottom: 20 }}>
            Knowing your <span style={{ color: ACCENT }}>Business Independence</span> score is the beginning, not the end.
          </div>

          {/* Edward headshot + bio */}
          <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 18 }}>
            <div style={{ width: 88, height: 88, borderRadius: "50%", flexShrink: 0, overflow: "hidden", outline: `2px solid ${C.gold}40`, outlineOffset: 2, background: C.bgElev }}>
              <img src={HEADSHOT} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}/>
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.text1 }}>Edward Kriczky, <span style={{ color: C.text1 }}>CEPA®</span></div>
              <div style={{ fontSize: 11, color: C.gold, marginBottom: 6 }}>Founder, Kriczky Virtus</div>
              <div style={{ fontSize: 11, lineHeight: 1.6, color: C.text2 }}>
                Most owners have never measured their intangible capital and therefore don't even know where to start towards building Business Independence — because no one's ever shown them how. This blueprint is your starting line. The gap between where you scored and best-in-class isn't a problem — it's a roadmap for exponential value creation. Let's build it together.
              </div>
            </div>
          </div>

          {/* What happens next — timeline */}
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
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontStyle: "italic", lineHeight: 1.5, color: C.text1 }}>
              Intangible assets account for most of a business's value. Yet most owners get zero feedback on them — because traditional accounting was built for the manufacturing economy of the 1950s, not the knowledge economy you exist in today. What you track is what improves — and if intangible capital systematically improves, then so should the value of your business, its profits, and ultimately your <span style={{ color: C.gold, fontWeight: 700, fontStyle: "normal" }}>freedom and independence as an owner.</span>
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
