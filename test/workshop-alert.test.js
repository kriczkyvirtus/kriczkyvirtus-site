const { test } = require("node:test");
const assert = require("node:assert/strict");

const sheetsPath = require.resolve("../lib/sheets");
const acPath = require.resolve("../lib/activecampaign");
const alertPath = require.resolve("../lib/workshop-alert");
const { buildAlert, sendWorkshopAlert } = require(alertPath);

test("subjects name the kind, the owner and the workshop", () => {
  const base = { name: "Test Owner", company: "Test Co", email: "t@example.com" };
  assert.match(buildAlert({ ...base, kind: "seat", workshopId: "2026q4", workshopDate: "2026-12-04" }).subject, /^Workshop seat: Test Owner \(Test Co\) - Fri, Dec 4, 2026$/);
  assert.match(buildAlert({ ...base, kind: "priority", workshopId: "2027q1", workshopDate: null }).subject, /^Workshop priority list: .* - Q1 2027$/);
  assert.match(buildAlert({ ...base, kind: "waitlist", workshopId: "2026q4", workshopDate: "2026-12-04" }).subject, /^Workshop waitlist:/);
  assert.match(buildAlert({ ...base, kind: "client", workshopId: "2026q4", workshopDate: "2026-12-04" }).subject, /^Workshop client seat:/);
  assert.match(buildAlert({ ...base, kind: "seat", workshopId: null, workshopDate: null }).subject, /- next workshop$/);
});

test("form input is escaped in the email body", () => {
  const { html } = buildAlert({ kind: "seat", name: "<b>x</b>", company: "A & B", email: "t@example.com" });
  assert.ok(html.includes("&lt;b&gt;x&lt;/b&gt;") && html.includes("A &amp; B"));
  assert.ok(!html.includes("<b>x</b>"));
});

test("nothing is sent without RESEND_API_KEY", async () => {
  const key = process.env.RESEND_API_KEY; delete process.env.RESEND_API_KEY;
  assert.deepEqual(await sendWorkshopAlert({ kind: "seat", name: "T", email: "t@example.com" }), { skipped: true });
  if (key) process.env.RESEND_API_KEY = key;
});

test("the handler alerts once per saved sign-up, and not when saving fails", async () => {
  const alerts = []; let fail = false;
  require.cache[sheetsPath] = { id: sheetsPath, filename: sheetsPath, loaded: true, exports: { appendLead: async () => { if (fail) throw new Error("down"); } } };
  require.cache[acPath] = { id: acPath, filename: acPath, loaded: true, exports: { syncContact: async () => {} } };
  require.cache[alertPath] = { id: alertPath, filename: alertPath, loaded: true, exports: { sendWorkshopAlert: async d => { alerts.push(d); } } };
  const handler = require("../api/lead-capture");
  const submit = async (body) => {
    const res = { status(c) { this.statusCode = c; return this; }, json(b) { this.body = b; return this; }, setHeader() {} };
    await handler({ method: "POST", headers: {}, body: { tool: "workshop-registration", firstName: "Test", lastName: "Owner", email: "test@example.com",
      phone: "5555550100", company: "Test Business", revenue: "$1M – $3M", ...body } }, res);
    return res;
  };
  let r = await submit({ kind: "priority", workshopId: "2027q1" });
  assert.equal(r.statusCode, 200); assert.equal(alerts.length, 1);
  assert.equal(alerts[0].kind, "priority"); assert.equal(alerts[0].workshopId, "2027q1"); assert.equal(alerts[0].company, "Test Business");
  r = await submit({ printName: "Test Owner", outcome: "x", appetite: "Strong" });
  assert.equal(r.statusCode, 200); assert.equal(alerts.length, 2); assert.equal(alerts[1].kind, "seat");
  fail = true;
  r = await submit({ kind: "priority", workshopId: "2027q2" });
  assert.equal(r.statusCode, 503); assert.equal(alerts.length, 2);
});
