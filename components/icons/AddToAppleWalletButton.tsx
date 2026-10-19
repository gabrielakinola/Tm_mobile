import { Pressable, View } from 'react-native';
import Svg, { Circle, ClipPath, Defs, G, Rect } from 'react-native-svg';
import { Typography } from '@/components/ui';
import { hapticLight } from '@/lib/haptics';
import { radius } from '@/theme/tokens';

export interface AddToAppleWalletButtonProps {
  onPress?: () => void;
}

function AppleWalletGlyph({ size = 34 }: { size?: number }) {
  const height = Math.round(size * 0.82);

  return (
    <Svg width={size} height={height} viewBox="0 0 36 30" accessible={false}>
      <Defs>
        <ClipPath id="apple-wallet-body">
          <Rect x="1" y="1" width="34" height="28" rx="6" />
        </ClipPath>
      </Defs>
      <G clipPath="url(#apple-wallet-body)">
        <Rect x="1" y="1" width="34" height="28" fill="#E6E1D4" />
        <Rect x="1" y="1" width="34" height="4.6" fill="#6BA9B6" />
        <Rect x="1" y="5.6" width="34" height="4.6" fill="#E8C44A" />
        <Rect x="1" y="10.2" width="34" height="4.6" fill="#E07A48" />
        <Rect x="1" y="14.8" width="34" height="4.6" fill="#73A84C" />
        <Circle cx="18" cy="29" r="7.2" fill="#E6E1D4" />
      </G>
    </Svg>
  );
}

export function AddToAppleWalletButton({ onPress }: AddToAppleWalletButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Add to Apple Wallet"
      onPress={() => {
        void hapticLight();
        onPress?.();
      }}
      style={{
        height: 44,
        paddingHorizontal: 12,
        borderRadius: radius.md,
        backgroundColor: '#000000',
        borderWidth: 1,
        borderColor: '#3A3A3C',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
      }}
    >
      <AppleWalletGlyph />
      <View>
        <Typography
          style={{
            color: '#FFFFFF',
            fontSize: 11,
            lineHeight: 13,
            fontWeight: '500',
          }}
        >
          Add to
        </Typography>
        <Typography
          style={{
            color: '#FFFFFF',
            fontSize: 14,
            lineHeight: 17,
            fontWeight: '700',
          }}
        >
          Apple Wallet
        </Typography>
      </View>
    </Pressable>
  );
}
