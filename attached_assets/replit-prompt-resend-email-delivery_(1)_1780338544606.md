# Replit Agent Prompt — Resend Email Delivery for All 6 Diagnostic Tools

## Overview
After a user completes any diagnostic tool and submits their name and email, send them a branded email with a link to view their personalized results. The email is sent via Resend.

## Step 1: Install the Resend package

```bash
pnpm add resend -w
```

## Step 2: Create the email helper

Create a new file at the repo root: `lib/email.js`

```javascript
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
    heading: "Your Constraint Roadmap Is Ready",
    description: "Here's your personalized 14-page Constraint Roadmap — built around your scores, your #1 constraint, and three specific moves you can start executing immediately.",
    buttonText: "View Your Constraint Roadmap",
    ctaUrl: "https://www.kriczkyvirtus.com/roadmap-session",
    ctaText: "Ready to walk through it together?",
    ctaButtonText: "Book Your Free Working Session",
  },
  "value-range-estimator": {
    subject: "Your Business Value Range Results",
    heading: "Your Value Range Estimate Is Ready",
    description: "Here are your personalized results from the What's My Business Worth estimator — including your estimated value range and the key drivers behind it.",
    buttonText: "View Your Results",
    ctaUrl: "https://www.kriczkyvirtus.com/free-session",
    ctaText: "Want to see your actual Profit Gap and Value Gap?",
    ctaButtonText: "Book Your Free Working Session",
  },
  "business-independence-blueprint": {
    subject: "Your Business Independence Blueprint Results",
    heading: "Your Blueprint Is Ready",
    description: "Here are your personalized Business Independence Blueprint results — showing how dependent your business is on you and where the biggest opportunities for independence are.",
    buttonText: "View Your Blueprint",
    ctaUrl: "https://www.kriczkyvirtus.com/free-session",
    ctaText: "Want help turning these insights into action?",
    ctaButtonText: "Book Your Free Working Session",
  },
  "structural-capital-deep-dive": {
    subject: "Your Structural Capital Deep Dive Results",
    heading: "Your Structural Capital Results Are Ready",
    description: "Here's your personalized Structural Capital Deep Dive — showing how your systems, processes, and intellectual property score against best-in-class benchmarks.",
    buttonText: "View Your Results",
    ctaUrl: "https://www.kriczkyvirtus.com/free-session",
    ctaText: "Want to identify where the biggest ROI opportunities are?",
    ctaButtonText: "Book Your Free Working Session",
  },
  "customer-capital-deep-dive": {
    subject: "Your Customer Capital Deep Dive Results",
    heading: "Your Customer Capital Results Are Ready",
    description: "Here's your personalized Customer Capital Deep Dive — showing how your revenue quality, customer concentration, and recurring revenue score against best-in-class benchmarks.",
    buttonText: "View Your Results",
    ctaUrl: "https://www.kriczkyvirtus.com/free-session",
    ctaText: "Want to identify where the biggest ROI opportunities are?",
    ctaButtonText: "Book Your Free Working Session",
  },
  "human-capital-deep-dive": {
    subject: "Your Human Capital Deep Dive Results",
    heading: "Your Human Capital Results Are Ready",
    description: "Here's your personalized Human Capital Deep Dive — showing how your team depth, management succession, and talent retention score against best-in-class benchmarks.",
    buttonText: "View Your Results",
    ctaUrl: "https://www.kriczkyvirtus.com/free-session",
    ctaText: "Want to identify where the biggest ROI opportunities are?",
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
 * @param {string} params.resultsUrl - blob URL to their results
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
</head>
<body style="margin: 0; padding: 0; background-color: #0A0E14; font-family: Arial, Helvetica, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0A0E14; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">
          
          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom: 32px;">
              <span style="font-family: Georgia, 'Times New Roman', serif; font-size: 20px; color: #E8ECF1; letter-spacing: 2px; text-transform: uppercase;">KRICZKY <span style="color: #C8A24E;">VIRTUS</span></span>
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
                    <a href="${resultsUrl}" target="_blank" style="color: #C8A24E; font-size: 14px; font-weight: 700; text-decoration: none; letter-spacing: 0.02em;">
                      ${details.buttonText}
                    </a>
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
              <p style="font-size: 11px; color: #5A6474; margin: 0 0 4px 0;">
                Edward Kriczky, CEPA · Founder, Kriczky Virtus
              </p>
              <p style="font-size: 11px; color: #5A6474; margin: 0 0 4px 0;">
                <a href="mailto:ekriczky@kriczkyvirtus.com" style="color: #5A6474; text-decoration: none;">ekriczky@kriczkyvirtus.com</a>
                &nbsp;·&nbsp;
                <a href="https://www.kriczkyvirtus.com" style="color: #5A6474; text-decoration: none;">kriczkyvirtus.com</a>
              </p>
              <p style="font-size: 10px; color: #3D4654; margin: 16px 0 0 0;">
                You're receiving this because you completed a diagnostic tool at kriczkyvirtus.com
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
      from: "Kriczky Virtus <growth@kriczkyvirtus.com>",
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
```

## Step 3: Send email from lead-capture.js (Constraint Roadmap)

In `api/lead-capture.js`, after the roadmap is generated and the Sheets write is done, send the email. Add the import:

```javascript
const { sendResultsEmail } = require("../lib/email");
```

Then after the roadmap generation and Sheets write, add:

```javascript
// Send results email (only if we have a results URL)
if (roadmapUrl) {
  try {
    await sendResultsEmail({
      name,
      email,
      tool: tool || "constraint-roadmap",
      resultsUrl: roadmapUrl,
    });
  } catch (emailErr) {
    console.error("[Email] sendResultsEmail failed:", emailErr);
  }
}
```

## Step 4: Send email from store-results.js (other 5 tools)

In `api/store-results.js`, after the HTML is stored in Blob Storage and the Sheets link is updated, send the email. Add the import:

```javascript
const { sendResultsEmail } = require("../lib/email");
```

Then after the blob upload, add:

```javascript
// Send results email with the blob URL
try {
  await sendResultsEmail({
    name,
    email,
    tool,
    resultsUrl: blob.url,
  });
} catch (emailErr) {
  console.error("[Email] sendResultsEmail failed:", emailErr);
}
```

## Step 5: Make sure the email is awaited

Both the lead-capture and store-results functions should `await` the email send. This is important because if the email is fire-and-forget, the serverless function may shut down before Resend processes it. The email send is fast (usually < 500ms) so the added latency is minimal.

## Step 6: Make HTML files open in browser instead of downloading

The blob URLs for the HTML results are triggering a file download instead of opening in the browser. This is because the Vercel Blob `put()` calls don't specify inline content disposition.

In **both** `api/lead-capture.js` and `api/store-results.js`, find every `put()` call to Vercel Blob Storage and add `contentDisposition: 'inline'`:

In `api/lead-capture.js` (Constraint Roadmap):
```javascript
const blob = await put(`roadmaps/${nameSlug}-${id}.html`, fullHTML, {
  access: "public",
  contentType: "text/html; charset=utf-8",
  addRandomSuffix: false,
  contentDisposition: "inline",
});
```

In `api/store-results.js` (other 5 tools):
```javascript
const blob = await put(`results/${tool}/${nameSlug}-${id}.html`, html, {
  access: "public",
  contentType: "text/html; charset=utf-8",
  addRandomSuffix: false,
  contentDisposition: "inline",
});
```

The `contentDisposition: "inline"` tells the browser to display the file rather than download it. This is especially important on mobile where a downloaded HTML file is confusing.

## Step 7: Auto-download only on desktop, not mobile

In the assessment component (and any other tool components that auto-download + open the results after email submission), update the client-side code that handles the results URL after the API response.

Find the code that triggers the auto-download and opens the new tab. Replace it with a mobile-aware version:

```javascript
if (responseData.roadmapUrl) {
  setRoadmapUrl(responseData.roadmapUrl);
  
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  if (!isMobile) {
    // Desktop only: trigger download
    const downloadLink = document.createElement('a');
    downloadLink.href = responseData.roadmapUrl;
    downloadLink.download = 'Constraint-Roadmap.html';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  // Both desktop and mobile: open in new tab
  setTimeout(() => {
    window.open(responseData.roadmapUrl, '_blank');
  }, isMobile ? 0 : 500);
}
```

Apply this same pattern to all 6 tool components if they have auto-download behavior. Desktop users get the download AND the new tab. Mobile users just get the new tab (no download).

## Testing

After deploying:
1. Go through the Constraint Roadmap assessment, enter your email
2. Check your inbox — you should receive "Your Personalized Constraint Roadmap" from growth@kriczkyvirtus.com
3. Click the button in the email — it should open your personalized roadmap
4. Go through WMBW, enter your email
5. Check inbox — you should receive "Your Business Value Range Results"
6. Repeat for the other tools

Check Vercel Logs for `[Email] Sent` or `[Email] Failed` entries.

## Critical Instructions
- The `from` address MUST be `growth@kriczkyvirtus.com` — this domain must already be verified in Resend
- `RESEND_API_KEY` must be set in Vercel environment variables
- Do NOT change any frontend code
- Do NOT change scoring, roadmap generation, or Sheets logic
- Email send should be awaited, not fire-and-forget
- If the email fails, it should NOT prevent the user from seeing their results — the error is logged but the function still returns success
- The email HTML uses table-based layout for maximum email client compatibility
