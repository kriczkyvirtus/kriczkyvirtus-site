# Replit Agent Prompt — Add Testimonial to All Landing Pages

## Overview
Add a testimonial section directly below the iClosed scheduler (and above the "What we'll cover" / "What you'll walk away with" / "What's included" cards) on ALL landing pages.

## The Testimonial

Add this JSX block to each landing page, positioned between the scheduler container and the cards section:

```jsx
{/* ─── TESTIMONIAL ─────────────────────────────── */}
<div style={{
  marginBottom: mob ? 40 : 56,
  padding: mob ? "24px 20px" : "28px 32px",
  background: "linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015) 50%, rgba(255,255,255,0.025))",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 16,
  position: "relative",
}}>
  {/* Quote mark */}
  <div style={{
    position: "absolute",
    top: mob ? 16 : 20,
    left: mob ? 16 : 24,
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 48,
    color: "#C8A24E",
    opacity: 0.3,
    lineHeight: 1,
    userSelect: "none",
  }}>
    "
  </div>
  
  {/* Quote text */}
  <p style={{
    fontSize: mob ? 13 : 14,
    lineHeight: 1.65,
    color: "#8B95A5",
    margin: "0 0 16px",
    paddingLeft: mob ? 28 : 36,
    fontStyle: "italic",
  }}>
    Within 9 months of working with Edward we have implemented two core improvements in our business and both our{" "}
    <span style={{ color: "#E8ECF1", fontWeight: 600, textDecoration: "underline", textDecorationColor: "#C8A24E", textUnderlineOffset: "3px" }}>
      revenue and profit are on track now to be up ~50% compared to last year.
    </span>{" "}
    He also helped us see that we still have a{" "}
    <span style={{ color: "#E8ECF1", fontWeight: 700 }}>
      Profit Gap of $300K per year we are leaving on the table
    </span>{" "}
    that we are actively working to close so we can attract and retain better talent.
  </p>

  {/* Attribution + pills */}
  <div style={{
    display: "flex",
    flexDirection: mob ? "column" : "row",
    alignItems: mob ? "flex-start" : "center",
    gap: mob ? 10 : 16,
    paddingLeft: mob ? 28 : 36,
  }}>
    <span style={{ fontSize: 12, color: "#5A6474" }}>
      Phil C. · $3.0M Revenue · Home Services
    </span>
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      <span style={{
        padding: "4px 12px",
        borderRadius: 100,
        background: "rgba(200,162,78,0.10)",
        border: "1px solid rgba(200,162,78,0.25)",
        fontSize: 11,
        fontWeight: 600,
        color: "#C8A24E",
      }}>
        Profit Gap: $300K/yr
      </span>
      <span style={{
        padding: "4px 12px",
        borderRadius: 100,
        background: "rgba(34,211,238,0.08)",
        border: "1px solid rgba(34,211,238,0.20)",
        fontSize: 11,
        fontWeight: 600,
        color: "#22D3EE",
      }}>
        Value Gap: $779K
      </span>
    </div>
  </div>
</div>
```

## Where to Place It

In EACH of these landing page components, find the scheduler section (the `div` containing the iClosed `<iframe>`) and place the testimonial block directly AFTER the scheduler's closing `</div>` and BEFORE the cards section ("What we'll cover", "What you'll walk away with", "What's included", or "What a partnership looks like"):

1. **RoadmapSession.jsx** — after scheduler, before "What we'll cover"
2. **BookIntensive.jsx** — after scheduler, before "What's included in the Intensive"
3. **PartnerQualify.jsx** — after scheduler, before "What a partnership looks like"
4. **FreeWorkingSession.jsx** — after scheduler, before "What you'll walk away with"
5. **EngageGiveaway2026.jsx** — after scheduler, before "What you'll walk away with"
6. **AcqVantageBonus.jsx** — after scheduler, before "What you'll walk away with"

## Important Notes
- The `mob` variable from `useBp()` is already available in all 6 components — use it for the responsive conditionals
- The testimonial uses the same glassmorphic card style as the rest of the site
- The quote mark is a decorative `"` positioned absolutely in the top-left
- The "revenue and profit" line has a gold underline; the "Profit Gap" line is bold white
- The attribution line and pills stack vertically on mobile, side by side on desktop
- The pills match the site's gold (Profit Gap) and cyan (Value Gap) accent colors

## Critical Instructions
- Add the EXACT same testimonial to ALL 6 landing pages
- Do NOT change any other content, styling, or functionality on any page
- The testimonial goes between the scheduler and the cards — nowhere else
- Do NOT modify the scheduler or the cards sections
