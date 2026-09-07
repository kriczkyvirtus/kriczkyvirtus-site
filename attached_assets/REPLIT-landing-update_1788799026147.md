# REPLIT — LANDING PAGE UPDATE

Small update to `ReinvestHarvestLanding.jsx`. Not part of Prompt 4 — do this first, or after, but keep it separate from the QA pass.

**Uploaded:** `reinvest-harvest-landing.jsx`

---

## THIS FILE CAN BE OVERWRITTEN

Unlike the flow, thank-you and report components, **the landing page is still reference-owned** — you copied it byte-identical and made no changes to it. So this one is a straight replacement.

```
Copy to:  artifacts/kriczky-virtus/src/tools/ReinvestHarvestLanding.jsx
sha256:   0ba832c3f32a9baaaf396cc3a7aa1572feb7201eae15fecf9591f83cf2414ce1
bytes:    36,477
lines:    471
```

Verify the hash at the new path before pushing.

⛔ If your current `ReinvestHarvestLanding.jsx` does **not** hash to `45ac65510f0941dc57ff4c1f1fa23274a681a1f00bdc8775dbb7d8ab303b9a63`, stop and report — something changed it since Prompt 2 and a straight overwrite would discard that change.

---

## WHAT CHANGED, AND WHY

**1 · Registered mark on the bio.** It was 10px at `-0.5em` with no weight, which floated it high and thin. Now matches the treatment used elsewhere: `fontSize: 10, fontWeight: 600, top: "-0.45em", marginLeft: 1`, and the character is the `&#174;` entity rather than a literal.

**2 · Headline scales properly on desktop.** Was capped at 44px inside a 680px column, so it stacked to four lines and read small on a wide screen. Now `clamp(29px, 5.4vw, 56px)` in an 880px measure — three lines at 1280px, unchanged at mobile.

**3 · The page wrapper is now 940px, and body sections re-narrow to 680px.** A new `.col` class is applied to every section below the hero. Only the hero uses the full width — body copy at 940px is uncomfortably wide.

**4 · Sub-headline is bigger and wraps better.** `clamp(15px, 2vw, 19px)`, up from a flat 15px. Each clause is now its own block element, so a narrow screen wraps *inside* a clause instead of orphaning "compound." onto a line of its own.

---

## VERIFY

- [ ] Hash matches at the new path
- [ ] Headline is 3 lines at 1280px, not 4
- [ ] Sub-headline is 2 lines at 1280px
- [ ] No horizontal overflow at 390px, 783px, 1024px, 1280px
- [ ] The video, sample card, barbell and every section below the hero still sit in the narrower column — only the hero is full width
- [ ] Barbell still visible with gold left plates and green right plates
- [ ] The ® renders at the right size and baseline in the bio
- [ ] Production build passes

Then commit and push, and report the commit SHA and Vercel result.

---

## REPORT BACK

```
LANDING UPDATE
  pre-overwrite hash matched 45ac6551…?  Y/N
  new hash matches 0ba832c3…?  Y/N
  headline lines at 1280px:
  sub-headline lines at 1280px:
  horizontal overflow at 390 / 783 / 1024 / 1280:
  barbell visible?  Y/N
  build:  PASS / FAIL
  commit SHA:
  Vercel:
```
