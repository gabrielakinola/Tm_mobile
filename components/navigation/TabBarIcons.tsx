import Svg, { Circle, G, Line, Path, Polygon, Rect } from 'react-native-svg';

const ICON_SIZE = 26;

const FOR_YOU_POLYGON_POINTS =
  '18.73 3.91 8.16 12.15 8.16 27.85 31.01 48.53 55.42 28.94 55.42 12.46 44.69 3.91 31.79 13.09 19.51 3.91 18.73 3.91';

const INACTIVE_TAB_COLOR = '#9B9B9B';
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
const TICKET_FRONT_ROTATION = -36;
const TICKET_BACK_ROTATION = -64;
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

function TicketPerforationLines() {
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
        stroke="#FFFFFF"
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
  opacity?: number;
  detailed?: boolean;
  outlined?: boolean;
  perforated?: boolean;
}

function TicketShape({
  fill,
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
      {showPerforation ? <TicketPerforationLines /> : null}
      {detailed ? (
        <>
          <Rect
            x={TICKET_DETAIL_TOP_X}
            y={TICKET_DETAIL_TOP_Y}
            width={TICKET_DETAIL_TOP_RENDER_WIDTH}
            height={TICKET_DETAIL_HEIGHT}
            rx={0.2}
            fill="#FFFFFF"
            opacity={0.95}
          />
          <Rect
            x={TICKET_DETAIL_BOTTOM_X}
            y={TICKET_DETAIL_BOTTOM_Y}
            width={TICKET_DETAIL_BOTTOM_WIDTH}
            height={TICKET_DETAIL_HEIGHT}
            rx={0.2}
            fill="#FFFFFF"
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

export function MyTicketsTabIcon({ color, size = ICON_SIZE }: TabBarIconProps) {
  const isInactive = color.toUpperCase() === INACTIVE_TAB_COLOR;
  const backFill = isInactive ? INACTIVE_BACK_POLYGON_COLOR : color;
  const backOpacity = isInactive ? 1 : 0.42;

  return (
    <Svg width={size} height={size} viewBox="0 0 26 26" fill="none">
      <G
        transform={`translate(12.2, 10) rotate(${TICKET_BACK_ROTATION}) translate(${-TICKET_CENTER_X - 1.2}, ${-TICKET_CENTER_Y - 2.6})`}
      >
        <TicketShape fill={backFill} opacity={backOpacity} perforated />
      </G>
      <G
        transform={`translate(13, 13.25) rotate(${TICKET_FRONT_ROTATION}) translate(${-TICKET_CENTER_X}, ${-TICKET_CENTER_Y})`}
      >
        <TicketShape fill={color} detailed outlined />
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

const ACCOUNT_DISC_CENTER = 13;
const ACCOUNT_DISC_RADIUS = 9.5;
const ACCOUNT_HEAD_RADIUS = 2.45;
const ACCOUNT_HEAD_CY = 10.1;
const ACCOUNT_SHOULDER_RADIUS = 6.85;
const ACCOUNT_SHOULDER_CY = 21.15;

export function MyAccountTabIcon({ color, size = ICON_SIZE }: TabBarIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 26 26" fill="none">
      <Circle
        cx={ACCOUNT_DISC_CENTER}
        cy={ACCOUNT_DISC_CENTER}
        r={ACCOUNT_DISC_RADIUS}
        fill={color}
      />
      <Circle
        cx={ACCOUNT_DISC_CENTER}
        cy={ACCOUNT_HEAD_CY}
        r={ACCOUNT_HEAD_RADIUS}
        fill="#FFFFFF"
      />
      <Circle
        cx={ACCOUNT_DISC_CENTER}
        cy={ACCOUNT_SHOULDER_CY}
        r={ACCOUNT_SHOULDER_RADIUS}
        fill="#FFFFFF"
      />
    </Svg>
  );
}
