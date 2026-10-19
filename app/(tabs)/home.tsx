import { useMemo, useRef, useState } from 'react';
import {
  Pressable,
  ScrollView,
  TextInput,
  useWindowDimensions,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowRight, ChevronRight, Search } from 'lucide-react-native';
import { LocationPinIcon } from '@/components/icons/DiscoverLocationPinIcon';
import { KeyboardAwareScrollView, Typography } from '@/components/ui';
import { APP_DARK_BG, APP_DARK_SURFACE, APP_SEARCH_ICON_BG } from '@/constants/app-surface';
import {
  HomeEventRailSkeleton,
  HomeForYouSkeletonRail,
  HomeJustAnnouncedSkeletonRail,
  HomeTrendingSkeletonRail,
} from '@/features/home/components/HomeFeedSkeletons';
import { HomeForYouCard } from '@/features/home/components/HomeForYouCard';
import { HomeJustAnnouncedCard } from '@/features/home/components/HomeJustAnnouncedCard';
import { HomeLastMinuteCard } from '@/features/home/components/HomeLastMinuteCard';
import { HomeSearchPlaceholder } from '@/features/home/components/HomeSearchPlaceholder';
import { HomeTrendingRow } from '@/features/home/components/HomeTrendingRow';
import { HomeWeekendCard } from '@/features/home/components/HomeWeekendCard';
import { COUNTRY_OPTIONS } from '@/features/profile-location/constants';
import {
  useTicketmasterForYou,
  useTicketmasterJustAnnounced,
  useTicketmasterLastMinute,
  useTicketmasterTrending,
  useTicketmasterWeekend,
} from '@/hooks';
import {
  MOCK_HOME_WEEKEND,
  type HomeForYouEvent,
  type HomeJustAnnouncedEvent,
  type HomeLastMinuteEvent,
  type HomeTrendingItem,
} from '@/mocks/home-feed';
import type { TicketmasterHomeEvent } from '@/services/ticketmaster/types';
import { useAuthStore } from '@/stores/auth-store';
import { useProfileStore } from '@/stores/profile-store';
import { colors, spacing } from '@/theme/tokens';

const EXTRA_HOME_SECTIONS = ['Popular Near You', 'Live Music', 'Sports & More'] as const;
const FLOATING_ACTION_TRAVEL = 96;
const EVENT_ACCENT_COLORS = ['#25C1B6', '#A84A52', '#E99A77', '#7B75C9', '#20E239'] as const;

function formatTicketmasterDate(localDate: string) {
  const [year, month, day] = localDate.split('-').map(Number);
  if (!year || !month || !day) {
    return { month: '', day: '', weekday: 'Date TBA' };
  }

  const date = new Date(year, month - 1, day, 12);
  return {
    month: new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date),
    day: String(day).padStart(2, '0'),
    weekday: new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date),
  };
}

function formatTicketmasterTime(localTime: string) {
  const [hour, minute] = localTime.split(':').map(Number);
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) {
    return 'Time TBA';
  }

  const time = new Date(2000, 0, 1, hour, minute);
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(time);
}

function mapTicketmasterHomeEvent(event: TicketmasterHomeEvent, index: number): HomeForYouEvent {
  const date = formatTicketmasterDate(event.localDate);
  const location = [event.city, event.stateCode, event.countryCode].filter(Boolean).join(', ');
  const venue = [location, event.venueName].filter(Boolean).join(' - ');

  return {
    id: event.id,
    title: event.attractionName || event.title,
    imageUrl: event.imageUrl,
    month: date.month,
    day: date.day,
    weekdayTime: `${date.weekday} · ${formatTicketmasterTime(event.localTime)}`,
    venue,
    city: event.city,
    countryCode: event.countryCode,
    accentColor: EVENT_ACCENT_COLORS[index % EVENT_ACCENT_COLORS.length],
  };
}

function mapTicketmasterJustAnnouncedEvent(event: TicketmasterHomeEvent): HomeJustAnnouncedEvent {
  const [year, month, day] = event.localDate.split('-').map(Number);
  const date = year && month && day ? new Date(year, month - 1, day, 12) : null;
  const dateLabel = date
    ? `${new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date)} ${day} ${new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date)}`
    : 'Date TBA';
  const location = [event.city, event.stateCode].filter(Boolean).join(', ') || event.venueName;

  return {
    id: event.id,
    dateLabel,
    title: (event.attractionName || event.title).toUpperCase(),
    time: formatTicketmasterTime(event.localTime),
    location,
    imageUrl: event.imageUrl,
  };
}

function mapTicketmasterLastMinuteEvent(event: TicketmasterHomeEvent): HomeLastMinuteEvent {
  const [year, month, day] = event.localDate.split('-').map(Number);
  const date = year && month && day ? new Date(year, month - 1, day, 12) : null;
  const dateLabel = date
    ? `${new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date)} ${day} ${new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date)}`
    : 'Date TBA';

  return {
    id: event.id,
    dateLabel,
    title: event.attractionName || event.title,
    time: formatTicketmasterTime(event.localTime),
    venue: event.venueName || event.city,
    imageUrl: event.imageUrl,
  };
}

function formatLocationLabel(city: string, countryCode: string) {
  const countryLabel = getCountryLabel(countryCode);
  if (city) {
    return `${city}, ${countryCode}`;
  }
  return countryLabel;
}

function getCountryLabel(countryCode: string) {
  return COUNTRY_OPTIONS.find((option) => option.value === countryCode)?.label ?? countryCode;
}

function normalizeCity(city: string) {
  return city.split(',')[0]?.trim().toLowerCase() ?? '';
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const router = useRouter();
  const searchInputRef = useRef<TextInput>(null);
  const lastScrollYRef = useRef(0);
  const isFloatingActionVisibleRef = useRef(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const floatingActionY = useSharedValue(0);
  const authStatus = useAuthStore((state) => state.status);
  const defaultProfile = useProfileStore((state) => state.defaultProfile);
  const user = useAuthStore((state) => state.user);
  const countryCode = defaultProfile?.country || user?.defaultProfile?.country || 'US';
  const city = defaultProfile?.city || user?.defaultProfile?.city || '';
  const profileId = defaultProfile?.id || user?.defaultProfile?.id;
  const hasProfileLocation = Boolean(city.trim());
  const {
    data: forYouFeed,
    isLoading: isForYouLoading,
    isError: isForYouError,
    refetch: refetchForYou,
  } = useTicketmasterForYou(
    authStatus === 'authenticated' && hasProfileLocation,
    [
      profileId ?? 'no-profile',
      city,
      countryCode,
      ...(defaultProfile?.preferredCategoryIds ?? user?.defaultProfile?.preferredCategoryIds ?? []),
      ...(defaultProfile?.preferredGenreIds ?? user?.defaultProfile?.preferredGenreIds ?? []),
    ].join(':'),
  );
  const forYouEvents = useMemo(
    () => (forYouFeed?.events ?? []).map(mapTicketmasterHomeEvent),
    [forYouFeed?.events],
  );
  const {
    data: lastMinuteFeed,
    isLoading: isLastMinuteLoading,
    isError: isLastMinuteError,
    refetch: refetchLastMinute,
  } = useTicketmasterLastMinute(
    authStatus === 'authenticated' && hasProfileLocation,
    [
      profileId ?? 'no-profile',
      city,
      countryCode,
      ...(defaultProfile?.preferredCategoryIds ?? user?.defaultProfile?.preferredCategoryIds ?? []),
      ...(defaultProfile?.preferredGenreIds ?? user?.defaultProfile?.preferredGenreIds ?? []),
    ].join(':'),
  );
  const lastMinuteEvents = useMemo(
    () => (lastMinuteFeed?.events ?? []).map(mapTicketmasterLastMinuteEvent),
    [lastMinuteFeed?.events],
  );
  const {
    data: weekendFeed,
    isLoading: isWeekendLoading,
    isError: isWeekendError,
    refetch: refetchWeekend,
  } = useTicketmasterWeekend(
    authStatus === 'authenticated' && hasProfileLocation,
    [
      profileId ?? 'no-profile',
      city,
      countryCode,
      ...(defaultProfile?.preferredCategoryIds ?? user?.defaultProfile?.preferredCategoryIds ?? []),
      ...(defaultProfile?.preferredGenreIds ?? user?.defaultProfile?.preferredGenreIds ?? []),
    ].join(':'),
  );
  const weekendEvents = useMemo(
    () => (weekendFeed?.events ?? []).map(mapTicketmasterLastMinuteEvent),
    [weekendFeed?.events],
  );
  const {
    data: justAnnouncedFeed,
    isLoading: isJustAnnouncedLoading,
    isError: isJustAnnouncedError,
    refetch: refetchJustAnnounced,
  } = useTicketmasterJustAnnounced(
    authStatus === 'authenticated' && hasProfileLocation,
    [
      profileId ?? 'no-profile',
      city,
      countryCode,
      ...(defaultProfile?.preferredCategoryIds ?? user?.defaultProfile?.preferredCategoryIds ?? []),
      ...(defaultProfile?.preferredGenreIds ?? user?.defaultProfile?.preferredGenreIds ?? []),
    ].join(':'),
  );
  const justAnnouncedEvents = useMemo(
    () => (justAnnouncedFeed?.events ?? []).map(mapTicketmasterJustAnnouncedEvent),
    [justAnnouncedFeed?.events],
  );
  const {
    data: trendingFeed,
    isLoading: isTrendingLoading,
    isError: isTrendingError,
    refetch: refetchTrending,
  } = useTicketmasterTrending(
    authStatus === 'authenticated' && Boolean(countryCode),
    countryCode,
    [
      ...(defaultProfile?.preferredCategoryIds ?? user?.defaultProfile?.preferredCategoryIds ?? []),
      ...(defaultProfile?.preferredGenreIds ?? user?.defaultProfile?.preferredGenreIds ?? []),
    ].join(':'),
  );
  const trendingItems: HomeTrendingItem[] = trendingFeed?.items ?? [];
  const locationLabel = formatLocationLabel(city, countryCode);
  const countryLabel = getCountryLabel(countryCode);
  const trendingColumnWidth = Math.max(screenWidth - 62, 275);
  const lastMinuteCardWidth = Math.max(
    140,
    Math.floor((screenWidth - spacing.lg - spacing.md * 2 - 14) / 2),
  );
  const justAnnouncedCardWidth = Math.max(220, screenWidth - spacing.lg - 112);
  const trendingColumns = Array.from({ length: Math.ceil(trendingItems.length / 3) }, (_, index) =>
    trendingItems.slice(index * 3, index * 3 + 3),
  );
  const floatingActionStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatingActionY.value }],
  }));

  const setFloatingActionVisible = (visible: boolean) => {
    if (isFloatingActionVisibleRef.current === visible) return;
    isFloatingActionVisibleRef.current = visible;
    // Reanimated shared values are intentionally mutated outside React state.
    // eslint-disable-next-line react-hooks/immutability -- shared value write
    floatingActionY.value = withTiming(visible ? 0 : FLOATING_ACTION_TRAVEL, {
      duration: 260,
      easing: visible ? Easing.out(Easing.cubic) : Easing.in(Easing.cubic),
    });
  };

  const handleHomeScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const y = Math.max(contentOffset.y, 0);
    const delta = y - lastScrollYRef.current;
    const isAtBottom = y + layoutMeasurement.height >= contentSize.height - 20;

    if (isAtBottom || y <= 20) {
      setFloatingActionVisible(true);
    } else if (delta > 2) {
      setFloatingActionVisible(false);
    } else if (delta < -2) {
      setFloatingActionVisible(true);
    }

    lastScrollYRef.current = y;
  };

  const openLocationSetup = () => {
    if (profileId) {
      router.push({ pathname: '/profile-form', params: { id: profileId } });
      return;
    }
    router.push('/profile-form');
  };

  return (
    <View style={{ flex: 1, backgroundColor: APP_DARK_BG }}>
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: insets.top + spacing.sm,
          paddingBottom: insets.bottom + (hasProfileLocation ? spacing['2xl'] : 120),
        }}
        showsVerticalScrollIndicator={false}
        onScroll={handleHomeScroll}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Change location"
          onPress={() => router.push('/profiles')}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: spacing.lg,
            gap: 6,
            marginBottom: spacing.md,
          }}
        >
          <LocationPinIcon size={16} />
          <Typography
            style={{
              color: colors.white,
              fontSize: 14,
              lineHeight: 18,
              fontWeight: '600',
            }}
            numberOfLines={1}
          >
            {locationLabel}
          </Typography>
          <ChevronRight size={16} color={colors.white} strokeWidth={2.4} />
        </Pressable>

        <Pressable
          accessibilityRole="search"
          accessibilityLabel="Search for artists, teams, and more"
          onPress={() => searchInputRef.current?.focus()}
          style={{
            marginHorizontal: spacing.lg,
            marginBottom: spacing.xl,
            minHeight: 60,
            borderRadius: 30,
            backgroundColor: APP_DARK_SURFACE,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: spacing.md,
            gap: 10,
          }}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: APP_SEARCH_ICON_BG,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Search size={21} color={colors.white} strokeWidth={2.4} />
          </View>
          <View style={{ flex: 1, minWidth: 0, justifyContent: 'center' }}>
            {!isSearchFocused && searchQuery.length === 0 ? (
              <View pointerEvents="none" style={{ position: 'absolute', left: 0 }}>
                <HomeSearchPlaceholder />
              </View>
            ) : null}
            <TextInput
              ref={searchInputRef}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              placeholder={isSearchFocused ? 'Search' : undefined}
              placeholderTextColor={colors.neutral[500]}
              selectionColor={colors.white}
              returnKeyType="search"
              autoCapitalize="none"
              autoCorrect={false}
              style={{
                width: '100%',
                color: colors.white,
                fontSize: 16,
                lineHeight: 22,
                paddingVertical: 14,
                paddingHorizontal: 0,
                opacity: !isSearchFocused && searchQuery.length === 0 ? 0 : 1,
              }}
            />
          </View>
        </Pressable>

        <Typography
          style={{
            color: colors.white,
            fontSize: 18,
            lineHeight: 24,
            fontWeight: '700',
            paddingHorizontal: spacing.lg,
            marginBottom: spacing.md,
          }}
        >
          For You
        </Typography>
        {!hasProfileLocation ? (
          <View
            style={{
              minHeight: 80,
              paddingHorizontal: spacing.lg,
              justifyContent: 'center',
            }}
          >
            <Typography style={{ color: colors.neutral[400], fontSize: 14, lineHeight: 20 }}>
              Set your profile location to see nearby Ticketmaster events.
            </Typography>
          </View>
        ) : isForYouLoading ? (
          <HomeForYouSkeletonRail />
        ) : isForYouError ? (
          <View
            style={{
              minHeight: 80,
              paddingHorizontal: spacing.lg,
              justifyContent: 'center',
              alignItems: 'flex-start',
            }}
          >
            <Typography style={{ color: colors.neutral[400], fontSize: 14, lineHeight: 20 }}>
              We couldn&apos;t load nearby events.
            </Typography>
            <Pressable
              accessibilityRole="button"
              onPress={() => void refetchForYou()}
              style={{ paddingVertical: spacing.sm }}
            >
              <Typography
                style={{ color: colors.white, fontSize: 14, lineHeight: 18, fontWeight: '700' }}
              >
                Try Again
              </Typography>
            </Pressable>
          </View>
        ) : forYouEvents.length === 0 ? (
          <View
            style={{
              minHeight: 80,
              paddingHorizontal: spacing.lg,
              justifyContent: 'center',
            }}
          >
            <Typography style={{ color: colors.neutral[400], fontSize: 14, lineHeight: 20 }}>
              No upcoming Ticketmaster events were found near {city}.
            </Typography>
            <Pressable
              accessibilityRole="button"
              onPress={() => void refetchForYou()}
              style={{ paddingVertical: spacing.sm, alignSelf: 'flex-start' }}
            >
              <Typography
                style={{ color: colors.white, fontSize: 14, lineHeight: 18, fontWeight: '700' }}
              >
                Refresh Events
              </Typography>
            </Pressable>
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.lg }}
          >
            {forYouEvents.map((event) => (
              <HomeForYouCard
                key={event.id}
                event={event}
                showLocationPin={
                  normalizeCity(event.city) === normalizeCity(city) &&
                  event.countryCode === countryCode
                }
              />
            ))}
          </ScrollView>
        )}

        <View style={{ marginTop: spacing.sm }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: spacing.lg,
              paddingHorizontal: spacing.lg,
            }}
          >
            <Typography
              style={{
                flex: 1,
                color: colors.white,
                fontSize: 15,
                lineHeight: 20,
                fontWeight: '700',
              }}
              numberOfLines={1}
            >
              Trending In The {countryLabel}
            </Typography>
            <Typography
              style={{
                color: colors.white,
                fontSize: 12,
                lineHeight: 17,
                marginLeft: spacing.md,
              }}
            >
              View All
            </Typography>
          </View>
          {isTrendingLoading ? (
            <HomeTrendingSkeletonRail columnWidth={trendingColumnWidth} />
          ) : isTrendingError ? (
            <View
              style={{
                minHeight: 100,
                paddingHorizontal: spacing.lg,
                justifyContent: 'center',
                alignItems: 'flex-start',
              }}
            >
              <Typography style={{ color: colors.neutral[400], fontSize: 14, lineHeight: 20 }}>
                We couldn&apos;t load trending artists.
              </Typography>
              <Pressable
                accessibilityRole="button"
                onPress={() => void refetchTrending()}
                style={{ paddingVertical: spacing.sm }}
              >
                <Typography
                  style={{ color: colors.white, fontSize: 14, lineHeight: 18, fontWeight: '700' }}
                >
                  Try Again
                </Typography>
              </Pressable>
            </View>
          ) : trendingColumns.length === 0 ? (
            <View
              style={{
                minHeight: 100,
                paddingHorizontal: spacing.lg,
                justifyContent: 'center',
              }}
            >
              <Typography style={{ color: colors.neutral[400], fontSize: 14, lineHeight: 20 }}>
                No trending artists are currently available for {countryLabel}.
              </Typography>
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              decelerationRate="fast"
              snapToInterval={trendingColumnWidth + spacing.md}
              snapToAlignment="start"
              contentContainerStyle={{
                paddingHorizontal: spacing.lg,
                gap: spacing.md,
              }}
            >
              {trendingColumns.map((column) => (
                <View key={column[0]?.id} style={{ width: trendingColumnWidth }}>
                  {column.map((item) => (
                    <HomeTrendingRow key={item.id} item={item} />
                  ))}
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        <View style={{ marginTop: spacing.xl }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: spacing.lg,
              marginBottom: spacing.lg,
            }}
          >
            <Typography
              style={{
                color: colors.white,
                fontSize: 15,
                lineHeight: 20,
                fontWeight: '700',
              }}
            >
              Last Minute
            </Typography>
            <Pressable accessibilityRole="button" hitSlop={8}>
              <Typography style={{ color: colors.white, fontSize: 12, lineHeight: 17 }}>
                View All
              </Typography>
            </Pressable>
          </View>
          {!hasProfileLocation ? (
            <View
              style={{
                minHeight: 90,
                paddingHorizontal: spacing.lg,
                justifyContent: 'center',
              }}
            >
              <Typography style={{ color: colors.neutral[400], fontSize: 14, lineHeight: 20 }}>
                Set your profile location to see last-minute events nearby.
              </Typography>
            </View>
          ) : isLastMinuteLoading ? (
            <HomeEventRailSkeleton cardWidth={lastMinuteCardWidth} />
          ) : isLastMinuteError ? (
            <View
              style={{
                minHeight: 90,
                paddingHorizontal: spacing.lg,
                justifyContent: 'center',
                alignItems: 'flex-start',
              }}
            >
              <Typography style={{ color: colors.neutral[400], fontSize: 14, lineHeight: 20 }}>
                We couldn&apos;t load last-minute events.
              </Typography>
              <Pressable
                accessibilityRole="button"
                onPress={() => void refetchLastMinute()}
                style={{ paddingVertical: spacing.sm }}
              >
                <Typography
                  style={{ color: colors.white, fontSize: 14, lineHeight: 18, fontWeight: '700' }}
                >
                  Try Again
                </Typography>
              </Pressable>
            </View>
          ) : lastMinuteEvents.length === 0 ? (
            <View
              style={{
                minHeight: 90,
                paddingHorizontal: spacing.lg,
                justifyContent: 'center',
              }}
            >
              <Typography style={{ color: colors.neutral[400], fontSize: 14, lineHeight: 20 }}>
                No last-minute events were found near {city}.
              </Typography>
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: spacing.lg }}
            >
              {lastMinuteEvents.map((event) => (
                <HomeLastMinuteCard key={event.id} event={event} width={lastMinuteCardWidth} />
              ))}
            </ScrollView>
          )}
        </View>

        <View style={{ marginTop: spacing.xl }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: spacing.lg,
              marginBottom: spacing.lg,
            }}
          >
            <Typography
              style={{
                color: colors.white,
                fontSize: 15,
                lineHeight: 20,
                fontWeight: '700',
              }}
            >
              Popular This Weekend
            </Typography>
            <Pressable accessibilityRole="button" hitSlop={8}>
              <Typography style={{ color: colors.white, fontSize: 12, lineHeight: 17 }}>
                View All
              </Typography>
            </Pressable>
          </View>
          {!hasProfileLocation ? (
            <View
              style={{
                minHeight: 90,
                paddingHorizontal: spacing.lg,
                justifyContent: 'center',
              }}
            >
              <Typography style={{ color: colors.neutral[400], fontSize: 14, lineHeight: 20 }}>
                Set your profile location to see popular weekend events nearby.
              </Typography>
            </View>
          ) : isWeekendLoading ? (
            <HomeEventRailSkeleton cardWidth={lastMinuteCardWidth} />
          ) : isWeekendError ? (
            <View
              style={{
                minHeight: 90,
                paddingHorizontal: spacing.lg,
                justifyContent: 'center',
                alignItems: 'flex-start',
              }}
            >
              <Typography style={{ color: colors.neutral[400], fontSize: 14, lineHeight: 20 }}>
                We couldn&apos;t load popular weekend events.
              </Typography>
              <Pressable
                accessibilityRole="button"
                onPress={() => void refetchWeekend()}
                style={{ paddingVertical: spacing.sm }}
              >
                <Typography
                  style={{ color: colors.white, fontSize: 14, lineHeight: 18, fontWeight: '700' }}
                >
                  Try Again
                </Typography>
              </Pressable>
            </View>
          ) : weekendEvents.length === 0 ? (
            <View
              style={{
                minHeight: 90,
                paddingHorizontal: spacing.lg,
                justifyContent: 'center',
              }}
            >
              <Typography style={{ color: colors.neutral[400], fontSize: 14, lineHeight: 20 }}>
                No popular weekend events were found near {city}.
              </Typography>
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: spacing.lg }}
            >
              {weekendEvents.map((event) => (
                <HomeLastMinuteCard key={event.id} event={event} width={lastMinuteCardWidth} />
              ))}
            </ScrollView>
          )}
        </View>

        <View style={{ marginTop: spacing.xl }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: spacing.lg,
              marginBottom: spacing.lg,
            }}
          >
            <Typography
              style={{
                color: colors.white,
                fontSize: 15,
                lineHeight: 20,
                fontWeight: '700',
              }}
            >
              Just Announced
            </Typography>
            <Pressable accessibilityRole="button" hitSlop={8}>
              <Typography style={{ color: colors.white, fontSize: 12, lineHeight: 17 }}>
                View All
              </Typography>
            </Pressable>
          </View>
          {!hasProfileLocation ? (
            <View
              style={{
                minHeight: 90,
                paddingHorizontal: spacing.lg,
                justifyContent: 'center',
              }}
            >
              <Typography style={{ color: colors.neutral[400], fontSize: 14, lineHeight: 20 }}>
                Set your profile location to see newly announced events nearby.
              </Typography>
            </View>
          ) : isJustAnnouncedLoading ? (
            <HomeJustAnnouncedSkeletonRail cardWidth={justAnnouncedCardWidth} />
          ) : isJustAnnouncedError ? (
            <View
              style={{
                minHeight: 90,
                paddingHorizontal: spacing.lg,
                justifyContent: 'center',
                alignItems: 'flex-start',
              }}
            >
              <Typography style={{ color: colors.neutral[400], fontSize: 14, lineHeight: 20 }}>
                We couldn&apos;t load newly announced events.
              </Typography>
              <Pressable
                accessibilityRole="button"
                onPress={() => void refetchJustAnnounced()}
                style={{ paddingVertical: spacing.sm }}
              >
                <Typography
                  style={{ color: colors.white, fontSize: 14, lineHeight: 18, fontWeight: '700' }}
                >
                  Try Again
                </Typography>
              </Pressable>
            </View>
          ) : justAnnouncedEvents.length === 0 ? (
            <View
              style={{
                minHeight: 90,
                paddingHorizontal: spacing.lg,
                justifyContent: 'center',
              }}
            >
              <Typography style={{ color: colors.neutral[400], fontSize: 14, lineHeight: 20 }}>
                No newly announced events were found near {city}.
              </Typography>
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: spacing.lg }}
            >
              {justAnnouncedEvents.map((event) => (
                <HomeJustAnnouncedCard
                  key={event.id}
                  event={event}
                  width={justAnnouncedCardWidth}
                />
              ))}
            </ScrollView>
          )}
        </View>

        {EXTRA_HOME_SECTIONS.map((title, sectionIndex) => {
          const events = [
            ...MOCK_HOME_WEEKEND.slice(sectionIndex),
            ...MOCK_HOME_WEEKEND.slice(0, sectionIndex),
          ];

          return (
            <View key={title}>
              <Typography
                style={{
                  color: colors.white,
                  fontSize: 18,
                  lineHeight: 24,
                  fontWeight: '700',
                  paddingHorizontal: spacing.lg,
                  marginTop: spacing.xl,
                  marginBottom: spacing.md,
                }}
              >
                {title}
              </Typography>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: spacing.lg }}
              >
                {events.map((event) => (
                  <HomeWeekendCard key={`${title}-${event.id}`} event={event} />
                ))}
              </ScrollView>
            </View>
          );
        })}
      </KeyboardAwareScrollView>

      {!hasProfileLocation ? (
        <Animated.View
          pointerEvents="box-none"
          style={{
            position: 'absolute',
            left: spacing.lg,
            right: spacing.lg,
            bottom: 8,
            zIndex: 20,
          }}
        >
          <Animated.View style={floatingActionStyle}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Find events near you. Set your location"
              onPress={openLocationSetup}
              style={{
                height: 68,
                borderRadius: 34,
                paddingHorizontal: 10,
                backgroundColor: colors.white,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: '#19DDD8',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <LocationPinIcon size={25} color="#050505" />
              </View>
              <View style={{ flex: 1, minWidth: 0, paddingHorizontal: 12 }}>
                <Typography
                  style={{
                    color: '#050505',
                    fontSize: 16,
                    lineHeight: 20,
                    fontWeight: '800',
                  }}
                  numberOfLines={1}
                >
                  Find Events Near You
                </Typography>
                <Typography
                  style={{
                    color: '#202020',
                    fontSize: 14,
                    lineHeight: 18,
                    marginTop: 1,
                  }}
                  numberOfLines={1}
                >
                  Set your location
                </Typography>
              </View>
              <ArrowRight size={30} color="#050505" strokeWidth={2.2} />
            </Pressable>
          </Animated.View>
        </Animated.View>
      ) : null}
    </View>
  );
}
