const crypto = require("crypto");
const { google } = require("googleapis");
const { sendResultsEmail } = require("../lib/email");

let sheetsClient = null;
function getSheets() {
  if (sheetsClient) return sheetsClient;
  const credentials = JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS);
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  sheetsClient = google.sheets({ version: "v4", auth });
  return sheetsClient;
}

const TOOL_TO_TAB = {
  "value-range-estimator": "WMBW",
  "business-independence-blueprint": "BIB",
  "structural-capital-deep-dive": "Structural Capital",
  "customer-capital-deep-dive": "Customer Capital",
  "human-capital-deep-dive": "Human Capital",
  // Short slugs sent by Capital Deep Dive tools via toolSlug prop
  "structural-capital": "Structural Capital",
  "customer-capital": "Customer Capital",
  "human-capital": "Human Capital",
};

// Column I is the Link column for all non-Constraint-Roadmap tool tabs.
// Constraint Roadmap links are written by lead-capture.js (not this file).
// Aggregated tab: Link = column I, Tools Completed = column J.
const LINK_COL = "I";

async function findRowForEmail(rows, email, tabNameFilter) {
  for (let i = rows.length - 1; i >= 1; i--) {
    const row = rows[i];
    if (!row || !row[2]) continue;
    const emailMatch = row[2].toLowerCase() === email.toLowerCase();
    const tabMatch = tabNameFilter == null || row[3] === tabNameFilter;
    if (emailMatch && tabMatch) return i + 1; // 1-indexed sheet row
  }
  return -1;
}

async function updateLinkColumn(email, tool, blobUrl) {
  const sheets = getSheets();
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  const tabName = TOOL_TO_TAB[tool] || tool;

  // ─── Update tool-specific tab ───────────────────────────────────────────────
  try {
    let rows = (await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `'${tabName}'!A:${LINK_COL}`,
    })).data.values || [];

    let targetRow = await findRowForEmail(rows, email, null);

    if (targetRow === -1) {
      // Race condition: store-results may have run before lead-capture finished.
      // Wait 3 seconds and retry once.
      console.warn(`[Store→Sheets] No row for ${email} in "${tabName}" — retrying in 3s`);
      await new Promise(resolve => setTimeout(resolve, 3000));
      rows = (await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `'${tabName}'!A:${LINK_COL}`,
      })).data.values || [];
      targetRow = await findRowForEmail(rows, email, null);
    }

    if (targetRow > 0) {
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `'${tabName}'!${LINK_COL}${targetRow}`,
        valueInputOption: "USER_ENTERED",
        requestBody: { values: [[blobUrl]] },
      });
      console.log(`[Store→Sheets] Updated Link in "${tabName}" row ${targetRow} → ${blobUrl}`);
    } else {
      console.error(`[Store→Sheets] Retry failed: still no row for ${email} in "${tabName}"`);
    }
  } catch (err) {
    console.error(`[Store→Sheets] Failed to update "${tabName}" Link:`, err.message);
  }

  // ─── Update Aggregated tab ───────────────────────────────────────────────────
  // Search by email + empty Link column (col I, index 8) rather than by tool
  // name — avoids mismatches when TOOL_TO_TAB produces slightly different
  // strings than what appendLead wrote into the Tool column.
  function findAggRow(rows) {
    for (let i = rows.length - 1; i >= 1; i--) {
      const r = rows[i];
      if (r && r[2] && r[2].toLowerCase() === email.toLowerCase()
          && (!r[8] || r[8].trim() === "")) {
        return i + 1; // 1-indexed
      }
    }
    return -1;
  }

  try {
    let aggRows = (await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `'Aggregated'!A:J`,
    })).data.values || [];

    console.log(`[Store→Sheets] Searching Aggregated for email="${email}", tabName="${tabName}"`);
    console.log(`[Store→Sheets] Aggregated has ${aggRows.length} rows`);

    let aggTargetRow = findAggRow(aggRows);

    if (aggTargetRow === -1) {
      console.warn(`[Store→Sheets] No row for ${email} in "Aggregated" — retrying in 3s`);
      await new Promise(resolve => setTimeout(resolve, 3000));
      aggRows = (await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `'Aggregated'!A:J`,
      })).data.values || [];
      aggTargetRow = findAggRow(aggRows);
    }

    if (aggTargetRow > 0) {
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `'Aggregated'!${LINK_COL}${aggTargetRow}`,
        valueInputOption: "USER_ENTERED",
        requestBody: { values: [[blobUrl]] },
      });
      console.log(`[Store→Sheets] Updated Link in "Aggregated" row ${aggTargetRow}`);
    } else {
      console.error(`[Store→Sheets] Retry failed: still no row for ${email} in "Aggregated"`);
    }
  } catch (err) {
    console.error(`[Store→Sheets] Failed to update "Aggregated" Link:`, err.message);
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email, tool, html } = req.body;

    if (!name || !email || !tool || !html) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const { put } = await import("@vercel/blob");

    const raw = `${email}-${tool}-${Date.now()}`;
    const id = crypto.createHash("sha256").update(raw).digest("hex").slice(0, 12);
    const nameSlug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    const blob = await put(`results/${tool}/${nameSlug}-${id}.html`, html, {
      access: "public",
      contentType: "text/html; charset=utf-8",
      addRandomSuffix: false,
      contentDisposition: "inline",
    });

    console.log(`[Store] ${tool}: ${name} <${email}> — ${Math.round(html.length / 1024)}KB — ${blob.url}`);

    // Await the Sheets update before returning so the serverless function stays
    // alive until the write completes (fire-and-forget gets killed on response).
    try {
      await updateLinkColumn(email, tool, blob.url);
    } catch (err) {
      console.error("[Store→Sheets] updateLinkColumn failed:", err);
    }

    // Send results email with the blob URL
    try {
      await sendResultsEmail({ name, email, tool, resultsUrl: blob.url });
    } catch (emailErr) {
      console.error("[Email] sendResultsEmail failed:", emailErr);
    }

    return res.status(200).json({ success: true, url: blob.url });

  } catch (err) {
    console.error("[Store] Failed:", err);
    return res.status(500).json({ error: "Storage failed" });
  }
};
