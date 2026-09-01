# Replit prompt — add the Disclosures page

Reference file attached: `Disclosures.jsx` (275 lines). Copy it verbatim; do not
retype or reformat it.

---

# TASK: add a new `/disclosures` page

This is a **new page**. It does not modify `Cohort.jsx` or any existing
component, and it adds no dependencies.

## SCOPE

**DO NOT:**
- Modify `Cohort.jsx` or any other existing page or component
- Modify any shared style file, token file, or config
- Install any package
- Change the site footer, header, or navigation unless Step 3 is explicitly
  approved (see below)

The new page is deliberately self-contained. It declares its own copies of `C`,
`GRAIN`, `useBp`, `Grain`, `Shield`, `CARD`, `H`, `Eyebrow` and `P`, matching
`Cohort.jsx` exactly. **Do not refactor these into a shared module.** That would
mean editing `Cohort.jsx`, which is out of scope for this task.

---

## STEP 1 — create the file

Create `artifacts/kriczky-virtus/src/Disclosures.jsx` with the exact contents of
the attached `Disclosures.jsx`.

Copy it byte-for-byte. Do not reformat, re-indent, reorder, "clean up", convert
quotes, or alter any unicode escape sequence. The file already compiles.

---

## STEP 2 — register the route

Find where `Cohort.jsx` is registered as a route (whatever router this project
uses) and add an equivalent entry:

- Path: `/disclosures`
- Component: the default export of `Disclosures.jsx`

Mirror the existing pattern exactly — same import style, same route syntax, same
file. **Do not introduce a router, change the router, or alter any existing
route.**

If `/cohort` is registered somewhere non-obvious, report where you found it
before editing.

---

## STEP 3 — footer link (only if approved)

**Do not do this unless explicitly confirmed.** If approved: add a text link
reading `Disclosures` pointing to `/disclosures`, in the site's global footer,
styled to match the existing footer links.

Add nothing else to the footer. In particular, do **not** add a Form ADV link or
any advisory-firm reference to the global footer — that reference belongs only
inside the disclosures page, and the page explains why.

---

## VERIFICATION

```
test -f artifacts/kriczky-virtus/src/Disclosures.jsx && echo EXISTS
grep -c "export default function Disclosures" artifacts/kriczky-virtus/src/Disclosures.jsx   → 1
grep -c "Kriczky Wealth Management, LLC" artifacts/kriczky-virtus/src/Disclosures.jsx        → 0
grep -c "kriczkywealth.com/disclosures" artifacts/kriczky-virtus/src/Disclosures.jsx         → 1
grep -c 'id: "' artifacts/kriczky-virtus/src/Disclosures.jsx                                 → 11
wc -l artifacts/kriczky-virtus/src/Disclosures.jsx                                           → 275
```

The comma check matters: `Kriczky Wealth Management LLC` has **no** comma;
`Kriczky Virtus, LLC` has one. Both legal names appear exactly once each.

Then confirm:

- `git diff --stat` shows **one new file** plus **one modified router file**, and
  nothing else
- The build passes
- `/disclosures` renders at both desktop and mobile widths
- `/cohort` still renders correctly and is unchanged
- The KWM link opens `https://www.kriczkywealth.com/disclosures` in a new tab

---

## STEP 4 — commit and push

Commit and **push to `origin/main`**. Then run `git log --oneline -3` and confirm
`origin/main` has moved to the new commit.

Git credentials in this workspace have failed before, committing locally while
the remote stayed behind. If the push fails, say so explicitly rather than
reporting the task complete.
