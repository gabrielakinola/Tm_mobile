import { getApiBaseUrl } from '@/lib/api-base-url';

export const APP_NAME = 'Ticketmaster';
export const APP_SCHEME = 'pulsetickets';
export const APP_SLUG = 'pulse-tickets';

export const API_BASE_URL = getApiBaseUrl();

export const QUERY_STALE_TIME = 1000 * 60 * 5;

export const TAB_ROUTES = {
  home: '/(tabs)/home',
  discover: '/(tabs)/home',
  watchlist: '/(tabs)/for-you',
  forYou: '/(tabs)/for-you',
  tickets: '/(tabs)/tickets',
  account: '/(tabs)/account',
} as const;
