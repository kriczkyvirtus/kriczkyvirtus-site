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

## 2 · SHEETS — 10 columns to 20, carefully

⚠️ **First, report whether the "Reinvest or Harvest" tab already contains data rows.** The answer changes what you do, and getting this wrong corrupts existing leads.

**If the tab is empty (header row only):**
Rebuild the header to the 20-column order in Prompt 1 §4 and update the `reinvest-harvest` branch to match.

**If the tab has data rows:**
⛔ **Do not insert columns into the middle.** Inserting shifts every existing row's data one cell right of where its header says it is, silently. Instead:
1. Report the current 10 column names, in order.
2. **Append** the missing columns to the right of the existing ones.
3. Report the resulting order, which will not match Prompt 1 §4 — that is expected and correct.
4. Update the branch to write in the actual resulting order.

Either way, do the same check on the **Aggregated** tab and report before writing.

---

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

SHEETS
  "Reinvest or Harvest" tab — has data rows?  Y/N   row count:
  current 10 column names in order:
  Aggregated tab — has data rows?  Y/N
  plan chosen (rebuild / append) and why:
  resulting column order:

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
