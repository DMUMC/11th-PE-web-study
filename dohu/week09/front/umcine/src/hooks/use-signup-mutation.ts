import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { signup } from "../api/members/signup";

// 7주차 try 안의 성공 처리는 onSuccess로, catch 안의 실패 처리는 onError로 옮겼다.
export function useSignupMutation() {
  const router = useRouter();

  return useMutation({
    mutationFn: signup,
    onSuccess: (response) => {
      alert(response.message);
      router.push("/login");
    },
    onError: () => {
      // 입력값은 컴포넌트 state에 그대로 남아 다시 제출할 수 있다.
      alert("회원가입에 실패했어요. 다시 시도해 주세요.");
    },
  });
}
