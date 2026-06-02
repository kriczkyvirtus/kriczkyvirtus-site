# Replit Agent Prompt — Fix Homepage Favicon on Mobile

## Problem
Every page on the site shows the correct favicon on mobile EXCEPT the homepage. The homepage either shows a default/generic favicon or no favicon at all.

## Fix
Find the favicon that the other pages use (likely in `public/favicon.ico`, `public/favicon.png`, or referenced in `index.html`). Then make sure the homepage uses the same one.

Common causes:
1. The `index.html` has a `<link rel="icon">` tag that points to a file that doesn't exist or has the wrong path
2. The homepage route overrides the favicon somehow
3. There are multiple `index.html` files and the one serving the homepage has a different or missing favicon reference

### Steps:
1. Find where the favicon is defined — check `index.html` (or `artifacts/kriczky-virtus/index.html`) for a `<link rel="icon" ...>` tag
2. Check `public/` for favicon files (`favicon.ico`, `favicon.png`, `favicon.svg`)
3. If the favicon tag exists but the file path is wrong, fix the path
4. If the favicon tag is missing from the homepage's HTML, add it matching what the other pages use
5. Make sure the favicon file is in the correct `public/` directory so it gets deployed

If the other pages set their favicon dynamically via JavaScript (e.g. using `document.querySelector('link[rel="icon"]').href = ...`), apply the same logic to the homepage component.

## Critical Instructions
- Do NOT change the favicon file itself — just make sure the homepage references the same one all other pages use
- Do NOT change any page content or styling
- Test on mobile after deploying — the homepage should show the same favicon as every other page
