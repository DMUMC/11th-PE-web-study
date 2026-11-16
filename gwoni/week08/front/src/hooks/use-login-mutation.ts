import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { login } from "../api/auth/login";
import { getApiErrorMessage } from "../api/api-client";
import { useAuthStore } from "../stores/auth-store";
import { queryKeys } from "./query-keys";

export function useLoginMutation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      setAuth(response.result.accessToken, response.result.nickname);
      alert("로그인에 성공했어요.");
      // 로그인 응답에는 내 정보 전체가 없어서 다시 조회하도록 무효화해요.
      queryClient.invalidateQueries({ queryKey: queryKeys.myInfo });
      navigate({ to: "/" });
    },
    onError: (error) => {
      // 이메일이 없거나 비밀번호가 틀리면 401 AUTH401_1
      alert(getApiErrorMessage(error, "로그인에 실패했어요. 다시 시도해 주세요."));
    },
  });
}
