import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMyInfo } from "../api/members/update-my-info";
import type { MyInfo } from "../api/members/get-my-info";
import { getApiErrorMessage } from "../api/api-client";
import { useAuthStore } from "../stores/auth-store";
import { queryKeys } from "./query-keys";

export function useUpdateMyInfoMutation() {
  const queryClient = useQueryClient();
  const setNickname = useAuthStore((state) => state.setNickname);

  return useMutation({
    mutationFn: updateMyInfo,
    onSuccess: (response) => {
      // 응답 result가 내 정보 조회와 같은 형태라서 캐시를 바로 덮어써요. (추가 GET 없음)
      queryClient.setQueryData<MyInfo>(queryKeys.myInfo, response.result);
      setNickname(response.result.nickname);
      alert("내 정보 수정에 성공했어요.");
    },
    onError: (error) => {
      // 다른 회원이 쓰는 닉네임이면 409 MEMBER409_1
      alert(getApiErrorMessage(error, "내 정보 수정에 실패했어요. 다시 시도해 주세요."));
    },
  });
}
