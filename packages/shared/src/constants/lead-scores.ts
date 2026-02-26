// @admissions-compass/shared - Lead Score Constants
// Lead score rules from spec Appendix C

// ─── Lead Score Event Types ──────────────────────────────────────────────────

export type LeadScoreEvent =
  | 'inquiry_submitted'
  | 'attended_open_house'
  | 'scheduled_campus_tour'
  | 'attended_campus_tour'
  | 'started_application'
  | 'submitted_application'
  | 'sibling_enrolled'
  | 'legacy_family'
  | 'referred_by_family'
  | 'opened_3_emails'
  | 'visited_portal_3_times'
  | 'attended_shadow_day';

// ─── Lead Score Rules ────────────────────────────────────────────────────────

/**
 * Points awarded for each lead score event.
 * Higher scores indicate stronger engagement and conversion likelihood.
 */
export const LEAD_SCORE_RULES: Record<LeadScoreEvent, number> = {
  inquiry_submitted: 5,
  attended_open_house: 10,
  scheduled_campus_tour: 5,
  attended_campus_tour: 10,
  started_application: 10,
  submitted_application: 15,
  sibling_enrolled: 15,
  legacy_family: 10,
  referred_by_family: 10,
  opened_3_emails: 5,
  visited_portal_3_times: 5,
  attended_shadow_day: 15,
} as const;

// ─── Lead Score Labels ───────────────────────────────────────────────────────

/** Human-readable labels for lead score events */
export const LEAD_SCORE_EVENT_LABELS: Record<LeadScoreEvent, string> = {
  inquiry_submitted: 'Inquiry Submitted',
  attended_open_house: 'Attended Open House',
  scheduled_campus_tour: 'Scheduled Campus Tour',
  attended_campus_tour: 'Attended Campus Tour',
  started_application: 'Started Application',
  submitted_application: 'Submitted Application',
  sibling_enrolled: 'Sibling Currently Enrolled',
  legacy_family: 'Legacy Family',
  referred_by_family: 'Referred by Current Family',
  opened_3_emails: 'Opened 3+ Emails',
  visited_portal_3_times: 'Visited Portal 3+ Times',
  attended_shadow_day: 'Attended Shadow Day',
};

// ─── Lead Score Tiers ────────────────────────────────────────────────────────

export interface LeadScoreTier {
  label: string;
  min: number;
  max: number;
  color: string;
}

/** Lead score tier definitions for display purposes */
export const LEAD_SCORE_TIERS: LeadScoreTier[] = [
  { label: 'Cold', min: 0, max: 9, color: '#94A3B8' },
  { label: 'Warm', min: 10, max: 29, color: '#F59E0B' },
  { label: 'Hot', min: 30, max: 59, color: '#F97316' },
  { label: 'Very Hot', min: 60, max: Infinity, color: '#EF4444' },
];

/**
 * Get the lead score tier for a given score.
 *
 * @param score - The lead score to evaluate
 * @returns The matching lead score tier
 */
export function getLeadScoreTier(score: number): LeadScoreTier {
  const tier = LEAD_SCORE_TIERS.find((t) => score >= t.min && score <= t.max);
  return tier ?? LEAD_SCORE_TIERS[0];
}

/**
 * Calculate a total lead score from a list of events.
 *
 * @param events - Array of lead score events that have occurred
 * @returns The total lead score
 */
export function calculateLeadScore(events: LeadScoreEvent[]): number {
  return events.reduce((total, event) => total + LEAD_SCORE_RULES[event], 0);
}
