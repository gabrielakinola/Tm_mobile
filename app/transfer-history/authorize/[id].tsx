import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import { ErrorState, Header, LoadingState, Typography } from '@/components/ui';
import { TransferConfirmModal } from '@/features/transfer-history/components/TransferConfirmModal';
import {
  useAuthorizeTransferAcceptance,
  useTransferDetail,
} from '@/hooks/transfers/useTransferHistory';
import { colors, radius, spacing } from '@/theme/tokens';

const TM_BLUE = '#004B8D';

export default function AuthorizeTransferScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const transferId = typeof id === 'string' ? id : undefined;
  const query = useTransferDetail(transferId);
  const authorizeMutation = useAuthorizeTransferAcceptance();
  const [confirmVisible, setConfirmVisible] = useState(false);
  const transfer = query.data;

  const closeHeaderAction = (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Close"
      onPress={() => router.back()}
      hitSlop={8}
      style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}
    >
      <X size={24} color={colors.white} strokeWidth={2.2} />
    </Pressable>
  );

  const handleAuthorize = () => {
    if (!transferId) return;
    authorizeMutation.mutate(transferId, {
      onSuccess: () => {
        setConfirmVisible(false);
        router.replace(`/transfer-history/${transferId}`);
      },
    });
  };

  if (query.isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.neutral[100] }}>
        <Header title="Transfer Authorization" leftAction={closeHeaderAction} />
        <LoadingState message="Loading transfer…" />
      </View>
    );
  }

  if (query.isError || !transfer) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.neutral[100] }}>
        <Header title="Transfer Authorization" leftAction={closeHeaderAction} />
        <ErrorState
          title="Transfer not found"
          message="This transfer may have been removed or is unavailable."
          onRetry={() => void query.refetch()}
        />
      </View>
    );
  }

  if (!transfer.pendingSenderAuthorization) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.neutral[100] }}>
        <Header title="Transfer Authorization" leftAction={closeHeaderAction} />
        <View style={{ padding: spacing.lg }}>
          <Typography style={{ fontSize: 16, color: colors.neutral[700] }}>
            This transfer no longer requires authorization.
          </Typography>
        </View>
      </View>
    );
  }

  const recipientFirstName = transfer.recipient.firstName.trim() || 'The recipient';

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <Header title="Transfer Authorization" leftAction={closeHeaderAction} />

      <View
        style={{
          flex: 1,
          paddingHorizontal: spacing.xl,
          paddingTop: spacing['2xl'],
          alignItems: 'center',
        }}
      >
        <Typography
          style={{
            color: TM_BLUE,
            fontSize: 22,
            fontWeight: '800',
            letterSpacing: 0.5,
            textAlign: 'center',
            textTransform: 'uppercase',
          }}
        >
          Authorize transfer
        </Typography>

        <Typography
          style={{
            marginTop: spacing.lg,
            fontSize: 16,
            lineHeight: 22,
            color: colors.neutral[900],
            textAlign: 'center',
          }}
        >
          Authorize the ticket(s) transfer to the email below.
        </Typography>

        <Typography
          style={{
            marginTop: spacing.lg,
            fontSize: 18,
            fontWeight: '800',
            color: TM_BLUE,
            textAlign: 'center',
          }}
        >
          {transfer.recipient.email}
        </Typography>

        <Typography
          style={{
            marginTop: spacing.xl,
            fontSize: 15,
            lineHeight: 22,
            color: colors.neutral[800],
            textAlign: 'center',
          }}
        >
          Once authorized, {recipientFirstName} will be able to accept these tickets.
        </Typography>
      </View>

      <View
        style={{
          paddingHorizontal: spacing.lg,
          paddingBottom: spacing.lg + insets.bottom,
        }}
      >
        {authorizeMutation.isError ? (
          <Typography
            style={{
              marginBottom: spacing.sm,
              color: colors.error[500],
              fontSize: 14,
              fontWeight: '600',
              textAlign: 'center',
            }}
          >
            Unable to authorize this transfer. Please try again.
          </Typography>
        ) : null}

        <Pressable
          accessibilityRole="button"
          disabled={authorizeMutation.isPending}
          onPress={() => setConfirmVisible(true)}
          style={{
            minHeight: 52,
            borderRadius: radius.md,
            backgroundColor: TM_BLUE,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: authorizeMutation.isPending ? 0.7 : 1,
          }}
        >
          <Typography style={{ color: colors.white, fontSize: 17, fontWeight: '700' }}>
            Continue
          </Typography>
        </Pressable>
      </View>

      <TransferConfirmModal
        visible={confirmVisible}
        variant="default"
        title="Authorize transfer?"
        message="Once you confirm, the recipient can sign in and accept these tickets. This cannot be undone."
        confirmLabel="Confirm"
        loading={authorizeMutation.isPending}
        onClose={() => {
          if (!authorizeMutation.isPending) setConfirmVisible(false);
        }}
        onConfirm={handleAuthorize}
      />
    </View>
  );
}
