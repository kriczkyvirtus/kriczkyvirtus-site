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
