# Replit Agent Prompt — Add /roadmap-session Booking Page

## Context
I'm attaching a new React component (`RoadmapSession.jsx`) — a booking page for the Constraint Working Session at `/roadmap-session`. This is the page all CTA buttons in the Constraint Roadmap link to.

## What You Need To Do

1. **Add the component file.** Place `RoadmapSession.jsx` in the same directory as the other page components (wherever the homepage and assessment components live — likely `src/pages/` or `src/components/` or `src/`).

2. **Add the route.** In the app's router (likely `App.jsx` or wherever React Router routes are defined), add:
   ```jsx
   <Route path="/roadmap-session" element={<RoadmapSession />} />
   ```
   Import the component at the top of the file:
   ```jsx
   import RoadmapSession from "./RoadmapSession"; // adjust path as needed
   ```

3. **Verify the page loads.** Navigate to `/roadmap-session` in the browser. You should see a dark-themed page with a gold accent, Edward's headshot, three "What we'll cover" cards, and a calendar placeholder area.

4. **Do NOT modify the component code.** The JSX, styling, and layout are final. The only thing that will change later is the iClosed embed configuration at the top of the component — I'll handle that myself after setting up the iClosed event.

## Critical Instructions
- Do NOT restructure, refactor, or "improve" any code in the component.
- Do NOT change any design tokens, colors, fonts, or spacing.
- Do NOT add any new dependencies — this component uses only React (useState, useEffect) which is already installed.
- Do NOT modify any other existing pages or components.
- This is a new route addition only — one new file, one new route entry.

## iClosed Embed Note
The component has a placeholder for the iClosed calendar embed. There are two variables at the top of the `useEffect` hook:
- `ICLOSED_SCRIPT_URL`
- `ICLOSED_DATA_URL`

These are intentionally empty strings right now. I will configure them after creating the event in iClosed. Do NOT try to set these up — leave them as empty strings.
