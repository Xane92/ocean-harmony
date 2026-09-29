import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BigNumber } from "@/components/ui/BigNumber";
import { Button } from "@/components/ui/Button";
import { Container, Grid } from "@/components/ui/Container";
import { DeepSection } from "@/components/ui/DeepSection";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Headline } from "@/components/ui/Headline";
import { PhotoBlock } from "@/components/ui/PhotoBlock";
import { Reveal } from "@/components/ui/Reveal";
import { Rule } from "@/components/ui/Rule";
import { Text } from "@/components/ui/Text";

// Dev-only design system preview. Never ships: 404 in production, excluded from the sitemap.
export const metadata: Metadata = {
  title: "Design system",
  robots: { index: false, follow: false },
};

function Showcase({ surface }: { surface: "sand" | "deep" }) {
  const id = (name: string) => `${surface}-${name}`;

  return (
    <Container className="flex flex-col gap-24">
      <header className="flex flex-col gap-6">
        <Eyebrow number={surface === "sand" ? "01" : "02"} label={`Surface: ${surface}`} />
        <Headline
          level={2}
          size="display"
          text="Field knowledge from the shore"
          accentWord="shore"
        />
        <Text size="body-lg">
          [PLACEHOLDER: intro paragraph. Every component on this surface, using only tokens.]
        </Text>
      </header>

      <section aria-labelledby={id("type")} className="flex flex-col gap-10">
        <Rule label="Type scale" />
        <h3 id={id("type")} className="sr-only">
          Type scale
        </h3>
        <div className="flex flex-col gap-8">
          <Headline level={3} size="display" text="Display with an accent" accentWord="accent" />
          <Headline level={3} size="h1" text="Heading one with an accent" accentWord="accent" />
          <Headline level={3} size="h2" text="Heading two with an accent" accentWord="accent" />
          <Headline level={3} size="h3" text="Heading three with an accent" accentWord="accent" />
          <Text size="body-lg">
            Body large. [PLACEHOLDER: a lead paragraph sits here at a comfortable measure, never
            wider than sixty-eight characters per line, so it reads easily on a phone.]
          </Text>
          <Text>
            Body. [PLACEHOLDER: running text for stories and pages. Raleway at 1.6 leading, with a
            line length capped so long passages stay readable on every screen size.]
          </Text>
          <Text size="caption" muted>
            Caption. [PLACEHOLDER: metadata, dates, places.]
          </Text>
        </div>
      </section>

      <section aria-labelledby={id("marks")} className="flex flex-col gap-10">
        <Rule label="Eyebrow, rule, numbers" />
        <h3 id={id("marks")} className="sr-only">
          Eyebrow, rule and numbers
        </h3>
        <div className="flex flex-col gap-4">
          <Eyebrow number="03" label="Places" />
          <Eyebrow label="Eyebrow without number" />
        </div>
        <Rule />
        <Grid>
          <BigNumber className="col-span-12 md:col-span-4" value="00" label="Placeholder figure" />
          <BigNumber className="col-span-12 md:col-span-4" value="00" label="Placeholder figure" />
          <BigNumber className="col-span-12 md:col-span-4" value="00" label="Placeholder figure" />
        </Grid>
      </section>

      <section aria-labelledby={id("actions")} className="flex flex-col gap-10">
        <Rule label="Buttons" />
        <h3 id={id("actions")} className="sr-only">
          Buttons
        </h3>
        <div className="flex flex-wrap items-center gap-6">
          <Button href="#">Primary link</Button>
          <Button variant="secondary">Secondary button</Button>
          <Button variant="text" href="#">
            Text link
          </Button>
          <Button disabled>Disabled</Button>
        </div>
      </section>

      <section aria-labelledby={id("grid")} className="flex flex-col gap-10">
        <Rule label="12-column grid" />
        <h3 id={id("grid")} className="sr-only">
          Twelve column grid
        </h3>
        <Grid className="gap-y-4">
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={i}
              className="col-span-1 h-16 bg-ink/10 pt-1 text-center font-mono text-caption text-muted"
            >
              {i + 1}
            </div>
          ))}
          <div className="col-span-12 h-12 bg-ink/10 md:col-span-8" />
          <div className="col-span-12 h-12 bg-ink/10 md:col-span-4" />
        </Grid>
      </section>

      <section aria-labelledby={id("photos")} className="flex flex-col gap-10">
        <Rule label="Photo blocks" />
        <h3 id={id("photos")} className="sr-only">
          Photo blocks
        </h3>
        <Grid>
          <PhotoBlock
            className="col-span-12 md:col-span-7"
            ratio="3:2"
            caption="3:2. [PLACEHOLDER: caption]"
            credit="[PLACEHOLDER]"
          />
          <PhotoBlock
            className="col-span-12 md:col-span-5"
            ratio="4:5"
            caption="4:5. [PLACEHOLDER: caption]"
            credit="[PLACEHOLDER]"
          />
          <PhotoBlock
            className="col-span-12"
            ratio="16:9"
            caption="16:9. [PLACEHOLDER: caption]"
            credit="[PLACEHOLDER]"
          />
        </Grid>
      </section>

      <section aria-labelledby={id("reveal")} className="flex flex-col gap-10">
        <Rule label="Reveal" />
        <h3 id={id("reveal")} className="sr-only">
          Reveal
        </h3>
        <Grid>
          {[0, 120, 240].map((delay) => (
            <Reveal key={delay} delay={delay} className="col-span-12 md:col-span-4">
              <div className="flex h-40 items-end bg-ink/10 p-4 font-mono text-caption text-muted">
                Delay {delay}ms
              </div>
            </Reveal>
          ))}
        </Grid>
      </section>
    </Container>
  );
}

export default function DesignSystemPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <div className="flex flex-col">
      <Container className="py-16">
        <Headline level={1} size="h1" text="Paper & Ink system" accentWord="Ink" />
      </Container>

      <div className="pb-24">
        <Showcase surface="sand" />
      </div>

      <PhotoBlock
        fullBleed
        ratio="16:9"
        caption="Full bleed, 16:9. [PLACEHOLDER: caption]"
        credit="[PLACEHOLDER]"
      />

      <DeepSection className="mt-24">
        <Showcase surface="deep" />
      </DeepSection>
    </div>
  );
}
