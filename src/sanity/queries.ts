import { defineQuery } from "next-sanity";

// Typed GROQ queries. Result types are generated into ./types.ts by `npm run typegen`.
// Fetch them with sanityFetch() from ./client and tag with the document types each query reads.

/** Image fields every component needs: asset for the URL builder, crop and hotspot, alt, and a blur placeholder. */
const image = /* groq */ `{
  asset,
  crop,
  hotspot,
  alt,
  caption,
  credit,
  "lqip": asset->metadata.lqip,
  "dimensions": asset->metadata.dimensions{ width, height, aspectRatio }
}`;

const seo = /* groq */ `seo{ title, description, image${image} }`;

const placeSummary = /* groq */ `{
  _id,
  name,
  "slug": slug.current,
  country,
  status,
  summary,
  heroImage${image}
}`;

const storySummary = /* groq */ `{
  _id,
  title,
  "slug": slug.current,
  storyType,
  publishedAt,
  author,
  excerpt,
  heroImage${image},
  "place": place->{ name, "slug": slug.current }
}`;

const storyMapSummary = /* groq */ `{
  _id,
  title,
  "slug": slug.current,
  summary,
  url,
  posterImage${image},
  "place": place->{ name, "slug": slug.current }
}`;

const radioCampaignSummary = /* groq */ `{
  _id,
  title,
  "slug": slug.current,
  station,
  startDate,
  endDate,
  summary,
  heroImage${image},
  "place": place->{ name, "slug": slug.current },
  "episodeCount": count(episodes)
}`;

const opportunitySummary = /* groq */ `{
  _id,
  title,
  "slug": slug.current,
  opportunityType,
  opensAt,
  closesAt,
  summary,
  applyUrl,
  "place": place->{ name, "slug": slug.current }
}`;

const richText = /* groq */ `[]{
  ...,
  _type == "accessibleImage" => ${image}
}`;

// Singletons

export const siteSettingsQuery = defineQuery(`*[_id == "siteSettings"][0]{
  tagline,
  contactEmail,
  whatsappNumber,
  socials[]{ _key, platform, url },
  footerClosingLine,
  defaultOgImage${image},
  donationsEnabled,
  donationUrl
}`);

export const homePageQuery = defineQuery(`*[_id == "homePage"][0]{
  heroImage${image},
  heroHeadline,
  heroAccentWord,
  heroIntro,
  "featuredStoryMap": featuredStoryMap->${storyMapSummary},
  "featuredStories": featuredStories[]->${storySummary},
  ${seo}
}`);

export const approachPageQuery = defineQuery(`*[_id == "approachPage"][0]{
  intro,
  pillars[]{ _key, title, description, image${image} },
  "places": places[]->${placeSummary},
  ${seo}
}`);

// Places

export const placesQuery = defineQuery(`*[_type == "place" && defined(slug.current)] | order(name asc)${placeSummary}`);

export const placeBySlugQuery = defineQuery(`*[_type == "place" && slug.current == $slug][0]{
  ...${placeSummary},
  location,
  body${richText},
  ${seo},
  "stories": *[_type == "story" && references(^._id) && defined(slug.current)] | order(publishedAt desc)${storySummary},
  "storyMaps": *[_type == "storyMap" && references(^._id) && defined(slug.current)] | order(title asc)${storyMapSummary},
  "radioCampaigns": *[_type == "radioCampaign" && references(^._id) && defined(slug.current)] | order(startDate desc)${radioCampaignSummary}
}`);

// Stories. Pass $type and $place as null to skip that filter.

export const storiesQuery = defineQuery(`*[
  _type == "story" && defined(slug.current)
  && (!defined($type) || storyType == $type)
  && (!defined($place) || place->slug.current == $place)
] | order(publishedAt desc)${storySummary}`);

export const latestStoriesQuery = defineQuery(
  `*[_type == "story" && defined(slug.current)] | order(publishedAt desc)[0...$limit]${storySummary}`,
);

export const storyBySlugQuery = defineQuery(`*[_type == "story" && slug.current == $slug][0]{
  ...${storySummary},
  body${richText},
  videoUrl,
  gallery[]${image},
  ${seo}
}`);

// Radio campaigns

export const radioCampaignsQuery = defineQuery(
  `*[_type == "radioCampaign" && defined(slug.current)] | order(startDate desc)${radioCampaignSummary}`,
);

export const radioCampaignBySlugQuery = defineQuery(`*[_type == "radioCampaign" && slug.current == $slug][0]{
  ...${radioCampaignSummary},
  topics,
  gallery[]${image},
  episodes[]{
    _key,
    title,
    date,
    duration,
    summary,
    "audioUrl": coalesce(audioFile.asset->url, audioUrl),
    "audioMimeType": audioFile.asset->mimeType
  },
  ${seo}
}`);

// StoryMaps

export const storyMapsQuery = defineQuery(
  `*[_type == "storyMap" && defined(slug.current)] | order(title asc)${storyMapSummary}`,
);

export const storyMapBySlugQuery = defineQuery(`*[_type == "storyMap" && slug.current == $slug][0]{
  ...${storyMapSummary},
  ${seo}
}`);

// Opportunities. Status (open, closing soon, closed) is derived from the dates at render time.

export const opportunitiesQuery = defineQuery(
  `*[_type == "opportunity" && defined(slug.current)] | order(closesAt asc)${opportunitySummary}`,
);

export const opportunityBySlugQuery = defineQuery(`*[_type == "opportunity" && slug.current == $slug][0]{
  ...${opportunitySummary},
  eligibility,
  body${richText},
  ${seo}
}`);

// People, partners and programs

export const partnersQuery = defineQuery(`*[_type == "partner"] | order(name asc){
  _id,
  name,
  partnerType,
  website,
  logo${image}
}`);

export const teamMembersQuery = defineQuery(`*[_type == "teamMember"] | order(order asc, name asc){
  _id,
  name,
  role,
  bio,
  photo${image}
}`);

export const supportProgramsQuery = defineQuery(`*[_type == "supportProgram"] | order(order asc, title asc){
  _id,
  title,
  summary,
  funds,
  image${image}
}`);

// Slugs for generateStaticParams and the sitemap.

export const slugsByTypeQuery = defineQuery(
  `*[_type == $type && defined(slug.current)]{ "slug": slug.current, _updatedAt }`,
);
