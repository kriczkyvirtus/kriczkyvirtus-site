# Replit prompt — Cohort.jsx v11 (headline, corrected)

**This replaces the v9 and v10 headline instructions. Those never applied.**

The reference file used for v9 and v10 had a different hero than the live file —
uppercase, weight 700, an `Eyebrow` component. The live hero is centred, uses a
pill badge, `fontWeight: 400`, italic gold, and no uppercase transform. The
find-strings therefore never matched, and the headline block is still original.

The real cause of the wrap is not the second line. It is the first: at 34px,
`Nine other owners at your stage` measures about **402px**, wider than any phone
viewport after the container's 20px padding. It wraps, stranding "stage" on line
two, and the hard `<br />` then pushes "who get it." to line three.

---

## THE CHANGE — one block

FIND (exactly as it appears in the live file):
```jsx
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: mob ? 34 : 52, color: C.text1, letterSpacing: "-0.02em", lineHeight: 1.08, margin: "0 0 20px" }}>
            Nine other owners at your stage<br /><span style={{ color: C.gold, fontStyle: "italic" }}>who get it.</span>
          </h1>
```

REPLACE:
```jsx
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: mob ? "clamp(22px, 8.8vw, 34px)" : 52, color: C.text1, letterSpacing: "-0.02em", lineHeight: 1.08, margin: "0 0 20px" }}>
            Nine other owners at your{mob ? <br /> : " "}
            <span style={{ whiteSpace: mob ? "nowrap" : "normal" }}>stage{mob ? " " : <br />}<span style={{ color: C.gold, fontStyle: "italic" }}>who get it.</span></span>
          </h1>
```

Weight, colour, italic, letter-spacing, line-height and margin are all unchanged.
Only the mobile font size and the line-break logic change. Desktop is untouched:
size stays 52, `whiteSpace` resolves to `normal`, the `<br />` still falls after
"stage".

**If this find-string does not match, stop and report the exact current block
rather than editing an equivalent one.**

---

## SCOPE

Change nothing else. Not `C`, `CARD`, `inputStyle`, any component, any array, the
pricing section, the form, the payload, or any other file.

---

## VERIFICATION

```
grep -c "clamp(22px, 8.8vw, 34px)" Cohort.jsx     → 1
grep -c 'whiteSpace: mob ? "nowrap"' Cohort.jsx    → 1
grep -c "fontSize: mob ? 34 : 52" Cohort.jsx       → 0
grep -c "at your stage<br />" Cohort.jsx           → 0
```

Then check at **320px, 360px and 390px**: line one must read "Nine other owners
at your" and line two "stage who get it." — two lines, never three. Desktop must
still show "who get it." alone on line two at size 52.
