"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import type { Status } from "@/lib/supabase/types";
import { cx } from "@/lib/cx";
import { saveDocument, setStatus, type SaveResult } from "../actions";
import type { ContentType } from "../schema";
import { FieldList, type ReferenceOptions, type Values } from "./Fields";
import { smallButton } from "./FieldShell";

const statusLabel: Record<Status, string> = { draft: "Draft", published: "Published", archived: "Archived" };

export function DocumentEditor({
  type,
  id,
  initial,
  initialStatus,
  options,
  viewHref,
}: {
  type: ContentType;
  id: string | null;
  initial: Values;
  initialStatus?: Status;
  options: ReferenceOptions;
  /** Public page for this item, when it has one. */
  viewHref?: string;
}) {
  const router = useRouter();
  const [values, setValues] = useState<Values>(initial);
  const [status, setLocalStatus] = useState<Status | undefined>(initialStatus);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string>("");
  const [dirty, setDirty] = useState(false);
  const [pending, startTransition] = useTransition();
  const summaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  function handle(result: SaveResult): result is Extract<SaveResult, { ok: true }> {
    setMessage(result.message);
    if (!result.ok) {
      setErrors(result.errors ?? {});
      requestAnimationFrame(() => summaryRef.current?.focus());
      return false;
    }
    setErrors({});
    setDirty(false);
    return true;
  }

  function save(thenStatus?: Status) {
    startTransition(async () => {
      const result = await saveDocument(type.key, id, values);
      if (!handle(result)) return;
      const savedId = String(result.id);
      if (thenStatus && !type.singleton) {
        const s = await setStatus(type.key, savedId, thenStatus);
        if (!handle(s)) return;
        setLocalStatus(thenStatus);
      }
      if (!id && !type.singleton) router.replace(`/admin/${type.key}/${savedId}`);
      else router.refresh();
    });
  }

  function changeStatus(next: Status) {
    if (!id) return;
    if (next === "archived" && !window.confirm(`Archive this ${type.singular.toLowerCase()}? It will be hidden from the site. You can restore it later.`)) return;
    startTransition(async () => {
      if (dirty) {
        const saved = await saveDocument(type.key, id, values);
        if (!handle(saved)) return;
      }
      const result = await setStatus(type.key, id, next);
      if (handle(result)) {
        setLocalStatus(next);
        router.refresh();
      }
    });
  }

  const errorList = Object.entries(errors);

  return (
    <form
      className="flex flex-col gap-10"
      onSubmit={(e) => {
        e.preventDefault();
        save();
      }}
      noValidate
    >
      {errorList.length > 0 && (
        <div ref={summaryRef} tabIndex={-1} className="border-l-2 border-ink bg-ink/5 p-4 outline-none" role="alert">
          <p className="font-display text-body font-semibold text-ink">Fix {errorList.length === 1 ? "this" : "these"} before saving:</p>
          <ul className="mt-2 list-disc pl-5 text-caption text-ink">
            {errorList.map(([key, msg]) => (
              <li key={key}>
                <a className="underline underline-offset-4" href={`#f-${key.replace(/\./g, "-")}`}>
                  {msg}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <FieldList
        fields={type.fields}
        values={values}
        path=""
        ctx={{ errors, options, folder: type.table, isNew: !id && !type.singleton }}
        onChange={(v) => {
          setValues(v);
          setDirty(true);
        }}
      />

      <div className="sticky bottom-0 z-10 -mx-[var(--gutter)] flex flex-col gap-3 border-t border-line bg-surface px-[var(--gutter)] py-4 sm:flex-row sm:items-center sm:justify-between">
        <p role="status" aria-live="polite" className="text-caption text-ink">
          {pending ? "Saving…" : message || (dirty ? "Unsaved changes" : status ? `Status: ${statusLabel[status]}` : "")}
        </p>
        <div className="flex flex-wrap gap-2">
          {viewHref && (type.singleton || status === "published") && (
            <Link href={viewHref} target="_blank" className={smallButton}>
              View on site
            </Link>
          )}
          {!type.singleton && id && status === "published" && (
            <button type="button" className={smallButton} disabled={pending} onClick={() => changeStatus("draft")}>
              Unpublish
            </button>
          )}
          {!type.singleton && id && status !== "archived" && (
            <button type="button" className={smallButton} disabled={pending} onClick={() => changeStatus("archived")}>
              Archive
            </button>
          )}
          {!type.singleton && id && status === "archived" && (
            <button type="button" className={smallButton} disabled={pending} onClick={() => changeStatus("draft")}>
              Restore as draft
            </button>
          )}
          <button type="submit" disabled={pending} className={smallButton}>
            {type.singleton || status === "published" ? "Save" : "Save draft"}
          </button>
          {!type.singleton && status !== "published" && (
            <button
              type="button"
              disabled={pending}
              onClick={() => save("published")}
              className={cx(smallButton, "border-accent bg-accent text-on-accent hover:border-ink")}
            >
              {id ? "Save and publish" : "Create and publish"}
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
