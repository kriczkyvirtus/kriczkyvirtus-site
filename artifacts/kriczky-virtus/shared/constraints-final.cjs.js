// ═══════════════════════════════════════════════════════════════
// CONSTRAINT CONTENT MAP — FINAL
// ═══════════════════════════════════════════════════════════════
// Voice: operator-to-operator. Never teaching, never patronizing.
//
// Exports:
//  CONSTRAINTS        — keyed by constraintId, fully tiered
//  STRATEGIC_INTENSIVE_COPY  — shared Strategic Intensive pitch
//  COMMUNITY_COPY       — shared Build with Valor community pitch
//  resolveConstraint(id, rev) — returns tier-resolved constraint content
//  getRevenueTier(rev)    — maps assessment revenue to content tier
//
// Tier mapping:
//  survival   = under $500K
//  stabilizing = $500K – $1.5M
//  scaling   = $1.5M – $5M (the default)
//  optimizing  = $5M+
//
// Constraints (6):
//  profitability     → gold
//  cash_flow       → green
//  owner_dependency    → amber
//  revenue_quality    → gold
//  operational_efficiency → amber
//  scalability      → cyan
// ═══════════════════════════════════════════════════════════════

const COLORS = {
 gold: "#C8A24E",
 green: "#34D399",
 red: "#F87171",
 amber: "#FBBF24",
 cyan: "#22D3EE",
};

// ─── REVENUE TIER HELPERS ────────────────────────────────────
function getRevenueTier(revenue) {
 switch (revenue) {
  case "under_500k": return "survival";
  case "500k_1m":  return "stabilize";
  case "1m_3m":   return "growth";
  case "3m_10m":   return "optimize";
  case "over_10m":  return "scaling";
  default:      return "growth";
 }
}

// ─── RESOLVER ────────────────────────────────────────────────
function resolveConstraint(constraintId, revenue) {
 const c = CONSTRAINTS[constraintId] || CONSTRAINTS.cash_flow;
 const tier = getRevenueTier(revenue);
 const content = c.byTier[tier] || c.byTier.growth;
 return { name: c.name, color: c.color, ...content };
}

// ═══════════════════════════════════════════════════════════════
// CONSTRAINTS
// ═══════════════════════════════════════════════════════════════
const CONSTRAINTS = {
 // ============================================================
 // PROFITABILITY (gold)
 // ============================================================
 profitability: {
  name: "Profitability & Margins",
  color: COLORS.gold,
  byTier: {
   // ── SURVIVAL ─────────────────────────────────────────
   survival: {
    summary:
     "You're making money on paper, but you can't feel it in your life. The invoices go out, the work gets done, and somehow by the end of the month there's nothing left.\n\nYou know how to run this business. What you don't know is why all the effort you're putting in isn't showing up in the bank account. You're starting to suspect the problem isn't that you're not working hard enough. You're right about that. It isn't.",
    rootCauses: [
     "You're charging what feels reasonable. Not what the work is actually worth to the customer. You might be underpriced by 20-30% without knowing it, but unfortunately customers won't volunteer that information.",
     "You're saying yes to work that pays the bills but doesn't pay for your time. And you can't tell the good work from the bad work until you look at the real numbers on a real job.",
     "You don't know your true margin on any individual job or client. So you can't tell which work is building the business and which work is draining it.",
    ],
    consequence:
     "In 12 months: you'll still be working 60-hour weeks for what works out to a below-market salary. The business will still look successful from the outside. And you'll still be the only person who knows how close to the edge you really are.\n\nThis is the trap that kills more owners at your stage than any other. It isn't a bad business, but you work harder to make sure everyone else gets paid than you work to make sure you as the owner are rewarded for all your effort.",
    actions: [
     {
      n: "01",
      title: "Find out what your last 5 jobs actually made you",
      body: "Pull your last 5 invoices. For each one, subtract every real cost: materials, subs, your own time at a fair hourly rate, any team time. Compare the result to what you charged. You're going to find at least one job that lost you money and probably two that made almost nothing. This is the type of data you need to track to get unstuck.",
     },
     {
      n: "02",
      title: "Raise your next three quotes by 15%",
      body: "Not 5%. Not 10%. 15%. The goal isn't to cover costs. It's to start capturing what the work is actually worth to the customer. You'll lose some bids. The ones you win at the higher price will make more money than the ones you lost would have. This is how you find out you've been the cheap option in the market without knowing it.",
     },
     {
      n: "03",
      title: "Let go of your worst client this month",
      body: "You already know which one. The one who pays slow, asks for discounts, scope-creeps every project, and takes up 40% of your mental energy. Every hour you spend on them is an hour you can't spend on a better client. You're not firing them out of anger. You're making room.",
     },
    ],
    benchmark: {
     headline:
      "The owners who break through profitability at your stage all do one thing first.",
     body: "They stop pricing from fear. The ones still stuck below $500K five years from now are the ones who never raised prices because they were afraid of losing customers. The ones who broke through to $1M usually did it on roughly the same revenue base — with margins that finally reflected what their work was worth.",
    },
   },

   // ── STABILIZING ──────────────────────────────────────
   stabilize: {
    summary:
     "Your business is making money, but you can't feel it. Revenue is growing. You've added people. You're taking on bigger clients. And somehow the bank balance doesn't reflect any of it.\n\nYou're scaling the work without scaling the profit — which means you're scaling your problems. The numbers say you should feel successful. You don't. And you can't tell whether that's a you problem or a business problem.\n\nIt's a business problem. You know how to run this thing. But the instincts that got you from $100K to $700K aren't the instincts that take you from $700K to $2M, and you've started to notice that the formula that used to work isn't working anymore.",
    rootCauses: [
     "You're not pricing based on the value you create for your customers. Your prices were set when you were smaller and hungrier. They haven't moved as your capabilities have grown. The people buying from you today would pay more. You just haven't asked.",
     "You're hiring to keep up with demand instead of hiring to multiply margin. Every new employee adds revenue and cost at roughly the same ratio. Growth isn't compounding. It's just getting bigger.",
     "You don't have per-client or per-service profitability in front of you. Some of your clients are building your business. Some of them are quietly dismantling it. Right now you can't tell them apart.",
    ],
    consequence:
     "In 12 months: you'll be a $1.2M business with $50K of profit, working twice as hard as the $500K version of you, with more employees to manage and more clients to serve.\n\nThe trap at your size is mistaking revenue growth for business growth. Most owners who don't fix margin in this range either plateau permanently or grow themselves into a cash crisis at $2M. You can't out-run a structural problem. You can only make it bigger.",
    actions: [
     {
      n: "01",
      title: "Build a per-client profitability view this month",
      body: "Pull your top 10 clients by revenue. Calculate real gross margin on each one — direct labor, subs, fair share of overhead, all of it. You'll find two or three clients are subsidizing the rest. What you do next matters less than this: for the first time, you'll be making the decision with real numbers instead of gut feel.",
     },
     {
      n: "02",
      title: "Reprice new clients 20% higher, starting today",
      body: "Most owners are afraid to raise prices because they're imagining their existing clients leaving. Don't touch existing clients. Just charge new ones more. Within 12 months, your new-client mix rebalances your whole pricing model — and you never had to have a single uncomfortable conversation.",
     },
     {
      n: "03",
      title: "Stop offering your three lowest-margin services",
      body: "You probably offer five to eight things. Two are profitable. Two are break-even. The rest are draining you. Stop offering the bottom three. The capacity you free up goes into the profitable lines. This is the move owners resist most and benefit from most, because subtraction is how you scale when adding more has stopped working.",
     },
    ],
    benchmark: {
     headline:
      "Businesses that scale from $1M to $3M with healthy margins do it by subtracting, not adding.",
     body: "They drop services. They drop client segments. They drop pricing models that no longer fit. The owners stuck below $1.5M are almost always the ones still adding offerings to chase revenue — building a business that can't run profitably at any size. Subtraction is the hardest move to make and the one that changes everything.",
    },
   },

   // ── SCALING (default) ────────────────────────────────
   growth: {
    summary:
     "Your business is generating real revenue but the margins aren't where they should be for your size. You know how to run this business — that's not the issue.\n\nThe issue is that you're too deep inside the business to see it clearly. Every decision you make is based on what the business needs from you this week, not what the business is becoming. Growth is happening, but it's not something you're designing — it's something you're guessing at, because you've never had the time or the tools to do it any other way. Somewhere between where you started and where you are now, your business stopped compounding and started just getting bigger. Those are two very different things, and until you can see the difference, you can't fix it.\n\nThe gap between what your margin is today vs where it should be for a business in your industry at your size is likely a meaningful amount of money. **And not having that annual profit to build your personal wealth and/or reinvest to fuel your business's growth will become long-term compounding that you miss out on for you and your family.**",
    rootCauses: [
     "Your prices are based on what you used to charge, plus adjustments. Not on the value you actually create for your customers today. At your size, the gap between those two numbers could be at least 15-25%. That gap drops straight to the bottom line, and you've been leaving it on the table.",
     "You're still carrying services, clients, or offerings that made sense at $1M, but are quietly costing you money at $3M. Nobody has audited them because you've been too busy running them. Some parts of your business are building your profit margins, while some parts are draining it. Right now you can't tell them apart.",
     "Your team is sized for the volume of work, not for the profit of the work. Every revenue increase gets absorbed by headcount instead of dropping to the bottom line. Growth is giving you more employees, not more freedom.",
    ],
    consequence:
     "In 12 months: your margins will still be where they are today — or worse — even as your revenue grows. The gap between what your margin is today and what it should be for a business of your size in your industry is your Profit Gap. **That Profit Gap is likely a meaningful amount of money you are leaving on the table every single year.**\n\nIt gets worse. Your enterprise value — what your business is actually worth — is a multiple of your profit, not your revenue. So every dollar of margin you're missing doesn't just cost you once — it might cost you at 3x, 4x, 5x, or more when it comes time to sell, recapitalize, or bring in a partner. That's your Value Gap.\n\nThese two gaps — the Profit Gap and the Value Gap — are the numbers that determine whether this business becomes the wealth-building asset it should be, or stays a job that happens to have employees.",
    actions: [
     {
      n: "01",
      title:
       "Run a profitability audit on your top 20 clients and every service line you offer",
      body: "Real per-client gross margin. Real per-service margin. You're looking for the 20% of clients and services that produce 80% of your profit. Most owners at your size discover that 30-40% of their revenue is making zero money or losing money. Once you see it, you can't unsee it. That's the point.",
     },
     {
      n: "02",
      title: "Reprice new clients 20% higher, starting today",
      body: "Most owners are afraid to raise prices because they're imagining their existing clients leaving. Don't touch existing clients. Just charge new ones more. Within 12 months, your new-client mix rebalances your whole pricing model — and you never had to have a single uncomfortable conversation.",
     },
     {
      n: "03",
      title: "Stop hiring doers. Start hiring multipliers.",
      body: "A doer handles more work. A multiplier changes what the business is capable of. Every new hire should have a clear answer to one question: how does this person grow margin per dollar of revenue, not just handle more volume? If the answer isn't clear, you're hiring into the trap that's holding you here.",
     },
    ],
    benchmark: {
     headline:
      "The businesses that score 75+ on profitability at your size have all made the same mental switch.",
     body: "They stopped asking \"how do we grow revenue\" and started asking \"how do we grow margin per dollar of revenue.\" They run quarterly profitability audits. They price on value delivered, not hours worked. And they walk away from revenue that doesn't pay.\n\nThe owners still stuck in volume-thinking at $3-5M rarely make it to $10M without a painful restructuring. The ones who do make it are the ones who fixed margin before they chased the next revenue milestone.",
    },
   },

   // ── OPTIMIZING ───────────────────────────────────────
   optimize: {
    summary:
     "Your business has scale, a team, and systems. What it doesn't have is the margin it should, given everything you've built.\n\nAt your size, every point of margin is worth real money. Not just in current cash flow — in enterprise value. That's the number that matters on the day you sell, recapitalize, or hand the business to someone else. The problem isn't that you don't know how to operate. You clearly do.\n\nThe problem is that nobody in your organization has been told to fight for margin, and you might not even have incentives in place for them to strive to do so. That lost margin is what is preventing you from bringing in the talent to get to $10M+ (and have an asset that runs without you).",
    rootCauses: [
     "Your pricing model hasn't been rebuilt from scratch in years. You've adjusted it. You've raised prices when costs pushed. You haven't sat down and asked what your work would be worth if you were quoting it for the first time tomorrow. The answer is almost always higher than what you're charging.",
     "You aren't running the business like an investor. You are at the size where small tweaks and pivots can create significant improvements to profitability and valuation — but failing to view decisions in the business as investment opportunities (by actually doing the math) can also lead to significant losses through missed opportunities, suppressed profits, and suppressed valuation. And those are all a negative feedback loop when it comes to attracting and retaining the A-level talent you need to get to $10M+.",
     "Your management team is optimizing for stability and revenue growth because that's what their bonuses reward. They're not being disloyal. They're doing exactly the job you're paying them to do. The reason margin isn't expanding isn't a people problem. It's a comp plan problem.",
    ],
    consequence:
     "In 12 months: you'll run the same business at higher cost, and it'll be worth substantially less than it should be. At your size, the difference between an 8% margin business and a 15% margin business is millions in enterprise value. That difference shows up the moment you talk to a buyer, a lender, or an investor, or talk with A-level talent who would take you to the next level — 'what type of opportunity do they have working here'.\n\nMost owners at your stage discover the gap only when they try to sell and the valuation comes in 30% below what they expected (or worse). At that point the work is the same, but the timeline to close the gap is the worst possible time to start.",
    actions: [
     {
      n: "01",
      title: "Start running decisions through an ROI lens — every major spend, hire, and investment.",
      body: "Pick your next three biggest decisions — a hire, a tool purchase, a service line expansion — and run the numbers before committing. What does this cost over 12 months? What margin does it protect or create? What happens if you don't do it? This isn't about being conservative. It's about being deliberate. The businesses that break through to $10M+ aren't spending less — they're spending on the right things and they can prove it. Start building the habit of treating every decision like an investor would: what's the return, what's the risk, and what's the timeline?",
     },
     {
      n: "02",
      title: "Rebuild your pricing model from scratch",
      body: "Don't adjust existing prices. Throw them out and rebuild. What value are you actually creating? What would you charge if a competitor asked you to quote this work tomorrow? The gap between that number and your current price is your margin opportunity. Most businesses your size are underpriced by 15-25% on their core offering, because the pricing evolved instead of being designed.",
     },
     {
      n: "03",
      title: "Pay your management team on gross margin, not revenue",
      body: "If your operations leaders are bonused on revenue or volume, they will optimize for revenue and volume — even when it costs you margin. Change the metric and the behavior changes in one quarter. The margin impact compounds for years after that.",
     },
    ],
    benchmark: {
     headline:
      "At your scale, profitability stops being an operational issue and becomes a valuation issue.",
     body: "The businesses scoring 80+ on profitability at $5M+ are run by owners who think like owners of their own business — not operators of it. They benchmark margin against best-in-class peers. They cut what isn't earning. They're explicit with their team that margin is the goal, not revenue.\n\nThe ones stuck below 8% margin at this size almost always have a management team optimizing for the wrong number. And an owner who never told them to optimize for a different one.",
    },
   },
   scaling: {
    summary: "Your business has crossed the $10M threshold — and the margin compression that comes with institutional scale is the constraint sitting between you and a premium exit.\n\nAt your revenue level, the difference between a 12% and an 18% EBITDA margin isn't a rounding error — it's millions in enterprise value. **The business has grown past the point where revenue growth alone moves the needle. Now it's margin quality that determines whether buyers see an asset or a project.**\n\nEvery dollar of margin you recover flows directly to the bottom line and multiplies through your valuation. Your team is big enough that operational drag compounds. Your overhead has layers that haven't been stress-tested since you added them.",
    consequence: "At $10M+ in revenue, margin compression doesn't just reduce your cash flow — it fundamentally repositions your business in the acquisition market. **The business is scaling its revenue without scaling the profitability that makes that revenue valuable.** Sophisticated buyers and PE firms don't acquire revenue. They acquire profit streams. A $12M business at 10% EBITDA is worth meaningfully less than an $8M business at 22%.",
    rootCauses: [
     "Your cost structure hasn't been re-architected for your current scale. The overhead, vendor agreements, and staffing ratios that made sense at $4M haven't been renegotiated or restructured for a $10M+ operation.",
     "Your pricing hasn't kept pace with the value you deliver. You've upgraded your capabilities, your team, and your delivery — but your pricing model still reflects the business you were three years ago.",
     "Financial visibility is too aggregated to drive margin decisions. Your P&L shows you the totals but not the drivers. You can't see margin by service line, by client segment, or by team."
    ],
    actions: [
     { n: "01", title: "Commission a margin-by-segment analysis.", body: "Break your revenue into segments — by service line, client tier, and delivery team — and calculate the true margin for each. This exercise typically reveals that 20-30% of revenue is generating minimal or negative margin." },
     { n: "02", title: "Restructure your top 3 cost categories.", body: "Identify the three largest non-payroll cost categories and renegotiate or restructure each. At $10M+ you have leverage you likely haven't exercised — vendor consolidation, volume pricing, and strategic sourcing." },
     { n: "03", title: "Implement rolling 13-week cash and margin forecasting.", body: "Move from backward-looking financials to forward-looking margin management. A rolling forecast forces your team to own the numbers and gives you the visibility to catch margin erosion before it compounds." }
    ],
    benchmark: {
     headline: "Businesses at your revenue level that maintain top-quartile margins share one trait: they measure margin at the engagement level, not just the entity level.",
     body: "Again, growth without infrastructure scales your problems, not your profits. The top-quartile margin performers at $10M+ aren't just bigger — they're structurally more profitable because they've built margin discipline into their operating rhythm."
    },
   },
  },
 },

 // ============================================================
 // CASH FLOW (green)
 // ============================================================
 cash_flow: {
  name: "Cash Flow Fragility",
  color: COLORS.green,
  byTier: {
   // ── SURVIVAL ─────────────────────────────────────────
   survival: {
    summary:
     "You're worried about making payroll next month. Maybe not every month, but enough months that it's living in the back of your head all the time. The work is there. You're invoicing. And somehow the timing never lines up — money goes out before money comes in, and you spend half your week moving cash around to keep the lights on.\n\nThis isn't a profitability problem. You can be profitable and still not make payroll, because profit and cash are not the same thing, and at your size the gap between them can sink the business in a single bad month.\n\nThe good news: this is fixable, and faster than the other things on your list. The bad news: if you don't fix it now, the business doesn't get to the next stage. Cash constraints at your size aren't merely a cap on growth — they're a threat to survival.",
    rootCauses: [
     "Your customers are paying you slower than you're paying your costs. The math is simple — payroll, rent, and suppliers go out on a schedule. Your invoices come in whenever the customer feels like it. That gap is the entire problem, and right now you're financing it personally, on credit cards, or out of the line of credit that's getting closer to its limit every month.",
     "You don't have a cash buffer because every dollar that comes in is already spoken for. There's no separation between income and survival. The moment a payment hits, it's already going somewhere. One slow week and you're underwater.",
     "You're underpriced and absorbing costs you should be passing through. At your size, every margin point is the difference between making payroll and not. You haven't raised prices because you're afraid of losing customers, and the customers you're afraid of losing are the ones whose pricing is keeping you broke.",
    ],
    consequence:
     "In 6 months: you'll still be doing this dance. In 12 months: you'll either have raised prices and tightened collections, or you'll be having the conversation with yourself about whether to keep going. Survival-tier cash problems don't stay the same — they get worse, because every slow month uses up more of the buffer you don't have.\n\nThe owners who close their businesses at this stage rarely close because the work dried up. They close because they ran out of cash on a month when the work was there.",
    actions: [
     {
      n: "01",
      title: "Get paid up-front or get paid faster. Today.",
      body: "Move to deposits on every new job — 50% to start, balance on completion. For existing clients, move terms to net 7 or net 10. Send invoices the day the work is delivered, not at month-end. The customers who can't accommodate this are not your customers — they're a subsidy you're paying for, and you can't afford the subsidy. Most survival-stage businesses pull 30+ days out of DSO in the first 60 days just by asking.",
     },
     {
      n: "02",
      title: "Build a one-page cash plan for the next 8 weeks.",
      body: "What's coming in, what's going out, week by week, in the next 8 weeks. Update it every Monday morning before you do anything else. This single sheet is the difference between knowing you're going to be short in week 5 — when you can still do something about it — and finding out in week 5, when you can't. It takes an hour to set up. It will save the business.",
     },
     {
      n: "03",
      title: "Raise your prices on the next job you quote.",
      body: "Not 5%. Not 10%. Try 20%. The customer who balks was not going to be a profitable customer. The customer who says yes funds your next month. At your size, you don't have time for incremental price testing — you need margin, and you need it on the next invoice. Most survival-stage owners are 15-25% underpriced and have been for years. The fear of raising prices has cost them more than any customer they would have lost.",
     },
    ],
    benchmark: {
     headline:
      "The businesses that escape survival-stage cash problems all do the same thing first.",
     body: "They stop running on hope. They build the 8-week view. They get paid faster, charge more, and stop pretending the next big customer will fix everything. The ones who do this clear the constraint within two quarters. The ones who don't are usually closed within two years — not because the work disappeared, but because they ran out of runway during a slow month they should have seen coming.\n\nThe businesses that make it from under $500K to over $1M almost always make it because the owner finally took cash seriously. Not a single one made it on optimism.",
    },
   },

   // ── STABILIZING ──────────────────────────────────────
   stabilize: {
    summary:
     "You want to make the next hire, but you can't tell if you can afford it. The business is growing. The work is there. You know who you'd hire and you know what they'd do. You just can't pull the trigger because you can't see clearly enough into next quarter to know whether the salary will be there.\n\nYou're not broke. You're just operating in a fog about your own cash. Some months feel fine. Some months you're moving money around to make payroll work. You can't tell whether the bad months are a pattern or a coincidence, because nothing in your setup gives you a forward view — you're always reacting to what happened, never planning around what's coming.\n\nThe hire isn't the problem. The hire is the thing the cash problem is preventing. And until you can see your cash clearly, you're going to keep deferring the moves that would actually grow the business.",
    rootCauses: [
     "You're running the business off the bank balance instead of off a forecast. The bank balance tells you what happened. It doesn't tell you what's coming. Every decision you're trying to make — hire, don't hire; spend, don't spend — is a future decision being made with backward-looking information.",
     "Your collections are inconsistent because you don't have a process. Some clients pay on time. Some pay 60+ days late. You chase when you remember to. The variance in your incoming cash isn't because your business is volatile — it's because nobody owns the function of collecting the money.",
     "You're paying yourself unpredictably, which makes the business's cash position impossible to read. When the owner draw moves up and down based on what's in the account, the business's actual cash health is hidden underneath. You can't tell if the business is generating enough cash to fund a hire because you're not generating enough information to know.",
    ],
    consequence:
     "In 12 months: you'll still want to make the hire. You'll still be telling yourself it's almost time. The business will probably grow some, but slower than it should, because you'll keep choosing the safer move every time the cash gets tight. The hire that would have multiplied your capacity sits as a job description in a Google Doc you haven't opened in three months.\n\nThe cost isn't the missed hire. The cost is the year you spent running a business you couldn't see clearly enough to grow.",
    actions: [
     {
      n: "01",
      title: "Build a 13-week cash forecast and update it every Friday.",
      body: "Not a budget. A forecast — what's actually coming in and going out, week by week, for the next 13 weeks. This single habit is the difference between operating in fog and operating with sight. If you know how to do it, it takes 90 minutes to build and 20 minutes a week to maintain. You'll know within the first month whether you can fund the hire, because you'll be able to see the cash position the hire would create twelve weeks from today.",
     },
     {
      n: "02",
      title: "Put one person — you, for now — in charge of getting paid.",
      body: "Send invoices same-day. Move terms to net 15. Set a collection sequence: friendly nudge at day 14, direct ask at day 21, phone call at day 30. The reason your collections are inconsistent is because you don't have a system in place, let alone this automated for you. Own it for 90 days, then hand it off to your bookkeeper or a part-time admin once the system is running.",
     },
     {
      n: "03",
      title: "Pay yourself a fixed salary. Stop the variable draws.",
      body: "Set an owner's salary that the business can demonstrably support, run it through payroll, and stop touching the account otherwise. The business's true cash health only becomes visible once your draw stops fluctuating. Most stabilizing-stage owners discover, within two months of doing this, that the business is healthier than they thought — or that it isn't, and they've been hiding the truth from themselves with inconsistent draws.",
     },
    ],
    benchmark: {
     headline:
      "The businesses that scale cleanly from $500K to $2M all share the same cash discipline.",
     body: "They forecast forward, not backward. They've made collections a process, not a personality trait. They pay the owner like an employee so the business's actual numbers become legible. None of this is sophisticated. All of it requires the owner to do something uncomfortable — look at the numbers honestly and stop running on instinct.\n\nThe owners who stay stuck at $700K-$1M for five years are almost always the ones who refused to build this layer. The ones who break through built it before they had to.",
    },
   },

   // ── SCALING (default) ────────────────────────────────
   growth: {
    summary:
     "Your business is profitable on paper, but you can't fund the things you know it needs for growth, both short-term and long-term. The growth move you've been thinking about — the hire, the equipment, the second location, the marketing investment — sits there waiting because the cash isn't there yet to make it.\n\nYou're not in trouble. You're not making payroll out of a line of credit. But you're running the business in a permanent state of \"next month will be better,\" and next month is always the month you're going to fix it.\n\nThe issue isn't that you're not making money. You are. The issue is that your cash position is structural, not seasonal — it's been roughly the same for two years, regardless of what revenue does. Which means the business is generating cash and something in the operation is consuming it before you can reinvest it for growth. You haven't found what.",
    rootCauses: [
     "Your receivables are funding your customers' businesses instead of yours. At your size, every additional day of DSO is real money sitting in someone else's bank account. You've let collection terms drift because chasing money feels uncomfortable, and the cost of that comfort is the growth investment you can't make.",
     "You're carrying inventory, work-in-process, or capacity you don't need. Cash is locked up in things — finished goods, half-finished projects, equipment running below utilization, a team sized for a revenue level you're still trying to reach. None of it shows up as a problem on the income statement. All of it shows up as cash you don't have.",
     "You're financing growth out of operating cash instead of out of structured capital. Every reinvestment comes out of the same checking account that pays the bills. There's no separation between the cash that runs the business and the cash that grows the business, so growth always loses.",
    ],
    consequence:
     "In 12 months: you'll be the same size. Maybe slightly bigger. The business will still be profitable. You'll still be telling yourself you're going to make the move next quarter. The opportunity cost won't show up on a statement — it'll show up as the competitor who made the move you didn't, the hire who went somewhere else, the market position you let slip because you couldn't fund the play.\n\nThe thing about cash constraints at your size is that they don't break the business. They just quietly cap it. Most owners don't realize they've been capped until they look back five years later and see they ran the same business the whole time.",
    actions: [
     {
      n: "01",
      title: "Get your cash conversion cycle on one page.",
      body: "Before you fix anything, you need to see where cash actually goes and how long it stays there. Pull DSO, DPO, days inventory, and operating cash flow for the last twelve months. Put them on one page. Most growth-stage owners have never looked at this view and are shocked by what they find — usually that one number has been quietly drifting in the wrong direction for two years. If no one on your team knows what these mean then you need help getting this installed into your business.",
     },
     {
      n: "02",
      title: "Tighten collections without apologizing for it.",
      body: "Move standard terms to net 15. Send invoices the day work is delivered, not at month-end. Put a collections call on the calendar at day 21, not day 45. The customers who push back were probably the ones eroding your cash position anyway. The ones who don't push back will pay faster, and you'll wonder why you waited this long. Most scaling businesses can pull 10-20 days out of DSO in a single quarter just by enforcing what's already in the contract.",
     },
     {
      n: "03",
      title: "Separate operating cash from growth cash.",
      body: "Open a second account. Every month, sweep a fixed percentage of operating cash flow into it. That account funds growth investments — and only growth investments. The operating account runs the business. The growth account makes the moves. The reason most scaling businesses can't fund growth isn't that they don't generate the cash. It's that the cash never gets separated from the daily noise long enough to be deployed deliberately.",
     },
    ],
    benchmark: {
     headline:
      "The businesses that break through cash constraints at your stage all do one thing first.",
     body: "They stop treating cash as a residual — the thing left over after everything else gets paid — and start treating it as a planned outcome. They forecast cash 13 weeks out. They know their conversion cycle to the day. They run the business so that growth investments are funded from designed cash flow, not from whatever happens to be in the account on the first of the month.\n\nThe owners still cash-constrained at $3-5M five years from now are the ones who never built that discipline. The ones who break through to $10M built it before they needed to.",
    },
   },

   // ── OPTIMIZING ───────────────────────────────────────
   optimize: {
    summary:
     "Your business generates significant cash, but you're not redeploying it fast enough to capture the growth the business is capable of. Profits are being reinvested blindly instead of being put to work efficiently — and every month that cash isn't allocated efficiently to growth, debt optimization, or talent acquisition is a month of compounding you don't get back.\n\nAt your size, cash flow isn't a survival question. It's a growth acceleration question. The difference between a $5M business that stays at $5M and one that breaks through to $10M+ is almost never about generating more revenue — it's about how aggressively and intelligently you redeploy the profits you already have. Right now, you're running capital allocation on gut and guesses rather than like an investment with ROI targets and thresholds.\n\nThe businesses at your scale that attract A-level talent, make strategic acquisitions, and compound year-over-year have one thing in common: they know exactly where every dollar of profit is going, and they have a framework for deciding where the next dollar should go.",
    rootCauses: [
     "Your cash is sitting in the operating account earning effectively nothing. At current rates, every $1M of idle operating cash is leaving roughly $40-50K a year on the table — money that should be in a treasury management structure, working for the business. The bank is happy to hold it. You're paying for the convenience.",
     "Your debt structure was built for an earlier version of the business and hasn't been refinanced in light of your current scale and cash position. You're paying rates and on terms that reflect what you looked like three to five years ago. At your current scale, every basis point matters and nobody's actively managing it.",
     "Your reinvestment decisions are made transactionally instead of through a capital allocation framework. When a growth opportunity comes up, you decide on the merits of that opportunity in isolation. There's no framework that says \"this dollar of cash, deployed here, returns X — and that's our hurdle.\" Capital gets allocated by who asks for it, not by where it earns the most.",
    ],
    consequence:
     "In 12 months: you'll have run the same business making the same capital allocation decisions on gut and guesses, and the growth you could have captured will have gone to a competitor who deployed their cash faster and smarter. At your scale, the businesses that pull ahead aren't the ones generating more revenue — they're the ones redeploying profits into the right growth opportunities before the window closes.\n\nThe real cost isn't just missed returns on idle cash. It's the A-level talent you couldn't attract because you couldn't fund the role. It's the acquisition you couldn't make because you didn't have a capital framework to evaluate it. It's the compounding growth that your competitors are capturing while your cash sits in an operating account doing nothing.",
    actions: [
     {
      n: "01",
      title:
       "Stand up an actual treasury function — even if it's just one person, one day a week.",
      body: "Idle cash goes into a managed structure: treasury management account, sweep into short-term instruments, laddered if appropriate. The objective isn't yield maximization — it's stopping the bleed. One person, owning this function, with a quarterly report to you on cash position, yield, and liquidity. The cost of hiring or carving out this function is recovered in months at your scale.",
     },
     {
      n: "02",
      title: "Refinance everything against your current balance sheet.",
      body: "Pull every credit facility, term loan, equipment lease, and line of credit. Take them to market against your current numbers, not the numbers from when you last refinanced. At your scale, basis points matter — 50bps off your blended cost of capital is real money annually.",
     },
     {
      n: "03",
      title: "Build a capital allocation framework with a hurdle rate.",
      body: "Every dollar of available cash has options: debt paydown, reinvestment, distributions, reserves, acquisitions. Set a hurdle rate. Score each opportunity against it. Deploy capital where it earns above the hurdle, return it where it doesn't. The framework matters more than the answer — it's the discipline that compounds, not any individual decision. Most $5M+ businesses make capital allocation decisions emotionally because they've never built the framework. The ones that build it outperform on enterprise value within 24 months.",
     },
    ],
    benchmark: {
     headline:
      "The businesses that command premium multiples at your size all manage cash like a financial institution, not like an operating company.",
     body: "They have a treasury function. They refinance opportunistically, not when they have to. They allocate capital against an explicit framework with an explicit hurdle. None of this is glamorous. All of it shows up in the multiple when the day comes to monetize what you've built.\n\nThe owners who get marked down at exit are almost never the ones who failed to grow. They're the ones who grew well and managed the balance sheet poorly. By the time the buyer is across the table, the gap is fixed. The work is in the years before that conversation, and the owners who do it walk away with materially more for the same business.",
    },
   },
   scaling: {
    summary: "Your business generates substantial revenue — but the cash doesn't move the way it should for a company your size.\n\nAt $10M+ the cash flow challenge isn't survival — it's optimization. **You're funding growth, servicing obligations, and managing working capital across a complex operation, and the timing mismatches are suppressing the cash available for strategic investment.**\n\nThe irony is that your revenue makes you look healthy from the outside while the cash cycle creates internal constraints that limit your ability to invest in the things that would make the business more valuable.",
    consequence: "At this scale, cash flow constraints don't threaten the business — they throttle it. **The business generates enough revenue to fund growth but the cash conversion cycle is too slow to capture the opportunities in front of you.** Every delayed collection, every front-loaded project cost, and every inventory commitment that sits longer than it should is capital that could be compounding in your enterprise value instead.",
    rootCauses: [
     "Your working capital cycle hasn't been optimized for your volume. Your receivables, payables, and inventory timing were set up for a smaller business. At $10M+ the float on even a few days of improvement represents significant freed capital.",
     "Revenue recognition and cash collection are misaligned. You're booking revenue on delivery but collecting on net-60 or net-90 terms. The gap creates a permanent working capital drain that scales with your growth.",
     "Capital allocation lacks a formal prioritization framework. Investment decisions are made opportunistically rather than through a structured ROI framework. Without clear rules, cash flows to urgency rather than to the highest-return opportunities."
    ],
    actions: [
     { n: "01", title: "Map your complete cash conversion cycle.", body: "Document every step from client commitment to cash receipt, including all inventory, WIP, and accounts receivable aging. Identify the three largest timing gaps and build a 90-day plan to compress each by at least 15%." },
     { n: "02", title: "Restructure your top 10 client payment terms.", body: "Your largest clients set the cash flow tone for the entire business. Renegotiate terms, introduce milestone billing, or offer early-payment incentives. Even moving from net-60 to net-30 on your top 10 accounts can transform your cash position." },
     { n: "03", title: "Implement a monthly capital allocation review.", body: "Create a formal process where every investment above a threshold is evaluated against a standard ROI framework. This prevents capital from being allocated by emotion or urgency." }
    ],
    benchmark: {
     headline: "The strongest businesses at your revenue level convert profit to free cash flow at 80%+ — meaning nearly every dollar of EBITDA is actually available to deploy.",
     body: "Again, growth without infrastructure scales your problems, not your profits. The top-quartile cash performers at $10M+ have one thing in common: they treat cash conversion as a KPI, not an afterthought."
    },
   },
  },
 },

 // ============================================================
 // OWNER DEPENDENCY (amber)
 // ============================================================
 owner_dependency: {
  name: "Owner Dependency",
  color: COLORS.amber,
  byTier: {
   // ── SURVIVAL ─────────────────────────────────────────
   survival: {
    summary:
     "You can't take a vacation. You are the business. If you stop, it stops. There's no team yet, or barely a team — a part-timer, a contractor, your spouse helping with the books. Every client interaction, every quote, every job, every problem comes through you because there's nobody else for it to come through.\n\nThis isn't a delegation problem. You don't have anyone to delegate to. The dependency at your stage is the simplest version of this constraint and the hardest to escape — the business is owner-dependent because the business is just you doing the work with a few extra hands.\n\nYou're not failing at building a team. You haven't built one yet because you can't afford to, and you can't afford to because the business doesn't generate enough margin to fund the kind of help that would actually create leverage. So you keep doing all of it, and the business stays the size of one person's bandwidth, which is exactly what it is.",
    rootCauses: [
     "You're the only one who knows how to do the work that makes money. The thing the customer pays for — you do that. Whether it's the install, the consultation, the project, the actual service — your hands are on the deliverable. There's no version of the business that produces revenue without you in the production seat, which means every hour you take off is an hour the business doesn't generate.",
     "You haven't priced for the cost of replacing yourself. Your prices were set when you were a one-person operation, and they reflect a world where your time isn't a real cost line. The moment you try to hire someone to do part of the work, the math doesn't work — because you priced like a freelancer, not like a business that has to pay other people.",
     "You're spending the highest-leverage hours of your week on the lowest-leverage work. The admin, the follow-ups, the scheduling, the invoicing — all of it lands on you because there's nobody else. The hours that should go to selling, refining the offer, or learning to do the work faster are instead consumed by tasks that any $20-an-hour part-timer could do.",
    ],
    consequence:
     "In 12 months: you'll be in the same place. Maybe you'll have raised prices a little. Maybe you'll have a slightly steadier client list. But the structural shape of the business — you, doing all the work, unable to step away — will be identical. And every year that passes makes the dependency harder to break, because your customers, your processes, and your habits all get more thoroughly built around the assumption that you're the one doing it.\n\nThe risk at your stage isn't that the business fails financially. It's that the business succeeds at exactly the size that requires you in every seat, and you spend the next decade running a job you can't sell, can't scale, and can't take a week off from. Most survival-stage businesses that never grow don't die. They become a cage the owner built without realizing they were building it.",
    actions: [
     {
      n: "01",
      title: "Get one piece of admin off your desk this week.",
      body: "Hire a virtual assistant for five hours a week. Or pay your most reliable contact $20 an hour to handle scheduling, follow-ups, and invoice sending. Pick the single most repeatable task that doesn't require your judgment and get it off your plate immediately. The cost is small. The hours back are real. And you'll prove to yourself that the business doesn't actually require you to do every single thing — which is the belief that's keeping you stuck.",
     },
     {
      n: "02",
      title: "Raise prices enough to fund the help you need.",
      body: "Calculate what an extra 10 hours a week of help would cost you per month. Divide that by the number of jobs you do in a month. That's how much each job needs to go up by to fund the leverage. Then add 20% on top — for margin, not for help. The customer who pushes back on the new price was never going to fund the version of your business that doesn't require you to work seven days a week. The customer who says yes is the one who lets you build something bigger than yourself.",
     },
     {
      n: "03",
      title: "Pick the one task you do that someone else could do for half your rate.",
      body: "Be honest. There's at least one piece of the work itself — not just admin, but actual production — that doesn't require your specific skill. Find it. Find a contractor or part-timer who can do it for less than what you'd charge for that hour. Hand it off, watch it for two weeks, and accept that they'll do it 80% as well as you would. Most survival-stage owners refuse to do this because the 20% gap feels intolerable. The owners who break through accept the gap and use the hours back to grow the business.",
     },
    ],
    benchmark: {
     headline:
      "The businesses that escape the survival stage all do the same thing first. They stop confusing being indispensable with being successful.",
     body: "They get the admin off their desk. They raise prices enough to fund real help. They hand off at least one piece of production work even when nobody else can do it as well. None of this feels safe at the time. All of it is the precondition for ever having a business that's worth more than the owner's calendar.\n\nThe owners who close up at $200-400K rarely close because the work disappeared. They close because they never built a version of the business that could exist without them, and one day they got tired enough to stop showing up. The ones who make it to $1M built the first layer of independence before they technically could afford to.",
    },
   },

   // ── STABILIZING ──────────────────────────────────────
   stabilize: {
    summary:
     "You made your first hires and you're becoming the bottleneck you just hired to escape. The team is small — two, three, maybe five people — and every one of them has to come to you for almost everything. The hires were supposed to give you time back. Instead, your day is now full of training, answering questions, fixing what didn't get done right, and doing the work yourself when you ran out of time to explain it.\n\nThe problem is you're trying to delegate work that was never written down, in a business where the standards for \"good\" only exist in your head. So your team can't do it the way you'd do it, because the way you'd do it has never been documented and demonstrated to anyone, including yourself.\n\nThe dependency at your stage is the most exhausting version of this constraint. You're paying for help and you're still doing the work. The team is too new to run anything independently, and you haven't built the structure yet that would let them. You're stuck in the middle — too big to do everything yourself, too undocumented to let go.",
    rootCauses: [
     "You're training in real time instead of teaching from a system. Every question gets answered the moment it comes up, in whatever words occur to you that day. The team learns inconsistently because you're explaining inconsistently. There's no manual, no standard, no place to point them when they ask the same question for the third time. So you answer it for the third time, and the cycle never breaks.",
     "You hired for help and not for a defined role. The job descriptions, if they exist at all, are some version of \"help me with everything.\" So the team helps with everything — which means they own nothing, and every piece of work eventually comes back to your desk because nobody else's name is on it.",
     "You're still doing the work you should be teaching. When something needs to get done and the team can't do it the way you want, you do it yourself. It's faster. It's cleaner. And every time you do it, you reinforce the pattern that the work will end up at your desk eventually, so why should they push to figure it out.",
    ],
    consequence:
     "You hired employees thinking it would make the business less dependent on you. Instead, it sucked you in deeper. Every person you added needs to be told what to do, how to do it, and when it's done right — because none of that was ever written down. The business is now more dependent on you than it was before you started hiring, and it's costing more to run.\n\nThe danger at your stage isn't that the business shrinks. It's that you exhaust yourself managing a team that can't operate without you, and you stop believing the next stage is possible. Most owners at this level who never break through don't fail because the market wasn't there. They burn out training a team they never figured out how to actually use.",
    actions: [
     {
      n: "01",
      title: "Document and demonstrate how to do the most repeated question.",
      body: "The thing your team asks you about most often this week — that's the first thing to document. Write down the answer once (and ideally record with video), somewhere they can find it, with enough detail that they can act on it without asking again, and have them do it live in front of you so you can correct anything in real time. Tell them: this is where the answer lives now, check here first. Most stabilizing owners save 4-6 hours a week within a month of doing this on their top three repeated questions.",
     },
     {
      n: "02",
      title: "Give one person ownership of one thing — fully.",
      body: "Not a task. A function. Scheduling. Invoicing. Client follow-up. Pick the function that consumes the most of your time and isn't the highest-leverage use of it. Hand it to one person. Tell them: this is yours now. You're not checking it. You're not approving it. They run it, they fix it when it breaks, they decide how it works. You'll feel out of control for two weeks. By week six, you'll have your first real piece of the business operating without you.",
     },
     {
      n: "03",
      title: "Stop doing the work yourself when the team can't do it right.",
      body: "The next time something is going badly and you're tempted to grab back control and finish it — don't. Sit with the team member, watch them do it, correct as they go. The job will take three times longer this week. Next week it'll take twice as long. The week after, they'll do it without you. Most stabilizing owners short-circuit this learning loop a hundred times a year because each individual instance feels too important to slow down for. The cumulative cost is the team that never develops.",
     },
    ],
    benchmark: {
     headline:
      "The businesses that break out of the $500K–$1.5M plateau all share the same shift in how the owner spends their time. They stop being the person who does the work and become the person who builds the system that does the work.",
     body: "They write down the answers. They give people ownership of functions, not piles of tasks. They tolerate the friction of letting the team learn by doing instead of by watching. None of this requires more talent than what you've already hired. It requires the owner to stop being the fastest, smartest, most reliable person in the room — at least visibly — long enough for someone else to develop into it.\n\nThe owners who stay stuck at $800K–$1M for five years are almost always the ones who never made that shift. The ones who break through to $2M built the teaching layer that lets the team grow into the work the owner used to do alone.",
    },
   },

   // ── SCALING (default) ────────────────────────────────
   growth: {
    summary:
     "You've built a team, but the business still routes through you. Decisions wait for you. Clients ask for you by name. The team is good — you hired carefully — and they still bring everything to your desk because that's how the business has always worked.\n\nYou're not micromanaging. You're not refusing to delegate. The problem is more structural than that. The business was built around you when it was small, and the operating system never got rewritten as it grew. So now you have a real team running a business whose central nervous system is still your inbox.\n\nThe cap this creates is invisible until you try to grow past it. Every new hire, every new client, every new line of service adds more weight to the same bottleneck — you. The business can't get materially bigger than the bandwidth of one person, and right now that one person is you.",
    rootCauses: [
     "The decisions that should be made at your team's level are still being made at yours. Pricing exceptions, client escalations, vendor approvals, hiring calls — all of it routes up. Not because your team can't handle it, but because nobody ever defined what they're authorized to decide without asking. So they ask, every time, and your day fills up with decisions that shouldn't have needed you.",
     "You haven't documented how the business actually works. The pricing logic is in your head. The client relationships live in your phone. The reason you do certain things certain ways is institutional knowledge nobody else has access to. The team executes tasks but doesn't run systems, because the systems were never written down — they were just things you did.",
     "You hired for execution and not for ownership. The roles you've built are designed to take work off your plate, not to own outcomes independently. So work gets done, but accountability for results still sits with you. Every metric, every problem, every initiative ultimately has your name on it, even when someone else is doing the work.",
    ],
    consequence:
     "In 12 months: if you don't solve this, one of two things happens. Either the business stays the same size because it can't grow past your personal capacity, or you push through to grow revenue anyway — but the business becomes riskier and more fragile than it was before. A $2M business that depends entirely on the owner could actually be worth less than a well-run $1.5M business that doesn't.\n\nThe worst outcome isn't that you stay stuck. It's that you grow the revenue without fixing its dependency on you, and then realize you need to go backwards to have a shot at getting past $3M — because the way you built it to this point can't scale past being dependent on you as the owner. Every dollar of growth built on owner dependency is a dollar that makes the business harder to sell, harder to run, and harder to enjoy.",
    actions: [
     {
      n: "01",
      title: "Define what your team is authorized to decide without you.",
      body: "Pick the three categories of decisions that interrupt your day most often — pricing exceptions, client issues, vendor spend, whatever yours are. For each one, write down the dollar threshold or scope below which the team decides without asking. Above the threshold, they bring it to you with a recommendation, not a question. This document takes a Saturday to write and changes the operating shape of the business inside a month.",
     },
     {
      n: "02",
      title: "Pick one part of the business and write down how it works.",
      body: "Not all of it. One part. The piece that breaks most often when you're not there — onboarding, fulfillment, billing, whichever one you keep getting pulled into. Write down the steps, the decision points, the standards for what \"done well\" looks like. Hand it to the person who owns that function and tell them they own it now, including the right to change the document. Most growth-stage owners have never written down a single business process and are stunned by what shifts when they do.",
     },
     {
      n: "03",
      title: "Move from delegating tasks to delegating outcomes.",
      body: "For one role on your team, stop assigning the work and start assigning the result. \"Own client retention for the top 20 accounts.\" \"Own gross margin on the install line.\" \"Own collections on receivables over 30 days.\" Define the outcome, define how it gets measured, and stop being the person who does the work to produce it. The first two months will be uncomfortable. By month four, you'll have your first real operator instead of your first real assistant.",
     },
    ],
    benchmark: {
     headline:
      "The businesses that break through the owner-dependency cap at your stage all do the same three things first.",
     body: "They define decision rights in writing. They document at least one core process per quarter and hand it to a real owner. They build roles around outcomes instead of tasks. None of this is glamorous. All of it requires the owner to do something most owners resist — accept that the team will make decisions differently than you would, and let some of those decisions stand even when you'd have made a different call.\n\nThe owners still doing $2-3M in revenue five years from now are almost always the ones who couldn't do that. The ones who get to $10M built the operating layer that lets the business run without them being the answer to every question.",
    },
   },

   // ── OPTIMIZING ───────────────────────────────────────
   optimize: {
    summary:
     "Your business has scale and a real team, but the dependency on you is setting the ceiling on how far it can go. From the outside, it looks like an enterprise. From the inside, you know that key client relationships sit with you personally, that strategic decisions still route through your judgment, and that you don't have department leads who can truly own their functions without you.\n\nAt your stage, the work isn't building a team — you have one. The work is developing the leaders within that team who can run core departments: sales, operations, delivery, finance. Not managers who execute your instructions, but leaders who make decisions, develop their own people, and are accountable for outcomes you can measure. This is the leadership development pipeline that separates businesses that plateau at $5-7M from businesses that break through to $10M+.\n\nThe owner-dependent business at your scale doesn't fail — it caps. It caps your growth, it caps your valuation, and it caps your ability to step back without the business feeling it. **Building department leads who own their functions is the single highest-leverage move you can make right now — for growth, for valuation, and for your own freedom.**",
    rootCauses: [
     "The largest client relationships are owned by you, not by your organization. The top accounts call you, not a department lead or account manager. They were sold by you, they're serviced under your relationship, and the revenue retention case for those accounts is \"the founder takes care of us.\" A buyer reads that as concentration risk plus key-person risk on the same line. Both get priced in.",
     "The institutional knowledge that runs the business has never been externalized. Pricing logic, vendor relationships, the reasoning behind why certain deals get done and others don't — it lives in your head. Your team executes against your decisions, but the framework producing the decisions is opaque to everyone but you. A management team that can't explain how the business decides things is a management team that doesn't really run the business.",
     "You haven't developed department leads who can own core functions of the business. You have managers who execute your instructions, but you don't have leaders who run sales, operations, delivery, or finance as their own domain. Nobody on your team is developing the people below them, making strategic decisions within their function, or being held accountable for department-level results. Your leadership development pipeline is empty — and until it's built, every growth initiative, every new hire, and every client expansion routes back to you.",
    ],
    consequence:
     "In 12 months: the business will continue to perform — because you're still in it. But every decision, every key client relationship, and every strategic call will still route through you. And the department leads you need to scale past where you are won't exist, because you haven't built the leadership development pipeline to create them.\n\nThis matters whether you want to scale or eventually exit. If you want to grow, you can't get to $10M+ while you're personally running every core function. You need people who can own sales, operations, delivery, and finance — not as task-completers who report to you, but as leaders who make decisions, manage their teams, and are accountable for results. If you want to sell, every dependency a buyer discovers in diligence gets priced as a discount to what the business would otherwise be worth.\n\nThe cost of staying owner-dependent at your scale isn't that the business fails. It's that it can't become the asset it should be — whether that means an asset that scales, an asset that sells at a premium, or an asset that runs without you while you focus on what's next.",
    actions: [
     {
      n: "01",
      title: "Build a relationship transfer plan for your top 15 client relationships.",
      body: "For each of your top 15 client relationships, document: who owns the relationship today, who on your team could own it next, and what needs to happen to make that transition smoothly. You don't need to execute all 15 transfers this quarter — you need the plan. Identify which people or roles on your team will receive each relationship, whether those people already exist or need to be hired, and what the timeline looks like. The goal is institutional relationships that survive any single person's departure — including yours.",
     },
     {
      n: "02",
      title: "Externalize the decision frameworks, not just the decisions.",
      body: "Spend a half-day a quarter writing down the logic behind the calls you make — how you price unusual deals, how you decide which markets to enter, how you evaluate hires above a certain level, how you decide when to invest and when to hold. Not the answers. The framework that produces the answers. Hand it to your department leads and tell them this is how decisions get made in the business now, including when you're not in the room. Whether you're scaling to $10M+ or positioning for an eventual exit, the question is the same: can the business make good decisions without you in the room? The answer needs to be a framework your department leads can execute — not 'we ask the founder.'",
     },
     {
      n: "03",
      title: "Hire or promote department leads who own core functions of the business.",
      body: "Identify the 3-4 core functions of your business — typically marketing, sales, delivery, and finance. For each one, either promote someone internally who has the potential to lead that department, or begin recruiting externally. These aren't coordinators or senior individual contributors. They're people who will be responsible for driving success in that department, develop the team members below them, make decisions within their function, and report to you on outcomes — not tasks. At your stage, this is the highest-leverage investment you can make: every department lead you develop is a function of the business that no longer depends on you.",
     },
    ],
    benchmark: {
     headline:
      "The businesses that command premium multiples at your scale all share the same structural property: they are organizations that produce outcomes, not founders who produce outcomes with help.",
     body: "They've moved their key relationships to named institutional owners. They've externalized their decision frameworks so the leadership team can run the business consistent with how the founder would. They have a number-two who actually runs the operating business. None of this is what got the business to $5M. All of it is what gets the business to a 9x or 10x exit instead of a 6x or 7x one.\n\nThe owners who get marked down at exit are almost never the ones whose businesses didn't perform. They're the ones whose businesses performed because of them, in ways the diligence process surfaces and the offer reflects. By the time you're in the room with a buyer, the gap is fixed. The work is in the years before that conversation, and the owners who do it walk away with materially more for the same business they would have sold anyway.",
    },
   },
   scaling: {
    summary: "Your business has the revenue and the team to operate without you — but it doesn't. Not really.\n\nAt $10M+ the owner dependency problem takes a different form. **You're not doing the work anymore — you're making the decisions, holding the relationships, and carrying the institutional knowledge that your team can't access without you in the room.** The business has layers of management, but the critical decisions still route through you. That's not a team problem — it's a structural problem that shows up as a valuation discount the day a buyer does their diligence.",
    consequence: "At your scale, owner dependency isn't about whether you can take a vacation. It's about whether a buyer would pay full price. **A $10M+ business that depends on the owner for key client relationships, strategic decisions, or institutional knowledge will be discounted by 30-50% in any serious acquisition conversation.** PE firms and strategic buyers price this risk explicitly.",
    rootCauses: [
     "Key client relationships are personal, not institutional. Your top clients chose you — not the company. The relationships live in your phone, your email, and your history. Your team services the accounts, but the trust still flows through you.",
     "Strategic decision-making has no documented framework. Your team makes operational decisions daily, but the strategic ones — pricing, partnerships, market entry, senior hiring — still require your input because there's no framework guiding those decisions in your absence.",
     "Institutional knowledge is concentrated, not distributed. You carry context about why things are the way they are. None of it is documented, and your team makes worse decisions when you're not available because they don't have that context."
    ],
    actions: [
     { n: "01", title: "Transition your top 5 client relationships to your team.", body: "For each of your five most valuable client relationships, introduce a senior team member as the primary strategic contact. Attend the first two meetings together, then step back." },
     { n: "02", title: "Build a strategic decision-making playbook.", body: "Document the 10-15 most common strategic decisions your team asks you about. For each one, write the criteria, the tradeoffs, and the decision framework. Your team doesn't need your judgment — they need the framework it's built on." },
     { n: "03", title: "Schedule yourself out of operations for one week per quarter.", body: "Block a full week where you are completely unreachable. Not working remotely — unreachable. The gaps that surface during that week are the exact gaps that a buyer would find during diligence." }
    ],
    benchmark: {
     headline: "The businesses that command premium multiples at your scale all pass one test: the owner can disappear for 90 days and the business doesn't skip a beat.",
     body: "Again, growth without infrastructure scales your problems, not your profits. The top-quartile businesses at $10M+ have owner-optional operations — not because the owner is uninvolved, but because the systems and frameworks operate independently."
    },
   },
  },
 },

 // ============================================================
 // REVENUE QUALITY (gold)
 // ============================================================
 revenue_quality: {
  name: "Revenue Quality",
  color: COLORS.gold,
  byTier: {
   // ── SURVIVAL ─────────────────────────────────────────
   survival: {
    summary:
     "One or two clients are basically your whole business and you know it. You've known it for a while. You think about it when you're falling asleep, you think about it when one of them takes longer than usual to respond to an email, and you've probably had the moment of running the math on what happens to your family if that client leaves.\n\nThis isn't a strategic risk. At your size it's the strategic risk. You're not running a business right now — you're running a contract with extra steps. And the reason you haven't fixed it is that the same clients funding the concentration are also funding the time you'd need to go find new ones.\n\nThe good news: you don't need ten new clients to fix this. You need three. The bad news: if you don't start finding them now, you find them under pressure later, and the businesses that have to find clients under pressure rarely find good ones.",
    rootCauses: [
     "One client is more than 40% of your revenue, and probably more like 50-70%. You took the work because you needed it, the relationship grew, and it kept being easier to do more for them than to go find someone new. The dependency built itself one good month at a time.",
     "You have no business development habit. Every dollar of revenue you've earned came from a referral, a relationship, or a client finding you. Nothing in your week is dedicated to bringing in new business, because the existing business uses up the entire week. The pipeline is whatever falls into your lap.",
     "You've never said no to scope, so your biggest client now defines what your business does. You've slowly reshaped the offer around what they need, which made you irreplaceable to them and also made you unsellable to anyone else. ",
    ],
    consequence:
     "In 6 months: same business, same fragility, one bad email away from a real problem. In 12 months: either the big client churns and you're scrambling, or the big client renews and you spend another year telling yourself you'll diversify next quarter.\n\nThe owners who lose their businesses at this stage almost never lose them because the work got bad. They lose them because one client decided to bring the work in-house, switch vendors, or cut the budget — and there was nothing underneath to catch the fall. Concentration risk at your size could cause you to go out of business if that client leaves.",
    actions: [
     {
      n: "01",
      title: "Block four hours a week for new business (ideally four hours per DAY). Non-negotiable.",
      body: "Same time every week, on the calendar. Outreach, follow-up, networking calls, proposals — whatever moves new revenue forward. The reason you don't have new clients is that you've never paid the price of looking for them. Four hours a week, every week, is the _minimum_ price. It feels like it costs you delivery time. It actually buys you survival.",
     },
     {
      n: "02",
      title: "Stop expanding scope with your biggest client.",
      body: "The next time they ask for something outside the original arrangement, quote it as a separate engagement instead of absorbing it. You're not trying to lose them — you're trying to stop becoming more dependent on them. Every unpaid favor, every \"while you're at it,\" every off-contract task is another rope tying you to a single point of failure.",
     },
     {
      n: "03",
      title: "Land one new client in the next 60 days, even if it's smaller than your current ones.",
      body: "Smaller is fine. The point isn't revenue replacement — the point is breaking the pattern. The first new client is the hardest one to find when you have no business development habit. Once you've done it once, you've proven to yourself that the pipeline can exist outside the one or two relationships you've been living off of.",
     },
    ],
    benchmark: {
     headline:
      "The survival-stage businesses that get to $1M almost always do it by deliberately diluting their biggest client.",
     body: "They don't fire them. They just stop letting them grow, and they put real time into building three or four more relationships of similar size. Within a year, the original \"whole business\" client is 25-30% of revenue instead of 60-70%, and the business is something the owner actually owns instead of something one customer rents.\n\nThe owners who stay stuck under $500K for five years are almost always the ones who kept telling themselves the big client was the business — until the day it stopped being one.",
    },
   },

   // ── STABILIZING ──────────────────────────────────────
   stabilize: {
    summary:
     "You're growing and your growth is concentrated in fragile places. The new revenue this year mostly came from one or two accounts getting bigger, or from one channel that happens to be working right now, or from a single referral source that keeps sending you good fits. It looks like growth on the P&L. It feels like luck when you sit with it honestly.\n\nYou're past survival. Losing any one client doesn't end the business anymore. But the business's direction is being set by a small number of relationships and channels that you don't fully control, and you've started to notice that you're making decisions — about hiring, about pricing, about what work to take — based on protecting those relationships instead of building toward what you actually want the business to be.\n\nThe instincts that got you from $300K to $800K were the right ones. The instincts that take you from $800K to $2M are different. The first phase rewarded saying yes to whatever came in. The next phase requires you to start designing what comes in.",
    rootCauses: [
     "Your top two or three clients still represent 35-50% of revenue, and the growth you've had recently has come from those accounts expanding rather than from new accounts that look like them. Expansion revenue is easier than acquisition revenue, so the business keeps drifting toward depth instead of breadth.",
     "Your recurring revenue is real but accidental — a couple of retainers or subscriptions that came together organically, not a deliberate recurring layer you designed. You can't tell anyone, including yourself, what your monthly recurring number is supposed to be in 12 months, because nobody's been responsible for growing it.",
     "Your lead sources are still mostly inbound — referrals, repeat clients, the occasional inbound from your website. You've never built an outbound or paid motion that you control, which means your growth rate is set by other people's behavior. When referrals are warm, you grow. When they cool off for a quarter, the business goes flat and you have no lever to pull.",
    ],
    consequence:
     "In 12 months: you'll be a $1.2-1.5M business with the same shape of revenue, the same fragility, and a bigger team to support on top of it. The concentration that was uncomfortable at $700K becomes structural at $1.5M, because now you've hired against revenue that could go down significantly if one client cancels.\n\nMost stabilizing-stage owners don't get hurt by concentration directly. They get hurt by the next decision concentration prevents — the hire they couldn't justify, the office they couldn't sign for, the price increase they wouldn't risk. The growth you didn't take because the foundation felt shaky is the cost of leaving the foundation shaky.",
    actions: [
     {
      n: "01",
      title: "Set a concentration target and run the business against it.",
      body: "Pick a number — top three clients no more than 35% of revenue, recurring at least 30%, no single channel more than 50% of new business — and put it on the same dashboard you use to look at revenue and margin. Until concentration is a number you watch every month, it's a feeling you ignore every month. The number is the thing that turns a vague worry into a managed metric.",
     },
     {
      n: "02",
      title: "Build the recurring layer on purpose this quarter.",
      body: "Take whatever recurring revenue you have today and ask: what would it take to triple this in 12 months? Productize a service. Move project clients onto retainers. Add a monthly support tier. The point isn't a specific tactic — the point is that someone (probably you, for now) owns growing the recurring number, and there's a target attached. Stabilizing businesses with 30%+ recurring revenue scale at roughly half the stress of ones running on pure project work.",
     },
     {
      n: "03",
      title: "Growth 'On Purpose' instead of 'By Accident' — add one outbound channel and run it for two quarters before judging it.",
      body: "Not \"test some marketing.\" Pick one channel — cold outreach, paid search, content, partnership — assign it a budget and an owner, and commit to running it for a MINIMUM of six months — you have to look at this like a long-term investment. Most stabilizing businesses kill new channels at the three-month mark, right before the channel would have started working. The reason your lead sources are concentrated is because you haven't been patient enough to give any of them the time needed to succeed and compound.",
     },
    ],
    benchmark: {
     headline:
      "The stabilizing businesses that break through $1.5M cleanly all do the same thing first.",
     body: "They stop running the business on whatever revenue happens to show up and start designing the revenue they want to show up. They set a concentration target and hold it. They build a recurring layer that grows quarter over quarter on purpose. They add a second lead engine they can steer. None of this is glamorous. All of it is the difference between a business that grows because the owner is hustling and a business that grows because the owner built it to.\n\nThe ones still stuck at $1M five years from now almost always have the same revenue shape they had at $700K. The ones who break through reshaped the revenue first, and the growth followed.",
    },
   },

   // ── SCALING (default) ────────────────────────────────
   growth: {
    summary:
     "Your business is generating real revenue, but you can't make a confident strategic decision because too much of it sits in too few places. The next hire, the second location, the new market, the raise to your top performer — every one of those calls is being made with an asterisk next to it, because you know what happens to the math if your top three clients shrink or your one big channel softens.\n\nYou're not in trouble. The revenue is real, the team is real, the work is real. But the shape of your revenue is making you cautious in a way that's costing you the moves you'd otherwise make. Concentration isn't just a risk number on a page — it's the thing quietly setting the ceiling on what moves you can afford to make to try to get past $3M.\n\nYou know how to grow this business. The reason you're not is that the revenue underneath you doesn't feel solid enough to bet on, and you've never had the time or the tools to deliberately reshape it.",
    rootCauses: [
     "Your top three clients are doing more than 40% of your revenue, and you've stopped pursuing the kind of accounts that would dilute them. Big clients are easier to serve than five smaller ones, so the business naturally drifts toward them. The drift feels like efficiency. It's actually fragility.",
     "Your revenue mix is mostly project-based or one-time, with a recurring layer that never got built. Every January starts at zero. You know what monthly recurring revenue would do to the business — you just haven't carved out the room to design it, because the project work keeps filling the calendar.",
     "Your lead sources are concentrated in one or two channels — usually referrals plus one paid or partner channel — and neither is something you control. When the referral pipeline slows for a quarter, you can feel it across the whole business, and there's no second engine to absorb it.",
    ],
    consequence:
     "In 12 months: you'll be running the same business at roughly the same size, making the same conservative calls, and watching competitors with cleaner revenue bases make moves you can't justify. The trap at your size isn't that you lose a big client and the business cracks. The trap is that the fear of losing a big client makes you run a smaller, more cautious version of the business than you should be running.\n\nMost growth-stage owners discover the cost of concentration not when a client leaves, but when an opportunity comes and they pass on it because they couldn't underwrite the risk. The growth you didn't take is the price you paid.",
    actions: [
     {
      n: "01",
      title: "Run the concentration math, on paper, this week.",
      body: "Top 5 clients as a percentage of revenue. Top channel as a percentage of new business. Recurring as a percentage of total. Three numbers. Most scaling owners have never seen them written down in one place, and the act of writing them down changes what you do next. If your top three are above 40% or your recurring is below 25%, you have a revenue quality problem regardless of how good the top line looks.",
     },
     {
      n: "02",
      title: "Build a recurring layer underneath your project work.",
      body: "Not a pivot — an addition. Take your existing service and design a smaller, lower-friction version that can be sold on a monthly subscription. Retainer, support tier, monitoring, advisory — whatever the recurring shape of your work could be. The goal isn't to replace project revenue. It's to build a floor underneath it so January doesn't start at zero. Most scaling businesses can get to 25-30% recurring within a year just by packaging what they already do.",
     },
     {
      n: "03",
      title: "Open a second lead channel deliberately, not opportunistically.",
      body: "Pick one — outbound, paid, partnership, content — and commit a budget and a person to it for two quarters. Not \"we'll try some things.\" A specific channel, a specific spend, a specific owner, a specific number you're trying to hit. The reason your lead sources are concentrated isn't that the other channels don't work. It's that nobody was ever told to make them work.",
     },
    ],
    benchmark: {
     headline:
      "The scaling businesses that break through to $5M+ all reshape their revenue before they reshape their team.",
     body: "They drop top-client concentration below 25%. They build recurring to at least a third of revenue. They run two lead channels they can actually steer, not one channel they hope keeps working. The revenue gets less exciting on the surface and more durable underneath, and the durability is what lets them make the bets that actually move the business.\n\nThe scaling businesses still stuck at $2-3M five years from now are almost always the ones who stayed concentrated because it was working — until the day it wasn't.",
    },
   },

   // ── OPTIMIZING ───────────────────────────────────────
   optimize: {
        summary: "Your business has scale, a team, and a real brand in your market. But underneath all of that, the quality of your revenue — how recurring it is, how long customers stay, how much they're worth over their lifetime, and whether those relationships are institutional or personal — is quietly setting the ceiling on how far this business can go.\n\nAt your size, the difference between a business running 30% recurring revenue and one running 65%+ isn't just predictability. It's the ability to invest confidently in growth, attract A-level talent, and command a premium valuation when the time comes. And if your client relationships are still tied to specific people rather than the company itself, your revenue is one departure away from a crisis — whether that departure is yours or a key employee's.\n\nThe problem isn't that you don't have good customers. You do. **The problem is that nobody in your organization is measuring and managing Lifetime Value, churn rate, revenue recurrence, and relationship transferability as the strategic growth levers they actually are.**",
        consequence: "In 12 months: your revenue will continue to look strong on the surface, but the underlying quality — the mix of recurring vs. project work, the churn rate, and how transferable your client relationships are — will still be working against you. Every customer who churns costs you 5-7x what it would have cost to retain them. Every project that ends without converting to a recurring engagement is revenue you have to replace from scratch next quarter.\n\nAnd if your key client relationships still live with you or one or two people on your team, your revenue isn't just low-quality — it's fragile. At your scale, the owner cannot be the one who owns all the relationships across sales, marketing, and customer success. If you don't solve relationship transferability now, you may need to go backwards just to have a shot at scaling past where you are.\n\nThis matters whether you want to scale or eventually exit. Buyers and investors don't just look at your revenue number — they look at whether that revenue survives a change in ownership or key personnel. The owners who break through to $10M+ almost always do it on the back of institutional relationships and a recurring revenue engine, not on the back of personal relationships and more deals.",
        rootCauses: [
          "You don't know your Lifetime Value (LTV) or your real churn rate. Most owners at your scale can tell you their revenue, their margin, maybe even their top clients — but they can't tell you how long an average customer stays, what they're worth over that lifetime, or what percentage quietly leave each year. Without these numbers, you can't tell the difference between a customer worth $50K and one worth $500K, and your sales and retention efforts treat them all the same.",
          "Your client relationships aren't transferable — they live with specific people, not with the company. Your top clients chose you or a key employee, not the business. If that person leaves, gets sick, or you try to step back, those relationships are at risk. At your scale, this isn't just an owner dependency issue — it's a revenue quality issue, because revenue tied to personal relationships is fragile revenue that a buyer, investor, or even your own growth plan can't rely on.",
          "You don't have a systematic approach to expanding revenue from existing customers. Upsell and cross-sell happen organically — when a client asks for more, you deliver it. But there's no structured program to identify expansion opportunities, no account management playbook, and no measurement of revenue expansion rate. Your existing customers are your highest-ROI growth channel, and you're barely using it."
        ],
        actions: [
          { n: "01", title: "Calculate your Lifetime Value (LTV) and churn rate — this quarter.", body: "Pull your customer data for the last 3-5 years. Calculate: how long does an average customer stay? What are they worth over that lifetime? What percentage of customers do you lose each year? These three numbers will change how you think about every sales, marketing, and retention decision you make. Most owners who do this exercise for the first time discover that their best customers are worth 10-20x what they assumed — and that their churn rate is quietly eating their growth." },
          { n: "02", title: "Build a relationship transfer plan for your top 15 client relationships.", body: "For each of your top 15 client relationships, document: who owns the relationship today, who on your team could own it next, and what needs to happen to make that transition. You don't need to execute all 15 transfers this quarter — you need the plan. Identify which people or roles on your team will receive each relationship, whether those people already exist or need to be hired, and what the timeline looks like. The goal is institutional relationships that survive any single person's departure — including yours." },
          { n: "03", title: "Build a customer expansion playbook and assign someone to own it.", body: "Map every client against the full suite of services you could provide them. Identify the top 20 expansion opportunities by dollar value and assign an account manager to pursue them with a specific timeline. Revenue expansion from existing customers typically converts at 3-5x the rate of new customer acquisition and costs a fraction as much. This is the highest-ROI growth lever most businesses at your scale aren't pulling." }
        ],
        benchmark: {
          headline: "The most valuable businesses at your revenue level have 70%+ recurring revenue, no client above 10% concentration, and contracts with 12+ month terms.",
          body: "Again, growth without infrastructure scales your problems, not your profits. The top-quartile revenue quality performers at $3M-$10M have built their revenue to be predictable, diversified, and contractually protected — and they measure LTV, churn, and expansion rate as core KPIs."
        },
      },
   scaling: {
    summary: "Your revenue number is impressive — but the composition of that revenue is the constraint.\n\nAt $10M+ the revenue quality problem isn't about generating more. **Too much of your revenue is concentrated in too few clients, too dependent on non-recurring engagements, or too vulnerable to competitive displacement.** A sophisticated buyer will look past the topline and evaluate the quality of each revenue dollar — and the discount they apply for concentration or non-recurrence can be severe.",
    consequence: "At this scale, revenue quality issues don't just create volatility — they fundamentally limit your exit options. **A $12M business with 40% of revenue from three clients and minimal recurring contracts will trade at a fraction of a $9M business with diversified, contracted recurring revenue.** PE firms model revenue quality into their return assumptions, and concentration is priced as risk.",
    rootCauses: [
     "Client concentration has grown with the business. Your largest clients grew as you grew — and now they represent a disproportionate share of your revenue. Losing any one of them would create a material impact, and every sophisticated buyer will identify this as a risk factor.",
     "Revenue model hasn't evolved toward recurring structures. Your business still generates most revenue through project-based or transactional engagements. The opportunity to convert existing clients to recurring contracts hasn't been systematically pursued.",
     "Revenue diversification has been organic, not strategic. New revenue has come from wherever it appeared rather than from a deliberate diversification strategy. The result is a portfolio that looks diversified on the surface but has underlying concentration risks."
    ],
    actions: [
     { n: "01", title: "Build a revenue quality scorecard.", body: "Score every revenue relationship on five dimensions: recurrence, contract duration, concentration risk, margin, and growth potential. This creates a visual map of where your revenue quality is strongest and where the vulnerabilities live." },
     { n: "02", title: "Convert your top 10 project clients to recurring engagements.", body: "Identify the 10 project-based clients who would benefit from an ongoing engagement structure. Design a retainer or subscription model that delivers continuous value, and propose it as an upgrade." },
     { n: "03", title: "Set a concentration ceiling and build toward it.", body: "Define the maximum percentage any single client can represent (typically 10-15% at your scale) and build a 12-month plan to grow new revenue that brings your largest clients below that threshold." }
    ],
    benchmark: {
     headline: "The most valuable businesses at your revenue level have 70%+ recurring revenue, no client above 10% concentration, and contracts with 12+ month terms.",
     body: "Again, growth without infrastructure scales your problems, not your profits. The top-quartile revenue quality performers at $10M+ have built their revenue to be predictable, diversified, and contractually protected."
    },
   },
  },
 },

 // ============================================================
 // OPERATIONAL EFFICIENCY (amber)
 // ============================================================
 operational_efficiency: {
  name: "Operational Efficiency",
  color: COLORS.amber,
  byTier: {
   // ── SURVIVAL ─────────────────────────────────────────
   survival: {
    summary:
     "You're doing too much manually because you can't justify hiring, and the manual work is eating the hours you'd need to grow the business. Invoicing, scheduling, client communication, bookkeeping, ordering, follow-up — all of it routes through you, by hand, every week. You know there are tools that would handle most of it. You know there are people you could hire part-time. And every time you sit down to set any of it up, a client call comes in or a job needs your attention, and the setup gets pushed another week.\n\nThe trap at your stage isn't that you can't afford help. It's that you can't afford the time to set up the help, so the manual work compounds and the business stays exactly the size your two hands can hold. You're the bottleneck, the operator, the bookkeeper, and the salesperson — and the math of that doesn't get you to the next revenue tier no matter how many hours you put in.",
    rootCauses: [
     "You're doing $15/hour work in $150/hour time. You're scheduling appointments by hand, sending invoices manually, chasing receipts at the end of the month, answering the same three client questions over and over. None of this requires you. All of it is using time that, spent on the business instead of in it, would be worth ten times as much.",
     "You haven't set up the tools because the setup feels like another job. You know about the scheduling software, the invoicing tool, the bookkeeping app. You've started signing up for them three times. Each time, the setup ran into a question you didn't know how to answer, and you closed the tab and went back to doing it by hand. The cost of doing it by hand is invisible. The cost of the setup feels real.",
     "You're hiring nobody because you can't define the job. A part-time virtual assistant for ten hours a week would change your life. You haven't hired one because you can't articulate what they'd do — partly because you've been doing all of it yourself, and partly because nothing is written down. So the hire feels too vague to make, and the work stays on you.",
    ],
    consequence:
     "In 12 months: you'll be doing the same revenue, working the same hours, and feeling the same exhaustion. The growth move you've been planning — the second crew, the bigger contract, the new service line — will still be sitting on the list, because the manual work will still be eating the hours. Most owners at your stage who don't fix this either burn out or stay solo forever. The ones who break through almost always do it by giving up an hour a week to set up one tool, and then another, until the manual load is small enough that growth becomes thinkable again.\n\nThe problem here is that you are spending time on manual tasks that don't move the business forward — you need to view paying someone part-time or paying to automate a low-value task as an 'investment' in your ability to grow rather than an expense to your profit.",
    actions: [
     {
      n: "01",
      title: "Pick the one task you do most often and automate or delegate it this week.",
      body: "Not three tasks. One. The thing you do every day or every week that doesn't require your judgment — invoicing, appointment scheduling, follow-up emails, expense entry. Set up the tool, or hire the person, by Friday. The first one is the hardest. The second one takes half as long.",
     },
     {
      n: "02",
      title: "Write down every recurring task you do for one week.",
      body: "Carry a notebook. Every time you do something administrative, write it down with how long it took. At the end of the week, you'll have a list. Half of it will be things a $20/hour assistant could do. The list itself becomes the job description for the first hire — you don't have to invent it, you just have to hand them the page.",
     },
     {
      n: "03",
      title: "Give yourself one morning a week that is not for client work.",
      body: "Block it. Defend it. Use it for setup, automation, hiring, anything that builds the business instead of running it. The reason you're not making this progress is that you have no time set aside to make it. One morning a week, protected, will move you further in three months than another fifty hours of client work will.",
     },
    ],
    benchmark: {
     headline:
      "The under-$500K businesses that break through to $1M almost always do it the same way.",
     body: "They stop doing $15/hour work themselves. They set up two or three pieces of basic infrastructure — scheduling, invoicing, bookkeeping — and they hire one part-time person to absorb whatever's left. None of it is fancy. All of it is boring. And the owners who do it are running businesses 18 months later. The ones who don't are still doing every task by hand, wondering why they can't get to the next level.\n\nYou don't need to scale operations. You need to stop being them.",
    },
   },

   // ── STABILIZING ──────────────────────────────────────
   stabilize: {
    summary:
     "You've added people and processes faster than you've added systems, and now everything is messy. The team is small but real — a handful of employees, a couple of contractors, maybe an office manager. The processes exist but they live in your head, in three different spreadsheets, and in whatever the last person you trained remembers from the conversation. Things get done. They just don't get done the same way twice.\n\nThe mess at your stage isn't dysfunction — it's the natural result of growing past the point where one person can hold the whole operation in their head, without yet having built the systems that would let it run without you holding it. You're in the awkward middle: too big to be informal, too small to have hired the people who would normally formalize it. So the operation runs on memory, on Slack messages, on the way you happened to do it last Tuesday.\n\nThe cost shows up in two places: in the time you spend re-explaining things and fixing what got done wrong, and in the cost of the rework that the team doesn't tell you about because they're embarrassed it happened.",
    rootCauses: [
     "Nothing is written down, so everything has to be remembered or re-decided. How do we onboard a client? Depends who you ask. How do we handle a refund request? Depends what mood the day is in. Every process is a verbal tradition, which means every process drifts every month, and every new hire learns a slightly different version than the last one.",
     "You added software the same way you added people — one problem at a time. The scheduling tool, the CRM, the project management app, the file storage, the invoicing software. Each one was added to solve something. None of them talk to each other. Your team copies data from one to another by hand, every week, and somebody is always working off the wrong version.",
     "You're managing performance by feel because you're not measuring output. Who's productive? You think you know. Who's struggling? You think you know that too. But you're going on vibes, on who responds quickly to messages, on who's around the office. Nobody on the team has clear numbers attached to their job, which means nobody knows when they're winning, and you can't tell when something's actually broken until it's already broken.",
    ],
    consequence:
     "In 18 months: you'll have hired one or two more people to throw at whatever feels like a problem, when you should have done a one-time project to automate the manual work. The team will be bigger, your payroll expense will be higher than it needs to be, and the mess will be bigger than it was when you started because nothing about the underlying problem will have changed — you will just be making LESS profit on a larger amount of revenue. You'll still be the person who knows how everything works, which means you'll still be in every decision, which means the team will still be waiting on you, which means growth will still feel like it's pulling teeth. The owners who never fix this stay between $500K and $1.5M for a decade, growing in revenue but never in capacity.\n\nThe ones who break through document the operation, consolidate the tools, and start measuring what the team actually does. None of it is glamorous. All of it is what separates a $1M business from a $3M business.",
    actions: [
     {
      n: "01",
      title: "Document one process per month for the next six months.",
      body: "Pick the process that breaks most often or causes the most rework. Write it down — the steps, the standards, what \"done well\" looks like. Not a forty-page manual. A one-pager that anyone on the team could follow on a Tuesday morning. Hand it to the person who owns that work and tell them they own the document too. In six months, you'll have six processes that run the same way every time. That's enough to help you get past the stage where you are the only person who knows what \"right\" looks like.",
     },
     {
      n: "02",
      title: "Audit your software stack and cut at least one tool.",
      body: "Pull the full list of everything you pay for monthly. For each one, ask: who uses it, what does it do, and is there another tool we already pay for that does the same thing. There's at least one redundancy. There's probably two. Cut them. Then pick the two tools that are most central to how the team works and ask whether they can be connected — most can, with a basic integration that takes a few hours to set up and ends the manual copying forever.",
     },
     {
      n: "03",
      title: "Give every role one number.",
      body: "Not a dashboard. One number that tells you whether the person is winning. For the office manager, maybe it's response time on client emails. For the lead tech, maybe it's jobs completed without a callback. For the bookkeeper, maybe it's days to close the month. One number, reviewed weekly, in a five-minute conversation. Performance management at your stage doesn't need to be sophisticated — it just needs to be consistent. If you want your employees to actually take work off your plate, and do their job right, they need to know how you are measuring what \"success\" looks like for them.",
     },
    ],
    benchmark: {
     headline:
      "The businesses that get from $1M to $3M cleanly all do the same three things in the same order.",
     body: "They document the operation in pieces — one process at a time — until the business runs on paper instead of memory. They consolidate the software stack so the team works in two or three tools instead of eight. They attach a number to every role so performance becomes visible instead of intuitive.\n\nThe owners still doing $1M five years from now are almost always the ones who never wrote any of it down. The ones who get to $3M and beyond built the boring infrastructure that lets the business run on a Tuesday morning when the owner is on a plane.",
    },
   },

   // ── SCALING (default) ────────────────────────────────
   growth: {
    summary:
     "Your overhead has grown faster than your revenue and nobody on the team owns the cost structure. You've added people, software, vendors, and processes one decision at a time over the last three or four years, and each one made sense in isolation. Added together, they've quietly turned into a cost base that's heavier than the business needs to be and lighter than it should be on accountability.\n\nYou're not bloated by accident. You're bloated because every hire, every tool, every line item was added by you, in a moment, to solve a real problem — and once it was added, nobody was assigned to ever revisit it. So the org chart grew, the SaaS bill grew, the vendor list grew, and the question of whether any of it still earns its place stopped getting asked.\n\nThe thing nobody on your team is doing is the thing that protects margin at your size: looking at the cost structure on purpose, on a schedule, with the authority to cut. Until somebody owns that, your overhead will keep growing at the rate of your problems, instead of your business growing profits consistently year-over-year.",
    rootCauses: [
     "Nobody on your team owns the cost structure. Sales has a number. Operations has a number. You have a P&L. But there's no person whose job it is to look at the full cost base every quarter and ask which line items still earn their place. Costs get added by whoever needed them. They never get removed, because removing them isn't anyone's job.",
     "Your headcount grew around problems instead of around roles and desired outcomes for the business. When something broke, you hired. When somebody got overwhelmed, you hired. The hires worked — the immediate problem went away — and the organizational shape got a little less coherent each time. Now you have people whose jobs you'd struggle to write down in a sentence, and you don't have a single person who is responsible for (and rewarded for) growth in each part of the business.",
     "You're paying for software and vendors that nobody audits. The SaaS stack, the contractor list, the vendor accounts — they all got added by someone, for a reason, at some point. Nobody has looked at the full list in a year. Some of it isn't being used. Some of it is being used by one person for one task that another tool already does. Every month, the autopay clears and nobody reads the line item.",
    ],
    consequence:
     "In 18 months: revenue will be up modestly and overhead will be up more. Margin will compress another two or three points and you won't be able to point to where it went, because it didn't go anywhere — it just leaked, slowly, across forty line items nobody was watching. You'll start to feel the squeeze in the things you can't fund: the next hire, the equipment upgrade, the marketing test. You'll assume you need more revenue. What you need is somebody whose job is to defend the margin you already have.\n\nThe scaling owners who break out of this band don't do it by selling more. They do it by getting deliberate about what the business actually costs to run, and by giving one person the authority to hold that line. The ones who don't are still doing the same revenue three years later with thinner margins, a larger payroll expense, and more families that depend on you and your business to make sure their mortgage gets paid.",
    actions: [
     {
      n: "01",
      title: "Run a cost-base audit on a Saturday.",
      body: "Pull the full P&L and the full vendor list. Go line by line. For every recurring expense over $500/month, write down what it does, who uses it, and what would break if it disappeared tomorrow. You will find three to five line items that nobody can defend. Cut them this week. This single exercise typically frees up 1-3% of revenue inside a month, with no headcount impact.",
     },
     {
      n: "02",
      title: "Assign one person to own overhead.",
      body: "This is usually a controller, a fractional-CFO, or a finance manager. At your stage it is likely cheaper and more efficient for you to outsource this to a fractional-CFO who can help drive efficiency and growth, rather than you hiring someone full-time in the business and pay more to have them in-house right now. You need someone who is an expert that can help you make better decisions and avoid mistakes — not someone who you have to manage and pay their health insurance and benefits. Their job is to look at the cost structure every quarter, flag drift, and bring you a list of cuts. Give them the authority to kill line items under a threshold without asking. Without that authority, the role doesn't work.",
     },
     {
      n: "03",
      title: "Define output per employee for every role.",
      body: "Not a job description — an output. What does this role produce? How is it measured? What does \"a productive month\" look like in that seat? You'll discover two things: roles where the output is so unclear that nobody could tell you if the person is performing, and roles where the output is real but nobody's been measuring it. Both get fixed by the same exercise.",
     },
    ],
    benchmark: {
     headline:
      "The scaling businesses that protect margin while they grow all do the same three things.",
     body: "They audit the cost base on a calendar, not a crisis. They give one person the authority and the mandate to defend overhead. They define what every role is supposed to produce, and they measure it. None of this is exciting. All of it is the difference between a $3M business doing 12% margin and a $3M business doing 18% margin — and the 18% business is worth nearly twice as much when the day comes to sell it.\n\nThe owners who get to $5M with healthy margins are almost never the ones who grew faster. They're the ones who stayed lean while they grew. The bloat, once it sets in, takes years to cut back out — and most owners never do.",
    },
   },

   // ── OPTIMIZING ───────────────────────────────────────
   optimize: {
    summary:
     "Operational drag is the silent killer of margin at your scale and nobody on the team is fighting it. The business runs. The team is competent. Revenue grows. And every quarter, your operating margin sits a point or two below where it should be for a business of your size and category, and nobody can tell you exactly why — because the answer isn't in any one place. It's spread across a hundred line items, half a dozen departments, and three years of accumulated decisions that nobody has revisited.\n\nAt your stage, operational efficiency isn't about cutting waste. It's about whether your business has the financial systems, reporting, and accountability structures to defend operating leverage as you scale. Most businesses your size don't. They have finance that closes the books and operations that runs the work, but nobody whose job is to look at the gap between what the business should cost to run and what it actually costs — and to close it on a schedule.\n\n**The cost of not having that discipline is invisible quarter to quarter, but enormous over five years. It shows up as margins that drift down, a business that becomes more fragile as it grows, and a ceiling on both scalability and valuation that you won't see until you try to push past it.**",
    rootCauses: [
     "You've never had an operating efficiency function and you're past the size where you can run without one. Finance reports the numbers. Operations runs the work. Nobody sits between them and asks whether the work is being done at the cost it should be done at. At under $5M, the owner does this implicitly. At your size, the owner can't see the line items anymore — and nobody has been hired or assigned to see them on the owner's behalf.",
     "Your gross margin and your operating margin have decoupled and nobody on the team has flagged it. You're probably maintaining gross margin reasonably well — pricing has held, COGS is managed. But operating expenses have grown faster than revenue for the last several years, which means your operating margin is compressing while your top line looks healthy. The decoupling is the diagnostic. Nobody is reading it because nobody owns it.",
     "Your team is incentivized to grow revenue, but not to grow it profitably. Sales is rewarded for closing deals regardless of margin. Operations is rewarded for delivery volume regardless of cost. Nobody on the team has a compensation structure, a bonus, or even a KPI that ties directly to operating margin or efficiency gains. When the incentives reward top-line growth without margin discipline, your people will rationally do exactly what you're paying them to do — grow revenue while the margin underneath it quietly erodes. This is the structural misalignment that turns a growing business into a fragile one — this needs to be optimized before you try to scale.",
    ],
    consequence:
     "In 12 months: your revenue will continue to grow, but your margins will compress further — and the business will become more fragile, not stronger. Every new client, every new hire, and every new tool you add will generate revenue at a thinner margin than the last, because the operational infrastructure underneath it all wasn't built to maintain margins at scale.\n\nThis matters whether you want to scale or eventually exit. If you want to grow to $10M+, you can't get there on shrinking margins — you'll run out of fuel before you run out of market. If you want to sell, a buyer prices your business on margin, not revenue. A $7M business at 15% operating margin and one at 21% are valued dramatically differently — and the gap between them is the operational discipline nobody on your team is currently accountable for.\n\nThe worst outcome isn't that margins compress. It's that they compress slowly enough that you don't notice until you're in a position where you need to go backwards — cutting costs, restructuring, and rebuilding — just to have a shot at growing profitably or selling at a fair multiple.",
    actions: [
     {
      n: "01",
      title:
       "Get someone accountable for defending operating margin as you scale.",
      body: "This doesn't need to be a $250K in-house hire. What it needs to be is someone with the expertise to track the right metrics, the accountability to stay on top of them in 90-day sprints, and the tactical judgment to help you make decisions as the numbers shift and new problems surface. The key is that this function exists — that someone is watching operating margin, flagging when it drifts, and helping you course-correct before the compression becomes structural. Most owners at your scale don't need another employee for this. They need a partner who brings the framework, the discipline, and the expertise to defend margin while you focus on growth.",
     },
     {
      n: "02",
      title: "Establish an operating margin target and review it monthly.",
      body: "Pick the right number for your business and category — the margin a well-run business of your size and industry produces. Put it on the dashboard next to revenue. Review it every month with the same seriousness you review the top line. Most $5M+ businesses report revenue weekly and operating margin quarterly, which is exactly backwards — revenue is largely set by the market, and operating margin is largely set by you.",
     },
     {
      n: "03",
      title: "Align incentives with margin, not just revenue.",
      body: "Look at every role that touches revenue — sales, account management, delivery leads — and ask: does their compensation or bonus structure reward profitable growth, or just growth? If the answer is just growth, restructure it. Tie sales compensation to gross margin, not just bookings. Tie delivery leads to project profitability, not just completion. Give your operations leader a margin target, not just a throughput target. When your people are rewarded for growing revenue while maintaining or expanding margins, they will. When they're not, they won't — and you'll keep wondering why revenue grows but margins don't.",
     },
    ],
    benchmark: {
     headline:
      "The $5M+ businesses that protect or expand operating margin as they scale all have the same thing in common: somebody on the leadership team owns it.",
     body: "They have a Director of Operations or a VP of Finance whose job includes operating leverage explicitly, in writing, with the authority to act. They review operating margin against target on the same cadence they review revenue. They run a real cost-base review once a year.\n\nThe businesses that don't do this look fine quarter to quarter and lose two to four points of operating margin per year against their potential. Over five years, that gap compounds into a different business — same revenue, materially lower enterprise value, and a buyer at the table who can see exactly what was left undone.\n\nAt your scale, operating efficiency isn't an operational discipline. It's an enterprise-value discipline. The owners who treat it that way exit for materially more. The owners who treat it as a back-office concern exit for what the business looks like, not what it could have been.",
    },
   },
   scaling: {
    summary: "Your business has the revenue and the team — but the operating model is consuming more margin than it should.\n\nAt $10M+ operational inefficiency isn't about disorganization. **You have more processes, more tools, more people, and more handoffs than you did at $5M — but nobody has stepped back to ask whether the operating model still makes sense for the business you've become.** The result is that your costs grow faster than your revenue and the business requires more effort to deliver the same outcomes.",
    consequence: "At this scale, operational inefficiency directly compresses your valuation multiple. **Every percentage point of margin lost to operational drag is worth 3-5x in enterprise value.** A buyer who sees a $10M business with 15% EBITDA and clear operational waste doesn't see a problem — they see an opportunity to buy at a discount and extract the margin themselves. That's money that should be in your pocket.",
    rootCauses: [
     "The operating model was never redesigned for your current scale. You've added people, processes, and tools incrementally — but the underlying operating model is still the one you built at $3M. The inefficiencies compound at scale.",
     "Nobody on the team owns the P&L at the operating level. Your leadership team manages activities, not economics. They can tell you what they're working on but not what it costs or what margin it generates.",
     "Technology and tooling have sprawled without integration. You've accumulated tools and platforms that each solve a specific problem but don't connect to each other. The result is manual data transfer, duplicate entry, and reconciliation work."
    ],
    actions: [
     { n: "01", title: "Conduct an operating model audit.", body: "Map every major workflow from trigger to completion — including every handoff, approval, and system touchpoint. Identify the steps that add time without adding value and target the top 5 waste generators." },
     { n: "02", title: "Assign P&L ownership to your operating leaders.", body: "Give each department or business unit leader a margin target and the visibility to manage it. When the people closest to the work own the economics of that work, operational efficiency becomes self-correcting." },
     { n: "03", title: "Consolidate your technology stack.", body: "Audit every tool, platform, and subscription in the business. Eliminate redundancies, integrate data flows between the systems that remain, and set a policy that every new tool must replace an existing one." }
    ],
    benchmark: {
     headline: "The leanest operators at your revenue level deliver the same output with 15-20% fewer resources — not because they work harder, but because their operating model has fewer friction points.",
     body: "Again, growth without infrastructure scales your problems, not your profits. The top-quartile operators at $10M+ have built operating models designed for their current scale, not inherited from an earlier stage."
    },
   },
  },
 },


 // ============================================================
 // SCALABILITY (cyan)
 // ============================================================
 scalability: {
  name: "Scalability",
  color: COLORS.cyan,
  byTier: {
   // ── SURVIVAL ─────────────────────────────────────────
   survival: {
    summary:
     "You are the system. There's no process that doesn't run through you, no client interaction that doesn't involve you, no part of the business that would keep working if you took a month off. The reason the business can't scale isn't that the market isn't there. It's that the business is built for a headcount of one, and that one person is at capacity.\n\nYou know this. You've known it for a while. You've thought about hiring, about systems, about the version of this business that doesn't depend on you being in every conversation. And every time you get close to doing something about it, the work pulls you back — because there's a client waiting, a deadline that's real, and nobody else to handle it.\n\nThe constraint at your stage is the simplest and most honest version of the scalability problem: you can't grow past the size of one person's bandwidth when one person is doing everything. And the things you'd need to do to change that — hire, systemize, automate — all require time you don't have, because you're spending it doing the work.",
    rootCauses: [
     "Nothing in your business is repeatable without you in the room. The way you quote, the way you deliver, the way you handle problems — it all lives in your head. There's no playbook, no checklist, no process that someone else could follow. Which means every new client adds hours to your week instead of dollars to a system.",
     "You've never designed the business to work without you because there was never anyone else to hand it to. The business has no transferable capacity — but the cause is different from the owner who won't let go. You'd let go if there were hands to let go into.",
     "Your revenue model depends on your personal output. If you're not doing the work, the revenue doesn't come in. There's no leverage — no product, no team, no recurring model — that generates income while you're not producing. Every dollar is a dollar you personally created by showing up.",
    ],
    consequence:
     "In 12 months: you'll be doing roughly the same revenue, working roughly the same hours, and the ceiling will be exactly where it is today — at the limit of what one person can produce. The business will never be worth more than your annual income, because the business is your annual income. There's nothing to sell, nothing to scale, nothing that outlives your capacity.\n\nThe owners who stay at this stage for five or ten years aren't the ones who failed at business. They're the ones who built a job they can't leave and called it a company. Your ability to work harder at this stage is not what is preventing you from scaling. You need to build the infrastructure one piece at a time — one process, one hire, etc. — that creates capacity the business didn't have before so that when you pour in more customers your profits actually grow (instead of shrinking).",
    actions: [
     {
      n: "01",
      title: "Pick the most repeatable thing you do and write down how it works.",
      body: "Not the whole business. One task. The thing you do the same way every time — sending a proposal, onboarding a new client, delivering the core service. Write it down in enough detail that a competent stranger could do 80% of it without calling you. This document is the first piece of a business that can exist without your personal involvement, and right now you have zero of those pieces.",
     },
     {
      n: "02",
      title: "Find the one task you could hand to a part-timer this month.",
      body: "Bookkeeping, invoicing, scheduling, inbox management — something that eats hours and doesn't require your expertise. Hire a part-time VA or assistant for 5-10 hours a week. The cost feels real. The time it frees up is worth five times more than the cost, because that time goes into client work you can bill for or business development you've been putting off.",
     },
     {
      n: "03",
      title: "Design a version of your core service that doesn't scale linearly with your time.",
      body: "This is the hard one. If you bill by the hour, design a package. If you do custom work every time, design a standardized offering you can deliver faster. If you're the only person who can do the work, figure out which 30% of the work actually requires your expertise and which 70% could be templated, assisted, or outsourced. The goal isn't to change the business overnight. It's to find the one piece of leverage that breaks the dollar-per-hour ceiling.",
     },
    ],
    benchmark: {
     headline:
      "The under-$500K businesses that break through to $1M almost always do it by building one piece of scalable infrastructure.",
     body: "Not a grand system. One thing. A documented process that lets them hire their first real employee. A productized service that sells without custom scoping every time. A recurring model that produces revenue they don't have to personally generate. The breakthrough almost never comes from more marketing or more hustle. It comes from building the one structural change that lets the business produce output without the owner doing all of it.\n\nThe owners still doing $400K five years from now are the ones who kept doing the work instead of building the system that does the work. It's the hardest shift in the lifecycle, and there's no way around it.",
    },
   },

   // ── STABILIZING ──────────────────────────────────────
   stabilize: {
    summary:
     "You made the first hires and the business got bigger without getting more scalable. The work is getting done — mostly — but it's getting done through you coordinating everything, checking everything, and fixing everything that didn't meet your standard. You hired to scale. What you got was a team that needs you more, not less.\n\nThe problem is that the business has no operating system, not necessarily that the people you hired were the wrong people for the team. There's no structure that tells the team how to do the work to your standard without asking you. There are no metrics that tell anyone whether the work is being done well or poorly. There are no systems that let the business absorb another ten clients without adding another person. Everything that comes in gets processed through the same ad-hoc, memory-based, owner-mediated workflow that worked when it was just you — and it's not working anymore.\n\nYou're at the most frustrating stage of the scalability problem: you've invested in growth and the investment hasn't produced leverage. It's produced higher overhead and a more fragile business for covering those fixed costs each month.",
    rootCauses: [
     "You hired people before you built the systems they'd work inside. The team has bodies but no playbook. They're doing the work the way they think you'd do it, which is different for every person, and the inconsistency shows up as quality problems, rework, and your time spent correcting instead of building.",
     "Your service delivery can't absorb volume without proportional effort. Every new client takes roughly the same amount of human hours as the last one, because nothing has been standardized, templated, or automated. Scaling at your stage means doing 30% more work for 10% more revenue, and that math will make growth harder 12 months from now if you just keep trying to push through it and \"work harder\".",
     "You don't have the metrics to know what's working and what isn't. The business runs on your attention, which means the things you're watching run well and the things you're not watching drift. You can't scale what you can't measure, and right now you can't measure most of what the team does.",
    ],
    consequence:
     "In 12 months: you'll be at $1.2M with the overhead of a $1.5M business and the systems of a $500K one. The team will be bigger. Your hours will be the same or longer. Your take-home will be roughly what it was when you were solo, because the extra revenue is being consumed by the extra cost — and the extra cost exists because nothing in the operation is producing leverage.\n\nThe trap at your stage is hiring your way to scale when the real problem is systems. Another person on a broken process just breaks the process more expensively. The stabilizing owners who break through don't assume that adding headcount is the right answer — they compare a potential hire vs building the infrastructure that makes the existing headcount have more capacity, and then make a decision after running the numbers. They look at ROI potential instead of guessing.",
    actions: [
     {
      n: "01",
      title: "Build a standard operating procedure for your core service delivery.",
      body: "Not a general document. A step-by-step for how the work gets done, from intake to delivery to follow-up. Who does what, in what order, to what standard. Include the three quality checkpoints where problems usually show up. Hand it to the team and tell them this is the system — follow it, improve it, own it. This single document reduces the volume of questions that hit your desk by half inside a month.",
     },
     {
      n: "02",
      title: "Identify what can be templated and template it.",
      body: "Proposals, onboarding emails, project kickoff checklists, status reports, invoice formats — the things you recreate from scratch every time. Build the templates. Put them where the team can find them. Every template you create saves 30-60 minutes per use, and most stabilizing businesses use them dozens of times a month. The compounding is enormous and invisible until you start measuring it.",
     },
     {
      n: "03",
      title: "Pick three numbers that tell you whether the business is healthy, and start reviewing them weekly.",
      body: "Revenue per employee. Client satisfaction (even a simple score). On-time delivery rate. Pick three. Whatever tells you the most about whether the machine is working. Review them every Monday morning in a 15-minute meeting with whoever's closest to the work. The meeting is not the point. The habit of measuring is the point. Scalable businesses measure. Unscalable ones guess.",
     },
    ],
    benchmark: {
     headline:
      "The stabilizing businesses that get to $2M without burning out do it by building the machine before they feed it more clients.",
     body: "They document the workflow. They template the repeatable tasks. They build a short list of metrics they actually review on a cadence. None of it is sophisticated. All of it is the difference between a $1M business that scales to $3M and a $1M business that adds people, adds cost, and stays at $1M with thinner margins and a more exhausted owner.\n\nThe owners who get stuck at $800K-$1.2M for five years are almost always the ones who kept hiring and never built the system the hires needed to work inside. The team wasn't the problem. The infrastructure was.",
    },
   },

   // ── SCALING (default) ────────────────────────────────
   growth: {
    summary:
     "Your business is producing results at its current size and the way it produces those results won't survive the next stage. You can feel it. Growth used to come from doing more of what was working. **Now doing more of what's working is what's creating the problems — the team is stretched, the processes are bending, and every time you push harder, something breaks that didn't used to break.**\n\nYou're not running a bad business. You're running a business that was built for $1.5M and you're trying to push it past $3M without rebuilding the engine. The skills, the systems, the org structure, the way decisions get made — all of it was designed for a smaller version of this company. It worked beautifully at that size. At this size it's the thing holding you back.\n\nThe hardest part is that the answer isn't to work harder. You already know that. The answer is to rebuild pieces of the business while you're still running it, which is the thing you've been putting off because there's never a good time and the revenue keeps needing your attention.",
    rootCauses: [
     "Your processes were designed for a smaller business and haven't been rebuilt for the one you're running now. What used to take one person and a spreadsheet now takes three people and a workaround. The process didn't fail — you outgrew it, and nobody stopped to redesign it because the workaround kept working. Every workaround adds friction, and the friction is compounding.",
     "Your team was hired to execute at one level and you need them to operate at the next. The people who were great individual contributors at $1M aren't necessarily the managers you need at $4M, and you've been avoiding that conversation because they're loyal, they work hard, and the idea of replacing someone who helped you build the business feels wrong. So you work around the capability gap instead of closing it.",
     "You don't have the infrastructure to manage complexity at the next level. Reporting, project management, client onboarding, quality control, financial analysis — the systems you have are either manual, informal, or held together by one person who knows where all the files are. That person is usually you. The business can grow, but only to the size one person's memory can support.",
    ],
    consequence:
     "In 12 months: you'll be doing $3.5M with the infrastructure of a $1.5M business, and the cracks will be showing in places your customers can see — longer delivery times, more mistakes, less consistency, the feeling that the quality isn't what it used to be. You'll be working more hours, not fewer, because every new client adds load to a system that's already maxed out.\n\nThe trap at your stage isn't that growth stops. It's that growth starts costing more than it earns. Revenue goes up, margin goes down, and the owner works harder for what amounts to the same take-home — because **the business is scaling its revenue without scaling the capacity to deliver it profitably.** That's not a growth problem. That's a ceiling disguised as a growth problem.",
    actions: [
     {
      n: "01",
      title: "Identify the three processes that break most often and redesign one this quarter.",
      body: "Not \"document.\" Redesign. The difference matters. Documenting the current process just gives you a manual for something that's already broken. Sit down with the people who run the process and design the version that works at $5M — different steps, different tools, different handoffs. Build it once, properly, and the workaround stops consuming hours every week.",
     },
     {
      n: "02",
      title: "Have the honest conversation about your team's capability for the next stage.",
      body: "Look at every role one level below you. For each one, ask: can this person run this function at double the current volume without me being involved? If the answer is no, you have three options — train, supplement, or transition. All three are uncomfortable. None of them are as expensive as running a $4M business with a $1.5M management layer.",
     },
     {
      n: "03",
      title: "Build the reporting infrastructure you'll need before you need it.",
      body: "A weekly dashboard that shows revenue, margin, pipeline, utilization, cash, and the three operational metrics that matter most in your business. If you don't have this today, you're flying blind — and the reason the cracks are showing up in customer-facing places is that nobody is watching the internal indicators that predict them. The dashboard takes a week to build. The visibility it creates changes every decision you make after that.",
     },
    ],
    benchmark: {
     headline:
      "The businesses that scale cleanly from $2M to $5M all do the same thing at roughly the same inflection point.",
     body: "They stop running the current business harder and start building the next business inside it. They redesign the processes that don't scale. They upgrade or supplement the team that got them here with the team that can get them there. They build the management infrastructure — dashboards, metrics, meeting cadence, accountability — that lets the business run on information instead of on the owner's attention.\n\nThe businesses still stuck at $2-3M five years from now are almost always the ones that kept trying to scale by adding more people to the same processes. Again, growth without infrastructure scales your problems, not your profits. It's just getting bigger while getting worse.",
    },
   },

   // ── OPTIMIZING ───────────────────────────────────────
   optimize: {
        summary: "Your business has the revenue, the team, and the market presence to break through to $10M+. But the infrastructure underneath all of it — the leadership pipeline, the revenue quality, the operational discipline, the cash deployment strategy, and the margin architecture — wasn't built for what comes next.\n\nScalability at your stage isn't about getting more clients or hiring more people. It's about whether five critical foundations are in place: department leads who can own core functions without you, recurring revenue with strong LTV and low churn, operating margins that expand (not compress) as you grow, a capital allocation framework that deploys profits into the highest-ROI opportunities, and transferable client relationships that don't depend on any single person.\n\n**The businesses that break through to $10M+ don't get there by pushing harder on what's already working. They get there by building the institutional infrastructure that makes the next stage of growth compounding rather than grinding.** If you skip this work now, you'll eventually hit a wall where the only path forward requires going backwards first — restructuring what should have been built before the growth, not after it.",
        consequence: "In 12 months: if you try to scale without the foundations in place, the business will get bigger but not better. Revenue may grow, but margins will compress. You'll hire more people, but without department leads they'll all still report to you. You'll win more clients, but without recurring revenue structures and relationship transferability, every new client is revenue you have to replace when they leave. Every dollar of growth built on a weak foundation costs more to maintain and is worth less to a buyer, an investor, or even to you.\n\nThe worst outcome isn't that you fail to grow. It's that you grow into a version of the business that's harder to run, harder to sell, and harder to enjoy — a larger, more fragile business that requires more of your time, not less. The owners who scale successfully from $3M-$10M to $10M+ almost always do it by building the infrastructure first and scaling second. The ones who scale first and build second usually stall, plateau, or find themselves needing to go backwards to fix what they skipped.\n\nThis is the constraint that determines whether the next chapter of your business is compounding growth or compounding complexity.",
        rootCauses: [
          "Your leadership development pipeline is empty and your team isn't ready to scale without you. You have managers who execute instructions, but you don't have department leads who own marketing, sales, delivery, and finance as their own domains. Without these leaders, every growth initiative routes back to you — and your personal capacity is the ceiling on the business.",
          "Your revenue quality isn't built for compounding growth. Too much of your revenue is project-based rather than recurring. Your customer lifetime value, churn rate, and relationship transferability haven't been measured or managed as strategic growth levers. Revenue that churns has to be replaced from scratch, and client relationships that live with specific people are fragile revenue that won't survive scaling.",
          "Your operational and financial infrastructure wasn't built for the next stage. Operating margins are compressing as you grow because nobody owns margin defense. Capital allocation runs on gut rather than ROI frameworks. Incentives reward revenue growth without requiring margin discipline. The business generates opportunities, but the infrastructure can't convert them into profitable growth without adding proportional cost."
        ],
        actions: [
          { n: "01", title: "Audit your readiness across the five foundations for scale.", body: "Before you invest in growth, assess where you actually stand. For each foundation — leadership pipeline, revenue quality, operational efficiency, cash deployment, and margin architecture — answer one question: if we grew 50% in the next 18 months, would this foundation support it or break under it? Be brutally honest. The areas where the answer is 'break' are the ones that need to be built before you scale, not during. Most owners who stall between $5M and $10M do so because they tried to scale first and build second." },
          { n: "02", title: "Develop a plan for building out your leadership layer.", body: "For each core department — marketing, sales, delivery, and finance — answer two questions. First: do you have someone in-house right now who could lead that department and grow its output and efficiency without you telling them what to do? If yes, start developing them. If no, start recruiting. Second: what are the 1-3 core KPIs that define what 'success' looks like for that department? These are the numbers each department lead will use to drive improvements and growth without you. The plan doesn't need to be executed this quarter — but it needs to exist, because you can't scale past your current size without people who own functions, not just tasks." },
          { n: "03", title: "Install the margin discipline and capital framework that makes growth profitable.", body: "Get someone accountable for defending operating margin as you scale — someone with the expertise, the metrics, and the 90-day accountability to course-correct before compression becomes structural. Align incentives across your team so that sales, delivery, and operations are rewarded for profitable growth, not just growth. And build a capital allocation framework that defines where profits go — debt paydown, reinvestment, distributions, reserves — so every dollar is deployed with ROI targets, not gut instinct. The businesses that compound don't generate more cash. They redeploy it faster, smarter, and with a rules-based framework." }
        ],
        benchmark: {
          headline: "The businesses that scale cleanly from $3M-$10M to $10M+ all share the same five foundations: strong department leads, recurring revenue with low churn, expanding margins, disciplined capital allocation, and transferable client relationships.",
          body: "None of these are optional. Each one is a load-bearing wall in the infrastructure that supports the next stage of growth. The owners who build them before scaling create businesses that compound. The owners who skip them create businesses that plateau — or worse, grow into something more fragile and less valuable than what they had before."
        },
      },
   scaling: {
    summary: "Your business has proven it can generate $10M+ in revenue — but the infrastructure underneath that revenue wasn't built for what comes next.\n\nAt this level, the scalability constraint isn't about whether you can get more clients. **The business has scaled its revenue without scaling the capacity to deliver it profitably at the next tier of growth.** Every increment of growth from here requires either a proportional increase in resources (which compresses margin) or a fundamental redesign of how you deliver.",
    consequence: "At $10M+ the cost of the scalability constraint is measured in enterprise value, not just stress. **A buyer looking at your business will model the cost of scaling it — and if the answer is 'rebuild most of the infrastructure,' they'll discount the acquisition price by the full cost of that rebuild.** The businesses that command premium multiples at your level are the ones where the cost curve flattens while the revenue curve climbs.",
    rootCauses: [
     "Delivery model is still labor-linear. Every dollar of new revenue requires a proportional increase in headcount, hours, or direct cost. There's no leverage in the model — no technology layer, no productized offering, and no delivery automation.",
     "Organizational structure creates bottlenecks at the leadership layer. Your management team is maxed. Adding more clients or more revenue requires more decisions from the same leaders, and their decision-making capacity has become the binding constraint.",
     "Systems and infrastructure were built for the last stage of growth. Your CRM, project management, financial systems, and communication tools were configured for a $5M business. They technically still work but require workarounds that won't survive the next doubling."
    ],
    actions: [
     { n: "01", title: "Identify the 3 workflows that break first at 1.5x volume.", body: "Mentally stress-test your operation at 50% more volume. Which workflows fail first? Which team members become the bottleneck? Those are the exact infrastructure investments that need to happen now, before the growth arrives." },
     { n: "02", title: "Design a productized or leveraged delivery model.", body: "Take your most common engagement type and redesign it as a scalable offering — standardized scope, repeatable process, technology-assisted delivery, and a margin structure that improves with volume." },
     { n: "03", title: "Build a leadership capacity plan.", body: "Map every strategic decision that currently requires your leadership team's input. Identify which can be delegated, which need frameworks, and which require a new hire. Your next stage requires more leadership capacity, not more execution." }
    ],
    benchmark: {
     headline: "The businesses that scale cleanly past $10M all share one structural advantage: their cost-to-deliver grows at 60% the rate of their revenue.",
     body: "Again, growth without infrastructure scales your problems, not your profits. The top-quartile scalers at $10M+ have built delivery models where incremental revenue drops to the bottom line at a higher rate than their historical average."
    },
   },
  },
 },
};

// ─── STRATEGIC INTENSIVE COPY ────────────────────────────────
// Hero CTA shown to qualified visitors ($750K+ revenue).
// Source: valorcopyreviewv3 — Part Two.
const STRATEGIC_INTENSIVE_COPY = {
 eyebrow: "Work with Kriczky Virtus · Valuation Driver Intensive",
 headline:
  "I'll show you the gap between what your business is worth today and what it could be worth — and exactly what to fix first.",
 // The pain inventory paragraphs that open the pitch.
 leadParagraphs: [
  "Most owners I work with aren't struggling because they're bad operators. They're struggling because they're making decisions in the dark — and the decisions are piling up faster than they can think.",
  "The revenue's growing and the money is disappearing back into the business faster than you can track it. Some of it's going into reinvestments you're making without knowing the odds. All of it feels like effort without progress.",
  "You haven't taken a real vacation in years, because every time you try, something breaks that only you can fix — and you come back more tired than when you left. The only growth you've ever known is you working harder, which means every step up adds another layer of the business depending on you to hold it together. And somewhere in the back of your mind, you've started to notice that you couldn't attract a senior hire even if you wanted to. You don't know how to sell someone on a future version of this business when you can't clearly see it yourself.",
  "All of that feels like different problems. It isn't. It's the same problem: the business has outgrown the way you're running it, and brute force is making it worse, not better.",
 ],

 // The bull/base/bear mechanism — opens the substance of the pitch.
 // TODO: CEPA designation gets folded in here as a parenthetical about
 // enterprise-value orientation the week Edward officially earns it.
 // Flagged location per v3 review doc, Queue item #5.
 mechanismHeading: "The mechanism",
 mechanismParagraphs: [
  "In our first session I'll show you something most owners have never seen: the actual dollar gap between your bear case, your base case, and your bull case. Built from the assumptions you give me about your own business. Not anything I make up.",
  "Most owners discover the spread is six figures in year one alone.",
  "By year five, that same gap is the difference between two completely different versions of their retirement — and a meaningful difference in what your business is actually worth the day you decide to sell it.",
 ],

 closerHeading: "The closer",
 closer:
  "That gap exists whether or not we work together. The only question is whether you can see it.",

 // The named deliverable — Constraint Roadmap.
 deliverableHeading: "The deliverable — The Constraint Roadmap",
 deliverableParagraphs: [
  "You leave with a live Valor model of your business plus a written diagnostic. The diagnostic names your current constraint, names the next three or four constraints you'll hit as you grow, and shows what fixing each one does to your projected enterprise value.",
  "Most advisors give you a plan. I give you a roadmap — the one you'll still be referring to 18 months from now when you're working on constraint number three.",
 ],

 whatsIncludedHeading: "What's included",
 whatsIncluded: [
  "Full Valor diagnostic — your business scored across 42 metrics with the constraint sequence identified",
  "Bull / base / bear model — the actual dollar gap between the three futures your business could walk into",
  "The Constraint Roadmap — written diagnostic plus a live Valor scenario you keep accessing for 12 months",
  "Two follow-up sessions — because the plan is worth nothing without the first 90 days of execution",
 ],

 guaranteeHeading: "The guarantee",
 guarantee: "If the Intensive doesn't surface at least $100K in actionable opportunities, you get a full refund.",
 guaranteeFollowup:
  "Most owners walk away from the first session alone with a clearer picture of what their business could be worth than they've had in years of running it.",

 price: "$5,000",
 priceUnit: "one-time",
 cta: "Book Your Intensive →",
};

// ─── COMMUNITY COPY ──────────────────────────────────────────
// Hero CTA for under-$750K visitors; secondary CTA for qualified visitors
// who didn't bite on the Intensive.
// Source: valorcopyreviewv3 — Part Three.

module.exports = { CONSTRAINTS, STRATEGIC_INTENSIVE_COPY, resolveConstraint, getRevenueTier };
