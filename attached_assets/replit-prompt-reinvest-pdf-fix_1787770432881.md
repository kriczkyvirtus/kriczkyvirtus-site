# Replit Prompt — Move Reinvest or Harvest PDF to the Blob upload pattern

## The problem

Reinvest or Harvest submissions are reaching Google Sheets and ActiveCampaign, but **no PDF is being stored in Blob**. The lead lands, the row writes, the PDF silently disappears.

### Root cause

The component sends the PDF as `pdfBase64` inside the `/api/lead-capture` request body. That payload is almost certainly exceeding Vercel's serverless request body limit (~4.5MB).

Why it's so large — in `reinvest-or-harvest-scorecard.jsx` around line 962:

```js
while (pos < imgH) {
  if (pos > 0) pdf.addPage();
  pdf.addImage(imgData, "JPEG", 0, -pos, imgW, imgH);
  pos += 297;
}
```

Every page calls `addImage` with the **full-height image** at a different offset, and no alias is passed. jsPDF embeds a separate copy of the image per page rather than referencing one. A 14-page result therefore contains roughly 14 copies of a full-length JPEG, then gets base64-encoded — which inflates it a further ~33%.

### Why the failure is invisible

Around line 533 the retry path strips the PDF:

```js
var retryPayload = JSON.parse(JSON.stringify(payload));
retryPayload.pdfBase64 = null;
```

So the oversized first request fails, the retry succeeds without the PDF, and the user sees success. No error surfaces anywhere.

---

## What to change

Move this tool onto the **same `store-results` Blob pattern the other six diagnostics already use**: the client uploads the PDF to Blob directly and sends back a URL. No large payload, no body-size ceiling.

The byte-lock on `reinvest-or-harvest-scorecard.jsx` is **lifted for this task**. It existed to guarantee faithful initial deployment; that's done. Make the minimum edits described below and nothing else.

### 1. Confirm the existing pattern first

Before writing anything, read how one of the existing diagnostics (Cash Flow Fortress, Owner Dependency Scorecard, or What's My Business Worth) handles its PDF end to end:

- Which endpoint the client uploads to
- What it sends and what it receives back
- Which payload key carries the resulting URL to `/api/lead-capture`
- How that URL reaches the Sheets `Link` column and the results email

**Report what you find before changing anything.** Match that pattern exactly. Do not invent a new one.

### 2. Fix the jsPDF image duplication

Regardless of transport, this bug should not ship. Pass an alias so jsPDF reuses a single image object across pages:

```js
pdf.addImage(imgData, "JPEG", 0, -pos, imgW, imgH, "results", "FAST");
```

The 7th argument is the alias, the 8th is compression. This alone should reduce the PDF substantially.

### 3. Replace the payload transport

In `EmailGate` (around lines 526–541):

- Generate the PDF as it does now
- **Upload it to Blob** via the same endpoint the other tools use, receiving a URL
- Send that **URL** in the `/api/lead-capture` payload, using the same key the other tools use
- **Remove `pdfBase64` from the payload entirely**

### 4. Fix the silent retry

The retry must no longer discard the result. Since the payload now carries a short URL rather than megabytes of base64, there's no reason to strip anything.

- Remove the `retryPayload.pdfBase64 = null` line
- If the Blob upload itself fails, `console.error` it explicitly and continue with the submission — a lead without a PDF is acceptable, a lead lost entirely is not
- Never let a PDF failure block contact creation

### 5. Server side

Revert `api/lead-capture` to the standard path for this tool:

- Stop accepting and storing `pdfBase64` server-side
- Take the Blob URL from the payload like every other tool
- The Sheets `Link` column and the results email use that URL

Do not change the ActiveCampaign branch. Tags 7, 67, 38/12, tier tags, position tags 68–71, and fields 2 and 11 all stay exactly as they are. Tags 39 and 40 and field 5 remain forbidden.

---

## Verification

Submit a **full-length** test — complete all ten dimensions so the PDF is at maximum size.

- [ ] Browser Network tab: the `/api/lead-capture` request is small (kilobytes, not megabytes)
- [ ] The first request succeeds — no failed attempt followed by a retry
- [ ] A PDF appears in Blob storage
- [ ] The Sheets `Link` column contains a working URL
- [ ] Opening that URL renders the complete multi-page result
- [ ] **Report the PDF's file size in bytes**
- [ ] The results email contains the same working link
- [ ] ActiveCampaign contact still receives tags 7, 67, source, tier, and position
- [ ] Fields 2 and 11 still populate
- [ ] Tags 39 and 40 absent; field 5 not written

Also confirm the browser console is clean — no PDF generation errors, no failed requests.

---

## Constraints

- Change only `reinvest-or-harvest-scorecard.jsx` and the `cohort-waitlist`-adjacent path in `api/lead-capture` that handles this tool
- Do NOT change PDF handling for any other tool
- Do NOT change the ActiveCampaign branch
- Do NOT change Google Sheets column structure or write ranges
- Do NOT add dependencies
- Report the exact diff for the component
