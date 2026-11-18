type Props = { name: string; styleCode: string; colorway: string };

// 2. Title, fixed 50px: one-line bold name (ellipsis) plus a 12px grey style line.
export default function ProductTitle({ name, styleCode, colorway }: Props) {
  return (
    <section className="flex h-[50px] min-h-[50px] w-full flex-col justify-center overflow-hidden px-4">
      <h1 className="h-[24px] truncate font-display text-[22px] font-bold uppercase leading-[24px] tracking-[-0.01em] text-nike-black">
        {name}
      </h1>
      <p className="h-[16px] truncate text-[12px] leading-[16px] text-nike-grey-600">
        Style {styleCode}, {colorway}
      </p>
    </section>
  );
}
