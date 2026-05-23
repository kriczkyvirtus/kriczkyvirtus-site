# Replit Prompt — Add Constraint Roadmap + Update CTA Links

Paste this into Replit Agent:

---

I need to add the Constraint Roadmap assessment as a new route and update CTA links across the site to open it in a new tab. Here's exactly what to do:

## 1. Add the Constraint Roadmap route

In `src/main.jsx`, add this import at the top with the other imports:
```jsx
import ConstraintRoadmap from './tools/ConstraintRoadmap.jsx'
```

Inside `<Routes>`, add this route:
```jsx
<Route path="/constraint-roadmap" element={<ConstraintRoadmap />} />
```

Create the file `src/tools/ConstraintRoadmap.jsx` — I will provide the complete file contents. **DO NOT modify it in any way.**

## 2. Update Homepage CTA links to open Constraint Roadmap in a new tab

In `src/App.jsx`, find EVERY "Get Your Free Constraint Roadmap" or "Get Your Free Roadmap" button that uses `onClick={scrollToHero}` or `onClick={onPrimary}`.

For each of these buttons, change the onClick to:
```jsx
onClick={() => window.open('/constraint-roadmap', '_blank')}
```

There are approximately 4-5 of these buttons throughout the homepage:
- The GoldBtn in the Nav bar
- The GoldBtn in the HeroSection
- The GoldBtn in the CTAStrip
- The GoldBtn in the FinalCTA section
- Any other "Get Your Free Roadmap" or "Get Your Free Constraint Roadmap" buttons

**Important:** Only change buttons that say "Get Your Free Roadmap" or "Get Your Free Constraint Roadmap". Do NOT change other buttons like "Book Your Free Call" or navigation links.

Also update the mobile nav's GoldBtn the same way.

## 3. Update Resources Hub CTA links

In `src/ResourcesHub.jsx`, find any "Get Your Free Roadmap" or "Get Your Free Constraint Roadmap" buttons.

Change their `href="/constraint-roadmap"` to use an onClick handler instead:
```jsx
onClick={() => window.open('/constraint-roadmap', '_blank')}
```

Remove the `href` prop and add `style={{ cursor: 'pointer' }}` if needed.

## 4. Verify

After making these changes:
- The homepage should look exactly the same
- Clicking any "Get Your Free Constraint Roadmap" button should open `/constraint-roadmap` in a new browser tab
- The Constraint Roadmap assessment should work at `/constraint-roadmap`
- The Resources Hub should still work at `/tools`
- All other links and routes should be unaffected

## DO NOT
- DO NOT modify the ConstraintRoadmap.jsx file I provide
- DO NOT change any styling or layout
- DO NOT remove the `scrollToHero` function (other things may use it)
- DO NOT change any links other than the "Get Your Free Roadmap" / "Get Your Free Constraint Roadmap" buttons
