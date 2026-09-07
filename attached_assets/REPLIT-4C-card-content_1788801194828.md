# REPLIT — HUB CARD CONTENT + EMAIL QA

Both gaps answered. You were right not to invent either.

---

## 1 · THE CARD

Existing granular cards use `{ id, title, subtitle, oneLiner, duration, accent, capital, img }`, with `img` rendered conditionally. Use this:

```js
{
  id: "reinvest-harvest",
  href: "/reinvest-harvest",
  title: "Reinvest or Harvest",
  subtitle: "Profit Allocation Scorecard",
  oneLiner: "Should the next dollar of profit go back into the business, or out to you?",
  duration: "12 min",
  accent: C.gold,
  capital: "Business & Personal",
}
```

**Omit `img`.** No cover image exists for this tool yet, and the renderer already guards with `tool.img &&`. Confirm the card lays out correctly without one — if it collapses or looks broken, stop and report rather than substituting another tool's cover.

### Two notes on the copy

**The subtitle differs from what `REPLIT-4` §1 said.** That said "The Owner's Capital Allocation Scorecard." **Use "Profit Allocation Scorecard" instead.** Owner-facing copy across this brand avoids the word "capital" — it isn't how owners talk about their own money. The same correction was already made to the report's header. My earlier prompt was inconsistent with the standard; this supersedes it.

**`capital: "Business & Personal"`** is deliberate. Existing values are Human, Structural and Customer Capital — the Four Capitals framework. This tool doesn't sit in that framework; it's dual-pillar by design. If that value breaks a filter, a legend, or a colour lookup that expects one of the three known values, **stop and report** rather than forcing it into the closest match.

---

## 2 · EMAIL QA — split between us

You can't read the inbox, and you shouldn't be given credentials to one. So:

**Run the submission using `ekriczky@kriczkyvirtus.com`.**

Then verify everything you *can* reach — Blob, both Sheets tabs, the ActiveCampaign contact and its tags, the 200 response, the token, the report rendering at `/r/{token}`.

**For the email itself, report these instead of pass/fail:**

- the Resend API response (accepted / rejected, and the message ID if returned)
- confirmation that both `html` and `text` parts were included in the send
- the exact `from` and `reply-to` used
- the `/r/{token}` URL that went into the email body

The inbox side — did it arrive, which tab, does it render, does the link work — gets checked outside this workspace and reported back to you.

⚠️ **Mark that check `PENDING — external`, not PASS.** Do not infer arrival from a successful API call. A 200 from Resend means accepted for delivery, nothing more.

---

## 3 · EVERYTHING ELSE PROCEEDS

`REPLIT-4` §2 through §6 in full, including §2b.

⚠️ The `RESEND_API_KEY` check stays last, on a throwaway submission, key restored immediately. Skip and report rather than leaving it broken.

---

## REPORT BACK

```
HUB CARD
  href fallback applied to all render paths?  Y/N   how many:
  existing cards unaffected?  Y/N
  card renders correctly without img?  Y/N
  capital: "Business & Personal" — broke any filter/legend/lookup?  Y/N
  link resolves to /reinvest-harvest?  Y/N

EMAIL SEND (not arrival)
  Resend response:
  both html and text parts sent?  Y/N
  from / reply-to used:
  report URL placed in the email:
  arrival:  PENDING — external

Then the full REPLIT-4 report block.
```
