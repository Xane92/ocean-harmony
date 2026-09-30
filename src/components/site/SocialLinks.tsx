import { socials } from "@/lib/site";
import { cx } from "@/lib/cx";

export function SocialLinks({ className }: { className?: string }) {
  return (
    <ul className={cx("flex flex-wrap gap-x-6 gap-y-2", className)}>
      {socials.map((item) => (
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
