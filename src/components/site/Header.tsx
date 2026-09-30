"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { cx } from "@/lib/cx";
import { isActivePath, primaryNav, supportLink } from "@/lib/site";
import { SocialLinks } from "./SocialLinks";
import { Wordmark } from "./Wordmark";

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollHidden, setScrollHidden] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Rule after 8px; hide on scroll down, return on scroll up.
  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;
    const update = () => {
      ticking = false;
      const y = window.scrollY;
      setScrolled(y > 8);
      if (y < 80 || y < lastY - 4) setScrollHidden(false);
      else if (y > lastY + 4) setScrollHidden(true);
      if (Math.abs(y - lastY) > 4) lastY = y;
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    requestAnimationFrame(update);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu when the viewport reaches desktop width.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Open menu: lock scroll, make the page inert, trap focus, Esc closes.
  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const previousOverflow = html.style.overflow;
    html.style.overflow = "hidden";
    const outside = document.querySelectorAll<HTMLElement>("[data-shell-inert]");
    outside.forEach((el) => (el.inert = true));

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (event.key !== "Tab") return;
      const focusables = [
        ...(headerRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []),
        ...(menuRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []),
      ].filter((el) => el.offsetParent !== null);
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      html.style.overflow = previousOverflow;
      outside.forEach((el) => (el.inert = false));
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const hidden = scrollHidden && !open && !focusWithin;

  return (
    <>
      <header
        ref={headerRef}
        data-surface={open ? "deep" : undefined}
        onFocus={() => setFocusWithin(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            setFocusWithin(false);
          }
        }}
        className={cx(
          "sticky top-0 z-50 border-b bg-surface transition-transform duration-300 ease-out motion-reduce:transition-none",
          scrolled && !open ? "border-line" : "border-transparent",
          hidden && "-translate-y-full",
        )}
      >
        <div className="mx-auto flex h-16 w-full max-w-page items-center justify-between gap-6 px-(--gutter) lg:h-20">
          <Wordmark />

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-7 xl:gap-9">
              {primaryNav.map((item) => {
                const active = isActivePath(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cx(
                        "inline-flex min-h-11 items-center font-display text-[0.9375rem] font-semibold text-ink underline-offset-8",
                        active
                          ? "underline decoration-accent decoration-2"
                          : "hover:underline hover:decoration-line hover:decoration-2",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-4">
            <Button href={supportLink.href} className="hidden lg:inline-flex">
              {supportLink.label}
            </Button>
            <button
              ref={toggleRef}
              type="button"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((value) => !value)}
              className="inline-flex min-h-11 min-w-11 items-center justify-center gap-3 font-mono text-caption uppercase tracking-[0.14em] text-ink lg:hidden"
            >
              <span>{open ? "Close" : "Menu"}</span>
              <span aria-hidden="true" className="relative block h-3 w-5">
                <span
                  className={cx(
                    "absolute left-0 h-px w-5 bg-current transition-transform duration-200 motion-reduce:transition-none",
                    open ? "top-1.5 rotate-45" : "top-0",
                  )}
                />
                <span
                  className={cx(
                    "absolute left-0 h-px w-5 bg-current transition-transform duration-200 motion-reduce:transition-none",
                    open ? "top-1.5 -rotate-45" : "top-3",
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      <div
        ref={menuRef}
        id="mobile-menu"
        data-surface="deep"
        className={cx(
          "fixed inset-0 z-40 overflow-y-auto pt-16 transition-[opacity,visibility] duration-200 motion-reduce:transition-none lg:hidden",
          open ? "visible opacity-100" : "invisible opacity-0",
        )}
      >
        <div className="flex min-h-full flex-col justify-between gap-12 px-(--gutter) pt-10 pb-10">
          <nav aria-label="Menu">
            <ol className="flex flex-col">
              {primaryNav.map((item, index) => {
                const active = isActivePath(pathname, item.href);
                return (
                  <li key={item.href} className="border-b border-line">
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      onClick={() => setOpen(false)}
                      className="flex min-h-11 items-baseline gap-4 py-3"
                    >
                      <span className="w-6 font-mono text-caption text-accent">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={cx(
                          "font-display text-h2 font-medium text-ink",
                          active && "underline decoration-accent decoration-2 underline-offset-8",
                        )}
                      >
                        {item.label}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </nav>

          <div className="flex flex-col gap-6">
            <Button href={supportLink.href} onClick={() => setOpen(false)} className="w-full sm:w-auto sm:self-start">
              {supportLink.label}
            </Button>
            <SocialLinks />
          </div>
        </div>
      </div>
    </>
  );
}
