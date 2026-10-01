import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Headline } from "@/components/ui/Headline";
import { marked } from "@/components/ui/Marked";
import { Text } from "@/components/ui/Text";
import { cx } from "@/lib/cx";
import type { HomeContent } from "@/content/fallback";

type Half = HomeContent["cta"]["support"];

function CtaHalf({ half, number, id, variant, className }: {
  half: Half;
  number: string;
  id: string;
  variant: "primary" | "secondary";
  className?: string;
}) {
  return (
    <div className={cx("flex flex-col items-start gap-6 py-20 md:py-28", className)}>
      <Eyebrow number={number} label={half.eyebrow} />
      <Headline id={id} text={half.headline} accentWord={half.accentWord} className="max-w-[14ch]" />
      <Text muted>{marked(half.text)}</Text>
      <Button href={half.link.href} variant={variant} className="mt-2">
        {half.link.label}
      </Button>
    </div>
  );
}

/** Split call to action: Support on one half, Partner on the other, divided by a hairline. */
export function SupportPartner({ cta }: { cta: HomeContent["cta"] }) {
  return (
    <section aria-label="Support and partner" className="border-t border-line">
      <Container className="grid lg:grid-cols-2">
        <CtaHalf half={cta.support} number="08" id="home-support" variant="primary" className="lg:pr-16" />
        <CtaHalf
          half={cta.partner}
          number="09"
          id="home-partner"
          variant="secondary"
          className="border-t border-line lg:border-t-0 lg:border-l lg:pl-16"
        />
      </Container>
    </section>
  );
}
