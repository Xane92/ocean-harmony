import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import type { Photo } from "@/content/photos";

export type IndexItem = {
  key: string;
  href: string;
  title: string;
  /** Mono line above the title (type, place). */
  kicker?: ReactNode;
  summary?: string | null;
  /** Mono metadata on the right (dates, status). */
  meta?: ReactNode;
  photo?: Photo | null;
  /** Shows the accent dot before the meta, for open or active items. */
  live?: boolean;
};

/**
 * Editorial list separated by hairlines: number, optional thumbnail, kicker, title, summary
 * and metadata. The whole row is the link; nothing is boxed.
 */
export function IndexList({ items, numbered = true, label }: { items: IndexItem[]; numbered?: boolean; label?: string }) {
  return (
    <ol aria-label={label} className="border-b border-line">
      {items.map((item, i) => (
        <li
          key={item.key}
          className="group relative grid grid-cols-[2.5rem_1fr] gap-x-4 gap-y-4 border-t border-line py-8 md:grid-cols-12 md:gap-x-6 md:py-10"
        >
          {numbered ? (
            <span className="font-mono text-caption text-accent md:col-span-1 md:pt-1">{String(i + 1).padStart(2, "0")}</span>
          ) : (
            <span aria-hidden="true" className="md:col-span-1" />
          )}
          {item.photo && (
            <div className="relative col-start-2 aspect-[3/2] w-full overflow-hidden bg-ink/10 md:col-span-3 md:col-start-2 md:row-span-2">
              <Image
                src={item.photo.src}
                alt=""
                fill
                sizes="(min-width: 768px) 25vw, 90vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                style={{ objectPosition: item.photo.position }}
              />
            </div>
          )}
          <div className={cx("col-start-2 flex min-w-0 flex-col gap-3", item.photo ? "md:col-span-5 md:col-start-5" : "md:col-span-8 md:col-start-2")}>
            {item.kicker && <p className="font-mono text-caption uppercase tracking-[0.14em] text-muted">{item.kicker}</p>}
            <h3 className="font-display text-h3 font-medium text-ink">
              <Link
                href={item.href}
                className="underline decoration-transparent decoration-1 underline-offset-[6px] after:absolute after:inset-0 group-hover:decoration-accent"
              >
                {item.title}
              </Link>
            </h3>
            {item.summary && <p className="max-w-[56ch] text-body text-muted">{item.summary}</p>}
          </div>
          {item.meta && (
            <div className="col-start-2 flex items-start gap-3 font-mono text-caption uppercase tracking-[0.14em] text-ink md:col-span-3 md:col-start-10 md:justify-end md:text-right">
              {item.live !== undefined && (
                <span aria-hidden="true" className={cx("mt-1.5 size-2 shrink-0 rounded-full", item.live ? "bg-accent" : "border border-mist")} />
              )}
              <span>{item.meta}</span>
            </div>
          )}
        </li>
      ))}
    </ol>
  );
}
