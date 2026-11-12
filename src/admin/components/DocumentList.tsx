"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { Status } from "@/lib/supabase/types";
import { cx } from "@/lib/cx";
import { reorder } from "../actions";
import { smallButton } from "./FieldShell";

export type ListRow = { id: string; title: string; meta: string; status: Status; updatedAt: string };

const filters: { key: "current" | Status; label: string }[] = [
  { key: "current", label: "Current" },
  { key: "published", label: "Published" },
  { key: "draft", label: "Drafts" },
  { key: "archived", label: "Archived" },
];

export function DocumentList({ typeKey, singular, rows }: { typeKey: string; singular: string; rows: ListRow[] }) {
  const router = useRouter();
  const [order, setOrder] = useState(rows);
  const [filter, setFilter] = useState<"current" | Status>("current");
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  const visible = order.filter((r) => (filter === "current" ? r.status !== "archived" : r.status === filter));
  const canReorder = filter === "current";

  function move(id: string, d: -1 | 1) {
    const ids = visible.map((r) => r.id);
    const i = ids.indexOf(id);
    const j = i + d;
    if (j < 0 || j >= ids.length) return;
    [ids[i], ids[j]] = [ids[j], ids[i]];
    const byId = new Map(order.map((r) => [r.id, r]));
    const archived = order.filter((r) => r.status === "archived");
    const next = [...ids.map((x) => byId.get(x)!), ...archived];
    setOrder(next);
    startTransition(async () => {
      const result = await reorder(typeKey, next.map((r) => r.id));
      setMessage(result.message);
      if (result.ok) router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div role="group" aria-label="Filter" className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.key}
            type="button"
            aria-pressed={filter === f.key}
            onClick={() => setFilter(f.key)}
            className={cx(smallButton, filter === f.key && "border-ink bg-ink text-surface")}
          >
            {f.label} ({f.key === "current" ? order.filter((r) => r.status !== "archived").length : order.filter((r) => r.status === f.key).length})
          </button>
        ))}
      </div>

      <p role="status" aria-live="polite" className="text-caption text-ink">
        {pending ? "Saving order…" : message}
      </p>

      {visible.length === 0 ? (
        <div className="border-y border-line py-16 text-center">
          <p className="font-display text-h3 font-medium text-ink">Nothing here yet.</p>
          {filter === "current" && (
            <p className="mt-2 text-body text-muted">Add the first {singular.toLowerCase()} with the button above.</p>
          )}
        </div>
      ) : (
        <ol className="border-b border-line">
          {visible.map((row, i) => (
            <li key={row.id} className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2 border-t border-line py-4 md:grid-cols-[3rem_1fr_9rem_auto]">
              <span className="hidden font-mono text-caption text-accent md:block">{String(i + 1).padStart(2, "0")}</span>
              <div className="min-w-0">
                <Link href={`/admin/${typeKey}/${row.id}`} className="block truncate font-display text-body-lg font-medium text-ink underline decoration-transparent underline-offset-4 hover:decoration-accent">
                  {row.title || `Untitled ${singular.toLowerCase()}`}
                </Link>
                <p className="truncate font-mono text-caption uppercase tracking-[0.1em] text-muted">
                  {[row.meta, `Edited ${new Date(row.updatedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`]
                    .filter(Boolean)
                    .join(" / ")}
                </p>
              </div>
              <span className="col-start-2 row-start-1 flex items-center gap-2 justify-self-end font-mono text-caption uppercase tracking-[0.12em] text-ink md:col-start-auto md:row-start-auto md:justify-self-start">
                <span aria-hidden="true" className={cx("size-2 rounded-full", row.status === "published" ? "bg-accent" : "border border-mist")} />
                {row.status}
              </span>
              {canReorder && (
                <div className="col-span-2 flex gap-2 md:col-span-1">
                  <button type="button" className={smallButton} disabled={pending || i === 0} onClick={() => move(row.id, -1)} aria-label={`Move ${row.title} up`}>
                    ↑
                  </button>
                  <button
                    type="button"
                    className={smallButton}
                    disabled={pending || i === visible.length - 1}
                    onClick={() => move(row.id, 1)}
                    aria-label={`Move ${row.title} down`}
                  >
                    ↓
                  </button>
                </div>
              )}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
