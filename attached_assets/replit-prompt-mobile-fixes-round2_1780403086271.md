# Replit Agent Prompt — Mobile Fixes Round 2

## CRITICAL: Fix 5 Tools Showing Black Screen on Mobile

When clicking the CTA buttons on the Resources Hub to navigate to WMBW, BIB, Structural Capital, Customer Capital, or Human Capital on mobile, the user sees a completely dark/black screen. The tools don't render at all. The Constraint Roadmap Assessment does NOT have this problem.

This is the highest priority fix. The black screen is likely caused by the CSS zoom implementation from the previous mobile fix. Possible causes:

1. **Zoom set to 0 or NaN** — if the zoom calculation produces 0, the content is invisible. Check the zoom calculation: `(window.innerWidth - 16) / 816`. If `window.innerWidth` is undefined or 0 at mount time, zoom becomes 0.
2. **The zoom is applied to a wrapper that hasn't rendered yet** — if the zoom state initializes before the component mounts, it might cause layout issues.
3. **The useEffect for zoom runs server-side** — if there's any SSR or pre-render, `window` is undefined.

**Fix approach:** Make sure the zoom defaults to 1 (full size) and only scales down after mount:

```javascript
const [zoomLevel, setZoomLevel] = useState(1); // Default to 1, not 0

useEffect(() => {
  const calc = () => {
    const w = window.innerWidth;
    if (w && w < 816) {
      setZoomLevel((w - 32) / 816); // 32px total horizontal margin
    } else {
      setZoomLevel(1);
    }
  };
  calc();
  window.addEventListener("resize", calc);
  return () => window.removeEventListener("resize", calc);
}, []);
```

Apply this to ALL 5 tool components. Test on mobile — the tools must render and be visible, even if small.

If the zoom approach is still causing issues, use a simpler fallback:

```javascript
const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
```

```jsx
<div style={{ 
  maxWidth: "8.5in", 
  margin: "0 auto",
  ...(isMobile && { zoom: 0.48 }),
}}>
```

---

## Resources Hub (`/tools`) — 8 Mobile Fixes

### Fix 1: Cyan pill text — reduce font size on mobile so it fits on 1 line

Find the cyan pill in the Hero section. Add a mobile font size reduction. The `mob` variable from `useBp()` should already be available:

```jsx
fontSize: mob ? 9 : 12,  // or whatever size fits on 1 line on mobile
```

You may also need to reduce letter-spacing and padding on mobile:
```jsx
padding: mob ? "5px 12px" : "6px 16px",
letterSpacing: mob ? 0.1 : 0.3,
```

### Fix 2: Reduce top padding above the cyan pill on mobile

Find the Hero section container. Reduce the top padding on mobile so the hero content + CTA button are visible without scrolling:

```jsx
paddingTop: mob ? 24 : 80,  // or whatever the current desktop value is
```

### Fix 3: Hero CTA button text — fit on 1 line on mobile

Find the Hero CTA button (Get "What's My Business Worth?"). Reduce the font size on mobile:

```jsx
fontSize: mob ? 12 : 15,  // adjust until it fits on 1 line
padding: mob ? "12px 20px" : "14px 28px",
```

### Fix 4: Text under Hero CTA — fit on 2 lines instead of 3

Find the subtitle text under the CTA button ("Personalized action steps you can start implementing this week · Under 15 minutes"). Increase the max-width or reduce font size on mobile:

```jsx
fontSize: mob ? 11 : 13,
maxWidth: mob ? 320 : 400,
```

### Fix 5: Hero preview carousel — extend height so screenshots aren't cut off

Find the carousel/preview container in the Hero section. The screenshots are getting clipped at top and bottom, and the dot counter is hidden behind the carousel. Increase the container height on mobile:

```jsx
height: mob ? 320 : 400,  // increase mobile height
```

Or if it uses `overflow: hidden`, adjust the overflow area. Also make sure the dot counter / pill counter has a higher z-index and sits below the carousel with visible margin:

```jsx
// Counter container
marginTop: mob ? 12 : 8,
position: "relative",
zIndex: 10,
```

### Fix 6: "See The Gap" section — stack CTA buttons vertically on mobile

The "Experience The Assessment" section correctly stacks its 2 CTA buttons on mobile. Apply the same pattern to the "See The Gap" section. Find the container holding the 2 CTA buttons in "See The Gap" and change:

```jsx
flexDirection: mob ? "column" : "row",
gap: mob ? 12 : 16,
alignItems: mob ? "stretch" : "center",
```

Make sure each button is `width: "100%"` on mobile.

### Fix 7: "Your Path" accordion sections — stack content vertically on mobile

Inside each of the 3 accordion tabs (which have open/close chevrons), the content currently tries to fit side-by-side. On mobile, stack everything vertically:

- Text content goes on top (full width)
- CTA buttons/pills go below the text (full width, text should fit on 1 line)
- Screenshot previews go below the CTA buttons

Find the flex/grid layout inside each accordion section and add:

```jsx
flexDirection: mob ? "column" : "row",
gap: mob ? 16 : 24,
```

For the CTA buttons/pills inside the accordions:
```jsx
whiteSpace: mob ? "nowrap" : "normal",
fontSize: mob ? 11 : 13,
width: mob ? "100%" : "auto",
textAlign: mob ? "center" : "left",
```

For the screenshot previews:
```jsx
width: mob ? "100%" : 300,  // or whatever the desktop width is
marginTop: mob ? 12 : 0,
```

### Fix 8: "VIRTUS" watermark — reduce size on mobile

Find the large "VIRTUS" watermark text at the bottom of the page. It's so wide that only partial letters are visible on mobile. Reduce the font size:

```jsx
fontSize: mob ? 120 : 300,  // or whatever makes the full word visible on mobile
```

Or if it uses `letterSpacing`, reduce that too:
```jsx
letterSpacing: mob ? "0.2em" : "0.5em",
```

---

## Free Session Landing Page — Fix headline wrapping

The headline "Find Out What Your Profit Gap and Value Gap Actually Look Like" wraps to 3 lines on mobile with "and" stranded alone on line 2.

Reduce the font size on mobile. Find the `<h1>` in `FreeWorkingSession.jsx`:

```jsx
fontSize: mob ? 28 : 46,  // reduce from current mobile size (probably 32)
```

If the component doesn't have a `useBp()` hook or `mob` variable, add one at the top of the component (same pattern as the other landing pages).

---

## Constraint Roadmap Assessment — Fix CTA button text wrapping

After the email gate, the "Ready for hands-on help? Book a free working session" CTA button text wraps onto 2 lines awkwardly on mobile.

Fix: Split it into 2 deliberate lines on mobile — "Ready for hands-on help?" on line 1 and "Book a Free Working Session" on line 2:

```jsx
{mob ? (
  <span style={{ textAlign: "center", display: "block" }}>
    <span style={{ display: "block", fontSize: 11, color: "#8B95A5", marginBottom: 4 }}>
      Ready for hands-on help?
    </span>
    <span style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#22D3EE" }}>
      Book a Free Working Session
    </span>
  </span>
) : (
  "Ready for hands-on help? Book a free working session"
)}
```

If the component doesn't have `mob` / `useBp()`, add the responsive hook. Or use a CSS approach:

```jsx
<a href="..." style={{
  fontSize: mob ? 12 : 14,
  padding: mob ? "12px 20px" : "14px 28px",
  textAlign: "center",
  lineHeight: 1.4,
}}>
  Ready for hands-on help?{mob ? <br/> : " "}Book a free working session
</a>
```

---

## Critical Instructions
- The BLACK SCREEN issue on the 5 tools is the #1 priority — fix this first
- Test every fix on a real mobile device or Chrome DevTools (iPhone SE 375px and iPhone 14 393px)
- All font size / padding reductions are MOBILE ONLY — do not change desktop sizes
- Do NOT change any scoring logic, content, or functionality
- Do NOT change the homepage or the 4 landing pages (except FreeWorkingSession headline)
- The `mob` variable from `useBp()` is available in the Resources Hub — use it for all conditional styles there
