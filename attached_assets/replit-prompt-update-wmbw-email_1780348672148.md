# Replit Agent Prompt — Update WMBW Email Copy

## What To Change

In `lib/email.js`, find the `"value-range-estimator"` entry in the `TOOL_DETAILS` object and update these 3 fields:

```javascript
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
```

The 3 changes:
1. `subject` — changed to `Your "What's My Business Worth?" Results` (note the escaped quotes)
2. `previewText` — changed to `Your Value Range Estimate Is Ready`
3. `ctaText` — changed to `P.S. — Want to see your business's Profit Gap and Value Gap specific to your industry?`

Everything else stays the same.

## Critical Instructions
- Only change these 3 fields in the `"value-range-estimator"` entry
- Do NOT change any other tool entries
- Do NOT change the HTML template, footer, or any other code
- Make sure the quotes in the subject line are properly escaped: `"Your \"What's My Business Worth?\" Results"`
