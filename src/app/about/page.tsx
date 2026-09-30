import type { Metadata } from "next";
import { EmptyState } from "@/components/site/EmptyState";
import { PageHero } from "@/components/site/PageHero";

export const metadata: Metadata = {
  title: "About",
  description: "[PLACEHOLDER] The story, team and partners behind Ocean Harmony Initiative.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        number="06"
        label="About"
        title="How Ocean Harmony began"
        accentWord="began"
        intro="[PLACEHOLDER: two sentences on the Ocean Harmony project in Winneba and what grew from it.]"
      />
      <EmptyState
        countLabel="Team members published"
        title="Team and partners coming soon"
        accentWord="partners"
        body="[PLACEHOLDER: the people and partners behind the work will be introduced here.]"
        action={{ label: "Read about the approach", href: "/approach" }}
      />
    </>
  );
}
