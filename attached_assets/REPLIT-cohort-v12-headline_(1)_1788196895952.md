# Replit prompt — Cohort.jsx v12 (headline, restores lost styling)

v10 was applied even though its find-string did not match. The block it pasted
carried styling from a stale reference, which overwrote the hero's real design.
This restores it and applies the headline fix correctly, in one edit.

**What v10 wrongly changed:** `fontWeight` 400 → 700, added
`textTransform: "uppercase"`, `letterSpacing` −0.02em → 0.01em, `lineHeight`
1.08 → 1.05, and dropped `fontStyle: "italic"` from the gold span.

---

## THE CHANGE — one block

FIND (this is the current state of the file):
```jsx
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: mob ? "clamp(24px, 9.2vw, 34px)" : 52, color: C.text1, textTransform: "uppercase", letterSpacing: "0.01em", lineHeight: 1.05, margin: "0 0 20px" }}>
            Nine other owners at your{mob ? <br /> : " "}
            <span style={{ whiteSpace: mob ? "nowrap" : "normal" }}>stage{mob ? " " : <br />}<span style={{ color: C.gold }}>who get it.</span></span>
          </h1>
```

REPLACE:
```jsx
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: mob ? "clamp(22px, 8.8vw, 34px)" : 52, color: C.text1, letterSpacing: "-0.02em", lineHeight: 1.08, margin: "0 0 20px" }}>
            Nine other owners at your{mob ? <br /> : " "}
            <span style={{ whiteSpace: mob ? "nowrap" : "normal" }}>stage{mob ? " " : <br />}<span style={{ color: C.gold, fontStyle: "italic" }}>who get it.</span></span>
          </h1>
```

This restores weight 400, the italic gold, −0.02em tracking, 1.08 line-height and
no uppercase transform, and corrects the clamp to the value measured for that
typography.

**If the find-string does not match, stop and paste the exact current block. Do
not apply an equivalent edit.** That instruction caused the problem being fixed
here.

---

## SCOPE

Nothing else changes. Not `C`, `CARD`, `inputStyle`, any component, any array,
the pill badge above the headline, the pricing section, the form, the payload, or
any other file.

---

## VERIFICATION

```
grep -c "clamp(22px, 8.8vw, 34px)" Cohort.jsx          → 1
grep -c 'fontStyle: "italic"' Cohort.jsx               → 4
grep -c "clamp(24px, 9.2vw, 34px)" Cohort.jsx          → 0
grep -c 'textTransform: "uppercase"' Cohort.jsx        → 7
grep -c 'letterSpacing: "-0.02em"' Cohort.jsx          → 1
```

The uppercase count is **7**, not 6 — other elements legitimately use it. If it
returns 8, the h1's transform was not removed.

Then check at 320px, 360px and 390px: two lines, "Nine other owners at your" and
"stage who get it." Desktop unchanged at size 52 with "who get it." alone on line
two, in italic gold.

---

## AFTER THE EDIT — push

`git log --oneline -5` shows HEAD two commits ahead of `origin/main`. Nothing
since the v9 commit has reached GitHub, so Vercel has not built it.

Commit this change, then **push to `origin/main`** and confirm `origin/HEAD`
moves to the new commit. Report `git log --oneline -3` afterwards so the push can
be confirmed.
