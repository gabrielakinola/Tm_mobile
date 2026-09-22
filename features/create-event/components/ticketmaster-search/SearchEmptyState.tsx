import { View } from 'react-native';
import { Typography } from '@/components/ui';
import { APP_DARK_MUTED, APP_DARK_SURFACE, APP_INPUT_BG } from '@/constants/app-surface';
import { colors, radius, spacing } from '@/theme/tokens';

export function SearchEmptyState() {
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: APP_DARK_SURFACE,
        borderRadius: radius.lg,
        backgroundColor: APP_INPUT_BG,
        paddingVertical: spacing.xl,
        paddingHorizontal: spacing.lg,
        alignItems: 'center',
        gap: spacing.xs,
      }}
    >
      <Typography style={{ fontSize: 28 }}>🔍</Typography>
      <Typography style={{ color: colors.white, fontSize: 15, fontWeight: '700' }}>
        No events found
      </Typography>
      <Typography style={{ color: APP_DARK_MUTED, fontSize: 13 }}>
        Try another artist, event or tour.
      </Typography>
    </View>
  );
}
