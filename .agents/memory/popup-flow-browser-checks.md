---
name: Popup-flow browser checks
description: Distinguish unresolved test interception from a failing new-tab checkout flow
---

When a browser test sees a blank payment tab and a form stuck in a sending state, first determine whether its intercepted capture request actually returned a response. A captured network request alone does not establish that a route handler fulfilled it.

**Why:** In a workshop checkout check, a browser route intercept observed the POST but did not resolve the fetch, leaving the deliberately pre-opened tab blank. An immediate synthetic fetch response confirmed that the app populated the new tab with the checkout URL on success. The test setup, not the redirect code, caused the misleading failure.

**How to apply:** For critical capture-before-checkout flows, separate the request-payload check from a controlled success-response check, and report live third-party persistence separately from simulated behavior.