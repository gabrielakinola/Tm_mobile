import { Dimensions, Pressable, View } from 'react-native';
import { Image } from 'expo-image';
import { Ticket as TicketIcon } from 'lucide-react-native';
import { ViewTicketsScanIcon } from '@/components/icons/ViewTicketsScanIcon';
import { Typography } from '@/components/ui/Typography';
import {
  MY_EVENT_CARD_DARK_BG,
  MY_EVENT_CARD_SIDE_MARGIN,
} from '@/features/my-events/components/MyEventCard';
import { formatEventDetailOverlayDateTime } from '@/lib/event-datetime';
import type { MyEventDetail } from '@/services/events/types';
import { colors, spacing } from '@/theme/tokens';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const DATE_BADGE_BG = MY_EVENT_CARD_DARK_BG;
const VIEW_TICKETS_BLUE = '#0057D9';

export function getEventDetailHeroHeight(): number {
  return Math.round(SCREEN_HEIGHT * 0.2);
}

export function getEventDetailContentWidth(): number {
  return SCREEN_WIDTH - MY_EVENT_CARD_SIDE_MARGIN * 2;
}

export interface EventDetailHeroSectionProps {
  event: MyEventDetail;
  topInset?: number;
}

export function EventDetailHeroSection({ event, topInset = 0 }: EventDetailHeroSectionProps) {
  const heroHeight = getEventDetailHeroHeight() + topInset;
  const dateLabel = formatEventDetailOverlayDateTime(event.eventDate, event.eventTime);
  const ticketCount = event.tickets.length;
  const venueLabel = event.entrance?.trim() ? `${event.venue} — ${event.entrance}` : event.venue;

  return (
    <View>
      <View style={{ position: 'relative' }}>
        <Image
          source={{ uri: event.imageUrl }}
          style={{
            width: SCREEN_WIDTH,
            height: heroHeight,
          }}
          contentFit="cover"
          transition={200}
        />

        <View
          style={{
            position: 'absolute',
            left: MY_EVENT_CARD_SIDE_MARGIN,
            bottom: 0,
            backgroundColor: DATE_BADGE_BG,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
            zIndex: 2,
          }}
        >
          <Typography
            style={{
              color: colors.white,
              fontSize: 12,
              lineHeight: 15,
              fontWeight: '700',
              letterSpacing: 0.3,
            }}
          >
            {dateLabel}
          </Typography>
        </View>
      </View>

      <View style={{ marginHorizontal: MY_EVENT_CARD_SIDE_MARGIN }}>
        <View
          style={{
            backgroundColor: MY_EVENT_CARD_DARK_BG,
            paddingHorizontal: spacing.lg,
            paddingTop: spacing.lg,
            paddingBottom: spacing.md,
            gap: spacing.md,
          }}
        >
          <Typography
            style={{
              color: colors.white,
              fontSize: 21,
              lineHeight: 26,
              fontWeight: '800',
              letterSpacing: 0.1,
              textTransform: 'uppercase',
            }}
          >
            {event.name}
          </Typography>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: spacing.md,
            }}
          >
            <Typography
              style={{
                flex: 1,
                color: '#C8C8C8',
                fontSize: 15,
                lineHeight: 20,
                fontWeight: '400',
              }}
            >
              {venueLabel}
            </Typography>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
              <TicketIcon size={18} color={colors.white} strokeWidth={2} />
              <Typography style={{ color: colors.white, fontSize: 15, fontWeight: '700' }}>
                x{ticketCount}
              </Typography>
            </View>
          </View>
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        style={{
          marginHorizontal: MY_EVENT_CARD_SIDE_MARGIN,
          backgroundColor: VIEW_TICKETS_BLUE,
          minHeight: 35,
          paddingVertical: spacing.xs,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: spacing.sm,
        }}
      >
        <ViewTicketsScanIcon size={20} color={colors.white} />
        <Typography style={{ color: colors.white, fontSize: 15, fontWeight: '600' }}>
          View Tickets
        </Typography>
      </Pressable>
    </View>
  );
}
