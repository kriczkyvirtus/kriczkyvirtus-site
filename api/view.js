// api/view.js
// Proxy endpoint: fetches an HTML blob and serves it with Content-Disposition: inline
// so mobile browsers open the file in the browser instead of downloading it.
// Vercel Blob CDN forces Content-Disposition: attachment for HTML files regardless
// of what is set at upload time, so proxying through our own function is required.

const ALLOWED_HOST_SUFFIX = ".public.blob.vercel-storage.com";

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).send("Method Not Allowed");
  }

  const { url } = req.query;
  if (!url) {
    return res.status(400).send("Missing url parameter");
  }

  // Security: only proxy Vercel Blob URLs
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return res.status(400).send("Invalid URL");
  }

  if (!parsed.hostname.endsWith(ALLOWED_HOST_SUFFIX)) {
    return res.status(403).send("Forbidden: only Vercel Blob URLs are allowed");
  }

  try {
    const upstream = await fetch(url);
    if (!upstream.ok) {
      return res.status(upstream.status).send("Upstream error");
    }

    const html = await upstream.text();

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Content-Disposition", "inline");
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    return res.status(200).send(html);
  } catch (err) {
    console.error("[View] Proxy error:", err);
    return res.status(500).send("Error fetching results");
  }
};
