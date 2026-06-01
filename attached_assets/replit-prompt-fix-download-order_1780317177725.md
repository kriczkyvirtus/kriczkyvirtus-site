# Replit Agent Prompt — Fix Roadmap Open/Download Order

## Problem
When the user submits their name and email, the roadmap tries to open in a new tab first but the auto-download fires immediately after and interrupts the new tab from opening.

## Fix
In the assessment component, find the code that handles the roadmap URL after the API response. Update the logic so that:

1. **First:** trigger the download (create a temporary `<a>` element with `download` attribute, click it)
2. **Then:** after a short delay, open the roadmap in a new tab

Replace whatever the current roadmap open/download logic is with:

```javascript
if (responseData.roadmapUrl) {
  setRoadmapUrl(responseData.roadmapUrl);
  
  // Step 1: Trigger download first
  const downloadLink = document.createElement('a');
  downloadLink.href = responseData.roadmapUrl;
  downloadLink.download = 'Constraint-Roadmap.html';
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  
  // Step 2: Open in new tab after a short delay
  setTimeout(() => {
    window.open(responseData.roadmapUrl, '_blank');
  }, 500);
}
```

Also, if the "View Your Personalized Roadmap" button has an `onClick` handler that does `window.open()` or triggers a download, keep that as-is — that's for manual clicks after the initial auto-open. The code above is for the automatic behavior right after submission.

## Critical Instructions
- Only change the roadmap URL handling logic after the API response.
- Do NOT change any other submission logic, scoring, or UI.
- The 500ms delay gives the browser time to process the download before opening the new tab.
