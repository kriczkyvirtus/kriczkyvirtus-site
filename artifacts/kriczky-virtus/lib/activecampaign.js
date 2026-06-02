// lib/activecampaign.js
// ActiveCampaign contact sync + tag application for Kriczky Virtus lead capture

const AC_API_URL = process.env.ACTIVECAMPAIGN_URL;
const AC_API_KEY = process.env.ACTIVECAMPAIGN_KEY;

const TOOL_TAGS = {
  "constraint-roadmap": "Tool: Constraint Roadmap",
  "value-range-estimator": "Tool: WMBW",
  "wmbw": "Tool: WMBW",
  "business-independence-blueprint": "Tool: BIB",
  "bib": "Tool: BIB",
  "structural-capital-deep-dive": "Tool: Structural Capital",
  "structural-capital": "Tool: Structural Capital",
  "structural": "Tool: Structural Capital",
  "customer-capital-deep-dive": "Tool: Customer Capital",
  "customer-capital": "Tool: Customer Capital",
  "customer": "Tool: Customer Capital",
  "human-capital-deep-dive": "Tool: Human Capital",
  "human-capital": "Tool: Human Capital",
  "human": "Tool: Human Capital",
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

async function acFetch(endpoint, method, body) {
  const url = `${AC_API_URL}/api/3/${endpoint}`;
  const options = {
    method: method || "GET",
    headers: {
      "Api-Token": AC_API_KEY,
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
  };
  if (body) options.body = JSON.stringify(body);
  const res = await fetch(url, options);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`AC ${method} ${endpoint} → ${res.status}: ${text}`);
  }
  return res.json();
}

async function getOrCreateTag(tagName) {
  const search = await acFetch(`tags?search=${encodeURIComponent(tagName)}`);
  const existing = search.tags?.find(t => t.tag === tagName);
  if (existing) return existing.id;
  const created = await acFetch("tags", "POST", {
    tag: { tag: tagName, tagType: "contact", description: "Auto-created by website lead capture" },
  });
  console.log(`[AC] Created tag: "${tagName}" (id: ${created.tag.id})`);
  return created.tag.id;
}

async function syncContact({ name, email, tool, summary, utmSource, utmCampaign }) {
  if (!AC_API_URL || !AC_API_KEY) {
    console.log("[AC] Skipping — ACTIVECAMPAIGN_URL / ACTIVECAMPAIGN_KEY not configured");
    return;
  }

  const firstName = name.split(" ")[0] || name;
  const lastName = name.split(" ").slice(1).join(" ") || "";

  const contactResult = await acFetch("contact/sync", "POST", {
    contact: { email: email.toLowerCase(), firstName, lastName },
  });
  const contactId = contactResult.contact.id;
  console.log(`[AC] Contact synced: ${email} (id: ${contactId})`);

  const tagNames = ["Website Lead"];

  const toolTag = TOOL_TAGS[tool];
  if (toolTag) tagNames.push(toolTag);

  const constraintId = summary?.constraintId;
  if (constraintId && CONSTRAINT_TAGS[constraintId]) tagNames.push(CONSTRAINT_TAGS[constraintId]);

  const revenue = summary?.revenue;
  if (revenue && TIER_TAGS[revenue]) tagNames.push(TIER_TAGS[revenue]);

  if (utmSource) {
    const key = utmSource.toLowerCase();
    tagNames.push(SOURCE_MAP[key] || `Source: ${formatUtmValue(key)}`);
  } else {
    tagNames.push("Source: Website");
  }

  if (utmCampaign) tagNames.push(`Campaign: ${formatUtmValue(utmCampaign)}`);

  for (const tagName of tagNames) {
    try {
      const tagId = await getOrCreateTag(tagName);
      await acFetch("contactTags", "POST", {
        contactTag: { contact: contactId, tag: tagId },
      });
      console.log(`[AC] Tagged ${email}: "${tagName}"`);
    } catch (tagErr) {
      console.error(`[AC] Failed to apply tag "${tagName}" to ${email}:`, tagErr.message);
    }
  }

  console.log(`[AC] Done: ${email} — ${tagNames.length} tags applied`);
}

module.exports = { syncContact };
