import Image from "next/image";

// 1. Product image, fixed 375x300. The #F5F5F5 background shows while the image loads.
// The photo is square (1080x1080), so it is shown 300x300, centred, object-contain.
// next/image optimises it (resized and re-encoded); width/height reserve the space, so no layout shift.
export default function ProductImage() {
  return (
    <section
      aria-label="Product image"
      className="relative flex h-[300px] min-h-[300px] w-full items-center justify-center overflow-hidden bg-nike-grey-100"
    >
      <Image
        data-testid="main-photo"
        src="/pegasus-43.avif"
        alt="Nike Pegasus 43 running shoes, three-quarter view"
        width={300}
        height={300}
        sizes="300px"
        priority
        className="h-[300px] w-[300px] max-w-full object-contain object-center"
      />
    </section>
  );
}
