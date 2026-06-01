# Replit Agent Prompt — Fix CTAs, Remove Mid-Doc Emails, Wire Email Gates on 5 Diagnostic Tools

## Overview
Five diagnostic tools need three fixes each: CTA link updates, mid-document email removal, and email gate submission wired to the `/api/lead-capture` serverless function.

The 5 tools are:
1. **What's My Business Worth (WMBW)** — `whats-my-business-worth` component
2. **Business Independence Blueprint (BIB)** — `business-independence-blueprint` component
3. **Structural Capital Deep Dive** — `structural-capital-deep-dive` component
4. **Customer Capital Deep Dive** — `customer-capital-deep-dive` component
5. **Human Capital Deep Dive** — `human-capital-deep-dive` component

---

## Fix 1: Update Final Page CTA Links

In ALL 5 tools, find the final page CTA button that says `BOOK YOUR FREE CALL` and points to `https://kriczkyvirtus.com/call`.

Change BOTH the URL and the button text:
- **Old:** `href="https://kriczkyvirtus.com/call"` → **New:** `href="https://www.kriczkyvirtus.com/free-session"`
- **Old text:** `BOOK YOUR FREE CALL` → **New text:** `BOOK YOUR FREE WORKING SESSION`

This appears as a `<GlassBtn>` component in each file. Example:

```jsx
// Before:
<GlassBtn href="https://kriczkyvirtus.com/call" color={C.gold}>BOOK YOUR FREE CALL</GlassBtn>

// After:
<GlassBtn href="https://www.kriczkyvirtus.com/free-session" color={C.gold}>BOOK YOUR FREE WORKING SESSION</GlassBtn>
```

---

## Fix 2: Remove Mid-Document `scale@kriczkyvirtus.com` Email CTA

In these 4 tools (NOT in WMBW — it doesn't have this), find and remove the mid-document section that shows `scale@kriczkyvirtus.com`. This is typically a card/section near the end of the scored content that invites the reader to email about their constraint.

Remove the entire card/section containing the `scale@kriczkyvirtus.com` reference in:
- Business Independence Blueprint
- Structural Capital Deep Dive
- Customer Capital Deep Dive
- Human Capital Deep Dive

Do NOT remove the `ekriczky@kriczkyvirtus.com` in the footer — that stays.

---

## Fix 3: Wire Email Gates to `/api/lead-capture`

Each of these 5 tools has an email gate (a form where the user enters their name and email to unlock their results). Currently, submitting the form shows a spinning icon and never completes because the submission handler isn't connected to a working endpoint.

For each tool's email submission handler, wire it to call `POST /api/lead-capture` with the following payload:

```javascript
const payload = {
  name: name.trim(),
  email: email.trim(),
  tool: "TOOL_NAME_HERE",  // see tool names below
  summary: {
    // Include whatever score/result data the tool has computed
    // This varies by tool — include the main scores, categories, or results
  },
  timestamp: new Date().toISOString(),
};

try {
  const res = await fetch("/api/lead-capture", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  
  if (res.ok) {
    console.log(`[${toolName}] Lead captured successfully`);
  } else {
    console.error(`[${toolName}] API error:`, res.status);
  }
} catch (err) {
  console.error(`[${toolName}] Fetch failed:`, err);
}

// Continue with the existing post-submission flow (show results, etc.)
```

**Tool names for the `tool` field:**
- WMBW: `"value-range-estimator"`
- BIB: `"business-independence-blueprint"`
- Structural: `"structural-capital-deep-dive"`
- Customer: `"customer-capital-deep-dive"`
- Human: `"human-capital-deep-dive"`

**Important:** The API call should NOT block the user experience. If the API call fails, the tool should still show the results / unlock the content. The lead capture is a background operation — don't let it prevent the user from seeing their results.

Make the handler `async` if it isn't already.

**Also important:** The `/api/lead-capture` serverless function currently expects `summary.constraintId` and `summary.revenue` for roadmap generation. These other tools don't generate roadmaps, so it's fine if those fields are missing — the function will just skip roadmap generation and return `{ success: true, roadmapUrl: null }`. The important thing is that the name, email, tool name, and whatever scores/results exist get sent to the API so the lead is logged in Vercel.

---

## Fix 4: Update the serverless function to handle non-roadmap tools

In `api/lead-capture.js`, the function currently returns a 400 error if `constraintId` or `revenue` is missing. Update the validation so that roadmap generation is optional — it should only generate a roadmap if the constraint roadmap data is present, and otherwise just log the lead and return success.

Find the validation block that looks something like:
```javascript
if (!name || !email || !constraintId || !revenue || !categories) {
  return res.status(400).json({ error: "..." });
}
```

Replace with:
```javascript
if (!name || !email) {
  return res.status(400).json({ error: "Missing required fields: name, email" });
}
```

Then wrap the roadmap generation in a condition:
```javascript
// Only generate roadmap if constraint roadmap data is present
let roadmapUrl = null;
if (constraintId && revenue && categories) {
  try {
    // ... existing roadmap generation code ...
  } catch (renderErr) {
    console.error("[Roadmap] Generation failed:", renderErr);
  }
}
```

This way the same endpoint handles all tools — constraint roadmap leads get a personalized roadmap, other tool leads just get logged.

---

## Critical Instructions
- Make all changes across ALL 5 tool files.
- Do NOT change any scoring logic, question content, or visual styling.
- Do NOT remove the footer `ekriczky@kriczkyvirtus.com` — only remove the mid-document `scale@kriczkyvirtus.com` sections.
- The email gate should still work the same way from the user's perspective — enter name/email, see results. The only difference is that the data now also gets sent to the API in the background.
- If any tool's email handler currently does client-side PDF generation, keep that logic intact. Just add the API call alongside it.
