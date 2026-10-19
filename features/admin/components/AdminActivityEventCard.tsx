import { Pressable, View } from 'react-native';
import { Image } from 'expo-image';
import { ArrowLeftRight, Camera } from 'lucide-react-native';
import { Typography } from '@/components/ui';
import {
  APP_CARD_BG,
  APP_DARK_MUTED,
  APP_DARK_SURFACE,
  APP_INPUT_BG,
} from '@/constants/app-surface';
import type { AdminUserActivityEvent, AdminUserTopEvent } from '@/services/admin/admin.api';
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

function formatClock(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

function MetricBadge({ icon, value }: { icon: React.ReactNode; value: number }) {
  return (
    <View
      style={{
        marginTop: spacing.xs,
        alignSelf: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        borderRadius: radius.full,
        backgroundColor: 'rgba(2, 108, 223, 0.18)',
      }}
    >
      {icon}
      <Typography style={{ color: colors.pulse[300], fontSize: 13, fontWeight: '700' }}>
        {value}
      </Typography>
    </View>
  );
}

function EventCardShell({ imageUrl, children }: { imageUrl: string; children: React.ReactNode }) {
  return (
    <View
      style={{
        backgroundColor: APP_CARD_BG,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: APP_DARK_SURFACE,
        overflow: 'hidden',
        flexDirection: 'row',
        minHeight: 100,
      }}
    >
      <Image
        source={{ uri: imageUrl }}
        style={{ width: 84, alignSelf: 'stretch' }}
        contentFit="cover"
        transition={150}
      />
      <View style={{ flex: 1, padding: spacing.md, gap: 4 }}>{children}</View>
    </View>
  );
}

export function AdminActivityEventCard({ event }: { event: AdminUserActivityEvent }) {
  return (
    <EventCardShell imageUrl={event.imageUrl}>
      <Typography
        style={{ color: colors.white, fontSize: 15, fontWeight: '700' }}
        numberOfLines={2}
      >
        {event.name}
      </Typography>
      <Typography style={{ color: APP_DARK_MUTED, fontSize: 13 }} numberOfLines={1}>
        {event.venue}
      </Typography>
      <Typography style={{ color: colors.neutral[400], fontSize: 12 }} numberOfLines={1}>
        {formatEventDate(event.eventDate)}
        {event.eventTime ? ` · ${event.eventTime}` : ''}
      </Typography>
      {event.lastTransferAt ? (
        <Typography style={{ color: colors.neutral[500], fontSize: 12 }}>
          Last transfer {formatClock(event.lastTransferAt)}
        </Typography>
      ) : null}

      <MetricBadge
        icon={<ArrowLeftRight size={13} color={colors.pulse[300]} strokeWidth={2.4} />}
        value={event.transferCount}
      />
    </EventCardShell>
  );
}

export function AdminTopEventCard({ event }: { event: AdminUserTopEvent }) {
  return (
    <EventCardShell imageUrl={event.imageUrl}>
      <Typography
        style={{ color: colors.white, fontSize: 15, fontWeight: '700' }}
        numberOfLines={2}
      >
        {event.name}
      </Typography>
      <Typography style={{ color: APP_DARK_MUTED, fontSize: 13 }} numberOfLines={1}>
        {event.venue}
      </Typography>
      <Typography style={{ color: colors.neutral[400], fontSize: 12 }} numberOfLines={1}>
        {formatEventDate(event.eventDate)}
        {event.eventTime ? ` · ${event.eventTime}` : ''}
      </Typography>

      <MetricBadge
        icon={<Camera size={13} color={colors.pulse[300]} strokeWidth={2.4} />}
        value={event.captureCount}
      />
    </EventCardShell>
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
        borderColor: selected ? colors.pulse[500] : APP_DARK_SURFACE,
        backgroundColor: selected ? 'rgba(2, 108, 223, 0.18)' : APP_INPUT_BG,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: spacing.md,
      }}
    >
      <Typography
        style={{
          color: selected ? colors.pulse[300] : colors.neutral[300],
          fontSize: 13,
          fontWeight: selected ? '700' : '600',
        }}
      >
        {label}
      </Typography>
    </Pressable>
  );
}
