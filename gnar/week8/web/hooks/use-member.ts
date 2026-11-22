import { useQuery } from "@tanstack/react-query";
import { getMe } from "../api/cinema-api";
import { useAuthStore } from "../stores/auth-store";

export const memberKey = (token: string | null) => ["session", token, "members", "me"] as const;
export const favoritesKey = (token: string) => ["session", token, "favorites"] as const;

export function useMember() {
  const token = useAuthStore((state) => state.accessToken);
  return useQuery({
    queryKey: memberKey(token),
    queryFn: ({ signal }) => getMe(token!, signal),
    enabled: Boolean(token),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}
