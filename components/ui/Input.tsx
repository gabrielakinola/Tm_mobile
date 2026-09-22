import { TextInput, View, type TextInputProps } from 'react-native';
import { useKeyboardAwareInputFocus } from '@/components/ui/KeyboardAwareScrollView';
import { APP_DARK_MUTED, APP_DARK_SURFACE, APP_INPUT_BG } from '@/constants/app-surface';
import { cn } from '@/lib/cn';
import { useTheme } from '@/theme';
import { colors, componentSizes, radius, spacing } from '@/theme/tokens';
import { Typography } from './Typography';

export type InputSize = 'sm' | 'md' | 'lg';
export type InputTone = 'default' | 'dark';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  size?: InputSize;
  tone?: InputTone;
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
  tone = 'default',
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
  const dark = tone === 'dark';
  const { containerRef, onFocus: handleFocus } = useKeyboardAwareInputFocus(onFocus);

  return (
    <View className={cn('gap-1', containerClassName)}>
      {label ? (
        <Typography
          variant="label"
          style={{
            textTransform: 'none',
            color: dark ? colors.white : undefined,
          }}
        >
          {label}
        </Typography>
      ) : null}
      <View
        ref={containerRef}
        collapsable={false}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          minHeight: height,
          borderRadius: radius.lg,
          borderWidth: 1,
          borderColor: hasError
            ? theme.colors.destructive
            : dark
              ? APP_DARK_SURFACE
              : theme.colors.input,
          backgroundColor: dark ? APP_INPUT_BG : theme.colors.background,
          paddingHorizontal: spacing.md,
          gap: spacing.sm,
          opacity: editable ? 1 : 0.6,
        }}
      >
        {leftIcon}
        <TextInput
          className={cn('flex-1', className)}
          placeholderTextColor={dark ? APP_DARK_MUTED : theme.colors.mutedForeground}
          editable={editable}
          onFocus={handleFocus}
          style={[
            {
              flex: 1,
              alignSelf: 'stretch',
              color: dark ? colors.white : theme.colors.foreground,
              fontSize: 16,
              lineHeight: 20,
              paddingVertical: 12,
              textAlignVertical: 'center',
              includeFontPadding: false,
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
        <Typography variant="caption" muted style={dark ? { color: APP_DARK_MUTED } : undefined}>
          {hint}
        </Typography>
      ) : null}
    </View>
  );
}
