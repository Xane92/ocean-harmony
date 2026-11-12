import type { NextConfig } from "next";

// Uploaded images are served from the Supabase project's public storage buckets.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

const nextConfig: NextConfig = {
  images: {
    // AVIF first, WebP fallback.
    formats: ["image/avif", "image/webp"],
    remotePatterns: supabaseUrl ? [new URL(`${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/public/**`)] : [],
  },
};

export default nextConfig;
