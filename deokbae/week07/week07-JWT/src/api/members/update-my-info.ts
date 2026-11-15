import { apiClient } from "../api-client";
import type { ApiResponse } from "../api-response";
import type { MemberInfo } from "./get-my-info";

export interface MemberUpdateRequest {
  nickname: string;
}

export function updateMyInfo(body: MemberUpdateRequest) {
  return apiClient
    .patch("members/me", { json: body })
    .json<ApiResponse<MemberInfo>>();
}