// Lighthouse CI config. Throttling and screen settings come straight from the
// Web Platform Slow 4G Mobile Check Profile (perf/slow-4g-mobile-profile.yaml), and the
// pass/fail limits from speed-budget.json, so neither is copied by hand.
const fs = require("node:fs");
const path = require("node:path");
const yaml = require("js-yaml");

const profile = yaml.load(fs.readFileSync(path.join(__dirname, "perf/slow-4g-mobile-profile.yaml"), "utf8"));
const budget = JSON.parse(fs.readFileSync(path.join(__dirname, "speed-budget.json"), "utf8"));
const settings = profile.lighthouse_settings;

// Target URL: PERF_URL if set (e.g. the live https://nike-pegasus-43-pdp.vercel.app), else the
// local production build on port 3100. A remote URL skips starting the local server.
const target = process.env.PERF_URL || "http://localhost:3100/";
const isLocal = /^https?:\/\/(localhost|127\.0\.0\.1)(:|\/|$)/.test(target);

module.exports = {
  ci: {
    collect: {
      ...(isLocal ? { startServerCommand: "npm run start -- -p 3100", startServerReadyPattern: "Ready" } : {}),
      url: [target],
      numberOfRuns: 3,
      chromePath: process.env.CHROME_PATH,
      settings: {
        ...settings,
        onlyCategories: ["performance"],
        chromeFlags: "--headless=new --no-sandbox",
      },
    },
    assert: {
      assertions: {
        // speed-budget.json: performance_score_min (0-100 -> Lighthouse 0-1)
        "categories:performance": ["error", { minScore: budget.performance_score_min / 100, aggregationMethod: "median-run" }],
        // speed-budget.json: size_grid_shift_px_max = 0, so no layout shift at all is allowed.
        "cumulative-layout-shift": ["error", { maxNumericValue: 0, aggregationMethod: "pessimistic" }],
        // Load-speed limits for the Slow 4G / 4x CPU profile (Lighthouse "good" thresholds).
        "first-contentful-paint": ["error", { maxNumericValue: 1800, aggregationMethod: "median-run" }],
        "largest-contentful-paint": ["error", { maxNumericValue: 2500, aggregationMethod: "median-run" }],
        "total-blocking-time": ["error", { maxNumericValue: 200, aggregationMethod: "median-run" }],
        "speed-index": ["error", { maxNumericValue: 3400, aggregationMethod: "median-run" }],
      },
    },
    upload: { target: "filesystem", outputDir: isLocal ? ".lighthouseci/reports" : ".lighthouseci/reports-live" },
  },
};
