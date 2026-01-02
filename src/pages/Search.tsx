import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader, Search as SearchIcon } from 'lucide-react';
import { tmdbService } from '../services/tmdb';
import { TMDBMedia } from '../types/tmdb';
import { MediaGrid } from '../components/MediaGrid';

export const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<TMDBMedia[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = searchParams.get('q') || '';
    setQuery(q);

    if (q.trim().length >= 2) {
      performSearch(q);
    }
  }, [searchParams]);

  const performSearch = async (searchQuery: string) => {
    setLoading(true);
    try {
      const data = await tmdbService.searchMulti(searchQuery);
      setResults(data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length >= 2) {
      setSearchParams({ q: query });
      performSearch(query);
    }
  };

  return (
    <div className="pt-24 pb-20 px-4 md:px-12 min-h-screen">
      <form onSubmit={handleSearch} className="mb-12">
        <div className="flex gap-3 max-w-2xl">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-textSecondary" size={20} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search movies and TV shows..."
              className="w-full pl-12 pr-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:border-primary text-white placeholder:text-textSecondary transition-colors"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      <div>
        <h2 className="text-2xl font-bold mb-8">
          {query.trim().length < 2
            ? 'Start searching'
            : loading
            ? 'Searching...'
            : results.length > 0
            ? `Results for "${query}" (${results.length})`
            : `No results found for "${query}"`}
        </h2>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader className="animate-spin text-primary" size={40} />
          </div>
        ) : results.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <MediaGrid items={results} />
          </motion.div>
        ) : query.trim().length >= 2 ? (
          <div className="text-center py-20 text-textSecondary">
            <SearchIcon size={48} className="mx-auto mb-4 opacity-50" />
            <p>Try searching for something else</p>
          </div>
        ) : (
          <div className="text-center py-20 text-textSecondary">
            <SearchIcon size={48} className="mx-auto mb-4 opacity-50" />
            <p>Enter at least 2 characters to search</p>
          </div>
        )}
      </div>
    </div>
  );
};
