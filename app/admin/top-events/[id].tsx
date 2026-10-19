import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, RefreshControl, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Camera, ChevronLeft, RefreshCw } from 'lucide-react-native';
import { EmptyState, ErrorState, Header, LoadingState } from '@/components/ui';
import { APP_DARK_BG } from '@/constants/app-surface';
import { AdminTopEventCard } from '@/features/admin/components/AdminActivityEventCard';
import { AdminActivityToolbar } from '@/features/admin/components/AdminActivityToolbar';
import {
  addDays,
  formatEventDateDisplay,
  isSameCalendarDay,
  parseEventDateValue,
  toIsoDateString,
} from '@/features/create-event/date-utils';
import { useAdminUserActivity } from '@/hooks/admin/useAdminUsers';
import type { AdminUserActivitySort, AdminUserTopEvent } from '@/services/admin/admin.api';
import { colors, spacing } from '@/theme/tokens';

export default function AdminUserTopEventsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const userId = typeof id === 'string' ? id : undefined;

  const [dateDisplay, setDateDisplay] = useState(() => formatEventDateDisplay(new Date()));
  const [sort, setSort] = useState<AdminUserActivitySort>('most');
  const selectedDate = useMemo(() => parseEventDateValue(dateDisplay) ?? new Date(), [dateDisplay]);
  const date = useMemo(() => toIsoDateString(selectedDate), [selectedDate]);
  const today = useMemo(() => new Date(), []);
  const canGoNext = !isSameCalendarDay(selectedDate, today) && selectedDate < today;

  const shiftDate = (amount: number) => {
    setDateDisplay(formatEventDateDisplay(addDays(selectedDate, amount)));
  };

  const activityQuery = useAdminUserActivity(userId, date, sort);

  const backAction = (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.back()}
      hitSlop={8}
      style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}
    >
      <ChevronLeft size={24} color={colors.white} strokeWidth={2.2} />
    </Pressable>
  );

  const refreshAction = (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Refresh top events"
      disabled={activityQuery.isRefetching}
      onPress={() => void activityQuery.refetch()}
      hitSlop={8}
      style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}
    >
      {activityQuery.isRefetching ? (
        <ActivityIndicator color={colors.white} size="small" />
      ) : (
        <RefreshCw size={20} color={colors.white} strokeWidth={2.2} />
      )}
    </Pressable>
  );

  const topEvents: AdminUserTopEvent[] = activityQuery.data?.topEvents ?? [];
  const userLabel = activityQuery.data?.user.accountName || activityQuery.data?.user.email || '';

  return (
    <View style={{ flex: 1, backgroundColor: APP_DARK_BG }}>
      <Header title="Top events" leftAction={backAction} rightAction={refreshAction} />

      <FlatList
        data={topEvents}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          padding: spacing.lg,
          paddingBottom: spacing['3xl'] + insets.bottom,
          gap: spacing.md,
          flexGrow: 1,
        }}
        refreshControl={
          <RefreshControl
            refreshing={activityQuery.isRefetching && !activityQuery.isLoading}
            onRefresh={() => void activityQuery.refetch()}
            tintColor={colors.pulse[500]}
          />
        }
        ListHeaderComponent={
          <AdminActivityToolbar
            userLabel={userLabel}
            dateLabel="Capture date"
            dateDisplay={dateDisplay}
            onDateChange={setDateDisplay}
            onShiftDate={shiftDate}
            canGoNext={canGoNext}
            sort={sort}
            onSortChange={setSort}
            sortHint="Sorted by screenshots and recordings on this date."
            stats={
              activityQuery.data
                ? [
                    { label: 'Events', value: String(topEvents.length) },
                    {
                      label: 'Captures',
                      value: String(activityQuery.data.topEventCaptureCount ?? 0),
                    },
                  ]
                : undefined
            }
          />
        }
        renderItem={({ item }) => <AdminTopEventCard event={item} />}
        ListEmptyComponent={
          activityQuery.isLoading ? (
            <LoadingState inverted message="Loading top events…" />
          ) : activityQuery.isError ? (
            <ErrorState
              inverted
              title="Unable to load top events"
              message="Please try again."
              onRetry={() => void activityQuery.refetch()}
            />
          ) : (
            <EmptyState
              inverted
              icon={Camera}
              title="No captures"
              description="This user did not screenshot or record any event screens on the selected date."
            />
          )
        }
      />
    </View>
  );
}
