import { Pressable, Modal as RNModal, View } from 'react-native';
import { RefreshCw, X } from 'lucide-react-native';
import { Typography } from '@/components/ui';
import { hapticLight } from '@/lib/haptics';
import { colors, radius, spacing } from '@/theme/tokens';

interface AltStoreRefreshConfirmModalProps {
  visible: boolean;
  confirming?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function AltStoreRefreshConfirmModal({
  visible,
  confirming = false,
  onClose,
  onConfirm,
}: AltStoreRefreshConfirmModalProps) {
  const handleClose = () => {
    if (confirming) return;
    void hapticLight();
    onClose();
  };

  const handleConfirm = () => {
    if (confirming) return;
    void hapticLight();
    onConfirm();
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
                backgroundColor: colors.pulse[600],
              }}
            >
              <RefreshCw size={26} color={colors.white} strokeWidth={2.4} />
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close"
              hitSlop={8}
              disabled={confirming}
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
              Confirm AltStore refresh
            </Typography>
            <Typography style={{ color: colors.neutral[600], fontSize: 15, lineHeight: 22 }}>
              Have you refreshed the Ticketmaster app in AltStore? Confirming resets the 7-day
              refresh countdown on this device.
            </Typography>
          </View>

          <View style={{ flexDirection: 'row', gap: spacing.md }}>
            <Pressable
              accessibilityRole="button"
              disabled={confirming}
              onPress={handleClose}
              style={{
                flex: 1,
                minHeight: 48,
                borderRadius: radius.lg,
                borderWidth: 1,
                borderColor: colors.neutral[300],
                alignItems: 'center',
                justifyContent: 'center',
                opacity: confirming ? 0.6 : 1,
              }}
            >
              <Typography style={{ color: colors.neutral[800], fontSize: 15, fontWeight: '600' }}>
                Not yet
              </Typography>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              disabled={confirming}
              onPress={handleConfirm}
              style={{
                flex: 1,
                minHeight: 48,
                borderRadius: radius.lg,
                backgroundColor: colors.pulse[600],
                alignItems: 'center',
                justifyContent: 'center',
                opacity: confirming ? 0.75 : 1,
              }}
            >
              <Typography style={{ color: colors.white, fontSize: 15, fontWeight: '700' }}>
                Yes, I refreshed
              </Typography>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </RNModal>
  );
}
