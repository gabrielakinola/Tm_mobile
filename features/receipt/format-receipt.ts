import { parseEventDateValue } from '@/features/create-event/date-utils';
import { parseEventTimeValue } from '@/features/create-event/time-utils';
import { resolveVenueDisplay } from '@/features/my-events/utils/event-detail';
import { formatCurrencyAmount, normalizeCurrency } from '@/lib/currencies';
import type { MyEventDetail } from '@/services/events/types';

function parseMoney(value: string | null | undefined): number {
  const amount = Number(
    String(value ?? '')
      .replace(/,/g, '')
      .trim(),
  );
  return Number.isFinite(amount) ? amount : 0;
}

export function formatReceiptMoney(
  amount: number,
  currency?: string | null,
  withSymbol = true,
): string {
  if (!withSymbol) return amount.toFixed(2);
  return formatCurrencyAmount(amount, currency);
}

export function formatReceiptShortDate(value: string | null | undefined): string {
  const parsed = value ? parseEventDateValue(value) : null;
  if (!parsed) return '';
  const month = String(parsed.getMonth() + 1).padStart(2, '0');
  const day = String(parsed.getDate()).padStart(2, '0');
  const year = String(parsed.getFullYear()).slice(-2);
  return `${month}/${day}/${year}`;
}

/** Event header date: DD/MM/YY */
export function formatReceiptEventDate(value: string | null | undefined): string {
  const parsed = value ? parseEventDateValue(value) : null;
  if (!parsed) return '';
  const day = String(parsed.getDate()).padStart(2, '0');
  const month = String(parsed.getMonth() + 1).padStart(2, '0');
  const year = String(parsed.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
}

/** Event header time: HH:MM AM/PM */
export function formatReceiptEventTime(value: string | null | undefined): string {
  const parsed = value ? parseEventTimeValue(value) : null;
  if (!parsed) return value?.trim() ?? '';
  const hours = String(parsed.hour12).padStart(2, '0');
  const minutes = String(parsed.minutes).padStart(2, '0');
  return `${hours}:${minutes} ${parsed.meridiem}`;
}

export function formatReceiptEventWhen(eventDate: string, eventTime: string): string {
  const dateLabel = formatReceiptEventDate(eventDate);
  const timeLabel = formatReceiptEventTime(eventTime);
  if (dateLabel && timeLabel) return `${dateLabel} - ${timeLabel}`;
  return dateLabel || timeLabel;
}

export function formatReceiptVenueLine(venue: string, location?: string): string {
  const resolved = resolveVenueDisplay(venue, location);
  if (resolved.location) {
    return `${resolved.venue} - ${resolved.location}`;
  }
  return resolved.venue;
}

export function formatReceiptTicketSeat(ticket: {
  section: string;
  row?: string;
  seat?: string;
}): string {
  const section = ticket.section.trim() || 'GA';
  const row = ticket.row?.trim() || section;
  return `Section ${section}  Row ${row}`;
}

export function formatReceiptPaymentMethod(
  method: string | null | undefined,
  last4: string | null | undefined,
): string {
  const brand = method?.trim() ?? '';
  const digits = last4?.trim() ?? '';
  if (brand && digits) return `${brand} •••• ${digits}`;
  return brand;
}

export function buildReceiptTotals(event: MyEventDetail) {
  const ticketCount = event.tickets.length;
  const unitPrice = parseMoney(event.price);
  const unitFee = parseMoney(event.fee);
  const subtotal = unitPrice * ticketCount;
  const fees = unitFee * ticketCount;
  const total = subtotal + fees;
  const currency = normalizeCurrency(event.currency);

  return {
    ticketCount,
    unitPrice,
    unitFee,
    subtotal,
    fees,
    total,
    currency,
    totalLabel: `${currency} ${formatReceiptMoney(total, currency)}`,
    subtotalLabel: `${currency} ${formatReceiptMoney(subtotal, currency)}`,
  };
}

export function formatReceiptBillingCityLine(
  event: Pick<MyEventDetail, 'billingCity' | 'billingState' | 'billingPostalCode'>,
): string {
  const city = event.billingCity?.trim() ?? '';
  const state = event.billingState?.trim() ?? '';
  const zip = event.billingPostalCode?.trim() ?? '';
  const left = [city.toUpperCase(), state.toUpperCase()].filter(Boolean).join(', ');
  return [left, zip].filter(Boolean).join(' ');
}
