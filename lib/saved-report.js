/* ═══════════════════════════════════════════════════════════════
   SAVED DIAGNOSTIC RESULTS - the page behind the emailed link.

   The diagnostic tools save a snapshot of the finished pages (scripts
   stripped) and email a link to it through /api/view. The v2 tools
   (cream letter pages, class "kvd") size their pages with JavaScript, so a
   snapshot taken on a laptop opens on a phone at full laptop width - zoomed
   in. This adds back, at view time, a small script that:
     - fits the letter pages to the screen (same rule as the live tool),
     - makes Download PDF work (html2canvas + jsPDF from cdnjs),
     - adds Share (copies this page's link, or the phone's share sheet).
   Snapshots already stored get the fix too, since it's added when served.
   ═══════════════════════════════════════════════════════════════ */

const FRAME = String.raw`
(function () {
  var W = 816, H = 1056;
  var root = document.querySelector('.kvd');
  if (!root) return;

  /* Fit pages to the width available - the same layout on every screen. */
  function fit() {
    var w = document.documentElement.clientWidth;
    var g = w < 600 ? 10 : 32;
    var s = Math.min(1, (w - g * 2) / W);
    root.querySelectorAll('.pw').forEach(function (pw) {
      pw.style.width = (W * s) + 'px';
      pw.style.height = (H * s) + 'px';
      pw.style.marginBottom = (18 * s + 6) + 'px';
      var p = pw.querySelector('.page');
      if (p) p.style.transform = 'scale(' + s + ')';
    });
  }
  fit();
  window.addEventListener('resize', fit);

  /* Nothing to fill in on a saved copy. */
  root.querySelectorAll('.gate').forEach(function (g) { g.style.display = 'none'; });

  function load(src) {
    return new Promise(function (ok, fail) {
      var s = document.createElement('script');
      s.src = src; s.onload = ok; s.onerror = fail;
      document.head.appendChild(s);
    });
  }

  async function buildPdf(filename) {
    if (!window.html2canvas) await load('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
    if (!window.jspdf) await load('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
    if (document.fonts && document.fonts.ready) await document.fonts.ready;
    var pages = Array.prototype.slice.call(root.querySelectorAll('.page'));
    var pdf = new window.jspdf.jsPDF({ unit: 'pt', format: 'letter', compress: true });
    for (var i = 0; i < pages.length; i++) {
      var canvas = await window.html2canvas(pages[i], {
        scale: 2, useCORS: true, logging: false, backgroundColor: '#ffffff',
        width: W, height: H, windowWidth: W + 200,
        onclone: function (doc, el) {
          el.style.transform = 'none'; el.style.boxShadow = 'none';
          el.querySelectorAll('.glow').forEach(function (g) { g.style.display = 'none'; });
          var win = doc.defaultView;
          el.querySelectorAll('*').forEach(function (n) {
            var bs = win.getComputedStyle(n).boxShadow;
            if (!bs || bs.indexOf('inset') < 0) return;
            var outer = bs.split(/,(?![^(]*\))/).filter(function (x) { return x.indexOf('inset') < 0; }).join(',');
            n.style.boxShadow = outer || 'none';
          });
        }
      });
      if (i) pdf.addPage('letter', 'portrait');
      pdf.addImage(canvas.toDataURL('image/jpeg', 0.85), 'JPEG', 0, 0, 612, 792, undefined, 'FAST');
      canvas.width = 0; canvas.height = 0;
      var box = pages[i].getBoundingClientRect(), k = 612 / box.width;
      pages[i].querySelectorAll('a[href]').forEach(function (a) {
        var r = a.getBoundingClientRect();
        if (!r.width || !r.height) return;
        pdf.link((r.left - box.left) * k, (r.top - box.top) * k, r.width * k, r.height * k, { url: a.href });
      });
    }
    pdf.save(filename);
  }

  async function copy(url) {
    try { await navigator.clipboard.writeText(url); return; } catch (e) { /* fall through */ }
    var ta = document.createElement('textarea');
    ta.value = url; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch (e2) { /* nothing more to try */ }
    ta.remove();
  }

  var bar = root.querySelector('.bar');
  if (!bar) return;
  var title = (document.querySelector('.kvd .folio b') || {}).textContent || 'Kriczky Virtus Results';
  var file = title.trim().replace(/[^A-Za-z0-9]+/g, '-').replace(/^-|-$/g, '') + '.pdf';
  bar.innerHTML = '';
  var dl = document.createElement('button');
  dl.textContent = 'Download PDF';
  dl.addEventListener('click', async function () {
    dl.disabled = true; dl.textContent = 'Preparing your PDF...';
    try { await buildPdf(file); }
    catch (e) { console.error(e); window.print(); }
    finally { dl.disabled = false; dl.textContent = 'Download PDF'; }
  });
  var sh = document.createElement('button');
  sh.textContent = 'Share';
  sh.style.cssText = 'color:#0A0E14;background:transparent;border-color:#C9C2B4';
  sh.addEventListener('click', async function () {
    if (navigator.share && window.matchMedia('(pointer: coarse)').matches) {
      try { await navigator.share({ title: title.trim(), url: window.location.href }); return; }
      catch (e) { if (e && e.name === 'AbortError') return; }
    }
    await copy(window.location.href);
    sh.textContent = 'Link copied';
    setTimeout(function () { sh.textContent = 'Share'; }, 1800);
  });
  bar.appendChild(dl); bar.appendChild(sh);
})();
`;

/* Only the v2 letter-page tools need it; older snapshots are served as stored. */
function isLetterPageSnapshot(html) {
  return /class="kvd"/.test(html);
}

function injectSavedReportFrame(html) {
  if (!isLetterPageSnapshot(html)) return html;
  const tag = "<script>" + FRAME + "</script>";
  return /<\/body>/i.test(html) ? html.replace(/<\/body>/i, tag + "</body>") : html + tag;
}

module.exports = { injectSavedReportFrame, isLetterPageSnapshot };
