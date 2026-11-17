/**
 * Screenshots of the interactive portfolio demos, for /karya cards, the
 * homepage marquee, and Open Graph images.
 *
 *   npm run dev                      (or npm start after a build)
 *   node tools/capture-demos.mjs [baseUrl] [slug,slug]
 *
 * For each demo it opens /karya/<slug>, screenshots the demo viewport
 * ([data-demo-viewport]) as d-0, then clicks [data-shot="1"], [data-shot="2"]
 * in order and saves d-1, d-2 (pressing Escape in between to close dialogs).
 * Phone demos also save the phone screen ([data-phone-screen]) as m-<n>.
 * Output: public/work/<slug>/{d,m}-<n>.webp (1600x1000 and 780x1688).
 */
import { existsSync, mkdirSync } from "node:fs";
import { chromium } from "playwright-core";
import sharp from "sharp";

const DEMOS = [
  "omnipay-console",
  "c-access",
  "resort-academy",
  "cleanvy-asalta",
  "cipma",
  "linggar-audio",
  "lumei",
  "codelearn",
  "fun-bpk-2020",
];

const PHONE = ["c-access"];
const base = process.argv[2] ?? "http://localhost:3005";
const only = process.argv[3]?.split(",");
const CHROME = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].find((p) => existsSync(p));
if (!CHROME) throw new Error("No Chrome/Edge binary found");

const browser = await chromium.launch({ executablePath: CHROME });

async function save(locator, file, width, height) {
  const png = await locator.screenshot({ animations: "disabled" });
  await sharp(png).resize({ width, height, fit: "cover", position: "top" }).webp({ quality: 80 }).toFile(file);
}

for (const slug of DEMOS.filter((s) => !only || only.includes(s))) {
  const dir = `public/work/${slug}`;
  mkdirSync(dir, { recursive: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: PHONE.includes(slug) ? 3 : 2 });
  const page = await ctx.newPage();
  await page.goto(`${base}/karya/${slug}`, { waitUntil: "networkidle", timeout: 120000 });
  const stage = page.locator("[data-demo-viewport]");
  await stage.scrollIntoViewIfNeeded();
  await page.waitForTimeout(2500); // lazy chunk, images, entrance animations

  const phone = page.locator("[data-phone-screen]");
  const isPhone = (await phone.count()) > 0;

  await save(stage, `${dir}/d-0.webp`, 1600, 1000);
  if (isPhone) await save(phone, `${dir}/m-0.webp`, 780, 1688);
  let n = 1;
  for (; ; n++) {
    const target = page.locator(`[data-shot="${n}"]`).first();
    if ((await target.count()) === 0) break;
    await target.click();
    await page.waitForTimeout(1400);
    if (isPhone) await save(phone, `${dir}/m-${n}.webp`, 780, 1688);
    else await save(stage, `${dir}/d-${n}.webp`, 1600, 1000);
    await page.keyboard.press("Escape");
    await page.waitForTimeout(300);
  }
  console.log(`${slug}: ${isPhone ? `d-0 + ${n} phone screens` : `${n} desktop shots`}`);
  await ctx.close();
}
await browser.close();
