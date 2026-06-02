import { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/* ═══════════════════════════════════════════════════════════════
   CUSTOMER CAPITAL DEEP-DIVE
   Relationships, Loyalty & Revenue Quality
   Accent: #22D3EE (cyan)
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

const ACCENT = C.cyan;

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
    title: "Customer Concentration Risk",
    subtitle: "What percentage of revenue comes from your top 3 clients?",
    description: "A $6M marketing agency had 42% of its revenue tied to a single Fortune 500 account. When that client's new CMO brought in their own agency, $2.5M in annual revenue vanished in 90 days. Compare that to a $4M managed services firm where no single client accounts for more than 8% of revenue — they've survived losing their largest client twice without a material impact on operations. Customer concentration is the silent killer of enterprise value. Whether you're scaling or positioning for an eventual exit, a diversified revenue base signals stability and reduces risk for everyone — your team, your lenders, and any future buyer.",
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
        { title: "Calculate your exact concentration ratio this week", context: "List your top 10 clients by revenue. If the top 3 exceed 40%, you have a concentration problem that needs a formal diversification plan — not just 'more sales.'" },
        { title: "Identify 3 industries or verticals you don't currently serve but could", context: "Concentration often comes from serving one industry. Diversifying across verticals protects you from sector-specific downturns." },
        { title: "Schedule a risk review of your #1 account's contract and relationship health", context: "Know when it renews, who the decision-maker is, what competitors are circling, and what it would take to replace that revenue." },
      ],
      mid: [
        { title: "Set a quarterly new-client acquisition target specifically aimed at diluting concentration", context: "Not just 'grow revenue' — target new logos that bring your top-client percentage down. Track concentration ratio as a KPI." },
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
      { text: "Clients interact primarily with account managers or team members, not the owner.", sub: "If clients call you directly for day-to-day needs, the relationship lives in you — not in the business." },
      { text: "Client relationships are documented in a CRM with full contact history and notes.", sub: "If a key person left tomorrow, could someone else pick up every client relationship from the CRM alone?" },
      { text: "We have introduced multiple team members to every major client.", sub: "Multi-threading client relationships across your team makes the relationship institutional, not personal." },
      { text: "A key relationship holder has been absent for 2+ weeks without client disruption.", sub: "The real test of transferability isn't a plan on paper — it's what happens when the person actually isn't there." },
    ],
    lowLabel: "Owner-dependent relationships",
    highLabel: "Fully institutional",
    quickWins: {
      low: [
        { title: "List every client where the owner is the primary relationship holder", context: "Be brutally honest. If you're the first call for more than 3 clients, you have a transferability problem that limits your growth and your options." },
        { title: "Introduce a second team member to your top 5 accounts within 30 days", context: "A simple introduction email followed by a joint meeting. The goal: the client sees your company, not just you." },
        { title: "Start logging every client interaction in a CRM — this week", context: "If it's not in the CRM, it doesn't exist for anyone but you. Even rough notes are infinitely better than nothing." },
      ],
      mid: [
        { title: "Transition day-to-day client communication from the owner to account managers", context: "Start with your newest or smallest accounts. Build the muscle, then move upstream to your biggest relationships." },
        { title: "Create client relationship briefs for your top 10 accounts", context: "Key contacts, communication preferences, history, pain points, opportunities. This document makes any relationship instantly transferable." },
        { title: "Implement quarterly business reviews led by account managers, not the owner", context: "QBRs are the highest-touch client interaction. When your team leads them confidently, transferability is real." },
      ],
      high: [
        { title: "Run a 'founder fade' test — remove yourself from all client communication for 30 days", context: "Track client satisfaction, retention, and upsell during the period. The results tell you exactly how transferable your relationships are." },
        { title: "Document your relationship transfer methodology as a repeatable playbook", context: "The process of transitioning relationships is itself valuable IP. A documented, proven transfer playbook is an asset in growth and in due diligence." },
      ],
    },
  },
  {
    key: "d3", num: 3, of: 10,
    title: "Revenue Recurrence & Predictability",
    subtitle: "How much of your revenue shows up without you having to re-sell it?",
    description: "Two firms. Same industry, same revenue. The first generates $4M from project-based work — every dollar has to be re-sold. The second generates $4M with 70% on recurring contracts — $2.8M shows up automatically on January 1st. The second business is worth 2–3x more than the first because recurring revenue is predictable, bankable, and scalable. It reduces customer acquisition costs, smooths cash flow, and gives you the confidence to invest in growth. Whether you're building to scale or building toward an exit, recurring revenue is the single most powerful lever for enterprise value.",
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
        { title: "Identify your top 5 project clients and design a recurring offer for each", context: "A retainer, a maintenance plan, a subscription add-on — find the recurring wrapper for what you already sell them." },
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
    description: "A $7M staffing firm operated for fifteen years on handshake agreements. 'Our clients trust us,' the owner said. Then a new procurement director at their largest account demanded a competitive RFP, renegotiated terms down 22%, and added a 30-day termination clause. Fifteen years of relationship equity, zero contractual protection. A competing firm with standard 12-month contracts, 90-day termination notice, and annual escalation clauses never faces that problem. Contracts aren't about distrust — they're about creating predictable, enforceable revenue streams that protect both parties and make the business quantifiably more valuable.",
    checks: [
      { text: "At least 80% of our recurring revenue is covered by written contracts or service agreements.", sub: "Handshake deals feel personal. Written contracts feel professional — and they're the only kind that protect you." },
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
    description: "A $3M SaaS company spent $4,200 acquiring each new client and assumed a 3-year average lifetime. But when they actually measured it, average tenure was 14 months — meaning they were losing money on most customers. The fix wasn't in acquisition; it was in retention. By implementing a structured onboarding program and quarterly success reviews, they extended average tenure to 28 months and increased lifetime value by 90% — without adding a single new feature. Customer lifetime value is the compound interest of your business. Small improvements in retention create massive improvements in profitability and enterprise value.",
    checks: [
      { text: "We know our average customer lifetime value (LTV) and track it quarterly.", sub: "If you can't state your LTV within 10%, you're making growth decisions without knowing if they're profitable." },
      { text: "Our annual customer retention rate is above 85%.", sub: "Below 80% means you're replacing more than a fifth of your base every year — a treadmill that prevents scaling." },
      { text: "We have a formal customer success or account management function focused on retention.", sub: "Retention doesn't happen by accident. Someone's job needs to be keeping clients — not just acquiring them." },
      { text: "We measure and act on leading indicators of churn before clients actually leave.", sub: "Declining usage, missed meetings, late payments — these are churn signals. If you're only reacting to cancellations, you're too late." },
    ],
    lowLabel: "High churn, unknown LTV",
    highLabel: "High retention, maximized LTV",
    quickWins: {
      low: [
        { title: "Calculate your average customer lifetime and LTV this week", context: "Pull your client list, note start dates and end dates (or current), compute average tenure and average revenue per client. This number will shock you — one way or the other." },
        { title: "Identify the 5 clients most likely to churn in the next 90 days", context: "Look for declining engagement, overdue invoices, unresolved complaints, or expiring contracts. These are your save-or-lose accounts." },
        { title: "Implement a 'health check' call for every client you haven't spoken to in 60+ days", context: "Radio silence is a churn signal. A simple check-in call can surface problems before they become cancellations." },
      ],
      mid: [
        { title: "Create a customer health scoring system — green, yellow, red — for all active accounts", context: "Score based on engagement frequency, NPS, contract status, and payment history. Review reds weekly, yellows monthly." },
        { title: "Assign formal account ownership for every client with a retention-focused KPI", context: "When someone's bonus depends on retention rate, retention becomes a priority — not an afterthought." },
        { title: "Analyze your churned clients from the last 12 months — what patterns emerge?", context: "Were they in a specific industry? Did they all churn at a certain tenure? Did they share a common onboarding gap? Patterns reveal systemic fixes." },
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
    subtitle: "Do you know why customers leave — before they leave?",
    description: "A $4M consulting firm surveyed their churned clients and discovered something painful: 60% didn't leave because of quality issues. They left because they felt ignored between projects. The service was fine when it was active, but during the gaps, competitors were calling, checking in, and offering alternatives. The firm had a relationship problem, not a quality problem. Understanding why customers actually leave — not why you think they leave — is the foundation of churn prevention. The best businesses don't just react to cancellations; they build systems that detect at-risk accounts weeks or months before the decision is made.",
    checks: [
      { text: "We have a formal process to capture and analyze the reason for every client loss.", sub: "Not a generic 'they went with a competitor.' Specific, documented reasons that feed into process improvements." },
      { text: "We can identify at-risk accounts before they signal intent to leave.", sub: "Leading indicators — declining engagement, missed meetings, payment delays — are more valuable than exit surveys." },
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
    subtitle: "Would your customers recommend you — actively, without being asked?",
    description: "There's a difference between satisfied customers and advocates. Satisfied customers don't complain. Advocates sell for you. A $5M B2B services company tracked their referral sources and discovered that 40% of new business came from just 12 clients who actively recommended them. Those 12 advocates were worth more than their entire marketing budget combined. Customer advocacy — measured through NPS, testimonials, case studies, and referral rates — is the ultimate proof that your Customer Capital is strong. Advocates create compounding value: they reduce acquisition costs, accelerate sales cycles, and signal to anyone evaluating your business that your relationships are genuinely deep.",
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
    description: "A $6M accounting firm reviewed their client portfolio and discovered that the average client used 1.4 of their 7 available services. They were leaving an estimated $2.3M in annual revenue on the table — from clients who already trusted them. By implementing a structured account planning process, they increased average service penetration to 2.8 within 18 months and grew revenue 35% without acquiring a single new client. Upselling and cross-selling existing clients is 5–7x cheaper than acquiring new ones. Every un-penetrated service line in an existing account is revenue you've already earned the right to capture.",
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
        { title: "Map every client against every service you offer — find the white space", context: "A simple grid: clients on the Y-axis, services on the X-axis. Every empty cell is a potential upsell. Prioritize by client size and relationship strength." },
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
    description: "The first 90 days of a customer relationship determine whether they become a long-term advocate or a quiet churn statistic. A $4M software implementation firm discovered that clients who completed a structured onboarding program had a 92% 2-year retention rate. Clients who skipped onboarding or received ad hoc support? 54%. Same product, same price, same team — the only variable was the onboarding experience. Customer onboarding isn't an operational detail. It's a strategic investment in lifetime value. The businesses that design their first 90 days intentionally create clients who stay longer, buy more, and refer others.",
    checks: [
      { text: "We have a documented onboarding process with defined milestones for new clients.", sub: "Not 'we show them around.' A structured program with specific deliverables, check-ins, and success criteria at 30, 60, and 90 days." },
      { text: "New clients achieve 'first value' — their first meaningful result — within 30 days.", sub: "The longer it takes a client to see value, the higher the risk of early churn. Speed to first value is a retention multiplier." },
      { text: "We measure onboarding completion rate and time-to-value for every new client.", sub: "If you don't track it, you can't improve it. These metrics directly correlate with long-term retention and expansion." },
      { text: "Client feedback from the onboarding experience is collected and used to improve the process.", sub: "Your newest clients are the best source of truth about onboarding gaps. Their feedback becomes your improvement roadmap." },
    ],
    lowLabel: "Sink or swim onboarding",
    highLabel: "Designed for stickiness",
    quickWins: {
      low: [
        { title: "Document your current onboarding process — even if it's informal", context: "Write down what actually happens in the first 90 days of a new client relationship. Seeing it on paper reveals the gaps and inconsistencies." },
        { title: "Define 'first value' for your service and create a fast-track to deliver it", context: "What's the first meaningful result a client gets? A report, a dashboard, a solved problem? Make delivering that result your #1 onboarding priority." },
        { title: "Call your 3 most recent clients and ask: 'What was confusing about getting started with us?'", context: "New clients remember the friction. Their answers become your onboarding improvement priorities." },
      ],
      mid: [
        { title: "Build a formal 30-60-90 day onboarding program with milestones and check-ins", context: "Day 30: first value delivered. Day 60: full service engagement. Day 90: satisfaction review and expansion conversation. Automated reminders for each." },
        { title: "Create a welcome kit (digital or physical) that sets expectations and builds excitement", context: "A branded welcome email sequence, a getting-started guide, key contacts, and a timeline. First impressions compound into loyalty." },
        { title: "Measure onboarding NPS separately from overall NPS", context: "Onboarding satisfaction predicts long-term retention better than any other metric. If it's low, fix it before investing in acquisition." },
      ],
      high: [
        { title: "A/B test onboarding approaches and measure the impact on 12-month retention", context: "Small changes in onboarding — a kickoff call vs. email, a 7-day vs. 30-day check-in — can have outsized effects on retention. Test and optimize." },
        { title: "Publish your onboarding success metrics externally as a competitive differentiator", context: "'95% of clients achieve first value within 21 days' is a powerful sales message and proof of operational maturity." },
      ],
    },
  },
  {
    key: "d10", num: 10, of: 10,
    title: "Market Positioning & Demand",
    subtitle: "Is demand for your services growing, or are you chasing it?",
    description: "A $5M cybersecurity firm positioned themselves as a generalist IT services provider for a decade. They competed on price, chased every RFP, and won on relationships alone. When they narrowed their positioning to 'cybersecurity compliance for healthcare,' three things happened: inbound leads tripled, their close rate doubled, and they could charge 40% more. They didn't get better at their job — they got better at being found by the right clients. Market positioning determines whether customers come to you or whether you chase them. Strong positioning reduces acquisition costs, increases pricing power, and signals to anyone evaluating your business that demand is sustainable.",
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
        { title: "Define your ideal client profile in one paragraph — industry, size, pain, budget", context: "Write it down. Share it with your team. Every sales and marketing decision should filter through this ICP. If it doesn't fit, don't chase it." },
        { title: "Audit your last 10 closed deals: how many fit your ICP perfectly?", context: "If fewer than half match, your sales effort is scattered. Tightening your ICP focus will increase close rates and average deal size." },
        { title: "Write your one-sentence positioning statement and test it with 5 clients", context: "'We help [specific client] solve [specific problem] unlike anyone else because [specific reason].' If clients nod, you're on track. If they're confused, iterate." },
      ],
      mid: [
        { title: "Invest in content marketing that positions you as the authority in your niche", context: "One blog post per week, one case study per month, one thought leadership piece per quarter. Consistency builds authority over 6–12 months." },
        { title: "Track your inbound-to-outbound lead ratio monthly and set a target to increase inbound", context: "If you're at 10% inbound today, target 25% in 12 months. The shift from chasing to attracting is the most powerful growth transformation." },
        { title: "Ask your top 5 clients: 'Why did you choose us over alternatives?'", context: "Their answers reveal your real positioning — which may be different from what you think. Use their language in your marketing." },
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
    desc: "You have real client relationships but the foundation is thin. Revenue depends too heavily on a few accounts, contracts lack teeth, and retention systems are reactive rather than proactive. Your customer base is an asset — but a volatile one." },
  { label: "Customer Established", min: 36, max: 48, range: "36–48", color: C.cyan,
    desc: "Your customer relationships are a genuine strength. Revenue has meaningful recurrence, key relationships are transferable, and you have systems for retention and growth. The remaining gaps are specific and addressable — closing them moves you from good to best-in-class." },
  { label: "Customer Powerhouse", min: 49, max: 60, range: "49–60", color: C.green,
    desc: "Your Customer Capital is a competitive weapon. Diversified revenue, deep relationships, high advocacy, and contractual predictability. Whether you're scaling aggressively or positioning for an eventual exit, your customer base is one of your most valuable assets." },
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
        <span><b style={{ color: ACCENT, fontWeight: 600 }}>Customer Capital</b> — Deep-Dive Assessment</span>
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
        const res = await fetch("/api/store-results", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: _name, email: _email, tool: "customer-capital-deep-dive", html: document.documentElement.outerHTML }) });
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


export default function CustomerCapitalDeepDive() {
  const [scores, setScores] = useState({});
  const [gateUnlocked, setGateUnlocked] = useState(false);
  const toolRef = useRef(null);
  const [checks, setChecks] = useState({});

  useEffect(() => {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) return;
    const original = viewport.getAttribute('content');
    const isMobile = window.innerWidth < 816;
    if (isMobile) {
      viewport.setAttribute('content', 'width=816, initial-scale=0.5, user-scalable=yes');
    }
    return () => {
      if (original) {
        viewport.setAttribute('content', original);
      }
    };
  }, []);

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
                <span style={{ color: ACCENT }}>Customer Capital</span>
                <br/>Deep-Dive
              </div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontStyle: "italic", color: C.text2, marginTop: 8 }}>
                Relationships, Loyalty & Revenue Quality
              </div>
            </div>

            <div style={{ width: 40, height: 1.5, margin: "0 auto 24px", background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)` }}/>

            {/* Core Principle */}
            <div style={{ padding: "16px 20px", borderRadius: 10, background: "linear-gradient(135deg, rgba(200,162,78,0.06), rgba(200,162,78,0.015))", border: "1px solid rgba(200,162,78,0.2)", marginBottom: 24 }}>
              <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.gold, marginBottom: 6 }}>The Core Principle</div>
              <div style={{ fontSize: 11.5, lineHeight: 1.65, color: C.text2 }}>
                Customer Capital measures the strength, depth, and transferability of your client relationships. It's not enough to have revenue — the question is: will these customers stay if you step back? Are the relationships with the <span style={{ color: ACCENT, fontWeight: 600 }}>business</span> or with you personally? Is the revenue recurring, diversified, and contractual — or project-based, concentrated, and handshake-dependent? The answers determine whether your customer base is an asset that drives growth and commands premium value, or a liability that limits both.
              </div>
            </div>

            {/* Stat callout */}
            <div style={{ padding: "12px 18px", borderRadius: 10, background: `${ACCENT}06`, border: `1px solid ${ACCENT}20`, marginBottom: 24 }}>
              <div style={{ fontSize: 11, lineHeight: 1.6, color: C.text2 }}>
                <span style={{ color: ACCENT, fontWeight: 700 }}>Customer concentration above 25%</span> of revenue in a single client is often a deal-killer in M&A — and a growth constraint at every stage. Recurring, contractual revenue commands multiples 2–3x higher than project-based revenue in the same industry.
              </div>
            </div>

            {/* Pill Grid */}
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
            <span style={{ color: C.gold }}>Your customers aren't just revenue.</span> <span style={{ color: C.text1 }}>They're an asset — or a liability.</span>
          </div>
          <p style={{ fontSize: 12, lineHeight: 1.65, color: C.text2, marginBottom: 10 }}>
            This isn't a customer satisfaction survey. It's a brutally honest assessment of the quality, depth, and durability of your client relationships. A $4M staffing firm with 40% of revenue in one account and handshake agreements is in a fundamentally different position than one with diversified, contracted, recurring revenue across 50+ clients. Both might have "happy customers" — but only one has Customer Capital that fuels sustainable growth and commands premium value.
          </p>
          <p style={{ fontSize: 12, lineHeight: 1.65, color: C.text2, marginBottom: 20 }}>
            For each dimension, read the description, review the checklist honestly, and score yourself based on where you truly are — not where you plan to be. The gap between your current score and a 5 or 6 is your opportunity for value creation. Every point of improvement in Customer Capital strengthens both your profitability (through retention and expansion) and your enterprise value (through reduced risk and increased predictability).
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
                <div style={{ fontSize: 11, lineHeight: 1.5, color: C.text2 }}>Genuine competitive advantage. Your customer relationships outperform your industry peers — you retain longer, expand more, and generate advocacy that drives organic growth. This area is a strategic asset that commands premium value.</div>
              </div>
              <div style={{ flex: 1, padding: "10px 14px", borderRadius: 8, background: `${C.green}08`, border: `1px solid ${C.green}20` }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 4 }}>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: C.green }}>6</span>
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: C.green }}>Perfect</span>
                </div>
                <div style={{ fontSize: 11, lineHeight: 1.5, color: C.text2 }}>Nothing meaningful left to improve. Most honest operators rarely give themselves this score. If you do, be certain you'd bet your house on it — because it will be tested, whether by market shifts, competitive pressure, or a buyer's due diligence team.</div>
              </div>
            </div>
          </div>

          {/* For Each Section */}
          <div style={{ padding: "14px 18px", borderRadius: 10, background: `${C.gold}06`, border: `1px solid ${C.gold}20` }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: C.gold, marginBottom: 6 }}>For Each Dimension</div>
            <div style={{ fontSize: 11, lineHeight: 1.6, color: C.text2 }}>
              Read the description and checklist honestly. Use the checklist as a gut-check — not a scorecard. Then use the <b style={{ color: C.text1 }}>Rate Yourself</b> panel at the bottom to assign your score. All 10 dimensions contribute to your overall Customer Capital score. Your results aggregate automatically.
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
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: ACCENT, marginBottom: 6 }}>Your Customer Capital Score</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 500, lineHeight: 1.2, marginBottom: 16 }}>
            How strong are the <span style={{ color: ACCENT }}>relationships</span> that power your business?
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
                  <div style={{ width: `${pct}%`, height: "100%", borderRadius: 4, background: `linear-gradient(180deg, ${barColor}30, ${barColor}15)`, border: `0.5px solid ${barColor}`, boxShadow: sc ? `0 0 8px ${barColor}25, inset 0 1px 0 ${barColor}20` : "none", transition: "all 0.4s ease" }}/>
                </div>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 13, fontWeight: 700, color: sc ? barColor : C.text4, width: 22, textAlign: "right" }}>
                  {sc || "–"}
                </span>
              </div>
            );
          })}

          {/* Total */}
          <div style={{ padding: "12px 16px", borderRadius: 10, background: `${ACCENT}08`, border: `1.5px solid ${ACCENT}30`, display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, marginBottom: 16 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: ACCENT }}>Total Customer Capital Score</span>
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
                Every dimension you just scored represents a customer lever — a specific place where improving your Customer Capital can increase both your revenue quality and your enterprise value. The gaps aren't failures. They're the untapped value hiding in your client relationships.
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.text1 }}>
                The businesses that command premium growth and premium valuations don't just have happy customers — they have customer systems that retain, expand, and generate advocacy automatically.
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
            toolName="Customer Capital Deep-Dive"
            toolSlug="customer-capital"
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
                  You can implement these yourself — or our team can see if you qualify for us to help you build customer relationships so deep that your business becomes a <span style={{ color: ACCENT, fontWeight: 700 }}>Masterpiece Business</span> that future buyers fight one another to acquire.
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
            Knowing your <span style={{ color: ACCENT }}>Customer Capital</span> score is the beginning, not the end.
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
                Most owners know their customers matter — but they've never had a framework to measure the quality, depth, and transferability of those relationships. That's the gap this assessment reveals. The distance between where you scored and best-in-class isn't a problem — it's a roadmap for building customer relationships that make your business a Masterpiece. Let's build it together.
              </div>
            </div>
          </div>

          {/* Dual CTA cards */}
          {/* What happens next — timeline */}
          <div style={{ padding: "18px 22px", borderRadius: 12, marginBottom: 18,
            background: `linear-gradient(135deg, ${C.gold}06, ${C.gold}02)`, border: `1.5px solid ${C.gold}25` }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 500, color: C.text1, marginBottom: 16 }}>
              What happens next.
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", marginBottom: 16 }}>
              {[
                { label: "Week 1", title: "Valuation Driver Intensive", desc: "We define your Profit Gap, Value Gap, and build your prioritized action plan.", color: C.gold, icon: <><rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke={C.gold} strokeWidth="1.3" fill="none"/><line x1="3" y1="10" x2="21" y2="10" stroke={C.gold} strokeWidth="1.3"/><line x1="8" y1="2" x2="8" y2="6" stroke={C.gold} strokeWidth="1.3"/><line x1="16" y1="2" x2="16" y2="6" stroke={C.gold} strokeWidth="1.3"/></> },
                { label: "Months 1\u20133", title: "Sprint 1 Execution", desc: "Monthly working sessions. I\u2019m in the room for every decision, delegation, and process build.", color: C.gold, icon: <><path d="M17 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2" stroke={C.gold} strokeWidth="1.3" fill="none"/><circle cx="10" cy="7" r="4" stroke={C.gold} strokeWidth="1.3" fill="none"/><path d="M23 21v-2a4 4 0 00-3-3.87" stroke={C.gold} strokeWidth="1.3" fill="none"/><path d="M16 3.13a4 4 0 010 7.75" stroke={C.gold} strokeWidth="1.3" fill="none"/></> },
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
              Your customers are not a line item on your income statement. They are the living, breathing proof that your business creates value worth paying for. The depth of those relationships — their loyalty, their advocacy, their predictability — is what separates a business that merely generates revenue from one that generates <span style={{ color: C.gold, fontWeight: 700, fontStyle: "normal" }}>lasting wealth.</span>
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
