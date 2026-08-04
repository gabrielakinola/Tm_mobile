import { ActivityIndicator, Pressable, Modal as RNModal, View } from 'react-native';
import { AlertCircle, X } from 'lucide-react-native';
import { Typography } from '@/components/ui';
import { formatNaira } from '@/lib/format-currency';
import { hapticLight } from '@/lib/haptics';
import {
  formatSubscriptionExpiryDate,
  getDaysSinceExpiry,
  getGracePeriodRemaining,
  getLateRenewalFee,
  getLateRenewalFeeStartsInDays,
  getOutstandingAmount,
  isInGracePeriod,
  MONTHLY_SUBSCRIPTION_NGN,
} from '@/lib/subscription';
import type { SubscriptionRenewalDetails } from '@/lib/subscription-billing';
import { colors, radius, spacing } from '@/theme/tokens';

interface SubscriptionExpiredModalProps {
  visible: boolean;
  renewal: SubscriptionRenewalDetails | null;
  paying?: boolean;
  payError?: string | null;
  onClose: () => void;
  onPay: () => void;
}

function DetailRow({
  label,
  value,
  emphasize,
}: {
  label: string;
  value: string;
  emphasize?: boolean;
}) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md }}>
      <Typography style={[styles.detailLabel, emphasize && styles.detailLabelEmphasis]}>
        {label}
      </Typography>
      <Typography style={[styles.detailValue, emphasize && styles.detailValueEmphasis]}>
        {value}
      </Typography>
    </View>
  );
}

export function SubscriptionExpiredModal({
  visible,
  renewal,
  paying = false,
  payError = null,
  onClose,
  onPay,
}: SubscriptionExpiredModalProps) {
  const now = new Date();
  const subscriptionExpiresAt =
    renewal?.subscriptionExpiryDate ?? renewal?.billing?.expiredAt ?? null;
  const expiryLabel = formatSubscriptionExpiryDate(subscriptionExpiresAt);
  const inGrace = isInGracePeriod(subscriptionExpiresAt, now);
  const graceRemaining =
    renewal?.gracePeriodRemaining ?? getGracePeriodRemaining(subscriptionExpiresAt, now);
  const lateFeeStartsIn = getLateRenewalFeeStartsInDays(subscriptionExpiresAt, now);
  const daysSinceExpiry = getDaysSinceExpiry(subscriptionExpiresAt, now);
  const subscriptionFee =
    renewal?.subscriptionFee ?? renewal?.billing?.renewalAmountNgn ?? MONTHLY_SUBSCRIPTION_NGN;
  const lateRenewalFee =
    renewal?.lateRenewalFee ??
    renewal?.billing?.breakawayFeeAmountNgn ??
    getLateRenewalFee(subscriptionExpiresAt, now);
  const total =
    renewal?.totalAmount ??
    renewal?.billing?.totalAmountOwedNgn ??
    getOutstandingAmount(subscriptionExpiresAt, now);

  const lateRenewalFeeLabel = inGrace
    ? `${formatNaira(lateRenewalFee)} · starts in ${lateFeeStartsIn} day${lateFeeStartsIn === 1 ? '' : 's'}`
    : formatNaira(lateRenewalFee);

  const handleClose = () => {
    if (paying) return;
    void hapticLight();
    onClose();
  };

  const handlePay = () => {
    if (paying) return;
    void hapticLight();
    onPay();
  };

  return (
    <RNModal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close"
            hitSlop={12}
            disabled={paying}
            onPress={handleClose}
            style={styles.closeButton}
          >
            <X size={20} color={colors.neutral[500]} strokeWidth={2.2} />
          </Pressable>

          <View style={styles.iconWrap}>
            <AlertCircle size={24} color={colors.warning[700]} strokeWidth={2.2} />
          </View>

          <View style={styles.copy}>
            <Typography style={styles.title}>Subscription Expired</Typography>
            <Typography style={styles.message}>
              Your monthly subscription has expired. Pay to renew your access and continue using
              Pulse Tickets.
            </Typography>
          </View>

          <View style={styles.details}>
            <DetailRow label="Subscription Expiry Date" value={expiryLabel} />

            {inGrace ? (
              <DetailRow
                label="Grace Period Remaining"
                value={`${graceRemaining} day${graceRemaining === 1 ? '' : 's'}`}
              />
            ) : (
              <DetailRow
                label="Days Since Expiry"
                value={`${daysSinceExpiry} day${daysSinceExpiry === 1 ? '' : 's'}`}
              />
            )}

            <View style={styles.feeSection}>
              <DetailRow label="Subscription fee" value={formatNaira(subscriptionFee)} />
              <DetailRow label="Late Renewal fee" value={lateRenewalFeeLabel} />
              <View style={styles.feeDivider} />
              <DetailRow label="Total" value={formatNaira(total)} emphasize />
            </View>
          </View>

          {payError ? <Typography style={styles.errorText}>{payError}</Typography> : null}

          <Pressable
            accessibilityRole="button"
            disabled={paying}
            onPress={handlePay}
            style={[styles.primaryButton, paying && styles.primaryButtonDisabled]}
          >
            {paying ? (
              <View style={styles.payLoading}>
                <ActivityIndicator color={colors.white} />
                <Typography style={styles.primaryLabel}>Starting payment...</Typography>
              </View>
            ) : (
              <Typography style={styles.primaryLabel}>Pay {formatNaira(total)}</Typography>
            )}
          </Pressable>
        </View>
      </View>
    </RNModal>
  );
}

const styles = {
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  card: {
    backgroundColor: colors.neutral[0],
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    padding: spacing.xl,
    gap: spacing.lg,
  },
  closeButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    zIndex: 2,
    width: 36,
    height: 36,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.warning[50],
  },
  copy: {
    gap: spacing.sm,
    paddingRight: spacing.xl,
  },
  title: {
    color: colors.neutral[950],
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 26,
  },
  message: {
    color: colors.neutral[500],
    fontSize: 14,
    lineHeight: 20,
  },
  details: {
    gap: spacing.sm,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
  },
  feeSection: {
    gap: spacing.sm,
    marginTop: spacing.xs,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[100],
  },
  feeDivider: {
    height: 1,
    backgroundColor: colors.neutral[200],
    marginVertical: spacing.xs,
  },
  detailLabel: {
    flex: 1,
    color: colors.neutral[600],
    fontSize: 13,
    lineHeight: 18,
  },
  detailLabelEmphasis: {
    color: colors.neutral[900],
    fontWeight: '700',
  },
  detailValue: {
    flexShrink: 1,
    maxWidth: '58%',
    color: colors.neutral[900],
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
    textAlign: 'right',
  },
  detailValueEmphasis: {
    fontSize: 15,
    color: colors.pulse[600],
  },
  errorText: {
    color: colors.error[500],
    fontSize: 13,
    lineHeight: 18,
  },
  primaryButton: {
    minHeight: 48,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.pulse[600],
  },
  primaryButtonDisabled: {
    opacity: 0.75,
  },
  payLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  primaryLabel: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
} as const;
