/* ═══════════════════════════════════════════════════════════════
   ENGRAVED TEXTURE + SHIELD WATERMARK for the letter-page reports -
   the same engine-turned (guilloché) lattice and logo shield as the
   workshop page and the printed workbook.

   Each kind is one pre-rendered transparent PNG (lattice, fades and shield
   together), laid as the page's own background. The PDF renderer
   (html2canvas) draws page backgrounds faithfully but drops CSS masks,
   faded overlay layers and the shield <img>, so the composition is baked
   into the image. Built by /tmp/claude-0/rtex in the session that made it,
   from the books' texture.py.

   kinds:  cover  dark page, engraved all over, fading toward the title; big shield behind it
           light  cream page, a band of engraving top and bottom; shield in the corner
           mark   cream page, the shield alone
   Reports are read on screen, never bound, so the shield always sits bottom right.
   ═══════════════════════════════════════════════════════════════ */

/* The page's background with the texture laid over it. `base` is the page's own
   colour or gradient. */
export const texBg = (kind, base) => ({
  background: `url(/img/report-texture/${kind}.png) 0 0 / 100% 100% no-repeat, ${base}`,
});
