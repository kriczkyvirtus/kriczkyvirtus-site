# Replit Agent Prompt — Add /acq-vantage-bonus Landing Page

## Context
I'm attaching a new React component (`AcqVantageBonus.jsx`) — a landing page for ACQ Vantage community members at `/acq-vantage-bonus`.

## What You Need To Do

1. **Add the component file.** Place `AcqVantageBonus.jsx` in the same directory as the other page components.

2. **Add the route.** In the app's router, add:
   ```jsx
   <Route path="/acq-vantage-bonus" element={<AcqVantageBonus />} />
   ```
   Import the component at the top of the file:
   ```jsx
   import AcqVantageBonus from "./AcqVantageBonus"; // adjust path as needed
   ```

3. **Verify the page loads.** Navigate to `/acq-vantage-bonus` in the browser.

4. **Do NOT modify the component code.** The JSX, styling, and layout are final.

## Critical Instructions
- Do NOT restructure, refactor, or "improve" any code in the component.
- Do NOT change any design tokens, colors, fonts, or spacing.
- Do NOT add any new dependencies.
- Do NOT modify any other existing pages or components.
- This is a new route addition — one new file, one new route entry.
