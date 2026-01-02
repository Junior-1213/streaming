import React from 'react';
import { Play, Info } from 'lucide-react';
import { Movie } from '../types';

interface HeroProps {
  movie: Movie;
  onPlay: (movie: Movie) => void;
}

export const Hero: React.FC<HeroProps> = ({ movie, onPlay }) => {
  return (
    <div className="relative h-[85vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <img 
          src={movie.backdropUrl} 
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#171717] via-transparent to-transparent" />
      </div>
      
      <div className="relative h-full flex flex-col justify-center px-4 md:px-12 max-w-2xl">
        <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tight">
          {movie.title}
        </h1>
        <p className="text-lg text-white/90 mb-8 line-clamp-3 leading-relaxed">
          {movie.description}
        </p>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onPlay(movie)}
            className="flex items-center gap-2 px-8 py-3 bg-white text-black rounded font-bold hover:bg-white/90 transition-colors"
          >
            <Play fill="currentColor" size={24} />
            Play
          </button>
          <button className="flex items-center gap-2 px-8 py-3 bg-white/20 text-white rounded font-bold hover:bg-white/30 transition-all backdrop-blur-md">
            <Info size={24} />
            More Info
          </button>
        </div>
      </div>
    </div>
  );
};
