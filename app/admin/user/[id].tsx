import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import {
  ConfirmModal,
  ErrorState,
  Header,
  LoadingState,
  Typography,
  useToast,
} from '@/components/ui';
import { useAdminUser, useDeleteAdminUser } from '@/hooks/admin/useAdminUsers';
import { colors, radius, spacing } from '@/theme/tokens';

function AccessTypeCapsule({ accessType }: { accessType: 'LIFETIME' | 'MONTHLY' }) {
  const isLifetime = accessType === 'LIFETIME';
  return (
    <View
      style={{
        alignSelf: 'flex-start',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs + 2,
        borderRadius: radius.full,
        backgroundColor: isLifetime ? colors.neutral[900] : colors.pulse[50],
        borderWidth: 1,
        borderColor: isLifetime ? colors.neutral[900] : colors.pulse[200],
      }}
    >
      <Typography
        style={{
          color: isLifetime ? colors.white : colors.pulse[700],
          fontSize: 12,
          fontWeight: '700',
          letterSpacing: 0.3,
        }}
      >
        {isLifetime ? 'Lifetime' : 'Monthly'}
      </Typography>
    </View>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ gap: spacing.xs }}>
      <Typography style={{ color: colors.neutral[500], fontSize: 12, fontWeight: '600' }}>
        {label}
      </Typography>
      <Typography style={{ color: colors.neutral[900], fontSize: 15, fontWeight: '600' }}>
        {value}
      </Typography>
    </View>
  );
}

function formatDate(value: string | null): string {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

export default function AdminUserDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { show } = useToast();
  const { id } = useLocalSearchParams<{ id: string }>();
  const userId = typeof id === 'string' ? id : undefined;
  const userQuery = useAdminUser(userId);
  const deleteMutation = useDeleteAdminUser();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const backAction = (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.back()}
      hitSlop={8}
      style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}
    >
      <ChevronLeft size={24} color={colors.white} strokeWidth={2.2} />
    </Pressable>
  );

  if (userQuery.isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.neutral[100] }}>
        <Header title="User details" leftAction={backAction} />
        <LoadingState message="Loading user…" />
      </View>
    );
  }

  if (userQuery.isError || !userQuery.data) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.neutral[100] }}>
        <Header title="User details" leftAction={backAction} />
        <ErrorState
          title="User not found"
          message="This account may have been removed."
          onRetry={() => void userQuery.refetch()}
        />
      </View>
    );
  }

  const user = userQuery.data;
  const profile = user.defaultProfile;

  return (
    <View style={{ flex: 1, backgroundColor: colors.neutral[100] }}>
      <Header title="User details" leftAction={backAction} />

      <ScrollView
        contentContainerStyle={{
          padding: spacing.lg,
          paddingBottom: spacing['3xl'] + insets.bottom,
          gap: spacing.lg,
        }}
      >
        <View
          style={{
            backgroundColor: colors.neutral[0],
            borderRadius: radius.xl,
            borderWidth: 1,
            borderColor: colors.neutral[200],
            padding: spacing.xl,
            gap: spacing.md,
          }}
        >
          <DetailRow label="Email" value={user.email} />
          <DetailRow label="Account name" value={user.accountName} />
          <View style={{ gap: spacing.xs }}>
            <Typography style={{ color: colors.neutral[500], fontSize: 12, fontWeight: '600' }}>
              Access type
            </Typography>
            <AccessTypeCapsule accessType={user.accessType} />
          </View>
          <DetailRow label="Subscription expires" value={formatDate(user.subscriptionExpiresAt)} />
          <DetailRow label="Created" value={formatDate(user.createdAt)} />
          <DetailRow label="Updated" value={formatDate(user.updatedAt)} />
        </View>

        <View
          style={{
            backgroundColor: colors.neutral[0],
            borderRadius: radius.xl,
            borderWidth: 1,
            borderColor: colors.neutral[200],
            padding: spacing.xl,
            gap: spacing.md,
          }}
        >
          <Typography style={{ color: colors.neutral[900], fontSize: 16, fontWeight: '700' }}>
            Default profile
          </Typography>
          {profile ? (
            <>
              <DetailRow
                label="Name"
                value={`${profile.firstName} ${profile.lastName}`.trim() || '—'}
              />
              <DetailRow label="Display email" value={profile.displayEmail || '—'} />
              <DetailRow label="City" value={profile.city || '—'} />
              <DetailRow label="Country" value={profile.country || '—'} />
            </>
          ) : (
            <Typography style={{ color: colors.neutral[500], fontSize: 14 }}>
              No default profile.
            </Typography>
          )}
        </View>

        <View
          style={{
            backgroundColor: colors.neutral[0],
            borderRadius: radius.xl,
            borderWidth: 1,
            borderColor: colors.neutral[200],
            padding: spacing.xl,
            gap: spacing.md,
          }}
        >
          <Typography style={{ color: colors.neutral[900], fontSize: 16, fontWeight: '700' }}>
            Settings
          </Typography>
          <DetailRow
            label="Wallet transfers"
            value={user.settings.enableWalletForTicketTransfers ? 'Enabled' : 'Disabled'}
          />
          <DetailRow
            label="Wallet passes remaining"
            value={
              user.settings.unlimitedWalletPasses
                ? 'Unlimited'
                : String(user.settings.walletPassesRemaining)
            }
          />
          <DetailRow
            label="Transfer fee interruption"
            value={user.settings.enableTransferFeeInterruption ? 'Enabled' : 'Disabled'}
          />
          <DetailRow
            label="Acceptance authorization"
            value={user.settings.enableTransferAcceptanceAuthorization ? 'Enabled' : 'Disabled'}
          />
        </View>

        <Pressable
          accessibilityRole="button"
          disabled={deleteMutation.isPending}
          onPress={() => setConfirmDelete(true)}
          style={{
            minHeight: 48,
            borderRadius: radius.lg,
            backgroundColor: colors.error[500],
            alignItems: 'center',
            justifyContent: 'center',
            opacity: deleteMutation.isPending ? 0.7 : 1,
          }}
        >
          {deleteMutation.isPending ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Typography style={{ color: colors.white, fontSize: 15, fontWeight: '700' }}>
              Delete user
            </Typography>
          )}
        </Pressable>
      </ScrollView>

      <ConfirmModal
        visible={confirmDelete}
        title="Delete user?"
        message={`This permanently removes ${user.email} and their profiles/settings. This cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        loading={deleteMutation.isPending}
        onClose={() => setConfirmDelete(false)}
        onConfirm={() => {
          if (!userId) return;
          deleteMutation.mutate(userId, {
            onSuccess: () => {
              setConfirmDelete(false);
              show({ message: 'User deleted.', variant: 'success' });
              router.replace('/admin/users');
            },
            onError: () => {
              setConfirmDelete(false);
              show({ message: 'Unable to delete user.', variant: 'error' });
            },
          });
        }}
      />
    </View>
  );
}
