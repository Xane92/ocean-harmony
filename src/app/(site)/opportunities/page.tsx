import type { Metadata } from "next";
import { EmptyState } from "@/components/site/EmptyState";
import { IndexList } from "@/components/site/IndexList";
import { PageHero } from "@/components/site/PageHero";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { getOpportunities } from "@/content/collections";
import { opportunityItem } from "@/content/items";
import { opportunityState } from "@/lib/opportunity";

export const metadata: Metadata = {
  title: "Opportunities",
  description: "Volunteer roles, fellowships, internships and programs with Ocean Harmony.",
  alternates: { canonical: "/opportunities" },
};

export default async function OpportunitiesPage() {
  const all = await getOpportunities();
  const current = all.filter((o) => opportunityState(o.opens_on, o.closes_on).label !== "Closed");
  const closed = all.filter((o) => opportunityState(o.opens_on, o.closes_on).label === "Closed").reverse();

  return (
    <>
      <PageHero
        number="05"
        label="Opportunities"
        title="Opportunities to join the work"
        accentWord="join"
        intro="[PLACEHOLDER: one or two sentences on who these opportunities are for.]"
      />
      {current.length === 0 ? (
        <EmptyState
          countLabel="Open opportunities"
          title="Nothing open right now"
          accentWord="open"
          body="Volunteer roles, fellowships, internships and programs are listed here with their closing dates. Check back soon."
          action={{ label: "Partner with us instead", href: "/partner" }}
        />
      ) : (
        <Container className="pb-16 md:pb-24">
          <IndexList label="Open opportunities" items={current.map(opportunityItem)} />
        </Container>
      )}
      {closed.length > 0 && (
        <Container as="section" aria-label="Closed opportunities" className="flex flex-col gap-8 pb-24 md:pb-32">
          <Eyebrow label="Closed" />
          <IndexList numbered={false} items={closed.slice(0, 12).map(opportunityItem)} />
        </Container>
      )}
    </>
  );
}
