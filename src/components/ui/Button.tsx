import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cx } from "@/lib/cx";

type Variant = "primary" | "secondary" | "text";

type CommonProps = {
  variant?: Variant;
  children: ReactNode;
  className?: string;
};

type AsLink = CommonProps & { href: string } & Omit<
    ComponentPropsWithoutRef<typeof Link>,
    "href" | "className" | "children"
  >;

type AsButton = CommonProps & { href?: undefined } & Omit<
    ComponentPropsWithoutRef<"button">,
    "className" | "children"
  >;

export type ButtonProps = AsLink | AsButton;

const base =
  "group inline-flex min-h-11 items-center justify-center gap-2 font-display font-semibold text-body transition-colors duration-200 disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  // Tide fill with Sand text on Sand; Tide-light fill with Deep text inside Deep.
  primary: "bg-accent px-6 text-on-accent hover:bg-ink hover:text-surface",
  secondary: "border border-ink px-6 text-ink hover:bg-ink hover:text-surface",
  text: "text-ink underline decoration-accent decoration-1 underline-offset-[6px] hover:decoration-2",
};

function Arrow() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="size-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M2 8h11M9 4l4 4-4 4" />
    </svg>
  );
}

/** Primary, secondary or text-link action. Renders a Link when `href` is set, otherwise a button. */
export function Button(props: ButtonProps) {
  const { variant = "primary", children, className } = props;
  const classes = cx(base, variants[variant], className);
  const content = (
    <>
      {children}
      {variant === "text" && <Arrow />}
    </>
  );

  if (props.href !== undefined) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { variant: _v, children: _c, className: _cn, href, ...rest } = props;
    return (
      <Link href={href} className={classes} {...rest}>
        {content}
      </Link>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { variant: _v, children: _c, className: _cn, type = "button", ...rest } = props;
  return (
    <button type={type} className={classes} {...rest}>
      {content}
    </button>
  );
}
