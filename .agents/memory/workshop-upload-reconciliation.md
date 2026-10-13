---
name: Workshop upload reconciliation
description: Reconcile successive supplied workshop page revisions with verified current behavior
---

Treat a supplied workshop page file as the requested change set, not automatically as the whole source of truth. Diff it against the current working page and preserve verified fixes that the supplied file accidentally reverts.

**Why:** Successive uploads have included stale image paths and an older flip-card shadow rule that would restore visible defects, even while adding the next requested feature. The related briefs explicitly ask for a diff first.

**How to apply:** Before replacing workshop page code, compare the uploaded file with the live source. Apply its requested changes while retaining independently verified fixes, then check that the remaining diff against the upload consists only of intentional preservation.