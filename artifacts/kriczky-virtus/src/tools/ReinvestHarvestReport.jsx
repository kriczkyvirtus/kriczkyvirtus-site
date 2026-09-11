import { useState, useEffect } from "react";

const PREVIEW = false;

/* ═══════════════════════════════════════════════════════════════
   REINVEST OR HARVEST — THE REPORT
   Route: /r/:token   (tokenized, no expiry, explicit share option)
   Emailed the moment the flow completes. This is the deliverable.
   ═══════════════════════════════════════════════════════════════ */


const C = {
  bgDeep: "#0A0E14", bgCard: "#111720",
  gold: "#C8A24E", goldLight: "#D4B665",
  green: "#34D399", cyan: "#22D3EE", red: "#F87171", amber: "#FBBF24", amberDark: "#D4A017",
  text1: "#E8ECF1", text2: "#8B95A5", text3: "#5A6474", text4: "#3D4654",
};

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const BIZ = C.gold;
const PERS = C.green;

const PILLAR_MAX = 30;
const THRESHOLD = 18;

const scoreColor = (n) => !n ? C.text4 : n <= 2 ? C.red : n === 3 ? C.amber : n === 4 ? C.amberDark : n === 5 ? C.cyan : C.green;

/* Quadrant copy is mirrored from the thank-you page — single source of truth. */
const QUADRANTS = {
  reinvest: { key: "reinvest", label: "Reinvest-Weighted", color: C.green,
    line: "You've earned the right to be aggressive if you want to. Real opportunities inside, and enough outside that a bad year is a setback, not a reset. Few owners have both.",
    body: "You scored above the line on both sides, which is the position that most justifies leaning into the business. Money you put in comes back as profit in a way you can actually measure, the company can absorb more work without breaking, and — critically — you have enough outside it that a bad stretch is survivable. That second part is what makes pushing hard rational rather than reckless. Owners without it are taking the same risk with no parachute.",
    watch: "The most common failure from here is quiet. A strong year is exactly when owners stop funding the outside, because the business is throwing off obvious returns and everything else looks slow by comparison. What you built outside is the reason you can push hard. Don't spend it to fund the push." },
  split: { key: "split", label: "Concentrated Inside", color: C.gold,
    line: "Almost every extra dollar has gone back into the business, and that's how you built this engine. It's also how owners in this spot end up with everything riding on one asset. Now the job is to start deliberately paying yourself first without stalling growth.",
    body: "Your business scores well on its ability to turn money into more profit. That part is genuinely working, and it's why you keep feeding it. The problem is on the other side: almost everything you own now depends on that one company performing. This is the most seductive position on the matrix, because the business keeps offering the best visible return and reinvesting keeps looking like the obvious answer. It usually is, right up until it isn't. Concentration doesn't announce itself until something forces the issue.",
    watch: "Owners here rarely decide against building outside the business. They simply never get to it, because there is always a compelling use for the money inside. That's why the fix has to be automatic rather than intentional — a fixed share that leaves before the reinvestment decision gets made." },
  harvest: { key: "harvest", label: "Harvest-Weighted", color: C.cyan,
    line: "You've built the outside, which most owners never do. Your highest-return reinvestment now isn't more growth, it's fixing the one thing choking what your current growth produces.",
    body: "You've built real strength outside the business, which puts you ahead of most owners. But the business side scored low, which means money aimed at growth right now would mostly buy activity. Either the return on what you've already put in isn't measured, or the company can't absorb more work without something breaking, or there isn't proven demand waiting to be served. None of that means stop reinvesting. It means the highest-return place to put money is the constraint itself, not growth stacked on top of it.",
    watch: "Harvest-weighted doesn't mean take everything out. A business starved of reinvestment stops being worth anything to harvest from. The point is changing what you reinvest in — capacity, systems, the bottleneck — not whether you reinvest at all." },
  stabilize: { key: "stabilize", label: "Stabilize First", color: C.red,
    line: "Your highest-return move right now is the foundation itself. Build it first and every dollar you reinvest afterward works harder. Skip it and you just get busier.",
    body: "Both sides scored below the line, which means the reinvest-or-harvest framing isn't the most useful one for you yet. Money into a business that can't absorb it doesn't build value, and money out of thin margins into an empty reserve doesn't build a foundation. That sounds discouraging and shouldn't be. This is the most common position for owners who've grown fast, and it's also where a small number of specific fixes produce the largest visible change — because almost nothing has been optimised yet.",
    watch: "The trap is trying to grow your way out. Revenue running through a structure that hasn't been fixed amplifies the problem: you get bigger, busier, and no wealthier. Fix the floor first and the same growth lands very differently." },
};
const getQuadrant = (b, p) => b >= THRESHOLD ? (p >= THRESHOLD ? QUADRANTS.reinvest : QUADRANTS.split)
                                            : (p >= THRESHOLD ? QUADRANTS.harvest : QUADRANTS.stabilize);

const BANDS = [
  { label: "Money On Autopilot", min: 10, max: 22, color: C.red,
    desc: "Money is moving through your business and your household without a framework directing it. That isn't a character flaw — it's the default, because nothing about running a company forces the question. But it means the decision is currently being made by whatever felt urgent that month." },
  { label: "Split Focus", min: 23, max: 35, color: C.amber,
    desc: "You've built real strength somewhere and left something else thin. Very common in the $1M–$10M range. The risk isn't that you're doing something wrong — it's that a one-sided foundation means a single bad outcome in the weak area can undo years of good work in the strong one." },
  { label: "Deliberate Allocator", min: 36, max: 48, color: C.cyan,
    desc: "You're making decisions with real information rather than instinct. Most of the machinery exists — you measure things, you have policies, you can answer questions other owners can't. The remaining gaps tend to be specific rather than structural. Note that this total says nothing about how your strength is distributed; the split below does." },
  { label: "Compounding Owner", min: 49, max: 60, color: C.green,
    desc: "A high total by any standard, reflecting real discipline on both the operating and the personal side. From here the reinvest-or-harvest question stops being a source of anxiety and becomes what it should be — a calculation you run with good inputs and revisit on a schedule." },
];

/* Course roadmap — mirrors the thank-you page. */
const ROADMAP = [
  { n: "01", t: "You Are Here",           d: "The one decision everything else hangs on — the one you just scored.", c: C.gold,  ic: "c1" },
  { n: "02", t: "Know Your Numbers",      d: "What your last reinvestment returned, and how your margin compares.", c: C.gold,  ic: "c2" },
  { n: "03", t: "Find The Constraint",    d: "The single thing capping growth — and how to know it's the real one.", c: C.gold,  ic: "c3" },
  { n: "04", t: "The Profit Split System",d: "What goes back in, what holds in reserve, what comes out to you.",  c: C.green, ic: "c4" },
  { n: "05", t: "Build The Outside",      d: "Assets that aren't the company, and a tax plan that isn't paperwork.", c: C.green, ic: "c5" },
  { n: "06", t: "Where This Is Going",    d: "The destination that makes every future decision clear and answerable.", c: C.cyan,  ic: "c6" },
];

const REVENUE_BANDS = [
  { value: "Under $500K", qualified: false }, { value: "$500K - $1M", qualified: false },
  { value: "$1M - $3M", qualified: true }, { value: "$3M - $10M", qualified: true }, { value: "$10M+", qualified: true },
];
const routeTo = (rev, tier) => (tier === "Leadership" || tier === "Employee") ? "collective"
  : ((REVENUE_BANDS.find(b => b.value === rev) || {}).qualified ? "oneToOne" : "collective");

/* Points at the thank-you page's scheduler anchor rather than a separate booking
   page. The token carries the reader's result so the page rehydrates; see the
   fallback in reinvest-harvest-thankyou.jsx for the missing/unknown-token case. */
const CTA_QUALIFIED = (token) => `https://www.kriczkyvirtus.com/reinvest-harvest/next?t=${token}#rh-scheduler`;
const CTA_COLLECTIVE = "https://www.skool.com/virtus-collective";

const HEADSHOT = "data:image/jpeg;base64,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";

const DIMS = [
  {
    key: "b1", num: 1, of: 10, pillar: "biz", color: BIZ,
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
    key: "b2", num: 2, of: 10, pillar: "biz", color: BIZ,
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
    key: "b3", num: 3, of: 10, pillar: "biz", color: BIZ,
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
    key: "b4", num: 4, of: 10, pillar: "biz", color: BIZ,
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
    key: "b5", num: 5, of: 10, pillar: "biz", color: BIZ,
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
    key: "p1", num: 6, of: 10, pillar: "pers", color: PERS,
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
    key: "p2", num: 7, of: 10, pillar: "pers", color: PERS,
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
    key: "p3", num: 8, of: 10, pillar: "pers", color: PERS,
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
    key: "p4", num: 9, of: 10, pillar: "pers", color: PERS,
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
    key: "p5", num: 10, of: 10, pillar: "pers", color: PERS,
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


/* ═══ CONCEPT VISUALS ═══
   Diagrammatic, not illustrative. Each shows the mechanic the dimension
   measures. Several read off the owner's own answer.
   ⚠️ Every gradient uses userSpaceOnUse — axis-aligned lines get no paint
   under objectBoundingBox and vanish silently. */

const V = { w: 600, h: 150 };
const vt = { fontFamily: "'DM Sans',sans-serif" };
const LBL = { fontSize: 9, letterSpacing: 1.4, fontWeight: 700, ...vt };
const CAP = { fontSize: 9, ...vt };

/* 01 · Business ROI Opportunities — money in, and whether you can see it come back */
const VisualROI = ({ score }) => {
  const known = score >= 4;
  const c = known ? C.gold : C.text4;
  return (
    <svg viewBox="0 0 600 150" width="100%" style={{ display: "block" }}>
      <defs>
        <linearGradient id="vrIn" gradientUnits="userSpaceOnUse" x1="0" y1="55" x2="0" y2="105">
          <stop offset="0%" stopColor="#DFC177"/><stop offset="100%" stopColor="#8A6C2A"/>
        </linearGradient>
        <linearGradient id="vrOut" gradientUnits="userSpaceOnUse" x1="0" y1="40" x2="0" y2="105">
          <stop offset="0%" stopColor="#7CE7BF"/><stop offset="100%" stopColor="#1B8A63"/>
        </linearGradient>
      </defs>
      <text x="46" y="42" style={{ ...LBL }} fill={C.gold}>WHAT YOU PUT IN</text>
      <rect x="46" y="55" width="130" height="50" rx="5" fill="url(#vrIn)"/>
      <path d="M196 80 L268 80" stroke={c} strokeWidth="2" strokeLinecap="round" strokeDasharray={known ? "0" : "5 5"}/>
      <polyline points="256,71 268,80 256,89" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <text x="232" y="66" textAnchor="middle" style={{ ...CAP }} fill={C.text3}>{known ? "measured" : "unmeasured"}</text>
      {known ? (
        <>
          <text x="288" y="34" style={{ ...LBL }} fill={C.green}>WHAT CAME BACK</text>
          <rect x="288" y="45" width="266" height="60" rx="5" fill="url(#vrOut)"/>
          <text x="300" y="122" style={{ ...CAP, fontSize: 10.5 }} fill={C.text2}>you can point to the return</text>
        </>
      ) : (
        <>
          <text x="288" y="34" style={{ ...LBL }} fill={C.text3}>WHAT CAME BACK</text>
          <rect x="288" y="45" width="266" height="60" rx="5" fill="none" stroke={C.text4} strokeWidth="1.6" strokeDasharray="6 6"/>
          <text x="421" y="85" textAnchor="middle" fontFamily="'Playfair Display',serif" fontSize="30" fontWeight="700" fill={C.text4}>?</text>
          <text x="300" y="122" style={{ ...CAP, fontSize: 10.5 }} fill={C.text3}>no way to tell a good outcome from a lucky one</text>
        </>
      )}
    </svg>
  );
};

/* 02 · Margin Position — where you sit against the field */
const VisualMargin = ({ score }) => {
  const x = 60 + ((score - 1) / 5) * 480;
  const c = scoreColor(score);
  return (
    <svg viewBox="0 0 600 150" width="100%" style={{ display: "block" }}>
      <defs>
        <linearGradient id="vmTrack" gradientUnits="userSpaceOnUse" x1="60" y1="0" x2="540" y2="0">
          <stop offset="0%" stopColor={C.red} stopOpacity=".55"/>
          <stop offset="50%" stopColor={C.amber} stopOpacity=".55"/>
          <stop offset="100%" stopColor={C.green} stopOpacity=".55"/>
        </linearGradient>
      </defs>
      <rect x="60" y="76" width="480" height="9" rx="4.5" fill="url(#vmTrack)"/>
      <line x1="300" y1="62" x2="300" y2="99" stroke={C.text2} strokeWidth="1.4" strokeDasharray="4 4"/>
      <text x="300" y="55" textAnchor="middle" style={{ ...LBL, fontSize: 8.5 }} fill={C.text2}>INDUSTRY MEDIAN</text>
      <circle cx={x} cy="80.5" r="12" fill={c} opacity=".2"/>
      <circle cx={x} cy="80.5" r="6.5" fill={c}/>
      <text x={x} y="118" textAnchor="middle" style={{ ...LBL, fontSize: 9.5 }} fill={c}>YOU</text>
      <text x="60" y="140" style={{ ...CAP }} fill={C.text3}>below the field</text>
      <text x="540" y="140" textAnchor="end" style={{ ...CAP }} fill={C.text3}>top quartile</text>
      <text x="300" y="140" textAnchor="middle" style={{ ...CAP, fontSize: 9.5 }} fill={C.text3}>
        every point of margin is profit that needs no extra revenue
      </text>
    </svg>
  );
};

/* 04 · Growing Without Breaking — headroom before something gives */
const VisualHeadroom = ({ score }) => {
  const cap = 90 + (score - 1) * 78;        // capacity grows with the score
  const demand = 430;                        // demand is fixed: a 2x surge
  const over = demand > cap;
  return (
    <svg viewBox="0 0 600 150" width="100%" style={{ display: "block" }}>
      <defs>
        <linearGradient id="vhCap" gradientUnits="userSpaceOnUse" x1="0" y1="52" x2="0" y2="92">
          <stop offset="0%" stopColor="#DFC177"/><stop offset="100%" stopColor="#8A6C2A"/>
        </linearGradient>
      </defs>
      <text x="60" y="42" style={{ ...LBL }} fill={C.gold}>WHAT YOU CAN CARRY TODAY</text>
      <rect x="60" y="52" width={cap} height="40" rx="5" fill="url(#vhCap)"/>
      <rect x="60" y="104" width={demand} height="26" rx="4" fill="none" stroke={over ? C.red : C.green} strokeWidth="1.6" strokeDasharray="6 5"/>
      <text x="66" y="122" style={{ ...LBL, fontSize: 8.5 }} fill={over ? C.red : C.green}>DEMAND DOUBLES</text>
      {over && (
        <>
          <rect x={60 + cap} y="52" width={demand - cap} height="40" rx="5" fill={C.red} opacity=".18"/>
          <line x1={60 + cap} y1="44" x2={60 + cap} y2="138" stroke={C.red} strokeWidth="1.4" strokeDasharray="4 4"/>
          <text x={60 + cap > 360 ? 60 + cap - 10 : 60 + cap + 10} textAnchor={60 + cap > 360 ? "end" : "start"}
            y="32" style={{ ...LBL, fontSize: 9 }} fill={C.red}>THIS IS WHERE IT BREAKS</text>
        </>
      )}
      {!over && (() => {
        const mid = 60 + (demand + cap) / 2;                 // centre of the unused span
        const x = Math.max(70, Math.min(mid, 552));
        return (
          <g>
            {/* label sits above the bar on the dark ground — green on gold is unreadable */}
            <text x={x} textAnchor="middle" y="40" style={{ ...LBL, fontSize: 9 }} fill={C.green}>HEADROOM</text>
            <line x1={60 + demand} y1="46" x2={60 + cap} y2="46" stroke={C.green} strokeWidth="1.4" opacity=".7"/>
            <line x1={60 + demand} y1="43" x2={60 + demand} y2="49" stroke={C.green} strokeWidth="1.4" opacity=".7"/>
            <line x1={60 + cap} y1="43" x2={60 + cap} y2="49" stroke={C.green} strokeWidth="1.4" opacity=".7"/>
          </g>
        );
      })()}
    </svg>
  );
};

/* 05 · Proven Demand Runway — work waiting versus work you can take */
const VisualRunway = ({ score }) => {
  const waiting = Math.max(0, score - 1);
  return (
    <svg viewBox="0 0 600 150" width="100%" style={{ display: "block" }}>
      <text x="60" y="40" style={{ ...LBL }} fill={C.gold}>WORK YOU'RE ALREADY TAKING</text>
      {[0,1,2,3].map(i => <rect key={i} x={60 + i*54} y="52" width="46" height="40" rx="5" fill={C.gold} opacity={.85 - i*.08}/>)}
      <line x1="292" y1="42" x2="292" y2="118" stroke={C.text3} strokeWidth="1.3" strokeDasharray="4 4"/>
      <text x="302" y="40" style={{ ...LBL }} fill={waiting ? C.green : C.text3}>
        {waiting ? "WORK WAITING ON CAPACITY" : "NOTHING WAITING"}
      </text>
      {waiting > 0
        ? [...Array(waiting)].map((_, i) => (
            <rect key={i} x={302 + i*48} y="52" width="40" height="40" rx="5" fill="none" stroke={C.green} strokeWidth="1.7" strokeDasharray="5 4"/>
          ))
        : <text x="302" y="78" style={{ ...CAP, fontSize: 11 }} fill={C.text3}>money buys experiments, not revenue</text>}
      <text x="60" y="128" style={{ ...CAP, fontSize: 9.5 }} fill={C.text3}>
        {waiting >= 3
          ? "Demand is proven. Adding capacity converts almost mechanically."
          : waiting > 0
            ? "Some proven demand. Test with a small addition before a large one."
            : "Without proven demand you can't serve, growth spending is a bet, not a purchase."}
      </text>
    </svg>
  );
};

/* 06 · What You Take Out — five years of distributions, and what's left to show */
const VisualSplit = ({ score }) => {
  const keep = [0, .12, .3, .5, .72, .95][score - 1];   // share that becomes an asset
  const H = 52, TOP = 46, YRS = 5, colW = 62, gap = 22, x0 = 62;
  let running = 0;
  const c = keep >= .5 ? C.green : keep >= .25 ? C.amber : C.red;
  return (
    <svg viewBox="0 0 600 150" width="100%" style={{ display: "block" }}>
      <defs>
        <linearGradient id="vspKeep" gradientUnits="userSpaceOnUse" x1="0" y1={TOP} x2="0" y2={TOP + H}>
          <stop offset="0%" stopColor="#7CE7BF"/><stop offset="100%" stopColor="#1B8A63"/>
        </linearGradient>
      </defs>
      <text x={x0} y="34" style={{ ...LBL }} fill={C.gold}>FIVE YEARS OF PROFIT TAKEN OUT</text>
      {[...Array(YRS)].map((_, i) => {
        const x = x0 + i * (colW + gap);
        const kh = H * keep;
        running += keep;
        return (
          <g key={i}>
            {/* what came out */}
            <rect x={x} y={TOP} width={colW} height={H} rx="4" fill="none" stroke={C.gold} strokeWidth="1.3" strokeDasharray="4 4" opacity=".6"/>
            {/* what survived */}
            {kh > 1 && <rect x={x} y={TOP + H - kh} width={colW} height={kh} rx="4" fill="url(#vspKeep)"/>}
            {kh <= 1 && <text x={x + colW/2} y={TOP + H/2 + 5} textAnchor="middle" style={{ ...CAP, fontSize: 13 }} fill={C.text4}>·</text>}
            <text x={x + colW/2} y={TOP + H + 15} textAnchor="middle" style={{ ...CAP, fontSize: 9 }} fill={C.text3}>YR {i+1}</text>
          </g>
        );
      })}
      <text x="500" y="34" textAnchor="end" style={{ ...LBL }} fill={c}>STILL YOURS</text>
      <rect x="512" y={TOP} width="46" height={H} rx="4" fill="none" stroke={c} strokeWidth="1.4" opacity=".5"/>
      {running > .05 && <rect x="512" y={TOP + H - H * Math.min(running / YRS, 1)} width="46" height={H * Math.min(running / YRS, 1)} rx="4" fill={c} opacity=".8"/>}
      <text x="535" y={TOP + H + 15} textAnchor="middle" style={{ ...CAP, fontSize: 9, fontWeight: 700 }} fill={c}>{Math.round(keep * 100)}%</text>
      <text x={x0} y="142" style={{ ...CAP, fontSize: 10 }} fill={c}>
        {keep < .2 ? "Five years of profit left the business. Almost none of it became anything you still own."
         : keep < .6 ? "Some of it survived. Most of it went to living, and there's nothing left to point at."
         : "Most of what left the business is still yours. That's the whole difference."}
      </text>
    </svg>
  );
};

/* 07 · Liquid Reserve — months of cover against a six-month target */
const VisualReserve = ({ score }) => {
  const months = [0.5, 1, 2.5, 4, 5, 7][score - 1];
  const w = Math.min(months / 8, 1) * 480;
  const c = scoreColor(score);
  const targetX = 60 + (6 / 8) * 480;
  return (
    <svg viewBox="0 0 600 150" width="100%" style={{ display: "block" }}>
      <defs>
        <linearGradient id="vsFill" gradientUnits="userSpaceOnUse" x1="0" y1="58" x2="0" y2="94">
          <stop offset="0%" stopColor={c} stopOpacity=".95"/><stop offset="100%" stopColor={c} stopOpacity=".45"/>
        </linearGradient>
      </defs>
      <rect x="60" y="58" width="480" height="36" rx="5" fill="rgba(255,255,255,.04)"/>
      <rect x="60" y="58" width={w} height="36" rx="5" fill="url(#vsFill)"/>
      {[0,2,4,6,8].map(m => (
        <g key={m}>
          <line x1={60 + (m/8)*480} y1="94" x2={60 + (m/8)*480} y2="102" stroke={C.text4} strokeWidth="1"/>
          <text x={60 + (m/8)*480} y="116" textAnchor="middle" style={{ ...CAP }} fill={C.text3}>{m}m</text>
        </g>
      ))}
      <line x1={targetX} y1="44" x2={targetX} y2="100" stroke={C.green} strokeWidth="1.6" strokeDasharray="4 4"/>
      <text x={targetX} y="38" textAnchor="middle" style={{ ...LBL, fontSize: 8.5 }} fill={C.green}>SIX-MONTH TARGET</text>
      <text x="60" y="140" style={{ ...CAP, fontSize: 9.5 }} fill={C.text3}>
        Reserve is what buys you the ability to say no — and the option to be patient.
      </text>
    </svg>
  );
};

/* 09 · Proactive Tax Coordination — options shrink to nothing as the year closes */
const VisualTaxYear = ({ score }) => {
  /* where the owner actually engages, in month index */
  const TOUCH = [[15.5], [15.5], [11.5], [9], [8.5, 11.5], [2, 5, 8, 11]][score - 1];
  const x = (m) => 62 + (m / 12) * 400;
  const wedgeTop = (m) => 96 - Math.max(0, (1 - m / 12)) * 46;
  const live = TOUCH.filter(m => m < 12).length;
  const c = live >= 3 ? C.green : live >= 1 ? C.amber : C.red;
  return (
    <svg viewBox="0 0 600 150" width="100%" style={{ display: "block" }}>
      <defs>
        <linearGradient id="vtyW" gradientUnits="userSpaceOnUse" x1="62" y1="0" x2="462" y2="0">
          <stop offset="0%" stopColor={C.green} stopOpacity=".34"/>
          <stop offset="100%" stopColor={C.green} stopOpacity=".05"/>
        </linearGradient>
      </defs>
      <text x="62" y="34" style={{ ...LBL, fontSize: 8.5 }} fill={C.green}>DECISIONS YOU CAN STILL CHANGE</text>
      <path d={`M62 50 L462 96 L62 96 Z`} fill="url(#vtyW)"/>
      <line x1="62" y1="96" x2="558" y2="96" stroke={C.text4} strokeWidth="1"/>
      {["J","F","M","A","M","J","J","A","S","O","N","D"].map((m,i) => (
        <text key={i} x={x(i + .5)} y="110" textAnchor="middle" style={{ ...CAP, fontSize: 8.5 }} fill={C.text4}>{m}</text>
      ))}
      <line x1="462" y1="44" x2="462" y2="104" stroke={C.text3} strokeWidth="1.2" strokeDasharray="3 4"/>
      <text x="468" y="112" style={{ ...CAP, fontSize: 8.5 }} fill={C.text3}>year closes</text>
      {TOUCH.map((m,i) => {
        const past = m >= 12;
        return (
          <g key={i}>
            <line x1={x(m)} y1={past ? 96 : wedgeTop(m)} x2={x(m)} y2="96" stroke={past ? C.red : C.green} strokeWidth="1.6"/>
            <circle cx={x(m)} cy={past ? 96 : wedgeTop(m)} r="5.5" fill={past ? C.red : C.green}/>
          </g>
        );
      })}
      {TOUCH.some(m => m >= 12) && (
        <text x={x(15.5)} y="42" textAnchor="middle" style={{ ...LBL, fontSize: 8.5 }} fill={C.red}>APRIL</text>
      )}
      <text x="62" y="140" style={{ ...CAP, fontSize: 10 }} fill={c}>
        {live === 0 ? "By the time you talk, the year is closed. There is nothing left to decide — only a bill to pay."
         : live === 1 ? "One conversation, late. Most of the levers had already closed by the time you had it."
         : live === 2 ? "You're in the window, but only at the end of it. The earlier options were never on the table."
         : "Four touchpoints across the year. Every lever is live when you're actually deciding."}
      </text>
    </svg>
  );
};

/* 10 · Your Long-Term Destination — drift, or a distance you can close */
const VisualGap = ({ score }) => {
  const tier = score <= 2 ? "drift" : score <= 4 ? "vague" : "clear";
  const ends = [[38,-30],[52,-14],[60,4],[48,22],[34,36]];   // fan angles for drift
  return (
    <svg viewBox="0 0 600 150" width="100%" style={{ display: "block" }}>
      <circle cx="92" cy="80" r="9" fill={C.gold}/>
      <circle cx="92" cy="80" r="16" fill="none" stroke={C.gold} strokeWidth="1" opacity=".35"/>
      <text x="92" y="50" textAnchor="middle" style={{ ...LBL, fontSize: 9 }} fill={C.gold}>TODAY</text>

      {tier === "drift" && <>
        {ends.map(([len,dy],i) => (
          <path key={i} d={`M108 80 L${108 + len*5.4} ${80 + dy*1.5}`} stroke={C.text4} strokeWidth="1.7"
            strokeDasharray="6 7" strokeLinecap="round" opacity={.8 - i*.07}/>
        ))}
        <text x="452" y="86" style={{ fontFamily:"'Playfair Display',serif", fontSize:34, fontWeight:700 }} fill={C.text4}>?</text>
        <text x="92" y="140" style={{ ...CAP, fontSize: 10 }} fill={C.red}>
          Every year of reinvesting moves you somewhere. Without a destination there's no way to tell if it's forward.
        </text>
      </>}

      {tier === "vague" && <>
        <path d="M108 80 L392 80" stroke={C.amber} strokeWidth="2" strokeDasharray="7 6" strokeLinecap="round" opacity=".85"/>
        <ellipse cx="452" cy="80" rx="46" ry="27" fill={C.amber} opacity=".1"/>
        <ellipse cx="452" cy="80" rx="46" ry="27" fill="none" stroke={C.amber} strokeWidth="1.5" strokeDasharray="5 6"/>
        <text x="452" y="46" textAnchor="middle" style={{ ...LBL, fontSize: 8.5 }} fill={C.amber}>ROUGHLY THAT WAY</text>
        <text x="92" y="140" style={{ ...CAP, fontSize: 10 }} fill={C.amber}>
          You know the direction. Without a number you can't tell whether this year got you closer or just busier.
        </text>
      </>}

      {tier === "clear" && <>
        <line x1="108" y1="80" x2="484" y2="80" stroke={C.cyan} strokeWidth="2.4" strokeLinecap="round"/>
        {[1,2,3].map(i => <line key={i} x1={108 + i*94} y1="72" x2={108 + i*94} y2="88" stroke={C.cyan} strokeWidth="1.2" opacity=".45"/>)}
        <circle cx="500" cy="80" r="11" fill="none" stroke={C.cyan} strokeWidth="2.6"/>
        <circle cx="500" cy="80" r="4" fill={C.cyan}/>
        <text x="500" y="50" textAnchor="middle" style={{ ...LBL, fontSize: 9 }} fill={C.cyan}>THE DESTINATION</text>
        <text x="300" y="106" textAnchor="middle" style={{ ...CAP, fontSize: 9.5 }} fill={C.cyan}>a distance you can measure</text>
        <text x="92" y="140" style={{ ...CAP, fontSize: 10 }} fill={C.green}>
          Every decision now has something to answer to. That is what makes reinvesting a strategy instead of a habit.
        </text>
      </>}
    </svg>
  );
};


/* ── 03 · The Binding Constraint (from the document sample) ── */
const VisualConstraint = () => (
  <svg viewBox="0 0 600 150" width="100%" style={{ display: "block" }}>
    <defs>
      <linearGradient id="vcFlow" gradientUnits="userSpaceOnUse" x1="40" y1="0" x2="560" y2="0">
        <stop offset="0%" stopColor={C.gold} stopOpacity=".85"/>
        <stop offset="46%" stopColor={C.gold} stopOpacity=".85"/>
        <stop offset="52%" stopColor={C.red}/>
        <stop offset="60%" stopColor={C.gold} stopOpacity=".3"/>
        <stop offset="100%" stopColor={C.gold} stopOpacity=".3"/>
      </linearGradient>
    </defs>
    {[0,1,2,3,4,5,6].map(i => {
      const y = 30 + i*15, amp = (y-75)/45;
      return <path key={i} d={`M40 ${y} C200 ${y} 260 ${75+amp*7} 300 ${75+amp*7} C340 ${75+amp*7} 400 ${y} 560 ${y}`}
        fill="none" stroke="url(#vcFlow)" strokeWidth="2.2" strokeLinecap="round"/>;
    })}
    <line x1="300" y1="14" x2="300" y2="136" stroke={C.red} strokeWidth="1.5" strokeDasharray="4 5" opacity=".75"/>
    <text x="300" y="10" textAnchor="middle" fill={C.red} fontSize="9.5" fontWeight="700" letterSpacing="1.6" fontFamily="'DM Sans',sans-serif">THE CONSTRAINT</text>
    <text x="44" y="148" fill={C.text3} fontSize="9" fontFamily="'DM Sans',sans-serif">everything upstream</text>
    <text x="556" y="148" textAnchor="end" fill={C.text3} fontSize="9" fontFamily="'DM Sans',sans-serif">…is capped by one point</text>
  </svg>
);

/* ── 08 · Assets Outside The Business (from the document sample) ── */
const VisualConcentration = ({ score }) => {
  const pct = [4, 12, 20, 26, 34, 55][score - 1];
  const inside = 100 - pct;
  return (
    <svg viewBox="0 0 600 150" width="100%" style={{ display: "block" }}>
      <defs>
        <linearGradient id="vkIn" gradientUnits="userSpaceOnUse" x1="40" y1="52" x2="40" y2="98">
          <stop offset="0%" stopColor={C.goldLight}/><stop offset="100%" stopColor="#8A6C2A"/>
        </linearGradient>
        <linearGradient id="vkOut" gradientUnits="userSpaceOnUse" x1="40" y1="52" x2="40" y2="98">
          <stop offset="0%" stopColor="#7CE7BF"/><stop offset="100%" stopColor="#1B8A63"/>
        </linearGradient>
      </defs>
      <rect x="40" y="52" width={520*inside/100} height="46" rx="5" fill="url(#vkIn)"/>
      <rect x={40+520*inside/100+5} y="52" width={Math.max(520*pct/100-5, 4)} height="46" rx="5" fill="url(#vkOut)"/>
      <text x="46" y="42" fill={C.gold} fontSize="9.5" fontWeight="700" letterSpacing="1.5" fontFamily="'DM Sans',sans-serif">INSIDE THE BUSINESS</text>
      <text x="556" y="42" textAnchor="end" fill={C.green} fontSize="9.5" fontWeight="700" letterSpacing="1.5" fontFamily="'DM Sans',sans-serif">OUTSIDE</text>
      <text x="46" y="120" fill={C.text2} fontSize="10.5" fontFamily="'DM Sans',sans-serif">{inside}% of what you own</text>
      <text x="556" y="120" textAnchor="end" fill={C.text2} fontSize="10.5" fontFamily="'DM Sans',sans-serif">{pct}%</text>
      <line x1="40" y1="132" x2="560" y2="132" stroke={C.text4} strokeWidth=".8" opacity=".5"/>
      <text x="300" y="146" textAnchor="middle" fill={C.text3} fontSize="9" fontFamily="'DM Sans',sans-serif">one bad stretch reaches everything on the left</text>
    </svg>
  );
};



const ICON_C1 = `<svg width="512" height="512" viewBox="-210 -210 420 420" xmlns="http://www.w3.org/2000/svg" style="overflow:visible">
<defs>
  <linearGradient id="metalxcompass" gradientUnits="userSpaceOnUse" x1="0" y1="-150" x2="0" y2="150"><stop offset="0%" stop-color="#F8ECC4"/><stop offset="14%" stop-color="#DFC177"/><stop offset="28%" stop-color="#C8A24E"/><stop offset="42%" stop-color="#5A4419"/><stop offset="50%" stop-color="#F8ECC4"/><stop offset="64%" stop-color="#C8A24E"/><stop offset="80%" stop-color="#8A6C2A"/><stop offset="100%" stop-color="#5A4419"/></linearGradient>
  <filter id="softxcompass" x="-60%" y="-60%" width="220%" height="220%">
    <feGaussianBlur stdDeviation="2.50"/>
  </filter>
  <filter id="liftxcompass" x="-70%" y="-70%" width="240%" height="240%">
    <feDropShadow dx="0" dy="6.0" stdDeviation="9.0" flood-color="#000" flood-opacity="0.55"/>
    <feDropShadow dx="0" dy="0" stdDeviation="16.0" flood-color="#C8A24E" flood-opacity="0.38"/>
  </filter>
  <radialGradient id="ambxcompass">
    <stop offset="0%" stop-color="#C8A24E" stop-opacity="0.16"/>
    <stop offset="100%" stop-color="#C8A24E" stop-opacity="0"/>
  </radialGradient>
</defs>
<circle cx="0" cy="0" r="215" fill="url(#ambxcompass)"/>
<g fill="none" stroke="#000" stroke-opacity="0.55" stroke-width="28.00"
   stroke-linecap="round" stroke-linejoin="round"
   transform="translate(0,7.0)" filter="url(#softxcompass)"><circle cx="0" cy="0" r="118"/><path d="M0 -150 L34 -34 L150 0 L34 34 L0 150 L-34 34 L-150 0 L-34 -34 Z"/></g>
<g fill="none" stroke="url(#metalxcompass)" stroke-width="22.00"
   stroke-linecap="round" stroke-linejoin="round" filter="url(#liftxcompass)"><circle cx="0" cy="0" r="118"/><path d="M0 -150 L34 -34 L150 0 L34 34 L0 150 L-34 34 L-150 0 L-34 -34 Z"/></g>
<g fill="none" stroke="#FFFDF5" stroke-opacity="0.55" stroke-width="5.00"
   stroke-linecap="round" stroke-linejoin="round"
   transform="translate(0,-5.0)"><circle cx="0" cy="0" r="118"/><path d="M0 -150 L34 -34 L150 0 L34 34 L0 150 L-34 34 L-150 0 L-34 -34 Z"/></g>
</svg>`;
const ICON_C2 = `<svg width="512" height="512" viewBox="-210 -210 420 420" xmlns="http://www.w3.org/2000/svg" style="overflow:visible">
<defs>
  <linearGradient id="metalxbars" gradientUnits="userSpaceOnUse" x1="0" y1="-130" x2="0" y2="130"><stop offset="0%" stop-color="#F8ECC4"/><stop offset="14%" stop-color="#DFC177"/><stop offset="28%" stop-color="#C8A24E"/><stop offset="42%" stop-color="#5A4419"/><stop offset="50%" stop-color="#F8ECC4"/><stop offset="64%" stop-color="#C8A24E"/><stop offset="80%" stop-color="#8A6C2A"/><stop offset="100%" stop-color="#5A4419"/></linearGradient>
  <filter id="softxbars" x="-60%" y="-60%" width="220%" height="220%">
    <feGaussianBlur stdDeviation="2.50"/>
  </filter>
  <filter id="liftxbars" x="-70%" y="-70%" width="240%" height="240%">
    <feDropShadow dx="0" dy="6.0" stdDeviation="9.0" flood-color="#000" flood-opacity="0.55"/>
    <feDropShadow dx="0" dy="0" stdDeviation="16.0" flood-color="#C8A24E" flood-opacity="0.38"/>
  </filter>
  <radialGradient id="ambxbars">
    <stop offset="0%" stop-color="#C8A24E" stop-opacity="0.16"/>
    <stop offset="100%" stop-color="#C8A24E" stop-opacity="0"/>
  </radialGradient>
</defs>
<circle cx="0" cy="0" r="215" fill="url(#ambxbars)"/>
<g fill="none" stroke="#000" stroke-opacity="0.55" stroke-width="28.00"
   stroke-linecap="round" stroke-linejoin="round"
   transform="translate(0,7.0)" filter="url(#softxbars)"><path d="M-150 -130 L-150 130 L150 130"/><path d="M-72 60 L-72 -10"/><path d="M4 60 L4 -60"/><path d="M80 60 L80 -112"/></g>
<g fill="none" stroke="url(#metalxbars)" stroke-width="22.00"
   stroke-linecap="round" stroke-linejoin="round" filter="url(#liftxbars)"><path d="M-150 -130 L-150 130 L150 130"/><path d="M-72 60 L-72 -10"/><path d="M4 60 L4 -60"/><path d="M80 60 L80 -112"/></g>
<g fill="none" stroke="#FFFDF5" stroke-opacity="0.55" stroke-width="5.00"
   stroke-linecap="round" stroke-linejoin="round"
   transform="translate(0,-5.0)"><path d="M-150 -130 L-150 130 L150 130"/><path d="M-72 60 L-72 -10"/><path d="M4 60 L4 -60"/><path d="M80 60 L80 -112"/></g>
</svg>`;
const ICON_C3 = `<svg width="512" height="512" viewBox="-210 -210 420 420" xmlns="http://www.w3.org/2000/svg" style="overflow:visible">
<defs>
  <linearGradient id="metalxfunnel" gradientUnits="userSpaceOnUse" x1="0" y1="-140" x2="0" y2="150"><stop offset="0%" stop-color="#F8ECC4"/><stop offset="14%" stop-color="#DFC177"/><stop offset="28%" stop-color="#C8A24E"/><stop offset="42%" stop-color="#5A4419"/><stop offset="50%" stop-color="#F8ECC4"/><stop offset="64%" stop-color="#C8A24E"/><stop offset="80%" stop-color="#8A6C2A"/><stop offset="100%" stop-color="#5A4419"/></linearGradient>
  <filter id="softxfunnel" x="-60%" y="-60%" width="220%" height="220%">
    <feGaussianBlur stdDeviation="2.50"/>
  </filter>
  <filter id="liftxfunnel" x="-70%" y="-70%" width="240%" height="240%">
    <feDropShadow dx="0" dy="6.0" stdDeviation="9.0" flood-color="#000" flood-opacity="0.55"/>
    <feDropShadow dx="0" dy="0" stdDeviation="16.0" flood-color="#C8A24E" flood-opacity="0.38"/>
  </filter>
  <radialGradient id="ambxfunnel">
    <stop offset="0%" stop-color="#C8A24E" stop-opacity="0.16"/>
    <stop offset="100%" stop-color="#C8A24E" stop-opacity="0"/>
  </radialGradient>
</defs>
<circle cx="0" cy="0" r="215" fill="url(#ambxfunnel)"/>
<g fill="none" stroke="#000" stroke-opacity="0.55" stroke-width="28.00"
   stroke-linecap="round" stroke-linejoin="round"
   transform="translate(0,7.0)" filter="url(#softxfunnel)"><path d="M-160 -140 L160 -140 L34 -6 L34 96 L-34 150 L-34 -6 Z"/></g>
<g fill="none" stroke="url(#metalxfunnel)" stroke-width="22.00"
   stroke-linecap="round" stroke-linejoin="round" filter="url(#liftxfunnel)"><path d="M-160 -140 L160 -140 L34 -6 L34 96 L-34 150 L-34 -6 Z"/></g>
<g fill="none" stroke="#FFFDF5" stroke-opacity="0.55" stroke-width="5.00"
   stroke-linecap="round" stroke-linejoin="round"
   transform="translate(0,-5.0)"><path d="M-160 -140 L160 -140 L34 -6 L34 96 L-34 150 L-34 -6 Z"/></g>
</svg>`;
const ICON_C4 = `<svg width="512" height="512" viewBox="-210 -210 420 420" xmlns="http://www.w3.org/2000/svg" style="overflow:visible">
<defs>
  <linearGradient id="metalxdiverge" gradientUnits="userSpaceOnUse" x1="0" y1="-140" x2="0" y2="150"><stop offset="0%" stop-color="#D8FCEE"/><stop offset="14%" stop-color="#7CE7BF"/><stop offset="28%" stop-color="#34D399"/><stop offset="42%" stop-color="#0F5C42"/><stop offset="50%" stop-color="#EAFFF7"/><stop offset="64%" stop-color="#34D399"/><stop offset="80%" stop-color="#1B8A63"/><stop offset="100%" stop-color="#0F5C42"/></linearGradient>
  <filter id="softxdiverge" x="-60%" y="-60%" width="220%" height="220%">
    <feGaussianBlur stdDeviation="2.50"/>
  </filter>
  <filter id="liftxdiverge" x="-70%" y="-70%" width="240%" height="240%">
    <feDropShadow dx="0" dy="6.0" stdDeviation="9.0" flood-color="#000" flood-opacity="0.55"/>
    <feDropShadow dx="0" dy="0" stdDeviation="16.0" flood-color="#34D399" flood-opacity="0.38"/>
  </filter>
  <radialGradient id="ambxdiverge">
    <stop offset="0%" stop-color="#34D399" stop-opacity="0.16"/>
    <stop offset="100%" stop-color="#34D399" stop-opacity="0"/>
  </radialGradient>
</defs>
<circle cx="0" cy="0" r="215" fill="url(#ambxdiverge)"/>
<g fill="none" stroke="#000" stroke-opacity="0.55" stroke-width="28.00"
   stroke-linecap="round" stroke-linejoin="round"
   transform="translate(0,7.0)" filter="url(#softxdiverge)"><path d="M0 150 L0 20"/><path d="M0 20 L-120 -100"/><path d="M0 20 L120 -100"/><path d="M-120 -100 L-120 -20 M-120 -100 L-40 -100"/><path d="M120 -100 L120 -20 M120 -100 L40 -100"/></g>
<g fill="none" stroke="url(#metalxdiverge)" stroke-width="22.00"
   stroke-linecap="round" stroke-linejoin="round" filter="url(#liftxdiverge)"><path d="M0 150 L0 20"/><path d="M0 20 L-120 -100"/><path d="M0 20 L120 -100"/><path d="M-120 -100 L-120 -20 M-120 -100 L-40 -100"/><path d="M120 -100 L120 -20 M120 -100 L40 -100"/></g>
<g fill="none" stroke="#FFFDF5" stroke-opacity="0.55" stroke-width="5.00"
   stroke-linecap="round" stroke-linejoin="round"
   transform="translate(0,-5.0)"><path d="M0 150 L0 20"/><path d="M0 20 L-120 -100"/><path d="M0 20 L120 -100"/><path d="M-120 -100 L-120 -20 M-120 -100 L-40 -100"/><path d="M120 -100 L120 -20 M120 -100 L40 -100"/></g>
</svg>`;
const ICON_C5 = `<svg width="512" height="512" viewBox="-210 -210 420 420" xmlns="http://www.w3.org/2000/svg" style="overflow:visible">
<defs>
  <linearGradient id="metalxoutward" gradientUnits="userSpaceOnUse" x1="0" y1="-150" x2="0" y2="150"><stop offset="0%" stop-color="#D8FCEE"/><stop offset="14%" stop-color="#7CE7BF"/><stop offset="28%" stop-color="#34D399"/><stop offset="42%" stop-color="#0F5C42"/><stop offset="50%" stop-color="#EAFFF7"/><stop offset="64%" stop-color="#34D399"/><stop offset="80%" stop-color="#1B8A63"/><stop offset="100%" stop-color="#0F5C42"/></linearGradient>
  <filter id="softxoutward" x="-60%" y="-60%" width="220%" height="220%">
    <feGaussianBlur stdDeviation="2.50"/>
  </filter>
  <filter id="liftxoutward" x="-70%" y="-70%" width="240%" height="240%">
    <feDropShadow dx="0" dy="6.0" stdDeviation="9.0" flood-color="#000" flood-opacity="0.55"/>
    <feDropShadow dx="0" dy="0" stdDeviation="16.0" flood-color="#34D399" flood-opacity="0.38"/>
  </filter>
  <radialGradient id="ambxoutward">
    <stop offset="0%" stop-color="#34D399" stop-opacity="0.16"/>
    <stop offset="100%" stop-color="#34D399" stop-opacity="0"/>
  </radialGradient>
</defs>
<circle cx="0" cy="0" r="215" fill="url(#ambxoutward)"/>
<g fill="none" stroke="#000" stroke-opacity="0.55" stroke-width="28.00"
   stroke-linecap="round" stroke-linejoin="round"
   transform="translate(0,7.0)" filter="url(#softxoutward)"><circle cx="0" cy="0" r="46"/><path d="M-150 0 A150 150 0 0 1 -34 -146"/><path d="M-96 132 A150 150 0 0 1 -128 96"/><path d="M96 132 A150 150 0 0 0 150 34"/><path d="M40 -40 L142 -142"/><path d="M142 -142 L64 -142 M142 -142 L142 -64"/></g>
<g fill="none" stroke="url(#metalxoutward)" stroke-width="22.00"
   stroke-linecap="round" stroke-linejoin="round" filter="url(#liftxoutward)"><circle cx="0" cy="0" r="46"/><path d="M-150 0 A150 150 0 0 1 -34 -146"/><path d="M-96 132 A150 150 0 0 1 -128 96"/><path d="M96 132 A150 150 0 0 0 150 34"/><path d="M40 -40 L142 -142"/><path d="M142 -142 L64 -142 M142 -142 L142 -64"/></g>
<g fill="none" stroke="#FFFDF5" stroke-opacity="0.55" stroke-width="5.00"
   stroke-linecap="round" stroke-linejoin="round"
   transform="translate(0,-5.0)"><circle cx="0" cy="0" r="46"/><path d="M-150 0 A150 150 0 0 1 -34 -146"/><path d="M-96 132 A150 150 0 0 1 -128 96"/><path d="M96 132 A150 150 0 0 0 150 34"/><path d="M40 -40 L142 -142"/><path d="M142 -142 L64 -142 M142 -142 L142 -64"/></g>
</svg>`;
const ICON_C6 = `<svg width="512" height="512" viewBox="-210 -210 420 420" xmlns="http://www.w3.org/2000/svg" style="overflow:visible">
<defs>
  <linearGradient id="metalxhorizon" gradientUnits="userSpaceOnUse" x1="0" y1="-170" x2="0" y2="155"><stop offset="0%" stop-color="#D6F8FE"/><stop offset="14%" stop-color="#7EE9F7"/><stop offset="28%" stop-color="#22D3EE"/><stop offset="42%" stop-color="#0B5A68"/><stop offset="50%" stop-color="#EAFEFF"/><stop offset="64%" stop-color="#22D3EE"/><stop offset="80%" stop-color="#128FA6"/><stop offset="100%" stop-color="#0B5A68"/></linearGradient>
  <filter id="softxhorizon" x="-60%" y="-60%" width="220%" height="220%">
    <feGaussianBlur stdDeviation="2.50"/>
  </filter>
  <filter id="liftxhorizon" x="-70%" y="-70%" width="240%" height="240%">
    <feDropShadow dx="0" dy="6.0" stdDeviation="9.0" flood-color="#000" flood-opacity="0.55"/>
    <feDropShadow dx="0" dy="0" stdDeviation="16.0" flood-color="#22D3EE" flood-opacity="0.38"/>
  </filter>
  <radialGradient id="ambxhorizon">
    <stop offset="0%" stop-color="#22D3EE" stop-opacity="0.16"/>
    <stop offset="100%" stop-color="#22D3EE" stop-opacity="0"/>
  </radialGradient>
</defs>
<circle cx="0" cy="0" r="215" fill="url(#ambxhorizon)"/>
<g fill="none" stroke="#000" stroke-opacity="0.55" stroke-width="28.00"
   stroke-linecap="round" stroke-linejoin="round"
   transform="translate(0,7.0)" filter="url(#softxhorizon)"><path d="M0 155 C0 155 116 26 116 -54 A116 116 0 1 0 -116 -54 C-116 26 0 155 0 155 Z"/><circle cx="0" cy="-54" r="44"/></g>
<g fill="none" stroke="url(#metalxhorizon)" stroke-width="22.00"
   stroke-linecap="round" stroke-linejoin="round" filter="url(#liftxhorizon)"><path d="M0 155 C0 155 116 26 116 -54 A116 116 0 1 0 -116 -54 C-116 26 0 155 0 155 Z"/><circle cx="0" cy="-54" r="44"/></g>
<g fill="none" stroke="#FFFDF5" stroke-opacity="0.55" stroke-width="5.00"
   stroke-linecap="round" stroke-linejoin="round"
   transform="translate(0,-5.0)"><path d="M0 155 C0 155 116 26 116 -54 A116 116 0 1 0 -116 -54 C-116 26 0 155 0 155 Z"/><circle cx="0" cy="-54" r="44"/></g>
</svg>`;

const COURSE_ICON = { c1: ICON_C1, c2: ICON_C2, c3: ICON_C3, c4: ICON_C4, c5: ICON_C5, c6: ICON_C6 };

/* Pill CTA from the live tool: borderRadius 999, arrow absolutely positioned so
   the label stays centred independent of arrow width. */
const GlassBtn = ({ href, color, children }) => (
  <a href={href} target="_blank" rel="noopener noreferrer"
    onMouseEnter={e => { const st=e.currentTarget.style; st.background=`linear-gradient(135deg,${color}22,${color}14)`; st.borderColor=`${color}60`; st.boxShadow=`0 0 32px ${color}20,0 4px 16px rgba(0,0,0,.25)`; const a=e.currentTarget.querySelector('[data-arrow]'); if(a){a.style.opacity='1';a.style.transform='translateX(3px)';} }}
    onMouseLeave={e => { const st=e.currentTarget.style; st.background=`linear-gradient(135deg,${color}15,${color}08)`; st.borderColor=`${color}35`; st.boxShadow=`0 0 24px ${color}12,0 4px 12px rgba(0,0,0,.2)`; const a=e.currentTarget.querySelector('[data-arrow]'); if(a){a.style.opacity='0';a.style.transform='translateX(0)';} }}
    style={{ position:"relative", display:"inline-flex", alignItems:"center", justifyContent:"center",
      height:42, padding:"0 36px", borderRadius:999,
      background:`linear-gradient(135deg,${color}15,${color}08)`, border:`1px solid ${color}35`, color,
      fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:700, letterSpacing:".03em", textDecoration:"none",
      cursor:"pointer", boxShadow:`0 0 24px ${color}12,0 4px 12px rgba(0,0,0,.2)`, transition:"all .25s ease" }}>
    {/* flex centring + lineHeight 1: all-caps text has no descenders, so a normal
        line box parks it visually high inside the pill. Padding stays symmetric so
        the label centres independently of the absolutely positioned arrow. */}
    <span style={{ lineHeight:1, display:"block" }}>{children}</span>
    <svg data-arrow="" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      style={{ position:"absolute", right:14, top:"50%", marginTop:-6.5, transition:"transform .25s ease, opacity .25s ease", opacity:0 }}>
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  </a>
);

/* Tiered kicker — mirrors the thank-you page. */
const BAND_DISPLAY = { "Under $500K":"sub-$500K", "$500K - $1M":"$500K\u2013$1M", "$1M - $3M":"$1M\u2013$3M", "$3M - $10M":"$3M\u2013$10M", "$10M+":"$10M+" };

/* ═══════════════════════════════════════════════════════════════
   PAGE FURNITURE
   ═══════════════════════════════════════════════════════════════ */

const Page = ({ children, pageNum, total }) => (
  <div style={{
    width: "8.5in", minHeight: "11in", position: "relative", overflow: "hidden",
    background: "linear-gradient(180deg,#0A0E14 0%,#0D1119 30%,#0E131C 50%,#0D1119 70%,#0A0E14 100%)",
    fontFamily: "'DM Sans',sans-serif", color: C.text1, boxSizing: "border-box",
    pageBreakAfter: "always", breakAfter: "page",
  }}>
    <div style={{ position:"absolute", inset:0, pointerEvents:"none", zIndex:1, opacity:.05, mixBlendMode:"overlay", backgroundImage:GRAIN, backgroundSize:"128px 128px" }}/>
    <div style={{ position:"absolute", top:0, left:0, right:0, height:2, zIndex:5, background:"linear-gradient(90deg,transparent 3%,#C8A24E30 15%,#C8A24E 35%,#D4B665 50%,#C8A24E 65%,#C8A24E30 85%,transparent 97%)" }}/>
    <div style={{ position:"absolute", top:"0.88in", bottom:"0.68in", left:"0.44in", width:.5, background:"linear-gradient(180deg,transparent,#C8A24E20,#C8A24E20,transparent)", zIndex:2 }}/>
    <div style={{ position:"absolute", top:0, left:0, right:0, padding:"0.4in 0.6in 0.18in", display:"flex", justifyContent:"space-between", alignItems:"baseline", fontSize:9, letterSpacing:".16em", textTransform:"uppercase", color:C.text3, fontWeight:500, zIndex:5, pointerEvents:"none" }}>
      <span>Kriczky Virtus</span>
      <span><b style={{ color:C.gold, fontWeight:600 }}>Reinvest or Harvest</b> — Your Scorecard</span>
    </div>
    <div style={{ position:"absolute", top:"0.68in", left:"0.65in", right:"0.65in", height:.5, background:"linear-gradient(90deg,transparent,#C8A24E40,transparent)", zIndex:5 }}/>
    <div style={{ padding:"0.85in 0.6in 0.75in", position:"relative", zIndex:3 }}>{children}</div>
    <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"0 0.6in 0.4in", display:"flex", justifyContent:"space-between", alignItems:"baseline", color:C.text3, zIndex:5 }}>
      <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:12, letterSpacing:".08em", textTransform:"uppercase" }}>
        <b style={{ color:C.gold, fontWeight:600 }}>Kriczky</b> Virtus
      </span>
      <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:13, color:C.text2 }}>
        {pageNum} <span style={{ color:C.text4 }}>/</span> {total}
      </span>
    </div>
    <div style={{ position:"absolute", bottom:0, left:0, right:0, height:1, background:"linear-gradient(90deg,transparent,#C8A24E20,#C8A24E40,#C8A24E20,transparent)" }}/>
  </div>
);

const Shield = ({ size = 28, glow = false }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none"
    style={glow ? { filter: "drop-shadow(0 0 12px #C8A24E60) drop-shadow(0 0 4px #C8A24E90)" } : {}}>
    <path d="M32 8L14 16V30C14 42 22 52 32 56C42 52 50 42 50 30V16L32 8Z" fill="none" stroke="#C8A24E" strokeWidth="2.5" strokeLinejoin="round"/>
    <path d="M32 12L18 18.5V30C18 40.5 24.5 49 32 52C39.5 49 46 40.5 46 30V18.5L32 12Z" fill="rgba(200,162,78,0.06)"/>
  </svg>
);

const ScoreStrip = ({ value, lowLabel, highLabel }) => {
  const c = scoreColor(value);
  return (
    <div style={{ padding:"16px 20px", borderRadius:12, marginTop:14,
      background:`linear-gradient(145deg,${c}09,${c}03)`, border:`1.5px solid ${c}4d`, boxShadow:`0 0 20px ${c}14, inset 0 1px 0 ${c}14` }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:10 }}>
        <span style={{ fontSize:9, fontWeight:700, letterSpacing:".12em", textTransform:"uppercase", color:c }}>Your answer</span>
        <span style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:700, color:c }}>
          {value}<span style={{ fontSize:12, color:C.text3 }}>/6</span>
        </span>
      </div>
      <div style={{ display:"flex", gap:6, marginBottom:7 }}>
        {[1,2,3,4,5,6].map(n => {
          const nc = scoreColor(n), on = n === value;
          return (
            <div key={n} style={{ flex:1, height:34, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center",
              background: on ? `${nc}22` : `${nc}05`, border:`1.5px solid ${on ? nc : `${nc}1c`}`,
              boxShadow: on ? `0 0 14px ${nc}44` : "none", opacity: on ? 1 : .42 }}>
              <span style={{ fontFamily:"'Playfair Display',serif", fontSize:15, fontWeight:700, color: on ? nc : `${nc}55` }}>{n}</span>
            </div>
          );
        })}
      </div>
      <div style={{ display:"flex", justifyContent:"space-between" }}>
        <span style={{ fontSize:9, color:C.text3 }}>{lowLabel}</span>
        <span style={{ fontSize:9, color:C.text3 }}>{highLabel}</span>
      </div>
    </div>
  );
};

/* visual lookup, keyed to dimension */
const VISUALS = { b1: VisualROI, b2: VisualMargin, b3: VisualConstraint, b4: VisualHeadroom, b5: VisualRunway,
                  p1: VisualSplit, p2: VisualReserve, p3: VisualConcentration, p4: VisualTaxYear, p5: VisualGap };

const BIZ_KEYS = ["b1","b2","b3","b4","b5"];
const PERS_KEYS = ["p1","p2","p3","p4","p5"];
const TOTAL_PAGES = 16;

/* ═══════════════════════════════════════════════════════════════ */

export default function ReinvestHarvestReport({
  name = "Edward",
  email = "you@yourcompany.com",
  scores: initialScores = { b1:5, b2:4, b3:5, b4:4, b5:6, p1:2, p2:3, p3:2, p4:3, p5:2 },
  guess = "reinvest",
  revenueBand = "$3M - $10M",
  ownerTier = "Owner",
  token = "sample",
  shareUrl = "https://kriczkyvirtus.com/r/sample",
}) {
  const [scores, setScores] = useState(initialScores);
  const [copied, setCopied] = useState(false);

  /* The report is a fixed 8.5in (816px) document. On a narrow device we widen
     the viewport to the page width and scale it down to exactly fit, so the
     whole page is legible without pinch-zooming and without reflowing.
     Scale is computed from the real device width rather than a fixed guess.
     Never use CSS zoom or transform:scale here — both blanked the page in prod. */
  useEffect(() => {
    const vp = document.querySelector('meta[name="viewport"]');
    if (!vp) return;
    const original = vp.getAttribute("content");
    const PAGE = 816;
    const apply = () => {
      /* Use whichever is smaller. screen.width alone misses resized desktop browsers;
         innerWidth alone misreads some mobile browsers during orientation change. */
      const sw = window.screen && window.screen.width ? window.screen.width : Infinity;
      const w = Math.min(sw, window.innerWidth || Infinity);
      if (w < PAGE) {
        const scale = Math.max(0.25, Math.round((w / PAGE) * 1000) / 1000);
        vp.setAttribute("content", `width=${PAGE}, initial-scale=${scale}, minimum-scale=${scale}, user-scalable=yes`);
      } else {
        vp.setAttribute("content", "width=device-width, initial-scale=1");
      }
    };
    apply();
    window.addEventListener("orientationchange", apply);
    return () => {
      window.removeEventListener("orientationchange", apply);
      if (original) vp.setAttribute("content", original);
    };
  }, []);


  const biz = BIZ_KEYS.reduce((a,k) => a + scores[k], 0);
  const pers = PERS_KEYS.reduce((a,k) => a + scores[k], 0);
  const total = biz + pers;
  const quad = getQuadrant(biz, pers);
  const band = BANDS.find(b => total >= b.min && total <= b.max);
  const gap = Math.abs(biz - pers);
  const offerKey = routeTo(revenueBand, ownerTier);
  const lowestThree = [...DIMS].sort((a,b) => scores[a.key] - scores[b.key]).slice(0,3);
  const agreed = guess ? guess === quad.key : null;
  const guessLabel = { reinvest:"Reinvest", harvest:"Take profit", split:"Split" }[guess];
  const copyShareUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      const input = document.createElement("textarea");
      input.value = shareUrl;
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const H = { fontFamily:"'Cormorant Garamond',serif", fontWeight:700, color:C.text1, lineHeight:1.15 };
  const K = { fontSize:9, fontWeight:700, letterSpacing:".18em", textTransform:"uppercase" };
  const P = { fontSize:12, lineHeight:1.68, color:C.text2 };

  return (
    <div style={{ background:C.bgDeep, minHeight:"100vh", paddingBottom:86 }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet"/>
      <style>{`
        @media print{.gap{display:none!important}.bar{display:none!important}}
        .rcard{transition:box-shadow .3s ease,border-color .3s ease,background .3s ease}
        .rcard:hover{
          border-color:var(--glowEdge)!important;
          background:linear-gradient(160deg,var(--glowSoft),rgba(255,255,255,.02))!important;
          box-shadow:0 0 30px var(--glowSoft),0 0 60px var(--glowSoft),inset 0 0 22px rgba(255,255,255,.02);
        }
        /* the report is also a printable document — never carry the glow to paper */
        @media print{.rcard{transition:none!important}.rcard:hover{box-shadow:none!important;border-color:inherit!important;background:inherit!important}}
      `}</style>
      <div style={{ maxWidth:"8.5in", margin:"0 auto" }}>

        {/* ═══ 1 · YOUR POSITION ═══ */}
        <Page pageNum={1} total={TOTAL_PAGES}>
          <div style={{ textAlign:"center", paddingTop:6 }}>
            <button type="button" onClick={copyShareUrl} aria-label="Share this report"
              style={{ position:"absolute", top:4, right:0, zIndex:6, minWidth:70, height:30, padding:"0 12px", borderRadius:999,
                border:`1px solid ${C.gold}44`, background:`${C.gold}0d`, color:C.gold, cursor:"pointer",
                fontFamily:"'DM Sans',sans-serif", fontSize:9, fontWeight:700, letterSpacing:".06em", textTransform:"uppercase" }}>
              {copied ? "Copied" : "Share"}
            </button>
            <div style={{ display:"flex", justifyContent:"center", marginBottom:12 }}><Shield size={44} glow/></div>
            <div style={{ ...K, color:C.text3, marginBottom:16 }}>Prepared for {name}</div>
            <div style={{ ...K, color:quad.color, marginBottom:10 }}>Your position</div>
            <div style={{ ...H, fontSize:38, textTransform:"uppercase", letterSpacing:".02em", color:quad.color, marginBottom:14 }}>
              {quad.label}
            </div>
            <p style={{ fontSize:14, lineHeight:1.6, color:C.text1, maxWidth:"5.6in", margin:"0 auto 22px" }}>{quad.line}</p>

            {agreed !== null && (
              <div style={{ padding:"13px 17px", borderRadius:10, textAlign:"left", marginBottom:20,
                background:`${agreed ? C.green : C.amber}0d`, border:`1px solid ${(agreed ? C.green : C.amber)}33` }}>
                <div style={{ ...K, fontSize:8.5, color: agreed ? C.green : C.amber, marginBottom:5 }}>
                  {agreed ? "Your read was right" : "Your read and your answers disagree"}
                </div>
                <div style={{ fontSize:11.5, lineHeight:1.6, color:C.text2 }}>
                  {agreed
                    ? <>You went in leaning <b style={{ color:C.text1 }}>{guessLabel}</b>, and the ten answers agree. That's a confident read — act on it.</>
                    : <>You went in leaning <b style={{ color:C.text1 }}>{guessLabel}</b>. Your answers point to <b style={{ color:quad.color }}>{quad.label}</b>. That gap is worth sitting with; it usually means one side is being judged on how it feels rather than what it measures.</>}
                </div>
              </div>
            )}

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>
              {[QUADRANTS.harvest, QUADRANTS.reinvest, QUADRANTS.stabilize, QUADRANTS.split].map(q => {
                const on = q.key === quad.key;
                return (
                  <div key={q.key} style={{ padding:"16px 12px", borderRadius:11, minHeight:70, display:"flex", flexDirection:"column",
                    alignItems:"center", justifyContent:"center",
                    background:`linear-gradient(135deg,${q.color}${on?"1c":"07"},${q.color}03)`,
                    border:`1.5px solid ${q.color}${on?"66":"1e"}`, boxShadow:on?`0 0 20px ${q.color}2b`:"none", opacity:on?1:.4 }}>
                    <span style={{ fontSize:12, fontWeight:700, color:q.color, lineHeight:1.3, textAlign:"center" }}>{q.label}</span>
                    {on && <span style={{ display:"table", marginTop:6, padding:"3px 9px", borderRadius:5, background:`${q.color}22`, border:`1px solid ${q.color}44` }}>
                      <span style={{ display:"table-cell", verticalAlign:"middle", fontSize:7.5, fontWeight:700, letterSpacing:".12em", textTransform:"uppercase", color:q.color }}>You are here</span>
                    </span>}
                  </div>
                );
              })}
            </div>

            <div style={{ display:"flex", gap:12 }}>
              {[{l:"Business Capacity",v:biz,c:BIZ},{l:"Personal Foundation",v:pers,c:PERS}].map(p => (
                <div key={p.l} style={{ flex:1, padding:"15px 12px", borderRadius:11, background:`${p.c}0a`, border:`1px solid ${p.c}2e` }}>
                  <div style={{ ...K, fontSize:8.5, color:p.c, marginBottom:5 }}>{p.l}</div>
                  <div style={{ fontFamily:"'Playfair Display',serif", fontSize:29, fontWeight:700, color:p.c, lineHeight:1 }}>
                    {p.v}<span style={{ fontSize:13, color:C.text3 }}>/{PILLAR_MAX}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Page>
        <div className="gap" style={{ height:24 }}/>

        {/* ═══ 2 · WHAT THIS MEANS ═══ */}
        <Page pageNum={2} total={TOTAL_PAGES}>
          <div style={{ ...K, color:quad.color, marginBottom:10 }}>What this means</div>
          <div style={{ ...H, fontSize:28, marginBottom:16 }}>{quad.label}</div>
          <p style={{ ...P, marginBottom:18 }}>{quad.body}</p>
          <div style={{ padding:"16px 20px", borderRadius:11, background:`${C.amber}09`, border:`1px solid ${C.amber}2e`, marginBottom:18 }}>
            <div style={{ ...K, fontSize:9, color:C.amber, marginBottom:7 }}>The trap in this position</div>
            <p style={{ ...P, fontSize:11.5, margin:0 }}>{quad.watch}</p>
          </div>
          {gap >= 6 && (
            <div style={{ padding:"18px 20px", borderRadius:12, background:`${C.amber}0d`, border:`1.5px solid ${C.amber}3d` }}>
              <div style={{ ...K, fontSize:9, color:C.amber, marginBottom:8 }}>Read the split, not the total</div>
              <p style={{ ...P, fontSize:11.5, margin:0 }}>
                Your two sides are <b style={{ color:C.text1 }}>{gap} points apart</b>.{" "}
                <b style={{ color: biz > pers ? BIZ : PERS }}>{biz > pers ? "Business Capacity" : "Personal Foundation"}</b>{" "}
                is carrying this score. A respectable total built almost entirely on one side is a different situation from the same total spread evenly, and it calls for a different decision. Your position is based on the two sides separately — not on the total.
              </p>
            </div>
          )}
        </Page>
        <div className="gap" style={{ height:24 }}/>

        {/* ═══ 3 · YOUR TEN SCORES ═══ */}
        <Page pageNum={3} total={TOTAL_PAGES}>
          <div style={{ ...K, color:C.gold, marginBottom:10 }}>The whole picture</div>
          <div style={{ ...H, fontSize:28, marginBottom:20 }}>Your ten scores</div>
          {[["Business Capacity", BIZ, BIZ_KEYS, biz], ["Personal Foundation", PERS, PERS_KEYS, pers]].map(([label, col, keys, sub]) => (
            <div key={label} style={{ marginBottom:18 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:9 }}>
                <span style={{ ...K, fontSize:9, color:col }}>{label}</span>
                <span style={{ fontFamily:"'Playfair Display',serif", fontSize:16, fontWeight:700, color:col }}>
                  {sub}<span style={{ fontSize:11, color:C.text3 }}>/{PILLAR_MAX}</span>
                </span>
              </div>
              {keys.map(k => {
                const d = DIMS.find(x => x.key === k), v = scores[k], c = scoreColor(v);
                return (
                  <div key={k} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:7 }}>
                    <span style={{ fontSize:10.5, color:C.text2, width:190, flexShrink:0 }}>{d.title}</span>
                    <div style={{ flex:1, height:8, borderRadius:4, background:"rgba(255,255,255,.05)", overflow:"hidden" }}>
                      <div style={{ width:`${(v/6)*100}%`, height:"100%", borderRadius:4, background:c, boxShadow:`0 0 7px ${c}55` }}/>
                    </div>
                    <span style={{ fontFamily:"'Playfair Display',serif", fontSize:13, fontWeight:700, color:c, width:20, textAlign:"right" }}>{v}</span>
                  </div>
                );
              })}
            </div>
          ))}
          <div style={{ padding:"15px 19px", borderRadius:11, background:`${band.color}0a`, border:`1px solid ${band.color}33`, marginTop:6 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:8 }}>
              <span style={{ ...K, fontSize:9.5, color:band.color }}>{band.label}</span>
              <span style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:700, color:band.color }}>
                {total}<span style={{ fontSize:13, color:C.text3 }}>/60</span>
              </span>
            </div>
            <p style={{ ...P, fontSize:11.5, margin:0 }}>{band.desc}</p>
          </div>
        </Page>
        <div className="gap" style={{ height:24 }}/>

        {/* ═══ 4–13 · DIMENSION PAGES ═══ */}
        {DIMS.map((d, i) => {
          const PC = d.pillar === "biz" ? BIZ : PERS;
          const Vz = VISUALS[d.key];
          const sc = scores[d.key];
          return (
            <div key={d.key}>
              <Page pageNum={4 + i} total={TOTAL_PAGES}>
                <div style={{ position:"relative" }}>
                  <div style={{ position:"absolute", top:-10, right:-10, fontFamily:"'Playfair Display',serif", fontSize:124, fontWeight:700, color:PC, opacity:.035, lineHeight:1, userSelect:"none" }}>
                    {String(d.num).padStart(2,"0")}
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                    <span style={{ ...K, color:PC }}>Dimension {String(d.num).padStart(2,"0")} of 10</span>
                    <span style={{ display:"table", padding:"3px 10px", borderRadius:5, background:`${PC}15`, border:`1px solid ${PC}30` }}>
                      <span style={{ display:"table-cell", verticalAlign:"middle", fontSize:8, fontWeight:700, letterSpacing:".1em", textTransform:"uppercase", color:PC }}>
                        {d.pillar === "biz" ? "Business Capacity" : "Personal Foundation"}
                      </span>
                    </span>
                  </div>
                  <div style={{ ...H, fontSize:29, textTransform:"uppercase", letterSpacing:".02em", marginBottom:4 }}>{d.title}</div>
                  <div style={{ fontSize:10, fontWeight:700, letterSpacing:".06em", textTransform:"uppercase", color:PC, marginBottom:13 }}>{d.subtitle}</div>
                  <p style={{ ...P, marginBottom:13 }}>{d.description}</p>
                  <div style={{ padding:"11px 17px", borderRadius:10, background:`linear-gradient(135deg,${PC}08,${PC}02)`, border:`1px solid ${PC}20` }}>
                    <div style={{ fontSize:8.5, fontWeight:700, letterSpacing:".1em", textTransform:"uppercase", color:PC, marginBottom:7 }}>What a strong answer looks like</div>
                    {d.checks.map((c,ci) => (
                      <div key={ci} style={{ display:"flex", gap:9, alignItems:"flex-start", padding:"4px 0" }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0, marginTop:3 }}>
                          <polyline points="4 12 10 18 20 6" stroke={PC} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <div>
                          <span style={{ fontSize:11, color:C.text1, lineHeight:1.4 }}>{c.text}</span>
                          {c.sub && <span style={{ display:"block", fontSize:9.5, color:C.text3, lineHeight:1.4, marginTop:1 }}>{c.sub}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                  <ScoreStrip value={sc} lowLabel={d.lowLabel} highLabel={d.highLabel}/>
                  <div style={{ marginTop:14, padding:"12px 14px 6px", borderRadius:10, background:"rgba(255,255,255,.016)", border:"1px solid rgba(255,255,255,.06)" }}>
                    <Vz score={sc}/>
                  </div>
                </div>
              </Page>
              <div className="gap" style={{ height:24 }}/>
            </div>
          );
        })}

        {/* ═══ 14 · YOUR THREE MOVES ═══ */}
        <Page pageNum={14} total={TOTAL_PAGES}>
          <div style={{ ...K, color:PERS, marginBottom:10 }}>Your personalised next steps</div>
          <div style={{ ...H, fontSize:30, marginBottom:12 }}>Your first three moves.</div>
          <p style={{ ...P, marginBottom:20 }}>
            These come from your three lowest-scoring dimensions, calibrated to the level you actually scored — a 2 and a 5 on the same dimension call for different work. None of them need money you don't have. Every one is doable inside thirty days.
          </p>
          {lowestThree.map((d,i) => {
            const sc = scores[d.key];
            const tier = sc <= 2 ? "low" : sc <= 4 ? "mid" : "high";
            const tac = d.quickWins[tier][0];
            const PC = d.pillar === "biz" ? BIZ : PERS;
            return (
              <div key={d.key} style={{ padding:"14px 18px", borderRadius:10, background:`${PC}06`, border:`1px solid ${PC}20`, marginBottom:12 }}>
                <div style={{ display:"flex", gap:8, marginBottom:8 }}>
                  <span style={{ display:"table", padding:"3px 10px", borderRadius:5, background:`${C.gold}15`, border:`1px solid ${C.gold}30` }}>
                    <span style={{ display:"table-cell", verticalAlign:"middle", fontSize:8, fontWeight:700, letterSpacing:".1em", textTransform:"uppercase", color:C.gold }}>Move {String(i+1).padStart(2,"0")}</span>
                  </span>
                  <span style={{ display:"table", padding:"3px 10px", borderRadius:5, background:`${PC}12`, border:`1px solid ${PC}30` }}>
                    <span style={{ display:"table-cell", verticalAlign:"middle", fontSize:8, fontWeight:700, letterSpacing:".1em", textTransform:"uppercase", color:PC }}>{d.title} · {sc}/6</span>
                  </span>
                </div>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:17, fontWeight:700, color:C.text1, marginBottom:5, lineHeight:1.25 }}>{tac.title}</div>
                <div style={{ fontSize:10.5, lineHeight:1.55, color:C.text2 }}>{tac.context}</div>
              </div>
            );
          })}
          <div style={{ padding:"14px 18px", borderRadius:10, background:`${C.gold}06`, border:`1.5px solid ${C.gold}25`, marginTop:4 }}>
            <div style={{ ...P, fontSize:11.5 }}>
              You can run all three of these yourself — none of them need me. What they won't do is answer the larger question underneath: whether the direction you're leaning is the one your specific numbers actually support. That takes a look at real financials, not self-reported scores. <span style={{ color:C.gold, fontWeight:700 }}>Page 16 is where that starts.</span>
            </div>
          </div>
        </Page>
        <div className="gap" style={{ height:24 }}/>

        {/* ═══ 15 · WHERE THIS LEADS ═══ */}
        <Page pageNum={15} total={TOTAL_PAGES}>
          <div style={{ textAlign:"center", marginBottom:26 }}>
            <div style={{ ...K, color:C.gold, marginBottom:12 }}>Where this leads</div>
            <div style={{ ...H, fontSize:32, marginBottom:12 }}>
              The scorecard is <span style={{ color:C.gold, fontStyle:"italic", fontWeight:400 }}>step one</span>
            </div>
            <p style={{ ...P, maxWidth:"4.8in", margin:"0 auto" }}>
              It answers the reinvest-or-harvest question for where you are today. This is the system for how you keep answering it as the business changes.
            </p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            {ROADMAP.map(r => (
              <div key={r.n} className="rcard" style={{ padding:"16px 15px", borderRadius:12, textAlign:"center",
                background:`linear-gradient(160deg,${r.c}0a,rgba(255,255,255,.012))`, border:`1px solid ${r.c}22`,
                /* glow colour tracks the icon's own colour */
                "--glowSoft":`${r.c}2e`, "--glowEdge":`${r.c}70` }}>
                <div style={{ height:54, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:8 }}
                  dangerouslySetInnerHTML={{ __html: COURSE_ICON[r.ic].replace('width="512" height="512"','width="50" height="50"') }}/>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:15, fontWeight:700, color:`${r.c}88`, letterSpacing:".06em", marginBottom:6 }}>{r.n}</div>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:18, fontWeight:700, color:C.text1, lineHeight:1.2, marginBottom:6 }}>{r.t}</div>
                <div style={{ fontSize:13, lineHeight:1.45, color:C.text3 }}>{r.d}</div>
              </div>
            ))}
          </div>
        </Page>
        <div className="gap" style={{ height:24 }}/>

        {/* ═══ 16 · YOUR NEXT STEP ═══ */}
        <Page pageNum={16} total={TOTAL_PAGES}>
          <div style={{ ...K, color:C.gold, marginBottom:10 }}>
            {BAND_DISPLAY[revenueBand] ? `What Happens Next For ${BAND_DISPLAY[revenueBand]} Owners` : "What Happens Next"}
          </div>
          <div style={{ ...H, fontSize:27, marginBottom:18 }}>
            Knowing which way you lean is the beginning, <span style={{ color:C.gold }}>not the end.</span>
          </div>

          <div style={{ display:"flex", gap:16, alignItems:"flex-start", marginBottom:18 }}>
            <img src={HEADSHOT} alt="" style={{ width:84, height:84, borderRadius:"50%", flexShrink:0, objectFit:"cover", outline:`2px solid ${C.gold}40`, outlineOffset:2 }}/>
            <div>
              <div style={{ fontSize:13.5, fontWeight:700, color:C.text1 }}>
                Edward Kriczky, CEPA<sup style={{ fontSize:9, fontWeight:600, marginLeft:1 }}>&#174;</sup>
              </div>
              <div style={{ fontSize:11, color:C.gold, marginBottom:7 }}>Founder, Kriczky Virtus</div>
              <div style={{ fontSize:10.5, lineHeight:1.6, color:C.text2 }}>
                <span style={{ color:C.gold, fontWeight:600 }}>We've all heard the phrase "reinvest back into your business" — but nobody shows you how, specifically customized to your company's unique situation. I help business owners figure out where their best opportunities for ROI are when reinvesting back into their business, aligned with where they want their business to go long-term.</span>{" "}
                Most advisors work one side of this. Your CPA looks at the business, someone else looks at your personal accounts, and nobody is in the room when you decide where the next dollar goes.
              </div>
            </div>
          </div>

          <div style={{ padding:"18px 22px", borderRadius:12, background:`linear-gradient(135deg,${C.gold}06,${C.gold}02)`, border:`1.5px solid ${C.gold}25`, marginBottom:18 }}>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:19, fontWeight:500, color:C.text1, marginBottom:15 }}>
              {offerKey === "oneToOne" ? "How I help owners 1-on-1." : "Where to start."}
            </div>
            <div style={{ display:"flex", alignItems:"flex-start" }}>
              {(offerKey === "oneToOne" ? [
                { l:"Step 1", t:"Free Working Session", d:"We walk your two scores against your actual numbers. No pitch, no deck.", c:C.gold,
                  icon:<><rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke={C.gold} strokeWidth="1.3" fill="none"/><line x1="3" y1="10" x2="21" y2="10" stroke={C.gold} strokeWidth="1.3"/><line x1="8" y1="2" x2="8" y2="6" stroke={C.gold} strokeWidth="1.3"/><line x1="16" y1="2" x2="16" y2="6" stroke={C.gold} strokeWidth="1.3"/></> },
                { l:"Step 2", t:"Find Your ROI Opportunities", d:"We rank where a reinvested dollar actually earns in your business.", c:C.gold,
                  icon:<><line x1="6" y1="20" x2="6" y2="16" stroke={C.gold} strokeWidth="1.3"/><line x1="12" y1="20" x2="12" y2="10" stroke={C.gold} strokeWidth="1.3"/><line x1="18" y1="20" x2="18" y2="4" stroke={C.gold} strokeWidth="1.3"/></> },
                { l:"Step 3", t:"Reinvest, Together", d:"We work the highest-return moves and re-rank as the business changes.", c:C.green,
                  icon:<><circle cx="12" cy="12" r="9" stroke={C.green} strokeWidth="1.3" fill="none"/><circle cx="12" cy="12" r="5" stroke={C.green} strokeWidth="1.3" fill="none"/><circle cx="12" cy="12" r="1.5" fill={C.green}/></> },
              ] : [
                { l:"Step 1", t:"Join The Virtus Collective", d:"Free. Where owners at your stage work through these decisions.", c:C.gold,
                  icon:<><path d="M17 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2" stroke={C.gold} strokeWidth="1.3" fill="none"/><circle cx="10" cy="7" r="4" stroke={C.gold} strokeWidth="1.3" fill="none"/><path d="M23 21v-2a4 4 0 00-3-3.87" stroke={C.gold} strokeWidth="1.3" fill="none"/></> },
                { l:"Step 2", t:"Work Your Lowest Scores", d:"Your three moves, plus the playbooks and owners already running them.", c:C.gold,
                  icon:<><line x1="6" y1="20" x2="6" y2="16" stroke={C.gold} strokeWidth="1.3"/><line x1="12" y1="20" x2="12" y2="10" stroke={C.gold} strokeWidth="1.3"/><line x1="18" y1="20" x2="18" y2="4" stroke={C.gold} strokeWidth="1.3"/></> },
                { l:"Step 3", t:"Re-Score As You Grow", d:"Come back through the scorecard. The right answer changes with you.", c:C.green,
                  icon:<><circle cx="12" cy="12" r="9" stroke={C.green} strokeWidth="1.3" fill="none"/><circle cx="12" cy="12" r="5" stroke={C.green} strokeWidth="1.3" fill="none"/><circle cx="12" cy="12" r="1.5" fill={C.green}/></> },
              ]).map((st,i,arr) => (
                <div key={i} style={{ display:"flex", alignItems:"flex-start", flex: i < arr.length-1 ? 1 : undefined }}>
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
                    <div style={{ width:36, height:36, borderRadius:"50%", border:`2px solid ${st.c}55`, background:`${st.c}06`, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:`0 0 10px ${st.c}20, 0 0 3px ${st.c}25` }}>
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none">{st.icon}</svg>
                    </div>
                    <span style={{ fontSize:7.5, fontWeight:700, letterSpacing:".06em", textTransform:"uppercase", color:st.c, marginTop:5 }}>{st.l}</span>
                    <span style={{ fontSize:9.5, fontWeight:600, color:C.text1, marginTop:3, textAlign:"center" }}>{st.t}</span>
                    <span style={{ fontSize:8.5, color:C.text2, lineHeight:1.45, textAlign:"center", marginTop:3, maxWidth:130 }}>{st.d}</span>
                  </div>
                  {i < arr.length-1 && <div style={{ flex:1, height:2, marginTop:18, background:`${C.gold}45`, boxShadow:`0 0 4px ${C.gold}15` }}/>}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display:"flex", justifyContent:"center", marginBottom:16 }}>
            <GlassBtn href={offerKey === "oneToOne" ? CTA_QUALIFIED(token) : CTA_COLLECTIVE} color={C.gold}>
              {offerKey === "oneToOne" ? "BOOK YOUR FREE WORKING SESSION" : "JOIN THE VIRTUS COLLECTIVE — FREE"}
            </GlassBtn>
          </div>

          <div style={{ padding:"12px 0 12px 17px", borderLeft:`3px solid ${C.gold}60`, marginBottom:14 }}>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:15, fontStyle:"italic", lineHeight:1.5, color:C.text1 }}>
              Nobody decides to put everything into one asset. It happens one reasonable decision at a time, over fifteen years, and each individual choice was defensible. The owners who end up with real freedom aren't the ones who chose the business over themselves, or themselves over the business. They're the ones who <span style={{ color:C.gold, fontWeight:700, fontStyle:"normal" }}>decided on purpose.</span>
            </div>
          </div>

          <div style={{ padding:"11px 15px", borderRadius:8, background:"rgba(255,255,255,.02)", border:"1px solid rgba(255,255,255,.06)", marginBottom:12 }}>
            <div style={{ fontSize:8, fontWeight:700, letterSpacing:".1em", textTransform:"uppercase", color:C.text3, marginBottom:5 }}>Important disclosure</div>
            <div style={{ fontSize:8.5, lineHeight:1.55, color:C.text3 }}>
              This scorecard is an educational self-assessment tool from Kriczky Virtus. It is general in nature, is based entirely on your own self-reported answers, and does not constitute individualized financial, tax, legal, or accounting advice, nor a recommendation to pursue any particular course of action. No outcome is projected or guaranteed. Your situation is specific to you — coordinate any decision with your CPA, attorney, and other advisors before acting.
            </div>
          </div>

          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
            <div style={{ fontSize:9.5, color:C.text3, lineHeight:1.7 }}>
              ekriczky@kriczkyvirtus.com<br/>kriczkyvirtus.com
            </div>
            <Shield size={28} glow/>
          </div>
        </Page>
      </div>

      {/* preview bar — strip before deploy */}
      {PREVIEW && <div className="bar" style={{ position:"fixed", bottom:0, left:0, right:0, zIndex:99, background:"rgba(10,14,20,.96)", backdropFilter:"blur(10px)",
        borderTop:`1px solid ${C.gold}44`, padding:"11px 14px", display:"flex", gap:9, flexWrap:"wrap", justifyContent:"center", alignItems:"center", fontFamily:"'DM Sans',sans-serif" }}>
        <span style={{ fontSize:8.5, fontWeight:700, letterSpacing:".14em", textTransform:"uppercase", color:C.gold, padding:"3px 8px", borderRadius:4, border:`1px solid ${C.gold}55` }}>Preview</span>
        {[["Split",{b1:5,b2:4,b3:5,b4:4,b5:6,p1:2,p2:3,p3:2,p4:3,p5:2}],
          ["Reinvest",{b1:5,b2:5,b3:6,b4:5,b5:6,p1:5,p2:5,p3:4,p4:5,p5:5}],
          ["Harvest",{b1:2,b2:2,b3:3,b4:2,b5:2,p1:6,p2:5,p3:5,p4:4,p5:5}],
          ["Stabilize",{b1:2,b2:1,b3:2,b4:2,b5:1,p1:1,p2:2,p3:1,p4:2,p5:2}]].map(([l,s]) => (
          <button key={l} onClick={() => setScores(s)}
            style={{ padding:"5px 11px", borderRadius:7, cursor:"pointer", fontSize:10.5, fontWeight:600, fontFamily:"'DM Sans',sans-serif",
              color:C.gold, background:`${C.gold}12`, border:`1px solid ${C.gold}44` }}>{l}</button>
        ))}
        <span style={{ fontSize:10.5, color:C.text2 }}>
          Biz <b style={{ color:BIZ }}>{biz}</b> · Pers <b style={{ color:PERS }}>{pers}</b> · {quad.label}
        </span>
      </div>}
    </div>
  );
}
