// api/lead-capture.js
// Vercel serverless function for lead capture + roadmap generation

const React = require("react");
const ReactDOMServer = require("react-dom/server");
const crypto = require("crypto");
const { appendLead } = require("../lib/sheets");
const { sendResultsEmail } = require("../lib/email");
const { syncContact } = require("../lib/activecampaign");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email, tool, summary, answers, timestamp, utmSource, utmCampaign } = req.body;

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
          contentDisposition: "inline",
          cacheControlMaxAge: 31536000,
        });

        // Wrap the raw blob URL in our /api/view proxy so mobile browsers open
        // the HTML inline instead of downloading it (Vercel Blob CDN forces
        // Content-Disposition: attachment for HTML regardless of upload options).
        const host = req.headers["x-forwarded-host"] || req.headers.host;
        const viewUrl = `https://${host}/api/view?url=${encodeURIComponent(blob.url)}`;
        roadmapUrl = viewUrl;
        console.log(`[Roadmap] Generated: ${id} for ${name} (${constraintId}/${revenue}) — ${Math.round(fullHTML.length / 1024)}KB — ${viewUrl}`);
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
        answers: req.body.answers || {},
        timestamp: timestamp || new Date().toISOString(),
        blobUrl: roadmapUrl || "",
        utmSource: req.body.utmSource || null,
        utmCampaign: req.body.utmCampaign || null,
        businessName: req.body.businessName || "",
      });
    } catch (sheetsErr) {
      console.error("[Sheets] appendLead failed:", sheetsErr);
    }

    // ── STEP 3: ActiveCampaign — create/update contact + apply tags ───────────
    try {
      console.log("[AC] About to call syncContact...");
      await syncContact({
        name,
        email,
        tool: tool || "constraint-roadmap",
        summary: summary || {},
        utmSource: utmSource || null,
        utmCampaign: utmCampaign || null,
      });
      console.log("[AC] syncContact completed");
    } catch (acErr) {
      console.error("[AC] syncContact failed:", acErr.message);
    }

    // For valuation-questionnaire: email answers to Edward only (no user-facing results email)
    if (tool === "valuation-questionnaire") {
      try {
        const { Resend } = require("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);

        const answersObj = req.body.answers || {};
        const businessName = req.body.businessName || "Not provided";

        let answersHtml = "";
        const questionOrder = ["q1","q2","q3","q4","q5","q6","q7","q8","q9","q10","q11","q12","q13","q14"];
        for (const qId of questionOrder) {
          const item = answersObj[qId];
          if (item) {
            answersHtml += `
              <tr>
                <td style="padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.06); vertical-align: top;">
                  <div style="font-size: 11px; color: #8B95A5; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.05em;">Question ${qId.replace("q","")}</div>
                  <div style="font-size: 13px; color: #E8ECF1; font-weight: 600; margin-bottom: 6px;">${item.question}</div>
                  <div style="font-size: 13px; color: #C8A24E; line-height: 1.5;">${item.answer}</div>
                </td>
              </tr>`;
          }
        }

        await resend.emails.send({
          from: "Kriczky Virtus <growth@kriczkyvirtus.com>",
          to: "ekriczky@kriczkyvirtus.com",
          subject: `New Valuation Questionnaire: ${name} — ${businessName}`,
          html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin: 0; padding: 0; background-color: #0A0E14; font-family: Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0A0E14; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">
          <tr>
            <td style="background-color: #111720; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 32px 24px;">
              <h1 style="font-family: Georgia, serif; font-size: 22px; color: #E8ECF1; margin: 0 0 8px; font-weight: 400;">New Valuation Questionnaire Submitted</h1>
              <table cellpadding="0" cellspacing="0" style="margin: 16px 0 24px;">
                <tr><td style="font-size: 13px; color: #8B95A5; padding: 4px 0;"><strong style="color: #E8ECF1;">Name:</strong> ${name}</td></tr>
                <tr><td style="font-size: 13px; color: #8B95A5; padding: 4px 0;"><strong style="color: #E8ECF1;">Business:</strong> ${businessName}</td></tr>
                <tr><td style="font-size: 13px; color: #8B95A5; padding: 4px 0;"><strong style="color: #E8ECF1;">Email:</strong> <a href="mailto:${email}" style="color: #22D3EE;">${email}</a></td></tr>
              </table>
              <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.08); margin: 0 0 16px;">
              <div style="font-size: 10px; color: #5A6474; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 12px;">Answers</div>
              <table width="100%" cellpadding="0" cellspacing="0" style="background: #0A0E14; border-radius: 10px; overflow: hidden;">
                ${answersHtml}
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
        });
        console.log(`[Email] Sent valuation questionnaire notification for ${name} <${email}>`);
      } catch (emailErr) {
        console.error("[Email] Failed to send questionnaire notification:", emailErr.message);
      }
    }

    // Send results email (only if we have a results URL to link to, and not valuation-questionnaire)
    if (roadmapUrl && tool !== "valuation-questionnaire") {
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
