import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, RefreshControl, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { CalendarDays, ChevronLeft, Search } from 'lucide-react-native';
import {
  ConfirmModal,
  EmptyState,
  ErrorState,
  Header,
  KeyboardAwareTextInput,
  Typography,
} from '@/components/ui';
import { ManageEventCard } from '@/features/manage-events/components/ManageEventCard';
import { ManageEventsListSkeleton } from '@/features/manage-events/components/ManageEventCardSkeleton';
import { ManageEventsTabs } from '@/features/manage-events/components/ManageEventsTabs';
import { useDeleteEvent, useManageEvents, useSetEventHidden } from '@/hooks/events/useManageEvents';
import type { EventListStatus, MyEventSummary } from '@/services/events/types';
import { colors, radius, spacing } from '@/theme/tokens';

const SEARCH_DEBOUNCE_MS = 400;

export default function ManageEventsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [status, setStatus] = useState<EventListStatus>('all');
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [pendingDelete, setPendingDelete] = useState<MyEventSummary | null>(null);
  const deleteMutation = useDeleteEvent();
  const setHiddenMutation = useSetEventHidden();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const query = useManageEvents(status, debouncedSearch);

  const events = useMemo(
    () => query.data?.pages.flatMap((page) => page.events) ?? [],
    [query.data],
  );

  const firstPage = query.data?.pages[0];
  const allCount = firstPage?.allCount ?? 0;
  const upcomingCount = firstPage?.upcomingCount ?? 0;
  const pastCount = firstPage?.pastCount ?? 0;

  const handleConfirmDelete = () => {
    if (!pendingDelete) return;
    deleteMutation.mutate(pendingDelete.id, {
      onSuccess: () => setPendingDelete(null),
    });
  };

  // Skeletons for initial load + filter/search changes (not pull-to-refresh or next page).
  const showListSkeleton = query.isFetching && !query.isFetchingNextPage && !query.isRefetching;

  return (
    <View style={{ flex: 1, backgroundColor: colors.neutral[100] }}>
      <Header
        title="Manage events"
        leftAction={
          <Pressable
            accessibilityRole="button"
            onPress={() => router.back()}
            hitSlop={8}
            style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}
          >
            <ChevronLeft size={24} color={colors.white} strokeWidth={2.2} />
          </Pressable>
        }
      />

      <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.md, gap: spacing.md }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.sm,
            backgroundColor: colors.white,
            borderRadius: radius.md,
            borderWidth: 1,
            borderColor: colors.neutral[200],
            paddingHorizontal: spacing.md,
            minHeight: 44,
          }}
        >
          <Search size={18} color={colors.neutral[400]} strokeWidth={2} />
          <KeyboardAwareTextInput
            containerStyle={{ flex: 1 }}
            value={searchInput}
            onChangeText={setSearchInput}
            placeholder="Search by event name or venue"
            placeholderTextColor={colors.neutral[400]}
            autoCapitalize="none"
            autoCorrect={false}
            style={{
              flex: 1,
              color: colors.neutral[900],
              fontSize: 15,
              paddingVertical: spacing.sm,
            }}
          />
        </View>

        <ManageEventsTabs
          activeTab={status}
          allCount={allCount}
          upcomingCount={upcomingCount}
          pastCount={pastCount}
          onChange={setStatus}
        />
      </View>

      {showListSkeleton ? (
        <ManageEventsListSkeleton />
      ) : query.isError && events.length === 0 ? (
        <ErrorState onRetry={() => void query.refetch()} />
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingHorizontal: spacing.lg,
            paddingTop: spacing.md,
            paddingBottom: spacing['3xl'] + insets.bottom,
            flexGrow: 1,
            gap: spacing.md,
          }}
          refreshControl={
            <RefreshControl
              refreshing={query.isRefetching && !query.isFetchingNextPage}
              onRefresh={() => void query.refetch()}
              tintColor={colors.pulse[600]}
            />
          }
          renderItem={({ item }) => (
            <ManageEventCard
              event={item}
              onView={() => router.push(`/my-events/${item.id}`)}
              onEdit={() => router.push(`/create-event?id=${item.id}`)}
              onToggleHidden={() =>
                setHiddenMutation.mutate({
                  id: item.id,
                  hidden: !item.hidden,
                })
              }
              onDelete={() => setPendingDelete(item)}
              togglingHidden={
                setHiddenMutation.isPending && setHiddenMutation.variables?.id === item.id
              }
              deleting={deleteMutation.isPending && deleteMutation.variables === item.id}
            />
          )}
          ListEmptyComponent={
            <EmptyState
              icon={CalendarDays}
              title={debouncedSearch ? 'No matching events' : 'No events yet'}
              description={
                debouncedSearch
                  ? 'Try a different name or venue.'
                  : 'Create an event from For You to manage it here.'
              }
            />
          }
          onEndReachedThreshold={0.4}
          onEndReached={() => {
            if (query.hasNextPage && !query.isFetchingNextPage) {
              void query.fetchNextPage();
            }
          }}
          ListFooterComponent={
            query.isFetchingNextPage ? (
              <View style={{ paddingVertical: spacing.lg, alignItems: 'center' }}>
                <ActivityIndicator color={colors.pulse[600]} />
              </View>
            ) : query.hasNextPage ? (
              <Typography
                style={{
                  textAlign: 'center',
                  color: colors.neutral[400],
                  fontSize: 12,
                  paddingVertical: spacing.sm,
                }}
              >
                Scroll for more
              </Typography>
            ) : null
          }
        />
      )}

      <ConfirmModal
        visible={Boolean(pendingDelete)}
        title="Delete event?"
        message={
          pendingDelete
            ? `Remove “${pendingDelete.name}”? This permanently deletes the event, its tickets, and related transfer history.`
            : ''
        }
        confirmLabel="Delete"
        loading={deleteMutation.isPending}
        onClose={() => {
          if (!deleteMutation.isPending) setPendingDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </View>
  );
}
