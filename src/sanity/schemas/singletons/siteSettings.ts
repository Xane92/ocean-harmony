import { CogIcon } from "@sanity/icons/Cog";
import { defineArrayMember, defineField, defineType } from "sanity";

const platforms = [
  { title: "Instagram", value: "instagram" },
  { title: "Facebook", value: "facebook" },
  { title: "YouTube", value: "youtube" },
  { title: "LinkedIn", value: "linkedin" },
  { title: "TikTok", value: "tiktok" },
  { title: "X (Twitter)", value: "x" },
  { title: "Other", value: "other" },
];

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  icon: CogIcon,
  fields: [
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      description:
        "One short line describing Ocean Harmony. Used in search results when a page has no description of its own.",
      validation: (rule) => rule.max(160),
    }),
    defineField({
      name: "contactEmail",
      title: "Contact email",
      type: "string",
      description: "The email address people see on the Contact page and in the footer.",
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: "whatsappNumber",
      title: "WhatsApp number",
      type: "string",
      description:
        "The number for the WhatsApp button, in international format with no spaces or plus sign. For Ghana, start with 233, for example 233201234567.",
      validation: (rule) =>
        rule.regex(/^\d{8,15}$/, { name: "digits only" }).error("Use digits only, starting with the country code."),
    }),
    defineField({
      name: "socials",
      title: "Social media",
      type: "array",
      description: "Links shown in the footer. Drag to change the order.",
      of: [
        defineArrayMember({
          name: "socialLink",
          title: "Social link",
          type: "object",
          fields: [
            defineField({
              name: "platform",
              title: "Platform",
              type: "string",
              description: "Which site this link goes to.",
              options: { list: platforms },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "url",
              title: "Link",
              type: "url",
              description: "The full address of the profile page, starting with https://",
              validation: (rule) => rule.required().uri({ scheme: ["https"] }),
            }),
          ],
          preview: { select: { title: "platform", subtitle: "url" } },
        }),
      ],
    }),
    defineField({
      name: "footerClosingLine",
      title: "Footer closing line",
      type: "string",
      description: "The large line at the top of the footer on every page. Keep it short, about six words.",
      validation: (rule) => rule.max(80),
    }),
    defineField({
      name: "defaultOgImage",
      title: "Default sharing image",
      type: "accessibleImage",
      description:
        "The picture shown when a page without its own image is shared on WhatsApp, Facebook and similar.",
    }),
    defineField({
      name: "donationsEnabled",
      title: "Show online donations",
      type: "boolean",
      description: "Leave off for now. Turn on only once online donations have been set up and tested.",
      initialValue: false,
    }),
    defineField({
      name: "donationUrl",
      title: "Donation link",
      type: "url",
      description: "Optional, for later. The secure page where people can give online.",
      validation: (rule) => rule.uri({ scheme: ["https"] }),
    }),
  ],
  preview: { prepare: () => ({ title: "Site Settings" }) },
});
