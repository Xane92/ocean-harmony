import { defineArrayMember, defineField, defineType } from "sanity";

// Headings start at H2: the page title is always the only H1.
const styles = [
  { title: "Paragraph", value: "normal" },
  { title: "Heading", value: "h2" },
  { title: "Subheading", value: "h3" },
  { title: "Quote", value: "blockquote" },
];

// Only bold is offered: the site's body font has no italic loaded.
const block = defineArrayMember({
  type: "block",
  styles,
  lists: [
    { title: "Bullet list", value: "bullet" },
    { title: "Numbered list", value: "number" },
  ],
  marks: {
    decorators: [{ title: "Bold", value: "strong" }],
    annotations: [
      defineArrayMember({
        name: "link",
        title: "Link",
        type: "object",
        fields: [
          defineField({
            name: "href",
            title: "Link address",
            type: "url",
            description: "A full web address (https://...), an email (mailto:...) or a page on this site (/stories).",
            validation: (rule) =>
              rule.required().uri({ scheme: ["http", "https", "mailto", "tel"], allowRelative: true }),
          }),
        ],
      }),
    ],
  },
});

/** Formatted text: paragraphs, headings, quotes, lists, bold and links. */
export const richText = defineType({
  name: "richText",
  title: "Text",
  type: "array",
  of: [block],
});

/** Formatted text that can also hold photos between paragraphs. */
export const richTextWithImages = defineType({
  name: "richTextWithImages",
  title: "Text with images",
  type: "array",
  of: [block, defineArrayMember({ type: "accessibleImage" })],
});
