import { EarthGlobeIcon } from "@sanity/icons/EarthGlobe";
import { defineField, defineType } from "sanity";
import { placeField, seoField, slugField } from "../fields";

/** Only ArcGIS StoryMaps can be embedded; the site's security policy allows this origin alone. */
export const STORYMAPS_HOST = "storymaps.arcgis.com";

export const storyMap = defineType({
  name: "storyMap",
  title: "StoryMap",
  type: "document",
  icon: EarthGlobeIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "The name of the StoryMap as it should appear on the site.",
      validation: (rule) => rule.required(),
    }),
    slugField(),
    placeField({ required: true }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
      description: "One or two sentences on what the map explores. Shown before the map is opened.",
      validation: (rule) => rule.required().max(280),
    }),
    defineField({
      name: "posterImage",
      title: "Cover image",
      type: "accessibleImage",
      description:
        "Shown in place of the map until a visitor clicks \"Open map\". A screenshot of the map or a field photo works well.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "url",
      title: "StoryMap link",
      type: "url",
      description: `The public link to the StoryMap. In ArcGIS, open the published story and copy the address; it starts with https://${STORYMAPS_HOST}/stories/`,
      validation: (rule) =>
        rule
          .required()
          .uri({ scheme: ["https"] })
          .custom((url) => {
            if (!url) return true;
            try {
              return new URL(url).hostname === STORYMAPS_HOST || `The link must start with https://${STORYMAPS_HOST}/`;
            } catch {
              return "This does not look like a web address.";
            }
          }),
    }),
    seoField(),
  ],
  preview: {
    select: { title: "title", place: "place.name", media: "posterImage" },
    prepare: ({ title, place, media }) => ({ title, subtitle: place, media }),
  },
});
