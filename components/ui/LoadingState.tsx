import { ActivityIndicator, View } from 'react-native';
import { APP_DARK_MUTED } from '@/constants/app-surface';
import { useTheme } from '@/theme';
import { spacing } from '@/theme/tokens';
import { Typography } from './Typography';

export interface LoadingStateProps {
  message?: string;
  fullScreen?: boolean;
  inverted?: boolean;
}

export function LoadingState({
  message = 'Loading...',
  fullScreen = true,
  inverted = false,
}: LoadingStateProps) {
  const { theme } = useTheme();

  return (
    <View
      style={{
        flex: fullScreen ? 1 : undefined,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing['2xl'],
        gap: spacing.lg,
      }}
    >
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Typography variant="body" muted style={inverted ? { color: APP_DARK_MUTED } : undefined}>
        {message}
      </Typography>
    </View>
  );
}
