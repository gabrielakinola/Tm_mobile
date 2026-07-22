import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { Typography } from '@/components/ui/Typography';
import { colors, radius, spacing } from '@/theme/tokens';

export interface OTPInputProps {
  value: string;
  onChangeText: (value: string) => void;
  maxLength?: number;
}

export const OTPInput = memo(function OTPInput({
  value,
  onChangeText,
  maxLength = 6,
}: OTPInputProps) {
  const handleChangeText = (text: string) => {
    onChangeText(text.replace(/\D/g, '').slice(0, maxLength));
  };

  return (
    <View style={styles.container}>
      <Typography style={styles.label}>One-Time Code</Typography>
      <BottomSheetTextInput
        value={value}
        onChangeText={handleChangeText}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="one-time-code"
        maxLength={maxLength}
        style={styles.input}
        accessibilityLabel="One-time code"
      />
      <Typography style={styles.helper}>It may take a minute to receive your code.</Typography>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  label: {
    color: colors.neutral[900],
    fontSize: 15,
    fontWeight: '400',
  },
  input: {
    height: 48,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.neutral[300],
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    fontSize: 17,
    color: colors.neutral[900],
    backgroundColor: colors.white,
  },
  helper: {
    color: colors.neutral[500],
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
  },
});
