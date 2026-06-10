# Replit Agent Prompt — Hide iClosed Scrollbar on Valuation Estimate

## Problem
The iClosed calendar embed on the `/valuation-estimate` thank-you page shows a vertical scrollbar. The other landing pages don't have this issue.

## Fix
In `ValuationEstimate.jsx`, find the iClosed `<iframe>` on the thank-you page. It currently has `height: 620`. Either increase the height or hide the scrollbar:

### Option A: Increase iframe height (preferred)
```jsx
<iframe
  src="https://app.iclosed.io/e/kriczkyvirtus/profit-valuation-snapshot"
  title="Profit & Valuation Snapshot"
  style={{ width: "100%", height: 820, border: "none", borderRadius: 12, background: "transparent" }}
  allow="payment"
  scrolling="no"
/>
```

### Option B: If increasing height doesn't fully fix it
Add `overflow: "hidden"` to the iframe's parent container and add `scrolling="no"` to the iframe:

```jsx
<div style={{
  padding: mob ? "16px 12px" : "24px 28px",
  background: "...",
  border: "...",
  borderRadius: 18,
  overflow: "hidden",  /* ADD THIS */
}}>
  <iframe
    src="https://app.iclosed.io/e/kriczkyvirtus/profit-valuation-snapshot"
    title="Profit & Valuation Snapshot"
    style={{ width: "100%", height: 820, border: "none", borderRadius: 12, background: "transparent" }}
    allow="payment"
    scrolling="no"
  />
</div>
```

Check what height the other landing pages use for their iClosed iframes and match it. If they use 620 without a scrollbar, the issue may be that this specific iClosed event has more form fields (phone number field), so it needs more height.

## Critical Instructions
- Only change the iframe height and/or add scrolling="no" + overflow hidden
- Do NOT change any other content or styling
- Compare with the other landing pages' iframe setup if needed
