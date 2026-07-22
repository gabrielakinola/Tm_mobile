import { View, type ViewProps } from 'react-native';
import { X } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import { cn } from '@/lib/cn';
import { useTheme } from '@/theme';
import { radius, spacing } from '@/theme/tokens';
import { Icon } from './Icon';
import { IconButton } from './IconButton';
import { Typography } from './Typography';

export type BannerVariant = 'info' | 'success' | 'warning' | 'error';

export interface BannerProps extends ViewProps {
  title: string;
  message?: string;
  variant?: BannerVariant;
  icon?: LucideIcon;
  onDismiss?: () => void;
  action?: React.ReactNode;
  className?: string;
}

export function Banner({
  title,
  message,
  variant = 'info',
  icon,
  onDismiss,
  action,
  className,
  style,
  ...props
}: BannerProps) {
  const { theme } = useTheme();

  const variantColors: Record<BannerVariant, { bg: string; accent: string }> = {
    info: { bg: theme.colors.accent, accent: theme.colors.info },
    success: { bg: theme.colors.accent, accent: theme.colors.success },
    warning: { bg: theme.colors.accent, accent: theme.colors.warning },
    error: { bg: theme.colors.accent, accent: theme.colors.destructive },
  };

  const colors = variantColors[variant];

  return (
    <View
      className={cn(className)}
      style={[
        {
          backgroundColor: colors.bg,
          borderRadius: radius.lg,
          padding: spacing.lg,
          borderLeftWidth: 4,
          borderLeftColor: colors.accent,
          gap: spacing.sm,
        },
        style,
      ]}
      {...props}
    >
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md }}>
        {icon ? <Icon icon={icon} size="md" color={colors.accent} /> : null}
        <View style={{ flex: 1, gap: spacing.xs }}>
          <Typography variant="h4">{title}</Typography>
          {message ? (
            <Typography variant="caption" muted>
              {message}
            </Typography>
          ) : null}
          {action}
        </View>
        {onDismiss ? (
          <IconButton
            icon={<Icon icon={X} size="sm" color={theme.colors.mutedForeground} />}
            variant="ghost"
            size="sm"
            onPress={onDismiss}
          />
        ) : null}
      </View>
    </View>
  );
}
