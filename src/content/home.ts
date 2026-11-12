import "server-only";
import { cache } from "react";
import { opportunityState } from "@/lib/opportunity";
import { publicClient } from "@/lib/supabase/public";
import type { HomeRow, OpportunityRow, PlaceRow, Seo, StoredImage, StoryMapRow } from "@/lib/supabase/types";
import { homeFallback, type HomeContent, type HomeOpportunity, type HomePlace, type HomeStory } from "./fallback";
import { toPhoto } from "./media";

// Home page content: Supabase where the client's team has filled it in, the local fallback
// everywhere else. A section switches to CMS content only once it has something published,
// and any query error falls back too, so a paused or unreachable database never breaks the page.

const storyTypeLabels: Record<string, string> = {
  field_story: "Field story",
  community_voice: "Community voice",
  photo_essay: "Photo essay",
  video: "Video",
};

const placeStatusLabels: Record<PlaceRow["place_status"], string> = {
  active: "Active",
  upcoming: "Upcoming",
  past: "Past",
};

const opportunityTypeLabels: Record<OpportunityRow["opportunity_type"], string> = {
  volunteer: "Volunteer",
  fellowship: "Fellowship",
  internship: "Internship",
  program: "Program",
};

type FeaturedStory = {
  id: string;
  title: string;
  slug: string;
  story_type: string;
  hero_image: StoredImage | null;
  place: { name: string } | null;
};

type HomeData = {
  home: HomeRow | null;
  storyMap: StoryMapRow | null;
  stories: FeaturedStory[];
  places: PlaceRow[];
  opportunities: OpportunityRow[];
  pillars: string[];
};

async function fetchHome(): Promise<HomeData | null> {
  const db = publicClient(["home", "approach", "storymaps", "stories", "places", "opportunities"]);
  if (!db) return null;

  try {
    const [home, approach, places, opportunities] = await Promise.all([
      db.from("home").select("*").eq("id", 1).maybeSingle<HomeRow>(),
      db.from("approach").select("pillars").eq("id", 1).maybeSingle<{ pillars: { title?: string }[] }>(),
      db.from("places").select("*").order("sort_order").returns<PlaceRow[]>(),
      db.from("opportunities").select("*").order("closes_on", { ascending: true, nullsFirst: false }).returns<OpportunityRow[]>(),
    ]);
    for (const r of [home, approach, places, opportunities]) if (r.error) throw r.error;

    const row = home.data;
    const [storyMap, stories] = await Promise.all([
      row?.featured_storymap_id
        ? db.from("storymaps").select("*").eq("id", row.featured_storymap_id).maybeSingle<StoryMapRow>()
        : Promise.resolve({ data: null, error: null }),
      row?.featured_story_ids?.length
        ? db
            .from("stories")
            .select("id, title, slug, story_type, hero_image, place:places(name)")
            .in("id", row.featured_story_ids)
            .returns<FeaturedStory[]>()
        : Promise.resolve({ data: [] as FeaturedStory[], error: null }),
    ]);
    if (storyMap.error) throw storyMap.error;
    if (stories.error) throw stories.error;

    // Keep the editor's chosen order.
    const order = row?.featured_story_ids ?? [];
    const sorted = [...(stories.data ?? [])].sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));

    return {
      home: row,
      storyMap: storyMap.data,
      stories: sorted,
      places: places.data ?? [],
      opportunities: opportunities.data ?? [],
      pillars: (approach.data?.pillars ?? []).map((p) => p.title?.trim() ?? "").filter(Boolean),
    };
  } catch (error) {
    console.error("Home: Supabase fetch failed, using fallback content.", error);
    return null;
  }
}

export const getHomeContent = cache(async (): Promise<{ content: HomeContent; seo: Seo | null }> => {
  const data = await fetchHome();
  const fb = homeFallback;
  if (!data) return { content: fb, seo: null };

  const { home } = data;
  const heroFromCms = Boolean(home?.hero_headline);

  const stories: HomeStory[] = data.stories.map((s) => ({
    title: s.title,
    kind: storyTypeLabels[s.story_type] ?? "Story",
    place: s.place?.name ?? "",
    href: `/stories/${s.slug}`,
    photo: toPhoto(s.hero_image),
  }));

  const places: HomePlace[] = data.places.map((p) => ({
    name: p.name,
    country: p.country ?? undefined,
    status: placeStatusLabels[p.place_status],
    note: p.summary ?? undefined,
  }));
  const countries = new Set(data.places.map((p) => p.country?.trim().toLowerCase()).filter(Boolean)).size;

  const opportunities: HomeOpportunity[] = data.opportunities
    .map((o) => ({ o, state: opportunityState(o.opens_on, o.closes_on) }))
    .filter(({ state }) => state.label !== "Closed")
    .slice(0, 4)
    .map(({ o, state }) => ({
      title: o.title,
      kind: opportunityTypeLabels[o.opportunity_type],
      status: state.label,
      open: state.open,
      href: `/opportunities/${o.slug}`,
    }));

  const map = data.storyMap;

  return {
    seo: home?.seo ?? null,
    content: {
      ...fb,
      hero: {
        ...fb.hero,
        headline: home?.hero_headline ?? fb.hero.headline,
        // A CMS headline only gets the accent word chosen for it in the CMS.
        accentWord: heroFromCms ? (home?.hero_accent_word ?? undefined) : fb.hero.accentWord,
        intro: home?.hero_intro ?? fb.hero.intro,
        photo: toPhoto(home?.hero_image) ?? fb.hero.photo,
      },
      approach: data.pillars.length > 0 ? { ...fb.approach, pillars: data.pillars } : fb.approach,
      places:
        places.length > 0
          ? {
              ...fb.places,
              items: places,
              count: countries > 0 ? { value: String(countries), label: countries === 1 ? "Country" : "Countries" } : fb.places.count,
            }
          : fb.places,
      explore: map
        ? {
            ...fb.explore,
            storyMap: {
              title: map.title,
              summary: map.summary ?? "",
              url: map.url,
              poster: toPhoto(map.poster_image) ?? fb.explore.storyMap.poster,
            },
          }
        : fb.explore,
      stories: stories.length > 0 ? { ...fb.stories, items: stories } : fb.stories,
      opportunities: opportunities.length > 0 ? { ...fb.opportunities, items: opportunities } : fb.opportunities,
    },
  };
});
