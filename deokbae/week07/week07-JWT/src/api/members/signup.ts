import { apiClient } from "../api-client";
import type { ApiResponse } from "../api-response";

export interface SignUpRequest {
  email: string;
  password: string;
  nickname: string;
}

// MemberResponse의 실제 필드는 서버 파일을 확인해서 채워 주세요
export interface MemberResponse {
  id: number;
  email: string;
  nickname: string;
}

export function signup(body: SignUpRequest) {
  return apiClient
    .post("members", { json: body })
    .json<ApiResponse<MemberResponse>>();
}