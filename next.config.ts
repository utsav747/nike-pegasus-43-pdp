import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // The photo is 900px wide (3x its 300px slot), so never ask for a bigger size than that.
    deviceSizes: [640, 750, 828, 900],
    imageSizes: [300, 600],
    formats: ["image/webp"],
  },
  experimental: {
    // Inline the (small) Tailwind CSS into the HTML so the fixed section heights apply
    // from the very first byte, even on Slow 3G. No render-blocking stylesheet request.
    inlineCss: true,
  },
};

export default nextConfig;
