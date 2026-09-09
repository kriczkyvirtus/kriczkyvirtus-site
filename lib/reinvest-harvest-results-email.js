/* ═══════════════════════════════════════════════════════════════
   REINVEST OR HARVEST — RESULTS EMAIL (plain-text style)

   Deliberately undesigned. No dark theme, no cards, no score bars,
   no images. Reasons:
     · image-heavy dark HTML is a strong "bulk mail" signal to Gmail's
       tab classifier, and this is a first send to a cold address every time
     · a plain email reads as written by a person, which is what earns the click
     · nothing here can break in Outlook, because there is nothing to break

   Still HTML rather than true text/plain, purely so the CTA can be anchor
   text instead of a bare URL. The text alternative below is a real fallback.
   ═══════════════════════════════════════════════════════════════ */

const P = "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:15px;line-height:24px;color:#222222;margin:0 0 18px;";
const A = "color:#1155cc;text-decoration:underline;font-weight:bold;";

const REPORT_BASE = "https://www.kriczkyvirtus.com/r";
const NEXT_BASE   = "https://www.kriczkyvirtus.com/reinvest-harvest/next";
const UNSUB_URL   = "https://www.kriczkyvirtus.com/unsubscribe";

const QUADRANTS = {
  reinvest: {
    label: "Reinvest-Weighted",
    aka: "Aka — both sides are built. You can push hard, and a bad year wouldn't take everything with it.",
    sting: "The risk from here is quiet: strong years are exactly when owners stop funding the side that isn't the business.",
  },
  split: {
    label: "Concentrated Inside",
    aka: "Aka — almost every extra dollar has gone back into the business. That's how you built this engine.",
    sting: "It's also how owners in this spot end up with everything riding on one asset. The job now is paying yourself first without stalling growth.",
  },
  harvest: {
    label: "Harvest-Weighted",
    aka: "Aka — you've built the outside, which most owners never do. But money aimed at growth right now mostly buys activity.",
    sting: "That doesn't mean stop reinvesting. It means the highest-return place to put money isn't more growth — it's the one thing choking what your current growth produces.",
  },
  stabilize: {
    label: "Stabilize First",
    aka: "Aka — neither side is ready for the question yet, and reinvesting into it as-is just makes you busier.",
    sting: "That sounds discouraging and shouldn't. It's the position where the fewest changes produce the largest visible difference.",
  },
};

const QUALIFIED = ["$1M - $3M", "$3M - $10M", "$10M+"];
const routeTo = (revenueBand, ownerTier) =>
  (ownerTier === "Leadership" || ownerTier === "Employee") ? "collective"
    : (QUALIFIED.includes(revenueBand) ? "oneToOne" : "collective");

const GUESS_LABEL = { reinvest: "Reinvest", harvest: "Take profit", split: "Split" };
const esc = (s = "") => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function renderResultsEmail({
  firstName = "there",
  company = "",
  token,
  quadrantKey = "split",
  bizScore = 0,
  persScore = 0,
  guess = null,
  revenueBand = "",
  ownerTier = "Owner",
}) {
  const q = QUADRANTS[quadrantKey];
  const reportUrl = REPORT_BASE + "/" + token;
  const nextUrl = NEXT_BASE + "?t=" + token;
  const offer = routeTo(revenueBand, ownerTier);
  const disagreed = guess && guess !== quadrantKey;

  const subjectCo = company ? " for " + company : "";
  const subject = "Here's your Reinvest or Harvest scorecard" + subjectCo;
  const where = company ? "Where " + company + " landed:" : "Where you landed:";
  const preheader = "Where you landed: " + q.label + ". Business " + bizScore + "/30, Personal " + persScore + "/30.";

  /* The guess mismatch is the strongest line available — it tells them
     something about themselves they didn't already know. */
  const agreed = guess && guess === quadrantKey;
  const mismatch = disagreed
    ? '<p style="' + P + '">You went into this leaning <strong>' + esc(GUESS_LABEL[guess]) + '</strong>. Your answers didn\'t agree.</p>'
    : agreed
      ? '<p style="' + P + '">You went into this leaning <strong>' + esc(GUESS_LABEL[guess]) + '</strong>, and your answers agree. That\'s a confident read.</p>'
      : "";
  const mismatchText = disagreed
    ? "You went into this leaning " + GUESS_LABEL[guess] + ". Your answers didn't agree.\n\n"
    : agreed
      ? "You went into this leaning " + GUESS_LABEL[guess] + ", and your answers agree. That's a confident read.\n\n"
      : "";

  const ps = offer === "oneToOne"
    ? 'PS: Naming the position is one thing. Knowing which specific dollar to move next takes a look at your actual numbers, not self-reported answers. If you want to do that, <a href="' + nextUrl + '" style="' + A + '">there\'s a short video and a calendar here</a>.'
    : 'PS: Naming the position is one thing. Working through it alongside other owners doing the same is another. <a href="' + nextUrl + '" style="' + A + '">There\'s a short video and a link to the Virtus Collective here</a> — it\'s free.';
  const psText = offer === "oneToOne"
    ? "PS: Naming the position is one thing. Knowing which specific dollar to move next takes a look at your actual numbers, not self-reported answers. If you want to do that, there's a short video and a calendar here:\n" + nextUrl
    : "PS: Naming the position is one thing. Working through it alongside other owners doing the same is another. There's a short video and a link to the Virtus Collective here (it's free):\n" + nextUrl;

  const html = '<!DOCTYPE html>\n<html>\n<head>\n<meta charset="utf-8" />\n<meta name="viewport" content="width=device-width,initial-scale=1" />\n<title>' + esc(subject) + '</title>\n</head>\n<body style="margin:0;padding:0;background-color:#ffffff;">\n' +
'<div style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">' + esc(preheader) + '</div>\n' +
'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;">\n' +
'<tr><td align="left" style="padding:24px 20px 40px;">\n' +
'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">\n<tr><td>\n\n' +
'<p style="' + P + '">' + esc(firstName) + ',</p>\n\n' +
'<p style="' + P + '">Your results are in.</p>\n\n' +
'<p style="' + P + '">' + esc(where) + '</p>\n\n' +
'<p style="' + P + '"><strong style="font-size:17px;">' + esc(q.label) + '</strong></p>\n\n' +
'<p style="' + P + '">' + esc(q.aka) + '</p>\n\n' +
mismatch + '\n\n' +
'<p style="' + P + '">Business Capacity: <strong>' + bizScore + '/30</strong><br />\nPersonal Foundation: <strong>' + persScore + '/30</strong></p>\n\n' +
'<p style="' + P + '">' + esc(q.sting) + '</p>\n\n' +
'<p style="' + P + '">Your scorecard walks through why you landed there, all ten scores, what each question was actually measuring, and three moves calibrated to how you scored — not generic advice.</p>\n\n' +
'<p style="' + P + '"><a href="' + reportUrl + '" style="' + A + '">Read your scorecard here</a></p>\n\n' +
'<p style="' + P + '">It\'s yours to keep either way.</p>\n\n' +
'<p style="' + P + '">Edward</p>\n\n' +
'<p style="' + P + '">' + ps + '</p>\n\n' +
'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:32px;border-top:1px solid #e4e4e4;">\n' +
'<tr><td style="padding-top:16px;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Arial,sans-serif;font-size:12px;line-height:18px;color:#888888;">\n' +
'Educational self-assessment only, based entirely on your own answers. Not individualized financial, tax, legal, or accounting advice, and no outcome is projected or guaranteed. Coordinate any decision with your CPA, attorney, and other advisors.<br /><br />\n' +
'Kriczky Virtus &middot; Downingtown, PA &middot; <a href="' + UNSUB_URL + '" style="color:#888888;">Unsubscribe</a>\n' +
'</td></tr>\n</table>\n\n</td></tr>\n</table>\n</td></tr>\n</table>\n</body>\n</html>';

  const text = firstName + ",\n\n" +
"Your results are in.\n\n" +
where + "\n\n" +
q.label + "\n\n" +
q.aka + "\n\n" +
mismatchText +
"Business Capacity: " + bizScore + "/30\n" +
"Personal Foundation: " + persScore + "/30\n\n" +
q.sting + "\n\n" +
"Your scorecard walks through why you landed there, all ten scores, what each question was actually measuring, and three moves calibrated to how you scored — not generic advice.\n\n" +
"Read your scorecard here:\n" + reportUrl + "\n\n" +
"It's yours to keep either way.\n\n" +
"Edward\n\n" +
psText + "\n\n" +
"---\n" +
"Educational self-assessment only, based entirely on your own answers. Not individualized financial, tax, legal, or accounting advice, and no outcome is projected or guaranteed. Coordinate any decision with your CPA, attorney, and other advisors.\n\n" +
"Kriczky Virtus · Downingtown, PA\n" +
"Unsubscribe: " + UNSUB_URL;

  return { subject, preheader, html, text };
}

export default renderResultsEmail;
