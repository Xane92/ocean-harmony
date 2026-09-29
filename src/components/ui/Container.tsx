import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cx } from "@/lib/cx";

type ContainerProps<T extends ElementType> = {
  as?: T;
} & ComponentPropsWithoutRef<T>;

/** Page-width wrapper: max 1440px, fluid side padding from 20px to 64px. */
export function Container<T extends ElementType = "div">({
  as,
  className,
  ...rest
}: ContainerProps<T>) {
  const Tag: ElementType = as ?? "div";
  return (
    <Tag
      className={cx("mx-auto w-full max-w-page px-(--gutter)", className)}
      {...rest}
    />
  );
}

type GridProps<T extends ElementType> = {
  as?: T;
} & ComponentPropsWithoutRef<T>;

/**
 * 12-column grid. Children place themselves with col-span / col-start
 * utilities, usually full width on mobile (col-span-12) and narrower from md.
 */
export function Grid<T extends ElementType = "div">({
  as,
  className,
  ...rest
}: GridProps<T>) {
  const Tag: ElementType = as ?? "div";
  return (
    <Tag
      className={cx(
        "grid grid-cols-12 gap-x-4 gap-y-10 md:gap-x-6 lg:gap-x-8",
        className,
      )}
      {...rest}
    />
  );
}
