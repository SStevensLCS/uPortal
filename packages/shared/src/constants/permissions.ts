// @admissions-compass/shared - Permissions Constants
// Role permission matrix and helper functions

import type { StaffRole } from '../types/database';

// ─── Permission Definitions ──────────────────────────────────────────────────

export type Permission =
  | 'configure_school_settings'
  | 'manage_staff'
  | 'create_edit_forms'
  | 'create_edit_checklists'
  | 'view_all_applications'
  | 'edit_application_data'
  | 'send_communications'
  | 'make_decisions'
  | 'release_decisions'
  | 'view_financial_aid'
  | 'generate_contracts'
  | 'review_score_applicants'
  | 'export_data'
  | 'view_reports'
  | 'impersonate_parent';

/** All available permissions */
export const PERMISSIONS: Permission[] = [
  'configure_school_settings',
  'manage_staff',
  'create_edit_forms',
  'create_edit_checklists',
  'view_all_applications',
  'edit_application_data',
  'send_communications',
  'make_decisions',
  'release_decisions',
  'view_financial_aid',
  'generate_contracts',
  'review_score_applicants',
  'export_data',
  'view_reports',
  'impersonate_parent',
];

// ─── Role Permission Matrix ──────────────────────────────────────────────────

/**
 * Maps each staff role to the set of permissions it grants.
 * Higher-level roles inherit all permissions from lower-level roles.
 */
export const ROLE_PERMISSIONS: Record<StaffRole, readonly Permission[]> = {
  system_admin: [
    'configure_school_settings',
    'manage_staff',
    'create_edit_forms',
    'create_edit_checklists',
    'view_all_applications',
    'edit_application_data',
    'send_communications',
    'make_decisions',
    'release_decisions',
    'view_financial_aid',
    'generate_contracts',
    'review_score_applicants',
    'export_data',
    'view_reports',
    'impersonate_parent',
  ],
  admin: [
    'configure_school_settings',
    'manage_staff',
    'create_edit_forms',
    'create_edit_checklists',
    'view_all_applications',
    'edit_application_data',
    'send_communications',
    'make_decisions',
    'release_decisions',
    'view_financial_aid',
    'generate_contracts',
    'review_score_applicants',
    'export_data',
    'view_reports',
    'impersonate_parent',
  ],
  user: [
    'create_edit_forms',
    'create_edit_checklists',
    'view_all_applications',
    'edit_application_data',
    'send_communications',
    'make_decisions',
    'view_financial_aid',
    'review_score_applicants',
    'export_data',
    'view_reports',
  ],
  limited_user: [
    'view_all_applications',
    'send_communications',
    'view_reports',
  ],
  reviewer: [
    'view_all_applications',
    'review_score_applicants',
  ],
} as const;

// ─── Permission Helpers ──────────────────────────────────────────────────────

/**
 * Check whether a given role has a specific permission.
 *
 * @param role - The staff role to check
 * @param permission - The permission to verify
 * @returns True if the role includes the specified permission
 */
export function hasPermission(role: StaffRole, permission: Permission): boolean {
  const rolePermissions = ROLE_PERMISSIONS[role];
  return rolePermissions.includes(permission);
}

/**
 * Get all permissions for a given role as a Set for efficient lookups.
 *
 * @param role - The staff role to retrieve permissions for
 * @returns A Set containing all permissions granted to the role
 */
export function getPermissionSet(role: StaffRole): Set<Permission> {
  return new Set(ROLE_PERMISSIONS[role]);
}

/**
 * Check whether a role has all of the specified permissions.
 *
 * @param role - The staff role to check
 * @param permissions - The permissions to verify
 * @returns True if the role has every specified permission
 */
export function hasAllPermissions(role: StaffRole, permissions: Permission[]): boolean {
  const rolePermissions = ROLE_PERMISSIONS[role];
  return permissions.every((p) => rolePermissions.includes(p));
}

/**
 * Check whether a role has at least one of the specified permissions.
 *
 * @param role - The staff role to check
 * @param permissions - The permissions to check against
 * @returns True if the role has at least one of the specified permissions
 */
export function hasAnyPermission(role: StaffRole, permissions: Permission[]): boolean {
  const rolePermissions = ROLE_PERMISSIONS[role];
  return permissions.some((p) => rolePermissions.includes(p));
}
