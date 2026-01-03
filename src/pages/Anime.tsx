import React, { useState, useCallback } from 'react';
import { MediaGrid } from '../components/MediaGrid';
import { SkeletonCard } from '../components/SkeletonCard';
import { FilterOptions } from '../components/FilterModal';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { tmdbService } from '../services/tmdb';
import { Filter, Loader, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SORT_OPTIONS = [
  { value: 'popularity.desc', label: 'Popularity ↓' },
  { value: 'popularity.asc', label: 'Popularity ↑' },
  { value: 'vote_average.desc', label: 'Rating ↓' },
  { value: 'vote_average.asc', label: 'Rating ↑' },
  { value: 'release_date.desc', label: 'Newest First' },
  { value: 'release_date.asc', label: 'Oldest First' },
];

const ANIME_GENRES = [
  { id: 10759, name: 'Action & Adventure' },
  { id: 35, name: 'Comedy' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 10765, name: 'Sci-Fi & Fantasy' },
  { id: 9648, name: 'Mystery' },
];

export const Anime: React.FC = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({ genres: [], sortBy: 'popularity.desc' });
  const [tempFilters, setTempFilters] = useState<FilterOptions>({ genres: [], sortBy: 'popularity.desc' });

  const fetchAnime = useCallback(
    (page: number) => tmdbService.fetchAnime(page, filters),
    [filters]
  );

  const { items: anime, loading, hasMore } = useInfiniteScroll({
    fetchFunction: fetchAnime,
    itemsPerPage: 20,
    filters
  });

  const handleApplyFilters = () => {
    setFilters(tempFilters);
    setIsFilterOpen(false);
  };

  const handleResetFilters = () => {
    const resetFilters = { genres: [], sortBy: 'popularity.desc' as const };
    setTempFilters(resetFilters);
    setFilters(resetFilters);
    setIsFilterOpen(false);
  };

  const toggleGenre = (genreId: number) => {
    setTempFilters(prev => ({
      ...prev,
      genres: prev.genres?.includes(genreId)
        ? prev.genres.filter(id => id !== genreId)
        : [...(prev.genres || []), genreId]
    }));
  };

  return (
    <div className="pt-24 pb-20 px-4 md:px-12">
      <header className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-2 uppercase">Anime</h1>
            <p className="text-textSecondary">
              {filters.genres.length > 0 || filters.sortBy !== 'popularity.desc'
                ? 'Filtered results'
                : 'Popular anime series from Japan'}
            </p>
          </div>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex items-center gap-2 px-6 py-3 border rounded-lg font-bold transition-colors ${
              isFilterOpen 
                ? 'bg-primary border-primary text-white' 
                : 'bg-primary/20 border-primary hover:bg-primary/30'
            }`}
          >
            <Filter size={20} />
            <span className="hidden md:inline">Filters</span>
            <ChevronDown 
              size={16} 
              className={`transition-transform ${isFilterOpen ? 'rotate-180' : ''}`}
            />
          </button>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="bg-surface border border-border rounded-lg p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Sort By */}
                  <div>
                    <label className="block text-sm font-bold text-primary mb-3">Sort By</label>
                    <select
                      value={tempFilters.sortBy}
                      onChange={(e) => setTempFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                    >
                      {SORT_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Genres */}
                  <div>
                    <label className="block text-sm font-bold text-primary mb-3">Genres</label>
                    <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto pr-2">
                      {ANIME_GENRES.map(genre => (
                        <button
                          key={genre.id}
                          onClick={() => toggleGenre(genre.id)}
                          className={`px-3 py-2 rounded-lg text-sm transition-all ${
                            tempFilters.genres?.includes(genre.id)
                              ? 'bg-primary text-white'
                              : 'bg-background border border-border text-textSecondary hover:border-primary/50'
                          }`}
                        >
                          {genre.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6 pt-6 border-t border-border">
                  <button
                    onClick={handleResetFilters}
                    className="flex-1 px-6 py-3 bg-background border border-border rounded-lg font-bold hover:bg-white/5 transition-colors"
                  >
                    Reset
                  </button>
                  <button
                    onClick={handleApplyFilters}
                    className="flex-1 px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-colors"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <section>
        {loading && anime.length === 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {[...Array(12)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <>
            <MediaGrid items={anime} />
            
            {/* Loading more indicator */}
            {loading && anime.length > 0 && (
              <div className="flex items-center justify-center py-12">
                <Loader className="animate-spin text-primary" size={40} />
              </div>
            )}

            {/* No more results */}
            {!hasMore && anime.length > 0 && (
              <div className="text-center py-12 text-textSecondary">
                <p>No more anime to load</p>
              </div>
            )}

            {/* No results */}
            {anime.length === 0 && !loading && (
              <div className="text-center py-20 text-textSecondary">
                <p>No anime found with the selected filters</p>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};
