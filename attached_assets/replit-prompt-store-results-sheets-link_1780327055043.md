# Replit Agent Prompt — Connect store-results to Google Sheets (Link Column)

## Problem
When the 5 non-roadmap tools (WMBW, BIB, Structural/Customer/Human Capital) capture a lead, two things happen in sequence:
1. `/api/lead-capture` fires immediately → writes a row to Google Sheets (but no blob URL exists yet, so the Link column is empty)
2. `/api/store-results` fires 2 seconds later → stores the HTML in Blob Storage and gets a URL back (but never writes it to Sheets)

The Link column stays empty for these tools.

## Solution
After `store-results.js` stores the HTML and gets the blob URL, have it find the most recent row in Google Sheets for that email and update the Link column.

## What You Need To Do

### Update `api/store-results.js`

Add the Google Sheets update after the blob upload succeeds. Import the sheets helper and add a function to update the Link column:

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
  try {
    const sheets = getSheets();
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    const tabName = TOOL_TO_TAB[tool] || tool;

    // Read all rows from the tool tab to find the last row with this email
    const readResult = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `'${tabName}'!A:I`,
    });

    const rows = readResult.data.values || [];
    
    // Find the last row where column C (index 2) matches the email
    // Search from bottom up to find the most recent entry
    let targetRowIndex = -1;
    for (let i = rows.length - 1; i >= 1; i--) { // skip header row
      if (rows[i][2] && rows[i][2].toLowerCase() === email.toLowerCase()) {
        targetRowIndex = i;
        break;
      }
    }

    if (targetRowIndex === -1) {
      console.log(`[Store→Sheets] No row found for ${email} in "${tabName}" — skipping link update`);
      return;
    }

    // Update the Link column (column I, index 8, which is the 9th column)
    // Row index in Sheets API is 1-based, and we need to account for the header
    const sheetRow = targetRowIndex + 1; // +1 because Sheets rows are 1-indexed
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `'${tabName}'!I${sheetRow}`,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [[blobUrl]] },
    });

    console.log(`[Store→Sheets] Updated Link column in "${tabName}" row ${sheetRow} for ${email}`);

    // Also update the Aggregated tab
    const aggResult = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "'Aggregated'!A:J",
    });

    const aggRows = aggResult.data.values || [];
    let aggTargetRow = -1;
    for (let i = aggRows.length - 1; i >= 1; i--) {
      if (aggRows[i][2] && aggRows[i][2].toLowerCase() === email.toLowerCase() 
          && aggRows[i][3] === tabName) {
        aggTargetRow = i;
        break;
      }
    }

    if (aggTargetRow !== -1) {
      const aggSheetRow = aggTargetRow + 1;
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `'Aggregated'!I${aggSheetRow}`,
        valueInputOption: "USER_ENTERED",
        requestBody: { values: [[blobUrl]] },
      });
      console.log(`[Store→Sheets] Updated Link column in "Aggregated" row ${aggSheetRow} for ${email}`);
    }

  } catch (err) {
    console.error(`[Store→Sheets] Failed to update Link:`, err.message);
  }
}
```

Then at the end of the existing `store-results.js` handler, after the blob is uploaded successfully, add:

```javascript
// Update Google Sheets with the blob URL
updateLinkColumn(email, tool, blob.url).catch(err => 
  console.error("[Store→Sheets] updateLinkColumn failed:", err)
);
```

Make sure `email` and `tool` are available in the handler — they should already be in `req.body`.

### Full updated handler structure

The handler in `store-results.js` should now look like:

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

    const raw = `${email}-${tool}-${Date.now()}`;
    const id = crypto.createHash("sha256").update(raw).digest("hex").slice(0, 12);
    const nameSlug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    const blob = await put(`results/${tool}/${nameSlug}-${id}.html`, html, {
      access: "public",
      contentType: "text/html; charset=utf-8",
      addRandomSuffix: false,
    });

    console.log(`[Store] ${tool}: ${name} <${email}> — ${Math.round(html.length / 1024)}KB — ${blob.url}`);

    // Update Google Sheets Link column (fire and forget — don't block response)
    updateLinkColumn(email, tool, blob.url).catch(err =>
      console.error("[Store→Sheets] updateLinkColumn failed:", err)
    );

    return res.status(200).json({ success: true, url: blob.url });

  } catch (err) {
    console.error("[Store] Failed:", err);
    return res.status(500).json({ error: "Storage failed" });
  }
};
```

## Critical Instructions
- Do NOT modify `api/lead-capture.js` — the Constraint Roadmap link is already handled there.
- Do NOT modify any frontend code.
- The Sheets update in `store-results.js` is fire-and-forget — do NOT await it before returning the response to the client.
- The Link column is column I (9th column) in the tool-specific tabs and column I (9th column) in the Aggregated tab.
- The search finds the LAST (most recent) row matching the email, so if someone takes the same tool twice, it updates the most recent entry.
