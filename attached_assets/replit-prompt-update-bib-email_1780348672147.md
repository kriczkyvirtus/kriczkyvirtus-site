# Replit Agent Prompt — Update BIB Email Copy

## What To Change

In `lib/email.js`, find the `"business-independence-blueprint"` entry in the `TOOL_DETAILS` object and update these 2 fields:

```javascript
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
```

The 2 changes:
1. `previewText` — changed to `Your Biggest Opportunities for Independence are Ready`
2. `ctaText` — changed to `P.S. — Want help executing these improvements for your business?`

Everything else stays the same.

## Critical Instructions
- Only change these 2 fields in the `"business-independence-blueprint"` entry
- Do NOT change any other tool entries
- Do NOT change the HTML template, footer, or any other code
