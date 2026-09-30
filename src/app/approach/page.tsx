import type { Metadata } from "next";
import { EmptyState } from "@/components/site/EmptyState";
import { PageHero } from "@/components/site/PageHero";

export const metadata: Metadata = {
  title: "Approach",
  description: "[PLACEHOLDER] The Ocean Harmony methodology and where it has travelled.",
};

export default function ApproachPage() {
  return (
    <>
      <PageHero
        number="01"
        label="Approach"
        title="An approach that travels"
        accentWord="travels"
        intro="[PLACEHOLDER: two sentences on how the Ocean Harmony methodology works, from its start in Winneba to trainings in Morocco.]"
      />
      <EmptyState
        countLabel="Pillars published"
        title="The pillars are being written"
        accentWord="pillars"
        body="[PLACEHOLDER: ocean literacy, storytelling, play-based learning, exploration, local and community knowledge, and youth engagement will each be described here.]"
        action={{ label: "See the places", href: "/places" }}
      />
    </>
  );
}
