import * as SplashScreen from 'expo-splash-screen';
import { API_BASE_URL } from '@/constants/app';

/** Minimum time the splash stays fully visible before fade-out starts. */
const SPLASH_MIN_VISIBLE_MS = 2000;
/** Fade-out duration (iOS supports animated fade via setOptions). */
const SPLASH_FADE_MS = 500;

let preventRequested = false;
let hideRequested = false;
let splashShownAt = 0;

/** Keep the native splash up until auth bootstrap finishes (+ min display time). */
export function preventSplashAutoHide(): void {
  if (preventRequested) {
    return;
  }
  preventRequested = true;
  splashShownAt = Date.now();

  try {
    SplashScreen.setOptions({
      duration: SPLASH_FADE_MS,
      fade: true,
    });
  } catch {
    // setOptions may be unavailable in some environments.
  }

  void SplashScreen.preventAutoHideAsync().catch(() => {
    // Expo Go / already-visible splash — ignore.
  });
}

/**
 * Hide the splash at most once for the app lifetime.
 * Waits until ~2s have elapsed, then fades out before revealing the next screen.
 */
export function hideSplashOnce(): void {
  if (hideRequested) {
    return;
  }
  hideRequested = true;

  const elapsed = splashShownAt > 0 ? Date.now() - splashShownAt : 0;
  const waitMs = Math.max(0, SPLASH_MIN_VISIBLE_MS - elapsed);

  void (async () => {
    if (waitMs > 0) {
      await new Promise<void>((resolve) => setTimeout(resolve, waitMs));
    }

    try {
      SplashScreen.setOptions({
        duration: SPLASH_FADE_MS,
        fade: true,
      });
    } catch {
      // Ignore — hideAsync still runs.
    }

    try {
      await SplashScreen.hideAsync();
    } catch {
      // Native module may throw if splash was already dismissed.
    }

    console.log(`[API] Using base URL: ${API_BASE_URL}`);
  })();
}
