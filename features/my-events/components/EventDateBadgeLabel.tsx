import { type ReactNode } from 'react';
import { Text } from 'react-native';
import { getEventBadgeDateParts } from '@/lib/event-datetime';
import { colors } from '@/theme/tokens';

const DATE_FONT_SIZE = 12;
const DOT_SEPARATOR_OFFSET_Y = 2.5;
const SHRINK_TO_FIT_MIN_SCALE = 0.65;

function getSegmentTextStyle(fontSize: number, lineHeightMultiplier = 1.22) {
  const lineHeight = Math.round(fontSize * lineHeightMultiplier);
  return {
    color: colors.white,
    fontSize,
    lineHeight,
    fontWeight: '700' as const,
    letterSpacing: -0.25,
    includeFontPadding: false,
  };
}

function buildInlineLabel(
  parts: string[],
  fontSize: number,
  dotFontSize: number,
  shrinkToFit: boolean,
): ReactNode[] {
  const lineHeight = Math.round(fontSize * 1.22);
  const nodes: ReactNode[] = [];

  parts.forEach((part, partIndex) => {
    if (partIndex > 0) {
      if (shrinkToFit) {
        nodes.push(' · ');
      } else {
        nodes.push(
          <Text
            key={`date-dot-${partIndex}`}
            style={{
              color: colors.white,
              fontSize: dotFontSize,
              lineHeight,
              fontWeight: '700',
              includeFontPadding: false,
              transform: [{ translateY: DOT_SEPARATOR_OFFSET_Y }],
            }}
          >
            {' · '}
          </Text>,
        );
      }
    }

    const commaSegments = part.split(',');
    commaSegments.forEach((segment, segmentIndex) => {
      nodes.push(segment);
      if (segmentIndex < commaSegments.length - 1) {
        nodes.push(
          <Text
            key={`date-comma-${partIndex}-${segmentIndex}`}
            style={
              shrinkToFit
                ? { fontFamily: 'NotoSerif_400Regular' }
                : {
                    fontFamily: 'NotoSerif_400Regular',
                    fontSize: fontSize * 1.35,
                    lineHeight,
                    color: colors.white,
                    includeFontPadding: false,
                  }
            }
          >
            ,
          </Text>,
        );
      }
    });
  });

  return nodes;
}

export interface EventDateBadgeLabelProps {
  eventDate: string;
  eventTime: string;
  fontSize?: number;
  dotFontSize?: number;
  /** Single line; scales text down to fit the parent width (use on narrow card badges). */
  shrinkToFit?: boolean;
  minimumFontScale?: number;
  /** Tighter line height (e.g. compact mini badge). */
  lineHeightMultiplier?: number;
}

export function EventDateBadgeLabel({
  eventDate,
  eventTime,
  fontSize = DATE_FONT_SIZE,
  dotFontSize = fontSize * 2,
  shrinkToFit = false,
  minimumFontScale = SHRINK_TO_FIT_MIN_SCALE,
  lineHeightMultiplier = 1.22,
}: EventDateBadgeLabelProps) {
  const parts = getEventBadgeDateParts(eventDate, eventTime);
  const fullLabel = parts.join(' · ');
  const segmentStyle = getSegmentTextStyle(fontSize, lineHeightMultiplier);

  return (
    <Text
      accessible
      accessibilityRole="text"
      accessibilityLabel={fullLabel}
      style={[segmentStyle, shrinkToFit ? { width: '100%' } : null]}
      numberOfLines={shrinkToFit ? 1 : undefined}
      adjustsFontSizeToFit={shrinkToFit}
      minimumFontScale={shrinkToFit ? minimumFontScale : undefined}
    >
      {buildInlineLabel(parts, fontSize, dotFontSize, shrinkToFit)}
    </Text>
  );
}
