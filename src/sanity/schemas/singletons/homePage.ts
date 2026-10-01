import { HomeIcon } from "@sanity/icons/Home";
import { defineArrayMember, defineField, defineType } from "sanity";
import { seoField } from "../fields";

export const homePage = defineType({
  name: "homePage",
  title: "Home",
  type: "document",
  icon: HomeIcon,
  groups: [
    { name: "hero", title: "Top of page", default: true },
    { name: "featured", title: "Featured" },
    { name: "seo", title: "Search and sharing" },
  ],
  fields: [
    defineField({
      name: "heroImage",
      title: "Main photo",
      type: "accessibleImage",
      group: "hero",
      description: "A real field photograph that fills the top of the home page. Landscape photos work best.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroHeadline",
      title: "Headline",
      type: "string",
      group: "hero",
      description: "The big line over the main photo. Keep it short, about eight words.",
      validation: (rule) => rule.required().max(90),
    }),
    defineField({
      name: "heroAccentWord",
      title: "Accent word",
      type: "string",
      group: "hero",
      description:
        "One word from the headline to show in the italic accent style. Type it exactly as it appears in the headline.",
      validation: (rule) =>
        rule.custom((word, context) => {
          if (!word) return true;
          if (/\s/.test(word.trim())) return "Choose a single word.";
          const headline = (context.document?.heroHeadline as string | undefined) ?? "";
          return headline.includes(word.trim()) || "This word must appear in the headline, spelled the same way.";
        }),
    }),
    defineField({
      name: "heroIntro",
      title: "Introduction",
      type: "text",
      rows: 3,
      group: "hero",
      description: "One or two sentences under the headline saying what Ocean Harmony does.",
      validation: (rule) => rule.max(280),
    }),
    defineField({
      name: "featuredStoryMap",
      title: "Featured StoryMap",
      type: "reference",
      group: "featured",
      to: [{ type: "storyMap" }],
      description: "The interactive map to highlight on the home page.",
    }),
    defineField({
      name: "featuredStories",
      title: "Featured stories",
      type: "array",
      group: "featured",
      description: "Up to three stories to highlight. Leave empty to show the latest stories instead.",
      of: [defineArrayMember({ type: "reference", to: [{ type: "story" }] })],
      validation: (rule) => rule.max(3).unique(),
    }),
    defineField({ ...seoField(), group: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Home" }) },
});
