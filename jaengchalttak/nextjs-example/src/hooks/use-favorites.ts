import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addFavorite, deleteFavorite, getFavorites, getFavoriteStatus, type Favorite } from "../api/favorites";
import { useAuthStore } from "../stores/auth-store";

const listKey = (sessionId: number) => ["favorites", sessionId, "list"] as const;
const detailKey = (sessionId: number, movieId: number) => ["favorites", sessionId, "movie", movieId] as const;

export function useFavorites() {
  const { accessToken, sessionId } = useAuthStore();
  return useQuery({
    queryKey: listKey(sessionId),
    queryFn: ({ signal }) => getFavorites(signal),
    enabled: Boolean(accessToken),
    retry: false,
  });
}

export function useMovieFavorite(movieId: number, detail: boolean) {
  const { accessToken, sessionId } = useAuthStore();
  const client = useQueryClient();
  const list = useQuery({
    queryKey: listKey(sessionId),
    queryFn: ({ signal }) => getFavorites(signal),
    enabled: Boolean(accessToken) && !detail,
    retry: false,
  });
  const queryKey = detailKey(sessionId, movieId);
  const status = useQuery({
    queryKey,
    queryFn: ({ signal }) => getFavoriteStatus(movieId, signal),
    enabled: Boolean(accessToken) && detail,
    retry: false,
  });

  const mutation = useMutation({
    scope: { id: `favorite-${sessionId}-${movieId}` },
    mutationFn: async (isFavorite: boolean) => {
      if (sessionId !== useAuthStore.getState().sessionId) throw new Error("세션이 변경되었어요.");
      return isFavorite ? deleteFavorite(movieId) : addFavorite(movieId);
    },
    onSuccess: async (favorite) => {
      await Promise.all([
        client.cancelQueries({ queryKey }),
        client.cancelQueries({ queryKey: listKey(sessionId) }),
      ]);
      if (sessionId !== useAuthStore.getState().sessionId) return;
      client.setQueryData(queryKey, { isFavorite: favorite !== null });
      if (!client.getQueryData<Favorite[]>(listKey(sessionId))) {
        void client.invalidateQueries({ queryKey: listKey(sessionId) });
        return;
      }
      client.setQueryData<Favorite[]>(listKey(sessionId), (previous) => {
        if (!previous) return undefined;
        const remaining = previous.filter((item) => item.movieId !== movieId);
        return favorite ? [favorite, ...remaining] : remaining;
      });
    },
    onError: () => {
      if (sessionId === useAuthStore.getState().sessionId) {
        void client.invalidateQueries({ queryKey: ["favorites", sessionId] });
      }
    },
  });

  return {
    accessToken,
    isFavorite: detail ? status.data?.isFavorite : list.data?.some((item) => item.movieId === movieId),
    isError: detail ? status.isError : list.isError,
    retry: detail ? status.refetch : list.refetch,
    mutation,
  };
}
