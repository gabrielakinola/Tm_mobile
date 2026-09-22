import { View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { APP_DARK_MUTED } from '@/constants/app-surface';
import { colors, spacing } from '@/theme/tokens';
import { Button } from './Button';
import { Icon } from './Icon';
import { Typography } from './Typography';

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  inverted?: boolean;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  inverted = false,
}: EmptyStateProps) {
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
      <Icon icon={icon} size="2xl" color={inverted ? APP_DARK_MUTED : undefined} />
      <View style={{ alignItems: 'center', gap: spacing.sm }}>
        <Typography
          variant="h3"
          style={{ textAlign: 'center', color: inverted ? colors.white : undefined }}
        >
          {title}
        </Typography>
        {description ? (
          <Typography
            variant="body"
            muted
            style={{ textAlign: 'center', color: inverted ? APP_DARK_MUTED : undefined }}
          >
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
