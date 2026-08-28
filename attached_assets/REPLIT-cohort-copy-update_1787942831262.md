# Replit deployment prompt — Cohort.jsx

Copy everything below the line into Replit.

---

# TASK: copy edits and ONE new block in `Cohort.jsx`

## SCOPE — read this before touching anything

This is a **copy change**, plus **one new block** appended inside the existing
pricing section. It is **not** a redesign.

**DO NOT change any of the following. Not one value.**

- The `C` color token object, or any color anywhere
- The `CARD` style object
- The `H`, `P`, `Eyebrow`, `Label`, `Shield`, `Grain` components — signatures or styles
- `inputStyle`, `SectionGap`, or any padding, margin, radius, font size, font family, letter spacing, line height, shadow, border, or gradient on any element that already exists
- The mobile breakpoint logic or the `mob` conditionals
- The form, its state, its validation, the API call, the payload shape, or the tag IDs
- Section order, section wrappers, or `marginBottom` on any section
- Anything in any other file

**The new block must reuse existing primitives only** — `CARD`, `Eyebrow`, `P`,
`C.gold`, `C.text1`, `C.text2`, `C.text3`, `C.border1`, and `mob`. Do not
introduce a new color, a new style constant, or a new component.

If a change below appears to require a style change, stop and report it rather
than improvising one.

---

## PART A — six copy replacements

Each is an exact-string find and replace. Match the full string. If any string
is not found verbatim, **stop and report which one** — do not fuzzy-match.

### A1 — `INCLUDED[0]`, biweekly sessions

FIND:
```
{ title: "Biweekly working sessions", desc: "Ten owners in the same revenue tier. We work through your actual constraints with accountability from me and from nine people who understand the problem because they're living it." },
```
REPLACE:
```
{ title: "Biweekly working sessions", desc: "Ten owners in the same revenue tier — the weekly community call is open to every member, this is the small room. We work through your actual constraints with accountability from Kriczky Virtus and from nine people who understand the problem because they're living it." },
```

### A2 — `INCLUDED[1]`, monthly session

FIND:
```
{ title: "A monthly financials-only session", desc: "One session every month is entirely your numbers. Margins, cash flow, revenue quality, where the money is actually going." },
```
REPLACE:
```
{ title: "A monthly business metrics-only session", desc: "One session every month is entirely your numbers. Margins, cash flow, revenue quality, where your specific reinvestment opportunities live." },
```

### A3 — `INCLUDED[2]`, dashboard

FIND:
```
{ title: "Your own metrics dashboard", desc: "A personalized business and financial dashboard benchmarked against your industry — not a generic average." },
```
REPLACE:
```
{ title: "Your own operating dashboard", desc: "A personalized business operating dashboard — margin, cash conversion, capacity, concentration — benchmarked against your industry rather than a generic average." },
```

### A4 — `INCLUDED[3]`, workshops

FIND:
```
{ title: "Tax and wealth workshops", desc: "The levers most owners at your level have never had walked through, and how they connect to what the business is doing." },
```
REPLACE:
```
{ title: "Tax and Business Reinvestment Workshops", desc: "The levers most owners at your level have never had walked through, and how they connect to what the business is doing. Educational, and coordinated with your CPA — not tax advice." },
```

### A5 — hero eyebrow and headline

FIND:
```
          <Eyebrow>The Virtus Collective — Cohort Program</Eyebrow>
```
REPLACE:
```
          <Eyebrow>The Virtus Collective — Cohorts</Eyebrow>
```

FIND:
```
            Nine other owners<br />
```
REPLACE:
```
            Nine other owners at your stage<br />
```

The `<span style={{ color: C.gold }}>who get it.</span>` line directly below is
unchanged. Do not alter the `h1` style object.

### A6 — "what it is" section

FIND:
```
          <H mob={mob}>An outsourced finance team, in a room</H>
```
REPLACE:
```
          <H mob={mob}>Ten owners at your scale, in the same room</H>
```

FIND:
```
with accountability from me and from nine people who understand it because they're living the same thing.
```
REPLACE:
```
with accountability from Kriczky Virtus and from nine people who understand it because they're living the same thing.
```

---

## PART B — replace the pricing section

Replace the whole block that begins with the comment
`{/* ─── PRICING ────────────────────────────── */}` and ends with the `</div>`
immediately before `{/* ─── APPLICATION ────────────────────────── */}`.

The current block is roughly 16 lines. The replacement adds a three-step price
ladder and a second card holding the membership terms.

```jsx
        {/* ─── PRICING ────────────────────────────── */}
        <div style={{ marginBottom: SectionGap }}>
          <div style={{ ...CARD, padding: mob ? "28px 22px" : "38px 34px", textAlign: "center", border: `1px solid ${C.gold}30`, background: `linear-gradient(135deg, ${C.gold}0A, ${C.gold}04)` }}>
            <Eyebrow>Founding members</Eyebrow>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 8, marginBottom: 12 }}>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: mob ? 46 : 60, fontWeight: 700, color: C.gold, lineHeight: 1 }}>$797</span>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: C.text2 }}>/month</span>
            </div>
            <P mob={mob} style={{ maxWidth: 520, margin: "0 auto 4px", color: C.text1 }}>
              Locked for as long as your membership stays continuously active.
            </P>
            <P mob={mob} style={{ maxWidth: 520, margin: "0 auto 22px", fontSize: 13 }}>
              If you join in the first twenty, you stay at $797/month regardless of what the price becomes later.
            </P>

            <div style={{ display: "flex", justifyContent: "center", gap: mob ? 0 : 8, flexDirection: mob ? "column" : "row", borderTop: `1px solid ${C.border1}`, paddingTop: 20 }}>
              {[
                { price: "$797", label: "First 20 owners" },
                { price: "$897", label: "Next 20 owners" },
                { price: "$997", label: "After 40 owners" },
              ].map((step, i) => (
                <div key={i} style={{ flex: 1, padding: mob ? "10px 0" : "0 10px", borderTop: mob && i > 0 ? `1px solid ${C.border1}` : "none" }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: mob ? 22 : 26, fontWeight: 700, color: i === 0 ? C.gold : C.text2, lineHeight: 1.2 }}>
                    {step.price}<span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: C.text3 }}>/mo</span>
                  </div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10.5, letterSpacing: "0.14em", textTransform: "uppercase", color: C.text3, marginTop: 5 }}>
                    {step.label}
                  </div>
                </div>
              ))}
            </div>

            <P mob={mob} style={{ maxWidth: 520, margin: "20px auto 0", fontSize: 12.5, color: C.text3 }}>
              Counted across all revenue bands. Cohorts cap at ten owners and are grouped by revenue &mdash; under $1M, $1M&ndash;$3M, $3M&ndash;$10M &mdash; so the room is working on problems of the same size.
            </P>
          </div>

          <div style={{ ...CARD, padding: mob ? "20px 20px" : "26px 30px", marginTop: 14 }}>
            <div style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: C.text3, fontWeight: 600, marginBottom: 12 }}>
              What it is and isn&rsquo;t
            </div>
            <P mob={mob} style={{ fontSize: 12.5, marginBottom: 12 }}>
              Membership is ongoing and monthly. &ldquo;Cohort&rdquo; describes how you come in &mdash; ten at a time, grouped by band &mdash; not a program with an end date.
            </P>
            <P mob={mob} style={{ fontSize: 12.5, marginBottom: 12 }}>
              Sessions are group sessions. Membership does not include one-on-one advisory time, personal financial planning, or investment recommendations. If you want personal financial advice from Edward Kriczky, that requires a formal client relationship with Kriczky Wealth Management, LLC &mdash; a separate engagement under its own agreement.
            </P>
            <P mob={mob} style={{ fontSize: 12.5, marginBottom: 12 }}>
              Billed monthly and renews automatically. Cancel any time. You keep access through the end of the billing period you have already paid for, and there are no refunds for partial billing periods. Cancelling is not the same as leaving the group &mdash; leaving ends access immediately, so cancel from your Skool subscription settings at least 24 hours before the renewal date. If you cancel and rejoin later, you rejoin at whatever the price is then &mdash; founding pricing does not carry over.
            </P>
            <P mob={mob} style={{ fontSize: 12, color: C.text3, marginBottom: 0 }}>
              Educational content only. Nothing here is individualized investment, tax, or legal advice.
            </P>
          </div>
        </div>
```

---

## PART C — conditional note on the revenue field

Inside `ApplicationForm`, in the "Annual revenue" `Field`.

FIND:
```jsx
      <Field label="Annual revenue">
        <Choice options={REVENUE_OPTIONS} value={revenue}
          onChange={v => { setRevenue(v); setError(""); }} />
      </Field>
```
REPLACE:
```jsx
      <Field label="Annual revenue">
        <Choice options={REVENUE_OPTIONS} value={revenue}
          onChange={v => { setRevenue(v); setError(""); }} />
        {revenue === "$10M+" && (
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, lineHeight: 1.6, color: C.text3, margin: "9px 0 0" }}>
            Cohorts run up to $10M. Above that is a different conversation &mdash; apply anyway and I&rsquo;ll point you to the right one.
          </p>
        )}
      </Field>
```

`REVENUE_OPTIONS` itself is unchanged. Do not edit the array.

---

## VERIFICATION — run all of these and report results

1. `grep -c "accountability from me" Cohort.jsx` → must return **0**
2. `grep -c "outsourced finance team" Cohort.jsx` → must return **0**
3. `grep -c "financials-only" Cohort.jsx` → must return **0**
4. `grep -c "Tax and wealth workshops" Cohort.jsx` → must return **0**
4b. `grep -c "Tax and Business Reinvestment Workshops" Cohort.jsx` → must return **1**
5. `grep -c "Cohort Program" Cohort.jsx` → must return **0**
6. `grep -c "where the money is actually going" Cohort.jsx` → must return **0**
7. `grep -c '\$897' Cohort.jsx` → must return **1**
8. `grep -c '\$997' Cohort.jsx` → must return **1**
9. `grep -c "continuously active" Cohort.jsx` → must return **1**
10. `grep -c "Kriczky Wealth Management" Cohort.jsx` → must return **1**
11. `grep -c "Nine other owners at your stage" Cohort.jsx` → must return **1**
12. `grep -c "C.cyan" Cohort.jsx` → must return **0** (cyan is reserved; if this
    is anything but 0, a style was introduced that should not have been)

Then confirm, explicitly:

- The `C` object is byte-identical to before
- The `CARD` object is byte-identical to before
- No font size, padding, margin, or color was changed on any pre-existing element
- The file builds with no errors
- The page renders identically on mobile and desktop apart from the copy above
  and the new terms card

Report the diff summary before deploying. If the diff touches anything outside
Parts A, B and C, revert and report.
