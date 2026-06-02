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
    description: "Here's your personalized 14-page Constraint Roadmap — built around your scores, your #1 constraint, and three specific moves you can start executing immediately.",
    buttonText: "View Your Constraint Roadmap",
    ctaUrl: "https://www.kriczkyvirtus.com/roadmap-session",
    ctaText: "P.S. — do you want 1-on-1 help walking through it together so you can start making progress on your 90-day checklist?",
    ctaButtonText: "Book Your Free Working Session",
  },
  "value-range-estimator": {
    subject: "Your \"What's My Business Worth?\" Results",
    previewText: "Your Value Range Estimate Is Ready",
    heading: "Your Value Range Estimate Is Ready",
    description: "Here are your personalized results from the What's My Business Worth estimator — including your estimated value range and the key drivers behind it.",
    buttonText: "View Your Results",
    ctaUrl: "https://www.kriczkyvirtus.com/free-session",
    ctaText: "P.S. — Want to see your business's Profit Gap and Value Gap specific to your industry?",
    ctaButtonText: "Book Your Free Working Session",
  },
  "business-independence-blueprint": {
    subject: "Your Business Independence Blueprint Results",
    previewText: "Your Biggest Opportunities for Independence are Ready",
    heading: "Your Blueprint Is Ready",
    description: "Here are your personalized Business Independence Blueprint results — showing how dependent your business is on you and where the biggest opportunities for independence are.",
    buttonText: "View Your Blueprint",
    ctaUrl: "https://www.kriczkyvirtus.com/free-session",
    ctaText: "P.S. — Want help executing these improvements for your business?",
    ctaButtonText: "Book Your Free Working Session",
  },
  "structural-capital-deep-dive": {
    subject: "Your Structural Capital Deep Dive Results",
    previewText: "How your systems, processes, and intellectual property score against best-in-class benchmarks.",
    heading: "Your Structural Capital Results Are Ready",
    description: "Here's your personalized Structural Capital Deep Dive — showing how your systems, processes, and intellectual property score against best-in-class benchmarks.",
    buttonText: "View Your Results",
    ctaUrl: "https://www.kriczkyvirtus.com/free-session",
    ctaText: "P.S. — Want help identifying where the biggest ROI opportunities are?",
    ctaButtonText: "Book Your Free Working Session",
  },
  "customer-capital-deep-dive": {
    subject: "Your Customer Capital Deep Dive Results",
    previewText: "How your revenue quality, customer concentration, and recurring revenue score against best-in-class benchmarks.",
    heading: "Your Customer Capital Results Are Ready",
    description: "Here's your personalized Customer Capital Deep Dive — showing how your revenue quality, customer concentration, and recurring revenue score against best-in-class benchmarks.",
    buttonText: "View Your Results",
    ctaUrl: "https://www.kriczkyvirtus.com/free-session",
    ctaText: "P.S. — Want help identifying where the biggest ROI opportunities are?",
    ctaButtonText: "Book Your Free Working Session",
  },
  "human-capital-deep-dive": {
    subject: "Your Human Capital Deep Dive Results",
    previewText: "How your team depth, management succession, and talent retention score against best-in-class benchmarks.",
    heading: "Your Human Capital Results Are Ready",
    description: "Here's your personalized Human Capital Deep Dive — showing how your team depth, management succession, and talent retention score against best-in-class benchmarks.",
    buttonText: "View Your Results",
    ctaUrl: "https://www.kriczkyvirtus.com/free-session",
    ctaText: "P.S. — Want help identifying where the biggest ROI opportunities are?",
    ctaButtonText: "Book Your Free Working Session",
  },
  // Short slug aliases for Capital Deep Dive tools
  "structural-capital": {
    subject: "Your Structural Capital Deep Dive Results",
    previewText: "How your systems, processes, and intellectual property score against best-in-class benchmarks.",
    heading: "Your Structural Capital Results Are Ready",
    description: "Here's your personalized Structural Capital Deep Dive — showing how your systems, processes, and intellectual property score against best-in-class benchmarks.",
    buttonText: "View Your Results",
    ctaUrl: "https://www.kriczkyvirtus.com/free-session",
    ctaText: "P.S. — Want help identifying where the biggest ROI opportunities are?",
    ctaButtonText: "Book Your Free Working Session",
  },
  "customer-capital": {
    subject: "Your Customer Capital Deep Dive Results",
    previewText: "How your revenue quality, customer concentration, and recurring revenue score against best-in-class benchmarks.",
    heading: "Your Customer Capital Results Are Ready",
    description: "Here's your personalized Customer Capital Deep Dive — showing how your revenue quality, customer concentration, and recurring revenue score against best-in-class benchmarks.",
    buttonText: "View Your Results",
    ctaUrl: "https://www.kriczkyvirtus.com/free-session",
    ctaText: "P.S. — Want help identifying where the biggest ROI opportunities are?",
    ctaButtonText: "Book Your Free Working Session",
  },
  "human-capital": {
    subject: "Your Human Capital Deep Dive Results",
    previewText: "How your team depth, management succession, and talent retention score against best-in-class benchmarks.",
    heading: "Your Human Capital Results Are Ready",
    description: "Here's your personalized Human Capital Deep Dive — showing how your team depth, management succession, and talent retention score against best-in-class benchmarks.",
    buttonText: "View Your Results",
    ctaUrl: "https://www.kriczkyvirtus.com/free-session",
    ctaText: "P.S. — Want help identifying where the biggest ROI opportunities are?",
    ctaButtonText: "Book Your Free Working Session",
  },
};

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
  const resend = getResend();
  const details = TOOL_DETAILS[tool] || TOOL_DETAILS["constraint-roadmap"];
  const firstName = name.split(" ")[0] || name;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    @media only screen and (max-width: 480px) {
      .primary-btn-text {
        font-size: 12px !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #0A0E14; font-family: Arial, Helvetica, sans-serif;">
  <!-- Preview text (hidden, shows in email client preview) -->
  <div style="display: none; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #0A0E14;">
    ${details.previewText}
    &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847;
  </div>

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0A0E14; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">

          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom: 32px; background-color: #0A0E14;">
              <img src="https://www.kriczkyvirtus.com/images/kriczky-virtus-email-logo.png" alt="Kriczky Virtus" width="200" draggable="false" style="width: 200px; height: auto; display: block; pointer-events: none; background-color: #0A0E14;" />
            </td>
          </tr>

          <!-- Main Card -->
          <tr>
            <td style="background-color: #111720; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 40px 32px;">

              <!-- Greeting -->
              <p style="font-size: 15px; color: #8B95A5; margin: 0 0 24px 0; line-height: 1.5;">
                Hi ${firstName},
              </p>

              <!-- Heading -->
              <h1 style="font-family: Georgia, 'Times New Roman', serif; font-size: 28px; color: #E8ECF1; margin: 0 0 16px 0; font-weight: 400; line-height: 1.2;">
                ${details.heading}
              </h1>

              <!-- Description -->
              <p style="font-size: 15px; color: #8B95A5; margin: 0 0 32px 0; line-height: 1.6;">
                ${details.description}
              </p>

              <!-- Primary Button -->
              <table cellpadding="0" cellspacing="0" style="margin: 0 0 32px 0;">
                <tr>
                  <td style="background: linear-gradient(135deg, rgba(200,162,78,0.2), rgba(200,162,78,0.08)); border: 1.5px solid rgba(200,162,78,0.5); border-radius: 12px; padding: 14px 32px;">
                    <a href="${resultsUrl}" target="_blank" class="primary-btn-text" style="color: #C8A24E; font-size: 14px; font-weight: 700; text-decoration: none; letter-spacing: 0.02em;">
                      ${details.buttonText}
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Sign-off with headshot -->
              <table cellpadding="0" cellspacing="0" style="margin: 0 0 32px 0;">
                <tr>
                  <td style="vertical-align: top; padding-right: 16px; padding-top: 2px;">
                    <img src="https://www.kriczkyvirtus.com/images/edward-kriczky-headshot.jpg" alt="Edward Kriczky" width="52" height="52" draggable="false" style="width: 52px; height: 52px; border-radius: 50%; display: block; object-fit: cover; pointer-events: none;" />
                  </td>
                  <td style="vertical-align: middle;">
                    <p style="font-size: 14px; color: #8B95A5; margin: 0 0 4px 0; line-height: 1.5;">
                      Hopefully this helps you build financial freedom through your business,
                    </p>
                    <p style="font-size: 14px; color: #E8ECF1; margin: 0; font-weight: 600;">
                      Edward Kriczky, CEPA&reg;
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.06); margin: 0 0 24px 0;">

              <!-- Secondary CTA -->
              <p style="font-size: 14px; color: #8B95A5; margin: 0 0 16px 0; line-height: 1.5;">
                ${details.ctaText}
              </p>

              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border: 1px solid rgba(34,211,238,0.3); border-radius: 10px; padding: 12px 24px; background: rgba(34,211,238,0.06);">
                    <a href="${details.ctaUrl}" target="_blank" style="color: #22D3EE; font-size: 13px; font-weight: 600; text-decoration: none;">
                      ${details.ctaButtonText}
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top: 32px;">
              <!-- Logo -->
              <table cellpadding="0" cellspacing="0" style="margin-bottom: 16px;">
                <tr>
                  <td align="center" style="background-color: #0A0E14;">
                    <img src="https://www.kriczkyvirtus.com/images/kriczky-virtus-email-logo.png" alt="Kriczky Virtus" width="240" draggable="false" style="width: 240px; height: auto; display: block; pointer-events: none; background-color: #0A0E14;" />
                  </td>
                </tr>
              </table>

              <!-- Opt-in notice -->
              <p style="font-size: 11px; color: #5A6474; margin: 0 0 12px 0; line-height: 1.6;">
                You are receiving this email because you opted-in through our website.
              </p>

              <!-- Address -->
              <p style="font-size: 11px; color: #5A6474; margin: 0; line-height: 1.6;">
                Kriczky Virtus, LLC<br>
                237 Roosevelt Avenue<br>
                Downingtown, PA 19335
              </p>

              <!-- Unsubscribe -->
              <p style="margin: 16px 0;">
                <a href="https://www.kriczkyvirtus.com/unsubscribe?email=${encodeURIComponent(email)}" style="font-size: 11px; color: #8B95A5; text-decoration: underline;">Unsubscribe</a>
              </p>

              <!-- Disclaimer -->
              <p style="font-size: 9px; color: #3D4654; margin: 8px 0 0 0; line-height: 1.5; max-width: 500px;">
                This message, including any hypothetical scenarios described, is provided for informational and illustrative purposes only and does not constitute professional advice. These scenarios are hypothetical and are not indicative of any specific outcome or past performance. Results will vary based on individual efforts and external factors. We make no promises or guarantees regarding your success or income level.
              </p>
              <p style="font-size: 9px; color: #3D4654; margin: 8px 0 0 0; line-height: 1.5; max-width: 500px;">
                Please note that individual successes are influenced by personal abilities, market conditions, and other external factors. We assume no responsibility for decisions made or actions taken based on the content of this email. Always consult with qualified professionals before making significant business decisions.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  try {
    const result = await resend.emails.send({
      from: "Edward Kriczky <growth@kriczkyvirtus.com>",
      replyTo: "ekriczky@kriczkyvirtus.com",
      to: email,
      subject: details.subject,
      html,
    });
    console.log(`[Email] Sent "${details.subject}" to ${email} — id: ${result.data?.id || "unknown"}`);
    return result;
  } catch (err) {
    console.error(`[Email] Failed to send to ${email}:`, err.message);
    throw err;
  }
}

module.exports = { sendResultsEmail };
