import React from 'react';
import { motion } from 'framer-motion';
import { Play, Plus, Check, ChevronDown, Star } from 'lucide-react';
import { tmdbService } from '../services/tmdb';
import { useStore } from '../store/useStore';
import { UnifiedMedia, TMDBMedia } from '../types/tmdb';

interface MediaGridProps {
  items: TMDBMedia[] | UnifiedMedia[];
}

export const MediaGrid: React.FC<MediaGridProps> = ({ items }) => {
  const { setSelectedMedia, myList, addToMyList, removeFromMyList } = useStore();

  const formatMedia = (item: TMDBMedia | UnifiedMedia): UnifiedMedia => {
    if ('posterUrl' in item) {
      return item as UnifiedMedia;
    }
    const tmdbItem = item as TMDBMedia;
    return {
      id: tmdbItem.id.toString(),
      title: tmdbItem.title || tmdbItem.name || 'Untitled',
      description: tmdbItem.overview,
      posterUrl: tmdbService.getImageUrl(tmdbItem.poster_path),
      backdropUrl: tmdbService.getBackdropUrl(tmdbItem.backdrop_path),
      rating: tmdbItem.vote_average?.toFixed(1) || '0.0',
      year: (tmdbItem.release_date || tmdbItem.first_air_date || '').split('-')[0] || 'N/A',
      type: tmdbItem.media_type || (tmdbItem.title ? 'movie' : 'tv')
    };
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
      {items.map((item, index) => {
        const media = formatMedia(item);
        const isInList = myList.some(m => m.id === media.id);

        return (
          <motion.div
            key={`${media.type}-${media.id}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.03 }}
            className="group relative aspect-[2/3] rounded-lg overflow-hidden bg-surface cursor-pointer shadow-lg hover:shadow-primary/20 transition-all"
            onClick={() => setSelectedMedia(media)}
          >
            <img
              src={media.posterUrl}
              alt={media.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4">
              <div className="flex gap-2 mb-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <button className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                  <Play size={16} fill="currentColor" />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    isInList ? removeFromMyList(media.id) : addToMyList(media);
                  }}
                  className="w-8 h-8 rounded-full border border-white/50 flex items-center justify-center text-white hover:border-primary hover:text-primary transition-colors bg-black/40"
                >
                  {isInList ? <Check size={16} /> : <Plus size={16} />}
                </button>
                <button className="w-8 h-8 rounded-full border border-white/50 flex items-center justify-center text-white hover:border-white transition-colors ml-auto bg-black/40">
                  <ChevronDown size={16} />
                </button>
              </div>
              
              <h3 className="text-sm font-bold text-white line-clamp-1 mb-1">{media.title}</h3>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-[10px] text-primary font-bold">
                  <Star size={10} fill="currentColor" />
                  {media.rating}
                </div>
                <span className="text-[10px] text-textSecondary font-medium">{media.year}</span>
                <span className="text-[10px] px-1 border border-textSecondary/30 rounded text-textSecondary uppercase">
                  {media.type}
                </span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
