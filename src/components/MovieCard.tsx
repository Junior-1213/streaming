import React from 'react';
import { motion } from 'framer-motion';
import { Play, Plus, ChevronDown, ThumbsUp } from 'lucide-react';
import { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
  onSelect: (movie: Movie) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onSelect }) => {
  return (
    <motion.div 
      className="relative group h-[140px] min-w-[240px] cursor-pointer rounded-md overflow-hidden bg-surface"
      whileHover={{ 
        scale: 1.1,
        zIndex: 50,
        transition: { duration: 0.3 }
      }}
      onClick={() => onSelect(movie)}
    >
      <img 
        src={movie.thumbnailUrl} 
        alt={movie.title}
        className="w-full h-full object-cover transition-opacity group-hover:opacity-30"
      />
      
      <div className="absolute inset-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/40 to-transparent">
        {/* Título del contenido - posicionado justo encima de los botones */}
        <div className="mb-3">
          <h3 className="text-white font-bold text-sm truncate">{movie.title}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] text-success font-bold">98% Match</span>
            <span className="text-[10px] border border-white/40 px-1 text-white">{movie.rating}</span>
            <span className="text-[10px] text-white">{movie.duration}</span>
          </div>
        </div>
        
        {/* Botones de acción */}
        <div className="flex gap-2">
          <button className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black hover:bg-white/80 transition-colors">
            <Play size={16} fill="currentColor" />
          </button>
          <button className="w-8 h-8 rounded-full border-2 border-white/50 flex items-center justify-center text-white hover:border-white transition-colors">
            <Plus size={16} />
          </button>
          <button className="w-8 h-8 rounded-full border-2 border-white/50 flex items-center justify-center text-white hover:border-white transition-colors">
            <ThumbsUp size={16} />
          </button>
          <button className="w-8 h-8 rounded-full border-2 border-white/50 flex items-center justify-center text-white hover:border-white transition-colors ml-auto">
            <ChevronDown size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
