import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { signup, type SignupRequest } from "../api/members/signup";

export function useSignupMutation() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (body: SignupRequest) => {
      const response = await signup(body);
      if (!response.isSuccess) throw new Error(response.message);
      return response;
    },
    onSuccess: (response) => {
      window.alert(response.message);
      void navigate({ to: "/login" });
    },
    onError: () => window.alert("회원가입에 실패했어요. 다시 시도해 주세요."),
  });
}
