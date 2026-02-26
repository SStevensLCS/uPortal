// @admissions-compass/shared - Application Validation Schemas
// Zod schemas for application-related inputs

import { z } from 'zod';

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

// ─── Application Status Enum ─────────────────────────────────────────────────

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

// ─── Create Application Schema ───────────────────────────────────────────────

/** Validates new application creation */
export const createApplicationSchema = z.object({
  school_id: z.string().uuid('School ID must be a valid UUID'),
  season_id: z.string().uuid('Season ID must be a valid UUID'),
  student_id: z.string().uuid('Student ID must be a valid UUID'),
  application_type: applicationTypeEnum,
  applying_for_grade: z
    .string()
    .min(1, 'Grade is required')
    .max(20, 'Grade must be 20 characters or fewer'),
});

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;

// ─── Update Application Schema ───────────────────────────────────────────────

/** Validates application updates */
export const updateApplicationSchema = z.object({
  school_id: z.string().uuid('School ID must be a valid UUID').optional(),
  season_id: z.string().uuid('Season ID must be a valid UUID').optional(),
  student_id: z.string().uuid('Student ID must be a valid UUID').optional(),
  application_type: applicationTypeEnum.optional(),
  applying_for_grade: z
    .string()
    .min(1, 'Grade is required')
    .max(20, 'Grade must be 20 characters or fewer')
    .optional(),
  status: applicationStatusEnum.optional(),
  decision: z.enum(['accepted', 'denied', 'waitlisted', 'deferred']).nullable().optional(),
  decision_notes: z.string().nullable().optional(),
  internal_notes: z.string().nullable().optional(),
  custom_fields: z.record(z.unknown()).optional(),
});

export type UpdateApplicationInput = z.infer<typeof updateApplicationSchema>;

// ─── Application Decision Schema ─────────────────────────────────────────────

/** Validates application decision submission */
export const applicationDecisionSchema = z.object({
  decision: z.enum(['accepted', 'denied', 'waitlisted', 'deferred']),
  decision_notes: z.string().nullable().optional(),
  release_immediately: z.boolean().optional(),
});

export type ApplicationDecisionInput = z.infer<typeof applicationDecisionSchema>;
