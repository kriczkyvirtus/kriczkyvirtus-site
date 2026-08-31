---
name: GitHub push authentication
description: Distinguishes connector API access from local Git transport authentication in this workspace.
---

The attached GitHub connector can access repository APIs, but local HTTPS `git push` still requires valid workspace Source Control credentials.

**Why:** Binding the authorized GitHub connector did not change Git or GitHub CLI authentication, and repeated pushes were rejected as an invalid username or token.

**How to apply:** Use the connector for GitHub API operations. For an actual Git push, confirm Source Control authentication is active before retrying; never request or expose a personal access token in chat.