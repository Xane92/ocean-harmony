import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";

// The Studio is a client app; the shell is built once and every /studio/* path loads it.
export const dynamic = "force-static";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
