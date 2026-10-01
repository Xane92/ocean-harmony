"use client";

// Sanity Studio configuration, mounted at /studio by src/app/studio/[[...tool]]/page.tsx.
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { apiVersion, dataset, projectId } from "./src/sanity/env";
import { schemaTypes, singletonTypes } from "./src/sanity/schemas";
import { structure } from "./src/sanity/structure";

// Singletons can be edited and published, never created again, duplicated or deleted.
const singletonActions = new Set(["publish", "discardChanges", "restore"]);

export default defineConfig({
  name: "default",
  title: "Ocean Harmony",
  basePath: "/studio",
  projectId,
  dataset,
  apiVersion,
  plugins: [structureTool({ structure })],
  schema: {
    types: schemaTypes,
    templates: (templates) => templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },
  document: {
    actions: (actions, { schemaType }) =>
      singletonTypes.has(schemaType) ? actions.filter(({ action }) => action && singletonActions.has(action)) : actions,
  },
});
