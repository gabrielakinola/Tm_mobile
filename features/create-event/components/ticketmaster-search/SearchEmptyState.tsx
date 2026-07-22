import { View } from 'react-native';
import { Typography } from '@/components/ui';
import { colors, radius, spacing } from '@/theme/tokens';

export function SearchEmptyState() {
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: colors.neutral[200],
        borderRadius: radius.lg,
        backgroundColor: colors.neutral[50],
        paddingVertical: spacing.xl,
        paddingHorizontal: spacing.lg,
        alignItems: 'center',
        gap: spacing.xs,
      }}
    >
      <Typography style={{ fontSize: 28 }}>🔍</Typography>
      <Typography style={{ color: colors.neutral[900], fontSize: 15, fontWeight: '700' }}>
        No events found
      </Typography>
      <Typography style={{ color: colors.neutral[500], fontSize: 13 }}>
        Try another artist, event or tour.
      </Typography>
    </View>
  );
}
