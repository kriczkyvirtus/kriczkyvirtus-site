# REPLIT PROMPT 2 — LANDING PAGE + FLOW

**Read `REPLIT-0-read-first.md` first. Do not start until Prompt 1 is verified.**
**Builds:** `/reinvest-harvest` and `/reinvest-harvest/start`

**Uploaded files:** `reinvest-harvest-landing.jsx`, `reinvest-harvest-flow.jsx`

---

## 1 · DISCOVERY — report before building

1. Where do existing tool components live? Give the exact path of `human-capital-deep-dive.jsx` or equivalent.
2. What is the file-naming convention there — kebab-case or PascalCase?
3. Where are routes registered? Show the pattern for one existing tool route.
4. **Where does UTM capture happen?** The docs say components read `utm_source` and `utm_campaign`, but no tool component contains that code. Find the layer that does it — route wrapper, middleware, or API. **Report the exact location.** If it doesn't exist anywhere, say so; do not build it yet.

**Stop and report before building.**

---

## 2 · FILE PLACEMENT

Copy both files into the same directory as the existing tool components. **Do not invent a path** — put them next to the file you found in discovery.

| File | Verify sha256 |
|---|---|
| `reinvest-harvest-landing.jsx` | `c9448be6c62dcf6cca4a03ed9f6a578f2035339cb41888317d0e4d2bb2607138` |
| `reinvest-harvest-flow.jsx` | `497e8d1de269620818ae9aa1c0c10ce6e814de7b7909562d51f55ce1b0508c90` |

Run `sha256sum` after writing, before pushing.

---

## 3 · ROUTES

| Route | Component |
|---|---|
| `/reinvest-harvest` | landing |
| `/reinvest-harvest/start` | flow |

Follow the exact pattern used by existing tool routes.

⚠️ The slug is `reinvest-harvest` — no "or". The **display title** is "Reinvest or Harvest", with the word. This asymmetry is deliberate. Do not make them match.

---

## 4 · WIRE THE FLOW TO THE API

The flow currently POSTs to `/api/lead-capture` and logs the payload. Change only what's needed to:

1. POST the payload (already correct — do not alter its shape)
2. On 200, take the returned `token`
3. Show the teaser (already built — do not modify)
4. After the teaser, redirect to `/reinvest-harvest/next?t={token}`

⚠️ **Do not change the payload shape.** Prompt 1's handler and the Sheets columns depend on it exactly as written.

⚠️ **Do not remove the `console.log` of the payload.** It is the debugging path if a submission goes missing.

The flow has `AUTO_ADVANCE = true` at the top. **Leave it.** It is a deliberate choice — selecting an option advances after 340ms. Explicit Next buttons are already built behind that flag if it's ever flipped.

---

## 5 · UTM CAPTURE

If discovery found the UTM layer: confirm this route inherits it, and report which layer owns it.

If it does not exist anywhere: **stop and report.** Do not build it. Paid traffic to this funnel makes attribution matter, but guessing at the mechanism is worse than not having it yet.

---

## 6 · VERIFY

Landing page:
- [ ] `/reinvest-harvest` renders; no console errors
- [ ] The barbell graphic is **visible** — gold plates left, green right. ⚠️ If it's an empty gap, a gradient has reverted to `objectBoundingBox`; the file is wrong, re-copy it.
- [ ] The sample result card cycles through four positions
- [ ] The CTA goes to `/reinvest-harvest/start`
- [ ] Renders at 390px with no horizontal scroll

Flow:
- [ ] Step 1 shows **five** fields: first, last, company, email, phone
- [ ] Phone auto-formats to `555-123-4567` as you type
- [ ] Submitting step 1 empty shows a validation error and does not advance
- [ ] Progress reads `n of 20`; the bar fills
- [ ] Selecting an option auto-advances after a short beat
- [ ] "Previous" appears below the options and steps back
- [ ] **Every one of the 20 steps fits a 390×844 viewport with no scrolling**
- [ ] Completing the flow shows the teaser with a quadrant, the guess-vs-actual line, and two scores
- [ ] The payload in the console contains `company`, `ownerTier`, `trackIntent`, and all 10 scores
- [ ] A row lands in the Sheets tab
- [ ] Redirect to `/reinvest-harvest/next?t=<token>` happens after the teaser

Score four profiles and confirm the teaser position:

| b1–b5 | p1–p5 | Expected |
|---|---|---|
| 5,5,6,5,6 | 5,5,4,5,5 | Reinvest-Weighted |
| 5,4,5,4,6 | 2,3,2,3,2 | Split — Pay Yourself First |
| 2,2,3,2,2 | 6,5,5,4,5 | Harvest-Weighted |
| 2,1,2,2,1 | 1,2,1,2,2 | Stabilize First |

---

## REPORT BACK

```
DISCOVERY
  tool components directory:
  naming convention:
  route registration file + pattern:
  UTM capture layer:            (or NOT FOUND)

BUILT
  landing file path:      sha256 match? Y/N
  flow file path:         sha256 match? Y/N
  routes registered:

VERIFY
  landing — each of the 5 checks:
  flow — each of the 11 checks:
  four quadrant profiles — actual result for each:
  tallest step measured (px) and which step:

NOT DONE / STOPPED ON

QUESTIONS
```
