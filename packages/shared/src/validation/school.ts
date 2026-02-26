// @admissions-compass/shared - School Validation Schemas
// Zod schemas for school-related inputs

import { z } from 'zod';

// ─── School Address Schema ───────────────────────────────────────────────────

export const schoolAddressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  street2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postal_code: z.string().min(1, 'Postal code is required'),
  country: z.string().min(1, 'Country is required'),
});

// ─── School Settings Schema ──────────────────────────────────────────────────

/** Validates school configuration/settings updates */
export const schoolSettingsSchema = z.object({
  name: z
    .string()
    .min(1, 'School name is required')
    .max(255, 'School name must be 255 characters or fewer'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(100, 'Slug must be 100 characters or fewer')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Slug must contain only lowercase letters, numbers, and hyphens'
    ),
  timezone: z.string().min(1, 'Timezone is required'),
  currency: z.string().length(3, 'Currency must be a 3-letter ISO code'),
  school_type: z.enum([
    'independent',
    'charter',
    'parochial',
    'montessori',
    'waldorf',
    'boarding',
    'day',
    'online',
    'hybrid',
    'other',
  ]),
  grade_levels: z
    .array(z.string())
    .min(1, 'At least one grade level is required'),
  logo_url: z.string().url('Logo URL must be a valid URL').nullable().optional(),
  website_url: z.string().url('Website URL must be a valid URL').nullable().optional(),
  address: schoolAddressSchema.nullable().optional(),
  phone: z.string().nullable().optional(),
  divisions: z
    .array(
      z.object({
        name: z.string().min(1),
        grade_levels: z.array(z.string()),
      })
    )
    .nullable()
    .optional(),
  settings: z.record(z.unknown()).optional(),
});

export type SchoolSettingsInput = z.infer<typeof schoolSettingsSchema>;

// ─── Enrollment Season Schema ────────────────────────────────────────────────

/** Validates enrollment season creation/updates */
export const enrollmentSeasonSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Season name is required')
      .max(255, 'Season name must be 255 characters or fewer'),
    start_date: z
      .string()
      .min(1, 'Start date is required')
      .regex(
        /^\d{4}-\d{2}-\d{2}/,
        'Start date must be in ISO 8601 format'
      ),
    end_date: z
      .string()
      .min(1, 'End date is required')
      .regex(
        /^\d{4}-\d{2}-\d{2}/,
        'End date must be in ISO 8601 format'
      ),
    is_active: z.boolean(),
    settings: z.record(z.unknown()).optional(),
  })
  .refine(
    (data) => new Date(data.end_date) > new Date(data.start_date),
    {
      message: 'End date must be after start date',
      path: ['end_date'],
    }
  );

export type EnrollmentSeasonInput = z.infer<typeof enrollmentSeasonSchema>;
