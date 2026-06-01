# Replit Agent Prompt — Capture and Store Diagnostic Tool Results as HTML in Blob Storage

## Goal
When a user completes any of the 5 diagnostic tools (WMBW, BIB, Structural/Customer/Human Capital Deep Dives) and submits their name and email, we want to capture the full rendered HTML of their scored results and store it in Vercel Blob Storage — the same way we store Constraint Roadmap HTML files.

## How It Works

### Step 1: Capture the rendered HTML on the client

In each of the 5 diagnostic tool components, after the email is submitted and the results are displayed (the scored/unlocked state), capture the full page HTML and send it to the API.

Add this logic right after the email submission — use a small delay to ensure the scored results have rendered:

```javascript
// Fire-and-forget lead capture (already implemented)
fetch("/api/lead-capture", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: name.trim(),
    email: email.trim(),
    tool: "TOOL_NAME",
    summary: { /* scores */ },
    timestamp: new Date().toISOString(),
  }),
}).catch(err => console.error("[Lead] Fetch failed:", err));

// Set submitted state immediately so results render
setEmailSubmitted(true);
setLoading(false);

// After a short delay (to let scored results render), capture and store the HTML
setTimeout(async () => {
  try {
    // Capture the full page HTML
    const htmlContent = document.documentElement.outerHTML;
    const fullHTML = `<!DOCTYPE html><html>${htmlContent}</html>`;
    
    const res = await fetch("/api/store-results", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim(),
        tool: "TOOL_NAME",
        html: fullHTML,
      }),
    });
    
    if (res.ok) {
      console.log("[Tool] Results stored successfully");
    } else {
      console.error("[Tool] Failed to store results:", res.status);
    }
  } catch (err) {
    console.error("[Tool] Store results failed:", err);
  }
}, 2000); // 2 second delay to ensure results are fully rendered
```

**Tool names to use:**
- WMBW: `"value-range-estimator"`
- BIB: `"business-independence-blueprint"`
- Structural: `"structural-capital-deep-dive"`
- Customer: `"customer-capital-deep-dive"`
- Human: `"human-capital-deep-dive"`

### Step 2: Create the `/api/store-results` serverless function

Create a new file at the repo root: `api/store-results.js`

```javascript
module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email, tool, html } = req.body;

    if (!name || !email || !tool || !html) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const { put } = await import("@vercel/blob");
    const crypto = require("crypto");

    // Generate unique ID
    const raw = `${email}-${tool}-${Date.now()}`;
    const id = crypto.createHash("sha256").update(raw).digest("hex").slice(0, 12);

    // Create URL-safe name
    const nameSlug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    // Store in Blob Storage under a folder for the tool type
    const blob = await put(`results/${tool}/${nameSlug}-${id}.html`, html, {
      access: "public",
      contentType: "text/html; charset=utf-8",
      addRandomSuffix: false,
    });

    console.log(`[Store] ${tool}: ${name} <${email}> — ${Math.round(html.length / 1024)}KB — ${blob.url}`);

    return res.status(200).json({ success: true, url: blob.url });

  } catch (err) {
    console.error("[Store] Failed:", err);
    return res.status(500).json({ error: "Storage failed" });
  }
};
```

### Step 3: Update vercel.json

Make sure the rewrites in `vercel.json` still route `/api/*` before the SPA catch-all. The existing config should already handle this since we have:

```json
{ "source": "/api/(.*)", "destination": "/api/$1" }
```

This will automatically pick up the new `api/store-results.js` function.

### Step 4: Update the `functions` block in vercel.json (if needed)

Make sure the functions config covers the new file:

```json
"functions": {
  "api/**/*.js": {
    "maxDuration": 30
  }
}
```

This should already be in place from the previous setup.

## Important Notes

- The HTML capture happens in the BACKGROUND after results are shown. It does NOT block the user experience.
- The 2-second delay gives React time to render the scored results before we capture the DOM.
- Each tool's results will be stored in its own subfolder in Blob Storage: `results/value-range-estimator/`, `results/business-independence-blueprint/`, etc.
- The Constraint Roadmap continues to use its existing server-side rendering pipeline — this new endpoint is only for the other 5 tools.
- The stored HTML is a snapshot of what the user saw, including all styles, scores, and personalized content.
- File sizes may be large (200KB–500KB+) because they include inline styles and embedded assets. This is fine — Vercel Blob Storage handles it.

## Critical Instructions
- Do NOT change any scoring logic, questions, or result display.
- Do NOT modify the Constraint Roadmap assessment flow — it has its own pipeline.
- The HTML capture must happen AFTER the scored results render, not before.
- This should NOT block or delay showing the user their results.
- Apply the client-side capture to ALL 5 tools.
