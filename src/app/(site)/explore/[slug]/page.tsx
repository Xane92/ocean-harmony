import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StoryMapFacade } from "@/components/storymap/StoryMapFacade";
import { Container } from "@/components/ui/Container";
import { Headline } from "@/components/ui/Headline";
import { Text } from "@/components/ui/Text";
import { getStoryMap } from "@/content/collections";
import { toPhoto } from "@/content/media";
import { pageMetadata } from "@/content/seo";

export async function generateMetadata({ params }: PageProps<"/explore/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const map = await getStoryMap(slug);
  if (!map) return {};
  return pageMetadata({ path: `/explore/${map.slug}`, title: map.title, description: map.summary, image: map.poster_image, seo: map.seo });
}

export default async function StoryMapPage({ params }: PageProps<"/explore/[slug]">) {
  const { slug } = await params;
  const map = await getStoryMap(slug);
  if (!map) notFound();

  return (
    <Container className="flex flex-col gap-6 pt-10 pb-24 md:pt-16 md:pb-32">
      <Link
        href="/explore"
        className="inline-flex min-h-11 items-center self-start font-mono text-caption uppercase tracking-[0.14em] text-ink underline decoration-line underline-offset-[6px] hover:decoration-accent"
      >
        <span aria-hidden="true">←&nbsp;</span>All StoryMaps
      </Link>
      <p className="font-mono text-caption uppercase tracking-[0.14em] text-muted">
        StoryMap
        {map.place && (
          <>
            <span aria-hidden="true"> / </span>
            <Link href={`/places/${map.place.slug}`} className="underline decoration-line underline-offset-4 hover:decoration-accent">
              {map.place.name}
            </Link>
          </>
        )}
      </p>
      <Headline level={1} size="h1" text={map.title} className="max-w-[20ch]" />
      {map.summary && <Text size="body-lg">{map.summary}</Text>}
      <div className="mt-6">
        <StoryMapFacade title={map.title} url={map.url} poster={toPhoto(map.poster_image)} />
      </div>
    </Container>
  );
}
