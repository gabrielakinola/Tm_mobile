import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Send } from 'lucide-react-native';
import { Typography } from '@/components/ui/Typography';
import { colors, spacing } from '@/theme/tokens';

export const TransferRecipientInfo = memo(function TransferRecipientInfo() {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Send size={36} color={colors.neutral[400]} strokeWidth={1.8} />
      </View>
      <Typography style={styles.title}>Transfer Tickets Via Email or Text Message</Typography>
      <Typography style={styles.subtitle}>
        Select an Email or mobile number to transfer tickets to your recipient.
      </Typography>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: spacing['2xl'],
    gap: spacing.md,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  title: {
    color: colors.neutral[900],
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    color: colors.neutral[500],
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '400',
    textAlign: 'center',
  },
});
