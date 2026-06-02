// api/unsubscribe.js
// Processes unsubscribe requests: logs to Google Sheets and Resend suppression list.

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Missing email" });
    }

    console.log(`[Unsubscribe] Processing: ${email}`);

    // 1. Add to Resend suppression list
    try {
      const { Resend } = require("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);

      await resend.contacts.create({
        audienceId: process.env.RESEND_AUDIENCE_ID || "",
        email: email,
        unsubscribed: true,
      });
      console.log(`[Unsubscribe] Added to Resend suppression: ${email}`);
    } catch (resendErr) {
      console.error(`[Unsubscribe] Resend suppression failed:`, resendErr.message);
    }

    // 2. Log to Google Sheets "Unsubscribed" tab
    try {
      const { google } = require("googleapis");
      const credentials = JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS);
      const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
      });
      const sheets = google.sheets({ version: "v4", auth });
      const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

      const timestamp = new Date().toLocaleString("en-US", {
        timeZone: "America/New_York",
        year: "numeric", month: "2-digit", day: "2-digit",
        hour: "2-digit", minute: "2-digit", second: "2-digit",
        hour12: true,
      });

      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: "'Unsubscribed'!A:B",
        valueInputOption: "USER_ENTERED",
        insertDataOption: "INSERT_ROWS",
        requestBody: {
          values: [[timestamp, email]],
        },
      });
      console.log(`[Unsubscribe] Logged to Google Sheets: ${email}`);
    } catch (sheetsErr) {
      console.error(`[Unsubscribe] Sheets logging failed:`, sheetsErr.message);
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error(`[Unsubscribe] Unhandled error:`, err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
