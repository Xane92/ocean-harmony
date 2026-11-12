import type { OpportunityType, PartnerRow, PlaceRow, StoryType } from "@/lib/supabase/types";

// Readable labels for stored values. Mirrors the select options in src/admin/schema.ts.

export const storyTypeLabels: Record<StoryType, string> = {
  field_story: "Field story",
  community_voice: "Community voice",
  photo_essay: "Photo essay",
  video: "Video",
};

export const placeStatusLabels: Record<PlaceRow["place_status"], string> = {
  active: "Active",
  upcoming: "Upcoming",
  past: "Past",
};

export const opportunityTypeLabels: Record<OpportunityType, string> = {
  volunteer: "Volunteer",
  fellowship: "Fellowship",
  internship: "Internship",
  program: "Program",
};

export const partnerTypeLabels: Record<PartnerRow["partner_type"], string> = {
  school: "School",
  university: "University",
  funder: "Funder",
  ngo: "NGO",
  community: "Community",
  government: "Government",
  other: "Partner",
};

/** "2026-03-04" to "4 Mar 2026". Dates are whole days, so format in UTC. */
export function formatDate(date: string | null | undefined): string {
  if (!date) return "";
  const d = new Date(`${date.slice(0, 10)}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}

/** "Mar 2026 to Jun 2026", or a single end when only one date is set. */
export function formatRange(start: string | null, end: string | null): string {
  const s = formatDate(start);
  const e = formatDate(end);
  if (s && e) return `${s} to ${e}`;
  return s || e;
}
