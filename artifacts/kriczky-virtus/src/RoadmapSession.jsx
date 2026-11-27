import CreamBooking from "./CreamBooking.jsx";
import { T } from "./CreamKit.jsx";
import { BIO } from "./bookingBio.jsx";

// ═══════════════════════════════════════════════════════════════════
// ROADMAP SESSION - Booking Page
// URL: /roadmap-session
//
// Purpose: Landing page for the "Book a Constraint Working Session"
// CTA from personalized Constraint Roadmaps. Embeds the iClosed
// scheduler inline for direct booking.
//
// Cream (27 Nov 2026): shared layout in CreamBooking.jsx. Copy unchanged.
// ═══════════════════════════════════════════════════════════════════

export default function RoadmapSession() {
  return (
    <CreamBooking
      tone={T.gold}
      pill="Free Working Session · 60–90 Minutes"
      title={<>Start Making <em>Progress</em> From Your Roadmap</>}
      lede="You bring your numbers. We will walk through exactly how to start executing the moves in your Constraint Roadmap - adapted to your specific business. You leave with clarity on how you can make progress today."
      note="We only take 2 of these calls per week currently to protect call quality and personalization."
      iclosed={{ src: "https://app.iclosed.io/e/kriczkyvirtus/constraint-roadmap-free-working-session", title: "Constraint Roadmap Free Working Session" }}
      listLabel="What we'll cover"
      items={[
        { icon: "/icons/reinvest-harvest/c3.png",
          title: "Walk through your Constraint Roadmap results together",
          desc: "We'll review your scores, your #1 constraint, and the three moves - and I'll show you how to apply them to your specific situation." },
        { icon: "/icons/reinvest-harvest/c2.png",
          title: "Identify your Profit Gap and Value Gap",
          desc: "You'll have the opportunity to go deeper and see the difference between what your business earns today and what it could earn - and the impact that has on your valuation. (this is also free - leave your credit card at home)" },
        { icon: "/icons/reinvest-harvest/c1.png",
          title: "Leave with a plan you can actually run",
          desc: "Not theory - a concrete, prioritized action plan adapted to your revenue, your constraint, and your business. Whether we work together after or not." },
      ]}
      bio={BIO}
    />
  );
}
