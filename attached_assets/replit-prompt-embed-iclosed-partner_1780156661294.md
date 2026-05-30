# Replit Agent Prompt — Embed iClosed Calendar on /partner-qualify

## What You Need To Do

In `PartnerQualify.jsx`, make these two changes:

### Change 1: Delete the useEffect
Remove the entire `useEffect` hook that references `ICLOSED_SCRIPT_URL` and `ICLOSED_DATA_URL`. It's no longer needed.

### Change 2: Replace the embed container with an iframe
Find the div with `id="iclosed-embed-partner"` and all its children (the placeholder with calendar icon, "Calendar loading..." text, and email fallback). Replace that entire block with:

```jsx
<iframe
  src="https://app.iclosed.io/e/kriczkyvirtus/partner-tier-fit-call"
  title="Partner Tier Fit Call"
  style={{
    width: "100%",
    height: 620,
    border: "none",
    borderRadius: 12,
    background: "transparent",
  }}
  allow="payment"
/>
```

Keep the outer glassmorphic card container (the div with `minHeight: 500`, gradient background, border, borderRadius 18, and box-shadow). The iframe replaces the old embed div inside it.

## Critical Instructions
- Only modify `PartnerQualify.jsx`.
- Keep the outer card styling exactly as-is.
- Do NOT change any other content, styling, or layout on the page.
