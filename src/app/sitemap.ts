import type { MetadataRoute } from "next";
import { getSitemapEntries } from "@/content/collections";

const base = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

const staticPaths = ["/", "/approach", "/places", "/explore", "/stories", "/opportunities", "/partner", "/support", "/about", "/contact"];

// Refreshed with the content cache; published items appear here as they go live.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries = await getSitemapEntries();
  return [
    ...staticPaths.map((path) => ({ url: `${base}${path}`, changeFrequency: "weekly" as const })),
    ...entries.map((e) => ({ url: `${base}${e.path}`, lastModified: new Date(e.updatedAt) })),
  ];
}
