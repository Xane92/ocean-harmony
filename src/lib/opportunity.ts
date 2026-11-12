import { CLOSING_SOON_DAYS } from "./constants";

export type OpportunityState = { label: "Opening soon" | "Open" | "Closing soon" | "Closed"; open: boolean };

const DAY = 86_400_000;

/** Status is never stored; it comes from the dates. Dates are whole days (YYYY-MM-DD, UTC). */
export function opportunityState(opensOn: string | null, closesOn: string | null, now = new Date()): OpportunityState {
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const opens = opensOn ? Date.parse(opensOn) : null;
  const closes = closesOn ? Date.parse(closesOn) : null;

  if (opens !== null && opens > today) return { label: "Opening soon", open: false };
  if (closes !== null && closes < today) return { label: "Closed", open: false };
  if (closes !== null && closes - today <= CLOSING_SOON_DAYS * DAY) return { label: "Closing soon", open: true };
  return { label: "Open", open: true };
}
