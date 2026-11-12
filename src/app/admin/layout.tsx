import type { Metadata } from "next";
import { supabaseConfigured } from "@/lib/supabase/env";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Admin | Ocean Harmony" },
  robots: { index: false, follow: false },
};

/** /admin renders without the public header and footer. */
export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  if (!supabaseConfigured) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-xl flex-col justify-center gap-4 px-(--gutter)">
        <h1 className="font-display text-h2 font-medium text-ink">Admin is not connected yet</h1>
        <p className="text-body text-muted">
          Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY for this deployment, then redeploy.
        </p>
      </main>
    );
  }
  return children;
}
