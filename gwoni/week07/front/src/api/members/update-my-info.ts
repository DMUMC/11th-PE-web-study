import { apiClient, type ApiResponse } from "../api-client";
import type { MyInfo } from "./get-my-info";

export interface UpdateMyInfoRequest {
  nickname: string;
}

export type UpdateMyInfoResponse = ApiResponse<MyInfo>;

// 🔒 Authorization 헤더 필요
export function updateMyInfo(body: UpdateMyInfoRequest) {
  return apiClient.patch("members/me", { json: body }).json<UpdateMyInfoResponse>();
}
