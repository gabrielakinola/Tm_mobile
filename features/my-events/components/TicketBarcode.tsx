import { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Path, Rect } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { RefreshCw } from 'lucide-react-native';
import { Typography } from '@/components/ui';

const ROTATE_MS = 15_000;
const SWEEP_ONE_WAY_MS = 2000;
const TOKEN_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const TOKEN_LENGTH = 16;
const ROWS = 10;
const START_BLOCK = 4;
const STOP_BLOCK = 4;
const DATA_COLS = 46;
const BORDER = '#E4D9C8';
const TEXT = '#8A8A8A';
const SWEEP_BLUE = '#026CDF';

export function TicketBarcode({ value, width }: { value: string; width: number }) {
  const [token, setToken] = useState(createBarcodeToken);
  const progress = useSharedValue(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setToken(createBarcodeToken());
    }, ROTATE_MS);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    progress.value = 0;
    progress.value = withRepeat(
      withTiming(1, { duration: SWEEP_ONE_WAY_MS * 2, easing: Easing.linear }),
      -1,
      false,
    );

    return () => {
      cancelAnimation(progress);
    };
  }, [progress]);

  const layout = useMemo(() => layoutBarcode(width), [width]);
  const payload = `${value}:${token}`;
  const dataPath = useMemo(
    () => matrixToPath(createDataMatrix(payload), layout.moduleSize, layout.dataX),
    [layout.dataX, layout.moduleSize, payload],
  );
  const sweepWidth = Math.max(28, Math.round(layout.barcodeWidth * 0.1));

  const sweepTravelStyle = useAnimatedStyle(() => {
    const goingRight = progress.value < 0.5;
    const edgeX = goingRight
      ? interpolate(progress.value, [0, 0.5], [0, layout.barcodeWidth])
      : interpolate(progress.value, [0.5, 1], [layout.barcodeWidth, 0]);
    const x = goingRight ? edgeX - sweepWidth : edgeX;
    return {
      transform: [{ translateX: x }],
    };
  });

  const ltrGlowStyle = useAnimatedStyle(() => ({
    opacity: progress.value < 0.5 ? 1 : 0,
  }));

  const rtlGlowStyle = useAnimatedStyle(() => ({
    opacity: progress.value < 0.5 ? 0 : 1,
  }));

  return (
    <View
      style={{
        width,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: BORDER,
        paddingHorizontal: 10,
        paddingTop: 10,
        paddingBottom: 12,
        gap: 10,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          minHeight: 20,
        }}
      >
        <Typography
          style={{
            color: TEXT,
            fontSize: 13,
            lineHeight: 16,
            fontWeight: '400',
          }}
        >
          {"Screenshots won't get you in"}
        </Typography>
        <RefreshCw size={14} color={TEXT} strokeWidth={2.2} />
      </View>

      <View
        style={{ width: layout.barcodeWidth, height: layout.barcodeHeight, overflow: 'hidden' }}
      >
        <Svg
          key={token}
          width={layout.barcodeWidth}
          height={layout.barcodeHeight}
          viewBox={`0 0 ${layout.barcodeWidth} ${layout.barcodeHeight}`}
        >
          <Rect width={layout.barcodeWidth} height={layout.barcodeHeight} fill="#FFFFFF" />
          <Rect
            x={0}
            y={0}
            width={layout.startBlockWidth}
            height={layout.barcodeHeight}
            fill="#000000"
          />
          {layout.startBars.map((bar) => (
            <Rect
              key={`start-${bar.x}`}
              x={bar.x}
              y={0}
              width={bar.width}
              height={layout.barcodeHeight}
              fill="#000000"
            />
          ))}
          <Path d={dataPath} fill="#000000" />
          <Rect
            x={layout.stopBlockX}
            y={0}
            width={layout.stopBlockWidth}
            height={layout.barcodeHeight}
            fill="#000000"
          />
          {layout.stopBars.map((bar) => (
            <Rect
              key={`stop-${bar.x}`}
              x={bar.x}
              y={0}
              width={bar.width}
              height={layout.barcodeHeight}
              fill="#000000"
            />
          ))}
        </Svg>

        <Animated.View
          pointerEvents="none"
          style={[
            {
              position: 'absolute',
              top: 0,
              bottom: 0,
              width: sweepWidth,
              mixBlendMode: 'multiply',
            },
            sweepTravelStyle,
          ]}
        >
          <Animated.View
            style={[{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }, ltrGlowStyle]}
          >
            <LinearGradient
              colors={['rgba(2, 108, 223, 0)', 'rgba(2, 108, 223, 0.22)', SWEEP_BLUE, '#8ED4FF']}
              locations={[0, 0.62, 0.9, 1]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={{ flex: 1 }}
            />
          </Animated.View>
          <Animated.View
            style={[{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }, rtlGlowStyle]}
          >
            <LinearGradient
              colors={['#8ED4FF', SWEEP_BLUE, 'rgba(2, 108, 223, 0.22)', 'rgba(2, 108, 223, 0)']}
              locations={[0, 0.1, 0.38, 1]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={{ flex: 1 }}
            />
          </Animated.View>
        </Animated.View>
      </View>
    </View>
  );
}

function layoutBarcode(width: number) {
  const barcodeWidth = width - 20;
  const startBarsPattern = [0, 1, 0, 1, 0, 1];
  const stopBarsPattern = [0, 1, 0, 1, 0, 1];
  const totalCols =
    START_BLOCK + startBarsPattern.length + DATA_COLS + STOP_BLOCK + stopBarsPattern.length;
  const moduleSize = barcodeWidth / totalCols;
  const barcodeHeight = moduleSize * ROWS;

  const toBars = (pattern: number[], originCol: number) => {
    const bars: { x: number; width: number }[] = [];
    pattern.forEach((on, index) => {
      if (!on) return;
      bars.push({
        x: (originCol + index) * moduleSize,
        width: Math.max(1, moduleSize),
      });
    });
    return bars;
  };

  const startBarsOrigin = START_BLOCK;
  const dataOrigin = START_BLOCK + startBarsPattern.length;
  const stopBlockOrigin = dataOrigin + DATA_COLS;
  const stopBarsOrigin = stopBlockOrigin + STOP_BLOCK;

  return {
    barcodeWidth,
    barcodeHeight,
    moduleSize,
    startBlockWidth: START_BLOCK * moduleSize,
    startBars: toBars(startBarsPattern, startBarsOrigin),
    dataX: dataOrigin * moduleSize,
    stopBlockX: stopBlockOrigin * moduleSize,
    stopBlockWidth: STOP_BLOCK * moduleSize,
    stopBars: toBars(stopBarsPattern, stopBarsOrigin),
  };
}

function createDataMatrix(payload: string): number[][] {
  let seed = hashSeed(payload);
  const next = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed;
  };

  const matrix: number[][] = [];

  for (let row = 0; row < ROWS; row += 1) {
    const line: number[] = [];
    let col = 0;
    let black = (next() & 1) === 1;

    while (col < DATA_COLS) {
      const run = Math.min(DATA_COLS - col, 1 + (next() % 3));
      for (let i = 0; i < run; i += 1) {
        line.push(black ? 1 : 0);
      }
      col += run;
      black = !black;
    }

    matrix.push(line);
  }

  return matrix;
}

function matrixToPath(matrix: number[][], moduleSize: number, originX: number): string {
  let path = '';

  matrix.forEach((row, rowIndex) => {
    let drawing = false;
    let start = 0;
    const y = rowIndex * moduleSize;

    const flush = (end: number) => {
      path += `M${originX + start * moduleSize} ${y}h${(end - start) * moduleSize}v${moduleSize}h${-((end - start) * moduleSize)}z`;
    };

    row.forEach((module, col) => {
      if (module) {
        if (!drawing) {
          drawing = true;
          start = col;
        }
      } else if (drawing) {
        flush(col);
        drawing = false;
      }
    });

    if (drawing) {
      flush(row.length);
    }
  });

  return path;
}

function hashSeed(value: string): number {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function createBarcodeToken(): string {
  let token = '';
  for (let i = 0; i < TOKEN_LENGTH; i += 1) {
    token += TOKEN_ALPHABET[Math.floor(Math.random() * TOKEN_ALPHABET.length)];
  }
  return token;
}
