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
  "constraint-roadmap": "Constraint Roadmap",
  "value-range-estimator": "WMBW",
  "business-independence-blueprint": "BIB",
  "structural-capital-deep-dive": "Structural Capital",
  "customer-capital-deep-dive": "Customer Capital",
  "human-capital-deep-dive": "Human Capital",
};

async function appendLead({ name, email, tool, summary, answers, timestamp }) {
  const sheets = getSheets();
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  const tabName = TOOL_TO_TAB[tool] || tool;

  let percentage = "";
  let band = "";
  if (summary?.totalScore != null) {
    percentage = summary.totalScore;
    if (percentage >= 70) band = "Green Zone";
    else if (percentage >= 50) band = "Market";
    else if (percentage >= 30) band = "Discount";
    else band = "Not Sellable";
  }

  const row = [
    timestamp || new Date().toISOString(),
    name || "",
    email || "",
    tabName,
    JSON.stringify(summary || {}),
    JSON.stringify(answers || {}),
    percentage,
    band,
    summary?.categories ? JSON.stringify(summary.categories) : "",
  ];

  const aggregatedRow = [...row, tabName];

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `'${tabName}'!A:I`,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: [row] },
    });
    console.log(`[Sheets] Wrote to "${tabName}" tab for ${name} <${email}>`);
  } catch (err) {
    console.error(`[Sheets] Failed to write to "${tabName}":`, err.message);
  }

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "'Aggregated'!A:J",
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: [aggregatedRow] },
    });
    console.log(`[Sheets] Wrote to "Aggregated" tab for ${name} <${email}>`);
  } catch (err) {
    console.error(`[Sheets] Failed to write to "Aggregated":`, err.message);
  }
}

module.exports = { appendLead };
