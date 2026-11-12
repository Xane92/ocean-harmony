import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { TableName } from "@/admin/schema";
import { CONTENT_REVALIDATE_SECONDS } from "@/lib/constants";
import { supabaseConfigured, supabaseKey, supabaseUrl } from "./env";

/** Cache tag for every public fetch that reads `table`. Admin saves expire it (src/admin/revalidate.ts). */
export const contentTag = (table: TableName) => `content:${table}`;

/**
 * Anonymous client for public pages: no cookies, so pages stay cacheable, and RLS returns
 * published rows only. Pass every table the page reads so an admin save refreshes it.
 * Returns null when Supabase is not configured; callers then use their fallback content.
 */
export function publicClient(tables: TableName[]) {
  if (!supabaseConfigured) return null;
  const tags = tables.map(contentTag);
  return createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => fetch(input, { ...init, next: { revalidate: CONTENT_REVALIDATE_SECONDS, tags } }),
    },
  });
}
