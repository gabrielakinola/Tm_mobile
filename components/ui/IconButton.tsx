import { Pressable, type PressableProps } from 'react-native';
import { cn } from '@/lib/cn';
import { hapticSelection } from '@/lib/haptics';
import { useTheme } from '@/theme';
import { componentSizes, radius } from '@/theme/tokens';

export type IconButtonSize = 'sm' | 'md' | 'lg';

export interface IconButtonProps extends Omit<PressableProps, 'children'> {
  icon: React.ReactNode;
  size?: IconButtonSize;
  variant?: 'default' | 'ghost' | 'outline';
  haptic?: boolean;
  className?: string;
}

const sizeMap: Record<IconButtonSize, number> = {
  sm: componentSizes.button.sm,
  md: componentSizes.button.md,
  lg: componentSizes.button.lg,
};

export function IconButton({
  icon,
  size = 'md',
  variant = 'default',
  haptic = true,
  disabled,
  className,
  onPress,
  style,
  ...props
}: IconButtonProps) {
  const { theme } = useTheme();
  const dimension = sizeMap[size];

  const variantStyles = {
    default: { backgroundColor: theme.colors.secondary, borderWidth: 0 },
    ghost: { backgroundColor: 'transparent', borderWidth: 0 },
    outline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: theme.colors.border },
  };

  const handlePress: PressableProps['onPress'] = (event) => {
    if (haptic) {
      void hapticSelection();
    }
    onPress?.(event);
  };

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={handlePress}
      className={cn('items-center justify-center', className)}
      style={(state) => [
        {
          width: dimension,
          height: dimension,
          borderRadius: radius.lg,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: disabled ? 0.5 : state.pressed ? 0.7 : 1,
          ...variantStyles[variant],
        },
        typeof style === 'function' ? style(state) : style,
      ]}
      {...props}
    >
      {icon}
    </Pressable>
  );
}
