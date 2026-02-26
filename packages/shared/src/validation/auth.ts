// @admissions-compass/shared - Auth Validation Schemas
// Zod schemas for authentication-related inputs

import { z } from 'zod';

// ─── Login Schema ────────────────────────────────────────────────────────────

/** Validates login credentials */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters'),
});

export type LoginInput = z.infer<typeof loginSchema>;

// ─── Signup Schema ───────────────────────────────────────────────────────────

/** Validates new user registration data */
export const signupSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  first_name: z
    .string()
    .min(1, 'First name is required')
    .max(100, 'First name must be 100 characters or fewer'),
  last_name: z
    .string()
    .min(1, 'Last name is required')
    .max(100, 'Last name must be 100 characters or fewer'),
  user_type: z.enum(['parent', 'staff'], {
    errorMap: () => ({ message: 'User type must be either parent or staff' }),
  }),
});

export type SignupInput = z.infer<typeof signupSchema>;

// ─── Magic Link Schema ──────────────────────────────────────────────────────

/** Validates magic link (passwordless login) requests */
export const magicLinkSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
});

export type MagicLinkInput = z.infer<typeof magicLinkSchema>;

// ─── Password Reset Schemas ──────────────────────────────────────────────────

/** Validates password reset request */
export const passwordResetRequestSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
});

export type PasswordResetRequestInput = z.infer<typeof passwordResetRequestSchema>;

/** Validates password reset confirmation */
export const passwordResetConfirmSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
});

export type PasswordResetConfirmInput = z.infer<typeof passwordResetConfirmSchema>;
