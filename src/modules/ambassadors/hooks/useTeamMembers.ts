import { useState, useCallback } from 'react';
import useApi from '@common/hooks/useApi';
import { TeamMember } from '../defs/types';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Any } from '@common/defs/types';

interface UseTeamMembersProps {
  ambassadorId: number;
}

interface AddTeamMemberData {
  userId: number;
  role?: string;
  isPrimary?: boolean;
}

interface UpdateTeamMemberData {
  role?: string;
  isPrimary?: boolean;
}

export const useTeamMembers = ({ ambassadorId }: UseTeamMembersProps) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const api = useApi();

  const fetchTeamMembers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api(`/ambassadors/${ambassadorId}/team-members`, {
        method: 'GET',
      });
      if (response.success) {
        setTeamMembers(response.data as TeamMember[]);
      } else {
        setError('Failed to fetch team members');
      }
    } catch (err) {
      setError('Failed to fetch team members');
      console.error('Error fetching team members:', err);
    } finally {
      setLoading(false);
    }
  }, [api, ambassadorId]);

  const addTeamMember = useCallback(
    async (data: AddTeamMemberData) => {
      setLoading(true);
      setError(null);

      try {
        const response = await api(`/ambassadors/${ambassadorId}/team-members`, {
          method: 'POST',
          data,
        });
        if (response.success) {
          setTeamMembers((prev) => [...prev, response.data as TeamMember]);
          return { success: true, data: response.data as TeamMember };
        }
        setError('Failed to add team member');
        return { success: false, error: response.errors };
      } catch (err: Any) {
        const errorMessage = err.response?.data?.errors || 'Failed to add team member';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [api, ambassadorId]
  );

  const updateTeamMember = useCallback(
    async (teamMemberId: number, data: UpdateTeamMemberData) => {
      setLoading(true);
      setError(null);

      try {
        const response = await api(`/ambassadors/${ambassadorId}/team-members/${teamMemberId}`, {
          method: 'PUT',
          data,
        });
        if (response.success) {
          setTeamMembers((prev) =>
            prev.map((member) =>
              member.id === teamMemberId ? (response.data as TeamMember) : member
            )
          );
          return { success: true, data: response.data as TeamMember };
        }
        setError('Failed to update team member');
        return { success: false, error: response.errors };
      } catch (err: Any) {
        const errorMessage = err.response?.data?.errors || 'Failed to update team member';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [api, ambassadorId]
  );

  const removeTeamMember = useCallback(
    async (teamMemberId: number) => {
      setLoading(true);
      setError(null);

      try {
        const response = await api(`/ambassadors/${ambassadorId}/team-members/${teamMemberId}`, {
          method: 'DELETE',
        });
        if (response.success) {
          setTeamMembers((prev) => prev.filter((member) => member.id !== teamMemberId));
          return { success: true };
        }
        setError('Failed to remove team member');
        return { success: false, error: response.errors };
      } catch (err: Any) {
        const errorMessage = err.response?.data?.errors || 'Failed to remove team member';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [api, ambassadorId]
  );

  return {
    teamMembers,
    loading,
    error,
    fetchTeamMembers,
    addTeamMember,
    updateTeamMember,
    removeTeamMember,
  };
};
