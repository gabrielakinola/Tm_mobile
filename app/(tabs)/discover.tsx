import { useState } from 'react';
import { Dimensions, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { CalendarFold, ChevronDown } from 'lucide-react-native';
import { DiscoverLocationPinIcon } from '@/components/icons/DiscoverLocationPinIcon';
import { SearchMarkIcon } from '@/components/icons/SearchMarkIcon';
import { CountryFlagBadge } from '@/components/navigation/CountryFlagBadge';
import {
  KeyboardAwareScrollView,
  KeyboardAwareTextInput,
  TicketmasterHeaderLogo,
  Typography,
} from '@/components/ui';
import { SCREEN_HEADER_BG } from '@/constants/screen-header';
import { DiscoverFeedCard } from '@/features/discover/components/DiscoverFeedCard';
import { PopularNearYouSection } from '@/features/discover/components/PopularNearYouSection';
import { MOCK_DISCOVER_FEED_EVENTS } from '@/mocks';
import { useAuthStore } from '@/stores/auth-store';
import { useProfileStore } from '@/stores/profile-store';
import { useTheme } from '@/theme';
import { colors, radius, spacing } from '@/theme/tokens';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const HeroBanner = () => {
  return (
    <View style={{ marginTop: 0 }}>
      <View style={{ height: 260, width: SCREEN_WIDTH, overflow: 'hidden', position: 'relative' }}>
        {/* Background Image */}
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&h=600&fit=crop',
          }}
          style={{ width: '100%', height: '100%' }}
          contentFit="cover"
        />
        {/* Layer 1: Semi-transparent full overlay */}
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.18)',
          }}
        />
        {/* Layer 2: Cinematic linear gradient */}
        <LinearGradient
          colors={[
            'transparent',
            'rgba(0,0,0,0.15)',
            'rgba(0,0,0,0.45)',
            'rgba(0,0,0,0.78)',
            'rgba(0,0,0,0.92)',
          ]}
          locations={[0.45, 0.55, 0.7, 0.85, 1]}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />
        {/* Content (Title & Button) */}
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            paddingHorizontal: spacing.lg,
            paddingTop: 16,
            paddingBottom: 20,
          }}
        >
          <Typography
            variant="h1"
            style={{
              color: 'white',
              fontSize: 28,
              lineHeight: 36,
              fontWeight: '700',
              textTransform: 'uppercase',
              marginBottom: spacing.md,
            }}
          >
            JOURNEY
          </Typography>
          <View
            style={{
              backgroundColor: '#0056D6',
              borderRadius: 8,
              paddingVertical: 12,
              paddingHorizontal: 24,
              alignSelf: 'flex-start',
            }}
          >
            <Typography
              style={{
                color: 'white',
                fontWeight: 'bold',
                fontSize: 16,
              }}
            >
              Find Tickets
            </Typography>
          </View>
        </View>
      </View>
    </View>
  );
};

const CATEGORIES = ['Concerts', 'Sports', 'Arts, Theater & Comedy', 'Family', 'Festivals', 'More'];

const CategoryChip = ({ label }: { label: string }) => (
  <Pressable
    style={{
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
      borderWidth: 1,
      borderColor: 'white',
      borderRadius: radius.sm,
      backgroundColor: 'transparent',
      marginRight: spacing.md,
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Typography
      style={{
        color: 'white',
        fontWeight: '700',
        fontSize: 18,
      }}
    >
      {label}
    </Typography>
  </Pressable>
);

export default function DiscoverScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [searchText, setSearchText] = useState('');
  const headerTopOffset = 20;
  const fixedHeaderHeight = insets.top + 44 - headerTopOffset;
  const defaultProfile = useProfileStore((state) => state.defaultProfile);
  const user = useAuthStore((state) => state.user);
  const countryCode = defaultProfile?.country || user?.defaultProfile?.country || 'US';

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {/* Fixed/Sticky Top Header (ticketmaster + flag) */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          backgroundColor: SCREEN_HEADER_BG,
        }}
      >
        {/* Top bar with app name and flag */}
        <View
          style={{
            paddingTop: Math.max(insets.top - headerTopOffset, spacing.xs),
            paddingHorizontal: spacing.lg,
          }}
        >
          <View
            style={{
              height: 44,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <View style={{ width: 28 }} />
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <TicketmasterHeaderLogo height={22} />
            </View>
            <CountryFlagBadge countryCode={countryCode} />
          </View>
        </View>
      </View>

      {/* Main Scrollable Content */}
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: fixedHeaderHeight,
          paddingBottom: insets.bottom + spacing['2xl'],
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Rest of the Header (location, search, categories) */}
        <View
          style={{
            backgroundColor: SCREEN_HEADER_BG,
            paddingTop: spacing.md,
            paddingBottom: spacing.md,
          }}
        >
          {/* Location & Date Row */}
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: spacing.lg,
              gap: spacing.md,
              marginBottom: spacing.sm,
              alignItems: 'flex-start',
            }}
          >
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
              <DiscoverLocationPinIcon color="white" size={20} />
              <View style={{ flex: 1, flexShrink: 1 }}>
                <Typography
                  style={{
                    color: colors.neutral[400],
                    fontSize: 12,
                    fontWeight: '700',
                    letterSpacing: 1,
                  }}
                >
                  LOCATION
                </Typography>
                <Typography
                  style={{
                    color: 'white',
                    fontSize: 18,
                    fontWeight: '400',
                  }}
                  numberOfLines={1}
                >
                  City or Zip Code
                </Typography>
              </View>
            </View>
            <View
              style={{
                width: 1,
                height: 40,
                backgroundColor: colors.neutral[600],
                marginTop: spacing.sm,
              }}
            />
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: spacing.xs,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
                <CalendarFold color="white" size={20} />
                <View style={{ flex: 1 }}>
                  <Typography
                    style={{
                      color: colors.neutral[400],
                      fontSize: 12,
                      fontWeight: '700',
                      letterSpacing: 1,
                    }}
                  >
                    DATES
                  </Typography>
                  <Typography
                    style={{
                      color: 'white',
                      fontSize: 18,
                      fontWeight: '400',
                    }}
                  >
                    All Dates
                  </Typography>
                </View>
              </View>
              <ChevronDown color="white" size={20} />
            </View>
          </View>
          {/* Search Input (interactive!) */}
          <View style={{ paddingHorizontal: spacing.lg, marginBottom: spacing.md }}>
            <View
              style={{
                backgroundColor: 'white',
                borderRadius: radius.sm,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.sm,
                flexDirection: 'row',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                borderWidth: 1,
                borderColor: colors.neutral[400],
              }}
            >
              <View style={{ flex: 1, gap: spacing.xs / 2 }}>
                <Typography
                  style={{
                    color: '#000000',
                    textTransform: 'uppercase',
                    fontWeight: '600',
                    fontSize: 14,
                    letterSpacing: 0.5,
                  }}
                >
                  SEARCH
                </Typography>
                <KeyboardAwareTextInput
                  containerStyle={{ flex: 1 }}
                  style={{
                    color: colors.neutral[700],
                    fontSize: 18,
                    fontWeight: '400',
                    paddingVertical: 0,
                  }}
                  placeholder="Artist, Event or Venue"
                  placeholderTextColor={colors.neutral[500]}
                  value={searchText}
                  onChangeText={setSearchText}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              <View style={{ paddingTop: spacing.sm }}>
                <SearchMarkIcon color={colors.pulse[500]} size={28} strokeWidth={1.2} />
              </View>
            </View>
          </View>
          {/* Category Chips */}
          <View style={{ paddingLeft: spacing.lg }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {CATEGORIES.map((label) => (
                <CategoryChip key={label} label={label} />
              ))}
            </ScrollView>
          </View>
        </View>

        <HeroBanner />

        {/* Discover event feed */}
        <View
          style={{
            backgroundColor: theme.colors.background,
            paddingTop: spacing.xl,
            paddingHorizontal: spacing.lg,
          }}
        >
          {MOCK_DISCOVER_FEED_EVENTS.map((event) => (
            <DiscoverFeedCard key={event.id} event={event} />
          ))}
        </View>

        <PopularNearYouSection />
      </KeyboardAwareScrollView>
    </View>
  );
}
