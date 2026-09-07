# REPLIT — HUB CARD DECISION + RUN THE QA

Two things. The Hub question is answered below. The QA pass should not have been blocked by it.

---

## 1 · MY PROMPT WAS STRUCTURED WRONG — THE QA IS INDEPENDENT

You stopped at the Hub guard and then skipped the end-to-end run, the 11 data-integrity checks, the 6 failure paths, and the 5 cross-surface checks.

**That was a reasonable reading of a badly ordered prompt.** The Hub card happened to be §1 and the QA §2, but they have nothing to do with each other — the Hub is a link on another page, and the QA tests a funnel that is already deployed and working.

**Rule going forward:** a stop condition halts *that item*, not the whole prompt. If other sections are independent, run them and report the stop separately.

Everything in `REPLIT-4` §2 onward is independent of the Hub card. Run it.

---

## 2 · HUB CARD — ADD AN OPTIONAL `href` OVERRIDE

Answering your question:

> How should the Resources Hub represent tools whose canonical route is outside `/tools/`?

**Add an optional `href` field to the card contract.** Cards that don't supply one keep the existing `/tools/${tool.id}` behaviour, unchanged.

```js
// before
href={`/tools/${tool.id}`}

// after
href={tool.href || `/tools/${tool.id}`}
```

Then the card is:

```js
{
  id: "reinvest-harvest",
  href: "/reinvest-harvest",
  ...
}
```

Why this rather than the alternatives:

- **Relying on the redirect** would make every Hub link take an extra hop and publish a non-canonical URL. Redirects exist for links already in the wild, not for links you're creating today.
- **Moving the route to `/tools/`** would be the tail wagging the dog. This is a funnel with its own path, not another entry in a tools directory.
- **A hard-coded exception** solves it once and breaks the next time.

⚠️ Apply the same `||` fallback to the deep-dive variant you found using `/tools/${dd.id}`, so both paths behave the same. Do not change any existing card's behaviour — every current card omits `href` and must resolve exactly as it does today.

Card content is in `REPLIT-4` §1. **Duration is 12 min, not 7** — the landing page says 7 minutes for the quiz; the Hub figure covers reading the report too.

---

## 3 · VERCEL — YOU ANSWERED THE QUESTION THAT MATTERED

> No successful build appeared in the latest 50 commits queried. The oldest queried commit was June 5, 2026, and it also failed.

**That settles it: the failure predates this work entirely and is not caused by anything you built.** That was the thing worth knowing, and the read-only investigation was the right way to get it.

The remaining items need authenticated Vercel access, which you correctly did not attempt. They're being handled outside this workspace. **Do not investigate Vercel further, and change nothing there.**

Same for the Git credential — reported, understood, leave it. The GitHub API path works.

---

## 4 · NOW RUN THE QA

`REPLIT-4` §2 through §6, in full.

⚠️ §2b holds the seven checks deferred from Prompt 1. This is the first time a real submission will move through Blob, Sheets, ActiveCampaign and Resend. Use an inbox you can actually read.

⚠️ The `RESEND_API_KEY` check is destructive. Do it **last**, on a throwaway submission, and restore the key immediately. If you cannot restore it safely, skip it and report rather than leaving the key broken.

⛔ Still do not create the `Authority` or `Track Intent` fields, and do not build the ActiveCampaign automation.

---

## REPORT BACK

```
HUB CARD
  href fallback applied to both variants?  Y/N
  existing cards unaffected?  Y/N
  card link resolves to /reinvest-harvest?  Y/N

Then the full REPLIT-4 report block: end-to-end run, §2b deferred checks,
data integrity, failure paths, cross-surface.

  RESEND_API_KEY restored?  Y/N
  commit SHA:
  Vercel production result:
```
