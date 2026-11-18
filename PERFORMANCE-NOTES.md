# Performance notes: size grid on Slow 4G

The size grid doesn’t move on a Slow 4G phone. It sits 400px from the top from first paint to the end of loading, with layout shift at 0 before and after. No layout fix was needed, because the photo, title and price already have fixed heights of 300, 50 and 50px, and no web font downloads. The repo is [nike-pegasus-43-pdp](https://github.com/utsav747/nike-pegasus-43-pdp), commit 54c6aea. It now has the Lighthouse CI config, a grid-movement check and a GitHub workflow. The workflow has run on GitHub on every push since: see the Actions results below.

Test conditions (your Slow 4G profile): 375x812 at 3x mobile, 150 ms round trip, 1,638.4 Kbps, 4x slower CPU.

Speed limits:

* Layout shift 0
* First paint under 1.8 s
* Largest paint under 2.5 s
* Blocking time under 200 ms
* Speed index under 3.4 s
* Performance score at least 90
* Grid movement 0px, buttons at least 44px

The run scored 97 to 100, with first paint around 0.65 s and largest paint around 1.75 s. Re-run the check once the real photo replaces the placeholder.

## Live page vs local build

Checked on 18 November 2026, both on the same code (commit with the narrow-phone grid fix) and the same Slow 4G profile. Live is https://nike-pegasus-43-pdp.vercel.app, served by Vercel. Local is `next start` on port 3100 on a MacBook. Lighthouse numbers are the median of 3 runs.

| Check | Limit | Local | Live (Vercel) |
|---|---|---|---|
| Performance score | at least 90 | 100 (99 to 100) | 100 (95 to 100) |
| First paint | under 1.8 s | 0.64 s | 0.79 s |
| Largest paint | under 2.5 s | 1.74 s | 0.97 s |
| Blocking time | under 200 ms | 66 ms | 70 ms |
| Speed index | under 3.4 s | 0.64 s | 0.93 s |
| Layout shift | 0 | 0 | 0 |
| Server response | | 9 to 33 ms | 52 to 80 ms |
| Grid movement (3 runs) | 0px | 0px | 0px |
| Grid top | | 400px | 400px |
| Smallest button | at least 44px | 44px | 44px |

Both pass every limit. The grid sits at 400px from first paint on the live page too, so it loads the same way.

Differences, honestly:

* First paint is about 0.15 s later live, because the request goes over the internet to Vercel instead of to the same machine.
* Largest paint is about 0.8 s earlier live. My best guess is Vercel's Brotli compression and HTTP/2, which make the simulated Slow 4G download smaller. I haven't confirmed that.
* One of the three live runs had 270 ms of blocking time, over the 200 ms limit, and scored 95. The other two were 70 ms. The check uses the median, so it passes. Blocking time is CPU work in the test browser, so it varies between runs.

Full live report: [lighthouse-live-slow4g.html](https://nike-pegasus-43-pdp.vercel.app/reports/lighthouse-live-slow4g.html) (also in `public/reports/`).

How to run the checks against any address:

```bash
PERF_URL=https://nike-pegasus-43-pdp.vercel.app npm run perf:lhci
PERF_URL=https://nike-pegasus-43-pdp.vercel.app npm run perf:grid
npm run perf:live   # both of the above
```

Without `PERF_URL` both checks use the local build at http://localhost:3100, as before. The GitHub workflow now also runs both checks against the live page each time Vercel reports a successful production deploy.

## GitHub Actions results

The "Slow 4G mobile check" workflow (`.github/workflows/lighthouse.yml`) runs on GitHub's own Ubuntu machines, so it proves the checks pass away from this Mac.

| Run | Trigger | What it checked | Result |
|---|---|---|---|
| [44378464333](https://github.com/utsav747/nike-pegasus-43-pdp/actions/runs/44378464333) | push to main | build, Lighthouse CI and grid check on the local build | Passed (1m46s) |
| [44379061361](https://github.com/utsav747/nike-pegasus-43-pdp/actions/runs/44379061361) | "Run workflow" button | Lighthouse CI and grid check on https://nike-pegasus-43-pdp.vercel.app | Passed (1m14s), grid moved 0px |

Every push to main since the checks were added (8 runs up to 18 November 2026) passed. No fix was needed for the Chrome path: the workflow sets `CHROME_PATH=/usr/bin/google-chrome`, which exists on the GitHub Ubuntu runner.

Caveats:

* The live job starts by itself after each Vercel deploy: Vercel posts a commit status named "Vercel" when the deploy completes, and the workflow listens for it (`on: status`). Proven on 18 November 2026: [run 44388238039](https://github.com/utsav747/nike-pegasus-43-pdp/actions/runs/44388238039) and [run 44390245094](https://github.com/utsav747/nike-pegasus-43-pdp/actions/runs/44390245094) both started on their own after a deploy and passed. Run it by hand with Run workflow if you ever need to.
* GitHub shows an annotation that Node.js 20 actions are deprecated. It is a warning only; the run passes.

## Real photo (18 November 2026)

The placeholder SVG is replaced by the real product photo (`public/pegasus-43.webp`, 900x900, 33 KB served), through `next/image` without `unoptimized`. The 375x300 box, 300x300 `object-contain` image and #F5F5F5 background are unchanged.

Live page, same Slow 4G profile, median of 3 runs, with `npm run perf:live`:

| Check | Limit | Placeholder | Real photo |
|---|---|---|---|
| Largest element | | `main-photo` (the SVG) | `main-photo` (the photo): `section > img`, "Nike Pegasus 43 running shoes, three-quarter view" |
| Largest paint (LCP) | under 2.5 s | 0.97 s | 1.62 s |
| First paint | under 1.8 s | 0.79 s | 0.82 s |
| Blocking time | under 200 ms | 70 ms | 123 ms |
| Speed index | under 3.4 s | 0.93 s | 0.83 s |
| Performance score | at least 90 | 100 | 99 |
| Layout shift | 0 | 0 | 0 |
| Grid movement | 0px | 0px | 0px |

LCP is about 0.65 s later because the photo is now a real 33 KB download. It still passes. The first run after a fresh deploy is the slowest (2.07 s here), so judge the median.

What went wrong first, so it isn't repeated: the first version used the original 1080x1080 AVIF. Vercel served that file back unresized for every size, and decoding it on the 4x slower CPU pushed blocking time to about 300 ms, over the 200 ms limit (the Lighthouse step failed). Fix: a 900x900 WebP (3x the 300px slot) with the image sizes capped at 900 in `next.config.ts`. Blocking time dropped to 74 to 144 ms on the live page.

The grid never moved at any point, because the image has fixed width, height and box.

Report for this run: [lighthouse-live-slow4g.html](https://nike-pegasus-43-pdp.vercel.app/reports/lighthouse-live-slow4g.html).
