import CreamBooking from "./CreamBooking.jsx";
import { T } from "./CreamKit.jsx";
import { BIO } from "./bookingBio.jsx";

// ═══════════════════════════════════════════════════════════════════
// PARTNER QUALIFY - Booking Page
// URL: /partner-qualify
//
// Purpose: Landing page for the "See If You Qualify" CTA from the
// Clarity Partner and Growth Partner cards in the Pricing section.
// Embeds the iClosed scheduler inline.
//
// Cream (27 Nov 2026): shared layout in CreamBooking.jsx. Copy unchanged.
// ═══════════════════════════════════════════════════════════════════

export default function PartnerQualify() {
  return (
    <CreamBooking
      tone={T.gold}
      pill="Everything Starts With Quantifying How Much Money You Are Leaving on the Table"
      title={<>You Shouldn't Have to Guess<br /><em>What Moves The Needle</em> for Your Business</>}
      lede={"Most owners know the gaps exist - they just don't have someone in their corner to help systematically close them. This call is to see if having the Kriczky Virtus team as a \"partner\" in your corner is the right fit for where your business is today and where you want it to go."}
      iclosed={{ src: "https://app.iclosed.io/e/kriczkyvirtus/partner-tier-fit-call", title: "Partner Tier Fit Call" }}
      listLabel="What a partnership looks like"
      items={[
        { icon: "/icons/roadmap-system/get-gold.png",
          title: "This isn't consulting - it's help proactively executing",
          desc: "You get our team in your corner led by a dedicated advisor who knows your numbers, your constraints, and your goals. We work together helping you execute on the constraint for the business, not just talk about it." },
        { icon: "/icons/reinvest-harvest/c1.png",
          title: "Monthly reviews, quarterly execution through 90-day sprints, bi-annual strategy half-days",
          desc: "Regular cadence of reviewing your numbers, prioritizing 1–3 decisions, assigning a 90-day action plan, and helping you execute on your core constraint at any given time - all prioritized by ROI potential." },
        { icon: "/icons/roadmap-system/why.png",
          title: "Guaranteed valuation growth",
          desc: "Our partner tiers come with conditional valuation growth guarantees backed by continued hands-on execution at no additional cost for a period of time. Conditions apply - discussed prior to working together." },
        { icon: "/icons/roadmap-system/shield.png",
          title: "Full advisor team coordination",
          desc: "Your CPA, attorney, wealth advisor, M&A professionals, etc. - all rowing in the same direction. We coordinate so you can focus on running the business without worrying about conflicting advice or things falling through the cracks." },
      ]}
      bio={BIO}
    />
  );
}
