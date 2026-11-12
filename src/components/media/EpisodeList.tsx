import { formatDate } from "@/content/labels";
import { storageUrl } from "@/lib/supabase/env";
import type { Episode } from "@/lib/supabase/types";

const AUDIO_FILE = /\.(mp3|m4a|aac|ogg|oga|wav|webm)(\?|$)/i;

/** Radio episodes as numbered rows. Uploaded or direct audio files play in place; other links open out. */
export function EpisodeList({ episodes }: { episodes: Episode[] }) {
  const items = episodes.filter((e) => e?.title);
  if (items.length === 0) return null;

  return (
    <ol className="border-b border-line">
      {items.map((ep, i) => {
        const src = ep.audio_path ? storageUrl("audio", ep.audio_path) : ep.audio_url && AUDIO_FILE.test(ep.audio_url) ? ep.audio_url : null;
        const external = !src && ep.audio_url ? ep.audio_url : null;
        return (
          <li key={`${ep.title}-${i}`} className="grid grid-cols-[3.5rem_1fr] gap-x-4 gap-y-4 border-t border-line py-8 md:grid-cols-12 md:gap-x-6 md:py-10">
            <p className="font-display text-h2 font-medium tabular-nums text-ink md:col-span-2">{String(i + 1).padStart(2, "0")}</p>
            <div className="col-start-2 flex min-w-0 flex-col gap-3 md:col-span-10 md:col-start-3">
              <p className="font-mono text-caption uppercase tracking-[0.14em] text-muted">
                {[formatDate(ep.date), ep.duration].filter(Boolean).join(" / ") || "Episode"}
              </p>
              <h3 className="font-display text-h3 font-medium text-ink">{ep.title}</h3>
              {ep.summary && <p className="max-w-[60ch] text-body text-muted">{ep.summary}</p>}
              {src && (
                <audio controls preload="none" src={src} className="mt-2 w-full max-w-xl">
                  <a href={src}>Download the recording</a>
                </audio>
              )}
              {external && (
                <a
                  href={external}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex min-h-11 items-center self-start font-mono text-caption uppercase tracking-[0.14em] text-ink underline decoration-accent underline-offset-4"
                >
                  Listen to this episode
                </a>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
