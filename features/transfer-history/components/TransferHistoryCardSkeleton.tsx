import { View } from 'react-native';
import { Skeleton, SkeletonGroup } from '@/components/ui';
import { colors, radius, spacing } from '@/theme/tokens';

export function TransferHistoryCardSkeleton() {
  return (
    <View
      style={{
        backgroundColor: colors.white,
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: colors.neutral[200],
        overflow: 'hidden',
        flexDirection: 'row',
        minHeight: 104,
      }}
    >
      <Skeleton width={96} height={140} style={{ borderRadius: 0 }} />
      <View style={{ flex: 1, padding: spacing.md, gap: spacing.sm }}>
        <SkeletonGroup gap={6}>
          <Skeleton width="78%" height={16} />
          <Skeleton width="55%" height={12} />
          <Skeleton width="42%" height={11} />
        </SkeletonGroup>
        <View
          style={{
            marginTop: spacing.xs,
            paddingTop: spacing.xs,
            borderTopWidth: 1,
            borderTopColor: colors.neutral[100],
            gap: 6,
          }}
        >
          <Skeleton width="48%" height={13} />
          <Skeleton width="62%" height={11} />
          <Skeleton width="70%" height={11} />
        </View>
        <View style={{ marginTop: spacing.xs, alignItems: 'flex-end' }}>
          <Skeleton width={120} height={12} />
        </View>
      </View>
    </View>
  );
}

export function TransferHistoryListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <View style={{ padding: spacing.lg, gap: spacing.md }}>
      {Array.from({ length: count }, (_, index) => (
        <TransferHistoryCardSkeleton key={index} />
      ))}
    </View>
  );
}
