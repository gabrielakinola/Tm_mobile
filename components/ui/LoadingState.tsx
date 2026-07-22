import { ActivityIndicator, View } from 'react-native';
import { useTheme } from '@/theme';
import { spacing } from '@/theme/tokens';
import { Typography } from './Typography';

export interface LoadingStateProps {
  message?: string;
  fullScreen?: boolean;
}

export function LoadingState({ message = 'Loading...', fullScreen = true }: LoadingStateProps) {
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
      <Typography variant="body" muted>
        {message}
      </Typography>
    </View>
  );
}
