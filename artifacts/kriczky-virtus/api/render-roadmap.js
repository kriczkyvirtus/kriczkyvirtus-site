const { generateRoadmap } = require("../lib/generate-roadmap");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email, score, constraintId, revenue, categories } = req.body;

    if (!name || !constraintId || !revenue || !categories) {
      return res.status(400).json({
        error: "Missing required fields: name, constraintId, revenue, categories",
      });
    }

    const result = await generateRoadmap({
      name,
      email: email || "test@test.com",
      score: score || 50,
      constraintId,
      revenue,
      categories,
    });

    return res.status(200).json({
      success: true,
      id: result.id,
      url: result.url,
    });
  } catch (err) {
    console.error("[Render] Failed:", err);
    return res.status(500).json({ error: "Roadmap rendering failed" });
  }
};
