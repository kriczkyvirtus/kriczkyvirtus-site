# Replit Agent Prompt — Add /partner-qualify Booking Page

## Context
I'm attaching a new React component (`PartnerQualify.jsx`) — a qualification booking page for the Clarity Partner and Growth Partner tiers at `/partner-qualify`. This is the page the "See If You Qualify" CTAs in the Pricing section link to.

## What You Need To Do

1. **Add the component file.** Place `PartnerQualify.jsx` in the same directory as the other page components (wherever `RoadmapSession.jsx` and `BookIntensive.jsx` live).

2. **Add the route.** In the app's router (wherever React Router routes are defined), add:
   ```jsx
   <Route path="/partner-qualify" element={<PartnerQualify />} />
   ```
   Import the component at the top of the file:
   ```jsx
   import PartnerQualify from "./PartnerQualify"; // adjust path as needed
   ```

3. **Update the "See If You Qualify" CTAs.** In the Pricing section of the homepage, find both "See If You Qualify" buttons/links (on the Clarity Partner card and the Growth Partner card) and update their `href` to point to `/partner-qualify`.

4. **Verify the page loads.** Navigate to `/partner-qualify` in the browser. You should see a dark-themed page with gold accents, a qualification pill, four "What a partnership looks like" cards, Edward's headshot, and a calendar placeholder.

5. **Do NOT modify the component code.** The JSX, styling, and layout are final. The iClosed embed will be configured separately.

## Critical Instructions
- Do NOT restructure, refactor, or "improve" any code in the component.
- Do NOT change any design tokens, colors, fonts, or spacing.
- Do NOT add any new dependencies.
- Do NOT modify any other existing pages or components (except updating the two CTA links in the Pricing section).
- This is a new route addition — one new file, one new route entry, two CTA link updates.
