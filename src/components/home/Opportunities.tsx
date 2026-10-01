import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { marked } from "@/components/ui/Marked";
import { cx } from "@/lib/cx";
import type { HomeContent } from "@/content/fallback";
import { SectionHeading } from "./SectionHeading";

/** Opportunity rows separated by hairlines, each with type and status in mono. */
export function Opportunities({ opportunities }: { opportunities: HomeContent["opportunities"] }) {
  return (
    <section aria-labelledby="home-opportunities">
      <Container className="py-24 md:py-40">
        <SectionHeading
          id="home-opportunities"
          number="07"
          eyebrow={opportunities.eyebrow}
          headline={opportunities.headline}
          accentWord={opportunities.accentWord}
          link={opportunities.link}
        />
        <ul className="mt-12 border-b border-line md:mt-16">
          {opportunities.items.map((item) => (
            <li
              key={item.title}
              className="group relative grid grid-cols-1 gap-3 border-t border-line py-8 md:grid-cols-12 md:items-baseline md:gap-6 md:py-10"
            >
              <p className="font-mono text-caption uppercase tracking-[0.14em] text-muted md:col-span-3">{item.kind}</p>
              <h3 className="font-display text-h3 font-medium text-ink md:col-span-6">
                <Link
                  href={item.href}
                  className="underline decoration-transparent decoration-1 underline-offset-[6px] after:absolute after:inset-0 group-hover:decoration-accent"
                >
                  {marked(item.title)}
                </Link>
              </h3>
              <p className="flex items-center gap-3 font-mono text-caption uppercase tracking-[0.14em] text-ink md:col-span-3 md:justify-end">
                <span
                  aria-hidden="true"
                  className={cx("size-2 rounded-full", item.open ? "bg-accent" : "border border-mist")}
                />
                {item.status}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
