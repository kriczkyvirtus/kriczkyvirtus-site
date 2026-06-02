# Replit Agent Prompt — Fix Google Sheets Source Column Default

## Problem
When a lead comes in without UTM parameters (no `?utm_source=` in the URL), the Source and Campaign columns in Google Sheets are left blank instead of defaulting to "website".

## Fix
In `lib/sheets.js`, find where the `utmSource` and `utmCampaign` values are used to build the row data. The default fallback isn't working because the values are coming through as `null` or `undefined`.

Find the lines that set the source and campaign variables (something like):
```javascript
const source = utmSource || "website";
const campaign = utmCampaign || "";
```

If these lines don't exist, add them. Then make sure `source` and `campaign` are what gets pushed into the row arrays — NOT `utmSource` and `utmCampaign` directly.

Check every place where the row array is constructed. If it uses `utmSource` directly instead of `source`, change it:

```javascript
// WRONG — utmSource is null when no UTM, so the cell is blank:
toolRow.push(utmSource, utmCampaign);

// CORRECT — defaults to "website" when null:
const source = utmSource || "website";
const campaign = utmCampaign || "";
toolRow.push(source, campaign);
```

Apply this to BOTH the tool-specific tab row AND the Aggregated tab row.

## Critical Instructions
- Only change `lib/sheets.js`
- Do NOT change any other files
- The default Source value when no UTM is present should be `"website"` (lowercase)
- The default Campaign value when no UTM campaign is present should be `""` (empty string)
