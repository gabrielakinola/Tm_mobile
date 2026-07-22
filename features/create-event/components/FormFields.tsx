import { TextInput, View, type TextInputProps, type ViewStyle } from 'react-native';
import { useKeyboardAwareInputFocus } from '@/components/ui/KeyboardAwareScrollView';
import { Typography } from '@/components/ui/Typography';
import { colors, radius, spacing } from '@/theme/tokens';

export interface FormFieldProps extends TextInputProps {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  containerStyle?: ViewStyle;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
}

export function FormField({
  label,
  hint,
  error,
  required,
  containerStyle,
  leftAddon,
  rightAddon,
  style,
  onFocus,
  ...props
}: FormFieldProps) {
  const hasError = Boolean(error);
  const { containerRef, onFocus: handleFocus } = useKeyboardAwareInputFocus(onFocus);

  return (
    <View style={[{ gap: spacing.xs }, containerStyle]}>
      {label ? (
        <Typography style={{ color: colors.neutral[800], fontSize: 14, fontWeight: '600' }}>
          {label}
          {required ? (
            <Typography style={{ color: colors.error[500], fontSize: 14, fontWeight: '600' }}>
              {' '}
              *
            </Typography>
          ) : null}
        </Typography>
      ) : null}
      <View
        ref={containerRef}
        collapsable={false}
        style={{
          minHeight: 42,
          borderWidth: 1,
          borderColor: hasError ? colors.error[500] : colors.neutral[300],
          borderRadius: radius.md,
          backgroundColor: colors.neutral[0],
          paddingHorizontal: spacing.md,
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.sm,
        }}
      >
        {leftAddon}
        <TextInput
          placeholderTextColor={colors.neutral[400]}
          style={[
            {
              flex: 1,
              color: colors.neutral[800],
              fontSize: 14,
              paddingVertical: 10,
            },
            style,
          ]}
          onFocus={handleFocus}
          {...props}
        />
        {rightAddon}
      </View>
      {error ? (
        <Typography style={{ color: colors.error[500], fontSize: 12 }}>{error}</Typography>
      ) : hint ? (
        <Typography style={{ color: colors.neutral[500], fontSize: 12 }}>{hint}</Typography>
      ) : null}
    </View>
  );
}

export interface OrderNumberFieldProps {
  value: string;
  onChangeText: (value: string) => void;
  error?: string;
}

export function OrderNumberField({ value, onChangeText, error }: OrderNumberFieldProps) {
  const hasError = Boolean(error);
  const { containerRef, onFocus } = useKeyboardAwareInputFocus();

  return (
    <View style={{ gap: spacing.xs }}>
      <Typography style={{ color: colors.neutral[800], fontSize: 14, fontWeight: '600' }}>
        Order number
        <Typography style={{ color: colors.error[500], fontSize: 14, fontWeight: '600' }}>
          {' '}
          *
        </Typography>
      </Typography>
      <Typography style={{ color: colors.neutral[500], fontSize: 12 }}>
        # is fixed; enter 2 digits, 6 digits, / then a 2-3 letter code (e.g. TX or FLO).
      </Typography>
      <View
        ref={containerRef}
        collapsable={false}
        style={{
          minHeight: 42,
          borderWidth: 1,
          borderColor: hasError ? colors.error[500] : colors.neutral[300],
          borderRadius: radius.md,
          backgroundColor: colors.neutral[0],
          flexDirection: 'row',
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            width: 42,
            backgroundColor: colors.neutral[100],
            borderRightWidth: 1,
            borderRightColor: colors.neutral[300],
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography style={{ color: colors.neutral[600], fontWeight: '700', fontSize: 16 }}>
            #
          </Typography>
        </View>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="94-456485/FLO"
          placeholderTextColor={colors.neutral[400]}
          onFocus={onFocus}
          style={{
            flex: 1,
            color: colors.neutral[800],
            fontSize: 14,
            paddingHorizontal: spacing.md,
            paddingVertical: 10,
          }}
        />
      </View>
      {error ? (
        <Typography style={{ color: colors.error[500], fontSize: 12 }}>{error}</Typography>
      ) : null}
    </View>
  );
}

export function SectionLabel({ children }: { children: string }) {
  return (
    <Typography
      style={{
        color: colors.neutral[500],
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 0.8,
        textTransform: 'uppercase',
        marginBottom: spacing.sm,
      }}
    >
      {children}
    </Typography>
  );
}

export function FormCard({ children }: { children: React.ReactNode }) {
  return (
    <View
      style={{
        backgroundColor: colors.neutral[0],
        borderWidth: 1,
        borderColor: colors.neutral[200],
        borderRadius: radius.lg,
        padding: spacing.lg,
        gap: spacing.lg,
      }}
    >
      {children}
    </View>
  );
}
