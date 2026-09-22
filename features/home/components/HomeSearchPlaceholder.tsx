import { useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { APP_DARK_MUTED } from '@/constants/app-surface';
import { colors } from '@/theme/tokens';

const TERMS = [
  'Artists',
  'Teams',
  'Performance',
  'Festivals',
  'Shows',
  'Comedy',
  'Venues',
] as const;

const WHITE = colors.white;
const GREY = APP_DARK_MUTED;
const FONT_SIZE = 16;
const LINE_HEIGHT = 22;
const HOLD_MS = 900;
const BRUSH_WINDOW = 3.25;
const BRUSH_MS_PER_LETTER = 170;
const AFTER_BRUSH_MS = 180;
const SLIDE_MS = 460;
const SLIDE_EASING = Easing.bezier(0.22, 1, 0.36, 1);

const wordTextStyle = {
  fontSize: FONT_SIZE,
  lineHeight: LINE_HEIGHT,
  fontWeight: '700' as const,
};

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

function nextFrame() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve());
  });
}

function measureTextWidth(lineWidth: number | undefined) {
  if (!lineWidth || lineWidth <= 0) return 0;
  return Math.ceil(lineWidth) + 1;
}

function ShimmerTerm({
  term,
  brush,
  width,
}: {
  term: string;
  brush: SharedValue<number>;
  width: number;
}) {
  const wordWidth = useSharedValue(width);

  useEffect(() => {
    if (width > 0) {
      wordWidth.value = width;
    }
  }, [width, wordWidth]);

  const windowStyle = useAnimatedStyle(() => {
    const word = wordWidth.value;
    if (word <= 0) {
      return { width: 0, transform: [{ translateX: 0 }] };
    }
    const band = Math.max((BRUSH_WINDOW / Math.max(term.length, 1)) * word, 44);
    const travel = word + band;
    return {
      width: band,
      transform: [{ translateX: -band + brush.value * travel }],
    };
  });

  const counterStyle = useAnimatedStyle(() => {
    const word = wordWidth.value;
    if (word <= 0) {
      return { transform: [{ translateX: 0 }] };
    }
    const band = Math.max((BRUSH_WINDOW / Math.max(term.length, 1)) * word, 44);
    const travel = word + band;
    return {
      transform: [{ translateX: band - brush.value * travel }],
    };
  });

  const containerStyle = width > 0 ? { width } : undefined;

  return (
    <View
      collapsable={false}
      style={[{ height: LINE_HEIGHT, alignSelf: 'flex-start', overflow: 'hidden' }, containerStyle]}
    >
      <Text style={[wordTextStyle, { color: WHITE }]} numberOfLines={1}>
        {term}
      </Text>
      <Animated.View
        pointerEvents="none"
        style={[
          {
            position: 'absolute',
            top: 0,
            left: 0,
            height: LINE_HEIGHT,
            overflow: 'hidden',
          },
          windowStyle,
        ]}
      >
        <Animated.View style={counterStyle}>
          <Text style={[wordTextStyle, { color: GREY, width: width > 0 ? width : undefined }]}>
            {term}
          </Text>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

export function HomeSearchPlaceholder() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [incomingIndex, setIncomingIndex] = useState(1);
  const [termWidths, setTermWidths] = useState<number[]>(() => TERMS.map(() => 0));
  const currentIndexRef = useRef(0);
  const widthsRef = useRef<number[]>(TERMS.map(() => 0));
  const cancelledRef = useRef(false);

  const brush = useSharedValue(0);
  const slide = useSharedValue(0);

  const currentWidth = termWidths[currentIndex] ?? 0;
  const incomingWidth = termWidths[incomingIndex] ?? 0;
  const viewportWidth = Math.max(...termWidths);

  const reelStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -slide.value * LINE_HEIGHT }],
  }));

  const recordTermWidth = (index: number, lineWidth: number | undefined) => {
    const measured = measureTextWidth(lineWidth);
    if (measured <= 0) return;
    if (widthsRef.current[index] === measured) return;
    widthsRef.current[index] = measured;
    setTermWidths((prev) => {
      if (prev[index] === measured) return prev;
      const next = [...prev];
      next[index] = measured;
      return next;
    });
  };

  useEffect(() => {
    cancelledRef.current = false;

    const waitForWidth = async (index: number) => {
      for (let attempt = 0; attempt < 80; attempt += 1) {
        const width = widthsRef.current[index];
        if (width > 0) return width;
        await wait(16);
      }
      return widthsRef.current[index];
    };

    const runBrush = (letterCount: number) =>
      new Promise<void>((resolve) => {
        brush.value = 0;
        brush.value = withTiming(
          1,
          {
            duration: Math.max(BRUSH_MS_PER_LETTER * (letterCount + BRUSH_WINDOW), 1100),
            easing: Easing.linear,
          },
          (finished) => {
            if (finished) runOnJS(resolve)();
          },
        );
      });

    const runSlide = () =>
      new Promise<void>((resolve) => {
        slide.value = 0;
        slide.value = withTiming(1, { duration: SLIDE_MS, easing: SLIDE_EASING }, (finished) => {
          if (finished) runOnJS(resolve)();
        });
      });

    const loop = async () => {
      while (!cancelledRef.current) {
        const index = currentIndexRef.current;
        const following = (index + 1) % TERMS.length;
        const term = TERMS[index];

        await waitForWidth(index);
        if (cancelledRef.current) return;

        await wait(HOLD_MS);
        if (cancelledRef.current) return;

        await runBrush(term.length);
        if (cancelledRef.current) return;

        await wait(AFTER_BRUSH_MS);
        if (cancelledRef.current) return;

        await waitForWidth(following);
        if (cancelledRef.current) return;

        await runSlide();
        if (cancelledRef.current) return;

        // Keep the visible incoming word stationary while the hidden rows
        // are prepared for the next cycle. This avoids a one-frame reel snap.
        setCurrentIndex(following);
        await nextFrame();
        if (cancelledRef.current) return;

        slide.value = 0;
        brush.value = 0;
        currentIndexRef.current = following;

        await nextFrame();
        if (cancelledRef.current) return;

        setIncomingIndex((following + 1) % TERMS.length);
      }
    };

    void loop();

    return () => {
      cancelledRef.current = true;
      cancelAnimation(brush);
      cancelAnimation(slide);
    };
  }, [brush, slide]);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', flexShrink: 0 }}>
      <Text
        style={{
          color: GREY,
          fontSize: FONT_SIZE,
          lineHeight: LINE_HEIGHT,
          fontWeight: '500',
        }}
      >
        Search for{' '}
      </Text>

      <View
        style={{
          height: LINE_HEIGHT,
          overflow: 'hidden',
          alignSelf: 'flex-start',
          ...(viewportWidth > 0 ? { width: viewportWidth } : {}),
        }}
      >
        <Animated.View style={[{ alignSelf: 'flex-start' }, reelStyle]}>
          <ShimmerTerm term={TERMS[currentIndex]} brush={brush} width={currentWidth} />
          <View
            style={{
              height: LINE_HEIGHT,
              ...(incomingWidth > 0 ? { width: incomingWidth } : { alignSelf: 'flex-start' }),
            }}
          >
            <Text
              style={[wordTextStyle, { color: WHITE }]}
              numberOfLines={1}
              onTextLayout={(event) =>
                recordTermWidth(incomingIndex, event.nativeEvent.lines[0]?.width)
              }
            >
              {TERMS[incomingIndex]}
            </Text>
          </View>
        </Animated.View>
      </View>

      <View
        pointerEvents="none"
        collapsable={false}
        style={{
          position: 'absolute',
          opacity: 0,
          left: -10000,
          top: 0,
        }}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        {TERMS.map((term, index) => (
          <Text
            key={term}
            style={wordTextStyle}
            onTextLayout={(event) => recordTermWidth(index, event.nativeEvent.lines[0]?.width)}
          >
            {term}
          </Text>
        ))}
      </View>
    </View>
  );
}
