import Link from "next/link";
import type { ReactNode } from "react";

export function AdminHeading({
  eyebrow,
  title,
  description,
  back,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  back?: { href: string; label: string };
  action?: ReactNode;
}) {
  return (
    <div className="mb-10 flex flex-col gap-6 border-b border-line pb-8 md:flex-row md:items-end md:justify-between">
      <div className="flex min-w-0 flex-col gap-3">
        {back && (
          <Link href={back.href} className="inline-flex min-h-11 items-center self-start font-mono text-caption uppercase tracking-[0.12em] text-ink underline decoration-line underline-offset-4 hover:decoration-accent">
            ← {back.label}
          </Link>
        )}
        <p className="font-mono text-caption uppercase tracking-[0.14em] text-muted">{eyebrow}</p>
        <h1 className="font-display text-h2 font-medium text-ink">{title}</h1>
        {description && <p className="max-w-[60ch] text-body text-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}
