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
  "valuation-questionnaire": "Tool: Valuation Questionnaire",
  "recurring-revenue-12cs": 79,
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
  const data = await res.json();
  console.log(`[AC] ${method || "GET"} ${endpoint} → ${res.status}:`, JSON.stringify(data));
  return data;
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

async function syncContact({
  name,
  email,
  phone,
  tool,
  summary,
  utmSource,
  utmCampaign,
  revenueBand,
  revenueRange,
  ownership,
  tierInterest,
  businessConstraint,
  timeline,
  reason,
  partial,
  outcome,
  appetite,
  door,
  kind,
  workshopId,
  workshopDate,
  businessName,
}) {
  const isWorkshop = tool === "workshop-registration";
  if (isWorkshop && (!AC_API_URL || !AC_API_KEY)) {
    throw new Error("Workshop ActiveCampaign is not configured");
  }
  if (!AC_API_URL || !AC_API_KEY) {
    console.log("[AC] Skipping — ACTIVECAMPAIGN_URL / ACTIVECAMPAIGN_KEY not configured");
    return;
  }

  console.log(`[AC] syncContact called: ${email} tool=${tool} utmSource=${utmSource || "none"} utmCampaign=${utmCampaign || "none"}`);

  const firstName = name.split(" ")[0] || name;
  const lastName = name.split(" ").slice(1).join(" ") || "";

  const isCohort = tool === "cohort-waitlist";
  const isReinvestHarvest = tool === "reinvest-harvest";
  const isValueDrivers = tool === "value-drivers";
  const contact = { email: email.toLowerCase(), firstName, lastName };
  if (isValueDrivers && door === "workshop" && !lastName) {
    // Workshop links carry only a first name; never blank out the last name
    // that registration already stored.
    delete contact.lastName;
  }
  if (isReinvestHarvest || isWorkshop) {
    contact.phone = phone;
  }
  if (isValueDrivers && phone) {
    contact.phone = phone;
  }
  if (isCohort) {
    contact.fieldValues = [
      { field: "2", value: revenueRange || "" },
      { field: "3", value: businessConstraint || "" },
      { field: "8", value: timeline || "" },
      { field: "9", value: reason || "" },
      { field: "12", value: ownership || "" },
      { field: "13", value: tierInterest || "" },
    ];
  } else if (isWorkshop) {
    const short = kind === "priority" || kind === "waitlist";
    contact.fieldValues = short
      ? [{ field: "2", value: revenueBand }]
      : [
          { field: "2", value: revenueBand },
          { field: "16", value: outcome },
          { field: "15", value: appetite },
        ];
    if (workshopId) contact.fieldValues.push({ field: "17", value: workshopId });
    /* Client seats skip Stripe, so the Zap never writes the date: write it here,
       before tag 91 starts the pre-event sequence that times off it. */
    if (kind === "client" && workshopDate) contact.fieldValues.push({ field: "14", value: workshopDate });
  } else if (isValueDrivers && !partial && door !== "workshop" && revenueBand) {
    contact.fieldValues = [{ field: "2", value: revenueBand }];
  } else if (isReinvestHarvest && !partial) {
    const allocationPosition = `Biz ${summary?.bizScore ?? ""}/30 · Personal ${summary?.persScore ?? ""}/30 · ${summary?.quadrant || ""}`;
    contact.fieldValues = [
      { field: "2", value: revenueBand || "" },
      { field: "11", value: allocationPosition },
    ];
  }

  /* Field 18 Business Name, from any form that asks for it. */
  const company = typeof businessName === "string" ? businessName.trim() : "";
  if (company) contact.fieldValues = [...(contact.fieldValues || []), { field: "18", value: company }];

  let contactResult;
  try {
    contactResult = await acFetch("contact/sync", "POST", {
      contact,
    });
  } catch (syncErr) {
    if (isCohort) {
      console.error(
        `[AC] Cohort inline field sync failed for ${email} (fields 2, 3, 8, 9, 12, 13):`,
        syncErr.message,
      );
    } else if (isReinvestHarvest) {
      console.error(
        `[AC] Reinvest or Harvest inline field sync failed for ${email} (fields 2, 11):`,
        syncErr.message,
      );
    }
    throw syncErr;
  }
  const contactId = contactResult.contact.id;
  console.log(`[AC] Contact synced: ${email} (id: ${contactId})`);

  if (isWorkshop) {
    /* seat (paid): tag 90 only - the Stripe deposit Zap adds 91 and the event's seat tag.
       client: 90, 91, the event's seat tag and workshop-client-seat (101) - no deposit.
       priority / waitlist: the event's priority or waitlist tag only (not registered). */
    const { tagFor } = require("./workshop-events");
    const ids = kind === "priority" || kind === "waitlist" ? [] : kind === "client" ? [90, 91, 101] : [90];
    const names = workshopId && kind && kind !== "seat" ? [tagFor(workshopId, kind)] : [];
    for (const tagId of ids) {
      await acFetch("contactTags", "POST", { contactTag: { contact: contactId, tag: tagId } });
    }
    for (const tagName of names) {
      const tagId = await getOrCreateTag(tagName);
      await acFetch("contactTags", "POST", { contactTag: { contact: contactId, tag: tagId } });
    }
    return;
  }

  // Cohort applications use a dedicated tagging and field-mapping path.
  // Keep this ahead of the general website-lead path so paid-program
  // applicants never receive the Website Lead or business nurture tags.
  if (tool === "cohort-waitlist") {
    const tierTagIds = {
      "Under $500K": [51, 62],
      "$500K - $1M": [51, 59],
      "$1M - $3M": [18],
      "$3M - $10M": [52],
      "$10M+": [53],
    };
    const cohortTierInterestTagIds = {
      "Premium - $797/mo": 72,
      "VIP - $1,997/mo": 73,
      "VIP - $3,000/mo": 73,
      "Either - help me choose": 74,
      "Not sure yet": 74,
    };
    const cohortAuthorityTagIds = {
      "I'm the sole owner": 75,
      "I own at least 51%": 75,
      "I own 20%-50%": 76,
      "I own less than 20%": 77,
      "I'm not an owner but I'm on the leadership team": 77,
      "I'm not a business owner": 77,
    };
    if (tierInterest && !cohortTierInterestTagIds[tierInterest]) {
      console.warn(`[AC] Unmatched cohort tierInterest: "${tierInterest}"`);
    }
    if (ownership && !cohortAuthorityTagIds[ownership]) {
      console.warn(`[AC] Unmatched cohort ownership: "${ownership}"`);
    }
    const tagIds = [
      46,
      12,
      ...(tierTagIds[revenueRange] || []),
      ...(cohortTierInterestTagIds[tierInterest] ? [cohortTierInterestTagIds[tierInterest]] : []),
      ...(cohortAuthorityTagIds[ownership] ? [cohortAuthorityTagIds[ownership]] : []),
    ];

    for (const tagId of tagIds) {
      try {
        await acFetch("contactTags", "POST", {
          contactTag: { contact: contactId, tag: tagId },
        });
        console.log(`[AC] Tagged ${email}: tag id ${tagId}`);
      } catch (tagErr) {
        console.error(`[AC] Failed to apply tag id ${tagId} to ${email}:`, tagErr.message);
      }
    }

    for (const { field, value } of contact.fieldValues) {
      console.log(`[AC] Inline field ${field} response for ${email}:`, JSON.stringify(contactResult));
    }

    console.log(`[AC] Done: ${email} — cohort tags and fields applied`);
    return;
  }

  // Value Drivers. Existing tags use live-verified IDs (checked 12 Oct 2026):
  //   7 Website Lead · 8 Tool: WMBW · 12 Source: Website · 38 Source: Instagram
  //   51/62/59/18/52/53 tiers · 75/76/77 authority
  // New tags are applied by name and auto-created on first use:
  //   "VD: Started" (partial, site door) · "VD: Workshop Pre-work" · "Value Zone: <zone>"
  // The workshop door deliberately gets neither Website Lead nor a source tag,
  // so a ticket-holder is never dropped into the sales nurture.
  if (isValueDrivers) {
    const applyIds = async (ids) => {
      for (const tagId of ids) {
        try {
          await acFetch("contactTags", "POST", { contactTag: { contact: contactId, tag: tagId } });
          console.log(`[AC] Tagged ${email}: tag id ${tagId}`);
        } catch (tagErr) {
          console.error(`[AC] Failed to apply tag id ${tagId} to ${email}:`, tagErr.message);
        }
      }
    };
    const applyNames = async (names) => {
      for (const tagName of names) {
        try {
          const tagId = await getOrCreateTag(tagName);
          await acFetch("contactTags", "POST", { contactTag: { contact: contactId, tag: tagId } });
          console.log(`[AC] Tagged ${email}: "${tagName}"`);
        } catch (tagErr) {
          console.error(`[AC] Failed to apply tag "${tagName}" to ${email}:`, tagErr.message);
        }
      }
    };
    const sourceTagId = utmSource?.toLowerCase() === "instagram" ? 38 : 12;

    if (partial) {
      await applyIds([sourceTagId]);
      await applyNames(["VD: Started"]);
      console.log(`[AC] Done: ${email} — partial Value Drivers tags applied`);
      return;
    }

    const zoneTag = summary?.zone ? [`Value Zone: ${summary.zone}`] : [];
    if (door === "workshop") {
      await applyIds([8]);
      await applyNames(["VD: Workshop Pre-work", ...zoneTag]);
      console.log(`[AC] Done: ${email} — Value Drivers workshop pre-work tags applied`);
      return;
    }

    const tierTagIds = {
      "Under $500K": [51, 62], "$500K - $1M": [51, 59], "$1M - $3M": [18], "$3M - $10M": [52], "$10M+": [53],
    };
    const authorityTagIds = {
      "100% owner": 75, "Majority owner": 75, "50/50 partner": 76, "Minority owner": 76,
      "Leadership, not owner": 77, "Employee": 77,
    };
    const ids = [7, 8, sourceTagId, ...(tierTagIds[revenueBand] || [])];
    if (authorityTagIds[ownership]) ids.push(authorityTagIds[ownership]);
    await applyIds(ids);
    await applyNames([...zoneTag, ...(utmCampaign ? [`Campaign: ${formatUtmValue(utmCampaign)}`] : [])]);
    console.log(`[AC] Done: ${email} — Value Drivers tags and fields applied`);
    return;
  }

  // Reinvest or Harvest uses fixed, live-verified tag IDs. It must not inherit
  // the general website-lead behavior because summary.trackIntent is a score
  // result, not an expressed content interest.
  if (isReinvestHarvest) {
    const tierTagIds = {
      "Under $500K": [51, 62],
      "$500K - $1M": [51, 59],
      "$1M - $3M": [18],
      "$3M - $10M": [52],
      "$10M+": [53],
    };
    const positionTagIds = {
      reinvest: 68,
      split: 69,
      harvest: 70,
      stabilize: 71,
    };
    const authorityTagIds = {
      "100% owner": 75,
      "Majority owner": 75,
      "50/50 partner": 76,
      "Minority owner": 76,
      "Leadership, not owner": 77,
      "Employee": 77,
    };
    /* Workshop pre-work (/workshop-rh/scorecard): ticket-holders, so none of the website
       tags that start the sales emails: no "Tool: Reinvest Harvest" (67, starts the
       Post-Scorecard emails), no source tag, no "RH: Started" (84, abandonment emails).
       On finishing they get "RH: Workshop Pre-work" plus the sorting tags only: position,
       revenue tier and ownership. (Checked 19 Oct 2026: none of those starts an email
       automation; the two smallest tiers start "Tier Rollup", which only adds tag 51.)
       Field 11 still holds their position. */
    if (door === "workshop") {
      if (!partial) {
        const sortIds = [...(tierTagIds[revenueBand] || [])];
        if (positionTagIds[summary?.quadrantKey]) sortIds.push(positionTagIds[summary.quadrantKey]);
        if (authorityTagIds[ownership]) sortIds.push(authorityTagIds[ownership]);
        try {
          const tagId = await getOrCreateTag("RH: Workshop Pre-work");
          await acFetch("contactTags", "POST", { contactTag: { contact: contactId, tag: tagId } });
        } catch (tagErr) {
          console.error(`[AC] Failed to apply "RH: Workshop Pre-work" to ${email}:`, tagErr.message);
        }
        for (const tagId of sortIds) {
          try {
            await acFetch("contactTags", "POST", { contactTag: { contact: contactId, tag: tagId } });
          } catch (tagErr) {
            console.error(`[AC] Failed to apply tag id ${tagId} to ${email}:`, tagErr.message);
          }
        }
      }
      console.log(`[AC] Done: ${email} — Reinvest or Harvest workshop pre-work${partial ? " (partial)" : ""}`);
      return;
    }
    if (partial) {
      const sourceTagId = utmSource?.toLowerCase() === "instagram" ? 38 : 12;
      const tagIds = [84, sourceTagId];
      for (const tagId of tagIds) {
        try {
          await acFetch("contactTags", "POST", {
            contactTag: { contact: contactId, tag: tagId },
          });
          console.log(`[AC] Tagged partial Reinvest or Harvest contact ${email}: tag id ${tagId}`);
        } catch (tagErr) {
          console.error(`[AC] Failed to apply partial tag id ${tagId} to ${email}:`, tagErr.message);
        }
      }
      console.log(`[AC] Done: ${email} — partial Reinvest or Harvest tags applied`);
      return;
    }

    const sourceTagId = utmSource?.toLowerCase() === "instagram" ? 38 : 12;
    const positionTagId = positionTagIds[summary?.quadrantKey];
    const authorityTagId = authorityTagIds[ownership];
    const tagIds = [67, sourceTagId, ...(tierTagIds[revenueBand] || [])];
    if (positionTagId) tagIds.push(positionTagId);
    if (authorityTagId) tagIds.push(authorityTagId);

    for (const tagId of tagIds) {
      try {
        await acFetch("contactTags", "POST", {
          contactTag: { contact: contactId, tag: tagId },
        });
        console.log(`[AC] Tagged ${email}: tag id ${tagId}`);
      } catch (tagErr) {
        console.error(`[AC] Failed to apply tag id ${tagId} to ${email}:`, tagErr.message);
      }
    }

    for (const { field, value } of contact.fieldValues) {
      console.log(`[AC] Reinvest or Harvest inline field ${field} accepted for ${email}:`, value);
    }

    console.log(`[AC] Done: ${email} — Reinvest or Harvest tags and fields applied`);
    return;
  }

  /* Valuation questionnaire, workshop door (/workshop-rh/snapshot): pre-work for a
     ticket-holder, so no Website Lead or source tag - never the sales nurture. */
  if (tool === "valuation-questionnaire" && door === "workshop") {
    for (const tagName of ["Tool: Valuation Questionnaire", "Snapshot: Workshop Pre-work"]) {
      try {
        const tagId = await getOrCreateTag(tagName);
        await acFetch("contactTags", "POST", { contactTag: { contact: contactId, tag: tagId } });
      } catch (tagErr) {
        console.error(`[AC] Failed to apply tag "${tagName}" to ${email}:`, tagErr.message);
      }
    }
    console.log(`[AC] Done: ${email} — valuation workshop pre-work tags applied`);
    return;
  }

  const tagNames = tool === "recurring-revenue-12cs" ? [] : ["Website Lead"];
  const fixedToolTagIds = [];

  const toolTag = TOOL_TAGS[tool];
  if (typeof toolTag === "number") fixedToolTagIds.push(toolTag);
  else if (toolTag) tagNames.push(toolTag);

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

  for (const tagId of fixedToolTagIds) {
    try {
      await acFetch("contactTags", "POST", {
        contactTag: { contact: contactId, tag: tagId },
      });
      console.log(`[AC] Tagged ${email}: tag id ${tagId}`);
    } catch (tagErr) {
      console.error(`[AC] Failed to apply tag id ${tagId} to ${email}:`, tagErr.message);
    }
  }

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

  console.log(`[AC] Done: ${email} — ${tagNames.length + fixedToolTagIds.length} tags applied`);
}

module.exports = { syncContact, acFetch };
