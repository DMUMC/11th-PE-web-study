import { apiClient } from "../api-client";
import type { ApiResponse } from "../api-response";

export interface MemberInfo {
  nickname: string;
  email: string;
}

export function getMyInfo() {
  return apiClient.get("members/me").json<ApiResponse<MemberInfo>>();
}