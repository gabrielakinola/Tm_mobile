import { useEffect, useId, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import Svg, { Circle, ClipPath, Defs, G, Path, RadialGradient, Stop } from 'react-native-svg';

const LOOP_MS = 5000;
const CELLS = 10;
const RADIUS_RATIO = 0.5;
const FADE_MS = 420;

export interface TicketAntiFraudBannerProps {
  size: number;
  boundsWidth: number;
  visibleHeight: number;
  scrollX: SharedValue<number>;
  itemIndex: number;
  snapInterval: number;
}

export function TicketAntiFraudBanner({
  size,
  boundsWidth,
  visibleHeight,
  scrollX,
  itemIndex,
  snapInterval,
}: TicketAntiFraudBannerProps) {
  const rawId = useId().replace(/:/g, '');
  const clipId = `geo-clip-${rawId}`;
  const lightId = `geo-light-${rawId}`;
  const progress = useSharedValue(0);
  const appear = useSharedValue(0);
  const { discs, diamonds } = useMemo(() => buildCircleAndDiamondGrid(size), [size]);

  useEffect(() => {
    progress.value = 0;
    progress.value = withRepeat(
      withTiming(1, { duration: LOOP_MS, easing: Easing.linear }),
      -1,
      false,
    );
    appear.value = withTiming(1, { duration: FADE_MS, easing: Easing.out(Easing.cubic) });

    return () => {
      cancelAnimation(progress);
      cancelAnimation(appear);
    };
  }, [appear, progress]);

  const travelStyle = useAnimatedStyle(() => {
    const radius = size / 2;
    const startX = -radius;
    const startY = -radius;
    const midX = boundsWidth - size;
    const midY = visibleHeight / 2 - radius;
    const endX = -radius;
    const endY = visibleHeight - radius;

    const firstDx = midX - startX;
    const firstDy = midY - startY;
    const first = Math.sqrt(firstDx * firstDx + firstDy * firstDy);

    const secondDx = endX - midX;
    const secondDy = endY - midY;
    const second = Math.sqrt(secondDx * secondDx + secondDy * secondDy);

    const thirdDx = startX - endX;
    const thirdDy = startY - endY;
    const third = Math.sqrt(thirdDx * thirdDx + thirdDy * thirdDy);

    const total = Math.max(1, first + second + third);
    let traveled = progress.value * total;
    let x = startX;
    let y = startY;

    if (traveled <= first) {
      const t = traveled / Math.max(1, first);
      x = startX + firstDx * t;
      y = startY + firstDy * t;
    } else if (traveled <= first + second) {
      const t = (traveled - first) / Math.max(1, second);
      x = midX + secondDx * t;
      y = midY + secondDy * t;
    } else {
      const t = (traveled - first - second) / Math.max(1, third);
      x = endX + thirdDx * t;
      y = endY + thirdDy * t;
    }

    const rest = itemIndex * snapInterval;
    const window = snapInterval * 0.35;
    const inView = interpolate(
      scrollX.value,
      [rest - window, rest, rest + window],
      [0, 1, 0],
      Extrapolation.CLAMP,
    );

    return {
      opacity: appear.value * inView,
      transform: [{ translateX: x }, { translateY: y }],
    };
  });

  return (
    <Animated.View
      pointerEvents="none"
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      style={[styles.container, { width: size, height: size }, travelStyle]}
    >
      <View style={{ width: size, height: size, borderRadius: size / 2, overflow: 'hidden' }}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <Defs>
            <ClipPath id={clipId}>
              <Circle cx={size / 2} cy={size / 2} r={size / 2} />
            </ClipPath>
            <RadialGradient id={lightId} cx="50%" cy="50%" rx="50%" ry="50%">
              <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.55" />
              <Stop offset="28%" stopColor="#E4F9FF" stopOpacity="0.28" />
              <Stop offset="62%" stopColor="#D7F7FF" stopOpacity="0.08" />
              <Stop offset="100%" stopColor="#D7F7FF" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <G clipPath={`url(#${clipId})`}>
            {discs.map((disc) => (
              <Circle
                key={disc.key}
                cx={disc.cx}
                cy={disc.cy}
                r={disc.r}
                fill="rgba(0, 0, 0, 0.02)"
                stroke="none"
              />
            ))}
            {diamonds.map((diamond) => (
              <Path key={diamond.key} d={diamond.d} fill="rgba(255, 255, 255, 0.42)" />
            ))}
            <Circle cx={size / 2} cy={size / 2} r={size / 2} fill={`url(#${lightId})`} />
          </G>
        </Svg>
      </View>
    </Animated.View>
  );
}

function buildCircleAndDiamondGrid(size: number): {
  discs: { key: string; cx: number; cy: number; r: number }[];
  diamonds: { key: string; d: string }[];
} {
  const spacing = size / CELLS;
  const radius = spacing * RADIUS_RATIO;
  const discs: { key: string; cx: number; cy: number; r: number }[] = [];
  const diamonds: { key: string; d: string }[] = [];

  for (let row = -1; row <= CELLS + 1; row += 1) {
    for (let col = -1; col <= CELLS + 1; col += 1) {
      discs.push({
        key: `c-${row}-${col}`,
        cx: col * spacing,
        cy: row * spacing,
        r: radius,
      });
    }
  }

  for (let row = -1; row <= CELLS; row += 1) {
    for (let col = -1; col <= CELLS; col += 1) {
      const x = col * spacing;
      const y = row * spacing;
      const r = radius;
      diamonds.push({
        key: `d-${row}-${col}`,
        d: [
          `M ${x + r} ${y}`,
          `A ${r} ${r} 0 0 0 ${x + spacing} ${y + r}`,
          `A ${r} ${r} 0 0 0 ${x + r} ${y + spacing}`,
          `A ${r} ${r} 0 0 0 ${x} ${y + r}`,
          `A ${r} ${r} 0 0 0 ${x + r} ${y}`,
          'Z',
        ].join(' '),
      });
    }
  }

  return { discs, diamonds };
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
