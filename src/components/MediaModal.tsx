import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Plus, Check, Volume2, VolumeX, Star, Info } from 'lucide-react';
import ReactPlayer from 'react-player/youtube';
import { useStore } from '../store/useStore';
import { tmdbService } from '../services/tmdb';

export const MediaModal: React.FC = () => {
  const { selectedMedia, isModalOpen, closeModal, myList, addToMyList, removeFromMyList } = useStore();
  const [details, setDetails] = useState<any>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (selectedMedia) {
      tmdbService.fetchMediaDetails(selectedMedia.type, selectedMedia.id)
        .then(setDetails);
    } else {
      setDetails(null);
    }
  }, [selectedMedia]);

  if (!selectedMedia) return null;

  const isInList = myList.some(m => m.id === selectedMedia.id);

  return (
    <AnimatePresence>
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-5xl max-h-[90vh] bg-surface rounded-xl overflow-hidden shadow-2xl overflow-y-auto no-scrollbar"
          >
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
            >
              <X size={24} />
            </button>

            {/* Hero Section with Video */}
            <div className="relative aspect-video w-full bg-black">
              {details?.trailer ? (
                <ReactPlayer
                  url={`https://www.youtube.com/watch?v=${details.trailer.key}`}
                  playing={isPlaying}
                  muted={isMuted}
                  width="100%"
                  height="100%"
                  controls={false}
                  onEnded={() => setIsPlaying(false)}
                  config={{ playerVars: { showinfo: 0, rel: 0, modestbranding: 1 } }}
                />
              ) : (
                <img 
                  src={selectedMedia.backdropUrl} 
                  alt={selectedMedia.title}
                  className="w-full h-full object-cover"
                />
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
              
              <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between">
                <div className="flex flex-col gap-4 max-w-2xl">
                  <h2 className="text-4xl md:text-6xl font-black tracking-tighter drop-shadow-lg">
                    {selectedMedia.title}
                  </h2>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="flex items-center gap-2 px-8 py-3 bg-white text-black rounded-md font-bold hover:bg-white/90 transition-colors"
                    >
                      <Play fill="currentColor" size={20} />
                      {isPlaying ? 'Pause' : 'Play'}
                    </button>
                    <button 
                      onClick={() => isInList ? removeFromMyList(selectedMedia.id) : addToMyList(selectedMedia)}
                      className="w-12 h-12 rounded-full border-2 border-white/50 flex items-center justify-center text-white hover:border-white transition-colors bg-black/20"
                    >
                      {isInList ? <Check size={24} /> : <Plus size={24} />}
                    </button>
                  </div>
                </div>
                
                <button 
                  onClick={() => setIsMuted(!isMuted)}
                  className="w-12 h-12 rounded-full border-2 border-white/50 flex items-center justify-center text-white hover:border-white transition-colors bg-black/20"
                >
                  {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                </button>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="md:col-span-2 space-y-6">
                <div className="flex items-center gap-3 text-sm font-bold">
                  <span className="text-success">98% Match</span>
                  <span className="text-textSecondary">{selectedMedia.year}</span>
                  <span className="px-1.5 py-0.5 border border-textSecondary/50 rounded text-[10px] uppercase">
                    {details?.adult ? '18+' : 'PG-13'}
                  </span>
                  <span className="flex items-center gap-1 text-primary">
                    <Star size={14} fill="currentColor" />
                    {selectedMedia.rating}
                  </span>
                  <div className="flex gap-1">
                    <span className="px-1 border border-textSecondary/30 rounded text-[8px]">HD</span>
                    <span className="px-1 border border-textSecondary/30 rounded text-[8px]">4K</span>
                  </div>
                </div>

                <p className="text-lg leading-relaxed text-textSecondary">
                  {selectedMedia.description}
                </p>
              </div>

              <div className="space-y-4 text-sm">
                <div>
                  <span className="text-textSecondary">Cast: </span>
                  {details?.cast?.map((c: any) => c.name).join(', ')}
                </div>
                <div>
                  <span className="text-textSecondary">Genres: </span>
                  {details?.genres?.map((g: any) => g.name).join(', ')}
                </div>
                <div>
                  <span className="text-textSecondary">This title is: </span>
                  Exciting, Emotional, Visual Masterpiece
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
