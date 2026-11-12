import type { Metadata } from "next";
import Image from "next/image";
import { IndexList } from "@/components/site/IndexList";
import { PageHero } from "@/components/site/PageHero";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { DeepSection } from "@/components/ui/DeepSection";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Headline } from "@/components/ui/Headline";
import { getApproach, getPlaces } from "@/content/collections";
import { homeFallback } from "@/content/fallback";
import { placeStatusLabels } from "@/content/labels";
import { toPhoto } from "@/content/media";
import { pageMetadata } from "@/content/seo";

const DEFAULT_INTRO =
  "[PLACEHOLDER: two sentences on how the Ocean Harmony methodology works, from its start in Winneba to trainings in Morocco.]";

export async function generateMetadata(): Promise<Metadata> {
  const approach = await getApproach();
  return pageMetadata({
    path: "/approach",
    title: "Approach",
    description:
      approach?.intro ||
      "The Ocean Harmony approach: ocean literacy, storytelling, play-based learning, exploration, local and community knowledge and youth engagement.",
    seo: approach?.seo,
  });
}

export default async function ApproachPage() {
  const [approach, places] = await Promise.all([getApproach(), getPlaces()]);

  // The six pillar names come from the client brief, so they stand in until the CMS has its own.
  const pillars =
    approach?.pillars?.filter((p) => p?.title).length
      ? approach.pillars.filter((p) => p?.title)
      : homeFallback.approach.pillars.map((title) => ({ title, description: null, image: null }));

  return (
    <>
      <PageHero
        number="01"
        label="Approach"
        title="An approach that travels"
        accentWord="travels"
        intro={approach?.intro || DEFAULT_INTRO}
      />

      <Container as="section" aria-labelledby="pillars" className="flex flex-col gap-10 pb-24 md:pb-32">
        <div className="flex flex-col gap-5">
          <Eyebrow number="01" label="The pillars" />
          <Headline id="pillars" text={`${pillars.length === 6 ? "Six" : String(pillars.length)} ways of learning with the ocean`} accentWord="learning" />
        </div>
        <ol className="border-b border-line">
          {pillars.map((p, i) => {
            const photo = toPhoto(p.image);
            return (
              <li key={`${p.title}-${i}`} className="grid grid-cols-[3.5rem_1fr] gap-x-4 gap-y-5 border-t border-line py-10 md:grid-cols-12 md:gap-x-6 md:py-14">
                <p className="font-display text-h2 font-medium tabular-nums text-accent md:col-span-2">{String(i + 1).padStart(2, "0")}</p>
                <div className="col-start-2 flex flex-col gap-4 md:col-span-5 md:col-start-3">
                  <h3 className="font-display text-h2 font-medium text-ink">{p.title}</h3>
                  {p.description ? (
                    <p className="max-w-[52ch] whitespace-pre-line text-body-lg text-muted">{p.description}</p>
                  ) : (
                    <p className="font-mono text-caption tracking-[0.08em] text-muted">[PLACEHOLDER: what this pillar looks like in practice]</p>
                  )}
                </div>
                {photo && (
                  <div className="relative col-span-2 aspect-[3/2] overflow-hidden bg-ink/10 md:col-span-4 md:col-start-9">
                    <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </Container>

      <DeepSection aria-labelledby="travelled" className="py-24 md:py-32">
        <Container className="flex flex-col gap-10">
          <div className="flex flex-col gap-5">
            <Eyebrow number="02" label="Where it has travelled" />
            <Headline id="travelled" text="From Winneba to new coasts" accentWord="coasts" />
          </div>
          {places.length > 0 ? (
            <IndexList
              items={places.map((p) => ({
                key: p.id,
                href: `/places/${p.slug}`,
                title: p.name,
                kicker: p.country,
                summary: p.summary,
                meta: placeStatusLabels[p.place_status],
                live: p.place_status === "active",
              }))}
            />
          ) : (
            <ol className="border-b border-line">
              {homeFallback.places.items.map((p, i) => (
                <li key={p.name} className="grid grid-cols-[2.5rem_1fr] gap-x-4 border-t border-line py-8 md:grid-cols-12 md:gap-x-6">
                  <span className="font-mono text-caption text-accent md:col-span-1">{String(i + 1).padStart(2, "0")}</span>
                  <p className="font-display text-h3 font-medium text-ink md:col-span-7">
                    {p.name}
                    {p.country && `, ${p.country}`}
                  </p>
                  <p className="col-start-2 font-mono text-caption uppercase tracking-[0.14em] text-muted md:col-span-4 md:text-right">
                    {[p.status, p.note].filter(Boolean).join(" / ")}
                  </p>
                </li>
              ))}
            </ol>
          )}
          <Button href="/partner" variant="text" className="self-start">
            Bring the approach to your place
          </Button>
        </Container>
      </DeepSection>
    </>
  );
}
