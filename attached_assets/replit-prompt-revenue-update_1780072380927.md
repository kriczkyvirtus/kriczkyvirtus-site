# Replit Agent Prompt — Assessment Flow Revenue Update

## Context
I'm attaching an updated version of the Constraint Roadmap Assessment component (`constraint-roadmap-v2.jsx`). This is the interactive 7-question diagnostic that business owners take on the site.

## What Changed
ONE change was made: the revenue question (Question 1, `id: "revenue"`) was updated from 6 options to 4 options. The old version had:
- Under $500K
- $500K – $750K
- $750K – $1M
- $1M – $3M
- $3M – $10M
- Over $10M

The new version has:
- Under $500K (`under_500k`)
- $500K – $1M (`500k_1m`)
- $1M – $3M (`1m_3m`)
- $3M – $10M (`3m_10m`)

## What You Need To Do
1. Find the current assessment component in the project (it's the Constraint Roadmap assessment page — the component with the 7-question flow, score reveal, and email gate).
2. Replace it with the contents of the attached `constraint-roadmap-v2.jsx` file.
3. **Do NOT modify the component code.** The JSX, styling, scoring logic, and all other functionality must remain exactly as provided. The only change is the revenue options — everything else was already working correctly.
4. Verify the assessment still renders and functions after the swap — intro screen loads, all 7 questions display, score calculates, result screen shows.

## Critical Instructions
- Do NOT restructure, refactor, or "improve" any code in the component.
- Do NOT change any imports, state management, scoring functions, or UI layout.
- Do NOT add any new dependencies.
- The file is a drop-in replacement for the existing assessment component. Treat it as a straight file swap.
