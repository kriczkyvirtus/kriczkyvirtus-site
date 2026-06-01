# Replit Agent Prompt — Fix Unreliable Link Column Updates in Google Sheets

## Problem
The Link column in Google Sheets populates intermittently — sometimes it works, sometimes it doesn't. Different tabs fail on different runs. This affects both the individual tool tabs and the Aggregated tab.

## Root Cause
Two issues:

1. **Fire-and-forget kills the function early.** In `api/store-results.js`, `updateLinkColumn` is called without `await` — the function returns the response and the serverless container shuts down before the Sheets update completes. Sometimes it finishes in time, sometimes it doesn't.

2. **Column index may be wrong for some tabs.** Different tabs have different numbers of columns:
   - **Constraint Roadmap tab:** 10 columns (has Revenue Band) → Link = column **J**
   - **WMBW, BIB, Structural Capital, Customer Capital, Human Capital tabs:** 9 columns → Link = column **I**
   - **Aggregated tab:** 10 columns (has Tools Completed) → Link = column **I**

## Fix

### Change 1: AWAIT the Sheets update in store-results.js

In `api/store-results.js`, change `updateLinkColumn` from fire-and-forget to awaited. The client-side HTML capture is a background operation anyway — the user never waits for this response. Adding a few hundred ms to await the Sheets update is fine.

Find:
```javascript
// Don't block the response
updateLinkColumn(email, tool, blob.url).catch(err =>
  console.error("[Store→Sheets] updateLinkColumn failed:", err)
);

return res.status(200).json({ success: true, url: blob.url });
```

Replace with:
```javascript
// Await the Sheets update before returning — this ensures the serverless function
// stays alive until the update completes
try {
  await updateLinkColumn(email, tool, blob.url);
} catch (err) {
  console.error("[Store→Sheets] updateLinkColumn failed:", err);
}

return res.status(200).json({ success: true, url: blob.url });
```

### Change 2: Fix column indices in updateLinkColumn

Replace the entire `updateLinkColumn` function in `api/store-results.js` with this version that uses the correct column for each tab:

```javascript
async function updateLinkColumn(email, tool, blobUrl) {
  const sheets = getSheets();
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  const tabName = TOOL_TO_TAB[tool] || tool;

  // Column index for the Link column varies by tab
  // Constraint Roadmap has 10 cols (A-J): Link = J
  // Other tools have 9 cols (A-I): Link = I
  // Aggregated has 10 cols (A-J): Link = I (Tools Completed is J)
  const linkCol = "I"; // All non-Constraint-Roadmap tool tabs use column I
  // Note: Constraint Roadmap links are handled in lead-capture.js, not here

  // ─── Update tool-specific tab ───
  try {
    const readResult = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `'${tabName}'!A:${linkCol}`,
    });
    const rows = readResult.data.values || [];

    // Find last row matching this email (bottom-up search)
    let targetRow = -1;
    for (let i = rows.length - 1; i >= 1; i--) {
      if (rows[i] && rows[i][2] && rows[i][2].toLowerCase() === email.toLowerCase()) {
        targetRow = i + 1; // Sheets is 1-indexed
        break;
      }
    }

    if (targetRow > 0) {
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `'${tabName}'!${linkCol}${targetRow}`,
        valueInputOption: "USER_ENTERED",
        requestBody: { values: [[blobUrl]] },
      });
      console.log(`[Store→Sheets] Updated Link in "${tabName}" row ${targetRow} → ${blobUrl}`);
    } else {
      console.warn(`[Store→Sheets] No row found for ${email} in "${tabName}" — retrying in 3s`);
      // Retry once after a delay in case the row hasn't been written yet
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const retryResult = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `'${tabName}'!A:${linkCol}`,
      });
      const retryRows = retryResult.data.values || [];
      let retryTargetRow = -1;
      for (let i = retryRows.length - 1; i >= 1; i--) {
        if (retryRows[i] && retryRows[i][2] && retryRows[i][2].toLowerCase() === email.toLowerCase()) {
          retryTargetRow = i + 1;
          break;
        }
      }
      if (retryTargetRow > 0) {
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: `'${tabName}'!${linkCol}${retryTargetRow}`,
          valueInputOption: "USER_ENTERED",
          requestBody: { values: [[blobUrl]] },
        });
        console.log(`[Store→Sheets] Retry succeeded: Updated Link in "${tabName}" row ${retryTargetRow}`);
      } else {
        console.error(`[Store→Sheets] Retry failed: Still no row for ${email} in "${tabName}"`);
      }
    }
  } catch (err) {
    console.error(`[Store→Sheets] Failed to update "${tabName}" Link:`, err.message);
  }

  // ─── Update Aggregated tab ───
  try {
    const aggLinkCol = "I"; // Aggregated: Link is column I, Tools Completed is column J
    
    const aggResult = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `'Aggregated'!A:J`,
    });
    const aggRows = aggResult.data.values || [];

    // Find last row matching this email AND this tool
    let aggTargetRow = -1;
    for (let i = aggRows.length - 1; i >= 1; i--) {
      if (aggRows[i] && aggRows[i][2] && aggRows[i][2].toLowerCase() === email.toLowerCase()
          && aggRows[i][3] === tabName) {
        aggTargetRow = i + 1;
        break;
      }
    }

    if (aggTargetRow > 0) {
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `'Aggregated'!${aggLinkCol}${aggTargetRow}`,
        valueInputOption: "USER_ENTERED",
        requestBody: { values: [[blobUrl]] },
      });
      console.log(`[Store→Sheets] Updated Link in "Aggregated" row ${aggTargetRow}`);
    } else {
      console.warn(`[Store→Sheets] No row found for ${email}/${tabName} in "Aggregated" — retrying in 3s`);
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const retryAgg = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `'Aggregated'!A:J`,
      });
      const retryAggRows = retryAgg.data.values || [];
      let retryAggTarget = -1;
      for (let i = retryAggRows.length - 1; i >= 1; i--) {
        if (retryAggRows[i] && retryAggRows[i][2] && retryAggRows[i][2].toLowerCase() === email.toLowerCase()
            && retryAggRows[i][3] === tabName) {
          retryAggTarget = i + 1;
          break;
        }
      }
      if (retryAggTarget > 0) {
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: `'Aggregated'!${aggLinkCol}${retryAggTarget}`,
          valueInputOption: "USER_ENTERED",
          requestBody: { values: [[blobUrl]] },
        });
        console.log(`[Store→Sheets] Retry succeeded: Updated Link in "Aggregated" row ${retryAggTarget}`);
      } else {
        console.error(`[Store→Sheets] Retry failed: Still no row for ${email}/${tabName} in "Aggregated"`);
      }
    }
  } catch (err) {
    console.error(`[Store→Sheets] Failed to update "Aggregated" Link:`, err.message);
  }
}
```

### Change 3: Also verify lead-capture.js for Constraint Roadmap links

In `api/lead-capture.js`, verify that when the Constraint Roadmap generates a roadmap, the `blobUrl` passed to `appendLead` is the actual URL (not empty). The roadmap generation must complete BEFORE appendLead is called.

Also verify that in `lib/sheets.js`, the `appendLead` function writes the link to column **J** (not I) for the Constraint Roadmap tab, since it has 10 columns:

```javascript
if (tool === "constraint-roadmap") {
  // 10 columns: Timestamp, Name, Email, Tool, Revenue Band, Scores/Summary, Answers, Percentage, Band, Link
  toolRow = [estTimestamp, name, email, tabName, revenueBand, summaryStr, answersStr, percentage, band, link];
  toolRange = `'${tabName}'!A:J`;
} else {
  // 9 columns: Timestamp, Name, Email, Tool, Scores/Summary, Answers, Percentage, Band, Link
  toolRow = [estTimestamp, name, email, tabName, summaryStr, answersStr, percentage, band, link];
  toolRange = `'${tabName}'!A:I`;
}
```

## Summary of column positions:

| Tab | # Columns | Link Column |
|-----|-----------|-------------|
| Constraint Roadmap | 10 (has Revenue Band) | J |
| WMBW | 9 | I |
| BIB | 9 | I |
| Structural Capital | 9 | I |
| Customer Capital | 9 | I |
| Human Capital | 9 | I |
| Aggregated | 10 (has Tools Completed) | I |

## Critical Instructions
- The `updateLinkColumn` call in `store-results.js` MUST be awaited, not fire-and-forget
- The retry logic adds a 3-second delay then tries once more — this handles the race condition where store-results runs before lead-capture has finished writing the row
- Do NOT change any frontend code
- Do NOT change the Constraint Roadmap lead-capture flow — it handles its own link in appendLead
- Test ALL 6 tools after deploying and verify links appear in every tab including Aggregated
