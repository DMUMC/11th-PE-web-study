
import { apiClient } from "../api-client";

export interface MemberInfo {
  memberId: number;
  email: string;
  nickname: string;
}

export interface GetMyInfoResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: MemberInfo;
}

export function getMyInfo() {
  const token = localStorage.getItem("accessToken");

  return apiClient
    .get("members/me", {
      headers: {
        Authorization: `Bearer ${token ?? ""}`,
      },
    })
    .json<GetMyInfoResponse>();
}
