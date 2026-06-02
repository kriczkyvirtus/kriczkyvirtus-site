# Replit Agent Prompt — Mobile Responsiveness Fixes Across the Site

## Summary of Issues

The homepage and 4 landing pages (RoadmapSession, BookIntensive, PartnerQualify, FreeWorkingSession) are well-optimized for mobile. The following pages are NOT:

1. **5 Diagnostic Tools** (WMBW, BIB, Structural Capital, Customer Capital, Human Capital) — fixed 8.5in page width, zero mobile breakpoints
2. **Resources Hub** (`/tools`) — 4 hardcoded grids that don't collapse on mobile
3. **Constraint Roadmap Assessment** — needs mobile check

---

## Fix 1: Diagnostic Tools — Add CSS Zoom for Mobile

All 5 diagnostic tools render as "document pages" at a fixed `8.5in` width. On mobile, these pages extend beyond the viewport and require horizontal scrolling.

**The fix:** Add CSS `zoom` to scale pages down proportionally on mobile. This is the correct approach (not `transform: scale`) because `zoom` affects layout flow.

For EACH of the 5 tool components (`whats-my-business-worth`, `business-independence-blueprint`, `structural-capital-deep-dive`, `customer-capital-deep-dive`, `human-capital-deep-dive`):

### Step A: Add a responsive hook (if not already present)

Add at the top of the component:

```javascript
const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
  const check = () => setIsMobile(window.innerWidth < 768);
  check();
  window.addEventListener("resize", check);
  return () => window.removeEventListener("resize", check);
}, []);
```

### Step B: Add zoom to the page container

Find the outer container div that wraps all the pages — it typically has `maxWidth: "8.5in"` and `margin: "0 auto"`. Add a `zoom` style that scales based on viewport:

```jsx
<div style={{ 
  maxWidth: "8.5in", 
  margin: "0 auto",
  zoom: isMobile ? 0.48 : 1,
}}>
```

The `0.48` zoom factor scales 8.5in (816px) down to roughly 392px which fits a mobile viewport. You may need to adjust this value — test on a real phone and tweak:
- iPhone SE: `0.45`
- iPhone 14/15: `0.48`  
- Larger phones: `0.5`

A good universal value is `Math.min(1, window.innerWidth / 816)` — this auto-calculates the perfect zoom:

```javascript
const [zoomLevel, setZoomLevel] = useState(1);

useEffect(() => {
  const calc = () => {
    const w = window.innerWidth;
    setZoomLevel(w < 816 ? (w - 16) / 816 : 1); // 16px for left/right margin
  };
  calc();
  window.addEventListener("resize", calc);
  return () => window.removeEventListener("resize", calc);
}, []);
```

Then apply:
```jsx
<div style={{ maxWidth: "8.5in", margin: "0 auto", zoom: zoomLevel }}>
```

### Step C: Fix the email gate modal on mobile

The email gate overlay (name/email form) appears before the scored results. Make sure it's readable on mobile:
- The form container should have `maxWidth: 480` with `width: "100%"` and `padding: "0 16px"` so it doesn't overflow
- Input fields should have `width: "100%"` and `boxSizing: "border-box"`
- The submit button should be full width on mobile

These inputs likely already have `width: "100%"` but verify they don't overflow the zoomed container.

### Apply to all 5 tools:
- `whats-my-business-worth` component
- `business-independence-blueprint` component
- `structural-capital-deep-dive` component
- `customer-capital-deep-dive` component
- `human-capital-deep-dive` component

---

## Fix 2: Resources Hub — Make Grids Responsive

The Resources Hub (`/tools`) already has a `useBp()` hook that provides a `mob` variable. Several grids don't use it. Fix these:

### Grid 1: ValueGap Calculator main layout (line ~681)

Find:
```jsx
<div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:14}}>
```

Replace with:
```jsx
<div style={{display:"grid",gridTemplateColumns: mob ? "1fr" : "2fr 1fr",gap:14}}>
```

### Grid 2: Attractiveness vs Readiness columns inside ValueGap calc (line ~684)

Find:
```jsx
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
```

Replace with:
```jsx
<div style={{display:"grid",gridTemplateColumns: mob ? "1fr" : "1fr 1fr",gap:16}}>
```

### Grid 3: Sliders + Results layout in See The Gap section (line ~778)

Find:
```jsx
<div style={{display: "grid", gridTemplateColumns: "280px 1fr", gap: 24, alignItems: "stretch"}}>
```

Replace with:
```jsx
<div style={{display: "grid", gridTemplateColumns: mob ? "1fr" : "280px 1fr", gap: mob ? 16 : 24, alignItems: "stretch"}}>
```

### Grid 4: 3 stat cards in hero area (line ~1296)

Find:
```jsx
<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24, maxWidth: 920, margin: "0 auto", alignItems: "stretch" }}>
```

Replace with:
```jsx
<div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr 1fr", gap: mob ? 16 : 24, maxWidth: 920, margin: "0 auto", alignItems: "stretch" }}>
```

### Additional Resources Hub mobile fixes:

Check for any text that's too large on mobile, buttons that overflow, or padding that's too wide. The `mob` variable is already available — use it for any conditional sizing needed.

---

## Fix 3: Constraint Roadmap Assessment — Mobile Check

The assessment flow component needs a mobile review. Check:

1. **Question cards** — do they fit within mobile viewport without horizontal scroll?
2. **Answer option buttons** — are they wide enough to tap but don't overflow?
3. **Score reveal section** — the score dashboard, category bars, and result cards should stack vertically on mobile
4. **Email gate form** — name/email inputs should be full width
5. **"View Your Personalized Roadmap" button** — should be full width on mobile, text should not overflow

If the assessment doesn't already have a mobile breakpoint hook, add one and apply conditional styling where needed. The homepage uses `useBp()` — use the same pattern.

---

## Testing

After implementing, test on a real mobile device (or Chrome DevTools mobile emulator):

1. **Resources Hub (`/tools`):**
   - Stat cards should stack vertically
   - ValueGap calculator should stack (scores above, summary below)
   - Attractiveness/Readiness columns should stack
   - Sliders should stack above results
   - No horizontal scrolling

2. **Any diagnostic tool (e.g. WMBW):**
   - Pages should zoom to fit the viewport
   - Text should be readable (small but legible)
   - Email gate form should be centered and usable
   - No horizontal scrolling

3. **Assessment flow:**
   - Questions and answers should fit
   - Score reveal should be readable
   - Email form should work
   - Roadmap button should fit

## Critical Instructions
- Use CSS `zoom` for the diagnostic tools, NOT `transform: scale` — zoom affects layout flow correctly while transform doesn't
- Do NOT change any scoring logic, content, or functionality
- Do NOT change the homepage or landing pages — they're already mobile-optimized
- Do NOT change generated Constraint Roadmap HTML files — they use a viewport meta tag for mobile scaling
- The Resources Hub already has `mob` available from `useBp()` — just use it in the grid styles
- Test on both iPhone-sized (375px) and Android-sized (412px) viewports
