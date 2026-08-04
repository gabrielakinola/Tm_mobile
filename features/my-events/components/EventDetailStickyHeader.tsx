import { Animated, Dimensions, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { TicketmasterText } from '@/components/ui/TicketmasterText';
import { Typography } from '@/components/ui/Typography';
import { EventDateBadgeOverlay } from '@/features/my-events/components/EventDateBadgeOverlay';
import type { MyEventDetail } from '@/services/events/types';
import { colors, spacing } from '@/theme/tokens';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const EVENT_DETAIL_TAB_BAR_HEIGHT = 46;
export const EVENT_DETAIL_INFO_SCROLL_RANGE = 168;

export function getEventDetailHeroExpandedHeight(topInset = 0): number {
  return Math.round(Dimensions.get('window').height * 0.2) + topInset;
}

export function getEventDetailHeroCollapsedHeight(topInset = 0): number {
  return Math.round(getEventDetailHeroExpandedHeight(topInset) * 0.5);
}

export interface EventDetailStickyHeaderProps {
  event: MyEventDetail;
  scrollY: Animated.Value;
  topInset: number;
  infoScrollRange?: number;
  fixed?: boolean;
  imageTransition?: number;
}

export function EventDetailStickyHeader({
  event,
  scrollY,
  topInset,
  infoScrollRange = EVENT_DETAIL_INFO_SCROLL_RANGE,
  fixed = false,
  imageTransition = 200,
}: EventDetailStickyHeaderProps) {
  const heroExpanded = getEventDetailHeroExpandedHeight(topInset);
  const heroCollapsed = getEventDetailHeroCollapsedHeight(topInset);
  const imageCollapseDelta = heroExpanded - heroCollapsed;
  const infoScrollEnd = infoScrollRange;
  const imageCollapseEnd = infoScrollEnd + imageCollapseDelta;

  const imageHeight = scrollY.interpolate({
    inputRange: [0, infoScrollEnd, imageCollapseEnd],
    outputRange: [heroExpanded, heroExpanded, heroCollapsed],
    extrapolate: 'clamp',
  });

  const expandedOverlayOpacity = scrollY.interpolate({
    inputRange: [0, infoScrollEnd * 0.65],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const collapsedOverlayOpacity = scrollY.interpolate({
    inputRange: [infoScrollEnd * 0.35, infoScrollEnd],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: fixed ? heroExpanded : imageHeight,
        overflow: 'hidden',
        zIndex: 1,
      }}
    >
      <Image
        source={{ uri: event.imageUrl }}
        style={{
          width: SCREEN_WIDTH,
          height: heroExpanded,
        }}
        contentFit="cover"
        transition={imageTransition}
      />

      <LinearGradient
        colors={['rgba(0,0,0,0.08)', 'rgba(0,0,0,0.35)', 'rgba(0,0,0,0.72)']}
        locations={[0.35, 0.68, 1]}
        style={StyleSheet.absoluteFillObject}
      />

      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFillObject, { opacity: fixed ? 1 : expandedOverlayOpacity }]}
      >
        <EventDateBadgeOverlay
          eventDate={event.eventDate}
          eventTime={event.eventTime}
          containerWidth={SCREEN_WIDTH}
        />
      </Animated.View>

      <Animated.View
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: 52,
          right: 72,
          bottom: spacing.sm,
          alignItems: 'center',
          opacity: fixed ? 0 : collapsedOverlayOpacity,
        }}
      >
        <Typography
          style={{
            width: '100%',
            color: colors.white,
            fontSize: 14,
            lineHeight: 18,
            fontWeight: '800',
            textTransform: 'uppercase',
            textAlign: 'center',
          }}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {event.name}
        </Typography>
        <TicketmasterText
          fontSize={13}
          color={colors.neutral[300]}
          numberOfLines={1}
          containerStyle={{
            marginTop: spacing.xs,
            maxWidth: '100%',
            alignSelf: 'center',
            justifyContent: 'center',
          }}
          style={{
            color: colors.neutral[300],
            fontSize: 13,
            lineHeight: 18,
            fontWeight: '400',
          }}
        >
          {event.venue}
        </TicketmasterText>
      </Animated.View>
    </Animated.View>
  );
}

export function getEventDetailTabsTop(
  scrollY: Animated.Value,
  topInset: number,
  infoScrollRange: number = EVENT_DETAIL_INFO_SCROLL_RANGE,
): Animated.AnimatedInterpolation<number> {
  const heroExpanded = getEventDetailHeroExpandedHeight(topInset);
  const heroCollapsed = getEventDetailHeroCollapsedHeight(topInset);
  const imageCollapseDelta = heroExpanded - heroCollapsed;
  const infoScrollEnd = infoScrollRange;
  const imageCollapseEnd = infoScrollEnd + imageCollapseDelta;

  return scrollY.interpolate({
    inputRange: [0, infoScrollEnd, imageCollapseEnd],
    outputRange: [heroExpanded + infoScrollRange, heroExpanded, heroCollapsed],
    extrapolate: 'clamp',
  });
}
