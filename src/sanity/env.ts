// Public Sanity identifiers. Safe for the browser; tokens and secrets never live here.

/** Pinned API version. Bump deliberately after checking the Sanity changelog. */
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-09-30";

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  "Missing NEXT_PUBLIC_SANITY_PROJECT_ID. Add it to .env.local (see .env.example).",
);

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  "Missing NEXT_PUBLIC_SANITY_DATASET. Add it to .env.local (see .env.example).",
);

function assertValue(value: string | undefined, message: string): string {
  if (!value) throw new Error(message);
  return value;
}
