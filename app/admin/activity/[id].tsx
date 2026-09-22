import { useMemo, useState } from 'react';
import { FlatList, Pressable, RefreshControl, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { EmptyState, ErrorState, Header, LoadingState, Typography } from '@/components/ui';
import {
  AdminActivityEventCard,
  SortChip,
} from '@/features/admin/components/AdminActivityEventCard';
import { DatePickerField } from '@/features/create-event/components/DatePickerField';
import {
  addDays,
  formatEventDateDisplay,
  isSameCalendarDay,
  parseEventDateValue,
  toIsoDateString,
} from '@/features/create-event/date-utils';
import { useAdminUserActivity } from '@/hooks/admin/useAdminUsers';
import type { AdminUserActivityEvent, AdminUserActivitySort } from '@/services/admin/admin.api';
import { colors, radius, spacing } from '@/theme/tokens';

export default function AdminUserActivityScreen() {
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

  const events: AdminUserActivityEvent[] = activityQuery.data?.events ?? [];
  const userLabel = activityQuery.data?.user.accountName || activityQuery.data?.user.email || '';

  return (
    <View style={{ flex: 1, backgroundColor: colors.neutral[100] }}>
      <Header title="User activity" leftAction={backAction} />

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
            tintColor={colors.pulse[600]}
          />
        }
        ListHeaderComponent={
          <View style={{ gap: spacing.md, marginBottom: spacing.sm }}>
            {userLabel ? (
              <Typography style={{ color: colors.neutral[600], fontSize: 14, fontWeight: '600' }}>
                {userLabel}
              </Typography>
            ) : null}

            <View style={{ gap: spacing.xs }}>
              <Typography style={{ color: colors.neutral[800], fontSize: 14, fontWeight: '600' }}>
                Created on
              </Typography>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                <DateStepButton
                  label="Previous date"
                  onPress={() => shiftDate(-1)}
                  icon={<ChevronLeft size={20} color={colors.neutral[800]} strokeWidth={2.2} />}
                />
                <DatePickerField
                  value={dateDisplay}
                  onChange={setDateDisplay}
                  placeholder="Select date"
                  containerStyle={{ flex: 1 }}
                />
                <DateStepButton
                  label="Next date"
                  onPress={() => shiftDate(1)}
                  disabled={!canGoNext}
                  icon={
                    <ChevronRight
                      size={20}
                      color={canGoNext ? colors.neutral[800] : colors.neutral[400]}
                      strokeWidth={2.2}
                    />
                  }
                />
              </View>
            </View>

            <View style={{ gap: spacing.xs }}>
              <Typography style={{ color: colors.neutral[800], fontSize: 14, fontWeight: '600' }}>
                Sort by transfers
              </Typography>
              <View style={{ flexDirection: 'row', gap: spacing.sm }}>
                <SortChip
                  label="Most transfers"
                  selected={sort === 'most'}
                  onPress={() => setSort('most')}
                />
                <SortChip
                  label="Least transfers"
                  selected={sort === 'least'}
                  onPress={() => setSort('least')}
                />
              </View>
            </View>

            {activityQuery.data ? (
              <View
                style={{
                  flexDirection: 'row',
                  gap: spacing.sm,
                }}
              >
                <SummaryStat label="Events" value={String(activityQuery.data.eventCount)} />
                <SummaryStat label="Transfers" value={String(activityQuery.data.transferCount)} />
              </View>
            ) : null}
          </View>
        }
        renderItem={({ item }) => <AdminActivityEventCard event={item} />}
        ListEmptyComponent={
          activityQuery.isLoading ? (
            <LoadingState message="Loading activity…" />
          ) : activityQuery.isError ? (
            <ErrorState
              title="Unable to load activity"
              message="Please try again."
              onRetry={() => void activityQuery.refetch()}
            />
          ) : (
            <EmptyState
              icon={CalendarDays}
              title="No events created"
              description="This user did not create any events on the selected date."
            />
          )
        }
      />
    </View>
  );
}

function DateStepButton({
  label,
  onPress,
  icon,
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  icon: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      style={{
        width: 42,
        height: 42,
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: colors.neutral[300],
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {icon}
    </Pressable>
  );
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.white,
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: colors.neutral[200],
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.md,
        gap: 2,
      }}
    >
      <Typography style={{ color: colors.neutral[500], fontSize: 12, fontWeight: '600' }}>
        {label}
      </Typography>
      <Typography style={{ color: colors.neutral[950], fontSize: 22, fontWeight: '800' }}>
        {value}
      </Typography>
    </View>
  );
}
