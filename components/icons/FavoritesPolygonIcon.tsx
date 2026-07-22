import Svg, { Polygon } from 'react-native-svg';

const FAVORITES_POLYGON_POINTS =
  '18.73 3.91 8.16 12.15 8.16 27.85 31.01 48.53 55.42 28.94 55.42 12.46 44.69 3.91 31.79 13.09 19.51 3.91 18.73 3.91';
const FAVORITES_POLYGON_VIEWBOX = {
  x: 6,
  y: 2,
  width: 51,
  height: 49,
};

export interface FavoritesPolygonIconProps {
  color?: string;
  size?: number;
  strokeWidth?: number;
}

export function FavoritesPolygonIcon({
  color = '#000000',
  size = 22,
  strokeWidth = 1.8,
}: FavoritesPolygonIconProps) {
  const svgStrokeWidth = strokeWidth * (FAVORITES_POLYGON_VIEWBOX.width / size);

  return (
    <Svg
      width={size}
      height={size}
      viewBox={`${FAVORITES_POLYGON_VIEWBOX.x} ${FAVORITES_POLYGON_VIEWBOX.y} ${FAVORITES_POLYGON_VIEWBOX.width} ${FAVORITES_POLYGON_VIEWBOX.height}`}
      fill="none"
      preserveAspectRatio="xMidYMid meet"
    >
      <Polygon
        points={FAVORITES_POLYGON_POINTS}
        fill="none"
        stroke={color}
        strokeWidth={svgStrokeWidth}
        strokeLinejoin="round"
        strokeMiterlimit={10}
      />
    </Svg>
  );
}
