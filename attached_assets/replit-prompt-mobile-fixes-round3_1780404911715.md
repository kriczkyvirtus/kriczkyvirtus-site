# Replit Agent Prompt — Mobile Fixes Round 3 (CRITICAL)

## PRIORITY 1: Fix 5 Tools Dark/Black Screen on Mobile

The 5 diagnostic tools (WMBW, BIB, Structural Capital, Customer Capital, Human Capital) still show completely dark/black screens on mobile. This has persisted through multiple fix attempts. 

**STOP trying to use CSS zoom or transform scaling.** Remove ALL zoom/scale logic that was added in previous mobile fix attempts. The tools worked on mobile before (just weren't optimized) — the zoom code broke them.

### What to do:

1. **Remove any `zoom`, `transform: scale`, `zoomLevel`, `isMobile` state, or related useEffect hooks** that were added to these 5 tool components in recent commits. Revert the page container back to its original state:

```jsx
<div style={{ maxWidth: "8.5in", margin: "0 auto" }}>
```

No zoom. No scale. No mobile detection for scaling purposes.

2. **Instead, wrap the page container in a horizontally scrollable div on mobile:**

```jsx
<div style={{ 
  width: "100%",
  overflowX: "auto",
  WebkitOverflowScrolling: "touch",
}}>
  <div style={{ maxWidth: "8.5in", margin: "0 auto", minWidth: "8.5in" }}>
    {/* ...existing pages... */}
  </div>
</div>
```

This lets the 8.5in document render at full size on mobile. Users can scroll horizontally or pinch-to-zoom — the same behavior as viewing a PDF on mobile. It's not perfect UX but it WORKS and doesn't break rendering.

3. **Verify each tool loads on mobile** — open Chrome DevTools, toggle device toolbar to iPhone SE (375px), navigate to each tool. Content must be visible. If any tool still shows a black screen, check the Console for JavaScript errors and fix them.

---

## PRIORITY 2: Resources Hub Mobile Fixes

### Fix 1: Cyan pill position too high / not visible

The cyan pill in the Hero section was moved too high on mobile and is now off-screen. Find the pill container and adjust its mobile positioning. The pill should be visible as the first element the user sees — NOT above the viewport:

```jsx
marginTop: mob ? 16 : 0,  // Add small top margin on mobile instead of negative or zero
paddingTop: mob ? 16 : whatever_desktop_value,
```

Check if any previous fix set a very small `paddingTop` on the Hero section for mobile. It should have enough padding to keep the pill visible below the nav bar, but not so much that it pushes the CTA off-screen. Try:

```jsx
paddingTop: mob ? 80 : 120,  // enough for nav + some breathing room
```

### Fix 2: Accordion "Your Path" section — screenshot previews cut off + alignment

For ALL 3 accordion sections in "Your Path":

**A) Screenshot previews getting cut off at the bottom:**
Find the container that holds each screenshot preview image. Remove any `overflow: hidden` or `maxHeight` constraint that's clipping the bottom. If the image is inside a container with a fixed height, change it to `height: "auto"`:

```jsx
// Preview container
overflow: "visible",  // NOT "hidden"
height: "auto",       // NOT a fixed px value
```

**B) Center the previews on mobile:**
```jsx
display: "flex",
justifyContent: "center",
margin: mob ? "16px auto 0" : "0",
```

Or if the image itself needs centering:
```jsx
display: "block",
marginLeft: mob ? "auto" : 0,
marginRight: mob ? "auto" : 0,
```

**C) "Capital Deep-Dives" accordion — make 3 CTA buttons full-width on mobile:**
Find the 3 CTA buttons inside the Capital Deep-Dives accordion. On mobile, make them full-width and stack vertically:

```jsx
width: mob ? "100%" : "auto",
display: mob ? "block" : "inline-flex",
textAlign: "center",
marginBottom: mob ? 8 : 0,
```

**D) "Capital Deep-Dives" accordion specifically — preview cutoff is worst here.**
This accordion may have a shorter container height than the others. Make sure the container auto-sizes to fit the full preview image:

```jsx
maxHeight: "none",  // Remove any maxHeight constraint
overflow: "visible",
```

---

## PRIORITY 3: Both Watermarks Still Not Right

### Homepage VIRTUS watermark:
The SVG watermark in the testimonials section still doesn't look right on mobile. The issue may be that the viewBox change didn't take effect, or the container dimensions aren't matching.

**Simplest fix:** Just hide the watermark on mobile entirely. It's a decorative element that adds visual noise on small screens:

```jsx
<div style={{ 
  position: "absolute", 
  bottom: mob ? -70 : -100, 
  left: "-10%", right: "-10%", 
  height: mob ? 160 : 280, 
  pointerEvents: "none", 
  userSelect: "none", 
  zIndex: 1, 
  display: mob ? "none" : "flex",  // Hide on mobile
  justifyContent: "center" 
}}>
```

### Resources Hub VIRTUS watermark:
Same approach — hide it on mobile:

Find the VIRTUS watermark on the Resources Hub page and add:
```jsx
display: mob ? "none" : "flex",  // or whatever the desktop display value is
```

If you'd rather keep them visible on mobile instead of hiding them, reduce the SVG fontSize to `120` and viewBox to `"0 0 800 120"` on mobile. But hiding them is cleaner.

---

## Critical Instructions
- **REMOVING the zoom/scale code from the 5 tools is the #1 priority.** The tools must render on mobile.
- The scrollable wrapper approach is intentional — it's the same UX as viewing a document on mobile.
- Do NOT add zoom or scale back. The previous approach broke rendering.
- Test ALL 5 tools on mobile (Chrome DevTools → iPhone SE 375px) after removing the zoom code.
- For the Resources Hub fixes, the `mob` variable from `useBp()` is already available.
- Do NOT change any desktop rendering.
