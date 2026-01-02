import React from 'react';
import { motion } from 'framer-motion';
import { Play, Plus, Check, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { UnifiedMedia } from '../types/tmdb';

interface MediaCardProps {
  media: UnifiedMedia;
  showRanking?: boolean;
  rank?: number;
}

export const MediaCard: React.FC<MediaCardProps> = ({ media, showRanking = false, rank }) => {
  const navigate = useNavigate();
  const { setSelectedMedia, myList, addToMyList, removeFromMyList } = useStore();
  const isInList = myList.some(m => m.id === media.id);

  const handleCardClick = () => {
    navigate(`/title/${media.type}/${media.id}`);
  };

  const handleOpenModal = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    setSelectedMedia(media);
  };

  const handleToggleList = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    isInList ? removeFromMyList(media.id) : addToMyList(media);
  };

  return (
    <motion.div
      whileHover={{ 
        scale: 1.05,
        y: -8,
        transition: { duration: 0.2 }
      }}
      className="relative group w-full cursor-pointer overflow-hidden" 
      onClick={handleCardClick}
    >
      {showRanking && rank && (
        <div className="absolute -left-4 -top-4 z-20">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center text-white font-black text-lg shadow-lg">
              {rank}
            </div>
          </div>
        </div>
      )}
      
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-surface shadow-lg group-hover:shadow-primary/30 transition-all duration-300">
        <img
          src={media.posterUrl}
          alt={media.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4">
          {/* Título del contenido - posicionado justo encima de los botones */}
          <div className="mb-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="text-white font-bold text-sm md:text-base line-clamp-2 leading-tight">
              {media.title}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-success font-semibold">98% Match</span>
              <span className="text-xs border border-white/40 px-1.5 py-0.5 rounded text-white">
                {media.rating || 'NR'}
              </span>
              <span className="text-xs text-textSecondary">
                {media.type === 'movie' ? 'Movie' : 'Series'}
              </span>
            </div>
          </div>
          
          {/* Botones de acción */}
          <div className="flex items-center justify-between transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <div className="flex gap-2">
              <button 
                className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center hover:bg-primary hover:text-white transition-colors shadow-lg"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <Play size={16} fill="currentColor" />
              </button>
              <button 
                onClick={handleToggleList}
                className="w-9 h-9 rounded-full bg-black/60 border border-white/30 flex items-center justify-center text-white hover:bg-primary hover:border-primary transition-colors shadow-lg"
              >
                {isInList ? <Check size={18} /> : <Plus size={18} />}
              </button>
            </div>
            
            <button 
              onClick={handleOpenModal}
              className="w-9 h-9 rounded-full bg-black/60 border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors shadow-lg"
              title="More Info"
            >
              <ChevronDown size={20} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
