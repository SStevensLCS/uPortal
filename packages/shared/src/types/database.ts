// @admissions-compass/shared - Database Types
// TypeScript interfaces for all database tables

// ─── Enums / Union Types ─────────────────────────────────────────────────────

export type SchoolType =
  | 'independent'
  | 'charter'
  | 'parochial'
  | 'montessori'
  | 'waldorf'
  | 'boarding'
  | 'day'
  | 'online'
  | 'hybrid'
  | 'other';

export type UserType =
  | 'parent'
  | 'staff'
  | 'system_admin';

export type StaffRole =
  | 'system_admin'
  | 'admin'
  | 'user'
  | 'limited_user'
  | 'reviewer';

export type HouseholdMemberRelationship =
  | 'mother'
  | 'father'
  | 'stepmother'
  | 'stepfather'
  | 'grandmother'
  | 'grandfather'
  | 'aunt'
  | 'uncle'
  | 'guardian'
  | 'other';

export type StudentGender =
  | 'male'
  | 'female'
  | 'non_binary'
  | 'prefer_not_to_say'
  | 'other';

export type ApplicationType =
  | 'standard'
  | 'early_decision'
  | 'early_action'
  | 'rolling'
  | 'transfer'
  | 'international'
  | 'financial_aid'
  | 'scholarship';

export type ApplicationStatus =
  | 'inquiry'
  | 'prospect'
  | 'started'
  | 'submitted'
  | 'under_review'
  | 'waitlisted'
  | 'accepted'
  | 'denied'
  | 'deferred'
  | 'enrolled'
  | 'contract_sent'
  | 'contract_signed'
  | 'withdrawn'
  | 'declined_offer';

export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'paid'
  | 'late'
  | 'failed'
  | 'refunded';

export type ChecklistItemType =
  | 'document_upload'
  | 'form_submission'
  | 'recommendation'
  | 'interview'
  | 'assessment'
  | 'payment'
  | 'event_attendance'
  | 'custom';

export type ChecklistItemStatus =
  | 'not_started'
  | 'in_progress'
  | 'submitted'
  | 'completed'
  | 'waived'
  | 'overdue';

export type FormType =
  | 'inquiry'
  | 'application'
  | 'recommendation'
  | 'supplemental'
  | 'financial_aid'
  | 'enrollment'
  | 'evaluation'
  | 'custom';

export type FormSubmissionStatus =
  | 'draft'
  | 'in_progress'
  | 'submitted'
  | 'accepted'
  | 'rejected'
  | 'revision_requested';

export type RecommendationStatus =
  | 'pending'
  | 'sent'
  | 'opened'
  | 'submitted'
  | 'completed'
  | 'expired';

export type EventType =
  | 'open_house'
  | 'campus_tour'
  | 'shadow_day'
  | 'interview'
  | 'assessment'
  | 'orientation'
  | 'information_session'
  | 'custom';

export type EventBookingStatus =
  | 'booked'
  | 'confirmed'
  | 'attended'
  | 'no_show'
  | 'cancelled';

export type DecisionType =
  | 'accepted'
  | 'denied'
  | 'waitlisted'
  | 'deferred';

export type ContractStatus =
  | 'draft'
  | 'sent'
  | 'viewed'
  | 'signed_primary'
  | 'signed_both'
  | 'completed'
  | 'voided';

export type TuitionPaymentStatus =
  | 'pending'
  | 'processing'
  | 'paid'
  | 'late'
  | 'failed'
  | 'refunded';

export type MessageChannel =
  | 'email'
  | 'sms'
  | 'in_app'
  | 'push';

export type MessageStatus =
  | 'draft'
  | 'queued'
  | 'sent'
  | 'delivered'
  | 'opened'
  | 'clicked'
  | 'bounced'
  | 'failed';

export type DocumentCategory =
  | 'transcript'
  | 'recommendation'
  | 'test_score'
  | 'identification'
  | 'medical'
  | 'financial'
  | 'photo'
  | 'contract'
  | 'other';

export type WaitlistStatus =
  | 'active'
  | 'offered'
  | 'accepted'
  | 'declined'
  | 'expired';

export type AuditAction =
  | 'create'
  | 'update'
  | 'delete'
  | 'login'
  | 'logout'
  | 'status_change'
  | 'decision_made'
  | 'email_sent'
  | 'document_uploaded'
  | 'payment_received'
  | 'contract_signed'
  | 'impersonation_start'
  | 'impersonation_end';

// ─── Supporting / Embedded Types ─────────────────────────────────────────────

export interface SchoolAddress {
  street: string;
  street2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface Division {
  name: string;
  grade_levels: string[];
}

export interface DueDateRule {
  type: 'fixed' | 'relative_to_submission' | 'relative_to_start';
  days_offset?: number;
  fixed_date?: string;
}

// ─── Schools ─────────────────────────────────────────────────────────────────

export interface School {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  website_url: string | null;
  address: SchoolAddress | null;
  phone: string | null;
  timezone: string;
  currency: string;
  school_type: SchoolType;
  grade_levels: string[];
  divisions: Division[] | null;
  settings: Record<string, unknown>;
  subscription_tier: string;
  stripe_account_id: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface SchoolGroup {
  id: string;
  name: string;
  description: string | null;
  settings: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface SchoolGroupMember {
  id: string;
  group_id: string;
  school_id: string;
  created_at: string;
}

export interface EnrollmentSeason {
  id: string;
  school_id: string;
  name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  settings: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

// ─── Users & Profiles ────────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  preferred_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  user_type: UserType;
  email_verified: boolean;
  last_login_at: string | null;
  settings: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface SchoolStaff {
  id: string;
  school_id: string;
  user_id: string;
  role: StaffRole;
  title: string | null;
  department: string | null;
  permissions: Record<string, boolean>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ─── Households ──────────────────────────────────────────────────────────────

export interface Household {
  id: string;
  school_id: string;
  name: string;
  address: SchoolAddress | null;
  phone: string | null;
  lead_score: number;
  source: string | null;
  tags: string[];
  notes: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface HouseholdMember {
  id: string;
  household_id: string;
  user_id: string;
  relationship: HouseholdMemberRelationship;
  is_primary: boolean;
  created_at: string;
}

// ─── Students ────────────────────────────────────────────────────────────────

export interface Student {
  id: string;
  household_id: string;
  first_name: string;
  last_name: string;
  preferred_name: string | null;
  date_of_birth: string | null;
  gender: StudentGender | null;
  current_school: string | null;
  current_grade: string | null;
  photo_url: string | null;
  medical_info: Record<string, unknown>;
  additional_info: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface SiblingLink {
  id: string;
  student_id: string;
  sibling_id: string;
  relationship: string;
  created_at: string;
}

// ─── Applications ────────────────────────────────────────────────────────────

export interface Application {
  id: string;
  school_id: string;
  season_id: string;
  student_id: string;
  household_id: string;
  application_type: ApplicationType;
  applying_for_grade: string;
  status: ApplicationStatus;
  submitted_at: string | null;
  decision: DecisionType | null;
  decision_at: string | null;
  decision_released_at: string | null;
  decision_notes: string | null;
  internal_notes: string | null;
  lead_score: number;
  custom_fields: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface ApplicationPayment {
  id: string;
  application_id: string;
  amount: number;
  currency: string;
  payment_type: string;
  status: PaymentStatus;
  stripe_payment_intent_id: string | null;
  paid_at: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

// ─── Checklists ──────────────────────────────────────────────────────────────

export interface ChecklistTemplate {
  id: string;
  school_id: string;
  season_id: string | null;
  name: string;
  stage: ApplicationStatus;
  grade_levels: string[];
  application_types: ApplicationType[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ChecklistTemplateItem {
  id: string;
  template_id: string;
  title: string;
  description: string | null;
  item_type: ChecklistItemType;
  is_required: boolean;
  sort_order: number;
  config: Record<string, unknown>;
  due_date_rule: DueDateRule | null;
  created_at: string;
  updated_at: string;
}

export interface ChecklistItem {
  id: string;
  application_id: string;
  template_item_id: string | null;
  title: string;
  description: string | null;
  item_type: ChecklistItemType;
  is_required: boolean;
  sort_order: number;
  status: ChecklistItemStatus;
  due_date: string | null;
  completed_at: string | null;
  completed_by: string | null;
  config: Record<string, unknown>;
  data: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

// ─── Forms ───────────────────────────────────────────────────────────────────

export interface FormDefinition {
  id: string;
  school_id: string;
  name: string;
  description: string | null;
  form_type: FormType;
  schema: Record<string, unknown>;
  ui_schema: Record<string, unknown>;
  settings: Record<string, unknown>;
  version: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface FormSubmission {
  id: string;
  form_definition_id: string;
  application_id: string | null;
  submitted_by: string;
  data: Record<string, unknown>;
  status: FormSubmissionStatus;
  submitted_at: string | null;
  reviewed_at: string | null;
  reviewed_by: string | null;
  review_notes: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Recommendations ─────────────────────────────────────────────────────────

export interface RecommendationRequest {
  id: string;
  application_id: string;
  form_definition_id: string | null;
  recommender_name: string;
  recommender_email: string;
  recommender_title: string | null;
  recommender_relationship: string | null;
  status: RecommendationStatus;
  token: string;
  sent_at: string | null;
  opened_at: string | null;
  submitted_at: string | null;
  expires_at: string | null;
  response_data: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

// ─── Events & Scheduling ────────────────────────────────────────────────────

export interface EventCalendar {
  id: string;
  school_id: string;
  season_id: string | null;
  name: string;
  description: string | null;
  event_type: EventType;
  location: string | null;
  virtual_url: string | null;
  is_active: boolean;
  settings: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface EventSlot {
  id: string;
  event_id: string;
  start_time: string;
  end_time: string;
  capacity: number;
  booked_count: number;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface EventBooking {
  id: string;
  slot_id: string;
  application_id: string | null;
  household_id: string;
  attendee_name: string;
  attendee_email: string;
  attendee_count: number;
  status: EventBookingStatus;
  notes: string | null;
  confirmation_sent_at: string | null;
  reminder_sent_at: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Reviews & Decisions ─────────────────────────────────────────────────────

export interface ReviewRubric {
  id: string;
  school_id: string;
  name: string;
  description: string | null;
  criteria: ReviewCriterion[];
  scale_min: number;
  scale_max: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ReviewCriterion {
  id: string;
  name: string;
  description: string | null;
  weight: number;
}

export interface ApplicationReview {
  id: string;
  application_id: string;
  rubric_id: string | null;
  reviewer_id: string;
  scores: Record<string, number>;
  overall_score: number | null;
  recommendation: DecisionType | null;
  comments: string | null;
  is_complete: boolean;
  submitted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DecisionTemplate {
  id: string;
  school_id: string;
  decision_type: DecisionType;
  name: string;
  subject: string;
  body: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

// ─── Enrollment & Contracts ──────────────────────────────────────────────────

export interface EnrollmentContract {
  id: string;
  application_id: string;
  template_content: string;
  final_content: string | null;
  status: ContractStatus;
  tuition_amount: number;
  financial_aid_amount: number;
  net_amount: number;
  sent_at: string | null;
  viewed_at: string | null;
  primary_signer_id: string | null;
  primary_signed_at: string | null;
  secondary_signer_id: string | null;
  secondary_signed_at: string | null;
  completed_at: string | null;
  voided_at: string | null;
  void_reason: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface TuitionPayment {
  id: string;
  contract_id: string;
  amount: number;
  currency: string;
  description: string | null;
  due_date: string;
  status: TuitionPaymentStatus;
  stripe_payment_intent_id: string | null;
  paid_at: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

// ─── Communications ──────────────────────────────────────────────────────────

export interface EmailTemplate {
  id: string;
  school_id: string;
  name: string;
  subject: string;
  body_html: string;
  body_text: string | null;
  template_type: string;
  merge_tags: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  school_id: string;
  template_id: string | null;
  channel: MessageChannel;
  from_address: string;
  to_address: string;
  subject: string | null;
  body: string;
  status: MessageStatus;
  sent_at: string | null;
  delivered_at: string | null;
  opened_at: string | null;
  clicked_at: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface ConversationThread {
  id: string;
  school_id: string;
  application_id: string | null;
  household_id: string | null;
  subject: string;
  is_archived: boolean;
  last_message_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ConversationMessage {
  id: string;
  thread_id: string;
  sender_id: string;
  body: string;
  attachments: string[];
  is_internal: boolean;
  read_at: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Documents ───────────────────────────────────────────────────────────────

export interface Document {
  id: string;
  school_id: string;
  application_id: string | null;
  student_id: string | null;
  household_id: string | null;
  uploaded_by: string;
  file_name: string;
  file_type: string;
  file_size: number;
  storage_path: string;
  category: DocumentCategory;
  description: string | null;
  is_verified: boolean;
  verified_by: string | null;
  verified_at: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// ─── Waitlist ────────────────────────────────────────────────────────────────

export interface WaitlistEntry {
  id: string;
  application_id: string;
  school_id: string;
  season_id: string;
  grade: string;
  position: number;
  status: WaitlistStatus;
  priority_score: number;
  notes: string | null;
  offered_at: string | null;
  response_deadline: string | null;
  responded_at: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Audit & Analytics ──────────────────────────────────────────────────────

export interface AuditLog {
  id: string;
  school_id: string | null;
  user_id: string | null;
  action: AuditAction;
  entity_type: string;
  entity_id: string;
  changes: Record<string, unknown>;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface EnrollmentSnapshot {
  id: string;
  school_id: string;
  season_id: string;
  snapshot_date: string;
  grade: string;
  metrics: EnrollmentSnapshotMetrics;
  created_at: string;
}

export interface EnrollmentSnapshotMetrics {
  inquiries: number;
  applications_started: number;
  applications_submitted: number;
  under_review: number;
  accepted: number;
  denied: number;
  waitlisted: number;
  enrolled: number;
  withdrawn: number;
  conversion_rate: number;
  yield_rate: number;
}

// ─── Tags ────────────────────────────────────────────────────────────────────

export interface Tag {
  id: string;
  school_id: string;
  name: string;
  color: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApplicationTag {
  id: string;
  application_id: string;
  tag_id: string;
  created_at: string;
}
