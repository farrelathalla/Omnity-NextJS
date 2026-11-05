/**
 * Portfolio screenshots for /karya and the homepage marquee.
 *
 *   node tools/capture-work.mjs [slug,slug]
 *
 * Opens each live site in local Chrome, scrolls through it (so lazy images and
 * reveal animations load), takes evenly spaced viewport shots at desktop
 * (1440x900 @1.5x) and mobile (390x844 @2x), and writes WebP files to
 * public/work/<slug>/{d,m}-<n>.webp. Re-run when a site changes.
 */
import { existsSync, mkdirSync } from "node:fs";
import { chromium } from "playwright-core";
import sharp from "sharp";

const SITES = [
  { slug: "saiga-conservation", url: "https://saiga-conservation.org/" },
  { slug: "lextera-survey", url: "https://lexterasurveyindonesia.com/" },
  { slug: "ncb-living", url: "https://nirwanacb.com/en" },
];
const SHOTS = { d: 6, m: 4 };

const only = process.argv[2]?.split(",");
const CHROME = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].find((p) => existsSync(p));
if (!CHROME) throw new Error("No Chrome/Edge binary found");

const browser = await chromium.launch({ executablePath: CHROME });

for (const site of SITES.filter((s) => !only || only.includes(s.slug))) {
  const dir = `public/work/${site.slug}`;
  mkdirSync(dir, { recursive: true });
  for (const kind of ["d", "m"]) {
    const mobile = kind === "m";
    const vp = mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 };
    const ctx = await browser.newContext({
      viewport: vp,
      deviceScaleFactor: mobile ? 2 : 1.5,
      isMobile: mobile,
      hasTouch: mobile,
    });
    const page = await ctx.newPage();
    await page.goto(site.url, { waitUntil: "load", timeout: 60000 });
    await page.waitForTimeout(4500);
    await page.mouse.move(vp.width / 2, vp.height / 2);

    // Wheel-scroll to the bottom to trigger lazy loading and reveals.
    let last = -1;
    let same = 0;
    for (let i = 0; i < 120 && same < 6; i++) {
      await page.mouse.wheel(0, 500);
      await page.waitForTimeout(160);
      const y = await page.evaluate(() => scrollY);
      same = y === last ? same + 1 : 0;
      last = y;
    }
    const maxY = await page.evaluate(() => scrollY);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(800);

    for (let i = 0; i < SHOTS[kind]; i++) {
      const y = Math.round((maxY * i) / (SHOTS[kind] - 1));
      await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: "instant" }), y);
      await page.waitForTimeout(1600);
      const png = await page.screenshot();
      await sharp(png)
        .resize({ width: mobile ? 780 : 1600 })
        .webp({ quality: 78 })
        .toFile(`${dir}/${kind}-${i}.webp`);
    }
    console.log(`${site.slug} ${kind}: ${SHOTS[kind]} shots (page height ${maxY + vp.height}px)`);
    await ctx.close();
  }
}
await browser.close();
