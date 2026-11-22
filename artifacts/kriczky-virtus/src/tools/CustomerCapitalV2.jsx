import DeepDiveReport, { TONE } from "./DeepDiveReport.jsx";

/* ═══════════════════════════════════════════════════════════════
   CUSTOMER CAPITAL DEEP-DIVE - v2 content (22 Nov 2026)
   The same dimensions, checklists, bands and copy as CustomerCapital.jsx (v1), em dashes
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
    title: "Customer Concentration Risk",
    subtitle: "What percentage of revenue comes from your top 3 clients?",
    description: "A $6M marketing agency had 42% of its revenue tied to a single Fortune 500 account. When that client's new CMO brought in their own agency, $2.5M in annual revenue vanished in 90 days. Compare that to a $4M managed services firm where no single client accounts for more than 8% of revenue - they've survived losing their largest client twice without a material impact on operations. Customer concentration is the silent killer of enterprise value. Whether you're scaling or positioning for an eventual exit, a diversified revenue base signals stability and reduces risk for everyone - your team, your lenders, and any future buyer.",
    checks: [
      { text: "No single client accounts for more than 15% of total revenue.", sub: "Above 15% creates dependency. Above 25% is often a deal-killer in M&A and a growth constraint at any stage." },
      { text: "Our top 5 clients collectively represent less than 40% of total revenue.", sub: "If losing two clients would cause a crisis, your revenue base is too concentrated to scale safely." },
      { text: "We have an active strategy to acquire new clients that dilutes concentration over time.", sub: "Concentration doesn't fix itself. Without intentional diversification, it gets worse as your biggest clients grow." },
      { text: "We have assessed the specific risk of losing each of our top 5 clients within the next 12 months.", sub: "Do you know each top client's contract status, decision-maker stability, and competitive threats? If not, you're flying blind." },
    ],
    lowLabel: "Dangerously concentrated",
    highLabel: "Fully diversified base",
    quickWins: {
      low: [
        { title: "Calculate your exact concentration ratio this week", context: "List your top 10 clients by revenue. If the top 3 exceed 40%, you have a concentration problem that needs a formal diversification plan - not just 'more sales.'" },
        { title: "Identify 3 industries or verticals you don't currently serve but could", context: "Concentration often comes from serving one industry. Diversifying across verticals protects you from sector-specific downturns." },
        { title: "Schedule a risk review of your #1 account's contract and relationship health", context: "Know when it renews, who the decision-maker is, what competitors are circling, and what it would take to replace that revenue." },
      ],
      mid: [
        { title: "Set a quarterly new-client acquisition target specifically aimed at diluting concentration", context: "Not just 'grow revenue' - target new logos that bring your top-client percentage down. Track concentration ratio as a KPI." },
        { title: "Develop a 'whale insurance' plan for your top 3 accounts", context: "For each: document the relationship, cross-train contacts, expand the service footprint, and pre-identify replacement revenue sources." },
        { title: "Create a client portfolio scorecard that tracks concentration monthly", context: "What gets measured gets managed. A monthly concentration dashboard keeps the risk visible to leadership." },
      ],
      high: [
        { title: "Implement a formal client acceptance policy with concentration limits", context: "Some businesses won't take a new client that would push any single account above 10%. Discipline today prevents crisis tomorrow." },
        { title: "Stress-test your financials assuming your largest client leaves next quarter", context: "Model the impact: can you cover fixed costs? How long until replacement revenue fills the gap? The answer shapes your risk mitigation strategy." },
      ],
    },
  },
  {
    key: "d2", num: 2, of: 10,
    title: "Relationship Transferability",
    subtitle: "Are client relationships with the business or with specific people?",
    description: "A $5M insurance brokerage had a problem the owner didn't see until it was too late: every major client relationship was with him personally. When he tried to step back, three of his top ten accounts followed a departing senior broker to a competitor. The owner had confused 'my clients love me' with 'my clients love my company.' Contrast that with a $3M digital agency where clients interact with account teams, not the founder. When the founder took a six-month sabbatical, not a single client left. Relationship transferability is the difference between a business that's an asset and a business that's a job.",
    checks: [
      { text: "Clients interact primarily with account managers or team members, not the owner.", sub: "If clients call you directly for day-to-day needs, the relationship lives in you - not in the business." },
      { text: "Client relationships are documented in a CRM with full contact history and notes.", sub: "If a key person left tomorrow, could someone else pick up every client relationship from the CRM alone?" },
      { text: "We have introduced multiple team members to every major client.", sub: "Multi-threading client relationships across your team makes the relationship institutional, not personal." },
      { text: "A key relationship holder has been absent for 2+ weeks without client disruption.", sub: "The real test of transferability isn't a plan on paper - it's what happens when the person actually isn't there." },
    ],
    lowLabel: "Owner-dependent relationships",
    highLabel: "Fully institutional",
    quickWins: {
      low: [
        { title: "List every client where the owner is the primary relationship holder", context: "Be brutally honest. If you're the first call for more than 3 clients, you have a transferability problem that limits your growth and your options." },
        { title: "Introduce a second team member to your top 5 accounts within 30 days", context: "A simple introduction email followed by a joint meeting. The goal: the client sees your company, not just you." },
        { title: "Start logging every client interaction in a CRM - this week", context: "If it's not in the CRM, it doesn't exist for anyone but you. Even rough notes are infinitely better than nothing." },
      ],
      mid: [
        { title: "Transition day-to-day client communication from the owner to account managers", context: "Start with your newest or smallest accounts. Build the muscle, then move upstream to your biggest relationships." },
        { title: "Create client relationship briefs for your top 10 accounts", context: "Key contacts, communication preferences, history, pain points, opportunities. This document makes any relationship instantly transferable." },
        { title: "Implement quarterly business reviews led by account managers, not the owner", context: "QBRs are the highest-touch client interaction. When your team leads them confidently, transferability is real." },
      ],
      high: [
        { title: "Run a 'founder fade' test - remove yourself from all client communication for 30 days", context: "Track client satisfaction, retention, and upsell during the period. The results tell you exactly how transferable your relationships are." },
        { title: "Document your relationship transfer methodology as a repeatable playbook", context: "The process of transitioning relationships is itself valuable IP. A documented, proven transfer playbook is an asset in growth and in due diligence." },
      ],
    },
  },
  {
    key: "d3", num: 3, of: 10,
    title: "Revenue Recurrence & Predictability",
    subtitle: "How much of your revenue shows up without you having to re-sell it?",
    description: "Two firms. Same industry, same revenue. The first generates $4M from project-based work - every dollar has to be re-sold. The second generates $4M with 70% on recurring contracts - $2.8M shows up automatically on January 1st. The second business is worth 2–3x more than the first because recurring revenue is predictable, bankable, and scalable. It reduces customer acquisition costs, smooths cash flow, and gives you the confidence to invest in growth. Whether you're building to scale or building toward an exit, recurring revenue is the single most powerful lever for enterprise value.",
    checks: [
      { text: "More than 50% of our revenue is recurring, contracted, or subscription-based.", sub: "Below 30% recurring means you're essentially re-starting your business every quarter. Above 70% is best-in-class." },
      { text: "We can accurately forecast next quarter's revenue within 10% based on existing contracts.", sub: "Predictability = confidence. If you can't forecast within 10%, your revenue model has structural unpredictability." },
      { text: "Our recurring revenue has grown as a percentage of total revenue over the past 2 years.", sub: "The trend matters as much as the number. Growing recurrence signals intentional value creation." },
      { text: "We have a clear strategy to convert one-time customers into recurring relationships.", sub: "Every project client is a potential recurring client. Do you have a systematic path to convert them?" },
    ],
    lowLabel: "Project-based, unpredictable",
    highLabel: "Highly recurring, bankable",
    quickWins: {
      low: [
        { title: "Calculate your exact recurring revenue percentage this week", context: "Separate all revenue into three buckets: contracted recurring, repeat-but-not-contracted, and one-time. The split reveals your true revenue quality." },
        { title: "Identify your top 5 project clients and design a recurring offer for each", context: "A retainer, a maintenance plan, a subscription add-on - find the recurring wrapper for what you already sell them." },
        { title: "Create a simple retainer or subscription tier you can offer to every new client", context: "Even a small monthly fee for ongoing support converts a one-time transaction into a recurring relationship." },
      ],
      mid: [
        { title: "Set a 12-month target: increase recurring revenue from X% to Y%", context: "Make it a company KPI. Track it monthly. When the whole team sees the metric, behavior shifts toward building recurring relationships." },
        { title: "Implement annual contracts with auto-renewal clauses for your top accounts", context: "Auto-renewal shifts the default from 'will they re-sign?' to 'is there a reason to cancel?' That psychological shift is worth millions in aggregate." },
        { title: "Build a 'recurring revenue conversion' playbook for your sales team", context: "Teach them to lead with recurring offers, position projects as on-ramps to retainers, and track conversion rate as a sales KPI." },
      ],
      high: [
        { title: "Analyze your recurring revenue for expansion vs. contraction trends", context: "Net revenue retention above 110% means existing clients are growing. Below 90% means you have a hidden churn problem masquerading as retention." },
        { title: "Model the 3-year impact of increasing recurring revenue by 10 percentage points", context: "Show leadership (and yourself) the compounding effect on valuation, cash flow stability, and growth capacity." },
      ],
    },
  },
  {
    key: "d4", num: 4, of: 10,
    title: "Contract Strength & Duration",
    subtitle: "Do you have enforceable agreements, or handshake deals?",
    description: "A $7M staffing firm operated for fifteen years on handshake agreements. 'Our clients trust us,' the owner said. Then a new procurement director at their largest account demanded a competitive RFP, renegotiated terms down 22%, and added a 30-day termination clause. Fifteen years of relationship equity, zero contractual protection. A competing firm with standard 12-month contracts, 90-day termination notice, and annual escalation clauses never faces that problem. Contracts aren't about distrust - they're about creating predictable, enforceable revenue streams that protect both parties and make the business quantifiably more valuable.",
    checks: [
      { text: "At least 80% of our recurring revenue is covered by written contracts or service agreements.", sub: "Handshake deals feel personal. Written contracts feel professional - and they're the only kind that protect you." },
      { text: "Our standard contract term is 12 months or longer with auto-renewal.", sub: "Month-to-month arrangements create churn risk every 30 days. Longer terms with auto-renewal dramatically improve retention." },
      { text: "Contracts include termination notice requirements of at least 60 days.", sub: "A 60–90 day notice period gives you time to respond, retain, or replace. Without it, clients vanish overnight." },
      { text: "We review and update contract terms annually to reflect current market conditions.", sub: "Stale contracts with 5-year-old pricing and terms erode margin and leave money on the table." },
    ],
    lowLabel: "Handshake deals, no protection",
    highLabel: "Strong contracts, long terms",
    quickWins: {
      low: [
        { title: "Audit every active client: contract vs. handshake, term length, termination clause", context: "A simple spreadsheet. Every row without a written contract is unprotected revenue. Prioritize converting your largest uncontracted accounts first." },
        { title: "Draft a standard service agreement template this week", context: "It doesn't need to be complex. A 2-page agreement covering scope, term, payment, termination, and renewal is infinitely better than nothing." },
        { title: "Convert your three largest handshake clients to written agreements within 60 days", context: "Frame it as professionalization: 'We're formalizing our partnerships as we grow.' Most clients respect this." },
      ],
      mid: [
        { title: "Implement auto-renewal with annual price escalation in all new contracts", context: "A 3–5% annual escalation clause protects your margins against inflation and signals that your value increases over time." },
        { title: "Add a 90-day termination notice requirement to all new agreements", context: "This single clause transforms your revenue from 'could disappear tomorrow' to '90 days of guaranteed runway to respond.'" },
        { title: "Create a contract renewal calendar with 120-day advance alerts", context: "Never be surprised by an expiring contract. A renewal calendar turns reactive scrambling into proactive relationship management." },
      ],
      high: [
        { title: "Analyze the correlation between contract length and client lifetime value", context: "You'll likely find that longer-term contracts produce higher LTV. Use the data to justify pushing for longer initial terms." },
        { title: "Have an attorney review your standard agreement for enforceability and gap coverage", context: "A professional review ensures your contracts actually protect you. A $2,000 legal review could save you millions in unprotected revenue." },
      ],
    },
  },
  {
    key: "d5", num: 5, of: 10,
    title: "Customer Lifetime Value & Retention",
    subtitle: "How long does the average customer stay, and what are they worth?",
    description: "A $3M SaaS company spent $4,200 acquiring each new client and assumed a 3-year average lifetime. But when they actually measured it, average tenure was 14 months - meaning they were losing money on most customers. The fix wasn't in acquisition; it was in retention. By implementing a structured onboarding program and quarterly success reviews, they extended average tenure to 28 months and increased lifetime value by 90% - without adding a single new feature. Customer lifetime value is the compound interest of your business. Small improvements in retention create massive improvements in profitability and enterprise value.",
    checks: [
      { text: "We know our average customer lifetime value (LTV) and track it quarterly.", sub: "If you can't state your LTV within 10%, you're making growth decisions without knowing if they're profitable." },
      { text: "Our annual customer retention rate is above 85%.", sub: "Below 80% means you're replacing more than a fifth of your base every year - a treadmill that prevents scaling." },
      { text: "We have a formal customer success or account management function focused on retention.", sub: "Retention doesn't happen by accident. Someone's job needs to be keeping clients - not just acquiring them." },
      { text: "We measure and act on leading indicators of churn before clients actually leave.", sub: "Declining usage, missed meetings, late payments - these are churn signals. If you're only reacting to cancellations, you're too late." },
    ],
    lowLabel: "High churn, unknown LTV",
    highLabel: "High retention, maximized LTV",
    quickWins: {
      low: [
        { title: "Calculate your average customer lifetime and LTV this week", context: "Pull your client list, note start dates and end dates (or current), compute average tenure and average revenue per client. This number will shock you - one way or the other." },
        { title: "Identify the 5 clients most likely to churn in the next 90 days", context: "Look for declining engagement, overdue invoices, unresolved complaints, or expiring contracts. These are your save-or-lose accounts." },
        { title: "Implement a 'health check' call for every client you haven't spoken to in 60+ days", context: "Radio silence is a churn signal. A simple check-in call can surface problems before they become cancellations." },
      ],
      mid: [
        { title: "Create a customer health scoring system - green, yellow, red - for all active accounts", context: "Score based on engagement frequency, NPS, contract status, and payment history. Review reds weekly, yellows monthly." },
        { title: "Assign formal account ownership for every client with a retention-focused KPI", context: "When someone's bonus depends on retention rate, retention becomes a priority - not an afterthought." },
        { title: "Analyze your churned clients from the last 12 months - what patterns emerge?", context: "Were they in a specific industry? Did they all churn at a certain tenure? Did they share a common onboarding gap? Patterns reveal systemic fixes." },
      ],
      high: [
        { title: "Calculate your net revenue retention (NRR) including expansion and contraction", context: "NRR above 110% means your existing clients are growing. This is the gold standard metric for Customer Capital health." },
        { title: "Benchmark your retention rate against industry leaders and set a 12-month improvement target", context: "If industry best-in-class is 95% and you're at 87%, that 8-point gap represents significant lost value. Quantify it and close it." },
      ],
    },
  },
  {
    key: "d6", num: 6, of: 10,
    title: "Churn Root Causes & Prevention",
    subtitle: "Do you know why customers leave - before they leave?",
    description: "A $4M consulting firm surveyed their churned clients and discovered something painful: 60% didn't leave because of quality issues. They left because they felt ignored between projects. The service was fine when it was active, but during the gaps, competitors were calling, checking in, and offering alternatives. The firm had a relationship problem, not a quality problem. Understanding why customers actually leave - not why you think they leave - is the foundation of churn prevention. The best businesses don't just react to cancellations; they build systems that detect at-risk accounts weeks or months before the decision is made.",
    checks: [
      { text: "We have a formal process to capture and analyze the reason for every client loss.", sub: "Not a generic 'they went with a competitor.' Specific, documented reasons that feed into process improvements." },
      { text: "We can identify at-risk accounts before they signal intent to leave.", sub: "Leading indicators - declining engagement, missed meetings, payment delays - are more valuable than exit surveys." },
      { text: "We have a documented save process for at-risk accounts with assigned ownership.", sub: "When a client is flagged as at-risk, does someone own the recovery? Or does it get lost in the shuffle?" },
      { text: "Churn root cause data has led to at least one concrete process change in the last 12 months.", sub: "Collecting data without acting on it is theater. Real churn prevention means changing how you operate based on what you learn." },
    ],
    lowLabel: "Blindsided by cancellations",
    highLabel: "Predict and prevent churn",
    quickWins: {
      low: [
        { title: "Call your last 5 churned clients and ask them honestly why they left", context: "Don't defend. Don't sell. Just listen. The patterns you hear will reveal your biggest retention gap. Most owners are surprised by what they learn." },
        { title: "Define 3 leading indicators of churn and start tracking them this week", context: "Examples: no engagement in 30+ days, NPS score below 6, overdue invoice past 45 days. Simple triggers that flag accounts before cancellation." },
        { title: "Create a one-page 'churn autopsy' template for documenting every client loss", context: "Who left, when, why, what could we have done, what will we change. Reviewing these monthly transforms random losses into systemic learning." },
      ],
      mid: [
        { title: "Build an automated alert system for churn leading indicators", context: "CRM workflow that flags accounts when engagement drops, satisfaction scores dip, or contracts approach expiration without renewal signals." },
        { title: "Assign a 'save team' with explicit authority to offer retention incentives for at-risk accounts", context: "A structured save process with pre-approved offers (discounts, service upgrades, executive attention) recovers 30–40% of at-risk accounts." },
        { title: "Conduct a quarterly churn review meeting with leadership", context: "Review every loss, every near-miss, and the patterns emerging. Make churn prevention a strategic priority, not an operational afterthought." },
      ],
      high: [
        { title: "Build a predictive churn model using your historical data", context: "Even a simple logistic regression on 5–6 variables can predict churn probability 60–90 days out. The earlier you know, the more you can do." },
        { title: "Quantify the dollar impact of your churn prevention efforts over the last 12 months", context: "How many at-risk accounts were saved? What's their combined annual revenue? This number justifies continued investment in retention." },
      ],
    },
  },
  {
    key: "d7", num: 7, of: 10,
    title: "Customer Satisfaction & Advocacy",
    subtitle: "Would your customers recommend you - actively, without being asked?",
    description: "There's a difference between satisfied customers and advocates. Satisfied customers don't complain. Advocates sell for you. A $5M B2B services company tracked their referral sources and discovered that 40% of new business came from just 12 clients who actively recommended them. Those 12 advocates were worth more than their entire marketing budget combined. Customer advocacy - measured through NPS, testimonials, case studies, and referral rates - is the ultimate proof that your Customer Capital is strong. Advocates create compounding value: they reduce acquisition costs, accelerate sales cycles, and signal to anyone evaluating your business that your relationships are genuinely deep.",
    checks: [
      { text: "We systematically measure customer satisfaction through NPS, CSAT, or a similar metric.", sub: "Anecdotal feedback isn't data. A consistent, quantified measurement gives you a baseline and tracks improvement." },
      { text: "At least 20% of new business comes from client referrals.", sub: "A referral rate below 10% suggests your clients are satisfied but not enthused. Above 30% signals genuine advocacy." },
      { text: "We have documented client testimonials, case studies, or success stories we actively use.", sub: "Social proof from real clients is 10x more persuasive than any marketing copy. Do you have it, and do you use it?" },
      { text: "We proactively ask satisfied clients for referrals and introductions.", sub: "Most clients will refer you if asked. Most businesses never ask. This is the lowest-cost, highest-quality growth lever available." },
    ],
    lowLabel: "Silent, indifferent clients",
    highLabel: "Active advocates & referrers",
    quickWins: {
      low: [
        { title: "Send a 1-question NPS survey to your top 20 clients this week", context: "One question: 'How likely are you to recommend us?' (0–10). The score tells you where you stand. The comments tell you what to fix." },
        { title: "Ask your 3 happiest clients for a testimonial or referral this week", context: "A personal ask, not an automated email. 'Would you be willing to share your experience?' Most say yes. Use it on your website, proposals, and sales materials." },
        { title: "Identify your Net Promoters (9–10 scores) and create a VIP referral program for them", context: "Your promoters want to help you. Give them a reason and a mechanism: referral bonuses, exclusive access, co-marketing opportunities." },
      ],
      mid: [
        { title: "Implement a quarterly NPS survey with automated follow-up for detractors", context: "Detractors (0–6) get a personal call within 48 hours. Passives (7–8) get an engagement touch. Promoters (9–10) get a referral ask." },
        { title: "Build 3 client case studies with measurable results and publish them", context: "Case studies with specific metrics ('increased revenue 34%,' 'reduced churn by half') are the most persuasive content you can create." },
        { title: "Create a formal referral program with tracking and rewards", context: "Track who refers, who converts, and the revenue generated. A modest reward ($250–$500 or a charitable donation in their name) catalyzes referral behavior." },
      ],
      high: [
        { title: "Calculate the lifetime value of referred clients vs. non-referred clients", context: "Referred clients typically have higher LTV, faster close rates, and lower acquisition costs. Quantifying this justifies heavy investment in referral programs." },
        { title: "Launch a client advisory board of your top 10 advocates", context: "Give them influence over your product roadmap, early access to new services, and recognition. Advisory board members become your most vocal champions." },
      ],
    },
  },
  {
    key: "d8", num: 8, of: 10,
    title: "Upsell & Cross-Sell Penetration",
    subtitle: "Are you capturing the full wallet share of each client?",
    description: "A $6M accounting firm reviewed their client portfolio and discovered that the average client used 1.4 of their 7 available services. They were leaving an estimated $2.3M in annual revenue on the table - from clients who already trusted them. By implementing a structured account planning process, they increased average service penetration to 2.8 within 18 months and grew revenue 35% without acquiring a single new client. Upselling and cross-selling existing clients is 5–7x cheaper than acquiring new ones. Every un-penetrated service line in an existing account is revenue you've already earned the right to capture.",
    checks: [
      { text: "We know exactly how many of our services or products each client uses.", sub: "If you can't see the white space in each account, you can't capture it. Account-level service mapping is the first step." },
      { text: "We have a structured account planning process that identifies expansion opportunities.", sub: "Not 'the sales team should upsell more.' A documented process: annual account reviews, service gap analysis, expansion proposals." },
      { text: "Our average revenue per client has grown over the past 2 years.", sub: "Growing revenue per client is the strongest indicator of deepening relationships and increasing stickiness." },
      { text: "Cross-sell and upsell revenue represents at least 20% of annual revenue growth.", sub: "If all your growth comes from new logos, you're working too hard. Expansion revenue should be a significant growth engine." },
    ],
    lowLabel: "Untapped potential in accounts",
    highLabel: "Full wallet share captured",
    quickWins: {
      low: [
        { title: "Map every client against every service you offer - find the white space", context: "A simple grid: clients on the Y-axis, services on the X-axis. Every empty cell is a potential upsell. Prioritize by client size and relationship strength." },
        { title: "Identify your 5 largest clients with the lowest service penetration", context: "These are your biggest expansion opportunities. They already trust you. They just don't know what else you can do for them." },
        { title: "Train your team to ask one strategic question in every client interaction: 'What else are you working on?'", context: "This question opens doors to needs your client hasn't connected to your capabilities. It costs nothing and creates pipeline." },
      ],
      mid: [
        { title: "Implement annual account planning for your top 20 clients", context: "A 1-page plan per account: current services, expansion opportunities, decision-makers, timeline, and next action. Review quarterly." },
        { title: "Create a 'land and expand' playbook for your sales and account management teams", context: "Define the ideal expansion sequence: which services follow which, what triggers an upsell conversation, and how to position it." },
        { title: "Track and report average revenue per client as a monthly KPI", context: "When the team sees this number and knows leadership is watching it, cross-sell behavior accelerates naturally." },
      ],
      high: [
        { title: "Calculate the total addressable revenue within your existing client base", context: "If every client bought every service, what would revenue be? The gap between that number and current revenue is your expansion opportunity." },
        { title: "Implement client success plans that include expansion milestones", context: "Don't treat upselling as a sales function. Treat it as a success function: 'Based on where you are, here's the next service that would help.'" },
      ],
    },
  },
  {
    key: "d9", num: 9, of: 10,
    title: "Customer Onboarding & Experience",
    subtitle: "Is the first 90 days of the customer relationship designed for stickiness?",
    description: "The first 90 days of a customer relationship determine whether they become a long-term advocate or a quiet churn statistic. A $4M software implementation firm discovered that clients who completed a structured onboarding program had a 92% 2-year retention rate. Clients who skipped onboarding or received ad hoc support? 54%. Same product, same price, same team - the only variable was the onboarding experience. Customer onboarding isn't an operational detail. It's a strategic investment in lifetime value. The businesses that design their first 90 days intentionally create clients who stay longer, buy more, and refer others.",
    checks: [
      { text: "We have a documented onboarding process with defined milestones for new clients.", sub: "Not 'we show them around.' A structured program with specific deliverables, check-ins, and success criteria at 30, 60, and 90 days." },
      { text: "New clients achieve 'first value' - their first meaningful result - within 30 days.", sub: "The longer it takes a client to see value, the higher the risk of early churn. Speed to first value is a retention multiplier." },
      { text: "We measure onboarding completion rate and time-to-value for every new client.", sub: "If you don't track it, you can't improve it. These metrics directly correlate with long-term retention and expansion." },
      { text: "Client feedback from the onboarding experience is collected and used to improve the process.", sub: "Your newest clients are the best source of truth about onboarding gaps. Their feedback becomes your improvement roadmap." },
    ],
    lowLabel: "Sink or swim onboarding",
    highLabel: "Designed for stickiness",
    quickWins: {
      low: [
        { title: "Document your current onboarding process - even if it's informal", context: "Write down what actually happens in the first 90 days of a new client relationship. Seeing it on paper reveals the gaps and inconsistencies." },
        { title: "Define 'first value' for your service and create a fast-track to deliver it", context: "What's the first meaningful result a client gets? A report, a dashboard, a solved problem? Make delivering that result your #1 onboarding priority." },
        { title: "Call your 3 most recent clients and ask: 'What was confusing about getting started with us?'", context: "New clients remember the friction. Their answers become your onboarding improvement priorities." },
      ],
      mid: [
        { title: "Build a formal 30-60-90 day onboarding program with milestones and check-ins", context: "Day 30: first value delivered. Day 60: full service engagement. Day 90: satisfaction review and expansion conversation. Automated reminders for each." },
        { title: "Create a welcome kit (digital or physical) that sets expectations and builds excitement", context: "A branded welcome email sequence, a getting-started guide, key contacts, and a timeline. First impressions compound into loyalty." },
        { title: "Measure onboarding NPS separately from overall NPS", context: "Onboarding satisfaction predicts long-term retention better than any other metric. If it's low, fix it before investing in acquisition." },
      ],
      high: [
        { title: "A/B test onboarding approaches and measure the impact on 12-month retention", context: "Small changes in onboarding - a kickoff call vs. email, a 7-day vs. 30-day check-in - can have outsized effects on retention. Test and optimize." },
        { title: "Publish your onboarding success metrics externally as a competitive differentiator", context: "'95% of clients achieve first value within 21 days' is a powerful sales message and proof of operational maturity." },
      ],
    },
  },
  {
    key: "d10", num: 10, of: 10,
    title: "Market Positioning & Demand",
    subtitle: "Is demand for your services growing, or are you chasing it?",
    description: "A $5M cybersecurity firm positioned themselves as a generalist IT services provider for a decade. They competed on price, chased every RFP, and won on relationships alone. When they narrowed their positioning to 'cybersecurity compliance for healthcare,' three things happened: inbound leads tripled, their close rate doubled, and they could charge 40% more. They didn't get better at their job - they got better at being found by the right clients. Market positioning determines whether customers come to you or whether you chase them. Strong positioning reduces acquisition costs, increases pricing power, and signals to anyone evaluating your business that demand is sustainable.",
    checks: [
      { text: "We have a clearly defined ideal client profile (ICP) that our sales and marketing efforts target.", sub: "If your answer to 'who's your ideal client?' is 'anyone who pays,' your positioning needs work." },
      { text: "Inbound leads represent at least 30% of our new business pipeline.", sub: "Inbound is a proxy for positioning strength. If all your business comes from outbound effort, the market isn't finding you." },
      { text: "We can articulate a specific, defensible reason why clients choose us over alternatives.", sub: "Not 'great service' or 'we care more.' A concrete differentiator that's provable and relevant to your ideal client." },
      { text: "Demand for our services has grown or remained stable over the past 2 years.", sub: "Are you in a growing market, a flat market, or a declining one? The answer shapes every strategic decision." },
    ],
    lowLabel: "Chasing every opportunity",
    highLabel: "Demand pulls clients to us",
    quickWins: {
      low: [
        { title: "Define your ideal client profile in one paragraph - industry, size, pain, budget", context: "Write it down. Share it with your team. Every sales and marketing decision should filter through this ICP. If it doesn't fit, don't chase it." },
        { title: "Audit your last 10 closed deals: how many fit your ICP perfectly?", context: "If fewer than half match, your sales effort is scattered. Tightening your ICP focus will increase close rates and average deal size." },
        { title: "Write your one-sentence positioning statement and test it with 5 clients", context: "'We help [specific client] solve [specific problem] unlike anyone else because [specific reason].' If clients nod, you're on track. If they're confused, iterate." },
      ],
      mid: [
        { title: "Invest in content marketing that positions you as the authority in your niche", context: "One blog post per week, one case study per month, one thought leadership piece per quarter. Consistency builds authority over 6–12 months." },
        { title: "Track your inbound-to-outbound lead ratio monthly and set a target to increase inbound", context: "If you're at 10% inbound today, target 25% in 12 months. The shift from chasing to attracting is the most powerful growth transformation." },
        { title: "Ask your top 5 clients: 'Why did you choose us over alternatives?'", context: "Their answers reveal your real positioning - which may be different from what you think. Use their language in your marketing." },
      ],
      high: [
        { title: "Analyze win/loss data to quantify the revenue impact of your positioning", context: "How much faster do well-positioned deals close? What's the average deal size in your ICP vs. outside it? The data justifies doubling down." },
        { title: "Evaluate whether there's a premium pricing opportunity your current positioning supports", context: "Strong positioning creates pricing power. If clients are choosing you for specific expertise, test raising prices 10–15%." },
      ],
    },
  },
];

/* ── BANDING ── */
const BANDS = [
  { label: "Customer Crisis", min: 10, max: 20, range: "10–20", color: C.red,
    desc: "Your Customer Capital is critically weak. Concentration risk, relationship fragility, and unpredictable revenue are actively limiting your growth and creating operational instability. Immediate action is needed on multiple fronts." },
  { label: "Customer Fragile", min: 21, max: 35, range: "21–35", color: C.amber,
    desc: "You have real client relationships but the foundation is thin. Revenue depends too heavily on a few accounts, contracts lack teeth, and retention systems are reactive rather than proactive. Your customer base is an asset - but a volatile one." },
  { label: "Customer Established", min: 36, max: 48, range: "36–48", color: C.cyan,
    desc: "Your customer relationships are a genuine strength. Revenue has meaningful recurrence, key relationships are transferable, and you have systems for retention and growth. The remaining gaps are specific and addressable - closing them moves you from good to best-in-class." },
  { label: "Customer Powerhouse", min: 49, max: 60, range: "49–60", color: C.green,
    desc: "Your Customer Capital is a competitive weapon. Diversified revenue, deep relationships, high advocacy, and contractual predictability. Whether you're scaling aggressively or positioning for an eventual exit, your customer base is one of your most valuable assets." },
];

/* ── This tool's content for the shared report frame ── */
export const CUSTOMER = {
  tool: "Customer Capital", accent: TONE.cyan, dims: DIMS, bands: BANDS,
  toolSlug: "customer-capital", storeSlug: "customer-capital-deep-dive",
  coverSub: "Relationships, Loyalty & Revenue Quality",
  principle: (A) => [
    <>Customer Capital measures the strength, depth, and transferability of your client relationships. It's not enough to have revenue - the question is: will these customers stay if you step back? Are the relationships with the <span style={{ color: A.fill, fontWeight: 600 }}>business</span> or with you personally? Is the revenue recurring, diversified, and contractual - or project-based, concentrated, and handshake-dependent? The answers determine whether your customer base is an asset that drives growth and commands premium value, or a liability that limits both.</>,
  ],
  stat: (A) => <><span style={{ color: A.fill, fontWeight: 700 }}>Customer concentration above 25%</span> of revenue in a single client is often a deal-killer in M&A - and a growth constraint at every stage. Recurring, contractual revenue commands multiples 2–3x higher than project-based revenue in the same industry.</>,
  howHead: <>Your customers aren't just revenue. <em>They're an asset - or a liability.</em></>,
  howP1: "This isn't a customer satisfaction survey. It's a brutally honest assessment of the quality, depth, and durability of your client relationships. A $4M staffing firm with 40% of revenue in one account and handshake agreements is in a fundamentally different position than one with diversified, contracted, recurring revenue across 50+ clients. Both might have \"happy customers\" - but only one has Customer Capital that fuels sustainable growth and commands premium value.",
  howP2: "For each dimension, read the description, review the checklist honestly, and score yourself based on where you truly are - not where you plan to be. The gap between your current score and a 5 or 6 is your opportunity for value creation. Every point of improvement in Customer Capital strengthens both your profitability (through retention and expansion) and your enterprise value (through reduced risk and increased predictability).",
  best5: "Genuine competitive advantage. Your customer relationships outperform your industry peers - you retain longer, expand more, and generate advocacy that drives organic growth. This area is a strategic asset that commands premium value.",
  perfect6: "Nothing meaningful left to improve. Most honest operators rarely give themselves this score. If you do, be certain you'd bet your house on it - because it will be tested, whether by market shifts, competitive pressure, or a buyer's due diligence team.",
  summaryHead: <>How strong are the <em>relationships</em> that power your business?</>,
  lever: "Every dimension you just scored represents a customer lever - a specific place where improving your Customer Capital can increase both your revenue quality and your enterprise value. The gaps aren't failures. They're the untapped value hiding in your client relationships.",
  premium: "The businesses that command premium growth and premium valuations don't just have happy customers - they have customer systems that retain, expand, and generate advocacy automatically.",
  qualifier: (A) => <>You can implement these yourself - or our team can see if you qualify for us to help you build customer relationships so deep that your business becomes a <span style={{ color: A.ink, fontWeight: 700 }}>Masterpiece Business</span> that future buyers fight one another to acquire.</>,
  bio: "Most owners know their customers matter - but they've never had a framework to measure the quality, depth, and transferability of those relationships. That's the gap this assessment reveals. The distance between where you scored and best-in-class isn't a problem - it's a roadmap for building customer relationships that make your business a Masterpiece. Let's build it together.",
  quote: <>Your customers are not a line item on your income statement. They are the living, breathing proof that your business creates value worth paying for. The depth of those relationships - their loyalty, their advocacy, their predictability - is what separates a business that merely generates revenue from one that generates <span style={{ color: TONE.gold.ink, fontWeight: 700, fontStyle: "normal" }}>lasting wealth.</span></>,
};

export default function CustomerCapitalV2({ prefill = null }) {
  return <DeepDiveReport cfg={CUSTOMER} prefill={prefill} />;
}
