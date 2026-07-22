import { View } from 'react-native';
import Animated, { Easing, FadeInUp } from 'react-native-reanimated';
import { Typography } from '@/components/ui';
import type { TicketmasterSearchGroup } from '@/services/ticketmaster/types';
import { colors, radius, shadows, spacing } from '@/theme/tokens';
import { SearchShowRow } from './SearchShowRow';

interface SearchGroupCardProps {
  group: TicketmasterSearchGroup;
  index: number;
  activeShowId?: string;
  onSelectShow: (showId: string) => void;
}

export function SearchGroupCard({
  group,
  index,
  activeShowId,
  onSelectShow,
}: SearchGroupCardProps) {
  return (
    <Animated.View
      entering={FadeInUp.duration(220)
        .delay(Math.min(index * 40, 240))
        .easing(Easing.out(Easing.cubic))}
      style={{
        borderWidth: 1,
        borderColor: colors.neutral[200],
        borderRadius: radius.lg,
        backgroundColor: colors.white,
        padding: spacing.md,
        gap: spacing.sm,
        ...shadows.sm,
      }}
    >
      <View style={{ gap: 2 }}>
        <Typography style={{ color: colors.neutral[900], fontSize: 15, fontWeight: '700' }}>
          {group.title}
        </Typography>
        <Typography style={{ color: colors.neutral[500], fontSize: 12, fontWeight: '600' }}>
          {group.totalShows} {group.totalShows === 1 ? 'Show' : 'Shows'}
        </Typography>
      </View>

      <View
        style={{
          height: 1,
          backgroundColor: colors.neutral[200],
          marginVertical: 2,
        }}
      />

      <View style={{ gap: spacing.xs }}>
        {group.shows.map((show) => (
          <SearchShowRow
            key={show.id}
            show={show}
            onSelect={onSelectShow}
            isLoading={activeShowId === show.id}
          />
        ))}
      </View>
    </Animated.View>
  );
}
