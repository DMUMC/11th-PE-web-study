import { useQuery } from "@tanstack/react-query";
import { getMyInfo } from "../api/members/get-my-info";
import { useAuthStore } from "../stores/auth-store";
import { queryKeys } from "./query-keys";

export function useMyInfoQuery() {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: queryKeys.myInfo,
    queryFn: getMyInfo,
    // 토큰이 있을 때만 조회
    enabled: Boolean(accessToken),
    // 내 정보는 자주 바뀌지 않아요.
    staleTime: 5 * 60 * 1000,
    // 401로 토큰을 비운 뒤 같은 요청을 재시도하지 않아요.
    retry: false,
  });
}
