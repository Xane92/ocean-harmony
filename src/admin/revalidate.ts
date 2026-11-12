import "server-only";
import { updateTag } from "next/cache";
import { contentTag } from "@/lib/supabase/public";
import type { TableName } from "./schema";

// The one place that decides which cached pages refresh after an admin save.
// Public queries tag their fetches with contentTag(table) for every table they read
// (src/lib/supabase/public.ts), so expiring a table's tag refreshes every page that shows it.

/** Tables whose pages also display another table's content through references. */
const alsoShownWith: Partial<Record<TableName, TableName[]>> = {
  // Place names appear on stories, StoryMaps, radio campaigns and opportunities.
  places: ["stories", "storymaps", "radio_campaigns", "opportunities"],
};

/** Expire every cached page that reads `table`. Call only from server actions. */
export function refreshContent(table: TableName) {
  updateTag(contentTag(table));
  for (const other of alsoShownWith[table] ?? []) updateTag(contentTag(other));
}
