import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RichText } from "@/components/rich-text/RichText";
import { DetailHero } from "@/components/site/DetailHero";
import { Button } from "@/components/ui/Button";
import { Container, Grid } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { getOpportunity } from "@/content/collections";
import { formatDate, opportunityTypeLabels } from "@/content/labels";
import { pageMetadata } from "@/content/seo";
import { opportunityState } from "@/lib/opportunity";
import { cx } from "@/lib/cx";

export async function generateMetadata({ params }: PageProps<"/opportunities/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const o = await getOpportunity(slug);
  if (!o) return {};
  return pageMetadata({ path: `/opportunities/${o.slug}`, title: o.title, description: o.summary, seo: o.seo });
}

export default async function OpportunityPage({ params }: PageProps<"/opportunities/[slug]">) {
  const { slug } = await params;
  const o = await getOpportunity(slug);
  if (!o) notFound();

  const state = opportunityState(o.opens_on, o.closes_on);
  const canApply = state.open && Boolean(o.apply_url);

  const facts = [
    { label: "Status", value: state.label },
    { label: "Opens", value: formatDate(o.opens_on) },
    { label: "Closes", value: formatDate(o.closes_on) },
  ].filter((f) => f.value);

  return (
    <article>
      <DetailHero
        back={{ href: "/opportunities", label: "All opportunities" }}
        kicker={
          <>
            {opportunityTypeLabels[o.opportunity_type]}
            {o.place && (
              <>
                <span aria-hidden="true"> / </span>
                <Link href={`/places/${o.place.slug}`} className="underline decoration-line underline-offset-4 hover:decoration-accent">
                  {o.place.name}
                </Link>
              </>
            )}
          </>
        }
        title={o.title}
        intro={o.summary}
      />

      <Container className="pb-24 md:pb-32">
        <Grid className="border-t border-line pt-10 md:pt-14">
          <aside className="col-span-12 flex flex-col gap-8 md:col-span-4 lg:col-span-3">
            <dl className="flex flex-col divide-y divide-line border-y border-line">
              {facts.map((f) => (
                <div key={f.label} className="flex items-baseline justify-between gap-4 py-4">
                  <dt className="font-mono text-caption uppercase tracking-[0.14em] text-muted">{f.label}</dt>
                  <dd className={cx("flex items-center gap-2 font-mono text-caption uppercase tracking-[0.14em] text-ink")}>
                    {f.label === "Status" && (
                      <span aria-hidden="true" className={cx("size-2 rounded-full", state.open ? "bg-accent" : "border border-mist")} />
                    )}
                    {f.value}
                  </dd>
                </div>
              ))}
            </dl>
            {canApply ? (
              <Button href={o.apply_url!} target="_blank" rel="noopener noreferrer" className="self-start">
                Apply now
              </Button>
            ) : (
              <p className="text-body text-muted">
                {state.label === "Closed"
                  ? "Applications for this have closed."
                  : state.label === "Opening soon"
                    ? `Applications open ${formatDate(o.opens_on)}.`
                    : "The application link is coming soon."}
              </p>
            )}
          </aside>

          <div className="col-span-12 flex flex-col gap-12 md:col-span-8 md:col-start-5 lg:col-span-8 lg:col-start-5">
            {o.eligibility && (
              <section aria-label="Who can apply" className="flex flex-col gap-4">
                <Eyebrow number="01" label="Who can apply" />
                <p className="max-w-measure whitespace-pre-line text-body-lg text-ink">{o.eligibility}</p>
              </section>
            )}
            {o.body && (
              <section aria-label="Details" className="flex flex-col gap-4">
                <Eyebrow number={o.eligibility ? "02" : "01"} label="Details" />
                <RichText value={o.body} />
              </section>
            )}
          </div>
        </Grid>
      </Container>
    </article>
  );
}
