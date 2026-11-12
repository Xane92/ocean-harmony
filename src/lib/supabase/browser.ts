"use client";

import { createBrowserClient } from "@supabase/ssr";
import { supabaseKey, supabaseUrl } from "./env";

let client: ReturnType<typeof createBrowserClient> | null = null;

/** Browser client for /admin uploads. Shares the session cookie set at sign-in. */
export function browserClient() {
  client ??= createBrowserClient(supabaseUrl, supabaseKey);
  return client;
}
