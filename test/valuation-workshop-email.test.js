const { test, after } = require("node:test");
const assert = require("node:assert/strict");

const sheetsPath = require.resolve("../lib/sheets");
const acPath = require.resolve("../lib/activecampaign");
const emailPath = require.resolve("../lib/email");
const handlerPath = require.resolve("../api/lead-capture");
const saved = [sheetsPath, acPath, emailPath].map(p => [p, require.cache[p]]);
const sent = [];
require.cache[sheetsPath] = { id: sheetsPath, filename: sheetsPath, loaded: true, exports: { appendLead: async () => {} } };
require.cache[acPath] = { id: acPath, filename: acPath, loaded: true, exports: { syncContact: async () => {} } };
require.cache[emailPath] = { id: emailPath, filename: emailPath, loaded: true,
  exports: { sendResultsEmail: async (d) => { sent.push(d.tool); }, sendCohortConfirmationEmail: async () => {} } };
delete require.cache[handlerPath];
const handler = require(handlerPath);
after(() => {
  delete require.cache[handlerPath];
  for (const [p, m] of saved) { if (m) require.cache[p] = m; else delete require.cache[p]; }
});

const respond = () => ({ status(c) { this.statusCode = c; return this; }, json(d) { this.data = d; return this; } });
const body = { tool: "valuation-questionnaire", name: "Test Owner", email: "t@example.com", businessName: "Acme", answers: {} };

test("workshop door sends the workshop Snapshot email, the site door the booking email", async () => {
  sent.length = 0;
  await handler({ method: "POST", headers: {}, body: { ...body, door: "workshop" } }, respond());
  await handler({ method: "POST", headers: {}, body }, respond());
  assert.deepEqual(sent, ["valuation-questionnaire-workshop", "valuation-questionnaire"]);
});
