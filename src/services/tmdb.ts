const TMDB_API_KEY = '619a49df03516a5cb88a02129e33715c';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/original';

// Genre IDs for filtering
export const GENRES = {
  ACTION: 28,
  COMEDY: 35,
  HORROR: 27,
  ANIMATION: 16,
  DRAMA: 18,
  SCIENCE_FICTION: 878,
  FANTASY: 14,
  ROMANCE: 10749,
  DOCUMENTARY: 99,
  THRILLER: 53
};

export const tmdbService = {
  async fetchTrending(): Promise<any[]> {
    const response = await fetch(`${BASE_URL}/trending/all/day?api_key=${TMDB_API_KEY}`);
    const data = await response.json();
    return data.results;
  },

  async fetchPopularMovies(): Promise<any[]> {
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}`);
    const data = await response.json();
    return data.results.map((m: any) => ({ ...m, media_type: 'movie' }));
  },

  async fetchPopularTV(): Promise<any[]> {
    const response = await fetch(`${BASE_URL}/tv/popular?api_key=${TMDB_API_KEY}`);
    const data = await response.json();
    return data.results.map((m: any) => ({ ...m, media_type: 'tv' }));
  },

  async fetchTopRatedMovies(): Promise<any[]> {
    const response = await fetch(`${BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}`);
    const data = await response.json();
    return data.results.map((m: any) => ({ ...m, media_type: 'movie' }));
  },

  async fetchTopRatedTV(): Promise<any[]> {
    const response = await fetch(`${BASE_URL}/tv/top_rated?api_key=${TMDB_API_KEY}`);
    const data = await response.json();
    return data.results.map((m: any) => ({ ...m, media_type: 'tv' }));
  },

  async fetchMoviesByGenre(genreId: number): Promise<any[]> {
    const response = await fetch(
      `${BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreId}&sort_by=popularity.desc`
    );
    const data = await response.json();
    return data.results.map((m: any) => ({ ...m, media_type: 'movie' }));
  },

  async fetchTVByGenre(genreId: number): Promise<any[]> {
    const response = await fetch(
      `${BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&with_genres=${genreId}&sort_by=popularity.desc`
    );
    const data = await response.json();
    return data.results.map((m: any) => ({ ...m, media_type: 'tv' }));
  },

  async fetchMediaDetails(type: 'movie' | 'tv', id: string) {
    const [details, credits, videos] = await Promise.all([
      fetch(`${BASE_URL}/${type}/${id}?api_key=${TMDB_API_KEY}`).then(res => res.json()),
      fetch(`${BASE_URL}/${type}/${id}/credits?api_key=${TMDB_API_KEY}`).then(res => res.json()),
      fetch(`${BASE_URL}/${type}/${id}/videos?api_key=${TMDB_API_KEY}`).then(res => res.json())
    ]);

    return {
      ...details,
      cast: credits.cast?.slice(0, 6) || [],
      trailer: videos.results?.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube') || videos.results?.[0]
    };
  },

  getImageUrl(path: string) {
    return path ? `${IMAGE_BASE_URL}${path}` : 'https://images.pexels.com/photos/4064826/pexels-photo-4064826.jpeg';
  },

  getBackdropUrl(path: string) {
    return path ? `${BACKDROP_BASE_URL}${path}` : 'https://images.pexels.com/photos/4064826/pexels-photo-4064826.jpeg';
  },

  async searchMulti(query: string): Promise<any[]> {
    if (!query.trim()) return [];
    const response = await fetch(
      `${BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&include_adult=false`
    );
    const data = await response.json();
    return data.results.filter((item: any) =>
      (item.media_type === 'movie' || item.media_type === 'tv') && item.poster_path
    );
  },

  async fetchRecommendations(type: 'movie' | 'tv', id: string): Promise<any[]> {
    const response = await fetch(
      `${BASE_URL}/${type}/${id}/recommendations?api_key=${TMDB_API_KEY}`
    );
    const data = await response.json();
    return data.results.map((m: any) => ({ ...m, media_type: type }));
  }
};
