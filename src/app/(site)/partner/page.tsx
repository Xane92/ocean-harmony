import type { Metadata } from "next";
import { EmptyState } from "@/components/site/EmptyState";
import { PageHero } from "@/components/site/PageHero";

export const metadata: Metadata = {
  title: "Partner With Us",
  description: "[PLACEHOLDER] Collaborate with Ocean Harmony or adapt the approach in your place.",
};

export default function PartnerPage() {
  return (
    <>
      <PageHero
        number="07"
        label="Partner With Us"
        title="Bring the approach to your coast"
        accentWord="coast"
        intro="[PLACEHOLDER: one or two sentences for organisations, schools, universities, funders and communities.]"
      />
      <EmptyState
        countLabel="Pathways published"
        title="Partnership pathways are coming"
        accentWord="pathways"
        body="[PLACEHOLDER: pathways and an inquiry form will live here. Until then, reach us through the contact page.]"
        action={{ label: "Contact us", href: "/contact" }}
      />
    </>
  );
}
