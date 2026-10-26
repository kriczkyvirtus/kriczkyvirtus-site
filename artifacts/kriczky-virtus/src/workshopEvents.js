/* ═══════════════════════════════════════════════════════════════
   REINVEST OR HARVEST WORKSHOP DATES - the page's copy.
   Keep in step with lib/workshop-events.js (the server's copy).

   One workshop a quarter, 20 owners. The page lists the next three:
   dated ones take seats ($250 deposit, or no deposit on the private client
   link); a quarter with date: null takes priority reservations only.

   To announce a quarter's date: fill in its date fields here AND in
   lib/workshop-events.js, then email that quarter's priority tag first.
   ═══════════════════════════════════════════════════════════════ */

export const SEAT_CAP = 20;
export const SHOW_COUNT_AT = 10;        /* "Open" until this many seats are left, then the number */
export const SHOW_PRIORITY_FROM = 5;    /* the priority-list count appears once it reaches this */

export const WORKSHOPS = [
  { id: "2026q4", quarter: "Q4 2026", date: "2026-12-11",
    short: "Fri, Dec 11", long: "Friday, December 11, 2026", time: "Noon – 5:00 PM" },
  { id: "2027q1", quarter: "Q1 2027", date: null },
  { id: "2027q2", quarter: "Q2 2027", date: null },
];

/* What a card shows, from the live counts. counts === null (not loaded, or the
   count couldn't be read) never shows a number - just "Open". */
export function statusOf(w, counts) {
  const c = counts?.[w.id];
  if (!w.date) {
    const n = c?.priority || 0;
    return { kind: "priority", label: "Priority list open", priority: n >= SHOW_PRIORITY_FROM ? n : null };
  }
  if (!c) return { kind: "seat", label: "Open", left: null };
  const left = Math.max(0, SEAT_CAP - (c.seat || 0));
  if (left === 0) return { kind: "waitlist", label: "Full", left: 0 };
  if (left <= SHOW_COUNT_AT) return { kind: "seat", label: `${left} seat${left === 1 ? "" : "s"} left`, left };
  return { kind: "seat", label: "Open", left };
}
