import React from 'react';
import { MediaGrid } from '../components/MediaGrid';
import { SkeletonCard } from '../components/SkeletonCard';
import { useTMDB } from '../hooks/useTMDB';
import { tmdbService } from '../services/tmdb';

export const TVShows: React.FC = () => {
  const { data: shows, loading } = useTMDB(tmdbService.fetchPopularTV);

  return (
    <div className="pt-24 pb-20 px-4 md:px-12">
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 uppercase">TV Shows</h1>
      </header>
      <section>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {[...Array(12)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <MediaGrid items={shows} />
        )}
      </section>
    </div>
  );
};
