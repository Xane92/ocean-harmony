import { createClient } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { supabaseConfigured, supabaseKey, supabaseUrl } from "@/lib/supabase/env";

// Free Supabase projects pause after a week without database activity. A Vercel cron job
// (vercel.json) calls this once a day and makes one tiny read, which keeps the project awake.

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  if (!supabaseConfigured) return NextResponse.json({ ok: false, reason: "not configured" }, { status: 503 });

  const db = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { error } = await db.from("site_settings").select("id").eq("id", 1).maybeSingle();
  if (error) return NextResponse.json({ ok: false }, { status: 502 });
  return NextResponse.json({ ok: true, at: new Date().toISOString() });
}
