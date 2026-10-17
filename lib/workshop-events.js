// lib/workshop-events.js
// Server-side list of Reinvest or Harvest Workshop dates, keyed by workshop ID.
// Keep in step with artifacts/kriczky-virtus/src/workshopEvents.js (the page's copy).
//
// A workshop ID is "<year>q<quarter>", e.g. "2026q4". Everything else follows from it:
//   tags   workshop-<id>-seat · workshop-<id>-waitlist · workshop-<id>-priority
//   field  17 Workshop ID = <id>;  field 14 Workshop Date = the date below (client seats)
// A quarter with no date yet is listed as null: it takes priority reservations only.

const WORKSHOP_DATES = {
  "2026q4": "2026-12-04",
  "2027q1": null,
  "2027q2": null,
};

const ID_PATTERN = /^\d{4}q[1-4]$/;
const KINDS = ["seat", "client", "priority", "waitlist"];

const tagFor = (id, kind) => `workshop-${id}-${kind === "client" ? "seat" : kind}`;

module.exports = { WORKSHOP_DATES, ID_PATTERN, KINDS, tagFor };
