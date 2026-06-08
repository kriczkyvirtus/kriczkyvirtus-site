# Replit Agent Prompt — 6 Updates to Valuation Estimate Questionnaire

All changes are in `ValuationEstimate.jsx` (the component at `/valuation-estimate`).

---

## Fix 1: Progress bar starts 1 step too early

Currently the progress bar shows `(step + 1) / TOTAL_STEPS * 100` which means landing on the page shows 14% before the user does anything, and the last page shows 100% before they answer it.

Change the progress calculation so:
- Landing on Step 1 (contact info) = 0%
- Completing Step 1 and advancing to Step 2 = ~17%
- Completing the last step and landing on the thank-you page = 100%

Replace the progress calculation:

```jsx
// Progress text
<span style={{ fontSize: 11, color: C.text3, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>
  Step {step + 1} of {TOTAL_STEPS}
</span>
<span style={{ fontSize: 11, color: C.text3 }}>
  {Math.round((step / TOTAL_STEPS) * 100)}%
</span>

// Progress bar fill
width: `${(step / TOTAL_STEPS) * 100}%`,
```

This uses `step / TOTAL_STEPS` instead of `(step + 1) / TOTAL_STEPS`. Step 0 = 0%, Step 6 (last) = ~86%, and the thank-you page (after submit) would be 100%.

---

## Fix 2: Remove arrows from buttons + add hover glow

### Remove arrows:
Find the "Continue →" button text and change to just "Continue". Find the "← Back" button text and change to just "Back".

### Add hover glow:
Add hover state tracking and glow effects to both buttons. Add state variables:

```javascript
const [continueHover, setContinueHover] = useState(false);
const [backHover, setBackHover] = useState(false);
```

Update the Continue button:
```jsx
<button
  onMouseEnter={() => setContinueHover(true)}
  onMouseLeave={() => setContinueHover(false)}
  onClick={() => { if (canAdvance()) { setStep(s => s + 1); window.scrollTo({ top: 0, behavior: "smooth" }); } }}
  disabled={!canAdvance()}
  style={{
    padding: "10px 24px", borderRadius: 8,
    border: `1.5px solid ${canAdvance() ? (continueHover ? C.gold : C.gold + "80") : C.border2}`,
    background: canAdvance()
      ? (continueHover ? `linear-gradient(135deg, ${C.gold}22, ${C.gold}12)` : `linear-gradient(135deg, ${C.gold}15, ${C.gold}08)`)
      : "transparent",
    color: canAdvance() ? C.gold : C.text4,
    fontSize: 13, fontWeight: 600, cursor: canAdvance() ? "pointer" : "not-allowed",
    fontFamily: "'DM Sans', sans-serif",
    transition: "all 0.3s ease",
    boxShadow: canAdvance() && continueHover ? `0 0 20px ${C.gold}25` : "none",
    transform: continueHover && canAdvance() ? "translateY(-1px)" : "none",
  }}
>
  Continue
</button>
```

Update the Back button:
```jsx
<button
  onMouseEnter={() => setBackHover(true)}
  onMouseLeave={() => setBackHover(false)}
  onClick={() => setStep(s => s - 1)}
  style={{
    padding: "10px 20px", borderRadius: 8,
    border: `1px solid ${backHover ? C.border2 : C.border1}`,
    background: backHover ? "rgba(255,255,255,0.03)" : "transparent",
    color: backHover ? C.text1 : C.text2,
    fontSize: 13, cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    transition: "all 0.3s ease",
  }}
>
  Back
</button>
```

Also update the Submit button with similar hover glow:
```javascript
const [submitHover, setSubmitHover] = useState(false);
```
Add `onMouseEnter`/`onMouseLeave` and conditional glow matching the Continue button pattern.

---

## Fix 3: Auto-format revenue and EBITDA inputs

For questions q1 (revenue) and q2 (EBITDA), replace the plain `<input>` with a formatted currency input that:
- Automatically prepends `$`
- Automatically adds commas as the user types (e.g. `2500000` → `$2,500,000`)
- Only allows numeric input (blocks letters, symbols, etc.)
- Stores the raw number in state but displays the formatted version

Create a helper function:

```javascript
function formatCurrency(value) {
  // Strip everything except digits
  const digits = value.replace(/[^0-9]/g, "");
  if (!digits) return "";
  // Format with commas
  const num = parseInt(digits, 10);
  return "$" + num.toLocaleString("en-US");
}

function parseCurrencyToRaw(value) {
  return value.replace(/[^0-9]/g, "");
}
```

For q1 and q2 inputs, use a custom handler:

```jsx
<input
  value={answers[q.id] ? formatCurrency(answers[q.id]) : ""}
  onChange={e => {
    const raw = parseCurrencyToRaw(e.target.value);
    setAnswer(q.id, raw);
  }}
  inputMode="numeric"
  placeholder={q.placeholder}
  style={inputStyle}
/>
```

The `inputMode="numeric"` shows a number keyboard on mobile. The state stores the raw digits (e.g. `"2500000"`) and the display shows the formatted version (e.g. `"$2,500,000"`).

**Important:** When sending to the API, format the stored value for readability. In the `handleSubmit` function, when building `payload.answers`, format q1 and q2:

```javascript
sec.questions.forEach(q => {
  let answer = answers[q.id] || "";
  if ((q.id === "q1" || q.id === "q2") && answer) {
    answer = formatCurrency(answer);
  }
  payload.answers[q.id] = { question: q.text, answer };
});
```

---

## Fix 4: Animated green checkmark on thank-you page

Replace the static `✓` character with an animated SVG checkmark. The animation:
1. A green circle draws itself 360° (stroke-dasharray animation)
2. After the circle completes, the checkmark "draws" itself inside

Add CSS keyframes (in a `<style>` tag or inline):

```jsx
<style>{`
  @keyframes drawCircle {
    0% { stroke-dashoffset: 283; }
    100% { stroke-dashoffset: 0; }
  }
  @keyframes drawCheck {
    0% { stroke-dashoffset: 50; }
    100% { stroke-dashoffset: 0; }
  }
`}</style>
```

Replace the `<div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>` with:

```jsx
<div style={{ marginBottom: 20, display: "flex", justifyContent: "center" }}>
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
    {/* Circle */}
    <circle cx="32" cy="32" r="28"
      stroke="#34D399" strokeWidth="3" fill="none"
      strokeLinecap="round"
      style={{
        strokeDasharray: 175.93,
        strokeDashoffset: 0,
        animation: "drawCircle 0.8s ease-out forwards",
      }}
    />
    {/* Checkmark */}
    <path d="M20 33 L28 41 L44 25"
      stroke="#34D399" strokeWidth="3" fill="none"
      strokeLinecap="round" strokeLinejoin="round"
      style={{
        strokeDasharray: 50,
        strokeDashoffset: 0,
        animation: "drawCheck 0.4s ease-out 0.8s forwards",
        opacity: 0,
        animationFillMode: "forwards",
      }}
    />
  </svg>
</div>
```

Wait — the checkmark needs to start invisible and appear after the circle finishes. Update:

```jsx
<style>{`
  @keyframes drawCircle {
    0% { stroke-dashoffset: 176; }
    100% { stroke-dashoffset: 0; }
  }
  @keyframes drawCheck {
    0% { stroke-dashoffset: 50; opacity: 1; }
    100% { stroke-dashoffset: 0; opacity: 1; }
  }
`}</style>

<div style={{ marginBottom: 20, display: "flex", justifyContent: "center" }}>
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
    <circle cx="32" cy="32" r="28"
      stroke="#34D399" strokeWidth="3" fill="none"
      strokeLinecap="round"
      strokeDasharray="176"
      strokeDashoffset="176"
      style={{ animation: "drawCircle 0.8s ease-out forwards" }}
    />
    <path d="M20 33 L28 41 L44 25"
      stroke="#34D399" strokeWidth="3" fill="none"
      strokeLinecap="round" strokeLinejoin="round"
      strokeDasharray="50"
      strokeDashoffset="50"
      style={{ animation: "drawCheck 0.4s ease-out 0.8s forwards" }}
    />
  </svg>
</div>
```

The circle draws over 0.8s, then the checkmark draws over 0.4s starting at 0.8s delay. Both are green (#34D399).

---

## Fix 5: Change headline

Find:
```
Help Us Build Your <span style={{ color: C.gold, fontStyle: "italic" }}>Personalized Report</span>
```

Replace with:
```
Get Your Personalized <span style={{ color: C.gold, fontStyle: "italic" }}>Profit Gap</span> and <span style={{ color: C.gold, fontStyle: "italic" }}>Value Gap</span> Report
```

---

## Fix 6: Add disclaimers above the footer

Find the footer section (the `div` with the horizontal line, email, and website URL). ABOVE the footer's border-top line (but below the main content), add:

```jsx
{/* Disclaimers */}
<div style={{ marginTop: 40, marginBottom: 24 }}>
  <p style={{ fontSize: 10, lineHeight: 1.55, color: "#5A6474", textAlign: "center", maxWidth: 560, margin: "0 auto 16px" }}>
    This report serves as an indication of value based on current market trends and benchmarks. It is not intended as an income-based or certified valuation. For exit planning, financing, or transactional purposes, a credentialed Valuation Expert should be engaged to produce a certified valuation report.
  </p>
  <p style={{ fontSize: 10, lineHeight: 1.55, color: "#5A6474", textAlign: "center", maxWidth: 560, margin: "0 auto" }}>
    By providing your information you consent to Kriczky Virtus, LLC contacting you by phone, text, or email using automated telephone dialing systems and AI to the information provided, even if the phone number is present on a state or national Do Not Call List. We do not sell your personal information. By providing this information you agree to our Privacy Policy and Terms of Service.
  </p>
</div>
```

Place this BEFORE the footer `div` that has `borderTop`.

---

## Fix 7: Business Name not coming through to Google Sheets

The `businessName` field is sent in the API payload (`req.body.businessName`) but is not being passed to the `appendLead` function or included in the Google Sheets row.

### In `api/lead-capture.js`:
Find the `appendLead` call and add `businessName`:

```javascript
await appendLead({
  name,
  email,
  tool: tool || "constraint-roadmap",
  summary: summary || {},
  answers: req.body.answers || {},
  timestamp: timestamp || new Date().toISOString(),
  blobUrl: roadmapUrl || "",
  utmSource: req.body.utmSource || null,
  utmCampaign: req.body.utmCampaign || null,
  businessName: req.body.businessName || "",  // ADD THIS
});
```

### In `lib/sheets.js`:
Update the `appendLead` function signature to accept `businessName`:

```javascript
async function appendLead({ name, email, tool, summary, answers, timestamp, blobUrl, utmSource, utmCampaign, businessName }) {
```

Then in the special handling for `valuation-questionnaire`, make sure `businessName` is included in the row at the correct column position (column D, after Email):

```javascript
if (tool === "valuation-questionnaire") {
  const a = answers || {};
  const row = [
    estTimestamp, name, email,
    businessName || "",  // Business Name column
    a.q1?.answer || "", a.q2?.answer || "",
    // ... rest of answers ...
  ];
}
```

---

## Critical Instructions
- All 6 changes are in `ValuationEstimate.jsx` only
- Do NOT change any other files or pages
- Do NOT change the question content, order, or grouping
- Do NOT change the submission logic or API payload
- Test the currency formatting on both desktop and mobile (should show number keyboard on mobile)
- Test the checkmark animation — circle should draw first, then checkmark appears
