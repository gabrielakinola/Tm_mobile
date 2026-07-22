import { View } from 'react-native';
import { colors, radius, spacing } from '@/theme/tokens';

export function SearchSkeleton() {
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: colors.neutral[200],
        borderRadius: radius.lg,
        backgroundColor: colors.neutral[50],
        padding: spacing.md,
        gap: spacing.sm,
      }}
    >
      <View
        style={{
          width: '70%',
          height: 16,
          borderRadius: radius.sm,
          backgroundColor: colors.neutral[200],
        }}
      />
      <View
        style={{
          width: 72,
          height: 12,
          borderRadius: radius.sm,
          backgroundColor: colors.neutral[200],
        }}
      />
      <View style={{ height: 1, backgroundColor: colors.neutral[200] }} />
      {[0, 1].map((row) => (
        <View
          key={row}
          style={{
            borderWidth: 1,
            borderColor: colors.neutral[200],
            borderRadius: radius.md,
            backgroundColor: colors.neutral[0],
            padding: spacing.sm,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <View style={{ gap: 6, flex: 1 }}>
            <View
              style={{
                width: '45%',
                height: 12,
                borderRadius: radius.sm,
                backgroundColor: colors.neutral[200],
              }}
            />
            <View
              style={{
                width: '72%',
                height: 11,
                borderRadius: radius.sm,
                backgroundColor: colors.neutral[200],
              }}
            />
          </View>
          <View
            style={{
              width: 68,
              height: 30,
              borderRadius: radius.sm,
              backgroundColor: colors.neutral[200],
            }}
          />
        </View>
      ))}
    </View>
  );
}
