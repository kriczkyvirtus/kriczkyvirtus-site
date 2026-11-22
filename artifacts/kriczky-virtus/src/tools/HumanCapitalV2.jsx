import DeepDiveReport, { TONE } from "./DeepDiveReport.jsx";

/* ═══════════════════════════════════════════════════════════════
   HUMAN CAPITAL DEEP-DIVE - v2 content (22 Nov 2026)
   The same dimensions, checklists, bands and copy as HumanCapital.jsx (v1), em dashes
   swapped for " - ", laid out by the shared cream report frame (DeepDiveReport.jsx).
   ═══════════════════════════════════════════════════════════════ */

const C = {
  gold: "#C8A24E", green: "#34D399", red: "#F87171", amber: "#FBBF24", amberDark: "#D4A017",
  blue: "#60A5FA", cyan: "#22D3EE", purple: "#A78BFA",
};

/* ── DIMENSIONS (10) ── */
export const DIMS = [
  {
    key: "d1", num: 1, of: 10,
    title: "Talent Acquisition & Employer Brand",
    subtitle: "Can you attract A-players, or are you always settling?",
    description: "A $3M plumbing company posted the same Craigslist ad for six months and got the same C-players every time. A competitor built a reputation as the place where technicians get trained, certified, and treated well - they had a waitlist. The difference wasn't pay. It was brand. Your ability to attract top talent before you need them - proactively, not reactively - is the leading indicator of whether your team gets stronger or weaker each year. Whether you're scaling or preparing for an eventual exit, your hiring pipeline is a leading indicator - if it's dry, growth is capped.",
    checks: [
      { text: "We have a defined employer value proposition that differentiates us from competitors.", sub: "Why would an A-player choose you over three other offers? If you can't answer in one sentence, neither can they." },
      { text: "Open roles are filled within 45 days with qualified candidates, not just warm bodies.", sub: "Speed-to-fill is a proxy for brand strength. The best employers fill fast because talent comes to them." },
      { text: "We recruit proactively - building relationships with potential hires before positions open.", sub: "The best hire you'll ever make is someone you've been cultivating for six months, not someone who applied cold." },
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
        { title: "Build a 'Future Talent' list of 10 people you'd hire if they were available", context: "Maintain casual relationships with them - coffee, LinkedIn, industry events. When a role opens, you call them before posting." },
        { title: "Standardize your interview process with a scorecard", context: "Every interviewer scores the same five competencies on a 1–5 scale. Eliminates gut-feel hiring and makes A/B/C player identification objective." },
        { title: "Create an employee referral bonus program", context: "Your A-players know other A-players. A $1,000–$2,500 referral bonus is a fraction of what a recruiter charges and yields better cultural fits." },
      ],
      high: [
        { title: "Develop a talent pipeline partnership with a local trade school or university", context: "The companies that win the talent war long-term are the ones embedded in the pipeline - internships, guest lectures, scholarship sponsors." },
        { title: "Benchmark your time-to-fill and quality-of-hire against industry leaders", context: "Track both metrics quarterly. If you're best-in-class, document it - it's a competitive moat that drives growth and commands premium valuations." },
      ],
    },
  },
  {
    key: "d2", num: 2, of: 10,
    title: "Compensation Architecture",
    subtitle: "Is your pay structure built to retain, or built to lose?",
    description: "A marketing agency paid everyone 'market rate' - which meant they matched whatever the last competitor offered. No structure, no transparency, no logic. Their best designer left for $8K more because she couldn't see a path forward. A competing firm built tiered compensation with clear progression: base salary, performance bonuses, and upside incentives tied directly to the employee's specific performance. Compensation isn't just about how much - it's about how the structure creates loyalty, alignment, and long-term commitment.",
    checks: [
      { text: "Every role has a documented compensation band with clear criteria for advancement.", sub: "If people don't know what it takes to earn more, they'll assume the answer is 'leave.'" },
      { text: "We benchmark compensation against market data at least annually.", sub: "You can't retain talent if you don't know what they're worth to everyone else." },
      { text: "Variable compensation (bonuses, profit-sharing, equity) is tied to measurable outcomes.", sub: "Bonuses without metrics are gifts. Incentives tied to your desired outcomes are alignment engines." },
      { text: "Our compensation structure is transparent enough that employees trust it's fair.", sub: "Perceived unfairness - even when pay is adequate - is one of the top drivers of voluntary turnover." },
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
        { title: "Commission a formal compensation audit from an HR consultant", context: "An external audit validates your structure, identifies gaps, and gives you a defensible framework - whether you're scaling the team or preparing for due diligence." },
      ],
    },
  },
  {
    key: "d3", num: 3, of: 10,
    title: "Retention & Flight Risk",
    subtitle: "Would your top 3 people leave tomorrow if a better offer came?",
    description: "Here's the uncomfortable truth: your best people have options. They get recruited constantly. The only question is whether you've given them enough reasons to say no. A $6M IT services firm lost their top engineer to a competitor who offered 20% more. The owner said, 'I didn't even know he was looking.' That's the problem - he wasn't looking. The opportunity found him, and he had no compelling reason to stay. Retention isn't about counter-offers. It's about building an environment where your best people feel invested, valued, and connected to a future they can see and a mission they believe in.",
    checks: [
      { text: "We know specifically what motivates each of our top 5 employees - and it's not the same for all of them.", sub: "One wants autonomy, another wants development, a third wants recognition. Treating them identically is a retention mistake." },
      { text: "Voluntary turnover in key roles is below 10% annually.", sub: "Above 15% in critical positions signals systemic retention problems that limit your ability to scale - and that any future buyer will flag immediately." },
      { text: "We conduct stay interviews (not just exit interviews) at least annually.", sub: "Exit interviews tell you why people left. Stay interviews tell you why they might - while you can still fix it." },
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
    description: "In a $4M construction firm, three project managers all thought someone else was responsible for client communication. So nobody did it consistently. Clients complained, projects ran over, and the owner spent half his day putting out fires that shouldn't have been his. Contrast that with a $2M accounting firm where every team member has a one-page role charter: their three key responsibilities, two KPIs they own, and who they escalate to. The owner takes two-week vacations. Role clarity isn't bureaucracy - it's the operating system that lets a business run without its owner being the router for every question.",
    checks: [
      { text: "Every employee has a documented role with specific responsibilities, decision authority, and KPIs.", sub: "Not a generic job description from Indeed - a living document that says 'you own these outcomes.'" },
      { text: "Accountability is enforced - underperformance is addressed within 30 days, not tolerated for months.", sub: "A-players lose respect for leadership that tolerates C-players. The fastest way to lose your best people is to keep your worst." },
      { text: "Team members can clearly articulate what success looks like in their role.", sub: "Ask any employee: 'How do you know if you're doing a great job?' If they hesitate, your role clarity needs work." },
      { text: "Escalation paths are defined - people know when and how to elevate decisions.", sub: "If every hard decision routes to the owner, you don't have role clarity. You have a bottleneck." },
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
        { title: "Audit decision-making latency - measure how long key decisions take from initiation to resolution", context: "If decisions take weeks instead of days, your authority structure has bottlenecks. Map them and push authority down." },
      ],
    },
  },
  {
    key: "d5", num: 5, of: 10,
    title: "Cross-Training & Redundancy",
    subtitle: "If your best person in any role disappeared, who picks it up?",
    description: "A $5M manufacturing company had one machinist who was the only person who could operate their CNC equipment. When he had a family emergency and was out for three weeks, they lost $180K in delayed orders. A smarter competitor cross-trained three people on every machine - no single absence ever cost them a sale. Cross-training isn't a luxury. It's insurance against the inevitable reality that people get sick, take vacations, get recruited, or simply decide to leave. Every role that lives in one person's head is a risk that limits your ability to grow, absorb disruption, and command premium value.",
    checks: [
      { text: "Every critical function has at least one documented backup person.", sub: "Not 'someone could probably figure it out' - an identified, trained person who has actually performed the function." },
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
        { title: "Schedule shadow days - one person shadows another for a half-day each month", context: "It's the fastest, lowest-cost way to build cross-functional knowledge. Start with your highest-risk roles." },
      ],
      mid: [
        { title: "Build a cross-training calendar with monthly rotation assignments", context: "Assign one cross-training task per month per team member. In 12 months, you'll have meaningful redundancy across the organization." },
        { title: "Run a 'fire drill' - have a key person take a surprise day off while their backup covers", context: "You'll learn in one day whether your cross-training is real or theoretical. The gaps it reveals are exactly what needs fixing next." },
        { title: "Create video walkthroughs of your 5 most critical processes", context: "A 10-minute Loom video is worth 10 pages of documentation. It captures nuance, context, and the 'why' behind each step." },
      ],
      high: [
        { title: "Implement job rotation for your leadership team - quarterly functional swaps", context: "Leaders who understand multiple functions make better decisions and can cover for each other. It also develops general managers, not just specialists." },
        { title: "Stress-test your redundancy by having the owner take two consecutive weeks completely offline", context: "If the business runs smoothly, your cross-training is real. If it doesn't, you just found your remaining gaps." },
      ],
    },
  },
  {
    key: "d6", num: 6, of: 10,
    title: "Leadership Development Pipeline",
    subtitle: "Are you building the next generation, or hoping they emerge?",
    description: "Companies with the best long-term results have leaders who invest in developing their successors - not leaders who made themselves indispensable. A $7M electrical contractor had the owner running every job meeting. When asked who could take over, he said, 'Nobody's ready.' But he'd never given anyone the chance to get ready. Compare that to a $4M digital agency whose founder identified two future leaders three years ago, gave them increasing responsibility, and now only attends quarterly reviews. His business can scale - or sell - without him. The first one can't.",
    checks: [
      { text: "We have identified 2–3 people who could step into leadership roles within 12 months.", sub: "If your leadership pipeline is empty, your business has a ceiling - whether you're trying to scale or sell." },
      { text: "Emerging leaders are given real authority and decision-making opportunities, not just titles.", sub: "Leadership develops through practice, not observation. Are you giving people the chance to lead, or just the label?" },
      { text: "We invest in formal development (training, coaching, mentoring) for high-potential employees.", sub: "Sending someone to a conference isn't development. A structured growth plan with accountability, and execution metrics, is." },
      { text: "Our leadership bench could run the business for 90 days without the owner.", sub: "This is the acid test. If the answer is no, your Human Capital has a leadership pipeline problem." },
    ],
    lowLabel: "No bench, owner dependent",
    highLabel: "Deep leadership pipeline",
    quickWins: {
      low: [
        { title: "Identify your top 2 high-potential employees and tell them they're being developed for leadership", context: "People can't grow into roles they don't know exist. Naming someone as a future leader changes their mindset from 'employee' to 'co-builder' overnight." },
        { title: "Delegate one recurring leadership meeting to someone else this month", context: "Pick a meeting you currently run - a team standup, a client review - and hand it off. Coach from behind, don't rescue from the front." },
        { title: "Create a simple 'leadership readiness' scorecard for your top prospects", context: "Rate them on 5 competencies (decision-making, communication, accountability, strategic thinking, people management). It reveals exactly where to focus development." },
      ],
      mid: [
        { title: "Enroll your top 2 prospects in a formal leadership development program", context: "Vistage, EOS, a local business accelerator - structured programs accelerate development 3x faster than on-the-job learning alone." },
        { title: "Assign each prospect a stretch project that's outside their comfort zone", context: "A sales leader managing a product launch. An ops person leading a client relationship. Stretch assignments build general management capability." },
        { title: "Implement monthly 1-on-1 coaching sessions with your emerging leaders", context: "30 minutes, focused on their development - not task management. Ask: What did you learn? Where did you struggle? What will you do differently?" },
      ],
      high: [
        { title: "Have your top prospect run the business for two weeks while you observe from the sideline", context: "Give them full authority with a safety net. The lessons they learn in those two weeks are worth two years of theoretical development." },
        { title: "Document your leadership pipeline formally - names, timelines, readiness scores - and present it to your advisory team", context: "A documented pipeline is a scalable asset. It says: this business has depth beyond the founder." },
      ],
    },
  },
  {
    key: "d7", num: 7, of: 10,
    title: "Performance Management",
    subtitle: "Do you differentiate between A, B, and C players - and act on it?",
    description: "Jack Welch's vitality model - the 20/70/10 framework - argues that roughly 20% of your people are A-players (top performers), 70% are solid B-players (the backbone), and 10% are C-players (underperformers). The businesses that grow enterprise value are ruthless about developing their A's, coaching their B's upward, and moving their C's out. A $3M staffing agency kept a chronically underperforming recruiter for two years because 'she's been here forever.' During that time, two A-players left - partly because they watched mediocrity get tolerated. The cost of keeping C-players isn't their low output. It's the A-players you lose because of the message it sends.",
    checks: [
      { text: "We formally evaluate every employee's performance at least twice a year against documented expectations.", sub: "Not an annual review that surprises people - ongoing, structured feedback with clear benchmarks tied to actions they can 'do', not unquantifiable metrics." },
      { text: "A-players are rewarded, C-players are coached or exited within 90 days.", sub: "Tolerating C-players is the fastest way to tell your A-players that performance doesn't actually matter here." },
      { text: "Managers have the skills and authority to have difficult performance conversations.", sub: "If your managers avoid tough conversations, underperformance festers. Training managers to give direct feedback is a force multiplier." },
      { text: "Performance data informs compensation, promotion, and succession decisions - not tenure or politics.", sub: "If your longest-tenured person makes the most regardless of output, your system rewards survival over results." },
    ],
    lowLabel: "No system, C-players tolerated",
    highLabel: "Rigorous, differentiated management",
    quickWins: {
      low: [
        { title: "Rank your entire team A/B/C this week - honestly, on paper", context: "Don't show anyone. Just get honest with yourself about who is a top performer, who is solid, and who you've been avoiding dealing with." },
        { title: "Have the difficult conversation with your most obvious C-player within 14 days", context: "Set clear expectations, a 30-day improvement timeline, and specific consequences. The conversation you're avoiding is costing you more than you think." },
        { title: "Ask your A-players if they feel their performance is recognized and rewarded differently", context: "If A-players don't see a distinction between their treatment and a C-player's, they'll eventually stop being A-players - or stop being yours." },
      ],
      mid: [
        { title: "Implement a simple quarterly review process - 30 minutes per person", context: "Review 2–3 KPIs, discuss development, and calibrate expectations. Quarterly frequency prevents surprises and keeps improvement continuous." },
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
    subtitle: "Is there a named successor for every critical role - including yours?",
    description: "The EPI Owner Readiness Survey reveals that only 29% of business owners have identified a successor. Whether you're building to scale or building to sell, the question 'Who runs this if you step back?' has the same answer: it better not be silence. Succession readiness isn't about retirement planning - it's about risk mitigation and growth capacity. A named, developed successor for every critical role (including the owner's) means the business can expand, weather disruptions, and - when the time comes - transfer cleanly at a premium.",
    checks: [
      { text: "The owner has a named successor who could take over within 6–12 months.", sub: "Not 'I'll figure it out when the time comes.' A specific person, with a specific development plan, on a specific timeline." },
      { text: "Every department head or critical role has at least one identified successor.", sub: "Succession gaps at the leadership level cap your growth and create risk. Each gap is a constraint on scaling - and a discount on your valuation." },
      { text: "Successors are actively being developed - not just named on paper.", sub: "A name without development is a wish, not a plan. Are they getting the experiences and authority they need?" },
      { text: "The succession plan has been stress-tested - a key leader has been absent for an extended period.", sub: "The plan works when it's been tested. Everything else is theory." },
    ],
    lowLabel: "No plan, no successors",
    highLabel: "Named, developed successors",
    quickWins: {
      low: [
        { title: "Write down one name for your own successor - even if they're not ready yet", context: "Just naming someone shifts your mindset from 'indispensable' to 'developing my replacement.' It's the hardest and most important step in building a business that doesn't depend on you." },
        { title: "Create a succession map: every critical role, the current occupant, and a potential backup", context: "A simple spreadsheet. Every empty cell in the 'backup' column is a risk that limits your growth and your options." },
        { title: "Have an honest conversation with your most likely successor about their interest and readiness", context: "Don't assume they want the role. And don't assume they don't. Ask, then build a plan around reality." },
      ],
      mid: [
        { title: "Build 12-month development plans for your top 3 successors with quarterly milestones", context: "Specific skills, experiences, and authority levels they need to reach. Review progress quarterly. Adjust as needed." },
        { title: "Give your most advanced successor P&L responsibility for a division or major client", context: "Nothing tests readiness like ownership of financial outcomes. It also tells you exactly where they need more development." },
        { title: "Create a 'transition playbook' documenting the owner's unique knowledge and relationships", context: "Every client relationship, vendor contact, and institutional insight in the owner's head needs to be on paper - or it disappears the day you step back." },
      ],
      high: [
        { title: "Run a formal succession simulation - the owner steps back for 30 days with the successor in charge", context: "The only way to validate a succession plan is to test it. A 30-day simulation reveals gaps no amount of planning can." },
        { title: "Present your succession plan to your advisory board, banker, or potential buyer as a formal document", context: "A documented, tested succession plan is a premium-grade asset - it tells your team, your board, and any future buyer that this business transfers cleanly." },
      ],
    },
  },
  {
    key: "d9", num: 9, of: 10,
    title: "Team Culture & Engagement",
    subtitle: "Do your people show up with energy and ownership, or punch a clock?",
    description: "Culture isn't foosball tables and free snacks. It's what happens when you're not in the room. A $5M home services company had low turnover on paper, but the owner noticed that his best people stopped volunteering for extra projects. They showed up, did the minimum, and left at 5:00. They were 'quiet quitting' - present but disengaged. Meanwhile, a competing firm with similar pay had employees who pitched improvement ideas, covered for each other voluntarily, and referred friends to open positions. The difference was that the second firm had a culture where people felt ownership, not just employment. Engaged teams produce more, innovate more, and stay longer - all of which compound into business valuation.",
    checks: [
      { text: "Team members volunteer ideas, improvements, and solutions without being asked.", sub: "Voluntary initiative is the clearest signal of engagement. If ideas only flow downward, your culture is directive, not participative." },
      { text: "Employees would recommend working here to a friend - genuinely, not as a favor.", sub: "The employee referral rate is the ultimate culture metric. Would your people stake their reputation on bringing someone they respect into this environment?" },
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
        { title: "Implement a peer recognition program - let team members publicly acknowledge each other", context: "A simple Slack channel or weekly shout-out board where peers recognize peers. Recognition from colleagues often means more than recognition from the boss." },
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
    description: "A $4M consulting firm hired a senior associate and handed her a laptop. No onboarding plan, no training schedule, no documentation of how things worked. It took her four months to become productive - and she almost quit at month two. Across town, a competing firm had a 30-60-90 day onboarding program: week one covered systems and processes, month one paired the new hire with a mentor, and month three included a client-facing project with supervision. Their new hires were billing clients within 45 days. The speed at which a new hire reaches full productivity is a direct measure of how well your institutional knowledge is captured and transferable. Fast onboarding is evidence of strong institutional knowledge - it means your business can absorb new talent and scale without bottlenecks. Slow onboarding signals that knowledge lives in people's heads, not in the company.",
    checks: [
      { text: "We have a documented onboarding program with clear milestones for the first 90 days.", sub: "Not a folder of forms. A step-by-step plan that tells the new hire exactly what they'll learn, do, and be measured on at 30, 60, and 90 days." },
      { text: "New hires are paired with a mentor or onboarding lead for their first 90 days.", sub: "Mentorship cuts ramp-up time in half and reduces early turnover by 50%. It's the highest-ROI investment in any new hire." },
      { text: "Critical process knowledge is documented in a format a new hire can access and learn from independently.", sub: "SOPs, video walkthroughs, checklists - if a new hire has to ask 'how do we do X?' for every task, your knowledge transfer is broken." },
      { text: "We measure time-to-productivity for new hires and actively work to reduce it.", sub: "If you don't measure it, you can't improve it. Track the weeks from hire date to full productivity, and make it a leadership KPI." },
    ],
    lowLabel: "Sink or swim, tribal knowledge",
    highLabel: "Structured, fast ramp-up",
    quickWins: {
      low: [
        { title: "Create a 'Week 1 Checklist' for new hires - the 20 things every person needs on day one", context: "Laptop, logins, key contacts, org chart, client list, top 10 processes. A single Google Doc eliminates 80% of first-week confusion." },
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
    desc: "You have some capable people but your talent infrastructure is thin. Retention, development, and documentation gaps mean your team's value is volatile - dependent on individuals rather than embedded in the business." },
  { label: "Talent Established", min: 36, max: 48, range: "36–48", color: C.cyan,
    desc: "Your team is a genuine asset. Core talent is retained, roles are defined, and leadership is developing. The remaining gaps are specific and addressable - closing them moves you from good to best-in-class." },
  { label: "Talent Powerhouse", min: 49, max: 60, range: "49–60", color: C.green,
    desc: "Your Human Capital is a competitive weapon. Deep bench, strong culture, clear accountability, and a pipeline that sustains itself. Whether you're scaling aggressively or positioning for an eventual exit, your team is one of your most valuable assets." },
];

/* ── This tool's content for the shared report frame ── */
export const HUMAN = {
  tool: "Human Capital", accent: TONE.purple, dims: DIMS, bands: BANDS,
  toolSlug: "human-capital", storeSlug: "human-capital-deep-dive",
  coverSub: "Talent, Leadership & Bench Depth",
  principle: (A) => [
    <>Your people are your most valuable - and most volatile - asset. Human Capital measures the strength of your talent, their ability to execute independently, and whether that talent stays when you're not looking. Whether you're scaling or building toward a future exit, the value of your business lives in the <span style={{ color: A.fill, fontWeight: 600 }}>team that generates it</span>. If that team can't function without you, or if your best people could walk out tomorrow, your business has a Human Capital problem that directly limits your growth and your options.</>,
  ],
  stat: (A) => <><span style={{ color: A.fill, fontWeight: 700 }}>62% of business owners</span> say finding and retaining top talent is their biggest challenge. Prioritize "First Who, Then What" - the right people in the right seats is the single best predictor of business value growth.</>,
  howHead: <>Think in continuums, <em>not checkboxes.</em></>,
  howP1: "This isn't a quiz with right and wrong answers. It's a brutally honest assessment of where your Human Capital actually stands - not where you wish it stood. A $3M HVAC company with one indispensable technician and no documented training program is in a fundamentally different position than one with cross-trained crews and a formal apprenticeship pipeline. Both might have \"good people\" - but only one has Human Capital that fuels sustainable growth and commands premium value.",
  howP2: "For each dimension, read the description, review the checklist honestly, and score yourself based on where you truly are - not where you plan to be. The gap between your current score and a 5 or 6 is your opportunity for value creation. Every point of improvement in Human Capital strengthens both your profitability (through productivity and retention) and your enterprise value (through reduced risk and increased scalability).",
  best5: "Genuine competitive advantage. Your talent systems outperform your industry peers - you attract, retain, and develop people better than your competitors. This area is a strategic asset that drives growth and commands premium value.",
  perfect6: "Nothing meaningful left to improve. Most honest operators rarely give themselves this score. If you do, be certain you'd bet your house on it - because it will be tested, whether by growth demands, market shifts, or a buyer's due diligence team.",
  summaryHead: <>How strong is the <em>talent engine</em> behind your business?</>,
  lever: "Every dimension you just scored represents a talent lever - a specific place where improving your Human Capital can increase both your operational performance and your enterprise value. The gaps aren't failures. They're the untapped value hiding in your team.",
  premium: "The businesses that command premium growth and premium valuations don't just have good people - they have talent systems that attract, develop, and retain A-players automatically.",
  qualifier: (A) => <>You can implement these yourself - or our team can see if you qualify for us to help you build a talent engine that drives your business toward becoming a <span style={{ color: A.ink, fontWeight: 700 }}>Masterpiece Business</span> that future buyers fight one another to acquire.</>,
  bio: "Most owners know their people matter - but they've never had a framework to measure, improve, and systematize their Human Capital. That's the gap this assessment reveals. The distance between where you scored and best-in-class isn't a problem - it's a roadmap for building the kind of team that makes your business a Masterpiece. Let's build it together.",
  quote: <>First who, then what. The companies that built lasting greatness didn't start by setting direction - they started by getting the right people on the bus and the wrong people off the bus. Your Human Capital isn't a line item. It's the engine that determines whether your business grows, stalls, or falls apart the day you step away. What you build in your people is what you <span style={{ color: TONE.gold.ink, fontWeight: 700, fontStyle: "normal" }}>ultimately sell.</span></>,
};

export default function HumanCapitalV2({ prefill = null }) {
  return <DeepDiveReport cfg={HUMAN} prefill={prefill} />;
}
