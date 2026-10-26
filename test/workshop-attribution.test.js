const { test } = require("node:test");
const assert = require("node:assert/strict");

/* ── 1. lead-capture: the page's utm_* / ref reach Sheets, ActiveCampaign and the alert, cleaned ── */
test("workshop sign-up passes cleaned attribution to Sheets, ActiveCampaign and the alert", async () => {
  const sheetsPath = require.resolve("../lib/sheets");
  const acPath = require.resolve("../lib/activecampaign");
  const alertPath = require.resolve("../lib/workshop-alert");
  const handlerPath = require.resolve("../api/lead-capture");
  const seen = {};
  require.cache[sheetsPath] = { id: sheetsPath, filename: sheetsPath, loaded: true, exports: { appendLead: async p => { seen.sheets = p; } } };
  require.cache[acPath] = { id: acPath, filename: acPath, loaded: true, exports: { syncContact: async p => { seen.ac = p; } } };
  require.cache[alertPath] = { id: alertPath, filename: alertPath, loaded: true, exports: { sendWorkshopAlert: async p => { seen.alert = p; } } };
  delete require.cache[handlerPath];
  const handler = require(handlerPath);
  const res = { status(c) { this.statusCode = c; return this; }, json(b) { this.body = b; return this; }, setHeader() {} };
  await handler({ method: "POST", headers: {}, body: {
    tool: "workshop-registration", kind: "priority", workshopId: "2027q1",
    firstName: "Test", lastName: "Owner", email: "test@example.com", phone: "5555550100",
    company: "Test Co", revenue: "$1M – $3M",
    utmSource: "Affiliate", utmMedium: "print", utmCampaign: "regaliahills", ref: "regalia<hills>",
  } }, res);
  assert.equal(res.statusCode, 200);
  assert.deepEqual([seen.sheets.utmSource, seen.sheets.utmMedium, seen.sheets.utmCampaign, seen.sheets.ref],
    ["affiliate", "print", "regaliahills", "regaliahills"]);
  assert.deepEqual([seen.ac.utmSource, seen.ac.utmCampaign, seen.ac.ref], ["affiliate", "regaliahills", "regaliahills"]);
  assert.equal(seen.alert.ref, "regaliahills");
  delete require.cache[handlerPath]; delete require.cache[sheetsPath]; delete require.cache[acPath]; delete require.cache[alertPath];
});

/* ── 2. ActiveCampaign: source, campaign and referring-firm tags on a workshop sign-up ── */
test("workshop contact gets Source, Campaign and Referred by tags when the link carried them", async () => {
  process.env.ACTIVECAMPAIGN_URL = "https://activecampaign.test";
  process.env.ACTIVECAMPAIGN_KEY = "test-key";
  const acPath = require.resolve("../lib/activecampaign");
  delete require.cache[acPath];
  const { syncContact } = require(acPath);
  const created = [];
  const realFetch = global.fetch; const realLog = console.log; console.log = () => {};
  global.fetch = async (url, options = {}) => {
    const u = String(url); const body = options.body && JSON.parse(options.body);
    let data = { contactTag: { id: "t" } };
    if (u.endsWith("/contact/sync")) data = { contact: { id: "c1" } };
    else if (u.includes("/tags?search=")) data = { tags: [] };
    else if (u.endsWith("/tags")) { created.push(body.tag.tag); data = { tag: { id: String(created.length) } }; }
    return { ok: true, status: 200, json: async () => data };
  };
  await syncContact({ tool: "workshop-registration", name: "T O", email: "t@example.com", phone: "1",
    revenueBand: "$1M – $3M", kind: "priority", workshopId: "2027q1",
    utmSource: "affiliate", utmCampaign: "regaliahills", ref: "regaliahills" });
  assert.deepEqual(created, ["workshop-2027q1-priority", "Source: Affiliate", "Campaign: Regaliahills", "Referred by: regaliahills"]);
  global.fetch = realFetch; console.log = realLog; delete require.cache[acPath];
});

/* ── 3. no link data → no source tags (the workshop path doesn't default to "Source: Website") ── */
test("workshop contact without link data gets no source tags", async () => {
  process.env.ACTIVECAMPAIGN_URL = "https://activecampaign.test";
  process.env.ACTIVECAMPAIGN_KEY = "test-key";
  const acPath = require.resolve("../lib/activecampaign");
  delete require.cache[acPath];
  const { syncContact } = require(acPath);
  const created = [];
  const realFetch = global.fetch; const realLog = console.log; console.log = () => {};
  global.fetch = async (url, options = {}) => {
    const u = String(url); const body = options.body && JSON.parse(options.body);
    let data = { contactTag: { id: "t" } };
    if (u.endsWith("/contact/sync")) data = { contact: { id: "c1" } };
    else if (u.includes("/tags?search=")) data = { tags: [] };
    else if (u.endsWith("/tags")) { created.push(body.tag.tag); data = { tag: { id: String(created.length) } }; }
    return { ok: true, status: 200, json: async () => data };
  };
  await syncContact({ tool: "workshop-registration", name: "T O", email: "t@example.com", phone: "1",
    revenueBand: "$1M – $3M", kind: "priority", workshopId: "2027q1" });
  assert.deepEqual(created, ["workshop-2027q1-priority"]);
  global.fetch = realFetch; console.log = realLog; delete require.cache[acPath];
});
