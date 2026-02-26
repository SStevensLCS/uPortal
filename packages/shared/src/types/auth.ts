// @admissions-compass/shared - Auth Types
// Authentication and authorization type definitions

import type { UserProfile, StaffRole } from './database';

// ─── Auth User ───────────────────────────────────────────────────────────────

/** Authenticated user with session information */
export interface AuthUser extends UserProfile {
  /** Active session ID */
  session_id: string;
  /** Schools the user has access to with their roles */
  school_roles: SchoolRole[];
  /** Whether the user is currently being impersonated */
  is_impersonated: boolean;
  /** ID of the admin who initiated impersonation, if applicable */
  impersonated_by: string | null;
}

export interface SchoolRole {
  school_id: string;
  school_name: string;
  role: StaffRole;
  permissions: Record<string, boolean>;
}

// ─── Auth Session ────────────────────────────────────────────────────────────

export interface AuthSession {
  id: string;
  user_id: string;
  access_token: string;
  refresh_token: string;
  expires_at: string;
  created_at: string;
  ip_address: string | null;
  user_agent: string | null;
}

// ─── Auth Requests ───────────────────────────────────────────────────────────

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  user_type: 'parent' | 'staff';
}

export interface MagicLinkRequest {
  email: string;
}

// ─── Auth Responses ──────────────────────────────────────────────────────────

export interface AuthResponse {
  user: AuthUser;
  session: AuthSession;
}

export interface TokenRefreshResponse {
  access_token: string;
  refresh_token: string;
  expires_at: string;
}

// ─── Password Reset ─────────────────────────────────────────────────────────

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  password: string;
}
