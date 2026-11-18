import { useId, useState, type ReactNode } from "react";

type Props = {
  title: ReactNode;
  moreLabel: string;
  children: ReactNode;
  ariaLabel: string;
};

/**
 * Not a client entry itself: it is only imported by TechCopy and Reviews, which are "use client".
 * Shared shell for the two expandable sections. Collapsed: exactly 300px, content clipped
 * (overflow hidden, never scrolls). Expanded: grows to fit. Height only changes on click.
 */
export default function Expandable({ title, moreLabel, children, ariaLabel }: Props) {
  const [open, setOpen] = useState(false);
  const bodyId = useId();

  return (
    <section
      aria-label={ariaLabel}
      className={`flex w-full flex-col border-t border-nike-grey-200 px-4 pb-3 pt-5 ${
        open ? "h-auto min-h-[300px] overflow-visible" : "h-[300px] min-h-[300px] overflow-hidden"
      }`}
    >
      {title}
      <div
        id={bodyId}
        className={`relative ${open ? "h-auto overflow-visible" : "min-h-0 flex-1 overflow-hidden"}`}
      >
        {children}
        {!open && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[24px] bg-gradient-to-b from-transparent to-nike-white"
          />
        )}
      </div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={bodyId}
        onClick={() => setOpen((v) => !v)}
        className="mt-2 h-[20px] shrink-0 self-start border-0 bg-transparent p-0 text-[14px] font-medium leading-[20px] text-nike-black underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nike-black"
      >
        {open ? "Show less" : moreLabel}
      </button>
    </section>
  );
}
