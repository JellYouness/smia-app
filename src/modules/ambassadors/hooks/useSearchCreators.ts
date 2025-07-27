import { useState, useEffect } from 'react';
import useItems from '@common/hooks/useItems';
import CreatorsApiRoutes from '@modules/creators/defs/api-routes';
import { Creator } from '@modules/creators/defs/types';

interface UseSearchCreatorsOptions {
  searchTerm?: string;
  debounceMs?: number;
}

interface UseSearchCreatorsReturn {
  creators: Creator[];
  loading: boolean;
  error: string | null;
  searchCreators: (term: string) => void;
}

export const useSearchCreators = (
  options: UseSearchCreatorsOptions = {}
): UseSearchCreatorsReturn => {
  const { debounceMs = 300 } = options;
  const { readAll } = useItems(CreatorsApiRoutes);

  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchTerm, debounceMs]);

  // Search creators when debounced search term changes
  useEffect(() => {
    const searchCreators = async () => {
      if (!debouncedSearchTerm.trim()) {
        setCreators([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const filters = [
          {
            filterColumn: 'search',
            filterOperator: 'contains',
            filterValue: debouncedSearchTerm,
          },
        ];

        const response = await readAll(1, 10, undefined, filters);

        if (response.data && response.data.items) {
          setCreators(response.data.items as Creator[]);
        } else {
          setCreators([]);
        }
      } catch (err) {
        setError('Failed to search creators');
        console.error('Error searching creators:', err);
        setCreators([]);
      } finally {
        setLoading(false);
      }
    };

    searchCreators();
  }, [debouncedSearchTerm]);

  const searchCreators = (term: string) => {
    setSearchTerm(term);
  };

  return {
    creators,
    loading,
    error,
    searchCreators,
  };
};
