/* ═══════════════════════════════════════════════════════════════
   REINVEST OR HARVEST — REPORT CONTENT
   The words and numbers behind /r/:token, kept apart from the layout in
   ReinvestHarvestReport.jsx. Colours are named tones ("gold", "green"…)
   that the report resolves for the cream theme.
   ═══════════════════════════════════════════════════════════════ */

export const PILLAR_MAX = 30;
export const THRESHOLD = 18;
export const BIZ_KEYS = ["b1", "b2", "b3", "b4", "b5"];
export const PERS_KEYS = ["p1", "p2", "p3", "p4", "p5"];
/* Business Capacity is gold, Personal Foundation green, everywhere. */
export const PILLAR_TONE = { biz: "gold", pers: "green" };

/* Scores, as on the scorecard: red 1–2, amber 3, gold 4, cyan 5, green 6. */
export const scoreToneKey = (n) => (!n ? "muted" : n <= 2 ? "red" : n === 3 ? "amber" : n === 4 ? "gold" : n === 5 ? "cyan" : "green");

/* Quadrant copy is mirrored from the thank-you page — single source of truth. */
export const QUADRANTS = {
  reinvest: { key: "reinvest", label: "Reinvest-Weighted", tone: "green",
    line: "You've earned the right to be aggressive if you want to. Real opportunities inside, and enough outside that a bad year is a setback, not a reset. Few owners have both.",
    body: "You scored above the line on both sides, which is the position that most justifies leaning into the business. Money you put in comes back as profit in a way you can actually measure, the company can absorb more work without breaking, and — critically — you have enough outside it that a bad stretch is survivable. That second part is what makes pushing hard rational rather than reckless. Owners without it are taking the same risk with no parachute.",
    watch: "The most common failure from here is quiet. A strong year is exactly when owners stop funding the outside, because the business is throwing off obvious returns and everything else looks slow by comparison. What you built outside is the reason you can push hard. Don't spend it to fund the push." },
  split: { key: "split", label: "Concentrated Inside", tone: "gold",
    line: "Almost every extra dollar has gone back into the business, and that's how you built this engine. It's also how owners in this spot end up with everything riding on one asset. Now the job is to start deliberately paying yourself first without stalling growth.",
    body: "Your business scores well on its ability to turn money into more profit. That part is genuinely working, and it's why you keep feeding it. The problem is on the other side: almost everything you own now depends on that one company performing. This is the most seductive position on the matrix, because the business keeps offering the best visible return and reinvesting keeps looking like the obvious answer. It usually is, right up until it isn't. Concentration doesn't announce itself until something forces the issue.",
    watch: "Owners here rarely decide against building outside the business. They simply never get to it, because there is always a compelling use for the money inside. That's why the fix has to be automatic rather than intentional — a fixed share that leaves before the reinvestment decision gets made." },
  harvest: { key: "harvest", label: "Harvest-Weighted", tone: "cyan",
    line: "You've built the outside, which most owners never do. Your highest-return reinvestment now isn't more growth, it's fixing the one thing choking what your current growth produces.",
    body: "You've built real strength outside the business, which puts you ahead of most owners. But the business side scored low, which means money aimed at growth right now would mostly buy activity. Either the return on what you've already put in isn't measured, or the company can't absorb more work without something breaking, or there isn't proven demand waiting to be served. None of that means stop reinvesting. It means the highest-return place to put money is the constraint itself, not growth stacked on top of it.",
    watch: "Harvest-weighted doesn't mean take everything out. A business starved of reinvestment stops being worth anything to harvest from. The point is changing what you reinvest in — capacity, systems, the bottleneck — not whether you reinvest at all." },
  stabilize: { key: "stabilize", label: "Stabilize First", tone: "red",
    line: "Your highest-return move right now is the foundation itself. Build it first and every dollar you reinvest afterward works harder. Skip it and you just get busier.",
    body: "Both sides scored below the line, which means the reinvest-or-harvest framing isn't the most useful one for you yet. Money into a business that can't absorb it doesn't build value, and money out of thin margins into an empty reserve doesn't build a foundation. That sounds discouraging and shouldn't be. This is the most common position for owners who've grown fast, and it's also where a small number of specific fixes produce the largest visible change — because almost nothing has been optimised yet.",
    watch: "The trap is trying to grow your way out. Revenue running through a structure that hasn't been fixed amplifies the problem: you get bigger, busier, and no wealthier. Fix the floor first and the same growth lands very differently." },
};
export const getQuadrant = (b, p) => b >= THRESHOLD ? (p >= THRESHOLD ? QUADRANTS.reinvest : QUADRANTS.split)
                                                   : (p >= THRESHOLD ? QUADRANTS.harvest : QUADRANTS.stabilize);

export const BANDS = [
  { label: "Money On Autopilot", min: 10, max: 22, tone: "red",
    desc: "Money is moving through your business and your household without a framework directing it. That isn't a character flaw — it's the default, because nothing about running a company forces the question. But it means the decision is currently being made by whatever felt urgent that month." },
  { label: "Split Focus", min: 23, max: 35, tone: "amber",
    desc: "You've built real strength somewhere and left something else thin. Very common in the $1M–$10M range. The risk isn't that you're doing something wrong — it's that a one-sided foundation means a single bad outcome in the weak area can undo years of good work in the strong one." },
  { label: "Deliberate Allocator", min: 36, max: 48, tone: "cyan",
    desc: "You're making decisions with real information rather than instinct. Most of the machinery exists — you measure things, you have policies, you can answer questions other owners can't. The remaining gaps tend to be specific rather than structural. Note that this total says nothing about how your strength is distributed; the split below does." },
  { label: "Compounding Owner", min: 49, max: 60, tone: "green",
    desc: "A high total by any standard, reflecting real discipline on both the operating and the personal side. From here the reinvest-or-harvest question stops being a source of anxiety and becomes what it should be — a calculation you run with good inputs and revisit on a schedule." },
];

/* Course roadmap — mirrors the thank-you page. */
export const ROADMAP = [
  { n: "01", t: "You Are Here",           d: "The one decision everything else hangs on — the one you just scored.", tone: "gold",  ic: "c1" },
  { n: "02", t: "Know Your Numbers",      d: "What your last reinvestment returned, and how your margin compares.", tone: "gold",  ic: "c2" },
  { n: "03", t: "Find The Constraint",    d: "The single thing capping growth — and how to know it's the real one.", tone: "gold",  ic: "c3" },
  { n: "04", t: "The Profit Split System",d: "What goes back in, what holds in reserve, what comes out to you.",  tone: "green", ic: "c4" },
  { n: "05", t: "Build The Outside",      d: "Assets that aren't the company, and a tax plan that isn't paperwork.", tone: "green", ic: "c5" },
  { n: "06", t: "Your Wealth North Star",  d: "The destination that makes every future decision clear and answerable.", tone: "cyan",  ic: "c6" },
];

const REVENUE_BANDS = [
  { value: "Under $500K", qualified: false }, { value: "$500K - $1M", qualified: false },
  { value: "$1M - $3M", qualified: true }, { value: "$3M - $10M", qualified: true }, { value: "$10M+", qualified: true },
];
export const routeTo = (rev, tier) => (tier === "Leadership" || tier === "Employee") ? "collective"
  : ((REVENUE_BANDS.find(b => b.value === rev) || {}).qualified ? "oneToOne" : "collective");

export const DIMS = [
  {
    key: "b1", num: 1, of: 10, pillar: "biz",
    title: "Business ROI Opportunities",
    subtitle: "Do you know what your last big investment actually returned?",
    description: "A $4M dental group spent $180,000 building out three new operatories because the schedule \"felt full.\" Two years later nobody could say whether the rooms had paid for themselves. A practice down the road spent $60,000 on scheduling and recall software, measured the drop in no-shows and empty chair time, and knew inside one quarter that it had returned several times its cost. The difference wasn't money or courage — it was the habit of writing down an expected return before the money moved. Money reinvested without a measured return isn't investment. It's spending with a business narrative attached. And if you can't tell a good outcome from a lucky one, you can't repeat either.",
    checks: [
      { text: "I can name the return on the last major investment I made in this business.", sub: "The equipment, the hire, the software, the buildout, the location. What did it produce, and over what period?" },
      { text: "Before I spend money on growth, I write down what I expect it to produce and by when.", sub: "A number and a date. Without both, every outcome can be rationalized after the fact." },
      { text: "I go back and compare what an investment actually returned against what I projected.", sub: "Most owners never close the loop. The ones who compound do it every time." },
      { text: "I could rank my last five investments from best to worst return.", sub: "If they all blur together, you're spending on instinct — which works until it doesn't." },
    ],
    lowLabel: "Never measured", highLabel: "Measured every time",
    quickWins: {
      low: [
        { title: "Pick your single largest expenditure from the last 24 months and reconstruct its return", context: "Not a full analysis — one afternoon. What did it cost, what changed after, and can you draw a line between the two? The answer will tell you more about your allocation discipline than any framework." },
        { title: "Write a one-page pre-commitment note before your next purchase over $10,000", context: "Expected outcome, the number that proves it, and the date you'll check. Put it in a folder. Reading it back in six months is the entire discipline." },
      ],
      mid: [
        { title: "Build a simple investment log — date, amount, thesis, expected return, actual return", context: "One row per decision. Twelve months of rows turns spending from instinct into a track record you can actually learn from." },
        { title: "Set a standing quarterly review of every open investment against its original thesis", context: "Thirty minutes. Kill what isn't working before it becomes sunk-cost reasoning, and double down on what is." },
      ],
      high: [
        { title: "Rank every active investment by realized return and reallocate from the bottom quartile", context: "You already measure. The next lever is moving money away from the weakest performers rather than letting them run out of inertia." },
        { title: "Set a hurdle rate below which you keep the profit rather than reinvest it", context: "Once you know what your business actually returns on money you put in, you have the one number that makes reinvest-or-harvest a calculation instead of a feeling." },
      ],
    },
  },
  {
    key: "b2", num: 2, of: 10, pillar: "biz",
    title: "Margin Position vs. Industry",
    subtitle: "Does your business convert revenue to profit better than your peers?",
    description: "Two physical therapy groups both bill $3M a year. One runs an 8% net margin, the other 16%. On identical revenue the second owner takes home roughly twice as much — and has roughly twice as much available to put back in each year. More clinicians, better equipment, a second location, or simply a bigger cushion to weather a slow quarter. Nothing about the first clinic is obviously broken. The schedule is full, the staff is competent, patients are happy. It simply converts revenue into profit worse than its peers do, and it has never measured itself against them. This matters enormously for the reinvest question, because adding revenue on top of a below-median margin structure amplifies the inefficiency. You get bigger without getting wealthier.",
    checks: [
      { text: "I know my net margin to the tenth of a percent, not as a rough range.", sub: "\"Around ten percent\" and 8.4% are very different businesses once you multiply them out." },
      { text: "I know the median net margin for my industry and revenue band.", sub: "Not a national average across all business — your industry, your size. The comparison only means something if it's close." },
      { text: "I can explain the gap between my margin and the median in operational terms.", sub: "Pricing, labor efficiency, payer or client mix, overhead — a specific mechanism, not \"we invest more in quality.\"" },
      { text: "My margin has held or improved over the last three years as revenue grew.", sub: "Margin that erodes as you scale is the clearest signal that growth is outrunning your systems." },
    ],
    lowLabel: "Below median, unclear why", highLabel: "Top quartile, and I know why",
    quickWins: {
      low: [
        { title: "Calculate your true net margin with owner compensation normalized to market rate", context: "Most owners are measuring a number that quietly includes their own underpayment as profit. Normalize it first, or you're comparing yourself to peers on different terms." },
        { title: "Find the published median margin for your industry and revenue band", context: "Industry associations and benchmarking databases publish these. One number, one afternoon, and you'll know whether you have a margin problem or a growth problem." },
      ],
      mid: [
        { title: "Break margin down by service line, location, or client segment and find the drag", context: "Blended margin hides the truth. Almost every business has a segment quietly subsidized by the rest — and it's usually the one the owner is most attached to." },
        { title: "Model what a three-point margin improvement does to profit at current revenue", context: "It's almost always larger than what a comparable revenue increase produces, and it costs you nothing extra. That comparison reframes the whole reinvest question." },
      ],
      high: [
        { title: "Track margin monthly against the industry top quartile, not the median", context: "Once you're above median, the median stops being a useful target. Best-in-class is the benchmark that still has something to teach you." },
        { title: "Pressure-test whether your margin advantage is structural or circumstantial", context: "A pricing advantage a competitor can copy next quarter isn't the same asset as a cost structure they can't replicate. Only one of them justifies aggressive reinvestment." },
      ],
    },
  },
  {
    key: "b3", num: 3, of: 10, pillar: "biz",
    title: "The Binding Constraint",
    subtitle: "Do you know the one thing actually capping your growth?",
    description: "A $6M commercial contractor was convinced he needed more sales, so he hired two more estimators. Bids went up 40%. Revenue didn't move — because the real constraint was crew capacity, and the new bids simply lengthened the backlog until customers walked. He spent six figures widening a pipe that was already wider than the bottleneck downstream. The same pattern shows up in a dermatology practice that markets harder while patients wait eleven weeks for an appointment, and in a manufacturer that buys a second machine while the first one sits idle waiting on setup. Every business has exactly one binding constraint at a time, and money spent anywhere except the constraint produces nothing but activity. This is the most expensive mistake an owner can make with their money, and it's almost always made with good intentions and real money.",
    checks: [
      { text: "If asked, I could name my single binding constraint in one sentence.", sub: "Not a list of five problems. The one thing that, if it improved, would let everything else move." },
      { text: "I can point to evidence for that constraint rather than a strong hunch.", sub: "Backlog data, utilization rates, conversion rates, wait times, cycle times. Something measurable." },
      { text: "My last three significant investments were aimed at the constraint.", sub: "Or were they aimed at the thing that felt most urgent, or most interesting, that quarter?" },
      { text: "I reassess the constraint at least quarterly, because it moves once you fix it.", sub: "Solving a constraint doesn't remove it — it relocates it. Owners who miss the handoff keep investing in a bottleneck that no longer exists." },
    ],
    lowLabel: "Everything feels broken", highLabel: "One constraint, evidenced",
    quickWins: {
      low: [
        { title: "List every problem you're aware of, then ask which one, if fixed, moves the others", context: "Most owners have ten problems and treat them as ten priorities. The exercise takes twenty minutes and usually collapses the list to one or two." },
        { title: "Follow one job, order, or patient end to end and record where it waits", context: "Constraints show up as waiting. Wherever work sits longest is where your money should go — and it's rarely where the owner assumed." },
      ],
      mid: [
        { title: "Quantify what a 20% improvement at the constraint is worth in profit", context: "This gives you the ceiling on what it's rational to spend fixing it — and a defensible number to compare every competing use of the money against." },
        { title: "Freeze spending on anything not touching the constraint for one quarter", context: "Uncomfortable and clarifying. It forces the question of how much of your growth spending is actually aimed at the bottleneck." },
      ],
      high: [
        { title: "Map where the constraint will move once the current one is resolved", context: "You already know today's bottleneck. Knowing the next one lets you build capacity ahead of it instead of reacting after it bites." },
        { title: "Build a standing constraint review into your quarterly planning rhythm", context: "The discipline isn't finding the constraint once. It's catching the handoff each time it relocates." },
      ],
    },
  },
  {
    key: "b4", num: 4, of: 10, pillar: "biz",
    title: "Growing Without Breaking",
    subtitle: "Can the business take on more work without falling apart?",
    description: "A $2.5M specialty manufacturer landed a contract that added 30% to revenue overnight. Within four months the owner was working eighty-hour weeks, two of his best machinists had quit, defect complaints had tripled, and margin had fallen below where it started. The money was there and the demand was real — the organization simply couldn't carry it. The same thing happens to a practice that adds a provider before it has the front-desk capacity to keep her schedule full, and to a services firm that wins a large account and quietly degrades every other client to serve it. This is the line between growth that compounds and growth that consumes. Putting money into a business that can't handle more work doesn't build anything — it converts cash into chaos, and chaos costs more than the original investment did.",
    checks: [
      { text: "We could take on double the qualified leads without me working more hours.", sub: "If growth requires more of you specifically, you're the constraint — and money can't fix that." },
      { text: "Our core processes are documented well enough that a new hire can follow them.", sub: "Documented means written down and actually used, not \"it's all in Dave's head and Dave's been here nine years.\"" },
      { text: "I have at least one person who could run day-to-day operations for two weeks without me.", sub: "Not in theory. Have you actually tested it?" },
      { text: "We can hire and productively train a new team member inside 90 days.", sub: "If hiring takes six months and training takes six more, your growth ceiling is set by your hiring pipeline, not your market." },
    ],
    lowLabel: "Growth breaks us", highLabel: "Systems scale ahead of demand",
    quickWins: {
      low: [
        { title: "Document the single process that breaks first when volume spikes", context: "You already know which one it is. Write it down this week — one page, in the order it actually happens, not the order it should." },
        { title: "Take four consecutive business days fully unreachable and note what fails", context: "The failures are your capacity gaps, ranked by severity. This is the cheapest diagnostic you will ever run on your own business." },
      ],
      mid: [
        { title: "Identify the one role that must be filled before your next growth push", context: "Hiring after demand arrives means paying full price for a rushed decision. Hiring ninety days ahead of it is the same money, spent well." },
        { title: "Cross-train a second person on every single-point-of-failure function", context: "Every function with exactly one competent person is a growth cap and an operational risk at the same time — one resignation away from a very bad quarter." },
      ],
      high: [
        { title: "Stress-test the organization at 1.5x current volume on paper", context: "Walk the org chart and ask what breaks at that level. Fix it before demand tests it for you." },
        { title: "Build capacity one step ahead of the growth curve as standing policy", context: "You already scale cleanly. The next level is treating capacity as a leading investment rather than a lagging response." },
      ],
    },
  },
  {
    key: "b5", num: 5, of: 10, pillar: "biz",
    title: "Proven Demand Runway",
    subtitle: "Is there work you can't take on because the money isn't there?",
    description: "There are two very different businesses that both say they want to grow. The first is turning work away every month because it lacks crews, equipment, exam rooms, licensed staff, or working capital — for that owner, money turns into revenue almost mechanically, and the return is close to predictable. The second is chasing every lead it can find, and money buys marketing experiments with unknown payoffs. Same industry, same revenue, opposite answers to the reinvestment question. Demand runway is what separates reinvestment from speculation. Without proven, documented demand you cannot currently serve, growth money is a bet on a hypothesis rather than a purchase of known revenue.",
    checks: [
      { text: "I turn away or delay real work because we lack capacity, not because it's a bad fit.", sub: "Track it for one month. The number is usually either much larger or much smaller than owners assume." },
      { text: "I have a documented backlog, waitlist, or pipeline extending beyond 60 days.", sub: "Written down and quantified, not a general sense that things are busy." },
      { text: "Inbound demand has been stable or growing for the last eight quarters.", sub: "Two years smooths out a good year. One strong year is not a runway." },
      { text: "I can name the specific capacity constraint that's costing me revenue right now.", sub: "Trucks, crews, chairs, exam rooms, licensed staff, square footage, working capital — something you could actually buy." },
    ],
    lowLabel: "Chasing every lead", highLabel: "Turning real work away",
    quickWins: {
      low: [
        { title: "Log every declined or delayed opportunity for 30 days with its dollar value", context: "This single number tells you whether you have a demand problem or a capacity problem — and they call for opposite uses of your money." },
        { title: "Ask your last ten lost prospects why they went elsewhere", context: "If the answer is timeline or availability, you're capacity-constrained. If it's price or fit, more capacity won't help you." },
      ],
      mid: [
        { title: "Quantify your backlog in weeks of capacity, and track it monthly", context: "Backlog trending up is the clearest green light for reinvestment you will get. Trending down is the clearest warning." },
        { title: "Test demand with a small capacity addition before committing to a large one", context: "One truck before five. One provider before a second location. Buy the information cheaply before you buy the capacity expensively." },
      ],
      high: [
        { title: "Model how much capacity you could add before demand becomes the constraint", context: "You know demand exceeds capacity. The next question is by how much — that's the size of the rational investment, and the point past which it becomes speculation." },
        { title: "Secure the money before you need it, while the numbers are strong", context: "Lenders price a business with visible backlog very differently than one that's already stretched. Timing here is worth real money." },
      ],
    },
  },
  {
    key: "p1", num: 6, of: 10, pillar: "pers",
    title: "What You Take Out",
    subtitle: "Does the money leaving the business actually become anything?",
    description: "Ask an owner what they pay themselves and you'll often hear a version of \"whatever's left.\" It sounds disciplined. It's actually two problems stacked on each other. First, what you build outside the business becomes a leftover rather than a decision — so in the years you most need to be putting something aside, you put aside nothing. Second, you lose the ability to tell whether the business is genuinely profitable or whether you're quietly subsidising it by underpaying yourself. But the deeper issue is what happens after the money leaves. Most owners take a distribution, it lands in the same account everything else lands in, and by the following year there's nothing to point at. Money that leaves the business and doesn't become an asset didn't really leave — it just took a longer route back to being spent.",
    checks: [
      { text: "I take a set amount out on a schedule, not whatever the month allows.", sub: "A steady number is what makes everything downstream possible. Without it there's nothing to plan around." },
      { text: "Some fixed share of what I take out goes somewhere it can't easily be spent.", sub: "Not what's left at the end of the month. A share decided in advance." },
      { text: "I could name what my distributions became over the last three years.", sub: "An account, an asset, a property. If the honest answer is \"living,\" that's the finding." },
      { text: "The transfer happens without me deciding to make it each time.", sub: "Anything requiring a monthly decision loses to the business eventually. It always has a use for the money." },
    ],
    lowLabel: "It stays in, or it gets spent", highLabel: "Deliberate, and it becomes assets",
    quickWins: {
      low: [
        { title: "Pick one number to take out every month and hold it for a quarter", context: "Not the right number — any consistent number. Consistency is the thing that has to exist before anything else can be built on it, and a quarter is long enough to prove it survives a slow month." },
        { title: "Open one account outside the business this week and move something into it", context: "The amount genuinely doesn't matter. What matters is that a destination exists — most owners have never created one, so every dollar defaults back to the company." },
      ],
      mid: [
        { title: "Automate a transfer for the day your distribution lands", context: "If the money touches your operating account first, it finds a use. Moving it the same day removes the decision entirely, which is the only version of this that survives a busy year." },
        { title: "Write down where the last three years of distributions actually went", context: "One page. Most owners have never traced it and are surprised by the answer. You can't set a target for the split until you know what the current split really is." },
      ],
      high: [
        { title: "Set what you want outside the business in five years, then work back to a monthly number", context: "You're already deliberate. The next step is having the amount answer to a target rather than to habit — and reverse-engineering from the destination is how that number stops being arbitrary." },
        { title: "Review the split with your CPA each year as the business grows", context: "What made sense at $2M often doesn't at $6M, and the structure of how you take money out has tax consequences that are worth revisiting deliberately rather than by default." },
      ],
    },
  },
  {
    key: "p2", num: 7, of: 10, pillar: "pers",
    title: "Liquid Reserve",
    subtitle: "How many months could you cover, personally and in the business?",
    description: "Reserve is the least glamorous line in this entire scorecard and the one that most often decides whether the other nine matter. An owner with six months of cover makes different decisions than an owner with none — not better decisions in theory, but genuinely different ones in practice. Thin reserves force you to take the client you shouldn't take, accept the terms you'd otherwise decline, and pull cash out of the business at exactly the moment it should be going in. Reserve isn't idle money sitting there earning nothing. It's what buys you the ability to say no, and the option to be patient while a reinvestment matures. Both are worth considerably more than the yield you gave up holding it.",
    checks: [
      { text: "The business could cover payroll and fixed costs for six months with zero new revenue.", sub: "Run the number. Most owners are surprised in one direction or the other." },
      { text: "I hold personal cash reserves separate from the business, in my own name.", sub: "Reserves that live inside the business aren't personal reserves. They're working capital you've mentally earmarked." },
      { text: "I have not funded a personal shortfall from the business in the past 12 months.", sub: "Occasional is normal. Routine means the two balance sheets have effectively merged." },
      { text: "I have access to credit I have arranged but do not currently need.", sub: "The time to secure a line is when you don't need it. Terms are always worse the day you do." },
    ],
    lowLabel: "One bad month away", highLabel: "Six-plus months, both sides",
    quickWins: {
      low: [
        { title: "Calculate the exact monthly fixed cost of the business and of your household", context: "Two numbers. Everything about reserve planning depends on them, and most owners have never written either one down precisely." },
        { title: "Open a separate reserve account and automate a fixed transfer into it", context: "Separate and automatic. Reserve that stays in the operating account gets spent, every time, without anyone deciding to spend it." },
      ],
      mid: [
        { title: "Set a target of six months of fixed costs and a date you intend to reach it", context: "\"More savings\" isn't a goal. \"Six months of fixed costs by next March\" is one you can actually track against." },
        { title: "Establish a line of credit while your financials are strong", context: "Arranged now, unused, it's optionality. Arranged in a crisis, it's expensive — if it's available at all." },
      ],
      high: [
        { title: "Review whether reserves beyond your six-month target are sitting idle without purpose", context: "Past the point of genuine safety, excess cash has a cost too. That's a conversation worth having deliberately rather than by default." },
        { title: "Stress-test the reserve against your actual worst realistic two quarters", context: "Not a generic downturn — your specific seasonality, your largest client leaving, your equipment failing. Six months of average is not six months of bad." },
      ],
    },
  },
  {
    key: "p3", num: 8, of: 10, pillar: "pers",
    title: "Assets Outside The Business",
    subtitle: "What share of your net worth isn't the company?",
    description: "For many business owners, roughly 80% of total net worth is locked inside the company. Nobody chooses that number — it accumulates one reasonable reinvestment decision at a time, because putting money into something you control and understand always feels safer than putting it somewhere you don't. And it compounds against you: every quarter you successfully grow the business, the business becomes a larger share of everything you own. Concentration isn't evidence you did something wrong. It's the natural result of doing something right for a long time without a counterweight. That's what the barbell is for — assets inside the business and assets outside it rarely come under pressure at the same moment, and holding both is what lets you keep reinvesting through a rough stretch instead of pulling money out during one.",
    checks: [
      { text: "I could roughly state what percentage of my net worth sits outside the business.", sub: "If you've never calculated it, that itself is a finding worth acting on." },
      { text: "Less than 70% of my net worth is tied to the business, including real estate it occupies.", sub: "Property leased to your own company is business-correlated, whatever the deed says." },
      { text: "I add to assets outside the business every year, including the strong years.", sub: "The temptation to skip a contribution and put it into the company is strongest when the company is doing best." },
      { text: "If the business were worth substantially less than I think, I'd still be financially free.", sub: "This is the entire test. Everything else is detail." },
    ],
    lowLabel: "It's all the business", highLabel: "Meaningfully diversified",
    quickWins: {
      low: [
        { title: "Write down every asset you own and mark which ones depend on the business", context: "One page. Include real estate the company occupies and any receivable from it. The concentration is usually higher than the mental estimate." },
        { title: "Set up one automatic monthly contribution to something outside the business", context: "The amount matters far less than the automation. Manual contributions lose to the business every time there's a competing use." },
      ],
      mid: [
        { title: "Set a target for outside-the-business net worth and track it annually", context: "A percentage and a date. Without a target you'll keep reinvesting by default, because default is always the path of least resistance." },
        { title: "Review whether your retirement plan structure fits your business's current stage", context: "Options that made sense at $1M often don't at $5M. Worth reviewing with your CPA and advisor as the business changes." },
      ],
      high: [
        { title: "Review concentration across everything, including assets that quietly correlate", context: "Industry-adjacent holdings, customer-adjacent real estate, and vendor equity can all move with the business without appearing to." },
        { title: "Map what your outside assets would cover if the business needed every dollar for a year", context: "The best reinvestment windows often arrive when cash is tightest. An outside base is what lets you fund one instead of watching it pass." },
      ],
    },
  },
  {
    key: "p4", num: 9, of: 10, pillar: "pers",
    title: "Proactive Tax Coordination",
    subtitle: "Is there a plan, or is there year-end paperwork?",
    description: "There's a meaningful difference between an accountant who tells you in March what happened last year and an advisory relationship that tells you in September what you should do before December. Most reinvest-or-harvest decisions carry a tax consequence that is largely fixed once the calendar year closes — entity structure, compensation mix, the timing of equipment and buildout purchases, retirement plan design. Owners who only meet their CPA at filing time are making these decisions unadvised and then paying for the outcome. This isn't about aggressive positions or clever structures. It's about whether the people who know your numbers are in the conversation before the decision rather than after it.",
    checks: [
      { text: "I meet with my CPA at least once before year-end, not only at filing.", sub: "A single Q3 or Q4 planning conversation is the highest-leverage meeting most owners aren't having." },
      { text: "My entity structure has been reviewed against my current revenue and profit, not my original ones.", sub: "The structure that fit at launch frequently doesn't at $3M. Worth a deliberate look with your CPA." },
      { text: "I understand the tax treatment of a major purchase before I make it, not after.", sub: "Timing and structure often matter as much as the purchase itself." },
      { text: "My CPA, my attorney, and anyone advising me on the personal side actually talk to each other.", sub: "Uncoordinated advisors optimize their own piece and can leave the whole worse off." },
    ],
    lowLabel: "Find out in April", highLabel: "Planned before year-end",
    quickWins: {
      low: [
        { title: "Book a planning conversation with your CPA for Q3 or Q4 this year", context: "Not a filing appointment — a forward-looking one. Bring your projected profit and any large purchases you're considering." },
        { title: "Ask your CPA directly whether your entity structure still fits the business you have now", context: "It's a fifteen-minute question with occasionally significant consequences, and it's rarely raised unless the owner raises it." },
      ],
      mid: [
        { title: "Put a standing annual pre-year-end planning meeting on the calendar", context: "Recurring, scheduled, and not contingent on anyone remembering. The value is entirely in it happening before the year closes." },
        { title: "Get your CPA and your other advisors in one conversation once a year", context: "One meeting a year where everyone advising you is looking at the same picture. Coordination is where most of the value actually is." },
      ],
      high: [
        { title: "Build the tax consequence into your reinvest-versus-keep analysis directly", context: "Pre-tax and after-tax returns can rank two options differently. If you're already planning ahead, this is the refinement that matters — run it with your CPA." },
        { title: "Review the plan each year against where the business is actually heading", context: "Structuring decisions look different when you're about to double than when you're holding steady. The plan should move when the trajectory does." },
      ],
    },
  },
  {
    key: "p5", num: 10, of: 10, pillar: "pers",
    title: "Your Long-Term Destination",
    subtitle: "Do you know where you want this business to take you?",
    description: "\"Somewhere around five to ten years\" is the most common answer owners give when asked where all this is going, and it isn't an answer — it's a way of not deciding. Without a destination you have no way to evaluate the question this scorecard exists to answer, because reinvesting is either compounding toward something specific or deferring a decision you've never made, and those two look identical from the inside. The destination doesn't have to be a sale. It might be a company twice this size, a business that runs profitably without you while you still own it, a handoff to a family member, or a management team you build and then step behind. Each of those requires different things from the business — and therefore a different answer about where the next dollar goes.",
    checks: [
      { text: "I know what I want this business to look like in five years, specifically.", sub: "Size, role, who runs it, what it pays you. \"Bigger\" is not a specification." },
      { text: "I know roughly what the business would need to produce to fund the life I want.", sub: "A range is fine. Having never calculated it is the problem." },
      { text: "I have a current, defensible estimate of what the business is worth today.", sub: "Not a multiple you heard at a conference. Something grounded in your actual financials and industry comparables." },
      { text: "I know whether there's a gap between where the business is and where it needs to be.", sub: "That gap is the single most useful number an owner can hold. It makes every money decision easier." },
    ],
    lowLabel: "No clear picture", highLabel: "Specific, with a number",
    quickWins: {
      low: [
        { title: "Write one paragraph describing the business five years from now", context: "Revenue, headcount, your role, who runs what. It can change. But a specific picture turns an abstract someday into a target you can put money against." },
        { title: "Get a directional valuation estimate for the business as it stands today", context: "Not a formal appraisal — a grounded estimate. You need a starting point far more than you need precision." },
      ],
      mid: [
        { title: "Calculate the gap between what the business produces now and what your picture requires", context: "Two numbers you likely already have separately. Subtracting one from the other is the exercise most owners skip, and it reframes everything." },
        { title: "Identify which two or three levers move that gap most in your specific business", context: "Not every improvement matters equally. Knowing which ones do is what tells you where reinvestment actually pays." },
      ],
      high: [
        { title: "Build a roadmap that ties specific improvements to the gap you've measured", context: "You know the destination and the number. The next level is sequencing the work so each year's reinvestment closes a measurable portion of it." },
        { title: "Pressure-test the plan against the business needing to run without you sooner than planned", context: "Health events, family changes, and unsolicited offers don't consult the timeline. A business that only works with you in it has a ceiling regardless of your plans." },
      ],
    },
  },
];
