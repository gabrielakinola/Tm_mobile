import { View } from 'react-native';
import { APP_DARK_SURFACE, APP_INPUT_BG } from '@/constants/app-surface';
import { radius, spacing } from '@/theme/tokens';

export function SearchSkeleton() {
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: APP_DARK_SURFACE,
        borderRadius: radius.lg,
        backgroundColor: APP_INPUT_BG,
        padding: spacing.md,
        gap: spacing.sm,
      }}
    >
      <View
        style={{
          width: '70%',
          height: 16,
          borderRadius: radius.sm,
          backgroundColor: APP_DARK_SURFACE,
        }}
      />
      <View
        style={{
          width: 72,
          height: 12,
          borderRadius: radius.sm,
          backgroundColor: APP_DARK_SURFACE,
        }}
      />
      <View style={{ height: 1, backgroundColor: APP_DARK_SURFACE }} />
      {[0, 1].map((row) => (
        <View
          key={row}
          style={{
            borderWidth: 1,
            borderColor: APP_DARK_SURFACE,
            borderRadius: radius.md,
            backgroundColor: APP_INPUT_BG,
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
                backgroundColor: APP_DARK_SURFACE,
              }}
            />
            <View
              style={{
                width: '72%',
                height: 11,
                borderRadius: radius.sm,
                backgroundColor: APP_DARK_SURFACE,
              }}
            />
          </View>
          <View
            style={{
              width: 68,
              height: 30,
              borderRadius: radius.sm,
              backgroundColor: APP_DARK_SURFACE,
            }}
          />
        </View>
      ))}
    </View>
  );
}
