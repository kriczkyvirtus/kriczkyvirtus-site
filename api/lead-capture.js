// api/lead-capture.js
// Vercel serverless function for lead capture + roadmap generation

const React = require("react");
const ReactDOMServer = require("react-dom/server");
const crypto = require("crypto");
const { appendLead } = require("../lib/sheets");
const { sendResultsEmail } = require("../lib/email");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email, tool, summary, answers, timestamp } = req.body;

    const constraintId = summary?.constraintId;
    const revenue = summary?.revenue;
    const categories = summary?.categories;
    const totalScore = summary?.totalScore;

    if (!name || !email) {
      return res.status(400).json({ error: "Missing required fields: name, email" });
    }

    console.log(`[Lead] ${name} <${email}> — ${tool || "unknown"} — ${constraintId || "n/a"}/${revenue || "n/a"} — score: ${totalScore || "n/a"}`);
    console.log(`[Lead] Answers:`, JSON.stringify(answers || {}));

    // ── STEP 1: Roadmap generation (Constraint Roadmap only) ──────────────────
    // Must complete BEFORE Sheets write so the URL is available for the Link column.
    let roadmapUrl = null;
    if (constraintId && revenue && categories) {
      try {
        const { put } = await import("@vercel/blob");

        const raw = `${email}-${constraintId}-${revenue}-${Date.now()}`;
        const id = crypto.createHash("sha256").update(raw).digest("hex").slice(0, 12);

        const data = { score: totalScore, constraintId, revenue, categories };

        const now = new Date();
        const generatedDate = now.toLocaleDateString("en-US", {
          month: "long", day: "numeric", year: "numeric",
        });

        const path = require("path");
        const ConstraintRoadmap = require(path.join(__dirname, "..", "shared", "ConstraintRoadmap-v5.compiled.js"));

        const CONSTRAINT_NAMES = {
          profitability: "Profitability",
          cash_flow: "Cash Flow",
          revenue_quality: "Revenue Quality",
          owner_dependency: "Owner Dependency",
          operational_efficiency: "Operational Efficiency",
          scalability: "Scalability",
        };
        const TIER_NAMES = {
          under_500k: "Survival",
          "500k_1m": "Stabilize",
          "1m_3m": "Growth",
          "3m_10m": "Optimize",
          over_10m: "Scaling",
        };

        const element = React.createElement(ConstraintRoadmap, {
          data,
          recipientName: name,
          generatedDate,
          diagnosticId: id.slice(0, 6).toUpperCase(),
        });
        const markup = ReactDOMServer.renderToStaticMarkup(element);

        const label = `${CONSTRAINT_NAMES[constraintId] || constraintId} · ${TIER_NAMES[revenue] || revenue}`;

        const fullHTML = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"/>
<meta name="viewport" content="width=816, initial-scale=0.5"/>
<title>Constraint Roadmap — ${label} — ${name}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet"/>
<style>html,body{margin:0;padding:0;background:#0A0E14;font-family:'DM Sans',sans-serif}
body{display:flex;flex-direction:column;align-items:center;padding:24px 0;gap:24px}
@keyframes btnShimmer{0%{background-position:200% 50%}100%{background-position:-200% 50%}}
@keyframes btnShimmerSlow{0%{background-position:200% 50%}100%{background-position:-200% 50%}}
</style>
</head><body>${markup}</body></html>`;

        const nameSlug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
        const blob = await put(`roadmaps/${nameSlug}-${id}.html`, fullHTML, {
          access: "public",
          contentType: "text/html; charset=utf-8",
          addRandomSuffix: false,
          cacheControlMaxAge: 31536000,
        });

        roadmapUrl = blob.url;
        console.log(`[Roadmap] Generated: ${id} for ${name} (${constraintId}/${revenue}) — ${Math.round(fullHTML.length / 1024)}KB — ${blob.url}`);
      } catch (renderErr) {
        console.error("[Roadmap] Generation failed:", renderErr);
      }
    }

    // ── STEP 2: Google Sheets — always runs for ALL tools ─────────────────────
    // Roadmap URL is now populated (if generated), so the Link column gets the URL.
    try {
      await appendLead({
        name,
        email,
        tool: tool || "constraint-roadmap",
        summary: summary || {},
        answers: answers || {},
        timestamp: timestamp || new Date().toISOString(),
        blobUrl: roadmapUrl || "",
      });
    } catch (sheetsErr) {
      console.error("[Sheets] appendLead failed:", sheetsErr);
    }

    // TODO: ActiveCampaign — create/update contact + tag

    // Send results email (only if we have a results URL to link to)
    if (roadmapUrl) {
      try {
        await sendResultsEmail({
          name,
          email,
          tool: tool || "constraint-roadmap",
          resultsUrl: roadmapUrl,
        });
      } catch (emailErr) {
        console.error("[Email] sendResultsEmail failed:", emailErr);
      }
    }

    return res.status(200).json({
      success: true,
      roadmapUrl,
    });

  } catch (err) {
    console.error("[Lead] Unhandled error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
