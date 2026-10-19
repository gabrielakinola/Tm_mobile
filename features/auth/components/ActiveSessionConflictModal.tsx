import { ActivityIndicator, Pressable, Modal as RNModal, View } from 'react-native';
import { LogOut, Smartphone, X } from 'lucide-react-native';
import { Typography } from '@/components/ui';
import {
  APP_CARD_BG,
  APP_DARK_BG,
  APP_DARK_MUTED,
  APP_DARK_SURFACE,
  APP_INPUT_BG,
} from '@/constants/app-surface';
import { hapticLight } from '@/lib/haptics';
import type { ActiveSessionSummary, DeviceChangePolicy } from '@/services/auth/types';
import { colors, radius, spacing } from '@/theme/tokens';

function formatPlatform(platform: string): string {
  const normalized = platform.toLowerCase();
  if (normalized === 'ios') return 'iOS';
  if (normalized === 'android') return 'Android';
  if (normalized === 'web') return 'Web';
  return platform;
}

function formatLastActive(value?: string): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleString(undefined, {
    month: 'short',
    day: '2-digit',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export interface ActiveSessionConflictModalProps {
  visible: boolean;
  session: ActiveSessionSummary | null;
  deviceChangePolicy?: DeviceChangePolicy | null;
  loading?: boolean;
  error?: string | null;
  onClose: () => void;
  onForceLogoutAndContinue: () => void;
}

export function ActiveSessionConflictModal({
  visible,
  session,
  deviceChangePolicy = null,
  loading = false,
  error = null,
  onClose,
  onForceLogoutAndContinue,
}: ActiveSessionConflictModalProps) {
  const lastActive = formatLastActive(session?.lastActiveAt);
  const deviceLabel = session
    ? `${session.deviceName} (${formatPlatform(String(session.platform))})`
    : 'another device';
  const isDualDevicePlan = deviceChangePolicy?.mode === 'dual_device_slots';
  const showMonthlyDeviceWarning =
    !isDualDevicePlan &&
    deviceChangePolicy?.applies === true &&
    deviceChangePolicy.changesRemaining === 1;
  const showDualDeviceNote = isDualDevicePlan;

  const handleClose = () => {
    if (loading) return;
    void hapticLight();
    onClose();
  };

  const handleForce = () => {
    if (loading) return;
    void hapticLight();
    onForceLogoutAndContinue();
  };

  return (
    <RNModal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <Pressable
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.55)',
          justifyContent: 'center',
          padding: spacing.lg,
        }}
        onPress={handleClose}
      >
        <Pressable
          style={{
            backgroundColor: APP_CARD_BG,
            borderRadius: radius.xl,
            padding: spacing.xl,
            borderWidth: 1,
            borderColor: APP_DARK_SURFACE,
            gap: spacing.lg,
          }}
          onPress={(event) => event.stopPropagation()}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: spacing.md,
            }}
          >
            <View style={{ flex: 1, gap: spacing.xs }}>
              <Typography
                style={{
                  color: colors.white,
                  fontSize: 20,
                  fontWeight: '700',
                  lineHeight: 26,
                }}
              >
                Already signed in
              </Typography>
              <Typography style={{ color: APP_DARK_MUTED, fontSize: 14, lineHeight: 20 }}>
                This account can only be active on one device at a time.
              </Typography>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close"
              hitSlop={8}
              disabled={loading}
              onPress={handleClose}
              style={{
                width: 32,
                height: 32,
                borderRadius: radius.full,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: APP_DARK_BG,
              }}
            >
              <X size={16} color={APP_DARK_MUTED} strokeWidth={2.2} />
            </Pressable>
          </View>

          <View
            style={{
              borderRadius: radius.lg,
              backgroundColor: APP_INPUT_BG,
              padding: spacing.md,
              flexDirection: 'row',
              alignItems: 'center',
              gap: spacing.md,
            }}
          >
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: radius.md,
                backgroundColor: APP_DARK_SURFACE,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Smartphone size={22} color={colors.pulse[600]} strokeWidth={2} />
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <Typography style={{ color: APP_DARK_MUTED, fontSize: 12, fontWeight: '600' }}>
                Currently logged in on
              </Typography>
              <Typography
                style={{ color: colors.white, fontSize: 16, fontWeight: '700' }}
                numberOfLines={2}
              >
                {deviceLabel}
              </Typography>
              {lastActive ? (
                <Typography style={{ color: APP_DARK_MUTED, fontSize: 12 }}>
                  Last active {lastActive}
                </Typography>
              ) : null}
            </View>
          </View>

          <Typography style={{ color: APP_DARK_MUTED, fontSize: 13, lineHeight: 19 }}>
            Continuing here will log out of that device immediately.
          </Typography>

          {showDualDeviceNote ? (
            <View
              style={{
                borderRadius: radius.lg,
                borderWidth: 1,
                borderColor: colors.pulse[400],
                backgroundColor: 'rgba(2, 132, 199, 0.14)',
                padding: spacing.md,
                gap: spacing.xs,
              }}
            >
              <Typography
                style={{
                  color: colors.pulse[300],
                  fontSize: 13,
                  fontWeight: '700',
                  lineHeight: 18,
                }}
              >
                Two-device plan
              </Typography>
              <Typography style={{ color: APP_DARK_MUTED, fontSize: 13, lineHeight: 19 }}>
                You can alternate between your two registered devices anytime. Only one stays signed
                in. A third device is not allowed on this plan.
              </Typography>
            </View>
          ) : null}

          {showMonthlyDeviceWarning ? (
            <View
              style={{
                borderRadius: radius.lg,
                borderWidth: 1,
                borderColor: colors.warning[500],
                backgroundColor: 'rgba(245, 158, 11, 0.16)',
                padding: spacing.md,
                gap: spacing.xs,
              }}
            >
              <Typography
                style={{
                  color: colors.warning[400],
                  fontSize: 13,
                  fontWeight: '700',
                  lineHeight: 18,
                }}
              >
                One device change this subscription
              </Typography>
              <Typography style={{ color: APP_DARK_MUTED, fontSize: 13, lineHeight: 19 }}>
                If you continue, this uses your only device change for the current subscription
                period. After this login, you will not be able to switch devices again until your
                next subscription renewal.
              </Typography>
            </View>
          ) : null}

          {error ? (
            <Typography style={{ color: colors.error[500], fontSize: 13 }}>{error}</Typography>
          ) : null}

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: spacing.md,
            }}
          >
            <Pressable
              accessibilityRole="button"
              disabled={loading}
              onPress={handleClose}
              style={{
                flex: 1,
                minHeight: 48,
                borderRadius: radius.lg,
                borderWidth: 1,
                borderColor: APP_DARK_SURFACE,
                alignItems: 'center',
                justifyContent: 'center',
                opacity: loading ? 0.6 : 1,
              }}
            >
              <Typography style={{ color: colors.white, fontSize: 15, fontWeight: '600' }}>
                Cancel
              </Typography>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Log out other device and continue"
              disabled={loading}
              onPress={handleForce}
              style={{
                width: 56,
                height: 48,
                borderRadius: radius.lg,
                backgroundColor: colors.pulse[600],
                alignItems: 'center',
                justifyContent: 'center',
                opacity: loading ? 0.75 : 1,
              }}
            >
              {loading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <LogOut size={22} color={colors.white} strokeWidth={2.2} />
              )}
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </RNModal>
  );
}
