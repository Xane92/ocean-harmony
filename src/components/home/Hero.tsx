import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Headline } from "@/components/ui/Headline";
import { marked } from "@/components/ui/Marked";
import type { HomeContent } from "@/content/fallback";

/**
 * Full-bleed field photograph with the page's only h1. On phones the photo sits
 * above the text; from lg the text sits over the photo on a Deep scrim.
 */
export function Hero({ hero }: { hero: HomeContent["hero"] }) {
  const { photo } = hero;

  return (
    <section
      data-surface="deep"
      aria-labelledby="home-title"
      className="relative isolate overflow-hidden lg:flex lg:min-h-[calc(100svh-4.5rem)] lg:flex-col lg:justify-end"
    >
      <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[3/2] lg:absolute lg:inset-0 lg:aspect-auto">
        {photo && (
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            priority
            sizes="100vw"
            placeholder={photo.blurDataURL ? "blur" : "empty"}
            blurDataURL={photo.blurDataURL}
            className="hero-settle object-cover"
            style={{ objectPosition: photo.position }}
          />
        )}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-2/5 bg-linear-to-t from-deep to-deep/0 lg:h-full lg:from-deep/95 lg:via-deep/40 lg:via-45%"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 hidden bg-linear-to-r from-deep/70 via-deep/15 via-50% to-deep/0 lg:block"
        />
      </div>

      <Container className="relative flex flex-col gap-6 pb-16 lg:pt-72 lg:pb-16">
        <Eyebrow label={hero.eyebrow} />
        <Headline
          id="home-title"
          level={1}
          size="h1"
          text={hero.headline}
          accentWord={hero.accentWord}
          className="max-w-[18ch]"
        />
        <p className="max-w-[52ch] text-body-lg text-ink">{marked(hero.intro)}</p>
        <div className="mt-2 flex flex-wrap gap-3">
          <Button href={hero.primary.href}>{hero.primary.label}</Button>
          <Button href={hero.secondary.href} variant="secondary">
            {hero.secondary.label}
          </Button>
        </div>
      </Container>
    </section>
  );
}
