import { useQuery } from "@tanstack/react-query";
import { getMe } from "../api/members/me";
import { useAuthStore } from "../stores/auth-store";

export const ME_QUERY_KEY = ["members", "me"] as const;

// 헤더, 내 정보, 평점 화면이 같은 key를 써서 요청 한 번으로 함께 쓴다.
export function useMeQuery() {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: ME_QUERY_KEY,
    queryFn: getMe,
    // 토큰이 없으면 요청하지 않는다. 토큰이 유효한지는 이 요청의 401로 판단한다.
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}
