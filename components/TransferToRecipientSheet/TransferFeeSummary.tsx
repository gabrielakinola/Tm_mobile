import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import type { TransferRecipientFormValues } from '@/components/TransferToRecipientSheet/TransferRecipientForm';
import { Typography } from '@/components/ui/Typography';
import {
  formatTransferSeatLine,
  formatUsdAmount,
  parseTransferFeeAmount,
} from '@/features/transfers/utils/transfer-fee.util';
import type { EventTicket, TicketMode } from '@/services/events/types';
import { colors, spacing } from '@/theme/tokens';

export interface TransferEventSummary {
  name: string;
  eventDate: string;
  eventTime: string;
  venue: string;
}

export interface TransferFeeSummaryProps {
  event: TransferEventSummary;
  tickets: EventTicket[];
  ticketMode: TicketMode;
  recipient: TransferRecipientFormValues;
  transferFeePerTicket: string;
}

function formatEventDate(value: string): string {
  if (!value.trim()) {
    return '';
  }

  const parsed = new Date(`${value.trim()}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return value.trim();
  }

  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).format(parsed);
}

function formatEventDateLine(event: TransferEventSummary): string {
  const date = formatEventDate(event.eventDate);
  const time = event.eventTime.trim();
  if (date && time) {
    return `${date} • ${time}`;
  }
  return date || time;
}

export const TransferFeeSummary = memo(function TransferFeeSummary({
  event,
  tickets,
  ticketMode,
  recipient,
  transferFeePerTicket,
}: TransferFeeSummaryProps) {
  const feePerTicket = parseTransferFeeAmount(transferFeePerTicket);
  const total = feePerTicket * tickets.length;
  const recipientName = `${recipient.firstName} ${recipient.lastName}`.trim();
  const eventDateLine = formatEventDateLine(event);
  const eventVenue = event.venue.trim();

  return (
    <BottomSheetScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <SummarySection title="Event">
        <Typography style={styles.eventName}>{event.name}</Typography>
        {eventDateLine ? <Typography style={styles.bodyText}>{eventDateLine}</Typography> : null}
        {eventVenue ? <Typography style={styles.bodyText}>{eventVenue}</Typography> : null}
      </SummarySection>

      <SummarySection title={ticketMode === 'ga' ? 'General Admission' : 'Seats'}>
        {tickets.map((ticket, index) => (
          <Typography
            key={`${ticket.section}-${ticket.row}-${ticket.seat}-${index}`}
            style={styles.bodyText}
          >
            {formatTransferSeatLine(ticket, ticketMode, index)}
          </Typography>
        ))}
      </SummarySection>

      <SummarySection title="Transfer">
        <SummaryLabelValueRow label="Name" value={recipientName || '—'} />
        <SummaryLabelValueRow label="Email" value={recipient.contact.trim() || '—'} />
        <SummaryLabelValueRow
          label="Notes"
          value={recipient.note.trim() || '—'}
          valueMuted={!recipient.note.trim()}
        />
      </SummarySection>

      <View style={styles.feeBlock}>
        <SummaryLabelValueRow label="Fee (per ticket)" value={formatUsdAmount(feePerTicket)} />
        <SummaryLabelValueRow label="Quantity" value={`x${tickets.length}`} />
        <View style={styles.feeDivider} />
        <SummaryLabelValueRow label="Total Fee" value={formatUsdAmount(total)} emphasis />
      </View>
    </BottomSheetScrollView>
  );
});

function SummarySection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Typography style={styles.sectionTitle}>{title}</Typography>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

function SummaryLabelValueRow({
  label,
  value,
  emphasis = false,
  valueMuted = false,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
  valueMuted?: boolean;
}) {
  return (
    <View style={styles.labelValueRow}>
      <Typography style={[styles.rowLabel, emphasis && styles.rowLabelEmphasis]}>
        {label}
      </Typography>
      <Typography
        style={[
          styles.rowValue,
          emphasis && styles.rowValueEmphasis,
          valueMuted && styles.rowValueMuted,
        ]}
        numberOfLines={3}
      >
        {value}
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
    gap: spacing.lg,
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    color: colors.neutral[950],
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  sectionBody: {
    gap: spacing.xs,
  },
  eventName: {
    color: colors.neutral[950],
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  },
  bodyText: {
    color: colors.neutral[700],
    fontSize: 15,
    lineHeight: 22,
  },
  labelValueRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
    minHeight: 22,
  },
  rowLabel: {
    color: colors.neutral[700],
    fontSize: 15,
    lineHeight: 22,
    flexShrink: 0,
  },
  rowLabelEmphasis: {
    color: colors.neutral[950],
    fontWeight: '700',
  },
  rowValue: {
    color: colors.neutral[950],
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '600',
    flexShrink: 1,
    maxWidth: '55%',
    textAlign: 'right',
  },
  rowValueEmphasis: {
    fontSize: 16,
    fontWeight: '800',
  },
  rowValueMuted: {
    color: colors.neutral[500],
    fontWeight: '500',
    fontStyle: 'italic',
  },
  feeBlock: {
    gap: spacing.sm,
    paddingTop: spacing.sm,
  },
  feeDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.neutral[300],
    marginVertical: spacing.xs,
  },
});
