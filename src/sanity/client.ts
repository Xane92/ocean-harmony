import { createClient, type QueryParams } from "next-sanity";
import { apiVersion, dataset, projectId } from "./env";

// Published content only, via the CDN. Tokens are not needed: the dataset is public.
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
});

/** Default time-based revalidation in seconds. The Sanity webhook refreshes tagged data sooner. */
export const DEFAULT_REVALIDATE = 60;

/**
 * Fetch a typed GROQ query from a server component.
 * Results are cached for `revalidate` seconds and tagged so /api/revalidate can refresh them on publish.
 * Tag with the document types the query reads (for example ["story", "place"]).
 */
export function sanityFetch<const Query extends string>({
  query,
  params = {},
  tags,
  revalidate = DEFAULT_REVALIDATE,
}: {
  query: Query;
  params?: QueryParams;
  tags: string[];
  revalidate?: number | false;
}) {
  return client.fetch(query, params, { next: { revalidate, tags } });
}
