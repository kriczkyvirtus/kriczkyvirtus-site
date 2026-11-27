import { useState, useEffect } from "react";
import PageTexture from "./PageTexture.jsx";
import { C, T, CARD, CREAM_CSS, FONTS, Logo, HaloButton } from "./CreamKit.jsx";

/* Unsubscribe - /unsubscribe?email=…
   Cream (27 Nov 2026): the engraved ground, a white card, the dark halo button.
   Wording and the /api/unsubscribe call unchanged. */

const H = { fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: "clamp(30px,6vw,38px)", lineHeight: 1.1, color: C.ink1, margin: "0 0 12px", letterSpacing: "-.01em" };
const P = { fontSize: 15, color: C.ink2, lineHeight: 1.6, margin: "0 0 8px" };
const EMAIL = { fontSize: 13.5, color: C.ink3, margin: "0 0 26px", wordBreak: "break-all" };

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
    <div style={{ background: C.page, minHeight: "100vh", fontFamily: "'DM Sans',sans-serif", color: C.ink1, position: "relative", isolation: "isolate",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
      <link href={FONTS} rel="stylesheet" />
      <style>{CREAM_CSS}</style>
      <PageTexture />

      <div style={{ ...CARD, maxWidth: 480, width: "100%", textAlign: "center", padding: "clamp(36px,7vw,48px) clamp(22px,6vw,36px)" }}>
        <Logo style={{ marginBottom: 32 }} />

        {status === "pending" && (
          <>
            <h1 style={H}>Unsubscribe</h1>
            <p style={P}>Are you sure you want to unsubscribe?</p>
            {email ? <p style={EMAIL}>{email}</p> : <div style={{ height: 18 }} />}
            <HaloButton onClick={handleUnsubscribe} arrow={false} size={15}>Confirm Unsubscribe</HaloButton>
            <p style={{ fontSize: 12.5, color: C.ink3, marginTop: 22, lineHeight: 1.5 }}>
              Changed your mind?{" "}
              <a href="https://www.kriczkyvirtus.com" style={{ color: T.gold.ink, fontWeight: 600, textDecoration: "none" }}>
                Go back to the site
              </a>
            </p>
          </>
        )}

        {status === "loading" && <p style={{ ...P, margin: 0 }}>Processing...</p>}

        {status === "success" && (
          <>
            <span className="tile" style={{ width: 58, height: 58, borderRadius: 16, marginBottom: 18, borderColor: `${T.green.fill}66`,
              boxShadow: `inset 0 1px 0 rgba(255,255,255,.9), 0 10px 22px rgba(10,14,20,.12), 0 0 22px ${T.green.fill}40` }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M4 12.5L9.5 18L20 6.5" stroke={T.green.ink} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
            <h1 style={H}>You've Been Unsubscribed</h1>
            <p style={P}>You won't receive any more emails from us.</p>
            {email ? <p style={EMAIL}>{email}</p> : <div style={{ height: 18 }} />}
            <a href="https://www.kriczkyvirtus.com" className="pbtn"
              style={{ display: "inline-flex", padding: "13px 28px", borderRadius: 999, fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
              Back to Kriczky Virtus
            </a>
          </>
        )}

        {status === "error" && (
          <>
            <h1 style={H}>Something Went Wrong</h1>
            <p style={{ ...P, margin: "0 0 24px" }}>
              We couldn't process your request. Please try again or email us directly at{" "}
              <a href="mailto:ekriczky@kriczkyvirtus.com" style={{ color: T.gold.ink, fontWeight: 600, textDecoration: "none" }}>
                ekriczky@kriczkyvirtus.com
              </a>{" "}
              to be removed.
            </p>
            <button onClick={() => setStatus("pending")} className="pbtn"
              style={{ padding: "13px 28px", borderRadius: 999, fontSize: 14, fontWeight: 600, fontFamily: "'DM Sans',sans-serif" }}>
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  );
}
