"use client";

import Expandable from "./Expandable";

// 6. Reviews, 300px collapsed. PLACEHOLDER REVIEWS for the Pegasus 43, not real customer reviews.
const reviews = [
  { rating: 5, author: "Sample reviewer A", title: "My new daily trainer", body: "Soft but not mushy, and the Pegasus 43 felt just as good at mile 10 as mile 1." },
  { rating: 5, author: "Sample reviewer B", title: "Roomy toe box", body: "Fits true to size with more space up front than the 42. No hot spots on my first long run." },
  { rating: 4, author: "Sample reviewer C", title: "Great ride, runs warm", body: "Smooth transitions and good grip in the wet. A little warm on hot days." },
  { rating: 5, author: "Sample reviewer D", title: "Bouncier than the 42", body: "Noticeably more pop at the front of the foot. Strides feel quicker without extra effort." },
  { rating: 4, author: "Sample reviewer E", title: "Solid, slightly heavy", body: "Comfortable and stable for easy runs. A bit heavy for speed work, so I keep a lighter pair for that." },
  { rating: 5, author: "Sample reviewer F", title: "Third pair of Pegs", body: "The same dependable shoe I keep coming back to, just better. The Volt details look sharp in person." },
];

const average = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

function Stars({ rating }: { rating: number }) {
  return (
    <span role="img" aria-label={`${rating} out of 5 stars`} className="text-[12px] leading-[16px] tracking-[1px]">
      {"★".repeat(Math.round(rating))}
      <span className="text-nike-grey-300">{"★".repeat(5 - Math.round(rating))}</span>
    </span>
  );
}

export default function Reviews() {
  return (
    <Expandable
      ariaLabel="Reviews"
      moreLabel="See more"
      title={
        <div className="mb-3 flex h-[24px] shrink-0 items-center justify-between overflow-hidden">
          <h2 className="font-display text-[20px] font-bold uppercase leading-[24px] tracking-[-0.01em]">
            Reviews ({reviews.length})
          </h2>
          <span className="flex items-center gap-2 text-[12px] leading-[16px]">
            <Stars rating={average} />
            <span>{average.toFixed(1)}</span>
          </span>
        </div>
      }
    >
      <ul className="flex flex-col gap-4">
        {reviews.map((r) => (
          <li key={r.author}>
            <div className="flex items-center justify-between">
              <Stars rating={r.rating} />
              <span className="text-[12px] leading-[16px] text-nike-grey-600">{r.author}</span>
            </div>
            <p className="mt-1 text-[14px] font-bold leading-[20px]">{r.title}</p>
            <p className="text-[14px] leading-[20px]">{r.body}</p>
          </li>
        ))}
      </ul>
    </Expandable>
  );
}
