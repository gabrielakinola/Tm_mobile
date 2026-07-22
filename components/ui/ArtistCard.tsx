import { View } from 'react-native';
import { Image } from 'expo-image';
import { Music } from 'lucide-react-native';
import { useTheme } from '@/theme';
import { spacing } from '@/theme/tokens';
import { Avatar } from './Avatar';
import { Card } from './Card';
import { Icon } from './Icon';
import { Typography } from './Typography';

export interface ArtistCardData {
  id: string;
  name: string;
  imageUrl?: string;
  genre?: string;
  upcomingEvents?: number;
}

export interface ArtistCardProps {
  artist: ArtistCardData;
  onPress?: () => void;
  width?: number;
}

export function ArtistCard({ artist, onPress, width }: ArtistCardProps) {
  const { theme } = useTheme();

  return (
    <Card
      pressable
      onPress={onPress}
      style={{ width, alignItems: 'center', padding: spacing.lg, gap: spacing.sm }}
    >
      {artist.imageUrl ? (
        <View style={{ width: 80, height: 80, borderRadius: 40, overflow: 'hidden' }}>
          <Image
            source={{ uri: artist.imageUrl }}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
          />
        </View>
      ) : (
        <Avatar name={artist.name} size="xl" />
      )}
      <Typography variant="h4" numberOfLines={1} style={{ textAlign: 'center' }}>
        {artist.name}
      </Typography>
      {artist.genre ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
          <Icon icon={Music} size="xs" color={theme.colors.mutedForeground} />
          <Typography variant="caption" muted>
            {artist.genre}
          </Typography>
        </View>
      ) : null}
      {artist.upcomingEvents !== undefined ? (
        <Typography variant="caption" style={{ color: theme.colors.primary }}>
          {artist.upcomingEvents} upcoming
        </Typography>
      ) : null}
    </Card>
  );
}
