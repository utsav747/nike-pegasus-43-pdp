"use client";

import { useState } from "react";
import type { SizeStock } from "@/lib/stock";

type Props = { sizes: SizeStock[] };

function sizeText(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

function ariaLabel(s: SizeStock): string {
  const base = `Men's ${sizeText(s.size_us_men)}`;
  if (s.stock_status === "sold_out") return `${base}, sold out`;
  if (s.stock_status === "low_stock") return `${base}, selling out fast`;
  return base;
}

/**
 * 4. Size grid, fixed 220px.
 * 7 columns of 44px buttons with 4px gaps: 21 + 7*44 + 6*4 + 22 = 375px wide.
 * 4 rows: 16 + 4*44 + 3*4 + 16 = 220px tall. 26 sizes, so the last row has 5 buttons and 2 empty slots.
 */
export default function SizeGrid({ sizes }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const selectedSize = sizes.find((s) => s.sku === selected);

  return (
    <section
      aria-labelledby="size-legend"
      className="relative h-[220px] min-h-[220px] w-full overflow-hidden pb-4 pl-[21px] pr-[22px] pt-4"
    >
      <fieldset className="m-0 h-[188px] min-h-[188px] min-w-0 overflow-hidden border-0 p-0">
        <legend id="size-legend" className="sr-only">
          Select size, US men&apos;s
        </legend>
        <div className="grid h-[188px] grid-cols-[repeat(7,44px)] grid-rows-[repeat(4,44px)] gap-1">
          {sizes.map((s) => {
            const soldOut = s.stock_status === "sold_out";
            const lowStock = s.stock_status === "low_stock";
            const isSelected = !soldOut && selected === s.sku;

            const state = soldOut
              ? "cursor-not-allowed border-nike-grey-300 bg-nike-white text-nike-grey-400"
              : isSelected
                ? "border-nike-black bg-nike-black text-nike-white"
                : "border-nike-grey-600 bg-nike-white text-nike-black hover:border-nike-black";

            return (
              <button
                key={s.sku}
                type="button"
                disabled={soldOut}
                aria-disabled={soldOut || undefined}
                aria-pressed={soldOut ? undefined : isSelected}
                aria-label={ariaLabel(s)}
                onClick={() => {
                  if (!soldOut) setSelected(s.sku);
                }}
                className={`flex size-[44px] min-h-[44px] flex-col items-center justify-center overflow-hidden border border-solid p-0 text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nike-black ${state}`}
              >
                <span className="block text-[13px] font-medium leading-[14px]">{sizeText(s.size_us_men)}</span>
                {lowStock && (
                  <span aria-hidden="true" className="mt-[1px] block w-[40px] text-2xs font-medium">
                    Selling out fast
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </fieldset>
      <p className="sr-only" aria-live="polite">
        {selectedSize ? `Selected ${ariaLabel(selectedSize)}` : ""}
      </p>
    </section>
  );
}
