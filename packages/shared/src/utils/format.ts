// @admissions-compass/shared - Format Utilities
// Formatting helpers for currency, dates, names, and phone numbers

// ─── Currency Formatting ─────────────────────────────────────────────────────

/**
 * Converts an amount in cents to a formatted currency string.
 *
 * @param cents - The amount in cents (e.g., 1500 for $15.00)
 * @param currency - The ISO 4217 currency code (defaults to 'USD')
 * @param locale - The locale for formatting (defaults to 'en-US')
 * @returns A formatted currency string (e.g., "$15.00")
 *
 * @example
 * ```ts
 * formatCurrency(1500);        // "$15.00"
 * formatCurrency(1500, 'EUR'); // "€15.00"
 * formatCurrency(0);           // "$0.00"
 * formatCurrency(-500);        // "-$5.00"
 * ```
 */
export function formatCurrency(
  cents: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  const amount = cents / 100;
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// ─── Date Formatting ─────────────────────────────────────────────────────────

export type DateFormatStyle = 'short' | 'medium' | 'long' | 'full' | 'iso' | 'relative';

/**
 * Formats a date string or Date object into a human-readable format.
 *
 * @param date - The date to format (ISO 8601 string or Date object)
 * @param format - The format style to use (defaults to 'medium')
 * @param locale - The locale for formatting (defaults to 'en-US')
 * @returns A formatted date string
 *
 * @example
 * ```ts
 * formatDate('2024-09-15T10:30:00Z');            // "Sep 15, 2024"
 * formatDate('2024-09-15T10:30:00Z', 'short');   // "9/15/24"
 * formatDate('2024-09-15T10:30:00Z', 'long');    // "September 15, 2024"
 * formatDate('2024-09-15T10:30:00Z', 'iso');     // "2024-09-15"
 * ```
 */
export function formatDate(
  date: string | Date,
  format: DateFormatStyle = 'medium',
  locale: string = 'en-US'
): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(d.getTime())) {
    return 'Invalid date';
  }

  if (format === 'iso') {
    return d.toISOString().split('T')[0];
  }

  if (format === 'relative') {
    return formatRelativeDate(d);
  }

  const options: Record<DateFormatStyle, Intl.DateTimeFormatOptions> = {
    short: { month: 'numeric', day: 'numeric', year: '2-digit' },
    medium: { month: 'short', day: 'numeric', year: 'numeric' },
    long: { month: 'long', day: 'numeric', year: 'numeric' },
    full: {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    },
    iso: {},
    relative: {},
  };

  return new Intl.DateTimeFormat(locale, options[format]).format(d);
}

/**
 * Formats a date as a relative time string (e.g., "2 days ago", "in 3 hours").
 */
function formatRelativeDate(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(Math.abs(diffMs) / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  const isFuture = diffMs < 0;
  const prefix = isFuture ? 'in ' : '';
  const suffix = isFuture ? '' : ' ago';

  if (diffSeconds < 60) {
    return 'just now';
  } else if (diffMinutes < 60) {
    const unit = diffMinutes === 1 ? 'minute' : 'minutes';
    return `${prefix}${diffMinutes} ${unit}${suffix}`;
  } else if (diffHours < 24) {
    const unit = diffHours === 1 ? 'hour' : 'hours';
    return `${prefix}${diffHours} ${unit}${suffix}`;
  } else if (diffDays < 30) {
    const unit = diffDays === 1 ? 'day' : 'days';
    return `${prefix}${diffDays} ${unit}${suffix}`;
  } else {
    return formatDate(date, 'medium');
  }
}

// ─── Name Formatting ─────────────────────────────────────────────────────────

/**
 * Formats a person's name, using preferred name if available.
 *
 * @param first - First name
 * @param last - Last name
 * @param preferred - Preferred/nickname (optional, displayed in place of first name)
 * @returns A formatted full name
 *
 * @example
 * ```ts
 * formatName('William', 'Smith');            // "William Smith"
 * formatName('William', 'Smith', 'Bill');    // "Bill Smith"
 * formatName('', 'Smith');                   // "Smith"
 * ```
 */
export function formatName(
  first: string,
  last: string,
  preferred?: string | null
): string {
  const displayFirst = preferred?.trim() || first.trim();
  const displayLast = last.trim();

  if (!displayFirst && !displayLast) {
    return '';
  }
  if (!displayFirst) {
    return displayLast;
  }
  if (!displayLast) {
    return displayFirst;
  }

  return `${displayFirst} ${displayLast}`;
}

// ─── Phone Formatting ────────────────────────────────────────────────────────

/**
 * Formats a phone number string into a standardized display format.
 * Handles US phone numbers (10 digits) and passes through others as-is.
 *
 * @param phone - The phone number to format (digits, optionally with country code)
 * @returns A formatted phone number string
 *
 * @example
 * ```ts
 * formatPhone('5551234567');    // "(555) 123-4567"
 * formatPhone('15551234567');   // "+1 (555) 123-4567"
 * formatPhone('+44 20 7123');   // "+44 20 7123" (non-US passed through)
 * ```
 */
export function formatPhone(phone: string): string {
  // Strip non-digit characters for analysis
  const digits = phone.replace(/\D/g, '');

  // US phone number: 10 digits
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  // US phone number with country code: 11 digits starting with 1
  if (digits.length === 11 && digits.startsWith('1')) {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }

  // For non-US or unrecognized formats, return the original input cleaned up
  return phone.trim();
}
