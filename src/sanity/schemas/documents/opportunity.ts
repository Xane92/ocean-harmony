import { RocketIcon } from "@sanity/icons/Rocket";
import { defineField, defineType } from "sanity";
import { CLOSING_SOON_DAYS } from "../../../lib/constants";
import { placeField, seoField, slugField } from "../fields";

export const opportunityTypes = [
  { title: "Volunteer", value: "volunteer" },
  { title: "Fellowship", value: "fellowship" },
  { title: "Internship", value: "internship" },
  { title: "Program", value: "program" },
];

// Open, closing soon and closed are worked out from the dates on the website, so there is no status field.
export const opportunity = defineType({
  name: "opportunity",
  title: "Opportunity",
  type: "document",
  icon: RocketIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: 'The name of the role or program, for example "Youth Ocean Storyteller Fellowship".',
      validation: (rule) => rule.required(),
    }),
    slugField(),
    defineField({
      name: "opportunityType",
      title: "Type",
      type: "string",
      description: "Readers can filter opportunities by this type.",
      options: { list: opportunityTypes, layout: "radio", direction: "horizontal" },
      validation: (rule) => rule.required(),
    }),
    placeField({ description: "Optional. The place this opportunity is based in, if any." }),
    defineField({
      name: "opensAt",
      title: "Opens",
      type: "date",
      description: "The first day people can apply.",
      options: { dateFormat: "D MMMM YYYY" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "closesAt",
      title: "Closes",
      type: "date",
      description: `The last day people can apply. The site marks it "Closing soon" in the final ${CLOSING_SOON_DAYS} days and "Closed" after this date, automatically.`,
      options: { dateFormat: "D MMMM YYYY" },
      validation: (rule) =>
        rule.required().min(rule.valueOfField("opensAt")).error("The closing date must be after the opening date."),
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
      description: "One or two sentences shown in the list of opportunities and in search results.",
      validation: (rule) => rule.required().max(280),
    }),
    defineField({
      name: "eligibility",
      title: "Who can apply",
      type: "text",
      rows: 4,
      description: "Who this is open to, such as age, location or experience needed.",
    }),
    defineField({
      name: "body",
      title: "Full details",
      type: "richText",
      description: "Everything else applicants need to know: what they will do, support offered, how to apply.",
    }),
    defineField({
      name: "applyUrl",
      title: "Application link",
      type: "url",
      description: "Where people apply, such as a Google Form. An email link (mailto:name@example.org) also works.",
      validation: (rule) => rule.uri({ scheme: ["https", "mailto"] }),
    }),
    seoField(),
  ],
  orderings: [{ title: "Closing soonest", name: "closesAsc", by: [{ field: "closesAt", direction: "asc" }] }],
  preview: {
    select: { title: "title", type: "opportunityType", closes: "closesAt" },
    prepare: ({ title, type, closes }) => ({
      title,
      subtitle: [opportunityTypes.find((t) => t.value === type)?.title, closes && `Closes ${closes}`]
        .filter(Boolean)
        .join(" · "),
    }),
  },
});
