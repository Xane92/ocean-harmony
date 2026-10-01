import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container, Grid } from "@/components/ui/Container";
import { DeepSection } from "@/components/ui/DeepSection";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Headline } from "@/components/ui/Headline";
import { marked } from "@/components/ui/Marked";
import { Text } from "@/components/ui/Text";
import type { HomeContent } from "@/content/fallback";

// Fixed, decorative waveform heights (percent). Not real audio data.
const BARS = Array.from({ length: 56 }, (_, i) =>
  Math.round(28 + 62 * Math.abs(Math.sin(i * 0.55) * Math.cos(i * 0.21))),
);
const PLAYED = 16;

/** Radio campaigns in a Deep section, with a still audio-player visual for the latest episode. */
export function OnAir({ onAir }: { onAir: HomeContent["onAir"] }) {
  const { photo, episode } = onAir;

  return (
    <DeepSection aria-labelledby="home-on-air">
      <Container>
        <Grid className="items-center">
          <figure className="relative col-span-12 aspect-[4/5] overflow-hidden bg-ink/10 sm:aspect-[3/2] lg:col-span-6 lg:aspect-[4/5]">
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
              style={{ objectPosition: photo.position }}
            />
          </figure>

          <div className="col-span-12 flex flex-col gap-6 lg:col-span-5 lg:col-start-8">
            <Eyebrow number="06" label={onAir.eyebrow} />
            <Headline id="home-on-air" text={onAir.headline} accentWord={onAir.accentWord} className="max-w-[14ch]" />
            <Text size="body-lg" muted>
              {marked(onAir.intro)}
            </Text>

            <div className="mt-6 border-t border-line pt-8">
              <div className="flex items-start gap-6">
                <p className="font-display text-h1 font-medium tabular-nums text-accent" aria-hidden="true">
                  {episode.number}
                </p>
                <div className="flex flex-col gap-2 pt-1">
                  <p className="font-mono text-caption uppercase tracking-[0.14em] text-muted">
                    <span className="sr-only">Episode {episode.number}: </span>
                    <span aria-hidden="true">Episode</span>
                  </p>
                  <p className="font-display text-h3 font-medium text-ink">{marked(episode.title)}</p>
                  <p className="font-mono text-caption text-muted">{marked(episode.show)}</p>
                </div>
              </div>

              <div aria-hidden="true" className="mt-8 flex items-center gap-4">
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-accent text-on-accent">
                  <svg viewBox="0 0 16 16" className="ml-0.5 size-4" fill="currentColor">
                    <path d="M4 2.5v11l9-5.5z" />
                  </svg>
                </span>
                <span className="flex h-12 min-w-0 flex-1 items-center gap-[2px]">
                  {BARS.map((h, i) => (
                    <span
                      key={i}
                      className={i < PLAYED ? "w-full rounded-full bg-accent" : "w-full rounded-full bg-ink/30"}
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </span>
              </div>
              <p className="mt-3 flex justify-between gap-4 pl-16 font-mono text-caption text-muted">
                <span>00:00</span>
                <span>{marked(episode.duration)}</span>
              </p>
            </div>

            <Button href={onAir.link.href} variant="text" className="mt-2 self-start">
              {onAir.link.label}
            </Button>
          </div>
        </Grid>
      </Container>
    </DeepSection>
  );
}
