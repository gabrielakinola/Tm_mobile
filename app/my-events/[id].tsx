import { useMemo, useRef, useState } from 'react';
import { Animated, Pressable, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { MoreVertical } from 'lucide-react-native';
import { ViewTicketsScanIcon } from '@/components/icons/ViewTicketsScanIcon';
import { EventDetailBackButton } from '@/components/navigation/EventDetailBackButton';
import {
  SelectTicketsToTransferSheet,
  type SelectTicketsToTransferSheetRef,
} from '@/components/SelectTicketsToTransferSheet';
import {
  TransferAuthenticationSheet,
  type TransferAuthenticationSheetRef,
} from '@/components/TransferAuthenticationSheet';
import {
  TransferToRecipientSheet,
  type TransferToRecipientSheetRef,
} from '@/components/TransferToRecipientSheet';
import { ErrorState, LoadingState, Typography } from '@/components/ui';
import { VenueMapCard } from '@/components/VenueMapCard';
import { EventDetailFloatingActions } from '@/features/my-events/components/EventDetailFloatingActions';
import {
  EVENT_DETAIL_SIDE_MARGIN,
  EVENT_DETAIL_VIEW_TICKETS_HEIGHT,
  EventDetailInfoSection,
} from '@/features/my-events/components/EventDetailInfoSection';
import {
  EVENT_DETAIL_INFO_SCROLL_RANGE,
  EventDetailStickyHeader,
  getEventDetailHeroExpandedHeight,
} from '@/features/my-events/components/EventDetailStickyHeader';
import {
  EventDetailTabs,
  type EventDetailTab,
} from '@/features/my-events/components/EventDetailTabs';
import { EventDetailTicketCard } from '@/features/my-events/components/EventDetailTicketCard';
import { YouGotTicketsCard } from '@/features/my-events/components/YouGotTicketsCard';
import { getSaleLabel, resolveVenueDisplay } from '@/features/my-events/utils/event-detail';
import { useMyEvent } from '@/hooks/events/useMyEvent';
import type { EventTicket } from '@/services/events/types';
import { useAuthStore } from '@/stores/auth-store';
import { useProfileStore } from '@/stores/profile-store';
import { colors, radius, spacing } from '@/theme/tokens';

const FLOATING_ACTIONS_HEIGHT = 72;

function maskMobileLast4(last4?: string | null): string {
  const digits = last4?.trim();
  if (digits && /^\d{4}$/.test(digits)) {
    return `******${digits}`;
  }
  return '******0000';
}

export default function MyEventDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { height: viewportHeight } = useWindowDimensions();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: event, isLoading, isError, refetch } = useMyEvent(id);
  const defaultProfileFromAuth = useAuthStore((state) => state.user?.defaultProfile);
  const defaultProfileFromStore = useProfileStore((state) => state.defaultProfile);
  const maskedPhone = maskMobileLast4(
    defaultProfileFromStore?.mobileLast4 ?? defaultProfileFromAuth?.mobileLast4,
  );
  const [activeTab, setActiveTab] = useState<EventDetailTab>('tickets');
  const [infoScrollRange, setInfoScrollRange] = useState(EVENT_DETAIL_INFO_SCROLL_RANGE);
  const [tabsPinned, setTabsPinned] = useState(false);
  const [transferTickets, setTransferTickets] = useState<EventTicket[]>([]);
  const scrollY = useRef(new Animated.Value(0)).current;
  const transferSheetRef = useRef<TransferAuthenticationSheetRef>(null);
  const selectTicketsSheetRef = useRef<SelectTicketsToTransferSheetRef>(null);
  const transferToRecipientSheetRef = useRef<TransferToRecipientSheetRef>(null);

  const heroExpanded = getEventDetailHeroExpandedHeight(insets.top);
  const fixedHeaderHeight = heroExpanded + infoScrollRange;
  const tabsStickyTop = Math.round(viewportHeight * 0.15);
  const collapsedHeaderRevealTop = Math.round(viewportHeight * 0.4);
  const tabsPinScrollOffset = Math.max(0, fixedHeaderHeight - tabsStickyTop);
  const tabsPinTransitionStart = Math.max(0, tabsPinScrollOffset - 1);
  const collapsedHeaderRevealStart = Math.max(0, fixedHeaderHeight - collapsedHeaderRevealTop);
  const scrollingTabsOpacity = useMemo(
    () =>
      scrollY.interpolate({
        inputRange: [tabsPinTransitionStart, tabsPinScrollOffset],
        outputRange: [1, 0],
        extrapolate: 'clamp',
      }),
    [scrollY, tabsPinScrollOffset, tabsPinTransitionStart],
  );
  const pinnedLayerOpacity = useMemo(
    () =>
      scrollY.interpolate({
        inputRange: [tabsPinTransitionStart, tabsPinScrollOffset],
        outputRange: [0, 1],
        extrapolate: 'clamp',
      }),
    [scrollY, tabsPinScrollOffset, tabsPinTransitionStart],
  );
  const expandedHeaderOpacity = useMemo(
    () =>
      scrollY.interpolate({
        inputRange: [collapsedHeaderRevealStart, tabsPinScrollOffset],
        outputRange: [1, 0],
        extrapolate: 'clamp',
      }),
    [collapsedHeaderRevealStart, scrollY, tabsPinScrollOffset],
  );
  const collapsedHeaderOpacity = useMemo(
    () =>
      scrollY.interpolate({
        inputRange: [collapsedHeaderRevealStart, tabsPinScrollOffset],
        outputRange: [0, 1],
        extrapolate: 'clamp',
      }),
    [collapsedHeaderRevealStart, scrollY, tabsPinScrollOffset],
  );
  const handleScroll = useMemo(
    () =>
      Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
        useNativeDriver: true,
        listener: (scrollEvent: { nativeEvent: { contentOffset: { y: number } } }) => {
          const nextPinned = scrollEvent.nativeEvent.contentOffset.y >= tabsPinScrollOffset;
          setTabsPinned((current) => (current === nextPinned ? current : nextPinned));
        },
      }),
    [scrollY, tabsPinScrollOffset],
  );

  const handleViewTickets = () => {
    if (!event?.id) return;
    router.push(`/my-events/tickets/${event.id}`);
  };

  if (isLoading) {
    return <LoadingState message="Loading event..." />;
  }

  if (isError || !event) {
    return <ErrorState onRetry={() => void refetch()} />;
  }

  const ticketLabel = getSaleLabel(event.saleLabel);
  const ticketCount = event.tickets.length;
  const venueDisplay = resolveVenueDisplay(event.venue, event.location);

  return (
    <View style={{ flex: 1, backgroundColor: colors.neutral[0] }}>
      <StatusBar style="light" translucent />

      <EventDetailStickyHeader
        event={event}
        scrollY={scrollY}
        topInset={insets.top}
        infoScrollRange={infoScrollRange}
        fixed
      />

      <View
        style={{
          position: 'absolute',
          top: heroExpanded,
          left: 0,
          right: 0,
          zIndex: 1,
        }}
        onLayout={(layoutEvent) => {
          const measuredHeight = layoutEvent.nativeEvent.layout.height;
          if (measuredHeight > 0 && measuredHeight !== infoScrollRange) {
            setInfoScrollRange(measuredHeight);
          }
        }}
      >
        <EventDetailInfoSection event={event} />
      </View>

      {!tabsPinned ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="View tickets"
          onPress={handleViewTickets}
          style={{
            position: 'absolute',
            top: heroExpanded + Math.max(0, infoScrollRange - EVENT_DETAIL_VIEW_TICKETS_HEIGHT),
            left: EVENT_DETAIL_SIDE_MARGIN,
            right: EVENT_DETAIL_SIDE_MARGIN,
            height: EVENT_DETAIL_VIEW_TICKETS_HEIGHT,
            zIndex: 3,
          }}
        />
      ) : null}

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={handleScroll}
        contentContainerStyle={{
          paddingBottom: FLOATING_ACTIONS_HEIGHT + insets.bottom + spacing['2xl'],
        }}
        style={{ zIndex: 2 }}
      >
        <View pointerEvents="none" style={{ height: fixedHeaderHeight }} />

        <View style={{ backgroundColor: colors.neutral[0], minHeight: '100%' }}>
          <Animated.View style={{ opacity: scrollingTabsOpacity }}>
            <EventDetailTabs activeTab={activeTab} onChange={setActiveTab} />
          </Animated.View>

          {activeTab === 'tickets' ? (
            <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.lg }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: spacing.lg,
                }}
              >
                <View style={{ flex: 1, gap: spacing.xs }}>
                  <Typography
                    style={{ color: colors.neutral[900], fontSize: 15, fontWeight: '600' }}
                  >
                    Order {event.orderNumber}
                  </Typography>
                  <Typography style={{ color: colors.neutral[500], fontSize: 14 }}>
                    x{ticketCount} Tickets
                  </Typography>
                </View>
                <Pressable accessibilityRole="button" hitSlop={8}>
                  <MoreVertical size={22} color={colors.neutral[700]} />
                </Pressable>
              </View>

              {event.tickets.map((ticket, index) => (
                <EventDetailTicketCard
                  key={`${ticket.section}-${ticket.row}-${ticket.seat}-${index}`}
                  ticket={ticket}
                  ticketMode={event.ticketMode}
                  label={ticketLabel}
                />
              ))}

              <View style={{ marginTop: spacing.sm }}>
                <VenueMapCard
                  venue={venueDisplay.venue}
                  location={venueDisplay.location}
                  latitude={event.latitude}
                  longitude={event.longitude}
                />
              </View>

              <View style={{ marginTop: spacing.lg }}>
                <YouGotTicketsCard event={event} />
              </View>
            </View>
          ) : (
            <View style={{ padding: spacing['2xl'], alignItems: 'center' }}>
              <Typography style={{ color: colors.neutral[500], fontSize: 15 }}>
                No extras for this event yet.
              </Typography>
            </View>
          )}
        </View>
      </Animated.ScrollView>

      <Animated.View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: tabsStickyTop,
          overflow: 'hidden',
          zIndex: 4,
          opacity: pinnedLayerOpacity,
        }}
      >
        <EventDetailStickyHeader
          event={event}
          scrollY={scrollY}
          topInset={insets.top}
          infoScrollRange={infoScrollRange}
          fixed
          imageTransition={0}
        />
        <View
          style={{
            position: 'absolute',
            top: heroExpanded,
            left: 0,
            right: 0,
          }}
        >
          <EventDetailInfoSection event={event} />
        </View>
      </Animated.View>

      <Animated.View
        pointerEvents={tabsPinned ? 'auto' : 'none'}
        style={{
          position: 'absolute',
          top: tabsStickyTop,
          left: 0,
          right: 0,
          zIndex: 5,
          opacity: pinnedLayerOpacity,
        }}
      >
        <EventDetailTabs activeTab={activeTab} onChange={setActiveTab} />
      </Animated.View>

      <View
        pointerEvents="box-none"
        style={{
          position: 'absolute',
          top: insets.top + spacing.sm,
          left: spacing.lg,
          right: spacing.lg,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 6,
        }}
      >
        <EventDetailBackButton onPress={() => router.back()} />

        <Animated.View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: spacing.xs,
            left: 52,
            right: 72,
            alignItems: 'center',
            opacity: collapsedHeaderOpacity,
          }}
        >
          <Typography
            style={{
              color: colors.white,
              fontSize: 17,
              lineHeight: 22,
              fontWeight: '800',
              textTransform: 'uppercase',
              textAlign: 'center',
            }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {event.name}
          </Typography>
          <Typography
            style={{
              color: colors.neutral[300],
              fontSize: 13,
              lineHeight: 18,
              fontWeight: '400',
              textAlign: 'center',
              marginTop: spacing.sm,
            }}
            numberOfLines={1}
          >
            {event.venue}
          </Typography>
        </Animated.View>

        <View style={{ position: 'absolute', right: 0 }}>
          <View
            pointerEvents="none"
            style={{
              paddingHorizontal: spacing.lg,
              paddingVertical: spacing.sm,
              borderRadius: radius.full,
              opacity: 0,
            }}
          >
            <Typography style={{ fontSize: 15, fontWeight: '600' }}>Help</Typography>
          </View>

          <Animated.View
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              opacity: expandedHeaderOpacity,
            }}
          >
            <Pressable
              accessibilityRole="button"
              hitSlop={8}
              style={{
                flex: 1,
                paddingHorizontal: spacing.lg,
                paddingVertical: spacing.sm,
                borderRadius: radius.full,
                backgroundColor: 'rgba(0, 0, 0, 0.35)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography style={{ color: colors.white, fontSize: 15, fontWeight: '600' }}>
                Help
              </Typography>
            </Pressable>
          </Animated.View>

          <Animated.View
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              opacity: collapsedHeaderOpacity,
            }}
          >
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="View tickets"
              onPress={handleViewTickets}
              hitSlop={8}
              style={{
                flex: 1,
                paddingHorizontal: spacing.lg,
                paddingVertical: spacing.sm,
                borderRadius: radius.full,
                backgroundColor: '#0057D9',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ViewTicketsScanIcon size={28} color={colors.white} />
            </Pressable>
          </Animated.View>
        </View>
      </View>

      <EventDetailFloatingActions
        bottomInset={insets.bottom}
        onTransferPress={() => transferSheetRef.current?.expand()}
      />
      <TransferAuthenticationSheet
        ref={transferSheetRef}
        maskedPhone={maskedPhone}
        onAuthenticated={() => {
          // Fresh transfer attempt — clear any leftover selection from a prior run.
          selectTicketsSheetRef.current?.clearSelection();
          setTransferTickets([]);
          setTimeout(() => {
            selectTicketsSheetRef.current?.expand();
          }, 280);
        }}
      />
      <SelectTicketsToTransferSheet
        ref={selectTicketsSheetRef}
        tickets={event.tickets}
        ticketMode={event.ticketMode}
        onTransferTo={(selectedTickets) => {
          setTransferTickets(selectedTickets);
          setTimeout(() => {
            transferToRecipientSheetRef.current?.expand();
          }, 280);
        }}
      />
      <TransferToRecipientSheet
        ref={transferToRecipientSheetRef}
        eventId={event.id}
        event={{
          name: event.name,
          eventDate: event.eventDate,
          eventTime: event.eventTime,
          venue: event.venue,
        }}
        tickets={transferTickets}
        ticketMode={event.ticketMode}
        onBack={() => {
          // Re-open seat selection with prior selections preserved.
          selectTicketsSheetRef.current?.expand();
        }}
        onFlowCancel={() => {
          setTransferTickets([]);
          selectTicketsSheetRef.current?.clearSelection();
        }}
        onTransferSuccess={() => {
          setTransferTickets([]);
          selectTicketsSheetRef.current?.clearSelection();
        }}
      />
    </View>
  );
}
