import { Pressable, View } from 'react-native';
import { Image } from 'expo-image';
import { Eye, Pencil, Trash2 } from 'lucide-react-native';
import { Typography } from '@/components/ui';
import type { MyEventSummary } from '@/services/events/types';
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

export interface ManageEventCardProps {
  event: MyEventSummary;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  deleting?: boolean;
}

export function ManageEventCard({
  event,
  onView,
  onEdit,
  onDelete,
  deleting = false,
}: ManageEventCardProps) {
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
        style={{ width: 96, alignSelf: 'stretch' }}
        contentFit="cover"
        transition={150}
      />

      <View style={{ flex: 1, padding: spacing.md, gap: spacing.sm }}>
        <Pressable accessibilityRole="button" onPress={onView} style={{ gap: 2 }}>
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
        </Pressable>

        <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: 'auto' }}>
          <ActionChip
            label="View"
            icon={<Eye size={14} color={colors.pulse[700]} strokeWidth={2.2} />}
            onPress={onView}
          />
          <ActionChip
            label="Edit"
            icon={<Pencil size={14} color={colors.pulse[700]} strokeWidth={2.2} />}
            onPress={onEdit}
          />
          <ActionChip
            label="Delete"
            icon={<Trash2 size={14} color={colors.error[500]} strokeWidth={2.2} />}
            onPress={onDelete}
            destructive
            disabled={deleting}
          />
        </View>
      </View>
    </View>
  );
}

function ActionChip({
  label,
  icon,
  onPress,
  destructive = false,
  disabled = false,
}: {
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
  destructive?: boolean;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: spacing.sm,
        paddingVertical: 6,
        borderRadius: radius.sm,
        backgroundColor: destructive ? colors.error[50] : colors.pulse[50],
        opacity: disabled ? 0.6 : 1,
      }}
    >
      {icon}
      <Typography
        style={{
          color: destructive ? colors.error[500] : colors.pulse[700],
          fontSize: 12,
          fontWeight: '700',
        }}
      >
        {label}
      </Typography>
    </Pressable>
  );
}
