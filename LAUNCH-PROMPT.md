# Launch prompt

A detailed version of the prompt used to update this page to the 8 December 2026 stock snapshot and make it a live page on Vercel. It is written so someone could hand it to an AI coding agent (or a developer) and get the same result.

The original request was:

> Use this to update the stock information and rehash the product page that we have been building. Make sure to keep the behaviour of size buttons consistent to what we have been working towards. Enable the behaviour of active/available size buttons to become a filled button if selected. Run this update and then make this page a live page using Vercel. I have already signed up for Vercel.

---

## Prompt

You are working on the Nike Pegasus 43 mobile product page in the repo `github.com/utsav747/nike-pegasus-43-pdp` (Next.js App Router, TypeScript, Tailwind CSS). The build rules are in `PROMPT.md`, and the decisions and measurements so far are in `NOTES.md` and `PERFORMANCE-NOTES.md`. Update the page's stock data, keep every size-button rule the page already has, make sure selected sizes show as filled buttons, check that nothing regressed, and then put the page live on Vercel.

### 1. Replace the stock data

- Source file: `Pegasus Size and Stock Snapshot, 8 December 2026.json`, in the folder that holds the repo clone.
- Replace the contents of `data/pegasus-43-stock.json` with it. Keep the same schema: 26 records with `sku`, `style_code`, `product_name`, `colorway`, `price`, `size_label`, `size_us_men`, `size_us_women`, `size_eu`, `display_order`, `in_stock`, `stock_quantity`, `stock_status` and `launch_date`.
- Confirm that `lib/stock.ts` still parses it without changes, and that it is still sorted by `display_order`. Stock is never hardcoded in components.
- Check the data before using it: `display_order` runs 1 to 26, sizes ascend from men's 3.5 to 16 in half sizes, and for every record `stock_status = "sold_out"` matches `in_stock = false` and `stock_quantity = 0`.
- Expected counts:

  | Status | Count | Men's sizes |
  |--------|------:|-------------|
  | In stock | 10 | 5.5, 6.5, 7, 7.5, 8, 9.5, 10.5, 11, 12, 12.5 |
  | Low stock | 7 | 3.5, 4, 5, 8.5, 13, 13.5, 14.5 |
  | Sold out | 9 | 4.5, 6, 9, 10, 11.5, 14, 15, 15.5, 16 |

  If the file gives different numbers, stop and report them rather than guessing.
- Update the stock table in `NOTES.md`, and note the previous counts (17 in stock, 5 low, 4 sold out).

### 2. Keep the size-button behaviour

At a 375px viewport, nothing about the grid changes:

- 26 buttons in ascending size order, in rows of 7, 7, 7 and 5 (the last row has 2 empty slots).
- Every button exactly 44x44px with no extra padding; 4px gaps horizontally and vertically.
- Grid padding of 21px left, 22px right, and 16px top and bottom (21 + 7×44 + 6×4 + 22 = 375; 16 + 4×44 + 3×4 + 16 = 220).
- **In stock:** white background, #757575 outline, #111111 text, #111111 outline on hover.
- **Low stock:** same as in stock, plus a "Selling out fast" note (about 7px) inside the button under the size number. It must fit inside the 44x44 box without overflowing.
- **Sold out:** #CCCCCC outline, #BDBDBD text, white background, `disabled`, `cursor: not-allowed`, no hover and no selected state. A forced click must not select it.
- Accessible names such as "Men's 13, selling out fast" and "Men's 9, sold out", visible focus rings, and a polite live region announcing the selection.

Phones narrower than 375px (many Android phones are 360px wide) must not cut off the right-hand column. Below 375px, drop the side padding to 16px and let the square buttons shrink (`grid-cols-[repeat(7,minmax(0,44px))]`, `aspect-square`) so all 7 columns fit with 4px gaps. The section must stay 220px tall, and the low-stock note must still fit at 320px.

### 3. Selected sizes become filled buttons

- Clicking an in-stock or low-stock size fills it with Nike black (#111111) and turns its text white, including the "Selling out fast" note. Set `aria-pressed="true"` on it.
- Only one size is selected at a time. Selecting another size moves the fill to it.
- Sold-out sizes can never be selected, and clicking one leaves the current selection alone.
- Selecting a size must not change any size or position (no layout shift).

### 4. Keep the layout fixed

- Section heights at 375px, collapsed: image 300, title 50, price 50, size grid 220, tech copy 300, reviews 300, a total of **1,220px**.
- No horizontal page scroll at 375, 360 or 320px.
- Zero layout shift from first paint to load, including on a slow network.

### 5. Check everything before shipping

Run all of these and report the results:

1. `npm run build`: passes.
2. `npm run lint`: no warnings or errors.
3. `npm run start -- -p 3100`, then `npm run perf:grid`. Over 3 runs with the Web Platform Slow 4G Mobile Check Profile (`perf/slow-4g-mobile-profile.yaml`), the size grid must move **0px**, CLS must be 0, and the smallest button side must be at least 44px (`speed-budget.json`).
4. Stop that server, then `npm run perf:lhci`. Lighthouse CI must pass every assertion in `lighthouserc.cjs`: performance score at least 90, CLS 0, FCP under 1.8s, LCP under 2.5s, TBT under 200ms, Speed Index under 3.4s (median of 3 runs).
5. In a headless browser at 375, 360 and 320px wide, measure the button size, the row counts (7/7/7/5), the gaps, the section heights, the page total, that the notes don't overflow, and the selection behaviour in step 3. Take a screenshot of the grid with a size selected.

### 6. Commit and push

Commit with a clear message to `main` of `utsav747/nike-pegasus-43-pdp` and push. Don't commit `.lighthouseci/` or `.vercel/`.

### 7. Make the page live on Vercel

The user already has a Vercel account.

1. Install the Vercel CLI if it's missing: `npm install --global vercel@latest`, then check `vercel --version`.
2. `vercel login`. It prints a device link and code. Give the user the exact link and code to approve in their browser, wait for them, then confirm with `vercel whoami`.
3. Next.js must be on a patched release. Vercel refuses to deploy versions with known vulnerabilities (it rejected 15.5.4). Upgrade `next` and `eslint-config-next` to the latest patch of the same minor version (15.5.29 at the time), then run the checks in section 5 again before deploying.
4. From the repo folder, run `vercel link` and then `vercel deploy --prod`.
5. Connect the GitHub repo so that every push to `main` deploys production: `vercel git connect`. If Vercel's GitHub app isn't allowed to see the repo, give the user exact steps (Vercel project, Settings, Git, Connect `utsav747/nike-pegasus-43-pdp`, then allow access to the repo in GitHub).
6. Check the live URL without signing in: it returns 200, it shows 9 sold-out buttons and 7 "Selling out fast" notes, and it has the latest code.

### 8. Hand back

A short note with:

- The live URL.
- What changed in the stock counts (before and after, with the sizes).
- Confirmation that the size-button behaviour and the 1,220px layout are unchanged, with the grid check and Lighthouse results.
- Anything you had to change to deploy (such as the Next.js upgrade) and whether GitHub pushes now auto-deploy.

---

Result: live at https://nike-pegasus-43-pdp.vercel.app, deployed automatically from `main`.
