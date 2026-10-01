import type { Metadata } from "next";
import { EmptyState } from "@/components/site/EmptyState";
import { PageHero } from "@/components/site/PageHero";

export const metadata: Metadata = {
  title: "Stories",
  description: "[PLACEHOLDER] Field stories, community voices, photo essays, video and radio.",
};

export default function StoriesPage() {
  return (
    <>
      <PageHero
        number="04"
        label="Stories"
        title="Stories from the field"
        accentWord="field"
        intro="[PLACEHOLDER: one or two sentences on the voices and formats collected here.]"
      />
      <EmptyState
        countLabel="Stories published"
        title="The first stories are being gathered"
        accentWord="gathered"
        body="[PLACEHOLDER: field stories, community voices, photo essays, video and radio will appear here, filterable by type and place.]"
        action={{ label: "Explore the maps", href: "/explore" }}
      />
    </>
  );
}
