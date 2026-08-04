import { useQuery } from '@tanstack/react-query';
import { settingsQueryKey } from '@/features/settings/settings-query-key';
import { getUserSettings } from '@/services/settings/settings.api';

export function useUserSettings() {
  return useQuery({
    queryKey: settingsQueryKey,
    queryFn: getUserSettings,
  });
}
