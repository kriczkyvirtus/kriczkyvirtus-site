# Replit Agent Prompt — Fix Homepage VIRTUS Watermark on Mobile

## Problem
The large "VIRTUS" SVG watermark near the bottom of the homepage (in the testimonials section) is too wide on mobile — only partial letters are visible.

## Fix
In the homepage component, find the background VIRTUS watermark SVG around line 1224-1236. It looks like this:

```jsx
<svg width="100%" height="100%" viewBox="0 0 1800 240" ...>
  <text x="900" y="170" ... fontSize="280" ...>VIRTUS</text>
</svg>
```

The `fontSize="280"` and `viewBox="0 0 1800 240"` are fixed regardless of screen size. On mobile, the text overflows.

Make the viewBox and fontSize responsive using the `mob` variable (already available from `useBp()`):

```jsx
<svg width="100%" height="100%" viewBox={mob ? "0 0 1000 160" : "0 0 1800 240"} preserveAspectRatio="xMidYMid meet" style={{ overflow: "visible" }}>
  <defs>
    <linearGradient id="virtusWmFade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor={C.gold} stopOpacity="0.12"/>
      <stop offset="40%" stopColor={C.gold} stopOpacity="0.07"/>
      <stop offset="70%" stopColor={C.gold} stopOpacity="0.03"/>
      <stop offset="100%" stopColor={C.gold} stopOpacity="0"/>
    </linearGradient>
  </defs>
  <text x={mob ? "500" : "900"} y={mob ? "120" : "170"} textAnchor="middle" fontFamily="'Cormorant Garamond', serif" fontSize={mob ? "160" : "280"} fontWeight="700" letterSpacing="0.25em" fill="none" stroke="url(#virtusWmFade)" strokeWidth={mob ? "0.8" : "1.2"}>VIRTUS</text>
</svg>
```

This reduces the font size and viewBox on mobile so the full word is visible.

## Critical Instructions
- Only change the SVG watermark — do NOT change any other homepage content
- The `mob` variable from `useBp()` is already available in this component
- Do NOT change the desktop appearance at all
- Test on mobile to confirm the full "VIRTUS" text is visible
