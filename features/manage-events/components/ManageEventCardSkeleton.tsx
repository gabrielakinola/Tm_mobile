import { View } from 'react-native';
import { Skeleton, SkeletonGroup } from '@/components/ui';
import { colors, radius, spacing } from '@/theme/tokens';

export function ManageEventCardSkeleton() {
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
      <Skeleton width={96} height={104} style={{ borderRadius: 0 }} />
      <View style={{ flex: 1, padding: spacing.md, gap: spacing.sm }}>
        <SkeletonGroup gap={6}>
          <Skeleton width="78%" height={16} />
          <Skeleton width="55%" height={12} />
          <Skeleton width="42%" height={11} />
        </SkeletonGroup>
        <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: 'auto' }}>
          <Skeleton width={58} height={28} />
          <Skeleton width={58} height={28} />
          <Skeleton width={68} height={28} />
        </View>
      </View>
    </View>
  );
}

export function ManageEventsListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.md, gap: spacing.md }}>
      {Array.from({ length: count }, (_, index) => (
        <ManageEventCardSkeleton key={index} />
      ))}
    </View>
  );
}
