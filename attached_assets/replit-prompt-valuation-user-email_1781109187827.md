# Replit Agent Prompt — Send Automated Email to User After Valuation Questionnaire Submission

## Overview
When someone completes the 14-question Valuation Estimate questionnaire and clicks Submit, send them an automated email via Resend with instructions to book their Snapshot Review call. This is IN ADDITION to the existing notification email sent to Edward.

## Step 1: Add valuation-questionnaire to TOOL_DETAILS in lib/email.js

Add this entry to the `TOOL_DETAILS` object:

```javascript
"valuation-questionnaire": {
    subject: "Your Profit & Valuation Snapshot (next step)",
    previewText: "We've got your data. Here's how to review your numbers.",
    heading: null,  // This tool uses a custom email template (see below)
    buttonText: "Schedule Your Snapshot Review",
    ctaUrl: "https://app.iclosed.io/e/kriczkyvirtus/profit-valuation-snapshot",
},
```

## Step 2: Add custom email template for this tool

The valuation questionnaire email has a different structure than the other tool emails. Instead of the standard template with heading/description/primary button/secondary CTA, it uses a conversational letter format.

In `lib/email.js`, in the `sendResultsEmail` function, add a check for this tool BEFORE the standard template renders. If the tool is `valuation-questionnaire`, use this custom HTML instead:

```javascript
if (tool === "valuation-questionnaire") {
  const customHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #0A0E14; font-family: Arial, Helvetica, sans-serif;">
  <!-- Preview text -->
  <div style="display: none; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #0A0E14;">
    We've got your data. Here's how to review your numbers.
    &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847;
  </div>

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0A0E14; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">
          
          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom: 32px;">
              <img src="https://www.kriczkyvirtus.com/images/kriczky-virtus-email-logo.png" alt="Kriczky Virtus" width="200" style="width: 200px; height: auto; display: block;" />
            </td>
          </tr>

          <!-- Main Card -->
          <tr>
            <td style="background-color: #111720; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 40px 32px;">
              
              <!-- Greeting -->
              <p style="font-size: 15px; color: #E8ECF1; margin: 0 0 20px 0; line-height: 1.5;">
                Hey ${firstName},
              </p>

              <p style="font-size: 14px; color: #8B95A5; margin: 0 0 20px 0; line-height: 1.65;">
                Thanks for filling out the 14-question Snapshot. We've got your data.
              </p>

              <p style="font-size: 14px; color: #8B95A5; margin: 0 0 20px 0; line-height: 1.65;">
                Next step is simple: pick a 30-minute Zoom time so I can pull your Profit Gap & Valuation Gap using live deal comps specific to your industry and walk you through what it means.
              </p>

              <!-- What we'll cover -->
              <p style="font-size: 14px; color: #E8ECF1; margin: 0 0 10px 0; line-height: 1.5; font-weight: 600;">
                On the call, we'll cover:
              </p>
              <table cellpadding="0" cellspacing="0" style="margin: 0 0 20px 0;">
                <tr>
                  <td style="padding: 3px 0; font-size: 14px; color: #8B95A5; line-height: 1.65;">
                    <span style="color: #C8A24E; margin-right: 8px;">&ndash;</span> How much profit you're likely leaving on the table each year vs peers your size
                  </td>
                </tr>
                <tr>
                  <td style="padding: 3px 0; font-size: 14px; color: #8B95A5; line-height: 1.65;">
                    <span style="color: #C8A24E; margin-right: 8px;">&ndash;</span> What buyers are actually paying for businesses in your industry
                  </td>
                </tr>
                <tr>
                  <td style="padding: 3px 0; font-size: 14px; color: #8B95A5; line-height: 1.65;">
                    <span style="color: #C8A24E; margin-right: 8px;">&ndash;</span> The &ldquo;valuation gap&rdquo; between where you are and where you could reasonably be
                  </td>
                </tr>
              </table>

              <p style="font-size: 14px; color: #8B95A5; margin: 0 0 24px 0; line-height: 1.65; font-style: italic;">
                I don't send raw numbers by email because, in my world, numbers without context are dangerous and usually misinterpreted. The call is where we translate the Snapshot into clear decisions and next steps for your business.
              </p>

              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0" style="margin: 0 0 28px 0;">
                <tr>
                  <td style="background: linear-gradient(135deg, rgba(200,162,78,0.2), rgba(200,162,78,0.08)); border: 1.5px solid rgba(200,162,78,0.5); border-radius: 12px; padding: 14px 32px;">
                    <a href="https://app.iclosed.io/e/kriczkyvirtus/profit-valuation-snapshot" target="_blank" style="color: #C8A24E; font-size: 14px; font-weight: 700; text-decoration: none; letter-spacing: 0.02em;">
                      Schedule Your Snapshot Review
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Sign-off -->
              <p style="font-size: 14px; color: #8B95A5; margin: 0 0 4px 0; line-height: 1.5;">
                Talk soon,
              </p>
              <p style="font-size: 14px; color: #E8ECF1; margin: 0; font-weight: 600;">
                Edward
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top: 32px;">
              <table cellpadding="0" cellspacing="0" style="margin-bottom: 16px;">
                <tr>
                  <td align="center">
                    <img src="https://www.kriczkyvirtus.com/images/kriczky-virtus-email-logo.png" alt="Kriczky Virtus" width="240" style="width: 240px; height: auto; display: block;" />
                  </td>
                </tr>
              </table>
              
              <p style="font-size: 11px; color: #5A6474; margin: 0; line-height: 1.6;">
                Kriczky Virtus, LLC<br>
                237 Roosevelt Avenue<br>
                Downingtown, PA 19335
              </p>

              <p style="margin: 16px 0;">
                <a href="https://www.kriczkyvirtus.com/unsubscribe?email=${encodeURIComponent(email)}" style="font-size: 11px; color: #8B95A5; text-decoration: underline;">Unsubscribe</a>
              </p>

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
      subject: "Your Profit & Valuation Snapshot (next step)",
      html: customHtml,
    });
    console.log(`[Email] Sent Snapshot follow-up to ${email} — id: ${result.data?.id || "unknown"}`);
  } catch (err) {
    console.error(`[Email] Failed to send Snapshot follow-up to ${email}:`, err.message);
  }
  return;  // Skip the standard template
}
```

Place this block BEFORE the standard email template rendering in `sendResultsEmail`. The `return` at the end ensures the standard template doesn't also send.

## Step 3: Call sendResultsEmail for this tool

In `api/lead-capture.js`, the valuation-questionnaire currently only sends the notification email to Edward and does NOT send an email to the user. Update the logic so that BOTH emails fire for this tool:

1. The notification email to Edward (already exists — keep it)
2. The user-facing email via `sendResultsEmail` (new — add it)

Find the section where Resend emails are sent. For this tool, after the Edward notification, add:

```javascript
// Also send the user-facing Snapshot follow-up email
if (tool === "valuation-questionnaire") {
  try {
    const { sendResultsEmail } = require("../lib/email");
    await sendResultsEmail({
      name,
      email,
      tool: "valuation-questionnaire",
      resultsUrl: "https://app.iclosed.io/e/kriczkyvirtus/profit-valuation-snapshot",
    });
  } catch (userEmailErr) {
    console.error("[Email] Failed to send user Snapshot email:", userEmailErr.message);
  }
}
```

**Important:** This should only fire for FULL submissions (not partial). Make sure it's inside the `if (!isPartial)` block or equivalent.

## Critical Instructions
- The user-facing email uses a CUSTOM template, not the standard tool email template
- The sign-off is "Talk soon, Edward" — NOT "Hopefully this helps you build financial freedom..."
- There is only ONE CTA button: "Schedule Your Snapshot Review" linking to the iClosed booking page
- No secondary CTA
- The notification email to Edward with the answers must STILL send — this is an additional email, not a replacement
- Do NOT send the user email for partial submissions (early capture from step 1)
- The email uses the same footer (logo, address, unsubscribe, disclaimer) as all other emails
