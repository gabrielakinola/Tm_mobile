import { Pressable, Image as RNImage, useWindowDimensions, View } from 'react-native';
import { Image } from 'expo-image';
import ticketIcon from '@/assets/icons/ticket.png';
import { TicketmasterText } from '@/components/ui/TicketmasterText';
import { Typography } from '@/components/ui/Typography';
import { EventDateBadgeOverlay } from '@/features/my-events/components/EventDateBadgeOverlay';
import type { MyEventSummary } from '@/services/events/types';
import { colors, spacing } from '@/theme/tokens';

export const MY_EVENT_CARD_SIDE_MARGIN = spacing.lg;
export const MY_EVENT_CARD_GAP = spacing.xl;
export const MY_EVENT_IMAGE_ASPECT_RATIO = 1.28;

export const MY_EVENT_CARD_DARK_BG = '#262626';
const CARD_GOLD = '#9A7B4F';
const VENUE_COLOR = '#C8C8C8';
const VENUE_FONT_SIZE = 15;

export interface MyEventCardProps {
  event: MyEventSummary;
  onPress?: () => void;
}

export function getMyEventCardWidth(screenWidth: number): number {
  return screenWidth - MY_EVENT_CARD_SIDE_MARGIN * 2;
}

export function getMyEventImageHeight(cardWidth: number): number {
  return Math.max(0, Math.round(cardWidth / MY_EVENT_IMAGE_ASPECT_RATIO - MY_EVENT_CARD_GAP));
}

export function MyEventCard({ event, onPress }: MyEventCardProps) {
  const { width: screenWidth } = useWindowDimensions();
  const cardWidth = getMyEventCardWidth(screenWidth);
  const imageHeight = getMyEventImageHeight(cardWidth);
  const ticketCount = event.ticketCount ?? 0;

  return (
    <View style={{ width: cardWidth }}>
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => ({
          opacity: pressed ? 0.96 : 1,
        })}
      >
        <View>
          <View style={{ position: 'relative' }}>
            <Image
              source={{ uri: event.imageUrl }}
              style={{
                width: cardWidth,
                height: imageHeight,
              }}
              contentFit="cover"
              transition={200}
            />

            <EventDateBadgeOverlay
              eventDate={event.eventDate}
              eventTime={event.eventTime}
              containerWidth={cardWidth}
              layout="card"
              shrinkToFit
            />
          </View>

          <View
            style={{
              backgroundColor: MY_EVENT_CARD_DARK_BG,
              paddingHorizontal: spacing.lg,
              paddingTop: spacing.lg,
              paddingBottom: spacing.lg,
            }}
          >
            <Typography
              style={{
                color: colors.white,
                fontSize: 30,
                lineHeight: 36,
                fontWeight: '800',
                letterSpacing: 0.1,
                textTransform: 'uppercase',
              }}
            >
              {event.name}
            </Typography>

            <View
              style={{
                marginTop: spacing.md,
                width: '50%',
                height: 3,
                backgroundColor: CARD_GOLD,
              }}
            />

            <View
              style={{
                marginTop: spacing.md,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: spacing.md,
              }}
            >
              <TicketmasterText
                fontSize={VENUE_FONT_SIZE}
                color={VENUE_COLOR}
                numberOfLines={1}
                containerStyle={{ flex: 1 }}
                style={{
                  flexShrink: 1,
                  color: VENUE_COLOR,
                  fontSize: VENUE_FONT_SIZE,
                  lineHeight: 20,
                  fontWeight: '400',
                }}
              >
                {event.venue}
              </TicketmasterText>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 1,
                }}
                accessibilityLabel={`${ticketCount} tickets`}
              >
                <RNImage
                  source={ticketIcon}
                  style={{ width: 22, height: 22 }}
                  resizeMode="contain"
                />
                <Typography style={{ color: colors.white, fontSize: 15, fontWeight: '700' }}>
                  x{ticketCount}
                </Typography>
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    </View>
  );
}
