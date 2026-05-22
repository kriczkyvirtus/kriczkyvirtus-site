# Replit Prompt — Add Resources Hub Page with Routing

Paste this into Replit Agent:

---

I need to add a second page to the site (a Resources Hub at `/tools`). Here's what to do:

## 1. Install React Router
Run: `npm install react-router-dom`

## 2. Update src/main.jsx
Replace the contents of `src/main.jsx` with:

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import ResourcesHub from './ResourcesHub.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/tools" element={<ResourcesHub />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
```

## 3. Add a catch-all redirect for client-side routing
Create a file called `public/_redirects` with this single line:
```
/*    /index.html   200
```

Also create `vercel.json` in the project root with:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

This ensures that when someone navigates directly to `/tools` (or refreshes while on that page), the server serves the SPA and React Router handles the route.

## 4. Create src/ResourcesHub.jsx
I will provide the complete ResourcesHub.jsx file — it is a single self-contained React component file (~1,400 lines). **DO NOT modify, refactor, split, or "improve" this file in any way.**

## 5. DO NOT modify src/App.jsx
The homepage file stays exactly as it is. Do not touch it.

## What to verify
After making these changes:
- The homepage at `/` should look exactly the same as before
- Clicking "Resources" in the nav bar should navigate to `/tools` and show the Resources Hub page
- Navigating directly to `/tools` (or refreshing on that page) should work correctly
- The "← Back to Home" or logo link on the Resources Hub should navigate back to `/`

---

After Replit creates the routing setup, I will provide the ResourcesHub.jsx file to paste into `src/ResourcesHub.jsx`.
