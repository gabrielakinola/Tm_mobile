import Svg, { Circle, Path } from 'react-native-svg';

const LOCATION_PIN_TOP_Y = 1.5;
const LOCATION_PIN_BODY_HEIGHT = 10 * 1.5;
const LOCATION_PIN_SHOULDER_Y = LOCATION_PIN_TOP_Y + LOCATION_PIN_BODY_HEIGHT;
const LOCATION_PIN_POINT_HEIGHT = (22.5 - 11.5) * 0.75;
const LOCATION_PIN_POINT_Y = LOCATION_PIN_SHOULDER_Y + LOCATION_PIN_POINT_HEIGHT;
const LOCATION_PIN_CENTER_X = 7;
const LOCATION_PIN_CIRCLE_CY = LOCATION_PIN_TOP_Y + LOCATION_PIN_BODY_HEIGHT / 2;

const LOCATION_PIN_VIEWBOX = {
  x: -2,
  y: 0,
  width: 18,
  height: 26,
};

export interface DiscoverLocationPinIconProps {
  color?: string;
  size?: number;
  strokeWidth?: number;
}

export function DiscoverLocationPinIcon({
  color = '#FFFFFF',
  size = 20,
  strokeWidth = 2.75,
}: DiscoverLocationPinIconProps) {
  const svgStrokeWidth = strokeWidth * (LOCATION_PIN_VIEWBOX.width / size);

  return (
    <Svg
      width={size}
      height={size}
      viewBox={`${LOCATION_PIN_VIEWBOX.x} ${LOCATION_PIN_VIEWBOX.y} ${LOCATION_PIN_VIEWBOX.width} ${LOCATION_PIN_VIEWBOX.height}`}
      fill="none"
      preserveAspectRatio="xMidYMid meet"
    >
      <Path
        d={`M -1 ${LOCATION_PIN_TOP_Y} H 15 L 15 ${LOCATION_PIN_SHOULDER_Y} L ${LOCATION_PIN_CENTER_X} ${LOCATION_PIN_POINT_Y} L -1 ${LOCATION_PIN_SHOULDER_Y} Z`}
        stroke={color}
        strokeWidth={svgStrokeWidth}
        strokeLinejoin="miter"
        strokeMiterlimit={10}
        fill="none"
      />
      <Circle cx={LOCATION_PIN_CENTER_X} cy={LOCATION_PIN_CIRCLE_CY} r={3} fill={color} />
    </Svg>
  );
}
