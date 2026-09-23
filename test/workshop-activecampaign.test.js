const { before, after, test } = require("node:test");
const assert = require("node:assert/strict");

const originalFetch = global.fetch;
const originalUrl = process.env.ACTIVECAMPAIGN_URL;
const originalKey = process.env.ACTIVECAMPAIGN_KEY;
const originalLog = console.log;
const calls = [];
let syncContact;

before(() => {
  process.env.ACTIVECAMPAIGN_URL = "https://activecampaign.test";
  process.env.ACTIVECAMPAIGN_KEY = "test-key";
  delete require.cache[require.resolve("../lib/activecampaign")];
  ({ syncContact } = require("../lib/activecampaign"));
  console.log = () => {};
  global.fetch = async (url, options = {}) => {
    calls.push({ url: String(url), body: options.body && JSON.parse(options.body) });
    const data = String(url).endsWith("/contact/sync")
        ? { contact: { id: "contact-1" } }
        : { contactTag: { id: "tagged" } };
    return { ok: true, status: 200, json: async () => data };
  };
});

after(() => {
  global.fetch = originalFetch;
  console.log = originalLog;
  if (originalUrl === undefined) delete process.env.ACTIVECAMPAIGN_URL;
  else process.env.ACTIVECAMPAIGN_URL = originalUrl;
  if (originalKey === undefined) delete process.env.ACTIVECAMPAIGN_KEY;
  else process.env.ACTIVECAMPAIGN_KEY = originalKey;
  delete require.cache[require.resolve("../lib/activecampaign")];
});

test("workshop answers use supplied field IDs, scorecard revenue field, and tag 90", async () => {
  calls.length = 0;
  await syncContact({
    tool: "workshop-registration",
    name: "Test Owner",
    email: "test@example.com",
    phone: "5555550100",
    revenueBand: "$1M – $3M",
    outcome: "Build cash runway",
    appetite: "None — I'll run it myself",
  });
  assert.deepEqual(calls.map(call => call.url.split("/api/3/")[1]), [
    "contact/sync", "contactTags",
  ]);
  assert.deepEqual(calls[0].body.contact.fieldValues, [
    { field: "2", value: "$1M – $3M" },
    { field: "16", value: "Build cash runway" },
    { field: "15", value: "None — I'll run it myself" },
  ]);
  assert.deepEqual(calls[1].body.contactTag, { contact: "contact-1", tag: 90 });
});