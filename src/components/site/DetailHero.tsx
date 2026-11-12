import Link from "next/link";
import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Headline } from "@/components/ui/Headline";
import { PhotoBlock } from "@/components/ui/PhotoBlock";
import { Text } from "@/components/ui/Text";
import type { Photo } from "@/content/photos";

type DetailHeroProps = {
  back: { href: string; label: string };
  /** Mono line above the title, e.g. "Field story / Winneba". */
  kicker: ReactNode;
  title: string;
  intro?: string | null;
  /** Extra metadata under the intro (dates, author, station). */
  meta?: ReactNode;
  photo?: Photo | null;
};

/** Top of every detail page: back link, kicker, h1, intro, then an optional full-bleed photo. */
export function DetailHero({ back, kicker, title, intro, meta, photo }: DetailHeroProps) {
  return (
    <header>
      <Container className="flex flex-col gap-6 pt-10 pb-12 md:pt-16 md:pb-16">
        <Link
          href={back.href}
          className="inline-flex min-h-11 items-center self-start font-mono text-caption uppercase tracking-[0.14em] text-ink underline decoration-line underline-offset-[6px] hover:decoration-accent"
        >
          <span aria-hidden="true">←&nbsp;</span>
          {back.label}
        </Link>
        <p className="font-mono text-caption uppercase tracking-[0.14em] text-muted">{kicker}</p>
        <Headline level={1} size="h1" text={title} className="max-w-[20ch]" />
        {intro && <Text size="body-lg">{intro}</Text>}
        {meta && <div className="font-mono text-caption uppercase tracking-[0.14em] text-muted">{meta}</div>}
      </Container>
      {photo && (
        <PhotoBlock
          src={photo.src}
          alt={photo.alt}
          caption={photo.caption}
          ratio="16:9"
          fullBleed
          priority
          sizes="100vw"
        />
      )}
    </header>
  );
}
