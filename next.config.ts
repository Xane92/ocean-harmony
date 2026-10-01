import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF first, WebP fallback. Sanity images are optimised from its CDN.
    formats: ["image/avif", "image/webp"],
    remotePatterns: [new URL("https://cdn.sanity.io/images/**")],
  },
};

export default nextConfig;
