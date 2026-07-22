import { View } from 'react-native';
import { Image } from 'expo-image';
import { Calendar, MapPin } from 'lucide-react-native';
import { useTheme } from '@/theme';
import { spacing } from '@/theme/tokens';
import { Badge } from './Badge';
import { Card } from './Card';
import { Icon } from './Icon';
import { Typography } from './Typography';

export interface EventCardData {
  id: string;
  title: string;
  imageUrl?: string;
  date: string;
  venue: string;
  price?: string;
  category?: string;
}

export interface EventCardProps {
  event: EventCardData;
  onPress?: () => void;
  width?: number;
}

export function EventCard({ event, onPress, width }: EventCardProps) {
  const { theme } = useTheme();

  return (
    <Card pressable onPress={onPress} style={{ width, padding: 0, overflow: 'hidden' }}>
      <View style={{ height: 140, backgroundColor: theme.colors.muted }}>
        {event.imageUrl ? (
          <Image
            source={{ uri: event.imageUrl }}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
          />
        ) : null}
        {event.category ? (
          <View style={{ position: 'absolute', top: spacing.sm, left: spacing.sm }}>
            <Badge label={event.category} variant="primary" />
          </View>
        ) : null}
      </View>
      <View style={{ padding: spacing.md, gap: spacing.sm }}>
        <Typography variant="h4" numberOfLines={2}>
          {event.title}
        </Typography>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
          <Icon icon={Calendar} size="xs" color={theme.colors.mutedForeground} />
          <Typography variant="caption" muted>
            {event.date}
          </Typography>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
          <Icon icon={MapPin} size="xs" color={theme.colors.mutedForeground} />
          <Typography variant="caption" muted numberOfLines={1}>
            {event.venue}
          </Typography>
        </View>
        {event.price ? (
          <Typography
            variant="label"
            style={{ color: theme.colors.primary, textTransform: 'none' }}
          >
            From {event.price}
          </Typography>
        ) : null}
      </View>
    </Card>
  );
}
