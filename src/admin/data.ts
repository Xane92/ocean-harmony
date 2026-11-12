import "server-only";
import { serverClient } from "@/lib/supabase/server";
import type { Status } from "@/lib/supabase/types";
import type { ListRow } from "./components/DocumentList";
import type { ReferenceOptions, Values } from "./components/Fields";
import { optionLabel, type ContentType, type Field } from "./schema";

function referenceFields(fields: Field[]): Extract<Field, { kind: "reference" | "references" }>[] {
  return fields.flatMap((f) =>
    f.kind === "reference" || f.kind === "references"
      ? [f]
      : f.kind === "list" || f.kind === "group"
        ? referenceFields(f.fields)
        : [],
  );
}

/** Choices for every reference field in a content type (admins see drafts too, so they can link ahead). */
export async function loadReferenceOptions(type: ContentType): Promise<ReferenceOptions> {
  const supabase = await serverClient();
  const refs = referenceFields(type.fields);
  const out: ReferenceOptions = {};
  await Promise.all(
    refs.map(async (f) => {
      if (out[f.table]) return;
      const { data } = await supabase
        .from(f.table)
        .select(`id, ${f.labelColumn}, status`)
        .neq("status", "archived")
        .order("sort_order")
        .returns<Record<string, string>[]>();
      out[f.table] = (data ?? []).map((r) => ({
        value: r.id,
        label: `${r[f.labelColumn] || "Untitled"}${r.status === "draft" ? " (draft)" : ""}`,
      }));
    }),
  );
  return out;
}

export async function listDocuments(type: ContentType): Promise<ListRow[]> {
  const supabase = await serverClient();
  const columns = ["id", "status", "updated_at", type.titleField, type.metaField].filter(Boolean).join(", ");
  const { data } = await supabase
    .from(type.table)
    .select(columns)
    .order("sort_order")
    .order("created_at")
    .returns<Record<string, unknown>[]>();
  return (data ?? []).map((r) => ({
    id: String(r.id),
    title: String(r[type.titleField] ?? ""),
    meta: type.metaField ? optionLabel(type, type.metaField, r[type.metaField]) : "",
    status: r.status as Status,
    updatedAt: String(r.updated_at),
  }));
}

export async function loadDocument(type: ContentType, id: string | number) {
  const supabase = await serverClient();
  const { data } = await supabase.from(type.table).select("*").eq("id", id).maybeSingle();
  if (!data) return null;
  const row = data as Values;
  const values: Values = {};
  for (const f of type.fields) values[f.name] = row[f.name] ?? null;
  return { values, status: (row.status as Status | undefined) ?? undefined, slug: row.slug as string | undefined };
}

/** Starting values for a new item: required selects get their first option. */
export function emptyValues(type: ContentType): Values {
  const values: Values = {};
  for (const f of type.fields) {
    if (f.kind === "select" && f.required) values[f.name] = f.options[0]?.value ?? "";
  }
  return values;
}
