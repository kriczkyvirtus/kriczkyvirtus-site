# Replit Agent Prompt — Fix Business Name + Headline on Valuation Estimate

## Fix 1: Business Name STILL not captured in Google Sheets

This has failed twice. Let's diagnose directly.

### Step A: Add a log to confirm the value is received
In `api/lead-capture.js`, right after extracting the request body fields, add:

```javascript
console.log("[Lead] businessName:", req.body.businessName);
```

### Step B: Verify the appendLead function signature
Run this in the shell and share the output:
```bash
grep -n "async function appendLead" lib/sheets.js
grep -n "businessName" lib/sheets.js
grep -n "businessName" api/lead-capture.js
```

This will show whether `businessName` actually appears in both files. If it shows 0 results for either file, that's the problem — the code wasn't added.

### Step C: If businessName is missing from lib/sheets.js, add it manually

Open `lib/sheets.js`. Find the `appendLead` function definition line. It will look something like:

```javascript
async function appendLead({ name, email, tool, summary, answers, timestamp, blobUrl, utmSource, utmCampaign }) {
```

Add `businessName` to that parameter list:

```javascript
async function appendLead({ name, email, tool, summary, answers, timestamp, blobUrl, utmSource, utmCampaign, businessName }) {
```

Then find the section that builds the row for `valuation-questionnaire`. The row array must include `businessName` at the correct position (column D — after Email, before Revenue):

```javascript
if (tool === "valuation-questionnaire" || tool === "valuation-estimate") {
  const a = answers || {};
  const row = [
    estTimestamp,
    name || "",
    email || "",
    businessName || "",
    a.q1?.answer || a.q1 || "",
    a.q2?.answer || a.q2 || "",
    a.q3?.answer || a.q3 || "",
    a.q4?.answer || a.q4 || "",
    a.q5?.answer || a.q5 || "",
    a.q6?.answer || a.q6 || "",
    a.q7?.answer || a.q7 || "",
    a.q8?.answer || a.q8 || "",
    a.q9?.answer || a.q9 || "",
    a.q10?.answer || a.q10 || "",
    a.q11?.answer || a.q11 || "",
    a.q12?.answer || a.q12 || "",
    a.q13?.answer || a.q13 || "",
    a.q14?.answer || a.q14 || "",
    source,
    campaign,
  ];
  // ... write to sheet
}
```

Note: The answers might come as `{ question: "...", answer: "..." }` objects OR as plain strings depending on how the payload was structured. The `a.q1?.answer || a.q1 || ""` pattern handles both formats.

### Step D: In api/lead-capture.js, verify businessName is passed
Find the `appendLead(` call and confirm `businessName` is included:

```javascript
businessName: req.body.businessName || "",
```

### Step E: After making changes, verify with grep
```bash
grep -n "businessName" lib/sheets.js api/lead-capture.js
```

Should show multiple results in both files. If either file shows 0, the fix wasn't applied. Commit and push only after confirming.

---

## Fix 2: Headline formatting

In `ValuationEstimate.jsx`, find the headline:

```jsx
Get Your Personalized <span style={{ color: C.gold, fontStyle: "italic" }}>Profit Gap</span> and <span style={{ color: C.gold, fontStyle: "italic" }}>Value Gap</span> Report
```

Add a `<br />` after "Personalized":

```jsx
Get Your Personalized<br /><span style={{ color: C.gold, fontStyle: "italic" }}>Profit Gap</span> and <span style={{ color: C.gold, fontStyle: "italic" }}>Value Gap</span> Report
```

---

## Fix 8: Only show disclaimers on first and last step

The two disclaimer paragraphs added in Fix 6 should only be visible on Step 1 (contact info, `step === 0`) and the last step (the step with the Submit button, `step === TOTAL_STEPS - 1`). Hide them on all intermediate question steps.

Wrap the disclaimers `div` in a conditional:

```jsx
{(step === 0 || step === TOTAL_STEPS - 1) && (
  <div style={{ marginTop: 40, marginBottom: 24 }}>
    <p style={{ fontSize: 10, lineHeight: 1.55, color: "#5A6474", textAlign: "center", maxWidth: 560, margin: "0 auto 16px" }}>
      This report serves as an indication of value...
    </p>
    <p style={{ fontSize: 10, lineHeight: 1.55, color: "#5A6474", textAlign: "center", maxWidth: 560, margin: "0 auto" }}>
      By providing your information you consent to Kriczky Virtus, LLC...
    </p>
  </div>
)}
```

This keeps the disclaimers visible when the user first enters their contact info and when they're about to submit — the two moments where consent language matters most.

---

## Fix 9: Auto-scroll to top when clicking Continue

When the user clicks "Continue", the page should scroll back to the top so they see the progress bar and the next section's header. Make sure the Continue button's `onClick` handler includes `window.scrollTo`:

```jsx
onClick={() => {
  if (canAdvance()) {
    setStep(s => s + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}}
```

Also add the same scroll-to-top when clicking "Back":

```jsx
onClick={() => {
  setStep(s => s - 1);
  window.scrollTo({ top: 0, behavior: "smooth" });
}}
```

If `window.scrollTo` is already in the Continue handler, verify it's actually executing — it may be on a line that isn't reached. The `setStep` and `scrollTo` must both be inside the `if (canAdvance())` block.

---

## Critical Instructions
- Run the grep commands in Step B and Step E to VERIFY the code is in the files before pushing
- The `businessName` fix must appear in BOTH `lib/sheets.js` AND `api/lead-capture.js`
- Do NOT change any other files
