"use client";

import Expandable from "./Expandable";

// 5. Tech copy, 300px collapsed. PLACEHOLDER COPY: replace with approved product copy before launch.
const blocks = [
  {
    heading: "Cushioning",
    body: [
      "Full-length ReactX foam with front and heel Air Zoom units gives a soft landing and a springy toe-off.",
      "The foam is tuned a touch softer than before, so easy miles feel easier, while the forefoot Zoom unit keeps things lively when you pick up the pace.",
    ],
  },
  {
    heading: "Upper",
    body: [
      "Engineered mesh breathes where you heat up and holds firm through the midfoot. Reflective details for low light.",
      "A gusseted tongue stays put on long runs, and a reinforced heel counter locks you in without pressure on the Achilles.",
    ],
  },
  {
    heading: "Fit",
    body: [
      "True to size with a plush padded collar and a wider forefoot for more room to splay on long runs.",
      "If you're between sizes or like a roomier fit for races over a half marathon, go up half a size.",
    ],
  },
  {
    heading: "Ride",
    body: [
      "A smooth heel-to-toe rocker and waffle-inspired rubber outsole keep you rolling from easy days to tempo.",
      "Rubber is placed in the high-wear zones only, keeping weight down while holding grip on wet roads and light trail.",
    ],
  },
];

export default function TechCopy() {
  return (
    <Expandable
      ariaLabel="Technology and fit"
      moreLabel="Read more"
      title={
        <h2 className="mb-3 h-[24px] shrink-0 truncate font-display text-[20px] font-bold uppercase leading-[24px] tracking-[-0.01em]">
          Built for every mile
        </h2>
      }
    >
      <div className="flex flex-col gap-4">
        {blocks.map((b) => (
          <div key={b.heading}>
            <h3 className="text-[14px] font-bold uppercase leading-[20px]">{b.heading}</h3>
            {b.body.map((p) => (
              <p key={p} className="mt-1 text-[14px] leading-[20px] text-nike-black">
                {p}
              </p>
            ))}
          </div>
        ))}
      </div>
    </Expandable>
  );
}
