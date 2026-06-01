const React = require("react");
const {
  CONSTRAINTS,
  STRATEGIC_INTENSIVE_COPY,
  resolveConstraint,
  getRevenueTier
} = require("./constraints-final.cjs.js");

// ═══════════════════════════════════════════════════════════════════
// CONSTRAINT ROADMAP — PDF TEMPLATE V6
//
// Changes from v5:
//
// SERVICE ALIGNMENT
//   - "Strategic Intensive" → "Valuation Driver Intensive" throughout
//   - Pricing updated: $2,997 → $5,000 one-time
//   - Guarantee updated: $10K/90 days → $100K actionable opportunities
//   - Deliverable updated: DCF valuation, Q-Score, Profit/Value Gap,
//     scenario modeling, 90-day action plan
//   - PageCommunity removed (community not launched)
//   - "qualified" branching removed — all leads get VDI pitch
//   - Edward's credential updated: "Edward Kriczky, CEPA"
//   - CTA links updated to kriczkyvirtus.com/call
//   - COMMUNITY_COPY import removed
//   - Page numbering adjusted (16 pages → 15 pages)
//
// Total pages: 15
// ═══════════════════════════════════════════════════════════════════

const C = {
  gold: "#C8A24E",
  goldLight: "#D4B665",
  goldMuted: "#A68A42",
  goldDark: "#8A6F30",
  goldDeep: "#5C4A20",
  green: "#34D399",
  red: "#F87171",
  amber: "#FBBF24",
  blue: "#60A5FA",
  cyan: "#22D3EE",
  bgDeep: "#0A0E14",
  bgCard: "#111720",
  bgElev: "#1A2130",
  bgAccent: "#151B26",
  text1: "#E8ECF1",
  text2: "#8B95A5",
  text3: "#5A6474",
  text4: "#3D4654",
  border1: "rgba(255,255,255,0.08)",
  border2: "rgba(255,255,255,0.14)",
  paper: "#0E131C",
  // Tier metals
  bronze: "#A87545",
  silver: "#A8B0BC",
  champagne: "#E6D7A8"
};
const HEADSHOT = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCADIAMgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD06nCkpRQAtLSCnCgApaBS0AFLQKUUAFQXuoWem25uL25it4R1eVtorkPH3xEsvBtn5MOy51WQfu4M8IP7z+3t3r5x1fXtV1+7a61K9muJGPG9shfYDoKAPpyf4l+DbdGZ9ftWC9RHuc/gAOawG+OPhJXdQmosF6MIBhvp8386+cgPU0BNx+U0AfTGifGPwprFx5Ek02nyE4U3ihUb/gQJA/HFdZB4l0G6kEcGtadI5wAq3SZOfbNfHRRh2pvSgD7aor5m8IfFrXfDtxBDfTSajpiDYYJCN6L6o55yPQ8V9G6TqlrrWk22pWUm+2uEDoe/0PuOhoAuUUUtACUuKKKACiiigAooooAKKKKAKdOFIKWgBaWkpaAFpaSloAWszxFrCeH/AA5f6rIARbQl1U/xN0UfiSK064b4w/8AJNNQGSMywDjv+8FAHzhqep3utajNf38zTTzMWZj79gOw9qq8DtSbip74Haun8P8AgbVfEcRntxHHFu2gucZ+lAHNh0AIYfjSKV4GMV2l78KfE1sSILJrn/ajIwfzNVbf4ceJWbE2k3S84wE/XNAHNRrujIVSWHpSSwyoAXQ4PHSvefBfw6jsbZn1KyQSN2cZIq/rfw50u/bdCzWj9tqggfhQB84MrL94EfWvUfgn4ourLxMugSSbrK/DFUYn5JFUkFfTIBB/D0qDxF8Mp7BDMk4eJejDlm9OOgrjdLkuPD3iWwvTuVra5STg4OAwyPyoA+waKQMGAZfunkfSloAKKKKAFooooAKTFLRQAlFLRQBTpaSloAUU4U0U4UAKKUUgpRQAV578aphH8PXj7y3cSj8Mn+lehVwfxjtzP8Obt1GTBPFL+G7H9aAPHNC8KDWNKIWUQ7mBdtu5jjPA9K9X8K2S6PZW9rHlljXBY9/euT8KJ5OmQMOsg3H8a7mweMYJcAj3oA6QTEqM09ZOMZquk0RUYdT+NIZUB+8KANBZT0zUEqlj1PWqF3r+l6dF5t1eRoM4655rJbxtpdycWcnntnGF60AaOrwpcWbxEDp+teGeLdO+z3UgK4LDnPrXtI1CK7UMm4HurDBrhPHtmklzaFF+eXr7kH/69AHrXhW4+1eENHnznfZxZOc/wgf0rYrlvA80Vn4b03R5p1N7BbjenPHJOAe+AQK6igBaUUlFAC0UUUAFFFFABRRRQBTpabThQAtKKSloAcKKQUtAC1x3xKuIH8KT6O/NzqSmOAZA+ZcN3+nSuxri/H1mtw+lzOuVikbacdGOMfpn8qAPMtDlnTw7a4ysqqUOeowSP6VQvdQgmL24a+nnH3jA4RRzjk46V0+m28Eks0QA8syOQM+rGty38NRKN0IhQMOuzn9KAPNdMm1218i4SKb7NPJsUNISd2M4I45r1/QfMvrAvcNhlGGFZs2mRWUOXk8zb0UcKKvaAzi1mKj5WNAHGeKfD+oT30a2zbbeWTBcYOwdyRVbSNI8TWdxNBaXcJgjPynYoD/pnr354r0qKWKQGKQKf9lqsQWVoT8kKA0AYWlW2oCPderF5vcxnINV9U003Wq6ZcMheO0d3dR1bAyBjvyK6udViXAAGaoQyFNQQiMy9SVHfigCqipdatpGrWsWZnkC78YYKR8yn9K76uU0WyMWppGoG2N3nfA4UkYAFdXQAUUUUALRRRQAUUUUAFFFFAFKlFNFOFADhS00U4UALS0lLQAtZmv6c2qaPNbxnEwxJEfR15H+H41p0UAeNSxmwuEl2lPOy5XsDnkCuitdYhWzySMgetW/G2gww6c2o23mApKDJHnKgNwSB25xXCxRPeJLbxyFXYceuO+KALWoa1JdzPK+/wCyRZ4UZJ/CpdE8f6bFEI2hk27sqSpGaz0uVst8dzbTQxxtsBERYEeoxVmKz0u6VZUsL5ifmV0ixmgDYi10arfGKPTblUcE+bxsT+tX4p7rT7obWLwNjr1WqdtcTRxqI9IuCvQEyKCfwzWhDFfTXcfmWfl2rKd5MoYqe3AoA0WnecbieKdY2s9xeH7MU3xrkhyQCOmMioJZESYIrDCjmtjw1Hu+03GOCQgPr3P9KANWxtWto2MhUyPjO3oAO1W6KKACiiigBaKSigBaSiigAooooApUopopRQA8UopopwoAcKWminCgBaKBRQBDdWsV7ZzWs67opkKOPY14re2VzoWtvZzkrPEcpJjh17MPY/417hXn/je3tNbuV+zyhprQtbu6chJBhthPrhuR2oAyIblb6MCQYJ4PtV+20YHKpcyqM5wDxXJQ3ctjP5dwu1h19D7iut0rWbeUAM+Gxgj1oA3LPSoLZQwDu/YsxNS3L+ShwAD0qE6rbRJ/rFOPese51R76fyrUFmPHFADpWaSZYIeZGPT+prudHhFvpUMY7ZJPqcnmuc0jS/sUbTSfPO/3mNaV14itdBu9EsNRUwx6kjLDcE/KJQeEb0yCMH1oA6CijpRQAUUUUAFFFGaACikzRQAUUUUAURSimilFADxThTBTgaAHilpooZ1jRndlVFGWZjgAepPagB9LXnviH4weGtFLw2kj6pcrxttuIwfeQ8fkDXm+qfGzxRfMy2S2mnRHp5Ue9x/wJs/oBQB6X8SviHD4UsH0+wlV9amXCgc/Z1P8be/oPx6dZfh3oa3Xw0sY5XPn3G6681uTvZicn14wDXzZNNNd3DzTyvLNIxZ3dssxPUknqa+rfhhIs/w90N16C2CH6qSP6UAchqmlKZ5ba8h2XEfVT6f3ge4PrXPSeHJpZD9juSjdga921Tw/Z63brHcqyumTFNHw8Z9j6eoPBrgdR8NX+i3QEwDKTiO4QYR/b/ZPsfwJoA5jTvB2oF1a+vCsfop5Ndrp2n2llGEgQDHc9T9aZAZpUAlG3HFbmjaRNqOHBMdsDzL3b2X/AB6fWgCXS7Nr+42gHyU/1jdh7fU1y/xy0+K58CPcFQGs7iJ4/YE7CPyP6V6rDbRWtusMCBI16Af5615d8dblYPADQ55uLuJAPXGWP8qAOc+HnxXtLy0g0jxDcCC+jAjiu5DhJx0G4/wt2yeD9a9XzXxga7Lw38UvEvhqGG0SaO9sYxtW3ulztX0Vh8w/UUAfTuaK878P/GPw5q+yK/MmlXB7T/NET7OOn4gV6BFNHPCk0MiSROMq6MGVh7EcGgCSikzRmgBaKSigAooooAzwacKYDWbrfiPSfDlkbrVLxIUzhU+87n0VRyTQBrg1nax4h0jw9b+dquoQWq4yFdvnb6KOT+VeK+KvjLqeos1toCtp9r0MzYMz/j0T8OfevNZZprqdp7iWSWVjlnkYsxPuTQB7TrXx1t4y0eh6U0x6Ce7bav12Lz+ZFeZ+IfGniDxQxGp37tBnIt4/kiH/AAEdfqc1ggUUANxgU8IAvvTWBanLuGAxzQA5B81fSnwNuWuPAKxFs/Z7qVB7Andj9a+bI+D+FfRPwvs9R8L6HemOy86C/wDKubYM+FBKck98Hj8qAPXJry2sLKS6vJ4re3jXc8srBVUe5NeTeKfj1okTPYaNYHU1b5XnnG2H8F+836Vh+N/DnizxXeob++/0Qfdt1+WNPovc+5ya8o8U+E7/AMK30UF0d1tMC0M4HDDuD7j0+lAHrI+MXhKIW7PpepTucefFHtSMH/ZyxJHtmvXPCnjnw74stwNHvE81F+a0kXy5Yx/uHt7jIr4zEgiH7tcH+83X8K9H8E/DvVdQ0y31+1uXivpWLWirkFFBxvLds849vrQB9UN0rwj9oW9wdE0/PaW4I/JR/WvTNDl8U6Vp0UeuJFqhUczW5Cyj6g4DfpXhvxtuJ7zxn9pkSRYBEsFvvGOFGW/8eagDy1l5qNgSp9RzVgjioWJyFC5Pv0oAcgyAfWtvRPE2teHX3aVqU9sDyYwcxt9VPB/KsZF2qB3qRTQB6tpHxv1KEqmr6bb3Kd5LcmJ/yOQf0r0zw9450DxLFmyvVjnH3re4IjkH4E4P1BNfLwpaAPsMHIyDkeo6UV8oaR4i1fQ7gT6bqFxbsOoV8q31U8H8RXrnhT4w2t6UtPEMaWk54F1GD5Tf7w6r9eR9KAPU6Kr2t7a30PnWdzDcRZxvhkDjPpkUUAYPiPVTofhrUdTUAvbQM6A9C/Rf1Ir5Wu7m4vruS6upXmnlYvJI5yWJ6mvoX4s3Bh+Hl6oODNLFH+G7P/stfOvYGgAAp4FJTu1ABRSiloART8oNApF7iloAUfeFfWPgmf7X4E0GQjB+wxDH0GP6V8mg/MK+nfhVdi6+HOknPMIkgP8AwFz/AEIoA668thJFnuK4D4kadYXPgLU2v2CfZkE0EmMlZcgKPxzt/GvSTzDXj/xk8Sx6dog0CEq11qGGlH9yINn8ywwPoaAPFtFsV1fXNP0+SVYY7m4SJ5GbAUMwBNfaGm20FnDHbW0SxQxKI0RRgKoGAPyFfEkbPG6vGxSRGDKR1BHSvsrwdrS+I/D2n6suM3UCu4HZ+jD/AL6BoA6GZgkTMfSvmT4zXXm+JLKDP+rt2kP/AAJzj9Fr6P1qXyrB8dcYr5c+K0ok8dzL/wA87aFT/wB85/rQBxRpvfmnZpOtAAWwQPWnDg1GOZCfQYp9ADs0ZpuaM4oAfkUjPjA7k4pmeaYWzMPYZoA9N+C+rvbeMLnTS5EN7bM23PG9OQfrjcKK5n4bzGL4kaGynG642H6FWH9aKAPRPjZctH4UsYB0mvAT9FQ/414X/BXuPxtjVvC+nSFgGS9wB65Q5/kK8OH3SKAFFPqNTT6AF6U7tTKUGgA6MD60ppGGR70oORQA3vXvHwQ1UN4b1DT2bm3uxIP911H9VNeDnrXonwg1P7J4pns2bC3lsQvu6HcP03UAfRct1HDaNLI4VAMkmvkfxRrM/iTxJfatITiWQ+Uv92McKB+AFe7+ONba28NXio+GED9PUjA/nXz2qDaAOooAiX51z/EOvvX0h8Ar5pvBk1uzZ+zXjovsGCt/MmvnBlKncte8/AOYDRNWA73sZx77KAPWPEcmLUL6mvlTx7c/avHesyA5Cz+UP+AqF/pX1D4ikBmiQngHJ+lfId/cm81G7uzyZ53l5/2mJoAr/WkyBkntS9KY/QD1NADkJC/qaC1Jmmk0AODZpc8UwGjNACk4pqH5nJ+lNZqapxGfc0AdT8PEMvxE0ED/AJ+1b8gT/SisrwvrQ8P+KNN1VlLJbTq7gdSvRsfgTRQB6J8b9QBfSNOVhlRJO6/XCr/Jq8jXrXRePdYOt+M9RuQxMSSeRF/uJ8o/PBP41zooAB1p9R96kHSgBaBSUooAWheDiimtwQaAHEVr+Frw6f4p0m6DbRHdx7j/ALJYA/oTWQelAJHIOD2+tAHsXxIkMNvf27HAMYUf99ivJVYhsHqP1r0L4kaomo6XpN8h5v7OOU4/vZG79Qa85VvMHXDCgCc4JyPxr234EjZpl8vZr0H8ox/jXhyv379xXufwQ+XSLp+xum/9AWgDvPG14LPTNSuyceRZyuPrtOP1xXyeMhVHoAK+jPi5fiDwXfkNzcFLcf8AAmGf0Br5zzk0ALTOsh9BxTi2ATUanAoAcTTSaQtSZoAXNKTxTM+4o3ZoARjgUE4UCmMcnFPNADDRSGigB0hLSuWOSWJP50gpM5JNFACHrUi9KjPWnKaAH0UUlADxSMMigUtADVORSik6N9aXvQBoX+ptd6PpdoxObMSxj/dLbh/M1mhyDkdaGXJFNwaAJt2fmH5V7T8HLox6DcDPW5bH/fK14irYP869W+FNzttGgB+9cMf0WgDS+Nd+4s9HsQcLI8k7D12gKP8A0I148Grvfi/qIu/GCWqtlbK1SMj/AGmy5/mK8/BxQArtzikJNNByc0fUUAISc8mkPPY07NJnJoATBpRwKKQnigBo5ennrUa/ep9ACGijNFACMpVmU9QcUUUUAIaVaKKAH5ozRRQAopaKKAEIyKAeKKKAEb7tPwJY9y/6xRyPUUUUAQ16B8L7jbqqRFsKZCT+QoooA5fxFqR1bxFqN+TkXFw7r/u5wv6AVlk8YoooAOgpCaKKAG5ozRRQAtIx4oooAaOtPNFFADaKKKAP/9k=";
const CATEGORY_COLOR = {
  profitability: C.gold,
  cash_flow: C.green,
  owner_dependency: C.amber,
  revenue_quality: C.gold,
  operational_efficiency: C.amber,
  scalability: C.cyan
};
const CATEGORY_ORDER = [{
  id: "profitability",
  label: "Profitability & Margins"
}, {
  id: "cash_flow",
  label: "Cash Flow"
}, {
  id: "revenue_quality",
  label: "Revenue Quality"
}, {
  id: "owner_dependency",
  label: "Owner Dependency"
}, {
  id: "operational_efficiency",
  label: "Operational Efficiency"
}, {
  id: "scalability",
  label: "Scalability"
}];
const TIER_LABELS = {
  survival: {
    tier: "SURVIVAL",
    range: "Under $500K",
    metal: C.bronze
  },
  stabilize: {
    tier: "STABILIZE",
    range: "$500K – $1M",
    metal: C.silver
  },
  growth: {
    tier: "GROWTH",
    range: "$1M – $3M",
    metal: C.gold
  },
  optimize: {
    tier: "OPTIMIZE",
    range: "$3M – $10M",
    metal: C.champagne
  },
  scaling: {
    tier: "SCALING",
    range: "$10M+",
    metal: "#E8ECF1"
  }
};
const REVENUE_LABELS = {
  under_500k: "Under $500K",
  "500k_1m": "$500K – $1M",
  "1m_3m": "$1M – $3M",
  "3m_10m": "$3M – $10M",
  over_10m: "$10M+"
};
const isQualified = rev => ["750k_1m", "1m_3m", "3m_10m", "over_10m"].includes(rev);

// Pull-quote lines per constraint. In production these belong in
// constraints.js as a `pullQuote` field; hardcoded here for prototype.
const PULL_QUOTES = {
  profitability: {
    default: "Revenue without margin is just expensive activity.",
    growth: "Low margins at this stage compared to your competitors suppresses the ability for your business to be an asset that runs without you.",
    optimize: "Low margins at this stage compared to your competitors suppresses the ability for your business to be an asset that runs without you.",
    scaling: "Low margins at this stage compared to your competitors suppresses the ability for your business to be an asset that runs without you."
  },
  cash_flow: {
    default: "Cash is oxygen. You can be profitable and still suffocate.",
    survival: "You are not unprofitable. You just get paid too slow.",
    growth: "Slow cash flow at this stage not only makes the potential for growth slower, it might make it unlikely that growth ever comes.",
    optimize: "The businesses that compound don't generate more cash — they redeploy it faster, smarter, and with a framework that turns every dollar into a decision.",
    scaling: "The businesses that compound don't generate more cash — they redeploy it faster, smarter, and with a framework that turns every dollar into a decision."
  },
  owner_dependency: {
    default: "The business does not own you.\nYou own a job that calls itself a business.",
    growth: "A business built around you is a job with employees.\nA business built to run without you is an asset that can scale and compound.",
    optimize: "The businesses that break through don't have better owners.\nThey have department leads who own their functions.",
    scaling: "The businesses that break through don't have better owners.\nThey have department leads who own their functions."
  },
  revenue_quality: {
    default: "Losing one customer should be inconvenient — not existential.",
    optimize: "The businesses that compound don't just acquire customers — they keep them longer, expand them faster, and make every relationship worth more over time.",
    scaling: "The businesses that compound don't just acquire customers — they keep them longer, expand them faster, and make every relationship worth more over time."
  },
  operational_efficiency: {
    default: "Effort is not the same as throughput.",
    growth: "Operational inefficiency at this stage doesn't just cost you money — it costs you the margin you need to grow and the discipline to protect it.",
    optimize: "Operational inefficiency at this stage doesn't just cost you money — it costs you the margin you need to scale and command a premium valuation.",
    scaling: "Operational inefficiency at this stage doesn't just cost you money — it costs you the margin you need to scale and command a premium valuation."
  },
  scalability: {
    default: "The business that got you here can't get you there. The engine has to change.",
    optimize: "You can't outgrow a weak foundation. The businesses that break through build five things before they scale: leaders, recurring revenue, margin discipline, capital frameworks, and institutional relationships.",
    scaling: "You can't outgrow a weak foundation. The businesses that break through build five things before they scale: leaders, recurring revenue, margin discipline, capital frameworks, and institutional relationships."
  }
};
const CONSEQUENCE_QUOTES = {
  profitability: {
    default: "In 18 months, you'll have grown the top line and shrunk what's left at the bottom.",
    growth: "Your Profit Gap is what you leave on the table each year. Your Value Gap is what it costs you at exit. Both are growing.",
    optimize: "Your Profit Gap is what you leave on the table each year. Your Value Gap is what it costs you at exit. Both are growing.",
    scaling: "Your Profit Gap is what you leave on the table each year. Your Value Gap is what it costs you at exit. Both are growing."
  },
  cash_flow: {
    default: "Six months from now, the cash question won't be theoretical anymore.",
    growth: "Tight cash flow at this stage suppresses growth, and profit potential, in the business (and ultimately your exit potential and net-worth).",
    optimize: "Tight cash flow at this stage suppresses growth, and profit potential, in the business (and ultimately your exit potential and net-worth).",
    scaling: "Tight cash flow at this stage suppresses growth, and profit potential, in the business (and ultimately your exit potential and net-worth)."
  },
  owner_dependency: {
    default: "If you stopped working tomorrow, the business stops with you.",
    growth: "Growing revenue without fixing owner dependency makes the business riskier, not more valuable.",
    optimize: "Without department leads who own core functions, every growth initiative routes back to you — and the business caps at your personal capacity.",
    scaling: "Without department leads who own core functions, every growth initiative routes back to you — and the business caps at your personal capacity."
  },
  revenue_quality: {
    default: "When the dominant account leaves, you have more than a problem.",
    optimize: "Every churned customer costs 5-7x what retention would have. Every project that doesn't convert to recurring is revenue you have to replace from scratch.",
    scaling: "Every churned customer costs 5-7x what retention would have. Every project that doesn't convert to recurring is revenue you have to replace from scratch."
  },
  operational_efficiency: {
    default: "More hours into the same system prevents you from the chance to grow profits.",
    growth: "Without operational discipline, every dollar of revenue growth leaks margin — and margin is what funds your future.",
    optimize: "Revenue grows. Margins compress. The business becomes more fragile. And nobody on the team is accountable for stopping it.",
    scaling: "Revenue grows. Margins compress. The business becomes more fragile. And nobody on the team is accountable for stopping it."
  },
  scalability: {
    default: "Growth without infrastructure scales your problems, not your profits. It's just getting bigger while getting worse.",
    optimize: "Scaling without the foundations in place doesn't make the business more valuable. It makes it bigger, more fragile, and harder to fix.",
    scaling: "Scaling without the foundations in place doesn't make the business more valuable. It makes it bigger, more fragile, and harder to fix."
  }
};

// v4: scannable 3-5 word titles for each root cause, one per constraint.
// The locked copy has 3 paragraphs per constraint; these titles sit above
// each paragraph so the reader can skim the page in 10 seconds.
const ROOT_CAUSE_TITLES = {
  profitability: ["You're pricing below your true cost", "Your costs grew without you noticing", "Growth is eating your margin"],
  cash_flow: ["Customers are funding their business with your cash", "Cash is locked up in things you don't need", "Growth is coming out of the same account as rent"],
  owner_dependency: ["You're the decision-maker for too many decisions", "Customers ask for you, not the business", "Your team can't run it without you"],
  revenue_quality: ["Too much revenue from one customer", "You don't know which customers are profitable", "One-time work, not repeat work"],
  operational_efficiency: ["Adding people didn't add output", "Nobody owns the cost structure", "You're solving the same problem every month"],
  scalability: ["Your processes were built for a smaller business", "Your team can't operate at the next level", "Your infrastructure can't handle more complexity"]
};
const GLOSSARY = [{
  term: "Constraint",
  def: "The single bottleneck that, if unfixed, prevents progress on every other initiative."
}, {
  term: "Revenue tier",
  def: "Where your business sits in the lifecycle — Survival, Stabilizing, Scaling, or Optimizing. Same constraint reads differently at each tier."
}, {
  term: "Owner dependency",
  def: "The percentage of revenue, decisions, or relationships that route through the founder. High dependency caps enterprise value."
}, {
  term: "Customer concentration",
  def: "The share of revenue coming from your top 1-3 customers. Above 25% from a single customer is a structural risk."
}, {
  term: "Cash conversion cycle",
  def: "The number of days between paying for inputs and collecting from customers. Long cycles starve growth even at strong profitability."
}, {
  term: "Scalability",
  def: "Whether the business can grow revenue without proportional increases in cost, complexity, or owner involvement. The infrastructure test."
}, {
  term: "Bull / base / bear",
  def: "Three forecast scenarios — best case, expected case, downside case. Used to size opportunity gaps and risk."
}, {
  term: "Enterprise value (EV)",
  def: "What a buyer would pay for the business today. The destination metric every constraint either lifts or suppresses."
}];

// ─── PRIMITIVES ────────────────────────────────────────────────────

const Page = ({
  children,
  bg = C.paper,
  style
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    width: "8.5in",
    height: "11in",
    background: bg,
    color: C.text1,
    fontFamily: "'DM Sans', sans-serif",
    position: "relative",
    pageBreakAfter: "always",
    breakAfter: "page",
    overflow: "hidden",
    boxSizing: "border-box",
    hyphens: "none",
    WebkitHyphens: "none",
    ...style
  }
}, children);
const PageChrome = ({
  constraintName,
  recipientName,
  pageNum,
  totalPages,
  accentColor = C.gold
}) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
  style: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    padding: "0.4in 0.6in 0.18in",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    fontSize: 9,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    color: C.text3,
    fontWeight: 500
  }
}, /*#__PURE__*/React.createElement("div", null, "The Constraint Roadmap", constraintName ? /*#__PURE__*/React.createElement(React.Fragment, null, " \xB7 ", /*#__PURE__*/React.createElement("span", {
  style: {
    color: accentColor,
    fontWeight: 600
  }
}, constraintName)) : null), /*#__PURE__*/React.createElement("div", null, recipientName ? `For ${recipientName}` : "Personalized Diagnostic")), /*#__PURE__*/React.createElement("div", {
  style: {
    position: "absolute",
    top: "0.7in",
    left: "0.6in",
    right: "0.6in",
    height: 0.5,
    background: `linear-gradient(90deg, transparent, ${accentColor}50, transparent)`
  }
}), /*#__PURE__*/React.createElement("div", {
  style: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: "0 0.6in 0.4in",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    color: C.text3
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 10,
    letterSpacing: "0.16em",
    textTransform: "uppercase"
  }
}, /*#__PURE__*/React.createElement("span", {
  style: {
    color: C.gold,
    fontWeight: 700
  }
}, "Kriczky"), " ", /*#__PURE__*/React.createElement("span", {
  style: {
    color: C.text3
  }
}, "Virtus")), /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 13,
    color: C.text2,
    letterSpacing: "0.02em"
  }
}, pageNum, totalPages ? /*#__PURE__*/React.createElement("span", {
  style: {
    color: C.text4
  }
}, " / ", totalPages) : "")));
const Eyebrow = ({
  color = C.gold,
  children,
  style
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    fontSize: 9,
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color,
    fontWeight: 600,
    marginBottom: 12,
    ...style
  }
}, children);
const H = ({
  size = 32,
  color = C.text1,
  children,
  style
}) => /*#__PURE__*/React.createElement("h1", {
  style: {
    fontFamily: "'Cormorant Garamond', serif",
    fontWeight: 400,
    fontSize: size,
    lineHeight: 1.05,
    letterSpacing: "-0.02em",
    color,
    margin: 0,
    ...style
  }
}, children);
const P = ({
  size = 11,
  color = C.text1,
  children,
  style
}) => /*#__PURE__*/React.createElement("p", {
  style: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: size,
    lineHeight: 1.6,
    color,
    margin: 0,
    ...style
  }
}, children);
const Paras = ({
  text,
  size = 11,
  color = C.text1,
  gap = 10,
  style,
  highlightColor
}) => {
  const paras = String(text || "").split(/\n\n+/).filter(Boolean);
  return /*#__PURE__*/React.createElement(React.Fragment, null, paras.map((para, i) => {
    // If highlightColor is set, wrap text between ** ** in gold spans
    let content = para;
    if (highlightColor && para.includes("**")) {
      const parts = para.split(/\*\*/);
      content = parts.map((part, j) => j % 2 === 1 ? React.createElement("span", {
        key: j,
        style: {
          color: highlightColor,
          fontWeight: 600,
          fontStyle: "normal"
        }
      }, part) : part);
    }
    return /*#__PURE__*/React.createElement("p", {
      key: i,
      style: {
        fontFamily: "'DM Sans', sans-serif",
        fontSize: size,
        lineHeight: 1.6,
        color,
        margin: 0,
        marginBottom: i === paras.length - 1 ? 0 : gap,
        ...style
      }
    }, content);
  }));
};
const Chip = ({
  children,
  color = C.gold,
  style
}) => /*#__PURE__*/React.createElement("span", {
  style: {
    display: "inline-block",
    padding: "5px 12px",
    background: `${color}18`,
    border: `1px solid ${color}40`,
    borderRadius: 6,
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: "0.06em",
    color,
    textTransform: "uppercase",
    fontFamily: "'DM Sans', sans-serif",
    ...style
  }
}, children);
const PullQuote = ({
  children,
  color = C.gold,
  style
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    margin: "26px 0",
    textAlign: "center",
    ...style
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    width: "30%",
    height: 0.5,
    background: color,
    opacity: 0.6,
    margin: "0 auto 18px"
  }
}), /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "'Cormorant Garamond', serif",
    fontWeight: 400,
    fontSize: 22,
    lineHeight: 1.3,
    letterSpacing: "-0.01em",
    color: C.text1,
    fontStyle: "italic",
    maxWidth: "5.5in",
    margin: "0 auto"
  }
}, typeof children === "string" && children.includes("\n") ? children.split("\n").map((line, i, arr) => React.createElement(React.Fragment, {
  key: i
}, i === 0 ? "\u201c" + line : line, i < arr.length - 1 ? React.createElement("br", null) : "\u201d")) : "\u201c" + children + "\u201d"), /*#__PURE__*/React.createElement("div", {
  style: {
    width: "30%",
    height: 0.5,
    background: color,
    opacity: 0.6,
    margin: "18px auto 0"
  }
}));

// ─── ICONS — Lucide-style ─────────────────────────────────────────
const Icon = ({
  name,
  color = C.gold,
  size = 24,
  strokeWidth = 1.5
}) => {
  const props = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  };
  if (name === "target") return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "5"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "1.5",
    fill: color
  }));
  if (name === "alert-triangle") return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
    d: "M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "9",
    x2: "12",
    y2: "13"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "17",
    x2: "12.01",
    y2: "17"
  }));
  if (name === "compass") return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "10"
  }), /*#__PURE__*/React.createElement("polygon", {
    points: "16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76",
    fill: color,
    fillOpacity: "0.15"
  }));
  if (name === "trending-up") return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("polyline", {
    points: "22 7 13.5 15.5 8.5 10.5 2 17"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "16 7 22 7 22 13"
  }));
  if (name === "check-circle") return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
    d: "M22 11.08V12a10 10 0 1 1-5.93-9.14"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "22 4 12 14.01 9 11.01"
  }));
  if (name === "arrow-right") return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("line", {
    x1: "5",
    y1: "12",
    x2: "19",
    y2: "12"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "12 5 19 12 12 19"
  }));
  if (name === "zap") return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("polygon", {
    points: "13 2 3 14 12 14 11 22 21 10 12 10 13 2",
    fill: color,
    fillOpacity: "0.15"
  }));
  if (name === "shield") return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
    d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
  }));
  if (name === "users") return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
    d: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "9",
    cy: "7",
    r: "4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M23 21v-2a4 4 0 0 0-3-3.87"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M16 3.13a4 4 0 0 1 0 7.75"
  }));
  if (name === "book-open") return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
    d: "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"
  }));
  if (name === "award") return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "8",
    r: "7"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "8.21 13.89 7 23 12 20 17 23 15.79 13.88"
  }));
  if (name === "mail") return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
    d: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "22,6 12,13 2,6"
  }));
  if (name === "list") return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("line", {
    x1: "8",
    y1: "6",
    x2: "21",
    y2: "6"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "8",
    y1: "12",
    x2: "21",
    y2: "12"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "8",
    y1: "18",
    x2: "21",
    y2: "18"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "3",
    y1: "6",
    x2: "3.01",
    y2: "6"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "3",
    y1: "12",
    x2: "3.01",
    y2: "12"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "3",
    y1: "18",
    x2: "3.01",
    y2: "18"
  }));

  // Per-constraint identity icons
  if (name === "constraint-profitability") return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
    d: "M3 3v18h18"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M7 14l4-4 4 4 5-7"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "20",
    cy: "7",
    r: "1.3",
    fill: color,
    stroke: "none"
  }));
  if (name === "constraint-cash_flow") return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
    d: "M6 3v3a3 3 0 0 0 3 3h6a3 3 0 0 1 3 3v3"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M18 21v-3a3 3 0 0 0-3-3H9a3 3 0 0 1-3-3V9"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "6",
    cy: "3",
    r: "1.5",
    fill: color
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "18",
    cy: "21",
    r: "1.5",
    fill: color
  }));
  if (name === "constraint-owner_dependency") return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "7",
    r: "3"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M5 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "10",
    x2: "12",
    y2: "15",
    strokeDasharray: "2 2"
  }));
  if (name === "constraint-revenue_quality") return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 3 A9 9 0 0 1 21 12 L12 12 Z",
    fill: color,
    fillOpacity: "0.25",
    stroke: "none"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "3",
    x2: "12",
    y2: "12"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "12",
    x2: "21",
    y2: "12"
  }));
  if (name === "constraint-operational_efficiency") return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "3"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
  }));
  if (name === "constraint-debt_coverage") return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "3",
    x2: "12",
    y2: "21"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M5 8h14M5 8l-3 6h6zm14 0l3 6h-6z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M9 14a3 3 0 0 0 6 0M3 14a3 3 0 0 0 6 0M15 14a3 3 0 0 0 6 0"
  }));
  if (name === "constraint-scalability") return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("line", {
    x1: "21",
    y1: "3",
    x2: "14",
    y2: "10"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "3",
    y1: "21",
    x2: "10",
    y2: "14"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "15 3 21 3 21 9"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "9 21 3 21 3 15"
  }));
  return null;
};
const ConstraintIcon = ({
  id,
  color,
  size = 24,
  strokeWidth = 1.5
}) => /*#__PURE__*/React.createElement(Icon, {
  name: `constraint-${id}`,
  color: color,
  size: size,
  strokeWidth: strokeWidth
});
const ScoreRing = ({
  score,
  color,
  size = 140,
  stroke = 10
}) => {
  const r = (size - stroke) / 2,
    circ = 2 * Math.PI * r,
    off = circ - score / 100 * circ;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: size,
      height: size,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    style: {
      transform: "rotate(-90deg)"
    }
  }, /*#__PURE__*/React.createElement("circle", {
    cx: size / 2,
    cy: size / 2,
    r: r,
    fill: "none",
    stroke: "rgba(255,255,255,0.06)",
    strokeWidth: stroke
  }), /*#__PURE__*/React.createElement("circle", {
    cx: size / 2,
    cy: size / 2,
    r: r,
    fill: "none",
    stroke: color,
    strokeWidth: stroke,
    strokeLinecap: "round",
    strokeDasharray: circ,
    strokeDashoffset: off
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Cormorant Garamond', serif",
      fontWeight: 300,
      fontSize: size * 0.36,
      lineHeight: 1,
      color,
      letterSpacing: "-0.02em"
    }
  }, score), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'DM Sans', sans-serif",
      fontSize: 8,
      letterSpacing: "0.18em",
      textTransform: "uppercase",
      color: C.text3,
      marginTop: 4
    }
  }, "out of 100")));
};
function hexToRgb(hex) {
  const h = hex.replace("#", "");
  const bigint = parseInt(h, 16);
  const r = bigint >> 16 & 255,
    g = bigint >> 8 & 255,
    b = bigint & 255;
  return `${r}, ${g}, ${b}`;
}
const LongShadowScore = ({
  score,
  color
}) => {
  const shadows = [];
  for (let i = 1; i <= 30; i++) {
    shadows.push(`${i}px ${i}px 0 rgba(${hexToRgb(color)}, ${Math.max(0.04, 0.4 - i * 0.012)})`);
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Cormorant Garamond', serif",
      fontWeight: 300,
      fontSize: 168,
      lineHeight: 0.85,
      letterSpacing: "-0.04em",
      color,
      textShadow: shadows.join(", "),
      display: "inline-block"
    }
  }, score);
};

// ─── V3 VISUAL PRIMITIVES ───────────────────────────────────────────
// New for v3. These exist to fix the "weak middle" problem in v2 — pages
// 3-5 were emotionally dense but visually sparse. Each primitive below
// is a self-contained SVG visualization that lives on a specific page.

// Big score ring for the cover. Replaces LongShadowScore.
// Same component as ScoreRing but tuned for cover use: thicker stroke,
// score color used semantically (red/amber/gold/green), Cormorant numeral.
const BigScoreRing = ({
  score,
  color,
  size = 200,
  stroke = 14
}) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const off = circ - score / 100 * circ;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: size,
      height: size,
      flexShrink: 0,
      borderRadius: "50%"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    style: {
      position: "relative",
      transform: "rotate(-90deg)",
      filter: `drop-shadow(0 0 18px ${color}35)`
    }
  }, /*#__PURE__*/React.createElement("circle", {
    cx: size / 2,
    cy: size / 2,
    r: r,
    fill: "none",
    stroke: "rgba(255,255,255,0.06)",
    strokeWidth: stroke
  }), [0.25, 0.5, 0.75].map(t => {
    const angle = t * 2 * Math.PI - Math.PI / 2;
    const x1 = size / 2 + (r - stroke / 2 - 4) * Math.cos(angle);
    const y1 = size / 2 + (r - stroke / 2 - 4) * Math.sin(angle);
    const x2 = size / 2 + (r + stroke / 2 + 4) * Math.cos(angle);
    const y2 = size / 2 + (r + stroke / 2 + 4) * Math.sin(angle);
    return /*#__PURE__*/React.createElement("line", {
      key: t,
      x1: x1,
      y1: y1,
      x2: x2,
      y2: y2,
      stroke: "rgba(255,255,255,0.18)",
      strokeWidth: "1"
    });
  }), /*#__PURE__*/React.createElement("circle", {
    cx: size / 2,
    cy: size / 2,
    r: r,
    fill: "none",
    stroke: color,
    strokeWidth: stroke,
    strokeLinecap: "round",
    strokeDasharray: circ,
    strokeDashoffset: off,
    style: {
      filter: `drop-shadow(0 0 6px ${color}80)`
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Cormorant Garamond', serif",
      fontWeight: 300,
      fontSize: size * 0.4,
      lineHeight: 1,
      color,
      letterSpacing: "-0.03em"
    }
  }, score), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'DM Sans', sans-serif",
      fontSize: 9,
      letterSpacing: "0.22em",
      textTransform: "uppercase",
      color: C.text3,
      marginTop: 6,
      fontWeight: 600
    }
  }, "out of 100")));
};

// Trajectory chart — the centerpiece of the consequence page.
// Two SVG line paths from "today" extending 12 months forward:
//   1. Current trajectory (declining, in the constraint color / red-ish)
//   2. With-the-moves trajectory (climbing, in green)
// Shaded gap between them = "the cost of doing nothing."
// Width: ~6.5in (full content width). Height: ~2.4in.
const TrajectoryChart = ({
  score,
  constraintColor
}) => {
  const W = 580,
    H = 220,
    pad = 30;
  const innerW = W - pad * 2,
    innerH = H - pad * 2;

  // 13 monthly data points (today + 12 months ahead)
  // Current trajectory drops from `score` toward `score - 25` with some realistic noise
  const declineEnd = Math.max(15, score - 28);
  const climbEnd = Math.min(96, score + 32);
  const N = 13;

  // Generate y-values for both lines (deterministic; no randomness so the
  // chart is identical across renders).
  const declineYs = Array.from({
    length: N
  }, (_, i) => {
    const t = i / (N - 1);
    // Ease-in-quad acceleration as things compound badly
    const eased = t * t;
    return score + (declineEnd - score) * eased;
  });
  const climbYs = Array.from({
    length: N
  }, (_, i) => {
    const t = i / (N - 1);
    // Ease-out: quick wins then settling into compounding growth
    const eased = 1 - Math.pow(1 - t, 1.8);
    return score + (climbEnd - score) * eased;
  });
  const xAt = i => pad + i / (N - 1) * innerW;
  const yAt = v => pad + innerH - v / 100 * innerH;

  // Build SVG path strings (smoothed line via simple bezier between points)
  const buildPath = ys => {
    let d = `M ${xAt(0)} ${yAt(ys[0])}`;
    for (let i = 1; i < ys.length; i++) {
      const x1 = xAt(i - 1) + (xAt(i) - xAt(i - 1)) * 0.5;
      const y1 = yAt(ys[i - 1]);
      const x2 = xAt(i) - (xAt(i) - xAt(i - 1)) * 0.5;
      const y2 = yAt(ys[i]);
      d += ` C ${x1} ${y1}, ${x2} ${y2}, ${xAt(i)} ${yAt(ys[i])}`;
    }
    return d;
  };
  const declinePath = buildPath(declineYs);
  const climbPath = buildPath(climbYs);

  // Shaded gap between the two paths (climb - decline).
  const gapPath = (() => {
    let d = `M ${xAt(0)} ${yAt(climbYs[0])}`;
    for (let i = 1; i < N; i++) {
      const x1 = xAt(i - 1) + (xAt(i) - xAt(i - 1)) * 0.5;
      const y1 = yAt(climbYs[i - 1]);
      const x2 = xAt(i) - (xAt(i) - xAt(i - 1)) * 0.5;
      const y2 = yAt(climbYs[i]);
      d += ` C ${x1} ${y1}, ${x2} ${y2}, ${xAt(i)} ${yAt(climbYs[i])}`;
    }
    // Now down the right edge to the decline line, back along it to start
    for (let i = N - 1; i >= 0; i--) {
      if (i === N - 1) {
        d += ` L ${xAt(i)} ${yAt(declineYs[i])}`;
      } else {
        const x1 = xAt(i + 1) - (xAt(i + 1) - xAt(i)) * 0.5;
        const y1 = yAt(declineYs[i + 1]);
        const x2 = xAt(i) + (xAt(i + 1) - xAt(i)) * 0.5;
        const y2 = yAt(declineYs[i]);
        d += ` C ${x1} ${y1}, ${x2} ${y2}, ${xAt(i)} ${yAt(declineYs[i])}`;
      }
    }
    d += " Z";
    return d;
  })();

  // Score gridlines
  const gridScores = [0, 25, 50, 75, 100];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "rgba(255,255,255,0.02)",
      border: `1px solid ${C.border1}`,
      borderRadius: 10,
      padding: "20px 16px 14px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      marginBottom: 8,
      padding: "0 14px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      letterSpacing: "0.18em",
      textTransform: "uppercase",
      color: C.text3,
      fontWeight: 600
    }
  }, "Projected health score \xB7 Next 12 months"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 14,
      fontSize: 9
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-block",
      width: 10,
      height: 2,
      background: C.red,
      borderRadius: 1
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      color: C.text3,
      letterSpacing: "0.04em"
    }
  }, "Current path")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-block",
      width: 10,
      height: 2,
      background: C.green,
      borderRadius: 1
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      color: C.text3,
      letterSpacing: "0.04em"
    }
  }, "With the moves")))), /*#__PURE__*/React.createElement("svg", {
    width: "100%",
    viewBox: `0 0 ${W} ${H}`,
    style: {
      display: "block"
    }
  }, gridScores.map(s => {
    const y = yAt(s);
    return /*#__PURE__*/React.createElement("g", {
      key: s
    }, /*#__PURE__*/React.createElement("line", {
      x1: pad,
      y1: y,
      x2: W - pad,
      y2: y,
      stroke: "rgba(255,255,255,0.06)",
      strokeWidth: "0.5",
      strokeDasharray: s === 0 || s === 100 ? "0" : "2 3"
    }), /*#__PURE__*/React.createElement("text", {
      x: pad - 6,
      y: y + 3,
      fontSize: "8",
      fill: C.text3,
      textAnchor: "end",
      fontFamily: "'DM Sans', sans-serif",
      letterSpacing: "0.06em"
    }, s));
  }), [{
    i: 0,
    label: "Today"
  }, {
    i: 6,
    label: "+6 months"
  }, {
    i: N - 1,
    label: "+12 months"
  }].map(({
    i,
    label
  }) => /*#__PURE__*/React.createElement("text", {
    key: i,
    x: xAt(i),
    y: H - pad + 14,
    fontSize: "8",
    fill: C.text3,
    textAnchor: i === 0 ? "start" : i === N - 1 ? "end" : "middle",
    fontFamily: "'DM Sans', sans-serif",
    letterSpacing: "0.06em"
  }, label)), /*#__PURE__*/React.createElement("path", {
    d: gapPath,
    fill: C.red,
    fillOpacity: "0.10"
  }), /*#__PURE__*/React.createElement("path", {
    d: declinePath,
    fill: "none",
    stroke: C.red,
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }), /*#__PURE__*/React.createElement("path", {
    d: climbPath,
    fill: "none",
    stroke: C.green,
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }), /*#__PURE__*/React.createElement("line", {
    x1: xAt(0),
    y1: pad,
    x2: xAt(0),
    y2: H - pad,
    stroke: C.text2,
    strokeWidth: "1",
    strokeDasharray: "2 2",
    opacity: "0.4"
  }), /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("circle", {
    cx: xAt(N - 1),
    cy: yAt(declineYs[N - 1]),
    r: "3.5",
    fill: C.red
  }), /*#__PURE__*/React.createElement("text", {
    x: xAt(N - 1) - 8,
    y: yAt(declineYs[N - 1]) + 3,
    fontSize: "11",
    fill: C.red,
    textAnchor: "end",
    fontFamily: "'Cormorant Garamond', serif",
    fontWeight: "500"
  }, Math.round(declineYs[N - 1]))), /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("circle", {
    cx: xAt(N - 1),
    cy: yAt(climbYs[N - 1]),
    r: "3.5",
    fill: C.green
  }), /*#__PURE__*/React.createElement("text", {
    x: xAt(N - 1) - 8,
    y: yAt(climbYs[N - 1]) + 3,
    fontSize: "11",
    fill: C.green,
    textAnchor: "end",
    fontFamily: "'Cormorant Garamond', serif",
    fontWeight: "500"
  }, Math.round(climbYs[N - 1]))), /*#__PURE__*/React.createElement("circle", {
    cx: xAt(0),
    cy: yAt(score),
    r: "4",
    fill: C.text1,
    stroke: C.bgDeep,
    strokeWidth: "2"
  }), /*#__PURE__*/React.createElement("text", {
    x: xAt(0) + 8,
    y: yAt(score) - 8,
    fontSize: "10",
    fill: C.text2,
    textAnchor: "start",
    fontFamily: "'DM Sans', sans-serif",
    letterSpacing: "0.04em"
  }, "You are here (", score, ")")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6,
      padding: "0 14px",
      fontSize: 9,
      color: C.text3,
      fontStyle: "italic",
      textAlign: "center"
    }
  }, "The shaded area is the cost of doing nothing \u2014 measured in health-score points compounding over 12 months."));
};

// ─── CONSTRAINT-SPECIFIC CONSEQUENCE CHARTS ─────────────────────────
// v4 upgrade: replaces the generic trajectory chart on page 3 with a
// constraint-specific visualization. Each shows the unique pain pattern
// for that constraint over 12 months — numbers vary by revenue tier
// (passed in via score + scaling), but the shape is the same per
// constraint.
//
// Shared chart frame — gridlines, axes, title/legend.
const ChartFrame = ({
  title,
  legend,
  children,
  W = 580,
  H = 210,
  pad = 36,
  footer
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    background: "rgba(255,255,255,0.02)",
    border: `1px solid ${C.border1}`,
    borderRadius: 10,
    padding: "18px 16px 14px"
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 10,
    padding: "0 14px"
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    fontSize: 9,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: C.text3,
    fontWeight: 600
  }
}, title), /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    gap: 14,
    fontSize: 9
  }
}, legend.map((l, i) => /*#__PURE__*/React.createElement("div", {
  key: i,
  style: {
    display: "flex",
    alignItems: "center",
    gap: 6
  }
}, /*#__PURE__*/React.createElement("span", {
  style: {
    display: "inline-block",
    width: 10,
    height: 2,
    background: l.color,
    borderRadius: 1
  }
}), /*#__PURE__*/React.createElement("span", {
  style: {
    color: C.text3,
    letterSpacing: "0.04em"
  }
}, l.label))))), /*#__PURE__*/React.createElement("svg", {
  width: "100%",
  viewBox: `0 0 ${W} ${H}`,
  style: {
    display: "block"
  }
}, children), footer && /*#__PURE__*/React.createElement("div", {
  style: {
    marginTop: 6,
    padding: "0 14px",
    fontSize: 9,
    color: C.text3,
    fontStyle: "italic",
    textAlign: "center"
  }
}, footer));

// Build a smooth bezier path through a series of points.
const buildPath = points => {
  if (!points.length) return "";
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1],
      curr = points[i];
    const c1x = prev.x + (curr.x - prev.x) * 0.5;
    const c2x = curr.x - (curr.x - prev.x) * 0.5;
    d += ` C ${c1x} ${prev.y}, ${c2x} ${curr.y}, ${curr.x} ${curr.y}`;
  }
  return d;
};
const ConstraintConsequenceChart = ({
  id,
  score,
  color,
  tier
}) => {
  const W = 580,
    H = 210,
    pad = 36;
  const N = 13; // monthly points
  const innerW = W - pad * 2,
    innerH = H - pad * 2;

  // Shared axis helpers — 0-100 scale for normalized charts
  const xAt = i => pad + i / (N - 1) * innerW;
  const yAt = v => pad + innerH - v / 100 * innerH;

  // Gridlines common to all charts
  const gridlines = [0, 25, 50, 75, 100].map(v => {
    const y = yAt(v);
    return /*#__PURE__*/React.createElement("g", {
      key: v
    }, /*#__PURE__*/React.createElement("line", {
      x1: pad,
      y1: y,
      x2: W - pad,
      y2: y,
      stroke: "rgba(255,255,255,0.06)",
      strokeWidth: "0.5",
      strokeDasharray: v === 0 || v === 100 ? "0" : "2 3"
    }));
  });
  const timeLabels = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("text", {
    x: xAt(0),
    y: H - pad + 14,
    fontSize: "8",
    fill: C.text3,
    textAnchor: "start",
    fontFamily: "'DM Sans', sans-serif",
    letterSpacing: "0.06em"
  }, "Today"), /*#__PURE__*/React.createElement("text", {
    x: xAt(6),
    y: H - pad + 14,
    fontSize: "8",
    fill: C.text3,
    textAnchor: "middle",
    fontFamily: "'DM Sans', sans-serif",
    letterSpacing: "0.06em"
  }, "+6 months"), /*#__PURE__*/React.createElement("text", {
    x: xAt(N - 1),
    y: H - pad + 14,
    fontSize: "8",
    fill: C.text3,
    textAnchor: "end",
    fontFamily: "'DM Sans', sans-serif",
    letterSpacing: "0.06em"
  }, "+12 months"));

  // ── PROFITABILITY — Revenue vs. What's Left (EBITDA) ─────────────
  if (id === "profitability") {
    if (tier === "growth" || tier === "optimize" || tier === "scaling") {
      // Growth+: show Your Margin vs Best-in-Class margin with growing Profit Gap
      const yourMarginYs = Array.from({
        length: N
      }, (_, i) => 35 + i / (N - 1) * 3); // 35→38 (nearly flat)
      const bicMarginYs = Array.from({
        length: N
      }, (_, i) => {
        const t = i / (N - 1);
        return 48 + t * 32; // 48→80 (pulling away)
      });
      const yourPts = yourMarginYs.map((v, i) => ({
        x: xAt(i),
        y: yAt(v)
      }));
      const bicPts = bicMarginYs.map((v, i) => ({
        x: xAt(i),
        y: yAt(v)
      }));
      // Gap shading
      let gapPath = `M ${yourPts[0].x} ${yourPts[0].y}`;
      for (let i = 1; i < N; i++) {
        const pc1x = yourPts[i - 1].x + (yourPts[i].x - yourPts[i - 1].x) * 0.5;
        const pc2x = yourPts[i].x - (yourPts[i].x - yourPts[i - 1].x) * 0.5;
        gapPath += ` C ${pc1x} ${yourPts[i - 1].y}, ${pc2x} ${yourPts[i].y}, ${yourPts[i].x} ${yourPts[i].y}`;
      }
      for (let i = N - 1; i >= 0; i--) {
        if (i === N - 1) gapPath += ` L ${bicPts[i].x} ${bicPts[i].y}`;else {
          const pc1x = bicPts[i + 1].x - (bicPts[i + 1].x - bicPts[i].x) * 0.5;
          const pc2x = bicPts[i].x + (bicPts[i + 1].x - bicPts[i].x) * 0.5;
          gapPath += ` C ${pc1x} ${bicPts[i + 1].y}, ${pc2x} ${bicPts[i].y}, ${bicPts[i].x} ${bicPts[i].y}`;
        }
      }
      gapPath += " Z";
      return /*#__PURE__*/React.createElement(ChartFrame, {
        title: "Your margin vs. best-in-class \u2014 next 12 months",
        legend: [{
          color: C.amber,
          label: "Your margin"
        }, {
          color: C.green,
          label: "Best-in-class margin"
        }],
        footer: "The shaded area is your Profit Gap \u2014 money left on the table every year that compounds into your Value Gap."
      }, gridlines, timeLabels, /*#__PURE__*/React.createElement("path", {
        d: gapPath,
        fill: C.gold,
        fillOpacity: "0.10"
      }), /*#__PURE__*/React.createElement("path", {
        d: buildPath(yourPts),
        fill: "none",
        stroke: C.amber,
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }), /*#__PURE__*/React.createElement("path", {
        d: buildPath(bicPts),
        fill: "none",
        stroke: C.green,
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: xAt(N - 1),
        cy: yourPts[N - 1].y,
        r: "3.5",
        fill: C.amber
      }), /*#__PURE__*/React.createElement("text", {
        x: xAt(N - 1) - 10,
        y: yourPts[N - 1].y + 16,
        fontSize: "9",
        fill: C.amber,
        textAnchor: "end",
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: "600"
      }, "Your margin"), /*#__PURE__*/React.createElement("circle", {
        cx: xAt(N - 1),
        cy: bicPts[N - 1].y,
        r: "3.5",
        fill: C.green
      }), /*#__PURE__*/React.createElement("text", {
        x: xAt(N - 1) - 10,
        y: bicPts[N - 1].y - 8,
        fontSize: "9",
        fill: C.green,
        textAnchor: "end",
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: "600"
      }, "Best-in-class"), /*#__PURE__*/React.createElement("text", {
        x: xAt(Math.floor(N / 2)),
        y: yAt((yourMarginYs[6] + bicMarginYs[6]) / 2) + 4,
        fontSize: "11",
        fill: C.gold,
        textAnchor: "middle",
        fontFamily: "'Cormorant Garamond', serif",
        fontWeight: "600",
        fontStyle: "italic"
      }, "PROFIT GAP"));
    }
    // Default (survival + stabilize): Revenue vs EBITDA divergence
    // Revenue grows steadily; margin shrinks. The gap widens.
    const revenueYs = Array.from({
      length: N
    }, (_, i) => 45 + i / (N - 1) * 40); // 45 → 85
    const marginYs = Array.from({
      length: N
    }, (_, i) => {
      const t = i / (N - 1);
      return 40 - t * 18; // 40 → 22 (declining)
    });
    const rPts = revenueYs.map((v, i) => ({
      x: xAt(i),
      y: yAt(v)
    }));
    const mPts = marginYs.map((v, i) => ({
      x: xAt(i),
      y: yAt(v)
    }));

    // Shaded gap between them
    let gapPath = `M ${rPts[0].x} ${rPts[0].y}`;
    for (let i = 1; i < N; i++) {
      const pc1x = rPts[i - 1].x + (rPts[i].x - rPts[i - 1].x) * 0.5;
      const pc2x = rPts[i].x - (rPts[i].x - rPts[i - 1].x) * 0.5;
      gapPath += ` C ${pc1x} ${rPts[i - 1].y}, ${pc2x} ${rPts[i].y}, ${rPts[i].x} ${rPts[i].y}`;
    }
    for (let i = N - 1; i >= 0; i--) {
      if (i === N - 1) gapPath += ` L ${mPts[i].x} ${mPts[i].y}`;else {
        const pc1x = mPts[i + 1].x - (mPts[i + 1].x - mPts[i].x) * 0.5;
        const pc2x = mPts[i].x + (mPts[i + 1].x - mPts[i].x) * 0.5;
        gapPath += ` C ${pc1x} ${mPts[i + 1].y}, ${pc2x} ${mPts[i].y}, ${mPts[i].x} ${mPts[i].y}`;
      }
    }
    gapPath += " Z";
    return /*#__PURE__*/React.createElement(ChartFrame, {
      title: "Revenue vs. what's left \u2014 next 12 months",
      legend: [{
        color: C.blue,
        label: "Revenue"
      }, {
        color: C.red,
        label: "What's left (EBITDA)"
      }],
      footer: "The top line keeps growing. What stays with you doesn't. That gap is the cost."
    }, gridlines, timeLabels, /*#__PURE__*/React.createElement("path", {
      d: gapPath,
      fill: C.red,
      fillOpacity: "0.08"
    }), /*#__PURE__*/React.createElement("path", {
      d: buildPath(rPts),
      fill: "none",
      stroke: C.blue,
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: buildPath(mPts),
      fill: "none",
      stroke: C.red,
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: xAt(N - 1),
      cy: yAt(revenueYs[N - 1]),
      r: "3.5",
      fill: C.blue
    }), /*#__PURE__*/React.createElement("text", {
      x: xAt(N - 1) - 10,
      y: yAt(revenueYs[N - 1]) - 8,
      fontSize: "11",
      fill: C.blue,
      textAnchor: "end",
      fontFamily: "'Cormorant Garamond', serif",
      fontWeight: "500"
    }, "+", Math.round(revenueYs[N - 1] - revenueYs[0]), "%"), /*#__PURE__*/React.createElement("circle", {
      cx: xAt(N - 1),
      cy: yAt(marginYs[N - 1]),
      r: "3.5",
      fill: C.red
    }), /*#__PURE__*/React.createElement("text", {
      x: xAt(N - 1) - 10,
      y: yAt(marginYs[N - 1]) + 16,
      fontSize: "11",
      fill: C.red,
      textAnchor: "end",
      fontFamily: "'Cormorant Garamond', serif",
      fontWeight: "500"
    }, Math.round(marginYs[N - 1] - marginYs[0]), "%"));
  }

  // ── CASH FLOW — Cash Conversion Cycle widening ────────────────────
  if (id === "cash_flow") {
    // Growth tier: show profit potential suppressed by cash flow issues
    if (tier === "growth" || tier === "optimize" || tier === "scaling") {
      const withFixYs = Array.from({
        length: N
      }, (_, i) => {
        const t = i / (N - 1);
        return 30 + t * 55; // 30→85 (strong upward growth)
      });
      const withoutFixYs = Array.from({
        length: N
      }, (_, i) => {
        const t = i / (N - 1);
        return 30 + t * 18 + t * t * 5; // 30→53 (sluggish, flattening)
      });
      const withPts = withFixYs.map((v, i) => ({
        x: xAt(i),
        y: yAt(v)
      }));
      const withoutPts = withoutFixYs.map((v, i) => ({
        x: xAt(i),
        y: yAt(v)
      }));
      // Gap shading
      let gapPath = `M ${withPts[0].x} ${withPts[0].y}`;
      for (let i = 1; i < N; i++) {
        const pc1x = withPts[i - 1].x + (withPts[i].x - withPts[i - 1].x) * 0.5;
        const pc2x = withPts[i].x - (withPts[i].x - withPts[i - 1].x) * 0.5;
        gapPath += ` C ${pc1x} ${withPts[i - 1].y}, ${pc2x} ${withPts[i].y}, ${withPts[i].x} ${withPts[i].y}`;
      }
      for (let i = N - 1; i >= 0; i--) {
        if (i === N - 1) gapPath += ` L ${withoutPts[i].x} ${withoutPts[i].y}`;else {
          const pc1x = withoutPts[i + 1].x - (withoutPts[i + 1].x - withoutPts[i].x) * 0.5;
          const pc2x = withoutPts[i].x + (withoutPts[i + 1].x - withoutPts[i].x) * 0.5;
          gapPath += ` C ${pc1x} ${withoutPts[i + 1].y}, ${pc2x} ${withoutPts[i].y}, ${withoutPts[i].x} ${withoutPts[i].y}`;
        }
      }
      gapPath += " Z";
      return /*#__PURE__*/React.createElement(ChartFrame, {
        title: "Profit potential \u2014 next 24 months",
        legend: [{
          color: C.green,
          label: "If cash flow is fixed"
        }, {
          color: C.amber,
          label: "If nothing changes"
        }],
        footer: "The shaded area is your Profit Gap \u2014 the growth you're leaving behind because cash can't fund it."
      }, gridlines, timeLabels, /*#__PURE__*/React.createElement("path", {
        d: gapPath,
        fill: C.gold,
        fillOpacity: "0.10"
      }), /*#__PURE__*/React.createElement("path", {
        d: buildPath(withPts),
        fill: "none",
        stroke: C.green,
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }), /*#__PURE__*/React.createElement("path", {
        d: buildPath(withoutPts),
        fill: "none",
        stroke: C.amber,
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: xAt(N - 1),
        cy: withPts[N - 1].y,
        r: "3.5",
        fill: C.green
      }), /*#__PURE__*/React.createElement("text", {
        x: xAt(N - 1) - 10,
        y: withPts[N - 1].y - 8,
        fontSize: "9",
        fill: C.green,
        textAnchor: "end",
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: "600"
      }, "Fixed"), /*#__PURE__*/React.createElement("circle", {
        cx: xAt(N - 1),
        cy: withoutPts[N - 1].y,
        r: "3.5",
        fill: C.amber
      }), /*#__PURE__*/React.createElement("text", {
        x: xAt(N - 1) - 10,
        y: withoutPts[N - 1].y + 16,
        fontSize: "9",
        fill: C.amber,
        textAnchor: "end",
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: "600"
      }, "Unfixed"), /*#__PURE__*/React.createElement("text", {
        x: xAt(Math.floor(N / 2)),
        y: yAt((withFixYs[6] + withoutFixYs[6]) / 2) + 4,
        fontSize: "11",
        fill: C.gold,
        textAnchor: "middle",
        fontFamily: "'Cormorant Garamond', serif",
        fontWeight: "600",
        fontStyle: "italic"
      }, "PROFIT GAP"));
    }
    // Stabilize tier: show cash balance volatility with no visibility
    if (tier === "stabilize") {
      const cashYs = [50, 62, 44, 68, 38, 55, 32, 58, 40, 65, 35, 52, 30];
      const dangerLine = 35;
      const cashPts = cashYs.map((v, i) => ({
        x: xAt(i),
        y: yAt(v)
      }));
      const visibleMonths = 4;
      return /*#__PURE__*/React.createElement(ChartFrame, {
        title: "Your cash balance \u2014 next 12 months (projected)",
        legend: [{
          color: C.cyan,
          label: "Cash balance"
        }, {
          color: C.red,
          label: "Danger zone"
        }],
        footer: "You can't plan what you can't predict. Without a cash forecast, every month is a surprise."
      }, gridlines, timeLabels, /*#__PURE__*/React.createElement("rect", {
        x: pad,
        y: yAt(dangerLine),
        width: innerW,
        height: yAt(0) - yAt(dangerLine),
        fill: C.red,
        fillOpacity: "0.04"
      }), /*#__PURE__*/React.createElement("line", {
        x1: pad,
        y1: yAt(dangerLine),
        x2: pad + innerW,
        y2: yAt(dangerLine),
        stroke: C.red,
        strokeWidth: "1",
        strokeDasharray: "4 3",
        strokeOpacity: "0.5"
      }), /*#__PURE__*/React.createElement("text", {
        x: pad + 4,
        y: yAt(dangerLine) - 4,
        fontSize: "8",
        fill: C.red,
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: "600",
        letterSpacing: "0.06em",
        fillOpacity: "0.7"
      }, "DANGER ZONE"), /*#__PURE__*/React.createElement("path", {
        d: buildPath(cashPts),
        fill: "none",
        stroke: C.cyan,
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }), /*#__PURE__*/React.createElement("rect", {
        x: xAt(visibleMonths),
        y: pad,
        width: xAt(N - 1) - xAt(visibleMonths) + 10,
        height: innerH,
        fill: "url(#fogGrad)"
      }), /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
        id: "fogGrad",
        x1: "0",
        y1: "0",
        x2: "1",
        y2: "0"
      }, /*#__PURE__*/React.createElement("stop", {
        offset: "0%",
        stopColor: "#0A0E14",
        stopOpacity: "0"
      }), /*#__PURE__*/React.createElement("stop", {
        offset: "40%",
        stopColor: "#0A0E14",
        stopOpacity: "0.7"
      }), /*#__PURE__*/React.createElement("stop", {
        offset: "100%",
        stopColor: "#0A0E14",
        stopOpacity: "0.85"
      }))), /*#__PURE__*/React.createElement("text", {
        x: xAt(Math.floor((visibleMonths + N) / 2)),
        y: yAt(50),
        fontSize: "10",
        fill: C.text3,
        textAnchor: "middle",
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: "600",
        letterSpacing: "0.08em"
      }, "NO VISIBILITY"), /*#__PURE__*/React.createElement("circle", {
        cx: xAt(0),
        cy: cashPts[0].y,
        r: "3.5",
        fill: C.cyan
      }));
    }
    // Default: days to get paid (survival + other tiers)
    // Two lines: DSO (growing, bad) and DPO (flat). The gap = cash tied up.
    const dsoYs = Array.from({
      length: N
    }, (_, i) => {
      const t = i / (N - 1);
      return 45 + t * t * 30; // accelerating — 45 → 75
    });
    const dpoYs = Array.from({
      length: N
    }, () => 35); // flat at 35
    const dsoPts = dsoYs.map((v, i) => ({
      x: xAt(i),
      y: yAt(v)
    }));
    const dpoPts = dpoYs.map((v, i) => ({
      x: xAt(i),
      y: yAt(v)
    }));

    // Shaded gap = cash trapped
    let gapPath = `M ${dsoPts[0].x} ${dsoPts[0].y}`;
    for (let i = 1; i < N; i++) {
      const pc1x = dsoPts[i - 1].x + (dsoPts[i].x - dsoPts[i - 1].x) * 0.5;
      const pc2x = dsoPts[i].x - (dsoPts[i].x - dsoPts[i - 1].x) * 0.5;
      gapPath += ` C ${pc1x} ${dsoPts[i - 1].y}, ${pc2x} ${dsoPts[i].y}, ${dsoPts[i].x} ${dsoPts[i].y}`;
    }
    for (let i = N - 1; i >= 0; i--) gapPath += ` L ${dpoPts[i].x} ${dpoPts[i].y}`;
    gapPath += " Z";
    return /*#__PURE__*/React.createElement(ChartFrame, {
      title: "How Long It Takes You To Get Paid \u2014 next 12 months",
      legend: [{
        color: C.red,
        label: "Days customers take to pay"
      }, {
        color: C.text2,
        label: "Days you take to pay suppliers"
      }],
      footer: "Every extra day of that gap is cash locked up in someone else's business."
    }, gridlines, timeLabels, /*#__PURE__*/React.createElement("path", {
      d: gapPath,
      fill: C.red,
      fillOpacity: "0.08"
    }), /*#__PURE__*/React.createElement("path", {
      d: buildPath(dsoPts),
      fill: "none",
      stroke: C.red,
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: buildPath(dpoPts),
      fill: "none",
      stroke: C.text2,
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeDasharray: "3 3"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: xAt(N - 1),
      cy: yAt(dsoYs[N - 1]),
      r: "3.5",
      fill: C.red
    }), /*#__PURE__*/React.createElement("text", {
      x: xAt(N - 1) - 10,
      y: yAt(dsoYs[N - 1]) + 16,
      fontSize: "11",
      fill: C.red,
      textAnchor: "end",
      fontFamily: "'Cormorant Garamond', serif",
      fontWeight: "500"
    }, "+", Math.round(dsoYs[N - 1] - dsoYs[0]), " days"));
  }

  // ── OWNER DEPENDENCY — Revenue up, Valuation multiple down ────────
  if (id === "owner_dependency") {
    if (tier === "stabilize" || tier === "survival") {
      // Stabilize/survival: you hired but your hours went UP not down
      const teamYs = Array.from({
        length: N
      }, (_, i) => 25 + i / (N - 1) * 30); // team grows
      const ownerHrsYs = Array.from({
        length: N
      }, (_, i) => {
        const t = i / (N - 1);
        return 45 + t * 35 + t * t * 8; // owner hours accelerate upward
      });
      const teamPts = teamYs.map((v, i) => ({
        x: xAt(i),
        y: yAt(v)
      }));
      const ownerPts = ownerHrsYs.map((v, i) => ({
        x: xAt(i),
        y: yAt(Math.min(v, 98))
      }));
      return /*#__PURE__*/React.createElement(ChartFrame, {
        title: "Team size vs. your hours \u2014 next 12 months",
        legend: [{
          color: C.cyan,
          label: "Team size"
        }, {
          color: C.amber,
          label: "Your hours managing them"
        }],
        footer: "You hired to get time back. Instead you're spending more time than ever managing, training, and fixing."
      }, gridlines, timeLabels, /*#__PURE__*/React.createElement("path", {
        d: buildPath(teamPts),
        fill: "none",
        stroke: C.cyan,
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }), /*#__PURE__*/React.createElement("path", {
        d: buildPath(ownerPts),
        fill: "none",
        stroke: C.amber,
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: xAt(N - 1),
        cy: teamPts[N - 1].y,
        r: "3.5",
        fill: C.cyan
      }), /*#__PURE__*/React.createElement("text", {
        x: xAt(N - 1) - 10,
        y: teamPts[N - 1].y - 8,
        fontSize: "9",
        fill: C.cyan,
        textAnchor: "end",
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: "600"
      }, "+team size"), /*#__PURE__*/React.createElement("circle", {
        cx: xAt(N - 1),
        cy: ownerPts[N - 1].y,
        r: "3.5",
        fill: C.amber
      }), /*#__PURE__*/React.createElement("text", {
        x: xAt(N - 1) - 10,
        y: ownerPts[N - 1].y + 16,
        fontSize: "9",
        fill: C.amber,
        textAnchor: "end",
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: "600"
      }, "+your hours"));
    }
    // Optimize+: Decisions requiring the owner vs handled by department leads
    if (tier === "optimize" || tier === "scaling") {
      const ownerYs = Array.from({
        length: N
      }, (_, i) => {
        const t = i / (N - 1);
        return 70 - t * 5; // 70→65 (barely declining — still doing everything)
      });
      const leadsYs = Array.from({
        length: N
      }, (_, i) => {
        const t = i / (N - 1);
        return 25 + t * 8; // 25→33 (slowly growing but way below where it should be)
      });
      const targetYs = Array.from({
        length: N
      }, (_, i) => {
        const t = i / (N - 1);
        return 55 + t * 25; // 55→80 (where dept leads should be handling)
      });
      const ownerPts = ownerYs.map((v, i) => ({
        x: xAt(i),
        y: yAt(v)
      }));
      const leadsPts = leadsYs.map((v, i) => ({
        x: xAt(i),
        y: yAt(v)
      }));
      const targetPts = targetYs.map((v, i) => ({
        x: xAt(i),
        y: yAt(v)
      }));
      return /*#__PURE__*/React.createElement(ChartFrame, {
        title: "Who's making the decisions \u2014 next 12 months",
        legend: [{
          color: C.amber,
          label: "Decisions requiring the owner"
        }, {
          color: C.green,
          label: "Decisions handled by dept leads"
        }, {
          color: C.gold,
          label: "Where dept leads should be"
        }],
        footer: "The gap between the green and gold lines is your leadership development gap \u2014 and it's what's capping your growth."
      }, gridlines, timeLabels, /*#__PURE__*/React.createElement("path", {
        d: buildPath(targetPts),
        fill: "none",
        stroke: C.gold,
        strokeWidth: "1.5",
        strokeLinecap: "round",
        strokeDasharray: "6 3"
      }), /*#__PURE__*/React.createElement("path", {
        d: buildPath(ownerPts),
        fill: "none",
        stroke: C.amber,
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }), /*#__PURE__*/React.createElement("path", {
        d: buildPath(leadsPts),
        fill: "none",
        stroke: C.green,
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: xAt(N - 1),
        cy: ownerPts[N - 1].y,
        r: "3.5",
        fill: C.amber
      }), /*#__PURE__*/React.createElement("text", {
        x: xAt(N - 1) - 10,
        y: ownerPts[N - 1].y - 8,
        fontSize: "9",
        fill: C.amber,
        textAnchor: "end",
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: "600"
      }, "Owner"), /*#__PURE__*/React.createElement("circle", {
        cx: xAt(N - 1),
        cy: leadsPts[N - 1].y,
        r: "3.5",
        fill: C.green
      }), /*#__PURE__*/React.createElement("text", {
        x: xAt(N - 1) - 10,
        y: leadsPts[N - 1].y + 16,
        fontSize: "9",
        fill: C.green,
        textAnchor: "end",
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: "600"
      }, "Dept leads"), /*#__PURE__*/React.createElement("circle", {
        cx: xAt(N - 1),
        cy: targetPts[N - 1].y,
        r: "3.5",
        fill: C.gold
      }), /*#__PURE__*/React.createElement("text", {
        x: xAt(N - 1) - 10,
        y: targetPts[N - 1].y - 8,
        fontSize: "9",
        fill: C.gold,
        textAnchor: "end",
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: "600"
      }, "Target"));
    }
    // Default: Revenue vs valuation gap (growth+ tiers)
    const revYs = Array.from({
      length: N
    }, (_, i) => 40 + i / (N - 1) * 45); // 40 → 85
    const valYs = Array.from({
      length: N
    }, (_, i) => {
      const t = i / (N - 1);
      return 65 - t * 25; // 65 → 40 (declining as key-man risk compounds)
    });
    const rPts = revYs.map((v, i) => ({
      x: xAt(i),
      y: yAt(v)
    }));
    const vPts = valYs.map((v, i) => ({
      x: xAt(i),
      y: yAt(v)
    }));
    return /*#__PURE__*/React.createElement(ChartFrame, {
      title: "Revenue vs. business valuation \u2014 next 12 months",
      legend: [{
        color: C.blue,
        label: "Revenue"
      }, {
        color: C.red,
        label: "What a buyer would pay"
      }],
      footer: "The business grows. Its value to anyone but you doesn't. Every month widens the gap."
    }, gridlines, timeLabels, /*#__PURE__*/React.createElement("path", {
      d: buildPath(rPts),
      fill: "none",
      stroke: C.blue,
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: buildPath(vPts),
      fill: "none",
      stroke: C.red,
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: xAt(N - 1),
      cy: yAt(revYs[N - 1]),
      r: "3.5",
      fill: C.blue
    }), /*#__PURE__*/React.createElement("text", {
      x: xAt(N - 1) - 10,
      y: yAt(revYs[N - 1]) - 8,
      fontSize: "11",
      fill: C.blue,
      textAnchor: "end",
      fontFamily: "'Cormorant Garamond', serif",
      fontWeight: "500"
    }, "+45%"), /*#__PURE__*/React.createElement("circle", {
      cx: xAt(N - 1),
      cy: yAt(valYs[N - 1]),
      r: "3.5",
      fill: C.red
    }), /*#__PURE__*/React.createElement("text", {
      x: xAt(N - 1) - 10,
      y: yAt(valYs[N - 1]) + 16,
      fontSize: "11",
      fill: C.red,
      textAnchor: "end",
      fontFamily: "'Cormorant Garamond', serif",
      fontWeight: "500"
    }, "-25%"));
  }

  // ── REVENUE QUALITY — Concentration then shock ────────────────────
  if (id === "revenue_quality") {
    if (tier === "optimize" || tier === "scaling") {
      // Optimize+: Recurring vs Project revenue with target line
      const recurringYs = Array.from({
        length: N
      }, (_, i) => {
        const t = i / (N - 1);
        return 25 + t * 12;
      });
      const projectYs = Array.from({
        length: N
      }, (_, i) => {
        const t = i / (N - 1);
        return 50 + Math.sin(t * 4) * 12 + t * 5;
      });
      const targetYs = Array.from({
        length: N
      }, (_, i) => {
        const t = i / (N - 1);
        return 60 + t * 15;
      });
      const recPts = recurringYs.map((v, i) => ({
        x: xAt(i),
        y: yAt(v)
      }));
      const projPts = projectYs.map((v, i) => ({
        x: xAt(i),
        y: yAt(Math.min(v, 95))
      }));
      const targPts = targetYs.map((v, i) => ({
        x: xAt(i),
        y: yAt(v)
      }));
      return /*#__PURE__*/React.createElement(ChartFrame, {
        title: "Recurring revenue vs. project revenue \u2014 next 12 months",
        legend: [{
          color: C.green,
          label: "Recurring revenue"
        }, {
          color: C.amber,
          label: "Project / one-time revenue"
        }, {
          color: C.gold,
          label: "Where recurring should be"
        }],
        footer: "Project revenue is volatile and must be replaced every quarter. Recurring revenue compounds. The gap between them is your growth ceiling."
      }, gridlines, timeLabels, /*#__PURE__*/React.createElement("path", {
        d: buildPath(targPts),
        fill: "none",
        stroke: C.gold,
        strokeWidth: "1.5",
        strokeLinecap: "round",
        strokeDasharray: "6 3"
      }), /*#__PURE__*/React.createElement("path", {
        d: buildPath(projPts),
        fill: "none",
        stroke: C.amber,
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }), /*#__PURE__*/React.createElement("path", {
        d: buildPath(recPts),
        fill: "none",
        stroke: C.green,
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: xAt(N - 1),
        cy: recPts[N - 1].y,
        r: "3.5",
        fill: C.green
      }), /*#__PURE__*/React.createElement("text", {
        x: xAt(N - 1) - 10,
        y: recPts[N - 1].y + 16,
        fontSize: "9",
        fill: C.green,
        textAnchor: "end",
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: "600"
      }, "Recurring"), /*#__PURE__*/React.createElement("circle", {
        cx: xAt(N - 1),
        cy: targPts[N - 1].y,
        r: "3.5",
        fill: C.gold
      }), /*#__PURE__*/React.createElement("text", {
        x: xAt(N - 1) - 10,
        y: targPts[N - 1].y - 8,
        fontSize: "9",
        fill: C.gold,
        textAnchor: "end",
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: "600"
      }, "Target"));
    }
    // Default: Revenue grows for 8 months, then top customer leaves at month 9, revenue drops 45%
    const revYs = Array.from({
      length: N
    }, (_, i) => {
      if (i <= 8) return 50 + i / 8 * 20; // 50 → 70 smooth growth
      // Shock at month 9
      if (i === 9) return 42; // drop
      return 42 + (i - 9) / 3 * 6; // slow partial recovery
    });
    const concYs = Array.from({
      length: N
    }, (_, i) => {
      if (i <= 8) return 40 + i / 8 * 20; // concentration grows 40% → 60%
      return 60 - (i - 8) / 4 * 35; // crashes after shock
    });
    const rPts = revYs.map((v, i) => ({
      x: xAt(i),
      y: yAt(v)
    }));
    const cPts = concYs.map((v, i) => ({
      x: xAt(i),
      y: yAt(v)
    }));
    // Shock marker — at the peak of the revenue line
    const shockX = xAt(8);
    return /*#__PURE__*/React.createElement(ChartFrame, {
      title: "Revenue vs. customer concentration \u2014 next 12 months",
      legend: [{
        color: C.blue,
        label: "Revenue"
      }, {
        color: C.amber,
        label: "Top customer share"
      }],
      footer: "Building on concentration feels like growth. Until the day it isn't."
    }, gridlines, timeLabels, /*#__PURE__*/React.createElement("line", {
      x1: shockX,
      y1: pad,
      x2: shockX,
      y2: H - pad,
      stroke: C.red,
      strokeWidth: "1",
      strokeDasharray: "2 2",
      opacity: "0.5"
    }), /*#__PURE__*/React.createElement("text", {
      x: shockX + 4,
      y: pad + 10,
      fontSize: "8",
      fill: C.red,
      fontFamily: "'DM Sans', sans-serif",
      letterSpacing: "0.06em",
      fontWeight: "600"
    }, "TOP CUSTOMER LEAVES"), /*#__PURE__*/React.createElement("path", {
      d: buildPath(rPts),
      fill: "none",
      stroke: C.blue,
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: buildPath(cPts),
      fill: "none",
      stroke: C.amber,
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: xAt(N - 1),
      cy: yAt(revYs[N - 1]),
      r: "3.5",
      fill: C.blue
    }));
  }

  // ── OPERATIONAL EFFICIENCY — Headcount up, Revenue/employee flat ─
  if (id === "operational_efficiency") {
    if (tier === "optimize" || tier === "scaling") {
      // Optimize+: Revenue grows while operating margin compresses
      const revYs = Array.from({
        length: N
      }, (_, i) => {
        const t = i / (N - 1);
        return 30 + t * 50;
      });
      const marginYs = Array.from({
        length: N
      }, (_, i) => {
        const t = i / (N - 1);
        return 55 - t * 20 - t * t * 8;
      });
      const targetYs = Array.from({
        length: N
      }, (_, i) => {
        const t = i / (N - 1);
        return 55 + t * 10;
      });
      const revPts = revYs.map((v, i) => ({
        x: xAt(i),
        y: yAt(v)
      }));
      const marginPts = marginYs.map((v, i) => ({
        x: xAt(i),
        y: yAt(Math.max(v, 5))
      }));
      const targetPts = targetYs.map((v, i) => ({
        x: xAt(i),
        y: yAt(v)
      }));
      let gapPath = `M ${marginPts[0].x} ${marginPts[0].y}`;
      for (let i = 1; i < N; i++) {
        const pc1x = marginPts[i - 1].x + (marginPts[i].x - marginPts[i - 1].x) * 0.5;
        const pc2x = marginPts[i].x - (marginPts[i].x - marginPts[i - 1].x) * 0.5;
        gapPath += ` C ${pc1x} ${marginPts[i - 1].y}, ${pc2x} ${marginPts[i].y}, ${marginPts[i].x} ${marginPts[i].y}`;
      }
      for (let i = N - 1; i >= 0; i--) {
        if (i === N - 1) gapPath += ` L ${targetPts[i].x} ${targetPts[i].y}`;else {
          const pc1x = targetPts[i + 1].x - (targetPts[i + 1].x - targetPts[i].x) * 0.5;
          const pc2x = targetPts[i].x + (targetPts[i + 1].x - targetPts[i].x) * 0.5;
          gapPath += ` C ${pc1x} ${targetPts[i + 1].y}, ${pc2x} ${targetPts[i].y}, ${targetPts[i].x} ${targetPts[i].y}`;
        }
      }
      gapPath += " Z";
      return /*#__PURE__*/React.createElement(ChartFrame, {
        title: `Revenue vs. operating margin \u2014 next 12 months`,
        legend: [{
          color: C.green,
          label: "Revenue"
        }, {
          color: C.amber,
          label: "Operating margin"
        }, {
          color: C.gold,
          label: "Where margin should be"
        }],
        footer: "Revenue grows while margin compresses. The widening gap increases business fragility and suppresses valuation."
      }, gridlines, timeLabels, /*#__PURE__*/React.createElement("path", {
        d: gapPath,
        fill: C.gold,
        fillOpacity: "0.08"
      }), /*#__PURE__*/React.createElement("path", {
        d: buildPath(targetPts),
        fill: "none",
        stroke: C.gold,
        strokeWidth: "1.5",
        strokeLinecap: "round",
        strokeDasharray: "6 3"
      }), /*#__PURE__*/React.createElement("path", {
        d: buildPath(revPts),
        fill: "none",
        stroke: C.green,
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }), /*#__PURE__*/React.createElement("path", {
        d: buildPath(marginPts),
        fill: "none",
        stroke: C.amber,
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: xAt(N - 1),
        cy: revPts[N - 1].y,
        r: "3.5",
        fill: C.green
      }), /*#__PURE__*/React.createElement("text", {
        x: xAt(N - 1) - 10,
        y: revPts[N - 1].y - 8,
        fontSize: "9",
        fill: C.green,
        textAnchor: "end",
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: "600"
      }, "Revenue"), /*#__PURE__*/React.createElement("circle", {
        cx: xAt(N - 1),
        cy: marginPts[N - 1].y,
        r: "3.5",
        fill: C.amber
      }), /*#__PURE__*/React.createElement("text", {
        x: xAt(N - 1) - 10,
        y: marginPts[N - 1].y + 16,
        fontSize: "9",
        fill: C.amber,
        textAnchor: "end",
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: "600"
      }, "Margin"), /*#__PURE__*/React.createElement("text", {
        x: xAt(Math.floor(N * 0.6)),
        y: yAt((marginYs[8] + targetYs[8]) / 2) + 4,
        fontSize: "11",
        fill: C.gold,
        textAnchor: "middle",
        fontFamily: "'Cormorant Garamond', serif",
        fontWeight: "600",
        fontStyle: "italic"
      }, "MARGIN GAP"));
    }
    // Default: Time spent on manual/low-value tasks vs revenue-generating work
    const manualYs = Array.from({
      length: N
    }, (_, i) => 40 + i / (N - 1) * 30); // 40 → 70 (growing)
    const revenueYs = Array.from({
      length: N
    }, (_, i) => {
      const t = i / (N - 1);
      return 55 - t * 12; // slight decline (less time for revenue work)
    });
    const manualPts = manualYs.map((v, i) => ({
      x: xAt(i),
      y: yAt(v)
    }));
    const revPts = revenueYs.map((v, i) => ({
      x: xAt(i),
      y: yAt(v)
    }));
    return /*#__PURE__*/React.createElement(ChartFrame, {
      title: "Where your time goes \u2014 next 12 months",
      legend: [{
        color: C.amber,
        label: "Hours on manual / low-value tasks"
      }, {
        color: C.cyan,
        label: "Hours on revenue-generating work"
      }],
      footer: "The more you do yourself, the less time you have to grow. The gap is your growth ceiling."
    }, gridlines, timeLabels, /*#__PURE__*/React.createElement("path", {
      d: buildPath(manualPts),
      fill: "none",
      stroke: C.amber,
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: buildPath(revPts),
      fill: "none",
      stroke: C.cyan,
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: xAt(N - 1),
      cy: yAt(manualYs[N - 1]),
      r: "3.5",
      fill: C.amber
    }), /*#__PURE__*/React.createElement("text", {
      x: xAt(N - 1) - 10,
      y: yAt(manualYs[N - 1]) - 8,
      fontSize: "11",
      fill: C.amber,
      textAnchor: "end",
      fontFamily: "'Cormorant Garamond', serif",
      fontWeight: "500"
    }, "+30%"), /*#__PURE__*/React.createElement("circle", {
      cx: xAt(N - 1),
      cy: yAt(revenueYs[N - 1]),
      r: "3.5",
      fill: C.cyan
    }), /*#__PURE__*/React.createElement("text", {
      x: xAt(N - 1) - 10,
      y: yAt(revenueYs[N - 1]) + 16,
      fontSize: "11",
      fill: C.cyan,
      textAnchor: "end",
      fontFamily: "'Cormorant Garamond', serif",
      fontWeight: "500"
    }, "-12%"));
  }

  // ── SCALABILITY — revenue hits capacity ceiling ─────────────
  if (id === "scalability") {
    if (tier === "optimize" || tier === "scaling") {
      // Optimize+: Revenue ambition vs infrastructure readiness gap
      const revenueYs = Array.from({
        length: N
      }, (_, i) => {
        const t = i / (N - 1);
        return 25 + t * 55;
      });
      const infraYs = Array.from({
        length: N
      }, (_, i) => {
        const t = i / (N - 1);
        return 25 + t * 15 + Math.sin(t * 3) * 5;
      });
      const revPts = revenueYs.map((v, i) => ({
        x: xAt(i),
        y: yAt(v)
      }));
      const infraPts = infraYs.map((v, i) => ({
        x: xAt(i),
        y: yAt(v)
      }));
      let gapPath = "M " + revPts[0].x + " " + revPts[0].y;
      for (let i = 1; i < N; i++) {
        const pc1x = revPts[i - 1].x + (revPts[i].x - revPts[i - 1].x) * 0.5;
        const pc2x = revPts[i].x - (revPts[i].x - revPts[i - 1].x) * 0.5;
        gapPath += " C " + pc1x + " " + revPts[i - 1].y + ", " + pc2x + " " + revPts[i].y + ", " + revPts[i].x + " " + revPts[i].y;
      }
      for (let i = N - 1; i >= 0; i--) {
        if (i === N - 1) gapPath += " L " + infraPts[i].x + " " + infraPts[i].y;else {
          const pc1x = infraPts[i + 1].x - (infraPts[i + 1].x - infraPts[i].x) * 0.5;
          const pc2x = infraPts[i].x + (infraPts[i + 1].x - infraPts[i].x) * 0.5;
          gapPath += " C " + pc1x + " " + infraPts[i + 1].y + ", " + pc2x + " " + infraPts[i].y + ", " + infraPts[i].x + " " + infraPts[i].y;
        }
      }
      gapPath += " Z";
      return /*#__PURE__*/React.createElement(ChartFrame, {
        title: "Revenue ambition vs. infrastructure readiness",
        legend: [{
          color: C.green,
          label: "Where revenue wants to go"
        }, {
          color: C.amber,
          label: "Where infrastructure can support"
        }],
        footer: "The widening gap is your scalability risk. Growth without infrastructure makes the business bigger, more fragile, and less valuable."
      }, gridlines, timeLabels, /*#__PURE__*/React.createElement("path", {
        d: gapPath,
        fill: C.gold,
        fillOpacity: "0.08"
      }), /*#__PURE__*/React.createElement("path", {
        d: buildPath(revPts),
        fill: "none",
        stroke: C.green,
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }), /*#__PURE__*/React.createElement("path", {
        d: buildPath(infraPts),
        fill: "none",
        stroke: C.amber,
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: xAt(N - 1),
        cy: revPts[N - 1].y,
        r: "3.5",
        fill: C.green
      }), /*#__PURE__*/React.createElement("text", {
        x: xAt(N - 1) - 10,
        y: revPts[N - 1].y - 8,
        fontSize: "9",
        fill: C.green,
        textAnchor: "end",
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: "600"
      }, "Revenue"), /*#__PURE__*/React.createElement("circle", {
        cx: xAt(N - 1),
        cy: infraPts[N - 1].y,
        r: "3.5",
        fill: C.amber
      }), /*#__PURE__*/React.createElement("text", {
        x: xAt(N - 1) - 10,
        y: infraPts[N - 1].y + 16,
        fontSize: "9",
        fill: C.amber,
        textAnchor: "end",
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: "600"
      }, "Infrastructure"), /*#__PURE__*/React.createElement("text", {
        x: xAt(Math.floor(N * 0.55)),
        y: yAt((revenueYs[7] + infraYs[7]) / 2) + 4,
        fontSize: "11",
        fill: C.gold,
        textAnchor: "middle",
        fontFamily: "'Cormorant Garamond', serif",
        fontWeight: "600",
        fontStyle: "italic"
      }, "SCALABILITY GAP"));
    }
    // Revenue grows but flattens as it approaches your capacity ceiling.
    // Capacity stays flat — showing the constraint.
    const capacityY = 70; // flat ceiling
    const revYs = Array.from({
      length: N
    }, (_, i) => {
      const t = i / (N - 1);
      return 30 + t * 45 - t * t * 12; // starts growing, then flattens near capacity
    });
    const capYs = Array.from({
      length: N
    }, () => capacityY);
    const revPts = revYs.map((v, i) => ({
      x: xAt(i),
      y: yAt(v)
    }));
    const capPts = capYs.map((v, i) => ({
      x: xAt(i),
      y: yAt(v)
    }));
    return /*#__PURE__*/React.createElement(ChartFrame, {
      title: "Revenue vs. your capacity ceiling \u2014 next 12 months",
      legend: [{
        color: C.cyan,
        label: "Revenue"
      }, {
        color: C.red,
        label: "Your capacity to deliver"
      }],
      footer: "Revenue can't grow past what you can deliver. The ceiling is the constraint."
    }, gridlines, timeLabels, /*#__PURE__*/React.createElement("path", {
      d: buildPath(capPts),
      fill: "none",
      stroke: C.red,
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeDasharray: "6 3"
    }), /*#__PURE__*/React.createElement("path", {
      d: buildPath(revPts),
      fill: "none",
      stroke: C.cyan,
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: xAt(N - 1),
      cy: revPts[N - 1].y,
      r: "3.5",
      fill: C.cyan
    }), /*#__PURE__*/React.createElement("text", {
      x: xAt(N - 1) - 10,
      y: revPts[N - 1].y - 8 + yAt(revYs[N - 1]),
      fontSize: "0",
      fill: "none"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: xAt(N - 1),
      cy: yAt(capacityY),
      r: "3.5",
      fill: C.red
    }), /*#__PURE__*/React.createElement("text", {
      x: xAt(2),
      y: yAt(capacityY) - 8,
      fontSize: "9",
      fill: C.red,
      fontFamily: "'DM Sans', sans-serif",
      fontWeight: "600",
      letterSpacing: "0.06em"
    }, "CAPACITY CEILING"));
  }
  return null;
};

// Constraint anatomy diagrams — one per constraint.
// Each shows the constraint as a 4-5 node system with the bottleneck
// stage highlighted. The reader sees what the constraint IS before the
// prose explains it.
//
// All diagrams share a common visual grammar:
//   - Nodes: rounded rectangles with icon + label
//   - Arrows: thin gold line with arrowhead
//   - The bottleneck node: filled with the constraint color, glowing
//   - Other nodes: outlined only, muted color
const ConstraintAnatomy = ({
  id,
  color,
  tier
}) => {
  // Shared node component
  const Node = ({
    x,
    y,
    w,
    h,
    label,
    sub,
    highlighted
  }) => /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("rect", {
    x: x,
    y: y,
    width: w,
    height: h,
    rx: "6",
    fill: highlighted ? `${color}28` : "rgba(255,255,255,0.03)",
    stroke: highlighted ? color : C.border2,
    strokeWidth: highlighted ? 1.5 : 1,
    style: highlighted ? {
      filter: `drop-shadow(0 0 6px ${color}60)`
    } : {}
  }), /*#__PURE__*/React.createElement("text", {
    x: x + w / 2,
    y: y + h / 2 - (sub ? 4 : -2),
    fontSize: "10",
    fill: highlighted ? color : C.text2,
    textAnchor: "middle",
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: highlighted ? 600 : 500,
    letterSpacing: "0.02em"
  }, label), sub && /*#__PURE__*/React.createElement("text", {
    x: x + w / 2,
    y: y + h / 2 + 9,
    fontSize: "7",
    fill: highlighted ? color : C.text3,
    textAnchor: "middle",
    fontFamily: "'DM Sans', sans-serif",
    letterSpacing: "0.06em",
    opacity: "0.85"
  }, sub), highlighted && /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("rect", {
    x: x + w / 2 - 22,
    y: y - 10,
    width: "44",
    height: "16",
    rx: "7",
    fill: color
  }), /*#__PURE__*/React.createElement("text", {
    x: x + w / 2,
    y: y + 1,
    fontSize: "7",
    fill: C.bgDeep,
    textAnchor: "middle",
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: "700",
    letterSpacing: "0.12em"
  }, "STUCK")));
  // Arrow between two points
  const Arrow = ({
    x1,
    y1,
    x2,
    y2,
    dashed
  }) => {
    const arrowSize = 4;
    const dx = x2 - x1,
      dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    const ux = dx / len,
      uy = dy / len;
    const tipX = x2 - ux * 2;
    const tipY = y2 - uy * 2;
    // Perpendicular for arrowhead wings
    const px = -uy * arrowSize,
      py = ux * arrowSize;
    return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("line", {
      x1: x1,
      y1: y1,
      x2: tipX,
      y2: tipY,
      stroke: C.gold,
      strokeWidth: "1.2",
      strokeDasharray: dashed ? "3 2" : "0",
      opacity: "0.8"
    }), /*#__PURE__*/React.createElement("polygon", {
      points: `${tipX + ux * 4},${tipY + uy * 4} ${tipX + px / 2},${tipY + py / 2} ${tipX - px / 2},${tipY - py / 2}`,
      fill: C.gold,
      opacity: "0.8"
    }));
  };

  // 580px wide, 120px tall — fits in the right half of the summary page
  const W = 580,
    H = 130;
  if (id === "cash_flow") {
    if (tier === "optimize" || tier === "scaling") {
      // Optimize+: cash not being redeployed effectively
      const nodes = [{
        x: 10,
        label: "Profits generated",
        sub: "business is making money"
      }, {
        x: 200,
        label: "Cash reinvested blindly",
        sub: "no allocation framework",
        highlighted: true
      }, {
        x: 390,
        label: "Growth missed",
        sub: "competitors redeploy faster"
      }];
      const w = 170,
        h = 56,
        y = 36;
      return /*#__PURE__*/React.createElement("svg", {
        width: "100%",
        viewBox: `0 0 ${W} ${H}`,
        style: {
          display: "block"
        }
      }, /*#__PURE__*/React.createElement("text", {
        x: 290,
        y: 14,
        fontSize: "9",
        fill: color,
        textAnchor: "middle",
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: "600",
        letterSpacing: "0.08em"
      }, "WHY PROFITS AREN'T COMPOUNDING"), nodes.map((n, i) => /*#__PURE__*/React.createElement(Node, {
        key: i,
        x: n.x,
        y: y,
        w: w,
        h: h,
        label: n.label,
        sub: n.sub,
        highlighted: n.highlighted
      })), nodes.slice(0, -1).map((n, i) => /*#__PURE__*/React.createElement(Arrow, {
        key: i,
        x1: n.x + w,
        y1: y + h / 2,
        x2: nodes[i + 1].x,
        y2: y + h / 2
      })));
    }
    if (tier === "growth") {
      // Growth: cash flow suppressing growth potential
      const nodes = [{
        x: 10,
        label: "Profit earned",
        sub: "on paper"
      }, {
        x: 200,
        label: "Cash trapped",
        sub: "slow collections, bad timing",
        highlighted: true
      }, {
        x: 390,
        label: "Growth stalled",
        sub: "can't reinvest for the future"
      }];
      const w = 170,
        h = 56,
        y = 36;
      return /*#__PURE__*/React.createElement("svg", {
        width: "100%",
        viewBox: `0 0 ${W} ${H}`,
        style: {
          display: "block"
        }
      }, /*#__PURE__*/React.createElement("text", {
        x: 290,
        y: 14,
        fontSize: "9",
        fill: color,
        textAnchor: "middle",
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: "600",
        letterSpacing: "0.08em"
      }, "WHY PROFIT ISN'T BECOMING GROWTH"), nodes.map((n, i) => /*#__PURE__*/React.createElement(Node, {
        key: i,
        x: n.x,
        y: y,
        w: w,
        h: h,
        label: n.label,
        sub: n.sub,
        highlighted: n.highlighted
      })), nodes.slice(0, -1).map((n, i) => /*#__PURE__*/React.createElement(Arrow, {
        key: i,
        x1: n.x + w,
        y1: y + h / 2,
        x2: nodes[i + 1].x,
        y2: y + h / 2
      })));
    }
    if (tier === "stabilize") {
      // Stabilize: the problem is you can't see what's coming
      const nodes = [{
        x: 10,
        label: "Revenue in",
        sub: "inconsistent timing"
      }, {
        x: 152,
        label: "No forecast",
        sub: "flying blind",
        highlighted: true
      }, {
        x: 294,
        label: "Decisions",
        sub: "made without data"
      }, {
        x: 436,
        label: "Growth stalls",
        sub: "can't invest safely"
      }];
      const w = 130,
        h = 56,
        y = 36;
      return /*#__PURE__*/React.createElement("svg", {
        width: "100%",
        viewBox: `0 0 ${W} ${H}`,
        style: {
          display: "block"
        }
      }, nodes.map((n, i) => /*#__PURE__*/React.createElement(Node, {
        key: i,
        x: n.x,
        y: y,
        w: w,
        h: h,
        label: n.label,
        sub: n.sub,
        highlighted: n.highlighted
      })), nodes.slice(0, -1).map((n, i) => /*#__PURE__*/React.createElement(Arrow, {
        key: i,
        x1: n.x + w,
        y1: y + h / 2,
        x2: nodes[i + 1].x,
        y2: y + h / 2
      })), /*#__PURE__*/React.createElement("text", {
        x: 290,
        y: 14,
        fontSize: "9",
        fill: color,
        textAnchor: "middle",
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: "600",
        letterSpacing: "0.08em"
      }, "WHAT DOES NEXT MONTH LOOK LIKE ?"));
    }
    // Default: slow payment cycle
    // Money goes out → Work happens → Customers pay (STUCK: slow) → Cash in hand
    const nodes = [{
      x: 10,
      label: "Money out",
      sub: "pay suppliers & payroll"
    }, {
      x: 152,
      label: "Work happens",
      sub: "deliver the product"
    }, {
      x: 294,
      label: "Customers pay",
      sub: "paying you slower",
      highlighted: true
    }, {
      x: 436,
      label: "Cash in hand",
      sub: "what's available"
    }];
    const w = 130,
      h = 56,
      y = 36;
    return /*#__PURE__*/React.createElement("svg", {
      width: "100%",
      viewBox: `0 0 ${W} ${H}`,
      style: {
        display: "block"
      }
    }, nodes.map((n, i) => /*#__PURE__*/React.createElement(Node, {
      key: i,
      x: n.x,
      y: y,
      w: w,
      h: h,
      label: n.label,
      sub: n.sub,
      highlighted: n.highlighted
    })), nodes.slice(0, -1).map((n, i) => /*#__PURE__*/React.createElement(Arrow, {
      key: i,
      x1: n.x + w,
      y1: y + h / 2,
      x2: nodes[i + 1].x,
      y2: y + h / 2
    })));
  }
  if (id === "profitability") {
    if (tier === "growth" || tier === "optimize" || tier === "scaling") {
      // Growth+: Profit Gap anatomy — 3 boxes, focused on margin gap
      const nodes = [{
        x: 10,
        label: "Your margin",
        sub: "where you are today"
      }, {
        x: 200,
        label: "Profit Gap",
        sub: "left on the table each year",
        highlighted: true
      }, {
        x: 390,
        label: "Best-in-class",
        sub: "where you should be"
      }];
      const w = 170,
        h = 56,
        y = 36;
      return /*#__PURE__*/React.createElement("svg", {
        width: "100%",
        viewBox: `0 0 ${W} ${H}`,
        style: {
          display: "block"
        }
      }, /*#__PURE__*/React.createElement("text", {
        x: 290,
        y: 14,
        fontSize: "9",
        fill: color,
        textAnchor: "middle",
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: "600",
        letterSpacing: "0.08em"
      }, "WHERE THE MONEY IS GOING"), nodes.map((n, i) => /*#__PURE__*/React.createElement(Node, {
        key: i,
        x: n.x,
        y: y,
        w: w,
        h: h,
        label: n.label,
        sub: n.sub,
        highlighted: n.highlighted
      })), nodes.slice(0, -1).map((n, i) => /*#__PURE__*/React.createElement(Arrow, {
        key: i,
        x1: n.x + w,
        y1: y + h / 2,
        x2: nodes[i + 1].x,
        y2: y + h / 2
      })));
    }
    // Default (survival + stabilize): Sales → Costs → What's left → Fuel for growth
    // Sales → Costs (STUCK: bloated) → What's Left → Fuel for growth
    const nodes = [{
      x: 10,
      label: "Sales",
      sub: "growing"
    }, {
      x: 152,
      label: "Costs",
      sub: "growing faster",
      highlighted: true
    }, {
      x: 294,
      label: "What's left",
      sub: "shrinking"
    }, {
      x: 436,
      label: "Fuel for growth",
      sub: "running empty"
    }];
    const w = 130,
      h = 56,
      y = 36;
    return /*#__PURE__*/React.createElement("svg", {
      width: "100%",
      viewBox: `0 0 ${W} ${H}`,
      style: {
        display: "block"
      }
    }, nodes.map((n, i) => /*#__PURE__*/React.createElement(Node, {
      key: i,
      x: n.x,
      y: y,
      w: w,
      h: h,
      label: n.label,
      sub: n.sub,
      highlighted: n.highlighted
    })), nodes.slice(0, -1).map((n, i) => /*#__PURE__*/React.createElement(Arrow, {
      key: i,
      x1: n.x + w,
      y1: y + h / 2,
      x2: nodes[i + 1].x,
      y2: y + h / 2
    })));
  }
  if (id === "owner_dependency") {
    if (tier === "optimize" || tier === "scaling") {
      // Optimize+: leadership development pipeline gap
      const nodes = [{
        x: 10,
        label: "Owner runs all",
        sub: "decisions, clients, strategy"
      }, {
        x: 200,
        label: "No dept leads",
        sub: "empty leadership pipeline",
        highlighted: true
      }, {
        x: 390,
        label: "Growth caps",
        sub: "can't scale past you"
      }];
      const w = 170,
        h = 56,
        y = 36;
      return /*#__PURE__*/React.createElement("svg", {
        width: "100%",
        viewBox: `0 0 ${W} ${H}`,
        style: {
          display: "block"
        }
      }, /*#__PURE__*/React.createElement("text", {
        x: 290,
        y: 14,
        fontSize: "9",
        fill: color,
        textAnchor: "middle",
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: "600",
        letterSpacing: "0.08em"
      }, "WHY THE BUSINESS CAN'T SCALE PAST YOU"), nodes.map((n, i) => /*#__PURE__*/React.createElement(Node, {
        key: i,
        x: n.x,
        y: y,
        w: w,
        h: h,
        label: n.label,
        sub: n.sub,
        highlighted: n.highlighted
      })), nodes.slice(0, -1).map((n, i) => /*#__PURE__*/React.createElement(Arrow, {
        key: i,
        x1: n.x + w,
        y1: y + h / 2,
        x2: nodes[i + 1].x,
        y2: y + h / 2
      })));
    }
    if (tier === "growth") {
      // Growth: growing with dependency makes the business riskier
      const nodes = [{
        x: 10,
        label: "Revenue grows",
        sub: "looks good on paper"
      }, {
        x: 200,
        label: "Owner dependency",
        sub: "still the bottleneck",
        highlighted: true
      }, {
        x: 390,
        label: "Value shrinks",
        sub: "riskier, not more valuable"
      }];
      const w = 170,
        h = 56,
        y = 36;
      return /*#__PURE__*/React.createElement("svg", {
        width: "100%",
        viewBox: `0 0 ${W} ${H}`,
        style: {
          display: "block"
        }
      }, /*#__PURE__*/React.createElement("text", {
        x: 290,
        y: 14,
        fontSize: "9",
        fill: color,
        textAnchor: "middle",
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: "600",
        letterSpacing: "0.08em"
      }, "BIGGER DOESN'T MEAN MORE VALUABLE"), nodes.map((n, i) => /*#__PURE__*/React.createElement(Node, {
        key: i,
        x: n.x,
        y: y,
        w: w,
        h: h,
        label: n.label,
        sub: n.sub,
        highlighted: n.highlighted
      })), nodes.slice(0, -1).map((n, i) => /*#__PURE__*/React.createElement(Arrow, {
        key: i,
        x1: n.x + w,
        y1: y + h / 2,
        x2: nodes[i + 1].x,
        y2: y + h / 2
      })));
    }
    // Default: Centered owner node with 4 spokes radiating: Sales, Ops, Decisions, Relationships
    // The owner node is highlighted as the bottleneck
    const cx = W / 2,
      cy = H / 2;
    const ownerW = 150,
      ownerH = 50;
    const spokes = [{
      dx: -200,
      dy: -38,
      label: "Sales"
    }, {
      dx: 200,
      dy: -38,
      label: "Decisions"
    }, {
      dx: -200,
      dy: 38,
      label: "Operations"
    }, {
      dx: 200,
      dy: 38,
      label: "Key relationships"
    }];
    const sw = 110,
      sh = 32;
    return /*#__PURE__*/React.createElement("svg", {
      width: "100%",
      viewBox: `0 0 ${W} ${H}`,
      style: {
        display: "block"
      }
    }, spokes.map((s, i) => {
      const ex = cx + s.dx,
        ey = cy + s.dy;
      // Find target edge of spoke node
      const tx = ex + (s.dx > 0 ? -sw / 2 : sw / 2);
      const ty = ey;
      // Find source on owner node edge
      const sx = cx + (s.dx > 0 ? ownerW / 2 : -ownerW / 2);
      const sy = cy + (s.dy > 0 ? ownerH / 4 : -ownerH / 4);
      return /*#__PURE__*/React.createElement(Arrow, {
        key: i,
        x1: tx,
        y1: ty,
        x2: sx,
        y2: sy
      });
    }), spokes.map((s, i) => /*#__PURE__*/React.createElement(Node, {
      key: i,
      x: cx + s.dx - sw / 2,
      y: cy + s.dy - sh / 2,
      w: sw,
      h: sh,
      label: s.label,
      highlighted: false
    })), /*#__PURE__*/React.createElement(Node, {
      x: cx - ownerW / 2,
      y: cy - ownerH / 2,
      w: ownerW,
      h: ownerH,
      label: "YOU",
      sub: "everything routes through you",
      highlighted: true
    }));
  }
  if (id === "revenue_quality") {
    if (tier === "optimize" || tier === "scaling") {
      // Optimize+: LTV & churn — customers paying more and staying longer
      const nodes = [{
        x: 10,
        label: "Low LTV",
        sub: "customers don't stay long"
      }, {
        x: 200,
        label: "High churn",
        sub: "replacing instead of growing",
        highlighted: true
      }, {
        x: 390,
        label: "Growth ceiling",
        sub: "revenue doesn't compound"
      }];
      const w = 170,
        h = 56,
        y = 36;
      return /*#__PURE__*/React.createElement("svg", {
        width: "100%",
        viewBox: `0 0 ${W} ${H}`,
        style: {
          display: "block"
        }
      }, /*#__PURE__*/React.createElement("text", {
        x: 290,
        y: 14,
        fontSize: "9",
        fill: color,
        textAnchor: "middle",
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: "600",
        letterSpacing: "0.08em"
      }, "WHY YOUR REVENUE ISN'T COMPOUNDING"), nodes.map((n, i) => /*#__PURE__*/React.createElement(Node, {
        key: i,
        x: n.x,
        y: y,
        w: w,
        h: h,
        label: n.label,
        sub: n.sub,
        highlighted: n.highlighted
      })), nodes.slice(0, -1).map((n, i) => /*#__PURE__*/React.createElement(Arrow, {
        key: i,
        x1: n.x + w,
        y1: y + h / 2,
        x2: nodes[i + 1].x,
        y2: y + h / 2
      })));
    }
    // Default: Pie/concentration view: one BIG slice highlighted, rest small slices
    // Layout: pie on left, label nodes on right
    const cx = 90,
      cy = H / 2,
      r = 50;
    // Slices: 50% (top customer), 18%, 14%, 10%, 8% — 5 slices
    const slices = [{
      pct: 50,
      color: color,
      label: "Customer A",
      sub: "50% of revenue",
      highlighted: true
    }, {
      pct: 18,
      color: C.text2,
      label: "Customer B",
      sub: "18%"
    }, {
      pct: 14,
      color: C.text3,
      label: "Customer C",
      sub: "14%"
    }, {
      pct: 10,
      color: C.text3,
      label: "Customer D",
      sub: "10%"
    }, {
      pct: 8,
      color: C.text4,
      label: "Other",
      sub: "8%"
    }];
    let cumPct = 0;
    const polarToCart = pct => {
      const angle = pct * 2 * Math.PI - Math.PI / 2;
      return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
    };
    return /*#__PURE__*/React.createElement("svg", {
      width: "100%",
      viewBox: `0 0 ${W} ${H}`,
      style: {
        display: "block"
      }
    }, slices.map((s, i) => {
      const startPct = cumPct / 100;
      cumPct += s.pct;
      const endPct = cumPct / 100;
      const [x1, y1] = polarToCart(startPct);
      const [x2, y2] = polarToCart(endPct);
      const large = s.pct > 50 ? 1 : 0;
      const d = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
      return /*#__PURE__*/React.createElement("path", {
        key: i,
        d: d,
        fill: s.highlighted ? s.color : "rgba(255,255,255,0.04)",
        stroke: s.highlighted ? s.color : C.border2,
        strokeWidth: s.highlighted ? 1.5 : 1,
        style: s.highlighted ? {
          filter: `drop-shadow(0 0 6px ${color}60)`
        } : {}
      });
    }), /*#__PURE__*/React.createElement("text", {
      x: cx,
      y: cy + r + 16,
      fontSize: "10",
      fill: C.text3,
      textAnchor: "middle",
      fontFamily: "'DM Sans', sans-serif",
      fontWeight: "600",
      letterSpacing: "0.06em"
    }, "REVENUE"), slices.map((s, i) => {
      const ly = 18 + i * 20;
      return /*#__PURE__*/React.createElement("g", {
        key: i
      }, /*#__PURE__*/React.createElement("rect", {
        x: 200,
        y: ly - 6,
        width: 10,
        height: 10,
        rx: "2",
        fill: s.highlighted ? s.color : C.border2,
        style: s.highlighted ? {
          filter: `drop-shadow(0 0 4px ${color}80)`
        } : {}
      }), /*#__PURE__*/React.createElement("text", {
        x: 216,
        y: ly + 2,
        fontSize: "10",
        fill: s.highlighted ? color : C.text2,
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: s.highlighted ? 600 : 500
      }, s.label), /*#__PURE__*/React.createElement("text", {
        x: 290,
        y: ly + 2,
        fontSize: "9",
        fill: s.highlighted ? color : C.text3,
        fontFamily: "'DM Sans', sans-serif",
        letterSpacing: "0.04em"
      }, s.sub));
    }), /*#__PURE__*/React.createElement("g", {
      transform: `translate(400, 50)`
    }, /*#__PURE__*/React.createElement("rect", {
      x: "0",
      y: "0",
      width: "170",
      height: "44",
      rx: "6",
      fill: `${color}18`,
      stroke: color,
      strokeWidth: "1"
    }), /*#__PURE__*/React.createElement("text", {
      x: "85",
      y: "16",
      fontSize: "9",
      fill: color,
      textAnchor: "middle",
      fontFamily: "'DM Sans', sans-serif",
      fontWeight: "700",
      letterSpacing: "0.1em"
    }, "TOO MUCH FROM ONE"), /*#__PURE__*/React.createElement("text", {
      x: "85",
      y: "32",
      fontSize: "8",
      fill: C.text2,
      textAnchor: "middle",
      fontFamily: "'DM Sans', sans-serif"
    }, "One client leaves = 50% of revenue gone")));
  }
  if (id === "operational_efficiency") {
    if (tier === "optimize" || tier === "scaling") {
      // Optimize+: margin compression increases fragility
      const nodes = [{
        x: 10,
        label: "Revenue grows",
        sub: "top line increasing"
      }, {
        x: 200,
        label: "Margin compresses",
        sub: "no efficiency discipline",
        highlighted: true
      }, {
        x: 390,
        label: "Fragility rises",
        sub: "valuation and scalability suppressed"
      }];
      const w = 170,
        h = 56,
        y = 36;
      return /*#__PURE__*/React.createElement("svg", {
        width: "100%",
        viewBox: `0 0 ${W} ${H}`,
        style: {
          display: "block"
        }
      }, /*#__PURE__*/React.createElement("text", {
        x: 290,
        y: 14,
        fontSize: "9",
        fill: color,
        textAnchor: "middle",
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: "600",
        letterSpacing: "0.08em"
      }, "WHY GROWTH IS MAKING THE BUSINESS MORE FRAGILE"), nodes.map((n, i) => /*#__PURE__*/React.createElement(Node, {
        key: i,
        x: n.x,
        y: y,
        w: w,
        h: h,
        label: n.label,
        sub: n.sub,
        highlighted: n.highlighted
      })), nodes.slice(0, -1).map((n, i) => /*#__PURE__*/React.createElement(Arrow, {
        key: i,
        x1: n.x + w,
        y1: y + h / 2,
        x2: nodes[i + 1].x,
        y2: y + h / 2
      })));
    }
    if (tier === "growth") {
      // Growth+: margin leakage and discipline
      const nodes = [{
        x: 10,
        label: "Revenue grows",
        sub: "top line increasing"
      }, {
        x: 200,
        label: "Margin leaks",
        sub: "inefficiency eats profit",
        highlighted: true
      }, {
        x: 390,
        label: "Growth stalls",
        sub: "no fuel to reinvest"
      }];
      const w = 170,
        h = 56,
        y = 36;
      return /*#__PURE__*/React.createElement("svg", {
        width: "100%",
        viewBox: `0 0 ${W} ${H}`,
        style: {
          display: "block"
        }
      }, /*#__PURE__*/React.createElement("text", {
        x: 290,
        y: 14,
        fontSize: "9",
        fill: color,
        textAnchor: "middle",
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: "600",
        letterSpacing: "0.08em"
      }, "WHERE YOUR MARGIN IS GOING"), nodes.map((n, i) => /*#__PURE__*/React.createElement(Node, {
        key: i,
        x: n.x,
        y: y,
        w: w,
        h: h,
        label: n.label,
        sub: n.sub,
        highlighted: n.highlighted
      })), nodes.slice(0, -1).map((n, i) => /*#__PURE__*/React.createElement(Arrow, {
        key: i,
        x1: n.x + w,
        y1: y + h / 2,
        x2: nodes[i + 1].x,
        y2: y + h / 2
      })));
    }
    // Default (survival + stabilize): bottleneck flow
    // Work comes in → Step 1 → STUCK (slow step) → Step 2 → Work ships
    const nodes = [{
      x: 10,
      label: "Work in",
      w: 80,
      h: 50
    }, {
      x: 110,
      label: "First step",
      w: 100,
      h: 50
    }, {
      x: 240,
      label: "Slow step",
      sub: "holds everyone up",
      w: 100,
      h: 70,
      highlighted: true,
      yOffset: -10
    }, {
      x: 370,
      label: "Next step",
      w: 100,
      h: 50
    }, {
      x: 490,
      label: "Work out",
      w: 80,
      h: 50
    }];
    const baseY = 40;
    return /*#__PURE__*/React.createElement("svg", {
      width: "100%",
      viewBox: `0 0 ${W} ${H}`,
      style: {
        display: "block"
      }
    }, nodes.map((n, i) => /*#__PURE__*/React.createElement(Node, {
      key: i,
      x: n.x,
      y: baseY + (n.yOffset || 0),
      w: n.w,
      h: n.h,
      label: n.label,
      sub: n.sub,
      highlighted: n.highlighted
    })), nodes.slice(0, -1).map((n, i) => {
      const next = nodes[i + 1];
      const y1 = baseY + (n.yOffset || 0) + n.h / 2;
      const y2 = baseY + (next.yOffset || 0) + next.h / 2;
      return /*#__PURE__*/React.createElement(Arrow, {
        key: i,
        x1: n.x + n.w,
        y1: y1,
        x2: next.x,
        y2: y2
      });
    }), /*#__PURE__*/React.createElement("text", {
      x: 290,
      y: 10,
      fontSize: "9",
      fill: color,
      textAnchor: "middle",
      fontFamily: "'DM Sans', sans-serif",
      fontWeight: "600",
      letterSpacing: "0.1em"
    }, "\u2193 EVERYTHING BACKS UP HERE \u2193"));
  }
  if (id === "scalability") {
    if (tier === "optimize" || tier === "scaling") {
      // Optimize+: Five foundations needed to scale
      const nodes = [{
        x: 10,
        label: "Growth ambition",
        sub: "revenue wants to scale"
      }, {
        x: 200,
        label: "Missing foundations",
        sub: "leadership, revenue, margins",
        highlighted: true
      }, {
        x: 390,
        label: "Plateau or fragility",
        sub: "bigger but not better"
      }];
      const w = 170,
        h = 56,
        y = 36;
      return /*#__PURE__*/React.createElement("svg", {
        width: "100%",
        viewBox: `0 0 ${W} ${H}`,
        style: {
          display: "block"
        }
      }, /*#__PURE__*/React.createElement("text", {
        x: 290,
        y: 14,
        fontSize: "9",
        fill: color,
        textAnchor: "middle",
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: "600",
        letterSpacing: "0.08em"
      }, "WHY SCALING WITHOUT FOUNDATIONS MAKES IT WORSE"), nodes.map((n, i) => /*#__PURE__*/React.createElement(Node, {
        key: i,
        x: n.x,
        y: y,
        w: w,
        h: h,
        label: n.label,
        sub: n.sub,
        highlighted: n.highlighted
      })), nodes.slice(0, -1).map((n, i) => /*#__PURE__*/React.createElement(Arrow, {
        key: i,
        x1: n.x + w,
        y1: y + h / 2,
        x2: nodes[i + 1].x,
        y2: y + h / 2
      })));
    }
    // Default: capacity ceiling flow
    // Input → Process (STUCK: can't handle more) → Output → Growth (capped)
    const nodes = [{
      x: 6,
      label: "New demand",
      sub: "clients, volume"
    }, {
      x: 124,
      label: "Your process",
      sub: "maxed out",
      highlighted: true
    }, {
      x: 242,
      label: "Delivery",
      sub: "slipping"
    }, {
      x: 360,
      label: "Growth",
      sub: "capped"
    }];
    const w = 110,
      h = 56,
      y = 36;
    return /*#__PURE__*/React.createElement("svg", {
      width: "100%",
      viewBox: `0 0 ${W} ${H}`,
      style: {
        display: "block"
      }
    }, nodes.map((n, i) => /*#__PURE__*/React.createElement(Node, {
      key: i,
      x: n.x,
      y: y,
      w: w,
      h: h,
      label: n.label,
      sub: n.sub,
      highlighted: n.highlighted
    })), nodes.slice(0, -1).map((n, i) => /*#__PURE__*/React.createElement(Arrow, {
      key: i,
      x1: n.x + w,
      y1: y + h / 2,
      x2: nodes[i + 1].x,
      y2: y + h / 2
    })), /*#__PURE__*/React.createElement("g", {
      transform: `translate(490, 36)`
    }, /*#__PURE__*/React.createElement("text", {
      x: "35",
      y: "-4",
      fontSize: "8",
      fill: C.text3,
      textAnchor: "middle",
      fontFamily: "'DM Sans', sans-serif",
      letterSpacing: "0.1em",
      fontWeight: "600"
    }, "CAPACITY"), /*#__PURE__*/React.createElement("rect", {
      x: "0",
      y: "0",
      width: "70",
      height: "56",
      rx: "6",
      fill: "rgba(255,255,255,0.03)",
      stroke: C.red,
      strokeWidth: "1",
      style: {
        filter: `drop-shadow(0 0 6px ${C.red}40)`
      }
    }), /*#__PURE__*/React.createElement("rect", {
      x: "6",
      y: "44",
      width: "58",
      height: "6",
      rx: "2",
      fill: "rgba(255,255,255,0.08)"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "6",
      y: "44",
      width: `${0.92 * 58}`,
      height: "6",
      rx: "2",
      fill: C.red
    }), /*#__PURE__*/React.createElement("text", {
      x: "35",
      y: "22",
      fontSize: "16",
      fill: C.red,
      textAnchor: "middle",
      fontFamily: "'Cormorant Garamond', serif",
      fontWeight: "500"
    }, "92%"), /*#__PURE__*/React.createElement("text", {
      x: "35",
      y: "34",
      fontSize: "7",
      fill: C.red,
      textAnchor: "middle",
      fontFamily: "'DM Sans', sans-serif",
      letterSpacing: "0.1em",
      fontWeight: "600"
    }, "AT LIMIT")));
  }

  // Fallback (shouldn't hit)
  return null;
};

// Severity meter — small horizontal bar showing relative contribution.
// Used on the root causes page next to each cause.
const SeverityMeter = ({
  pct,
  color,
  label
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 4,
    minWidth: 90
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    fontSize: 8,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: C.text3,
    fontWeight: 600
  }
}, label || "Contribution"), /*#__PURE__*/React.createElement("div", {
  style: {
    width: 90,
    height: 6,
    background: "rgba(255,255,255,0.06)",
    borderRadius: 3,
    overflow: "hidden",
    position: "relative"
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    width: `${pct}%`,
    height: "100%",
    background: `linear-gradient(90deg, ${color}aa, ${color})`,
    borderRadius: 3,
    boxShadow: `0 0 6px ${color}60`
  }
})), /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 14,
    color,
    fontWeight: 500,
    letterSpacing: "-0.01em",
    lineHeight: 1
  }
}, pct, "%"));

// Quartile dots — 5 dots representing peer quartile averages with the
// current business positioned among them. Used on the benchmark page.
const QuartileDots = ({
  score,
  color
}) => {
  // Simulated peer quartile averages (in production, these come from the
  // benchmark dataset). Q1 = bottom 25%, Q2 = 25-50%, Q3 = 50-75%, Q4 = top 25%.
  const peerScores = [28, 48, 62, 78];
  const peerLabels = ["Bottom 25%", "25–50%", "50–75%", "Top 25%"];

  // Compute approximate percentile for this user
  let percentile = 50;
  if (score < peerScores[0]) percentile = Math.round(score / peerScores[0] * 25);else if (score < peerScores[1]) percentile = 25 + Math.round((score - peerScores[0]) / (peerScores[1] - peerScores[0]) * 25);else if (score < peerScores[2]) percentile = 50 + Math.round((score - peerScores[1]) / (peerScores[2] - peerScores[1]) * 25);else if (score < peerScores[3]) percentile = 75 + Math.round((score - peerScores[2]) / (peerScores[3] - peerScores[2]) * 25);else percentile = Math.min(99, 75 + Math.round((score - peerScores[2]) / (100 - peerScores[2]) * 25));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "20px 22px",
      background: "rgba(255,255,255,0.02)",
      border: `1px solid ${C.border1}`,
      borderRadius: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      letterSpacing: "0.18em",
      textTransform: "uppercase",
      color: C.text3,
      fontWeight: 600
    }
  }, "Where you sit among peers"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Cormorant Garamond', serif",
      fontSize: 22,
      color,
      fontWeight: 500
    }
  }, percentile, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: C.text3,
      marginLeft: 4
    }
  }, "th percentile"))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 60,
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 24,
      left: 0,
      right: 0,
      height: 2,
      background: `linear-gradient(90deg, ${C.text4}, ${C.text3}, ${C.text2})`,
      borderRadius: 1
    }
  }), peerScores.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      position: "absolute",
      top: 18,
      left: `${s}%`,
      transform: "translateX(-50%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 14,
      height: 14,
      borderRadius: "50%",
      background: C.bgDeep,
      border: `1.5px solid ${C.text2}`
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 8,
      color: C.text3,
      letterSpacing: "0.06em",
      whiteSpace: "nowrap",
      marginTop: 4
    }
  }, peerLabels[i]), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Cormorant Garamond', serif",
      fontSize: 11,
      color: C.text3
    }
  }, s))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 24,
      // Center of the track line
      left: `${score}%`,
      transform: "translate(-50%, -50%)",
      zIndex: 2
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 18,
      height: 18,
      borderRadius: "50%",
      background: color,
      border: `2px solid ${C.paper}`,
      boxShadow: `0 0 0 1px ${color}, 0 0 12px ${color}80`
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      bottom: "calc(100% + 4px)",
      left: "50%",
      transform: "translateX(-50%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 3
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 8,
      letterSpacing: "0.18em",
      textTransform: "uppercase",
      color,
      fontWeight: 700,
      whiteSpace: "nowrap"
    }
  }, "YOU"), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 0,
      height: 0,
      borderLeft: "5px solid transparent",
      borderRight: "5px solid transparent",
      borderTop: `7px solid ${color}`
    }
  })))));
};

// Hex map — 6 hexagons, current constraint at the center, others around it.
// Used on the appendix page that lists the other 5 constraints.
const ConstraintHexMap = ({
  currentId,
  onLabelClick
}) => {
  // Center + 5 ring positions (clockwise from top)
  const cx = 290,
    cy = 100,
    r = 70;
  const positions = [{
    id: "_center",
    x: cx,
    y: cy
  }, {
    id: CATEGORY_ORDER[0].id,
    label: CATEGORY_ORDER[0].label,
    x: cx + r * Math.cos(-Math.PI / 2),
    y: cy + r * Math.sin(-Math.PI / 2)
  }, {
    id: CATEGORY_ORDER[1].id,
    label: CATEGORY_ORDER[1].label,
    x: cx + r * Math.cos(-Math.PI / 2 + Math.PI * 2 / 5),
    y: cy + r * Math.sin(-Math.PI / 2 + Math.PI * 2 / 5)
  }, {
    id: CATEGORY_ORDER[2].id,
    label: CATEGORY_ORDER[2].label,
    x: cx + r * Math.cos(-Math.PI / 2 + Math.PI * 4 / 5),
    y: cy + r * Math.sin(-Math.PI / 2 + Math.PI * 4 / 5)
  }, {
    id: CATEGORY_ORDER[3].id,
    label: CATEGORY_ORDER[3].label,
    x: cx + r * Math.cos(-Math.PI / 2 + Math.PI * 6 / 5),
    y: cy + r * Math.sin(-Math.PI / 2 + Math.PI * 6 / 5)
  }, {
    id: CATEGORY_ORDER[4].id,
    label: CATEGORY_ORDER[4].label,
    x: cx + r * Math.cos(-Math.PI / 2 + Math.PI * 8 / 5),
    y: cy + r * Math.sin(-Math.PI / 2 + Math.PI * 8 / 5)
  }];
  // Wait — we need only 5 ring nodes (excluding the current one), not 5 from the order.
  // Rebuild: ring = CATEGORY_ORDER filtered to exclude currentId, then 5 hexes around center.
  const ringIds = CATEGORY_ORDER.filter(c => c.id !== currentId);
  const ringHexes = ringIds.map((c, i) => {
    const angle = -Math.PI / 2 + i / ringIds.length * 2 * Math.PI;
    return {
      id: c.id,
      label: c.label,
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle)
    };
  });

  // Hexagon path generator (flat-top hexagon, size = circumradius)
  const hexPath = (cx, cy, size) => {
    const points = [];
    for (let i = 0; i < 6; i++) {
      const angle = Math.PI / 3 * i + Math.PI / 6;
      points.push(`${cx + size * Math.cos(angle)},${cy + size * Math.sin(angle)}`);
    }
    return `M ${points.join(" L ")} Z`;
  };
  const W = 580,
    H = 200;
  const hexSize = 28;
  const currentColor = CATEGORY_COLOR[currentId];
  return /*#__PURE__*/React.createElement("svg", {
    width: "100%",
    viewBox: `0 0 ${W} ${H}`,
    style: {
      display: "block"
    }
  }, ringHexes.map((h, i) => /*#__PURE__*/React.createElement("line", {
    key: `l-${i}`,
    x1: cx,
    y1: cy,
    x2: h.x,
    y2: h.y,
    stroke: C.border2,
    strokeWidth: "1",
    strokeDasharray: "2 2",
    opacity: "0.6"
  })), ringHexes.map((h, i) => {
    const color = CATEGORY_COLOR[h.id];
    return /*#__PURE__*/React.createElement("g", {
      key: h.id
    }, /*#__PURE__*/React.createElement("path", {
      d: hexPath(h.x, h.y, hexSize),
      fill: "rgba(255,255,255,0.03)",
      stroke: color,
      strokeWidth: "1.2",
      opacity: "0.8"
    }), /*#__PURE__*/React.createElement("g", {
      transform: `translate(${h.x - 9}, ${h.y - 9})`
    }, /*#__PURE__*/React.createElement(ConstraintIcon, {
      id: h.id,
      color: color,
      size: 18,
      strokeWidth: 1.4
    })), /*#__PURE__*/React.createElement("text", {
      x: h.x + (h.x > cx ? hexSize + 8 : -(hexSize + 8)),
      y: h.y + 3,
      fontSize: "9",
      fill: color,
      textAnchor: h.x > cx ? "start" : "end",
      fontFamily: "'DM Sans', sans-serif",
      fontWeight: "500"
    }, h.label));
  }), /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    d: hexPath(cx, cy, hexSize + 6),
    fill: `${currentColor}28`,
    stroke: currentColor,
    strokeWidth: "1.6",
    style: {
      filter: `drop-shadow(0 0 10px ${currentColor}80)`
    }
  }), /*#__PURE__*/React.createElement("g", {
    transform: `translate(${cx - 12}, ${cy - 12})`
  }, /*#__PURE__*/React.createElement(ConstraintIcon, {
    id: currentId,
    color: currentColor,
    size: 24,
    strokeWidth: 1.5
  }))));
};

// ═══════════════════════════════════════════════════════════════════
// PAGE COMPONENTS
// ═══════════════════════════════════════════════════════════════════

const PageCover = ({
  constraint,
  constraintId,
  score,
  scoreColor,
  recipientName,
  revenueLabel,
  tierKey,
  generatedDate,
  diagnosticId
}) => {
  const tier = TIER_LABELS[tierKey] || TIER_LABELS.growth;
  return /*#__PURE__*/React.createElement(Page, {
    bg: C.bgDeep
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: "-20%",
      left: "50%",
      transform: "translateX(-50%)",
      width: "140%",
      height: "70%",
      background: `radial-gradient(ellipse at center, ${constraint.color}22 0%, transparent 60%)`,
      pointerEvents: "none"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: "0.8in",
      right: "0.8in",
      opacity: 0.22
    }
  }, /*#__PURE__*/React.createElement(ConstraintIcon, {
    id: constraintId,
    color: constraint.color,
    size: 120,
    strokeWidth: 0.7
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      padding: "0.9in 0.8in 0.7in",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'DM Sans', sans-serif",
      fontSize: 14,
      letterSpacing: "0.24em",
      textTransform: "uppercase",
      color: C.gold,
      fontWeight: 700,
      marginBottom: 14
    }
  }, "The Constraint Roadmap"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Cormorant Garamond', serif",
      fontSize: 32,
      color: C.text1,
      letterSpacing: "0.12em",
      textTransform: "uppercase"
    }
  }, "Kriczky ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: C.gold
    }
  }, "Virtus"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-end",
      gap: 32
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement(ConstraintIcon, {
    id: constraintId,
    color: constraint.color,
    size: 20,
    strokeWidth: 1.5
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      letterSpacing: "0.22em",
      textTransform: "uppercase",
      color: constraint.color,
      fontWeight: 600
    }
  }, "Your #1 Constraint")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Cormorant Garamond', serif",
      fontWeight: 500,
      fontSize: 60,
      lineHeight: 1,
      letterSpacing: "-0.02em",
      color: C.text1,
      textShadow: `0 0 60px ${constraint.color}40`
    }
  }, constraint.name)), /*#__PURE__*/React.createElement("div", {
    style: {
      flexShrink: 0,
      paddingBottom: 8
    }
  }, /*#__PURE__*/React.createElement(BigScoreRing, {
    score: score,
    color: scoreColor,
    size: 200,
    stroke: 14
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 22
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      letterSpacing: "0.2em",
      textTransform: "uppercase",
      color: C.text3,
      marginBottom: 4
    }
  }, "Prepared for"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Cormorant Garamond', serif",
      fontSize: 36,
      color: C.text1,
      lineHeight: 1.05,
      letterSpacing: "-0.01em"
    }
  }, recipientName || "the business owner")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 18,
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "8px 14px",
      background: `linear-gradient(135deg, ${tier.metal}25, ${tier.metal}08)`,
      border: `1px solid ${tier.metal}60`,
      borderRadius: 999
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "award",
    color: tier.metal,
    size: 14,
    strokeWidth: 1.6
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      letterSpacing: "0.16em",
      textTransform: "uppercase",
      color: tier.metal,
      fontWeight: 600
    }
  }, tier.tier, " TIER")), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 16,
      width: 1,
      background: C.border2
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: C.text2
    }
  }, tier.range)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      paddingTop: 14,
      borderTop: `1px solid ${C.border1}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: C.text3,
      letterSpacing: "0.12em",
      textTransform: "uppercase"
    }
  }, "Edward Kriczky, CEPA \xB7 Founder"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: C.text3,
      letterSpacing: "0.14em",
      textTransform: "uppercase"
    }
  }, generatedDate)))));
};
const PageYouAreHere = ({
  constraint,
  constraintId,
  categories,
  score,
  tierKey,
  recipientName
}) => {
  const tier = TIER_LABELS[tierKey] || TIER_LABELS.growth;
  const catRows = CATEGORY_ORDER.map(c => {
    const cat = categories.find(x => x.color === CATEGORY_COLOR[c.id]);
    const catScore = cat ? cat.score : 50;
    return {
      id: c.id,
      label: c.label,
      score: catScore,
      identityColor: CATEGORY_COLOR[c.id],
      // v4: bar color based on score quality, not constraint identity.
      // <55 red (bad), 55-69 amber (mid), >=70 green (good).
      qualityColor: catScore >= 70 ? C.green : catScore >= 55 ? C.amber : C.red
    };
  }).sort((a, b) => a.score - b.score);
  return /*#__PURE__*/React.createElement(Page, null, /*#__PURE__*/React.createElement(PageChrome, {
    constraintName: constraint.name,
    recipientName: recipientName,
    pageNum: 2,
    totalPages: 14,
    accentColor: constraint.color
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0.95in 0.7in 0.85in"
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    color: C.gold
  }, "Where you stand"), /*#__PURE__*/React.createElement(H, {
    size: 42,
    style: {
      marginBottom: 16
    }
  }, "You are ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: constraint.color
    }
  }, "here"), "."), /*#__PURE__*/React.createElement(P, {
    size: 11.5,
    color: C.text2,
    style: {
      marginBottom: 26,
      maxWidth: "5.4in"
    }
  }, "Of the six categories measured, one is doing the most damage to your trajectory right now. Fix it first. The others move when this one moves."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      marginBottom: 10,
      fontSize: 9,
      letterSpacing: "0.18em",
      textTransform: "uppercase",
      color: C.text3,
      fontWeight: 600
    }
  }, /*#__PURE__*/React.createElement("span", null, "Ranked by impact (worst first)"), /*#__PURE__*/React.createElement("span", null, "Score / 100")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, catRows.map(row => {
    const isCurrent = row.id === constraintId;
    return /*#__PURE__*/React.createElement("div", {
      key: row.id,
      style: {
        display: "flex",
        alignItems: "center",
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 22,
        flexShrink: 0,
        opacity: isCurrent ? 1 : 0.45
      }
    }, /*#__PURE__*/React.createElement(ConstraintIcon, {
      id: row.id,
      color: row.identityColor,
      size: 20,
      strokeWidth: 1.5
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        width: "1.5in",
        flexShrink: 0,
        fontSize: 11,
        fontWeight: isCurrent ? 600 : 500,
        color: isCurrent ? C.text1 : C.text2,
        letterSpacing: "0.01em"
      }
    }, row.label), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        height: 16,
        background: "rgba(255,255,255,0.04)",
        borderRadius: 3,
        overflow: "hidden",
        position: "relative"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        width: `${row.score}%`,
        background: `linear-gradient(180deg, ${row.qualityColor}30, ${row.qualityColor}15)`,
        border: `0.5px solid ${row.qualityColor}`,
        borderRadius: 3,
        boxShadow: isCurrent ? `0 0 8px ${row.qualityColor}40, inset 0 1px 0 ${row.qualityColor}15` : `inset 0 1px 0 ${row.qualityColor}10`
      }
    }), isCurrent && /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        ...(row.score >= 50 ? {
          right: 6,
          top: "50%",
          transform: "translateY(-50%)",
          color: "#fff"
        } : {
          left: `${row.score}%`,
          top: "50%",
          transform: "translate(6px, -50%)",
          color: row.qualityColor
        }),
        fontSize: 8,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        fontWeight: 700
      }
    }, "YOU")), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 30,
        flexShrink: 0,
        textAlign: "right",
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 18,
        color: isCurrent ? row.qualityColor : C.text2,
        fontWeight: 500
      }
    }, row.score));
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "16px 20px",
      background: `linear-gradient(135deg, ${tier.metal}10, ${tier.metal}04)`,
      border: `1px solid ${tier.metal}30`,
      borderRadius: 10,
      display: "flex",
      alignItems: "center",
      gap: 18
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "award",
    color: tier.metal,
    size: 26
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: tier.metal,
      fontWeight: 700,
      marginBottom: 4
    }
  }, "Your tier \xB7 ", tier.tier, " \xB7 ", tier.range), /*#__PURE__*/React.createElement(P, {
    size: 10.5,
    color: C.text2
  }, "The diagnosis on the next pages is written for businesses at your size and stage. The same constraint at a different revenue band reads differently \u2014 the stakes shift, the moves shift, the timeline shifts.")))));
};
const PageConstraintSummary = ({
  constraint,
  constraintId,
  recipientName,
  pageNum = 4,
  tierKey
}) => {
  const quoteEntry = PULL_QUOTES[constraintId];
  const quote = typeof quoteEntry === "object" ? quoteEntry[tierKey] || quoteEntry.default : quoteEntry;
  return /*#__PURE__*/React.createElement(Page, null, /*#__PURE__*/React.createElement(PageChrome, {
    constraintName: constraint.name,
    recipientName: recipientName,
    pageNum: pageNum,
    totalPages: 14,
    accentColor: constraint.color
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0.95in 0.7in 0.85in"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement(ConstraintIcon, {
    id: constraintId,
    color: constraint.color,
    size: 28,
    strokeWidth: 1.5
  }), /*#__PURE__*/React.createElement(Eyebrow, {
    color: constraint.color,
    style: {
      marginBottom: 0
    }
  }, "Your #1 constraint")), /*#__PURE__*/React.createElement(H, {
    size: 38,
    style: {
      marginBottom: 16
    }
  }, constraint.name), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 18,
      padding: "12px 8px 6px",
      background: "rgba(255,255,255,0.02)",
      border: `1px solid ${C.border1}`,
      borderRadius: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      letterSpacing: "0.18em",
      textTransform: "uppercase",
      color: C.text3,
      fontWeight: 600,
      padding: "0 12px",
      marginBottom: 4
    }
  }, "How it works \xB7 where you're stuck"), /*#__PURE__*/React.createElement(ConstraintAnatomy, {
    id: constraintId,
    color: constraint.color,
    tier: tierKey
  })), /*#__PURE__*/React.createElement(Paras, {
    text: constraint.summary,
    size: 11,
    color: C.text1,
    gap: 10,
    highlightColor: C.gold
  }), quote && /*#__PURE__*/React.createElement(PullQuote, {
    color: constraint.color,
    style: {
      margin: "20px 0 0"
    }
  }, quote)));
};
const PageRootCauses = ({
  constraint,
  constraintId,
  recipientName,
  pageNum = 5
}) => {
  const severities = [45, 30, 25];
  const titles = constraintId && ROOT_CAUSE_TITLES[constraintId] || [];
  return /*#__PURE__*/React.createElement(Page, null, /*#__PURE__*/React.createElement(PageChrome, {
    constraintName: constraint.name,
    recipientName: recipientName,
    pageNum: pageNum,
    totalPages: 14,
    accentColor: constraint.color
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0.95in 0.7in 0.85in"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "compass",
    color: constraint.color,
    size: 26
  }), /*#__PURE__*/React.createElement(Eyebrow, {
    color: constraint.color,
    style: {
      marginBottom: 0
    }
  }, "What's causing it")), /*#__PURE__*/React.createElement(H, {
    size: 34,
    style: {
      marginBottom: 14
    }
  }, "The three root causes."), /*#__PURE__*/React.createElement(P, {
    size: 11,
    color: C.text2,
    style: {
      marginBottom: 20,
      maxWidth: "5.4in"
    }
  }, "Ranked by contribution. Causes overlap \u2014 fixing the dominant one usually softens the others."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 14
    }
  }, constraint.rootCauses.map((cause, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      padding: "16px 22px",
      background: `linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015))`,
      border: `1.5px solid ${constraint.color}20`,
      borderRadius: 12,
      position: "relative",
      overflow: "hidden",
      boxShadow: `0 4px 16px rgba(0,0,0,0.2), 0 0 20px ${constraint.color}05`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 0,
      left: "10%",
      width: "80%",
      height: "1.5px",
      background: `linear-gradient(90deg, transparent, ${constraint.color}40, transparent)`
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "3px",
      height: "100%",
      background: `linear-gradient(180deg, ${constraint.color}50, ${constraint.color}10)`,
      borderRadius: "12px 0 0 12px"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 30%, transparent 50%, transparent 70%, rgba(255,255,255,0.02) 100%)",
      pointerEvents: "none"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 16,
      alignItems: "center",
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Cormorant Garamond', serif",
      fontSize: 30,
      lineHeight: 1,
      color: constraint.color,
      fontWeight: 300,
      opacity: 0.6,
      flexShrink: 0,
      minWidth: 32
    }
  }, String(i + 1).padStart(2, "0")), /*#__PURE__*/React.createElement("h4", {
    style: {
      flex: 1,
      fontFamily: "'Cormorant Garamond', serif",
      fontSize: 18,
      fontWeight: 500,
      color: C.text1,
      margin: 0,
      lineHeight: 1.25,
      letterSpacing: "-0.01em"
    }
  }, titles[i] || `Root cause ${i + 1}`), /*#__PURE__*/React.createElement(SeverityMeter, {
    pct: severities[i] || 0,
    color: constraint.color
  })), /*#__PURE__*/React.createElement(P, {
    size: 10.5,
    color: C.text2,
    style: {
      paddingLeft: 48
    }
  }, cause))))));
};
const PageConsequence = ({
  constraint,
  constraintId,
  score,
  recipientName,
  pageNum = 3,
  tierKey
}) => {
  const cqEntry = CONSEQUENCE_QUOTES[constraintId];
  const quote = typeof cqEntry === "object" ? cqEntry[tierKey] || cqEntry.default : cqEntry;
  return /*#__PURE__*/React.createElement(Page, null, /*#__PURE__*/React.createElement(PageChrome, {
    constraintName: constraint.name,
    recipientName: recipientName,
    pageNum: pageNum,
    totalPages: 14,
    accentColor: constraint.color
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0.95in 0.7in 0.85in"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "alert-triangle",
    color: constraint.color,
    size: 26
  }), /*#__PURE__*/React.createElement(Eyebrow, {
    color: constraint.color,
    style: {
      marginBottom: 0
    }
  }, "If nothing changes")), /*#__PURE__*/React.createElement(H, {
    size: 34,
    style: {
      marginBottom: 14
    }
  }, "The cost of doing nothing."), /*#__PURE__*/React.createElement(P, {
    size: 11,
    color: C.text2,
    style: {
      marginBottom: 18,
      maxWidth: "5.4in"
    }
  }, "Two paths from here. The chart below shows what might happen twelve months from today if you don't address this constraint."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement(ConstraintConsequenceChart, {
    id: constraintId,
    score: score,
    color: constraint.color,
    tier: tierKey
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "18px 22px",
      background: `linear-gradient(135deg, ${constraint.color}10, ${constraint.color}04)`,
      border: `1px solid ${constraint.color}30`,
      borderRadius: 10,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement(Paras, {
    text: constraint.consequence,
    size: 11.5,
    color: C.text1,
    gap: 8,
    style: {
      fontStyle: "italic"
    },
    highlightColor: C.gold
  })), quote && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      fontFamily: "'Cormorant Garamond', serif",
      fontStyle: "italic",
      fontSize: 16,
      lineHeight: 1.3,
      color: C.text1,
      marginTop: 6
    }
  }, "\u201C", quote, "\u201D")));
};
const PageActionsIntro = ({
  constraint,
  constraintId
}) => /*#__PURE__*/React.createElement(Page, {
  bg: C.bgDeep
}, /*#__PURE__*/React.createElement("div", {
  style: {
    position: "absolute",
    top: "-20%",
    left: "-10%",
    width: "120%",
    height: "80%",
    background: `radial-gradient(ellipse at 30% 50%, ${constraint.color}28 0%, transparent 55%)`,
    pointerEvents: "none"
  }
}), /*#__PURE__*/React.createElement("div", {
  style: {
    position: "absolute",
    right: "0.2in",
    bottom: "0.2in",
    opacity: 0.06
  }
}, /*#__PURE__*/React.createElement(ConstraintIcon, {
  id: constraintId,
  color: constraint.color,
  size: 340,
  strokeWidth: 1
})), /*#__PURE__*/React.createElement("div", {
  style: {
    position: "absolute",
    top: "1in",
    bottom: "1in",
    left: "0.5in",
    width: 3,
    background: `linear-gradient(180deg, ${constraint.color}, ${constraint.color}20)`,
    borderRadius: 2,
    boxShadow: `0 0 14px ${constraint.color}60`
  }
}), /*#__PURE__*/React.createElement("div", {
  style: {
    position: "absolute",
    inset: 0,
    padding: "1in 0.8in 1in 1in",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between"
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    fontSize: 10,
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    color: C.text3,
    fontWeight: 600
  }
}, "The Constraint Roadmap \xB7 ", /*#__PURE__*/React.createElement("span", {
  style: {
    color: constraint.color,
    fontWeight: 700
  }
}, constraint.name)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
  style: {
    fontSize: 11,
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    color: constraint.color,
    fontWeight: 600,
    marginBottom: 16
  }
}, "What to do about it"), /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "'Cormorant Garamond', serif",
    fontWeight: 400,
    fontSize: 104,
    lineHeight: 0.92,
    letterSpacing: "-0.03em",
    color: C.text1,
    marginBottom: 20
  }
}, "Three", /*#__PURE__*/React.createElement("br", null), "moves", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
  style: {
    color: constraint.color
  }
}, "this week.")), /*#__PURE__*/React.createElement(P, {
  size: 14,
  color: C.text2,
  style: {
    maxWidth: "5.2in",
    fontWeight: 400
  }
}, "In order. Don\u2019t skip ahead. Each move helps make the next one easier to work.")), /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 14,
    color: C.text3,
    letterSpacing: "0.04em"
  }
}, "6 / 14")));
const PageActions = ({
  constraint,
  recipientName
}) => {
  const timelineLabels = ["This week", "Week 2-3", "Month 2"];
  return /*#__PURE__*/React.createElement(Page, null, /*#__PURE__*/React.createElement(PageChrome, {
    constraintName: constraint.name,
    recipientName: recipientName,
    pageNum: 7,
    totalPages: 14,
    accentColor: constraint.color
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0.85in 0.7in 0.75in"
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    color: C.gold
  }, "What to do this week"), /*#__PURE__*/React.createElement(H, {
    size: 28,
    style: {
      marginBottom: 18
    }
  }, "Three moves for ", constraint.name.toLowerCase(), "."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 22,
      padding: "10px 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 30
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: "50%",
      left: "5%",
      right: "5%",
      height: 2,
      background: `linear-gradient(90deg, ${constraint.color}, ${constraint.color}30)`,
      transform: "translateY(-50%)"
    }
  }), [0, 1, 2].map(i => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      position: "absolute",
      top: "50%",
      left: `${5 + i * 90 / 2}%`,
      transform: "translate(-50%, -50%)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 16,
      height: 16,
      borderRadius: "50%",
      background: constraint.color,
      border: `3px solid ${C.paper}`,
      boxShadow: `0 0 0 1px ${constraint.color}80`
    }
  }))), timelineLabels.map((label, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      position: "absolute",
      top: "calc(50% + 14px)",
      left: `${5 + i * 90 / 2}%`,
      transform: "translateX(-50%)",
      fontSize: 9,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: C.text3,
      fontWeight: 600,
      whiteSpace: "nowrap"
    }
  }, label)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10,
      marginBottom: 18
    }
  }, constraint.actions.map((a, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      padding: "14px 20px",
      background: "rgba(255,255,255,0.02)",
      border: `1px solid ${C.border1}`,
      borderRadius: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement(Chip, {
    color: constraint.color
  }, "Move ", a.n), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 9,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: C.text3,
      fontWeight: 600
    }
  }, "\xB7 ", timelineLabels[i] || "")), /*#__PURE__*/React.createElement("h4", {
    style: {
      fontFamily: "'Cormorant Garamond', serif",
      fontSize: 16,
      fontWeight: 500,
      color: C.text1,
      margin: "0 0 6px",
      lineHeight: 1.2,
      letterSpacing: "-0.01em"
    }
  }, a.title), /*#__PURE__*/React.createElement(P, {
    size: 10,
    color: C.text2
  }, a.body.includes("_") ? a.body.split(/_/).map((part, j) => j % 2 === 1 ? React.createElement("em", {
    key: j
  }, part) : part) : a.body)))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 18,
      padding: "18px 22px",
      background: `linear-gradient(135deg, ${C.gold}16, ${C.gold}06)`,
      border: `1.5px solid ${C.gold}50`,
      borderRadius: 12,
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "zap",
    color: C.gold,
    size: 20
  }), /*#__PURE__*/React.createElement(Eyebrow, {
    color: C.gold,
    style: {
      marginBottom: 0
    }
  }, "Want Help Starting These \u2014 Free")), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: "'Cormorant Garamond', serif",
      fontSize: 20,
      fontWeight: 500,
      color: C.text1,
      margin: "0 0 8px",
      lineHeight: 1.2,
      letterSpacing: "-0.01em"
    }
  }, "Book a Constraint Working Session."), /*#__PURE__*/React.createElement(P, {
    size: 10.5,
    color: C.text2,
    style: {
      marginBottom: 12,
      maxWidth: "5.5in"
    }
  }, "60\u201390 minutes. You bring your numbers. I walk you through exactly how to execute each of the three moves above \u2014 adapted to your specific business. You leave with a plan you can actually run. No obligation after."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "https://www.kriczkyvirtus.com/roadmap-session",
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "12px 32px",
      borderRadius: 12,
      textDecoration: "none",
      border: `1.5px solid ${C.gold}50`,
      color: C.gold,
      fontWeight: 700,
      fontSize: 12,
      letterSpacing: "0.02em",
      background: `linear-gradient(135deg, ${C.gold}18, ${C.gold}0a)`,
      boxShadow: `0 0 20px ${C.gold}20, 0 4px 12px rgba(0,0,0,0.3)`,
      fontFamily: "'DM Sans', sans-serif",
      position: "relative",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: "-50%",
      left: "-50%",
      right: "-50%",
      bottom: "-50%",
      pointerEvents: "none",
      background: `linear-gradient(120deg, transparent 0%, transparent 40%, ${C.gold}12 48%, ${C.gold}20 50%, ${C.gold}12 52%, transparent 60%, transparent 100%)`,
      backgroundSize: "200% 200%",
      animation: "btnShimmer 6s ease-in-out infinite"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      zIndex: 1
    }
  }, "Book Your Working Session")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 9,
      color: C.text3,
      letterSpacing: "0.06em"
    }
  }, "we only have 2 slots per week open for these calls currently")))));
};
const PageBenchmark = ({
  constraint,
  score,
  recipientName,
  pageNum = 8
}) => /*#__PURE__*/React.createElement(Page, null, /*#__PURE__*/React.createElement(PageChrome, {
  constraintName: constraint.name,
  recipientName: recipientName,
  pageNum: pageNum,
  totalPages: 14,
  accentColor: constraint.color
}), /*#__PURE__*/React.createElement("div", {
  style: {
    padding: "0.95in 0.7in 0.85in"
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 14
  }
}, /*#__PURE__*/React.createElement(Icon, {
  name: "trending-up",
  color: C.gold,
  size: 26
}), /*#__PURE__*/React.createElement(Eyebrow, {
  color: C.gold,
  style: {
    marginBottom: 0
  }
}, "Benchmark position")), /*#__PURE__*/React.createElement(H, {
  size: 24,
  style: {
    marginBottom: 18,
    lineHeight: 1.25,
    letterSpacing: "-0.015em"
  }
}, constraint.benchmark.headline), /*#__PURE__*/React.createElement("div", {
  style: {
    marginBottom: 20
  }
}, /*#__PURE__*/React.createElement(QuartileDots, {
  score: score,
  color: constraint.color
})), /*#__PURE__*/React.createElement("div", {
  style: {
    marginBottom: 18
  }
}, /*#__PURE__*/React.createElement(Paras, {
  text: constraint.benchmark.body,
  size: 11,
  color: C.text2,
  gap: 10
})), /*#__PURE__*/React.createElement("div", {
  style: {
    padding: "16px 22px",
    background: `${constraint.color}10`,
    border: `1px solid ${constraint.color}30`,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    gap: 18
  }
}, /*#__PURE__*/React.createElement(Icon, {
  name: "check-circle",
  color: constraint.color,
  size: 28,
  strokeWidth: 1.6
}), /*#__PURE__*/React.createElement(P, {
  size: 11,
  color: C.text1
}, "The gap is closeable. There is no reason you can\u2019t get your business into the top 25%."))));
const PageOfferTransition = () => /*#__PURE__*/React.createElement(Page, {
  bg: C.bgDeep
}, /*#__PURE__*/React.createElement("div", {
  style: {
    position: "absolute",
    top: "-30%",
    left: "-20%",
    width: "120%",
    height: "100%",
    background: `radial-gradient(ellipse at center, ${C.gold}1f 0%, transparent 55%)`,
    pointerEvents: "none"
  }
}), /*#__PURE__*/React.createElement("div", {
  style: {
    position: "absolute",
    inset: 0,
    padding: "1in 0.8in",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between"
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    fontSize: 10,
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    color: C.text3,
    fontWeight: 600
  }
}, "The Constraint Roadmap"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
  style: {
    fontSize: 11,
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    color: C.gold,
    fontWeight: 600,
    marginBottom: 18
  }
}, "One question."), /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "'Cormorant Garamond', serif",
    fontWeight: 400,
    fontSize: 80,
    lineHeight: 0.95,
    letterSpacing: "-0.03em",
    color: C.text1,
    marginBottom: 24
  }
}, "Are you", /*#__PURE__*/React.createElement("br", null), "going to", /*#__PURE__*/React.createElement("br", null), "fix it", /*#__PURE__*/React.createElement("br", null), "yourself?"), /*#__PURE__*/React.createElement(P, {
  size: 14,
  color: C.text2,
  style: {
    maxWidth: "5.2in",
    fontStyle: "italic"
  }
}, "Most owners say yes. About a third of them actually do. The next pages are for the others.")), /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 14,
    color: C.text3,
    letterSpacing: "0.04em"
  }
}, "8 / 14")));
const PageIntensivePitch = ({
  constraint,
  recipientName
}) => {
  const SI = STRATEGIC_INTENSIVE_COPY;
  const BANDS = [{
    label: "Not Sellable",
    mult: "0×",
    color: C.red
  }, {
    label: "Discount",
    mult: "3–4×",
    color: C.amber
  }, {
    label: "Market",
    mult: "~5×",
    color: C.gold
  }, {
    label: "Green Zone",
    mult: "5–6×",
    color: C.cyan
  }, {
    label: "Best-In-Class",
    mult: "7–8×",
    color: C.green
  }];
  const SCENARIOS = [{
    scores: [2, 3, 2, 3, 3, 2, 3, 2, 3, 3],
    label: "Not Sellable",
    color: C.red,
    pct: 43,
    total: 26
  }, {
    scores: [3, 4, 2, 3, 3, 3, 2, 3, 4, 3],
    label: "Discount",
    color: C.amber,
    pct: 50,
    total: 30
  }, {
    scores: [4, 4, 3, 4, 4, 4, 3, 4, 4, 3],
    label: "Market",
    color: C.gold,
    pct: 62,
    total: 37
  }, {
    scores: [4, 5, 4, 5, 4, 3, 4, 5, 3, 4],
    label: "Green Zone",
    color: C.cyan,
    pct: 68,
    total: 41
  }, {
    scores: [5, 5, 5, 5, 5, 5, 4, 5, 5, 4],
    label: "Best-In-Class",
    color: C.green,
    pct: 80,
    total: 48
  }];
  const DIMS_A = ["Market Position", "Revenue Quality", "Financial Performance", "Customer Concentration", "Management Team"];
  const DIMS_R = ["Documentation", "Contingency", "Financial Infrastructure", "Revenue Predictability", "Mgmt Succession"];
  const scCol = n => n <= 2 ? C.red : n <= 3 ? C.amber : n <= 4 ? C.cyan : C.green;
  const initSc = SCENARIOS[2];
  return /*#__PURE__*/React.createElement(Page, null, /*#__PURE__*/React.createElement(PageChrome, {
    constraintName: constraint.name,
    recipientName: recipientName,
    pageNum: 9,
    totalPages: 14,
    accentColor: constraint.color
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0.85in 0.7in 0.75in"
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    color: C.gold
  }, "Work with Kriczky Virtus \xB7 Valuation Driver Intensive"), /*#__PURE__*/React.createElement(H, {
    size: 20,
    style: {
      marginBottom: 10,
      lineHeight: 1.18,
      letterSpacing: "-0.015em"
    }
  }, SI.headline), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "'DM Sans', sans-serif",
      fontSize: 10,
      color: C.text2,
      lineHeight: 1.6,
      marginBottom: 10,
      maxWidth: "5.4in",
      margin: 0,
      marginBottom: 10
    }
  }, "Most owners I work with aren't struggling because they're bad operators. They're struggling because they're making decisions without knowing what those decisions are actually worth \u2014 ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: C.gold,
      fontWeight: 600
    }
  }, "in annual profit left on the table, in business valuation, and in the eventual exit"), " they'll need to fund their next chapter."), /*#__PURE__*/React.createElement(Eyebrow, {
    color: C.text3,
    style: {
      marginBottom: 6,
      marginTop: 25
    }
  }, "Free Diagnostic Tools \xB7 See How It Works"), /*#__PURE__*/React.createElement("div", {
    id: "gd-score-card",
    style: {
      padding: "14px 16px",
      borderRadius: 14,
      background: "linear-gradient(160deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 100%)",
      border: `1.5px solid ${C.cyan}20`,
      boxShadow: `0 6px 30px rgba(0,0,0,0.25), 0 0 40px ${C.cyan}05`,
      position: "relative",
      overflow: "hidden",
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 30%, transparent 50%, transparent 70%, rgba(255,255,255,0.03) 100%)",
      pointerEvents: "none"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 0,
      left: "10%",
      width: "80%",
      height: 1.5,
      background: `linear-gradient(90deg, transparent, ${C.cyan}40, transparent)`
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: C.cyan,
      textTransform: "uppercase",
      letterSpacing: "0.1em",
      fontWeight: 700,
      marginBottom: 3
    }
  }, "Opportunities for Improvement in Your Business"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Cormorant Garamond', serif",
      fontSize: 18,
      fontWeight: 700,
      color: C.text1
    }
  }, "Business Attractiveness & Readiness")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      overflow: "hidden",
      padding: "4px 14px",
      borderRadius: 8,
      background: `linear-gradient(135deg, ${C.green}15, ${C.green}08)`,
      border: `1px solid ${C.green}35`,
      boxShadow: `0 0 12px ${C.green}12`,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: "-50%",
      left: "-50%",
      right: "-50%",
      bottom: "-50%",
      pointerEvents: "none",
      background: `linear-gradient(120deg, transparent 0%, transparent 42%, ${C.green}12 48%, ${C.green}25 50%, ${C.green}12 52%, transparent 58%, transparent 100%)`,
      backgroundSize: "200% 200%",
      animation: "btnShimmerSlow 20s ease-in-out infinite"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      zIndex: 1,
      fontSize: 10,
      fontWeight: 700,
      color: C.green,
      letterSpacing: "0.08em"
    }
  }, "FREE"))), /*#__PURE__*/React.createElement("div", {
    id: "gd-score-dots",
    style: {
      display: "flex",
      gap: 4,
      marginBottom: 10
    }
  }, SCENARIOS.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    "data-dot": i,
    style: {
      flex: 1,
      height: 3,
      borderRadius: 2,
      background: i === 2 ? s.color : "rgba(255,255,255,0.06)",
      transition: "background 0.4s"
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 10,
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 8,
      fontWeight: 700,
      color: C.cyan,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      marginBottom: 4
    }
  }, "Business Attractiveness"), DIMS_A.map((d, j) => {
    const s = initSc.scores[j];
    const col = scCol(s);
    return /*#__PURE__*/React.createElement("div", {
      key: d,
      style: {
        display: "flex",
        alignItems: "center",
        gap: 4,
        marginBottom: 4
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 9,
        color: C.text3,
        width: 85,
        textAlign: "right",
        flexShrink: 0
      }
    }, d), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        height: 9,
        borderRadius: 5,
        background: "rgba(255,255,255,0.04)",
        overflow: "hidden",
        position: "relative"
      }
    }, /*#__PURE__*/React.createElement("div", {
      "data-bar-a": j,
      style: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        width: `${s / 6 * 100}%`,
        borderRadius: 5,
        background: `linear-gradient(180deg, ${col}30, ${col}15)`,
        border: `0.5px solid ${col}`,
        boxShadow: `0 0 6px ${col}20, inset 0 1px 0 ${col}15`,
        transition: "all 1s cubic-bezier(0.4,0,0.2,1)"
      }
    })), /*#__PURE__*/React.createElement("span", {
      "data-score-a": j,
      style: {
        fontSize: 10,
        fontWeight: 700,
        color: col,
        width: 14,
        textAlign: "center",
        transition: "color 1s"
      }
    }, s));
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 8,
      fontWeight: 700,
      color: C.gold,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      marginBottom: 4
    }
  }, "Business Readiness"), DIMS_R.map((d, j) => {
    const s = initSc.scores[j + 5];
    const col = scCol(s);
    return /*#__PURE__*/React.createElement("div", {
      key: d,
      style: {
        display: "flex",
        alignItems: "center",
        gap: 4,
        marginBottom: 4
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 9,
        color: C.text3,
        width: 85,
        textAlign: "right",
        flexShrink: 0
      }
    }, d), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        height: 9,
        borderRadius: 5,
        background: "rgba(255,255,255,0.04)",
        overflow: "hidden",
        position: "relative"
      }
    }, /*#__PURE__*/React.createElement("div", {
      "data-bar-r": j,
      style: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        width: `${s / 6 * 100}%`,
        borderRadius: 5,
        background: `linear-gradient(180deg, ${col}30, ${col}15)`,
        border: `0.5px solid ${col}`,
        boxShadow: `0 0 6px ${col}20, inset 0 1px 0 ${col}15`,
        transition: "all 1s cubic-bezier(0.4,0,0.2,1)"
      }
    })), /*#__PURE__*/React.createElement("span", {
      "data-score-r": j,
      style: {
        fontSize: 10,
        fontWeight: 700,
        color: col,
        width: 14,
        textAlign: "center",
        transition: "color 1s"
      }
    }, s));
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "8px 0 0",
      borderTop: "1px solid rgba(255,255,255,0.06)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 7,
      fontWeight: 700,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      color: C.text4
    }
  }, "Combined "), /*#__PURE__*/React.createElement("span", {
    id: "gd-total",
    style: {
      fontFamily: "'Cormorant Garamond', serif",
      fontSize: 22,
      fontWeight: 700,
      color: C.text1
    }
  }, initSc.total), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: C.text4
    }
  }, "/60")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    id: "gd-band-label",
    style: {
      fontSize: 10,
      fontWeight: 700,
      color: initSc.color,
      transition: "color 0.6s"
    }
  }, initSc.label), /*#__PURE__*/React.createElement("span", {
    id: "gd-band-pct",
    style: {
      fontFamily: "'Cormorant Garamond', serif",
      fontSize: 20,
      fontWeight: 700,
      color: initSc.color,
      transition: "color 0.6s"
    }
  }, initSc.pct, "%"))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 8,
      borderRadius: 4,
      background: "linear-gradient(90deg, #F87171, #FBBF24, #D4A63E, #22D3EE, #34D399)",
      overflow: "visible",
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    id: "gd-dot",
    style: {
      position: "absolute",
      top: -4,
      width: 16,
      height: 16,
      borderRadius: "50%",
      background: initSc.color,
      border: "2.5px solid white",
      boxShadow: `0 0 10px ${initSc.color}80`,
      left: `${initSc.pct}%`,
      transform: "translateX(-50%)",
      transition: "left 0.8s cubic-bezier(0.4,0,0.2,1), background 0.6s"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 3
    }
  }, BANDS.map((b, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    "data-band": i,
    style: {
      flex: 1,
      textAlign: "center",
      padding: "4px 2px",
      borderRadius: 4,
      background: i === 2 ? `${b.color}12` : "rgba(255,255,255,0.02)",
      border: `1px solid ${i === 2 ? b.color + "30" : "rgba(255,255,255,0.04)"}`,
      transition: "all 0.6s"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 8,
      fontWeight: 600,
      color: i === 2 ? b.color : C.text4,
      transition: "color 0.6s"
    }
  }, b.label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      fontWeight: 700,
      color: i === 2 ? b.color : C.text4,
      transition: "color 0.6s"
    }
  }, b.mult)))), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 8,
      color: C.text4,
      fontStyle: "italic",
      margin: 0,
      paddingTop: 6,
      lineHeight: 1.3,
      textAlign: "center"
    }
  }, "Multiple ranges vary by industry, revenue, growth rate, and risk profile. For educational and illustrative purposes only. Multiple ranges and valuations not guaranteed.")))), /*#__PURE__*/React.createElement("div", {
    id: "gd-gap-card",
    style: {
      padding: "14px 16px",
      borderRadius: 14,
      background: "linear-gradient(160deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 100%)",
      border: `1.5px solid ${C.gold}20`,
      boxShadow: `0 6px 30px rgba(0,0,0,0.25), 0 0 40px ${C.gold}05`,
      position: "relative",
      overflow: "hidden",
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 30%, transparent 50%, transparent 70%, rgba(255,255,255,0.03) 100%)",
      pointerEvents: "none"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 0,
      left: "10%",
      width: "80%",
      height: 1.5,
      background: `linear-gradient(90deg, transparent, ${C.gold}40, transparent)`
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: C.gold,
      textTransform: "uppercase",
      letterSpacing: "0.1em",
      fontWeight: 700,
      marginBottom: 3
    }
  }, "See The Gaps"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Cormorant Garamond', serif",
      fontSize: 18,
      fontWeight: 700,
      color: C.text1
    }
  }, "Profit & Value Gaps")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      overflow: "hidden",
      padding: "4px 14px",
      borderRadius: 8,
      background: `linear-gradient(135deg, ${C.green}15, ${C.green}08)`,
      border: `1px solid ${C.green}35`,
      boxShadow: `0 0 12px ${C.green}12`,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: "-50%",
      left: "-50%",
      right: "-50%",
      bottom: "-50%",
      pointerEvents: "none",
      background: `linear-gradient(120deg, transparent 0%, transparent 42%, ${C.green}12 48%, ${C.green}25 50%, ${C.green}12 52%, transparent 58%, transparent 100%)`,
      backgroundSize: "200% 200%",
      animation: "btnShimmerSlow 20s ease-in-out infinite"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      zIndex: 1,
      fontSize: 10,
      fontWeight: 700,
      color: C.green,
      letterSpacing: "0.08em"
    }
  }, "FREE"))), /*#__PURE__*/React.createElement("div", {
    id: "gd-gap-dots",
    style: {
      display: "flex",
      gap: 4,
      marginBottom: 10
    }
  }, [0, 1, 2, 3, 4].map(i => /*#__PURE__*/React.createElement("div", {
    key: i,
    "data-gapdot": i,
    style: {
      flex: 1,
      height: 3,
      borderRadius: 2,
      background: i === 1 ? C.gold : "rgba(255,255,255,0.06)",
      transition: "background 0.4s"
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      textAlign: "center",
      padding: "8px 6px",
      borderRadius: 8,
      background: `${C.amber}06`,
      border: `1px solid ${C.amber}12`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 7,
      fontWeight: 700,
      color: C.amber,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      marginBottom: 2
    }
  }, "Your EBITDA"), /*#__PURE__*/React.createElement("div", {
    id: "gd-ebitda",
    style: {
      fontFamily: "'Cormorant Garamond', serif",
      fontSize: 20,
      fontWeight: 700,
      color: C.text1
    }
  }, "$600K")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: C.gold,
    strokeWidth: "2",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "5",
    y1: "12",
    x2: "19",
    y2: "12"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "12 5 19 12 12 19"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      textAlign: "center",
      padding: "8px 6px",
      borderRadius: 8,
      background: `${C.green}06`,
      border: `1px solid ${C.green}12`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 7,
      fontWeight: 700,
      color: C.green,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      marginBottom: 2
    }
  }, "Best-In-Class"), /*#__PURE__*/React.createElement("div", {
    id: "gd-bic",
    style: {
      fontFamily: "'Cormorant Garamond', serif",
      fontSize: 20,
      fontWeight: 700,
      color: C.text1
    }
  }, "$960K"))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "10px 12px",
      borderRadius: 8,
      background: "rgba(255,255,255,0.02)",
      border: "1px solid rgba(255,255,255,0.06)",
      marginBottom: 10
    }
  }, [{
    label: "Current Value",
    id: "gd-curv",
    val: "$900K",
    color: C.red
  }, {
    label: "Potential Value",
    id: "gd-potv",
    val: "$5.8M",
    color: C.green
  }].map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      marginBottom: i === 0 ? 6 : 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 9,
      color: C.text2,
      width: 72,
      textAlign: "right",
      flexShrink: 0
    }
  }, r.label), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 12,
      borderRadius: 6,
      background: "rgba(255,255,255,0.04)",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    "data-valbar": i,
    style: {
      height: "100%",
      width: i === 0 ? "15%" : "85%",
      borderRadius: 6,
      background: `linear-gradient(180deg, ${r.color}30, ${r.color}15)`,
      border: `0.5px solid ${r.color}`,
      boxShadow: `0 0 8px ${r.color}20, inset 0 1px 0 ${r.color}15`,
      transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)"
    }
  })), /*#__PURE__*/React.createElement("span", {
    id: r.id,
    style: {
      fontFamily: "'Cormorant Garamond', serif",
      fontSize: 14,
      fontWeight: 700,
      color: r.color,
      width: 50,
      textAlign: "right"
    }
  }, r.val)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      textAlign: "center",
      padding: "8px 6px",
      borderRadius: 8,
      background: `${C.gold}06`,
      border: `1px solid ${C.gold}12`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 7,
      fontWeight: 700,
      color: C.gold,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      marginBottom: 2
    }
  }, "Value Gap"), /*#__PURE__*/React.createElement("div", {
    id: "gd-vgap",
    style: {
      fontFamily: "'Cormorant Garamond', serif",
      fontSize: 18,
      fontWeight: 700,
      color: C.gold,
      marginBottom: 3
    }
  }, "$4.9M"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 7,
      color: C.text3,
      lineHeight: 1.3,
      margin: 0
    }
  }, "The difference between what your business is worth today vs what it could be worth")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      textAlign: "center",
      padding: "8px 6px",
      borderRadius: 8,
      background: `${C.cyan}06`,
      border: `1px solid ${C.cyan}12`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 7,
      fontWeight: 700,
      color: C.cyan,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      marginBottom: 2
    }
  }, "Profit Gap"), /*#__PURE__*/React.createElement("div", {
    id: "gd-pgap",
    style: {
      fontFamily: "'Cormorant Garamond', serif",
      fontSize: 18,
      fontWeight: 700,
      color: C.cyan,
      marginBottom: 3
    }
  }, "$360K", /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10
    }
  }, "/yr")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 7,
      color: C.text3,
      lineHeight: 1.3,
      margin: 0
    }
  }, "How much profit you are leaving on the table each year compared to simply above average peers in your industry"))), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 8,
      color: C.text4,
      fontStyle: "italic",
      margin: 0,
      paddingTop: 6,
      lineHeight: 1.3,
      textAlign: "center"
    }
  }, "Illustrative examples for educational purposes only. Actual gaps depend on your business, industry, and execution. Results and valuations not guaranteed."))), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "https://kriczkyvirtus.com/tools",
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      display: "inline-flex",
      alignItems: "center",
      padding: "16px 48px",
      borderRadius: 12,
      textDecoration: "none",
      border: `1.5px solid ${C.gold}50`,
      color: C.gold,
      fontWeight: 700,
      fontSize: 15,
      letterSpacing: "0.02em",
      background: `linear-gradient(135deg, ${C.gold}18, ${C.gold}0a)`,
      boxShadow: `0 0 24px ${C.gold}20, 0 4px 12px rgba(0,0,0,0.3)`,
      fontFamily: "'DM Sans', sans-serif",
      position: "relative",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: "-50%",
      left: "-50%",
      right: "-50%",
      bottom: "-50%",
      pointerEvents: "none",
      background: `linear-gradient(120deg, transparent 0%, transparent 40%, ${C.gold}12 48%, ${C.gold}20 50%, ${C.gold}12 52%, transparent 60%, transparent 100%)`,
      backgroundSize: "200% 200%",
      animation: "btnShimmer 6s ease-in-out infinite"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      zIndex: 1
    }
  }, "Explore Free Tools")))), /*#__PURE__*/React.createElement("script", {
    dangerouslySetInnerHTML: {
      __html: `(function(){var S=[{scores:[2,3,2,3,3,2,3,2,3,3],label:"Not Sellable",color:"#F87171",pct:43,total:26},{scores:[3,4,2,3,3,3,2,3,4,3],label:"Discount",color:"#FBBF24",pct:50,total:30},{scores:[4,4,3,4,4,4,3,4,4,3],label:"Market",color:"#C8A24E",pct:62,total:37},{scores:[4,5,4,5,4,3,4,5,3,4],label:"Green Zone",color:"#22D3EE",pct:68,total:41},{scores:[5,5,5,5,5,5,4,5,5,4],label:"Best-In-Class",color:"#34D399",pct:80,total:48}];var G=[{rev:2000,mg:12,bic:22,lm:1.5,hm:5},{rev:4000,mg:15,bic:24,lm:3,hm:6},{rev:7500,mg:10,bic:20,lm:2,hm:5},{rev:3000,mg:8,bic:18,lm:1.5,hm:5.5},{rev:6000,mg:22,bic:30,lm:4,hm:8}];function sc(n){return n<=2?"#F87171":n<=3?"#FBBF24":n<=4?"#22D3EE":"#34D399"}function fmt(n){return Math.abs(n)>=1000?"$"+(n/1000).toFixed(1)+"M":"$"+Math.round(n)+"K"}var si=2,gi=1;var BC=["#F87171","#FBBF24","#C8A24E","#22D3EE","#34D399"];function uS(){si=(si+1)%5;var s=S[si];for(var j=0;j<5;j++){var bA=document.querySelector('[data-bar-a="'+j+'"]'),sA=document.querySelector('[data-score-a="'+j+'"]'),bR=document.querySelector('[data-bar-r="'+j+'"]'),sR=document.querySelector('[data-score-r="'+j+'"]');if(bA){var c=sc(s.scores[j]);bA.style.width=(s.scores[j]/6*100)+"%";bA.style.background="linear-gradient(180deg,"+c+"30,"+c+"15)";bA.style.border="0.5px solid "+c;bA.style.boxShadow="0 0 6px "+c+"20, inset 0 1px 0 "+c+"15";}if(sA){sA.textContent=s.scores[j];sA.style.color=sc(s.scores[j]);}if(bR){var c2=sc(s.scores[j+5]);bR.style.width=(s.scores[j+5]/6*100)+"%";bR.style.background="linear-gradient(180deg,"+c2+"30,"+c2+"15)";bR.style.border="0.5px solid "+c2;bR.style.boxShadow="0 0 6px "+c2+"20, inset 0 1px 0 "+c2+"15";}if(sR){sR.textContent=s.scores[j+5];sR.style.color=sc(s.scores[j+5]);}}var t=document.getElementById("gd-total");if(t)t.textContent=s.total;var bl=document.getElementById("gd-band-label");if(bl){bl.textContent=s.label;bl.style.color=s.color;}var bp=document.getElementById("gd-band-pct");if(bp){bp.textContent=s.pct+"%";bp.style.color=s.color;}var dot=document.getElementById("gd-dot");if(dot){dot.style.left=s.pct+"%";dot.style.background=s.color;dot.style.boxShadow="0 0 10px "+s.color+"80";}document.querySelectorAll('[data-dot]').forEach(function(d){d.style.background=parseInt(d.getAttribute('data-dot'))===si?S[si].color:"rgba(255,255,255,0.06)";});document.querySelectorAll('[data-band]').forEach(function(d){var i=parseInt(d.getAttribute('data-band'));var b=S[i]||S[0];var active=i===si;d.style.background=active?b.color+"12":"rgba(255,255,255,0.02)";d.style.borderColor=active?b.color+"30":"rgba(255,255,255,0.04)";d.querySelectorAll('div').forEach(function(t){t.style.color=active?b.color:"#5A6474";});});}function uG(){gi=(gi+1)%5;var g=G[gi];var eb=g.rev*(g.mg/100),bi=g.rev*(g.bic/100),cv=eb*g.lm,pv=bi*g.hm,mx=Math.max(pv,cv)*1.15;var e;e=document.getElementById("gd-ebitda");if(e)e.textContent=fmt(eb);e=document.getElementById("gd-bic");if(e)e.textContent=fmt(bi);e=document.getElementById("gd-curv");if(e)e.textContent=fmt(cv);e=document.getElementById("gd-potv");if(e)e.textContent=fmt(pv);e=document.getElementById("gd-vgap");if(e)e.textContent=fmt(pv-cv);var pg=document.getElementById("gd-pgap");if(pg)pg.innerHTML=fmt(bi-eb)+'<span style="font-size:10px">/yr</span>';var bars=document.querySelectorAll('[data-valbar]');var mx=pv*1.08;bars.forEach(function(b){var i=parseInt(b.getAttribute('data-valbar'));var v=i===0?cv:pv;b.style.width=Math.max((v/mx)*100,3)+"%";});document.querySelectorAll('[data-gapdot]').forEach(function(d){d.style.background=parseInt(d.getAttribute('data-gapdot'))===gi?"#C8A24E":"rgba(255,255,255,0.06)";});}setInterval(uS,4500);setInterval(uG,5200);})();`
    }
  }));
};
const PageIntensiveOffer = ({
  constraint,
  recipientName
}) => {
  const SI = STRATEGIC_INTENSIVE_COPY;
  const checkItems = [{
    bold: "Business Valuation Estimate",
    desc: "for your business based on the same methodology used in over 10,000 business valuations over 40+ years"
  }, {
    bold: "Your business scored across 5 key value drivers",
    desc: "quantified, not guessing"
  }, {
    bold: "Profit Gap and Value Gap analysis",
    desc: "the profit you might be leaving on the table each year vs your business if it were above average, and the amount missing from your net-worth because of these gaps"
  }, {
    bold: "Scenario modeling",
    desc: "see what fixing specific constraints does to your projected valuation"
  }, {
    bold: "Written 90-day action plan",
    desc: "prioritized by ROI potential, with specific next steps for the first 30 days"
  }];
  return /*#__PURE__*/React.createElement(Page, null, /*#__PURE__*/React.createElement(PageChrome, {
    constraintName: constraint.name,
    recipientName: recipientName,
    pageNum: 10,
    totalPages: 14,
    accentColor: C.gold
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0.95in 0.7in 0.85in"
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    color: C.gold
  }, "The Gaps"), /*#__PURE__*/React.createElement(H, {
    size: 24,
    style: {
      marginBottom: 14,
      lineHeight: 1.25,
      letterSpacing: "-0.015em"
    }
  }, "The Deliverable \u2014 Valuation Driver Intensive"), /*#__PURE__*/React.createElement(P, {
    size: 11,
    color: C.text2,
    style: {
      marginBottom: 20,
      maxWidth: "5.4in"
    }
  }, "That gap between what your business is worth today and what it could be worth exists whether or not we work together. The only question is whether you can see it clearly enough to close it. ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: C.gold,
      fontWeight: 600
    }
  }, "Personalize every number specifically to your revenue, your margins, and your multiples \u2014 benchmarked against best-in-class peers in your industry.")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "16px 20px",
      background: "rgba(255,255,255,0.02)",
      border: `1px solid ${C.border1}`,
      borderRadius: 10,
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    color: C.text3
  }, "What's included"), checkItems.map((item, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      gap: 10,
      marginBottom: i === checkItems.length - 1 ? 0 : 8,
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flexShrink: 0,
      marginTop: 3
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check-circle",
    color: C.gold,
    size: 13,
    strokeWidth: 1.8
  })), /*#__PURE__*/React.createElement(P, {
    size: 10.5,
    color: C.text1
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600
    }
  }, item.bold), " — ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: C.text3
    }
  }, item.desc))))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "20px 24px",
      background: `linear-gradient(135deg, ${C.gold}12, ${C.gold}04)`,
      border: `1.5px solid ${C.gold}40`,
      borderRadius: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "zap",
    color: C.gold,
    size: 20
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: C.gold
    }
  }, "See if you qualify")), /*#__PURE__*/React.createElement(H, {
    size: 18,
    style: {
      marginBottom: 8
    }
  }, "Everything starts with a Free Working Session."), /*#__PURE__*/React.createElement(P, {
    size: 10,
    color: C.text2,
    style: {
      marginBottom: 12,
      maxWidth: "5in"
    }
  }, "Before we talk about the Intensive, I need to understand your business. In the working session we'll review your Constraint Roadmap results together, walk through the specific gaps in your numbers, and determine whether the Valuation Driver Intensive is the right fit."), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "https://www.kriczkyvirtus.com/roadmap-session",
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "14px 36px",
      borderRadius: 12,
      textDecoration: "none",
      border: `1.5px solid ${C.gold}50`,
      color: C.gold,
      fontWeight: 700,
      fontSize: 13,
      letterSpacing: "0.02em",
      background: `linear-gradient(135deg, ${C.gold}18, ${C.gold}0a)`,
      boxShadow: `0 0 20px ${C.gold}20, 0 4px 12px rgba(0,0,0,0.3)`,
      fontFamily: "'DM Sans', sans-serif",
      position: "relative",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: "-50%",
      left: "-50%",
      right: "-50%",
      bottom: "-50%",
      pointerEvents: "none",
      background: `linear-gradient(120deg, transparent 0%, transparent 40%, ${C.gold}12 48%, ${C.gold}20 50%, ${C.gold}12 52%, transparent 60%, transparent 100%)`,
      backgroundSize: "200% 200%",
      animation: "btnShimmer 6s ease-in-out infinite"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      zIndex: 1
    }
  }, "Book Free Working Session"))), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 10,
      color: C.text2,
      textAlign: "center",
      margin: "6px 0 0",
      fontWeight: 600
    }
  }, "we only have 2 slots per week open for these calls currently"))));
};

// PageCommunity removed — community not launched

const CUSTOM_CONSTRAINT_TEASERS = {
  profitability: "Your business is generating real revenue but the margins aren’t where they should be for your size.",
  cash_flow: "Your business is profitable on paper but you can’t fund the things you know it needs for growth.",
  revenue_quality: "You can’t make confident strategic decisions because too much of your revenue is either non-recurring or it mostly depends on a couple large clients.",
  owner_dependency: "You’ve built a team but the business still routes through you, decisions wait for you, and clients ask for you.",
  operational_efficiency: "Your costs grow faster than your revenue and nobody on the team owns the numbers to help force profitable growth.",
  scalability: "You want to grow but the business can’t scale without breaking — the systems, people, and processes that got you here won’t get you to the next level."
};
const PageAppendixOthers = ({
  constraint,
  constraintId,
  recipientName,
  revenueTier,
  pageNum = 13
}) => {
  const others = CATEGORY_ORDER.filter(c => c.id !== constraintId);
  return /*#__PURE__*/React.createElement(Page, null, /*#__PURE__*/React.createElement(PageChrome, {
    constraintName: constraint.name,
    recipientName: recipientName,
    pageNum: pageNum,
    totalPages: 14,
    accentColor: C.gold
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0.95in 0.7in 0.85in"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "list",
    color: C.gold,
    size: 24
  }), /*#__PURE__*/React.createElement(Eyebrow, {
    color: C.gold,
    style: {
      marginBottom: 0
    }
  }, "Appendix \xB7 The other five constraints")), /*#__PURE__*/React.createElement(H, {
    size: 26,
    style: {
      marginBottom: 10,
      letterSpacing: "-0.015em"
    }
  }, "What's coming after this one."), /*#__PURE__*/React.createElement(P, {
    size: 10.5,
    color: C.text2,
    style: {
      marginBottom: 14,
      maxWidth: "5.4in"
    }
  }, "Constraints don't disappear when you fix them. They re-rank. Once ", constraint.name.toLowerCase(), " is no longer the bottleneck, one of these five takes over."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 14,
      padding: "8px 8px 4px",
      background: "rgba(255,255,255,0.02)",
      border: `1px solid ${C.border1}`,
      borderRadius: 10,
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 8,
      left: 14,
      fontSize: 8,
      fontWeight: 700,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: constraint.color
    }
  }, "You are here: ", constraint.name), /*#__PURE__*/React.createElement(ConstraintHexMap, {
    currentId: constraintId
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, others.map(c => {
    const data = CONSTRAINTS[c.id];
    const tierData = data?.byTier ? data.byTier[revenueTier] || data.byTier.scaling : data;
    const teaser = tierData?.summary ? String(tierData.summary).split(/\n\n+/)[0] : "";
    const shortTeaser = teaser.length > 110 ? teaser.slice(0, 107).trim() + "…" : teaser;
    const customTeaser = CUSTOM_CONSTRAINT_TEASERS[c.id] || shortTeaser;
    return /*#__PURE__*/React.createElement("div", {
      key: c.id,
      style: {
        display: "flex",
        gap: 12,
        alignItems: "flex-start",
        padding: "10px 14px",
        background: "rgba(255,255,255,0.02)",
        border: `1px solid ${C.border1}`,
        borderRadius: 6
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flexShrink: 0,
        paddingTop: 2
      }
    }, /*#__PURE__*/React.createElement(ConstraintIcon, {
      id: c.id,
      color: CATEGORY_COLOR[c.id],
      size: 18,
      strokeWidth: 1.5
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 10,
        fontWeight: 600,
        color: CATEGORY_COLOR[c.id],
        marginBottom: 2,
        letterSpacing: "0.02em"
      }
    }, c.label), /*#__PURE__*/React.createElement(P, {
      size: 9.5,
      color: C.text2,
      style: {
        lineHeight: 1.45
      }
    }, customTeaser)));
  }))));
};
const PageAppendixMethodology = ({
  constraint,
  recipientName
}) => {
  const categories = [{
    id: "profitability",
    weight: 22,
    desc: "Gross margin, net margin, contribution margin per unit."
  }, {
    id: "cash_flow",
    weight: 20,
    desc: "Cash conversion cycle, runway, weeks of operating reserves."
  }, {
    id: "revenue_quality",
    weight: 18,
    desc: "Customer concentration, recurring revenue mix, LTV-to-CAC."
  }, {
    id: "owner_dependency",
    weight: 16,
    desc: "Founder hours per week, decision routing, key relationship ownership."
  }, {
    id: "operational_efficiency",
    weight: 14,
    desc: "Revenue per employee, throughput, system maturity."
  }, {
    id: "scalability",
    weight: 10,
    desc: "Process maturity, team capability, infrastructure readiness for next stage."
  }];
  return /*#__PURE__*/React.createElement(Page, null, /*#__PURE__*/React.createElement(PageChrome, {
    constraintName: constraint.name,
    recipientName: recipientName,
    pageNum: 12,
    totalPages: 14,
    accentColor: C.gold
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0.95in 0.7in 0.85in"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "zap",
    color: C.gold,
    size: 24
  }), /*#__PURE__*/React.createElement(Eyebrow, {
    color: C.gold,
    style: {
      marginBottom: 0
    }
  }, "Appendix \xB7 Methodology")), /*#__PURE__*/React.createElement(H, {
    size: 28,
    style: {
      marginBottom: 12,
      letterSpacing: "-0.015em"
    }
  }, "How your score is calculated."), /*#__PURE__*/React.createElement(P, {
    size: 11,
    color: C.text2,
    style: {
      marginBottom: 22,
      maxWidth: "5.4in"
    }
  }, "Your overall health score is a weighted composite of six category scores."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, categories.map(c => {
    const meta = CATEGORY_ORDER.find(x => x.id === c.id);
    return /*#__PURE__*/React.createElement("div", {
      key: c.id,
      style: {
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "12px 16px",
        background: "rgba(255,255,255,0.02)",
        border: `1px solid ${C.border1}`,
        borderRadius: 8
      }
    }, /*#__PURE__*/React.createElement(ConstraintIcon, {
      id: c.id,
      color: CATEGORY_COLOR[c.id],
      size: 20,
      strokeWidth: 1.5
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        width: "1.4in",
        flexShrink: 0,
        fontSize: 10.5,
        fontWeight: 600,
        color: C.text1
      }
    }, meta.label), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 50,
        flexShrink: 0,
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 18,
        color: CATEGORY_COLOR[c.id],
        fontWeight: 500
      }
    }, c.weight, "%"), /*#__PURE__*/React.createElement(P, {
      size: 9.5,
      color: C.text2,
      style: {
        flex: 1
      }
    }, c.desc));
  }))));
};
const PageAppendixGlossary = ({
  constraint,
  recipientName
}) => /*#__PURE__*/React.createElement(Page, null, /*#__PURE__*/React.createElement(PageChrome, {
  constraintName: constraint.name,
  recipientName: recipientName,
  pageNum: 15,
  totalPages: 14,
  accentColor: C.gold
}), /*#__PURE__*/React.createElement("div", {
  style: {
    padding: "0.95in 0.7in 0.85in"
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 14
  }
}, /*#__PURE__*/React.createElement(Icon, {
  name: "book-open",
  color: C.gold,
  size: 24
}), /*#__PURE__*/React.createElement(Eyebrow, {
  color: C.gold,
  style: {
    marginBottom: 0
  }
}, "Appendix \xB7 Glossary")), /*#__PURE__*/React.createElement(H, {
  size: 28,
  style: {
    marginBottom: 22,
    letterSpacing: "-0.015em"
  }
}, "Terms used in this report."), /*#__PURE__*/React.createElement("div", {
  style: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "14px 22px"
  }
}, GLOSSARY.map((g, i) => /*#__PURE__*/React.createElement("div", {
  key: i,
  style: {
    paddingBottom: 12,
    borderBottom: `1px solid ${C.border1}`
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 14,
    color: C.gold,
    fontWeight: 500,
    marginBottom: 4,
    letterSpacing: "-0.01em"
  }
}, g.term), /*#__PURE__*/React.createElement(P, {
  size: 10,
  color: C.text2
}, g.def))))));
const PageClosing = ({
  constraint,
  recipientName
}) => /*#__PURE__*/React.createElement(Page, {
  bg: C.bgDeep
}, /*#__PURE__*/React.createElement("div", {
  style: {
    position: "absolute",
    top: "-30%",
    right: "-20%",
    width: "100%",
    height: "70%",
    background: `radial-gradient(ellipse at center, ${C.gold}1f 0%, transparent 60%)`,
    pointerEvents: "none"
  }
}), /*#__PURE__*/React.createElement("div", {
  style: {
    position: "absolute",
    inset: 0,
    padding: "0.85in 0.85in 0.6in",
    display: "flex",
    flexDirection: "column"
  }
}, /*#__PURE__*/React.createElement(H, {
  size: 36,
  style: {
    marginBottom: 20,
    lineHeight: 1.1
  }
}, "Your business is your ", /*#__PURE__*/React.createElement("span", {
  style: {
    color: C.gold,
    fontStyle: "italic"
  }
}, "legacy"), "."), /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    gap: 18,
    marginBottom: 20,
    alignItems: "flex-start"
  }
}, /*#__PURE__*/React.createElement("img", {
  src: HEADSHOT,
  alt: "Edward Kriczky",
  style: {
    width: 64,
    height: 64,
    borderRadius: "50%",
    objectFit: "cover",
    border: `2px solid ${C.gold}40`,
    flexShrink: 0
  }
}), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
  style: {
    fontSize: 14,
    fontWeight: 700,
    color: C.text1
  }
}, "Edward Kriczky, CEPA"), /*#__PURE__*/React.createElement("div", {
  style: {
    fontSize: 10,
    color: C.gold,
    marginBottom: 6
  }
}, "Founder, Kriczky Virtus"), /*#__PURE__*/React.createElement(P, {
  size: 10,
  color: C.text2,
  style: {
    lineHeight: 1.55
  }
}, "I help business owners in the $1M\u2013$10M range turn their businesses into assets that generate wealth \u2014 whether they\u2019re building to sell, building to keep, or building to hand down. As a Certified Exit Planning Advisor, I bring a structured methodology to the question every owner eventually asks: ", /*#__PURE__*/React.createElement("span", {
  style: {
    fontStyle: "italic",
    color: C.text1
  }
}, "\u201CWhat is my business actually worth, and what would it take to make it worth more?\u201D")))), /*#__PURE__*/React.createElement("div", {
  style: {
    padding: "16px 20px",
    background: "rgba(255,255,255,0.02)",
    border: `1px solid ${C.border1}`,
    borderRadius: 12,
    marginBottom: 16
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 20,
    fontWeight: 500,
    color: C.text1,
    marginBottom: 14
  }
}, "What happens next."), /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    alignItems: "flex-start"
  }
}, [{
  label: "WEEK 1",
  title: "Valuation Driver Intensive",
  desc: "We define your Profit Gap, Value Gap, and build your prioritized action plan.",
  color: C.gold,
  icon: "calendar"
}, {
  label: "MONTHS 1–3",
  title: "Sprint 1 Execution",
  desc: "Monthly working sessions. I’m in the room for every decision, delegation, and process build.",
  color: C.gold,
  icon: "users"
}, {
  label: "DAY 90",
  title: "Re-Score & Adapt",
  desc: "Fresh diagnostic with updated numbers. See what moved. The roadmap adapts. We keep going.",
  color: C.green,
  icon: "target"
}].map((step, si, arr) => /*#__PURE__*/React.createElement("div", {
  key: si,
  style: {
    display: "flex",
    alignItems: "flex-start",
    flex: si < arr.length - 1 ? 1 : undefined
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    border: `1.5px solid ${step.color}50`,
    background: `${step.color}08`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: `0 0 8px ${step.color}18`
  }
}, /*#__PURE__*/React.createElement("svg", {
  width: "16",
  height: "16",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: step.color,
  strokeWidth: "1.5",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, si === 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
  x: "3",
  y: "4",
  width: "18",
  height: "18",
  rx: "2",
  ry: "2"
}), /*#__PURE__*/React.createElement("line", {
  x1: "16",
  y1: "2",
  x2: "16",
  y2: "6"
}), /*#__PURE__*/React.createElement("line", {
  x1: "8",
  y1: "2",
  x2: "8",
  y2: "6"
}), /*#__PURE__*/React.createElement("line", {
  x1: "3",
  y1: "10",
  x2: "21",
  y2: "10"
})), si === 1 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
  d: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"
}), /*#__PURE__*/React.createElement("circle", {
  cx: "9",
  cy: "7",
  r: "4"
}), /*#__PURE__*/React.createElement("path", {
  d: "M23 21v-2a4 4 0 00-3-3.87"
}), /*#__PURE__*/React.createElement("path", {
  d: "M16 3.13a4 4 0 010 7.75"
})), si === 2 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
  cx: "12",
  cy: "12",
  r: "10"
}), /*#__PURE__*/React.createElement("circle", {
  cx: "12",
  cy: "12",
  r: "6"
}), /*#__PURE__*/React.createElement("circle", {
  cx: "12",
  cy: "12",
  r: "2"
})))), /*#__PURE__*/React.createElement("span", {
  style: {
    fontSize: 7,
    fontWeight: 700,
    letterSpacing: "0.08em",
    color: step.color,
    marginTop: 4
  }
}, step.label), /*#__PURE__*/React.createElement("span", {
  style: {
    fontSize: 9,
    fontWeight: 600,
    color: C.text1,
    marginTop: 2,
    textAlign: "center"
  }
}, step.title), /*#__PURE__*/React.createElement("span", {
  style: {
    fontSize: 8,
    color: C.text2,
    lineHeight: 1.4,
    textAlign: "center",
    marginTop: 2,
    maxWidth: 130
  }
}, step.desc)), si < arr.length - 1 && /*#__PURE__*/React.createElement("div", {
  style: {
    flex: 1,
    height: 1.5,
    marginTop: 18,
    background: `${C.gold}40`
  }
}))))), /*#__PURE__*/React.createElement("div", {
  style: {
    textAlign: "center",
    marginBottom: 14
  }
}, /*#__PURE__*/React.createElement("a", {
  href: "https://www.kriczkyvirtus.com/roadmap-session",
  target: "_blank",
  rel: "noopener noreferrer",
  style: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "14px 36px",
    borderRadius: 12,
    textDecoration: "none",
    border: `1.5px solid ${C.gold}50`,
    color: C.gold,
    fontWeight: 700,
    fontSize: 14,
    letterSpacing: "0.02em",
    background: `linear-gradient(135deg, ${C.gold}18, ${C.gold}0a)`,
    boxShadow: `0 0 20px ${C.gold}20, 0 4px 12px rgba(0,0,0,0.3)`,
    fontFamily: "'DM Sans', sans-serif",
    position: "relative",
    overflow: "hidden"
  }
}, /*#__PURE__*/React.createElement("span", {
  style: {
    position: "absolute",
    top: "-50%",
    left: "-50%",
    right: "-50%",
    bottom: "-50%",
    pointerEvents: "none",
    background: `linear-gradient(120deg, transparent 0%, transparent 40%, ${C.gold}12 48%, ${C.gold}20 50%, ${C.gold}12 52%, transparent 60%, transparent 100%)`,
    backgroundSize: "200% 200%",
    animation: "btnShimmer 6s ease-in-out infinite"
  }
}), /*#__PURE__*/React.createElement("span", {
  style: {
    position: "relative",
    zIndex: 1
  }
}, "BOOK YOUR FREE CALL"))), /*#__PURE__*/React.createElement("div", {
  style: {
    padding: "14px 0 14px 18px",
    borderLeft: `3px solid ${C.gold}60`,
    marginBottom: 14
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 16,
    fontStyle: "italic",
    lineHeight: 1.55,
    color: C.text1
  }
}, "The value of your business isn\u2019t determined by what you\u2019ve built \u2014 it\u2019s the willingness to see what a buyer sees, ruthlessly execute in 90-day sprints to close the gaps they would find (and stay accountable to do so), and build something that could thrive and grow without you \u2014 whether you want to sell or hold forever.")), /*#__PURE__*/React.createElement("div", {
  style: {
    height: 1,
    background: `linear-gradient(90deg, transparent, ${C.text4}60, transparent)`,
    marginBottom: 14
  }
}), /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: "auto"
  }
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    marginBottom: 4
  }
}, /*#__PURE__*/React.createElement("svg", {
  width: "12",
  height: "12",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: C.text3,
  strokeWidth: "1.5"
}, /*#__PURE__*/React.createElement("rect", {
  x: "2",
  y: "4",
  width: "20",
  height: "16",
  rx: "2"
}), /*#__PURE__*/React.createElement("path", {
  d: "M22 7l-10 7L2 7"
})), /*#__PURE__*/React.createElement("span", {
  style: {
    fontSize: 10,
    color: C.text3
  }
}, "ekriczky@kriczkyvirtus.com")), /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    alignItems: "center",
    gap: 6
  }
}, /*#__PURE__*/React.createElement("svg", {
  width: "12",
  height: "12",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: C.text3,
  strokeWidth: "1.5"
}, /*#__PURE__*/React.createElement("circle", {
  cx: "12",
  cy: "12",
  r: "10"
}), /*#__PURE__*/React.createElement("line", {
  x1: "2",
  y1: "12",
  x2: "22",
  y2: "12"
}), /*#__PURE__*/React.createElement("path", {
  d: "M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"
})), /*#__PURE__*/React.createElement("span", {
  style: {
    fontSize: 10,
    color: C.text3
  }
}, "kriczkyvirtus.com"))), /*#__PURE__*/React.createElement("svg", {
  width: "32",
  height: "32",
  viewBox: "0 0 64 64",
  fill: "none",
  style: {
    filter: "drop-shadow(0 0 12px rgba(200,162,78,0.38)) drop-shadow(0 0 4px rgba(200,162,78,0.56))"
  }
}, /*#__PURE__*/React.createElement("path", {
  d: "M32 8L14 16V30C14 42 22 52 32 56C42 52 50 42 50 30V16L32 8Z",
  fill: "none",
  stroke: "#C8A24E",
  strokeWidth: "2.5",
  strokeLinejoin: "round"
}), /*#__PURE__*/React.createElement("path", {
  d: "M32 12L18 18.5V30C18 40.5 24.5 49 32 52C39.5 49 46 40.5 46 30V18.5L32 12Z",
  fill: "rgba(200,162,78,0.06)"
}), /*#__PURE__*/React.createElement("path", {
  d: "M25 32L29.5 36.5L40 26",
  stroke: "#C8A24E",
  strokeWidth: "3",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}))), /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    fontSize: 9,
    color: C.text3,
    letterSpacing: "0.12em",
    textTransform: "uppercase"
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 10,
    letterSpacing: "0.16em",
    textTransform: "uppercase"
  }
}, /*#__PURE__*/React.createElement("span", {
  style: {
    color: C.gold,
    fontWeight: 700
  }
}, "Kriczky"), " ", /*#__PURE__*/React.createElement("span", {
  style: {
    color: C.text3
  }
}, "Virtus")), /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 14,
    letterSpacing: "0.02em",
    textTransform: "none",
    color: C.text2
  }
}, "14 / 14"))));

// ─── V4: PERSONALIZED CHECKLIST DATA ────────────────────────────────
// Per constraint × per revenue tier. Each entry has:
//   - items: 6-8 checkbox items that combine the 3 immediate actions
//     from this constraint with forward-looking items about what
//     comes next as the constraint resolves and the next one surfaces.
//   - nextConstraint: the constraint most likely to surface once the
//     current one is addressed (used for the "what's next" framing).
//
// In production these should live in constraints.js. For the prototype,
// hardcoded here with placeholder content for non-scaling tiers.
const CHECKLIST_ITEMS = {
  profitability: {
    survival: {
      nextConstraint: "Cash Flow",
      items: [{
        label: "Run a margin audit on your top 5 offerings",
        category: "this week",
        done: false
      }, {
        label: "Identify which product or service line loses money",
        category: "this week",
        done: false
      }, {
        label: "Raise prices or cut scope on the lowest-margin work",
        category: "this week",
        done: false
      }, {
        label: "Set a monthly margin review meeting with yourself",
        category: "month 2",
        done: false
      }, {
        label: "Build a per-project cost tracking habit (even rough)",
        category: "month 2",
        done: false
      }, {
        label: "Revisit pricing every month — not every crisis",
        category: "month 3",
        done: false
      }, {
        label: "Watch for cash flow pressure once margin improves (it shifts)",
        category: "looking ahead",
        done: false
      }, {
        label: "Re-take the assessment after 90 days to see what moved",
        category: "looking ahead",
        done: false
      }]
    },
    stabilize: {
      nextConstraint: "Cash Flow",
      items: [{
        label: "Run a margin audit on your top 5 offerings/clients",
        category: "this week",
        done: false
      }, {
        label: "Identify which product or service line loses money",
        category: "this week",
        done: false
      }, {
        label: "Raise prices or cut scope on the lowest-margin work",
        category: "this week",
        done: false
      }, {
        label: "Set a monthly margin review meeting with yourself",
        category: "month 2",
        done: false
      }, {
        label: "Build a per-project cost tracking habit (even rough)",
        category: "month 2",
        done: false
      }, {
        label: "Revisit pricing every month — not every crisis",
        category: "month 3",
        done: false
      }, {
        label: "Watch for cash flow pressure once margin improves (it shifts)",
        category: "looking ahead",
        done: false
      }, {
        label: "Re-take the assessment after 90 days to see what moved",
        category: "looking ahead",
        done: false
      }]
    },
    growth: {
      nextConstraint: "Cash Flow",
      items: [{
        label: "Build a per-client and per-service-line profitability view",
        category: "this week",
        done: false
      }, {
        label: "Identify the top 3 margin leaks with your finance team and assign owners to fix them",
        category: "this week",
        done: false
      }, {
        label: "Reprice new clients 20% higher, starting today",
        category: "this week",
        done: false
      }, {
        label: "Implement monthly margin review with your leadership team",
        category: "month 2",
        done: false
      }, {
        label: "Build a compensation model that aligns incentives with the profit of your business growing (multipliers, not just doers)",
        category: "month 2",
        done: false
      }, {
        label: "Sunset or restructure your lowest-margin service lines",
        category: "month 3",
        done: false
      }, {
        label: "Watch for cash flow timing issues as you restructure pricing",
        category: "looking ahead",
        done: false
      }, {
        label: "Re-take the assessment after 90 days to see what moved",
        category: "looking ahead",
        done: false
      }]
    },
    optimize: {
      nextConstraint: "Cash Flow",
      items: [{
        label: "Commission a full margin-by-segment analysis (service line, client tier, team)",
        category: "this week",
        done: false
      }, {
        label: "Identify which segments generate minimal or negative margin",
        category: "this week",
        done: false
      }, {
        label: "Renegotiate or restructure your top 3 non-payroll cost categories",
        category: "this week",
        done: false
      }, {
        label: "Pay your management team on gross margin, not revenue growth",
        category: "month 2",
        done: false
      }, {
        label: "Assign P&L ownership to each department or business unit leader",
        category: "month 2",
        done: false
      }, {
        label: "Build a pricing committee that reviews rates quarterly",
        category: "month 3",
        done: false
      }, {
        label: "Watch for cash flow conversion gaps as margin improves",
        category: "looking ahead",
        done: false
      }, {
        label: "Re-take the assessment after 90 days to see what moved",
        category: "looking ahead",
        done: false
      }]
    },
    scaling: {
      nextConstraint: "Cash Flow",
      items: [{
        label: "Commission a margin-by-segment analysis across all business units",
        category: "this week",
        done: false
      }, {
        label: "Restructure your top 3 cost categories — leverage your scale for better terms",
        category: "this week",
        done: false
      }, {
        label: "Audit pricing model against the value you deliver at your current capability level",
        category: "this week",
        done: false
      }, {
        label: "Implement rolling 13-week cash and margin forecasting",
        category: "month 2",
        done: false
      }, {
        label: "Build financial visibility at the engagement level, not just entity level",
        category: "month 2",
        done: false
      }, {
        label: "Set margin targets by segment and review monthly with operating leaders",
        category: "month 3",
        done: false
      }, {
        label: "Watch for cash conversion gaps as margin discipline tightens",
        category: "looking ahead",
        done: false
      }, {
        label: "Re-take the assessment after 90 days to see what moved",
        category: "looking ahead",
        done: false
      }]
    }
  },
  cash_flow: {
    survival: {
      nextConstraint: "Operational Efficiency",
      items: [{
        label: "Calculate how many days it takes to collect from your top 5 customers",
        category: "this week",
        done: false
      }, {
        label: "Send every overdue invoice a follow-up today",
        category: "this week",
        done: false
      }, {
        label: "Set payment terms on all new proposals (Net 15 or deposit required)",
        category: "this week",
        done: false
      }, {
        label: "Build a 13-week cash flow forecast (even on a napkin)",
        category: "month 2",
        done: false
      }, {
        label: "Negotiate extended payment terms with your top 2 suppliers",
        category: "month 2",
        done: false
      }, {
        label: "Automate invoice reminders so you stop chasing manually",
        category: "month 3",
        done: false
      }, {
        label: "Watch for operational bottlenecks once cash frees up",
        category: "looking ahead",
        done: false
      }, {
        label: "Re-take the assessment after 90 days to see what moved",
        category: "looking ahead",
        done: false
      }]
    },
    stabilize: {
      nextConstraint: "Operational Efficiency",
      items: [{
        label: "Build a 13-week cash forecast and update it every Friday",
        category: "this week",
        done: false
      }, {
        label: "Put one person in charge of getting paid — you, for now",
        category: "this week",
        done: false
      }, {
        label: "Send every overdue invoice a follow-up today",
        category: "this week",
        done: false
      }, {
        label: "Pay yourself a fixed salary — stop the variable draws",
        category: "month 2",
        done: false
      }, {
        label: "Negotiate extended payment terms with your top 2 suppliers",
        category: "month 2",
        done: false
      }, {
        label: "Automate invoice reminders so you stop chasing manually",
        category: "month 3",
        done: false
      }, {
        label: "Watch for operational bottlenecks once cash frees up",
        category: "looking ahead",
        done: false
      }, {
        label: "Re-take the assessment after 90 days to see what moved",
        category: "looking ahead",
        done: false
      }]
    },
    growth: {
      nextConstraint: "Scalability",
      items: [{
        label: "Build a 13-week cash forecast with your controller or fractional-CFO",
        category: "this week",
        done: false
      }, {
        label: "Audit your top 10 clients' payment terms — identify who's paying late",
        category: "this week",
        done: false
      }, {
        label: "Get your cash conversion cycle on one page",
        category: "this week",
        done: false
      }, {
        label: "Set up automated collections tracking and escalation",
        category: "month 2",
        done: false
      }, {
        label: "Separate operating cash from growth cash",
        category: "month 2",
        done: false
      }, {
        label: "Establish a formal capital allocation framework for investments",
        category: "month 3",
        done: false
      }, {
        label: "Watch for scalability once cash frees up for investment",
        category: "looking ahead",
        done: false
      }, {
        label: "Re-take the assessment after 90 days to see what moved",
        category: "looking ahead",
        done: false
      }]
    },
    optimize: {
      nextConstraint: "Operational Efficiency",
      items: [{
        label: "Map your complete cash conversion cycle — from marketing all the way through client fulfillment; how long until breakeven?",
        category: "this week",
        done: false
      }, {
        label: "Refinance any debts against your current balance sheet",
        category: "this week",
        done: false
      }, {
        label: "Implement a monthly capital allocation review process — where have profits been going each month?",
        category: "this week",
        done: false
      }, {
        label: "Set a formal capital allocation framework to define what % of profits goes to each bucket: debt paydown, reinvestment, owner distributions, reserves",
        category: "month 2",
        done: false
      }, {
        label: "Compress your receivables aging by at least 15%",
        category: "month 2",
        done: false
      }, {
        label: "Establish clear ROI thresholds for all capital investments",
        category: "month 3",
        done: false
      }, {
        label: "Watch for operational leverage opportunities once cash is optimized",
        category: "looking ahead",
        done: false
      }, {
        label: "Re-take the assessment after 90 days to see what moved",
        category: "looking ahead",
        done: false
      }]
    },
    scaling: {
      nextConstraint: "Operational Efficiency",
      items: [{
        label: "Map your complete cash conversion cycle across all business units",
        category: "this week",
        done: false
      }, {
        label: "Restructure payment terms with your top 10 clients",
        category: "this week",
        done: false
      }, {
        label: "Implement a formal capital allocation review with your CFO or controller",
        category: "this week",
        done: false
      }, {
        label: "Compress receivables aging by 15% across the organization",
        category: "month 2",
        done: false
      }, {
        label: "Build a treasury management process for excess cash deployment",
        category: "month 2",
        done: false
      }, {
        label: "Establish ROI thresholds and payback periods for all investments",
        category: "month 3",
        done: false
      }, {
        label: "Watch for operational leverage once cash conversion is optimized",
        category: "looking ahead",
        done: false
      }, {
        label: "Re-take the assessment after 90 days to see what moved",
        category: "looking ahead",
        done: false
      }]
    }
  },
  owner_dependency: {
    survival: {
      nextConstraint: "Operational Efficiency",
      items: [{
        label: "List every decision only you can make — then cross off half",
        category: "this week",
        done: false
      }, {
        label: "Pick one client relationship and introduce your team as the primary contact",
        category: "this week",
        done: false
      }, {
        label: "Document one process you do every week that someone else could do",
        category: "this week",
        done: false
      }, {
        label: "Take one full day off without checking in — see what breaks",
        category: "month 2",
        done: false
      }, {
        label: "Hire or promote one person into a role that currently reports to you",
        category: "month 2",
        done: false
      }, {
        label: "Build an 'if I get hit by a bus' document for the business",
        category: "month 3",
        done: false
      }, {
        label: "Watch for efficiency gaps once you stop being the bottleneck",
        category: "looking ahead",
        done: false
      }, {
        label: "Re-take the assessment after 90 days to see what moved",
        category: "looking ahead",
        done: false
      }]
    },
    stabilize: {
      nextConstraint: "Operational Efficiency",
      items: [{
        label: "Document and demonstrate how to do the most repeated question your team asks you",
        category: "this week",
        done: false
      }, {
        label: "List every decision only you can make — then cross off half",
        category: "this week",
        done: false
      }, {
        label: "Pick one client relationship and introduce your team as the primary contact",
        category: "this week",
        done: false
      }, {
        label: "Give one person ownership of one thing — fully",
        category: "month 2",
        done: false
      }, {
        label: "Stop doing the work yourself when the team can't do it right — coach them instead",
        category: "month 2",
        done: false
      }, {
        label: "Take one full day off without checking in — see what breaks",
        category: "month 3",
        done: false
      }, {
        label: "Watch for efficiency gaps once you stop being the bottleneck",
        category: "looking ahead",
        done: false
      }, {
        label: "Re-take the assessment after 90 days to see what moved",
        category: "looking ahead",
        done: false
      }]
    },
    growth: {
      nextConstraint: "Profitability",
      items: [{
        label: "Build a strategic decision-making playbook for your top 10 recurring decisions",
        category: "this week",
        done: false
      }, {
        label: "Transition your #1 client relationship to a senior team member",
        category: "this week",
        done: false
      }, {
        label: "Document one process per week that currently lives only in your head",
        category: "this week",
        done: false
      }, {
        label: "Pick one role in your company and assign one quantifiable result they are now responsible for (that aligns with growing the business's profits)",
        category: "month 2",
        done: false
      }, {
        label: "Hire or promote one person into a role that currently reports directly to you",
        category: "month 2",
        done: false
      }, {
        label: "Build an org chart that works without your name in every box",
        category: "month 3",
        done: false
      }, {
        label: "Watch for profitability once the business runs without you daily",
        category: "looking ahead",
        done: false
      }, {
        label: "Re-take the assessment after 90 days to see what moved",
        category: "looking ahead",
        done: false
      }]
    },
    optimize: {
      nextConstraint: "Profitability",
      items: [{
        label: "Identify the 3-4 core functions of your business and who currently owns each one (hint: if the answer is you, that's the problem)",
        category: "this week",
        done: false
      }, {
        label: "Build a relationship transfer plan for your top 15 client relationships — who owns each today, who takes it next",
        category: "this week",
        done: false
      }, {
        label: "Document the institutional knowledge and decision frameworks only you carry",
        category: "this week",
        done: false
      }, {
        label: "Hire or promote department leads for each core function — marketing, sales, delivery, finance",
        category: "month 2",
        done: false
      }, {
        label: "Define measurable outcomes each department lead is accountable for (not tasks — results)",
        category: "month 2",
        done: false
      }, {
        label: "Schedule yourself out of day-to-day operations for one full week and measure what breaks",
        category: "month 3",
        done: false
      }, {
        label: "Watch for profitability as department leads mature and the business operates independently",
        category: "looking ahead",
        done: false
      }, {
        label: "Re-take the assessment after 90 days to see what moved",
        category: "looking ahead",
        done: false
      }]
    },
    scaling: {
      nextConstraint: "Scalability",
      items: [{
        label: "Transition your top 5 client relationships to institutional relationships",
        category: "this week",
        done: false
      }, {
        label: "Build decision-making frameworks your leadership team can use without you",
        category: "this week",
        done: false
      }, {
        label: "Document and distribute the institutional knowledge only you carry",
        category: "this week",
        done: false
      }, {
        label: "Schedule yourself completely unreachable for one week per quarter",
        category: "month 2",
        done: false
      }, {
        label: "Build a succession plan for your role in daily operations",
        category: "month 2",
        done: false
      }, {
        label: "Test the business at 90 days of owner-optional operations",
        category: "month 3",
        done: false
      }, {
        label: "Watch for scalability as the org operates independently",
        category: "looking ahead",
        done: false
      }, {
        label: "Re-take the assessment after 90 days to see what moved",
        category: "looking ahead",
        done: false
      }]
    }
  },
  revenue_quality: {
    survival: {
      nextConstraint: "Profitability",
      items: [{
        label: "Calculate what % of revenue comes from your top 3 customers",
        category: "this week",
        done: false
      }, {
        label: "Identify 5 prospects who look like your best (not biggest) customer",
        category: "this week",
        done: false
      }, {
        label: "Create one recurring revenue offer (retainer, subscription, maintenance plan)",
        category: "this week",
        done: false
      }, {
        label: "Set a rule: no single customer above 20% of revenue",
        category: "month 2",
        done: false
      }, {
        label: "Build a pipeline tracker so you know what's coming, not just what's here",
        category: "month 2",
        done: false
      }, {
        label: "Fire or restructure your least profitable customer relationship",
        category: "month 3",
        done: false
      }, {
        label: "Watch for margin pressure once revenue diversifies",
        category: "looking ahead",
        done: false
      }, {
        label: "Re-take the assessment after 90 days to see what moved",
        category: "looking ahead",
        done: false
      }]
    },
    stabilize: {
      nextConstraint: "Owner Dependency",
      items: [{
        label: "Calculate what % of revenue comes from your top 3 customers",
        category: "this week",
        done: false
      }, {
        label: "Identify 5 prospects who look like your best (not biggest) customer",
        category: "this week",
        done: false
      }, {
        label: "Create one recurring revenue offer (retainer, subscription, maintenance plan)",
        category: "this week",
        done: false
      }, {
        label: "Set a rule: no single customer above 20% of revenue",
        category: "month 2",
        done: false
      }, {
        label: "Build a pipeline tracker so you know what's coming, not just what's here",
        category: "month 2",
        done: false
      }, {
        label: "Growth 'On Purpose' instead of 'By Accident' — add one outbound channel",
        category: "month 3",
        done: false
      }, {
        label: "Watch for owner dependency once revenue diversifies — you are going to need more high-quality employees to continue growing",
        category: "looking ahead",
        done: false
      }, {
        label: "Re-take the assessment after 90 days to see what moved",
        category: "looking ahead",
        done: false
      }]
    },
    growth: {
      nextConstraint: "Owner Dependency",
      items: [{
        label: "Build a revenue quality scorecard: Top 5 clients as % of revenue, top channel as % of new business, % recurring",
        category: "this week",
        done: false
      }, {
        label: "Develop a plan for converting your top 5 project clients to recurring engagements",
        category: "this week",
        done: false
      }, {
        label: "Set a concentration ceiling: no client above 15% of revenue",
        category: "this week",
        done: false
      }, {
        label: "Launch a systematic outbound channel and commit to running it for 6+ months",
        category: "month 2",
        done: false
      }, {
        label: "Build pipeline tracking by source so you know where quality revenue comes from",
        category: "month 2",
        done: false
      }, {
        label: "Restructure or exit your lowest-quality revenue relationships",
        category: "month 3",
        done: false
      }, {
        label: "Watch for owner dependency as you scale the team to support diversified revenue",
        category: "looking ahead",
        done: false
      }, {
        label: "Re-take the assessment after 90 days to see what moved",
        category: "looking ahead",
        done: false
      }]
    },
    optimize: {
      nextConstraint: "Operational Efficiency",
      items: [{
        label: "Calculate your Lifetime Value (LTV), logo churn rate, and revenue churn rate for the last 3 years",
        category: "this week",
        done: false
      }, {
        label: "Build a relationship transfer plan for your top 15 client relationships — who owns each today, who takes it next, and what needs to happen to make that transition smoothly",
        category: "this week",
        done: false
      }, {
        label: "Map every client against the full suite of services you could provide them — where are they in your customer journey?",
        category: "this week",
        done: false
      }, {
        label: "Build a customer expansion playbook and assign an account manager to own it",
        category: "month 2",
        done: false
      }, {
        label: "Develop a Churn Prevention Program that identifies 1) leading indicators for why customers churn, and 2) leading indicators for why people stay forever",
        category: "month 2",
        done: false
      }, {
        label: "Implement LTV, logo and revenue churn rates, and revenue expansion rate as core KPIs reviewed monthly",
        category: "month 3",
        done: false
      }, {
        label: "Watch for operational efficiency as customer relationships become institutional",
        category: "looking ahead",
        done: false
      }, {
        label: "Re-take the assessment after 90 days to see what moved",
        category: "looking ahead",
        done: false
      }]
    },
    scaling: {
      nextConstraint: "Owner Dependency",
      items: [{
        label: "Build a revenue quality scorecard across all business units",
        category: "this week",
        done: false
      }, {
        label: "Enforce concentration ceiling: no client above 10% of total revenue",
        category: "this week",
        done: false
      }, {
        label: "Convert all major relationships to contracted recurring revenue",
        category: "this week",
        done: false
      }, {
        label: "Launch strategic diversification into adjacent markets or segments",
        category: "month 2",
        done: false
      }, {
        label: "Build 12+ month contract terms as the organizational standard",
        category: "month 2",
        done: false
      }, {
        label: "Exit or restructure every relationship below your quality threshold",
        category: "month 3",
        done: false
      }, {
        label: "Watch for owner dependency as institutional complexity grows",
        category: "looking ahead",
        done: false
      }, {
        label: "Re-take the assessment after 90 days to see what moved",
        category: "looking ahead",
        done: false
      }]
    }
  },
  operational_efficiency: {
    survival: {
      nextConstraint: "Profitability",
      items: [{
        label: "Time-track your week — where do hours actually go?",
        category: "this week",
        done: false
      }, {
        label: "Identify the one manual task that eats the most time but doesn't generate revenue",
        category: "this week",
        done: false
      }, {
        label: "Price out one part-time hire or automation tool that could take that task off your plate",
        category: "this week",
        done: false
      }, {
        label: "Document the 3 most-repeated workflows as simple checklists",
        category: "month 2",
        done: false
      }, {
        label: "Invest in one tool or person that removes a manual step (billing, scheduling, onboarding)",
        category: "month 2",
        done: false
      }, {
        label: "Block off at least one morning per week that is not for client work",
        category: "month 3",
        done: false
      }, {
        label: "Watch for Profitability once operational waste is reduced",
        category: "looking ahead",
        done: false
      }, {
        label: "Re-take the assessment after 90 days to see what moved",
        category: "looking ahead",
        done: false
      }]
    },
    stabilize: {
      nextConstraint: "Profitability",
      items: [{
        label: "Document one process per month — start with the most repeated one",
        category: "this week",
        done: false
      }, {
        label: "Audit your software stack and cut at least one tool you're paying for but not using",
        category: "this week",
        done: false
      }, {
        label: "Build simple checklists for your top 3 delivery workflows",
        category: "this week",
        done: false
      }, {
        label: "Give every role one number they own and review it weekly",
        category: "month 2",
        done: false
      }, {
        label: "Invest in one tool that removes a manual step (billing, scheduling, onboarding)",
        category: "month 2",
        done: false
      }, {
        label: "Block off at least one morning per week that is not for client work",
        category: "month 3",
        done: false
      }, {
        label: "Watch for Profitability once operational waste is reduced",
        category: "looking ahead",
        done: false
      }, {
        label: "Re-take the assessment after 90 days to see what moved",
        category: "looking ahead",
        done: false
      }]
    },
    growth: {
      nextConstraint: "Revenue Quality",
      items: [{
        label: "Run a cost-base audit — pull the full P&L and full vendor list and cut recurring costs you don't need",
        category: "this week",
        done: false
      }, {
        label: "Assign one person to own overhead (and all efficiency and growth decisions from your financials)",
        category: "this week",
        done: false
      }, {
        label: "Identify the top 5 waste generators and assign owners to fix them",
        category: "this week",
        done: false
      }, {
        label: "Define output per employee for every role",
        category: "month 2",
        done: false
      }, {
        label: "Build a revenue-per-employee target and review it monthly",
        category: "month 2",
        done: false
      }, {
        label: "Redesign your most broken workflow that is currently manual but shouldn't be",
        category: "month 3",
        done: false
      }, {
        label: "Watch for Revenue Quality as operational efficiency unlocks margin",
        category: "looking ahead",
        done: false
      }, {
        label: "Re-take the assessment after 90 days to see what moved",
        category: "looking ahead",
        done: false
      }]
    },
    optimize: {
      nextConstraint: "Scalability",
      items: [{
        label: "Run a cost-base audit — pull the full P&L and vendor list and identify where margin is leaking",
        category: "this week",
        done: false
      }, {
        label: "Assign one person to own operating margin as a KPI — not just report it, defend it",
        category: "this week",
        done: false
      }, {
        label: "Audit every role that touches revenue: does their comp reward profitable growth, or just growth?",
        category: "this week",
        done: false
      }, {
        label: "Restructure incentives so sales, delivery, and ops leaders are rewarded for margin, not just volume",
        category: "month 2",
        done: false
      }, {
        label: "Develop a step-by-step playbook for how you will increase revenue-per-employee so you can attract and retain better talent, scale more profitably, and command a premium valuation",
        category: "month 2",
        done: false
      }, {
        label: "Install a Continuous Improvement cycle into your business (with a dedicated budget of time and profits for reinvestment) to drive margin expansion as you scale",
        category: "month 3",
        done: false
      }, {
        label: "Watch for Scalability as operational discipline unlocks margin and reduces fragility",
        category: "looking ahead",
        done: false
      }, {
        label: "Re-take the assessment after 90 days to see what moved",
        category: "looking ahead",
        done: false
      }]
    },
    scaling: {
      nextConstraint: "Profitability",
      items: [{
        label: "Commission a full operating model audit across the organization",
        category: "this week",
        done: false
      }, {
        label: "Assign P&L ownership with margin targets to every operating leader",
        category: "this week",
        done: false
      }, {
        label: "Audit and consolidate the entire technology stack",
        category: "this week",
        done: false
      }, {
        label: "Redesign the operating model for your next stage of scale",
        category: "month 2",
        done: false
      }, {
        label: "Build a continuous improvement process that runs without you",
        category: "month 2",
        done: false
      }, {
        label: "Set operating efficiency benchmarks against best-in-class peers",
        category: "month 3",
        done: false
      }, {
        label: "Watch for Profitability as operational discipline compounds",
        category: "looking ahead",
        done: false
      }, {
        label: "Re-take the assessment after 90 days to see what moved",
        category: "looking ahead",
        done: false
      }]
    }
  },
  scalability: {
    survival: {
      nextConstraint: "Operational Efficiency",
      items: [{
        label: "Write down the one process that breaks first when you get busy — redesign it this week",
        category: "this week",
        done: false
      }, {
        label: "Identify one task you do manually every week that a $15/hr VA or a tool could handle",
        category: "this week",
        done: false
      }, {
        label: "Write down what breaks if you try to add 10 more clients next month",
        category: "this week",
        done: false
      }, {
        label: "Design a version of your core service that doesn't scale linearly with your time",
        category: "month 2",
        done: false
      }, {
        label: "Create a simple weekly dashboard — 3 to 5 numbers that tell you if the business is healthy",
        category: "month 2",
        done: false
      }, {
        label: "Price out the first hire or contractor that would give you capacity you don't have today",
        category: "month 3",
        done: false
      }, {
        label: "Watch for owner dependency once systems start running without daily input",
        category: "looking ahead",
        done: false
      }, {
        label: "Re-take the assessment after 90 days to see what moved",
        category: "looking ahead",
        done: false
      }]
    },
    stabilize: {
      nextConstraint: "Operational Efficiency",
      items: [{
        label: "Build a standard operating procedure for your core service delivery",
        category: "this week",
        done: false
      }, {
        label: "Identify what can be templated and template it this week",
        category: "this week",
        done: false
      }, {
        label: "Price out the hire or system that gives you leverage you don't have today",
        category: "this week",
        done: false
      }, {
        label: "Pick three numbers that tell you if the business is healthy — start reviewing weekly",
        category: "month 2",
        done: false
      }, {
        label: "Build a capacity plan: what breaks first if you add 50% more volume?",
        category: "month 2",
        done: false
      }, {
        label: "Redesign your most repeated workflow for 2x volume, not current volume",
        category: "month 3",
        done: false
      }, {
        label: "Watch for Operational Efficiency as systems and processes mature",
        category: "looking ahead",
        done: false
      }, {
        label: "Re-take the assessment after 90 days to see what moved",
        category: "looking ahead",
        done: false
      }]
    },
    growth: {
      nextConstraint: "Operational Efficiency",
      items: [{
        label: "Identify the 3 processes that break most often when volume increases",
        category: "this week",
        done: false
      }, {
        label: "Write down what breaks if you try to add 50% more clients next quarter",
        category: "this week",
        done: false
      }, {
        label: "Redesign one broken process for the next revenue tier, not the current one",
        category: "this week",
        done: false
      }, {
        label: "Build a weekly dashboard with the 5 numbers that tell you if the machine is working",
        category: "month 2",
        done: false
      }, {
        label: "Evaluate each direct report: can they run their function at 2x volume without you?",
        category: "month 2",
        done: false
      }, {
        label: "Design a productized or leveraged version of your core delivery model",
        category: "month 3",
        done: false
      }, {
        label: "Watch for Operational Efficiency as you build scalable infrastructure",
        category: "looking ahead",
        done: false
      }, {
        label: "Re-take the assessment after 90 days to see what moved",
        category: "looking ahead",
        done: false
      }]
    },
    optimize: {
      nextConstraint: "Profitability",
      items: [{
        label: "Audit your readiness across all five foundations: leadership pipeline, revenue quality, operational efficiency, cash deployment, and margin architecture",
        category: "this week",
        done: false
      }, {
        label: "Identify which foundations would break if you grew 50% in the next 18 months",
        category: "this week",
        done: false
      }, {
        label: "Hire or promote department leads for marketing, sales, delivery, and finance",
        category: "this week",
        done: false
      }, {
        label: "Convert your top project clients to recurring engagements and start measuring LTV, churn, and expansion rate",
        category: "month 2",
        done: false
      }, {
        label: "Get someone accountable for defending operating margin as you scale — with 90-day sprint accountability",
        category: "month 2",
        done: false
      }, {
        label: "Build a capital allocation framework that defines where every dollar of profit goes with ROI targets",
        category: "month 3",
        done: false
      }, {
        label: "Watch for Profitability as the foundations compound and growth becomes sustainable",
        category: "looking ahead",
        done: false
      }, {
        label: "Re-take the assessment after 90 days to see what moved",
        category: "looking ahead",
        done: false
      }]
    },
    scaling: {
      nextConstraint: "Operational Efficiency",
      items: [{
        label: "Identify the 3 workflows that break first at 1.5x volume",
        category: "this week",
        done: false
      }, {
        label: "Design a productized or leveraged delivery model for your core offering",
        category: "this week",
        done: false
      }, {
        label: "Build a leadership capacity plan for the next stage of growth",
        category: "this week",
        done: false
      }, {
        label: "Redesign delivery infrastructure so cost-to-deliver grows at 60% the rate of revenue",
        category: "month 2",
        done: false
      }, {
        label: "Implement enterprise-grade systems that scale without proportional headcount",
        category: "month 2",
        done: false
      }, {
        label: "Build organizational capacity ahead of the growth, not behind it",
        category: "month 3",
        done: false
      }, {
        label: "Watch for Operational Efficiency as institutional complexity increases",
        category: "looking ahead",
        done: false
      }, {
        label: "Re-take the assessment after 90 days to see what moved",
        category: "looking ahead",
        done: false
      }]
    }
  }
};

// Category labels// Category labels + icons for checklist grouping
const CHECKLIST_CATEGORIES = {
  "this week": {
    label: "This Week",
    color: null
  },
  // uses constraint color
  "month 2": {
    label: "Month 2",
    color: null
  },
  "month 3": {
    label: "Month 3",
    color: null
  },
  "looking ahead": {
    label: "Looking Ahead",
    color: C.gold
  }
};

// ─── PAGE: YOUR NEXT 90 DAYS (personalized checklist) ──────────────
const PageChecklist = ({
  constraint,
  constraintId,
  recipientName,
  pageNum = 14,
  tierKey
}) => {
  const tierChecklist = CHECKLIST_ITEMS[constraintId] || CHECKLIST_ITEMS.profitability;
  const checklist = tierChecklist[tierKey] || tierChecklist.growth || Object.values(tierChecklist)[0];
  const categories = ["this week", "month 2", "month 3", "looking ahead"];
  return /*#__PURE__*/React.createElement(Page, null, /*#__PURE__*/React.createElement(PageChrome, {
    constraintName: constraint.name,
    recipientName: recipientName,
    pageNum: 13,
    totalPages: 14,
    accentColor: constraint.color
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0.85in 0.7in 0.75in"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check-circle",
    color: constraint.color,
    size: 26
  }), /*#__PURE__*/React.createElement(Eyebrow, {
    color: constraint.color,
    style: {
      marginBottom: 0
    }
  }, "Your Roadmap Checklist")), /*#__PURE__*/React.createElement(H, {
    size: 32,
    style: {
      marginBottom: 8
    }
  }, "Your next 90 days."), /*#__PURE__*/React.createElement(P, {
    size: 11,
    color: C.text2,
    style: {
      marginBottom: 20,
      maxWidth: "5.4in"
    }
  }, "Personalized for ", constraint.name.toLowerCase(), " at your revenue band. Check these off in order. When the constraint shifts, come back and re-assess."), categories.map(cat => {
    const items = checklist.items.filter(it => it.category === cat);
    if (!items.length) return null;
    const catMeta = CHECKLIST_CATEGORIES[cat];
    const catColor = catMeta.color || constraint.color;
    const isLookingAhead = cat === "looking ahead";
    return /*#__PURE__*/React.createElement("div", {
      key: cat,
      style: {
        marginBottom: 16
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 8
      }
    }, /*#__PURE__*/React.createElement(Chip, {
      color: catColor,
      style: isLookingAhead ? {
        borderStyle: "dashed"
      } : {}
    }, catMeta.label), isLookingAhead && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 9,
        color: C.text3,
        fontStyle: "italic"
      }
    }, "after ", constraint.name.toLowerCase(), " improves \u2014 watch for ", checklist.nextConstraint)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 6
      }
    }, items.map((item, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        padding: "10px 16px",
        background: isLookingAhead ? `${C.gold}08` : "rgba(255,255,255,0.02)",
        border: `1px solid ${isLookingAhead ? `${C.gold}20` : C.border1}`,
        borderRadius: 6
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 16,
        height: 16,
        flexShrink: 0,
        border: `1.5px solid ${catColor}80`,
        borderRadius: 3,
        marginTop: 1
      }
    }), /*#__PURE__*/React.createElement(P, {
      size: 10.5,
      color: isLookingAhead ? C.text2 : C.text1,
      style: {
        flex: 1,
        lineHeight: 1.45
      }
    }, item.label)))));
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      padding: "14px 18px",
      background: `linear-gradient(135deg, ${constraint.color}12, ${constraint.color}04)`,
      border: `1px solid ${constraint.color}30`,
      borderRadius: 10,
      display: "flex",
      alignItems: "center",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "target",
    color: constraint.color,
    size: 22
  }), /*#__PURE__*/React.createElement(P, {
    size: 10,
    color: C.text2,
    style: {
      flex: 1,
      lineHeight: 1.5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: C.text1,
      fontWeight: 600
    }
  }, "After 90 days, re-take the assessment."), " Your constraint will have shifted. The next bottleneck is already forming \u2014 and the playbook for it is different.")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      padding: "16px 20px",
      background: `linear-gradient(135deg, ${C.gold}12, ${C.gold}04)`,
      border: `1.5px solid ${C.gold}40`,
      borderRadius: 12,
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "zap",
    color: C.gold,
    size: 18
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: C.gold
    }
  }, "Want Help Starting These \u2014 Free")), /*#__PURE__*/React.createElement("h4", {
    style: {
      fontFamily: "'Cormorant Garamond', serif",
      fontSize: 16,
      fontWeight: 500,
      color: C.text1,
      margin: "0 0 6px"
    }
  }, "Book a Free Working Session."), /*#__PURE__*/React.createElement(P, {
    size: 9.5,
    color: C.text2,
    style: {
      marginBottom: 10,
      maxWidth: "5.5in"
    }
  }, "You bring your numbers. I walk you through exactly how to execute these moves \u2014 adapted to your specific business."), /*#__PURE__*/React.createElement("a", {
    href: "https://www.kriczkyvirtus.com/roadmap-session",
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "10px 28px",
      borderRadius: 10,
      textDecoration: "none",
      border: `1.5px solid ${C.gold}50`,
      color: C.gold,
      fontWeight: 700,
      fontSize: 11,
      letterSpacing: "0.02em",
      background: `linear-gradient(135deg, ${C.gold}18, ${C.gold}0a)`,
      boxShadow: `0 0 16px ${C.gold}18`,
      fontFamily: "'DM Sans', sans-serif",
      position: "relative",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: "-50%",
      left: "-50%",
      right: "-50%",
      bottom: "-50%",
      pointerEvents: "none",
      background: `linear-gradient(120deg, transparent 0%, transparent 40%, ${C.gold}12 48%, ${C.gold}20 50%, ${C.gold}12 52%, transparent 60%, transparent 100%)`,
      backgroundSize: "200% 200%",
      animation: "btnShimmer 6s ease-in-out infinite"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      zIndex: 1
    }
  }, "Book Your Working Session")))));
};

// ═══════════════════════════════════════════════════════════════════
// ROOT
// ═══════════════════════════════════════════════════════════════════
module.exports = function ConstraintRoadmapV2({
  data,
  recipientName = null,
  generatedDate = null,
  diagnosticId = null
}) {
  if (!data) return null;
  const constraint = resolveConstraint(data.constraintId, data.revenue);
  const tierKey = getRevenueTier(data.revenue);
  const score = data.score;
  const scoreColor = score >= 80 ? C.green : score >= 60 ? C.gold : score >= 40 ? C.amber : C.red;
  const revenueLabel = REVENUE_LABELS[data.revenue] || "—";
  const dateStr = generatedDate || (() => {
    const d = new Date();
    return d.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    });
  })();
  const idStr = diagnosticId || (() => {
    const seed = (data.constraintId || "x") + (data.revenue || "x") + score;
    let h = 0;
    for (let i = 0; i < seed.length; i++) {
      h = (h << 5) - h + seed.charCodeAt(i);
      h |= 0;
    }
    return Math.abs(h).toString(16).slice(0, 6).toUpperCase().padStart(6, "0");
  })();
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: C.bgDeep,
      fontFamily: "'DM Sans', sans-serif"
    }
  }, /*#__PURE__*/React.createElement("style", null, `
        @page { size: Letter; margin: 0; }
        * { -webkit-print-color-adjust: exact; print-color-adjust: exact; box-sizing: border-box; }
        @keyframes btnShimmer { 0%{background-position:200% 0}50%{background-position:-200% 0}100%{background-position:-200% 0} }
        body, html { margin: 0; padding: 0; background: ${C.bgDeep}; }
      `), /*#__PURE__*/React.createElement(PageCover, {
    constraint: constraint,
    constraintId: data.constraintId,
    score: score,
    scoreColor: scoreColor,
    recipientName: recipientName,
    revenueLabel: revenueLabel,
    tierKey: tierKey,
    generatedDate: dateStr.toUpperCase(),
    diagnosticId: idStr
  }), /*#__PURE__*/React.createElement(PageYouAreHere, {
    constraint: constraint,
    constraintId: data.constraintId,
    categories: data.categories || [],
    score: score,
    tierKey: tierKey,
    recipientName: recipientName
  }), /*#__PURE__*/React.createElement(PageConsequence, {
    constraint: constraint,
    constraintId: data.constraintId,
    score: score,
    recipientName: recipientName,
    pageNum: 3,
    tierKey: tierKey
  }), /*#__PURE__*/React.createElement(PageConstraintSummary, {
    constraint: constraint,
    constraintId: data.constraintId,
    recipientName: recipientName,
    pageNum: 4,
    tierKey: tierKey
  }), /*#__PURE__*/React.createElement(PageRootCauses, {
    constraint: constraint,
    recipientName: recipientName,
    pageNum: 5
  }), /*#__PURE__*/React.createElement(PageActionsIntro, {
    constraint: constraint,
    constraintId: data.constraintId
  }), /*#__PURE__*/React.createElement(PageActions, {
    constraint: constraint,
    recipientName: recipientName
  }), /*#__PURE__*/React.createElement(PageOfferTransition, null), /*#__PURE__*/React.createElement(PageIntensivePitch, {
    constraint: constraint,
    recipientName: recipientName
  }), /*#__PURE__*/React.createElement(PageIntensiveOffer, {
    constraint: constraint,
    recipientName: recipientName
  }), /*#__PURE__*/React.createElement(PageAppendixOthers, {
    constraint: constraint,
    constraintId: data.constraintId,
    recipientName: recipientName,
    revenueTier: tierKey,
    pageNum: 11
  }), /*#__PURE__*/React.createElement(PageAppendixMethodology, {
    constraint: constraint,
    recipientName: recipientName
  }), /*#__PURE__*/React.createElement(PageChecklist, {
    constraint: constraint,
    constraintId: data.constraintId,
    recipientName: recipientName,
    tierKey: tierKey
  }), /*#__PURE__*/React.createElement(PageClosing, {
    constraint: constraint,
    recipientName: recipientName
  }));
};