import { useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/* ═══════════════════════════════════════════════════════════════
   HUMAN CAPITAL DEEP-DIVE
   Talent, Leadership & Bench Depth
   Accent: #A78BFA (purple)
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

/* ── DIMENSIONS (10) ── */
const DIMS = [
  {
    key: "d1", num: 1, of: 10,
    title: "Talent Acquisition & Employer Brand",
    subtitle: "Can you attract A-players, or are you always settling?",
    description: "A $3M plumbing company posted the same Craigslist ad for six months and got the same C-players every time. A competitor built a reputation as the place where technicians get trained, certified, and treated well — they had a waitlist. The difference wasn't pay. It was brand. Your ability to attract top talent before you need them — proactively, not reactively — is the leading indicator of whether your team gets stronger or weaker each year. Whether you're scaling or preparing for an eventual exit, your hiring pipeline is a leading indicator — if it's dry, growth is capped.",
    checks: [
      { text: "We have a defined employer value proposition that differentiates us from competitors.", sub: "Why would an A-player choose you over three other offers? If you can't answer in one sentence, neither can they." },
      { text: "Open roles are filled within 45 days with qualified candidates, not just warm bodies.", sub: "Speed-to-fill is a proxy for brand strength. The best employers fill fast because talent comes to them." },
      { text: "We recruit proactively — building relationships with potential hires before positions open.", sub: "The best hire you'll ever make is someone you've been cultivating for six months, not someone who applied cold." },
      { text: "New hires consistently meet or exceed expectations within their first 90 days.", sub: "Hiring quality is the real metric. If 40% of new hires underperform, your process is broken." },
    ],
    lowLabel: "Desperate, reactive hiring",
    highLabel: "A-players seek us out",
    quickWins: {
      low: [
        { title: "Write a one-page 'Why Work Here' document this week", context: "List five specific, provable reasons an A-player should choose your company over competitors. Use it in every job posting, interview, and recruiter conversation." },
        { title: "Audit your last 5 hires against performance expectations", context: "Were they A-players or warm bodies? If more than two underperformed, your sourcing channels or screening process need an overhaul." },
        { title: "Ask your best employee to write a Glassdoor review", context: "Most candidates check reviews before applying. One authentic positive review outweighs a hundred job postings." },
      ],
      mid: [
        { title: "Build a 'Future Talent' list of 10 people you'd hire if they were available", context: "Maintain casual relationships with them — coffee, LinkedIn, industry events. When a role opens, you call them before posting." },
        { title: "Standardize your interview process with a scorecard", context: "Every interviewer scores the same five competencies on a 1–5 scale. Eliminates gut-feel hiring and makes A/B/C player identification objective." },
        { title: "Create an employee referral bonus program", context: "Your A-players know other A-players. A $1,000–$2,500 referral bonus is a fraction of what a recruiter charges and yields better cultural fits." },
      ],
      high: [
        { title: "Develop a talent pipeline partnership with a local trade school or university", context: "The companies that win the talent war long-term are the ones embedded in the pipeline — internships, guest lectures, scholarship sponsors." },
        { title: "Benchmark your time-to-fill and quality-of-hire against industry leaders", context: "Track both metrics quarterly. If you're best-in-class, document it — it's a competitive moat that drives growth and commands premium valuations." },
      ],
    },
  },
  {
    key: "d2", num: 2, of: 10,
    title: "Compensation Architecture",
    subtitle: "Is your pay structure built to retain, or built to lose?",
    description: "A marketing agency paid everyone 'market rate' — which meant they matched whatever the last competitor offered. No structure, no transparency, no logic. Their best designer left for $8K more because she couldn't see a path forward. A competing firm built tiered compensation with clear progression: base salary, performance bonuses, and upside incentives tied directly to the employee's specific performance. Compensation isn't just about how much — it's about how the structure creates loyalty, alignment, and long-term commitment.",
    checks: [
      { text: "Every role has a documented compensation band with clear criteria for advancement.", sub: "If people don't know what it takes to earn more, they'll assume the answer is 'leave.'" },
      { text: "We benchmark compensation against market data at least annually.", sub: "You can't retain talent if you don't know what they're worth to everyone else." },
      { text: "Variable compensation (bonuses, profit-sharing, equity) is tied to measurable outcomes.", sub: "Bonuses without metrics are gifts. Incentives tied to your desired outcomes are alignment engines." },
      { text: "Our compensation structure is transparent enough that employees trust it's fair.", sub: "Perceived unfairness — even when pay is adequate — is one of the top drivers of voluntary turnover." },
    ],
    lowLabel: "Ad hoc, opaque pay",
    highLabel: "Strategic, retentive comp",
    quickWins: {
      low: [
        { title: "Create a simple comp band document for every role this week", context: "Even rough ranges (entry, mid, senior) with clear criteria for each level. This alone reduces 'I don't know what I'm worth here' anxiety." },
        { title: "Run a market rate check on your three most critical roles", context: "Use Salary.com, Payscale, or Glassdoor. If you're more than 15% below market on any, you have an urgent flight risk." },
        { title: "Identify any pay inequities among people in the same role", context: "If two people doing the same job are paid significantly differently without clear justification, fix it before someone discovers it for you." },
      ],
      mid: [
        { title: "Introduce a quarterly or semi-annual performance bonus tied to company metrics", context: "Even a modest pool (3–5% of salary) tied to revenue or profitability goals creates alignment between individual effort and company performance." },
        { title: "Build a total compensation statement for each employee", context: "Include salary, benefits value, PTO value, bonuses, and any perks. Most employees undervalue their total package by 25–40%." },
        { title: "Create a retention-focused vesting schedule for any variable comp", context: "A bonus paid quarterly retains for 90 days. A profit-share that vests over 3 years retains for 36 months." },
      ],
      high: [
        { title: "Explore phantom equity or profit-interest units for your top 3–5 people", context: "Give your best people an ownership psychology without giving up actual equity. It transforms employees into co-builders." },
        { title: "Commission a formal compensation audit from an HR consultant", context: "An external audit validates your structure, identifies gaps, and gives you a defensible framework — whether you're scaling the team or preparing for due diligence." },
      ],
    },
  },
  {
    key: "d3", num: 3, of: 10,
    title: "Retention & Flight Risk",
    subtitle: "Would your top 3 people leave tomorrow if a better offer came?",
    description: "Here's the uncomfortable truth: your best people have options. They get recruited constantly. The only question is whether you've given them enough reasons to say no. A $6M IT services firm lost their top engineer to a competitor who offered 20% more. The owner said, 'I didn't even know he was looking.' That's the problem — he wasn't looking. The opportunity found him, and he had no compelling reason to stay. Retention isn't about counter-offers. It's about building an environment where your best people feel invested, valued, and connected to a future they can see and a mission they believe in.",
    checks: [
      { text: "We know specifically what motivates each of our top 5 employees — and it's not the same for all of them.", sub: "One wants autonomy, another wants development, a third wants recognition. Treating them identically is a retention mistake." },
      { text: "Voluntary turnover in key roles is below 10% annually.", sub: "Above 15% in critical positions signals systemic retention problems that limit your ability to scale — and that any future buyer will flag immediately." },
      { text: "We conduct stay interviews (not just exit interviews) at least annually.", sub: "Exit interviews tell you why people left. Stay interviews tell you why they might — while you can still fix it." },
      { text: "Every key employee can articulate their next role or growth opportunity within the company.", sub: "The absence of a visible career path is what makes your best people receptive to recruiters. If they can't see a future here, they'll build one somewhere else." },
    ],
    lowLabel: "Key people are flight risks",
    highLabel: "Deeply invested team",
    quickWins: {
      low: [
        { title: "Schedule 1-on-1 stay interviews with your top 5 people this month", context: "Ask three questions: What keeps you here? What might pull you away? What would make this the best job you've ever had? Listen. Act." },
        { title: "Identify your single biggest flight risk and create a retention plan this week", context: "Who is the one person whose departure would hurt most? What would it take to make them un-recruitable? Do that thing." },
        { title: "Map every key person to their backup (or lack thereof)", context: "If you find a role with no backup and a disengaged person in it, that's a ticking time bomb. Prioritize cross-training immediately." },
      ],
      mid: [
        { title: "Implement a 'golden handcuffs' retention bonus for your most critical roles", context: "A meaningful annual retention bonus (10–20% of base) that pays out only if the person stays through the year creates a real cost of leaving." },
        { title: "Create individualized development plans for your top performers", context: "A-players stay where they grow. A documented growth plan says 'we see your future here' better than any raise." },
        { title: "Track and report on retention metrics quarterly", context: "What gets measured gets managed. If leadership sees turnover data regularly, retention becomes a strategic priority, not an afterthought." },
      ],
      high: [
        { title: "Build a formal succession plan that your top performers know about", context: "When your best people can see the seat they're growing into, they stop looking at other companies' org charts." },
        { title: "Survey your team anonymously on engagement and intention to stay", context: "You'll learn things in anonymous surveys that you'll never hear in 1-on-1s. Use a simple tool like Officevibe or a 10-question Google Form." },
      ],
    },
  },
  {
    key: "d4", num: 4, of: 10,
    title: "Role Clarity & Accountability",
    subtitle: "Does everyone know what they own and how they're measured?",
    description: "In a $4M construction firm, three project managers all thought someone else was responsible for client communication. So nobody did it consistently. Clients complained, projects ran over, and the owner spent half his day putting out fires that shouldn't have been his. Contrast that with a $2M accounting firm where every team member has a one-page role charter: their three key responsibilities, two KPIs they own, and who they escalate to. The owner takes two-week vacations. Role clarity isn't bureaucracy — it's the operating system that lets a business run without its owner being the router for every question.",
    checks: [
      { text: "Every employee has a documented role with specific responsibilities, decision authority, and KPIs.", sub: "Not a generic job description from Indeed — a living document that says 'you own these outcomes.'" },
      { text: "Accountability is enforced — underperformance is addressed within 30 days, not tolerated for months.", sub: "A-players lose respect for leadership that tolerates C-players. The fastest way to lose your best people is to keep your worst." },
      { text: "Team members can clearly articulate what success looks like in their role.", sub: "Ask any employee: 'How do you know if you're doing a great job?' If they hesitate, your role clarity needs work." },
      { text: "Escalation paths are defined — people know when and how to elevate decisions.", sub: "If every hard decision routes to the owner, you don't have role clarity. You have a bottleneck." },
    ],
    lowLabel: "Roles overlap, chaos reigns",
    highLabel: "Crystal-clear ownership",
    quickWins: {
      low: [
        { title: "Write one-page role charters for your top 5 positions this week", context: "Three key responsibilities, two KPIs, one escalation path. Fit it on a single page. Have each person validate it. This alone will surface 80% of your overlap and gaps." },
        { title: "Identify the three decisions that come to you most often and delegate them", context: "For each one, name the person who should own that decision, define the guardrails, and tell your team to go to them instead of you." },
        { title: "Hold a 30-minute team meeting to clarify who owns what", context: "Ask each person to state their top three responsibilities. You'll be stunned by the overlaps, gaps, and assumptions. Fix them in real time." },
      ],
      mid: [
        { title: "Build a RACI chart for your top 10 business processes", context: "Who is Responsible, Accountable, Consulted, and Informed for each major workflow? This eliminates the 'I thought someone else was handling it' problem." },
        { title: "Implement a weekly scorecard where each person reports on their KPIs", context: "A simple red/yellow/green status on 2–3 metrics per person. Takes 15 minutes a week and transforms accountability overnight." },
        { title: "Create a formal 30-day performance improvement process for underperformers", context: "Document expectations, milestones, and consequences. It protects you legally and sends a clear message that accountability matters." },
      ],
      high: [
        { title: "Implement a quarterly role review where each person's charter is updated", context: "Roles evolve. A quarterly refresh keeps charters current and prevents the drift that creates gaps and overlaps over time." },
        { title: "Audit decision-making latency — measure how long key decisions take from initiation to resolution", context: "If decisions take weeks instead of days, your authority structure has bottlenecks. Map them and push authority down." },
      ],
    },
  },
  {
    key: "d5", num: 5, of: 10,
    title: "Cross-Training & Redundancy",
    subtitle: "If your best person in any role disappeared, who picks it up?",
    description: "A $5M manufacturing company had one machinist who was the only person who could operate their CNC equipment. When he had a family emergency and was out for three weeks, they lost $180K in delayed orders. A smarter competitor cross-trained three people on every machine — no single absence ever cost them a sale. Cross-training isn't a luxury. It's insurance against the inevitable reality that people get sick, take vacations, get recruited, or simply decide to leave. Every role that lives in one person's head is a risk that limits your ability to grow, absorb disruption, and command premium value.",
    checks: [
      { text: "Every critical function has at least one documented backup person.", sub: "Not 'someone could probably figure it out' — an identified, trained person who has actually performed the function." },
      { text: "We have a cross-training matrix that we review quarterly.", sub: "A matrix on paper is useless if it's 18 months out of date. Quarterly reviews catch gaps before they become emergencies." },
      { text: "Key processes can continue for at least 2 weeks without any single individual.", sub: "Two weeks covers most absences. If you can't survive two weeks without someone, that person owns you." },
      { text: "Cross-training is part of our standard operating rhythm, not something we do in a panic.", sub: "Reactive cross-training after someone gives notice is too late. Proactive cross-training is a system, not an event." },
    ],
    lowLabel: "Critical single points of failure",
    highLabel: "Fully redundant team",
    quickWins: {
      low: [
        { title: "Map every function to primary and backup owners on a single spreadsheet", context: "Create three columns: Function, Primary, Backup. Every blank in the Backup column is a single point of failure that needs to be addressed this quarter." },
        { title: "Have your most single-threaded person document their top 3 processes this week", context: "Start with the person whose absence would hurt most. Even rough documentation is infinitely better than tribal knowledge locked in one brain." },
        { title: "Schedule shadow days — one person shadows another for a half-day each month", context: "It's the fastest, lowest-cost way to build cross-functional knowledge. Start with your highest-risk roles." },
      ],
      mid: [
        { title: "Build a cross-training calendar with monthly rotation assignments", context: "Assign one cross-training task per month per team member. In 12 months, you'll have meaningful redundancy across the organization." },
        { title: "Run a 'fire drill' — have a key person take a surprise day off while their backup covers", context: "You'll learn in one day whether your cross-training is real or theoretical. The gaps it reveals are exactly what needs fixing next." },
        { title: "Create video walkthroughs of your 5 most critical processes", context: "A 10-minute Loom video is worth 10 pages of documentation. It captures nuance, context, and the 'why' behind each step." },
      ],
      high: [
        { title: "Implement job rotation for your leadership team — quarterly functional swaps", context: "Leaders who understand multiple functions make better decisions and can cover for each other. It also develops general managers, not just specialists." },
        { title: "Stress-test your redundancy by having the owner take two consecutive weeks completely offline", context: "If the business runs smoothly, your cross-training is real. If it doesn't, you just found your remaining gaps." },
      ],
    },
  },
  {
    key: "d6", num: 6, of: 10,
    title: "Leadership Development Pipeline",
    subtitle: "Are you building the next generation, or hoping they emerge?",
    description: "Companies with the best long-term results have leaders who invest in developing their successors — not leaders who made themselves indispensable. A $7M electrical contractor had the owner running every job meeting. When asked who could take over, he said, 'Nobody's ready.' But he'd never given anyone the chance to get ready. Compare that to a $4M digital agency whose founder identified two future leaders three years ago, gave them increasing responsibility, and now only attends quarterly reviews. His business can scale — or sell — without him. The first one can't.",
    checks: [
      { text: "We have identified 2–3 people who could step into leadership roles within 12 months.", sub: "If your leadership pipeline is empty, your business has a ceiling — whether you're trying to scale or sell." },
      { text: "Emerging leaders are given real authority and decision-making opportunities, not just titles.", sub: "Leadership develops through practice, not observation. Are you giving people the chance to lead, or just the label?" },
      { text: "We invest in formal development (training, coaching, mentoring) for high-potential employees.", sub: "Sending someone to a conference isn't development. A structured growth plan with accountability, and execution metrics, is." },
      { text: "Our leadership bench could run the business for 90 days without the owner.", sub: "This is the acid test. If the answer is no, your Human Capital has a leadership pipeline problem." },
    ],
    lowLabel: "No bench, owner dependent",
    highLabel: "Deep leadership pipeline",
    quickWins: {
      low: [
        { title: "Identify your top 2 high-potential employees and tell them they're being developed for leadership", context: "People can't grow into roles they don't know exist. Naming someone as a future leader changes their mindset from 'employee' to 'co-builder' overnight." },
        { title: "Delegate one recurring leadership meeting to someone else this month", context: "Pick a meeting you currently run — a team standup, a client review — and hand it off. Coach from behind, don't rescue from the front." },
        { title: "Create a simple 'leadership readiness' scorecard for your top prospects", context: "Rate them on 5 competencies (decision-making, communication, accountability, strategic thinking, people management). It reveals exactly where to focus development." },
      ],
      mid: [
        { title: "Enroll your top 2 prospects in a formal leadership development program", context: "Vistage, EOS, a local business accelerator — structured programs accelerate development 3x faster than on-the-job learning alone." },
        { title: "Assign each prospect a stretch project that's outside their comfort zone", context: "A sales leader managing a product launch. An ops person leading a client relationship. Stretch assignments build general management capability." },
        { title: "Implement monthly 1-on-1 coaching sessions with your emerging leaders", context: "30 minutes, focused on their development — not task management. Ask: What did you learn? Where did you struggle? What will you do differently?" },
      ],
      high: [
        { title: "Have your top prospect run the business for two weeks while you observe from the sideline", context: "Give them full authority with a safety net. The lessons they learn in those two weeks are worth two years of theoretical development." },
        { title: "Document your leadership pipeline formally — names, timelines, readiness scores — and present it to your advisory team", context: "A documented pipeline is a scalable asset. It says: this business has depth beyond the founder." },
      ],
    },
  },
  {
    key: "d7", num: 7, of: 10,
    title: "Performance Management",
    subtitle: "Do you differentiate between A, B, and C players — and act on it?",
    description: "Jack Welch's vitality model — the 20/70/10 framework — argues that roughly 20% of your people are A-players (top performers), 70% are solid B-players (the backbone), and 10% are C-players (underperformers). The businesses that grow enterprise value are ruthless about developing their A's, coaching their B's upward, and moving their C's out. A $3M staffing agency kept a chronically underperforming recruiter for two years because 'she's been here forever.' During that time, two A-players left — partly because they watched mediocrity get tolerated. The cost of keeping C-players isn't their low output. It's the A-players you lose because of the message it sends.",
    checks: [
      { text: "We formally evaluate every employee's performance at least twice a year against documented expectations.", sub: "Not an annual review that surprises people — ongoing, structured feedback with clear benchmarks tied to actions they can 'do', not unquantifiable metrics." },
      { text: "A-players are rewarded, C-players are coached or exited within 90 days.", sub: "Tolerating C-players is the fastest way to tell your A-players that performance doesn't actually matter here." },
      { text: "Managers have the skills and authority to have difficult performance conversations.", sub: "If your managers avoid tough conversations, underperformance festers. Training managers to give direct feedback is a force multiplier." },
      { text: "Performance data informs compensation, promotion, and succession decisions — not tenure or politics.", sub: "If your longest-tenured person makes the most regardless of output, your system rewards survival over results." },
    ],
    lowLabel: "No system, C-players tolerated",
    highLabel: "Rigorous, differentiated management",
    quickWins: {
      low: [
        { title: "Rank your entire team A/B/C this week — honestly, on paper", context: "Don't show anyone. Just get honest with yourself about who is a top performer, who is solid, and who you've been avoiding dealing with." },
        { title: "Have the difficult conversation with your most obvious C-player within 14 days", context: "Set clear expectations, a 30-day improvement timeline, and specific consequences. The conversation you're avoiding is costing you more than you think." },
        { title: "Ask your A-players if they feel their performance is recognized and rewarded differently", context: "If A-players don't see a distinction between their treatment and a C-player's, they'll eventually stop being A-players — or stop being yours." },
      ],
      mid: [
        { title: "Implement a simple quarterly review process — 30 minutes per person", context: "Review 2–3 KPIs, discuss development, and calibrate expectations. Quarterly frequency prevents surprises and keeps improvement continuous." },
        { title: "Create a performance-to-compensation link that's transparent and documented", context: "A-players get first access to raises, bonuses, and advancement. B-players get development. C-players get a timeline. Make it known." },
        { title: "Train your managers on how to deliver direct, constructive performance feedback", context: "A 2-hour workshop on the SBI model (Situation-Behavior-Impact) transforms managers from feedback-avoiders to feedback-givers." },
      ],
      high: [
        { title: "Implement a formal calibration session where leadership aligns on A/B/C ratings across the organization", context: "Calibration prevents the 'everyone's above average' problem and ensures consistent standards across teams and managers." },
        { title: "Track the correlation between your performance management actions and retention/revenue outcomes", context: "When you can prove that exiting C-players improved team productivity by 20%, performance management becomes a strategic asset." },
      ],
    },
  },
  {
    key: "d8", num: 8, of: 10,
    title: "Succession Readiness",
    subtitle: "Is there a named successor for every critical role — including yours?",
    description: "The EPI Owner Readiness Survey reveals that only 29% of business owners have identified a successor. Whether you're building to scale or building to sell, the question 'Who runs this if you step back?' has the same answer: it better not be silence. Succession readiness isn't about retirement planning — it's about risk mitigation and growth capacity. A named, developed successor for every critical role (including the owner's) means the business can expand, weather disruptions, and — when the time comes — transfer cleanly at a premium.",
    checks: [
      { text: "The owner has a named successor who could take over within 6–12 months.", sub: "Not 'I'll figure it out when the time comes.' A specific person, with a specific development plan, on a specific timeline." },
      { text: "Every department head or critical role has at least one identified successor.", sub: "Succession gaps at the leadership level cap your growth and create risk. Each gap is a constraint on scaling — and a discount on your valuation." },
      { text: "Successors are actively being developed — not just named on paper.", sub: "A name without development is a wish, not a plan. Are they getting the experiences and authority they need?" },
      { text: "The succession plan has been stress-tested — a key leader has been absent for an extended period.", sub: "The plan works when it's been tested. Everything else is theory." },
    ],
    lowLabel: "No plan, no successors",
    highLabel: "Named, developed successors",
    quickWins: {
      low: [
        { title: "Write down one name for your own successor — even if they're not ready yet", context: "Just naming someone shifts your mindset from 'indispensable' to 'developing my replacement.' It's the hardest and most important step in building a business that doesn't depend on you." },
        { title: "Create a succession map: every critical role, the current occupant, and a potential backup", context: "A simple spreadsheet. Every empty cell in the 'backup' column is a risk that limits your growth and your options." },
        { title: "Have an honest conversation with your most likely successor about their interest and readiness", context: "Don't assume they want the role. And don't assume they don't. Ask, then build a plan around reality." },
      ],
      mid: [
        { title: "Build 12-month development plans for your top 3 successors with quarterly milestones", context: "Specific skills, experiences, and authority levels they need to reach. Review progress quarterly. Adjust as needed." },
        { title: "Give your most advanced successor P&L responsibility for a division or major client", context: "Nothing tests readiness like ownership of financial outcomes. It also tells you exactly where they need more development." },
        { title: "Create a 'transition playbook' documenting the owner's unique knowledge and relationships", context: "Every client relationship, vendor contact, and institutional insight in the owner's head needs to be on paper — or it disappears the day you step back." },
      ],
      high: [
        { title: "Run a formal succession simulation — the owner steps back for 30 days with the successor in charge", context: "The only way to validate a succession plan is to test it. A 30-day simulation reveals gaps no amount of planning can." },
        { title: "Present your succession plan to your advisory board, banker, or potential buyer as a formal document", context: "A documented, tested succession plan is a premium-grade asset — it tells your team, your board, and any future buyer that this business transfers cleanly." },
      ],
    },
  },
  {
    key: "d9", num: 9, of: 10,
    title: "Team Culture & Engagement",
    subtitle: "Do your people show up with energy and ownership, or punch a clock?",
    description: "Culture isn't foosball tables and free snacks. It's what happens when you're not in the room. A $5M home services company had low turnover on paper, but the owner noticed that his best people stopped volunteering for extra projects. They showed up, did the minimum, and left at 5:00. They were 'quiet quitting' — present but disengaged. Meanwhile, a competing firm with similar pay had employees who pitched improvement ideas, covered for each other voluntarily, and referred friends to open positions. The difference was that the second firm had a culture where people felt ownership, not just employment. Engaged teams produce more, innovate more, and stay longer — all of which compound into business valuation.",
    checks: [
      { text: "Team members volunteer ideas, improvements, and solutions without being asked.", sub: "Voluntary initiative is the clearest signal of engagement. If ideas only flow downward, your culture is directive, not participative." },
      { text: "Employees would recommend working here to a friend — genuinely, not as a favor.", sub: "The employee referral rate is the ultimate culture metric. Would your people stake their reputation on bringing someone they respect into this environment?" },
      { text: "Every team member can articulate the company's mission and how their role contributes to it.", sub: "When people connect their daily work to a larger purpose, engagement shifts from transactional to intrinsic. Mission-driven teams outperform incentive-driven teams every time." },
      { text: "The team's energy and output level stays consistent whether the owner is present or not.", sub: "If productivity drops when you're away, you have compliance, not commitment. Real culture doesn't need supervision." },
    ],
    lowLabel: "Clock-punchers, disengaged",
    highLabel: "Energized ownership culture",
    quickWins: {
      low: [
        { title: "Run a 5-question anonymous engagement pulse survey this week", context: "Keep it simple: Do you feel valued? Do you see a future here? Would you recommend this company? Do you trust leadership? One thing we should change? The results will be illuminating." },
        { title: "Start a weekly 'wins and ideas' segment in your team meeting", context: "Dedicate 10 minutes for team members to share wins and pitch improvement ideas. Publicly adopt at least one idea per month. Nothing ignites engagement like feeling heard." },
        { title: "Identify and address the single biggest cultural frustration your team has", context: "Ask three people you trust: 'What's the one thing about working here that drives people crazy?' Fix that one thing. Credibility follows action." },
      ],
      mid: [
        { title: "Implement a peer recognition program — let team members publicly acknowledge each other", context: "A simple Slack channel or weekly shout-out board where peers recognize peers. Recognition from colleagues often means more than recognition from the boss." },
        { title: "Create team-level goals that require collaboration, not just individual KPIs", context: "Individual goals create individual achievers. Team goals create team culture. The best businesses have both." },
        { title: "Hold a quarterly 'state of the company' meeting where financials and strategy are shared openly", context: "Transparency builds trust. When people understand the 'why' behind decisions, engagement follows naturally." },
      ],
      high: [
        { title: "Formalize your cultural values and integrate them into hiring, reviews, and promotion criteria", context: "Culture becomes durable when it's embedded in systems, not just slogans. 'We value ownership' means nothing until you hire, review, and promote based on it." },
        { title: "Measure engagement formally (eNPS, Gallup Q12) and benchmark against industry standards", context: "A quantified culture score is something you can manage, improve, and showcase. 'Great culture' is a claim. An eNPS of 40+ is proof." },
      ],
    },
  },
  {
    key: "d10", num: 10, of: 10,
    title: "Onboarding & Knowledge Transfer",
    subtitle: "Can a new hire get productive in weeks, or does it take months of tribal knowledge?",
    description: "A $4M consulting firm hired a senior associate and handed her a laptop. No onboarding plan, no training schedule, no documentation of how things worked. It took her four months to become productive — and she almost quit at month two. Across town, a competing firm had a 30-60-90 day onboarding program: week one covered systems and processes, month one paired the new hire with a mentor, and month three included a client-facing project with supervision. Their new hires were billing clients within 45 days. The speed at which a new hire reaches full productivity is a direct measure of how well your institutional knowledge is captured and transferable. Fast onboarding is evidence of strong institutional knowledge — it means your business can absorb new talent and scale without bottlenecks. Slow onboarding signals that knowledge lives in people's heads, not in the company.",
    checks: [
      { text: "We have a documented onboarding program with clear milestones for the first 90 days.", sub: "Not a folder of forms. A step-by-step plan that tells the new hire exactly what they'll learn, do, and be measured on at 30, 60, and 90 days." },
      { text: "New hires are paired with a mentor or onboarding lead for their first 90 days.", sub: "Mentorship cuts ramp-up time in half and reduces early turnover by 50%. It's the highest-ROI investment in any new hire." },
      { text: "Critical process knowledge is documented in a format a new hire can access and learn from independently.", sub: "SOPs, video walkthroughs, checklists — if a new hire has to ask 'how do we do X?' for every task, your knowledge transfer is broken." },
      { text: "We measure time-to-productivity for new hires and actively work to reduce it.", sub: "If you don't measure it, you can't improve it. Track the weeks from hire date to full productivity, and make it a leadership KPI." },
    ],
    lowLabel: "Sink or swim, tribal knowledge",
    highLabel: "Structured, fast ramp-up",
    quickWins: {
      low: [
        { title: "Create a 'Week 1 Checklist' for new hires — the 20 things every person needs on day one", context: "Laptop, logins, key contacts, org chart, client list, top 10 processes. A single Google Doc eliminates 80% of first-week confusion." },
        { title: "Assign a mentor or buddy to every new hire starting immediately", context: "Just assigning a go-to person reduces early turnover by 25% and accelerates time-to-productivity by 30%. It costs nothing." },
        { title: "Record your top 3 processes as Loom videos this week", context: "Hit record, do the task, narrate as you go. 10-minute videos that new hires can watch on demand are worth weeks of over-the-shoulder training." },
      ],
      mid: [
        { title: "Build a formal 30-60-90 day onboarding plan with specific learning objectives and milestones", context: "Day 30: understand the business model and key clients. Day 60: independently manage assigned workflows. Day 90: producing at full capacity with minimal supervision." },
        { title: "Create role-specific onboarding tracks so each position gets tailored training", context: "A salesperson's first week looks different from an ops person's. Tailored onboarding respects the role and accelerates competence." },
        { title: "Survey recent hires: 'What was confusing in your first 90 days?'", context: "Your newest employees are the best source of truth about what's missing. Their answers become your onboarding improvement roadmap." },
      ],
      high: [
        { title: "Measure and publish time-to-productivity as a company KPI", context: "When the whole team sees the metric, everyone invests in making new hires productive faster. It becomes a cultural priority." },
        { title: "Build an internal knowledge base (wiki) that's the first place new hires go for answers", context: "A searchable, maintained knowledge base means new hires answer their own questions. It scales onboarding without scaling management time." },
      ],
    },
  },
];

/* ── BANDING ── */
const BANDS = [
  { label: "Talent Crisis", min: 10, max: 20, range: "10–20", color: C.red,
    desc: "Your Human Capital is in critical condition. Key-person dependencies, flight risks, and knowledge gaps are actively limiting your growth potential and creating operational fragility. Immediate action is needed on multiple fronts." },
  { label: "Talent Fragile", min: 21, max: 35, range: "21–35", color: C.amber,
    desc: "You have some capable people but your talent infrastructure is thin. Retention, development, and documentation gaps mean your team's value is volatile — dependent on individuals rather than embedded in the business." },
  { label: "Talent Established", min: 36, max: 48, range: "36–48", color: C.cyan,
    desc: "Your team is a genuine asset. Core talent is retained, roles are defined, and leadership is developing. The remaining gaps are specific and addressable — closing them moves you from good to best-in-class." },
  { label: "Talent Powerhouse", min: 49, max: 60, range: "49–60", color: C.green,
    desc: "Your Human Capital is a competitive weapon. Deep bench, strong culture, clear accountability, and a pipeline that sustains itself. Whether you're scaling aggressively or positioning for an eventual exit, your team is one of your most valuable assets." },
];

const TOTAL_PAGES_BASE = 14; // cover + howto + 10 dims + summary + CTA
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
        <span><b style={{ color: ACCENT, fontWeight: 600 }}>Human Capital</b> — Deep-Dive Assessment</span>
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
      background: value
        ? `linear-gradient(145deg, ${activeColor}08, ${activeColor}03)`
        : "linear-gradient(145deg, rgba(200,162,78,0.06), rgba(200,162,78,0.02))",
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
          const c = scoreColor(n);
          const sel = value === n;
          return (
            <div key={n} onClick={() => onChange(n)} style={{
              flex: 1, height: 40, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", transition: "all 0.2s ease", userSelect: "none",
              background: sel ? `${c}20` : `${c}06`,
              border: `1.5px solid ${sel ? c : `${c}25`}`,
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
  const handleGateSubmit = async () => {
    if (!gName.trim()) { setGError("Please enter your name so we can personalize your results."); return; }
    if (!gEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(gEmail)) { setGError("Please enter a valid email address."); return; }
    setGError(""); setGSending(true);
    let pdfBase64 = null;
    if (onGeneratePdf) { try { pdfBase64 = await onGeneratePdf(); } catch (err) { console.error("[PDF] Generation failed:", err); } }
    const payload = { name: gName.trim(), email: gEmail.trim(), tool: toolSlug, toolName, scores, summary, timestamp: new Date().toISOString(), pdfBase64 };
    try { const res = await fetch("/api/lead-capture", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }); if (res.ok) { onUnlock(); return; } throw new Error("API unavailable"); }
    catch (err) {
      console.log("[Virtus] API failed, queuing silent retry:", err.message || err);
      console.log("[Virtus] Lead data:", JSON.stringify(payload, null, 2));
      var retryPayload = JSON.parse(JSON.stringify(payload)); retryPayload.pdfBase64 = null;
      var retryFn = function(attempt) {
        if (attempt > 5) { console.log("[Virtus] All retries exhausted. Lead data logged above."); return; }
        fetch("/api/lead-capture", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(retryPayload) })
          .then(function(r) { if (r.ok) { console.log("[Virtus] Retry " + attempt + " succeeded"); } else { throw new Error("fail"); } })
          .catch(function() { console.log("[Virtus] Retry " + attempt + " failed, next in " + (30*attempt) + "s"); setTimeout(function() { retryFn(attempt+1); }, 30000*attempt); });
      };
      setTimeout(function() { retryFn(1); }, 30000);
      onUnlock();
    }
    finally { setGSending(false); }
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
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#5A6474", lineHeight: 1.5, margin: "0 0 28px", fontStyle: "italic" }}>Your data stays with you. We will send you a copy of your results.</p>
        <div style={{ padding: "28px 24px", borderRadius: 18, background: "linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.04))", border: "1px solid " + accentColor + "20", borderTop: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 60px " + accentColor + "08", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: 18, pointerEvents: "none", background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 30%, transparent 50%, transparent 70%, rgba(255,255,255,0.03) 100%)" }}/>
          <div style={{ position: "relative", zIndex: 1 }}>
            <input type="text" placeholder="Full name" value={gName} onChange={e => { setGName(e.target.value); setGError(""); }} style={{ width: "100%", padding: "14px 16px", borderRadius: 10, background: "#0F141C", border: "1px solid rgba(255,255,255,0.10)", color: "#E8ECF1", fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none", marginBottom: 10, boxSizing: "border-box" }} onFocus={e => e.target.style.borderColor = accentColor + "50"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.10)"} />
            <input type="email" placeholder="Email address" value={gEmail} onChange={e => { setGEmail(e.target.value); setGError(""); }} onKeyDown={e => e.key === "Enter" && handleGateSubmit()} style={{ width: "100%", padding: "14px 16px", borderRadius: 10, background: "#0F141C", border: "1px solid rgba(255,255,255,0.10)", color: "#E8ECF1", fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none", marginBottom: gError ? 8 : 16, boxSizing: "border-box" }} onFocus={e => e.target.style.borderColor = accentColor + "50"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.10)"} />
            {gError && <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#F87171", margin: "0 0 12px", textAlign: "left" }}>{gError}</p>}
            <button onClick={handleGateSubmit} disabled={gSending} onMouseEnter={e => { if (!gSending) { e.currentTarget.style.boxShadow = "0 0 48px " + accentColor + "40, 0 4px 20px rgba(0,0,0,0.35)"; e.currentTarget.style.borderColor = accentColor + "80"; e.currentTarget.style.background = "linear-gradient(135deg, " + accentColor + "25, " + accentColor + "15)"; var a = e.currentTarget.querySelector("[data-gate-arrow]"); if(a){ a.style.opacity="1"; a.style.transform="translateX(3px)"; } } }} onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 0 20px " + accentColor + "20, 0 4px 12px rgba(0,0,0,0.3)"; e.currentTarget.style.borderColor = accentColor + "50"; e.currentTarget.style.background = "linear-gradient(135deg, " + accentColor + "18, " + accentColor + "0a)"; var a = e.currentTarget.querySelector("[data-gate-arrow]"); if(a){ a.style.opacity="0"; a.style.transform="translateX(0)"; } }} style={{ width: "100%", padding: "16px 0", borderRadius: 12, border: "1.5px solid " + accentColor + "50", cursor: gSending ? "wait" : "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 15, color: accentColor, background: "linear-gradient(135deg, " + accentColor + "18, " + accentColor + "0a)", boxShadow: "0 0 20px " + accentColor + "20, 0 4px 12px rgba(0,0,0,0.3)", position: "relative", overflow: "hidden", transition: "all 0.3s ease", opacity: gSending ? 0.7 : 1 }}>
              <span style={{ position: "absolute", top: "-50%", left: "-50%", right: "-50%", bottom: "-50%", pointerEvents: "none", background: "linear-gradient(120deg, transparent 0%, transparent 40%, " + accentColor + "12 48%, " + accentColor + "20 50%, " + accentColor + "12 52%, transparent 60%, transparent 100%)", backgroundSize: "200% 200%", animation: "btnShimmer 6s ease-in-out infinite" }}/>
              <span style={{ position: "relative", zIndex: 1, display: "inline-flex", alignItems: "center", gap: 8 }}>{gSending ? "Unlocking your results..." : "See My Results"}{!gSending && <svg data-gate-arrow="" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0, transition: "all 0.25s ease" }}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>}</span>
            </button>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#5A6474", textAlign: "center", marginTop: 12 }}>No spam. No pitch. Just your personalized results.</p>
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
      </div>
    </div>
  );
};


export default function HumanCapitalDeepDive() {
  const [scores, setScores] = useState({});
  const [gateUnlocked, setGateUnlocked] = useState(false);
  const toolRef = useRef(null);
  const [checks, setChecks] = useState({});

  const setScore = (key, val) => setScores(p => ({ ...p, [key]: val }));
  const toggleCheck = (dimKey, idx) => setChecks(p => {
    const k = `${dimKey}-${idx}`;
    return { ...p, [k]: !p[k] };
  });

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
      <div style={{ maxWidth: "8.5in", margin: "0 auto" }}>

        {/* ═══ PAGE 1: COVER ═══ */}
        <Page pageNum={++pageNum} allScored={allScored}>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", minHeight: "calc(11in - 1.6in)", position: "relative" }}>
            <div style={{ position: "absolute", top: -10, right: -10, fontFamily: "'Cormorant Garamond', serif", fontSize: 180, fontWeight: 700, color: ACCENT, opacity: 0.03, lineHeight: 1, userSelect: "none" }}>10</div>

            <div style={{ textAlign: "center", marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
                <Shield size={48} glow />
              </div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 34, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", lineHeight: 1.15 }}>
                <span style={{ color: ACCENT }}>Human Capital</span>
                <br/>Deep-Dive
              </div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontStyle: "italic", color: C.text2, marginTop: 8 }}>
                Talent, Leadership & Bench Depth
              </div>
            </div>

            <div style={{ width: 40, height: 1.5, margin: "0 auto 24px", background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)` }}/>

            {/* Core Principle */}
            <div style={{ padding: "16px 20px", borderRadius: 10, background: "linear-gradient(135deg, rgba(200,162,78,0.06), rgba(200,162,78,0.015))", border: "1px solid rgba(200,162,78,0.2)", marginBottom: 24 }}>
              <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.gold, marginBottom: 6 }}>The Core Principle</div>
              <div style={{ fontSize: 11.5, lineHeight: 1.65, color: C.text2 }}>
                Your people are your most valuable — and most volatile — asset. Human Capital measures the strength of your talent, their ability to execute independently, and whether that talent stays when you're not looking. Whether you're scaling or building toward a future exit, the value of your business lives in the <span style={{ color: ACCENT, fontWeight: 600 }}>team that generates it</span>. If that team can't function without you, or if your best people could walk out tomorrow, your business has a Human Capital problem that directly limits your growth and your options.
              </div>
            </div>

            {/* Stat callout */}
            <div style={{ padding: "12px 18px", borderRadius: 10, background: `${ACCENT}06`, border: `1px solid ${ACCENT}20`, marginBottom: 24 }}>
              <div style={{ fontSize: 11, lineHeight: 1.6, color: C.text2 }}>
                <span style={{ color: ACCENT, fontWeight: 700 }}>62% of business owners</span> say finding and retaining top talent is their biggest challenge. Prioritize "First Who, Then What" — the right people in the right seats is the single best predictor of business value growth.
              </div>
            </div>

            {/* Pill Grid — 2 columns, 5 rows */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8, marginBottom: 24 }}>
              {DIMS.map(d => {
                const scored = !!scores[d.key];
                const sc = scored ? scoreColor(scores[d.key]) : C.text4;
                return (
                  <div key={d.key} style={{
                    padding: "7px 10px", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center",
                    background: scored ? `${sc}12` : `${C.text4}08`,
                    border: `1px solid ${scored ? `${sc}40` : `${C.text4}20`}`,
                    transition: "all 0.3s ease",
                  }}>
                    <span style={{ fontSize: 8, fontWeight: 600, letterSpacing: "0.03em", textTransform: "uppercase", color: scored ? sc : C.text3, textAlign: "center" }}>{d.title}</span>
                  </div>
                );
              })}
            </div>

            <div style={{ textAlign: "center", fontSize: 10, color: C.text3, fontStyle: "italic" }}>
              Score yourself 1–6 on each of the 10 dimensions. Your results update automatically on the summary page.
            </div>
          </div>
        </Page>
        <div className="page-gap" style={{ height: 24 }}/>

        {/* ═══ PAGE 2: HOW TO USE ═══ */}
        <Page pageNum={++pageNum} allScored={allScored}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: C.green, marginBottom: 10 }}>HOW TO USE THIS DIAGNOSTIC</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 400, lineHeight: 1.2, marginBottom: 18 }}>
            <span style={{ color: C.gold }}>Think in continuums,</span> <span style={{ color: C.text1 }}>not checkboxes.</span>
          </div>
          <p style={{ fontSize: 12, lineHeight: 1.65, color: C.text2, marginBottom: 10 }}>
            This isn't a quiz with right and wrong answers. It's a brutally honest assessment of where your Human Capital actually stands — not where you wish it stood. A $3M HVAC company with one indispensable technician and no documented training program is in a fundamentally different position than one with cross-trained crews and a formal apprenticeship pipeline. Both might have "good people" — but only one has Human Capital that fuels sustainable growth and commands premium value.
          </p>
          <p style={{ fontSize: 12, lineHeight: 1.65, color: C.text2, marginBottom: 20 }}>
            For each dimension, read the description, review the checklist honestly, and score yourself based on where you truly are — not where you plan to be. The gap between your current score and a 5 or 6 is your opportunity for value creation. Every point of improvement in Human Capital strengthens both your profitability (through productivity and retention) and your enterprise value (through reduced risk and increased scalability).
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
                <div style={{ fontSize: 11, lineHeight: 1.5, color: C.text2 }}>Genuine competitive advantage. Your talent systems outperform your industry peers — you attract, retain, and develop people better than your competitors. This area is a strategic asset that drives growth and commands premium value.</div>
              </div>
              <div style={{ flex: 1, padding: "10px 14px", borderRadius: 8, background: `${C.green}08`, border: `1px solid ${C.green}20` }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 4 }}>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: C.green }}>6</span>
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: C.green }}>Perfect</span>
                </div>
                <div style={{ fontSize: 11, lineHeight: 1.5, color: C.text2 }}>Nothing meaningful left to improve. Most honest operators rarely give themselves this score. If you do, be certain you'd bet your house on it — because it will be tested, whether by growth demands, market shifts, or a buyer's due diligence team.</div>
              </div>
            </div>
          </div>

          {/* For Each Section */}
          <div style={{ padding: "14px 18px", borderRadius: 10, background: `${C.gold}06`, border: `1px solid ${C.gold}20` }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: C.gold, marginBottom: 6 }}>For Each Dimension</div>
            <div style={{ fontSize: 11, lineHeight: 1.6, color: C.text2 }}>
              Read the description and checklist honestly. Use the checklist as a gut-check — not a scorecard. Then use the <b style={{ color: C.text1 }}>Rate Yourself</b> panel at the bottom to assign your score. All 10 dimensions contribute to your overall Human Capital score. Your results aggregate automatically.
            </div>
          </div>
        </Page>
        <div className="page-gap" style={{ height: 24 }}/>

        {/* ═══ PAGES 3–12: DIMENSION PAGES ═══ */}
        {DIMS.map((dim) => {
          pageNum++;
          return (
            <div key={dim.key}>
              <Page pageNum={pageNum} allScored={allScored}>
                <div style={{ position: "relative" }}>
                  <div style={{ position: "absolute", top: -10, right: -10, fontFamily: "'Cormorant Garamond', serif", fontSize: 140, fontWeight: 700, color: ACCENT, opacity: 0.035, lineHeight: 1, userSelect: "none" }}>
                    {String(dim.num).padStart(2, "0")}
                  </div>

                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: ACCENT, marginBottom: 4 }}>
                    Dimension {String(dim.num).padStart(2, "0")} of {dim.of}
                  </div>

                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.02em", lineHeight: 1.15, marginBottom: 4 }}>
                    {dim.title}
                  </div>

                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: ACCENT, marginBottom: 16 }}>
                    {dim.subtitle}
                  </div>

                  <p style={{ fontSize: 12, lineHeight: 1.65, color: C.text2, marginBottom: 18 }}>
                    {dim.description}
                  </p>

                  <div style={{ padding: "12px 18px", borderRadius: 10, background: `linear-gradient(135deg, ${ACCENT}08, ${ACCENT}02)`, border: `1px solid ${ACCENT}20`, marginBottom: 8 }}>
                    {dim.checks.map((c, ci) => (
                      <CheckItem key={ci} text={c.text} sub={c.sub}
                        checked={!!checks[`${dim.key}-${ci}`]}
                        onToggle={() => toggleCheck(dim.key, ci)}/>
                    ))}
                  </div>

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
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: ACCENT, marginBottom: 6 }}>Your Human Capital Score</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 500, lineHeight: 1.2, marginBottom: 16 }}>
            How strong is the <span style={{ color: ACCENT }}>talent engine</span> behind your business?
          </div>

          {/* Score bars */}
          {DIMS.map(d => {
            const sc = scores[d.key];
            const barColor = sc ? scoreColor(sc) : C.text4;
            const pct = sc ? (sc / 6) * 100 : 0;
            return (
              <div key={d.key} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
                <span style={{ fontSize: 9.5, color: C.text2, width: 195, flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.title}</span>
                <div style={{ flex: 1, height: 8, borderRadius: 4, background: `${C.text4}20`, overflow: "hidden" }}>
                  <div style={{ width: `${pct}%`, height: "100%", borderRadius: 4, background: barColor, transition: "all 0.4s ease", boxShadow: sc ? `0 0 6px ${barColor}40` : "none" }}/>
                </div>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 13, fontWeight: 700, color: sc ? barColor : C.text4, width: 22, textAlign: "right" }}>
                  {sc || "–"}
                </span>
              </div>
            );
          })}

          {/* Total */}
          <div style={{ padding: "12px 16px", borderRadius: 10, background: `${ACCENT}08`, border: `1.5px solid ${ACCENT}30`, display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, marginBottom: 16 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: ACCENT }}>Total Human Capital Score</span>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: allScored && gateUnlocked ? (activeBand?.color || ACCENT) : C.text4 }}>
              {totalScore}<span style={{ fontSize: 13, color: C.text3 }}>/{maxScore}</span>
              {allScored && gateUnlocked && <span style={{ fontSize: 13, fontWeight: 600, color: C.text2, marginLeft: 8 }}>({Math.round((totalScore / maxScore) * 100)}%)</span>}
            </span>
          </div>

          {/* Diagnosis */}
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
                Every dimension you just scored represents a talent lever — a specific place where improving your Human Capital can increase both your operational performance and your enterprise value. The gaps aren't failures. They're the untapped value hiding in your team.
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.text1 }}>
                The businesses that command premium growth and premium valuations don't just have good people — they have talent systems that attract, develop, and retain A-players automatically.
              </div>
            </div>
          )}

          {/* Banding Cards (gated) */}
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
            toolName="Human Capital Deep-Dive"
            toolSlug="human-capital"
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
                return (
                  <div key={d.key} style={{ padding: "14px 18px", borderRadius: 10, background: `${ACCENT}06`, border: `1px solid ${ACCENT}20`, marginBottom: 12 }}>
                    <div style={{ display: "table", padding: "3px 10px", borderRadius: 5, background: `${C.gold}15`, border: `1px solid ${C.gold}30`, marginBottom: 8 }}>
                      <span style={{ display: "table-cell", verticalAlign: "middle", fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: C.gold }}>MOVE {String(i + 1).padStart(2, "0")}</span>
                    </div>
                    <div style={{ fontSize: 10, color: ACCENT, fontWeight: 600, marginBottom: 2 }}>
                      {d.title} <span style={{ color: scoreColor(sc) }}>({sc}/6)</span>
                    </div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontWeight: 600, color: C.text1, marginBottom: 4 }}>{tactic.title}</div>
                    <div style={{ fontSize: 10.5, lineHeight: 1.55, color: C.text2 }}>{tactic.context}</div>
                  </div>
                );
              })}

              {/* Qualifier */}
              <div style={{ padding: "14px 18px", borderRadius: 10, background: `${ACCENT}06`, border: `1.5px solid ${ACCENT}25`, marginTop: 16, marginBottom: 16 }}>
                <div style={{ fontSize: 11.5, lineHeight: 1.65, color: C.text2 }}>
                  You can implement these yourself — or our team can see if you qualify for us to help you build a talent engine that drives your business toward becoming a <span style={{ color: ACCENT, fontWeight: 700 }}>Masterpiece Business</span> that future buyers fight one another to acquire.
                </div>
              </div>

              {/* CONSTRAINT Email CTA */}
              <div style={{ padding: "20px 24px", borderRadius: 12,
                background: `linear-gradient(135deg, ${C.gold}10, ${C.gold}04)`, border: `2px solid ${C.gold}40`,
                boxShadow: `0 0 24px ${C.gold}12, inset 0 1px 0 ${C.gold}15`, textAlign: "center" }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 600, color: C.text1, marginBottom: 10 }}>
                  Want the full action plan for <span style={{ color: C.gold }}>every</span> weak area?
                </div>
                <p style={{ fontSize: 13, color: C.text2, lineHeight: 1.6, marginBottom: 6 }}>
                  Email the word <span style={{ color: C.gold, fontWeight: 800, fontSize: 15, letterSpacing: "0.1em" }}>TALENT</span> to
                </p>
                <div style={{ fontSize: 18, fontWeight: 700, color: C.cyan, letterSpacing: "0.02em", marginBottom: 12 }}>
                  scale@kriczkyvirtus.com
                </div>
                <p style={{ fontSize: 10.5, color: C.text3, lineHeight: 1.55, maxWidth: 460, margin: "0 auto" }}>
                  We'll send you a personalized list of prioritized action steps based on your weakest dimensions — your full Human Capital playbook delivered to your inbox.
                </p>
              </div>
            </Page>
            <div className="page-gap" style={{ height: 24 }}/>
          </>
        )}

        {/* ═══ CTA PAGE ═══ */}
        <Page pageNum={allScored ? TOTAL_PAGES_WITH_MOVES : TOTAL_PAGES_BASE} allScored={allScored}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: C.gold, marginBottom: 10 }}>What Happens Next</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 500, lineHeight: 1.2, marginBottom: 20 }}>
            Knowing your <span style={{ color: ACCENT }}>Human Capital</span> score is the beginning, not the end.
          </div>

          {/* Edward headshot + bio */}
          <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 18 }}>
            <div style={{ width: 88, height: 88, borderRadius: "50%", flexShrink: 0, overflow: "hidden", outline: `2px solid ${C.gold}40`, outlineOffset: 2, background: C.bgElev }}>
              <img src={HEADSHOT} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}/>
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.text1 }}>Edward Kriczky, <span style={{ color: C.text1 }}>CEPA</span></div>
              <div style={{ fontSize: 11, color: C.gold, marginBottom: 6 }}>Founder, Kriczky Virtus</div>
              <div style={{ fontSize: 11, lineHeight: 1.6, color: C.text2 }}>
                Most owners know their people matter — but they've never had a framework to measure, improve, and systematize their Human Capital. That's the gap this assessment reveals. The distance between where you scored and best-in-class isn't a problem — it's a roadmap for building the kind of team that makes your business a Masterpiece. Let's build it together.
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
              <GlassBtn href="https://kriczkyvirtus.com/call" color={C.gold}>BOOK YOUR FREE CALL</GlassBtn>
            </div>
          </div>

          {/* Closing quote */}
          <div style={{ padding: "14px 0 14px 18px", borderLeft: `3px solid ${C.gold}60`, marginBottom: 14 }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontStyle: "italic", lineHeight: 1.5, color: C.text1 }}>
              First who, then what. The companies that built lasting greatness didn't start by setting direction — they started by getting the right people on the bus and the wrong people off the bus. Your Human Capital isn't a line item. It's the engine that determines whether your business grows, stalls, or falls apart the day you step away. What you build in your people is what you <span style={{ color: C.gold, fontWeight: 700, fontStyle: "normal" }}>ultimately sell.</span>
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
