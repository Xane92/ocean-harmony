import { Container, Grid } from "@/components/ui/Container";
import { marked } from "@/components/ui/Marked";
import { Text } from "@/components/ui/Text";
import { StoryMapFacade } from "@/components/storymap/StoryMapFacade";
import type { HomeContent } from "@/content/fallback";
import { SectionHeading } from "./SectionHeading";

/** Featured StoryMap behind a click-to-load facade. */
export function Explore({ explore }: { explore: HomeContent["explore"] }) {
  const { storyMap } = explore;

  return (
    <section aria-labelledby="home-explore" className="border-t border-line">
      <Container className="py-24 md:py-40">
        <Grid className="items-end">
          <SectionHeading
            id="home-explore"
            number="04"
            eyebrow={explore.eyebrow}
            headline={explore.headline}
            accentWord={explore.accentWord}
            className="col-span-12 lg:col-span-7"
          />
          <div className="col-span-12 flex flex-col gap-3 lg:col-span-4 lg:col-start-9">
            <h3 className="font-display text-h3 font-medium text-ink">{marked(storyMap.title)}</h3>
            <Text muted>{marked(storyMap.summary)}</Text>
          </div>
        </Grid>

        <div className="mt-12 md:mt-16">
          <StoryMapFacade
            title={storyMap.title}
            url={storyMap.url}
            poster={storyMap.poster}
            sizes="(min-width: 1440px) 1312px, 100vw"
          />
        </div>
      </Container>
    </section>
  );
}
