# Replit Agent Prompt — Fix Assessment Flow: Roadmap Button + API Connection

## Problem
After a user completes the Constraint Roadmap assessment and enters their name/email, two things are broken:

1. **No "View Your Personalized Roadmap" button appears** — the post-submission screen just shows "A PDF copy of your results has been sent to [email]" with no roadmap link.
2. **No data reaches Vercel Blob Storage** — the `/api/lead-capture` serverless function either isn't being called or isn't returning the `roadmapUrl`.

## What Needs To Happen

### Step 1: Verify the API call is being made
In the assessment component, find the email submission handler (the function that fires when the user submits their name/email on the score reveal screen). It should be calling `POST /api/lead-capture`. 

Check that:
- The fetch call to `/api/lead-capture` is actually present and executing
- The payload includes `name`, `email`, and a `summary` object with `constraintId`, `revenue`, `categories`, and `totalScore`
- The response is being parsed as JSON

If the fetch call exists but isn't sending the right data, fix the payload to match this structure:

```javascript
const payload = {
  name: name.trim(),
  email: email.trim(),
  tool: "constraint-roadmap",
  summary: {
    constraintId: resultData.constraintId,
    revenue: resultData.revenue,
    categories: resultData.categories,
    totalScore: resultData.score,
  },
  timestamp: new Date().toISOString(),
};

const res = await fetch("/api/lead-capture", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});
```

### Step 2: Capture the roadmap URL from the response
After the fetch call succeeds, the API returns `{ success: true, roadmapUrl: "https://..." }`. Add state to capture this:

```javascript
const [roadmapUrl, setRoadmapUrl] = useState(null);
```

In the response handling:

```javascript
if (res.ok) {
  const responseData = await res.json();
  if (responseData.roadmapUrl) {
    setRoadmapUrl(responseData.roadmapUrl);
  }
}
```

### Step 3: Update the post-submission UI
Find the section that displays after email submission (the card that currently shows "A PDF copy of your results has been sent to [email]"). Keep that message, but add a prominent roadmap button below it.

After the existing confirmation card, add:

```jsx
{roadmapUrl && (
  <div style={{ textAlign: "center", marginTop: 24 }}>
    <a href={roadmapUrl} target="_blank" rel="noopener noreferrer"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        padding: "16px 40px",
        borderRadius: 14,
        textDecoration: "none",
        border: "1.5px solid rgba(200,162,78,0.5)",
        color: "#C8A24E",
        fontWeight: 700,
        fontSize: 15,
        letterSpacing: "0.02em",
        background: "linear-gradient(135deg, rgba(200,162,78,0.15), rgba(200,162,78,0.05))",
        boxShadow: "0 0 24px rgba(200,162,78,0.2), 0 4px 16px rgba(0,0,0,0.3)",
        fontFamily: "'DM Sans', sans-serif",
        position: "relative",
        overflow: "hidden",
        transition: "all 0.3s ease",
      }}>
      <span style={{
        position: "absolute", top: "-50%", left: "-50%", right: "-50%", bottom: "-50%",
        pointerEvents: "none",
        background: "linear-gradient(120deg, transparent 0%, transparent 40%, rgba(200,162,78,0.08) 48%, rgba(200,162,78,0.15) 50%, rgba(200,162,78,0.08) 52%, transparent 60%, transparent 100%)",
        backgroundSize: "200% 200%",
        animation: "btnShimmer 6s ease-in-out infinite",
      }} />
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C8A24E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: "relative", zIndex: 1 }}>
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
      <span style={{ position: "relative", zIndex: 1 }}>View Your Personalized Roadmap</span>
    </a>
  </div>
)}
```

This button should be prominent and visually distinct — it's the most important action on this screen. The shimmer animation matches the gold CTA pattern used elsewhere on the site.

### Step 4: Also update the confirmation message
Change the existing confirmation text from "A PDF copy of your results has been sent to [email]" to something like:

"Your results have been sent to **[email]**"

This way it doesn't promise a PDF (since the real deliverable is now the hosted roadmap link) but still confirms the email was captured.

### Step 5: Add error logging
Add a console.error if the API call fails, so we can diagnose issues in Vercel Logs:

```javascript
try {
  const res = await fetch("/api/lead-capture", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  
  if (res.ok) {
    const responseData = await res.json();
    console.log("[Assessment] API response:", responseData);
    if (responseData.roadmapUrl) {
      setRoadmapUrl(responseData.roadmapUrl);
    }
  } else {
    console.error("[Assessment] API error:", res.status, await res.text());
  }
} catch (err) {
  console.error("[Assessment] Fetch failed:", err);
}
```

## Critical Instructions
- Do NOT change any assessment questions, scoring logic, category weights, or score calculations.
- Do NOT change the score reveal UI or any content above the email submission area.
- Do NOT remove the existing PDF generation logic — it can stay as a fallback.
- The roadmap button should only appear if `roadmapUrl` is not null (i.e., the API successfully returned a URL).
- If the API call fails, the existing flow should still work — user sees their scores, the confirmation message shows, but no roadmap button appears.
- Make sure the `btnShimmer` keyframes animation exists somewhere in the component's styles (it may already exist from other gold buttons on the site).

## Testing
After implementing, take the assessment on the live site:
1. Answer all 7 questions
2. Enter name and email on the score reveal screen
3. Verify the confirmation message appears
4. Verify the "View Your Personalized Roadmap" button appears below it
5. Click the button — it should open a personalized 14-page roadmap in a new tab
6. Check Vercel Storage → Blob Store — a new HTML file should appear
