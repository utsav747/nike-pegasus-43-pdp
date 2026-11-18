// Records a phone trace with Chrome DevTools Protocol using the Web Platform Slow 4G
// Mobile Check Profile (375x812 @3x, mobile, 562.5ms latency, 1474.56/675 Kbps, 4x CPU)
// and reports every vertical movement of [data-testid="size-grid"] from first paint to load,
// every layout shift with its source nodes, and every size button's rendered size.
//
// Usage: node scripts/grid-shift-check.mjs [url] [--trace out.json] [--runs N]
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";
import yaml from "js-yaml";

const args = process.argv.slice(2);
const url = args.find((a) => /^https?:/.test(a)) ?? "http://localhost:3000";
const traceOut = args.includes("--trace") ? args[args.indexOf("--trace") + 1] : null;
const runs = args.includes("--runs") ? Number(args[args.indexOf("--runs") + 1]) : 3;

const root = path.dirname(fileURLToPath(import.meta.url));
const profile = yaml.load(fs.readFileSync(path.join(root, "..", "perf", "slow-4g-mobile-profile.yaml"), "utf8"));
const t = profile.lighthouse_settings.throttling;
const s = profile.lighthouse_settings.screenEmulation;
const budget = JSON.parse(fs.readFileSync(path.join(root, "..", "speed-budget.json"), "utf8"));

const chromePath =
  process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const recorder = () => {
  const log = { tops: [], shifts: [], fcp: null };
  new PerformanceObserver((list) => {
    for (const e of list.getEntries()) if (e.name === "first-contentful-paint") log.fcp = e.startTime;
  }).observe({ type: "paint", buffered: true });
  window.__gridLog = log;
  const sel = '[data-testid="size-grid"]';
  const sample = () => {
    const el = document.querySelector(sel);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY;
      const last = log.tops[log.tops.length - 1];
      if (!last || last.top !== top) log.tops.push({ t: performance.now(), top });
    }
    if (document.readyState !== "complete" || performance.now() < 15000) requestAnimationFrame(sample);
  };
  requestAnimationFrame(sample);
  new MutationObserver(sample).observe(document, { childList: true, subtree: true, attributes: true });
  new PerformanceObserver((list) => {
    for (const e of list.getEntries()) {
      log.shifts.push({
        t: e.startTime,
        value: e.value,
        sources: (e.sources || []).map((src) => ({
          node: src.node
            ? `${src.node.nodeName}${src.node.dataset?.testid ? `[data-testid=${src.node.dataset.testid}]` : ""}${src.node.className && typeof src.node.className === "string" ? "." + src.node.className.split(" ").slice(0, 3).join(".") : ""}`
            : "(removed node)",
          from: [src.previousRect.y, src.previousRect.height],
          to: [src.currentRect.y, src.currentRect.height],
        })),
      });
    }
  }).observe({ type: "layout-shift", buffered: true });
};

const browser = await puppeteer.launch({ executablePath: chromePath, headless: true, args: ["--no-sandbox"] });
let worst = 0;
let failed = false;
for (let i = 0; i < runs; i++) {
  const context = await browser.createBrowserContext();
  const page = await context.newPage();
  const cdp = await page.createCDPSession();
  await cdp.send("Network.enable");
  await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
  await cdp.send("Network.emulateNetworkConditions", {
    offline: false,
    latency: t.requestLatencyMs,
    downloadThroughput: (t.downloadThroughputKbps * 1024) / 8,
    uploadThroughput: (t.uploadThroughputKbps * 1024) / 8,
  });
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: t.cpuSlowdownMultiplier });
  await page.emulate({
    viewport: { width: s.width, height: s.height, deviceScaleFactor: s.deviceScaleFactor, isMobile: s.mobile, hasTouch: s.mobile },
    userAgent:
      "Mozilla/5.0 (Linux; Android 11; moto g power (2022)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36",
  });
  await page.evaluateOnNewDocument(recorder);
  if (traceOut && i === 0) await page.tracing.start({ path: traceOut, screenshots: true });
  await page.goto(url, { waitUntil: "load", timeout: 120000 });
  await new Promise((r) => setTimeout(r, 3000)); // let late fonts/images/hydration settle
  if (traceOut && i === 0) await page.tracing.stop();

  const result = await page.evaluate(() => {
    const log = window.__gridLog;
    const missing = ["size-grid", "size-button", "size-button-sold-out", "main-photo", "price"].filter(
      (id) => !document.querySelector(`[data-testid="${id}"]`),
    );
    const buttons = [...document.querySelectorAll('[data-testid="size-button"],[data-testid="size-button-sold-out"]')].map(
      (b) => Math.min(b.getBoundingClientRect().width, b.getBoundingClientRect().height),
    );
    const cls = log.shifts.reduce((a, s) => a + s.value, 0);
    // Count only what a shopper can see: layout before first paint (e.g. while a
    // render-blocking stylesheet loads) is never drawn. Start from the grid's
    // position at first contentful paint.
    const fcp = log.fcp ?? 0;
    const before = log.tops.filter((x) => x.t <= fcp);
    const tops = [...before.slice(-1), ...log.tops.filter((x) => x.t > fcp)];
    return { fcp, tops, shifts: log.shifts, cls, missing, buttonCount: buttons.length, minButton: Math.min(...buttons) };
  });
  let moved = 0;
  for (let k = 1; k < result.tops.length; k++) moved += Math.abs(result.tops[k].top - result.tops[k - 1].top);
  worst = Math.max(worst, moved);
  console.log(`\nRun ${i + 1} (first paint ${Math.round(result.fcp)}ms): grid top positions ${JSON.stringify(result.tops.map((x) => `${x.top}px@${Math.round(x.t)}ms`))}`);
  console.log(`  size-grid total movement: ${moved}px   CLS: ${result.cls.toFixed(4)}`);
  for (const sh of result.shifts) console.log(`  shift ${sh.value.toFixed(4)} @${Math.round(sh.t)}ms ${JSON.stringify(sh.sources)}`);
  console.log(`  size buttons: ${result.buttonCount}, smallest side ${result.minButton}px`);
  if (result.missing.length) console.log(`  MISSING watched elements: ${result.missing.join(", ")}`);
  if (result.missing.length || moved > budget.size_grid_shift_px_max || !(result.minButton >= budget.size_button_min_px)) failed = true;
  await context.close();
}
await browser.close();
console.log(`\nWorst size-grid movement over ${runs} runs: ${worst}px (budget ${budget.size_grid_shift_px_max}px)`);
console.log(failed ? "GRID CHECK: FAIL" : "GRID CHECK: PASS");
process.exit(failed ? 1 : 0);
