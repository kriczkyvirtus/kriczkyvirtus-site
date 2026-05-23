# Replit Prompt — Add Lead Capture API Backend

Paste this into Replit Agent:

---

I need to add a Vercel serverless function for lead capture. This function will handle form submissions from all diagnostic tools and the Constraint Roadmap assessment. Here's exactly what to do:

## 1. Create the API folder structure

Create a folder called `api/` in the **project root** (NOT inside `src/`). The folder structure should be:

```
api/
├── lead-capture.js
└── package.json
```

## 2. Create api/package.json

Create `api/package.json` with this content:

```json
{
  "dependencies": {
    "googleapis": "^130.0.0"
  }
}
```

Then run:
```
cd api && npm install && cd ..
```

## 3. Create api/lead-capture.js

I will provide the complete file contents for `api/lead-capture.js`. **DO NOT modify it in any way.**

## 4. Create or update vercel.json

Create `vercel.json` in the **project root** (or update it if it already exists) with this content:

```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" },
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "functions": {
    "api/lead-capture.js": {
      "memory": 1024,
      "maxDuration": 30
    }
  }
}
```

**Important:** If a `vercel.json` already exists, merge these settings into it. The `rewrites` array should have the `/api/(.*)` rule BEFORE the catch-all `/(.*)` rule. The `functions` block is new and should be added.

## 5. Add .env to .gitignore

Make sure `.env` is in your `.gitignore` file so credentials don't get committed. Add this line if it's not already there:

```
.env
```

## 6. Create .env for local testing (optional)

Create a `.env` file in the project root with placeholder values. These will be replaced with real values in Vercel's dashboard:

```
ACTIVECAMPAIGN_URL=https://kriczkyvirtus.activehosted.com
ACTIVECAMPAIGN_KEY=your_key_here
RESEND_API_KEY=your_key_here
GOOGLE_SHEETS_ID=your_sheet_id_here
GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_key_here\n-----END PRIVATE KEY-----"
```

## DO NOT
- DO NOT put the api/ folder inside src/
- DO NOT modify any files in src/
- DO NOT modify App.jsx, ResourcesHub.jsx, or any tool files
- DO NOT install googleapis in the main project — it goes in api/package.json only

## What this function does (for context, no action needed)

When a user completes a diagnostic tool or the Constraint Roadmap and submits their name + email:
1. The frontend POSTs to `/api/lead-capture` with their name, email, tool slug, scores, and a PDF of their results
2. The serverless function sends an email with the PDF to the lead AND to ekriczky@kriczkyvirtus.com (via Resend)
3. It creates/updates the contact in ActiveCampaign with a tool-specific tag
4. It logs the submission to Google Sheets (tool-specific tab + Aggregated tab)
5. It returns success so the frontend unlocks the results

The environment variables will be set in Vercel's dashboard after deployment, not in the codebase.

---

After Replit creates the folder structure, I will provide the `api/lead-capture.js` file contents to paste in.
