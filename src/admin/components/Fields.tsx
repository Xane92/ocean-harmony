"use client";

import { useState, type ReactNode } from "react";
import type { RichTextNode, StoredImage } from "@/lib/supabase/types";
import type { Field, Option } from "../schema";
import { describedBy, FieldShell, inputClass, smallButton } from "./FieldShell";
import { AudioInput, GalleryInput, ImageInput } from "./media";
import { RichTextInput } from "./RichTextInput";

export type Values = Record<string, unknown>;
/** Options for reference fields, keyed by table name. */
export type ReferenceOptions = Record<string, Option[]>;

type Ctx = {
  errors: Record<string, string>;
  options: ReferenceOptions;
  /** Storage folder for uploads, the content type's table. */
  folder: string;
};

export function slugify(text: string) {
  return text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Renders the fields of one level (a document, a list item or a group). */
export function FieldList({
  fields,
  values,
  onChange,
  path,
  ctx,
}: {
  fields: Field[];
  values: Values;
  onChange: (values: Values) => void;
  path: string;
  ctx: Ctx;
}) {
  return (
    <div className="flex flex-col gap-8">
      {fields.map((field) => (
        <FieldInput
          key={field.name}
          field={field}
          value={values[field.name]}
          siblings={values}
          path={path ? `${path}.${field.name}` : field.name}
          ctx={ctx}
          onChange={(v) => onChange({ ...values, [field.name]: v })}
        />
      ))}
    </div>
  );
}

function FieldInput({
  field,
  value,
  siblings,
  path,
  ctx,
  onChange,
}: {
  field: Field;
  value: unknown;
  siblings: Values;
  path: string;
  ctx: Ctx;
  onChange: (value: unknown) => void;
}) {
  const id = `f-${path.replace(/\./g, "-")}`;
  const error = ctx.errors[path];
  const common = { id, label: field.label, help: field.help, error, required: field.required };
  const aria = { "aria-describedby": describedBy(id, field.help, error), "aria-invalid": Boolean(error) || undefined };
  const text = typeof value === "string" ? value : "";

  switch (field.kind) {
    case "text":
      return (
        <FieldShell {...common}>
          {field.multiline ? (
            <textarea
              id={id}
              rows={4}
              className={inputClass}
              value={text}
              maxLength={field.maxLength}
              onChange={(e) => onChange(e.target.value)}
              {...aria}
            />
          ) : (
            <input
              id={id}
              type={field.inputType ?? "text"}
              className={inputClass}
              value={text}
              maxLength={field.maxLength}
              onChange={(e) => onChange(e.target.value)}
              {...aria}
            />
          )}
        </FieldShell>
      );

    case "slug": {
      const source = typeof siblings[field.from] === "string" ? (siblings[field.from] as string) : "";
      return (
        <FieldShell {...common} required>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              id={id}
              className={`${inputClass} font-mono`}
              value={text}
              onChange={(e) => onChange(e.target.value.toLowerCase())}
              {...aria}
            />
            <button type="button" className={smallButton} onClick={() => onChange(slugify(source))} disabled={!source}>
              Make from title
            </button>
          </div>
        </FieldShell>
      );
    }

    case "url":
      return (
        <FieldShell {...common}>
          <input id={id} type="url" inputMode="url" placeholder="https://" className={inputClass} value={text} onChange={(e) => onChange(e.target.value)} {...aria} />
        </FieldShell>
      );

    case "select":
      return (
        <FieldShell {...common}>
          <select id={id} className={inputClass} value={text} onChange={(e) => onChange(e.target.value)} {...aria}>
            {!field.required && <option value="">None</option>}
            {field.required && !text && <option value="">Choose…</option>}
            {field.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </FieldShell>
      );

    case "date":
      return (
        <FieldShell {...common}>
          <input id={id} type="date" className={`${inputClass} sm:max-w-60`} value={text} onChange={(e) => onChange(e.target.value)} {...aria} />
        </FieldShell>
      );

    case "number":
      return (
        <FieldShell {...common}>
          <input
            id={id}
            type="number"
            inputMode="decimal"
            className={`${inputClass} sm:max-w-60`}
            value={value === null || value === undefined ? "" : String(value)}
            min={field.min}
            max={field.max}
            step={field.step}
            onChange={(e) => onChange(e.target.value)}
            {...aria}
          />
        </FieldShell>
      );

    case "boolean":
      return (
        <div className="flex flex-col gap-1.5">
          <label htmlFor={id} className="flex min-h-11 items-center gap-3 font-display text-body font-semibold text-ink">
            <input id={id} type="checkbox" className="size-5 accent-[var(--surface-accent)]" checked={value === true} onChange={(e) => onChange(e.target.checked)} />
            {field.label}
          </label>
          {field.help && <p className="text-caption text-muted">{field.help}</p>}
        </div>
      );

    case "image":
      return <ImageInput {...common} folder={ctx.folder} value={(value as StoredImage | null) ?? null} onChange={onChange} />;

    case "gallery":
      return (
        <GalleryInput
          id={path}
          label={field.label}
          help={field.help}
          errors={ctx.errors}
          folder={ctx.folder}
          value={(value as StoredImage[]) ?? []}
          onChange={onChange}
        />
      );

    case "audio":
      return <AudioInput {...common} folder={ctx.folder} value={(value as string | null) ?? null} onChange={onChange} />;

    case "richText":
      return <RichTextInput {...common} value={(value as RichTextNode | null) ?? null} onChange={onChange} />;

    case "reference": {
      const opts = ctx.options[field.table] ?? [];
      return (
        <FieldShell {...common}>
          <select id={id} className={inputClass} value={text} onChange={(e) => onChange(e.target.value)} {...aria}>
            <option value="">None</option>
            {opts.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {opts.length === 0 && <p className="mt-1 text-caption text-muted">Nothing to choose yet. Add one first.</p>}
        </FieldShell>
      );
    }

    case "references": {
      const opts = ctx.options[field.table] ?? [];
      const selected = Array.isArray(value) ? (value as string[]) : [];
      const full = field.max !== undefined && selected.length >= field.max;
      return (
        <FieldShell as="fieldset" {...common}>
          {opts.length === 0 ? (
            <p className="text-caption text-muted">Nothing to choose yet. Add one first.</p>
          ) : (
            <ul className="flex flex-col divide-y divide-line border-y border-line">
              {opts.map((o) => {
                const checked = selected.includes(o.value);
                return (
                  <li key={o.value}>
                    <label className="flex min-h-11 items-center gap-3 py-1 text-body text-ink">
                      <input
                        type="checkbox"
                        className="size-5 accent-[var(--surface-accent)]"
                        checked={checked}
                        disabled={!checked && full}
                        onChange={(e) =>
                          onChange(e.target.checked ? [...selected, o.value] : selected.filter((v) => v !== o.value))
                        }
                      />
                      {o.label}
                    </label>
                  </li>
                );
              })}
            </ul>
          )}
        </FieldShell>
      );
    }

    case "tags":
      return <TagsInput {...common} value={Array.isArray(value) ? (value as string[]) : []} onChange={onChange} />;

    case "list": {
      const items = Array.isArray(value) ? (value as Values[]) : [];
      const set = (next: Values[]) => onChange(next);
      const move = (i: number, d: -1 | 1) => {
        const next = [...items];
        const [item] = next.splice(i, 1);
        next.splice(i + d, 0, item);
        set(next);
      };
      return (
        <FieldShell as="fieldset" {...common}>
          <ol className="flex flex-col gap-4">
            {items.map((item, i) => {
              const title = typeof item[field.titleField] === "string" && item[field.titleField] ? String(item[field.titleField]) : `New ${field.itemLabel}`;
              return (
                <li key={i} className="border border-line">
                  <ListDetails initiallyOpen={!item[field.titleField]}>
                    <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 py-2">
                      <span className="flex min-w-0 items-baseline gap-3">
                        <span className="font-mono text-caption text-accent">{String(i + 1).padStart(2, "0")}</span>
                        <span className="truncate font-display text-body font-semibold text-ink">{title}</span>
                      </span>
                      <span aria-hidden="true" className="font-mono text-caption text-muted group-open:rotate-90">
                        →
                      </span>
                    </summary>
                    <div className="flex flex-col gap-6 border-t border-line p-4">
                      <FieldList fields={field.fields} values={item} path={`${path}.${i}`} ctx={ctx} onChange={(v) => set(items.map((it, j) => (j === i ? v : it)))} />
                      <div className="flex flex-wrap gap-2 border-t border-line pt-4">
                        <button type="button" className={smallButton} disabled={i === 0} onClick={() => move(i, -1)}>
                          Move up
                        </button>
                        <button type="button" className={smallButton} disabled={i === items.length - 1} onClick={() => move(i, 1)}>
                          Move down
                        </button>
                        <button
                          type="button"
                          className={smallButton}
                          onClick={() => {
                            if (window.confirm(`Remove this ${field.itemLabel}?`)) set(items.filter((_, j) => j !== i));
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </ListDetails>
                </li>
              );
            })}
          </ol>
          <button
            type="button"
            className={`${smallButton} mt-3 self-start`}
            disabled={field.max !== undefined && items.length >= field.max}
            onClick={() => set([...items, {}])}
          >
            + Add {field.itemLabel}
          </button>
        </FieldShell>
      );
    }

    case "group":
      return (
        <fieldset className="flex flex-col gap-6 border-t border-line pt-6">
          <legend className="font-mono text-caption uppercase tracking-[0.14em] text-muted">{field.label}</legend>
          {field.help && <p className="-mt-3 max-w-[60ch] text-caption text-muted">{field.help}</p>}
          <FieldList
            fields={field.fields}
            values={(value as Values | null) ?? {}}
            path={path}
            ctx={ctx}
            onChange={onChange}
          />
        </fieldset>
      );
  }
}

function TagsInput({
  id,
  label,
  help,
  error,
  value,
  onChange,
}: {
  id: string;
  label: string;
  help?: string;
  error?: string;
  value: string[];
  onChange: (value: string[]) => void;
}) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const t = draft.trim();
    if (t && !value.includes(t)) onChange([...value, t]);
    setDraft("");
  };
  return (
    <FieldShell id={id} label={label} help={help} error={error}>
      {value.length > 0 && (
        <ul className="mb-2 flex flex-wrap gap-2">
          {value.map((t) => (
            <li key={t}>
              <button
                type="button"
                className={smallButton}
                onClick={() => onChange(value.filter((v) => v !== t))}
                aria-label={`Remove ${t}`}
              >
                {t} <span aria-hidden="true">×</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex gap-2">
        <input
          id={id}
          className={inputClass}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              add();
            }
          }}
          aria-describedby={describedBy(id, help, error)}
        />
        <button type="button" className={smallButton} onClick={add} disabled={!draft.trim()}>
          Add
        </button>
      </div>
    </FieldShell>
  );
}

/** Collapsible list item. Open state is local so typing a title does not snap it shut. */
function ListDetails({ initiallyOpen, children }: { initiallyOpen: boolean; children: ReactNode }) {
  const [open, setOpen] = useState(initiallyOpen);
  return (
    <details open={open} onToggle={(e) => setOpen(e.currentTarget.open)} className="group">
      {children}
    </details>
  );
}
