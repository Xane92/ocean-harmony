import type { ComponentPropsWithoutRef } from "react";
import { cx } from "@/lib/cx";

type DeepSectionProps = ComponentPropsWithoutRef<"section">;

/**
 * Dark editorial section: Deep background, Sand text. Surface colours
 * (accent, muted, line, focus ring) switch automatically for children.
 */
export function DeepSection({ className, ...rest }: DeepSectionProps) {
  return (
    <section
      data-surface="deep"
      className={cx("py-20 md:py-32", className)}
      {...rest}
    />
  );
}
