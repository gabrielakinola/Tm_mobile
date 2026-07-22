import { View } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';
import { spacing } from '@/theme/tokens';
import { Button } from './Button';
import { Icon } from './Icon';
import { Typography } from './Typography';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'We encountered an error. Please try again.',
  onRetry,
  retryLabel = 'Try again',
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
      <Icon icon={AlertTriangle} size="2xl" />
      <View style={{ alignItems: 'center', gap: spacing.sm }}>
        <Typography variant="h3" style={{ textAlign: 'center' }}>
          {title}
        </Typography>
        <Typography variant="body" muted style={{ textAlign: 'center' }}>
          {message}
        </Typography>
      </View>
      {onRetry ? <Button label={retryLabel} variant="outline" onPress={onRetry} /> : null}
    </View>
  );
}
