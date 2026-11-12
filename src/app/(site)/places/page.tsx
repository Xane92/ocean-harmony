import type { Metadata } from "next";
import { EmptyState } from "@/components/site/EmptyState";
import { IndexList } from "@/components/site/IndexList";
import { PageHero } from "@/components/site/PageHero";
import { Container } from "@/components/ui/Container";
import { getPlaces } from "@/content/collections";
import { placeStatusLabels } from "@/content/labels";
import { toPhoto } from "@/content/media";

export const metadata: Metadata = {
  title: "Places",
  description: "The places where the Ocean Harmony approach has worked or is heading, beginning in Winneba, Ghana.",
  alternates: { canonical: "/places" },
};

export default async function PlacesPage() {
  const places = await getPlaces();

  return (
    <>
      <PageHero
        number="02"
        label="Places"
        title="Places and the people in them"
        accentWord="people"
        intro="[PLACEHOLDER: one or two sentences introducing the places, beginning with Winneba.]"
      />
      {places.length === 0 ? (
        <EmptyState
          countLabel="Places published"
          title="The first place is on its way"
          accentWord="first"
          body="Each place will have its own page with its stories, StoryMaps, radio campaigns and opportunities."
          action={{ label: "Read about the approach", href: "/approach" }}
        />
      ) : (
        <Container className="pb-24 md:pb-32">
          <IndexList
            label="Places"
            items={places.map((p) => ({
              key: p.id,
              href: `/places/${p.slug}`,
              title: p.name,
              kicker: p.country,
              summary: p.summary,
              meta: placeStatusLabels[p.place_status],
              live: p.place_status === "active",
              photo: toPhoto(p.hero_image),
            }))}
          />
        </Container>
      )}
    </>
  );
}
