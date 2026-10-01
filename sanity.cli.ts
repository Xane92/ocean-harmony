// Sanity CLI configuration, used locally for `sanity schema extract` and `sanity typegen generate`.
import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  },
  typegen: {
    path: "./src/**/*.{ts,tsx}",
    schema: "./src/sanity/schema.json",
    generates: "./src/sanity/types.ts",
    overloadClientMethods: true,
  },
});
