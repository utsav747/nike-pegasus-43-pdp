import rawStock from "@/data/pegasus-43-stock.json";

export type StockStatus = "in_stock" | "low_stock" | "sold_out";

export type SizeStock = {
  sku: string;
  style_code: string;
  product_name: string;
  colorway: string;
  price: number;
  size_label: string;
  size_us_men: number;
  size_us_women: number;
  size_eu: string;
  display_order: number;
  in_stock: boolean;
  stock_quantity: number;
  stock_status: StockStatus;
  launch_date: string;
};

/** All sizes, in the JSON's display order. Stock is never hardcoded: it comes from data/. */
export const sizes: SizeStock[] = [...(rawStock as SizeStock[])].sort(
  (a, b) => a.display_order - b.display_order,
);

const first = sizes[0];

export const product = {
  name: first.product_name,
  styleCode: first.style_code,
  colorway: first.colorway,
  price: first.price,
};

export function formatPrice(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
  }).format(value);
}

export function stockCounts(list: SizeStock[] = sizes) {
  return {
    inStock: list.filter((s) => s.stock_status === "in_stock").length,
    lowStock: list.filter((s) => s.stock_status === "low_stock").length,
    soldOut: list.filter((s) => s.stock_status === "sold_out").length,
  };
}
