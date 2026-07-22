import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, RefreshControl, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeftRight, ChevronLeft, Search, Trash2 } from 'lucide-react-native';
import {
  EmptyState,
  ErrorState,
  Header,
  KeyboardAwareTextInput,
  Typography,
} from '@/components/ui';
import { TransferConfirmModal } from '@/features/transfer-history/components/TransferConfirmModal';
import { TransferHistoryCard } from '@/features/transfer-history/components/TransferHistoryCard';
import { TransferHistoryListSkeleton } from '@/features/transfer-history/components/TransferHistoryCardSkeleton';
import {
  useClearTransferHistory,
  useDeleteTransfer,
  useTransferHistory,
} from '@/hooks/transfers/useTransferHistory';
import type { TransferHistoryItem } from '@/services/transfers/transfers.api';
import { colors, radius, spacing } from '@/theme/tokens';

const SEARCH_DEBOUNCE_MS = 400;

export default function TransferHistoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [pendingDelete, setPendingDelete] = useState<TransferHistoryItem | null>(null);
  const [clearAllVisible, setClearAllVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const filters = useMemo(
    () => ({
      search: debouncedSearch,
    }),
    [debouncedSearch],
  );

  const query = useTransferHistory(filters);
  const deleteMutation = useDeleteTransfer();
  const clearMutation = useClearTransferHistory();

  const transfers = useMemo(
    () => query.data?.pages.flatMap((page) => page.transfers) ?? [],
    [query.data],
  );
  const totalCount = query.data?.pages[0]?.total ?? transfers.length;
  const hasSearch = Boolean(debouncedSearch);
  const canClearAll = totalCount > 0 || transfers.length > 0;

  const showListSkeleton = query.isFetching && !query.isFetchingNextPage && !query.isRefetching;

  const handleConfirmDelete = () => {
    if (!pendingDelete) return;
    deleteMutation.mutate(pendingDelete.id, {
      onSuccess: () => setPendingDelete(null),
    });
  };

  const handleConfirmClearAll = () => {
    clearMutation.mutate(undefined, {
      onSuccess: () => setClearAllVisible(false),
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.neutral[100] }}>
      <Header
        title="Transfer history"
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

      <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.md, gap: spacing.sm }}>
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
            placeholder="Event, venue, recipient name or email"
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

        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Clear all transfer history"
            accessibilityState={{ disabled: !canClearAll || clearMutation.isPending }}
            disabled={!canClearAll || clearMutation.isPending}
            onPress={() => setClearAllVisible(true)}
            hitSlop={8}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              paddingVertical: spacing.xs,
              paddingHorizontal: spacing.sm,
              opacity: canClearAll ? 1 : 0.4,
            }}
          >
            <Trash2 size={14} color={colors.error[500]} strokeWidth={2.2} />
            <Typography style={{ color: colors.error[500], fontSize: 13, fontWeight: '700' }}>
              Clear all
            </Typography>
          </Pressable>
        </View>
      </View>

      {showListSkeleton ? (
        <TransferHistoryListSkeleton />
      ) : query.isError && transfers.length === 0 ? (
        <ErrorState
          title="Couldn’t load transfers"
          message="Check your connection and try again."
          onRetry={() => void query.refetch()}
        />
      ) : (
        <FlatList
          data={transfers}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            padding: spacing.lg,
            paddingBottom: spacing['3xl'] + insets.bottom,
            gap: spacing.md,
            flexGrow: 1,
          }}
          refreshControl={
            <RefreshControl
              refreshing={query.isRefetching && !query.isFetchingNextPage}
              onRefresh={() => void query.refetch()}
              tintColor={colors.pulse[600]}
            />
          }
          ListEmptyComponent={
            <EmptyState
              icon={ArrowLeftRight}
              title={hasSearch ? 'No matching transfers' : 'No transfers yet'}
              description={
                hasSearch
                  ? 'Try a different search.'
                  : 'When you transfer tickets, they’ll show up here with the recipient and event details.'
              }
            />
          }
          renderItem={({ item }) => (
            <TransferHistoryCard
              transfer={item}
              deleting={deleteMutation.isPending && deleteMutation.variables === item.id}
              onPress={() =>
                router.push({
                  pathname: '/transfer-history/[id]',
                  params: { id: item.id },
                })
              }
              onDelete={() => setPendingDelete(item)}
            />
          )}
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

      <TransferConfirmModal
        visible={Boolean(pendingDelete)}
        title="Delete transfer?"
        message={
          pendingDelete
            ? `Remove the transfer to ${pendingDelete.recipient.name} from your history? This can’t be undone.`
            : ''
        }
        confirmLabel="Delete"
        loading={deleteMutation.isPending}
        onClose={() => {
          if (!deleteMutation.isPending) setPendingDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      />

      <TransferConfirmModal
        visible={clearAllVisible}
        title="Clear all transfer history?"
        message="This permanently deletes every transfer in your history for this account. You won’t be able to recover them. This can’t be undone."
        confirmLabel="Clear all"
        loading={clearMutation.isPending}
        onClose={() => {
          if (!clearMutation.isPending) setClearAllVisible(false);
        }}
        onConfirm={handleConfirmClearAll}
      />
    </View>
  );
}
