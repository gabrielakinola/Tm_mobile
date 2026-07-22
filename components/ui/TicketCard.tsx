import { View } from 'react-native';
import { Calendar, MapPin, Ticket } from 'lucide-react-native';
import { useTheme } from '@/theme';
import { radius, spacing } from '@/theme/tokens';
import { Badge } from './Badge';
import { Card } from './Card';
import { Icon } from './Icon';
import { Typography } from './Typography';

export type TicketStatus = 'active' | 'used' | 'expired' | 'transferred';

export interface TicketCardData {
  id: string;
  eventTitle: string;
  date: string;
  venue: string;
  section?: string;
  seat?: string;
  status: TicketStatus;
}

export interface TicketCardProps {
  ticket: TicketCardData;
  onPress?: () => void;
}

const statusVariant: Record<TicketStatus, 'primary' | 'success' | 'default' | 'warning'> = {
  active: 'primary',
  used: 'default',
  expired: 'warning',
  transferred: 'success',
};

export function TicketCard({ ticket, onPress }: TicketCardProps) {
  const { theme } = useTheme();

  return (
    <Card pressable onPress={onPress} style={{ padding: 0, overflow: 'hidden' }}>
      <View
        style={{
          backgroundColor: theme.colors.primary,
          padding: spacing.lg,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
          <Icon icon={Ticket} size="md" color={theme.colors.primaryForeground} />
          <Typography variant="h4" style={{ color: theme.colors.primaryForeground }}>
            {ticket.eventTitle}
          </Typography>
        </View>
        <Badge label={ticket.status} variant={statusVariant[ticket.status]} />
      </View>
      <View style={{ padding: spacing.lg, gap: spacing.sm }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
          <Icon icon={Calendar} size="xs" color={theme.colors.mutedForeground} />
          <Typography variant="caption" muted>
            {ticket.date}
          </Typography>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
          <Icon icon={MapPin} size="xs" color={theme.colors.mutedForeground} />
          <Typography variant="caption" muted>
            {ticket.venue}
          </Typography>
        </View>
        {(ticket.section || ticket.seat) && (
          <View
            style={{
              flexDirection: 'row',
              gap: spacing.lg,
              marginTop: spacing.sm,
              paddingTop: spacing.sm,
              borderTopWidth: 1,
              borderTopColor: theme.colors.border,
              borderStyle: 'dashed',
            }}
          >
            {ticket.section ? (
              <View>
                <Typography variant="label" muted style={{ textTransform: 'none' }}>
                  Section
                </Typography>
                <Typography variant="body">{ticket.section}</Typography>
              </View>
            ) : null}
            {ticket.seat ? (
              <View>
                <Typography variant="label" muted style={{ textTransform: 'none' }}>
                  Seat
                </Typography>
                <Typography variant="body">{ticket.seat}</Typography>
              </View>
            ) : null}
          </View>
        )}
      </View>
      <View
        style={{
          position: 'absolute',
          left: -8,
          top: '50%',
          width: 16,
          height: 16,
          borderRadius: radius.full,
          backgroundColor: theme.colors.background,
        }}
      />
      <View
        style={{
          position: 'absolute',
          right: -8,
          top: '50%',
          width: 16,
          height: 16,
          borderRadius: radius.full,
          backgroundColor: theme.colors.background,
        }}
      />
    </Card>
  );
}
