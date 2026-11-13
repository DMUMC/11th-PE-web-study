import { apiClient, type ApiResponse } from "../api-client";

export interface MyInfo {
  email: string;
  nickname: string;
  createdAt: string;
}

export type GetMyInfoResponse = ApiResponse<MyInfo>;

// 🔒 Authorization 헤더 필요
export function getMyInfo() {
  return apiClient.get("members/me").json<GetMyInfoResponse>();
}
