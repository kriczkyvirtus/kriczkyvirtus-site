import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import ReinvestHarvestThankYou from "./ReinvestHarvestThankYou.jsx";
import ReinvestHarvestReport from "./ReinvestHarvestReport.jsx";

function useReport(token) {
  const [state, setState] = useState({ loading: Boolean(token), report: null });

  useEffect(() => {
    let active = true;
    if (!token) {
      setState({ loading: false, report: null });
      return undefined;
    }

    setState({ loading: true, report: null });
    fetch(`/api/reinvest-harvest-report?token=${encodeURIComponent(token)}`)
      .then(async response => {
        if (!response.ok) return null;
        return response.json();
      })
      .then(report => {
        if (active) setState({ loading: false, report });
      })
      .catch(() => {
        if (active) setState({ loading: false, report: null });
      });

    return () => {
      active = false;
    };
  }, [token]);

  return state;
}

const Loading = () => (
  <main style={{ minHeight: "100vh", background: "#0A0E14", color: "#E8ECF1", display: "grid", placeItems: "center", fontFamily: "DM Sans, sans-serif" }}>
    Loading…
  </main>
);

export function ReinvestHarvestThankYouRoute() {
  const token = new URLSearchParams(useLocation().search).get("t");
  const { loading, report } = useReport(token);
  if (loading) return <Loading />;

  return (
    <ReinvestHarvestThankYou
      key={token || "unresolved"}
      email={report?.email}
      quadrantKey={report?.quadrantKey}
      revenueBand={report?.revenueBand}
      ownerTier={report?.ownerTier}
      resolved={Boolean(token && report)}
    />
  );
}

export function ReinvestHarvestReportRoute() {
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

  return (
    <ReinvestHarvestReport
      key={token}
      name={report.firstName}
      email={report.email}
      scores={report.scores}
      guess={report.guess}
      revenueBand={report.revenueBand}
      ownerTier={report.ownerTier}
      token={token}
      shareUrl={`${window.location.origin}/r/${token}`}
    />
  );
}