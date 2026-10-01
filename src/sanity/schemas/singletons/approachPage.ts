import { BulbOutlineIcon } from "@sanity/icons/BulbOutline";
import { defineArrayMember, defineField, defineType } from "sanity";
import { seoField } from "../fields";

export const approachPage = defineType({
  name: "approachPage",
  title: "Approach",
  type: "document",
  icon: BulbOutlineIcon,
  fields: [
    defineField({
      name: "intro",
      title: "Introduction",
      type: "text",
      rows: 4,
      description: "A short opening paragraph explaining the Ocean Harmony approach in plain words.",
    }),
    defineField({
      name: "pillars",
      title: "Pillars",
      type: "array",
      description:
        "The parts of the approach, such as ocean literacy or storytelling. Drag to change the order; they are numbered on the page in this order.",
      of: [
        defineArrayMember({
          name: "pillar",
          title: "Pillar",
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              description: 'A few words, for example "Play-based learning".',
              validation: (rule) => rule.required().max(60),
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 4,
              description: "Two to four sentences on what this looks like in practice.",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "image",
              title: "Photo",
              type: "accessibleImage",
              description: "Optional. A photo of this pillar in action.",
            }),
          ],
          preview: { select: { title: "title", subtitle: "description", media: "image" } },
        }),
      ],
    }),
    defineField({
      name: "places",
      title: "Where the approach has travelled",
      type: "array",
      description: "The places using the approach. Drag to set the order they appear in.",
      of: [defineArrayMember({ type: "reference", to: [{ type: "place" }] })],
      validation: (rule) => rule.unique(),
    }),
    seoField(),
  ],
  preview: { prepare: () => ({ title: "Approach" }) },
});
