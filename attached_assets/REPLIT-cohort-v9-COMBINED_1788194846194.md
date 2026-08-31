# Replit prompt — Cohort.jsx v9 (single combined deploy)

This supersedes the v8 prompt. **Do not run v8 separately** — everything from it
is included here. Reference component: `Cohort-v9.jsx`.

Four changes: a responsive headline break, icons on the inclusion and VIP
bullets, an entity-name comma, and green/red marks on the fit cards.

## SCOPE

**DO NOT** change `C`, `CARD`, `inputStyle`, `SectionGap`, the `H`/`P`/`Eyebrow`/
`Label`/`Field`/`Choice`/`Select`/`Shield`/`Grain` components, the pricing
section, the form logic, the payload, the endpoint, or any other file. Introduce
no new color value — `C.green` and `C.red` already exist in the token object.

If a change appears to need a style change, stop and report rather than improvise.

---

## 1 — responsive headline break

Desktop keeps "who get it." alone on line two; mobile moves "stage" down to it.

FIND:
```jsx
            Nine other owners at your stage<br />
            <span style={{ color: C.gold }}>who get it.</span>
```
REPLACE:
```jsx
            Nine other owners at your{mob ? <br /> : " "}stage{mob ? " " : <br />}
            <span style={{ color: C.gold }}>who get it.</span>
```

The `h1` style object is unchanged.

---

## 2 — add two components immediately above `const INCLUDED = [`

```jsx
const Ico = ({ name, size = 21 }) => {
  const paths = {
    people: <><circle cx="9" cy="9" r="3.2" /><circle cx="17" cy="10" r="2.4" /><path d="M3.5 20c0-3.2 2.5-5.2 5.5-5.2s5.5 2 5.5 5.2" /><path d="M16 15.2c2.4 0 4.5 1.6 4.5 4.3" /></>,
    calendar: <><rect x="3.5" y="5.5" width="17" height="15" rx="2.5" /><path d="M8 3.5v4M16 3.5v4M3.5 10.5h17" /><path d="M8.5 14.5h3M8.5 17.5h7" /></>,
    bars: <><path d="M4 20V4" /><path d="M4 20h16" /><path d="M8.5 20v-5M13 20v-9M17.5 20v-13" /></>,
    call: <><path d="M20.5 12.5c0 3.9-3.8 7-8.5 7a10 10 0 0 1-2.6-.33L4 20.5l1.4-3.6A6.6 6.6 0 0 1 3.5 12.5c0-3.9 3.8-7 8.5-7s8.5 3.1 8.5 7Z" /><path d="M9 12h.01M12 12h.01M15 12h.01" /></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={C.gold}
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none" }}>
      {paths[name]}
    </svg>
  );
};

const Mark = ({ kind }) => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none"
    stroke={kind === "yes" ? C.green : C.red} strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0, marginTop: 3 }}>
    {kind === "yes"
      ? <path d="M3 8.5L6.3 11.8L13 5" />
      : <><path d="M4 4l8 8" /><path d="M12 4l-8 8" /></>}
  </svg>
);
```

---

## 3 — replace four arrays

`INCLUDED` (adds `icon` keys):
```jsx
const INCLUDED = [
  { icon: "people", title: "Biweekly working sessions", desc: "Ten owners in the same revenue tier — the weekly community call is open to every member, this is the small room. We work through your actual constraints with accountability from Kriczky Virtus and from nine people who understand the problem because they're living it." },
  { icon: "calendar", title: "Quarterly Tax and Business Reinvestment Workshops", desc: "The levers most owners at your level have never had walked through, and how they connect to what the business is doing. Educational, and coordinated with your CPA — not tax advice." },
];
```

`VIP_INCLUDED` (adds `icon` keys):
```jsx
const VIP_INCLUDED = [
  { icon: "bars", title: "Your own business metrics dashboard", desc: "KPIs and what-if scenarios built on your numbers. What happens to margin and cash if you hire two more, open the second location, or lose your largest account — before you commit to any of it." },
  { icon: "call", title: "One 90-minute business 1-on-1 per month", desc: "Time with the Kriczky Virtus team on your business operations and decision-making. Use it when you need it within the month; it does not roll over." },
];
```

`NOT_FOR` (last item rewritten):
```jsx
const NOT_FOR = [
  "You want someone to hand you a plan and leave.",
  "You aren't willing to share real numbers with the room.",
  "You are content with your business staying where it is today.",
];
```

`FOR` (third item rewritten):
```jsx
const FOR = [
  "You're profitable but you can't explain why the profit isn't higher.",
  "You're the bottleneck and you know it.",
  "Your advisors each do one thing well but nobody is connecting them, so you know growth and money are leaking out the bottom.",
  "You want a room of owners at your scale, not a mastermind full of people selling courses.",
];
```

`REVENUE_OPTIONS`, `TIMELINE_OPTIONS`, `OWNERSHIP_OPTIONS`, `TIER_OPTIONS` and
`FAQ` are unchanged.

---

## 4 — render the icon on each inclusion card

Inside `INCLUDED.map`, FIND:
```jsx
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: mob ? 17 : 19, fontWeight: 600, color: C.text1, marginBottom: 6, lineHeight: 1.25 }}>
                  {item.title}
                </div>
```
REPLACE:
```jsx
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <Ico name={item.icon} size={mob ? 19 : 21} />
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: mob ? 17 : 19, fontWeight: 600, color: C.text1, lineHeight: 1.25 }}>
                    {item.title}
                  </div>
                </div>
```

---

## 5 — render the icon on each VIP bullet

Inside `VIP_INCLUDED.map`, FIND:
```jsx
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, fontWeight: 600, color: C.text1, marginBottom: 3 }}>{item.title}</div>
```
REPLACE:
```jsx
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                      <Ico name={item.icon} size={17} />
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, fontWeight: 600, color: C.text1 }}>{item.title}</div>
                    </div>
```

---

## 6 — the "This is for you if" card

The heading `div` wrapping `This is for you if` has `color: C.gold`. Change
**only** that value to `color: C.green`.

Inside `FOR.map`, FIND:
```jsx
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.gold, marginTop: 7, flexShrink: 0 }} />
```
REPLACE:
```jsx
                <Mark kind="yes" />
```

---

## 7 — the "It isn't if" card

The heading `div` wrapping `It isn't if` has `color: C.text3`. Change **only**
that value to `color: C.red`.

Inside `NOT_FOR.map`, FIND:
```jsx
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.text4, marginTop: 7, flexShrink: 0 }} />
```
REPLACE:
```jsx
                <Mark kind="no" />
```

This card uses **crosses, not checkmarks**. A red checkmark on a disqualifier
list gives two opposite signals.

---

## 8 — entity name comma

In the "What it is and isn't" card only.

FIND: `a formal client relationship with Kriczky Wealth Management, LLC &mdash;`
REPLACE: `a formal client relationship with Kriczky Wealth Management LLC &mdash;`

Do not change the entity name anywhere else.

---

## VERIFICATION

Must return **1**:
```
grep -c "const Ico" Cohort.jsx
grep -c "const Mark" Cohort.jsx
grep -c '<Mark kind="yes"' Cohort.jsx
grep -c '<Mark kind="no"' Cohort.jsx
grep -c 'icon: "people"' Cohort.jsx
grep -c 'icon: "calendar"' Cohort.jsx
grep -c 'icon: "bars"' Cohort.jsx
grep -c 'icon: "call"' Cohort.jsx
grep -c "leaking out the bottom" Cohort.jsx
grep -c "content with your business staying" Cohort.jsx
grep -c "Kriczky Wealth Management LLC" Cohort.jsx
```

Must return **2**: `grep -c "<Ico name=" Cohort.jsx`

Must return **0**:
```
grep -c "Kriczky Wealth Management, LLC" Cohort.jsx
grep -c "looking for tactics rather than" Cohort.jsx
grep -c "and nobody is connecting them" Cohort.jsx
grep -c "C.cyan" Cohort.jsx
grep -c "<Choice" Cohort.jsx
```

Then confirm:

- `C`, `CARD` and `inputStyle` are byte-identical to before
- The build passes
- On a narrow viewport, line two of the headline reads "stage who get it."; on
  desktop it reads "who get it."
- The two fit cards still sit side by side on desktop and stack on mobile
- The pricing section and the form are visually unchanged
