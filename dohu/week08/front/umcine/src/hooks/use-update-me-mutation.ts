import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MemberInfo } from "../api/members/me";
import { updateMe } from "../api/members/update-me";
import { ME_QUERY_KEY } from "./use-me-query";

export function useUpdateMeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMe,
    onSuccess: (response) => {
      // 응답에 수정된 회원 정보가 그대로 담겨 와서 다시 조회하지 않고 캐시를 바꾼다.
      queryClient.setQueryData<MemberInfo>(ME_QUERY_KEY, response.result);
      alert("내 정보 수정에 성공했어요.");
    },
    onError: () => {
      alert("내 정보 수정에 실패했어요. 다시 시도해 주세요.");
    },
  });
}
