import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

type TextSize = "body-lg" | "body" | "caption";

type TextProps = {
  size?: TextSize;
  /** Secondary text colour (mist-ink on Sand, soft Sand inside Deep). */
  muted?: boolean;
  children: ReactNode;
  className?: string;
};

const sizeClass: Record<TextSize, string> = {
  "body-lg": "text-body-lg",
  body: "text-body",
  caption: "font-mono text-caption",
};

/** Raleway paragraph on the fluid scale, capped at a 68ch measure. */
export function Text({ size = "body", muted = false, children, className }: TextProps) {
  return (
    <p
      className={cx(
        "max-w-measure",
        sizeClass[size],
        muted ? "text-muted" : "text-ink",
        className,
      )}
    >
      {children}
    </p>
  );
}
