import { createContext, useContext } from "react";

/* ═══════════════════════════════════════════════════════════════
   KV THEMES — dark (the website) and cream (workbooks, reports, and the
   workshop's attendee pages). The question flows and their ending pages read
   every colour from here, so one component can render either way.

   Accent colours: the dark theme uses the bright fills (#C8A24E, #22D3EE…).
   Cream needs the deeper "ink" versions to stay readable, so components pass
   any accent through T.t() — identity on dark, ink on cream. Washes built as
   `${accent}18` then come out as soft tints on either background.
   ═══════════════════════════════════════════════════════════════ */

const FILL = {
  gold: "#C8A24E", goldLight: "#D4B665", green: "#34D399", cyan: "#22D3EE", red: "#F87171", amber: "#FBBF24",
};
/* From the print pipeline's theme_light.py, same as the reports. */
const INK = {
  [FILL.gold]: "#7A5C1E", [FILL.goldLight]: "#9A7A34", [FILL.green]: "#1B7A57",
  [FILL.cyan]: "#0E7490", [FILL.red]: "#B4403F", [FILL.amber]: "#9A6A00",
};

export const DARK = {
  name: "dark", light: false,
  bgDeep: "#0A0E14", bgCard: "#111720", bgElev: "#1A2130",
  ...FILL,
  text1: "#E8ECF1", text2: "#8B95A5", text3: "#5A6474", text4: "#3D4654",
  surface: "rgba(255,255,255,.025)", surfaceHi: "rgba(255,255,255,.05)", surfaceCard: "rgba(255,255,255,.03)",
  line: "rgba(255,255,255,.09)", lineSoft: "rgba(255,255,255,.05)", lineHi: "rgba(255,255,255,.16)", lineHover: "rgba(255,255,255,.28)",
  input: "#0F141C", inputLine: "rgba(255,255,255,.1)",
  onAccent: "#0A0E14",
  /* the fade that hides the collapsed characteristics list */
  fadeRgb: "10,18,24", fadeSolid: "#0A1218",
  statBg: "#2A2213", statText: FILL.gold, statShadow: "0 6px 24px rgba(0,0,0,.45)",
  btnBg: `linear-gradient(135deg,${FILL.gold}22,${FILL.gold}0d)`, btnText: FILL.gold, btnLine: `${FILL.gold}66`, btnGlow: `${FILL.gold}33`, btnLineHover: FILL.gold,
  grain: 0.05, shadowCard: "none",
  t: (c) => c,
};

export const LIGHT = {
  name: "light", light: true,
  bgDeep: "#F2EEE6", bgCard: "#FFFFFF", bgElev: "#FBF8F2",
  gold: INK[FILL.gold], goldLight: FILL.gold, green: INK[FILL.green], cyan: INK[FILL.cyan], red: INK[FILL.red], amber: INK[FILL.amber],
  text1: "#0A0E14", text2: "#3E4652", text3: "#6B6459", text4: "#8C8476",
  surface: "#FFFFFF", surfaceHi: "#FBF8F2", surfaceCard: "#FFFFFF",
  line: "#E2DBCD", lineSoft: "#ECE6DA", lineHi: "#C9C2B4", lineHover: "#A99F8D",
  input: "#FFFFFF", inputLine: "#D9D1C2",
  onAccent: "#FFFFFF",
  fadeRgb: "255,255,255", fadeSolid: "#FFFFFF",
  /* the dark stat box reads as the workbooks' dark callouts */
  statBg: "#0A0E14", statText: FILL.gold, statShadow: "0 10px 26px rgba(10,14,20,.22)",
  btnBg: "linear-gradient(160deg,#141B26 0%,#0A0E14 72%)", btnText: FILL.gold, btnLine: "#0A0E14", btnGlow: "rgba(200,162,78,.45)", btnLineHover: FILL.gold,
  grain: 0, shadowCard: "0 1px 2px rgba(10,14,20,.05), 0 8px 22px rgba(10,14,20,.06)",
  t: (c) => INK[c] || c,
};

/* The bright fill for any accent, whether it arrives as a fill or an ink —
   glows read best in the bright colour on either background. */
const INK_TO_FILL = Object.fromEntries(Object.entries(INK).map(([f, i]) => [i, f]));
export const fillOf = (c) => INK_TO_FILL[c] || c;

const ThemeCtx = createContext(DARK);
export const ThemeProvider = ThemeCtx.Provider;
export const useT = () => useContext(ThemeCtx);
