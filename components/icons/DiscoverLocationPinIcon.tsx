import Svg, { Path } from 'react-native-svg';
import { APP_LOCATION_PIN } from '@/constants/app-surface';

const VIEWBOX_WIDTH = 14;
const VIEWBOX_HEIGHT = 18;

export interface LocationPinIconProps {
  color?: string;
  size?: number;
}

/** Filled Ticketmaster location pin: shield body with a circular knockout. */
export function LocationPinIcon({ color = APP_LOCATION_PIN, size = 16 }: LocationPinIconProps) {
  const width = Math.round((size * VIEWBOX_WIDTH) / VIEWBOX_HEIGHT);

  return (
    <Svg width={width} height={size} viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`} fill="none">
      <Path
        fill={color}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1 0h12v10.15L7 17.6 1 10.15V0Zm6 3.05a2.45 2.45 0 1 0 0 4.9 2.45 2.45 0 0 0 0-4.9Z"
      />
    </Svg>
  );
}

/** @deprecated Use LocationPinIcon */
export const DiscoverLocationPinIcon = LocationPinIcon;
export type DiscoverLocationPinIconProps = LocationPinIconProps;
