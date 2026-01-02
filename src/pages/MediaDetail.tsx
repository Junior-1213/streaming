import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Plus, Check, Star, Clock, Calendar, ChevronLeft, Info } from 'lucide-react';
import { tmdbService } from '../services/tmdb';
import { useStore } from '../store/useStore';
import { UnifiedMedia } from '../types/tmdb';
import { HorizontalCarousel } from '../components/HorizontalCarousel';

export const MediaDetail: React.FC = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const { myList, addToMyList, removeFromMyList } = useStore();
  const [details, setDetails] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<UnifiedMedia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadData = async () => {
      if (!id || !type) return;
      setLoading(true);
      try {
        const [data, recs] = await Promise.all([
          tmdbService.fetchMediaDetails(type as 'movie' | 'tv', id),
          tmdbService.fetchRecommendations(type as 'movie' | 'tv', id)
        ]);
        setDetails(data);
        setRecommendations(recs.map(item => ({
          id: item.id.toString(),
          title: item.title || item.name || '',
          description: item.overview,
          posterUrl: tmdbService.getImageUrl(item.poster_path),
          backdropUrl: tmdbService.getBackdropUrl(item.backdrop_path),
          rating: item.vote_average.toFixed(1),
          year: (item.release_date || item.first_air_date || '').split('-')[0],
          type: type as 'movie' | 'tv'
        })));
      } catch (error) {
        console.error("Error loading details:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, type]);

  const mediaObject: UnifiedMedia | null = useMemo(() => {
    if (!details) return null;
    return {
      id: details.id.toString(),
      title: details.title || details.name,
      description: details.overview,
      posterUrl: tmdbService.getImageUrl(details.poster_path),
      backdropUrl: tmdbService.getBackdropUrl(details.backdrop_path),
      rating: details.vote_average.toFixed(1),
      year: (details.release_date || details.first_air_date || '').split('-')[0],
      type: type as 'movie' | 'tv'
    };
  }, [details, type]);

  if (loading) return <div className="h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  if (!details || !mediaObject) return null;

  const isInList = myList.some(m => m.id === mediaObject.id);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background"
    >
      {/* Hero Section */}
      <div className="relative h-[85vh] w-full">
        <div className="absolute inset-0">
          <img 
            src={mediaObject.backdropUrl} 
            alt={mediaObject.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <div className="relative h-full flex flex-col justify-center px-4 md:px-12 max-w-4xl gap-6">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-textSecondary hover:text-white transition-colors mb-8 group"
          >
            <ChevronLeft className="group-hover:-translate-x-1 transition-transform" />
            Back to Browse
          </button>

          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
            {mediaObject.title}
          </h1>

          <div className="flex items-center gap-6 text-lg font-medium">
            <span className="text-success font-bold">98% Match</span>
            <span className="flex items-center gap-1 text-primary">
              <Star size={20} fill="currentColor" />
              {mediaObject.rating}
            </span>
            <span className="text-textSecondary">{mediaObject.year}</span>
            <span className="px-2 py-0.5 border border-textSecondary/50 rounded text-sm uppercase">
              {details.runtime ? `${details.runtime} min` : `${details.number_of_seasons} Seasons`}
            </span>
          </div>

          <p className="text-xl text-textSecondary leading-relaxed max-w-2xl line-clamp-4">
            {mediaObject.description}
          </p>

          <div className="flex items-center gap-4 mt-4">
            <button className="flex items-center gap-3 px-10 py-4 bg-white text-black rounded-lg font-bold text-lg hover:bg-white/90 transition-all transform hover:scale-105">
              <Play fill="currentColor" size={24} />
              Play Now
            </button>
            <button 
              onClick={() => isInList ? removeFromMyList(mediaObject.id) : addToMyList(mediaObject)}
              className="flex items-center gap-3 px-6 py-4 bg-surface/80 backdrop-blur-md border border-border rounded-lg font-bold text-lg hover:bg-surface transition-all"
            >
              {isInList ? <Check size={24} className="text-success" /> : <Plus size={24} />}
              {isInList ? 'In My List' : 'Add to List'}
            </button>
          </div>
        </div>
      </div>

      {/* Detailed Info Section */}
      <div className="px-4 md:px-12 py-16 grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-12">
          <section>
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Info className="text-primary" />
              Synopsis
            </h3>
            <p className="text-textSecondary text-lg leading-relaxed">
              {details.overview}
            </p>
          </section>

          {details.cast && (
            <section>
              <h3 className="text-2xl font-bold mb-6">Top Cast</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {details.cast.slice(0, 8).map((person: any) => (
                  <div key={person.id} className="group">
                    <div className="aspect-square rounded-full overflow-hidden mb-3 border-2 border-transparent group-hover:border-primary transition-colors">
                      <img 
                        src={tmdbService.getImageUrl(person.profile_path)} 
                        alt={person.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="font-bold text-center group-hover:text-primary transition-colors">{person.name}</p>
                    <p className="text-xs text-textSecondary text-center">{person.character}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="space-y-8 bg-surface/30 p-8 rounded-2xl border border-border h-fit">
          <div>
            <h4 className="text-textSecondary text-sm uppercase tracking-widest mb-2">Genres</h4>
            <div className="flex flex-wrap gap-2">
              {details.genres?.map((g: any) => (
                <span key={g.id} className="px-3 py-1 bg-surface rounded-full text-sm border border-border">
                  {g.name}
                </span>
              ))}
            </div>
          </div>
          
          {details.production_companies && (
            <div>
              <h4 className="text-textSecondary text-sm uppercase tracking-widest mb-2">Production</h4>
              <p className="text-white">{details.production_companies[0]?.name}</p>
            </div>
          )}

          <div>
            <h4 className="text-textSecondary text-sm uppercase tracking-widest mb-2">Status</h4>
            <p className="text-white">{details.status}</p>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="pb-20">
          <HorizontalCarousel 
            title="More Like This" 
            items={recommendations} 
          />
        </div>
      )}
    </motion.div>
  );
};
