---
name: VSL codec testing
description: How to interpret automated-browser playback failures for the Reinvest or Harvest VSL.
---

Do not treat playback failure in the automated Chromium tester as proof that the Reinvest or Harvest MP4 is invalid. Confirm file integrity and serving separately, then use a physical target browser for playback acceptance.

**Why:** The tester reports unsupported H.264/AAC codecs for the supplied web video even when the asset URL succeeds, the MP4 fully decodes with media tools, and its fast-start atom order is valid.

**How to apply:** Use the automated browser for DOM state, controls, overlay, sizing, poster, scheduler, and scroll checks. Verify actual muted autoplay, sound, and inline behavior on real iPhone Safari before high-volume traffic.