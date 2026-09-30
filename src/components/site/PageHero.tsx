import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Headline } from "@/components/ui/Headline";
import { Text } from "@/components/ui/Text";

type PageHeroProps = {
  number: string;
  label: string;
  title: string;
  accentWord: string;
  intro: string;
};

/** Shared top of every inner page: eyebrow, h1 with one accent word, intro. */
export function PageHero({ number, label, title, accentWord, intro }: PageHeroProps) {
  return (
    <Container className="flex flex-col gap-6 pt-16 pb-16 md:pt-28 md:pb-24">
      <Eyebrow number={number} label={label} />
      <Headline level={1} size="h1" text={title} accentWord={accentWord} className="max-w-[16ch]" />
      <Text size="body-lg" className="mt-2">
        {intro}
      </Text>
    </Container>
  );
}
