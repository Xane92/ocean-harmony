import type { Metadata } from "next";
import type { Seo, StoredImage } from "@/lib/supabase/types";
import { toPhoto } from "./media";

/** Metadata for a CMS page: the editor's search fields first, then the page's own title, summary and photo. */
export function pageMetadata({
  path,
  title,
  description,
  image,
  seo,
}: {
  path: string;
  title: string;
  description?: string | null;
  image?: StoredImage | null;
  seo?: Seo | null;
}): Metadata {
  const photo = toPhoto(seo?.image) ?? toPhoto(image);
  const desc = seo?.description || description || undefined;
  return {
    title: seo?.title || title,
    description: desc,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      url: path,
      title: seo?.title || title,
      description: desc,
      images: photo ? [{ url: photo.src, alt: photo.alt, width: photo.width, height: photo.height }] : undefined,
    },
  };
}
