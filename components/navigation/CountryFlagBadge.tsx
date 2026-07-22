import { View, type ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { SCREEN_HEADER_FLAG_BORDER } from '@/constants/screen-header';

/** Default size used on Discover / My Events headers. */
export const COUNTRY_FLAG_BADGE_SIZE = 28;

function flagUrlForCountry(countryCode?: string | null): string {
  const code = (countryCode || 'US').trim().toLowerCase() || 'us';
  return `https://flagcdn.com/w80/${code}.png`;
}

export interface CountryFlagBadgeProps {
  countryCode?: string | null;
  size?: number;
  style?: ViewStyle;
}

export function CountryFlagBadge({
  countryCode = 'US',
  size = COUNTRY_FLAG_BADGE_SIZE,
  style,
}: CountryFlagBadgeProps) {
  const normalized = (countryCode || 'US').trim().toUpperCase() || 'US';
  const innerRadius = size / 2 - 2;

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 1.5,
          borderColor: SCREEN_HEADER_FLAG_BORDER,
          padding: 2,
          backgroundColor: 'transparent',
        },
        style,
      ]}
    >
      <View
        style={{
          flex: 1,
          borderRadius: innerRadius,
          overflow: 'hidden',
        }}
      >
        <Image
          key={normalized}
          source={{ uri: flagUrlForCountry(normalized) }}
          style={{ width: '100%', height: '100%' }}
          contentFit="cover"
          cachePolicy="none"
        />
      </View>
    </View>
  );
}
