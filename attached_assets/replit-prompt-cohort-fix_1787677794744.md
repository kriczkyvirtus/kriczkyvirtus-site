# Replit Agent Prompt — Fix cohort-waitlist data capture

## Context

The `/cohort` page is live and mostly working. A test submission correctly:
- created the contact in ActiveCampaign with name and email
- applied both tier tags (`Tier: Under $1M` id 51 and `Tier: Under $500K` id 62)
- correctly did NOT apply `Website Lead` (7) or `Track: Business` (39)
- sent the notification email with all answers
- wrote a row to Google Sheets

Three things did not work. Fix only these. Do not change anything else.

---

## Problem 1 — Custom fields are not being written to ActiveCampaign

**Status:** the four answers reach the handler (proven — `revenueRange` was parsed correctly to select tier tags) but none are written to ActiveCampaign custom fields.

Write all four. Field IDs are confirmed correct:

| Payload key | AC field ID | Field name | Perstag |
|---|---|---|---|
| `revenueRange` | 2 | Revenue Range | `%REVENUE_RANGE%` |
| `businessConstraint` | 3 | Business Constraint | `%BUSINESS_CONSTRAINT%` |
| `timeline` | 8 | Cohort Timeline | `%COHORT_TIMELINE%` |
| `reason` | 9 | Interest Reason | `%INTEREST_REASON%` |

### Recommended approach — inline on contact sync

Include `fieldValues` in the contact create/update call rather than making separate requests:

```
POST {AC_API_URL}/api/3/contact/sync
Headers: Api-Token: {AC_API_KEY}, Content-Type: application/json

{
  "contact": {
    "email": "...",
    "firstName": "...",
    "lastName": "...",
    "fieldValues": [
      { "field": "2", "value": "<revenueRange>" },
      { "field": "3", "value": "<businessConstraint>" },
      { "field": "8", "value": "<timeline>" },
      { "field": "9", "value": "<reason>" }
    ]
  }
}
```

Field IDs are strings in this payload.

### If the existing code path can't accommodate inline fieldValues

Fall back to separate calls after the contact exists, using the contact ID returned by the sync:

```
POST {AC_API_URL}/api/3/fieldValues

{
  "fieldValue": {
    "contact": <contact_id>,
    "field": <field_id>,
    "value": "<value>"
  }
}
```

One call per field.

### Error handling

Log the ActiveCampaign response for each field write. If a write fails, log the status code and response body — do not swallow the error. The current failure was silent, which is why it wasn't caught.

---

## Problem 2 — Google Sheets row contains no answers

**Cause:** the sheet schema (`Scores/Summary`, `Answers`, `Percentage`, `Band`) was built for scored diagnostics. The cohort payload has no `scores` or `answers` key, so both columns write `{}`.

**Fix:** for `tool === "cohort-waitlist"` only, build an `answers` object server-side from the four payload keys before the Sheets write:

```js
const answers = {
  revenueRange: payload.revenueRange,
  businessConstraint: payload.businessConstraint,
  timeline: payload.timeline,
  reason: payload.reason
};
```

Write that into the existing `Answers` column. Leave `Scores/Summary`, `Percentage`, and `Band` empty for this tool — they don't apply.

Do NOT change the sheet's column structure. Do NOT change the payload the component sends.

---

## Problem 3 — No dedicated "Cohort Waitlist" tab

Rows are only landing on the `Aggregated` tab. Every other tool has its own tab (WMBW, BIB, Human Capital, Customer Capital, Structural Capital, Constraint Roadmap, Valuation Questionnaire).

**First, determine which is true:**

- **If the handler creates tabs dynamically** by tool name and this one failed → fix the tool-name-to-tab mapping so `cohort-waitlist` resolves to a tab named `Cohort Waitlist`.
- **If tabs must pre-exist** → say so in your summary. The tab will be created manually. Then make sure the handler writes to it once it exists.

Either way, rows must continue to also write to `Aggregated` as they do now.

---

## Verification

Submit a test application, then confirm:

- [ ] All four custom fields populated on the ActiveCampaign contact — check the contact record directly, not the API response
- [ ] Google Sheets `Answers` column contains all four values
- [ ] Row appears on both the `Cohort Waitlist` tab and `Aggregated`
- [ ] Tier tags still applied correctly
- [ ] `Website Lead` (7) and `Track: Business` (39) still NOT applied
- [ ] Notification email still sends

Report in your summary exactly which ActiveCampaign API shape you used for the field writes, and paste one successful response.

---

## Critical Instructions

- Do NOT modify `Cohort.jsx` or the payload it sends.
- Do NOT change behavior for any tool other than `cohort-waitlist`.
- Do NOT change the Google Sheets column structure.
- Do NOT create deals in any pipeline.
- Do NOT add dependencies.
