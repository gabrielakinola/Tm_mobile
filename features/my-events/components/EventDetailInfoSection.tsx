import { Image, Pressable, View } from 'react-native';
import ticketIcon from '@/assets/icons/ticket.png';
import { ViewTicketsScanIcon } from '@/components/icons/ViewTicketsScanIcon';
import { TicketmasterText } from '@/components/ui/TicketmasterText';
import { Typography } from '@/components/ui/Typography';
import { MY_EVENT_CARD_DARK_BG } from '@/features/my-events/components/MyEventCard';
import type { MyEventDetail } from '@/services/events/types';
import { colors, spacing } from '@/theme/tokens';

const VIEW_TICKETS_BLUE = '#0057D9';
const VENUE_COLOR = '#C8C8C8';
const VENUE_FONT_SIZE = 15;
export const EVENT_DETAIL_SIDE_MARGIN = 10;
export const EVENT_DETAIL_VIEW_TICKETS_HEIGHT = 35;

export interface EventDetailInfoSectionProps {
  event: MyEventDetail;
  onViewTickets?: () => void;
}

export function EventDetailInfoSection({ event, onViewTickets }: EventDetailInfoSectionProps) {
  const ticketCount = event.tickets.length;
  return (
    <View pointerEvents="box-none">
      <View pointerEvents="none" style={{ marginHorizontal: EVENT_DETAIL_SIDE_MARGIN }}>
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
              <Image source={ticketIcon} style={{ width: 22, height: 22 }} resizeMode="contain" />
              <Typography style={{ color: colors.white, fontSize: 15, fontWeight: '700' }}>
                x{ticketCount}
              </Typography>
            </View>
          </View>
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="View tickets"
        onPress={onViewTickets}
        pointerEvents={onViewTickets ? 'auto' : 'none'}
        style={{
          marginHorizontal: EVENT_DETAIL_SIDE_MARGIN,
          backgroundColor: VIEW_TICKETS_BLUE,
          minHeight: EVENT_DETAIL_VIEW_TICKETS_HEIGHT,
          height: EVENT_DETAIL_VIEW_TICKETS_HEIGHT,
          paddingVertical: 0,
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
