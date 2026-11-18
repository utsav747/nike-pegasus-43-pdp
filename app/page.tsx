import ProductImage from "@/components/ProductImage";
import ProductTitle from "@/components/ProductTitle";
import ProductPrice from "@/components/ProductPrice";
import SizeGrid from "@/components/SizeGrid";
import TechCopy from "@/components/TechCopy";
import Reviews from "@/components/Reviews";
import { formatPrice, product, sizes } from "@/lib/stock";

// Server component. Fixed section heights (collapsed): 300 + 50 + 50 + 220 + 300 + 300 = 1,220px.
export default function Page() {
  return (
    <main className="mx-auto w-[375px] max-w-full overflow-hidden">
      <ProductImage />
      <ProductTitle name={product.name} styleCode={product.styleCode} colorway={product.colorway} />
      <ProductPrice price={formatPrice(product.price)} />
      <SizeGrid sizes={sizes} />
      <TechCopy />
      <Reviews />
    </main>
  );
}
