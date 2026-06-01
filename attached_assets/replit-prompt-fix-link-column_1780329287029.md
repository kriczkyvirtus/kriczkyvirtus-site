# Replit Agent Prompt — Fix Link Column Not Populating in Google Sheets

## Problem
The Link column in Google Sheets is empty for all tools — both the Constraint Roadmap and the other 5 tools.

## Root Cause

### Constraint Roadmap:
The Sheets write (`appendLead`) and roadmap generation run in parallel via `Promise.allSettled`. When `appendLead` executes, the roadmap hasn't been generated yet, so `blobUrl` is empty. 

**Fix:** Generate the roadmap FIRST, then write to Sheets with the URL.

### Other tools (WMBW, BIB, Capital Deep Dives):
The `/api/store-results` function stores the HTML in Blob Storage but doesn't update the Google Sheets Link column afterward.

**Fix:** Add the `updateLinkColumn` logic to `store-results.js`.

---

## Fix 1: Constraint Roadmap — Generate roadmap before writing to Sheets

In `api/lead-capture.js`, change the execution order so roadmap generation completes before the Sheets write. Instead of running them in parallel:

```javascript
// STEP 1: Generate roadmap FIRST (only for Constraint Roadmap)
let roadmapUrl = null;
if (constraintId && revenue && categories) {
  try {
    // ... existing roadmap generation code ...
    // roadmapUrl = blob.url;  (this should already be set by the generation code)
  } catch (renderErr) {
    console.error("[Roadmap] Generation failed:", renderErr);
  }
}

// STEP 2: Write to Google Sheets AFTER roadmap is ready (runs for ALL tools)
try {
  const { appendLead } = require("../lib/sheets");
  await appendLead({
    name,
    email,
    tool: tool || "constraint-roadmap",
    summary: summary || {},
    answers: req.body.answers || {},
    timestamp: timestamp || new Date().toISOString(),
    blobUrl: roadmapUrl || "",  // Now this has the URL for Constraint Roadmap
  });
} catch (sheetsErr) {
  console.error("[Sheets] appendLead failed:", sheetsErr);
}

// STEP 3: Return response
return res.status(200).json({
  success: true,
  roadmapUrl,
});
```

The key change: roadmap generation is `await`ed before `appendLead` runs, so `roadmapUrl` has the actual blob URL by the time it's passed to Sheets.

---

## Fix 2: Other tools — Add updateLinkColumn to store-results.js

In `api/store-results.js`, add the ability to update the Link column in Google Sheets after storing the HTML. Add this code to the file:

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

const TOOL_TO_TAB = {
  "value-range-estimator": "WMBW",
  "business-independence-blueprint": "BIB",
  "structural-capital-deep-dive": "Structural Capital",
  "customer-capital-deep-dive": "Customer Capital",
  "human-capital-deep-dive": "Human Capital",
};

async function updateLinkColumn(email, tool, blobUrl) {
  const sheets = getSheets();
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  const tabName = TOOL_TO_TAB[tool] || tool;

  // Update tool-specific tab
  try {
    const readResult = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `'${tabName}'!A:I`,
    });
    const rows = readResult.data.values || [];
    
    // Find last row matching this email (search bottom-up)
    let targetRow = -1;
    for (let i = rows.length - 1; i >= 1; i--) {
      if (rows[i][2] && rows[i][2].toLowerCase() === email.toLowerCase()) {
        targetRow = i + 1; // Sheets is 1-indexed
        break;
      }
    }

    if (targetRow > 0) {
      // Link is column I (9th column)
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `'${tabName}'!I${targetRow}`,
        valueInputOption: "USER_ENTERED",
        requestBody: { values: [[blobUrl]] },
      });
      console.log(`[Store→Sheets] Updated Link in "${tabName}" row ${targetRow}`);
    } else {
      console.log(`[Store→Sheets] No row found for ${email} in "${tabName}"`);
    }
  } catch (err) {
    console.error(`[Store→Sheets] Failed to update "${tabName}" Link:`, err.message);
  }

  // Update Aggregated tab
  try {
    const aggResult = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "'Aggregated'!A:J",
    });
    const aggRows = aggResult.data.values || [];
    
    let aggTargetRow = -1;
    for (let i = aggRows.length - 1; i >= 1; i--) {
      if (aggRows[i][2] && aggRows[i][2].toLowerCase() === email.toLowerCase()
          && aggRows[i][3] === tabName) {
        aggTargetRow = i + 1;
        break;
      }
    }

    if (aggTargetRow > 0) {
      // Link is column I (9th column) in Aggregated too
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `'Aggregated'!I${aggTargetRow}`,
        valueInputOption: "USER_ENTERED",
        requestBody: { values: [[blobUrl]] },
      });
      console.log(`[Store→Sheets] Updated Link in "Aggregated" row ${aggTargetRow}`);
    }
  } catch (err) {
    console.error(`[Store→Sheets] Failed to update "Aggregated" Link:`, err.message);
  }
}
```

Then at the end of the store-results handler, after the blob is uploaded, call it:

```javascript
// After blob upload succeeds:
console.log(`[Store] ${tool}: ${name} <${email}> — ${Math.round(html.length / 1024)}KB — ${blob.url}`);

// Update Google Sheets Link column (don't block the response)
updateLinkColumn(email, tool, blob.url).catch(err =>
  console.error("[Store→Sheets] updateLinkColumn failed:", err)
);

return res.status(200).json({ success: true, url: blob.url });
```

---

## Fix 3: Three Capital Deep Dive tools not writing to their individual tabs

The Structural Capital, Customer Capital, and Human Capital Deep Dive tools are writing to the Aggregated tab but NOT to their individual tabs. WMBW and BIB work correctly for both tabs.

This is most likely a tool name mismatch. The `TOOL_TO_TAB` mapping in `lib/sheets.js` expects specific tool identifiers, but the client-side code for the 3 Capital tools may be sending a different string.

### Diagnose:
Add a console.log at the top of `appendLead` in `lib/sheets.js` to see exactly what tool name is being received:

```javascript
console.log(`[Sheets] appendLead called with tool="${tool}", mapped tab="${TOOL_TO_TAB[tool] || 'UNMAPPED: ' + tool}"`);
```

### Fix:
Check what tool names the 3 Capital Deep Dive components are sending in their `/api/lead-capture` fetch calls. They need to match these exact strings:

- Structural: `"structural-capital-deep-dive"` → maps to tab `"Structural Capital"`
- Customer: `"customer-capital-deep-dive"` → maps to tab `"Customer Capital"`
- Human: `"human-capital-deep-dive"` → maps to tab `"Human Capital"`

If the client-side code is sending different strings (e.g. `"structural-capital"`, `"structural"`, `"Structural Capital Deep Dive"`, etc.), either:

**Option A (preferred):** Update the `TOOL_TO_TAB` mapping in `lib/sheets.js` to include whatever strings the client is actually sending. Add extra mappings:

```javascript
const TOOL_TO_TAB = {
  "constraint-roadmap": "Constraint Roadmap",
  "value-range-estimator": "WMBW",
  "business-independence-blueprint": "BIB",
  "structural-capital-deep-dive": "Structural Capital",
  "customer-capital-deep-dive": "Customer Capital",
  "human-capital-deep-dive": "Human Capital",
  // Add any alternate names the client might be sending:
  "structural-capital": "Structural Capital",
  "customer-capital": "Customer Capital",
  "human-capital": "Human Capital",
  "structural": "Structural Capital",
  "customer": "Customer Capital",
  "human": "Human Capital",
};
```

**Option B:** Fix the client-side tool names in the 3 Capital Deep Dive components to send the exact strings listed above.

### Also check:
If the tool name maps correctly but the tab still doesn't receive data, the Google Sheets tab names might not match exactly. Verify that the tabs in Google Sheets are named EXACTLY:
- `Structural Capital` (not "Structural Capital Deep Dive" or "Structural")
- `Customer Capital` (not "Customer Capital Deep Dive" or "Customer")
- `Human Capital` (not "Human Capital Deep Dive" or "Human")

Tab names are case-sensitive and space-sensitive in the Sheets API.

---

## Critical Instructions
- For Constraint Roadmap: roadmap generation must complete BEFORE appendLead runs (sequential, not parallel)
- For other tools: updateLinkColumn runs AFTER blob upload, fire-and-forget (don't block the response)
- Do NOT change any frontend code
- Do NOT change scoring logic or result display
- The Link column is column I (9th column) in tool tabs and column I in Aggregated
- For the Constraint Roadmap tab specifically, if it has 10 columns (with Revenue Band), the Link column is column J (10th column) — adjust the range accordingly: `'Constraint Roadmap'!J${targetRow}`
