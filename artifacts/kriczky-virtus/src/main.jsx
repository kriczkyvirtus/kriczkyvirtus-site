import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import App from './App.jsx'
import ResourcesHub from './ResourcesHub.jsx'
import WMBW from './tools/WMBW.jsx'
import BIB from './tools/BIB.jsx'
import HumanCapital from './tools/HumanCapital.jsx'
import CustomerCapital from './tools/CustomerCapital.jsx'
import StructuralCapital from './tools/StructuralCapital.jsx'
import ConstraintRoadmap from './tools/ConstraintRoadmap.jsx'
import RoadmapSession from './RoadmapSession.jsx'
import BookIntensive from './BookIntensive.jsx'
import PartnerQualify from './PartnerQualify.jsx'
import FreeWorkingSession from './FreeWorkingSession.jsx'
import Unsubscribe from './Unsubscribe.jsx'
import EngageGiveaway2026 from './EngageGiveaway2026.jsx'
import AcqVantageBonus from './AcqVantageBonus.jsx'
import './index.css'

const TITLES = {
  '/tools/wmbw':              "What's My Business Worth?",
  '/tools/bib':               'Business Independence Blueprint',
  '/tools/human-capital':     'Attracting Top Employees',
  '/tools/customer-capital':  'Getting More Valuable Customers',
  '/tools/structural-capital':'Systems to Run Your Business Without You',
  '/constraint-roadmap':      'Constraint Roadmap',
}

const DEFAULT_TITLE = 'Build Businesses Worth Owning - Kriczky Virtus'

function TitleManager() {
  const { pathname } = useLocation()
  useEffect(() => {
    document.title = TITLES[pathname] ?? DEFAULT_TITLE
  }, [pathname])
  return null
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <TitleManager />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/tools" element={<ResourcesHub />} />
        <Route path="/tools/wmbw" element={<WMBW />} />
        <Route path="/tools/bib" element={<BIB />} />
        <Route path="/tools/human-capital" element={<HumanCapital />} />
        <Route path="/tools/customer-capital" element={<CustomerCapital />} />
        <Route path="/tools/structural-capital" element={<StructuralCapital />} />
        <Route path="/constraint-roadmap" element={<ConstraintRoadmap />} />
        <Route path="/roadmap-session" element={<RoadmapSession />} />
        <Route path="/book-intensive" element={<BookIntensive />} />
        <Route path="/partner-qualify" element={<PartnerQualify />} />
        <Route path="/free-session" element={<FreeWorkingSession />} />
        <Route path="/unsubscribe" element={<Unsubscribe />} />
        <Route path="/engage-giveaway-2026" element={<EngageGiveaway2026 />} />
        <Route path="/acq-vantage-bonus" element={<AcqVantageBonus />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
