const { after, before, beforeEach, describe, test } = require("node:test");
const assert = require("node:assert/strict");

const originalFetch = global.fetch;
const originalUrl = process.env.ACTIVECAMPAIGN_URL;
const originalKey = process.env.ACTIVECAMPAIGN_KEY;
const originalLog = console.log;
const originalError = console.error;

let calls = [];
let syncContact;

before(() => {
  process.env.ACTIVECAMPAIGN_URL = "https://activecampaign.test";
  process.env.ACTIVECAMPAIGN_KEY = "test-key";
  delete require.cache[require.resolve("../lib/activecampaign")];
  ({ syncContact } = require("../lib/activecampaign"));

  console.log = () => {};
  console.error = () => {};
  global.fetch = async (url, options = {}) => {
    calls.push({
      url: String(url),
      method: options.method || "GET",
      body: options.body ? JSON.parse(options.body) : undefined,
    });

    const data = String(url).endsWith("/contact/sync")
      ? { contact: { id: "contact-1" } }
      : { contactTag: { id: "contact-tag-1" } };

    return {
      ok: true,
      status: 200,
      json: async () => data,
      text: async () => JSON.stringify(data),
    };
  };
});

beforeEach(() => {
  calls = [];
});

after(() => {
  global.fetch = originalFetch;
  console.log = originalLog;
  console.error = originalError;

  if (originalUrl === undefined) delete process.env.ACTIVECAMPAIGN_URL;
  else process.env.ACTIVECAMPAIGN_URL = originalUrl;

  if (originalKey === undefined) delete process.env.ACTIVECAMPAIGN_KEY;
  else process.env.ACTIVECAMPAIGN_KEY = originalKey;

  delete require.cache[require.resolve("../lib/activecampaign")];
});

function tagIds() {
  return calls
    .filter(({ url }) => url.endsWith("/contactTags"))
    .map(({ body }) => Number(body.contactTag.tag));
}

function assertNoTagSeven(ids) {
  assert.equal(ids.includes(7), false, `tag 7 must be absent; received ${ids.join(", ")}`);
}

function assertNoDynamicTagLookup() {
  const dynamicTagCalls = calls.filter(({ url }) =>
    /\/api\/3\/tags(?:\?|$)/.test(url),
  );
  assert.deepEqual(dynamicTagCalls, []);
}

async function runPartial(utmSource) {
  await syncContact({
    name: "Test Owner",
    email: "owner@example.com",
    phone: "555-555-0100",
    tool: "reinvest-harvest",
    summary: {},
    utmSource,
    partial: true,
  });
  return tagIds();
}

async function runCompletion(overrides = {}) {
  await syncContact({
    name: "Test Owner",
    email: "owner@example.com",
    phone: "555-555-0100",
    tool: "reinvest-harvest",
    summary: {
      bizScore: 24,
      persScore: 19,
      quadrant: "Reinvest-Weighted",
      quadrantKey: "reinvest",
    },
    revenueBand: "$1M - $3M",
    ownership: "100% owner",
    ...overrides,
  });
  return tagIds();
}

describe("Reinvest or Harvest ActiveCampaign tags", () => {
  test("a partial applies exactly RH: Started and the website source tag by fixed ID", async () => {
    const ids = await runPartial(undefined);

    assert.deepEqual(ids, [84, 12]);
    assertNoTagSeven(ids);
    assertNoDynamicTagLookup();
  });

  test("an Instagram partial applies exactly RH: Started and the Instagram source tag", async () => {
    const ids = await runPartial("instagram");

    assert.deepEqual(ids, [84, 38]);
    assertNoTagSeven(ids);
    assertNoDynamicTagLookup();
  });

  test("completion maps every revenue band to the correct tier tags", async (t) => {
    const cases = [
      ["Under $500K", [51, 62]],
      ["$500K - $1M", [51, 59]],
      ["$1M - $3M", [18]],
      ["$3M - $10M", [52]],
      ["$10M+", [53]],
    ];

    for (const [revenueBand, tierIds] of cases) {
      await t.test(revenueBand, async () => {
        calls = [];
        const ids = await runCompletion({ revenueBand });
        assert.deepEqual(ids, [67, 12, ...tierIds, 68, 75]);
        assertNoTagSeven(ids);
      });
    }
  });

  test("completion uses source 38 for Instagram", async () => {
    const ids = await runCompletion({ utmSource: "instagram" });

    assert.deepEqual(ids, [67, 38, 18, 68, 75]);
    assertNoTagSeven(ids);
  });

  test("completion maps all four quadrants to their position tags", async (t) => {
    const cases = [
      ["reinvest", 68],
      ["split", 69],
      ["harvest", 70],
      ["stabilize", 71],
    ];

    for (const [quadrantKey, positionTagId] of cases) {
      await t.test(quadrantKey, async () => {
        calls = [];
        const ids = await runCompletion({
          summary: {
            bizScore: 24,
            persScore: 19,
            quadrant: quadrantKey,
            quadrantKey,
          },
        });
        assert.deepEqual(ids, [67, 12, 18, positionTagId, 75]);
        assertNoTagSeven(ids);
      });
    }
  });

  test("completion maps recognized ownership values to Authority tags", async (t) => {
    const cases = [
      ["100% owner", 75],
      ["Majority owner", 75],
      ["50/50 partner", 76],
      ["Minority owner", 76],
      ["Leadership, not owner", 77],
      ["Employee", 77],
    ];

    for (const [ownership, authorityTagId] of cases) {
      await t.test(ownership, async () => {
        calls = [];
        const ids = await runCompletion({ ownership });
        assert.deepEqual(ids, [67, 12, 18, 68, authorityTagId]);
        assertNoTagSeven(ids);
      });
    }
  });

  test("missing or unrecognized ownership applies no Authority tag", async (t) => {
    for (const ownership of [undefined, "Unexpected owner type"]) {
      await t.test(ownership === undefined ? "missing" : "unrecognized", async () => {
        calls = [];
        const ids = await runCompletion({ ownership });
        assert.deepEqual(ids, [67, 12, 18, 68]);
        assert.equal(ids.some((id) => [75, 76, 77].includes(id)), false);
        assertNoTagSeven(ids);
      });
    }
  });
});