import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, RefreshControl, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeftRight, ChevronLeft, RefreshCw } from 'lucide-react-native';
import { EmptyState, ErrorState, Header, LoadingState } from '@/components/ui';
import { APP_DARK_BG } from '@/constants/app-surface';
import { AdminActivityEventCard } from '@/features/admin/components/AdminActivityEventCard';
import { AdminActivityToolbar } from '@/features/admin/components/AdminActivityToolbar';
import {
  addDays,
  formatEventDateDisplay,
  isSameCalendarDay,
  parseEventDateValue,
  toIsoDateString,
} from '@/features/create-event/date-utils';
import { useAdminUserActivity } from '@/hooks/admin/useAdminUsers';
import type { AdminUserActivityEvent, AdminUserActivitySort } from '@/services/admin/admin.api';
import { colors, spacing } from '@/theme/tokens';

export default function AdminUserTransfersScreen() {
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
      accessibilityLabel="Refresh transfers"
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

  const events: AdminUserActivityEvent[] = activityQuery.data?.events ?? [];
  const userLabel = activityQuery.data?.user.accountName || activityQuery.data?.user.email || '';

  return (
    <View style={{ flex: 1, backgroundColor: APP_DARK_BG }}>
      <Header title="Transfers" leftAction={backAction} rightAction={refreshAction} />

      <FlatList
        data={events}
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
            dateLabel="Transfer date"
            dateDisplay={dateDisplay}
            onDateChange={setDateDisplay}
            onShiftDate={shiftDate}
            canGoNext={canGoNext}
            sort={sort}
            onSortChange={setSort}
            sortHint="Sorted by transfers made on this date."
            stats={
              activityQuery.data
                ? [
                    { label: 'Events', value: String(activityQuery.data.eventCount) },
                    { label: 'Transfers', value: String(activityQuery.data.transferCount) },
                  ]
                : undefined
            }
          />
        }
        renderItem={({ item }) => <AdminActivityEventCard event={item} />}
        ListEmptyComponent={
          activityQuery.isLoading ? (
            <LoadingState inverted message="Loading transfers…" />
          ) : activityQuery.isError ? (
            <ErrorState
              inverted
              title="Unable to load transfers"
              message="Please try again."
              onRetry={() => void activityQuery.refetch()}
            />
          ) : (
            <EmptyState
              inverted
              icon={ArrowLeftRight}
              title="No transfers"
              description="This user did not make any transfers on the selected date."
            />
          )
        }
      />
    </View>
  );
}
