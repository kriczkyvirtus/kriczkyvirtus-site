const { after, before, beforeEach, describe, test } = require("node:test");
const assert = require("node:assert/strict");

/* Value Drivers: the two doors must tag differently. The workshop door is for
   ticket-holders and must never pick up Website Lead (7) or a source tag,
   or they'd be dropped into the sales nurture. */

const originalFetch = global.fetch;
const originalUrl = process.env.ACTIVECAMPAIGN_URL;
const originalKey = process.env.ACTIVECAMPAIGN_KEY;
const originalLog = console.log;
const originalError = console.error;

let calls = [];
let syncContact;
const NAMED = { "VD: Started": 901, "VD: Workshop Pre-work": 902, "Value Zone: Midpoint Zone": 903, "Campaign: Spring Push": 904 };

before(() => {
  process.env.ACTIVECAMPAIGN_URL = "https://activecampaign.test";
  process.env.ACTIVECAMPAIGN_KEY = "test-key";
  delete require.cache[require.resolve("../lib/activecampaign")];
  ({ syncContact } = require("../lib/activecampaign"));
  console.log = () => {};
  console.error = () => {};
  global.fetch = async (url, options = {}) => {
    const u = String(url);
    calls.push({ url: u, method: options.method || "GET", body: options.body ? JSON.parse(options.body) : undefined });
    let data = { contactTag: { id: "ct" } };
    if (u.endsWith("/contact/sync")) data = { contact: { id: "contact-1" } };
    const search = u.match(/tags\?search=(.*)$/);
    if (search) {
      const name = decodeURIComponent(search[1]);
      data = { tags: NAMED[name] ? [{ tag: name, id: String(NAMED[name]) }] : [] };
    }
    return { ok: true, status: 200, json: async () => data, text: async () => JSON.stringify(data) };
  };
});

beforeEach(() => { calls = []; });

after(() => {
  global.fetch = originalFetch;
  console.log = originalLog;
  console.error = originalError;
  if (originalUrl === undefined) delete process.env.ACTIVECAMPAIGN_URL; else process.env.ACTIVECAMPAIGN_URL = originalUrl;
  if (originalKey === undefined) delete process.env.ACTIVECAMPAIGN_KEY; else process.env.ACTIVECAMPAIGN_KEY = originalKey;
  delete require.cache[require.resolve("../lib/activecampaign")];
});

const tagIds = () => calls.filter(c => c.url.endsWith("/contactTags")).map(c => Number(c.body.contactTag.tag));
const syncBody = () => calls.find(c => c.url.endsWith("/contact/sync")).body.contact;
const summary = { attractScore: 18, readyScore: 19, totalScore: 37, zone: "Midpoint Zone", zoneKey: "midpoint" };

describe("Value Drivers ActiveCampaign tagging", () => {
  test("website door, full result: Website Lead, Tool: WMBW, source, tier, authority, zone", async () => {
    await syncContact({ name: "Test Owner", email: "Owner@Example.com", phone: "555-555-0100", tool: "value-drivers", door: "site",
      summary, revenueBand: "$1M - $3M", ownership: "100% owner" });
    assert.deepEqual(tagIds(), [7, 8, 12, 18, 75, 903]);
    assert.equal(syncBody().email, "owner@example.com");
    assert.deepEqual(syncBody().fieldValues, [{ field: "2", value: "$1M - $3M" }]);
  });

  test("website door uses the Instagram source tag and campaign tag when present", async () => {
    await syncContact({ name: "Test Owner", email: "o@example.com", phone: "555-555-0100", tool: "value-drivers", door: "site",
      summary, revenueBand: "Under $500K", ownership: "Employee", utmSource: "instagram", utmCampaign: "spring-push" });
    assert.deepEqual(tagIds(), [7, 8, 38, 51, 62, 77, 903, 904]);
  });

  test("website door partial: source tag and VD: Started only", async () => {
    await syncContact({ name: "Test Owner", email: "o@example.com", phone: "555-555-0100", tool: "value-drivers", door: "site",
      summary: {}, partial: true });
    assert.deepEqual(tagIds(), [12, 901]);
    assert.equal(syncBody().fieldValues, undefined);
  });

  test("workshop door: never Website Lead or a source tag, never blanks the last name", async () => {
    await syncContact({ name: "Dana", email: "dana@example.com", tool: "value-drivers", door: "workshop", summary });
    const ids = tagIds();
    assert.deepEqual(ids, [8, 902, 903]);
    assert.equal(ids.includes(7), false);
    assert.equal(ids.includes(12), false);
    assert.equal("lastName" in syncBody(), false);
    assert.equal(syncBody().fieldValues, undefined);
  });
});

describe("Value Drivers results email", () => {
  test("website version links the report and the call page", async () => {
    const { renderResultsEmail } = await import("../lib/value-drivers-results-email.js");
    const r = renderResultsEmail({ firstName: "Mike", company: "Ridgeline", token: "abc123", door: "site",
      zoneKey: "constrained", attractScore: 14, readyScore: 15, guess: "green", scores: {} });
    assert.match(r.subject, /Ridgeline/);
    assert.match(r.html, /tools\/wmbw\/r\/abc123/);
    assert.match(r.html, /tools\/wmbw\/next\?t=abc123/);
    assert.match(r.text, /You guessed Green Zone/);
    assert.doesNotMatch(r.text, /page 7/);
  });

  test("workshop version carries the ten scores for workbook page 7", async () => {
    const { renderResultsEmail } = await import("../lib/value-drivers-results-email.js");
    const r = renderResultsEmail({ firstName: "Dana", token: "xyz", door: "workshop", zoneKey: "green",
      attractScore: 21, readyScore: 20, scores: { marketPosition: 4, succession: 3 } });
    assert.match(r.text, /page 7/);
    assert.match(r.text, /01  Market Position: 4/);
    assert.match(r.text, /10  Leadership Depth: 3/);
    assert.match(r.html, /workshop-rh\/value-drivers\/next\?t=xyz/);
  });
});
