import type { ApiResponse } from "../api-client";
import { authApi } from "../auth-api";

export interface MyInfo {
  email: string;
  nickname: string;
  createdAt: string;
}

export type GetMyInfoResponse = ApiResponse<MyInfo>;

// 🔒 GET /members/me
export async function getMyInfo(): Promise<MyInfo> {
  const response = await authApi.get("members/me").json<GetMyInfoResponse>();
  return response.result;
}
