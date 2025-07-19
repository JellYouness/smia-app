import useApi from '@common/hooks/useApi';
import { useCallback } from 'react';

export interface Setting {
  key: string;
  value: string;
}

const useSettings = () => {
  const fetchApi = useApi();

  const fetchSettings = useCallback(async () => {
    return fetchApi<Setting[]>('/settings', { method: 'GET' });
  }, [fetchApi]);

  const updateSetting = useCallback(
    async (key: string, value: string) => {
      return fetchApi<Setting>(`/settings/${key}`, {
        method: 'PUT',
        data: { value },
        displaySuccess: true,
      });
    },
    [fetchApi]
  );

  return { fetchSettings, updateSetting };
};

export default useSettings;
