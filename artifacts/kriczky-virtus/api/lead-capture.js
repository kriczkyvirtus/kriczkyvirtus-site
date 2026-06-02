// /api/lead-capture.js
// Vercel Serverless Function — Lead Capture for Kriczky Virtus
//
// Receives: name, email, tool slug, scores, summary, base64 PDF
// Orchestrates:
//   1. Personalized Constraint Roadmap generation (Vercel Blob)
//   2. Resend (email with PDF)
//   3. ActiveCampaign (CRM)
//   4. Google Sheets (logging)
// Falls through gracefully — if one service fails, the others still execute

const { google } = require("googleapis");
const { generateRoadmap } = require("../lib/generate-roadmap");

// ─── GOOGLE SHEETS HELPER ────────────────────────────────────
async function appendToSheets(sheetsClient, spreadsheetId, tabName, row) {
  try {
    await sheetsClient.spreadsheets.values.append({
      spreadsheetId,
      range: `${tabName}!A:H`,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [row] },
    });
    return true;
  } catch (err) {
    console.error(`[Sheets] Failed to append to ${tabName}:`, err.message);
    return false;
  }
}

async function updateAggregatedTab(sheetsClient, spreadsheetId, email, toolName) {
  try {
    const res = await sheetsClient.spreadsheets.values.get({
      spreadsheetId,
      range: "Aggregated!A:I",
    });
    const rows = res.data.values || [];
    const headerRow = rows[0] || [];
    const emailColIdx = headerRow.indexOf("Email");
    const toolsColIdx = headerRow.indexOf("Tools Completed");
    if (emailColIdx === -1) return false;

    let existingRowIdx = -1;
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][emailColIdx] && rows[i][emailColIdx].toLowerCase() === email.toLowerCase()) {
        existingRowIdx = i;
        break;
      }
    }
    if (existingRowIdx > -1) {
      const currentTools = rows[existingRowIdx][toolsColIdx] || "";
      const toolsList = currentTools ? currentTools.split(", ") : [];
      if (!toolsList.includes(toolName)) toolsList.push(toolName);
      const updatedTools = toolsList.join(", ");
      const rowNum = existingRowIdx + 1;
      await sheetsClient.spreadsheets.values.update({
        spreadsheetId,
        range: `Aggregated!${String.fromCharCode(65 + toolsColIdx)}${rowNum}`,
        valueInputOption: "USER_ENTERED",
        requestBody: { values: [[updatedTools]] },
      });
    }
    return true;
  } catch (err) {
    console.error("[Sheets] Failed to update Aggregated tab:", err.message);
    return false;
  }
}

// ─── ACTIVECAMPAIGN HELPER ───────────────────────────────────
const TOOL_TAGS = {
  "constraint-roadmap": "Tool: Constraint Roadmap",
  "value-range-estimator": "Tool: WMBW",
  "business-independence-blueprint": "Tool: BIB",
  "structural-capital-deep-dive": "Tool: Structural Capital",
  "customer-capital-deep-dive": "Tool: Customer Capital",
  "human-capital-deep-dive": "Tool: Human Capital",
  "structural-capital": "Tool: Structural Capital",
  "customer-capital": "Tool: Customer Capital",
  "human-capital": "Tool: Human Capital",
};

const CONSTRAINT_TAGS = {
  "profitability": "Constraint: Profitability",
  "cash_flow": "Constraint: Cash Flow",
  "revenue_quality": "Constraint: Revenue Quality",
  "owner_dependency": "Constraint: Owner Dependency",
  "operational_efficiency": "Constraint: Operational Efficiency",
  "scalability": "Constraint: Scalability",
};

const TIER_TAGS = {
  "under_500k": "Tier: Under $500K",
  "500k_1m": "Tier: $500K-$1M",
  "1m_3m": "Tier: $1M-$3M",
  "3m_10m": "Tier: $3M-$10M",
};

const SOURCE_MAP = {
  "instagram": "Source: Instagram",
  "linkedin": "Source: LinkedIn",
  "youtube": "Source: YouTube",
  "email": "Source: Email",
  "referral": "Source: Referral",
  "google-ads": "Source: Google Ads",
  "event": "Source: Event",
  "skool": "Source: Skool",
};

function formatUtmValue(value) {
  return value.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

async function acGetOrCreateTag(acUrl, acKey, tagName) {
  const searchRes = await fetch(`${acUrl}/api/3/tags?search=${encodeURIComponent(tagName)}`, {
    headers: { "Api-Token": acKey },
  });
  const searchData = await searchRes.json();
  const existing = searchData.tags?.find(t => t.tag === tagName);
  if (existing) return existing.id;

  const createRes = await fetch(`${acUrl}/api/3/tags`, {
    method: "POST",
    headers: { "Api-Token": acKey, "Content-Type": "application/json" },
    body: JSON.stringify({ tag: { tag: tagName, tagType: "contact", description: "Auto-created by website lead capture" } }),
  });
  const createData = await createRes.json();
  return createData.tag.id;
}

async function syncToActiveCampaign(acUrl, acKey, { name, email, tool, toolName, summary, utmSource, utmCampaign }) {
  try {
    const nameParts = name.split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || "";

    const contactRes = await fetch(`${acUrl}/api/3/contact/sync`, {
      method: "POST",
      headers: { "Api-Token": acKey, "Content-Type": "application/json" },
      body: JSON.stringify({ contact: { email, firstName, lastName } }),
    });
    const contactData = await contactRes.json();
    const contactId = contactData?.contact?.id;
    if (!contactId) throw new Error("No contact ID returned");
    console.log(`[AC] Contact synced: ${email} (id: ${contactId})`);

    const tagNames = ["Website Lead"];

    const toolTag = TOOL_TAGS[tool];
    if (toolTag) tagNames.push(toolTag);

    const constraintId = summary?.constraintId;
    if (constraintId && CONSTRAINT_TAGS[constraintId]) tagNames.push(CONSTRAINT_TAGS[constraintId]);

    const revenue = summary?.revenue;
    if (revenue && TIER_TAGS[revenue]) tagNames.push(TIER_TAGS[revenue]);

    if (utmSource) {
      const sourceKey = utmSource.toLowerCase();
      tagNames.push(SOURCE_MAP[sourceKey] || `Source: ${formatUtmValue(sourceKey)}`);
    } else {
      tagNames.push("Source: Website");
    }

    if (utmCampaign) tagNames.push(`Campaign: ${formatUtmValue(utmCampaign)}`);

    for (const tagName of tagNames) {
      try {
        const tagId = await acGetOrCreateTag(acUrl, acKey, tagName);
        await fetch(`${acUrl}/api/3/contactTags`, {
          method: "POST",
          headers: { "Api-Token": acKey, "Content-Type": "application/json" },
          body: JSON.stringify({ contactTag: { contact: contactId, tag: tagId } }),
        });
        console.log(`[AC] Tagged ${email}: "${tagName}"`);
      } catch (tagErr) {
        console.error(`[AC] Failed to apply tag "${tagName}":`, tagErr.message);
      }
    }

    console.log(`[AC] Done: ${email} — ${tagNames.length} tags applied`);
    return true;
  } catch (err) {
    console.error("[ActiveCampaign] Error:", err.message);
    return false;
  }
}

// ─── RESEND EMAIL HELPER ─────────────────────────────────────
async function sendEmails(resendKey, { name, email, toolName, tool, summary, pdfBase64 }) {
  const fromAddress = "results@kriczkyvirtus.com";
  const fromName = "Kriczky Virtus";

  const toolSubjects = {
    wmbw: "What's My Business Worth?",
    bib: "Business Independence Blueprint",
    "human-capital": "Human Capital Deep-Dive",
    "customer-capital": "Customer Capital Deep-Dive",
    "structural-capital": "Structural Capital Deep-Dive",
    cashflow: "Cash Flow Fortress",
    "owner-dependency": "Owner Dependency Scorecard",
    "12cs": "Recurring Revenue 12Cs",
    "constraint-roadmap": "Constraint Roadmap",
  };

  const subjectName = toolSubjects[tool] || toolName;
  const firstName = name.split(" ")[0];

  const attachments = [];
  if (pdfBase64) {
    attachments.push({
      filename: `${subjectName.replace(/[^a-zA-Z0-9 ]/g, "")} Results - ${name}.pdf`,
      content: pdfBase64,
    });
  }

  try {
    const leadEmailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: `${fromName} <${fromAddress}>`,
        to: [email],
        subject: `Your ${subjectName} Results`,
        html: `
          <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #333;">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="font-size: 24px; font-weight: 700; letter-spacing: 1px; color: #1a1a2e;">KRICZKY VIRTUS</div>
            </div>
            <p style="font-size: 16px; line-height: 1.6;">Hi ${firstName},</p>
            <p style="font-size: 16px; line-height: 1.6;">
              Thank you for completing the <strong>${subjectName}</strong>. Your personalized results report is attached as a PDF.
            </p>
            ${summary.pct ? `
            <div style="background: #f8f9fa; border-left: 4px solid #C8A24E; padding: 16px 20px; border-radius: 0 8px 8px 0; margin: 24px 0;">
              <div style="font-size: 14px; color: #666; margin-bottom: 4px;">Your Score</div>
              <div style="font-size: 28px; font-weight: 700; color: #1a1a2e;">${summary.pct}%</div>
              ${summary.band ? `<div style="font-size: 14px; color: #666; margin-top: 4px;">${summary.band}</div>` : ""}
            </div>
            ` : ""}
            <p style="font-size: 16px; line-height: 1.6;">
              This report is yours to keep. Review it anytime, share it with your team, or bring it to a call with us — we'll walk through every finding together.
            </p>
            <div style="text-align: center; margin: 32px 0;">
              <a href="https://kriczkyvirtus.com/call" style="display: inline-block; padding: 14px 32px; background: #C8A24E; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 15px; letter-spacing: 0.5px;">
                Book a Free Working Session
              </a>
            </div>
            <p style="font-size: 14px; color: #999; line-height: 1.6;">
              During the session, we'll review your results, identify the highest-leverage moves for your specific business, and outline a clear path forward. No pitch — just your numbers.
            </p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;" />
            <p style="font-size: 12px; color: #999; text-align: center;">
              Edward Kriczky, CEPA · Founder, Kriczky Virtus<br/>
              <a href="https://kriczkyvirtus.com" style="color: #C8A24E; text-decoration: none;">kriczkyvirtus.com</a>
            </p>
          </div>
        `,
        attachments,
      }),
    });
    if (!leadEmailRes.ok) {
      const err = await leadEmailRes.text();
      console.error("[Resend] Lead email failed:", err);
    }

    const edwardEmailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: `${fromName} <${fromAddress}>`,
        to: ["ekriczky@kriczkyvirtus.com"],
        subject: `New Lead: ${subjectName} — ${name} — ${summary.pct || "N/A"}%`,
        html: `
          <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #333;">
            <h2 style="color: #1a1a2e; margin-bottom: 20px;">New Lead: ${subjectName}</h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr><td style="padding: 8px 12px; font-weight: 600; color: #666; border-bottom: 1px solid #eee;">Name</td><td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${name}</td></tr>
              <tr><td style="padding: 8px 12px; font-weight: 600; color: #666; border-bottom: 1px solid #eee;">Email</td><td style="padding: 8px 12px; border-bottom: 1px solid #eee;"><a href="mailto:${email}">${email}</a></td></tr>
              <tr><td style="padding: 8px 12px; font-weight: 600; color: #666; border-bottom: 1px solid #eee;">Tool</td><td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${toolName} (${tool})</td></tr>
              ${summary.pct ? `<tr><td style="padding: 8px 12px; font-weight: 600; color: #666; border-bottom: 1px solid #eee;">Score</td><td style="padding: 8px 12px; border-bottom: 1px solid #eee;"><strong>${summary.pct}%</strong></td></tr>` : ""}
              ${summary.band ? `<tr><td style="padding: 8px 12px; font-weight: 600; color: #666; border-bottom: 1px solid #eee;">Band</td><td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${summary.band}</td></tr>` : ""}
            </table>
            <p style="font-size: 14px; color: #666;">Full scores: <code>${JSON.stringify(summary)}</code></p>
            <p style="font-size: 14px; color: #666;">Their PDF report is attached.</p>
          </div>
        `,
        attachments,
      }),
    });
    if (!edwardEmailRes.ok) {
      const err = await edwardEmailRes.text();
      console.error("[Resend] Edward email failed:", err);
    }
    return true;
  } catch (err) {
    console.error("[Resend] Error:", err.message);
    return false;
  }
}

// ─── MAIN HANDLER ────────────────────────────────────────────
module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { name, email, tool, toolName, scores, summary, timestamp, pdfBase64, utmSource, utmCampaign } = req.body;

  if (!email || !name) {
    return res.status(400).json({ error: "Name and email required" });
  }

  const AC_URL = process.env.ACTIVECAMPAIGN_URL;
  const AC_KEY = process.env.ACTIVECAMPAIGN_KEY;
  const RESEND_KEY = process.env.RESEND_API_KEY;
  const SHEETS_ID = process.env.GOOGLE_SHEETS_ID;
  const SERVICE_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const PRIVATE_KEY = (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n");

  const results = { resend: false, activecampaign: false, sheets: false, roadmap: null };

  // ── ROADMAP GENERATION (Constraint Roadmap tool only) ──
  let roadmapUrl = null;
  if (tool === "constraint-roadmap" && summary?.constraintId && summary?.revenue && summary?.categories) {
    try {
      const roadmapResult = await generateRoadmap({
        name,
        email,
        score: summary.totalScore || summary.pct || 50,
        constraintId: summary.constraintId,
        revenue: summary.revenue,
        categories: summary.categories,
      });
      roadmapUrl = roadmapResult.url;
      results.roadmap = roadmapResult.id;
    } catch (err) {
      console.error("[Lead] Roadmap generation failed:", err.message || err);
    }
  }

  // ── RESEND (emails with PDF) ──
  if (RESEND_KEY) {
    results.resend = await sendEmails(RESEND_KEY, {
      name, email, toolName, tool, summary, pdfBase64,
    });
  }

  // ── ACTIVECAMPAIGN (CRM) ──
  if (AC_URL && AC_KEY) {
    results.activecampaign = await syncToActiveCampaign(AC_URL, AC_KEY, {
      name, email, tool, toolName, summary, utmSource, utmCampaign,
    });
  }

  // ── GOOGLE SHEETS (logging) ──
  if (SHEETS_ID && SERVICE_EMAIL && PRIVATE_KEY) {
    try {
      const auth = new google.auth.GoogleAuth({
        credentials: { client_email: SERVICE_EMAIL, private_key: PRIVATE_KEY },
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
      });
      const sheetsClient = google.sheets({ version: "v4", auth });

      const tabMap = {
        wmbw: "WMBW",
        bib: "BIB",
        "human-capital": "Human Capital",
        "customer-capital": "Customer Capital",
        "structural-capital": "Structural Capital",
        cashflow: "Cash Flow",
        "owner-dependency": "Owner Dependency",
        "12cs": "12Cs",
        "constraint-roadmap": "Constraint Roadmap",
      };

      const tabName = tabMap[tool] || tool;
      const ts = timestamp || new Date().toISOString();
      const row = [
        ts, name, email, toolName,
        summary.totalScore || summary.pct || "",
        summary.pct ? `${summary.pct}%` : "",
        summary.band || "",
        JSON.stringify(scores || {}),
        utmSource || "",
        utmCampaign || "",
      ];

      const toolResult = await appendToSheets(sheetsClient, SHEETS_ID, tabName, row);
      const aggRow = [ts, name, email, toolName, summary.pct ? `${summary.pct}%` : "", summary.band || "", "", toolName, utmSource || "", utmCampaign || ""];
      const aggResult = await appendToSheets(sheetsClient, SHEETS_ID, "Aggregated", aggRow);
      if (aggResult) await updateAggregatedTab(sheetsClient, SHEETS_ID, email, toolName);
      results.sheets = toolResult && aggResult;
    } catch (err) {
      console.error("[Sheets] Auth/setup error:", err.message);
    }
  }

  return res.status(200).json({
    success: true,
    roadmapUrl,
    results,
    message: "Lead captured",
  });
};
