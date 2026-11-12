import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { supabaseConfigured, supabaseKey, supabaseUrl } from "@/lib/supabase/env";

// Runs only on /admin. Refreshes the Supabase session cookie and sends signed-out visitors to the
// sign-in page. Whether the user is an admin is checked again on every page and action, and
// enforced by RLS in the database; this is the first door, not the only one.
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  if (!supabaseConfigured) return response;

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet, headers) => {
        for (const { name, value } of cookiesToSet) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        response.headers.set("X-Robots-Tag", "noindex, nofollow");
        for (const { name, value, options } of cookiesToSet) response.cookies.set(name, value, options);
        for (const [key, value] of Object.entries(headers ?? {})) response.headers.set(key, value);
      },
    },
  });

  const { data } = await supabase.auth.getClaims();
  const signedIn = Boolean(data?.claims?.sub);
  const onLogin = request.nextUrl.pathname === "/admin/login";

  if (!signedIn && !onLogin) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    return NextResponse.redirect(url);
  }
  return response;
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
