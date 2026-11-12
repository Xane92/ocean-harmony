import { socials, type NavItem } from "@/lib/site";
import { cx } from "@/lib/cx";

/** Defaults to the built-in links; the footer passes the ones from site settings. */
export function SocialLinks({ className, items = socials }: { className?: string; items?: NavItem[] }) {
  return (
    <ul className={cx("flex flex-wrap gap-x-6 gap-y-2", className)}>
      {items.map((item) => (
        <li key={item.href}>
          <a
            href={item.href}
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center font-mono text-caption uppercase tracking-[0.14em] text-ink underline decoration-line underline-offset-[6px] hover:decoration-accent"
          >
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
