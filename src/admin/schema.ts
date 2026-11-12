// The admin is config-driven: one field registry (src/admin/fields) and one config object per
// content type here. Configs are plain data so they can be passed to client components.
// Keep column names in step with supabase/migrations/0001_init.sql.

export type Option = { value: string; label: string };

type Base = {
  name: string;
  label: string;
  /** Plain-language help for a non-technical editor. */
  help?: string;
  required?: boolean;
};

export type Field =
  | (Base & { kind: "text"; multiline?: boolean; maxLength?: number; inputType?: "text" | "email" | "tel" })
  | (Base & { kind: "slug"; from: string })
  | (Base & { kind: "url"; pattern?: string; patternHint?: string })
  | (Base & { kind: "select"; options: Option[] })
  | (Base & { kind: "date" })
  | (Base & { kind: "number"; min?: number; max?: number; step?: number })
  | (Base & { kind: "boolean" })
  | (Base & { kind: "image" })
  | (Base & { kind: "gallery" })
  | (Base & { kind: "audio" })
  | (Base & { kind: "richText" })
  | (Base & { kind: "reference"; table: TableName; labelColumn: string })
  | (Base & { kind: "references"; table: TableName; labelColumn: string; max?: number })
  | (Base & { kind: "tags" })
  | (Base & { kind: "list"; itemLabel: string; titleField: string; fields: Field[]; max?: number })
  | (Base & { kind: "group"; fields: Field[] });

export type TableName =
  | "site_settings"
  | "home"
  | "approach"
  | "places"
  | "stories"
  | "radio_campaigns"
  | "storymaps"
  | "opportunities"
  | "partners"
  | "team_members"
  | "support_programs";

export type ContentType = {
  /** URL segment in /admin. */
  key: string;
  table: TableName;
  label: string;
  singular: string;
  description: string;
  /** Single-row tables (id = 1): no list, no status, no create. */
  singleton?: boolean;
  /** Column shown as the row title in lists. */
  titleField: string;
  /** Extra column shown in lists, if any. */
  metaField?: string;
  fields: Field[];
};

// Shared field definitions -------------------------------------------------------------

const slugPattern = "^[a-z0-9]+(-[a-z0-9]+)*$";

const seo: Field = {
  kind: "group",
  name: "seo",
  label: "Search and sharing",
  help: "Optional. What Google and link previews show. Leave empty to use the title, summary and main image.",
  fields: [
    { kind: "text", name: "title", label: "Search title", maxLength: 70 },
    { kind: "text", name: "description", label: "Search description", multiline: true, maxLength: 160 },
    { kind: "image", name: "image", label: "Sharing image", help: "Shown when the page is shared on WhatsApp or social media." },
  ],
};

const place: Field = {
  kind: "reference",
  name: "place_id",
  label: "Place",
  table: "places",
  labelColumn: "name",
  help: "Where this happened. Links it to that place's page.",
};

const slug = (from: string): Field => ({
  kind: "slug",
  name: "slug",
  label: "Web address",
  from,
  required: true,
  help: "The last part of the page address. Lowercase letters, numbers and hyphens. Changing it breaks old links.",
});

const image = (name: string, label: string, help?: string): Field => ({ kind: "image", name, label, help });

const longText = (name: string, label: string, help?: string, required = false): Field => ({
  kind: "text",
  name,
  label,
  help,
  required,
  multiline: true,
});

// Content types ------------------------------------------------------------------------

export const contentTypes: ContentType[] = [
  {
    key: "home",
    table: "home",
    label: "Home page",
    singular: "Home page",
    description: "The hero at the top of the home page and what it features.",
    singleton: true,
    titleField: "hero_headline",
    fields: [
      image("hero_image", "Hero photo", "The large photo at the top. Landscape works best."),
      { kind: "text", name: "hero_headline", label: "Headline", maxLength: 80 },
      {
        kind: "text",
        name: "hero_accent_word",
        label: "Accent word",
        help: "One word from the headline, set in italic serif. Must appear in the headline exactly.",
      },
      longText("hero_intro", "Intro line", "One or two sentences under the headline."),
      {
        kind: "reference",
        name: "featured_storymap_id",
        label: "Featured StoryMap",
        table: "storymaps",
        labelColumn: "title",
      },
      {
        kind: "references",
        name: "featured_story_ids",
        label: "Featured stories",
        table: "stories",
        labelColumn: "title",
        max: 3,
        help: "Up to three. Only published stories appear on the site.",
      },
      seo,
    ],
  },
  {
    key: "approach",
    table: "approach",
    label: "The Approach",
    singular: "Approach page",
    description: "The methodology page and its pillars.",
    singleton: true,
    titleField: "intro",
    fields: [
      longText("intro", "Introduction", "How the Ocean Harmony approach works, in a few sentences."),
      {
        kind: "list",
        name: "pillars",
        label: "Pillars",
        itemLabel: "pillar",
        titleField: "title",
        fields: [
          { kind: "text", name: "title", label: "Title", required: true },
          longText("description", "Description"),
          image("image", "Photo"),
        ],
      },
      seo,
    ],
  },
  {
    key: "places",
    table: "places",
    label: "Places",
    singular: "Place",
    description: "Every place the approach has worked or is heading to.",
    titleField: "name",
    metaField: "country",
    fields: [
      { kind: "text", name: "name", label: "Name", required: true, help: "For example: Winneba." },
      slug("name"),
      { kind: "text", name: "country", label: "Country" },
      {
        kind: "select",
        name: "place_status",
        label: "Where things stand",
        required: true,
        options: [
          { value: "active", label: "Active" },
          { value: "upcoming", label: "Upcoming" },
          { value: "past", label: "Past" },
        ],
      },
      longText("summary", "Summary", "One or two sentences for lists and previews."),
      image("hero_image", "Main photo"),
      { kind: "number", name: "latitude", label: "Latitude", min: -90, max: 90, step: 0.000001, help: "Optional, for maps." },
      { kind: "number", name: "longitude", label: "Longitude", min: -180, max: 180, step: 0.000001 },
      { kind: "richText", name: "body", label: "Full story of this place" },
      seo,
    ],
  },
  {
    key: "stories",
    table: "stories",
    label: "Stories",
    singular: "Story",
    description: "Field stories, community voices, photo essays and video.",
    titleField: "title",
    metaField: "story_type",
    fields: [
      { kind: "text", name: "title", label: "Title", required: true },
      slug("title"),
      {
        kind: "select",
        name: "story_type",
        label: "Kind of story",
        required: true,
        options: [
          { value: "field_story", label: "Field story" },
          { value: "community_voice", label: "Community voice" },
          { value: "photo_essay", label: "Photo essay" },
          { value: "video", label: "Video" },
        ],
      },
      place,
      { kind: "date", name: "published_on", label: "Date" },
      { kind: "text", name: "author", label: "Written or told by" },
      longText("excerpt", "Short summary", "Shown in lists and link previews."),
      image("hero_image", "Main photo"),
      { kind: "richText", name: "body", label: "Story" },
      {
        kind: "url",
        name: "video_url",
        label: "Video link",
        pattern: "^https://(www\\.)?(youtube\\.com|youtu\\.be|vimeo\\.com)/",
        patternHint: "A YouTube or Vimeo link starting with https://",
      },
      { kind: "gallery", name: "gallery", label: "Photo gallery" },
      seo,
    ],
  },
  {
    key: "radio",
    table: "radio_campaigns",
    label: "Radio campaigns",
    singular: "Radio campaign",
    description: "Radio work: photos, recordings and what was talked about.",
    titleField: "title",
    metaField: "station",
    fields: [
      { kind: "text", name: "title", label: "Campaign name", required: true },
      slug("title"),
      { kind: "text", name: "station", label: "Radio station" },
      place,
      { kind: "date", name: "start_date", label: "Started" },
      { kind: "date", name: "end_date", label: "Ended" },
      longText("summary", "Summary of the conversations"),
      image("hero_image", "Main photo"),
      { kind: "tags", name: "topics", label: "Topics discussed", help: "Press Enter after each topic." },
      {
        kind: "list",
        name: "episodes",
        label: "Episodes",
        itemLabel: "episode",
        titleField: "title",
        fields: [
          { kind: "text", name: "title", label: "Episode title", required: true },
          { kind: "date", name: "date", label: "Aired on" },
          {
            kind: "audio",
            name: "audio_path",
            label: "Recording",
            help: "Upload up to 15MB, or use the link field below for longer recordings.",
          },
          {
            kind: "url",
            name: "audio_url",
            label: "Or a link to the recording",
            help: "SoundCloud, YouTube or any public audio link.",
          },
          { kind: "text", name: "duration", label: "Length", help: "For example: 24 min." },
          longText("summary", "What was discussed"),
        ],
      },
      { kind: "gallery", name: "gallery", label: "Photo gallery" },
      seo,
    ],
  },
  {
    key: "storymaps",
    table: "storymaps",
    label: "StoryMaps",
    singular: "StoryMap",
    description: "ArcGIS StoryMaps embedded on the Explore pages.",
    titleField: "title",
    fields: [
      { kind: "text", name: "title", label: "Title", required: true },
      slug("title"),
      place,
      longText("summary", "Summary", "What this StoryMap shows, in a sentence or two."),
      image("poster_image", "Cover photo", "Shown before the map loads."),
      {
        kind: "url",
        name: "url",
        label: "StoryMap link",
        pattern: "^https://storymaps\\.arcgis\\.com/",
        patternHint: "A public link starting with https://storymaps.arcgis.com/",
        help: "Open the StoryMap, check it is shared publicly, then copy the address from the browser.",
      },
      seo,
    ],
  },
  {
    key: "opportunities",
    table: "opportunities",
    label: "Opportunities",
    singular: "Opportunity",
    description: "Volunteer roles, fellowships, internships and programs.",
    titleField: "title",
    metaField: "opportunity_type",
    fields: [
      { kind: "text", name: "title", label: "Title", required: true },
      slug("title"),
      {
        kind: "select",
        name: "opportunity_type",
        label: "Type",
        required: true,
        options: [
          { value: "volunteer", label: "Volunteer" },
          { value: "fellowship", label: "Fellowship" },
          { value: "internship", label: "Internship" },
          { value: "program", label: "Program" },
        ],
      },
      place,
      { kind: "date", name: "opens_on", label: "Opens", help: "Open, closing soon and closed are worked out from these dates." },
      { kind: "date", name: "closes_on", label: "Closes" },
      longText("summary", "Summary"),
      longText("eligibility", "Who can apply"),
      { kind: "url", name: "apply_url", label: "Application link", help: "A form link, for example Google Forms." },
      { kind: "richText", name: "body", label: "Full details" },
      seo,
    ],
  },
  {
    key: "support",
    table: "support_programs",
    label: "Support programs",
    singular: "Support program",
    description: "Programs people and organisations can back.",
    titleField: "title",
    fields: [
      { kind: "text", name: "title", label: "Title", required: true },
      slug("title"),
      longText("summary", "Summary"),
      longText("funds", "What support pays for"),
      image("image", "Photo"),
    ],
  },
  {
    key: "partners",
    table: "partners",
    label: "Partners",
    singular: "Partner",
    description: "Organisations you work with.",
    titleField: "name",
    metaField: "partner_type",
    fields: [
      { kind: "text", name: "name", label: "Name", required: true },
      {
        kind: "select",
        name: "partner_type",
        label: "Type",
        required: true,
        options: [
          { value: "school", label: "School" },
          { value: "university", label: "University" },
          { value: "funder", label: "Funder" },
          { value: "ngo", label: "NGO" },
          { value: "community", label: "Community" },
          { value: "government", label: "Government" },
          { value: "other", label: "Other" },
        ],
      },
      { kind: "url", name: "website", label: "Website" },
      image("logo", "Logo", "PNG or WebP with a transparent background works best."),
    ],
  },
  {
    key: "team",
    table: "team_members",
    label: "Team",
    singular: "Team member",
    description: "People shown on the About page.",
    titleField: "name",
    metaField: "role",
    fields: [
      { kind: "text", name: "name", label: "Name", required: true },
      { kind: "text", name: "role", label: "Role" },
      image("photo", "Photo"),
      longText("bio", "Short bio"),
    ],
  },
  {
    key: "settings",
    table: "site_settings",
    label: "Site settings",
    singular: "Site settings",
    description: "Contact details, social links and the footer line.",
    singleton: true,
    titleField: "tagline",
    fields: [
      { kind: "text", name: "tagline", label: "Tagline" },
      { kind: "text", name: "contact_email", label: "Contact email", inputType: "email" },
      {
        kind: "text",
        name: "whatsapp_number",
        label: "WhatsApp number",
        inputType: "tel",
        help: "International format with country code, for example 233 50 000 0000.",
      },
      {
        kind: "list",
        name: "socials",
        label: "Social links",
        itemLabel: "link",
        titleField: "platform",
        fields: [
          {
            kind: "select",
            name: "platform",
            label: "Platform",
            required: true,
            options: [
              { value: "Instagram", label: "Instagram" },
              { value: "Facebook", label: "Facebook" },
              { value: "X", label: "X" },
              { value: "LinkedIn", label: "LinkedIn" },
              { value: "YouTube", label: "YouTube" },
              { value: "TikTok", label: "TikTok" },
            ],
          },
          { kind: "url", name: "url", label: "Link", required: true },
        ],
      },
      { kind: "text", name: "footer_closing_line", label: "Footer closing line", maxLength: 60 },
      { kind: "text", name: "footer_accent_word", label: "Footer accent word", help: "One word from the closing line." },
      { kind: "boolean", name: "donations_enabled", label: "Show online donations", help: "Leave off until a donation page exists." },
      { kind: "url", name: "donation_url", label: "Donation link" },
      image("default_og_image", "Default sharing image", "Used when a page has no image of its own."),
    ],
  },
];

export function getContentType(key: string): ContentType | undefined {
  return contentTypes.find((t) => t.key === key);
}

export const SLUG_PATTERN = slugPattern;

/** Readable label for a select value, for list views. */
export function optionLabel(type: ContentType, field: string, value: unknown): string {
  const def = type.fields.find((f) => f.name === field);
  if (def?.kind === "select") return def.options.find((o) => o.value === value)?.label ?? String(value ?? "");
  return value == null ? "" : String(value);
}
