// @admissions-compass/shared - Status Constants
// All status enums as const objects for runtime use

import type {
  ApplicationStatus,
  ChecklistItemStatus,
  ContractStatus,
  PaymentStatus,
  TuitionPaymentStatus,
  FormSubmissionStatus,
  RecommendationStatus,
  EventBookingStatus,
  WaitlistStatus,
  MessageStatus,
} from '../types/database';

// ─── Application Statuses ────────────────────────────────────────────────────

export const APPLICATION_STATUSES = {
  INQUIRY: 'inquiry',
  PROSPECT: 'prospect',
  STARTED: 'started',
  SUBMITTED: 'submitted',
  UNDER_REVIEW: 'under_review',
  WAITLISTED: 'waitlisted',
  ACCEPTED: 'accepted',
  DENIED: 'denied',
  DEFERRED: 'deferred',
  ENROLLED: 'enrolled',
  CONTRACT_SENT: 'contract_sent',
  CONTRACT_SIGNED: 'contract_signed',
  WITHDRAWN: 'withdrawn',
  DECLINED_OFFER: 'declined_offer',
} as const satisfies Record<string, ApplicationStatus>;

/** Ordered application status pipeline for funnel display */
export const APPLICATION_STATUS_ORDER: ApplicationStatus[] = [
  'inquiry',
  'prospect',
  'started',
  'submitted',
  'under_review',
  'waitlisted',
  'accepted',
  'denied',
  'deferred',
  'enrolled',
  'contract_sent',
  'contract_signed',
  'withdrawn',
  'declined_offer',
];

/** Human-readable labels for application statuses */
export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  inquiry: 'Inquiry',
  prospect: 'Prospect',
  started: 'Started',
  submitted: 'Submitted',
  under_review: 'Under Review',
  waitlisted: 'Waitlisted',
  accepted: 'Accepted',
  denied: 'Denied',
  deferred: 'Deferred',
  enrolled: 'Enrolled',
  contract_sent: 'Contract Sent',
  contract_signed: 'Contract Signed',
  withdrawn: 'Withdrawn',
  declined_offer: 'Declined Offer',
};

// ─── Checklist Item Statuses ─────────────────────────────────────────────────

export const CHECKLIST_ITEM_STATUSES = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  SUBMITTED: 'submitted',
  COMPLETED: 'completed',
  WAIVED: 'waived',
  OVERDUE: 'overdue',
} as const satisfies Record<string, ChecklistItemStatus>;

export const CHECKLIST_ITEM_STATUS_LABELS: Record<ChecklistItemStatus, string> = {
  not_started: 'Not Started',
  in_progress: 'In Progress',
  submitted: 'Submitted',
  completed: 'Completed',
  waived: 'Waived',
  overdue: 'Overdue',
};

// ─── Contract Statuses ───────────────────────────────────────────────────────

export const CONTRACT_STATUSES = {
  DRAFT: 'draft',
  SENT: 'sent',
  VIEWED: 'viewed',
  SIGNED_PRIMARY: 'signed_primary',
  SIGNED_BOTH: 'signed_both',
  COMPLETED: 'completed',
  VOIDED: 'voided',
} as const satisfies Record<string, ContractStatus>;

export const CONTRACT_STATUS_LABELS: Record<ContractStatus, string> = {
  draft: 'Draft',
  sent: 'Sent',
  viewed: 'Viewed',
  signed_primary: 'Signed (Primary)',
  signed_both: 'Signed (Both)',
  completed: 'Completed',
  voided: 'Voided',
};

// ─── Payment Statuses ────────────────────────────────────────────────────────

export const PAYMENT_STATUSES = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  PAID: 'paid',
  LATE: 'late',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const satisfies Record<string, PaymentStatus>;

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: 'Pending',
  processing: 'Processing',
  paid: 'Paid',
  late: 'Late',
  failed: 'Failed',
  refunded: 'Refunded',
};

// ─── Tuition Payment Statuses ────────────────────────────────────────────────

export const TUITION_PAYMENT_STATUSES = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  PAID: 'paid',
  LATE: 'late',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const satisfies Record<string, TuitionPaymentStatus>;

// ─── Form Submission Statuses ────────────────────────────────────────────────

export const FORM_SUBMISSION_STATUSES = {
  DRAFT: 'draft',
  IN_PROGRESS: 'in_progress',
  SUBMITTED: 'submitted',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  REVISION_REQUESTED: 'revision_requested',
} as const satisfies Record<string, FormSubmissionStatus>;

export const FORM_SUBMISSION_STATUS_LABELS: Record<FormSubmissionStatus, string> = {
  draft: 'Draft',
  in_progress: 'In Progress',
  submitted: 'Submitted',
  accepted: 'Accepted',
  rejected: 'Rejected',
  revision_requested: 'Revision Requested',
};

// ─── Recommendation Statuses ─────────────────────────────────────────────────

export const RECOMMENDATION_STATUSES = {
  PENDING: 'pending',
  SENT: 'sent',
  OPENED: 'opened',
  SUBMITTED: 'submitted',
  COMPLETED: 'completed',
  EXPIRED: 'expired',
} as const satisfies Record<string, RecommendationStatus>;

export const RECOMMENDATION_STATUS_LABELS: Record<RecommendationStatus, string> = {
  pending: 'Pending',
  sent: 'Sent',
  opened: 'Opened',
  submitted: 'Submitted',
  completed: 'Completed',
  expired: 'Expired',
};

// ─── Event Booking Statuses ──────────────────────────────────────────────────

export const EVENT_BOOKING_STATUSES = {
  BOOKED: 'booked',
  CONFIRMED: 'confirmed',
  ATTENDED: 'attended',
  NO_SHOW: 'no_show',
  CANCELLED: 'cancelled',
} as const satisfies Record<string, EventBookingStatus>;

export const EVENT_BOOKING_STATUS_LABELS: Record<EventBookingStatus, string> = {
  booked: 'Booked',
  confirmed: 'Confirmed',
  attended: 'Attended',
  no_show: 'No Show',
  cancelled: 'Cancelled',
};

// ─── Waitlist Statuses ───────────────────────────────────────────────────────

export const WAITLIST_STATUSES = {
  ACTIVE: 'active',
  OFFERED: 'offered',
  ACCEPTED: 'accepted',
  DECLINED: 'declined',
  EXPIRED: 'expired',
} as const satisfies Record<string, WaitlistStatus>;

export const WAITLIST_STATUS_LABELS: Record<WaitlistStatus, string> = {
  active: 'Active',
  offered: 'Offered',
  accepted: 'Accepted',
  declined: 'Declined',
  expired: 'Expired',
};

// ─── Message Statuses ────────────────────────────────────────────────────────

export const MESSAGE_STATUSES = {
  DRAFT: 'draft',
  QUEUED: 'queued',
  SENT: 'sent',
  DELIVERED: 'delivered',
  OPENED: 'opened',
  CLICKED: 'clicked',
  BOUNCED: 'bounced',
  FAILED: 'failed',
} as const satisfies Record<string, MessageStatus>;

export const MESSAGE_STATUS_LABELS: Record<MessageStatus, string> = {
  draft: 'Draft',
  queued: 'Queued',
  sent: 'Sent',
  delivered: 'Delivered',
  opened: 'Opened',
  clicked: 'Clicked',
  bounced: 'Bounced',
  failed: 'Failed',
};
