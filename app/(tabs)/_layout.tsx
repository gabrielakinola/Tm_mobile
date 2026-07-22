import { Platform, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Tabs, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  DiscoverTabIcon,
  ForYouTabIcon,
  MyAccountTabIcon,
  MyTicketsTabIcon,
  SellTabIcon,
} from '@/components/navigation/TabBarIcons';
import { SCREEN_HEADER_BG } from '@/constants/screen-header';
import { TAB_BAR_COLORS } from '@/constants/tab-bar';
import { useAccountStore } from '@/stores/account-store';

const TAB_BAR_CONTENT_HEIGHT = Platform.OS === 'ios' ? 49 : 56;
const LIGHT_STATUS_BAR_TABS = new Set(['discover', 'tickets', 'account', 'for-you', 'sell']);

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const segments = useSegments();
  const activeTab = segments[segments.length - 1] ?? '';
  const useLightStatusBar = LIGHT_STATUS_BAR_TABS.has(activeTab);
  const bottomInset = Math.max(insets.bottom, Platform.OS === 'ios' ? 0 : 8);
  const notificationCount = useAccountStore((state) => state.notificationCount);

  return (
    <>
      <StatusBar
        style={useLightStatusBar ? 'light' : 'dark'}
        backgroundColor={useLightStatusBar ? SCREEN_HEADER_BG : undefined}
      />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: TAB_BAR_COLORS.active,
          tabBarInactiveTintColor: TAB_BAR_COLORS.inactive,
          tabBarAllowFontScaling: false,
          tabBarStyle: {
            backgroundColor: TAB_BAR_COLORS.background,
            borderTopColor: TAB_BAR_COLORS.border,
            borderTopWidth: StyleSheet.hairlineWidth,
            height: TAB_BAR_CONTENT_HEIGHT + bottomInset,
            paddingTop: 4,
            paddingBottom: bottomInset,
            paddingHorizontal: 6,
          },
          tabBarItemStyle: {
            paddingTop: 2,
            paddingBottom: 2,
            height: TAB_BAR_CONTENT_HEIGHT - 4,
          },
          tabBarIconStyle: {
            marginBottom: 0,
          },
          tabBarLabel: ({ focused, color, children }) => (
            <Text
              style={{
                color,
                fontSize: 10,
                lineHeight: 13,
                fontWeight: focused ? '600' : '400',
                textAlign: 'center',
                width: '100%',
                paddingHorizontal: 1,
                marginTop: 3,
              }}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.75}
            >
              {children}
            </Text>
          ),
        }}
      >
        <Tabs.Screen
          name="discover"
          options={{
            title: 'Discover',
            tabBarIcon: ({ color }) => <DiscoverTabIcon color={color} />,
          }}
        />
        <Tabs.Screen
          name="for-you"
          options={{
            title: 'For You',
            tabBarIcon: ({ color }) => <ForYouTabIcon color={color} />,
          }}
        />
        <Tabs.Screen
          name="tickets"
          options={{
            title: 'My Tickets',
            tabBarIcon: ({ color }) => <MyTicketsTabIcon color={color} />,
          }}
        />
        <Tabs.Screen
          name="sell"
          options={{
            title: 'Sell',
            tabBarIcon: ({ color }) => <SellTabIcon color={color} />,
          }}
        />
        <Tabs.Screen
          name="account"
          options={{
            title: 'Account',
            tabBarIcon: ({ color, focused }) => (
              <View>
                <MyAccountTabIcon color={color} />
                {focused && notificationCount > 0 ? (
                  <View
                    style={{
                      position: 'absolute',
                      top: -4,
                      right: -8,
                      minWidth: 16,
                      height: 16,
                      borderRadius: 8,
                      backgroundColor: '#EF4444',
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingHorizontal: 4,
                    }}
                  >
                    <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: '700' }}>
                      {notificationCount}
                    </Text>
                  </View>
                ) : null}
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            href: null,
          }}
        />
      </Tabs>
    </>
  );
}
