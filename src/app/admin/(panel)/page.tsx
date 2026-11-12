import type { Metadata } from "next";
import Link from "next/link";
import { AdminHeading } from "@/admin/components/AdminHeading";
import { contentTypes } from "@/admin/schema";
import { serverClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Overview" };

export default async function AdminHome() {
  const supabase = await serverClient();
  const counts = await Promise.all(
    contentTypes.map(async (t) => {
      if (t.singleton) return null;
      const [{ count: published }, { count: drafts }] = await Promise.all([
        supabase.from(t.table).select("id", { count: "exact", head: true }).eq("status", "published"),
        supabase.from(t.table).select("id", { count: "exact", head: true }).eq("status", "draft"),
      ]);
      return { published: published ?? 0, drafts: drafts ?? 0 };
    }),
  );

  return (
    <>
      <AdminHeading
        eyebrow="Overview"
        title="What do you want to update?"
        description="Changes go live as soon as you publish. Drafts stay hidden until then."
      />
      <ul className="border-b border-line">
        {contentTypes.map((t, i) => {
          const c = counts[i];
          return (
            <li key={t.key} className="group relative grid gap-2 border-t border-line py-6 md:grid-cols-[3rem_1fr_auto] md:items-baseline md:gap-6">
              <span className="font-mono text-caption text-accent">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h2 className="font-display text-h3 font-medium text-ink">
                  <Link href={`/admin/${t.key}`} className="underline decoration-transparent underline-offset-[6px] after:absolute after:inset-0 group-hover:decoration-accent">
                    {t.label}
                  </Link>
                </h2>
                <p className="mt-1 text-body text-muted">{t.description}</p>
              </div>
              <p className="font-mono text-caption uppercase tracking-[0.12em] text-muted">
                {c ? `${c.published} live / ${c.drafts} draft` : "Single page"}
              </p>
            </li>
          );
        })}
      </ul>
    </>
  );
}
