# Replit Agent Prompt — Pre-compile JSX to Remove Babel Runtime Dependency

## Problem
The Vercel serverless function (`api/lead-capture.js`) uses `@babel/register` to compile JSX at runtime, but pnpm's strict module isolation on Vercel prevents `@babel/core` from finding `@babel/preset-react`. Hoisting workarounds haven't solved this. We need to eliminate the Babel runtime dependency entirely.

## Solution
Pre-compile the JSX file to plain JavaScript during the Vercel build step, so the serverless function can `require()` it directly without any Babel transpilation at runtime.

## What You Need To Do

### Step 1: Add a pre-compile script
Create a file at the repo root called `scripts/compile-shared.js`:

```javascript
const { transformFileSync } = require("@babel/core");
const fs = require("fs");
const path = require("path");

const input = path.join(__dirname, "..", "shared", "ConstraintRoadmap-v5.cjs.jsx");
const output = path.join(__dirname, "..", "shared", "ConstraintRoadmap-v5.compiled.js");

if (!fs.existsSync(input)) {
  console.log("[compile-shared] No JSX file found at", input, "— skipping");
  process.exit(0);
}

console.log("[compile-shared] Compiling JSX to plain JS...");
const result = transformFileSync(input, {
  presets: ["@babel/preset-react"],
});

fs.writeFileSync(output, result.code);
console.log("[compile-shared] Done:", output, `(${Math.round(result.code.length / 1024)}KB)`);
```

### Step 2: Update the Vercel build command
In `vercel.json`, update the `buildCommand` (or if it's set in the Vercel dashboard, update it there) to run the compile script before the frontend build:

If the build command is currently:
```
pnpm --filter @workspace/kriczky-virtus build
```

Change it to:
```
node scripts/compile-shared.js && pnpm --filter @workspace/kriczky-virtus build
```

**Important:** If the build command is set in the Vercel dashboard (Settings → General → Build & Development Settings) rather than in `vercel.json`, update it there instead. Check both places — the dashboard setting overrides `vercel.json`.

### Step 3: Update `api/lead-capture.js`
Remove all Babel references and require the pre-compiled file instead.

Find and DELETE these lines (they may be near the top of the handler or inside the try block):

```javascript
require("@babel/register")({
  presets: ["@babel/preset-react"],
  extensions: [".jsx"],
  only: [/shared/],
});
```

Find the line that requires the JSX template:

```javascript
const ConstraintRoadmap = require(path.join(__dirname, "..", "shared", "ConstraintRoadmap-v5.cjs.jsx"));
```

Replace it with:

```javascript
const ConstraintRoadmap = require(path.join(__dirname, "..", "shared", "ConstraintRoadmap-v5.compiled.js"));
```

The full updated `api/lead-capture.js` should have NO references to `@babel/register`, `@babel/preset-react`, or any `.jsx` file. It only requires `.js` files.

### Step 4: Verify the compiled file is not gitignored
Make sure `shared/ConstraintRoadmap-v5.compiled.js` is NOT in `.gitignore`. It needs to exist after the build step runs on Vercel. Since it's generated during the build (not committed to git), Vercel's build will create it fresh each deploy.

Actually — since the compile happens during the Vercel build and the output needs to be available to the serverless function, the compiled file needs to be in the file system at deploy time. Vercel's build step runs before packaging the serverless functions, so this should work automatically.

### Step 5: Test locally (optional)
You can verify the compile script works by running in Replit Shell:

```bash
node scripts/compile-shared.js
```

It should output something like:
```
[compile-shared] Compiling JSX to plain JS...
[compile-shared] Done: /home/runner/workspace/shared/ConstraintRoadmap-v5.compiled.js (185KB)
```

Then check that the file was created:
```bash
ls -la shared/ConstraintRoadmap-v5.compiled.js
```

### Step 6: Push and test
```bash
git add .
git commit -m "pre-compile JSX for serverless function - remove babel runtime dep"
git push
```

Wait for Vercel to deploy. Check the build logs — you should see the `[compile-shared]` messages before the frontend build starts. Then run through the assessment again.

## Critical Instructions
- Do NOT remove `@babel/core` or `@babel/preset-react` from the project dependencies — they're still needed at BUILD time by the compile script. They just won't be needed at RUNTIME by the serverless function.
- Do NOT modify `shared/ConstraintRoadmap-v5.cjs.jsx` or `shared/constraints-final.cjs.js` — only the serverless function and the build process change.
- Do NOT modify any frontend code.
- The `scripts/compile-shared.js` file runs during Vercel's build step, BEFORE the serverless function is packaged. The compiled output file will be available to the function at runtime.
