import { Pressable, View } from 'react-native';
import { Typography } from '@/components/ui';
import type { TicketmasterShow } from '@/services/ticketmaster/types';
import { colors, radius, spacing } from '@/theme/tokens';

interface SearchShowRowProps {
  show: TicketmasterShow;
  onSelect: (showId: string) => void;
  isLoading: boolean;
}

function formatLocation(show: TicketmasterShow): string {
  if (show.city && show.state) {
    return `${show.city}, ${show.state}`;
  }

  return show.city || show.state || '';
}

function formatDate(date: string): string {
  if (!date) {
    return '';
  }

  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).format(parsed);
}

function formatTime(time?: string): string {
  if (!time) {
    return 'Time TBA';
  }

  const [hoursText, minutesText] = time.split(':');
  const hours = Number(hoursText);
  const minutes = Number(minutesText);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return time;
  }

  const meridiem = hours >= 12 ? 'PM' : 'AM';
  const twelveHour = hours % 12 || 12;

  return `${twelveHour}:${String(minutes).padStart(2, '0')}${meridiem}`;
}

export function SearchShowRow({ show, onSelect, isLoading }: SearchShowRowProps) {
  const location = formatLocation(show);
  const venueLine = location ? `${show.venue} - ${location}` : show.venue;

  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: colors.neutral[200],
        borderRadius: radius.md,
        backgroundColor: colors.neutral[50],
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs + 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: spacing.sm,
      }}
    >
      <View style={{ flex: 1, gap: 3 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
          <Typography style={{ color: colors.neutral[900], fontSize: 12, fontWeight: '700' }}>
            {formatDate(show.date)}
          </Typography>
          <View
            style={{
              width: 4,
              height: 4,
              borderRadius: radius.full,
              backgroundColor: colors.neutral[500],
            }}
          />
          <Typography style={{ color: colors.neutral[900], fontSize: 12, fontWeight: '700' }}>
            {formatTime(show.time)}
          </Typography>
        </View>
        <Typography style={{ color: colors.neutral[600], fontSize: 12 }} numberOfLines={1}>
          {venueLine}
        </Typography>
      </View>
      <Pressable
        disabled={isLoading}
        accessibilityRole="button"
        accessibilityState={{ disabled: isLoading }}
        onPress={() => onSelect(show.id)}
        style={{
          minWidth: 72,
          height: 32,
          borderRadius: radius.sm,
          borderWidth: 1,
          borderColor: colors.neutral[300],
          backgroundColor: colors.neutral[100],
          alignItems: 'center',
          justifyContent: 'center',
          opacity: isLoading ? 0.7 : 1,
        }}
      >
        <Typography style={{ color: colors.neutral[600], fontSize: 12, fontWeight: '700' }}>
          {isLoading ? 'Loading...' : 'Select'}
        </Typography>
      </Pressable>
    </View>
  );
}
