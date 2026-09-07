# REPLIT PROMPT 1 — DATA LAYER

**Read `REPLIT-0-read-first.md` before starting.**
**Builds:** token generation, Blob storage, `/api/lead-capture`, the Sheets tab, the results email, ActiveCampaign tagging.
**Builds no UI.** Nothing visual changes on the site after this prompt. That is expected.

**Uploaded file:** `reinvest-harvest-results-email.js`

---

## 1 · DISCOVERY — do this first, report before building

Do not create anything yet. Find and report:

1. Where do the existing diagnostic API handlers live? Give the exact path of the current `lead-capture` handler.
2. What does the existing handler do, in order? List the steps.
3. Where is `lib/sheets.js` (or equivalent) and what does `TOOL_TO_TAB` currently map?
4. Where is `lib/email.js` and what does `TOOL_DETAILS` contain?
5. Where is the ActiveCampaign helper, and what function signature does it expose?
6. Confirm these environment variables resolve: `BLOB_READ_WRITE_TOKEN`, `GOOGLE_SHEETS_CREDENTIALS`, `GOOGLE_SHEETS_SPREADSHEET_ID`, `RESEND_API_KEY`, `ACTIVECAMPAIGN_URL`, `ACTIVECAMPAIGN_KEY`. Report any that are missing. ⚠️ Note the names: `ACTIVECAMPAIGN_URL` / `_KEY`, not `_API_URL` / `_API_KEY`.
7. Is Vercel Blob already used anywhere? If so, show how it's called.

**Stop here and report.** Do not proceed until this discovery is confirmed.

---

## 2 · TOKEN GENERATION

Create a helper that produces the report token.

```js
import { randomBytes } from "crypto";
export const makeReportToken = () => randomBytes(16).toString("base64url");
```

⛔ **Do not** use `Math.random()`, a timestamp, an incrementing counter, or a hash of the email. The token is the only thing protecting someone's scores behind an unauthenticated URL. `Math.random()` is predictable by design and enumerable tokens let anyone walk other people's reports.

Result: 22 URL-safe characters, 128 bits of entropy.

---

## 3 · BLOB STORAGE

Write one JSON object per submission at `reports/{token}.json`.

Contents — exactly these keys:

```json
{
  "token": "...", "createdAt": "ISO-8601",
  "firstName": "...", "lastName": "...", "company": "...", "email": "...", "phone": "...",
  "guess": "reinvest|harvest|split|null",
  "industry": "...", "ownership": "...", "ownerTier": "Owner|Leadership|Employee",
  "timing": "...", "revenueBand": "...",
  "scores": { "b1":0,"b2":0,"b3":0,"b4":0,"b5":0,"p1":0,"p2":0,"p3":0,"p4":0,"p5":0 },
  "bizScore": 0, "persScore": 0, "totalScore": 0,
  "quadrantKey": "reinvest|split|harvest|stabilize",
  "trackIntent": "Business|Wealth"
}
```

**No expiry.** Reports stay live indefinitely — a returning link months later is a warm re-entry point.

Also add a **read** helper that fetches and parses `reports/{token}.json`, returning `null` if the blob doesn't exist. Prompt 3 depends on it.

---

## 4 · GOOGLE SHEETS

Add to `TOOL_TO_TAB`:

```js
"reinvest-harvest": "Reinvest or Harvest",
```

Create a tab named **"Reinvest or Harvest"** in the existing lead-capture spreadsheet. Column order:

```
Timestamp (EST) | First Name | Last Name | Company | Email | Phone | Revenue Band |
Owner Tier | Industry | Timing | Guess | Biz Score | Personal Score | Total |
Quadrant | Track Intent | Source | Campaign | Report Link | Notes
```

Also append the row to the **Aggregated** tab. ⚠️ If Aggregated lacks any of these columns, **stop and report** — do not silently drop fields and do not reorder existing columns.

`Report Link` = the full `/r/{token}` URL.

---

## 5 · RESULTS EMAIL

Copy `reinvest-harvest-results-email.js` into the lib directory. Verify:

```
sha256sum → fdbb18d76ac93abceb741c57606adeba6cfd1dd78b62616864e39487fb4a6d9f
```

It exports `renderResultsEmail(data)` returning `{ subject, preheader, html, text }`.

Send via Resend with **both** `html` and `text` parts. ⚠️ Sending HTML-only measurably hurts deliverability and this is a cold first send every time.

From/reply-to: match whatever the existing diagnostics use. **Report which addresses you found — do not invent one.**

Check the Unsubscribed tab before sending, same as the other tools.

---

## 6 · ACTIVECAMPAIGN

Upsert the contact with:

**Custom fields**
- `Revenue Range` = the `revenueBand` string, verbatim

**Tags** — apply all that match:

| Condition | Tag |
|---|---|
| Always | `Website Lead` |
| Always | `RH: Entered` ← this is what triggers the nurture automation |
| `revenueBand` = `Under $500K` | Tier 51 **and** Tier 62 |
| `revenueBand` = `$500K - $1M` | Tier 51 **and** Tier 59 |
| `revenueBand` = `$1M - $3M` | Tier 18 |
| `revenueBand` = `$3M - $10M` | Tier 52 |
| `revenueBand` = `$10M+` | Tier 53 |

⛔ **Verify every tag ID against the live account via the API before writing the mapping.** Do not assume the numbers above are still correct. Report the ID and name of each one you find.

⛔ **`RH: Entered` may not exist yet.** If it doesn't, **stop and report** — do not create it. Same for any tag above that you cannot find.

⛔ **Do not create an `Authority` field or a `Track Intent` field.** Both are still being decided. `ownerTier` and `trackIntent` must be written to Blob and Sheets only. If either field already exists, report its ID and leave it alone.

---

## 7 · THE HANDLER

`/api/lead-capture`, for `tool: "reinvest-harvest"`, in this order:

```
1. Validate payload            → 400 on missing required fields
2. Generate token
3. Write reports/{token}.json to Blob
4. Write the Sheets row (tool tab + Aggregated)
5. Upsert ActiveCampaign contact, apply fields + tags
6. Send the Resend email
7. Return 200 with { token }
```

⚠️ **Order matters.** ActiveCampaign before Resend: a lead in AC without an email is recoverable; an email sent to someone never tagged is not.

⚠️ **Step 6 must not block step 7.** If Resend fails, log it, queue a retry, and still return 200 — the lead is already captured. A failed send must never fail the submission.

The response must include the token; the front end needs it to redirect.

---

## 8 · VERIFY

Run each, record the result:

- [ ] `sha256sum` on the email module matches
- [ ] `node -e` generating 5 tokens: all 22 chars, all different, no `Math.random` anywhere in the file
- [ ] POST a test payload with `curl`; response is 200 and contains a token
- [ ] `reports/{token}.json` exists in Blob and parses with all keys above
- [ ] The Blob read helper returns the object for a good token and `null` for a made-up one
- [ ] A row appears in the "Reinvest or Harvest" tab with all 20 columns populated
- [ ] The same row appears in Aggregated
- [ ] The results email arrives, has both HTML and text parts, and the report link resolves
- [ ] An ActiveCampaign contact exists with `Revenue Range` set and the correct tier tags
- [ ] Killing the Resend key still returns 200 (send fails, lead survives)

---

## REPORT BACK

```
DISCOVERY
  lead-capture handler path:
  existing handler steps:
  sheets lib path:
  email lib path:
  AC helper path + signature:
  env vars present / missing:
  Blob already used?  where:

BUILT
  token helper path:
  blob write helper path:
  blob read helper path:
  sheets tab created?  columns count:
  email module sha256 match?  Y/N
  from / reply-to addresses found:

ACTIVECAMPAIGN — ids verified via API
  Website Lead:      id ___  name ___
  RH: Entered:       id ___  name ___   (or NOT FOUND)
  Tier 51 / 62 / 59 / 18 / 52 / 53:  confirm each id and name
  Authority field exists?  Y/N  (did NOT create)
  Track Intent field exists?  Y/N  (did NOT create)

VERIFY — result of each of the 10 checks above

NOT DONE / STOPPED ON
  (list anything you did not do, and why)

QUESTIONS
  (anything ambiguous — do not guess, ask here)
```
