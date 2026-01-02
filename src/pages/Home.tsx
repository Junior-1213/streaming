import React, { useMemo, useCallback } from 'react';
import { HorizontalCarousel } from '../components/HorizontalCarousel';
import { useTMDB } from '../hooks/useTMDB';
import { tmdbService, GENRES } from '../services/tmdb';
import { TMDBMedia, UnifiedMedia } from '../types/tmdb';

// Helper to format TMDB data to unified format
const formatMedia = (item: TMDBMedia): UnifiedMedia => ({
  id: item.id.toString(),
  title: item.title || item.name || 'Untitled',
  description: item.overview,
  posterUrl: tmdbService.getImageUrl(item.poster_path),
  backdropUrl: tmdbService.getBackdropUrl(item.backdrop_path),
  rating: item.vote_average?.toFixed(1) || '0.0',
  year: (item.release_date || item.first_air_date || '').split('-')[0] || 'N/A',
  type: item.media_type || (item.title ? 'movie' : 'tv')
});

export const Home: React.FC = () => {
  // Estabilizamos las funciones de fetch para evitar re-renders infinitos
  const fetchAction = useCallback(() => tmdbService.fetchMoviesByGenre(GENRES.ACTION), []);
  const fetchComedy = useCallback(() => tmdbService.fetchMoviesByGenre(GENRES.COMEDY), []);
  const fetchHorror = useCallback(() => tmdbService.fetchMoviesByGenre(GENRES.HORROR), []);
  const fetchAnimation = useCallback(() => tmdbService.fetchMoviesByGenre(GENRES.ANIMATION), []);

  // Fetch data
  const { data: trending, loading: trendingLoading } = useTMDB(tmdbService.fetchTrending);
  const { data: popularMovies, loading: popularMoviesLoading } = useTMDB(tmdbService.fetchPopularMovies);
  const { data: popularTV, loading: popularTVLoading } = useTMDB(tmdbService.fetchPopularTV);
  const { data: actionMovies, loading: actionLoading } = useTMDB(fetchAction);
  const { data: comedyMovies, loading: comedyLoading } = useTMDB(fetchComedy);
  const { data: horrorMovies, loading: horrorLoading } = useTMDB(fetchHorror);
  const { data: animationMovies, loading: animationLoading } = useTMDB(fetchAnimation);

  // Memorizamos los datos formateados para que la referencia sea estable
  const trendingFormatted = useMemo(() => (Array.isArray(trending) ? trending.map(formatMedia) : []), [trending]);
  const popularMoviesFormatted = useMemo(() => (Array.isArray(popularMovies) ? popularMovies.map(formatMedia) : []), [popularMovies]);
  const popularTVFormatted = useMemo(() => (Array.isArray(popularTV) ? popularTV.map(formatMedia) : []), [popularTV]);
  const actionFormatted = useMemo(() => (Array.isArray(actionMovies) ? actionMovies.map(formatMedia) : []), [actionMovies]);
  const comedyFormatted = useMemo(() => (Array.isArray(comedyMovies) ? comedyMovies.map(formatMedia) : []), [comedyMovies]);
  const horrorFormatted = useMemo(() => (Array.isArray(horrorMovies) ? horrorMovies.map(formatMedia) : []), [horrorMovies]);
  const animationFormatted = useMemo(() => (Array.isArray(animationMovies) ? animationMovies.map(formatMedia) : []), [animationMovies]);

  return (
    <div className="pt-24 pb-20">
      {/* Hero Header */}
      <header className="mb-12 px-4 md:px-12">
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">
          EXPLORE <span className="text-primary">LIVE</span>
        </h1>
        <p className="text-textSecondary max-w-xl text-lg">
          Discover the latest trending movies and TV shows directly from the global cinematic database.
        </p>
      </header>

      <div className="space-y-4 md:space-y-8">
        <HorizontalCarousel
          title="Trending Today"
          subtitle="The most watched content in the last 24 hours"
          items={trendingFormatted}
          loading={trendingLoading}
        />

        <HorizontalCarousel
          title="Most Popular Movies"
          subtitle="What everyone is watching right now"
          items={popularMoviesFormatted}
          loading={popularMoviesLoading}
        />

        <HorizontalCarousel
          title="Most Popular TV Shows"
          subtitle="Binge-worthy series everyone's talking about"
          items={popularTVFormatted}
          loading={popularTVLoading}
        />

        <HorizontalCarousel
          title="Action & Adventure"
          subtitle="High-octane thrills and explosive entertainment"
          items={actionFormatted}
          loading={actionLoading}
        />

        <HorizontalCarousel
          title="Comedy"
          subtitle="Laugh-out-loud movies and hilarious series"
          items={comedyFormatted}
          loading={comedyLoading}
        />

        <HorizontalCarousel
          title="Horror & Thriller"
          subtitle="Spine-chilling scares and suspenseful stories"
          items={horrorFormatted}
          loading={horrorLoading}
        />

        <HorizontalCarousel
          title="Animation & Anime"
          subtitle="Animated masterpieces for all ages"
          items={animationFormatted}
          loading={animationLoading}
        />
      </div>
    </div>
  );
};
