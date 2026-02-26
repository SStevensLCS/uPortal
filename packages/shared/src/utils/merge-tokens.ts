// @admissions-compass/shared - Merge Token Utilities
// Template merge token resolution for email and document templates

// ─── Merge Token Definitions ─────────────────────────────────────────────────

/** All available merge tokens from Appendix A of the specification */
export const MERGE_TOKENS = {
  // Family / Household tokens
  'parent.first_name': 'Primary parent first name',
  'parent.last_name': 'Primary parent last name',
  'parent.full_name': 'Primary parent full name',
  'parent.email': 'Primary parent email',
  'parent.phone': 'Primary parent phone number',
  'household.name': 'Household name',
  'household.address': 'Household address',

  // Student tokens
  'student.first_name': 'Student first name',
  'student.last_name': 'Student last name',
  'student.full_name': 'Student full name',
  'student.preferred_name': 'Student preferred name',
  'student.date_of_birth': 'Student date of birth',
  'student.current_grade': 'Student current grade',
  'student.current_school': 'Student current school',

  // Application tokens
  'application.id': 'Application ID',
  'application.status': 'Application status',
  'application.applying_for_grade': 'Grade applying for',
  'application.application_type': 'Application type',
  'application.submitted_at': 'Application submission date',
  'application.decision': 'Application decision',
  'application.decision_at': 'Decision date',

  // School tokens
  'school.name': 'School name',
  'school.address': 'School address',
  'school.phone': 'School phone number',
  'school.website_url': 'School website URL',
  'school.logo_url': 'School logo URL',

  // Season tokens
  'season.name': 'Enrollment season name',
  'season.start_date': 'Season start date',
  'season.end_date': 'Season end date',

  // Checklist tokens
  'checklist.next_item': 'Next checklist item title',
  'checklist.progress': 'Checklist progress percentage',
  'checklist.due_date': 'Next due date',

  // Contract tokens
  'contract.tuition_amount': 'Tuition amount',
  'contract.financial_aid_amount': 'Financial aid amount',
  'contract.net_amount': 'Net tuition amount',
  'contract.status': 'Contract status',

  // Event tokens
  'event.name': 'Event name',
  'event.date': 'Event date',
  'event.time': 'Event time',
  'event.location': 'Event location',
  'event.virtual_url': 'Virtual event URL',

  // Recommendation tokens
  'recommendation.recommender_name': 'Recommender name',
  'recommendation.recommender_email': 'Recommender email',
  'recommendation.status': 'Recommendation status',
  'recommendation.link': 'Recommendation form link',

  // Portal tokens
  'portal.login_url': 'Parent portal login URL',
  'portal.application_url': 'Application URL',
  'portal.checklist_url': 'Checklist URL',

  // Date tokens
  'current.date': 'Current date',
  'current.year': 'Current year',
} as const;

export type MergeToken = keyof typeof MERGE_TOKENS;

/** Context data used to resolve merge tokens */
export interface MergeTokenContext {
  parent?: Record<string, unknown>;
  student?: Record<string, unknown>;
  application?: Record<string, unknown>;
  school?: Record<string, unknown>;
  season?: Record<string, unknown>;
  household?: Record<string, unknown>;
  checklist?: Record<string, unknown>;
  contract?: Record<string, unknown>;
  event?: Record<string, unknown>;
  recommendation?: Record<string, unknown>;
  portal?: Record<string, unknown>;
  [key: string]: Record<string, unknown> | undefined;
}

// ─── Token Resolution ────────────────────────────────────────────────────────

/**
 * Resolves a single merge token to its value from the provided context.
 *
 * @param token - The merge token key (e.g., 'student.first_name')
 * @param context - The data context containing values for token resolution
 * @returns The resolved value as a string, or an empty string if not found
 *
 * @example
 * ```ts
 * const context = { student: { first_name: 'Emma', last_name: 'Jones' } };
 * getMergeTokenValue('student.first_name', context); // "Emma"
 * getMergeTokenValue('student.unknown_field', context); // ""
 * ```
 */
export function getMergeTokenValue(
  token: string,
  context: MergeTokenContext
): string {
  // Handle special tokens
  if (token === 'current.date') {
    return new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }
  if (token === 'current.year') {
    return new Date().getFullYear().toString();
  }

  // Split token into namespace and field
  const dotIndex = token.indexOf('.');
  if (dotIndex === -1) {
    return '';
  }

  const namespace = token.slice(0, dotIndex);
  const field = token.slice(dotIndex + 1);

  const data = context[namespace];
  if (!data) {
    return '';
  }

  const value = data[field];
  if (value === null || value === undefined) {
    return '';
  }

  // Handle nested objects (e.g., address)
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  return String(value);
}

/**
 * Replaces all `{{token}}` placeholders in a template string with actual values
 * resolved from the provided data context.
 *
 * @param template - The template string containing `{{token}}` placeholders
 * @param context - The data context containing values for token resolution
 * @returns The template with all tokens replaced with their resolved values
 *
 * @example
 * ```ts
 * const template = 'Dear {{parent.first_name}}, your child {{student.first_name}} has been {{application.decision}}.';
 * const context = {
 *   parent: { first_name: 'John' },
 *   student: { first_name: 'Emma' },
 *   application: { decision: 'accepted' },
 * };
 * resolveMergeTokens(template, context);
 * // "Dear John, your child Emma has been accepted."
 * ```
 */
export function resolveMergeTokens(
  template: string,
  context: MergeTokenContext
): string {
  return template.replace(
    /\{\{([^}]+)\}\}/g,
    (_match, token: string) => {
      const trimmedToken = token.trim();
      return getMergeTokenValue(trimmedToken, context);
    }
  );
}

/**
 * Extracts all merge token keys used in a template string.
 *
 * @param template - The template string to scan for tokens
 * @returns An array of unique token keys found in the template
 *
 * @example
 * ```ts
 * extractTokens('Hello {{parent.first_name}}, re: {{student.full_name}}');
 * // ['parent.first_name', 'student.full_name']
 * ```
 */
export function extractTokens(template: string): string[] {
  const tokens: string[] = [];
  const regex = /\{\{([^}]+)\}\}/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(template)) !== null) {
    const token = match[1].trim();
    if (!tokens.includes(token)) {
      tokens.push(token);
    }
  }

  return tokens;
}
