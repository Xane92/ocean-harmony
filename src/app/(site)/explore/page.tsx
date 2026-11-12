import type { Metadata } from "next";
import { EmptyState } from "@/components/site/EmptyState";
import { IndexList } from "@/components/site/IndexList";
import { PageHero } from "@/components/site/PageHero";
import { StoryMapFacade } from "@/components/storymap/StoryMapFacade";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { getStoryMaps } from "@/content/collections";
import { storyMapItem } from "@/content/items";
import { toPhoto } from "@/content/media";

export const metadata: Metadata = {
  title: "Explore",
  description: "Interactive ArcGIS StoryMaps of the coasts and communities Ocean Harmony works with.",
  alternates: { canonical: "/explore" },
};

export default async function ExplorePage() {
  const maps = await getStoryMaps();
  const [lead, ...rest] = maps;

  return (
    <>
      <PageHero
        number="03"
        label="Explore"
        title="Explore the coast by map"
        accentWord="map"
        intro="[PLACEHOLDER: one or two sentences on what the StoryMaps show and how to use them.]"
      />
      {!lead ? (
        <EmptyState
          countLabel="StoryMaps published"
          title="Maps are being drawn"
          accentWord="drawn"
          body="ArcGIS StoryMaps will open right on this page, without leaving the site."
        />
      ) : (
        <>
          <Container as="section" aria-label={lead.title} className="flex flex-col gap-6 pb-16 md:pb-24">
            <Eyebrow number="01" label={lead.place?.name ? `Featured / ${lead.place.name}` : "Featured"} />
            <h2 className="max-w-[24ch] font-display text-h2 font-medium text-ink">{lead.title}</h2>
            {lead.summary && <p className="max-w-measure text-body-lg text-muted">{lead.summary}</p>}
            <StoryMapFacade title={lead.title} url={lead.url} poster={toPhoto(lead.poster_image)} />
          </Container>
          {rest.length > 0 && (
            <Container as="section" aria-label="More StoryMaps" className="flex flex-col gap-10 pb-24 md:pb-32">
              <Eyebrow number="02" label="More maps" />
              <IndexList items={rest.map(storyMapItem)} />
            </Container>
          )}
        </>
      )}
    </>
  );
}
