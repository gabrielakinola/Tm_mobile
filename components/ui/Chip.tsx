import { Pressable, type PressableProps, type TextStyle, type ViewStyle } from 'react-native';
import { X } from 'lucide-react-native';
import { cn } from '@/lib/cn';
import { hapticSelection } from '@/lib/haptics';
import { useTheme } from '@/theme';
import { radius, spacing } from '@/theme/tokens';
import { Icon } from './Icon';
import { Typography } from './Typography';

export type ChipVariant = 'default' | 'primary' | 'outlined';

export interface ChipProps extends Omit<PressableProps, 'children'> {
  label: string;
  selected?: boolean;
  onDismiss?: () => void;
  className?: string;
  variant?: ChipVariant;
  textStyle?: TextStyle;
  style?: ViewStyle | ((state: { pressed: boolean }) => ViewStyle);
}

export function Chip({
  label,
  selected = false,
  onDismiss,
  disabled,
  className,
  onPress,
  style,
  variant = 'default',
  textStyle,
  ...props
}: ChipProps) {
  const { theme } = useTheme();

  const handlePress: PressableProps['onPress'] = (event) => {
    void hapticSelection();
    onPress?.(event);
  };

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={handlePress}
      className={cn('flex-row items-center', className)}
      style={(state) => {
        let backgroundColor: string;
        let borderWidth: number;
        let borderColor: string;

        if (variant === 'outlined') {
          backgroundColor = 'transparent';
          borderWidth = 1;
          borderColor = theme.colors.border;
        } else if (variant === 'primary') {
          backgroundColor = theme.colors.primary;
          borderWidth = 0;
          borderColor = 'transparent';
        } else {
          backgroundColor = selected ? theme.colors.primary : theme.colors.secondary;
          borderWidth = 0;
          borderColor = 'transparent';
        }

        return [
          {
            backgroundColor,
            borderWidth,
            borderColor,
            borderRadius: radius.full,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
            gap: spacing.xs,
            opacity: disabled ? 0.5 : state.pressed ? 0.85 : 1,
          },
          typeof style === 'function' ? style(state) : style,
        ];
      }}
      {...props}
    >
      <Typography
        variant="caption"
        style={[
          {
            color:
              variant === 'primary'
                ? theme.colors.primaryForeground
                : selected
                  ? theme.colors.secondaryForeground
                  : theme.colors.secondaryForeground,
          },
          textStyle,
        ]}
      >
        {label}
      </Typography>
      {onDismiss ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Remove ${label}`}
          hitSlop={8}
          onPress={(event) => {
            event.stopPropagation();
            onDismiss();
          }}
        >
          <Icon
            icon={X}
            size="xs"
            color={
              variant === 'primary'
                ? theme.colors.primaryForeground
                : theme.colors.secondaryForeground
            }
          />
        </Pressable>
      ) : null}
    </Pressable>
  );
}
