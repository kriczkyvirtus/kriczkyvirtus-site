# Replit Agent Prompt — Wire Assessment to /api/lead-capture (CRITICAL FIX)

## Problem
The Constraint Roadmap assessment is NOT calling the `/api/lead-capture` serverless function when a user submits their name and email. The Vercel logs show zero API calls. The "View Your Personalized Roadmap" button never appears. This is the critical connection between the assessment and the personalized roadmap generation.

## What You Need To Do

### Fix 1: Find the email submission handler
Open the Constraint Roadmap assessment component. Find the function that handles the email/name form submission — this is the handler that fires when the user clicks the submit button on the score reveal screen (the screen that shows after all 7 questions are answered).

Look for:
- A form submit handler or button onClick
- Code that sets `emailSubmitted` to true
- Any existing fetch call to `/api/lead-capture`

### Fix 2: Add the API call
In that handler, BEFORE setting `emailSubmitted` to true, add this API call:

```javascript
// Generate personalized roadmap via serverless function
let roadmapUrl = null;
try {
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
    timestamp: new Date().toISOString(),
  };
  
  console.log("[Assessment] Calling /api/lead-capture with:", apiPayload);
  
  const res = await fetch("/api/lead-capture", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(apiPayload),
  });
  
  if (res.ok) {
    const responseData = await res.json();
    console.log("[Assessment] API response:", responseData);
    if (responseData.roadmapUrl) {
      roadmapUrl = responseData.roadmapUrl;
    }
  } else {
    console.error("[Assessment] API error:", res.status, await res.text());
  }
} catch (err) {
  console.error("[Assessment] Fetch failed:", err);
}
```

Note: `resultData` refers to whatever variable holds the assessment results object with `constraintId`, `revenue`, `categories`, and `score`. The variable name may be different in the actual code — use whatever the component uses to store the computed results.

### Fix 3: Add roadmapUrl state
At the top of the component, alongside the other useState declarations, add:

```javascript
const [roadmapUrl, setRoadmapUrl] = useState(null);
```

Then in the API call above, after `roadmapUrl = responseData.roadmapUrl;`, add:

```javascript
setRoadmapUrl(responseData.roadmapUrl);
```

### Fix 4: Add the roadmap button to the post-submission UI
Find where the component renders the post-email-submission confirmation (the card that says "A PDF copy of your results has been sent to [email]" or similar). 

Directly AFTER that confirmation card, add this button:

```jsx
{roadmapUrl && (
  <div style={{ textAlign: "center", marginTop: 24, marginBottom: 24 }}>
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
      }}>
      View Your Personalized Roadmap
    </a>
  </div>
)}
```

### Fix 5: Update the "Book a free working session" link
On the same post-submission / results screen, find the link that says "Ready for hands-on help? Book a free working session". Update it so that:
- The `href` points to `https://www.kriczkyvirtus.com/free-session`
- It opens in a new tab: add `target="_blank"` and `rel="noopener noreferrer"`

### Fix 6: Make the handler async
The email submission handler MUST be `async` for the `await fetch(...)` to work. If the handler function is not already async, add the `async` keyword:

```javascript
// Before:
const handleEmailSubmit = () => { ... }
// or
const handleEmailSubmit = (e) => { ... }

// After:
const handleEmailSubmit = async () => { ... }
// or  
const handleEmailSubmit = async (e) => { ... }
```

## How To Verify
1. Open browser developer tools (F12) → Console tab
2. Go through the assessment, enter name/email, submit
3. You should see `[Assessment] Calling /api/lead-capture with: {...}` in the console
4. Then `[Assessment] API response: { success: true, roadmapUrl: "https://..." }`
5. The "View Your Personalized Roadmap" button should appear
6. Clicking it should open a 14-page personalized roadmap in a new tab

If you see `[Assessment] API error:` or `[Assessment] Fetch failed:` in the console, something is wrong with the serverless function — share the error message.

## Critical Instructions
- Do NOT change any assessment questions, scoring logic, or score reveal UI.
- Do NOT remove the existing PDF generation logic.
- The API call should NOT block the UI — if it fails, the user should still see their scores and the confirmation message. The roadmap button simply won't appear.
- The handler must be `async` for this to work.
