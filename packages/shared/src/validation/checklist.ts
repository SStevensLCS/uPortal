// @admissions-compass/shared - Checklist Validation Schemas
// Zod schemas for checklist template and item inputs

import { z } from 'zod';

// ─── Checklist Item Type Enum ────────────────────────────────────────────────

const checklistItemTypeEnum = z.enum([
  'document_upload',
  'form_submission',
  'recommendation',
  'interview',
  'assessment',
  'payment',
  'event_attendance',
  'custom',
]);

// ─── Application Status Enum (for stage) ─────────────────────────────────────

const applicationStatusEnum = z.enum([
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
]);

// ─── Application Type Enum ───────────────────────────────────────────────────

const applicationTypeEnum = z.enum([
  'standard',
  'early_decision',
  'early_action',
  'rolling',
  'transfer',
  'international',
  'financial_aid',
  'scholarship',
]);

// ─── Due Date Rule Schema ────────────────────────────────────────────────────

const dueDateRuleSchema = z.object({
  type: z.enum(['fixed', 'relative_to_submission', 'relative_to_start']),
  days_offset: z.number().int().optional(),
  fixed_date: z.string().optional(),
});

// ─── Checklist Template Schema ───────────────────────────────────────────────

/** Validates checklist template creation/updates */
export const checklistTemplateSchema = z.object({
  name: z
    .string()
    .min(1, 'Template name is required')
    .max(255, 'Template name must be 255 characters or fewer'),
  stage: applicationStatusEnum,
  grade_levels: z
    .array(z.string())
    .min(1, 'At least one grade level is required'),
  application_types: z
    .array(applicationTypeEnum)
    .min(1, 'At least one application type is required'),
});

export type ChecklistTemplateInput = z.infer<typeof checklistTemplateSchema>;

// ─── Checklist Template Item Schema ──────────────────────────────────────────

/** Validates checklist template item creation/updates */
export const checklistTemplateItemSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(255, 'Title must be 255 characters or fewer'),
  description: z.string().nullable().optional(),
  item_type: checklistItemTypeEnum,
  is_required: z.boolean().default(true),
  sort_order: z.number().int().min(0, 'Sort order must be non-negative'),
  config: z.record(z.unknown()).optional().default({}),
  due_date_rule: dueDateRuleSchema.nullable().optional(),
});

export type ChecklistTemplateItemInput = z.infer<typeof checklistTemplateItemSchema>;

// ─── Checklist Item Status Update Schema ─────────────────────────────────────

/** Validates checklist item status updates */
export const checklistItemStatusSchema = z.object({
  status: z.enum([
    'not_started',
    'in_progress',
    'submitted',
    'completed',
    'waived',
    'overdue',
  ]),
});

export type ChecklistItemStatusInput = z.infer<typeof checklistItemStatusSchema>;
