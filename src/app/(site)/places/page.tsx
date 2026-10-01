import type { Metadata } from "next";
import { EmptyState } from "@/components/site/EmptyState";
import { PageHero } from "@/components/site/PageHero";

export const metadata: Metadata = {
  title: "Places",
  description: "[PLACEHOLDER] The places where Ocean Harmony works, starting in Winneba, Ghana.",
};

export default function PlacesPage() {
  return (
    <>
      <PageHero
        number="02"
        label="Places"
        title="Places and the people in them"
        accentWord="people"
        intro="[PLACEHOLDER: one or two sentences introducing the places, beginning with Winneba.]"
      />
      <EmptyState
        countLabel="Places published"
        title="The first place is on its way"
        accentWord="first"
        body="[PLACEHOLDER: each place will have its own page with stories, StoryMaps, radio campaigns and partners.]"
        action={{ label: "Read about the approach", href: "/approach" }}
      />
    </>
  );
}
