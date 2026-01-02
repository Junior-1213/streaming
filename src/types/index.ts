export interface Movie {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  backdropUrl: string;
  videoUrl: string;
  duration: string;
  genre: string;
  rating: string;
  year: number;
}

export interface UserProgress {
  movieId: string;
  position: number;
  totalDuration: number;
}
