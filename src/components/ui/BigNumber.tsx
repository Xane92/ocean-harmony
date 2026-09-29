import { cx } from "@/lib/cx";

type BigNumberProps = {
  /** The figure as it should read, e.g. "2019" or "04". Only real client numbers. */
  value: string;
  label: string;
  className?: string;
};

/** Huge Instrument Sans figure anchoring a section, with a short mono label under it. */
export function BigNumber({ value, label, className }: BigNumberProps) {
  return (
    <div className={cx("flex flex-col gap-3", className)}>
      <p className="font-display text-figure font-medium tabular-nums text-ink">{value}</p>
      <p className="font-mono text-caption uppercase tracking-[0.14em] text-muted">{label}</p>
    </div>
  );
}
