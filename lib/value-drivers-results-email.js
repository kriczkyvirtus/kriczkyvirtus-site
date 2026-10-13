/* ═══════════════════════════════════════════════════════════════
   VALUE DRIVERS — RESULTS EMAIL (plain-text style)
   Same deliberately undesigned format as the Reinvest or Harvest email:
   reads as written by a person, nothing to break in Outlook.
   Two doors: the website version points at the call page; the workshop
   version carries the ten scores for workbook page 7.
   ═══════════════════════════════════════════════════════════════ */

const P = "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:15px;line-height:24px;color:#222222;margin:0 0 18px;";
const A = "color:#1155cc;text-decoration:underline;font-weight:bold;";

const SITE = "https://www.kriczkyvirtus.com";
const REPORT_BASE = SITE + "/tools/wmbw/r";
const NEXT = { site: SITE + "/tools/wmbw/next", workshop: SITE + "/workshop-rh/value-drivers/next" };
const UNSUB_URL = SITE + "/unsubscribe";

const ZONES = {
  foundation:  { label: "Foundation Zone",  line: "The business can't grow unless you carry it. Build the base first - it's where small changes move the needle the most." },
  constrained: { label: "Constrained Zone", line: "It's growing, but gaps in the foundation constrain how far and how fast. The gaps are specific, which means they're fixable." },
  midpoint:    { label: "Midpoint Zone",    line: "The model works but isn't nailed yet. Scaling from here amplifies the gaps along with the strengths." },
  green:       { label: "Green Zone",       line: "Attractive and ready. The model is nailed and built to scale - the work now is protecting that and pushing the two lowest drivers up so that continued growth is sustainable." },
  bestInClass: { label: "Best-in-Class",    line: "Scalable, resilient, and it runs without you. Few owners get here. The job now is keeping it there as the business grows." },
};

const DRIVERS = [
  ["marketPosition", "Market Position"], ["revenueQuality", "Revenue Quality & Growth"],
  ["financialPerformance", "Financial Performance & Margins"], ["customerConcentration", "Customer Concentration"],
  ["managementTeam", "Operational Independence"], ["documentation", "Documentation"],
  ["contingency", "Contingency & Risk"], ["financialInfra", "Financial Reporting"],
  ["revPredictability", "Revenue Predictability"], ["succession", "Leadership Depth"],
];

const esc = (s = "") => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function renderResultsEmail({
  firstName = "there",
  company = "",
  token,
  door = "site",
  zoneKey = "midpoint",
  attractScore = 0,
  readyScore = 0,
  guess = null,
  scores = {},
}) {
  const z = ZONES[zoneKey] || ZONES.midpoint;
  const reportUrl = REPORT_BASE + "/" + token;
  const nextUrl = (NEXT[door] || NEXT.site) + "?t=" + token;
  const workshop = door === "workshop";

  const subject = workshop
    ? "Your Value Drivers pre-work results"
    : "Your Value Drivers results" + (company ? " for " + company : "");
  const preheader = "Where you landed: " + z.label + ". Attractiveness " + attractScore + "/30, Readiness " + readyScore + "/30.";

  const guessZone = guess ? ZONES[guess] : null;
  const agreed = guessZone && guess === zoneKey;
  const guessLine = guessZone
    ? (agreed
      ? "You guessed " + guessZone.label + ", and your answers agree. That's a clear-eyed read."
      : "You guessed " + guessZone.label + ". Your answers put you somewhere else.")
    : "";

  const rows = DRIVERS.map(([k, n], i) => String(i + 1).padStart(2, "0") + "  " + n + ": " + (scores[k] ?? "-"));
  const workbookHtml = workshop
    ? '<p style="' + P + '">For your workbook, page 7 (Station 02):<br />' + rows.map(esc).join("<br />") + "</p>\n\n"
    : "";
  const workbookText = workshop ? "For your workbook, page 7 (Station 02):\n" + rows.join("\n") + "\n\n" : "";

  const ps = workshop
    ? 'PS: Bring these with you. <a href="' + nextUrl + '" style="' + A + '">There\'s a short video here</a> on how we\'ll use them on the day.'
    : 'PS: A zone is a direction, not a plan. If you want to see which two drivers would unlock the most growth, using your real numbers, <a href="' + nextUrl + '" style="' + A + '">you can book a free working session here</a>.';
  const psText = workshop
    ? "PS: Bring these with you. There's a short video on how we'll use them on the day:\n" + nextUrl
    : "PS: A zone is a direction, not a plan. If you want to see which two drivers would unlock the most growth, using your real numbers, you can book a free working session here:\n" + nextUrl;

  const html = '<!DOCTYPE html>\n<html>\n<head>\n<meta charset="utf-8" />\n<meta name="viewport" content="width=device-width,initial-scale=1" />\n<title>' + esc(subject) + '</title>\n</head>\n<body style="margin:0;padding:0;background-color:#ffffff;">\n' +
'<div style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">' + esc(preheader) + '</div>\n' +
'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;">\n' +
'<tr><td align="left" style="padding:24px 20px 40px;">\n' +
'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">\n<tr><td>\n\n' +
'<p style="' + P + '">' + esc(firstName) + ',</p>\n\n' +
'<p style="' + P + '">Your Value Drivers results are in. ' + (company ? "Where " + esc(company) + " landed:" : "Where you landed:") + '</p>\n\n' +
'<p style="' + P + '"><strong style="font-size:17px;">' + esc(z.label) + '</strong></p>\n\n' +
'<p style="' + P + '">' + esc(z.line) + '</p>\n\n' +
(guessLine ? '<p style="' + P + '">' + esc(guessLine) + '</p>\n\n' : "") +
'<p style="' + P + '">Attractiveness: <strong>' + attractScore + '/30</strong><br />\nReadiness: <strong>' + readyScore + '/30</strong></p>\n\n' +
workbookHtml +
'<p style="' + P + '">Your full report walks through all ten drivers, what each one measures, the two holding your growth opportunities back, and three moves calibrated to how you scored.</p>\n\n' +
'<p style="' + P + '"><a href="' + reportUrl + '" style="' + A + '">Read your full report here</a></p>\n\n' +
'<p style="' + P + '">It\'s yours to keep either way.</p>\n\n' +
'<p style="' + P + '">Edward</p>\n\n' +
'<p style="' + P + '">' + ps + '</p>\n\n' +
'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:32px;border-top:1px solid #e4e4e4;">\n' +
'<tr><td style="padding-top:16px;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Arial,sans-serif;font-size:12px;line-height:18px;color:#888888;">\n' +
'Educational self-assessment only, based entirely on your own answers. A valuation estimate, not a valuation. Not individualized financial, tax, legal, or accounting advice, and no outcome is projected or guaranteed.<br /><br />\n' +
'Kriczky Virtus &middot; Downingtown, PA &middot; <a href="' + UNSUB_URL + '" style="color:#888888;">Unsubscribe</a>\n' +
'</td></tr>\n</table>\n\n</td></tr>\n</table>\n</td></tr>\n</table>\n</body>\n</html>';

  const text = firstName + ",\n\n" +
"Your Value Drivers results are in. " + (company ? "Where " + company + " landed:" : "Where you landed:") + "\n\n" +
z.label + "\n\n" + z.line + "\n\n" +
(guessLine ? guessLine + "\n\n" : "") +
"Attractiveness: " + attractScore + "/30\nReadiness: " + readyScore + "/30\n\n" +
workbookText +
"Your full report walks through all ten drivers, what each one measures, the two holding your growth opportunities back, and three moves calibrated to how you scored.\n\n" +
"Read your full report here:\n" + reportUrl + "\n\n" +
"It's yours to keep either way.\n\nEdward\n\n" + psText + "\n\n---\n" +
"Educational self-assessment only, based entirely on your own answers. A valuation estimate, not a valuation. Not individualized financial, tax, legal, or accounting advice, and no outcome is projected or guaranteed.\n\n" +
"Kriczky Virtus · Downingtown, PA\nUnsubscribe: " + UNSUB_URL;

  return { subject, preheader, html, text };
}

export default renderResultsEmail;
