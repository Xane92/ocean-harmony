import { defineArrayMember, defineField } from "sanity";

// Shared field builders so every document uses the same slug, SEO, place and gallery rules.

/** URL slug generated from another field (title by default). Required and unique per type. */
export function slugField(source = "title") {
  return defineField({
    name: "slug",
    title: "Web address",
    type: "slug",
    description: `The end of this page's web address. Click "Generate" to create it from the ${source}; avoid changing it after publishing, because old links would stop working.`,
    options: { source, maxLength: 96 },
    validation: (rule) => rule.required().error('Click "Generate" to create the web address.'),
  });
}

/** Search and social sharing overrides. Every field falls back to the page's own content. */
export function seoField() {
  return defineField({
    name: "seo",
    title: "Search and sharing",
    type: "seo",
    description: "Optional. Leave empty to use the page's own title, summary and main image.",
    options: { collapsible: true, collapsed: true },
  });
}

/** Link to the place this content belongs to, so it appears on that place's page. */
export function placeField({ required = false, description }: { required?: boolean; description?: string } = {}) {
  return defineField({
    name: "place",
    title: "Place",
    type: "reference",
    to: [{ type: "place" }],
    description: description ?? "The place this belongs to. It will also appear on that place's page.",
    validation: (rule) => (required ? rule.required() : rule),
  });
}

/** Required main photo shown at the top of a page and in lists. */
export function heroImageField(description = "The main photo, shown at the top of the page and in lists.") {
  return defineField({
    name: "heroImage",
    title: "Main photo",
    type: "accessibleImage",
    description,
    validation: (rule) => rule.required(),
  });
}

/** A set of photos shown together. Each photo needs its own alt text. */
export function galleryField(description = "Optional extra photos, shown together as a gallery. Drag to change the order.") {
  return defineField({
    name: "gallery",
    title: "Photo gallery",
    type: "array",
    description,
    of: [defineArrayMember({ type: "accessibleImage" })],
    options: { layout: "grid" },
  });
}
