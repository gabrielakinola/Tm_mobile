import { Pressable, View } from 'react-native';
import Svg, { Text as SvgText } from 'react-native-svg';
import { Image } from 'expo-image';
import { Mic2 } from 'lucide-react-native';
import { FavoritesPolygonIcon } from '@/components/icons/FavoritesPolygonIcon';
import { Typography } from '@/components/ui';
import { APP_TRENDING_RANK } from '@/constants/app-surface';
import type { HomeTrendingItem } from '@/mocks/home-feed';
import { useTrendingWatchlistStore } from '@/stores/trending-watchlist-store';
import { colors } from '@/theme/tokens';

const TRENDING_LIKED_FILL = '#FC2DAA';

function TrendingRank({ rank }: { rank: string }) {
  return (
    <Svg width={52} height={44} viewBox="0 0 52 44">
      <SvgText
        x={26}
        y={34}
        textAnchor="middle"
        fill="transparent"
        stroke={APP_TRENDING_RANK}
        strokeWidth={1.1}
        fontSize={32}
        fontWeight="500"
        fontFamily="Arial"
        transform="translate(26 22) scale(1.12 0.9) translate(-26 -22)"
      >
        {rank}
      </SvgText>
    </Svg>
  );
}

export function HomeTrendingRow({ item }: { item: HomeTrendingItem }) {
  const isLiked = useTrendingWatchlistStore((state) => Boolean(state.likedIds[item.id]));
  const toggleLiked = useTrendingWatchlistStore((state) => state.toggle);

  return (
    <View
      style={{
        height: 64,
        marginBottom: 7,
        position: 'relative',
        justifyContent: 'center',
      }}
    >
      <View
        style={{
          height: 64,
          marginLeft: 28,
          borderWidth: 1,
          borderColor: '#292929',
          flexDirection: 'row',
          alignItems: 'center',
          overflow: 'hidden',
        }}
      >
        <Image
          source={{ uri: item.imageUrl }}
          style={{
            width: 76,
            height: '100%',
            backgroundColor: '#1C1C1E',
          }}
          contentFit="cover"
        />

        <View style={{ flex: 1, minWidth: 0, paddingHorizontal: 12 }}>
          <Typography
            style={{
              color: colors.white,
              fontSize: 14,
              lineHeight: 18,
              fontWeight: '800',
            }}
            numberOfLines={1}
          >
            {item.name}
          </Typography>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 3 }}>
            <Mic2 size={13} color="#B8B8B8" strokeWidth={2} />
            <Typography style={{ color: '#AFAFAF', fontSize: 12, lineHeight: 16 }}>
              {item.genre}
            </Typography>
          </View>
        </View>

        <Pressable
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={
            isLiked ? `Remove ${item.name} from watchlist` : `Add ${item.name} to watchlist`
          }
          onPress={() => toggleLiked(item.id)}
          style={{
            width: 43,
            height: '100%',
            paddingRight: 16,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <FavoritesPolygonIcon
            size={21}
            color={isLiked ? TRENDING_LIKED_FILL : colors.white}
            strokeWidth={1.9}
            filled={isLiked}
          />
        </Pressable>
      </View>

      <View
        pointerEvents="none"
        style={{ position: 'absolute', left: 1, top: 10, backgroundColor: 'transparent' }}
      >
        <TrendingRank rank={item.rank} />
      </View>
    </View>
  );
}
