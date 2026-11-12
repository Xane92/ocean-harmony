import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EpisodeList } from "@/components/media/EpisodeList";
import { DetailHero } from "@/components/site/DetailHero";
import { Gallery } from "@/components/site/Gallery";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { getRadioCampaign } from "@/content/collections";
import { formatRange } from "@/content/labels";
import { toPhoto } from "@/content/media";
import { pageMetadata } from "@/content/seo";

export async function generateMetadata({ params }: PageProps<"/stories/radio/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const r = await getRadioCampaign(slug);
  if (!r) return {};
  return pageMetadata({ path: `/stories/radio/${r.slug}`, title: r.title, description: r.summary, image: r.hero_image, seo: r.seo });
}

export default async function RadioPage({ params }: PageProps<"/stories/radio/[slug]">) {
  const { slug } = await params;
  const r = await getRadioCampaign(slug);
  if (!r) notFound();

  const episodes = (r.episodes ?? []).filter((e) => e?.title);
  const topics = (r.topics ?? []).filter(Boolean);
  let n = 0;
  const next = () => String(++n).padStart(2, "0");

  return (
    <article>
      <DetailHero
        back={{ href: "/stories?type=radio", label: "All radio" }}
        kicker={
          <>
            Radio{r.station && ` / ${r.station}`}
            {r.place && (
              <>
                <span aria-hidden="true"> / </span>
                <Link href={`/places/${r.place.slug}`} className="underline decoration-line underline-offset-4 hover:decoration-accent">
                  {r.place.name}
                </Link>
              </>
            )}
          </>
        }
        title={r.title}
        intro={r.summary}
        meta={formatRange(r.start_date, r.end_date) || undefined}
        photo={toPhoto(r.hero_image)}
      />

      {topics.length > 0 && (
        <Container as="section" aria-label="Topics discussed" className="flex flex-col gap-6 py-16 md:py-24">
          <Eyebrow number={next()} label="What was discussed" />
          <ul className="flex flex-wrap gap-x-8 gap-y-3">
            {topics.map((t) => (
              <li key={t} className="font-display text-h3 font-medium text-ink">
                {t}
              </li>
            ))}
          </ul>
        </Container>
      )}

      {episodes.length > 0 && (
        <Container as="section" aria-label="Episodes" className="flex flex-col gap-10 border-t border-line py-16 md:py-24">
          <Eyebrow number={next()} label={`${episodes.length} ${episodes.length === 1 ? "episode" : "episodes"}`} />
          <EpisodeList episodes={episodes} />
        </Container>
      )}

      <Gallery images={r.gallery ?? []} number={String(n + 1).padStart(2, "0")} />
    </article>
  );
}
