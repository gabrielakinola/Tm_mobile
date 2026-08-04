import { Pressable, View } from 'react-native';
import { Image } from 'expo-image';
import { Eye, EyeOff, Pencil, Ticket, Trash2 } from 'lucide-react-native';
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
    day: '2-digit',
    year: 'numeric',
  }).format(parsed);
}

export interface ManageEventCardProps {
  event: MyEventSummary;
  onView: () => void;
  onEdit: () => void;
  onToggleHidden: () => void;
  onDelete: () => void;
  togglingHidden?: boolean;
  deleting?: boolean;
}

export function ManageEventCard({
  event,
  onView,
  onEdit,
  onToggleHidden,
  onDelete,
  togglingHidden = false,
  deleting = false,
}: ManageEventCardProps) {
  const isHidden = event.hidden === true;

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
        opacity: isHidden ? 0.85 : 1,
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
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm }}>
            <Typography
              style={{
                flex: 1,
                color: colors.neutral[950],
                fontSize: 16,
                fontWeight: '700',
              }}
              numberOfLines={2}
            >
              {event.name}
            </Typography>
            {isHidden ? (
              <View
                style={{
                  paddingHorizontal: spacing.sm,
                  paddingVertical: 2,
                  borderRadius: radius.sm,
                  backgroundColor: colors.neutral[100],
                }}
              >
                <Typography style={{ color: colors.neutral[600], fontSize: 11, fontWeight: '700' }}>
                  Hidden
                </Typography>
              </View>
            ) : null}
          </View>
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
          <IconAction
            label="View"
            icon={<Ticket size={16} color={colors.pulse[700]} strokeWidth={2.2} />}
            onPress={onView}
          />
          <IconAction
            label="Edit"
            icon={<Pencil size={16} color={colors.pulse[700]} strokeWidth={2.2} />}
            onPress={onEdit}
          />
          <IconAction
            label={isHidden ? 'Unhide' : 'Hide'}
            icon={
              isHidden ? (
                <Eye size={16} color={colors.pulse[700]} strokeWidth={2.2} />
              ) : (
                <EyeOff size={16} color={colors.pulse[700]} strokeWidth={2.2} />
              )
            }
            onPress={onToggleHidden}
            disabled={togglingHidden}
          />
          <IconAction
            label="Delete"
            icon={<Trash2 size={16} color={colors.error[500]} strokeWidth={2.2} />}
            onPress={onDelete}
            destructive
            disabled={deleting}
          />
        </View>
      </View>
    </View>
  );
}

function IconAction({
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
      hitSlop={6}
      style={{
        width: 36,
        height: 36,
        borderRadius: radius.sm,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: destructive ? colors.error[50] : colors.pulse[50],
        opacity: disabled ? 0.6 : 1,
      }}
    >
      {icon}
    </Pressable>
  );
}
