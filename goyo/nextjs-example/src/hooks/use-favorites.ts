
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getFavorites,
  getFavoriteStatus,
  createFavorite,
  deleteFavorite,
} from "../api/favorites";

import { useAuthStore } from "../stores/auth-store";

export function useFavorites() {
  const queryClient = useQueryClient();

  const accessToken = useAuthStore(
    (state) => state.accessToken,
  );

  const isLoggedIn = Boolean(accessToken);

  const favoritesQuery = useQuery({
    queryKey: ["favorites", accessToken],
    queryFn: getFavorites,
    enabled: isLoggedIn,
    retry: false,
  });

  const favorites = isLoggedIn
    ? (favoritesQuery.data?.result ?? [])
    : [];

  const bookmarkedIds = favorites.map(
    (favorite) => favorite.movieId,
  );

  const mutation = useMutation({
    mutationFn: async (movieId: number) => {
      const isBookmarked = bookmarkedIds.includes(movieId);

      if (isBookmarked) {
        await deleteFavorite(movieId);
      } else {
        await createFavorite(movieId);
      }
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["favorites"],
      });
    },
  });

  const isBookmarked = (movieId: number): boolean => {
    return bookmarkedIds.includes(movieId);
  };

  const toggleBookmark = async (
    movieId: number,
  ): Promise<void> => {
    if (!isLoggedIn) {
      throw new Error("로그인이 필요한 기능입니다.");
    }

    if (favoritesQuery.isPending) {
      return;
    }

    if (favoritesQuery.isError) {
      throw new Error(
        "북마크 정보를 불러오지 못했습니다.",
      );
    }

    if (mutation.isPending) {
      return;
    }

    await mutation.mutateAsync(movieId);
  };

  return {
    favorites,
    bookmarkedIds,
    isLoggedIn,
    isLoading: isLoggedIn && favoritesQuery.isPending,
    isError: favoritesQuery.isError,
    isPending: mutation.isPending,
    isBookmarked,
    toggleBookmark,
    refetch: favoritesQuery.refetch,
  };
}

export function useFavoriteStatus(movieId: number) {
  const accessToken = useAuthStore(
    (state) => state.accessToken,
  );

  return useQuery({
    queryKey: ["favorites", "status", accessToken, movieId],
    queryFn: () => getFavoriteStatus(movieId),
    enabled: Boolean(accessToken) && movieId > 0,
    retry: false,
  });
}
