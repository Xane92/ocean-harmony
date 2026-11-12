/** An opportunity is "closing soon" when its close date is within this many days. */
export const CLOSING_SOON_DAYS = 14;

/** Public pages refetch content from Supabase at most this often. Admin saves refresh them at once. */
export const CONTENT_REVALIDATE_SECONDS = 300;

/** Images are resized to this long edge in the browser before upload. */
export const UPLOAD_IMAGE_MAX_EDGE = 2000;
