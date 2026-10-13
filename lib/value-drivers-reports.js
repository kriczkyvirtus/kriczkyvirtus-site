// lib/value-drivers-reports.js
// Stores each Value Drivers result as JSON in Vercel Blob, keyed by an
// unguessable token, so the emailed report link and both next pages can
// read it back. Same pattern as lib/reinvest-harvest-reports.js, separate
// prefix so the two tools' reports never collide.
const { randomBytes } = require("crypto");

const PREFIX = "value-drivers";
const makeReportToken = () => randomBytes(16).toString("base64url");

async function writeReport(report) {
  const { put } = await import("@vercel/blob");
  return put(`${PREFIX}/${report.token}.json`, JSON.stringify(report), {
    access: "public",
    contentType: "application/json; charset=utf-8",
    addRandomSuffix: false,
    allowOverwrite: false,
  });
}

async function readReport(token) {
  if (!/^[A-Za-z0-9_-]{16,64}$/.test(token)) return null;
  const { get } = await import("@vercel/blob");
  const result = await get(`${PREFIX}/${token}.json`, { access: "public" });
  if (!result || result.statusCode !== 200) return null;
  return JSON.parse(await new Response(result.stream).text());
}

module.exports = { makeReportToken, writeReport, readReport };
