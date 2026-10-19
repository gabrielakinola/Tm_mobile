import { Image, View } from 'react-native';
import Svg, { Circle, ClipPath, Defs, G, Line, Path, Polygon, Rect } from 'react-native-svg';
import tmMark from '@/assets/images/Ticketmaster_short.png';

const ICON_SIZE = 30;

const FOR_YOU_POLYGON_POINTS =
  '18.73 3.91 8.16 12.15 8.16 27.85 31.01 48.53 55.42 28.94 55.42 12.46 44.69 3.91 31.79 13.09 19.51 3.91 18.73 3.91';

const INACTIVE_TAB_COLOR = '#8E8E93';
const INACTIVE_BACK_POLYGON_COLOR = '#CCCCCC';
const ACTIVE_DISCOVER_INNER_COLOR = '#8EB5F0';
const FOR_YOU_LARGE_SCALE = 0.335;
const FOR_YOU_SMALL_SCALE = FOR_YOU_LARGE_SCALE * 0.95;
const TAB_ICON_OUTLINE_WIDTH = 4.5;

const DISCOVER_RING_RADIUS = 7;
const DISCOVER_STROKE_WIDTH = 2;
const DISCOVER_INNER_RADIUS = DISCOVER_RING_RADIUS - DISCOVER_STROKE_WIDTH * 1.25;
const DISCOVER_HANDLE_LENGTH = 6.125;
const DISCOVER_CENTER = 10.75;

const TICKET_WIDTH = 14;
const TICKET_HEIGHT = 9;
const TICKET_CENTER_X = TICKET_WIDTH / 2;
const TICKET_CENTER_Y = TICKET_HEIGHT / 2;
const TICKET_BODY_PATH = `M 1.1 0 H 12.9 Q 14 0 14 1.1 V 3.35 A 1.15 1.15 0 0 0 14 5.65 V 7.9 Q 14 9 12.9 9 H 1.1 Q 0 9 0 7.9 V 1.1 Q 0 0 1.1 0 Z`;
const TICKET_OUTLINE_WIDTH = TAB_ICON_OUTLINE_WIDTH * FOR_YOU_LARGE_SCALE;
const TICKET_OUTLINE_SCALE = 1 + (TICKET_OUTLINE_WIDTH * 2) / Math.min(TICKET_WIDTH, TICKET_HEIGHT);
const TICKET_PERFORATION_X = TICKET_WIDTH * 0.8;
const TICKET_PERFORATION_TOP = 1.1;
const TICKET_MAIN_LEFT = 1.1;
const TICKET_MAIN_CENTER_X = (TICKET_MAIN_LEFT + TICKET_PERFORATION_X) / 2;
const TICKET_DETAIL_TOP_WIDTH = 4.4;
const TICKET_DETAIL_TOP_LEFT_EXTENSION = TICKET_DETAIL_TOP_WIDTH * 0.5;
const TICKET_DETAIL_TOP_RENDER_WIDTH = TICKET_DETAIL_TOP_WIDTH + TICKET_DETAIL_TOP_LEFT_EXTENSION;
const TICKET_DETAIL_BOTTOM_WIDTH = 3.15;
const TICKET_DETAIL_HEIGHT = 0.8;
const TICKET_DETAIL_GAP = 0.55;
const TICKET_DETAIL_TOP_X =
  TICKET_MAIN_CENTER_X - TICKET_DETAIL_TOP_WIDTH / 2 - TICKET_DETAIL_TOP_LEFT_EXTENSION;
const TICKET_DETAIL_BOTTOM_X = TICKET_MAIN_CENTER_X - TICKET_DETAIL_BOTTOM_WIDTH / 2;
const TICKET_DETAIL_STACK_HEIGHT = TICKET_DETAIL_HEIGHT * 2 + TICKET_DETAIL_GAP;
const TICKET_DETAIL_TOP_Y = TICKET_HEIGHT / 2 - TICKET_DETAIL_STACK_HEIGHT / 2;
const TICKET_DETAIL_BOTTOM_Y = TICKET_DETAIL_TOP_Y + TICKET_DETAIL_HEIGHT + TICKET_DETAIL_GAP;
const TICKET_PERFORATION_SEGMENT_HEIGHT = 1.4;
const TICKET_PERFORATION_SEGMENT_GAP = 1.25;
const TICKET_PERFORATION_DASH = '0.85 1.05';

function TicketPerforationLines({ stroke }: { stroke: string }) {
  const segments = Array.from({ length: 3 }, (_, index) => {
    const y1 =
      TICKET_PERFORATION_TOP +
      index * (TICKET_PERFORATION_SEGMENT_HEIGHT + TICKET_PERFORATION_SEGMENT_GAP);
    const y2 = y1 + TICKET_PERFORATION_SEGMENT_HEIGHT;

    return (
      <Line
        key={index}
        x1={TICKET_PERFORATION_X}
        y1={y1}
        x2={TICKET_PERFORATION_X}
        y2={y2}
        stroke={stroke}
        strokeWidth={0.8}
        strokeDasharray={TICKET_PERFORATION_DASH}
        strokeLinecap="round"
      />
    );
  });

  return <>{segments}</>;
}

interface TicketShapeProps {
  fill: string;
  detailFill?: string;
  opacity?: number;
  detailed?: boolean;
  outlined?: boolean;
  perforated?: boolean;
}

function TicketShape({
  fill,
  detailFill = '#FFFFFF',
  opacity = 1,
  detailed = false,
  outlined = false,
  perforated = false,
}: TicketShapeProps) {
  const showPerforation = perforated || detailed;

  return (
    <G opacity={opacity}>
      {outlined ? (
        <G
          transform={`translate(${TICKET_CENTER_X}, ${TICKET_CENTER_Y}) scale(${TICKET_OUTLINE_SCALE}) translate(${-TICKET_CENTER_X}, ${-TICKET_CENTER_Y})`}
        >
          <Path d={TICKET_BODY_PATH} fill="#FFFFFF" />
        </G>
      ) : null}
      <Path d={TICKET_BODY_PATH} fill={fill} />
      {showPerforation ? <TicketPerforationLines stroke={detailFill} /> : null}
      {detailed ? (
        <>
          <Rect
            x={TICKET_DETAIL_TOP_X}
            y={TICKET_DETAIL_TOP_Y}
            width={TICKET_DETAIL_TOP_RENDER_WIDTH}
            height={TICKET_DETAIL_HEIGHT}
            rx={0.2}
            fill={detailFill}
            opacity={0.95}
          />
          <Rect
            x={TICKET_DETAIL_BOTTOM_X}
            y={TICKET_DETAIL_BOTTOM_Y}
            width={TICKET_DETAIL_BOTTOM_WIDTH}
            height={TICKET_DETAIL_HEIGHT}
            rx={0.2}
            fill={detailFill}
            opacity={0.95}
          />
        </>
      ) : null}
    </G>
  );
}

export interface TabBarIconProps {
  color: string;
  size?: number;
  focused?: boolean;
  surfaceColor?: string;
}

const HOME_ICON_BLUE = '#1E4CD6';
const HOME_ICON_VIEWBOX = 26;
const HOME_CIRCLE_CX = 12.4;
const HOME_CIRCLE_CY = 13.55;
const HOME_CIRCLE_R = 9.4;

function HomeSparkle({
  cx,
  cy,
  outer = 3.35,
  inner = 0.62,
}: {
  cx: number;
  cy: number;
  outer?: number;
  inner?: number;
}) {
  const d = [
    `M ${cx} ${cy - outer}`,
    `L ${cx + inner} ${cy - inner}`,
    `L ${cx + outer} ${cy}`,
    `L ${cx + inner} ${cy + inner}`,
    `L ${cx} ${cy + outer}`,
    `L ${cx - inner} ${cy + inner}`,
    `L ${cx - outer} ${cy}`,
    `L ${cx - inner} ${cy - inner}`,
    'Z',
  ].join(' ');

  return <Path d={d} fill="#FFFFFF" />;
}

export function HomeTabIcon({ size = ICON_SIZE, focused = false }: TabBarIconProps) {
  const markRadius = 8.37;
  const markSize = size * ((markRadius * 2) / HOME_ICON_VIEWBOX);
  const markLeft = size * ((HOME_CIRCLE_CX - markRadius) / HOME_ICON_VIEWBOX);
  const markTop = size * ((HOME_CIRCLE_CY - markRadius) / HOME_ICON_VIEWBOX);
  const sparkleAngle = -58 * (Math.PI / 180);
  const sparkleCx = HOME_CIRCLE_CX + HOME_CIRCLE_R * Math.cos(sparkleAngle);
  const sparkleCy = HOME_CIRCLE_CY + HOME_CIRCLE_R * Math.sin(sparkleAngle);

  return (
    <View style={{ width: size, height: size }}>
      <Svg
        width={size}
        height={size}
        viewBox={`0 0 ${HOME_ICON_VIEWBOX} ${HOME_ICON_VIEWBOX}`}
        style={{ position: 'absolute' }}
      >
        {focused ? (
          <Circle cx={HOME_CIRCLE_CX} cy={HOME_CIRCLE_CY} r={HOME_CIRCLE_R} fill={HOME_ICON_BLUE} />
        ) : (
          <Circle
            cx={HOME_CIRCLE_CX}
            cy={HOME_CIRCLE_CY}
            r={HOME_CIRCLE_R - 0.85}
            stroke="#FFFFFF"
            strokeWidth={1.3}
            fill="none"
          />
        )}
      </Svg>
      <Image
        source={tmMark}
        accessibilityIgnoresInvertColors
        resizeMode="contain"
        style={{
          position: 'absolute',
          width: markSize,
          height: markSize,
          left: markLeft,
          top: markTop,
        }}
      />
      {focused ? (
        <Svg
          width={size}
          height={size}
          viewBox={`0 0 ${HOME_ICON_VIEWBOX} ${HOME_ICON_VIEWBOX}`}
          style={{ position: 'absolute' }}
        >
          <HomeSparkle cx={sparkleCx} cy={sparkleCy} />
        </Svg>
      ) : null}
    </View>
  );
}

const WATCHLIST_ACTIVE_FILL = '#B16AF6';

export function WatchlistTabIcon({ size = ICON_SIZE, focused = false }: TabBarIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 26 26" fill="none">
      <G transform="translate(13 13) scale(1 0.9) translate(-13 -13)">
        <Path
          d="M10.35 3.55 H15.65 C16.95 3.55 17.7 4.35 17.7 5.55 V21.45 L13 17.7 L8.3 21.45 V5.55 C8.3 4.35 9.05 3.55 10.35 3.55 Z"
          stroke={focused ? WATCHLIST_ACTIVE_FILL : '#FFFFFF'}
          strokeWidth={1.3}
          fill={focused ? WATCHLIST_ACTIVE_FILL : 'none'}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </G>
    </Svg>
  );
}

export function DiscoverTabIcon({ color, size = ICON_SIZE }: TabBarIconProps) {
  const isInactive = color.toUpperCase() === INACTIVE_TAB_COLOR;
  const innerFill = isInactive ? INACTIVE_BACK_POLYGON_COLOR : ACTIVE_DISCOVER_INNER_COLOR;

  const handleAngle = Math.PI / 4;
  const handleStartDistance = DISCOVER_RING_RADIUS + DISCOVER_STROKE_WIDTH / 2;
  const handleStartX = DISCOVER_CENTER + handleStartDistance * Math.cos(handleAngle);
  const handleStartY = DISCOVER_CENTER + handleStartDistance * Math.sin(handleAngle);
  const handleEndX = handleStartX + DISCOVER_HANDLE_LENGTH * Math.cos(handleAngle);
  const handleEndY = handleStartY + DISCOVER_HANDLE_LENGTH * Math.sin(handleAngle);

  return (
    <Svg width={size} height={size} viewBox="0 0 26 26" fill="none">
      <Circle
        cx={DISCOVER_CENTER}
        cy={DISCOVER_CENTER}
        r={DISCOVER_INNER_RADIUS}
        fill={innerFill}
      />
      <Circle
        cx={DISCOVER_CENTER}
        cy={DISCOVER_CENTER}
        r={DISCOVER_RING_RADIUS}
        stroke={color}
        strokeWidth={DISCOVER_STROKE_WIDTH}
        fill="none"
      />
      <Line
        x1={handleStartX}
        y1={handleStartY}
        x2={handleEndX}
        y2={handleEndY}
        stroke={color}
        strokeWidth={DISCOVER_STROKE_WIDTH}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function ForYouTabIcon({ color, size = ICON_SIZE }: TabBarIconProps) {
  const isInactive = color.toUpperCase() === INACTIVE_TAB_COLOR;
  const backFill = isInactive ? INACTIVE_BACK_POLYGON_COLOR : color;
  const backOpacity = isInactive ? 1 : 0.42;

  return (
    <Svg width={size} height={size} viewBox="0 0 26 26" fill="none">
      <G transform={`translate(5.75, 0.5) scale(${FOR_YOU_SMALL_SCALE})`}>
        <Polygon points={FOR_YOU_POLYGON_POINTS} fill={backFill} opacity={backOpacity} />
      </G>
      <G transform={`translate(1.25, 6.75) scale(${FOR_YOU_LARGE_SCALE})`}>
        <Polygon
          points={FOR_YOU_POLYGON_POINTS}
          fill={color}
          stroke="#FFFFFF"
          strokeWidth={TAB_ICON_OUTLINE_WIDTH}
          strokeLinejoin="round"
        />
      </G>
    </Svg>
  );
}

const TICKETS_ACTIVE_BLUE = '#1E4CD6';
const TICKET_CARD_W = 12.35;
const TICKET_CARD_H = 14.52;
const TICKET_CARD_RX = 2.05;
const TICKET_BACK_W = 10.87;
const TICKET_BACK_H = 12.78;
const TICKET_BACK_RX = 1.8;
const TICKET_STROKE = 1.3;
const TICKET_GAP_STROKE = 2.4;
const TICKET_BACK_ROTATION = 10;
const TICKET_FRONT_ROTATION = -12.2;

function ticketBodyPath(width: number, height: number, cut: number) {
  const c = Math.min(cut, width / 2, height / 2);
  return `M0 0H${width}V${height - c}L${width - c} ${height}H0Z`;
}

export function MyTicketsTabIcon({
  color,
  size = ICON_SIZE,
  focused = false,
  surfaceColor = '#000000',
}: TabBarIconProps) {
  const frontOriginX = TICKET_CARD_W / 2;
  const frontOriginY = TICKET_CARD_H / 2;
  const backOriginX = TICKET_BACK_W / 2;
  const backOriginY = TICKET_BACK_H / 2;
  const backFill = focused ? '#FFFFFF' : 'none';
  const frontFill = focused ? TICKETS_ACTIVE_BLUE : surfaceColor;
  const detail = focused ? '#FFFFFF' : color;
  const backStroke = focused ? '#FFFFFF' : color;
  const frontStroke = focused ? TICKETS_ACTIVE_BLUE : color;

  return (
    <Svg width={size} height={size} viewBox="0 0 26 26" fill="none">
      <G
        transform={`translate(15.55 15.7) rotate(${TICKET_BACK_ROTATION}) translate(${-backOriginX} ${-backOriginY})`}
      >
        <Path
          d={ticketBodyPath(TICKET_BACK_W, TICKET_BACK_H, TICKET_BACK_RX)}
          fill={backFill}
          stroke={backStroke}
          strokeWidth={TICKET_STROKE}
          strokeLinejoin="miter"
        />
      </G>
      <G
        transform={`translate(11.45 14.15) rotate(${TICKET_FRONT_ROTATION}) translate(${-frontOriginX} ${-frontOriginY})`}
      >
        {!focused ? (
          <Path
            d={ticketBodyPath(TICKET_CARD_W, TICKET_CARD_H, TICKET_CARD_RX)}
            fill={frontFill}
            stroke={surfaceColor}
            strokeWidth={TICKET_GAP_STROKE}
            strokeLinejoin="miter"
          />
        ) : null}
        <Path
          d={ticketBodyPath(TICKET_CARD_W, TICKET_CARD_H, TICKET_CARD_RX)}
          fill={frontFill}
          stroke={frontStroke}
          strokeWidth={TICKET_STROKE}
          strokeLinejoin="miter"
        />
        <Rect
          x={2.2}
          y={3.55}
          width={7.95}
          height={4.75}
          fill="none"
          stroke={detail}
          strokeWidth={TICKET_STROKE}
        />
        <Rect x={3.9} y={5.05} width={4.55} height={1.75} fill={detail} />
        <Rect
          x={2.2 - TICKET_STROKE / 2}
          y={10.2}
          width={6.45 + TICKET_STROKE / 2}
          height={1.55}
          fill={detail}
        />
      </G>
    </Svg>
  );
}

const SELL_NOTE_WIDTH = 19.5;
const SELL_NOTE_HEIGHT = 11;
const SELL_NOTE_X = (26 - SELL_NOTE_WIDTH) / 2;
const SELL_NOTE_Y = 7.5;
const SELL_WAVE_AMPLITUDE = 1.2;
const SELL_CORNER_RADIUS = 2.35;
const SELL_CENTER_RADIUS = 2.95;
const SELL_BACK_OFFSET_Y = -2.125;
const SELL_BACK_ROTATION = 20;

function buildSellFrontNotePath(
  x: number,
  y: number,
  width: number,
  height: number,
  amplitude: number,
): string {
  const topY = y;
  const bottomY = y + height;
  const rightX = x + width;
  const wave = amplitude;

  return [
    `M ${x} ${topY + wave}`,
    `C ${x + width * 0.34} ${topY + wave * 1.08} ${x + width * 0.66} ${topY - wave * 0.92} ${rightX} ${topY - wave}`,
    `L ${rightX} ${bottomY - wave}`,
    `C ${x + width * 0.66} ${bottomY + wave * 0.92} ${x + width * 0.34} ${bottomY - wave * 1.08} ${x} ${bottomY + wave}`,
    `L ${x} ${topY + wave}`,
    'Z',
  ].join(' ');
}

function buildSellBackNotePath(
  x: number,
  y: number,
  width: number,
  height: number,
  amplitude: number,
): string {
  const topY = y;
  const bottomY = y + height;
  const rightX = x + width;
  const wave = amplitude;

  return [
    `M ${x} ${topY + wave * 0.9}`,
    `C ${x + width * 0.22} ${topY + wave * 1.3} ${x + width * 0.4} ${topY - wave * 0.2} ${x + width * 0.52} ${topY + wave * 0.08}`,
    `C ${x + width * 0.64} ${topY + wave * 0.42} ${x + width * 0.8} ${topY - wave * 1.05} ${rightX} ${topY - wave * 0.55}`,
    `L ${rightX} ${bottomY - wave * 0.28}`,
    `C ${rightX - width * 0.18} ${bottomY + wave * 0.95} ${rightX - width * 0.42} ${bottomY - wave * 0.35} ${rightX - width * 0.56} ${bottomY + wave * 0.12}`,
    `C ${rightX - width * 0.72} ${bottomY + wave * 0.48} ${x + width * 0.14} ${bottomY - wave * 1.02} ${x} ${bottomY + wave * 0.68}`,
    'Z',
  ].join(' ');
}

function buildSellCornerAccent(
  cornerX: number,
  cornerY: number,
  radius: number,
  corner: 'tl' | 'tr' | 'bl' | 'br',
): string {
  switch (corner) {
    case 'tl':
      return `M ${cornerX} ${cornerY} H ${cornerX + radius} A ${radius} ${radius} 0 0 1 ${cornerX} ${cornerY + radius} Z`;
    case 'tr':
      return `M ${cornerX} ${cornerY} V ${cornerY + radius} A ${radius} ${radius} 0 0 1 ${cornerX - radius} ${cornerY} Z`;
    case 'bl':
      return `M ${cornerX} ${cornerY} V ${cornerY - radius} A ${radius} ${radius} 0 0 1 ${cornerX + radius} ${cornerY} Z`;
    case 'br':
      return `M ${cornerX} ${cornerY} H ${cornerX - radius} A ${radius} ${radius} 0 0 1 ${cornerX} ${cornerY - radius} Z`;
  }
}

export function SellTabIcon({ color, size = ICON_SIZE }: TabBarIconProps) {
  const isInactive = color.toUpperCase() === INACTIVE_TAB_COLOR;
  const backFill = isInactive ? INACTIVE_BACK_POLYGON_COLOR : ACTIVE_DISCOVER_INNER_COLOR;
  const backFillDeep = isInactive ? '#E5E5E5' : '#CCE5FF';
  const accentFill = isInactive ? INACTIVE_BACK_POLYGON_COLOR : ACTIVE_DISCOVER_INNER_COLOR;

  const noteX = SELL_NOTE_X;
  const noteY = SELL_NOTE_Y;
  const noteW = SELL_NOTE_WIDTH;
  const noteH = SELL_NOTE_HEIGHT;
  const wave = SELL_WAVE_AMPLITUDE;
  const cornerR = SELL_CORNER_RADIUS;
  const centerX = noteX + noteW / 2;
  const centerY = noteY + noteH / 2;
  const centerR = SELL_CENTER_RADIUS;
  const noteOutlineScale = 1 + (TICKET_OUTLINE_WIDTH * 2) / Math.min(noteW, noteH);

  const frontNotePath = buildSellFrontNotePath(noteX, noteY, noteW, noteH, wave);
  const backNotePath = buildSellBackNotePath(noteX, noteY - 1.875, noteW, noteH - 0.35, wave);
  const backDeepNotePath = buildSellBackNotePath(
    noteX,
    noteY - 2.625,
    noteW,
    noteH - 0.55,
    wave * 1.05,
  );

  const topY = noteY;
  const bottomY = noteY + noteH;
  const leftX = noteX;
  const rightX = noteX + noteW;

  const backPivotX = centerX;
  const backPivotY = centerY - 1.7;

  return (
    <Svg width={size} height={size} viewBox="0 0 26 26" fill="none">
      <G transform={`translate(0, ${SELL_BACK_OFFSET_Y})`}>
        <G transform={`rotate(${SELL_BACK_ROTATION}, ${backPivotX}, ${backPivotY})`}>
          <Path d={backDeepNotePath} fill={backFillDeep} />
          <Path d={backNotePath} fill={backFill} />
        </G>
      </G>

      <G
        transform={`translate(${centerX}, ${centerY}) scale(${noteOutlineScale}) translate(${-centerX}, ${-centerY})`}
      >
        <Path d={frontNotePath} fill="#FFFFFF" />
      </G>
      <Path d={frontNotePath} fill={color} />

      <Path d={buildSellCornerAccent(leftX + 0.35, topY + wave, cornerR, 'tl')} fill={accentFill} />
      <Path
        d={buildSellCornerAccent(rightX - 0.35, topY - wave, cornerR, 'tr')}
        fill={accentFill}
      />
      <Path
        d={buildSellCornerAccent(leftX + 0.35, bottomY + wave, cornerR, 'bl')}
        fill={accentFill}
      />
      <Path
        d={buildSellCornerAccent(rightX - 0.35, bottomY - wave, cornerR, 'br')}
        fill={accentFill}
      />

      <Circle cx={centerX} cy={centerY} r={centerR} fill="#FFFFFF" />
    </Svg>
  );
}

const ACCOUNT_ACTIVE_FILL = '#1E4CD6';
const ACCOUNT_CX = 13;
const ACCOUNT_CY = 13;
const ACCOUNT_R = 8.85;
const ACCOUNT_HEAD_R = 2.85;
const ACCOUNT_HEAD_CY = 10.75;
const ACCOUNT_CLIP_ID = 'account-tab-icon-clip';

/** Cut-off hexagon body: flat top, 45° shoulders, vertical sides. */
const ACCOUNT_BODY_PATH =
  'M 8.64 15.35 L 17.36 15.35 L 19.6 17.6 L 19.6 21.4 L 6.4 21.4 L 6.4 17.6 Z';
const ACCOUNT_BODY_OUTLINE_PATH =
  'M 6.4 18.9 L 6.4 17.6 L 8.64 15.35 L 17.36 15.35 L 19.6 17.6 L 19.6 18.9';

export function MyAccountTabIcon({ size = ICON_SIZE, focused = false }: TabBarIconProps) {
  if (focused) {
    return (
      <Svg width={size} height={size} viewBox="0 0 26 26" fill="none">
        <Defs>
          <ClipPath id={ACCOUNT_CLIP_ID}>
            <Circle cx={ACCOUNT_CX} cy={ACCOUNT_CY} r={ACCOUNT_R} />
          </ClipPath>
        </Defs>
        <Circle cx={ACCOUNT_CX} cy={ACCOUNT_CY} r={ACCOUNT_R} fill={ACCOUNT_ACTIVE_FILL} />
        <G clipPath={`url(#${ACCOUNT_CLIP_ID})`}>
          <Circle cx={ACCOUNT_CX} cy={ACCOUNT_HEAD_CY} r={ACCOUNT_HEAD_R} fill="#FFFFFF" />
          <Path d={ACCOUNT_BODY_PATH} fill="#FFFFFF" />
        </G>
      </Svg>
    );
  }

  return (
    <Svg width={size} height={size} viewBox="0 0 26 26" fill="none">
      <Circle
        cx={ACCOUNT_CX}
        cy={ACCOUNT_CY}
        r={ACCOUNT_R}
        stroke="#FFFFFF"
        strokeWidth={1.3}
        fill="none"
      />
      <Circle
        cx={ACCOUNT_CX}
        cy={ACCOUNT_HEAD_CY}
        r={ACCOUNT_HEAD_R}
        stroke="#FFFFFF"
        strokeWidth={1.3}
        fill="none"
      />
      <Path
        d={ACCOUNT_BODY_OUTLINE_PATH}
        stroke="#FFFFFF"
        strokeWidth={1.3}
        fill="none"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </Svg>
  );
}
