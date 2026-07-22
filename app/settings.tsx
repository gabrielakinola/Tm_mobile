import { useState } from 'react';
import { Alert, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, Wallet } from 'lucide-react-native';
import { Header, KeyboardAwareScrollView, Typography } from '@/components/ui';
import { FormCard, FormField } from '@/features/create-event/components/FormFields';
import { LayoutPicker } from '@/features/settings/components/LayoutPicker';
import { SettingsSectionTitle } from '@/features/settings/components/SettingsSectionTitle';
import { SettingsToggleRow } from '@/features/settings/components/SettingsToggleRow';
import { WalletPassSection } from '@/features/settings/components/WalletPassSection';
import { useSettingsStore } from '@/stores/settings-store';
import { colors, radius, spacing } from '@/theme/tokens';

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const settings = useSettingsStore();

  const [ticketLayout, setTicketLayout] = useState(settings.ticketLayout);
  const [walletPassesRemaining, setWalletPassesRemaining] = useState(
    settings.walletPassesRemaining,
  );
  const [enableAppleWalletTransfers, setEnableAppleWalletTransfers] = useState(
    settings.enableAppleWalletTransfers,
  );
  const [useGoogleWalletBadge, setUseGoogleWalletBadge] = useState(settings.useGoogleWalletBadge);
  const [showTransferAccepted, setShowTransferAccepted] = useState(settings.showTransferAccepted);
  const [acceptedByName, setAcceptedByName] = useState(settings.acceptedByName);
  const [enableTransferFeeInterruption, setEnableTransferFeeInterruption] = useState(
    settings.enableTransferFeeInterruption,
  );
  const [transferFeeAmount, setTransferFeeAmount] = useState(settings.transferFeeAmount);
  const [enableMaxTicketsInterruption, setEnableMaxTicketsInterruption] = useState(
    settings.enableMaxTicketsInterruption,
  );
  const [maxTicketsThreshold, setMaxTicketsThreshold] = useState(settings.maxTicketsThreshold);

  const handleTransferFeeToggle = (value: boolean) => {
    setEnableTransferFeeInterruption(value);
    if (value) {
      setEnableMaxTicketsInterruption(false);
    }
  };

  const handleMaxTicketsToggle = (value: boolean) => {
    setEnableMaxTicketsInterruption(value);
    if (value) {
      setEnableTransferFeeInterruption(false);
    }
  };

  const handleWalletPurchase = (quantity: number) => {
    settings.addWalletPasses(quantity);
    setWalletPassesRemaining((current) => current + quantity);
  };

  const handleSave = () => {
    settings.updateSettings({
      ticketLayout,
      walletPassesRemaining,
      enableAppleWalletTransfers,
      useGoogleWalletBadge,
      showTransferAccepted,
      acceptedByName,
      enableTransferFeeInterruption,
      transferFeeAmount,
      enableMaxTicketsInterruption,
      maxTicketsThreshold,
    });

    Alert.alert('Settings saved', 'Your settings have been updated.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

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
        <FormCard>
          <SettingsSectionTitle>App layout</SettingsSectionTitle>
          <LayoutPicker value={ticketLayout} onChange={setTicketLayout} />
        </FormCard>

        <FormCard>
          <SettingsSectionTitle>Apple Wallet</SettingsSectionTitle>
          <WalletPassSection
            walletPassesRemaining={walletPassesRemaining}
            onPurchase={handleWalletPurchase}
          />

          <SettingsToggleRow
            label="Enable Apple Wallet for ticket transfers"
            description="Buy wallet pass credits to enable Apple Wallet for recipients."
            value={enableAppleWalletTransfers}
            onValueChange={setEnableAppleWalletTransfers}
          />

          <SettingsToggleRow
            label="Use Google Wallet badge"
            value={useGoogleWalletBadge}
            onValueChange={setUseGoogleWalletBadge}
            leftIcon={<Wallet size={18} color={colors.neutral[600]} />}
          />
        </FormCard>

        <FormCard>
          <SettingsSectionTitle>Ticket details</SettingsSectionTitle>

          <SettingsToggleRow
            label="Show transfer accepted on ticket cards"
            value={showTransferAccepted}
            onValueChange={setShowTransferAccepted}
          />

          <FormField
            label="Accepted by (name shown on ticket)"
            value={acceptedByName}
            onChangeText={setAcceptedByName}
            placeholder="Mary Flores"
            autoCapitalize="words"
          />
        </FormCard>

        <FormCard>
          <SettingsSectionTitle>Transfer</SettingsSectionTitle>

          <SettingsToggleRow
            label="Enable transfer fee interruption screen"
            value={enableTransferFeeInterruption}
            onValueChange={handleTransferFeeToggle}
          />

          <FormField
            label="Transfer fee shown on interruption screen"
            value={transferFeeAmount}
            onChangeText={setTransferFeeAmount}
            placeholder="110.10"
            keyboardType="decimal-pad"
          />

          <SettingsToggleRow
            label="Enable maximum tickets per transfer interruption"
            value={enableMaxTicketsInterruption}
            onValueChange={handleMaxTicketsToggle}
          />

          <FormField
            label="Ticket count that should trigger interruption"
            value={maxTicketsThreshold}
            onChangeText={setMaxTicketsThreshold}
            placeholder="2"
            keyboardType="number-pad"
            hint="Show interruption when selected tickets are equal to or greater than this number. Only one interruption can be active at a time."
          />
        </FormCard>

        <Pressable
          accessibilityRole="button"
          onPress={handleSave}
          style={{
            minHeight: 48,
            borderRadius: radius.md,
            backgroundColor: colors.pulse[600],
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography style={{ color: colors.white, fontSize: 15, fontWeight: '700' }}>
            Save
          </Typography>
        </Pressable>
      </KeyboardAwareScrollView>
    </View>
  );
}
