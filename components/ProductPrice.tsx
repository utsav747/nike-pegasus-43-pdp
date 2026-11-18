type Props = { price: string };

// 3. Price, fixed 50px, left aligned.
export default function ProductPrice({ price }: Props) {
  return (
    <section className="flex h-[50px] min-h-[50px] w-full items-center overflow-hidden px-4">
      <p className="text-[16px] font-medium leading-[24px] text-nike-black">{price}</p>
    </section>
  );
}
