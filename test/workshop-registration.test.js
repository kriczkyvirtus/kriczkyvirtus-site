const { test, after } = require("node:test");
const assert = require("node:assert/strict");

const sheetsPath = require.resolve("../lib/sheets");
const acPath = require.resolve("../lib/activecampaign");
const handlerPath = require.resolve("../api/lead-capture");
const originalSheets = require.cache[sheetsPath];
const originalAc = require.cache[acPath];

const calls = [];
let failAt = null;
require.cache[sheetsPath] = {
  id: sheetsPath,
  filename: sheetsPath,
  loaded: true,
  exports: {
    appendLead: async payload => {
      calls.push(["sheets", payload]);
      if (failAt === "sheets") throw new Error("sheets unavailable");
    },
  },
};
require.cache[acPath] = {
  id: acPath,
  filename: acPath,
  loaded: true,
  exports: {
    syncContact: async payload => {
      calls.push(["ac", payload]);
      if (failAt === "ac") throw new Error("tag unavailable");
    },
  },
};
const handler = require(handlerPath);

after(() => {
  delete require.cache[handlerPath];
  if (originalSheets) require.cache[sheetsPath] = originalSheets;
  else delete require.cache[sheetsPath];
  if (originalAc) require.cache[acPath] = originalAc;
  else delete require.cache[acPath];
});

const body = {
  tool: "workshop-registration",
  firstName: "Test",
  lastName: "Owner",
  email: "test@example.com",
  phone: "5555550100",
  company: "Test Business",
  printName: "Test Owner",
  revenue: "$1M – $3M",
  outcome: "Build cash runway",
  appetite: "None — I'll run it myself",
};

async function submit(overrides = {}) {
  calls.length = 0;
  const response = {
    status(code) { this.statusCode = code; return this; },
    json(data) { this.data = data; return this; },
  };
  await handler({ method: "POST", body: { ...body, ...overrides } }, response);
  return response;
}

test("workshop registration stores all three page answers verbatim", async () => {
  failAt = null;
  const response = await submit();
  assert.equal(response.statusCode, 200);
  assert.deepEqual(response.data, { success: true });
  assert.deepEqual(calls.map(([step]) => step), ["sheets", "ac"]);
  assert.equal(calls[0][1].revenueBand, body.revenue);
  assert.equal(calls[0][1].outcome, body.outcome);
  assert.equal(calls[0][1].appetite, body.appetite);
  assert.equal(calls[1][1].appetite, body.appetite);
  assert.equal(calls[1][1].revenueBand, body.revenue);
});

test("invalid workshop details cannot be captured", async () => {
  const response = await submit({ appetite: "" });
  assert.equal(response.statusCode, 400);
  assert.deepEqual(calls, []);
});

for (const step of ["sheets", "ac"]) {
  test(`workshop capture failure at ${step} never returns success`, async () => {
    failAt = step;
    const response = await submit();
    assert.equal(response.statusCode, 503);
    assert.match(response.data.error, /could not be saved/);
  });
}