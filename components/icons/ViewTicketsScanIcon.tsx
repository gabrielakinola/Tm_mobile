import Svg, { Line, Rect } from 'react-native-svg';

const VIEW_W = 95.83;
const VIEW_H = 68.49;

export interface ViewTicketsScanIconProps {
  color?: string;
  size?: number;
}

/**
 * Barcode / scan-frame icon used for View Tickets and the collapsed header action.
 */
export function ViewTicketsScanIcon({ color = '#F9F9F9', size = 22 }: ViewTicketsScanIconProps) {
  const height = size * (VIEW_H / VIEW_W);

  return (
    <Svg
      width={size}
      height={height}
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      fill="none"
      accessible={false}
      importantForAccessibility="no"
    >
      {/* Top Left */}
      <Line
        x1={11.09}
        y1={5.94}
        x2={11.09}
        y2={20.08}
        stroke={color}
        strokeWidth={4}
        strokeMiterlimit={10}
      />
      <Line
        x1={23.9}
        y1={8.06}
        x2={9.21}
        y2={7.89}
        stroke={color}
        strokeWidth={4.08}
        strokeMiterlimit={10}
      />

      {/* Bottom Left */}
      <Line
        x1={9.21}
        y1={58.98}
        x2={23.35}
        y2={58.98}
        stroke={color}
        strokeWidth={4}
        strokeMiterlimit={10}
      />
      <Line
        x1={11.33}
        y1={46.18}
        x2={11.16}
        y2={60.86}
        stroke={color}
        strokeWidth={4.08}
        strokeMiterlimit={10}
      />

      {/* Bottom Right */}
      <Line
        x1={84.91}
        y1={60.59}
        x2={84.91}
        y2={46.45}
        stroke={color}
        strokeWidth={4}
        strokeMiterlimit={10}
      />
      <Line
        x1={72.1}
        y1={58.47}
        x2={86.79}
        y2={58.64}
        stroke={color}
        strokeWidth={4.08}
        strokeMiterlimit={10}
      />

      {/* Top Right */}
      <Line
        x1={86.79}
        y1={7.82}
        x2={72.65}
        y2={7.82}
        stroke={color}
        strokeWidth={4}
        strokeMiterlimit={10}
      />
      <Line
        x1={84.67}
        y1={20.63}
        x2={84.83}
        y2={5.94}
        stroke={color}
        strokeWidth={4.08}
        strokeMiterlimit={10}
      />

      {/* Barcode */}
      <Rect x={22.65} y={16.22} width={4.99} height={33.76} fill={color} />
      <Rect x={31.68} y={15.75} width={4.99} height={24.89} fill={color} />
      <Rect x={40.57} y={15.75} width={4.99} height={34.23} fill={color} />
      <Rect x={49.46} y={15.78} width={4.99} height={24.89} fill={color} />
      <Rect x={58.58} y={15.75} width={4.99} height={24.89} fill={color} />
      <Rect x={68.03} y={15.75} width={4.99} height={34.23} fill={color} />

      {/* Short bars */}
      <Rect x={31.68} y={44.44} width={4.99} height={5.55} fill={color} />
      <Rect x={49.46} y={44.46} width={4.99} height={5.55} fill={color} />
      <Rect x={58.58} y={44.44} width={4.99} height={5.55} fill={color} />
    </Svg>
  );
}
