import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { RefreshCw } from 'lucide-react-native';
import { Typography, useToast } from '@/components/ui';
import { AltStoreRefreshConfirmModal } from '@/features/for-you/components/AltStoreRefreshConfirmModal';
import {
  ALTSTORE_REFRESH_CYCLE_DAYS,
  getAltStoreRefreshDaysLeft,
  getAltStoreRefreshDaysLeftTone,
  markAltStoreRefreshed,
  syncAltStoreRefreshExpiresAt,
} from '@/lib/altstore-refresh';
import { hapticLight } from '@/lib/haptics';
import { colors, radius, spacing } from '@/theme/tokens';

export function AltStoreRefreshCard() {
  const { show: showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [, setTick] = useState(0);

  const loadExpiresAt = useCallback(async () => {
    try {
      const stored = await syncAltStoreRefreshExpiresAt();
      setExpiresAt(stored);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadExpiresAt();
    }, [loadExpiresAt]),
  );

  useEffect(() => {
    const interval = setInterval(() => setTick((value) => value + 1), 60_000);
    return () => clearInterval(interval);
  }, []);

  const daysLeft = getAltStoreRefreshDaysLeft(expiresAt);
  const hasStarted = daysLeft !== null;
  const tone = hasStarted ? getAltStoreRefreshDaysLeftTone(daysLeft) : 'green';

  const badgeStyle =
    tone === 'green'
      ? { backgroundColor: colors.success[50] }
      : tone === 'warning'
        ? { backgroundColor: colors.warning[50] }
        : { backgroundColor: colors.error[50] };

  const numberColor =
    tone === 'green'
      ? colors.success[700]
      : tone === 'warning'
        ? colors.warning[700]
        : colors.error[700];

  const handleOpenConfirm = () => {
    void hapticLight();
    setConfirmVisible(true);
  };

  const handleConfirmRefresh = async () => {
    setSaving(true);
    try {
      const nextExpiresAt = await markAltStoreRefreshed();
      setExpiresAt(nextExpiresAt);
      setConfirmVisible(false);
      showToast({
        variant: 'success',
        message: `AltStore refresh countdown reset to ${ALTSTORE_REFRESH_CYCLE_DAYS} days.`,
      });
    } catch {
      showToast({
        variant: 'error',
        message: 'Could not save AltStore refresh. Please try again.',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View
        style={{
          borderRadius: radius.md,
          borderWidth: 1,
          borderColor: colors.neutral[200],
          backgroundColor: colors.neutral[0],
          padding: spacing.md,
          minHeight: 88,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: spacing.lg,
        }}
      >
        <ActivityIndicator color={colors.pulse[600]} />
      </View>
    );
  }

  return (
    <>
      <View
        style={{
          borderRadius: radius.md,
          borderWidth: 1,
          borderColor: colors.neutral[200],
          backgroundColor: colors.neutral[0],
          padding: spacing.md,
          gap: spacing.md,
          marginBottom: spacing.lg,
        }}
      >
        {!hasStarted ? (
          <View style={{ gap: spacing.sm }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
              <View
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: radius.sm,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: colors.pulse[50],
                }}
              >
                <RefreshCw size={16} color={colors.pulse[600]} />
              </View>
              <Typography style={{ color: colors.neutral[900], fontSize: 14, fontWeight: '700' }}>
                AltStore refresh
              </Typography>
            </View>
            <Typography style={{ color: colors.neutral[500], fontSize: 13, lineHeight: 19 }}>
              Refresh the app in AltStore, then tap I have refreshed below to start the{' '}
              {ALTSTORE_REFRESH_CYCLE_DAYS}-day refresh countdown.
            </Typography>
          </View>
        ) : (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: spacing.md,
            }}
          >
            <View style={{ flex: 1, gap: spacing.xs, paddingRight: spacing.sm }}>
              <Typography style={{ color: colors.neutral[900], fontSize: 14, fontWeight: '700' }}>
                AltStore Ticketmaster refresh
              </Typography>
              <Typography style={{ color: colors.neutral[500], fontSize: 12, lineHeight: 17 }}>
                Sideloaded apps expire after {ALTSTORE_REFRESH_CYCLE_DAYS} days without a refresh.
              </Typography>
            </View>

            <View
              style={{
                width: 58,
                borderRadius: radius.md,
                paddingVertical: spacing.sm,
                alignItems: 'center',
                ...badgeStyle,
              }}
            >
              <Typography style={{ color: numberColor, fontWeight: '700', fontSize: 17 }}>
                {daysLeft}
              </Typography>
              <Typography
                style={{
                  color: numberColor,
                  fontSize: 8,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  fontWeight: '600',
                }}
              >
                Days left
              </Typography>
            </View>
          </View>
        )}

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="I have refreshed"
          disabled={saving}
          onPress={handleOpenConfirm}
          style={{
            minHeight: 44,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTopWidth: 1,
            borderTopColor: colors.neutral[200],
            paddingTop: spacing.md,
            opacity: saving ? 0.7 : 1,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
            <View
              style={{
                width: 30,
                height: 30,
                borderRadius: radius.sm,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colors.pulse[50],
              }}
            >
              <RefreshCw size={16} color={colors.pulse[600]} />
            </View>
            <Typography style={{ color: colors.neutral[900], fontSize: 14, fontWeight: '700' }}>
              I have refreshed
            </Typography>
          </View>
          <Typography style={{ color: colors.pulse[600], fontSize: 14, fontWeight: '600' }}>
            Confirm
          </Typography>
        </Pressable>
      </View>

      <AltStoreRefreshConfirmModal
        visible={confirmVisible}
        confirming={saving}
        onClose={() => {
          if (!saving) {
            setConfirmVisible(false);
          }
        }}
        onConfirm={() => void handleConfirmRefresh()}
      />
    </>
  );
}
