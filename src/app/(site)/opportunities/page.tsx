import type { Metadata } from "next";
import { EmptyState } from "@/components/site/EmptyState";
import { PageHero } from "@/components/site/PageHero";
import { socials } from "@/lib/site";

export const metadata: Metadata = {
  title: "Opportunities",
  description: "[PLACEHOLDER] Volunteer roles, fellowships, internships and programs with Ocean Harmony.",
};

export default function OpportunitiesPage() {
  return (
    <>
      <PageHero
        number="05"
        label="Opportunities"
        title="Opportunities to join the work"
        accentWord="join"
        intro="[PLACEHOLDER: one or two sentences on who these opportunities are for.]"
      />
      <EmptyState
        countLabel="Open opportunities"
        title="Nothing open right now"
        accentWord="open"
        body="[PLACEHOLDER: volunteer roles, fellowships, internships and programs will be listed here with their closing dates.]"
        action={{ label: "Follow along on Instagram", href: socials[0].href }}
      />
    </>
  );
}
