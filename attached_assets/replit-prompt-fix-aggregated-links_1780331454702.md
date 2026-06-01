# Replit Agent Prompt — Fix WMBW and BIB Links Not Updating on Aggregated Tab

## Problem
WMBW and BIB links populate correctly on their individual tabs, but NOT on the Aggregated tab. All other tools work on both.

## Root Cause
The `updateLinkColumn` function in `api/store-results.js` searches the Aggregated tab by matching both email AND tool name:
```javascript
aggRows[i][2].toLowerCase() === email.toLowerCase() && aggRows[i][3] === tabName
```

The `tabName` variable comes from a local `TOOL_TO_TAB` mapping in `store-results.js`. But the Tool column value in the Aggregated tab was written by `appendLead` in `lib/sheets.js`, which has its own copy of the mapping. If these two mappings produce even slightly different values for WMBW or BIB, the match fails.

## Fix

In `api/store-results.js`, update the Aggregated tab search to be more resilient. Instead of requiring an exact tool name match, search for the most recent row matching the email where the Link column (column I) is empty:

Find the Aggregated tab search loop in `updateLinkColumn`:

```javascript
// Old approach — exact match on email AND tool name
if (aggRows[i][2] && aggRows[i][2].toLowerCase() === email.toLowerCase()
    && aggRows[i][3] === tabName) {
```

Replace with:

```javascript
// New approach — match email AND check that the Link column is empty
// This handles any tool name mapping inconsistencies
if (aggRows[i] 
    && aggRows[i][2] 
    && aggRows[i][2].toLowerCase() === email.toLowerCase()
    && (!aggRows[i][8] || aggRows[i][8].trim() === "")) {
```

Column index 8 is column I (the Link column in the Aggregated tab, 0-indexed).

Apply the same change to the retry block's search loop as well.

Also add a diagnostic log so we can verify what's happening:

```javascript
console.log(`[Store→Sheets] Searching Aggregated for email="${email}", tabName="${tabName}"`);
console.log(`[Store→Sheets] Aggregated has ${aggRows.length} rows`);
```

## Critical Instructions
- Only change the Aggregated tab search logic in `api/store-results.js`
- Do NOT change the individual tool tab search (those already work)
- Do NOT change `lib/sheets.js`
- Do NOT change any frontend code
- The individual tab search should still match on email only (as it currently does)
- Test by running WMBW and BIB, then verify links appear in both their individual tabs AND the Aggregated tab
