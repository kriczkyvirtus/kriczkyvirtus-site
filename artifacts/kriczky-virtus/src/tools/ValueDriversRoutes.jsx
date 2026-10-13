import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import ValueDriversFlow from "./ValueDriversFlow.jsx";
import ValueDriversNext from "./ValueDriversNext.jsx";
import WMBW from "./WMBW.jsx";

/* Routes for the Value Drivers flow (the replacement for the long /tools/wmbw page).
     /tools/wmbw                       → flow, website door
     /tools/wmbw/next?t=               → book a call
     /tools/wmbw/r/:token              → full report (the WMBW document, pre-filled)
     /workshop-rh/value-drivers        → flow, workshop door (?e=&n= skips contact)
     /workshop-rh/value-drivers/next?t= → workshop VSL + workbook scores */

function useReport(token) {
  const [state, setState] = useState({ loading: Boolean(token), report: null });
  useEffect(() => {
    let active = true;
    if (!token) { setState({ loading: false, report: null }); return undefined; }
    setState({ loading: true, report: null });
    fetch(`/api/value-drivers-report?token=${encodeURIComponent(token)}`)
      .then(r => (r.ok ? r.json() : null))
      .then(report => { if (active) setState({ loading: false, report }); })
      .catch(() => { if (active) setState({ loading: false, report: null }); });
    return () => { active = false; };
  }, [token]);
  return state;
}

const Loading = () => (
  <main style={{ minHeight: "100vh", background: "#0A0E14", color: "#E8ECF1", display: "grid", placeItems: "center", fontFamily: "DM Sans, sans-serif" }}>
    Loading…
  </main>
);

export const ValueDriversSiteFlow = () => <ValueDriversFlow door="site" />;
export const ValueDriversWorkshopFlow = () => <ValueDriversFlow door="workshop" />;

function NextRoute({ door }) {
  const token = new URLSearchParams(useLocation().search).get("t");
  const { loading, report } = useReport(token);
  if (loading) return <Loading />;
  return <ValueDriversNext key={token || "unresolved"} door={door} report={report} token={report ? token : null} />;
}
export const ValueDriversSiteNext = () => <NextRoute door="site" />;
export const ValueDriversWorkshopNext = () => <NextRoute door="workshop" />;

export function ValueDriversReportRoute() {
  const { token } = useParams();
  const { loading, report } = useReport(token);
  if (loading) return <Loading />;
  if (!report) {
    return (
      <main style={{ minHeight: "100vh", background: "#0A0E14", color: "#E8ECF1", display: "grid", placeItems: "center", textAlign: "center", fontFamily: "DM Sans, sans-serif" }}>
        <div><h1>404</h1><p>Report not found.</p></div>
      </main>
    );
  }
  return <WMBW key={token} initialScores={report.scores} initialChecks={report.checks || null} />;
}
