import type { Metadata } from "next";
import { BigNumber } from "@/components/ui/BigNumber";
import { Button } from "@/components/ui/Button";
import { Container, Grid } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Headline } from "@/components/ui/Headline";
import { Rule } from "@/components/ui/Rule";
import { Text } from "@/components/ui/Text";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <Container className="flex flex-1 flex-col justify-center gap-12 py-20 md:py-32">
      <Eyebrow number="404" label="Page not found" />
      <Grid className="items-end">
        <div className="col-span-12 flex flex-col gap-6 md:col-span-7">
          <Headline level={1} size="h1" text="This page drifted off" accentWord="drifted" />
          <Text size="body-lg" muted>
            The link may be old, or the page may have moved. These are good places to pick the trail back up.
          </Text>
        </div>
        <BigNumber className="col-span-12 md:col-span-4 md:col-start-9" value="404" label="Not found" />
      </Grid>
      <Rule />
      <div className="flex flex-wrap items-center gap-6">
        <Button href="/">Back to home</Button>
        <Button href="/stories" variant="text">
          Read stories
        </Button>
        <Button href="/places" variant="text">
          See places
        </Button>
      </div>
    </Container>
  );
}
