# Replit Agent Prompt — Fix ActiveCampaign + UTM Not Working

## Three issues to fix:

### Issue 1: ActiveCampaign syncContact not being called

The Vercel logs show `[Lead]` and `[Sheets]` entries but ZERO `[AC]` entries. This means the `syncContact` call in `api/lead-capture.js` is either missing or not being reached.

**Check `api/lead-capture.js` and verify:**

1. The import exists at the top of the file:
```javascript
const { syncContact } = require("../lib/activecampaign");
```

2. The `syncContact` call exists and is NOT inside any conditional block. It must run for ALL tools. Find where the Google Sheets `appendLead` call is and add the ActiveCampaign call right after it:

```javascript
// Google Sheets (existing — should already be here)
try {
  await appendLead({ ... });
} catch (sheetsErr) {
  console.error("[Sheets] appendLead failed:", sheetsErr);
}

// ActiveCampaign — ADD THIS right after Sheets
try {
  await syncContact({
    name,
    email,
    tool: tool || "constraint-roadmap",
    summary: summary || {},
    utmSource: req.body.utmSource || null,
    utmCampaign: req.body.utmCampaign || null,
  });
} catch (acErr) {
  console.error("[AC] syncContact failed:", acErr.message);
}
```

3. Verify `lib/activecampaign.js` exists at the repo root with the full `syncContact` function

### Issue 2: Tool name mapping mismatch

The client is sending `tool: "wmbw"` but the `TOOL_TAGS` mapping in `lib/activecampaign.js` expects `"value-range-estimator"`. This means the tool tag won't match.

Update the `TOOL_TAGS` mapping in `lib/activecampaign.js` to include BOTH the expected names AND whatever the client is actually sending:

```javascript
const TOOL_TAGS = {
  "constraint-roadmap": "Tool: Constraint Roadmap",
  "value-range-estimator": "Tool: WMBW",
  "wmbw": "Tool: WMBW",
  "business-independence-blueprint": "Tool: BIB",
  "bib": "Tool: BIB",
  "structural-capital-deep-dive": "Tool: Structural Capital",
  "structural-capital": "Tool: Structural Capital",
  "structural": "Tool: Structural Capital",
  "customer-capital-deep-dive": "Tool: Customer Capital",
  "customer-capital": "Tool: Customer Capital",
  "customer": "Tool: Customer Capital",
  "human-capital-deep-dive": "Tool: Human Capital",
  "human-capital": "Tool: Human Capital",
  "human": "Tool: Human Capital",
};
```

Also do the same for the `TOOL_TO_TAB` mapping in `lib/sheets.js` if it doesn't already have these aliases — the Sheets integration had this same issue earlier.

### Issue 3: Client not sending UTM parameters

The Vercel logs show the payload has no `utmSource` or `utmCampaign` fields. The client-side components need to read these from the URL and include them in the API payload.

**For EACH of the 7 components** (Constraint Roadmap assessment + 6 diagnostic tools):

**A) Add state variables at the top of the component:**
```javascript
const [utmSource, setUtmSource] = useState(null);
const [utmCampaign, setUtmCampaign] = useState(null);
```

**B) Add a useEffect to read UTM params on page load:**
```javascript
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const source = params.get("utm_source");
  const campaign = params.get("utm_campaign");
  if (source) setUtmSource(source);
  if (campaign) setUtmCampaign(campaign);
}, []);
```

**C) Include them in the lead-capture API payload.** Find where `fetch("/api/lead-capture", ...)` is called and add the fields to the body:
```javascript
body: JSON.stringify({
  name: name.trim(),
  email: email.trim(),
  tool: "...",
  summary: { ... },
  utmSource: utmSource || null,      // ADD THIS
  utmCampaign: utmCampaign || null,  // ADD THIS
  timestamp: new Date().toISOString(),
}),
```

**The 7 components to update:**
1. Constraint Roadmap assessment component
2. WMBW component
3. BIB component
4. Structural Capital component
5. Customer Capital component
6. Human Capital component
7. Any other tool component that calls `/api/lead-capture`

### Issue 4: Pass UTM data to Google Sheets

In `api/lead-capture.js`, pass the UTM data to `appendLead`:

```javascript
await appendLead({
  name,
  email,
  tool: tool || "constraint-roadmap",
  summary: summary || {},
  answers: req.body.answers || {},
  timestamp: timestamp || new Date().toISOString(),
  blobUrl: roadmapUrl || "",
  utmSource: req.body.utmSource || null,
  utmCampaign: req.body.utmCampaign || null,
});
```

In `lib/sheets.js`, update `appendLead` to accept and use these:

```javascript
async function appendLead({ name, email, tool, summary, answers, timestamp, blobUrl, utmSource, utmCampaign }) {
  // ... existing code ...
  
  const source = utmSource || "website";
  const campaign = utmCampaign || "";
  
  // Add source and campaign to the END of each row array:
  // Tool-specific row:
  toolRow.push(source, campaign);
  
  // Aggregated row:
  aggregatedRow.push(source, campaign);
  
  // Update the ranges to include the new columns
  // If tool tab was A:I, it's now A:K (2 more columns)
  // If Constraint Roadmap tab was A:J, it's now A:L (2 more columns)
  // If Aggregated was A:J, it's now A:L (2 more columns)
}
```

**Important:** The Source and Campaign columns were just added to the Google Sheet by Edward. Make sure the range in the `append` call covers these new columns. Count the total columns for each tab and use the correct letter range.

## Testing

After deploying:
1. Visit `kriczkyvirtus.com/tools/wmbw?utm_source=linkedin&utm_campaign=test-run`
2. Complete the tool, enter name + email
3. Check Vercel Logs — should see `[AC] Contact synced` and `[AC] Tagged` entries
4. Check ActiveCampaign → Contacts — should see tags: `Website Lead`, `Tool: WMBW`, `Source: LinkedIn`, `Campaign: Test Run`
5. Check Google Sheets — Source column should show "linkedin", Campaign column should show "test-run"

## Critical Instructions
- The `syncContact` call MUST be outside any conditional block — it runs for every tool
- The tool name mapping must handle whatever the client actually sends (check each component's `tool` field)
- UTM capture useEffect must be in ALL 7 components
- If ActiveCampaign fails, it must NOT block the response — always wrap in try/catch
- Do NOT change any scoring logic, UI, or other integrations
