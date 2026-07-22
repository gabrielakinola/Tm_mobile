import { Text, type TextProps } from 'react-native';
import { cn } from '@/lib/cn';
import { useTheme } from '@/theme';
import { typography } from '@/theme/tokens';

export type TypographyVariant =
  'display' | 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption' | 'label';

export interface TypographyProps extends TextProps {
  variant?: TypographyVariant;
  muted?: boolean;
  className?: string;
}

const variantStyles: Record<TypographyVariant, string> = {
  display: 'text-display font-bold',
  h1: 'text-h1 font-bold',
  h2: 'text-h2 font-semibold',
  h3: 'text-h3 font-semibold',
  h4: 'text-h4 font-medium',
  body: 'text-body',
  caption: 'text-caption',
  label: 'text-label font-medium uppercase tracking-wide',
};

const variantFontSizes: Record<TypographyVariant, number> = {
  display: typography.fontSize.display,
  h1: typography.fontSize.h1,
  h2: typography.fontSize.h2,
  h3: typography.fontSize.h3,
  h4: typography.fontSize.h4,
  body: typography.fontSize.body,
  caption: typography.fontSize.caption,
  label: typography.fontSize.label,
};

export function Typography({
  variant = 'body',
  muted = false,
  className,
  style,
  children,
  ...props
}: TypographyProps) {
  const { theme } = useTheme();

  return (
    <Text
      className={cn(variantStyles[variant], className)}
      style={[
        {
          color: muted ? theme.colors.mutedForeground : theme.colors.foreground,
          fontSize: variantFontSizes[variant],
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
}
