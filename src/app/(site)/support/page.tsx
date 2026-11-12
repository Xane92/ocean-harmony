import type { Metadata } from "next";
import Image from "next/image";
import { EmptyState } from "@/components/site/EmptyState";
import { PageHero } from "@/components/site/PageHero";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { DeepSection } from "@/components/ui/DeepSection";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Headline } from "@/components/ui/Headline";
import { Text } from "@/components/ui/Text";
import { getDonation, getSupportPrograms } from "@/content/collections";
import { toPhoto } from "@/content/media";

export const metadata: Metadata = {
  title: "Support",
  description: "Ways to support specific Ocean Harmony programs.",
  alternates: { canonical: "/support" },
};

export default async function SupportPage() {
  const [programs, donationUrl] = await Promise.all([getSupportPrograms(), getDonation()]);

  return (
    <>
      <PageHero
        number="08"
        label="Support"
        title="Support a specific program"
        accentWord="specific"
        intro="[PLACEHOLDER: one or two sentences on how support reaches the programs.]"
      />

      {programs.length === 0 ? (
        <EmptyState
          countLabel="Programs published"
          title="Programs are being listed"
          accentWord="listed"
          body="Each program will be described here with what your support pays for."
          action={{ label: "Get in touch about support", href: "/contact" }}
        />
      ) : (
        <Container as="section" aria-label="Programs" className="pb-24 md:pb-32">
          <ol className="border-b border-line">
            {programs.map((p, i) => {
              const photo = toPhoto(p.image);
              return (
                <li key={p.id} className="grid grid-cols-[2.5rem_1fr] gap-x-4 gap-y-5 border-t border-line py-10 md:grid-cols-12 md:gap-x-6 md:py-14">
                  <span className="font-mono text-caption text-accent md:col-span-1 md:pt-2">{String(i + 1).padStart(2, "0")}</span>
                  <div className="col-start-2 flex flex-col gap-4 md:col-span-6 md:col-start-2">
                    <h2 className="font-display text-h2 font-medium text-ink">{p.title}</h2>
                    {p.summary && <p className="max-w-[52ch] whitespace-pre-line text-body-lg text-ink">{p.summary}</p>}
                    {p.funds && (
                      <div className="mt-2 flex flex-col gap-2 border-l-2 border-accent pl-4">
                        <p className="font-mono text-caption uppercase tracking-[0.14em] text-muted">What support pays for</p>
                        <p className="max-w-[52ch] whitespace-pre-line text-body text-ink">{p.funds}</p>
                      </div>
                    )}
                  </div>
                  {photo && (
                    <div className="relative col-span-2 aspect-[4/3] overflow-hidden bg-ink/10 md:col-span-5 md:col-start-8">
                      <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover" />
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </Container>
      )}

      <DeepSection aria-labelledby="support-next">
        <Container className="flex flex-col gap-6">
          <Eyebrow number="02" label="Next step" />
          <Headline id="support-next" text="Talk to us about backing a program" accentWord="backing" className="max-w-[18ch]" />
          <Text muted>
            Individuals, organisations and companies can support a specific program. Tell us which one and we will reply with
            the details.
          </Text>
          <div className="flex flex-wrap gap-4">
            {/* Online giving appears here once a donation link is switched on in site settings. */}
            {donationUrl && (
              <Button href={donationUrl} target="_blank" rel="noopener noreferrer">
                Give online
              </Button>
            )}
            <Button href="/contact" variant={donationUrl ? "secondary" : "primary"}>
              Get in touch
            </Button>
            <Button href="/partner" variant="text">
              Partner with us
            </Button>
          </div>
        </Container>
      </DeepSection>
    </>
  );
}
