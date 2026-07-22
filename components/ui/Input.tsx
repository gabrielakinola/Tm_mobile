import { TextInput, View, type TextInputProps } from 'react-native';
import { useKeyboardAwareInputFocus } from '@/components/ui/KeyboardAwareScrollView';
import { cn } from '@/lib/cn';
import { useTheme } from '@/theme';
import { componentSizes, radius, spacing } from '@/theme/tokens';
import { Typography } from './Typography';

export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  size?: InputSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
  className?: string;
}

const sizeMap: Record<InputSize, number> = {
  sm: componentSizes.input.sm,
  md: componentSizes.input.md,
  lg: componentSizes.input.lg,
};

export function Input({
  label,
  error,
  hint,
  size = 'md',
  leftIcon,
  rightIcon,
  containerClassName,
  className,
  style,
  editable = true,
  onFocus,
  ...props
}: InputProps) {
  const { theme } = useTheme();
  const height = sizeMap[size];
  const hasError = Boolean(error);
  const { containerRef, onFocus: handleFocus } = useKeyboardAwareInputFocus(onFocus);

  return (
    <View className={cn('gap-1', containerClassName)}>
      {label ? (
        <Typography variant="label" style={{ textTransform: 'none' }}>
          {label}
        </Typography>
      ) : null}
      <View
        ref={containerRef}
        collapsable={false}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          height,
          borderRadius: radius.lg,
          borderWidth: 1,
          borderColor: hasError ? theme.colors.destructive : theme.colors.input,
          backgroundColor: theme.colors.background,
          paddingHorizontal: spacing.md,
          gap: spacing.sm,
          opacity: editable ? 1 : 0.6,
        }}
      >
        {leftIcon}
        <TextInput
          className={cn('flex-1 text-body', className)}
          placeholderTextColor={theme.colors.mutedForeground}
          editable={editable}
          onFocus={handleFocus}
          style={[
            {
              flex: 1,
              color: theme.colors.foreground,
              fontSize: 16,
              paddingVertical: 0,
            },
            style,
          ]}
          {...props}
        />
        {rightIcon}
      </View>
      {error ? (
        <Typography variant="caption" style={{ color: theme.colors.destructive }}>
          {error}
        </Typography>
      ) : hint ? (
        <Typography variant="caption" muted>
          {hint}
        </Typography>
      ) : null}
    </View>
  );
}
