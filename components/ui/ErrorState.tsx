import { View } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';
import { APP_DARK_MUTED } from '@/constants/app-surface';
import { colors, spacing } from '@/theme/tokens';
import { Button } from './Button';
import { Icon } from './Icon';
import { Typography } from './Typography';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  inverted?: boolean;
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'We encountered an error. Please try again.',
  onRetry,
  retryLabel = 'Try again',
  inverted = false,
}: ErrorStateProps) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing['2xl'],
        gap: spacing.lg,
      }}
    >
      <Icon icon={AlertTriangle} size="2xl" color={inverted ? APP_DARK_MUTED : undefined} />
      <View style={{ alignItems: 'center', gap: spacing.sm }}>
        <Typography
          variant="h3"
          style={{ textAlign: 'center', color: inverted ? colors.white : undefined }}
        >
          {title}
        </Typography>
        <Typography
          variant="body"
          muted
          style={{ textAlign: 'center', color: inverted ? APP_DARK_MUTED : undefined }}
        >
          {message}
        </Typography>
      </View>
      {onRetry ? <Button label={retryLabel} variant="outline" onPress={onRetry} /> : null}
    </View>
  );
}
