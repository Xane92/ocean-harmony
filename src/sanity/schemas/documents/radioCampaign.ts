import { MicrophoneIcon } from "@sanity/icons/Microphone";
import { defineArrayMember, defineField, defineType } from "sanity";
import { galleryField, heroImageField, placeField, seoField, slugField } from "../fields";

const episode = defineArrayMember({
  name: "episode",
  title: "Episode",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Episode title",
      type: "string",
      description: "What this episode was about, in a few words.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "date",
      title: "Broadcast date",
      type: "date",
      description: "The day this episode went on air.",
      options: { dateFormat: "D MMMM YYYY" },
    }),
    defineField({
      name: "audioFile",
      title: "Audio file",
      type: "file",
      description:
        "Upload the recording (MP3 is best). Use this or the audio link below, not both. Smaller files load faster for listeners on mobile data.",
      options: { accept: "audio/*" },
    }),
    defineField({
      name: "audioUrl",
      title: "Audio link",
      type: "url",
      description: "If the recording is hosted elsewhere (for example SoundCloud), paste its link here instead of uploading.",
      validation: (rule) => rule.uri({ scheme: ["https"] }),
    }),
    defineField({
      name: "duration",
      title: "Length",
      type: "string",
      description: 'How long the episode is, as minutes and seconds, for example "24:30". Use hours if needed: "1:05:00".',
      validation: (rule) =>
        rule.regex(/^(\d{1,2}:)?\d{1,2}:\d{2}$/, { name: "time" }).error('Write it like "24:30" or "1:05:00".'),
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
      description: "A few sentences on what was discussed and who took part.",
    }),
  ],
  validation: (rule) =>
    rule.custom((value: { audioFile?: { asset?: unknown }; audioUrl?: string } | undefined) => {
      const hasFile = Boolean(value?.audioFile?.asset);
      const hasUrl = Boolean(value?.audioUrl);
      if (hasFile && hasUrl) return "Use either an uploaded file or a link, not both.";
      if (!hasFile && !hasUrl) return "Upload the audio file or paste an audio link.";
      return true;
    }),
  preview: {
    select: { title: "title", date: "date", duration: "duration" },
    prepare: ({ title, date, duration }) => ({ title, subtitle: [date, duration].filter(Boolean).join(" · ") }),
  },
});

export const radioCampaign = defineType({
  name: "radioCampaign",
  title: "Radio Campaign",
  type: "document",
  icon: MicrophoneIcon,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "episodes", title: "Episodes" },
    { name: "media", title: "Photos" },
    { name: "seo", title: "Search and sharing" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      description: "The name of the campaign or radio series.",
      validation: (rule) => rule.required(),
    }),
    defineField({ ...slugField(), group: "content" }),
    defineField({
      name: "station",
      title: "Radio station",
      type: "string",
      group: "content",
      description: "The station that broadcast it, with its frequency if you like.",
      validation: (rule) => rule.required(),
    }),
    defineField({ ...placeField({ required: true }), group: "content" }),
    defineField({
      name: "startDate",
      title: "Start date",
      type: "date",
      group: "content",
      description: "When the first episode aired.",
      options: { dateFormat: "D MMMM YYYY" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "endDate",
      title: "End date",
      type: "date",
      group: "content",
      description: "When the last episode aired. Leave empty if the campaign is still running.",
      options: { dateFormat: "D MMMM YYYY" },
      validation: (rule) =>
        rule.min(rule.valueOfField("startDate")).error("The end date cannot be before the start date."),
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 4,
      group: "content",
      description: "What the campaign set out to do and what the conversations covered. Shown near the top of the page.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "topics",
      title: "Topics discussed",
      type: "array",
      group: "content",
      description: "Short topics covered on air, such as \"plastic on the beach\". Type one and press Enter to add it.",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
    }),
    defineField({
      name: "episodes",
      title: "Episodes",
      type: "array",
      group: "episodes",
      description: "Each broadcast, in the order it aired. Drag to change the order.",
      of: [episode],
    }),
    defineField({ ...heroImageField(), group: "media" }),
    defineField({ ...galleryField(), group: "media" }),
    defineField({ ...seoField(), group: "seo" }),
  ],
  orderings: [{ title: "Newest first", name: "startDesc", by: [{ field: "startDate", direction: "desc" }] }],
  preview: {
    select: { title: "title", station: "station", place: "place.name", media: "heroImage" },
    prepare: ({ title, station, place, media }) => ({
      title,
      subtitle: [station, place].filter(Boolean).join(" · "),
      media,
    }),
  },
});
