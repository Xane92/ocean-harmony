import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Headline } from "@/components/ui/Headline";
import { IndexList, type IndexItem } from "./IndexList";

/** A titled hairline list on a detail page, e.g. the stories from one place. Renders nothing when empty. */
export function RelatedSection({
  number,
  label,
  title,
  accentWord,
  items,
}: {
  number: string;
  label: string;
  title: string;
  accentWord?: string;
  items: IndexItem[];
}) {
  if (items.length === 0) return null;
  const id = `related-${label.toLowerCase().replace(/\W+/g, "-")}`;
  return (
    <Container as="section" aria-labelledby={id} className="flex flex-col gap-10 py-16 md:py-24">
      <div className="flex flex-col gap-5">
        <Eyebrow number={number} label={label} />
        <Headline id={id} text={title} accentWord={accentWord} size="h2" />
      </div>
      <IndexList items={items} />
    </Container>
  );
}
