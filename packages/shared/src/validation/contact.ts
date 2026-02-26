// @admissions-compass/shared - Contact Validation Schemas
// Zod schemas for contact/household-related inputs

import { z } from 'zod';

// ─── Create Contact Schema ───────────────────────────────────────────────────

/** Validates new contact (household member) creation */
export const createContactSchema = z.object({
  first_name: z
    .string()
    .min(1, 'First name is required')
    .max(100, 'First name must be 100 characters or fewer'),
  last_name: z
    .string()
    .min(1, 'Last name is required')
    .max(100, 'Last name must be 100 characters or fewer'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  phone: z
    .string()
    .max(20, 'Phone must be 20 characters or fewer')
    .optional()
    .nullable(),
});

export type CreateContactInput = z.infer<typeof createContactSchema>;

// ─── Update Contact Schema ───────────────────────────────────────────────────

/** Validates contact (household member) updates */
export const updateContactSchema = z.object({
  first_name: z
    .string()
    .min(1, 'First name is required')
    .max(100, 'First name must be 100 characters or fewer')
    .optional(),
  last_name: z
    .string()
    .min(1, 'Last name is required')
    .max(100, 'Last name must be 100 characters or fewer')
    .optional(),
  email: z
    .string()
    .email('Please enter a valid email address')
    .optional(),
  phone: z
    .string()
    .max(20, 'Phone must be 20 characters or fewer')
    .optional()
    .nullable(),
});

export type UpdateContactInput = z.infer<typeof updateContactSchema>;

// ─── Student Schema ──────────────────────────────────────────────────────────

/** Validates new student creation */
export const createStudentSchema = z.object({
  household_id: z.string().uuid('Household ID must be a valid UUID'),
  first_name: z
    .string()
    .min(1, 'First name is required')
    .max(100, 'First name must be 100 characters or fewer'),
  last_name: z
    .string()
    .min(1, 'Last name is required')
    .max(100, 'Last name must be 100 characters or fewer'),
  preferred_name: z.string().max(100).nullable().optional(),
  date_of_birth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date of birth must be in YYYY-MM-DD format')
    .nullable()
    .optional(),
  gender: z
    .enum(['male', 'female', 'non_binary', 'prefer_not_to_say', 'other'])
    .nullable()
    .optional(),
  current_school: z.string().max(255).nullable().optional(),
  current_grade: z.string().max(20).nullable().optional(),
});

export type CreateStudentInput = z.infer<typeof createStudentSchema>;

/** Validates student updates */
export const updateStudentSchema = createStudentSchema.partial().omit({
  household_id: true,
});

export type UpdateStudentInput = z.infer<typeof updateStudentSchema>;
