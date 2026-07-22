import { View, type ViewProps } from 'react-native';
import { cn } from '@/lib/cn';
import { useTheme } from '@/theme';
import { radius, spacing } from '@/theme/tokens';

export type SurfaceVariant = 'default' | 'elevated' | 'muted';

export interface SurfaceProps extends ViewProps {
  variant?: SurfaceVariant;
  padded?: boolean;
  className?: string;
}

export function Surface({
  variant = 'default',
  padded = false,
  className,
  style,
  children,
  ...props
}: SurfaceProps) {
  const { theme } = useTheme();

  const variantStyles = {
    default: { backgroundColor: theme.colors.card },
    elevated: { backgroundColor: theme.colors.card, ...theme.shadow.md },
    muted: { backgroundColor: theme.colors.muted },
  };

  return (
    <View
      className={cn(className)}
      style={[
        {
          borderRadius: radius.lg,
          borderWidth: variant === 'elevated' ? 0 : 1,
          borderColor: theme.colors.border,
          padding: padded ? spacing.lg : 0,
          ...variantStyles[variant],
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}
