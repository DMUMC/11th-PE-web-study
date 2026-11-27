import { apiRequest } from './account';

export interface Favorite {
  favoriteId: number;
  movieId: number;
  createdAt: string;
}

export interface RatingInput {
  score: number;
  comment: string;
}

export interface Rating {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  updatedAt: string;
}

export const memberMovies = {
  favorites: (signal: AbortSignal) => apiRequest<Favorite[]>('/favorites', { signal }),
  favoriteStatus: (movieId: number, signal: AbortSignal) =>
    apiRequest<{ isFavorite: boolean }>(`/favorites/${movieId}`, { signal }),
  addFavorite: (movieId: number) =>
    apiRequest<Favorite>('/favorites', { method: 'POST', body: JSON.stringify({ movieId }) }),
  removeFavorite: (movieId: number) =>
    apiRequest<null>(`/favorites/${movieId}`, { method: 'DELETE' }),
  ratings: (memberId: number, signal: AbortSignal) =>
    apiRequest<Rating[]>(`/members/${memberId}/ratings`, { signal }),
  addRating: (movieId: number, input: RatingInput) =>
    apiRequest<Rating>('/ratings', { method: 'POST', body: JSON.stringify({ movieId, ...input }) }),
  editRating: (ratingId: number, input: RatingInput) =>
    apiRequest<Rating>(`/ratings/${ratingId}`, { method: 'PATCH', body: JSON.stringify(input) }),
  removeRating: (ratingId: number) =>
    apiRequest<null>(`/ratings/${ratingId}`, { method: 'DELETE' }),
};
