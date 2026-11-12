import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PhotoBlock } from "@/components/ui/PhotoBlock";
import { toPhoto } from "@/content/media";
import type { StoredImage } from "@/lib/supabase/types";
import { cx } from "@/lib/cx";

/** Photo essay grid: alternating wide and paired frames, captions set below, never overlaid. */
export function Gallery({ images, number = "02", label = "Photographs" }: { images: StoredImage[]; number?: string; label?: string }) {
  const photos = images.map((img, i) => ({ img, photo: toPhoto(img), i })).filter((p) => p.photo);
  if (photos.length === 0) return null;

  return (
    <Container as="section" aria-label={label} className="flex flex-col gap-10 py-16 md:py-24">
      <Eyebrow number={number} label={label} />
      <div className="grid grid-cols-12 gap-x-4 gap-y-10 md:gap-x-6 lg:gap-x-8">
        {photos.map(({ img, photo, i }) => {
          // Every third photo runs wide; the others sit in pairs.
          const wide = i % 3 === 0;
          return (
            <PhotoBlock
              key={img.path}
              src={photo!.src}
              alt={photo!.alt}
              caption={img.caption}
              credit={img.credit}
              ratio={wide ? "16:9" : "4:5"}
              sizes={wide ? "(min-width: 1440px) 1312px, 100vw" : "(min-width: 768px) 50vw, 100vw"}
              className={cx(wide ? "col-span-12" : "col-span-12 md:col-span-6")}
            />
          );
        })}
      </div>
    </Container>
  );
}
