# Replit Agent Prompt — Add /valuation-estimate Questionnaire + Email Answers to Edward

## Part 1: Add the page

1. **Add the component file.** Place `ValuationEstimate.jsx` in the same directory as the other page components.

2. **Add the route.** In the app's router:
   ```jsx
   import ValuationEstimate from "./ValuationEstimate";
   <Route path="/valuation-estimate" element={<ValuationEstimate />} />
   ```

3. **Do NOT modify the component code.**

## Part 2: Handle the submission in lead-capture.js

The questionnaire submits to `POST /api/lead-capture` with this payload:
```json
{
  "name": "First Last",
  "email": "...",
  "businessName": "...",
  "tool": "valuation-questionnaire",
  "answers": {
    "q1": { "question": "What is your annual revenue?", "answer": "$2,500,000" },
    "q2": { "question": "What is your annual EBITDA?", "answer": "$400,000" },
    "q3": { "question": "How diverse is your customer base?", "answer": "We have a diverse..." },
    ...
  },
  "utmSource": "linkedin",
  "utmCampaign": null,
  "timestamp": "..."
}
```

### Update `api/lead-capture.js`:

1. The existing code already handles name, email, Google Sheets, and ActiveCampaign. It should work for this tool without changes to those flows — just make sure the tool name `"valuation-questionnaire"` doesn't cause errors anywhere.

2. **Add a notification email to Edward** when this specific tool is submitted. After the existing Resend email send (or in place of it, since we don't send results to the user for this tool), add:

```javascript
// For valuation-questionnaire: email the answers to Edward instead of to the user
if (tool === "valuation-questionnaire") {
  try {
    const { Resend } = require("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    const answersObj = req.body.answers || {};
    const businessName = req.body.businessName || "Not provided";
    
    // Build formatted answer list
    let answersHtml = "";
    const questionOrder = ["q1","q2","q3","q4","q5","q6","q7","q8","q9","q10","q11","q12","q13","q14"];
    for (const qId of questionOrder) {
      const item = answersObj[qId];
      if (item) {
        answersHtml += `
          <tr>
            <td style="padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.06); vertical-align: top;">
              <div style="font-size: 11px; color: #8B95A5; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.05em;">Question ${qId.replace("q","")}</div>
              <div style="font-size: 13px; color: #E8ECF1; font-weight: 600; margin-bottom: 6px;">${item.question}</div>
              <div style="font-size: 13px; color: #C8A24E; line-height: 1.5;">${item.answer}</div>
            </td>
          </tr>`;
      }
    }

    await resend.emails.send({
      from: "Kriczky Virtus <growth@kriczkyvirtus.com>",
      to: "ekriczky@kriczkyvirtus.com",
      subject: `New Valuation Questionnaire: ${name} — ${businessName}`,
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin: 0; padding: 0; background-color: #0A0E14; font-family: Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0A0E14; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">
          <tr>
            <td style="background-color: #111720; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 32px 24px;">
              <h1 style="font-family: Georgia, serif; font-size: 22px; color: #E8ECF1; margin: 0 0 8px; font-weight: 400;">New Valuation Questionnaire Submitted</h1>
              <table cellpadding="0" cellspacing="0" style="margin: 16px 0 24px;">
                <tr><td style="font-size: 13px; color: #8B95A5; padding: 4px 0;"><strong style="color: #E8ECF1;">Name:</strong> ${name}</td></tr>
                <tr><td style="font-size: 13px; color: #8B95A5; padding: 4px 0;"><strong style="color: #E8ECF1;">Business:</strong> ${businessName}</td></tr>
                <tr><td style="font-size: 13px; color: #8B95A5; padding: 4px 0;"><strong style="color: #E8ECF1;">Email:</strong> <a href="mailto:${email}" style="color: #22D3EE;">${email}</a></td></tr>
              </table>
              <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.08); margin: 0 0 16px;">
              <div style="font-size: 10px; color: #5A6474; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 12px;">Answers</div>
              <table width="100%" cellpadding="0" cellspacing="0" style="background: #0A0E14; border-radius: 10px; overflow: hidden;">
                ${answersHtml}
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
    });
    console.log(`[Email] Sent valuation questionnaire notification for ${name} <${email}>`);
  } catch (emailErr) {
    console.error("[Email] Failed to send questionnaire notification:", emailErr.message);
  }
}
```

This sends a formatted email to `ekriczky@kriczkyvirtus.com` with:
- Subject: "New Valuation Questionnaire: [Name] — [Business Name]"
- All 14 answers listed with their question numbers and full question text
- Each answer highlighted in gold so it's easy to scan
- Contact info at the top (name, business, email as a clickable mailto link)

**Important:** For this tool, do NOT send the regular results email to the user (since there are no "results" to share). The thank-you message is shown on-screen. Only Edward gets emailed.

## Part 3: Google Sheets

Add a new tab called `Valuation Questionnaire` to the lead capture spreadsheet.

**Manual step for Edward:** Create a new tab in the Google Sheet called `Valuation Questionnaire` with these column headers:
`Timestamp | Name | Email | Business Name | Revenue | EBITDA | Q3 | Q4 | Q5 | Q6 | Q7 | Q8 | Q9 | Q10 | Q11 | Q12 | Q13 | Q14 | Source | Campaign`

Update the `TOOL_TO_TAB` mapping in `lib/sheets.js`:
```javascript
"valuation-questionnaire": "Valuation Questionnaire",
```

For this tool, the `appendLead` function should write individual answers to their own columns instead of dumping JSON into a single cell. You may need to add special handling:

```javascript
if (tool === "valuation-questionnaire") {
  const a = answers || {};
  const row = [
    estTimestamp, name, email,
    req.body.businessName || "",
    a.q1?.answer || "", a.q2?.answer || "",
    a.q3?.answer || "", a.q4?.answer || "",
    a.q5?.answer || "", a.q6?.answer || "",
    a.q7?.answer || "", a.q8?.answer || "",
    a.q9?.answer || "", a.q10?.answer || "",
    a.q11?.answer || "", a.q12?.answer || "",
    a.q13?.answer || "", a.q14?.answer || "",
    source, campaign,
  ];
  // Write to Valuation Questionnaire tab (A:T = 20 columns)
}
```

## Part 4: ActiveCampaign

Add the tool name to the `TOOL_TAGS` mapping in `lib/activecampaign.js`:
```javascript
"valuation-questionnaire": "Tool: Valuation Questionnaire",
```

The existing `syncContact` flow will auto-apply: `Website Lead`, `Tool: Valuation Questionnaire`, `Source: [utm]`, `Campaign: [utm]`.

## Critical Instructions
- Do NOT modify the ValuationEstimate.jsx component code
- The notification email goes to Edward (`ekriczky@kriczkyvirtus.com`), NOT to the user
- The regular user-facing results email should NOT be sent for this tool
- Each answer in the email must be clearly labeled with its question number and full question text
- The Google Sheets row should have individual columns per answer, not a JSON blob
