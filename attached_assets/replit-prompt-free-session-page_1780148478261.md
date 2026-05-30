# Replit Agent Prompt — Add /free-session Booking Page

## Context
I'm attaching a new React component (`FreeWorkingSession.jsx`) — a booking page for a free Profit Gap / Value Gap working session at `/free-session`. This is the page the "Book Your Free Working Session" CTA on the Resources hub links to.

## What You Need To Do

1. **Add the component file.** Place `FreeWorkingSession.jsx` in the same directory as the other page components (wherever `RoadmapSession.jsx`, `BookIntensive.jsx`, and `PartnerQualify.jsx` live).

2. **Add the route.** In the app's router (wherever React Router routes are defined), add:
   ```jsx
   <Route path="/free-session" element={<FreeWorkingSession />} />
   ```
   Import the component at the top of the file:
   ```jsx
   import FreeWorkingSession from "./FreeWorkingSession"; // adjust path as needed
   ```

3. **Update the CTA on the Resources page.** On the Resources hub page, find the "Book Your Free Call" button in the "See The Gap" section (below the Value Gap Calculator). Make two changes:
   - Change the button text from "Book Your Free Call" to "Book Your Free Working Session"
   - Update its `href` from `/call` to `/free-session`

4. **Verify the page loads.** Navigate to `/free-session` in the browser. You should see a dark-themed page with cyan accents, a "100% Free" pill, four "What you'll walk away with" cards, Edward's headshot, and a calendar placeholder.

5. **Do NOT modify the component code.** The JSX, styling, and layout are final. The iClosed embed will be configured separately.

## Critical Instructions
- Do NOT restructure, refactor, or "improve" any code in the component.
- Do NOT change any design tokens, colors, fonts, or spacing.
- Do NOT add any new dependencies.
- Do NOT modify any other existing pages or components (except updating the CTA text and link on the Resources hub page).
- This is a new route addition — one new file, one new route entry, one CTA text + link update.
