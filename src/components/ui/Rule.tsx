import { cx } from "@/lib/cx";

type RuleProps = {
  /** Optional mono label sitting on the line. */
  label?: string;
  className?: string;
};

/** 1px hairline in the surface rule colour. */
export function Rule({ label, className }: RuleProps) {
  if (!label) {
    return <hr className={cx("border-0 border-t border-line", className)} />;
  }

  return (
    <div className={cx("flex items-center gap-4", className)}>
      <span className="font-mono text-caption uppercase tracking-[0.14em] text-muted">
        {label}
      </span>
      <span aria-hidden="true" className="h-px flex-1 bg-line" />
    </div>
  );
}
