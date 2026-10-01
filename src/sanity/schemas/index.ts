import type { SchemaTypeDefinition } from "sanity";
import { opportunity } from "./documents/opportunity";
import { partner } from "./documents/partner";
import { place } from "./documents/place";
import { radioCampaign } from "./documents/radioCampaign";
import { story } from "./documents/story";
import { storyMap } from "./documents/storyMap";
import { supportProgram } from "./documents/supportProgram";
import { teamMember } from "./documents/teamMember";
import { accessibleImage } from "./objects/accessibleImage";
import { richText, richTextWithImages } from "./objects/richText";
import { seo } from "./objects/seo";
import { approachPage } from "./singletons/approachPage";
import { homePage } from "./singletons/homePage";
import { siteSettings } from "./singletons/siteSettings";

/** One document each, with a fixed ID equal to the type name. */
export const singletonTypes = new Set(["siteSettings", "homePage", "approachPage"]);

export const schemaTypes: SchemaTypeDefinition[] = [
  // Objects
  accessibleImage,
  seo,
  richText,
  richTextWithImages,
  // Singletons
  siteSettings,
  homePage,
  approachPage,
  // Documents
  place,
  story,
  radioCampaign,
  storyMap,
  opportunity,
  partner,
  teamMember,
  supportProgram,
];
