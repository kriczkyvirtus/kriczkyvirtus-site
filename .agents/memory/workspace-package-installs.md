---
name: Workspace package installs
description: Why the generic Node package installer fails when an artifact needs a dependency
---

For dependencies owned by one artifact in this pnpm workspace, use a filtered pnpm add command targeting that artifact rather than the generic Node package installer. Keep the version exact when requested.

**Why:** The generic installer ran a root-level pnpm add and failed the workspace-root guard even though the dependency belonged to an artifact. Its module setup also changed workspace configuration independently of the requested package; inspect that configuration and remove incidental changes before committing.

**How to apply:** When a future request adds an artifact-specific package, check the artifact's package manifest and use pnpm's artifact filter if the generic installer cannot target it.