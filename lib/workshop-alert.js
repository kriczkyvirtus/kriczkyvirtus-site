// lib/workshop-alert.js
// Emails Edward when someone uses a dates card on /workshop-rh: a seat (on their way
// to the $250 deposit), a client seat, a priority-list spot or a waitlist spot.
// Best effort: a failed alert is logged and never fails the registration.
// No RESEND_API_KEY (tests, local runs) → nothing is sent.

const TO = "ekriczky@kriczkyvirtus.com";

const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

/* "2026q4" → "Q4 2026"; "2026-12-04" → "Fri, Dec 4, 2026" */
const quarterLabel = (id) => (id ? id.replace(/^(\d{4})q([1-4])$/, "Q$2 $1") : "");
const dateLabel = (iso) => {
  if (!iso) return "";
  const d = new Date(`${iso}T12:00:00Z`);
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
};

const HEADLINE = {
  seat: "Seat started - on to the $250 deposit",
  client: "Client seat reserved (no deposit)",
  priority: "Priority list sign-up",
  waitlist: "Waitlist sign-up",
};

function buildAlert(d) {
  const when = d.workshopDate ? dateLabel(d.workshopDate) : (d.workshopId ? quarterLabel(d.workshopId) : "next workshop");
  const subject = `Workshop ${d.kind === "priority" ? "priority list" : d.kind === "waitlist" ? "waitlist" : d.kind === "client" ? "client seat" : "seat"}: ${d.name}${d.company ? ` (${d.company})` : ""} - ${when}`;
  const rows = [
    ["Workshop", `${when}${d.workshopId ? ` (${d.workshopId})` : ""}`],
    ["Name", d.name],
    ["Company", d.company],
    ["Email", `<a href="mailto:${esc(d.email)}">${esc(d.email)}</a>`, true],
    ["Phone", d.phone],
    ["Revenue", d.revenue],
    ["Outcome wanted", d.outcome],
    ["Appetite for help", d.appetite],
    ["Referred by", d.ref],
    ["Source", [d.utmSource, d.utmMedium, d.utmCampaign].filter(Boolean).join(" / ")],
  ].filter(([, v]) => v);
  const note = d.kind === "seat"
    ? "They've been sent to the Stripe deposit page. The seat only counts once the deposit is paid."
    : d.kind === "priority"
      ? "No deposit. They hear first when this quarter's date is set."
      : d.kind === "waitlist"
        ? "No deposit. This date was full when they signed up."
        : "Reserved through the private client link. No deposit.";
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:24px;background:#F2EEE6;font-family:Arial,sans-serif;color:#0A0E14;">
  <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
  <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#FFFFFF;border:1px solid #E6DFD1;border-radius:14px;">
    <tr><td style="padding:26px 26px 8px;">
      <div style="font-size:11px;font-weight:bold;letter-spacing:.16em;text-transform:uppercase;color:#7A5C1E;">Reinvest or Harvest Workshop</div>
      <h1 style="font-family:Georgia,serif;font-size:22px;font-weight:normal;margin:8px 0 6px;">${esc(HEADLINE[d.kind] || "Workshop sign-up")}</h1>
      <p style="font-size:13px;color:#6B6459;margin:0 0 14px;">${esc(note)}</p>
    </td></tr>
    <tr><td style="padding:0 26px 10px;"><table width="100%" cellpadding="0" cellspacing="0">
      ${rows.map(([k, v, raw]) => `<tr><td style="padding:7px 0;border-top:1px solid #EFE9DD;font-size:12px;color:#6B6459;width:150px;vertical-align:top;">${k}</td><td style="padding:7px 0;border-top:1px solid #EFE9DD;font-size:14px;">${raw ? v : esc(v)}</td></tr>`).join("")}
    </table></td></tr>
    <tr><td style="padding:8px 26px 24px;font-size:12px;color:#6B6459;">Live counts: <a href="https://www.kriczkyvirtus.com/api/workshop-seats" style="color:#7A5C1E;">kriczkyvirtus.com/api/workshop-seats</a></td></tr>
  </table></td></tr></table>
</body></html>`;
  return { subject, html };
}

async function sendWorkshopAlert(details) {
  if (!process.env.RESEND_API_KEY) return { skipped: true };
  try {
    const { Resend } = require("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { subject, html } = buildAlert(details);
    await resend.emails.send({
      from: "Kriczky Virtus <growth@kriczkyvirtus.com>",
      to: TO,
      replyTo: details.email,
      subject,
      html,
    });
    console.log(`[Workshop] Alert sent: ${details.kind} ${details.workshopId || "next"} for ${details.email}`);
    return { sent: true };
  } catch (err) {
    console.error("[Workshop] Alert email failed:", err.message);
    return { failed: true };
  }
}

module.exports = { sendWorkshopAlert, buildAlert };
