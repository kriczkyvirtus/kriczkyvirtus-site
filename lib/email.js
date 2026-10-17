const { Resend } = require("resend");

let resendClient = null;

function getResend() {
  if (resendClient) return resendClient;
  resendClient = new Resend(process.env.RESEND_API_KEY);
  return resendClient;
}

const TOOL_DETAILS = {
  "constraint-roadmap": {
    subject: "Your Personalized Constraint Roadmap",
    previewText: "Here's your personalized 14-page Constraint Roadmap",
    heading: "Your Constraint Roadmap Is Ready",
    description: "Here's your personalized 14-page Constraint Roadmap - built around your scores, your #1 constraint, and three specific moves you can start executing immediately.",
    buttonText: "View Your Constraint Roadmap",
    ctaUrl: "https://www.kriczkyvirtus.com/roadmap-session",
    ctaText: "P.S. - do you want 1-on-1 help walking through it together so you can start making progress on your 90-day checklist?",
    ctaButtonText: "Book Your Free Working Session",
  },
  "value-range-estimator": {
    subject: "Your \"What's My Business Worth?\" Results",
    previewText: "Your Value Range Estimate Is Ready",
    heading: "Your Value Range Estimate Is Ready",
    description: "Here are your personalized results from the What's My Business Worth estimator - including your estimated value range and the key drivers behind it.",
    buttonText: "View Your Results",
    ctaUrl: "https://www.kriczkyvirtus.com/free-session",
    ctaText: "P.S. - Want to see your business's Profit Gap and Value Gap specific to your industry?",
    ctaButtonText: "Book Your Free Working Session",
  },
  "business-independence-blueprint": {
    subject: "Your Business Independence Blueprint Results",
    previewText: "Your Biggest Opportunities for Independence are Ready",
    heading: "Your Blueprint Is Ready",
    description: "Here are your personalized Business Independence Blueprint results - showing how dependent your business is on you and where the biggest opportunities for independence are.",
    buttonText: "View Your Blueprint",
    ctaUrl: "https://www.kriczkyvirtus.com/free-session",
    ctaText: "P.S. - Want help executing these improvements for your business?",
    ctaButtonText: "Book Your Free Working Session",
  },
  "structural-capital-deep-dive": {
    subject: "Your Structural Capital Deep Dive Results",
    previewText: "How your systems, processes, and intellectual property score against best-in-class benchmarks.",
    heading: "Your Structural Capital Results Are Ready",
    description: "Here's your personalized Structural Capital Deep Dive - showing how your systems, processes, and intellectual property score against best-in-class benchmarks.",
    buttonText: "View Your Results",
    ctaUrl: "https://www.kriczkyvirtus.com/free-session",
    ctaText: "P.S. - Want help identifying where the biggest ROI opportunities are?",
    ctaButtonText: "Book Your Free Working Session",
  },
  "customer-capital-deep-dive": {
    subject: "Your Customer Capital Deep Dive Results",
    previewText: "How your revenue quality, customer concentration, and recurring revenue score against best-in-class benchmarks.",
    heading: "Your Customer Capital Results Are Ready",
    description: "Here's your personalized Customer Capital Deep Dive - showing how your revenue quality, customer concentration, and recurring revenue score against best-in-class benchmarks.",
    buttonText: "View Your Results",
    ctaUrl: "https://www.kriczkyvirtus.com/free-session",
    ctaText: "P.S. - Want help identifying where the biggest ROI opportunities are?",
    ctaButtonText: "Book Your Free Working Session",
  },
  "human-capital-deep-dive": {
    subject: "Your Human Capital Deep Dive Results",
    previewText: "How your team depth, management succession, and talent retention score against best-in-class benchmarks.",
    heading: "Your Human Capital Results Are Ready",
    description: "Here's your personalized Human Capital Deep Dive - showing how your team depth, management succession, and talent retention score against best-in-class benchmarks.",
    buttonText: "View Your Results",
    ctaUrl: "https://www.kriczkyvirtus.com/free-session",
    ctaText: "P.S. - Want help identifying where the biggest ROI opportunities are?",
    ctaButtonText: "Book Your Free Working Session",
  },
  // Short slug aliases for Capital Deep Dive tools
  "structural-capital": {
    subject: "Your Structural Capital Deep Dive Results",
    previewText: "How your systems, processes, and intellectual property score against best-in-class benchmarks.",
    heading: "Your Structural Capital Results Are Ready",
    description: "Here's your personalized Structural Capital Deep Dive - showing how your systems, processes, and intellectual property score against best-in-class benchmarks.",
    buttonText: "View Your Results",
    ctaUrl: "https://www.kriczkyvirtus.com/free-session",
    ctaText: "P.S. - Want help identifying where the biggest ROI opportunities are?",
    ctaButtonText: "Book Your Free Working Session",
  },
  "customer-capital": {
    subject: "Your Customer Capital Deep Dive Results",
    previewText: "How your revenue quality, customer concentration, and recurring revenue score against best-in-class benchmarks.",
    heading: "Your Customer Capital Results Are Ready",
    description: "Here's your personalized Customer Capital Deep Dive - showing how your revenue quality, customer concentration, and recurring revenue score against best-in-class benchmarks.",
    buttonText: "View Your Results",
    ctaUrl: "https://www.kriczkyvirtus.com/free-session",
    ctaText: "P.S. - Want help identifying where the biggest ROI opportunities are?",
    ctaButtonText: "Book Your Free Working Session",
  },
  "human-capital": {
    subject: "Your Human Capital Deep Dive Results",
    previewText: "How your team depth, management succession, and talent retention score against best-in-class benchmarks.",
    heading: "Your Human Capital Results Are Ready",
    description: "Here's your personalized Human Capital Deep Dive - showing how your team depth, management succession, and talent retention score against best-in-class benchmarks.",
    buttonText: "View Your Results",
    ctaUrl: "https://www.kriczkyvirtus.com/free-session",
    ctaText: "P.S. - Want help identifying where the biggest ROI opportunities are?",
    ctaButtonText: "Book Your Free Working Session",
  },
  "reinvest-harvest": {
    subject: "Your Reinvest or Harvest results",
    previewText: "Where the next dollar should go - and why.",
    heading: "Your Reinvest or Harvest Scorecard",
    description: "You scored your business capacity and your personal foundation separately, because the reinvest-or-harvest question depends on both. Your results show which side is carrying you right now, the two dimensions holding your position back, and three moves you can start this month.",
    buttonText: "View Your Results",
    ctaUrl: "https://www.kriczkyvirtus.com/free-session",
    ctaText: "P.S. - ready to decide where the next dollar should go with your real numbers?",
    ctaButtonText: "Book your free working session",
  },
  "recurring-revenue-12cs": {
    subject: "Your 12 Cs Recurring Revenue Score",
    previewText: "Your scored 15-page recurring revenue roadmap",
    heading: "Your Recurring Revenue Score Is Ready",
    description: "Here's your scored copy of the 12 Cs roadmap - your twelve dimension scores, your total stickiness score, and the specific action steps under each one.",
    buttonText: "View Your Scored Roadmap",
    ctaUrl: "https://www.kriczkyvirtus.com/free-session",
    ctaText: "P.S. - want help turning the two lowest scores into a plan?",
    ctaButtonText: "Book Your Free Working Session",
    bcc: "ekriczky@kriczkyvirtus.com",
  },
};

const COHORT_CONFIRMATION_TEXT = ({ firstName }) => `Hi ${firstName},

Your cohort application came through - thanks for taking the time on it.

I read every one of these personally. If there's a fit, I'll reach out when the next cohort opens with details on timing and seats. If there isn't, I'll tell you that too, and point you somewhere more useful.

Rooting for you,
Edward

You are receiving this email because you opted-in through our website.

Kriczky Virtus, LLC
237 Roosevelt Avenue
Downingtown, PA 19335

This message, including any hypothetical scenarios described, is provided for informational and illustrative purposes only and does not constitute professional advice. These scenarios are hypothetical and are not indicative of any specific outcome or past performance. Results will vary based on individual efforts and external factors. We make no promises or guarantees regarding your success or income level.

Please note that individual successes are influenced by personal abilities, market conditions, and other external factors. We assume no responsibility for decisions made or actions taken based on the content of this email. Always consult with qualified professionals before making significant business decisions.`;

/* ═══════════════════════════════════════════════════════════════
   PLAIN-TEXT STYLE (October 2026). Every automated email now matches the
   Reinvest or Harvest and Value Drivers results emails: white, one column,
   reads as written by a person, nothing to break in Outlook or dark mode.
   The wording is unchanged from the old dark template; only the design and
   the em dashes (now " - ") changed.
   ═══════════════════════════════════════════════════════════════ */
const P = "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:15px;line-height:24px;color:#222222;margin:0 0 18px;";
const LINK = "color:#1155cc;text-decoration:underline;font-weight:bold;";
const FOOT = "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:12px;line-height:18px;color:#888888;";
const DISCLAIMER_1 = "This message, including any hypothetical scenarios described, is provided for informational and illustrative purposes only and does not constitute professional advice. These scenarios are hypothetical and are not indicative of any specific outcome or past performance. Results will vary based on individual efforts and external factors. We make no promises or guarantees regarding your success or income level.";
const DISCLAIMER_2 = "Please note that individual successes are influenced by personal abilities, market conditions, and other external factors. We assume no responsibility for decisions made or actions taken based on the content of this email. Always consult with qualified professionals before making significant business decisions.";

const noDash = (s = "") => String(s).replace(/\s*(?:—|&mdash;|&#8212;)\s*/g, " - ");
const unsubUrl = (email) => "https://www.kriczkyvirtus.com/unsubscribe?email=" + encodeURIComponent(email);

/* The page around the body: preheader, one 560px column, the small grey footer. */
function plainEmailHtml({ previewText, bodyHtml, email, includeUnsubscribe = true }) {
  return '<!DOCTYPE html>\n<html>\n<head>\n<meta charset="utf-8" />\n<meta name="viewport" content="width=device-width,initial-scale=1" />\n</head>\n' +
    '<body style="margin:0;padding:0;background-color:#ffffff;">\n' +
    '<div style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">' + noDash(previewText) + '</div>\n' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;">\n' +
    '<tr><td align="left" style="padding:24px 20px 40px;">\n' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">\n<tr><td>\n\n' +
    noDash(bodyHtml) + '\n\n' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:32px;border-top:1px solid #e4e4e4;">\n' +
    '<tr><td style="padding-top:16px;' + FOOT + '">\n' +
    'You are receiving this email because you opted-in through our website.<br /><br />\n' +
    'Kriczky Virtus, LLC &middot; 237 Roosevelt Avenue &middot; Downingtown, PA 19335' +
    (includeUnsubscribe ? ' &middot; <a href="' + unsubUrl(email) + '" style="color:#888888;">Unsubscribe</a>' : '') + '<br /><br />\n' +
    DISCLAIMER_1 + '<br /><br />\n' + DISCLAIMER_2 + '\n' +
    '</td></tr>\n</table>\n\n</td></tr>\n</table>\n</td></tr>\n</table>\n</body>\n</html>';
}

function plainEmailText({ bodyText, email, includeUnsubscribe = true }) {
  return noDash(bodyText) + "\n\n---\n" +
    "You are receiving this email because you opted-in through our website.\n\n" +
    "Kriczky Virtus, LLC\n237 Roosevelt Avenue\nDowningtown, PA 19335\n" +
    (includeUnsubscribe ? "Unsubscribe: " + unsubUrl(email) + "\n" : "") + "\n" +
    DISCLAIMER_1 + "\n\n" + DISCLAIMER_2;
}

const p = (html) => '<p style="' + P + '">' + html + '</p>\n';
const a = (href, label) => '<a href="' + href + '" style="' + LINK + '">' + label + '</a>';
/* "P.S. — text" → "P.S. - text" */
const ps = (s) => noDash(s);

/* The standard results email: greeting, what it is, the link, sign-off, P.S. */
function buildBrandedEmailHtml({
  firstName,
  email,
  previewText,
  description,
  descriptionHtml,
  resultsUrl,
  buttonText,
  ctaText,
  ctaUrl,
  ctaButtonText,
  signoffIntro = "Hopefully this helps you build financial freedom through your business,",
  includeCta = true,
  includeUnsubscribe = true,
}) {
  const body = p(firstName + ",") +
    (descriptionHtml || p(description)) +
    (includeCta ? p(a(resultsUrl, buttonText)) : "") +
    p(signoffIntro + "<br />\nEdward Kriczky, CEPA&reg;") +
    (includeCta ? p(ps(ctaText) + " " + a(ctaUrl, ctaButtonText)) : "");
  return plainEmailHtml({ previewText, bodyHtml: body, email, includeUnsubscribe });
}

function buildPlainText({ firstName, email, description, resultsUrl, buttonText, ctaText, ctaUrl, ctaButtonText,
  signoffIntro = "Hopefully this helps you build financial freedom through your business,", includeCta = true, includeUnsubscribe = true }) {
  const body = firstName + ",\n\n" + description + "\n\n" +
    (includeCta ? buttonText + ":\n" + resultsUrl + "\n\n" : "") +
    signoffIntro + "\nEdward Kriczky, CEPA®" +
    (includeCta ? "\n\n" + ctaText + " " + ctaButtonText + ":\n" + ctaUrl : "");
  return plainEmailText({ bodyText: body, email, includeUnsubscribe });
}

/**
 * Send a results email to a lead.
 *
 * @param {Object} params
 * @param {string} params.name
 * @param {string} params.email
 * @param {string} params.tool - tool identifier
 * @param {string} params.resultsUrl - proxy URL to their results
 */
async function sendResultsEmail({ name, email, tool, resultsUrl }) {
  // Check if email is on the unsubscribe list before sending
  try {
    const { google } = require("googleapis");
    const credentials = JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS);
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const sheets = google.sheets({ version: "v4", auth });
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

    const result = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "'Unsubscribed'!B:B",
    });

    const unsubscribedEmails = (result.data.values || []).flat().map(e => e.toLowerCase());
    if (unsubscribedEmails.includes(email.toLowerCase())) {
      console.log(`[Email] Skipping send to ${email} — on unsubscribe list`);
      return { skipped: true, reason: "unsubscribed" };
    }
  } catch (checkErr) {
    // If the check fails, proceed with sending — don't block on this
    console.error("[Email] Unsubscribe check failed:", checkErr.message);
  }

  const resend = getResend();
  const firstName = name.split(" ")[0] || name;

  // ── Custom template: valuation questionnaire, workshop pre-work ───────────
  // (/workshop-rh/snapshot) - no call to book: the Snapshot is built for the workshop.
  if (tool === "valuation-questionnaire-workshop") {
    const customHtml = plainEmailHtml({
      previewText: "We received your answers. Your Snapshot will be ready at the workshop.",
      email,
      bodyHtml:
        p("Hey " + firstName + ",") +
        p("Thanks for filling out the 14-question Snapshot. We received your answers.") +
        p("There's nothing to book. We'll build your personalized Profit &amp; Valuation Gaps Snapshot from your answers, benchmarked against recent deals in your industry, and have it ready for you at the workshop.") +
        p("<strong>At the workshop, we'll walk through it together:</strong>") +
        '<ul style="' + P + 'margin:0 0 18px;padding-left:22px">\n' +
          '<li style="margin:0 0 6px">How much profit you\'re likely leaving on the table each year vs peers your size</li>\n' +
          '<li style="margin:0 0 6px">What buyers are actually paying for businesses in your industry</li>\n' +
          '<li style="margin:0">The &ldquo;valuation gap&rdquo; between where you are and where you could reasonably be</li>\n' +
        '</ul>\n' +
        p("Whether you're building to sell, building to keep, or building to hand down, the path towards any of those goals is the same. The decisions along the way and where you should lean between &ldquo;Reinvest vs Harvest&rdquo; over time are simply what change.") +
        p("See you at the workshop,<br />\nEdward"),
    });
    const customText = plainEmailText({
      email,
      bodyText: "Hey " + firstName + ",\n\n" +
        "Thanks for filling out the 14-question Snapshot. We received your answers.\n\n" +
        "There's nothing to book. We'll build your personalized Profit & Valuation Gaps Snapshot from your answers, benchmarked against recent deals in your industry, and have it ready for you at the workshop.\n\n" +
        "At the workshop, we'll walk through it together:\n\n" +
        "• How much profit you're likely leaving on the table each year vs peers your size\n" +
        "• What buyers are actually paying for businesses in your industry\n" +
        "• The “valuation gap” between where you are and where you could reasonably be\n\n" +
        "Whether you're building to sell, building to keep, or building to hand down, the path towards any of those goals is the same. The decisions along the way and where you should lean between “Reinvest vs Harvest” over time are simply what change.\n\n" +
        "See you at the workshop,\nEdward",
    });
    try {
      const result = await resend.emails.send({
        from: "Edward Kriczky <growth@kriczkyvirtus.com>",
        replyTo: "ekriczky@kriczkyvirtus.com",
        to: email,
        subject: "Your Snapshot will be ready for you at the workshop",
        html: customHtml,
        text: customText,
      });
      console.log(`[Email] Sent workshop Snapshot confirmation to ${email} — id: ${result.data?.id || "unknown"}`);
    } catch (err) {
      console.error(`[Email] Failed to send workshop Snapshot confirmation to ${email}:`, err.message);
    }
    return;
  }

  // ── Custom template: valuation-questionnaire ──────────────────────────────
  if (tool === "valuation-questionnaire") {
    const SNAP = "https://app.iclosed.io/e/kriczkyvirtus/profit-valuation-snapshot";
    const customHtml = plainEmailHtml({
      previewText: "We received your answers. Here's how to review your numbers.",
      email,
      bodyHtml:
        p("Hey " + firstName + ",") +
        p("Thanks for filling out the 14-question Snapshot. We received your answers.") +
        p("Next step is simple: pick a 30-minute video call time so I can pull your Profit Gap &amp; Valuation Gap using live deal comps specific to your industry and walk you through what it means.") +
        p("<strong>On the call, we'll cover:</strong><br />\n" +
          "- How much profit you're likely leaving on the table each year vs peers your size<br />\n" +
          "- What buyers are actually paying for businesses in your industry<br />\n" +
          "- The &ldquo;valuation gap&rdquo; between where you are and where you could reasonably be") +
        p("I don't send raw numbers by email because, in my world, numbers without context are dangerous and usually misinterpreted. The call is where we translate the Snapshot into clear decisions and next steps for your business.") +
        p(a(SNAP, "Schedule Your Snapshot Review")) +
        p("Talk soon,<br />\nEdward"),
    });
    const customText = plainEmailText({
      email,
      bodyText: "Hey " + firstName + ",\n\n" +
        "Thanks for filling out the 14-question Snapshot. We received your answers.\n\n" +
        "Next step is simple: pick a 30-minute video call time so I can pull your Profit Gap & Valuation Gap using live deal comps specific to your industry and walk you through what it means.\n\n" +
        "On the call, we'll cover:\n" +
        "- How much profit you're likely leaving on the table each year vs peers your size\n" +
        "- What buyers are actually paying for businesses in your industry\n" +
        "- The “valuation gap” between where you are and where you could reasonably be\n\n" +
        "I don't send raw numbers by email because, in my world, numbers without context are dangerous and usually misinterpreted. The call is where we translate the Snapshot into clear decisions and next steps for your business.\n\n" +
        "Schedule Your Snapshot Review:\n" + SNAP + "\n\n" +
        "Talk soon,\nEdward",
    });
    try {
      const result = await resend.emails.send({
        from: "Edward Kriczky <growth@kriczkyvirtus.com>",
        replyTo: "ekriczky@kriczkyvirtus.com",
        to: email,
        subject: "Your Profit & Valuation Snapshot (next step)",
        html: customHtml,
        text: customText,
      });
      console.log(`[Email] Sent Snapshot follow-up to ${email} — id: ${result.data?.id || "unknown"}`);
    } catch (err) {
      console.error(`[Email] Failed to send Snapshot follow-up to ${email}:`, err.message);
    }
    return;
  }

  const details = TOOL_DETAILS[tool] || TOOL_DETAILS["constraint-roadmap"];

  const html = buildBrandedEmailHtml({
    firstName,
    email,
    previewText: details.previewText,
    heading: details.heading,
    description: details.description,
    resultsUrl,
    buttonText: details.buttonText,
    ctaText: details.ctaText,
    ctaUrl: details.ctaUrl,
    ctaButtonText: details.ctaButtonText,
  });
  const text = buildPlainText({
    firstName,
    email,
    description: details.description,
    resultsUrl,
    buttonText: details.buttonText,
    ctaText: details.ctaText,
    ctaUrl: details.ctaUrl,
    ctaButtonText: details.ctaButtonText,
  });

  try {
    const result = await resend.emails.send({
      from: "Edward Kriczky <growth@kriczkyvirtus.com>",
      replyTo: "ekriczky@kriczkyvirtus.com",
      to: email,
      ...(details.bcc ? { bcc: details.bcc } : {}),
      subject: details.subject,
      html,
      text,
    });
    console.log(`[Email] Sent "${details.subject}" to ${email} — id: ${result.data?.id || "unknown"}`);
    return result;
  } catch (err) {
    console.error(`[Email] Failed to send to ${email}:`, err.message);
    throw err;
  }
}

async function sendCohortConfirmationEmail({ name, email }) {
  const resend = getResend();
  const firstName = name.trim().split(/\s+/)[0] || name;
  const text = COHORT_CONFIRMATION_TEXT({ firstName });
  const html = buildBrandedEmailHtml({
    firstName,
    email,
    previewText: "Your cohort application came through.",
    heading: "Got your application",
    descriptionHtml:
      p("Your cohort application came through - thanks for taking the time on it.") +
      p("I read every one of these personally. If there's a fit, I'll reach out when the next cohort opens with details on timing and seats. If there isn't, I'll tell you that too, and point you somewhere more useful."),
    signoffIntro: "Rooting for you,",
    includeCta: false,
    includeUnsubscribe: false,
  });

  const result = await resend.emails.send({
    from: "Edward Kriczky <growth@kriczkyvirtus.com>",
    replyTo: "ekriczky@kriczkyvirtus.com",
    to: email,
    subject: "Got your application",
    html,
    text,
  });
  console.log(`[Email] Sent cohort application confirmation to ${name} <${email}> — id: ${result.data?.id || "unknown"}`);
  return result;
}

module.exports = { sendResultsEmail, sendCohortConfirmationEmail };
