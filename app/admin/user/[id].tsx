import { useState, type ReactNode } from 'react';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowDownToLine,
  ArrowLeftRight,
  ArrowUpFromLine,
  Camera,
  ChevronLeft,
  RefreshCw,
  X,
} from 'lucide-react-native';
import {
  ConfirmModal,
  ErrorState,
  Header,
  LoadingState,
  Typography,
  useToast,
} from '@/components/ui';
import {
  APP_CARD_BG,
  APP_DARK_BG,
  APP_DARK_MUTED,
  APP_DARK_SURFACE,
} from '@/constants/app-surface';
import {
  useAdminUser,
  useChangeAdminUserAccess,
  useDeleteAdminUser,
  useExtendAdminUserSubscription,
} from '@/hooks/admin/useAdminUsers';
import { formatNaira } from '@/lib/format-currency';
import {
  addCalendarMonths,
  getLateRenewalFee,
  getOutstandingAmount,
  getSubscriptionDaysLeft,
  getSubscriptionFeeNgn,
} from '@/lib/subscription';
import type { AccessType } from '@/services/auth/types';
import { colors, radius, spacing } from '@/theme/tokens';

function accessTypeLabel(accessType: AccessType): string {
  if (accessType === 'LIFETIME') return 'Lifetime';
  if (accessType === 'MONTHLY_PLUS_DEVICE') return 'Monthly + device';
  return 'Monthly';
}

function AccessTypeCapsule({ accessType }: { accessType: AccessType }) {
  const isLifetime = accessType === 'LIFETIME';
  const label = accessTypeLabel(accessType);

  return (
    <View
      style={{
        alignSelf: 'flex-start',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs + 2,
        borderRadius: radius.full,
        backgroundColor: isLifetime ? colors.neutral[800] : 'rgba(59, 130, 246, 0.18)',
        borderWidth: 1,
        borderColor: isLifetime ? colors.neutral[700] : colors.pulse[500],
      }}
    >
      <Typography
        style={{
          color: isLifetime ? colors.white : colors.pulse[400],
          fontSize: 12,
          fontWeight: '700',
          letterSpacing: 0.3,
        }}
      >
        {label}
      </Typography>
    </View>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ gap: spacing.xs }}>
      <Typography style={{ color: APP_DARK_MUTED, fontSize: 12, fontWeight: '600' }}>
        {label}
      </Typography>
      <Typography style={{ color: colors.white, fontSize: 15, fontWeight: '600' }}>
        {value}
      </Typography>
    </View>
  );
}

function SectionCard({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <View
      style={{
        backgroundColor: APP_CARD_BG,
        borderRadius: radius.xl,
        borderWidth: 1,
        borderColor: APP_DARK_SURFACE,
        padding: spacing.xl,
        gap: spacing.md,
      }}
    >
      {title ? (
        <Typography style={{ color: colors.white, fontSize: 16, fontWeight: '700' }}>
          {title}
        </Typography>
      ) : null}
      {children}
    </View>
  );
}

function OutlineButton({
  label,
  icon,
  onPress,
  disabled,
  borderColor,
  textColor,
  iconColor,
}: {
  label: string;
  icon: ReactNode;
  onPress: () => void;
  disabled?: boolean;
  borderColor: string;
  textColor: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      style={{
        minHeight: 48,
        borderRadius: radius.lg,
        backgroundColor: APP_CARD_BG,
        borderWidth: 1,
        borderColor,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        opacity: disabled ? 0.7 : 1,
      }}
    >
      {icon}
      <Typography style={{ color: textColor, fontSize: 15, fontWeight: '700' }}>{label}</Typography>
    </Pressable>
  );
}

function formatDate(value: string | null): string {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

export default function AdminUserDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { show } = useToast();
  const { id } = useLocalSearchParams<{ id: string }>();
  const userId = typeof id === 'string' ? id : undefined;
  const userQuery = useAdminUser(userId);
  const deleteMutation = useDeleteAdminUser();
  const extendMutation = useExtendAdminUserSubscription();
  const changeAccessMutation = useChangeAdminUserAccess();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [pendingAccessChange, setPendingAccessChange] = useState<{
    accessType: AccessType;
    title: string;
    message: string;
    confirmLabel: string;
  } | null>(null);
  const [confirmExtend, setConfirmExtend] = useState(false);

  const backAction = (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.back()}
      hitSlop={8}
      style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}
    >
      <ChevronLeft size={24} color={colors.white} strokeWidth={2.2} />
    </Pressable>
  );

  if (userQuery.isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: APP_DARK_BG }}>
        <Header title="User details" leftAction={backAction} />
        <LoadingState inverted message="Loading user…" />
      </View>
    );
  }

  if (userQuery.isError || !userQuery.data) {
    return (
      <View style={{ flex: 1, backgroundColor: APP_DARK_BG }}>
        <Header title="User details" leftAction={backAction} />
        <ErrorState
          inverted
          title="User not found"
          message="This account may have been removed."
          onRetry={() => void userQuery.refetch()}
        />
      </View>
    );
  }

  const user = userQuery.data;
  const profile = user.defaultProfile;
  const isLifetime = user.accessType === 'LIFETIME';
  const daysLeft = getSubscriptionDaysLeft(user.subscriptionExpiresAt);
  const isExpired = !isLifetime && daysLeft === 0;
  const subscriptionFee = getSubscriptionFeeNgn(user.accessType);
  const lateFee = isExpired ? getLateRenewalFee(user.subscriptionExpiresAt) : 0;
  const payableAmount = isExpired
    ? getOutstandingAmount(user.subscriptionExpiresAt, new Date(), user.accessType)
    : subscriptionFee;
  const extendLabel = isExpired
    ? `Renew · ${formatNaira(payableAmount)}`
    : `Top up · ${formatNaira(payableAmount)}`;
  const nextExpiry = isExpired
    ? addCalendarMonths(new Date(), 1)
    : addCalendarMonths(
        user.subscriptionExpiresAt ? new Date(user.subscriptionExpiresAt) : new Date(),
        1,
      );
  const extendMessage = isExpired
    ? [
        `This subscription has expired. Renewing starts a new month from today, not from the old expiry date. Access will run until ${formatDate(nextExpiry.toISOString())}.`,
        `Amount due: ${formatNaira(payableAmount)}${
          lateFee > 0
            ? ` (${formatNaira(subscriptionFee)} plan + ${formatNaira(lateFee)} late fee)`
            : ` (${formatNaira(subscriptionFee)} plan)`
        }.`,
      ].join('\n\n')
    : `This user has ${daysLeft} day${daysLeft === 1 ? '' : 's'} left. Topping up adds one calendar month on top of the current expiry for ${formatNaira(payableAmount)}. Access will then run until ${formatDate(nextExpiry.toISOString())}.`;

  return (
    <View style={{ flex: 1, backgroundColor: APP_DARK_BG }}>
      <Header title="User details" leftAction={backAction} />

      <ScrollView
        contentContainerStyle={{
          padding: spacing.lg,
          paddingBottom: spacing['3xl'] + insets.bottom,
          gap: spacing.lg,
        }}
      >
        <SectionCard>
          <DetailRow label="Email" value={user.email} />
          <DetailRow label="Account name" value={user.accountName} />
          <View style={{ gap: spacing.xs }}>
            <Typography style={{ color: APP_DARK_MUTED, fontSize: 12, fontWeight: '600' }}>
              Access type
            </Typography>
            <AccessTypeCapsule accessType={user.accessType} />
          </View>
          {user.pendingAccessType ? (
            <DetailRow
              label="Scheduled change"
              value={`${accessTypeLabel(user.pendingAccessType)} from next cycle (${formatDate(user.subscriptionExpiresAt)})`}
            />
          ) : null}
          <DetailRow label="Subscription expires" value={formatDate(user.subscriptionExpiresAt)} />
          {!isLifetime ? (
            <DetailRow
              label="Days left"
              value={isExpired ? 'Expired' : `${daysLeft} day${daysLeft === 1 ? '' : 's'}`}
            />
          ) : null}
          <DetailRow label="Created" value={formatDate(user.createdAt)} />
          <DetailRow label="Updated" value={formatDate(user.updatedAt)} />
          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            <View style={{ flex: 1 }}>
              <OutlineButton
                label="Transfers"
                borderColor={colors.pulse[500]}
                textColor={colors.pulse[400]}
                onPress={() => router.push(`/admin/activity/${user.id}`)}
                icon={<ArrowLeftRight size={18} color={colors.pulse[400]} strokeWidth={2.2} />}
              />
            </View>
            <View style={{ flex: 1 }}>
              <OutlineButton
                label="Top events"
                borderColor={colors.pulse[500]}
                textColor={colors.pulse[400]}
                onPress={() => router.push(`/admin/top-events/${user.id}`)}
                icon={<Camera size={18} color={colors.pulse[400]} strokeWidth={2.2} />}
              />
            </View>
          </View>
        </SectionCard>

        <SectionCard title="Default profile">
          {profile ? (
            <>
              <DetailRow
                label="Name"
                value={`${profile.firstName} ${profile.lastName}`.trim() || '—'}
              />
              <DetailRow label="Display email" value={profile.displayEmail || '—'} />
              <DetailRow label="City" value={profile.city || '—'} />
              <DetailRow label="Country" value={profile.country || '—'} />
            </>
          ) : (
            <Typography style={{ color: APP_DARK_MUTED, fontSize: 14 }}>
              No default profile.
            </Typography>
          )}
        </SectionCard>

        <SectionCard title="Settings">
          <DetailRow
            label="Wallet transfers"
            value={user.settings.enableWalletForTicketTransfers ? 'Enabled' : 'Disabled'}
          />
          <DetailRow
            label="Wallet passes remaining"
            value={
              user.settings.unlimitedWalletPasses
                ? 'Unlimited'
                : String(user.settings.walletPassesRemaining)
            }
          />
          <DetailRow
            label="Transfer fee interruption"
            value={
              user.settings.enableTransferFeeInterruption
                ? `${user.settings.transferFeeCurrency || 'USD'} ${user.settings.transferFeePerTicket || '—'}`.trim()
                : 'Disabled'
            }
          />
          <DetailRow
            label="Acceptance authorization"
            value={user.settings.enableTransferAcceptanceAuthorization ? 'Enabled' : 'Disabled'}
          />
          <DetailRow
            label="Ticket screenshot blocking"
            value={user.settings.enableTicketScreenshotBlocking ? 'Enabled' : 'Disabled'}
          />
        </SectionCard>

        {!isLifetime ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={extendLabel}
            disabled={extendMutation.isPending}
            onPress={() => setConfirmExtend(true)}
            style={{
              minHeight: 48,
              borderRadius: radius.lg,
              backgroundColor: colors.pulse[600],
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: spacing.sm,
              opacity: extendMutation.isPending ? 0.7 : 1,
            }}
          >
            {extendMutation.isPending ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <>
                <RefreshCw size={18} color={colors.white} strokeWidth={2.2} />
                <Typography style={{ color: colors.white, fontSize: 15, fontWeight: '700' }}>
                  {extendLabel}
                </Typography>
              </>
            )}
          </Pressable>
        ) : null}

        <View style={{ gap: spacing.sm }}>
          <Typography style={{ color: colors.white, fontSize: 14, fontWeight: '700' }}>
            Plan change
          </Typography>
          {user.pendingAccessType ? (
            <OutlineButton
              label="Cancel scheduled change"
              disabled={changeAccessMutation.isPending}
              borderColor={APP_DARK_SURFACE}
              textColor={colors.white}
              onPress={() =>
                setPendingAccessChange({
                  accessType: user.accessType,
                  title: 'Cancel scheduled change?',
                  message: `Keep this user on ${accessTypeLabel(user.accessType)} and cancel the scheduled move to ${accessTypeLabel(user.pendingAccessType!)}.`,
                  confirmLabel: 'Cancel change',
                })
              }
              icon={<X size={18} color={colors.white} strokeWidth={2.2} />}
            />
          ) : null}

          {user.accessType === 'MONTHLY' ? (
            <OutlineButton
              label="Upgrade to Monthly +"
              disabled={changeAccessMutation.isPending}
              borderColor={colors.pulse[500]}
              textColor={colors.pulse[400]}
              onPress={() =>
                setPendingAccessChange({
                  accessType: 'MONTHLY_PLUS_DEVICE',
                  title: 'Upgrade to Monthly + device?',
                  message:
                    'This takes effect immediately. The user can register a second device right away. Subscription end date stays the same.',
                  confirmLabel: 'Upgrade now',
                })
              }
              icon={<ArrowUpFromLine size={18} color={colors.pulse[400]} strokeWidth={2.2} />}
            />
          ) : null}

          {user.accessType === 'MONTHLY_PLUS_DEVICE' ? (
            <OutlineButton
              label="Downgrade to Monthly"
              disabled={changeAccessMutation.isPending}
              borderColor={colors.warning[500]}
              textColor={colors.warning[500]}
              onPress={() =>
                setPendingAccessChange({
                  accessType: 'MONTHLY',
                  title: 'Downgrade to Monthly?',
                  message: isExpired
                    ? 'Subscription is not active, so this downgrade applies immediately.'
                    : `User keeps Monthly + device until ${formatDate(user.subscriptionExpiresAt)}. Downgrade to Monthly applies from the next subscription cycle.`,
                  confirmLabel: isExpired ? 'Downgrade now' : 'Schedule downgrade',
                })
              }
              icon={<ArrowDownToLine size={18} color={colors.warning[500]} strokeWidth={2.2} />}
            />
          ) : null}

          {user.accessType !== 'LIFETIME' ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Upgrade to Lifetime"
              disabled={changeAccessMutation.isPending}
              onPress={() =>
                setPendingAccessChange({
                  accessType: 'LIFETIME',
                  title: 'Upgrade to Lifetime?',
                  message:
                    'This takes effect immediately. Monthly billing and device limits no longer apply.',
                  confirmLabel: 'Upgrade to Lifetime',
                })
              }
              style={{
                minHeight: 48,
                borderRadius: radius.lg,
                backgroundColor: colors.neutral[800],
                borderWidth: 1,
                borderColor: colors.neutral[700],
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: spacing.sm,
                opacity: changeAccessMutation.isPending ? 0.7 : 1,
              }}
            >
              <ArrowUpFromLine size={18} color={colors.white} strokeWidth={2.2} />
              <Typography style={{ color: colors.white, fontSize: 15, fontWeight: '700' }}>
                Upgrade to Lifetime
              </Typography>
            </Pressable>
          ) : (
            <OutlineButton
              label="Downgrade to Monthly"
              disabled={changeAccessMutation.isPending}
              borderColor={colors.warning[500]}
              textColor={colors.warning[500]}
              onPress={() =>
                setPendingAccessChange({
                  accessType: 'MONTHLY',
                  title: 'Downgrade to Monthly?',
                  message:
                    'Lifetime has no billing cycle, so this applies immediately and starts a one-month Monthly subscription from today.',
                  confirmLabel: 'Downgrade now',
                })
              }
              icon={<ArrowDownToLine size={18} color={colors.warning[500]} strokeWidth={2.2} />}
            />
          )}
        </View>

        <Pressable
          accessibilityRole="button"
          disabled={deleteMutation.isPending}
          onPress={() => setConfirmDelete(true)}
          style={{
            minHeight: 48,
            borderRadius: radius.lg,
            backgroundColor: colors.error[500],
            alignItems: 'center',
            justifyContent: 'center',
            opacity: deleteMutation.isPending ? 0.7 : 1,
          }}
        >
          {deleteMutation.isPending ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Typography style={{ color: colors.white, fontSize: 15, fontWeight: '700' }}>
              Delete user
            </Typography>
          )}
        </Pressable>
      </ScrollView>

      <ConfirmModal
        visible={confirmExtend}
        title={isExpired ? 'Renew subscription?' : 'Top up subscription?'}
        message={extendMessage}
        confirmLabel={extendLabel}
        variant="default"
        loading={extendMutation.isPending}
        onClose={() => setConfirmExtend(false)}
        onConfirm={() => {
          if (!userId) return;
          extendMutation.mutate(userId, {
            onSuccess: (response) => {
              setConfirmExtend(false);
              show({
                message:
                  response.action === 'renew'
                    ? 'Subscription renewed from today.'
                    : 'Subscription topped up by one month.',
                variant: 'success',
              });
            },
            onError: () => {
              setConfirmExtend(false);
              show({ message: 'Unable to update subscription.', variant: 'error' });
            },
          });
        }}
      />

      <ConfirmModal
        visible={confirmDelete}
        title="Delete user?"
        message={`This permanently removes ${user.email} and their profiles/settings. This cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        loading={deleteMutation.isPending}
        onClose={() => setConfirmDelete(false)}
        onConfirm={() => {
          if (!userId) return;
          deleteMutation.mutate(userId, {
            onSuccess: () => {
              setConfirmDelete(false);
              show({ message: 'User deleted.', variant: 'success' });
              router.replace('/admin/users');
            },
            onError: () => {
              setConfirmDelete(false);
              show({ message: 'Unable to delete user.', variant: 'error' });
            },
          });
        }}
      />

      <ConfirmModal
        visible={Boolean(pendingAccessChange)}
        title={pendingAccessChange?.title ?? 'Change plan?'}
        message={pendingAccessChange?.message ?? ''}
        confirmLabel={pendingAccessChange?.confirmLabel ?? 'Confirm'}
        variant="default"
        loading={changeAccessMutation.isPending}
        onClose={() => setPendingAccessChange(null)}
        onConfirm={() => {
          if (!userId || !pendingAccessChange) return;
          changeAccessMutation.mutate(
            { userId, accessType: pendingAccessChange.accessType },
            {
              onSuccess: (response) => {
                setPendingAccessChange(null);
                const message =
                  response.action === 'upgraded'
                    ? 'User upgraded immediately.'
                    : response.action === 'downgrade_scheduled'
                      ? 'Downgrade scheduled for the next subscription cycle.'
                      : response.action === 'cancelled_pending'
                        ? 'Scheduled plan change cancelled.'
                        : 'User downgraded.';
                show({ message, variant: 'success' });
              },
              onError: () => {
                setPendingAccessChange(null);
                show({ message: 'Unable to change access type.', variant: 'error' });
              },
            },
          );
        }}
      />
    </View>
  );
}
