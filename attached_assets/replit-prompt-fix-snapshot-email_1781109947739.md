# Replit Agent Prompt — Fix Valuation Questionnaire User Email (4 Changes)

All changes are in `lib/email.js`, inside the custom email template for `valuation-questionnaire`.

## Fix 1: Decrease CTA button font size

Find the "Schedule Your Snapshot Review" button link:
```html
<a href="..." style="color: #C8A24E; font-size: 14px; font-weight: 700; ...">
```

Change `font-size: 14px` to `font-size: 12px`.

## Fix 2: Fix bullet point text alignment

The dashes and text are not aligned — when text wraps to a second line it goes under the dash instead of staying indented. Replace the entire bullet section with a table layout that keeps text aligned:

```html
<table cellpadding="0" cellspacing="0" style="margin: 0 0 20px 0;">
  <tr>
    <td style="padding: 3px 10px 3px 0; font-size: 14px; color: #C8A24E; vertical-align: top; line-height: 1.65;">&ndash;</td>
    <td style="padding: 3px 0; font-size: 14px; color: #8B95A5; line-height: 1.65;">How much profit you're likely leaving on the table each year vs peers your size</td>
  </tr>
  <tr>
    <td style="padding: 3px 10px 3px 0; font-size: 14px; color: #C8A24E; vertical-align: top; line-height: 1.65;">&ndash;</td>
    <td style="padding: 3px 0; font-size: 14px; color: #8B95A5; line-height: 1.65;">What buyers are actually paying for businesses in your industry</td>
  </tr>
  <tr>
    <td style="padding: 3px 10px 3px 0; font-size: 14px; color: #C8A24E; vertical-align: top; line-height: 1.65;">&ndash;</td>
    <td style="padding: 3px 0; font-size: 14px; color: #8B95A5; line-height: 1.65;">The &ldquo;valuation gap&rdquo; between where you are and where you could reasonably be</td>
  </tr>
</table>
```

The key is using a 2-column table: column 1 is the dash (fixed width, `vertical-align: top`), column 2 is the text. This keeps wrapped text indented past the dash.

## Fix 3: Replace "30-minute Zoom" with "30-minute video call"

Find:
```
pick a 30-minute Zoom time
```

Replace with:
```
pick a 30-minute video call time
```

## Fix 4: Replace "We've got your data." with "We received your answers."

Find:
```
Thanks for filling out the 14-question Snapshot. We've got your data.
```

Replace with:
```
Thanks for filling out the 14-question Snapshot. We received your answers.
```

## Critical Instructions
- All 4 changes are in the custom email template for `valuation-questionnaire` in `lib/email.js`
- Do NOT change any other email templates
- Do NOT change any other files
