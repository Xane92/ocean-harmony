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

export type ApproachRow = {
  id: 1;
  intro: string | null;
  pillars: { title: string; description?: string; image?: StoredImage | null }[];
  seo: Seo | null;
};

export type PlaceRow = Collection & {
  slug: string;
  name: string;
  country: string | null;
  summary: string | null;
  hero_image: StoredImage | null;
  place_status: "active" | "upcoming" | "past";
  body: RichTextNode | null;
};

export type StoryRow = Collection & {
  slug: string;
  title: string;
  story_type: "field_story" | "community_voice" | "photo_essay" | "video";
  place_id: string | null;
  published_on: string | null;
  excerpt: string | null;
  hero_image: StoredImage | null;
};

export type StoryMapRow = Collection & {
  slug: string;
  title: string;
  summary: string | null;
  poster_image: StoredImage | null;
  url: string | null;
};

export type OpportunityRow = Collection & {
  slug: string;
  title: string;
  opportunity_type: "volunteer" | "fellowship" | "internship" | "program";
  opens_on: string | null;
  closes_on: string | null;
  apply_url: string | null;
};
