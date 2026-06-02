# Replit Agent Prompt — ADD ActiveCampaign to lead-capture.js (NOT OPTIONAL)

## THE PROBLEM
The ActiveCampaign integration is NOT in `api/lead-capture.js`. The Vercel logs show Sheets writes but ZERO `[AC]` entries. The `syncContact` function is never called.

## STEP 1: Verify lib/activecampaign.js exists

Check if the file `lib/activecampaign.js` exists at the repo root. If it does NOT exist, create it with the full code from the previous ActiveCampaign prompt.

Run this in the shell to check:
```bash
ls -la lib/activecampaign.js
```

If it doesn't exist, that's why nothing works — create it first.

## STEP 2: Add TWO lines to api/lead-capture.js

Open `api/lead-capture.js`. 

**Line 1 — Add this import at the VERY TOP of the file, alongside other require statements:**

```javascript
const { syncContact } = require("../lib/activecampaign");
```

**Line 2 — Add this call AFTER the Google Sheets appendLead call.** Find the line that says something like:

```
[Sheets] Wrote to
```
or
```
appendLead(
```

IMMEDIATELY AFTER the Sheets try/catch block, add:

```javascript
// ActiveCampaign — create/update contact + apply tags
try {
  console.log("[AC] About to call syncContact...");
  await syncContact({
    name,
    email,
    tool: tool || "constraint-roadmap",
    summary: summary || {},
    utmSource: req.body.utmSource || null,
    utmCampaign: req.body.utmCampaign || null,
  });
  console.log("[AC] syncContact completed");
} catch (acErr) {
  console.error("[AC] syncContact failed:", acErr.message);
}
```

## STEP 3: Verify by reading the file back

After adding the code, run:
```bash
grep -n "syncContact\|activecampaign\|\[AC\]" api/lead-capture.js
```

This should show at least 3 lines:
- The require/import line
- The `await syncContact(` line  
- The console.log lines

If it shows 0 results, the code was not added. Try again.

## STEP 4: Commit and push

```bash
git add .
git commit -m "add ActiveCampaign syncContact to lead-capture"
git push
```

## DO NOT skip any step. The previous two attempts did not add this code.
