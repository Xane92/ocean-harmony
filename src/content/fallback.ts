import { fieldPhotos, type Photo } from "./photos";

// Home page content used when the Sanity home document (or one of its fields) is empty.
// Facts come only from the client brief in CLAUDE.md. Copy written by the developer is marked
// [DRAFT]; anything we do not know yet is marked [PLACEHOLDER]. Never add facts here.

export type Link = { label: string; href: string };

export type HomeStory = {
  title: string;
  kind: string;
  place: string;
  href: string;
  photo: Photo | null;
};

export type HomeStoryMap = {
  title: string;
  summary: string;
  /** ArcGIS StoryMap URL, or null until the client supplies one. */
  url: string | null;
  poster: Photo | null;
};

export type HomePlace = {
  name: string;
  country?: string;
  status: string;
  note?: string;
};

export type HomeOpportunity = {
  title: string;
  kind: string;
  status: string;
  /** Open listings get the accent dot. */
  open: boolean;
  href: string;
};

export type HomeContent = {
  hero: {
    eyebrow: string;
    headline: string;
    accentWord?: string;
    intro: string;
    photo: Photo | null;
    primary: Link;
    secondary: Link;
  };
  statement: { eyebrow: string; text: string; accentWord: string };
  approach: {
    eyebrow: string;
    headline: string;
    accentWord: string;
    intro: string;
    pillars: string[];
    link: Link;
    photo: Photo;
  };
  places: {
    eyebrow: string;
    headline: string;
    accentWord: string;
    items: HomePlace[];
    count: { value: string; label: string };
    link: Link;
  };
  explore: {
    eyebrow: string;
    headline: string;
    accentWord: string;
    storyMap: HomeStoryMap;
    link: Link;
  };
  stories: {
    eyebrow: string;
    headline: string;
    accentWord: string;
    items: HomeStory[];
    link: Link;
  };
  onAir: {
    eyebrow: string;
    headline: string;
    accentWord: string;
    intro: string;
    photo: Photo;
    episode: { number: string; title: string; show: string; duration: string };
    link: Link;
  };
  opportunities: {
    eyebrow: string;
    headline: string;
    accentWord: string;
    items: HomeOpportunity[];
    link: Link;
  };
  cta: {
    support: { eyebrow: string; headline: string; accentWord: string; text: string; link: Link };
    partner: { eyebrow: string; headline: string; accentWord: string; text: string; link: Link };
  };
};

export const homeFallback: HomeContent = {
  hero: {
    eyebrow: "Ocean Harmony Initiative",
    headline: "Ocean knowledge, carried from the coast [DRAFT]",
    accentWord: "coast",
    // The client's own description of what OHI does.
    intro:
      "Ocean Harmony Initiative connects people, knowledge and action through ocean literacy, storytelling, youth engagement and community-based conservation.",
    photo: fieldPhotos.netMending,
    primary: { label: "Explore the approach", href: "/approach" },
    secondary: { label: "Support", href: "/support" },
  },
  statement: {
    eyebrow: "Where it began",
    text: "It began with the Ocean Harmony project in Winneba, Ghana. The approach now travels, from trainings in Morocco to new work ahead in Tanzania and Cameroon. [DRAFT]",
    accentWord: "travels",
  },
  approach: {
    eyebrow: "The approach",
    headline: "Six ways of learning with the ocean [DRAFT]",
    accentWord: "learning",
    intro: "[PLACEHOLDER: two sentences on how the Ocean Harmony approach works in a classroom or on the beach]",
    pillars: [
      "Ocean literacy",
      "Storytelling",
      "Play-based learning",
      "Exploration",
      "Local and community knowledge",
      "Youth engagement",
    ],
    link: { label: "Read the approach", href: "/approach" },
    photo: fieldPhotos.sharkVideo,
  },
  places: {
    eyebrow: "Places",
    headline: "Where the approach has travelled [DRAFT]",
    accentWord: "travelled",
    items: [
      { name: "Winneba", country: "Ghana", status: "Active", note: "Where Ocean Harmony began" },
      { name: "Morocco", status: "Trainings delivered" },
      { name: "Tanzania", status: "Upcoming", note: "With COES-WIO" },
      { name: "Cameroon", status: "Upcoming" },
    ],
    count: { value: "4", label: "Countries" },
    link: { label: "All places", href: "/places" },
  },
  explore: {
    eyebrow: "Explore",
    headline: "Read the coast as a map [DRAFT]",
    accentWord: "map",
    storyMap: {
      title: "[PLACEHOLDER: StoryMap title]",
      summary: "[PLACEHOLDER: one or two sentences on what this StoryMap shows]",
      url: null,
      poster: fieldPhotos.beachCleanup,
    },
    link: { label: "All StoryMaps", href: "/explore" },
  },
  stories: {
    eyebrow: "Field stories",
    headline: "Notes and voices from the field [DRAFT]",
    accentWord: "voices",
    items: [
      {
        title: "[PLACEHOLDER: story title]",
        kind: "Photo essay",
        place: "[PLACEHOLDER: place]",
        href: "/stories",
        photo: fieldPhotos.fishDrawing,
      },
      {
        title: "[PLACEHOLDER: story title]",
        kind: "Field story",
        place: "[PLACEHOLDER: place]",
        href: "/stories",
        photo: fieldPhotos.sortingBottles,
      },
      {
        title: "[PLACEHOLDER: story title]",
        kind: "Community voice",
        place: "[PLACEHOLDER: place]",
        href: "/stories",
        photo: fieldPhotos.drawingWorkshop,
      },
    ],
    link: { label: "All stories", href: "/stories" },
  },
  onAir: {
    eyebrow: "On air",
    headline: "The ocean, talked through on local radio [DRAFT]",
    accentWord: "radio",
    intro: "[PLACEHOLDER: two sentences introducing the radio campaigns, the station and who takes part]",
    photo: fieldPhotos.conversation,
    episode: {
      number: "01",
      title: "[PLACEHOLDER: episode title]",
      show: "[PLACEHOLDER: campaign and station]",
      duration: "[PLACEHOLDER: length]",
    },
    link: { label: "Listen to the radio campaigns", href: "/stories" },
  },
  opportunities: {
    eyebrow: "Opportunities",
    headline: "Ways to join the work [DRAFT]",
    accentWord: "join",
    items: [
      { title: "Volunteer", kind: "Volunteer", status: "Open", open: true, href: "/opportunities" },
      {
        title: "Ocean Harmony Storytelling Fellowship",
        kind: "Fellowship",
        status: "Opening soon",
        open: false,
        href: "/opportunities",
      },
    ],
    link: { label: "All opportunities", href: "/opportunities" },
  },
  cta: {
    support: {
      eyebrow: "Support",
      headline: "Back a program [DRAFT]",
      accentWord: "program",
      text: "[PLACEHOLDER: one line on what support funds, in the client's words]",
      link: { label: "Support", href: "/support" },
    },
    partner: {
      eyebrow: "Partner",
      headline: "Bring the approach to your place [DRAFT]",
      accentWord: "place",
      text: "[PLACEHOLDER: one line for schools, universities and organisations that want to work together]",
      link: { label: "Partner with us", href: "/partner" },
    },
  },
};
