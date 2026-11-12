import "server-only";
import { redirect } from "next/navigation";
import { cache } from "react";
import { serverClient } from "@/lib/supabase/server";

export type AdminSession =
  | { state: "signed-out" }
  | { state: "not-admin"; email: string }
  | { state: "admin"; email: string; userId: string };

/** Who is signed in, and whether they are listed in public.admins. Verifies the JWT, never trusts the cookie. */
export const getAdminSession = cache(async (): Promise<AdminSession> => {
  const supabase = await serverClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims?.sub) return { state: "signed-out" };

  const email = typeof claims.email === "string" ? claims.email : "";
  const { data: row } = await supabase.from("admins").select("user_id").eq("user_id", claims.sub).maybeSingle();
  return row ? { state: "admin", email, userId: claims.sub } : { state: "not-admin", email };
});

/** For admin pages: anything other than a confirmed admin goes to the sign-in page. */
export async function requireAdminPage() {
  const session = await getAdminSession();
  if (session.state !== "admin") redirect("/admin/login");
  return session;
}
