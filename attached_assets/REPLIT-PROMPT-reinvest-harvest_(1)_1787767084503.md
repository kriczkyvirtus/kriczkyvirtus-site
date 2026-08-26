# REPLIT AGENT PROMPT — Deploy "Reinvest or Harvest" Diagnostic Tool

**Tool:** Reinvest or Harvest — The Owner's Capital Allocation Scorecard
**Slug / tool id:** `reinvest-harvest`
**Route:** `/tools/reinvest-harvest`
**Short link to build:** `/ig` → this page (see Section 3b)

⚠️ **Component filename:** match the existing tool components exactly. Those are **kebab-case** (`whats-my-business-worth-v3.jsx`, `human-capital-deep-dive.jsx`, `cash-flow-fortress-v18.jsx`) and live wherever the current tool components live — PascalCase is this repo's *landing page* convention, not its tool convention. Name this file `reinvest-harvest-scorecard.jsx` and place it beside its siblings. Do not create a new directory.

---

## ⛔ READ THIS FIRST — DO NOT MODIFY THE COMPONENT

The JSX in Section 7 is final, QA'd, and byte-verified. Copy it **exactly as written**.

**Do NOT:**
- Reformat, re-indent, prettify, or lint the file
- "Fix" anything that looks unusual — the inline styles, the `display: "table"` pill centering, and the `gridAutoFlow: "column"` grid are all deliberate and were arrived at by fixing rendering bugs
- Convert inline styles to Tailwind or CSS modules
- Change any string, color hex, URL, or numeric threshold
- Add, remove, or reorder dimensions
- Touch the base64 headshot string
- Replace `&#174;` or `&#8212;` with literal characters

**If something appears broken, stop and report it rather than fixing it.** A wrong "fix" here is more expensive than a delay.

---

## 1. WHAT THIS TOOL IS

The site's first **dual-pillar** diagnostic. Ten dimensions split into two pillars of five, each scored out of 30:

- **Pillar One — Business Capacity** (gold `#C8A24E`): can the next dollar earn its return inside the business?
- **Pillar Two — Personal Foundation** (green `#34D399`): is the base outside the business built?

Unlike every existing tool, the output is a **2×2 position**, not a single band. Threshold is 18/30 on each axis:

| Business | Personal | Position |
|---|---|---|
| ≥18 | ≥18 | Reinvest-Weighted |
| ≥18 | <18 | Split — Pay Yourself First |
| <18 | ≥18 | Harvest-Weighted |
| <18 | <18 | Stabilize First |

Page count is **14 base / 16 after the gate unlocks** (the position page and the moves page are gated).

---

## 2. NEW BEHAVIOR NOT PRESENT IN OTHER TOOLS

Three things differ from the existing five diagnostics. Do not "normalize" them to match the others.

### 2a. The gate captures a revenue band
A **required** `<select>` sits between the email field and the submit button. Values must post exactly as written — they map to canonical ActiveCampaign `Revenue Range` strings:

```
"Under $500K" | "$500K - $1M" | "$1M - $3M" | "$3M - $10M" | "$10M+"
```

The band posts as `revenueBand` on the payload and is lifted into parent state via `onUnlock(revenueBand)`.

### 2b. The final CTA branches on revenue band
- **$1M and above** → `https://kriczkyvirtus.com/free-session`
- **Below $1M** → `https://www.skool.com/virtus-collective/about`
- **No band captured** (gate bypassed) → falls back to `/free-session`

Both the page kicker and the timeline card heading are conditional. This is intentional, not duplicated logic.

### 2c. The payload carries `trackIntent`
Derived from the quadrant: Harvest and Split → `"Wealth"`, Reinvest and Stabilize → `"Business"`.

⛔ **This value must reach Google Sheets and nothing else.** It is deliberately NOT written to ActiveCampaign — not as a field, not as a tag. See §4c for the full reasoning. Do not "helpfully" wire it up.

---

## 3. FILE PLACEMENT AND ROUTING

### 3a. Component, route, and hub card

1. Write the Section 7 source to `reinvest-harvest-scorecard.jsx`, in the same directory as the existing tool components. **Do not invent a path** — locate `human-capital-deep-dive.jsx` and place this file next to it.
2. Register the route at **`/tools/reinvest-harvest`**, following the exact pattern of the existing tool routes.
3. Add a card to the Resources Hub (`kriczky-virtus-resources-hub-v4.jsx`) matching the existing card pattern:
   - **`id`:** `reinvest-harvest` ← the hub builds its link as `` `/tools/${tool.id}` ``, so this MUST match the route slug or the card 404s
   - **Title:** Reinvest or Harvest
   - **Subtitle:** The Owner's Capital Allocation Scorecard
   - **Accent:** gold `#C8A24E`
   - **Duration:** 12 min

⚠️ **Do not restyle the hub card component.** Copy the existing card structure and change only the content props.

⚠️ Note the deliberate asymmetry: the **display title** keeps the word "or" ("Reinvest or Harvest"); the **slug and id** do not (`reinvest-harvest`). This is intentional. Do not "correct" either one to match the other.

### 3b. Build the `/ig` short link — NEW, REQUIRED

This does not exist yet and must be created. It is the destination for the Instagram bio link, so it is this tool's primary traffic source.

Add a **redirect** (not a rewrite) to `vercel.json`:

```json
"redirects": [
  {
    "source": "/ig",
    "destination": "/tools/reinvest-harvest?utm_source=instagram&utm_campaign=bio-link",
    "permanent": false
  }
]
```

Four things that matter here:

1. **`"permanent": false` (302), not 301.** Browsers cache 301s aggressively and effectively permanently for anyone who has already clicked. The bio link target will change over time; a 302 keeps that cheap to do.
2. **`redirects` is a separate top-level key from `rewrites`.** Do not put this in the `rewrites` array — a rewrite would serve the tool at `/ig` without changing the URL, and the UTMs would never reach the page.
3. **Existing ordering still applies.** Within `rewrites`, `/api/(.*)` must precede the `/(.*)` SPA catch-all or API routes return 405. Adding a `redirects` key must not disturb that.
4. **`utm_source` and `utm_campaign` only.** Those are the two parameters this system already reads. Do not add `utm_medium` or `utm_content` — they would be silently dropped while creating the false impression they are tracked.

**Verify after deploy:** `curl -I https://www.kriczkyvirtus.com/ig` returns a 302 whose `Location` header carries the full query string, and following it in a browser lands on the tool with both UTMs intact in the address bar.

---

## 4. BACKEND INTEGRATION

### 4a. Google Sheets — `lib/sheets.js`

Add to the `TOOL_TO_TAB` mapping:

```js
"reinvest-harvest": "Reinvest or Harvest",
```

Then create a tab named **"Reinvest or Harvest"** in the "Kriczky Virtus Website — Lead Capture" spreadsheet.

⚠️ **This tab needs the Revenue Band column** — it is the second tool after the Constraint Roadmap to capture it. Column order:

```
Timestamp (EST) | Name | Email | Revenue Band | Score | Band | Source | Campaign | Link | Notes
```

Write `revenueBand` into the Revenue Band column. Also write it to the **Aggregated** tab if that tab has the column; if it does not, add it there and backfill existing rows with an empty string rather than leaving the column ragged.

**Suggested Notes content** (so the two-pillar result survives into the sheet):
```
Biz {bizScore}/30 · Personal {persScore}/30 · {quadrant} · {trackIntent}
```

### 4b. Resend — `lib/email.js`

Add to `TOOL_DETAILS`:

```js
"reinvest-harvest": {
  subject: "Your Reinvest or Harvest results",
  preview: "Where the next dollar should go — and why.",
  heading: "Your Capital Allocation Scorecard",
  description: "You scored your business capacity and your personal foundation separately, because the reinvest-or-harvest question depends on both. Your results show which side is carrying you right now, the two dimensions holding your position back, and three moves you can start this month.",
  buttonText: "View Your Results",
  secondaryCta: "Book your free working session",
},
```

Keep the existing from/reply-to, logo, address block, unsubscribe link, and the standard sign-off. Check the Unsubscribed tab before sending, as with every other tool.

### 4c. ActiveCampaign — `lib/activecampaign.js`

All IDs below were verified against the live account on 2026-08-26. Use them as given.

#### Tags to apply

| Tag | ID | Condition |
|---|---|---|
| `Website Lead` | 7 | Always |
| `Tool: Reinvest Harvest` | 67 | Always |
| `Source: Instagram` | 38 | If `utm_source=instagram` |
| `Source: Website` | 12 | Otherwise |

#### Tier tag from `revenueBand`

| Revenue Band | Tags |
|---|---|
| `Under $500K` | 51 **and** 62 |
| `$500K - $1M` | 51 **and** 59 |
| `$1M - $3M` | 18 |
| `$3M - $10M` | 52 |
| `$10M+` | 53 |

⛔ **Do NOT invent new tier tags.** Match `revenueBand` exactly. If no match, apply no tier tag rather than guessing.

#### Quadrant result → tag

| `summary.quadrantKey` | Tag | ID |
|---|---|---|
| `reinvest` | `Position: Reinvest-Weighted` | 68 |
| `split` | `Position: Split` | 69 |
| `harvest` | `Position: Harvest-Weighted` | 70 |
| `stabilize` | `Position: Stabilize First` | 71 |

#### Custom fields

| Value | Field ID | Field |
|---|---|---|
| `revenueBand` | 2 | Revenue Range |
| Formatted result string (below) | 11 | Allocation Position |

`Allocation Position` format — build server-side from `summary`:

```
Biz {bizScore}/30 · Personal {persScore}/30 · {quadrant}
```

Example: `Biz 24/30 · Personal 12/30 · Split — Pay Yourself First`

Write fields inline on `contact/sync` with field IDs as **strings**:

```json
{ "contact": { "email": "...", "firstName": "...", "lastName": "...",
  "fieldValues": [
    { "field": "2",  "value": "<revenueBand>" },
    { "field": "11", "value": "<formatted result>" }
  ] } }
```

> A previous tool posted to `contactFieldValues` — not a real endpoint. It returned success and wrote nothing. Use `contact/sync` with inline `fieldValues`. Log the AC status and body for each write.

#### ⛔ MUST NOT be applied

```
Track: Wealth    (tag id 40)   ← DO NOT APPLY
Track: Business  (tag id 39)   ← DO NOT APPLY
Track Intent     (field id 5)  ← DO NOT WRITE
```

**This is the most important instruction in this document.**

The tool emits `summary.trackIntent` with a value of `Wealth` or `Business`. **Ignore it for ActiveCampaign purposes.** Let it flow into the payload and Google Sheets unchanged, but do not write it to field 5 and do not derive any tag from it.

Three reasons:

1. **`Track Intent` (field 5) means something different.** It records what kind of *content* a person engaged with — an expressed interest, set per ManyChat flow. The tool's `trackIntent` is an *inference from a quiz result*. Same name, different meaning.

2. **Writing it would overwrite an expressed intent.** Contact syncs upsert. Someone who opted in through a wealth reel carries `Track Intent = Wealth`; if they later score Reinvest-Weighted, the field silently flips to `Business`.

3. **Tags 39 and 40 are live automation triggers, and applying both enrolls someone in two sequences at once.** Tag 40 starts the KWM wealth nurture. Tag 39 is a second trigger on `[N1]`. A contact carrying both receives roughly 32 emails over six weeks from the same sender, and nothing flags it.

The quadrant is preserved as `Position: *` tags and in the `Allocation Position` field. That keeps the entire signal available for segmentation and for reading a contact record before a call, without letting a self-scored quiz drive enrollment.

### 4d. Environment variables

No new variables. Confirm these already resolve:
`BLOB_READ_WRITE_TOKEN`, `GOOGLE_SHEETS_CREDENTIALS`, `GOOGLE_SHEETS_SPREADSHEET_ID`, `RESEND_API_KEY`, `ACTIVECAMPAIGN_URL`, `ACTIVECAMPAIGN_KEY`

⚠️ Note the naming: `ACTIVECAMPAIGN_URL` / `ACTIVECAMPAIGN_KEY` — **not** the `_API_URL` / `_API_KEY` variants.

---

## 5. TWO ITEMS TO VERIFY, NOT ASSUME

### 5a. Does the route wrapper already set the mobile viewport?

The component ships with an inline `useEffect` that sets `width=816, initial-scale=0.5` on screens under 816px and restores the original on unmount. It is idempotent and safe if something upstream also sets it.

**Check whether the existing tool routes already do this at the wrapper level.** If they do, leave both in place — they set the same value. Report which layer owns it so the skill documentation can be corrected.

⛔ Never substitute CSS `zoom` or `transform: scale()`. Both caused black screens in production.

### 5b. Does this tool need the `store-results` call?

The five existing tools capture rendered HTML to Blob Storage ~2 seconds after results render, via `POST /api/store-results`, which populates the Link column.

**This component does not include that call.** Determine where the other tools make it:
- If it lives in the **route wrapper**, this tool inherits it — do nothing.
- If it lives **inside each tool component**, add it here following the identical pattern.

⛔ **Do not add it speculatively.** A duplicate call writes the Blob twice, bills twice, and produces two competing links.

### 5c. Are UTMs actually being read? — CRITICAL for this tool

The skill documentation states that client components read `utm_source` and `utm_campaign` from URL params and pass them to lead-capture. **No tool component in the repo contains that code**, so it is presumably handled at the route wrapper or the API layer.

This matters more here than for any previous tool: `/ig` exists specifically to attribute Instagram traffic. If the UTMs are dropped, every Instagram lead lands in Sheets tagged "website" and the channel looks dead.

**Find where UTM capture happens and confirm this tool inherits it.** If it does not, add it following the identical existing pattern. Then verify end to end: submit a test lead via `/ig` and confirm the Source column in Google Sheets reads `instagram`, not `website`.

---

## 6. VERIFICATION CHECKLIST

Run every item before pushing. Report results line by line.

**Byte integrity**
- [ ] File is exactly **1190 lines** and **118,066 bytes**
- [ ] `sha256sum` equals `5400c5a2603cff3bd0df2153cb8bc3aad096b9c920978fa91099cb04436b59a4`
- [ ] First line is `import { useState, useRef, useEffect } from "react";`
- [ ] Last line is a single `}`
- [ ] `grep -c "data:image/jpeg;base64"` returns **1** (headshot intact)
- [ ] `grep -c "gridAutoFlow"` returns **1**
- [ ] `grep -c "M25 32L29.5 36.5L40 26"` returns **0** (shield must have NO checkmark)
- [ ] `grep -c 'toolSlug="reinvest-harvest"'` returns **1** (the identifier has no "or"; prose mentions of "reinvest-or-harvest" in the copy are correct and must stay)

⚠️ **Verify with `grep` after writing the file, before pushing to GitHub.** Replit has repeatedly failed silently when writing large files. A successful-looking write is not proof the content landed.

**Build**
- [ ] `pnpm --filter @workspace/kriczky-virtus build` completes with no errors
- [ ] No new console warnings introduced

**Functional — desktop**
- [ ] All 14 pages render before the gate; page numbers read `n / 14`
- [ ] Scoring all 10 dimensions triggers the gate
- [ ] Gate rejects submission with the revenue dropdown left empty
- [ ] After unlock, page count becomes `n / 16` and two new pages appear
- [ ] The position page shows exactly one "YOU ARE HERE" badge
- [ ] Every page is exactly 1056px tall — nothing overflows

**Functional — all four quadrants**
Score these profiles and confirm the position:

| b1–b5 | p1–p5 | Expected |
|---|---|---|
| 5,5,6,5,6 | 5,5,4,5,5 | Reinvest-Weighted |
| 5,4,5,4,6 | 2,3,2,3,2 | Split — Pay Yourself First |
| 2,2,3,2,2 | 6,5,5,4,5 | Harvest-Weighted |
| 2,1,2,2,1 | 1,2,1,2,2 | Stabilize First |

- [ ] All four resolve correctly
- [ ] The amber "Read The Split, Not The Total" panel appears for Split and Harvest, and does **not** appear for the balanced Reinvest profile

**Functional — CTA branching**
- [ ] Selecting `$3M - $10M` → kicker reads "What Happens Next For $3M–$10M Owners", heading reads "How I help owners 1-on-1.", button links to `/free-session`
- [ ] Selecting `$500K - $1M` → kicker reads "What Happens Next For $500K–$1M Owners", heading reads "Where to start.", button links to the Skool URL

**Functional — `/ig` short link**
- [ ] `curl -I https://www.kriczkyvirtus.com/ig` returns **302** (not 301, not 200)
- [ ] The `Location` header includes `?utm_source=instagram&utm_campaign=bio-link`
- [ ] Following it in a browser lands on `/tools/reinvest-harvest` with both UTMs visible in the address bar
- [ ] A lead submitted via `/ig` writes `instagram` to the Source column in Google Sheets

**Functional — mobile**
- [ ] Renders legibly at 390px width with no black screen and no layout gaps
- [ ] Horizontal scroll works; text is readable at default zoom

**Backend**
- [ ] A test submission writes a row to the "Reinvest or Harvest" tab **and** the Aggregated tab
- [ ] Revenue Band column is populated with the exact canonical string
- [ ] Resend email arrives with correct subject and reply-to `ekriczky@kriczkyvirtus.com`
- [ ] ActiveCampaign contact created with correct tier tag(s) and `Revenue Range` (field 2)
- [ ] `Tool: Reinvest Harvest` (67) applied
- [ ] `Website Lead` (7) applied
- [ ] Correct `Position: *` tag applied for the quadrant scored
- [ ] `Allocation Position` (field 11) populated with the formatted string
- [ ] **`Track: Wealth` (40) is NOT applied**
- [ ] **`Track: Business` (39) is NOT applied**
- [ ] **`Track Intent` (field 5) is NOT written**
- [ ] `Source: Instagram` (38) applied when arriving via `/ig`; `Source: Website` (12) otherwise
- [ ] `trackIntent` is present in the payload (even if not yet consumed)

**Report back:** which layer owns the viewport hook (5a), whether `store-results` was needed (5b), where UTM capture happens (5c), and any grep check that failed.

Also paste one successful ActiveCampaign `contact/sync` response showing the `fieldValues` write, and confirm in writing that neither tag 39 nor tag 40 was applied and field 5 was not written.

---

## 7. COMPONENT SOURCE — COPY EXACTLY

Write the following, verbatim and unmodified, to `client/src/pages/tools/ReinvestOrHarvest.jsx`.

```jsx
import { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/* ═══════════════════════════════════════════════════════════════
   REINVEST OR HARVEST
   The Owner's Capital Allocation Scorecard
   Accents: #C8A24E (gold — Business Capacity) / #34D399 (green — Personal Foundation)
   Dual-axis diagnostic. Two pillars of 5 dimensions each, /60 total.
   Output is a 2x2 position, not a single band.
   ═══════════════════════════════════════════════════════════════ */

const HEADSHOT = "data:image/jpeg;base64,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";

const C = {
  gold: "#C8A24E", goldMuted: "#A68A42", goldLight: "#D4B665",
  green: "#34D399", red: "#F87171", amber: "#FBBF24",
  amberDark: "#D4A017",
  blue: "#60A5FA", cyan: "#22D3EE", purple: "#A78BFA",
  bgDeep: "#0A0E14", bgCard: "#111720", bgElev: "#1A2130",
  text1: "#E8ECF1", text2: "#8B95A5", text3: "#5A6474", text4: "#3D4654",
  border1: "rgba(255,255,255,0.06)", border2: "rgba(255,255,255,0.10)",
};

const ACCENT = C.gold;
const BIZ = C.gold;
const PERS = C.green;

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const scoreColor = (n) => {
  if (!n || n <= 0) return C.text4;
  if (n <= 2) return C.red;
  if (n === 3) return C.amber;
  if (n === 4) return C.amberDark;
  if (n === 5) return C.cyan;
  return C.green;
};

/* ── DIMENSIONS (10 — 5 business capacity, 5 personal foundation) ── */
const DIMS = [
  {
    key: "b1", num: 1, of: 10, pillar: "biz", color: BIZ,
    title: "Business ROI Opportunities",
    subtitle: "Do you know what your last big investment actually returned?",
    description: "A $4M dental group spent $180,000 building out three new operatories because the schedule \"felt full.\" Two years later nobody could say whether the rooms had paid for themselves. A practice down the road spent $60,000 on scheduling and recall software, measured the drop in no-shows and empty chair time, and knew inside one quarter that it had returned several times its cost. The difference wasn't capital or courage — it was the habit of writing down an expected return before the money moved. Money reinvested without a measured return isn't investment. It's spending with a business narrative attached. And if you can't tell a good outcome from a lucky one, you can't repeat either.",
    checks: [
      { text: "I can name the return on the last major investment I made in this business.", sub: "The equipment, the hire, the software, the buildout, the location. What did it produce, and over what period?" },
      { text: "Before I commit growth capital, I write down what I expect it to produce and by when.", sub: "A number and a date. Without both, every outcome can be rationalized after the fact." },
      { text: "I go back and compare what an investment actually returned against what I projected.", sub: "Most owners never close the loop. The ones who compound do it every time." },
      { text: "I could rank my last five investments from best to worst return.", sub: "If they all blur together, you're allocating capital on instinct — which works until it doesn't." },
    ],
    lowLabel: "Never measured", highLabel: "Measured every time",
    quickWins: {
      low: [
        { title: "Pick your single largest expenditure from the last 24 months and reconstruct its return", context: "Not a full analysis — one afternoon. What did it cost, what changed after, and can you draw a line between the two? The answer will tell you more about your allocation discipline than any framework." },
        { title: "Write a one-page pre-commitment note before your next purchase over $10,000", context: "Expected outcome, the number that proves it, and the date you'll check. Put it in a folder. Reading it back in six months is the entire discipline." },
      ],
      mid: [
        { title: "Build a simple investment log — date, amount, thesis, expected return, actual return", context: "One row per decision. Twelve months of rows turns capital allocation from instinct into a track record you can actually learn from." },
        { title: "Set a standing quarterly review of every open investment against its original thesis", context: "Thirty minutes. Kill what isn't working before it becomes sunk-cost reasoning, and double down on what is." },
      ],
      high: [
        { title: "Rank every active investment by realized return and reallocate from the bottom quartile", context: "You already measure. The next lever is moving capital away from the weakest performers rather than letting them run out of inertia." },
        { title: "Set a hurdle rate below which you keep the profit rather than reinvest it", context: "Once you know what your business actually returns on capital, you have the one number that makes reinvest-or-harvest a calculation instead of a feeling." },
      ],
    },
  },
  {
    key: "b2", num: 2, of: 10, pillar: "biz", color: BIZ,
    title: "Margin Position vs. Industry",
    subtitle: "Does your business convert revenue to profit better than your peers?",
    description: "Two physical therapy groups both bill $3M a year. One runs an 8% net margin, the other 16%. On identical revenue the second owner takes home roughly twice as much — and has roughly twice as much available to put back in each year. More clinicians, better equipment, a second location, or simply a bigger cushion to weather a slow quarter. Nothing about the first clinic is obviously broken. The schedule is full, the staff is competent, patients are happy. It simply converts revenue into profit worse than its peers do, and it has never measured itself against them. This matters enormously for the reinvest question, because adding revenue on top of a below-median margin structure amplifies the inefficiency. You get bigger without getting wealthier.",
    checks: [
      { text: "I know my net margin to the tenth of a percent, not as a rough range.", sub: "\"Around ten percent\" and 8.4% are very different businesses once you multiply them out." },
      { text: "I know the median net margin for my industry and revenue band.", sub: "Not a national average across all business — your industry, your size. The comparison only means something if it's close." },
      { text: "I can explain the gap between my margin and the median in operational terms.", sub: "Pricing, labor efficiency, payer or client mix, overhead — a specific mechanism, not \"we invest more in quality.\"" },
      { text: "My margin has held or improved over the last three years as revenue grew.", sub: "Margin that erodes as you scale is the clearest signal that growth is outrunning your systems." },
    ],
    lowLabel: "Below median, unclear why", highLabel: "Top quartile, and I know why",
    quickWins: {
      low: [
        { title: "Calculate your true net margin with owner compensation normalized to market rate", context: "Most owners are measuring a number that quietly includes their own underpayment as profit. Normalize it first, or you're comparing yourself to peers on different terms." },
        { title: "Find the published median margin for your industry and revenue band", context: "Industry associations and benchmarking databases publish these. One number, one afternoon, and you'll know whether you have a margin problem or a growth problem." },
      ],
      mid: [
        { title: "Break margin down by service line, location, or client segment and find the drag", context: "Blended margin hides the truth. Almost every business has a segment quietly subsidized by the rest — and it's usually the one the owner is most attached to." },
        { title: "Model what a three-point margin improvement does to profit at current revenue", context: "It's almost always larger than what a comparable revenue increase produces, and it requires no additional capital. That comparison reframes the whole reinvest question." },
      ],
      high: [
        { title: "Track margin monthly against the industry top quartile, not the median", context: "Once you're above median, the median stops being a useful target. Best-in-class is the benchmark that still has something to teach you." },
        { title: "Pressure-test whether your margin advantage is structural or circumstantial", context: "A pricing advantage a competitor can copy next quarter isn't the same asset as a cost structure they can't replicate. Only one of them justifies aggressive reinvestment." },
      ],
    },
  },
  {
    key: "b3", num: 3, of: 10, pillar: "biz", color: BIZ,
    title: "The Binding Constraint",
    subtitle: "Do you know the one thing actually capping your growth?",
    description: "A $6M commercial contractor was convinced he needed more sales, so he hired two more estimators. Bids went up 40%. Revenue didn't move — because the real constraint was crew capacity, and the new bids simply lengthened the backlog until customers walked. He spent six figures widening a pipe that was already wider than the bottleneck downstream. The same pattern shows up in a dermatology practice that markets harder while patients wait eleven weeks for an appointment, and in a manufacturer that buys a second machine while the first one sits idle waiting on setup. Every business has exactly one binding constraint at a time, and capital deployed anywhere except the constraint produces nothing but activity. This is the most expensive mistake in owner capital allocation, and it's almost always made with good intentions and real money.",
    checks: [
      { text: "If asked, I could name my single binding constraint in one sentence.", sub: "Not a list of five problems. The one thing that, if it improved, would let everything else move." },
      { text: "I can point to evidence for that constraint rather than a strong hunch.", sub: "Backlog data, utilization rates, conversion rates, wait times, cycle times. Something measurable." },
      { text: "My last three significant investments were aimed at the constraint.", sub: "Or were they aimed at the thing that felt most urgent, or most interesting, that quarter?" },
      { text: "I reassess the constraint at least quarterly, because it moves once you fix it.", sub: "Solving a constraint doesn't remove it — it relocates it. Owners who miss the handoff keep investing in a bottleneck that no longer exists." },
    ],
    lowLabel: "Everything feels broken", highLabel: "One constraint, evidenced",
    quickWins: {
      low: [
        { title: "List every problem you're aware of, then ask which one, if fixed, moves the others", context: "Most owners have ten problems and treat them as ten priorities. The exercise takes twenty minutes and usually collapses the list to one or two." },
        { title: "Follow one job, order, or patient end to end and record where it waits", context: "Constraints show up as waiting. Wherever work sits longest is where your capital should go — and it's rarely where the owner assumed." },
      ],
      mid: [
        { title: "Quantify what a 20% improvement at the constraint is worth in profit", context: "This gives you the ceiling on what it's rational to spend fixing it — and a defensible number to compare every competing use of capital against." },
        { title: "Freeze spending on anything not touching the constraint for one quarter", context: "Uncomfortable and clarifying. It forces the question of how much of your growth spending is actually aimed at the bottleneck." },
      ],
      high: [
        { title: "Map where the constraint will move once the current one is resolved", context: "You already know today's bottleneck. Knowing the next one lets you build capacity ahead of it instead of reacting after it bites." },
        { title: "Build a standing constraint review into your quarterly planning rhythm", context: "The discipline isn't finding the constraint once. It's catching the handoff each time it relocates." },
      ],
    },
  },
  {
    key: "b4", num: 4, of: 10, pillar: "biz", color: BIZ,
    title: "Growing Without Breaking",
    subtitle: "Can the business take on more work without falling apart?",
    description: "A $2.5M specialty manufacturer landed a contract that added 30% to revenue overnight. Within four months the owner was working eighty-hour weeks, two of his best machinists had quit, defect complaints had tripled, and margin had fallen below where it started. The capital was there and the demand was real — the organization simply couldn't carry it. The same thing happens to a practice that adds a provider before it has the front-desk capacity to keep her schedule full, and to a services firm that wins a large account and quietly degrades every other client to serve it. This is the line between growth that compounds and growth that consumes. Putting money into a business that can't handle more work doesn't build anything — it converts cash into chaos, and chaos costs more than the original investment did.",
    checks: [
      { text: "The business could take on 25% more volume without me working more hours.", sub: "If growth requires more of you specifically, you're the constraint — and capital can't fix that." },
      { text: "Our core processes are documented well enough that a new hire can follow them.", sub: "Documented means written down and actually used, not \"it's all in Dave's head and Dave's been here nine years.\"" },
      { text: "I have at least one person who could run day-to-day operations for two weeks without me.", sub: "Not in theory. Have you actually tested it?" },
      { text: "We can hire and productively train a new team member inside 90 days.", sub: "If hiring takes six months and training takes six more, your growth ceiling is set by your hiring pipeline, not your market." },
    ],
    lowLabel: "Growth breaks us", highLabel: "Systems scale ahead of demand",
    quickWins: {
      low: [
        { title: "Document the single process that breaks first when volume spikes", context: "You already know which one it is. Write it down this week — one page, in the order it actually happens, not the order it should." },
        { title: "Take four consecutive business days fully unreachable and note what fails", context: "The failures are your capacity gaps, ranked by severity. This is the cheapest diagnostic you will ever run on your own business." },
      ],
      mid: [
        { title: "Identify the one role that must be filled before your next growth push", context: "Hiring after demand arrives means paying full price for a rushed decision. Hiring ninety days ahead of it is the same money, spent well." },
        { title: "Cross-train a second person on every single-point-of-failure function", context: "Every function with exactly one competent person is a growth cap and an operational risk at the same time — one resignation away from a very bad quarter." },
      ],
      high: [
        { title: "Stress-test the organization at 1.5x current volume on paper", context: "Walk the org chart and ask what breaks at that level. Fix it before demand tests it for you." },
        { title: "Build capacity one step ahead of the growth curve as standing policy", context: "You already scale cleanly. The next level is treating capacity as a leading investment rather than a lagging response." },
      ],
    },
  },
  {
    key: "b5", num: 5, of: 10, pillar: "biz", color: BIZ,
    title: "Proven Demand Runway",
    subtitle: "Is there demand you're currently capital-constrained from serving?",
    description: "There are two very different businesses that both say they want to grow. The first is turning work away every month because it lacks crews, equipment, exam rooms, licensed staff, or working capital — for that owner, capital converts to revenue almost mechanically, and the return is close to predictable. The second is chasing every lead it can find, and capital buys marketing experiments with unknown payoffs. Same industry, same revenue, opposite answers to the reinvestment question. Demand runway is what separates reinvestment from speculation. Without proven, documented demand you cannot currently serve, growth capital is a bet on a hypothesis rather than a purchase of known revenue.",
    checks: [
      { text: "I turn away or delay real work because we lack capacity, not because it's a bad fit.", sub: "Track it for one month. The number is usually either much larger or much smaller than owners assume." },
      { text: "I have a documented backlog, waitlist, or pipeline extending beyond 60 days.", sub: "Written down and quantified, not a general sense that things are busy." },
      { text: "Inbound demand has been stable or growing for the last eight quarters.", sub: "Two years smooths out a good year. One strong year is not a runway." },
      { text: "I can name the specific capacity constraint that's costing me revenue right now.", sub: "Trucks, crews, chairs, exam rooms, licensed staff, square footage, working capital — something you could actually buy." },
    ],
    lowLabel: "Chasing every lead", highLabel: "Turning real work away",
    quickWins: {
      low: [
        { title: "Log every declined or delayed opportunity for 30 days with its dollar value", context: "This single number tells you whether you have a demand problem or a capacity problem — and they call for opposite uses of capital." },
        { title: "Ask your last ten lost prospects why they went elsewhere", context: "If the answer is timeline or availability, you're capacity-constrained. If it's price or fit, more capacity won't help you." },
      ],
      mid: [
        { title: "Quantify your backlog in weeks of capacity, and track it monthly", context: "Backlog trending up is the clearest green light for reinvestment you will get. Trending down is the clearest warning." },
        { title: "Test demand with a small capacity addition before committing to a large one", context: "One truck before five. One provider before a second location. Buy the information cheaply before you buy the capacity expensively." },
      ],
      high: [
        { title: "Model how much capacity you could add before demand becomes the constraint", context: "You know demand exceeds capacity. The next question is by how much — that's the size of the rational investment, and the point past which it becomes speculation." },
        { title: "Secure the capital before you need it, while the numbers are strong", context: "Lenders price a business with visible backlog very differently than one that's already stretched. Timing here is worth real money." },
      ],
    },
  },
  {
    key: "p1", num: 6, of: 10, pillar: "pers", color: PERS,
    title: "Owner Compensation vs. Market Rate",
    subtitle: "Are you paying yourself what the role is actually worth?",
    description: "Ask an owner what they pay themselves and you'll often hear a version of \"whatever's left.\" It sounds disciplined. It's actually two problems stacked on each other. First, your personal savings rate becomes highly dependent on business performance rather than being a decision you make — so in the years you most need to be building outside assets, you build none. Second, and more consequential day to day, you lose the ability to tell whether the business is genuinely profitable or whether you are quietly subsidizing it with your own underpayment. A company that only clears a profit because the owner works below market rate isn't throwing off capital to reinvest. It's borrowing from you to stay level, and every growth decision you make on top of that number is built on a figure that isn't real.",
    checks: [
      { text: "I know what the market rate is for someone doing my role at my company's size.", sub: "Not a guess. Compensation surveys and industry associations publish this by role and revenue band." },
      { text: "I pay myself a consistent salary that doesn't fluctuate with monthly cash flow.", sub: "A stable base is what makes planning anything on the personal side possible at all." },
      { text: "I treat distributions as separate from salary, with a deliberate policy for each.", sub: "Blending the two makes it impossible to tell whether the business is profitable or you're simply underpaid." },
      { text: "If I hired a replacement for myself tomorrow, my reported profit would barely change.", sub: "The fastest test of whether your profit is real. If it would collapse, the business is being subsidized by your labor." },
    ],
    lowLabel: "Whatever's left over", highLabel: "Market rate, then profit",
    quickWins: {
      low: [
        { title: "Look up the market salary range for your role at your revenue band this week", context: "Industry associations, compensation surveys, and recruiter data all publish it. Knowing the number is the entire first step." },
        { title: "Recalculate last year's profit with your compensation set to that market rate", context: "The gap between that figure and your reported profit is the amount your own underpayment has been propping up. Better to know it than to keep reinvesting against a number that isn't real." },
      ],
      mid: [
        { title: "Set a fixed salary and move it onto a regular payroll schedule", context: "Consistency is what makes everything downstream — saving, planning, borrowing — actually possible. Coordinate the structure with your CPA before you change it." },
        { title: "Write a distribution policy that separates salary from profit-taking", context: "A stated rule, decided in advance, beats a monthly judgment call made under whatever pressure that month brought." },
      ],
      high: [
        { title: "Review compensation structure annually against both market data and tax efficiency", context: "The right structure shifts as the business grows and as the rules change. This is a conversation to have with your CPA each year, not a decision to make once." },
        { title: "Route a fixed percentage of every distribution outside the business automatically", context: "You're already paid properly. Automating what happens next is what turns income into assets you'd still hold if the business changed." },
      ],
    },
  },
  {
    key: "p2", num: 7, of: 10, pillar: "pers", color: PERS,
    title: "Liquid Reserve",
    subtitle: "How many months could you cover, personally and in the business?",
    description: "Reserve is the least glamorous line in this entire scorecard and the one that most often decides whether the other nine matter. An owner with six months of cover makes different decisions than an owner with none — not better decisions in theory, but genuinely different ones in practice. Thin reserves force you to take the client you shouldn't take, accept the terms you'd otherwise decline, and pull cash out of the business at exactly the moment it should be going in. Reserve isn't idle money sitting there earning nothing. It's what buys you the ability to say no, and the option to be patient while a reinvestment matures. Both are worth considerably more than the yield you gave up holding it.",
    checks: [
      { text: "The business could cover payroll and fixed costs for six months with zero new revenue.", sub: "Run the number. Most owners are surprised in one direction or the other." },
      { text: "I hold personal cash reserves separate from the business, in my own name.", sub: "Reserves that live inside the business aren't personal reserves. They're working capital you've mentally earmarked." },
      { text: "I have not funded a personal shortfall from the business in the past 12 months.", sub: "Occasional is normal. Routine means the two balance sheets have effectively merged." },
      { text: "I have access to credit I have arranged but do not currently need.", sub: "The time to secure a line is when you don't need it. Terms are always worse the day you do." },
    ],
    lowLabel: "One bad month away", highLabel: "Six-plus months, both sides",
    quickWins: {
      low: [
        { title: "Calculate the exact monthly fixed cost of the business and of your household", context: "Two numbers. Everything about reserve planning depends on them, and most owners have never written either one down precisely." },
        { title: "Open a separate reserve account and automate a fixed transfer into it", context: "Separate and automatic. Reserve that stays in the operating account gets spent, every time, without anyone deciding to spend it." },
      ],
      mid: [
        { title: "Set a target of six months of fixed costs and a date you intend to reach it", context: "\"More savings\" isn't a goal. \"Six months of fixed costs by next March\" is one you can actually track against." },
        { title: "Establish a line of credit while your financials are strong", context: "Arranged now, unused, it's optionality. Arranged in a crisis, it's expensive — if it's available at all." },
      ],
      high: [
        { title: "Review whether reserves beyond your six-month target are sitting idle without purpose", context: "Past the point of genuine safety, excess cash has a cost too. That's a conversation worth having deliberately rather than by default." },
        { title: "Stress-test the reserve against your actual worst realistic two quarters", context: "Not a generic downturn — your specific seasonality, your largest client leaving, your equipment failing. Six months of average is not six months of bad." },
      ],
    },
  },
  {
    key: "p3", num: 8, of: 10, pillar: "pers", color: PERS,
    title: "Assets Outside The Business",
    subtitle: "What share of your net worth isn't the company?",
    description: "For many business owners, roughly 80% of total net worth is locked inside the company. Nobody chooses that number — it accumulates one reasonable reinvestment decision at a time, because putting money into something you control and understand always feels safer than putting it somewhere you don't. And it compounds against you: every quarter you successfully grow the business, the business becomes a larger share of everything you own. Concentration isn't evidence you did something wrong. It's the natural result of doing something right for a long time without a counterweight. That's what the barbell is for — assets inside the business and assets outside it rarely come under pressure at the same moment, and holding both is what lets you keep reinvesting through a rough stretch instead of pulling money out during one.",
    checks: [
      { text: "I could roughly state what percentage of my net worth sits outside the business.", sub: "If you've never calculated it, that itself is a finding worth acting on." },
      { text: "Less than 70% of my net worth is tied to the business, including real estate it occupies.", sub: "Property leased to your own company is business-correlated, whatever the deed says." },
      { text: "I add to assets outside the business every year, including the strong years.", sub: "The temptation to skip a contribution and put it into the company is strongest when the company is doing best." },
      { text: "If the business were worth substantially less than I think, I'd still be financially free.", sub: "This is the entire test. Everything else is detail." },
    ],
    lowLabel: "It's all the business", highLabel: "Meaningfully diversified",
    quickWins: {
      low: [
        { title: "Write down every asset you own and mark which ones depend on the business", context: "One page. Include real estate the company occupies and any receivable from it. The concentration is usually higher than the mental estimate." },
        { title: "Set up one automatic monthly contribution to something outside the business", context: "The amount matters far less than the automation. Manual contributions lose to the business every time there's a competing use." },
      ],
      mid: [
        { title: "Set a target for outside-the-business net worth and track it annually", context: "A percentage and a date. Without a target you'll keep reinvesting by default, because default is always the path of least resistance." },
        { title: "Review whether your retirement plan structure fits your business's current stage", context: "Options that made sense at $1M often don't at $5M. Worth reviewing with your CPA and advisor as the business changes." },
      ],
      high: [
        { title: "Review concentration across everything, including assets that quietly correlate", context: "Industry-adjacent holdings, customer-adjacent real estate, and vendor equity can all move with the business without appearing to." },
        { title: "Map what your outside assets would cover if the business needed every dollar for a year", context: "The best reinvestment windows often arrive when cash is tightest. An outside base is what lets you fund one instead of watching it pass." },
      ],
    },
  },
  {
    key: "p4", num: 9, of: 10, pillar: "pers", color: PERS,
    title: "Proactive Tax Coordination",
    subtitle: "Is there a plan, or is there year-end paperwork?",
    description: "There's a meaningful difference between an accountant who tells you in March what happened last year and an advisory relationship that tells you in September what you should do before December. Most reinvest-or-harvest decisions carry a tax consequence that is largely fixed once the calendar year closes — entity structure, compensation mix, the timing of equipment and buildout purchases, retirement plan design. Owners who only meet their CPA at filing time are making these decisions unadvised and then paying for the outcome. This isn't about aggressive positions or clever structures. It's about whether the people who know your numbers are in the conversation before the decision rather than after it.",
    checks: [
      { text: "I meet with my CPA at least once before year-end, not only at filing.", sub: "A single Q3 or Q4 planning conversation is the highest-leverage meeting most owners aren't having." },
      { text: "My entity structure has been reviewed against my current revenue and profit, not my original ones.", sub: "The structure that fit at launch frequently doesn't at $3M. Worth a deliberate look with your CPA." },
      { text: "I understand the tax treatment of a major purchase before I make it, not after.", sub: "Timing and structure often matter as much as the purchase itself." },
      { text: "My CPA, my attorney, and anyone advising me on the personal side actually talk to each other.", sub: "Uncoordinated advisors optimize their own piece and can leave the whole worse off." },
    ],
    lowLabel: "Find out in April", highLabel: "Planned before year-end",
    quickWins: {
      low: [
        { title: "Book a planning conversation with your CPA for Q3 or Q4 this year", context: "Not a filing appointment — a forward-looking one. Bring your projected profit and any large purchases you're considering." },
        { title: "Ask your CPA directly whether your entity structure still fits the business you have now", context: "It's a fifteen-minute question with occasionally significant consequences, and it's rarely raised unless the owner raises it." },
      ],
      mid: [
        { title: "Put a standing annual pre-year-end planning meeting on the calendar", context: "Recurring, scheduled, and not contingent on anyone remembering. The value is entirely in it happening before the year closes." },
        { title: "Get your CPA and your other advisors in one conversation once a year", context: "One meeting a year where everyone advising you is looking at the same picture. Coordination is where most of the value actually is." },
      ],
      high: [
        { title: "Build the tax consequence into your reinvest-versus-keep analysis directly", context: "Pre-tax and after-tax returns can rank two options differently. If you're already planning ahead, this is the refinement that matters — run it with your CPA." },
        { title: "Review the plan each year against where the business is actually heading", context: "Structuring decisions look different when you're about to double than when you're holding steady. The plan should move when the trajectory does." },
      ],
    },
  },
  {
    key: "p5", num: 10, of: 10, pillar: "pers", color: PERS,
    title: "Your Long-Term Destination",
    subtitle: "Do you know where you want this business to take you?",
    description: "\"Somewhere around five to ten years\" is the most common answer owners give when asked where all this is going, and it isn't an answer — it's a way of not deciding. Without a destination you have no way to evaluate the question this scorecard exists to answer, because reinvesting is either compounding toward something specific or deferring a decision you've never made, and those two look identical from the inside. The destination doesn't have to be a sale. It might be a company twice this size, a business that runs profitably without you while you still own it, a handoff to a family member, or a management team you build and then step behind. Each of those requires different things from the business — and therefore a different answer about where the next dollar goes.",
    checks: [
      { text: "I know what I want this business to look like in five years, specifically.", sub: "Size, role, who runs it, what it pays you. \"Bigger\" is not a specification." },
      { text: "I know roughly what the business would need to produce to fund the life I want.", sub: "A range is fine. Having never calculated it is the problem." },
      { text: "I have a current, defensible estimate of what the business is worth today.", sub: "Not a multiple you heard at a conference. Something grounded in your actual financials and industry comparables." },
      { text: "I know whether there's a gap between where the business is and where it needs to be.", sub: "That gap is the single most useful number an owner can hold. It makes every capital decision easier." },
    ],
    lowLabel: "No clear picture", highLabel: "Specific, with a number",
    quickWins: {
      low: [
        { title: "Write one paragraph describing the business five years from now", context: "Revenue, headcount, your role, who runs what. It can change. But a specific picture turns an abstract someday into a target you can allocate capital against." },
        { title: "Get a directional valuation estimate for the business as it stands today", context: "Not a formal appraisal — a grounded estimate. You need a starting point far more than you need precision." },
      ],
      mid: [
        { title: "Calculate the gap between what the business produces now and what your picture requires", context: "Two numbers you likely already have separately. Subtracting one from the other is the exercise most owners skip, and it reframes everything." },
        { title: "Identify which two or three levers move that gap most in your specific business", context: "Not every improvement matters equally. Knowing which ones do is what tells you where reinvestment actually pays." },
      ],
      high: [
        { title: "Build a roadmap that ties specific improvements to the gap you've measured", context: "You know the destination and the number. The next level is sequencing the work so each year's reinvestment closes a measurable portion of it." },
        { title: "Pressure-test the plan against the business needing to run without you sooner than planned", context: "Health events, family changes, and unsolicited offers don't consult the timeline. A business that only works with you in it has a ceiling regardless of your plans." },
      ],
    },
  },
];

const BIZ_DIMS = DIMS.filter(d => d.pillar === "biz");
const PERS_DIMS = DIMS.filter(d => d.pillar === "pers");
const PILLAR_MAX = 30;
const PILLAR_THRESHOLD = 18; /* 60% of 30 — matches the Virtus <50/50–69/70–89/90+ banding logic */

/* ── OVERALL BANDS (allocation discipline, /60) ── */
const BANDS = [
  { label: "Capital Drift", min: 10, max: 22, range: "10–22", color: C.red,
    desc: "Capital is moving through your business and your household without a framework directing it. That isn't a character flaw — it's the default state for most owners, because nothing in running a company forces the question. But it means the reinvest-or-harvest decision is currently being made by whatever felt urgent that month, and over a decade that compounds into a very different outcome than a deliberate policy would have produced." },
  { label: "Split Focus", min: 23, max: 35, range: "23–35", color: C.amber,
    desc: "You've built real strength on one side of the equation and left the other thin. This is the most common position for owners in the $1M–$10M range, and it's usually the business side that's strong. The risk isn't that you're doing anything wrong — it's that a single-sided foundation means one bad outcome in the weak area can undo years of good work in the strong one." },
  { label: "Deliberate Allocator", min: 36, max: 48, range: "36–48", color: C.cyan,
    desc: "You're making capital decisions with real information rather than instinct. Most of the underlying machinery exists — you measure things, you have policies, you can answer questions other owners can't. The remaining gaps tend to be specific rather than structural, which means they're addressable without changing how you operate. Note that this total says nothing about how your strength is distributed between the two pillars; the next page does." },
  { label: "Compounding Owner", min: 49, max: 60, range: "49–60", color: C.green,
    desc: "This is a high total by any standard, and it reflects real discipline on both the operating and the personal side. You measure return on capital, you know what the business is worth, and you have structures in place outside it. From here the reinvest-or-harvest question stops being a source of anxiety and becomes what it should be — a calculation you run with good inputs and revisit on a schedule." },
];

/* ── QUADRANT LOGIC — the actual output of this tool ── */
const QUADRANTS = {
  reinvest: {
    key: "reinvest", label: "Reinvest-Weighted", color: C.green,
    headline: "The business can absorb capital, and you're protected if it doesn't work.",
    body: "You scored strongly on both axes, which is the position that most justifies leaning into the business. Your business converts capital into return in a way you can measure, it can absorb growth without breaking, and — critically — you have a foundation outside it that doesn't depend on the outcome. That second part is what makes aggressive reinvestment rational rather than reckless. Owners without it are taking the same risk without the parachute.",
    posture: "Lean toward the business, aimed at the constraint, with your outside contributions maintained rather than paused.",
    watch: "The most common failure from here is quietly stopping the outside contributions during a strong stretch. The foundation you built is what earned you the right to reinvest — don't spend it to fund the reinvestment.",
  },
  split: {
    key: "split", label: "Split — Pay Yourself First", color: C.gold,
    headline: "The business earns well. Almost everything you own is in it.",
    body: "Your business scores well on absorption capacity — it can genuinely convert capital into return. The problem is on the other side: nearly everything you own depends on that one asset performing. This is the most seductive position in the entire matrix, because the business keeps offering the best visible return and reinvesting keeps looking like the obvious answer. It usually is, right up until it isn't. The concentration risk doesn't announce itself until something forces the issue.",
    posture: "Split deliberately. Establish a fixed, automatic share of profit that leaves the business before the reinvestment decision gets made.",
    watch: "The word doing the work here is automatic. Owners in this quadrant rarely decide against diversifying — they simply never get to it, because there's always a compelling use of the money inside the business.",
  },
  harvest: {
    key: "harvest", label: "Harvest-Weighted", color: C.cyan,
    headline: "Your foundation is solid. The business can't currently convert more capital.",
    body: "You've built genuine strength outside the business, which puts you in a stronger position than most owners. But your business scored low on absorption capacity — it either can't take on growth without breaking, doesn't have a measured return on capital, or doesn't have the demand runway to justify one. Reinvesting into that produces activity rather than value. This is not a signal to disengage from the business. It's a signal that the next investment should be in fixing the capacity to absorb capital, not in growth itself.",
    posture: "Take profit deliberately, and spend inside the business on the constraint and on absorption capacity rather than on growth.",
    watch: "Harvest-weighted doesn't mean harvest everything. A business starved of reinvestment stops being worth harvesting from — the point is changing what you reinvest in, not whether you do.",
  },
  stabilize: {
    key: "stabilize", label: "Stabilize First", color: C.red,
    headline: "Neither side is ready for the question you're asking.",
    body: "Both axes scored below the midpoint, which means the reinvest-or-harvest framing isn't the most useful one for you right now. Reinvesting into a business that can't absorb capital doesn't build value, and harvesting from thin margins into an empty reserve doesn't build a foundation. That sounds discouraging and shouldn't. This is the most common position for owners who've grown fast, and it's also the position where a small number of specific fixes produce the largest visible change — because almost nothing has been optimized yet.",
    posture: "Build reserve on both sides and fix the binding constraint. Growth capital comes after, not instead.",
    watch: "The trap here is trying to grow your way out. Additional revenue running through an unfixed structure amplifies the problem — you get bigger, busier, and no wealthier.",
  },
};

const getQuadrant = (bizScore, persScore) => {
  const b = bizScore >= PILLAR_THRESHOLD;
  const p = persScore >= PILLAR_THRESHOLD;
  if (b && p) return QUADRANTS.reinvest;
  if (b && !p) return QUADRANTS.split;
  if (!b && p) return QUADRANTS.harvest;
  return QUADRANTS.stabilize;
};

const TOTAL_PAGES_BASE = 14;
const TOTAL_PAGES_EXPANDED = 16;

/* ── REVENUE BANDS ──
   Strings MUST match the canonical ActiveCampaign `Revenue Range` values exactly.
   Tier tags: 51 Under $1M · 62 Under $500K · 59 $500K-$1M · 18 $1M-$3M · 52 $3M-$10M · 53 $10M+
   Do not invent new tier tags — see kwm-automation-build-spec.md.                          */
const REVENUE_BANDS = [
  { value: "Under $500K",  label: "Under $500K",        display: "sub-$500K",  qualified: false },
  { value: "$500K - $1M",  label: "$500K \u2013 $1M",   display: "$500K\u2013$1M", qualified: false },
  { value: "$1M - $3M",    label: "$1M \u2013 $3M",     display: "$1M\u2013$3M",   qualified: true  },
  { value: "$3M - $10M",   label: "$3M \u2013 $10M",    display: "$3M\u2013$10M",  qualified: true  },
  { value: "$10M+",        label: "$10M+",              display: "$10M+",      qualified: true  },
];
const bandFor = (v) => REVENUE_BANDS.find(b => b.value === v) || null;

const COLLECTIVE_URL = "https://www.skool.com/virtus-collective/about";
const SESSION_URL = "https://kriczkyvirtus.com/free-session";


/* ── COMPONENTS ── */

const Page = ({ children, pageNum, expanded }) => {
  const tp = expanded ? TOTAL_PAGES_EXPANDED : TOTAL_PAGES_BASE;
  return (
    <div style={{
      width: "8.5in", minHeight: "11in", position: "relative", overflow: "hidden",
      background: "linear-gradient(180deg, #0A0E14 0%, #0D1119 30%, #0E131C 50%, #0D1119 70%, #0A0E14 100%)",
      fontFamily: "'DM Sans', sans-serif", color: C.text1, boxSizing: "border-box",
      pageBreakAfter: "always", breakAfter: "page",
    }}>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1, opacity: 0.05, mixBlendMode: "overlay", backgroundImage: GRAIN, backgroundSize: "128px 128px" }}/>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, zIndex: 5, background: "linear-gradient(90deg, transparent 3%, #C8A24E30 15%, #C8A24E 35%, #D4B665 50%, #C8A24E 65%, #C8A24E30 85%, transparent 97%)" }}/>
      <div style={{ position: "absolute", top: "0.88in", bottom: "0.68in", left: "0.44in", width: 0.5, background: "linear-gradient(180deg, transparent, #C8A24E20, #C8A24E20, transparent)", zIndex: 2 }}/>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, padding: "0.4in 0.6in 0.18in", display: "flex", justifyContent: "space-between", alignItems: "baseline", fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", color: C.text3, fontWeight: 500, zIndex: 5 }}>
        <span>Kriczky Virtus</span>
        <span><b style={{ color: ACCENT, fontWeight: 600 }}>Reinvest or Harvest</b> — Capital Allocation Scorecard</span>
      </div>
      <div style={{ position: "absolute", top: "0.68in", left: "0.65in", right: "0.65in", height: 0.5, background: "linear-gradient(90deg, transparent, #C8A24E40, transparent)", zIndex: 5 }}/>
      <div style={{ padding: "0.85in 0.6in 0.75in", position: "relative", zIndex: 3 }}>
        {children}
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 0.6in 0.4in", display: "flex", justifyContent: "space-between", alignItems: "baseline", color: C.text3, zIndex: 5 }}>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          <b style={{ color: C.gold, fontWeight: 600 }}>Kriczky</b> Virtus
        </span>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 13, color: C.text2 }}>
          {pageNum} <span style={{ color: C.text4 }}>/</span> {tp}
        </span>
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, #C8A24E20, #C8A24E40, #C8A24E20, transparent)" }}/>
    </div>
  );
};

const Shield = ({ size = 28, glow = false }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none"
    style={glow ? { filter: `drop-shadow(0 0 12px #C8A24E60) drop-shadow(0 0 4px #C8A24E90)` } : {}}>
    <path d="M32 8L14 16V30C14 42 22 52 32 56C42 52 50 42 50 30V16L32 8Z" fill="none" stroke="#C8A24E" strokeWidth="2.5" strokeLinejoin="round"/>
    <path d="M32 12L18 18.5V30C18 40.5 24.5 49 32 52C39.5 49 46 40.5 46 30V18.5L32 12Z" fill="rgba(200,162,78,0.06)"/>
  </svg>
);

const CheckItem = ({ text, sub, checked, onToggle }) => (
  <div style={{ display: "flex", gap: 12, padding: "8px 0", cursor: "pointer", userSelect: "none", alignItems: "center" }} onClick={onToggle}>
    <svg width="14" height="14" viewBox="0 0 14 14" style={{ flexShrink: 0 }}>
      <rect x="0.5" y="0.5" width="13" height="13" rx="2.5"
        fill={checked ? `${C.gold}20` : "rgba(200,162,78,0.04)"}
        stroke={checked ? C.gold : `${C.gold}40`} strokeWidth="1.5"/>
      {checked && <path d="M3.5 7L5.75 9.25L10.5 4.5" stroke={C.gold} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>}
    </svg>
    <div style={{ flex: 1 }}>
      <span style={{ fontSize: 12, color: checked ? C.text1 : C.text2, lineHeight: 1.5, transition: "color 0.2s" }}>{text}</span>
      {sub && <span style={{ display: "block", fontSize: 10.5, color: C.text3, lineHeight: 1.5, marginTop: 3 }}>{sub}</span>}
    </div>
  </div>
);

const ScoreSelector = ({ value, onChange, lowLabel, highLabel }) => {
  const activeColor = value ? scoreColor(value) : C.gold;
  return (
    <div style={{
      padding: "20px 24px", borderRadius: 12, marginTop: 16,
      background: value
        ? `linear-gradient(145deg, ${activeColor}08, ${activeColor}03)`
        : "linear-gradient(145deg, rgba(200,162,78,0.06), rgba(200,162,78,0.02))",
      border: `1.5px solid ${value ? `${activeColor}50` : `${C.gold}30`}`,
      boxShadow: value ? `0 0 20px ${activeColor}15, inset 0 1px 0 ${activeColor}15` : "none",
      transition: "all 0.3s ease",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: value ? activeColor : C.gold }}>Rate Yourself</span>
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: value ? activeColor : C.text4 }}>
          {value || "–"}<span style={{ fontSize: 12, color: C.text3 }}>/6</span>
        </span>
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
        {[1,2,3,4,5,6].map(n => {
          const c = scoreColor(n);
          const sel = value === n;
          return (
            <div key={n} onClick={() => onChange(n)} style={{
              flex: 1, height: 40, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", transition: "all 0.2s ease", userSelect: "none",
              background: sel ? `${c}20` : `${c}06`,
              border: `1.5px solid ${sel ? c : `${c}25`}`,
              boxShadow: sel ? `0 0 12px ${c}30` : "none",
            }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: sel ? c : `${c}60` }}>{n}</span>
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: 9, color: C.text3 }}>{lowLabel}</span>
        <span style={{ fontSize: 9, color: C.text3 }}>{highLabel}</span>
      </div>
      {!value && <div style={{ textAlign: "center", marginTop: 8, fontSize: 9, color: C.text4, letterSpacing: "0.08em", textTransform: "uppercase" }}>Tap a number to score</div>}
    </div>
  );
};

const GlassBtn = ({ href, color, children }) => (
  <a href={href} target="_blank" rel="noopener noreferrer"
    onMouseEnter={e => { const s=e.currentTarget.style; s.background=`linear-gradient(135deg,${color}22,${color}14)`; s.borderColor=`${color}60`; s.boxShadow=`0 0 32px ${color}20,0 4px 16px rgba(0,0,0,0.25)`; const a=e.currentTarget.querySelector('[data-arrow]'); if(a){a.style.opacity='1';a.style.transform='translateX(3px)';} }}
    onMouseLeave={e => { const s=e.currentTarget.style; s.background=`linear-gradient(135deg,${color}15,${color}08)`; s.borderColor=`${color}35`; s.boxShadow=`0 0 24px ${color}12,0 4px 12px rgba(0,0,0,0.2)`; const a=e.currentTarget.querySelector('[data-arrow]'); if(a){a.style.opacity='0';a.style.transform='translateX(0)';} }}
    style={{ position:"relative", display:"block", textAlign:"center", padding:"11px 28px", borderRadius:10, background:`linear-gradient(135deg,${color}15,${color}08)`, border:`1px solid ${color}35`, color, fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:700, letterSpacing:"0.03em", textDecoration:"none", cursor:"pointer", boxShadow:`0 0 24px ${color}12,0 4px 12px rgba(0,0,0,0.2)`, transition:"all 0.25s ease" }}>
    {children}
    <svg data-arrow="" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ position:"absolute", right:16, top:"50%", marginTop:-6.5, transition:"transform 0.25s ease, opacity 0.25s ease", opacity:0 }}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
  </a>
);

/* ── COMPLIANCE DISCLOSURE ── */
const Disclosure = ({ compact }) => (
  <div style={{ padding: compact ? "10px 14px" : "12px 16px", borderRadius: 8, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", marginTop: 12 }}>
    <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: C.text3, marginBottom: 5 }}>Important Disclosure</div>
    <div style={{ fontSize: 9, lineHeight: 1.55, color: C.text3 }}>
      This scorecard is an educational self-assessment tool from Kriczky Virtus. It is general in nature, is based entirely on your own self-reported answers, and does not constitute individualized financial, tax, legal, or accounting advice, nor a recommendation to pursue any particular course of action. No outcome is projected or guaranteed. Your situation is specific to you — coordinate any decision with your CPA, attorney, and other advisors before acting.
    </div>
  </div>
);

/* =================== EMAIL GATE =================== */
const EmailGate = ({ toolName, toolSlug, accentColor, scores, summary, onUnlock, onGeneratePdf }) => {
  const [gName, setGName] = useState("");
  const [gEmail, setGEmail] = useState("");
  const [gRevenue, setGRevenue] = useState("");
  const [gError, setGError] = useState("");
  const [gSending, setGSending] = useState(false);
  const handleGateSubmit = async () => {
    if (!gName.trim()) { setGError("Please enter your name so we can personalize your results."); return; }
    if (!gEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(gEmail)) { setGError("Please enter a valid email address."); return; }
    if (!gRevenue) { setGError("Please select your annual revenue so we can tailor your next steps."); return; }
    setGError(""); setGSending(true);
    let pdfBase64 = null;
    if (onGeneratePdf) { try { pdfBase64 = await onGeneratePdf(); } catch (err) { console.error("[PDF] Generation failed:", err); } }
    const payload = { name: gName.trim(), email: gEmail.trim(), revenueBand: gRevenue, tool: toolSlug, toolName, scores, summary, timestamp: new Date().toISOString(), pdfBase64 };
    try { const res = await fetch("/api/lead-capture", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }); if (res.ok) { onUnlock(gRevenue); return; } throw new Error("API unavailable"); }
    catch (err) {
      console.log("[Virtus] API failed, queuing silent retry:", err.message || err);
      console.log("[Virtus] Lead data:", JSON.stringify(payload, null, 2));
      var retryPayload = JSON.parse(JSON.stringify(payload)); retryPayload.pdfBase64 = null;
      var retryFn = function(attempt) {
        if (attempt > 5) { console.log("[Virtus] All retries exhausted. Lead data logged above."); return; }
        fetch("/api/lead-capture", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(retryPayload) })
          .then(function(r) { if (r.ok) { console.log("[Virtus] Retry " + attempt + " succeeded"); } else { throw new Error("fail"); } })
          .catch(function() { console.log("[Virtus] Retry " + attempt + " failed, next in " + (30*attempt) + "s"); setTimeout(function() { retryFn(attempt+1); }, 30000*attempt); });
      };
      setTimeout(function() { retryFn(1); }, 30000);
      onUnlock(gRevenue);
    }
    finally { setGSending(false); }
  };
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "60px 20px", textAlign: "center", position: "relative", pageBreakBefore: "always" }}>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 60% 50% at 50% 40%, " + accentColor + "10, transparent 70%)" }}/>
      <div style={{ position: "relative", zIndex: 1, maxWidth: 480, width: "100%" }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: accentColor + "10", border: "2px solid " + accentColor + "30", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", boxShadow: "0 0 20px " + accentColor + "15" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><polyline points="4 12 10 18 20 6" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 32, color: "#E8ECF1", textTransform: "uppercase", margin: "0 0 10px", lineHeight: 1.1 }}>Your answers are<br/><span style={{ color: accentColor }}>locked in.</span></h2>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#8B95A5", lineHeight: 1.6, margin: "0 0 8px" }}>Enter your name and email to see where you land on the reinvest-or-harvest matrix, plus your first three moves.</p>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#5A6474", lineHeight: 1.5, margin: "0 0 28px", fontStyle: "italic" }}>Your data stays with you. We will send you a copy of your results.</p>
        <div style={{ padding: "28px 24px", borderRadius: 18, background: "linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.04))", border: "1px solid " + accentColor + "20", borderTop: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 60px " + accentColor + "08", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: 18, pointerEvents: "none", background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 30%, transparent 50%, transparent 70%, rgba(255,255,255,0.03) 100%)" }}/>
          <div style={{ position: "relative", zIndex: 1 }}>
            <input type="text" placeholder="Full name" value={gName} onChange={e => { setGName(e.target.value); setGError(""); }} style={{ width: "100%", padding: "14px 16px", borderRadius: 10, background: "#0F141C", border: "1px solid rgba(255,255,255,0.10)", color: "#E8ECF1", fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none", marginBottom: 10, boxSizing: "border-box" }} onFocus={e => e.target.style.borderColor = accentColor + "50"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.10)"} />
            <input type="email" placeholder="Email address" value={gEmail} onChange={e => { setGEmail(e.target.value); setGError(""); }} onKeyDown={e => e.key === "Enter" && handleGateSubmit()} style={{ width: "100%", padding: "14px 16px", borderRadius: 10, background: "#0F141C", border: "1px solid rgba(255,255,255,0.10)", color: "#E8ECF1", fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none", marginBottom: gError ? 8 : 16, boxSizing: "border-box" }} onFocus={e => e.target.style.borderColor = accentColor + "50"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.10)"} />
            <select value={gRevenue} onChange={e => { setGRevenue(e.target.value); setGError(""); }} style={{ width: "100%", padding: "14px 16px", borderRadius: 10, background: "#0F141C", border: "1px solid rgba(255,255,255,0.10)", color: gRevenue ? "#E8ECF1" : "#5A6474", fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none", marginBottom: gError ? 8 : 16, boxSizing: "border-box", appearance: "none", cursor: "pointer" }} onFocus={e => e.target.style.borderColor = accentColor + "50"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.10)"}>
              <option value="" disabled>Annual revenue</option>
              {REVENUE_BANDS.map(b => <option key={b.value} value={b.value} style={{ background: "#0F141C", color: "#E8ECF1" }}>{b.label}</option>)}
            </select>
            {gError && <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#F87171", margin: "0 0 12px", textAlign: "left" }}>{gError}</p>}
            <button onClick={handleGateSubmit} disabled={gSending} onMouseEnter={e => { if (!gSending) { e.currentTarget.style.boxShadow = "0 0 48px " + accentColor + "40, 0 4px 20px rgba(0,0,0,0.35)"; e.currentTarget.style.borderColor = accentColor + "80"; e.currentTarget.style.background = "linear-gradient(135deg, " + accentColor + "25, " + accentColor + "15)"; var a = e.currentTarget.querySelector("[data-gate-arrow]"); if(a){ a.style.opacity="1"; a.style.transform="translateX(3px)"; } } }} onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 0 20px " + accentColor + "20, 0 4px 12px rgba(0,0,0,0.3)"; e.currentTarget.style.borderColor = accentColor + "50"; e.currentTarget.style.background = "linear-gradient(135deg, " + accentColor + "18, " + accentColor + "0a)"; var a = e.currentTarget.querySelector("[data-gate-arrow]"); if(a){ a.style.opacity="0"; a.style.transform="translateX(0)"; } }} style={{ width: "100%", padding: "16px 0", borderRadius: 12, border: "1.5px solid " + accentColor + "50", cursor: gSending ? "wait" : "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 15, color: accentColor, background: "linear-gradient(135deg, " + accentColor + "18, " + accentColor + "0a)", boxShadow: "0 0 20px " + accentColor + "20, 0 4px 12px rgba(0,0,0,0.3)", position: "relative", overflow: "hidden", transition: "all 0.3s ease", opacity: gSending ? 0.7 : 1 }}>
              <span style={{ position: "absolute", top: "-50%", left: "-50%", right: "-50%", bottom: "-50%", pointerEvents: "none", background: "linear-gradient(120deg, transparent 0%, transparent 40%, " + accentColor + "12 48%, " + accentColor + "20 50%, " + accentColor + "12 52%, transparent 60%, transparent 100%)", backgroundSize: "200% 200%", animation: "btnShimmer 6s ease-in-out infinite" }}/>
              <span style={{ position: "relative", zIndex: 1, display: "inline-flex", alignItems: "center", gap: 8 }}>{gSending ? "Unlocking your results..." : "See My Results"}{!gSending && <svg data-gate-arrow="" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0, transition: "all 0.25s ease" }}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>}</span>
            </button>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#5A6474", textAlign: "center", marginTop: 12 }}>No spam. No pitch. Just your personalized results.</p>
          </div>
        </div>
        <div style={{ marginTop: 24, padding: "16px 20px", borderRadius: 12, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", textAlign: "left" }}>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, fontWeight: 700, color: accentColor, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>What You Will Get</div>
          {["Your position on the reinvest-or-harvest matrix", "Separate scores for business capacity and personal foundation", "The two dimensions holding your position back", "Three specific moves calibrated to where you actually scored"].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}><polyline points="4 12 10 18 20 6" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#8B95A5" }}>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */

export default function ReinvestOrHarvestScorecard() {
  const [scores, setScores] = useState({});
  const [checks, setChecks] = useState({});
  const [gateUnlocked, setGateUnlocked] = useState(false);
  const [revenueBand, setRevenueBand] = useState("");
  const toolRef = useRef(null);


  /* Mobile: widen the viewport rather than scaling.
     CSS zoom and transform:scale both cause production failures on this layout.
     Idempotent + restores on unmount, so it's safe if a route wrapper also sets it. */
  useEffect(() => {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) return;
    const original = viewport.getAttribute('content');
    if (window.innerWidth < 816) {
      viewport.setAttribute('content', 'width=816, initial-scale=0.5, user-scalable=yes');
    }
    return () => { if (original) viewport.setAttribute('content', original); };
  }, []);

  const setScore = (key, val) => setScores(p => ({ ...p, [key]: val }));
  const toggleCheck = (dimKey, idx) => setChecks(p => {
    const k = `${dimKey}-${idx}`;
    return { ...p, [k]: !p[k] };
  });

  const allScored = DIMS.every(d => scores[d.key]);
  const totalScore = DIMS.reduce((s, d) => s + (scores[d.key] || 0), 0);
  const maxScore = DIMS.length * 6;
  const bizScore = BIZ_DIMS.reduce((s, d) => s + (scores[d.key] || 0), 0);
  const persScore = PERS_DIMS.reduce((s, d) => s + (scores[d.key] || 0), 0);

  const expanded = allScored && gateUnlocked;
  const activeBand = allScored ? BANDS.find(b => totalScore >= b.min && totalScore <= b.max) : null;
  const quadrant = allScored ? getQuadrant(bizScore, persScore) : null;
  const band = bandFor(revenueBand);
  const qualified = band ? band.qualified : true;

  const sorted = [...DIMS].filter(d => scores[d.key]).sort((a, b) => scores[a.key] - scores[b.key]);
  const lowestTwo = sorted.slice(0, 2);
  const lowestThree = sorted.slice(0, 3);

  let pageNum = 0;

  return (
    <div ref={toolRef} style={{ background: C.bgDeep, minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500&family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet"/>
      <style>{`@media print { .page-gap { display: none !important; } } @keyframes btnShimmer { 0%{background-position:200% 0}50%{background-position:-200% 0}100%{background-position:-200% 0} }`}</style>
      <div style={{ maxWidth: "8.5in", margin: "0 auto" }}>

        {/* ═══ PAGE 1: COVER ═══ */}
        <Page pageNum={++pageNum} expanded={expanded}>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", minHeight: "calc(11in - 1.6in)", position: "relative" }}>
            <div style={{ position: "absolute", top: -10, right: -10, fontFamily: "'Playfair Display', serif", fontSize: 170, fontWeight: 700, color: ACCENT, opacity: 0.03, lineHeight: 1, userSelect: "none" }}>10</div>

            <div style={{ textAlign: "center", marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
                <Shield size={48} glow />
              </div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", lineHeight: 1.15 }}>
                <span style={{ color: BIZ }}>Reinvest</span> <span style={{ color: C.text3, fontWeight: 400 }}>or</span> <span style={{ color: PERS }}>Harvest</span>
              </div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontStyle: "italic", color: C.text2, marginTop: 8 }}>
                The Owner's Capital Allocation Scorecard
              </div>
            </div>

            <div style={{ width: 40, height: 1.5, margin: "0 auto 22px", background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)` }}/>

            {/* Core Principle */}
            <div style={{ padding: "16px 20px", borderRadius: 10, background: "linear-gradient(135deg, rgba(200,162,78,0.06), rgba(200,162,78,0.015))", border: "1px solid rgba(200,162,78,0.2)", marginBottom: 18 }}>
              <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.gold, marginBottom: 6 }}>The Core Principle</div>
              <div style={{ fontSize: 11.5, lineHeight: 1.65, color: C.text2 }}>
                Every dollar of profit your business produces goes one of two places: back into the company, or out to you. Most owners make that call by feel, one quarter at a time, and only discover a decade later which way they leaned. The honest answer isn't a preference — it's a function of two things that have nothing to do with each other. Whether the business can actually convert more capital into return, and whether you have a foundation that survives if it doesn't. <span style={{ color: C.gold, fontWeight: 600 }}>Strength on one axis without the other is the position that quietly costs owners the most.</span>
              </div>
            </div>

            {/* Two-pillar explainer */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18 }}>
              <div style={{ padding: "12px 16px", borderRadius: 10, background: `linear-gradient(135deg, ${BIZ}08, ${BIZ}02)`, border: `1px solid ${BIZ}25` }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: BIZ, marginBottom: 5 }}>Pillar One — Dimensions 1–5</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 600, color: C.text1, marginBottom: 4 }}>Business Capacity</div>
                <div style={{ fontSize: 10.5, lineHeight: 1.55, color: C.text2 }}>Can the next dollar earn its return <i>inside</i> the company? Measured return, margin position, the binding constraint, absorption, and proven demand.</div>
              </div>
              <div style={{ padding: "12px 16px", borderRadius: 10, background: `linear-gradient(135deg, ${PERS}08, ${PERS}02)`, border: `1px solid ${PERS}25` }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: PERS, marginBottom: 5 }}>Pillar Two — Dimensions 6–10</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 600, color: C.text1, marginBottom: 4 }}>Personal Foundation</div>
                <div style={{ fontSize: 10.5, lineHeight: 1.55, color: C.text2 }}>Is the base <i>outside</i> the company built? Owner pay, liquid reserve, assets that don't depend on the business, tax coordination, and a defined horizon.</div>
              </div>
            </div>

            {/* Pill Grid — column-first so each pillar owns a column */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 7, marginBottom: 7 }}>
              <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: BIZ, textAlign: "center" }}>Business Capacity</div>
              <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: PERS, textAlign: "center" }}>Personal Foundation</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gridTemplateRows: "repeat(5, 1fr)", gridAutoFlow: "column", gap: 7, marginBottom: 18 }}>
              {DIMS.map(d => {
                const scored = !!scores[d.key];
                const sc = scored ? scoreColor(scores[d.key]) : d.color;
                return (
                  <div key={d.key} style={{
                    padding: "7px 10px", borderRadius: 6, display: "table", width: "100%", boxSizing: "border-box",
                    background: scored ? `${sc}12` : `${d.color}06`,
                    border: `1px solid ${scored ? `${sc}45` : `${d.color}22`}`,
                    transition: "all 0.3s ease",
                  }}>
                    <span style={{ display: "table-cell", verticalAlign: "middle", fontSize: 8, fontWeight: 600, letterSpacing: "0.03em", textTransform: "uppercase", color: scored ? sc : C.text3, textAlign: "center" }}>{d.title}</span>
                  </div>
                );
              })}
            </div>

            <div style={{ textAlign: "center", fontSize: 10, color: C.text3, fontStyle: "italic" }}>
              Score yourself 1–6 on each of the 10 dimensions. Your position updates automatically on the summary page.
            </div>
          </div>
        </Page>
        <div className="page-gap" style={{ height: 24 }}/>

        {/* ═══ PAGE 2: HOW TO USE ═══ */}
        <Page pageNum={++pageNum} expanded={expanded}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: PERS, marginBottom: 10 }}>How To Use This Diagnostic</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 400, lineHeight: 1.2, marginBottom: 18 }}>
            <span style={{ color: C.gold }}>Think in continuums,</span> <span style={{ color: C.text1 }}>not checkboxes.</span>
          </div>
          <p style={{ fontSize: 12, lineHeight: 1.65, color: C.text2, marginBottom: 10 }}>
            This isn't a quiz with right and wrong answers, and it won't tell you to reinvest or to take profit as a matter of principle. Both are correct answers in different situations. Two owners with identical revenue and identical margins can face opposite correct decisions, because one has a business that converts capital into return and no assets outside it, and the other has the reverse. The purpose here is to find out which of those you are.
          </p>
          <p style={{ fontSize: 12, lineHeight: 1.65, color: C.text2, marginBottom: 20 }}>
            Score each dimension based on where you truly are, not where you plan to be by year-end. The two pillars are deliberately scored separately, because the whole insight of this tool lives in the relationship between them. A strong total score with all the strength on one side produces a very different recommendation than the same total spread evenly — and the summary page will show you which you have.
          </p>

          {/* Why 1-6 */}
          <div style={{ padding: "14px 18px", borderRadius: 10, background: `${C.cyan}08`, border: `1.5px solid ${C.cyan}30`, marginBottom: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: C.cyan, marginBottom: 6 }}>Why 1–6 Instead of 1–5?</div>
            <div style={{ fontSize: 11, lineHeight: 1.6, color: C.text2 }}>
              A 1–5 scale lets you hide at "3" — safe, average, non-committal. Our 1–6 scale has <b style={{ color: C.text1 }}>no middle</b>. You're either below the midpoint (1–3) or above it (4–6). This forces honest self-assessment, which is the only kind that leads to a decision you'd actually act on.
            </div>
          </div>

          {/* Top Scores */}
          <div style={{ padding: "14px 18px", borderRadius: 10, background: `${C.gold}06`, border: `1.5px solid ${C.gold}25`, marginBottom: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: C.gold, marginBottom: 10 }}>What The Top Scores Mean</div>
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ flex: 1, padding: "10px 14px", borderRadius: 8, background: `${C.cyan}08`, border: `1px solid ${C.cyan}20` }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 4 }}>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: C.cyan }}>5</span>
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: C.cyan }}>Best In Class</span>
                </div>
                <div style={{ fontSize: 11, lineHeight: 1.5, color: C.text2 }}>A genuine advantage. You handle this better than the large majority of owners at your size — it's documented, repeatable, and it holds up when someone examines it closely.</div>
              </div>
              <div style={{ flex: 1, padding: "10px 14px", borderRadius: 8, background: `${C.green}08`, border: `1px solid ${C.green}20` }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 4 }}>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: C.green }}>6</span>
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: C.green }}>Perfect</span>
                </div>
                <div style={{ fontSize: 11, lineHeight: 1.5, color: C.text2 }}>Nothing meaningful left to improve. Most honest operators rarely give themselves this. If you do, be certain you'd bet on it — because it will be tested — by growth, by a downturn, or by the first person who looks at it closely.</div>
              </div>
            </div>
          </div>

          {/* For Each Section */}
          <div style={{ padding: "14px 18px", borderRadius: 10, background: `${C.gold}06`, border: `1px solid ${C.gold}20` }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: C.gold, marginBottom: 6 }}>For Each Dimension</div>
            <div style={{ fontSize: 11, lineHeight: 1.6, color: C.text2 }}>
              Read the description and checklist honestly. Use the checklist as a gut-check — not a scorecard. Then use the <b style={{ color: C.text1 }}>Rate Yourself</b> panel to assign your score. Dimensions 1–5 build your <span style={{ color: BIZ, fontWeight: 600 }}>Business Capacity</span> score and 6–10 build your <span style={{ color: PERS, fontWeight: 600 }}>Personal Foundation</span> score. Both are out of 30.
            </div>
          </div>

          <Disclosure />
        </Page>
        <div className="page-gap" style={{ height: 24 }}/>

        {/* ═══ PAGES 3–12: DIMENSION PAGES ═══ */}
        {DIMS.map((dim) => {
          pageNum++;
          const PC = dim.color;
          return (
            <div key={dim.key}>
              <Page pageNum={pageNum} expanded={expanded}>
                <div style={{ position: "relative" }}>
                  <div style={{ position: "absolute", top: -10, right: -10, fontFamily: "'Playfair Display', serif", fontSize: 130, fontWeight: 700, color: PC, opacity: 0.035, lineHeight: 1, userSelect: "none" }}>
                    {String(dim.num).padStart(2, "0")}
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: PC }}>
                      Dimension {String(dim.num).padStart(2, "0")} of {dim.of}
                    </span>
                    <span style={{ display: "table", padding: "2px 8px", borderRadius: 4, background: `${PC}12`, border: `1px solid ${PC}30` }}>
                      <span style={{ display: "table-cell", verticalAlign: "middle", fontSize: 8, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: PC }}>
                        {dim.pillar === "biz" ? "Business Capacity" : "Personal Foundation"}
                      </span>
                    </span>
                  </div>

                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.02em", lineHeight: 1.15, marginBottom: 4 }}>
                    {dim.title}
                  </div>

                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: PC, marginBottom: 16 }}>
                    {dim.subtitle}
                  </div>

                  <p style={{ fontSize: 12, lineHeight: 1.65, color: C.text2, marginBottom: 18 }}>
                    {dim.description}
                  </p>

                  <div style={{ padding: "12px 18px", borderRadius: 10, background: `linear-gradient(135deg, ${PC}08, ${PC}02)`, border: `1px solid ${PC}20`, marginBottom: 8 }}>
                    {dim.checks.map((c, ci) => (
                      <CheckItem key={ci} text={c.text} sub={c.sub}
                        checked={!!checks[`${dim.key}-${ci}`]}
                        onToggle={() => toggleCheck(dim.key, ci)}/>
                    ))}
                  </div>

                  <ScoreSelector value={scores[dim.key]} onChange={v => setScore(dim.key, v)}
                    lowLabel={dim.lowLabel} highLabel={dim.highLabel}/>
                </div>
              </Page>
              <div className="page-gap" style={{ height: 24 }}/>
            </div>
          );
        })}

        {/* ═══ SCORING SUMMARY PAGE ═══ */}
        <Page pageNum={++pageNum} expanded={expanded}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: ACCENT, marginBottom: 6 }}>Your Allocation Scores</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 500, lineHeight: 1.2, marginBottom: 18 }}>
            Two scores, deliberately <span style={{ color: ACCENT }}>kept apart.</span>
          </div>

          {/* PILLAR ONE */}
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: BIZ }}>Pillar One — Business Capacity</span>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 700, color: BIZ }}>
              {bizScore}<span style={{ fontSize: 10, color: C.text3 }}>/{PILLAR_MAX}</span>
            </span>
          </div>
          {BIZ_DIMS.map(d => {
            const sc = scores[d.key];
            const barColor = sc ? scoreColor(sc) : C.text4;
            const pct = sc ? (sc / 6) * 100 : 0;
            return (
              <div key={d.key} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 9.5, color: C.text2, width: 200, flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.title}</span>
                <div style={{ flex: 1, height: 8, borderRadius: 4, background: `${C.text4}20`, overflow: "hidden" }}>
                  <div style={{ width: `${pct}%`, height: "100%", borderRadius: 4, background: barColor, transition: "all 0.4s ease", boxShadow: sc ? `0 0 6px ${barColor}40` : "none" }}/>
                </div>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 13, fontWeight: 700, color: sc ? barColor : C.text4, width: 22, textAlign: "right" }}>{sc || "–"}</span>
              </div>
            );
          })}

          {/* PILLAR TWO */}
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginTop: 16, marginBottom: 8 }}>
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: PERS }}>Pillar Two — Personal Foundation</span>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 700, color: PERS }}>
              {persScore}<span style={{ fontSize: 10, color: C.text3 }}>/{PILLAR_MAX}</span>
            </span>
          </div>
          {PERS_DIMS.map(d => {
            const sc = scores[d.key];
            const barColor = sc ? scoreColor(sc) : C.text4;
            const pct = sc ? (sc / 6) * 100 : 0;
            return (
              <div key={d.key} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 9.5, color: C.text2, width: 200, flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.title}</span>
                <div style={{ flex: 1, height: 8, borderRadius: 4, background: `${C.text4}20`, overflow: "hidden" }}>
                  <div style={{ width: `${pct}%`, height: "100%", borderRadius: 4, background: barColor, transition: "all 0.4s ease", boxShadow: sc ? `0 0 6px ${barColor}40` : "none" }}/>
                </div>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 13, fontWeight: 700, color: sc ? barColor : C.text4, width: 22, textAlign: "right" }}>{sc || "–"}</span>
              </div>
            );
          })}

          {/* Total */}
          <div style={{ padding: "12px 16px", borderRadius: 10, background: `${ACCENT}08`, border: `1.5px solid ${ACCENT}30`, display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16, marginBottom: 14 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: ACCENT }}>Total Allocation Discipline Score</span>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: expanded ? (activeBand?.color || ACCENT) : C.text4 }}>
              {totalScore}<span style={{ fontSize: 13, color: C.text3 }}>/{maxScore}</span>
              {expanded && <span style={{ fontSize: 13, fontWeight: 600, color: C.text2, marginLeft: 8 }}>({Math.round((totalScore / maxScore) * 100)}%)</span>}
            </span>
          </div>

          {/* Diagnosis */}
          {expanded && activeBand && (
            <div style={{ padding: "14px 18px", borderRadius: 10, background: `${activeBand.color}08`, border: `1.5px solid ${activeBand.color}30`, marginBottom: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: activeBand.color, marginBottom: 2 }}>{activeBand.label}</div>
              <div style={{ fontSize: 9, color: C.text3, marginBottom: 8 }}>Score Range: {activeBand.range} of 60</div>
              <div style={{ fontSize: 11.5, lineHeight: 1.6, color: C.text2, marginBottom: 10 }}>{activeBand.desc}</div>
              {lowestTwo.length >= 2 && (
                <div style={{ fontSize: 11, color: C.text1, marginBottom: 8 }}>
                  <b>Your biggest opportunities:</b>{" "}
                  <span style={{ color: scoreColor(scores[lowestTwo[0].key]) }}>{lowestTwo[0].title}</span> and{" "}
                  <span style={{ color: scoreColor(scores[lowestTwo[1].key]) }}>{lowestTwo[1].title}</span>.
                </div>
              )}
              <div style={{ fontSize: 11, lineHeight: 1.6, color: C.text2, fontStyle: "italic", marginBottom: 6 }}>
                A low score on any single dimension doesn't mean you need to build something new. Often the lever already exists and simply isn't being pulled — you have the data but never review it, or the reserve account exists but nothing routes into it automatically.
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.text1 }}>
                The question is whether you need a new lever — or whether the one you have just needs to be pulled harder.
              </div>
            </div>
          )}

          {/* Imbalance flag — a healthy total can hide a lopsided split */}
          {expanded && Math.abs(bizScore - persScore) >= 6 && (
            <div style={{ padding: "12px 16px", borderRadius: 10, background: `${C.amber}08`, border: `1.5px solid ${C.amber}35`, marginBottom: 12 }}>
              <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: C.amber, marginBottom: 5 }}>Read The Split, Not The Total</div>
              <div style={{ fontSize: 11, lineHeight: 1.6, color: C.text2 }}>
                Your two pillars are {Math.abs(bizScore - persScore)} points apart —{" "}
                <span style={{ color: bizScore > persScore ? BIZ : PERS, fontWeight: 700 }}>
                  {bizScore > persScore ? "Business Capacity" : "Personal Foundation"}
                </span>{" "}
                is carrying this score. A respectable total built almost entirely on one side is a different situation than the same total spread evenly, and it calls for a different decision. Your position on the next page is based on the two pillars separately, not on this number.
              </div>
            </div>
          )}

          {/* Banding Cards */}
          {expanded && <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {BANDS.map(b => {
              const isActive = activeBand?.label === b.label;
              return (
                <div key={b.label} style={{
                  padding: "10px 14px", borderRadius: 10,
                  background: `linear-gradient(135deg, ${b.color}${isActive ? "12" : "06"}, ${b.color}02)`,
                  border: `1px solid ${b.color}${isActive ? "50" : "15"}`,
                  boxShadow: isActive ? `0 0 16px ${b.color}20` : "none",
                  opacity: isActive ? 1 : 0.35,
                  transition: "all 0.5s ease",
                }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: b.color, marginBottom: 2 }}>{b.label}</div>
                  <div style={{ fontSize: 9, color: C.text3 }}>{b.range} points</div>
                </div>
              );
            })}
          </div>}
        </Page>
        <div className="page-gap" style={{ height: 24 }}/>

        {/* EMAIL GATE */}
        {allScored && !gateUnlocked && (
          <EmailGate
            toolName="Reinvest or Harvest Scorecard"
            toolSlug="reinvest-harvest"
            accentColor={ACCENT}
            scores={scores}
            summary={{
              totalScore, maxScore, pct: Math.round((totalScore / maxScore) * 100),
              band: activeBand?.label,
              bizScore, persScore, pillarMax: PILLAR_MAX,
              quadrant: quadrant?.label, quadrantKey: quadrant?.key,
              trackIntent: quadrant?.key === "harvest" || quadrant?.key === "split" ? "Wealth" : "Business",
            }}
            onUnlock={(rb) => { if (rb) setRevenueBand(rb); setGateUnlocked(true); }}
            onGeneratePdf={async () => {
              setGateUnlocked(true);
              await new Promise(r => setTimeout(r, 800));
              const el = toolRef.current;
              if (!el) return null;
              try {
                const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: "#0A0E14", logging: false, windowWidth: 800 });
                const imgData = canvas.toDataURL("image/jpeg", 0.85);
                const imgW = 210;
                const imgH = (canvas.height * imgW) / canvas.width;
                const pdf = new jsPDF("p", "mm", "a4");
                let pos = 0;
                while (pos < imgH) {
                  if (pos > 0) pdf.addPage();
                  pdf.addImage(imgData, "JPEG", 0, -pos, imgW, imgH);
                  pos += 297;
                }
                return pdf.output("datauristring").split(",")[1];
              } catch (err) { console.error("[PDF] Generation failed:", err); return null; }
            }}
          />
        )}

        {/* ═══ YOUR POSITION — THE MATRIX (gated) ═══ */}
        {expanded && quadrant && (
          <>
            <Page pageNum={++pageNum} expanded={expanded}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: quadrant.color, marginBottom: 8 }}>Your Position</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.02em", lineHeight: 1.15, marginBottom: 4, color: quadrant.color }}>
                {quadrant.label}
              </div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontStyle: "italic", color: C.text1, marginBottom: 16 }}>
                {quadrant.headline}
              </div>

              {/* The 2x2 */}
              <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                {/* Y axis label */}
                <div style={{ width: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: PERS, transform: "rotate(180deg)", writingMode: "vertical-rl", whiteSpace: "nowrap" }}>Personal Foundation</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {[QUADRANTS.harvest, QUADRANTS.reinvest, QUADRANTS.stabilize, QUADRANTS.split].map(q => {
                      const on = quadrant.key === q.key;
                      return (
                        <div key={q.key} style={{
                          padding: "14px 16px", borderRadius: 10, minHeight: 76,
                          background: `linear-gradient(135deg, ${q.color}${on ? "16" : "05"}, ${q.color}02)`,
                          border: `1.5px solid ${q.color}${on ? "60" : "15"}`,
                          boxShadow: on ? `0 0 22px ${q.color}25` : "none",
                          opacity: on ? 1 : 0.32, transition: "all 0.5s ease",
                        }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: q.color, marginBottom: 4 }}>{q.label}</div>
                          <div style={{ fontSize: 9.5, lineHeight: 1.5, color: C.text2 }}>{q.posture}</div>
                          {on && <div style={{ display: "table", marginTop: 8, padding: "2px 8px", borderRadius: 4, background: `${q.color}20`, border: `1px solid ${q.color}45` }}>
                            <span style={{ display: "table-cell", verticalAlign: "middle", fontSize: 7.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: q.color }}>You are here</span>
                          </div>}
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ textAlign: "center", marginTop: 8, fontSize: 8, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: BIZ }}>Business Capacity →</div>
                </div>
              </div>

              {/* Your two coordinates */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
                <div style={{ padding: "12px 16px", borderRadius: 10, background: `${BIZ}08`, border: `1px solid ${BIZ}25` }}>
                  <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: BIZ, marginBottom: 4 }}>Business Capacity</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: bizScore >= PILLAR_THRESHOLD ? C.green : C.amber }}>{bizScore}</span>
                    <span style={{ fontSize: 11, color: C.text3 }}>/ {PILLAR_MAX}</span>
                    <span style={{ fontSize: 10, color: C.text2, marginLeft: "auto" }}>{bizScore >= PILLAR_THRESHOLD ? "Above threshold" : "Below threshold"}</span>
                  </div>
                </div>
                <div style={{ padding: "12px 16px", borderRadius: 10, background: `${PERS}08`, border: `1px solid ${PERS}25` }}>
                  <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: PERS, marginBottom: 4 }}>Personal Foundation</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: persScore >= PILLAR_THRESHOLD ? C.green : C.amber }}>{persScore}</span>
                    <span style={{ fontSize: 11, color: C.text3 }}>/ {PILLAR_MAX}</span>
                    <span style={{ fontSize: 10, color: C.text2, marginLeft: "auto" }}>{persScore >= PILLAR_THRESHOLD ? "Above threshold" : "Below threshold"}</span>
                  </div>
                </div>
              </div>

              {/* What this means */}
              <div style={{ padding: "14px 18px", borderRadius: 10, background: `${quadrant.color}08`, border: `1.5px solid ${quadrant.color}30`, marginBottom: 12 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: quadrant.color, marginBottom: 6 }}>What This Means</div>
                <div style={{ fontSize: 11.5, lineHeight: 1.65, color: C.text2 }}>{quadrant.body}</div>
              </div>

              <div style={{ padding: "12px 16px", borderRadius: 10, background: `${C.amber}06`, border: `1px solid ${C.amber}25` }}>
                <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: C.amber, marginBottom: 5 }}>The Trap In This Quadrant</div>
                <div style={{ fontSize: 11, lineHeight: 1.6, color: C.text2 }}>{quadrant.watch}</div>
              </div>

              <Disclosure compact />
            </Page>
            <div className="page-gap" style={{ height: 24 }}/>

            {/* ═══ YOUR FIRST 3 MOVES (gated) ═══ */}
            <Page pageNum={++pageNum} expanded={expanded}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: PERS, marginBottom: 10 }}>Your Personalized Next Steps</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 500, lineHeight: 1.2, marginBottom: 14 }}>
                Your first three moves.
              </div>
              <p style={{ fontSize: 12, lineHeight: 1.65, color: C.text2, marginBottom: 20 }}>
                These come from your three lowest-scoring dimensions, calibrated to the level you actually scored — a 2 and a 4 on the same dimension call for different work. None of them require capital you don't have. Every one is executable inside thirty days.
              </p>

              {lowestThree.map((d, i) => {
                const sc = scores[d.key];
                const tier = sc <= 2 ? "low" : sc <= 4 ? "mid" : "high";
                const tactic = d.quickWins[tier][0];
                const PC = d.color;
                return (
                  <div key={d.key} style={{ padding: "14px 18px", borderRadius: 10, background: `${PC}06`, border: `1px solid ${PC}20`, marginBottom: 12 }}>
                    <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                      <div style={{ display: "table", padding: "3px 10px", borderRadius: 5, background: `${C.gold}15`, border: `1px solid ${C.gold}30` }}>
                        <span style={{ display: "table-cell", verticalAlign: "middle", fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: C.gold }}>Move {String(i + 1).padStart(2, "0")}</span>
                      </div>
                      <div style={{ display: "table", padding: "3px 10px", borderRadius: 5, background: `${PC}12`, border: `1px solid ${PC}30` }}>
                        <span style={{ display: "table-cell", verticalAlign: "middle", fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: PC }}>{d.pillar === "biz" ? "Business" : "Personal"}</span>
                      </div>
                    </div>
                    <div style={{ fontSize: 10, color: PC, fontWeight: 600, marginBottom: 2 }}>
                      {d.title} <span style={{ color: scoreColor(sc) }}>({sc}/6)</span>
                    </div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontWeight: 600, color: C.text1, marginBottom: 4 }}>{tactic.title}</div>
                    <div style={{ fontSize: 10.5, lineHeight: 1.55, color: C.text2 }}>{tactic.context}</div>
                  </div>
                );
              })}

              <div style={{ padding: "14px 18px", borderRadius: 10, background: `${ACCENT}06`, border: `1.5px solid ${ACCENT}25`, marginTop: 4 }}>
                <div style={{ fontSize: 11.5, lineHeight: 1.65, color: C.text2 }}>
                  You can run all three of these yourself — none of them need me. What they won't do is answer the larger question underneath: whether the direction you're leaning is the one your specific numbers actually support. That takes a look at real financials, not self-reported scores. If that's the conversation you want, <span style={{ color: ACCENT, fontWeight: 700 }}>the next page is where it starts.</span>
                </div>
              </div>
            </Page>
            <div className="page-gap" style={{ height: 24 }}/>
          </>
        )}

        {/* ═══ CTA PAGE ═══ */}
        <Page pageNum={expanded ? TOTAL_PAGES_EXPANDED : TOTAL_PAGES_BASE} expanded={expanded}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: C.gold, marginBottom: 10 }}>
            {band ? `What Happens Next For ${band.display} Owners` : "What Happens Next"}
          </div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 500, lineHeight: 1.2, marginBottom: 20 }}>
            Knowing which way you lean is the beginning, <span style={{ color: ACCENT }}>not the end.</span>
          </div>

          {/* Edward headshot + bio */}
          <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 18 }}>
            <div style={{ width: 88, height: 88, borderRadius: "50%", flexShrink: 0, overflow: "hidden", outline: `2px solid ${C.gold}40`, outlineOffset: 2, background: C.bgElev }}>
              <img src={HEADSHOT} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}/>
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.text1 }}>Edward Kriczky, <span style={{ color: C.text1 }}>CEPA<sup style={{ fontSize: 10, fontWeight: 600, top: "-0.45em", position: "relative", marginLeft: 1 }}>&#174;</sup></span></div>
              <div style={{ fontSize: 11, color: C.gold, marginBottom: 6 }}>Founder, Kriczky Virtus</div>
              <div style={{ fontSize: 11, lineHeight: 1.6, color: C.text2 }}>
                <span style={{ color: C.gold, fontWeight: 600 }}>We've all heard the phrase "reinvest back into your business" — but nobody shows you how, specifically customized to your company's unique situation. I help business owners figure out where their best opportunities for ROI are when reinvesting back into their business, aligned with where they want their business to go long-term.</span>{" "}
                Most advisors work one side of this. Your CPA looks at the business, someone else looks at your personal accounts, and nobody is in the room when you decide where the next dollar goes — which is the decision that actually determines how this ends.
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div style={{ padding: "18px 22px", borderRadius: 12, marginBottom: 18,
            background: `linear-gradient(135deg, ${C.gold}06, ${C.gold}02)`, border: `1.5px solid ${C.gold}25` }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 500, color: C.text1, marginBottom: 16 }}>
              {band ? (qualified ? "How I help owners 1-on-1." : "Where to start.") : "What happens next."}
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", marginBottom: 4 }}>
              {(qualified ? [
                { label: "Step 1", title: "Free Working Session", desc: "We walk your two scores against your actual numbers. No pitch, no deck.", color: C.gold, icon: <><rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke={C.gold} strokeWidth="1.3" fill="none"/><line x1="3" y1="10" x2="21" y2="10" stroke={C.gold} strokeWidth="1.3"/><line x1="8" y1="2" x2="8" y2="6" stroke={C.gold} strokeWidth="1.3"/><line x1="16" y1="2" x2="16" y2="6" stroke={C.gold} strokeWidth="1.3"/></> },
                { label: "Step 2", title: "Find Your ROI Opportunities", desc: "We rank where a reinvested dollar actually earns in your business, with the numbers behind each one.", color: C.gold, icon: <><line x1="6" y1="20" x2="6" y2="16" stroke={C.gold} strokeWidth="1.3"/><line x1="12" y1="20" x2="12" y2="10" stroke={C.gold} strokeWidth="1.3"/><line x1="18" y1="20" x2="18" y2="4" stroke={C.gold} strokeWidth="1.3"/></> },
                { label: "Step 3", title: "Reinvest, Together", desc: "We work the highest-return moves with you and re-rank them as the business changes.", color: C.green, icon: <><circle cx="12" cy="12" r="9" stroke={C.green} strokeWidth="1.3" fill="none"/><circle cx="12" cy="12" r="5" stroke={C.green} strokeWidth="1.3" fill="none"/><circle cx="12" cy="12" r="1.5" fill={C.green}/></> },
              ] : [
                { label: "Step 1", title: "Join The Virtus Collective", desc: "Free. It's where owners at your stage work through exactly these decisions.", color: C.gold, icon: <><path d="M17 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2" stroke={C.gold} strokeWidth="1.3" fill="none"/><circle cx="10" cy="7" r="4" stroke={C.gold} strokeWidth="1.3" fill="none"/><path d="M23 21v-2a4 4 0 00-3-3.87" stroke={C.gold} strokeWidth="1.3" fill="none"/></> },
                { label: "Step 2", title: "Work Your Lowest Scores", desc: "Your first three moves, plus the playbooks and the other owners already running them.", color: C.gold, icon: <><line x1="6" y1="20" x2="6" y2="16" stroke={C.gold} strokeWidth="1.3"/><line x1="12" y1="20" x2="12" y2="10" stroke={C.gold} strokeWidth="1.3"/><line x1="18" y1="20" x2="18" y2="4" stroke={C.gold} strokeWidth="1.3"/></> },
                { label: "Step 3", title: "Re-Score As You Grow", desc: "Come back through this scorecard as the business moves. The right answer changes with it.", color: C.green, icon: <><circle cx="12" cy="12" r="9" stroke={C.green} strokeWidth="1.3" fill="none"/><circle cx="12" cy="12" r="5" stroke={C.green} strokeWidth="1.3" fill="none"/><circle cx="12" cy="12" r="1.5" fill={C.green}/></> },
              ]).map((step, si, arr) => (
                <div key={si} style={{ display: "flex", alignItems: "flex-start", flex: si < arr.length - 1 ? 1 : undefined }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ width: 38, height: 38, borderRadius: "50%", border: `2px solid ${step.color}55`, background: `${step.color}06`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 10px ${step.color}20, 0 0 3px ${step.color}25` }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">{step.icon}</svg>
                    </div>
                    <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: step.color, marginTop: 5 }}>{step.label}</span>
                    <span style={{ fontSize: 10, fontWeight: 600, color: C.text1, marginTop: 3 }}>{step.title}</span>
                    <span style={{ fontSize: 9, color: C.text2, lineHeight: 1.45, textAlign: "center", marginTop: 3, maxWidth: 140 }}>{step.desc}</span>
                  </div>
                  {si < arr.length - 1 && <div style={{ flex: 1, height: 2, marginTop: 19, background: `${C.gold}45`, boxShadow: `0 0 4px ${C.gold}15` }}/>}
                </div>
              ))}
            </div>
          </div>

          {/* Primary CTA — routed by revenue tier */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
            <div style={{ display: "inline-block" }}>
              {qualified
                ? <GlassBtn href={SESSION_URL} color={C.gold}>BOOK YOUR FREE WORKING SESSION</GlassBtn>
                : <GlassBtn href={COLLECTIVE_URL} color={C.gold}>JOIN THE VIRTUS COLLECTIVE &#8212; FREE</GlassBtn>}
            </div>
          </div>

          {/* Closing quote */}
          <div style={{ padding: "14px 0 14px 18px", borderLeft: `3px solid ${C.gold}60`, marginBottom: 12 }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontStyle: "italic", lineHeight: 1.5, color: C.text1 }}>
              Nobody decides to put everything into one asset. It happens one reasonable decision at a time, over fifteen years, and each individual choice was defensible. The owners who end up with real freedom aren't the ones who chose the business over themselves, or themselves over the business. They're the ones who <span style={{ color: C.gold, fontWeight: 700, fontStyle: "normal" }}>decided on purpose.</span>
            </div>
          </div>

          <Disclosure compact />

          <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${C.text4}60, transparent)`, margin: "14px 0" }}/>

          {/* Contact footer */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.text3} strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/></svg>
                <span style={{ fontSize: 10, color: C.text3 }}>ekriczky@kriczkyvirtus.com</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.text3} strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span style={{ fontSize: 10, color: C.text3 }}>kriczkyvirtus.com</span>
              </div>
            </div>
            <Shield size={32} glow />
          </div>
        </Page>

      </div>
    </div>
  );
}
```

---

## 8. AFTER DEPLOY

Once Vercel has rebuilt and the Section 6 checklist passes on production, confirm back with:
- The live URL
- The `curl -I /ig` output
- The four quadrant test results
- Both CTA branch results
- Answers to the three verification questions in Section 5

Do not proceed to any further work on this tool without confirmation.
