const { test, after } = require("node:test");
const assert = require("node:assert/strict");

const sheetsPath = require.resolve("../lib/sheets");
const acPath = require.resolve("../lib/activecampaign");
const handlerPath = require.resolve("../api/lead-capture");
const originalSheets = require.cache[sheetsPath];
const originalAc = require.cache[acPath];
const originalCode = process.env.WORKSHOP_CLIENT_CODE;

const calls = [];
require.cache[sheetsPath] = { id: sheetsPath, filename: sheetsPath, loaded: true,
  exports: { appendLead: async payload => { calls.push(["sheets", payload]); } } };
require.cache[acPath] = { id: acPath, filename: acPath, loaded: true,
  exports: { syncContact: async payload => { calls.push(["ac", payload]); } } };
delete require.cache[handlerPath];
const handler = require(handlerPath);

after(() => {
  delete require.cache[handlerPath];
  if (originalSheets) require.cache[sheetsPath] = originalSheets; else delete require.cache[sheetsPath];
  if (originalAc) require.cache[acPath] = originalAc; else delete require.cache[acPath];
  if (originalCode === undefined) delete process.env.WORKSHOP_CLIENT_CODE; else process.env.WORKSHOP_CLIENT_CODE = originalCode;
});

const base = {
  tool: "workshop-registration", firstName: "Test", lastName: "Owner", email: "test@example.com",
  phone: "5555550100", company: "Test Business", revenue: "$1M – $3M",
};
const full = { ...base, printName: "Test Owner", outcome: "Build cash runway", appetite: "Strong" };

async function submit(body) {
  calls.length = 0;
  const response = { status(code) { this.statusCode = code; return this; }, json(data) { this.data = data; return this; } };
  await handler({ method: "POST", body }, response);
  return response;
}

test("priority reservation needs only the short form and a dateless quarter", async () => {
  const ok = await submit({ ...base, kind: "priority", workshopId: "2027q1" });
  assert.equal(ok.statusCode, 200);
  assert.equal(calls[1][1].kind, "priority");
  assert.equal(calls[1][1].workshopId, "2027q1");
  const dated = await submit({ ...base, kind: "priority", workshopId: "2026q4" });
  assert.equal(dated.statusCode, 400);
});

test("waitlist is only for a dated workshop", async () => {
  assert.equal((await submit({ ...base, kind: "waitlist", workshopId: "2026q4" })).statusCode, 200);
  assert.equal((await submit({ ...base, kind: "waitlist", workshopId: "2027q2" })).statusCode, 400);
});

test("client seat needs the right code and writes the workshop date", async () => {
  process.env.WORKSHOP_CLIENT_CODE = "secret";
  assert.equal((await submit({ ...full, kind: "client", workshopId: "2026q4", clientCode: "nope" })).statusCode, 403);
  assert.deepEqual(calls, []);
  const ok = await submit({ ...full, kind: "client", workshopId: "2026q4", clientCode: "secret" });
  assert.equal(ok.statusCode, 200);
  assert.equal(calls[1][1].workshopDate, "2026-12-11");
  delete process.env.WORKSHOP_CLIENT_CODE;
  assert.equal((await submit({ ...full, kind: "client", workshopId: "2026q4", clientCode: "" })).statusCode, 403);
});

test("unknown workshops and kinds are refused", async () => {
  assert.equal((await submit({ ...base, kind: "priority", workshopId: "2031q1" })).statusCode, 400);
  assert.equal((await submit({ ...full, kind: "vip", workshopId: "2026q4" })).statusCode, 400);
});
