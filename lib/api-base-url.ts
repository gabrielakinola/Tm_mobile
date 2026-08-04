const DEFAULT_API_URL = 'https://api.supportticketmaster.com/api';

/**
 * Uses the configured API for Expo Go, simulators, and IPA builds.
 * The production Ticketmaster API remains the safe fallback for release builds.
 */
export function getApiBaseUrl(): string {
  return process.env.EXPO_PUBLIC_API_URL?.trim() || DEFAULT_API_URL;
}
