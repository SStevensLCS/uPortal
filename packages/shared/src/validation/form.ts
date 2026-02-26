// @admissions-compass/shared - Form Validation Schemas
// Zod schemas for form definition and submission inputs

import { z } from 'zod';

// ─── Form Type Enum ──────────────────────────────────────────────────────────

const formTypeEnum = z.enum([
  'inquiry',
  'application',
  'recommendation',
  'supplemental',
  'financial_aid',
  'enrollment',
  'evaluation',
  'custom',
]);

// ─── Form Submission Status Enum ─────────────────────────────────────────────

const formSubmissionStatusEnum = z.enum([
  'draft',
  'in_progress',
  'submitted',
  'accepted',
  'rejected',
  'revision_requested',
]);

// ─── Form Definition Schema ─────────────────────────────────────────────────

/** Validates form definition creation/updates */
export const formDefinitionSchema = z.object({
  name: z
    .string()
    .min(1, 'Form name is required')
    .max(255, 'Form name must be 255 characters or fewer'),
  form_type: formTypeEnum,
  description: z.string().nullable().optional(),
  schema: z
    .record(z.unknown())
    .refine(
      (val) => Object.keys(val).length > 0,
      'Form schema must not be empty'
    ),
  ui_schema: z.record(z.unknown()).optional().default({}),
  settings: z.record(z.unknown()).optional().default({}),
});

export type FormDefinitionInput = z.infer<typeof formDefinitionSchema>;

// ─── Form Submission Schema ──────────────────────────────────────────────────

/** Validates form submission creation */
export const formSubmissionSchema = z.object({
  form_definition_id: z.string().uuid('Form definition ID must be a valid UUID'),
  data: z.record(z.unknown()),
  status: formSubmissionStatusEnum.optional().default('draft'),
});

export type FormSubmissionInput = z.infer<typeof formSubmissionSchema>;

// ─── Form Submission Update Schema ───────────────────────────────────────────

/** Validates form submission updates (e.g., saving progress) */
export const updateFormSubmissionSchema = z.object({
  data: z.record(z.unknown()).optional(),
  status: formSubmissionStatusEnum.optional(),
});

export type UpdateFormSubmissionInput = z.infer<typeof updateFormSubmissionSchema>;
