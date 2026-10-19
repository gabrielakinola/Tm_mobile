import { Pressable, Modal as RNModal, ScrollView, View } from 'react-native';
import { X } from 'lucide-react-native';
import { Typography } from '@/components/ui';
import { APP_CARD_BG, APP_DARK_MUTED, APP_DARK_SURFACE } from '@/constants/app-surface';
import {
  formatViewTicketsHeaderMeta,
  getViewTicketTypeLabel,
} from '@/features/my-events/utils/view-tickets';
import { hapticLight } from '@/lib/haptics';
import type { EventTicket, MyEventDetail } from '@/services/events/types';
import { colors, radius, spacing } from '@/theme/tokens';

export interface TicketInfoModalProps {
  visible: boolean;
  event: MyEventDetail | null;
  ticket: EventTicket | null;
  onClose: () => void;
}

export function TicketInfoModal({ visible, event, ticket, onClose }: TicketInfoModalProps) {
  const handleClose = () => {
    void hapticLight();
    onClose();
  };

  if (!event || !ticket) {
    return null;
  }

  const isSeated = event.ticketMode !== 'ga';
  const meta = formatViewTicketsHeaderMeta(event.eventDate, event.eventTime, event.venue);
  const entrance = event.entrance.trim();

  return (
    <RNModal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' }}>
        <Pressable style={{ flex: 1 }} onPress={handleClose} />
        <View
          style={{
            backgroundColor: APP_CARD_BG,
            borderTopLeftRadius: radius.xl,
            borderTopRightRadius: radius.xl,
            paddingHorizontal: spacing.xl,
            paddingTop: spacing.lg,
            paddingBottom: spacing['2xl'],
            maxHeight: '78%',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: spacing.lg,
            }}
          >
            <Typography
              style={{
                color: colors.white,
                fontSize: 20,
                fontWeight: '700',
                lineHeight: 26,
              }}
            >
              Ticket Info
            </Typography>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close"
              hitSlop={8}
              onPress={handleClose}
              style={{
                width: 32,
                height: 32,
                borderRadius: radius.full,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: APP_DARK_SURFACE,
              }}
            >
              <X size={16} color={colors.white} strokeWidth={2.2} />
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ gap: spacing.lg }}
          >
            <InfoBlock label="Event" value={event.name} />
            <InfoBlock label="Date" value={meta} />
            <InfoBlock label="Ticket type" value={getViewTicketTypeLabel(event.ticketMode)} />
            {event.saleLabel.trim() ? (
              <InfoBlock label="Sale type" value={event.saleLabel.trim()} />
            ) : null}
            <InfoBlock label="Section" value={ticket.section || '—'} />
            {isSeated ? (
              <>
                <InfoBlock label="Row" value={ticket.row?.trim() || '—'} />
                <InfoBlock label="Seat" value={ticket.seat?.trim() || '—'} />
              </>
            ) : (
              <InfoBlock label="Admission" value="General Admission" />
            )}
            {event.orderNumber.trim() ? (
              <InfoBlock label="Order number" value={event.orderNumber.trim()} />
            ) : null}
            {entrance ? (
              <View style={{ gap: spacing.xs }}>
                <Typography
                  style={{
                    color: colors.white,
                    fontSize: 15,
                    fontWeight: '700',
                  }}
                >
                  Important Notes
                </Typography>
                <Typography style={{ color: APP_DARK_MUTED, fontSize: 14, lineHeight: 20 }}>
                  {entrance}
                </Typography>
              </View>
            ) : null}
          </ScrollView>
        </View>
      </View>
    </RNModal>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ gap: 3 }}>
      <Typography
        style={{
          color: APP_DARK_MUTED,
          fontSize: 12,
          fontWeight: '600',
        }}
      >
        {label}
      </Typography>
      <Typography style={{ color: colors.white, fontSize: 16, lineHeight: 22 }}>{value}</Typography>
    </View>
  );
}
