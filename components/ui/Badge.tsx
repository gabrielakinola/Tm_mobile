import { View, type ViewProps } from 'react-native';
import { cn } from '@/lib/cn';
import { useTheme } from '@/theme';
import { radius, spacing } from '@/theme/tokens';
import { Typography } from './Typography';

export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'destructive';

export interface BadgeProps extends ViewProps {
  label: string;
  variant?: BadgeVariant;
  className?: string;
}

export function Badge({ label, variant = 'default', className, style, ...props }: BadgeProps) {
  const { theme } = useTheme();

  const variantColors: Record<BadgeVariant, { bg: string; text: string }> = {
    default: { bg: theme.colors.secondary, text: theme.colors.secondaryForeground },
    primary: { bg: theme.colors.primary, text: theme.colors.primaryForeground },
    success: { bg: theme.colors.success, text: theme.colors.primaryForeground },
    warning: { bg: theme.colors.warning, text: theme.colors.primaryForeground },
    destructive: { bg: theme.colors.destructive, text: theme.colors.destructiveForeground },
  };

  const colors = variantColors[variant];

  return (
    <View
      className={cn('self-start', className)}
      style={[
        {
          backgroundColor: colors.bg,
          borderRadius: radius.full,
          paddingHorizontal: spacing.sm,
          paddingVertical: spacing.xs,
        },
        style,
      ]}
      {...props}
    >
      <Typography variant="label" style={{ color: colors.text, textTransform: 'none' }}>
        {label}
      </Typography>
    </View>
  );
}
