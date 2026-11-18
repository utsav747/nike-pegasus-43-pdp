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

* The live job also listens for Vercel's `vercel.deployment.success` event so it can run after each deploy, but I haven't seen that event arrive yet. Until it does, run the live job by hand from the Actions tab (Run workflow).
* GitHub shows an annotation that Node.js 20 actions are deprecated. It is a warning only; the run passes.
