import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Filter } from 'lucide-react';

interface Genre {
  id: number;
  name: string;
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterOptions) => void;
  type: 'movie' | 'tv' | 'anime';
}

export interface FilterOptions {
  genres: number[];
  sortBy: 'popularity.desc' | 'popularity.asc' | 'vote_average.desc' | 'vote_average.asc' | 'release_date.desc' | 'release_date.asc';
}

const SORT_OPTIONS = [
  { value: 'popularity.desc', label: 'Popularity (High to Low)' },
  { value: 'popularity.asc', label: 'Popularity (Low to High)' },
  { value: 'vote_average.desc', label: 'Rating (High to Low)' },
  { value: 'vote_average.asc', label: 'Rating (Low to High)' },
  { value: 'release_date.desc', label: 'Release Date (Newest)' },
  { value: 'release_date.asc', label: 'Release Date (Oldest)' },
];

const MOVIE_GENRES: Genre[] = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science Fiction' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' },
];

const TV_GENRES: Genre[] = [
  { id: 10759, name: 'Action & Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 10762, name: 'Kids' },
  { id: 9648, name: 'Mystery' },
  { id: 10763, name: 'News' },
  { id: 10764, name: 'Reality' },
  { id: 10765, name: 'Sci-Fi & Fantasy' },
  { id: 10766, name: 'Soap' },
  { id: 10767, name: 'Talk' },
  { id: 10768, name: 'War & Politics' },
  { id: 37, name: 'Western' },
];

export const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose, onApply, type }) => {
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState<FilterOptions['sortBy']>('popularity.desc');

  const genres = type === 'movie' ? MOVIE_GENRES : TV_GENRES;

  useEffect(() => {
    if (!isOpen) {
      // Reset on close
      setSelectedGenres([]);
      setSortBy('popularity.desc');
    }
  }, [isOpen]);

  const toggleGenre = (genreId: number) => {
    setSelectedGenres(prev =>
      prev.includes(genreId)
        ? prev.filter(id => id !== genreId)
        : [...prev, genreId]
    );
  };

  const handleApply = () => {
    onApply({ genres: selectedGenres, sortBy });
    onClose();
  };

  const handleReset = () => {
    setSelectedGenres([]);
    setSortBy('popularity.desc');
    onApply({ genres: [], sortBy: 'popularity.desc' });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 z-[70] backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[80vh] bg-surface border border-border rounded-xl z-[71] overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border bg-gradient-to-r from-primary/10 to-transparent">
              <div className="flex items-center gap-3">
                <Filter className="text-primary" size={24} />
                <h2 className="text-2xl font-bold">Filter & Sort</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-180px)]">
              {/* Sort Options */}
              <div className="mb-8">
                <h3 className="text-lg font-bold mb-4 text-primary">Sort By</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {SORT_OPTIONS.map(option => (
                    <button
                      key={option.value}
                      onClick={() => setSortBy(option.value as FilterOptions['sortBy'])}
                      className={`p-3 rounded-lg border transition-all text-left ${
                        sortBy === option.value
                          ? 'bg-primary/20 border-primary text-white'
                          : 'bg-surface border-border text-textSecondary hover:border-primary/50'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Genre Selection */}
              <div>
                <h3 className="text-lg font-bold mb-4 text-primary">Genres</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {genres.map(genre => (
                    <button
                      key={genre.id}
                      onClick={() => toggleGenre(genre.id)}
                      className={`p-3 rounded-lg border transition-all text-sm ${
                        selectedGenres.includes(genre.id)
                          ? 'bg-primary/20 border-primary text-white'
                          : 'bg-surface border-border text-textSecondary hover:border-primary/50'
                      }`}
                    >
                      {genre.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-6 border-t border-border bg-gradient-to-r from-primary/5 to-transparent">
              <button
                onClick={handleReset}
                className="flex-1 px-6 py-3 bg-surface border border-border rounded-lg font-bold hover:bg-white/5 transition-colors"
              >
                Reset
              </button>
              <button
                onClick={handleApply}
                className="flex-1 px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
