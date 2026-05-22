# Replit Deployment Prompt — Kriczky Virtus Homepage

Paste the following into Replit Agent:

---

Create a Vite + React project that serves a single-page website. Here are the exact requirements:

## Project Setup

1. Create a new Vite + React project (JavaScript, NOT TypeScript)
2. Install only these dependencies: `react`, `react-dom`, `vite`, `@vitejs/plugin-react`
3. No additional UI libraries, no Tailwind, no CSS modules — all styling is inline JSX

## File Structure

```
/
├── index.html
├── vite.config.js
├── package.json
├── src/
│   ├── main.jsx
│   ├── App.jsx          ← This is the ONLY component file
│   └── index.css        ← Minimal global styles
└── public/
    └── (empty for now)
```

## Critical Instructions

### App.jsx
- I will provide the COMPLETE `App.jsx` file content — it is a single self-contained React component file (~3,300 lines)
- **DO NOT modify, refactor, split, or "improve" this file in any way**
- **DO NOT extract components into separate files**
- **DO NOT add TypeScript types**
- **DO NOT change any inline styles**
- **DO NOT add any CSS framework**
- The file uses `export default` for the main App component
- It imports only `{ useState, useEffect, useRef, useCallback }` from "react"
- All components are defined in this single file — this is intentional

### index.html
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Kriczky Virtus — Build Enterprise Value</title>
    <meta name="description" content="Kriczky Virtus helps $500K–$10M business owners grow profits, build enterprise value, and create a business that runs without them." />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,700&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 64 64'%3E%3Cpath d='M32 8L14 16V30C14 42 22 52 32 56C42 52 50 42 50 30V16L32 8Z' fill='none' stroke='%23C8A24E' stroke-width='3' stroke-linejoin='round'/%3E%3Cpath d='M32 12L18 18.5V30C18 40.5 24.5 49 32 52C39.5 49 46 40.5 46 30V18.5L32 12Z' fill='rgba(200,162,78,0.15)'/%3E%3C/svg%3E" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

### main.jsx
```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

### index.css
```css
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
}

body {
  background: #0A0E14;
  color: #E8ECF1;
  font-family: 'DM Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
}

input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  cursor: pointer;
  width: 100%;
}

input[type="range"]::-webkit-slider-track {
  height: 6px;
  border-radius: 3px;
  background: rgba(255,255,255,0.08);
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2.5px solid white;
  cursor: pointer;
  margin-top: -7px;
}

input[type="range"]::-moz-range-track {
  height: 6px;
  border-radius: 3px;
  background: rgba(255,255,255,0.08);
}

input[type="range"]::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2.5px solid white;
  cursor: pointer;
}
```

### vite.config.js
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
})
```

## Deployment

After creating the project:
1. Run `npm install`
2. Run `npm run dev` to verify it works
3. The site should display a dark navy/gold themed website for Kriczky Virtus

## What NOT to do

- DO NOT split App.jsx into multiple files
- DO NOT add any CSS framework (Tailwind, styled-components, etc.)
- DO NOT add any routing library (React Router, etc.)
- DO NOT modify any component code, styles, or logic
- DO NOT add ESLint, Prettier, or any linting configuration
- DO NOT add any analytics or tracking scripts
- DO NOT add any server-side rendering
- The file I provide is the FINAL production code — treat it as read-only

---

After Replit creates the project structure, replace the contents of `src/App.jsx` with the complete file I will provide.
