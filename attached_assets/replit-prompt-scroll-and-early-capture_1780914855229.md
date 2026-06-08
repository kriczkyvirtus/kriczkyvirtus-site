# Replit Agent Prompt — Fix Scroll-to-Top + Capture Contact Info Early

## Fix 1: Auto-scroll to top not working

`window.scrollTo({ top: 0, behavior: "smooth" })` is in the code but likely not working because the page content is inside a scrollable container that isn't the `window`. 

Try these approaches in order until one works:

### Approach A: Scroll the document element
```javascript
document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
```

### Approach B: Scroll both window and document
```javascript
window.scrollTo(0, 0);
document.documentElement.scrollTop = 0;
document.body.scrollTop = 0;
```

### Approach C: Use a ref at the top of the page and scrollIntoView
Add a ref at the top of the component's content:

```jsx
const topRef = React.useRef(null);
```

Place it at the very top of the content div (right after the logo):
```jsx
<div ref={topRef} />
```

Then in the Continue and Back handlers:
```javascript
topRef.current?.scrollIntoView({ behavior: "smooth" });
```

### Apply to BOTH buttons:

**Continue button:**
```jsx
onClick={() => {
  if (canAdvance()) {
    setStep(s => s + 1);
    // Use whichever scroll approach works:
    setTimeout(() => {
      topRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  }
}}
```

**Back button:**
```jsx
onClick={() => {
  setStep(s => s - 1);
  setTimeout(() => {
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  }, 50);
}}
```

The `setTimeout` with 50ms delay ensures the new step has rendered before scrolling.

---

## Fix 2: Capture contact info immediately when user completes Step 1

Currently, ALL data only sends when the user clicks Submit on the last page. If they abandon after entering their contact info, we lose them entirely.

**Solution:** When the user clicks "Continue" on Step 1 (contact info), immediately fire a lightweight lead-capture call with just their name, email, and business name. If they complete the full questionnaire, the Submit button sends the full payload with all answers — ActiveCampaign's `contact/sync` deduplicates by email, so it just updates the existing contact.

### In `ValuationEstimate.jsx`:

Find the Continue button's `onClick` handler. Add a contact capture call that fires ONLY when advancing from Step 0 (contact info) to Step 1:

```jsx
onClick={() => {
  if (canAdvance()) {
    // If leaving the contact info step, capture their info immediately
    if (step === 0) {
      fetch("/api/lead-capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${firstName.trim()} ${lastName.trim()}`,
          email: email.trim(),
          businessName: businessName.trim(),
          tool: "valuation-questionnaire",
          answers: {},
          summary: {},
          utmSource: utmSource || null,
          utmCampaign: utmCampaign || null,
          timestamp: new Date().toISOString(),
          partial: true,
        }),
      }).catch(err => console.error("[Questionnaire] Early capture failed:", err));
    }

    setStep(s => s + 1);
    setTimeout(() => {
      topRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  }
}}
```

This is fire-and-forget — it doesn't block the UI. The user advances to the next step immediately.

### In `api/lead-capture.js`:

The existing code should handle this without changes since it already processes name, email, tool, and writes to Sheets/ActiveCampaign. The `answers` will be empty `{}` for this early capture.

**However**, when the user clicks Submit at the end, the full payload (with all 14 answers) is sent. To avoid duplicate rows in Google Sheets, add logic to check if `partial` is true and skip the email notification for partial submissions:

```javascript
const isPartial = req.body.partial === true;

// Google Sheets — always write (partial creates the row, full updates or creates a new one)
// This is fine — Edward can see which rows have answers filled in vs just contact info

// ActiveCampaign — always sync (contact/sync deduplicates by email)

// Resend notification email — only send for FULL submissions (not partial)
if (tool === "valuation-questionnaire" && !isPartial) {
  // ... send email to Edward with answers ...
}
```

This way:
- **User drops off after Step 1:** You get their name, email, business name in Sheets + ActiveCampaign contact with tags. Answers columns are empty. No email to you.
- **User completes everything:** A second row appears in Sheets with all answers filled in. ActiveCampaign contact is updated (same contact, no duplicate). You get the notification email with all 14 answers.

---

## Critical Instructions
- The early capture is fire-and-forget — do NOT await it or show a loading state
- The early capture MUST only fire when `step === 0` (leaving contact info page), not on every Continue click
- Do NOT send the notification email to Edward for partial submissions
- ActiveCampaign `contact/sync` handles deduplication — no special logic needed there
- Test the scroll fix on mobile — mobile browsers sometimes require different scroll methods
- Test the dropout scenario: enter contact info, click Continue, then close the browser tab. Verify the contact appears in Google Sheets and ActiveCampaign.
