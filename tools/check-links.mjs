/**
 * Crawls the site from "/" and the sitemap, following every internal link, and
 * reports anything that is not HTTP 200 (and anchors whose #id is missing).
 *
 *   node tools/check-links.mjs http://localhost:3100
 */
const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const seen = new Map(); // path -> status
const queue = ["/"];
const referrers = new Map(); // path -> first page that linked to it
const anchorsToCheck = []; // [page, path, hash]
const idsByPath = new Map();

const strip = (u) => u.split("#")[0].split("?")[0];

// Seed from the sitemap too, so pages nobody links to are still covered.
try {
  const xml = await (await fetch(`${base}/sitemap.xml`)).text();
  for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const u = new URL(m[1]);
    queue.push(u.pathname);
  }
} catch {
  console.warn("could not read sitemap.xml");
}

while (queue.length) {
  const path = strip(queue.shift());
  if (seen.has(path)) continue;
  let res;
  try {
    res = await fetch(base + path, { redirect: "manual" });
  } catch (e) {
    seen.set(path, `ERR ${e.message}`);
    continue;
  }
  seen.set(path, res.status);
  if (res.status !== 200) continue;
  if (!(res.headers.get("content-type") ?? "").includes("text/html")) continue;
  const html = await res.text();
  idsByPath.set(path, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
  for (const m of html.matchAll(/<a\s[^>]*?href="([^"]+)"/g)) {
    const href = m[1].replace(/&amp;/g, "&");
    if (/^(mailto:|tel:|javascript:|https?:\/\/)/.test(href)) {
      if (href.startsWith(base)) queue.push(href.slice(base.length) || "/");
      continue;
    }
    const abs = new URL(href, base + path);
    const target = abs.pathname;
    if (!referrers.has(target)) referrers.set(target, path);
    if (abs.hash) anchorsToCheck.push([path, target, abs.hash.slice(1)]);
    queue.push(target);
  }
}

let bad = 0;
for (const [p, status] of [...seen].sort()) {
  const ok = status === 200;
  if (!ok) {
    bad++;
    console.log(`FAIL ${status}  ${p}   (linked from ${referrers.get(p) ?? "sitemap"})`);
  }
}
for (const [page, target, id] of anchorsToCheck) {
  const ids = idsByPath.get(target);
  if (ids && id && !ids.has(id)) {
    bad++;
    console.log(`FAIL missing #${id} on ${target}   (linked from ${page})`);
  }
}
console.log(`${seen.size} pages checked, ${bad} problem(s)`);
process.exit(bad ? 1 : 0);
