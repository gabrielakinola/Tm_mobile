import { Pressable, View } from 'react-native';
import { Image } from 'expo-image';
import { Eye, EyeOff, Pencil, Receipt, Ticket, Trash2 } from 'lucide-react-native';
import { Typography } from '@/components/ui';
import {
  APP_CARD_BG,
  APP_DARK_BG,
  APP_DARK_MUTED,
  APP_DARK_SURFACE,
} from '@/constants/app-surface';
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
  onReceipt: () => void;
  onEdit: () => void;
  onToggleHidden: () => void;
  onDelete: () => void;
  togglingHidden?: boolean;
  deleting?: boolean;
}

export function ManageEventCard({
  event,
  onView,
  onReceipt,
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
        backgroundColor: APP_CARD_BG,
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: APP_DARK_SURFACE,
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
                color: colors.white,
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
                  backgroundColor: APP_DARK_BG,
                }}
              >
                <Typography style={{ color: APP_DARK_MUTED, fontSize: 11, fontWeight: '700' }}>
                  Hidden
                </Typography>
              </View>
            ) : null}
          </View>
          <Typography style={{ color: APP_DARK_MUTED, fontSize: 13 }} numberOfLines={1}>
            {event.venue}
          </Typography>
          <Typography style={{ color: APP_DARK_MUTED, fontSize: 12 }}>
            {formatEventDate(event.eventDate)}
            {event.eventTime ? ` · ${event.eventTime}` : ''}
            {` · ${event.ticketCount} ticket${event.ticketCount === 1 ? '' : 's'}`}
          </Typography>
        </Pressable>

        <View
          style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: 'auto' }}
        >
          <IconAction
            label="View"
            icon={<Ticket size={16} color={colors.pulse[400]} strokeWidth={2.2} />}
            onPress={onView}
          />
          <IconAction
            label="View receipt"
            icon={<Receipt size={16} color={colors.pulse[400]} strokeWidth={2.2} />}
            onPress={onReceipt}
          />
          <IconAction
            label="Edit"
            icon={<Pencil size={16} color={colors.pulse[400]} strokeWidth={2.2} />}
            onPress={onEdit}
          />
          <IconAction
            label={isHidden ? 'Unhide' : 'Hide'}
            icon={
              isHidden ? (
                <Eye size={16} color={colors.pulse[400]} strokeWidth={2.2} />
              ) : (
                <EyeOff size={16} color={colors.pulse[400]} strokeWidth={2.2} />
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
        backgroundColor: destructive ? 'rgba(239, 68, 68, 0.18)' : APP_DARK_SURFACE,
        opacity: disabled ? 0.6 : 1,
      }}
    >
      {icon}
    </Pressable>
  );
}
