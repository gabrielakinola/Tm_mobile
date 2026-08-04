import * as Linking from 'expo-linking';
import { APP_SCHEME } from '@/constants/app';

export const FLUTTERWAVE_SUCCESS_PATH = 'payments/flutterwave/success';
export const FLUTTERWAVE_REDIRECT_URL = `${APP_SCHEME}://${FLUTTERWAVE_SUCCESS_PATH}`;

export function extractTxRefFromUrl(url: string | null | undefined): string | null {
  if (!url) {
    return null;
  }

  try {
    const parsed = Linking.parse(url);
    const fromQuery = parsed.queryParams?.tx_ref;
    if (typeof fromQuery === 'string' && fromQuery.trim()) {
      return fromQuery.trim();
    }

    const fallback = new URL(url);
    const txRef = fallback.searchParams.get('tx_ref');
    return txRef?.trim() || null;
  } catch {
    const match = /[?&]tx_ref=([^&#]+)/i.exec(url);
    return match?.[1] ? decodeURIComponent(match[1]) : null;
  }
}

export async function openFlutterwaveCheckout(checkoutUrl: string): Promise<{
  type: 'success' | 'cancel' | 'dismiss';
  url?: string;
  txRef?: string | null;
}> {
  // Lazy-load so screens that import this module (e.g. event detail → transfer sheet)
  // do not require ExpoWebBrowser until the user actually starts checkout.
  const WebBrowser = await import('expo-web-browser');
  WebBrowser.maybeCompleteAuthSession();

  const result = await WebBrowser.openAuthSessionAsync(checkoutUrl, FLUTTERWAVE_REDIRECT_URL);

  if (result.type === 'success') {
    return {
      type: 'success',
      url: result.url,
      txRef: extractTxRefFromUrl(result.url),
    };
  }

  if (result.type === 'cancel') {
    return { type: 'cancel' };
  }

  return { type: 'dismiss' };
}
