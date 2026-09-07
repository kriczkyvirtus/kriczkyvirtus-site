# REPLIT PROMPT 1A — RECONCILING THE EXISTING CODE

**Run this before continuing with `REPLIT-1-data-layer.md` section 2.**
This answers your question from the Prompt 1 discovery report.

---

## ANSWERING YOUR QUESTION

> *"Confirm whether the existing partial Reinvest or Harvest code should be replaced/adapted for the new four-page architecture."*

**Adapted, not replaced — and the answer differs per file.** What you found is the output of an earlier, superseded prompt that built a single-page version of this tool. Some of it is genuinely useful and must be kept. Some of it is now wrong. Do not delete it wholesale and do not leave it alone wholesale.

You were right to stop. The table below is the decision for each piece.

| What you found | Do this |
|---|---|
| `lib/activecampaign.js` — `reinvest-harvest` branch with fixed tag IDs | **KEEP.** Verify the IDs, don't rewrite the branch. See §1. |
| `lib/sheets.js` — 10-column `reinvest-harvest` branch | **EXPAND to 20 columns.** See §2 — read it before touching anything. |
| `TOOL_TO_TAB` → `Reinvest or Harvest` | **KEEP as-is.** Already correct. |
| `TOOL_DETAILS` — `reinvest-harvest` entry | **RETIRE from the send path.** See §3. |
| `/tools/reinvest-harvest` → old scorecard component | **REDIRECT.** See §4. |
| `api/lead-capture.js` — UTM from Referer for `reinvest-harvest` | **KEEP.** See §5. |

---

## 1 · ACTIVECAMPAIGN — RESOLVED, no live query needed

Your report said the credentials aren't injected into the agent shell, so you couldn't resolve the tag IDs. **That has been done for you against the live account.** All fourteen IDs from the existing branch, confirmed:

| ID | Live name |
|---|---|
| 7 | `Website Lead` |
| 12 | `Source: Website` |
| 38 | `Source: Instagram` |
| 67 | `Tool: Reinvest Harvest` |
| 51 | `Tier: Under $1M` |
| 62 | `Tier: Under $500K` |
| 59 | `Tier: $500K-$1M` |
| 18 | `Tier: $1M-$3M` |
| 52 | `Tier: $3M-$10M` |
| 53 | `Tier: $10M+` |
| 68 | `Position: Reinvest-Weighted` |
| 69 | `Position: Split` |
| 70 | `Position: Harvest-Weighted` |
| 71 | `Position: Stabilize First` |

**The existing branch is correct. Do not rewrite it. Do not create any tag.**

Three corrections to what Prompt 1 originally said:

1. **`RH: Entered` does not exist and must not be created.** Tag **67 `Tool: Reinvest Harvest`** already serves as the dedicated funnel entry tag.
2. **Position tags 68–71 already exist**, described in the account as *"Descriptive only – does not route."* Apply the one matching the quadrant; never branch on it.
3. **`Authority` and `Track Intent` still must not be created.** Those values go to Blob and Sheets only.

**No live query is required from you for ActiveCampaign.** Just read the existing branch and report what it does against the table above.

## 2 · SHEETS — RESOLVED, no live query needed

Both tabs have been inspected. **They need opposite treatment.** Do not query anything; use what follows.

### 2a · "Reinvest or Harvest" tab — EMPTY, rebuild it

Confirmed: header row only, **no data rows**. Current headers:

```
Timestamp (EST) | Name | Email | Revenue Band | Score | Band | Source | Campaign | Link | Notes
```

**Replace the header row with these 20 columns, in this order**, and update the `reinvest-harvest` branch in `lib/sheets.js` to write them:

| # | Column | Value |
|---|---|---|
| 1 | Timestamp (EST) | submission time |
| 2 | First Name | |
| 3 | Last Name | |
| 4 | Company | new field at step 1 |
| 5 | Email | |
| 6 | Phone | |
| 7 | Revenue Band | canonical string, verbatim |
| 8 | Owner Tier | Owner / Leadership / Employee |
| 9 | Industry | |
| 10 | Timing | |
| 11 | Guess | reinvest / harvest / split / (blank) |
| 12 | Biz Score | 0–30 |
| 13 | Personal Score | 0–30 |
| 14 | Total | 0–60 |
| 15 | Quadrant | e.g. `Split — Pay Yourself First` |
| 16 | Track Intent | Business / Wealth |
| 17 | Source | utm_source |
| 18 | Campaign | utm_campaign |
| 19 | Link | full `/r/{token}` URL |
| 20 | Notes | blank |

⚠️ Columns 17–20 deliberately keep the existing tab's trailing convention (`Source | Campaign | Link | Notes`) so this tab matches every other tool tab. Do not rename `Link` to `Report Link`.

### 2b · Aggregated tab — HAS DATA ROWS, do not restructure

Confirmed: **contains data rows.** Current 15 columns:

```
A Timestamp | B Name | C Email | D Tool | E Scores/Summary | F Answers | G Percentage |
H Band | I Link | J Tools Completed | K Source | L Campaign | M Revenue Band |
N Ownership | O Tier Interest
```

⛔ **Do not add, insert, rename or reorder any column on this tab.** Map the payload into the columns that already exist:

| Column | Write |
|---|---|
| A Timestamp | submission time |
| B Name | `First Last` |
| C Email | email |
| D Tool | `Reinvest or Harvest` |
| E Scores/Summary | `Biz {biz}/30 · Personal {pers}/30 · {quadrant}` — same format as AC field 11 |
| F Answers | the ten scores, e.g. `b1:5 b2:4 b3:5 b4:4 b5:6 p1:2 p2:3 p3:2 p4:3 p5:2` |
| G Percentage | `{total}/60` as a percentage |
| H Band | the score band name — `Money On Autopilot` / `Split Focus` / `Deliberate Allocator` / `Compounding Owner` |
| I Link | full `/r/{token}` URL |
| J Tools Completed | leave to the existing helper — do not change its logic |
| K Source | utm_source |
| L Campaign | utm_campaign |
| M Revenue Band | canonical string, verbatim |
| N Ownership | the step-16 ownership answer |
| O Tier Interest | leave blank — not applicable to this tool |

⚠️ **`H Band` is the score band, not the quadrant.** Other tools use that column for their score band, and the quadrant already appears in `E Scores/Summary`. Putting the quadrant in `H` would make this tool's rows inconsistent with every other row on the tab.

**Company, Phone, Industry, Timing, Owner Tier and the individual scores have no column on Aggregated.** That is correct and intentional — Aggregated is the roll-up, the tool tab is the detail record. Do not append columns to carry them.

## 3 · EMAIL — two systems, keep one

`TOOL_DETAILS` has a `reinvest-harvest` entry producing the standard branded HTML results email. The new architecture replaces it with a deliberately plain-text-style email in `reinvest-harvest-results-email.js`.

**Do:**
- Route the `reinvest-harvest` send through `renderResultsEmail()` from the uploaded module.
- **Leave the `TOOL_DETAILS` entry in place**, unused, and report that you did. Removing it risks breaking a shared code path that other tools use; an unused entry is harmless.
- Report which function currently sends the `reinvest-harvest` email and where you changed it.

The two emails are very different on purpose. The new one is plain because this is a cold first send every time and image-heavy dark HTML gets classified as bulk.

---

## 4 · THE OLD ROUTE

`/tools/reinvest-harvest` currently serves the superseded single-page scorecard. The new landing page is at `/reinvest-harvest`.

**Do:** make `/tools/reinvest-harvest` a **permanent redirect to `/reinvest-harvest`**, and report how you implemented it.

Reasons: the old tool asks the same questions and produces a worse version of the same answer, so leaving both live means two tools competing at two URLs. Anything already linking to the old path — the Resources Hub, any existing content — keeps working.

⛔ Do not delete the old component file yet. Report its path. It comes out once the redirect is confirmed working.

---

## 5 · UTM — you already answered Prompt 2's open question

Your discovery says `api/lead-capture.js` derives missing UTM source and campaign from the Referer URL specifically for `reinvest-harvest`. That answers the question Prompt 2 §1.4 asks — no further work needed there.

**Do:** confirm that logic still fires for the new payload shape, and report the exact function.

---

## 6 · THE UPLOADED FILES

⚠️ **You were right about the landing file — the reference hash was wrong, not your copy.** The file you received (35,729 bytes, `45ac65…`) is the current version, which includes the cycling sample-result card. The 28,066-byte reference was a superseded draft. **Use the file you have.** The corrected values are below.

All five are being uploaded with this brief. Verify each with `sha256sum` against `REPLIT-0-read-first.md` before use:

```
reinvest-harvest-landing.jsx        45ac65510f0941dc57ff4c1f1fa23274a681a1f00bdc8775dbb7d8ab303b9a63
reinvest-harvest-flow.jsx           497e8d1de269620818ae9aa1c0c10ce6e814de7b7909562d51f55ce1b0508c90
reinvest-harvest-thankyou.jsx       7ad5900081b183fd6be2abab70cc8c07be09300c79f3fafde20fbadd59a7ae42
reinvest-harvest-report.jsx         3ad3c5fa025490862b7b087b6fbf7523ca4a21fc65e852b1828efa79d2f39ee0
reinvest-harvest-results-email.js   fdbb18d76ac93abceb741c57606adeba6cfd1dd78b62616864e39487fb4a6d9f
```

---

## REPORT BACK — then stop again

```
ACTIVECAMPAIGN  (no live query needed — ids resolved above)
  tag ids the existing branch applies, and on what condition:
  anything it does that is NOT in the table above:
  applies tag 67 on every submission?  Y/N
  applies the right Position tag from the quadrant?  Y/N
  sub-$1M applies TWO tier tags?  Y/N
  Revenue Range written verbatim?  Y/N

SHEETS  (no live query needed — both tabs resolved above)
  "Reinvest or Harvest" header rebuilt to the 20 columns?  Y/N
  lib/sheets.js reinvest-harvest branch updated to write all 20?  Y/N
  Aggregated — confirm you added/renamed/reordered NOTHING:  Y/N
  Aggregated mapping implemented for all 15 columns?  Y/N
  H Band receives the score band (not the quadrant)?  Y/N

EMAIL
  function that currently sends reinvest-harvest:
  changed to renderResultsEmail()?  where:
  TOOL_DETAILS entry left in place?  Y/N

OLD ROUTE
  old component path:
  redirect implemented how:
  redirect verified working?  Y/N

UTM
  exact function deriving UTM from Referer:
  still fires for the new payload?  Y/N

FILES
  all five sha256 match?  list any that don't

NOT DONE / STOPPED ON

QUESTIONS
```

Once this is reported and confirmed, continue with `REPLIT-1-data-layer.md` from **section 2 (token generation)**. Sections 4, 5 and 6 of that prompt are now modified by §2, §3 and §1 above.
