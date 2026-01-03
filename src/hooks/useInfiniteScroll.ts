import { useState, useEffect, useCallback, useRef } from 'react';

interface UseInfiniteScrollOptions<T> {
  fetchFunction: (page: number, filters?: any) => Promise<T[]>;
  itemsPerPage?: number;
  filters?: any;
}

interface UseInfiniteScrollReturn<T> {
  items: T[];
  loading: boolean;
  hasMore: boolean;
  loadMore: () => void;
  reset: () => void;
}

export function useInfiniteScroll<T>({
  fetchFunction,
  itemsPerPage = 20,
  filters = {}
}: UseInfiniteScrollOptions<T>): UseInfiniteScrollReturn<T> {
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loadingRef = useRef(false);

  // Reset when filters change
  useEffect(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
  }, [JSON.stringify(filters)]);

  // Fetch data
  const fetchData = useCallback(async (pageNum: number) => {
    if (loadingRef.current) return;
    
    loadingRef.current = true;
    setLoading(true);

    try {
      const newItems = await fetchFunction(pageNum, filters);
      
      if (newItems.length < itemsPerPage) {
        setHasMore(false);
      }

      setItems(prev => pageNum === 1 ? newItems : [...prev, ...newItems]);
    } catch (error) {
      console.error('Error fetching data:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [fetchFunction, filters, itemsPerPage]);

  // Load initial data and when page changes
  useEffect(() => {
    fetchData(page);
  }, [page, fetchData]);

  // Load more function
  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  }, [loading, hasMore]);

  // Reset function
  const reset = useCallback(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
  }, []);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      if (loading || !hasMore) return;

      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;

      // Load more when user is 300px from bottom
      if (scrollHeight - scrollTop - clientHeight < 300) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore, loadMore]);

  return {
    items,
    loading,
    hasMore,
    loadMore,
    reset
  };
}
