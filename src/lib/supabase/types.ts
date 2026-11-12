// Hand-written row shapes for the tables in supabase/migrations. Keep in step with the SQL.

export type Status = "draft" | "published" | "archived";

/** Image stored as jsonb. `path` is the object path inside the public "media" bucket. */
export type StoredImage = {
  path: string;
  alt: string;
  width?: number;
  height?: number;
  caption?: string;
  credit?: string;
};

/** Tiptap JSON node. Rendered through a whitelist in src/components/rich-text. */
export type RichTextNode = {
  type: string;
  attrs?: Record<string, unknown>;
  content?: RichTextNode[];
  marks?: { type: string; attrs?: Record<string, unknown> }[];
  text?: string;
};

export type Seo = { title?: string; description?: string; image?: StoredImage | null };

type Collection = { id: string; status: Status; sort_order: number; created_at: string; updated_at: string };

/** Reference to a place, joined as `place:places(name, slug)`. */
export type PlaceRef = { name: string; slug: string } | null;

export type SiteSettingsRow = {
  id: 1;
  tagline: string | null;
  contact_email: string | null;
  whatsapp_number: string | null;
  socials: { platform: string; url: string }[];
  footer_closing_line: string | null;
  footer_accent_word: string | null;
  donations_enabled: boolean;
  donation_url: string | null;
  default_og_image: StoredImage | null;
};

export type HomeRow = {
  id: 1;
  hero_image: StoredImage | null;
  hero_headline: string | null;
  hero_accent_word: string | null;
  hero_intro: string | null;
  featured_storymap_id: string | null;
  featured_story_ids: string[];
  seo: Seo | null;
};

export type Pillar = { title: string; description?: string | null; image?: StoredImage | null };

export type ApproachRow = {
  id: 1;
  intro: string | null;
  pillars: Pillar[];
  seo: Seo | null;
};

export type PlaceRow = Collection & {
  slug: string;
  name: string;
  country: string | null;
  summary: string | null;
  hero_image: StoredImage | null;
  latitude: number | null;
  longitude: number | null;
  place_status: "active" | "upcoming" | "past";
  body: RichTextNode | null;
  seo: Seo | null;
};

export type StoryType = "field_story" | "community_voice" | "photo_essay" | "video";

export type StoryRow = Collection & {
  slug: string;
  title: string;
  story_type: StoryType;
  place_id: string | null;
  place?: PlaceRef;
  published_on: string | null;
  author: string | null;
  excerpt: string | null;
  hero_image: StoredImage | null;
  body: RichTextNode | null;
  video_url: string | null;
  gallery: StoredImage[];
  seo: Seo | null;
};

export type Episode = {
  title: string;
  date?: string | null;
  audio_path?: string | null;
  audio_url?: string | null;
  duration?: string | null;
  summary?: string | null;
};

export type RadioCampaignRow = Collection & {
  slug: string;
  title: string;
  station: string | null;
  place_id: string | null;
  place?: PlaceRef;
  start_date: string | null;
  end_date: string | null;
  summary: string | null;
  hero_image: StoredImage | null;
  gallery: StoredImage[];
  topics: string[];
  episodes: Episode[];
  seo: Seo | null;
};

export type StoryMapRow = Collection & {
  slug: string;
  title: string;
  place_id: string | null;
  place?: PlaceRef;
  summary: string | null;
  poster_image: StoredImage | null;
  url: string | null;
  seo: Seo | null;
};

export type OpportunityType = "volunteer" | "fellowship" | "internship" | "program";

export type OpportunityRow = Collection & {
  slug: string;
  title: string;
  opportunity_type: OpportunityType;
  place_id: string | null;
  place?: PlaceRef;
  opens_on: string | null;
  closes_on: string | null;
  summary: string | null;
  eligibility: string | null;
  body: RichTextNode | null;
  apply_url: string | null;
  seo: Seo | null;
};

export type PartnerRow = Collection & {
  name: string;
  logo: StoredImage | null;
  website: string | null;
  partner_type: "school" | "university" | "funder" | "ngo" | "community" | "government" | "other";
};

export type TeamMemberRow = Collection & {
  name: string;
  role: string | null;
  photo: StoredImage | null;
  bio: string | null;
};

export type SupportProgramRow = Collection & {
  slug: string;
  title: string;
  summary: string | null;
  image: StoredImage | null;
  funds: string | null;
};
