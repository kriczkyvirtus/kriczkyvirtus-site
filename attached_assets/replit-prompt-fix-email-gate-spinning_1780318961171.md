# Replit Agent Prompt — Fix Email Gate Spinning on Diagnostic Tools (CRITICAL)

## Problem
When a user enters their name and email on any of the 5 diagnostic tools (WMBW, BIB, Structural/Customer/Human Capital Deep Dives), the form shows a spinning loader forever and never shows the results. The user is stuck.

## Root Cause
The email submission handler is either:
- Waiting for an old API call or PDF generation that fails silently
- Not setting the "submitted" or "unlocked" state after the API call
- The handler has a `try/catch` or `await` that never resolves

## Fix
For EACH of the 5 diagnostic tools, find the email submission handler (the function that fires when the user clicks submit after entering name/email). The fix is simple: **make sure the handler ALWAYS sets the submitted/unlocked state, regardless of whether the API call succeeds or fails.**

The pattern should be:

```javascript
const handleEmailSubmit = async () => {
  // Show loading state
  setLoading(true);  // or whatever the loading state variable is
  
  // Fire the API call in the background — do NOT await it or block on it
  fetch("/api/lead-capture", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: name.trim(),
      email: email.trim(),
      tool: "TOOL_NAME",
      summary: { /* scores/results */ },
      timestamp: new Date().toISOString(),
    }),
  }).catch(err => console.error("[Lead] Fetch failed:", err));
  
  // IMMEDIATELY proceed to show results — don't wait for API
  setEmailSubmitted(true);  // or setUnlocked(true), setGated(false), etc.
  setLoading(false);
};
```

**The key insight:** The `fetch()` call is NOT awaited. It fires in the background. The very next lines set the submitted state and hide the loading spinner. The user sees their results immediately. If the API call fails, the user never knows — they still get their results.

### How to identify the right state variables
Each tool will have slightly different state variable names. Look for:
- `emailSubmitted` / `setEmailSubmitted`
- `unlocked` / `setUnlocked` 
- `gated` / `setGated`
- `showResults` / `setShowResults`
- `loading` / `setLoading`
- `submitting` / `setSubmitting`

Whatever the tool uses to control "show the spinner" and "show the results", make sure:
1. The spinner state is set to false
2. The results/unlocked state is set to true
3. These happen UNCONDITIONALLY — not inside a `.then()` or after an `await`

### Also remove any old broken logic
If the handler has old code that:
- Calls a non-existent API endpoint (anything other than `/api/lead-capture`)
- Tries to generate a PDF and waits for it
- Has an `await` on something that never resolves

Remove or replace that code. The ONLY API call should be the non-blocking `fetch("/api/lead-capture", ...)` shown above.

## Apply to ALL 5 tools:
1. What's My Business Worth (WMBW)
2. Business Independence Blueprint (BIB)
3. Structural Capital Deep Dive
4. Customer Capital Deep Dive
5. Human Capital Deep Dive

## Test
After implementing, go to each tool, enter a name and email, click submit. The spinner should appear briefly then immediately show the results. No more infinite spinning.

## Critical Instructions
- The API call MUST be non-blocking (no `await` on the fetch)
- The submitted/unlocked state MUST be set regardless of API success/failure
- Do NOT change any scoring logic, questions, or result display
- Do NOT remove any existing result display logic — only fix the submission handler
