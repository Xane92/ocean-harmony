import { UserIcon } from "@sanity/icons/User";
import { defineField, defineType } from "sanity";

export const teamMember = defineType({
  name: "teamMember",
  title: "Team Member",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description: "Full name, as the person would like it shown.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      description: 'Their role at Ocean Harmony, for example "Project Lead".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "photo",
      title: "Photo",
      type: "accessibleImage",
      description: "Optional. A portrait photo; square or upright photos work best. Only use photos the person has agreed to.",
    }),
    defineField({
      name: "bio",
      title: "Short bio",
      type: "text",
      rows: 4,
      description: "Two or three sentences about the person and their work.",
      validation: (rule) => rule.max(500),
    }),
    defineField({
      name: "order",
      title: "Position in list",
      type: "number",
      description: "Lower numbers appear first on the About page. For example, 1 for the project lead.",
      validation: (rule) => rule.integer().min(0),
    }),
  ],
  orderings: [{ title: "Position in list", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "name", subtitle: "role", media: "photo" },
  },
});
