import { formatCurrencyAmount } from '@/lib/currencies';
import type { EventTicket, TicketMode } from '@/services/events/types';

export function formatTransferSeatLine(
  ticket: EventTicket,
  ticketMode: TicketMode,
  index: number,
): string {
  if (ticketMode === 'ga') {
    return ticket.section?.trim() ? `Section ${ticket.section.trim()}` : `Ticket ${index + 1}`;
  }

  const parts: string[] = [];
  if (ticket.section?.trim()) parts.push(`Section ${ticket.section.trim()}`);
  if (ticket.row?.trim()) parts.push(`Row ${ticket.row.trim()}`);
  if (ticket.seat?.trim()) parts.push(`Seat ${ticket.seat.trim()}`);
  return parts.length > 0 ? parts.join(', ') : `Ticket ${index + 1}`;
}

export function parseTransferFeeAmount(value: string): number {
  const normalized = value.replace(/[^0-9.]/g, '');
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function formatTransferFeeAmount(amount: number, currency?: string | null): string {
  return formatCurrencyAmount(amount, currency);
}
