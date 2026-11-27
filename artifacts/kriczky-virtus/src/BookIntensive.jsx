import CreamBooking from "./CreamBooking.jsx";
import { T } from "./CreamKit.jsx";
import { BIO } from "./bookingBio.jsx";

// ═══════════════════════════════════════════════════════════════════
// BOOK INTENSIVE - Booking Page
// URL: /book-intensive
//
// Purpose: Landing page for the "Book Your Intensive" CTA from the
// Pricing section. Embeds the iClosed scheduler inline.
//
// Cream (27 Nov 2026): shared layout in CreamBooking.jsx, green accent as
// before. Copy unchanged.
// ═══════════════════════════════════════════════════════════════════

export default function BookIntensive() {
  return (
    <CreamBooking
      tone={T.green}
      pill="Free Fit Call · See If the Intensive Makes Sense for Your Business"
      title={<>How Much Money Are You<br /><em>Leaving on the Table</em>?</>}
      lede={<>Worst case: we show that your business is as efficient as it could be right now and we give you a full refund. Best case: we identify <span style={{ color: T.gold.ink, fontWeight: 600 }}>over $100K in actionable opportunities</span> you can start working on immediately, prioritized by ROI potential.</>}
      badge="Valuation Opportunity Guarantee - if we don't find $100K+, you pay nothing."
      iclosed={{ src: "https://app.iclosed.io/e/kriczkyvirtus/valuation-driver-intensive-fit-call", title: "Valuation Driver Intensive - Fit Call" }}
      listLabel="What's included in the Intensive"
      items={[
        { icon: "/icons/reinvest-harvest/c2.png",
          title: "Business Valuation Estimate",
          desc: "Your current value baseline through the eyes of a third-party buyer, based on the premier data provider for M&A transactions in the US - even if you never plan to sell." },
        { icon: "/icons/roadmap-system/why.png",
          title: "5 Key Value Drivers scored and benchmarked",
          desc: "Scored against industry peers to show exactly where risks and opportunities live in your business." },
        { icon: "/icons/reinvest-harvest/c3.png",
          title: "Profit Gap + Value Gap analysis",
          desc: "The dollar amount you're leaving on the table each year and the difference between your business's value vs an above-average peer in your industry, with a clear path to close it." },
        { icon: "/icons/reinvest-harvest/c4.png",
          title: "Scenario modeling",
          desc: "What happens to your valuation if you close the Profit Gap and Value Gap simultaneously - that is your cash flow and net-worth opportunity." },
        { icon: "/icons/reinvest-harvest/c1.png",
          title: "Dollar-ranked value acceleration plan + 90-day action plan",
          desc: "Specific actions prioritized by impact with three moves you can start executing immediately, plus a 30-day follow-up check-in to revisit progress and adjust." },
      ]}
      bio={BIO}
    />
  );
}
