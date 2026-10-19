import { View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { Typography } from '@/components/ui';
import type { CodeType } from '@/services/events/types';
import { spacing } from '@/theme/tokens';

const BANNER_BG = '#1A1A1A';
const ICON_SIZE = 44;

export function TicketCodeLockedBanner({
  codeType,
  message,
}: {
  codeType: CodeType;
  message: string;
}) {
  return (
    <View
      style={{
        marginHorizontal: 10,
        alignSelf: 'stretch',
        backgroundColor: BANNER_BG,
        borderRadius: 4,
        paddingVertical: 10,
        paddingLeft: spacing.md,
        paddingRight: spacing.sm,
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
      }}
    >
      <Typography
        style={{
          flex: 1,
          color: '#FFFFFF',
          fontSize: 14,
          lineHeight: 19,
          fontWeight: '500',
        }}
      >
        {message}
      </Typography>
      {codeType === 'barcode' ? <LockedBarcodeIcon /> : <LockedQrIcon />}
    </View>
  );
}

function LockedQrIcon() {
  return (
    <Svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 44 44" fill="none">
      <Rect x={1.5} y={1.5} width={12} height={12} stroke="#FFFFFF" strokeWidth={1.7} />
      <Rect x={4.4} y={4.4} width={6.2} height={6.2} fill="#FFFFFF" />
      <Rect x={30.5} y={1.5} width={12} height={12} stroke="#FFFFFF" strokeWidth={1.7} />
      <Rect x={33.4} y={4.4} width={6.2} height={6.2} fill="#FFFFFF" />
      <Rect x={1.5} y={30.5} width={12} height={12} stroke="#FFFFFF" strokeWidth={1.7} />
      <Rect x={4.4} y={33.4} width={6.2} height={6.2} fill="#FFFFFF" />
      <Rect x={17} y={1.5} width={3.2} height={3.2} fill="#FFFFFF" />
      <Rect x={22} y={4.8} width={3.2} height={3.2} fill="#FFFFFF" />
      <Rect x={17} y={8.2} width={3.2} height={3.2} fill="#FFFFFF" />
      <Rect x={39.2} y={17} width={3.2} height={7.4} fill="#FFFFFF" />
      <Rect x={34.4} y={17} width={3.2} height={3.2} fill="#FFFFFF" />
      <Rect x={30.5} y={21.6} width={7.2} height={3.2} fill="#FFFFFF" />
      <Rect x={17} y={39.2} width={7.4} height={3.2} fill="#FFFFFF" />
      <Rect x={26.2} y={34.6} width={3.2} height={7.8} fill="#FFFFFF" />
      <Rect x={30.5} y={39.2} width={6.4} height={3.2} fill="#FFFFFF" />
      <Rect x={39.2} y={30.5} width={3.2} height={12} fill="#FFFFFF" />
      <CodeDimOverlay />
      <LockGlyph />
    </Svg>
  );
}

function LockedBarcodeIcon() {
  return (
    <Svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 44 44" fill="none">
      <Rect x={3} y={8} width={2.4} height={28} fill="#FFFFFF" />
      <Rect x={8} y={8} width={2.4} height={28} fill="#FFFFFF" />
      <Rect x={13.2} y={8} width={1.6} height={28} fill="#FFFFFF" />
      <Rect x={17.4} y={8} width={2.8} height={28} fill="#FFFFFF" />
      <Rect x={23.8} y={8} width={1.6} height={28} fill="#FFFFFF" />
      <Rect x={28} y={8} width={2.4} height={28} fill="#FFFFFF" />
      <Rect x={33.2} y={8} width={1.6} height={28} fill="#FFFFFF" />
      <Rect x={38} y={8} width={2.8} height={28} fill="#FFFFFF" />
      <CodeDimOverlay />
      <LockGlyph />
    </Svg>
  );
}

function CodeDimOverlay() {
  return <Rect x={0} y={0} width={44} height={44} fill="#000000" opacity={0.58} />;
}

function LockGlyph() {
  return (
    <>
      <Path
        d="M16.4 20.2V17.6C16.4 14.5 18.9 12 22 12C25.1 12 27.6 14.5 27.6 17.6V20.2"
        stroke="#FFFFFF"
        strokeWidth={2.1}
        strokeLinecap="round"
      />
      <Rect
        x={14.2}
        y={19.6}
        width={15.6}
        height={13.4}
        rx={2.2}
        fill={BANNER_BG}
        stroke="#FFFFFF"
        strokeWidth={1.8}
      />
      <Circle cx={22} cy={25.4} r={1.55} fill="#FFFFFF" />
      <Path d="M22 26.8V29.4" stroke="#FFFFFF" strokeWidth={1.7} strokeLinecap="round" />
    </>
  );
}
