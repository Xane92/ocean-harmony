import "server-only";
import { cache } from "react";
import type { TableName } from "@/admin/schema";
import { publicClient } from "@/lib/supabase/public";
import type {
  ApproachRow,
  OpportunityRow,
  PartnerRow,
  PlaceRow,
  RadioCampaignRow,
  SiteSettingsRow,
  StoryMapRow,
  StoryRow,
  StoryType,
  SupportProgramRow,
  TeamMemberRow,
} from "@/lib/supabase/types";

// Public content loaders. RLS only returns published rows to the publishable key, so nothing
// here filters by status. Every loader swallows errors and returns empty, so a paused or
// unreachable database shows the designed empty states instead of breaking the page.

type Result<T> = { data: T | null; error: { message: string } | null };

async function run<T>(label: string, empty: T, query: () => PromiseLike<Result<T>> | null): Promise<T> {
  try {
    const q = query();
    if (!q) return empty;
    const { data, error } = await q;
    if (error) throw error;
    return data ?? empty;
  } catch (error) {
    console.error(`${label}: Supabase fetch failed.`, error);
    return empty;
  }
}

const db = (tables: TableName[]) => publicClient(tables);
const PLACE = "place:places(name, slug)";

// Places -------------------------------------------------------------------------------

export const getPlaces = cache(() =>
  run<PlaceRow[]>("Places", [], () => db(["places"])?.from("places").select("*").order("sort_order").returns<PlaceRow[]>() ?? null),
);

export const getPlace = cache(async (slug: string) => {
  const place = await run<PlaceRow | null>("Place", null, () =>
    db(["places"])?.from("places").select("*").eq("slug", slug).maybeSingle<PlaceRow>() ?? null,
  );
  if (!place) return null;
  const client = db(["stories", "storymaps", "radio_campaigns", "opportunities"]);
  const [stories, storyMaps, radio, opportunities] = await Promise.all([
    run<StoryRow[]>("Place stories", [], () =>
      client?.from("stories").select(`*, ${PLACE}`).eq("place_id", place.id).order("published_on", { ascending: false, nullsFirst: false }).returns<StoryRow[]>() ?? null,
    ),
    run<StoryMapRow[]>("Place StoryMaps", [], () =>
      client?.from("storymaps").select(`*, ${PLACE}`).eq("place_id", place.id).order("sort_order").returns<StoryMapRow[]>() ?? null,
    ),
    run<RadioCampaignRow[]>("Place radio", [], () =>
      client?.from("radio_campaigns").select(`*, ${PLACE}`).eq("place_id", place.id).order("start_date", { ascending: false, nullsFirst: false }).returns<RadioCampaignRow[]>() ?? null,
    ),
    run<OpportunityRow[]>("Place opportunities", [], () =>
      client?.from("opportunities").select(`*, ${PLACE}`).eq("place_id", place.id).order("closes_on", { ascending: true, nullsFirst: false }).returns<OpportunityRow[]>() ?? null,
    ),
  ]);
  return { place, stories, storyMaps, radio, opportunities };
});

// Stories and radio --------------------------------------------------------------------

export const getStories = cache((filter: { type?: StoryType; placeSlug?: string } = {}) =>
  run<StoryRow[]>("Stories", [], () => {
    const client = db(["stories", "places"]);
    if (!client) return null;
    // Filtering by place uses an inner join, so stories without that place drop out.
    let q = client
      .from("stories")
      .select(filter.placeSlug ? "*, place:places!inner(name, slug)" : `*, ${PLACE}`)
      .order("published_on", { ascending: false, nullsFirst: false })
      .order("sort_order");
    if (filter.type) q = q.eq("story_type", filter.type);
    if (filter.placeSlug) q = q.eq("place.slug", filter.placeSlug);
    return q.returns<StoryRow[]>();
  }),
);

export const getStory = cache((slug: string) =>
  run<StoryRow | null>("Story", null, () =>
    db(["stories", "places"])?.from("stories").select(`*, ${PLACE}`).eq("slug", slug).maybeSingle<StoryRow>() ?? null,
  ),
);

export const getRadioCampaigns = cache(() =>
  run<RadioCampaignRow[]>("Radio campaigns", [], () =>
    db(["radio_campaigns", "places"])
      ?.from("radio_campaigns")
      .select(`*, ${PLACE}`)
      .order("start_date", { ascending: false, nullsFirst: false })
      .order("sort_order")
      .returns<RadioCampaignRow[]>() ?? null,
  ),
);

export const getRadioCampaign = cache((slug: string) =>
  run<RadioCampaignRow | null>("Radio campaign", null, () =>
    db(["radio_campaigns", "places"])?.from("radio_campaigns").select(`*, ${PLACE}`).eq("slug", slug).maybeSingle<RadioCampaignRow>() ?? null,
  ),
);

// StoryMaps ----------------------------------------------------------------------------

export const getStoryMaps = cache(() =>
  run<StoryMapRow[]>("StoryMaps", [], () =>
    db(["storymaps", "places"])?.from("storymaps").select(`*, ${PLACE}`).order("sort_order").returns<StoryMapRow[]>() ?? null,
  ),
);

export const getStoryMap = cache((slug: string) =>
  run<StoryMapRow | null>("StoryMap", null, () =>
    db(["storymaps", "places"])?.from("storymaps").select(`*, ${PLACE}`).eq("slug", slug).maybeSingle<StoryMapRow>() ?? null,
  ),
);

// Opportunities --------------------------------------------------------------------------

export const getOpportunities = cache(() =>
  run<OpportunityRow[]>("Opportunities", [], () =>
    db(["opportunities", "places"])
      ?.from("opportunities")
      .select(`*, ${PLACE}`)
      .order("closes_on", { ascending: true, nullsFirst: false })
      .order("sort_order")
      .returns<OpportunityRow[]>() ?? null,
  ),
);

export const getOpportunity = cache((slug: string) =>
  run<OpportunityRow | null>("Opportunity", null, () =>
    db(["opportunities", "places"])?.from("opportunities").select(`*, ${PLACE}`).eq("slug", slug).maybeSingle<OpportunityRow>() ?? null,
  ),
);

// Approach, about, support -----------------------------------------------------------------

export const getApproach = cache(() =>
  run<ApproachRow | null>("Approach", null, () => db(["approach"])?.from("approach").select("*").eq("id", 1).maybeSingle<ApproachRow>() ?? null),
);

export const getTeam = cache(() =>
  run<TeamMemberRow[]>("Team", [], () => db(["team_members"])?.from("team_members").select("*").order("sort_order").returns<TeamMemberRow[]>() ?? null),
);

export const getPartners = cache(() =>
  run<PartnerRow[]>("Partners", [], () => db(["partners"])?.from("partners").select("*").order("sort_order").returns<PartnerRow[]>() ?? null),
);

export const getSupportPrograms = cache(() =>
  run<SupportProgramRow[]>("Support programs", [], () =>
    db(["support_programs"])?.from("support_programs").select("*").order("sort_order").returns<SupportProgramRow[]>() ?? null,
  ),
);

export const getDonation = cache(async () => {
  const s = await run<Pick<SiteSettingsRow, "donations_enabled" | "donation_url"> | null>("Donation settings", null, () =>
    db(["site_settings"])?.from("site_settings").select("donations_enabled, donation_url").eq("id", 1).maybeSingle() ?? null,
  );
  return s?.donations_enabled && s.donation_url ? s.donation_url : null;
});

// Sitemap ----------------------------------------------------------------------------------

type SlugRow = { slug: string; updated_at: string };

export async function getSitemapEntries() {
  const tables: { table: TableName; prefix: string }[] = [
    { table: "places", prefix: "/places" },
    { table: "stories", prefix: "/stories" },
    { table: "radio_campaigns", prefix: "/stories/radio" },
    { table: "storymaps", prefix: "/explore" },
    { table: "opportunities", prefix: "/opportunities" },
  ];
  const lists = await Promise.all(
    tables.map(({ table, prefix }) =>
      run<SlugRow[]>(`Sitemap ${table}`, [], () => db([table])?.from(table).select("slug, updated_at").returns<SlugRow[]>() ?? null).then((rows) =>
        rows.map((r) => ({ path: `${prefix}/${r.slug}`, updatedAt: r.updated_at })),
      ),
    ),
  );
  return lists.flat();
}
