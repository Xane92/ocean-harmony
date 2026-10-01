import { BigNumber } from "@/components/ui/BigNumber";
import { Container } from "@/components/ui/Container";
import { marked } from "@/components/ui/Marked";
import type { HomeContent } from "@/content/fallback";
import { SectionHeading } from "./SectionHeading";

/** Large editorial list of places with their status in mono, anchored by the country count. */
export function Places({ places }: { places: HomeContent["places"] }) {
  return (
    <section aria-labelledby="home-places" className="border-t border-line">
      <Container className="py-24 md:py-40">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            id="home-places"
            number="03"
            eyebrow={places.eyebrow}
            headline={places.headline}
            accentWord={places.accentWord}
            link={places.link}
            className="lg:flex-1"
          />
          <BigNumber value={places.count.value} label={places.count.label} className="lg:items-end lg:text-right" />
        </div>

        <ol className="mt-16 border-b border-line md:mt-24">
          {places.items.map((place, i) => (
            <li
              key={place.name}
              className="grid grid-cols-[2.5rem_1fr] gap-x-4 gap-y-3 border-t border-line py-8 md:grid-cols-12 md:items-baseline md:gap-x-6 md:py-10"
            >
              <span className="font-mono text-caption tracking-[0.14em] text-accent md:col-span-1">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display text-h1 font-medium text-ink md:col-span-7">
                {place.name}
                {place.country && <span className="text-muted">, {place.country}</span>}
              </h3>
              <div className="col-start-2 flex flex-col gap-1 font-mono text-caption uppercase tracking-[0.14em] md:col-span-4 md:col-start-auto md:items-end md:text-right">
                <span className="text-ink">{place.status}</span>
                {place.note && <span className="text-muted">{marked(place.note)}</span>}
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
