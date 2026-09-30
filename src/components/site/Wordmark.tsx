import Link from "next/link";
import { cx } from "@/lib/cx";

// Text placeholder until the client logo arrives. Swapping the logo means editing only this file.
export function Wordmark({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cx(
        "inline-flex min-h-11 items-center font-display text-[1.25rem] font-semibold tracking-[-0.02em] text-ink",
        className,
      )}
    >
      Ocean Harmony
      <span className="sr-only"> Initiative, home</span>
    </Link>
  );
}
