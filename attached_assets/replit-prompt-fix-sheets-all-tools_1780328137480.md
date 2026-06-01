# Replit Agent Prompt — Fix Google Sheets Not Writing for Non-Roadmap Tools

## Problem
When non-roadmap tools (WMBW, BIB, Capital Deep Dives) call `/api/lead-capture`, the function returns 200 but makes NO outgoing API requests — meaning Google Sheets is never called. Only the Constraint Roadmap successfully writes to Sheets.

## Root Cause
The `appendLead()` call in `api/lead-capture.js` is either:
1. Inside a conditional block that only executes when `constraintId`/`revenue`/`categories` are present (which non-roadmap tools don't send), OR
2. After a validation check that returns early when those fields are missing, OR
3. Inside the `Promise.allSettled` block alongside roadmap generation, which is wrapped in a condition

## Fix
Open `api/lead-capture.js` and make these changes:

### Change 1: Ensure validation only requires name and email
Find the validation block. It should only require `name` and `email` — NOT `constraintId`, `revenue`, or `categories`. Those are optional (only present for the Constraint Roadmap).

```javascript
// This is CORRECT — only require name and email:
if (!name || !email) {
  return res.status(400).json({ error: "Missing required fields: name, email" });
}

// This is WRONG — do NOT require constraint data for all tools:
// if (!name || !email || !constraintId || !revenue || !categories) { ... }
```

If the validation still requires constraint fields, fix it to only require name and email.

### Change 2: Make appendLead ALWAYS run, regardless of tool type
The `appendLead()` call must happen for EVERY tool, not just the Constraint Roadmap. Find where `appendLead` is called and make sure it is NOT inside any conditional block.

The structure should be:

```javascript
module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email, tool, summary, answers, timestamp } = req.body;

    // Only require name and email
    if (!name || !email) {
      return res.status(400).json({ error: "Missing required fields: name, email" });
    }

    const constraintId = summary?.constraintId;
    const revenue = summary?.revenue;
    const categories = summary?.categories;
    const totalScore = summary?.totalScore;

    console.log(`[Lead] ${name} <${email}> — ${tool || "unknown"} — ${constraintId || "n/a"}/${revenue || "n/a"} — score: ${totalScore || "n/a"}`);

    // ========================================
    // STEP 1: Google Sheets — ALWAYS runs for ALL tools
    // ========================================
    let sheetsPromise;
    try {
      const { appendLead } = require("../lib/sheets");
      sheetsPromise = appendLead({
        name,
        email,
        tool: tool || "unknown",
        summary: summary || {},
        answers: answers || {},
        timestamp: timestamp || new Date().toISOString(),
        blobUrl: "",  // Will be empty initially; updated later for tools with HTML storage
      });
    } catch (sheetsErr) {
      console.error("[Sheets] Failed to start appendLead:", sheetsErr);
      sheetsPromise = Promise.resolve();
    }

    // ========================================
    // STEP 2: Roadmap generation — ONLY for Constraint Roadmap
    // ========================================
    let roadmapUrl = null;
    let roadmapPromise = Promise.resolve();
    if (constraintId && revenue && categories) {
      roadmapPromise = (async () => {
        try {
          // ... existing roadmap generation code ...
          // After generation, roadmapUrl = blob.url;
        } catch (renderErr) {
          console.error("[Roadmap] Generation failed:", renderErr);
        }
      })();
    }

    // Wait for both to complete
    await Promise.allSettled([sheetsPromise, roadmapPromise]);

    // If roadmap was generated and we have the URL, update Sheets with it
    if (roadmapUrl) {
      try {
        const { appendLead } = require("../lib/sheets");
        // Note: The link will already be in the row if we passed it above
        // But since roadmap generation happens in parallel, we may need to update it
        console.log(`[Lead] Roadmap URL: ${roadmapUrl}`);
      } catch (e) {}
    }

    return res.status(200).json({
      success: true,
      roadmapUrl,
    });

  } catch (err) {
    console.error("[Lead] Unhandled error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
```

### The key point:
`appendLead()` is called BEFORE any roadmap-specific conditional logic. It runs for every single tool that hits this endpoint. The roadmap generation is a SEPARATE step that only runs when constraint data is present.

### Change 3: Verify the require path for lib/sheets
Make sure the import path is correct. From `api/lead-capture.js`, the path to `lib/sheets.js` should be:

```javascript
const { appendLead } = require("../lib/sheets");
```

If the file is at a different location, adjust the path. You can verify by checking where `lib/sheets.js` is in the file tree relative to `api/lead-capture.js`.

### Change 4: Also verify appendLead writes to Aggregated
In `lib/sheets.js`, double-check that the Aggregated tab write is actually executing. Add a console.log right before the Aggregated write:

```javascript
console.log(`[Sheets] About to write to Aggregated tab. Row data:`, JSON.stringify(aggregatedRow));
```

This will show up in Vercel Logs and confirm whether the code is reached.

## Testing
After deploying:
1. Go through WMBW on the live site, enter name/email
2. Check Vercel Logs — you should see:
   - `[Lead] Name <email> — value-range-estimator — ...`
   - `[Sheets] Wrote to "WMBW" tab for Name <email>`
   - `[Sheets] About to write to Aggregated tab...`
   - `[Sheets] Wrote to "Aggregated" tab for Name <email>`
3. Check External APIs in the log — it should show outgoing requests to `sheets.googleapis.com`
4. Check the Google Sheet — rows should appear in both WMBW and Aggregated tabs

## Critical Instructions
- The `appendLead()` call MUST be outside any `if (constraintId && revenue && categories)` block
- The validation MUST only require `name` and `email`
- Do NOT change the roadmap generation logic
- Do NOT change any frontend code
