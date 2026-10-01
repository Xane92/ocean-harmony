import { UsersIcon } from "@sanity/icons/Users";
import { defineField, defineType } from "sanity";

export const partnerTypes = [
  { title: "School", value: "school" },
  { title: "University", value: "university" },
  { title: "Funder", value: "funder" },
  { title: "NGO", value: "ngo" },
  { title: "Community", value: "community" },
  { title: "Government", value: "government" },
  { title: "Other", value: "other" },
];

export const partner = defineType({
  name: "partner",
  title: "Partner",
  type: "document",
  icon: UsersIcon,
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description: "The organisation's full name.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "partnerType",
      title: "Type",
      type: "string",
      description: "What kind of organisation this is.",
      options: { list: partnerTypes },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "accessibleImage",
      description: "Optional. A PNG or SVG with a transparent background works best. For alt text, write the organisation's name.",
    }),
    defineField({
      name: "website",
      title: "Website",
      type: "url",
      description: "Optional. The organisation's website, starting with https://",
      validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
    }),
  ],
  orderings: [{ title: "Name", name: "nameAsc", by: [{ field: "name", direction: "asc" }] }],
  preview: {
    select: { title: "name", type: "partnerType", media: "logo" },
    prepare: ({ title, type, media }) => ({
      title,
      subtitle: partnerTypes.find((t) => t.value === type)?.title,
      media,
    }),
  },
});
