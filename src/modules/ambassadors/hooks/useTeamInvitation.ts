import { useState, useCallback } from 'react';
import useApi from '@common/hooks/useApi';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Any } from '@common/defs/types';

interface InvitationData {
  id: number;
  ambassador: {
    id: number;
    teamName: string;
    user: {
      id: number;
      name: string;
      email: string;
      profile?: {
        avatar?: string;
      };
    };
  };
  user: {
    id: number;
    name: string;
    email: string;
    profile?: {
      avatar?: string;
    };
  };
  role: string | null;
  is_primary: boolean;
  status: string;
  expires_at: string;
  created_at: string;
}

interface UseTeamInvitationProps {
  token: string;
}

export const useTeamInvitation = ({ token }: UseTeamInvitationProps) => {
  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [responding, setResponding] = useState(false);
  const [responseMessage, setResponseMessage] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const api = useApi();

  const fetchInvitation = useCallback(async () => {
    if (!token) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await api(`/team-invitations/${token}`, {
        method: 'GET',
      });

      if (response.success) {
        setInvitation(response.data as InvitationData);
      } else {
        setError(response.errors?.[0] || 'Failed to load invitation');
      }
    } catch (err: Any) {
      setError(err.response?.data?.errors?.[0] || 'Failed to load invitation');
    } finally {
      setLoading(false);
    }
  }, [api, token]);

  const acceptInvitation = useCallback(async () => {
    try {
      setResponding(true);
      setResponseMessage(null);

      const response = await api(`/team-invitations/${token}/accept`, {
        method: 'POST',
      });

      if (response.success) {
        setResponseMessage({
          type: 'success',
          message: response.message || 'Invitation accepted successfully!',
        });
        // Refresh invitation data
        await fetchInvitation();
        return { success: true, data: response.data };
      }

      const errorMessage = response.errors?.[0] || 'Failed to accept invitation';
      setResponseMessage({
        type: 'error',
        message: errorMessage,
      });
      return { success: false, error: errorMessage };
    } catch (err: Any) {
      const errorMessage = err.response?.data?.errors?.[0] || 'Failed to accept invitation';
      setResponseMessage({
        type: 'error',
        message: errorMessage,
      });
      return { success: false, error: errorMessage };
    } finally {
      setResponding(false);
    }
  }, [api, token, fetchInvitation]);

  const declineInvitation = useCallback(async () => {
    try {
      setResponding(true);
      setResponseMessage(null);

      const response = await api(`/team-invitations/${token}/decline`, {
        method: 'POST',
      });

      if (response.success) {
        setResponseMessage({
          type: 'success',
          message: response.message || 'Invitation declined successfully.',
        });
        // Refresh invitation data
        await fetchInvitation();
        return { success: true, data: response.data };
      }

      const errorMessage = response.errors?.[0] || 'Failed to decline invitation';
      setResponseMessage({
        type: 'error',
        message: errorMessage,
      });
      return { success: false, error: errorMessage };
    } catch (err: Any) {
      const errorMessage = err.response?.data?.errors?.[0] || 'Failed to decline invitation';
      setResponseMessage({
        type: 'error',
        message: errorMessage,
      });
      return { success: false, error: errorMessage };
    } finally {
      setResponding(false);
    }
  }, [api, token, fetchInvitation]);

  const clearResponseMessage = useCallback(() => {
    setResponseMessage(null);
  }, []);

  return {
    invitation,
    loading,
    error,
    responding,
    responseMessage,
    fetchInvitation,
    acceptInvitation,
    declineInvitation,
    clearResponseMessage,
  };
};
