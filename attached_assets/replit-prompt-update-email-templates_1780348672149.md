# Replit Agent Prompt — Update Email Templates for All 6 Tools

## Overview
Update the email templates in `lib/email.js` with new copy, layout, and footer/disclaimer across all 6 tools.

## Changes That Apply to ALL 6 Tools

### Change 0: Host the logo image
I'm providing a logo image file (`kriczky-virtus-email-logo.png`). Place it in the site's public/static assets directory so it's served at:

`https://www.kriczkyvirtus.com/images/kriczky-virtus-email-logo.png`

The exact file path depends on the project structure — it might be `artifacts/kriczky-virtus/public/images/` or similar. Put it wherever static images are served from, and make sure the URL above resolves to the image after deployment.

### Change 1: Update the "from" name
Find the `resend.emails.send()` call and change the `from` field:

```javascript
// Before:
from: "Kriczky Virtus <growth@kriczkyvirtus.com>",

// After:
from: "Edward Kriczky <growth@kriczkyvirtus.com>",
```

### Change 2: Add preview text support
Add a `previewText` field to each tool in the `TOOL_DETAILS` object (values listed below in the tool-specific section).

In the email HTML template, add the preview text right after the `<body>` tag. Preview text is hidden visually but shows in email client previews:

```html
<body style="margin: 0; padding: 0; background-color: #0A0E14; font-family: Arial, Helvetica, sans-serif;">
  <!-- Preview text (hidden, shows in email client preview) -->
  <div style="display: none; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #0A0E14;">
    ${details.previewText}
    &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847;
  </div>
```

The `&#847;` characters are invisible spacers that prevent email clients from pulling in body text after the preview.

### Change 3: Reduce primary button font size on mobile
Add a responsive style block to the email HTML. Put this inside the `<head>` tag:

```html
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
```

Then update the primary button link to use a class:

```html
<a href="${resultsUrl}" target="_blank" class="primary-btn-text" style="color: #C8A24E; font-size: 14px; font-weight: 700; text-decoration: none; letter-spacing: 0.02em;">
  ${details.buttonText}
</a>
```

### Change 4: Add sign-off between primary button and divider
After the primary button table and BEFORE the `<hr>` divider, add:

```html
              <!-- Sign-off -->
              <p style="font-size: 14px; color: #8B95A5; margin: 32px 0 4px 0; line-height: 1.5;">
                Hopefully this helps you build financial freedom through your business,
              </p>
              <p style="font-size: 14px; color: #E8ECF1; margin: 0 0 32px 0; font-weight: 600;">
                - Edward Kriczky
              </p>
```

### Change 5: Update the footer
Replace the entire footer section (after the main card closing `</td></tr>`) with:

```html
          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top: 32px;">
              <!-- Logo -->
              <table cellpadding="0" cellspacing="0" style="margin-bottom: 16px;">
                <tr>
                  <td align="center">
                    <img src="https://www.kriczkyvirtus.com/images/kriczky-virtus-email-logo.png" alt="Kriczky Virtus" width="240" style="width: 240px; height: auto; display: block;" />
                  </td>
                </tr>
              </table>
              
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
```


**Note about Unsubscribe:** The unsubscribe link currently points to `/unsubscribe?email=...` which doesn't exist yet. This is a placeholder — we'll build the unsubscribe page later. For now the link should still be present in the email for compliance purposes.

### Change 6: Update secondary CTA text for Constraint Roadmap
In the `TOOL_DETAILS` object, update the `ctaText` for `"constraint-roadmap"`:

```javascript
ctaText: "P.S. — do you want 1-on-1 help walking through it together so you can start making progress on your 90-day checklist?",
```

## Tool-Specific Preview Text

Update the `TOOL_DETAILS` object to include `previewText` for each tool:

```javascript
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
    subject: "Your Business Value Range Results",
    previewText: "Here are your personalized results from the What's My Business Worth estimator",
    heading: "Your Value Range Estimate Is Ready",
    description: "Here are your personalized results from the What's My Business Worth estimator — including your estimated value range and the key drivers behind it.",
    buttonText: "View Your Results",
    ctaUrl: "https://www.kriczkyvirtus.com/free-session",
    ctaText: "Want to see your actual Profit Gap and Value Gap?",
    ctaButtonText: "Book Your Free Working Session",
  },
  "business-independence-blueprint": {
    subject: "Your Business Independence Blueprint Results",
    previewText: "Here are your personalized Business Independence Blueprint results",
    heading: "Your Blueprint Is Ready",
    description: "Here are your personalized Business Independence Blueprint results — showing how dependent your business is on you and where the biggest opportunities for independence are.",
    buttonText: "View Your Blueprint",
    ctaUrl: "https://www.kriczkyvirtus.com/free-session",
    ctaText: "Want help turning these insights into action?",
    ctaButtonText: "Book Your Free Working Session",
  },
  "structural-capital-deep-dive": {
    subject: "Your Structural Capital Deep Dive Results",
    previewText: "Here's your personalized Structural Capital Deep Dive",
    heading: "Your Structural Capital Results Are Ready",
    description: "Here's your personalized Structural Capital Deep Dive — showing how your systems, processes, and intellectual property score against best-in-class benchmarks.",
    buttonText: "View Your Results",
    ctaUrl: "https://www.kriczkyvirtus.com/free-session",
    ctaText: "Want to identify where the biggest ROI opportunities are?",
    ctaButtonText: "Book Your Free Working Session",
  },
  "customer-capital-deep-dive": {
    subject: "Your Customer Capital Deep Dive Results",
    previewText: "Here's your personalized Customer Capital Deep Dive",
    heading: "Your Customer Capital Results Are Ready",
    description: "Here's your personalized Customer Capital Deep Dive — showing how your revenue quality, customer concentration, and recurring revenue score against best-in-class benchmarks.",
    buttonText: "View Your Results",
    ctaUrl: "https://www.kriczkyvirtus.com/free-session",
    ctaText: "Want to identify where the biggest ROI opportunities are?",
    ctaButtonText: "Book Your Free Working Session",
  },
  "human-capital-deep-dive": {
    subject: "Your Human Capital Deep Dive Results",
    previewText: "Here's your personalized Human Capital Deep Dive",
    heading: "Your Human Capital Results Are Ready",
    description: "Here's your personalized Human Capital Deep Dive — showing how your team depth, management succession, and talent retention score against best-in-class benchmarks.",
    buttonText: "View Your Results",
    ctaUrl: "https://www.kriczkyvirtus.com/free-session",
    ctaText: "Want to identify where the biggest ROI opportunities are?",
    ctaButtonText: "Book Your Free Working Session",
  },
};
```

## Complete Updated HTML Template

Replace the entire `html` template string in the `sendResultsEmail` function with:

```javascript
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
  <!-- Preview text -->
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
            <td align="center" style="padding-bottom: 32px;">
              <img src="https://www.kriczkyvirtus.com/images/kriczky-virtus-email-logo.png" alt="Kriczky Virtus" width="200" style="width: 200px; height: auto; display: block;" />
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

              <!-- Sign-off -->
              <p style="font-size: 14px; color: #8B95A5; margin: 0 0 4px 0; line-height: 1.5;">
                Hopefully this helps you build financial freedom through your business,
              </p>
              <p style="font-size: 14px; color: #E8ECF1; margin: 0 0 32px 0; font-weight: 600;">
                - Edward Kriczky
              </p>

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
                  <td align="center">
                    <img src="https://www.kriczkyvirtus.com/images/kriczky-virtus-email-logo.png" alt="Kriczky Virtus" width="240" style="width: 240px; height: auto; display: block;" />
                  </td>
                </tr>
              </table>
              
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
```

## Critical Instructions
- Replace the ENTIRE `TOOL_DETAILS` object with the version above (includes `previewText` for all tools and updated `ctaText` for Constraint Roadmap)
- Replace the ENTIRE HTML template string with the version above
- Update the `from` field in `resend.emails.send()` to "Edward Kriczky"
- These changes apply to ALL 6 tools — there is only one HTML template shared across all tools, parameterized by `TOOL_DETAILS`
- The unsubscribe link is a placeholder URL — the `/unsubscribe` page doesn't exist yet but the link must be present
- Do NOT change the `sendResultsEmail` function signature, the Resend API call structure, or any other logic
- Test by running through any tool and checking the received email
