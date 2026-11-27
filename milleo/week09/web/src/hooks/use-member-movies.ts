import { skipToken, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { memberMovies, type RatingInput } from '../api/member-movies';

const favoriteKey = (memberId?: number) => ['member', memberId, 'favorites'] as const;
const ratingKey = (memberId?: number) => ['member', memberId, 'ratings'] as const;

export function useFavorites(memberId?: number) {
  return useQuery({
    queryKey: favoriteKey(memberId),
    queryFn: memberId ? ({ signal }) => memberMovies.favorites(signal) : skipToken,
  });
}

export function useFavoriteStatus(memberId: number, movieId: number) {
  return useQuery({
    queryKey: [...favoriteKey(memberId), movieId],
    queryFn: ({ signal }) => memberMovies.favoriteStatus(movieId, signal),
  });
}

export function useToggleFavorite(memberId: number, movieId: number) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (wasFavorite: boolean) => {
      if (wasFavorite) await memberMovies.removeFavorite(movieId);
      else await memberMovies.addFavorite(movieId);
    },
    onSettled: () => client.invalidateQueries({ queryKey: favoriteKey(memberId) }),
  });
}

export function useRatings(memberId: number) {
  return useQuery({
    queryKey: ratingKey(memberId),
    queryFn: ({ signal }) => memberMovies.ratings(memberId, signal),
  });
}

type RatingChange =
  | { type: 'create'; input: RatingInput }
  | { type: 'edit'; ratingId: number; input: RatingInput }
  | { type: 'remove'; ratingId: number };

export function useChangeRating(memberId: number, movieId: number) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (change: RatingChange) => {
      switch (change.type) {
        case 'create': return memberMovies.addRating(movieId, change.input);
        case 'edit': return memberMovies.editRating(change.ratingId, change.input);
        case 'remove': return memberMovies.removeRating(change.ratingId);
      }
    },
    onSettled: () => client.invalidateQueries({ queryKey: ratingKey(memberId) }),
  });
}
