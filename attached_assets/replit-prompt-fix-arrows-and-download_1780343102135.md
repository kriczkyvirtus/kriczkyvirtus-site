# Replit Agent Prompt — Fix Email Arrows + Mobile Download Behavior

## Two issues to fix:

### Fix 1: Remove arrows from email CTA buttons

In `lib/email.js`, the email HTML template still has `→` arrows after the button text. Find these two lines in the HTML template:

```
${details.buttonText} →
```
and
```
${details.ctaButtonText} →
```

Remove the ` →` from both. They should just be:
```
${details.buttonText}
```
and
```
${details.ctaButtonText}
```

Search the entire `lib/email.js` file for `→` and remove every instance.

### Fix 2: HTML files downloading instead of opening on mobile

The blob files need `contentDisposition: "inline"` so browsers display them instead of downloading them. Check BOTH of these files:

**In `api/lead-capture.js`**, find the `put()` call for roadmap generation. Make sure it includes `contentDisposition`:

```javascript
const blob = await put(`roadmaps/${nameSlug}-${id}.html`, fullHTML, {
  access: "public",
  contentType: "text/html; charset=utf-8",
  addRandomSuffix: false,
  contentDisposition: "inline",
});
```

**In `api/store-results.js`**, find the `put()` call for HTML storage. Make sure it includes `contentDisposition`:

```javascript
const blob = await put(`results/${tool}/${nameSlug}-${id}.html`, html, {
  access: "public",
  contentType: "text/html; charset=utf-8",
  addRandomSuffix: false,
  contentDisposition: "inline",
});
```

If `contentDisposition: "inline"` is missing from either `put()` call, add it. If it's already there and files are still downloading, the issue may be that older blob files were uploaded before this setting was added — those files keep their old settings. Only newly uploaded files will have the inline behavior.

**Important note about Vercel Blob:** If `contentDisposition` is not a supported option in the version of `@vercel/blob` being used, try this alternative approach instead — add a `cacheControlMaxAge` and set custom headers:

```javascript
const blob = await put(`roadmaps/${nameSlug}-${id}.html`, fullHTML, {
  access: "public",
  contentType: "text/html; charset=utf-8",
  addRandomSuffix: false,
  httpHeaders: {
    "Content-Disposition": "inline",
  },
});
```

Check the `@vercel/blob` package version and documentation if neither approach works.

## Critical Instructions
- Search `lib/email.js` for ALL instances of `→` and remove them
- Add `contentDisposition: "inline"` (or `httpHeaders`) to BOTH `put()` calls
- Do NOT change any other logic
- Test by going through a tool on a mobile device — the results should open in the browser, not download
