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

## 1 · ACTIVECAMPAIGN — verify, don't rewrite

The existing branch already has tag IDs in it. That's more reliable than the numbers in Prompt 1 §6, which came from a spec document that may have drifted.

**Do:**
1. Report every tag ID currently hard-coded in that branch, with the name each one resolves to **when queried against the live account via the API**.
2. Compare against Prompt 1 §6. Report any disagreement — do not silently pick one.
3. Report whether `RH: Entered` is among them.

⛔ Still do not create `Authority` or `Track Intent` fields. Still do not create any tag that doesn't exist.

**If the existing branch is missing `RH: Entered`:** report it and stop. That tag is what triggers the nurture automation, and it has to be created on the ActiveCampaign side, not here.

---

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

All five are being uploaded with this brief. Verify each with `sha256sum` against `REPLIT-0-read-first.md` before use:

```
reinvest-harvest-landing.jsx        c9448be6c62dcf6cca4a03ed9f6a578f2035339cb41888317d0e4d2bb2607138
reinvest-harvest-flow.jsx           497e8d1de269620818ae9aa1c0c10ce6e814de7b7909562d51f55ce1b0508c90
reinvest-harvest-thankyou.jsx       7ad5900081b183fd6be2abab70cc8c07be09300c79f3fafde20fbadd59a7ae42
reinvest-harvest-report.jsx         3ad3c5fa025490862b7b087b6fbf7523ca4a21fc65e852b1828efa79d2f39ee0
reinvest-harvest-results-email.js   fdbb18d76ac93abceb741c57606adeba6cfd1dd78b62616864e39487fb4a6d9f
```

---

## REPORT BACK — then stop again

```
ACTIVECAMPAIGN
  tag ids found in the existing branch, with the name each resolves to live:
  disagreements with Prompt 1 §6:
  RH: Entered present?  Y/N
  Authority field exists?  Y/N   (did NOT create)
  Track Intent field exists?  Y/N   (did NOT create)

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
