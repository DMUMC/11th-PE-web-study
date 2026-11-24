
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { login } from "../api/members/login";
import { useAuthStore } from "../stores/auth-store";

export function useLoginMutation() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const setAccessToken = useAuthStore(
    (state) => state.setAccessToken,
  );

  return useMutation({
    mutationFn: async (body: Parameters<typeof login>[0]) => {
      const response = await login(body);

      if (!response.isSuccess) {
        throw new Error(response.message);
      }

      return response;
    },

    onSuccess: async (response) => {
      // 1. 로그인 토큰 저장
      setAccessToken(response.result.accessToken);

      // 2. 이전 회원 정보 조회 캐시 제거
      queryClient.removeQueries({
        queryKey: ["members", "me"],
      });

      // 3. 로그인 후 회원 정보 미리 조회
      await queryClient.prefetchQuery({
        queryKey: ["members", "me"],
        queryFn: async () => {
          const { getMyInfo } = await import(
            "../api/members/get-my-info"
          );

          return getMyInfo();
        },
      });

      // 4. 마이페이지 이동
      await navigate({
        to: "/members/me",
      });
    },
  });
}
