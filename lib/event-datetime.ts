const MONTHS: Record<string, number> = {
  JAN: 0,
  JANUARY: 0,
  FEB: 1,
  FEBRUARY: 1,
  MAR: 2,
  MARCH: 2,
  APR: 3,
  APRIL: 3,
  MAY: 4,
  JUN: 5,
  JUNE: 5,
  JUL: 6,
  JULY: 6,
  AUG: 7,
  AUGUST: 7,
  SEP: 8,
  SEPT: 8,
  SEPTEMBER: 8,
  OCT: 9,
  OCTOBER: 9,
  NOV: 10,
  NOVEMBER: 10,
  DEC: 11,
  DECEMBER: 11,
};

const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'] as const;
const MONTH_LABELS = [
  'JAN',
  'FEB',
  'MAR',
  'APR',
  'MAY',
  'JUN',
  'JUL',
  'AUG',
  'SEP',
  'OCT',
  'NOV',
  'DEC',
] as const;

const CENTER_DOT = ' · ';

function parseTimeValue(timeStr: string): { hours: number; minutes: number } | null {
  const normalized = timeStr.trim();
  if (!normalized) {
    return null;
  }

  const twentyFourHourMatch = normalized.match(/^(\d{1,2}):(\d{2})$/);
  if (twentyFourHourMatch) {
    return {
      hours: Number(twentyFourHourMatch[1]),
      minutes: Number(twentyFourHourMatch[2]),
    };
  }

  const twelveHourMatch = normalized.match(/^(\d{1,2}):(\d{2})\s*([APap][Mm])\.?$/);
  if (twelveHourMatch) {
    let hours = Number(twelveHourMatch[1]) % 12;
    if (twelveHourMatch[3].toUpperCase() === 'PM') {
      hours += 12;
    }

    return {
      hours,
      minutes: Number(twelveHourMatch[2]),
    };
  }

  return null;
}

/**
 * Parses backend date strings such as:
 * - "Fri, Jul 10, 2026"
 * - "2026-07-10"
 * - "Jul 10, 2026"
 */
function parseDateParts(dateStr: string): { year: number; month: number; day: number } | null {
  const normalized = dateStr.trim();
  if (!normalized) {
    return null;
  }

  const isoMatch = normalized.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    return {
      year: Number(isoMatch[1]),
      month: Number(isoMatch[2]) - 1,
      day: Number(isoMatch[3]),
    };
  }

  // Fri, Jul 10, 2026  |  Jul 10, 2026  |  Friday, July 10, 2026
  const namedMatch = normalized.match(
    /^(?:[A-Za-z]{3,9},?\s+)?([A-Za-z]{3,9})\s+(\d{1,2}),?\s+(\d{4})$/,
  );
  if (namedMatch) {
    const month = MONTHS[namedMatch[1].toUpperCase()];
    if (month === undefined) {
      return null;
    }

    return {
      year: Number(namedMatch[3]),
      month,
      day: Number(namedMatch[2]),
    };
  }

  // 10 Jul 2026 / 10 July 2026
  const dayFirstMatch = normalized.match(/^(\d{1,2})\s+([A-Za-z]{3,9})\s+(\d{4})$/);
  if (dayFirstMatch) {
    const month = MONTHS[dayFirstMatch[2].toUpperCase()];
    if (month === undefined) {
      return null;
    }

    return {
      year: Number(dayFirstMatch[3]),
      month,
      day: Number(dayFirstMatch[1]),
    };
  }

  return null;
}

function buildDate(year: number, month: number, day: number, hours = 0, minutes = 0): Date | null {
  const date = new Date(year, month, day, hours, minutes, 0, 0);
  if (
    Number.isNaN(date.getTime()) ||
    date.getFullYear() !== year ||
    date.getMonth() !== month ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

export function parseEventDateTime(eventDate: string, eventTime: string): Date | null {
  const dateStr = eventDate.trim();
  const timeStr = eventTime.trim();
  const parsedTime = timeStr ? parseTimeValue(timeStr) : null;
  const dateParts = parseDateParts(dateStr);

  if (dateParts) {
    return buildDate(
      dateParts.year,
      dateParts.month,
      dateParts.day,
      parsedTime?.hours ?? 0,
      parsedTime?.minutes ?? 0,
    );
  }

  // Last resort for unexpected formats
  if (dateStr && timeStr) {
    const combined = new Date(`${dateStr} ${timeStr}`);
    if (!Number.isNaN(combined.getTime())) {
      return combined;
    }
  }

  const dateOnly = new Date(dateStr);
  if (!Number.isNaN(dateOnly.getTime())) {
    if (parsedTime) {
      dateOnly.setHours(parsedTime.hours, parsedTime.minutes, 0, 0);
    }
    return dateOnly;
  }

  return null;
}

function formatTimeLabel(hours: number, minutes: number): string {
  const period = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${hour12}:${String(minutes).padStart(2, '0')} ${period}`;
}

/**
 * Formats event date/time for badges on Events list + Event details.
 * Output: WED · SEP 11, 2026 · 8:00 PM
 */
export function formatEventBadgeDateTime(eventDate: string, eventTime: string): string {
  const parts = getEventBadgeDateParts(eventDate, eventTime);
  return parts.join(CENTER_DOT);
}

export function getEventBadgeDateParts(
  eventDate: string,
  eventTime: string,
): [string, string, string] | [string, string] | [string] {
  const parsed = parseEventDateTime(eventDate, eventTime);

  if (!parsed) {
    const fallbackDate = eventDate.trim().replace(/,/g, '').toUpperCase();
    const fallbackTime = eventTime.trim().toUpperCase();
    if (fallbackDate && fallbackTime) {
      return [fallbackDate, fallbackTime];
    }
    return [fallbackDate || fallbackTime || ''];
  }

  const weekday = WEEKDAYS[parsed.getDay()];
  const day = String(parsed.getDate()).padStart(2, '0');
  const month = MONTH_LABELS[parsed.getMonth()];
  const year = String(parsed.getFullYear());
  const time = formatTimeLabel(parsed.getHours(), parsed.getMinutes());

  return [weekday, `${month} ${day}, ${year}`, time];
}

export function formatMyEventDateTime(eventDate: string, eventTime: string): string {
  return formatEventBadgeDateTime(eventDate, eventTime);
}

export function formatEventDetailDateTime(eventDate: string, eventTime: string): string {
  return formatEventBadgeDateTime(eventDate, eventTime);
}

export function formatEventDetailOverlayDateTime(eventDate: string, eventTime: string): string {
  return formatEventBadgeDateTime(eventDate, eventTime);
}
