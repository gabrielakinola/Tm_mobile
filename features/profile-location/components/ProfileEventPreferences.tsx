import { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, TextInput, View } from 'react-native';
import { Check, ChevronDown, Search, X } from 'lucide-react-native';
import { Typography } from '@/components/ui';
import {
  APP_CARD_BG,
  APP_DARK_BG,
  APP_DARK_MUTED,
  APP_DARK_SURFACE,
  APP_INPUT_BG,
} from '@/constants/app-surface';
import type { TicketmasterPreferenceCategory } from '@/services/ticketmaster/types';
import { colors, radius, spacing } from '@/theme/tokens';

interface ProfileEventPreferencesProps {
  categories: TicketmasterPreferenceCategory[];
  selectedCategoryIds: string[];
  selectedGenreIds: string[];
  onCategoryIdsChange: (ids: string[]) => void;
  onGenreIdsChange: (ids: string[]) => void;
  loading?: boolean;
}

export function ProfileEventPreferences({
  categories,
  selectedCategoryIds,
  selectedGenreIds,
  onCategoryIdsChange,
  onGenreIdsChange,
  loading = false,
}: ProfileEventPreferencesProps) {
  const [genreSheetOpen, setGenreSheetOpen] = useState(false);
  const [search, setSearch] = useState('');

  const selectedCategories = categories.filter((category) =>
    selectedCategoryIds.includes(category.id),
  );
  const visibleCategories = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return selectedCategories
      .map((category) => ({
        ...category,
        genres: category.genres.filter(
          (genre) => !normalizedSearch || genre.name.toLowerCase().includes(normalizedSearch),
        ),
      }))
      .filter((category) => category.genres.length > 0);
  }, [search, selectedCategories]);

  const toggleCategory = (categoryId: string) => {
    const selected = selectedCategoryIds.includes(categoryId);
    if (selected && selectedCategoryIds.length === 1) return;

    const nextCategoryIds = selected
      ? selectedCategoryIds.filter((id) => id !== categoryId)
      : [...selectedCategoryIds, categoryId];
    const allowedGenreIds = new Set(
      categories
        .filter((category) => nextCategoryIds.includes(category.id))
        .flatMap((category) => category.genres.map((genre) => genre.id)),
    );

    onCategoryIdsChange(nextCategoryIds);
    onGenreIdsChange(selectedGenreIds.filter((id) => allowedGenreIds.has(id)));
  };

  const toggleGenre = (genreId: string) => {
    onGenreIdsChange(
      selectedGenreIds.includes(genreId)
        ? selectedGenreIds.filter((id) => id !== genreId)
        : [...selectedGenreIds, genreId],
    );
  };

  return (
    <View style={{ gap: spacing.md }}>
      <View style={{ gap: spacing.xs }}>
        <Typography style={{ color: colors.white, fontSize: 14, fontWeight: '600' }}>
          Categories
        </Typography>
        <Typography style={{ color: APP_DARK_MUTED, fontSize: 12, lineHeight: 17 }}>
          Choose at least one. Music and Sports are selected by default.
        </Typography>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: 4 }}>
          {categories.map((category) => {
            const selected = selectedCategoryIds.includes(category.id);
            return (
              <Pressable
                key={category.id}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: selected }}
                onPress={() => toggleCategory(category.id)}
                style={{
                  minHeight: 40,
                  paddingHorizontal: spacing.md,
                  borderRadius: radius.full,
                  borderWidth: 1,
                  borderColor: selected ? colors.pulse[600] : APP_DARK_SURFACE,
                  backgroundColor: selected ? '#10275D' : APP_INPUT_BG,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                {selected ? <Check size={15} color={colors.white} strokeWidth={2.5} /> : null}
                <Typography
                  style={{
                    color: colors.white,
                    fontSize: 14,
                    fontWeight: selected ? '700' : '500',
                  }}
                >
                  {category.name}
                </Typography>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={{ gap: spacing.xs }}>
        <Typography style={{ color: colors.white, fontSize: 14, fontWeight: '600' }}>
          Preferred genres
        </Typography>
        <Pressable
          accessibilityRole="button"
          disabled={loading || selectedCategories.length === 0}
          onPress={() => setGenreSheetOpen(true)}
          style={{
            minHeight: 44,
            borderWidth: 1,
            borderColor: APP_DARK_SURFACE,
            borderRadius: radius.md,
            backgroundColor: APP_INPUT_BG,
            paddingHorizontal: spacing.md,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            opacity: loading ? 0.6 : 1,
          }}
        >
          <Typography style={{ color: colors.white, fontSize: 14 }} numberOfLines={1}>
            {loading
              ? 'Loading Ticketmaster genres…'
              : selectedGenreIds.length === 0
                ? 'All genres'
                : `${selectedGenreIds.length} genre${selectedGenreIds.length === 1 ? '' : 's'} selected`}
          </Typography>
          <ChevronDown size={18} color={APP_DARK_MUTED} />
        </Pressable>
        <Typography style={{ color: APP_DARK_MUTED, fontSize: 12, lineHeight: 17 }}>
          Leave this as All genres to include every genre in your selected categories.
        </Typography>
      </View>

      <Modal
        visible={genreSheetOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setGenreSheetOpen(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.6)',
            justifyContent: 'flex-end',
          }}
        >
          <View
            style={{
              maxHeight: '82%',
              minHeight: '58%',
              backgroundColor: APP_CARD_BG,
              borderTopLeftRadius: radius.xl,
              borderTopRightRadius: radius.xl,
              paddingTop: spacing.md,
              paddingBottom: spacing['2xl'],
            }}
          >
            <View
              style={{
                paddingHorizontal: spacing.lg,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: spacing.md,
              }}
            >
              <View>
                <Typography style={{ color: colors.white, fontSize: 19, fontWeight: '800' }}>
                  Select genres
                </Typography>
                <Typography style={{ color: APP_DARK_MUTED, fontSize: 12, marginTop: 2 }}>
                  Select as many as you like
                </Typography>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close genre selector"
                hitSlop={8}
                onPress={() => setGenreSheetOpen(false)}
              >
                <X size={22} color={colors.white} />
              </Pressable>
            </View>

            <View
              style={{
                marginHorizontal: spacing.lg,
                marginBottom: spacing.md,
                minHeight: 44,
                borderRadius: radius.md,
                backgroundColor: APP_DARK_SURFACE,
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: spacing.md,
                gap: spacing.sm,
              }}
            >
              <Search size={17} color={APP_DARK_MUTED} />
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search genres"
                placeholderTextColor={APP_DARK_MUTED}
                autoCapitalize="none"
                autoCorrect={false}
                style={{
                  flex: 1,
                  color: colors.white,
                  fontSize: 15,
                  paddingVertical: 10,
                }}
              />
            </View>

            <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
              {visibleCategories.map((category) => (
                <View key={category.id}>
                  <Typography
                    style={{
                      color: APP_DARK_MUTED,
                      fontSize: 12,
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      letterSpacing: 0.6,
                      paddingHorizontal: spacing.lg,
                      paddingTop: spacing.md,
                      paddingBottom: spacing.sm,
                    }}
                  >
                    {category.name}
                  </Typography>
                  {category.genres.map((genre) => {
                    const selected = selectedGenreIds.includes(genre.id);
                    return (
                      <Pressable
                        key={genre.id}
                        accessibilityRole="checkbox"
                        accessibilityState={{ checked: selected }}
                        onPress={() => toggleGenre(genre.id)}
                        style={{
                          minHeight: 48,
                          paddingHorizontal: spacing.lg,
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          borderBottomWidth: 1,
                          borderBottomColor: APP_DARK_BG,
                        }}
                      >
                        <Typography
                          style={{
                            color: selected ? colors.white : '#D0D0D0',
                            fontSize: 15,
                            fontWeight: selected ? '700' : '500',
                          }}
                        >
                          {genre.name}
                        </Typography>
                        <View
                          style={{
                            width: 22,
                            height: 22,
                            borderRadius: 5,
                            borderWidth: 1.5,
                            borderColor: selected ? colors.pulse[600] : APP_DARK_MUTED,
                            backgroundColor: selected ? colors.pulse[600] : 'transparent',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {selected ? (
                            <Check size={15} color={colors.white} strokeWidth={3} />
                          ) : null}
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              ))}
            </ScrollView>

            <Pressable
              accessibilityRole="button"
              onPress={() => {
                setGenreSheetOpen(false);
                setSearch('');
              }}
              style={{
                minHeight: 48,
                marginHorizontal: spacing.lg,
                marginTop: spacing.md,
                borderRadius: radius.md,
                backgroundColor: colors.pulse[600],
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography style={{ color: colors.white, fontSize: 15, fontWeight: '800' }}>
                Done
              </Typography>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
