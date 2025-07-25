import { useState } from 'react';
import API_ROUTES from '@common/defs/api-routes';
import useApi from '@common/hooks/useApi';
import { Any } from '@common/defs/types';

export const useSavedProfiles = () => {
  const api = useApi();
  const [savedProfiles, setSavedProfiles] = useState<Any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all saved profiles for the current user
  const getSavedProfiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api(API_ROUTES.SAVED_PROFILES.LIST, { method: 'GET' });
      if (response.success && Array.isArray(response.data)) {
        setSavedProfiles(response.data);
      } else {
        setSavedProfiles([]);
        setError(response.errors?.[0] || 'Failed to fetch saved profiles');
      }
    } catch (err: Any) {
      setSavedProfiles([]);
      setError(err.message || 'Failed to fetch saved profiles');
    } finally {
      setLoading(false);
    }
  };

  // Save a creator profile
  const saveProfile = async (creatorId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api(API_ROUTES.SAVED_PROFILES.SAVE, {
        method: 'POST',
        data: { creator_id: creatorId },
      });
      if (!response.success) {
        setError(response.errors?.[0] || 'Failed to save profile');
      }
    } catch (err: Any) {
      setError(err.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  // Unsave a creator profile
  const unsaveProfile = async (creatorId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api(API_ROUTES.SAVED_PROFILES.UNSAVE(creatorId), {
        method: 'DELETE',
      });
      if (!response.success) {
        setError(response.errors?.[0] || 'Failed to unsave profile');
      }
    } catch (err: Any) {
      setError(err.message || 'Failed to unsave profile');
    } finally {
      setLoading(false);
    }
  };

  // Check if a creator is saved (calls backend, returns Promise<boolean>)
  const isSaved = async (creatorId: number) => {
    try {
      const response = await api(API_ROUTES.SAVED_PROFILES.SHOW(creatorId), { method: 'GET' });
      if (response.success) {
        return (response.data as { saved: boolean }).saved;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  return {
    savedProfiles,
    loading,
    error,
    getSavedProfiles,
    saveProfile,
    unsaveProfile,
    isSaved,
  };
};
