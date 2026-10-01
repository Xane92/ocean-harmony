import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Headline } from "@/components/ui/Headline";
import { cx } from "@/lib/cx";
import type { Link } from "@/content/fallback";

type SectionHeadingProps = {
  id: string;
  number: string;
  eyebrow: string;
  headline: string;
  accentWord: string;
  /** Optional "see all" link set on the right from md. */
  link?: Link;
  className?: string;
};

/** Eyebrow, h2 and an optional text link, shared by the home sections. */
export function SectionHeading({ id, number, eyebrow, headline, accentWord, link, className }: SectionHeadingProps) {
  return (
    <div className={cx("flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-12", className)}>
      <div className="flex flex-col gap-5">
        <Eyebrow number={number} label={eyebrow} />
        <Headline id={id} text={headline} accentWord={accentWord} className="max-w-[16ch]" />
      </div>
      {link && (
        <Button href={link.href} variant="text" className="self-start md:self-end">
          {link.label}
        </Button>
      )}
    </div>
  );
}
