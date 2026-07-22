import { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { MyTicketsTabIcon } from '@/components/navigation/TabBarIcons';
import { Typography } from '@/components/ui/Typography';
import type { EventTicket, TicketMode } from '@/services/events/types';
import { colors, spacing } from '@/theme/tokens';

export interface SelectTicketsMetaRowProps {
  tickets: EventTicket[];
  ticketMode: TicketMode;
}

export const SelectTicketsMetaRow = memo(function SelectTicketsMetaRow({
  tickets,
  ticketMode,
}: SelectTicketsMetaRowProps) {
  const summary = useMemo(() => {
    if (tickets.length === 0) {
      return '';
    }

    const first = tickets[0];
    if (ticketMode === 'ga') {
      return first.section ? `Sec ${first.section}` : 'General Admission';
    }

    const section = first.section ? `Sec ${first.section}` : '';
    const row = first.row ? `Row ${first.row}` : '';
    return [section, row].filter(Boolean).join(', ');
  }, [ticketMode, tickets]);

  const count = tickets.length;
  const countLabel = `${count} ${count === 1 ? 'ticket' : 'tickets'}`;

  return (
    <View style={styles.row}>
      <Typography style={styles.summary} numberOfLines={1}>
        {summary}
      </Typography>
      <View style={styles.countWrap}>
        <MyTicketsTabIcon color={colors.black} size={16} />
        <Typography style={styles.countLabel}>{countLabel}</Typography>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  summary: {
    flex: 1,
    color: colors.neutral[900],
    fontSize: 13,
    fontWeight: '700',
  },
  countWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  countLabel: {
    color: colors.neutral[900],
    fontSize: 13,
    fontWeight: '700',
  },
});
