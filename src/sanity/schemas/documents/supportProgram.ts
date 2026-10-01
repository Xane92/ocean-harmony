import { HeartIcon } from "@sanity/icons/Heart";
import { defineArrayMember, defineField, defineType } from "sanity";

export const supportProgram = defineType({
  name: "supportProgram",
  title: "Support Program",
  type: "document",
  icon: HeartIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "The name of the program people can support.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
      description: "Two or three sentences on what the program does and who it is for.",
      validation: (rule) => rule.required().max(400),
    }),
    defineField({
      name: "image",
      title: "Photo",
      type: "accessibleImage",
      description: "A real photo from this program.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "funds",
      title: "What support pays for",
      type: "array",
      description: 'Specific things support covers, one per line, for example "Printing ocean storybooks for a school".',
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "order",
      title: "Position in list",
      type: "number",
      description: "Lower numbers appear first on the Support page.",
      validation: (rule) => rule.integer().min(0),
    }),
  ],
  orderings: [{ title: "Position in list", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "summary", media: "image" } },
});
