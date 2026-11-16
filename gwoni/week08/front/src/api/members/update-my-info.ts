import type { ApiResponse } from "../api-client";
import { authApi } from "../auth-api";
import type { MyInfo } from "./get-my-info";

export interface UpdateMyInfoRequest {
  nickname: string;
}

export type UpdateMyInfoResponse = ApiResponse<MyInfo>;

// 🔒 PATCH /members/me
export function updateMyInfo(body: UpdateMyInfoRequest) {
  return authApi.patch("members/me", { json: body }).json<UpdateMyInfoResponse>();
}
