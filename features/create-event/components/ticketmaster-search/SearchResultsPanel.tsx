import { memo } from 'react';
import { ScrollView, View } from 'react-native';
import Animated, { Easing, FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import type { TicketmasterSearchGroup } from '@/services/ticketmaster/types';
import { colors, radius, spacing } from '@/theme/tokens';
import { SearchEmptyState } from './SearchEmptyState';
import { SearchGroupCard } from './SearchGroupCard';
import { SearchSkeleton } from './SearchSkeleton';

interface SearchResultsPanelProps {
  visible: boolean;
  isLoading: boolean;
  groups: TicketmasterSearchGroup[];
  activeShowId?: string;
  onSelectShow: (showId: string) => void;
}

const panelLayout = LinearTransition.duration(260).easing(Easing.out(Easing.cubic));

export const SearchResultsPanel = memo(function SearchResultsPanel({
  visible,
  isLoading,
  groups,
  activeShowId,
  onSelectShow,
}: SearchResultsPanelProps) {
  if (!visible) {
    return null;
  }

  return (
    <Animated.View
      entering={FadeIn.duration(180)}
      exiting={FadeOut.duration(180)}
      layout={panelLayout}
      style={{
        marginTop: spacing.sm,
        borderWidth: 1,
        borderColor: colors.neutral[200],
        borderRadius: radius.lg,
        backgroundColor: colors.white,
        maxHeight: 380,
        overflow: 'hidden',
      }}
    >
      <ScrollView
        nestedScrollEnabled
        keyboardShouldPersistTaps="handled"
        style={{ maxHeight: 380 }}
        contentContainerStyle={{
          padding: spacing.sm,
          gap: spacing.sm,
        }}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <Animated.View
            key="search-loading"
            entering={FadeIn.duration(140)}
            exiting={FadeOut.duration(140)}
            style={{ gap: spacing.sm }}
          >
            <SearchSkeleton />
            <SearchSkeleton />
          </Animated.View>
        ) : groups.length > 0 ? (
          <Animated.View
            key="search-results"
            entering={FadeIn.duration(180)}
            exiting={FadeOut.duration(120)}
            style={{ gap: spacing.sm }}
          >
            {groups.map((group, index) => (
              <SearchGroupCard
                key={`${group.title}-${index}`}
                group={group}
                index={index}
                activeShowId={activeShowId}
                onSelectShow={onSelectShow}
              />
            ))}
          </Animated.View>
        ) : (
          <Animated.View
            key="search-empty"
            entering={FadeIn.duration(180)}
            exiting={FadeOut.duration(120)}
          >
            <SearchEmptyState />
          </Animated.View>
        )}
      </ScrollView>
    </Animated.View>
  );
});
