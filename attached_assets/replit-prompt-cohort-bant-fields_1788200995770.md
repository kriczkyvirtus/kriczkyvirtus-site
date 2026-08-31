# Replit Prompt — Persist `ownership` and `tierInterest` from the cohort application

## Context

`/cohort` now sends two additional keys to `/api/lead-capture`. The API ignores them, so every application submitted right now loses this data permanently.

**No front-end changes.** This is entirely `/api/lead-capture` and the Sheets writer.

```json
{
  "name": "...", "email": "...",
  "tool": "cohort-waitlist",
  "toolName": "Cohort Application",
  "revenueRange": "$1M - $3M",
  "ownership": "I own at least 51%",
  "tierInterest": "VIP - $1,997/mo",
  "businessConstraint": "...",
  "timeline": "...",
  "reason": "...",
  "timestamp": "..."
}
```

All IDs below were verified against the live account on 2026-08-31.

---

## 1. ActiveCampaign custom fields

Write inline on `contact/sync`, field IDs as **strings**, nested in the `contact` object — the same pattern already working for fields 2 and 11.

| Payload key | Field ID | Field name |
|---|---|---|
| `ownership` | **12** | Ownership Stake |
| `tierInterest` | **13** | Tier Interest |

Both are Text Input. Write the value through verbatim — do not normalize, trim punctuation, or map to a canonical form. Four ownership values contain apostrophes and one tier value contains `$1,997`. Confirm those survive whatever escaping sits between the API and ActiveCampaign.

> Reminder: `contactFieldValues` is not a real endpoint. It returns 200 and writes nothing.

---

## 2. Tags

### Tier interest

| `tierInterest` | Tag | ID |
|---|---|---|
| `Premium - $797/mo` | `Cohort Tier: Premium` | 72 |
| `VIP - $1,997/mo` | `Cohort Tier: VIP` | 73 |
| `Either - help me choose` | `Cohort Tier: Undecided` | 74 |
| `Not sure yet` | `Cohort Tier: Undecided` | 74 |

### Authority

| `ownership` | Tag | ID |
|---|---|---|
| `I'm the sole owner` | `Authority: Decision Maker` | 75 |
| `I own at least 51%` | `Authority: Decision Maker` | 75 |
| `I own 20%-50%` | `Authority: Partial Owner` | 76 |
| `I own less than 20%` | `Authority: Below Threshold` | 77 |
| `I'm not an owner but I'm on the leadership team` | `Authority: Below Threshold` | 77 |
| `I'm not a business owner` | `Authority: Below Threshold` | 77 |

If a value matches nothing, apply no tag rather than guessing — and log the unmatched value.

### ⛔ Do NOT create "Cohort Band" tags

An earlier spec called for `Cohort Band: *` tags derived from `revenueRange`. **Skip that entirely.** They would duplicate the tier tags this endpoint already applies:

| Proposed | Already applied |
|---|---|
| `Cohort Band: Under $1M` | `Tier: Under $1M` (51) |
| `Cohort Band: $1M-$3M` | `Tier: $1M-$3M` (18) |
| `Cohort Band: $3M-$10M` | `Tier: $3M-$10M` (52) |
| `Cohort Band: Above Range` | `Tier: $10M+` (53) |

Existing cohort tagging is unchanged: `Cohort: Waitlist` (46), `Source: Website` (12), and the tier tag from `revenueRange`. `Website Lead` (7) and `Track: Business` (39) remain excluded for this tool.

---

## 3. Google Sheets

Add two columns, headers `Ownership` and `Tier Interest`, to **both** the `Cohort Waitlist` tab and `Aggregated`.

⛔ **Append at the far right. Do not insert mid-sheet.**

This writer is positional — current ranges are `Aggregated` `A:M` and `Cohort Waitlist` `A:K`. Inserting a column shifts every subsequent value by one, silently, for every tool writing to that tab.

| Tab | Current | New | New columns |
|---|---|---|---|
| `Aggregated` | `A:M` | `A:O` | N = Ownership, O = Tier Interest |
| `Cohort Waitlist` | `A:K` | `A:M` | L = Ownership, M = Tier Interest |

Use the same header-detection approach already built for the `Revenue Band` column: check whether the header exists, use it if so, append if not.

**Do not backfill historical rows.** Empty cells and a real answer should stay distinguishable.

---

## 4. Notification email

Include both values so applications can be triaged without opening the sheet.

---

## 5. Both keys must be optional

`/api/lead-capture` serves every diagnostic on the site. A missing key must not throw and must not block the Sheets or ActiveCampaign write — write an empty string and continue.

---

## Verification

- [ ] Test application writes both values to `Cohort Waitlist` **and** `Aggregated`, in the appended columns
- [ ] Contact in ActiveCampaign shows fields **12** and **13** populated, not blank
- [ ] Correct `Cohort Tier:` and `Authority:` tags applied
- [ ] An apostrophe value (`I'm the sole owner`) round-trips intact to both Sheets and AC
- [ ] `VIP - $1,997/mo` round-trips with comma and dollar sign intact
- [ ] Existing cohort tags and fields 2 / 11 still work
- [ ] `Website Lead` (7) and `Track: Business` (39) still absent
- [ ] **No `Cohort Band:` tags were created**
- [ ] Notification email includes both values
- [ ] A payload with both keys absent still returns success
- [ ] **Submit through one other diagnostic** (Reinvest or Harvest) and confirm its row still lands in the correct columns on `Aggregated`

That last item is the one that catches a column shift.

---

## Constraints

- Do NOT modify `Cohort.jsx`
- Do NOT change the endpoint path, response shape, or retry behavior
- Do NOT change any other tool's handling
- Do NOT insert columns mid-sheet
- Do NOT add dependencies
