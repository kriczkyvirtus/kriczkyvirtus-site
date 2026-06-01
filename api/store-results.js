const crypto = require("crypto");
const { appendLead } = require("../lib/sheets");

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

    // Google Sheets — fire-and-forget (summary not available here, tool name is enough)
    appendLead({
      name,
      email,
      tool,
      summary: req.body.summary || {},
      answers: req.body.answers || {},
      timestamp: req.body.timestamp || new Date().toISOString(),
    }).catch(err => console.error("[Sheets] appendLead failed:", err));

    return res.status(200).json({ success: true, url: blob.url });

  } catch (err) {
    console.error("[Store] Failed:", err);
    return res.status(500).json({ error: "Storage failed" });
  }
};
