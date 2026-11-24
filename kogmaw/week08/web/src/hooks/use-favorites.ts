import { mutationOptions, useIsMutating, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addFavorite, deleteFavorite, getFavorites, getFavoriteStatus } from "../api/favorite-api";
import { useAuthStore } from "../stores/auth-store";

const favoritesKey = (sessionId: number) => ["favorites", sessionId] as const;
const favoriteStatusKey = (sessionId: number, movieId: number) =>
  [...favoritesKey(sessionId), "status", movieId] as const;
const toggleFavoriteOptions = (sessionId: number, movieId: number) => mutationOptions({
  mutationKey: [...favoritesKey(sessionId), "toggle", movieId],
  mutationFn: async (isFavorite: boolean) => {
    if (isFavorite) {
      await deleteFavorite(movieId);
    } else {
      await addFavorite(movieId);
    }
  },
});

export function useFavorites(enabled = true) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const sessionId = useAuthStore((state) => state.sessionId);

  return useQuery({
    queryKey: favoritesKey(sessionId),
    queryFn: ({ signal }) => getFavorites(signal),
    enabled: enabled && Boolean(accessToken),
    retry: false,
  });
}

export function useFavoriteStatus(movieId: number, enabled: boolean) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const sessionId = useAuthStore((state) => state.sessionId);

  return useQuery({
    queryKey: favoriteStatusKey(sessionId, movieId),
    queryFn: ({ signal }) => getFavoriteStatus(movieId, signal),
    enabled: enabled && Boolean(accessToken),
    retry: false,
  });
}

export function useToggleFavorite(movieId: number) {
  const queryClient = useQueryClient();
  const sessionId = useAuthStore((state) => state.sessionId);
  const options = toggleFavoriteOptions(sessionId, movieId);
  const pendingCount = useIsMutating({ mutationKey: options.mutationKey, exact: true });
  const mutation = useMutation({
    ...options,
    onSettled: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: favoritesKey(sessionId), exact: true }),
        queryClient.invalidateQueries({ queryKey: favoriteStatusKey(sessionId, movieId), exact: true }),
      ]);
    },
  });

  return { ...mutation, isPending: mutation.isPending || pendingCount > 0 };
}
