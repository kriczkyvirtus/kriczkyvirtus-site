---
name: Managed workflow port conflicts
description: Port-in-use failures may be caused by orphaned prior managed server processes
---

When a managed artifact workflow fails because its port is already in use, do not assume the application has a bad port setting. Check whether a prior instance of the same managed service is still listening.

**Why:** Both the web and API managed workflows reported startup failures while the older web and API processes continued to serve their assigned ports. Restarting without clearing those stale instances reproduced the conflict.

**How to apply:** Inspect the listener and its process ancestry first. If it belongs to a stale instance of the same service, stop only that instance and restart the existing managed workflow. Do not create a duplicate workflow or change the artifact port configuration.