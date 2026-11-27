import { apiClient } from "../api-client";

interface SignupRequest {
  email: string;
  nickname: string;
  password: string;
}

interface SignupResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    memberId: number;
    email: string;
    nickname: string;
  };
}

// passwordConfirm은 화면에서만 검사하므로 요청에 넣지 않는다.
function signup(body: SignupRequest) {
  return apiClient.post("members", { json: body }).json<SignupResponse>();
}

export { signup, type SignupRequest, type SignupResponse };
