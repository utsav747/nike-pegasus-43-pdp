# Build prompt

The prompt this project was built from, verbatim.

---

Build a mobile product page for the Nike Pegasus 43 as a Next.js (App Router) app styled with Tailwind CSS, in TypeScript, in a git repo that can be pushed to GitHub. Follow Nike brand guidelines: Nike black #111111, white, neutral greys, bold condensed uppercase headline style (Helvetica Neue / Arial fallback), flat and minimal, no shadows or rounded cards. Use server components by default; mark only the size selector and the two expandable sections "use client". Put brand colors in the Tailwind config and use Tailwind classes for fixed sizes (h-[300px], size-[44px], gap-1).

Sources of truth: the Pegasus 43 Product Page Layout Plan (v2) and this prompt; if they conflict, this prompt's numbers win and report the conflict. Read stock data from the JSON file, copied into the project (e.g. data/).

Canvas: 375px wide. Every section is full width with a FIXED height so nothing shifts while images or fonts load. Set explicit height, min-height and overflow on every container; use font fallbacks with matched metrics (next/font) and next/image with explicit width and height.

Order and heights (total 1,220px collapsed):
1. Product image, 300px: 375x300 container, #F5F5F5 placeholder, object-fit contain, centered.
2. Title, 50px: "Nike Pegasus 43", one line, bold, #111111, ellipsis on overflow. Under it inside the same 50px a small grey line (12px, #757575): "Style HV7521-001, Black/White-Volt" (SKU/style code).
3. Price, 50px: "$140", medium weight, #111111, left aligned.
4. Size grid, 220px.
5. Tech copy, 300px.
6. Reviews, 300px, specific to this product.

Size grid: 26 sizes, men's 3.5 to 16 in 0.5 steps, ascending, in the JSON display order. 4 rows of 7 buttons; last row has 5 buttons and 2 empty slots. Each button exactly 44x44, no extra padding. 4px gap between all neighbors, horizontally and vertically. Grid padding 21px left, 22px right, 16px top and bottom (21+7x44+6x4+22=375; height 4x44+3x4+32=220).

Size states:
- In stock (17): white bg, dark grey outline #757575, dark text, hover outline #111111. Selected: solid #111111 fill, white text. One selection at a time.
- Low stock (men's 4, 9, 9.5, 11, 15): same outline and selected state, plus note "Selling out fast" INSIDE the button below the size number, about 7px, within the 44x44 box.
- Sold out (men's 3.5, 10, 15.5, 16): lighter grey outline and text (#CCCCCC / #BDBDBD), white bg, no hover, no click, no selected state, cursor not-allowed, disabled.

Tech copy and reviews: each stays in its 300px box with NO inner scrolling. At the bottom a plain text link with no border or box: "Read more" (tech copy) and "See more" (reviews). Click expands the section to show everything and the link becomes "Show less". Collapsed height never changes until the user acts.

Placeholders for image, tech copy and reviews. Accessible: labels like "Men's 9, selling out fast", visible focus rings.

Hand back: Next.js project with page at app/page.tsx, components ProductImage, ProductTitle, ProductPrice, SizeGrid, TechCopy, Reviews. git init with .gitignore (node_modules, .next) and a first commit. Summary: measured height of each section and total (1,220px), counts in-stock/low/sold-out from the JSON (17/5/4), deviations. Before handing back run npm run build and npm run lint and check at 375px (7,7,7,5 grid with 4px gaps, 5 low-stock notes, sold-out inert, selection works, expand/collapse without inner scroll, no layout jump on Slow 3G).
