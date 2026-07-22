import { useState } from 'react';
import { FlatList, Pressable, RefreshControl, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { CalendarDays } from 'lucide-react-native';
import { CountryFlagBadge } from '@/components/navigation/CountryFlagBadge';
import { EmptyState, ErrorState, LoadingState, Typography } from '@/components/ui';
import { SCREEN_HEADER_BG } from '@/constants/screen-header';
import {
  MY_EVENT_CARD_GAP,
  MY_EVENT_CARD_SIDE_MARGIN,
  MyEventCard,
} from '@/features/my-events/components/MyEventCard';
import { MyEventsTabs, type MyEventsTabKey } from '@/features/my-events/components/MyEventsTabs';
import { useMyEventsPrefetch } from '@/hooks/events/useMyEvents';
import { useAuthStore } from '@/stores/auth-store';
import { useProfileStore } from '@/stores/profile-store';
import { colors, spacing } from '@/theme/tokens';

export default function TicketsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<MyEventsTabKey>('upcoming');
  const { upcomingQuery, pastQuery, upcomingCount, pastCount } = useMyEventsPrefetch();
  const defaultProfile = useProfileStore((state) => state.defaultProfile);
  const user = useAuthStore((state) => state.user);
  const countryCode = defaultProfile?.country || user?.defaultProfile?.country || 'US';

  const activeQuery = activeTab === 'upcoming' ? upcomingQuery : pastQuery;
  const events = activeQuery.data?.events ?? [];
  const isInitialLoading = activeQuery.isLoading && events.length === 0;

  const handleRefresh = () => {
    void upcomingQuery.refetch();
    void pastQuery.refetch();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.neutral[0] }}>
      <View style={{ backgroundColor: SCREEN_HEADER_BG, paddingTop: insets.top }}>
        <View
          style={{
            minHeight: 52,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: spacing.lg,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: spacing.sm,
            }}
          >
            <Typography
              style={{
                color: colors.white,
                fontSize: 17,
                lineHeight: 22,
                fontWeight: '700',
              }}
            >
              My Events
            </Typography>
            <CountryFlagBadge countryCode={countryCode} />
          </View>

          <Pressable
            accessibilityRole="button"
            hitSlop={8}
            style={{
              position: 'absolute',
              right: spacing.lg,
            }}
          >
            <Typography
              style={{
                color: colors.white,
                fontSize: 15,
                lineHeight: 20,
                fontWeight: '600',
              }}
            >
              Help
            </Typography>
          </Pressable>
        </View>

        <MyEventsTabs
          activeTab={activeTab}
          upcomingCount={upcomingCount}
          pastCount={pastCount}
          onChange={setActiveTab}
        />
      </View>

      {isInitialLoading ? (
        <LoadingState message="Loading your events..." />
      ) : activeQuery.isError ? (
        <ErrorState onRetry={handleRefresh} />
      ) : events.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title={activeTab === 'upcoming' ? 'No upcoming events' : 'No past events'}
          description={
            activeTab === 'upcoming'
              ? 'Events you create will appear here.'
              : 'Past events will show up here after their date.'
          }
        />
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MyEventCard event={item} onPress={() => router.push(`/my-events/${item.id}`)} />
          )}
          ItemSeparatorComponent={() => (
            <View style={{ height: MY_EVENT_CARD_GAP, backgroundColor: colors.neutral[0] }} />
          )}
          contentContainerStyle={{
            paddingHorizontal: MY_EVENT_CARD_SIDE_MARGIN,
            paddingTop: spacing.md,
            paddingBottom: spacing.lg + insets.bottom,
          }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={activeQuery.isRefetching && !activeQuery.isLoading}
              onRefresh={handleRefresh}
              tintColor={colors.pulse[600]}
            />
          }
        />
      )}
    </View>
  );
}
