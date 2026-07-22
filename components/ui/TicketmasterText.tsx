import { Fragment } from 'react';
import {
  Text,
  View,
  type StyleProp,
  type TextProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { TicketmasterComma } from '@/components/ui/TicketmasterComma';

export interface TicketmasterTextProps extends Omit<TextProps, 'children' | 'style'> {
  children: string;
  fontSize?: number;
  color?: string;
  /** Extra downward shift for the SVG comma only. */
  commaOffsetY?: number;
  style?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
}

function resolveNumber(
  explicit: number | undefined,
  style: StyleProp<TextStyle>,
  key: 'fontSize',
  fallback: number,
): number {
  if (typeof explicit === 'number') {
    return explicit;
  }

  const flat = (Array.isArray(style) ? style : [style]).reduce<TextStyle>((acc, item) => {
    if (item && typeof item === 'object' && !Array.isArray(item)) {
      return { ...acc, ...item };
    }
    return acc;
  }, {});

  const value = flat[key];
  return typeof value === 'number' ? value : fallback;
}

function resolveColor(explicit: string | undefined, style: StyleProp<TextStyle>): string {
  if (explicit) {
    return explicit;
  }

  const flat = (Array.isArray(style) ? style : [style]).reduce<TextStyle>((acc, item) => {
    if (item && typeof item === 'object' && !Array.isArray(item)) {
      return { ...acc, ...item };
    }
    return acc;
  }, {});

  return typeof flat.color === 'string' ? flat.color : '#FFFFFF';
}

/**
 * Renders a string, replacing each "," with the Ticketmaster SVG comma
 * sized/colored to match the surrounding text.
 */
export function TicketmasterText({
  children,
  fontSize,
  color,
  commaOffsetY,
  style,
  containerStyle,
  accessibilityLabel,
  numberOfLines,
  ...props
}: TicketmasterTextProps) {
  const resolvedSize = resolveNumber(fontSize, style, 'fontSize', 16);
  const resolvedColor = resolveColor(color, style);
  const segments = children.split(',');

  if (segments.length === 1) {
    return (
      <Text
        {...props}
        style={style}
        numberOfLines={numberOfLines}
        accessibilityLabel={accessibilityLabel ?? children}
      >
        {children}
      </Text>
    );
  }

  return (
    <View
      accessible
      accessibilityLabel={accessibilityLabel ?? children}
      style={[
        {
          flexDirection: 'row',
          flexWrap: numberOfLines === 1 ? 'nowrap' : 'wrap',
          alignItems: 'flex-end',
        },
        containerStyle,
      ]}
    >
      {segments.map((segment, index) => (
        <Fragment key={`tm-text-${index}`}>
          <Text {...props} style={style} numberOfLines={numberOfLines}>
            {segment}
          </Text>
          {index < segments.length - 1 ? (
            <TicketmasterComma
              fontSize={resolvedSize}
              color={resolvedColor}
              offsetY={commaOffsetY}
            />
          ) : null}
        </Fragment>
      ))}
    </View>
  );
}
