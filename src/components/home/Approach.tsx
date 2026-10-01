import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container, Grid } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Headline } from "@/components/ui/Headline";
import { Text } from "@/components/ui/Text";
import { marked } from "@/components/ui/Marked";
import type { HomeContent } from "@/content/fallback";

/** The six pillars as a numbered list separated by hairlines, with a field photo. */
export function Approach({ approach }: { approach: HomeContent["approach"] }) {
  const { photo } = approach;

  return (
    <section aria-labelledby="home-approach">
      <Container className="pb-24 md:pb-40">
        <Grid className="lg:gap-y-0">
          <div className="col-span-12 flex flex-col gap-6 lg:col-span-5">
            <Eyebrow number="02" label={approach.eyebrow} />
            <Headline id="home-approach" text={approach.headline} accentWord={approach.accentWord} className="max-w-[14ch]" />
            <Text size="body-lg" muted>
              {marked(approach.intro)}
            </Text>
            <Button href={approach.link.href} variant="text" className="self-start">
              {approach.link.label}
            </Button>
            <figure className="relative mt-6 hidden aspect-[4/5] w-full max-w-md overflow-hidden bg-ink/10 lg:block">
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(min-width: 1440px) 448px, 30vw"
                className="object-cover"
                style={{ objectPosition: photo.position }}
              />
            </figure>
          </div>

          <ol className="col-span-12 self-start border-b border-line lg:col-span-6 lg:col-start-7 lg:mt-36">
            {approach.pillars.map((pillar, i) => (
              <li
                key={pillar}
                className="grid grid-cols-[3rem_1fr] items-baseline gap-4 border-t border-line py-6 md:grid-cols-[5rem_1fr] md:py-8"
              >
                <span className="font-mono text-caption tracking-[0.14em] text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-h3 font-medium text-ink">{pillar}</h3>
              </li>
            ))}
          </ol>
        </Grid>
      </Container>
    </section>
  );
}
