import { type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';

/** Matches assets/icons/ticketmaster-comma.svg viewBox */
const VIEW_W = 76;
const VIEW_H = 78;

/** Thicker-tail serif comma path (head unchanged from design). */
const COMMA_PATH =
  'M34 24C34 12.5 25.2 3.5 15.2 3.5C7.2 3.5 1.2 9.2 1.2 16.4C1.2 23.6 7 29.2 15 29.2C19.6 29.2 23.4 26.8 26 23.6C29.2 27.4 30.2 32.2 29.4 37.2C28.2 43.6 25.2 48.8 20.8 52.4C18.6 54.2 18.8 56.6 21 57.2C23 57.8 25 56.6 26 54.8C31 48.4 34 40.6 35 32.8C35.4 29 35 26 34 24Z';

export interface TicketmasterCommaProps {
  /** Surrounding text font size — comma is scaled to match a typographic comma. */
  fontSize: number;
  color?: string;
  /** Extra downward shift in px (on top of the default baseline hang). */
  offsetY?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * Custom Ticketmaster-style serif comma SVG, sized to replace a text comma
 * at the given fontSize.
 */
export function TicketmasterComma({
  fontSize,
  color = '#FFFFFF',
  offsetY = 0,
  style,
}: TicketmasterCommaProps) {
  const height = fontSize * 0.58;
  const width = height * (VIEW_W / VIEW_H);
  // Sit on the text baseline with a slight hang below, like a real comma.
  const translateY = fontSize * 0.1 + offsetY;

  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      accessible={false}
      importantForAccessibility="no"
      style={[{ transform: [{ translateY }, { rotate: '20deg' }] }, style]}
    >
      <Path fill={color} transform="translate(10 4)" d={COMMA_PATH} />
    </Svg>
  );
}
