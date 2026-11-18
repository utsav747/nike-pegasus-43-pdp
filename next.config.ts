import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    // Inline the (small) Tailwind CSS into the HTML so the fixed section heights apply
    // from the very first byte, even on Slow 3G. No render-blocking stylesheet request.
    inlineCss: true,
  },
};

export default nextConfig;
