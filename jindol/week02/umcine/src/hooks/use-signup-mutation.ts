import { useMutation } from "@tanstack/react-query";
import { signup } from "../api/members/signup";

export function useSignupMutation() {
  return useMutation({
    mutationFn: signup,
    onSuccess: (response) => {
      alert(response.message);
    },
    onError: (error) => {
      alert(error instanceof Error ? error.message : "회원가입에 실패했어요. 다시 시도해 주세요.");
    },
  });
}
