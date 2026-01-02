import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { tmdbService } from '../services/tmdb';
import { TMDBMedia } from '../types/tmdb';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<TMDBMedia[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const data = await tmdbService.searchMulti(query);
        setResults(data);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(searchTimeout);
  }, [query]);

  const handleResultClick = (item: TMDBMedia) => {
    const type = item.media_type || (item.title ? 'movie' : 'tv');
    navigate(`/title/${type}/${item.id}`);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-3xl mx-4 bg-surface/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-border overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-4 px-6 py-5 border-b border-border">
              <Search className="text-textSecondary" size={24} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search movies, TV shows..."
                className="flex-1 bg-transparent text-white text-lg placeholder:text-textSecondary focus:outline-none"
              />
              {loading && <Loader className="animate-spin text-primary" size={20} />}
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-4">
              {query.trim().length < 2 ? (
                <div className="text-center py-16 text-textSecondary">
                  <Search size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Start typing to search for movies and TV shows</p>
                </div>
              ) : results.length === 0 && !loading ? (
                <div className="text-center py-16 text-textSecondary">
                  <p>No results found for "{query}"</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {results.map((item) => {
                    const title = item.title || item.name || 'Untitled';
                    const year = (item.release_date || item.first_air_date || '').split('-')[0];
                    const type = item.media_type || (item.title ? 'movie' : 'tv');

                    return (
                      <motion.div
                        key={`${type}-${item.id}`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.05 }}
                        onClick={() => handleResultClick(item)}
                        className="group cursor-pointer"
                      >
                        <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-background mb-2 shadow-lg group-hover:shadow-primary/30 transition-all">
                          <img
                            src={tmdbService.getImageUrl(item.poster_path)}
                            alt={title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <h3 className="text-sm font-bold line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                          {title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-textSecondary">{year}</span>
                          <span className="text-xs px-1.5 py-0.5 bg-surface rounded text-textSecondary uppercase text-[10px]">
                            {type}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
