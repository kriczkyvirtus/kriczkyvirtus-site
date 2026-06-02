# Replit Agent Prompt — ActiveCampaign Integration for Lead Capture

## Overview
When a lead submits their name and email on any diagnostic tool, automatically create or update a contact in ActiveCampaign with relevant tags. This runs alongside the existing Google Sheets and Resend integrations in `/api/lead-capture.js`.

## Step 1: Create the ActiveCampaign helper

Create a new file at the repo root: `lib/activecampaign.js`

```javascript
const AC_API_URL = process.env.ACTIVECAMPAIGN_API_URL;
const AC_API_KEY = process.env.ACTIVECAMPAIGN_API_KEY;

async function acFetch(endpoint, method = "GET", body = null) {
  const url = `${AC_API_URL}/api/3/${endpoint}`;
  const options = {
    method,
    headers: {
      "Api-Token": AC_API_KEY,
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
  };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(url, options);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`AC API ${method} ${endpoint} failed: ${res.status} — ${text}`);
  }
  return res.json();
}

// Map tool identifiers to tag names
const TOOL_TAGS = {
  "constraint-roadmap": "Tool: Constraint Roadmap",
  "value-range-estimator": "Tool: WMBW",
  "business-independence-blueprint": "Tool: BIB",
  "structural-capital-deep-dive": "Tool: Structural Capital",
  "customer-capital-deep-dive": "Tool: Customer Capital",
  "human-capital-deep-dive": "Tool: Human Capital",
};

const CONSTRAINT_TAGS = {
  "profitability": "Constraint: Profitability",
  "cash_flow": "Constraint: Cash Flow",
  "revenue_quality": "Constraint: Revenue Quality",
  "owner_dependency": "Constraint: Owner Dependency",
  "operational_efficiency": "Constraint: Operational Efficiency",
  "scalability": "Constraint: Scalability",
};

const TIER_TAGS = {
  "under_500k": "Tier: Under $500K",
  "500k_1m": "Tier: $500K-$1M",
  "1m_3m": "Tier: $1M-$3M",
  "3m_10m": "Tier: $3M-$10M",
};

const SOURCE_TAGS = {
  "instagram": "Source: Instagram",
  "linkedin": "Source: LinkedIn",
  "youtube": "Source: YouTube",
  "email": "Source: Email",
  "referral": "Source: Referral",
  "google-ads": "Source: Google Ads",
  "event": "Source: Event",
  "skool": "Source: Skool",
};

/**
 * Convert a UTM value to a readable tag name.
 * "build-with-valor" → "Build With Valor"
 * "score-conference-2026" → "Score Conference 2026"
 */
function formatUtmValue(value) {
  return value
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Find or create a tag by name. Returns the tag ID.
 */
async function getOrCreateTag(tagName) {
  // Search for existing tag
  const searchResult = await acFetch(`tags?search=${encodeURIComponent(tagName)}`);
  const existing = searchResult.tags?.find(t => t.tag === tagName);
  if (existing) return existing.id;

  // Create new tag
  const createResult = await acFetch("tags", "POST", {
    tag: { tag: tagName, tagType: "contact", description: `Auto-created by website lead capture` },
  });
  console.log(`[AC] Created tag: "${tagName}" (id: ${createResult.tag.id})`);
  return createResult.tag.id;
}

/**
 * Add a tag to a contact.
 */
async function addTagToContact(contactId, tagId) {
  await acFetch("contactTags", "POST", {
    contactTag: { contact: contactId, tag: tagId },
  });
}

/**
 * Create or update a contact in ActiveCampaign and apply tags.
 *
 * @param {Object} params
 * @param {string} params.name
 * @param {string} params.email
 * @param {string} params.tool - tool identifier
 * @param {Object} params.summary - scores/results (optional)
 * @param {string|null} params.utmSource - UTM source parameter (optional)
 * @param {string|null} params.utmCampaign - UTM campaign parameter (optional)
 */
async function syncContact({ name, email, tool, summary, utmSource, utmCampaign }) {
  if (!AC_API_URL || !AC_API_KEY) {
    console.log("[AC] Skipping — API credentials not configured");
    return;
  }

  const firstName = name.split(" ")[0] || name;
  const lastName = name.split(" ").slice(1).join(" ") || "";

  // 1. Create or update the contact
  const contactResult = await acFetch("contact/sync", "POST", {
    contact: {
      email: email.toLowerCase(),
      firstName,
      lastName,
    },
  });

  const contactId = contactResult.contact.id;
  console.log(`[AC] Contact synced: ${email} (id: ${contactId})`);

  // 2. Build the list of tags to apply
  const tagNames = ["Website Lead"];

  // Tool tag
  const toolTag = TOOL_TAGS[tool];
  if (toolTag) tagNames.push(toolTag);

  // Constraint tag (Constraint Roadmap only)
  const constraintId = summary?.constraintId;
  if (constraintId && CONSTRAINT_TAGS[constraintId]) {
    tagNames.push(CONSTRAINT_TAGS[constraintId]);
  }

  // Revenue tier tag (Constraint Roadmap only)
  const revenue = summary?.revenue;
  if (revenue && TIER_TAGS[revenue]) {
    tagNames.push(TIER_TAGS[revenue]);
  }

  // Source tag — auto-creates for ANY utm_source value, not just predefined ones
  if (utmSource) {
    const sourceKey = utmSource.toLowerCase();
    const sourceTag = SOURCE_TAGS[sourceKey] || `Source: ${formatUtmValue(sourceKey)}`;
    tagNames.push(sourceTag);
  } else {
    tagNames.push("Source: Website");  // Default when no UTM
  }

  // Campaign tag — auto-creates for ANY utm_campaign value
  if (utmCampaign) {
    const campaignTag = `Campaign: ${formatUtmValue(utmCampaign)}`;
    tagNames.push(campaignTag);
  }

  // 3. Apply all tags
  for (const tagName of tagNames) {
    try {
      const tagId = await getOrCreateTag(tagName);
      await addTagToContact(contactId, tagId);
      console.log(`[AC] Tagged ${email}: "${tagName}"`);
    } catch (tagErr) {
      console.error(`[AC] Failed to apply tag "${tagName}" to ${email}:`, tagErr.message);
    }
  }

  console.log(`[AC] Done: ${email} — ${tagNames.length} tags applied`);
}

module.exports = { syncContact };
```

## Step 2: Wire into lead-capture.js

In `api/lead-capture.js`, add the ActiveCampaign call alongside the existing Google Sheets and Resend calls.

Add the import:
```javascript
const { syncContact } = require("../lib/activecampaign");
```

Then add the ActiveCampaign sync. It should run for ALL tools (same as Google Sheets). Add it after the Sheets write and before the response is returned:

```javascript
// ActiveCampaign — create/update contact + apply tags
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

## Step 3: Capture UTM parameters on the client side

Each diagnostic tool component and the Constraint Roadmap assessment need to read UTM parameters from the URL when the page loads and include them in the lead-capture payload.

### In EVERY tool component and the assessment component:

Add state variables and useEffect to capture UTM parameters on mount:

```javascript
const [utmSource, setUtmSource] = useState(null);
const [utmCampaign, setUtmCampaign] = useState(null);

useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const source = params.get("utm_source");
  const campaign = params.get("utm_campaign");
  if (source) setUtmSource(source);
  if (campaign) setUtmCampaign(campaign);
}, []);
```

Then in the email submission handler, include both in the API payload:

```javascript
// Add to the existing payload sent to /api/lead-capture:
const payload = {
  name: name.trim(),
  email: email.trim(),
  tool: "TOOL_NAME",
  summary: { /* existing scores */ },
  utmSource: utmSource || null,      // ADD THIS
  utmCampaign: utmCampaign || null,  // ADD THIS
  timestamp: new Date().toISOString(),
};
```

Apply this to ALL 6 tool components plus the Constraint Roadmap assessment (7 components total).

## Step 4: Also capture UTM source in Google Sheets

In `lib/sheets.js`, update the `appendLead` function to accept and log the UTM source. Add a "Source" column to the data being written.

**Manual step for Edward:** In the Google Sheet, add "Source" and "Campaign" columns to each tab (after the existing columns). The Aggregated tab should also get these columns.

In the `appendLead` function, add `utmSource` and `utmCampaign` to the parameter list and include them in each row:

```javascript
async function appendLead({ name, email, tool, summary, answers, timestamp, blobUrl, utmSource, utmCampaign }) {
  // ... existing code ...
  
  const source = utmSource || "website";
  const campaign = utmCampaign || "";
  
  // Add source and campaign to the end of each row array
  // For tool-specific tabs and Aggregated tab
}
```

**Important:** This should be `await`ed so the serverless function stays alive until it completes, but if it fails, it should NOT prevent the response from being sent. Wrap it in try/catch as shown above.

### Recommended execution order in lead-capture.js:

```javascript
// 1. Roadmap generation (Constraint Roadmap only) — AWAIT
// 2. Google Sheets write — AWAIT
// 3. ActiveCampaign sync — AWAIT (new)
// 4. Resend email — AWAIT
// 5. Return response
```

All four steps are awaited sequentially. If any step fails, it's caught and logged but doesn't block subsequent steps or the response.

## Step 3: Verify environment variables

These must be set in Vercel (Settings → Environment Variables):
- `ACTIVECAMPAIGN_API_URL` — Your account URL (e.g. `https://kriczkyvirtus.api-us1.com`)
- `ACTIVECAMPAIGN_API_KEY` — Your API key

The helper checks for these and skips gracefully if they're not set.

## Tags That Will Be Auto-Created

The first time each tag is needed, the code creates it in ActiveCampaign automatically. No manual tag setup required. Here are all possible tags:

**Applied to every lead:**
- `Website Lead`

**Source tags (one per lead, based on UTM parameter in the URL):**
- `Source: Website` (default — no UTM parameter present)
- `Source: Instagram` (link had `?utm_source=instagram`)
- `Source: LinkedIn` (link had `?utm_source=linkedin`)
- `Source: YouTube` (link had `?utm_source=youtube`)
- `Source: Email` (link had `?utm_source=email`)
- `Source: Referral` (link had `?utm_source=referral`)
- `Source: Google Ads` (link had `?utm_source=google-ads`)
- `Source: Event` (link had `?utm_source=event`)
- `Source: Skool` (link had `?utm_source=skool`)
- Any new `utm_source` value auto-creates a `Source: [Value]` tag — no code change needed

**Campaign tags (optional, based on utm_campaign parameter):**
- `Campaign: Build With Valor` (link had `&utm_campaign=build-with-valor`)
- `Campaign: Score Conference 2026` (link had `&utm_campaign=score-conference-2026`)
- Any `utm_campaign` value auto-creates a `Campaign: [Value]` tag — no code change needed

**Tool tags (one per lead, based on which tool they completed):**
- `Tool: Constraint Roadmap`
- `Tool: WMBW`
- `Tool: BIB`
- `Tool: Structural Capital`
- `Tool: Customer Capital`
- `Tool: Human Capital`

**Constraint tags (Constraint Roadmap only):**
- `Constraint: Profitability`
- `Constraint: Cash Flow`
- `Constraint: Revenue Quality`
- `Constraint: Owner Dependency`
- `Constraint: Operational Efficiency`
- `Constraint: Scalability`

**Revenue tier tags (Constraint Roadmap only):**
- `Tier: Under $500K`
- `Tier: $500K-$1M`
- `Tier: $1M-$3M`
- `Tier: $3M-$10M`

**If someone takes multiple tools,** they accumulate multiple tool tags on the same contact. ActiveCampaign's automation builder can trigger on tag count for high-engagement detection.

### Example UTM Links (for Edward's reference)

Here are ready-to-use links for each channel. Replace `/tools` with any page path. Add `&utm_campaign=xxx` for specific communities or events:

**Instagram:**
```
https://www.kriczkyvirtus.com/tools?utm_source=instagram
https://www.kriczkyvirtus.com/tools/wmbw?utm_source=instagram
```

**LinkedIn:**
```
https://www.kriczkyvirtus.com/tools?utm_source=linkedin
https://www.kriczkyvirtus.com/tools/wmbw?utm_source=linkedin
```

**YouTube:**
```
https://www.kriczkyvirtus.com/tools?utm_source=youtube
```

**Manual email outreach:**
```
https://www.kriczkyvirtus.com/tools?utm_source=email
```

**Partner/CPA referrals:**
```
https://www.kriczkyvirtus.com/tools?utm_source=referral
```

**Google Ads:**
```
https://www.kriczkyvirtus.com/tools?utm_source=google-ads
```

**Skool communities (with specific community name):**
```
https://www.kriczkyvirtus.com/tools?utm_source=skool&utm_campaign=build-with-valor
https://www.kriczkyvirtus.com/tools?utm_source=skool&utm_campaign=ecommerce-owners
https://www.kriczkyvirtus.com/tools/wmbw?utm_source=skool&utm_campaign=agency-accelerator
```

**In-person events (with specific event name):**
```
https://www.kriczkyvirtus.com/tools?utm_source=event&utm_campaign=score-conference-2026
https://www.kriczkyvirtus.com/tools?utm_source=event&utm_campaign=chester-county-chamber-june
https://www.kriczkyvirtus.com/tools/wmbw?utm_source=event&utm_campaign=local-bni-chapter
```

**Rules for UTM values:**
- Use lowercase
- Use hyphens instead of spaces (e.g. `build-with-valor` not `Build With Valor`)
- The code auto-formats them into readable tag names (e.g. `build-with-valor` → `Campaign: Build With Valor`)
- Any new source or campaign value auto-creates the tag in ActiveCampaign — no code changes ever needed
- `utm_source` is always required; `utm_campaign` is optional but recommended for Skool and events

The `?utm_source=xxx` goes at the end of ANY page URL. Add `&utm_campaign=xxx` after it for specifics. The visitor sees the exact same page — they won't notice the parameters.

## Testing

After deploying:
1. Go through any diagnostic tool on the live site (no UTM parameter)
2. Enter name and email
3. Check ActiveCampaign → Contacts — the contact should appear with `Website Lead`, `Tool: [name]`, and `Source: Website` tags
4. Check Vercel Logs — you should see `[AC] Contact synced` and `[AC] Tagged` entries
5. Go through the Constraint Roadmap — verify constraint and tier tags are also applied
6. Test with a UTM parameter: visit `kriczkyvirtus.com/tools/wmbw?utm_source=linkedin`, complete the tool, and verify the contact gets `Source: LinkedIn` tag instead of `Source: Website`
7. Check Google Sheets — verify the Source column is populated

## Critical Instructions
- The `syncContact` call must be in a try/catch — ActiveCampaign failures should NEVER break the user experience
- Tags are auto-created on first use — no manual setup needed in ActiveCampaign
- The `contact/sync` endpoint creates a new contact OR updates an existing one if the email already exists — no duplicate contacts
- Do NOT change any frontend code
- Do NOT change the Google Sheets, Resend, or roadmap generation logic
- The ActiveCampaign API uses `Api-Token` header (not Bearer token)
