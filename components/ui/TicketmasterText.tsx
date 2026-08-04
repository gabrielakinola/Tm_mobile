import { type ReactNode } from 'react';
import {
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type TextProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

export interface TicketmasterTextProps extends Omit<TextProps, 'children' | 'style'> {
  children: string;
  fontSize?: number;
  color?: string;
  /** Extra downward shift for the Noto Serif comma only. */
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

  const value = StyleSheet.flatten(style)?.[key];
  return typeof value === 'number' ? value : fallback;
}

function resolveColor(explicit: string | undefined, style: StyleProp<TextStyle>): string {
  if (explicit) {
    return explicit;
  }

  const color = StyleSheet.flatten(style)?.color;
  return typeof color === 'string' ? color : '#FFFFFF';
}

function buildCommaInlineChildren(
  children: string,
  resolvedSize: number,
  resolvedColor: string,
  lineHeight: number | undefined,
  commaOffsetY: number | undefined,
): ReactNode[] {
  const segments = children.split(',');
  const commaFontSize = resolvedSize * 1.35;
  const commaTranslateY = (commaOffsetY ?? 0) + 1.5;
  const nodes: ReactNode[] = [];

  segments.forEach((segment, index) => {
    nodes.push(segment);
    if (index < segments.length - 1) {
      nodes.push(
        <Text
          key={`tm-comma-${index}`}
          style={{
            color: resolvedColor,
            fontFamily: 'NotoSerif_400Regular',
            fontSize: commaFontSize,
            ...(typeof lineHeight === 'number' ? { lineHeight } : null),
            includeFontPadding: false,
            transform: [{ translateY: commaTranslateY }],
          }}
        >
          ,
        </Text>,
      );
    }
  });

  return nodes;
}

/**
 * Renders a string with Noto Serif used only for commas; surrounding text
 * keeps its caller-provided font.
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
  const flattenedStyle = StyleSheet.flatten(style);
  const resolvedSize = resolveNumber(fontSize, style, 'fontSize', 16);
  const resolvedColor = resolveColor(color, style);
  const lineHeight =
    typeof flattenedStyle?.lineHeight === 'number' ? flattenedStyle.lineHeight : undefined;
  const segments = children.split(',');

  const textNode = (
    <Text
      {...props}
      style={style}
      numberOfLines={numberOfLines}
      accessibilityLabel={accessibilityLabel ?? children}
    >
      {segments.length === 1
        ? children
        : buildCommaInlineChildren(children, resolvedSize, resolvedColor, lineHeight, commaOffsetY)}
    </Text>
  );

  if (containerStyle) {
    return <View style={containerStyle}>{textNode}</View>;
  }

  return textNode;
}
