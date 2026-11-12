import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { VideoFacade } from "@/components/media/VideoFacade";
import { RichText } from "@/components/rich-text/RichText";
import { DetailHero } from "@/components/site/DetailHero";
import { Gallery } from "@/components/site/Gallery";
import { Container } from "@/components/ui/Container";
import { getStory } from "@/content/collections";
import { formatDate, storyTypeLabels } from "@/content/labels";
import { toPhoto } from "@/content/media";
import { pageMetadata } from "@/content/seo";

export async function generateMetadata({ params }: PageProps<"/stories/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const story = await getStory(slug);
  if (!story) return {};
  return pageMetadata({ path: `/stories/${story.slug}`, title: story.title, description: story.excerpt, image: story.hero_image, seo: story.seo });
}

export default async function StoryPage({ params }: PageProps<"/stories/[slug]">) {
  const { slug } = await params;
  const story = await getStory(slug);
  if (!story) notFound();

  const photo = toPhoto(story.hero_image);
  // A video story leads with the player instead of a still.
  const video = story.video_url;
  const meta = [story.author && `By ${story.author}`, formatDate(story.published_on)].filter(Boolean).join(" / ");

  return (
    <article>
      <DetailHero
        back={{ href: "/stories", label: "All stories" }}
        kicker={
          <>
            {storyTypeLabels[story.story_type]}
            {story.place && (
              <>
                <span aria-hidden="true"> / </span>
                <Link href={`/places/${story.place.slug}`} className="underline decoration-line underline-offset-4 hover:decoration-accent">
                  {story.place.name}
                </Link>
              </>
            )}
          </>
        }
        title={story.title}
        intro={story.excerpt}
        meta={meta || undefined}
        photo={video ? null : photo}
      />
      {video && (
        <Container className="pb-8">
          <VideoFacade url={video} title={story.title} poster={photo} />
        </Container>
      )}
      {story.body && (
        <Container className="py-16 md:py-24">
          <RichText value={story.body} className="md:ml-[calc(100%/12)]" />
        </Container>
      )}
      <Gallery images={story.gallery ?? []} number="01" />
    </article>
  );
}
