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
  // Short slugs sent by the Capital Deep Dive tools via toolSlug prop
  "structural-capital": "Structural Capital",
  "customer-capital": "Customer Capital",
  "human-capital": "Human Capital",
  "valuation-questionnaire": "Valuation Questionnaire",
};

const REVENUE_LABELS = {
  "under_500k": "Under $500K",
  "500k_1m": "$500K – $1M",
  "1m_3m": "$1M – $3M",
  "3m_10m": "$3M – $10M",
};

function cleanScores(summary) {
  if (!summary) return {};
  const cleaned = { ...summary };
  if (cleaned.categories && Array.isArray(cleaned.categories)) {
    cleaned.categories = cleaned.categories.map(({ color, ...rest }) => rest);
  }
  return cleaned;
}

async function appendLead({ name, email, tool, summary, answers, timestamp, blobUrl, utmSource, utmCampaign, businessName }) {
  const sheets = getSheets();
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  const tabName = TOOL_TO_TAB[tool] || tool;
  console.log(`[Sheets] appendLead called: tool="${tool}" → tab="${tabName}"`);

  // Build a clean, sortable timestamp in Eastern Time.
  // toLocaleString output format varies between Node versions and Vercel
  // runtimes; formatToParts gives stable named parts we can assemble ourselves.
  const _now = new Date();
  const _parts = {};
  for (const { type, value } of new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    hour12: true,
  }).formatToParts(_now)) { _parts[type] = value; }
  const estTimestamp = `${_parts.year}-${_parts.month}-${_parts.day} ${_parts.hour}:${_parts.minute}:${_parts.second} ${_parts.dayPeriod} ET`;

  let percentage = "";
  let band = "";
  if (summary?.totalScore != null) {
    percentage = summary.totalScore;
    if (percentage >= 70) band = "Green Zone";
    else if (percentage >= 50) band = "Market";
    else if (percentage >= 30) band = "Discount";
    else band = "Not Sellable";
  }

  const cleanedSummary = cleanScores(summary);
  const summaryStr = JSON.stringify(cleanedSummary);
  const answersStr = JSON.stringify(answers || {});
  const link = blobUrl || "";
  const revenueBand = REVENUE_LABELS[summary?.revenue] || summary?.revenue || "";

  const source = utmSource || "website";
  const campaign = utmCampaign || "";

  let toolRow, toolRange;
  if (tool === "constraint-roadmap") {
    toolRow = [estTimestamp, name, email, tabName, revenueBand, summaryStr, answersStr, percentage, band, link, source, campaign];
    toolRange = `'${tabName}'!A:L`;
  } else if (tool === "valuation-questionnaire") {
    const a = answers || {};
    toolRow = [
      estTimestamp, name, email,
      businessName || "",
      a.q1?.answer || a.q1 || "",
      a.q2?.answer || a.q2 || "",
      a.q3?.answer || a.q3 || "",
      a.q4?.answer || a.q4 || "",
      a.q5?.answer || a.q5 || "",
      a.q6?.answer || a.q6 || "",
      a.q7?.answer || a.q7 || "",
      a.q8?.answer || a.q8 || "",
      a.q9?.answer || a.q9 || "",
      a.q10?.answer || a.q10 || "",
      a.q11?.answer || a.q11 || "",
      a.q12?.answer || a.q12 || "",
      a.q13?.answer || a.q13 || "",
      a.q14?.answer || a.q14 || "",
      source, campaign,
    ];
    toolRange = `'${tabName}'!A:T`;
  } else {
    toolRow = [estTimestamp, name, email, tabName, summaryStr, answersStr, percentage, band, link, source, campaign];
    toolRange = `'${tabName}'!A:K`;
  }

  const aggregatedRow = [estTimestamp, name, email, tabName, summaryStr, answersStr, percentage, band, link, tabName, source, campaign];

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: toolRange,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: [toolRow] },
    });
    console.log(`[Sheets] Wrote to "${tabName}" tab for ${name} <${email}>`);
  } catch (err) {
    console.error(`[Sheets] Failed to write to "${tabName}":`, err.message, err.response?.data?.error?.message || "");
  }

  console.log(`[Sheets] About to write to Aggregated tab. Row data:`, JSON.stringify(aggregatedRow));
  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "'Aggregated'!A:L",
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: [aggregatedRow] },
    });
    console.log(`[Sheets] Wrote to "Aggregated" tab for ${name} <${email}>`);
  } catch (err) {
    console.error(`[Sheets] Failed to write to "Aggregated":`, err.message, err.response?.data?.error?.message || "");
  }
}

module.exports = { appendLead };
