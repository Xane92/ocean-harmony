import Image, { type StaticImageData } from "next/image";
import { cx } from "@/lib/cx";

type Ratio = "3:2" | "4:5" | "16:9";

const ratioClass: Record<Ratio, string> = {
  "3:2": "aspect-[3/2]",
  "4:5": "aspect-[4/5]",
  "16:9": "aspect-video",
};

type ImageSource =
  | { src: string | StaticImageData; alt: string }
  /** No image yet: renders a neutral tone block (empty CMS field, previews). */
  | { src?: undefined; alt?: undefined };

type PhotoBlockProps = ImageSource & {
  ratio?: Ratio;
  /**
   * Edge to edge. Place the block outside <Container>; the caption stays
   * aligned to the page gutter.
   */
  fullBleed?: boolean;
  caption?: string;
  credit?: string;
  /** next/image sizes hint. Defaults to full viewport width. */
  sizes?: string;
  /** Only for the single above-the-fold hero image on a page. */
  priority?: boolean;
  className?: string;
};

/** Photograph with a mono caption and credit set below, never overlaid. */
export function PhotoBlock({
  src,
  alt,
  ratio = "3:2",
  fullBleed = false,
  caption,
  credit,
  sizes = "100vw",
  priority = false,
  className,
}: PhotoBlockProps) {
  const hasCaption = Boolean(caption || credit);

  return (
    <figure className={cx("w-full", className)}>
      <div className={cx("relative w-full overflow-hidden bg-ink/10", ratioClass[ratio])}>
        {src !== undefined && (
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            className="object-cover"
          />
        )}
      </div>
      {hasCaption && (
        <figcaption
          className={cx(
            "mt-3 flex flex-col gap-1 font-mono text-caption text-muted sm:flex-row sm:justify-between sm:gap-6",
            fullBleed && "px-(--gutter)",
          )}
        >
          {caption && <span>{caption}</span>}
          {credit && <span className="shrink-0">Photo: {credit}</span>}
        </figcaption>
      )}
    </figure>
  );
}
