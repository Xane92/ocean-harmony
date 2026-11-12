import { storageUrl } from "@/lib/supabase/env";
import type { StoredImage } from "@/lib/supabase/types";
import type { Photo } from "./photos";

/** Stored Supabase image to the Photo shape components use. Null when missing or without alt text. */
export function toPhoto(image: StoredImage | null | undefined): Photo | null {
  if (!image?.path || !image.alt) return null;
  return {
    src: storageUrl("media", image.path),
    alt: image.alt,
    width: image.width ?? 2000,
    height: image.height ?? 1333,
    caption: image.caption,
  };
}
