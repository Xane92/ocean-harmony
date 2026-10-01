// Client field photographs in public/images/field, as web versions (2400px long edge, quality 80).
// Alt text describes only what is visible. Places, names and dates are unknown until the client confirms them.

export type Photo = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  /** CSS object-position for crops, e.g. "50% 30%". */
  position?: string;
  /** Tiny base64 blur shown while loading (Sanity images only). */
  blurDataURL?: string;
};

const unknownCaption = "[PLACEHOLDER: where and when this was taken]";

export const fieldPhotos = {
  netMending: {
    src: "/images/field/young-people-mending-fishing-net.jpg",
    alt: "Young people pull a green fishing net across the edge of a painted wooden canoe, one wearing a lanyard and badge, while a young woman in a yellow jersey leans on the boat behind them.",
    width: 2400,
    height: 1588,
    caption: unknownCaption,
    position: "55% 15%",
  },
  beachCleanup: {
    src: "/images/field/beach-cleanup-beside-fishing-canoes.jpg",
    alt: "Volunteers in face masks and gloves rake plastic bottles and rubbish into piles on a beach, with wooden fishing canoes, nets and a crowd behind them and more boats moored offshore.",
    width: 2400,
    height: 1600,
    caption: unknownCaption,
  },
  sortingBottles: {
    src: "/images/field/young-people-sorting-plastic-bottles.jpg",
    alt: "Two young people in caps crouch and laugh as they sort plastic bottles beside a large bale of collected bottles, while a woman in gloves fills a green basket in the foreground.",
    width: 2400,
    height: 1600,
    caption: unknownCaption,
  },
  drawingWorkshop: {
    src: "/images/field/students-drawing-at-workshop.jpg",
    alt: "Students in green and patterned school uniforms bend over sheets of paper, drawing with pencils at a shared table, while a person films with a camera on a tripod behind them.",
    width: 2400,
    height: 1600,
    caption: unknownCaption,
  },
  fishDrawing: {
    src: "/images/field/girl-holding-fish-drawing.jpg",
    alt: "A girl in a yellow and brown school uniform stands against a weathered wall, holding up her crayon drawing of a large blue fish surrounded by small yellow fish, a pencil in one hand.",
    width: 1800,
    height: 2400,
    caption: unknownCaption,
    position: "50% 45%",
  },
  sharkVideo: {
    src: "/images/field/students-watching-shark-video.jpg",
    alt: "Seen from behind, students on a classroom bench watch a laptop screen showing a shark swimming underwater.",
    width: 1800,
    height: 2400,
    caption: unknownCaption,
    position: "50% 60%",
  },
  conversation: {
    src: "/images/field/community-conversation-under-shelter.jpg",
    alt: "A man in a patterned shirt gestures as he talks with two young women in headscarves under a covered shelter, with other people standing around them.",
    width: 2400,
    height: 1600,
    caption: unknownCaption,
    position: "60% 50%",
  },
  // Not used on the home page: the photo has "Ocean Hamony Storytelling Training" printed on it (sic).
  blockModel: {
    src: "/images/field/building-block-model-at-storytelling-training.jpg",
    alt: "Hands hold out a blue board with a small model built from coloured plastic building blocks, while another person points at it.",
    width: 2400,
    height: 1523,
    caption: unknownCaption,
  },
} satisfies Record<string, Photo>;
