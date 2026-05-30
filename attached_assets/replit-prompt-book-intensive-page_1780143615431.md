# Replit Agent Prompt — Add /book-intensive Booking Page

## Context
I'm attaching a new React component (`BookIntensive.jsx`) — a booking page for the Valuation Driver Intensive at `/book-intensive`. This is the page the "Book Your Intensive" CTA in the Pricing section links to.

## What You Need To Do

1. **Add the component file.** Place `BookIntensive.jsx` in the same directory as the other page components (wherever `RoadmapSession.jsx` and the homepage live).

2. **Add the route.** In the app's router (wherever React Router routes are defined), add:
   ```jsx
   <Route path="/book-intensive" element={<BookIntensive />} />
   ```
   Import the component at the top of the file:
   ```jsx
   import BookIntensive from "./BookIntensive"; // adjust path as needed
   ```

3. **Update the "Book Your Intensive" CTA.** In the Pricing section of the homepage, find the "Book Your Intensive" button/link on the Valuation Driver Intensive card. Make two changes:
   - Change the button text from "Book Your Intensive" to "Book Free Fit Call First"
   - Update its `href` to point to `/book-intensive`

4. **Verify the page loads.** Navigate to `/book-intensive` in the browser. You should see a dark-themed page with green accents, a guarantee callout, five "What's included" cards, Edward's headshot, and a calendar placeholder.

5. **Do NOT modify the component code.** The JSX, styling, and layout are final. The iClosed embed will be configured separately.

## Critical Instructions
- Do NOT restructure, refactor, or "improve" any code in the component.
- Do NOT change any design tokens, colors, fonts, or spacing.
- Do NOT add any new dependencies.
- Do NOT modify any other existing pages or components (except updating the CTA link in the Pricing section).
- This is a new route addition — one new file, one new route entry, one CTA link update.
