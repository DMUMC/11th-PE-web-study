import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  addFavorite,
  getFavorites,
  getFavoriteStatus,
  removeFavorite,
} from "../api/favorites/favorites";
import { useAuthStore } from "../stores/auth-store";

// 목록은 ["favorites"], 영화별 여부는 ["favorites", movieId]라서
// ["favorites"] 하나만 무효화하면 두 캐시가 함께 다시 조회된다.
export const FAVORITES_QUERY_KEY = ["favorites"] as const;

export function useFavoritesQuery() {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: FAVORITES_QUERY_KEY,
    queryFn: getFavorites,
    enabled: Boolean(accessToken),
  });
}

export function useFavoriteStatusQuery(movieId: number) {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: [...FAVORITES_QUERY_KEY, movieId],
    queryFn: () => getFavoriteStatus(movieId),
    enabled: Boolean(accessToken),
  });
}

interface ToggleFavoriteVariables {
  movieId: number;
  isFavorite: boolean;
}

export function useToggleFavoriteMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);

  const mutation = useMutation({
    mutationFn: async ({ movieId, isFavorite }: ToggleFavoriteVariables) => {
      if (isFavorite) {
        await removeFavorite(movieId);
      } else {
        await addFavorite(movieId);
      }
    },
    onSuccess: () => {
      // 추가와 해제 응답만으로는 목록 순서와 다른 화면의 상태를 알 수 없어 다시 조회한다.
      queryClient.invalidateQueries({ queryKey: FAVORITES_QUERY_KEY });
    },
    onError: () => {
      alert("즐겨찾기를 바꾸지 못했어요. 다시 시도해 주세요.");
    },
  });

  function toggle(variables: ToggleFavoriteVariables) {
    if (!accessToken) {
      alert("로그인하면 즐겨찾기를 사용할 수 있어요.");
      router.push("/login");
      return;
    }
    if (mutation.isPending) return;
    mutation.mutate(variables);
  }

  return { toggle, isPending: mutation.isPending };
}
