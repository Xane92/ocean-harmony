import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { defineField, defineType } from "sanity";
import { galleryField, heroImageField, placeField, seoField, slugField } from "../fields";

export const storyTypes = [
  { title: "Field story", value: "fieldStory" },
  { title: "Community voice", value: "communityVoice" },
  { title: "Photo essay", value: "photoEssay" },
  { title: "Video", value: "video" },
];

const VIDEO_URL = /^https:\/\/(www\.)?(youtube\.com|youtu\.be|vimeo\.com|player\.vimeo\.com)\//;

export const story = defineType({
  name: "story",
  title: "Story",
  type: "document",
  icon: DocumentTextIcon,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "media", title: "Photos and video" },
    { name: "seo", title: "Search and sharing" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      description: "The story's headline.",
      validation: (rule) => rule.required().max(120),
    }),
    defineField({ ...slugField(), group: "content" }),
    defineField({
      name: "storyType",
      title: "Type of story",
      type: "string",
      group: "content",
      description: "Readers can filter stories by this type.",
      options: { list: storyTypes, layout: "radio" },
      initialValue: "fieldStory",
      validation: (rule) => rule.required(),
    }),
    defineField({ ...placeField({ required: true }), group: "content" }),
    defineField({
      name: "publishedAt",
      title: "Date",
      type: "date",
      group: "content",
      description: "The date shown on the story. Stories are listed newest first.",
      options: { dateFormat: "D MMMM YYYY" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "string",
      group: "content",
      description: "Who wrote or told this story. Leave empty if it should not be credited.",
    }),
    defineField({
      name: "excerpt",
      title: "Short summary",
      type: "text",
      rows: 3,
      group: "content",
      description: "One or two sentences shown in story lists and in search results.",
      validation: (rule) => rule.required().max(280),
    }),
    defineField({
      name: "body",
      title: "Story text",
      type: "richTextWithImages",
      group: "content",
      description: "The full story. Use the image button in the toolbar to place photos between paragraphs.",
    }),
    defineField({ ...heroImageField(), group: "media" }),
    defineField({
      name: "videoUrl",
      title: "Video link",
      type: "url",
      group: "media",
      description:
        "A YouTube or Vimeo link. Copy it from the address bar of the video page. Required when the story type is Video.",
      validation: (rule) =>
        rule.uri({ scheme: ["https"] }).custom((url, context) => {
          if (!url) return context.document?.storyType === "video" ? "Add the video link for a video story." : true;
          return VIDEO_URL.test(url) || "Use a YouTube or Vimeo link.";
        }),
    }),
    defineField({ ...galleryField(), group: "media" }),
    defineField({ ...seoField(), group: "seo" }),
  ],
  orderings: [{ title: "Newest first", name: "dateDesc", by: [{ field: "publishedAt", direction: "desc" }] }],
  preview: {
    select: { title: "title", type: "storyType", place: "place.name", date: "publishedAt", media: "heroImage" },
    prepare: ({ title, type, place, date, media }) => ({
      title,
      subtitle: [storyTypes.find((t) => t.value === type)?.title, place, date].filter(Boolean).join(" · "),
      media,
    }),
  },
});
