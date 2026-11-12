// Supabase connection values. Both are public by design: the publishable key only grants what
// the row level security policies in supabase/migrations allow. No secret key is ever used here.

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

/** False until both env variables are set; the site then renders its fallback content. */
export const supabaseConfigured = Boolean(supabaseUrl && supabaseKey);

/** Public URL for an object in one of the public storage buckets. */
export function storageUrl(bucket: "media" | "audio", path: string): string {
  const clean = path.split("/").map(encodeURIComponent).join("/");
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${clean}`;
}
