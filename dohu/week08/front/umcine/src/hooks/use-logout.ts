import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "../stores/auth-store";
import { ME_QUERY_KEY } from "./use-me-query";
import { FAVORITES_QUERY_KEY } from "./use-favorites";

// 로그아웃은 서버 요청이 없어 mutation 대신 토큰과 회원별 캐시를 지우는 함수로 둔다.
export function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  return () => {
    setAccessToken(null);
    queryClient.removeQueries({ queryKey: ME_QUERY_KEY });
    queryClient.removeQueries({ queryKey: FAVORITES_QUERY_KEY });
    navigate({ to: "/" });
  };
}
