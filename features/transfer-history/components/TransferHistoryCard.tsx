import { Pressable, View } from 'react-native';
import { Image } from 'expo-image';
import { ChevronRight, Trash2 } from 'lucide-react-native';
import { Typography } from '@/components/ui';
import {
  TRANSFER_STATUS_LABELS,
  type TransferHistoryItem,
} from '@/services/transfers/transfers.api';
import { colors, radius, spacing } from '@/theme/tokens';

function formatEventDate(value: string): string {
  if (!value) return '';
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(parsed);
}

function formatTransferredAt(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return '';
  }
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(parsed);
}

export interface TransferHistoryCardProps {
  transfer: TransferHistoryItem;
  onPress: () => void;
  onDelete: () => void;
  deleting?: boolean;
}

export function TransferHistoryCard({
  transfer,
  onPress,
  onDelete,
  deleting = false,
}: TransferHistoryCardProps) {
  const event = transfer.event;
  const imageUrl = event?.imageUrl;
  const eventName = event?.name || 'Event unavailable';
  const venue = event?.venue || 'Venue unavailable';
  const ticketLabel = `${transfer.ticketCount} ticket${transfer.ticketCount === 1 ? '' : 's'}`;
  const statusLabel = TRANSFER_STATUS_LABELS[transfer.status] ?? transfer.status;

  return (
    <View
      style={{
        backgroundColor: colors.white,
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: colors.neutral[200],
        overflow: 'hidden',
        flexDirection: 'row',
        minHeight: 104,
        opacity: deleting ? 0.7 : 1,
      }}
    >
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={{ width: 96, alignSelf: 'stretch' }}
          contentFit="cover"
          transition={150}
        />
      ) : (
        <View
          style={{
            width: 96,
            alignSelf: 'stretch',
            backgroundColor: colors.neutral[200],
          }}
        />
      )}

      <View style={{ flex: 1, padding: spacing.md, gap: spacing.xs }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`View transfer details for ${transfer.recipient.name}`}
          accessibilityHint="Opens full transfer details"
          onPress={onPress}
          style={{ gap: spacing.xs }}
        >
          <Typography
            style={{ color: colors.neutral[950], fontSize: 16, fontWeight: '700' }}
            numberOfLines={2}
          >
            {eventName}
          </Typography>

          <Typography style={{ color: colors.neutral[500], fontSize: 13 }} numberOfLines={1}>
            {venue}
          </Typography>

          {event ? (
            <Typography style={{ color: colors.neutral[600], fontSize: 12 }}>
              {formatEventDate(event.eventDate)}
              {event.eventTime ? ` · ${event.eventTime}` : ''}
            </Typography>
          ) : null}

          <View
            style={{
              marginTop: spacing.xs,
              paddingTop: spacing.xs,
              borderTopWidth: 1,
              borderTopColor: colors.neutral[100],
              gap: 2,
            }}
          >
            <Typography style={{ color: colors.neutral[900], fontSize: 13, fontWeight: '700' }}>
              To {transfer.recipient.name}
            </Typography>
            <Typography style={{ color: colors.neutral[500], fontSize: 12 }} numberOfLines={1}>
              {transfer.recipient.email}
            </Typography>
            <Typography style={{ color: colors.neutral[600], fontSize: 12 }}>
              {ticketLabel}
              {transfer.transferredAt ? ` · ${formatTransferredAt(transfer.transferredAt)}` : ''}
              {` · ${statusLabel}`}
            </Typography>
          </View>
        </Pressable>

        <View
          style={{
            marginTop: spacing.xs,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: spacing.sm,
          }}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`View transfer details for ${transfer.recipient.name}`}
            onPress={onPress}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 2, flexShrink: 1 }}
          >
            <Typography style={{ color: colors.pulse[600], fontSize: 12, fontWeight: '700' }}>
              Tap to view details
            </Typography>
            <ChevronRight size={14} color={colors.pulse[600]} strokeWidth={2.4} />
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Delete transfer"
            disabled={deleting}
            onPress={onDelete}
            hitSlop={6}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
              paddingHorizontal: spacing.sm,
              paddingVertical: 6,
              borderRadius: radius.sm,
              backgroundColor: colors.error[50],
              opacity: deleting ? 0.6 : 1,
            }}
          >
            <Trash2 size={14} color={colors.error[500]} strokeWidth={2.2} />
            <Typography style={{ color: colors.error[500], fontSize: 12, fontWeight: '700' }}>
              Delete
            </Typography>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
