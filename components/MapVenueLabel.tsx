import { memo } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, FadeIn } from 'react-native-reanimated';

export interface MapVenueLabelProps {
  venue: string;
}

const LABEL_FONT_SIZE = 20;
const LABEL_LINE_HEIGHT = 24;
const LABEL_MAX_WIDTH = 220;

const systemFont = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  default: undefined,
});

const baseTextStyle = {
  fontFamily: systemFont,
  fontSize: LABEL_FONT_SIZE,
  lineHeight: LABEL_LINE_HEIGHT,
  fontWeight: '700' as const,
  letterSpacing: -0.3,
  textAlign: 'left' as const,
};

/**
 * Directional letter-shadow: dark edge mostly on the right (+ slight bottom),
 * as if light is cast from the top-left / upper side of each stroke.
 */
const DIRECTIONAL_SHADOW_OFFSETS: { x: number; y: number; opacity: number }[] = [
  { x: 0.9, y: 0, opacity: 0.85 },
  { x: 1.4, y: 0, opacity: 0.7 },
  { x: 1.9, y: 0.2, opacity: 0.55 },
  { x: 1.2, y: 0.7, opacity: 0.65 },
  { x: 0.7, y: 1.0, opacity: 0.5 },
  { x: 1.6, y: 0.9, opacity: 0.45 },
  { x: 0.4, y: 0.5, opacity: 0.35 },
];

function MapVenueLabelComponent({ venue }: MapVenueLabelProps) {
  const label = venue.trim();
  if (!label) {
    return null;
  }

  return (
    <Animated.View
      pointerEvents="none"
      entering={FadeIn.duration(220).easing(Easing.out(Easing.cubic))}
      style={styles.container}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <View style={styles.stack}>
        {DIRECTIONAL_SHADOW_OFFSETS.map((offset) => (
          <Text
            key={`${offset.x}-${offset.y}-${offset.opacity}`}
            numberOfLines={2}
            ellipsizeMode="tail"
            style={[
              styles.layer,
              baseTextStyle,
              {
                position: 'absolute',
                left: 0,
                top: 0,
                color: `rgba(0,0,0,${offset.opacity})`,
                transform: [{ translateX: offset.x }, { translateY: offset.y }],
              },
            ]}
          >
            {label}
          </Text>
        ))}

        <Text
          numberOfLines={2}
          ellipsizeMode="tail"
          style={[styles.layer, baseTextStyle, styles.foreground]}
        >
          {label}
        </Text>
      </View>
    </Animated.View>
  );
}

export const MapVenueLabel = memo(
  MapVenueLabelComponent,
  (prev, next) => prev.venue === next.venue,
);

MapVenueLabel.displayName = 'MapVenueLabel';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 16,
    left: 16,
    maxWidth: LABEL_MAX_WIDTH,
    zIndex: 2,
  },
  stack: {
    position: 'relative',
  },
  layer: {
    maxWidth: LABEL_MAX_WIDTH,
  },
  foreground: {
    color: '#FFFFFF',
  },
});
