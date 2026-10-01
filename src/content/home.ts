import type { SanityImageSource } from "@sanity/image-url";
import { cache } from "react";
import { sanityFetch } from "@/sanity/client";
import { urlFor } from "@/sanity/image";
import { homePageQuery } from "@/sanity/queries";
import type { HomePageQueryResult } from "@/sanity/types";
import { homeFallback, type HomeContent, type HomeStory } from "./fallback";
import type { Photo } from "./photos";

type SanityPhoto = {
  asset: unknown;
  hotspot?: { x?: number | null; y?: number | null } | null;
  alt?: string | null;
  caption?: string | null;
  lqip?: string | null;
  dimensions?: { width?: number | null; height?: number | null } | null;
} | null;

/** Sanity image with alt text to the Photo shape the home components use. Null when unusable. */
function toPhoto(image: SanityPhoto | undefined): Photo | null {
  if (!image?.asset || !image.alt) return null;
  const { hotspot } = image;
  return {
    src: urlFor(image as SanityImageSource).width(2400).fit("max").url(),
    alt: image.alt,
    width: image.dimensions?.width ?? 2400,
    height: image.dimensions?.height ?? 1600,
    caption: image.caption ?? undefined,
    position:
      hotspot?.x != null && hotspot?.y != null
        ? `${Math.round(hotspot.x * 100)}% ${Math.round(hotspot.y * 100)}%`
        : undefined,
    blurDataURL: image.lqip ?? undefined,
  };
}

// Mirrors the story type list in the Sanity schema, without pulling Studio code into the page bundle.
const storyTypeLabels: Record<string, string> = {
  fieldStory: "Field story",
  communityVoice: "Community voice",
  photoEssay: "Photo essay",
  video: "Video",
};

type HomeSeo = NonNullable<HomePageQueryResult>["seo"];

async function fetchHome(): Promise<HomePageQueryResult | null> {
  try {
    return await sanityFetch({ query: homePageQuery, tags: ["homePage", "storyMap", "story", "place"] });
  } catch (error) {
    // The page must still render if Sanity is unreachable; fall back to local content.
    console.error("Home: Sanity fetch failed, using fallback content.", error);
    return null;
  }
}

/** Home page content: the Sanity home document where filled in, the local fallback everywhere else. */
export const getHomeContent = cache(async (): Promise<{ content: HomeContent; seo: HomeSeo | null }> => {
  const doc = await fetchHome();
  const fb = homeFallback;
  if (!doc) return { content: fb, seo: null };

  const heroPhoto = toPhoto(doc.heroImage);
  const heroFromCms = Boolean(doc.heroHeadline);

  const map = doc.featuredStoryMap;
  const stories: HomeStory[] = (doc.featuredStories ?? [])
    .filter((s): s is NonNullable<typeof s> => Boolean(s?.title && s.slug))
    .map((s) => ({
      title: s.title as string,
      kind: (s.storyType && storyTypeLabels[s.storyType]) || "Story",
      place: s.place?.name ?? "",
      href: `/stories/${s.slug}`,
      photo: toPhoto(s.heroImage),
    }));

  return {
    seo: doc.seo,
    content: {
      ...fb,
      hero: {
        ...fb.hero,
        headline: doc.heroHeadline ?? fb.hero.headline,
        // A CMS headline only gets the accent word chosen for it in the CMS.
        accentWord: heroFromCms ? (doc.heroAccentWord ?? undefined) : fb.hero.accentWord,
        intro: doc.heroIntro ?? fb.hero.intro,
        photo: heroPhoto ?? fb.hero.photo,
      },
      explore: map?.title
        ? {
            ...fb.explore,
            storyMap: {
              title: map.title,
              summary: map.summary ?? "",
              url: map.url ?? null,
              poster: toPhoto(map.posterImage) ?? fb.explore.storyMap.poster,
            },
          }
        : fb.explore,
      stories: stories.length > 0 ? { ...fb.stories, items: stories } : fb.stories,
    },
  };
});
