---
name: Reinvest or Harvest component ownership
description: Records which funnel components are authoritative in the repository rather than in uploaded references.
---

The Reinvest or Harvest flow, thank-you, and report components are repository-owned. Do not overwrite them from future uploads; stop and report the conflict instead. The landing page may still be reference-owned when a brief explicitly supplies and validates a replacement hash.

**Why:** Production wiring and QA corrected real defects in the supplied flow/report references, so later reference copies are no longer authoritative for those components.

**How to apply:** Treat uploads for the flow, thank-you, or report as comparison material only unless the user explicitly changes ownership. Preserve the current repository versions and their production behavior.