const { randomBytes } = require("crypto");

const makeReportToken = () => randomBytes(16).toString("base64url");

async function writeReport(report) {
  const { put } = await import("@vercel/blob");
  return put(`reports/${report.token}.json`, JSON.stringify(report), {
    access: "public",
    contentType: "application/json; charset=utf-8",
    addRandomSuffix: false,
    allowOverwrite: false,
  });
}

async function readReport(token) {
  const { get } = await import("@vercel/blob");
  const result = await get(`reports/${token}.json`, { access: "public" });
  if (!result || result.statusCode !== 200) return null;
  return JSON.parse(await new Response(result.stream).text());
}

module.exports = { makeReportToken, writeReport, readReport };