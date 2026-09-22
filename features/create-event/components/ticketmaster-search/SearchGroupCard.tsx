import { View } from 'react-native';
import Animated, { Easing, FadeInUp } from 'react-native-reanimated';
import { Typography } from '@/components/ui';
import { APP_CARD_BG, APP_DARK_MUTED, APP_DARK_SURFACE } from '@/constants/app-surface';
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
        borderColor: APP_DARK_SURFACE,
        borderRadius: radius.lg,
        backgroundColor: APP_CARD_BG,
        padding: spacing.md,
        gap: spacing.sm,
        ...shadows.sm,
      }}
    >
      <View style={{ gap: 2 }}>
        <Typography style={{ color: colors.white, fontSize: 15, fontWeight: '700' }}>
          {group.title}
        </Typography>
        <Typography style={{ color: APP_DARK_MUTED, fontSize: 12, fontWeight: '600' }}>
          {group.totalShows} {group.totalShows === 1 ? 'Show' : 'Shows'}
        </Typography>
      </View>

      <View
        style={{
          height: 1,
          backgroundColor: APP_DARK_SURFACE,
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
