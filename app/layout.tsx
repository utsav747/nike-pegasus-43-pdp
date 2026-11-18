import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nike Pegasus 43",
  description: "Nike Pegasus 43 road running shoe, Black/White-Volt.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="bg-nike-white font-sans text-nike-black">{children}</body>
    </html>
  );
}
