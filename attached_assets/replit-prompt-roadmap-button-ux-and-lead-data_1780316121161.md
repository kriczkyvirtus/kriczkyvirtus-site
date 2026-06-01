# Replit Agent Prompt — Roadmap Button UX + Lead Data Enhancements

## Three changes needed:

---

### Change 1: Add hover glow + arrow effect to "View Your Personalized Roadmap" button

In the assessment component, find the "View Your Personalized Roadmap" button (the `<a>` tag that links to the roadmap URL after email submission). Update it to match the gold CTA button style used elsewhere on the site — specifically:

- Add a shimmer/glow animation on hover (the `btnShimmer` keyframes animation that other gold buttons use)
- Add an arrow icon that appears or slides in on hover
- Add a subtle scale or box-shadow transition on hover

If the button is currently a plain `<a>` tag, wrap the content in spans for the shimmer overlay and add hover state handling. You can use React state (`const [hovered, setHovered] = useState(false)`) with `onMouseEnter`/`onMouseLeave` to toggle hover styles, or use CSS transitions with a `<style>` block.

Example hover effect pattern (adapt to match existing gold CTA buttons on the site):

```jsx
<a href={roadmapUrl} target="_blank" rel="noopener noreferrer"
  onMouseEnter={() => setRoadmapHover(true)}
  onMouseLeave={() => setRoadmapHover(false)}
  style={{
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: "16px 40px",
    borderRadius: 14,
    textDecoration: "none",
    border: roadmapHover ? "1.5px solid rgba(200,162,78,0.7)" : "1.5px solid rgba(200,162,78,0.5)",
    color: "#C8A24E",
    fontWeight: 700,
    fontSize: 15,
    letterSpacing: "0.02em",
    background: roadmapHover
      ? "linear-gradient(135deg, rgba(200,162,78,0.22), rgba(200,162,78,0.10))"
      : "linear-gradient(135deg, rgba(200,162,78,0.15), rgba(200,162,78,0.05))",
    boxShadow: roadmapHover
      ? "0 0 32px rgba(200,162,78,0.35), 0 4px 20px rgba(0,0,0,0.3)"
      : "0 0 24px rgba(200,162,78,0.2), 0 4px 16px rgba(0,0,0,0.3)",
    fontFamily: "'DM Sans', sans-serif",
    transition: "all 0.3s ease",
    transform: roadmapHover ? "translateY(-1px)" : "none",
  }}>
  View Your Personalized Roadmap
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C8A24E" strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round"
    style={{
      transition: "transform 0.3s ease, opacity 0.3s ease",
      transform: roadmapHover ? "translateX(4px)" : "translateX(0)",
      opacity: roadmapHover ? 1 : 0.5,
    }}>
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
</a>
```

Add the state variable:
```javascript
const [roadmapHover, setRoadmapHover] = useState(false);
```

---

### Change 2: Open roadmap in new tab (not download)

The roadmap link should already have `target="_blank"` which opens in a new tab. If it's downloading instead of opening, the issue is that the Vercel Blob URL might be triggering a download.

To fix this, in `api/lead-capture.js`, find where the blob is uploaded with `put()`. Update the `put()` call to include `addRandomSuffix: false` and make sure `contentType` is set correctly:

```javascript
const blob = await put(`roadmaps/${id}.html`, fullHTML, {
  access: "public",
  contentType: "text/html; charset=utf-8",
  addRandomSuffix: false,
  cacheControlMaxAge: 31536000,
});
```

If the file is still downloading after this change, it may be a browser behavior issue with the blob URL. As an alternative, add an `onClick` handler to the button that opens the URL via `window.open()`:

```jsx
onClick={(e) => {
  e.preventDefault();
  window.open(roadmapUrl, '_blank');
}}
```

---

### Change 3: Capture individual question answers + name the blob file with the lead's name

#### Part A: Send individual answers to the API

In the assessment component, find where the API payload is constructed (the `apiPayload` or `payload` object sent to `/api/lead-capture`). Add the individual question answers to the payload.

Find the answers/responses state — this is whatever stores each question's selected answer (likely an object or array). Add it to the payload:

```javascript
const apiPayload = {
  name: name.trim(),
  email: email.trim(),
  tool: "constraint-roadmap",
  summary: {
    constraintId: resultData.constraintId,
    revenue: resultData.revenue,
    categories: resultData.categories,
    totalScore: resultData.score,
  },
  answers: answers,  // ADD THIS — the raw answers object/array from the assessment
  timestamp: new Date().toISOString(),
};
```

The `answers` variable should be whatever the component uses to store the user's selected answer for each question. It might be called `answers`, `responses`, `selections`, or similar. Include it as-is — the exact format doesn't matter yet since it will just be logged on the server until we wire up Google Sheets.

#### Part B: Include the lead's name in the blob filename

In `api/lead-capture.js`, find where the blob filename/path is constructed. Update it to include a slugified version of the lead's name:

Find the line that creates the blob path (something like):
```javascript
const blob = await put(`roadmaps/${id}.html`, fullHTML, {
```

Replace with:
```javascript
// Create a URL-safe version of the name
const nameSlug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const blob = await put(`roadmaps/${nameSlug}-${id}.html`, fullHTML, {
```

This changes the filename from `915f1173ec54.html` to `edward-kriczky-915f1173ec54.html`, making it easy to identify who each roadmap belongs to in the Blob Storage browser.

#### Part C: Log the individual answers on the server

In `api/lead-capture.js`, update the log line to include the answers:

```javascript
console.log(`[Lead] ${name} <${email}> — ${tool || "constraint-roadmap"} — ${constraintId}/${revenue} — score: ${totalScore}`);
console.log(`[Lead] Answers:`, JSON.stringify(req.body.answers || {}));
```

---

## Critical Instructions
- Do NOT change any assessment questions, scoring logic, or score calculations.
- Do NOT change the roadmap generation/rendering logic — only the filename and logging.
- The hover effect should match the existing gold CTA button pattern on the site.
- Test all three changes after deploying.
