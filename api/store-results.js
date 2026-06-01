const crypto = require("crypto");
const { google } = require("googleapis");

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
};

async function updateLinkColumn(email, tool, blobUrl) {
  try {
    const sheets = getSheets();
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    const tabName = TOOL_TO_TAB[tool] || tool;

    // Find most recent row in tool tab matching this email
    const readResult = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `'${tabName}'!A:I`,
    });
    const rows = readResult.data.values || [];
    let targetRowIndex = -1;
    for (let i = rows.length - 1; i >= 1; i--) {
      if (rows[i][2] && rows[i][2].toLowerCase() === email.toLowerCase()) {
        targetRowIndex = i;
        break;
      }
    }

    if (targetRowIndex === -1) {
      console.log(`[Store→Sheets] No row found for ${email} in "${tabName}" — skipping link update`);
    } else {
      const sheetRow = targetRowIndex + 1;
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `'${tabName}'!I${sheetRow}`,
        valueInputOption: "USER_ENTERED",
        requestBody: { values: [[blobUrl]] },
      });
      console.log(`[Store→Sheets] Updated Link in "${tabName}" row ${sheetRow} for ${email}`);
    }

    // Also update Aggregated tab
    const aggResult = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "'Aggregated'!A:J",
    });
    const aggRows = aggResult.data.values || [];
    let aggTargetRow = -1;
    for (let i = aggRows.length - 1; i >= 1; i--) {
      if (
        aggRows[i][2] && aggRows[i][2].toLowerCase() === email.toLowerCase() &&
        aggRows[i][3] === tabName
      ) {
        aggTargetRow = i;
        break;
      }
    }
    if (aggTargetRow !== -1) {
      const aggSheetRow = aggTargetRow + 1;
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `'Aggregated'!I${aggSheetRow}`,
        valueInputOption: "USER_ENTERED",
        requestBody: { values: [[blobUrl]] },
      });
      console.log(`[Store→Sheets] Updated Link in "Aggregated" row ${aggSheetRow} for ${email}`);
    }
  } catch (err) {
    console.error(`[Store→Sheets] Failed to update Link:`, err.message);
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
    });

    console.log(`[Store] ${tool}: ${name} <${email}> — ${Math.round(html.length / 1024)}KB — ${blob.url}`);

    // Update Google Sheets Link column — fire and forget
    updateLinkColumn(email, tool, blob.url).catch(err =>
      console.error("[Store→Sheets] updateLinkColumn failed:", err)
    );

    return res.status(200).json({ success: true, url: blob.url });

  } catch (err) {
    console.error("[Store] Failed:", err);
    return res.status(500).json({ error: "Storage failed" });
  }
};
