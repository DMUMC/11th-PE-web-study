import { useQuery } from "@tanstack/react-query";
import { getFavorites } from "@/api/favorites/favorites";
import { useAuthStore } from "@/stores/auth-store";

export function useFavoritesQuery() {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: ["favorites"],
    queryFn: getFavorites,
    enabled: Boolean(accessToken), // 로그인했을 때만 요청
  });
}