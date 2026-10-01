import { defineField, defineType } from "sanity";

export const seo = defineType({
  name: "seo",
  title: "Search and sharing",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Search title",
      type: "string",
      description: "The title shown in Google results and browser tabs. Leave empty to use the page title.",
      validation: (rule) => rule.max(60).warning("Search engines cut titles longer than about 60 characters."),
    }),
    defineField({
      name: "description",
      title: "Search description",
      type: "text",
      rows: 3,
      description: "One or two sentences shown under the title in Google results. Leave empty to use the summary.",
      validation: (rule) => rule.max(160).warning("Search engines cut descriptions longer than about 160 characters."),
    }),
    defineField({
      name: "image",
      title: "Sharing image",
      type: "accessibleImage",
      description: "The picture shown when this page is shared on WhatsApp, Facebook and similar. Leave empty to use the main image.",
    }),
  ],
});
