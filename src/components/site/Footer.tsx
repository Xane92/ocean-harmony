import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container, Grid } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Headline } from "@/components/ui/Headline";
import { Rule } from "@/components/ui/Rule";
import { contactLink, partnerLink, primaryNav, supportLink, whatsappHref, type NavItem } from "@/lib/site";
import { SocialLinks } from "./SocialLinks";
import { Wordmark } from "./Wordmark";

const byHref = (href: string) => primaryNav.find((item) => item.href === href) as NavItem;

const columns: { title: string; links: NavItem[] }[] = [
  {
    title: "Explore",
    links: [byHref("/approach"), byHref("/places"), byHref("/explore"), byHref("/stories")],
  },
  {
    title: "Get involved",
    links: [byHref("/opportunities"), partnerLink, supportLink],
  },
];

const linkClass =
  "inline-flex min-h-11 items-center text-ink underline decoration-transparent underline-offset-[6px] hover:decoration-accent";

export function Footer() {
  const whatsapp = whatsappHref();
  const year = new Date().getFullYear();

  return (
    <footer data-surface="deep" data-shell-inert className="pt-20 pb-10 md:pt-32">
      <Container className="flex flex-col gap-16 md:gap-24">
        <div className="flex flex-col gap-8">
          <Eyebrow label="[PLACEHOLDER] Closing line" />
          <Headline level={2} size="h1" text="Stay close to the shore" accentWord="shore" className="max-w-[18ch]" />
          <div className="flex flex-wrap gap-4">
            <Button href={partnerLink.href}>{partnerLink.label}</Button>
            <Button href={supportLink.href} variant="secondary">
              {supportLink.label}
            </Button>
          </div>
        </div>

        <Rule />

        <Grid as="nav" aria-label="Footer">
          <div className="col-span-12 md:col-span-4">
            <Wordmark />
          </div>
          {columns.map((column) => (
            <div key={column.title} className="col-span-6 md:col-span-2">
              <h2 className="font-mono text-caption uppercase tracking-[0.14em] text-muted">{column.title}</h2>
              <ul className="mt-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={linkClass}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="col-span-12 md:col-span-4">
            <h2 className="font-mono text-caption uppercase tracking-[0.14em] text-muted">Contact</h2>
            <ul className="mt-3">
              <li>
                <Link href={contactLink.href} className={linkClass}>
                  Contact page
                </Link>
              </li>
              <li>
                {whatsapp ? (
                  <a href={whatsapp} rel="noopener noreferrer" className={linkClass}>
                    WhatsApp
                  </a>
                ) : (
                  <span className="inline-flex min-h-11 items-center text-muted">
                    WhatsApp [PLACEHOLDER: number]
                  </span>
                )}
              </li>
            </ul>
            <SocialLinks className="mt-6" />
          </div>
        </Grid>

        <Rule />

        <p className="font-mono text-caption text-muted">
          © {year} Ocean Harmony Initiative
        </p>
      </Container>
    </footer>
  );
}
