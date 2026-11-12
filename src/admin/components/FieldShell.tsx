import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

/** Label, help text and error for one field. Ids tie the error to the input for screen readers. */
export function FieldShell({
  id,
  label,
  help,
  error,
  required,
  children,
  as = "div",
}: {
  id: string;
  label: string;
  help?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  /** fieldset for groups of inputs (image, lists), so the label becomes a legend. */
  as?: "div" | "fieldset";
}) {
  const Label = as === "fieldset" ? "legend" : "label";
  return (
    // An attribute selector keeps the error state visible without colour (Tailwind colours are brand-only).
    <Wrapper as={as} invalid={Boolean(error)}>
      <Label
        {...(as === "div" ? { htmlFor: id } : {})}
        className="font-display text-body font-semibold text-ink"
      >
        {label}
        {required && <span className="ml-1 font-mono text-caption text-muted">required</span>}
      </Label>
      {help && (
        <p id={`${id}-help`} className="max-w-[60ch] text-caption text-muted">
          {help}
        </p>
      )}
      <div className="mt-1">{children}</div>
      {error && (
        <p id={`${id}-error`} className="flex items-start gap-2 text-caption font-semibold text-ink">
          <span aria-hidden="true" className="mt-1 inline-block size-2 shrink-0 bg-ink" />
          {error}
        </p>
      )}
    </Wrapper>
  );
}

function Wrapper({ as, invalid, children }: { as: "div" | "fieldset"; invalid: boolean; children: ReactNode }) {
  const className = cx(
    "flex min-w-0 flex-col gap-1.5",
    invalid && "border-l-2 border-ink pl-4",
  );
  return as === "fieldset" ? <fieldset className={className}>{children}</fieldset> : <div className={className}>{children}</div>;
}

export const inputClass =
  "w-full min-h-11 border border-line bg-surface px-3 py-2.5 font-body text-body text-ink placeholder:text-muted";

export function describedBy(id: string, help?: string, error?: string) {
  return [help && `${id}-help`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;
}

export const smallButton =
  "inline-flex min-h-11 items-center gap-2 border border-line px-3 font-mono text-caption uppercase tracking-[0.12em] text-ink hover:border-ink disabled:opacity-40";
