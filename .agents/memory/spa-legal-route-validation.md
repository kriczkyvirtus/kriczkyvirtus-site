---
name: SPA legal-route validation
description: How to verify legal-link destinations before publishing consent notices.
---

Do not treat an HTTP 200 response as proof that a Privacy Policy, Terms of Service, or other legal page exists in this SPA. Confirm that the destination is implemented in the application router.

**Why:** The catch-all hosting rewrite serves the SPA entry document for undefined paths, so missing routes can return 200 while rendering no matching page. The user confirmed this validation approach after it prevented broken consent links.

**How to apply:** Before adding a legal link, inspect the router and then verify the rendered destination. If no real route exists, stop and ask whether to use plain text, an existing legal page, or create a new route.