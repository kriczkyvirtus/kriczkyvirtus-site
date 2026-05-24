# Replit Prompt — Update All 6 Tool Files (Remove Mailto, Add Silent Retry)

Paste this into Replit Agent:

---

I need to update 6 tool files with new versions that replace the old email fallback system with a silent retry queue. I will provide the complete updated file contents for each one. **Replace the ENTIRE contents of each file — do not merge or diff, just overwrite.**

## Files to update

1. `src/tools/WMBW.jsx` — I will provide the complete new file
2. `src/tools/BIB.jsx` — I will provide the complete new file
3. `src/tools/HumanCapital.jsx` — I will provide the complete new file
4. `src/tools/CustomerCapital.jsx` — I will provide the complete new file
5. `src/tools/StructuralCapital.jsx` — I will provide the complete new file
6. `src/tools/ConstraintRoadmap.jsx` — I will provide the complete new file

## What changed in these files

The only change is in the error handling when the lead capture API fails:
- **Removed:** `mailto:` popup that opened a draft email on the visitor's computer
- **Added:** Silent background retry queue that automatically retries the API call up to 5 times over ~7.5 minutes without any visible effect on the visitor

The visitor's experience is unchanged — their results unlock immediately regardless of whether the API succeeds or fails.

## Instructions

For each file:
1. Open the file in the editor
2. Select all (Ctrl+A / Cmd+A)
3. Delete everything
4. Paste the new contents I provide
5. Save

## CRITICAL

- **DO NOT modify any of the files I provide**
- **DO NOT refactor, split, or "improve" any code**
- **DO NOT change any imports, styling, or logic**
- **DO NOT rename the files** — keep the exact same filenames they currently have
- The files are complete and self-contained — just paste and save

## Verify

After updating all 6 files:
- Each tool should still render correctly at its route
- The email gate should still appear after answering all questions
- Submitting name + email should still unlock results
- There should be NO mailto popup or draft email window when testing
- Check the browser console — you should see `[Virtus] API failed, queuing silent retry` if the API endpoint isn't deployed yet, followed by retry attempts every 30 seconds

---

I will now provide the 6 files one at a time. Please update each file as I provide it.
