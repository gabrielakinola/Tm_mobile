import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ArrowLeftRight,
  CalendarDays,
  CalendarPlus2,
  Infinity,
  KeyRound,
  Mail,
  Settings,
  UserRound,
} from 'lucide-react-native';
import { Header, Typography, useToast } from '@/components/ui';
import {
  APP_CARD_BG,
  APP_DARK_BG,
  APP_DARK_DIVIDER,
  APP_DARK_MUTED,
  APP_DARK_SURFACE,
} from '@/constants/app-surface';
import { AltStoreRefreshCard } from '@/features/for-you/components/AltStoreRefreshCard';
import { ChangePasswordModal } from '@/features/for-you/components/ChangePasswordModal';
import { getSubscriptionDaysLeft, getSubscriptionDaysLeftTone } from '@/lib/subscription';
import { useAuthStore } from '@/stores/auth-store';
import { colors, radius, spacing } from '@/theme/tokens';

interface QuickActionItem {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ color: string; size?: number }>;
}

const QUICK_ACTIONS: QuickActionItem[] = [
  {
    id: 'create',
    title: 'Create event',
    subtitle: 'Date, venue, tickets, pricing',
    icon: CalendarPlus2,
  },
  {
    id: 'manage',
    title: 'Manage events',
    subtitle: 'Edit, view, or delete',
    icon: CalendarDays,
  },
  {
    id: 'profile',
    title: 'Profiles',
    subtitle: 'Display profiles for My Account',
    icon: UserRound,
  },
  {
    id: 'settings',
    title: 'Settings',
    subtitle: 'Notifications and more',
    icon: Settings,
  },
  {
    id: 'confirmation',
    title: 'Confirmation email',
    subtitle: 'Send event confirmation',
    icon: Mail,
  },
  {
    id: 'transfers',
    title: 'Transfer history',
    subtitle: 'Tickets you’ve sent',
    icon: ArrowLeftRight,
  },
];

const QUICK_ACTION_ROWS = [
  QUICK_ACTIONS.slice(0, 2),
  QUICK_ACTIONS.slice(2, 4),
  QUICK_ACTIONS.slice(4, 6),
];

export default function ForYouScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { show } = useToast();
  const user = useAuthStore((state) => state.user);
  const isLifetimeAccess = user?.accessType === 'LIFETIME';
  const daysLeft = user ? getSubscriptionDaysLeft(user.subscriptionExpiresAt) : 0;
  const daysLeftTone = getSubscriptionDaysLeftTone(daysLeft);

  const daysLeftBadgeStyle = isLifetimeAccess
    ? { backgroundColor: colors.neutral[900] }
    : daysLeftTone === 'green'
      ? { backgroundColor: colors.success[50] }
      : daysLeftTone === 'warning'
        ? { backgroundColor: colors.warning[50] }
        : { backgroundColor: colors.error[50] };

  const daysLeftNumberColor = isLifetimeAccess
    ? colors.white
    : daysLeftTone === 'green'
      ? colors.success[700]
      : daysLeftTone === 'warning'
        ? colors.warning[700]
        : colors.error[700];

  const daysLeftCaptionColor = isLifetimeAccess
    ? colors.neutral[300]
    : daysLeftTone === 'green'
      ? colors.success[700]
      : daysLeftTone === 'warning'
        ? colors.warning[700]
        : colors.error[700];
  const accountEmail = user?.email || '';
  const [changePasswordVisible, setChangePasswordVisible] = useState(false);

  const handleQuickAction = (id: string) => {
    if (id === 'create') {
      router.push('/create-event');
      return;
    }
    if (id === 'manage') {
      router.push('/manage-events');
      return;
    }
    if (id === 'profile') {
      router.push('/profiles');
      return;
    }
    if (id === 'settings') {
      router.push('/settings');
      return;
    }
    if (id === 'confirmation') {
      router.push('/confirmation-email');
      return;
    }
    if (id === 'transfers') {
      router.push('/transfer-history');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: APP_DARK_BG }}>
      <Header title="Watchlist" />

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: spacing['2xl'] + insets.bottom,
        }}
      >
        <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.md }}>
          <Typography
            style={{
              color: APP_DARK_MUTED,
              fontSize: 11,
              lineHeight: 16,
              fontWeight: '700',
              letterSpacing: 0.8,
              textTransform: 'uppercase',
              marginBottom: spacing.sm,
            }}
          >
            Signed in Account
          </Typography>

          <View
            style={{
              borderRadius: radius.md,
              backgroundColor: APP_CARD_BG,
              padding: spacing.md,
              gap: spacing.md,
              marginBottom: spacing.lg,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: spacing.md,
                  paddingRight: spacing.sm,
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: radius.full,
                    backgroundColor: APP_DARK_SURFACE,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  accessibilityLabel="Account avatar"
                >
                  <UserRound size={24} color={APP_DARK_MUTED} strokeWidth={1.8} />
                </View>
                <Typography
                  style={{
                    flex: 1,
                    color: colors.white,
                    fontWeight: '700',
                    fontSize: 15,
                  }}
                  numberOfLines={1}
                >
                  {accountEmail || 'Signed in'}
                </Typography>
              </View>

              <View
                style={{
                  width: 58,
                  borderRadius: radius.md,
                  paddingVertical: spacing.sm,
                  alignItems: 'center',
                  ...daysLeftBadgeStyle,
                }}
              >
                {isLifetimeAccess ? (
                  <Infinity size={20} color={colors.white} strokeWidth={2.5} />
                ) : (
                  <Typography
                    style={{ color: daysLeftNumberColor, fontWeight: '700', fontSize: 17 }}
                  >
                    {daysLeft}
                  </Typography>
                )}
                <Typography
                  style={{
                    color: daysLeftCaptionColor,
                    fontSize: 8,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                    fontWeight: '600',
                  }}
                >
                  Days left
                </Typography>
              </View>
            </View>

            <Pressable
              accessibilityRole="button"
              onPress={() => setChangePasswordVisible(true)}
              style={{
                minHeight: 44,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderTopWidth: 1,
                borderTopColor: APP_DARK_DIVIDER,
                paddingTop: spacing.md,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                <View
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: radius.sm,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: APP_DARK_SURFACE,
                  }}
                >
                  <KeyRound size={16} color={colors.pulse[400]} />
                </View>
                <Typography style={{ color: colors.white, fontSize: 14, fontWeight: '700' }}>
                  Change password
                </Typography>
              </View>
              <Typography style={{ color: colors.pulse[400], fontSize: 14, fontWeight: '600' }}>
                Update
              </Typography>
            </Pressable>
          </View>

          <AltStoreRefreshCard />
        </View>

        <View
          style={{
            backgroundColor: APP_DARK_BG,
            paddingHorizontal: spacing.lg,
            paddingTop: spacing.md,
            paddingBottom: spacing.lg,
            gap: spacing.md,
          }}
        >
          <View style={{ gap: spacing.xs }}>
            <Typography
              style={{
                color: APP_DARK_MUTED,
                fontSize: 11,
                lineHeight: 16,
                fontWeight: '700',
                letterSpacing: 0.8,
                textTransform: 'uppercase',
              }}
            >
              Quick actions
            </Typography>
            <Typography style={{ color: APP_DARK_MUTED, fontSize: 13, lineHeight: 18 }}>
              Create and manage events, update profiles and settings, send confirmation emails, or
              review transfer history.
            </Typography>
          </View>

          <View style={{ gap: spacing.sm }}>
            {QUICK_ACTION_ROWS.map((row) => (
              <View
                key={row.map((item) => item.id).join('-')}
                style={{ flexDirection: 'row', gap: spacing.sm }}
              >
                {row.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Pressable
                      key={item.id}
                      onPress={() => handleQuickAction(item.id)}
                      style={{
                        flex: 1,
                        borderRadius: radius.md,
                        backgroundColor: APP_CARD_BG,
                        padding: spacing.md,
                        gap: spacing.sm,
                      }}
                    >
                      <View
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: radius.sm,
                          backgroundColor: APP_DARK_SURFACE,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Icon size={16} color={colors.pulse[400]} />
                      </View>
                      <Typography style={{ color: colors.white, fontWeight: '700', fontSize: 15 }}>
                        {item.title}
                      </Typography>
                      <Typography style={{ color: APP_DARK_MUTED, fontSize: 12 }}>
                        {item.subtitle}
                      </Typography>
                    </Pressable>
                  );
                })}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <ChangePasswordModal
        visible={changePasswordVisible}
        onClose={() => setChangePasswordVisible(false)}
        onSuccess={() => {
          setChangePasswordVisible(false);
          show({ message: 'Password updated successfully.', variant: 'success' });
        }}
      />
    </View>
  );
}
