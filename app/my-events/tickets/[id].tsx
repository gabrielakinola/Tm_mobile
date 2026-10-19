import { useCallback, useMemo, useState } from 'react';
import {
  Pressable,
  useWindowDimensions,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  type SharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft } from 'lucide-react-native';
import { AddToAppleWalletButton } from '@/components/icons/AddToAppleWalletButton';
import { ErrorState, LoadingState, Typography, useToast } from '@/components/ui';
import { APP_DARK_MUTED } from '@/constants/app-surface';
import { TicketInfoModal } from '@/features/my-events/components/TicketInfoModal';
import { ViewTicketCard } from '@/features/my-events/components/ViewTicketCard';
import { formatViewTicketsHeaderMeta } from '@/features/my-events/utils/view-tickets';
import { useEventScreenCaptureTracking } from '@/hooks/events/useEventScreenCaptureTracking';
import { useMyEvent } from '@/hooks/events/useMyEvent';
import { useUserSettings } from '@/hooks/settings/useUserSettings';
import { hapticSelection } from '@/lib/haptics';
import type { EventTicket, MyEventDetail } from '@/services/events/types';
import { colors, spacing } from '@/theme/tokens';

const PAGE_BG = '#000000';
const SIDE_PADDING = 14;
const CARD_GAP = 10;
const NEXT_PEEK = 18;
const PEEK_SCALE = 0.9;
const PAGER_HEIGHT = 34;
const BOTTOM_BAR_HEIGHT = 56;
const TICKET_IMAGE_TRIM = 100;
const PAGER_CAPSULE_BG = '#3A3A3C';

function TicketCarouselItem({
  event,
  ticket,
  index,
  cardWidth,
  cardHeight,
  snapInterval,
  scrollX,
}: {
  event: MyEventDetail;
  ticket: EventTicket;
  index: number;
  cardWidth: number;
  cardHeight: number;
  snapInterval: number;
  scrollX: SharedValue<number>;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollX.value,
      [(index - 1) * snapInterval, index * snapInterval, (index + 1) * snapInterval],
      [PEEK_SCALE, 1, PEEK_SCALE],
      Extrapolation.CLAMP,
    );

    return {
      transform: [{ scale }],
    };
  });

  return (
    <View style={{ width: snapInterval, alignItems: 'flex-start', justifyContent: 'flex-start' }}>
      <Animated.View
        style={[
          {
            width: cardWidth,
            height: cardHeight,
            transformOrigin: 'left center',
          },
          animatedStyle,
        ]}
      >
        <ViewTicketCard
          event={event}
          ticket={ticket}
          index={index}
          width={cardWidth}
          height={cardHeight}
          scrollX={scrollX}
          snapInterval={snapInterval}
        />
      </Animated.View>
    </View>
  );
}

export default function ViewTicketsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const { show: showToast } = useToast();
  const { id } = useLocalSearchParams<{ id: string }>();
  const eventId = typeof id === 'string' ? id : undefined;
  const { data: event, isLoading, isError, refetch } = useMyEvent(eventId);
  const settingsQuery = useUserSettings();
  const hideTicketContent = settingsQuery.data?.enableTicketScreenshotBlocking === true;
  useEventScreenCaptureTracking({
    eventId,
    screen: 'tickets',
    enabled: Boolean(event) && !hideTicketContent,
  });
  const [activeIndex, setActiveIndex] = useState(0);
  const [infoVisible, setInfoVisible] = useState(false);
  const scrollX = useSharedValue(0);

  const tickets = event?.tickets ?? [];
  const cardWidth = Math.round(width - SIDE_PADDING - NEXT_PEEK);
  const snapInterval = cardWidth + CARD_GAP;
  const headerHeight = insets.top + 58;
  const bottomHeight = BOTTOM_BAR_HEIGHT + Math.max(insets.bottom, 10);
  const cardHeight = Math.max(
    380,
    height - headerHeight - PAGER_HEIGHT - bottomHeight - spacing.md - TICKET_IMAGE_TRIM,
  );

  const headerMeta = useMemo(() => {
    if (!event) return '';
    return formatViewTicketsHeaderMeta(event.eventDate, event.eventTime, event.venue);
  }, [event]);

  const commitActiveIndex = useCallback(
    (offset: number) => {
      const index = Math.round(offset / snapInterval);
      const nextIndex = Math.max(0, Math.min(index, Math.max(tickets.length - 1, 0)));
      setActiveIndex((current) => (current === nextIndex ? current : nextIndex));
    },
    [snapInterval, tickets.length],
  );

  const handleScrollEnd = useCallback(
    (eventScroll: NativeSyntheticEvent<NativeScrollEvent>) => {
      commitActiveIndex(eventScroll.nativeEvent.contentOffset.x);
      void hapticSelection();
    },
    [commitActiveIndex],
  );

  const handleScroll = useAnimatedScrollHandler({
    onScroll: (scrollEvent) => {
      scrollX.value = scrollEvent.contentOffset.x;
      runOnJS(commitActiveIndex)(scrollEvent.contentOffset.x);
    },
  });

  const backAction = (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Go back"
      onPress={() => router.back()}
      hitSlop={8}
      style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}
    >
      <ChevronLeft size={26} color={colors.white} strokeWidth={2.2} />
    </Pressable>
  );

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: PAGE_BG }}>
        <StatusBar style="light" />
        <LoadingState inverted message="Loading tickets…" />
      </View>
    );
  }

  if (isError || !event) {
    return (
      <View style={{ flex: 1, backgroundColor: PAGE_BG }}>
        <StatusBar style="light" />
        <View style={{ paddingTop: insets.top, paddingLeft: spacing.xs }}>{backAction}</View>
        <ErrorState
          inverted
          title="Event not found"
          message="This event may have been removed or is unavailable."
          onRetry={() => void refetch()}
        />
      </View>
    );
  }

  const currentTicket = tickets[activeIndex] ?? tickets[0] ?? null;

  return (
    <View style={{ flex: 1, backgroundColor: PAGE_BG }}>
      <StatusBar style="light" />

      <View
        style={{
          paddingTop: insets.top,
          paddingBottom: spacing.sm,
          paddingRight: spacing.lg,
          minHeight: headerHeight,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        {backAction}
        <View style={{ flex: 1, alignItems: 'center', paddingRight: 40 }}>
          <Typography
            style={{
              color: colors.white,
              fontSize: 16,
              lineHeight: 20,
              fontWeight: '800',
              letterSpacing: 0.2,
              textTransform: 'uppercase',
              textAlign: 'center',
            }}
            numberOfLines={1}
          >
            {event.name}
          </Typography>
          {headerMeta ? (
            <Typography
              style={{
                color: APP_DARK_MUTED,
                fontSize: 12,
                lineHeight: 16,
                fontWeight: '400',
                textAlign: 'center',
                marginTop: 2,
              }}
              numberOfLines={1}
            >
              {headerMeta}
            </Typography>
          ) : null}
        </View>
      </View>

      {hideTicketContent ? (
        <View style={{ flex: 1, backgroundColor: PAGE_BG }} />
      ) : tickets.length === 0 ? (
        <ErrorState
          inverted
          title="No tickets"
          message="There are no tickets to show for this event."
        />
      ) : (
        <>
          <Animated.FlatList
            horizontal
            data={tickets}
            keyExtractor={(item, index) => `${item.section}-${item.row}-${item.seat}-${index}`}
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            snapToInterval={snapInterval}
            snapToAlignment="start"
            disableIntervalMomentum
            removeClippedSubviews={false}
            scrollEventThrottle={16}
            onScroll={handleScroll}
            style={{ height: cardHeight }}
            contentContainerStyle={{
              paddingLeft: SIDE_PADDING,
              paddingRight: NEXT_PEEK,
            }}
            getItemLayout={(_, index) => ({
              length: snapInterval,
              offset: snapInterval * index,
              index,
            })}
            onMomentumScrollEnd={handleScrollEnd}
            renderItem={({ item, index }) => (
              <TicketCarouselItem
                event={event}
                ticket={item}
                index={index}
                cardWidth={cardWidth}
                cardHeight={cardHeight}
                snapInterval={snapInterval}
                scrollX={scrollX}
              />
            )}
          />

          <View
            style={{
              alignItems: 'center',
              marginTop: spacing.sm,
            }}
          >
            <View
              style={{
                backgroundColor: PAGER_CAPSULE_BG,
                paddingHorizontal: 12,
                paddingVertical: 5,
                borderRadius: 999,
              }}
            >
              <Typography
                style={{
                  color: '#F2F2F7',
                  fontSize: 12,
                  lineHeight: 16,
                  fontWeight: '500',
                }}
              >
                {activeIndex + 1} of {tickets.length}
              </Typography>
            </View>
          </View>

          <View style={{ flex: 1 }} />
          <View
            style={{
              height: bottomHeight,
              paddingBottom: Math.max(insets.bottom, 10),
              paddingHorizontal: spacing.lg,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <AddToAppleWalletButton
              onPress={() =>
                showToast({
                  message: "This ticket can't be added to Apple Wallet yet.",
                  variant: 'default',
                })
              }
            />

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Ticket info"
              onPress={() => setInfoVisible(true)}
              style={{
                height: 44,
                paddingHorizontal: 14,
                borderRadius: 999,
                borderWidth: 1,
                borderColor: '#3A3A3C',
                backgroundColor: '#000000',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <View
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 11,
                  backgroundColor: '#FFFFFF',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography
                  style={{
                    color: '#000000',
                    fontSize: 15,
                    lineHeight: 18,
                    fontWeight: '800',
                    includeFontPadding: false,
                  }}
                >
                  i
                </Typography>
              </View>
              <Typography
                style={{
                  color: '#FFFFFF',
                  fontSize: 15,
                  lineHeight: 18,
                  fontWeight: '700',
                }}
              >
                Ticket Info
              </Typography>
            </Pressable>
          </View>
        </>
      )}

      <TicketInfoModal
        visible={infoVisible && !hideTicketContent}
        event={event}
        ticket={currentTicket}
        onClose={() => setInfoVisible(false)}
      />
    </View>
  );
}
