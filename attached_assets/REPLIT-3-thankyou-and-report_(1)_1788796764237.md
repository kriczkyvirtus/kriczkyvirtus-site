# REPLIT PROMPT 3 — THANK-YOU PAGE + REPORT

**Read `REPLIT-0-read-first.md` first. Do not start until Prompt 2 is verified.**
**Builds:** `/reinvest-harvest/next` and `/r/:token`

**Uploaded files:** `reinvest-harvest-thankyou.jsx`, `reinvest-harvest-report.jsx`

---

## 1 · FILE PLACEMENT

Same directory as the other tool components.

| File | Verify sha256 |
|---|---|
| `reinvest-harvest-thankyou.jsx` | `7ad5900081b183fd6be2abab70cc8c07be09300c79f3fafde20fbadd59a7ae42` |
| `reinvest-harvest-report.jsx` | `3ad3c5fa025490862b7b087b6fbf7523ca4a21fc65e852b1828efa79d2f39ee0` |

⚠️ The report is 122KB / 1,382 lines. Large writes have failed silently here before. Run `sha256sum` and confirm the line count before pushing.

---

## 2 · BOTH ROUTES READ FROM BLOB

Both pages are server-rendered from the token, using the Blob read helper built in Prompt 1.

### `/reinvest-harvest/next?t=<token>`

```
token present and blob found  → pass props, resolved: true
token missing / not found     → pass resolved: false
```

Props: `email`, `quadrantKey`, `revenueBand`, `ownerTier`, `resolved`.

⚠️ `resolved` defaults to `true` in the component. Only pass `false` when lookup fails. Do **not** 404 on a bad token — the page has a designed fallback that still works as a booking page.

### `/r/:token`

```
blob found      → pass props, render the report
blob not found  → 404
```

Props: `name` (first name), `email`, `scores`, `guess`, `revenueBand`, `ownerTier`, `token`, `shareUrl` (the full `/r/{token}` URL).

⚠️ The report **does** 404 on a bad token, unlike the thank-you page. That difference is intentional: a booking page can stand alone, a personal report cannot.

---

## 3 · TURN OFF PREVIEW MODE

Both files have a preview toolbar for reviewing variants. Set in each:

```js
const PREVIEW = false;
```

Confirm the fixed bottom toolbar is gone from both pages after the change.

---

## 4 · THINGS NOT TO TOUCH

- **The report's `useEffect` viewport hook.** It sets the viewport to 816px and scales to fit on narrow devices. ⛔ Never replace it with CSS `zoom` or `transform: scale()` — both blanked the page in production.
- **The `#rh-scheduler` anchor and the CTA hrefs.** Fit-call CTAs point at `#rh-scheduler`, not the iClosed URL, so no interaction can open the scheduler in a tab. The iClosed URL belongs only on the `iframe`.
- **The iClosed `iframe`.** Do not swap it for `widget.js`.
- **`8.5in` page widths in the report.** It is a paginated document.

---

## 5 · VERIFY

Thank-you page — with a valid token:
- [ ] Confirmation bar shows the right email
- [ ] Quadrant name, line, VSL placeholder, bridge, roadmap, offer card, scheduler all present
- [ ] Roadmap card 01 reads **"You Are Here"**
- [ ] Clicking "BOOK YOUR FIT CALL" **scrolls down** — it must not open a tab or navigate
- [ ] The iClosed calendar loads inside the iframe
- [ ] No preview toolbar

Thank-you page — with `?t=garbage`:
- [ ] Page renders, does not 404
- [ ] Headline reads "Want help proactively reinvesting in your business?"
- [ ] Confirmation bar, quadrant, bridge and offer card are **absent**
- [ ] Roadmap **is** present, and card 01 reads **"Start Here"**
- [ ] The CTA under the video scrolls to the scheduler
- [ ] The calendar still loads

Report — with a valid token:
- [ ] 16 pages render
- [ ] Every page is 11in tall — nothing overflows
- [ ] Page 1 shows the right quadrant and both pillar scores
- [ ] Each of the 10 dimension pages shows its concept visual, and the visuals change with the score
- [ ] Page 15 roadmap shows six icons; hovering a card glows in that card's colour
- [ ] Page 16 kicker reads "What Happens Next For &lt;band&gt; Owners"
- [ ] Page 16 CTA points to `/reinvest-harvest/next?t=<token>#rh-scheduler` for $1M+, `skool.com/virtus-collective` otherwise
- [ ] The Share button copies the `/r/{token}` URL
- [ ] On a 390px phone the whole page width is visible without pinch-zooming
- [ ] No preview toolbar

Report — `/r/garbage`:
- [ ] Returns 404

Routing — check the thank-you page and report page 16 both branch the same way:

| revenueBand | ownerTier | Expected |
|---|---|---|
| `$3M - $10M` | Owner | 1-on-1 / working session |
| `$500K - $1M` | Owner | Collective |
| `$10M+` | Leadership | **Collective** (authority overrides revenue) |
| `$1M - $3M` | Employee | **Collective** |

---

## REPORT BACK

```
BUILT
  thankyou path:   sha256 match? Y/N   line count:
  report path:     sha256 match? Y/N   line count:
  routes registered:
  PREVIEW = false in both? Y/N

VERIFY
  thank-you (valid token) — each of 6 checks:
  thank-you (bad token)   — each of 6 checks:
  report (valid token)    — each of 10 checks:
  report (bad token) 404? Y/N
  routing table — actual result for each of the 4 rows:

MEASURED
  tallest report page (px):
  report on 390px — full width visible? Y/N

NOT DONE / STOPPED ON

QUESTIONS
```
