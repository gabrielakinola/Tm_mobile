import { Pressable, View } from 'react-native';
import { Image } from 'expo-image';
import { ArrowLeftRight } from 'lucide-react-native';
import { Typography } from '@/components/ui';
import type { AdminUserActivityEvent } from '@/services/admin/admin.api';
import { colors, radius, spacing } from '@/theme/tokens';

function formatEventDate(value: string): string {
  if (!value) return '';
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).format(parsed);
}

function formatCreatedTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

export function AdminActivityEventCard({ event }: { event: AdminUserActivityEvent }) {
  const transferLabel = `${event.transferCount} transfer${event.transferCount === 1 ? '' : 's'}`;

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
      }}
    >
      <Image
        source={{ uri: event.imageUrl }}
        style={{ width: 88, alignSelf: 'stretch' }}
        contentFit="cover"
        transition={150}
      />

      <View style={{ flex: 1, padding: spacing.md, gap: spacing.xs }}>
        <Typography
          style={{ color: colors.neutral[950], fontSize: 16, fontWeight: '700' }}
          numberOfLines={2}
        >
          {event.name}
        </Typography>
        <Typography style={{ color: colors.neutral[500], fontSize: 13 }} numberOfLines={1}>
          {event.venue}
        </Typography>
        <Typography style={{ color: colors.neutral[600], fontSize: 12 }}>
          {formatEventDate(event.eventDate)}
          {event.eventTime ? ` · ${event.eventTime}` : ''}
          {` · ${event.ticketCount} ticket${event.ticketCount === 1 ? '' : 's'}`}
        </Typography>
        {event.createdAt ? (
          <Typography style={{ color: colors.neutral[400], fontSize: 12 }}>
            Created {formatCreatedTime(event.createdAt)}
          </Typography>
        ) : null}

        <View
          style={{
            marginTop: spacing.xs,
            alignSelf: 'flex-start',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            paddingHorizontal: spacing.sm,
            paddingVertical: 4,
            borderRadius: radius.full,
            backgroundColor: colors.pulse[50],
          }}
        >
          <ArrowLeftRight size={13} color={colors.pulse[700]} strokeWidth={2.4} />
          <Typography style={{ color: colors.pulse[700], fontSize: 12, fontWeight: '700' }}>
            {transferLabel}
          </Typography>
        </View>
      </View>
    </View>
  );
}

export function SortChip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={{
        flex: 1,
        minHeight: 40,
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: selected ? colors.pulse[600] : colors.neutral[200],
        backgroundColor: selected ? colors.pulse[50] : colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: spacing.md,
      }}
    >
      <Typography
        style={{
          color: selected ? colors.pulse[700] : colors.neutral[700],
          fontSize: 13,
          fontWeight: selected ? '700' : '600',
        }}
      >
        {label}
      </Typography>
    </Pressable>
  );
}
