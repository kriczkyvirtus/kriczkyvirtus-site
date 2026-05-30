# Replit Agent Prompt — Fix iClosed Embed on /book-intensive (Use iframe)

## Problem
The iClosed widget script (`widget.js`) scans the DOM for `.iclosed-widget` elements when it first loads. In a React SPA with client-side routing, the BookIntensive component mounts after the script has already run, so the calendar never appears.

## Fix
Replace the widget script approach with a direct iframe embed. This is more reliable in SPAs because the iframe loads independently when the component mounts.

## What You Need To Do

In `BookIntensive.jsx`, find the entire embed container area — the div with `id="iclosed-embed-intensive"` and all its children (including the placeholder content with the calendar icon, "Calendar loading..." text, and email fallback). Replace that entire block with:

```jsx
<iframe
  src="https://app.iclosed.io/e/kriczkyvirtus/valuation-driver-intensive-fit-call"
  title="Valuation Driver Intensive - Fit Call"
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

Also **delete the entire `useEffect` hook** that was loading the iClosed script (the one with `ICLOSED_SCRIPT_URL` and `ICLOSED_DATA_URL`). It's no longer needed since we're using an iframe directly.

Keep the outer glassmorphic card container (the div with `minHeight: 500`, the gradient background, border, and box-shadow). The iframe goes inside that container, replacing the old embed div and its placeholder children.

The final structure should look like:

```jsx
{/* iClosed embed container */}
<div style={{
  minHeight: 500,
  padding: mob ? "20px 16px" : "28px 32px",
  background: "linear-gradient(145deg, rgba(255,255,255,0.04), ...)",
  border: "...",
  borderRadius: 18,
  boxShadow: "...",
}}>
  <iframe
    src="https://app.iclosed.io/e/kriczkyvirtus/valuation-driver-intensive-fit-call"
    title="Valuation Driver Intensive - Fit Call"
    style={{
      width: "100%",
      height: 620,
      border: "none",
      borderRadius: 12,
      background: "transparent",
    }}
    allow="payment"
  />
</div>
```

## Critical Instructions
- Only modify `BookIntensive.jsx`.
- Keep the outer glassmorphic card styling exactly as-is.
- Remove the `useEffect` that loaded the widget script.
- Remove the old placeholder content (calendar icon, "Calendar loading..." text, email fallback link).
- Do NOT change any other content, styling, or layout on the page.
- If `useState` is no longer used after removing the useEffect, you can keep the import — it won't cause issues.
