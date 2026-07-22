import * as SplashScreen from 'expo-splash-screen';

let preventRequested = false;
let hideRequested = false;

/** Keep the native splash up until auth bootstrap finishes. */
export function preventSplashAutoHide(): void {
  if (preventRequested) {
    return;
  }
  preventRequested = true;
  void SplashScreen.preventAutoHideAsync().catch(() => {
    // Expo Go / already-visible splash — ignore.
  });
}

/**
 * Hide the splash at most once for the app lifetime.
 * Avoids "No native splash screen registered for given view controller"
 * when hide is called again after login / navigation.
 */
export function hideSplashOnce(): void {
  if (hideRequested) {
    return;
  }
  hideRequested = true;

  try {
    SplashScreen.hide();
  } catch {
    // Native module may throw if splash was already dismissed.
  }

  void Promise.resolve()
    .then(() => SplashScreen.hideAsync())
    .catch(() => {
      // Swallow unhandled native promise rejections from a second hide.
    });
}
