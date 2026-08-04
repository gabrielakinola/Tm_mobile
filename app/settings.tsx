import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ChevronLeft } from 'lucide-react-native';
import { Header, KeyboardAwareScrollView, Typography } from '@/components/ui';
import { FormCard, FormField } from '@/features/create-event/components/FormFields';
import { SettingsSavedModal } from '@/features/settings/components/SettingsSavedModal';
import { SettingsSectionTitle } from '@/features/settings/components/SettingsSectionTitle';
import { SettingsToggleRow } from '@/features/settings/components/SettingsToggleRow';
import {
  WalletLifetimeExplanation,
  WalletPassSection,
} from '@/features/settings/components/WalletPassSection';
import { settingsQueryKey } from '@/features/settings/settings-query-key';
import {
  getUserSettings,
  updateUserSettings,
  type UserSettingsResponse,
} from '@/services/settings/settings.api';
import { useAuthStore } from '@/stores/auth-store';
import { colors, radius, spacing } from '@/theme/tokens';

export { settingsQueryKey };

function getSettingsErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (typeof message === 'string') {
      return message;
    }
    if (Array.isArray(message) && typeof message[0] === 'string') {
      return message[0];
    }
  }

  return 'Unable to load settings. Please try again.';
}

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const authUser = useAuthStore((state) => state.user);

  const settingsQuery = useQuery({
    queryKey: settingsQueryKey,
    queryFn: getUserSettings,
  });

  const [enableWalletForTicketTransfers, setEnableWalletForTicketTransfers] = useState(false);
  const [enableTransferFeeInterruption, setEnableTransferFeeInterruption] = useState(false);
  const [transferFeePerTicket, setTransferFeePerTicket] = useState('');
  const [enableMinTicketsInterruption, setEnableMinTicketsInterruption] = useState(false);
  const [minTicketsPerTransfer, setMinTicketsPerTransfer] = useState('');
  const [enableTransferAcceptanceAuthorization, setEnableTransferAcceptanceAuthorization] =
    useState(false);
  const [savedModalVisible, setSavedModalVisible] = useState(false);

  useEffect(() => {
    if (!settingsQuery.data) {
      return;
    }

    setEnableWalletForTicketTransfers(settingsQuery.data.enableWalletForTicketTransfers);
    setEnableTransferFeeInterruption(settingsQuery.data.enableTransferFeeInterruption);
    setTransferFeePerTicket(settingsQuery.data.transferFeePerTicket);
    setEnableMinTicketsInterruption(settingsQuery.data.enableMinTicketsInterruption);
    setMinTicketsPerTransfer(settingsQuery.data.minTicketsPerTransfer);
    setEnableTransferAcceptanceAuthorization(
      settingsQuery.data.enableTransferAcceptanceAuthorization,
    );
  }, [settingsQuery.data]);

  const saveMutation = useMutation({
    mutationFn: () =>
      updateUserSettings({
        enableWalletForTicketTransfers,
        enableTransferFeeInterruption,
        transferFeePerTicket: enableTransferFeeInterruption ? transferFeePerTicket.trim() : '',
        enableMinTicketsInterruption,
        minTicketsPerTransfer: enableMinTicketsInterruption ? minTicketsPerTransfer.trim() : '',
        enableTransferAcceptanceAuthorization,
      }),
    onSuccess: (response) => {
      queryClient.setQueryData<UserSettingsResponse>(settingsQueryKey, response);
      setSavedModalVisible(true);
    },
  });

  const loadError = settingsQuery.error ? getSettingsErrorMessage(settingsQuery.error) : null;
  const saveError = saveMutation.error ? getSettingsErrorMessage(saveMutation.error) : null;

  const unlimitedWalletPasses = settingsQuery.data?.unlimitedWalletPasses ?? false;
  const walletPassesRemaining = settingsQuery.data?.walletPassesRemaining ?? 0;
  const isLifetimeAccess = authUser?.accessType === 'LIFETIME';

  if (settingsQuery.isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.neutral[100], justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={colors.pulse[600]} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.neutral[100] }}>
      <Header
        title="Settings"
        leftAction={
          <Pressable
            accessibilityRole="button"
            onPress={() => router.back()}
            hitSlop={8}
            style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}
          >
            <ChevronLeft size={24} color={colors.white} strokeWidth={2.2} />
          </Pressable>
        }
      />

      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          padding: spacing.lg,
          paddingBottom: spacing['3xl'] + insets.bottom,
          gap: spacing.lg,
        }}
      >
        {loadError ? (
          <Typography style={{ color: colors.error[500], fontSize: 14, fontWeight: '600' }}>
            {loadError}
          </Typography>
        ) : null}

        <FormCard>
          <SettingsSectionTitle>Wallet</SettingsSectionTitle>

          <SettingsToggleRow
            label="Enable wallet for ticket transfers"
            description={
              isLifetimeAccess
                ? 'Allow recipients to add accepted tickets to Apple Wallet or Google Wallet on the acceptance website.'
                : 'Purchase wallet pass credits for recipients on the acceptance website.'
            }
            value={enableWalletForTicketTransfers}
            onValueChange={setEnableWalletForTicketTransfers}
          />

          {enableWalletForTicketTransfers && isLifetimeAccess ? (
            <View style={{ marginTop: spacing.sm }}>
              <WalletLifetimeExplanation />
            </View>
          ) : null}

          {enableWalletForTicketTransfers && !isLifetimeAccess ? (
            <View style={{ gap: spacing.lg, marginTop: spacing.sm }}>
              <WalletPassSection
                accountCreatedAt={authUser?.createdAt ?? new Date(0).toISOString()}
                walletPassesRemaining={walletPassesRemaining}
                unlimitedWalletPasses={unlimitedWalletPasses}
                onPurchaseSuccess={async () => {
                  await queryClient.invalidateQueries({ queryKey: settingsQueryKey });
                }}
              />
            </View>
          ) : null}
        </FormCard>

        <FormCard>
          <SettingsSectionTitle>Transfer</SettingsSectionTitle>

          <SettingsToggleRow
            label="Enable transfer fee interruption screen"
            value={enableTransferFeeInterruption}
            onValueChange={setEnableTransferFeeInterruption}
          />

          {enableTransferFeeInterruption ? (
            <FormField
              label="Transfer fee per ticket"
              value={transferFeePerTicket}
              onChangeText={setTransferFeePerTicket}
              placeholder="110.10"
              keyboardType="decimal-pad"
            />
          ) : null}

          <SettingsToggleRow
            label="Enable minimum tickets per transfer interruption"
            value={enableMinTicketsInterruption}
            onValueChange={setEnableMinTicketsInterruption}
          />

          {enableMinTicketsInterruption ? (
            <FormField
              label="Minimum tickets per transfer"
              value={minTicketsPerTransfer}
              onChangeText={setMinTicketsPerTransfer}
              placeholder="2"
              keyboardType="number-pad"
              hint="Show interruption when fewer than this many tickets are selected."
            />
          ) : null}

          <SettingsToggleRow
            label="Authorize transfer acceptance"
            description="Recipients must wait for you to authorize before they can accept tickets on the web."
            value={enableTransferAcceptanceAuthorization}
            onValueChange={setEnableTransferAcceptanceAuthorization}
          />
        </FormCard>

        {saveError ? (
          <Typography style={{ color: colors.error[500], fontSize: 14, fontWeight: '600' }}>
            {saveError}
          </Typography>
        ) : null}

        <Pressable
          accessibilityRole="button"
          disabled={saveMutation.isPending || Boolean(loadError)}
          onPress={() => saveMutation.mutate()}
          style={{
            minHeight: 48,
            borderRadius: radius.md,
            backgroundColor: colors.pulse[600],
            alignItems: 'center',
            justifyContent: 'center',
            opacity: saveMutation.isPending || loadError ? 0.7 : 1,
          }}
        >
          {saveMutation.isPending ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Typography style={{ color: colors.white, fontSize: 15, fontWeight: '700' }}>
              Save
            </Typography>
          )}
        </Pressable>
      </KeyboardAwareScrollView>

      <SettingsSavedModal
        visible={savedModalVisible}
        onClose={() => {
          setSavedModalVisible(false);
          router.back();
        }}
      />
    </View>
  );
}
