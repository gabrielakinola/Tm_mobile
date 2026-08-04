import { getApiBaseUrl } from '@/lib/api-base-url';

export const APP_NAME = 'Ticketmaster';
export const APP_SCHEME = 'pulsetickets';
export const APP_SLUG = 'pulse-tickets';

export const API_BASE_URL = getApiBaseUrl();

export const QUERY_STALE_TIME = 1000 * 60 * 5;

export const TAB_ROUTES = {
  discover: '/(tabs)/discover',
  forYou: '/(tabs)/for-you',
  tickets: '/(tabs)/tickets',
  sell: '/(tabs)/sell',
  account: '/(tabs)/account',
} as const;
