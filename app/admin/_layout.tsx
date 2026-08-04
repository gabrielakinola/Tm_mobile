import { Platform, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Users } from 'lucide-react-native';
import { SCREEN_HEADER_BG } from '@/constants/screen-header';
import { TAB_BAR_COLORS } from '@/constants/tab-bar';

const TAB_BAR_CONTENT_HEIGHT = Platform.OS === 'ios' ? 49 : 56;

export default function AdminTabLayout() {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, Platform.OS === 'ios' ? 0 : 8);

  return (
    <>
      <StatusBar style="light" backgroundColor={SCREEN_HEADER_BG} />
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
          tabBarLabel: ({ focused, color, children }) => (
            <Text
              style={{
                color,
                fontSize: 10,
                lineHeight: 13,
                fontWeight: focused ? '600' : '400',
                textAlign: 'center',
                width: '100%',
                marginTop: 3,
              }}
              numberOfLines={1}
            >
              {children}
            </Text>
          ),
        }}
      >
        <Tabs.Screen
          name="users"
          options={{
            title: 'Manage Users',
            tabBarIcon: ({ color }) => <Users size={22} color={color} strokeWidth={2.1} />,
          }}
        />
        <Tabs.Screen name="create-user" options={{ href: null }} />
        <Tabs.Screen name="user/[id]" options={{ href: null }} />
      </Tabs>
    </>
  );
}
