import Link from "next/link";
import { signOut } from "@/admin/actions";
import { requireAdminPage } from "@/admin/auth";
import { AdminNav } from "@/admin/components/AdminNav";
import { smallButton } from "@/admin/components/FieldShell";
import { contentTypes } from "@/admin/schema";

export default async function PanelLayout({ children }: LayoutProps<"/admin">) {
  const session = await requireAdminPage();
  const items = [{ href: "/admin", label: "Overview" }, ...contentTypes.map((t) => ({ href: `/admin/${t.key}`, label: t.label }))];

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-line">
        <div className="mx-auto flex w-full max-w-page items-center justify-between gap-4 px-(--gutter) py-3">
          <Link href="/admin" className="flex min-h-11 items-center gap-3 whitespace-nowrap font-display text-body-lg font-semibold text-ink">
            Ocean Harmony
            <span className="font-mono text-caption font-normal uppercase tracking-[0.14em] text-muted">Admin</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="hidden truncate text-caption text-muted md:inline">{session.email}</span>
            <Link href="/" target="_blank" className={smallButton}>
              View site
            </Link>
            <form action={signOut}>
              <button type="submit" className={smallButton}>
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      <div className="mx-auto grid w-full max-w-page flex-1 gap-8 px-(--gutter) py-6 lg:grid-cols-[14rem_1fr] lg:gap-12 lg:py-10">
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <AdminNav items={items} />
        </aside>
        <main id="main" className="min-w-0 pb-24">
          {children}
        </main>
      </div>
    </div>
  );
}
