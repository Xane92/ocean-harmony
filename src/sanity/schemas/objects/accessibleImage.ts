import { ImageIcon } from "@sanity/icons/Image";
import { defineField, defineType } from "sanity";

// Every image on the site goes through this type so alt text is always required.
export const accessibleImage = defineType({
  name: "accessibleImage",
  title: "Image",
  type: "image",
  icon: ImageIcon,
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Alt text",
      type: "string",
      description:
        "Describe what the photo shows for people who cannot see it, in one sentence. For example: \"Children sorting shells on the beach at Winneba.\"",
      validation: (rule) => rule.required().error("Alt text is required so everyone can understand the image."),
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
      description: "Optional line shown under the image, such as who is pictured or where.",
    }),
    defineField({
      name: "credit",
      title: "Photo credit",
      type: "string",
      description: "Optional. The photographer's name, if they should be credited.",
    }),
  ],
});
