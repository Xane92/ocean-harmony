import { PinIcon } from "@sanity/icons/Pin";
import { defineField, defineType } from "sanity";
import { heroImageField, seoField, slugField } from "../fields";

export const placeStatuses = [
  { title: "Active", value: "active" },
  { title: "Upcoming", value: "upcoming" },
  { title: "Past", value: "past" },
];

export const place = defineType({
  name: "place",
  title: "Place",
  type: "document",
  icon: PinIcon,
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description: 'The name of the town or area, for example "Winneba".',
      validation: (rule) => rule.required(),
    }),
    slugField("name"),
    defineField({
      name: "country",
      title: "Country",
      type: "string",
      description: 'For example "Ghana".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      description: "Active: work is happening now. Upcoming: planned but not started. Past: work has finished.",
      options: { list: placeStatuses, layout: "radio", direction: "horizontal" },
      initialValue: "active",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
      description: "One or two sentences about Ocean Harmony's work here. Shown in lists of places and in search results.",
      validation: (rule) => rule.required().max(280),
    }),
    heroImageField("A photo of this place, shown at the top of its page and in lists of places."),
    defineField({
      name: "location",
      title: "Map location",
      type: "geopoint",
      description:
        "Where this place is on the map. Find it on Google Maps, right-click the spot, and copy the two numbers: the first is latitude, the second is longitude.",
    }),
    defineField({
      name: "body",
      title: "Page text",
      type: "richText",
      description: "The main text on this place's page: the setting, the people and what has happened here.",
    }),
    seoField(),
  ],
  orderings: [{ title: "Name", name: "nameAsc", by: [{ field: "name", direction: "asc" }] }],
  preview: {
    select: { title: "name", country: "country", status: "status", media: "heroImage" },
    prepare: ({ title, country, status, media }) => ({
      title,
      subtitle: [country, status].filter(Boolean).join(" · "),
      media,
    }),
  },
});
