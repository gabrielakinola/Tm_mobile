import { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { useToast } from '@/components/ui/Toast';
import { useTicketmasterEventDetails } from '@/hooks/ticketmaster/useTicketmasterEventDetails';
import { useTicketmasterSearch } from '@/hooks/ticketmaster/useTicketmasterSearch';
import type { TicketmasterEventDetails } from '@/services/ticketmaster/types';
import { radius, spacing } from '@/theme/tokens';
import { SearchInput } from './SearchInput';
import { SearchResultsPanel } from './SearchResultsPanel';

const DEBOUNCE_MS = 400;

interface TicketmasterSearchProps {
  onEventSelected: (event: TicketmasterEventDetails) => void;
}

export function TicketmasterSearch({ onEventSelected }: TicketmasterSearchProps) {
  const { show } = useToast();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [activeShowId, setActiveShowId] = useState<string | undefined>();
  const [isCollapsedAfterSelect, setIsCollapsedAfterSelect] = useState(false);
  const detailsMutation = useTicketmasterEventDetails();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, DEBOUNCE_MS);

    return () => clearTimeout(timeout);
  }, [query]);

  const canSearch = debouncedQuery.length >= 2;
  const searchQuery = useTicketmasterSearch(debouncedQuery, canSearch);
  const groups = useMemo(() => searchQuery.data ?? [], [searchQuery.data]);
  const shouldShowPanel = canSearch && !isCollapsedAfterSelect;

  const handleQueryChange = (value: string) => {
    if (isCollapsedAfterSelect) {
      setIsCollapsedAfterSelect(false);
    }
    setQuery(value);
  };

  const handleSelectShow = async (showId: string) => {
    setActiveShowId(showId);

    try {
      const details = await detailsMutation.mutateAsync(showId);
      onEventSelected(details);
      setIsCollapsedAfterSelect(true);
    } catch {
      show({
        message: 'Unable to load event details right now. Please try again.',
        variant: 'error',
      });
    } finally {
      setActiveShowId(undefined);
    }
  };

  return (
    <View
      style={{
        borderRadius: radius.md,
      }}
    >
      <SearchInput
        value={query}
        onChangeText={handleQueryChange}
        onClear={() => handleQueryChange('')}
      />
      <SearchResultsPanel
        visible={shouldShowPanel}
        isLoading={searchQuery.isFetching}
        groups={groups}
        activeShowId={activeShowId}
        onSelectShow={handleSelectShow}
      />
      <View style={{ height: spacing.xs }} />
    </View>
  );
}
