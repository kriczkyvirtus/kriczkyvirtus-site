# Replit Agent Prompt — Create Vercel Serverless Function for Lead Capture

## Problem
The `/api/lead-capture` endpoint currently lives inside `artifacts/api-server/`, which runs as a separate Express service in Replit's dev environment. However, on Vercel (production), only the static frontend from `artifacts/kriczky-virtus` is deployed. The api-server doesn't run on Vercel at all, so `/api/lead-capture` returns 405 (Method Not Allowed) in production.

## Solution
Create a proper Vercel serverless function at the **repo root** in an `api/` directory. Vercel automatically discovers and deploys files in `/api/` as serverless functions.

## What You Need To Do

### Step 1: Create the serverless function directory at the repo root
Create a directory called `api/` at the very top level of the repo (same level as `artifacts/`, `package.json`, `vercel.json`). This is NOT inside any artifact — it's at the root.

### Step 2: Create `api/lead-capture.js`

Create this file at the repo root:

```javascript
// api/lead-capture.js
// Vercel serverless function for lead capture + roadmap generation

const React = require("react");
const ReactDOMServer = require("react-dom/server");
const crypto = require("crypto");

module.exports = async function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email, tool, summary, timestamp } = req.body;

    const constraintId = summary?.constraintId;
    const revenue = summary?.revenue;
    const categories = summary?.categories;
    const totalScore = summary?.totalScore;

    if (!name || !email || !constraintId || !revenue || !categories) {
      return res.status(400).json({
        error: "Missing required fields: name, email, and summary with constraintId, revenue, categories",
      });
    }

    console.log(`[Lead] ${name} <${email}> — ${tool || "constraint-roadmap"} — ${constraintId}/${revenue} — score: ${totalScore}`);

    // Generate personalized roadmap
    let roadmapUrl = null;
    try {
      // Dynamic import of @vercel/blob
      const { put } = await import("@vercel/blob");

      // Generate unique ID
      const raw = `${email}-${constraintId}-${revenue}-${Date.now()}`;
      const id = crypto.createHash("sha256").update(raw).digest("hex").slice(0, 12);

      // Build data object
      const data = { score: totalScore, constraintId, revenue, categories };

      const now = new Date();
      const generatedDate = now.toLocaleDateString("en-US", {
        month: "long", day: "numeric", year: "numeric",
      });

      // Import the roadmap template and constraints
      // We need @babel/register to handle JSX
      require("@babel/register")({
        presets: ["@babel/preset-react"],
        extensions: [".jsx"],
        only: [/shared/],
      });

      const path = require("path");
      const ConstraintRoadmap = require(path.join(__dirname, "..", "shared", "ConstraintRoadmap-v5.cjs.jsx"));
      
      const CONSTRAINT_NAMES = {
        profitability: "Profitability",
        cash_flow: "Cash Flow",
        revenue_quality: "Revenue Quality",
        owner_dependency: "Owner Dependency",
        operational_efficiency: "Operational Efficiency",
        scalability: "Scalability",
      };
      const TIER_NAMES = {
        under_500k: "Survival",
        "500k_1m": "Stabilize",
        "1m_3m": "Growth",
        "3m_10m": "Optimize",
      };

      // Render
      const element = React.createElement(ConstraintRoadmap, {
        data,
        recipientName: name,
        generatedDate,
        diagnosticId: id.slice(0, 6).toUpperCase(),
      });
      const markup = ReactDOMServer.renderToStaticMarkup(element);

      const label = `${CONSTRAINT_NAMES[constraintId] || constraintId} · ${TIER_NAMES[revenue] || revenue}`;

      const fullHTML = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"/>
<meta name="viewport" content="width=816, initial-scale=0.5"/>
<title>Constraint Roadmap — ${label} — ${name}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet"/>
<style>html,body{margin:0;padding:0;background:#0A0E14;font-family:'DM Sans',sans-serif}
body{display:flex;flex-direction:column;align-items:center;padding:24px 0;gap:24px}
@keyframes btnShimmer{0%{background-position:200% 50%}100%{background-position:-200% 50%}}
@keyframes btnShimmerSlow{0%{background-position:200% 50%}100%{background-position:-200% 50%}}
</style>
</head><body>${markup}</body></html>`;

      // Upload to Vercel Blob Storage
      const blob = await put(`roadmaps/${id}.html`, fullHTML, {
        access: "public",
        contentType: "text/html; charset=utf-8",
      });

      roadmapUrl = blob.url;
      console.log(`[Roadmap] Generated: ${id} for ${name} (${constraintId}/${revenue}) — ${Math.round(fullHTML.length / 1024)}KB — ${blob.url}`);

    } catch (renderErr) {
      console.error("[Roadmap] Generation failed:", renderErr);
      // Don't fail the whole request if roadmap generation fails
    }

    // TODO: Google Sheets — append row
    // TODO: ActiveCampaign — create/update contact + tag
    // TODO: Resend — send email with roadmap link

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

### Step 3: Create the `shared/` directory with CJS template files
At the repo root (same level as `api/`), create a `shared/` directory with CommonJS versions of the roadmap template and constraints data.

**Find the original files:**
- `ConstraintRoadmap-v5.jsx` — the roadmap template component (should already be somewhere in the project)
- `constraints-final.js` — the constraints content data (should already be somewhere in the project)

**Create `shared/ConstraintRoadmap-v5.cjs.jsx`:**
Copy `ConstraintRoadmap-v5.jsx` into `shared/ConstraintRoadmap-v5.cjs.jsx`, then apply these transformations:

1. Replace `import React from "react";` with `const React = require("react");`
2. Replace `import {` with `const {`
3. Replace `} from "./constraints-final";` with `} = require("./constraints-final.cjs.js");`
4. Replace `export default function` with `module.exports = function`

**Create `shared/constraints-final.cjs.js`:**
Copy `constraints-final.js` into `shared/constraints-final.cjs.js`, then:
- Remove all `export` keywords from function/const declarations
- Add at the end: `module.exports = { CONSTRAINTS, STRATEGIC_INTENSIVE_COPY, resolveConstraint, getRevenueTier };`

### Step 4: Install dependencies at the repo root
These packages need to be available to the serverless function. Run from the repo root:

```bash
pnpm add @vercel/blob @babel/register @babel/preset-react @babel/core react react-dom
```

If the root `package.json` doesn't allow direct dependencies (monorepo workspace), add them there anyway — Vercel serverless functions resolve from the root `node_modules`.

### Step 5: Update `vercel.json`
Find `vercel.json` at the repo root. Update it to ensure API routes are handled BEFORE the SPA catch-all. The rewrites must be in this order:

```json
{
  "buildCommand": "pnpm --filter @workspace/kriczky-virtus build",
  "outputDirectory": "artifacts/kriczky-virtus/dist/public",
  "framework": "vite",
  "functions": {
    "api/**/*.js": {
      "maxDuration": 30
    }
  },
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**CRITICAL:** The `/api/(.*)` rewrite MUST come BEFORE the `/(.*)`  catch-all. If the catch-all is first, it will intercept API requests and serve index.html (which is exactly what's happening now — the 405 error).

If `vercel.json` already has other settings (like `installCommand`), keep them. Just make sure the `functions` block and the rewrite order are correct.

### Step 6: Verify the file structure
After all changes, the repo root should have:

```
api/
  lead-capture.js          ← NEW: Vercel serverless function
shared/
  ConstraintRoadmap-v5.cjs.jsx  ← NEW: CJS roadmap template
  constraints-final.cjs.js      ← NEW: CJS constraints data
artifacts/
  kriczky-virtus/          ← existing frontend
  api-server/              ← existing (NOT used by Vercel)
vercel.json                ← UPDATED with rewrites
package.json               ← UPDATED with new dependencies
```

### Step 7: Push and test
After all changes, commit and push to GitHub. Vercel will auto-deploy. Then:

1. Open browser dev tools (F12 → Console)
2. Go through the assessment
3. Enter name + email
4. Check console for `[Assessment] Calling /api/lead-capture` and `[Assessment] API response`
5. Verify the "View Your Personalized Roadmap" button appears
6. Click it — should open a 14-page personalized roadmap
7. Check Vercel Logs — should see `[Lead]` and `[Roadmap]` entries
8. Check Vercel Storage → Blob Store — should see a new HTML file

## Critical Instructions
- The `api/` directory MUST be at the repo root, NOT inside any artifact.
- The `shared/` directory MUST be at the repo root, NOT inside any artifact.
- Do NOT modify the existing `artifacts/api-server/` — it still works for local development.
- Do NOT modify the existing frontend code (the assessment component changes from the previous prompt should already be in place).
- The `vercel.json` rewrite order is critical — API routes before the SPA catch-all.
