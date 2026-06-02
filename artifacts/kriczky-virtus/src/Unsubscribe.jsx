import React, { useState, useEffect } from "react";

const C = {
  gold: "#C8A24E",
  cyan: "#22D3EE",
  bgDeep: "#0A0E14",
  bgCard: "#111720",
  text1: "#E8ECF1",
  text2: "#8B95A5",
  text3: "#5A6474",
  border1: "rgba(255,255,255,0.06)",
  border2: "rgba(255,255,255,0.10)",
};

export default function Unsubscribe() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("pending"); // pending | loading | success | error

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const e = params.get("email");
    if (e) setEmail(decodeURIComponent(e));
  }, []);

  const handleUnsubscribe = async () => {
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error("[Unsubscribe] Failed:", err);
      setStatus("error");
    }
  };

  return (
    <div style={{
      background: C.bgDeep, minHeight: "100vh",
      fontFamily: "'DM Sans', sans-serif", color: C.text1,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20,
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      <div style={{
        maxWidth: 480, width: "100%", textAlign: "center",
        background: C.bgCard,
        border: `1px solid ${C.border2}`,
        borderRadius: 18, padding: "48px 32px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
      }}>
        {/* Logo */}
        <div style={{
          fontFamily: "'Cormorant Garamond', serif", fontSize: 18,
          color: C.text1, letterSpacing: 1.5, textTransform: "uppercase",
          marginBottom: 32,
        }}>
          KRICZKY <span style={{ color: C.gold }}>VIRTUS</span>
        </div>

        {status === "pending" && (
          <>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif", fontSize: 28,
              fontWeight: 400, color: C.text1, margin: "0 0 12px",
            }}>
              Unsubscribe
            </h1>
            <p style={{ fontSize: 14, color: C.text2, lineHeight: 1.6, margin: "0 0 8px" }}>
              Are you sure you want to unsubscribe?
            </p>
            {email && (
              <p style={{ fontSize: 13, color: C.text3, margin: "0 0 28px" }}>
                {email}
              </p>
            )}
            <button onClick={handleUnsubscribe}
              style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                padding: "14px 36px", borderRadius: 12, border: `1.5px solid ${C.gold}50`,
                color: C.gold, fontWeight: 700, fontSize: 14, letterSpacing: "0.02em",
                background: `linear-gradient(135deg, ${C.gold}15, ${C.gold}08)`,
                fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
                transition: "all 0.3s ease",
              }}>
              Confirm Unsubscribe
            </button>
            <p style={{ fontSize: 11, color: C.text3, marginTop: 20, lineHeight: 1.5 }}>
              Changed your mind?{" "}
              <a href="https://www.kriczkyvirtus.com" style={{ color: C.cyan, textDecoration: "none" }}>
                Go back to the site
              </a>
            </p>
          </>
        )}

        {status === "loading" && (
          <p style={{ fontSize: 15, color: C.text2 }}>Processing...</p>
        )}

        {status === "success" && (
          <>
            <div style={{ fontSize: 40, marginBottom: 16 }}>✓</div>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif", fontSize: 28,
              fontWeight: 400, color: C.text1, margin: "0 0 12px",
            }}>
              You've Been Unsubscribed
            </h1>
            <p style={{ fontSize: 14, color: C.text2, lineHeight: 1.6, margin: "0 0 8px" }}>
              You won't receive any more emails from us.
            </p>
            {email && (
              <p style={{ fontSize: 13, color: C.text3, margin: "0 0 24px" }}>
                {email}
              </p>
            )}
            <a href="https://www.kriczkyvirtus.com"
              style={{
                display: "inline-flex", padding: "12px 28px", borderRadius: 10,
                border: `1px solid ${C.border2}`, color: C.text2, fontSize: 13,
                textDecoration: "none", fontFamily: "'DM Sans', sans-serif",
              }}>
              Back to Kriczky Virtus
            </a>
          </>
        )}

        {status === "error" && (
          <>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif", fontSize: 28,
              fontWeight: 400, color: C.text1, margin: "0 0 12px",
            }}>
              Something Went Wrong
            </h1>
            <p style={{ fontSize: 14, color: C.text2, lineHeight: 1.6, margin: "0 0 24px" }}>
              We couldn't process your request. Please try again or email us directly at{" "}
              <a href="mailto:ekriczky@kriczkyvirtus.com" style={{ color: C.gold, textDecoration: "none" }}>
                ekriczky@kriczkyvirtus.com
              </a>{" "}
              to be removed.
            </p>
            <button onClick={() => setStatus("pending")}
              style={{
                padding: "12px 28px", borderRadius: 10, border: `1px solid ${C.border2}`,
                color: C.text2, fontSize: 13, cursor: "pointer",
                background: "transparent", fontFamily: "'DM Sans', sans-serif",
              }}>
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  );
}
