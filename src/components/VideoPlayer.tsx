import React, { useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VideoPlayerProps {
  type: 'movie' | 'tv';
  tmdbId: string;
  title: string;
  season?: number;
  episode?: number;
  onClose: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  type,
  tmdbId,
  title,
  season = 1,
  episode = 1,
  onClose
}) => {
  const [selectedSeason, setSelectedSeason] = useState(season);
  const [selectedEpisode, setSelectedEpisode] = useState(episode);

  // Construct RiveStream URL using Aggregator API
  const getStreamUrl = () => {
    const baseUrl = 'https://rivestream.org/embed/agg';
    if (type === 'movie') {
      return `${baseUrl}?type=movie&id=${tmdbId}`;
    } else {
      return `${baseUrl}?type=tv&id=${tmdbId}&season=${selectedSeason}&episode=${selectedEpisode}`;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm"
        onClick={onClose}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 md:p-6 bg-gradient-to-b from-black/80 to-transparent">
            <div>
              <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
              {type === 'tv' && (
                <p className="text-sm text-textSecondary">
                  Season {selectedSeason} · Episode {selectedEpisode}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={28} />
            </button>
          </div>

          {/* Video Player */}
          <div 
            className="flex-1 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full max-w-7xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
              <iframe
                src={getStreamUrl()}
                className="w-full h-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                title={`${title} Player`}
              />
            </div>
          </div>

          {/* Episode Selector for TV Shows */}
          {type === 'tv' && (
            <div 
              className="p-4 md:p-6 bg-gradient-to-t from-black/80 to-transparent"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="max-w-7xl mx-auto flex flex-wrap gap-4">
                <div>
                  <label className="block text-sm font-bold text-primary mb-2">Season</label>
                  <select
                    value={selectedSeason}
                    onChange={(e) => setSelectedSeason(Number(e.target.value))}
                    className="px-4 py-2 bg-surface border border-border rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        Season {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-primary mb-2">Episode</label>
                  <select
                    value={selectedEpisode}
                    onChange={(e) => setSelectedEpisode(Number(e.target.value))}
                    className="px-4 py-2 bg-surface border border-border rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                  >
                    {[...Array(24)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        Episode {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
