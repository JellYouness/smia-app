import { useState, useEffect } from 'react';
import useItems from '@common/hooks/useItems';
import AmbassadorsApiRoutes from '../defs/api-routes';
import { Ambassador } from '../defs/types';

interface UseBrowseAmbassadorsOptions {
  searchTerm?: string;
  statusFilter?: string;
  locationFilter?: string;
}

interface UseBrowseAmbassadorsReturn {
  ambassadors: (Ambassador & {
    user?: {
      id: number;
      name: string;
      email: string;
      profile?: {
        avatar?: string;
      };
    };
  })[];
  loading: boolean;
  error: string | null;
  filteredAmbassadors: (Ambassador & {
    user?: {
      id: number;
      name: string;
      email: string;
      profile?: {
        avatar?: string;
      };
    };
  })[];
  refetch: () => Promise<void>;
}

export const useBrowseAmbassadors = (
  options: UseBrowseAmbassadorsOptions = {}
): UseBrowseAmbassadorsReturn => {
  const { searchTerm = '', statusFilter = 'ALL', locationFilter = '' } = options;
  const { readAll } = useItems(AmbassadorsApiRoutes);

  const [ambassadors, setAmbassadors] = useState<
    (Ambassador & {
      user?: {
        id: number;
        name: string;
        email: string;
        profile?: {
          avatar?: string;
        };
      };
    })[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAmbassadors = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await readAll();
      if (response.data && response.data.items) {
        setAmbassadors(response.data.items as any);
      }
    } catch (err) {
      setError('Failed to load ambassadors');
      console.error('Error loading ambassadors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAmbassadors();
  }, []);

  const filteredAmbassadors = ambassadors.filter((ambassador) => {
    const user = ambassador.user || {};
    const matchesSearch =
      (user as any).name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user as any).email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ambassador.teamName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ambassador.specializations?.some((spec: string) =>
        spec.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesStatus = statusFilter === 'ALL' || ambassador.applicationStatus === statusFilter;

    const matchesLocation =
      !locationFilter ||
      ambassador.businessCity?.toLowerCase().includes(locationFilter.toLowerCase()) ||
      ambassador.businessCountry?.toLowerCase().includes(locationFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesLocation;
  });

  return {
    ambassadors,
    loading,
    error,
    filteredAmbassadors,
    refetch: loadAmbassadors,
  };
};
