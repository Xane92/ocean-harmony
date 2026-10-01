import { Container, Grid } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { marked } from "@/components/ui/Marked";
import type { HomeContent } from "@/content/fallback";

/** Big-type paragraph: where the work began and where it is going. */
export function Statement({ statement }: { statement: HomeContent["statement"] }) {
  const { text, accentWord } = statement;
  const index = text.indexOf(accentWord);

  return (
    <section aria-label={statement.eyebrow}>
      <Container className="py-24 md:py-40">
        <Grid className="gap-y-8">
          <Eyebrow number="01" label={statement.eyebrow} className="col-span-12 lg:col-span-3 lg:pt-4" />
          <p className="col-span-12 max-w-[30ch] font-display text-h2 font-medium text-ink lg:col-span-9">
            {index === -1 ? (
              marked(text)
            ) : (
              <>
                {marked(text.slice(0, index))}
                <em className="font-serif font-normal tracking-normal">{accentWord}</em>
                {marked(text.slice(index + accentWord.length))}
              </>
            )}
          </p>
        </Grid>
      </Container>
    </section>
  );
}
