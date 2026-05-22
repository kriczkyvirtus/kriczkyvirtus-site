import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import ResourcesHub from './ResourcesHub.jsx'
import WMBW from './tools/WMBW.jsx'
import BIB from './tools/BIB.jsx'
import HumanCapital from './tools/HumanCapital.jsx'
import CustomerCapital from './tools/CustomerCapital.jsx'
import StructuralCapital from './tools/StructuralCapital.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/tools" element={<ResourcesHub />} />
        <Route path="/tools/wmbw" element={<WMBW />} />
        <Route path="/tools/bib" element={<BIB />} />
        <Route path="/tools/human-capital" element={<HumanCapital />} />
        <Route path="/tools/customer-capital" element={<CustomerCapital />} />
        <Route path="/tools/structural-capital" element={<StructuralCapital />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
