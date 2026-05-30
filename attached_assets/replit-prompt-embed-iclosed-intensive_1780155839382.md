# Replit Agent Prompt — Embed iClosed Calendar on /book-intensive

## What You Need To Do

In `BookIntensive.jsx`, make these two changes:

### Change 1: Update the embed URLs
Find the `useEffect` hook near the top of the component with these two empty variables:

```javascript
const ICLOSED_SCRIPT_URL = "";
const ICLOSED_DATA_URL = "";
```

Replace with:

```javascript
const ICLOSED_SCRIPT_URL = "https://app.iclosed.io/assets/widget.js";
const ICLOSED_DATA_URL = "https://app.iclosed.io/e/kriczkyvirtus/valuation-driver-intensive-fit-call";
```

### Change 2: Fix the embed container
iClosed expects the container div to have `class="iclosed-widget"` (not just an id). Find the embed container div:

```jsx
<div id="iclosed-embed-intensive" style={{ width: "100%" }}>
```

Replace with:

```jsx
<div id="iclosed-embed-intensive" className="iclosed-widget" data-url="https://app.iclosed.io/e/kriczkyvirtus/valuation-driver-intensive-fit-call" title="Valuation Driver Intensive - Fit Call" style={{ width: "100%", height: 620 }}>
```

This adds the `className`, `data-url`, `title`, and `height` that iClosed's widget script expects.

### Change 3: Simplify the useEffect
Since we're now putting the `data-url` directly on the div, simplify the useEffect to just load the script:

```javascript
useEffect(() => {
  const ICLOSED_SCRIPT_URL = "https://app.iclosed.io/assets/widget.js";
  const existing = document.querySelector(`script[src="${ICLOSED_SCRIPT_URL}"]`);
  if (!existing) {
    const script = document.createElement("script");
    script.src = ICLOSED_SCRIPT_URL;
    script.async = true;
    document.body.appendChild(script);
  }
}, []);
```

## Critical Instructions
- Only modify `BookIntensive.jsx` — do not touch any other files.
- Do NOT change any styling, layout, or content outside of the embed container.
- After deploying, navigate to `/book-intensive` and verify the iClosed calendar widget loads inside the glassmorphic card where the "Calendar loading..." placeholder was.
- The placeholder content (calendar icon, "Calendar loading..." text, email fallback) will be replaced by iClosed's widget once the script loads. If iClosed fails to load, the placeholder will still show as a fallback.
