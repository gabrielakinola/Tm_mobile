import { Alert, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  Bell,
  FileText,
  HelpCircle,
  LayoutTemplate,
  LogOut,
  Mail,
  MapPin,
  MessageSquare,
  Navigation,
  PenLine,
  Shield,
  ShieldCheck,
  Wallet,
} from 'lucide-react-native';
import { FavoritesPolygonIcon } from '@/components/icons/FavoritesPolygonIcon';
import { SearchMarkIcon } from '@/components/icons/SearchMarkIcon';
import { CountryFlagBadge } from '@/components/navigation/CountryFlagBadge';
import { Typography } from '@/components/ui';
import { SCREEN_HEADER_BG } from '@/constants/screen-header';
import {
  AccountListRow,
  AccountSectionTitle,
  AccountToggleRow,
} from '@/features/account/components/AccountList';
import { COUNTRY_OPTIONS } from '@/features/profile-location/constants';
import { useLogout } from '@/hooks/auth/useLogout';
import { formatProfileName } from '@/lib/profile-name';
import { useAccountStore } from '@/stores/account-store';
import { useAuthStore } from '@/stores/auth-store';
import { useProfileStore } from '@/stores/profile-store';
import { colors, spacing } from '@/theme/tokens';

export default function AccountScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logoutMutation = useLogout();
  const defaultProfile = useProfileStore((state) => state.defaultProfile);
  const {
    notificationCount,
    receiveNotifications,
    locationBasedContent,
    setReceiveNotifications,
    setLocationBasedContent,
  } = useAccountStore();

  const country = defaultProfile?.country || user?.defaultProfile?.country || 'US';
  const city = defaultProfile?.city || user?.defaultProfile?.city || '';
  const countryLabel =
    COUNTRY_OPTIONS.find((option) => option.value === country)?.label ?? 'United States';

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

  return (
    <View style={{ flex: 1, backgroundColor: colors.neutral[0] }}>
      <View
        style={{
          backgroundColor: SCREEN_HEADER_BG,
          paddingTop: insets.top,
          paddingBottom: spacing.lg,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: spacing.sm,
            paddingBottom: spacing.xs,
            paddingHorizontal: spacing.lg,
          }}
        >
          <Typography
            style={{
              color: colors.white,
              fontSize: 16,
              fontWeight: '600',
              textAlign: 'center',
            }}
          >
            Account
          </Typography>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Search"
            hitSlop={8}
            style={{ position: 'absolute', right: spacing.lg }}
          >
            <SearchMarkIcon color={colors.white} size={28} strokeWidth={1.2} />
          </Pressable>
        </View>

        <View style={{ paddingHorizontal: spacing.lg, gap: spacing.xs, marginTop: spacing.lg }}>
          <Typography
            style={{
              color: colors.white,
              fontSize: 28,
              lineHeight: 36,
              fontWeight: '700',
            }}
          >
            {accountName}
          </Typography>
          <Typography
            style={{
              color: colors.neutral[300],
              fontSize: 15,
              lineHeight: 22,
            }}
          >
            {accountEmail}
          </Typography>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: spacing['2xl'] + insets.bottom }}
      >
        <AccountSectionTitle>Notifications</AccountSectionTitle>
        <AccountListRow
          icon={<Mail size={22} color={colors.neutral[900]} />}
          label="My Notifications"
          badge={notificationCount}
          showChevron
          onPress={() => {}}
        />
        <AccountToggleRow
          icon={<Bell size={22} color={colors.neutral[900]} />}
          label="Receive Notifications?"
          value={receiveNotifications}
          onValueChange={setReceiveNotifications}
        />

        <AccountSectionTitle>Location Settings</AccountSectionTitle>
        <AccountListRow
          icon={<MapPin size={22} color={colors.neutral[900]} />}
          label="My Location"
          value={city || 'Add location'}
          showEdit
          onPress={openProfiles}
        />
        <AccountListRow
          icon={<CountryFlagBadge countryCode={country} />}
          label="My Country"
          value={countryLabel}
          showEdit
          onPress={openProfiles}
        />
        <AccountToggleRow
          icon={<Navigation size={22} color={colors.neutral[900]} />}
          label="Location Based Content"
          value={locationBasedContent}
          onValueChange={setLocationBasedContent}
        />

        <AccountSectionTitle>Preferences</AccountSectionTitle>
        <AccountListRow
          icon={<FavoritesPolygonIcon color={colors.neutral[900]} size={22} />}
          label="My Favorites"
          showChevron
          onPress={() => {}}
        />
        <AccountListRow
          icon={<PenLine size={22} color={colors.neutral[900]} />}
          label="Edit Details"
          showChevron
          onPress={openProfiles}
        />
        <AccountListRow
          icon={<Shield size={22} color={colors.neutral[900]} />}
          label="Security"
          showChevron
          onPress={() => {}}
        />
        <AccountListRow
          icon={<Wallet size={22} color={colors.neutral[900]} />}
          label="Saved Payment Methods"
          showChevron
          onPress={() => {}}
        />
        <AccountListRow
          icon={<LayoutTemplate size={22} color={colors.neutral[900]} />}
          label="Change App Icon"
          showChevron
          onPress={() => {}}
        />

        <AccountSectionTitle>Help & Guidance</AccountSectionTitle>
        <AccountListRow
          icon={<HelpCircle size={22} color={colors.neutral[900]} />}
          label="Need Help?"
          showChevron
          onPress={() => {}}
        />
        <AccountListRow
          icon={<MessageSquare size={22} color={colors.neutral[900]} />}
          label="Give Us Feedback"
          showChevron
          onPress={() => {}}
        />
        <AccountListRow
          icon={<ShieldCheck size={22} color={colors.neutral[900]} />}
          label="Privacy"
          showChevron
          onPress={() => {}}
        />
        <AccountListRow
          icon={<FileText size={22} color={colors.neutral[900]} />}
          label="Legal"
          showChevron
          onPress={() => {}}
        />

        <AccountListRow
          icon={<LogOut size={22} color={colors.error[500]} />}
          label="Sign Out"
          destructive
          onPress={handleSignOut}
        />
      </ScrollView>
    </View>
  );
}
