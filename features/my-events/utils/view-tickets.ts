import { parseEventDateValue } from '@/features/create-event/date-utils';
import { parseEventDateTime } from '@/lib/event-datetime';
import type { CodeAvailability, CodeType, EventTicket, TicketMode } from '@/services/events/types';

const META_DOT = ' • ';

export function getViewTicketTypeLabel(ticketMode: TicketMode): string {
  return ticketMode === 'ga' ? 'General Admission Ticket' : 'Reserved Seat Ticket';
}

export function formatViewTicketsHeaderMeta(
  eventDate: string,
  eventTime: string,
  venue: string,
): string {
  const parsed = parseEventDateTime(eventDate, eventTime);
  const venuePart = venue.trim();
  let datePart = '';

  if (parsed) {
    const weekday = parsed.toLocaleDateString('en-GB', { weekday: 'short' });
    const day = parsed.getDate();
    const month = parsed.toLocaleDateString('en-GB', { month: 'short' });
    const year = parsed.getFullYear();
    const hours = String(parsed.getHours()).padStart(2, '0');
    const minutes = String(parsed.getMinutes()).padStart(2, '0');
    datePart = `${weekday} • ${day} ${month}, ${year} • ${hours}:${minutes}`;
  } else {
    datePart = [eventDate.trim(), eventTime.trim()].filter(Boolean).join(META_DOT);
  }

  if (venuePart && datePart) {
    return `${datePart}${META_DOT}${venuePart}`;
  }

  return datePart || venuePart;
}

export function formatTicketEntrance(entrance?: string | null): string | null {
  const trimmed = entrance?.trim();
  if (!trimmed) return null;

  const upper = trimmed.toUpperCase();
  if (upper.startsWith('ENTER THROUGH')) {
    return upper;
  }

  return `ENTER THROUGH ${upper}`;
}

export function buildTicketQrValue(input: {
  eventId: string;
  orderNumber: string;
  ticket: EventTicket;
  index: number;
}): string {
  const section = input.ticket.section.trim() || '-';
  const row = input.ticket.row?.trim() || '-';
  const seat = input.ticket.seat?.trim() || '-';
  return `TM:${input.eventId}:${input.orderNumber}:${input.index}:${section}:${row}:${seat}`;
}

const MS_PER_DAY = 86_400_000;

export function getCodeAvailabilityLeadDays(
  eventDate: string,
  codeAvailableDate: string,
): number | null {
  const available = parseEventDateValue(codeAvailableDate);
  const event = parseEventDateTime(eventDate, '') ?? parseEventDateValue(eventDate);
  if (!available || !event) return null;

  const availableUtc = Date.UTC(available.getFullYear(), available.getMonth(), available.getDate());
  const eventUtc = Date.UTC(event.getFullYear(), event.getMonth(), event.getDate());
  return Math.max(0, Math.round((eventUtc - availableUtc) / MS_PER_DAY));
}

export function formatTicketCodeLockedMessage(codeType: CodeType, days: number | null): string {
  const kind = codeType === 'barcode' ? 'Barcode' : 'QR Code';

  if (days == null) {
    return `${kind} Will Display Before Your Event`;
  }

  if (days <= 0) {
    return `${kind} Will Display On The Day Of Your Event`;
  }

  const dayLabel = days === 1 ? '1 Day' : `${days} Days`;
  return `${kind} Will Display ${dayLabel} Before Your Event`;
}

export function isTicketCodeLocked(event: {
  codeAvailability: CodeAvailability;
  codeAvailableDate: string;
  timezone?: string;
}): boolean {
  if (event.codeAvailability !== 'scheduled' || !event.codeAvailableDate.trim()) {
    return false;
  }

  const availableAt = zonedStartOfDay(event.codeAvailableDate, event.timezone);
  if (!availableAt) {
    return true;
  }

  return Date.now() < availableAt.getTime();
}

function zonedStartOfDay(dateValue: string, timeZone?: string): Date | null {
  const parsed = parseEventDateValue(dateValue);
  if (!parsed) return null;

  const year = parsed.getFullYear();
  const month = parsed.getMonth() + 1;
  const day = parsed.getDate();
  const zone = timeZone?.trim();

  if (!zone) {
    return new Date(year, month - 1, day, 0, 0, 0, 0);
  }

  try {
    return zonedLocalDateTimeToUtc(year, month, day, 0, 0, zone);
  } catch {
    return new Date(year, month - 1, day, 0, 0, 0, 0);
  }
}

function zonedLocalDateTimeToUtc(
  year: number,
  month: number,
  day: number,
  hours: number,
  minutes: number,
  timeZone: string,
): Date {
  const utcGuess = new Date(Date.UTC(year, month - 1, day, hours, minutes, 0));
  const offset = getTimeZoneOffsetMs(utcGuess, timeZone);
  let corrected = new Date(utcGuess.getTime() - offset);
  const offset2 = getTimeZoneOffsetMs(corrected, timeZone);
  if (offset2 !== offset) {
    corrected = new Date(utcGuess.getTime() - offset2);
  }
  return corrected;
}

function getTimeZoneOffsetMs(date: Date, timeZone: string): number {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const values: Record<string, string> = {};
  for (const part of formatter.formatToParts(date)) {
    if (part.type !== 'literal') {
      values[part.type] = part.value;
    }
  }

  const hour = Number(values.hour === '24' ? '0' : values.hour);
  const asUtc = Date.UTC(
    Number(values.year),
    Number(values.month) - 1,
    Number(values.day),
    hour,
    Number(values.minute),
    Number(values.second),
  );

  return asUtc - date.getTime();
}
