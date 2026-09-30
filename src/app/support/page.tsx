import type { Metadata } from "next";
import { EmptyState } from "@/components/site/EmptyState";
import { PageHero } from "@/components/site/PageHero";

export const metadata: Metadata = {
  title: "Support",
  description: "[PLACEHOLDER] Ways to support specific Ocean Harmony programs.",
};

export default function SupportPage() {
  return (
    <>
      <PageHero
        number="08"
        label="Support"
        title="Support a specific program"
        accentWord="specific"
        intro="[PLACEHOLDER: one or two sentences on how support reaches the programs.]"
      />
      <EmptyState
        countLabel="Programs published"
        title="Programs are being listed"
        accentWord="listed"
        body="[PLACEHOLDER: each program will be described here with an inquiry form. Online giving comes later.]"
        action={{ label: "Contact us", href: "/contact" }}
      />
    </>
  );
}
