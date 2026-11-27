import { useState } from "react";
import { C, T, glow, CARD, KICKER, HaloButton } from "./CreamKit.jsx";
import { CreamPage, TopPill, EdwardCard, CONSENT } from "./CreamBooking.jsx";
import { ContactFooter } from "./CreamKit.jsx";

// ═══════════════════════════════════════════════════════════════════
// COHORT - Application Page
// URL: /cohort
//
// Sells the semi-private cohort program and captures applications.
// POSTs to /api/lead-capture with tool: "cohort-waitlist".
//
// Server must apply: Cohort: Waitlist (46), Source: Website (8),
// Entry: Lead Magnet (42), tier tag, and write Revenue Range +
// Business Constraint fields. Do NOT apply Website Lead.
//
// Cream (27 Nov 2026): the engraved ground, porcelain tiles and pills,
// report glow cards, white inputs, the dark halo button - as on /workshop-rh.
// Copy, form fields and the submit payload unchanged.
// ═══════════════════════════════════════════════════════════════════

const H = { fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, color: C.ink1, letterSpacing: "-.015em", lineHeight: 1.1, margin: "0 0 14px", fontSize: "clamp(30px,5vw,44px)", textWrap: "balance" };
const EM = { fontStyle: "italic", fontWeight: 500, color: T.gold.ink };
const P = { fontSize: "clamp(14.5px,2vw,16px)", lineHeight: 1.7, color: C.ink2, margin: "0 0 14px" };
const SEC = { marginBottom: "clamp(48px,7vw,72px)" };

/* Each item's metallic icon, in a porcelain tile. */
const ICONS = {
  people: "/icons/roadmap-system/get-gold.png",
  calendar: "/icons/reinvest-harvest/c1.png",
  bars: "/icons/reinvest-harvest/c2.png",
  call: "/icons/roadmap-system/shield.png",
};
const Tile = ({ name, size = 52 }) => (
  <span className="tile" style={{ width: size, height: size, borderRadius: Math.round(size * 0.27) }}>
    <img src={ICONS[name]} alt="" width={Math.round(size * 0.66)} height={Math.round(size * 0.66)} draggable="false" style={{ display: "block" }} /></span>
);

const Mark = ({ kind }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
    stroke={kind === "yes" ? T.green.ink : T.red.ink} strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0, marginTop: 3 }}>
    {kind === "yes"
      ? <path d="M3 8.5L6.3 11.8L13 5" />
      : <><path d="M4 4l8 8" /><path d="M12 4l-8 8" /></>}
  </svg>
);

/* ═══════════════════ CONTENT ═══════════════════ */

const INCLUDED = [
  { icon: "people", title: "Biweekly working sessions", desc: "Ten owners in the same revenue tier - the weekly community call is open to every member, this is the small room. We work through your actual constraints with accountability from Kriczky Virtus and from nine people who understand the problem because they're living it." },
  { icon: "calendar", title: "Quarterly “Reinvest or Harvest” Workshops - Tactical 90-Day Sprints", desc: "Every quarter, you and your cohort sit down with your real numbers alongside other owners and decide exactly where the next dollar goes for the next 90 days - back into the business, or out to you. These are tactical working sessions where you leave with a focused reinvestment roadmap for the business, made with your tax situation and what you are building outside the company in view. Not generic advice, and coordinated with your CPA - not tax advice." },
];

const VIP_INCLUDED = [
  { icon: "bars", title: "Your own business metrics dashboard", desc: "KPIs and what-if scenarios built on your numbers. What happens to margin and cash if you hire two more, open the second location, or lose your largest account - before you commit to any of it." },
  { icon: "call", title: "One 90-minute business 1-on-1 per month", desc: "Time with the Kriczky Virtus team on your business operations and decision-making. Use it when you need it within the month; it does not roll over." },
];

const NOT_FOR = [
  "You want broad tax tips or theory, not a working session built around your actual P&L, balance sheet, and tax return.",
  "You aren't comfortable sharing real numbers alongside a vetted cohort and other owners, or letting us coordinate with your CPA.",
  "You're looking for someone to hand you a plan and disappear, instead of committing to execute a 90-day sprint.",
  "You're content with the business staying roughly where it is over the next year.",
];

const FOR = [
  "Your business is doing real revenue and profit, but you can't clearly see where the next dollar should go.",
  "You want one room where reinvestment, tax, and what you are building outside the business get looked at together, instead of three advisors giving conflicting answers.",
  "You're willing to share real numbers with other owners alongside you so you can pressure-test decisions together.",
  "You like operating in 90-day sprints and want to walk out of each workshop with two or three concrete moves to execute before the next one.",
];

const REVENUE_OPTIONS = [
  "Under $500K",
  "$500K - $1M",
  "$1M - $3M",
  "$3M - $10M",
  "$10M+",
];

const OWNERSHIP_OPTIONS = [
  "I'm the sole owner",
  "I own at least 51%",
  "I own 20%-50%",
  "I own less than 20%",
  "I'm not an owner but I'm on the leadership team",
  "I'm not a business owner",
];

const TIER_OPTIONS = [
  "Premium - $797/mo",
  "VIP - $3,000/mo",
  "Either - help me choose",
  "Not sure yet",
];

const TIMELINE_OPTIONS = [
  "Ready now",
  "Next 90 days",
  "Just exploring",
];

/* ═══════════════════ FORM PRIMITIVES ═══════════════════ */

const Label = ({ children }) => (
  <div style={{ fontSize: 12.5, fontWeight: 600, color: C.ink2, marginBottom: 7 }}>{children}</div>
);
const inputStyle = {
  width: "100%", padding: "14px 16px", borderRadius: 10, background: "#FFFFFF",
  border: `1px solid ${C.rule}`, color: C.ink1, fontSize: 16,
  fontFamily: "'DM Sans', sans-serif", outline: "none", boxSizing: "border-box", colorScheme: "light",
};
const Field = ({ label, children }) => (
  <div style={{ marginBottom: 18 }}>
    <Label>{label}</Label>
    {children}
  </div>
);
const TextInput = (props) => <input {...props} className="ch-in" style={inputStyle} />;
const TextArea = (props) => <textarea {...props} rows={3} className="ch-in" style={{ ...inputStyle, resize: "vertical", lineHeight: 1.55 }} />;
const CHEVRON = "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%236B6459' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E";
const Select = ({ options, value, onChange, placeholder = "Select one" }) => (
  <select value={value} onChange={e => onChange(e.target.value)} className="ch-in"
    style={{ ...inputStyle, appearance: "none", WebkitAppearance: "none", MozAppearance: "none", paddingRight: 46, cursor: "pointer",
      color: value ? C.ink1 : C.ink3, backgroundImage: `url("${CHEVRON}")`, backgroundRepeat: "no-repeat",
      backgroundPosition: "right 18px center", backgroundSize: "14px 14px" }}>
    <option value="" disabled>{placeholder}</option>
    {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
  </select>
);
const Hint = ({ children }) => (
  <p style={{ fontSize: 12.5, lineHeight: 1.6, color: C.ink3, margin: "9px 0 0" }}>{children}</p>
);

/* ═══════════════════ APPLICATION FORM ═══════════════════ */

const ApplicationForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [revenue, setRevenue] = useState("");
  const [constraint, setConstraint] = useState("");
  const [ownership, setOwnership] = useState("");
  const [tier, setTier] = useState("");
  const [timeline, setTimeline] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async () => {
    if (!name.trim()) return setError("Please enter your name.");
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("Please enter a valid email address.");
    if (!revenue) return setError("Please select your annual revenue.");
    if (!ownership) return setError("Please tell me how ownership is structured.");
    if (!constraint.trim()) return setError("Tell me what's getting in your way - this is the most useful thing on the form.");
    if (!tier) return setError("Please select which tier you're interested in.");
    if (!timeline) return setError("Please select a timeline.");

    setError(""); setSending(true);

    const payload = {
      name: name.trim(),
      email: email.trim(),
      tool: "cohort-waitlist",
      toolName: "Cohort Application",
      revenueRange: revenue,
      ownership,
      tierInterest: tier,
      businessConstraint: constraint.trim(),
      timeline,
      reason: reason.trim(),
      timestamp: new Date().toISOString(),
    };

    try {
      const res = await fetch("/api/lead-capture", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });
      if (res.ok) { setDone(true); return; }
      throw new Error("API unavailable");
    } catch (err) {
      console.log("[Virtus] Cohort API failed, queuing retry:", err.message || err);
      const retryFn = async (attempt) => {
        if (attempt > 5) { console.log("[Virtus] All retries exhausted."); return; }
        try {
          const r = await fetch("/api/lead-capture", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
          if (r.ok) { console.log("[Virtus] Retry " + attempt + " succeeded"); return; }
          throw new Error("Retry failed");
        } catch (e) { setTimeout(() => retryFn(attempt + 1), 30000 * attempt); }
      };
      setTimeout(() => retryFn(1), 30000);
      setDone(true);
    } finally { setSending(false); }
  };


  if (done) {
    return (
      <div style={{ ...glow(T.gold), padding: "clamp(40px,6vw,52px) clamp(22px,5vw,40px)", textAlign: "center" }}>
        <span className="tile" style={{ width: 72, height: 72, borderRadius: 20, marginBottom: 20 }}>
          <img src="/icons/roadmap-system/shield.png" alt="" width="50" height="50" draggable="false" style={{ display: "block" }} /></span>
        <h3 style={{ ...H, fontSize: "clamp(24px,4vw,30px)" }}>Application received</h3>
        <p style={{ ...P, maxWidth: 440, margin: "0 auto" }}>
          I read every one of these personally. If there's a fit, I'll reach out when the next cohort opens with details on timing and seats. If there isn't, I'll tell you that too - and point you somewhere more useful.
        </p>
      </div>
    );
  }

  return (
    <div style={{ ...CARD, padding: "clamp(26px,4.5vw,40px) clamp(20px,4.5vw,36px)" }}>
      <Field label="Your name">
        <TextInput type="text" placeholder="Full name" value={name} autoComplete="name"
          onChange={e => { setName(e.target.value); setError(""); }} />
      </Field>
      <Field label="Email">
        <TextInput type="email" placeholder="you@company.com" value={email} autoComplete="email"
          onChange={e => { setEmail(e.target.value); setError(""); }} />
      </Field>
      <Field label="Annual revenue">
        <Select options={REVENUE_OPTIONS} value={revenue} onChange={v => { setRevenue(v); setError(""); }} />
        {revenue === "$10M+" && (
          <Hint>Cohorts run up to $10M. Above that is a different conversation - apply anyway and I&rsquo;ll point you to the right one.</Hint>
        )}
      </Field>
      <Field label="Are you the owner, or do you have partners?">
        <Select options={OWNERSHIP_OPTIONS} value={ownership} onChange={v => { setOwnership(v); setError(""); }} />
        {(ownership === "I own less than 20%" || ownership === "I'm not an owner but I'm on the leadership team" || ownership === "I'm not a business owner") && (
          <Hint>Cohorts are built for owners who can act on the decisions we work through. Apply anyway - if there is a fit, I&rsquo;ll tell you, and if there isn&rsquo;t I&rsquo;ll point you somewhere more useful.</Hint>
        )}
      </Field>
      <Field label="What's the main thing getting in your way right now?">
        <TextArea placeholder="Be specific. This is what I use to build the cohorts."
          value={constraint} onChange={e => { setConstraint(e.target.value); setError(""); }} />
      </Field>
      <Field label="Which tier are you interested in?">
        <Select options={TIER_OPTIONS} value={tier} onChange={v => { setTier(v); setError(""); }} />
        <Hint>This is an application, not a checkout. Nothing is charged here, no card is collected, and you can change tiers before you join.</Hint>
      </Field>
      <Field label="When are you looking to start?">
        <Select options={TIMELINE_OPTIONS} value={timeline} onChange={v => { setTimeline(v); setError(""); }} />
      </Field>
      <Field label="What made you interested? (optional)">
        <TextArea placeholder="An email, a video, something a friend said - whatever brought you here."
          value={reason} onChange={e => setReason(e.target.value)} />
      </Field>

      {error && <p style={{ fontSize: 13, color: T.red.ink, margin: "0 0 14px" }}>{error}</p>}

      <HaloButton onClick={submit} disabled={sending} block size={16} style={{ marginTop: 6 }}>
        {sending ? "Sending…" : "Apply for a seat"}
      </HaloButton>
      <p style={{ fontSize: 12.5, color: C.ink3, textAlign: "center", margin: "14px 0 0" }}>
        Applying doesn't commit you to anything.
      </p>
    </div>
  );
};

/* ═══════════════════ PAGE ═══════════════════ */

const TERMS_P = { ...P, fontSize: 13.5, marginBottom: 12 };

export default function Cohort() {
  return (
    <CreamPage width={840} css={`
      .ch-in:focus { border-color: ${T.gold.fill}aa !important; box-shadow: 0 0 0 3px ${T.gold.fill}22; }
      .ch-fit { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
      .ch-price { display: flex; gap: 14px; align-items: stretch; }
      @media (max-width: 760px) { .ch-fit { grid-template-columns: 1fr; } .ch-price { flex-direction: column; } }
    `}>
      <div style={{ padding: "0 22px" }}>

        {/* ─── HERO ─── */}
        <div style={{ ...SEC, textAlign: "center", paddingTop: 34 }}>
          <TopPill>The Virtus Collective - Cohorts</TopPill>
          <h1 style={{ ...H, fontSize: "clamp(32px,7vw,58px)", lineHeight: 1.06, letterSpacing: "-.02em", margin: "0 0 20px" }}>
            Nine other owners at your stage<br /><span style={EM}>who get it.</span>
          </h1>
          <p style={{ ...P, fontSize: "clamp(15px,2.4vw,18px)", maxWidth: 640, margin: "0 auto 14px" }}>
            You're making six-figure decisions with nobody looking at the whole picture. Your CPA sees last year. Your advisor sees a portfolio that's a fraction of your net worth. Your friends with W-2 jobs can't help, and your competitors aren't opening their books.
          </p>
          <p style={{ ...P, fontSize: "clamp(15px,2.4vw,18px)", color: C.ink1, fontWeight: 600, maxWidth: 640, margin: "0 auto" }}>
            This is a room for that conversation.
          </p>
        </div>

        {/* ─── WHAT IT IS ─── */}
        <div style={SEC}>
          <div style={KICKER}>What it is</div>
          <h2 style={H}>Ten owners at your scale, <span style={EM}>in the same room</span></h2>
          <p style={P}>
            Ten owners. All in the same revenue tier, so the problems are comparable and the advice actually transfers. We meet biweekly and work through what's constraining your business - with accountability from Kriczky Virtus and from nine people who understand it because they're living the same thing.
          </p>
          <p style={{ ...P, marginBottom: 0, color: C.ink1, fontWeight: 600 }}>It costs less than a part-time bookkeeper.</p>
        </div>

        {/* ─── WHAT'S INCLUDED ─── */}
        <div style={SEC}>
          <div style={KICKER}>What's included</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 18 }}>
            {INCLUDED.map(item => (
              <div key={item.title} className="lift" style={{ ...glow(T.gold, false), display: "flex", gap: 18, alignItems: "flex-start", padding: "clamp(20px,3vw,26px)" }}>
                <Tile name={item.icon} size={58} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ ...H, fontSize: "clamp(20px,2.8vw,23px)", lineHeight: 1.2, margin: "0 0 6px" }}>{item.title}</div>
                  <p style={{ ...P, fontSize: 14.5, margin: 0 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── FIT ─── */}
        <div className="ch-fit" style={SEC}>
          <div style={{ ...CARD, padding: "clamp(22px,3.4vw,28px)" }}>
            <div style={{ ...KICKER, color: T.green.ink }}>This is for you if</div>
            {FOR.map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 11, marginBottom: i === FOR.length - 1 ? 0 : 12 }}>
                <Mark kind="yes" />
                <p style={{ ...P, fontSize: 14.5, margin: 0 }}>{t}</p>
              </div>
            ))}
          </div>
          <div style={{ ...CARD, padding: "clamp(22px,3.4vw,28px)" }}>
            <div style={{ ...KICKER, color: T.red.ink }}>It isn't if</div>
            {NOT_FOR.map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 11, marginBottom: i === NOT_FOR.length - 1 ? 0 : 12 }}>
                <Mark kind="no" />
                <p style={{ ...P, fontSize: 14.5, margin: 0, color: C.ink3 }}>{t}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ─── PRICING ─── */}
        <div style={SEC}>
          <div className="ch-price">
            {/* Premium */}
            <div style={{ ...glow(T.gold), flex: 1, padding: "clamp(26px,4vw,32px) clamp(20px,3.4vw,28px)", textAlign: "center" }}>
              <div style={KICKER}>Premium - founding</div>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 7, marginBottom: 10 }}>
                <span style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(42px,6vw,54px)", fontWeight: 700, color: T.gold.ink, lineHeight: 1 }}>$797</span>
                <span style={{ fontSize: 14, color: C.ink3 }}>/month</span>
              </div>
              <p style={{ ...P, fontSize: 14 }}>The cohort room, the quarterly workshops, and everything in the free tier.</p>
              <div style={{ borderTop: `1px solid ${C.ruleLight}`, paddingTop: 14, display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
                {[["$797", "First 20"], ["$897", "Next 20"], ["$997", "After 40"]].map(([price, label], i) => (
                  <div key={i} style={{ minWidth: 74 }}>
                    <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, color: i === 0 ? T.gold.ink : C.ink3, lineHeight: 1.2 }}>{price}</div>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: C.ink4, marginTop: 4 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* VIP */}
            <div style={{ ...CARD, flex: 1, padding: "clamp(26px,4vw,32px) clamp(20px,3.4vw,28px)", textAlign: "center" }}>
              <div style={{ ...KICKER, color: C.ink3 }}>VIP - founding</div>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 7, marginBottom: 10 }}>
                <span style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(42px,6vw,54px)", fontWeight: 700, color: C.ink1, lineHeight: 1 }}>$3,000</span>
                <span style={{ fontSize: 14, color: C.ink3 }}>/month</span>
              </div>
              <p style={{ ...P, fontSize: 14 }}>Everything in Premium, plus the two things that stop progress resting entirely on you.</p>
              <div style={{ borderTop: `1px solid ${C.ruleLight}`, paddingTop: 16, textAlign: "left" }}>
                {VIP_INCLUDED.map((item, i) => (
                  <div key={item.title} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: i === VIP_INCLUDED.length - 1 ? 0 : 14 }}>
                    <Tile name={item.icon} size={40} />
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: C.ink1, marginBottom: 3 }}>{item.title}</div>
                      <p style={{ ...P, fontSize: 13, margin: 0 }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* terms */}
          <div style={{ ...CARD, padding: "clamp(20px,3.4vw,28px) clamp(20px,3.6vw,32px)", marginTop: 14 }}>
            <div style={{ ...KICKER, color: C.ink3 }}>What it is and isn&rsquo;t</div>
            <p style={TERMS_P}>
              Founding pricing on both tiers is locked for as long as your membership stays continuously active. Later members will pay more. Steps are counted by paying members across both tiers and all revenue bands.
            </p>
            <p style={TERMS_P}>
              Membership is ongoing and monthly. &ldquo;Cohort&rdquo; describes how you come in - ten owners at a time across both paid tiers, grouped by revenue band - not a program with an end date.
            </p>
            <p style={TERMS_P}>
              Sessions are group sessions. The VIP tier adds one 90-minute one-on-one call per month, covering business operations and decision-making. No tier includes personal financial planning or investment recommendations. If you want personal financial advice from Edward Kriczky, that requires a formal client relationship with Kriczky Wealth Management LLC - a separate engagement under its own agreement.
            </p>
            <p style={TERMS_P}>
              Billed monthly through Skool and renews automatically. Cancel any time. You keep access through the end of the billing period you have already paid for, and there are no refunds for partial billing periods. Cancelling is not the same as leaving the group - leaving ends access immediately, so cancel from your Skool subscription settings at least 24 hours before the renewal date. If you cancel and rejoin later, you rejoin at whatever the price is then - founding pricing does not carry over.
            </p>
            <p style={{ ...TERMS_P, fontSize: 12.5, color: C.ink3, marginBottom: 0 }}>
              Educational content only. Nothing here is individualized investment, tax, or legal advice.
            </p>
          </div>
        </div>

        {/* ─── APPLICATION ─── */}
        <div id="apply" style={{ ...SEC, scrollMarginTop: 20 }}>
          <div style={KICKER}>Apply</div>
          <h2 style={H}>Tell me <span style={EM}>where you are</span></h2>
          <p style={{ ...P, maxWidth: 600, marginBottom: 24 }}>
            I use these answers to build cohorts that actually fit together - same scale, comparable problems. It takes about two minutes.
          </p>
          <ApplicationForm />
        </div>

        {/* ─── EDWARD ─── */}
        <div style={SEC}>
          <EdwardCard>
            I work with owners in the $1M–$10M range on the thing nobody else owns: making sure the business plan, the tax plan, and the personal plan are actually one plan. As a Certified Exit Planning Advisor, I bring a structured methodology to the question every owner eventually asks - <span style={{ fontStyle: "italic", color: C.ink1 }}>"why isn't this making me more money, and what would it take to change that?"</span>
          </EdwardCard>
        </div>

        {/* ─── CONSENT + FOOTER ─── */}
        <footer style={{ paddingBottom: 50 }}>
          <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${C.rule}, transparent)`, marginBottom: 26 }} />
          <p style={{ fontSize: 11, lineHeight: 1.6, color: C.ink4, textAlign: "center", maxWidth: 620, margin: "0 auto 28px" }}>{CONSENT}</p>
          <ContactFooter />
        </footer>
      </div>
    </CreamPage>
  );
}
