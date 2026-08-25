# Replit Agent Prompt — Add /cohort Landing Page

## Context
I'm attaching a React component (`Cohort.jsx`) — an application page for the Virtus Collective cohort program at `/cohort`.

## What You Need To Do

### 1. Add the component file
Place `Cohort.jsx` in the same directory as the other page components (wherever `FreeWorkingSession.jsx`, `AcqVantageBonus.jsx`, `ValuationEstimate.jsx` live).

### 2. Add the route
In the app's router, add:
```jsx
import Cohort from "./Cohort"; // adjust path as needed

<Route path="/cohort" element={<Cohort />} />
```

Make sure this is added ABOVE the SPA catch-all if one exists.

### 3. Verify the page loads
Navigate to `/cohort`. You should see: centered logo lockup, gold pill reading "The Virtus Collective — Cohort Program", a large serif headline "Nine other owners / who get it.", four icon cards under "What's included", a two-column fit comparison, a $797/month pricing card, the application form, Edward's headshot and bio, consent text, and footer.

### 4. Update `/api/lead-capture` to handle the `cohort-waitlist` tool

The form POSTs to `/api/lead-capture` with:
```json
{
  "name": "...",
  "email": "...",
  "tool": "cohort-waitlist",
  "toolName": "Cohort Application",
  "revenueRange": "$1M - $3M",
  "businessConstraint": "free text",
  "timeline": "Ready now",
  "reason": "free text (optional)",
  "timestamp": "..."
}
```

Add a branch in the handler for `tool === "cohort-waitlist"`. Everything below applies ONLY to that tool name. Do not change behavior for any other tool.

#### 4a. Tags that MUST NOT be applied

```
Website Lead      (tag id 7)   ← DO NOT APPLY
Track: Business   (tag id 39)  ← DO NOT APPLY
```

Both of these are triggers on the `[N1] Business Owner Nurture — Foundational` automation. Applying either one drops the applicant into a 17-email nurture sequence that asks them to book a free working session — sent to someone who just applied to a paid program. If the default code path applies `Website Lead` to every submission, add an explicit guard so it is skipped for this tool.

#### 4b. Tags that MUST be applied

```
Cohort: Waitlist    (tag id 46)
Source: Website     (tag id 12)
Entry: Lead Magnet  (tag id 42)
```

Note: `Source: Website` is tag id **12**, not 8. Tag 8 is `Tool: WMBW`.

#### 4c. Tier tag, mapped from `revenueRange`

| `revenueRange` value | Apply tag id(s) |
|---|---|
| `Under $500K` | 51 and 62 |
| `$500K - $1M` | 51 and 59 |
| `$1M - $3M` | 18 |
| `$3M - $10M` | 52 |
| `$10M+` | 53 |

Sub-$1M applies both the canonical tag (51) and the granular one. Match the string exactly; if no match, apply no tier tag rather than guessing.

#### 4d. Custom fields to write

Use the ActiveCampaign fieldValues API with these field IDs:

| Payload key | AC field ID | Field name |
|---|---|---|
| `revenueRange` | 2 | Revenue Range |
| `businessConstraint` | 3 | Business Constraint |
| `timeline` | 8 | Cohort Timeline |
| `reason` | 9 | Interest Reason |

All four are required. These four answers are the entire point of the form — if they are not written, the submission is worthless even though the contact was created.

#### 4e. Notification email

If the handler already sends a notification email for other tools (e.g. the valuation-estimate page), send one for this tool too, containing all four answers plus name and email. Subject: `New cohort application — {name}`. Send to `ekriczky@kriczkyvirtus.com`.

The email is a notification, not the storage mechanism. The custom fields above are the system of record.

#### 4f. Google Sheets

If the handler logs submissions to Google Sheets per tool, add a `cohort-waitlist` tab following the existing pattern, with columns for all four answers.

### 5. Verify in ActiveCampaign — not in the logs

A 200 response proves nothing. After submitting a test application, open the contact in ActiveCampaign and confirm:

- [ ] Contact was created with the correct name and email
- [ ] `Cohort: Waitlist` (46) is applied
- [ ] `Source: Website` (12) is applied
- [ ] `Entry: Lead Magnet` (42) is applied
- [ ] The correct tier tag is applied for the revenue selected
- [ ] **`Website Lead` (7) is NOT applied**
- [ ] **`Track: Business` (39) is NOT applied**
- [ ] `Revenue Range` field is populated
- [ ] `Business Constraint` field is populated
- [ ] `Cohort Timeline` field is populated
- [ ] `Interest Reason` field is populated
- [ ] The contact did NOT enter the `[N1]` automation

Test at least twice — once with `Under $500K` and once with `$3M - $10M` — to confirm the tier mapping works at both ends.

Also check the Vercel logs for errors. If the request 400s or the tool name causes a crash, fix the validation so it passes through — but do NOT change the payload the component sends.

### 6. Commit and push
```bash
git add .
git commit -m "add cohort application page and lead-capture handling"
git push
```

## Critical Instructions
- Do NOT restructure, refactor, or "improve" any code in the component.
- Do NOT change any design tokens, colors, fonts, spacing, or copy.
- Do NOT add any new dependencies.
- Do NOT modify any other existing pages or components.
- Do NOT change `/api/lead-capture` behavior for any tool other than `cohort-waitlist`.
- Do NOT create a deal in the `Cohort Enrollment` pipeline — that is handled separately.
