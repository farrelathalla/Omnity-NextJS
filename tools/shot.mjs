/**
 * Responsive screenshots + sanity checks (Playwright driving local Chrome/Edge).
 *
 *   node tools/shot.mjs <baseUrl> <outDir> [--w=1440,375] [--full] <route> [route...]
 *
 * For every route and width it scrolls the page (so reveal animations fire),
 * then reports: reveals still hidden, horizontal overflow, console errors,
 * failed requests. Exit code 1 if any check fails.
 */
import { existsSync, mkdirSync } from "node:fs";
import { chromium } from "playwright-core";

const args = process.argv.slice(2);
const flags = args.filter((a) => a.startsWith("--"));
const [base, outDir, ...routes] = args.filter((a) => !a.startsWith("--"));
const widths = (flags.find((f) => f.startsWith("--w="))?.slice(4) ?? "1440,375")
  .split(",")
  .map(Number);
const full = flags.includes("--full");
const height = Number(flags.find((f) => f.startsWith("--h="))?.slice(4) ?? 900);

if (!base || !outDir || routes.length === 0) {
  console.error("usage: node tools/shot.mjs <baseUrl> <outDir> [--w=1440,375] [--full] <route>...");
  process.exit(2);
}

const CHROME = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].find((p) => existsSync(p));
if (!CHROME) throw new Error("No Chrome/Edge binary found");

mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch({ executablePath: CHROME });
let failed = false;

for (const width of widths) {
  const mobile = width < 700;
  const ctx = await browser.newContext({
    viewport: { width, height: mobile ? 812 : height },
    deviceScaleFactor: mobile ? 2 : 1,
    isMobile: mobile,
    hasTouch: mobile,
  });
  for (const route of routes) {
    const page = await ctx.newPage();
    const errors = [];
    const dead = new Set();
    page.on("response", (r) => {
      if (r.status() >= 400) dead.add(`${r.status()} ${new URL(r.url()).pathname}`);
    });
    // "Failed to load resource" console lines carry no URL; the response log above has it.
    page.on("console", (m) => m.type() === "error" && !m.text().startsWith("Failed to load resource") && errors.push(m.text()));
    page.on("pageerror", (e) => errors.push(String(e)));
    page.on("requestfailed", (r) => errors.push(`request failed: ${r.url()}`));
    const res = await page.goto(base + route, { waitUntil: "load" }).catch((e) => ({ status: () => `ERR ${e.message}` }));
    await page.waitForTimeout(900);

    // Scroll through so IntersectionObserver reveals fire.
    const total = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < total; y += 380) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y);
      await page.waitForTimeout(90);
    }
    await page.waitForTimeout(900);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);

    const info = await page.evaluate(() => {
      const reveals = [...document.querySelectorAll("[data-reveal]")];
      const hidden = reveals.filter((e) => e.getAttribute("data-shown") !== "true").length;
      const overflow = document.documentElement.scrollWidth - document.documentElement.clientWidth;
      return { reveals: reveals.length, hidden, overflow };
    });

    const slug = (route.replace(/^\//, "").replace(/[\/?=&]/g, "_") || "home");
    const file = `${outDir}/${slug}-${width}.png`;
    await page.screenshot({ path: file, fullPage: full });
    // Viewport shot at the very bottom (footer reveal is invisible in full-page captures).
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(500);
    await page.screenshot({ path: file.replace(/\.png$/, "-end.png") });

    if (dead.size) errors.push(`dead URLs: ${[...dead].join(", ")}`);
    const bad = info.hidden > 0 || info.overflow > 1 || errors.length > 0 || String(res.status()) !== "200";
    if (bad) failed = true;
    console.log(
      `${bad ? "FAIL" : "ok  "} ${route} @${width}: status ${res.status()}, reveals still hidden ${info.hidden}/${info.reveals}, overflowX ${info.overflow}px${errors.length ? `, errors: ${errors.slice(0, 3).join(" | ")}` : ""}`,
    );
    await page.close();
  }
  await ctx.close();
}
await browser.close();
process.exit(failed ? 1 : 0);
