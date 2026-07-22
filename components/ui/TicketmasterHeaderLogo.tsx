import { Image, View, type ImageStyle, type StyleProp, type ViewStyle } from 'react-native';
import headerLogo from '@/assets/images/Ticketmaster_header.png';

const ASPECT_RATIO = 800 / 142;

export interface TicketmasterHeaderLogoProps {
  /** Visual height matching the previous text placeholder size. */
  height?: number;
  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
}

export function TicketmasterHeaderLogo({
  height = 22,
  style,
  imageStyle,
}: TicketmasterHeaderLogoProps) {
  const width = Math.round(height * ASPECT_RATIO);

  return (
    <View style={[{ width, height, justifyContent: 'center' }, style]}>
      <Image
        source={headerLogo}
        accessibilityLabel="ticketmaster"
        resizeMode="contain"
        style={[{ width, height }, imageStyle]}
      />
    </View>
  );
}
