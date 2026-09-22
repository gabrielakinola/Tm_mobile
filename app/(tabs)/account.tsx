import { Alert, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  Bell,
  CreditCard,
  Eye,
  FileText,
  Heart,
  HelpCircle,
  LogOut,
  Mail,
  MapPin,
  MessageSquare,
  Send,
  ShieldCheck,
  User,
  UserRoundPen,
} from 'lucide-react-native';
import { Typography } from '@/components/ui';
import { APP_ACCOUNT_AVATAR_RING, APP_ACCOUNT_EMAIL, APP_DARK_BG } from '@/constants/app-surface';
import {
  AccountGroup,
  AccountListRow,
  AccountSectionTitle,
  AccountToggleRow,
} from '@/features/account/components/AccountList';
import { useLogout } from '@/hooks/auth/useLogout';
import { formatProfileName, getProfileInitials } from '@/lib/profile-name';
import { useAccountStore } from '@/stores/account-store';
import { useAuthStore } from '@/stores/auth-store';
import { useProfileStore } from '@/stores/profile-store';
import { colors, spacing } from '@/theme/tokens';

const ICON_PROPS = { size: 22, color: colors.white, strokeWidth: 1.75 } as const;

export default function AccountScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logoutMutation = useLogout();
  const defaultProfile = useProfileStore((state) => state.defaultProfile);
  const {
    receiveNotifications,
    locationBasedContent,
    setReceiveNotifications,
    setLocationBasedContent,
  } = useAccountStore();

  const openProfiles = () => router.push('/profiles');

  const handleSignOut = () => {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => {
          logoutMutation.mutate(undefined, {
            onSuccess: () => {
              router.replace('/login');
            },
          });
        },
      },
    ]);
  };

  const accountName =
    formatProfileName(defaultProfile) ||
    formatProfileName(user?.defaultProfile) ||
    user?.accountName ||
    'Add your name';
  const accountEmail =
    defaultProfile?.displayEmail || user?.defaultProfile?.displayEmail || 'Add a display email';
  const initials = getProfileInitials(defaultProfile) || getProfileInitials(user?.defaultProfile);

  return (
    <View style={{ flex: 1, backgroundColor: APP_DARK_BG }}>
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + spacing.sm,
          paddingBottom: spacing['2xl'] + insets.bottom,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: spacing.lg,
            paddingTop: spacing.sm,
            paddingBottom: spacing.sm,
            gap: 14,
          }}
        >
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              borderWidth: 3,
              borderColor: APP_ACCOUNT_AVATAR_RING,
              backgroundColor: APP_DARK_BG,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {initials ? (
              <Typography
                style={{
                  color: colors.white,
                  fontSize: 18,
                  fontWeight: '700',
                  letterSpacing: 0.4,
                }}
              >
                {initials}
              </Typography>
            ) : (
              <User size={24} color={colors.white} strokeWidth={1.75} />
            )}
          </View>
          <View style={{ flex: 1, gap: 2 }}>
            <Typography
              style={{
                color: colors.white,
                fontSize: 18,
                lineHeight: 22,
                fontWeight: '700',
              }}
              numberOfLines={1}
            >
              {accountName}
            </Typography>
            <Typography
              style={{
                color: APP_ACCOUNT_EMAIL,
                fontSize: 13,
                lineHeight: 18,
              }}
              numberOfLines={1}
            >
              {accountEmail}
            </Typography>
          </View>
        </View>

        <AccountSectionTitle>Personalization</AccountSectionTitle>
        <AccountGroup>
          <AccountListRow
            icon={<Mail {...ICON_PROPS} />}
            label="My Inbox"
            showChevron
            onPress={() => {}}
          />
          <AccountListRow
            icon={<Heart {...ICON_PROPS} />}
            label="Favorites"
            showChevron
            onPress={() => {}}
          />
          <AccountListRow
            icon={<MapPin {...ICON_PROPS} />}
            label="Location"
            showChevron
            onPress={openProfiles}
          />
        </AccountGroup>

        <AccountSectionTitle>Permissions</AccountSectionTitle>
        <AccountGroup>
          <AccountToggleRow
            icon={<Send {...ICON_PROPS} />}
            label="Location Content"
            value={locationBasedContent}
            onValueChange={setLocationBasedContent}
          />
          <AccountToggleRow
            icon={<Bell {...ICON_PROPS} />}
            label="Notifications"
            value={receiveNotifications}
            onValueChange={setReceiveNotifications}
          />
        </AccountGroup>

        <AccountSectionTitle>Account</AccountSectionTitle>
        <AccountGroup>
          <AccountListRow
            icon={<UserRoundPen {...ICON_PROPS} />}
            label="Edit Details"
            showChevron
            onPress={openProfiles}
          />
          <AccountListRow
            icon={<ShieldCheck {...ICON_PROPS} />}
            label="Security"
            showChevron
            onPress={() => {}}
          />
          <AccountListRow
            icon={<CreditCard {...ICON_PROPS} />}
            label="Saved Payment Methods"
            showChevron
            onPress={() => {}}
          />
        </AccountGroup>

        <AccountSectionTitle>Help & Guidance</AccountSectionTitle>
        <AccountGroup>
          <AccountListRow
            icon={<HelpCircle {...ICON_PROPS} />}
            label="Need Help?"
            showChevron
            onPress={() => {}}
          />
          <AccountListRow
            icon={<MessageSquare {...ICON_PROPS} />}
            label="Give Us Feedback"
            showChevron
            onPress={() => {}}
          />
          <AccountListRow
            icon={<Eye {...ICON_PROPS} />}
            label="Privacy"
            showChevron
            onPress={() => {}}
          />
          <AccountListRow
            icon={<FileText {...ICON_PROPS} />}
            label="Legal"
            showChevron
            onPress={() => {}}
          />
        </AccountGroup>

        <AccountGroup style={{ marginTop: spacing.xl }}>
          <AccountListRow
            icon={<LogOut {...ICON_PROPS} />}
            label="Sign Out"
            showChevron
            onPress={handleSignOut}
          />
        </AccountGroup>
      </ScrollView>
    </View>
  );
}
