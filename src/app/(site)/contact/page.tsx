import type { Metadata } from "next";
import { EmptyState } from "@/components/site/EmptyState";
import { PageHero } from "@/components/site/PageHero";
import { socials } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "[PLACEHOLDER] Get in touch with Ocean Harmony Initiative.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        number="09"
        label="Contact"
        title="Get in touch"
        accentWord="touch"
        intro="[PLACEHOLDER: one sentence on who to contact and how quickly the team replies.]"
      />
      <EmptyState
        countLabel="Contact form"
        title="The contact form is on its way"
        accentWord="form"
        body="[PLACEHOLDER: a contact form and WhatsApp button will be here. For now, message us on Instagram.]"
        action={{ label: "Instagram", href: socials[0].href }}
      />
    </>
  );
}
