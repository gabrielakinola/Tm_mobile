import { useCallback, useEffect, useRef, useState } from 'react';
import { NativeEventEmitter, NativeModules, Platform } from 'react-native';
import { useFocusEffect } from 'expo-router';
import * as ScreenCapture from 'expo-screen-capture';
import {
  reportEventScreenCaptureRequest,
  type EventScreenCaptureScreen,
  type EventScreenCaptureType,
} from '@/services/events/events.api';

const REPORT_THROTTLE_MS = 500;

type UseEventScreenCaptureTrackingOptions = {
  eventId?: string;
  screen: EventScreenCaptureScreen;
  enabled?: boolean;
};

function canUseIosRecordingDetection(): boolean {
  return Platform.OS === 'ios' && Boolean(NativeModules.IsScreenCapturedIos);
}

/**
 * Logs screenshots (iOS + Android) and recording starts (iOS) while the screen is focused.
 */
export function useEventScreenCaptureTracking({
  eventId,
  screen,
  enabled = true,
}: UseEventScreenCaptureTrackingOptions) {
  const [isFocused, setIsFocused] = useState(false);
  const active = Boolean(enabled && eventId && isFocused);
  const lastReportAtRef = useRef(0);
  const wasCapturedRef = useRef(false);

  useFocusEffect(
    useCallback(() => {
      setIsFocused(true);
      return () => setIsFocused(false);
    }, []),
  );

  const report = useCallback(
    async (type: EventScreenCaptureType) => {
      if (!eventId) return;
      const now = Date.now();
      if (now - lastReportAtRef.current < REPORT_THROTTLE_MS) {
        return;
      }
      lastReportAtRef.current = now;
      try {
        await reportEventScreenCaptureRequest(eventId, { type, screen });
      } catch {
        // Tracking must never block the ticket UI.
      }
    },
    [eventId, screen],
  );

  useEffect(() => {
    if (!active) {
      return;
    }

    let subscription: { remove: () => void } | undefined;
    let cancelled = false;

    const start = async () => {
      try {
        if (Platform.OS === 'android') {
          const permissions = await ScreenCapture.getPermissionsAsync();
          if (!permissions.granted) {
            const requested = await ScreenCapture.requestPermissionsAsync();
            if (!requested.granted) {
              return;
            }
          }
        }
        if (cancelled) return;
        subscription = ScreenCapture.addScreenshotListener(() => {
          void report('screenshot');
        });
      } catch {
        // Screenshot listener unavailable (e.g. unsupported environment).
      }
    };

    void start();

    return () => {
      cancelled = true;
      subscription?.remove();
    };
  }, [active, report]);

  useEffect(() => {
    if (!active || !canUseIosRecordingDetection()) {
      wasCapturedRef.current = false;
      return;
    }

    let subscription: { remove: () => void } | undefined;
    let cancelled = false;

    const start = async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const mod = require('react-native-is-screen-captured-ios') as {
          default?: { getIsCaptured: () => Promise<boolean> };
        };
        const api = mod.default;
        if (!api?.getIsCaptured) return;

        const emitter = new NativeEventEmitter(NativeModules.IsScreenCapturedIos);
        const initial = await api.getIsCaptured();
        if (cancelled) return;
        wasCapturedRef.current = initial;

        subscription = emitter.addListener('isScreenCaptured', (captured: boolean) => {
          const isCaptured = Boolean(captured);
          if (isCaptured && !wasCapturedRef.current) {
            void report('recording');
          }
          wasCapturedRef.current = isCaptured;
        });
      } catch {
        // Recording detection unavailable outside a native iOS build.
      }
    };

    void start();

    return () => {
      cancelled = true;
      subscription?.remove();
    };
  }, [active, report]);
}
