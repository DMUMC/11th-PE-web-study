import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getFavorites } from "../api/favorites/get-favorites";
import { getFavoriteStatus, type FavoriteStatus } from "../api/favorites/get-favorite-status";
import { addFavorite } from "../api/favorites/add-favorite";
import { removeFavorite } from "../api/favorites/remove-favorite";
import { getApiErrorMessage } from "../api/api-client";
import { useAuthStore } from "../stores/auth-store";
import { queryKeys } from "./query-keys";

// 마이페이지: GET /favorites
export function useFavoritesQuery() {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: queryKeys.favoriteList,
    queryFn: getFavorites,
    enabled: Boolean(accessToken),
    retry: false,
  });
}

// 영화 상세: GET /favorites/{movieId}
export function useFavoriteStatusQuery(movieId: number) {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: queryKeys.favoriteStatus(movieId),
    queryFn: () => getFavoriteStatus(movieId),
    enabled: Boolean(accessToken),
    retry: false,
  });
}

// POST /favorites, DELETE /favorites/{movieId}
export function useToggleFavoriteMutation(movieId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    // 현재 즐겨찾기 상태를 받아 해제(DELETE) 또는 등록(POST)
    mutationFn: async (isFavorite: boolean): Promise<void> => {
      if (isFavorite) {
        await removeFavorite(movieId);
      } else {
        await addFavorite(movieId);
      }
    },
    onSuccess: (_response, wasFavorite) => {
      // 결과를 확실히 알고 있으므로 상태 캐시는 직접 바꿔요.
      queryClient.setQueryData<FavoriteStatus>(queryKeys.favoriteStatus(movieId), {
        isFavorite: !wasFavorite,
      });
      // 목록은 순서와 createdAt을 서버 기준으로 다시 받아요.
      queryClient.invalidateQueries({ queryKey: queryKeys.favoriteList });
    },
    onError: (error) => {
      alert(getApiErrorMessage(error, "즐겨찾기 변경에 실패했어요. 다시 시도해 주세요."));
      // 409/404면 화면 상태가 서버와 달라진 것이라 다시 조회해요.
      queryClient.invalidateQueries({ queryKey: queryKeys.favorites });
    },
  });
}
