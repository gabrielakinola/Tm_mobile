import { View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { spacing } from '@/theme/tokens';
import { Button } from './Button';
import { Icon } from './Icon';
import { Typography } from './Typography';

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
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
      <Icon icon={icon} size="2xl" />
      <View style={{ alignItems: 'center', gap: spacing.sm }}>
        <Typography variant="h3" style={{ textAlign: 'center' }}>
          {title}
        </Typography>
        {description ? (
          <Typography variant="body" muted style={{ textAlign: 'center' }}>
            {description}
          </Typography>
        ) : null}
      </View>
      {actionLabel && onAction ? (
        <Button label={actionLabel} variant="primary" onPress={onAction} />
      ) : null}
    </View>
  );
}
