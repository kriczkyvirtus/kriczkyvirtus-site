const { readReport } = require("../lib/reinvest-harvest-reports");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const token = typeof req.query.token === "string" ? req.query.token : "";
  if (!token) {
    return res.status(400).json({ error: "Missing token" });
  }

  try {
    const report = await readReport(token);
    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }
    res.setHeader("Cache-Control", "private, no-store");
    return res.status(200).json(report);
  } catch (err) {
    console.error("[Reinvest Harvest Report] Read failed:", err);
    return res.status(500).json({ error: "Unable to load report" });
  }
};