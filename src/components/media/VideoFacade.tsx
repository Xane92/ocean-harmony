"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import type { Photo } from "@/content/photos";

/** YouTube or Vimeo page link to a privacy-friendly embed URL that autoplays after the click. */
export function videoEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    if (host === "youtu.be") return `https://www.youtube-nocookie.com/embed/${u.pathname.slice(1)}?autoplay=1&rel=0`;
    if (host.endsWith("youtube.com")) {
      const id = u.searchParams.get("v") ?? u.pathname.match(/\/(?:shorts|embed|live)\/([^/?]+)/)?.[1];
      return id ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0` : null;
    }
    if (host.endsWith("vimeo.com")) {
      const id = u.pathname.match(/\/(\d+)/)?.[1];
      return id ? `https://player.vimeo.com/video/${id}?autoplay=1&dnt=1` : null;
    }
  } catch {
    return null;
  }
  return null;
}

/** Click-to-load video. Only the poster loads with the page; the player mounts after "Play video". */
export function VideoFacade({ url, title, poster }: { url: string; title: string; poster: Photo | null }) {
  const [open, setOpen] = useState(false);
  const embed = videoEmbedUrl(url);

  return (
    <div className="flex flex-col gap-4">
      <div data-surface="deep" className="relative aspect-video w-full overflow-hidden">
        {open && embed ? (
          <iframe
            src={embed}
            title={`Video: ${title}`}
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            allowFullScreen
            className="absolute inset-0 size-full border-0"
          />
        ) : (
          <>
            {poster && <Image src={poster.src} alt="" fill sizes="100vw" className="object-cover" />}
            <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-deep/85 via-deep/10 to-deep/0" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 md:p-10">
              <p className="font-mono text-caption uppercase tracking-[0.14em] text-muted">Video</p>
              {embed ? (
                <Button onClick={() => setOpen(true)}>
                  Play video<span className="sr-only">: {title}</span>
                </Button>
              ) : (
                <Button href={url}>Watch the video</Button>
              )}
            </div>
          </>
        )}
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="self-start font-mono text-caption uppercase tracking-[0.14em] text-ink underline decoration-accent underline-offset-4"
      >
        Watch on {url.includes("vimeo") ? "Vimeo" : "YouTube"}
      </a>
    </div>
  );
}
