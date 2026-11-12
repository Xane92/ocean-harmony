import "server-only";
import { cache } from "react";
import { socials as fallbackSocials, whatsappHref, type NavItem } from "@/lib/site";
import { publicClient } from "@/lib/supabase/public";
import type { SiteSettingsRow } from "@/lib/supabase/types";

export type SiteSettings = {
  socials: NavItem[];
  whatsapp: string | null;
  closingLine: { text: string; accentWord?: string; fromCms: boolean };
};

const fallback: SiteSettings = {
  socials: fallbackSocials,
  whatsapp: whatsappHref(),
  closingLine: { text: "Stay close to the shore", accentWord: "shore", fromCms: false },
};

/** Site-wide settings edited in /admin/settings, with the current hardcoded values as fallback. */
export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const db = publicClient(["site_settings"]);
  if (!db) return fallback;
  const { data, error } = await db.from("site_settings").select("*").eq("id", 1).maybeSingle<SiteSettingsRow>();
  if (error || !data) {
    if (error) console.error("Site settings: Supabase fetch failed, using fallback.", error);
    return fallback;
  }

  const digits = data.whatsapp_number?.replace(/\D/g, "");
  const socials = (data.socials ?? [])
    .filter((s) => s?.platform && /^https?:\/\//.test(s.url ?? ""))
    .map((s) => ({ label: s.platform, href: s.url }));

  return {
    socials: socials.length > 0 ? socials : fallback.socials,
    whatsapp: digits ? `https://wa.me/${digits}` : fallback.whatsapp,
    closingLine: data.footer_closing_line
      ? { text: data.footer_closing_line, accentWord: data.footer_accent_word ?? undefined, fromCms: true }
      : fallback.closingLine,
  };
});
