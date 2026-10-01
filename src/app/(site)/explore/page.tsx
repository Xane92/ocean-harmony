import type { Metadata } from "next";
import { EmptyState } from "@/components/site/EmptyState";
import { PageHero } from "@/components/site/PageHero";

export const metadata: Metadata = {
  title: "Explore",
  description: "[PLACEHOLDER] Interactive StoryMaps of the coast and the communities who know it.",
};

export default function ExplorePage() {
  return (
    <>
      <PageHero
        number="03"
        label="Explore"
        title="Explore the coast by map"
        accentWord="map"
        intro="[PLACEHOLDER: one or two sentences on what the StoryMaps show and how to use them.]"
      />
      <EmptyState
        countLabel="StoryMaps published"
        title="Maps are being drawn"
        accentWord="drawn"
        body="[PLACEHOLDER: ArcGIS StoryMaps will open right on this page.]"
        action={{ label: "Read stories instead", href: "/stories" }}
      />
    </>
  );
}
