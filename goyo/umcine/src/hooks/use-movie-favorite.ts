
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import {
  getFavoriteStatus,
  createFavorite,
  deleteFavorite,
} from "../api/favorites";
import { useAuthStore } from "../stores/auth-store";

export function useMovieFavorite(movieId: number) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const accessToken = useAuthStore(
    (state) => state.accessToken,
  );

  const isLoggedIn = Boolean(accessToken);

  const favoriteQuery = useQuery({
    queryKey: ["favorites", "status", movieId],
    queryFn: () => getFavoriteStatus(movieId),
    enabled: isLoggedIn && Number.isFinite(movieId),
  });

  const isFavorite =
    favoriteQuery.data?.result.isFavorite ?? false;

  const mutation = useMutation({
    mutationFn: async () => {
      if (isFavorite) {
        await deleteFavorite(movieId);
      } else {
        await createFavorite(movieId);
      }
    },

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["favorites"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["favorite-movies"],
        }),
      ]);
    },

    onError: () => {
      alert("즐겨찾기 처리에 실패했습니다.");
    },
  });

  function toggleFavorite() {
    if (!isLoggedIn) {
      alert("로그인이 필요한 기능입니다.");
      navigate({ to: "/login" });
      return;
    }

    if (favoriteQuery.isPending || mutation.isPending) {
      return;
    }

    mutation.mutate();
  }

  return {
    isFavorite,
    toggleFavorite,
    isLoading: isLoggedIn && favoriteQuery.isPending,
    isPending: mutation.isPending,
  };
}
