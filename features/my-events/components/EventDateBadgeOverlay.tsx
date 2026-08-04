import { View, type StyleProp, type ViewStyle } from 'react-native';
import { EventDateBadgeLabel } from '@/features/my-events/components/EventDateBadgeLabel';
import { MY_EVENT_CARD_DARK_BG } from '@/features/my-events/components/MyEventCard';
import { spacing } from '@/theme/tokens';

export const EVENT_DATE_BADGE_SIDE_INSET = 10;
export const EVENT_DATE_BADGE_FONT_SIZE = 12;
export const EVENT_DATE_BADGE_DOT_FONT_SIZE = 18;

/** Compact mini badge (You Got Tickets): padding + line height vs standard card badge. */
const COMPACT_BADGE_VERTICAL_PADDING_FACTOR = 0.28;
const COMPACT_BADGE_LINE_HEIGHT_MULTIPLIER = 0.86;

export function getEventDateBadgeWidth(
  containerWidth: number,
  sideInset: number = EVENT_DATE_BADGE_SIDE_INSET,
): number {
  if (sideInset <= 0) {
    return containerWidth / 2;
  }

  return Math.max(0, (containerWidth - sideInset * 2) / 2);
}

export type EventDateBadgeLayout = 'detail' | 'card';

function getBadgePosition(
  containerWidth: number,
  layout: EventDateBadgeLayout,
  sideInset?: number,
): { left: number; width: number } {
  if (layout === 'card') {
    return { left: 0, width: containerWidth / 2 };
  }

  const inset = sideInset ?? EVENT_DATE_BADGE_SIDE_INSET;
  return { left: inset, width: getEventDateBadgeWidth(containerWidth, inset) };
}

export function getScaledEventDateBadgeDotFontSize(fontSize: number): number {
  return Math.round(fontSize * (EVENT_DATE_BADGE_DOT_FONT_SIZE / EVENT_DATE_BADGE_FONT_SIZE));
}

export interface EventDateBadgeOverlayProps {
  eventDate: string;
  eventTime: string;
  /** Width of the image/container the badge is anchored to. */
  containerWidth: number;
  /** `card`: flush left, spans to horizontal center. `detail`: inset like event detail hero. */
  layout?: EventDateBadgeLayout;
  sideInset?: number;
  fontSize?: number;
  dotFontSize?: number;
  shrinkToFit?: boolean;
  /** Roughly half the vertical footprint of the standard badge. */
  compactHeight?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function EventDateBadgeOverlay({
  eventDate,
  eventTime,
  containerWidth,
  layout = 'detail',
  sideInset,
  fontSize = EVENT_DATE_BADGE_FONT_SIZE,
  dotFontSize = EVENT_DATE_BADGE_DOT_FONT_SIZE,
  shrinkToFit = false,
  compactHeight = false,
  style,
}: EventDateBadgeOverlayProps) {
  if (containerWidth <= 0) {
    return null;
  }

  const badgePosition = getBadgePosition(containerWidth, layout, sideInset);
  const paddingScale = fontSize / EVENT_DATE_BADGE_FONT_SIZE;
  const badgePadding = Math.round(spacing.sm * paddingScale);
  const verticalPadding = compactHeight
    ? Math.max(2, Math.round(badgePadding * COMPACT_BADGE_VERTICAL_PADDING_FACTOR))
    : badgePadding;

  return (
    <View
      style={[
        {
          position: 'absolute',
          left: badgePosition.left,
          bottom: 0,
          width: badgePosition.width,
          backgroundColor: MY_EVENT_CARD_DARK_BG,
          paddingHorizontal: badgePadding,
          paddingVertical: verticalPadding,
        },
        style,
      ]}
    >
      <EventDateBadgeLabel
        eventDate={eventDate}
        eventTime={eventTime}
        fontSize={fontSize}
        dotFontSize={dotFontSize}
        shrinkToFit={shrinkToFit}
        lineHeightMultiplier={compactHeight ? COMPACT_BADGE_LINE_HEIGHT_MULTIPLIER : 1.22}
      />
    </View>
  );
}
