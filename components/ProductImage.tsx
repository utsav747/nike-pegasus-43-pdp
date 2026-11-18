import Image from "next/image";

// 1. Product image, fixed 375x300. The #F5F5F5 background shows while the image loads.
export default function ProductImage() {
  return (
    <section
      aria-label="Product image"
      className="relative flex h-[300px] min-h-[300px] w-full items-center justify-center overflow-hidden bg-nike-grey-100"
    >
      <Image
        src="/pegasus-43-placeholder.svg"
        alt="Nike Pegasus 43 in Black/White-Volt (placeholder image)"
        width={375}
        height={300}
        priority
        unoptimized
        className="h-[300px] w-[375px] max-w-full object-contain object-center"
      />
    </section>
  );
}
