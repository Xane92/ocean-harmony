import { BigNumber } from "@/components/ui/BigNumber";
import { Button } from "@/components/ui/Button";
import { Container, Grid } from "@/components/ui/Container";
import { Headline } from "@/components/ui/Headline";
import { Rule } from "@/components/ui/Rule";
import { Text } from "@/components/ui/Text";

type EmptyStateProps = {
  /** What is counted, e.g. "Stories published". Shown under a "00" figure. */
  countLabel: string;
  title: string;
  accentWord: string;
  body: string;
  action?: { label: string; href: string };
};

/** Shown when a collection has no published items yet. */
export function EmptyState({ countLabel, title, accentWord, body, action }: EmptyStateProps) {
  return (
    <Container as="section" aria-label={countLabel} className="pb-24 md:pb-32">
      <Rule label="Nothing published yet" />
      <Grid className="mt-12 items-end">
        <BigNumber className="col-span-12 md:col-span-5" value="00" label={countLabel} />
        <div className="col-span-12 flex flex-col gap-5 md:col-span-7">
          <Headline level={2} size="h3" text={title} accentWord={accentWord} />
          <Text muted>{body}</Text>
          {action && (
            <Button variant="text" href={action.href} className="self-start">
              {action.label}
            </Button>
          )}
        </div>
      </Grid>
    </Container>
  );
}
