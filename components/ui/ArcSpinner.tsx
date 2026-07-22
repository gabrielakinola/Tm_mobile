import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { colors } from '@/theme/tokens';

const AnimatedView = Animated.createAnimatedComponent(View);

export interface ArcSpinnerProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

/**
 * Partial-arc spinner (≈270°) with square stroke caps, matching Ticketmaster-style loaders.
 */
export function ArcSpinner({
  size = 40,
  color = colors.pulse[500],
  strokeWidth = 3.5,
}: ArcSpinnerProps) {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 900, easing: Easing.linear }),
      -1,
      false,
    );
  }, [rotation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Show ~75% of the ring (open arc).
  const arcLength = circumference * 0.75;

  return (
    <AnimatedView style={[styles.wrap, { width: size, height: size }, animatedStyle]}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="butt"
          strokeDasharray={`${arcLength} ${circumference}`}
          fill="none"
        />
      </Svg>
    </AnimatedView>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
