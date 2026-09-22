import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Typography } from '@/components/ui';
import { APP_CARD_BG, APP_DARK_MUTED } from '@/constants/app-surface';
import {
  ALTSTORE_REFRESH_CYCLE_DAYS,
  getAltStoreRefreshDaysLeft,
  getAltStoreRefreshDaysLeftTone,
  syncAltStoreRefreshExpiresAt,
} from '@/lib/altstore-refresh';
import { colors, radius, spacing } from '@/theme/tokens';

export function AltStoreRefreshCard() {
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [, setTick] = useState(0);

  const loadExpiresAt = useCallback(async () => {
    try {
      const stored = await syncAltStoreRefreshExpiresAt();
      setExpiresAt(stored);
    } finally {
      setReady(true);
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
  if (!ready || daysLeft === null) {
    return null;
  }

  const tone = getAltStoreRefreshDaysLeftTone(daysLeft);
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

  return (
    <View
      style={{
        borderRadius: radius.md,
        backgroundColor: APP_CARD_BG,
        padding: spacing.md,
        marginBottom: spacing.lg,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: spacing.md,
        }}
      >
        <View style={{ flex: 1, gap: spacing.xs, paddingRight: spacing.sm }}>
          <Typography style={{ color: colors.white, fontSize: 14, fontWeight: '700' }}>
            AltStore Ticketmaster refresh
          </Typography>
          <Typography style={{ color: APP_DARK_MUTED, fontSize: 12, lineHeight: 17 }}>
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
    </View>
  );
}
