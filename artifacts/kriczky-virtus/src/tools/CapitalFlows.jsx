import React from "react";
import DeepDiveFlow from "./DeepDiveFlow.jsx";
import { STRUCTURAL } from "./StructuralCapitalV2.jsx";
import { CUSTOMER } from "./CustomerCapitalV2.jsx";
import { HUMAN } from "./HumanCapitalV2.jsx";

/* The three capital deep dives as question flows (22 Nov 2026). Sample report pages are
   rendered from a fictional business's scores; the reports print no owner or company name. */
const pages = (dir, dimTitle) => [
  { n: "01", t: "Your deep-dive", src: `/img/${dir}/page-01.jpg` },
  { n: "03", t: "Each dimension, scored", src: `/img/${dir}/page-03.jpg` },
  { n: "09", t: dimTitle, src: `/img/${dir}/page-09.jpg` },
  { n: "13", t: "Your score and diagnosis", src: `/img/${dir}/page-13.jpg` },
  { n: "14", t: "Your first three moves", src: `/img/${dir}/page-14.jpg` },
];
const it = (A, text) => <span style={{ color: A.ink, fontStyle: "italic", fontWeight: 500 }}>{text}</span>;
const intro = "Ten dimensions. Score each from 1 to 6 - there's no middle, so you're either below the line or above it. Your report shows your score, your diagnosis and your first three moves.";

export const StructuralCapitalFlow = () => (
  <DeepDiveFlow flow={{
    cfg: STRUCTURAL, tool: "Structural Capital", kicker: "Capital Deep-Dive · Systems, Technology & IP", intro,
    title: (A) => <>How strong are the {it(A, "systems")} that run your business?</>,
    samples: pages("structural", STRUCTURAL.dims[6].title),
  }} />
);

export const CustomerCapitalFlow = () => (
  <DeepDiveFlow flow={{
    cfg: CUSTOMER, tool: "Customer Capital", kicker: "Capital Deep-Dive · Relationships, Loyalty & Revenue", intro,
    title: (A) => <>How strong are the {it(A, "relationships")} that power your business?</>,
    samples: pages("customer", CUSTOMER.dims[6].title),
  }} />
);

export const HumanCapitalFlow = () => (
  <DeepDiveFlow flow={{
    cfg: HUMAN, tool: "Human Capital", kicker: "Capital Deep-Dive · Talent, Leadership & Bench", intro,
    title: (A) => <>How strong is the {it(A, "talent engine")} behind your business?</>,
    samples: pages("human", HUMAN.dims[6].title),
  }} />
);
