// @admissions-compass/shared - ICS Calendar Utilities
// Generate ICS (iCalendar) file content for event scheduling

// ─── ICS Event Type ──────────────────────────────────────────────────────────

export interface ICSEvent {
  /** Event title / summary */
  title: string;
  /** Event description (optional) */
  description?: string;
  /** Event start time (ISO 8601 string) */
  start: string;
  /** Event end time (ISO 8601 string) */
  end: string;
  /** Physical location (optional) */
  location?: string;
  /** URL for virtual events or more info (optional) */
  url?: string;
}

// ─── ICS Generation ──────────────────────────────────────────────────────────

/**
 * Generates ICS (iCalendar) file content for a single event.
 * The resulting string can be saved as a .ics file or served as a download.
 *
 * @param event - The event data to encode in ICS format
 * @returns A valid ICS file content string
 *
 * @example
 * ```ts
 * const ics = generateICSEvent({
 *   title: 'Campus Tour',
 *   description: 'Guided tour of the campus facilities',
 *   start: '2024-10-15T10:00:00Z',
 *   end: '2024-10-15T11:00:00Z',
 *   location: '123 School Lane, Springfield, IL',
 *   url: 'https://school.example.com/tour',
 * });
 *
 * // Save to file or return as download
 * ```
 */
export function generateICSEvent(event: ICSEvent): string {
  const uid = generateUID();
  const now = formatICSDate(new Date().toISOString());
  const start = formatICSDate(event.start);
  const end = formatICSDate(event.end);

  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Admissions Compass//Event Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${escapeICSText(event.title)}`,
  ];

  if (event.description) {
    lines.push(`DESCRIPTION:${escapeICSText(event.description)}`);
  }

  if (event.location) {
    lines.push(`LOCATION:${escapeICSText(event.location)}`);
  }

  if (event.url) {
    lines.push(`URL:${event.url}`);
  }

  lines.push('END:VEVENT');
  lines.push('END:VCALENDAR');

  return lines.join('\r\n');
}

// ─── Internal Helpers ────────────────────────────────────────────────────────

/**
 * Formats an ISO 8601 date string to ICS date-time format (YYYYMMDDTHHMMSSZ).
 */
function formatICSDate(isoDate: string): string {
  const date = new Date(isoDate);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');

  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}

/**
 * Escapes special characters in ICS text fields.
 * Per RFC 5545: backslash, semicolon, comma, and newlines must be escaped.
 */
function escapeICSText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

/**
 * Generates a unique identifier for ICS events.
 * Uses a combination of timestamp and random characters.
 */
function generateUID(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 10);
  return `${timestamp}-${random}@admissions-compass`;
}
