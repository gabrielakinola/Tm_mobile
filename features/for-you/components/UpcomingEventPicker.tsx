import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import Animated, { Easing, FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Search, X } from 'lucide-react-native';
import { Typography } from '@/components/ui';
import { useKeyboardAwareInputFocus } from '@/components/ui/KeyboardAwareScrollView';
import { getMyEventsRequest } from '@/services/events/events.api';
import type { MyEventSummary } from '@/services/events/types';
import { colors, radius, spacing } from '@/theme/tokens';

const DEBOUNCE_MS = 400;
const MIN_QUERY_LENGTH = 1;

function formatEventDate(value: string): string {
  if (!value) return '';
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(parsed);
}

export interface UpcomingEventPickerProps {
  selectedEventId: string;
  onSelect: (eventId: string, event?: MyEventSummary) => void;
  selectedEvent?: MyEventSummary | null;
}

export function UpcomingEventPicker({
  selectedEventId,
  onSelect,
  selectedEvent = null,
}: UpcomingEventPickerProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [collapsedAfterSelect, setCollapsedAfterSelect] = useState(Boolean(selectedEventId));

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [query]);

  const canSearch = debouncedQuery.length >= MIN_QUERY_LENGTH;
  const shouldShowPanel = canSearch && !collapsedAfterSelect;

  const searchQuery = useQuery({
    queryKey: ['events', 'mine', 'upcoming', 'confirmation-search', debouncedQuery],
    enabled: canSearch,
    queryFn: ({ signal }) =>
      getMyEventsRequest(
        {
          status: 'upcoming',
          search: debouncedQuery,
        },
        signal,
      ),
    staleTime: 0,
  });

  const events = useMemo(() => searchQuery.data?.events ?? [], [searchQuery.data?.events]);

  const handleQueryChange = (value: string) => {
    if (collapsedAfterSelect) {
      setCollapsedAfterSelect(false);
    }
    setQuery(value);
  };

  const handleSelect = (event: MyEventSummary) => {
    onSelect(event.id, event);
    setQuery(event.name);
    setCollapsedAfterSelect(true);
  };

  const handleClear = () => {
    onSelect('');
    setQuery('');
    setDebouncedQuery('');
    setCollapsedAfterSelect(false);
  };

  const displayValue = collapsedAfterSelect && selectedEvent ? selectedEvent.name : query;
  const { containerRef, onFocus: handleKeyboardAwareFocus } = useKeyboardAwareInputFocus(() => {
    if (collapsedAfterSelect) {
      setCollapsedAfterSelect(false);
    }
  });

  return (
    <View>
      <View
        ref={containerRef}
        collapsable={false}
        style={{
          minHeight: 44,
          borderWidth: 1,
          borderColor: colors.neutral[300],
          borderRadius: radius.md,
          backgroundColor: colors.neutral[0],
          paddingHorizontal: spacing.md,
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.sm,
        }}
      >
        <Search size={16} color={colors.neutral[500]} />
        <TextInput
          value={displayValue}
          onChangeText={handleQueryChange}
          onFocus={handleKeyboardAwareFocus}
          placeholder="Search by event name or venue"
          placeholderTextColor={colors.neutral[400]}
          autoCapitalize="none"
          autoCorrect={false}
          style={{
            flex: 1,
            color: colors.neutral[800],
            fontSize: 14,
            paddingVertical: 10,
          }}
        />
        {displayValue ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Clear event search"
            onPress={handleClear}
            hitSlop={8}
            style={{
              width: 20,
              height: 20,
              borderRadius: radius.full,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: colors.neutral[100],
            }}
          >
            <X size={12} color={colors.neutral[600]} />
          </Pressable>
        ) : null}
      </View>

      {selectedEvent && collapsedAfterSelect ? (
        <Typography style={{ color: colors.neutral[500], fontSize: 12, marginTop: spacing.xs }}>
          {selectedEvent.venue}
          {selectedEvent.eventDate ? ` · ${formatEventDate(selectedEvent.eventDate)}` : ''}
        </Typography>
      ) : null}

      {shouldShowPanel ? (
        <Animated.View
          entering={FadeIn.duration(180)}
          exiting={FadeOut.duration(180)}
          layout={LinearTransition.duration(260).easing(Easing.out(Easing.cubic))}
          style={{
            marginTop: spacing.sm,
            borderWidth: 1,
            borderColor: colors.neutral[200],
            borderRadius: radius.lg,
            backgroundColor: colors.white,
            maxHeight: 320,
            overflow: 'hidden',
          }}
        >
          <ScrollView
            nestedScrollEnabled
            keyboardShouldPersistTaps="handled"
            style={{ maxHeight: 320 }}
            contentContainerStyle={{ padding: spacing.sm, gap: spacing.sm }}
            showsVerticalScrollIndicator={false}
          >
            {searchQuery.isFetching ? (
              <View style={{ padding: spacing.md, alignItems: 'center' }}>
                <Typography style={{ color: colors.neutral[500], fontSize: 13 }}>
                  Searching your events…
                </Typography>
              </View>
            ) : events.length === 0 ? (
              <View
                style={{
                  borderWidth: 1,
                  borderColor: colors.neutral[200],
                  borderRadius: radius.md,
                  backgroundColor: colors.neutral[50],
                  padding: spacing.md,
                  gap: spacing.sm,
                }}
              >
                <Typography style={{ color: colors.neutral[900], fontSize: 14, fontWeight: '700' }}>
                  No results
                </Typography>
                <Typography style={{ color: colors.neutral[600], fontSize: 13, lineHeight: 18 }}>
                  No upcoming events matched “{debouncedQuery}”. Create an event first so you can
                  generate and send a confirmation email.
                </Typography>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => router.push('/create-event')}
                  style={{
                    alignSelf: 'flex-start',
                    minHeight: 36,
                    paddingHorizontal: spacing.md,
                    borderRadius: radius.sm,
                    backgroundColor: colors.pulse[600],
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography style={{ color: colors.white, fontSize: 13, fontWeight: '700' }}>
                    Go create event
                  </Typography>
                </Pressable>
              </View>
            ) : (
              events.map((event) => {
                const isSelected = event.id === selectedEventId;
                return (
                  <View
                    key={event.id}
                    style={{
                      borderWidth: 1,
                      borderColor: isSelected ? colors.pulse[300] : colors.neutral[200],
                      borderRadius: radius.md,
                      backgroundColor: isSelected ? colors.pulse[50] : colors.neutral[50],
                      paddingHorizontal: spacing.sm,
                      paddingVertical: spacing.xs + 2,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: spacing.sm,
                    }}
                  >
                    <Image
                      source={{ uri: event.imageUrl }}
                      style={{ width: 44, height: 44, borderRadius: radius.sm }}
                      contentFit="cover"
                    />
                    <View style={{ flex: 1, gap: 2 }}>
                      <Typography
                        style={{ color: colors.neutral[900], fontSize: 13, fontWeight: '700' }}
                        numberOfLines={1}
                      >
                        {event.name}
                      </Typography>
                      <Typography
                        style={{ color: colors.neutral[600], fontSize: 12 }}
                        numberOfLines={1}
                      >
                        {formatEventDate(event.eventDate)}
                        {event.eventTime ? ` · ${event.eventTime}` : ''}
                      </Typography>
                      <Typography
                        style={{ color: colors.neutral[500], fontSize: 12 }}
                        numberOfLines={1}
                      >
                        {event.venue}
                      </Typography>
                    </View>
                    <Pressable
                      accessibilityRole="button"
                      onPress={() => handleSelect(event)}
                      style={{
                        minWidth: 72,
                        height: 32,
                        borderRadius: radius.sm,
                        borderWidth: 1,
                        borderColor: isSelected ? colors.pulse[400] : colors.neutral[300],
                        backgroundColor: isSelected ? colors.pulse[600] : colors.neutral[100],
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography
                        style={{
                          color: isSelected ? colors.white : colors.neutral[600],
                          fontSize: 12,
                          fontWeight: '700',
                        }}
                      >
                        {isSelected ? 'Selected' : 'Select'}
                      </Typography>
                    </Pressable>
                  </View>
                );
              })
            )}
          </ScrollView>
        </Animated.View>
      ) : null}
    </View>
  );
}
