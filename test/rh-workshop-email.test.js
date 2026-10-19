const { test } = require("node:test");
const assert = require("node:assert/strict");

test("workshop results email points at the workshop pre-work page, not the calendar", async () => {
  const { renderResultsEmail } = await import("../lib/reinvest-harvest-results-email.js");
  const base = { firstName: "Ann", company: "Acme", email: "a@example.test", token: "TOK", quadrantKey: "split", bizScore: 20, persScore: 10, revenueBand: "$3M - $10M", ownerTier: "Owner" };
  const ws = renderResultsEmail({ ...base, door: "workshop" });
  assert.match(ws.html, /workshop-rh\/scorecard\/next\?t=TOK/);
  assert.doesNotMatch(ws.html, /calendar/);
  const site = renderResultsEmail(base);
  assert.match(site.html, /reinvest-harvest\/next\?t=TOK/);
});
