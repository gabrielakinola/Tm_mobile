import { Pressable, View, type PressableProps, type ViewProps } from 'react-native';
import { cn } from '@/lib/cn';
import { useTheme } from '@/theme';
import { radius, spacing } from '@/theme/tokens';

export interface CardProps extends ViewProps {
  onPress?: PressableProps['onPress'];
  pressable?: boolean;
  className?: string;
}

export function Card({
  onPress,
  pressable = false,
  className,
  style,
  children,
  ...props
}: CardProps) {
  const { theme } = useTheme();

  const cardStyle = {
    backgroundColor: theme.colors.card,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: spacing.lg,
    ...theme.shadow.sm,
  };

  if (pressable || onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        className={cn(className)}
        style={({ pressed }) => [cardStyle, { opacity: pressed ? 0.9 : 1 }, style]}
        {...(props as PressableProps)}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View className={cn(className)} style={[cardStyle, style]} {...props}>
      {children}
    </View>
  );
}
