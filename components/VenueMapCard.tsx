import { memo, useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Animated, { Easing, FadeInUp } from 'react-native-reanimated';
import { MapVenueLabel } from '@/components/MapVenueLabel';
import { Typography } from '@/components/ui/Typography';
import { useOpenMaps } from '@/hooks/useOpenMaps';
import { colors, radius, shadows, spacing } from '@/theme/tokens';

const MAP_HEIGHT = 220;
const FOOTER_HEIGHT = 40;
const STREET_DELTA = 0.012;

export interface VenueMapCardProps {
  venue: string;
  location: string;
  latitude: string;
  longitude: string;
}

function parseCoordinate(value?: string): number | null {
  if (!value?.trim()) {
    return null;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : null;
}

function VenueMapCardComponent({ venue, location, latitude, longitude }: VenueMapCardProps) {
  const { openMaps } = useOpenMaps();

  const venueLabel = venue.trim();

  const coordinates = useMemo(() => {
    const lat = parseCoordinate(latitude);
    const lng = parseCoordinate(longitude);

    if (lat === null || lng === null) {
      return null;
    }

    return {
      latitude: lat,
      longitude: lng,
    };
  }, [latitude, longitude]);

  const region = useMemo(() => {
    if (!coordinates) {
      return null;
    }

    return {
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      latitudeDelta: STREET_DELTA,
      longitudeDelta: STREET_DELTA,
    };
  }, [coordinates]);

  const handleOpenMaps = () => {
    void openMaps({
      venue,
      location,
      latitude,
      longitude,
    });
  };

  return (
    <Animated.View
      entering={FadeInUp.duration(250).easing(Easing.out(Easing.cubic))}
      style={styles.card}
      accessibilityLabel={`Venue map for ${venue}${location ? `, ${location}` : ''}`}
    >
      {/* MAP SECTION */}
      <View style={styles.mapSection}>
        {region && coordinates ? (
          <>
            <MapView
              style={styles.map}
              initialRegion={region}
              scrollEnabled
              zoomEnabled
              pitchEnabled={false}
              rotateEnabled={false}
              toolbarEnabled={false}
              showsCompass={false}
              showsTraffic={false}
              showsIndoors={false}
              showsPointsOfInterest={false}
              showsUserLocation={false}
              showsMyLocationButton={false}
              legalLabelInsets={{
                top: 0,
                left: -200,
                bottom: -80,
                right: 0,
              }}
              onPress={handleOpenMaps}
              accessibilityLabel={`Map of ${venue}`}
            >
              <Marker
                coordinate={coordinates}
                title={venueLabel}
                description={location || undefined}
              />
            </MapView>

            <MapVenueLabel venue={venueLabel} />
          </>
        ) : (
          <View style={styles.placeholder} accessibilityLabel="Map unavailable">
            <Typography style={styles.placeholderText}>Map unavailable</Typography>
          </View>
        )}
      </View>

      {/* FOOTER */}
      <View style={styles.footerSection}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Get directions to ${venue}`}
          onPress={handleOpenMaps}
          style={({ pressed }) => [pressed && styles.footerPressed]}
        >
          <Typography style={styles.directionsLabel}>Get Directions</Typography>
        </Pressable>
      </View>
    </Animated.View>
  );
}

export const VenueMapCard = memo(
  VenueMapCardComponent,
  (prev, next) =>
    prev.venue === next.venue &&
    prev.location === next.location &&
    prev.latitude === next.latitude &&
    prev.longitude === next.longitude,
);

VenueMapCard.displayName = 'VenueMapCard';

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    overflow: 'hidden',
    ...shadows.md,
  },

  // ===========================
  // MAP SECTION
  // ===========================

  mapSection: {
    height: MAP_HEIGHT,
    backgroundColor: colors.neutral[100],
    overflow: 'hidden',
  },

  map: {
    position: 'absolute',

    // Hide Apple Maps logo
    top: -8,
    right: -8,
    bottom: -28,
    left: -72,
  },

  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },

  placeholderText: {
    color: colors.neutral[500],
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
  },

  // ===========================
  // FOOTER SECTION
  // ===========================
  footerSection: {
    height: FOOTER_HEIGHT,
    backgroundColor: colors.white,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.neutral[200],

    justifyContent: 'center',
    alignItems: 'center',

    paddingHorizontal: spacing.xl,
  },

  footerPressed: {
    opacity: 0.6,
  },

  directionsLabel: {
    color: colors.neutral[900],
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 18,
    textAlign: 'center',

    // Android only
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});
