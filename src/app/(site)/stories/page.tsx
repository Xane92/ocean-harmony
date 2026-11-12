import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState } from "@/components/site/EmptyState";
import { IndexList } from "@/components/site/IndexList";
import { PageHero } from "@/components/site/PageHero";
import { RelatedSection } from "@/components/site/RelatedSection";
import { Container } from "@/components/ui/Container";
import { getPlaces, getRadioCampaigns, getStories } from "@/content/collections";
import { radioItem, storyItem } from "@/content/items";
import { storyTypeLabels } from "@/content/labels";
import type { StoryType } from "@/lib/supabase/types";
import { cx } from "@/lib/cx";

export const metadata: Metadata = {
  title: "Stories",
  description: "Field stories, community voices, photo essays, video and radio from Ocean Harmony's work on the coast.",
  alternates: { canonical: "/stories" },
};

type Kind = StoryType | "radio";
const kinds: { value: Kind; label: string }[] = [
  ...(Object.entries(storyTypeLabels) as [StoryType, string][]).map(([value, label]) => ({ value, label })),
  { value: "radio", label: "Radio" },
];

function href(kind?: string, place?: string) {
  const q = new URLSearchParams();
  if (kind) q.set("type", kind);
  if (place) q.set("place", place);
  const s = q.toString();
  return s ? `/stories?${s}` : "/stories";
}

const chip = (active: boolean) =>
  cx(
    "inline-flex min-h-11 items-center px-3 font-mono text-caption uppercase tracking-[0.12em]",
    active ? "bg-ink text-surface" : "text-ink underline decoration-line underline-offset-4 hover:decoration-accent",
  );

export default async function StoriesPage({ searchParams }: PageProps<"/stories">) {
  const sp = await searchParams;
  const typeParam = typeof sp.type === "string" ? sp.type : undefined;
  const placeParam = typeof sp.place === "string" ? sp.place : undefined;
  const kind = kinds.find((k) => k.value === typeParam)?.value;

  const [places, stories, radio] = await Promise.all([
    getPlaces(),
    kind === "radio" ? Promise.resolve([]) : getStories({ type: kind as StoryType | undefined, placeSlug: placeParam }),
    kind && kind !== "radio" ? Promise.resolve([]) : getRadioCampaigns(),
  ]);
  const place = places.find((p) => p.slug === placeParam);
  const radioShown = place ? radio.filter((r) => r.place?.slug === place.slug) : radio;
  const filtered = Boolean(kind || place);
  const nothing = stories.length === 0 && radioShown.length === 0;

  return (
    <>
      <PageHero
        number="04"
        label="Stories"
        title="Stories from the field"
        accentWord="field"
        intro="[PLACEHOLDER: one or two sentences on the voices and formats collected here.]"
      />

      <Container as="nav" aria-label="Filter stories" className="flex flex-col gap-4 pb-12">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-2 font-mono text-caption uppercase tracking-[0.14em] text-muted">Kind</span>
          <Link href={href(undefined, placeParam)} className={chip(!kind)} aria-current={!kind ? "page" : undefined}>
            All
          </Link>
          {kinds.map((k) => (
            <Link key={k.value} href={href(k.value, placeParam)} className={chip(kind === k.value)} aria-current={kind === k.value ? "page" : undefined}>
              {k.label}
            </Link>
          ))}
        </div>
        {places.length > 1 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-2 font-mono text-caption uppercase tracking-[0.14em] text-muted">Place</span>
            <Link href={href(kind)} className={chip(!place)} aria-current={!place ? "page" : undefined}>
              Everywhere
            </Link>
            {places.map((p) => (
              <Link key={p.id} href={href(kind, p.slug)} className={chip(place?.id === p.id)} aria-current={place?.id === p.id ? "page" : undefined}>
                {p.name}
              </Link>
            ))}
          </div>
        )}
      </Container>

      {nothing ? (
        filtered ? (
          <EmptyState
            countLabel="Stories match"
            title="Nothing here yet"
            accentWord="yet"
            body="No stories match this filter. Try another kind or place."
            action={{ label: "See all stories", href: "/stories" }}
          />
        ) : (
          <EmptyState
            countLabel="Stories published"
            title="The first stories are being gathered"
            accentWord="gathered"
            body="Field stories, community voices, photo essays, video and radio will appear here."
          />
        )
      ) : (
        <>
          {stories.length > 0 && (
            <Container className="pb-16 md:pb-24">
              <IndexList label="Stories" items={stories.map(storyItem)} />
            </Container>
          )}
          {radioShown.length > 0 && (
            <div className={cx(stories.length > 0 && "border-t border-line")}>
              <RelatedSection number="01" label="On air" title="Radio campaigns" accentWord="Radio" items={radioShown.map(radioItem)} />
            </div>
          )}
        </>
      )}
    </>
  );
}
