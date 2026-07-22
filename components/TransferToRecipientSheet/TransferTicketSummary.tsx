import { memo, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { EventTicket, TicketMode } from '@/services/events/types';
import { colors, spacing } from '@/theme/tokens';

export interface TransferTicketSummaryProps {
  tickets: EventTicket[];
  ticketMode: TicketMode;
}

function buildSeatParts(
  tickets: EventTicket[],
  ticketMode: TicketMode,
): { label: string; value: string }[] {
  if (tickets.length === 0) {
    return [];
  }

  const first = tickets[0];

  if (ticketMode === 'ga') {
    return first.section
      ? [{ label: 'Sec', value: first.section }]
      : [{ label: '', value: 'General Admission' }];
  }

  const seats = tickets
    .map((ticket) => ticket.seat?.trim())
    .filter((seat): seat is string => Boolean(seat))
    .join(', ');

  return [
    first.section?.trim() ? { label: 'Sec', value: first.section.trim() } : null,
    first.row?.trim() ? { label: 'Row', value: first.row.trim() } : null,
    seats ? { label: 'Seat', value: seats } : null,
  ].filter((part): part is { label: string; value: string } => part != null);
}

export const TransferTicketSummary = memo(function TransferTicketSummary({
  tickets,
  ticketMode,
}: TransferTicketSummaryProps) {
  const count = tickets.length;
  const countLabel = `${count} ${count === 1 ? 'Ticket' : 'Tickets'} Selected`;
  const seatParts = useMemo(() => buildSeatParts(tickets, ticketMode), [ticketMode, tickets]);

  return (
    <View style={styles.container}>
      <Text style={styles.count}>{countLabel}</Text>
      {seatParts.length > 0 ? (
        <Text style={styles.seatLine}>
          {seatParts.map((part, index) => (
            <Text key={`${part.label}-${part.value}`}>
              {index > 0 ? ' ' : null}
              {part.label ? <Text style={styles.seatLabel}>{part.label} </Text> : null}
              <Text style={styles.seatValue}>{part.value}</Text>
            </Text>
          ))}
        </Text>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  count: {
    color: colors.neutral[950],
    fontSize: 16,
    fontWeight: '700',
  },
  seatLine: {
    color: colors.neutral[950],
    fontSize: 14,
    lineHeight: 20,
  },
  seatLabel: {
    fontWeight: '400',
  },
  seatValue: {
    fontWeight: '700',
  },
});
