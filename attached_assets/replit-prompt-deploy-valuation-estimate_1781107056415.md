# Replit Agent Prompt — Replace ValuationEstimate Component

## What To Do

Replace the existing `ValuationEstimate.jsx` component with the updated version I'm attaching. This is a full replacement — do NOT merge or patch, just overwrite the entire file.

## Changes in this version:
- Thank-you page completely restructured: calendar is the hero, minimal text above, details below
- Headline changed to "You're Almost Done – Book Your Snapshot Review"
- Body copy shortened to 2 paragraphs above the calendar
- iClosed calendar embed moved above the "what we'll cover" details
- Below calendar: "On your Snapshot Review we will:" + 3 items + 3 numbered steps
- Top-of-page pill removed
- "Get Your Personalized..." headline hidden on thank-you page
- Previous animated checkmark removed

## Steps:

1. **Replace the file.** Overwrite the existing `ValuationEstimate.jsx` (wherever it lives in the components directory) with the attached file. Do not rename it.

2. **Verify the route exists.** The route should already be set up from the previous deployment:
   ```jsx
   <Route path="/valuation-estimate" element={<ValuationEstimate />} />
   ```

3. **Commit and push.**
   ```bash
   git add .
   git commit -m "update valuation estimate thank-you page"
   git push
   ```

4. **Test after deploy:**
   - Navigate to `/valuation-estimate`
   - Fill in contact info, click Continue
   - Answer all questions through to the end
   - Click Submit
   - Verify the thank-you page shows: headline → 2 short paragraphs → iClosed calendar → details card with bullets and numbered steps
   - Verify the calendar embed loads correctly

## Critical Instructions
- This is a FULL FILE REPLACEMENT — overwrite the entire file, do not merge
- Do NOT change any other files
- Do NOT change the route
- Do NOT modify the file after replacing it
