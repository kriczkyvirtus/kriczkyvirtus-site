# Replit Agent Prompt — Wire Lead Capture to Google Sheets

## Overview
When a lead submits their name and email on any diagnostic tool, the data should be written to Google Sheets in addition to the existing Vercel Logs and Blob Storage. Each tool has its own tab, and every lead also gets written to the Aggregated tab.

## Step 1: Install the Google APIs package

Run from the repo root:
```bash
pnpm add googleapis -w
```

## Step 2: Create a shared Google Sheets helper

Create a new file at the repo root: `lib/sheets.js`

```javascript
const { google } = require("googleapis");

let sheetsClient = null;

function getSheets() {
  if (sheetsClient) return sheetsClient;

  const credentials = JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS);

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  sheetsClient = google.sheets({ version: "v4", auth });
  return sheetsClient;
}

// Map tool identifiers to spreadsheet tab names
const TOOL_TO_TAB = {
  "constraint-roadmap": "Constraint Roadmap",
  "value-range-estimator": "WMBW",
  "business-independence-blueprint": "BIB",
  "structural-capital-deep-dive": "Structural Capital",
  "customer-capital-deep-dive": "Customer Capital",
  "human-capital-deep-dive": "Human Capital",
};

/**
 * Append a lead row to Google Sheets.
 * Writes to both the tool-specific tab and the Aggregated tab.
 *
 * @param {Object} params
 * @param {string} params.name
 * @param {string} params.email
 * @param {string} params.tool - tool identifier (e.g. "constraint-roadmap")
 * @param {Object} params.summary - scores/results object
 * @param {Object} params.answers - individual question answers
 * @param {string} params.timestamp
 */
async function appendLead({ name, email, tool, summary, answers, timestamp }) {
  const sheets = getSheets();
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  const tabName = TOOL_TO_TAB[tool] || tool;

  // Compute percentage and band if available
  let percentage = "";
  let band = "";
  if (summary?.totalScore != null) {
    percentage = summary.totalScore;
    if (percentage >= 70) band = "Green Zone";
    else if (percentage >= 50) band = "Market";
    else if (percentage >= 30) band = "Discount";
    else band = "Not Sellable";
  }

  // Build the row data matching column headers:
  // Timestamp | Name | Email | Tool | Scores/Summary | Answers | Percentage | Band | Full Scores
  const row = [
    timestamp || new Date().toISOString(),
    name || "",
    email || "",
    tabName,
    JSON.stringify(summary || {}),
    JSON.stringify(answers || {}),
    percentage,
    band,
    summary?.categories ? JSON.stringify(summary.categories) : "",
  ];

  // Row for the Aggregated tab (same columns + "Tools Completed" at the end)
  const aggregatedRow = [...row, tabName];

  try {
    // Write to tool-specific tab
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `'${tabName}'!A:I`,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: [row] },
    });
    console.log(`[Sheets] Wrote to "${tabName}" tab for ${name} <${email}>`);
  } catch (err) {
    console.error(`[Sheets] Failed to write to "${tabName}":`, err.message);
  }

  try {
    // Write to Aggregated tab
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "'Aggregated'!A:J",
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: [aggregatedRow] },
    });
    console.log(`[Sheets] Wrote to "Aggregated" tab for ${name} <${email}>`);
  } catch (err) {
    console.error(`[Sheets] Failed to write to "Aggregated":`, err.message);
  }
}

module.exports = { appendLead };
```

## Step 3: Update `api/lead-capture.js` to call the Sheets helper

In `api/lead-capture.js`, add the Google Sheets integration alongside the existing roadmap generation.

At the top of the file (or inside the handler), add the import:

```javascript
const { appendLead } = require("../lib/sheets");
```

Then find the section where the parallel jobs run (roadmap generation, and the TODO comments for Google Sheets). Replace the Google Sheets TODO/stub with an actual call:

```javascript
// Google Sheets — append lead row
appendLead({
  name,
  email,
  tool: tool || "constraint-roadmap",
  summary: summary || {},
  answers: req.body.answers || {},
  timestamp: timestamp || new Date().toISOString(),
}).catch(err => console.error("[Sheets] appendLead failed:", err));
```

**Important:** Do NOT `await` this call if it would block returning the response to the user. The Sheets write can happen in the background. However, if the function already uses `Promise.allSettled` for parallel operations, include it there:

```javascript
const [roadmapResult, sheetsResult] = await Promise.allSettled([
  // Roadmap generation (existing code)
  constraintId && revenue && categories
    ? generateOrRenderRoadmap(...)
    : Promise.resolve(null),
  
  // Google Sheets
  appendLead({
    name,
    email,
    tool: tool || "constraint-roadmap",
    summary: summary || {},
    answers: req.body.answers || {},
    timestamp: timestamp || new Date().toISOString(),
  }),
]);
```

## Step 4: Also update `api/store-results.js` (if it handles separate tools)

If the 5 non-roadmap tools call `/api/store-results` instead of `/api/lead-capture`, add the Sheets integration there too using the same pattern. Otherwise, if all tools go through `/api/lead-capture`, this step is not needed.

## Step 5: Verify environment variables are set

The following environment variables must be set in Vercel (Settings → Environment Variables):
- `GOOGLE_SHEETS_CREDENTIALS` — the full JSON contents of the service account key file
- `GOOGLE_SHEETS_SPREADSHEET_ID` — the spreadsheet ID from the Google Sheets URL

These should already be set per the user's confirmation.

## Step 6: Handle the `googleapis` package in pnpm

Since this is a monorepo with pnpm, the `googleapis` package needs to be accessible to the serverless function. Since `shamefully-hoist=true` is already in `.npmrc`, this should work. But if the serverless function can't find `googleapis`, also add it directly:

```bash
pnpm add googleapis -w
```

## Testing

After deploying:
1. Go through any diagnostic tool on the live site
2. Enter name and email
3. Check the Google Sheet — a new row should appear in both the tool-specific tab and the Aggregated tab
4. Check Vercel Logs — you should see `[Sheets] Wrote to "..." tab for ...` messages

## Critical Instructions
- Do NOT modify any frontend code — this is purely a serverless function change.
- Do NOT change the roadmap generation logic.
- The Sheets write should NEVER block or delay the user's experience. If Sheets fails, the user still sees their results.
- The `GOOGLE_SHEETS_CREDENTIALS` environment variable contains the full JSON service account key — parse it with `JSON.parse()`.
- Tab names in the Sheets API must be wrapped in single quotes if they contain spaces: `'Constraint Roadmap'!A:I`
