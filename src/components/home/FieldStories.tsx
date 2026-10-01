import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { marked } from "@/components/ui/Marked";
import { cx } from "@/lib/cx";
import type { HomeContent, HomeStory } from "@/content/fallback";
import { SectionHeading } from "./SectionHeading";

// Asymmetric placement for up to three stories: a tall lead, then two offset beside it.
const layout = [
  { item: "col-span-12 lg:col-span-7 lg:row-span-2", frame: "aspect-[4/5]", sizes: "(min-width: 1024px) 56vw, 100vw" },
  { item: "col-span-12 sm:col-span-6 lg:col-span-5 lg:col-start-8", frame: "aspect-[3/2]", sizes: "(min-width: 1024px) 38vw, (min-width: 640px) 50vw, 100vw" },
  { item: "col-span-12 sm:col-span-6 lg:col-span-4 lg:col-start-9 lg:mt-8", frame: "aspect-[3/2]", sizes: "(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw" },
];

function StoryItem({ story, index }: { story: HomeStory; index: number }) {
  const slot = layout[index] ?? layout[2];
  const lead = index === 0;

  return (
    <article className={cx("group relative flex flex-col gap-4", slot.item)}>
      <div className={cx("relative w-full overflow-hidden bg-ink/10", slot.frame)}>
        {story.photo && (
          <Image
            src={story.photo.src}
            alt={story.photo.alt}
            fill
            sizes={slot.sizes}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            style={{ objectPosition: story.photo.position }}
          />
        )}
      </div>
      <p className="font-mono text-caption uppercase tracking-[0.14em] text-muted">
        <span className="text-accent">{story.kind}</span>
        {story.place && (
          <>
            <span aria-hidden="true"> / </span>
            {marked(story.place)}
          </>
        )}
      </p>
      <h3 className={cx("max-w-[24ch] font-display font-medium text-ink", lead ? "text-h2" : "text-h3")}>
        <Link
          href={story.href}
          className="underline decoration-transparent decoration-1 underline-offset-[6px] after:absolute after:inset-0 group-hover:decoration-accent"
        >
          {marked(story.title)}
        </Link>
      </h3>
    </article>
  );
}

/** Up to three field stories in an asymmetric photo layout. */
export function FieldStories({ stories }: { stories: HomeContent["stories"] }) {
  return (
    <section aria-labelledby="home-stories" className="border-t border-line">
      <Container className="py-24 md:py-40">
        <SectionHeading
          id="home-stories"
          number="05"
          eyebrow={stories.eyebrow}
          headline={stories.headline}
          accentWord={stories.accentWord}
          link={stories.link}
        />
        <div className="mt-12 grid grid-cols-12 gap-x-4 gap-y-12 md:mt-16 md:gap-x-6 lg:gap-x-8 lg:gap-y-10">
          {stories.items.slice(0, 3).map((story, i) => (
            <StoryItem key={`${story.href}-${i}`} story={story} index={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}
