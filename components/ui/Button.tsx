import { ActivityIndicator, Pressable, Text, View, type PressableProps } from 'react-native';
import { cn } from '@/lib/cn';
import { hapticLight } from '@/lib/haptics';
import { useTheme } from '@/theme';
import { componentSizes, radius, spacing } from '@/theme/tokens';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<PressableProps, 'children'> {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  haptic?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
}

const sizeStyles: Record<
  ButtonSize,
  { height: number; paddingHorizontal: number; fontSize: number }
> = {
  sm: { height: componentSizes.button.sm, paddingHorizontal: spacing.md, fontSize: 14 },
  md: { height: componentSizes.button.md, paddingHorizontal: spacing.lg, fontSize: 16 },
  lg: { height: componentSizes.button.lg, paddingHorizontal: spacing.xl, fontSize: 18 },
};

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  haptic = true,
  leftIcon,
  rightIcon,
  disabled,
  className,
  onPress,
  style,
  ...props
}: ButtonProps) {
  const { theme } = useTheme();
  const sizeConfig = sizeStyles[size];
  const isDisabled = disabled || loading;

  const variantColors: Record<ButtonVariant, { bg: string; text: string; border?: string }> = {
    primary: { bg: theme.colors.primary, text: theme.colors.primaryForeground },
    secondary: { bg: theme.colors.secondary, text: theme.colors.secondaryForeground },
    ghost: { bg: 'transparent', text: theme.colors.foreground },
    outline: {
      bg: 'transparent',
      text: theme.colors.foreground,
      border: theme.colors.border,
    },
    destructive: { bg: theme.colors.destructive, text: theme.colors.destructiveForeground },
  };

  const colors = variantColors[variant];

  const handlePress: PressableProps['onPress'] = (event) => {
    if (haptic) {
      void hapticLight();
    }
    onPress?.(event);
  };

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      onPress={handlePress}
      className={cn(fullWidth && 'w-full', className)}
      style={(state) => [
        {
          height: sizeConfig.height,
          paddingHorizontal: sizeConfig.paddingHorizontal,
          borderRadius: radius.lg,
          backgroundColor: colors.bg,
          borderWidth: variant === 'outline' ? 1 : 0,
          borderColor: colors.border,
          opacity: isDisabled ? 0.5 : state.pressed ? 0.85 : 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: spacing.sm,
        },
        typeof style === 'function' ? style(state) : style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={colors.text} size="small" />
      ) : (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
          {leftIcon}
          <Text
            style={{
              color: colors.text,
              fontSize: sizeConfig.fontSize,
              fontWeight: '700',
            }}
          >
            {label}
          </Text>
          {rightIcon}
        </View>
      )}
    </Pressable>
  );
}
