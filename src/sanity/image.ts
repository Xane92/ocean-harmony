import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { dataset, projectId } from "./env";

const builder = createImageUrlBuilder({ projectId, dataset });

/** Image URL builder for crops and widths. Respects the editor's crop and hotspot; serves AVIF/WebP when supported. */
export function urlFor(source: SanityImageSource) {
  return builder.image(source).auto("format");
}
