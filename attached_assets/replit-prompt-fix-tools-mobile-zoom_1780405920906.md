# Replit Agent Prompt — Enable Zoom-Out on 5 Diagnostic Tools (Mobile)

## Problem
The 5 diagnostic tools (WMBW, BIB, Structural Capital, Customer Capital, Human Capital) render at a fixed 8.5in width. On mobile, the content is zoomed in so far that the tools aren't usable, and users cannot pinch-to-zoom out to see the full page.

This happens because the site's viewport meta tag is set to `width=device-width` which locks the browser's zoom level to the device width. The 8.5in content overflows and becomes a scrollable area, but the browser won't let you zoom OUT past the viewport.

## Fix
Dynamically change the viewport meta tag when a tool page loads, then revert it when the user navigates away. This is the same approach the generated Constraint Roadmap HTML files use successfully.

In EACH of the 5 tool components, add this `useEffect` at the top of the component (alongside other hooks):

```javascript
// On mobile, set viewport to match the 8.5in page width so the browser
// automatically zooms out to fit. Revert when leaving the page.
useEffect(() => {
  const viewport = document.querySelector('meta[name="viewport"]');
  if (!viewport) return;
  const original = viewport.getAttribute('content');
  const isMobile = window.innerWidth < 816;
  if (isMobile) {
    viewport.setAttribute('content', 'width=816, initial-scale=0.5, user-scalable=yes');
  }
  return () => {
    if (original) {
      viewport.setAttribute('content', original);
    }
  };
}, []);
```

This tells the mobile browser "this page is 816px wide" — the browser automatically scales to fit the full width on screen, and the user can pinch to zoom in/out freely.

## Also remove the scrollable wrapper if it was added previously
If the previous fix added a wrapper div with `overflowX: "auto"` and `minWidth: "8.5in"` around the page container, remove it. The viewport approach handles scaling natively — no wrapper needed. The page container should just be:

```jsx
<div style={{ maxWidth: "8.5in", margin: "0 auto" }}>
  {/* ...pages... */}
</div>
```

No zoom, no scale, no overflow wrapper. Just the original container with the viewport meta tag doing the work.

## Apply to all 5 tools:
- `whats-my-business-worth` component
- `business-independence-blueprint` component
- `structural-capital-deep-dive` component
- `customer-capital-deep-dive` component
- `human-capital-deep-dive` component

## Critical Instructions
- Add the useEffect to ALL 5 tool components
- Remove any CSS zoom, transform scale, or scrollable wrapper code from previous fix attempts
- Do NOT change the Constraint Roadmap Assessment — it has its own mobile handling
- Do NOT change the homepage, Resources Hub, or landing pages
- The cleanup function in useEffect is essential — it reverts the viewport when the user navigates away so the rest of the site renders normally
- Test on a real mobile device: navigate to WMBW, verify the full 8.5in page is visible and you can pinch to zoom in/out, then navigate back to the homepage and verify it still renders correctly
