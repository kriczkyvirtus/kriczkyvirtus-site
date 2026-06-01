# Replit Agent Prompt — Update All 3 Capital Deep Dive Email Copy

## What To Change

In `lib/email.js`, update the following 3 entries in the `TOOL_DETAILS` object:

### Human Capital Deep Dive
```javascript
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
```

Changes: `previewText` and `ctaText`

### Structural Capital Deep Dive
```javascript
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
```

Changes: `previewText` and `ctaText`

### Customer Capital Deep Dive
```javascript
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
```

Changes: `previewText` and `ctaText`

## Summary
- All 3 tools get the same `ctaText`: "P.S. — Want help identifying where the biggest ROI opportunities are?"
- Each tool gets a unique `previewText` describing what it scores
- Everything else stays the same

## Critical Instructions
- Only change `previewText` and `ctaText` in these 3 entries
- Do NOT change any other tool entries
- Do NOT change the HTML template, footer, or any other code
