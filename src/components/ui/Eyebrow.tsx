import { cx } from "@/lib/cx";

type EyebrowProps = {
  /** Section number, e.g. "01". Rendered in the surface accent colour. */
  number?: string;
  label: string;
  className?: string;
};

/** Mono eyebrow above headlines: "01 / Approach". Accent switches to Tide-light inside Deep. */
export function Eyebrow({ number, label, className }: EyebrowProps) {
  return (
    <p
      className={cx(
        "font-mono text-caption uppercase tracking-[0.14em] text-muted",
        className,
      )}
    >
      {number && (
        <>
          <span className="text-accent">{number}</span>
          <span aria-hidden="true"> / </span>
        </>
      )}
      {label}
    </p>
  );
}
