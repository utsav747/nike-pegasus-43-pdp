# Nike Pegasus 43 product page: notes

## How to run

```bash
npm install
npm run dev
```

Open http://localhost:3000 in Chrome, open DevTools, switch on device mode and set the width to 375px.
Production check: `npm run build && npm run start`.

## Measured results (Chromium, 375px viewport)

Measured with Playwright, `getBoundingClientRect()` on each `<main> > section`.

| # | Section | Target | Measured |
|---|---------|-------:|---------:|
| 1 | Product image | 300px | 300px |
| 2 | Title + style line | 50px | 50px |
| 3 | Price | 50px | 50px |
| 4 | Size grid | 220px | 220px |
| 5 | Tech copy (collapsed) | 300px | 300px |
| 6 | Reviews (collapsed) | 300px | 300px |
| | **Total** | **1,220px** | **1,220px** |

Expanded, tech copy measured 697px and reviews 657px; both returned to exactly 300px on "Show less".

Size grid:
- Rows of 7, 7, 7, 5 buttons; every button 44x44.
- Horizontal and vertical gaps all 4px; left padding 21px, right 22px, top/bottom 16px.
- No horizontal page scroll (document width 375px).

Stock counts, read from `data/pegasus-43-stock.json` (not hardcoded). Data is the 8 December 2026 size and stock snapshot:

| Status | Count | Men's sizes |
|--------|------:|-------------|
| In stock | 10 | 5.5, 6.5, 7, 7.5, 8, 9.5, 10.5, 11, 12, 12.5 |
| Low stock | 7 | 3.5, 4, 5, 8.5, 13, 13.5, 14.5 |
| Sold out | 9 | 4.5, 6, 9, 10, 11.5, 14, 15, 15.5, 16 |

Previous snapshot (17 in stock, 5 low stock, 4 sold out) was replaced on 19 November 2026.

## Checks run

- `npm run build`: passes.
- `npm run lint`: no warnings or errors.
- 7 "Selling out fast" notes, each inside its 44x44 button (no overflow).
- Sold-out buttons are `disabled`, `cursor-not-allowed`, no hover; a forced click does not select them.
- Selection: clicking 8 (in stock) then 13 (low stock) leaves only 13 pressed (`aria-pressed`), filled #111111 with white text, "Selling out fast" note white inside the fill. Clicking sold-out 9 afterwards changes nothing. Grid top stays at 400px and page total stays 1,220px.
- Expand/collapse: the clipped content uses `overflow: hidden` (never scrolls); the link toggles "Read more"/"See more" and "Show less".
- Slow 3G (Chrome DevTools preset values, 2s latency, 500 kb/s): section heights were already 300/50/50/220/300/300 at first response, and cumulative layout shift was 0.

## Decisions

- **Server components by default.** `app/page.tsx`, `ProductImage`, `ProductTitle`, `ProductPrice` are server components. Only `SizeGrid`, `TechCopy` and `Reviews` are `"use client"`. `components/Expandable.tsx` is a shared shell imported only by those two, so it has no directive of its own.
- **Stock data** is copied to `data/pegasus-43-stock.json` and read through `lib/stock.ts`, sorted by `display_order`. Name, style code, colorway and price also come from the JSON.
- **Brand colors** live in `tailwind.config.ts` under `nike.*` (black #111111, greys #F5F5F5 / #E5E5E5 / #CCCCCC / #BDBDBD / #757575, volt #CEFF00). Flat: no shadows, no rounded corners.
- **CSS is inlined** into the HTML (`experimental.inlineCss` in `next.config.ts`), so the fixed heights apply before any stylesheet request finishes. Without it, a Slow 3G load briefly laid out unstyled content.
- **Size grid** uses `grid-cols-[repeat(7,44px)] grid-rows-[repeat(4,44px)] gap-1`, buttons `size-[44px] p-0` with a 1px border inside the box. A visually hidden legend reads "Select size, US men's", and a polite live region announces the selection.
- **Collapsed sections** show a short white fade at the clip edge so cut-off text reads as "more below". The link is plain underlined text with no border or box.
- **Headlines** (title, section headings) are bold, uppercase, slightly tight tracking, using the condensed stack.

## Deviations and open items

1. **Fonts: no next/font.** Helvetica Neue is not on Google Fonts and no licensed font file was provided, so the page uses a system stack (`"Helvetica Neue", Helvetica, Arial, sans-serif`). Nothing is downloaded, so there is no font swap and no layout shift, which is the goal next/font serves here. If Nike's licensed font files are added, switch to `next/font/local` with `adjustFontFallback`.
2. **Layout Plan (v2) was not available** in the project files, so this prompt was the only source of truth. The earlier static `pegasus-43.html` had a **296px** size grid (it also showed women's sizes); this build uses the prompt's **220px**, as the prompt's numbers win.
3. **Placeholders:** product image (SVG in `public/`), tech copy and the six reviews are placeholders, labelled as such in code and on the page ("Sample reviewer A"…). Replace before launch.
4. **Image** uses `next/image` with `unoptimized`, because the placeholder is an SVG. Remove `unoptimized` when a real JPG/PNG/WebP is used.
5. **`next lint`** is deprecated in Next.js 15.5 (removed in 16) but still works and is what the prompt asks for; `npx @next/codemod@canary next-lint-to-eslint-cli .` migrates it later.
6. **Size labels** show the men's size only (no "M"/"W" prefix), because the 44px buttons have no room for it; the hidden legend and each button's label say "Men's".

## Slow 4G phone check (size grid stability)

Settings come from `perf/slow-4g-mobile-profile.yaml`, a copy of the Web Platform Slow 4G Mobile Check Profile (owner Diego Salazar; change it upstream, not here).

- Network: Slow 4G, 150 ms round trip, 1,638.4 Kbps (simulated). DevTools traces use 562.5 ms request latency, 1,474.56 Kbps down, 675 Kbps up.
- CPU: 4x slowdown.
- Screen: 375 x 812 CSS px, 3x pixel density, mobile on.

Limits:

| Limit | Value | Where |
|---|---:|---|
| Performance score | at least 90 | `speed-budget.json` |
| Size grid movement | 0 px | `speed-budget.json` |
| Smallest size button side | at least 44 px | `speed-budget.json` |
| Cumulative layout shift | 0 | `lighthouserc.cjs` |
| First contentful paint | 1,800 ms max | `lighthouserc.cjs` |
| Largest contentful paint | 2,500 ms max | `lighthouserc.cjs` |
| Total blocking time | 200 ms max | `lighthouserc.cjs` |
| Speed index | 3,400 ms max | `lighthouserc.cjs` |

How to run it:

```bash
npm run build
npm run perf:lhci                                   # Lighthouse CI, 3 runs, asserts the limits
npx next start -p 3100 & npm run perf:grid          # DevTools trace, fails if the size grid moves at all
```

`.github/workflows/lighthouse.yml` runs both on every push.

Results (18 Nov 2026, production build): performance 97 to 100 over six Lighthouse runs, FCP 0.6 to 0.7 s, LCP 1.7 to 1.8 s, TBT 16 to 177 ms, CLS 0. The DevTools trace placed the size grid's top edge at 400 px from first paint to fully loaded, so it moved 0 px. The photo box (300 px), title (50 px) and price (50 px) all have fixed heights, CSS is inlined, and no web font is downloaded. As a result, a late photo, font or price cannot push the grid. To check that the trace would catch a shift, a test page with an unsized late image and late price was run through it, and it reported 320 px of movement.

The five `data-testid` markers the profile reads (`size-grid`, `size-button`, `size-button-sold-out`, `main-photo`, `price`) were added. They do not change the layout.

Open item: Lighthouse picks a tech-copy paragraph as the largest content element, not `main-photo`. Chrome ignores the placeholder SVG because it carries too little image detail. This should change once the real 1,125 px product photo replaces the placeholder. Re-run the check at that point.
