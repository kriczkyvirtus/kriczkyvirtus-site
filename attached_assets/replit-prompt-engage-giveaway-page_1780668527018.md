# Replit Agent Prompt — Add /engage-giveaway-2026 Landing Page

## Context
I'm attaching a new React component (`EngageGiveaway2026.jsx`) — a landing page for Chester County business owners from the Engage Personal Training giveaway at `/engage-giveaway-2026`.

## What You Need To Do

1. **Add the component file.** Place `EngageGiveaway2026.jsx` in the same directory as the other page components (wherever `RoadmapSession.jsx`, `BookIntensive.jsx`, `FreeWorkingSession.jsx`, etc. live).

2. **Add the route.** In the app's router (wherever React Router routes are defined), add:
   ```jsx
   <Route path="/engage-giveaway-2026" element={<EngageGiveaway2026 />} />
   ```
   Import the component at the top of the file:
   ```jsx
   import EngageGiveaway2026 from "./EngageGiveaway2026"; // adjust path as needed
   ```

3. **Verify the page loads.** Navigate to `/engage-giveaway-2026` in the browser. You should see a dark-themed page with a gold pill saying "Chester County Business Owners from the Engage Personal Training Giveaway", a headline about finding out what your business is worth, an iClosed calendar embed, four "What you'll walk away with" cards, Edward's headshot, and the consent text/footer.

4. **Do NOT modify the component code.** The JSX, styling, and layout are final. The iClosed calendar is already embedded via iframe.

## Critical Instructions
- Do NOT restructure, refactor, or "improve" any code in the component.
- Do NOT change any design tokens, colors, fonts, or spacing.
- Do NOT add any new dependencies.
- Do NOT modify any other existing pages or components.
- This is a new route addition — one new file, one new route entry.
