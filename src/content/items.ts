import type { IndexItem } from "@/components/site/IndexList";
import { opportunityState } from "@/lib/opportunity";
import type { OpportunityRow, RadioCampaignRow, StoryMapRow, StoryRow } from "@/lib/supabase/types";
import { formatDate, formatRange, opportunityTypeLabels, storyTypeLabels } from "./labels";
import { toPhoto } from "./media";

// Row to IndexList item, shared by index pages and the related lists on place pages.

const join = (...parts: (string | null | undefined)[]) => parts.filter(Boolean).join(" / ");

export const storyItem = (s: StoryRow): IndexItem => ({
  key: s.id,
  href: `/stories/${s.slug}`,
  title: s.title,
  kicker: join(storyTypeLabels[s.story_type], s.place?.name),
  summary: s.excerpt,
  meta: formatDate(s.published_on) || undefined,
  photo: toPhoto(s.hero_image),
});

export const radioItem = (r: RadioCampaignRow): IndexItem => ({
  key: r.id,
  href: `/stories/radio/${r.slug}`,
  title: r.title,
  kicker: join("Radio", r.station, r.place?.name),
  summary: r.summary,
  meta: join(formatRange(r.start_date, r.end_date), r.episodes?.length ? `${r.episodes.length} episodes` : null) || undefined,
  photo: toPhoto(r.hero_image),
});

export const storyMapItem = (m: StoryMapRow): IndexItem => ({
  key: m.id,
  href: `/explore/${m.slug}`,
  title: m.title,
  kicker: join("StoryMap", m.place?.name),
  summary: m.summary,
  meta: "Open map",
  photo: toPhoto(m.poster_image),
});

export const opportunityItem = (o: OpportunityRow): IndexItem => {
  const state = opportunityState(o.opens_on, o.closes_on);
  const when =
    state.label === "Opening soon" ? (o.opens_on ? `Opens ${formatDate(o.opens_on)}` : null) : o.closes_on ? `Closes ${formatDate(o.closes_on)}` : null;
  return {
    key: o.id,
    href: `/opportunities/${o.slug}`,
    title: o.title,
    kicker: join(opportunityTypeLabels[o.opportunity_type], o.place?.name),
    summary: o.summary,
    meta: join(state.label, when),
    live: state.open,
  };
};
