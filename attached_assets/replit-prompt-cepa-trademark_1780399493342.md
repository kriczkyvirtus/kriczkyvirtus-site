# Replit Agent Prompt — Add ® Symbol After CEPA

## What To Change

In the Constraint Roadmap template file (`ConstraintRoadmap-v5.jsx` or its compiled equivalent in `shared/`), find this exact text on **line 3083** (the closing page / page 14):

```
Edward Kriczky, CEPA
```

Change it to:

```
Edward Kriczky, CEPA®
```

Use the actual Unicode registered trademark symbol `®` (Unicode U+00AE), NOT `(R)`.

There is also a second instance around **line 2137** that says:

```
Edward Kriczky, CEPA · Founder
```

Change that to:

```
Edward Kriczky, CEPA® · Founder
```

## After updating the source file
If the project uses a pre-compiled version of this template (e.g. `shared/ConstraintRoadmap-v5.compiled.js`), the compile script needs to re-run during the next build to pick up this change. No manual recompilation needed — the Vercel build command already runs the compile step.

## Critical Instructions
- Only change `CEPA` to `CEPA®` in these two locations
- Use the actual `®` character, not `(R)` or `&reg;`
- Do NOT change anything else in the file
