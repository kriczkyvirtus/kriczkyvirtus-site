# Replit Agent Prompt — Vercel Serverless Roadmap Generation Pipeline

## Overview

This project is a Vite + React app that deploys to Vercel. We need to add Vercel serverless functions that handle lead capture and personalized Constraint Roadmap generation. The frontend stays pure client-side React. All backend logic runs as Vercel serverless functions.

**End-to-end flow:**
1. Owner takes a 7-question assessment on the site (already built)
2. Owner enters name + email on the score reveal screen (already built)
3. Client POSTs to `/api/lead-capture` with contact info + assessment data
4. `/api/lead-capture` orchestrates 3 things in parallel:
   - Google Sheets: appends a row with lead data (stubbed for now)
   - ActiveCampaign: creates/updates contact with tags (stubbed for now)
   - Roadmap generation: server-side renders a personalized 14-page HTML document, uploads to Vercel Blob Storage, returns the URL
5. `/api/lead-capture` responds with `{ success: true, roadmapUrl: "..." }`
6. Client shows a "View Your Personalized Roadmap" button linking to that URL

## File Structure

Add these files/directories. **Do NOT modify or move any existing files** except where explicitly noted.

```
api/
  lead-capture.js              ← NEW: Vercel serverless function (main endpoint)
  render-roadmap.js            ← NEW: Vercel serverless function (standalone test endpoint)
lib/
  generate-roadmap.js          ← NEW: Shared SSR rendering logic
shared/
  ConstraintRoadmap-v5.cjs.jsx ← NEW: CJS version of the roadmap template
  constraints-final.cjs.js     ← NEW: CJS version of the constraints content
vercel.json                    ← NEW (or MODIFY if it already exists)
```

## Step-by-Step Instructions

### Step 1: Install Dependencies

```bash
npm install @vercel/blob @babel/register @babel/preset-react @babel/core
```

React and react-dom should already be installed. If not, add them too.

### Step 2: Create the `shared/` directory with CJS template files

I am providing two files:
- `ConstraintRoadmap-v5.jsx` — the roadmap template component (ES module)
- `constraints-final.js` — all constraint content data (ES module)

Both need to be converted to CommonJS for the serverless functions. Create the `shared/` directory and place CJS copies there.

**Create `shared/ConstraintRoadmap-v5.cjs.jsx`:**
Copy `ConstraintRoadmap-v5.jsx` into `shared/ConstraintRoadmap-v5.cjs.jsx`, then apply these four transformations:

1. Replace the line `import React from "react";`
   With: `const React = require("react");`

2. Replace the line `import {`
   With: `const {`

3. Replace the line `} from "./constraints-final";`
   With: `} = require("./constraints-final.cjs.js");`

4. Replace `export default function`
   With: `module.exports = function`

**Create `shared/constraints-final.cjs.js`:**
Copy `constraints-final.js` into `shared/constraints-final.cjs.js`, then:
- Remove all `export` keywords from function/const declarations
- Add at the very end of the file:
```javascript
module.exports = { CONSTRAINTS, STRATEGIC_INTENSIVE_COPY, resolveConstraint, getRevenueTier };
```

### Step 3: Create `lib/generate-roadmap.js`

This is the shared rendering module imported by both serverless functions.

```javascript
require("@babel/register")({
  presets: ["@babel/preset-react"],
  extensions: [".jsx"],
  only: [/shared/],
});

const React = require("react");
const ReactDOMServer = require("react-dom/server");
const crypto = require("crypto");
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

/**
 * Generate personalized Constraint Roadmap HTML and upload to Vercel Blob Storage.
 *
 * @param {Object} params
 * @param {string} params.name          — Owner's name
 * @param {string} params.email         — Owner's email
 * @param {number} params.score         — Composite score 0-100
 * @param {string} params.constraintId  — One of: profitability, cash_flow, revenue_quality, owner_dependency, operational_efficiency, scalability
 * @param {string} params.revenue       — One of: under_500k, 500k_1m, 1m_3m, 3m_10m
 * @param {Array}  params.categories    — Array of { name, score, color } (6 entries)
 *
 * @returns {Promise<{ id: string, url: string }>}
 */
async function generateRoadmap({ name, email, score, constraintId, revenue, categories }) {
  // Dynamic import of @vercel/blob (ESM package)
  const { put } = await import("@vercel/blob");

  // Generate unique ID
  const raw = `${email}-${constraintId}-${revenue}-${Date.now()}`;
  const id = crypto.createHash("sha256").update(raw).digest("hex").slice(0, 12);

  // Build the data object the template expects
  const data = { score, constraintId, revenue, categories };

  // Generate date string
  const now = new Date();
  const generatedDate = now.toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });

  // Render the React component to static HTML
  const element = React.createElement(ConstraintRoadmap, {
    data,
    recipientName: name,
    generatedDate,
    diagnosticId: id.slice(0, 6).toUpperCase(),
  });
  const markup = ReactDOMServer.renderToStaticMarkup(element);

  const label = `${CONSTRAINT_NAMES[constraintId] || constraintId} · ${TIER_NAMES[revenue] || revenue}`;

  // Wrap in full HTML document
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

  console.log(`[Roadmap] Generated: ${id} for ${name} (${constraintId}/${revenue}) — ${Math.round(fullHTML.length / 1024)}KB — ${blob.url}`);

  return { id, url: blob.url };
}

module.exports = { generateRoadmap };
```

### Step 4: Create `api/lead-capture.js`

This is the main orchestrator endpoint. The client calls this once. It handles everything.

```javascript
const { generateRoadmap } = require("../lib/generate-roadmap");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      name, email, tool, toolName, scores, summary, timestamp, pdfBase64,
    } = req.body;

    // Validate required fields for roadmap generation
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

    // Run all three jobs in parallel
    const [roadmapResult, sheetsResult, acResult] = await Promise.allSettled([
      // 1. Generate personalized roadmap
      generateRoadmap({
        name,
        email,
        score: totalScore,
        constraintId,
        revenue,
        categories,
      }),

      // 2. Google Sheets — append row
      // TODO: Implement Google Sheets integration
      // appendToSheet({ name, email, totalScore, constraintId, revenue, categories, timestamp })
      Promise.resolve({ status: "stub", message: "Google Sheets not yet connected" }),

      // 3. ActiveCampaign — create/update contact + tag
      // TODO: Implement ActiveCampaign integration
      // createOrUpdateContact({ name, email, constraintId, revenue, totalScore })
      Promise.resolve({ status: "stub", message: "ActiveCampaign not yet connected" }),
    ]);

    // Extract roadmap URL
    let roadmapUrl = null;
    if (roadmapResult.status === "fulfilled") {
      roadmapUrl = roadmapResult.value.url;
    } else {
      console.error("[Lead] Roadmap generation failed:", roadmapResult.reason);
    }

    // TODO: Send email via Resend with roadmap link
    // if (roadmapUrl) {
    //   await sendRoadmapEmail({ name, email, roadmapUrl, constraintId, revenue });
    // }

    // Log results
    console.log(`[Lead] Results — roadmap: ${roadmapResult.status}, sheets: ${sheetsResult.status}, ac: ${acResult.status}`);

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

### Step 5: Create `api/render-roadmap.js`

Standalone test endpoint — useful for testing roadmap generation directly without going through the full lead-capture flow.

```javascript
const { generateRoadmap } = require("../lib/generate-roadmap");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email, score, constraintId, revenue, categories } = req.body;

    if (!name || !constraintId || !revenue || !categories) {
      return res.status(400).json({
        error: "Missing required fields: name, constraintId, revenue, categories",
      });
    }

    const result = await generateRoadmap({
      name,
      email: email || "test@test.com",
      score: score || 50,
      constraintId,
      revenue,
      categories,
    });

    return res.status(200).json({
      success: true,
      id: result.id,
      url: result.url,
    });
  } catch (err) {
    console.error("[Render] Failed:", err);
    return res.status(500).json({ error: "Roadmap rendering failed" });
  }
};
```

### Step 6: Create or update `vercel.json`

If a `vercel.json` already exists, merge these settings. If not, create it:

```json
{
  "buildCommand": "vite build",
  "outputDirectory": "dist",
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

The `maxDuration: 30` gives the SSR function enough time for cold starts with Babel compilation. The rewrites ensure API routes go to serverless functions and everything else serves the SPA.

### Step 7: Update the Assessment Flow — Single API Call

In the assessment component (the Constraint Roadmap assessment page), find the email submission handler — the function that calls `POST /api/lead-capture`.

**The payload the client already sends is correct.** It already includes `name`, `email`, `summary` (with `constraintId`, `revenue`, `categories`, `totalScore`). No change needed to the request.

**What needs to change:** The response handling. The API now returns `{ success: true, roadmapUrl: "..." }`. Update the handler to capture the roadmap URL.

Add a state variable:
```javascript
const [roadmapUrl, setRoadmapUrl] = useState(null);
```

In the existing try block where `res.ok` is checked, extract the roadmap URL:
```javascript
if (res.ok) {
  const responseData = await res.json();
  if (responseData.roadmapUrl) {
    setRoadmapUrl(responseData.roadmapUrl);
  }
  setEmailSubmitted(true);
  return;
}
```

Then, in the post-email-submission UI (the section shown after `emailSubmitted` is true), add a prominent CTA button. Find the Glass card that currently shows "Loading your full results..." or similar confirmation copy, and add this button inside it:

```jsx
{roadmapUrl && (
  <div style={{ textAlign: "center", marginTop: 16 }}>
    <a href={roadmapUrl} target="_blank" rel="noopener noreferrer"
      style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        padding: "14px 36px", borderRadius: 12, textDecoration: "none",
        border: `1.5px solid ${C.gold}50`, color: C.gold, fontWeight: 700,
        fontSize: 14, letterSpacing: "0.02em",
        background: `linear-gradient(135deg, ${C.gold}18, ${C.gold}0a)`,
        boxShadow: `0 0 20px ${C.gold}20, 0 4px 12px rgba(0,0,0,0.3)`,
        fontFamily: "'DM Sans', sans-serif", position: "relative", overflow: "hidden",
      }}>
      <span style={{
        position: "absolute", top: "-50%", left: "-50%", right: "-50%", bottom: "-50%",
        pointerEvents: "none",
        background: `linear-gradient(120deg, transparent 0%, transparent 40%, ${C.gold}12 48%, ${C.gold}20 50%, ${C.gold}12 52%, transparent 60%, transparent 100%)`,
        backgroundSize: "200% 200%", animation: "btnShimmer 6s ease-in-out infinite",
      }} />
      <span style={{ position: "relative", zIndex: 1 }}>View Your Personalized Roadmap</span>
    </a>
  </div>
)}
```

If `roadmapUrl` is null (generation failed silently), the button simply doesn't appear and the existing flow is unchanged.

### Step 8: Environment Variables

These need to be set in the Vercel dashboard (Settings → Environment Variables), NOT in the codebase:

**Required now:**
- `BLOB_READ_WRITE_TOKEN` — Get this from Vercel Dashboard → Storage → Create Blob Store → then copy the token. This is required for Vercel Blob Storage to work.

**Required later (stubbed for now):**
- `GOOGLE_SHEETS_CREDENTIALS` — Service account JSON for Sheets API
- `GOOGLE_SHEETS_SPREADSHEET_ID` — Target spreadsheet ID
- `ACTIVECAMPAIGN_API_KEY` — ActiveCampaign API key
- `ACTIVECAMPAIGN_API_URL` — ActiveCampaign account URL
- `RESEND_API_KEY` — Resend API key for transactional email

### Step 9: Vercel Blob Storage Setup

In the Vercel Dashboard:
1. Go to the project → Storage tab
2. Click "Create Database" → select "Blob"
3. Name it `roadmaps` (or anything)
4. Connect it to the project
5. This automatically sets the `BLOB_READ_WRITE_TOKEN` environment variable

## Critical Instructions

1. **Do NOT modify `ConstraintRoadmap-v5.jsx` or `constraints-final.js` content.** These are verified production files. You are only creating CJS copies in `shared/` for the serverless functions to import.

2. **Do NOT modify anything in `src/` except the assessment component's email handler** (to capture `roadmapUrl` from the response and show the button).

3. **Do NOT restructure, rename, or reorganize any existing files.** This is purely additive — new directories, new files, config update.

4. **Do NOT remove the existing PDF generation logic** (`html2canvas` + `jsPDF`). It can stay as a client-side fallback. The server-side rendering is the primary delivery path now, but the client-side PDF is harmless to keep.

5. **The `api/` directory must be at the project root** — this is how Vercel discovers serverless functions. Do not nest it inside `src/`.

6. **Test after deployment to Vercel**, not locally. The Vercel Blob Storage API only works in the Vercel runtime. To test locally, you would need `vercel dev` with the Vercel CLI, but it's easier to just deploy and test on a preview URL.

7. **If the serverless function fails with a JSX/Babel error**, the most likely cause is the CJS conversion of `shared/ConstraintRoadmap-v5.cjs.jsx`. Verify:
   - Line 1 is `const React = require("react");`
   - The import block uses `const { ... } = require("./constraints-final.cjs.js");`
   - The default export is `module.exports = function ConstraintRoadmapV2(`

## Files I Am Providing

You will receive these files alongside this prompt:
1. **`ConstraintRoadmap-v5.jsx`** — the roadmap template (create CJS copy in `shared/`)
2. **`constraints-final.js`** — the constraint content data (create CJS copy in `shared/`)

Both go into `shared/` as CJS copies. Follow the conversion steps in Step 2 exactly.

## What This Does NOT Cover (future prompts)

- Google Sheets integration (Phase 3 — stubbed with TODO)
- ActiveCampaign contact creation and tagging (Phase 3 — stubbed with TODO)
- Resend email delivery with roadmap link (Phase 4 — stubbed with TODO)
- DNS verification for kriczkyvirtus.com sending domain
- Other diagnostic tool email gates routing to `/api/lead-capture`
