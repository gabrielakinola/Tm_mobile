import { View } from 'react-native';
import { Typography } from '@/components/ui/Typography';
import type { EventTicket, TicketMode } from '@/services/events/types';
import { colors, spacing } from '@/theme/tokens';

const CARD_BG = '#F2F2F2';
const DIVIDER = '#FFFFFF';
const LABEL_COLOR = '#8A8A8A';

export interface EventDetailTicketCardProps {
  ticket: EventTicket;
  ticketMode: TicketMode;
  label: string;
}

export function EventDetailTicketCard({ ticket, ticketMode, label }: EventDetailTicketCardProps) {
  const isSeated = ticketMode === 'seated';

  return (
    <View
      style={{
        borderRadius: 6,
        overflow: 'hidden',
        backgroundColor: CARD_BG,
        marginBottom: spacing.md,
      }}
    >
      <View
        style={{
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.lg,
          paddingBottom: spacing.md,
        }}
      >
        <Typography
          style={{
            color: colors.neutral[900],
            fontSize: 14,
            lineHeight: 18,
            fontWeight: '700',
          }}
        >
          {label}
        </Typography>
      </View>

      <View style={{ height: 1.5, backgroundColor: DIVIDER }} />

      <View
        style={{
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.md,
          paddingBottom: spacing.lg,
          flexDirection: 'row',
          alignItems: 'flex-start',
        }}
      >
        <TicketField label="SECTION" value={ticket.section} align="left" />
        {isSeated ? (
          <>
            <TicketField label="ROW" value={ticket.row ?? ''} align="center" />
            <TicketField label="SEAT" value={ticket.seat ?? ''} align="right" />
          </>
        ) : (
          <View
            style={{
              flex: 1,
              alignSelf: 'stretch',
              alignItems: 'flex-end',
              justifyContent: 'center',
            }}
          >
            <Typography
              style={{
                color: colors.neutral[900],
                fontSize: 16,
                lineHeight: 20,
                fontWeight: '800',
                letterSpacing: 0.8,
                textAlign: 'right',
              }}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.75}
            >
              GENERAL ADMISSION
            </Typography>
          </View>
        )}
      </View>
    </View>
  );
}

function TicketField({
  label,
  value,
  align,
}: {
  label: string;
  value: string;
  align: 'left' | 'center' | 'right';
}) {
  const textAlign = align;

  return (
    <View style={{ flex: 1, gap: 4 }}>
      <Typography
        style={{
          color: LABEL_COLOR,
          fontSize: 11,
          lineHeight: 14,
          fontWeight: '600',
          letterSpacing: 0.4,
          textAlign,
        }}
      >
        {label}
      </Typography>
      <Typography
        style={{
          color: colors.neutral[900],
          fontSize: 16,
          lineHeight: 20,
          fontWeight: '700',
          textAlign,
        }}
      >
        {value || '—'}
      </Typography>
    </View>
  );
}
