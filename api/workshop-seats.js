// api/workshop-seats.js
// GET /api/workshop-seats → live counts behind the dates cards on /workshop-rh.
//   { counts: { "2026q4": { seat: 7, waitlist: 0, priority: 0 }, ... } }
// Counts are the number of ActiveCampaign contacts carrying each workshop tag
// (workshop-<id>-seat / -waitlist / -priority - see lib/workshop-events.js), so the
// page never shows a number someone typed in. Cached for two minutes per instance.
// If ActiveCampaign can't be reached the endpoint answers 503 and the page falls
// back to "Open" with no number.

const { WORKSHOP_DATES } = require("../lib/workshop-events");

const TTL_MS = 2 * 60 * 1000;
let cache = { at: 0, body: null };

async function ac(endpoint) {
  const res = await fetch(`${process.env.ACTIVECAMPAIGN_URL}/api/3/${endpoint}`, {
    headers: { "Api-Token": process.env.ACTIVECAMPAIGN_KEY, Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`AC GET ${endpoint} → ${res.status}`);
  return res.json();
}

async function loadCounts() {
  const search = await ac(`tags?search=${encodeURIComponent("workshop-")}&limit=100`);
  const tagIds = Object.fromEntries((search.tags || []).map(t => [t.tag, t.id]));
  const counts = {};
  for (const id of Object.keys(WORKSHOP_DATES)) {
    counts[id] = {};
    for (const kind of ["seat", "waitlist", "priority"]) {
      const tagId = tagIds[`workshop-${id}-${kind}`];
      if (!tagId) { counts[id][kind] = 0; continue; }
      /* status=-1: every contact with the tag, whatever their list status */
      const page = await ac(`contacts?tagid=${tagId}&status=-1&limit=1`);
      counts[id][kind] = Number(page.meta?.total || 0);
    }
  }
  return { counts };
}

module.exports = async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  if (!process.env.ACTIVECAMPAIGN_URL || !process.env.ACTIVECAMPAIGN_KEY) {
    return res.status(503).json({ error: "Counts unavailable" });
  }
  try {
    if (!cache.body || Date.now() - cache.at > TTL_MS) {
      cache = { at: Date.now(), body: await loadCounts() };
    }
    res.setHeader?.("Cache-Control", "public, s-maxage=120, stale-while-revalidate=60");
    return res.status(200).json(cache.body);
  } catch (err) {
    console.error("[Workshop seats] Count failed:", err.message);
    return res.status(503).json({ error: "Counts unavailable" });
  }
};

module.exports._resetCache = () => { cache = { at: 0, body: null }; };
