---
name: Fine-pointer browser checks
description: Why headless browser mouse events alone do not validate fine-pointer-gated effects
---

Headless Chromium may report `(hover: hover) and (pointer: fine)` as false, even when CDP mouse movement and CSS hover work. A cursor effect gated on that media query will correctly remain inert under default headless conditions.

**Why:** Mouse event delivery and media-query pointer capabilities are distinct. An effect appeared inactive in automation despite working code because the browser advertised no fine pointer.

**How to apply:** Check the media-query result first. To exercise a fine-pointer-only effect, emulate or override the query before page scripts mount; test the unmodified media query separately for touch/no-pointer behavior. Label the simulated path honestly, and do not infer a real-device defect from default headless behavior alone.