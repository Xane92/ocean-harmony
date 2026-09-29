import { cx } from "@/lib/cx";

type HeadlineSize = "display" | "h1" | "h2" | "h3";

type HeadlineProps = {
  text: string;
  /** One word (or short phrase) from `text` set in Instrument Serif italic. Only one per headline. */
  accentWord?: string;
  /** Heading level for document outline; independent of visual size. */
  level?: 1 | 2 | 3 | 4;
  size?: HeadlineSize;
  className?: string;
  id?: string;
};

const sizeClass: Record<HeadlineSize, string> = {
  display: "text-display",
  h1: "text-h1",
  h2: "text-h2",
  h3: "text-h3",
};

/** Instrument Sans headline with a single serif-italic accent word. */
export function Headline({
  text,
  accentWord,
  level = 2,
  size = "h2",
  className,
  id,
}: HeadlineProps) {
  const Tag = `h${level}` as const;
  const index = accentWord ? text.indexOf(accentWord) : -1;

  if (accentWord && index === -1 && process.env.NODE_ENV !== "production") {
    console.warn(`Headline: accent word "${accentWord}" not found in "${text}"`);
  }

  return (
    <Tag id={id} className={cx("font-display font-medium text-ink", sizeClass[size], className)}>
      {index === -1 || !accentWord ? (
        text
      ) : (
        <>
          {text.slice(0, index)}
          <em className="font-serif font-normal tracking-normal">{accentWord}</em>
          {text.slice(index + accentWord.length)}
        </>
      )}
    </Tag>
  );
}
