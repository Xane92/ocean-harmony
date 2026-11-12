import type { Metadata } from "next";
import Image from "next/image";
import { EmptyState } from "@/components/site/EmptyState";
import { PageHero } from "@/components/site/PageHero";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Headline } from "@/components/ui/Headline";
import { getPartners, getTeam } from "@/content/collections";
import { partnerTypeLabels } from "@/content/labels";
import { toPhoto } from "@/content/media";

export const metadata: Metadata = {
  title: "About",
  description: "The story, team and partners behind Ocean Harmony Initiative.",
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const [team, partners] = await Promise.all([getTeam(), getPartners()]);

  return (
    <>
      <PageHero
        number="06"
        label="About"
        title="How Ocean Harmony began"
        accentWord="began"
        intro="[PLACEHOLDER: two sentences on the Ocean Harmony project in Winneba and what grew from it.]"
      />

      {team.length === 0 && partners.length === 0 && (
        <EmptyState
          countLabel="Team members published"
          title="Team and partners coming soon"
          accentWord="partners"
          body="The people and partners behind the work will be introduced here."
        />
      )}

      {team.length > 0 && (
        <Container as="section" aria-labelledby="team" className="flex flex-col gap-12 pb-24 md:pb-32">
          <div className="flex flex-col gap-5">
            <Eyebrow number="01" label="Team" />
            <Headline id="team" text="The people doing the work" accentWord="people" />
          </div>
          <ul className="grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
            {team.map((m) => {
              const photo = toPhoto(m.photo);
              return (
                <li key={m.id} className="flex flex-col gap-4">
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-ink/10">
                    {photo && (
                      <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
                    )}
                  </div>
                  <div className="flex flex-col gap-1 border-t border-line pt-4">
                    <h3 className="font-display text-h3 font-medium text-ink">{m.name}</h3>
                    {m.role && <p className="font-mono text-caption uppercase tracking-[0.14em] text-muted">{m.role}</p>}
                  </div>
                  {m.bio && <p className="whitespace-pre-line text-body text-muted">{m.bio}</p>}
                </li>
              );
            })}
          </ul>
        </Container>
      )}

      {partners.length > 0 && (
        <Container as="section" aria-labelledby="partners" className="flex flex-col gap-12 border-t border-line py-24 md:py-32">
          <div className="flex flex-col gap-5">
            <Eyebrow number={team.length > 0 ? "02" : "01"} label="Partners" />
            <Headline id="partners" text="Who we work alongside" accentWord="alongside" />
          </div>
          <ul className="grid grid-cols-2 border-l border-t border-line md:grid-cols-3 lg:grid-cols-4">
            {partners.map((p) => {
              const logo = toPhoto(p.logo);
              const inner = (
                <>
                  <div className="relative h-16 w-full">
                    {logo ? (
                      <Image src={logo.src} alt="" fill sizes="200px" className="object-contain object-left" />
                    ) : (
                      <span className="font-display text-body-lg font-semibold text-ink">{p.name}</span>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-display text-body font-semibold text-ink">{p.name}</span>
                    <span className="font-mono text-caption uppercase tracking-[0.14em] text-muted">{partnerTypeLabels[p.partner_type]}</span>
                  </div>
                </>
              );
              return (
                <li key={p.id} className="border-r border-b border-line">
                  {p.website ? (
                    <a href={p.website} target="_blank" rel="noopener noreferrer" className="flex h-full flex-col justify-between gap-6 p-5 hover:bg-ink/5 md:p-6">
                      {inner}
                    </a>
                  ) : (
                    <div className="flex h-full flex-col justify-between gap-6 p-5 md:p-6">{inner}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </Container>
      )}
    </>
  );
}
