import { useCallback } from 'react';
import { Linking, Platform } from 'react-native';

export interface OpenMapsParams {
  venue: string;
  location?: string;
  latitude?: string;
  longitude?: string;
}

function parseCoordinate(value?: string): number | null {
  if (!value?.trim()) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function buildMapsUrl({ venue, location, latitude, longitude }: OpenMapsParams): string {
  const lat = parseCoordinate(latitude);
  const lng = parseCoordinate(longitude);
  const label = encodeURIComponent(
    [venue, location].filter((part) => part?.trim()).join(', ') || venue,
  );
  const hasCoordinates = lat !== null && lng !== null;

  if (Platform.OS === 'ios') {
    if (hasCoordinates) {
      return `http://maps.apple.com/?daddr=${lat},${lng}&q=${label}`;
    }

    return `http://maps.apple.com/?q=${label}`;
  }

  if (hasCoordinates) {
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  }

  return `https://www.google.com/maps/search/?api=1&query=${label}`;
}

export function useOpenMaps() {
  const openMaps = useCallback(async (params: OpenMapsParams) => {
    const url = buildMapsUrl(params);
    await Linking.openURL(url);
  }, []);

  return { openMaps };
}
