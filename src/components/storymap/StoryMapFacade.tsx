"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { marked } from "@/components/ui/Marked";
import type { Photo } from "@/content/photos";

type StoryMapFacadeProps = {
  title: string;
  /** ArcGIS StoryMap URL. Null shows a placeholder panel after the click. */
  url: string | null;
  poster: Photo | null;
  /** next/image sizes for the poster. */
  sizes?: string;
};

/**
 * Click-to-load StoryMap. Only the poster renders on first load; the ArcGIS
 * iframe mounts after "Open map". A plain link below works without JS.
 */
export function StoryMapFacade({ title, url, poster, sizes = "100vw" }: StoryMapFacadeProps) {
  const [open, setOpen] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Move focus into the loaded map (or placeholder) so keyboard users are not dropped on <body>.
  useEffect(() => {
    if (open) (iframeRef.current ?? panelRef.current)?.focus();
  }, [open]);

  const goFullscreen = () => {
    const el = frameRef.current;
    if (el && document.fullscreenEnabled) {
      void el.requestFullscreen();
    } else if (url) {
      window.open(url, "_blank", "noopener");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div
        ref={frameRef}
        data-surface="deep"
        className="relative aspect-[4/5] w-full overflow-hidden sm:aspect-[4/3] lg:aspect-video"
      >
        {!open && (
          <>
            {poster && (
              <Image
                src={poster.src}
                alt={poster.alt}
                fill
                sizes={sizes}
                className="object-cover"
                style={{ objectPosition: poster.position }}
              />
            )}
            <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-deep/90 via-deep/20 via-50% to-deep/0" />
            <div className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-end sm:justify-between md:p-10">
              <p className="font-mono text-caption uppercase tracking-[0.14em] text-muted">Interactive StoryMap</p>
              <Button onClick={() => setOpen(true)}>
                Open map<span className="sr-only">: {title}</span>
              </Button>
            </div>
          </>
        )}

        {open && url && (
          <iframe
            ref={iframeRef}
            src={url}
            title={`StoryMap: ${title}`}
            allow="fullscreen"
            allowFullScreen
            className="absolute inset-0 size-full border-0 bg-surface"
          />
        )}

        {open && !url && (
          <div
            ref={panelRef}
            tabIndex={-1}
            className="absolute inset-0 flex flex-col items-start justify-center gap-4 p-6 outline-none md:p-16"
          >
            <p className="font-mono text-caption uppercase tracking-[0.14em] text-accent">[PLACEHOLDER: ArcGIS StoryMap URL]</p>
            <p className="max-w-[36ch] font-display text-h3 font-medium text-ink">
              {marked("The map opens here, inside the page, once its link is added in the CMS. [DRAFT]")}
            </p>
          </div>
        )}

        {open && (
          <button
            type="button"
            onClick={goFullscreen}
            className="absolute top-3 right-3 z-10 inline-flex min-h-11 items-center gap-2 bg-deep px-4 font-mono text-caption uppercase tracking-[0.14em] text-sand"
          >
            <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 6V2h4M10 2h4v4M14 10v4h-4M6 14H2v-4" />
            </svg>
            Full screen
          </button>
        )}
      </div>

      {url && (
        <a
          href={url}
          target="_blank"
          rel="noopener"
          className="self-start font-mono text-caption uppercase tracking-[0.14em] text-ink underline decoration-accent underline-offset-4"
        >
          Open the StoryMap in a new tab
        </a>
      )}
    </div>
  );
}
