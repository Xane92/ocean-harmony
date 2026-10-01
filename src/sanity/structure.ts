import { BulbOutlineIcon } from "@sanity/icons/BulbOutline";
import { CogIcon } from "@sanity/icons/Cog";
import { HomeIcon } from "@sanity/icons/Home";
import type { StructureResolver } from "sanity/structure";

const singletons = [
  { id: "siteSettings", title: "Site Settings", icon: CogIcon },
  { id: "homePage", title: "Home", icon: HomeIcon },
  { id: "approachPage", title: "Approach", icon: BulbOutlineIcon },
];

const collections = [
  { type: "place", title: "Places" },
  { type: "story", title: "Stories" },
  { type: "radioCampaign", title: "Radio Campaigns" },
  { type: "storyMap", title: "StoryMaps" },
  { type: "opportunity", title: "Opportunities" },
  { type: "partner", title: "Partners" },
  { type: "teamMember", title: "Team" },
  { type: "supportProgram", title: "Support Programs" },
];

// Singletons pinned at the top (each opens its one document directly), then every collection.
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      ...singletons.map(({ id, title, icon }) =>
        S.listItem()
          .id(id)
          .title(title)
          .icon(icon)
          .child(S.document().schemaType(id).documentId(id).title(title)),
      ),
      S.divider(),
      ...collections.map(({ type, title }) => S.documentTypeListItem(type).title(title)),
    ]);
