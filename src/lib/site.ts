// Site-wide navigation and links. Socials and WhatsApp move to Sanity siteSettings in Phase 3.

export type NavItem = { label: string; href: string };

export const primaryNav: NavItem[] = [
  { label: "Approach", href: "/approach" },
  { label: "Places", href: "/places" },
  { label: "Explore", href: "/explore" },
  { label: "Stories", href: "/stories" },
  { label: "Opportunities", href: "/opportunities" },
  { label: "About", href: "/about" },
];

export const supportLink: NavItem = { label: "Support", href: "/support" };
export const partnerLink: NavItem = { label: "Partner With Us", href: "/partner" };
export const contactLink: NavItem = { label: "Contact", href: "/contact" };

export const socials: NavItem[] = [
  { label: "Instagram", href: "https://www.instagram.com/ocean_harmony_project" },
  { label: "Facebook", href: "https://www.facebook.com/share/17gLhwNY4V/" },
];

/** wa.me link from NEXT_PUBLIC_WHATSAPP_NUMBER (digits only, international format), or null. */
export function whatsappHref(): string | null {
  const digits = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : null;
}

export function isActivePath(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}
