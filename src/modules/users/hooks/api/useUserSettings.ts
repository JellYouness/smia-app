import { useCallback } from 'react';
import useApi from '@common/hooks/useApi';

export interface UserSettings {
  language: string;
  notifications: {
    email: boolean;
    inApp: boolean;
  };
  privacy: 'PUBLIC' | 'PRIVATE' | 'TEAM_ONLY';
}

export interface TwoFAStatus {
  enabled: boolean;
}

export interface TwoFASetup {
  qrCodeUrl: string;
  secret: string;
}

export interface Session {
  id: string | number;
  device: string;
  ipAddress?: string;
  lastActive: string;
  formattedLastActive: string;
  current: boolean;
}

export interface ConnectedAccount {
  provider: string;
  connected: boolean;
}

const useUserSettings = () => {
  const fetchApi = useApi();

  const fetchSettings = useCallback(async () => {
    return fetchApi<UserSettings>('/user/settings', { method: 'GET' });
  }, [fetchApi]);

  const updateSettings = useCallback(
    async (data: Partial<UserSettings>) => {
      return fetchApi<UserSettings>('/user/settings', {
        method: 'PUT',
        data,
        displaySuccess: true,
      });
    },
    [fetchApi]
  );

  const fetch2FAStatus = useCallback(async () => {
    return fetchApi<TwoFAStatus>('/user/2fa', { method: 'GET' });
  }, [fetchApi]);

  const enable2FA = useCallback(async () => {
    return fetchApi<TwoFASetup>('/user/2fa/enable', { method: 'POST' });
  }, [fetchApi]);

  const disable2FA = useCallback(async () => {
    return fetchApi<null>('/user/2fa/disable', { method: 'POST' });
  }, [fetchApi]);

  const fetchSessions = useCallback(async () => {
    return fetchApi<Session[]>('/user/sessions', { method: 'GET' });
  }, [fetchApi]);

  const revokeSession = useCallback(
    async (sessionId: string | number) => {
      return fetchApi<null>(`/user/sessions/${sessionId}`, { method: 'DELETE' });
    },
    [fetchApi]
  );

  const revokeAllSessionsExceptCurrent = useCallback(async () => {
    return fetchApi<null>('/user/sessions', { method: 'DELETE' });
  }, [fetchApi]);

  const fetchConnectedAccounts = useCallback(async () => {
    return fetchApi<ConnectedAccount[]>('/user/connected-accounts', { method: 'GET' });
  }, [fetchApi]);

  const disconnectAccount = useCallback(
    async (provider: string) => {
      return fetchApi<null>(`/user/connected-accounts/${provider}/disconnect`, {
        method: 'POST',
      });
    },
    [fetchApi]
  );

  const connectAccount = useCallback((provider: string) => {
    // Usually a redirect to OAuth
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/user/connected-accounts/${provider}/connect`;
  }, []);

  return {
    fetchSettings,
    updateSettings,
    fetch2FAStatus,
    enable2FA,
    disable2FA,
    fetchSessions,
    revokeSession,
    revokeAllSessionsExceptCurrent,
    fetchConnectedAccounts,
    disconnectAccount,
    connectAccount,
  };
};

export default useUserSettings;
