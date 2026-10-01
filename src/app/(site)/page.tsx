import type { Metadata } from "next";
import { Approach } from "@/components/home/Approach";
import { Explore } from "@/components/home/Explore";
import { FieldStories } from "@/components/home/FieldStories";
import { Hero } from "@/components/home/Hero";
import { OnAir } from "@/components/home/OnAir";
import { Opportunities } from "@/components/home/Opportunities";
import { Places } from "@/components/home/Places";
import { Statement } from "@/components/home/Statement";
import { SupportPartner } from "@/components/home/SupportPartner";
import { Reveal } from "@/components/ui/Reveal";
import { getHomeContent } from "@/content/home";
import { urlFor } from "@/sanity/image";

export async function generateMetadata(): Promise<Metadata> {
  const { content, seo } = await getHomeContent();
  const ogImage = seo?.image?.asset
    ? urlFor(seo.image).width(1200).height(630).fit("crop").url()
    : content.hero.photo?.src;

  return {
    title: { absolute: seo?.title ?? "Ocean Harmony Initiative" },
    description: seo?.description ?? content.hero.intro,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      url: "/",
      images: ogImage ? [{ url: ogImage, alt: seo?.image?.alt ?? content.hero.photo?.alt }] : undefined,
    },
  };
}

export default async function Home() {
  const { content } = await getHomeContent();

  return (
    <>
      <Reveal>
        <Hero hero={content.hero} />
      </Reveal>
      <Reveal>
        <Statement statement={content.statement} />
      </Reveal>
      <Reveal>
        <Approach approach={content.approach} />
      </Reveal>
      <Reveal>
        <Places places={content.places} />
      </Reveal>
      <Reveal>
        <Explore explore={content.explore} />
      </Reveal>
      <Reveal>
        <FieldStories stories={content.stories} />
      </Reveal>
      <Reveal>
        <OnAir onAir={content.onAir} />
      </Reveal>
      <Reveal>
        <Opportunities opportunities={content.opportunities} />
      </Reveal>
      <Reveal>
        <SupportPartner cta={content.cta} />
      </Reveal>
    </>
  );
}
