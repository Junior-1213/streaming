import { useState, useEffect } from 'react';

export function useTMDB<T>(fetchFn: () => Promise<T>) {
  const [data, setData] = useState<T | []>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const result = await fetchFn();
        setData(result);
      } catch (err) {
        setError('Failed to fetch data from TMDB');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [fetchFn]);

  return { data, loading, error };
}
