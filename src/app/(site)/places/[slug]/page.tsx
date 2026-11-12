import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RichText } from "@/components/rich-text/RichText";
import { DetailHero } from "@/components/site/DetailHero";
import { RelatedSection } from "@/components/site/RelatedSection";
import { Container } from "@/components/ui/Container";
import { getPlace } from "@/content/collections";
import { opportunityItem, radioItem, storyItem, storyMapItem } from "@/content/items";
import { placeStatusLabels } from "@/content/labels";
import { toPhoto } from "@/content/media";
import { pageMetadata } from "@/content/seo";

export async function generateMetadata({ params }: PageProps<"/places/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const data = await getPlace(slug);
  if (!data) return {};
  const { place } = data;
  return pageMetadata({ path: `/places/${place.slug}`, title: place.name, description: place.summary, image: place.hero_image, seo: place.seo });
}

export default async function PlacePage({ params }: PageProps<"/places/[slug]">) {
  const { slug } = await params;
  const data = await getPlace(slug);
  if (!data) notFound();
  const { place, stories, storyMaps, radio, opportunities } = data;

  // Number only the sections that appear, so the eyebrows always count 01, 02, 03.
  const sections = [
    { label: "StoryMaps", title: "Explore this place by map", accent: "map", items: storyMaps.map(storyMapItem) },
    { label: "Stories", title: "Stories from here", accent: "here", items: stories.map(storyItem) },
    { label: "On air", title: "Radio from this coast", accent: "Radio", items: radio.map(radioItem) },
    { label: "Opportunities", title: "Ways to take part here", accent: "part", items: opportunities.map(opportunityItem) },
  ].filter((s) => s.items.length > 0);

  return (
    <>
      <DetailHero
        back={{ href: "/places", label: "All places" }}
        kicker={[place.country, placeStatusLabels[place.place_status]].filter(Boolean).join(" / ")}
        title={place.name}
        intro={place.summary}
        photo={toPhoto(place.hero_image)}
      />
      {place.body && (
        <Container className="py-16 md:py-24">
          <RichText value={place.body} className="md:ml-[calc(100%/12)]" />
        </Container>
      )}
      {sections.map((s, i) => (
        <div key={s.label} className="border-t border-line">
          <RelatedSection number={String(i + 1).padStart(2, "0")} label={s.label} title={s.title} accentWord={s.accent} items={s.items} />
        </div>
      ))}
    </>
  );
}
