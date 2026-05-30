# Replit Agent Prompt — Fix Cross-Page Anchor Link Scrolling

## Problem
When a visitor is on any page other than the homepage (e.g. `/tools`, `/roadmap-session`, `/book-intensive`) and clicks a nav or footer anchor link like `/#pricing` or `/#how-it-works`, React Router navigates to the homepage but does NOT scroll to the target section. It just shows the top of the page (hero section) even though the URL has the correct `#` fragment.

This happens because React Router changes the route and renders the homepage component, but the browser's hash scroll fires before the target element exists in the DOM.

## Fix

### Step 1: Install react-router-hash-link

```bash
pnpm add react-router-hash-link
```

### Step 2: Replace anchor tags with HashLink

In the Nav component and Footer component (and anywhere else that links to homepage sections using `#` anchors), replace standard `<a href="/#section">` tags with `<HashLink>` components:

```jsx
import { HashLink } from 'react-router-hash-link';

// Before:
<a href="/#pricing">Pricing</a>

// After:
<HashLink smooth to="/#pricing">Pricing</HashLink>
```

The `smooth` prop adds smooth scrolling. `HashLink` handles waiting for the target element to exist before scrolling to it.

### Step 3: Also fix same-page hash links

For links that are already on the homepage (like nav links when you're viewing the homepage), the same `HashLink` component works — it will smooth-scroll to the section without a page reload.

### Important Notes

- `HashLink` accepts the same props as React Router's `Link` component, so you can pass `style`, `className`, `onClick`, etc. exactly as before.
- Only replace links that point to `#` anchors on the homepage. Links to other pages like `/tools` or `/roadmap-session` should stay as regular `<Link>` or `<a>` tags.
- Do NOT change any styling, layout, or other functionality. This is purely a behavioral fix for scroll targeting.
- If any links use `onClick` handlers that call `scrollIntoView` manually, those can be simplified to just use `HashLink` instead.
