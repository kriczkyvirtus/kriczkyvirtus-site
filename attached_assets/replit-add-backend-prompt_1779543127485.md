# Replit Prompt — Add Lead Capture Backend + PDF Generation

Paste this into Replit Agent:

---

## 1. Install dependencies for PDF generation

Run:
```
npm install html2canvas jspdf
```

## 2. Create the Vercel serverless function

Create a folder called `api/` in the project root (NOT inside `src/`).
Create a file at `api/lead-capture.js`.

I will provide the complete file contents — **DO NOT modify it**.

## 3. Install serverless function dependencies

The serverless function needs its own dependencies. Create a `api/package.json`:

```json
{
  "dependencies": {
    "googleapis": "^130.0.0",
    "google-auth-library": "^9.0.0"
  }
}
```

Then run:
```
cd api && npm install && cd ..
```

## 4. Create vercel.json (if it doesn't already exist)

Create `vercel.json` in the project root:

```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" },
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "functions": {
    "api/lead-capture.js": {
      "memory": 1024,
      "maxDuration": 30
    }
  }
}
```

## 5. Environment Variables

These will be set in Vercel's dashboard (not in the codebase):
- `ACTIVECAMPAIGN_URL`
- `ACTIVECAMPAIGN_KEY`
- `RESEND_API_KEY`
- `GOOGLE_SHEETS_ID`
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `GOOGLE_PRIVATE_KEY`

For local testing, you can create a `.env` file (add it to .gitignore):
```
ACTIVECAMPAIGN_URL=https://kriczkyvirtus.activehosted.com
ACTIVECAMPAIGN_KEY=your_key_here
RESEND_API_KEY=your_key_here
GOOGLE_SHEETS_ID=your_sheet_id_here
GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
```

## DO NOT
- DO NOT modify any existing files in src/
- DO NOT modify App.jsx, ResourcesHub.jsx, or any tool files
- DO NOT add any middleware or authentication
- DO NOT change the vite config

---

After Replit creates the structure, I will provide the `api/lead-capture.js` contents.
