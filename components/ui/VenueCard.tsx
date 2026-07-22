import { View } from 'react-native';
import { Image } from 'expo-image';
import { MapPin, Users } from 'lucide-react-native';
import { useTheme } from '@/theme';
import { spacing } from '@/theme/tokens';
import { Card } from './Card';
import { Icon } from './Icon';
import { Typography } from './Typography';

export interface VenueCardData {
  id: string;
  name: string;
  imageUrl?: string;
  city: string;
  capacity?: string;
}

export interface VenueCardProps {
  venue: VenueCardData;
  onPress?: () => void;
  width?: number;
}

export function VenueCard({ venue, onPress, width }: VenueCardProps) {
  const { theme } = useTheme();

  return (
    <Card
      pressable
      onPress={onPress}
      style={{ width, flexDirection: 'row', padding: spacing.md, gap: spacing.md }}
    >
      <View
        style={{
          width: 72,
          height: 72,
          borderRadius: 12,
          overflow: 'hidden',
          backgroundColor: theme.colors.muted,
        }}
      >
        {venue.imageUrl ? (
          <Image
            source={{ uri: venue.imageUrl }}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
          />
        ) : null}
      </View>
      <View style={{ flex: 1, justifyContent: 'center', gap: spacing.xs }}>
        <Typography variant="h4" numberOfLines={1}>
          {venue.name}
        </Typography>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
          <Icon icon={MapPin} size="xs" color={theme.colors.mutedForeground} />
          <Typography variant="caption" muted>
            {venue.city}
          </Typography>
        </View>
        {venue.capacity ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
            <Icon icon={Users} size="xs" color={theme.colors.mutedForeground} />
            <Typography variant="caption" muted>
              {venue.capacity}
            </Typography>
          </View>
        ) : null}
      </View>
    </Card>
  );
}
