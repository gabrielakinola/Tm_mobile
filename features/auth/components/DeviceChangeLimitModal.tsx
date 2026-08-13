import { Pressable, Modal as RNModal, View } from 'react-native';
import { ShieldAlert, X } from 'lucide-react-native';
import { Typography } from '@/components/ui';
import { hapticLight } from '@/lib/haptics';
import { colors, radius, spacing } from '@/theme/tokens';

export interface DeviceChangeLimitModalProps {
  visible: boolean;
  message?: string | null;
  onClose: () => void;
}

export function DeviceChangeLimitModal({ visible, message, onClose }: DeviceChangeLimitModalProps) {
  const handleClose = () => {
    void hapticLight();
    onClose();
  };

  return (
    <RNModal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <Pressable
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.55)',
          justifyContent: 'center',
          padding: spacing.lg,
        }}
        onPress={handleClose}
      >
        <Pressable
          style={{
            backgroundColor: colors.neutral[0],
            borderRadius: radius.xl,
            padding: spacing.xl,
            borderWidth: 1,
            borderColor: colors.neutral[200],
            gap: spacing.lg,
          }}
          onPress={(event) => event.stopPropagation()}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
            }}
          >
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: radius.full,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colors.warning[500],
              }}
            >
              <ShieldAlert size={26} color={colors.white} strokeWidth={2.4} />
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close"
              hitSlop={8}
              onPress={handleClose}
              style={{
                width: 32,
                height: 32,
                borderRadius: radius.full,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colors.neutral[100],
              }}
            >
              <X size={18} color={colors.neutral[700]} strokeWidth={2.2} />
            </Pressable>
          </View>

          <View style={{ gap: spacing.sm }}>
            <Typography
              style={{
                color: colors.neutral[950],
                fontSize: 22,
                fontWeight: '700',
                lineHeight: 28,
              }}
            >
              Device change unavailable
            </Typography>
            <Typography style={{ color: colors.neutral[600], fontSize: 15, lineHeight: 22 }}>
              {message?.trim() ||
                'You have already changed devices once during this subscription period. You can switch devices again after your next subscription renewal.'}
            </Typography>
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={handleClose}
            style={{
              minHeight: 48,
              borderRadius: radius.lg,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: colors.neutral[900],
            }}
          >
            <Typography style={{ color: colors.white, fontSize: 15, fontWeight: '700' }}>
              Got it
            </Typography>
          </Pressable>
        </Pressable>
      </Pressable>
    </RNModal>
  );
}
