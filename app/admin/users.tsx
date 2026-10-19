import { ActivityIndicator, FlatList, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeftRight, Camera, ChevronRight, Infinity, LogOut, Plus } from 'lucide-react-native';
import { ErrorState, Header, Typography } from '@/components/ui';
import {
  APP_CARD_BG,
  APP_DARK_BG,
  APP_DARK_MUTED,
  APP_DARK_SURFACE,
} from '@/constants/app-surface';
import { useAdminUsers } from '@/hooks/admin/useAdminUsers';
import { useLogout } from '@/hooks/auth/useLogout';
import { getSubscriptionDaysLeft, getSubscriptionDaysLeftTone } from '@/lib/subscription';
import type { AdminUserSummary } from '@/services/admin/admin.api';
import { colors, radius, spacing } from '@/theme/tokens';

function DaysLeftBadge({ user }: { user: AdminUserSummary }) {
  const isLifetime = user.accessType === 'LIFETIME';
  const daysLeft = getSubscriptionDaysLeft(user.subscriptionExpiresAt);
  const tone = getSubscriptionDaysLeftTone(daysLeft);
  const expired = !isLifetime && daysLeft <= 0;

  const badgeStyle = isLifetime
    ? { backgroundColor: colors.neutral[800] }
    : expired
      ? { backgroundColor: 'rgba(239, 68, 68, 0.18)' }
      : tone === 'green'
        ? { backgroundColor: 'rgba(16, 185, 129, 0.18)' }
        : tone === 'warning'
          ? { backgroundColor: 'rgba(245, 158, 11, 0.18)' }
          : { backgroundColor: 'rgba(239, 68, 68, 0.18)' };

  const valueColor = isLifetime
    ? colors.white
    : expired
      ? colors.error[500]
      : tone === 'green'
        ? colors.success[500]
        : tone === 'warning'
          ? colors.warning[500]
          : colors.error[500];

  const captionColor = isLifetime ? APP_DARK_MUTED : valueColor;

  return (
    <View
      style={{
        minWidth: 58,
        borderRadius: radius.md,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.sm,
        alignItems: 'center',
        ...badgeStyle,
      }}
    >
      {isLifetime ? (
        <Infinity size={18} color={colors.white} strokeWidth={2.5} />
      ) : expired ? (
        <Typography style={{ color: valueColor, fontWeight: '700', fontSize: 11 }}>0</Typography>
      ) : (
        <Typography style={{ color: valueColor, fontWeight: '700', fontSize: 17 }}>
          {daysLeft}
        </Typography>
      )}
      <Typography
        style={{
          color: captionColor,
          fontSize: 8,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
          fontWeight: '600',
        }}
      >
        {expired ? 'Expired' : 'Days left'}
      </Typography>
    </View>
  );
}

function TodayActivityLine({
  transfersToday,
  capturesToday,
}: {
  transfersToday: number;
  capturesToday: number;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        marginTop: spacing.xs,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
        <ArrowLeftRight size={12} color={APP_DARK_MUTED} strokeWidth={2.2} />
        <Typography style={{ color: APP_DARK_MUTED, fontSize: 12, fontWeight: '600' }}>
          {transfersToday}
        </Typography>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
        <Camera size={12} color={APP_DARK_MUTED} strokeWidth={2.2} />
        <Typography style={{ color: APP_DARK_MUTED, fontSize: 12, fontWeight: '600' }}>
          {capturesToday}
        </Typography>
      </View>
      <Typography style={{ color: APP_DARK_MUTED, fontSize: 12, fontWeight: '500' }}>
        today
      </Typography>
    </View>
  );
}

function UserRow({ user, onPress }: { user: AdminUserSummary; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={{
        backgroundColor: APP_CARD_BG,
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: APP_DARK_SURFACE,
        padding: spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
      }}
    >
      <View style={{ flex: 1, gap: spacing.xs }}>
        <Typography
          style={{ color: colors.white, fontSize: 15, fontWeight: '700' }}
          numberOfLines={1}
        >
          {user.email}
        </Typography>
        <Typography style={{ color: APP_DARK_MUTED, fontSize: 13 }} numberOfLines={1}>
          {user.accountName}
        </Typography>
        <TodayActivityLine
          transfersToday={user.transfersToday ?? 0}
          capturesToday={user.capturesToday ?? 0}
        />
      </View>
      <DaysLeftBadge user={user} />
      <ChevronRight size={18} color={APP_DARK_MUTED} />
    </Pressable>
  );
}

export default function AdminUsersScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const usersQuery = useAdminUsers();
  const logoutMutation = useLogout();

  return (
    <View style={{ flex: 1, backgroundColor: APP_DARK_BG }}>
      <Header
        title="Manage Users"
        subtitle="App accounts"
        rightAction={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Sign out"
            hitSlop={8}
            onPress={() => logoutMutation.mutate()}
            style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}
          >
            <LogOut size={20} color={colors.white} strokeWidth={2.2} />
          </Pressable>
        }
      />

      {usersQuery.isLoading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={colors.pulse[500]} />
        </View>
      ) : usersQuery.isError ? (
        <ErrorState
          inverted
          title="Unable to load users"
          message="Check your connection and try again."
          onRetry={() => void usersQuery.refetch()}
        />
      ) : (
        <FlatList
          data={usersQuery.data ?? []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            padding: spacing.lg,
            paddingBottom: spacing['3xl'] + insets.bottom,
            gap: spacing.sm,
            flexGrow: 1,
          }}
          ListHeaderComponent={
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: spacing.sm,
              }}
            >
              <Typography style={{ color: APP_DARK_MUTED, fontSize: 13, fontWeight: '600' }}>
                {usersQuery.data?.length ?? 0} user{(usersQuery.data?.length ?? 0) === 1 ? '' : 's'}
              </Typography>
              <Pressable
                accessibilityRole="button"
                onPress={() => router.push('/admin/create-user')}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: spacing.xs,
                  backgroundColor: colors.pulse[600],
                  borderRadius: radius.md,
                  paddingHorizontal: spacing.md,
                  minHeight: 36,
                }}
              >
                <Plus size={16} color={colors.white} strokeWidth={2.4} />
                <Typography style={{ color: colors.white, fontSize: 13, fontWeight: '700' }}>
                  Create user
                </Typography>
              </Pressable>
            </View>
          }
          ListEmptyComponent={
            <View
              style={{ paddingVertical: spacing['2xl'], alignItems: 'center', gap: spacing.sm }}
            >
              <Typography style={{ color: colors.white, fontSize: 16, fontWeight: '700' }}>
                No users yet
              </Typography>
              <Typography style={{ color: APP_DARK_MUTED, fontSize: 14, textAlign: 'center' }}>
                Create a monthly or lifetime account to get started.
              </Typography>
            </View>
          }
          renderItem={({ item }) => (
            <UserRow user={item} onPress={() => router.push(`/admin/user/${item.id}`)} />
          )}
        />
      )}
    </View>
  );
}
