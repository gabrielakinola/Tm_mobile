import Svg, { Line, Polygon } from 'react-native-svg';

const SEARCH_MARK_POLYGON_POINTS =
  '63.39 49.22 47.85 56.06 32.03 49.91 25.2 34.38 31.34 18.56 46.88 11.72 62.7 17.87 69.54 33.4 63.39 49.22';
const SEARCH_MARK_VIEWBOX = {
  x: 22,
  y: 8,
  width: 63,
  height: 62,
};

export interface SearchMarkIconProps {
  color?: string;
  size?: number;
  /** Rendered stroke thickness in pixels (matches Lucide `strokeWidth`). */
  strokeWidth?: number;
}

export function SearchMarkIcon({
  color = '#024DDF',
  size = 28,
  strokeWidth = 1.2,
}: SearchMarkIconProps) {
  const svgStrokeWidth = strokeWidth * (SEARCH_MARK_VIEWBOX.width / size);

  return (
    <Svg
      width={size}
      height={size}
      viewBox={`${SEARCH_MARK_VIEWBOX.x} ${SEARCH_MARK_VIEWBOX.y} ${SEARCH_MARK_VIEWBOX.width} ${SEARCH_MARK_VIEWBOX.height}`}
      fill="none"
      preserveAspectRatio="xMidYMid meet"
    >
      <Polygon
        points={SEARCH_MARK_POLYGON_POINTS}
        stroke={color}
        strokeWidth={svgStrokeWidth}
        strokeMiterlimit={10}
        fill="none"
      />
      <Line
        x1={63.84}
        y1={49.77}
        x2={82.4}
        y2={68.33}
        stroke={color}
        strokeWidth={svgStrokeWidth}
        strokeMiterlimit={10}
      />
    </Svg>
  );
}
