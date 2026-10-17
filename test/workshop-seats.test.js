const { test, after } = require("node:test");
const assert = require("node:assert/strict");

const originalFetch = global.fetch;
const originalUrl = process.env.ACTIVECAMPAIGN_URL;
const originalKey = process.env.ACTIVECAMPAIGN_KEY;
after(() => {
  global.fetch = originalFetch;
  if (originalUrl === undefined) delete process.env.ACTIVECAMPAIGN_URL; else process.env.ACTIVECAMPAIGN_URL = originalUrl;
  if (originalKey === undefined) delete process.env.ACTIVECAMPAIGN_KEY; else process.env.ACTIVECAMPAIGN_KEY = originalKey;
});

const handler = require("../api/workshop-seats");
const respond = () => ({ headers: {}, setHeader(k, v) { this.headers[k] = v; },
  status(code) { this.statusCode = code; return this; }, json(data) { this.data = data; return this; } });

test("counts come from the workshop tags, missing tags count as zero", async () => {
  process.env.ACTIVECAMPAIGN_URL = "https://ac.test";
  process.env.ACTIVECAMPAIGN_KEY = "k";
  handler._resetCache();
  global.fetch = async (url) => {
    const u = String(url);
    const data = u.includes("/tags?") ? { tags: [{ id: "97", tag: "workshop-2026q4-seat" }, { id: "99", tag: "workshop-2027q1-priority" }] }
      : u.includes("tagid=97") ? { meta: { total: "13" } }
      : u.includes("tagid=99") ? { meta: { total: "6" } }
      : { meta: { total: "0" } };
    return { ok: true, status: 200, json: async () => data };
  };
  const res = respond();
  await handler({ method: "GET" }, res);
  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.data.counts["2026q4"], { seat: 13, waitlist: 0, priority: 0 });
  assert.equal(res.data.counts["2027q1"].priority, 6);
});

test("an ActiveCampaign failure answers 503 so the page shows no number", async () => {
  handler._resetCache();
  global.fetch = async () => ({ ok: false, status: 500, json: async () => ({}) });
  const res = respond();
  await handler({ method: "GET" }, res);
  assert.equal(res.statusCode, 503);
});
