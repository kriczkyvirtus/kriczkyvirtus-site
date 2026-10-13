---
name: GitHub push authentication
description: Distinguishes connector API access from local Git transport authentication in this workspace.
---

The attached GitHub connector can access repository APIs, but local HTTPS `git push` still requires valid workspace Source Control credentials.

**Why:** Binding the authorized GitHub connector did not change Git or GitHub CLI authentication, and repeated pushes were rejected as an invalid username or token.

**How to apply:** Try normal Git once. If authentication fails but the GitHub connector has repository write access, compare the live remote ref to the local base, then replay blobs, trees, and commits through GitHub's Git Data API with tree-hash verification and a non-forced ref update. Never request or expose a personal access token in chat.

When passing local Git listings through CodeExecution's shell callback, trim carriage returns and do not assume tabs survive unchanged. Parse Git blob SHA as a fixed 40-character field, then trim the remaining path. Compare the remote tree against the local product files before publishing: this repository can have parallel, cherry-picked histories whose commit hashes differ despite matching product code.