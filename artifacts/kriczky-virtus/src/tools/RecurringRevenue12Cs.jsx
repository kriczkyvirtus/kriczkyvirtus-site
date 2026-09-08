import React, { useState, useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════════════════════
// THE 12 C'S OF RECURRING REVENUE — INTERACTIVE ROADMAP
// Kriczky Virtus lead magnet
// Navy & Gold design system · One C per page · Click-to-score
// Score-conditional Quick Wins · "Your First 3 Moves" page
// ═══════════════════════════════════════════════════════════════════

const C = {
  gold: "#C8A24E", goldMuted: "#A68A42", goldLight: "#D4B665",
  green: "#34D399", red: "#F87171", amber: "#FBBF24",
  amberDark: "#D4A017",
  blue: "#60A5FA", cyan: "#22D3EE", purple: "#A78BFA",
  bgDeep: "#0A0E14", bgCard: "#111720", bgElev: "#1A2130",
  text1: "#E8ECF1", text2: "#8B95A5", text3: "#5A6474", text4: "#3D4654",
  border1: "rgba(255,255,255,0.06)", border2: "rgba(255,255,255,0.10)",
};

const scoreColor = (n) => {
  if (!n || n <= 0) return C.text4;
  if (n <= 2) return C.red;
  if (n === 3) return C.amber;
  if (n === 4) return C.amberDark;
  if (n === 5) return C.cyan;
  return C.green;
};

const scoreTier = (n) => n <= 2 ? "low" : n <= 4 ? "mid" : "high";

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

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

const HEADSHOT = "data:image/jpeg;base64,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";

// ─── 12 C's DATA WITH QUICK WINS ─────────────────────────────
const SECTIONS = [
  {
    key: "consumption", number: "01", title: "Consumption",
    subtitle: "Are they using what they're paying for?",
    description: "The foundation of stickiness. If people actively consume your product or service, they keep paying. Netflix doesn't need contracts — consumption is the contract. Spotify doesn't lock you in — the music does. Coca-Cola doesn't have a loyalty program or a subscription — they've simply made a product so deeply embedded in daily life that billions of people consume it reflexively. The deeper someone integrates your offering into their life or workflow, the stickier the revenue.",
    items: [
      { text: "Our onboarding experience actively drives first use within 48 hours", sub: "Do new customers actually start using the product, or does it sit unopened?" },
      { text: "We measure and track consumption metrics (usage frequency, depth of engagement)", sub: "You can't improve what you don't measure." },
      { text: "We have systems to re-engage customers whose consumption has dropped", sub: "A win-back campaign for declining usage is cheaper than acquiring a replacement." },
      { text: "Our product or service is designed to be habitually consumed", sub: "Think: daily, weekly, or monthly touchpoints that become part of the routine." },
    ],
    lowLabel: "No one uses it", highLabel: "They can't stop",
    quickWins: {
      low: [
        { title: "Map your top 20 clients' actual usage this week", context: "Pull login, purchase, or engagement data for your highest-value accounts — if more than 30% haven't engaged in 60+ days, you have a consumption crisis hiding behind revenue numbers." },
        { title: "Call your 5 least-active paying customers and ask one question: 'What stopped you?'", context: "The answers will tell you whether it's an onboarding failure, a product gap, or a priority shift — each requires a different fix." },
        { title: "Build a 3-email onboarding sequence that triggers within 24 hours of purchase", context: "Most consumption problems start at onboarding — if they don't use it in the first week, they probably never will." },
      ],
      mid: [
        { title: "Set up a weekly 'engagement health' dashboard for your top accounts", context: "Track usage frequency, feature adoption, and time-since-last-login — intervene when the trend line drops, not when they cancel." },
        { title: "Add one habit-forming touchpoint between billing cycles", context: "A weekly insight email, a monthly check-in call, or a usage milestone notification — anything that brings them back before the next invoice." },
        { title: "Run a 'power user' interview with your 3 most-engaged customers", context: "Find out exactly what they do differently — then design your onboarding to replicate those behaviors for everyone else." },
      ],
      high: [
        { title: "Build a referral program that rewards consumption behavior, not just sign-ups", context: "Reward clients who complete key actions, not just those who refer — this deepens engagement while expanding your base." },
        { title: "Create a 'consumption leaderboard' or progress tracker visible to customers", context: "Gamification works because it turns usage into identity — people who see their progress are less likely to quit." },
      ],
    },
  },
  {
    key: "collateral", number: "02", title: "Collateral",
    subtitle: "Are you holding something they can't leave behind?",
    description: "Storage units hold your physical stuff. Dropbox holds your digital files. A CRM holds your entire customer database. In each case, the provider holds something valuable that the customer can't easily walk away from. The more 'hostage value' you create — physical or digital — the stickier the relationship.",
    items: [
      { text: "We store or manage customer data, assets, or content they depend on", sub: "Files, contacts, history, configurations, credentials, or physical goods." },
      { text: "Leaving our service would mean losing access to accumulated value", sub: "Years of data, customizations, or stored assets create natural inertia." },
      { text: "We actively increase the collateral over time (more stored, more integrated)", sub: "Every month, the switching cost grows because there's more to lose." },
    ],
    lowLabel: "Nothing held", highLabel: "Deeply embedded",
    quickWins: {
      low: [
        { title: "Identify one piece of customer data you could start storing that they'd hate to lose", context: "Historical performance records, saved preferences, transaction history — start accumulating something that grows more valuable over time." },
        { title: "Create a 'client vault' — a dedicated space where you store their key documents and assets", context: "Even a shared Google Drive folder counts — the point is they start thinking of you as the keeper of something important." },
        { title: "Add an export friction assessment: how easy is it for a customer to leave with everything?", context: "If they can export 100% of their value in one click, you have zero collateral — find what you can make stickier." },
      ],
      mid: [
        { title: "Build a quarterly 'accumulated value report' showing clients what they've built with you", context: "Remind them of the historical data, configurations, and institutional knowledge that now lives in your system — make the invisible visible." },
        { title: "Integrate with one more system your client uses so your data becomes more interconnected", context: "Each integration adds another thread — the more systems you touch, the harder it is to rip you out." },
        { title: "Start tracking and surfacing insights from historical client data you already have", context: "Year-over-year comparisons, trend analysis, benchmarks — turn stored data into delivered value so they see the compounding benefit." },
      ],
      high: [
        { title: "Audit your collateral for single points of failure — is any of it easily replicable?", context: "If a competitor could rebuild the same data in 30 days, it's not real collateral — find the truly irreplaceable elements and double down." },
        { title: "Create a 'migration cost calculator' that honestly shows what switching would require", context: "When done transparently, this builds trust while reinforcing the true cost of leaving — they appreciate the honesty and stay anyway." },
      ],
    },
  },
  {
    key: "switching", number: "03", title: "Cost of Switching",
    subtitle: "How painful is it to leave?",
    description: "Switching costs come in three forms: time (how long it takes to move), money (hard costs of migration), and psychology (sunk cost fallacy). If someone invests $5,000 upfront before a $100/month continuity, they are dramatically less likely to cancel than someone who simply signed up for $100/month with no initial investment. A meaningful upfront commitment changes the entire psychology of cancellation.",
    items: [
      { text: "We have an upfront investment (setup fee, onboarding cost, or initial engagement) that creates sunk cost", sub: "A meaningful upfront commitment changes the psychology of cancellation." },
      { text: "Switching to a competitor would require significant time or effort", sub: "Data migration, team retraining, workflow reconfiguration, re-establishing relationships." },
      { text: "We have built accumulated customization that would be lost on switching", sub: "Custom configurations, templates, integrations, and historical context." },
      { text: "Our pricing or packaging structure discourages month-to-month churn", sub: "Annual plans, milestone-based packaging, or graduated commitment tiers." },
    ],
    lowLabel: "Easy to leave", highLabel: "Deeply entrenched",
    quickWins: {
      low: [
        { title: "Add a meaningful onboarding investment before the recurring begins", context: "A setup fee, strategy session, or initial audit creates sunk cost — people who invest $2K upfront before a $500/mo subscription almost never cancel in month 2." },
        { title: "Map the actual switching cost for a client leaving you today — then increase it", context: "If a client could fully migrate to a competitor in a weekend, your switching cost is near zero — add one layer of depth this week." },
        { title: "Introduce a custom configuration or setup during onboarding that would need to be rebuilt elsewhere", context: "Custom templates, personalized dashboards, calibrated settings — anything that took real time to build and can't be ported." },
      ],
      mid: [
        { title: "Restructure month-to-month offers into 6-month packages at the same rate", context: "Same price, framed differently — '$3K/month' becomes 'a $18K engagement with 6 payments' and retention jumps 30–50%." },
        { title: "Add one integration with a system your client uses daily", context: "Every integration is a thread — connecting to their CRM, their accounting software, or their project management tool makes you harder to remove." },
        { title: "Create a 'what you'd lose' summary that's visible inside the cancellation flow", context: "Not guilt-tripping — just honest: 14 months of data, 3 custom reports, 2 integrations, and your dedicated account manager." },
      ],
      high: [
        { title: "Benchmark your switching costs against your top competitor — find the gap they could close", context: "Complacency is the enemy of moats — if a competitor is making migration easier, you need to know before your clients do." },
        { title: "Invest in a 'switching cost audit' across your full client base to identify vulnerable accounts", context: "Some clients have deep switching costs, others could leave tomorrow — know which is which and shore up the weak spots." },
      ],
    },
  },
  {
    key: "choice", number: "04", title: "Choice",
    subtitle: "How few alternatives do they have?",
    description: "Patents, trade secrets, unique skill combinations, and extreme specialization all reduce the alternatives a customer has. This is the competitive moat Warren Buffett talks about. Niching down is so powerful precisely because the narrower you go, the fewer alternatives exist. If you're the only person who does what you do for who you do it — you have maximum stickiness.",
    items: [
      { text: "We have a unique methodology, process, or trade secret competitors can't replicate", sub: "Proprietary frameworks, patented technology, or specialized workflows." },
      { text: "We serve a specific enough niche that direct alternatives are scarce", sub: "The narrower the niche, the fewer the choices. Fewer choices = stickier revenue." },
      { text: "Our combination of skills, tools, and experience creates a differentiation that's hard to match", sub: "It's not one thing — it's the unique intersection of several things." },
      { text: "We continuously invest in widening our competitive moat", sub: "R&D, certifications, exclusive partnerships, proprietary data, or IP development." },
    ],
    lowLabel: "Many alternatives", highLabel: "We're the only option",
    quickWins: {
      low: [
        { title: "Name the one thing you do that no competitor combines the same way", context: "If you can't articulate your unique combination in one sentence, your clients can't either — and that means they're comparison-shopping on price." },
        { title: "Niche down your positioning for one specific audience segment this month", context: "You don't have to change what you do — just change who you say you do it for. 'CFO services for SaaS companies under $10M' has fewer competitors than 'CFO services.'" },
        { title: "Document your process into a named methodology with distinct steps", context: "A named framework ('The 4-Phase Growth Audit') feels proprietary even if the underlying work is standard — naming it makes it feel exclusive." },
      ],
      mid: [
        { title: "Pursue one certification, partnership, or credential that competitors don't have", context: "A certification doesn't just add credibility — it reduces the number of people who can claim to do what you do." },
        { title: "Create a proprietary dataset or benchmark from your client work", context: "If you've served 50+ clients, you have data no one else has — 'Based on our work with 73 companies in your space' is a moat." },
        { title: "Audit your competitor landscape quarterly — who's closing the gap on your differentiation?", context: "Differentiation degrades over time unless you actively maintain it — what was unique 2 years ago may be table stakes now." },
      ],
      high: [
        { title: "File for any trademarks, copyrights, or protectable IP you haven't yet secured", context: "Named frameworks, proprietary tools, and original content are protectable — secure them before someone else does." },
        { title: "Build an 'only we can do this' case study library with specific, named results", context: "Third-party proof of irreplaceable value is the strongest moat — let your clients' results speak for your differentiation." },
      ],
    },
  },
  {
    key: "control", number: "05", title: "Control of Payments",
    subtitle: "How frictionless is the payment?",
    description: "The less visible and more automatic the payment, the stickier it is. Uber takes their fee before paying drivers. Employers withhold taxes before employees see their paycheck. Stripe processes billions by embedding itself invisibly into the payment layer — merchants don't cut Stripe a check each month, the fee simply disappears from each transaction before the merchant ever touches the funds. This isn't about hiding charges — it's about reducing the psychological friction of each payment event.",
    items: [
      { text: "Our payment collection is automatic (auto-debit, pre-authorized, or deducted at source)", sub: "Every manual payment is a decision point. Automatic payments remove the decision." },
      { text: "Our fees are structured to feel proportional rather than absolute", sub: "Percentage-based or embedded fees feel different than a flat monthly invoice." },
      { text: "We get paid before or simultaneous with value delivery, not after", sub: "Prepaid models and pay-at-booking create different psychology than invoicing after the fact." },
      { text: "Our billing aligns with how the customer experiences their desired result", sub: "A B2B SaaS product billing per seat charges for inputs; billing per customer served or account managed charges for outcomes. The closer your billing mirrors the value received, the less friction each payment creates." },
    ],
    lowLabel: "Painful invoicing", highLabel: "Invisible and automatic",
    quickWins: {
      low: [
        { title: "Move every client to auto-debit or pre-authorized payment this month", context: "Every manual invoice is a cancellation decision point — auto-pay removes the decision entirely and can cut churn by 20–40%." },
        { title: "Switch from post-delivery invoicing to prepaid or pay-at-booking", context: "If you deliver value and then send an invoice, you're asking clients to pay for something they already have — flip the sequence." },
        { title: "Eliminate paper invoicing and move to automatic digital billing with card-on-file", context: "Paper invoices average 30+ days to collect. Card-on-file averages zero days. The switch alone improves your cash position." },
      ],
      mid: [
        { title: "Test a percentage-based or value-based fee structure on your next 5 clients", context: "A flat $5K/month feels expensive. 2% of revenue feels proportional — even if it's the same number. Perception drives retention." },
        { title: "Align your billing cycle to your client's value perception cycle", context: "If they feel value weekly, bill monthly. If value is quarterly, bill annually. Mismatched cycles create payment friction." },
        { title: "Add a 'fee summary' to your invoices that shows the cost relative to the value delivered", context: "'Your $3K investment generated $47K in new revenue this month' — context turns a cost into an investment." },
      ],
      high: [
        { title: "Explore embedded fee models where your revenue is deducted before the client sees their money", context: "Marketplace-style revenue splits, managed account fee structures, or automatic percentage deductions — the gold standard of invisible billing." },
        { title: "Audit your billing for 'friction peaks' — months where cancellations spike relative to charges", context: "Seasonal patterns, annual renewal dates, or price-increase months reveal where payment friction concentrates." },
      ],
    },
  },
  {
    key: "customization", number: "06", title: "Customization",
    subtitle: "Does the experience get more personal over time?",
    description: "Spotify's Discover Weekly gets better the more you listen. A financial advisor who knows your family situation, tax picture, and long-term goals becomes more valuable every quarter. Amazon's recommendation engine learns your preferences with every purchase. The more your product or service adapts to the individual, the harder it is for a generic competitor to replicate that experience. Customization turns time into an asset — every interaction makes the next one more valuable.",
    items: [
      { text: "Our product or service becomes more tailored to each customer the longer they stay", sub: "Personalized recommendations, learned preferences, adapted workflows, or accumulated context." },
      { text: "A new customer starting fresh with a competitor would lose months or years of personalization", sub: "The customization gap between staying and switching grows over time." },
      { text: "We actively use customer data and history to improve their individual experience", sub: "Not just storing data — applying it to make each interaction more relevant." },
      { text: "Customers notice and value that we 'know them' better than alternatives would", sub: "They can feel the difference between personalized service and generic service." },
    ],
    lowLabel: "One-size-fits-all", highLabel: "Deeply personalized",
    quickWins: {
      low: [
        { title: "Create a 'client context file' for each of your top 10 accounts this week", context: "Document their goals, preferences, team members, communication style, and history — start building the institutional knowledge that makes you irreplaceable." },
        { title: "Add one personalization touchpoint to your delivery process", context: "Reference a past conversation, tailor a recommendation to their industry, or adjust your approach based on their learning style — small signals of 'I know you.'" },
        { title: "Ask each client: 'How would you like us to work together differently?'", context: "The question itself signals customization intent — and the answers give you a personalization roadmap you can implement immediately." },
      ],
      mid: [
        { title: "Build a 'client history timeline' visible to your team for every account", context: "Every interaction, decision, preference, and milestone in one place — so anyone on your team can serve the client as if they've been there from day one." },
        { title: "Deliver one insight per quarter that could only come from knowing their specific situation", context: "'Based on the 18 months of data we have on your business, here's what I see' — this is the moment they realize no competitor could replicate you." },
        { title: "Automate the capture of client preferences so personalization scales beyond your memory", context: "CRM tags, preference surveys, interaction logging — your ability to personalize shouldn't depend on one person's memory." },
      ],
      high: [
        { title: "Quantify the personalization gap: how many months would it take a competitor to match your context on a client?", context: "If the answer is '6+ months,' that's your moat — make sure your clients know it too." },
        { title: "Create a 'personalization roadmap' that shows clients how their experience will continue improving", context: "Set expectations for compounding value — 'By month 12, here's how different your experience will be from month 1.'" },
      ],
    },
  },
  {
    key: "compounding", number: "07", title: "Compounding Value",
    subtitle: "Does the product become more valuable over time?",
    description: "LinkedIn becomes more valuable as your network grows. An airline loyalty program with tiered status makes every flight worth more than the last. A CPA who has handled your taxes for ten years has institutional knowledge no new CPA could replicate in year one. Compounding value means the longer someone stays, the more they have to lose — not because you're holding something hostage, but because the value trajectory is genuinely increasing. The product at month 36 is objectively better than the product at month one.",
    items: [
      { text: "Our offering becomes measurably more valuable to customers the longer they use it", sub: "Network effects, accumulated data, status tiers, institutional knowledge, or expanded access." },
      { text: "Customers who have been with us longer receive a meaningfully different (better) experience", sub: "Tenure should translate into tangible advantages, not just familiarity." },
      { text: "We can articulate exactly why our product at month 12 is better than at month 1", sub: "If you can't explain the compounding value, your customers probably can't feel it either." },
      { text: "The value gap between staying and starting over with a competitor widens each year", sub: "This is the compounding effect — not just retention, but increasing switching cost through increasing value." },
    ],
    lowLabel: "Flat value curve", highLabel: "Accelerating value",
    quickWins: {
      low: [
        { title: "Design one 'tenure benefit' that long-term clients get and new clients don't", context: "Priority access, expanded scope, lower rates, dedicated support — give staying a tangible reward that grows with time." },
        { title: "Create a '1-year anniversary' milestone that delivers unexpected value", context: "A free strategic review, a bonus report, or access to a premium feature — mark the moment and make them feel the compounding." },
        { title: "Start tracking a metric that improves over time specifically because of your involvement", context: "Revenue growth, cost reduction, efficiency gains, NPS improvements — if you can show a trend line, you can prove compounding value." },
      ],
      mid: [
        { title: "Build a 'value trajectory' report that shows clients their improvement curve over time", context: "Month 1 vs. month 6 vs. month 12 — visual evidence that staying with you delivers accelerating returns." },
        { title: "Introduce tiered access or status levels based on client tenure", context: "Loyalty tiers aren't just for airlines — 'Gold clients get first access to new services' creates an incentive to stay that compounds." },
        { title: "Add one feature or service expansion that unlocks only after 6+ months", context: "Gated progression signals that the best is yet to come — and leaving means losing access to the next tier." },
      ],
      high: [
        { title: "Benchmark your compounding value against competitors: can they match your year-3 experience in year 1?", context: "If yes, your compounding advantage isn't real — if no, make sure every client knows the gap." },
        { title: "Document and share 'compounding case studies' — clients whose value accelerated dramatically over time", context: "The best proof of compounding value is a real story: 'Client X's results in year 3 were 4x their year 1 results.'" },
      ],
    },
  },
  {
    key: "coordination", number: "08", title: "Coordination",
    subtitle: "Are you the hub through which everything flows?",
    description: "A family office is so appealing to very wealthy people because it's a one-stop-shop — tax, retirement, public and private market investments, real estate, due diligence, insurance — all coordinated through a single trusted relationship. An executive assistant becomes indispensable not because of any single task but because they coordinate across multiple parties and take complexity off someone's plate. The more services you orchestrate on an ongoing basis, the more irreplaceable you become. This is especially powerful as the average net-worth of your target customer increases — the wealthier the prospect, the more they value coordination and convenience. The key word is ongoing: a general contractor coordinates dozens of subcontractors, but once the house is built, the homeowner moves in and stops paying. That's project coordination, not recurring coordination. The stickiest version of this is when the people you coordinate stay in the client's life permanently — their tax advisor, their investment manager, their insurance broker — and you're the hub that makes them all work together.",
    items: [
      { text: "We coordinate or integrate multiple services or functions for our customers on an ongoing basis", sub: "The coordination must be recurring, not project-based. If it ends when the deliverable ships, it's not a stickiness driver." },
      { text: "Replacing us would mean the customer has to separately manage multiple vendors", sub: "The coordination layer itself is valuable — it's not just about the individual services." },
      { text: "We proactively identify opportunities across the services we coordinate", sub: "A tax insight that informs an investment decision, a design change that improves conversion — cross-domain value." },
      { text: "Our customers view us as the 'one call' that handles or delegates everything", sub: "The ultimate test: when something comes up, do they call you first — even if it's outside your core service?" },
    ],
    lowLabel: "Single service", highLabel: "Indispensable hub",
    quickWins: {
      low: [
        { title: "List every vendor, advisor, or service provider your clients work with alongside you", context: "Find the 2–3 providers whose work overlaps or connects with yours — those are your coordination opportunities." },
        { title: "Offer to host a quarterly 'alignment call' with your client and their other key advisors", context: "You don't have to provide the other services — just be the one who makes sure everyone's working from the same playbook." },
        { title: "Add one complementary service referral to your delivery — even if it's not your service", context: "Recommending a great accountant, attorney, or marketing partner positions you as the hub before you formally become one." },
      ],
      mid: [
        { title: "Formalize one recurring coordination workflow between your service and an adjacent provider", context: "Monthly sync with their accountant, quarterly review with their marketing team — build a cadence that depends on you as the connector." },
        { title: "Create a 'client ecosystem map' showing all the providers you coordinate with for each client", context: "Visualizing the web makes the coordination layer tangible — and makes it obvious how much would break if you left." },
        { title: "Proactively deliver one cross-domain insight this quarter that no single provider could have seen alone", context: "'Your tax position this year means we should adjust your growth investment timeline' — this is the value only a coordinator can deliver." },
      ],
      high: [
        { title: "Build a formal 'coordination as a service' tier into your offering", context: "If you're already the hub, name it, price it, and sell it — the coordination layer itself has standalone value." },
        { title: "Audit for coordination gaps: are there providers in your client's ecosystem you're not yet connected to?", context: "Every uncoordinated provider is a missed opportunity — and a risk that someone else becomes the hub instead." },
      ],
    },
  },
  {
    key: "cadence", number: "09", title: "Cadence",
    subtitle: "How often do they engage between payments?",
    description: "A gym that bills monthly but you visit daily is stickier than one you visit monthly. A SaaS tool you open every morning is harder to cancel than one you log into quarterly. Cadence is the structural rhythm of engagement — how many touchpoints exist between billing cycles. The more frequently a customer interacts with your business, the more embedded it becomes in their routine. A monthly subscription with weekly check-ins, daily usage, or quarterly strategy reviews creates multiple reinforcement points that make cancellation feel like disrupting a rhythm, not just stopping a payment.",
    items: [
      { text: "Customers interact with our business more frequently than they are billed", sub: "If you bill monthly and they engage weekly or daily, each billing cycle feels effortless." },
      { text: "We have structured touchpoints (check-ins, reviews, updates) built into the engagement", sub: "Scheduled cadence creates expectation and habit — unstructured contact fades." },
      { text: "The rhythm of engagement reinforces the value before each billing event", sub: "By the time the charge hits, they've already experienced value multiple times." },
      { text: "Canceling would mean disrupting an established routine, not just stopping a payment", sub: "The stickiest businesses become part of the operating rhythm of someone's life or business." },
    ],
    lowLabel: "Bill and disappear", highLabel: "Embedded in their rhythm",
    quickWins: {
      low: [
        { title: "Add one structured touchpoint between billing cycles starting this week", context: "A weekly email update, a bi-weekly check-in call, or a monthly review — anything that creates engagement between payments." },
        { title: "Schedule a recurring calendar event with each of your top 10 clients", context: "A standing monthly call or quarterly review that's already on their calendar creates cadence they'll feel if it disappears." },
        { title: "Send a 'value delivered' summary 3 days before each billing cycle", context: "Timing matters — reminding them of what they received right before the charge hits makes the payment feel earned, not extracted." },
      ],
      mid: [
        { title: "Map your engagement cadence: how many touchpoints happen between each billing event?", context: "If you bill monthly and only interact once, you have a cadence of 1 — aim for 4+ touchpoints per billing cycle." },
        { title: "Create a 'cadence calendar' template that structures every client's engagement rhythm", context: "Week 1: check-in. Week 2: report delivery. Week 3: strategy note. Week 4: billing. Repeatable cadence is scalable cadence." },
        { title: "Introduce a lightweight asynchronous touchpoint (Slack channel, weekly digest, micro-update)", context: "Not every touchpoint needs a meeting — a 2-minute Loom video or a quick Slack message counts as engagement." },
      ],
      high: [
        { title: "Test increasing your cadence by 50% for one cohort and measure the impact on retention", context: "If going from 4 touchpoints to 6 per month reduces churn by even 10%, the extra effort pays for itself many times over." },
        { title: "Build cadence variety — mix meeting types, communication channels, and content formats", context: "Same touchpoint every time creates monotony. Variety within structure keeps the rhythm fresh and engagement high." },
      ],
    },
  },
  {
    key: "cause", number: "10", title: "Cause",
    subtitle: "Do they believe in what you stand for?",
    description: "Patagonia customers pay premium prices and stay loyal for decades — not because the fleece is that different, but because they identify with the company's environmental mission. Costco members renew at 93% because the brand's relentless commitment to value feels like a pact, not a transaction. When customers associate their identity with your cause, they don't pay because of what they get — they pay because of who they are.",
    items: [
      { text: "Our brand stands for something bigger than the product or service we sell", sub: "A clear mission, values, or worldview that customers can identify with." },
      { text: "Customers who buy from us feel like they're participating in a movement", sub: "They're not just purchasing — they're making a statement about who they are." },
      { text: "We actively communicate our cause across marketing, content, and customer touchpoints", sub: "The cause isn't a footnote — it's central to the brand story." },
      { text: "Our team and culture authentically embody the cause (it's not performative)", sub: "Customers can tell the difference between a real mission and a marketing angle." },
    ],
    lowLabel: "Purely transactional", highLabel: "Identity-driven loyalty",
    quickWins: {
      low: [
        { title: "Write a one-paragraph 'What We Stand For' statement and put it on your website this week", context: "You don't need a polished manifesto — start with an honest answer to 'Why do we do this beyond the money?' and publish it." },
        { title: "Share one belief about your industry publicly — even if it's controversial", context: "Causes are forged in conviction, not consensus. Taking a stand on how things should be done attracts people who believe the same thing." },
        { title: "Ask your best clients: 'Why did you choose us over the alternatives?'", context: "If the answer is always price or convenience, you have no cause yet. If even one client says 'because I believe in what you're doing,' build on that." },
      ],
      mid: [
        { title: "Integrate your cause into your delivery — not just your marketing", context: "If your cause is 'helping owners build businesses that outlast them,' every deliverable should reinforce that through language, framing, and priorities." },
        { title: "Create a recurring content series that teaches from your worldview", context: "A weekly email, monthly video, or quarterly report that consistently reflects your values — repetition builds identity association." },
        { title: "Hire and partner based on cause alignment, not just skill", context: "Every team member and partner who embodies the cause strengthens it — every one who doesn't dilutes it." },
      ],
      high: [
        { title: "Measure cause resonance: survey your clients on whether they feel aligned with your mission", context: "If 80%+ say yes, your cause is working. If not, the gap between your stated values and your clients' perception is a strategic risk." },
        { title: "Build a 'cause-first' acquisition channel — attract clients specifically through your values", context: "Content marketing, speaking, and community built around what you believe — not what you sell — attracts the stickiest clients." },
      ],
    },
  },
  {
    key: "community", number: "11", title: "Community",
    subtitle: "Would leaving mean losing their people?",
    description: "Community and cause are related but distinct. Cause is about identity with an idea. Community is about identity with a group of people. When someone feels they belong to a community, canceling doesn't just mean losing a service — it means leaving their people. The stickier the community bonds, the harder it is to walk away.",
    items: [
      { text: "Our customers interact with each other, not just with us", sub: "Peer-to-peer connections, forums, events, mastermind groups, or shared workspaces." },
      { text: "Members have formed meaningful relationships through our community", sub: "Friendships, partnerships, referral networks, or accountability relationships." },
      { text: "We facilitate multiple types of community engagement (events, content, collaboration)", sub: "The more ways people connect, the more threads hold them in." },
      { text: "Leaving our business would mean leaving a community, not just canceling a subscription", sub: "This is the ultimate test: would they feel a social loss, not just a product loss?" },
    ],
    lowLabel: "No community", highLabel: "Deeply bonded tribe",
    quickWins: {
      low: [
        { title: "Introduce two clients who would benefit from knowing each other this week", context: "Community starts with one connection — you don't need a platform, a Slack group, or a forum. You need two people who should meet." },
        { title: "Host one small group call or dinner with 4–6 of your best clients", context: "The bar for 'community' is lower than you think — a casual gathering where clients realize they're not alone creates instant bonding." },
        { title: "Create a shared Slack channel, WhatsApp group, or LinkedIn group for your clients", context: "Low friction, high visibility. Even if it's quiet at first, it signals 'you belong to something' — which is the foundation of community." },
      ],
      mid: [
        { title: "Facilitate one peer-to-peer collaboration between clients (not mediated by you)", context: "When clients help each other without you in the middle, the community becomes self-sustaining — that's when it gets truly sticky." },
        { title: "Add a community component to your onboarding: introduce new clients to the group immediately", context: "The faster someone makes a connection, the faster they feel belonging — don't wait months to invite them in." },
        { title: "Create a recurring community event with a consistent cadence (monthly roundtable, quarterly dinner)", context: "Regularity builds expectation and habit — sporadic events feel optional, recurring ones feel like 'our thing.'" },
      ],
      high: [
        { title: "Measure community health: how many member-to-member connections exist independent of you?", context: "If the community collapses when you stop facilitating, it's not a real community yet — the goal is self-sustaining bonds." },
        { title: "Give community members roles, responsibilities, or titles that deepen their identity stake", context: "Advisory board members, community ambassadors, content contributors — roles turn participants into stakeholders." },
      ],
    },
  },
  {
    key: "contracts", number: "12", title: "Contracts",
    subtitle: "Have they committed to a defined period?",
    description: "A $2,000/month service sold as month-to-month might average 4 months of stick. The same service sold as a $12,000 six-month engagement — six payments of $2,000 — will almost certainly get you those extra two months. People are more consistent with commitments they've explicitly made. You can further strengthen contracts by collateralizing them (credit implications, deposits, or milestone-based structures).",
    items: [
      { text: "We offer term-based packaging (6-month, 12-month) rather than only month-to-month", sub: "Positioning as a '$12K program with 6 payments' vs '$2K/month' changes the psychology entirely." },
      { text: "Our contracts have enforceable terms (credit impact, deposit, or penalty clauses)", sub: "Not to be punitive — but to match the commitment level of serious customers." },
      { text: "We sell to creditworthy buyers who can honor their commitments", sub: "Selling to higher-quality prospects increases the enforceability of any agreement." },
      { text: "Our agreements transition to month-to-month after the initial term (capturing extended LTV)", sub: "The initial term gets them through the commitment — momentum keeps them after." },
    ],
    lowLabel: "No commitment", highLabel: "Fully contracted",
    quickWins: {
      low: [
        { title: "Reframe your next 5 proposals as term-based engagements, not month-to-month retainers", context: "'A $24K, 6-month engagement with monthly payments of $4K' converts differently than '$4K/month, cancel anytime' — even if the math is identical." },
        { title: "Add a setup fee or onboarding investment to your next new client", context: "Even a modest upfront commitment ($500–$2,000) anchors the relationship and signals that this is a serious engagement, not a trial." },
        { title: "Require a signed agreement with a minimum term for all new clients starting this month", context: "If you're currently operating on handshakes or month-to-month invoices, a simple 6-month agreement will immediately extend your average client lifetime." },
      ],
      mid: [
        { title: "Add an auto-renewal clause that transitions to month-to-month after the initial term", context: "The initial commitment gets them past the 'should I stay?' window — momentum and habit carry them after, often for years." },
        { title: "Introduce milestone-based contract structures that align payment with value delivery", context: "Pay at kickoff, pay at midpoint review, pay at final delivery — milestones make large commitments feel structured, not scary." },
        { title: "Offer a discount for annual commitment vs. month-to-month (even 10% creates incentive)", context: "The discount costs you less than the churn it prevents — a client who commits annually is worth more than a client who 'might' stay." },
      ],
      high: [
        { title: "Analyze your contract-to-month-to-month conversion rate: how many stay after the initial term?", context: "If it's under 70%, the initial term is doing the heavy lifting and your ongoing value needs strengthening — the contract is masking a retention problem." },
        { title: "Test longer initial terms (12-month vs 6-month) on your next cohort of new clients", context: "If your service genuinely compounds in value, a longer initial commitment gives that compounding time to prove itself." },
      ],
    },
  },
];


/* Read UTMs from the URL at submit time. The other tools rely on a handler-side
   Referer fallback that is scoped to reinvest-harvest, so this tool has to carry
   its own. No navigation happens between landing and submitting, so the query
   string is still intact when the capture bar is used. */
const readUtms = () => {
  try {
    const q = new URLSearchParams(window.location.search);
    return {
      utmSource: q.get("utm_source") || "",
      utmCampaign: q.get("utm_campaign") || "",
    };
  } catch (e) {
    return { utmSource: "", utmCampaign: "" };
  }
};

const MAX_SCORE = SECTIONS.length * 6; // 72

const BANDS = [
  { min: 12, max: 27, label: "Leaky Bucket", color: C.red, desc: "Revenue leaves as fast as it comes in. Start with the two lowest scores." },
  { min: 28, max: 42, label: "Holding On", color: C.amber, desc: "Some stickiness, but competitors and inertia erode it. Significant upside available." },
  { min: 43, max: 57, label: "Building Momentum", color: C.cyan, desc: "Strong recurring foundations. Opportunity to steadily grow profits." },
  { min: 58, max: 72, label: "Revenue Fortress", color: C.green, desc: "Deeply sticky revenue. Protect what you've built and invest in moat expansion." },
];

// ─── PAGE SHELL ──────────────────────────────────────────────
const Page = ({ children, pageNum, totalPages }) => (
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
      <span><b style={{ color: C.gold, fontWeight: 600 }}>The 12 C's</b> — Recurring Revenue Roadmap</span>
    </div>
    <div style={{ position: "absolute", top: "0.68in", left: "0.65in", right: "0.65in", height: 0.5, background: "linear-gradient(90deg, transparent, #C8A24E40, transparent)", zIndex: 5 }}/>
    <div style={{ padding: "0.85in 0.6in 0.75in", position: "relative", zIndex: 3 }}>{children}</div>
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 0.6in 0.4in", display: "flex", justifyContent: "space-between", alignItems: "baseline", color: C.text3, zIndex: 5 }}>
      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase" }}><b style={{ color: C.gold, fontWeight: 600 }}>Kriczky</b> Virtus</span>
      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 13, color: C.text2 }}>{pageNum} <span style={{ color: C.text4 }}>/</span> {totalPages}</span>
    </div>
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, #C8A24E20, #C8A24E40, #C8A24E20, transparent)" }}/>
  </div>
);

// ─── CHECKLIST ITEM ──────────────────────────────────────────
const CheckItem = ({ text, sub, checked, onToggle }) => (
  <div style={{ display: "flex", gap: 12, padding: "8px 0", cursor: "pointer", userSelect: "none", alignItems: "center" }} onClick={onToggle}>
    <svg width="14" height="14" viewBox="0 0 14 14" style={{ flexShrink: 0 }}>
      <rect x="0.5" y="0.5" width="13" height="13" rx="2.5" fill={checked ? `${C.gold}20` : "rgba(200,162,78,0.04)"} stroke={checked ? C.gold : `${C.gold}40`} strokeWidth="1.5"/>
      {checked && <path d="M3.5 7L5.75 9.25L10.5 4.5" stroke={C.gold} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>}
    </svg>
    <div style={{ flex: 1 }}>
      <span style={{ fontSize: 12, color: checked ? C.text1 : C.text2, lineHeight: 1.5, transition: "color 0.2s" }}>{text}</span>
      {sub && <span style={{ display: "block", fontSize: 10.5, color: C.text3, lineHeight: 1.5, marginTop: 3 }}>{sub}</span>}
    </div>
  </div>
);

// ─── SCORE SELECTOR ──────────────────────────────────────────
const ScoreSelector = ({ value, onChange, lowLabel, highLabel }) => {
  const activeColor = value ? scoreColor(value) : C.gold;
  return (
    <div style={{ padding: "20px 24px", borderRadius: 12, marginTop: 16, background: value ? `linear-gradient(145deg, ${activeColor}08, ${activeColor}03)` : "linear-gradient(145deg, rgba(200,162,78,0.06), rgba(200,162,78,0.02))", border: `1.5px solid ${value ? `${activeColor}50` : `${C.gold}30`}`, boxShadow: value ? `0 0 20px ${activeColor}15, inset 0 1px 0 ${activeColor}15` : "none", transition: "all 0.3s ease" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: value ? activeColor : C.gold, letterSpacing: "0.15em", textTransform: "uppercase", transition: "color 0.3s" }}>Rate Yourself</span>
        {value && <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 700, color: activeColor, transition: "color 0.3s" }}>{value}<span style={{ fontSize: 13, color: C.text3 }}>/6</span></span>}
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        {[1,2,3,4,5,6].map(n => { const isSelected = value === n; const btnColor = scoreColor(n); return (
          <button key={n} onClick={() => onChange(n)} style={{ flex: 1, height: 44, borderRadius: 8, border: "none", cursor: "pointer", background: isSelected ? `linear-gradient(145deg, ${btnColor}30, ${btnColor}15)` : "rgba(255,255,255,0.03)", outline: isSelected ? `2px solid ${btnColor}` : `1px solid rgba(255,255,255,0.08)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 700, color: isSelected ? btnColor : C.text4, transition: "all 0.2s ease", boxShadow: isSelected ? `0 0 12px ${btnColor}20` : "none" }}>{n}</button>
        ); })}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: 9, color: C.text4, fontStyle: "italic" }}>{lowLabel}</span>
        <span style={{ fontSize: 9, color: C.text4, fontStyle: "italic" }}>{highLabel}</span>
      </div>
      {!value && <div style={{ textAlign: "center", marginTop: 10 }}><span style={{ fontSize: 9, color: `${C.gold}80`, letterSpacing: "0.08em" }}>↑ TAP A NUMBER TO SCORE THIS DIMENSION</span></div>}
    </div>
  );
};

// Glassmorphic button helper
const GlassBtn = ({ href, color, children }) => (
  <a href={href} target="_blank" rel="noopener noreferrer"
    onMouseEnter={e => { const s=e.currentTarget.style; s.background=`linear-gradient(135deg,${color}22,${color}14)`; s.borderColor=`${color}60`; s.boxShadow=`0 0 32px ${color}20,0 4px 16px rgba(0,0,0,0.25)`; const a=e.currentTarget.querySelector('[data-arrow]'); if(a){a.style.opacity='1';a.style.transform='translateX(3px)';} }}
    onMouseLeave={e => { const s=e.currentTarget.style; s.background=`linear-gradient(135deg,${color}15,${color}08)`; s.borderColor=`${color}35`; s.boxShadow=`0 0 24px ${color}12,0 4px 12px rgba(0,0,0,0.2)`; const a=e.currentTarget.querySelector('[data-arrow]'); if(a){a.style.opacity='0';a.style.transform='translateX(0)';} }}
    style={{ position:"relative", display:"block", textAlign:"center", padding:"11px 28px", borderRadius:10, background:`linear-gradient(135deg,${color}15,${color}08)`, border:`1px solid ${color}35`, color, fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:700, letterSpacing:"0.03em", textDecoration:"none", cursor:"pointer", boxShadow:`0 0 24px ${color}12,0 4px 12px rgba(0,0,0,0.2)`, transition:"all 0.25s ease" }}>
    {children}
    <svg data-arrow="" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ position:"absolute", right:16, top:"50%", marginTop:-6.5, transition:"transform 0.25s ease, opacity 0.25s ease", opacity:0 }}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
  </a>
);


// ═══════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════
export default function RecurringRevenueRoadmap() {
  const [scores, setScores] = useState({});
  const [checks, setChecks] = useState({});

  /* Email capture — appears once all 12 are scored. Deliberately two fields:
     this is a post-completion ask, and every extra field costs conversions. */
  const [capFirst, setCapFirst] = useState("");
  const [capLast, setCapLast] = useState("");
  const [capEmail, setCapEmail] = useState("");
  const [capErr, setCapErr] = useState("");
  const [capSending, setCapSending] = useState(false);
  const [capSent, setCapSent] = useState(false);
  const [capDismissed, setCapDismissed] = useState(false);
  const [snapshotting, setSnapshotting] = useState(false);
  const capOpenedRef = useRef(false);


  /* Fixed 8.5in (816px) document. On a narrow device, widen the viewport to the
     page width and scale to fit so the whole page is legible without pinching.
     Scale comes from the real device width, not a guess.
     ⚠️ Never use CSS zoom or transform:scale here — both blank the page. */
  useEffect(() => {
    const vp = document.querySelector('meta[name="viewport"]');
    if (!vp) return;
    const original = vp.getAttribute("content");
    const PAGE = 816;
    const apply = () => {
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


  const PILLS_ROW1 = ["Consumption","Collateral","Cost of Switching","Choice"];
  const PILLS_ROW2 = ["Control of Payments","Customization","Compounding Value","Coordination"];
  const PILLS_ROW3 = ["Cadence","Cause","Community","Contracts"];

  const setScore = (key, val) => setScores(prev => ({ ...prev, [key]: val }));
  const toggleCheck = (sectionKey, itemIdx) => { const k = `${sectionKey}-${itemIdx}`; setChecks(prev => ({ ...prev, [k]: !prev[k] })); };

  const totalScore = SECTIONS.reduce((sum, s) => sum + (scores[s.key] || 0), 0);
  const allScored = SECTIONS.every(s => scores[s.key]);
  const currentBand = allScored ? BANDS.find(b => totalScore >= b.min && totalScore <= b.max) : null;

  const submitCapture = async () => {
    if (capSending || capSent) return;
    if (!capFirst.trim()) { setCapErr("Please enter your first name."); return; }
    if (!capLast.trim()) { setCapErr("Please enter your last name."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(capEmail)) { setCapErr("Please enter a valid email address."); return; }
    setCapErr(""); setCapSending(true);

    const utms = readUtms();
    const payload = {
      tool: "recurring-revenue-12cs",
      utmSource: utms.utmSource,
      utmCampaign: utms.utmCampaign,
      toolName: "The 12 Cs of Recurring Revenue",
      name: `${capFirst.trim()} ${capLast.trim()}`,
      firstName: capFirst.trim(),
      lastName: capLast.trim(),
      email: capEmail.trim(),
      scores: SECTIONS.reduce((acc, sec) => ({ ...acc, [sec.key]: scores[sec.key] || 0 }), {}),
      totalScore,
      maxScore: MAX_SCORE,
      band: currentBand ? currentBand.label : "",
      summary: `${totalScore}/${MAX_SCORE} — ${currentBand ? currentBand.label : ""}`,
      timestamp: new Date().toISOString(),
    };
    console.log("[12cs] submitting:", payload.email);
    try {
      const res = await fetch("/api/lead-capture", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("status " + res.status);
      setCapSent(true);

      /* Store the static copy. Matches the pattern the other tools use: post the
         rendered document to /api/store-results, which sanitises it, stores it in
         Blob, writes the URL into Sheets and emails it.
         The capture bar is hidden first so it isn't baked into the snapshot —
         a saved report shouldn't contain a form asking for an email. */
      setSnapshotting(true);
      await new Promise(r => setTimeout(r, 60));

      /* The live viewport meta has been rewritten by the hook above to an
         initial-scale computed for THIS device. Freezing that into the stored
         copy means it opens wrong on every other device — a snapshot taken on
         desktop has no scale at all, so on a phone the 816px document opens
         zoomed in and barely zoomable.
         `width=816` with no initial-scale is device-independent: every mobile
         browser fits 816 to its own screen width and picks the scale itself. */
      const vpEl = document.querySelector('meta[name="viewport"]');
      const vpLive = vpEl ? vpEl.getAttribute("content") : null;
      if (vpEl) vpEl.setAttribute("content", "width=816");

      try {
        const snapRes = await fetch("/api/store-results", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: `${capFirst.trim()} ${capLast.trim()}`,
            email: capEmail.trim(),
            tool: "recurring-revenue-12cs",
            html: document.documentElement.outerHTML,
          }),
        });
        if (!snapRes.ok) console.warn("[12cs] snapshot store failed:", snapRes.status);
      } catch (snapErr) {
        console.warn("[12cs] snapshot store failed", snapErr);
      } finally {
        if (vpEl && vpLive) vpEl.setAttribute("content", vpLive);
        setSnapshotting(false);
      }
    } catch (e) {
      console.warn("[12cs] capture failed", e);
      setCapErr("Something went wrong. Please try again, or email ekriczky@kriczkyvirtus.com.");
    } finally {
      setCapSending(false);
    }
  };

  const scoredCount = SECTIONS.filter(s => scores[s.key]).length;
  const sortedScores = SECTIONS.filter(s => scores[s.key]).map(s => ({ ...s, score: scores[s.key] })).sort((a, b) => a.score - b.score);
  const lowestThree = sortedScores.slice(0, 3);

  const TOTAL_PAGES = 15; // cover + howto + 12 sections + scoring

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", background: C.bgDeep, padding: "24px 0", gap: 28, fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet"/>

      {/* ═══ PAGE 1 — COVER ═══ */}
      <Page pageNum={1} totalPages={TOTAL_PAGES}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", minHeight: "calc(11in - 1.6in)" }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 180, lineHeight: 1, color: "rgba(200,162,78,0.03)", position: "absolute", top: "1.2in", right: "0.2in", pointerEvents: "none", zIndex: 2 }}>12</div>
          <div style={{ marginBottom: 28 }}><Shield size={48} glow/></div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 46, lineHeight: 1.05, color: C.text1, margin: "0 0 10px", textShadow: "0 2px 20px rgba(0,0,0,0.5)", textTransform: "uppercase", letterSpacing: "0.02em" }}>
            The <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 50 }}>12</span> C's of<br/>
            <span style={{ color: C.gold, textShadow: `0 0 30px ${C.gold}30` }}>Recurring Revenue</span>
          </h1>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 400, fontStyle: "italic", color: C.text2, margin: "0 0 28px", maxWidth: 520, lineHeight: 1.35 }}>
            An interactive stickiness roadmap for business owners who want to increase enterprise value through recurring revenue streams.
          </p>
          <div style={{ width: 60, height: 1, background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`, marginBottom: 24 }}/>
          <div style={{ padding: "14px 20px", borderRadius: 8, background: "linear-gradient(135deg, rgba(200,162,78,0.06), rgba(200,162,78,0.015))", border: "1px solid rgba(200,162,78,0.2)", maxWidth: 490, textAlign: "left" }}>
            <span style={{ fontSize: 9, fontWeight: 700, color: C.gold, letterSpacing: "0.12em", textTransform: "uppercase" }}>The Core Principle</span>
            <p style={{ fontSize: 11.5, color: C.text2, lineHeight: 1.6, margin: "6px 0 0" }}>
              Recurring revenue is not binary — you either have it or you don't. It's a <b style={{ color: C.text1 }}>continuum</b>. The question isn't <i>"Am I a recurring revenue business?"</i> but rather <b style={{ color: C.text1 }}>"How recurring is my business?"</b> and <i>"What can I do to make it more recurring?"</i>
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px 10px", marginTop: 24, maxWidth: 500, width: "100%" }}>
            {[...PILLS_ROW1, ...PILLS_ROW2, ...PILLS_ROW3].map((c, i) => (
              <div key={i} style={{ height: 28, borderRadius: 6, boxSizing: "border-box", background: "rgba(200,162,78,0.04)", border: "1px solid rgba(200,162,78,0.12)", fontSize: 8, fontWeight: 600, color: C.gold, letterSpacing: "0.04em", textTransform: "uppercase", whiteSpace: "nowrap", overflow: "hidden", display: "table", width: "100%" }}>
                <span style={{ display: "table-cell", verticalAlign: "middle", textAlign: "center", padding: "0 6px" }}>{c}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 9.5, color: C.text4, marginTop: 24, maxWidth: 400, lineHeight: 1.55 }}>Score yourself 1–6 on each dimension. Your results and personalized action steps update automatically.</p>
        </div>
      </Page>

      {/* ═══ PAGE 2 — HOW TO USE ═══ */}
      <Page pageNum={2} totalPages={TOTAL_PAGES}>
        <div style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: C.gold, fontWeight: 600, marginBottom: 7 }}>How To Use This Roadmap</div>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: 30, lineHeight: 1.08, color: C.text1, margin: "0 0 8px" }}><b style={{ color: C.gold, fontWeight: 400 }}>Think in continuums, </b>not checkboxes.</h2>
        <p style={{ fontSize: 12, color: C.text2, lineHeight: 1.65, margin: "0 0 14px" }}>For each of the twelve dimensions that follow, don't ask yourself "yes or no." Instead, ask: <b style={{ color: C.text1 }}>"To what extent do I do this?"</b> The goal isn't to score perfectly on all twelve — it's to identify the one or two dimensions where a small improvement would create the biggest increase in revenue stickiness.</p>
        <p style={{ fontSize: 12, color: C.text2, lineHeight: 1.65, margin: "0 0 20px" }}>Every business, regardless of industry, has recurring revenue potential. A realtor has the lifetime value of every home their client buys and sells. An auto shop has every oil change and brake job for the life of the relationship. The bank behind every mortgage has built an entire empire on recurring revenue secured by a physical asset. The question is always: how much of that potential are you capturing?</p>
        <div style={{ padding: "16px 20px", borderRadius: 10, background: `linear-gradient(135deg, ${C.cyan}08, ${C.cyan}02)`, border: `1.5px solid ${C.cyan}30`, marginBottom: 16 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: C.cyan, letterSpacing: "0.14em", textTransform: "uppercase" }}>Why 1–6 Instead of 1–5?</span>
          <p style={{ fontSize: 11.5, color: C.text2, lineHeight: 1.6, margin: "8px 0 0" }}>Most people default to "3" on a 1–5 scale — it feels safe, average, non-committal. A 1–6 scale has <b style={{ color: C.text1 }}>no middle</b>. You have to decide: am I below the midpoint (1–3) or above it (4–6)? That small discomfort is the entire point. This roadmap is about honest self-assessment, not comfortable fence-sitting.</p>
        </div>
        <div style={{ padding: "16px 20px", borderRadius: 10, background: "linear-gradient(135deg, rgba(200,162,78,0.06), rgba(200,162,78,0.015))", border: "1px solid rgba(200,162,78,0.2)", marginBottom: 16 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: C.gold, letterSpacing: "0.14em", textTransform: "uppercase" }}>What The Top Scores Mean</span>
          <div style={{ display: "flex", gap: 14, marginTop: 10 }}>
            <div style={{ flex: 1, padding: "10px 12px", borderRadius: 8, background: `${C.cyan}08`, border: `1px solid ${C.cyan}20` }}>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 700, color: C.cyan }}>5</span>{" "}
              <span style={{ fontSize: 9, fontWeight: 700, color: C.cyan, letterSpacing: "0.08em", textTransform: "uppercase" }}>Best In Class</span>
              <div style={{ fontSize: 10.5, color: C.text2, lineHeight: 1.5, marginTop: 4 }}>You're executing at a level that competitors would struggle to match. This is a genuine competitive advantage — not just "good," but differentiated.</div>
            </div>
            <div style={{ flex: 1, padding: "10px 12px", borderRadius: 8, background: `${C.green}08`, border: `1px solid ${C.green}20` }}>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 700, color: C.green }}>6</span>{" "}
              <span style={{ fontSize: 9, fontWeight: 700, color: C.green, letterSpacing: "0.08em", textTransform: "uppercase" }}>Perfect</span>
              <div style={{ fontSize: 10.5, color: C.text2, lineHeight: 1.5, marginTop: 4 }}>There is nothing meaningful left to improve here. If you're giving yourself a 6, you should be able to explain exactly why — and most honest operators rarely will.</div>
            </div>
          </div>
        </div>
        <div style={{ padding: "14px 20px", borderRadius: 8, background: "linear-gradient(135deg, rgba(200,162,78,0.06), rgba(200,162,78,0.015))", border: "1px solid rgba(200,162,78,0.2)" }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: C.gold, letterSpacing: "0.12em", textTransform: "uppercase" }}>For Each Section</span>
          <p style={{ fontSize: 11, color: C.text2, lineHeight: 1.55, margin: "6px 0 0" }}>Read the description and check off the statements that are true for your business today. Then use the <b style={{ color: C.gold }}>Rate Yourself</b> panel at the bottom to score yourself 1–6. Be honest — the value is in the gaps, not the total.</p>
        </div>
      </Page>

      {/* ═══ PAGES 3–14 — ONE C PER PAGE ═══ */}
      {SECTIONS.map((section, idx) => (
        <Page key={section.key} pageNum={idx + 3} totalPages={TOTAL_PAGES}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 140, lineHeight: 1, color: "rgba(200,162,78,0.035)", position: "absolute", top: "0.5in", right: "0.5in", zIndex: 2, pointerEvents: "none" }}>{section.number}</div>
          <div style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: C.gold, fontWeight: 600, marginBottom: 6 }}>Dimension {section.number} of 12</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: 32, lineHeight: 1.08, color: C.text1, margin: "0 0 4px" }}>{section.title}</h2>
          <span style={{ fontSize: 10, color: C.gold, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" }}>{section.subtitle}</span>
          <p style={{ fontSize: 12, color: C.text2, lineHeight: 1.65, margin: "16px 0 20px" }}>{section.description}</p>
          <div style={{ padding: "12px 18px", borderRadius: 10, background: `linear-gradient(135deg, ${C.gold}05, ${C.gold}015)`, border: `1px solid ${C.gold}20`, marginBottom: 4 }}>
            {section.items.map((item, i) => (
              <CheckItem key={i} text={item.text} sub={item.sub} checked={!!checks[`${section.key}-${i}`]} onToggle={() => toggleCheck(section.key, i)}/>
            ))}
          </div>
          <ScoreSelector value={scores[section.key]} onChange={(val) => setScore(section.key, val)} lowLabel={section.lowLabel} highLabel={section.highLabel}/>
        </Page>
      ))}

      {/* ═══ PAGE 15 — SCORING SUMMARY ═══ */}
      <Page pageNum={15} totalPages={TOTAL_PAGES}>
        <div style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: C.gold, fontWeight: 600, marginBottom: 7 }}>Your Recurring Revenue Stickiness Score</div>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: 30, lineHeight: 1.08, color: C.text1, margin: "0 0 14px" }}><b style={{ color: C.gold, fontWeight: 400 }}>Your results, </b>at a glance.</h2>
        <div style={{ padding: "14px 18px", borderRadius: 12, background: "linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015))", border: `1px solid ${C.border2}`, marginBottom: 14 }}>
          {SECTIONS.map(s => { const score = scores[s.key] || 0; const pct = score > 0 ? (score / 6) * 100 : 0; return (
            <div key={s.key} style={{ display: "flex", alignItems: "center", gap: 10, padding: "3.5px 0" }}>
              <span style={{ fontSize: 9.5, color: score ? C.text2 : C.text4, width: 90, flexShrink: 0, textAlign: "right" }}>{s.title}</span>
              <div style={{ flex: 1, height: 7, borderRadius: 4, background: "rgba(255,255,255,0.04)", overflow: "hidden" }}>
                <div style={{ width: `${pct}%`, height: "100%", borderRadius: 4, background: score ? scoreColor(score) : "transparent", transition: "width 0.5s ease, background 0.3s ease" }}/>
              </div>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 14, fontWeight: 700, color: score ? scoreColor(score) : C.text4, minWidth: 22, textAlign: "right", transition: "color 0.3s ease" }}>{score || "—"}</span>
            </div>
          ); })}
          <div style={{ borderTop: `1px solid ${C.border1}`, marginTop: 10, paddingTop: 10, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: C.gold, letterSpacing: "0.1em", textTransform: "uppercase" }}>Total Stickiness Score</span>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 700, color: allScored ? (currentBand?.color || C.text3) : C.text3, transition: "color 0.3s ease" }}>
              {allScored ? totalScore : `${scoredCount}/12 scored`}{allScored && <span style={{ fontSize: 14, color: C.text4 }}> / {MAX_SCORE}</span>}
            </span>
          </div>
        </div>
      </Page>

      {/* ═══ EMAIL CAPTURE — appears once all 12 are scored ═══ */}
      {allScored && !capDismissed && !snapshotting && (
        <div className="capture-bar" style={{
          position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 200,
          background: "rgba(10,14,20,0.97)", backdropFilter: "blur(12px)",
          borderTop: `1px solid ${C.gold}55`, boxShadow: "0 -8px 32px rgba(0,0,0,0.5)",
          padding: "16px 20px",
        }}>
          <div style={{ maxWidth: 660, margin: "0 auto" }}>
            {capSent ? (
              <div style={{ textAlign: "center", padding: "6px 0" }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: C.green, marginBottom: 4 }}>
                  On its way to {capEmail}
                </div>
                <div style={{ fontSize: 12.5, color: C.text3 }}>
                  Your scored copy is in your inbox. Check spam if it hasn't arrived in a few minutes.
                </div>
                <button onClick={() => setCapDismissed(true)}
                  style={{ marginTop: 10, background: "none", border: "none", color: C.text3, fontSize: 12, cursor: "pointer", textDecoration: "underline" }}>
                  Close
                </button>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10, gap: 12 }}>
                  <div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 19, color: C.text1, lineHeight: 1.25 }}>
                      You scored <b style={{ color: currentBand ? currentBand.color : C.gold, fontWeight: 700 }}>{totalScore}/{MAX_SCORE}</b> — want a copy?
                    </div>
                    <div style={{ fontSize: 12.5, color: C.text3, marginTop: 2 }}>
                      We'll email you this scored report so you don't lose it.
                    </div>
                  </div>
                  <button onClick={() => setCapDismissed(true)} aria-label="Dismiss"
                    style={{ background: "none", border: "none", color: C.text4, fontSize: 20, lineHeight: 1, cursor: "pointer", flexShrink: 0, padding: 4 }}>
                    &times;
                  </button>
                </div>
                <div className="capture-fields" style={{ display: "flex", gap: 8 }}>
                  <input type="text" placeholder="First name" value={capFirst}
                    onChange={(e) => { setCapFirst(e.target.value); setCapErr(""); }}
                    style={{ flex: 1, minWidth: 0, padding: "12px 14px", borderRadius: 9, background: "#0F141C",
                      border: `1px solid ${C.border2}`, color: C.text1, fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none" }}/>
                  <input type="text" placeholder="Last name" value={capLast}
                    onChange={(e) => { setCapLast(e.target.value); setCapErr(""); }}
                    style={{ flex: 1, minWidth: 0, padding: "12px 14px", borderRadius: 9, background: "#0F141C",
                      border: `1px solid ${C.border2}`, color: C.text1, fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none" }}/>
                  <input type="email" placeholder="Email address" value={capEmail}
                    onChange={(e) => { setCapEmail(e.target.value); setCapErr(""); }}
                    onKeyDown={(e) => { if (e.key === "Enter") submitCapture(); }}
                    style={{ flex: 1.6, minWidth: 0, padding: "12px 14px", borderRadius: 9, background: "#0F141C",
                      border: `1px solid ${C.border2}`, color: C.text1, fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none" }}/>
                  <button onClick={submitCapture} disabled={capSending}
                    style={{ flexShrink: 0, padding: "12px 24px", borderRadius: 9, cursor: capSending ? "wait" : "pointer",
                      fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, fontWeight: 700, letterSpacing: "0.02em", color: C.gold,
                      background: `linear-gradient(135deg, ${C.gold}26, ${C.gold}10)`, border: `1px solid ${C.gold}66`,
                      opacity: capSending ? 0.6 : 1 }}>
                    {capSending ? "Sending…" : "Send it"}
                  </button>
                </div>
                {capErr && <div style={{ fontSize: 12, color: C.red, marginTop: 7 }}>{capErr}</div>}
                <div style={{ fontSize: 10.5, color: C.text4, marginTop: 8, lineHeight: 1.45 }}>
                  We'll email your scored copy and occasional related insights. Unsubscribe any time.
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        /* Stack the fields on narrow screens — three side by side is unusable there. */
        @media (max-width: 620px) {
          .capture-fields { flex-direction: column !important; }
          .capture-fields > * { flex: none !important; width: 100% !important; }
        }
        /* Never print the capture bar — this document gets saved as PDF. */
        @media print { .capture-bar { display: none !important; } }
      `}</style>
    </div>
  );
}
